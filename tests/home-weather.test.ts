import test from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { createServer } from 'node:net';
import { request as httpRequest, type IncomingHttpHeaders } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { normalizeObservation, createWeatherService, createHomeWeatherHandler, classifyWeather } from '../server/homeWeather.ts';

const minute = 60 * 1000;
const initialTime = Date.parse('2026-11-22T13:00:00Z');
const observation = { icaoId: 'LSZH', obsTime: initialTime / 1000, temp: 0, wxString: 'RA', cover: 'BKN' };

test('normalization keeps the approved frontend contract, including zero Celsius and unknown precipitation amount', () => {
  assert.deepEqual(normalizeObservation([observation], initialTime), {
    available: true,
    provider: 'NOAA AWC',
    kind: 'observation',
    station: 'Zürich-Flughafen (LSZH)',
    sourceUrl: 'https://aviationweather.gov/data/api/',
    updatedAt: '2026-11-22T13:00:00.000Z',
    fetchedAt: '2026-11-22T13:00:00.000Z',
    nextRefreshAt: '2026-11-22T13:20:00.000Z',
    validUntil: '2026-11-22T14:30:00.000Z',
    stale: false,
    timeseries: [{ time: '2026-11-22T13:00:00.000Z', temperatureC: 0, cloudPercent: 80, precipitationMm: null, symbolCode: 'rain' }]
  });
});

test('classification uses observed weather and cloud cover, never raw METAR forecasts', () => {
  for (const [wxString, cover, expected] of [
    ['RASN', 'OVC', 'sleet'], ['-SN', 'BKN', 'snow'], ['SG', '', 'snow'], ['IC', '', 'snow'],
    ['+RA', 'FEW', 'rain'], ['DZ', '', 'rain'], ['FG', 'CLR', 'fog'], ['BR', 'OVC', 'fog'],
    ['', 'OVC', 'cloudy'], ['', 'BKN', 'cloudy'], ['', 'VV', 'cloudy'],
    ['', 'SCT', 'fair'], ['', 'FEW', 'fair'], ['', 'SKC', 'clearsky'], ['', 'CLR', 'clearsky'], ['', 'CAVOK', 'clearsky'],
    ['', '', 'unknown'], ['', 'UNRECOGNIZED', 'unknown']
  ]) assert.equal(classifyWeather({ wxString, cover, rawOb: 'TEMPO RA BECMG SN' }), expected);
  const unknown = normalizeObservation([{ ...observation, wxString: '', cover: '' }], initialTime);
  assert.equal(unknown.timeseries[0].symbolCode, 'unknown');
  assert.equal(unknown.timeseries[0].cloudPercent, null);
  assert.equal(unknown.timeseries[0].precipitationMm, null);
});

test('only the latest LSZH observation is selected and refresh cannot extend the 90-minute observation limit', () => {
  const result = normalizeObservation([
    { ...observation, obsTime: observation.obsTime - 30 * 60, temp: 10 },
    { ...observation, icaoId: 'LSGG', obsTime: observation.obsTime + 60, temp: 15 },
    observation
  ], initialTime + 80 * minute);
  assert.equal(result.timeseries[0].temperatureC, 0);
  assert.equal(result.updatedAt, new Date(initialTime).toISOString());
  assert.equal(result.nextRefreshAt, new Date(initialTime + 90 * minute).toISOString());
  assert.equal(result.validUntil, result.nextRefreshAt);
});

test('missing, invalid, expired and excessively future data are rejected instead of coerced', () => {
  for (const rows of [
    null, {}, [], [null], [{ ...observation, icaoId: 'LSGG' }],
    [{ ...observation, obsTime: null }], [{ ...observation, obsTime: String(observation.obsTime) }],
    [{ ...observation, obsTime: (initialTime - 91 * minute) / 1000 }],
    [{ ...observation, obsTime: (initialTime + 6 * minute) / 1000 }],
    ...[null, '0', NaN, Infinity, -61, 61].map(temp => [{ ...observation, temp }])
  ]) assert.throws(() => normalizeObservation(rows, initialTime));
  assert.equal(normalizeObservation([{ ...observation, temp: -10 }], initialTime).timeseries[0].temperatureC, -10);
});

test('concurrent requests share one fixed-station upstream request and cache for exactly 20 minutes', async () => {
  let now = initialTime;
  let calls = 0;
  let release!: (response: Response) => void;
  const serve = createWeatherService({
    clock: () => now,
    fetcher: async (input, init) => {
      calls++;
      assert.equal(input, 'https://aviationweather.gov/api/data/metar?ids=LSZH&format=json');
      assert.equal(new Headers(init?.headers).get('Accept'), 'application/json');
      assert.match(new Headers(init?.headers).get('User-Agent') || '', /Kraken.*https:\/\/krakenpfm\.ch/);
      assert.ok(init?.signal);
      if (calls === 1) return new Promise<Response>(resolve => { release = resolve; });
      return Response.json([{ ...observation, obsTime: now / 1000 }]);
    }
  });
  const pending = [serve(), serve(), serve()];
  assert.equal(calls, 1);
  release(Response.json([observation]));
  const responses = await Promise.all(pending);
  assert.ok(responses.every(response => response.status === 200));
  now += 20 * minute - 1;
  await serve();
  assert.equal(calls, 1);
  now++;
  await serve();
  assert.equal(calls, 2);
});

test('a failed refresh marks valid observations stale, backs off five minutes and recovers', async () => {
  let now = initialTime;
  let calls = 0;
  let offline = false;
  const serve = createWeatherService({
    clock: () => now,
    fetcher: async () => {
      calls++;
      if (offline) throw new Error('offline');
      return Response.json([{ ...observation, obsTime: now / 1000 }]);
    }
  });
  await serve();
  now += 21 * minute;
  offline = true;
  const fallback = await (await serve()).json();
  assert.equal(fallback.stale, true);
  assert.equal(fallback.updatedAt, new Date(initialTime).toISOString());
  assert.equal(fallback.fetchedAt, new Date(initialTime).toISOString());
  assert.equal(fallback.nextRefreshAt, new Date(now + 5 * minute).toISOString());
  now += 5 * minute - 1;
  await serve();
  assert.equal(calls, 2);
  offline = false;
  now++;
  const recovered = await (await serve()).json();
  assert.equal(calls, 3);
  assert.equal(recovered.stale, false);
  assert.equal(recovered.updatedAt, new Date(now).toISOString());
});

test('expired stale weather becomes unavailable with Retry-After and a five-minute failure backoff', async () => {
  let now = initialTime;
  let calls = 0;
  const serve = createWeatherService({
    clock: () => now,
    fetcher: async () => { calls++; if (calls > 1) throw new Error('offline'); return Response.json([observation]); }
  });
  await serve();
  now += 88 * minute;
  const stale = await (await serve()).json();
  assert.equal(stale.nextRefreshAt, new Date(initialTime + 90 * minute).toISOString());
  now = initialTime + 90 * minute;
  const unavailable = await serve();
  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.headers.get('Retry-After'), '300');
  assert.equal(unavailable.headers.get('Cache-Control'), 'private, no-cache');
  assert.equal(unavailable.headers.get('X-Content-Type-Options'), 'nosniff');
  const payload = await unavailable.json();
  assert.deepEqual(payload, {
    available: false, provider: 'NOAA AWC', station: 'Zürich-Flughafen (LSZH)', error: 'weather_unavailable',
    nextRefreshAt: new Date(now + 5 * minute).toISOString()
  });
  assert.equal('timeseries' in payload, false);
  now += 499;
  assert.equal((await serve()).headers.get('Retry-After'), '300');
  assert.equal(calls, 3);
});

test('a timeout aborts the upstream at eight seconds and is cached as unavailable', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let signal: AbortSignal | undefined;
  let calls = 0;
  const serve = createWeatherService({
    clock: () => initialTime,
    fetcher: async (_input, init) => {
      calls++;
      signal = init?.signal || undefined;
      return new Promise<Response>((_resolve, reject) => signal?.addEventListener('abort', () => reject(new Error('aborted')), { once: true }));
    }
  });
  const pending = serve();
  t.mock.timers.tick(7999);
  assert.equal(signal?.aborted, false);
  t.mock.timers.tick(1);
  assert.equal(signal?.aborted, true);
  assert.equal((await pending).status, 503);
  await serve();
  assert.equal(calls, 1);
});

test('empty, malformed, no-content and failed upstream responses never become sunny weather', async () => {
  const responses = [
    ...[[], {}, [{ ...observation, obsTime: null }], [{ ...observation, temp: null }]].map(value => () => Response.json(value)),
    () => new Response(null, { status: 204 }),
    () => new Response('rate limited', { status: 429 }),
    () => new Response('bad gateway', { status: 502 }),
    () => new Response('not json', { headers: { 'Content-Type': 'application/json' } })
  ];
  for (const response of responses) {
    const serve = createWeatherService({ clock: () => initialTime, fetcher: async () => response() });
    const result = await serve();
    assert.equal(result.status, 503);
    const body = await result.json();
    assert.equal(body.available, false);
    assert.equal('timeseries' in body, false);
  }
});

test('freshness is checked after provider JSON is read, including delayed responses', async () => {
  let now = initialTime + 89 * minute;
  const serve = createWeatherService({
    clock: () => now,
    fetcher: async () => {
      now = initialTime + 91 * minute;
      return Response.json([observation]);
    }
  });
  assert.equal((await serve()).status, 503);
});

test('Express adapter serves JSON before a site fallback and keeps its independent cache', async t => {
  const app = express();
  let calls = 0;
  app.get('/api/weather/zurich', createHomeWeatherHandler({
    clock: () => initialTime,
    fetcher: async () => { calls++; return Response.json([observation]); }
  }));
  app.use((_req, res) => { res.type('html').send('<main>site</main>'); });
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())));
  await new Promise<void>(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  for (let i = 0; i < 2; i++) {
    const response = await fetch(`${base}/api/weather/zurich?latitude=0&station=LSGG`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('Content-Type') || '', /^application\/json/);
    assert.equal(response.headers.get('Cache-Control'), 'private, no-cache');
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    assert.equal((await response.json()).station, 'Zürich-Flughafen (LSZH)');
  }
  assert.equal(calls, 1);
  assert.equal(await (await fetch(`${base}/about`)).text(), '<main>site</main>');
});

test('actual server marks preview hosts noindex and injects home metadata before serving the SPA', async t => {
  const directory = await mkdtemp(path.join(tmpdir(), 'kraken-home-server-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(path.join(directory, 'dist'));
  const html = (marker: string) => `<html><head><title>fixture</title></head><body>${marker}</body></html>`;
  await writeFile(path.join(directory, 'dist/index.html'), html('prerender-home-bypass'));
  await writeFile(path.join(directory, 'dist/index-spa.html'), html('spa-home-injected'));
  await writeFile(path.join(directory, 'dist/about.html'), html('existing-prerendered-route'));
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = (reservation.address() as AddressInfo).port;
  await new Promise<void>((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
  const child = spawn(process.execPath, ['--import', import.meta.resolve('tsx'), fileURLToPath(new URL('../server.ts', import.meta.url))], {
    cwd: directory,
    env: { ...process.env, NODE_ENV: 'production', PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  t.after(async () => {
    if (child.exitCode === null) { const exited = once(child, 'exit'); child.kill('SIGTERM'); await exited; }
  });
  await new Promise<void>((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('Local server startup timed out')), 8000);
    child.stdout.on('data', chunk => {
      output += chunk;
      if (output.includes(`Server running on port ${port}`)) { clearTimeout(timer); resolve(); }
    });
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Local server exited ${code}`)); });
  });
  const get = (pathname: string, host = 'preview.example') => new Promise<{ status: number; headers: IncomingHttpHeaders; body: string }>((resolve, reject) => {
    const request = httpRequest({ hostname: '127.0.0.1', port, path: pathname, headers: { Host: host } }, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode!, headers: response.headers, body }));
      response.on('error', reject);
    });
    request.on('error', reject);
    request.end();
  });
  for (const host of ['preview.example', 'localhost', 'krakenpfm.ch.example']) {
    const response = await get('/api/health', host);
    assert.equal(response.headers['x-robots-tag'], 'noindex, nofollow');
    assert.deepEqual(JSON.parse(response.body), { status: 'ok' });
  }
  for (const host of ['krakenpfm.ch', 'www.krakenpfm.ch']) {
    const response = await get('/api/health', host);
    assert.equal(response.headers['x-robots-tag'], undefined);
  }
  const home = await get('/');
  assert.equal(home.status, 200);
  assert.equal(home.headers['x-robots-tag'], 'noindex, nofollow');
  const markup = home.body;
  assert.ok(markup.includes('spa-home-injected'));
  assert.ok(!markup.includes('prerender-home-bypass'));
  assert.ok(!markup.includes('<title>fixture</title>'), 'home title must pass through injectSeoMeta');
  const about = await get('/about');
  assert.ok(about.body.includes('existing-prerendered-route'));
});
