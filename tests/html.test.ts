import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderInitialHtml } from '../server/html.ts';

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
