// 3-Layer Pricing Engine Architecture
// Layer 1: Zone (PLZ -> Drive time, Travel fee, Zone multiplier)
// Layer 2: Entsorgungsregime (Municipality -> Waste ordinance, Bulky waste rules, RAZ requirements)
// Layer 3: Zugangsregime (Address/District -> Permits, Loading windows, Halteverbot constraints)

export type Zone = 'kern' | 'erweitert' | 'metro' | 'peripherie';

export type ConfidenceLevel = 'VERIFIED' | 'REPORTED' | 'UNKNOWN';

export interface EntsorgungsRegime {
  gemeindeSlug: string;
  gemeindeName: string;
  plz: string[];
  sperrgutModell: 'marke' | 'aufAnfrage' | 'keineAbfuhr' | 'kombisystem' | 'unbekannt';
  sperrgutMarkeChf: number | null;
  sperrgutAufwandBasisChf: number | null;
  sperrgutAufwandProMinuteChf: number | null;
  eigentransportNoetig: boolean | null;
  annahmestelleName: string | null;
  annahmestelleDistanzKm: number | null;
  annahmestelleOeffnungszeiten: string | null;
  bereitstellungUhrzeit: string | null;
  quelle: string;
  stand: string; // ISO date format YYYY-MM-DD
  confidence: ConfidenceLevel;
}

export interface ZugangsRegime {
  key: string; // District, street, address, or municipal default
  gemeindeSlug: string;
  hoechstparkzeitStunden: number | null;
  sonderbewilligungChf: number | null;
  fussgaengerzone: boolean;
  halteverbotVorlaufTage: number | null;
  halteverbotKostenModell: 'variabel' | 'fix' | null;
  gueterumschlagFenster: string | null;
  quelle: string;
  stand: string;
  confidence: ConfidenceLevel;
}

export interface FeasibilityConstraint {
  type: 'halteverbot_lead_time' | 'opening_hours' | 'access_restriction' | 'provisional_pricing';
  severity: 'warning' | 'blocking' | 'info';
  message: string;
  actionRequired?: string;
}

export interface CostCategoryBreakdown {
  durchfuehrung: number; // Labour, materials, travel
  bewilligung: number;   // Permits, pass-through parking
  entsorgung: number;    // Waste/clearing handling (ONLY when clearing is ordered)
  zuschlaege: number;    // Zone multiplier & minimum order top-up
  total: number;
}

export interface QuoteComposition {
  baseZone: Zone;
  zoneMultiplier: number;
  travelFeeChf: number;
  entsorgungRegime: EntsorgungsRegime;
  zugangRegime: ZugangsRegime;
  costs: CostCategoryBreakdown;
  constraints: FeasibilityConstraint[];
  isProvisional: boolean;
  missingFields: string[];
}

// VERIFIED MUNICIPAL DISPOSAL REGIMES DATASET
export const ENTSORGUNGS_REGIMES: Record<string, EntsorgungsRegime> = {
  schaffhausen: {
    gemeindeSlug: 'schaffhausen',
    gemeindeName: 'Schaffhausen',
    plz: ['8200', '8203', '8207', '8208', '8231'],
    sperrgutModell: 'marke',
    sperrgutMarkeChf: 5.00,
    sperrgutAufwandBasisChf: null,
    sperrgutAufwandProMinuteChf: null,
    eigentransportNoetig: false,
    annahmestelleName: 'KBA Hard / Unterflurcontainer Altstadt',
    annahmestelleDistanzKm: 6,
    annahmestelleOeffnungszeiten: 'Mo-Fr 07:00-11:45, 13:00-16:45; Sa 08:00-11:30',
    bereitstellungUhrzeit: '07:00 (06:00 bei Hitze über 30°C)',
    quelle: 'Stadt Schaffhausen Abfallkalender / RSS 740.1',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  'neuhausen-am-rheinfall': {
    gemeindeSlug: 'neuhausen-am-rheinfall',
    gemeindeName: 'Neuhausen am Rheinfall',
    plz: ['8212'],
    sperrgutModell: 'aufAnfrage',
    sperrgutMarkeChf: null,
    sperrgutAufwandBasisChf: 45.00,
    sperrgutAufwandProMinuteChf: 3.00,
    eigentransportNoetig: false,
    annahmestelleName: 'Recyclinghof Chlaffental / Corrà Transporte',
    annahmestelleDistanzKm: 3,
    annahmestelleOeffnungszeiten: 'Mo-Fr 08:00-11:30, 13:45-17:00',
    bereitstellungUhrzeit: '06:30 Uhr (strikter Halbstunden-Unterschied zu SH)',
    quelle: 'Gemeinde Neuhausen Abfallverordnung 814.100',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  'stein-am-rhein': {
    gemeindeSlug: 'stein-am-rhein',
    gemeindeName: 'Stein am Rhein',
    plz: ['8260'],
    sperrgutModell: 'keineAbfuhr',
    sperrgutMarkeChf: null,
    sperrgutAufwandBasisChf: null,
    sperrgutAufwandProMinuteChf: null,
    eigentransportNoetig: true,
    annahmestelleName: 'RAZ Frauenfeld (Regionales Annahmezentrum Kanton TG)',
    annahmestelleDistanzKm: 32,
    annahmestelleOeffnungszeiten: 'Mo-Fr 07:00-11:45, 13:15-17:00, Sa 07:30-11:30',
    bereitstellungUhrzeit: '07:00 Uhr (Keine Sperrgutabfuhr an der Strasse!)',
    quelle: 'Stadt Stein am Rhein Abfallkalender / KVA Thurgau',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  feuerthalen: {
    gemeindeSlug: 'feuerthalen',
    gemeindeName: 'Feuerthalen (ZH)',
    plz: ['8245'],
    sperrgutModell: 'marke',
    sperrgutMarkeChf: 8.00,
    sperrgutAufwandBasisChf: null,
    sperrgutAufwandProMinuteChf: null,
    eigentransportNoetig: false,
    annahmestelleName: 'Werkhof Feldstrasse 132',
    annahmestelleDistanzKm: 2,
    annahmestelleOeffnungszeiten: 'Jeden Montag 10:30–11:30 & 1. Samstag im Monat 10:30–11:30',
    bereitstellungUhrzeit: '07:00 Uhr (Nicht am Vortag! Nur Feuerthaler Marken)',
    quelle: 'Gemeinde Feuerthalen Abfallverordnung Gebührentarif',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  'laufen-uhwiesen': {
    gemeindeSlug: 'laufen-uhwiesen',
    gemeindeName: 'Laufen-Uhwiesen (ZH)',
    plz: ['8248'],
    sperrgutModell: 'kombisystem',
    sperrgutMarkeChf: 7.00,
    sperrgutAufwandBasisChf: null,
    sperrgutAufwandProMinuteChf: null,
    eigentransportNoetig: false,
    annahmestelleName: 'Entsorgungsplatz Uhwiesen (Weiler Nohl entsorgt über Neuhausen!)',
    annahmestelleDistanzKm: 5,
    annahmestelleOeffnungszeiten: 'Samstag 13:30–15:00 Uhr (1.5 Stunden pro Woche!)',
    bereitstellungUhrzeit: '07:00 Uhr (Nohl: Donnerstag 06:30 Uhr Neuhauser Sack)',
    quelle: 'Kehrichtorganisation Wyland / Gemeinde Laufen-Uhwiesen',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  buchberg: {
    gemeindeSlug: 'buchberg',
    gemeindeName: 'Buchberg',
    plz: ['8454'],
    sperrgutModell: 'marke',
    sperrgutMarkeChf: 5.00,
    sperrgutAufwandBasisChf: null,
    sperrgutAufwandProMinuteChf: null,
    eigentransportNoetig: false,
    annahmestelleName: 'Entsorgungsplatz Gemeindezentrum / Hohlegasse 11',
    annahmestelleDistanzKm: 18,
    annahmestelleOeffnungszeiten: 'Sa 09:00-11:00',
    bereitstellungUhrzeit: '07:00 Uhr',
    quelle: 'Gemeindeverwaltung Buchberg SH',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  ruedlingen: {
    gemeindeSlug: 'ruedlingen',
    gemeindeName: 'Rüdlingen',
    plz: ['8455'],
    sperrgutModell: 'marke',
    sperrgutMarkeChf: 5.00,
    sperrgutAufwandBasisChf: null,
    sperrgutAufwandProMinuteChf: null,
    eigentransportNoetig: false,
    annahmestelleName: 'Sammelstelle Rüdlingen-Buchberg',
    annahmestelleDistanzKm: 19,
    annahmestelleOeffnungszeiten: 'Sa 09:00-11:00',
    bereitstellungUhrzeit: '07:00 Uhr',
    quelle: 'Gemeindeverwaltung Rüdlingen SH',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  rafz: {
    gemeindeSlug: 'rafz',
    gemeindeName: 'Rafz (ZH)',
    plz: ['8197'],
    sperrgutModell: 'marke',
    sperrgutMarkeChf: 6.50,
    sperrgutAufwandBasisChf: null,
    sperrgutAufwandProMinuteChf: null,
    eigentransportNoetig: false,
    annahmestelleName: 'Werkgebäude am Tannewäg',
    annahmestelleDistanzKm: 16,
    annahmestelleOeffnungszeiten: 'Ganzjährig zugänglich / Sa 08:00-12:00',
    bereitstellungUhrzeit: '07:00 Uhr',
    quelle: 'Gemeinde Rafz Entsorgungsplan 2023',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  diessenhofen: {
    gemeindeSlug: 'diessenhofen',
    gemeindeName: 'Diessenhofen (TG)',
    plz: ['8253'],
    sperrgutModell: 'kombisystem',
    sperrgutMarkeChf: 6.00,
    sperrgutAufwandBasisChf: null,
    sperrgutAufwandProMinuteChf: null,
    eigentransportNoetig: false,
    annahmestelleName: 'Werkhof Diessenhofen / KUH-BAG Plastik-Container 24/7',
    annahmestelleDistanzKm: 12,
    annahmestelleOeffnungszeiten: 'Mo-Fr 07:00-12:00, 13:00-17:00 / KUH-BAG 24/7',
    bereitstellungUhrzeit: '07:00 Uhr (KVA Thurgau weisser Gebührensack)',
    quelle: 'Verband Kehrichtverwertung Thurgau / Gemeinde Diessenhofen',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  zuerich: {
    gemeindeSlug: 'zuerich',
    gemeindeName: 'Zürich (Stadt)',
    plz: ['8000', '8001', '8002', '8003', '8004', '8005', '8006', '8008', '8032', '8037', '8038', '8041', '8044', '8045', '8046', '8047', '8048', '8049', '8050', '8051', '8052', '8053', '8055', '8057', '8064'],
    sperrgutModell: 'aufAnfrage',
    sperrgutMarkeChf: null,
    sperrgutAufwandBasisChf: 86.50,
    sperrgutAufwandProMinuteChf: 5.77,
    eigentransportNoetig: false,
    annahmestelleName: 'Recyclinghof Hagenholz / Werdhölzli / Looächer (ERZ)',
    annahmestelleDistanzKm: 5,
    annahmestelleOeffnungszeiten: 'Mo-Fr 07:00-17:00 (Kostenpflichtig: ~CHF 20-22.70 / 100 kg)',
    bereitstellungUhrzeit: '07:00 Uhr am Abholtag (frühst. Vorabend)',
    quelle: 'Entsorgung + Recycling Zürich (ERZ) / Service Center 044 417 77 77',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  zurich: {
    gemeindeSlug: 'zurich',
    gemeindeName: 'Zürich (Stadt)',
    plz: ['8000', '8001', '8002', '8003', '8004', '8005', '8006', '8008', '8032', '8037', '8038', '8041', '8044', '8045', '8046', '8047', '8048', '8049', '8050', '8051', '8052', '8053', '8055', '8057', '8064'],
    sperrgutModell: 'aufAnfrage',
    sperrgutMarkeChf: null,
    sperrgutAufwandBasisChf: 86.50,
    sperrgutAufwandProMinuteChf: 5.77,
    eigentransportNoetig: false,
    annahmestelleName: 'Recyclinghof Hagenholz / Werdhölzli / Looächer (ERZ)',
    annahmestelleDistanzKm: 5,
    annahmestelleOeffnungszeiten: 'Mo-Fr 07:00-17:00 (Kostenpflichtig: ~CHF 20-22.70 / 100 kg)',
    bereitstellungUhrzeit: '07:00 Uhr am Abholtag (frühst. Vorabend)',
    quelle: 'Entsorgung + Recycling Zürich (ERZ) / Service Center 044 417 77 77',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  }
};

// DEFAULT UNKNOWN FALLBACK
export const FALLBACK_UNKNOWN_ENTSORGUNG: EntsorgungsRegime = {
  gemeindeSlug: 'unbekannt',
  gemeindeName: 'Unbekannte Gemeinde',
  plz: [],
  sperrgutModell: 'unbekannt',
  sperrgutMarkeChf: null,
  sperrgutAufwandBasisChf: null,
  sperrgutAufwandProMinuteChf: null,
  eigentransportNoetig: null,
  annahmestelleName: 'Gemeindeeigene Sammelstelle / Werkhof',
  annahmestelleDistanzKm: 10,
  annahmestelleOeffnungszeiten: 'Gemeindeabhängig',
  bereitstellungUhrzeit: '07:00 Uhr',
  quelle: 'Regionale Schätzung / Ausstehende Gemeindeanfrage',
  stand: '2026-08-21',
  confidence: 'UNKNOWN'
};

// VERIFIED ACCESS REGIMES DATASET (District/Street level)
export const ZUGANGS_REGIMES: Record<string, ZugangsRegime> = {
  'schaffhausen-altstadt': {
    key: 'schaffhausen-altstadt',
    gemeindeSlug: 'schaffhausen',
    hoechstparkzeitStunden: 0,
    sonderbewilligungChf: 15.00,
    fussgaengerzone: true,
    halteverbotVorlaufTage: 14,
    halteverbotKostenModell: 'variabel',
    gueterumschlagFenster: 'Mo-Fr 19:00-11:00, Sa/So 17:00-09:00 (Nur Güterumschlag!)',
    quelle: 'Auskunft Stadtpolizei Schaffhausen (RSS 200.1 / RSS 400.2)',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  'schaffhausen-quartier': {
    key: 'schaffhausen-quartier',
    gemeindeSlug: 'schaffhausen',
    hoechstparkzeitStunden: 4,
    sonderbewilligungChf: 7.00,
    fussgaengerzone: false,
    halteverbotVorlaufTage: 14,
    halteverbotKostenModell: 'variabel',
    gueterumschlagFenster: 'Jederzeit mit Werkverkehr-Karte 2h/5h/Tag',
    quelle: 'Stadtpolizei Schaffhausen Signalisationen',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  'stein-am-rhein-altstadt': {
    key: 'stein-am-rhein-altstadt',
    gemeindeSlug: 'stein-am-rhein',
    hoechstparkzeitStunden: 1,
    sonderbewilligungChf: 20.00,
    fussgaengerzone: true,
    halteverbotVorlaufTage: 10,
    halteverbotKostenModell: 'fix',
    gueterumschlagFenster: 'Mo-Sa 06:00-11:00',
    quelle: 'Stadtverwaltung Stein am Rhein Polizeiordnung',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  'laufen-uhwiesen-nohl': {
    key: 'laufen-uhwiesen-nohl',
    gemeindeSlug: 'laufen-uhwiesen',
    hoechstparkzeitStunden: null,
    sonderbewilligungChf: 0,
    fussgaengerzone: false,
    halteverbotVorlaufTage: 7,
    halteverbotKostenModell: 'fix',
    gueterumschlagFenster: 'Unbeschränkt — ACHTUNG Nohl entsorgt nach Neuhauser Kalender!',
    quelle: 'Hinweise Abfallentsorgung Nohl 2024',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  'zuerich-kreis-1': {
    key: 'zuerich-kreis-1',
    gemeindeSlug: 'zuerich',
    hoechstparkzeitStunden: 0,
    sonderbewilligungChf: 145.00,
    fussgaengerzone: true,
    halteverbotVorlaufTage: 7,
    halteverbotKostenModell: 'variabel',
    gueterumschlagFenster: 'DAV Bewilligung Mühlegasse 18/22 (4-6 Wochen Vorlauf Niederdorf/Bahnhofstrasse)',
    quelle: 'Stadtpolizei Zürich & Dienstabteilung Verkehr (DAV)',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  },
  'zuerich-quartier': {
    key: 'zuerich-quartier',
    gemeindeSlug: 'zuerich',
    hoechstparkzeitStunden: 1.5,
    sonderbewilligungChf: 145.00,
    fussgaengerzone: false,
    halteverbotVorlaufTage: 7,
    halteverbotKostenModell: 'variabel',
    gueterumschlagFenster: 'Blaue Zone: mind. 7 Arbeitstage / Weisse Zone: mind. 3 Arbeitstage (CHF 120-170/Tag)',
    quelle: 'Stadtpolizei Zürich Parkplatzreservation (stzh.ch)',
    stand: '2026-08-21',
    confidence: 'VERIFIED'
  }
};

export const FALLBACK_DEFAULT_ZUGANG: ZugangsRegime = {
  key: 'standard-quartier',
  gemeindeSlug: 'standard',
  hoechstparkzeitStunden: 4,
  sonderbewilligungChf: 0,
  fussgaengerzone: false,
  halteverbotVorlaufTage: 7,
  halteverbotKostenModell: 'fix',
  gueterumschlagFenster: 'Standard Handwerker-Anfahrt',
  quelle: 'Kraken PFM Standard-Standardwerte',
  stand: '2026-08-21',
  confidence: 'REPORTED'
};

// 3-LAYER LOOKUP RESOLVERS

export function getEntsorgungsRegime(slugOrPlz: string): EntsorgungsRegime {
  const normalized = slugOrPlz.toLowerCase().trim();
  
  // 1. Direct slug match
  if (ENTSORGUNGS_REGIMES[normalized]) {
    return ENTSORGUNGS_REGIMES[normalized];
  }

  // 2. PLZ search
  for (const regime of Object.values(ENTSORGUNGS_REGIMES)) {
    if (regime.plz.includes(normalized)) {
      return regime;
    }
  }

  // 3. Unresearched municipality fallback (NEVER silent 0)
  return {
    ...FALLBACK_UNKNOWN_ENTSORGUNG,
    gemeindeSlug: normalized,
    gemeindeName: `Gemeinde (${normalized.toUpperCase()})`,
    plz: [normalized]
  };
}

export function getZugangsRegime(addressOrDistrict: string, gemeindeSlug: string): ZugangsRegime {
  const addressNorm = addressOrDistrict.toLowerCase().trim();
  const gemeindeNorm = gemeindeSlug.toLowerCase().trim();

  // Address/District specific check
  if (addressNorm.includes('altstadt') || addressNorm.includes('vordergasse') || addressNorm.includes('unterstadt') || addressNorm.includes('niederdorf') || addressNorm.includes('bahnhofstrasse') || addressNorm.includes('kreis 1') || addressNorm.includes('8001')) {
    if (gemeindeNorm.includes('stein')) return ZUGANGS_REGIMES['stein-am-rhein-altstadt'];
    if (gemeindeNorm.includes('zuerich') || gemeindeNorm.includes('zurich') || addressNorm.includes('zuerich') || addressNorm.includes('zurich')) return ZUGANGS_REGIMES['zuerich-kreis-1'];
    return ZUGANGS_REGIMES['schaffhausen-altstadt'];
  }

  if (addressNorm.includes('nohl')) {
    return ZUGANGS_REGIMES['laufen-uhwiesen-nohl'];
  }

  if (gemeindeNorm.includes('schaffhausen')) {
    return ZUGANGS_REGIMES['schaffhausen-quartier'];
  }

  if (gemeindeNorm.includes('zuerich') || gemeindeNorm.includes('zurich')) {
    return ZUGANGS_REGIMES['zuerich-quartier'];
  }

  // Fallback to standard quarter access
  return {
    ...FALLBACK_DEFAULT_ZUGANG,
    gemeindeSlug: gemeindeNorm
  };
}

// COMPOSITION ENGINE
export function computeThreeLayerQuote(params: {
  plz: string;
  addressOrDistrict?: string;
  hasClearingOrWasteService: boolean; // CRITICAL: Disposal charges apply ONLY if clearing is ordered!
  baseLabourMaterialsChf: number;
  noticeDaysAhead: number;
  selectedDate?: Date;
}): QuoteComposition {
  const { plz, addressOrDistrict = '', hasClearingOrWasteService, baseLabourMaterialsChf, noticeDaysAhead } = params;

  // Layer 1: Zone Resolution
  let baseZone: Zone = 'peripherie';
  let zoneMultiplier = 1.08;
  let travelFeeChf = 25;

  const numericPlz = parseInt(plz, 10);
  if (numericPlz >= 8200 && numericPlz <= 8239) {
    baseZone = 'kern';
    zoneMultiplier = 1.0;
    travelFeeChf = 0;
  } else if ((numericPlz >= 8240 && numericPlz <= 8299) || numericPlz === 8212 || numericPlz === 8260) {
    baseZone = 'erweitert';
    zoneMultiplier = 1.05;
    travelFeeChf = 15;
  } else if (numericPlz >= 8400 && numericPlz <= 8499) {
    baseZone = 'metro';
    zoneMultiplier = 1.12;
    travelFeeChf = 35;
  } else if (numericPlz >= 8000 && numericPlz <= 8399) {
    baseZone = 'metro';
    zoneMultiplier = 1.22;
    travelFeeChf = 45;
  }

  // Layer 2: Entsorgungsregime
  const entsorgungRegime = getEntsorgungsRegime(plz);

  // Layer 3: Zugangsregime
  const zugangRegime = getZugangsRegime(addressOrDistrict, entsorgungRegime.gemeindeSlug);

  // COMPUTE COST BREAKDOWN LINES
  const missingFields: string[] = [];
  let isProvisional = false;

  // 1. Durchführungskosten (Labour, materials, travel)
  const durchfuehrung = Math.round(baseLabourMaterialsChf + travelFeeChf);

  // 2. Bewilligungskosten (Permits/Pass-through)
  let bewilligung = 0;
  if (zugangRegime.sonderbewilligungChf !== null) {
    bewilligung += zugangRegime.sonderbewilligungChf;
  } else {
    bewilligung += 15.00; // conservative estimate
    missingFields.push('sonderbewilligungChf');
    isProvisional = true;
  }

  // 3. Entsorgungskosten (ONLY when clearing / waste removal is explicitly requested)
  let entsorgung = 0;
  if (hasClearingOrWasteService) {
    if (entsorgungRegime.confidence === 'UNKNOWN') {
      // Conservative estimated fallback — NEVER default to 0!
      entsorgung = 65.00; // Baseline estimated disposal handling
      missingFields.push('entsorgungsTarif');
      isProvisional = true;
    } else if (entsorgungRegime.sperrgutModell === 'keineAbfuhr') {
      // Stein am Rhein: RAZ Frauenfeld transport required (~30-35km)
      const distanceSurcharge = Math.round((entsorgungRegime.annahmestelleDistanzKm || 30) * 2.8);
      entsorgung = 120.00 + distanceSurcharge; // RAZ fee + transport
    } else if (entsorgungRegime.sperrgutModell === 'aufAnfrage') {
      // Neuhausen: Effort based
      entsorgung = (entsorgungRegime.sperrgutAufwandBasisChf || 45) + 30; // base fee + loading
    } else if (entsorgungRegime.sperrgutMarkeChf) {
      // Sticker system (Schaffhausen, Feuerthalen, etc.)
      entsorgung = Math.round(entsorgungRegime.sperrgutMarkeChf * 4 + 35); // 4 marks + handling
    } else {
      entsorgung = 50.00;
    }
  } else {
    // Standard cleaning job with NO furniture clearing
    entsorgung = 0;
  }

  // 4. Zuschläge (Zone multiplier and top-ups)
  const subtotalBeforeZone = durchfuehrung + bewilligung + entsorgung;
  const zuschlaege = Math.round(subtotalBeforeZone * (zoneMultiplier - 1.0));

  const total = Math.round(subtotalBeforeZone + zuschlaege);

  // FEASIBILITY CONSTRAINTS
  const constraints: FeasibilityConstraint[] = [];

  // Feasibility 1: Halteverbot lead time rule
  if (zugangRegime.halteverbotVorlaufTage && noticeDaysAhead < zugangRegime.halteverbotVorlaufTage) {
    constraints.push({
      type: 'halteverbot_lead_time',
      severity: 'warning',
      message: `Fehlende Vorlaufzeit: Halteverbot in ${entsorgungRegime.gemeindeName} erfordert mind. ${zugangRegime.halteverbotVorlaufTage} Tage Vorlaufzeit (erhalten: ${noticeDaysAhead} Tage).`,
      actionRequired: 'Anfahrt ohne reservierten Parkplatz; Güterumschlag muss direkt vor Ort koordiniert werden.'
    });
  }

  // Feasibility 2: Werkhof / RAZ Opening hours constraint (for clearing)
  if (hasClearingOrWasteService && entsorgungRegime.annahmestelleOeffnungszeiten) {
    constraints.push({
      type: 'opening_hours',
      severity: 'info',
      message: `Entsorgungshinweis (${entsorgungRegime.annahmestelleName}): Öffnungszeiten ${entsorgungRegime.annahmestelleOeffnungszeiten}.`,
      actionRequired: `Bereitstellung gemäss Gemeindeordnung bis ${entsorgungRegime.bereitstellungUhrzeit}.`
    });
  }

  // Feasibility 3: Unresearched regime warning
  if (entsorgungRegime.confidence === 'UNKNOWN' || isProvisional) {
    constraints.push({
      type: 'provisional_pricing',
      severity: 'warning',
      message: `Vorläufige Offerte: Die Gemeindeordnung von ${entsorgungRegime.gemeindeName} beinhaltet unvollständige Angaben.`,
      actionRequired: 'Entsorgungs- und Bewilligungsgebühren werden vor Auftragsbestätigung manuell verifiziert.'
    });
  }

  return {
    baseZone,
    zoneMultiplier,
    travelFeeChf,
    entsorgungRegime,
    zugangRegime,
    costs: {
      durchfuehrung,
      bewilligung,
      entsorgung,
      zuschlaege,
      total
    },
    constraints,
    isProvisional: isProvisional || entsorgungRegime.confidence === 'UNKNOWN',
    missingFields
  };
}
