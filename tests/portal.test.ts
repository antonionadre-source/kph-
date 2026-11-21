import { test } from 'node:test';
import assert from 'node:assert/strict';
import { portalIdentity, finishRegistration, createOrLinkAccount, withPortalTimeout } from '../components/portalIdentity.ts';
import { portalQueryPlan, portalAmount, mergePortalRecords } from '../components/portalRecords.ts';
import { renderInvoiceSummary } from '../components/invoiceDocument.ts';
import { createCalendarDraft, foldCalendarLine } from '../components/calendarUtils.ts';
import { portalText } from '../components/portalText.ts';
import { detailAccessText, detailEvidence, detailText } from '../components/detailPresentation.ts';

const identity = { uid: 'customer-1', email: 'kai@krakenpfm.ch', emailVerified: true };
test('staff requires an administrative boolean claim and verified email, never a company email', () => {
  assert.equal(portalIdentity(identity).isStaff, false);
  assert.equal(portalIdentity(identity, { staff: 'true', email_verified: true }).isStaff, false);
  assert.equal(portalIdentity(identity, { staff: true }).isStaff, false);
  assert.equal(portalIdentity({ ...identity, emailVerified: false }, { staff: true, email_verified: true }).isStaff, false);
  assert.equal(portalIdentity({ ...identity, email: 'authorized@example.test' }, { staff: true, email_verified: true }).isStaff, true);
});
test('a failed profile can be retried without creating a second account', async () => {
  let creations = 0; let profileWrites = 0;
  const createAccount = async () => { creations++; return identity; };
  const first = await finishRegistration({ createAccount, saveProfile: async () => { profileWrites++; throw new Error('offline'); } });
  assert.equal(first.account.uid, identity.uid);
  assert.equal(first.profileSaved, false);
  const second = await finishRegistration({ existingAccount: first.account, createAccount, saveProfile: async () => { profileWrites++; } });
  assert.equal(second.profileSaved, true);
  assert.equal(creations, 1); assert.equal(profileWrites, 2);
});
test('optional notification failure does not turn a saved registration into a failed signup', async () => {
  const result = await finishRegistration({ createAccount: async () => identity, saveProfile: async () => {}, notify: async () => { throw new Error('EmailJS unavailable'); } });
  assert.equal(result.profileSaved, true);
  assert.equal(result.notificationSent, false);
  assert.ok(result.error);
});
test('failed account creation does not write a profile or send notifications', async () => {
  let effects = 0;
  await assert.rejects(finishRegistration({ createAccount: async () => { throw new Error('invalid credentials'); }, saveProfile: async () => { effects++; }, notify: async () => { effects++; } }));
  assert.equal(effects, 0);
});
test('bounded operations time out and preserve errors from the provider', async () => {
  await assert.rejects(withPortalTimeout(new Promise(() => {}), 5), /timeout/);
  await assert.rejects(withPortalTimeout(Promise.reject(new Error('permission-denied'))), /permission-denied/);
});
test('client queries are owner-filtered, status-filtered and bounded; contacts are staff-only', () => {
  assert.deepEqual(portalQueryPlan('maintenance_requests', 'customer-1', false, 'Pending'), {
    collection: 'maintenance_requests', filters: [['userId', 'customer-1'], ['status', 'Pending']], orderBy: ['createdAt', 'desc'], limit: 25,
  });
  assert.deepEqual(portalQueryPlan('job_applications', 'customer-1', false).filters, [['userId', 'customer-1']]);
  assert.throws(() => portalQueryPlan('contact_messages', 'customer-1', false), /forbidden/);
  assert.throws(() => portalQueryPlan('maintenance_requests', '', true), /forbidden/);
  assert.deepEqual(portalQueryPlan('contact_messages', 'staff-1', true, 'new').filters, [['status', 'new']]);
});
test('pagination merges repeated snapshots by document ID', () => {
  assert.deepEqual(mergePortalRecords([{ id: 'a', value: 1 }], [{ id: 'a', value: 2 }, { id: 'b', value: 3 }]), [{ id: 'a', value: 2 }, { id: 'b', value: 3 }]);
});
test('invoice summaries escape every external field and never invent fiscal or payment evidence', () => {
  const html = renderInvoiceSummary({ id: '<script>id</script>', client: '<img src=x onerror=alert(1)>', email: 'a&b@example.test', address: '"<em>Address</em>"', service: '<svg onload=alert(2)>', date: '<b>Date</b>', amount: 0 }, 'es');
  assert.ok(!html.includes('<script>id'));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(!html.includes('<svg onload'));
  assert.match(html, /&lt;img/);
  assert.match(html, /a&amp;b@example/);
  assert.match(html, /no es una factura fiscal ni un justificante/);
  assert.doesNotMatch(html, /CHE-109|Bahnhofstrasse 42|IBAN|paid_via_gateway|4242/);
  assert.match(html, /default-src 'none'/);
});
test('calendar export requires a real valid date and rejects invalid times', () => {
  for (const date of ['', 'not-a-date', '2026-02-30']) assert.throws(() => createCalendarDraft({ id: 'a', service: 'Cleaning', client: 'Client', date }), /date-required/);
  assert.throws(() => createCalendarDraft({ service: 'Cleaning', client: 'Client', date: '2026-11-21', time: '25:99' }), /invalid-time/);
});
test('calendar drafts preserve Zurich wall time in winter and summer without inventing attendees', () => {
  for (const date of ['2026-01-15', '2026-07-15']) {
    const draft = createCalendarDraft({ id: 'request-1', service: 'Cleaning', client: 'Client', date, scheduling: { specificTime: '09:30', estimatedDurationHours: 2 } });
    assert.match(draft.icsData, new RegExp('DTSTART;TZID=Europe/Zurich:' + date.replaceAll('-', '') + 'T093000'));
    assert.match(draft.icsData, /DURATION:PT120M/);
    assert.match(draft.icsData, /STATUS:TENTATIVE/);
    assert.doesNotMatch(draft.icsData, /ATTENDEE|ORGANIZER|METHOD:REQUEST/);
  }
});
test('calendar with no time is an all-day draft and untrusted text cannot add properties', () => {
  const draft = createCalendarDraft({ id: 'safe', date: '2026-11-21', service: 'Cleaning\r\nATTENDEE:evil', client: 'Name, Other; Test', address: 'Street\nBEGIN:VEVENT' });
  assert.match(draft.icsData, /DTSTART;VALUE=DATE:20261121/);
  assert.equal(draft.icsData.split('\r\nBEGIN:VEVENT').length - 1, 1);
  assert.ok(!draft.icsData.includes('\r\nATTENDEE:'));
  assert.ok(!draft.icsData.includes('T090000'));
});
test('long Unicode calendar lines are folded at at most 75 UTF-8 octets', () => {
  const lines = foldCalendarLine('SUMMARY:' + 'é🐙'.repeat(100)).split('\r\n');
  assert.ok(lines.every(line => new TextEncoder().encode(line).length <= 75));
  assert.equal(lines.join('').replace(/ /g, ''), 'SUMMARY:' + 'é🐙'.repeat(100));
});
test('new account and portal recovery messages exist in all six languages', () => {
  for (const language of ['de', 'en', 'fr', 'it', 'es', 'pt']) for (const key of ['signIn', 'resetSent', 'verifyHint', 'profilePending', 'draftInvoice', 'calendarDraft', 'loadError'] as const) {
    assert.ok(portalText(language, key).length > 0);
  }
});

test('guest registration links the original UID and never creates another user after a link conflict', async () => {
  let creates = 0; let links = 0;
  const create = async () => { creates++; return { uid: 'new' }; };
  const linked = await createOrLinkAccount({ isAnonymous: true }, async () => { links++; return { uid: 'guest-existing' }; }, create);
  assert.equal(linked.uid, 'guest-existing');
  await assert.rejects(createOrLinkAccount({ isAnonymous: true }, async () => { links++; throw new Error('auth/credential-already-in-use'); }, create), /already-in-use/);
  assert.equal(creates, 0); assert.equal(links, 2);
  assert.equal((await createOrLinkAccount(null, async () => { throw new Error('must not link'); }, create)).uid, 'new');
});
test('guest estimates are distinct from backend quotes and unknown prices stay unknown', () => {
  assert.deepEqual(portalAmount({ amount: 0, estimatedAmount: 707 }), { value: 707, confirmed: false });
  assert.deepEqual(portalAmount({ amount: 0, estimatedAmount: 707, serverQuote: { totalCents: 71235 } }), { value: 712.35, confirmed: true });
  assert.deepEqual(portalAmount({ amount: 0 }), { value: undefined, confirmed: false });
  assert.deepEqual(portalAmount({ amount: 120 }), { value: 120, confirmed: false });
  assert.deepEqual(portalAmount({ estimatedAmount: NaN, serverQuote: { totalCents: '71235' } }), { value: undefined, confirmed: false });
  const html = renderInvoiceSummary({ id: 'estimate', client: 'Client', service: 'Cleaning', amount: 0, estimatedAmount: 707 }, 'es');
  assert.match(html, /Estimación/); assert.match(html, /707/); assert.doesNotMatch(html, /Presupuesto del servidor/);
});

test('a minimal pending request has no invented price, deposit, payment, surcharge or delete action', () => {
  const evidence = detailEvidence({ userId: 'owner', status: 'Pending', amount: 0 }, 'owner');
  assert.equal(evidence.financial.value, undefined);
  assert.equal(evidence.deposit, undefined);
  assert.equal(evidence.verifiedPayment, false);
  assert.equal(evidence.surchargePercent, undefined);
  assert.equal(evidence.canDeleteDraft, false);
  assert.equal(detailAccessText(undefined, 'es'), 'No especificado');
  assert.equal(detailAccessText('Custom access instructions', 'es'), 'Custom access instructions');
  for (const language of ['de', 'en', 'fr', 'it', 'es', 'pt']) assert.ok(detailText(language, 'unknownAccess'));
});
test('only real server quote and verified transaction evidence supports financial detail', () => {
  const quoted = detailEvidence({ amount: 0, estimatedAmount: 700, serverQuote: { totalCents: 71235, depositCents: 10685 } });
  assert.equal(quoted.financial.value, 712.35); assert.equal(quoted.deposit, 106.85);
  assert.equal(detailEvidence({ amount: 700, payment: { amountCharged: 100, verified: false, status: 'captured', transactionId: 'fake' } }).verifiedPayment, false);
  assert.equal(detailEvidence({ serverQuote: { totalCents: 100, depositCents: 200 } }).deposit, undefined);
  assert.equal(detailEvidence({ payment: { amountCharged: 100, verified: true, status: 'captured', transactionId: 'verified-provider-id' } }).paid, 100);
});
test('client deletion is restricted to own Draft without any financial lock field', () => {
  const draft = { userId: 'owner', status: 'Draft', amount: 0 };
  assert.equal(detailEvidence(draft, 'owner').canDeleteDraft, true);
  assert.equal(detailEvidence(draft, 'other').canDeleteDraft, false);
  for (const lock of [{ checkout: null }, { serverQuote: null }, { payment: null }]) assert.equal(detailEvidence({ ...draft, ...lock }, 'owner').canDeleteDraft, false);
});
