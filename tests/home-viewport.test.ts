import test from 'node:test';
import assert from 'node:assert/strict';
import { bindVisualViewport } from '../src/viewport.js';

function fixture(height = 844) {
  const viewport = Object.assign(new EventTarget(), { height, offsetTop: 0 });
  const source = Object.assign(new EventTarget(), { innerHeight: height, visualViewport: viewport });
  const values = new Map<string, string>();
  const element = { style: {
    getPropertyValue: (name: string) => values.get(name) || '',
    setProperty: (name: string, value: string) => { values.set(name, value); },
    removeProperty: (name: string) => { values.delete(name); },
  } };
  return { source, viewport, element, values };
}

test('keyboard opening and viewport panning keep fixed actions inside the visible area', () => {
  const { source, viewport, element, values } = fixture();
  const dispose = bindVisualViewport(element as unknown as HTMLElement, source as unknown as Window);
  assert.equal(values.get('--kraken-viewport-height'), '844px');
  viewport.height = 360;
  viewport.offsetTop = 40;
  viewport.dispatchEvent(new Event('resize'));
  assert.equal(values.get('--kraken-viewport-height'), '360px');
  assert.equal(values.get('--kraken-viewport-top'), '40px');
  assert.equal(values.get('--kraken-viewport-bottom'), '444px');
  viewport.offsetTop = 80;
  viewport.dispatchEvent(new Event('scroll'));
  assert.equal(values.get('--kraken-viewport-bottom'), '404px');
  dispose();
});

test('orientation changes work without VisualViewport, and disposal restores styles and removes listeners', () => {
  const { source, element, values } = fixture();
  delete (source as { visualViewport?: EventTarget }).visualViewport;
  values.set('--kraken-viewport-height', '600px');
  const dispose = bindVisualViewport(element as unknown as HTMLElement, source as unknown as Window);
  source.innerHeight = 320;
  source.dispatchEvent(new Event('orientationchange'));
  assert.equal(values.get('--kraken-viewport-height'), '320px');
  assert.equal(values.get('--kraken-viewport-bottom'), '0px');
  dispose();
  assert.equal(values.get('--kraken-viewport-height'), '600px');
  assert.equal(values.has('--kraken-viewport-top'), false);
  source.innerHeight = 900;
  source.dispatchEvent(new Event('resize'));
  assert.equal(values.get('--kraken-viewport-height'), '600px');
});
