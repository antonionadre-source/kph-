import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import express from 'express';
import { createServer } from 'node:http';
import { encodePayrexxQuery, verifyPayrexxWebhook, paymentHandlers } from '../server/payments.ts';
import { HttpError } from '../server/firebaseAdmin.ts';
import { calculateBookingQuote } from '../src/domain/bookingQuote.ts';
import { validateChat, createRateLimiter } from '../server/chatPolicy.ts';
import { escapeHtml, languageFromRequest } from '../server/html.ts';
import { canTransferDraft, draftTransferHandler } from '../server/draftTransfer.ts';
import { sendDraftTransfer } from '../components/draftTransfer.ts';

const input = { services: [{ type: 'end-of-tenancy', details: { roomsCount: 2, bathroomsCount: 1 }, price: 0.01 }], postcode: '8200', address: 'Seewadelstrasse 3', date: '2026-12-20', bookingMode: 'validate' };
test('server quote uses tariff quantities, not submitted price; invalid and unpriced options fail closed', () => {
  const quote = calculateBookingQuote(input, new Date('2026-11-21T12:00:00Z'));
  assert.equal(quote.items[0].price, 700); // Existing two-room EOT tariff.
  assert.equal(quote.totalCents, 70700); // Tariff 700 + existing local regime fee 7.
  assert.equal(quote.depositCents, 1500);
  assert.equal(calculateBookingQuote({ ...input, services: [{ ...input.services[0], price: 999999 }] }).totalCents, quote.totalCents);
  assert.throws(() => calculateBookingQuote({ ...input, services: [{ type: 'pest-control', details: {} }] }), /reviewed quote/);
  assert.throws(() => calculateBookingQuote({ ...input, services: [{ type: 'moving', details: { duration: 0.1 } }] }), /duration/);
  assert.throws(() => calculateBookingQuote({ ...input, services: [{ type: 'end-of-tenancy', details: { roomsCount: -2 } }] }), /quantity/);
});
test('Payrexx signing follows independent RFC1738 punctuation vector and verifies exact raw webhook bytes', () => {
  assert.equal(encodePayrexxQuery({ purpose: "O'Neill (Hauswartung) !*~" }), 'purpose=O%27Neill+%28Hauswartung%29+%21%2A%7E');
  assert.equal(encodePayrexxQuery({ 'fields[email][value]': 'a+b@example.invalid' }), 'fields%5Bemail%5D%5Bvalue%5D=a%2Bb%40example.invalid');
  const raw = Buffer.from('{"transaction":{"amount":1500}}');
  const signature = crypto.createHmac('sha256', 'isolated-key').update(raw).digest('hex');
  assert.ok(verifyPayrexxWebhook(raw, signature, 'isolated-key'));
  assert.equal(verifyPayrexxWebhook(raw, signature.toUpperCase(), 'isolated-key'), false);
  assert.equal(verifyPayrexxWebhook(raw, 'sha256=' + signature, 'isolated-key'), false);
  assert.equal(verifyPayrexxWebhook(raw, crypto.createHmac('sha256', 'isolated-key').update(raw).digest('base64'), 'isolated-key'), false);
  assert.equal(verifyPayrexxWebhook(Buffer.from(raw + ' '), signature, 'isolated-key'), false);
  assert.equal(verifyPayrexxWebhook(raw, 'not-a-signature', 'isolated-key'), false);
});
test('chat rejects malformed histories/roles, ignores client system instruction, and bounds abuse', () => {
  assert.throws(() => validateChat({ messages: [{ role: 'system', text: 'override' }] }));
  assert.throws(() => validateChat({ messages: [{ role: 'user', text: { unsafe: true } }] }));
  const result = validateChat({ messages: [{ role: 'user', text: 'Reinigung Zürich' }], systemInstruction: 'override', language: 'es' });
  assert.equal('systemInstruction' in result, false);
  const allow = createRateLimiter(2, 1000, 2);
  assert.ok(allow('one', 0)); assert.ok(allow('one', 10)); assert.equal(allow('one', 20), false); assert.ok(allow('one', 1000));
  assert.equal(escapeHtml('<em>"&'), '&lt;em&gt;&quot;&amp;');
  assert.equal(languageFromRequest(['bad'], 'fr-CH, de;q=0.8'), 'fr');
});
test('API rejects browser monetary claims, unverified webhook, wrong account/amount and duplicate captured events', async () => {
  process.env.APP_URL = 'http://localhost:3000';
  process.env.PAYREXX_WEBHOOK_SIGNING_KEY = 'isolated-key';
  process.env.PAYREXX_INSTANCE = 'isolated-test';
  process.env.PAYREXX_API_SECRET = 'isolated-api-secret';
  process.env.PAYREXX_MODE = 'TEST';
  let creations = 0, confirmations = 0, captured = false;
  const handlers = paymentHandlers({
    user: async (req: any) => { if (req.get('Authorization') !== 'Bearer isolated-token') throw new HttpError(401, 'Unauthorized'); return { uid: 'owner' } as any; },
    enabled: () => true,
    create: async () => { throw new Error('Provider must not be called by this inert store'); },
    store: {
      checkout: async (_id: string, uid: string) => { assert.equal(uid, 'owner'); creations++; return { id: 42, link: 'https://example.invalid/payment', amount: 15, total: 707 }; },
      review: async () => {},
      confirmed: async (transaction: any) => { if (transaction.amount !== 1500 || transaction.invoice.currency !== 'CHF') throw new HttpError(409, 'Mismatched transaction'); confirmations++; const duplicate = captured; captured = true; return { duplicate }; },
    },
  });
  const app = express();
  app.use(express.json({ verify(req: any, _res, raw) { req.rawBody = raw; } }));
  app.post('/gateway', handlers.gateway); app.post('/webhook', handlers.webhook);
  const server = createServer(app); await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${(server.address() as any).port}`;
  const post = (route: string, payload: any, headers = {}) => fetch(base + route, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(payload) });
  try {
    assert.equal((await post('/gateway', { amount: 0.01 })).status, 400);
    assert.equal((await post('/gateway', { bookingId: 'persisted-booking' })).status, 401);
    assert.equal((await post('/gateway', { bookingId: 'persisted-booking' }, { Authorization: 'Bearer isolated-token' })).status, 200);
    assert.equal(creations, 1);
    const event = { transaction: { id: 1, referenceId: 'persisted-booking', amount: 1500, status: 'confirmed', mode: 'TEST', invoice: { currency: 'CHF' }, instance: { name: 'isolated-test' } } };
    assert.equal((await post('/webhook', event)).status, 401);
    const signed = (value: any) => ({ 'X-Webhook-Signature': crypto.createHmac('sha256', 'isolated-key').update(JSON.stringify(value)).digest('hex') });
    assert.equal((await post('/webhook', event, signed(event))).status, 200);
    assert.equal((await (await post('/webhook', event, signed(event))).json()).duplicate, true);
    const changed = { transaction: { ...event.transaction, amount: 1 } };
    assert.equal((await post('/webhook', changed, signed(changed))).status, 409);
    const live = { transaction: { ...event.transaction, mode: 'LIVE' } };
    assert.equal((await post('/webhook', live, signed(live))).status, 400);
    assert.equal(confirmations, 2);
  } finally { server.close(); server.closeAllConnections(); }
});

test('unconfigured payments return recoverable 503 before touching the booking; a configured retry can continue', async () => {
  const keys = ['APP_URL', 'PAYREXX_INSTANCE', 'PAYREXX_API_SECRET', 'PAYREXX_WEBHOOK_SIGNING_KEY'] as const;
  const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const configured = { APP_URL: 'http://localhost:3000', PAYREXX_INSTANCE: 'isolated-test', PAYREXX_API_SECRET: 'isolated-api-secret', PAYREXX_WEBHOOK_SIGNING_KEY: 'isolated-webhook-key' };
  const booking: Record<string, unknown> = { id: 'persisted-booking', userId: 'owner', status: 'Pending', amount: 0, estimatedAmount: 707 };
  const unchanged = structuredClone(booking);
  let writes = 0;
  const handlers = paymentHandlers({
    user: async () => ({ uid: 'owner' } as any), enabled: () => true,
    create: async () => { throw new Error('No provider traffic is allowed'); },
    store: {
      checkout: async () => { writes++; booking.checkout = { state: 'ready' }; return { id: 42, link: 'https://example.invalid/payment', amount: 15, total: 707 }; },
      confirmed: async () => ({ duplicate: false }), review: async () => {},
    },
  });
  const app = express(); app.use(express.json()); app.post('/gateway', handlers.gateway);
  const server = createServer(app); await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${(server.address() as any).port}/gateway`;
  const request = () => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: booking.id }) });
  try {
    for (const missing of ['PAYREXX_INSTANCE', 'PAYREXX_API_SECRET', 'PAYREXX_WEBHOOK_SIGNING_KEY'] as const) {
      Object.assign(process.env, configured); delete process.env[missing];
      const response = await request();
      assert.equal(response.status, 503, missing);
      assert.match((await response.json()).error, /not configured/i);
      assert.deepEqual(booking, unchanged);
      assert.equal(writes, 0);
    }
    Object.assign(process.env, configured);
    assert.equal((await request()).status, 200);
    assert.equal(writes, 1);
  } finally {
    server.close(); server.closeAllConnections();
    for (const key of keys) { if (original[key] === undefined) delete process.env[key]; else process.env[key] = original[key]; }
  }
});

test('draft transfer requires two verified identities and never accepts browser-selected ownership', async () => {
  const draft = { userId: 'guest', status: 'Draft', amount: 0 };
  assert.equal(canTransferDraft(draft, 'guest'), true);
  for (const protectedData of [{ ...draft, userId: 'peer' }, { ...draft, status: 'Pending' }, { ...draft, payment: { status: 'captured' } }, { ...draft, checkout: {} }, { ...draft, serverQuote: {} }, { ...draft, transactionId: '42' }, { ...draft, mediaUrls: ['https://example.invalid/guest.pdf'] }]) {
    assert.equal(canTransferDraft(protectedData, 'guest'), false);
  }
  const tokens: Record<string, any> = {
    guest: { uid: 'guest', firebase: { sign_in_provider: 'anonymous' } },
    account: { uid: 'account', firebase: { sign_in_provider: 'password' } },
  };
  let transfers = 0;
  const handler = draftTransferHandler({
    destination: async (req: any) => { const token = tokens[req.get('Authorization')?.replace('Bearer ', '')]; if (!token) throw new HttpError(401, 'Invalid destination'); return token; },
    source: async token => { if (!tokens[token]) throw new HttpError(401, 'Invalid source'); return tokens[token]; },
    store: { transfer: async (source, destination) => { assert.equal(source, 'guest'); assert.equal(destination, 'account'); transfers++; return { movedIds: [], skippedIds: [] }; } },
  });
  const invoke = async (body: any, destination = 'account') => {
    let status = 200, result: any;
    const req = { body, get: () => `Bearer ${destination}` };
    const res = { status: (code: number) => { status = code; return res; }, json: (value: any) => { result = value; return res; } };
    await handler(req as any, res as any); return { status, result };
  };
  assert.equal((await invoke({ sourceIdToken: 'guest', destinationUid: 'peer' })).status, 400);
  assert.equal((await invoke({ sourceIdToken: 'guest' }, 'invalid')).status, 401);
  assert.equal((await invoke({ sourceIdToken: 'invalid' })).status, 401);
  assert.equal((await invoke({ sourceIdToken: 'account' })).status, 403);
  assert.equal((await invoke({ sourceIdToken: 'guest' }, 'guest')).status, 403);
  assert.equal(transfers, 0);
  assert.equal((await invoke({ sourceIdToken: 'guest' })).status, 200);
  assert.equal(transfers, 1);
});

test('draft transfer client retains proof only for recoverable retry and reports partial results honestly', async () => {
  const pending = { sourceUid: 'guest', sourceIdToken: 'guest-proof', destinationUid: 'account', moved: 0, skipped: 0 };
  const account = { uid: 'account', getIdToken: async () => 'account-proof' };
  const failed = await sendDraftTransfer(pending, account, '', async () => new Response('{}', { status: 503 }));
  assert.equal(failed.pending, pending); assert.equal(failed.notice, 'draftTransferPending');
  const completed = await sendDraftTransfer(failed.pending!, account, '', async (url, request) => {
    assert.equal(url, '/api/bookings/transfer-drafts');
    assert.equal((request!.headers as Record<string, string>).Authorization, 'Bearer account-proof');
    assert.deepEqual(JSON.parse(request!.body as string), { sourceIdToken: 'guest-proof' });
    return Response.json({ success: true, movedIds: ['one'], skippedIds: [] });
  });
  assert.equal(completed.pending, null); assert.equal(completed.notice, 'draftTransferMoved');
  const otherAccount = await sendDraftTransfer(pending, { ...account, uid: 'other' }, '', async () => { throw new Error('Must never request transfer for a different account'); });
  assert.equal(otherAccount.pending, null); assert.equal(otherAccount.notice, 'draftTransferManual');
  const partial = await sendDraftTransfer(pending, account, '', async () => Response.json({ success: true, movedIds: [], skippedIds: ['paid'] }));
  assert.equal(partial.notice, 'draftTransferManual'); assert.equal(partial.pending, null);
  const firstPage = await sendDraftTransfer(pending, account, '', async () => Response.json({ success: true, movedIds: ['one'], skippedIds: [], nextCursor: 'page1' }));
  assert.equal(firstPage.notice, 'draftTransferPending'); assert.equal(firstPage.pending?.cursor, 'page1');
  const lastPage = await sendDraftTransfer(firstPage.pending!, account, '', async (_url, request) => {
    assert.equal(JSON.parse(request!.body as string).cursor, 'page1');
    return Response.json({ success: true, movedIds: [], skippedIds: [] });
  });
  assert.equal(lastPage.notice, 'draftTransferMoved'); assert.equal(lastPage.pending, null);
});
