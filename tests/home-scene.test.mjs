import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveKaiState } from '../components/home/scene-state.js';

test('automatic clothing respects the editorial 8 °C boundary, including zero', () => {
  for (const [temperatureC, clothing] of [[0, 'warm'], [7.9, 'warm'], [8, 'light']]) {
    assert.equal(resolveKaiState({ phase: 'day', temperatureC }).clothing, clothing);
  }
});

test('missing, non-numeric and non-finite readings do not imply cold weather', () => {
  for (const temperatureC of [null, undefined, NaN, Infinity, -Infinity, '0']) {
    assert.equal(resolveKaiState({ phase: 'day', temperatureC }).clothing, 'light');
  }
});

test('explicit valid clothing overrides temperature', () => {
  assert.equal(resolveKaiState({ temperatureC: 25, clothing: 'warm' }).clothing, 'warm');
  assert.equal(resolveKaiState({ temperatureC: 0, clothing: 'light' }).clothing, 'light');
  assert.equal(resolveKaiState({ temperatureC: 0, clothing: 'auto' }).clothing, 'warm');
  assert.equal(resolveKaiState({ temperatureC: 0, clothing: 'invalid' }).clothing, 'warm');
});

test('daytime activities follow the selected service with a moving fallback', () => {
  for (const [service, task] of [
    ['windows', 'windows'], ['moving', 'moving'],
    ['end', 'mop'], ['regular', 'mop'], ['deep', 'mop'], ['unknown', 'moving']
  ]) {
    assert.deepEqual(resolveKaiState({ phase: 'day', temperatureC: 12, service }), {
      task, clothing: 'light', lightsOn: true
    });
  }
  assert.equal(resolveKaiState({ phase: 'day' }).task, 'moving');
});

test('only night turns off the lights and substitutes rest; the selected task returns by day', () => {
  const selection = { temperatureC: 0, service: 'windows' };
  assert.deepEqual(resolveKaiState({ ...selection, phase: 'night' }), {
    task: 'rest', clothing: 'warm', lightsOn: false
  });
  for (const phase of ['dawn', 'day', 'evening']) {
    assert.deepEqual(resolveKaiState({ ...selection, phase }), {
      task: 'windows', clothing: 'warm', lightsOn: true
    });
  }
  assert.equal(selection.service, 'windows');
});
