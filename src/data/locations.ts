export interface ServiceAvailability {
  b2cTransactional: boolean;   // Umzugsreinigung, Endreinigung, Baureinigung
  b2bRecurring: boolean;       // Unterhaltsreinigung, Hauswartung, Büroreinigung
  services: string[];          // explicit list
}

export interface EntsorgungFacts {
  officialSackName: string | null;
  sackSizes: string[] | null;
  recyclingCenter: string | null;
  sperrgutRules: string | null;
}

export interface LocalContentSlots {
  kuendigungstermine: string | null;
  entsorgung: EntsorgungFacts | null;
  quartiere: string[];
  einsatzhinweis: string | null;   // access, parking, travel
}

export interface Municipality {
  slug: string;              // "neuhausen-am-rheinfall"
  name: string;              // "Neuhausen am Rheinfall"
  plz: string[];             // ["8212"]
  canton: "SH" | "ZH" | "TG";
  bezirk?: string;           // "Andelfingen", "Bülach", "Frauenfeld", "Schaffhausen" etc.
  region: "schaffhausen" | "winterthur" | "zuerich" | "thurgau";
  tier: 1 | 2 | 3;
  availability: ServiceAvailability;
  localContent: LocalContentSlots;
  coordinates: { lat: number; lng: number };
  travelFee: number;         // 0 for Schaffhausen city & immediate area
  localContext: {
    buildingTypes: string;   // "Altstadt-Erkerwohnungen, Wohnblöcke Zentralstrasse, EFH am Galgenbuck"
    clientProfile: string;   // "Familien, Pendler nach Singen, Ferienwohnungen"
    cleaningNotes: string;   // implications for cleaning (materials, techniques)
    landmark: string;        // "Rheinfall" — [TODO: verify] if unsure
    uniqueBlurb: string;     // 1-2 sentence card text, UNIQUE per municipality
  };
  nearbySlugs: string[];     // for route-bundling messaging + internal links
  services: string[];        // service slugs offered there
  priceAnchors: { endOfTenancyFrom: number; deepCleaningFrom: number };
  indexable: boolean;        // false until localContext is filled & verified
}

export const KUENDIGUNGSTERMINE = {
  SH: {
    de: "Ortsübliche Kündigungstermine im Kanton Schaffhausen: Ende März, Ende Juni, Ende September sowie Ende jedes Monats ausser 31. Dezember.",
    en: "Customary notice dates in Canton Schaffhausen: end of March, end of June, end of September, and end of any month except December 31st.",
    es: "Fechas habituales de cancelación en el Cantón de Schaffhausen: finales de marzo, finales de junio, finales de septiembre y finales de cualquier mes excepto el 31 de diciembre.",
    fr: "Dates de résiliation usuelles dans le canton de Schaffhouse : fin mars, fin juin, fin septembre et fin de chaque mois sauf le 31 décembre.",
    it: "Scadenze di disdetta consuetudinarie nel Canton Sciaffusa: fine marzo, fine giugno, fine settembre e fine di ogni mese eccetto il 31 dicembre.",
    pt: "Datas habituais de rescisão no Cantão de Schaffhausen: final de março, final de junho, final de setembro e final de qualquer mês exceto 31 de dezembro."
  },
  ZH: {
    de: "Ortsübliche Kündigungstermine im Kanton Zürich: 31. März, 30. Juni, 30. September.",
    en: "Customary notice dates in Canton Zurich: March 31st, June 30th, September 30th.",
    es: "Fechas habituales de cancelación en el Cantón de Zúrich: 31 de marzo, 30 de junio, 30 de septiembre.",
    fr: "Dates de résiliation usuelles dans le canton de Zurich : 31 mars, 30 juin, 30 septembre.",
    it: "Scadenze di disdetta consuetudinarie nel Canton Zurigo: 31 marzo, 30 giugno, 30 settembre.",
    pt: "Datas habituais de rescisão no Cantão de Zurique: 31 de março, 30 de junho, 30 de setembro."
  },
  TG: {
    de: "Ortsübliche Kündigungstermine im Kanton Thurgau: 31. März, 30. Juni, 30. September sowie jeweils auf Ende jedes Monats (ausser 31. Dezember).",
    en: "Customary notice dates in Canton Thurgau: March 31st, June 30th, September 30th, and end of any month except December 31st.",
    es: "Fechas habituales de cancelación en el Cantón de Turgovia: 31 de marzo, 30 de junio, 30 de septiembre y finales de cualquier mes excepto el 31 de diciembre.",
    fr: "Dates de résiliation usuelles dans le canton de Thurgovie : 31 mars, 30 juin, 30 septembre et fin de chaque mois sauf le 31 décembre.",
    it: "Scadenze di disdetta consuetudinarie nel Canton Turgovia: 31 marzo, 30 giugno, 30 settembre e fine di ogni mese eccetto il 31 dicembre.",
    pt: "Datas habituais de rescisão no Cantão de Thurgau: 31 de março, 30 de junho, 30 de setembro e final de qualquer mês exceto 31 de dezembro."
  }
};

export const MUNICIPALITIES: Municipality[] = [
  // --- REGION SCHAFFHAUSEN ---
  // TIER 1
  {
    slug: "schaffhausen",
    name: "Schaffhausen",
    plz: ["8200", "8201", "8203", "8204", "8205", "8207", "8208"],
    canton: "SH",
    region: "schaffhausen",
    tier: 1,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "exterior-cleaning", "pest-control", "waste-management", "car-detailing", "upholstery-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Böcklisack",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "KBA Hard (Beringen)",
        sperrgutRules: "Marke CHF 5.00 pro Einheit aufkleben. Keine Anmeldung erforderlich. Bereitstellung bis 07:00 Uhr am Abfuhrtag (über 30°C ab 06:00 Uhr). In der Altstadt gilt Unterflurcontainer-Pflicht (Tour 6)."
      },
      quartiere: ["Altstadt", "Geissberg", "Breite", "Herblingen", "Hemmental", "Buchthalen"],
      einsatzhinweis: "Zentraler Standort — keine Anfahrtskosten innerhalb des Stadtgebiets."
    },
    coordinates: { lat: 47.6954, lng: 8.6357 },
    travelFee: 0,
    localContext: {
      buildingTypes: "Altstadt-Häuser mit Holz-Riegelwerk, herrschaftliche Stadtvillen am Geissberg, Wohnblöcke im Herblingertal",
      clientProfile: "Vielbeschäftigte Familien, KMUs, Arztpraxen und Mieter vor Wohnungsübergaben",
      cleaningNotes: "Sehr hohe Wasserhärte im Stadtnetz verlangt professionelle Entkalkungsdurchgänge. Schonende Pflege historischer Parkettböden und Stuckdecken.",
      landmark: "Munot",
      uniqueBlurb: "In der Kantonshauptstadt Schaffhausen sorgen wir für makellosen Glanz in historischen Altstadthäusern sowie modernen Bürogebäuden nahe dem Bahnhof."
    },
    nearbySlugs: ["neuhausen-am-rheinfall", "feuerthalen", "stetten", "loehningen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "exterior-cleaning", "pest-control", "waste-management", "car-detailing", "upholstery-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: true
  },
  {
    slug: "neuhausen-am-rheinfall",
    name: "Neuhausen am Rheinfall",
    plz: ["8212"],
    canton: "SH",
    region: "schaffhausen",
    tier: 1,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "exterior-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Gebührensack der Gemeinde Neuhausen am Rheinfall",
        sackSizes: ["17 L", "35 L"],
        recyclingCenter: "Recyclinghof im Chlaffental / Corrà Transporte AG (Victor von Bruns-Str. 12)",
        sperrgutRules: "Nur auf Anfrage (Anmeldung: abfallentsorgung@neuhausen.ch / 052 632 66 13). Abrechnung nach Aufwand (Grundpreis + Pauschale + Zeit). Strikte Bereitstellung erst am Abfuhrtag bis 06:30 Uhr."
      },
      quartiere: ["Zentralstrasse", "Galgenbuck", "Rundbuck", "Langriet", "Rhytech-Areal"],
      einsatzhinweis: "Unmittelbare Nähe zu Hauptstandort — fahrkostenfreie Anfahrt."
    },
    coordinates: { lat: 47.6783, lng: 8.6148 },
    travelFee: 0,
    localContext: {
      buildingTypes: "Rhytech-Areal ('Rhyfall Village' Hochhäuser mit 280 Neubauwohnungen), Wohnblöcke an der Zentralstrasse, EFH am Galgenbuck, Gewerbebauten im Rundbuck",
      clientProfile: "Pendler nach Zürich/Schaffhausen, Mieter in neuen Hochhaus-Überbauungen, Familien, lokale Betriebe",
      cleaningNotes: "Exponierte Fensterflächen nahe des Rheinfalls erfordern spezielle Glasreinigungen zur Entfernung feiner Gischt-Rückstände. Sperrgut zwingend vorab bei der Gemeinde anmelden.",
      landmark: "Rheinfall & Rhytech-Türme",
      uniqueBlurb: "Mit der höchsten Bevölkerungsdichte im Kanton und dem neuen Rhytech-Areal bieten wir in Neuhausen massgeschneiderte Wohnungs- und Fassadenreinigungen mit Abnahmegarantie."
    },
    nearbySlugs: ["schaffhausen", "feuerthalen", "beringen", "laufen-uhwiesen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "exterior-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: true
  },
  {
    slug: "stein-am-rhein",
    name: "Stein am Rhein",
    plz: ["8260"],
    canton: "SH",
    region: "schaffhausen",
    tier: 1,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Weisser Gebührensack KVA Thurgau (Verbandssystem)",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "RAZ Frauenfeld (Regionales Annahmezentrum, 30km Entfernung) / Werkhof Stein am Rhein",
        sperrgutRules: "WICHTIG: Kleinsperrgutsammlung KOMPLETT ABGESCHAFFT! Keine Straßensammlung, keine Sperrgutmarken. Sämtliches brennbares Sperrgut muss kostenpflichtig direkt zum RAZ Frauenfeld (30-35km) transportiert werden."
      },
      quartiere: ["Altstadt", "Rathausplatz", "Burg Hohenklingen Areal", "Chlosterhof"],
      einsatzhinweis: "Anfahrt ab Schaffhausen ca. 25 Min. Mindestauftrag für B2B-Unterhalt."
    },
    coordinates: { lat: 47.6594, lng: 8.8593 },
    travelFee: 25,
    localContext: {
      buildingTypes: "Historische Fachwerkhäuser mit Wandmalereien, verwinkelte Altstadtwohnungen, Alterswohnungen im Chlosterhof, moderne Einfamilienhäuser am Stadtrand",
      clientProfile: "Besitzer historischer Immobilien, Gastronomie- und Pensionsbetreiber, Senioren, Wochenend-Heimkehrer",
      cleaningNotes: "Keine Sperrgutabfuhr an der Strasse — Entsorgungsgut erfordert direkten Sondertransport zum RAZ Frauenfeld (Kanton Thurgau). Denkmalschutz-Vorgaben bei historischen Fassaden.",
      landmark: "Burg Hohenklingen",
      uniqueBlurb: "Im mittelalterlichen Stein am Rhein übernehmen wir den vollständigen Transport zum RAZ sowie die denkmalgerechte Reinigung historischer Riegelhäuser und moderner Wohnungen."
    },
    nearbySlugs: ["ramsen", "diessenhofen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 540, deepCleaningFrom: 340 },
    indexable: true
  },

  // TIER 2 MUNICIPALITIES (Single Location Page with Section Anchors)
  {
    slug: "thayngen",
    name: "Thayngen",
    plz: ["8240"],
    canton: "SH",
    region: "schaffhausen",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "exterior-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Gebührensack Gemeinde Thayngen (Abfallverordnung 2024)",
        sackSizes: ["35 L"],
        recyclingCenter: "Entsorgungsplatz Bauverwaltung Thayngen (Dorfstrasse 30)",
        sperrgutRules: "Grünabfuhr via Markensystem (35L-Marken). Aufwandtarif Fr. 3.00/Min (min. Fr. 15.00). Separater Abfallkalender 'Unterer Reiat' für Altdorf, Bibern, Hofen, Opfertshofen."
      },
      quartiere: ["Thayngen Kern", "Altdorf", "Bibern", "Hofen", "Opfertshofen"],
      einsatzhinweis: "Reiat-Grenzregion — Anfahrt 15 CHF Pauschale."
    },
    coordinates: { lat: 47.7461, lng: 8.7118 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Einfamilienhaus-Siedlungen, weitläufige Gewerbe- und Logistikflächen, traditionelle Häuser im Ortskern sowie Ortsteile im Unteren Reiat",
      clientProfile: "Berufspendler nach Singen und Zürich, Logistik- und KMU-Geschäftsleitungen, Anwohner im Reiat",
      cleaningNotes: "Gewerbliche Hallen erfordern maschinelle Bodenreinigung. Abfuhrtage und Entsorgungsrouten variieren zwischen Hauptort Thayngen und dem Unteren Reiat.",
      landmark: "Kulturzentrum Thayngen",
      uniqueBlurb: "In der Grenzgemeinde Thayngen bieten wir flexible Reinigungsservices für Wohn- und Industrieobjekte im Reiat mit genauer Kenntnis der lokalen Abfallreglements."
    },
    nearbySlugs: ["schaffhausen", "stetten", "doerflingen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "exterior-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: true
  },
  {
    slug: "beringen",
    name: "Beringen",
    plz: ["8222"],
    canton: "SH",
    region: "schaffhausen",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Abfallmarken-System Beringen",
        sackSizes: ["35 L"],
        recyclingCenter: "KBA Hard (auf Gemeindegebiet), Abfallcenter Beringen AG & Arnold Schmid Recycling AG",
        sperrgutRules: "Markensystem für Hausrat. Schwarzabfall mittwochs, Grüngut dienstags (im Winter alle 14 Tage). Beringen bildet das Entsorgungszentrum des Kantons."
      },
      quartiere: ["Beringen Dorf", "Zimmermännlisbuck", "KBA Hard Areal"],
      einsatzhinweis: "Schnelle Anfahrt über Hauptstrasse Klettgau (10 CHF Pauschale)."
    },
    coordinates: { lat: 47.6975, lng: 8.5772 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Moderne Neubau-Siedlungen, geräumige Einfamilienhäuser im Grünen, Industrie- und Gewerbebauten",
      clientProfile: "Junge Familien mit Doppelverdienst, ansässige Technologie- und Recyclingbetriebe",
      cleaningNotes: "Als Entsorgungs-Hub des Kantons (KBA Hard, Abfallcenter Beringen) bietet Beringen extrem kurze Logistikwege bei Räumungen. Empfindliche Neubau-Böden verlangen pH-neutrale Pflege.",
      landmark: "Schloss Beringen & KBA Hard",
      uniqueBlurb: "In der wachsenden Gemeinde Beringen im Klettgau betreuen wir moderne Neubauten und Gewerbeflächen mit schnellen Anfahrtszeiten und direkter Recyclinganbindung."
    },
    nearbySlugs: ["neuhausen-am-rheinfall", "schaffhausen", "loehningen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: true
  },
  {
    slug: "neunkirch",
    name: "Neunkirch",
    plz: ["8213"],
    canton: "SH",
    region: "schaffhausen",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "moving-furniture", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Böcklisack & Markensystem Verband Klettgau",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Regionaler Entsorgungsplatz Klettgau / Werkhof Neunkirch",
        sperrgutRules: "Markensystem gemäss Verband Klettgau. Bereitstellung am Abfuhrtag bis 07:00 Uhr. Wasserhärte 33–34°fH (sehr hart) — kalkkritisch bei Abnahmen."
      },
      quartiere: [],
      einsatzhinweis: "Anfahrt Oberklettgau 15 CHF."
    },
    coordinates: { lat: 47.6908, lng: 8.4984 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Denkmalgeschützte Altbauten im Städtlikern, Einfamilienhäuser, landwirtschaftliche Mischbauten",
      clientProfile: "Traditionsbewusste Hauseigentümer, lokale Gewerbetreibende, Landwirte",
      cleaningNotes: "Sehr hartes Wasser (33–34°fH) erfordert intensivste Entkalkung von Armaturen, Duschwänden & WC vor Abgabe. Erhaltspflege alter Dielenböden & Riegelwerk.",
      landmark: "Städtchen-Tore",
      uniqueBlurb: "Im historischen Städtchen Neunkirch verbinden wir traditionelle Werte mit modernster Reinigungstechnologie für Ihr Zuhause."
    },
    nearbySlugs: ["loehningen", "hallau", "wilchingen"],
    services: ["end-of-tenancy", "deep-cleaning", "moving-furniture", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 530, deepCleaningFrom: 330 },
    indexable: true
  },
  {
    slug: "hallau",
    name: "Hallau",
    plz: ["8215"],
    canton: "SH",
    region: "schaffhausen",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Sack plus Gebührenmarken (Kombisystem Hallau)",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "KBA Hard Beringen / Erbschaftsamt Klettgau (Hauptstrasse 44)",
        sperrgutRules: "Grobgut/Altholz max. 2m / 25kg mit Gebührenmarken gut sichtbar aufkleben. Deponie vor Freitag 07:00 Uhr strikt verboten! Altpapier gebündelt bis 08:00 Uhr."
      },
      quartiere: [],
      einsatzhinweis: "Weinbauregion Klettgau — 20 CHF Anfahrtsspesen."
    },
    coordinates: { lat: 47.6972, lng: 8.4594 },
    travelFee: 20,
    localContext: {
      buildingTypes: "Traditionelle Weingüter, ländliche Wohnhäuser, gastronomische Betriebe im Dorfzentrum, Neubauten",
      clientProfile: "Winzerfamilien, Gastronomen, Zuzüger in stark wachsenden Wohnquartieren",
      cleaningNotes: "Hybrid-Entsorgungssystem (Sack + Marken). Deponie vor Freitag 07:00 Uhr strikt verboten. Gastronomieflächen erfordern HACCP-Hygienestandards.",
      landmark: "Bergkirche St. Moritz",
      uniqueBlurb: "Inmitten der idyllischen Weinberge des stark wachsenden Hallau pflegen wir Weinkeller, Gastronomieflächen und Wohnungen mit grösster Sorgfalt."
    },
    nearbySlugs: ["neunkirch", "wilchingen", "schleitheim"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 540, deepCleaningFrom: 340 },
    indexable: true
  },
  {
    slug: "feuerthalen",
    name: "Feuerthalen",
    plz: ["8245"],
    canton: "ZH",
    region: "zuerich",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: {
        officialSackName: "Gemeindeeigene Abfallmarken Feuerthalen (Schaffhauser Böcklisack ungültig)",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Werkhof Feldstrasse 132 (Mo 10:30–11:30 & 1. Sa/Monat 10:30–11:30)",
        sperrgutRules: "Nur gemeindeeigene Abfall- & Sperrgutmarken. Gebündelt/gepresst am Abfuhrtag bis 07:00 Uhr (nicht am Vortag!). Grundgebühr: CHF 140 EFH / 70 MFH / 210 Betrieb (exkl. MwSt). Abfuhr durch REMONDIS Schweiz AG (052 643 11 88)."
      },
      quartiere: ["Feuerthalen Dorf", "Langwiesen"],
      einsatzhinweis: "Direkt an Rheinbrücke — fahrkostenfreie Anfahrt ab Schaffhausen."
    },
    coordinates: { lat: 47.6931, lng: 8.6472 },
    travelFee: 0,
    localContext: {
      buildingTypes: "Mehrfamilienhäuser in Rheinnähe, gewerbliche Ateliers, klassische Wohnungen in Langwiesen",
      clientProfile: "Junge Paare, Familien und Handwerksbetriebe an bester Lage ennet dem Rhein",
      cleaningNotes: "Schaffhauser Böcklisack ist in Feuerthalen ungültig — nur Zürcher/Feuerthaler Marken! Werkhof öffnet nur 1h/Woche. Beseitigung von Schimmelansätzen durch feuchte Rheinnähe.",
      landmark: "Rheinbrücke",
      uniqueBlurb: "Direkt ennet der Rheinbrücke in Feuerthalen (Kanton Zürich) reinigen wir Wohnungen und Büros speditiv und zu fairen Fixpreisen."
    },
    nearbySlugs: ["schaffhausen", "neuhausen-am-rheinfall", "laufen-uhwiesen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: true
  },
  {
    slug: "diessenhofen",
    name: "Diessenhofen",
    plz: ["8253"],
    canton: "TG",
    region: "thurgau",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.TG.de,
      entsorgung: {
        officialSackName: "Weisser Gebührensack KVA Thurgau",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Werkhof Diessenhofen / RAZ Frauenfeld (Gewerbeabfall)",
        sperrgutRules: "Verband KVA Thurgau (Weinfelden). BESONDERHEIT: KUH-BAG Container für Plastikabfall ist jederzeit zugänglich! Bereitstellung am Sammelplatz bis 07:00 Uhr."
      },
      quartiere: ["Altstadt", "Rheinpark", "Willisdorf"],
      einsatzhinweis: "Anfahrt 15 CHF Pauschale."
    },
    coordinates: { lat: 47.6908, lng: 8.7514 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Uralte Altstadthäuser im geschützten Ortskern, moderne Einfamilienhäuser im Thurgauer Hinterland, Ortsteil Willisdorf",
      clientProfile: "Pendler nach Schaffhausen/Frauenfeld, Besitzer historischer Rheinufer-Immobilien, Familien",
      cleaningNotes: "KVA Thurgau System. KUH-BAG Container für Plastikabfälle jederzeit nutzbar (großer Vorteil bei Räumungen mit viel Verpackung). Schonende Pflege von Riegel- & Gewölbebauten.",
      landmark: "Holzbrücke Diessenhofen",
      uniqueBlurb: "Im historischen Diessenhofen am Rhein nutzen wir das KVA-Thurgau Entsorgungssystem mit jederzeit zugänglichem KUH-BAG Kunststoff-Recycling für speditive Räumungen."
    },
    nearbySlugs: ["stein-am-rhein", "feuerthalen"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 530, deepCleaningFrom: 330 },
    indexable: true
  },

  // TIER 3 MUNICIPALITIES (No Standalone Route, Mentions Only)
  {
    slug: "wilchingen",
    name: "Wilchingen",
    plz: ["8217"],
    canton: "SH",
    region: "schaffhausen",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "gardening", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Böcklisack",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Sammelstelle Klettgau / Wilchingen",
        sperrgutRules: "Sperrgutmarken Verband Klettgau. Bereitstellung bis 07:00 Uhr am Abfuhrtag."
      },
      quartiere: [],
      einsatzhinweis: "Bedienung im Routenverbund Klettgau."
    },
    coordinates: { lat: 47.6631, lng: 8.4739 },
    travelFee: 20,
    localContext: {
      buildingTypes: "Ländliche Riegelhäuser, moderne Einfamilienhäuser, landwirtschaftliche Bauten",
      clientProfile: "Winzer, lokale Handwerker und im Klettgau verwurzelte Familien",
      cleaningNotes: "Abbau von hartnäckigem Staub an exponierten Aussenfenstern durch landwirtschaftlichen Betrieb in der Nachbarschaft.",
      landmark: "Weinbaudörfer",
      uniqueBlurb: "In Wilchingen im Klettgau übernehmen wir die gründliche Pflege von Wohnungen und gewerblichen Weinbaubetrieben."
    },
    nearbySlugs: ["hallau", "neunkirch"],
    services: ["end-of-tenancy", "deep-cleaning", "gardening", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 540, deepCleaningFrom: 340 },
    indexable: false
  },
  {
    slug: "schleitheim",
    name: "Schleitheim",
    plz: ["8226"],
    canton: "SH",
    region: "schaffhausen",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "moving-furniture"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Böcklisack",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Entsorgungsstelle Schleitheim",
        sperrgutRules: "Sperrgutmarken Verband Schleitheim/Klettgau."
      },
      quartiere: [],
      einsatzhinweis: "Bedienung im Routenverbund Schleitheim/Klettgau."
    },
    coordinates: { lat: 47.7492, lng: 8.4844 },
    travelFee: 25,
    localContext: {
      buildingTypes: "Klassische Bauernhäuser, ältere Wohnbauten, freistehende Einfamilienhäuser",
      clientProfile: "Mehrgenerationen-Haushalte, Senioren, Handwerker",
      cleaningNotes: "Instandhaltungspflege von älteren Doppelglasfenstern. Gründliche und langlebige Pflege von Massivholzböden.",
      landmark: "Gipsmuseum",
      uniqueBlurb: "In Schleitheim sichern wir den Werterhalt Ihrer ländlichen Immobilien durch gründliche Reinigung und verlässliche Wartung."
    },
    nearbySlugs: ["hallau", "neunkirch"],
    services: ["end-of-tenancy", "deep-cleaning", "moving-furniture"],
    priceAnchors: { endOfTenancyFrom: 550, deepCleaningFrom: 350 },
    indexable: false
  },
  {
    slug: "loehningen",
    name: "Löhningen",
    plz: ["8224"],
    canton: "SH",
    region: "schaffhausen",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Abfallmarken / Böcklisack",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "KBA Hard (Beringen)",
        sperrgutRules: "Entsorgung bevorzugt über die nahegelegene KBA Hard Beringen."
      },
      quartiere: [],
      einsatzhinweis: "Bedienung über Beringen/Schaffhausen."
    },
    coordinates: { lat: 47.6971, lng: 8.5447 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Mehrfamilienhaus-Siedlungen, moderne Einfamilienhäuser am Südhang",
      clientProfile: "Familien, Angestellte in Schaffhausen und bürgernahe Dienstleister",
      cleaningNotes: "Durch die Hanglage sind viele Fenster stark der Witterung ausgesetzt. Spezielle Imprägnierung für langanhaltend saubere Scheiben.",
      landmark: "Dorfbrunnen Löhningen",
      uniqueBlurb: "In Löhningen pflegen wir Ihre Liegenschaften mit umweltfreundlichen Methoden im Herzen des Schaffhauser Klettgaus."
    },
    nearbySlugs: ["beringen", "neunkirch", "schaffhausen"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: false
  },
  {
    slug: "stetten",
    name: "Stetten",
    plz: ["8234"],
    canton: "SH",
    region: "schaffhausen",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Böcklisack",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Sammelstelle Stetten / KBA Hard",
        sperrgutRules: "Verband Reiat / Stetten. Tiefster Steuerfuss im Kanton (61/49)."
      },
      quartiere: [],
      einsatzhinweis: "Bedienung über Schaffhausen/Herblingen."
    },
    coordinates: { lat: 47.7347, lng: 8.6586 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Gehobene Einfamilienhäuser, Villen und neuzeitliche Eigentumswohnungen im Sonnendorf",
      clientProfile: "Privatkunden mit überdurchschnittlichen Qualitätsansprüchen, vielbeschäftigte Kaderleute (Steuerfuss 61/49)",
      cleaningNotes: "Professionelle Versiegelung von Natursteinplatten und materialgerechte Pflege von exklusivem Echtholzparkett.",
      landmark: "Schloss Herblingen Areal",
      uniqueBlurb: "In der Steuerspargemeinde Stetten reinigen wir Einfamilienhäuser und Villen mit einem Höchstmass an Diskretion und Präzision."
    },
    nearbySlugs: ["schaffhausen", "thayngen", "doerflingen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: false
  },
  {
    slug: "doerflingen",
    name: "Dörflingen",
    plz: ["8239"],
    canton: "SH",
    region: "schaffhausen",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Böcklisack",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Sammelstelle Dörflingen / Reiat",
        sperrgutRules: "Sperrgutmarken Verband Reiat."
      },
      quartiere: [],
      einsatzhinweis: "Bedienung im Reiat-Verbund."
    },
    coordinates: { lat: 47.7024, lng: 8.7239 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Gemütliche Wohnhäuser, ehemalige Bauernhöfe, ländliche Einfamilienhäuser",
      clientProfile: "Pendler nach Schaffhausen und Deutschland, naturverbundene Familien",
      cleaningNotes: "Entfernung von hartnäckigem Blütenstaub im Frühjahr an Fassaden und grossen Terrassenfenstern.",
      landmark: "Reiat-Hügelland",
      uniqueBlurb: "In Dörflingen im Reiat übernehmen wir die schnelle und gründliche Reinigung von Ein- und Mehrfamilienhäusern."
    },
    nearbySlugs: ["thayngen", "stetten", "schaffhausen"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: false
  },
  {
    slug: "ramsen",
    name: "Ramsen",
    plz: ["8262"],
    canton: "SH",
    region: "schaffhausen",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "moving-furniture"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Böcklisack",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Sammelstelle Ramsen",
        sperrgutRules: "Sperrgutmarken Verband Stein/Ramsen."
      },
      quartiere: [],
      einsatzhinweis: "Bedienung über Stein am Rhein."
    },
    coordinates: { lat: 47.7033, lng: 8.8105 },
    travelFee: 25,
    localContext: {
      buildingTypes: "Ländliche Einfamilienhäuser, Einfamilienhaus-Siedlungen, Grenzanlagen-Bauten",
      clientProfile: "Grenzgänger nach Süddeutschland, aktive Familien, Landwirtschaft-Zulieferer",
      cleaningNotes: "Reinigung von Rollläden und Storen, die an den vielbefahrenen Hauptverbindungsachsen Feinstaub ausgesetzt sind.",
      landmark: "Rheinburg",
      uniqueBlurb: "In Ramsen an der Grenze pflegen wir Ihre Liegenschaften fachgerecht und sichern eine reibungslose Wohnungsübergabe mit Garantie."
    },
    nearbySlugs: ["stein-am-rhein", "thayngen"],
    services: ["end-of-tenancy", "deep-cleaning", "moving-furniture"],
    priceAnchors: { endOfTenancyFrom: 540, deepCleaningFrom: 340 },
    indexable: false
  },
  {
    slug: "buchberg",
    name: "Buchberg",
    plz: ["8454"],
    canton: "SH",
    region: "schaffhausen",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Böcklisack (Kanton Schaffhausen Exklave)",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Entsorgungsplatz beim Gemeindezentrum / Werkgebäude Hohlegasse 11",
        sperrgutRules: "Schaffhauser Exklave mit Zürcher Telefonvorwahl 044. Kündigungstermine nach Schaffhauser Mietrecht (Monatsende ausser 31.12. — anders als im Zürcher Nachbardorf Rafz!)."
      },
      quartiere: ["Buchberg Dorf", "Hohlegasse"],
      einsatzhinweis: "Schaffhauser Exklave am Rhein (Telefonvorwahl 044)."
    },
    coordinates: { lat: 47.5708, lng: 8.5639 },
    travelFee: 20,
    localContext: {
      buildingTypes: "Exklusive Wohnhäuser in Hanglage, moderne Terrassenhäuser, traditionelle Winzerhäuser",
      clientProfile: "Eigentümer mit anspruchsvollen Immobilien, Weinfachleute, Pendler nach Zürich",
      cleaningNotes: "Achtung Exklaven-Status: Trotz Vorwahl 044 gilt Schaffhauser Mietrecht (Kündigung jedes Monatsende ausser 31.12. — anders als im benachbarten Rafz ZH!). Pflege grossflächiger Panoramafenster.",
      landmark: "Rebberge Buchberg & Gemeindezentrum",
      uniqueBlurb: "In Buchberg, der Schaffhauser Exklave am Rhein mit Zürcher Vorwahl 044, reinigen wir gehobene Wohn- und Terrassenimmobilien nach exakten Schaffhauser Vorgaben."
    },
    nearbySlugs: ["ruedlingen", "rafz"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 540, deepCleaningFrom: 340 },
    indexable: true
  },
  {
    slug: "ruedlingen",
    name: "Rüdlingen",
    plz: ["8455"],
    canton: "SH",
    region: "schaffhausen",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.SH.de,
      entsorgung: {
        officialSackName: "Böcklisack (Kanton Schaffhausen Exklave)",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Sammelstelle Rüdlingen-Buchberg",
        sperrgutRules: "Exklave Kanton SH (grenzt an 6 Zürcher Gemeinden, 1 deutsche Gemeinde und nur Buchberg). Kündigungstermine nach Schaffhauser Recht."
      },
      quartiere: ["Rüdlingen Dorf", "Rheinufer"],
      einsatzhinweis: "Schaffhauser Exklave am Rheinknie."
    },
    coordinates: { lat: 47.5786, lng: 8.5772 },
    travelFee: 20,
    localContext: {
      buildingTypes: "Einfamilienhäuser am Flussufer, ländliche Riegelhäuser, Ferienwohnungen",
      clientProfile: "Zweitwohnsitz-Besitzer, aktive Familien, Wassersportler am Rheinknie",
      cleaningNotes: "Obwohl Rüdlingen an 6 Zürcher Gemeinden grenzt, gilt Schaffhauser Mietrecht (Kündigung jedes Monatsende ausser 31.12.). Beseitigung von Spinnweben & Fluginsekten an Rheinufer-Fassaden.",
      landmark: "Rheinknie Rüdlingen",
      uniqueBlurb: "Am malerischen Rheinknie in Rüdlingen betreuen wir ländliche Riegelhäuser und Wohnungen der Schaffhauser Exklave mit Präzisionsreinigung."
    },
    nearbySlugs: ["buchberg", "rafz"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 540, deepCleaningFrom: 340 },
    indexable: true
  },
  {
    slug: "laufen-uhwiesen",
    name: "Laufen-Uhwiesen",
    plz: ["8248"],
    canton: "ZH",
    bezirk: "Andelfingen",
    region: "zuerich",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: {
        officialSackName: "Kehrichtorganisation Wyland (Weiler Nohl: Neuhauser Gebührensack!)",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Entsorgungsplatz Uhwiesen (Sa 13:30–15:00 Uhr)",
        sperrgutRules: "Zweckverband Wyland. ACHTUNG Nohl: Weiler Nohl entsorgt über Neuhausen am Rheinfall (SH) jeden Donnerstag bis 06:30 Uhr nur mit Neuhauser Säcken!"
      },
      quartiere: ["Uhwiesen", "Laufen", "Nohl"],
      einsatzhinweis: "Anfahrt Uhwiesen/Nohl 10 CHF Pauschale."
    },
    coordinates: { lat: 47.6711, lng: 8.6283 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Landwirtschaftliche Riegelbauten, freistehende EFH am Südhang des Kohlfirsts, Häuser im Weiler Nohl",
      clientProfile: "Pendler nach Winterthur und Schaffhausen, Familien, Schloss Laufen Besucher",
      cleaningNotes: "Achtung Zonen-Spaltung: Im Weiler Nohl gelten Neuhauser Abfallregeln (Do bis 06:30 Uhr), im Hauptort Wyland-Regeln. Entsorgungsplatz Uhwiesen öffnet nur Sa 1.5h.",
      landmark: "Schloss Laufen",
      uniqueBlurb: "In Laufen-Uhwiesen (Kanton Zürich) am Kohlfirst und im Weiler Nohl reinigen wir ländliche Wohnobjekte und Einfamilienhäuser mit Schweizer Gründlichkeit."
    },
    nearbySlugs: ["neuhausen-am-rheinfall", "feuerthalen", "schaffhausen"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: true
  },
  {
    slug: "rafz",
    name: "Rafz",
    plz: ["8197"],
    canton: "ZH",
    bezirk: "Bülach",
    region: "zuerich",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: {
        officialSackName: "Zürcher Gebührensack (KEZO / ZAV)",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Werkgebäude am Tannewäg / Wertstoffsammelstelle Rafz",
        sperrgutRules: "Ganzjährige Wertstoffsammelstelle. Altpapier 3x jährlich ab 08:00 Uhr oder am Sammeltag direkt in die Mulde Werkgebäude Tannewäg. Zürcher Kündigungstermine (31.03. / 30.06. / 30.09.)."
      },
      quartiere: ["Rafz Dorf", "Tannewäg", "Bahnhofareal"],
      einsatzhinweis: "Rafzerfeld-Verbund — Anfahrt 15 CHF."
    },
    coordinates: { lat: 47.6094, lng: 8.5392 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Traditionelle Bauernhäuser im Zürcher Unterland, moderne Neubausiedlungen am Hang, Gewerbebauten",
      clientProfile: "Familien mit hoher beruflicher Mobilität Richtung Zürich, ansässige Obstproduzenten, Gewerbe",
      cleaningNotes: "Altpapier kann am Sammeltag von 08:00–12:00 Uhr direkt im Werkgebäude Tannewäg entsorgt werden. Neubaureinigungen inklusive Beseitigung von Baustaub in Lüftungskanälen.",
      landmark: "Rafzer Dorfkirche & Werkgebäude Tannewäg",
      uniqueBlurb: "Im Zürcher Rafzerfeld übernehmen wir speditiv die Endreinigung von Wohnungen und Häusern mit 100% Abnahmegarantie und exakter Abfallverwertung."
    },
    nearbySlugs: ["buchberg", "ruedlingen"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: true
  },

  // --- TIER 1 & TIER 2 & TIER 3 (WINTERTHUR / ZÜRICH) ---
  {
    slug: "winterthur",
    name: "Winterthur",
    plz: ["8400", "8401", "8403", "8404", "8405", "8406", "8408", "8409", "8410", "8411"],
    canton: "ZH",
    region: "winterthur",
    tier: 1,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "exterior-cleaning", "pest-control", "waste-management", "upholstery-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null, // TODO: Research Winterthur waste regulations
      quartiere: ["Stadt", "Mattenbach", "Oberwinterthur", "Seen", "Töss", "Wülflingen"],
      einsatzhinweis: "Regionales Service-Zentrum Winterthur."
    },
    coordinates: { lat: 47.5022, lng: 8.7294 },
    travelFee: 0,
    localContext: {
      buildingTypes: "Ehemalige Sulzer-Industriehallen (modernisierte Lofts), genossenschaftliche Wohnbauten, grossflächige Büroetagen im Stadtzentrum",
      clientProfile: "Kulturschaffende, akademische WGs, Genossenschafter, lokale Industrie-KMUs",
      cleaningNotes: "Industrielle Loft-Fenster verlangen stabile Hochstativ-Systeme. Pflege von empfindlichen Gussasphalt- und rohen Betonböden.",
      landmark: "Sulzer-Areal",
      uniqueBlurb: "In der Kultur- und Velostadt Winterthur bieten wir erstklassige Wohnungs- und Büroreinigungen mit garantiertem Abnahmeerfolg."
    },
    nearbySlugs: ["seuzach", "neftenbach", "wiesendangen", "pfungen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "exterior-cleaning", "pest-control", "waste-management", "upholstery-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 580, deepCleaningFrom: 360 },
    indexable: true
  },
  {
    slug: "elgg",
    name: "Elgg",
    plz: ["8353"],
    canton: "ZH",
    region: "winterthur",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Bedienung über Winterthur."
    },
    coordinates: { lat: 47.4894, lng: 8.8661 },
    travelFee: 20,
    localContext: {
      buildingTypes: "Historische Bauten im Ortskern, Einfamilienhäuser am Dorfrand, Gewerberäume",
      clientProfile: "Traditionsbewusste Eigentümer, Familien im Speckgürtel von Winterthur",
      cleaningNotes: "Sorgfältiges Abstauben von alten Holzbalkenstrukturen und feuchtigkeitsregulierte Reinigung von Tonziegelböden.",
      landmark: "Schloss Elgg",
      uniqueBlurb: "In Elgg sichern wir den Werterhalt Ihrer Liegenschaften im östlichen Winterthurer Umland durch massgeschneiderte Reinigungskonzepte."
    },
    nearbySlugs: ["winterthur", "wiesendangen"],
    services: ["end-of-tenancy", "deep-cleaning"],
    priceAnchors: { endOfTenancyFrom: 580, deepCleaningFrom: 360 },
    indexable: false
  },
  {
    slug: "pfungen",
    name: "Pfungen",
    plz: ["8422"],
    canton: "ZH",
    region: "winterthur",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Bedienung über Winterthur."
    },
    coordinates: { lat: 47.5147, lng: 8.6433 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Wohnblöcke, Mehrfamilienhäuser im Tösstal, Industrieanlagen",
      clientProfile: "Pendler nach Winterthur/Zürich, gewerbliche Kleinbetriebe",
      cleaningNotes: "Gründliche Reinigung von älteren Verbundfenstern. Maschinelle Hallenreinigung für lokale Produktionsbetriebe.",
      landmark: "Tösstal-Landschaft",
      uniqueBlurb: "In Pfungen im Tösstal pflegen wir Industrie- und Wohnflächen mit hoher Effizienz und Schweizer Gewissenhaftigkeit."
    },
    nearbySlugs: ["winterthur", "neftenbach"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 580, deepCleaningFrom: 360 },
    indexable: false
  },
  {
    slug: "seuzach",
    name: "Seuzach",
    plz: ["8472"],
    canton: "ZH",
    region: "winterthur",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Bedienung über Winterthur."
    },
    coordinates: { lat: 47.5358, lng: 8.7325 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Gehobene Einfamilienhäuser, moderne Eigentumswohnungen, Arztpraxen",
      clientProfile: "Privatpersonen mit gehobenen Ansprüchen, Ärzte und Therapeuten",
      cleaningNotes: "Spezielle Desinfektionsreinigungen für medizinische Praxisräume. Hochglanzpflege für hochwertige Parkettflächen.",
      landmark: "Seuzach-Zentrum",
      uniqueBlurb: "In der beliebten Wohngemeinde Seuzach bieten wir diskrete und hocheffiziente Unterhalts- und Umzugsreinigungen an."
    },
    nearbySlugs: ["winterthur", "neftenbach", "wiesendangen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 580, deepCleaningFrom: 360 },
    indexable: false
  },
  {
    slug: "neftenbach",
    name: "Neftenbach",
    plz: ["8413"],
    canton: "ZH",
    region: "winterthur",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Bedienung über Winterthur."
    },
    coordinates: { lat: 47.5286, lng: 8.6722 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Einfamilienhäuser am Weinberg, sanierte Altbauten, Gewerbebetriebe im Tal",
      clientProfile: "Familien, Weinproduzenten, Angestellte im Dienstleistungssektor",
      cleaningNotes: "Intensive Terrassen- und Wintergartenreinigungen mit speziellem Augenmerk auf Moos- und Algenbeseitigung.",
      landmark: "Weinberge Neftenbach",
      uniqueBlurb: "In Neftenbach sorgen wir für glasklare Sicht durch professionelle Fensterreinigungen und verlässliche Umzugsreinigungen."
    },
    nearbySlugs: ["winterthur", "seuzach", "pfungen"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 580, deepCleaningFrom: 360 },
    indexable: false
  },
  {
    slug: "wiesendangen",
    name: "Wiesendangen",
    plz: ["8542"],
    canton: "ZH",
    region: "winterthur",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Bedienung über Winterthur."
    },
    coordinates: { lat: 47.5217, lng: 8.7892 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Familienfreundliche Einfamilienhäuser, ländliche Riegelhäuser, Dienstleistungsbüros",
      clientProfile: "Doppelverdiener-Familien, lokale Architekten und Planer",
      cleaningNotes: "Sorgfältige Teppich- und Polstertiefenreinigung zur Beseitigung von Tierhaaren und Allergenen in Familienhaushalten.",
      landmark: "Wiesendanger Dorfbach",
      uniqueBlurb: "In Wiesendangen entlasten wir Familien mit erstklassigen Haus- und Wohnungsreinigungen zu fairen Pauschalpreisen."
    },
    nearbySlugs: ["winterthur", "seuzach", "elgg"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning"],
    priceAnchors: { endOfTenancyFrom: 580, deepCleaningFrom: 360 },
    indexable: false
  },

  // ZÜRICH REGION
  {
    slug: "zurich",
    name: "Zürich",
    plz: ["8000", "8001", "8002", "8003", "8004", "8005", "8006", "8008", "8032", "8044", "8045", "8047", "8048", "8049", "8050", "8051", "8052", "8053", "8055", "8057"],
    canton: "ZH",
    region: "zuerich",
    tier: 1,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "exterior-cleaning", "pest-control", "waste-management", "car-detailing", "upholstery-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: {
        officialSackName: "Züri-Sack",
        sackSizes: ["17 L", "35 L", "60 L", "110 L"],
        recyclingCenter: "Recyclinghöfe Hagenholz, Werdhölzli & Looächer",
        sperrgutRules: "ERZ Service Center 044 417 77 77. WICHTIG: Gratis-Coupons (400 kg) seit Mai 2025 ersatzlos abgeschafft. Entsorgung ~CHF 20-22.70/100 kg. ERZ-Abholservice nur telefonisch (Mo-Fr), Vorlaufzeit mind. 3 Arbeitstage, Pauschale CHF 86.50 (Anfahrt + 15 Min). Parkplatz-Vorlauf Stadtpolizei: 7 Arbeitstage Blaue Zone, 3 Tage Weisse Zone."
      },
      quartiere: ["Seefeld", "Enge", "Aussersihl", "Wipkingen", "Oerlikon", "Altstetten", "Wiedikon"],
      einsatzhinweis: "Kantonshauptstadt — Stützpunkt Zürcher Unterland/Agglomeration."
    },
    coordinates: { lat: 47.3769, lng: 8.5417 },
    travelFee: 0,
    localContext: {
      buildingTypes: "Prachtvolle Gründerzeit-Häuser im Seefeld, modernste Kanzleien an der Bahnhofstrasse, stark beanspruchte Gewerberäume im Kreis 4",
      clientProfile: "Internationale Finanzfachleute, Expats mit hohem Serviceanspruch, renommierte Anwaltskanzleien",
      cleaningNotes: "Materialgerechte Hochglanzpolitur exklusiver Marmorflächen und anspruchsvoller Tafelparkette. Äusserste Diskretion.",
      landmark: "Bahnhofstrasse Zürich",
      uniqueBlurb: "In der Weltstadt Zürich pflegen wir exklusive Apartments, stark frequentierte Büros und Gewerbeliegenschaften mit Schweizer Präzision."
    },
    nearbySlugs: ["kloten", "wallisellen", "opfikon", "dietikon"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "exterior-cleaning", "pest-control", "waste-management", "car-detailing", "upholstery-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 630, deepCleaningFrom: 390 },
    indexable: true
  },
  {
    slug: "kloten",
    name: "Kloten",
    plz: ["8302"],
    canton: "ZH",
    region: "zuerich",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Flughafenzone — Express-Termine auf Anfrage."
    },
    coordinates: { lat: 47.4478, lng: 8.5836 },
    travelFee: 0,
    localContext: {
      buildingTypes: "Moderne Business-Apartments, grosse Konferenzzentren, stark frequentierte Büros im Flughafenumfeld",
      clientProfile: "Piloten, Airline-Mitarbeitende, internationale Expats, Logistikunternehmen",
      cleaningNotes: "Effiziente, zeitlich hochflexible Express-Reinigungen für schnelle Mieterwechsel in Business-Apartments.",
      landmark: "Flughafen Zürich-Kloten",
      uniqueBlurb: "In der Flughafenstadt Kloten bieten wir hocheffiziente Facility Services und Umzugsreinigungen für vielbeschäftigte Kosmopoliten."
    },
    nearbySlugs: ["zurich", "buelach", "wallisellen", "opfikon"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 630, deepCleaningFrom: 390 },
    indexable: true
  },
  {
    slug: "buelach",
    name: "Bülach",
    plz: ["8180"],
    canton: "ZH",
    region: "zuerich",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Zürcher Unterland — 10 CHF Anfahrtspauschale."
    },
    coordinates: { lat: 47.5203, lng: 8.5411 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Denkmalgeschützte Bauten im Ortskern, Einfamilienhaus-Siedlungen, neuzeitliche Gewerbehallen im Unterland",
      clientProfile: "Ansässiges Kleingewerbe, Detaillisten, Familien im Zürcher Unterland",
      cleaningNotes: "Spezielle Reinigung von Fliesenböden und Fensterrahmen im historischen Kern mit materialschonenden Reinigungskits.",
      landmark: "Rathaus Bülach",
      uniqueBlurb: "In Bülach und dem gesamten Zürcher Unterland sichern wir die professionelle Pflege Ihrer Liegenschaften mit modernsten Methoden."
    },
    nearbySlugs: ["kloten", "zurich"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 630, deepCleaningFrom: 390 },
    indexable: true
  },
  {
    slug: "dietikon",
    name: "Dietikon",
    plz: ["8953"],
    canton: "ZH",
    region: "zuerich",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Limmattal-Zone — 15 CHF Anfahrtspauschale."
    },
    coordinates: { lat: 47.4044, lng: 8.4039 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Gewerbehallen und Verteilzentren, moderne Wohnlofts im Limmattal, klassische Mehrfamilienhäuser",
      clientProfile: "Logistik- und Produktionsbetriebe, vielbeschäftigte Arbeiterfamilien",
      cleaningNotes: "Spezielle Entfettungsmethoden für stark beanspruchte Werkstattböden und Grossküchen. Gründliche Endreinigungen.",
      landmark: "Dietiker Marktplatz",
      uniqueBlurb: "Im dynamischen Limmattal-Zentrum Dietikon reinigen wir Industrie- und Wohnflächen mit grösster Effizienz und Professionalität."
    },
    nearbySlugs: ["zurich"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture"],
    priceAnchors: { endOfTenancyFrom: 630, deepCleaningFrom: 390 },
    indexable: true
  },
  {
    slug: "uster",
    name: "Uster",
    plz: ["8610"],
    canton: "ZH",
    region: "zuerich",
    tier: 2,
    availability: {
      b2cTransactional: true,
      b2bRecurring: true,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Zürcher Oberland — 20 CHF Anfahrtspauschale."
    },
    coordinates: { lat: 47.3486, lng: 8.7183 },
    travelFee: 20,
    localContext: {
      buildingTypes: "Ehemalige Spinnerei-Fabriken (umgebaut zu repräsentativen Lofts), Einfamilienhäuser am See",
      clientProfile: "Umweltbewusste Familien, Loftbewohner, lokale Genossenschafter",
      cleaningNotes: "Präzisionsreinigung offenporiger Sichtbetonwände und grossflächiger Parkette in Loftbauten ohne Rückstände.",
      landmark: "Schloss Uster",
      uniqueBlurb: "Am Greifensee in Uster pflegen wir Wohnungen, Häuser und Büros schonend mit 100% biologisch abbaubaren B-Corp-Produkten."
    },
    nearbySlugs: ["volketswil", "duebendorf"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 630, deepCleaningFrom: 390 },
    indexable: true
  },
  {
    slug: "duebendorf",
    name: "Dübendorf",
    plz: ["8600"],
    canton: "ZH",
    region: "zuerich",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Bedienung über Kloten/Zürich."
    },
    coordinates: { lat: 47.3983, lng: 8.6186 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Moderne Tech-Hubs, Mehrfamilienhäuser in Uninähe, neue Wohnüberbauungen im Hochbord-Areal",
      clientProfile: "Forschende, KMUs, Angestellte im Tech-Sektor",
      cleaningNotes: "Spezielle Glasfassadenreinigungen an hohen modernen Wohntürmen. Reinigung von Computer- und Serverräumen.",
      landmark: "Flugplatz Dübendorf",
      uniqueBlurb: "In Dübendorf verbinden wir moderne Technik-Reinigungsansprüche mit traditionellem Schweizer Reinigungshandwerk."
    },
    nearbySlugs: ["wallisellen", "opfikon", "zurich", "uster"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning"],
    priceAnchors: { endOfTenancyFrom: 630, deepCleaningFrom: 390 },
    indexable: false
  },
  {
    slug: "wallisellen",
    name: "Wallisellen",
    plz: ["8304"],
    canton: "ZH",
    region: "zuerich",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Bedienung über Kloten/Zürich."
    },
    coordinates: { lat: 47.4117, lng: 8.5911 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Grosse Büro-Hauptquartiere am Richti-Areal, moderne Eigentumswohnungen",
      clientProfile: "Finanz- und Softwareunternehmen, berufstätige Familien im Agglomerationsgürtel",
      cleaningNotes: "Unterhaltsreinigung nach strengen Hygiene- und Umweltvorgaben der ISO-zertifizierten Grossfirmen.",
      landmark: "Glattzentrum",
      uniqueBlurb: "Im geschäftigen Wallisellen sichern wir den Werterhalt Ihrer Geschäfts- und Wohnräume durch zertifizierte Premium-Reinigung."
    },
    nearbySlugs: ["kloten", "opfikon", "zurich", "duebendorf"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning"],
    priceAnchors: { endOfTenancyFrom: 630, deepCleaningFrom: 390 },
    indexable: false
  },
  {
    slug: "opfikon",
    name: "Opfikon",
    plz: ["8152"],
    canton: "ZH",
    region: "zuerich",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Bedienung über Kloten/Zürich."
    },
    coordinates: { lat: 47.4297, lng: 8.5714 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Moderne Mehrfamilienhaussiedlungen im Glattpark, Büroflächen, Gewerbegebäude",
      clientProfile: "Angestellte der nahegelegenen Grosskonzerne, internationale Familien",
      cleaningNotes: "Reinigungen im Glattpark fokussieren auf modernste Verbundwerkstoffe und schonende Laminat-/Parkettpflege.",
      landmark: "Glattpark",
      uniqueBlurb: "Im aufstrebenden Glattpark in Opfikon pflegen wir Ihre Liegenschaften mit umweltfreundlichen B-Corp-Mitteln."
    },
    nearbySlugs: ["kloten", "wallisellen", "zurich"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning"],
    priceAnchors: { endOfTenancyFrom: 630, deepCleaningFrom: 390 },
    indexable: false
  },
  {
    slug: "volketswil",
    name: "Volketswil",
    plz: ["8604"],
    canton: "ZH",
    region: "zuerich",
    tier: 3,
    availability: {
      b2cTransactional: true,
      b2bRecurring: false,
      services: ["end-of-tenancy", "deep-cleaning"]
    },
    localContent: {
      kuendigungstermine: KUENDIGUNGSTERMINE.ZH.de,
      entsorgung: null,
      quartiere: [],
      einsatzhinweis: "Bedienung über Uster/Dübendorf."
    },
    coordinates: { lat: 47.3881, lng: 8.6947 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Einfamilienhaus-Siedlungen, weitläufige Gewerbe- und Fachmarktzentren",
      clientProfile: "Familien mit Kindern, ansässige Handels- und Gewerbebetriebe",
      cleaningNotes: "Umfassende Reinigung von Teppichen und stark beanspruchten Böden in Verkaufsräumen.",
      landmark: "Gewerbezone Volketswil",
      uniqueBlurb: "In Volketswil sind wir Ihr Fachpartner für die zuverlässige Reinigung von Wohnhäusern und Verkaufsflächen."
    },
    nearbySlugs: ["uster", "duebendorf"],
    services: ["end-of-tenancy", "deep-cleaning"],
    priceAnchors: { endOfTenancyFrom: 630, deepCleaningFrom: 390 },
    indexable: false
  }
];
