import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { vercelBuildEnvironment, publishVercelAssets } from '../scripts/build-vercel.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const previewEnvironment = {
  ...process.env,
  NODE_ENV: 'production', VERCEL: '1', VERCEL_ENV: 'preview',
  ALLOW_EXTERNAL_INTEGRATIONS: 'true', GEMINI_API_KEY: 'inert-inherited-test-key',
  PAYREXX_INSTANCE: 'inert-test-instance', PAYREXX_API_SECRET: 'inert-test-secret',
};

test('preview build overrides inherited live Firebase and submission configuration', () => {
  const env = vercelBuildEnvironment({
    VERCEL_ENV: 'preview', VITE_FIREBASE_MODE: 'production', VITE_ENABLE_EXTERNAL_SUBMISSIONS: 'true',
    VITE_ENABLE_DEMO_DATA: 'true', VITE_API_URL: 'https://example.invalid/production-api',
    VITE_MAKE_LEAD_WEBHOOK_URL: 'https://example.invalid/live-hook',
  });
  assert.equal(env.VITE_FIREBASE_MODE, 'emulator');
  assert.equal(env.VITE_ENABLE_EXTERNAL_SUBMISSIONS, 'false');
  assert.equal(env.VITE_ENABLE_DEMO_DATA, 'false');
  assert.equal(env.VITE_API_URL, '');
  assert.equal(env.VITE_MAKE_LEAD_WEBHOOK_URL, '');
  assert.equal(vercelBuildEnvironment({ VERCEL_ENV: 'production', VITE_FIREBASE_MODE: 'production' }).VITE_FIREBASE_MODE, 'production');
});

test('remote staging Preview requires explicit opt-in and complete separate Firebase configuration', () => {
  const projectId = 'kraken-preview-test';
  const configured = {
    VERCEL_ENV: 'preview', FIREBASE_PREVIEW_STAGING_ENABLED: 'true', FIREBASE_STAGING_PROJECT_ID: projectId,
    VITE_FIREBASE_API_KEY: 'isolated-staging-public-key', VITE_FIREBASE_APP_ID: '1:123456:web:abc123',
    VITE_FIREBASE_AUTH_DOMAIN: `${projectId}.firebaseapp.com`, VITE_FIREBASE_STORAGE_BUCKET: `${projectId}.firebasestorage.app`,
    VITE_FIREBASE_DATABASE_ID: 'staging-records', VITE_ENABLE_EXTERNAL_SUBMISSIONS: 'true', VITE_ENABLE_DEMO_DATA: 'true',
    VITE_MAKE_LEAD_WEBHOOK_URL: 'https://example.invalid/live-hook', VITE_API_URL: 'https://example.invalid/production',
  };
  const selected = vercelBuildEnvironment(configured);
  assert.equal(selected.VITE_FIREBASE_MODE, 'staging'); assert.equal(selected.VITE_FIREBASE_PROJECT_ID, projectId);
  assert.equal(selected.VITE_FIREBASE_DATABASE_ID, 'staging-records');
  assert.equal(selected.VITE_ENABLE_EXTERNAL_SUBMISSIONS, 'false'); assert.equal(selected.VITE_ENABLE_DEMO_DATA, 'false');
  assert.equal(selected.VITE_MAKE_LEAD_WEBHOOK_URL, ''); assert.equal(selected.VITE_API_URL, '');
  assert.equal(vercelBuildEnvironment({ ...configured, FIREBASE_PREVIEW_STAGING_ENABLED: 'false' }).VITE_FIREBASE_MODE, 'emulator');
  assert.throws(() => vercelBuildEnvironment({ ...configured, VERCEL_ENV: undefined }), /VERCEL_ENV=preview/);
  for (const value of ['vivid-kite-477020-h6', 'demo-kraken-pfm', '']) assert.throws(() => vercelBuildEnvironment({ ...configured, FIREBASE_STAGING_PROJECT_ID: value }), /separate/);
  for (const key of ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_APP_ID', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_DATABASE_ID']) {
    assert.throws(() => vercelBuildEnvironment({ ...configured, [key]: '' }), /Staging/);
  }
  assert.throws(() => vercelBuildEnvironment({ ...configured, VITE_FIREBASE_AUTH_DOMAIN: 'vivid-kite-477020-h6.firebaseapp.com' }), /authDomain/);
  assert.throws(() => vercelBuildEnvironment({ ...configured, VITE_FIREBASE_STORAGE_BUCKET: 'vivid-kite-477020-h6.firebasestorage.app' }), /storageBucket/);
  const original = JSON.parse(readFileSync(path.join(root, 'firebase-applet-config.json'), 'utf8'));
  assert.throws(() => vercelBuildEnvironment({ ...configured, VITE_FIREBASE_API_KEY: original.apiKey }), /original Firebase API key/);
});

test('Vercel publishes frontend bundles without exposing the server HTML or bundle as static files', () => {
  const scratch = mkdtempSync(path.join(tmpdir(), 'kraken-vercel-assets-'));
  try {
    mkdirSync(path.join(scratch, 'dist/assets'), { recursive: true });
    mkdirSync(path.join(scratch, 'public'));
    writeFileSync(path.join(scratch, 'dist/index.html'), '<html>PRIVATE_TEMPLATE</html>');
    writeFileSync(path.join(scratch, 'dist/server.cjs'), 'PRIVATE_SERVER');
    writeFileSync(path.join(scratch, 'dist/assets/app-hash.js'), 'FRONTEND');
    publishVercelAssets(scratch);
    assert.equal(readFileSync(path.join(scratch, 'public/assets/app-hash.js'), 'utf8'), 'FRONTEND');
    assert.equal(existsSync(path.join(scratch, 'public/index.html')), false);
    assert.equal(existsSync(path.join(scratch, 'public/server.cjs')), false);
    writeFileSync(path.join(scratch, 'public/index.html'), 'WRONG_STATIC_INDEX');
    assert.throws(() => publishVercelAssets(scratch), /bypass Express SEO/);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

test('Vercel imports the Express app without opening its own port', { timeout: 15000 }, async () => {
  const child = spawn(process.execPath, ['--import', 'tsx', '-e', "import('./server.ts').then(m => console.log('APP_TYPE:' + typeof m.default))"], { cwd: root, env: previewEnvironment, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', data => output += data);
  child.stderr.on('data', data => output += data);
  try {
    const code = await new Promise<number | null>(resolve => child.once('exit', resolve));
    assert.equal(code, 0, output);
    assert.match(output, /APP_TYPE:function/);
    assert.doesNotMatch(output, /Server running on port|Vite development server middleware/);
  } finally { if (child.exitCode === null) child.kill('SIGKILL'); }
});

test('preview Express preserves SEO/API routing and blocks Payrexx/Gemini despite inherited secrets and opt-in', { timeout: 30000 }, async () => {
  const reservation = createServer();
  await new Promise<void>(resolve => reservation.listen(0, '127.0.0.1', resolve));
  const port = (reservation.address() as { port: number }).port;
  await new Promise<void>(resolve => reservation.close(() => resolve()));
  const child = spawn(process.execPath, ['--import', 'tsx', 'tests/fixtures/serve-vercel.ts'], { cwd: root, env: { ...previewEnvironment, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', data => output += data);
  child.stderr.on('data', data => output += data);
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null) throw new Error(output);
      try { ready = (await fetch(base + '/api/health')).ok; } catch {}
      if (ready) break;
      await wait(100);
    }
    assert.ok(ready, output);
    const payment = await fetch(base + '/api/payrexx/create-gateway', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"amount":10}' });
    assert.equal(payment.status, 503);
    const chat = await fetch(base + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', text: 'hola' }], language: 'es' }) });
    assert.equal((await chat.json()).source, 'fallback');
    assert.deepEqual(await (await fetch(base + '/__test/outbound.json')).json(), { outboundAttempts: 0 });
    const redirect = await fetch(base + '/contacto?lang=es', { redirect: 'manual' });
    assert.equal(redirect.status, 301);
    assert.equal(redirect.headers.get('location'), '/kontakt?lang=es');
    const page = await fetch(base + '/services?lang=es');
    assert.equal(page.status, 200);
    assert.match(await page.text(), /<title>[^<]*Kraken/);
    assert.equal((await fetch(base + '/not-a-kraken-page')).status, 404);
  } finally {
    child.kill('SIGTERM');
    await Promise.race([new Promise<void>(resolve => child.once('exit', () => resolve())), wait(3000)]);
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
  }
});
