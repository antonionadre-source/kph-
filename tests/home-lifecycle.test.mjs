import test from 'node:test';
import assert from 'node:assert/strict';
import { createHomeScope } from '../components/home/lifecycle.js';

test('navigation and StrictMode remount leave one active set of homepage listeners', () => {
  const target = new EventTarget();
  let calls = 0;
  const first = createHomeScope();
  first.on(target, 'service', () => calls++);
  first.dispose();
  const second = createHomeScope();
  second.on(target, 'service', () => calls++);
  target.dispatchEvent(new Event('service'));
  assert.equal(calls, 1);
  second.dispose();
  target.dispatchEvent(new Event('service'));
  assert.equal(calls, 1);
});

test('leaving the homepage cancels its fetches and delayed animation work', context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const previousWindow = globalThis.window;
  globalThis.window = { setTimeout, clearTimeout };
  context.after(() => { globalThis.window = previousWindow; });
  const scope = createHomeScope();
  const request = scope.abortController();
  let changes = 0;
  scope.timeout(() => changes++, 150);
  scope.dispose();
  context.mock.timers.tick(200);
  assert.equal(changes, 0);
  assert.equal(request.signal.aborted, true);
  scope.timeout(() => changes++, 0);
  context.mock.timers.tick(100);
  assert.equal(changes, 0);
});

test('late intersection callbacks cannot restart a van after unmount', () => {
  const previousObserver = globalThis.IntersectionObserver;
  let notify;
  let disconnected = false;
  globalThis.IntersectionObserver = class {
    constructor(callback) { notify = callback; }
    disconnect() { disconnected = true; }
  };
  try {
    let changes = 0;
    const scope = createHomeScope();
    scope.observer(() => changes++);
    notify([]);
    assert.equal(changes, 1);
    scope.dispose();
    notify([]);
    assert.equal(changes, 1);
    assert.equal(disconnected, true);
  } finally { globalThis.IntersectionObserver = previousObserver; }
});
