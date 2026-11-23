import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyKaiDraft, KAI_FIELDS, type KaiDraft } from '../src/kai/types.ts';
import { applyKaiToCalculation, consumeKaiTransfer, getKaiTransferPreview, KAI_TRANSFER_EVENT, KAI_TRANSFER_KEY, normalizeKaiDraft, prepareKaiTransfer, subscribeKaiTransfers, registerKaiCalculationPreview } from '../src/kai/draft.ts';

function storageFixture() {
  const values = new Map<string, string>();
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
}
function draft(service: KaiDraft['service'], fields: KaiDraft['fields'] = {}): KaiDraft {
  return { ...emptyKaiDraft('es'), service, services: service ? [service] : [], fields };
}

test('an explicit transfer only writes the versioned session key and is consumed once', () => {
  const storage = storageFixture();
  const customer = '{ "name":"Existing", "unknown":{"keep":true} }';
  storage.setItem('kraken_consultation_data_v2', customer);
  storage.setItem('pending_booking', '{"payment":"pending"}');
  storage.setItem('kraken_cart_persistent', '[{"id":"saved","type":"moving"}]');
  const before = new Map(storage.values);
  prepareKaiTransfer(draft('moving', { inventory: '1 sofa and 3 boxes' }), 'preserve', storage);
  assert.equal(storage.values.size, before.size + 1);
  for (const [key, value] of before) assert.equal(storage.getItem(key), value);
  assert.deepEqual(consumeKaiTransfer(storage), { draft: draft('moving', { inventory: '1 sofa and 3 boxes' }), policy: 'preserve' });
  assert.equal(consumeKaiTransfer(storage), null);
  assert.equal(storage.getItem(KAI_TRANSFER_KEY), null);
  for (const [key, value] of before) assert.equal(storage.getItem(key), value);
});

test('a blocked browser store still transfers once in memory and importing in Node makes no browser requests', () => {
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } };
  prepareKaiTransfer(draft('windows', { windowsCount: '4' }), 'preserve', blocked);
  assert.equal(consumeKaiTransfer(blocked)?.draft.service, 'windows');
  assert.equal(consumeKaiTransfer(blocked), null);
  assert.deepEqual(getKaiTransferPreview(draft('windows'), blocked), { conflicts: [], malformed: false });
});

test('reload fallback validates the envelope, rejects expiry and leaves malformed customer JSON byte-for-byte intact', () => {
  const storage = storageFixture();
  storage.setItem('kraken_consultation_data_v2', '{broken original');
  assert.equal(getKaiTransferPreview(draft('regular'), storage).malformed, true);
  storage.setItem(KAI_TRANSFER_KEY, JSON.stringify({ version: 1, createdAt: Date.now(), policy: 'preserve', draft: draft('regular', { frequency: 'Weekly' }) }));
  assert.equal(consumeKaiTransfer(storage)?.draft.fields.frequency, 'Weekly');
  assert.equal(storage.getItem('kraken_consultation_data_v2'), '{broken original');
  for (const value of [null, '{broken', { version: 1, createdAt: 0, policy: 'replace', draft: draft('moving') }, { version: 1, createdAt: Date.now(), policy: 'merge', draft: draft('moving') }]) {
    storage.setItem(KAI_TRANSFER_KEY, typeof value === 'string' ? value : JSON.stringify(value));
    assert.equal(consumeKaiTransfer(storage), null);
  }
  assert.equal(storage.getItem('kraken_consultation_data_v2'), '{broken original');
});

test('conflicts are reported before continuation and preserve retains existing customer and service choices', () => {
  const storage = storageFixture();
  const contact = { postcode: '8200', city: 'Schaffhausen', notes: 'Original note', legacy: { id: 'keep' } };
  const config = { roomsCount: 2, bathroomsCount: 1, duration: 7, amount: 999 };
  storage.setItem('kraken_consultation_data_v2', JSON.stringify(contact));
  storage.setItem('kraken_cart_persistent', JSON.stringify([{ type: 'end-of-tenancy', details: config }]));
  const incoming = draft('end', { postcode: '8001', city: 'Zürich', rooms: '4', bathrooms: '2', notes: 'New note' });
  const preview = getKaiTransferPreview(incoming, storage);
  assert.deepEqual(new Set(preview.conflicts), new Set(['postcode', 'city', 'rooms', 'bathrooms', 'notes']));
  const result = applyKaiToCalculation(contact, config, incoming, 'preserve');
  assert.equal(result.contact.postcode, '8200');
  assert.equal(result.contact.city, 'Schaffhausen');
  assert.match(String(result.contact.notes), /Original note[\s\S]*New note/);
  assert.equal(result.config.roomsCount, 2);
  assert.equal(result.config.bathroomsCount, 1);
  assert.equal(result.config.duration, 7);
  assert.equal(result.config.amount, 999);
  assert.deepEqual(result.contact.legacy, { id: 'keep' });
  assert.equal(contact.notes, 'Original note');
  assert.equal(config.roomsCount, 2);
});

test('explicit replace changes only exact supported fields; no price, duration, consent or payment is accepted', () => {
  const incoming = { ...draft('end', { rooms: '4', bathrooms: '2', postcode: '8001' }), amount: 1, fields: { rooms: '4', bathrooms: '2', postcode: '8001', payment: 'captured', amount: '0', terms: 'true' } };
  const result = applyKaiToCalculation({ terms: false }, { roomsCount: 2, duration: 7, price: 500 }, incoming as KaiDraft, 'replace');
  assert.equal(result.config.roomsCount, 4);
  assert.equal(result.config.bathroomsCount, 2);
  assert.equal(result.config.duration, 7); // The real calculator derives duration after mapping.
  assert.equal(result.config.price, 500);
  assert.equal(result.contact.terms, false);
  assert.equal(result.contact.payment, undefined);
  assert.equal(result.contact.amount, undefined);
  assert.equal(result.config.payment, undefined);
  assert.equal(result.config.amount, undefined);
  assert.equal(result.contact.postcode, '8001');
});

test('regular/deep counts use bedrooms, preserve uncertain totals as notes and recognise bounded six-language frequency aliases', () => {
  for (const word of ['Weekly', 'wöchentlich', 'semanal', 'hebdomadaire', 'settimanale']) {
    const result = applyKaiToCalculation({}, {}, draft('regular', { bedrooms: '3', bathrooms: '2', frequency: word }), 'preserve');
    assert.deepEqual(result.config, { bedrooms: 3, bathrooms: 2, frequency: 'Weekly' });
  }
  const uncertain = applyKaiToCalculation({}, {}, draft('regular', { bedrooms: '3.5', frequency: 'twice, maybe three times a week' }), 'preserve');
  assert.deepEqual(uncertain.config, {});
  assert.equal(uncertain.contact.date, undefined);
  assert.match(String(uncertain.contact.notes), /3\.5/);
  assert.match(String(applyKaiToCalculation({}, {}, draft('deep', { date: 'tomorrow' }), 'preserve').contact.notes), /tomorrow/);
  const deep = applyKaiToCalculation({}, {}, draft('deep', { bedrooms: '2', frequency: 'Every 3 Months' }), 'preserve');
  assert.deepEqual(deep.config, { bedrooms: 2 }); // Frequency belongs to regular in the selected-service Kai contract.
});

test('moving transfers addresses/inventory verbatim and never infers floors, lift, weights, capacity or one trip', () => {
  const incoming = draft('moving', { origin: 'Bahnhofstrasse 1, 8001 Zürich', destination: '8400 Winterthur', inventory: 'Sofa, 4 boxes, fragile TV', originAccess: 'Third floor, narrow stairs', destinationAccess: 'Lift' });
  const result = applyKaiToCalculation({}, {}, incoming, 'preserve');
  assert.deepEqual(result.config, { fromAddress: 'Bahnhofstrasse 1, 8001 Zürich', toAddress: '8400 Winterthur', fromZip: '8001', toZip: '8400', description: 'Sofa, 4 boxes, fragile TV', accessTo: 'Lift' });
  assert.equal(Object.hasOwn(result.config, 'accessFrom'), false);
  assert.equal(Object.hasOwn(result.config, 'floorFrom'), false);
  assert.match(String(result.contact.notes), /Third floor, narrow stairs/);
  const conflict = applyKaiToCalculation({}, { fromAddress: 'Existing street' }, incoming, 'preserve');
  assert.equal(conflict.config.fromAddress, 'Existing street');
  assert.match(String(conflict.contact.notes), /Bahnhofstrasse/);
});

test('windows retains its own service and every detail as editable note data without inventing a priced cleaning configuration', () => {
  const incoming = draft('windows', { city: 'Zürich', windowsCount: '4', windowType: 'Large', windowAccess: 'Inside only', date: '2027-02-28', notes: 'Call before arrival' });
  const result = applyKaiToCalculation({}, {}, incoming, 'preserve');
  assert.deepEqual(result.config, {});
  assert.equal(result.contact.city, 'Zürich');
  assert.equal(result.contact.date, '2027-02-28');
  assert.match(String(result.contact.notes), /4[\s\S]*Large[\s\S]*Inside only[\s\S]*Call before arrival/);
  assert.equal(applyKaiToCalculation({}, {}, draft('windows', { date: '2027-02-30' }), 'preserve').contact.date, undefined);
});

test('malformed or oversized draft shapes fail closed; unknown and prototype keys are not forwarded', () => {
  for (const invalid of [null, [], {}, { ...draft('moving'), version: 2 }, { ...draft('moving'), service: 'payment' }, { ...draft('moving'), language: 'constructor' }, { ...draft('moving'), fields: { notes: '<'.repeat(2001) } }, { ...draft('moving'), fields: { rooms: 3 } }]) assert.equal(normalizeKaiDraft(invalid), null);
  const injected = JSON.parse(JSON.stringify(draft('end', { rooms: '2' })).replace('"rooms":"2"', '"rooms":"2","__proto__":{"admin":true},"payment":"captured"'));
  const result = normalizeKaiDraft(injected)!;
  assert.deepEqual(Object.keys(result.fields), ['rooms']);
  assert.equal(({} as any).admin, undefined);
  assert.equal(KAI_FIELDS.every(field => typeof field === 'string'), true);
});


test('an already-mounted calculator receives an explicit transfer after the navigation intention, consumes once, and unsubscribes', async () => {
  const storage = storageFixture();
  const target = new EventTarget();
  const received: string[] = [];
  let eventData: unknown = 'not-seen';
  target.addEventListener(KAI_TRANSFER_EVENT, event => { eventData = (event as CustomEvent).detail; });
  const unsubscribe = subscribeKaiTransfers(() => {
    assert.equal(storage.getItem('navigation-intent'), 'moving');
    const transfer = consumeKaiTransfer(storage);
    if (transfer) received.push(transfer.draft.fields.inventory || '');
  }, target);
  prepareKaiTransfer(draft('moving', { inventory: 'Unsaved user inventory' }), 'preserve', storage, target);
  assert.deepEqual(received, []);
  storage.setItem('navigation-intent', 'moving');
  await Promise.resolve();
  assert.deepEqual(received, ['Unsaved user inventory']);
  assert.equal(eventData, undefined); // No PII is broadcast on the DOM event.
  assert.equal(consumeKaiTransfer(storage), null);
  unsubscribe();
  prepareKaiTransfer(draft('moving', { inventory: 'Next request' }), 'preserve', storage, target);
  await Promise.resolve();
  assert.deepEqual(received, ['Unsaved user inventory']);
  assert.equal(consumeKaiTransfer(storage)?.draft.fields.inventory, 'Next request');
});


test('the summary detects unsaved calculator edits instead of only reading older persisted fields', () => {
  const storage = storageFixture();
  storage.setItem('kraken_consultation_data_v2', JSON.stringify({ city: 'Saved city', notes: 'Saved note' }));
  const current = { city: 'Unsaved city', notes: 'Current edit' };
  const unsavedConfig = { roomsCount: 5, bathroomsCount: 2, duration: 12 };
  const unregister = registerKaiCalculationPreview(() => ({ contact: current, config: unsavedConfig }));
  const incoming = draft('end', { city: 'Saved city', rooms: '3' });
  const preview = getKaiTransferPreview(incoming, storage);
  assert.deepEqual(new Set(preview.conflicts), new Set(['city', 'rooms']));
  const applied = applyKaiToCalculation(current, unsavedConfig, incoming, 'preserve');
  assert.equal(applied.contact.city, 'Unsaved city');
  assert.equal(applied.config.roomsCount, 5);
  assert.equal(unsavedConfig.duration, 12);
  assert.match(String(applied.contact.notes), /Current edit/);
  unregister();
  assert.deepEqual(getKaiTransferPreview(incoming, storage), { conflicts: [], malformed: false });
  assert.equal(storage.getItem('kraken_consultation_data_v2'), JSON.stringify({ city: 'Saved city', notes: 'Saved note' }));
});


test('changing moving to windows transfers only applicable fields while preserving the full Kai draft and existing notes', () => {
  const storage = storageFixture();
  const original = draft('windows', {
    origin: 'Old origin street', destination: 'Old destination street', inventory: 'Old moving inventory',
    originAccess: 'Old origin access', destinationAccess: 'Old destination access', rooms: '4',
    city: 'Zürich', postcode: '8001', date: '2027-03-04', notes: 'Shared customer note',
    windowsCount: '6', windowType: 'Large windows', windowAccess: 'Inside only',
  });
  original.services = ['moving', 'windows'];
  original.deferred = ['originAccess', 'date'];
  const snapshot = structuredClone(original);
  const existing = { notes: 'Existing saved moving note', legacy: { requestId: 'keep-original' } };
  const result = applyKaiToCalculation(existing, {}, original, 'preserve');
  assert.deepEqual(result.config, {});
  assert.equal(result.contact.city, 'Zürich');
  assert.equal(result.contact.postcode, '8001');
  assert.equal(result.contact.date, '2027-03-04');
  assert.match(String(result.contact.notes), /^Existing saved moving note/);
  for (const text of ['Shared customer note', '6', 'Large windows', 'Inside only']) assert.ok(String(result.contact.notes).includes(text));
  for (const text of ['Old origin street', 'Old destination street', 'Old moving inventory', 'Old origin access', 'Old destination access']) assert.ok(!String(result.contact.notes).includes(text));
  assert.deepEqual(existing, { notes: 'Existing saved moving note', legacy: { requestId: 'keep-original' } });
  prepareKaiTransfer(original, 'preserve', storage);
  const transferred = consumeKaiTransfer(storage)!;
  assert.deepEqual(Object.keys(transferred.draft.fields).sort(), ['city', 'postcode', 'date', 'notes', 'windowsCount', 'windowType', 'windowAccess'].sort());
  assert.deepEqual(transferred.draft.deferred, ['date']);
  assert.deepEqual(original, snapshot); // Kai can still recover the moving information when switching back.
  assert.deepEqual(getKaiTransferPreview(original, storage), { conflicts: [], malformed: false });
});
