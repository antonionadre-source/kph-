import test from 'node:test';
import assert from 'node:assert/strict';
import { requestKaiOpen, subscribeKaiOpen } from '../src/kai/open.ts';

test('an early mobile tap opens Kai when its lazy chunk is ready, and unmounted listeners do not fire', () => {
  requestKaiOpen('moving', null);
  const calls: unknown[] = [];
  const dispose = subscribeKaiOpen(request => calls.push(request));
  assert.deepEqual(calls, [{ service: 'moving', opener: null }]);
  requestKaiOpen('windows', null);
  assert.equal(calls.length, 2);
  dispose();
  requestKaiOpen('deep', null);
  assert.equal(calls.length, 2);
  const next: unknown[] = [];
  const end = subscribeKaiOpen(request => next.push(request));
  assert.deepEqual(next, [{ service: 'deep', opener: null }]);
  end();
});
