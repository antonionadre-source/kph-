import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { test } from 'node:test';

function handler(path, name, scope) {
  const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let expression;
  function visit(node) { if (ts.isVariableDeclaration(node) && node.name.getText(source) === name) expression = node.initializer; ts.forEachChild(node, visit); }
  visit(source); assert.ok(expression);
  const code = ts.transpileModule(`(${expression.getText(source)})`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  return vm.runInNewContext(code, { console: { warn() {}, error() {}, log() {} }, ...scope });
}
test('real draft handler creates once, preserves createdAt on the next step and saves no financial claim', async () => {
  const records = new Map(); let writes = 0;
  const scope = {
    auth: { currentUser: { uid: 'emulator-owner' } }, db: {}, draftDocId: null,
    email: 'test@example.invalid', clientName: 'Emulator Test', phonePrefix: '+41', phone: 'test', address: 'test', postcode: '8200', city: 'test',
    notes: '', selectedDate: '2026-12-20', selectedTime: '09:00', bookingMode: 'validate', accessMethod: 'On site', grandTotal: 707,
    cart: [{ type: 'end-of-tenancy', details: { roomsCount: 2, bathroomsCount: 1 }, title: 'EOT', price: 1 }], uploadStates: [],
    collection() { return {}; }, doc() { return { id: 'isolated-booking' }; },
    async getDoc() { return { exists: () => records.size > 0, data: () => records.get('isolated-booking') }; },
    serverTimestamp() { return { fixtureTimestamp: ++writes }; }, sanitizeFirestoreData: value => value,
    async setDoc(ref, value) { records.set(ref.id, value); },
    setDraftDocId(id) { scope.draftDocId = id; }, bookingText: { save: 'Cannot save' },
  };
  const save = handler('components/ConsultationPage.tsx', 'saveDraftToFirestore', scope);
  await save(1); const first = records.get('isolated-booking');
  await handler('components/ConsultationPage.tsx', 'saveDraftToFirestore', scope)(2); const second = records.get('isolated-booking');
  assert.equal(second.createdAt.fixtureTimestamp, first.createdAt.fixtureTimestamp);
  assert.equal(second.amount, 0); assert.equal(second.estimatedAmount, 707);
  assert.equal('payment' in second, false); assert.equal('timestamps' in second, false);
  assert.equal(second.services[0].details.roomsCount, 2);
});
test('contact confirms persisted data despite disabled email; a failed primary save never sends secondary channels', async () => {
  for (const fail of [false, true]) {
    let submitted = false, error = null, sends = 0;
    const submit = handler('components/KontaktPage.tsx', 'handleSubmit', {
      formData: { name: 'Emulator Test', email: 'test@example.invalid', message: 'isolated', subject: '' }, language: 'es', d: { sendFailedError: 'Error', defaultInterest: 'Test' }, db: {},
      setError: value => { error = value; }, setIsLoading() {}, setIsSubmitted(value) { submitted = value; },
      collection() {}, serverTimestamp() {},
      async addDoc() { if (fail) throw new Error('Simulated database failure'); },
      MAKE_WEBHOOK_URL: '', postWebhook: async () => { sends++; throw new Error('Disabled'); },
      emailjs: { send: async () => { sends++; throw new Error('Disabled'); } }, SERVICE_ID: '', TEMPLATE_ID: '', PUBLIC_KEY: '',
      window: { scrollTo() {} },
    });
    await submit({ preventDefault() {} });
    assert.equal(submitted, !fail); assert.equal(Boolean(error), fail);
    assert.equal(sends, fail ? 0 : 2);
  }
});
