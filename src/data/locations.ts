export interface Municipality {
  slug: string;              // "neuhausen-am-rheinfall"
  name: string;              // "Neuhausen am Rheinfall"
  plz: string[];             // ["8212"]
  canton: "SH" | "ZH" | "TG";
  region: "schaffhausen" | "winterthur" | "zuerich";
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

export const MUNICIPALITIES: Municipality[] = [
  // --- REGION SCHAFFHAUSEN ---
  {
    slug: "schaffhausen",
    name: "Schaffhausen",
    plz: ["8200", "8201", "8203", "8204", "8205", "8207", "8208"],
    canton: "SH",
    region: "schaffhausen",
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
    coordinates: { lat: 47.6783, lng: 8.6148 },
    travelFee: 0,
    localContext: {
      buildingTypes: "Wohnblöcke an der Zentralstrasse, Einfamilienhäuser am Galgenbuck, Gewerbebauten im Rundbuck",
      clientProfile: "Pendler nach Zürich/Schaffhausen, junge Familien und touristische Dienstleistungsbetriebe",
      cleaningNotes: "Exponierte Fensterflächen nahe des Rheinfalls erfordern spezielle Glasreinigungen zur Entfernung feiner Gischt-Rückstände.",
      landmark: "Rheinfall",
      uniqueBlurb: "Nahe dem weltberühmten Rheinfall pflegen wir Wohnräume und Gewerbelokale in Neuhausen mit umweltschonender Gründlichkeit."
    },
    nearbySlugs: ["schaffhausen", "feuerthalen", "beringen", "uhwiesen"],
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
    coordinates: { lat: 47.6594, lng: 8.8593 },
    travelFee: 25,
    localContext: {
      buildingTypes: "Historische Fachwerkhäuser mit Wandmalereien, verwinkelte Altstadtwohnungen, moderne Einfamilienhäuser am Stadtrand",
      clientProfile: "Besitzer historischer Immobilien, Gastronomie- und Pensionsbetreiber, Wochenend-Heimkehrer",
      cleaningNotes: "Strengste Denkmalschutz-Vorgaben verlangen den Verzicht auf aggressive Reinigungsmittel an historischen Holzfassaden und alten Butzenscheiben.",
      landmark: "Burg Hohenklingen",
      uniqueBlurb: "Im mittelalterlichen Stein am Rhein reinigen wir behutsam Riegelhäuser und moderne Wohnungen mit handwerklicher Präzision."
    },
    nearbySlugs: ["ramsen", "diessenhofen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 540, deepCleaningFrom: 340 },
    indexable: true
  },
  {
    slug: "thayngen",
    name: "Thayngen",
    plz: ["8240"],
    canton: "SH",
    region: "schaffhausen",
    coordinates: { lat: 47.7461, lng: 8.7118 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Einfamilienhaus-Siedlungen, weitläufige Gewerbe- und Logistikflächen, traditionelle Häuser im Ortskern",
      clientProfile: "Berufspendler nach Singen und Zürich, Logistik- und KMU-Geschäftsleitungen",
      cleaningNotes: "Gewerbliche Hallen erfordern robuste Bodenreinigungsmaschinen. Wohnungsreinigungen fokussieren auf gründliche Entstaubung.",
      landmark: "Kulturzentrum Thayngen",
      uniqueBlurb: "In der Grenzgemeinde Thayngen bieten wir flexible Reinigungsservices für Wohn- und Industrieobjekte im Reiat."
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
    coordinates: { lat: 47.6975, lng: 8.5772 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Moderne Neubau-Siedlungen, geräumige Einfamilienhäuser im Grünen, Industrie- und Gewerbebauten",
      clientProfile: "Junge Familien mit Doppelverdienst, ansässige Technologie- und Industrieunternehmen",
      cleaningNotes: "Neubauten verfügen oft über empfindliche grossflächige Design-Estriche, die pH-neutrale Pflegeprodukte erfordern.",
      landmark: "Schloss Beringen",
      uniqueBlurb: "In der wachsenden Gemeinde Beringen im Klettgau betreuen wir moderne Neubauten und Gewerbeflächen mit schnellen Anfahrtszeiten."
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
    coordinates: { lat: 47.6908, lng: 8.4984 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Denkmalgeschützte Altbauten im Städtlikern, Einfamilienhäuser, landwirtschaftliche Mischbauten",
      clientProfile: "Traditionsbewusste Hauseigentümer, lokale Gewerbetreibende, Landwirte",
      cleaningNotes: "Erhaltspflege von alten Dielenböden und Riegelwerk steht hier im Vordergrund. Behutsame Fleckenentfernung auf Natursteinplatten.",
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
    coordinates: { lat: 47.6972, lng: 8.4594 },
    travelFee: 20,
    localContext: {
      buildingTypes: "Traditionelle Weingüter, ländliche Wohnhäuser, gastronomische Betriebe im Dorfzentrum",
      clientProfile: "Winzerfamilien, Gastronomen, Natur- und Ruhesuchende",
      cleaningNotes: "Gastronomieflächen erfordern strikte Einhaltung der HACCP-Hygienestandards. Reinigung im Weinkeller-Umfeld verlangt äusserste Vorsicht.",
      landmark: "Bergkirche St. Moritz",
      uniqueBlurb: "Inmitten der idyllischen Weinberge von Hallau pflegen wir Weinkeller, Gastronomieflächen und Wohnungen mit grösster Sorgfalt."
    },
    nearbySlugs: ["neunkirch", "wilchingen", "schleitheim"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 540, deepCleaningFrom: 340 },
    indexable: true
  },
  {
    slug: "wilchingen",
    name: "Wilchingen",
    plz: ["8217"],
    canton: "SH",
    region: "schaffhausen",
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
    indexable: true
  },
  {
    slug: "schleitheim",
    name: "Schleitheim",
    plz: ["8226"],
    canton: "SH",
    region: "schaffhausen",
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
    indexable: true
  },
  {
    slug: "loehningen",
    name: "Löhningen",
    plz: ["8224"],
    canton: "SH",
    region: "schaffhausen",
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
    indexable: true
  },
  {
    slug: "stetten",
    name: "Stetten",
    plz: ["8234"],
    canton: "SH",
    region: "schaffhausen",
    coordinates: { lat: 47.7347, lng: 8.6586 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Gehobene Einfamilienhäuser, Villen und neuzeitliche Eigentumswohnungen",
      clientProfile: "Privatkunden mit überdurchschnittlichen Qualitätsansprüchen, vielbeschäftigte Kaderleute",
      cleaningNotes: "Professionelle Versiegelung von Natursteinplatten und materialgerechte Pflege von exklusivem Echtholzparkett.",
      landmark: "Schloss Herblingen",
      uniqueBlurb: "Am sonnigen Hang von Stetten reinigen wir Einfamilienhäuser und Villen mit einem Höchstmass an Diskretion und Präzision."
    },
    nearbySlugs: ["schaffhausen", "thayngen", "doerflingen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: true
  },
  {
    slug: "doerflingen",
    name: "Dörflingen",
    plz: ["8239"],
    canton: "SH",
    region: "schaffhausen",
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
    indexable: true
  },
  {
    slug: "ramsen",
    name: "Ramsen",
    plz: ["8262"],
    canton: "SH",
    region: "schaffhausen",
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
    indexable: true
  },
  {
    slug: "buchberg",
    name: "Buchberg",
    plz: ["8454"],
    canton: "SH",
    region: "schaffhausen",
    coordinates: { lat: 47.5708, lng: 8.5639 },
    travelFee: 20,
    localContext: {
      buildingTypes: "Exklusive Wohnhäuser in Hanglage, moderne Terrassenhäuser, traditionelle Winzerhäuser",
      clientProfile: "Eigentümer mit anspruchsvollen Immobilien, Weinfachleute",
      cleaningNotes: "Reinigung grossflächiger Panoramafenster mit entmineralisiertem Wasser für eine absolut streifenfreie Aussicht auf den Rhein.",
      landmark: "Rebberge Buchberg",
      uniqueBlurb: "In Buchberg, der Schaffhauser Exklave am Rhein, betreuen wir Ihre gehobenen Wohnflächen mit Schweizer Zuverlässigkeit."
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
    coordinates: { lat: 47.5786, lng: 8.5772 },
    travelFee: 20,
    localContext: {
      buildingTypes: "Einfamilienhäuser am Flussufer, Ferienwohnungen, gepflegte Riegelhäuser",
      clientProfile: "Zweitwohnsitz-Besitzer, aktive Familien, Wassersportler",
      cleaningNotes: "Regelmässige Beseitigung von Spinnweben und Insektenspuren an Fassadenteilen nahe dem Rheinufer.",
      landmark: "Rheinbogen",
      uniqueBlurb: "Im malerischen Rüdlingen am Rhein sind wir Ihr Partner für die anspruchsvolle Reinigung von Wohnungen und Ferienhäusern."
    },
    nearbySlugs: ["buchberg", "rafz"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 540, deepCleaningFrom: 340 },
    indexable: true
  },
  {
    slug: "feuerthalen",
    name: "Feuerthalen",
    plz: ["8245"],
    canton: "ZH",
    region: "schaffhausen",
    coordinates: { lat: 47.6931, lng: 8.6472 },
    travelFee: 0,
    localContext: {
      buildingTypes: "Mehrfamilienhäuser in Rheinnähe, gewerbliche Ateliers, klassische Wohnungen",
      clientProfile: "Junge Paare, Familien und Handwerksbetriebe an bester Lage ennet dem Rhein",
      cleaningNotes: "Professionelle Beseitigung von Schimmelansätzen in Badezimmern durch feuchte Rheinnähe. Gründliche Fliesenreinigung.",
      landmark: "Rheinbrücke",
      uniqueBlurb: "Direkt ennet der Rheinbrücke in Feuerthalen reinigen wir Wohnungen und Büros speditiv und zu fairen Fixpreisen."
    },
    nearbySlugs: ["schaffhausen", "neuhausen-am-rheinfall", "uhwiesen"],
    services: ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: true
  },
  {
    slug: "diessenhofen",
    name: "Diessenhofen",
    plz: ["8253"],
    canton: "TG",
    region: "schaffhausen",
    coordinates: { lat: 47.6908, lng: 8.7514 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Uralte Altstadthäuser im geschützten Ortskern, moderne Einfamilienhäuser im Thurgauer Hinterland",
      clientProfile: "Inhaber von geschichtsträchtigen Bauten, bodenständige Familien, Kleingewerbe",
      cleaningNotes: "Behutsame Pflege von alten Massivholzbalken und antiken Beschlägen. Verwendung schonendster Bio-Reinigungsöle.",
      landmark: "Holzbrücke Diessenhofen",
      uniqueBlurb: "Im thurgauischen Diessenhofen reinigen wir historische Wohnhäuser am Rhein und moderne Wohnungen mit Übergabegarantie."
    },
    nearbySlugs: ["stein-am-rhein", "feuerthalen"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 530, deepCleaningFrom: 330 },
    indexable: true
  },
  {
    slug: "uhwiesen",
    name: "Uhwiesen",
    plz: ["8248"],
    canton: "ZH",
    region: "schaffhausen",
    coordinates: { lat: 47.6711, lng: 8.6283 },
    travelFee: 10,
    localContext: {
      buildingTypes: "Landwirtschaftliche Riegelbauten, freistehende Einfamilienhäuser am Südhang des Kohlfirsts",
      clientProfile: "Pendler nach Winterthur und Schaffhausen, Familien, die ländlich wohnen möchten",
      cleaningNotes: "Reinigung von Cheminées und Kachelöfen. Sorgfältige Reinigung exponierter Holzdecken im Innenbereich.",
      landmark: "Schloss Laufen",
      uniqueBlurb: "In Laufen-Uhwiesen am Kohlfirst reinigen wir ländliche Wohnobjekte und Einfamilienhäuser mit Schweizer Gründlichkeit."
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
    region: "schaffhausen",
    coordinates: { lat: 47.6094, lng: 8.5392 },
    travelFee: 15,
    localContext: {
      buildingTypes: "Traditionelle Bauernhäuser im Zürcher Unterland, moderne Neubausiedlungen am Hang",
      clientProfile: "Familien mit hoher beruflicher Mobilität Richtung Zürich, ansässige Obstproduzenten",
      cleaningNotes: "Neubaureinigungen inklusive feiner Baustaubbeseitigung in schwer zugänglichen Lüftungsschächten und Storenkästen.",
      landmark: "Rafzer Kirche",
      uniqueBlurb: "Im geschichtsträchtigen Rafzerfeld übernehmen wir die professionelle Endreinigung von Wohnungen mit 100% Abnahmegarantie."
    },
    nearbySlugs: ["buchberg", "ruedlingen"],
    services: ["end-of-tenancy", "deep-cleaning", "window-cleaning"],
    priceAnchors: { endOfTenancyFrom: 520, deepCleaningFrom: 320 },
    indexable: true
  },

  // --- REGION WINTERTHUR ---
  {
    slug: "winterthur",
    name: "Winterthur",
    plz: ["8400", "8401", "8403", "8404", "8405", "8406", "8408", "8409", "8410", "8411"],
    canton: "ZH",
    region: "winterthur",
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
    indexable: true
  },
  {
    slug: "pfungen",
    name: "Pfungen",
    plz: ["8422"],
    canton: "ZH",
    region: "winterthur",
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
    indexable: true
  },
  {
    slug: "seuzach",
    name: "Seuzach",
    plz: ["8472"],
    canton: "ZH",
    region: "winterthur",
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
    indexable: true
  },
  {
    slug: "neftenbach",
    name: "Neftenbach",
    plz: ["8413"],
    canton: "ZH",
    region: "winterthur",
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
    indexable: true
  },
  {
    slug: "wiesendangen",
    name: "Wiesendangen",
    plz: ["8542"],
    canton: "ZH",
    region: "winterthur",
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
    indexable: true
  },

  // --- REGION ZÜRICH ---
  {
    slug: "zurich",
    name: "Zürich",
    plz: ["8000", "8001", "8002", "8003", "8004", "8005", "8006", "8008", "8032", "8044", "8045", "8047", "8048", "8049", "8050", "8051", "8052", "8053", "8055", "8057"],
    canton: "ZH",
    region: "zuerich",
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
    indexable: true
  },
  {
    slug: "wallisellen",
    name: "Wallisellen",
    plz: ["8304"],
    canton: "ZH",
    region: "zuerich",
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
    indexable: true
  },
  {
    slug: "opfikon",
    name: "Opfikon",
    plz: ["8152"],
    canton: "ZH",
    region: "zuerich",
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
    indexable: true
  },
  {
    slug: "volketswil",
    name: "Volketswil",
    plz: ["8604"],
    canton: "ZH",
    region: "zuerich",
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
    indexable: true
  }
];
