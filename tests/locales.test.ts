import { test } from 'node:test';
import assert from 'node:assert/strict';
import { languageFromInputs, preloadLanguage, translations, type Language } from '../i18n';
test('explicit language, stored preference and safe German fallback retain precedence', () => {
  assert.equal(languageFromInputs('?lang=es','fr','de-CH'),'es');
  assert.equal(languageFromInputs('?hl=fr-CH','es','de-CH'),'fr');
  assert.equal(languageFromInputs('?lang=bad','it','de-CH'),'it');
  assert.equal(languageFromInputs('',null,'de-CH'),'de-CH');
  assert.equal(languageFromInputs('',null,'en-US'),'de-CH');
});
test('all six dictionaries load independently and preserve established key coverage', async () => {
  for(const locale of ['de','en','es','fr','it','pt'] as Language[]) {
    await preloadLanguage(locale);
    assert.ok(Object.keys(translations[locale]).length >= 1600,locale);
    assert.ok(translations[locale]['nav.services'],locale);
    assert.ok(translations[locale]['hero.main_cta'],locale);
  }
  assert.equal(translations.es['nav.services'],'Servicios');
  assert.equal(translations.en['nav.services'],'Services');
});
