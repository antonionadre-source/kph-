import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { 
    InfoIcon, 
    XMarkIcon, 
    ChevronUpIcon, 
    ChevronDownIcon, 
    ChevronRightIcon,
    TrashIcon,
    PlusIcon,
    MinusIcon,
    CloudUploadIcon,
    CheckIcon,
    ClockIcon,
    MapPinIcon,
    CalendarIcon,
    KeyIcon,
    PencilIcon,
    WindowIcon,
    SparklesIcon,
    BuildingIcon,
    TruckIcon,
    StarIcon,
    LeafIcon,
    DropIcon,
    ShieldCheckIcon,
    EnvelopeIcon,
    PhoneIcon,
    PaperAirplaneIcon,
    BoltIcon,
    BrainSearchIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    PaperClipIcon
} from './icons';
import { mascotImageUrl, teamPhotoUrl } from '../assets';
import emailjs from '@emailjs/browser';
import { db, auth, storage } from './firebase';
import { doc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from './Auth';
import { generateQuotePDF } from './QuotePdfGenerator';
import { PaymentCelebrationPage } from './PaymentCelebrationPage';
import { ServiceDetailsModal } from './ServiceDetailsModal';

const SERVICE_ID = 'service_aiv15bc'; 
const TEMPLATE_ID = 'template_aktj7t9'; 
const PUBLIC_KEY = 'sH5K84ChHyssJrarm'; 
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/ucxeqjygku2w6zyf9ynut5oantantx58';
const PERSISTENCE_KEY = 'kraken_consultation_data_v2';
const MAX_FILE_SIZE = 250 * 1024 * 1024; // 250 MB limit

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

interface ConsultationPageProps {
  onNavigate: (page: string) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// --- Constants & Types ---

type ServiceType = 'end-of-tenancy' | 'deep-cleaning' | 'daily-cleaning' | 'moving' | 'pest-control' | 'waste-management' | 'gutter-cleaning' | 'car-detailing' | 'gardening' | 'exterior-cleaning';

interface VehicleConfig {
    id: string;
    category: 'S' | 'M' | 'L' | 'XL';
    dirtLevel: 'Minimum' | 'Medium' | 'High' | 'Extreme';
    hasPets: boolean;
    luxury: {
        brand: string;
        interior: string;
        exterior: string;
        ceramic: boolean;
    };
}

interface CartItem {
    id: string;
    type: ServiceType;
    details: any;
    price?: number;
    description: string;
    duration?: number;
}

const PRICES = {
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

const MOCK_REVIEWS = [
    { name: 'Sarah', rating: 5, comment: 'So fast! I built my cleaning bundle in under 2 minutes. Easiest quote ever.' },
    { name: 'Thomas', rating: 5, comment: 'The visual upload is genius. No more explaining over the phone. Very smooth experience!' },
    { name: 'Elena', rating: 5, comment: 'I love how clear the pricing is. Great to see everything calculated instantly!' },
    { name: 'Marc', rating: 4, comment: 'Very professional interface. Simple, quick, and Swiss quality throughout.' }
];



// --- Reusable UI Components ---

const OptionCard: React.FC<{
    icon: string | React.ReactNode;
    title: string;
    description?: string;
    price?: string;
    selected: boolean;
    onClick: () => void;
    gridCols?: string;
    isExtra?: boolean;
}> = ({ icon, title, description, price, selected, onClick, gridCols = "col-span-1", isExtra = false }) => {
    const isGreenHighlight = isExtra && selected;
    return (
        <div 
            onClick={onClick}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 relative group select-none ${
                isGreenHighlight 
                ? 'border-gray-250 border-l-[5px] border-l-emerald-500 bg-emerald-50/15 shadow-md scale-[1.02]' 
                : selected 
                  ? 'border-[#007bff] bg-blue-50 shadow-md scale-[1.02]' 
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
            } ${gridCols}`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 ${
                isGreenHighlight ? 'bg-emerald-50 border border-emerald-100/60 text-emerald-600' : selected ? 'bg-white shadow-sm' : 'bg-gray-50'
            }`}>
                {typeof icon === 'string' ? icon : icon}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start gap-1.5">
                    <h4 className={`font-bold text-sm ${isGreenHighlight ? 'text-emerald-800' : selected ? 'text-[#007bff]' : 'text-gray-800'}`}>{title}</h4>
                    {price && <span className={`text-[10px] font-black uppercase tracking-wider ${isGreenHighlight ? 'text-emerald-600' : selected ? 'text-[#007bff]' : 'text-gray-400'}`}>{price}</span>}
                </div>
                {description && <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{description}</p>}
            </div>
            {selected && (
                <div className={`absolute -top-2 -right-2 text-white p-1 rounded-full shadow-lg animate-fade-in ${isGreenHighlight ? 'bg-emerald-500' : 'bg-[#007bff]'}`}>
                    <CheckIcon className="w-3.5 h-3.5" />
                </div>
            )}
        </div>
    );
};

const CounterCard: React.FC<{
    icon: string;
    label: string;
    subLabel?: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
    isExtra?: boolean;
}> = ({ icon, label, subLabel, value, onChange, min = 0, max, step = 1, suffix = '', isExtra = false }) => {
    const { language } = useTranslation();
    const isGreenHighlight = isExtra && value > 0;

    let finalSubLabel = subLabel;
    if (isGreenHighlight && subLabel) {
        const match = subLabel.match(/^\+\s*CHF\s*\d+(?:\.\d+)?/i);
        if (match) {
            const pricePart = match[0];
            const addedText = language === 'es' ? 'añadido' : (language === 'de' || language === 'de-CH') ? 'hinzugefügt' : language === 'fr' ? 'ajouté' : language === 'it' ? 'aggiunto' : language === 'pt' ? 'adicionado' : 'added';
            finalSubLabel = `${pricePart} ${addedText}`;
        }
    }

    return (
        <div className={`p-4 rounded-2xl flex items-center gap-4 transition-all group ${
            isGreenHighlight 
                ? 'border border-gray-200 border-l-[5px] border-l-emerald-500 bg-white/70 shadow-sm shadow-emerald-500/5' 
                : 'border-2 border-gray-100 bg-white hover:border-gray-200'
        }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
                isGreenHighlight 
                    ? 'bg-emerald-50 border border-emerald-100/60' 
                    : 'bg-gray-50'
            }`}>
                {icon}
            </div>
            <div className="flex-1">
                <div className="font-bold text-sm text-gray-800">{label}</div>
                {finalSubLabel && (
                    <div className={`text-[10px] mt-0.5 font-bold ${
                        isGreenHighlight 
                            ? 'text-emerald-600 font-extrabold' 
                            : 'text-gray-500'
                    }`}>
                        {finalSubLabel}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={(e) => { e.preventDefault(); onChange(Math.max(min, value - step)); }}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:border-[#007bff] hover:text-[#007bff] transition-colors shadow-sm active:scale-90"
                >
                    <MinusIcon className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold w-12 text-center text-gray-900 text-base">{value}{suffix}</span>
                <button 
                    onClick={(e) => { e.preventDefault(); onChange(max !== undefined ? Math.min(max, value + step) : value + step); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 ${
                        isGreenHighlight 
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-[#007bff] hover:text-[#007bff]'
                    }`}
                >
                    <PlusIcon className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

const ExtraBentoCard: React.FC<{
    icon: string;
    label: string;
    subLabel: string;
    value: number;
    onChange: (v: number) => void;
    iconBg?: string;
    iconBorder?: string;
    iconColor?: string;
}> = ({ icon, label, subLabel, value, onChange, iconBg = 'bg-gray-150', iconBorder = 'border-gray-200', iconColor = 'text-gray-600' }) => {
    const { language } = useTranslation();
    const isSelected = value > 0;

    let finalSubLabel = subLabel;
    if (isSelected && subLabel) {
        const match = subLabel.match(/^(\+\s*CHF\s*\d+(?:\.\d+)?)(.*)/i);
        if (match) {
            const pricePart = match[1];
            const rest = match[2] || '';
            const addedText = language === 'es' ? 'añadido' : (language === 'de' || language === 'de-CH') ? 'hinzugefügt' : language === 'fr' ? 'ajouté' : language === 'it' ? 'aggiunto' : language === 'pt' ? 'adicionado' : 'added';
            finalSubLabel = `${pricePart} ${addedText}${rest}`;
        }
    }

    return (
        <div className={`w-[170px] shrink-0 p-4 rounded-2xl border transition-all duration-300 bg-white/95 flex flex-col justify-between h-[180px] snap-center select-none ${
            isSelected 
                ? 'border-gray-200 border-l-[5px] border-l-emerald-500 shadow-md shadow-emerald-500/5' 
                : 'border border-gray-150 hover:border-gray-300'
        }`}>
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border transition-transform duration-300 hover:scale-105 ${
                        isSelected ? 'bg-emerald-50 border-emerald-100' : `${iconBg} ${iconBorder}`
                    } ${isSelected ? 'text-emerald-600' : iconColor}`}>
                        {icon}
                    </div>
                </div>
                
                <div className="mt-2 text-1 flex-1 flex flex-col justify-end min-w-0">
                    <div className={`font-extrabold text-[12px] leading-snug line-clamp-2 ${isSelected ? 'text-emerald-800' : 'text-slate-800'}`}>
                        {label}
                    </div>
                    <div className={`text-[10px] font-bold mt-1 leading-normal ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {finalSubLabel}
                    </div>
                </div>
            </div>
            
            <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
                isSelected ? 'border-emerald-50' : 'border-slate-50'
            }`}>
                <button 
                    onClick={(e) => { e.preventDefault(); onChange(Math.max(0, value - 1)); }}
                    className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-100 transition-colors shadow-2xs active:scale-95"
                >
                    <MinusIcon className="w-3 h-3" />
                </button>
                <span className={`font-extrabold text-sm w-8 text-center ${isSelected ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {value}
                </span>
                <button 
                    onClick={(e) => { e.preventDefault(); onChange(value + 1); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-2xs active:scale-95 ${
                        isSelected 
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100'
                    }`}
                >
                    <PlusIcon className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

const CounterInput: React.FC<{
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
}> = ({ label, value, onChange, min = 0 }) => (
    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-gray-100">
        <span className="text-xs font-bold text-gray-600">{label}</span>
        <div className="flex items-center gap-3">
            <button 
                type="button"
                onClick={() => onChange(Math.max(min, value - 1))}
                className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-sm active:scale-90"
            >
                <MinusIcon className="w-3 h-3" />
            </button>
            <span className="font-bold w-8 text-center text-gray-800 text-sm">{value}</span>
            <button 
                type="button"
                onClick={() => onChange(value + 1)}
                className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-sm active:scale-90"
            >
                <PlusIcon className="w-3.5 h-3.5" />
            </button>
        </div>
    </div>
);

const Confetti: React.FC = () => {
  const particles = Array.from({ length: 50 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100]">
      {particles.map((_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'][Math.floor(Math.random() * 5)]
        }} />
      ))}
      <style>{`
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          opacity: 0;
          animation: fall 3s linear infinite;
        }
        @keyframes fall {
          0% { top: -10%; transform: rotate(0deg) opacity: 1; }
          100% { top: 110%; transform: rotate(360deg) opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const SuccessModal: React.FC<{ 
    onClose: () => void;
    onNavigate: (page: string) => void;
}> = ({ onClose, onNavigate }) => {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <Confetti />
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative flex flex-col items-center text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-blue-50 rounded-b-[50%] -z-0 transform -translate-y-16 scale-x-150"></div>
                <div className="relative z-10 animate-bounce-in">
                    <img src={mascotImageUrl} alt="Celebrating Mascot" className="w-32 h-32 object-contain mx-auto mb-6 drop-shadow-xl" />
                </div>
                <h3 className="text-2xl font-bold text-[#002D5B] mb-2 relative z-10">{t('consultation.success.title')}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed relative z-10 font-medium">{t('consultation.success.quoteSent')}</p>
                
                {!user && (
                    <div className="w-full mb-6 bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 text-left flex flex-col gap-3 animate-fade-in relative z-20">
                        <div className="flex gap-3">
                            <span className="text-xl shrink-0">💡</span>
                            <div>
                                <p className="font-black text-xs text-[#002D5B] mb-0.5">{t('consultation.sync.title')}</p>
                                <p className="text-[11px] text-gray-500 font-bold leading-normal">
                                    {t('consultation.sync.desc')}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-1">
                            <button 
                                onClick={() => {
                                    onClose();
                                    onNavigate('register');
                                }}
                                className="flex-1 bg-[#007bff] text-white py-2 px-3 rounded-xl font-bold text-xs hover:bg-blue-600 transition-all text-center cursor-pointer"
                            >
                                {t('register.button')}
                            </button>
                            <button 
                                onClick={() => {
                                    onClose();
                                    onNavigate('login');
                                }}
                                className="flex-1 bg-white text-[#002D5B] border border-gray-200 py-2 px-3 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all text-center cursor-pointer"
                            >
                                {t('login.button')}
                            </button>
                        </div>
                    </div>
                )}

                <button 
                    onClick={onClose} 
                    className="w-full bg-[#002D5B] text-white py-4 rounded-2xl font-black text-lg shadow-xl relative z-10 hover:bg-[#00254A] transition-all transform hover:scale-105 active:scale-95"
                >
                    {t('consultation.success.button')}
                </button>
            </div>
        </div>
    );
};

const ModalOverlay: React.FC<{ 
    title: string; 
    onClose: () => void; 
    children: React.ReactNode; 
    size?: 'sm' | 'md' | 'lg' | 'xl'; 
    noScroll?: boolean;
}> = ({ title, onClose, children, size = 'md', noScroll = false }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className={`bg-white rounded-[2rem] shadow-2xl w-full flex flex-col max-h-[95vh] overflow-hidden transition-all duration-300 ${
            size === 'xl' ? 'max-w-5xl' : size === 'lg' ? 'max-w-3xl' : size === 'sm' ? 'max-w-md' : 'max-w-lg'
        }`}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <h3 className="text-lg font-bold text-[#002D5B]">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
            </div>
            {noScroll ? (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
                    {children}
                </div>
            ) : (
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            )}
        </div>
    </div>
);



const BookingCalendar: React.FC<{ selectedDate: string; onChange: (date: string) => void; hasError?: boolean }> = ({ selectedDate, onChange, hasError }) => {
    const [viewDate, setViewDate] = useState(() => new Date('2026-07-14'));
    const [today, setToday] = useState(() => {
        const d = new Date('2026-07-14');
        d.setHours(0, 0, 0, 0);
        return d;
    });

    useEffect(() => {
        setViewDate(new Date());
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        setToday(t);
    }, []);

    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const handlePrev = (e: React.MouseEvent) => { e.preventDefault(); setViewDate(new Date(currentYear, currentMonth - 1, 1)); }
    const handleNext = (e: React.MouseEvent) => { e.preventDefault(); setViewDate(new Date(currentYear, currentMonth + 1, 1)); }
    const handleSelect = (e: React.MouseEvent, day: number) => {
        e.preventDefault();
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        onChange(dateStr);
    }
    const renderDays = () => {
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(currentYear, currentMonth, d);
            const isPast = date < today;
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            const isToday = date.getTime() === today.getTime();
            days.push(
                <button key={d} onClick={(e) => !isPast && handleSelect(e, d)} disabled={isPast} type="button" className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium transition-all ${isSelected ? 'bg-[#002D5B] text-white shadow-md' : 'hover:bg-blue-50 text-gray-700'} ${isPast ? 'text-gray-300 cursor-not-allowed hover:bg-transparent' : ''} ${isToday && !isSelected ? 'text-[#002D5B] font-bold ring-1 ring-[#002D5B]' : ''}`}>
                    {d}
                </button>
            );
        }
        return days;
    }
    return (
        <div className={`bg-white rounded-xl border-2 p-3 shadow-sm transition-all duration-300 ${hasError ? 'border-red-500 bg-red-50/30' : 'border-gray-100'}`}>
            <div className="flex justify-between items-center mb-3">
                <button onClick={handlePrev} type="button" className="p-1 hover:bg-gray-100 rounded-full"><ChevronDownIcon className="w-3.5 h-3.5 rotate-90" /></button>
                <span className="font-bold text-gray-800 text-xs">{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <button onClick={handleNext} type="button" className="p-1 hover:bg-gray-100 rounded-full"><ChevronDownIcon className="w-3.5 h-3.5 -rotate-90" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-center text-[9px] uppercase font-bold text-gray-400">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 justify-items-center">{renderDays()}</div>
        </div>
    );
}

const TimePicker: React.FC<{ selectedTime: string; onChange: (time: string) => void; hasError?: boolean }> = ({ selectedTime, onChange, hasError }) => {
    const slots = [];
    for(let i=8; i<=18; i++) {
        slots.push(`${i.toString().padStart(2, '0')}:00`);
        if(i !== 18) slots.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return (
        <div className={`grid grid-cols-4 sm:grid-cols-5 gap-1.5 mt-1.5 p-2 rounded-xl transition-all duration-300 ${hasError ? 'bg-red-50 border-2 border-red-500' : ''}`}>
            {slots.map(time => (
                <button key={time} type="button" onClick={() => onChange(time)} className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedTime === time ? 'bg-[#002D5B] text-white border-[#002D5B] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-[#007bff] hover:text-[#007bff]'}`}>
                    {time}
                </button>
            ))}
        </div>
    );
};

const getSuccessTexts = (lang: string, onlyComics: boolean = false) => {
  const dictionary: Record<string, any> = {
    es: {
      thanksConfirm: onlyComics ? '¡Gracias! Tu compra de cómic ha sido confirmada' : '¡Gracias! Tu reserva está confirmada',
      thanksReceipt: '¡Gracias! Hemos recibido tu solicitud',
      bookingNo: onlyComics ? 'Nº de Pedido' : 'Nº de reserva',
      weAreReviewing: 'Estamos revisando los archivos que nos enviaste',
      filesReceived: '{count} archivos recibidos ({photos} fotos, {videos} vídeos)',
      singleFileReceived: '1 archivo recibido',
      filesReceivedLabel: 'archivos recibidos',
      photosLabel: 'fotos',
      videosLabel: 'vídeos',
      paidToday: onlyComics ? 'Pagado hoy (100% Pago Completo)' : 'Pagado hoy (depósito 15%)',
      balanceDue: onlyComics ? 'Saldo pendiente (0.00)' : 'Saldo al finalizar el servicio',
      feePaid: 'Tarifa de revisión pagada',
      deductedNotice: 'Se descuenta al 100% de tu factura si aceptas el presupuesto.',
      whatsNext: '¿Qué sigue ahora?',
      step1Direct: 'Recibirás un correo con todos los detalles de tu reserva.',
      step1Validate: 'Revisamos técnicamente tus fotos y vídeos el mismo día.',
      step2Direct: 'Nuestro equipo te contactará 24h antes para confirmar el acceso.',
      step2Validate: 'Te enviamos por correo tu precio exacto y cerrado.',
      step3Direct: 'El {date} realizamos el servicio en el horario acordado.',
      step3Validate: 'Solo tienes que confirmar — no se requiere ningún pago adicional para reservar tu fecha.',
      addCalendar: 'Añadir a mi calendario',
      noActionRequired: 'No necesitas hacer nada más por ahora. Te avisamos en cuanto tengamos tu precio.',
      reservaExpress: 'Reserva Express'
    },
    en: {
      thanksConfirm: 'Thank you! Your booking is confirmed',
      thanksReceipt: 'Thank you! We have received your request',
      bookingNo: 'Booking No.',
      weAreReviewing: 'We are reviewing the files you sent us',
      filesReceived: '{count} files received ({photos} photos, {videos} videos)',
      singleFileReceived: '1 file received',
      filesReceivedLabel: 'files received',
      photosLabel: 'photos',
      videosLabel: 'videos',
      paidToday: 'Paid today (15% deposit)',
      balanceDue: 'Balance due upon service completion',
      feePaid: 'Review fee paid',
      deductedNotice: '100% deducted from your final invoice if you accept the quote.',
      whatsNext: 'What’s the next step?',
      step1Direct: 'You will receive an email with all your booking details.',
      step1Validate: 'We technically review your photos and videos on the same day.',
      step2Direct: 'Our team will contact you 24h before to confirm access details.',
      step2Validate: 'We send you your exact and closed price by email.',
      step3Direct: 'On {date} we perform the custom service at the agreed time.',
      step3Validate: 'You only have to confirm — no extra payment is required to book your date.',
      addCalendar: 'Add to my calendar',
      noActionRequired: 'You do not need to do anything else for now. We will notify you once your quote is ready.',
      reservaExpress: 'Express Booking'
    },
    de: {
      thanksConfirm: 'Vielen Dank! Ihre Buchung ist bestätigt',
      thanksReceipt: 'Vielen Dank! Wir haben Ihre Anfrage erhalten',
      bookingNo: 'Buchungsnummer',
      weAreReviewing: 'Wir überprüfen die von Ihnen gesendeten Dateien',
      filesReceived: '{count} Dateien erhalten ({photos} Fotos, {videos} Videos)',
      singleFileReceived: '1 Datei erhalten',
      filesReceivedLabel: 'Dateien erhalten',
      photosLabel: 'Fotos',
      videosLabel: 'Videos',
      paidToday: 'Heute bezahlt (15% Anzahlung)',
      balanceDue: 'Restbetrag fällig nach Fertigstellung des Services',
      feePaid: 'Prüfgebühr bezahlt',
      deductedNotice: 'Wird bei Annahme des Angebots zu 100% von Ihrer Rechnung abgezogen.',
      whatsNext: 'Was folgt als nächstes?',
      step1Direct: 'Sie erhalten eine E-Mail mit allen Details Ihrer Buchung.',
      step1Validate: 'Wir prüfen Ihre Fotos und Videos noch am selben Tag technisch.',
      step2Direct: 'Unser Team kontaktiert Sie 24 Std. vorher, um den Zugang zu bestätigen.',
      step2Validate: 'Wir senden Ihnen Ihre exakte und geschlossene Offerte per E-Mail.',
      step3Direct: 'Am {date} führen wir den Service zur vereinbarten Zeit durch.',
      step3Validate: 'Sie müssen nur noch bestätigen – keine zusätzliche Zahlung erforderlich.',
      addCalendar: 'In meinen Kalender eintragen',
      noActionRequired: 'Sie müssen vorerst nichts weiter tun. Wir melden uns, sobald Ihre Offerte bereit ist.',
      reservaExpress: 'Express-Reservation'
    },
    fr: {
      thanksConfirm: 'Merci ! Votre réservation est confirmée',
      thanksReceipt: 'Merci ! Nous avons reçu votre demande',
      bookingNo: 'N° de réservation',
      weAreReviewing: 'Nous examinons les fichiers que vous nous avez envoyés',
      filesReceived: '{count} fichiers reçus ({photos} photos, {videos} vidéos)',
      singleFileReceived: '1 fichier reçu',
      filesReceivedLabel: 'fichiers reçus',
      photosLabel: 'photos',
      videosLabel: 'vidéos',
      paidToday: 'Payé aujourd’hui (acompte 15%)',
      balanceDue: 'Solde dû à la fin de la prestation',
      feePaid: 'Frais d’évaluation payés',
      deductedNotice: 'Déduit à 100% de votre facture finale si vous acceptez le devis.',
      whatsNext: 'Quelle est la prochaine étape ?',
      step1Direct: 'Vous recevrez un e-mail avec tous les détails de votre réservation.',
      step1Validate: 'Nous examinons techniquement vos photos et vidéos le jour même.',
      step2Direct: 'Notre équipe vous contactera 24h avant pour confirmer l’accès.',
      step2Validate: 'Nous vous proposons par e-mail votre prix exact et fermé.',
      step3Direct: 'Le {date} nous réalisons la prestation à l’heure convenue.',
      step3Validate: 'Il vous suffit de confirmer — aucun paiement supplémentaire requis pour réserver votre date.',
      addCalendar: 'Ajouter à mon agenda',
      noActionRequired: 'Vous n’avez rien d’autre à faire pour le moment. Nous vous préviendrons dès que votre devis sera prêt.',
      reservaExpress: 'Réservation Express'
    },
    it: {
      thanksConfirm: 'Grazie! La tua prenotazione è confermata',
      thanksReceipt: 'Grazie! Abbiamo ricevuto la tua richiesta',
      bookingNo: 'N° di prenotazione',
      weAreReviewing: 'Stiamo esaminando i file che ci hai inviato',
      filesReceived: '{count} file ricevuti ({photos} foto, {videos} video)',
      singleFileReceived: '1 file ricevuto',
      filesReceivedLabel: 'file ricevuti',
      photosLabel: 'foto',
      videosLabel: 'video',
      paidToday: 'Pagato oggi (deposito 15%)',
      balanceDue: 'Saldo al completamento del servicio',
      feePaid: 'Tariffa di revisione pagata',
      deductedNotice: 'Detratto al 100% dalla fattura finale se si accetta il preventivo.',
      whatsNext: 'Qual è il prossimo passo?',
      step1Direct: 'Riceverai un’e-mail con tutti i dettagli della tua prenotazione.',
      step1Validate: 'Esaminiamo tecnicamente le tue foto e i tuoi video lo stesso giorno.',
      step2Direct: 'Il nostro team ti contatterà 24 ore prima per confermare l’accesso.',
      step2Validate: 'Ti invieremo via e-mail il tuo prezzo esatto e chiuso.',
      step3Direct: 'Il {date} eseguiamo il servicio all’orario concordato.',
      step3Validate: 'Devi solo confermare — nessun pagamento aggiuntivo richiesto per prenotare la tua data.',
      addCalendar: 'Aggiungi al mio calendario',
      noActionRequired: 'Non devi fare altro per ora. Ti informeremo non appena il tuo preventivo sarà pronto.',
      reservaExpress: 'Prenotazione Express'
    },
    pt: {
      thanksConfirm: 'Obrigado! A sua reserva está confirmada',
      thanksReceipt: 'Obrigado! Recebemos a sua solicitação',
      bookingNo: 'Nº de reserva',
      weAreReviewing: 'Estamos a analisar os ficheiros que nos enviou',
      filesReceived: '{count} ficheiros recebidos ({photos} fotos, {videos} vídeos)',
      singleFileReceived: '1 ficheiro recebido',
      filesReceivedLabel: 'ficheiros recebidos',
      photosLabel: 'fotos',
      videosLabel: 'vídeos',
      paidToday: 'Pago hoje (depósito de 15%)',
      balanceDue: 'Saldo no final do serviço',
      feePaid: 'Taxa de avaliação paga',
      deductedNotice: 'Descontado a 100% da sua fatura final se aceitar o orçamento.',
      whatsNext: 'Qual é o próximo passo?',
      step1Direct: 'Irá receber um e-mail com todos os detalhes da sua reserva.',
      step1Validate: 'Analisamos tecnicamente as suas fotos e vídeos no mesmo dia.',
      step2Direct: 'A nossa equipa irá contactá-lo 24h antes para confirmar o acesso.',
      step2Validate: 'Enviamos por e-mail o seu preço exato e fechado.',
      step3Direct: 'No dia {date} realizamos o serviço no horário acordado.',
      step3Validate: 'Apenas necessita confirmar — nenhum pagamento adicional é exigido para reservar a sua data.',
      addCalendar: 'Adicionar ao meu calendário',
      noActionRequired: 'Não precisa de fazer mais nada por enquanto. Avisamos assim que tivermos o seu preço.',
      reservaExpress: 'Reserva Express'
    }
  };
  return dictionary[lang] || dictionary['es'];
};

const formatSuccessDate = (dateStr: string, lang: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const months: Record<string, string[]> = {
    es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    fr: ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'],
    it: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  const currentMonths = months[lang] || months['es'];
  return `${parts[2]} ${currentMonths[d.getMonth()]} ${parts[0]}`;
};

// --- Service Default Configuration Constants ---
const SERVICE_DEFAULT_CONFIGS: Record<string, any> = {
    'end-of-tenancy': { roomsCount: 2, bathroomsCount: 1, duration: 7, balconyCount: 0, storageCount: 0, carpetCount: 0, furnitureCount: 0, ovenInterior: false, fridgeFreezer: false, windowsUnit: 0, blindsShutters: 0, extractorHood: false, showerDescaling: false, cabinetInterior: false, bedLinenLaundry: false, ecoProducts: false, machineFloorSqm: 0, trashBinCount: 0, windowMenuOpen: false, windowConfig: { standard: 0, large: 0, hardReach: 0, external: false } },
    'deep-cleaning': { bedrooms: 2, bathrooms: 1, duration: 5.5, focus: [], balconyCount: 0, storageCount: 0, carpetCount: 0, furnitureCount: 0, ovenInterior: false, fridgeFreezer: false, windowsUnit: 0, blindsShutters: 0, extractorHood: false, showerDescaling: false, cabinetInterior: false, bedLinenLaundry: false, ecoProducts: false, machineFloorSqm: 0, trashBinCount: 0, frequency: 'One-Time', recurringDayPreference: '' },
    'daily-cleaning': { 
          frequency: 'Weekly', duration: 3, bedrooms: 2, bathrooms: 1, sameOperative: true, frequencyDetails: '', 
          ironing: false, ironingHours: 0.5, ironingNotes: '',
          laundry: false, laundryType: 'Wash & Dry', laundryItems: 0, laundryHours: 1, laundryNotes: '',
          oven: false, ovenGrease: 'Low', ovenNotes: '',
          cabinets: false, cabinetCondition: 'Empty', cabinetOrganize: false, cabinetNotes: '',
          fridge: false, fridgeCondition: 'Empty', fridgeOrganize: false, fridgeNotes: '',
          windowCount: 0 
    },
    'moving': { 
      moversCount: 2, 
      duration: 1, 
      fromZip: '', 
      fromAddress: '',
      toZip: '', 
      toAddress: '',
      accessFrom: 'Lift',
      floorFrom: '0',
      accessTo: 'Lift',
      floorTo: '0',
      hydraulicLift: false, 
      hydraulicLiftHours: 1, 
      isCommercial: false, 
      moveType: 'Home Contents', 
      serviceLevel: 'Standard', 
      description: '', 
      assembly: false, 
      assemblyHours: 1,
      packaging: false,
      cleaning: false,
      freeParking: true
    }
};

const fallbackTranslations: Record<string, { fr: string; it: string; pt: string }> = {
  'Full property cleaning': {
    fr: 'Nettoyage complet de la propriété',
    it: 'Pulizia completa della proprietà',
    pt: 'Limpeza completa da propriedade'
  },
  'Disinfection of bathrooms & kitchen': {
    fr: 'Désinfection des salles de bain et de la cuisine',
    it: 'Disinfezione dei bagni e della cucina',
    pt: 'Desinfecção de casas de banho e cozinha'
  },
  'Satisfaction report guaranteed': {
    fr: 'Rapport de satisfaction garanti',
    it: 'Rapporto di soddisfazione garantito',
    pt: 'Relatório de satisfação garantido'
  },
  'Thorough cleaning of all areas': {
    fr: 'Nettoyage en profondeur de toutes les zones',
    it: 'Pulizia profonda di tutte le aree',
    pt: 'Limpeza profunda de todas as áreas'
  },
  'Limescale & grease removal': {
    fr: 'Élimination du calcaire et de la graisse',
    it: 'Rimozione di calcare e grasso',
    pt: 'Remoção de calcário e gordura'
  },
  'Professional grade products': {
    fr: 'Produits de qualité professionnelle',
    it: 'Prodotti di livello professionale',
    pt: 'Produtos de qualidade profissional'
  },
  'Weekly, bi-weekly or monthly frequency': {
    fr: 'Fréquence hebdomadaire, bimensuelle ou mensuelle',
    it: 'Frequenza settimanale, bisettimanale o mensile',
    pt: 'Frequência semanal, quinzenal ou mensal'
  },
  'General cleaning & maintenance': {
    fr: 'Nettoyage général et entretien',
    it: 'Pulizia generale e manutenzione',
    pt: 'Limpeza geral e manutenção'
  },
  'Products and materials included': {
    fr: 'Produits et matériel inclus',
    it: 'Prodotti e materiali inclusi',
    pt: 'Produtos e materiais incluídos'
  },
  'Furniture wrapping & protection': {
    fr: 'Emballage et protection des meubles',
    it: 'Imballaggio e protezione dei mobili',
    pt: 'Embalagem e proteção de móveis'
  },
  'Loading, transport and unloading': {
    fr: 'Chargement, transport et déchargement',
    it: 'Caricamento, trasporto e scaricamento',
    pt: 'Carregamento, transporte e descarregamento'
  },
  'Basic insurance included': {
    fr: 'Assurance de base incluse',
    it: 'Assicurazione di base inclusa',
    pt: 'Seguro básico incluído'
  },
  'Stairs (no elevator) fee: Basement 25 CHF, 1st: 15 CHF, 2nd: 35 CHF, 3rd: 60 CHF, 4th+: 90+ CHF': {
    fr: 'Frais pour escaliers (sans ascenseur) : Sous-sol 25 CHF, 1er : 15 CHF, 2e : 35 CHF, 3e : 60 CHF, 4e+ : 90+ CHF',
    it: 'Supplemento scale (senza ascensore): Seminterrato 25 CHF, 1°: 15 CHF, 2°: 35 CHF, 3°: 60 CHF, 4°+: 90+ CHF',
    pt: 'Taxa de escadas (sem elevador): Cave 25 CHF, 1º: 15 CHF, 2º: 35 CHF, 3º: 60 CHF, 4º+: 90+ CHF'
  },
  'Basement': {
    fr: 'Sous-sol',
    it: 'Seminterrato',
    pt: 'Cave'
  },
  'Ground floor': {
    fr: 'Rez-de-chaussée',
    it: 'Piano terra',
    pt: 'Rés-do-chão'
  },
  'Ground Floor': {
    fr: 'Rez-de-chaussée',
    it: 'Piano Terra',
    pt: 'Rés-do-chão'
  },
  '1st Floor': {
    fr: '1er étage',
    it: '1° piano',
    pt: '1º andar'
  },
  '2nd Floor': {
    fr: '2e étage',
    it: '2° piano',
    pt: '2º andar'
  },
  '3rd Floor': {
    fr: '3e étage',
    it: '3° piano',
    pt: '3º andar'
  },
  '4th Floor': {
    fr: '4e étage',
    it: '4° piano',
    pt: '4º andar'
  },
  '5th Floor': {
    fr: '5e étage',
    it: '5° piano',
    pt: '5º andar'
  },
  '6th Floor+': {
    fr: '6e étage et plus',
    it: '6° piano e oltre',
    pt: '6º andar ou mais'
  },
  'With Elevator': {
    fr: 'Avec ascenseur',
    it: 'Con ascensore',
    pt: 'Com elevador'
  },
  'Only Stairs': {
    fr: 'Uniquement escaliers',
    it: 'Solo scale',
    pt: 'Apenas escadas'
  },
  'Supported: Zürich (80xx/81xx/83xx/86xx), Schaffhausen (82xx), Winterthur (84xx).': {
    fr: 'Pris en charge : Zurich (80xx/81xx/83xx/86xx), Schaffhouse (82xx), Winterthour (84xx).',
    it: 'Supportato: Zurigo (80xx/81xx/83xx/86xx), Sciaffusa (82xx), Winterthur (84xx).',
    pt: 'Suportado: Zurique (80xx/81xx/83xx/86xx), Schaffhausen (82xx), Winterthur (84xx).'
  },
  'Destination (Target)': {
    fr: 'Destination (Cible)',
    it: 'Destinazione (Arrivo)',
    pt: 'Destino (Alvo)'
  },
  'Full Address (Street, House No.)': {
    fr: 'Adresse complète (Rue, n°)',
    it: 'Indirizzo completo (Via, n.)',
    pt: 'Endereço completo (Rua, n.º)'
  },
  'ZIP (e.g. 8400)': {
    fr: 'NPA (ex. 8400)',
    it: 'NPA (es. 8400)',
    pt: 'Código Postal (ex. 8400)'
  },
  'ADDITIONAL SERVICES / EXTRAS': {
    fr: 'SERVICES SUPPLÉMENTAIRES / EXTRAS',
    it: 'SERVIZI AGGIUNTIVI / EXTRA',
    pt: 'SERVIÇOS ADICIONAIS / EXTRAS'
  },
  'Furniture Assembly / Disassembly': {
    fr: 'Montage / Démontage de meubles',
    it: 'Montaggio / Smontaggio mobili',
    pt: 'Montagem / Desmontagem de móveis'
  },
  'Beds, desks, wardrobes': {
    fr: 'Lits, bureaux, armoires',
    it: 'Letti, scrivanie, armadi',
    pt: 'Camas, secretárias, roupeiros'
  },
  'Hours:': {
    fr: 'Heures :',
    it: 'Ore:',
    pt: 'Horas:'
  },
  'Hydraulic Lift Rental': {
    fr: 'Location de monte-meuble hydraulique',
    it: 'Noleggio elevatore idraulico',
    pt: 'Aluguer de elevador hidráulico'
  },
  'Bulky furniture to high floors': {
    fr: 'Meubles volumineux pour étages élevés',
    it: 'Mobili ingombranti ai piani alti',
    pt: 'Móveis volumosos para andares elevados'
  },
  'Hours required:': {
    fr: 'Heures requises :',
    it: 'Ore richieste:',
    pt: 'Horas necessárias:'
  },
  'Packaging Materials': {
    fr: 'Matériel d\'emballage',
    it: 'Materiali da imballaggio',
    pt: 'Materiais de embalagem'
  },
  'Boxes, bubble wrap, stretch film': {
    fr: 'Cartons, papier bulle, film étirable',
    it: 'Scatole, pluriball, pellicola estensibile',
    pt: 'Caixas, plástico bolha, película aderente'
  },
  'Inventory Details / Special Instructions': {
    fr: 'Détails de l\'inventaire / Instructions spéciales',
    it: 'Dettagli dell\'inventario / Istruzioni speciali',
    pt: 'Detalhes do inventário / Instruções especiais'
  },
  'e.g. 3-bedroom apartment, couch, fridge, 10 large boxes...': {
    fr: 'ex. appartement de 3 chambres, canapé, frigo, 10 grands cartons...',
    it: 'es. appartamento con 3 camere, divano, frigo, 10 scatole grandi...',
    pt: 'ex. apartamento de 3 quartos, sofá, frigorífico, 10 caixas grandes...'
  },
  'BUDGET BREAKDOWN': {
    fr: 'DÉTAIL DU BUDGET',
    it: 'DETTAGLIO DEL PREVENTIVO',
    pt: 'DETALHE DO ORÇAMENTO'
  },
  'Labor': {
    fr: 'Main-d\'œuvre',
    it: 'Manodopera',
    pt: 'Mão de obra'
  },
  'Gasoline': {
    fr: 'Carburant / Transport',
    it: 'Carburante',
    pt: 'Combustível / Transporte'
  },
  'round trip': {
    fr: 'aller-retour',
    it: 'andata e ritorno',
    pt: 'ida e volta'
  },
  'Furniture Assembly': {
    fr: 'Montage de meubles',
    it: 'Montaggio mobili',
    pt: 'Montagem de móveis'
  },
  'Flat Rate': {
    fr: 'Forfait',
    it: 'Tariffa fissa',
    pt: 'Taxa fixa'
  },
  'Stairs Carry Charge (Origin)': {
    fr: 'Frais de portage escaliers (Départ)',
    it: 'Supplemento scale (Partenza)',
    pt: 'Taxa de transporte por escadas (Origem)'
  },
  'Stairs Carry Charge (Destination)': {
    fr: 'Frais de portage escaliers (Destination)',
    it: 'Supplemento scale (Destino)',
    pt: 'Taxa de transporte por escadas (Destino)'
  },
  'Estimated Total': {
    fr: 'Total estimé',
    it: 'Totale stimato',
    pt: 'Total estimado'
  },
  'Please select valid ZIP codes for Zürich, Schaffhausen or Winterthur.': {
    fr: 'Veuillez sélectionner des codes postaux valides pour Zurich, Schaffhouse ou Winterthour.',
    it: 'Seleziona codici postali validi per Zurigo, Sciaffusa o Winterthur.',
    pt: 'Por favor, selecione códigos postais válidos para Zurique, Schaffhausen ou Winterthur.'
  },
  'Add to Cart': {
    fr: 'Ajouter au panier',
    it: 'Aggiungi al carrello',
    pt: 'Adicionar ao carrinho'
  },
  'Update Service': {
    fr: 'Mettre à jour le service',
    it: 'Aggiorna servizio',
    pt: 'Atualizar serviço'
  },
  'Moving Process': {
    fr: 'Processus de déménagement',
    it: 'Processo di trasloco',
    pt: 'Processo de mudança'
  },
  'Storage & Lift Constraints': {
    fr: 'Contraintes d\'espace et d\'ascenseur',
    it: 'Vincoli di spazio e ascensore',
    pt: 'Restrições de espaço e elevador'
  },
  'Surface Protection': {
    fr: 'Protection des surfaces',
    it: 'Protezione delle superfici',
    pt: 'Proteção de superfícies'
  },
  'Hydraulic Lift Necessity': {
    fr: 'Nécessité de monte-meuble hydraulique',
    it: 'Necessità di elevatore idraulico',
    pt: 'Necessidade de elevador hidráulico'
  },
  'Got it!': {
    fr: 'Compris !',
    it: 'Capito!',
    pt: 'Entendido!'
  },
  'Apartment': {
    fr: 'Appartement',
    it: 'Appartamento',
    pt: 'Apartamento'
  },
  'House': {
    fr: 'Maison',
    it: 'Casa',
    pt: 'Casa'
  },
  'Office': {
    fr: 'Bureau',
    it: 'Ufficio',
    pt: 'Escritório'
  },
  'Movers': {
    fr: 'Déménageurs',
    it: 'Traslocatori',
    pt: 'Carregadores'
  },
  'Standard': {
    fr: 'Standard',
    it: 'Standard',
    pt: 'Padrão'
  },
  'Plus': {
    fr: 'Plus',
    it: 'Plus',
    pt: 'Plus'
  },
  'Premium': {
    fr: 'Premium',
    it: 'Premium',
    pt: 'Premium'
  },
  'Assembly': {
    fr: 'Montage',
    it: 'Montaggio',
    pt: 'Montagem'
  },
  'Hydraulic Lift': {
    fr: 'Monte-meuble',
    it: 'Montacarichi',
    pt: 'Elevador Hidráulico'
  },
  'Stairs': {
    fr: 'Escaliers',
    it: 'Scale',
    pt: 'Escadas'
  },
  'Floor': {
    fr: 'Étage',
    it: 'Piano',
    pt: 'Piso'
  },
  'Origin floor': {
    fr: 'Étage d\'origine',
    it: 'Piano di partenza',
    pt: 'Piso de origem'
  },
  'Origin': {
    fr: 'Origine',
    it: 'Origine',
    pt: 'Origem'
  },
  'How our moving service works?': {
    fr: 'Comment fonctionne notre service de déménagement ?',
    it: 'Come funziona il nostro servizio traslochi?',
    pt: 'Como funciona o nosso serviço de mudanças?'
  },
  'Inventory or important details': {
    fr: 'Inventaire ou détails importants',
    it: 'Inventario o dettagli importanti',
    pt: 'Inventário ou detalhes importantes'
  },
  'Moving Route / Addresses': {
    fr: 'Itinéraire du déménagement / Adresses',
    it: 'Percorso trasloco / Indirizzi',
    pt: 'Rota de mudança / Endereços'
  },
  'Packaging Material': {
    fr: 'Matériel d\'emballage',
    it: 'Materiale da imballaggio',
    pt: 'Material de embalagem'
  },
  'Paid / Public Zone Parking Fee:': {
    fr: 'Frais de parking payant / zone publique :',
    it: 'Tariffa parcheggio a pagamento/pubblico:',
    pt: 'Taxa de estacionamento pago / zona pública:'
  },
  'Parking Situation': {
    fr: 'Situation de stationnement',
    it: 'Situazione parcheggio',
    pt: 'Situação do estacionamento'
  },
  'Pending': {
    fr: 'En attente',
    it: 'In sospeso',
    pt: 'Pendente'
  },
  'Route distance:': {
    fr: 'Distance de l\'itinéraire :',
    it: 'Distanza del percorso:',
    pt: 'Distância da rota:'
  },
  'Single Item': {
    fr: 'Article unique',
    it: 'Oggetto singolo',
    pt: 'Artigo único'
  },
  'Specialty': {
    fr: 'Spécial',
    it: 'Speciale',
    pt: 'Especial'
  },
  'Stairs Carrying Surcharge:': {
    fr: 'Supplément pour portage par escaliers :',
    it: 'Supplemento per trasporto scale:',
    pt: 'Taxa de transporte por escadas:'
  },
  'Street Name & No.': {
    fr: 'Rue et n°',
    it: 'Via e n.',
    pt: 'Rua e n.º'
  },
  'What are we moving? / Move Type': {
    fr: 'Que déménageons-nous ? / Type de déménagement',
    it: 'Cosa stiamo traslocando? / Tipo trasloco',
    pt: 'O que vamos mudar? / Tipo de mudança'
  }
};

// --- Main Page Component ---

const ConsultationPage: React.FC<ConsultationPageProps> = ({ onNavigate, cart, setCart }) => {
  const { t, language } = useTranslation();

  const mt = (en: string, es: string, de: string = en, fr: string = en, it: string = en, pt: string = en) => {
      if (language === 'es') return es;
      if (language === 'de' || language === 'de-CH') return de;
      
      const fallback = fallbackTranslations[en];
      if (language === 'fr') {
          return fr !== en ? fr : (fallback?.fr || en);
      }
      if (language === 'it') {
          return it !== en ? it : (fallback?.it || en);
      }
      if (language === 'pt') {
          return pt !== en ? pt : (fallback?.pt || en);
      }
      return en;
  };
  
  const getTranslatedCartDescription = (item: any) => {
      const config = item.details || {};
      const descParts: string[] = [];

      switch (item.type) {
          case 'end-of-tenancy': {
              if (config.roomsCount > 0) descParts.push(`${config.roomsCount} ${config.roomsCount === 1 ? t('consultation.label.room') : t('consultation.label.rooms')}`);
              if (config.bathroomsCount > 0) descParts.push(`${config.bathroomsCount} ${config.bathroomsCount === 1 ? t('consultation.label.bath') : t('consultation.label.baths')}`);
              if (config.balconyCount > 0) descParts.push(`${t('consultation.label.balcony')} (${config.balconyCount})`);
              if (config.storageCount > 0) descParts.push(`${t('consultation.label.storage')} (${config.storageCount})`);
              if (config.carpetCount > 0) descParts.push(`${t('consultation.label.carpet')} (${config.carpetCount})`);
              if (config.furnitureCount > 0) descParts.push(`${t('consultation.label.upholstery')} (${config.furnitureCount})`);
              if (config.ovenInterior) descParts.push(t('extras.ovenInterior'));
              if (config.fridgeFreezer) descParts.push(t('extras.fridgeFreezer'));
              if (config.windowsUnit > 0) descParts.push(`${config.windowsUnit} ${t('extras.windows')}`);
              if (config.blindsShutters > 0) descParts.push(`${config.blindsShutters} ${t('extras.blinds')}`);
              if (config.extractorHood) descParts.push(t('extras.extractorHood'));
              if (config.showerDescaling) descParts.push(t('extras.showerDescaling'));
              if (config.cabinetInterior) descParts.push(t('extras.cabinetInterior'));
              if (config.bedLinenLaundry) descParts.push(t('extras.bedLinenLaundry'));
              if (config.ecoProducts) descParts.push(t('extras.ecoProducts'));
              if (config.machineFloorSqm > 0) descParts.push(`${config.machineFloorSqm}m² ${t('extras.machineFloor')}`);
              if (config.trashBinCount > 0) descParts.push(`${config.trashBinCount} ${t('extras.trashBins')}`);
              break;
          }
          case 'deep-cleaning': {
              if (config.bedrooms > 0) descParts.push(`${config.bedrooms} ${config.bedrooms === 1 ? t('consultation.label.bed') : t('consultation.label.beds')}`);
              if (config.bathrooms > 0) descParts.push(`${config.bathrooms} ${config.bathrooms === 1 ? t('consultation.label.bath') : t('consultation.label.baths')}`);
              if (config.frequency) {
                  let freqLabel = config.frequency;
                  if (config.frequency === 'One-Time') freqLabel = t('frequency.One-Time', 'One-Time');
                  else if (config.frequency.includes('Every 3 Months')) freqLabel = t('frequency.Every 3 Months', 'Every 3 Months');
                  else if (config.frequency.includes('Every 4 Months')) freqLabel = t('frequency.Every 4 Months', 'Every 4 Months');
                  else if (config.frequency.includes('Every 6 Months')) freqLabel = t('frequency.Every 6 Months', 'Every 6 Months');
                  else if (config.frequency.includes('Every Year')) freqLabel = t('frequency.Every Year', 'Every Year');
                  descParts.push(freqLabel);
              }
              if (config.frequency !== 'One-Time' && config.recurringDayPreference) {
                  descParts.push(`${t('consultation.label.day')}: ${config.recurringDayPreference}`);
              }
              if (config.balconyCount > 0) descParts.push(`${t('consultation.label.balcony')} (${config.balconyCount})`);
              if (config.storageCount > 0) descParts.push(`${t('consultation.label.storage')} (${config.storageCount})`);
              if (config.carpetCount > 0) descParts.push(`${t('consultation.label.carpet')} (${config.carpetCount})`);
              if (config.furnitureCount > 0) descParts.push(`${t('consultation.label.upholstery')} (${config.furnitureCount})`);
              if (config.ovenInterior) descParts.push(t('extras.ovenInterior'));
              if (config.fridgeFreezer) descParts.push(t('extras.fridgeFreezer'));
              if (config.windowsUnit > 0) descParts.push(`${config.windowsUnit} ${t('extras.windows')}`);
              if (config.blindsShutters > 0) descParts.push(`${config.blindsShutters} ${t('extras.blinds')}`);
              if (config.extractorHood) descParts.push(t('extras.extractorHood'));
              if (config.showerDescaling) descParts.push(t('extras.showerDescaling'));
              if (config.cabinetInterior) descParts.push(t('extras.cabinetInterior'));
              if (config.bedLinenLaundry) descParts.push(t('extras.bedLinenLaundry'));
              if (config.ecoProducts) descParts.push(t('extras.ecoProducts'));
              if (config.machineFloorSqm > 0) descParts.push(`${config.machineFloorSqm}m² ${t('extras.machineFloor')}`);
              if (config.trashBinCount > 0) descParts.push(`${config.trashBinCount} ${t('extras.trashBins')}`);
              break;
          }
          case 'daily-cleaning': {
              let freqLabel = config.frequency || 'Daily';
              if (freqLabel === 'Daily') freqLabel = t('frequency.Daily', 'Daily');
              else if (freqLabel === 'Weekly') freqLabel = t('frequency.Weekly', 'Weekly');
              else if (freqLabel === 'Bi-Weekly') freqLabel = t('frequency.Bi-Weekly', 'Bi-Weekly');
              else if (freqLabel === 'Monthly') freqLabel = t('frequency.Monthly', 'Monthly');
              descParts.push(freqLabel);

              if (config.frequencyDetails) {
                  descParts.push(`${t('consultation.label.day')}: ${config.frequencyDetails}`);
              }
              if (config.bedrooms > 0) descParts.push(`${config.bedrooms} ${config.bedrooms === 1 ? t('consultation.label.bed') : t('consultation.label.beds')}`);
              if (config.bathrooms > 0) descParts.push(`${config.bathrooms} ${config.bathrooms === 1 ? t('consultation.label.bath') : t('consultation.label.baths')}`);
              if (config.ironing) descParts.push(t('consultation.label.ironing'));
              if (config.laundry) descParts.push(t('consultation.label.laundry'));
              if (config.oven) descParts.push(t('consultation.label.oven'));
              if (config.cabinets) descParts.push(t('consultation.label.cabinets'));
              if (config.fridge) descParts.push(t('consultation.label.fridge'));
              if (config.windowCount > 0) descParts.push(`${config.windowCount} ${config.windowCount === 1 ? t('consultation.label.window') : t('consultation.label.windows')}`);
              break;
          }
          case 'moving': {
              let mType = config.moveType || 'Apartment';
              if (mType === 'Apartment') mType = mt('Apartment', 'Apartamento', 'Wohnung');
              else if (mType === 'House') mType = mt('House', 'Casa', 'Haus');
              else if (mType === 'Office') mType = mt('Office', 'Oficina', 'Büro');
              descParts.push(mType);

              descParts.push(`${config.moversCount || 2} ${mt('Movers', 'Mozos de Mudanza', 'Umzugshelfer')}`);

              let sLevel = config.serviceLevel || 'Standard';
              if (sLevel === 'Standard') sLevel = mt('Standard', 'Estándar', 'Standard');
              else if (sLevel === 'Plus') sLevel = mt('Plus', 'Plus', 'Plus');
              else if (sLevel === 'Premium') sLevel = mt('Premium', 'Premium', 'Premium');
              descParts.push(sLevel);
              break;
          }
          case 'car-detailing': {
              const count = config.vehicles ? config.vehicles.length : 1;
              descParts.push(`${count} ${count === 1 ? t('consultation.label.vehicle') : t('consultation.label.vehicles')}`);
              if (config.vehicles && config.vehicles[0]) {
                  const coverage = config.vehicles[0].coverage || 'Interior';
                  descParts.push(`${t('consultation.label.cat')} ${config.vehicles[0].category}`);
                  descParts.push(coverage);
              }
              break;
          }
          case 'gardening': {
              descParts.push(`${t('services.gardening.title')} (${config.size || 'Medium'})`);
              descParts.push(`${t('consultation.label.condition')}: ${config.condition || 'Standard'}`);
              if (config.mowing) descParts.push(t('consultation.label.lawnMowed'));
              if (config.hedgeMeters > 0) descParts.push(`${t('consultation.label.hedges')} ${config.hedgeMeters}m`);
              break;
          }
          case 'exterior-cleaning': {
              const area = config.surfaces ? config.surfaces.reduce((acc: number, s: any) => acc + (parseFloat(s.areaSqm) || 0), 0) : config.approxSize || 0;
              descParts.push(`${t('consultation.label.exteriorWash')} (${area}m²)`);
              break;
          }
          case 'gutter-cleaning': {
              descParts.push(`${t('consultation.label.gutter')}: ${config.buildingHeight || '1 Story'}`);
              if (config.downspoutFlush) descParts.push(t('consultation.label.withFlush'));
              break;
          }
          case 'pest-control': {
              descParts.push(`${t('services.pest.title')}: ${config.pestCategory || 'Insects'} (${config.pestSubtype || 'Ants'})`);
              break;
          }
          case 'waste-management': {
              descParts.push(t('services.waste.title'));
              descParts.push(config.wasteType || 'Household');
              break;
          }
          default: return item.description || t('consultation.serviceSelected');
      }

      return descParts.join(' | ');
  };

  const renderCartItemDetails = (item: any) => {
      const config = item.details || {};
      const pills: { label: string; icon?: string; badge?: string }[] = [];

      switch (item.type) {
          case 'end-of-tenancy': {
              if (config.roomsCount > 0) {
                  pills.push({ label: `${config.roomsCount} ${config.roomsCount === 1 ? t('consultation.label.room') : t('consultation.label.rooms')}`, icon: '🏠' });
              }
              if (config.bathroomsCount > 0) {
                  pills.push({ label: `${config.bathroomsCount} ${config.bathroomsCount === 1 ? t('consultation.label.bath') : t('consultation.label.baths')}`, icon: '🛁' });
              }
              if (config.balconyCount > 0) {
                  pills.push({ label: `${t('consultation.label.balcony')} (${config.balconyCount})`, icon: '🌅' });
              }
              if (config.storageCount > 0) {
                  pills.push({ label: `${t('consultation.label.storage')} (${config.storageCount})`, icon: '📦' });
              }
              if (config.carpetCount > 0) {
                  pills.push({ label: `${t('consultation.label.carpet')} (${config.carpetCount})`, icon: '🧶' });
              }
              if (config.furnitureCount > 0) {
                  pills.push({ label: `${t('consultation.label.upholstery')} (${config.furnitureCount})`, icon: '🛋️' });
              }
              if (config.ovenInterior) pills.push({ label: t('extras.ovenInterior'), icon: '🍳' });
              if (config.fridgeFreezer) pills.push({ label: t('extras.fridgeFreezer'), icon: '🧊' });
              if (config.windowsUnit > 0) pills.push({ label: `${config.windowsUnit} ${t('extras.windows')}`, icon: '🪟' });
              if (config.blindsShutters > 0) pills.push({ label: `${config.blindsShutters} ${t('extras.blinds')}`, icon: '🩏' });
              if (config.extractorHood) pills.push({ label: t('extras.extractorHood'), icon: '🌬️' });
              if (config.showerDescaling) pills.push({ label: t('extras.showerDescaling'), icon: '🚿' });
              if (config.cabinetInterior) pills.push({ label: t('extras.cabinetInterior'), icon: '🗄️' });
              if (config.bedLinenLaundry) pills.push({ label: t('extras.bedLinenLaundry'), icon: '🧺' });
              if (config.ecoProducts) pills.push({ label: t('extras.ecoProducts'), icon: '🌿' });
              if (config.machineFloorSqm > 0) pills.push({ label: `${config.machineFloorSqm}m² ${t('extras.machineFloor')}`, icon: '🧼' });
              if (config.trashBinCount > 0) pills.push({ label: `${config.trashBinCount} ${t('extras.trashBins')}`, icon: '🗑️' });
              break;
          }
          case 'deep-cleaning': {
              if (config.bedrooms > 0) {
                  pills.push({ label: `${config.bedrooms} ${config.bedrooms === 1 ? t('consultation.label.bed') : t('consultation.label.beds')}`, icon: '🛏️' });
              }
              if (config.bathrooms > 0) {
                  pills.push({ label: `${config.bathrooms} ${config.bathrooms === 1 ? t('consultation.label.bath') : t('consultation.label.baths')}`, icon: '🛁' });
              }
              if (config.frequency) {
                  let freqLabel = config.frequency;
                  if (config.frequency === 'One-Time') freqLabel = t('frequency.One-Time', 'One-Time');
                  else if (config.frequency.includes('Every 3 Months')) freqLabel = t('frequency.Every 3 Months', 'Every 3 Months');
                  else if (config.frequency.includes('Every 4 Months')) freqLabel = t('frequency.Every 4 Months', 'Every 4 Months');
                  else if (config.frequency.includes('Every 6 Months')) freqLabel = t('frequency.Every 6 Months', 'Every 6 Months');
                  else if (config.frequency.includes('Every Year')) freqLabel = t('frequency.Every Year', 'Every Year');
                  pills.push({ label: freqLabel, icon: '🔄' });
              }
              if (config.frequency !== 'One-Time' && config.recurringDayPreference) {
                  pills.push({ label: `${t('consultation.label.day')}: ${config.recurringDayPreference}`, icon: '📅' });
              }
              if (config.balconyCount > 0) {
                  pills.push({ label: `${t('consultation.label.balcony')} (${config.balconyCount})`, icon: '🌅' });
              }
              if (config.storageCount > 0) {
                  pills.push({ label: `${t('consultation.label.storage')} (${config.storageCount})`, icon: '📦' });
              }
              if (config.carpetCount > 0) {
                  pills.push({ label: `${t('consultation.label.carpet')} (${config.carpetCount})`, icon: '🧶' });
              }
              if (config.furnitureCount > 0) {
                  pills.push({ label: `${t('consultation.label.upholstery')} (${config.furnitureCount})`, icon: '🛋️' });
              }
              if (config.ovenInterior) pills.push({ label: t('extras.ovenInterior'), icon: '🍳' });
              if (config.fridgeFreezer) pills.push({ label: t('extras.fridgeFreezer'), icon: '🧊' });
              if (config.windowsUnit > 0) pills.push({ label: `${config.windowsUnit} ${t('extras.windows')}`, icon: '🪟' });
              if (config.blindsShutters > 0) pills.push({ label: `${config.blindsShutters} ${t('extras.blinds')}`, icon: '🩏' });
              if (config.extractorHood) pills.push({ label: t('extras.extractorHood'), icon: '🌬️' });
              if (config.showerDescaling) pills.push({ label: t('extras.showerDescaling'), icon: '🚿' });
              if (config.cabinetInterior) pills.push({ label: t('extras.cabinetInterior'), icon: '🗄️' });
              if (config.bedLinenLaundry) pills.push({ label: t('extras.bedLinenLaundry'), icon: '🧺' });
              if (config.ecoProducts) pills.push({ label: t('extras.ecoProducts'), icon: '🌿' });
              if (config.machineFloorSqm > 0) pills.push({ label: `${config.machineFloorSqm}m² ${t('extras.machineFloor')}`, icon: '🧼' });
              if (config.trashBinCount > 0) pills.push({ label: `${config.trashBinCount} ${t('extras.trashBins')}`, icon: '🗑️' });
              break;
          }
          case 'daily-cleaning': {
              let freqLabel = config.frequency || 'Daily';
              if (freqLabel === 'Daily') freqLabel = t('frequency.Daily', 'Daily');
              else if (freqLabel === 'Weekly') freqLabel = t('frequency.Weekly', 'Weekly');
              else if (freqLabel === 'Bi-Weekly') freqLabel = t('frequency.Bi-Weekly', 'Bi-Weekly');
              else if (freqLabel === 'Monthly') freqLabel = t('frequency.Monthly', 'Monthly');
              pills.push({ label: freqLabel, icon: '🔄' });

              if (config.frequencyDetails) {
                  pills.push({ label: `${t('consultation.label.day')}: ${config.frequencyDetails}`, icon: '📅' });
              }
              if (config.bedrooms > 0) {
                  pills.push({ label: `${config.bedrooms} ${config.bedrooms === 1 ? t('consultation.label.bed') : t('consultation.label.beds')}`, icon: '🛏️' });
              }
              if (config.bathrooms > 0) {
                  pills.push({ label: `${config.bathrooms} ${config.bathrooms === 1 ? t('consultation.label.bath') : t('consultation.label.baths')}`, icon: '🛁' });
              }
              if (config.ironing) pills.push({ label: `${t('consultation.label.ironing')} (${config.ironingHours || 1}h)`, icon: '👔' });
              if (config.laundry) pills.push({ label: `${t('consultation.label.laundry')} (${config.laundryHours || 1}h)`, icon: '🧺' });
              if (config.oven) pills.push({ label: `${t('consultation.label.oven')} (${config.ovenGrease || 'Standard'})`, icon: '🍳' });
              if (config.cabinets) pills.push({ label: t('consultation.label.cabinets'), icon: '🗄️' });
              if (config.fridge) pills.push({ label: t('consultation.label.fridge'), icon: '❄️' });
              if (config.windowCount > 0) {
                  pills.push({ label: `${config.windowCount} ${config.windowCount === 1 ? t('consultation.label.window') : t('consultation.label.windows')}`, icon: '🪟' });
              }
              break;
          }
          case 'moving': {
              const formatFloor = (floor: string) => {
                  if (floor === 'Basement') return mt('Basement', 'Sótano', 'Keller');
                  if (floor === '0') return mt('Ground floor', 'Planta baja', 'Erdgeschoss');
                  if (floor === '6+') return mt('6th Floor+', '6ª Planta o más', '6. Stock+');
                  return `${floor}. ${mt('Floor', 'Piso', 'Stock')}`;
              };

              let mType = config.moveType || 'Apartment';
              if (mType === 'Apartment') mType = mt('Apartment', 'Apartamento', 'Wohnung');
              else if (mType === 'House') mType = mt('House', 'Casa', 'Haus');
              else if (mType === 'Office') mType = mt('Office', 'Oficina', 'Büro');
              pills.push({ label: mType, icon: '🏢' });

              pills.push({ label: `${config.moversCount || 2} ${mt('Movers', 'Mozos de Mudanza', 'Umzugshelfer')}`, icon: '👥' });

              let sLevel = config.serviceLevel || 'Standard';
              if (sLevel === 'Standard') sLevel = mt('Standard', 'Estándar', 'Standard');
              else if (sLevel === 'Plus') sLevel = mt('Plus', 'Plus', 'Plus');
              else if (sLevel === 'Premium') sLevel = mt('Premium', 'Premium', 'Premium');
              pills.push({ label: sLevel, icon: '⚡' });

              if (config.assembly) {
                  pills.push({ label: `${mt('Assembly', 'Montaje', 'Möbelmontage')} (${config.assemblyHours || 0}h)`, icon: '🔧' });
              }
              if (config.hydraulicLift) {
                  pills.push({ label: `${mt('Hydraulic Lift', 'Ascensor hidráulico', 'Möbellift')} (${config.hydraulicLiftHours || 0}h)`, icon: '🏗️' });
              }
              if (config.floorFrom && config.floorFrom !== '0') {
                  const stairsSurcharge = getStairSurcharge(config.floorFrom, config.accessFrom, config.moversCount || 2);
                  const accessStatus = config.accessFrom === 'Stairs' 
                      ? ` (${mt('Stairs', 'Sin Ascensor', 'Treppe')}: +${stairsSurcharge} CHF)` 
                      : ` (${mt('Lift', 'Con Ascensor', 'Lift')})`;
                  pills.push({ label: `${mt('Origin floor', 'Piso de origen', 'Stockwerk Auszug')}: ${formatFloor(config.floorFrom)}${accessStatus}`, icon: '🪜' });
              }
              if (config.floorTo && config.floorTo !== '0') {
                  const stairsSurcharge = getStairSurcharge(config.floorTo, config.accessTo, config.moversCount || 2);
                  const accessStatus = config.accessTo === 'Stairs' 
                      ? ` (${mt('Stairs', 'Sin Ascensor', 'Treppe')}: +${stairsSurcharge} CHF)` 
                      : ` (${mt('Lift', 'Con Ascensor', 'Lift')})`;
                  pills.push({ label: `${mt('Destination floor', 'Piso de destino', 'Stockwerk Einzug')}: ${formatFloor(config.floorTo)}${accessStatus}`, icon: '🪜' });
              }
              if (config.fromZip && config.toZip) {
                  pills.push({ label: `${config.fromZip} → ${config.toZip}`, icon: '📍' });
              }
              break;
          }
          case 'car-detailing': {
              const vehicles = config.vehicles || [];
              if (vehicles.length > 0) {
                  return (
                      <div className="space-y-2 mt-2 pl-4 border-l-2 border-blue-100 ml-1">
                          {vehicles.map((v: any, vIdx: number) => (
                              <div key={vIdx} className="space-y-1">
                                  <div className="text-[10px] font-black uppercase text-blue-800 flex items-center gap-1.5">
                                      <span>🚗</span>
                                      <span>{t('services.car.title')} #{vIdx + 1}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                      {v.category && (
                                          <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-[#007bff] px-1.5 py-0.5 rounded text-[9px] font-bold">
                                              {v.category}
                                          </span>
                                      )}
                                      {v.coverage && (
                                          <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                              {v.coverage === 'Full' || (v.coverage || '').includes('FULL') || (v.coverage || '').includes('100%') ? 'Full Treatment' : (v.coverage || '').includes('INTERIOR') || (v.coverage || '').includes('60%') ? 'Interior Only' : 'Exterior Only'}
                                          </span>
                                      )}
                                      {v.dirtLevel && (
                                          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                              {v.dirtLevel}
                                          </span>
                                      )}
                                      {v.location && (
                                          <span className="inline-flex items-center gap-1 bg-teal-50 border border-teal-100 text-teal-800 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                              📍 {v.location}
                                          </span>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  );
              } else {
                  pills.push({ label: `1 ${t('consultation.label.vehicle')}`, icon: '🚗' });
              }
              break;
          }
          case 'gardening': {
              pills.push({ label: `${t('services.gardening.title')} (${config.size || 'Medium'})`, icon: '📐' });
              pills.push({ label: `${t('consultation.label.condition')}: ${config.condition || 'Standard'}`, icon: '🌿' });
              if (config.mowing) {
                  pills.push({ label: t('consultation.label.lawnMowed'), icon: '🚜' });
              }
              if (config.hedgeMeters > 0) {
                  pills.push({ label: `${t('consultation.label.hedges')} ${config.hedgeMeters}m`, icon: '🌳' });
              }
              break;
          }
          case 'exterior-cleaning': {
              const surfaces = config.surfaces || [];
              if (surfaces.length > 0) {
                  return (
                      <div className="space-y-2 mt-2 pl-4 border-l-2 border-blue-100 ml-1">
                          <div className="text-[10px] font-black uppercase text-blue-850 flex items-center gap-1.5">
                              <span>💧</span>
                              <span>{t('services.exterior.title')}</span>
                          </div>
                          <div className="space-y-1.5">
                              {surfaces.map((s: any, sIdx: number) => (
                                  <div key={sIdx} className="flex flex-wrap gap-1 items-center">
                                      <span className="text-[10px] text-gray-400 font-bold">#{sIdx+1}:</span>
                                      <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-[#007bff] px-1.5 py-0.5 rounded text-[9px] font-bold">
                                          {s.surfaceType}
                                      </span>
                                      <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                          {s.material}
                                      </span>
                                      <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                          {s.areaSqm} m²
                                      </span>
                                      {s.moldSealing && (
                                          <span className="inline-flex items-center gap-1 bg-green-50 border border-green-100 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                              🛡️ Anti-Mold Sealing
                                          </span>
                                      )}
                                  </div>
                              ))}
                          </div>
                      </div>
                  );
              } else {
                  const area = config.approxSize || 0;
                  pills.push({ label: `${t('consultation.label.exteriorWash')} (${area}m²)`, icon: '💧' });
              }
              break;
          }
          case 'gutter-cleaning': {
              pills.push({ label: `${t('consultation.label.gutter')}: ${config.buildingHeight || '1 Story'}`, icon: '🍂' });
              if (config.lengthCategory) {
                  pills.push({ label: config.lengthCategory, icon: '📏' });
              }
              if (config.downspoutFlush) {
                  pills.push({ label: t('consultation.label.withFlush'), icon: '💧' });
              }
              break;
          }
          case 'pest-control': {
              pills.push({ label: `${t('services.pest.title')}: ${config.pestCategory || 'Insects'} (${config.pestSubtype || 'Ants'})`, icon: '🐜' });
              if (config.urgency) {
                  pills.push({ label: config.urgency, icon: '🚨' });
              }
              break;
          }
          case 'waste-management': {
              pills.push({ label: t('services.waste.title'), icon: '🗑️' });
              if (config.wasteType) {
                  pills.push({ label: config.wasteType, icon: '📦' });
              }
              if (config.volume) {
                  pills.push({ label: config.volume, icon: '📐' });
              }
              break;
          }
          default:
              return <div className="text-[11px] text-gray-500 font-medium leading-relaxed pl-10 border-l-2 border-blue-100 ml-3">{item.description || t('consultation.serviceSelected')}</div>;
      }

      return (
          <div className="flex flex-wrap gap-1 mt-1.5 pl-4 border-l-2 border-blue-100 ml-1">
              {pills.map((pill, idx) => (
                  <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-700 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-sm hover:bg-slate-100 transition-colors"
                  >
                      {pill.icon && <span className="text-[12px]">{pill.icon}</span>}
                      <span>{pill.label}</span>
                  </span>
              ))}
          </div>
      );
  };

  
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<ServiceType | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showInclusionsModal, setShowInclusionsModal] = useState<string | null>(null);
  const [comingSoonModalService, setComingSoonModalService] = useState<ServiceType | null>(null);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [config, setConfig] = useState<any>({});
  const [showWindowInfo, setShowWindowInfo] = useState(false);
  const [isMobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [anonAuthError, setAnonAuthError] = useState<string | null>(null);
  
  // Firebase Upload Tracker State
  const [uploadStates, setUploadStates] = useState<Array<{
      id: string;
      name: string;
      progress: number;
      status: 'idle' | 'uploading' | 'success' | 'error';
      url?: string;
      error?: string;
  }>>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileSummaryBar, setShowMobileSummaryBar] = useState(true);
  const [showMovingInfo, setShowMovingInfo] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [extrasActiveDot, setExtrasActiveDot] = useState(0);
  const extrasScrollRef = useRef<HTMLDivElement>(null);

  const handleExtrasScroll = () => {
    if (extrasScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = extrasScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) {
        setExtrasActiveDot(0);
        return;
      }
      const ratio = scrollLeft / maxScroll;
      if (ratio < 0.33) {
        setExtrasActiveDot(0);
      } else if (ratio < 0.67) {
        setExtrasActiveDot(1);
      } else {
        setExtrasActiveDot(2);
      }
    }
  };

  const scrollToExtraDot = (index: number) => {
    if (extrasScrollRef.current) {
      const { scrollWidth, clientWidth } = extrasScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const targetScroll = (maxScroll / 2) * index;
      extrasScrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
      setExtrasActiveDot(index);
    }
  };

  // Form Fields State with LocalStorage Persistence
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+41');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [accessMethod, setAccessMethod] = useState('I am on-site');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isMarketingSubscribed, setIsMarketingSubscribed] = useState(false);

  // New Booking Mode state
  const [bookingMode, setBookingMode] = useState<'direct' | 'validate' | null>(null);

  // Active page-level wizard step (1-Location, 2-Core services, 3-Additional services, 4-Photos)
  const [activeWizardStep, setActiveWizardStep] = useState(1);

  // Reset page step back to 1 if the postcode gets emptied or invalidated
  useEffect(() => {
    if ((!postcode || postcode.length !== 4) && activeWizardStep > 1) {
      setActiveWizardStep(1);
    }
  }, [postcode]);

  // Comic-only cart checks
  const onlyComics = cart.length > 0 && cart.every(item => item.type === 'comic-book');
  const hasServices = cart.some(item => item.type !== 'comic-book');

  // Auto-set booking mode to direct for comic-only purchases
  useEffect(() => {
    if (onlyComics && bookingMode !== 'direct') {
      setBookingMode('direct');
    }
  }, [onlyComics, bookingMode]);

  // Step state for the contact / booking modal
  const [currentStep, setCurrentStep] = useState(1);
  const [draftDocId, setDraftDocId] = useState<string | null>(null);
  const [submittedRequestData, setSubmittedRequestData] = useState<any | null>(null);
  const [paymentCompletedBooking, setPaymentCompletedBooking] = useState<any | null>(null);

  const saveDraftToFirestore = async (stepNum: number) => {
    if (!email || !email.includes('@')) return;

    try {
      if (!auth.currentUser) {
        try {
          const { signInAnonymously } = await import('firebase/auth');
          await signInAnonymously(auth);
        } catch (e) {
          console.warn("Could not sign in anonymously for draft:", e);
        }
      }

      const currentUid = auth.currentUser?.uid || 'anonymous_client';
      let idToUse = draftDocId;
      if (!idToUse) {
        idToUse = doc(collection(db, 'maintenance_requests')).id;
        setDraftDocId(idToUse);
      }

      const fullPhone = `${phonePrefix} ${phone}`.trim();
      const fullAddress = [address, `${postcode} ${city}`].filter(Boolean).join(', ');
      
      const draftPayload = {
        id: idToUse,
        userId: currentUid,
        client: (clientName.trim() || email.split('@')[0] || 'Draft Client').substring(0, 100),
        service: (cart.map(c => c.title || c.type).join(', ') || 'Consultation Draft Inquiry').substring(0, 100),
        date: selectedDate || new Date().toISOString().split('T')[0],
        status: 'Draft' as const,
        priority: 'Low' as const,
        amount: grandTotal || 0,
        email: email.trim(),
        phone: fullPhone,
        address: fullAddress,
        notes: `[DRAFT - STEP ${stepNum}] ${notes || 'Incomplete consultation submission'}`.substring(0, 500),
        mediaUrls: uploadStates.filter(s => s.status === 'success' && s.url).map(s => s.url as string),
        mediaNames: uploadStates.filter(s => s.status === 'success').map(s => s.name),
        bookingMode: bookingMode || 'direct',
        accessMethod: accessMethod || '',
        time: selectedTime || 'flexible',
        services: cart.map(item => ({
          type: item.type,
          title: item.title,
          price: item.calculatedPrice || item.price || 0,
          details: item
        })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const requestRef = doc(db, 'maintenance_requests', idToUse);
      await setDoc(requestRef, draftPayload, { merge: true });
      console.log("Draft successfully recorded in Firestore:", idToUse);
    } catch (err) {
      console.error("Failed to auto-save consultation draft to Firestore:", err);
    }
  };

  useEffect(() => {
    if (isContactModalOpen) {
      setCurrentStep(1);
      setSubmittedRequestData(null);
    }
  }, [isContactModalOpen]);

  const handleNextStep = () => {
    const requiredMsg = t('consultation.form.error.required');
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!clientName.trim()) newErrors.clientName = requiredMsg;
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = requiredMsg;
      if (!phone.trim()) newErrors.phone = requiredMsg;
      if (!selectedDate) newErrors.selectedDate = requiredMsg;
      if (!selectedTime) newErrors.selectedTime = requiredMsg;
    } else if (currentStep === 2) {
      if (!bookingMode) newErrors.bookingMode = requiredMsg;
    } else if (currentStep === 3) {
      if (!address.trim()) newErrors.address = requiredMsg;
      if (!postcode.trim()) newErrors.postcode = requiredMsg;
      if (!city.trim()) newErrors.city = requiredMsg;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      saveDraftToFirestore(currentStep);
      setCurrentStep(prev => prev + 1);
    } else {
      const firstError = document.querySelector('.shake');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };


  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Location Need State
  const [locationNeeded, setLocationNeeded] = useState(false);

  useEffect(() => {
    if (address.trim() && postcode.trim().length === 4) {
      setLocationNeeded(false);
    }
  }, [address, postcode]);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [payrexxError, setPayrexxError] = useState<{ message: string; dataToSave: any } | null>(null);

  const [tempAddress, setTempAddress] = useState(address);
  const [tempPostcode, setTempPostcode] = useState(postcode);
  const [tempCity, setTempCity] = useState(city);
  const [tempErrors, setTempErrors] = useState('');

  useEffect(() => {
    setTempAddress(address);
  }, [address]);

  useEffect(() => {
    setTempPostcode(postcode);
  }, [postcode]);

  useEffect(() => {
    setTempCity(city);
  }, [city]);

  const handleTempPostcodeChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    setTempPostcode(digits);
    
    if (digits === '8200' || digits === '8201' || digits === '8203' || digits === '8207' || digits === '8208') {
        setTempCity('Schaffhausen');
    } else if (digits === '8400' || digits === '8401' || digits === '8404' || digits === '8405' || digits === '8406' || digits === '8408') {
        setTempCity('Winterthur');
    } else if (digits.startsWith('80') && digits.length === 4) {
        setTempCity('Zürich');
    } else if (digits.startsWith('81') && digits.length === 4) {
        setTempCity('Zürich');
    } else if (digits.startsWith('83') && digits.length === 4) {
        setTempCity('Zürich');
    } else if (digits.startsWith('86') && digits.length === 4) {
        setTempCity('Zürich');
    }
  };

  const handleSaveAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tempAddress.trim() || !tempPostcode.trim() || !tempCity.trim()) {
        setTempErrors('Por favor, completa todos los campos para poder continuar.');
        return;
    }
    if (!/^\d{4}$/.test(tempPostcode.trim())) {
        setTempErrors('El código postal debe ser un número de 4 dígitos (p.ej. 8200).');
        return;
    }
    setAddress(tempAddress.trim());
    setPostcode(tempPostcode.trim());
    setCity(tempCity.trim());
    setShowAddressModal(false);
    setTempErrors('');
  };

  const handlePostcodeChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    setPostcode(digits);
    
    if (digits === '8200' || digits === '8201' || digits === '8203' || digits === '8207' || digits === '8208') {
        setCity('Schaffhausen');
    } else if (digits === '8400' || digits === '8401' || digits === '8404' || digits === '8405' || digits === '8406' || digits === '8408') {
        setCity('Winterthur');
    } else if (digits.startsWith('80') && digits.length === 4) {
        setCity('Zürich');
    } else if (digits.startsWith('81') && digits.length === 4) {
        setCity('Zürich');
    } else if (digits.startsWith('83') && digits.length === 4) {
        setCity('Zürich');
    } else if (digits.startsWith('86') && digits.length === 4) {
        setCity('Zürich');
    }
  };

  // To preserve name for reviews after clearing form
  const lastSubmittedName = useRef('');

  // Load Persisted Contact Data on Mount
  useEffect(() => {
    const savedData = localStorage.getItem(PERSISTENCE_KEY);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            if (data.name) setClientName(data.name);
            if (data.email) setEmail(data.email);
            if (data.phonePrefix) setPhonePrefix(data.phonePrefix);
            if (data.phone) setPhone(data.phone);
            if (data.address) setAddress(data.address);
            if (data.postcode) setPostcode(data.postcode);
            if (data.city) setCity(data.city);
            if (data.notes) setNotes(data.notes);
            if (data.accessMethod) setAccessMethod(data.accessMethod);
            if (data.date) setSelectedDate(data.date);
            if (data.time) setSelectedTime(data.time);
            if (data.terms) setIsTermsAgreed(data.terms);
            if (data.marketing !== undefined) setIsMarketingSubscribed(data.marketing);
            if (data.bookingMode) setBookingMode(data.bookingMode);

            // Auto-focus selected service from SEO pages
            const preselectedService = localStorage.getItem('kraken_preselected_service');
            if (preselectedService) {
                setActiveModal(preselectedService as ServiceType);
                if (data.postcode && data.postcode.length === 4) {
                    setActiveWizardStep(2);
                }
                localStorage.removeItem('kraken_preselected_service');
            }
        } catch (e) {
            console.error("Failed to parse persisted data", e);
        }
    } else {
        const preselectedService = localStorage.getItem('kraken_preselected_service');
        if (preselectedService) {
            setActiveModal(preselectedService as ServiceType);
            localStorage.removeItem('kraken_preselected_service');
        }
    }
  }, []);

  // Save to LocalStorage whenever fields change
  useEffect(() => {
    const dataToSave = {
        name: clientName,
        email,
        phonePrefix,
        phone,
        address,
        postcode,
        city,
        notes,
        accessMethod,
        date: selectedDate,
        time: selectedTime,
        terms: isTermsAgreed,
        marketing: isMarketingSubscribed,
        bookingMode
    };
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(dataToSave));
  }, [clientName, email, phonePrefix, phone, address, postcode, city, notes, selectedDate, selectedTime, isTermsAgreed, isMarketingSubscribed, bookingMode]);

  const lastScrollYRef = useRef(0);

  const closeActiveService = () => {
      setActiveModal(null);
      setEditingItemId(null);
      setTimeout(() => {
          const step2El = document.getElementById('step-2-services') || document.getElementById('wizard-container');
          if (step2El) {
              step2El.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (lastScrollYRef.current > 0) {
              window.scrollTo({ top: lastScrollYRef.current, behavior: 'smooth' });
          }
      }, 50);
  };

  const openServiceModal = (type: ServiceType) => {
      lastScrollYRef.current = window.scrollY;
      if (['car-detailing', 'gardening', 'exterior-cleaning', 'pest-control', 'waste-management', 'gutter-cleaning'].includes(type)) {
          setComingSoonModalService(type);
          return;
      }
      if (!address.trim() || postcode.trim().length !== 4) {
          setLocationNeeded(true);
          const target = document.getElementById('step-1-location');
          if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
      }
      setShowWindowInfo(false);
      setEditingItemId(null);
      const defaults: any = {
          'end-of-tenancy': { roomsCount: 2, bathroomsCount: 1, duration: 7, balconyCount: 0, storageCount: 0, carpetCount: 0, furnitureCount: 0, windowMenuOpen: false, windowConfig: { standard: 0, large: 0, hardReach: 0, external: false } },
          'deep-cleaning': { bedrooms: 2, bathrooms: 1, duration: 5.5, focus: [], balconyCount: 0, storageCount: 0, carpetCount: 0, furnitureCount: 0, frequency: 'One-Time', recurringDayPreference: '' },
          'daily-cleaning': { 
                frequency: 'Weekly', duration: 3, bedrooms: 2, bathrooms: 1, sameOperative: true, frequencyDetails: '', 
                ironing: false, ironingHours: 0.5, ironingNotes: '',
                laundry: false, laundryType: 'Wash & Dry', laundryItems: 0, laundryHours: 1, laundryNotes: '',
                oven: false, ovenGrease: 'Low', ovenNotes: '',
                cabinets: false, cabinetCondition: 'Empty', cabinetOrganize: false, cabinetNotes: '',
                fridge: false, fridgeCondition: 'Empty', fridgeOrganize: false, fridgeNotes: '',
                windowCount: 0 
          },
          'moving': { 
            moversCount: 2, 
            duration: 1, 
            fromZip: postcode || '', 
            fromAddress: address || '',
            toZip: '', 
            toAddress: '',
            accessFrom: 'Lift',
            floorFrom: '0',
            accessTo: 'Lift',
            floorTo: '0',
            hydraulicLift: false, 
            hydraulicLiftHours: 1, 
            isCommercial: false, 
            moveType: 'Home Contents', 
            serviceLevel: 'Standard', 
            description: '', 
            assembly: false, 
            assemblyHours: 1,
            packaging: false,
            cleaning: false,
            freeParking: true
          },
          'pest-control': { 
            pestCategory: 'Insects', 
            pestSubtype: 'Ants', 
            severity: 'recién visto', 
            propertyType: 'Apartment', 
            onset: 'Within this month', 
            affectedArea: 'Small room', 
            hasChildrenPets: false, 
            planType: 'Single Treatment', 
            urgency: 'Standard', 
            description: '' 
          },
          'waste-management': { 
            wasteType: 'Household', 
            items: { sofa: 1, mattress: 0, appliance: 0, boxes: 0 }, 
            accessStyle: 'Ground Floor', 
            stairsFloorCount: 0, 
            hasHazardous: false, 
            needsCertificate: false, 
            description: '' 
          },
          'gutter-cleaning': { 
            buildingHeight: '1 Story', 
            lengthCategory: 'Standard (<20m)', 
            condition: 'Ligero', 
            downspoutFlush: false, 
            gutterGuardInstall: false, 
            repairNeeded: false, 
            lastCleaning: '12 months', 
            description: '' 
          },
          'car-detailing': { 
            zipCode: postcode || '', 
            vehicles: [{ 
              id: Date.now().toString(), 
              category: 'M', 
              dirtLevel: 'Minimum', 
              coverage: 'Full', 
              hasPets: false, 
              hasScratches: false, 
              hasOdor: false, 
              hasUpholstery: false, 
              hasHeadlights: false, 
              ceramicYears: 'none', 
              locationType: 'Workshop' 
            }] 
          },
          'gardening': { 
            size: 'Medium', 
            condition: 'Cuidado', 
            frequency: 'Única', 
            features: { lawn: true, hedges: true, trees: false, flowerbeds: false, orchard: false, pavement: false }, 
            mowing: false, 
            lawnSqm: 50, 
            hedgeMeters: 0, 
            treePruningHours: 0, 
            lawnTreatment: false, 
            cleanup: false, 
            greenWaste: false, 
            greenWasteBags: 0, 
            accessMachine: true, 
            notes: '' 
          },
          'exterior-cleaning': { 
            surfaces: [{ 
              id: '1', 
              surfaceType: 'Driveway / Path', 
              material: 'Stone', 
              areaSqm: 30, 
              severity: 'Ligero', 
              moldSealing: false 
            }], 
            multiSurface: true, 
            stainRemoval: false, 
            noUtilityAccess: false, 
            notes: '' 
          }
      };
      setConfig(defaults[type]);
      setActiveModal(type);
  };

  const toggleServiceSelection = (type: ServiceType) => {
      const existing = cart.find(item => item.type === type);
      if (existing) {
          setCart(cart.filter(item => item.id !== existing.id));
      } else {
          const itemConfig = { ...SERVICE_DEFAULT_CONFIGS[type] };
          
          if (type === 'moving') {
              itemConfig.fromZip = postcode || '';
              itemConfig.fromAddress = address || '';
          }

          // Compute price, hours, and description
          let descParts: string[] = [];
          let price = 0;
          let hours = 0;
          const currentPostcode = postcode || '8200';
          const zone = detectZone(currentPostcode);

          switch (type) {
              case 'end-of-tenancy': {
                  price = calculateDetailedServicePrice('end-of-tenancy', itemConfig, zone, currentPostcode);
                  hours = itemConfig.duration || 0;
                  descParts.push(`${itemConfig.roomsCount} Rooms`, `${itemConfig.bathroomsCount} Baths`);
                  break;
              }
              case 'deep-cleaning': {
                  price = calculateDetailedServicePrice('deep-cleaning', itemConfig, zone, currentPostcode);
                  hours = itemConfig.duration || 0;
                  descParts.push(`${itemConfig.bedrooms} Bed`, `${itemConfig.bathrooms} Bath`);
                  break;
              }
              case 'daily-cleaning': {
                   price = calculateDetailedServicePrice('daily-cleaning', itemConfig, zone, currentPostcode);
                   hours = itemConfig.duration || 0;
                   descParts.push(`${itemConfig.frequency} Cleaning`, `${itemConfig.bedrooms} Bed`, `${itemConfig.bathrooms} Bath`);
                   break;
              }
              case 'moving': {
                  price = calculateDetailedServicePrice('moving', itemConfig, zone, currentPostcode);
                  hours = itemConfig.duration || 0;
                  descParts.push(`${itemConfig.moveType} Move`, `${itemConfig.moversCount} Movers`);
                  break;
              }
          }
          const finalDesc = descParts.length > 0 ? descParts.join(' | ') : 'Service Selected';
          setCart([...cart, { id: Date.now().toString(), type, details: itemConfig, price: price > 0 ? price : undefined, duration: hours, description: finalDesc }]);
      }
  };

  const handleEditItem = (item: CartItem) => {
      setEditingItemId(item.id);
      setConfig(item.details);
      setActiveModal(item.type);
  };

  const updateExtraConfig = (extraKey: string, extraVal: any) => {
      const updated = { ...config, [extraKey]: extraVal };
      let newDuration = config.duration;
      if (activeModal === 'end-of-tenancy') {
          const opts: EOTOptions = {
              rooms: updated.roomsCount || 0,
              bathrooms: updated.bathroomsCount || 0,
              balconies: updated.balconyCount || 0,
              storageUnits: updated.storageCount || 0,
              carpets: updated.carpetCount || 0,
              furniture: updated.furnitureCount || 0,
              ovenInterior: updated.ovenInterior,
              fridgeFreezer: updated.fridgeFreezer,
              windowsUnit: updated.windowsUnit,
              blindsShutters: updated.blindsShutters,
              extractorHood: updated.extractorHood,
              showerDescaling: updated.showerDescaling,
              cabinetInterior: updated.cabinetInterior,
              bedLinenLaundry: updated.bedLinenLaundry,
              ecoProducts: updated.ecoProducts,
              machineFloorSqm: updated.machineFloorSqm,
              trashBinCount: updated.trashBinCount
          };
          newDuration = calculateEOTDuration_v2(opts);
      } else if (activeModal === 'deep-cleaning') {
          const opts: CleaningOptions = {
              rooms: updated.bedrooms || 0,
              bathrooms: updated.bathrooms || 0,
              balconies: updated.balconyCount || 0,
              storageUnits: updated.storageCount || 0,
              carpets: updated.carpetCount || 0,
              furniture: updated.furnitureCount || 0,
              ovenInterior: updated.ovenInterior,
              fridgeFreezer: updated.fridgeFreezer,
              windowsUnit: updated.windowsUnit,
              blindsShutters: updated.blindsShutters,
              extractorHood: updated.extractorHood,
              showerDescaling: updated.showerDescaling,
              cabinetInterior: updated.cabinetInterior,
              bedLinenLaundry: updated.bedLinenLaundry,
              ecoProducts: updated.ecoProducts,
              machineFloorSqm: updated.machineFloorSqm,
              trashBinCount: updated.trashBinCount
          };
          newDuration = calculateCleaningDuration_v2("deep", opts);
      }
      setConfig({ ...updated, duration: newDuration });
  };

  useEffect(() => {
    // Mobile summary visibility is now always true as per user request
    setShowMobileSummaryBar(true);
  }, []);

  const roundToHalf = (num: number) => Math.ceil(num * 2) / 2;

  const calculateCleaningDuration = (type: string, bedrooms: number, bathrooms: number, balconies: number = 0, storage: number = 0, carpet: number = 0, furniture: number = 0, extraOpts: Partial<CleaningOptions> = {}) => {
      const opts: CleaningOptions = {
          rooms: bedrooms,
          bathrooms,
          balconies,
          storageUnits: storage,
          carpets: carpet,
          furniture,
          ...extraOpts
      };
      return calculateCleaningDuration_v2(type === 'regular-cleaning' || type === 'daily-cleaning' ? "regular" : "deep", opts);
  };

  const calculateEOTDuration = (rooms: number, bathrooms: number, balconies: number = 0, storage: number = 0, carpet: number = 0, furniture: number = 0, extraOpts: Partial<EOTOptions> = {}) => {
      if (rooms === 0 && bathrooms === 0) return 0;
      const opts: EOTOptions = {
          rooms,
          bathrooms,
          balconies,
          storageUnits: storage,
          carpets: carpet,
          furniture,
          ...extraOpts
      };
      return calculateEOTDuration_v2(opts);
  };

  const getFrequencyTranslations = (freq: string, lang: string) => {
      switch (freq) {
          case 'One-Time':
              return {
                  title: lang === 'es' ? 'Una sola vez' : lang === 'de' || lang === 'de-CH' ? 'Einmalig' : 'One-Time',
                  desc: lang === 'es' ? 'Limpieza profunda puntual' : lang === 'de' || lang === 'de-CH' ? 'Einmalige Tiefenreinigung' : 'One-time custom deep cleaning'
              };
          case 'Every 3 Months':
              return {
                  title: lang === 'es' ? 'Cada 3 meses' : lang === 'de' || lang === 'de-CH' ? 'Alle 3 Monate' : 'Every 3 Months',
                  desc: lang === 'es' ? 'Plan óptimo por cambio de estación' : lang === 'de' || lang === 'de-CH' ? 'Saisonale Auffrischung' : 'Seasonal refreshment recommendation'
              };
          case 'Every 4 Months':
              return {
                  title: lang === 'es' ? 'Cada 4 meses' : lang === 'de' || lang === 'de-CH' ? 'Alle 4 Monate' : 'Every 4 Months',
                  desc: lang === 'es' ? 'Tres visitas recomendadas al año' : lang === 'de' || lang === 'de-CH' ? 'Dreimal jährlich' : 'Three comprehensive visits per year'
              };
          case 'Every 6 Months':
              return {
                  title: lang === 'es' ? 'Cada 6 meses' : lang === 'de' || lang === 'de-CH' ? 'Alle 6 Monate' : 'Every 6 Months',
                  desc: lang === 'es' ? 'Excelente mantenimiento semestral' : lang === 'de' || lang === 'de-CH' ? 'Halbjährliche Pflege' : 'Semiannual restoration visits'
              };
          case 'Every Year':
              return {
                  title: lang === 'es' ? 'Cada año' : lang === 'de' || lang === 'de-CH' ? 'Jährlich' : 'Every Year',
                  desc: lang === 'es' ? 'Limpieza general anual profunda' : lang === 'de' || lang === 'de-CH' ? 'Jährlicher Frühjahrsputz' : 'Annual spring-cleaning overhaul'
              };
          default:
              return {
                  title: freq,
                  desc: ''
              };
      }
  };

  const calculateDetailedServicePrice = (type: string, details: any, zone: ZoneInfo, fallbackPostal: string): number => {
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

  const getEstimatedPrice = () => {
      if (!activeModal) return 0;
      
      const activePostal = config.zipCode || config.fromZip || postcode || '8200';
      const zone = detectZone(activePostal);

      switch (activeModal) {
          case 'end-of-tenancy': {
              const opts: EOTOptions = {
                  rooms: config.roomsCount || 0,
                  bathrooms: config.bathroomsCount || 0,
                  balconies: config.balconyCount || 0,
                  storageUnits: config.storageCount || 0,
                  carpets: config.carpetCount || 0,
                  furniture: config.furnitureCount || 0,
                  ovenInterior: config.ovenInterior,
                  fridgeFreezer: config.fridgeFreezer,
                  windowsUnit: config.windowsUnit,
                  blindsShutters: config.blindsShutters,
                  extractorHood: config.extractorHood,
                  showerDescaling: config.showerDescaling,
                  cabinetInterior: config.cabinetInterior,
                  bedLinenLaundry: config.bedLinenLaundry,
                  ecoProducts: config.ecoProducts,
                  machineFloorSqm: config.machineFloorSqm,
                  trashBinCount: config.trashBinCount,
                  customDuration: config.duration
              };
              return getEOTPrice(opts, zone);
          }
          case 'deep-cleaning': {
              const opts: CleaningOptions = {
                  rooms: config.bedrooms || 0,
                  bathrooms: config.bathrooms || 0,
                  balconies: config.balconyCount || 0,
                  storageUnits: config.storageCount || 0,
                  carpets: config.carpetCount || 0,
                  furniture: config.furnitureCount || 0,
                  ovenInterior: config.ovenInterior,
                  fridgeFreezer: config.fridgeFreezer,
                  windowsUnit: config.windowsUnit,
                  blindsShutters: config.blindsShutters,
                  extractorHood: config.extractorHood,
                  showerDescaling: config.showerDescaling,
                  cabinetInterior: config.cabinetInterior,
                  bedLinenLaundry: config.bedLinenLaundry,
                  ecoProducts: config.ecoProducts,
                  machineFloorSqm: config.machineFloorSqm,
                  trashBinCount: config.trashBinCount
              };
              return getDeepCleaningPrice(opts, zone);
          }
          case 'daily-cleaning': {
              const opts: RegularCleaningOptions = {
                  rooms: config.bedrooms || 0,
                  bathrooms: config.bathrooms || 0,
                  ironingHours: config.ironing ? (config.ironingHours || 0) : 0,
                  laundryHours: config.laundry ? (config.laundryHours || 0) : 0,
                  ovenLevel: config.oven ? (config.ovenGrease === 'Low' ? 'low' : config.ovenGrease === 'Medium' ? 'medium' : 'high') as "low"|"medium"|"high" : undefined,
                  cabinetCount: config.cabinets ? 1 : 0,
                  cabinetOrganize: config.cabinets ? config.cabinetOrganize : undefined,
                  fridgeClean: config.fridge,
                  fridgeOrganize: config.fridge ? config.fridgeOrganize : undefined,
                  windowCount: config.windowCount || 0,
                  customDuration: config.duration
              };
              return getRegularCleaningPrice(opts, zone);
          }
          case 'moving': {
              const opts: MovingOptions = {
                  level: (config.serviceLevel === 'Standard' ? 'standard' : config.serviceLevel === 'Large' ? 'large' : 'commercial') as MovingLevel,
                  hours: config.duration || 3,
                  helpers: config.moversCount || 0,
                  withAssembly: config.assembly,
                  assemblyHours: config.assemblyHours || 0,
                  withHydraulicLift: config.hydraulicLift,
                  liftHours: config.hydraulicLiftHours || 0,
                  originPostal: config.fromZip || '',
                  destinationPostal: config.toZip || '',
                  withPackaging: config.packaging,
                  floorFrom: config.floorFrom || '0',
                  accessFrom: config.accessFrom || 'Lift',
                  floorTo: config.floorTo || '0',
                  accessTo: config.accessTo || 'Lift',
                  freeParking: config.freeParking !== false
              };
              return getMovingPrice(opts);
          }
          case 'car-detailing':
          case 'gardening':
          case 'exterior-cleaning':
          case 'gutter-cleaning':
          case 'waste-management': {
              return calculateDetailedServicePrice(activeModal, config, zone, activePostal);
          }
          default: return 0;
      }
  };

  const getActiveTotalHours = () => {
      if (!activeModal) return 0;
      switch (activeModal) {
          case 'end-of-tenancy': return config.duration || 0;
          case 'deep-cleaning': return config.duration || 0;
          case 'daily-cleaning': {
              let d = config.duration || 0;
              if (config.ironing) d += config.ironingHours;
              if (config.laundry) d += config.laundryHours;
              if (config.oven) d += (config.ovenGrease === 'Low' ? 0.5 : config.ovenGrease === 'Medium' ? 0.65 : 0.85);
              if (config.cabinets) d += (config.cabinetOrganize ? 1.0 : 0.5);
              if (config.fridge) d += (config.fridgeOrganize ? 1.0 : 0.5);
              if (config.windowCount > 0) d += (config.windowCount * 0.05);
              return d;
          }
          case 'moving': return (config.duration || 0) + (config.assembly ? config.assemblyHours : 0);
          default: return 0;
      }
  };

  const formatTotalHours = (hours: number) => {
      if (hours <= 0) return '';
      if (Number.isInteger(hours)) return `${hours}h`;
      const h = Math.floor(hours), m = Math.round((hours - h) * 60);
      if (h === 0) return `${m}m`;
      if (m === 0) return `${h}h`;
      return `${h}h ${m}m`;
  };

  const handleAddToCart = () => {
      const price = getEstimatedPrice();
      const hours = getActiveTotalHours();
      let descParts: string[] = [];

      switch (activeModal) {
          case 'end-of-tenancy': {
              if (config.roomsCount > 0) descParts.push(`${config.roomsCount} Rooms`);
              if (config.bathroomsCount > 0) descParts.push(`${config.bathroomsCount} Baths`);
              if (config.balconyCount > 0) descParts.push(`Balcony (${config.balconyCount})`);
              if (config.storageCount > 0) descParts.push(`Storage (${config.storageCount})`);
              if (config.carpetCount > 0) descParts.push(`Carpet (${config.carpetCount})`);
              if (config.furnitureCount > 0) descParts.push(`Upholstery (${config.furnitureCount})`);
              break;
          }
          case 'deep-cleaning': {
              if (config.bedrooms > 0) descParts.push(`${config.bedrooms} Bed`);
              if (config.bathrooms > 0) descParts.push(`${config.bathrooms} Bath`);
              if (config.frequency) descParts.push(config.frequency);
              if (config.frequency !== 'One-Time' && config.recurringDayPreference) {
                  descParts.push(`Day: ${config.recurringDayPreference}`);
              }
              if (config.balconyCount > 0) descParts.push(`Balcony (${config.balconyCount})`);
              if (config.storageCount > 0) descParts.push(`Storage (${config.storageCount})`);
              if (config.carpetCount > 0) descParts.push(`Carpet (${config.carpetCount})`);
              if (config.furnitureCount > 0) descParts.push(`Upholstery (${config.furnitureCount})`);
              break;
          }
          case 'daily-cleaning': {
              descParts.push(`${config.frequency} Cleaning`);
              if (config.frequencyDetails) descParts.push(`Day: ${config.frequencyDetails}`);
              if (config.bedrooms > 0) descParts.push(`${config.bedrooms} Bed`);
              if (config.bathrooms > 0) descParts.push(`${config.bathrooms} Bath`);
              if (config.ironing) descParts.push('Ironing');
              if (config.laundry) descParts.push('Laundry');
              if (config.oven) descParts.push('Oven');
              if (config.cabinets) descParts.push('Cabinets');
              if (config.fridge) descParts.push('Fridge');
              if (config.windowCount > 0) descParts.push(`${config.windowCount} Windows`);
              break;
          }
          case 'moving': {
              const isFromValid = config.fromZip && (config.fromZip.startsWith('80') || config.fromZip.startsWith('81') || config.fromZip.startsWith('82') || config.fromZip.startsWith('83') || config.fromZip.startsWith('84') || config.fromZip.startsWith('86'));
              const isToValid = config.toZip && (config.toZip.startsWith('80') || config.toZip.startsWith('81') || config.toZip.startsWith('82') || config.toZip.startsWith('83') || config.toZip.startsWith('84') || config.toZip.startsWith('86'));
              if (!isFromValid || !isToValid) {
                  alert(t('consultation.alert.regions'));
                  return;
              }

              descParts.push(`${config.moveType} Move`);
              descParts.push(`${config.moversCount} Movers`);
              descParts.push(config.serviceLevel);
              if (config.assembly) descParts.push(`Assembly (${config.assemblyHours}h)`);
              if (config.accessFrom === 'Stairs' || config.accessTo === 'Stairs') descParts.push('Stairs Handled');
              if (config.floorFrom !== '0') descParts.push(`From Floor: ${config.floorFrom}`);
              if (config.floorTo !== '0') descParts.push(`To Floor: ${config.floorTo}`);
              if (config.hydraulicLift) descParts.push(`Hydraulic Lift (${config.hydraulicLiftHours}h)`);
              if (config.description) {
                  const snippet = config.description.length > 25 ? config.description.substring(0, 22) + '...' : config.description;
                  descParts.push(`Items: ${snippet}`);
              }
              break;
          }
          case 'car-detailing': {
              const count = config.vehicles ? config.vehicles.length : 1;
              descParts.push(`${count} Vehicle${count > 1 ? 's' : ''}`);
              if (config.vehicles && config.vehicles[0]) {
                  descParts.push(`Cat ${config.vehicles[0].category}`);
                  descParts.push(`${config.vehicles[0].coverage} Clean`);
              }
              break;
          }
          case 'gardening': {
              descParts.push(`Gardening (${config.size || 'Medium'})`);
              descParts.push(`Condition: ${config.condition}`);
              if (config.mowing) descParts.push('Lawn Mowed');
              if (config.hedgeMeters > 0) descParts.push(`Hedges ${config.hedgeMeters}m`);
              break;
          }
          case 'exterior-cleaning': {
              const area = config.surfaces ? config.surfaces.reduce((acc: number, s: any) => acc + (parseFloat(s.areaSqm) || 0), 0) : config.approxSize || 0;
              descParts.push(`Exterior Wash (${area}m²)`);
              if (config.surfaces && config.surfaces.length > 0) {
                  descParts.push(`${config.surfaces.length} surface${config.surfaces.length > 1 ? 's' : ''}`);
              } else {
                  descParts.push(config.surface || 'Driveway / Path');
              }
              break;
          }
          case 'gutter-cleaning': {
              descParts.push(`Gutter: ${config.buildingHeight}`);
              descParts.push(`${config.lengthCategory}`);
              if (config.downspoutFlush) descParts.push('With Flush');
              break;
          }
          case 'pest-control': {
              descParts.push(`Pest Control: ${config.pestCategory} (${config.pestSubtype})`);
              descParts.push(config.urgency);
              break;
          }
          case 'waste-management': {
              descParts.push('Waste Removal');
              descParts.push(config.wasteType || 'Household');
              break;
          }
          default: descParts.push(`${activeModal} Request`);
      }

      const finalDesc = descParts.length > 0 ? descParts.join(' | ') : 'Service Selected';

      if (editingItemId) {
          setCart(cart.map(item => item.id === editingItemId ? { ...item, details: config, price: price > 0 ? price : undefined, duration: hours, description: finalDesc } : item));
      } else {
          setCart([...cart, { id: Date.now().toString(), type: activeModal!, details: config, price: price > 0 ? price : undefined, duration: hours, description: finalDesc }]);
      }
      closeActiveService();
  };

  const handleRemoveItem = (id: string) => setCart(cart.filter(item => item.id !== id));
  
  const mainServices = ['end-of-tenancy', 'deep-cleaning', 'daily-cleaning', 'moving'];
  const additionalServicesList = ['car-detailing', 'gardening', 'exterior-cleaning', 'pest-control', 'waste-management', 'gutter-cleaning'];

  // Recalculate each cart item price based on the current checkout postal code
  const currentPostcode = postcode || '8200';
  const checkoutZone = detectZone(currentPostcode);

  const revaluedCart = cart.map(item => {
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

  const mainCount = revaluedCart.filter(item => mainServices.includes(item.type)).length;
  const addCount = revaluedCart.filter(item => additionalServicesList.includes(item.type)).length;
  const comicCount = revaluedCart.filter(item => item.type === 'comic-book').length;

  let travelFee = 0;
  let travelMsg = '';
  let travelMsgColor = 'text-gray-400';

  if (revaluedCart.length > 0) {
      if (onlyComics) {
          travelFee = comicCount * 4.99;
          travelMsg = language === 'es' ? 'Envío por correo postal' : 'Postal Shipping';
          travelMsgColor = 'text-blue-500';
      } else if (mainCount >= 2 || (mainCount === 1 && addCount >= 2)) {
          travelFee = PRICES.travelMulti;
          travelMsg = 'FREE Transport! Premium Client';
          travelMsgColor = 'text-green-500';
      } else if ((mainCount === 1 && addCount === 1) || addCount >= 2) {
          travelFee = PRICES.travelOneMainPlusOne;
          travelMsg = 'Offer Applied!';
          travelMsgColor = 'text-blue-500';
      } else {
          travelFee = PRICES.travelSingle;
          travelMsg = '';
      }
  }

  const servicesSubtotal = revaluedCart.reduce((acc, item) => acc + (item.price || 0), 0);
  const grandTotal = servicesSubtotal + travelFee;
  const totalDuration = revaluedCart.reduce((acc, item) => acc + (item.duration || 0), 0);

  const handleDirectPDFExport = () => {
      generateQuotePDF({
          cart: revaluedCart,
          grandTotal,
          travelFee,
          name: clientName || '',
          email: email || '',
          phone: phone ? `${phonePrefix} ${phone}` : '',
          address: address || '',
          postcode: postcode || '',
          city: city || '',
          bookingMode: bookingMode === 'direct' ? 'direct' : 'precision',
          selectedDate: selectedDate,
          selectedTime: selectedTime,
          language: language
      });
  };

  const handleSuccessPDFExport = () => {
      if (!submittedRequestData) return;
      generateQuotePDF({
          cart: revaluedCart,
          grandTotal: submittedRequestData.depositAmount + submittedRequestData.remainingBalance || grandTotal,
          travelFee: travelFee,
          name: submittedRequestData.clientName || clientName || '',
          email: submittedRequestData.email || email || '',
          phone: submittedRequestData.phone || (phone ? `${phonePrefix} ${phone}` : ''),
          address: submittedRequestData.address || address || '',
          postcode: submittedRequestData.postcode || postcode || '',
          city: submittedRequestData.city || city || '',
          bookingMode: submittedRequestData.bookingMode || (bookingMode === 'direct' ? 'direct' : 'precision'),
          bookingId: submittedRequestData.formattedId || submittedRequestData.id,
          selectedDate: submittedRequestData.date || selectedDate,
          selectedTime: submittedRequestData.time || selectedTime,
          language: language
      });
  };

  // Deposit Logic - Option A is 15% of grand total, Option B is fixed 15.00
  const calculateDeposit = () => {
    if (onlyComics) return grandTotal; // Comic-only orders require 100% full payment (no deposit/fee split)
    if (!bookingMode) return 0;
    if (bookingMode === 'direct') return grandTotal * 0.15;
    if (bookingMode === 'validate') return 15.00;
    return 0;
  };

  const calculateEndTime = (start: string, duration: number) => {
      if (!start) return '';
      const [h, m] = start.split(':').map(Number);
      const totalMinutes = h * 60 + m + (duration * 60);
      return `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0')}:${String(Math.round(totalMinutes % 60)).padStart(2, '0')}`;
  };

  const handleFileRemoval = (index: number) => {
      const removedFile = files[index];
      setFiles(prev => prev.filter((_, i) => i !== index));
      if (removedFile) {
          setUploadStates(prev => prev.filter(item => item.name !== removedFile.name));
      }
  };

  const handleUploadFile = async (selectedFiles: File[]) => {
      const totalSize = [...files, ...selectedFiles].reduce((acc, f) => acc + f.size, 0);
      if (totalSize > MAX_FILE_SIZE) {
          alert(t('consultation.alert.fileLimit'));
          return;
      }

      // If user is not authenticated, sign them in anonymously so they can upload files securely
      if (!auth.currentUser) {
          try {
              const { signInAnonymously } = await import('firebase/auth');
              await signInAnonymously(auth);
              console.log("Guest authenticated anonymously for storage access, uid =", auth.currentUser?.uid);
              setAnonAuthError(null);
          } catch (err: any) {
              console.error("Failed to sign in anonymously. Guest upload might fail if storage rules require auth:", err);
              if (err.code === 'auth/admin-restricted-operation' || err.message?.includes('admin-restricted-operation')) {
                  setAnonAuthError('admin-restricted-operation');
              } else {
                  setAnonAuthError(err.message || String(err));
              }
          }
      }

      setFiles(prev => [...prev, ...selectedFiles]);

      selectedFiles.forEach((file) => {
          const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          const cleanName = clientName.trim() ? clientName.replace(/[^a-zA-Z0-9]/g, '_') : 'client_quote';
          
          const newStateItem = {
              id: uniqueId,
              name: file.name,
              progress: 0,
              status: 'uploading' as const
          };

          setUploadStates(prev => [...prev, newStateItem]);

          const storageRef = ref(storage, `quotes_media/${cleanName}/${uniqueId}_${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on('state_changed', 
              (snapshot) => {
                  const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                  setUploadStates(prev => prev.map(item => 
                      item.name === file.name ? { ...item, progress, status: 'uploading' } : item
                  ));
              }, 
              (error: any) => {
                  console.error("Firebase Storage upload error:", error);
                  let friendlyError = error.message;
                  if (error.code === 'storage/unauthorized' || error.message?.includes('unauthorized') || error.message?.includes('permission-denied')) {
                      friendlyError = "The upload was blocked by security rules. Non-registered guests require Anonymous Auth to be enabled in Firebase.";
                      setAnonAuthError('admin-restricted-operation');
                  }
                  setUploadStates(prev => prev.map(item => 
                      item.name === file.name ? { ...item, status: 'error', error: friendlyError } : item
                  ));
              }, 
              async () => {
                  try {
                      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                      setUploadStates(prev => prev.map(item => 
                          item.name === file.name ? { ...item, status: 'success', url: downloadURL, progress: 100 } : item
                      ));
                  } catch (e: any) {
                      console.error("Error getting download url:", e);
                      setUploadStates(prev => prev.map(item => 
                          item.name === file.name ? { ...item, status: 'error', error: e.message } : item
                      ));
                  }
              }
          );
      });
  };

  // Handle Payment Return
  useEffect(() => {
    const processReturn = async () => {
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment');
        
        if (paymentStatus === 'success' || paymentStatus === 'invoice') {
            const savedBooking = localStorage.getItem('pending_booking');
            if (savedBooking) {
                try {
                    const booking = JSON.parse(savedBooking);
                    // Prevent duplicate processing if page is refreshed
                    localStorage.removeItem('pending_booking');
                    
                    setPaymentCompletedBooking(booking);
                    setCart([]);
                    
                    console.log(`Processing ${paymentStatus} payment for:`, booking.clientName);
                    const isInvoice = paymentStatus === 'invoice';

                    // Firestore document update
                    const docId = booking.id;
                    if (docId) {
                        try {
                            const updatedPayment = {
                                method: booking.payment?.method || (isInvoice ? 'bank_transfer' : 'card'),
                                gateway: booking.payment?.gateway || (isInvoice ? 'manual' : 'payrexx'),
                                last4: '',
                                brand: '',
                                cardholderName: booking.clientName || '',
                                expiryMonth: '',
                                expiryYear: '',
                                transactionId: isInvoice ? 'invoice_bank_transfer' : 'paid_via_gateway',
                                amountCharged: booking.depositAmount || 0,
                                currency: 'CHF',
                                status: isInvoice ? 'pending' : 'captured',
                                billingPostal: booking.address?.split(',').pop()?.trim()?.split(' ')?.[0] || ''
                            };

                            const updatedTimestamps = {
                                formSubmittedAt: booking.timestamps?.formSubmittedAt || new Date().toISOString(),
                                priceCalculatedAt: booking.timestamps?.priceCalculatedAt || new Date().toISOString(),
                                depositCapturedAt: isInvoice ? null : new Date().toISOString(),
                                lastUpdatedAt: new Date().toISOString(),
                                requestedServiceDate: booking.date || '',
                                requestedServiceTime: booking.time || 'flexible'
                            };

                            await updateDoc(doc(db, 'maintenance_requests', docId), {
                                status: isInvoice ? 'Pending' : 'In Progress',
                                payment: updatedPayment,
                                timestamps: updatedTimestamps,
                                updatedAt: serverTimestamp()
                            });
                            console.log("Successfully updated Firestore payment status for doc:", docId);
                        } catch (updateError) {
                            console.error("Failed to update Firestore request status on return:", updateError);
                        }
                    }
                    
                    // 1. Send Webhook
                    const hookData = new FormData();
                    hookData.append('clientName', booking.clientName);
                    hookData.append('email', booking.email);
                    hookData.append('phone', booking.phone);
                    hookData.append('address', booking.address);
                    hookData.append('notes', booking.notes);
                    hookData.append('date', booking.date);
                    hookData.append('time', booking.time);
                    hookData.append('totalPrice', booking.totalPrice.toFixed(2));
                    hookData.append('bookingMode', booking.bookingMode);
                    hookData.append('services', JSON.stringify(booking.services));
                    hookData.append('transactionId', isInvoice ? 'invoice_bank_transfer' : 'paid_via_gateway');
                    hookData.append('payment_status', isInvoice ? 'PENDING' : 'PAID');
                    
                    let computedDepositAmt: number;
                    if (typeof booking.depositAmount === 'number') {
                        computedDepositAmt = booking.depositAmount;
                    } else if (booking.depositAmount && !isNaN(Number(booking.depositAmount))) {
                        computedDepositAmt = Number(booking.depositAmount);
                    } else {
                        const totalVal = Number(booking.totalPrice) || 0;
                        const isDirect = String(booking.bookingMode).toLowerCase() === 'direct';
                        computedDepositAmt = isDirect ? (totalVal * 0.15) : 15;
                    }
                    const computedRemainingAmt = Math.max(0, (Number(booking.totalPrice) || 0) - computedDepositAmt);
                    const preferredLanguage = localStorage.getItem('kraken_preferred_lang') || 'en';
                    const photoUrlsStr = JSON.stringify(booking.photoUrls || booking.files || []);
                    const pdfUrlStr = booking.pdfUrl || '';

                    hookData.append('deposit_amount', computedDepositAmt.toFixed(2));
                    hookData.append('remaining_amount', computedRemainingAmt.toFixed(2));
                    hookData.append('language', preferredLanguage);
                    hookData.append('photo_urls', photoUrlsStr);
                    hookData.append('pdf_url', pdfUrlStr);

                    // Build Email HTML & Subject in German
                    const clientNameVal = booking.clientName || 'Kunde';
                    const isPrecisionMode = String(booking.bookingMode).toLowerCase() === 'precision';
                    const totalPriceFormatted = (Number(booking.totalPrice) || 0).toFixed(2);
                    const depositAmtFormatted = computedDepositAmt.toFixed(2);
                    const remainingAmtFormatted = computedRemainingAmt.toFixed(2);
                    const transactionIdVal = isInvoice ? 'invoice_bank_transfer' : 'paid_via_gateway';
                    const dateVal = booking.date || '';
                    const timeVal = booking.time || '';
                    const servicesFormatted = Array.isArray(booking.services)
                        ? booking.services.map((s: any) => typeof s === 'string' ? s : (s.type ? s.type.replace(/-/g, ' ').toUpperCase() : (s.title || s.name || ''))).filter(Boolean).join(', ')
                        : String(booking.services || '');

                    const emailSubject = isPrecisionMode
                        ? 'Kraken - Wir haben Ihre Anfrage erhalten'
                        : 'Kraken - Ihre Buchung ist bestätigt';

                    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #eef3f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #eef3f8; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td align="center" style="background-color: #ffffff; padding: 24px 20px; border-bottom: 1px solid #e2e8f0;">
              <img src="https://dl.dropboxusercontent.com/scl/fi/9xl037889qyoi5zl81kpq/logo-kraken-azul.webp?rlkey=trx6j4riif60qng86jrf2k3hv" alt="Kraken Logo" width="180" style="display: block; width: 180px; max-width: 180px; height: auto; border: 0;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0;">
              <img src="https://dl.dropboxusercontent.com/scl/fi/4c6e3bo9e8osy0ztv8esp/ChatGPT-Image-Jul-19-2026-04_10_10-AM.png?rlkey=x6uepdaucmg9tmqdvxhk7uzis" alt="Kraken Banner" width="600" style="display: block; width: 100%; max-width: 600px; height: auto; border: 0;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="margin: 0 0 16px 0; color: #0a2472; font-size: 20px; font-weight: 700;">Hallo ${clientNameVal},</h2>
              ${isPrecisionMode ? `
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Wir haben Ihre Gebühr von CHF 15 erhalten. Wir erstellen nun Ihr genaues Angebot nach der Auswertung Ihrer Anfrage.
              </p>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #92400e; font-weight: 600;">
                  Wichtige Information: Die CHF 15 sind nicht erstattungsfähig, werden jedoch zu 100% abgezogen, wenn Sie das Angebot annehmen.
                </p>
              </div>
              ` : `
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Ihr Termin ist reserviert und bestätigt. Vielen Dank für Ihre Anzahlung.
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px; border-collapse: separate; overflow: hidden;">
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #475569;">Gesamtbetrag</td>
                  <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #0f172a;">CHF ${totalPriceFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #475569;">Anzahlung 15% bezahlt</td>
                  <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #16a34a;">CHF ${depositAmtFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #475569;">Restbetrag <span style="font-size: 12px; font-weight: normal; color: #64748b;">(fällig nach der Arbeit)</span></td>
                  <td align="right" style="padding: 12px 16px; font-size: 14px; font-weight: 700; color: #0a2472;">CHF ${remainingAmtFormatted}</td>
                </tr>
              </table>
              <p style="margin: -12px 0 24px 0; font-size: 13px; color: #64748b; font-style: italic;">
                Zusätzliche Stunden: CHF 90 pro Stunde.
              </p>
              `}
              <h3 style="margin: 0 0 12px 0; color: #0a2472; font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Details Ihrer Anfrage</h3>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b; width: 140px; vertical-align: top; font-weight: 600;">Dienstleistung:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 500;">${servicesFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b; vertical-align: top; font-weight: 600;">Datum & Uhrzeit:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 500;">${dateVal} ${timeVal}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b; vertical-align: top; font-weight: 600;">Referenz:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 500;">${transactionIdVal}</td>
                </tr>
              </table>
              ${pdfUrlStr ? `
              <div style="text-align: center; margin: 28px 0 12px 0;">
                <a href="${pdfUrlStr}" target="_blank" style="background-color: #0a2472; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-block;">
                  PDF herunterladen
                </a>
              </div>
              ` : ''}
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color: #0a2472; padding: 24px 20px; color: #ffffff; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #ffffff;">
                Kraken Properties und Facilities Management
              </p>
              <p style="margin: 0; font-size: 13px; color: #cbd5e1;">
                <a href="mailto:kai@krakenpfm.ch" style="color: #ffffff; text-decoration: underline;">kai@krakenpfm.ch</a> . <a href="https://krakenpfm.ch" target="_blank" style="color: #ffffff; text-decoration: underline;">krakenpfm.ch</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

                    hookData.append('email_html', emailHtml);
                    hookData.append('email_subject', emailSubject);
                    
                    fetch(MAKE_WEBHOOK_URL, { method: 'POST', body: hookData }).catch(e => console.warn("Webhook failed", e));

                    // 2. Send Email Notification
                    const serviceList = booking.services.map((i: any) => i.type.replace(/-/g, ' ').toUpperCase()).join(', ');
                    const concept = booking.bookingMode === 'direct' ? 'Express Booking Deposit (15%)' : 'Precision Media Quote';

                    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                        from_name: booking.clientName,
                        service_address: booking.address,
                        amount_to_pay: isInvoice ? "CHF " + booking.totalPrice.toFixed(2) + " (Invoiced / Bank Transfer)" : booking.depositAmount.toFixed(2) + " CHF",
                        service_type: concept + (isInvoice ? " - Bank Transfer / Factura" : ""),
                        from_email: booking.email,
                        phone_number: booking.phone,
                        total_price: `CHF ${booking.totalPrice.toFixed(2)}`,
                        preferred_date: booking.date,
                        preferred_time: booking.time,
                        payment_status: isInvoice ? 'PENDING_INVOICE' : 'PAID',
                        transaction_id: isInvoice ? 'INVOICE_BANK_TRANSFER' : 'GATEWAY_PAYMENT',
                        services_list: serviceList
                    }, PUBLIC_KEY)
                    .then(() => {
                        if (isInvoice) {
                            alert(t('consultation.alert.invoiceSuccess'));
                        } else {
                            alert(t('consultation.alert.paymentSuccess'));
                        }
                        // Clean URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                    })
                    .catch((error) => {
                        console.error("EmailJS Error after payment:", error);
                        alert(t('consultation.alert.emailError'));
                        window.history.replaceState({}, document.title, window.location.pathname);
                    });
                } catch (e) {
                    console.error("Failed to process pending booking", e);
                }
            }
        } else if (paymentStatus === 'failed' || paymentStatus === 'cancel') {
            alert(t('consultation.alert.paymentFailed'));
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    };
    processReturn();
  }, []);

  useEffect(() => {
    // Expose the function globally for debugging or external calls if needed
    (window as any).ejecutarReservaYpago = ejecutarReservaYpago;
  }, [clientName, email, phone, address, postcode, city, notes, accessMethod, selectedDate, selectedTime, bookingMode, isTermsAgreed, cart, files, isSubmitting]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredMsg = t('consultation.form.error.required');

    if (!clientName.trim()) newErrors.clientName = requiredMsg;
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = requiredMsg;
    if (!phone.trim()) newErrors.phone = requiredMsg;
    if (!address.trim()) newErrors.address = requiredMsg;
    if (!postcode.trim()) newErrors.postcode = requiredMsg;
    if (!city.trim()) newErrors.city = requiredMsg;
    if (!selectedDate) newErrors.selectedDate = requiredMsg;
    if (!selectedTime) newErrors.selectedTime = requiredMsg;
    if (!bookingMode) newErrors.bookingMode = requiredMsg;
    if (!isTermsAgreed) newErrors.terms = requiredMsg;

    if (cart.length === 0) {
        alert(t('consultation.alert.selectService'));
        return false;
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
        console.warn("Validation failed:", newErrors);
    }
    return isValid;
  };

  const ejecutarReservaYpago = async (e?: React.BaseSyntheticEvent) => {
    if (e) e.preventDefault();
    
    console.log("ejecutarReservaYpago triggered - Server-Side Gateway API");

    try {
        const validationResult = validateForm();
        if (!validationResult) {
            console.warn("Validation failed");
            const firstError = document.querySelector('.shake');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert(t('consultation.alert.fillRequired'));
            }
            return;
        }

        setIsSubmitting(true);
        const amount = calculateDeposit();
        const mode = bookingMode!;
        const concept = onlyComics 
          ? (language === 'es' ? 'Pago Completo de Cómics (100%)' : 'Full Payment - Comic Order (100%)')
          : (mode === 'direct' ? 'Express Booking Deposit (15%)' : 'Precision Media Quote');
        
        const fullPhone = `${phonePrefix} ${phone}`;
        const fullAddress = `${address}, ${postcode} ${city}`;
        const timeWindow = `${selectedTime} - ${calculateEndTime(selectedTime, totalDuration)}`;
        const serviceList = revaluedCart.map(i => i.type.replace(/-/g, ' ').toUpperCase()).join(', ');
        const dynamicDescription = `Kraken Properties - ${clientName} | Services: ${serviceList}`;

        const successfulMedia = uploadStates.filter(s => s.status === 'success' && s.url);
        const mediaUrls = successfulMedia.map(s => s.url as string);
        const mediaNames = successfulMedia.map(s => s.name);
        
        let appendedNotes = notes;
        if (mediaUrls.length > 0) {
            appendedNotes += "\n\n[Uploaded Media Files]:\n" + mediaUrls.map((url, i) => `- ${mediaNames[i]}: ${url}`).join('\n');
        }

        // Ensure guest is authenticated anonymously before writing to Firestore / checkout
        if (!auth.currentUser) {
            try {
                const { signInAnonymously } = await import('firebase/auth');
                await signInAnonymously(auth);
                console.log("Guest authenticated anonymously prior to checkout, uid =", auth.currentUser?.uid);
            } catch (err) {
                console.warn("Could not sign in anonymously before checkout:", err);
            }
        }

        const newDocId = draftDocId || doc(collection(db, 'maintenance_requests')).id;

        const mediaAttachments = uploadStates
            .filter(s => s.status === 'success' && s.url)
            .map(s => {
                const matchingFile = files.find(f => f.name === s.name);
                return {
                    filename: s.name,
                    mimeType: matchingFile?.type || 'application/octet-stream',
                    sizeBytes: matchingFile?.size || 0,
                    uploadedAt: new Date().toISOString(),
                    url: s.url as string
                };
            });

        const timestamps = {
            formSubmittedAt: new Date().toISOString(),
            priceCalculatedAt: new Date().toISOString(),
            depositCapturedAt: null as string | null,
            lastUpdatedAt: new Date().toISOString(),
            requestedServiceDate: selectedDate || new Date().toISOString().split('T')[0],
            requestedServiceTime: selectedTime || 'flexible'
        };

        const scheduling = {
            requestedDate: selectedDate || new Date().toISOString().split('T')[0],
            preferredTimeWindow: selectedTime ? ('specific' as const) : ('flexible' as const),
            specificTime: selectedTime || null,
            estimatedDurationHours: totalDuration || 0,
            estimatedEndTime: calculateEndTime(selectedTime, totalDuration) || null
        };

        const payment = {
            method: 'card' as const,
            gateway: 'payrexx' as const,
            last4: '',
            brand: '',
            cardholderName: clientName.trim() || 'Client',
            expiryMonth: '',
            expiryYear: '',
            transactionId: '',
            amountCharged: amount,
            currency: 'CHF',
            status: 'pending' as const,
            billingPostal: postcode || ''
        };

        const currentUid = auth.currentUser?.uid;
        if (currentUid) {
            try {
                console.log("Saving booking to Firestore with rich fields...");
                const requestRef = doc(db, 'maintenance_requests', newDocId);
                
                const payload = {
                    id: newDocId,
                    userId: currentUid,
                    client: clientName.trim().substring(0, 100) || 'Client',
                    service: serviceList.trim().substring(0, 100) || 'FACILITY MAINTENANCE',
                    date: selectedDate || new Date().toISOString().split('T')[0],
                    status: 'Pending' as const,
                    priority: 'High' as const,
                    amount: grandTotal,
                    email: email,
                    phone: fullPhone,
                    address: fullAddress,
                    notes: appendedNotes,
                    mediaUrls,
                    mediaNames,
                    bookingMode,
                    accessMethod,
                    time: timeWindow,
                    services: revaluedCart,
                    // Advanced schema fields
                    payment,
                    mediaAttachments,
                    timestamps,
                    scheduling,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                };

                await setDoc(requestRef, payload);
                console.log("Successfully created Firestore request document ID:", newDocId);
            } catch (fsError) {
                console.error("Firestore submission failed (non-blocking for checkout):", fsError);
            }
        }

        const bookingData = {
            id: newDocId,
            clientName,
            email,
            phone: fullPhone,
            address: fullAddress,
            notes: appendedNotes,
            accessMethod,
            date: selectedDate,
            time: timeWindow,
            totalPrice: grandTotal,
            depositAmount: amount,
            bookingMode: mode,
            services: revaluedCart,
            mediaUrls,
            mediaNames,
            mediaAttachments,
            timestamps,
            scheduling,
            payment,
            timestamp: Date.now()
        };

        console.log("Creating Payrexx Transaction via Server...");

        const payload = {
            amount,
            currency: 'CHF',
            title: concept,
            description: dynamicDescription,
            clientName,
            email: email
        };

        let response;
        let data;
        let primaryErrorMsg = "";

        // Standardized request function that handles parsing and non-JSON checks
        const makeRequest = async (url: string) => {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const jsonData = await res.json();
                return { res, data: jsonData };
            } else {
                const text = await res.text();
                throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}`);
            }
        };

        // Try relative/configured API path first
        try {
            const apiBase = (import.meta as any).env?.VITE_API_URL || '';
            const mainUrl = `${apiBase}/api/payrexx/create-gateway`;
            console.log(`Attempting transaction initialization via: ${mainUrl}`);
            
            const result = await makeRequest(mainUrl);
            response = result.res;
            data = result.data;
        } catch (err: any) {
            console.warn("Primary API endpoint request resulted in an error, trying fail-safe absolute Cloud Run router. Error:", err.message);
            primaryErrorMsg = err.message;

            // Automatically detect the Cloud Run target region of this project
            let fallbackHost = 'https://another-star-kraken-properties-988352680203.us-west1.run.app';
            if (typeof window !== 'undefined' && (window.location.hostname.includes('dev-') || window.location.port)) {
                fallbackHost = 'https://another-star-kraken-properties-988352680203.us-west1.run.app';
            }
            
            const fallbackUrl = `${fallbackHost}/api/payrexx/create-gateway`;
            
            try {
                console.log(`Connecting to secure absolute server backend (CORS): ${fallbackUrl}`);
                const result = await makeRequest(fallbackUrl);
                response = result.res;
                data = result.data;
            } catch (fallbackErr: any) {
                console.error("Fallback absolute API request failed too:", fallbackErr);
                setPayrexxError({
                    message: `Server Connection Issue: Payrexx handler could not process the response. Details: ${fallbackErr.message} (Primary endpoint returned: ${primaryErrorMsg})`,
                    dataToSave: bookingData
                });
                setIsSubmitting(false);
                return;
            }
        }

        const formattedId = `KPM-${(selectedDate || new Date().toISOString().split('T')[0]).replace(/-/g, '').substring(0, 8)}`;
        const photosCount = files.filter(f => f.type.startsWith('image/') || f.name.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i)).length;
        const videosCount = files.filter(f => f.type.startsWith('video/') || f.name.match(/\.(mp4|mov|avi|mkv|3gp)$/i)).length;

        const successDetailsPayload = {
            id: newDocId,
            formattedId,
            payrexxLink: null as string | null,
            bookingMode: mode,
            date: selectedDate || new Date().toISOString().split('T')[0],
            time: timeWindow,
            address: fullAddress,
            filesCount: files.length,
            photosCount,
            videosCount,
            depositAmount: amount,
            remainingBalance: grandTotal - amount,
            grandTotal,
            clientName,
            email
        };

        if (data && data.success && data.link) {
            console.log("Payrexx Transaction created successfully. Storing link for success screen.", data.link);
            localStorage.setItem('pending_booking', JSON.stringify(bookingData));
            setSubmittedRequestData({ ...successDetailsPayload, payrexxLink: data.link });
            setIsSubmitting(false);
        } else {
            console.warn("Payrexx Transaction creation failed. Booking is saved in database.", data ? data.error : 'No response');
            setSubmittedRequestData({ ...successDetailsPayload, payrexxLink: null });
            setIsSubmitting(false);
        }

    } catch (error: any) {
        console.error("Error in ejecutarReservaYpago:", error);
        alert(t('consultation.alert.gatewayError', { error: error.message }));
        setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => { 
    setShowSuccess(false); 
    onNavigate('home'); 
  };

  const getCardStyle = (id: string) => {
    return 'bg-gradient-to-br from-[#001D3D] via-[#002D5B] to-[#003F7A] shadow-lg shadow-[#002d5b]/10 border border-white/10';
  };

  if (paymentCompletedBooking) {
    return (
      <PaymentCelebrationPage 
        booking={paymentCompletedBooking} 
        onBackHome={() => {
          setPaymentCompletedBooking(null);
          onNavigate('home');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-40 pb-20 font-sans text-gray-800">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* --- Header & Mascot Dialogue & Reviews --- */}
        <div className="relative mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 py-6 md:py-8">
          
          <div className="relative z-10 flex-1 text-left">
              <h1 className="text-3xl md:text-5xl font-black text-[#001D3D] mb-3 leading-tight tracking-tight uppercase">
                  {t('consultation.title.part1')} <span className="text-[#007bff]">{t('consultation.title.part2')}</span>
              </h1>
              
              {/* Integrated Reviews Badge in Title Section */}
              <div className="flex flex-wrap items-center justify-start gap-2.5 mb-5 select-none">
                  <div className="flex items-center gap-2 bg-slate-100/80 px-3.5 py-2 rounded-2xl border border-gray-200/60 backdrop-blur-sm">
                      <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                              <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                      </div>
                      <span className="text-sm font-black text-[#001D3D] tracking-tight">5/5</span>
                      <span className="text-[10px] text-[#001D3D]/70 font-bold uppercase tracking-wider">{t('consultation.reviews.verified')}</span>
                  </div>
                  <div className="bg-[#001D3D] text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-2 rounded-full border border-black/5 shadow-sm shadow-gray-100">
                      ✨ {t('consultation.handover.guarantee')}
                  </div>
              </div>

              <p className="text-sm md:text-base text-gray-500 max-w-2xl font-medium">
                  {t('consultation.subtitle')}
              </p>
          </div>
          
          <div className="relative z-10 w-full lg:w-auto flex justify-center shrink-0 mt-6 lg:mt-0">
              {/* Premium Reviews Card */}
              <div className="bg-white border border-gray-200/50 p-5 rounded-[1.5rem] w-full sm:w-80 shadow-md relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('consultation.testimonials.title')}</span>
                      <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-lg text-[8px] font-black border border-blue-100">
                          <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                          </span> 
                          {t('consultation.testimonials.live')}
                      </div>
                  </div>
                    
                    {/* Vertical Reviews Scroller */}
                    <div className="h-20 overflow-hidden relative">
                        <div className="animate-scroll-reviews">
                            {[...MOCK_REVIEWS, ...MOCK_REVIEWS].map((review, idx) => (
                                <div key={idx} className="h-20 flex flex-col justify-center py-1">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="font-semibold text-gray-800 text-xs">{review.name}</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <StarIcon key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[11.5px] text-gray-600 italic font-medium leading-snug line-clamp-2">
                                        "{t(`consultation.feedback.${review.name.toLowerCase()}`) || review.comment}"
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* Fades */}
                        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:items-start">
            
            {/* --- Left Column: Services Grid --- */}
            <div id="wizard-container" className="w-full lg:w-2/3 pb-24 lg:pb-0">
                
                {/* Dynamic Page Wizard Stepper Progress Bar */}
                <div className="mb-10 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                    {/* Desktop Horizontal Block Stepper */}
                    <div className="hidden md:flex items-center justify-between relative w-full gap-4">
                        {/* Connecting line running behind the steps */}
                        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gray-150 -translate-y-1/2 z-0" />
                        
                        {[
                            { num: 1, label: t('consultation.wizard.location') },
                            { num: 2, label: t('consultation.wizard.service') },
                            { num: 3, label: t('consultation.wizard.extras') },
                            { num: 4, label: t('consultation.wizard.photos') },
                        ].map((s) => {
                            const isCompleted = s.num < activeWizardStep;
                            const isActive = s.num === activeWizardStep;
                            
                            return (
                                <div 
                                    key={s.num}
                                    onClick={() => {
                                        if (s.num <= activeWizardStep || 
                                            (s.num === 2 && postcode && postcode.length === 4) ||
                                            (s.num === 3 && postcode && postcode.length === 4 && cart.length > 0)) {
                                            setActiveWizardStep(s.num);
                                        }
                                    }}
                                    className={`relative z-10 flex items-center gap-3 bg-white px-3 py-2 rounded-2xl cursor-pointer select-none transition-all duration-300 hover:scale-[1.02] border ${
                                        isActive 
                                            ? 'border-blue-100 shadow-sm shadow-blue-50 bg-blue-50/10' 
                                            : 'border-transparent'
                                    }`}
                                    style={{ flex: '1 1 0%' }}
                                >
                                    {/* Circle Icon */}
                                    <div className="shrink-0">
                                        {isCompleted ? (
                                            <div className="w-9 h-9 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-100 animate-scale-up">
                                                ✓
                                            </div>
                                        ) : isActive ? (
                                            <div className="w-9 h-9 rounded-full bg-[#007bff] border-2 border-white ring-4 ring-blue-100/80 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-200">
                                                {s.num}
                                            </div>
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-black text-sm">
                                                {s.num}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Text Content */}
                                    <div className="flex flex-col text-left">
                                        <span className={`text-xs font-black tracking-tight leading-none mb-1 uppercase ${
                                            isActive ? 'text-[#002D5B]' : isCompleted ? 'text-emerald-700' : 'text-gray-600'
                                        }`}>
                                            {s.num}. {s.label}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${
                                            isCompleted ? 'text-emerald-500' : isActive ? 'text-[#007bff]' : 'text-gray-400'
                                        }`}>
                                            {isCompleted ? mt('Completed', 'Completado', 'Abgeschlossen') : isActive ? mt('Current', 'Actual', 'Aktiv') : mt('Pending', 'Pendiente', 'Ausstehend')}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Mobile Stepper Progress Bar (Matching Third Image) */}
                    <div className="md:hidden flex flex-col items-center">
                        {/* Stepper Bubble Line */}
                        <div className="relative w-full flex items-center justify-between px-6 mb-3">
                            {/* Segmented Line behind circles */}
                            <div className="absolute left-[30px] right-[30px] top-1/2 h-0.5 bg-gray-200 -translate-y-1/2 z-0">
                                {/* Completed Green segment */}
                                <div 
                                    className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-500" 
                                    style={{ 
                                        width: activeWizardStep > 1 
                                            ? activeWizardStep === 2 ? '33.33%' : activeWizardStep === 3 ? '66.66%' : '100%' 
                                            : '0%' 
                                    }} 
                                />
                                {/* Active Blue segment */}
                                <div 
                                    className="absolute top-0 h-full bg-blue-500 transition-all duration-500" 
                                    style={{ 
                                        left: activeWizardStep === 2 ? '33.33%' : activeWizardStep === 3 ? '66.66%' : '0%',
                                        width: activeWizardStep === 2 || activeWizardStep === 3 ? '33.33%' : '0%'
                                    }} 
                                />
                            </div>
                            
                            {[1, 2, 3, 4].map((stepNum) => {
                                const isCompleted = stepNum < activeWizardStep;
                                const isActive = stepNum === activeWizardStep;
                                return (
                                    <button 
                                        key={stepNum}
                                        onClick={() => {
                                            if (stepNum <= activeWizardStep || 
                                                (stepNum === 2 && postcode && postcode.length === 4) ||
                                                (stepNum === 3 && postcode && postcode.length === 4 && cart.length > 0)) {
                                                setActiveWizardStep(stepNum);
                                            }
                                        }}
                                        className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shadow-md transition-all duration-300 focus:outline-none ${
                                            isCompleted 
                                                ? 'bg-emerald-500 text-white border-2 border-white ring-2 ring-emerald-100' 
                                                : isActive 
                                                    ? 'bg-[#007bff] text-white border-2 border-white ring-4 ring-blue-100' 
                                                    : 'bg-white text-gray-400 border-2 border-gray-200'
                                        }`}
                                    >
                                        {isCompleted ? '✓' : stepNum}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Stepper Labels underneath */}
                        <div className="w-full grid grid-cols-4 px-2 text-center text-[10px] font-black uppercase tracking-widest">
                            {[
                                { num: 1, label: t('consultation.wizard.location') },
                                { num: 2, label: t('consultation.wizard.service') },
                                { num: 3, label: t('consultation.wizard.extras') },
                                { num: 4, label: t('consultation.wizard.photos') },
                            ].map((s) => {
                                const isCompleted = s.num < activeWizardStep;
                                const isActive = s.num === activeWizardStep;
                                return (
                                    <span 
                                        key={s.num}
                                        className={`${
                                            isCompleted ? 'text-emerald-600' : isActive ? 'text-[#007bff]' : 'text-gray-400'
                                        }`}
                                    >
                                        {s.label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Centered Step Capsule (Matching first image horizontal line) */}
                    <div className="relative flex items-center justify-center mt-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-150"></div>
                        </div>
                        <div className="relative bg-white px-5 py-1 rounded-full border border-gray-150 text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
                            {(() => {
                                if (language === 'de' || language === 'de-CH') return `Schritt ${activeWizardStep} von 4`;
                                if (language === 'fr') return `Étape ${activeWizardStep} sur 4`;
                                if (language === 'it') return `Passo ${activeWizardStep} di 4`;
                                if (language === 'pt') return `Passo ${activeWizardStep} de 4`;
                                if (language === 'es') return `Paso ${activeWizardStep} de 4`;
                                return `Step ${activeWizardStep} of 4`;
                            })()}
                        </div>
                    </div>
                </div>

                {/* --- Step 1: Location Verification --- */}
                {activeWizardStep === 1 && (
                    <div id="step-1-location" className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden bg-white animate-fade-in ${
                        postcode && postcode.length === 4 
                            ? 'border-[#002D5B] shadow-lg shadow-blue-900/5' 
                            : 'border-[#002D5B]/20 shadow-sm'
                    }`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black bg-[#002D5B] text-white shadow-md">1</span>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-[#002D5B]">{t('consultation.step1.title')}</h3>
                                <p className="text-xs font-bold tracking-tight mt-0.5 text-gray-400">{t('consultation.step1.subtitle')}</p>
                            </div>
                        </div>
     
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 text-gray-400">{t('consultation.step1.street')}</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Seewadelstrasse 3"
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#002D5B] focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm shadow-sm transition-all text-slate-800"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 text-gray-400">{t('consultation.step1.postcode')}</label>
                                <input 
                                    type="text"
                                    maxLength={4}
                                    placeholder="e.g. 8001"
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#002D5B] focus:ring-2 focus:ring-blue-100 outline-none font-black text-sm shadow-sm transition-all text-slate-800 font-sans"
                                    value={postcode}
                                    onChange={(e) => handlePostcodeChange(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 text-gray-400">{t('consultation.step1.city')}</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Zürich"
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#002D5B] focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm shadow-sm transition-all text-slate-800"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Zone Surcharge Indicator */}
                        <div className="mt-6 pt-5 border-t border-dashed border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007bff] flex items-center justify-center text-lg shadow-sm font-black animate-float">
                                    📍
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('consultation.step1.billingRegion')}</span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="font-black text-sm text-[#002D5B]">
                                            {postcode && postcode.length === 4 
                                                ? detectZone(postcode).label
                                                : t('consultation.step1.waitingLocation')
                                            }
                                        </span>
                                        {postcode && postcode.length === 4 && (
                                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase shadow-sm ${
                                                detectZone(postcode).surchargePercent > 0 
                                                    ? 'bg-amber-500 text-white' 
                                                    : 'bg-[#10b981] text-white'
                                            }`}>
                                                {detectZone(postcode).surchargePercent > 0 
                                                    ? t('consultation.step1.surchargePercent', { percent: detectZone(postcode).surchargePercent })
                                                    : t('consultation.step1.standardRate')
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {postcode && postcode.length === 4 ? (
                                <div className="bg-blue-50/80 border border-blue-100 text-blue-800 px-4 py-3 rounded-2xl text-[11px] font-bold max-w-sm leading-relaxed shrink-0 flex items-center gap-2.5">
                                    <span className="animate-pulse">✨</span> {t('consultation.step1.unlocked')}
                                </div>
                            ) : (
                                <div className="bg-blue-50/80 border border-blue-100 text-blue-800 px-4 py-3 rounded-2xl text-[11px] font-bold max-w-sm leading-relaxed shrink-0">
                                    ℹ️ {t('consultation.step1.locked')}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- Step 2: Choose Main Service --- */}
                {activeWizardStep === 2 && (
                    <div id="step-2-services" className="space-y-8 animate-fade-in">
                        {!activeModal || !['end-of-tenancy', 'deep-cleaning', 'daily-cleaning', 'moving'].includes(activeModal) ? (
                            <>
                                <div className="flex flex-col gap-1 border-b border-gray-100 pb-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-[#002D5B] text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shadow-md">2</span>
                                        <h3 className="text-xl font-black text-[#002D5B] uppercase tracking-tight">
                                            {t('consultation.step2.title')}
                                        </h3>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 mt-1 pl-13">
                                        {t('consultation.step2.subtitle')}
                                    </p>
                                </div>
 
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                                    {[
                                        { 
                                            id: 'end-of-tenancy', 
                                            idAsEnum: 'end-of-tenancy' as ServiceType,
                                            icon: '🔑', 
                                            title: 'services.endOfTenancy.title', 
                                            subtitle: 'consultation.service.eot.sub',
                                            bullets: [
                                                mt('Full property cleaning', 'Limpieza completa del inmueble', 'Komplette Reinigung der Immobilie'),
                                                mt('Disinfection of bathrooms & kitchen', 'Desinfección de baños y cocina', 'Desinfektion von Bad und Küche'),
                                                mt('Satisfaction report guaranteed', 'Informe de satisfacción garantizado', 'Garantiertes Abgabeprotokoll')
                                            ]
                                        },
                                        { 
                                            id: 'deep-cleaning', 
                                            idAsEnum: 'deep-cleaning' as ServiceType,
                                            icon: '✨', 
                                            title: 'services.deepCleaning.title', 
                                            subtitle: 'consultation.service.deep.sub',
                                            bullets: [
                                                mt('Thorough cleaning of all areas', 'Limpieza exhaustiva de todas las áreas', 'Gründliche Reinigung aller Bereiche'),
                                                mt('Limescale & grease removal', 'Eliminación de cal y grasa', 'Kalk- und Fettentfernung'),
                                                mt('Professional grade products', 'Productos profesionales', 'Professionelle Reinigungsmittel')
                                            ]
                                        },
                                        { 
                                            id: 'daily-cleaning', 
                                            idAsEnum: 'daily-cleaning' as ServiceType,
                                            icon: '📅', 
                                            title: 'services.dailyCleaning.title', 
                                            subtitle: 'consultation.service.daily.sub',
                                            bullets: [
                                                mt('Weekly, bi-weekly or monthly frequency', 'Frecuencia semanal, quincenal o mensual', 'Wöchentliche, zweiwöchentliche oder monatliche Häufigkeit'),
                                                mt('General cleaning & maintenance', 'Limpieza general y mantenimiento', 'Allgemeine Reinigung und Pflege'),
                                                mt('Products and materials included', 'Producto y material incluidos', 'Reinigungsmittel und Materialien inbegriffen')
                                            ]
                                        },
                                        { 
                                            id: 'moving', 
                                            idAsEnum: 'moving' as ServiceType,
                                            icon: '📦', 
                                            title: 'services.movingFurniture.title', 
                                            subtitle: 'consultation.service.moving.sub',
                                            bullets: [
                                                mt('Furniture wrapping & protection', 'Embalaje y protección de muebles', 'Verpackung & Möbelschutz'),
                                                mt('Loading, transport and unloading', 'Carga, transporte y descarga', 'Beladung, Transport und Entladung'),
                                                mt('Basic insurance included', 'Seguro básico incluido', 'Basisversicherung inbegriffen'),
                                                mt('Stairs (no elevator) fee: Basement 25 CHF, 1st: 15 CHF, 2nd: 35 CHF, 3rd: 60 CHF, 4th+: 90+ CHF', 'Recargo sin ascensor: Sótano: 25 CHF, 1.º: 15 CHF, 2.º: 35 CHF, 3.º: 60 CHF, 4.º+: 90+ CHF', 'Treppenzuschlag (ohne Lift): Keller: 25 CHF, 1.Stock: 15 CHF, 2.Stock: 35 CHF, 3.Stock: 60 CHF, 4.+Stock: 90+ CHF')
                                            ]
                                        },
                                    ].map((service) => {
                                        const isSelected = cart.some(item => item.type === service.id);
                                        const cartItem = cart.find(item => item.type === service.id);
                                        const currentConfig = cartItem ? cartItem?.details : SERVICE_DEFAULT_CONFIGS[service.id];

                                        return (
                                            <div
                                                key={service.id}
                                                onClick={() => {
                                                    if (cartItem) {
                                                        handleEditItem(cartItem);
                                                    } else {
                                                        openServiceModal(service.idAsEnum);
                                                    }
                                                }}
                                                className={`p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:scale-[1.03] cursor-pointer group select-none min-h-[150px] ${
                                                    isSelected 
                                                        ? 'bg-gradient-to-br from-[#001D3D] via-[#002D5B] to-[#003F7A] border-[#007bff] shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/10' 
                                                        : 'bg-gradient-to-br from-[#001D3D]/95 via-[#002D5B]/95 to-[#003F7A]/80 border-white/10 shadow-lg shadow-[#002d5b]/10 hover:border-white/20 hover:shadow-xl hover:shadow-[#002d5b]/20'
                                                }`}
                                            >
                                                {/* Left-top corner accent popular badge */}
                                                {service.id === 'end-of-tenancy' && (
                                                    <span className="absolute left-4 top-3.5 bg-amber-400 text-slate-950 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md z-10">
                                                        🔥 {t('consultation.service.mostPopular')}
                                                    </span>
                                                )}

                                                {/* Checked state circle indicator */}
                                                {isSelected && (
                                                    <div className="absolute right-4 top-4 bg-[#38bdf8] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shadow-md z-10">
                                                        ✓
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-start mb-2.5 mt-1 z-10">
                                                    <span className="text-3.5xl filter drop-shadow-sm transform hover:scale-105 transition-transform duration-300">
                                                        {service.icon}
                                                    </span>
                                                </div>

                                                <div className="space-y-0.5 my-1 text-left z-10 mt-auto">
                                                    <h4 className="font-extrabold text-white text-[15px] md:text-base tracking-tight leading-tight group-hover:text-blue-200 transition-colors">
                                                        {t(service.title)}
                                                    </h4>
                                                    <p className="text-[10px] md:text-xs font-bold text-white/60 tracking-tight">
                                                        {t(service.subtitle)}
                                                    </p>
                                                </div>

                                                {/* Watermark icon behind */}
                                                <div className="absolute -right-2 -bottom-2 text-white opacity-[0.05] text-[95px] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none select-none z-0">
                                                    {service.icon}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border-2 border-gray-100/80 shadow-xl animate-fade-in space-y-6">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-2">
                                    <button 
                                        onClick={closeActiveService}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-black text-[#002D5B] transition-all cursor-pointer shadow-sm"
                                    >
                                        ← {t('consultation.backToServices')}
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {activeModal === 'end-of-tenancy' && (
                                            <span className="bg-gradient-to-r from-amber-400 to-amber-300 text-[#002d5b] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-white">
                                                🔥 {t('consultation.service.mostPopular')}
                                            </span>
                                        )}
                                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                            {t('consultation.label.config')}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-[#002D5B] tracking-tight">
                                        {activeModal === 'end-of-tenancy' && t('services.endOfTenancy.title')}
                                        {activeModal === 'deep-cleaning' && t('services.deepCleaning.title')}
                                        {activeModal === 'daily-cleaning' && t('services.dailyCleaning.title')}
                                        {activeModal === 'moving' && t('services.movingFurniture.title')}
                                    </h3>
                                    <p className="text-xs font-extrabold text-gray-400">
                                        {activeModal === 'end-of-tenancy' && t('consultation.service.eot.sub')}
                                        {activeModal === 'deep-cleaning' && t('consultation.service.deep.sub')}
                                        {activeModal === 'daily-cleaning' && t('consultation.service.daily.sub')}
                                        {activeModal === 'moving' && t('consultation.service.moving.sub')}
                                    </p>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => setShowInclusionsModal(activeModal as ServiceType)} 
                                    className="w-full flex items-center justify-between p-4 bg-blue-50/70 hover:bg-blue-100/90 border border-blue-200/80 rounded-2xl text-[#007bff] transition-all group shadow-2xs cursor-pointer my-1"
                                >
                                    <div className="flex items-center gap-3">
                                        <InfoIcon className="w-5 h-5 text-[#007bff] shrink-0" />
                                        <span className="text-sm font-bold">{t('consultation.whatsIncluded')}</span>
                                    </div>
                                    <ChevronRightIcon className="w-4 h-4 text-[#007bff] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                </button>

                                {/* --- Inline configuration content based on activeModal --- */}

                                {/* 1. End of Tenancy Config */}
                                {activeModal === 'end-of-tenancy' && (
                                    <div className="space-y-6">
                                        {config.roomsCount === 0 && config.bathroomsCount === 0 && (
                                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl animate-fade-in">
                                                <p className="text-[10px] text-amber-800 font-bold flex items-center gap-2">
                                                    <InfoIcon className="w-4 h-4 shrink-0" /> 
                                                    <span>{t('consultation.label.callOutWarning', { price: PRICES.baseCallOut.toFixed(2) })}</span>
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <CounterCard icon="🛌" label={t('consultation.label.roomsTitle')} subLabel={t('consultation.label.roomsSubtitle')} value={config.roomsCount} onChange={(v) => { const r = Math.max(0,v); const d = calculateEOTDuration(r, config.bathroomsCount, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount); setConfig({ ...config, roomsCount: r, duration: d }); }} />
                                            <CounterCard icon="🚿" label={t('consultation.label.bathrooms')} value={config.bathroomsCount} onChange={(v) => { const b = Math.max(0,v); const d = calculateEOTDuration(config.roomsCount, b, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount); setConfig({ ...config, bathroomsCount: b, duration: d }); }} />
                                        </div>

                                        <div className="bg-blue-50/20 p-5 rounded-2xl border border-blue-100/50">
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                    <ClockIcon className="w-5 h-5 text-[#007bff]" />
                                                    <span>{t('consultation.label.manualIncrease')}</span>
                                                </label>
                                                <span className="font-extrabold text-[#007bff] text-xl">{formatTotalHours(getActiveTotalHours())}</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min={calculateEOTDuration(config.roomsCount, config.bathroomsCount, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount)} 
                                                max="48" 
                                                step="0.5" 
                                                value={getActiveTotalHours()} 
                                                onChange={(e) => setConfig({ ...config, duration: parseFloat(e.target.value) })} 
                                                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#007bff]" 
                                            />
                                            <p className="text-xs text-gray-500 text-left mt-2.5 font-medium">{t('consultation.label.manualIncreaseDesc', { rate: PRICES.deepHourly.toFixed(2) })}</p>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-sm font-bold text-gray-900">{t('consultation.label.extras')}</label>
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowInclusionsModal(activeModal as ServiceType)}
                                                    className="text-xs font-bold text-[#007bff] hover:underline"
                                                >
                                                    {t('consultation.label.seeAll')}
                                                </button>
                                            </div>
                                            
                                            <div 
                                                ref={extrasScrollRef}
                                                onScroll={handleExtrasScroll}
                                                className="flex overflow-x-auto gap-3.5 pb-2 scrollbar-none snap-x snap-mandatory px-1"
                                            >
                                                <ExtraBentoCard 
                                                    icon="☀️" 
                                                    label={t('consultation.label.balcony')} 
                                                    subLabel="+ CHF 40.00 / +30m" 
                                                    value={config.balconyCount || 0} 
                                                    iconBg="bg-amber-50/60" 
                                                    iconBorder="border-amber-100/50" 
                                                    iconColor="text-amber-500" 
                                                    onChange={(v) => updateExtraConfig('balconyCount', v)} 
                                                />
                                                <ExtraBentoCard 
                                                    icon="📦" 
                                                    label={t('consultation.label.storage')} 
                                                    subLabel="+ CHF 30.00 / +30m" 
                                                    value={config.storageCount || 0} 
                                                    iconBg="bg-orange-50/60" 
                                                    iconBorder="border-orange-100/50" 
                                                    iconColor="text-orange-500" 
                                                    onChange={(v) => updateExtraConfig('storageCount', v)} 
                                                />
                                                <ExtraBentoCard 
                                                    icon="🧹" 
                                                    label={t('consultation.label.carpet')} 
                                                    subLabel="+ CHF 60.00 / +1h" 
                                                    value={config.carpetCount || 0} 
                                                    iconBg="bg-blue-50/60" 
                                                    iconBorder="border-blue-100/50" 
                                                    iconColor="text-blue-500" 
                                                    onChange={(v) => updateExtraConfig('carpetCount', v)} 
                                                />
                                                <ExtraBentoCard 
                                                    icon="🛋️" 
                                                    label={t('consultation.label.upholstery')} 
                                                    subLabel="+ CHF 50.00 / +30m" 
                                                    value={config.furnitureCount || 0} 
                                                    iconBg="bg-purple-50/60" 
                                                    iconBorder="border-purple-100/50" 
                                                    iconColor="text-purple-500" 
                                                    onChange={(v) => updateExtraConfig('furnitureCount', v)} 
                                                />
                                                <ExtraBentoCard 
                                                    icon="🩏" 
                                                    label={t('extras.blinds')} 
                                                    subLabel="+ CHF 25.00 / +20m" 
                                                    value={config.blindsShutters || 0} 
                                                    iconBg="bg-slate-100" 
                                                    iconBorder="border-slate-200" 
                                                    iconColor="text-slate-600" 
                                                    onChange={(v) => updateExtraConfig('blindsShutters', v)} 
                                                />
                                            </div>

                                            <div className="flex justify-center items-center gap-1.5 pt-1">
                                                {[0, 1, 2].map((dotIdx) => (
                                                    <button
                                                        key={dotIdx}
                                                        type="button"
                                                        onClick={() => scrollToExtraDot(dotIdx)}
                                                        aria-label={`Go to section ${dotIdx + 1}`}
                                                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                                                            extrasActiveDot === dotIdx 
                                                                ? 'w-4 h-1.5 bg-[#007bff]' 
                                                                : 'w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <OptionCard 
                                            icon="🪟"
                                            title={`${t('consultation.label.windowCleaning')} ${config.roomsCount > 0 || config.bathroomsCount > 0 ? `(${t('consultation.label.windowIncluded')})` : ''}`}
                                            description={t('consultation.label.windowDesc')}
                                            selected={config.roomsCount > 0 || config.bathroomsCount > 0}
                                            onClick={() => {}}
                                            price={config.roomsCount > 0 || config.bathroomsCount > 0 ? t('consultation.label.windowIncluded') : t('consultation.label.windowWithRooms')}
                                        />
                                    </div>
                                )}

                                {/* 2. Deep Cleaning Config */}
                                {activeModal === 'deep-cleaning' && (
                                    <div className="space-y-6">
                                        {config.bedrooms === 0 && config.bathrooms === 0 && (
                                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl animate-fade-in">
                                                <p className="text-[10px] text-amber-800 font-bold flex items-center gap-2">
                                                    <InfoIcon className="w-4 h-4 shrink-0" />
                                                    <span>{t('consultation.label.callOutWarning', { price: PRICES.baseCallOut.toFixed(2) })}</span>
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">{t('consultation.label.frequency')}</label>
                                            <p className="text-[11px] text-gray-400 pl-1 font-bold mb-1">{language === 'es' ? 'Selecciona la frecuencia y el alcance del servicio.' : 'Select the frequency and scope of the service.'}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {['One-Time', 'Every 3 Months', 'Every 4 Months', 'Every 6 Months', 'Every Year'].map(f => {
                                                    const textHelper = getFrequencyTranslations(f, language);
                                                    
                                                    // Renders mini calendar icon for monthly frequencies
                                                    const renderCustomIcon = () => {
                                                        if (f === 'One-Time') {
                                                            return <span className="text-2xl filter drop-shadow-xs">✨</span>;
                                                        }
                                                        const numStr = f === 'Every 3 Months' ? '3' : f === 'Every 4 Months' ? '4' : f === 'Every 6 Months' ? '6' : '17';
                                                        const labelStr = f === 'Every Year' ? 'JUL' : 'M';
                                                        return (
                                                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col items-center">
                                                                <div className="bg-red-500 w-full h-2.5 border-b border-red-500 text-[5px] font-black text-white text-center flex items-center justify-center tracking-widest uppercase">
                                                                    {labelStr}
                                                                </div>
                                                                <div className="flex-1 flex items-center justify-center font-black text-slate-800 text-sm leading-none">
                                                                    {numStr}
                                                                </div>
                                                            </div>
                                                        );
                                                    };

                                                    return (
                                                        <OptionCard 
                                                            key={f}
                                                            icon={renderCustomIcon()}
                                                            title={textHelper.title}
                                                            description={textHelper.desc}
                                                            selected={config.frequency === f}
                                                            onClick={() => setConfig({...config, frequency: f})}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {config.frequency !== 'One-Time' && (
                                            <div className="animate-fade-in">
                                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-2">{t('consultation.label.preferredRecurrence')}</label>
                                                <input 
                                                    type="text" 
                                                    placeholder={language === 'es' ? 'e.g., Primer lunes del mes, o cada día 15...' : 'e.g., First Monday, or every 15th...'} 
                                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#007bff] focus:bg-white text-sm font-bold text-gray-700 transition-all"
                                                    value={config.recurringDayPreference || ''}
                                                    onChange={(e) => setConfig({...config, recurringDayPreference: e.target.value})}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <CounterCard icon="🛌" label={t('consultation.label.beds')} value={config.bedrooms || 0} onChange={(v) => { const r = Math.max(0,v); const d = calculateCleaningDuration('deep-cleaning', r, config.bathrooms, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount); setConfig({ ...config, bedrooms: r, duration: d }); }} />
                                            <CounterCard icon="🚿" label={t('consultation.label.baths')} value={config.bathrooms || 0} onChange={(v) => { const b = Math.max(0,v); const d = calculateCleaningDuration('deep-cleaning', config.bedrooms, b, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount); setConfig({ ...config, bathrooms: b, duration: d }); }} />
                                        </div>

                                        <div className="bg-slate-50/75 p-5 rounded-2xl border border-gray-150/50">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                                    <ClockIcon className="w-4 h-4 text-[#007bff]" />
                                                    <span>{t('consultation.label.manualIncrease')}</span>
                                                </label>
                                                <span className="font-black text-[#007bff] text-lg">{formatTotalHours(getActiveTotalHours())}</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min={calculateCleaningDuration('deep-cleaning', config.bedrooms || 0, config.bathrooms || 0, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount)} 
                                                max="24" 
                                                step="0.5" 
                                                value={getActiveTotalHours()} 
                                                onChange={(e) => setConfig({ ...config, duration: parseFloat(e.target.value) })} 
                                                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#007bff]" 
                                            />
                                            <p className="text-[10px] text-gray-400 text-center mt-2 font-bold italic">{t('consultation.label.manualIncreaseDesc', { rate: PRICES.deepHourly.toFixed(2) })}</p>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-sm font-bold text-gray-900">{t('consultation.label.extras')}</label>
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowInclusionsModal(activeModal as ServiceType)}
                                                    className="text-xs font-bold text-[#007bff] hover:underline"
                                                >
                                                    {t('consultation.label.seeAll')}
                                                </button>
                                            </div>
                                            
                                            <div 
                                                ref={extrasScrollRef}
                                                onScroll={handleExtrasScroll}
                                                className="flex overflow-x-auto gap-3.5 pb-2 scrollbar-none snap-x snap-mandatory px-1"
                                            >
                                                <ExtraBentoCard 
                                                    icon="☀️" 
                                                    label={t('consultation.label.balcony')} 
                                                    subLabel="+ CHF 40.00 / +30m" 
                                                    value={config.balconyCount || 0} 
                                                    iconBg="bg-amber-50/60" 
                                                    iconBorder="border-amber-100/50" 
                                                    iconColor="text-amber-500" 
                                                    onChange={(v) => updateExtraConfig('balconyCount', v)} 
                                                />
                                                <ExtraBentoCard 
                                                    icon="📦" 
                                                    label={t('consultation.label.storage')} 
                                                    subLabel="+ CHF 30.00 / +30m" 
                                                    value={config.storageCount || 0} 
                                                    iconBg="bg-orange-50/60" 
                                                    iconBorder="border-orange-100/50" 
                                                    iconColor="text-orange-500" 
                                                    onChange={(v) => updateExtraConfig('storageCount', v)} 
                                                />
                                                <ExtraBentoCard 
                                                    icon="🧹" 
                                                    label={t('consultation.label.carpet')} 
                                                    subLabel="+ CHF 60.00 / +1h" 
                                                    value={config.carpetCount || 0} 
                                                    iconBg="bg-blue-50/60" 
                                                    iconBorder="border-blue-100/50" 
                                                    iconColor="text-blue-500" 
                                                    onChange={(v) => updateExtraConfig('carpetCount', v)} 
                                                />
                                                <ExtraBentoCard 
                                                    icon="🛋️" 
                                                    label={t('consultation.label.upholstery')} 
                                                    subLabel="+ CHF 50.00 / +30m" 
                                                    value={config.furnitureCount || 0} 
                                                    iconBg="bg-purple-50/60" 
                                                    iconBorder="border-purple-100/50" 
                                                    iconColor="text-purple-500" 
                                                    onChange={(v) => updateExtraConfig('furnitureCount', v)} 
                                                />
                                                <ExtraBentoCard 
                                                    icon="🩏" 
                                                    label={t('extras.blinds')} 
                                                    subLabel="+ CHF 25.00 / +20m" 
                                                    value={config.blindsShutters || 0} 
                                                    iconBg="bg-slate-100" 
                                                    iconBorder="border-slate-200" 
                                                    iconColor="text-slate-600" 
                                                    onChange={(v) => updateExtraConfig('blindsShutters', v)} 
                                                />
                                            </div>

                                            <div className="flex justify-center items-center gap-1.5 pt-1">
                                                {[0, 1, 2].map((dotIdx) => (
                                                    <button
                                                        key={dotIdx}
                                                        type="button"
                                                        onClick={() => scrollToExtraDot(dotIdx)}
                                                        aria-label={`Go to section ${dotIdx + 1}`}
                                                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                                                            extrasActiveDot === dotIdx 
                                                                ? 'w-4 h-1.5 bg-[#007bff]' 
                                                                : 'w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 3. Daily Cleaning Config */}
                                {activeModal === 'daily-cleaning' && (
                                    <div className="space-y-6">
                                        {config.bedrooms === 0 && config.bathrooms === 0 && (config.ironing || config.laundry || config.oven || config.cabinets || config.fridge || config.windowCount > 0) && (
                                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl animate-fade-in">
                                                <p className="text-[10px] text-amber-800 font-bold flex items-center gap-2">
                                                    <InfoIcon className="w-4 h-4 shrink-0" /> 
                                                    <span>{t('consultation.label.callOutWarning', { price: PRICES.baseCallOut.toFixed(2) })}</span>
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">{t('consultation.label.frequency')}</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {['Daily', 'Weekly', 'Bi-Weekly', 'Every 4 Weeks', 'More Frequently'].map(f => {
                                                    let freqTitle = f;
                                                    if (f === 'Daily') freqTitle = t('frequency.Daily', 'Daily');
                                                    else if (f === 'Weekly') freqTitle = t('frequency.Weekly', 'Weekly');
                                                    else if (f === 'Bi-Weekly') freqTitle = t('frequency.Bi-Weekly', 'Bi-Weekly');
                                                    else if (f === 'Every 4 Weeks') freqTitle = t('frequency.Every 4 Weeks', 'Every 4 Weeks');
                                                    else if (f === 'More Frequently') freqTitle = t('frequency.More Frequently', 'More Frequently');

                                                    return (
                                                        <OptionCard key={f} icon="📅" title={freqTitle} selected={config.frequency === f} onClick={() => setConfig({...config, frequency: f})} />
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="animate-fade-in">
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-2">{t('consultation.label.preferredRecurrence')}</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g., Wednesdays, or Tuesdays & Fridays..." 
                                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#007bff] focus:bg-white text-sm font-bold text-gray-750 transition-all"
                                                value={config.frequencyDetails || ''}
                                                onChange={(e) => setConfig({...config, frequencyDetails: e.target.value})}
                                            />
                                        </div>

                                        <OptionCard 
                                            icon="👤" 
                                            title={mt('Same Operative', 'Mismo Operario', 'Gleiche Reinigungskraft', 'Même intervenant', 'Stesso operatore', 'Mesmo operário')} 
                                            description={mt('Dedicated cleaner for every visit', 'Limpiador dedicado para cada visita', 'Feste Reinigungskraft für jeden Besuch', 'Agent dédié à chaque visite', 'Addetto dedicato per ogni visita', 'Limpeza dedicada para cada visita')} 
                                            selected={config.sameOperative} 
                                            onClick={() => setConfig({...config, sameOperative: !config.sameOperative})} 
                                        />

                                        <div className="space-y-4">
                                            <CounterCard icon="🛌" label={t('consultation.label.beds')} value={config.bedrooms} onChange={(v) => setConfig({ ...config, bedrooms: v, duration: calculateCleaningDuration('daily-cleaning', v, config.bathrooms) })} />
                                            <CounterCard icon="🚿" label={t('consultation.label.baths')} value={config.bathrooms} onChange={(v) => setConfig({ ...config, bathrooms: v, duration: calculateCleaningDuration('daily-cleaning', config.bedrooms, v) })} />
                                        </div>

                                        <div className="bg-slate-50/75 p-5 rounded-2xl border border-gray-150/50">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                                    <ClockIcon className="w-4 h-4 text-[#007bff]" />
                                                    <span>{mt('Duration', 'Duración', 'Dauer', 'Durée', 'Durata', 'Duração')}</span>
                                                </label>
                                                <span className="font-black text-[#007bff] text-lg">{formatTotalHours(getActiveTotalHours())}</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="2.5" 
                                                max="24" 
                                                step="0.5" 
                                                value={getActiveTotalHours()} 
                                                onChange={(e) => {
                                                    const selectedTotal = parseFloat(e.target.value);
                                                    let extra = 0;
                                                    if (config.ironing) extra += (config.ironingHours || 0);
                                                    if (config.laundry) extra += (config.laundryHours || 0);
                                                    if (config.oven) extra += (config.ovenGrease === 'Low' ? 0.5 : config.ovenGrease === 'Medium' ? 0.65 : 0.85);
                                                    if (config.cabinets) extra += (config.cabinetOrganize ? 1.0 : 0.5);
                                                    if (config.fridge) extra += (config.fridgeOrganize ? 1.0 : 0.5);
                                                    if (config.windowCount > 0) extra += (config.windowCount * 0.05);
                                                    const newBase = Math.max(0.5, selectedTotal - extra);
                                                    setConfig({ ...config, duration: newBase });
                                                }} 
                                                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#007bff]" 
                                            />
                                            <p className="text-[10px] text-gray-400 text-center mt-2.5 font-bold italic">{t('consultation.label.estimatedDurationDesc', 'Duration bar includes all selected extra tasks.')}</p>
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">{t('consultation.label.extras')}</label>
                                            
                                            {/* 1. Ironing Service */}
                                            <div className="space-y-3">
                                                <OptionCard icon="👔" title={t('consultation.label.ironingService', 'Ironing Service')} description={t('consultation.label.ironingServiceDesc', 'Add ironing to your routine')} selected={config.ironing} onClick={() => setConfig({...config, ironing: !config.ironing})} isExtra={true} />
                                                {config.ironing && (
                                                    <div className="bg-slate-50/60 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in shadow-xs">
                                                        <CounterCard icon="⏰" label={t('consultation.label.manualIncrease')} value={config.ironingHours} step={0.5} onChange={(v) => setConfig({...config, ironingHours: v})} min={0.5} />
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 pl-1">{t('consultation.label.instructions', 'Instructions')}</label>
                                                            <textarea placeholder="e.g., Shirts on hangers, linens folded..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.ironingNotes} onChange={(e) => setConfig({...config, ironingNotes: e.target.value})}></textarea>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* 2. Laundry Service */}
                                            <div className="space-y-3">
                                                <OptionCard icon="🧺" title={t('consultation.label.laundryService', 'Laundry Service')} description={t('consultation.label.laundryServiceDesc', 'Wash, Dry, or Both')} selected={config.laundry} onClick={() => setConfig({...config, laundry: !config.laundry})} isExtra={true} />
                                                {config.laundry && (
                                                    <div className="bg-slate-50/60 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in shadow-xs">
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 pl-1">{t('consultation.label.serviceType', 'Service Type')}</label>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {['Wash Only', 'Dry Only', 'Wash & Dry'].map(ty => {
                                                                    let lType = ty;
                                                                    if (ty === 'Wash Only') lType = t('laundry.Wash Only', 'Wash Only');
                                                                    else if (ty === 'Dry Only') lType = t('laundry.Dry Only', 'Dry Only');
                                                                    else if (ty === 'Wash & Dry') lType = t('laundry.Wash & Dry', 'Wash & Dry');
                                                                    return (
                                                                        <button key={ty} type="button" onClick={() => setConfig({...config, laundryType: ty})} className={`p-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${config.laundryType === ty ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500 hover:bg-gray-50'}`}>{lType}</button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                        <CounterCard icon="👕" label={t('consultation.label.clothesCount', 'Number of Clothes')} subLabel={t('consultation.label.clothesCountDesc', 'Approximate items or loads')} value={config.laundryItems} onChange={(v) => setConfig({...config, laundryItems: v})} />
                                                        <CounterCard icon="⏰" label={t('consultation.label.manualIncrease')} value={config.laundryHours} step={1} onChange={(v) => setConfig({...config, laundryHours: v})} min={1} />
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 pl-1">{t('consultation.label.fabricMethod', 'Fabric & Washing Method')}</label>
                                                            <textarea placeholder="e.g., Cotton shirts cold wash, delicates air dry..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.laundryNotes} onChange={(e) => setConfig({...config, laundryNotes: e.target.value})}></textarea>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* 3. Oven Cleaning */}
                                            <div className="space-y-3">
                                                <OptionCard icon="🍳" title={t('consultation.label.ovenCleaning', 'Oven Cleaning')} description={t('consultation.label.ovenCleaningDesc', 'Deep clean inside and out')} selected={config.oven} onClick={() => setConfig({...config, oven: !config.oven})} isExtra={true} />
                                                {config.oven && (
                                                    <div className="bg-slate-50/60 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in shadow-xs">
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 pl-1">{t('consultation.label.greaseLevel', 'Grease Level')}</label>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {['Low', 'Medium', 'High'].map(l => {
                                                                    let greaseLabel = l;
                                                                    if (l === 'Low') greaseLabel = t('grease.Low', 'Low');
                                                                    else if (l === 'Medium') greaseLabel = t('grease.Medium', 'Medium');
                                                                    else if (l === 'High') greaseLabel = t('grease.High', 'High');
                                                                    return (
                                                                        <button key={l} type="button" onClick={() => setConfig({...config, ovenGrease: l})} className={`p-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${config.ovenGrease === l ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500 hover:bg-gray-50'}`}>{greaseLabel}</button>
                                                                    );
                                                                })}
                                                            </div>
                                                            <p className="text-[9px] text-gray-400 mt-2 italic pl-1">{t('consultation.label.ovenGreaseDesc', 'Duration adjusts based on grease: Low (30m), Medium (40m), High (50m).')}</p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 pl-1">{t('consultation.label.instructions', 'Instructions')}</label>
                                                            <textarea placeholder="e.g., Double oven, brand details..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.ovenNotes} onChange={(e) => setConfig({...config, ovenNotes: e.target.value})}></textarea>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* 4. Cabinet Cleaning */}
                                            <div className="space-y-3">
                                                <OptionCard icon="🚪" title={t('consultation.label.cabinetCleaning', 'Cabinet Cleaning')} description={t('consultation.slice.cabinetCleaningDesc', 'Interior cleaning & organizing')} selected={config.cabinets} onClick={() => setConfig({...config, cabinets: !config.cabinets})} isExtra={true} />
                                                {config.cabinets && (
                                                    <div className="bg-slate-50/60 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in shadow-xs">
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 pl-1">{t('consultation.label.condition', 'Condition')}</label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {['Empty', 'With Items'].map(c => {
                                                                    let condLabel = c;
                                                                    if (c === 'Empty') condLabel = t('condition.Empty', 'Empty');
                                                                    else if (c === 'With Items') condLabel = t('condition.With Items', 'With Items');
                                                                    return (
                                                                        <button key={c} type="button" onClick={() => setConfig({...config, cabinetCondition: c})} className={`p-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${config.cabinetCondition === c ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500 hover:bg-gray-50'}`}>{condLabel}</button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-150">
                                                            <div className="flex flex-col text-left">
                                                                <span className="text-xs font-bold text-gray-808">{t('consultation.label.organizeItems', 'Remove & Organize Items')}</span>
                                                                <span className="text-[9px] text-gray-400 font-semibold">{t('consultation.label.organizeItemsDesc', 'Increases time (+30m)')}</span>
                                                            </div>
                                                            <button type="button" onClick={() => setConfig({...config, cabinetOrganize: !config.cabinetOrganize})} className={`w-10 h-5 rounded-full relative transition-colors ${config.cabinetOrganize ? 'bg-[#007bff]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.cabinetOrganize ? 'translate-x-5' : 'translate-x-0'}`}></div></button>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 pl-1">{t('consultation.label.instructions', 'Instructions')}</label>
                                                            <textarea placeholder="e.g., Kitchen upper cabinets only..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.cabinetNotes} onChange={(e) => setConfig({...config, cabinetNotes: e.target.value})}></textarea>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            
                                            <div className="space-y-3">
                                                <OptionCard icon="❄️" title={t('consultation.label.fridgeCleaning', 'Fridge Cleaning')} description={t('consultation.label.fridgeCleaningDesc', 'Hygiene & Organization')} selected={config.fridge} onClick={() => setConfig({...config, fridge: !config.fridge})} isExtra={true} />
                                                {config.fridge && (
                                                    <div className="bg-slate-50/60 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in shadow-xs">
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 pl-1">{t('consultation.label.condition', 'Condition')}</label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {['Empty', 'With Items'].map(c => {
                                                                    let condLabel = c;
                                                                    if (c === 'Empty') condLabel = t('condition.Empty', 'Empty');
                                                                    else if (c === 'With Items') condLabel = t('condition.With Items', 'With Items');
                                                                    return (
                                                                        <button key={c} type="button" onClick={() => setConfig({...config, fridgeCondition: c})} className={`p-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${config.fridgeCondition === c ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500 hover:bg-gray-50'}`}>{condLabel}</button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-150">
                                                            <div className="flex flex-col text-left">
                                                                <span className="text-xs font-bold text-gray-805">{t('consultation.label.organizeItems', 'Remove & Organize Items')}</span>
                                                                <span className="text-[9px] text-gray-400 font-semibold">{t('consultation.label.organizeItemsDesc', 'Increases time (+30m)')}</span>
                                                            </div>
                                                            <button type="button" onClick={() => setConfig({...config, fridgeOrganize: !config.fridgeOrganize})} className={`w-10 h-5 rounded-full relative transition-colors ${config.fridgeOrganize ? 'bg-[#007bff]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.fridgeOrganize ? 'translate-x-5' : 'translate-x-0'}`}></div></button>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 pl-1">{t('consultation.label.instructions', 'Instructions')}</label>
                                                            <textarea placeholder="e.g., Freezer defrosting needed..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.fridgeNotes} onChange={(e) => setConfig({...config, fridgeNotes: e.target.value})}></textarea>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <CounterCard 
                                                icon="🪟" 
                                                label={t('consultation.label.windowCleaning')} 
                                                subLabel={t('consultation.label.windowCleaningSub', 'Interior & accessible outside (+3m/window)')} 
                                                value={config.windowCount || 0} 
                                                onChange={(v) => setConfig({...config, windowCount: v})} 
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 4. Moving Config */}
                                {activeModal === 'moving' && (() => {
                                    const laborMap: Record<number, number> = { 1: 60, 2: 120, 3: 175, 4: 225 };
                                    const movers = config.moversCount || 2;
                                    const laborRate = laborMap[movers] || (225 + (movers - 4) * 50);
                                    const gasInfo = calculateGasolineAndDistance(config.fromZip || '', config.toZip || '');
                                    const duration = config.duration || 1;
                                    const laborCost = duration * laborRate;
                                    const gasCost = gasInfo.cost || 0;
                                    
                                    const stairFeeFrom = getStairSurcharge(config.floorFrom, config.accessFrom, movers);
                                    const stairFeeTo = getStairSurcharge(config.floorTo, config.accessTo, movers);
                                    const totalStairFee = stairFeeFrom + stairFeeTo;

                                    let extrasTotal = 0;
                                    if (config.assembly) extrasTotal += (config.assemblyHours || 1) * 80;
                                    if (config.hydraulicLift) extrasTotal += (config.hydraulicLiftHours || 1) * 150;
                                    if (config.packaging) extrasTotal += 45;
                                    extrasTotal += totalStairFee;
                                    
                                    const estimatedTotal = laborCost + gasCost + extrasTotal;

                                    const isValidZip = (zip: string) => {
                                        if (!zip) return false;
                                        const z = zip.trim().substring(0, 2);
                                        return ['80', '81', '82', '83', '84', '86'].includes(z);
                                    };

                                    const isFromZipValid = isValidZip(config.fromZip || '');
                                    const isToZipValid = isValidZip(config.toZip || '');

                                    return (
                                        <div className="space-y-6">
                                            <button 
                                                type="button"
                                                onClick={() => setShowMovingInfo(true)}
                                                className="w-full flex items-center justify-center gap-3 p-4 bg-blue-50/40 border border-blue-100 rounded-[2rem] hover:bg-blue-50 transition-all group animate-fade-in"
                                            >
                                                <InfoIcon className="w-5 h-5 text-[#007bff] shrink-0" />
                                                <span className="text-xs font-black text-[#007bff] tracking-tight">
                                                    {mt('How our moving service works?', '¿Cómo funciona nuestro servicio de mudanzas?', 'Wie funktioniert unser Umzugsservice?', 'Comment fonctionne notre service de déménagement?', 'Come funziona il nostro servizio traslochi?', 'Como funciona o nosso serviço de mudanças?')}
                                                </span>
                                            </button>

                                            <div className="space-y-2">
                                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                                    {mt('What are we moving? / Move Type', '¿Qué vamos a trasladar? / Tipo de mudanza', 'Was zügeln wir? / Umzugsart', 'Que allons-nous déménager? / Type de déménagement', 'Cosa stiamo traslocando? / Tipo trasloco', 'O que vamos mudar? / Tipo de mudança')}
                                                </label>
                                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                                    {[
                                                        {id: 'Home Contents', label: mt('Home', 'Hogar', 'Wohnung', 'Maison', 'Casa', 'Lar'), icon: '🏠'},
                                                        {id: 'Office', label: mt('Office', 'Oficina', 'Büro', 'Bureau', 'Ufficio', 'Escritório'), icon: '🏢'},
                                                        {id: 'Commercial', label: mt('Commercial', 'Comercio', 'Gewerbe', 'Commerce', 'Commercio', 'Comércio'), icon: '🏬'},
                                                        {id: 'Single Item', label: mt('Single Item', 'Artículo único', 'Einzelnes Objekt', 'Article unique', 'Oggetto singolo', 'Artigo único'), icon: '📦'},
                                                        {id: 'Specialty', label: mt('Specialty', 'Especial', 'Spezialtransport', 'Spécial', 'Speciale', 'Especial'), icon: '💎'}
                                                    ].map(m => (
                                                        <button
                                                            key={m.id}
                                                            type="button"
                                                            onClick={() => setConfig({...config, moveType: m.id})}
                                                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${config.moveType === m.id ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 font-bold text-xs text-slate-800 hover:bg-slate-50'}`}
                                                        >
                                                            <span className="text-lg mb-1">{m.icon}</span>
                                                            <span className="text-[10px] font-black">{m.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                                    {mt('Moving Route / Addresses', 'Ruta del traslado / Direcciones', 'Umzugsroute / Adressen', 'Itinéraire du déménagement / Adresses', 'Percorso trasloco / Indirizzi', 'Rota de mudança / Endereços')}
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5 text-left">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-1">
                                                            {mt('Origin Point (Zip + Street)', 'Punto de Origen (Zip + Calle)', 'Startpunkt (PLZ + Strasse)', 'Point de départ (Code postal + Rue)', 'Punto di partenza (Cap + Via)', 'Ponto de origem (Cód. Postal + Rua)')}
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input type="text" maxLength={4} placeholder={mt('Zip (e.g. 8001)', 'CP (ej. 8001)', 'PLZ (z.B. 8001)', 'NPA (ex. 8001)', 'CAP (es. 8001)', 'Cód. Postal (ex. 8001)')} className={`w-24 p-3 bg-slate-50 border rounded-xl font-bold text-xs focus:ring-1 outline-none ${isFromZipValid ? 'border-emerald-250 focus:ring-emerald-200' : 'border-slate-150 focus:ring-blue-100'}`} value={config.fromZip || ''} onChange={(e) => setConfig({...config, fromZip: e.target.value})} />
                                                            <input type="text" placeholder={mt('Street Name & No.', 'Nombre de calle y N.º', 'Strasse & Nr.', 'Rue & N°', 'Via e N.', 'Nome da rua e N.º')} className="flex-1 p-3 bg-slate-50 border border-slate-150 rounded-xl font-bold text-xs focus:ring-1 focus:ring-blue-100 outline-none" value={config.fromAddress || ''} onChange={(e) => setConfig({...config, fromAddress: e.target.value})} />
                                                        </div>
                                                        {!isFromZipValid && config.fromZip && (
                                                            <p className="text-[9px] text-amber-600 font-bold pl-1 mt-1 flex items-center gap-1">
                                                                {mt('⚠️ We only offer moves starting within Zurich (80-84, 86 series) postcodes!', '⚠️ ¡Solo ofrecemos mudanzas con origen en los códigos postales de Zúrich (series 80-84, 86)!', '⚠️ Wir bieten nur Umzüge mit Start innerhalb der Zürcher Postleitzahlen (Serien 80-84, 86) an!', '⚠️ Nous proposons uniquement des déménagements commençant dans les codes postaux de Zurich (séries 80-84, 86) !', '⚠️ Offriamo traslochi solo con partenza nei codici postali di Zurigo (serie 80-84, 86)!', '⚠️ Apenas oferecemos mudanças com origem nos códigos postais de Zurique (séries 80-84, 86)!')}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1.5 text-left">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-1">
                                                            {mt('Destination Point (Zip + Street)', 'Punto de Destino (Zip + Calle)', 'Zielpunkt (PLZ + Strasse)', 'Point d\'arrivée (Code postal + Rue)', 'Punto di destinazione (Cap + Via)', 'Ponto de destino (Cód. Postal + Rua)')}
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input type="text" maxLength={4} placeholder={mt('Zip (e.g. 8002)', 'CP (ej. 8002)', 'PLZ (z.B. 8002)', 'NPA (ex. 8002)', 'CAP (es. 8002)', 'Cód. Postal (ex. 8002)')} className={`w-24 p-3 bg-slate-50 border rounded-xl font-bold text-xs focus:ring-1 outline-none ${isToZipValid ? 'border-emerald-250 focus:ring-emerald-200' : 'border-slate-150 focus:ring-blue-100'}`} value={config.toZip || ''} onChange={(e) => setConfig({...config, toZip: e.target.value})} />
                                                            <input type="text" placeholder={mt('Street Name & No.', 'Nombre de calle y N.º', 'Strasse & Nr.', 'Rue & N°', 'Via e N.', 'Nome da rua e N.º')} className="flex-1 p-3 bg-slate-50 border border-slate-150 rounded-xl font-bold text-xs focus:ring-1 focus:ring-blue-100 outline-none" value={config.toAddress || ''} onChange={(e) => setConfig({...config, toAddress: e.target.value})} />
                                                        </div>
                                                        {!isToZipValid && config.toZip && (
                                                            <p className="text-[9px] text-amber-600 font-bold pl-1 mt-1 flex items-center gap-1">
                                                                {mt('⚠️ We only offer moves ending within Zurich (80-84, 86 series) postcodes!', '⚠️ ¡Solo ofrecemos mudanzas con destino en los códigos postales de Zúrich (series 80-84, 86)!', '⚠️ Wir bieten nur Umzüge mit Ziel innerhalb der Zürcher Postleitzahlen (Serien 80-84, 86) an!', '⚠️ Nous proposons uniquement des déménagements se terminant dans les codes postaux de Zurich (séries 80-84, 86) !', '⚠️ Offriamo traslochi solo con destinazione nei codici postali di Zurigo (serie 80-84, 86)!', '⚠️ Apenas oferecemos mudanças com destino nos códigos postais de Zurique (séries 80-84, 86)!')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2 text-left">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-1">
                                                        {mt('Access at Origin', 'Acceso en Origen', 'Zugang am Startort', 'Accès au départ', 'Accesso alla partenza', 'Acesso na origem')}
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <select className="w-1/2 p-3 bg-slate-50 border border-slate-150 rounded-xl font-bold text-xs" value={config.accessFrom} onChange={(e) => setConfig({...config, accessFrom: e.target.value})}>
                                                            <option value="Lift">{mt('Elevator / Lift', 'Ascensor', 'Aufzug / Lift', 'Ascenseur', 'Ascensore', 'Elevador')}</option>
                                                            <option value="Stairs">{mt('Stairs', 'Escaleras', 'Treppe', 'Escaliers', 'Scale', 'Escadas')}</option>
                                                        </select>
                                                        <select className="w-1/2 p-3 bg-slate-50 border border-slate-150 rounded-xl font-bold text-xs" value={config.floorFrom} onChange={(e) => setConfig({...config, floorFrom: e.target.value})}>
                                                            <option value="0">{mt('Ground Floor', 'Planta Baja', 'Erdgeschoss', 'Rez-de-chaussée', 'Piano Terra', 'Rés-do-chão')}</option>
                                                            <option value="1">{mt('1st Floor', '1.º Piso', '1. Stock', '1er étage', '1° Piano', '1.º Andar')}</option>
                                                            <option value="2">{mt('2nd Floor', '2.º Piso', '2. Stock', '2ème étage', '2° Piano', '2.º Andar')}</option>
                                                            <option value="3">{mt('3rd Floor', '3.º Piso', '3. Stock', '3ème étage', '3° Piano', '3.º Andar')}</option>
                                                            <option value="4">{mt('4th Floor or higher', '4.º Piso o más', '4. Stock oder höher', '4ème étage ou plus', '4° Piano o superiore', '4.º Andar ou superior')}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-left">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-1">
                                                        {mt('Access at Destination', 'Acceso en Destino', 'Zugang am Zielort', 'Accès à l\'arrivée', 'Accesso all\'arrivo', 'Acesso no destino')}
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <select className="w-1/2 p-3 bg-slate-50 border border-slate-150 rounded-xl font-bold text-xs" value={config.accessTo} onChange={(e) => setConfig({...config, accessTo: e.target.value})}>
                                                            <option value="Lift">{mt('Elevator / Lift', 'Ascensor', 'Aufzug / Lift', 'Ascenseur', 'Ascensore', 'Elevador')}</option>
                                                            <option value="Stairs">{mt('Stairs', 'Escaleras', 'Treppe', 'Escaliers', 'Scale', 'Escadas')}</option>
                                                        </select>
                                                        <select className="w-1/2 p-3 bg-slate-50 border border-slate-150 rounded-xl font-bold text-xs" value={config.floorTo} onChange={(e) => setConfig({...config, floorTo: e.target.value})}>
                                                            <option value="0">{mt('Ground Floor', 'Planta Baja', 'Erdgeschoss', 'Rez-de-chaussée', 'Piano Terra', 'Rés-do-chão')}</option>
                                                            <option value="1">{mt('1st Floor', '1.º Piso', '1. Stock', '1er étage', '1° Piano', '1.º Andar')}</option>
                                                            <option value="2">{mt('2nd Floor', '2.º Piso', '2. Stock', '2ème étage', '2° Piano', '2.º Andar')}</option>
                                                            <option value="3">{mt('3rd Floor', '3.º Piso', '3. Stock', '3ème étage', '3° Piano', '3.º Andar')}</option>
                                                            <option value="4">{mt('4th Floor or higher', '4.º Piso o más', '4. Stock oder höher', '4ème étage ou plus', '4° Piano o superiore', '4.º Andar ou superior')}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 text-left">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-1">{mt('Parking Situation', 'Situación de Aparcamiento / Parking', 'Parksituation', 'Situation de stationnement', 'Situazione parcheggio', 'Situação do estacionamento')}</label>
                                                <select 
                                                    className="w-full p-3 bg-slate-50 border border-slate-150 rounded-xl font-bold text-xs" 
                                                    value={config.freeParking === false ? 'paid' : 'free'} 
                                                    onChange={(e) => setConfig({...config, freeParking: e.target.value === 'free'})}
                                                >
                                                    <option value="free">{mt('Free, reserved zone or private driveway/parking is available', 'Aparcamiento gratuito, zona de carga reservada o parking privado disponible', 'Kostenloser oder reservierter Parkplatz vorhanden', 'Parking gratuit, zone réservée ou allée privée disponible', 'Parcheggio gratuito, zona riservata o vialetto privato disponibile', 'Estacionamento gratuito, zona reservada ou entrada privada disponível')}</option>
                                                    <option value="paid">{mt('Paid parking, public blue zone or commercial parking meter applies (+30 CHF)', 'Aparcamiento de pago, zona azul pública o parquímetro de pago aplica (+30 CHF)', 'Gebührenpflichtiger Parkplatz oder blaue Zone (+30 CHF)', 'Parking payant, zone bleue publique ou horodateur payant (+30 CHF)', 'Parcheggio a pagamento, zona blu pubblica o parcometro (+30 CHF)', 'Estacionamento pago, zona azul pública ou parquímetro pago aplica (+30 CHF)')}</option>
                                                </select>
                                            </div>

                                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-[11px] text-slate-500 flex flex-col gap-1.5 text-left">
                                                <div className="flex justify-between">
                                                    <span>{mt('Route distance:', 'Distancia de ruta:', 'Routenentfernung:', 'Distance de l\'itinéraire:', 'Distanza del percorso:', 'Distância da rota:')}</span>
                                                    <span className="font-extrabold text-slate-800">{gasInfo.distance ? `${gasInfo.distance.toFixed(1)} km` : mt('Calculating...', 'Calculando...', 'Berechnen...', 'Calcul...', 'Calcolo...', 'Calculando...')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>{mt('Fuel & transit surcharge:', 'Cargo por gasolina y tránsito:', 'Benzin- & Transitgebühr:', 'Frais d\'essence & transit:', 'Supplemento carburante e transito:', 'Taxa de combustível e trânsito:')}</span>
                                                    <span className="font-extrabold text-slate-800">CHF {gasCost.toFixed(2)}</span>
                                                </div>
                                                {(stairFeeFrom > 0 || stairFeeTo > 0) && (
                                                    <div className="flex justify-between text-emerald-600 font-extrabold">
                                                        <span>
                                                            {mt('Stairs Carrying Surcharge:', 'Recargo por transporte de escaleras:', 'Treppenzuschlag (ohne Lift):', 'Supplément pour portage d\'escalier :', 'Supplemento trasporto scale:', 'Sobretaxa de transporte por escadas:')}
                                                            <span className="text-[9.5px] font-medium text-gray-400 block sm:inline sm:ml-1.5">
                                                                ({stairFeeFrom > 0 ? `${mt('Origin', 'Origen', 'Auszug', 'Départ', 'Partenza', 'Origem')}: +${stairFeeFrom} CHF` : ''}
                                                                {stairFeeFrom > 0 && stairFeeTo > 0 ? ', ' : ''}
                                                                {stairFeeTo > 0 ? `${mt('Destination', 'Destino', 'Einzug', 'Arrivée', 'Destinazione', 'Destino')}: +${stairFeeTo} CHF` : ''})
                                                            </span>
                                                        </span>
                                                        <span>CHF {totalStairFee.toFixed(2)}</span>
                                                    </div>
                                                )}
                                                {config.freeParking === false && (
                                                    <div className="flex justify-between text-emerald-600 font-extrabold">
                                                        <span>{mt('Paid / Public Zone Parking Fee:', 'Recargo por aparcamiento de pago/métrica:', 'Gebühren für kostenpflichtiges Parken:', 'Frais de parking payant / zone publique :', 'Tariffa parcheggio a pagamento/pubblico:', 'Taxa de estacionamento pago / zona pública:')}</span>
                                                        <span>CHF 30.00</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between font-black text-[#002D5B] border-t border-slate-200/50 pt-1.5 mt-1">
                                                    <span>{mt(`Labor rate (${movers} movers):`, `Tarifa de mano de obra (${movers} transportistas):`, `Arbeitskosten (${movers} Zügelhelfer):`, `Tarif de main-d'œuvre (${movers} déménageurs):`, `Tariffa manodopera (${movers} traslocatori):`, `Taxa de mão de obra (${movers} ajudantes):`)}</span>
                                                    <span>CHF {laborRate}/h</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <CounterCard icon="👥" label={mt('Number of movers', 'Número de operarios (Movers)', 'Anzahl Zügelhelfer', 'Nombre de déménageurs', 'Numero di traslocatori', 'Número de ajudantes')} value={movers} min={1} max={6} onChange={(v) => setConfig({...config, moversCount: v})} />
                                                <CounterCard icon="⏰" label={mt('Estimated Duration', 'Duración Estimada', 'Geschätzte Dauer', 'Durée estimée', 'Durata stimata', 'Duração estimada')} suffix={mt(' Hours', ' Horas', ' Stunden', ' Heures', ' Ore', ' Horas')} value={duration} min={1} max={18} step={0.5} onChange={(v) => setConfig({...config, duration: v})} />
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                                    {mt('Extras & Accessories', 'Extras del traslado / Accesorios', 'Zusatzleistungen & Zubehör', 'Prestations supplémentaires & Accessoires', 'Extra e accessori', 'Extras e acessórios')}
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <CounterCard icon="🔧" label={mt('Furniture Disassembly / Assembly', 'Desmontaje / Montaje muebles', 'Möbeldemontage / -montage', 'Démontage / Montage de meubles', 'Smontaggio / Montaggio mobili', 'Desmontagem / Montagem de móveis')} subLabel={mt('+ CHF 80.00/h', '+ CHF 80.00/h', '+ CHF 80.00/Std.', '+ CHF 80.00/h', '+ CHF 80.00/ora', '+ CHF 80.00/h')} value={config.assembly ? config.assemblyHours : 0} onChange={(v) => setConfig({...config, assembly: v > 0, assemblyHours: v})} />
                                                    <CounterCard icon="🏗️" label={mt('External Hydraulic Lift', 'Elevador Hidráulico Externo', 'Aussenlift / Möbellift', 'Monte-meuble hydraulique', 'Elevatore idraulico esterno', 'Elevador hidráulico externo')} subLabel={mt('+ CHF 150.00/h', '+ CHF 150.00/h', '+ CHF 150.00/Std.', '+ CHF 150.00/h', '+ CHF 150.00/ora', '+ CHF 150.00/h')} value={config.hydraulicLift ? config.hydraulicLiftHours : 0} onChange={(v) => setConfig({...config, hydraulicLift: v > 0, hydraulicLiftHours: v})} />
                                                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200">
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-xs font-bold text-gray-805">
                                                                {mt('Packaging Material', 'Material de Embalaje', 'Verpackungsmaterial', 'Matériel d\'emballage', 'Materiale da imballaggio', 'Material de embalagem')}
                                                            </span>
                                                            <span className="text-[9px] text-gray-400">
                                                                {mt('+ CHF 45.00 flat fee', '+ CHF 45.00 tarifa fija', '+ CHF 45.00 Pauschale', '+ CHF 45.00 forfait', '+ CHF 45.00 tariffa fissa', '+ CHF 45.00 taxa fixa')}
                                                            </span>
                                                        </div>
                                                        <button type="button" onClick={() => setConfig({...config, packaging: !config.packaging})} className={`w-10 h-5 rounded-full relative transition-all ${config.packaging ? 'bg-[#007bff]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.packaging ? 'translate-x-5' : 'translate-x-0'}`}></div></button>
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200">
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-xs font-bold text-gray-805">
                                                                {mt('Basic final cleaning (Home)', 'Limpieza final básica (Hogar)', 'Endreinigung (Wohnung)', 'Nettoyage final de base (Maison)', 'Pulizia finale di base (Casa)', 'Limpeza final básica (Lar)')}
                                                            </span>
                                                            <span className="text-[9px] text-gray-400">
                                                                {mt('+ Bundle rate available', '+ Tarifa combinada disponible', '+ Kombi-Tarif verfügbar', '+ Tarif combiné disponible', '+ Tariffa combinata disponibile', '+ Tarifa combinada disponível')}
                                                            </span>
                                                        </div>
                                                        <button type="button" onClick={() => setConfig({...config, cleaning: !config.cleaning})} className={`w-10 h-5 rounded-full relative transition-all ${config.cleaning ? 'bg-[#007bff]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.cleaning ? 'translate-x-5' : 'translate-x-0'}`}></div></button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 text-left pt-2">
                                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                                    {mt('Inventory or important details', 'Inventario o detalles importantes', 'Inventar oder wichtige Details', 'Inventaire ou détails importants', 'Inventario o dettagli importanti', 'Inventário ou importantes detalhes')}
                                                </label>
                                                <textarea placeholder={mt('e.g. A 3-seater sofa, large dining table with 6 chairs, 12 cardboard boxes, fragile TV...', 'ej. Un sofá de 3 plazas, mesa de comedor grande con 6 sillas, 12 cajas de cartón, TV frágil...', 'z.B. Ein 3-Sitzer-Sofa, grosser Esstisch mit 6 Stühlen, 12 Kartons, empfindlicher Fernseher...', 'ex. Un canapé 3 places, une grande table à manger avec 6 chaises, 12 cartons, un téléviseur fragile...', 'es. Un divano a 3 posti, tavolo da pranzo grande con 6 sedie, 12 scatole di cartone, TV fragile...', 'ex. Um sofá de 3 lugares, mesa de jantar grande com 6 cadeiras, 12 caixas de cartão, TV frágil...')} className="w-full p-4 bg-slate-50 focus:bg-white border border-slate-100 focus:border-[#007bff] focus:ring-1 rounded-2xl text-xs font-bold font-sans outline-none transition-all" rows={4} value={config.description || ''} onChange={(e) => setConfig({...config, description: e.target.value})} />
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* --- Bottom inline total pricing + save action button layout --- */}
                                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="text-left">
                                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('consultation.estimatedTotal')}</div>
                                        <div className="text-3xl font-black text-[#002D5B] mt-1 flex items-baseline gap-1.5 leading-none">
                                            <span>CHF {getEstimatedPrice().toFixed(2)}</span>
                                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
                                                {language === 'de' || language === 'de-CH' ? 'exkl. MwSt.' :
                                                 language === 'fr' ? 'hors TVA' :
                                                 language === 'it' ? 'escl. IVA' :
                                                 language === 'es' ? 'sin IVA' :
                                                 language === 'pt' ? 'sem IVA' : 'excl. VAT'}
                                            </span>
                                        </div>
                                        <p className="text-[9px] text-gray-400 font-semibold mt-1 max-w-xs leading-relaxed">
                                            {mt('Dynamic pricing calculations are exclusive of VAT.', 'El precio total se calcula dinámicamente, excluyendo el IVA.', 'Preiskalkulationen verstehen sich exklusive MwSt.', 'Les calculs de prix dynamiques sont hors TVA.', 'I calcoli dinamici dei prezzi sono esclusi IVA.', 'Os cálculos de preços dinâmicos não incluem IVA.')}
                                        </p>
                                    </div>
                                    <div className="flex gap-3 justify-end shrink-0">
                                        <button 
                                            type="button"
                                            onClick={closeActiveService}
                                            className="px-6 py-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[#002D5B] font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border border-slate-150 shadow-sm"
                                        >
                                            {mt('Cancel', 'Cancelar', 'Abbrechen', 'Annuler', 'Annulla', 'Cancelar')}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={handleAddToCart}
                                            className="px-8 py-3.5 bg-[#007bff] hover:bg-blue-600 rounded-2xl text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer shadow-blue-200/50"
                                        >
                                            <span>{editingItemId ? t('consultation.label.updateService') : mt('Add to budget →', 'Añadir al presupuesto →', 'Zum Budget hinzufügen →', 'Ajouter au budget →', 'Aggiungi al preventivo →', 'Adicionar ao orçamento →')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- Step 3: Choose Additional Services --- */}
                {activeWizardStep === 3 && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex flex-col gap-1 border-b border-gray-100 pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#007bff] text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shadow-md">3</span>
                                <h3 className="text-xl font-black text-[#002D5B] uppercase tracking-tight">{t('consultation.services.additional')}</h3>
                            </div>
                            <p className="text-xs font-bold text-gray-400 mt-1 pl-13">
                                {language === 'es' ? 'Añade extras opcionales para complementar tu presupuesto.' : language === 'de' || language === 'de-CH' ? 'Fügen Sie optionale Extras hinzu, um Ihr Angebot zu ergänzen.' : 'Add optional extras to complement your quotation.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-500 animate-fade-in">
                            {[
                                { id: 'gardening', icon: '🌿', title: 'services.gardening.title', subtitle: 'consultation.service.gardening.sub' },
                                { id: 'exterior-cleaning', icon: '💧', title: 'services.exterior.title', subtitle: 'consultation.service.exterior.sub' },
                                { id: 'car-detailing', icon: '🚗', title: 'services.car.title', subtitle: 'consultation.service.car.sub' },
                                { id: 'pest-control', icon: '🐜', title: 'services.pest.title', subtitle: 'consultation.service.pest.sub' },
                                { id: 'waste-management', icon: '🗑️', title: 'services.waste.title', subtitle: 'consultation.service.waste.sub' },
                                { id: 'gutter-cleaning', icon: '🍂', title: 'services.gutter.title', subtitle: 'consultation.service.gutter.sub' },
                            ].map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => openServiceModal(service.id as ServiceType)}
                                    className={`${getCardStyle(service.id)} p-5 rounded-[1.25rem] hover:scale-[1.02] transition-all text-left group relative overflow-hidden h-36 duration-300`}
                                >
                                    <div className="flex flex-col h-full justify-between relative z-20">
                                        <div className="flex justify-between items-start w-full">
                                            <span className="text-4xl filter drop-shadow-lg transform group-hover:rotate-6 transition-transform duration-500">{service.icon}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-[#002D5B] text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md border border-amber-200 select-none flex items-center gap-1 shrink-0">
                                                    ⏳ {t('services.comingSoon')}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-base text-white mb-0.5 tracking-tight">{t(service.title)}</h4>
                                            <p className="text-white/80 font-bold text-[10px] leading-snug">{t(service.subtitle)}</p>
                                        </div>
                                    </div>
                                    <div className="absolute -right-3 -bottom-3 text-white opacity-10 text-[90px] group-hover:rotate-12 transition-transform duration-700 pointer-events-none select-none">
                                        {service.icon}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Step 4: Visual Documentation --- */}
                {activeWizardStep === 4 && (
                    <div className="animate-fade-in">
                        <div className="flex flex-col gap-1 border-b border-gray-100 pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shadow-md">4</span>
                                <h3 className="text-xl font-black text-[#002D5B] uppercase tracking-tight">{t('consultation.visualDocumentation')}</h3>
                            </div>
                            <p className="text-xs font-bold text-gray-400 mt-1 pl-13">
                                {language === 'es' ? 'Sube fotos de tu propiedad para darnos más detalles de las tareas.' : language === 'de' || language === 'de-CH' ? 'Laden Sie Fotos Ihrer Immobilie hoch, um uns mehr Details zu geben.' : 'Upload photos of your property to provide us with extra visual detail.'}
                            </p>
                        </div>

                        {anonAuthError === 'admin-restricted-operation' && (
                            <div id="firebase-setup-alert" className="mb-6 bg-amber-50/90 border border-amber-200 rounded-[2rem] p-6 text-left max-w-lg mx-auto flex flex-col sm:flex-row gap-4 items-start animate-fade-in shadow-sm relative z-30">
                                <span className="text-3xl shrink-0 p-2 bg-amber-100 rounded-2xl">⚠️</span>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-black text-sm text-amber-800 mb-1">Configuración de Firebase Requerida / Setup Required</h4>
                                        <p className="text-xs text-amber-900 leading-relaxed font-bold">
                                            Para permitir que usuarios no registrados suban fotos, debes activar la opción de **&quot;Proveedor Anónimo&quot;** en la consola de tu proyecto Firebase.
                                        </p>
                                        <p className="text-[11px] text-amber-800 leading-relaxed mt-1">
                                            To allow unregistered guests to upload photos, you must enable the **&quot;Anonymous&quot;** sign-in provider in your Firebase project console.
                                        </p>
                                    </div>
                                    <div className="pt-1.5 flex flex-wrap gap-2">
                                        <a 
                                            href="https://console.firebase.google.com/project/vivid-kite-477020-h6/authentication/providers" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 hover:bg-amber-700 text-white font-black text-[11px] px-3.5 py-2.5 rounded-xl transition-all shadow-sm"
                                            style={{ backgroundColor: '#D97706' }}
                                        >
                                            Habilitar en la Consola de Firebase ↗
                                        </a>
                                        <button 
                                            type="button" 
                                            onClick={() => setAnonAuthError(null)}
                                            className="text-[11px] text-amber-700 hover:text-[#D97706] font-bold px-3 py-2 rounded-xl hover:bg-amber-100 transition-all cursor-pointer"
                                        >
                                            Descartar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border-3 border-dashed border-gray-100 bg-white rounded-[2rem] p-10 text-center relative hover:border-[#007bff] hover:bg-blue-50/30 transition-all duration-300 group">
                            <input 
                                type="file" 
                                multiple 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                onChange={(e) => { 
                                    if(e.target.files) {
                                        handleUploadFile(Array.from(e.target.files));
                                        e.target.value = "";
                                    }
                                }} 
                            />
                            <div className="w-20 h-20 bg-blue-50 text-4xl rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-105 group-hover:rotate-6 transition-transform duration-500 select-none">
                                📸
                            </div>
                            <p className="font-black text-xl text-[#002D5B] mb-1.5">
                                {t('consultation.upload.precise')}
                            </p>
                            <p className="text-sm text-gray-400 font-bold tracking-tight">{t('consultation.upload.help')}</p>
                            
                            <div className="mt-4 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100 shadow-2xs select-none">
                                <span className="text-[#007bff]">✨</span>
                                {t('consultation.upload.accuracyBonus')}
                            </div>
                            
                            {files.length > 0 && (
                                <div className="mt-8 text-left max-w-lg mx-auto space-y-4 relative z-20">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-2">{t('consultation.queue.status')}</h4>
                                    <div className="space-y-3">
                                        {files.map((file, idx) => {
                                            const uploadState = uploadStates.find(us => us.name === file.name);
                                            const isCompleted = uploadState?.status === 'success';
                                            const isUploading = uploadState?.status === 'uploading';
                                            const isError = uploadState?.status === 'error';
                                            const progress = uploadState?.progress || 0;

                                            return (
                                                <div 
                                                    key={`${file.name}-${idx}`} 
                                                    className="bg-slate-50/80 p-4 rounded-2xl border border-gray-100 flex flex-col gap-2 relative group overflow-hidden transition-all duration-300 hover:border-blue-100 hover:shadow-md"
                                                >
                                                    {isUploading && (
                                                        <div 
                                                            className="absolute inset-y-0 left-0 bg-blue-500/5 transition-all duration-300 pointer-events-none"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    )}

                                                    <div className="flex items-center justify-between gap-4 relative z-10 w-full">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className={`p-2.5 rounded-xl shrink-0 ${
                                                                isCompleted ? 'bg-blue-50 text-[#007bff]' :
                                                                isUploading ? 'bg-blue-50 text-blue-500' :
                                                                isError ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'
                                                            }`}>
                                                                {isCompleted && <CheckIcon className="w-5 h-5 animate-scale-up" />}
                                                                {isUploading && (
                                                                    <span className="inline-block animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                                                                )}
                                                                {isError && <XMarkIcon className="w-5 h-5 text-red-500" />}
                                                                {!uploadState && <CloudUploadIcon className="w-5 h-5" />}
                                                            </div>
                                                            <div className="truncate text-left">
                                                                <p className="font-black text-xs text-gray-700 truncate">{file.name}</p>
                                                                <p className="font-mono text-[9px] text-gray-400">
                                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {
                                                                        isCompleted ? t('consultation.upload.ready') :
                                                                        isUploading ? t('consultation.upload.uploading', { progress }) :
                                                                        isError ? t('consultation.upload.failed') : t('consultation.upload.queued')
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <button 
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleFileRemoval(idx); }}
                                                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shrink-0 cursor-pointer pointer-events-auto relative z-30"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {isUploading && (
                                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1 relative z-10 animate-pulse">
                                                            <div 
                                                                className="bg-blue-500 h-full transition-all duration-300"
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                    )}

                                                    {isError && (
                                                        <p className="text-[10px] text-red-500 font-bold text-left pl-1">
                                                            Error: {uploadState?.error || 'Unknown upload error'}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- Step Footer Navigation Controls --- */}
                <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
                    {activeWizardStep > 1 ? (
                        <button
                            type="button"
                            onClick={() => {
                                setActiveWizardStep(prev => prev - 1);
                                const wizardEl = document.getElementById('wizard-container') || document.getElementById('step-1-location');
                                if (wizardEl) {
                                    wizardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                            className="px-7 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-2xl text-[#002D5B] font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                            {language === 'es' ? '← Atrás' : language === 'de' || language === 'de-CH' ? '← Zurück' : '← Back'}
                        </button>
                    ) : (
                        <div />
                    )}

                    {activeWizardStep < 4 ? (
                        <button
                            type="button"
                            onClick={() => {
                                if (activeWizardStep === 1) {
                                    if (!postcode || postcode.length !== 4 || !address.trim()) return;
                                }
                                setActiveWizardStep(prev => prev + 1);
                                const wizardEl = document.getElementById('wizard-container') || document.getElementById('step-1-location');
                                if (wizardEl) {
                                    wizardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                            disabled={activeWizardStep === 1 && (!postcode || postcode.length !== 4 || !address.trim())}
                            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer ${
                                activeWizardStep === 1 && (!postcode || postcode.length !== 4 || !address.trim())
                                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
                                    : 'bg-[#002D5B] hover:bg-[#001f3f] text-white hover:shadow-lg hover:shadow-blue-900/10'
                            }`}
                        >
                            <span>{language === 'es' ? 'Continuar →' : language === 'de' || language === 'de-CH' ? 'Weiter →' : 'Continue →'}</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setContactModalOpen(true)}
                            disabled={cart.length === 0}
                            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer ${
                                cart.length === 0
                                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/10'
                            }`}
                        >
                            <span>{language === 'es' ? 'Obtener presupuesto final' : language === 'de' || language === 'de-CH' ? 'Offerte anfordern' : 'Get quotation'}</span>
                        </button>
                    )}
                </div>

            </div>

            <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-[0_-15px_50px_rgba(0,0,0,0.15)] border-t border-gray-100 transition-transform duration-700 lg:sticky lg:top-28 lg:bottom-auto lg:left-auto lg:right-auto lg:w-1/3 lg:block lg:bg-transparent lg:shadow-none lg:border-none lg:backdrop-filter-none lg:z-30 lg:transform-none translate-y-0`}>
                <div className="lg:relative">
                    <div className="bg-white lg:rounded-[2.5rem] lg:shadow-2xl lg:border border-gray-100 overflow-hidden">
                        <div className="lg:hidden p-6 flex items-center justify-between cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors" onClick={(e) => { if((e.target as HTMLElement).tagName !== 'BUTTON') setMobileSummaryOpen(!isMobileSummaryOpen); }}>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">{t('consultation.estimatedTotal')}</span>
                                <span className="text-3xl font-black text-[#002D5B]">CHF {grandTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setContactModalOpen(true)} disabled={cart.length === 0} className="bg-[#007bff] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-200/50 hover:bg-blue-600 disabled:opacity-50 transition-all">{t('consultation.book')}</button>
                                <div className={`p-1.5 rounded-full text-gray-400 bg-gray-100 transition-transform duration-500 ${isMobileSummaryOpen ? 'rotate-180' : ''}`}><ChevronUpIcon className="w-5 h-5"/></div>
                            </div>
                        </div>

                        <div className={`transition-[max-height] duration-700 ease-in-out overflow-hidden ${isMobileSummaryOpen ? 'max-h-[70vh]' : 'max-h-0'} lg:max-h-none lg:block`}>
                            <div className="hidden lg:block p-8 border-b border-gray-100 bg-slate-50/50">
                                <h3 className="text-2xl font-black text-[#002D5B] uppercase tracking-tight">{t('consultation.yourBundle')}</h3>
                            </div>
                            <div className="p-8">
                                {/* Visual Stepper Status Checklist inside Right Summary Sidebar */}
                                <div className="mb-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#002D5B]/60 mb-2">
                                        {t('consultation.wizard.status')}
                                    </h4>
                                    
                                    {/* 1. Location */}
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <span>📍</span>
                                            <span>{t('consultation.wizard.location')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-black uppercase text-[10px]">
                                            {postcode && postcode.length === 4 ? (
                                                <span className="text-emerald-600 flex items-center gap-1">
                                                    ✓ {postcode} {city ? `, ${city}` : ''}
                                                </span>
                                            ) : activeWizardStep === 1 ? (
                                                <span className="text-[#007bff] animate-pulse">
                                                    ● {t('consultation.wizard.entering')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    ○
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. Main Service */}
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-t border-gray-100/60 pt-2">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <span>🔑</span>
                                            <span>{t('consultation.wizard.mainService')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-black uppercase text-[10px]">
                                            {cart.some(item => ['end-of-tenancy', 'deep-cleaning', 'daily-cleaning', 'moving'].includes(item.type)) ? (
                                                <span className="text-emerald-600 flex items-center gap-1">
                                                    ✓ {t('consultation.wizard.ready')}
                                                </span>
                                            ) : activeWizardStep === 2 ? (
                                                <span className="text-[#007bff] animate-pulse">
                                                    ● {t('consultation.wizard.choosing')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    ○
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 3. Additional Services */}
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-t border-gray-100/60 pt-2">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <span>🌿</span>
                                            <span>{t('consultation.services.additional')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-black uppercase text-[10px]">
                                            {cart.some(item => ['gardening', 'exterior-cleaning', 'car-detailing', 'pest-control', 'waste-management', 'gutter-cleaning'].includes(item.type)) ? (
                                                <span className="text-emerald-600 flex items-center gap-1">
                                                    ✓ {t('consultation.wizard.added')}
                                                </span>
                                            ) : activeWizardStep === 3 ? (
                                                <span className="text-[#007bff] animate-pulse">
                                                    ● {t('consultation.wizard.choose')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    ○
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 4. Photos */}
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-t border-gray-100/60 pt-2">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <span>📸</span>
                                            <span>{t('consultation.wizard.photos')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-black uppercase text-[10px]">
                                            {files.length > 0 ? (
                                                <span className="text-emerald-600 flex items-center gap-1">
                                                    ✓ {files.length} {files.length === 1 ? (language === 'fr' || language === 'en' ? 'Photo' : 'Foto') : (language === 'fr' || language === 'en' ? 'Photos' : language === 'it' ? 'Foto' : 'Fotos')}
                                                </span>
                                            ) : activeWizardStep === 4 ? (
                                                <span className="text-[#007bff] animate-pulse">
                                                    ● {t('consultation.wizard.uploading')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    ○
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 max-h-[45vh] lg:max-h-[55vh] overflow-y-auto custom-scrollbar pr-3">
                                    {revaluedCart.length === 0 ? (
                                        <div className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                            <div className="text-5xl mb-4 opacity-20 filter grayscale">🛒</div>
                                            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">{t('consultation.bundle.empty')}</p>
                                        </div>
                                    ) : (
                                        revaluedCart.map((item) => (
                                            <div 
                                                key={item.id} 
                                                onClick={() => handleEditItem(item)}
                                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative group hover:border-[#007bff] hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                                            >
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }} 
                                                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 lg:opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-full z-10"
                                                >
                                                    <XMarkIcon className="w-3.5 h-3.5" />
                                                </button>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-3xl filter drop-shadow-sm">{item.type === 'end-of-tenancy' ? '🔑' : item.type === 'daily-cleaning' ? '📅' : item.type === 'moving' ? '📦' : item.type === 'car-detailing' ? '🚗' : item.type === 'gardening' ? '🌿' : item.type === 'exterior-cleaning' ? '💧' : item.type.includes('cleaning') ? '✨' : item.type.includes('pest') ? '🐜' : item.type.includes('waste') ? '🗑️' : item.type.includes('gutter') ? '🍂' : '🔧'}</span>
                                                    <span className="font-black text-gray-800 text-sm uppercase tracking-tight">
                                                        {(() => {
                                                            const map: Record<string, string> = {
                                                                'end-of-tenancy': 'services.endOfTenancy.title',
                                                                'deep-cleaning': 'services.deepCleaning.title',
                                                                'daily-cleaning': 'services.dailyCleaning.title',
                                                                'moving': 'services.movingFurniture.title',
                                                                'gardening': 'services.gardening.title',
                                                                'exterior-cleaning': 'services.exterior.title',
                                                                'car-detailing': 'services.car.title',
                                                                'pest-control': 'services.pest.title',
                                                                'waste-management': 'services.waste.title',
                                                                'gutter-cleaning': 'services.gutter.title',
                                                            };
                                                            const key = map[item.type];
                                                            return key ? t(key) : item.type.replace(/-/g, ' ');
                                                        })()}
                                                    </span>
                                                </div>
                                                <div className="mb-4">
                                                    {renderCartItemDetails(item)}
                                                </div>
                                                <div className="flex justify-between items-center pl-10">
                                                    <div className="flex items-center gap-2">
                                                        {item.duration ? (
                                                            <span className="text-[9px] font-black uppercase tracking-wider text-[#007bff] bg-blue-50 px-2 py-0.5 rounded-lg">
                                                                 {formatTotalHours(item.duration)}
                                                            </span>
                                                        ) : null}
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 group-hover:text-[#007bff] transition-colors border-b border-transparent group-hover:border-blue-200">
                                                            <PencilIcon className="w-2.5 h-2.5" /> {t('consultation.bundle.clickToEdit')}
                                                        </span>
                                                    </div>
                                                    <span className="font-black text-[#007bff] text-lg">{item.price ? `CHF ${item.price.toFixed(2)}` : t('consultation.bundle.getFinalQuote')}</span>
                                                </div>
                                                <div className="absolute inset-0 bg-blue-50/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-8 pt-8 border-t border-gray-100 hidden lg:block">
                                    {cart.length > 0 && (
                                        <div className="mb-6 flex justify-between items-center px-2">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                                                    {onlyComics 
                                                        ? (language === 'es' ? 'Gastos de envío' : 'Shipping Cost') 
                                                        : t('consultation.travel.fee')}
                                                </span>
                                                {onlyComics ? (
                                                    <span className="text-[10px] font-bold text-blue-500">
                                                        {language === 'es' ? 'Envío por correo postal' : 'Postal Shipping'}
                                                    </span>
                                                ) : travelMsg ? (
                                                    <button 
                                                        onClick={() => setShowTravelModal(true)}
                                                        className={`text-[10px] font-bold ${travelMsgColor} animate-pulse flex items-center gap-1 hover:underline text-left`}
                                                    >
                                                        {travelMsg} <InfoIcon className="w-3 h-3" />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => setShowTravelModal(true)}
                                                        className="text-[9px] font-black text-[#007bff] hover:underline flex items-center gap-1 mt-0.5"
                                                    >
                                                        {t('consultation.travel.howFree')} <InfoIcon className="w-2.5 h-2.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <span className={`font-black ${travelFee === 0 ? 'text-green-500' : 'text-gray-600'} text-lg`}>
                                                {travelFee === 0 ? t('consultation.free') : `CHF ${travelFee.toFixed(2)}`}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-end mb-8 px-2">
                                        <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">{t('consultation.estimatedTotal')}</span>
                                        <span className="text-4xl font-black text-[#002D5B] tracking-tighter">CHF {grandTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-blue-50 text-blue-800 text-[11px] p-4 rounded-xl mb-8 flex gap-3 leading-relaxed font-bold border border-blue-100">
                                        <InfoIcon className="w-5 h-5" />
                                        <p>{t('consultation.bundle.includesDesc')}</p>
                                    </div>
                                    <button onClick={() => setContactModalOpen(true)} disabled={cart.length === 0} className="w-full bg-[#007bff] hover:bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-300/50 transition-all disabled:opacity-50 transform hover:-translate-y-1 active:translate-y-0 text-lg uppercase tracking-wider">{t('consultation.bundle.getFinalQuote')}</button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleDirectPDFExport}
                                        disabled={cart.length === 0}
                                        className="mt-3 w-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-[#002D5B] font-extrabold py-4 rounded-[1.5rem] border border-slate-200 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        📄 {language === 'es' ? 'Exportar Estimación en PDF' : (language === 'de' || language === 'de-CH') ? 'Kostenvoranschlag als PDF exportieren' : language === 'fr' ? 'Exporter le devis en PDF' : language === 'it' ? 'Esporta preventivo in PDF' : language === 'pt' ? 'Exportar orçamento em PDF' : 'Export Estimate as PDF'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- MODALS --- */}
        {showAddressModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in select-none">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8 relative flex flex-col overflow-hidden border border-slate-100">
              {/* Top design background */}
              <div className="absolute top-0 left-0 w-full h-32 bg-blue-50 rounded-b-[50%] -z-0 transform -translate-y-16 scale-x-150"></div>
              
              {/* Close Button - Only visible if they already have an address configured */}
              {address.trim() && postcode.trim() && city.trim() && (
                <button 
                  onClick={() => setShowAddressModal(false)}
                  className="absolute top-6 right-6 p-2 bg-white hover:bg-slate-100 rounded-full border border-gray-100 transition-colors z-20 cursor-pointer"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              )}

              <div className="relative z-10 text-center mb-6">
                <img src={mascotImageUrl} alt="Kai Mascot" className="w-20 h-20 object-contain mx-auto mb-3 drop-shadow-md animate-bounce-in" />
                <h3 className="text-xl font-black text-[#002D5B] uppercase tracking-tight">📍 {t('consultation.modal.address.title')}</h3>
                <p className="text-xs text-gray-500 font-bold max-w-sm mx-auto mt-2 leading-relaxed">
                  {t('consultation.modal.address.desc')}
                </p>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4 relative z-10 text-left">
                <div className="group">
                  <label className="block text-[10px] font-black text-[#002D5B] uppercase tracking-wider mb-1.5 ml-1">{t('consultation.step1.street')}</label>
                  <input 
                    type="text"
                    placeholder="e.g. Bahnhofstrasse 12"
                    className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#007bff] outline-none font-bold text-sm shadow-sm transition-all duration-300"
                    value={tempAddress}
                    onChange={(e) => setTempAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-[10px] font-black text-[#002D5B] uppercase tracking-wider mb-1.5 ml-1">{t('consultation.step1.postcode')}</label>
                    <input 
                      type="text"
                      placeholder="e.g. 8001"
                      maxLength={4}
                      className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#007bff] outline-none font-bold text-sm shadow-sm transition-all duration-300 animate-fade-in"
                      value={tempPostcode}
                      onChange={(e) => handleTempPostcodeChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-[#002D5B] uppercase tracking-wider mb-1.5 ml-1">{t('consultation.step1.city')}</label>
                    <input 
                      type="text"
                      placeholder="e.g. Zürich"
                      className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-[#007bff] outline-none font-bold text-sm shadow-sm transition-all duration-300"
                      value={tempCity}
                      onChange={(e) => setTempCity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Dynamic Live Zone Badge */}
                {tempPostcode.trim().length === 4 && (
                  <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center gap-3 animate-fade-in">
                    <span className="text-xl">🗺️</span>
                    <div>
                      <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">{t('consultation.step1.detectedZone')}</span>
                      <span className="font-extrabold text-xs text-[#002D5B] flex items-center gap-1.5">
                        {detectZone(tempPostcode).label} 
                        {detectZone(tempPostcode).surchargePercent > 0 ? (
                          <span className="text-[10px] font-black bg-blue-100 text-[#007bff] px-1.5 py-0.5 rounded-md leading-none">
                            {t('consultation.step1.localRateText', { percent: detectZone(tempPostcode).surchargePercent })}
                          </span>
                        ) : (
                          <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md leading-none border border-blue-100">
                            {t('consultation.step1.baseRate')}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {tempErrors && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[11px] font-black uppercase tracking-wide text-center">
                    ⚠️ {tempErrors}
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-[#002D5B] hover:bg-[#001D3B] text-[#ffffff] py-4 rounded-2xl font-black text-sm uppercase tracking-wide shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-4"
                >
                  {t('consultation.form.saveContinue')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: PAYREXX CONFIG ERROR & FALLBACK SELECTION --- */}
        {payrexxError && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md animate-fade-in select-none">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-8 relative flex flex-col overflow-hidden border border-slate-100">
              {/* Highlight ribbon */}
              <div className="absolute top-0 left-0 w-full h-32 bg-amber-50 rounded-b-[50%] -z-0 transform -translate-y-16 scale-x-150"></div>
              
              {/* Close Button */}
              <button 
                onClick={() => setPayrexxError(null)}
                className="absolute top-6 right-6 p-2 bg-white hover:bg-slate-100 rounded-full border border-gray-100 transition-colors z-20 cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>

              <div className="relative z-10 text-center mb-6">
                <span className="inline-block text-4xl p-3 bg-amber-100 rounded-2xl mb-3">⚙️</span>
                <h3 className="text-xl font-black text-amber-800 uppercase tracking-tight">{t('payment.alert.title')}</h3>
                
                {/* Alert message display */}
                <div className="mt-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl text-left">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{t('payment.alert.details')}</p>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed">
                    {payrexxError.message}
                  </p>
                  <p className="text-[11px] text-amber-700 font-bold mt-2 leading-relaxed">
                    {t('payment.alert.message')}
                  </p>
                </div>
              </div>

              <div className="space-y-4 relative z-10 text-left">
                {/* Option 1: Sandbox success */}
                <button 
                  type="button"
                  onClick={() => {
                    const dataWithSuccess = {
                      ...payrexxError.dataToSave,
                      payment: {
                        ...(payrexxError.dataToSave.payment || {}),
                        status: 'captured' as const,
                        method: 'card' as const,
                        gateway: 'payrexx' as const,
                        transactionId: 'paid_via_gateway'
                      },
                      timestamps: {
                        ...(payrexxError.dataToSave.timestamps || {}),
                        depositCapturedAt: new Date().toISOString()
                      }
                    };
                    localStorage.setItem('pending_booking', JSON.stringify(dataWithSuccess));
                    setPayrexxError(null);
                    window.location.search = '?payment=success';
                  }}
                  className="w-full p-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white rounded-[2rem] text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg shadow-emerald-500/20 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl pt-0.5">🚀</span>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-wide">{t('payment.bypass.title')}</h4>
                      <p className="text-xs text-emerald-100 mt-1 leading-snug">
                        {t('payment.bypass.desc')}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Option 2: Wire Transfer / Invoice */}
                <button 
                  type="button"
                  onClick={() => {
                    const dataWithInvoice = {
                      ...payrexxError.dataToSave,
                      payment: {
                        ...(payrexxError.dataToSave.payment || {}),
                        status: 'pending' as const,
                        method: 'bank_transfer' as const,
                        gateway: 'manual' as const,
                        transactionId: 'invoice_bank_transfer'
                      },
                      timestamps: {
                        ...(payrexxError.dataToSave.timestamps || {}),
                        depositCapturedAt: null
                      }
                    };
                    localStorage.setItem('pending_booking', JSON.stringify(dataWithInvoice));
                    setPayrexxError(null);
                    window.location.search = '?payment=invoice';
                  }}
                  className="w-full p-5 bg-[#002D5B] hover:bg-[#001D3B] text-white rounded-[2rem] text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg shadow-[#002D5B]/20 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl pt-0.5">📄</span>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-wide">{t('payment.invoice.title')}</h4>
                      <p className="text-xs text-blue-100 mt-1 leading-snug">
                        {t('payment.invoice.desc')}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="relative z-10 mt-6 text-center">
                <button 
                  type="button"
                  onClick={() => setPayrexxError(null)}
                  className="px-6 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  {t('payment.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODALS --- */}
        {comingSoonModalService && (
          <ModalOverlay 
            title={t(
              comingSoonModalService === 'gardening' ? 'services.gardening.title' :
              comingSoonModalService === 'exterior-cleaning' ? 'services.exterior.title' :
              comingSoonModalService === 'car-detailing' ? 'services.car.title' :
              comingSoonModalService === 'pest-control' ? 'services.pest.title' :
              comingSoonModalService === 'waste-management' ? 'services.waste.title' : 'services.gutter.title'
            )} 
            onClose={() => setComingSoonModalService(null)} 
            noScroll={true}
          >
            <div className="p-6 md:p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border border-amber-200 animate-bounce">
                {
                  comingSoonModalService === 'gardening' ? '🌿' :
                  comingSoonModalService === 'exterior-cleaning' ? '💧' :
                  comingSoonModalService === 'car-detailing' ? '🚗' :
                  comingSoonModalService === 'pest-control' ? '🐜' :
                  comingSoonModalService === 'waste-management' ? '🗑️' : '🍂'
                }
              </div>
              
              <div className="space-y-2">
                <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-[#002D5B] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm border border-amber-300">
                  ⏳ {t('services.comingSoon')}
                </span>
                <h3 className="text-2xl font-black text-[#002D5B]">
                  {t(
                    comingSoonModalService === 'gardening' ? 'services.gardening.title' :
                    comingSoonModalService === 'exterior-cleaning' ? 'services.exterior.title' :
                    comingSoonModalService === 'car-detailing' ? 'services.car.title' :
                    comingSoonModalService === 'pest-control' ? 'services.pest.title' :
                    comingSoonModalService === 'waste-management' ? 'services.waste.title' : 'services.gutter.title'
                  )}
                </h3>
              </div>

              <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-md mx-auto">
                {t('services.comingSoon.notice')}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setComingSoonModalService(null)}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-[#002D5B] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  {t('consultation.form.back')}
                </button>
                <a
                  href="https://wa.me/41774505705"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#002D5B] hover:bg-[#001D3D] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  {language === 'es' ? 'Consulta Personalizada' : language === 'de' || language === 'de-CH' ? 'Anfrage Senden' : 'Custom Inquiry'}
                </a>
              </div>
            </div>
          </ModalOverlay>
        )}
        {showSuccess && <SuccessModal onClose={handleCloseSuccess} onNavigate={onNavigate} />}
        {showInclusionsModal && (
          <ServiceDetailsModal 
            type={showInclusionsModal} 
            onClose={() => setShowInclusionsModal(null)} 
            onSelectService={(sId) => setShowInclusionsModal(sId)}
            language={language}
          />
        )}

        
        {/* MODAL: Travel Fee Explanation */}
        {showTravelModal && (
            <ModalOverlay title={t('payment.travel.modal.title')} onClose={() => setShowTravelModal(false)}>
                <div className="space-y-8">
                    <div className="text-center">
                        <img src={mascotImageUrl} alt="Kai explaining" className="w-24 h-24 mx-auto mb-4 object-contain animate-float" />
                        <h4 className="text-xl font-black text-[#002D5B] uppercase tracking-tight">{t('payment.travel.header')}</h4>
                        <p className="text-sm text-gray-500 font-medium">{t('payment.travel.subheader')}</p>
                    </div>

                    <div className="space-y-4">
                        <div className={`p-5 rounded-2xl border-2 transition-all ${travelFee === 45 ? 'border-[#002D5B] bg-slate-50' : 'border-gray-100 bg-white'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-black text-gray-800 uppercase tracking-widest text-xs">{t('payment.travel.tier1.title')}</span>
                                <span className="font-black text-gray-800">CHF 45.00</span>
                            </div>
                            <p className="text-xs text-gray-500">{t('payment.travel.tier1.desc')}</p>
                        </div>

                        <div className={`p-5 rounded-2xl border-2 transition-all ${travelFee === 25 ? 'border-[#007bff] bg-blue-50' : 'border-gray-100 bg-white'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-black text-[#007bff] uppercase tracking-widest text-xs">{t('payment.travel.tier2.title')}</span>
                                <span className="font-black text-[#007bff]">CHF 25.00</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{t('payment.travel.tier2.qualify')}</p>
                            <ul className="text-[10px] space-y-1 font-bold text-gray-600">
                                <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-blue-400"/> {t('payment.travel.tier2.qualify.bullet1')}</li>
                                <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-blue-400"/> {t('payment.travel.tier2.qualify.bullet2')}</li>
                            </ul>
                        </div>

                        <div className={`p-5 rounded-2xl border-2 transition-all ${travelFee === 0 && cart.length > 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-black uppercase tracking-widest text-xs ${travelFee === 0 && cart.length > 0 ? 'text-blue-700' : 'text-gray-400'}`}>{t('payment.travel.tier3.title')}</span>
                                <span className={`font-black ${travelFee === 0 && cart.length > 0 ? 'text-blue-700' : 'text-gray-600'}`}>{t('payment.travel.free')}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{t('payment.travel.tier3.qualify')}</p>
                            <ul className="text-[10px] space-y-1 font-bold text-gray-600">
                                <li className="flex items-center gap-2"><CheckIcon className={`w-3 h-3 ${travelFee === 0 && cart.length > 0 ? 'text-blue-500' : 'text-gray-400'}`}/> {t('payment.travel.tier3.qualify.bullet1')}</li>
                                <li className="flex items-center gap-2"><CheckIcon className={`w-3 h-3 ${travelFee === 0 && cart.length > 0 ? 'text-blue-500' : 'text-gray-400'}`}/> {t('payment.travel.tier3.qualify.bullet2')}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-xl flex items-start gap-3">
                         <LeafIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                         <p className="text-[10px] text-indigo-900 font-bold leading-relaxed">
                            {t('payment.travel.sustainability.message')}
                         </p>
                    </div>

                    <button 
                        onClick={() => setShowTravelModal(false)}
                        className="w-full bg-[#002D5B] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
                    >
                        {t('payment.travel.close')}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: End of Tenancy */}
        {activeModal === 'end-of-tenancy' && false && (
            <ModalOverlay title={t('services.endOfTenancy.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }} noScroll={true}>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <button onClick={() => setShowInclusionsModal('end-of-tenancy')} className="w-full text-center text-[#007bff] text-xs font-black hover:underline flex items-center justify-center gap-2.5 bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"><InfoIcon className="w-5 h-5" />{t('consultation.whatsIncluded')}</button>
                    
                    {config.roomsCount === 0 && config.bathroomsCount === 0 && (config.balconyCount > 0 || config.storageCount > 0 || config.carpetCount > 0 || config.furnitureCount > 0) && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4 animate-fade-in">
                            <p className="text-[10px] text-amber-800 font-bold flex items-center gap-2">
                                <InfoIcon className="w-4 h-4" /> {t('consultation.label.callOutWarning', { price: PRICES.baseCallOut.toFixed(2) })}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <CounterCard icon="🛌" label={t('consultation.label.pieces')} value={config.roomsCount} onChange={(v) => { const r = Math.max(0,v); const d = calculateEOTDuration(r, config.bathroomsCount, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount); setConfig({ ...config, roomsCount: r, duration: d }); }} />
                        <CounterCard icon="🚿" label={t('consultation.label.bathrooms')} value={config.bathroomsCount} onChange={(v) => { const b = Math.max(0,v); const d = calculateEOTDuration(config.roomsCount, b, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount); setConfig({ ...config, bathroomsCount: b, duration: d }); }} />
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <ClockIcon className="w-4 h-4 text-[#007bff]" />{t('consultation.label.manualIncrease')}
                            </label>
                            <span className="font-black text-[#007bff] text-lg">{formatTotalHours(getActiveTotalHours())}</span>
                        </div>
                        <input 
                            type="range" 
                            min={calculateEOTDuration(config.roomsCount, config.bathroomsCount, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount)} 
                            max="48" 
                            step="0.5" 
                            value={getActiveTotalHours()} 
                            onChange={(e) => setConfig({ ...config, duration: parseFloat(e.target.value) })} 
                            className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007bff]" 
                        />
                        <p className="text-[10px] text-gray-400 text-center mt-2 font-medium italic">{t('consultation.label.manualIncreaseDesc', { rate: PRICES.deepHourly.toFixed(2) })}</p>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.label.extras')}</label>
                        <div className="space-y-3">
                            <CounterCard icon="☀️" label={t('consultation.label.balcony')} subLabel="+ CHF 40.00 / +30m" value={config.balconyCount} isExtra={true} onChange={(v) => setConfig({...config, balconyCount: v, duration: calculateEOTDuration(config.roomsCount, config.bathroomsCount, v, config.storageCount, config.carpetCount, config.furnitureCount)})} />
                            <CounterCard icon="📦" label={t('consultation.label.storage')} subLabel="+ CHF 30.00 / +30m" value={config.storageCount} isExtra={true} onChange={(v) => setConfig({...config, storageCount: v, duration: calculateEOTDuration(config.roomsCount, config.bathroomsCount, config.balconyCount, v, config.carpetCount, config.furnitureCount)})} />
                            <CounterCard icon="🧹" label={t('consultation.label.carpet')} subLabel="+ CHF 60.00 per room / +1h" value={config.carpetCount} isExtra={true} onChange={(v) => setConfig({...config, carpetCount: v, duration: calculateEOTDuration(config.roomsCount, config.bathroomsCount, config.balconyCount, config.storageCount, v, config.furnitureCount)})} />
                            <CounterCard icon="🛋️" label={t('consultation.label.upholstery')} subLabel="+ CHF 50.00 per item / +30m" value={config.furnitureCount} isExtra={true} onChange={(v) => setConfig({...config, furnitureCount: v, duration: calculateEOTDuration(config.roomsCount, config.bathroomsCount, config.balconyCount, config.storageCount, config.carpetCount, v)})} />
                        </div>
                    </div>
                    <OptionCard 
                        icon="🪟"
                        title={`${t('consultation.label.windowCleaning')} ${config.roomsCount > 0 || config.bathroomsCount > 0 ? `(${t('consultation.label.windowIncluded')})` : ''}`}
                        description={t('consultation.label.windowDesc')}
                        selected={config.roomsCount > 0 || config.bathroomsCount > 0}
                        onClick={() => {}}
                        price={config.roomsCount > 0 || config.bathroomsCount > 0 ? t('consultation.label.windowIncluded') : t('consultation.label.windowWithRooms')}
                    />
                </div>
                {/* Sticky Footer */}
                <div className="p-5 bg-slate-50 border-t border-gray-100/90 z-10 flex flex-col gap-3 rounded-b-[2rem] shrink-0 shadow-xs">
                    <div className="flex justify-between items-center px-1">
                        <span className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">{t('consultation.estimatedTotal')}</span>
                        <span className="font-black text-2xl text-[#007bff]">CHF {getEstimatedPrice().toFixed(2)}</span>
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] hover:bg-blue-600 active:scale-[0.98] text-white py-4 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all uppercase tracking-wider">
                        {editingItemId ? t('consultation.label.updateService') : t('consultation.label.addServiceWithDetails', { duration: formatTotalHours(getActiveTotalHours()), price: getEstimatedPrice().toFixed(2) })}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Deep Cleaning */}
        {activeModal === 'deep-cleaning' && false && (
            <ModalOverlay title={t('services.deepCleaning.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }} noScroll={true}>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <button onClick={() => setShowInclusionsModal('deep-cleaning')} className="w-full text-center text-[#007bff] text-xs font-black hover:underline flex items-center justify-center gap-2.5 bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"><InfoIcon className="w-5 h-5" />{t('consultation.whatsIncluded')}</button>
                    
                    {config.bedrooms === 0 && config.bathrooms === 0 && (config.balconyCount > 0 || config.storageCount > 0 || config.carpetCount > 0 || config.furnitureCount > 0) && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4 animate-fade-in">
                            <p className="text-[10px] text-amber-800 font-bold flex items-center gap-2">
                                <InfoIcon className="w-4 h-4" /> {t('consultation.label.callOutWarning', { price: PRICES.baseCallOut.toFixed(2) })}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.label.frequency')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {id: 'One-Time', icon: '✨', label: t('frequency.One-Time', 'One-Time')},
                                {id: 'Every 3 Months', icon: '🗓️', label: t('frequency.Every 3 Months', 'Every 3 Months')},
                                {id: 'Every 4 Months', icon: '🗓️', label: t('frequency.Every 4 Months', 'Every 4 Months')},
                                {id: 'Every 6 Months', icon: '🗓️', label: t('frequency.Every 6 Months', 'Every 6 Months')},
                                {id: 'Every Year', icon: '📅', label: t('frequency.Every Year', 'Every Year')}
                            ].map(f => (
                                <OptionCard 
                                    key={f.id} 
                                    icon={f.icon} 
                                    title={f.label} 
                                    selected={config.frequency === f.id} 
                                    onClick={() => setConfig({...config, frequency: f.id})} 
                                />
                            ))}
                        </div>
                    </div>

                    {config.frequency !== 'One-Time' && (
                        <div className="animate-fade-in">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('consultation.label.preferredRecurrence')}</label>
                            <input 
                                type="text" 
                                placeholder="e.g., First Monday, or every 15th..." 
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] text-sm font-medium text-gray-700"
                                value={config.recurringDayPreference || ''}
                                onChange={(e) => setConfig({...config, recurringDayPreference: e.target.value})}
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <CounterCard icon="🛌" label={t('consultation.label.beds')} value={config.bedrooms} onChange={(v) => setConfig({ ...config, bedrooms: v, duration: calculateCleaningDuration('deep-cleaning', v, config.bathrooms, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount) })} />
                        <CounterCard icon="🚿" label={t('consultation.label.baths')} value={config.bathrooms} onChange={(v) => setConfig({ ...config, bathrooms: v, duration: calculateCleaningDuration('deep-cleaning', config.bedrooms, v, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount) })} />
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between mb-2"><label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2"><ClockIcon className="w-4 h-4 text-[#007bff]" />{t('consultation.label.manualIncrease')}</label><span className="font-black text-[#007bff] text-lg">{formatTotalHours(getActiveTotalHours())}</span></div>
                        <input type="range" min="4" max="20" step="0.5" value={getActiveTotalHours()} onChange={(e) => setConfig({ ...config, duration: parseFloat(e.target.value) })} className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007bff]" />
                        <p className="text-[10px] text-gray-400 text-center mt-2 font-medium italic">{t('consultation.label.manualIncreaseDesc', { rate: PRICES.deepHourly.toFixed(2) })}</p>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.label.extras')}</label>
                        <div className="space-y-3">
                            <CounterCard icon="☀️" label={t('consultation.label.balcony')} subLabel="+ CHF 40.00 / +30m" value={config.balconyCount} isExtra={true} onChange={(v) => setConfig({...config, balconyCount: v, duration: calculateCleaningDuration('deep-cleaning', config.bedrooms, config.bathrooms, v, config.storageCount, config.carpetCount, config.furnitureCount)})} />
                            <CounterCard icon="📦" label={t('consultation.label.storage')} subLabel="+ CHF 30.00 / +30m" value={config.storageCount} isExtra={true} onChange={(v) => setConfig({...config, storageCount: v, duration: calculateCleaningDuration('deep-cleaning', config.bedrooms, config.bathrooms, config.balconyCount, v, config.carpetCount, config.furnitureCount)})} />
                            <CounterCard icon="🧹" label={t('consultation.label.carpet')} subLabel="+ CHF 60.00 per room / +1h" value={config.carpetCount} isExtra={true} onChange={(v) => setConfig({...config, carpetCount: v, duration: calculateCleaningDuration('deep-cleaning', config.bedrooms, config.bathrooms, config.balconyCount, config.storageCount, v, config.furnitureCount)})} />
                            <CounterCard icon="🛋️" label={t('consultation.label.upholstery')} subLabel="+ CHF 50.00 per item / +30m" value={config.furnitureCount} isExtra={true} onChange={(v) => setConfig({...config, furnitureCount: v, duration: calculateCleaningDuration('deep-cleaning', config.bedrooms, config.bathrooms, config.balconyCount, config.storageCount, config.carpetCount, v)})} />
                        </div>
                    </div>
                </div>
                {/* Sticky Footer */}
                <div className="p-5 bg-slate-50 border-t border-gray-100/90 z-10 flex flex-col gap-3 rounded-b-[2rem] shrink-0 shadow-xs">
                    <div className="flex justify-between items-center px-1">
                        <span className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">{t('consultation.estimatedTotal')}</span>
                        <span className="font-black text-2xl text-[#007bff]">CHF {getEstimatedPrice().toFixed(2)}</span>
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] hover:bg-blue-600 active:scale-[0.98] text-white py-4 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all uppercase tracking-wider">
                        {editingItemId ? t('consultation.label.updateService') : t('consultation.label.addServiceWithDetails', { duration: formatTotalHours(getActiveTotalHours()), price: getEstimatedPrice().toFixed(2) })}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Daily/Recurring Cleaning (With detailed sub-menus) */}
        {activeModal === 'daily-cleaning' && false && (
            <ModalOverlay title={t('services.dailyCleaning.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }} noScroll={true}>
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <button onClick={() => setShowInclusionsModal('daily-cleaning')} className="w-full text-center text-[#007bff] text-xs font-black hover:underline flex items-center justify-center gap-2.5 bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"><InfoIcon className="w-5 h-5" />{t('consultation.whatsIncluded')}</button>
                    
                    {config.bedrooms === 0 && config.bathrooms === 0 && (config.ironing || config.laundry || config.oven || config.cabinets || config.fridge || config.windowCount > 0) && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4 animate-fade-in">
                            <p className="text-[10px] text-amber-800 font-bold flex items-center gap-2">
                                <InfoIcon className="w-4 h-4" /> {t('consultation.label.callOutWarning', { price: PRICES.baseCallOut.toFixed(2) })}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.label.frequency')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Daily', 'Weekly', 'Bi-Weekly', 'Every 4 Weeks', 'More Frequently'].map(f => {
                                let freqTitle = f;
                                if (f === 'Daily') freqTitle = t('frequency.Daily', 'Daily');
                                else if (f === 'Weekly') freqTitle = t('frequency.Weekly', 'Weekly');
                                else if (f === 'Bi-Weekly') freqTitle = t('frequency.Bi-Weekly', 'Bi-Weekly');
                                else if (f === 'Every 4 Weeks') freqTitle = t('frequency.Every 4 Weeks', 'Every 4 Weeks');
                                else if (f === 'More Frequently') freqTitle = t('frequency.More Frequently', 'More Frequently');

                                return (
                                    <OptionCard key={f} icon="🗓️" title={freqTitle} selected={config.frequency === f} onClick={() => setConfig({...config, frequency: f})} />
                                );
                            })}
                        </div>
                    </div>

                    <div className="animate-fade-in">
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('consultation.label.preferredRecurrence')}</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Wednesdays, or Tuesdays & Fridays..." 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] text-sm font-medium text-gray-700"
                            value={config.frequencyDetails || ''}
                            onChange={(e) => setConfig({...config, frequencyDetails: e.target.value})}
                        />
                    </div>

                    <OptionCard 
                        icon="👤" 
                        title={mt('Same Operative', 'Mismo Operario', 'Gleiche Reinigungskraft', 'Même intervenant', 'Stesso operatore', 'Mesmo operário')} 
                        description={mt('Dedicated cleaner for every visit', 'Limpiador dedicado para cada visita', 'Feste Reinigungskraft für jeden Besuch', 'Agent dédié à chaque visite', 'Addetto dedicato per ogni visita', 'Limpeza dedicada para cada visita')} 
                        selected={config.sameOperative} 
                        onClick={() => setConfig({...config, sameOperative: !config.sameOperative})} 
                    />

                    <div className="space-y-4">
                        <CounterCard icon="🛌" label={t('consultation.label.beds')} value={config.bedrooms} onChange={(v) => setConfig({ ...config, bedrooms: v, duration: calculateCleaningDuration('daily-cleaning', v, config.bathrooms) })} />
                        <CounterCard icon="🚿" label={t('consultation.label.baths')} value={config.bathrooms} onChange={(v) => setConfig({ ...config, bathrooms: v, duration: calculateCleaningDuration('daily-cleaning', config.bedrooms, v) })} />
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between mb-2"><label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2"><ClockIcon className="w-4 h-4 text-[#007bff]" />{mt('Duration', 'Duración', 'Dauer', 'Durée', 'Durata', 'Duração')}</label><span className="font-black text-[#007bff] text-lg">{formatTotalHours(getActiveTotalHours())}</span></div>
                        <input type="range" min="2.5" max="24" step="0.5" value={getActiveTotalHours()} onChange={(e) => setConfig({ ...config, duration: parseFloat(e.target.value) })} className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007bff]" />
                        <p className="text-[10px] text-gray-400 text-center mt-2 font-medium italic">{t('consultation.label.estimatedDurationDesc', 'Duration bar includes all selected extra tasks.')}</p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">{t('consultation.label.extras')}</label>
                        
                        {/* 1. Ironing Service */}
                        <div className="space-y-3">
                            <OptionCard icon="👔" title={t('consultation.label.ironingService', 'Ironing Service')} description={t('consultation.label.ironingServiceDesc', 'Add ironing to your routine')} selected={config.ironing} onClick={() => setConfig({...config, ironing: !config.ironing})} isExtra={true} />
                            {config.ironing && (
                                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in">
                                    <CounterCard icon="⏰" label={t('consultation.label.manualIncrease')} value={config.ironingHours} step={0.5} onChange={(v) => setConfig({...config, ironingHours: v})} min={0.5} />
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">{t('consultation.label.instructions', 'Instructions')}</label>
                                    <textarea placeholder="e.g., Shirts on hangers, linens folded..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.ironingNotes} onChange={(e) => setConfig({...config, ironingNotes: e.target.value})}></textarea></div>
                                </div>
                            )}
                        </div>

                        {/* 2. Laundry Service */}
                        <div className="space-y-3">
                            <OptionCard icon="🧺" title={t('consultation.label.laundryService', 'Laundry Service')} description={t('consultation.label.laundryServiceDesc', 'Wash, Dry, or Both')} selected={config.laundry} onClick={() => setConfig({...config, laundry: !config.laundry})} isExtra={true} />
                            {config.laundry && (
                                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in">
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-3">{t('consultation.label.serviceType', 'Service Type')}</label>
                                    <div className="grid grid-cols-3 gap-2">{['Wash Only', 'Dry Only', 'Wash & Dry'].map(ty => {
                                        let lType = ty;
                                        if (ty === 'Wash Only') lType = t('laundry.Wash Only', 'Wash Only');
                                        else if (ty === 'Dry Only') lType = t('laundry.Dry Only', 'Dry Only');
                                        else if (ty === 'Wash & Dry') lType = t('laundry.Wash & Dry', 'Wash & Dry');
                                        return (
                                            <button key={ty} onClick={() => setConfig({...config, laundryType: ty})} className={`p-2 rounded-lg text-[10px] font-bold border-2 transition-all ${config.laundryType === ty ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500'}`}>{lType}</button>
                                        );
                                    })}</div></div>
                                    <CounterCard icon="👕" label={t('consultation.label.clothesCount', 'Number of Clothes')} subLabel={t('consultation.label.clothesCountDesc', 'Approximate items or loads')} value={config.laundryItems} onChange={(v) => setConfig({...config, laundryItems: v})} />
                                    <CounterCard icon="⏰" label={t('consultation.label.manualIncrease')} value={config.laundryHours} step={1} onChange={(v) => setConfig({...config, laundryHours: v})} min={1} />
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">{t('consultation.label.fabricMethod', 'Fabric & Washing Method')}</label>
                                    <textarea placeholder="e.g., Cotton shirts cold wash, delicates air dry..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.laundryNotes} onChange={(e) => setConfig({...config, laundryNotes: e.target.value})}></textarea></div>
                                </div>
                            )}
                        </div>

                        {/* 3. Oven Cleaning */}
                        <div className="space-y-3">
                            <OptionCard icon="🍳" title={t('consultation.label.ovenCleaning', 'Oven Cleaning')} description={t('consultation.label.ovenCleaningDesc', 'Deep clean inside and out')} selected={config.oven} onClick={() => setConfig({...config, oven: !config.oven})} isExtra={true} />
                            {config.oven && (
                                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in">
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-3">{t('consultation.label.greaseLevel', 'Grease Level')}</label>
                                    <div className="grid grid-cols-3 gap-2">{['Low', 'Medium', 'High'].map(l => {
                                        let greaseLabel = l;
                                        if (l === 'Low') greaseLabel = t('grease.Low', 'Low');
                                        else if (l === 'Medium') greaseLabel = t('grease.Medium', 'Medium');
                                        else if (l === 'High') greaseLabel = t('grease.High', 'High');
                                        return (
                                            <button key={l} onClick={() => setConfig({...config, ovenGrease: l})} className={`p-2 rounded-lg text-[10px] font-bold border-2 transition-all ${config.ovenGrease === l ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500'}`}>{greaseLabel}</button>
                                        );
                                    })}</div><p className="text-[9px] text-gray-400 mt-2 italic">{t('consultation.label.ovenGreaseDesc', 'Duration adjusts based on grease: Low (30m), Medium (40m), High (50m).')}</p></div>
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">{t('consultation.label.instructions', 'Instructions')}</label>
                                    <textarea placeholder="e.g., Double oven, brand details..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.ovenNotes} onChange={(e) => setConfig({...config, ovenNotes: e.target.value})}></textarea></div>
                                </div>
                            )}
                        </div>

                        {/* 4. Cabinet Cleaning */}
                        <div className="space-y-3">
                            <OptionCard icon="🚪" title={t('consultation.label.cabinetCleaning', 'Cabinet Cleaning')} description={t('consultation.slice.cabinetCleaningDesc', 'Interior cleaning & organizing')} selected={config.cabinets} onClick={() => setConfig({...config, cabinets: !config.cabinets})} isExtra={true} />
                            {config.cabinets && (
                                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in">
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-3">{t('consultation.label.condition', 'Condition')}</label>
                                    <div className="grid grid-cols-2 gap-2">{['Empty', 'With Items'].map(c => {
                                        let condLabel = c;
                                        if (c === 'Empty') condLabel = t('condition.Empty', 'Empty');
                                        else if (c === 'With Items') condLabel = t('condition.With Items', 'With Items');
                                        return (
                                            <button key={c} onClick={() => setConfig({...config, cabinetCondition: c})} className={`p-2 rounded-lg text-[10px] font-bold border-2 transition-all ${config.cabinetCondition === c ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500'}`}>{condLabel}</button>
                                        );
                                    })}</div></div>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                        <div className="flex flex-col"><span className="text-xs font-bold text-gray-800">{t('consultation.label.organizeItems', 'Remove & Organize Items')}</span><span className="text-[9px] text-gray-400">{t('consultation.label.organizeItemsDesc', 'Increases time (+30m)')}</span></div>
                                        <button onClick={() => setConfig({...config, cabinetOrganize: !config.cabinetOrganize})} className={`w-10 h-5 rounded-full relative transition-colors ${config.cabinetOrganize ? 'bg-[#007bff]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.cabinetOrganize ? 'translate-x-5' : 'translate-x-0'}`}></div></button>
                                    </div>
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">{t('consultation.label.instructions', 'Instructions')}</label>
                                    <textarea placeholder="e.g., Kitchen upper cabinets only..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.cabinetNotes} onChange={(e) => setConfig({...config, cabinetNotes: e.target.value})}></textarea></div>
                                </div>
                            )}
                        </div>

                        {/* 5. Fridge Cleaning */}
                        <div className="space-y-3">
                            <OptionCard icon="❄️" title={t('consultation.label.fridgeCleaning', 'Fridge Cleaning')} description={t('consultation.label.fridgeCleaningDesc', 'Hygiene & Organization')} selected={config.fridge} onClick={() => setConfig({...config, fridge: !config.fridge})} isExtra={true} />
                            {config.fridge && (
                                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in">
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-3">{t('consultation.label.condition', 'Condition')}</label>
                                    <div className="grid grid-cols-2 gap-2">{['Empty', 'With Items'].map(c => {
                                        let condLabel = c;
                                        if (c === 'Empty') condLabel = t('condition.Empty', 'Empty');
                                        else if (c === 'With Items') condLabel = t('condition.With Items', 'With Items');
                                        return (
                                            <button key={c} onClick={() => setConfig({...config, fridgeCondition: c})} className={`p-2 rounded-lg text-[10px] font-bold border-2 transition-all ${config.fridgeCondition === c ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500'}`}>{condLabel}</button>
                                        );
                                    })}</div></div>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                        <div className="flex flex-col"><span className="text-xs font-bold text-gray-800">{t('consultation.label.organizeItems', 'Remove & Organize Items')}</span><span className="text-[9px] text-gray-400">{t('consultation.label.organizeItemsDesc', 'Increases time (+30m)')}</span></div>
                                        <button onClick={() => setConfig({...config, fridgeOrganize: !config.fridgeOrganize})} className={`w-10 h-5 rounded-full relative transition-colors ${config.fridgeOrganize ? 'bg-[#007bff]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.fridgeOrganize ? 'translate-x-5' : 'translate-x-0'}`}></div></button>
                                    </div>
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">{t('consultation.label.instructions', 'Instructions')}</label>
                                    <textarea placeholder="e.g., Freezer defrosting needed..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.fridgeNotes} onChange={(e) => setConfig({...config, fridgeNotes: e.target.value})}></textarea></div>
                                </div>
                            )}
                        </div>

                        <CounterCard 
                            icon="🪟" 
                            label={t('consultation.label.windowCleaning')} 
                            subLabel={t('consultation.label.windowCleaningSub', 'Interior & accessible outside (+3m/window)')} 
                            value={config.windowCount || 0} 
                            onChange={(v) => setConfig({...config, windowCount: v})} 
                        />
                    </div>
                </div>
                {/* Sticky Footer */}
                <div className="p-5 bg-slate-50 border-t border-gray-100/90 z-10 flex flex-col gap-3 rounded-b-[2rem] shrink-0 shadow-xs">
                    <div className="flex justify-between items-center px-1">
                        <span className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">{t('consultation.estimatedTotal')}</span>
                        <span className="font-black text-2xl text-[#007bff]">CHF {getEstimatedPrice().toFixed(2)}</span>
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] hover:bg-blue-600 active:scale-[0.98] text-white py-4 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all uppercase tracking-wider">
                        {editingItemId ? t('consultation.label.updateService') : t('consultation.label.addServiceWithDetails', { duration: formatTotalHours(getActiveTotalHours()), price: getEstimatedPrice().toFixed(2) })}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Furniture Moving */}
        {activeModal === 'moving' && false && (() => {
            const laborMap: Record<number, number> = { 1: 60, 2: 120, 3: 175, 4: 225 };
            const movers = config.moversCount || 2;
            const laborRate = laborMap[movers] || (225 + (movers - 4) * 50);
            const gasInfo = calculateGasolineAndDistance(config.fromZip || '', config.toZip || '');
            const duration = config.duration || 1;
            const laborCost = duration * laborRate;
            const gasCost = gasInfo.cost || 0;
            
            const stairFeeFrom = getStairSurcharge(config.floorFrom, config.accessFrom, movers);
            const stairFeeTo = getStairSurcharge(config.floorTo, config.accessTo, movers);
            const totalStairFee = stairFeeFrom + stairFeeTo;

            let extrasTotal = 0;
            if (config.assembly) extrasTotal += (config.assemblyHours || 1) * 80;
            if (config.hydraulicLift) extrasTotal += (config.hydraulicLiftHours || 1) * 150;
            if (config.packaging) extrasTotal += 45;
            extrasTotal += totalStairFee;
            
            const estimatedTotal = laborCost + gasCost + extrasTotal;

            const isValidZip = (zip: string) => {
                if (!zip) return false;
                const z = zip.trim().substring(0, 2);
                return ['80', '81', '82', '83', '84', '86'].includes(z);
            };

            const isFromZipValid = isValidZip(config.fromZip || '');
            const isToZipValid = isValidZip(config.toZip || '');

            return (
                <ModalOverlay title={t('services.movingFurniture.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }} size="lg" noScroll={true}>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
                        <button 
                            type="button"
                            onClick={() => setShowMovingInfo(true)}
                            className="w-full flex items-center justify-center gap-3 p-4 bg-blue-50/40 border border-blue-100 rounded-[2rem] hover:bg-blue-50 transition-all group animate-fade-in"
                        >
                            <InfoIcon className="w-5 h-5 text-[#007bff]" />
                            <span className="text-sm font-black text-[#007bff] tracking-tight">How our moving service works?</span>
                        </button>

                        {/* What are we moving? */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">¿Qué vamos a trasladar? / Move Type</label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {[
                                    {id: 'Home Contents', label: 'Hogar', icon: '🏠'},
                                    {id: 'Office', label: 'Oficina', icon: '🏢'},
                                    {id: 'Commercial', label: 'Comercio', icon: '🏬'},
                                    {id: 'Single Item', label: 'Artículo único', icon: '📦'},
                                    {id: 'Specialty', label: 'Especial', icon: '💎'}
                                ].map(m => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => setConfig({...config, moveType: m.id})}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${config.moveType === m.id ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50'}`}
                                    >
                                        <span className="text-2xl mb-1">{m.icon}</span>
                                        <span className="text-[10px] font-black leading-tight">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Crew & Tariff Rate */}
                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100/80 space-y-3">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                👥 EQUIPO Y TARIFA / CREW COST
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    {count: 1, label: '1 mozo', rate: '60 CHF/h', desc: 'Pequeñas mudanzas'},
                                    {count: 2, label: '2 mozos', rate: '120 CHF/h', desc: 'Piso o casa estándar'},
                                    {count: 3, label: '3 mozos', rate: '175 CHF/h', desc: 'Mudanzas medianas'},
                                    {count: 4, label: '4 mozos', rate: '225 CHF/h', desc: 'Casas u oficinas grandes'}
                                ].map(opt => (
                                    <button
                                        key={opt.count}
                                        type="button"
                                        onClick={() => setConfig({...config, moversCount: opt.count, serviceLevel: opt.count === 1 ? 'Standard' : opt.count === 2 ? 'Standard' : opt.count === 3 ? 'Large' : 'Commercial'})}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${config.moversCount === opt.count ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100/60 hover:bg-slate-100/50 text-slate-800'}`}
                                    >
                                        <span className="text-sm font-extrabold">{opt.label}</span>
                                        <span className={`text-xs font-black my-0.5 ${config.moversCount === opt.count ? 'text-white' : 'text-[#007bff]'}`}>{opt.rate}</span>
                                        <span className={`text-[9px] ${config.moversCount === opt.count ? 'text-blue-100' : 'text-slate-400'}`}>{opt.desc}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Custom helpers count input */}
                            <div className="pt-2">
                                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-150">
                                    <span className="text-xs font-bold text-slate-400">¿Quieres añadir más ayudantes?</span>
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button 
                                            type="button"
                                            disabled={movers <= 1}
                                            onClick={() => setConfig({...config, moversCount: Math.max(1, movers - 1)})}
                                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-black disabled:opacity-40"
                                        >-</button>
                                        <span className="w-8 font-black text-center text-sm">{movers}</span>
                                        <button 
                                            type="button"
                                            disabled={movers >= 10}
                                            onClick={() => setConfig({...config, moversCount: Math.min(10, movers + 1)})}
                                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-black disabled:opacity-40"
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Estimated Duration adjustment (minimum 1h) */}
                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <ClockIcon className="w-4 h-4 text-blue-600" />
                                DURACIÓN ESTIMADA / ESTIMATED DURATION
                            </label>
                            
                            {/* Quick buttons */}
                            <div className="flex flex-wrap gap-2">
                                {[1, 1.5, 2, 3, 4, 5, 6].map(h => (
                                    <button 
                                        key={h}
                                        type="button"
                                        onClick={() => setConfig({...config, duration: h})}
                                        className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all border ${config.duration === h ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/60'}`}
                                    >
                                        {h}h
                                    </button>
                                ))}
                            </div>

                            {/* Manual input */}
                            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-150">
                                <span className="text-xs text-slate-400 font-bold">O introduce horas exactas:</span>
                                <input 
                                    type="number"
                                    step="0.5"
                                    min="1"
                                    value={config.duration || 1}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setConfig({...config, duration: isNaN(val) ? 1 : Math.max(1, val)});
                                    }}
                                    className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-center text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Origin and Destination Address details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Source location */}
                            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-3">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    📍 {mt('Origin (Starting)', 'Origen (Punto de Inicio)', 'Startort (Auszug)')}
                                </label>
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        placeholder={mt('Full Address (Street, House No.)', 'Dirección completa (Calle, nº)', 'Genaue Adresse (Strasse, Nr.)')}
                                        value={config.fromAddress || ''} 
                                        onChange={(e) => setConfig({...config, fromAddress: e.target.value})}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-semibold text-slate-700"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input 
                                            type="text" 
                                            placeholder={mt('ZIP (e.g. 8000)', 'Código Postal (ej. 8000)', 'PLZ (z. B. 8000)')}
                                            value={config.fromZip || ''} 
                                            onChange={(e) => setConfig({...config, fromZip: e.target.value})}
                                            className={`w-full p-3 bg-white border rounded-xl outline-none text-sm font-bold font-mono ${config.fromZip && !isFromZipValid ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-slate-200'}`}
                                        />
                                        <select
                                            value={config.floorFrom || '0'}
                                            onChange={(e) => setConfig({...config, floorFrom: e.target.value})}
                                            className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-semibold"
                                        >
                                            <option value="Basement">{mt('Basement', 'Sótano', 'Keller')}</option>
                                            <option value="0">{mt('Ground floor', 'Planta baja', 'Erdgeschoss')}</option>
                                            <option value="1">{mt('1st Floor', '1ª Planta', '1. Stock')}</option>
                                            <option value="2">{mt('2nd Floor', '2ª Planta', '2. Stock')}</option>
                                            <option value="3">{mt('3rd Floor', '3ª Planta', '3. Stock')}</option>
                                            <option value="4">{mt('4th Floor', '4ª Planta', '4. Stock')}</option>
                                            <option value="5">{mt('5th Floor', '5ª Planta', '5. Stock')}</option>
                                            <option value="6+">{mt('6th Floor+', '6ª Planta o más', '6. Stock+')}</option>
                                        </select>
                                    </div>
                                    <select
                                        value={config.accessFrom || 'Lift'}
                                        onChange={(e) => setConfig({...config, accessFrom: e.target.value})}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-semibold"
                                    >
                                        <option value="Lift">{mt('With Elevator', 'Con Ascensor', 'Mit Lift')}</option>
                                        <option value="Stairs">{mt('Only Stairs', 'Solo Escaleras', 'Nur Treppe')}</option>
                                    </select>
                                    {config.fromZip && !isFromZipValid && (
                                        <p className="text-[10px] text-amber-600 font-extrabold leading-tight">
                                            {mt('Supported: Zürich (80xx/81xx/83xx/86xx), Schaffhausen (82xx), Winterthur (84xx).', 'Soportado: Zúrich (80xx/81xx/83xx/86xx), Schaffhausen (82xx), Winterthur (84xx).', 'Unterstützt: Zürich (80xx/81xx/83xx/86xx), Schaffhausen (82xx), Winterthur (84xx).')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Target location */}
                            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-3">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    🏁 {mt('Destination (Target)', 'Destino (Punto de Entrega)', 'Zielort (Einzug)')}
                                </label>
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        placeholder={mt('Full Address (Street, House No.)', 'Dirección completa (Calle, nº)', 'Genaue Adresse (Strasse, Nr.)')}
                                        value={config.toAddress || ''} 
                                        onChange={(e) => setConfig({...config, toAddress: e.target.value})}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-semibold text-slate-700"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input 
                                            type="text" 
                                            placeholder={mt('ZIP (e.g. 8400)', 'Código Postal (ej. 8400)', 'PLZ (z. B. 8400)')}
                                            value={config.toZip || ''} 
                                            onChange={(e) => setConfig({...config, toZip: e.target.value})}
                                            className={`w-full p-3 bg-white border rounded-xl outline-none text-sm font-bold font-mono ${config.toZip && !isToZipValid ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-slate-200'}`}
                                        />
                                        <select
                                            value={config.floorTo || '0'}
                                            onChange={(e) => setConfig({...config, floorTo: e.target.value})}
                                            className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-semibold"
                                        >
                                            <option value="Basement">{mt('Basement', 'Sótano', 'Keller')}</option>
                                            <option value="0">{mt('Ground floor', 'Planta baja', 'Erdgeschoss')}</option>
                                            <option value="1">{mt('1st Floor', '1ª Planta', '1. Stock')}</option>
                                            <option value="2">{mt('2nd Floor', '2ª Planta', '2. Stock')}</option>
                                            <option value="3">{mt('3rd Floor', '3ª Planta', '3. Stock')}</option>
                                            <option value="4">{mt('4th Floor', '4ª Planta', '4. Stock')}</option>
                                            <option value="5">{mt('5th Floor', '5ª Planta', '5. Stock')}</option>
                                            <option value="6+">{mt('6th Floor+', '6ª Planta o más', '6. Stock+')}</option>
                                        </select>
                                    </div>
                                    <select
                                        value={config.accessTo || 'Lift'}
                                        onChange={(e) => setConfig({...config, accessTo: e.target.value})}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-semibold"
                                    >
                                        <option value="Lift">{mt('With Elevator', 'Con Ascensor', 'Mit Lift')}</option>
                                        <option value="Stairs">{mt('Only Stairs', 'Solo Escaleras', 'Nur Treppe')}</option>
                                    </select>
                                    {config.toZip && !isToZipValid && (
                                        <p className="text-[10px] text-amber-600 font-extrabold leading-tight">
                                            {mt('Supported: Zürich (80xx/81xx/83xx/86xx), Schaffhausen (82xx), Winterthur (84xx).', 'Soportado: Zúrich (80xx/81xx/83xx/86xx), Schaffhausen (82xx), Winterthur (84xx).', 'Unterstützt: Zürich (80xx/81xx/83xx/86xx), Schaffhausen (82xx), Winterthur (84xx).')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Services with Toggle: Montaje, Ascensor, Embalaje */}
                        <div className="space-y-3">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                🛠️ {mt('ADDITIONAL SERVICES / EXTRAS', 'SERVICIOS ADICIONALES / EXTRAS', 'ZUSATZLEISTUNGEN / EXTRAS')}
                            </label>
                            
                            {/* Montaje / Desmontaje */}
                            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all animate-fade-in">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl mt-0.5">🔧</span>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-850">
                                            {mt('Furniture Assembly / Disassembly', 'Montaje y desmontaje de muebles', 'Möbelmontage & -demontage')}
                                        </h4>
                                        <p className="text-xs text-slate-400">
                                            {mt('Beds, desks, wardrobes', 'Camas, escritorios, armarios', 'Betten, Schreibtische, Schränke')}
                                        </p>
                                        {config.assembly && (
                                            <div className="mt-2 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-150">
                                                <span className="text-xs font-semibold text-slate-500">
                                                    {mt('Hours:', 'Horas:', 'Stunden:')}
                                                </span>
                                                <input 
                                                    type="number"
                                                    step="0.5"
                                                    min="0.5"
                                                    value={config.assemblyHours || 1}
                                                    onChange={(e) => {
                                                        const val = parseFloat(e.target.value);
                                                        setConfig({...config, assemblyHours: isNaN(val) ? 1 : Math.max(0.5, val)});
                                                    }}
                                                    className="w-16 p-1 bg-white border border-slate-200 rounded-lg text-center text-xs font-bold font-mono outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-slate-600">80 CHF/h</span>
                                    <button 
                                        type="button"
                                        onClick={() => setConfig({...config, assembly: !config.assembly, assemblyHours: config.assemblyHours ? config.assemblyHours : 1})} 
                                        className={`w-10 h-5 rounded-full relative transition-colors ${config.assembly ? 'bg-blue-600' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.assembly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            </div>

                            {/* Ascensor hidráulico */}
                            <div className="flex flex-col p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all space-y-3 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl mt-0.5">🏗️</span>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-850">
                                                {mt('Hydraulic Lift Rental', 'Ascensor hidráulico', 'Möbellift / Fassadenlift')}
                                            </h4>
                                            <p className="text-xs text-slate-400 font-medium">
                                                {mt('Bulky furniture to high floors', 'Muebles voluminosos a pisos altos', 'Sperrige Möbel in hohe Etagen')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-slate-600">150 CHF/h</span>
                                        <button 
                                            type="button"
                                            onClick={() => setConfig({...config, hydraulicLift: !config.hydraulicLift, hydraulicLiftHours: config.hydraulicLiftHours ? config.hydraulicLiftHours : 1})} 
                                            className={`w-10 h-5 rounded-full relative transition-colors ${config.hydraulicLift ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.hydraulicLift ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                </div>
                                {config.hydraulicLift && (
                                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-150 w-full justify-between animate-fade-in">
                                        <span className="text-xs font-semibold text-slate-500">
                                            {mt('Hours required:', 'Horas requeridas:', 'Benötigte Stunden:')}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                type="button"
                                                onClick={() => setConfig({...config, hydraulicLiftHours: Math.max(0.5, (config.hydraulicLiftHours || 1) - 0.5)})}
                                                className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 font-extrabold text-[#007bff] flex items-center justify-center text-xs"
                                            >-</button>
                                            <input 
                                                type="number"
                                                step="0.5"
                                                min="0.5"
                                                value={config.hydraulicLiftHours || 1}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    setConfig({...config, hydraulicLiftHours: isNaN(val) ? 1 : Math.max(0.5, val)});
                                                }}
                                                className="w-16 p-1 bg-white border border-slate-200 rounded-lg text-center text-xs font-bold font-mono outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setConfig({...config, hydraulicLiftHours: (config.hydraulicLiftHours || 1) + 0.5})}
                                                className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 font-extrabold text-[#007bff] flex items-center justify-center text-xs"
                                            >+</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Material de Embalaje */}
                            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all animate-fade-in">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl mt-0.5">📦</span>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-850">
                                            {mt('Packaging Materials', 'Materiales de embalaje', 'Verpackungsmaterialien')}
                                        </h4>
                                        <p className="text-xs text-slate-400">
                                            {mt('Boxes, bubble wrap, stretch film', 'Cajas, papel burbuja, film', 'Kartons, Blasenfolie, Stretchfolie')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-slate-600">45 CHF</span>
                                    <button 
                                        type="button"
                                        onClick={() => setConfig({...config, packaging: !config.packaging})} 
                                        className={`w-10 h-5 rounded-full relative transition-colors ${config.packaging ? 'bg-blue-600' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.packaging ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Special description */}
                        <div className="space-y-1">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest text-[10px]">
                                {mt('Inventory Details / Special Instructions', 'Detalles del inventario / Instrucciones especiales', 'Details zum Umzugsgut / Spezialanweisungen')}
                            </label>
                            <textarea 
                                placeholder={mt('e.g. 3-bedroom apartment, couch, fridge, 10 large boxes...', 'ej. departamento de 3 habitaciones, sofá, refrigerador, 10 cajas grandes...', 'z.B. 3-Zimmer-Wohnung, Sofa, Kühlschrank, 10 grosse Kartons...')}
                                value={config.description || ''} 
                                onChange={(e) => setConfig({...config, description: e.target.value})}
                                className="w-full p-4 bg-gray-50 border border-slate-150 rounded-2xl outline-none focus:ring-1 focus:ring-[#007bff] text-sm font-semibold max-h-[100px]"
                            />
                        </div>

                        {/* DESGLOSE DEL PRESUPUESTO */}
                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3 animate-fade-in">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                📋 {mt('BUDGET BREAKDOWN', 'DESGLOSE DEL PRESUPUESTO', 'OFFERTEN-AUFSCHLÜSSELUNG')}
                            </label>
                            
                            {/* Labor cost */}
                            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-700">
                                <span className="text-slate-500">
                                    {mt('Labor', 'Mano de obra', 'Arbeitskraft')} ({duration}h × {laborRate} CHF/h)
                                </span>
                                <span className="font-extrabold text-slate-900">
                                    {laborCost.toFixed(2)} CHF
                                </span>
                            </div>

                            {/* Gasoline cost */}
                            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-700">
                                <span className="text-slate-500">
                                    {mt('Gasoline', 'Automóvil / Gasolina', 'Triebstoff')} ({gasInfo.distance > 0 ? `${gasInfo.distance.toFixed(1)} km (${mt('round trip', 'ida y vuelta', 'Hin- und Rückfahrt')})` : '—'}) x 0.15 CHF/km
                                </span>
                                <span className="font-extrabold text-slate-900 font-mono">
                                    {gasInfo.distance > 0 ? `${gasInfo.cost.toFixed(2)} CHF` : '— CHF'}
                                </span>
                            </div>

                            {/* Assembly extra */}
                            {config.assembly && (
                                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-700">
                                    <span className="text-slate-500">{mt('Furniture Assembly', 'Montaje de muebles', 'Möbelmontage')} ({config.assemblyHours || 1}h × 80 CHF/h)</span>
                                    <span className="font-extrabold text-slate-900 font-mono">
                                        {((config.assemblyHours || 1) * 80).toFixed(2)} CHF
                                    </span>
                                </div>
                            )}

                            {/* Lift extra */}
                            {config.hydraulicLift && (
                                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-700">
                                    <span className="text-slate-500 font-medium">🏗️ {mt('Hydraulic Lift Rental', 'Ascensor hidráulico', 'Möbellift / Fassadenlift')} ({config.hydraulicLiftHours || 1}h × 150 CHF/h)</span>
                                    <span className="font-extrabold text-slate-900 font-mono">
                                        {((config.hydraulicLiftHours || 1) * 150).toFixed(2)} CHF
                                    </span>
                                </div>
                            )}

                            {/* Packaging extra */}
                            {config.packaging && (
                                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-700">
                                    <span className="text-slate-500 font-medium">📦 {mt('Packaging Materials', 'Materiales de embalaje', 'Verpackungsmaterialien')} ({mt('Flat Rate', 'Tarifa Plana', 'Flatrate')})</span>
                                    <span className="font-extrabold text-slate-900 font-mono">45.00 CHF</span>
                                </div>
                            )}

                            {/* Stair carry surcharge (Origin) */}
                            {stairFeeFrom > 0 && (
                                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-amber-700 animate-fade-in bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                                    <span className="font-medium">🚶‍♂️ {mt('Stairs Carry Charge (Origin)', 'Recargo por escaleras (Origen)', 'Trageaufwand Treppen (Auszug)')} ({config.floorFrom === 'Basement' ? mt('Basement', 'Sótano', 'Keller') : `${config.floorFrom}. ${mt('Floor', 'Piso', 'Stock')}`})</span>
                                    <span className="font-extrabold font-mono">
                                        {stairFeeFrom.toFixed(2)} CHF
                                    </span>
                                </div>
                            )}

                            {/* Stair carry surcharge (Destination) */}
                            {stairFeeTo > 0 && (
                                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-amber-700 animate-fade-in bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                                    <span className="font-medium">🚶‍♂️ {mt('Stairs Carry Charge (Destination)', 'Recargo por escaleras (Destino)', 'Trageaufwand Treppen (Einzug)')} ({config.floorTo === 'Basement' ? mt('Basement', 'Sótano', 'Keller') : `${config.floorTo}. ${mt('Floor', 'Piso', 'Stock')}`})</span>
                                    <span className="font-extrabold font-mono">
                                        {stairFeeTo.toFixed(2)} CHF
                                    </span>
                                </div>
                            )}

                        </div>
                    </div>
                    {/* Sticky Footer */}
                    <div className="p-5 bg-slate-50 border-t border-gray-100/90 z-10 flex flex-col gap-3 rounded-b-[2rem] shrink-0 shadow-xs">
                        <div className="flex justify-between items-center px-1">
                            <span className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">{mt('Estimated Total', 'Estimado Total', 'Total Schätzung')}</span>
                            <span className="font-black text-2xl text-[#007bff]">CHF {estimatedTotal.toFixed(2)}</span>
                        </div>
                        <button 
                            type="button"
                            onClick={() => {
                                const isFromValid = isFromZipValid;
                                const isToValid = isToZipValid;
                                if (!isFromValid || !isToValid) {
                                    alert(mt('Please select valid ZIP codes for Zürich, Schaffhausen or Winterthur.', 'Por favor, seleccione códigos postales válidos para Zúrich, Schaffhausen o Winterthur.', 'Bitte wählen Sie gültige Postleitzahlen für Zürich, Schaffhausen oder Winterthur aus.'));
                                    return;
                                }
                                handleAddToCart();
                            }}
                            className="w-full bg-[#007bff] hover:bg-blue-600 active:scale-[0.98] text-[#ffffff] py-4 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all uppercase tracking-wider"
                        >
                            {editingItemId ? mt('Update Service', 'Actualizar Servicio', 'Service aktualisieren') : `${mt('Add to Cart', 'Añadir al Carrito', 'In den Warenkorb')} (CHF ${estimatedTotal.toFixed(2)})`}
                        </button>
                    </div>
                </ModalOverlay>
            );
        })()}

        {/* MODAL: Moving Info Pop-up */}
        {showMovingInfo && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-fade-in-up">
                    <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2.5 rounded-2xl">
                                <InfoIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-[#002D5B] uppercase tracking-tight">
                                {mt('Moving Process', 'Proceso de Mudanza', 'Umzugsablauf')}
                            </h3>
                        </div>
                        <button onClick={() => setShowMovingInfo(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                            <XMarkIcon className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </button>
                    </div>
                    
                    <div className="px-8 py-6 space-y-6">
                        <div className="flex gap-5">
                            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-blue-600 font-black text-lg">1</div>
                            <div className="space-y-1">
                                <h4 className="font-black text-gray-800 text-sm uppercase tracking-wider">
                                    {mt('Storage & Lift Constraints', 'Restricciones de espacio y ascensor', 'Einschränkungen für Lift & Transport')}
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    {mt(
                                        'If the lift interior is too narrow for specific items, our team will utilize the staircase. For safety, this may require additional movers to manage the weight and dimensions properly.',
                                        'Si el interior del ascensor es demasiado estrecho para ciertos objetos, nuestro equipo utilizará las escaleras. Por seguridad, esto puede requerir operarios adicionales para gestionar el peso y las dimensiones de forma adecuada.',
                                        'Falls der Aufzug für bestimmte Gegenstände zu eng ist, nutzt unser Team das Treppenhaus. Aus Sicherheitsgründen kann dies zusätzliche Umzugshelfer erfordern, um Gewicht und Maße sicher zu bewältigen.'
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-emerald-600 font-black text-lg">2</div>
                            <div className="space-y-1">
                                <h4 className="font-black text-gray-800 text-sm uppercase tracking-wider">
                                    {mt('Surface Protection', 'Protección de superficies', 'Oberflächenschutz')}
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    {mt(
                                        'We guarantee that all delicate surfaces, floors, and furniture corners will be protected using high-quality padding and blankets to prevent any scratches during transit.',
                                        'Garantizamos que todas las superficies delicadas, suelos y esquinas de muebles estarán protegidos con acolchados y mantas de alta calidad para evitar cualquier arañazo durante el trayecto.',
                                        'Wir garantieren, dass alle empfindlichen Oberflächen, Böden und Möbelkanten mit hochwertigen Polstern und Decken geschützt werden, um Kratzer beim Transport zu vermeiden.'
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-10 h-10 bg-amber-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-amber-600 font-black text-lg">3</div>
                            <div className="space-y-1">
                                <h4 className="font-black text-gray-800 text-sm uppercase tracking-wider">
                                    {mt('Hydraulic Lift Necessity', 'Necesidad de ascensor hidráulico', 'Bedarf an Möbellift / Fassadenlift')}
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    {mt(
                                        'For oversized pieces that cannot safely travel via stairs or lifts, a hydraulic external lift may be necessary to facilitate delivery through large windows or balconies.',
                                        'Para piezas de gran tamaño que no puedan transportarse de forma segura por escaleras o ascensores, puede ser necesario un elevador hidráulico exterior para facilitar la entrega a través de ventanas grandes o balcones.',
                                        'Für übergroße Stücke, die nicht sicher durch das Treppenhaus oder den Aufzug transportiert werden können, kann ein externer Möbellift erforderlich sein, um die Lieferung durch große Fenster oder Balkone zu ermöglichen.'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-4">
                        <button 
                            onClick={() => setShowMovingInfo(false)}
                            className="w-full bg-[#002D5B] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-[#001D3A] transition-all active:scale-[0.98]"
                        >
                            {mt('Got it!', '¡Entendido!', 'Verstanden!')}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL: Gardening */}
        {activeModal === 'gardening' && (
            <ModalOverlay title={t('services.gardening.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }} noScroll={true}>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
                    <button 
                        type="button"
                        onClick={() => setShowInclusionsModal('gardening')} 
                        className="w-full text-left text-[#007bff] text-xs font-bold flex items-center justify-between bg-blue-50/40 p-3.5 px-4 rounded-2xl border border-blue-100/80 hover:bg-blue-50/70 transition-all select-none group"
                    >
                        <div className="flex items-center gap-3">
                            <InfoIcon className="w-5 h-5 text-[#007bff] shrink-0" />
                            <span className="text-sm font-bold">{t('consultation.whatsIncluded')}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-[#007bff] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.gardening.size')}</label>
                        <div className="space-y-2">
                            {[
                                {id: 'Small', label: t('consultation.gardening.size.small'), desc: t('consultation.gardening.size.small.desc'), price: '140 CHF', icon: '🏡'},
                                {id: 'Medium', label: t('consultation.gardening.size.medium'), desc: t('consultation.gardening.size.medium.desc'), price: '260 CHF', icon: '🌳'},
                                {id: 'Large', label: t('consultation.gardening.size.large'), desc: t('consultation.gardening.size.large.desc'), price: '480 CHF', icon: '🏰'},
                                {id: 'XL', label: t('consultation.gardening.size.xl'), desc: t('consultation.gardening.size.xl.desc'), price: t('consultation.label.inquiry'), icon: '🌲'}
                            ].map(sz => (
                                <OptionCard 
                                    key={sz.id}
                                    icon={sz.icon}
                                    title={sz.label}
                                    description={sz.desc}
                                    price={sz.price}
                                    selected={config.size === sz.id}
                                    onClick={() => setConfig({...config, size: sz.id})}
                                />
                            ))}
                        </div>
                    </div>

                    {config.size !== 'XL' && (
                        <>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.gardening.condition')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        {id: 'Cuidado', label: t('consultation.gardening.condition.cared'), desc: '1.0x', icon: '✨'},
                                        {id: 'Descuidado', label: t('consultation.gardening.condition.neglected'), desc: '1.3x', icon: '🌿'},
                                        {id: 'Muy descuidado', label: t('consultation.gardening.condition.very_neglected'), desc: '1.6x', icon: '🍀'}
                                    ].map(cond => (
                                        <OptionCard 
                                            key={cond.id}
                                            icon={cond.icon}
                                            title={cond.label}
                                            description={cond.desc}
                                            selected={config.condition === cond.id}
                                            onClick={() => setConfig({...config, condition: cond.id})}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.gardening.frequency')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        {id: 'Única', label: t('consultation.gardening.frequency.once'), desc: t('consultation.gardening.frequency.once.desc'), icon: '📅'},
                                        {id: 'Mensual', label: t('consultation.gardening.frequency.monthly'), desc: t('consultation.gardening.frequency.monthly.desc'), icon: '🔄'},
                                        {id: 'Temporal', label: t('consultation.gardening.frequency.seasonal'), desc: t('consultation.gardening.frequency.seasonal.desc'), icon: '🍂'}
                                    ].map(freq => (
                                        <OptionCard 
                                            key={freq.id}
                                            icon={freq.icon}
                                            title={freq.label}
                                            description={freq.desc}
                                            selected={config.frequency === freq.id}
                                            onClick={() => setConfig({...config, frequency: freq.id})}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.gardening.features')}</label>
                                <div className="space-y-3">
                                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    id="lawn-mowing-chk"
                                                    checked={!!(config.features?.lawn)} 
                                                    onChange={(e) => setConfig({
                                                        ...config, 
                                                        features: { ...(config.features || {}), lawn: e.target.checked },
                                                        mowing: e.target.checked
                                                    })}
                                                    className="w-4 h-4 text-[#007bff] focus:ring-[#007bff] border-gray-300 rounded"
                                                />
                                                <label htmlFor="lawn-mowing-chk" className="text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer">{t('consultation.gardening.lawn')}</label>
                                            </div>
                                            <span className="text-[10px] font-black text-[#007bff]">From 60.00 CHF</span>
                                        </div>
                                        {config.features?.lawn && (
                                            <div className="pt-2 border-t border-gray-100 animate-fade-in">
                                                <p className="text-[9px] text-gray-400 mb-2">{t('consultation.gardening.lawn.desc')}</p>
                                                <CounterInput label={t('consultation.gardening.lawn.label')} value={parseFloat(config.lawnSqm) || 50} onChange={(v) => setConfig({...config, lawnSqm: String(v)})} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    id="hedge-trimming-chk"
                                                    checked={!!(config.features?.hedges)} 
                                                    onChange={(e) => setConfig({
                                                        ...config, 
                                                        features: { ...(config.features || {}), hedges: e.target.checked }
                                                    })}
                                                    className="w-4 h-4 text-[#007bff] focus:ring-[#007bff] border-gray-300 rounded"
                                                />
                                                <label htmlFor="hedge-trimming-chk" className="text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer">{t('consultation.gardening.hedges')}</label>
                                            </div>
                                            <span className="text-[10px] font-black text-[#007bff]">15.00 CHF/m</span>
                                        </div>
                                        {config.features?.hedges && (
                                            <div className="pt-2 border-t border-gray-100 animate-fade-in">
                                                <CounterInput label={t('consultation.gardening.hedges.label')} value={config.hedgeMeters || 10} onChange={(v) => setConfig({...config, hedgeMeters: v})} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    id="tree-pruning-chk"
                                                    checked={!!(config.features?.trees)} 
                                                    onChange={(e) => setConfig({
                                                        ...config, 
                                                        features: { ...(config.features || {}), trees: e.target.checked }
                                                    })}
                                                    className="w-4 h-4 text-[#007bff] focus:ring-[#007bff] border-gray-300 rounded"
                                                />
                                                <label htmlFor="tree-pruning-chk" className="text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer">{t('consultation.gardening.trees')}</label>
                                            </div>
                                            <span className="text-[10px] font-black text-[#007bff]">45.00 CHF/h</span>
                                        </div>
                                        {config.features?.trees && (
                                            <div className="pt-2 border-t border-gray-100 animate-fade-in">
                                                <CounterInput label={t('consultation.gardening.trees.label')} value={config.treePruningHours || 2} onChange={(v) => setConfig({...config, treePruningHours: v})} />
                                            </div>
                                        )}
                                    </div>

                                    <OptionCard 
                                        icon="💎" 
                                        title={t('consultation.gardening.treatment')} 
                                        description={t('consultation.gardening.treatment.desc')} 
                                        price="+90.00 CHF" 
                                        selected={!!config.lawnTreatment} 
                                        onClick={() => setConfig({...config, lawnTreatment: !config.lawnTreatment})} 
                                    />

                                    <OptionCard 
                                        icon="🍁" 
                                        title={t('consultation.gardening.cleanup')} 
                                        description={t('consultation.gardening.cleanup.desc')} 
                                        price="+120.00 CHF" 
                                        selected={!!config.cleanup} 
                                        onClick={() => setConfig({...config, cleanup: !config.cleanup})} 
                                    />

                                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    id="green-debris-waste-chk"
                                                    checked={!!config.greenWaste} 
                                                    onChange={(e) => setConfig({
                                                        ...config, 
                                                        greenWaste: e.target.checked
                                                    })}
                                                    className="w-4 h-4 text-[#007bff] focus:ring-[#007bff] border-gray-300 rounded"
                                                />
                                                <label htmlFor="green-debris-waste-chk" className="text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer">{t('consultation.gardening.waste')}</label>
                                            </div>
                                            <span className="text-[10px] font-black text-[#007bff]">+18.00 CHF/bag</span>
                                        </div>
                                        {config.greenWaste && (
                                            <div className="pt-2 border-t border-gray-100 animate-fade-in">
                                                <p className="text-[9px] text-gray-400 mb-2">{t('consultation.gardening.waste.desc')}</p>
                                                <CounterInput label={t('consultation.gardening.waste.label')} value={config.greenWasteBags || 0} onChange={(v) => setConfig({...config, greenWasteBags: v})} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contextual Warning Banner with Option Toggle */}
                            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🚜</span>
                                        <h5 className="text-xs font-bold text-yellow-800 uppercase tracking-wider">{t('consultation.gardening.access')}</h5>
                                    </div>
                                    <p className="text-[10px] text-yellow-700 leading-normal">
                                        {t('consultation.gardening.access.desc')}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setConfig({...config, accessMachine: true})} 
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${config.accessMachine !== false ? 'bg-yellow-600 border-yellow-600 text-white shadow-sm' : 'bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-100'}`}
                                        >
                                            {t('consultation.gardening.access.yes')}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setConfig({...config, accessMachine: false})} 
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${config.accessMachine === false ? 'bg-yellow-600 border-yellow-600 text-white shadow-sm' : 'bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-100'}`}
                                        >
                                            {t('consultation.gardening.access.no')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>
                {/* Sticky Footer */}
                <div className="p-5 bg-slate-50 border-t border-gray-100/90 z-10 flex flex-col gap-3 rounded-b-[2rem] shrink-0 shadow-xs">
                    <div className="flex justify-between items-center px-1">
                        <span className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">{t('consultation.gardening.total')}</span>
                        <span className="font-black text-2xl text-emerald-600">
                            {config.size === 'XL' ? t('consultation.label.inquiry') : `CHF ${getEstimatedPrice().toFixed(2)}`}
                        </span>
                    </div>
                    <button 
                        onClick={handleAddToCart} 
                        className="w-full bg-[#10b981] hover:bg-[#059669] active:scale-[0.98] text-white py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg transition-all"
                    >
                        {editingItemId ? t('consultation.gardening.update') : t('consultation.gardening.checkout')}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Exterior Cleaning */}
        {activeModal === 'exterior-cleaning' && (
            <ModalOverlay title={t('services.exterior.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }} size="lg" noScroll={true}>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white text-gray-800">
                    <button 
                        type="button"
                        onClick={() => setShowInclusionsModal('exterior-cleaning')} 
                        className="w-full text-left text-[#007bff] text-xs font-bold flex items-center justify-between bg-blue-50/40 p-3.5 px-4 rounded-2xl border border-blue-100/80 hover:bg-blue-50/70 transition-all select-none group"
                    >
                        <div className="flex items-center gap-3">
                            <InfoIcon className="w-5 h-5 text-[#007bff] shrink-0" />
                            <span className="text-sm font-bold">{t('consultation.whatsIncluded')}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-[#007bff] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">{t('consultation.exterior.configured')}</label>
                            <button 
                                type="button" 
                                onClick={() => {
                                    const surfaces = config.surfaces || [];
                                    setConfig({
                                        ...config,
                                        surfaces: [...surfaces, { surfaceType: 'Driveway / Path', material: 'Stone', severity: 'Ligero', areaSqm: '20', moldSealing: false }]
                                    });
                                }}
                                className="text-xs font-bold text-[#007bff] uppercase tracking-wider hover:underline"
                            >
                                {t('consultation.exterior.add_surface_btn')}
                            </button>
                        </div>

                        {(!config.surfaces || config.surfaces.length === 0) ? (
                            <div className="text-center p-6 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                                <p className="text-xs text-gray-400 mb-3">{t('consultation.exterior.no_surfaces')}</p>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setConfig({
                                            ...config,
                                            surfaces: [{ surfaceType: 'Driveway / Path', material: 'Stone', severity: 'Ligero', areaSqm: '25', moldSealing: false }]
                                        });
                                    }}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors uppercase tracking-wider"
                                >
                                    {t('consultation.exterior.add_surface')}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {config.surfaces.map((surf: any, index: number) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-[1.25rem] p-4 relative shadow-sm">
                                        <div className="absolute top-4 right-4 flex items-center gap-2">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const updated = config.surfaces.filter((_: any, i: number) => i !== index);
                                                    setConfig({...config, surfaces: updated});
                                                }}
                                                className="text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-wider"
                                            >
                                                {t('consultation.exterior.remove')}
                                            </button>
                                        </div>

                                        <h5 className="font-bold text-xs text-gray-700 uppercase tracking-widest mb-3">
                                            {t('consultation.exterior.surface_num').replace('{index}', String(index + 1))}
                                        </h5>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('consultation.exterior.surface_type')}</label>
                                                <div className="grid grid-cols-3 gap-1">
                                                    {[
                                                        { id: 'Driveway / Path', label: t('consultation.exterior.type.driveway') },
                                                        { id: 'Decking / Patio', label: t('consultation.exterior.type.decking') },
                                                        { id: 'Facade / Walls', label: t('consultation.exterior.type.facade') }
                                                    ].map(item => (
                                                        <button 
                                                            key={item.id}
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = [...config.surfaces];
                                                                updated[index].surfaceType = item.id;
                                                                setConfig({...config, surfaces: updated});
                                                            }}
                                                            className={`py-2 text-[10px] font-bold rounded-lg border text-center transition-all ${surf.surfaceType === item.id ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-100 text-gray-500'}`}
                                                        >
                                                            {item.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('consultation.exterior.material')}</label>
                                                    <select 
                                                        value={surf.material}
                                                        onChange={(e) => {
                                                            const updated = [...config.surfaces];
                                                            updated[index].material = e.target.value;
                                                            setConfig({...config, surfaces: updated});
                                                        }}
                                                        className="w-full bg-gray-50 text-[11px] font-black text-gray-700 p-2 rounded-lg border border-gray-150 outline-none focus:ring-1 focus:ring-[#007bff]"
                                                    >
                                                        <option value="Stone">{t('consultation.exterior.material.stone')}</option>
                                                        <option value="Concrete">{t('consultation.exterior.material.concrete')}</option>
                                                        <option value="Wood">{t('consultation.exterior.material.wood')}</option>
                                                        <option value="Composite">{t('consultation.exterior.material.composite')}</option>
                                                        <option value="Glass">{t('consultation.exterior.material.glass')}</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('consultation.exterior.severity')}</label>
                                                    <select 
                                                        value={surf.severity}
                                                        onChange={(e) => {
                                                            const updated = [...config.surfaces];
                                                            updated[index].severity = e.target.value;
                                                            setConfig({...config, surfaces: updated});
                                                        }}
                                                        className="w-full bg-gray-50 text-[11px] font-black text-gray-700 p-2 rounded-lg border border-gray-150 outline-none focus:ring-1 focus:ring-[#007bff]"
                                                    >
                                                        <option value="Ligero">{t('consultation.exterior.severity.light')}</option>
                                                        <option value="Moderado">{t('consultation.exterior.severity.moderate')}</option>
                                                        <option value="Musgo / Algas">{t('consultation.exterior.severity.moss_algae')}</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 items-center pt-1">
                                                <div>
                                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('consultation.exterior.total_sqm')}</label>
                                                    <input 
                                                        type="number"
                                                        value={surf.areaSqm}
                                                        onChange={(e) => {
                                                            const updated = [...config.surfaces];
                                                            updated[index].areaSqm = e.target.value;
                                                            setConfig({...config, surfaces: updated});
                                                        }}
                                                        className="w-full bg-gray-50 text-xs font-black text-gray-700 p-2 rounded-lg border border-gray-150 outline-none focus:ring-1 focus:ring-[#007bff]"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 pt-4">
                                                    <input 
                                                        type="checkbox" 
                                                        id={`mold-sealing-${index}`}
                                                        checked={!!surf.moldSealing} 
                                                        onChange={(e) => {
                                                            const updated = [...config.surfaces];
                                                            updated[index].moldSealing = e.target.checked;
                                                            setConfig({...config, surfaces: updated});
                                                        }}
                                                        className="w-4 h-4 text-[#007bff] focus:ring-[#007bff] border-gray-300 rounded"
                                                    />
                                                    <label htmlFor={`mold-sealing-${index}`} className="text-[10px] font-bold text-gray-600 uppercase cursor-pointer">{t('consultation.exterior.mold_sealant')}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.exterior.global_addons')}</label>
                        <div className="space-y-2">
                            <OptionCard 
                                icon="🧼" 
                                title={t('consultation.exterior.stain_removal')} 
                                description={t('consultation.exterior.stain_removal.desc')} 
                                price="+50.00 CHF" 
                                selected={!!config.stainRemoval} 
                                onClick={() => setConfig({...config, stainRemoval: !config.stainRemoval})} 
                            />
                            <OptionCard 
                                icon="⚡" 
                                title={t('consultation.exterior.no_utility')} 
                                description={t('consultation.exterior.no_utility.desc')} 
                                price="+60.00 CHF" 
                                selected={!!config.noUtilityAccess} 
                                onClick={() => setConfig({...config, noUtilityAccess: !config.noUtilityAccess})} 
                            />
                        </div>
                    </div>

                </div>
                {/* Sticky Footer */}
                <div className="p-5 bg-slate-50 border-t border-gray-100/90 z-10 flex flex-col gap-3 rounded-b-[2rem] shrink-0 shadow-xs">
                    <div className="flex justify-between items-center px-1">
                        <span className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider text-[#002D5B]">{t('consultation.exterior.total')}</span>
                        <span className="font-black text-2xl text-[#007bff]">CHF {getEstimatedPrice().toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleAddToCart} 
                        className="w-full bg-[#007bff] hover:bg-blue-600 active:scale-[0.98] text-white py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all"
                    >
                        {editingItemId ? t('consultation.exterior.update') : t('consultation.exterior.checkout')}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Gutter Cleaning */}
        {activeModal === 'gutter-cleaning' && (
            <ModalOverlay title={t('services.gutter.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }} noScroll={true}>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
                    <button 
                        type="button"
                        onClick={() => setShowInclusionsModal('gutter-cleaning')} 
                        className="w-full text-left text-[#007bff] text-xs font-bold flex items-center justify-between bg-blue-50/40 p-3.5 px-4 rounded-2xl border border-blue-100/80 hover:bg-blue-50/70 transition-all select-none group"
                    >
                        <div className="flex items-center gap-3">
                            <InfoIcon className="w-5 h-5 text-[#007bff] shrink-0" />
                            <span className="text-sm font-bold">{t('consultation.whatsIncluded')}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-[#007bff] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.gutter.height')}</label>
                        <div className="space-y-2">
                            {[
                                {id: '1 Story', icon: '🏠', label: t('consultation.gutter.height.1'), price: '180.00 CHF'},
                                {id: '2 Stories', icon: '🏠', label: t('consultation.gutter.height.2'), price: '290.00 CHF'},
                                {id: '3+ Stories', icon: '🏢', label: t('consultation.gutter.height.3'), price: '450.00 CHF'}
                            ].map(ht => (
                                <OptionCard 
                                    key={ht.id}
                                    icon={ht.icon}
                                    title={ht.id}
                                    description={ht.label}
                                    price={ht.price}
                                    selected={config.buildingHeight === ht.id}
                                    onClick={() => setConfig({...config, buildingHeight: ht.id})}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.gutter.length')}</label>
                        <div className="space-y-2">
                            {[
                                {id: 'Standard (<20m)', icon: '📏', label: t('consultation.gutter.length.standard'), price: 'Included'},
                                {id: 'Large (20-50m)', icon: '📐', label: t('consultation.gutter.length.large'), price: '+40.00 CHF'},
                                {id: 'XL (>50m)', icon: '🌊', label: t('consultation.gutter.length.xl'), price: '+90.00 CHF'}
                            ].map(len => (
                                <OptionCard 
                                    key={len.id}
                                    icon={len.icon}
                                    title={len.label}
                                    description=""
                                    price={len.price}
                                    selected={config.lengthCategory === len.id}
                                    onClick={() => setConfig({...config, lengthCategory: len.id})}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.gutter.state')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {id: 'Ligero', icon: '🍃', label: t('consultation.gutter.state.light'), price: 'Included'},
                                {id: 'Obstruido', icon: '💧', label: t('consultation.gutter.state.blocked'), price: '+40.00 CHF'},
                                {id: 'Plantas creciendo', icon: '🌱', label: t('consultation.gutter.state.plants'), price: '+80.00 CHF'},
                                {id: 'No sé', icon: '❓', label: t('consultation.gutter.state.unknown'), price: 'No charge'}
                            ].map(cond => (
                                <OptionCard 
                                    key={cond.id}
                                    icon={cond.icon}
                                    title={cond.label}
                                    description=""
                                    price={cond.price}
                                    selected={config.condition === cond.id}
                                    onClick={() => setConfig({...config, condition: cond.id})}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.gutter.addons')}</label>
                        <div className="space-y-2">
                            <OptionCard 
                                icon="💦" 
                                title={t('consultation.gutter.downspout')} 
                                description={t('consultation.gutter.downspout.desc')} 
                                price="+40.00 CHF" 
                                selected={!!config.downspoutFlush} 
                                onClick={() => setConfig({...config, downspoutFlush: !config.downspoutFlush})} 
                            />
                            <OptionCard 
                                icon="🔧" 
                                title={t('consultation.gutter.repair')} 
                                description={t('consultation.gutter.repair.desc')} 
                                price="+45.00 CHF" 
                                selected={!!config.repairNeeded} 
                                onClick={() => setConfig({...config, repairNeeded: !config.repairNeeded})} 
                            />
                        </div>
                    </div>

                </div>
                {/* Sticky Footer */}
                <div className="p-5 bg-slate-50 border-t border-gray-100/90 z-10 flex flex-col gap-3 rounded-b-[2rem] shrink-0 shadow-xs">
                    <div className="flex justify-between items-center px-1">
                        <span className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider text-[#002D5B]">{t('consultation.gutter.total')}</span>
                        <span className="font-black text-2xl text-[#007bff]">CHF {getEstimatedPrice().toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleAddToCart} 
                        className="w-full bg-[#007bff] hover:bg-blue-600 active:scale-[0.98] text-white py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all"
                    >
                        {editingItemId ? t('consultation.gutter.update') : t('consultation.gutter.checkout')}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Car Detailing */}
        {activeModal === 'car-detailing' && (
            <ModalOverlay title={t('services.car.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }} size="lg" noScroll={true}>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white text-gray-800">
                    <button 
                        type="button"
                        onClick={() => setShowInclusionsModal('car-detailing')} 
                        className="w-full text-left text-[#007bff] text-xs font-bold flex items-center justify-between bg-blue-50/40 p-3.5 px-4 rounded-2xl border border-blue-100/80 hover:bg-blue-50/70 transition-all select-none group"
                    >
                        <div className="flex items-center gap-3">
                            <InfoIcon className="w-5 h-5 text-[#007bff] shrink-0" />
                            <span className="text-sm font-bold">{t('consultation.whatsIncluded')}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-[#007bff] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">{t('consultation.car.garage')}</label>
                            <span className="text-[10px] bg-blue-50 text-[#007bff] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                                {config.vehicles?.length || 0} {config.vehicles?.length === 1 ? t('consultation.car.vehicle_num').replace(' #{index}', '') : t('consultation.car.garage')}
                            </span>
                        </div>

                        {(!config.vehicles || config.vehicles.length === 0) ? (
                            <div className="text-center p-6 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                                <p className="text-xs text-gray-400 mb-3">{t('consultation.car.no_cars')}</p>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setConfig({
                                            ...config,
                                            vehicles: [{ category: 'M', dirtLevel: 'Medium', coverage: 'Full', hasPets: false, hasHeadlights: false, hasScratches: false, hasOdor: false, hasUpholstery: false, locationType: 'Mobile' }]
                                        });
                                    }}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors uppercase tracking-wider"
                                >
                                    {t('consultation.car.add_car_btn')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2 border-b border-gray-150 pb-4 mb-5">
                                {(config.vehicles || []).map((veh: any, idx: number) => {
                                    const isActive = idx === (config.activeVehicleIdx || 0);
                                    return (
                                        <button
                                            type="button"
                                            key={idx}
                                            onClick={() => setConfig({ ...config, activeVehicleIdx: idx })}
                                            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border shadow-sm ${
                                                isActive 
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-blue-100 scale-[1.02]' 
                                                : 'bg-gray-50 text-gray-600 border-gray-200/80 hover:bg-gray-100 hover:border-gray-300'
                                            }`}
                                        >
                                            <span className="text-sm filter drop-shadow-sm">{veh.category === 'S' ? '🚙' : veh.category === 'M' ? '🚗' : veh.category === 'L' ? '🏎️' : '🚐'}</span>
                                            <span>{t('consultation.car.vehicle_num').replace('#{index}', String(idx + 1))}</span>
                                            {config.vehicles.length > 1 && (
                                                <span 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const updated = config.vehicles.filter((_: any, i: number) => i !== idx);
                                                        const nextActive = Math.max(0, (config.activeVehicleIdx || 0) >= updated.length ? updated.length - 1 : (config.activeVehicleIdx || 0));
                                                        setConfig({ ...config, vehicles: updated, activeVehicleIdx: nextActive });
                                                    }}
                                                    className={`ml-1.5 p-0.5 rounded-full hover:bg-red-500 hover:text-white transition-all text-[8px] leading-none ${isActive ? 'text-blue-100 hover:bg-white hover:text-blue-600' : 'text-gray-400'}`}
                                                    title={t('consultation.car.remove')}
                                                >
                                                    ✕
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}

                                <button
                                    type="button"
                                    onClick={() => {
                                        const vehicles = config.vehicles || [{ category: 'M', dirtLevel: 'Medium', coverage: 'Full', hasPets: false, hasHeadlights: false, hasScratches: false, hasOdor: false, hasUpholstery: false, locationType: 'Mobile' }];
                                        const newVeh = { category: 'M', dirtLevel: 'Medium', coverage: 'Full', hasPets: false, hasHeadlights: false, hasScratches: false, hasOdor: false, hasUpholstery: false, locationType: 'Mobile' };
                                        setConfig({
                                            ...config,
                                            vehicles: [...vehicles, newVeh],
                                            activeVehicleIdx: vehicles.length
                                        });
                                    }}
                                    className="px-4 py-2.5 border border-dashed border-blue-400 text-[#007bff] hover:bg-blue-50 text-xs font-bold rounded-2xl transition-all duration-300 uppercase tracking-wider flex items-center gap-1.5"
                                >
                                    {t('consultation.car.add_car')}
                                </button>
                            </div>
                        )}
                    </div>

                    {config.vehicles && config.vehicles.length > 0 && (() => {
                        const activeIdx = Math.min(config.activeVehicleIdx || 0, config.vehicles.length - 1);
                        const safeActiveIdx = activeIdx < 0 ? 0 : activeIdx;
                        const v = config.vehicles[safeActiveIdx];
                        if (!v) return null;

                        return (
                            <div className="space-y-6 pt-1 animate-fade-in">
                                {/* 1. Vehicle Size Category with rich cards */}
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-baseline">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('consultation.car.class_label')}</label>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">{t('consultation.car.class_sub')}</span>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                                        {[
                                            { id: 'S', title: 'Cat S', subtitle: 'Mini / Urban', price: '140.-', desc: 'Fiat 500, Smart, Mini', icon: '🚙' },
                                            { id: 'M', title: 'Cat M', subtitle: 'Sedan / Coupe', price: '190.-', desc: 'VW Golf, BMW 3, Tesla 3', icon: '🚗' },
                                            { id: 'L', title: 'Cat L', subtitle: 'SUV / Luxury', price: '240.-', desc: 'BMW X5, Cayenne, E-Class', icon: '🏎️' },
                                            { id: 'XL', title: 'Cat XL', subtitle: 'Vans / 4x4s', price: '290.-', desc: 'V-Class, Defender, Hilux', icon: '🚐' }
                                        ].map(sz => {
                                            const isSelected = v.category === sz.id;
                                            return (
                                                <button
                                                    key={sz.id}
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...config.vehicles];
                                                        updated[safeActiveIdx].category = sz.id;
                                                        setConfig({ ...config, vehicles: updated });
                                                    }}
                                                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-full min-h-[115px] transition-all duration-300 relative overflow-hidden group select-none ${
                                                        isSelected
                                                        ? 'bg-blue-50/75 border-[#007bff] shadow-sm ring-1 ring-blue-500/10 scale-[1.01]'
                                                        : 'bg-white border-gray-200/80 hover:border-gray-300 hover:shadow-sm'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start w-full mb-1">
                                                        <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{sz.icon}</span>
                                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                            {sz.price}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h6 className={`font-black text-xs uppercase tracking-tight ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>{sz.title}</h6>
                                                        <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-1 leading-none">{sz.subtitle}</span>
                                                        <p className="text-[9px] text-gray-400 font-medium leading-tight truncate">{sz.desc}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 2. Service Coverage Option */}
                                <div className="space-y-2.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('consultation.car.focus_label')}</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                        {[
                                            { id: 'Full', label: t('consultation.car.cov.full.label'), desc: t('consultation.car.cov.full.desc'), icon: '✨' },
                                            { id: 'Interior', label: t('consultation.car.cov.int.label'), desc: t('consultation.car.cov.int.desc'), icon: '💺' },
                                            { id: 'Exterior', label: t('consultation.car.cov.ext.label'), desc: t('consultation.car.cov.ext.desc'), icon: '💎' }
                                        ].map(cov => {
                                            const isSelected = v.coverage === cov.id;
                                            return (
                                                <button
                                                    key={cov.id}
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...config.vehicles];
                                                        updated[safeActiveIdx].coverage = cov.id;
                                                        setConfig({ ...config, vehicles: updated });
                                                    }}
                                                    className={`p-3 rounded-2xl border text-left transition-all duration-300 relative select-none flex items-start gap-4 ${
                                                        isSelected
                                                        ? 'bg-blue-50/75 border-[#007bff] shadow-sm ring-1 ring-blue-500/10 scale-[1.01]'
                                                        : 'bg-white border-gray-200/80 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <span className="text-xl bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm filter drop-shadow-xs">{cov.icon}</span>
                                                    <div className="space-y-0.5">
                                                        <h6 className={`font-black text-xs uppercase ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>{cov.label}</h6>
                                                        <p className="text-[9px] text-gray-400 font-medium leading-tight">{cov.desc}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 3. Dirt Condition with intuitive meters */}
                                <div className="space-y-2.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('consultation.car.dirt_label')}</label>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                                        {[
                                            { id: 'Minimum', title: t('consultation.car.dirt.min.label'), surcharge: '+0.-', desc: t('consultation.car.dirt.min.desc'), icon: '✨' },
                                            { id: 'Medium', title: t('consultation.car.dirt.med.label'), surcharge: '+0.-', desc: t('consultation.car.dirt.med.desc'), icon: '🌫️' },
                                            { id: 'High', title: t('consultation.car.dirt.high.label'), surcharge: '+30.-', desc: t('consultation.car.dirt.high.desc'), icon: '💨' },
                                            { id: 'Extreme', title: t('consultation.car.dirt.ext.label'), surcharge: '+60.-', desc: t('consultation.car.dirt.ext.desc'), icon: '🚜' }
                                        ].map(lvl => {
                                            const isSelected = v.dirtLevel === lvl.id;
                                            return (
                                                <button
                                                    key={lvl.id}
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...config.vehicles];
                                                        updated[safeActiveIdx].dirtLevel = lvl.id;
                                                        setConfig({ ...config, vehicles: updated });
                                                    }}
                                                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-full min-h-[120px] transition-all duration-300 relative select-none gap-2 ${
                                                        isSelected
                                                        ? 'bg-blue-50/75 border-[#007bff] shadow-sm ring-1 ring-blue-500/10 scale-[1.01]'
                                                        : 'bg-white border-gray-200/80 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-center w-full">
                                                        <span className="text-xl">{lvl.icon}</span>
                                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${lvl.surcharge === '+0.-' ? 'bg-green-50 text-green-700 decoration-none' : 'bg-blue-50 text-[#007bff] decoration-none'}`}>
                                                            {lvl.surcharge}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <h6 className={`font-black text-[11px] uppercase whitespace-normal leading-tight break-words ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>{lvl.title}</h6>
                                                        <p className="text-[9px] text-gray-400 font-medium leading-tight">{lvl.desc}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 4. Location Selector */}
                                <div className="space-y-2.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('consultation.car.location_label')}</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                        {[
                                            { id: 'Workshop', title: t('consultation.car.loc.workshop.label'), charge: '0.-', desc: t('consultation.car.loc.workshop.desc'), icon: '🏢' },
                                            { id: 'Mobile', title: t('consultation.car.loc.mobile.label'), charge: '+30.-', desc: t('consultation.car.loc.mobile.desc'), icon: '🚚' }
                                        ].map(loc => {
                                            const isSelected = v.locationType === loc.id;
                                            return (
                                                <button
                                                    key={loc.id}
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...config.vehicles];
                                                        updated[safeActiveIdx].locationType = loc.id;
                                                        setConfig({ ...config, vehicles: updated });
                                                    }}
                                                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative select-none flex items-start gap-4 ${
                                                        isSelected
                                                        ? 'bg-blue-50/75 border-[#007bff] shadow-sm ring-1 ring-blue-500/10 scale-[1.01]'
                                                        : 'bg-white border-gray-200/80 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <span className="text-2xl">{loc.icon}</span>
                                                    <div className="space-y-0.5">
                                                        <h6 className={`font-black text-xs uppercase ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>{loc.title}</h6>
                                                        <span className="block text-[8px] text-[#007bff] font-black uppercase tracking-wider">{t('consultation.car.loc.surcharge').replace('{charge}', loc.charge)}</span>
                                                        <p className="text-[9px] text-gray-400 font-medium leading-tight">{loc.desc}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 5. Premium Highlight: Ceramic Nano Quartz Paint Treatment */}
                                <div className="space-y-2.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('consultation.car.protection_label')}</label>
                                    <div className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden select-none cursor-pointer ${
                                        v.ceramicYears === '3 Years'
                                        ? 'bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border-purple-500 shadow-md ring-1 ring-purple-500/10'
                                        : 'bg-white border-gray-200/80 hover:border-purple-200'
                                    }`}
                                    onClick={() => {
                                        const updated = [...config.vehicles];
                                        updated[safeActiveIdx].ceramicYears = v.ceramicYears === '3 Years' ? '' : '3 Years';
                                        setConfig({ ...config, vehicles: updated });
                                    }}
                                    >
                                        <div className="absolute right-3 top-3 bg-purple-600 text-white font-black text-[8px] uppercase px-2 py-0.5 rounded-full tracking-wider animate-pulse flex items-center gap-1 leading-none">
                                            <span>{t('consultation.car.ceramic.topshelf')}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <input 
                                                type="checkbox"
                                                checked={v.ceramicYears === '3 Years'}
                                                onChange={() => {}} // Swallowed since onClick handles card
                                                className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                                            />
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h5 className="text-xs font-black text-purple-950 uppercase tracking-tight">{t('consultation.car.ceramic.title')}</h5>
                                                    <span className="text-xs font-black text-purple-600">+1000.00 CHF</span>
                                                </div>
                                                <p className="text-[9px] text-[#6d5e9c] font-medium leading-relaxed pr-10">
                                                    {t('consultation.car.ceramic.desc')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 6. Modular Addons Check Grid */}
                                <div className="space-y-2.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('consultation.car.upgrades_label')}</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                        {[
                                            { id: 'hasPets', label: t('consultation.car.opt.hasPets'), price: '+60.00 CHF', desc: t('consultation.car.opt.hasPets.desc') },
                                            { id: 'hasHeadlights', label: t('consultation.car.opt.hasHeadlights'), price: '+80.00 CHF', desc: t('consultation.car.opt.hasHeadlights.desc') },
                                            { id: 'hasScratches', label: t('consultation.car.opt.hasScratches'), price: '+120.00 CHF', desc: t('consultation.car.opt.hasScratches.desc') },
                                            { id: 'hasOdor', label: t('consultation.car.opt.hasOdor'), price: '+70.00 CHF', desc: t('consultation.car.opt.hasOdor.desc') },
                                            { id: 'hasUpholstery', label: t('consultation.car.opt.hasUpholstery'), price: '+50.00 CHF', desc: t('consultation.car.opt.hasUpholstery.desc') }
                                        ].map(opt => {
                                            const activeValue = !!v[opt.id];
                                            return (
                                                <label 
                                                    key={opt.id} 
                                                    className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-3 select-none ${
                                                        activeValue 
                                                        ? 'bg-blue-50/75 border-[#007bff] shadow-sm ring-1 ring-blue-500/10' 
                                                        : 'bg-white border-gray-200/80 hover:bg-gray-50/40 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <input 
                                                        type="checkbox" 
                                                        checked={activeValue}
                                                        onChange={(e) => {
                                                            const updated = [...config.vehicles];
                                                            updated[safeActiveIdx][opt.id] = e.target.checked;
                                                            setConfig({ ...config, vehicles: updated });
                                                        }}
                                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                                                    />
                                                    <div className="space-y-0.5">
                                                        <div className="flex flex-wrap items-baseline gap-x-2">
                                                            <span className="text-xs font-black text-gray-700 uppercase tracking-tight">{opt.label}</span>
                                                            <span className="text-[10px] font-black text-[#007bff]">{opt.price}</span>
                                                        </div>
                                                        <p className="text-[9px] text-gray-400 font-medium leading-tight">{opt.desc}</p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                </div>
                {/* Sticky Footer */}
                <div className="p-5 bg-slate-50 border-t border-gray-100/90 z-10 flex flex-col gap-3 rounded-b-[2rem] shrink-0 shadow-xs">
                    <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/40 p-5 rounded-2xl border border-blue-150 space-y-2 shadow-inner">
                        <div className="flex justify-between items-baseline">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#002D5B]">{t('consultation.car.package_total').replace('{count}', String(config.vehicles?.length || 0))}</span>
                            <span className="font-mono text-[9px] text-[#002D5B] font-black uppercase bg-white/60 px-2 py-0.5 rounded border border-blue-100">{t('consultation.car.canton_adjusted')}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-blue-100/50 pt-2.5">
                            <span className="text-xs font-bold text-gray-500 uppercase">{t('consultation.car.premium_total_label')}</span>
                            <span className="font-black text-3xl text-blue-600">CHF {getEstimatedPrice().toFixed(2)}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddToCart} 
                        className="w-full bg-[#007bff] hover:bg-blue-600 active:scale-[0.98] text-white py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all"
                    >
                        {editingItemId ? t('consultation.car.checkout.update') : t('consultation.car.checkout')}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Pest Control */}
        {activeModal === 'pest-control' && (
            <ModalOverlay title={t('services.pest.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }} size="lg" noScroll={true}>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white text-gray-800">
                    <button 
                        type="button"
                        onClick={() => setShowInclusionsModal('pest-control')} 
                        className="w-full text-left text-[#007bff] text-xs font-bold flex items-center justify-between bg-blue-50/40 p-3.5 px-4 rounded-2xl border border-blue-100/80 hover:bg-blue-50/70 transition-all select-none group"
                    >
                        <div className="flex items-center gap-3">
                            <InfoIcon className="w-5 h-5 text-[#007bff] shrink-0" />
                            <span className="text-sm font-bold">{t('consultation.whatsIncluded')}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-[#007bff] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.pest.category')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                {id: 'Insects', label: t('consultation.pest.category.insects'), desc: t('consultation.pest.category.insects.desc'), icon: '🐜'},
                                {id: 'Rodents', label: t('consultation.pest.category.rodents'), desc: t('consultation.pest.category.rodents.desc'), icon: '🐀'},
                                {id: 'Other', label: t('consultation.pest.category.other'), desc: t('consultation.pest.category.other.desc'), icon: '❓'}
                            ].map(pest => (
                                <OptionCard 
                                    key={pest.id}
                                    icon={pest.icon}
                                    title={pest.label}
                                    description={pest.desc}
                                    selected={config.pestType === pest.id}
                                    onClick={() => setConfig({
                                        ...config, 
                                        pestType: pest.id,
                                        pests: [] // reset specific list when category changes
                                    })}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.pest.target')}</label>
                        <div className="flex flex-wrap gap-1.5">
                            {config.pestType === 'Insects' ? (
                                ['Ants', 'Wasps', 'Bedbugs', 'Cockroaches', 'Fleas'].map(name => {
                                    const pests = config.pests || [];
                                    const active = pests.includes(name);
                                    return (
                                        <button 
                                            key={name}
                                            type="button"
                                            onClick={() => {
                                                const u = active ? pests.filter((p: string) => p !== name) : [...pests, name];
                                                setConfig({...config, pests: u});
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all uppercase tracking-wider ${active ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            {name === 'Ants' ? t('consultation.pest.target.ants') : name === 'Wasps' ? t('consultation.pest.target.wasps') : name === 'Bedbugs' ? t('consultation.pest.target.bedbugs') : name === 'Cockroaches' ? t('consultation.pest.target.cockroaches') : t('consultation.pest.target.fleas')}
                                        </button>
                                    );
                                })
                            ) : config.pestType === 'Rodents' ? (
                                ['Mice', 'Rats', 'Martens'].map(name => {
                                    const pests = config.pests || [];
                                    const active = pests.includes(name);
                                    return (
                                        <button 
                                            key={name}
                                            type="button"
                                            onClick={() => {
                                                const u = active ? pests.filter((p: string) => p !== name) : [...pests, name];
                                                setConfig({...config, pests: u});
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all uppercase tracking-wider ${active ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            {name === 'Mice' ? t('consultation.pest.target.mice') : name === 'Rats' ? t('consultation.pest.target.rats') : t('consultation.pest.target.martens')}
                                        </button>
                                    );
                                })
                            ) : (
                                <span className="text-[10px] text-gray-400 font-bold italic">{t('consultation.pest.target.placeholder')}</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.pest.urgency')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {id: 'Standard', label: t('consultation.pest.urgency.standard'), desc: t('consultation.pest.urgency.standard.desc'), icon: '📅'},
                                {id: 'Emergency', label: t('consultation.pest.urgency.emergency'), desc: t('consultation.pest.urgency.emergency.desc'), icon: '🚨'}
                            ].map(urg => (
                                <OptionCard 
                                    key={urg.id}
                                    icon={urg.icon}
                                    title={urg.label}
                                    description={urg.desc}
                                    selected={config.urgency === urg.id}
                                    onClick={() => setConfig({...config, urgency: urg.id})}
                                />
                            ))}
                        </div>
                    </div>

                    {config.urgency === 'Emergency' && (
                        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl animate-fade-in text-[10px] text-yellow-700 leading-normal">
                            {t('consultation.pest.emergency.notice')}
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.pest.property')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                {id: 'Residential', icon: '🏠', label: t('consultation.pest.property.residential')},
                                {id: 'Commercial', icon: '🏢', label: t('consultation.pest.property.commercial')},
                                {id: 'Garden', icon: '🌳', label: t('consultation.pest.property.garden')}
                            ].map(pt => (
                                <OptionCard 
                                    key={pt.id}
                                    icon={pt.icon}
                                    title={pt.label}
                                    selected={config.propertyType === pt.id}
                                    onClick={() => setConfig({...config, propertyType: pt.id})}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.pest.shields')}</label>
                        <div className="space-y-2">
                            <OptionCard 
                                icon="🛡️" 
                                title={t('consultation.pest.seal')} 
                                description={t('consultation.pest.seal.desc')} 
                                price="+120.00 CHF" 
                                selected={!!config.pestSeal} 
                                onClick={() => setConfig({...config, pestSeal: !config.pestSeal})} 
                            />
                            <OptionCard 
                                icon="🐕" 
                                title={t('consultation.pest.followup')} 
                                description={t('consultation.pest.followup.desc')} 
                                price="+80.00 CHF" 
                                selected={!!config.pestFollowUp} 
                                onClick={() => setConfig({...config, pestFollowUp: !config.pestFollowUp})} 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('consultation.pest.observations')}</label>
                        <textarea 
                            placeholder={t('consultation.pest.observations.placeholder')} 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] text-xs font-medium text-gray-700 min-h-[80px]" 
                            value={config.description || ''} 
                            onChange={(e) => setConfig({...config, description: e.target.value})}
                        />
                    </div>

                </div>
                {/* Sticky Footer */}
                <div className="p-5 bg-slate-50 border-t border-gray-100/90 z-10 flex flex-col gap-3 rounded-b-[2rem] shrink-0 shadow-xs">
                    <div className="flex justify-between items-center px-1">
                        <span className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider text-[#002D5B]">{t('consultation.pest.total')}</span>
                        <span className="font-black text-2xl text-[#007bff]">CHF {getEstimatedPrice().toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleAddToCart} 
                        className="w-full bg-[#007bff] hover:bg-blue-600 active:scale-[0.98] text-white py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all"
                    >
                        {editingItemId ? t('consultation.pest.update') : t('consultation.pest.checkout')}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Waste Management */}
        {activeModal === 'waste-management' && (
            <ModalOverlay title={t('services.waste.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }} size="lg" noScroll={true}>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white text-gray-800">
                    <button 
                        type="button"
                        onClick={() => setShowInclusionsModal('waste-management')} 
                        className="w-full text-left text-[#007bff] text-xs font-bold flex items-center justify-between bg-blue-50/40 p-3.5 px-4 rounded-2xl border border-blue-100/80 hover:bg-blue-50/70 transition-all select-none group"
                    >
                        <div className="flex items-center gap-3">
                            <InfoIcon className="w-5 h-5 text-[#007bff] shrink-0" />
                            <span className="text-sm font-bold">{t('consultation.whatsIncluded')}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-[#007bff] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.waste.category')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {id: 'Household', icon: '🏠', title: t('consultation.waste.category.household'), desc: t('consultation.waste.category.household.desc')},
                                {id: 'Office', icon: '🏢', title: t('consultation.waste.category.office'), desc: t('consultation.waste.category.office.desc')},
                                {id: 'Construction', icon: '🏗️', title: t('consultation.waste.category.construction'), desc: t('consultation.waste.category.construction.desc')},
                                {id: 'Electronic', icon: '💻', title: t('consultation.waste.category.electronic'), desc: t('consultation.waste.category.electronic.desc')}
                            ].map(w => (
                                <OptionCard 
                                    key={w.id}
                                    icon={w.icon}
                                    title={w.title}
                                    description={w.desc}
                                    selected={config.wasteType === w.id}
                                    onClick={() => setConfig({...config, wasteType: w.id})}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('consultation.waste.inventory')}</label>
                        <div className="space-y-2">
                            {[
                                {id: 'sofa', name: t('consultation.waste.item.sofa'), icon: '🛋️', rate: t('consultation.waste.item.sofa.rate')},
                                {id: 'mattress', name: t('consultation.waste.item.mattress'), icon: '🛏️', rate: t('consultation.waste.item.mattress.rate')},
                                {id: 'appliance', name: t('consultation.waste.item.appliance'), icon: '🔌', rate: t('consultation.waste.item.appliance.rate')},
                                {id: 'boxes', name: t('consultation.waste.item.boxes'), icon: '📦', rate: t('consultation.waste.item.boxes.rate')}
                            ].map(item => {
                                const currentCount = config.items?.[item.id] || 0;
                                return (
                                    <div key={item.id} className="flex justify-between items-center bg-gray-55/40 border border-gray-100 rounded-xl p-3 bg-white">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{item.icon}</span>
                                            <div>
                                                <h5 className="text-xs font-bold text-gray-700">{item.name}</h5>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase">{item.rate}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const current = config.items || {};
                                                    const val = Math.max(0, currentCount - 1);
                                                    setConfig({...config, items: { ...current, [item.id]: val }});
                                                }}
                                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-black hover:bg-gray-55 text-gray-600 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold text-sm text-gray-700 min-w-[20px] text-center">{currentCount}</span>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const current = config.items || {};
                                                    const val = currentCount + 1;
                                                    setConfig({...config, items: { ...current, [item.id]: val }});
                                                }}
                                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-black hover:bg-gray-55 text-gray-600 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('consultation.waste.access')}</label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {['Lift', 'Stairs'].map(acc => (
                                    <button 
                                        key={acc}
                                        type="button"
                                        onClick={() => setConfig({...config, accessStyle: acc})}
                                        className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${config.accessStyle === acc ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {acc === 'Lift' ? t('consultation.waste.access.lift') : t('consultation.waste.access.stairs')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {config.accessStyle === 'Stairs' && (
                            <div className="animate-fade-in">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('consultation.waste.access.floor')}</label>
                                <CounterInput 
                                    label={t('consultation.waste.access.floor_label')} 
                                    value={config.stairsFloorCount || 1} 
                                    onChange={(v) => setConfig({...config, stairsFloorCount: v})} 
                                />
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={!!config.needsCertificate} 
                                onChange={(e) => setConfig({...config, needsCertificate: e.target.checked})}
                                className="w-4 h-4 text-[#007bff] focus:ring-[#007bff] border-gray-300 rounded"
                            />
                            <div>
                                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t('consultation.waste.certificate')}</h5>
                                <p className="text-[9px] text-gray-400">{t('consultation.waste.certificate.desc')}</p>
                            </div>
                        </label>
                    </div>

                    {/* Hazardous Materials Compliance Banner */}
                    <div className="bg-yellow-50 border border-yellow-105 p-4 rounded-2xl">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">⚠️</span>
                                <h5 className="text-xs font-bold text-yellow-800 uppercase tracking-wider">{t('consultation.waste.hazardous')}</h5>
                            </div>
                            <p className="text-[10px] text-yellow-700 leading-normal">
                                {t('consultation.waste.hazardous.desc')}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setConfig({...config, hasHazardous: true})} 
                                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${config.hasHazardous ? 'bg-red-600 border-red-600 text-white shadow-sm hover:bg-red-700' : 'bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-100'}`}
                                >
                                    {t('consultation.waste.hazardous.yes')}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setConfig({...config, hasHazardous: false})} 
                                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${config.hasHazardous === false ? 'bg-green-600 border-green-600 text-white shadow-sm hover:bg-green-705' : 'bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-100'}`}
                                >
                                    {t('consultation.waste.hazardous.no')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {config.hasHazardous && (
                        <div className="p-4 bg-red-50 border border-red-150 rounded-2xl animate-fade-in text-[11px] text-red-700 font-bold leading-normal">
                            {t('consultation.waste.hazardous.lockout')}
                        </div>
                    )}

                </div>
                {/* Sticky Footer */}
                <div className="p-5 bg-slate-50 border-t border-gray-100/90 z-10 flex flex-col gap-3 rounded-b-[2rem] shrink-0 shadow-xs">
                    <div className="flex justify-between items-center px-1">
                        <span className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider text-[#002D5B]">{t('consultation.waste.total')}</span>
                        <span className="font-black text-2xl text-[#007bff]">
                            {config.hasHazardous ? t('consultation.waste.total.blocked') : `CHF ${getEstimatedPrice().toFixed(2)}`}
                        </span>
                    </div>
                    <button 
                        onClick={handleAddToCart} 
                        disabled={config.hasHazardous}
                        className={`w-full active:scale-[0.98] text-white py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all ${config.hasHazardous ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-[#007bff] hover:bg-blue-600'}`}
                    >
                        {editingItemId ? t('consultation.waste.update') : t('consultation.waste.checkout')}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* --- FINAL CONTACT FORM MODAL --- */}
        {isContactModalOpen && (
            <ModalOverlay 
                title={
                    submittedRequestData 
                        ? (submittedRequestData.payrexxLink 
                            ? mt(
                                "💳 Secure Deposit Payment",
                                "💳 Pago Seguro del Depósito",
                                "💳 Sichere Anzahlung",
                                "💳 Acompte sécurisé",
                                "💳 Pagamento sicuro del deposito",
                                "💳 Pagamento seguro do depósito"
                              )
                            : (t('consultation.success.modalTitle') || "✓ Request Submitted"))
                        : mt(
                            "Finalize & Request Final Quote",
                            "Finalizar y Solicitar Presupuesto Final",
                            "Abschliessen & endgültige Offerte anfordern",
                            "Finaliser et demander le devis final",
                            "Finalizza e richiedi il preventivo finale",
                            "Finalizar e solicitar orçamento final"
                          )
                } 
                onClose={() => setContactModalOpen(false)} 
                size={submittedRequestData && submittedRequestData.payrexxLink ? "xl" : "lg"}
                noScroll={true}
            >
                {submittedRequestData ? (
                    <div className={`${submittedRequestData.payrexxLink ? "p-0 flex flex-col min-h-0 overflow-hidden" : "p-6 overflow-y-auto custom-scrollbar"} flex-1 bg-white`}>
                        {(() => {
                            const lang = language || 'es';
                            const texts = getSuccessTexts(lang, onlyComics);
                        const isDirect = submittedRequestData.bookingMode === 'direct';
                        const formattedDate = formatSuccessDate(submittedRequestData.date, lang);

                        const paymentTexts = {
                            es: {
                                title: onlyComics ? "💳 Pago Completo del Cómic Requerido" : "💳 Pago Seguro del Depósito Requerido",
                                subtitle: onlyComics 
                                    ? "Tu pedido de cómics se ha registrado. Para confirmar y procesar el envío a tu dirección postal, es necesario completar el pago total del 100%."
                                    : "Tu solicitud de reserva express se ha registrado. Para asegurar tu fecha y confirmar tu servicio, es necesario completar el pago del depósito del 15%.",
                                howItWorks: onlyComics 
                                    ? "El pago se procesa mediante la pasarela segura Payrexx, donde podrás elegir el método de pago que prefieras (Tarjeta, TWINT, Apple Pay, etc.)."
                                    : "Tu fecha seleccionada está pre-reservada durante 15 minutos en nuestro sistema. El pago se procesa mediante la pasarela segura Payrexx, donde podrás elegir el método de pago que prefieras (Tarjeta, TWINT, Apple Pay, etc.).",
                                payAction: onlyComics ? "PAGAR CÓMIC COMPLETO CON PAYREXX AHORA" : "PAGAR DEPÓSITO CON PAYREXX AHORA",
                                disclaimer: onlyComics 
                                    ? "Nota: Si cierras esta ventana sin realizar el pago, tu pedido de cómics no podrá procesarse."
                                    : "Nota: Si cierras esta ventana sin realizar el pago, la fecha elegida volverá a quedar libre en el sistema inmediatamente.",
                                depositLabel: onlyComics ? "Pago Completo AHORA (100%)" : "Depósito / Fianza a pagar ahora",
                                totalLabel: "Importe total del pedido",
                                remainingLabel: onlyComics ? "Saldo restante (0.00)" : "Saldo restante (fijado y cobrado después)",
                                helpNote: "Al pulsar, te redirigiremos a Payrexx para elegir tu método de pago y abonar el importe total de forma segura.",
                                speechBubble: onlyComics 
                                    ? "¡Hola! Soy Kai. Tu pedido de cómic está listo. Completa este paso y te lo enviamos por correo." 
                                    : "¡Hola! Soy Kai. Tu reserva está casi lista. Completa este paso para asegurar tu fecha hoy mismo.",
                                badgeSecure: "Pasarela Encriptada SSL/TLS",
                                badgeData: "Privacidad de Datos GDPR",
                                badgeProcess: "Procesamiento Instantáneo",
                                footerQ1: "¿Es seguro el pago?",
                                footerA1: "Sí, usamos encriptación SSL de nivel militar y la pasarela certificada Payrexx con soporte 3D Secure.",
                                footerQ2: "¿Cómo se guarda mi información?",
                                footerA2: "Todos tus datos de contacto y detalles de envío están encriptados y protegidos bajo la normativa GDPR.",
                                footerQ3: "¿Qué pasa después de pagar?",
                                footerA3: "Recibirás una confirmación por correo al instante y prepararemos tu paquete para el envío postal a tu dirección.",
                                footerQ4: "¿Necesitas ayuda?",
                                footerA4: "Soporte activo vía WhatsApp o email las 24 horas del día para solucionar cualquier duda.",
                            },
                            en: {
                                title: onlyComics ? "💳 Full Payment Required for Comic Order" : "💳 Secure Deposit Payment Required",
                                subtitle: onlyComics 
                                    ? "Your comic book order has been registered. To confirm and ship the item to your postal address, full payment (100%) is required."
                                    : "Your express booking request has been registered. To secure your chosen date and confirm your service, completing the 15% deposit payment is required.",
                                howItWorks: "The payment is processed securely via Payrexx, where you can choose your preferred payment method (Card, TWINT, Apple Pay, etc.).",
                                payAction: onlyComics ? "PAY FOR COMICS IN FULL WITH PAYREXX" : "PAY DEPOSIT SECURELY WITH PAYREXX NOW",
                                disclaimer: onlyComics 
                                    ? "Note: If you close this window without paying, your comic order cannot be processed."
                                    : "Note: If you close this window without paying, your selected date will be released in our system immediately.",
                                depositLabel: onlyComics ? "Full Payment Due Now (100%)" : "Deposit amount due now",
                                totalLabel: "Total order price",
                                remainingLabel: onlyComics ? "Remaining balance (0.00)" : "Remaining balance (due upon completion)",
                                helpNote: "Once clicked, you will be redirected to Payrexx to choose your payment method and pay securely.",
                                speechBubble: onlyComics 
                                    ? "Hey there! I'm Kai. Your comic book order is ready. Finish payment to get it shipped!" 
                                    : "Hey there! I'm Kai. Your booking is almost locked. Finish this step to secure your spot today!",
                                badgeSecure: "SSL/TLS Encrypted Gateway",
                                badgeData: "GDPR Compliant Privacy",
                                badgeProcess: "Instant Order Confirmation",
                                footerQ1: "Is this payment safe?",
                                footerA1: "Yes, we use military-grade SSL encryption and the PCI-compliant Payrexx gateway with full 3D Secure support.",
                                footerQ2: "How is my data protected?",
                                footerA2: "All contact information and shipping details are securely encrypted and handled in strict accordance with GDPR laws.",
                                footerQ3: "What happens after paying?",
                                footerA3: "You'll receive an instant email confirmation and we will prepare your comic package for postal shipping.",
                                footerQ4: "Need any assistance?",
                                footerA4: "Our customer support team is available 24/7 via WhatsApp or email to answer any reservation or payment questions.",
                            },
                            de: {
                                title: onlyComics ? "💳 Vollständige Zahlung für Comic erforderlich" : "💳 Sichere Anzahlung erforderlich",
                                subtitle: onlyComics 
                                    ? "Ihre Comic-Bestellung wurde registriert. Um den Versand an Ihre Postadresse zu bestätigen, ist die vollständige Zahlung (100%) erforderlich."
                                    : "Ihre Express-Buchung wurde registriert. Um Ihr Wunschdatum definitiv zu sperren und den Service zu bestätigen, ist die Zahlung des Deposits von 15% erforderlich.",
                                howItWorks: "Die Zahlung wird absolut sicher via Payrexx abgewickelt. Sie können dort Ihre bevorzugte Zahlungsmethode wählen (Kreditkarte, TWINT, Apple Pay etc.).",
                                payAction: onlyComics ? "COMIC JETZT VOLLSTÄNDIG BEZAHLEN" : "ANZAHLUNG JETZT MIT PAYREXX BEZAHLEN",
                                disclaimer: onlyComics 
                                    ? "Hinweis: Wenn Sie dieses Fenster schließen, ohne zu bezahlen, kann Ihre Bestellung nicht bearbeitet werden."
                                    : "Hinweis: Wenn Sie dieses Fenster schließen, ohne zu bezahlen, wird Ihr Wunschdatum sofort wieder freigegeben.",
                                depositLabel: onlyComics ? "Vollständige Zahlung (100%)" : "Anzahlung jetzt fällig",
                                totalLabel: "Gesamtbetrag der Bestellung",
                                remainingLabel: onlyComics ? "Restbetrag (0.00)" : "Restbetrag nach Fertigstellung",
                                helpNote: "Nach dem Klicken werden Sie zu Payrexx weitergeleitet, um Ihre Zahlungsmethode zu wählen.",
                                speechBubble: onlyComics 
                                    ? "Hallo! Ich bin Kai. Ihre Comic-Bestellung ist bereit. Schließen Sie die Zahlung ab für den Postversand!" 
                                    : "Hallo! Ich bin Kai. Ihre Buchung ist fast fertig. Schließen Sie diesen Schritt ab, um Ihr Datum zu sichern!",
                                badgeSecure: "SSL/TLS Verschlüsseltes Gateway",
                                badgeData: "DSGVO Datenschutz",
                                badgeProcess: "Sofortige Bestätigung",
                                footerQ1: "Ist die Zahlung sicher?",
                                footerA1: "Ja, wir verwenden SSL-Verschlüsselung auf Militärniveau und das PCI-konforme Payrexx-Gateway mit 3D Secure.",
                                footerQ2: "Wie werden meine Daten geschützt?",
                                footerA2: "Alle Kontaktdaten und Lieferadresse werden verschlüsselt und streng nach DSGVO behandelt.",
                                footerQ3: "Was passiert nach der Zahlung?",
                                footerA3: "Sie erhalten sofort eine Bestätigung per E-Mail und wir bereiten Ihr Comic-Paket für den Postversand vor.",
                                footerQ4: "Benötigen Sie Hilfe?",
                                footerA4: "Unser Kundensupport ist rund um die Uhr per WhatsApp oder E-Mail erreichbar.",
                            },
                            fr: {
                                title: onlyComics ? "💳 Paiement complet requis pour la bande dessinée" : "💳 Acompte sécurisé requis",
                                subtitle: onlyComics 
                                    ? "Votre commande de bande dessinée est enregistrée. Pour confirmer l'expédition à votre adresse postale, le paiement intégral (100%) est requis."
                                    : "Votre demande de réservation express a été enregistrée. Pour sécuriser votre créneau et confirmer votre service, le paiement de l'acompte de 15% est obligatoire.",
                                howItWorks: "Le paiement est entièrement sécurisé par Payrexx, où vous pouvez choisir votre méthode préférée (Carte, TWINT, Apple Pay, etc.).",
                                payAction: onlyComics ? "PAYER LA BD INTÉGRALEMENT" : "PAYER L'ACOMPTE VIA PAYREXX",
                                disclaimer: onlyComics 
                                    ? "Note: Si vous fermez cette fenêtre sans payer, votre commande ne pourra pas être traitée."
                                    : "Note: Si vous fermez cette fenêtre sans payer, le créneau choisi sera immédiatement libéré dans notre système.",
                                depositLabel: onlyComics ? "Paiement intégral (100%)" : "Acompte à payer maintenant",
                                totalLabel: "Montant total de la commande",
                                remainingLabel: onlyComics ? "Solde restant (0.00)" : "Solde restant (à payer à la fin)",
                                helpNote: "Une fois cliqué, vous serez redirigé vers Payrexx pour choisir votre mode de paiement et payer en toute sécurité.",
                                speechBubble: onlyComics 
                                    ? "Salut ! Je suis Kai. Votre commande de BD est prête. Finalisez le paiement pour l'expédition !" 
                                    : "Salut ! Je suis Kai. Votre réservation est presque verrouillée. Finalisez cette étape pour garantir votre créneau aujourd'hui !",
                                badgeSecure: "Passerelle Cryptée SSL/TLS",
                                badgeData: "Confidentialité RGPD",
                                badgeProcess: "Traitement Instantané",
                                footerQ1: "Le paiement est-il sécurisé ?",
                                footerA1: "Oui, nous utilisons un cryptage SSL de niveau militaire et la passerelle certifiée Payrexx avec support 3D Secure.",
                                footerQ2: "Comment mes données sont-elles protégées ?",
                                footerA2: "Toutes vos coordonnées et adresse de livraison sont cryptées et gérées conformément au RGPD.",
                                footerQ3: "Que se passe-t-il après le paiement ?",
                                footerA3: "Vous recevrez une confirmation instantanée par e-mail et nous préparerons votre colis pour l'envoi postal.",
                                footerQ4: "Besoin d'assistance ?",
                                footerA4: "Notre équipe de support est disponible 24/7 via WhatsApp ou e-mail.",
                            }
                        };
                        
                        const handleAddToCalendar = () => {
                            if (!submittedRequestData) return;
                            const { formattedId, date, time, address } = submittedRequestData;
                            const startStr = date ? date.replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '');
                            const startTimeStr = time ? time.split(' - ')[0].replace(':', '') : '1400';
                            const endTimeStr = time ? time.split(' - ')[1].replace(':', '') : '2100';

                            const icsContent = [
                                'BEGIN:VCALENDAR',
                                'VERSION:2.0',
                                'CALSCALE:GREGORIAN',
                                'BEGIN:VEVENT',
                                `SUMMARY:Booking. ${formattedId}`,
                                `DTSTART;VALUE=DATE-TIME:${startStr}T${startTimeStr}00`,
                                `DTEND;VALUE=DATE-TIME:${startStr}T${endTimeStr}00`,
                                `LOCATION:${address}`,
                                'DESCRIPTION:Kraken Properties & Facilities Management service booking confirmed.',
                                'STATUS:CONFIRMED',
                                'END:VEVENT',
                                'END:VCALENDAR'
                            ].join('\r\n');

                            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
                            const link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.setAttribute('download', `booking-${formattedId}.ics`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        };

                        if (submittedRequestData.payrexxLink) {
                            const pTexts = paymentTexts[lang as keyof typeof paymentTexts] || paymentTexts.en;
                            return (
                                <div className="flex-1 flex flex-col min-h-0 bg-white">
                                    <div className="flex-1 flex flex-col md:flex-row min-h-0">
                                        {/* LEFT COLUMN: Mascot column with gorgeous background */}
                                        <div className="hidden md:flex md:w-[42%] bg-[#F0F6FF] p-6 sm:p-8 flex-col justify-between items-center relative overflow-hidden md:border-r border-gray-100 min-h-0">
                                            {/* Speech Bubble */}
                                            <div className="relative bg-white text-[#002D5B] text-xs sm:text-sm font-extrabold p-4 rounded-2xl shadow-md border border-blue-100/70 text-center max-w-[280px] animate-fade-in">
                                                {pTexts.speechBubble}
                                                {/* Speech bubble tail pointing down */}
                                                <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-blue-100/70"></div>
                                            </div>

                                            {/* Mascot image */}
                                            <div className="flex-1 flex items-center justify-center my-6 max-h-[220px]">
                                                <img 
                                                    src="/ChatGPT%20Image%20Jul%201,%202026,%2010_36_53%20AM.png" 
                                                    alt="Kai Kraken Mascot" 
                                                    className="max-h-[200px] w-auto object-contain animate-float"
                                                    referrerPolicy="no-referrer"
                                                />
                                            </div>

                                            {/* Trust Badges Row */}
                                            <div className="bg-white p-3.5 rounded-2xl border border-blue-100/40 shadow-xs flex justify-around items-center w-full max-w-[320px] text-[8.5px] font-bold text-[#002D5B] gap-1 shrink-0">
                                                <div className="flex flex-col items-center text-center flex-1">
                                                    <span className="text-sm">🛡️</span>
                                                    <span className="mt-1 leading-tight">{pTexts.badgeSecure}</span>
                                                </div>
                                                <div className="h-6 w-[1px] bg-blue-100"></div>
                                                <div className="flex flex-col items-center text-center flex-1">
                                                    <span className="text-sm">🔒</span>
                                                    <span className="mt-1 leading-tight">{pTexts.badgeData}</span>
                                                </div>
                                                <div className="h-6 w-[1px] bg-blue-100"></div>
                                                <div className="flex flex-col items-center text-center flex-1">
                                                    <span className="text-sm">✓</span>
                                                    <span className="mt-1 leading-tight">{pTexts.badgeProcess}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT COLUMN: Interactive Form with Totals */}
                                        <div className="w-full md:w-[58%] p-4 sm:p-8 flex flex-col justify-start md:justify-center items-center space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar bg-white flex-1 min-h-0">
                                            {/* Circular padlock icon */}
                                            <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-[#002D5B] rounded-full flex items-center justify-center shadow-3xs">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                                </svg>
                                            </div>

                                            {/* Heading */}
                                            <div className="space-y-1 text-center">
                                                <h2 className="text-lg sm:text-xl font-extrabold text-[#002D5B] tracking-tight leading-snug">
                                                    {pTexts.title}
                                                </h2>
                                                <p className="text-[11.5px] text-gray-500 font-bold max-w-sm leading-relaxed text-center">
                                                    {pTexts.subtitle}
                                                </p>
                                            </div>

                                            {/* Pre-reserved info notice */}
                                            <div className="bg-[#EBF3FE] border border-blue-100/70 p-3.5 rounded-2xl text-[10px] sm:text-[10.5px] text-blue-900 font-bold leading-relaxed flex items-start gap-2.5 w-full max-w-sm">
                                                <span className="text-blue-500 text-sm mt-0.5 shrink-0">🕒</span>
                                                <span>{pTexts.howItWorks}</span>
                                            </div>

                                            {/* Invoice Overview Card */}
                                            <div className="w-full bg-[#FAF8F5] p-5 rounded-2xl border border-gray-150/80 shadow-3xs space-y-2.5 text-left text-xs w-full max-w-sm">
                                                <div className="flex justify-between items-center font-bold text-gray-400 text-[10px]">
                                                    <span>{lang === 'es' ? 'Localizador Booking' : 'Booking Locator'}</span>
                                                    <span className="font-extrabold text-[#002D5B] font-mono tracking-wider">{submittedRequestData.formattedId || submittedRequestData.id}</span>
                                                </div>
                                                <div className="border-t border-dashed border-gray-200/60 my-1"></div>
                                                <div className="flex justify-between items-center font-bold text-[#002D5B]">
                                                    <span>{pTexts.depositLabel}</span>
                                                    <span className="font-black text-lg text-[#00B272]">CHF {submittedRequestData.depositAmount.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center font-bold text-gray-500 text-[11px]">
                                                    <span>{pTexts.totalLabel}</span>
                                                    <span>CHF {submittedRequestData.grandTotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center font-bold text-gray-400 text-[11px]">
                                                    <span>{pTexts.remainingLabel}</span>
                                                    <span>CHF {submittedRequestData.remainingBalance.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Yellow Warning */}
                                            <div className="bg-[#FFF9EB] border border-amber-100 p-3.5 rounded-xl text-[9.5px] text-amber-700 font-bold leading-relaxed flex items-start gap-2 w-full max-w-sm">
                                                <span className="text-amber-500 text-sm shrink-0">⚠️</span>
                                                <span>{pTexts.disclaimer}</span>
                                            </div>

                                            {/* CTAs */}
                                            <div className="w-full max-w-sm space-y-3 pt-1">
                                                <a 
                                                    href={submittedRequestData.payrexxLink}
                                                    target="_blank"
                                                    referrerPolicy="no-referrer"
                                                    className="w-full flex items-center justify-center gap-2 bg-[#00B272] hover:bg-[#009c63] active:scale-[0.98] text-white py-3.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-center shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all duration-300 transform active:translate-y-px"
                                                >
                                                    <span>🔒 {pTexts.payAction}</span>
                                                </a>

                                                <p className="text-center text-[9px] text-gray-400 font-bold italic leading-relaxed px-2">
                                                    {pTexts.helpNote}
                                                </p>

                                                <button
                                                    onClick={() => setContactModalOpen(false)}
                                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 py-3 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer text-center"
                                                    type="button"
                                                >
                                                    {lang === 'es' ? 'VOLVER / CANCELAR' : lang === 'de' ? 'ZURÜCK / ABBRECHEN' : lang === 'fr' ? 'RETOUR / ANNULER' : 'BACK / CANCEL'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BOTTOM DARK BLUE TRUST BAR */}
                                    <div className="hidden md:flex bg-[#002D5B] text-white p-6 sm:p-7 flex-row justify-between items-center gap-6 relative border-t border-blue-900 overflow-hidden shrink-0">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left relative z-10 pr-0 md:pr-16">
                                            {/* Column 1 */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-blue-300 font-bold text-[10.5px] uppercase tracking-wider">
                                                    <span>🛡️</span>
                                                    <span>{pTexts.footerQ1}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                                                    {pTexts.footerA1}
                                                </p>
                                            </div>
                                            {/* Column 2 */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-blue-300 font-bold text-[10.5px] uppercase tracking-wider">
                                                    <span>🔒</span>
                                                    <span>{pTexts.footerQ2}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                                                    {pTexts.footerA2}
                                                </p>
                                            </div>
                                            {/* Column 3 */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-blue-300 font-bold text-[10.5px] uppercase tracking-wider">
                                                    <span>✓</span>
                                                    <span>{pTexts.footerQ3}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                                                    {pTexts.footerA3}
                                                </p>
                                            </div>
                                            {/* Column 4 */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-blue-300 font-bold text-[10.5px] uppercase tracking-wider">
                                                    <span>📞</span>
                                                    <span>{pTexts.footerQ4}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                                                    {pTexts.footerA4}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Peeking Mascot on the right */}
                                        <div className="absolute right-4 bottom-0 w-16 h-16 pointer-events-none hidden lg:block select-none overflow-visible">
                                            <img 
                                                src="/ChatGPT%20Image%20Jul%201,%202026,%2010_36_53%20AM.png" 
                                                alt="Kai peeking" 
                                                className="w-full h-auto object-contain transform translate-y-3.5 scale-x-[-1] opacity-90"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-6 py-4 animate-fade-in flex flex-col items-center max-w-md mx-auto relative font-sans">
                                
                                {/* Centered Status Badge Icon */}
                                {isDirect ? (
                                    <div className="w-14 h-14 bg-[#107047] text-white rounded-full flex items-center justify-center shadow-md shrink-0">
                                        <CheckIcon className="w-7 h-7 stroke-[3.5]" />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 bg-[#002D5B] text-white rounded-full flex items-center justify-center shadow-md shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 animate-pulse">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Header & Order Ref */}
                                <div className="space-y-1.5 text-center">
                                    <h2 className="text-xl sm:text-2xl font-black text-[#002D5B] tracking-tight leading-snug">
                                        {isDirect ? texts.thanksConfirm : texts.thanksReceipt}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-500 font-bold">
                                        {isDirect 
                                            ? `${texts.bookingNo} ${submittedRequestData.formattedId}` 
                                            : texts.weAreReviewing
                                        }
                                    </p>
                                </div>

                                {/* Cream Summary Card Container */}
                                <div className="w-full bg-[#FAF8F5] p-5 rounded-[2rem] border border-gray-100/90 shadow-xs space-y-3.5 text-left text-xs max-w-sm mx-auto">
                                    {isDirect ? (
                                        <>
                                            {/* Row 1: Direct indicator with Zap icon / BoltIcon */}
                                            <div className="flex items-center gap-3 font-extrabold text-[#002D5B]">
                                                <BoltIcon className="w-4 h-4 text-[#002D5B] shrink-0" />
                                                <span className="uppercase tracking-wider text-[11px]">{texts.reservaExpress}</span>
                                            </div>
                                            {/* Row 2: Date-Time */}
                                            <div className="flex items-center gap-3 font-bold text-gray-600">
                                                <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                                <span>{formattedDate} • {submittedRequestData.time}</span>
                                            </div>
                                            {/* Row 3: Address */}
                                            <div className="flex items-center gap-3 font-bold text-gray-600">
                                                <MapPinIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                                <span className="truncate max-w-[280px]">{submittedRequestData.address}</span>
                                            </div>

                                            <div className="border-t border-dashed border-gray-200/90 my-2"></div>

                                            {/* Paid Row */}
                                            <div className="flex justify-between items-center font-bold text-gray-500">
                                                <span>{texts.paidToday}</span>
                                                <span className="font-extrabold text-sm text-gray-900">CHF {submittedRequestData.depositAmount.toFixed(2)}</span>
                                            </div>
                                            {/* Balance Row */}
                                            <div className="flex justify-between items-center font-bold text-gray-400">
                                                <span>{texts.balanceDue}</span>
                                                <span className="font-bold text-gray-600 text-xs">CHF {submittedRequestData.remainingBalance.toFixed(2)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Row 1: Files indicator with DocumentTextIcon */}
                                            <div className="flex items-center gap-3 font-extrabold text-[#002D5B]">
                                                <DocumentTextIcon className="w-4 h-4 text-blue-600 shrink-0" />
                                                <span className="tracking-wide">
                                                    {submittedRequestData.filesCount === 0 ? (
                                                        <span>{lang === 'es' ? 'No se adjuntaron archivos' : 'No attached files'}</span>
                                                    ) : submittedRequestData.filesCount === 1 ? (
                                                        <span>{texts.singleFileReceived}</span>
                                                    ) : (
                                                        <span>
                                                            {texts.filesReceived
                                                                .replace('{count}', submittedRequestData.filesCount)
                                                                .replace('{photos}', submittedRequestData.photosCount)
                                                                .replace('{videos}', submittedRequestData.videosCount)
                                                            }
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            {/* Row 2: Address */}
                                            <div className="flex items-center gap-3 font-bold text-gray-600">
                                                <MapPinIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                                <span className="truncate max-w-[280px]">{submittedRequestData.address}</span>
                                            </div>
                                            {/* Row 3: Requested Date */}
                                            <div className="flex items-center gap-3 font-bold text-gray-600">
                                                <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                                <span>{lang === 'es' ? `Solicitado el ${formattedDate}` : `Requested on ${formattedDate}`}</span>
                                            </div>

                                            <div className="border-t border-dashed border-gray-200/90 my-2"></div>

                                            {/* Review Fee Row */}
                                            <div className="flex justify-between items-center font-bold text-gray-600">
                                                <span>{texts.feePaid}</span>
                                                <span className="font-black text-sm text-gray-900">CHF {submittedRequestData.depositAmount.toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Deducted details disclaimer for Precision Quote */}
                                {!isDirect && (
                                    <p className="text-[10px] text-gray-400 font-bold max-w-xs text-center px-4 leading-normal">
                                        {texts.deductedNotice}
                                    </p>
                                )}

                                {/* "What's Next / ¿Qué sigue ahora?" step layout */}
                                <div className="w-full text-left max-w-sm mx-auto space-y-3 pt-2">
                                    <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-wider">
                                        {texts.whatsNext}
                                    </h4>

                                    <div className="space-y-3.5">
                                        {/* Step 1 */}
                                        <div className="flex gap-3 items-start">
                                            <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-100">
                                                1
                                            </div>
                                            <p className="text-xs font-bold text-slate-600 leading-relaxed pt-0.5">
                                                {isDirect ? texts.step1Direct : texts.step1Validate}
                                            </p>
                                        </div>

                                        {/* Step 2 */}
                                        <div className="flex gap-3 items-start">
                                            <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-100">
                                                2
                                            </div>
                                            <p className="text-xs font-bold text-slate-600 leading-relaxed pt-0.5">
                                                {isDirect ? texts.step2Direct : texts.step2Validate}
                                            </p>
                                        </div>

                                        {/* Step 3 */}
                                        <div className="flex gap-3 items-start">
                                            {isDirect ? (
                                                <>
                                                    <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-100">
                                                        3
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-600 leading-relaxed pt-0.5">
                                                        {texts.step3Direct.replace('{date}', formattedDate)}
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                                                        <CheckIcon className="w-3.5 h-3.5 stroke-[3.5]" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-600 leading-relaxed pt-0.5">
                                                        {texts.step3Validate}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* CTA buttons block */}
                                <div className="w-full max-w-sm mx-auto pt-4 space-y-2.5 px-1">
                                    {isDirect ? (
                                        <>
                                            <button
                                                onClick={handleAddToCalendar}
                                                className="w-full bg-[#002D5B] hover:bg-[#083563] active:scale-[0.98] text-white py-4 rounded-[1.5rem] font-bold text-xs sm:text-sm uppercase tracking-widest text-center shadow-md transition-all duration-300 cursor-pointer"
                                                type="button"
                                            >
                                                📅 {texts.addCalendar}
                                            </button>
                                            
                                            {submittedRequestData.payrexxLink && (
                                                <a 
                                                    href={submittedRequestData.payrexxLink}
                                                    target="_blank"
                                                    referrerPolicy="no-referrer"
                                                    className="w-full block bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white py-3 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest text-center shadow-xs transition-all duration-300"
                                                >
                                                    💳 {t('consultation.success.payNow') || 'Secure Payment'} →
                                                </a>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-gray-400 font-bold text-[10px] sm:text-xs leading-normal pb-3 px-2">
                                                {texts.noActionRequired}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleSuccessPDFExport}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3.5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest text-center shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                                        type="button"
                                    >
                                        📄 {language === 'es' ? 'Descargar Presupuesto PDF' : (language === 'de' || language === 'de-CH') ? 'Offerte als PDF herunterladen' : language === 'fr' ? 'Télécharger le devis en PDF' : language === 'it' ? 'Scarica preventivo in PDF' : language === 'pt' ? 'Descarregar orçamento em PDF' : 'Download Estimate as PDF'}
                                    </button>

                                    <button
                                        onClick={() => setContactModalOpen(false)}
                                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3.5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer text-center"
                                        type="button"
                                    >
                                        {lang === 'es' ? 'Cerrar' : lang === 'de' ? 'Schließen' : lang === 'fr' ? 'Fermer' : 'Close'}
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                    </div>
                ) : (
                    <form onSubmit={ejecutarReservaYpago} className="animate-fade-in flex flex-col flex-1 min-h-0 overflow-hidden bg-white">
                    
                    {/* Visual Stepper Progress Bar */}
                    <div className="px-6 pt-6 mb-4 border-b border-gray-100 pb-5 shrink-0 bg-white">
                        <div className="flex justify-between items-center relative">
                            {/* Line connector */}
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 -z-10"></div>
                            {/* Active connection highlight */}
                            <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-[#007bff] -z-10 transition-all duration-300"
                                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                            ></div>

                            {[
                                { num: 1, label: t('consultation.step.schedule') },
                                { num: 2, label: t('consultation.step.method') },
                                { num: 3, label: t('consultation.step.location') },
                                { num: 4, label: t('consultation.step.access') },
                                { num: 5, label: t('consultation.step.payment') },
                            ].map((s) => {
                                const isCompleted = s.num < currentStep;
                                const isActive = s.num === currentStep;
                                return (
                                    <button
                                        key={s.num}
                                        type="button"
                                        onClick={() => {
                                            if (s.num <= currentStep) {
                                                setCurrentStep(s.num);
                                            }
                                        }}
                                        disabled={s.num > currentStep}
                                        className="flex flex-col items-center group relative focus:outline-none"
                                    >
                                        <div 
                                            className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 border-2 select-none ${
                                                isCompleted 
                                                    ? 'bg-[#007bff] border-[#007bff] text-white shadow-sm' 
                                                    : isActive 
                                                        ? 'bg-white border-[#007bff] text-[#007bff] ring-4 ring-blue-50 shadow-md font-extrabold scale-110' 
                                                        : 'bg-white border-gray-100 text-gray-400 group-hover:border-gray-300 hover:text-gray-600'
                                            }`}
                                        >
                                            {isCompleted ? <CheckIcon className="w-4 h-4" /> : s.num}
                                        </div>
                                        <span 
                                            className={`text-[9px] font-black uppercase tracking-widest mt-2 transition-all duration-300 ${
                                                isActive 
                                                    ? 'text-[#007bff] font-extrabold translate-y-0.5' 
                                                    : isCompleted 
                                                        ? 'text-gray-700' 
                                                        : 'text-gray-400 group-hover:text-gray-600'
                                            }`}
                                        >
                                            {s.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar min-h-0 bg-white">
                        {/* STEP 1: Horario & Identity */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                {/* Identity Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 bg-blue-50 rounded-lg text-[#007bff]"><EnvelopeIcon className="w-5 h-5" /></div>
                                        <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">{t('consultation.form.personalIdentity')}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="group relative">
                                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('consultation.form.fullName')}</label>
                                            <input 
                                                id="name"
                                                name="name" 
                                                placeholder={t('consultation.form.enterName')}
                                                className={`w-full p-4 bg-white border-2 rounded-[1.25rem] focus:border-[#007bff] focus:bg-blue-50/20 outline-none font-bold text-sm transition-all duration-300 shadow-sm ${errors.clientName ? 'border-red-500 bg-red-50 shake' : 'border-gray-100'}`} 
                                                value={clientName}
                                                onChange={(e) => setClientName(e.target.value)}
                                            />
                                            {errors.clientName && <span className="text-[10px] text-red-500 font-black mt-1 block ml-2">{errors.clientName}</span>}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="group">
                                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('consultation.form.emailAddress')}</label>
                                                <input 
                                                    name="email" 
                                                    type="email" 
                                                    placeholder="your@email.com"
                                                    className={`w-full p-4 bg-white border-2 rounded-[1.25rem] focus:border-[#007bff] focus:bg-blue-50/20 outline-none font-bold text-sm transition-all duration-300 shadow-sm ${errors.email ? 'border-red-500 bg-red-50 shake' : 'border-gray-100'}`} 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                {errors.email && <span className="text-[10px] text-red-500 font-black mt-1 block ml-2">{errors.email}</span>}
                                            </div>
                                            <div className="group">
                                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('consultation.form.phone')}</label>
                                                <div className="flex gap-2">
                                                    <select 
                                                        className="p-4 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] focus:border-[#007bff] outline-none font-bold text-xs min-w-[90px] shadow-sm cursor-pointer"
                                                        value={phonePrefix}
                                                        onChange={(e) => setPhonePrefix(e.target.value)}
                                                    >
                                                        <option value="+41">🇨🇭 +41</option>
                                                        <option value="+49">🇩🇪 +49</option>
                                                        <option value="+43">🇦🇹 +43</option>
                                                        <option value="+44">🇬🇧 +44</option>
                                                        <option value="+33">🇫🇷 +33</option>
                                                        <option value="+34">🇪🇸 +34</option>
                                                        <option value="+39">🇮🇹 +39</option>
                                                    </select>
                                                    <input 
                                                        name="phone" 
                                                        placeholder="77 000 00 00"
                                                        className={`flex-1 p-4 bg-white border-2 rounded-[1.25rem] focus:border-[#007bff] focus:bg-blue-50/20 outline-none font-bold text-sm transition-all duration-300 shadow-sm ${errors.phone ? 'border-red-500 bg-red-50 shake' : 'border-gray-100'}`} 
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                </div>
                                                {errors.phone && <span className="text-[10px] text-red-500 font-black mt-1 block ml-2">{errors.phone}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule Section */}
                                <div className="bg-slate-50/80 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><CalendarIcon className="w-5 h-5"/></div>
                                        <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">{t('consultation.form.preferredSchedule')}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className={`bg-white p-2 rounded-2xl shadow-sm border-2 ${errors.selectedDate ? 'border-red-500' : 'border-gray-100'}`}>
                                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-2 mt-2">{t('consultation.form.pickDate')}</label>
                                            <BookingCalendar selectedDate={selectedDate} onChange={setSelectedDate} hasError={!!errors.selectedDate} />
                                            {errors.selectedDate && <span className="text-[10px] text-red-500 font-black mt-1 block ml-2">{errors.selectedDate}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">{t('consultation.form.arrivalTime')}</label>
                                            <div className={`bg-white p-4 rounded-2xl shadow-sm border-2 ${errors.selectedTime ? 'border-red-500' : 'border-gray-100'}`}>
                                                <TimePicker selectedTime={selectedTime} onChange={setSelectedTime} hasError={!!errors.selectedTime} />
                                                {errors.selectedTime && <span className="text-[10px] text-red-500 font-black mt-1 block ml-2">{errors.selectedTime}</span>}
                                                {selectedTime && totalDuration > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center animate-fade-in">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('consultation.form.estWindow')}</span>
                                                        <div className="flex gap-2.5 items-center font-black text-[#002D5B] text-sm">
                                                            <span className="bg-[#007bff] text-white px-2 py-0.5 rounded-lg">{selectedTime}</span>
                                                            <span className="text-gray-300">→</span>
                                                            <span className="bg-[#002D5B] text-white px-2 py-0.5 rounded-lg">{calculateEndTime(selectedTime, totalDuration)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Método (Booking Mode Choice) */}
                        {currentStep === 2 && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><BoltIcon className="w-5 h-5" /></div>
                                        <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">
                                            {onlyComics ? (language === 'es' ? 'Método de Pago Completo' : 'Full Payment Method') : t('consultation.booking.title')}
                                        </h4>
                                    </div>
                                    <p className="ml-11 text-xs text-gray-500 font-bold tracking-tight">
                                        {onlyComics ? (language === 'es' ? 'Pago único directo del 100% de tu pedido (sin depósitos ni cuotas parciales)' : 'Single direct 100% full payment for your order (no partial deposits or fees)') : t('consultation.booking.subtitle')}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {onlyComics ? (
                                        <div 
                                            onClick={() => setBookingMode('direct')}
                                            className="p-6 rounded-[2rem] border-2 border-emerald-500 bg-emerald-50/50 shadow-lg scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
                                        >
                                            <div className="flex items-start gap-4 relative z-10 w-full">
                                                <div className="w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center text-3xl shadow-sm bg-emerald-500 text-white">
                                                    📦
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <div className="flex justify-between items-start mb-1 gap-2">
                                                        <h5 className="font-black text-base uppercase tracking-tight truncate text-emerald-700">
                                                            {language === 'es' ? 'PAGO COMPLETO (100%)' : 'FULL PAYMENT (100%)'}
                                                        </h5>
                                                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase shrink-0">
                                                            {language === 'es' ? 'CÓMICS + ENVÍO' : 'COMICS + SHIPPING'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
                                                        {language === 'es' 
                                                          ? 'Pago completo del total de tu pedido de cómics (100%). Sin depósitos parciales ni costes adicionales. Confirmación inmediata y envío postal a tu dirección.' 
                                                          : 'Full payment for your comic book order (100%). No partial deposits or hidden fees. Immediate confirmation and postal shipping to your address.'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="absolute top-4 right-4 text-emerald-500"><CheckIcon className="w-6 h-6" /></div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Option A: Express Binding */}
                                            <div 
                                                onClick={() => setBookingMode('direct')}
                                                className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden ${bookingMode === 'direct' ? 'border-[#007bff] bg-blue-50/50 shadow-lg scale-[1.02]' : errors.bookingMode ? 'border-red-500 bg-red-50/20' : 'border-gray-100 hover:border-blue-200 bg-white'}`}
                                            >
                                                <div className="flex items-start gap-4 relative z-10 w-full">
                                                    <div className={`w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center text-3xl shadow-sm transition-all ${bookingMode === 'direct' ? 'bg-[#007bff] text-white' : 'bg-slate-100 text-gray-400'}`}>🚀</div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1 gap-2">
                                                            <h5 className={`font-black text-base uppercase tracking-tight truncate ${bookingMode === 'direct' ? 'text-[#007bff]' : 'text-gray-800'}`}>{t('consultation.booking.optionA.title')}</h5>
                                                            <span className="bg-[#007bff] text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase shrink-0">{t('consultation.booking.optionA.subtitle')}</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">{t('consultation.booking.optionA.desc')}</p>
                                                    </div>
                                                </div>
                                                {bookingMode === 'direct' && <div className="absolute top-4 right-4 text-[#007bff]"><CheckIcon className="w-6 h-6" /></div>}
                                            </div>

                                            {/* Option B: Study & Validation */}
                                            <div 
                                                onClick={() => setBookingMode('validate')}
                                                className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden ${bookingMode === 'validate' ? 'border-emerald-500 bg-emerald-50/50 shadow-lg scale-[1.02]' : errors.bookingMode ? 'border-red-500 bg-red-50/20' : 'border-gray-100 hover:border-emerald-200 bg-white'}`}
                                            >
                                                <div className="flex items-start gap-4 relative z-10 w-full">
                                                    <div className={`w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center text-3xl shadow-sm transition-all ${bookingMode === 'validate' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-gray-400'}`}>🔍</div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1 gap-2">
                                                            <h5 className={`font-black text-base uppercase tracking-tight truncate ${bookingMode === 'validate' ? 'text-emerald-600' : 'text-gray-800'}`}>{t('consultation.booking.optionB.title')}</h5>
                                                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase shrink-0">{t('consultation.booking.optionB.subtitle')}</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">{t('consultation.booking.optionB.desc')}</p>
                                                    </div>
                                                </div>
                                                {bookingMode === 'validate' && <div className="absolute top-4 right-4 text-emerald-500"><CheckIcon className="w-6 h-6" /></div>}
                                            </div>
                                        </>
                                    )}
                                    {errors.bookingMode && !bookingMode && <div className="text-xs font-bold text-red-500 text-center">{errors.bookingMode}</div>}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Service Location */}
                        {currentStep === 3 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MapPinIcon className="w-5 h-5" /></div>
                                    <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">{t('consultation.form.verifiedLocation')}</h4>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest leading-none mb-1">Dirección Confirmada / Verified Location</p>
                                        <p className="font-extrabold text-[#002D5B] text-base">{address}</p>
                                        <p className="font-bold text-gray-500 text-sm mt-1">{postcode} {city}</p>
                                        <span className="inline-block mt-2 font-black text-[9px] uppercase tracking-wider text-[#007bff] bg-blue-100 px-2 py-0.5 rounded">
                                            Zona / Zone: {detectZone(postcode || '8200').label}
                                        </span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setContactModalOpen(false);
                                            setTimeout(() => {
                                                const target = document.getElementById('step-1-location');
                                                if (target) {
                                                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }
                                            }, 100);
                                        }} 
                                        className="px-5 py-3 bg-white hover:bg-subtle hover:text-[#007bff] border border-gray-200 hover:border-[#007bff] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 text-center"
                                    >
                                        {t('consultation.form.change')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Access Method & Notes */}
                        {currentStep === 4 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><KeyIcon className="w-5 h-5" /></div>
                                    <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">{t('consultation.form.propertyAccess')}</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="group relative">
                                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('consultation.form.propertyAccess')}</label>
                                        <div className="relative">
                                            <select 
                                                className="w-full p-4 bg-white border-2 border-gray-100 rounded-[1.25rem] focus:border-[#007bff] focus:bg-blue-50/20 outline-none font-bold text-sm transition-all duration-300 shadow-sm appearance-none cursor-pointer"
                                                value={accessMethod}
                                                onChange={(e) => setAccessMethod(e.target.value)}
                                            >
                                                <option value="I am on-site">{mt("I am on-site", "Estoy en el lugar", "Ich bin vor Ort", "Je suis sur place", "Sono sul posto", "Estou no local")}</option>
                                                <option value="Key with neighbor">{mt("Key with neighbor", "Llave con vecino", "Schlüssel beim Nachbarn", "Clé chez le voisin", "Chiave dal vicino", "Chave com o vizinho")}</option>
                                                <option value="Key in mailbox">{mt("Key in mailbox", "Llave en el buzón", "Schlüssel im Briefkasten", "Clé dans la boîte aux lettres", "Chiave nella cassetta postale", "Chave na caixa de correio")}</option>
                                                <option value="Access code">{mt("Access code", "Código de acceso", "Zugangscode", "Code d'accès", "Codice di accesso", "Código de acesso")}</option>
                                                <option value="Other">{mt("Other", "Otro", "Sonstiges", "Autre", "Altro", "Outro")}</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronDownIcon className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('consultation.form.specialNotes')}</label>
                                        <textarea 
                                            className="w-full p-4 bg-white border-2 border-gray-100 rounded-[1.25rem] focus:border-[#007bff] focus:bg-blue-50/20 outline-none font-bold text-sm transition-all duration-300 shadow-sm min-h-[120px]"
                                            placeholder={t('consultation.form.placeholderNotes')}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: Payment & Deposit (Summary & Deposit Section) */}
                        {currentStep === 5 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><BoltIcon className="w-5 h-5" /></div>
                                    <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">{t('payment.summary')}</h4>
                                </div>

                                <div className={`bg-[#002D5B] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-300 ${errors.terms ? 'border-4 border-red-500' : ''}`}>
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 pointer-events-none"></div>
                                    
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-1.5 relative group">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">
                                                {t('consultation.estimatedProjectTotal')}
                                            </span>
                                            <button type="button" aria-label="Pricing breakdown overview" className="text-blue-300/80 hover:text-white transition-colors cursor-help focus:outline-none">
                                                <InfoIcon className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-70 bg-slate-800 text-white text-[11px] p-3 rounded-2xl shadow-xl border border-slate-700/60 leading-normal z-50">
                                                <div className="absolute left-4 top-full w-2.5 h-2.5 bg-slate-800 rotate-45 -translate-y-1.5 border-r border-b border-slate-700/60"></div>
                                                {t('consultation.tooltip.estimateExplain')}
                                            </div>
                                        </div>
                                        <span className="font-black text-lg">CHF {grandTotal.toFixed(2)}</span>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl mb-8 border-2 border-[#007bff] shadow-md shadow-blue-500/5">
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                            <span className="text-xs font-black uppercase text-[#002D5B]/70">
                                                {onlyComics ? (language === 'es' ? 'PAGO COMPLETO AHORA (100%)' : 'FULL PAYMENT DUE NOW (100%)') : t('consultation.booking.dueNow')}
                                            </span>
                                            <span className="text-3xl font-black text-emerald-600">CHF {calculateDeposit().toFixed(2)}</span>
                                        </div>
                                        {/* Under-payment microcopy bullets to reassure checkout */}
                                        <div className="space-y-2.5 text-left">
                                            <p className="text-[10.5px] text-slate-700 font-bold flex items-center gap-1.5 leading-snug">
                                                <span>{t('consultation.booking.noCommitment')}</span>
                                            </p>
                                            <p className="text-[10.5px] text-slate-700 font-bold flex items-center gap-1.5 leading-snug">
                                                <span>{t('consultation.booking.verifiedSecure')}</span>
                                            </p>
                                            <p className="text-[10.5px] text-slate-700 font-bold flex items-center gap-1.5 leading-snug">
                                                <span>{t('consultation.booking.satisfactionGuaranteed')}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`flex items-start gap-4 p-5 rounded-[1.5rem] border transition-all duration-300 cursor-pointer ${errors.terms ? 'bg-red-500/20 border-red-500 shake' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} onClick={() => setIsTermsAgreed(!isTermsAgreed)}>
                                            <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex flex-shrink-0 items-center justify-center transition-all ${isTermsAgreed ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-white/20'}`}>
                                                {isTermsAgreed && <CheckIcon className="w-4 h-4 text-white" />}
                                            </div>
                                            <p className="flex-1 text-[11px] text-blue-50 font-medium leading-relaxed">
                                                {t('consultation.terms.confirm', { name: clientName || '...' })}
                                                <button type="button" onClick={(e) => { e.stopPropagation(); onNavigate('terms'); }} className="text-[#007bff] hover:underline font-black">
                                                    {t('nav.terms')}
                                                </button>.
                                                {" "}{t('consultation.terms.gateway')}
                                            </p>
                                        </div>
                                        {errors.terms && <span className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center block">{errors.terms}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STICKY BOTTOM PRICER & NAVIGATION BAR */}
                    <div className="sticky bottom-0 w-full p-5 bg-slate-50 border-t border-gray-100 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] rounded-b-[2rem] shrink-0">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                                {/* Live Pricing */}
                                <div className="flex items-center gap-4">
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">
                                            {t('consultation.estimatedProjectTotal')}
                                        </p>
                                        <p className="text-base font-black text-slate-800">
                                            CHF {grandTotal.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200"></div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase text-blue-500 tracking-widest leading-none mb-1">
                                            {onlyComics ? (language === 'es' ? 'PAGO COMPLETO' : 'FULL PAYMENT') : t('consultation.booking.dueNow')}
                                        </p>
                                        <p className="text-lg font-black text-[#007bff]">
                                            CHF {calculateDeposit().toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Nav Buttons */}
                                <div className="flex items-center gap-3 shrink-0">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(prev => prev - 1)}
                                            className="px-5 py-3 cursor-pointer bg-white hover:bg-gray-50 text-gray-700 font-black border border-gray-200 rounded-2xl text-xs uppercase tracking-wider transition-all transform active:scale-95 shadow-sm"
                                        >
                                            ← {t('consultation.form.back')}
                                        </button>
                                    )}

                                    {currentStep < 5 ? (
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="flex-1 sm:flex-initial px-8 py-3 bg-[#007bff] hover:bg-blue-600 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all transform active:scale-95 shadow-md shadow-blue-200"
                                        >
                                            {t('consultation.form.next')} →
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 sm:flex-initial px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all transform active:scale-95 shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></div>
                                                    {t('consultation.form.processing')}
                                                </>
                                            ) : (
                                                <>
                                                    {t('consultation.book')} 🚀
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Sticky footer reinsurance microcopy row containing trust elements with emojis */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-[9px] font-bold text-gray-400 border-t border-gray-200/40 pt-2 bg-slate-100/40 -mx-5 -mb-5 px-5 py-2.5 rounded-b-[2rem] select-none text-center">
                                <span className="flex items-center gap-1 shrink-0">{t('consultation.booking.noCommitment')}</span>
                                <span className="hidden md:inline text-gray-300 shrink-0">•</span>
                                <span className="flex items-center gap-1 shrink-0">{t('consultation.booking.verifiedSecure')}</span>
                                <span className="hidden md:inline text-gray-300 shrink-0">•</span>
                                <span className="flex items-center gap-1 shrink-0">{t('consultation.booking.satisfactionGuaranteed')}</span>
                            </div>
                        </div>
                    </div>

                </form>
                )}
            </ModalOverlay>
        )}

      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 12px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        @keyframes float { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes scroll-reviews {
          0% { transform: translateY(0); }
          20% { transform: translateY(0); }
          25% { transform: translateY(-112px); }
          45% { transform: translateY(-112px); }
          50% { transform: translateY(-224px); }
          70% { transform: translateY(-224px); }
          75% { transform: translateY(-336px); }
          95% { transform: translateY(-336px); }
          100% { transform: translateY(-448px); }
        }
        .animate-scroll-reviews {
            animation: scroll-reviews 20s infinite linear;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default ConsultationPage;
