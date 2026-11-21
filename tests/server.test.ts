import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
async function availablePort() {
  const s = createServer();
  await new Promise<void>(resolve => s.listen(0, '127.0.0.1', resolve));
  const port = (s.address() as { port: number }).port;
  await new Promise<void>(resolve => s.close(() => resolve()));
  return port;
}
async function withServer(cwd: string, args: string[], env: Record<string, string>, check: (url: string) => Promise<void>) {
  const port = await availablePort();
  const child = spawn(process.execPath, args, { cwd, env: { ...process.env, NODE_ENV: '', GEMINI_API_KEY: '', PAYREXX_INSTANCE: '', PAYREXX_API_SECRET: '', ALLOW_EXTERNAL_INTEGRATIONS: '', HOST: '127.0.0.1', PORT: String(port), ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '';
  child.stdout.on('data', data => logs += data);
  child.stderr.on('data', data => logs += data);
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 200; i++) {
      if (child.exitCode !== null) throw new Error(logs);
      try { ready = (await fetch(`${base}/api/health`)).ok; } catch {}
      if (ready) break;
      await wait(100);
    }
    assert.ok(ready, logs);
    await check(base);
  } finally {
    child.kill('SIGTERM');
    const exited = new Promise<void>(resolve => child.once('exit', () => resolve()));
    await Promise.race([exited, wait(5000)]);
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
  }
}
async function checkRoutes(base: string, dev: boolean) {
  for (const route of ['/', '/services', '/quote', '/kontakt', '/services/zurich/window-cleaning', '/einsatzgebiete']) {
    const res = await fetch(base + route);
    assert.equal(res.status, 200, route);
    const html = await res.text();
    assert.match(html, /<title>[^<]*Kraken/);
    assert.equal(html.includes('/@vite/client'), dev, route);
    assert.ok(!html.includes('STALE_BUILD_SENTINEL'));
  }
  for (const lang of ['de', 'en', 'fr', 'it', 'es', 'pt']) {
    const servicesResponse = await fetch(`${base}/services?lang=${lang}`);
    assert.equal(servicesResponse.status, 200, `/services?lang=${lang}`);
    const html = await servicesResponse.text();
    assert.match(html, /rel="canonical"/);
    const homeResponse = await fetch(`${base}/?lang=${lang}`);
    assert.equal(homeResponse.status, 200, `/?lang=${lang}`);
    const home = await homeResponse.text();
    assert.doesNotMatch(home, /\?lang=[^"\s<]*\?html-proxy/);
    if (lang === 'es') assert.match(home, /Gesti[oó]n|Limpieza|propiedades|Facility Management/i);
  }
  assert.equal((await fetch(`${base}/missing-page`)).status, 404);
  assert.equal((await fetch(`${base}/images/nonexistent-test.webp`)).status, 404);
  const redirect = await fetch(`${base}/contacto?lang=es`, { redirect: 'manual' });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), '/kontakt?lang=es');
  const chat = await fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', text: 'hola' }], language: 'es' }) });
  const data = await chat.json();
  assert.equal(data.source, 'fallback');
  assert.match(data.text, /Kai/);
  assert.equal((await fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 400);
}

test('development uses Vite in a clean copy and after a build, even with NODE_ENV=production inherited', { timeout: 90000 }, async () => {
  const scratch = mkdtempSync(path.join(tmpdir(), 'kraken-dev-test-'));
  try {
    cpSync(root, scratch, { recursive: true, filter: src => !['node_modules', '.git', 'dist', 'public'].includes(path.relative(root, src).split(path.sep)[0]) && !path.basename(src).startsWith('.env') });
    // Inline CSS exercises Vite's virtual HTML proxy IDs even if the app moves
    // its own styles to a stylesheet. A locale query must never become a path.
    const templatePath = path.join(scratch, 'index.html');
    writeFileSync(templatePath, readFileSync(templatePath, 'utf8').replace('</head>', '<style>.locale-query-regression { color: #123456; }</style></head>'));
    symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');
    symlinkSync(path.join(root, 'public'), path.join(scratch, 'public'), 'dir');
    await withServer(scratch, ['--import', 'tsx', 'scripts/dev.ts'], { NODE_ENV: 'production' }, async base => {
      await checkRoutes(base, true);
      const payment = await fetch(`${base}/api/payrexx/create-gateway`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"amount":10}' });
      assert.equal(payment.status, 503);
    });
    mkdirSync(path.join(scratch, 'dist'));
    writeFileSync(path.join(scratch, 'dist/index.html'), 'STALE_BUILD_SENTINEL');
    writeFileSync(path.join(scratch, 'dist/stale-only.js'), 'STALE_BUILD_SENTINEL');
    await withServer(scratch, ['--import', 'tsx', 'scripts/dev.ts'], {}, async base => {
      await checkRoutes(base, true);
      assert.equal((await fetch(`${base}/stale-only.js`)).status, 404);
    });
    await withServer(scratch, ['--import', 'tsx', '--import', './tests/fixtures/mock-payrexx.ts', 'scripts/dev.ts'], { ALLOW_EXTERNAL_INTEGRATIONS: 'true', PAYREXX_INSTANCE: 'isolated-test', PAYREXX_API_SECRET: 'test-secret', APP_URL: 'http://localhost:3000' }, async base => {
      for (const amount of [0, -1, 'Infinity', {}, true]) {
        assert.equal((await fetch(`${base}/api/payrexx/create-gateway`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount }) })).status, 400);
      }
      const response = await fetch(`${base}/api/payrexx/create-gateway`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: 'persisted-booking' }) });
      assert.equal(response.status, 401, 'Unverified sessions never open a payment gateway');
    });
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

test('production bundle starts without NODE_ENV and serves compiled routes with SEO', { timeout: 30000 }, async () => {
  assert.ok(existsSync(path.join(root, 'dist/server.cjs')), 'Run npm run build before npm run test:server');
  await withServer(root, ['dist/server.cjs'], {}, async base => {
    await checkRoutes(base, false);
    assert.equal((await fetch(`${base}/api/payrexx/create-gateway`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"amount":10}' })).status, 503);
    const html = await (await fetch(base)).text();
    const script = html.match(/src="(\/assets\/[^\"]+\.js)"/);
    assert.ok(script);
    const asset = await fetch(base + script[1]);
    assert.equal(asset.status, 200);
    assert.match(asset.headers.get('cache-control') || '', /immutable/);
    for (const artifact of ['/server.cjs', '/server.cjs.map', '/stats.html']) assert.equal((await fetch(base + artifact)).status, 404, artifact);
    const spanish = await (await fetch(base + '/services?lang=es')).text();
    assert.match(spanish, /<html lang="es"/);
    assert.match(spanish, /og:url" content="https:\/\/krakenpfm.ch\/services/);
    assert.doesNotMatch(spanish, /Bändigen Sie das Chaos/);
  });
});
