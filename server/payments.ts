import crypto from 'node:crypto';
import axios from 'axios';
import type { Request, Response } from 'express';
import { calculateBookingQuote, QuoteValidationError } from '../src/domain/bookingQuote.ts';
import { adminServices, authenticatedUser, HttpError } from './firebaseAdmin.ts';

export function encodePayrexxQuery(fields: Record<string, string>, spaces = '+') {
  const encode = (value: string) => encodeURIComponent(value).replace(/[!'()*~]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`).replace(/%20/g, spaces);
  return Object.entries(fields).map(([key, value]) => `${encode(key)}=${encode(value)}`).join('&');
}
export function verifyPayrexxWebhook(raw: Buffer, signature: string, key: string) {
  const bytes = /^[a-f\d]{64}$/.test(signature) ? Buffer.from(signature, 'hex') : Buffer.alloc(0);
  const expected = crypto.createHmac('sha256', key).update(raw).digest();
  return bytes.length === expected.length && crypto.timingSafeEqual(bytes, expected);
}
export function externalPaymentsEnabled() {
  return process.env.VERCEL_ENV !== 'preview' && process.env.ALLOW_EXTERNAL_INTEGRATIONS === 'true';
}
function appBaseUrl() {
  if (!process.env.APP_URL) throw new HttpError(503, 'The application return URL is not configured.');
  const url = new URL(process.env.APP_URL);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) throw new HttpError(503, 'The application return URL must use HTTPS.');
  return url.origin;
}
function assertPaymentConfiguration() {
  if (!process.env.PAYREXX_INSTANCE || !process.env.PAYREXX_API_SECRET || !process.env.PAYREXX_WEBHOOK_SIGNING_KEY) {
    throw new HttpError(503, 'Payments are not configured. Please try again later or contact Kraken.');
  }
}
export async function payrexxGateway(fields: Record<string, string>) {
  const instance = process.env.PAYREXX_INSTANCE, secret = process.env.PAYREXX_API_SECRET;
  if (!instance || !secret) throw new HttpError(503, 'Payment gateway is not configured.');
  const signature = crypto.createHmac('sha256', secret).update(encodePayrexxQuery(fields)).digest('base64');
  const response = await axios.post(`https://api.payrexx.com/v1.0/Gateway/?instance=${encodeURIComponent(instance)}`, `${encodePayrexxQuery(fields, '%20')}&ApiSignature=${encodeURIComponent(signature)}`, { timeout: 15000, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  const gateway = response.data?.status === 'success' ? response.data.data?.[0] : null;
  if (!Number.isSafeInteger(gateway?.id) || !gateway?.link || new URL(gateway.link).protocol !== 'https:') throw new HttpError(502, 'Payment provider returned an invalid gateway.');
  return { id: gateway.id as number, link: gateway.link as string };
}
export class FirebasePaymentStore {
  async checkout(id: string, uid: string, create: typeof payrexxGateway, baseUrl: string) {
    const { db, timestamp } = adminServices();
    const ref = db.collection('maintenance_requests').doc(id);
    const nonce = crypto.randomUUID();
    const reserved = await db.runTransaction(async tx => {
      const snap = await tx.get(ref); const booking = snap.data();
      if (!booking || booking.userId !== uid) throw new HttpError(404, 'Booking not found.');
      if (booking.payment?.status === 'captured') throw new HttpError(409, 'This booking has already been paid.');
      if (booking.payment?.gatewayId && booking.payment?.link) return { existing: { id: booking.payment.gatewayId, link: booking.payment.link, amount: booking.payment.amountDue, total: booking.amount } };
      if (booking.checkout?.state) throw new HttpError(409, 'A payment request already exists or needs review. Please contact Kraken.');
      if (!['Draft', 'Pending'].includes(booking.status)) throw new HttpError(409, 'Booking cannot be checked out in its current state.');
      const quote = calculateBookingQuote({ services: booking.services, postcode: booking.postcode, address: booking.address, date: booking.date, bookingMode: booking.bookingMode });
      if (quote.provisional && booking.bookingMode === 'direct') throw new HttpError(422, 'This estimate needs review. Choose the detailed quote option or contact Kraken.');
      tx.update(ref, { amount: quote.totalCents / 100, status: 'Pending', serverQuote: quote, checkout: { state: 'creating', nonce }, updatedAt: timestamp() });
      return { booking, quote };
    });
    if ('existing' in reserved) return reserved.existing;
    try {
      const gateway = await create({ amount: String(reserved.quote.depositCents), currency: 'CHF', referenceId: id, purpose: 'Kraken PFM booking', successRedirectUrl: `${baseUrl}/quote?payment=success&booking=${id}`, failedRedirectUrl: `${baseUrl}/quote?payment=failed&booking=${id}`, cancelRedirectUrl: `${baseUrl}/quote?payment=cancelled&booking=${id}` });
      await db.runTransaction(async tx => {
        const current = (await tx.get(ref)).data();
        if (current?.checkout?.nonce !== nonce) throw new HttpError(409, 'Booking changed while opening payment.');
        tx.update(ref, { payment: { status: 'pending', verified: false, gateway: 'payrexx', gatewayId: gateway.id, link: gateway.link, amountCharged: 0, amountDue: reserved.quote.depositCents / 100, currency: 'CHF' }, checkout: { state: 'ready', nonce }, updatedAt: timestamp() });
      });
      return { ...gateway, amount: reserved.quote.depositCents / 100, total: reserved.quote.totalCents / 100 };
    } catch (error) {
      await ref.update({ checkout: { state: 'review_required', nonce }, updatedAt: timestamp() }).catch(() => {});
      throw error;
    }
  }
  async review(transaction: any) {
    const { db, timestamp } = adminServices();
    const id = transaction.referenceId || transaction.invoice?.referenceId;
    if (typeof id !== 'string' || !/^[A-Za-z\d_-]{1,128}$/.test(id)) throw new HttpError(400, 'Unknown booking reference.');
    const ref = db.collection('maintenance_requests').doc(id);
    await db.runTransaction(async tx => {
      const booking = (await tx.get(ref)).data();
      if (!booking?.payment?.gatewayId) throw new HttpError(404, 'Booking has no payment gateway.');
      // Reversals are logged for reconciliation; never treat a disputed payment as verified.
      tx.update(ref, { payment: { ...booking.payment, verified: false, providerStatus: transaction.status, reconciliationRequired: true }, updatedAt: timestamp() });
      tx.set(db.collection('payment_events').doc(`${transaction.id}-${transaction.status}`), { bookingId: id, status: transaction.status, reviewRequired: true, receivedAt: timestamp() });
    });
  }
  async confirmed(transaction: any) {
    const { db, timestamp } = adminServices();
    const id = transaction.referenceId || transaction.invoice?.referenceId;
    if (typeof id !== 'string' || !/^[A-Za-z\d_-]{1,128}$/.test(id)) throw new HttpError(400, 'Unknown booking reference.');
    const ref = db.collection('maintenance_requests').doc(id);
    return db.runTransaction(async tx => {
      const booking = (await tx.get(ref)).data();
      if (!booking?.payment?.gatewayId || !booking.serverQuote) throw new HttpError(404, 'No pending gateway matches this booking.');
      if (!Number.isSafeInteger(transaction.id) || transaction.id <= 0 || transaction.amount !== booking.serverQuote.depositCents || transaction.invoice?.currency !== 'CHF') throw new HttpError(409, 'Transaction does not match the quoted amount and currency.');
      if (booking.payment.status === 'captured') {
        if (booking.payment.transactionId === String(transaction.id)) return { duplicate: true };
        throw new HttpError(409, 'Booking already has another confirmed transaction.');
      }
      const eventRef = db.collection('payment_events').doc(String(transaction.id));
      tx.set(eventRef, { bookingId: id, amountCents: transaction.amount, currency: 'CHF', status: 'confirmed', verifiedAt: timestamp() });
      tx.update(ref, { payment: { ...booking.payment, status: 'captured', verified: true, transactionId: String(transaction.id), amountCharged: transaction.amount / 100, verifiedAt: timestamp() }, updatedAt: timestamp() });
      return { duplicate: false };
    });
  }
}
export function paymentHandlers(deps = { user: authenticatedUser, store: new FirebasePaymentStore(), create: payrexxGateway, enabled: externalPaymentsEnabled }) {
  const errorResponse = (res: Response, error: unknown) => {
    if (error instanceof HttpError) return res.status(error.status).json({ success: false, error: error.message });
    if (error instanceof QuoteValidationError) return res.status(422).json({ success: false, error: error.message });
    console.error('Payment processing failed.'); return res.status(502).json({ success: false, error: 'Payment could not be processed. Your booking remains pending; please contact Kraken before retrying.' });
  };
  return {
    gateway: async (req: Request, res: Response) => {
      try {
        if (!deps.enabled()) throw new HttpError(503, 'External payments are disabled in this environment.');
        const id = req.body?.bookingId;
        if (typeof id !== 'string' || !/^[A-Za-z\d_-]{1,128}$/.test(id) || Object.keys(req.body).some(key => key !== 'bookingId')) throw new HttpError(400, 'A persisted bookingId is required; browser payment amounts are not accepted.');
        const user = await deps.user(req);
        // A missing provider or webhook key is a recoverable setup error, not
        // an uncertain provider response: do not lock or reprice the booking.
        assertPaymentConfiguration();
        const result = await deps.store.checkout(id, user.uid, deps.create, appBaseUrl());
        return res.json({ success: true, ...result });
      } catch (error) { return errorResponse(res, error); }
    },
    webhook: async (req: Request & { rawBody?: Buffer }, res: Response) => {
      try {
        if (!deps.enabled()) throw new HttpError(503, 'External payments are disabled in this environment.');
        const key = process.env.PAYREXX_WEBHOOK_SIGNING_KEY;
        if (!key) throw new HttpError(503, 'Webhook verification is not configured.');
        if (!req.rawBody || !verifyPayrexxWebhook(req.rawBody, req.get('X-Webhook-Signature') || '', key)) throw new HttpError(401, 'Invalid webhook signature.');
        const transaction = req.body?.transaction;
        if (!transaction || !Number.isSafeInteger(transaction.id) || transaction.id <= 0 || transaction.invoice?.currency !== 'CHF' || transaction.instance?.name !== process.env.PAYREXX_INSTANCE || transaction.mode !== (process.env.PAYREXX_MODE || 'TEST')) throw new HttpError(400, 'Unexpected payment account or mode.');
        if (transaction.status !== 'confirmed') {
          if (['refunded', 'partially-refunded', 'refund_pending', 'chargeback', 'disputed'].includes(transaction.status)) await deps.store.review(transaction);
          return res.status(202).json({ accepted: true, action: 'manual_review', status: String(transaction.status || 'unknown') });
        }
        return res.json({ success: true, ...await deps.store.confirmed(transaction) });
      } catch (error) { return errorResponse(res, error); }
    },
  };
}
