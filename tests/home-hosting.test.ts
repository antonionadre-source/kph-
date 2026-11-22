import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { publishVercelAssets } from '../scripts/build-vercel.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverUrl = new URL('../server.ts', import.meta.url).href;

function fixture() {
  const directory = mkdtempSync(path.join(tmpdir(), 'kraken-hosting-'));
  mkdirSync(path.join(directory, 'dist/assets'), { recursive: true });
  mkdirSync(path.join(directory, 'public/assets'), { recursive: true });
  writeFileSync(path.join(directory, 'dist/index.html'), '<html><head><title>fixture</title></head><body>APP_TEMPLATE</body></html>');
  writeFileSync(path.join(directory, 'dist/assets/app-a1b2c3d4.js'), 'FRONTEND');
  writeFileSync(path.join(directory, 'dist/assets/app-a1b2c3d4.css'), 'FRONTEND_CSS');
  writeFileSync(path.join(directory, 'dist/assets/app-a1b2c3d4.js.map'), 'PRIVATE_MAP');
  writeFileSync(path.join(directory, 'dist/server.cjs'), 'PRIVATE_NODE_BUNDLE');
  writeFileSync(path.join(directory, 'dist/server.cjs.map'), 'PRIVATE_NODE_MAP');
  writeFileSync(path.join(directory, 'dist/stats.html'), 'PRIVATE_STATS');
  writeFileSync(path.join(directory, 'public/assets/stale-old.js'), 'STALE');
  writeFileSync(path.join(directory, 'public/logo.webp'), 'EXISTING_PUBLIC_IMAGE');
  return directory;
}

async function childCheck(directory: string, source: string) {
  const child = spawn(process.execPath, ['--import', import.meta.resolve('tsx'), '--input-type=module', '-e', source], {
    cwd: directory,
    env: { ...process.env, VERCEL: '1', NODE_ENV: 'development', GEMINI_API_KEY: '', PAYREXX_INSTANCE: '', PAYREXX_API_SECRET: '' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let output = '';
  child.stdout.on('data', data => { output += data; });
  child.stderr.on('data', data => { output += data; });
  const result = await new Promise<number | null>((resolve, reject) => {
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error(`Isolated server timed out: ${output}`)); }, 15000);
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); resolve(code); });
  });
  assert.equal(result, 0, output);
  return output;
}

test('Vercel asset preparation publishes frontend bundles while preserving public images and server-only HTML', () => {
  const directory = fixture();
  try {
    publishVercelAssets(directory);
    assert.equal(readFileSync(path.join(directory, 'public/assets/app-a1b2c3d4.js'), 'utf8'), 'FRONTEND');
    assert.equal(readFileSync(path.join(directory, 'public/assets/app-a1b2c3d4.css'), 'utf8'), 'FRONTEND_CSS');
    assert.equal(readFileSync(path.join(directory, 'public/logo.webp'), 'utf8'), 'EXISTING_PUBLIC_IMAGE');
    for (const file of ['public/index.html', 'public/server.cjs', 'public/server.cjs.map', 'public/stats.html', 'public/assets/app-a1b2c3d4.js.map', 'public/assets/stale-old.js', 'dist/stats.html']) {
      assert.equal(existsSync(path.join(directory, file)), false, file);
    }
    assert.ok(existsSync(path.join(directory, 'dist/index.html')));
    assert.ok(existsSync(path.join(directory, 'dist/server.cjs')));
    publishVercelAssets(directory);
    assert.equal(readFileSync(path.join(directory, 'public/assets/app-a1b2c3d4.js'), 'utf8'), 'FRONTEND');
    writeFileSync(path.join(directory, 'public/index.html'), 'WRONG_STATIC_HOME');
    assert.throws(() => publishVercelAssets(directory), /bypass Express SEO/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('Vercel native Express configuration keeps templates private and defines the overridden build command', () => {
  const config = JSON.parse(readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(config.framework, 'express');
  assert.equal(config.buildCommand, 'npm run build:vercel');
  assert.equal(pkg.scripts['build:vercel'], 'node scripts/build-vercel.mjs');
  assert.equal(config.outputDirectory, null);
  assert.equal(config.functions['server.ts'].includeFiles, 'dist/*.html');
  assert.match(config.functions['server.ts'].excludeFiles, /public\/\*\*/);
  assert.match(config.functions['server.ts'].excludeFiles, /\.env\*/);
  assert.equal(config.rewrites, undefined, 'native Express owns routes; no SPA rewrite may swallow APIs');
});

test('Vercel imports the application without a port or process lifecycle handlers', async () => {
  const directory = fixture();
  try {
    const output = await childCheck(directory, `
      import assert from 'node:assert/strict';
      import { Server } from 'node:net';
      const signals = ['SIGTERM', 'SIGINT', 'unhandledRejection', 'uncaughtException'];
      const before = signals.map(signal => process.listenerCount(signal));
      Server.prototype.listen = function () { throw new Error('The serverless app attempted to listen'); };
      const module = await import(${JSON.stringify(serverUrl)});
      assert.equal(typeof module.default, 'function');
      await module.appReady;
      assert.equal(process.env.NODE_ENV, 'production');
      assert.deepEqual(signals.map(signal => process.listenerCount(signal)), before);
      console.log('SERVERLESS_IMPORT_OK');
    `);
    assert.match(output, /SERVERLESS_IMPORT_OK/);
    assert.doesNotMatch(output, /Server running on port|Vite development server middleware/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('exported app retains API, weather, redirects, SEO and safe asset routing with mocked external services', async () => {
  const directory = fixture();
  try {
    await childCheck(directory, `
      import assert from 'node:assert/strict';
      import { createServer, request } from 'node:http';
      let weatherCalls = 0;
      globalThis.fetch = async input => {
        assert.equal(input, 'https://aviationweather.gov/api/data/metar?ids=LSZH&format=json');
        weatherCalls++;
        return Response.json([{ icaoId: 'LSZH', obsTime: Date.now() / 1000, temp: 0, wxString: 'RA', cover: 'BKN' }]);
      };
      const { default: app } = await import(${JSON.stringify(serverUrl)});
      const server = createServer(app);
      await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
      const port = server.address().port;
      const get = (pathname, method = 'GET', data) => new Promise((resolve, reject) => {
        const call = request({ hostname: '127.0.0.1', port, path: pathname, method,
          headers: { Host: 'krakenpfm.ch', 'Content-Type': 'application/json' } }, response => {
          let body = ''; response.setEncoding('utf8');
          response.on('data', chunk => body += chunk);
          response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body }));
        });
        call.on('error', reject); call.end(data);
      });
      try {
        assert.deepEqual(JSON.parse((await get('/api/health')).body), { status: 'ok' });
        for (let i = 0; i < 2; i++) {
          const weather = await get('/api/weather/zurich');
          assert.equal(weather.status, 200);
          assert.equal(JSON.parse(weather.body).timeseries[0].temperatureC, 0);
          assert.equal(weather.headers['cache-control'], 'private, no-cache');
        }
        assert.equal(weatherCalls, 1);
        assert.equal((await get('/api/chat', 'POST', '{}')).status, 400);
        const chat = await get('/api/chat', 'POST', JSON.stringify({ messages: [{ role: 'user', text: 'hola' }], language: 'es' }));
        assert.equal(chat.status, 200); assert.equal(JSON.parse(chat.body).success, true);
        const payment = await get('/api/payrexx/create-gateway', 'POST', JSON.stringify({ amount: 10 }));
        assert.equal(payment.status, 500); assert.equal(JSON.parse(payment.body).success, false);
        assert.equal((await get('/api/download-zip')).status, 404);
        const redirect = await get('/contacto?lang=es');
        assert.equal(redirect.status, 301); assert.equal(redirect.headers.location, '/kontakt?lang=es');
        const home = await get('/');
        assert.equal(home.status, 200); assert.ok(home.body.includes('APP_TEMPLATE'));
        assert.ok(!home.body.includes('<title>fixture</title>'));
        assert.equal(home.headers['x-robots-tag'], undefined);
        const quote = await get('/quote?lang=es');
        assert.equal(quote.status, 200); assert.match(quote.body, /<title>[^<]*Kraken/);
        assert.equal((await get('/not-a-kraken-page')).status, 404);
        const bundle = await get('/assets/app-a1b2c3d4.js');
        assert.equal(bundle.status, 200); assert.equal(bundle.body, 'FRONTEND');
        assert.match(bundle.headers['cache-control'], /immutable/);
        assert.equal((await get('/logo.webp')).body, 'EXISTING_PUBLIC_IMAGE');
        for (const pathname of ['/server.cjs', '/server%2ecjs', '/server.cjs.map', '/stats.html', '/assets/app-a1b2c3d4.js.map']) {
          const response = await get(pathname);
          assert.equal(response.status, 404, pathname);
          assert.ok(!response.body.includes('PRIVATE_'), pathname);
        }
        console.log('SERVERLESS_ROUTES_OK');
      } finally { await new Promise(resolve => server.close(resolve)); }
    `);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
