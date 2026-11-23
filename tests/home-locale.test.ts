import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { I18nProvider, useTranslation } from '../i18n.ts';
import { languageFromSearch, languageSelectionUrl, localizedNavigationUrl, normalizeSiteLanguage, resolveSiteLanguage } from '../src/locale.ts';

test('URL language and hl override saved preferences, including homepage and regional aliases', () => {
  for (const language of ['de', 'en', 'fr', 'it', 'es', 'pt'] as const) {
    assert.equal(resolveSiteLanguage({ search: `?lang=${language}`, saved: 'de-CH' }), language);
    assert.equal(resolveSiteLanguage({ search: `?hl=${language}`, saved: 'de-CH' }), language);
  }
  assert.equal(resolveSiteLanguage({ search: '?lang=invalid&hl=fr-CH', saved: 'es' }), 'fr');
  assert.equal(resolveSiteLanguage({ search: '?lang=DE-ch', saved: 'es' }), 'de-CH');
  assert.equal(resolveSiteLanguage({ saved: 'pt', browserLanguage: 'de-CH' }), 'pt');
  assert.equal(resolveSiteLanguage({ browserLanguage: 'de-DE' }), 'de');
  assert.equal(resolveSiteLanguage(), 'de-CH');
  assert.equal(normalizeSiteLanguage('constructor'), null);
  assert.equal(normalizeSiteLanguage('https://example.com'), null);
});

test('language choice preserves unrelated query and hash, and removes a stale hl alias', () => {
  const next = languageSelectionUrl('https://krakenpfm.ch/?hl=de&utm_source=referral#leistungen', 'es');
  const url = new URL(next, 'https://krakenpfm.ch');
  assert.equal(url.pathname, '/');
  assert.equal(url.searchParams.get('lang'), 'es');
  assert.equal(url.searchParams.has('hl'), false);
  assert.equal(url.searchParams.get('utm_source'), 'referral');
  assert.equal(url.hash, '#leistungen');
});

test('calculator navigation carries the active locale even without storage and merges target queries once', () => {
  for (const language of ['de', 'en', 'fr', 'it', 'es', 'pt'] as const) {
    const route = localizedNavigationUrl('/quote', 'https://krakenpfm.ch/?lang=de-CH#leistungen', language);
    assert.equal(route, `/quote?lang=${language}`);
    assert.equal(languageFromSearch(new URL(route, 'https://krakenpfm.ch').search), language);
  }
  const merged = new URL(localizedNavigationUrl('/quote?step=2&service=moving#details', 'https://krakenpfm.ch/?hl=de&step=1&utm=a&utm=b', 'fr'), 'https://krakenpfm.ch');
  assert.equal(merged.pathname, '/quote');
  assert.equal(merged.searchParams.get('lang'), 'fr');
  assert.equal(merged.searchParams.get('step'), '2');
  assert.equal(merged.searchParams.get('service'), 'moving');
  assert.deepEqual(merged.searchParams.getAll('utm'), ['a', 'b']);
  assert.equal(merged.searchParams.has('hl'), false);
  assert.equal(merged.hash, '#details');
  assert.equal(localizedNavigationUrl('/quote?lang=it', 'https://krakenpfm.ch/?lang=es', 'fr'), '/quote?lang=it');
  assert.throws(() => localizedNavigationUrl('//other.example/quote', 'https://krakenpfm.ch/', 'es'));
});

test('provider starts in the homepage URL language even when storage access is blocked', () => {
  const previousWindow = globalThis.window;
  const Probe = () => React.createElement('span', null, useTranslation().language);
  try {
    globalThis.window = {
      location: { pathname: '/', search: '?lang=es' },
      get localStorage() { throw new Error('Storage blocked'); }
    } as unknown as Window & typeof globalThis;
    assert.match(renderToString(React.createElement(I18nProvider, null, React.createElement(Probe))), />es<\/span>/);
    globalThis.window = {
      location: { pathname: '/', search: '' },
      localStorage: { getItem: () => 'fr' }
    } as unknown as Window & typeof globalThis;
    assert.match(renderToString(React.createElement(I18nProvider, null, React.createElement(Probe))), />fr<\/span>/);
  } finally { globalThis.window = previousWindow; }
});
