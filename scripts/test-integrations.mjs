import assert from 'node:assert/strict';
import vm from 'node:vm';
import { build } from 'esbuild';

// Bundle each boundary with inert SDKs; no requests or service accounts are used.
async function loadBoundary(entry, env = {}, hostname = 'localhost', responseStatus = 200, options = {}) {
  const calls = [];
  const sdkStub = `
    export const initializeApp = config => { globalThis.record('initialize', config); return {}; };
    export const getApps = () => []; export const getApp = () => ({});
    export const getAuth = () => ({}); export const getFirestore = (app, id) => { globalThis.record('database', id); return {}; };
    export const getStorage = () => ({});
    export const connectAuthEmulator = (auth, url) => globalThis.record('auth', url);
    export const connectFirestoreEmulator = (db, host, port) => globalThis.record('firestore', host, port);
    export const connectStorageEmulator = (storage, host, port) => globalThis.record('storage', host, port);
    export default {
      send: async (...args) => { globalThis.record('email', ...args); return { status: 200 }; },
      sendForm: async (...args) => { globalThis.record('emailForm', ...args); return { status: 200 }; }
    };
  `;
  const result = await build({
    entryPoints: [entry], bundle: true, write: false, format: 'cjs', platform: options.nodeRuntime ? 'node' : 'browser',
    logLevel: 'silent',
    define: options.nodeRuntime ? {} : { 'import.meta.env': JSON.stringify({ DEV: true, PROD: false, ...env }) },
    plugins: [{ name: 'inert-services', setup(builder) {
      builder.onResolve({ filter: /^(firebase\/(app|auth|firestore|storage)|@emailjs\/browser)$/ }, args => ({ path: args.path, namespace: 'inert' }));
      builder.onLoad({ filter: /.*/, namespace: 'inert' }, () => ({ contents: sdkStub, loader: 'js' }));
    }}],
  });
  const module = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, {
    module, exports: module.exports,
    record: (...args) => calls.push(args),
    ...(!options.nodeRuntime ? { window: { SSR: options.mockSsr, location: { hostname, href: `http://${hostname}/kontakt` } } } : {}),
    console: { warn() {}, error() {}, log() {} },
    AbortController, AbortSignal, setTimeout, clearTimeout, URL,
    fetch: async (...args) => {
      calls.push(['fetch', ...args]);
      return { ok: responseStatus >= 200 && responseStatus < 300, status: responseStatus };
    },
  });
  return { api: module.exports, calls };
}

for (const [env, host] of [[{}, 'localhost'], [{ DEV: false, PROD: true }, 'localhost'], [{ DEV: true }, 'preview.example.test']]) {
  const { api, calls } = await loadBoundary('components/firebase.ts', env, host);
  assert.equal(api.usingFirebaseEmulators, true);
  assert.equal(calls.find(c => c[0] === 'initialize')[1].projectId, 'demo-kraken-pfm');
  assert.equal(calls.find(c => c[0] === 'database')[1], '(default)');
  assert.deepEqual(calls.filter(c => ['auth', 'firestore', 'storage'].includes(c[0])).map(c => c[0]), ['auth', 'firestore', 'storage']);
}
const production = await loadBoundary('components/firebase.ts', { DEV: false, PROD: true }, 'krakenpfm.ch');
assert.equal(production.api.usingFirebaseEmulators, false);
assert.equal(production.calls.some(c => ['auth', 'firestore', 'storage'].includes(c[0])), false);
const explicitProduction = await loadBoundary('components/firebase.ts', { VITE_FIREBASE_MODE: 'production' });
assert.equal(explicitProduction.api.usingFirebaseEmulators, false);

// Direct Node/tsx imports have no Vite environment or browser globals. The same
// source must import safely, keep submissions blocked and use only the demo app.
for (const entry of ['components/integrationConfig.ts', 'components/firebase.ts', 'components/emailClient.ts', 'components/leadWebhook.ts']) {
  const { api, calls } = await loadBoundary(entry, {}, 'localhost', 200, { nodeRuntime: true });
  if (entry.endsWith('firebase.ts')) {
    assert.equal(api.usingFirebaseEmulators, true);
    assert.equal(calls.find(c => c[0] === 'initialize')[1].projectId, 'demo-kraken-pfm');
  }
  if (entry.endsWith('integrationConfig.ts')) assert.equal(api.externalSubmissionsEnabled, false);
  if (entry.endsWith('emailClient.ts')) await assert.rejects(api.default.send('id', 'id', {}), /disabled/);
  if (entry.endsWith('leadWebhook.ts')) await assert.rejects(api.postWebhook('https://example.invalid/hook', {}), /disabled/);
  assert.equal(calls.some(c => ['fetch', 'email', 'emailForm'].includes(c[0])), false);
}
const mockSsr = await loadBoundary('components/firebase.ts', { VITE_FIREBASE_MODE: 'production', DEV: false, PROD: true }, 'krakenpfm.ch', 200, { mockSsr: true });
assert.equal(mockSsr.api.usingFirebaseEmulators, true);
assert.equal(mockSsr.calls.find(c => c[0] === 'initialize')[1].projectId, 'demo-kraken-pfm');

const disabledEmail = await loadBoundary('components/emailClient.ts');
await assert.rejects(disabledEmail.api.default.send('id', 'id', {}), /disabled/);
assert.equal(disabledEmail.calls.length, 0);
const missingEmail = await loadBoundary('components/emailClient.ts', { VITE_ENABLE_EXTERNAL_SUBMISSIONS: 'true' });
await assert.rejects(missingEmail.api.default.send('id', 'id', {}), /not configured/);
assert.equal(missingEmail.calls.length, 0);
const testEmail = await loadBoundary('components/emailClient.ts', {
  VITE_ENABLE_EXTERNAL_SUBMISSIONS: 'true', VITE_EMAILJS_SERVICE_ID: 'test-service',
  VITE_EMAILJS_TEMPLATE_ID: 'test-template', VITE_EMAILJS_PUBLIC_KEY: 'test-public',
});
await testEmail.api.default.send('test-service', 'test-template', { message: 'isolated' }, 'test-public');
assert.equal(testEmail.calls[0][0], 'email');

const disabledLead = await loadBoundary('components/leadWebhook.ts');
await disabledLead.api.sendLead({ source: 'isolated' });
assert.equal(disabledLead.calls.length, 0);
const testWebhookEnv = { VITE_ENABLE_EXTERNAL_SUBMISSIONS: 'true', VITE_MAKE_LEAD_WEBHOOK_URL: 'http://127.0.0.1:9999/test' };
const enabledLead = await loadBoundary('components/leadWebhook.ts', testWebhookEnv);
await enabledLead.api.sendLead({ source: 'isolated', name: 'local-test' });
assert.equal(enabledLead.calls.length, 1);
assert.equal(enabledLead.calls[0][1], testWebhookEnv.VITE_MAKE_LEAD_WEBHOOK_URL);
const sentPayload = JSON.parse(enabledLead.calls[0][2].body);
assert.equal(sentPayload.source, 'isolated');
assert.match(sentPayload.summary, /name: local-test/);
const rejectedWebhook = await loadBoundary('components/leadWebhook.ts', testWebhookEnv, 'localhost', 500);
await assert.rejects(rejectedWebhook.api.postWebhook(testWebhookEnv.VITE_MAKE_LEAD_WEBHOOK_URL, {}), /HTTP 500/);
await assert.rejects(rejectedWebhook.api.postWebhook('', {}), /not configured/);
await assert.rejects(rejectedWebhook.api.postWebhook('http://production.example.test/hook', {}), /HTTPS/);
console.log('Integration boundary checks passed: Firebase isolation, explicit opt-in, EmailJS guards, Make payload and HTTP errors (SDKs mocked; no external traffic).');
