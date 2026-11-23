import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessCargoItem, KRAKEN_VEHICLE, VAN_LOAD_ITEMS, type CargoDimensions } from '../src/vehicle.ts';

test('the confirmed compact vehicle has one immutable dimension contract and no inferred payload', () => {
  assert.equal(KRAKEN_VEHICLE.model, 'Ford Transit Custom 250');
  assert.equal(KRAKEN_VEHICLE.variant, 'L1H1');
  assert.equal(KRAKEN_VEHICLE.volumeM3, 6);
  assert.ok(KRAKEN_VEHICLE.interior.betweenWheelArchesCm < KRAKEN_VEHICLE.interior.widthCm);
  assert.ok(KRAKEN_VEHICLE.rearDoor.heightCm < KRAKEN_VEHICLE.interior.heightCm);
  assert.ok(Object.isFrozen(KRAKEN_VEHICLE));
  assert.ok(Object.isFrozen(KRAKEN_VEHICLE.interior));
  assert.equal('payloadKg' in KRAKEN_VEHICLE, false);
  assert.equal('roofLoadKg' in KRAKEN_VEHICLE, false);
});

test('a compact sofa has a geometric orientation without modifying its measurements', () => {
  const sofa = Object.freeze({ lengthCm: 200, widthCm: 85, heightCm: 90 });
  assert.deepEqual(assessCargoItem(sofa), { status: 'fits', orientation: sofa });
  assert.deepEqual(sofa, { lengthCm: 200, widthCm: 85, heightCm: 90 });
});

test('each permutation of a flat furniture panel can find a loading orientation', () => {
  for (const values of [[200, 60, 8], [200, 8, 60], [60, 200, 8], [60, 8, 200], [8, 200, 60], [8, 60, 200]]) {
    const [lengthCm, widthCm, heightCm] = values;
    const result = assessCargoItem({ lengthCm, widthCm, heightCm });
    assert.equal(result.status, 'fits');
    assert.ok(result.orientation);
    assert.ok(result.orientation.lengthCm <= 251.5);
    assert.ok(result.orientation.widthCm <= 135);
    assert.ok(result.orientation.heightCm <= 130);
    assert.deepEqual(Object.values(result.orientation).sort((a, b) => a - b), [...values].sort((a, b) => a - b));
  }
});

test('the rear door, not just the internal roof, limits an upright rigid load', () => {
  // It would fit inside the nominal cabin; neither cross-section rotation passes the door with clearance.
  const large = { lengthCm: 200, widthCm: 135, heightCm: 132 };
  assert.ok(large.heightCm < KRAKEN_VEHICLE.interior.heightCm);
  assert.deepEqual(assessCargoItem(large), { status: 'review' });
});

test('clearance is reserved on both sides and the wheel-arch corridor constrains width', () => {
  assert.equal(assessCargoItem({ lengthCm: 251.5, widthCm: 135, heightCm: 130 }).status, 'fits');
  for (const dimensions of [
    { lengthCm: 251.51, widthCm: 135, heightCm: 130 },
    { lengthCm: 251.5, widthCm: 135.01, heightCm: 130 },
    { lengthCm: 251.5, widthCm: 135, heightCm: 130.01 },
    { lengthCm: 240, widthCm: 150, heightCm: 132 },
  ]) assert.deepEqual(assessCargoItem(dimensions), { status: 'review' });
});

test('large valid items need personal review rather than an unsupported impossible-fit claim', () => {
  assert.deepEqual(assessCargoItem({ lengthCm: 270, widthCm: 90, heightCm: 90 }), { status: 'review' });
  assert.deepEqual(assessCargoItem({ lengthCm: 10000, widthCm: 10000, heightCm: 10000 }), { status: 'review' });
});

test('malformed, missing, inherited, non-finite and absurd measurements are not interpreted as fits', () => {
  const invalid: unknown[] = [null, [], '200x85x90', {}, new Date(), Object.create({ lengthCm: 200, widthCm: 85, heightCm: 90 })];
  for (const value of [undefined, '', '200', NaN, Infinity, -Infinity, 0, -1, 10000.01]) {
    for (const key of ['lengthCm', 'widthCm', 'heightCm']) invalid.push({ lengthCm: 200, widthCm: 85, heightCm: 90, [key]: value });
  }
  invalid.push(Object.defineProperty({ widthCm: 85, heightCm: 90 }, 'lengthCm', { get() { throw new Error('Do not invoke'); } }));
  for (const input of invalid) assert.deepEqual(assessCargoItem(input), { status: 'invalid' });
});

test('all eleven illustrative load items stay in the narrow floor corridor and fit individually through the rear door', () => {
  assert.equal(VAN_LOAD_ITEMS.length, 11);
  assert.equal(new Set(VAN_LOAD_ITEMS.map(item => item.id)).size, VAN_LOAD_ITEMS.length);
  assert.equal(VAN_LOAD_ITEMS.filter(item => item.step === 1).length, 8);
  assert.equal(VAN_LOAD_ITEMS.filter(item => item.step === 2).length, 2);
  assert.equal(VAN_LOAD_ITEMS.filter(item => item.step === 3).length, 1);
  for (const item of VAN_LOAD_ITEMS) {
    assert.ok(item.x >= KRAKEN_VEHICLE.clearanceCm);
    assert.ok(item.y >= KRAKEN_VEHICLE.clearanceCm);
    assert.ok(item.z >= 0);
    assert.ok(item.x + item.lengthCm <= KRAKEN_VEHICLE.interior.lengthCm - KRAKEN_VEHICLE.clearanceCm);
    assert.ok(item.y + item.widthCm <= KRAKEN_VEHICLE.interior.betweenWheelArchesCm - KRAKEN_VEHICLE.clearanceCm);
    assert.ok(item.z + item.heightCm <= KRAKEN_VEHICLE.interior.heightCm - KRAKEN_VEHICLE.clearanceCm);
    const dimensions: CargoDimensions = { lengthCm: item.lengthCm, widthCm: item.widthCm, heightCm: item.heightCm };
    assert.equal(assessCargoItem(dimensions).status, 'fits');
  }
});

test('the cumulative illustrative arrangement has no intersecting bounding boxes, including the panel above the cartons', () => {
  const overlaps = (a: typeof VAN_LOAD_ITEMS[number], b: typeof VAN_LOAD_ITEMS[number]) =>
    a.x < b.x + b.lengthCm && b.x < a.x + a.lengthCm
    && a.y < b.y + b.widthCm && b.y < a.y + a.widthCm
    && a.z < b.z + b.heightCm && b.z < a.z + a.heightCm;
  for (let first = 0; first < VAN_LOAD_ITEMS.length; first++) {
    for (let second = first + 1; second < VAN_LOAD_ITEMS.length; second++) {
      assert.equal(overlaps(VAN_LOAD_ITEMS[first], VAN_LOAD_ITEMS[second]), false, `${VAN_LOAD_ITEMS[first].id} intersects ${VAN_LOAD_ITEMS[second].id}`);
    }
  }
  const panel = VAN_LOAD_ITEMS.find(item => item.kind === 'panel')!;
  assert.ok(panel.z > Math.max(...VAN_LOAD_ITEMS.filter(item => item.kind === 'box').map(item => item.z + item.heightCm)));
});
