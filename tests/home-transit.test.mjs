import test from 'node:test';
import assert from 'node:assert/strict';
import { initTransit } from '../components/home/van.js';

// Minimal event/clock harness: exercise user-visible state, not browser layout.
function transitHarness(context, reduce = false) {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  class Node extends EventTarget {
    attributes = new Map(); dataset = {}; style = {}; hidden = false; inert = false; textContent = '';
    classNames = new Set();
    classList = { toggle: (key, on) => on ? this.classNames.add(key) : this.classNames.delete(key),
      add: key => this.classNames.add(key), remove: key => this.classNames.delete(key) };
    setAttribute(key, value) { this.attributes.set(key, value); }
    getAttribute(key) { return this.attributes.get(key) ?? null; }
    closest() { return this; }
    focus() { root.focused = this; focus(this); }
  }
  const ids = ['umzug','cargoFrame','cargoIncoming','cargoVisual','cargoMeasurements','cargoStatus','cargoProgress',
    'cargoPlay','cargoPlayLabel','cargoMeasures','vanAutoplay','vanAutoplayLabel','vanOverview','vanInside','vanOverviewTab','vanInsideTab'];
  const nodes = Object.fromEntries(ids.map(id => [id, new Node()]));
  const steps = Array.from({length:4}, () => new Node());
  const tabs = [nodes.vanOverviewTab, nodes.vanInsideTab];
  tabs.forEach((tab, i) => tab.setAttribute('aria-controls', ['vanOverview','vanInside'][i]));
  nodes.cargoMeasurements.hidden = true;
  nodes.vanInside.hidden = true; nodes.vanInside.inert = true;
  nodes.cargoMeasures.setAttribute('aria-pressed', 'false');
  nodes.umzug.querySelectorAll = selector => selector === '[role="tab"]' ? tabs : steps;
  nodes.umzug.querySelector = () => new Node();
  const root = new Node(); root.querySelector = selector => nodes[selector.slice(1)];
  const doc = new Node(); doc.hidden = false;
  const motion = new Node(); motion.matches = reduce;
  let notify; let disconnected = false;
  const saved = Object.fromEntries(['window','document','matchMedia','IntersectionObserver'].map(key => [key, globalThis[key]]));
  globalThis.window = {setTimeout, clearTimeout}; globalThis.document = doc;
  globalThis.matchMedia = () => motion;
  globalThis.IntersectionObserver = class {
    constructor(callback) { notify = callback; }
    observe() {} disconnect() { disconnected = true; }
  };
  context.after(() => { Object.assign(globalThis, saved); });
  const dispose = initTransit(root);
  const focus = target => { const event = new Event('focusin'); Object.defineProperty(event, 'target', {value:target}); nodes.umzug.dispatchEvent(event); };
  return { nodes, steps, tabs, doc, motion, dispose, focus, disconnected: () => disconnected,
    visible: visible => notify([{isIntersecting:visible, intersectionRatio:visible ? 1 : 0}]),
    tick: ms => context.mock.timers.tick(ms), click: node => node.dispatchEvent(new Event('click')) };
}

test('Transit completes the approved visible cycle and cancels work when hidden or unmounted', context => {
  const h = transitHarness(context); const n = h.nodes;
  assert.equal(n.umzug.dataset.headlights, 'off');
  h.visible(true); assert.equal(n.umzug.dataset.headlights, 'running');
  h.tick(5999); assert.equal(n.vanInside.hidden, true);
  h.tick(1); assert.equal(n.vanInside.hidden, false); assert.equal(n.cargoFrame.dataset.frame, '0');
  assert.equal(n.umzug.dataset.headlights, 'off');
  for (let stage = 1; stage <= 3; stage++) { h.tick(1850); h.tick(320); assert.equal(n.cargoFrame.dataset.frame, String(stage)); }
  h.tick(3600); assert.equal(n.vanOverview.hidden, false); assert.equal(n.umzug.dataset.headlights, 'running');
  h.visible(false); h.tick(20000); assert.equal(n.vanOverview.hidden, false); assert.equal(n.umzug.dataset.headlights, 'off');
  h.visible(true); h.doc.hidden = true; h.doc.dispatchEvent(new Event('visibilitychange'));
  h.tick(20000); assert.equal(n.vanOverview.hidden, false); assert.equal(n.umzug.dataset.headlights, 'off');
  h.doc.hidden = false; h.doc.dispatchEvent(new Event('visibilitychange')); h.dispose();
  h.tick(20000); h.visible(true); assert.equal(n.vanOverview.hidden, false); assert.ok(h.disconnected());
  assert.equal(n.umzug.dataset.headlights, 'off');
});

test('measurements replace the image, pause the cycle and close on stage or exterior selection', context => {
  const h = transitHarness(context); const n = h.nodes; h.visible(true);
  h.click(h.tabs[1]); h.click(n.cargoMeasures);
  assert.equal(n.umzug.dataset.headlights, 'off');
  assert.equal(n.cargoVisual.hidden, true); assert.equal(n.cargoMeasurements.hidden, false);
  assert.equal(n.cargoMeasures.getAttribute('aria-expanded'), 'true');
  assert.equal(n.cargoMeasures.textContent, 'Zur Ladeansicht');
  h.tick(20000); assert.equal(n.cargoMeasurements.hidden, false);
  h.click(h.steps[2]); assert.equal(n.cargoMeasurements.hidden, true); assert.equal(n.cargoVisual.hidden, false);
  h.click(n.cargoMeasures); h.click(h.tabs[0]); assert.equal(n.cargoMeasurements.hidden, true);
  assert.equal(n.umzug.dataset.headlights, 'paused');
  h.click(n.vanAutoplay); assert.equal(n.umzug.dataset.headlights, 'running');
  h.focus(h.tabs[1]); h.tick(20000); assert.equal(n.vanOverview.hidden, false);
  assert.equal(n.umzug.dataset.headlights, 'paused');
  h.dispose();
});

test('reduced motion keeps both views and measurement controls manual', context => {
  const h = transitHarness(context, true); const n = h.nodes; h.visible(true); h.tick(20000);
  assert.equal(n.vanAutoplay.disabled, true); assert.equal(n.umzug.dataset.autoplay, 'paused');
  assert.equal(n.umzug.dataset.headlights, 'paused');
  h.click(h.tabs[1]); h.click(n.cargoPlay); assert.equal(n.cargoFrame.dataset.frame, '3');
  assert.equal(n.umzug.dataset.headlights, 'off');
  h.click(n.cargoMeasures); assert.equal(n.cargoMeasurements.hidden, false);
  h.click(n.cargoMeasures); assert.equal(n.cargoVisual.hidden, false); h.dispose();
});
