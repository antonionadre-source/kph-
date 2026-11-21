import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderInitialHtml } from '../server/html.ts';
import { BASE_URL, getMetadataForPath, VALID_CITIES, VALID_SERVICES } from '../seoConfig.ts';
import { MUNICIPALITIES } from '../src/data/locations.ts';
import { catalogCopy, fillCopy } from '../src/content/catalogCopy.ts';
import { serviceName } from '../src/content/serviceCatalog.ts';
import { portalText } from '../components/portalText.ts';

test('built-style initial document receives route content, language and sharing metadata without executable HTML', () => {
  const template = fs.readFileSync('index.html', 'utf8');
  const html = renderInitialHtml(template, { title: 'Servicios | Kraken', description: 'Limpieza & mantenimiento', canonical: 'https://krakenpfm.ch/services', h1: 'Servicios de Kraken', bodyText: '<em>Texto como contenido</em>' }, 'es');
  assert.match(html, /<html lang="es"/);
  assert.match(html, /og:url" content="https:\/\/krakenpfm.ch\/services"/);
  assert.match(html, /og:locale" content="es_ES"/);
  assert.match(html, /<h1>Servicios de Kraken<\/h1>/);
  assert.match(html, /&lt;em&gt;Texto como contenido&lt;\/em&gt;/);
  assert.doesNotMatch(html, /<em>Texto como contenido/);
  assert.doesNotMatch(html, /Bändigen Sie das Chaos/);
});

test('location and service metadata follow the six-language catalogue without price or guarantee claims', () => {
  for (const language of ['de', 'en', 'es', 'fr', 'it', 'pt']) {
    const copy = catalogCopy(language);
    const paths = ['/einsatzgebiete', '/services', '/commercial', '/commercial-quote', '/quote',
      '/reinigung/kanton-schaffhausen', '/reinigung/region-winterthur', '/reinigung/region-zuerich',
      ...MUNICIPALITIES.map(m => '/reinigung/' + m.slug),
      ...VALID_CITIES.flatMap(city => VALID_SERVICES.map(service => `/services/${city}/${service}`))];
    for (const path of paths) {
      const meta = getMetadataForPath(path + '?lang=' + language, language);
      assert.equal(meta.canonical, BASE_URL + path);
      assert.deepEqual(meta.hreflangs, []);
      assert.doesNotMatch(meta.title + meta.description, /CHF|100%|GAV|garant|certif|Meisterklasse|Masterclass/i, path + '/' + language);
      assert.ok(meta.h1 && meta.bodyText, path);
    }
    const service = getMetadataForPath('/services/zurich/window-cleaning', language);
    assert.ok(service.h1.includes(serviceName(language, 'window-cleaning')!));
    const place = getMetadataForPath('/reinigung/thayngen', language);
    assert.equal(place.h1, fillCopy(copy.locationTitle, { place: 'Thayngen' }));
    assert.equal(place.description, copy.locationIntro);
  }
});

test('access metadata localizes login and registration, and Spanish municipal content reaches initial HTML', () => {
  for (const language of ['de', 'en', 'es', 'fr', 'it', 'pt']) {
    assert.ok(getMetadataForPath('/login', language).title.startsWith(portalText(language, 'signIn')));
    assert.ok(getMetadataForPath('/register', language).title.startsWith(portalText(language, 'createAccount')));
  }
  const meta = getMetadataForPath('/reinigung/thayngen', 'es');
  const html = renderInitialHtml(fs.readFileSync('index.html', 'utf8'), meta, 'es');
  assert.match(html, /<html lang="es"/);
  assert.ok(html.includes(`<h1>${meta.h1}</h1>`));
  assert.ok(html.includes(`content="${meta.description}"`));
  assert.doesNotMatch(html, /Abnahmegarantie|GAV-konform|CHF 520/);
});
