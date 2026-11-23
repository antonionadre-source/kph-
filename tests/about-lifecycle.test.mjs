import test from 'node:test';
import assert from 'node:assert/strict';
import { initAboutInteractions } from '../components/about/about-interactions.ts';

class Classes {
  values = new Set();
  contains(value) { return this.values.has(value); }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
  toggle(value, force = !this.values.has(value)) { force ? this.add(value) : this.remove(value); }
}

class ElementStub {
  attributes = new Map();
  dataset = {};
  classList = new Classes();
  listeners = new Map();
  queries = new Map();
  scrolls = 0;
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  get hidden() { return this.attributes.has('hidden'); }
  set hidden(value) { value ? this.setAttribute('hidden', '') : this.removeAttribute('hidden'); }
  set tabIndex(value) { this.setAttribute('tabindex', value); }
  get tabIndex() { return Number(this.getAttribute('tabindex')); }
  querySelector(selector) { return this.queries.get(selector) ?? null; }
  querySelectorAll(selector) { return this.queries.get(selector) ?? []; }
  contains(element) { return element instanceof ElementStub; }
  closest(selector) {
    if (selector === '[data-about-tab]' && this.attributes.has('data-about-tab')) return this;
    if (selector === 'a[href^="#"]' && this.hash) return this;
    return null;
  }
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }
  removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
  fire(type, event = {}) {
    for (const listener of this.listeners.get(type) ?? []) listener({ target: this, preventDefault() {}, ...event });
  }
  focus() { this.focused = true; }
  scrollIntoView() { this.scrolls++; }
  getBoundingClientRect() { return { top: -100, bottom: -50 }; }
  getClientRects() { return []; }
}

function fixture(context, hash = '#kai-character') {
  const saved = Object.fromEntries(['window', 'document', 'Element', 'requestAnimationFrame', 'cancelAnimationFrame'].map(key => [key, globalThis[key]]));
  let url = new URL('https://krakenpfm.ch/about?lang=de' + hash);
  const location = { get href() { return url.href; }, get hash() { return url.hash; }, set hash(value) { url.hash = value; } };
  const window = new ElementStub();
  window.location = location;
  window.innerHeight = 800;
  window.matchMedia = () => ({ matches: true });
  window.history = { state: { preserved: true }, pushes: 0,
    replaceState(state, _title, value) { this.state = state; url = new URL(String(value)); },
    pushState(state, _title, value) { this.pushes++; this.state = state; url = new URL(String(value)); } };
  const frames = new Map();
  let frameId = 0;
  globalThis.window = window;
  globalThis.document = { body: { classList: new Classes() } };
  globalThis.Element = ElementStub;
  globalThis.requestAnimationFrame = callback => { frames.set(++frameId, callback); return frameId; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  context.after(() => { for (const [key, value] of Object.entries(saved)) value === undefined ? delete globalThis[key] : globalThis[key] = value; });
  const root = new ElementStub();
  const groups = [
    ['story-london', 'story-uk', 'story-switzerland', 'story-kraken'],
    ['kai-origin', 'kai-character', 'kai-help'],
  ].map(ids => {
    const group = new ElementStub();
    const list = new ElementStub();
    const panels = ids.map(id => { const panel = new ElementStub(); panel.id = id; root.queries.set('#' + id, panel); return panel; });
    const tabs = ids.map((id, index) => {
      const tab = new ElementStub();
      tab.id = id + '-tab'; tab.hash = '#' + id; tab.parentElement = list;
      tab.setAttribute('data-about-tab', ''); tab.setAttribute('href', tab.hash);
      return tab;
    });
    group.queries.set('[data-about-tab]', tabs);
    return { group, list, panels, tabs };
  });
  root.queries.set('[data-about-tabs]', groups.map(item => item.group));
  const flushFrames = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); };
  return { root, groups, window, flushFrames, frames };
}

test('language restart preserves keyboard-selected chapters and service over an older URL fragment', context => {
  const { root, groups: [story, kai], window, flushFrames, frames } = fixture(context);
  let dispose = initAboutInteractions(root, source => source);
  flushFrames();
  assert.equal(kai.group.dataset.aboutSelected, 'kai-character', 'incoming fragment applies on first mount');
  assert.equal(kai.panels[1].scrolls, 1);
  story.list.fire('keydown', { target: story.tabs[0], key: 'End' });
  kai.list.fire('keydown', { target: kai.tabs[1], key: 'End' });
  flushFrames();
  assert.equal(window.location.hash, '#kai-help', 'keyboard selection exposes its fragment without scrolling');
  assert.equal(kai.panels[2].scrolls, 0);
  root.dataset.helpService = 'moving';
  window.location.hash = '#kai-character'; // A previously copied fragment can be older than the active UI.
  dispose();
  assert.equal(frames.size, 0);
  dispose = initAboutInteractions(root, source => 'EN: ' + source);
  flushFrames();
  assert.equal(story.group.dataset.aboutSelected, 'story-kraken');
  assert.equal(kai.group.dataset.aboutSelected, 'kai-help');
  assert.equal(root.dataset.helpService, 'moving');
  assert.equal(kai.tabs[2].getAttribute('aria-selected'), 'true');
  assert.equal(kai.panels[1].scrolls, 1, 'language changes do not replay stale-fragment scrolling');
  window.location.hash = '#kai-origin';
  window.fire('hashchange');
  flushFrames();
  assert.equal(kai.group.dataset.aboutSelected, 'kai-origin', 'new fragment navigation still opens the requested chapter');
  assert.equal(kai.panels[0].scrolls, 1);
  dispose();
  assert.equal([...window.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0), 0);
  assert.equal([...root.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0), 0);
  assert.ok([...story.panels, ...kai.panels].every(panel => !panel.hidden), 'cleanup restores readable unenhanced chapters');
});

test('clicking enhanced stages updates history and content without anchor scrolling', context => {
  const { root, groups: [story], window, flushFrames } = fixture(context, '');
  const dispose = initAboutInteractions(root, source => source);
  flushFrames();
  const select = (index, extra = {}) => {
    let prevented = false;
    root.fire('click', { target: story.tabs[index], button: 0,
      preventDefault() { prevented = true; }, ...extra });
    flushFrames();
    return prevented;
  };
  assert.equal(select(1), true);
  assert.equal(story.group.dataset.aboutSelected, 'story-uk');
  assert.equal(window.location.hash, '#story-uk');
  assert.equal(new URL(window.location.href).search, '?lang=de');
  assert.deepEqual(window.history.state, { preserved: true });
  assert.equal(window.history.pushes, 1);
  assert.equal(select(1), true, 'same-tab clicks cannot trigger native scrolling');
  assert.equal(window.history.pushes, 1, 'same-tab clicks do not add duplicate history');
  assert.equal(select(2), true);
  assert.equal(story.tabs[2].getAttribute('aria-selected'), 'true');
  assert.ok(story.panels.every(panel => panel.scrolls === 0));
  assert.equal(select(3, { ctrlKey: true }), false, 'modified links retain native behaviour');
  assert.equal(story.group.dataset.aboutSelected, 'story-switzerland');
  const ordinary = new ElementStub(); ordinary.hash = '#story-london';
  root.fire('click', { target: ordinary, button: 0 });
  window.location.hash = '#story-london';
  window.fire('hashchange'); flushFrames();
  assert.equal(story.panels[0].scrolls, 1, 'ordinary chapter anchors still scroll to their target');
  dispose();
});

test('a default image failure cached before hydration shows the translated fallback', async context => {
  const { root, groups: [, kai] } = fixture(context, '#kai-help');
  const help = kai.panels[2];
  const controls = new Map();
  for (const selector of ['#kaiHelpVisual', '[data-help-title]', '[data-help-description]', '[data-help-calculator]', '[data-help-status]', '[data-help-loading]', '[data-help-image-fallback]']) {
    const element = new ElementStub(); controls.set(selector, element); help.queries.set(selector, element);
  }
  controls.get('[data-help-image-fallback]').hidden = true;
  const scene = new ElementStub(); scene.dataset.helpScene = 'windows';
  const image = new ElementStub(); image.complete = true; image.naturalWidth = 0; image.decode = async () => { throw Error('cached 404'); };
  scene.queries.set('img', image); help.queries.set('[data-help-scene]', [scene]);
  const dispose = initAboutInteractions(root, source => 'ES: ' + source);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(controls.get('[data-help-image-fallback]').hidden, false);
  assert.equal(controls.get('#kaiHelpVisual').getAttribute('aria-busy'), 'false');
  assert.match(controls.get('[data-help-status]').textContent, /^ES: /);
  assert.equal(controls.get('[data-help-calculator]').dataset.service, 'windows');
  dispose();
});
