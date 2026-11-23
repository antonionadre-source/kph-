import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CALCULATOR_SERVICE_STORAGE_KEY, HOME_CALCULATOR_INTENT_KEY, HOME_CALCULATOR_REQUEST_EVENT,
  consumeHomeCalculatorRequest, homeCalculatorRequest, mergeConsultationDraft, openHomeCalculator, subscribeHomeCalculatorRequests,
  type HomeService,
} from '../src/home/calculator';
import { consumeKaiTransfer, prepareKaiTransfer, subscribeKaiTransfers } from '../src/kai/draft';
import { emptyKaiDraft } from '../src/kai/types';

function storageFixture() {
  const draft = '{ "name": "Antonio", "postcode": "8200", "notes": "Behalten", "legacy": { "requestId": "existing-42" } }';
  const pending = '{"id":"existing-payment","status":"pending"}';
  const values = new Map([['kraken_consultation_data_v2', draft], ['pending_booking', pending], ['kraken_cart_persistent', '[{"id":"existing-item","type":"moving"}]']]);
  return { draft, pending, values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
}

test('all four approved homepage selections reach the real route without changing drafts, requests or cart', () => {
  for (const [home, service] of [['end', 'end-of-tenancy'], ['regular', 'daily-cleaning'], ['deep', 'deep-cleaning'], ['moving', 'moving']] as const) {
    const storage = storageFixture();
    let navigations = 0;
    openHomeCalculator(home, route => {
      navigations++;
      assert.equal(route, '/quote');
      assert.equal(storage.getItem(CALCULATOR_SERVICE_STORAGE_KEY), service);
    }, storage);
    assert.deepEqual(consumeHomeCalculatorRequest(storage), { kind: 'service', service });
    assert.equal(navigations, 1);
    assert.equal(storage.getItem('kraken_consultation_data_v2'), storage.draft);
    assert.equal(storage.getItem('pending_booking'), storage.pending);
    assert.equal(storage.getItem('kraken_cart_persistent'), '[{"id":"existing-item","type":"moving"}]');
  }
});

test('windows has its own unpriced UI intention and cannot inherit a stale cleaning selection', () => {
  const storage = storageFixture();
  storage.setItem(CALCULATOR_SERVICE_STORAGE_KEY, 'deep-cleaning');
  openHomeCalculator('windows', route => assert.equal(route, '/quote'), storage);
  assert.equal(storage.getItem(CALCULATOR_SERVICE_STORAGE_KEY), null);
  assert.equal(storage.getItem(HOME_CALCULATOR_INTENT_KEY), 'windows');
  assert.deepEqual(consumeHomeCalculatorRequest(storage), { kind: 'windows' });
  assert.equal(storage.getItem('kraken_consultation_data_v2'), storage.draft);
  assert.equal(storage.getItem('pending_booking'), storage.pending);
});

test('blocked browser storage still hands off the selected service in memory and navigates once', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
  for (const service of ['windows', 'regular'] as HomeService[]) {
    const routes: string[] = [];
    openHomeCalculator(service, route => routes.push(route), blocked);
    assert.deepEqual(routes, ['/quote']);
    assert.deepEqual(consumeHomeCalculatorRequest(blocked), homeCalculatorRequest(service));
  }
});

test('stored hand-offs survive a fresh consumer and valid legacy SEO service identifiers remain supported', () => {
  const storage = storageFixture();
  openHomeCalculator('windows', () => undefined, storage);
  consumeHomeCalculatorRequest(null); // Drop only the in-memory request, as after a reload.
  assert.deepEqual(consumeHomeCalculatorRequest(storage), { kind: 'windows' });
  storage.setItem(CALCULATOR_SERVICE_STORAGE_KEY, 'gardening');
  assert.deepEqual(consumeHomeCalculatorRequest(storage), { kind: 'service', service: 'gardening' });
  storage.setItem(CALCULATOR_SERVICE_STORAGE_KEY, 'invented-service');
  assert.equal(consumeHomeCalculatorRequest(storage), null);
});

test('generic calculator entry clears stale intentions without changing customer JSON', () => {
  const storage = storageFixture();
  storage.setItem(CALCULATOR_SERVICE_STORAGE_KEY, 'moving');
  storage.setItem(HOME_CALCULATOR_INTENT_KEY, 'windows');
  openHomeCalculator(null, route => assert.equal(route, '/quote'), storage);
  assert.equal(consumeHomeCalculatorRequest(storage), null);
  assert.equal(storage.getItem('kraken_consultation_data_v2'), storage.draft);
  for (const invalid of ['constructor', '__proto__', 'window-cleaning', 'daily-cleaning', {}, undefined]) assert.equal(homeCalculatorRequest(invalid), null);
});

test('saving edited fields preserves unknown legacy draft data and refuses malformed JSON', () => {
  const storage = storageFixture();
  const merged = mergeConsultationDraft(storage.draft, { notes: 'Aktualisiert' });
  assert.deepEqual(JSON.parse(merged!), { name: 'Antonio', postcode: '8200', notes: 'Aktualisiert', legacy: { requestId: 'existing-42' } });
  assert.equal(storage.getItem('kraken_consultation_data_v2'), storage.draft);
  for (const invalid of ['{broken', 'null', '[]', '"legacy text"']) assert.equal(mergeConsultationDraft(invalid, { name: 'New' }), null);
});

test('a mounted calculator is notified after navigation and can consume a service exactly once without changing customer data', async context => {
  const target = new EventTarget();
  const storage = storageFixture();
  const received: unknown[] = [];
  let notifications = 0;
  target.addEventListener(HOME_CALCULATOR_REQUEST_EVENT, event => {
    notifications++;
    assert.equal('detail' in event, false); // No request, conversation or customer data on the notification.
  });
  const unsubscribe = subscribeHomeCalculatorRequests(() => received.push(consumeHomeCalculatorRequest(storage)), target);
  context.after(unsubscribe);
  openHomeCalculator('windows', route => {
    assert.equal(route, '/quote');
    assert.equal(notifications, 0);
  }, storage, target);
  assert.deepEqual(received, []);
  await Promise.resolve();
  assert.deepEqual(received, [{ kind: 'windows' }]);
  assert.equal(notifications, 1);
  assert.equal(consumeHomeCalculatorRequest(storage), null);
  assert.equal(storage.getItem('kraken_consultation_data_v2'), storage.draft);
  assert.equal(storage.getItem('pending_booking'), storage.pending);
  assert.equal(storage.getItem('kraken_cart_persistent'), '[{"id":"existing-item","type":"moving"}]');
  openHomeCalculator(null, () => undefined, storage, target);
  await Promise.resolve();
  assert.equal(notifications, 1);
});

test('leaving the calculator unsubscribes pending notifications but keeps the service available for its next mount', async () => {
  const target = new EventTarget();
  const storage = storageFixture();
  let changes = 0;
  const unsubscribe = subscribeHomeCalculatorRequests(() => changes++, target);
  openHomeCalculator('regular', () => undefined, storage, target);
  unsubscribe();
  await Promise.resolve();
  assert.equal(changes, 0);
  assert.deepEqual(consumeHomeCalculatorRequest(storage), { kind: 'service', service: 'daily-cleaning' });
});

test('Kai consumes its earlier queued transfer before a footer-style service notification can change the active calculation', async context => {
  const target = new EventTarget();
  const storage = storageFixture();
  const draft = { ...emptyKaiDraft('es'), service: 'windows' as const, services: ['windows' as const], fields: { windowsCount: '4' } };
  let kaiApplied = 0;
  let plainServiceChanges = 0;
  context.after(subscribeKaiTransfers(() => {
    const transfer = consumeKaiTransfer(null);
    if (!transfer) return;
    assert.equal(transfer.draft.fields.windowsCount, '4');
    assert.deepEqual(consumeHomeCalculatorRequest(storage), { kind: 'windows' });
    kaiApplied++;
  }, target));
  context.after(subscribeHomeCalculatorRequests(() => {
    if (consumeHomeCalculatorRequest(storage)) plainServiceChanges++;
  }, target));
  prepareKaiTransfer(draft, 'preserve', null, target);
  openHomeCalculator('windows', () => undefined, storage, target);
  await Promise.resolve();
  assert.equal(kaiApplied, 1);
  assert.equal(plainServiceChanges, 0);
  assert.equal(consumeKaiTransfer(null), null);
});
