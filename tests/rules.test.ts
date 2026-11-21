import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { initializeTestEnvironment, assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getBytes, deleteObject } from 'firebase/storage';
import { FirebasePaymentStore } from '../server/payments.ts';
import { draftTransferHandler } from '../server/draftTransfer.ts';
import { authenticatedUser, adminServices } from '../server/firebaseAdmin.ts';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInAnonymously, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';

let env: RulesTestEnvironment;
const suffix = `backend-${Date.now()}`;
const ownerId = suffix + '-owner', peerId = suffix + '-peer', staffId = suffix + '-staff';
function request(id: string) { return { id, userId: ownerId, client: 'Emulator Test', service: 'End of tenancy', date: '2026-12-20', status: 'Draft', priority: 'Low', amount: 0, estimatedAmount: 707, postcode: '8200', address: 'Seewadelstrasse 3', bookingMode: 'validate', services: [{ type: 'end-of-tenancy', details: { roomsCount: 2, bathroomsCount: 1 }, price: 0.01 }], createdAt: serverTimestamp(), updatedAt: serverTimestamp() }; }
before(async () => {
  process.env.FIREBASE_ADMIN_PROJECT_ID = 'demo-kraken-pfm'; process.env.FIREBASE_ADMIN_DATABASE_ID = '(default)';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'; process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  env = await initializeTestEnvironment({ projectId: 'demo-kraken-pfm', firestore: { host: '127.0.0.1', port: 8080, rules: fs.readFileSync('firestore.rules', 'utf8') }, storage: { host: '127.0.0.1', port: 9199, rules: fs.readFileSync('storage.rules', 'utf8') } });
});
after(async () => { await env?.cleanup(); });
function owner() { return env.authenticatedContext(ownerId, { email: 'owner@example.invalid', email_verified: false }); }
function staff() { return env.authenticatedContext(staffId, { email: 'staff@example.invalid', email_verified: true, staff: true }); }

test('real rules: sequential draft updates preserve createdAt; owner cannot mutate finances or operational state', async () => {
  const id = suffix + '-draft', db = owner().firestore(), target = doc(db, 'maintenance_requests', id);
  await assertSucceeds(setDoc(target, request(id)));
  const original = (await getDoc(target)).data()!.createdAt;
  await assertSucceeds(setDoc(target, { notes: 'Step two', updatedAt: serverTimestamp() }, { merge: true }));
  await assertSucceeds(updateDoc(target, { status: 'Pending', updatedAt: serverTimestamp() }));
  assert.ok((await getDoc(target)).data()!.createdAt.isEqual(original));
  await assertFails(updateDoc(target, { createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(target, { amount: 1, updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(target, { payment: { status: 'captured', verified: true }, updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(target, { status: 'Completed', updatedAt: serverTimestamp() }));
  await assertFails(getDoc(doc(env.authenticatedContext(peerId).firestore(), 'maintenance_requests', id)));
  await assertSucceeds(updateDoc(doc(staff().firestore(), 'maintenance_requests', id), { status: 'In Progress', updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(doc(staff().firestore(), 'maintenance_requests', id), { payment: { status: 'captured' }, updatedAt: serverTimestamp() }));
});
test('real rules: unverified domain email never grants staff; private team notes require verified staff claim', async () => {
  const id = suffix + '-private'; await assertSucceeds(setDoc(doc(owner().firestore(), 'maintenance_requests', id), request(id)));
  const domain = env.authenticatedContext(suffix + '-forged-domain', { email: 'new-operator@krakenpfm.ch', email_verified: false });
  await assertFails(getDoc(doc(domain.firestore(), 'maintenance_requests', id)));
  const unverifiedStaff = env.authenticatedContext(suffix + '-unverified-staff', { staff: true, email_verified: false });
  await assertFails(getDoc(doc(unverifiedStaff.firestore(), 'maintenance_requests', id)));
  const target = doc(staff().firestore(), 'maintenance_requests', id, 'team_notes', 'one');
  await assertSucceeds(setDoc(target, { id: 'one', author: 'Test staff', authorId: staffId, text: 'Private operational note', createdAt: new Date().toISOString() }));
  await assertFails(getDoc(doc(owner().firestore(), 'maintenance_requests', id, 'team_notes', 'one')));
  await assertSucceeds(updateDoc(target, { text: 'Edited privately', updatedAt: new Date().toISOString() }));
});
test('real rules: profiles cannot carry claims; validated reviews and public contact work without privilege escalation', async () => {
  const profile = { userId: ownerId, name: 'Emulator Owner', email: 'owner@example.invalid', phone: 'test', address: { street: 'test', postcode: '8200', city: 'test' }, accessType: 'On site', rooms: 2, toilets: 1, hasBalcony: false, hasGarden: false, notes: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(owner().firestore(), 'profiles', ownerId), profile));
  await assertFails(updateDoc(doc(owner().firestore(), 'profiles', ownerId), { staff: true, updatedAt: serverTimestamp() }));
  const review = doc(owner().firestore(), 'reviews', suffix);
  await assertSucceeds(setDoc(review, { uid: ownerId, name: 'Test', email: 'owner@example.invalid', rating: 4, comment: 'Emulator only', tags: [], source: 'review-invite', createdAt: serverTimestamp() }));
  await assertFails(setDoc(doc(owner().firestore(), 'reviews', suffix + '-bad'), { uid: peerId, rating: 5 }));
  const contact = { name: 'Emulator Contact', email: 'test@example.invalid', subject: '', message: 'Isolated rules check', language: 'es', status: 'new', createdAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(env.unauthenticatedContext().firestore(), 'contact_messages', suffix), contact));
  await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), 'contact_messages', suffix + '-bad'), { ...contact, admin: true }));
  const b2b = { userId: ownerId, type: 'commercial_b2b', companyName: 'Emulator Company', contactName: 'Test', contactEmail: 'test@example.invalid', contactPhone: 'test', address: 'test', services: ['cleaning'], floorPlans: [], estimatedMonthlyBudget: 100, estimatedAnnualBudget: 1200, status: 'pending', createdAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(owner().firestore(), 'b2b_quotes', suffix), b2b));
  await assertSucceeds(getDoc(doc(owner().firestore(), 'b2b_quotes', suffix)));
  await assertFails(getDoc(doc(env.authenticatedContext(peerId).firestore(), 'b2b_quotes', suffix)));
  await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), 'b2b_quotes', suffix + '-anonymous'), b2b));
});
test('real Storage rules: owner-scoped PDF works; wrong owner and executable MIME are denied', async () => {
  const storage = owner().storage(), location = `solicitudes/${ownerId}/${suffix}.pdf`;
  await assertSucceeds(uploadBytes(ref(storage, location), new Uint8Array([37, 80, 68, 70]), { contentType: 'application/pdf' }));
  await assertSucceeds(getBytes(ref(storage, location)));
  await assertSucceeds(getBytes(ref(staff().storage(), location)));
  await assertFails(getBytes(ref(env.authenticatedContext(peerId).storage(), location)));
  await assertFails(uploadBytes(ref(storage, `solicitudes/${peerId}/${suffix}.pdf`), new Uint8Array([1]), { contentType: 'application/pdf' }));
  await assertFails(uploadBytes(ref(storage, `solicitudes/${ownerId}/${suffix}.js`), new Uint8Array([1]), { contentType: 'application/javascript' }));
  await assertSucceeds(deleteObject(ref(storage, location)));
});
test('real Firestore transaction: checkout persists authoritative quote/Gateway, reuses it and confirms idempotently', async () => {
  const id = suffix + '-payment'; await assertSucceeds(setDoc(doc(owner().firestore(), 'maintenance_requests', id), request(id)));
  const store = new FirebasePaymentStore(); let calls = 0;
  const provider = async (fields: Record<string, string>) => { calls++; assert.equal(fields.amount, '1500'); assert.equal(fields.referenceId, id); return { id: 42, link: 'https://example.invalid/isolated-payment' }; };
  const first = await store.checkout(id, ownerId, provider, 'http://localhost:3000');
  assert.equal(first.amount, 15); assert.equal(first.total, 707);
  await store.checkout(id, ownerId, provider, 'http://localhost:3000'); assert.equal(calls, 1);
  await assert.rejects(store.checkout(id, peerId, provider, 'http://localhost:3000'), /not found/);
  const current = (await getDoc(doc(owner().firestore(), 'maintenance_requests', id))).data()!;
  assert.equal(current.amount, 707); assert.equal(current.payment.amountCharged, 0); assert.equal(current.payment.verified, false);
  await assertFails(updateDoc(doc(owner().firestore(), 'maintenance_requests', id), { notes: 'Change quoted order', updatedAt: serverTimestamp() }));
  await assert.rejects(store.confirmed({ id: 123, referenceId: id, amount: 1, invoice: { currency: 'CHF' } }), /does not match/);
  const transaction = { id: 123, referenceId: id, amount: 1500, invoice: { currency: 'CHF' } };
  assert.equal((await store.confirmed(transaction)).duplicate, false);
  assert.equal((await store.confirmed(transaction)).duplicate, true);
  const paid = (await getDoc(doc(owner().firestore(), 'maintenance_requests', id))).data()!.payment;
  assert.equal(paid.status, 'captured'); assert.equal(paid.verified, true); assert.equal(paid.amountCharged, 15); assert.equal(paid.transactionId, '123');
  await store.review({ ...transaction, status: 'chargeback' });
  const disputed = (await getDoc(doc(owner().firestore(), 'maintenance_requests', id))).data()!.payment;
  assert.equal(disputed.verified, false); assert.equal(disputed.reconciliationRequired, true);
  assert.equal(disputed.providerStatus, 'chargeback');
});

test('real Auth emulator: anonymous ID token verifies on the booking backend; missing/invalid tokens fail', async () => {
  const app = initializeApp({ apiKey: 'demo-key', projectId: 'demo-kraken-pfm' }, suffix + '-auth-client');
  try {
    const auth = getAuth(app); connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    const credential = await signInAnonymously(auth);
    const token = await credential.user.getIdToken();
    const decoded = await authenticatedUser({ headers: { authorization: 'Bearer ' + token } } as any);
    assert.equal(decoded.uid, credential.user.uid);
    await assert.rejects(authenticatedUser({ headers: {} } as any), /Sign in/);
    await assert.rejects(authenticatedUser({ headers: { authorization: 'Bearer invalid' } } as any), /verified/);
    await deleteUser(credential.user);
  } finally { await deleteApp(app); }
});

test('real dual-token draft transfer preserves financial boundaries, other owners and replay safety', async () => {
  const applications = ['source', 'destination'].map(name => initializeApp({ apiKey: 'demo-key', projectId: 'demo-kraken-pfm' }, `${suffix}-transfer-${name}`));
  const [sourceAuth, destinationAuth] = applications.map(app => { const auth = getAuth(app); connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true }); return auth; });
  try {
    const source = (await signInAnonymously(sourceAuth)).user;
    const destination = (await createUserWithEmailAndPassword(destinationAuth, `${suffix}@example.invalid`, 'isolated-test-password')).user;
    const sourceToken = await source.getIdToken(), destinationToken = await destination.getIdToken();
    const { db, timestamp } = adminServices();
    const ids = ['draft', 'paid', 'checkout', 'attachments', 'peer'].map(name => `${suffix}-transfer-${name}`);
    const data = { ...request(ids[0]), userId: source.uid, createdAt: timestamp(), updatedAt: timestamp() };
    const batch = db.batch();
    batch.set(db.collection('maintenance_requests').doc(ids[0]), data);
    batch.set(db.collection('maintenance_requests').doc(ids[1]), { ...data, id: ids[1], payment: { status: 'captured', verified: true, transactionId: '123' } });
    batch.set(db.collection('maintenance_requests').doc(ids[2]), { ...data, id: ids[2], checkout: { state: 'ready' } });
    batch.set(db.collection('maintenance_requests').doc(ids[3]), { ...data, id: ids[3], mediaUrls: ['https://example.invalid/guest.pdf'] });
    batch.set(db.collection('maintenance_requests').doc(ids[4]), { ...data, id: ids[4], userId: peerId });
    await batch.commit();
    const original = (await db.collection('maintenance_requests').doc(ids[0]).get()).data()!;
    const handler = draftTransferHandler();
    let status = 200, result: any;
    const response = { status(code: number) { status = code; return this; }, json(value: any) { result = value; return this; } };
    const req = { body: { sourceIdToken: sourceToken }, headers: { authorization: `Bearer ${destinationToken}` } };
    await handler(req as any, response as any);
    assert.equal(status, 200); assert.deepEqual(result.movedIds, [ids[0]]);
    assert.deepEqual(new Set(result.skippedIds), new Set(ids.slice(1, 4)));
    const moved = (await db.collection('maintenance_requests').doc(ids[0]).get()).data()!;
    assert.equal(moved.userId, destination.uid); assert.ok(moved.createdAt.isEqual(original.createdAt)); assert.equal(moved.amount, original.amount);
    for (const id of ids.slice(1, 4)) assert.equal((await db.collection('maintenance_requests').doc(id).get()).data()!.userId, source.uid);
    assert.equal((await db.collection('maintenance_requests').doc(ids[4]).get()).data()!.userId, peerId);
    await handler(req as any, response as any);
    assert.equal(status, 200); assert.deepEqual(result.movedIds, [], 'Replayed proofs cannot move an already-transferred booking again');
    const { FIREBASE_ADMIN_PROJECT_ID: configuredProject } = process.env;
    delete process.env.FIREBASE_ADMIN_PROJECT_ID;
    try { await handler(req as any, response as any); assert.equal(status, 503); }
    finally { process.env.FIREBASE_ADMIN_PROJECT_ID = configuredProject; }
  } finally {
    for (const auth of [sourceAuth, destinationAuth]) if (auth.currentUser) await deleteUser(auth.currentUser);
    await Promise.all(applications.map(deleteApp));
  }
});
