import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getMetadataForPath, HOME_METADATA } from '../seoConfig.ts';
import { homeText, normalizeHomeLanguage } from '../components/home/homeTranslations.ts';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('the approved homepage localizes metadata while keeping the public canonical across language sessions', () => {
  for (const language of ['de', 'de-CH', 'en', 'es', 'fr', 'it', 'pt']) {
    const metadata = getMetadataForPath('/?lang=' + language, language);
    const locale = normalizeHomeLanguage(language);
    assert.equal(metadata.title, homeText(locale, HOME_METADATA.title));
    assert.equal(metadata.description, homeText(locale, HOME_METADATA.description));
    assert.equal(getMetadataForPath('/?lang=' + language).title, metadata.title);
    assert.equal(metadata.canonical, 'https://krakenpfm.ch/');
    assert.equal(metadata.pageType, 'home');
    assert.equal(metadata.h1, homeText(locale, 'Ihr Zuhause in guten Armen.'));
    assert.equal(metadata.h2, homeText(locale, 'Reinigung und kleine Umzüge in Zürich, Schaffhausen und Winterthur.'));
    assert.equal(metadata.bodyText, metadata.description);
    assert.deepEqual(metadata.hreflangs, []);
    assert.match(metadata.description, /Zürich|Zurich|Zúrich|Zurique|Zurigo/);
    assert.match(metadata.description, /Schaffhausen|Schaffhouse/);
    assert.match(metadata.description, /Winterthur|Winterthour/);
    if (!['de', 'de-CH'].includes(language)) {
      assert.notEqual(metadata.title, HOME_METADATA.title);
      assert.notEqual(metadata.description, HOME_METADATA.description);
      assert.notEqual(metadata.h1, 'Ihr Zuhause in guten Armen.');
    }
  }
  assert.equal(getMetadataForPath('/?hl=es').title, getMetadataForPath('/', 'es').title);
  assert.equal(getMetadataForPath('/', 'de-CH').title, HOME_METADATA.title);
});

test('calculator and informational routes retain their existing localized metadata', () => {
  const quote = getMetadataForPath('/quote?lang=es', 'es');
  assert.equal(quote.title, 'Presupuesto instantáneo y consulta | Kraken Properties and Facilities Management');
  assert.equal(quote.canonical, 'https://krakenpfm.ch/quote');
  assert.equal(quote.pageType, 'consultation');
  const about = getMetadataForPath('/about', 'en');
  assert.equal(about.title, 'About Us | Kraken Properties and Facilities Management');
});

test('the initial HTML exposes the approved five services without fabricated prices, ratings or opening hours', () => {
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json);
  const business = JSON.parse(json);
  assert.equal(business.url, 'https://krakenpfm.ch/');
  assert.equal(business.email, 'kai@krakenpfm.ch');
  assert.deepEqual(business.areaServed.map((city: { name: string }) => city.name), ['Zürich', 'Schaffhausen', 'Winterthur']);
  assert.deepEqual(business.hasOfferCatalog.itemListElement.map((offer: { itemOffered: { name: string } }) => offer.itemOffered.name), [
    'Fensterreinigung', 'Umzugsreinigung', 'Regelmässige Reinigung', 'Grundreinigung', 'Kleine Umzüge',
  ]);
  assert.doesNotMatch(json, /"(?:priceRange|price|lowPrice|highPrice|aggregateRating|ratingValue|review|openingHours)"/);
  assert.match(html, /<html lang="de-CH">/);
  assert.match(html, /href="\/quote"/);
  assert.match(html, /href="\/home-approved\/assets\/hero-room-day-v4\.webp"/);
  assert.doesNotMatch(html, /imagen-google-ai-compatible-(?:mobile|desktop)\.webp/);
  assert.doesNotMatch(html, /Bändigen Sie das Chaos|All-in-One Lösung/);
});
