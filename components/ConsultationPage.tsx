import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { 
    InfoIcon, 
    XMarkIcon, 
    ChevronUpIcon, 
    ChevronDownIcon, 
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
    BrainSearchIcon
} from './icons';
import { mascotImageUrl, teamPhotoUrl } from '../assets';
import emailjs from '@emailjs/browser';
import { db, auth, storage } from './firebase';
import { doc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from './Auth';

const SERVICE_ID = 'service_aiv15bc'; 
const TEMPLATE_ID = 'template_aktj7t9'; 
const PUBLIC_KEY = 'sH5K84ChHyssJrarm'; 
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/dkmya8ae31ib7gwy6xi2f4f8icaxbezo';
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
  carpetPrice: 60.00,
  furniturePrice: 50.00,
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
  customDuration?: number;
}

export interface CleaningOptions {
  rooms: number;
  bathrooms: number;
  balconies?: number;
  storageUnits?: number;
  carpets?: number;
  furniture?: number;
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

  return applyZone(total, zone);
}

export function getRegularCleaningPrice(opts: RegularCleaningOptions, zone: ZoneInfo): number {
  if (opts.rooms === 0 && opts.bathrooms === 0) return PRICES.baseCallOut;

  let hours = opts.rooms * 0.75 + opts.bathrooms * 0.5;
  hours = Math.ceil(hours * 2) / 2;

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

  const price = hours * PRICES.regularHourly;
  return applyZone(price, zone);
}

export function getMovingPrice(opts: MovingOptions): number {
  let baseRate = 0;
  if (opts.level === "standard") baseRate = PRICES.movingStandard;
  else if (opts.level === "large") baseRate = PRICES.movingLarge;
  else if (opts.level === "commercial") baseRate = PRICES.movingCommercial;

  if (opts.helpers > 2) {
    baseRate += (opts.helpers - 2) * PRICES.movingExtraHelperSurcharge;
  }

  let total = opts.hours * baseRate;

  if (opts.withAssembly) {
    total += (opts.assemblyHours ?? 0) * PRICES.movingAssemblyRate;
  }
  if (opts.withHydraulicLift) {
    total += (opts.liftHours ?? 0) * PRICES.movingHydraulicLiftRate;
  }

  let transportSurcharge = 0;
  const fromZone = detectZone(opts.originPostal);
  const toZone = detectZone(opts.destinationPostal);

  if (fromZone.zone !== "other" && toZone.zone !== "other") {
    if (fromZone.zone === toZone.zone) {
      transportSurcharge = 20.00;
    } else {
      transportSurcharge = 35.00;
      if (fromZone.zone === "schaffhausen" || toZone.zone === "schaffhausen") {
        transportSurcharge += 50.00;
      }
    }
  }

  return total + transportSurcharge;
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
}> = ({ icon, title, description, price, selected, onClick, gridCols = "col-span-1" }) => (
    <div 
        onClick={onClick}
        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 relative group ${
            selected 
            ? 'border-[#007bff] bg-blue-50 shadow-md scale-[1.02]' 
            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
        } ${gridCols}`}
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 ${
            selected ? 'bg-white shadow-sm' : 'bg-gray-50'
        }`}>
            {typeof icon === 'string' ? icon : icon}
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <h4 className={`font-bold text-sm ${selected ? 'text-[#007bff]' : 'text-gray-800'}`}>{title}</h4>
                {price && <span className={`text-[10px] font-black uppercase tracking-wider ${selected ? 'text-[#007bff]' : 'text-gray-400'}`}>{price}</span>}
            </div>
            {description && <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{description}</p>}
        </div>
        {selected && (
            <div className="absolute -top-2 -right-2 bg-[#007bff] text-white p-1 rounded-full shadow-lg animate-fade-in">
                <CheckIcon className="w-3.5 h-3.5" />
            </div>
        )}
    </div>
);

const CounterCard: React.FC<{
    icon: string;
    label: string;
    subLabel?: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    step?: number;
    suffix?: string;
}> = ({ icon, label, subLabel, value, onChange, min = 0, step = 1, suffix = '' }) => (
    <div className="p-4 rounded-2xl border-2 border-gray-100 bg-white flex items-center gap-4 transition-all hover:border-gray-200 group">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl transition-transform group-hover:scale-110">
            {icon}
        </div>
        <div className="flex-1">
            <div className="font-bold text-sm text-gray-800">{label}</div>
            {subLabel && <div className="text-[10px] text-gray-500 mt-0.5">{subLabel}</div>}
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
                onClick={(e) => { e.preventDefault(); onChange(value + step); }}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:border-[#007bff] hover:text-[#007bff] transition-colors shadow-sm active:scale-90"
            >
                <PlusIcon className="w-3.5 h-3.5" />
            </button>
        </div>
    </div>
);

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
    onClose: () => void 
}> = ({ onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <Confetti />
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative flex flex-col items-center text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-blue-50 rounded-b-[50%] -z-0 transform -translate-y-16 scale-x-150"></div>
                <div className="relative z-10 animate-bounce-in">
                    <img src={mascotImageUrl} alt="Celebrating Mascot" className="w-32 h-32 object-contain mx-auto mb-6 drop-shadow-xl" />
                </div>
                <h3 className="text-2xl font-bold text-[#002D5B] mb-2 relative z-10">{t('consultation.success.title')}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed relative z-10 font-medium">{t('consultation.success.quoteSent')}</p>
                
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

const ModalOverlay: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg flex flex-col max-h-[95vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <h3 className="text-lg font-bold text-[#002D5B]">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </div>
    </div>
);

const ServiceDetailsModal: React.FC<{ type: ServiceType; onClose: () => void }> = ({ type, onClose }) => {
    const { t } = useTranslation();
    let areas: { titleKey: string; listKey: string }[] = [];
    if (type === 'end-of-tenancy') {
        areas = [
            { titleKey: 'services.included.eot.kitchen.title', listKey: 'services.included.eot.kitchen.list' },
            { titleKey: 'services.included.eot.bathroom.title', listKey: 'services.included.eot.bathroom.list' },
            { titleKey: 'services.included.eot.general.title', listKey: 'services.included.eot.general.list' },
            { titleKey: 'services.included.eot.windows.title', listKey: 'services.included.eot.windows.list' },
        ];
    } else if (type === 'deep-cleaning') {
        areas = [
            { titleKey: 'services.included.deep.bedroom.title', listKey: 'services.included.deep.bedroom.list' },
            { titleKey: 'services.included.deep.bathroom.title', listKey: 'services.included.deep.bathroom.list' },
            { titleKey: 'services.included.deep.kitchen.title', listKey: 'services.included.deep.kitchen.list' },
            { titleKey: 'services.included.deep.general.title', listKey: 'services.included.deep.general.list' },
        ];
    } else if (type === 'daily-cleaning') {
        areas = [
            { titleKey: 'services.included.daily.bedroom.title', listKey: 'services.included.daily.bedroom.list' },
            { titleKey: 'services.included.daily.bathroom.title', listKey: 'services.included.daily.bathroom.list' },
            { titleKey: 'services.included.daily.kitchen.title', listKey: 'services.included.daily.kitchen.list' },
            { titleKey: 'services.included.daily.general.title', listKey: 'services.included.daily.general.list' },
        ];
    } else return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-[#002D5B] flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-[#007bff]" />
                        {t('consultation.whatsIncluded')}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-0 overflow-y-auto custom-scrollbar bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {areas.map((area, idx) => (
                            <div key={idx} className={`p-5 border-b border-r border-gray-100 bg-white ${idx % 2 === 0 ? 'border-r' : ''}`}>
                                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2 border-b-2 border-[#007bff] inline-block pb-0.5">
                                    {t(area.titleKey)}
                                </h4>
                                <ul className="space-y-1.5">
                                    {t(area.listKey).split(';').map((item, i) => (
                                        <li key={i} className="flex items-start text-xs text-gray-600 leading-relaxed">
                                            <CheckIcon className="w-3.5 h-3.5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                            <span>{item.trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 bg-white border-t border-gray-100 text-center">
                    <button onClick={onClose} className="bg-[#002D5B] text-white px-6 py-2 rounded-full font-bold hover:bg-[#00254A] transition-colors text-sm">Got it!</button>
                </div>
            </div>
        </div>
    );
}

const BookingCalendar: React.FC<{ selectedDate: string; onChange: (date: string) => void; hasError?: boolean }> = ({ selectedDate, onChange, hasError }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const today = new Date(); today.setHours(0,0,0,0);
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

// --- Main Page Component ---

const ConsultationPage: React.FC<ConsultationPageProps> = ({ onNavigate, cart, setCart }) => {
  const { t } = useTranslation();
  
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<ServiceType | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showInclusionsModal, setShowInclusionsModal] = useState<ServiceType | null>(null);
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

  const [walleeError, setWalleeError] = useState<{ message: string; dataToSave: any } | null>(null);

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
        } catch (e) {
            console.error("Failed to parse persisted data", e);
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

  const openServiceModal = (type: ServiceType) => {
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
            duration: 3, 
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
            assemblyHours: 1 
          },
          'pest-control': { pestType: 'Insects', propertyType: 'Residential', description: '' },
          'waste-management': { wasteType: 'Household', volume: 'Small', description: '' },
          'gutter-cleaning': { buildingHeight: '1 Story', lengthCategory: 'Standard', description: '' },
          'car-detailing': { zipCode: postcode || '', vehicles: [{ id: Date.now().toString(), category: 'M', dirtLevel: 'Minimum', hasPets: false, luxury: { brand: '', interior: '', exterior: '', ceramic: false } }] },
          'gardening': { size: 'Medium', hedgeMeters: 0, mowing: false, planting: false, cleanup: false, greenWaste: false, notes: '' },
          'exterior-cleaning': { surface: 'Driveway / Path', material: 'Stone', approxSize: '0', notes: '' }
      };
      setConfig(defaults[type]);
      setActiveModal(type);
  };

  const handleEditItem = (item: CartItem) => {
      setEditingItemId(item.id);
      setConfig(item.details);
      setActiveModal(item.type);
  };

  useEffect(() => {
    // Mobile summary visibility is now always true as per user request
    setShowMobileSummaryBar(true);
  }, []);

  const roundToHalf = (num: number) => Math.ceil(num * 2) / 2;

  const calculateCleaningDuration = (type: string, bedrooms: number, bathrooms: number, balconies: number = 0, storage: number = 0, carpet: number = 0, furniture: number = 0) => {
      const opts: CleaningOptions = {
          rooms: bedrooms,
          bathrooms,
          balconies,
          storageUnits: storage,
          carpets: carpet,
          furniture
      };
      return calculateCleaningDuration_v2(type === 'regular-cleaning' || type === 'daily-cleaning' ? "regular" : "deep", opts);
  };

  const calculateEOTDuration = (rooms: number, bathrooms: number, balconies: number = 0, storage: number = 0, carpet: number = 0, furniture: number = 0) => {
      if (rooms === 0 && bathrooms === 0) return 0;
      const opts: CleaningOptions = {
          rooms,
          bathrooms,
          balconies,
          storageUnits: storage,
          carpets: carpet,
          furniture
      };
      return calculateEOTDuration_v2(opts);
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
                  furniture: config.furnitureCount || 0
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
                  windowCount: config.windowCount || 0
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
                  destinationPostal: config.toZip || ''
              };
              return getMovingPrice(opts);
          }
          case 'car-detailing': {
              let total = 0;
              if (config.vehicles && config.vehicles.length > 0) {
                  config.vehicles.forEach((v: any) => {
                      const opts: CarDetailingOptions = {
                          size: v.category,
                          dirtLevel: (v.dirtLevel === 'High' ? 'high' : v.dirtLevel === 'Extreme' ? 'extreme' : 'medium') as "medium"|"high"|"extreme",
                          hasPets: v.hasPets,
                          ceramicCoating: v.luxury?.ceramic,
                          servicePostal: config.zipCode || postcode || '8200'
                      };
                      total += getCarDetailingPrice(opts);
                  });
              }
              return total;
          }
          case 'gardening': {
              const opts: GardeningOptions = {
                  gardenSize: (config.size === 'Small' ? 'small' : config.size === 'Medium' ? 'medium' : 'large') as "small"|"medium"|"large",
                  mowingArea: config.mowing ? 170 : 0,
                  hedgeMeters: config.hedgeMeters || 0,
                  plantingHours: config.planting ? 1.78 : 0,
                  weedingHours: config.cleanup ? 3 : 0,
                  wasteBags: config.greenWaste ? 2.78 : 0
              };
              return getGardeningPrice(opts, zone);
          }
          case 'exterior-cleaning': {
              const opts: WashingOptions = {
                  material: (config.material || 'stone').toLowerCase() as "stone"|"concrete"|"wood"|"composite"|"glass",
                  areaSqm: parseFloat(config.approxSize) || 0,
                  isFacade: config.surface === 'Facade / Walls'
              };
              return getPressureWashingPrice(opts, zone);
          }
          case 'gutter-cleaning': {
              const floorsNum = config.buildingHeight === '1 Story' ? 1 : config.buildingHeight === '2 Stories' ? 2 : 3;
              const opts: GutterOptions = {
                  floors: floorsNum as 1|2|3,
                  gutterLength: (config.lengthCategory === 'XL (>50m)' ? 'xl' : config.lengthCategory === 'Large (20-50m)' ? 'medium' : 'standard') as "standard"|"medium"|"xl"
              };
              return getGutterPrice(opts, zone);
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
              const isFromValid = config.fromZip.startsWith('80') || config.fromZip.startsWith('82') || config.fromZip.startsWith('84');
              const isToValid = config.toZip.startsWith('80') || config.toZip.startsWith('82') || config.toZip.startsWith('84');
              if (!isFromValid || !isToValid) {
                  alert('We currently only support Zurich (80xx), Schaffhausen (82xx), and Winterthur (84xx).');
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
          case 'car-detailing': descParts.push(`${config.vehicles.length} Vehicle Detail`); break;
          case 'gardening': descParts.push(`Gardening: ${config.size} Garden${config.mowing ? ' + Mowing' : ''}`); break;
          case 'exterior-cleaning': descParts.push(`Exterior Clean: ${config.surface} (${config.approxSize}m²)`); break;
          case 'gutter-cleaning': descParts.push(`Gutter Clean: ${config.buildingHeight} | ${config.lengthCategory}`); break;
          default: descParts.push(`${activeModal} Request`);
      }

      const finalDesc = descParts.length > 0 ? descParts.join(' | ') : 'Service Selected';

      if (editingItemId) {
          setCart(cart.map(item => item.id === editingItemId ? { ...item, details: config, price: price > 0 ? price : undefined, duration: hours, description: finalDesc } : item));
      } else {
          setCart([...cart, { id: Date.now().toString(), type: activeModal!, details: config, price: price > 0 ? price : undefined, duration: hours, description: finalDesc }]);
      }
      setActiveModal(null);
      setEditingItemId(null);
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

      switch (item.type) {
          case 'end-of-tenancy': {
              const opts: EOTOptions = {
                  rooms: itemConfig.roomsCount || 0,
                  bathrooms: itemConfig.bathroomsCount || 0,
                  balconies: itemConfig.balconyCount || 0,
                  storageUnits: itemConfig.storageCount || 0,
                  carpets: itemConfig.carpetCount || 0,
                  furniture: itemConfig.furnitureCount || 0,
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
                  furniture: itemConfig.furnitureCount || 0
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
                  windowCount: itemConfig.windowCount || 0
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
                  destinationPostal: itemConfig.toZip || currentPostcode
              };
              revaluedPrice = getMovingPrice(opts);
              break;
          }
          case 'car-detailing': {
              let total = 0;
              if (itemConfig.vehicles && itemConfig.vehicles.length > 0) {
                  itemConfig.vehicles.forEach((v: any) => {
                      const opts: CarDetailingOptions = {
                          size: v.category,
                          dirtLevel: (v.dirtLevel === 'High' ? 'high' : v.dirtLevel === 'Extreme' ? 'extreme' : 'medium') as "medium"|"high"|"extreme",
                          hasPets: v.hasPets,
                          ceramicCoating: v.luxury?.ceramic,
                          servicePostal: itemConfig.zipCode || currentPostcode
                      };
                      total += getCarDetailingPrice(opts);
                  });
              }
              revaluedPrice = total;
              break;
          }
          case 'gardening': {
              const optsResource: GardeningOptions = {
                  gardenSize: (itemConfig.size === 'Small' ? 'small' : itemConfig.size === 'Medium' ? 'medium' : 'large') as "small"|"medium"|"large",
                  mowingArea: itemConfig.mowing ? 170 : 0,
                  hedgeMeters: itemConfig.hedgeMeters || 0,
                  plantingHours: itemConfig.planting ? 1.78 : 0,
                  weedingHours: itemConfig.cleanup ? 3 : 0,
                  wasteBags: itemConfig.greenWaste ? 2.78 : 0
              };
              revaluedPrice = getGardeningPrice(optsResource, checkoutZone);
              break;
          }
          case 'exterior-cleaning': {
              const opts: WashingOptions = {
                  material: (itemConfig.material || 'stone').toLowerCase() as "stone"|"concrete"|"wood"|"composite"|"glass",
                  areaSqm: parseFloat(itemConfig.approxSize) || 0,
                  isFacade: itemConfig.surface === 'Facade / Walls'
              };
              revaluedPrice = getPressureWashingPrice(opts, checkoutZone);
              break;
          }
          case 'gutter-cleaning': {
              const floorsNum = itemConfig.buildingHeight === '1 Story' ? 1 : itemConfig.buildingHeight === '2 Stories' ? 2 : 3;
              const opts: GutterOptions = {
                  floors: floorsNum as 1|2|3,
                  gutterLength: (itemConfig.lengthCategory === 'XL (>50m)' ? 'xl' : itemConfig.lengthCategory === 'Large (20-50m)' ? 'medium' : 'standard') as "standard"|"medium"|"xl"
              };
              revaluedPrice = getGutterPrice(opts, checkoutZone);
              break;
          }
      }

      return {
          ...item,
          price: revaluedPrice || item.price
      };
  });

  const mainCount = revaluedCart.filter(item => mainServices.includes(item.type)).length;
  const addCount = revaluedCart.filter(item => additionalServicesList.includes(item.type)).length;

  let travelFee = 0;
  let travelMsg = '';
  let travelMsgColor = 'text-gray-400';

  if (revaluedCart.length > 0) {
      if (mainCount >= 2 || (mainCount === 1 && addCount >= 2)) {
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

  // Deposit Logic - Option A is 15% of grand total, Option B is fixed 15.00
  const calculateDeposit = () => {
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
          alert("Selected files are too large (250MB limit).");
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
                    
                    console.log(`Processing ${paymentStatus} payment for:`, booking.clientName);
                    const isInvoice = paymentStatus === 'invoice';

                    // Firestore document update
                    const docId = booking.id;
                    if (docId) {
                        try {
                            const updatedPayment = {
                                method: booking.payment?.method || (isInvoice ? 'bank_transfer' : 'card'),
                                gateway: booking.payment?.gateway || (isInvoice ? 'manual' : 'wallee'),
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
                    hookData.append('depositAmount', booking.depositAmount.toFixed(2));
                    hookData.append('bookingMode', booking.bookingMode);
                    hookData.append('services', JSON.stringify(booking.services));
                    hookData.append('transactionId', isInvoice ? 'invoice_bank_transfer' : 'paid_via_gateway');
                    hookData.append('payment_status', isInvoice ? 'PENDING' : 'PAID');
                    
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
                            alert("¡Gracias! Hemos recibido tu solicitud de reserva mediante Factura / Transferencia Bancaria. Te enviaremos un email con los detalles de confirmación y de pago.");
                        } else {
                            alert("¡Gracias! Hemos recibido tu pago y tu solicitud de servicio.");
                        }
                        // Clean URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                    })
                    .catch((error) => {
                        console.error("EmailJS Error after payment:", error);
                        alert("Reserva procesada, pero hubo un error al enviar la confirmación por email. Por favor contáctenos directamente.");
                        window.history.replaceState({}, document.title, window.location.pathname);
                    });
                } catch (e) {
                    console.error("Failed to process pending booking", e);
                }
            }
        } else if (paymentStatus === 'failed' || paymentStatus === 'cancel') {
            alert("El pago fue cancelado o falló. Por favor, inténtalo de nuevo.");
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
        alert('Please select at least one service before proceeding.');
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
                alert("Por favor, completa todos los campos requeridos marcados en rojo.");
            }
            return;
        }

        setIsSubmitting(true);
        const amount = calculateDeposit();
        const mode = bookingMode!;
        const concept = mode === 'direct' ? 'Express Booking Deposit (15%)' : 'Precision Media Quote';
        
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

        const newDocId = doc(collection(db, 'maintenance_requests')).id;

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
            gateway: 'wallee' as const,
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

        console.log("Creating Wallee Transaction via Server...");

        // Call our server-side API to create a transaction
        let response;
        try {
            response = await fetch('/api/wallee/create-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    currency: 'CHF',
                    title: concept,
                    description: dynamicDescription,
                    clientName,
                    email: email // Send user email for pre-fill
                }),
            });
        } catch (fetchErr: any) {
            console.error("Failed to connect to Wallee Transaction endpoint", fetchErr);
            setWalleeError({
                message: fetchErr.message || "Failed to contact payment API route",
                dataToSave: bookingData
            });
            setIsSubmitting(false);
            return;
        }

        let data;
        try {
            const contentType = response ? response.headers.get('content-type') : null;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = response ? await response.text() : '';
                throw new Error(`Server returned non-JSON response (${response ? response.status : 'unknown'}): ${text.substring(0, 80)}...`);
            }
        } catch (parseErr: any) {
            console.error("Failed to parse server response", parseErr);
            setWalleeError({
                message: `Server Connection Issue: Wallee handler could not process the response. Details: ${parseErr.message}`,
                dataToSave: bookingData
            });
            setIsSubmitting(false);
            return;
        }

        if (data && data.success && data.link) {
            console.log("Wallee Transaction created successfully. Redirecting to:", data.link);
            localStorage.setItem('pending_booking', JSON.stringify(bookingData));
            // Redirect the user to the Wallee Payment Page
            window.location.href = data.link;
        } else {
            console.warn("Wallee Transaction creation failed. Prompting fallback:", data ? data.error : 'No response data');
            setWalleeError({
                message: (data && data.error) || "The Wallee REST API is not active or credentials are not yet configured in this execution package.",
                dataToSave: bookingData
            });
            setIsSubmitting(false);
        }

    } catch (error: any) {
        console.error("Error in ejecutarReservaYpago:", error);
        alert(`Hubo un error al iniciar la pasarela de pago: ${error.message}. Por favor, inténtalo de nuevo.`);
        setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => { 
    setShowSuccess(false); 
    onNavigate('home'); 
  };

  const getCardStyle = (id: string) => {
    switch(id) {
        case 'end-of-tenancy': return 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-200/50';
        case 'deep-cleaning': return 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200/50';
        case 'daily-cleaning': return 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200/50';
        case 'moving': return 'bg-gradient-to-br from-slate-600 to-slate-800 shadow-lg shadow-gray-200/50';
        case 'gardening': return 'bg-gradient-to-br from-green-50 to-emerald-600 shadow-lg shadow-green-200/50';
        case 'exterior-cleaning': return 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg shadow-blue-200/50';
        case 'car-detailing': return 'bg-gradient-to-br from-violet-600 to-purple-800 shadow-lg shadow-purple-200/50';
        case 'pest-control': return 'bg-gradient-to-br from-orange-600 to-red-700 shadow-lg shadow-orange-200/50';
        case 'waste-management': return 'bg-gradient-to-br from-lime-500 to-green-600 shadow-lg shadow-lime-200/50';
        case 'gutter-cleaning': return 'bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg shadow-sky-200/50';
        default: return 'bg-white shadow-md';
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-40 pb-20 font-sans text-gray-800">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* --- Header & Mascot Dialogue & Reviews --- */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-16">
            <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl md:text-5xl font-black text-[#002D5B] mb-2 leading-tight tracking-tight uppercase">
                    Build Your <span className="text-[#007bff]">Quote</span>
                </h1>
                <p className="text-base text-gray-500 max-w-2xl font-medium">
                    {t('consultation.subtitle')}
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                {/* Mascot Bubble */}
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 max-w-md relative animate-fade-in shrink-0">
                    <div className="absolute -left-2 top-8 w-3 h-3 bg-white border-l border-b border-gray-100 transform rotate-45 hidden sm:block"></div>
                    <img src={mascotImageUrl} alt="Mascot" className="w-16 h-16 object-contain drop-shadow-md" />
                    <div>
                        <h4 className="font-black text-[#002D5B] text-sm mb-0.5">Hi! I'm Kai.</h4>
                        <p className="text-xs text-gray-600 leading-snug font-medium">
                            Our clients love how smooth this process is! Just look at these reviews:
                        </p>
                    </div>
                </div>

                {/* Vertical Reviews Scroller */}
                <div className="h-28 overflow-hidden relative w-full sm:w-64 border-l-2 border-blue-50 pl-4">
                    <div className="animate-scroll-reviews">
                        {[...MOCK_REVIEWS, ...MOCK_REVIEWS].map((review, idx) => (
                            <div key={idx} className="h-28 flex flex-col justify-center py-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="font-black text-[#002D5B] text-[10px] uppercase tracking-wider">{review.name}</span>
                                    <div className="flex gap-0.5">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <StarIcon key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 italic font-medium leading-tight line-clamp-2">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* Fades */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:items-start">
            
            {/* --- Left Column: Services Grid --- */}
            <div className="w-full lg:w-2/3 pb-24 lg:pb-0">
                
                {/* --- Step 1: Location Verification --- */}
                <div id="step-1-location" className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden mb-12 ${
                    postcode && postcode.length === 4 
                        ? 'border-emerald-100 bg-emerald-50/20' 
                        : 'border-blue-100 bg-blue-50/15'
                }`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black shadow-md transition-colors ${
                            postcode && postcode.length === 4 ? 'bg-emerald-600 text-white' : 'bg-[#002D5B] text-white'
                        }`}>1</span>
                        <div>
                            <h3 className="text-xl font-black text-[#002D5B] uppercase tracking-tight">Service Location</h3>
                            <p className="text-xs text-gray-400 font-bold tracking-tight mt-0.5">Check availability, regional rates & schedule for your exact address</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Street Name & No.</label>
                            <input 
                                type="text"
                                placeholder="e.g. Seewaldestrasse 3"
                                className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:border-[#007bff] focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm shadow-sm transition-all text-gray-700"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Postal Code (4 Digits)</label>
                            <input 
                                type="text"
                                maxLength={4}
                                placeholder="e.g. 8001"
                                className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:border-[#007bff] focus:ring-2 focus:ring-blue-100 outline-none font-black text-sm shadow-sm transition-all text-gray-700 font-sans"
                                value={postcode}
                                onChange={(e) => handlePostcodeChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">City / Canton</label>
                            <input 
                                type="text"
                                placeholder="e.g. Zürich"
                                className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:border-[#007bff] focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm shadow-sm transition-all text-gray-700"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Zone Surcharge Indicator */}
                    <div className="mt-6 pt-5 border-t border-dashed border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007bff] flex items-center justify-center text-lg shadow-sm font-black">
                                📍
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Billing Region</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="font-black text-gray-800 text-sm">
                                        {postcode && postcode.length === 4 
                                            ? `Region: ${detectZone(postcode).label}` 
                                            : 'Waiting for Location...'
                                        }
                                    </span>
                                    {postcode && postcode.length === 4 && (
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase ${
                                            detectZone(postcode).surchargePercent > 0 
                                                ? 'bg-amber-100 text-amber-700' 
                                                : 'bg-emerald-50 text-emerald-700'
                                        }`}>
                                            {detectZone(postcode).surchargePercent > 0 
                                                ? `+${detectZone(postcode).surchargePercent}% Region Surcharge` 
                                                : 'Standard Swiss Rate'
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {postcode && postcode.length === 4 ? (
                            <div className="bg-emerald-50/80 border border-emerald-100 text-emerald-800 px-4 py-3 rounded-2xl text-[11px] font-bold max-w-sm leading-relaxed shrink-0">
                                ✨ **Pricing Engine Unlocked** — Live regional rates & transport fees are actively applied across all services.
                            </div>
                        ) : (
                            <div className="bg-blue-50/80 border border-blue-100 text-blue-800 px-4 py-3 rounded-2xl text-[11px] font-bold max-w-sm leading-relaxed shrink-0">
                                ℹ️ Please input your postcode to calculate exact local hourly rates and team availability in real-time.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                        <span className="bg-[#002D5B] text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shadow-md">2</span>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Our Core Services</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                        {[
                            { id: 'end-of-tenancy', icon: '🗝️', title: 'services.endOfTenancy.title', subtitle: '100% Handover Guarantee' },
                            { id: 'deep-cleaning', icon: '✨', title: 'services.deepCleaning.title', subtitle: 'Intensive Refresh' },
                            { id: 'daily-cleaning', icon: '🗓️', title: 'services.dailyCleaning.title', subtitle: 'Routine Excellence' },
                            { id: 'moving', icon: '📦', title: 'services.movingFurniture.title', subtitle: 'Stress-Free Relocation' },
                        ].map((service) => (
                            <button
                                key={service.id}
                                onClick={() => openServiceModal(service.id as ServiceType)}
                                className={`${getCardStyle(service.id)} p-6 rounded-[1.5rem] hover:scale-[1.02] transition-all text-left group relative overflow-hidden h-44 duration-300`}
                            >
                                <div className="flex flex-col h-full justify-between relative z-20">
                                    <div className="flex justify-between items-start">
                                        <span className="text-5xl filter drop-shadow-xl transform group-hover:rotate-6 transition-transform duration-500">{service.icon}</span>
                                        <div className="bg-white/20 backdrop-blur-md text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <PlusIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl text-white mb-0.5 tracking-tight drop-shadow-sm leading-tight">{t(service.title)}</h4>
                                        <p className="text-white/80 font-bold text-xs tracking-tight drop-shadow-sm">{service.subtitle}</p>
                                    </div>
                                </div>
                                <div className="absolute -right-6 -bottom-6 text-white opacity-10 text-[130px] group-hover:scale-110 transition-transform duration-700 pointer-events-none select-none">
                                    {service.icon}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-8 mt-20">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                        <span className="bg-[#007bff] text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shadow-md">3</span>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Additional Specializations</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { id: 'gardening', icon: '🌿', title: 'services.gardening.title', subtitle: 'Lawn & Garden Care' },
                            { id: 'exterior-cleaning', icon: '💧', title: 'services.exterior.title', subtitle: 'Façade Restoration' },
                            { id: 'car-detailing', icon: '🚗', title: 'services.car.title', subtitle: 'Premium Mobile Spa' },
                            { id: 'pest-control', icon: '🐜', title: 'services.pest.title', subtitle: 'Discreet Control' },
                            { id: 'waste-management', icon: '🗑️', title: 'services.waste.title', subtitle: 'Sustainable Disposal' },
                            { id: 'gutter-cleaning', icon: '🍂', title: 'services.gutter.title', subtitle: 'Drainage Care' },
                        ].map((service) => (
                            <button
                                key={service.id}
                                onClick={() => openServiceModal(service.id as ServiceType)}
                                className={`${getCardStyle(service.id)} p-5 rounded-[1.25rem] hover:scale-[1.02] transition-all text-left group relative overflow-hidden h-36 duration-300`}
                            >
                                <div className="flex flex-col h-full justify-between relative z-20">
                                    <div className="flex justify-between items-start">
                                        <span className="text-4xl filter drop-shadow-lg transform group-hover:rotate-6 transition-transform duration-500">{service.icon}</span>
                                        <div className="bg-white/20 backdrop-blur-md text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <PlusIcon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-base text-white mb-0.5 tracking-tight">{t(service.title)}</h4>
                                        <p className="text-white/80 font-bold text-[10px] leading-snug">{service.subtitle}</p>
                                    </div>
                                </div>
                                <div className="absolute -right-3 -bottom-3 text-white opacity-10 text-[90px] group-hover:rotate-12 transition-transform duration-700 pointer-events-none select-none">
                                    {service.icon}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-20">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                        <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shadow-md">4</span>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Visual Documentation</h3>
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
                        <div className="w-20 h-20 bg-blue-50 text-[#007bff] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-105 group-hover:rotate-6 transition-transform duration-500">
                            <CloudUploadIcon className="w-10 h-10" />
                        </div>
                        <p className="font-black text-xl text-[#002D5B] mb-1.5">Upload media for a precise quote.</p>
                        <p className="text-sm text-gray-400 font-bold tracking-tight">Photos/Videos help with precision (up to 250MB).</p>
                        
                        {files.length > 0 && (
                            <div className="mt-8 text-left max-w-lg mx-auto space-y-4 relative z-20">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-2">Upload Queue & Status</h4>
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
                                                            isCompleted ? 'bg-emerald-50 text-emerald-500' :
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
                                                                    isCompleted ? 'Ready' :
                                                                    isUploading ? `Uploading ${progress}%` :
                                                                    isError ? 'Upload failed' : 'In queue'
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

                        {!user && (
                            <div className="mt-8 bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 text-left max-w-lg mx-auto flex gap-3 animate-fade-in relative z-20">
                                <span className="text-xl shrink-0">💡</span>
                                <div>
                                    <p className="font-black text-xs text-[#002D5B] mb-0.5">Customer Dashboard Sync</p>
                                    <p className="text-[11px] text-gray-500 font-bold leading-normal">
                                        Sign in or create an account to view and access your quote details, uploaded assets, and status updates directly in your live Client Dashboard!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-[0_-15px_50px_rgba(0,0,0,0.15)] border-t border-gray-100 transition-transform duration-700 lg:sticky lg:top-28 lg:bottom-auto lg:left-auto lg:right-auto lg:w-1/3 lg:block lg:bg-transparent lg:shadow-none lg:border-none lg:backdrop-filter-none lg:z-30 lg:transform-none translate-y-0`}>
                <div className="lg:relative">
                    <div className="bg-white lg:rounded-[2.5rem] lg:shadow-2xl lg:border border-gray-100 overflow-hidden">
                        <div className="lg:hidden p-6 flex items-center justify-between cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors" onClick={(e) => { if((e.target as HTMLElement).tagName !== 'BUTTON') setMobileSummaryOpen(!isMobileSummaryOpen); }}>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Estimated Total</span>
                                <span className="text-3xl font-black text-[#002D5B]">CHF {grandTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setContactModalOpen(true)} disabled={cart.length === 0} className="bg-[#007bff] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-200/50 hover:bg-blue-600 disabled:opacity-50 transition-all">Book</button>
                                <div className={`p-1.5 rounded-full text-gray-400 bg-gray-100 transition-transform duration-500 ${isMobileSummaryOpen ? 'rotate-180' : ''}`}><ChevronUpIcon className="w-5 h-5"/></div>
                            </div>
                        </div>

                        <div className={`transition-[max-height] duration-700 ease-in-out overflow-hidden ${isMobileSummaryOpen ? 'max-h-[70vh]' : 'max-h-0'} lg:max-h-none lg:block`}>
                            <div className="hidden lg:block p-8 border-b border-gray-100 bg-slate-50/50">
                                <h3 className="text-2xl font-black text-[#002D5B] uppercase tracking-tight">Your Bundle</h3>
                            </div>
                            <div className="p-8">
                                <div className="space-y-4 max-h-[45vh] lg:max-h-[55vh] overflow-y-auto custom-scrollbar pr-3">
                                    {revaluedCart.length === 0 ? (
                                        <div className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                            <div className="text-5xl mb-4 opacity-20 filter grayscale">🛒</div>
                                            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Quote is empty</p>
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
                                                    <span className="text-3xl filter drop-shadow-sm">{item.type === 'moving' ? '📦' : item.type === 'car-detailing' ? '🚗' : item.type === 'gardening' ? '🌿' : item.type === 'exterior-cleaning' ? '💧' : item.type.includes('cleaning') ? '✨' : item.type.includes('pest') ? '🐜' : item.type.includes('waste') ? '🗑️' : item.type.includes('gutter') ? '🍂' : '🔧'}</span>
                                                    <span className="font-black text-gray-800 text-sm uppercase tracking-tight">{item.type.replace(/-/g, ' ')}</span>
                                                </div>
                                                <div className="text-[11px] text-gray-500 mb-3 pl-10 border-l-2 border-blue-100 ml-3 font-medium leading-relaxed">{item.description}</div>
                                                <div className="flex justify-between items-center pl-10">
                                                    <div className="flex items-center gap-2">
                                                        {item.duration ? (
                                                            <span className="text-[9px] font-black uppercase tracking-wider text-[#007bff] bg-blue-50 px-2 py-0.5 rounded-lg">
                                                                {formatTotalHours(item.duration)}
                                                            </span>
                                                        ) : null}
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 group-hover:text-[#007bff] transition-colors border-b border-transparent group-hover:border-blue-200">
                                                            <PencilIcon className="w-2.5 h-2.5" /> Click to Edit
                                                        </span>
                                                    </div>
                                                    <span className="font-black text-[#007bff] text-lg">{item.price ? `CHF ${item.price.toFixed(2)}` : 'Quote'}</span>
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
                                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Travel Fee</span>
                                                {travelMsg ? (
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
                                                        How to get FREE travel? <InfoIcon className="w-2.5 h-2.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <span className={`font-black ${travelFee === 0 ? 'text-green-500' : 'text-gray-600'} text-lg`}>
                                                {travelFee === 0 ? 'FREE' : `CHF ${travelFee.toFixed(2)}`}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-end mb-8 px-2">
                                        <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Total Estimate</span>
                                        <span className="text-4xl font-black text-[#002D5B] tracking-tighter">CHF {grandTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-blue-50 text-blue-800 text-[11px] p-4 rounded-xl mb-8 flex gap-3 leading-relaxed font-bold border border-blue-100">
                                        <InfoIcon className="w-5 h-5" />
                                        <p>Includes all professional equipment and eco-friendly B Corp certified materials.</p>
                                    </div>
                                    <button onClick={() => setContactModalOpen(true)} disabled={cart.length === 0} className="w-full bg-[#007bff] hover:bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-300/50 transition-all disabled:opacity-50 transform hover:-translate-y-1 active:translate-y-0 text-lg uppercase tracking-wider">Get final quote</button>
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
                <h3 className="text-xl font-black text-[#002D5B] uppercase tracking-tight">📍 Dirección de Servicio / Service Location</h3>
                <p className="text-xs text-gray-500 font-bold max-w-sm mx-auto mt-2 leading-relaxed">
                  Por favor, indica tu dirección (calle, número, código postal y ciudad) para calcular las tarifas exactas de tu zona de inmediato.
                </p>
                <p className="text-[10px] text-gray-400 italic mt-1 font-semibold leading-normal">
                  Please enter your street address, postcode, and city to calculate accurate regional rates.
                </p>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4 relative z-10 text-left">
                <div className="group">
                  <label className="block text-[10px] font-black text-[#002D5B] uppercase tracking-wider mb-1.5 ml-1">Calle y Número / Street & House Number</label>
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
                    <label className="block text-[10px] font-black text-[#002D5B] uppercase tracking-wider mb-1.5 ml-1">Código Postal / Postcode</label>
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
                    <label className="block text-[10px] font-black text-[#002D5B] uppercase tracking-wider mb-1.5 ml-1">Ciudad / City</label>
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
                      <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Zona Detectada / Zone Detected</span>
                      <span className="font-extrabold text-xs text-[#002D5B] flex items-center gap-1.5">
                        {detectZone(tempPostcode).label} 
                        {detectZone(tempPostcode).surchargePercent > 0 ? (
                          <span className="text-[10px] font-black bg-blue-100 text-[#007bff] px-1.5 py-0.5 rounded-md leading-none">
                            +{detectZone(tempPostcode).surchargePercent}% local rate
                          </span>
                        ) : (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md leading-none">
                            Base rate
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
                  className="w-full bg-[#002D5B] hover:bg-[#001D3B] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wide shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-4"
                >
                  Confirmar / Save & Continue
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: WALLEE CONFIG ERROR & FALLBACK SELECTION --- */}
        {walleeError && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md animate-fade-in select-none">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-8 relative flex flex-col overflow-hidden border border-slate-100">
              {/* Highlight ribbon */}
              <div className="absolute top-0 left-0 w-full h-32 bg-amber-50 rounded-b-[50%] -z-0 transform -translate-y-16 scale-x-150"></div>
              
              {/* Close Button */}
              <button 
                onClick={() => setWalleeError(null)}
                className="absolute top-6 right-6 p-2 bg-white hover:bg-slate-100 rounded-full border border-gray-100 transition-colors z-20 cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>

              <div className="relative z-10 text-center mb-6">
                <span className="inline-block text-4xl p-3 bg-amber-100 rounded-2xl mb-3">⚙️</span>
                <h3 className="text-xl font-black text-amber-800 uppercase tracking-tight">Checkout Service Alert / Alerta de Pasarela</h3>
                
                {/* Alert message display */}
                <div className="mt-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl text-left">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Details / Detalles Técnicos</p>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed">
                    {walleeError.message}
                  </p>
                  <p className="text-[11px] text-amber-700 font-bold mt-2 leading-relaxed">
                    ⚠️ The Wallee transaction API is not fully configured or active with these credentials. To continue your reservation preview, select one of the valid checkout workflows below:
                  </p>
                </div>
              </div>

              <div className="space-y-4 relative z-10 text-left">
                {/* Option 1: Sandbox success */}
                <button 
                  type="button"
                  onClick={() => {
                    const dataWithSuccess = {
                      ...walleeError.dataToSave,
                      payment: {
                        ...(walleeError.dataToSave.payment || {}),
                        status: 'captured' as const,
                        method: 'card' as const,
                        gateway: 'wallee' as const,
                        transactionId: 'paid_via_gateway'
                      },
                      timestamps: {
                        ...(walleeError.dataToSave.timestamps || {}),
                        depositCapturedAt: new Date().toISOString()
                      }
                    };
                    localStorage.setItem('pending_booking', JSON.stringify(dataWithSuccess));
                    setWalleeError(null);
                    window.location.search = '?payment=success';
                  }}
                  className="w-full p-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white rounded-[2rem] text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg shadow-emerald-500/20 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl pt-0.5">🚀</span>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-wide">Demo Sandbox Bypass (Recommended)</h4>
                      <p className="text-xs text-emerald-100 mt-1 leading-snug">
                        Simulate instant payment confirmation. This will fire webhooks (Make.com), generate final receipts, and send email triggers. Perfect for previewing the complete booking lifecycle.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Option 2: Wire Transfer / Invoice */}
                <button 
                  type="button"
                  onClick={() => {
                    const dataWithInvoice = {
                      ...walleeError.dataToSave,
                      payment: {
                        ...(walleeError.dataToSave.payment || {}),
                        status: 'pending' as const,
                        method: 'bank_transfer' as const,
                        gateway: 'manual' as const,
                        transactionId: 'invoice_bank_transfer'
                      },
                      timestamps: {
                        ...(walleeError.dataToSave.timestamps || {}),
                        depositCapturedAt: null
                      }
                    };
                    localStorage.setItem('pending_booking', JSON.stringify(dataWithInvoice));
                    setWalleeError(null);
                    window.location.search = '?payment=invoice';
                  }}
                  className="w-full p-5 bg-[#002D5B] hover:bg-[#001D3B] text-white rounded-[2rem] text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg shadow-[#002D5B]/20 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl pt-0.5">📄</span>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-wide">Direct Transfer & Invoice (Factura)</h4>
                      <p className="text-xs text-blue-100 mt-1 leading-snug">
                        Submit the maintenance request without upfront online payment. We will prepare and dispatch an invoice to your email with direct bank transfer instructions.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="relative z-10 mt-6 text-center">
                <button 
                  type="button"
                  onClick={() => setWalleeError(null)}
                  className="px-6 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Cancel / Volver
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODALS --- */}
        {showSuccess && <SuccessModal onClose={handleCloseSuccess} />}
        {showInclusionsModal && <ServiceDetailsModal type={showInclusionsModal} onClose={() => setShowInclusionsModal(null)} />}

        
        {/* MODAL: Travel Fee Explanation */}
        {showTravelModal && (
            <ModalOverlay title="Smart Logistics Pricing" onClose={() => setShowTravelModal(false)}>
                <div className="space-y-8">
                    <div className="text-center">
                        <img src={mascotImageUrl} alt="Kai explaining" className="w-24 h-24 mx-auto mb-4 object-contain animate-float" />
                        <h4 className="text-xl font-black text-[#002D5B] uppercase tracking-tight">Our Travel Offers</h4>
                        <p className="text-sm text-gray-500 font-medium">Bundling services helps us reduce our carbon footprint and operational costs. We pass those savings directly to you!</p>
                    </div>

                    <div className="space-y-4">
                        <div className={`p-5 rounded-2xl border-2 transition-all ${travelFee === 45 ? 'border-[#002D5B] bg-slate-50' : 'border-gray-100 bg-white'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-black text-gray-800 uppercase tracking-widest text-xs">Tier 1: Standard</span>
                                <span className="font-black text-gray-800">CHF 45.00</span>
                            </div>
                            <p className="text-xs text-gray-500">Applies to single service requests in our service area.</p>
                        </div>

                        <div className={`p-5 rounded-2xl border-2 transition-all ${travelFee === 25 ? 'border-[#007bff] bg-blue-50' : 'border-gray-100 bg-white'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-black text-[#007bff] uppercase tracking-widest text-xs">Tier 2: Bundle Deal</span>
                                <span className="font-black text-[#007bff]">CHF 25.00</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">How to qualify:</p>
                            <ul className="text-[10px] space-y-1 font-bold text-gray-600">
                                <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-blue-400"/> 1 Core Service + 1 Specialized Service</li>
                                <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-blue-400"/> 2 Specialized Services</li>
                            </ul>
                        </div>

                        <div className={`p-5 rounded-2xl border-2 transition-all ${travelFee === 0 && cart.length > 0 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-black text-emerald-600 uppercase tracking-widest text-xs">Tier 3: Premium (FREE)</span>
                                <span className="font-black text-emerald-600">FREE</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">The ultimate Kraken experience:</p>
                            <ul className="text-[10px] space-y-1 font-bold text-gray-600">
                                <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-emerald-400"/> 2+ Core Services (e.g. Tenancy + Move)</li>
                                <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-emerald-400"/> 1 Core Service + 2 Specialized Services</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-xl flex items-start gap-3">
                         <LeafIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                         <p className="text-[10px] text-indigo-900 font-bold leading-relaxed">
                            By grouping multiple services on the same visit, we optimize our technicians' schedules and reduce vehicle emissions. Thank you for choosing a more sustainable logistics model!
                         </p>
                    </div>

                    <button 
                        onClick={() => setShowTravelModal(false)}
                        className="w-full bg-[#002D5B] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
                    >
                        Great, Thanks!
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: End of Tenancy */}
        {activeModal === 'end-of-tenancy' && (
            <ModalOverlay title={t('services.endOfTenancy.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }}>
                <div className="space-y-6">
                    <button onClick={() => setShowInclusionsModal('end-of-tenancy')} className="w-full text-center text-[#007bff] text-xs font-black hover:underline flex items-center justify-center gap-2.5 bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"><InfoIcon className="w-5 h-5" />{t('consultation.whatsIncluded')}</button>
                    
                    {config.roomsCount === 0 && config.bathroomsCount === 0 && (config.balconyCount > 0 || config.storageCount > 0 || config.carpetCount > 0 || config.furnitureCount > 0) && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4 animate-fade-in">
                            <p className="text-[10px] text-amber-800 font-bold flex items-center gap-2">
                                <InfoIcon className="w-4 h-4" /> A minimum call-out fee of CHF {PRICES.baseCallOut.toFixed(2)} applies if no rooms are selected and only the extras are selected.
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <CounterCard icon="🛌" label="Number of Pieces (Hab + Lounge)" value={config.roomsCount} onChange={(v) => { const r = Math.max(0,v); const d = calculateEOTDuration(r, config.bathroomsCount, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount); setConfig({ ...config, roomsCount: r, duration: d }); }} />
                        <CounterCard icon="🚿" label="Number of Bathrooms" value={config.bathroomsCount} onChange={(v) => { const b = Math.max(0,v); const d = calculateEOTDuration(config.roomsCount, b, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount); setConfig({ ...config, bathroomsCount: b, duration: d }); }} />
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <ClockIcon className="w-4 h-4 text-[#007bff]" />Manual Duration Increase
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
                        <p className="text-[10px] text-gray-400 text-center mt-2 font-medium italic">Manually increasing hours adds CHF {PRICES.deepHourly.toFixed(2)}/h to the base price.</p>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Extras</label>
                        <div className="space-y-3">
                            <CounterCard icon="☀️" label="Balconies / Terraces" subLabel="+ CHF 40.00 / +30m" value={config.balconyCount} onChange={(v) => setConfig({...config, balconyCount: v, duration: calculateEOTDuration(config.roomsCount, config.bathroomsCount, v, config.storageCount, config.carpetCount, config.furnitureCount)})} />
                            <CounterCard icon="📦" label="Storage / Garage" subLabel="+ CHF 30.00 / +30m" value={config.storageCount} onChange={(v) => setConfig({...config, storageCount: v, duration: calculateEOTDuration(config.roomsCount, config.bathroomsCount, config.balconyCount, v, config.carpetCount, config.furnitureCount)})} />
                            <CounterCard icon="🧹" label="Carpet Cleaning" subLabel="+ CHF 60.00 per room / +1h" value={config.carpetCount} onChange={(v) => setConfig({...config, carpetCount: v, duration: calculateEOTDuration(config.roomsCount, config.bathroomsCount, config.balconyCount, config.storageCount, v, config.furnitureCount)})} />
                            <CounterCard icon="🛋️" label="Upholstery / Furniture" subLabel="+ CHF 50.00 per item / +30m" value={config.furnitureCount} onChange={(v) => setConfig({...config, furnitureCount: v, duration: calculateEOTDuration(config.roomsCount, config.bathroomsCount, config.balconyCount, config.storageCount, config.carpetCount, v)})} />
                        </div>
                    </div>
                    <OptionCard 
                        icon="🪟"
                        title={`Window Cleaning ${config.roomsCount > 0 || config.bathroomsCount > 0 ? '(Included in Rate)' : ''}`}
                        description="Complete treatment of glass, frames, and sills. EXCLUDES hard-to-reach windows requiring poles or steps."
                        selected={config.roomsCount > 0 || config.bathroomsCount > 0}
                        onClick={() => {}}
                        price={config.roomsCount > 0 || config.bathroomsCount > 0 ? "Included" : "With Rooms"}
                    />
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center px-2">
                        <span className="font-bold text-gray-800">Estimated Total</span>
                        <span className="font-black text-2xl text-[#007bff]">CHF {getEstimatedPrice().toFixed(2)}</span>
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-colors uppercase tracking-wider">
                        {editingItemId ? 'Update Service' : `Add ${formatTotalHours(getActiveTotalHours())} (CHF ${getEstimatedPrice().toFixed(2)})`}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Deep Cleaning */}
        {activeModal === 'deep-cleaning' && (
            <ModalOverlay title={t('services.deepCleaning.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }}>
                <div className="space-y-6">
                    <button onClick={() => setShowInclusionsModal('deep-cleaning')} className="w-full text-center text-[#007bff] text-xs font-black hover:underline flex items-center justify-center gap-2.5 bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"><InfoIcon className="w-5 h-5" />{t('consultation.whatsIncluded')}</button>
                    
                    {config.bedrooms === 0 && config.bathrooms === 0 && (config.balconyCount > 0 || config.storageCount > 0 || config.carpetCount > 0 || config.furnitureCount > 0) && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4 animate-fade-in">
                            <p className="text-[10px] text-amber-800 font-bold flex items-center gap-2">
                                <InfoIcon className="w-4 h-4" /> A minimum call-out fee of CHF {PRICES.baseCallOut.toFixed(2)} applies if no bedrooms are selected and only the extras are selected.
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Frequency</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {id: 'One-Time', icon: '✨'},
                                {id: 'Every 3 Months', icon: '🗓️'},
                                {id: 'Every 4 Months', icon: '🗓️'},
                                {id: 'Every 6 Months', icon: '🗓️'},
                                {id: 'Every Year', icon: '📅'}
                            ].map(f => (
                                <OptionCard 
                                    key={f.id} 
                                    icon={f.icon} 
                                    title={f.id} 
                                    selected={config.frequency === f.id} 
                                    onClick={() => setConfig({...config, frequency: f.id})} 
                                />
                            ))}
                        </div>
                    </div>

                    {config.frequency !== 'One-Time' && (
                        <div className="animate-fade-in">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Preferred Day for Recurrence</label>
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
                        <CounterCard icon="🛌" label="Bedrooms" value={config.bedrooms} onChange={(v) => setConfig({ ...config, bedrooms: v, duration: calculateCleaningDuration('deep-cleaning', v, config.bathrooms, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount) })} />
                        <CounterCard icon="🚿" label="Bathrooms" value={config.bathrooms} onChange={(v) => setConfig({ ...config, bathrooms: v, duration: calculateCleaningDuration('deep-cleaning', config.bedrooms, v, config.balconyCount, config.storageCount, config.carpetCount, config.furnitureCount) })} />
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between mb-2"><label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2"><ClockIcon className="w-4 h-4 text-[#007bff]" />Duration (Hours)</label><span className="font-black text-[#007bff] text-lg">{formatTotalHours(getActiveTotalHours())}</span></div>
                        <input type="range" min="4" max="20" step="0.5" value={getActiveTotalHours()} onChange={(e) => setConfig({ ...config, duration: parseFloat(e.target.value) })} className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007bff]" />
                        <p className="text-[10px] text-gray-400 text-center mt-2">Total time reflects rooms and extras.</p>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Extras</label>
                        <div className="space-y-3">
                            <CounterCard icon="☀️" label="Balconies / Terraces" subLabel="+ CHF 40.00 / +30m" value={config.balconyCount} onChange={(v) => setConfig({...config, balconyCount: v, duration: calculateCleaningDuration('deep-cleaning', config.bedrooms, config.bathrooms, v, config.storageCount, config.carpetCount, config.furnitureCount)})} />
                            <CounterCard icon="📦" label="Storage / Garage" subLabel="+ CHF 30.00 / +30m" value={config.storageCount} onChange={(v) => setConfig({...config, storageCount: v, duration: calculateCleaningDuration('deep-cleaning', config.bedrooms, config.bathrooms, config.balconyCount, v, config.carpetCount, config.furnitureCount)})} />
                            <CounterCard icon="🧹" label="Carpet Cleaning" subLabel="+ CHF 60.00 per room / +1h" value={config.carpetCount} onChange={(v) => setConfig({...config, carpetCount: v, duration: calculateCleaningDuration('deep-cleaning', config.bedrooms, config.bathrooms, config.balconyCount, config.storageCount, v, config.furnitureCount)})} />
                            <CounterCard icon="🛋️" label="Upholstery / Furniture" subLabel="+ CHF 50.00 per item / +30m" value={config.furnitureCount} onChange={(v) => setConfig({...config, furnitureCount: v, duration: calculateCleaningDuration('deep-cleaning', config.bedrooms, config.bathrooms, config.balconyCount, config.storageCount, config.carpetCount, v)})} />
                        </div>
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-colors uppercase tracking-wider">
                        {editingItemId ? 'Update Service' : `Add ${formatTotalHours(getActiveTotalHours())} (CHF ${getEstimatedPrice().toFixed(2)})`}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Daily/Recurring Cleaning (With detailed sub-menus) */}
        {activeModal === 'daily-cleaning' && (
            <ModalOverlay title={t('services.dailyCleaning.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }}>
                <div className="space-y-8">
                    <button onClick={() => setShowInclusionsModal('daily-cleaning')} className="w-full text-center text-[#007bff] text-xs font-black hover:underline flex items-center justify-center gap-2.5 bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"><InfoIcon className="w-5 h-5" />{t('consultation.whatsIncluded')}</button>
                    
                    {config.bedrooms === 0 && config.bathrooms === 0 && (config.ironing || config.laundry || config.oven || config.cabinets || config.fridge || config.windowCount > 0) && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4 animate-fade-in">
                            <p className="text-[10px] text-amber-800 font-bold flex items-center gap-2">
                                <InfoIcon className="w-4 h-4" /> A minimum call-out fee of CHF {PRICES.baseCallOut.toFixed(2)} applies if no bedrooms are selected and only the extras are selected.
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Frequency</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Daily', 'Weekly', 'Bi-Weekly', 'Every 4 Weeks', 'More Frequently'].map(f => (
                                <OptionCard key={f} icon="🗓️" title={f} selected={config.frequency === f} onClick={() => setConfig({...config, frequency: f})} />
                            ))}
                        </div>
                    </div>

                    <div className="animate-fade-in">
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Preferred Day(s) for Service</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Wednesdays, or Tuesdays & Fridays..." 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] text-sm font-medium text-gray-700"
                            value={config.frequencyDetails || ''}
                            onChange={(e) => setConfig({...config, frequencyDetails: e.target.value})}
                        />
                    </div>

                    <OptionCard icon="👤" title="Same Operative" description="Dedicated cleaner for every visit" selected={config.sameOperative} onClick={() => setConfig({...config, sameOperative: !config.sameOperative})} />

                    <div className="space-y-4">
                        <CounterCard icon="🛌" label="Bedrooms" value={config.bedrooms} onChange={(v) => setConfig({ ...config, bedrooms: v, duration: calculateCleaningDuration('daily-cleaning', v, config.bathrooms) })} />
                        <CounterCard icon="🚿" label="Bathrooms" value={config.bathrooms} onChange={(v) => setConfig({ ...config, bathrooms: v, duration: calculateCleaningDuration('daily-cleaning', config.bedrooms, v) })} />
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between mb-2"><label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2"><ClockIcon className="w-4 h-4 text-[#007bff]" />Estimated Total Duration</label><span className="font-black text-[#007bff] text-lg">{formatTotalHours(getActiveTotalHours())}</span></div>
                        <input type="range" min="2.5" max="24" step="0.5" value={getActiveTotalHours()} onChange={(e) => setConfig({ ...config, duration: parseFloat(e.target.value) })} className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007bff]" />
                        <p className="text-[10px] text-gray-400 text-center mt-2">Duration bar includes all selected extra tasks.</p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Extra Services</label>
                        
                        {/* 1. Ironing Service */}
                        <div className="space-y-3">
                            <OptionCard icon="👔" title="Ironing Service" description="Add ironing to your routine" selected={config.ironing} onClick={() => setConfig({...config, ironing: !config.ironing})} />
                            {config.ironing && (
                                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in">
                                    <CounterCard icon="⏰" label="Duration (Hours)" value={config.ironingHours} step={0.5} onChange={(v) => setConfig({...config, ironingHours: v})} min={0.5} />
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Instructions</label>
                                    <textarea placeholder="e.g., Shirts on hangers, linens folded..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.ironingNotes} onChange={(e) => setConfig({...config, ironingNotes: e.target.value})}></textarea></div>
                                </div>
                            )}
                        </div>

                        {/* 2. Laundry Service */}
                        <div className="space-y-3">
                            <OptionCard icon="🧺" title="Laundry Service" description="Wash, Dry, or Both" selected={config.laundry} onClick={() => setConfig({...config, laundry: !config.laundry})} />
                            {config.laundry && (
                                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in">
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-3">Service Type</label>
                                    <div className="grid grid-cols-3 gap-2">{['Wash Only', 'Dry Only', 'Wash & Dry'].map(t => (
                                        <button key={t} onClick={() => setConfig({...config, laundryType: t})} className={`p-2 rounded-lg text-[10px] font-bold border-2 transition-all ${config.laundryType === t ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500'}`}>{t}</button>
                                    ))}</div></div>
                                    <CounterCard icon="👕" label="Number of Clothes" subLabel="Approximate items or loads" value={config.laundryItems} onChange={(v) => setConfig({...config, laundryItems: v})} />
                                    <CounterCard icon="⏰" label="Duration (Hours)" value={config.laundryHours} step={1} onChange={(v) => setConfig({...config, laundryHours: v})} min={1} />
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Fabric & Washing Method</label>
                                    <textarea placeholder="e.g., Cotton shirts cold wash, delicates air dry..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.laundryNotes} onChange={(e) => setConfig({...config, laundryNotes: e.target.value})}></textarea></div>
                                </div>
                            )}
                        </div>

                        {/* 3. Oven Cleaning */}
                        <div className="space-y-3">
                            <OptionCard icon="🍳" title="Oven Cleaning" description="Deep clean inside and out" selected={config.oven} onClick={() => setConfig({...config, oven: !config.oven})} />
                            {config.oven && (
                                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in">
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-3">Grease Level</label>
                                    <div className="grid grid-cols-3 gap-2">{['Low', 'Medium', 'High'].map(l => (
                                        <button key={l} onClick={() => setConfig({...config, ovenGrease: l})} className={`p-2 rounded-lg text-[10px] font-bold border-2 transition-all ${config.ovenGrease === l ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500'}`}>{l}</button>
                                    ))}</div><p className="text-[9px] text-gray-400 mt-2 italic">Duration adjusts based on grease: Low (30m), Medium (40m), High (50m).</p></div>
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Instructions / Details</label>
                                    <textarea placeholder="e.g., Double oven, brand details..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.ovenNotes} onChange={(e) => setConfig({...config, ovenNotes: e.target.value})}></textarea></div>
                                </div>
                            )}
                        </div>

                        {/* 4. Cabinet Cleaning */}
                        <div className="space-y-3">
                            <OptionCard icon="🚪" title="Cabinet Cleaning" description="Interior cleaning & organizing" selected={config.cabinets} onClick={() => setConfig({...config, cabinets: !config.cabinets})} />
                            {config.cabinets && (
                                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in">
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-3">Current Condition</label>
                                    <div className="grid grid-cols-2 gap-2">{['Empty', 'With Items'].map(c => (
                                        <button key={c} onClick={() => setConfig({...config, cabinetCondition: c})} className={`p-2 rounded-lg text-[10px] font-bold border-2 transition-all ${config.cabinetCondition === c ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500'}`}>{c}</button>
                                    ))}</div></div>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                        <div className="flex flex-col"><span className="text-xs font-bold text-gray-800">Remove & Organize Items</span><span className="text-[9px] text-gray-400">Increases time (+30m)</span></div>
                                        <button onClick={() => setConfig({...config, cabinetOrganize: !config.cabinetOrganize})} className={`w-10 h-5 rounded-full relative transition-colors ${config.cabinetOrganize ? 'bg-[#007bff]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.cabinetOrganize ? 'translate-x-5' : 'translate-x-0'}`}></div></button>
                                    </div>
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Notes / Specific Cabinets</label>
                                    <textarea placeholder="e.g., Kitchen upper cabinets only..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.cabinetNotes} onChange={(e) => setConfig({...config, cabinetNotes: e.target.value})}></textarea></div>
                                </div>
                            )}
                        </div>

                        {/* 5. Fridge Cleaning */}
                        <div className="space-y-3">
                            <OptionCard icon="❄️" title="Fridge Cleaning" description="Hygiene & Organization" selected={config.fridge} onClick={() => setConfig({...config, fridge: !config.fridge})} />
                            {config.fridge && (
                                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#007bff] space-y-4 animate-fade-in">
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-3">Current Condition</label>
                                    <div className="grid grid-cols-2 gap-2">{['Empty', 'With Items'].map(c => (
                                        <button key={c} onClick={() => setConfig({...config, fridgeCondition: c})} className={`p-2 rounded-lg text-[10px] font-bold border-2 transition-all ${config.fridgeCondition === c ? 'border-[#007bff] bg-white text-[#007bff]' : 'border-transparent bg-white text-gray-500'}`}>{c}</button>
                                    ))}</div></div>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                        <div className="flex flex-col"><span className="text-xs font-bold text-gray-800">Remove & Organize Items</span><span className="text-[9px] text-gray-400">Increases time (+30m)</span></div>
                                        <button onClick={() => setConfig({...config, fridgeOrganize: !config.fridgeOrganize})} className={`w-10 h-5 rounded-full relative transition-colors ${config.fridgeOrganize ? 'bg-[#007bff]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.fridgeOrganize ? 'translate-x-5' : 'translate-x-0'}`}></div></button>
                                    </div>
                                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Notes / Details</label>
                                    <textarea placeholder="e.g., Freezer defrosting needed..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007bff]" value={config.fridgeNotes} onChange={(e) => setConfig({...config, fridgeNotes: e.target.value})}></textarea></div>
                                </div>
                            )}
                        </div>

                        <CounterCard 
                            icon="🪟" 
                            label="Window Cleaning" 
                            subLabel="Interior & accessible outside (+3m/window)" 
                            value={config.windowCount || 0} 
                            onChange={(v) => setConfig({...config, windowCount: v})} 
                        />
                    </div>

                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-colors uppercase tracking-wider">
                        {editingItemId ? 'Update Service' : `Add ${formatTotalHours(getActiveTotalHours())} (CHF ${getEstimatedPrice().toFixed(2)})`}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Furniture Moving */}
        {activeModal === 'moving' && (
            <ModalOverlay title={t('services.movingFurniture.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }}>
                <div className="space-y-6">
                    <button 
                        onClick={() => setShowMovingInfo(true)}
                        className="w-full flex items-center justify-center gap-3 p-5 bg-blue-50/40 border border-blue-100 rounded-[2rem] hover:bg-blue-50 transition-all group"
                    >
                        <InfoIcon className="w-5 h-5 text-[#007bff]" />
                        <span className="text-sm font-black text-[#007bff] tracking-tight">How our moving service works?</span>
                    </button>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">What are we moving?</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {id: 'Home Contents', icon: '🏠'},
                                {id: 'Office', icon: '🏢'},
                                {id: 'Commercial', icon: '🏬'},
                                {id: 'Single Item', icon: '📦'},
                                {id: 'Specialty', icon: '💎'}
                            ].map(m => (
                                <OptionCard 
                                    key={m.id}
                                    icon={m.icon}
                                    title={m.id}
                                    selected={config.moveType === m.id}
                                    onClick={() => setConfig({...config, moveType: m.id})}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Service Level</label>
                        <div className="space-y-2">
                            {[
                                {id: 'Standard', label: 'Standard', movers: '2 Movers', rate: '145 CHF/h', icon: '🚛'},
                                {id: 'Large', label: 'Large', movers: '3 Movers', rate: '195 CHF/h', icon: '🚚'},
                                {id: 'Commercial', label: 'Commercial', movers: 'Custom Count', rate: 'Custom', icon: '🏗️'}
                            ].map(lv => (
                                <OptionCard 
                                    key={lv.id}
                                    icon={lv.icon}
                                    title={lv.label}
                                    description={lv.movers}
                                    price={lv.rate}
                                    selected={config.serviceLevel === lv.id}
                                    onClick={() => {
                                        const count = lv.id === 'Standard' ? 2 : (lv.id === 'Large' ? 3 : 4);
                                        setConfig({...config, serviceLevel: lv.id, moversCount: count});
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {config.serviceLevel === 'Commercial' && (
                        <div className="animate-fade-in">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Custom Moving Crew</label>
                            <CounterCard 
                                icon="👷" 
                                label="Number of Movers" 
                                subLabel="Required for commercial projects" 
                                value={config.moversCount} 
                                min={4} 
                                onChange={(v) => setConfig({...config, moversCount: v})} 
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <MapPinIcon className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    Starting Location (Source)
                                </label>
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-black text-gray-700" 
                                        placeholder="Full Address (Street, House No.)" 
                                        value={config.fromAddress} 
                                        onChange={(e) => setConfig({...config, fromAddress: e.target.value})} 
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input 
                                            type="text" 
                                            className={`w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-black text-gray-700 transition-colors ${config.fromZip && !(config.fromZip.startsWith('80') || config.fromZip.startsWith('82') || config.fromZip.startsWith('84')) ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} 
                                            placeholder="ZIP Code (e.g. 8000)" 
                                            value={config.fromZip} 
                                            onChange={(e) => setConfig({...config, fromZip: e.target.value})} 
                                        />
                                        <select 
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-black text-gray-700"
                                            value={config.floorFrom}
                                            onChange={(e) => setConfig({...config, floorFrom: e.target.value})}
                                        >
                                            <option value="Basement">Basement</option>
                                            <option value="0">Ground Floor</option>
                                            <option value="1">1st Floor</option>
                                            <option value="2">2nd Floor</option>
                                            <option value="3">3rd Floor</option>
                                            <option value="4">4th Floor</option>
                                            <option value="5">5th Floor</option>
                                            <option value="6+">6th Floor or Higher</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1">
                                        <select 
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-black text-gray-700"
                                            value={config.accessFrom}
                                            onChange={(e) => setConfig({...config, accessFrom: e.target.value})}
                                        >
                                            <option value="Lift">Lift Access</option>
                                            <option value="Stairs">Only Stairs</option>
                                        </select>
                                    </div>
                                    {config.fromZip && !(config.fromZip.startsWith('80') || config.fromZip.startsWith('82') || config.fromZip.startsWith('84')) && (
                                        <p className="text-[10px] text-red-500 font-bold px-1">We currently only support Zurich (80xx), Winterthur (84xx), and Schaffhausen (82xx).</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <TruckIcon className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    Destination Location (Target)
                                </label>
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-black text-gray-700" 
                                        placeholder="Full Address (Street, House No.)" 
                                        value={config.toAddress} 
                                        onChange={(e) => setConfig({...config, toAddress: e.target.value})} 
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input 
                                            type="text" 
                                            className={`w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-black text-gray-700 transition-colors ${config.toZip && !(config.toZip.startsWith('80') || config.toZip.startsWith('82') || config.toZip.startsWith('84')) ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} 
                                            placeholder="ZIP Code (e.g. 8200)" 
                                            value={config.toZip} 
                                            onChange={(e) => setConfig({...config, toZip: e.target.value})} 
                                        />
                                        <select 
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-black text-gray-700"
                                            value={config.floorTo}
                                            onChange={(e) => setConfig({...config, floorTo: e.target.value})}
                                        >
                                            <option value="Basement">Basement</option>
                                            <option value="0">Ground Floor</option>
                                            <option value="1">1st Floor</option>
                                            <option value="2">2nd Floor</option>
                                            <option value="3">3rd Floor</option>
                                            <option value="4">4th Floor</option>
                                            <option value="5">5th Floor</option>
                                            <option value="6+">6th Floor or Higher</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1">
                                        <select 
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-black text-gray-700"
                                            value={config.accessTo}
                                            onChange={(e) => setConfig({...config, accessTo: e.target.value})}
                                        >
                                            <option value="Lift">Lift Access</option>
                                            <option value="Stairs">Only Stairs</option>
                                        </select>
                                    </div>
                                    {config.toZip && !(config.toZip.startsWith('80') || config.toZip.startsWith('82') || config.toZip.startsWith('84')) && (
                                        <p className="text-[10px] text-red-500 font-bold px-1">We currently only support Zurich (80xx), Winterthur (84xx), and Schaffhausen (82xx).</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Mechanical & Lift Assistance</label>
                        <div className="grid grid-cols-1 gap-3">
                            <OptionCard 
                                icon="🏗️" 
                                title="Hydraulic Lift" 
                                description="Required for bulky furniture to upper floors" 
                                price="150 CHF/h"
                                selected={config.hydraulicLift} 
                                onClick={() => setConfig({...config, hydraulicLift: !config.hydraulicLift})} 
                            />
                            {config.hydraulicLift && (
                                <div className="animate-fade-in">
                                    <CounterCard 
                                        icon="🏗️" 
                                        label="Lift Operating Hours" 
                                        subLabel="Estimated time for hydraulic lift usage" 
                                        value={config.hydraulicLiftHours} 
                                        min={1} 
                                        step={0.5}
                                        onChange={(v) => setConfig({...config, hydraulicLiftHours: v})} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between mb-2"><label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2"><ClockIcon className="w-4 h-4 text-[#007bff]" />Estimated Total Duration</label><span className="font-black text-[#007bff] text-lg">{formatTotalHours(getActiveTotalHours())}</span></div>
                        <input type="range" min="3" max="24" step="0.5" value={getActiveTotalHours()} onChange={(e) => setConfig({ ...config, duration: parseFloat(e.target.value) })} className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007bff]" />
                        <p className="text-[10px] text-gray-400 text-center mt-2">Minimum 3 hours required for moving services.</p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Additional Moving Options</label>
                        <OptionCard 
                            icon="🔧" 
                            title="Furniture Assembly" 
                            description="Assembly and disassembly of beds, desks, etc." 
                            price="80 CHF/h"
                            selected={config.assembly} 
                            onClick={() => setConfig({...config, assembly: !config.assembly})} 
                        />
                        {config.assembly && (
                            <div className="animate-fade-in">
                                <CounterCard 
                                    icon="⏰" 
                                    label="Assembly Hours" 
                                    subLabel="Estimated time for assembly tasks" 
                                    value={config.assemblyHours} 
                                    min={1} 
                                    step={0.5}
                                    onChange={(v) => setConfig({...config, assemblyHours: v})} 
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Inventory & Special Instructions</label>
                        <textarea 
                            placeholder="e.g., 3-bedroom house, piano, 15 large boxes, fragile antiques..." 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] text-sm font-medium text-gray-700 min-h-[100px]"
                            value={config.description}
                            onChange={(e) => setConfig({...config, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center px-2">
                        <span className="font-bold text-gray-800">Estimated Total</span>
                        <span className="font-black text-2xl text-[#007bff]">CHF {getEstimatedPrice().toFixed(2)}</span>
                    </div>

                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-colors uppercase tracking-wider">
                        {editingItemId ? 'Update Service' : `Add ${formatTotalHours(getActiveTotalHours())} (CHF ${getEstimatedPrice().toFixed(2)})`}
                    </button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Moving Info Pop-up */}
        {showMovingInfo && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-fade-in-up">
                    <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2.5 rounded-2xl">
                                <InfoIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-[#002D5B] uppercase tracking-tight">Moving Process</h3>
                        </div>
                        <button onClick={() => setShowMovingInfo(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                            <XMarkIcon className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </button>
                    </div>
                    
                    <div className="px-8 py-6 space-y-6">
                        <div className="flex gap-5">
                            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-blue-600 font-black text-lg">1</div>
                            <div className="space-y-1">
                                <h4 className="font-black text-gray-800 text-sm uppercase tracking-wider">Storage & Lift Constraints</h4>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    If the lift interior is too narrow for specific items, our team will utilize the staircase. For safety, this may require additional movers to manage the weight and dimensions properly.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-emerald-600 font-black text-lg">2</div>
                            <div className="space-y-1">
                                <h4 className="font-black text-gray-800 text-sm uppercase tracking-wider">Surface Protection</h4>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    We guarantee that all delicate surfaces, floors, and furniture corners will be protected using high-quality padding and blankets to prevent any scratches during transit.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-10 h-10 bg-amber-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-amber-600 font-black text-lg">3</div>
                            <div className="space-y-1">
                                <h4 className="font-black text-gray-800 text-sm uppercase tracking-wider">Hydraulic Lift Necessity</h4>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    For oversized pieces that cannot safely travel via stairs or lifts, a hydraulic external lift may be necessary to facilitate delivery through large windows or balconies.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-4">
                        <button 
                            onClick={() => setShowMovingInfo(false)}
                            className="w-full bg-[#002D5B] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-[#001D3A] transition-all active:scale-[0.98]"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL: Gardening */}
        {activeModal === 'gardening' && (
            <ModalOverlay title={t('services.gardening.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Garden Size</label>
                        <div className="space-y-2">
                            {[
                                {id: 'Small', label: 'Small (<50 m²)', desc: 'General site cleanup and assessment.', price: '140 CHF', icon: '🏡'},
                                {id: 'Medium', label: 'Medium (50-150 m²)', desc: 'Mowing, edging and flowerbed cleaning.', price: '260 CHF', icon: '🌳'},
                                {id: 'Large', label: 'Large (150-400 m²)', desc: 'Complete full seasonal maintenance.', price: '480 CHF', icon: '🏰'},
                                {id: 'XL', label: 'Extra Large (+400 m²)', desc: 'Detailed property analysis required.', price: 'INQUIRY', icon: '🌲'}
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
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Add-on Tasks</label>
                        <div className="space-y-2">
                             <OptionCard 
                                icon="🌱" 
                                title="Lawn Mowing" 
                                description="Mowing & Blowing" 
                                price="+60 CHF" 
                                selected={config.mowing} 
                                onClick={() => setConfig({...config, mowing: !config.mowing})} 
                             />
                             <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl">
                                  <div className="flex justify-between items-center mb-3"><div><h5 className="text-xs font-bold text-gray-700">Hedge Trimming 🌿</h5><p className="text-[9px] text-gray-400">Linear meter estimation required.</p></div><span className="text-[10px] font-black text-emerald-600 uppercase">+15 CHF/m</span></div>
                                  <CounterInput label="Total Linear Meters" value={config.hedgeMeters} onChange={(v) => setConfig({...config, hedgeMeters: v})} />
                             </div>
                             {[
                                 {id: 'planting', label: 'Planting & Mulching', desc: 'Labor only, plants quoted separately.', price: '+80 CHF', icon: '🧤'},
                                 {id: 'cleanup', label: 'Seasonal Cleanup', desc: 'Deep winter/autumn leaves removal.', price: '+120 CHF', icon: '🍂'},
                                 {id: 'greenWaste', label: 'Green Waste Disposal', desc: 'Mandatory if no local bio bin available.', price: '+50 CHF', icon: '♻️'},
                             ].map(task => (
                                <OptionCard 
                                    key={task.id}
                                    icon={task.icon}
                                    title={task.label}
                                    description={task.desc}
                                    price={task.price}
                                    selected={config[task.id]}
                                    onClick={() => setConfig({...config, [task.id]: !config[task.id]})}
                                />
                             ))}
                        </div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl space-y-2 border border-emerald-100">
                         <div className="flex justify-between items-center"><span className="font-bold text-gray-800">Total Estimate</span><span className="font-black text-2xl text-emerald-600">CHF {getEstimatedPrice().toFixed(2)}</span></div>
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 transition-colors uppercase tracking-wider">{editingItemId ? 'Update Service' : 'Add to Quote'}</button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Exterior Cleaning */}
        {activeModal === 'exterior-cleaning' && (
            <ModalOverlay title={t('services.exterior.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Surface Type</label>
                        <div className="space-y-2">
                            {[
                                {id: 'Driveway / Path', icon: '🚗'},
                                {id: 'Facade / Walls', icon: '🏠', note: '+20% surcharge for specialized high-reach equipment.'},
                                {id: 'Decking / Patio', icon: '🪵'}
                            ].map(st => (
                                <OptionCard 
                                    key={st.id}
                                    icon={st.icon}
                                    title={st.id}
                                    description={st.note}
                                    selected={config.surface === st.id}
                                    onClick={() => setConfig({...config, surface: st.id})}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Surface Material</label>
                        <div className="grid grid-cols-1 gap-2">
                             {[
                                 {id: 'Stone', rate: '9 CHF / m²', icon: '🪨'},
                                 {id: 'Concrete', rate: '7 CHF / m²', icon: '🏗️'},
                                 {id: 'Wood', rate: '12 CHF / m²', icon: '🪵'},
                                 {id: 'Composite', rate: '8 CHF / m²', icon: '🧱'},
                                 {id: 'Glass (Ext. Windows)', rate: '11 CHF / m²', icon: '🪟'}
                             ].map(m => (
                                <OptionCard 
                                    key={m.id}
                                    icon={m.icon}
                                    title={m.id}
                                    price={m.rate}
                                    selected={config.material === m.id}
                                    onClick={() => setConfig({...config, material: m.id})}
                                />
                             ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Area (m²)</label>
                        <div className="relative">
                            <input type="number" className="w-full p-5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-black text-2xl text-[#002D5B]" value={config.approxSize} onChange={(e) => setConfig({...config, approxSize: e.target.value})} />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-black uppercase text-xs">m²</span>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl space-y-2 border border-blue-100">
                         <div className="flex justify-between items-center"><span className="font-bold text-gray-800">Estimated Total</span><span className="font-black text-2xl text-[#002D5B]">CHF {getEstimatedPrice().toFixed(2)}</span></div>
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-colors uppercase tracking-wider">{editingItemId ? 'Update Service' : 'Add to Quote'}</button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Gutter Cleaning */}
        {activeModal === 'gutter-cleaning' && (
            <ModalOverlay title={t('services.gutter.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Building Height</label>
                        <div className="space-y-2">
                            {[
                                {id: '1 Story', icon: '🏠', label: 'Ground Floor / Bungalow', price: '180 CHF'},
                                {id: '2 Stories', icon: '🏠', label: 'Townhouse / Standard', price: '290 CHF'},
                                {id: '3+ Stories', icon: '🏢', label: 'Large Detached / High-Reach', price: '450 CHF'}
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
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Gutter Length (Estimate)</label>
                        <div className="space-y-2">
                            {[
                                {id: 'Standard (<20m)', icon: '📏', price: 'Included'},
                                {id: 'Large (20-50m)', icon: '📐', price: '+100 CHF'},
                                {id: 'XL (>50m)', icon: '🌊', price: '+250 CHF'}
                            ].map(len => (
                                <OptionCard 
                                    key={len.id}
                                    icon={len.icon}
                                    title={len.id}
                                    price={len.price}
                                    selected={config.lengthCategory === len.id}
                                    onClick={() => setConfig({...config, lengthCategory: len.id})}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="bg-sky-50 p-5 rounded-2xl border border-sky-100 space-y-2">
                         <div className="flex justify-between items-center"><span className="font-bold text-gray-800">Total Estimate</span><span className="font-black text-2xl text-[#002D5B]">CHF {getEstimatedPrice().toFixed(2)}</span></div>
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-colors uppercase tracking-wider">{editingItemId ? 'Update Service' : `Add ${formatTotalHours(getActiveTotalHours())} (CHF ${getEstimatedPrice().toFixed(2)})`}</button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Car Detailing */}
        {activeModal === 'car-detailing' && (
            <ModalOverlay title={t('services.car.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }}>
                <div className="space-y-6">
                    <div><label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Postal Code</label><input type="text" maxLength={4} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 font-black text-gray-700 text-sm" placeholder="e.g., 8001" value={config.zipCode} onChange={(e) => setConfig({ ...config, zipCode: e.target.value.replace(/\D/g, '') })} /></div>
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-3 mb-6"><span className="w-8 h-8 bg-[#002D5B] text-white rounded-full flex items-center justify-center font-black text-sm">1</span><h4 className="font-black text-gray-800 text-xs uppercase tracking-wider">Vehicle Detail</h4></div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Category</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        {id: 'S', icon: '🚙', desc: 'Mini/Urban'},
                                        {id: 'M', icon: '🚗', desc: 'Sedan/Compact'},
                                        {id: 'L', icon: '🏎️', desc: 'SUV/Luxury'},
                                        {id: 'XL', icon: '🚐', desc: 'Vans/4x4'}
                                    ].map(cat => (
                                        <OptionCard 
                                            key={cat.id}
                                            icon={cat.icon}
                                            title={`Cat ${cat.id}`}
                                            description={cat.desc}
                                            selected={config.vehicles[0].category === cat.id}
                                            onClick={() => { const v = [...config.vehicles]; v[0].category = cat.id as any; setConfig({...config, vehicles: v}); }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Dirt Level</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        {id: 'Minimum', icon: '✨'},
                                        {id: 'Medium', icon: '🌫️'},
                                        {id: 'High', icon: '💨'},
                                        {id: 'Extreme', icon: '🚜'}
                                    ].map(lvl => (
                                        <OptionCard 
                                            key={lvl.id}
                                            icon={lvl.id === 'Minimum' ? '✨' : lvl.id === 'Medium' ? '🌫️' : lvl.id === 'High' ? '💨' : '🚜'}
                                            title={lvl.id}
                                            selected={config.vehicles[0].dirtLevel === lvl.id}
                                            onClick={() => { const v = [...config.vehicles]; v[0].dirtLevel = lvl.id as any; setConfig({...config, vehicles: v}); }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <OptionCard 
                                icon="🐾"
                                title="Pets"
                                description="Pet hair removal"
                                selected={config.vehicles[0].hasPets}
                                onClick={() => { const v = [...config.vehicles]; v[0].hasPets = !v[0].hasPets; setConfig({...config, vehicles: v}); }}
                            />
                        </div>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 space-y-2">
                         <div className="flex justify-between items-center"><span className="font-bold text-gray-800">Total Estimate</span><span className="font-black text-2xl text-[#007bff]">CHF {getEstimatedPrice().toFixed(2)}</span></div>
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-colors uppercase tracking-wider">{editingItemId ? 'Update Detail' : 'Add 1 Vehicle Detail'}</button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Pest Control */}
        {activeModal === 'pest-control' && (
            <ModalOverlay title={t('services.pest.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Pest Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {id: 'Insects', icon: '🐜'},
                                {id: 'Rodents', icon: '🐀'},
                                {id: 'Other', icon: '❓'}
                            ].map(f => (
                                <OptionCard 
                                    key={f.id}
                                    icon={f.icon}
                                    title={f.id}
                                    selected={config.pestType === f.id}
                                    onClick={() => setConfig({...config, pestType: f.id})}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Property Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {id: 'Residential', icon: '🏠'},
                                {id: 'Commercial', icon: '🏢'},
                                {id: 'Garden', icon: '🌳'}
                            ].map(f => (
                                <OptionCard 
                                    key={f.id}
                                    icon={f.icon}
                                    title={f.id}
                                    selected={config.propertyType === f.id}
                                    onClick={() => setConfig({...config, propertyType: f.id})}
                                />
                            ))}
                        </div>
                    </div>
                    <textarea placeholder="Describe the issue..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] text-sm" value={config.description} onChange={(e) => setConfig({...config, description: e.target.value})}></textarea>
                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] text-white py-4 rounded-2xl font-black text-lg uppercase">{editingItemId ? 'Update Request' : 'Request Quote'}</button>
                </div>
            </ModalOverlay>
        )}

        {/* MODAL: Waste Management */}
        {activeModal === 'waste-management' && (
            <ModalOverlay title={t('services.waste.title')} onClose={() => { setActiveModal(null); setEditingItemId(null); }}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Waste Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {id: 'Household', icon: '🏠'},
                                {id: 'Office', icon: '🏢'},
                                {id: 'Construction', icon: '🏗️'},
                                {id: 'Electronic', icon: '💻'}
                            ].map(f => (
                                <OptionCard 
                                    key={f.id}
                                    icon={f.icon}
                                    title={f.id}
                                    selected={config.wasteType === f.id}
                                    onClick={() => setConfig({...config, wasteType: f.id})}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Volume</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                {id: 'Small', icon: '🥡'},
                                {id: 'Van Load', icon: '🚐'},
                                {id: 'Large', icon: '🚛'}
                            ].map(f => (
                                <OptionCard 
                                    key={f.id}
                                    icon={f.icon}
                                    title={f.id}
                                    selected={config.volume === f.id}
                                    onClick={() => setConfig({...config, volume: f.id})}
                                />
                            ))}
                        </div>
                    </div>
                    <textarea placeholder="Describe items..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] text-sm" value={config.description} onChange={(e) => setConfig({...config, description: e.target.value})}></textarea>
                    <button onClick={handleAddToCart} className="w-full bg-[#007bff] text-white py-4 rounded-2xl font-black text-lg uppercase">{editingItemId ? 'Update Request' : 'Request Quote'}</button>
                </div>
            </ModalOverlay>
        )}

        {/* --- FINAL CONTACT FORM MODAL --- */}
        {isContactModalOpen && (
            <ModalOverlay title="Finalize & Request Final Quote" onClose={() => setContactModalOpen(false)}>
                <form onSubmit={ejecutarReservaYpago} className="space-y-8 animate-fade-in pb-10">
                    
                    {/* Identity Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg text-[#007bff]"><EnvelopeIcon className="w-5 h-5" /></div>
                            <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">Personal Identity</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="group relative">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Legal Name</label>
                                <input 
                                    id="name"
                                    name="name" 
                                    placeholder="Enter your name"
                                    className={`w-full p-4 bg-white border-2 rounded-[1.25rem] focus:border-[#007bff] focus:bg-blue-50/20 outline-none font-bold text-sm transition-all duration-300 shadow-sm ${errors.clientName ? 'border-red-500 bg-red-50 shake' : 'border-gray-100'}`} 
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                />
                                {errors.clientName && <span className="text-[10px] text-red-500 font-black mt-1 block ml-2">{errors.clientName}</span>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
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
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Contact Number</label>
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
                            <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">Preferred Schedule</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className={`bg-white p-2 rounded-2xl shadow-sm border-2 ${errors.selectedDate ? 'border-red-500' : 'border-gray-100'}`}>
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-2 mt-2">Pick Appointment Date</label>
                                <BookingCalendar selectedDate={selectedDate} onChange={setSelectedDate} hasError={!!errors.selectedDate} />
                                {errors.selectedDate && <span className="text-[10px] text-red-500 font-black mt-1 block ml-2">{errors.selectedDate}</span>}
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Arrival Time Window</label>
                                <div className={`bg-white p-4 rounded-2xl shadow-sm border-2 ${errors.selectedTime ? 'border-red-500' : 'border-gray-100'}`}>
                                    <TimePicker selectedTime={selectedTime} onChange={setSelectedTime} hasError={!!errors.selectedTime} />
                                    {errors.selectedTime && <span className="text-[10px] text-red-500 font-black mt-1 block ml-2">{errors.selectedTime}</span>}
                                    {selectedTime && totalDuration > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center animate-fade-in">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Window</span>
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

                    {/* Booking Mode Choice */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><BoltIcon className="w-5 h-5" /></div>
                            <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">{t('consultation.booking.title')}</h4>
                        </div>
                        <div className="space-y-4">
                            {/* Option A: Express Binding */}
                            <div 
                                onClick={() => setBookingMode('direct')}
                                className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden ${bookingMode === 'direct' ? 'border-[#007bff] bg-blue-50/50 shadow-lg scale-[1.02]' : errors.bookingMode ? 'border-red-500 bg-red-50/20' : 'border-gray-100 hover:border-blue-200 bg-white'}`}
                            >
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center text-3xl shadow-sm transition-all ${bookingMode === 'direct' ? 'bg-[#007bff] text-white' : 'bg-slate-100 text-gray-400'}`}>🚀</div>
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h5 className={`font-black text-base uppercase tracking-tight ${bookingMode === 'direct' ? 'text-[#007bff]' : 'text-gray-800'}`}>{t('consultation.booking.optionA.title')}</h5>
                                            <span className="bg-[#007bff] text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">15% Deposit</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">{t('consultation.booking.optionA.desc')}</p>
                                    </div>
                                </div>
                                {bookingMode === 'direct' && <div className="absolute top-4 right-4 text-[#007bff]"><CheckIcon className="w-6 h-6" /></div>}
                                {errors.bookingMode && !bookingMode && <div className="mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest">{errors.bookingMode}</div>}
                            </div>

                            {/* Option B: Study & Validation */}
                            <div 
                                onClick={() => setBookingMode('validate')}
                                className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden ${bookingMode === 'validate' ? 'border-emerald-500 bg-emerald-50/50 shadow-lg scale-[1.02]' : errors.bookingMode ? 'border-red-500 bg-red-50/20' : 'border-gray-100 hover:border-emerald-200 bg-white'}`}
                            >
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center text-3xl shadow-sm transition-all ${bookingMode === 'validate' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-gray-400'}`}>🔍</div>
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h5 className={`font-black text-base uppercase tracking-tight ${bookingMode === 'validate' ? 'text-emerald-600' : 'text-gray-800'}`}>{t('consultation.booking.optionB.title')}</h5>
                                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">15 CHF Fee</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">{t('consultation.booking.optionB.desc')}</p>
                                    </div>
                                </div>
                                {bookingMode === 'validate' && <div className="absolute top-4 right-4 text-emerald-500"><CheckIcon className="w-6 h-6" /></div>}
                                {errors.bookingMode && !bookingMode && <div className="mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest">{errors.bookingMode}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MapPinIcon className="w-5 h-5" /></div>
                            <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">Service Location / Dirección de Servicio</h4>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] flex items-center justify-between gap-4 shadow-sm animate-fade-in">
                            <div className="text-left">
                                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest leading-none mb-1">Dirección Confirmada / Verified Location</p>
                                <p className="font-extrabold text-sm text-[#002D5B]">{address}</p>
                                <p className="font-bold text-xs text-gray-500 mt-1">{postcode} {city}</p>
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
                                className="px-4 py-2 bg-white hover:bg-subtle hover:text-[#007bff] border border-gray-200 hover:border-[#007bff] rounded-xl font-black text-[10px] uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
                            >
                                Cambiar / Change
                            </button>
                        </div>
                    </div>

                    {/* Access & Special Requests */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><KeyIcon className="w-5 h-5" /></div>
                            <h4 className="text-sm font-black text-[#002D5B] uppercase tracking-tight">Access & Special Requests</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="group relative">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Property Access Method</label>
                                <div className="relative">
                                    <select 
                                        className="w-full p-4 bg-white border-2 border-gray-100 rounded-[1.25rem] focus:border-[#007bff] focus:bg-blue-50/20 outline-none font-bold text-sm transition-all duration-300 shadow-sm appearance-none cursor-pointer"
                                        value={accessMethod}
                                        onChange={(e) => setAccessMethod(e.target.value)}
                                    >
                                        <option value="I am on-site">I am on-site</option>
                                        <option value="Key with neighbor">Key with neighbor</option>
                                        <option value="Key in mailbox">Key in mailbox</option>
                                        <option value="Access code">Access code</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronDownIcon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Special requests or notes</label>
                                <textarea 
                                    className="w-full p-4 bg-white border-2 border-gray-100 rounded-[1.25rem] focus:border-[#007bff] focus:bg-blue-50/20 outline-none font-bold text-sm transition-all duration-300 shadow-sm min-h-[100px]"
                                    placeholder="Anything else we should know?"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Summary & Deposit Section */}
                    <div className="pt-6 border-t border-gray-100">
                        <div className={`bg-[#002D5B] text-white p-8 rounded-[2.5rem] shadow-2xl mb-8 relative overflow-hidden transition-all duration-300 ${errors.terms ? 'border-4 border-red-500' : ''}`}>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 pointer-events-none"></div>
                            
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Estimated Project Total</span>
                                <span className="font-black text-lg">CHF {grandTotal.toFixed(2)}</span>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl mb-8 border border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-black uppercase text-blue-100">{t('consultation.booking.dueNow')}</span>
                                    <span className="text-3xl font-black text-emerald-400 drop-shadow-sm">CHF {calculateDeposit().toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center text-[10px]">R</div>
                                    <p className="text-[9px] text-blue-200/80 font-bold leading-tight">Secure Payment Gateway</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className={`flex items-start gap-4 p-5 rounded-[1.5rem] border transition-all duration-300 cursor-pointer ${errors.terms ? 'bg-red-500/20 border-red-500 shake' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} onClick={() => setIsTermsAgreed(!isTermsAgreed)}>
                                    <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex flex-shrink-0 items-center justify-center transition-all ${isTermsAgreed ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-white/20'}`}>
                                        {isTermsAgreed && <CheckIcon className="w-4 h-4 text-white" />}
                                    </div>
                                    <p className="flex-1 text-[11px] text-blue-50 font-medium leading-relaxed">
                                        I, {clientName || '...'}, confirm this request and agree to the <button type="button" onClick={(e) => { e.stopPropagation(); onNavigate('terms'); }} className="text-[#007bff] hover:underline font-black">Terms & Conditions</button>. I understand the deposit/fee will be paid via <b>Secure Payment Gateway</b>.
                                    </p>
                                </div>
                                {errors.terms && <span className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center block">{errors.terms}</span>}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="w-full bg-[#007bff] hover:bg-blue-600 text-white font-black py-7 rounded-[2rem] shadow-[0_20px_50px_rgba(0,122,255,0.4)] transition-all disabled:opacity-50 transform hover:-translate-y-1 active:translate-y-0 text-2xl uppercase tracking-widest flex items-center justify-center gap-4"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Initializing...
                                </>
                            ) : (
                                <>
                                    Confirm & Pay
                                    <BoltIcon className="w-7 h-7" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
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
