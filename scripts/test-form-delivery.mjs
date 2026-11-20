import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the real handlers with inert delivery channels and no DOM/service calls.
function loadHandler(path, name, scope) {
  const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let initializer;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name) initializer = node.initializer;
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.ok(initializer, `${name} exists in ${path}`);
  const javascript = ts.transpileModule(`(${initializer.getText(source)})`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText;
  return vm.runInNewContext(javascript, {
    console: { log() {}, warn() {}, error() {} },
    window: { location: { href: 'http://localhost/form' }, scrollTo() {} },
    setTimeout() { return 0; },
    ...scope,
  });
}
const event = { preventDefault() {} };

for (const succeeds of [false, true]) {
  let submitted = false;
  let error = '';
  let sentPayload;
  const handler = loadHandler('components/Footer.tsx', 'handleFinalSubmit', {
    activeLang: 'es',
    contactData: { name: 'Local test', phone: 'test', email: 'test@example.invalid', service: 'test', message: 'isolated' },
    MAKE_WEBHOOK_URL: 'http://127.0.0.1:9999/test',
    setStepError(value) { error = value; },
    setContactSubmitted(value) { submitted = value; },
    async postWebhook(_url, payload) {
      sentPayload = payload;
      if (!succeeds) throw new Error('Delivery disabled or rejected');
    },
  });
  await handler(event);
  assert.equal(submitted, succeeds, 'Footer only confirms an accepted webhook');
  assert.equal(Boolean(error), !succeeds, 'Footer displays delivery failure');
  assert.equal(sentPayload.type, 'STEP_SLIDE_FOOTER_CONTACT');
  assert.match(sentPayload.summary, /Local test/);
}

for (const deliveries of [[false, false, false], [true, false, false], [false, true, false], [false, false, true]]) {
  let submitted = false;
  let error = null;
  let loading = false;
  function delivery(index) {
    return deliveries[index] ? Promise.resolve() : Promise.reject(new Error('Channel rejected'));
  }
  const handler = loadHandler('components/CareersPage.tsx', 'handleSubmit', {
    auth: { currentUser: { uid: 'local-test' } }, db: {},
    cvFile: null, cvDataUrl: '', language: 'es',
    formData: { name: 'Local test', phone: 'test', position: 'test', region: 'test' },
    SERVICE_ID: 'test', TEMPLATE_ID: 'test', PUBLIC_KEY: 'test', MAKE_WEBHOOK_URL: 'http://127.0.0.1:9999/test',
    collection() { return {}; }, doc() { return { id: 'local-test-request' }; },
    serverTimestamp() { return {}; }, sanitizeFirestoreData(data) { return data; },
    setDoc() { return delivery(0); }, postWebhook() { return delivery(1); },
    emailjs: { send() { return delivery(2); } },
    t: { errorMsg: 'No se pudo enviar la candidatura.' },
    setError(value) { error = value; }, setIsLoading(value) { loading = value; },
    setIsSubmitted(value) { submitted = value; },
  });
  await handler(event);
  assert.equal(submitted, deliveries.some(Boolean), 'Careers requires at least one confirmed delivery');
  assert.equal(Boolean(error), !deliveries.some(Boolean), 'Careers displays total delivery failure');
  assert.equal(loading, false, 'Careers exits loading after each outcome');
}
console.log('Form delivery checks passed: Footer confirms only accepted webhook; Careers rejects total failure and accepts each partial success (all channels mocked).');
