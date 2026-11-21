import { test } from 'node:test';
import assert from 'node:assert/strict';
import { internalDestination } from '../src/navigation';
import { getServiceLinkForMunicipality, parsePath } from '../seoConfig';
test('municipal service navigation preserves anchors and language in the correct order', () => {
  for(const [municipality,page] of [['thayngen','municipality-page'],['wilchingen','region-hub']]) {
    const destination=internalDestination(getServiceLinkForMunicipality(municipality,'window-cleaning'),'https://krakenpfm.ch/services?lang=es');
    assert.match(destination.href,/\?lang=es#window-cleaning$/);
    assert.equal(parsePath(destination.href).page,page);
  }
});
test('explicit query wins and old payment-return flags do not leak to another route', () => {
  assert.equal(internalDestination('/services?lang=fr','https://krakenpfm.ch/quote?payment=success&lang=es').href,'/services?lang=fr');
  assert.equal(internalDestination('/services','https://krakenpfm.ch/quote?payment=success&lang=es').href,'/services?lang=es');
  assert.throws(()=>internalDestination('https://example.invalid','https://krakenpfm.ch/'));
});
