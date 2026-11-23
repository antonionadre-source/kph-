/** Owner-confirmed first-generation vehicle. All dimensions are centimetres. */
export const KRAKEN_VEHICLE = Object.freeze({
  model: 'Ford Transit Custom 250',
  variant: 'L1H1',
  volumeM3: 6,
  interior: Object.freeze({
    lengthCm: 255.5,
    widthCm: 177.5,
    betweenWheelArchesCm: 139,
    heightCm: 140.6,
  }),
  rearDoor: Object.freeze({ widthCm: 140, heightCm: 134 }),
  clearanceCm: 2,
});

export type CargoDimensions = {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

export type CargoFitAssessment = {
  status: 'fits' | 'review' | 'invalid';
  orientation?: CargoDimensions;
};

const dimensionKeys = ['lengthCm', 'widthCm', 'heightCm'] as const;
const orientations = [
  [0, 1, 2], [0, 2, 1], [1, 0, 2],
  [1, 2, 0], [2, 0, 1], [2, 1, 0],
] as const;

/**
 * A conservative, axis-aligned geometric check for one rigid item.
 * `fits` describes an orientation through the rear opening into the narrow floor
 * corridor, with clearance on both sides. It does not establish payload, safe
 * handling, stacking, remaining room or suitability for a particular move.
 * `review` leaves diagonal loading, dismantling and personal assessment open.
 */
export function assessCargoItem(input: unknown): CargoFitAssessment {
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(input))) return { status: 'invalid' };

  const dimensions: number[] = [];
  for (const key of dimensionKeys) {
    // Do not evaluate getters or inherited values from an unknown input shape.
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    const value = descriptor && 'value' in descriptor ? descriptor.value : undefined;
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 10000) {
      return { status: 'invalid' };
    }
    dimensions.push(value);
  }

  const clearance = KRAKEN_VEHICLE.clearanceCm * 2;
  const lengthLimit = KRAKEN_VEHICLE.interior.lengthCm - clearance;
  const widthLimit = Math.min(KRAKEN_VEHICLE.interior.betweenWheelArchesCm, KRAKEN_VEHICLE.rearDoor.widthCm) - clearance;
  const heightLimit = Math.min(KRAKEN_VEHICLE.interior.heightCm, KRAKEN_VEHICLE.rearDoor.heightCm) - clearance;

  for (const [lengthIndex, widthIndex, heightIndex] of orientations) {
    const lengthCm = dimensions[lengthIndex];
    const widthCm = dimensions[widthIndex];
    const heightCm = dimensions[heightIndex];
    if (lengthCm <= lengthLimit && widthCm <= widthLimit && heightCm <= heightLimit) {
      return { status: 'fits', orientation: { lengthCm, widthCm, heightCm } };
    }
  }
  return { status: 'review' };
}

export type VanLoadItem = CargoDimensions & {
  id: string;
  step: 1 | 2 | 3;
  kind: 'box' | 'chair' | 'panel';
  /** x follows the load length; y is within the central 139 cm floor corridor. */
  x: number;
  y: number;
  z: number;
};

/** Illustrative positions only: eight boxes, two chairs, one protected flat panel. */
const loadItems: VanLoadItem[] = [
  ...Array.from({ length: 8 }, (_, index): VanLoadItem => ({
    id: `box-${index + 1}`,
    step: 1,
    kind: 'box',
    x: 2 + 60 * (index % 4),
    y: 2 + 40 * Math.floor(index / 4),
    z: 0,
    lengthCm: 60,
    widthCm: 40,
    heightCm: 40,
  })),
  { id: 'chair-1', step: 2, kind: 'chair', x: 8, y: 90, z: 0, lengthCm: 45, widthCm: 45, heightCm: 90 },
  { id: 'chair-2', step: 2, kind: 'chair', x: 75, y: 90, z: 0, lengthCm: 45, widthCm: 45, heightCm: 90 },
  { id: 'panel-1', step: 3, kind: 'panel', x: 8, y: 10, z: 42, lengthCm: 200, widthCm: 60, heightCm: 8 },
];
export const VAN_LOAD_ITEMS: readonly Readonly<VanLoadItem>[] = Object.freeze(loadItems.map(item => Object.freeze(item)));
