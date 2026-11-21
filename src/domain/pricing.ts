// Shared unchanged service tariff formulas extracted from ConsultationPage.
export const PRICES = {
  // Hourly rates
  deepHourly: 56.50,
  regularHourly: 43.50,
  movingAssemblyRate: 80.00,
  movingHydraulicLiftRate: 150.00,

  // Fixed add-ons
  balconyPrice: 40.00,
  storagePrice: 30.00,
  carpetPrice: 45.00,
  furniturePrice: 40.00,
  ovenInteriorPrice: 45.00,
  fridgeFreezerPrice: 40.00,
  windowUnitPrice: 12.00,
  blindsUnitPrice: 25.00,
  extractorHoodPrice: 35.00,
  showerDescalingPrice: 40.00,
  cabinetInteriorPrice: 35.00,
  bedLinenLaundryPrice: 25.00,
  ecoProductsPrice: 15.00,
  trashBinPrice: 25.00,
  machineFloorRate: 3.50,
  machineFloorSetup: 30.00,
  bathroomEOTPrice: 60.00,
  baseCallOut: 45.00,

  // EOT base prices by room count
  eotBase: { 1: 520, 2: 700, 3: 950, 4: 1200, 5: 1500 } as Record<number, number>,
  eotGuideline: { 1: 520, 2: 700, 3: 950, 4: 1200, 5: 1500 } as Record<number, number>,

  // Moving labour hourly
  movingStandard: 145.00,
  movingLarge: 195.00,
  movingCommercial: 195.00,
  movingExtraHelperSurcharge: 50.00,

  // Car detailing by size
  carSize: { S: 140, M: 190, L: 240, XL: 290 } as Record<string, number>,
  carDirtSurcharge: { medium: 0, high: 30, extreme: 60 } as Record<string, number>,
  carPets: 60.00,
  carCeramic: 1000.00,
  carMetroMultiplier: 1.2,

  // Gardening base by size
  gardenBase: { small: 140, medium: 260, large: 480 } as Record<string, number>,
  gardenMowingPerSqm: 0.35,
  gardenHedgePerMeter: 15.00,
  gardenPlantingPerHour: 45.00,
  gardenWeedingPerHour: 40.00,
  gardenWastePerBag: 18.00,

  // Pressure washing per sqm by material
  washMaterial: { stone: 9, concrete: 7, wood: 12, composite: 8, glass: 11 } as Record<string, number>,
  washFacadeFactor: 1.2,

  // Gutter cleaning base by floors
  gutterFloors: { 1: 180, 2: 290, 3: 450 } as Record<number, number>,
  gutterMediumSurcharge: 40,   // 20–50m
  gutterXLSurcharge: 90,       // 50m+

  // Travel / callout discounts
  travelSingle: 45.00,
  travelOneMainPlusOne: 25.00,
  travelMulti: 0.00,
};

export type Zone = "schaffhausen" | "winterthur" | "zurich" | "other";

export interface ZoneInfo {
  zone: Zone;
  label: string;
  multiplier: number;
  surchargePercent: number;
  travelBase: number;
}

const ZONE_MAP: Record<Zone, ZoneInfo> = {
  schaffhausen: {
    zone: "schaffhausen",
    label: "Schaffhausen",
    multiplier: 1.0,
    surchargePercent: 0,
    travelBase: 45,
  },
  winterthur: {
    zone: "winterthur",
    label: "Winterthur",
    multiplier: 1.12,
    surchargePercent: 12,
    travelBase: 45,
  },
  zurich: {
    zone: "zurich",
    label: "Zürich",
    multiplier: 1.22,
    surchargePercent: 22,
    travelBase: 45,
  },
  other: {
    zone: "other",
    label: "Other region",
    multiplier: 1.08,
    surchargePercent: 8,
    travelBase: 45,
  },
};

export function detectZone(postalCode: string): ZoneInfo {
  const pc = postalCode.trim().replace(/\s/g, "");
  const n = parseInt(pc, 10);

  if (isNaN(n)) return ZONE_MAP.other;

  if (n >= 8200 && n <= 8239) return ZONE_MAP.schaffhausen;
  if (n >= 8400 && n <= 8416) return ZONE_MAP.winterthur;
  if (n >= 8000 && n <= 8099) return ZONE_MAP.zurich;
  if (n >= 8100 && n <= 8199) return ZONE_MAP.zurich;
  if (n >= 8300 && n <= 8399) return ZONE_MAP.zurich;
  if (n >= 8600 && n <= 8699) return ZONE_MAP.zurich;

  return ZONE_MAP.other;
}

export function applyZone(basePrice: number, zone: ZoneInfo): number {
  return Math.round(basePrice * zone.multiplier * 100) / 100;
}

export interface EOTOptions {
  rooms: number;
  bathrooms: number;
  balconies?: number;
  storageUnits?: number;
  carpets?: number;
  furniture?: number;
  ovenInterior?: boolean;
  fridgeFreezer?: boolean;
  windowsUnit?: number;
  blindsShutters?: number;
  extractorHood?: boolean;
  showerDescaling?: boolean;
  cabinetInterior?: boolean;
  bedLinenLaundry?: boolean;
  ecoProducts?: boolean;
  machineFloorSqm?: number;
  trashBinCount?: number;
  customDuration?: number;
}

export interface CleaningOptions {
  rooms: number;
  bathrooms: number;
  balconies?: number;
  storageUnits?: number;
  carpets?: number;
  furniture?: number;
  ovenInterior?: boolean;
  fridgeFreezer?: boolean;
  windowsUnit?: number;
  blindsShutters?: number;
  extractorHood?: boolean;
  showerDescaling?: boolean;
  cabinetInterior?: boolean;
  bedLinenLaundry?: boolean;
  ecoProducts?: boolean;
  machineFloorSqm?: number;
  trashBinCount?: number;
}

export interface RegularCleaningOptions {
  rooms: number;
  bathrooms: number;
  ironingHours?: number;
  laundryHours?: number;
  ovenLevel?: "low" | "medium" | "high";
  cabinetCount?: number;
  cabinetOrganize?: boolean;
  fridgeClean?: boolean;
  fridgeOrganize?: boolean;
  windowCount?: number;
  customDuration?: number;
}

export type MovingLevel = "standard" | "large" | "commercial";

export interface MovingOptions {
  level: MovingLevel;
  hours: number;
  helpers: number;
  withAssembly?: boolean;
  assemblyHours?: number;
  withHydraulicLift?: boolean;
  liftHours?: number;
  originPostal: string;
  destinationPostal: string;
  withPackaging?: boolean;
  withCleaning?: boolean;
  floorFrom?: string;
  accessFrom?: string;
  floorTo?: string;
  accessTo?: string;
  freeParking?: boolean;
}

export interface CarDetailingOptions {
  size: "S" | "M" | "L" | "XL";
  dirtLevel: "medium" | "high" | "extreme";
  hasPets?: boolean;
  ceramicCoating?: boolean;
  servicePostal: string;
}

export interface GardeningOptions {
  gardenSize: "small" | "medium" | "large";
  mowingArea?: number;       // sqm
  hedgeMeters?: number;
  plantingHours?: number;
  weedingHours?: number;
  wasteBags?: number;
}

export interface WashingOptions {
  material: "stone" | "concrete" | "wood" | "composite" | "glass";
  areaSqm: number;
  isFacade?: boolean;
}

export interface GutterOptions {
  floors: 1 | 2 | 3;
  gutterLength: "standard" | "medium" | "xl";
}

export function getEOTPrice(opts: EOTOptions, zone: ZoneInfo): number {
  if (opts.rooms === 0 && opts.bathrooms === 0) return PRICES.baseCallOut;

  const duration = calculateEOTDuration_v2(opts);
  const basePrice = PRICES.eotBase[opts.rooms as keyof typeof PRICES.eotBase] || PRICES.eotBase[5];

  const extraBaths = Math.max(0, opts.bathrooms - 1);
  let total = basePrice + extraBaths * PRICES.bathroomEOTPrice;

  total += (opts.balconies ?? 0) * PRICES.balconyPrice;
  total += (opts.storageUnits ?? 0) * PRICES.storagePrice;
  total += (opts.carpets ?? 0) * PRICES.carpetPrice;
  total += (opts.furniture ?? 0) * PRICES.furniturePrice;

  if (opts.ovenInterior) total += PRICES.ovenInteriorPrice;
  if (opts.fridgeFreezer) total += PRICES.fridgeFreezerPrice;
  if (opts.windowsUnit) total += opts.windowsUnit * PRICES.windowUnitPrice;
  if (opts.blindsShutters) total += opts.blindsShutters * PRICES.blindsUnitPrice;
  if (opts.extractorHood) total += PRICES.extractorHoodPrice;
  if (opts.showerDescaling) total += PRICES.showerDescalingPrice;
  if (opts.cabinetInterior) total += PRICES.cabinetInteriorPrice;
  if (opts.bedLinenLaundry) total += PRICES.bedLinenLaundryPrice;
  if (opts.ecoProducts) total += PRICES.ecoProductsPrice;
  if (opts.trashBinCount) total += opts.trashBinCount * PRICES.trashBinPrice;
  if (opts.machineFloorSqm && opts.machineFloorSqm > 0) {
    const billableSqm = Math.max(30, opts.machineFloorSqm);
    total += PRICES.machineFloorSetup + billableSqm * PRICES.machineFloorRate;
  }

  if (opts.customDuration && opts.customDuration > duration) {
    const extraHours = opts.customDuration - duration;
    total += extraHours * PRICES.deepHourly;
  }

  return applyZone(total, zone);
}

export function getDeepCleaningPrice(opts: CleaningOptions, zone: ZoneInfo): number {
  if (opts.rooms === 0 && opts.bathrooms === 0) return PRICES.baseCallOut;

  const duration = calculateCleaningDuration_v2("deep", opts);
  let total = duration * PRICES.deepHourly;

  total += (opts.balconies ?? 0) * PRICES.balconyPrice;
  total += (opts.storageUnits ?? 0) * PRICES.storagePrice;
  total += (opts.carpets ?? 0) * PRICES.carpetPrice;
  total += (opts.furniture ?? 0) * PRICES.furniturePrice;

  if (opts.ovenInterior) total += PRICES.ovenInteriorPrice;
  if (opts.fridgeFreezer) total += PRICES.fridgeFreezerPrice;
  if (opts.windowsUnit) total += opts.windowsUnit * PRICES.windowUnitPrice;
  if (opts.blindsShutters) total += opts.blindsShutters * PRICES.blindsUnitPrice;
  if (opts.extractorHood) total += PRICES.extractorHoodPrice;
  if (opts.showerDescaling) total += PRICES.showerDescalingPrice;
  if (opts.cabinetInterior) total += PRICES.cabinetInteriorPrice;
  if (opts.bedLinenLaundry) total += PRICES.bedLinenLaundryPrice;
  if (opts.ecoProducts) total += PRICES.ecoProductsPrice;
  if (opts.trashBinCount) total += opts.trashBinCount * PRICES.trashBinPrice;
  if (opts.machineFloorSqm && opts.machineFloorSqm > 0) {
    const billableSqm = Math.max(30, opts.machineFloorSqm);
    total += PRICES.machineFloorSetup + billableSqm * PRICES.machineFloorRate;
  }

  return applyZone(total, zone);
}

export function getRegularCleaningPrice(opts: RegularCleaningOptions, zone: ZoneInfo): number {
  let baseHours = opts.rooms * 0.75 + opts.bathrooms * 0.5;
  baseHours = Math.ceil(baseHours * 2) / 2;

  if (opts.customDuration && opts.customDuration > baseHours) {
    baseHours = opts.customDuration;
  }

  let hours = baseHours;

  if (opts.ironingHours) hours += opts.ironingHours;
  if (opts.laundryHours) hours += opts.laundryHours;
  if (opts.ovenLevel) {
    if (opts.ovenLevel === "low") hours += 0.5;
    else if (opts.ovenLevel === "medium") hours += 0.65;
    else if (opts.ovenLevel === "high") hours += 0.85;
  }
  if (opts.cabinetCount) {
    hours += opts.cabinetCount * 0.5;
    if (opts.cabinetOrganize) hours += opts.cabinetCount * 0.5;
  }
  if (opts.fridgeClean) {
    hours += 0.5;
    if (opts.fridgeOrganize) hours += 0.5;
  }
  if (opts.windowCount) {
    hours += opts.windowCount * 0.05;
  }

  if (hours <= 0) return PRICES.baseCallOut;

  const price = hours * PRICES.regularHourly;
  return applyZone(price, zone);
}

export function getCoordinatesForZip(zipStr: string): { lat: number; lng: number } | null {
  const cleanZip = zipStr.trim().replace(/\s/g, "");
  const zip = parseInt(cleanZip, 10);
  if (isNaN(zip)) return null;

  const baseZurich = { lat: 47.3769, lng: 8.5417 };      // Zurich center (8000)
  const baseSchaffhausen = { lat: 47.6973, lng: 8.6349 }; // Schaffhausen center (8200)
  const baseWinterthur = { lat: 47.5022, lng: 8.7247 };   // Winterthur center (8400)

  if (zip >= 8000 && zip <= 8099) {
    const offsetFactor = (zip - 8000) * 0.001;
    return { lat: 47.3769 + Math.sin(offsetFactor) * 0.02, lng: 8.5417 + Math.cos(offsetFactor) * 0.02 };
  }
  if (zip >= 8100 && zip <= 8199) {
    const offsetFactor = (zip - 8100) * 0.001;
    return { lat: 47.4200 + Math.sin(offsetFactor) * 0.03, lng: 8.5100 + Math.cos(offsetFactor) * 0.03 };
  }
  if (zip >= 8300 && zip <= 8399) {
    const offsetFactor = (zip - 8300) * 0.001;
    return { lat: 47.4000 + Math.sin(offsetFactor) * 0.03, lng: 8.6500 + Math.cos(offsetFactor) * 0.03 };
  }
  if (zip >= 8600 && zip <= 8699) {
    const offsetFactor = (zip - 8600) * 0.001;
    return { lat: 47.3000 + Math.sin(offsetFactor) * 0.03, lng: 8.7000 + Math.cos(offsetFactor) * 0.03 };
  }
  if (zip >= 8200 && zip <= 8239) {
    const offsetFactor = (zip - 8200) * 0.002;
    return { lat: 47.6973 + Math.sin(offsetFactor) * 0.015, lng: 8.6349 + Math.cos(offsetFactor) * 0.015 };
  }
  if (zip >= 8400 && zip <= 8416) {
    const offsetFactor = (zip - 8400) * 0.004;
    return { lat: 47.5022 + Math.sin(offsetFactor) * 0.012, lng: 8.7247 + Math.cos(offsetFactor) * 0.012 };
  }
  if (zip >= 8417 && zip <= 8499) {
    const offsetFactor = (zip - 8417) * 0.002;
    return { lat: 47.5200 + Math.sin(offsetFactor) * 0.02, lng: 8.7500 + Math.cos(offsetFactor) * 0.02 };
  }

  if (zipStr.startsWith('80') || zipStr.startsWith('81') || zipStr.startsWith('83') || zipStr.startsWith('86')) {
    return baseZurich;
  }
  if (zipStr.startsWith('82')) {
    return baseSchaffhausen;
  }
  if (zipStr.startsWith('84')) {
    return baseWinterthur;
  }

  return null;
}

export function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateGasolineAndDistance(zip1: string, zip2: string) {
  const coord1 = getCoordinatesForZip(zip1);
  const coord2 = getCoordinatesForZip(zip2);
  if (!coord1 || !coord2) return { distance: 0, cost: 0, distanceText: "—", costText: "— CHF" };

  const cleanZip1 = zip1.trim().replace(/\s/g, "");
  const cleanZip2 = zip2.trim().replace(/\s/g, "");

  let distance = 0;
  if (cleanZip1 === cleanZip2) {
    distance = 1.5; // default trip distance within same postcode
  } else {
    const lineDistance = getHaversineDistance(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
    distance = lineDistance * 1.3; // converter multiplier for road distance
  }

  // Gasoline cost dynamic calculator: 0.15 CHF/km round-trip
  const cost = distance * 2 * 0.15;
  return {
    distance,
    cost,
    distanceText: `${distance.toFixed(1)} km`,
    costText: `${cost.toFixed(2)} CHF`
  };
}

export function getStairSurcharge(floor: string | undefined, access: string | undefined, helpers: number): number {
  if (access !== 'Stairs') return 0;
  if (!floor) return 0;
  switch (floor) {
    case 'Basement': return 25;
    case '0': return 0;
    case '1': return 15;
    case '2': return 35;
    case '3': return 60;
    case '4': return 90;
    case '5': return 125;
    case '6+': return 165;
    default: return 0;
  }
}

export function getMovingPrice(opts: MovingOptions): number {
  // Labor hour rates: 1->60, 2->120, 3->175, 4->225
  let laborRate = 120;
  if (opts.helpers === 1) laborRate = 60;
  else if (opts.helpers === 2) laborRate = 120;
  else if (opts.helpers === 3) laborRate = 175;
  else if (opts.helpers === 4) laborRate = 225;
  else if (opts.helpers > 4) {
    laborRate = 225 + (opts.helpers - 4) * 50;
  }

  const laborCost = opts.hours * laborRate;

  let gasolineCost = 0;
  const gasInfo = calculateGasolineAndDistance(opts.originPostal, opts.destinationPostal);
  if (gasInfo.cost > 0) {
    gasolineCost = gasInfo.cost;
  }

  let extrasCost = 0;
  if (opts.withAssembly) {
    extrasCost += (opts.assemblyHours ?? 0) * 80.00;
  }
  if (opts.withHydraulicLift) {
    extrasCost += (opts.liftHours ?? 1) * 150.00; // Hourly rate
  }
  if (opts.withPackaging) {
    extrasCost += 45.00; // Flat fee as per design specifications
  }

  // Stair carrying fees
  extrasCost += getStairSurcharge(opts.floorFrom, opts.accessFrom, opts.helpers);
  extrasCost += getStairSurcharge(opts.floorTo, opts.accessTo, opts.helpers);

  // Parking fees (not free parking = paid/public parking)
  if (opts.freeParking === false) {
    extrasCost += 30.00; // 30 CHF parking allowance surcharge
  }

  return Math.round((laborCost + gasolineCost + extrasCost) * 10) / 10;
}

export function getCarDetailingPrice(opts: CarDetailingOptions): number {
  let price = PRICES.carSize[opts.size];

  price += PRICES.carDirtSurcharge[opts.dirtLevel];

  if (opts.hasPets) price += PRICES.carPets;
  if (opts.ceramicCoating) price += PRICES.carCeramic;

  const zone = detectZone(opts.servicePostal);
  if (zone.zone === "zurich" && opts.servicePostal.startsWith("80")) {
    price *= PRICES.carMetroMultiplier;
  }

  return Math.round(price * 100) / 100;
}

export function getGardeningPrice(opts: GardeningOptions, zone: ZoneInfo): number {
  let total = PRICES.gardenBase[opts.gardenSize];
  total += (opts.mowingArea ?? 0) * PRICES.gardenMowingPerSqm;
  total += (opts.hedgeMeters ?? 0) * PRICES.gardenHedgePerMeter;
  total += (opts.plantingHours ?? 0) * PRICES.gardenPlantingPerHour;
  total += (opts.weedingHours ?? 0) * PRICES.gardenWeedingPerHour;
  total += (opts.wasteBags ?? 0) * PRICES.gardenWastePerBag;
  return applyZone(total, zone);
}

export function getPressureWashingPrice(opts: WashingOptions, zone: ZoneInfo): number {
  const rate = PRICES.washMaterial[opts.material];
  let total = opts.areaSqm * rate;
  if (opts.isFacade) total *= PRICES.washFacadeFactor;
  return applyZone(total, zone);
}

export function getGutterPrice(opts: GutterOptions, zone: ZoneInfo): number {
  let total = PRICES.gutterFloors[opts.floors];
  if (opts.gutterLength === "medium") total += PRICES.gutterMediumSurcharge;
  if (opts.gutterLength === "xl") total += PRICES.gutterXLSurcharge;
  return applyZone(total, zone);
}

export function calculateCleaningDuration_v2(
  type: "regular" | "deep",
  opts: CleaningOptions
): number {
  const { rooms, bathrooms, balconies = 0, storageUnits = 0, carpets = 0, furniture = 0 } = opts;

  if (type === "regular") {
    const raw = rooms * 0.75 + bathrooms * 0.5;
    return Math.ceil(raw * 2) / 2;
  }

  let hours = rooms * 1.25 + bathrooms * 0.75;
  hours += balconies * 0.5;
  hours += storageUnits * 0.5;
  hours += carpets * 0.75;
  hours += furniture * 0.5;

  if (opts.ovenInterior) hours += 0.5;
  if (opts.fridgeFreezer) hours += 0.5;
  if (opts.windowsUnit) hours += opts.windowsUnit * 0.25;
  if (opts.blindsShutters) hours += opts.blindsShutters * 0.33;
  if (opts.extractorHood) hours += 0.33;
  if (opts.showerDescaling) hours += 0.5;
  if (opts.cabinetInterior) hours += 0.5;
  if (opts.bedLinenLaundry) hours += 0.33;
  if (opts.trashBinCount) hours += opts.trashBinCount * 0.25;
  if (opts.machineFloorSqm && opts.machineFloorSqm > 0) {
    hours += Math.ceil((opts.machineFloorSqm / 60) * 2) / 2;
  }

  return Math.ceil(hours * 2) / 2;
}

export function calculateEOTDuration_v2(opts: CleaningOptions): number {
  const { rooms, bathrooms, balconies = 0, storageUnits = 0, carpets = 0, furniture = 0 } = opts;

  const roomMap: Record<number, number> = { 1: 4.5, 2: 7.5, 3: 10.5, 4: 16.5 };
  let base = rooms >= 4 ? 22.5 : (roomMap[rooms] ?? 22.5);

  if (rooms === 3 && bathrooms >= 2) base = 12.5;

  const extraBaths = Math.max(0, bathrooms - 1);
  let hours = base + extraBaths * 0.75;

  hours += balconies * 0.5;
  hours += storageUnits * 0.5;
  hours += carpets * 0.75;
  hours += furniture * 0.5;

  if (opts.ovenInterior) hours += 0.5;
  if (opts.fridgeFreezer) hours += 0.5;
  if (opts.windowsUnit) hours += opts.windowsUnit * 0.25;
  if (opts.blindsShutters) hours += opts.blindsShutters * 0.33;
  if (opts.extractorHood) hours += 0.33;
  if (opts.showerDescaling) hours += 0.5;
  if (opts.cabinetInterior) hours += 0.5;
  if (opts.bedLinenLaundry) hours += 0.33;
  if (opts.trashBinCount) hours += opts.trashBinCount * 0.25;
  if (opts.machineFloorSqm && opts.machineFloorSqm > 0) {
    hours += Math.ceil((opts.machineFloorSqm / 60) * 2) / 2;
  }

  return Math.max(4.0, Math.ceil(hours * 2) / 2);
}


export const calculateDetailedServicePrice = (type: string, details: any, zone: ZoneInfo, fallbackPostal: string): number => {
      const activePostal = details.zipCode || details.fromZip || fallbackPostal || '8200';
      const currentZone = detectZone(activePostal);

      switch (type) {
          case 'daily-cleaning': {
              const opts: RegularCleaningOptions = {
                  rooms: details.bedrooms || 0,
                  bathrooms: details.bathrooms || 0,
                  ironingHours: details.ironing ? (details.ironingHours || 0) : 0,
                  laundryHours: details.laundry ? (details.laundryHours || 0) : 0,
                  ovenLevel: details.oven ? (details.ovenGrease === 'Low' ? 'low' : details.ovenGrease === 'Medium' ? 'medium' : 'high') as "low"|"medium"|"high" : undefined,
                  cabinetCount: details.cabinets ? 1 : 0,
                  cabinetOrganize: details.cabinets ? details.cabinetOrganize : undefined,
                  fridgeClean: details.fridge,
                  fridgeOrganize: details.fridge ? details.fridgeOrganize : undefined,
                  windowCount: details.windowCount || 0,
                  customDuration: details.duration
              };
              return getRegularCleaningPrice(opts, currentZone);
          }
          case 'end-of-tenancy': {
              const opts: EOTOptions = {
                  rooms: details.roomsCount || 0,
                  bathrooms: details.bathroomsCount || 0,
                  balconies: details.balconyCount || 0,
                  storageUnits: details.storageCount || 0,
                  carpets: details.carpetCount || 0,
                  furniture: details.furnitureCount || 0,
                  customDuration: details.duration
              };
              return getEOTPrice(opts, currentZone);
          }
          case 'deep-cleaning': {
              const opts: CleaningOptions = {
                  rooms: details.bedrooms || 0,
                  bathrooms: details.bathrooms || 0,
                  balconies: details.balconyCount || 0,
                  storageUnits: details.storageCount || 0,
                  carpets: details.carpetCount || 0,
                  furniture: details.furnitureCount || 0
              };
              return getDeepCleaningPrice(opts, currentZone);
          }
          case 'moving': {
              const opts: MovingOptions = {
                  level: (details.serviceLevel === 'Standard' ? 'standard' : details.serviceLevel === 'Large' ? 'large' : 'commercial') as MovingLevel,
                  hours: details.duration || 3,
                  helpers: details.moversCount || 0,
                  withAssembly: details.assembly,
                  assemblyHours: details.assemblyHours || 0,
                  withHydraulicLift: details.hydraulicLift,
                  liftHours: details.hydraulicLiftHours || 0,
                  originPostal: details.fromZip || '',
                  destinationPostal: details.toZip || '',
                  withPackaging: details.packaging,
                  floorFrom: details.floorFrom || '0',
                  accessFrom: details.accessFrom || 'Lift',
                  floorTo: details.floorTo || '0',
                  accessTo: details.accessTo || 'Lift',
                  freeParking: details.freeParking !== false
              };
              return getMovingPrice(opts);
          }
          case 'gardening': {
              if (details.size === 'XL') return 0; // Inquiry based
              
              const baseMap: Record<string, number> = { 'Small': 140, 'Medium': 260, 'Large': 480 };
              const basePrice = baseMap[details.size || 'Medium'] || 260;
              
              const conditionMults: Record<string, number> = { 'Cuidado': 1.0, 'Descuidado': 1.3, 'Muy descuidado': 1.6 };
              const conditionMultiplier = conditionMults[details.condition || 'Cuidado'] || 1.0;
              
              const freqMults: Record<string, number> = { 'Única': 1.0, 'Mensual': 0.90, 'Temporal': 0.95 };
              const frequencyMultiplier = freqMults[details.frequency || 'Única'] || 1.0;
              
              let addonsPrice = 0;
              if (details.mowing && details.features?.lawn) {
                  const sqm = parseFloat(details.lawnSqm) || 0;
                  addonsPrice += Math.max(60, sqm * 0.35);
              }
              
              if (details.features?.hedges && (details.hedgeMeters || 0) > 0) {
                  addonsPrice += (details.hedgeMeters || 0) * 15;
              }
              
              if (details.features?.trees && (details.treePruningHours || 0) > 0) {
                  addonsPrice += (details.treePruningHours || 0) * 45;
              }
              
              if (details.lawnTreatment && details.features?.lawn) {
                  addonsPrice += 90;
              }
              
              if (details.cleanup) {
                  addonsPrice += 120;
              }
              
              if (details.greenWaste) {
                  const bags = parseInt(details.greenWasteBags) || 0;
                  addonsPrice += bags > 0 ? bags * 18 : 50;
              }
              
              let accessCharge = 0;
              if (details.accessMachine === false) {
                  accessCharge = 30;
              }
              
              const calculatedTotal = (basePrice * conditionMultiplier + addonsPrice + accessCharge) * frequencyMultiplier;
              return applyZone(calculatedTotal, currentZone);
          }
          case 'exterior-cleaning': {
              let calculatedTotal = 0;
              const matRates: Record<string, number> = {
                  'Stone': 9, 'Concrete': 7, 'Wood': 12, 'Composite': 8, 'Glass': 11, 'Glass (Ext. Windows)': 11
              };
              const surfTypeMults: Record<string, number> = {
                  'Driveway / Path': 1.0, 'Decking / Patio': 1.0, 'Facade / Walls': 1.2
              };
              const severityMults: Record<string, number> = {
                  'Ligero': 1.0, 'Moderado': 1.15, 'Musgo / Algas': 1.25, 'Moss / Algae': 1.25
              };

              if (details.surfaces && details.surfaces.length > 0) {
                  details.surfaces.forEach((s: any) => {
                      const area = parseFloat(s.areaSqm) || 0;
                      const matRate = matRates[s.material] || 9;
                      const surfMult = surfTypeMults[s.surfaceType] || 1.0;
                      const sevMult = severityMults[s.severity] || 1.0;
                      let surfaceCost = area * matRate * surfMult * sevMult;
                      if (s.moldSealing) {
                          surfaceCost += area * 4;
                      }
                      calculatedTotal += surfaceCost;
                  });
              } else {
                  const area = parseFloat(details.approxSize) || 0;
                  const matRate = matRates[details.material] || 9;
                  const surfMult = surfTypeMults[details.surface] || 1.0;
                  calculatedTotal += area * matRate * surfMult;
              }

              if (details.stainRemoval) {
                  calculatedTotal += 50;
              }
              if (details.noUtilityAccess) {
                  calculatedTotal += 60;
              }

              return applyZone(calculatedTotal, currentZone);
          }
          case 'car-detailing': {
              let totalSum = 0;
              let hasMobile = false;

              if (details.vehicles && details.vehicles.length > 0) {
                  details.vehicles.forEach((v: any) => {
                      const baseMap: Record<string, number> = { 'S': 140, 'M': 190, 'L': 240, 'XL': 290 };
                      const baseSizePrice = baseMap[v.category || 'M'] || 190;
                      
                      const coverageMults: Record<string, number> = { 'Interior': 0.6, 'Exterior': 0.55, 'Full': 1.0 };
                      const coverageMultiplier = coverageMults[v.coverage || 'Full'] || 1.0;
                      
                      const dirtSurcharges: Record<string, number> = { 'Minimum': 0, 'Medium': 0, 'High': 30, 'Extreme': 60 };
                      const dirtSurcharge = dirtSurcharges[v.dirtLevel || 'Minimum'] || 0;
                      
                      let extraProblems = 0;
                      if (v.hasHeadlights) extraProblems += 80;
                      if (v.hasScratches) extraProblems += 120;
                      if (v.hasOdor) extraProblems += 70;
                      if (v.hasUpholstery) extraProblems += 50;
                      if (v.hasPets) extraProblems += 60;

                      let ceramicPrice = 0;
                      if (v.ceramicYears === '3 Years') ceramicPrice = 1000;

                      let vehiclePrice = (baseSizePrice * coverageMultiplier) + dirtSurcharge + extraProblems + ceramicPrice;

                      if (activePostal.startsWith('80')) {
                          vehiclePrice *= 1.2;
                      }

                      totalSum += vehiclePrice;
                      if (v.locationType === 'Mobile') {
                          hasMobile = true;
                      }
                  });
              }

              if (hasMobile) {
                  totalSum += 30;
              }

              return totalSum;
          }
          case 'gutter-cleaning': {
              const heightMap: Record<string, number> = { '1 Story': 180, '2 Stories': 290, '3+ Stories': 450 };
              const baseHeight = heightMap[details.buildingHeight] || 180;
              
              const lengthMap: Record<string, number> = { 'Standard (<20m)': 0, 'Large (20-50m)': 40, 'XL (>50m)': 90 };
              const lengthCharge = lengthMap[details.lengthCategory] || 0;
              
              const conditionMap: Record<string, number> = { 'Ligero': 0, 'Obstruido': 40, 'Plantas creciendo': 80, 'No sé': 0 };
              const conditionCharge = conditionMap[details.condition] || 0;
              
              let extraCharges = 0;
              if (details.downspoutFlush) extraCharges += 40;
              if (details.repairNeeded) extraCharges += 45;

              const calculatedTotal = baseHeight + lengthCharge + conditionCharge + extraCharges;
              return applyZone(calculatedTotal, currentZone);
          }
          case 'waste-management': {
              if (details.hasHazardous) return 0;
              let draftTotal = 80;
              const items = details.items || {};
              draftTotal += (items.sofa || 0) * 45;
              draftTotal += (items.mattress || 0) * 35;
              draftTotal += (items.appliance || 0) * 55;
              draftTotal += (items.boxes || 0) * 8;
              
              if (details.accessStyle === 'Stairs') {
                  draftTotal += (details.stairsFloorCount || 0) * 20;
              }
              if (details.needsCertificate) {
                  draftTotal *= 1.1;
              }
              return draftTotal;
          }
          default: return 0;
      }
  };


export interface PriceCartItem { type: string; details: Record<string, any>; price?: number; duration?: number; [key: string]: any; }
export function repriceCart<T extends PriceCartItem>(cart: T[], currentPostcode: string): (T & { price: number })[] {
  const hasServices = cart.some(item => item.type !== 'comic-book');
  const checkoutZone = detectZone(currentPostcode);
  return cart.map(item => {
      const itemConfig = item.details || {};
      let revaluedPrice = item.price || 0;

      if (item.type === 'comic-book') {
          if (hasServices) {
              revaluedPrice = 0; // Comic is free when bought with a service
          } else {
              revaluedPrice = item.price || 15.00; // Normal price
          }
      } else {
          switch (item.type) {
              case 'end-of-tenancy': {
                  const opts: EOTOptions = {
                      rooms: itemConfig.roomsCount || 0,
                      bathrooms: itemConfig.bathroomsCount || 0,
                      balconies: itemConfig.balconyCount || 0,
                      storageUnits: itemConfig.storageCount || 0,
                      carpets: itemConfig.carpetCount || 0,
                      furniture: itemConfig.furnitureCount || 0,
                      ovenInterior: itemConfig.ovenInterior,
                      fridgeFreezer: itemConfig.fridgeFreezer,
                      windowsUnit: itemConfig.windowsUnit,
                      blindsShutters: itemConfig.blindsShutters,
                      extractorHood: itemConfig.extractorHood,
                      showerDescaling: itemConfig.showerDescaling,
                      cabinetInterior: itemConfig.cabinetInterior,
                      bedLinenLaundry: itemConfig.bedLinenLaundry,
                      ecoProducts: itemConfig.ecoProducts,
                      machineFloorSqm: itemConfig.machineFloorSqm,
                      trashBinCount: itemConfig.trashBinCount,
                      customDuration: itemConfig.duration
                  };
                  revaluedPrice = getEOTPrice(opts, checkoutZone);
                  break;
              }
              case 'deep-cleaning': {
                  const opts: CleaningOptions = {
                      rooms: itemConfig.bedrooms || 0,
                      bathrooms: itemConfig.bathrooms || 0,
                      balconies: itemConfig.balconyCount || 0,
                      storageUnits: itemConfig.storageCount || 0,
                      carpets: itemConfig.carpetCount || 0,
                      furniture: itemConfig.furnitureCount || 0,
                      ovenInterior: itemConfig.ovenInterior,
                      fridgeFreezer: itemConfig.fridgeFreezer,
                      windowsUnit: itemConfig.windowsUnit,
                      blindsShutters: itemConfig.blindsShutters,
                      extractorHood: itemConfig.extractorHood,
                      showerDescaling: itemConfig.showerDescaling,
                      cabinetInterior: itemConfig.cabinetInterior,
                      bedLinenLaundry: itemConfig.bedLinenLaundry,
                      ecoProducts: itemConfig.ecoProducts,
                      machineFloorSqm: itemConfig.machineFloorSqm,
                      trashBinCount: itemConfig.trashBinCount
                  };
                  revaluedPrice = getDeepCleaningPrice(opts, checkoutZone);
                  break;
              }
              case 'daily-cleaning': {
                  const opts: RegularCleaningOptions = {
                      rooms: itemConfig.bedrooms || 0,
                      bathrooms: itemConfig.bathrooms || 0,
                      ironingHours: itemConfig.ironing ? (itemConfig.ironingHours || 0) : 0,
                      laundryHours: itemConfig.laundry ? (itemConfig.laundryHours || 0) : 0,
                      ovenLevel: itemConfig.oven ? (itemConfig.ovenGrease === 'Low' ? 'low' : itemConfig.ovenGrease === 'Medium' ? 'medium' : 'high') as "low"|"medium"|"high" : undefined,
                      cabinetCount: itemConfig.cabinets ? 1 : 0,
                      cabinetOrganize: itemConfig.cabinets ? itemConfig.cabinetOrganize : undefined,
                      fridgeClean: itemConfig.fridge,
                      fridgeOrganize: itemConfig.fridge ? itemConfig.fridgeOrganize : undefined,
                      windowCount: itemConfig.windowCount || 0,
                      customDuration: itemConfig.duration
                  };
                  revaluedPrice = getRegularCleaningPrice(opts, checkoutZone);
                  break;
              }
              case 'moving': {
                  const opts: MovingOptions = {
                      level: (itemConfig.serviceLevel === 'Standard' ? 'standard' : itemConfig.serviceLevel === 'Large' ? 'large' : 'commercial') as MovingLevel,
                      hours: itemConfig.duration || 3,
                      helpers: itemConfig.moversCount || 0,
                      withAssembly: itemConfig.assembly,
                      assemblyHours: itemConfig.assemblyHours || 0,
                      withHydraulicLift: itemConfig.hydraulicLift,
                      liftHours: itemConfig.hydraulicLiftHours || 0,
                      originPostal: itemConfig.fromZip || currentPostcode,
                      destinationPostal: itemConfig.toZip || currentPostcode,
                      withPackaging: itemConfig.packaging,
                      floorFrom: itemConfig.floorFrom || '0',
                      accessFrom: itemConfig.accessFrom || 'Lift',
                      floorTo: itemConfig.floorTo || '0',
                      accessTo: itemConfig.accessTo || 'Lift',
                      freeParking: itemConfig.freeParking !== false
                  };
                  revaluedPrice = getMovingPrice(opts);
                  break;
              }
              case 'car-detailing':
              case 'gardening':
              case 'exterior-cleaning':
              case 'gutter-cleaning':
              case 'waste-management': {
                  revaluedPrice = calculateDetailedServicePrice(item.type, itemConfig, checkoutZone, currentPostcode);
                  break;
              }
          }
      }

      return {
          ...item,
          price: revaluedPrice
      };
  });

}
