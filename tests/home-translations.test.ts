import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import {
  homeLanguages, homeText, homeTranslations, homeTranslationSources, normalizeHomeLanguage,
} from '../components/home/homeTranslations';

const normaliseSource = (source: string) => source.replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const placeholders = (text: string) => [...text.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(match => match[1]).sort();

test('all six homepage dictionaries cover every source without duplicates or blank copy', () => {
  assert.deepEqual(homeLanguages.map(language => language.code).sort(), ['de', 'en', 'es', 'fr', 'it', 'pt']);
  assert.equal(new Set(homeTranslationSources).size, homeTranslationSources.length);
  for (const { code, locale, label, flag } of homeLanguages) {
    assert.ok(locale && label && flag);
    assert.deepEqual(Object.keys(homeTranslations[code]).sort(), [...homeTranslationSources].sort());
    for (const source of homeTranslationSources) {
      assert.ok(homeTranslations[code][source].trim(), code + ': ' + source);
      if (code === 'de') assert.equal(homeTranslations[code][source], source);
    }
  }
});

test('runtime placeholders survive translation and receive literal own-property values', () => {
  for (const { code } of homeLanguages) {
    for (const source of homeTranslationSources) {
      assert.deepEqual(placeholders(homeTranslations[code][source]), placeholders(source), code + ': ' + source);
      if (!placeholders(source).length) continue;
      const params = Object.fromEntries(placeholders(source).map(name => [name, name + ' <Kai> $&']));
      const translated = homeText(code, source, params);
      assert.deepEqual(placeholders(translated), [], code + ': unresolved parameter in ' + source);
      for (const value of Object.values(params)) assert.ok(translated.includes(value));
    }
  }
  assert.equal(homeText('es', '{service} ausgewählt.', { service: 'Ventanas $&' }), 'Servicio seleccionado: Ventanas $&.');
  assert.equal(homeText('en', 'Aktuelle Sprache: {language}'), 'Current language: {language}');
  const inherited = Object.create({ language: 'inherited value' }) as Record<string, string>;
  assert.equal(homeText('en', 'Aktuelle Sprache: {language}', inherited), 'Current language: {language}');
});

test('regional aliases work and invalid or prototype-like locale/source values fall back safely', () => {
  for (const [input, expected] of [
    ['de-CH', 'de'], ['DE_ch', 'de'], ['en-US', 'en'], ['es-ES', 'es'],
    ['pt-BR', 'pt'], ['it-CH', 'it'], ['fr-CH', 'fr'],
  ] as const) assert.equal(normalizeHomeLanguage(input), expected);
  for (const input of [null, undefined, '', {}, [], 42, '__proto__', 'constructor', 'toString', 'xx-XX']) {
    assert.equal(normalizeHomeLanguage(input), 'de');
    assert.equal(homeText(input, 'Menü öffnen'), 'Menü öffnen');
  }
  for (const source of ['__proto__', 'constructor', 'toString', 'Unbekannte neue Quelle']) {
    assert.equal(homeText('fr', source), source);
  }
  assert.equal(homeText('it', 'Böden &amp; mehr'), 'Pavimenti e non solo');
  assert.equal(homeText('fr', '  Menü öffnen  '), ' Ouvrir le menu ');
});

test('the integrated page, selector and runtime branches only request covered translation sources', () => {
  const known = new Set<string>(homeTranslationSources);
  const sources: { file: string; text: string; line: number }[] = [];
  const untranslated: { file: string; text: string; line: number }[] = [];
  const fixedBrandData = new Set([
    'Kraken', 'Properties and Facilities', 'Management', '01', '02', '03',
    'kai@krakenpfm.ch', 'Kraken PFM', 'Seewadelstrasse 3', '+41 77 450 57 05',
    'Instagram', 'LinkedIn', 'WhatsApp', '©', '2026', '🌎',
    'Kraken Properties and Facilities Management Gomes Mendes', 'seociety.ch',
  ]);
  const runtimeMaps = new Set(['seasonNames', 'weatherNames', 'phaseNames', 'holidayNames', 'descriptions', 'imageDescriptions']);
  const files = [
    'ApprovedHome.tsx', 'HomeLanguageSelector.tsx', '../Footer.tsx', 'app.js', 'scene.js', 'van.js',
  ];
  for (const file of files) {
    const parsed = ts.createSourceFile(file, readFileSync(new URL('../components/home/' + file, import.meta.url), 'utf8'),
      ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.JS);
    const add = (node: ts.Node, text: string) => sources.push({
      file, text: normaliseSource(text), line: parsed.getLineAndCharacterOfPosition(node.getStart()).line + 1,
    });
    function literals(expression: ts.Node | undefined): void {
      if (!expression) return;
      if (ts.isStringLiteralLike(expression)) add(expression, expression.text);
      else if (ts.isConditionalExpression(expression)) {
        literals(expression.whenTrue);
        literals(expression.whenFalse);
      } else if (ts.isParenthesizedExpression(expression)) literals(expression.expression);
    }
    function dataValues(node: ts.Node): void {
      if (ts.isStringLiteralLike(node)) add(node, node.text);
      else ts.forEachChild(node, dataValues);
    }
    function walk(node: ts.Node): void {
      if (ts.isCallExpression(node) && node.expression.getText(parsed) === 't') literals(node.arguments[0]);
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
        if (runtimeMaps.has(node.name.text)) dataValues(node.initializer);
        if (node.name.text === 'services' && ts.isObjectLiteralExpression(node.initializer)) {
          for (const service of node.initializer.properties) {
            if (!ts.isPropertyAssignment(service) || !ts.isObjectLiteralExpression(service.initializer)) continue;
            for (const value of service.initializer.properties) {
              if (ts.isPropertyAssignment(value) && ['name', 'hint'].includes(value.name.getText(parsed))) literals(value.initializer);
            }
          }
        }
      }
      // User-visible JSX prose and accessible names need a translation call.
      let raw = '';
      if (ts.isJsxText(node)) raw = normaliseSource(node.text);
      if (ts.isJsxAttribute(node) && ['aria-label', 'alt', 'title'].includes(node.name.getText(parsed))
        && node.initializer && ts.isStringLiteral(node.initializer)) raw = normaliseSource(node.initializer.text);
      if (raw && !fixedBrandData.has(raw)) untranslated.push({
        file, text: raw, line: parsed.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
      ts.forEachChild(node, walk);
    }
    walk(parsed);
  }
  assert.ok(sources.length > 0);
  assert.deepEqual(sources.filter(source => !known.has(source.text)), []);
  assert.deepEqual(untranslated, []);
});

test('the visible split hero matches its complete translated heading and service labels stay whole', () => {
  for (const { code } of homeLanguages) {
    const heading = ['Ihr Zuhause', 'in guten', 'Armen.'].map(source => homeText(code, source)).join(' ');
    assert.equal(heading, homeText(code, 'Ihr Zuhause in guten Armen.'));
    for (const service of ['Fensterreinigung', 'Umzugsreinigung', 'Regelmässige Reinigung', 'Grundreinigung', 'Kleine Umzüge']) {
      assert.ok(homeTranslationSources.includes(service as typeof homeTranslationSources[number]));
      if (code !== 'de') assert.notEqual(homeText(code, service), service);
    }
  }
});
