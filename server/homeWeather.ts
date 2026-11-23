import type { RequestHandler } from 'express';

// Port of the approved home worker/weather.js. Cache and request coalescing are
// per Express process; no client cache may extend an observation's validity.
const WEATHER_API = 'https://aviationweather.gov/api/data/metar?ids=LSZH&format=json';
const REFRESH_MS = 20 * 60 * 1000;
const MAX_AGE_MS = 90 * 60 * 1000;
const RETRY_MS = 5 * 60 * 1000;
const CLOUD_PERCENT: Record<string, number> = { SKC: 0, CLR: 0, CAVOK: 0, FEW: 20, SCT: 40, BKN: 80, OVC: 100, VV: 100 };

type Observation = Record<string, unknown>;
export type WeatherSymbol = 'sleet' | 'snow' | 'rain' | 'fog' | 'cloudy' | 'fair' | 'clearsky' | 'unknown';

export interface AvailableWeather {
  available: true;
  provider: 'NOAA AWC';
  kind: 'observation';
  station: 'Zürich-Flughafen (LSZH)';
  sourceUrl: string;
  updatedAt: string;
  fetchedAt: string;
  nextRefreshAt: string;
  validUntil: string;
  stale: boolean;
  timeseries: [{ time: string; temperatureC: number; cloudPercent: number | null; precipitationMm: null; symbolCode: WeatherSymbol }];
}

export interface UnavailableWeather {
  available: false;
  provider: 'NOAA AWC';
  station: 'Zürich-Flughafen (LSZH)';
  error: 'weather_unavailable';
  nextRefreshAt: string;
}

type AvailableEntry = { status: 200; retryAt: number; payload: AvailableWeather };
type CacheEntry = AvailableEntry | { status: 503; retryAt: number; payload: UnavailableWeather };
export interface WeatherServiceOptions {
  fetcher?: typeof fetch;
  clock?: () => number;
}

export function classifyWeather(observation: Observation): WeatherSymbol {
  // Only observed weather, never the TEMPO/BECMG forecast in raw METAR.
  const weather = String(observation.wxString || '').toUpperCase();
  const snow = /SN|SG|IC/.test(weather);
  const rain = /RA|DZ/.test(weather);
  if (snow && rain) return 'sleet';
  if (snow) return 'snow';
  if (rain) return 'rain';
  if (/FG|BR/.test(weather)) return 'fog';
  const cover = String(observation.cover || '').toUpperCase();
  if (['OVC', 'BKN', 'VV'].includes(cover)) return 'cloudy';
  if (['SCT', 'FEW'].includes(cover)) return 'fair';
  if (['SKC', 'CLR', 'CAVOK'].includes(cover)) return 'clearsky';
  return 'unknown';
}

export function normalizeObservation(rows: unknown, now = Date.now()): AvailableWeather {
  if (!Array.isArray(rows)) throw new Error('Invalid weather response');
  const observation = rows
    .filter((row): row is Observation & { obsTime: number } => row?.icaoId === 'LSZH' && Number.isFinite(row.obsTime))
    .sort((a, b) => b.obsTime - a.obsTime)[0];
  if (!observation) throw new Error('Missing LSZH observation');
  const timestamp = observation.obsTime * 1000;
  if (timestamp > now + 5 * 60 * 1000 || now - timestamp > MAX_AGE_MS) {
    throw new Error('Observation outside freshness window');
  }
  if (typeof observation.temp !== 'number' || !Number.isFinite(observation.temp) || observation.temp < -60 || observation.temp > 60) {
    throw new Error('Invalid temperature');
  }
  const updatedAt = new Date(timestamp).toISOString();
  return {
    available: true,
    provider: 'NOAA AWC',
    kind: 'observation',
    station: 'Zürich-Flughafen (LSZH)',
    sourceUrl: 'https://aviationweather.gov/data/api/',
    updatedAt,
    fetchedAt: new Date(now).toISOString(),
    nextRefreshAt: new Date(Math.min(now + REFRESH_MS, timestamp + MAX_AGE_MS)).toISOString(),
    validUntil: new Date(timestamp + MAX_AGE_MS).toISOString(),
    stale: false,
    timeseries: [{
      time: updatedAt,
      temperatureC: observation.temp,
      cloudPercent: CLOUD_PERCENT[String(observation.cover || '').toUpperCase()] ?? null,
      precipitationMm: null,
      symbolCode: classifyWeather(observation)
    }]
  };
}

export function createWeatherService({
  fetcher = (input, init) => fetch(input, init),
  clock = () => Date.now()
}: WeatherServiceOptions = {}) {
  let memory: CacheEntry | null = null;
  let inflight: Promise<CacheEntry> | null = null;

  function unavailable(now: number): CacheEntry {
    return {
      status: 503,
      retryAt: now + RETRY_MS,
      payload: {
        available: false,
        provider: 'NOAA AWC',
        station: 'Zürich-Flughafen (LSZH)',
        error: 'weather_unavailable',
        nextRefreshAt: new Date(now + RETRY_MS).toISOString()
      }
    };
  }

  function usable(entry: CacheEntry | null, now: number): entry is AvailableEntry {
    return !!entry?.payload.available && Date.parse(entry.payload.validUntil) > now;
  }

  async function refresh(): Promise<CacheEntry> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let entry: CacheEntry;
    try {
      const response = await fetcher(WEATHER_API, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'KrakenHomePreview/2.0 https://krakenpfm.ch'
        },
        signal: controller.signal
      });
      if (!response.ok || response.status === 204) throw new Error('Weather service unavailable');
      const payload = normalizeObservation(await response.json(), clock());
      entry = { status: 200, retryAt: Date.parse(payload.nextRefreshAt), payload };
    } catch {
      const retryTime = clock();
      if (usable(memory, retryTime)) {
        const retryAt = Math.min(retryTime + RETRY_MS, Date.parse(memory.payload.validUntil));
        entry = {
          status: 200,
          retryAt,
          payload: { ...memory.payload, stale: true, nextRefreshAt: new Date(retryAt).toISOString() }
        };
      } else entry = unavailable(retryTime);
    } finally {
      clearTimeout(timer);
    }
    memory = entry;
    return entry;
  }

  return async function weatherResponse(): Promise<Response> {
    const now = clock();
    let entry: CacheEntry;
    if (memory && memory.retryAt > now && (!memory.payload.available || usable(memory, now))) entry = memory;
    else {
      if (!inflight) inflight = refresh().finally(() => { inflight = null; });
      entry = await inflight;
    }
    if (entry.payload.available && !usable(entry, clock())) {
      entry = unavailable(clock());
      memory = entry;
    }
    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-cache',
      'X-Content-Type-Options': 'nosniff'
    };
    if (entry.status === 503) headers['Retry-After'] = String(Math.max(1, Math.ceil((entry.retryAt - clock()) / 1000)));
    return new Response(JSON.stringify(entry.payload), { status: entry.status, headers });
  };
}

export function createHomeWeatherHandler(options: WeatherServiceOptions = {}): RequestHandler {
  const weatherResponse = createWeatherService(options);
  return async (_req, res) => {
    const response = await weatherResponse();
    response.headers.forEach((value, name) => res.setHeader(name, value));
    res.status(response.status).send(await response.text());
  };
}
