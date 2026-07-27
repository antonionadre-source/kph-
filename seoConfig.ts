import { translations } from "./i18n";
import { MUNICIPALITIES } from "./src/data/locations";

export type Language = "de" | "en" | "fr" | "it" | "es" | "pt";

export const BRAND = "Kraken Properties and Facilities Management";
export const BASE_URL = "https://krakenpfm.ch";

export const PATH_TO_PAGE_MAP: Record<string, string> = {
  "/": "home",
  "/quote": "consultation",
  "/about": "about",
  "/services": "services-page",
  "/commercial": "commercial-services",
  "/careers": "careers",
  "/sustainability": "sustainability-page",
  "/our-story": "our-story",
  "/blog": "blog",
  "/blog/wohnungsabgabe-zurich-perfekte-uebergabe": "blog",
  "/blog/iot-smart-facility-management-schweizer-bueros": "blog",
  "/comic": "comic-page",
  "/comic-shop": "comic-shop",
  "/gdpr": "gdpr",
  "/terms": "terms",
  "/hse": "hse",
  "/impressum": "impressum",
  "/imprint": "impressum",
  "/kontakt": "kontakt",
  "/login": "login",
  "/register": "register",
  "/dashboard": "dashboard",
  "/commercial-quote": "commercial-quote",
  "/review-invite": "review-invite",
  "/reviews": "review-invite",
  "/reviewsvip": "review-invite",
  "/dejar-opinion": "review-invite",
  "/einsatzgebiete": "coverage-hub",
};

export const PAGE_TO_PATH_MAP: Record<string, string> = {
  "home": "/",
  "consultation": "/quote",
  "about": "/about",
  "services-page": "/services",
  "commercial-services": "/commercial",
  "careers": "/careers",
  "sustainability-page": "/sustainability",
  "our-story": "/our-story",
  "blog": "/blog",
  "comic-page": "/comic",
  "comic-shop": "/comic-shop",
  "gdpr": "/gdpr",
  "terms": "/terms",
  "hse": "/hse",
  "impressum": "/impressum",
  "kontakt": "/kontakt",
  "login": "/login",
  "register": "/register",
  "dashboard": "/dashboard",
  "commercial-quote": "/commercial-quote",
  "review-invite": "/reviews",
  "coverage-hub": "/einsatzgebiete",
};

export const VALID_CITIES = ["schaffhausen", "zurich", "winterthur", "neuhausen", "thayngen", "stein-am-rhein", "feuerthalen", "kloten", "buelach", "dietikon", "uster"];
export const VALID_SERVICES = [
  "end-of-tenancy",
  "deep-cleaning",
  "daily-cleaning",
  "moving-furniture",
  "gardening",
  "exterior-cleaning",
  "pest-control",
  "waste-management",
  "car-detailing",
  "gutter-cleaning",
  "upholstery-cleaning",
  "window-cleaning",
  "mudanza-cajas",
  "pulido-suelos",
  "bar-restaurant-cleaning",
  "property-managers",
  "airbnb-rentals",
  "turnover-cleaning",
  "offices-corporate",
  "retail-showrooms",
  "gastronomy-restaurants",
  "kitchen-deep-cleaning",
  "industry-logistics"
];

export const getRegionHubUrl = (region: string): string => {
  const norm = region.toLowerCase();
  if (norm === "schaffhausen" || norm === "kanton-schaffhausen") {
    return "/reinigung/kanton-schaffhausen";
  }
  if (norm === "winterthur" || norm === "region-winterthur") {
    return "/reinigung/region-winterthur";
  }
  if (norm === "zuerich" || norm === "zurich" || norm === "region-zuerich") {
    return "/reinigung/region-zuerich";
  }
  return "/reinigung/region-zuerich";
};

export const getMunicipalityUrl = (municipalitySlug: string): string => {
  return `/reinigung/${municipalitySlug.toLowerCase()}`;
};

export const getServicePageUrl = (cityOrRegionSlug: string, serviceSlug: string): string | null => {
  let city = cityOrRegionSlug.toLowerCase();
  if (city === "zuerich") city = "zurich";
  if (city === "neuhausen-am-rheinfall") city = "neuhausen";
  const service = serviceSlug.toLowerCase();
  if (VALID_CITIES.includes(city) && VALID_SERVICES.includes(service)) {
    return `/services/${city}/${service}`;
  }
  return null;
};

export const getServiceLinkForMunicipality = (municipalitySlug: string, serviceSlug: string): string => {
  const mun = MUNICIPALITIES.find(m => m.slug === municipalitySlug.toLowerCase());
  if (!mun) {
    return `/services/zurich/${serviceSlug.toLowerCase()}`;
  }
  
  const mSlug = mun.slug;
  const urlCitySlug = mSlug === "neuhausen-am-rheinfall" ? "neuhausen" : mSlug;
  const isDedicatedMunicipality = VALID_CITIES.includes(urlCitySlug);
  
  if (isDedicatedMunicipality) {
    return `/services/${urlCitySlug}/${serviceSlug.toLowerCase()}`;
  }
  
  const targetRegion = mun.region === "zuerich" ? "zurich" : mun.region;
  return `/services/${targetRegion}/${serviceSlug.toLowerCase()}`;
};

export const isRouteValid = (path: string): boolean => {
  const cleanPath = path.split("?")[0];
  if (PATH_TO_PAGE_MAP[cleanPath]) {
    return true;
  }

  // Level 1 Region Hubs
  const regionRegex = /^\/reinigung\/(kanton-schaffhausen|region-winterthur|region-zuerich)$/i;
  if (regionRegex.test(cleanPath)) {
    return true;
  }

  // Level 2 Municipalities
  const munRegex = /^\/reinigung\/([a-zA-Z0-9_-]+)$/i;
  const munMatch = cleanPath.match(munRegex);
  if (munMatch) {
    const slug = munMatch[1].toLowerCase();
    return MUNICIPALITIES.some(m => m.slug === slug);
  }
  
  // Dynamic pattern: /services/:city/:serviceId
  const servicesRegex = /^\/services\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i;
  const match = cleanPath.match(servicesRegex);
  if (match) {
    const city = match[1].toLowerCase();
    const service = match[2].toLowerCase();
    const normalizedCity = city === "zuerich" ? "zurich" : city;
    return VALID_CITIES.includes(normalizedCity) && VALID_SERVICES.includes(service);
  }

  // Also support /seo/:city/:serviceId
  const seoRegex = /^\/seo\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i;
  const seoMatch = cleanPath.match(seoRegex);
  if (seoMatch) {
    const city = seoMatch[1].toLowerCase();
    const service = seoMatch[2].toLowerCase();
    const normalizedCity = city === "zuerich" ? "zurich" : city;
    return VALID_CITIES.includes(normalizedCity) && VALID_SERVICES.includes(service);
  }

  // Support /reinigung-[city]-[serviceId]
  const deRegex = /^\/reinigung-(schaffhausen|zurich|zuerich|winterthur|neuhausen|thayngen|stein-am-rhein|feuerthalen|kloten|buelach|dietikon|uster)-([a-zA-Z0-9_-]+)$/i;
  const deMatch = cleanPath.match(deRegex);
  if (deMatch) {
    const city = deMatch[1].toLowerCase();
    const service = deMatch[2].toLowerCase();
    const normalizedCity = city === "zuerich" ? "zurich" : city;
    return VALID_CITIES.includes(normalizedCity) && VALID_SERVICES.includes(service);
  }

  return false;
};

export const parsePath = (path: string) => {
  const cleanPath = path.split("?")[0];
  if (PATH_TO_PAGE_MAP[cleanPath]) {
    return { page: PATH_TO_PAGE_MAP[cleanPath], cityId: "", serviceId: "" };
  }

  // Level 1 Region Hubs
  const regionRegex = /^\/reinigung\/(kanton-schaffhausen|region-winterthur|region-zuerich)$/i;
  const regionMatch = cleanPath.match(regionRegex);
  if (regionMatch) {
    const regionSlug = regionMatch[1].toLowerCase();
    const regionId = regionSlug === "kanton-schaffhausen" 
      ? "schaffhausen" 
      : regionSlug === "region-winterthur" 
      ? "winterthur" 
      : "zuerich";
    return {
      page: "region-hub",
      cityId: regionId,
      serviceId: ""
    };
  }

  // Level 2 Municipalities
  const munRegex = /^\/reinigung\/([a-zA-Z0-9_-]+)$/i;
  const munMatch = cleanPath.match(munRegex);
  if (munMatch) {
    const slug = munMatch[1].toLowerCase();
    if (MUNICIPALITIES.some(m => m.slug === slug)) {
      return {
        page: "municipality-page",
        cityId: slug,
        serviceId: ""
      };
    }
  }
  
  // Dynamic pattern: /services/:city/:serviceId
  const servicesRegex = /^\/services\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i;
  const match = cleanPath.match(servicesRegex);
  if (match) {
    const rawCity = match[1].toLowerCase();
    const city = rawCity.replace(/ü/g, "ue").replace(/ö/g, "oe").replace(/ä/g, "ae");
    const service = match[2].toLowerCase();
    const normalizedCity = city === "zuerich" ? "zurich" : city;
    if (VALID_CITIES.includes(normalizedCity) && VALID_SERVICES.includes(service)) {
      return {
        page: "seo-landing",
        cityId: normalizedCity,
        serviceId: match[2]
      };
    }
  }

  // Also support /seo/:city/:serviceId
  const seoRegex = /^\/seo\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i;
  const seoMatch = cleanPath.match(seoRegex);
  if (seoMatch) {
    const rawCity = seoMatch[1].toLowerCase();
    const city = rawCity.replace(/ü/g, "ue").replace(/ö/g, "oe").replace(/ä/g, "ae");
    const service = seoMatch[2].toLowerCase();
    const normalizedCity = city === "zuerich" ? "zurich" : city;
    if (VALID_CITIES.includes(normalizedCity) && VALID_SERVICES.includes(service)) {
      return {
        page: "seo-landing",
        cityId: normalizedCity,
        serviceId: seoMatch[2]
      };
    }
  }

  // Support /reinigung-[city]-[serviceId]
  const deRegex = /^\/reinigung-(schaffhausen|zurich|zuerich|winterthur|neuhausen|thayngen|stein-am-rhein|feuerthalen|kloten|buelach|dietikon|uster)-([a-zA-Z0-9_-]+)$/i;
  const deMatch = cleanPath.match(deRegex);
  if (deMatch) {
    const city = deMatch[1].toLowerCase();
    const service = deMatch[2].toLowerCase();
    const normalizedCity = city === "zuerich" ? "zurich" : city;
    if (VALID_CITIES.includes(normalizedCity) && VALID_SERVICES.includes(service)) {
      return {
        page: "seo-landing",
        cityId: normalizedCity,
        serviceId: deMatch[2]
      };
    }
  }

  return { page: "404", cityId: "", serviceId: "" };
};

// Fallbacks or default values (German)
export const defaults: Record<string, { title: string; description: string }> = {
  "404": {
    title: "Page Not Found | " + BRAND,
    description: "The page you are looking for does not exist."
  },
  "home": {
    title: "Kraken PFM – Facility Management & Reinigung | Schaffhausen, Zürich, Winterthur",
    description: "Professionelles Facility Management, Reinigung und Hausbetreuung in Schaffhausen, Zürich und Winterthur. Umzugsreinigung, Unterhaltsreinigung, Hauswartung – Schweizer Qualität."
  },
  "services-page": {
    title: "Reinigung & Facility Services | " + BRAND,
    description: "Gebäudereinigung, Umzugsreinigung, Unterhaltsreinigung und Hauswartung in Schaffhausen, Zürich und Winterthur – mit Schweizer Qualitätsstandard."
  },
  "commercial-services": {
    title: "Gewerbliches Facility Management (B2B) | " + BRAND,
    description: "Professionelle Facility-Management- und Reinigungsdienste für Büros und Gewerbeflächen in der Region Schaffhausen, Zürich und Winterthur."
  },
  "commercial-quote": {
    title: "Offerte anfordern – Gewerbe (B2B) | " + BRAND,
    description: "Fordern Sie eine massgeschneiderte B2B-Offerte für Facility Management und Reinigung an. Klare Preise, Schweizer Qualität, Antwort am selben Tag."
  },
  "consultation": {
    title: "Sofort-Offerte & Beratung | " + BRAND,
    description: "Konfigurieren Sie Ihren Service und erhalten Sie eine sofortige Offerte in CHF. Transparente Preise ohne versteckte Kosten."
  },
  "about": {
    title: "Über uns | " + BRAND,
    description: "Lernen Sie Kraken PFM kennen – Ihr zuverlässiger Schweizer Partner für professionelles Facility Management und Reinigung in Schaffhausen, Zürich und Winterthur."
  },
  "our-story": {
    title: "Unsere Geschichte | " + BRAND,
    description: "Die Geschichte hinter Kraken PFM und Kai – Präzision, Verlässlichkeit und Schweizer Qualität im Facility Management."
  },
  "sustainability-page": {
    title: "Nachhaltigkeit | " + BRAND,
    description: "Unser Engagement für Nachhaltigkeit: verifizierte Umweltwirkung, öko-zertifizierte Produkte und zirkuläre Logistik mit Schweizer Präzision."
  },
  "careers": {
    title: "Karriere – Werde Teil der Crew | " + BRAND,
    description: "Offene Stellen bei Kraken PFM. Werde Teil unseres Teams für Facility Management und Reinigung in der Region Schaffhausen, Zürich und Winterthur."
  },
  "blog": {
    title: "Blog – Der Takt der Ordnung | " + BRAND,
    description: "Lesen Sie unsere informativen Fachbeiträge zu Facility Management, Reinigung und Logistik in der Schweiz (Schaffhausen, Zürich, Winterthur) für beste Sauberkeit."
  },
  "clients": {
    title: "Kunden & Referenzen | " + BRAND,
    description: "Von Eigentümern, Mietern und Unternehmen in der Region gewählt. Entdecken Sie, warum Kunden Kraken PFM vertrauen."
  },
  "hse": {
    title: "HSE – Gesundheit & Sicherheit | " + BRAND,
    description: "Unsere Standards für Gesundheit, Sicherheit und Umwelt (HSE) im Facility Management."
  },
  "gdpr": {
    title: "Datenschutz (DSGVO) | " + BRAND,
    description: "Informationen zum Datenschutz und zur Verarbeitung Ihrer Daten bei Kraken Properties and Facilities Management."
  },
  "terms": {
    title: "Allgemeine Geschäftsbedingungen | " + BRAND,
    description: "Allgemeine Geschäftsbedingungen (AGB) von Kraken Properties and Facilities Management."
  },
  "impressum": {
    title: "Impressum | " + BRAND,
    description: "Impressum und rechtliche Angaben zu Kraken Properties and Facilities Management."
  },
  "comic-page": {
    title: "Die Legende von Kai – Comic | " + BRAND,
    description: "Entdecken Sie die Comic-Geschichte von Kai, dem Maskottchen von Kraken PFM."
  },
  "comic-shop": {
    title: "Comic Shop | " + BRAND,
    description: "Der offizielle Comic Shop von Kraken PFM – entdecken Sie die Welt von Kai."
  },
  "login": {
    title: "Login | " + BRAND,
    description: "Zugang zum Kundenportal von Kraken Properties and Facilities Management."
  },
  "register": {
    title: "Registrieren | " + BRAND,
    description: "Erstellen Sie ein Konto im Kundenportal von Kraken Properties and Facilities Management."
  },
  "kontakt": {
    title: "Kontakt | " + BRAND,
    description: "Kontaktieren Sie Kraken Properties and Facilities Management. Ihr zuverlässiger Partner für Reinigung und Facility Management in Schaffhausen, Zürich und Winterthur."
  },
  "coverage-hub": {
    title: "Einsatzgebiete & Standorte – Reinigung & Facility Management | " + BRAND,
    description: "Unsere Standorte und Gemeinden: Professionelle Reinigung und Facility Services im Kanton Schaffhausen, in der Region Winterthur und im Grossraum Zürich mit Schweizer Abnahmegarantie."
  }
};

// French language mappings
export const frMap: Record<string, { title: string; description: string }> = {
  "home": {
    title: "Kraken PFM – Facility Management & Nettoyage | Schaffhausen, Zurich, Winterthur",
    description: "Gestion professionnelle de facilities, nettoyage et entretien immobilier à Schaffhausen, Zurich et Winterthur – qualité suisse."
  },
  "services-page": {
    title: "Services de nettoyage et facilities | " + BRAND,
    description: "Nettoyage de bâtiments, nettoyage de fin de bail, nettoyage d’entretien et maintenance à Schaffhausen, Zurich et Winterthur."
  },
  "commercial-services": {
    title: "Gestion de structures commerciales (B2B) | " + BRAND,
    description: "Services professionnels de facility management et de nettoyage pour bureaux et locaux commerciaux."
  },
  "consultation": {
    title: "Devis instantané et consultation | " + BRAND,
    description: "Calculez votre devis instantané en CHF et configurez vos services de nettoyage et entretien. Tarifs transparents sans frais cachés."
  },
  "about": {
    title: "À propos de nous | " + BRAND,
    description: "Découvrez Kraken PFM – votre partenaire de confiance pour le facility management et le nettoyage en Suisse."
  },
  "coverage-hub": {
    title: "Zones d'Intervention & Localisations – Nettoyage & Facility Management | " + BRAND,
    description: "Nos localisations et communes : Services professionnels de nettoyage et facility management dans le canton de Schaffhouse, la région de Winterthour et le grand Zurich."
  }
};

// English language mappings
export const enMap: Record<string, { title: string; description: string }> = {
  "home": {
    title: "Kraken PFM – Facility Management & Cleaning | Schaffhausen, Zurich, Winterthur",
    description: "Professional facility management, cleaning and property maintenance in Schaffhausen, Zurich and Winterthur – Swiss quality."
  },
  "services-page": {
    title: "Cleaning & Facility Services | " + BRAND,
    description: "Building cleaning, move-out cleaning, maintenance cleaning and property maintenance in Schaffhausen, Zurich and Winterthur – with Swiss quality standard."
  },
  "commercial-services": {
    title: "Commercial Facility Management (B2B) | " + BRAND,
    description: "Professional facility management and cleaning services for offices and commercial spaces in the Schaffhausen, Zurich and Winterthur region."
  },
  "consultation": {
    title: "Instant Quote & Consultation | " + BRAND,
    description: "Configure your service and get an instant quote in CHF. Transparent pricing with no hidden fees."
  },
  "about": {
    title: "About Us | " + BRAND,
    description: "Get to know Kraken PFM – your reliable partner for facility management and cleaning in Schaffhausen, Zurich and Winterthur."
  },
  "coverage-hub": {
    title: "Service Areas & Locations – Cleaning & Facility Management | " + BRAND,
    description: "Our locations and municipalities: Professional cleaning and facility services in Canton of Schaffhausen, Winterthur region, and Greater Zurich with Swiss handover guarantee."
  }
};

// Spanish language mappings
export const esMap: Record<string, { title: string; description: string }> = {
  "home": {
    title: "Kraken PFM – Facility Management y Limpieza | Schaffhausen, Zúrich, Winterthur",
    description: "Gestión profesional de instalaciones, limpieza y mantenimiento de propiedades en Schaffhausen, Zúrich y Winterthur. Calidad suiza."
  },
  "services-page": {
    title: "Servicios de limpieza y mantenimiento | " + BRAND,
    description: "Limpiezas de edificios, de mudanza, de mantenimiento y conserjería en Schaffhausen, Zúrich y Winterthur. Estándar de calidad suizo."
  },
  "commercial-services": {
    title: "Gestión comercial de instalaciones (B2B) | " + BRAND,
    description: "Servicios profesionales de gestión y limpieza de instalaciones para oficinas y espacios comerciales."
  },
  "consultation": {
    title: "Presupuesto instantáneo y consulta | " + BRAND,
    description: "Configure su servicio y obtenga un presupuesto instantáneo en CHF. Precios transparentes sin tarifas ocultas."
  },
  "about": {
    title: "Sobre nosotros | " + BRAND,
    description: "Conozca Kraken PFM: su socio de confianza para la gestión de servicios e instalaciones de limpieza."
  },
  "coverage-hub": {
    title: "Áreas de Servicio y Ubicaciones – Limpieza y Facility Management | " + BRAND,
    description: "Nuestras ubicaciones y municipios: Servicios profesionales de limpieza y mantenimiento en Schaffhausen, Winterthur y Zúrich con garantía de entrega suiza."
  }
};

// Italian language mappings
export const itMap: Record<string, { title: string; description: string }> = {
  "home": {
    title: "Kraken PFM – Facility Management & Pulizia | Sciaffusa, Zurigo, Winterthur",
    description: "Gestione professionale di facility, pulizia e manutenzione immobiliare a Sciaffusa, Zurigo e Winterthur – qualità svizzera."
  },
  "services-page": {
    title: "Servizi di pulizia e facility | " + BRAND,
    description: "Pulizia di edifici, pulizia di fine locazione, pulizia di manutenzione e custodia immobiliare a Sciaffusa, Zurigo e Winterthur."
  },
  "commercial-services": {
    title: "Gestione strutture commerciali (B2B) | " + BRAND,
    description: "Servizi professionali di facility management e pulizia per uffici e spazi commerciali."
  },
  "consultation": {
    title: "Preventivo istantaneo e consulenza | " + BRAND,
    description: "Configura i tuoi servizi e ottieni un preventivo istantaneo in CHF, senza costi nascosti."
  },
  "about": {
    title: "Chi siamo | " + BRAND,
    description: "Scopri Kraken PFM – il tuo partner affidabile per la gestione delle installazioni e la pulizia."
  },
  "coverage-hub": {
    title: "Aree di Servizio e Sedi – Pulizia & Facility Management | " + BRAND,
    description: "Le nostre sedi e comuni: Servizi professionali di pulizia e facility management nel Canton Sciaffusa, nella regione di Winterthur e nell'area di Zurigo."
  }
};

// Portuguese language mappings
export const ptMap: Record<string, { title: string; description: string }> = {
  "home": {
    title: "Kraken PFM – Gestão de Instalações e Limpeza | Schaffhausen, Zurique, Winterthur",
    description: "Gestão profissional de instalações, limpeza e manutenção de propriedades em Schaffhausen, Zurique e Winterthur. Qualidade suíça."
  },
  "services-page": {
    title: "Serviços de Limpeza e Instalações | " + BRAND,
    description: "Limpeza de edifícios, limpeza pós-mudança, limpeza de manutenção e zeladoria em Schaffhausen, Zurique e Winterthur – padrão suíço."
  },
  "commercial-services": {
    title: "Gestão de Instalações Comerciais (B2B) | " + BRAND,
    description: "Servicios profissionais de gestão de instalações e limpeza para escritórios e espaços comerciais."
  },
  "consultation": {
    title: "Orçamento Instantâneo e Consulta | " + BRAND,
    description: "Configure o seu serviço e obtenha um orçamento instantâneo em CHF. Preços transparentes sem taxas ocultas."
  },
  "about": {
    title: "Sobre Nós | " + BRAND,
    description: "Conheça a Kraken PFM – o seu parceiro de confiança para a gestão de instalações e limpeza."
  },
  "coverage-hub": {
    title: "Áreas de Atuação e Localizações – Limpeza e Gestão de Instalações | " + BRAND,
    description: "Nossas localizações e municípios: Serviços profissionais de limpeza e gestão de instalações em Schaffhausen, Winterthur e Zurique."
  }
};

export const mapsByLang: Record<string, Record<string, { title: string; description: string }>> = {
  "en": enMap,
  "fr": frMap,
  "es": esMap,
  "it": itMap,
  "pt": ptMap
};

export const cityMap: Record<string, Record<string, string>> = {
  "zurich": { de: "Zürich", en: "Zurich", fr: "Zurich", it: "Zurigo", es: "Zúrich", pt: "Zurique" },
  "winterthur": { de: "Winterthur", en: "Winterthur", fr: "Winterthur", it: "Winterthur", es: "Winterthur", pt: "Winterthur" },
  "schaffhausen": { de: "Schaffhausen", en: "Schaffhausen", fr: "Schaffhouse", it: "Sciaffusa", es: "Schaffhausen", pt: "Schaffhausen" },
  "neuhausen": { de: "Neuhausen am Rheinfall", en: "Neuhausen am Rheinfall", fr: "Neuhausen am Rheinfall", it: "Neuhausen am Rheinfall", es: "Neuhausen am Rheinfall", pt: "Neuhausen am Rheinfall" },
  "thayngen": { de: "Thayngen", en: "Thayngen", fr: "Thayngen", it: "Thayngen", es: "Thayngen", pt: "Thayngen" },
  "stein-am-rhein": { de: "Stein am Rhein", en: "Stein am Rhein", fr: "Stein am Rhein", it: "Stein am Rhein", es: "Stein am Rhein", pt: "Stein am Rhein" },
  "feuerthalen": { de: "Feuerthalen", en: "Feuerthalen", fr: "Feuerthalen", it: "Feuerthalen", es: "Feuerthalen", pt: "Feuerthalen" },
  "kloten": { de: "Kloten", en: "Kloten", fr: "Kloten", it: "Kloten", es: "Kloten", pt: "Kloten" },
  "buelach": { de: "Bülach", en: "Bülach", fr: "Bülach", it: "Bülach", es: "Bülach", pt: "Bülach" },
  "dietikon": { de: "Dietikon", en: "Dietikon", fr: "Dietikon", it: "Dietikon", es: "Dietikon", pt: "Dietikon" },
  "uster": { de: "Uster", en: "Uster", fr: "Uster", it: "Uster", es: "Uster", pt: "Uster" }
};

export const wizardToI18nService: Record<string, string> = {
  "end-of-tenancy": "endOfTenancy",
  "deep-cleaning": "deepCleaning",
  "daily-cleaning": "dailyCleaning",
  "moving-furniture": "movingFurniture",
  "gardening": "gardening",
  "exterior-cleaning": "exterior",
  "pest-control": "pest",
  "waste-management": "waste",
  "car-detailing": "car",
  "gutter-cleaning": "gutter",
  "upholstery-cleaning": "upholstery",
  "window-cleaning": "window",
  "mudanza-cajas": "mudanzaCajas",
  "pulido-suelos": "pulidoSuelos",
  "bar-restaurant-cleaning": "restaurant",
  "property-managers": "propertyManagers",
  "airbnb-rentals": "airbnbRentals",
  "turnover-cleaning": "turnoverCleaning",
  "offices-corporate": "officesCorporate",
  "retail-showrooms": "retailShowrooms",
  "gastronomy-restaurants": "gastronomyRestaurants",
  "kitchen-deep-cleaning": "kitchenDeepCleaning",
  "industry-logistics": "industryLogistics"
};

export const B2B_SERVICE_TRANSLATIONS: Record<string, Record<string, string>> = {
  "services.propertyManagers.title": {
    de: "Immobilienverwalter (Property Managers)",
    en: "Property Managers",
    es: "Administradores de Propiedades",
    fr: "Régies & Gérants d'Immeubles",
    it: "Gestori Immobiliari",
    pt: "Administradores de Imóveis"
  },
  "services.propertyManagers.desc": {
    de: "Halten Sie Liegenschaften makellos, Mieter zufrieden und Abläufe mühelos.",
    en: "Keep properties pristine, tenants satisfied, and operations effortless.",
    es: "Mantén las propiedades impecables, los inquilinos satisfechos y las operaciones sin esfuerzo.",
    fr: "Conservez vos biens impeccables, vos locataires satisfaits et vos opérations sereines.",
    it: "Mantieni gli immobili impeccabili, gli inquilini soddisfatti e la gestione semplice.",
    pt: "Mantenha as propriedades impecáveis, inquilinos satisfeitos e operações fáceis."
  },
  "services.propertyManagers.marketingDesc": {
    de: "Mit unserem spezialisierten Service für Immobilienverwaltungen garantieren wir saubere Allgemeinflächen, reibungslose Mieterwechsel (Ein- und Auszug) und eine fachgerechte Instandhaltung. Schweizer Präzision für Ihren Werterhalt.",
    en: "With our specialized service for property managers, we guarantee clean common areas, smooth tenant turnover, and professional preventative maintenance. Swiss precision to maximize your asset value.",
    es: "Con nuestro servicio especializado para administradores de propiedades, garantizamos áreas comunes limpias, transiciones de inquilinos fluidas y mantenimiento preventivo profesional. Precisión suiza para maximizar el valor de sus activos."
  },
  "services.airbnbRentals.title": {
    de: "Airbnb & Ferienwohnungen",
    en: "Airbnb & Short-Term Rentals",
    es: "Airbnb y Alquileres Vacacionales",
    fr: "Airbnb & Locations Courtes",
    it: "Airbnb e Affitti Brevi",
    pt: "Airbnb e Aluguer de Curta Duração"
  },
  "services.airbnbRentals.desc": {
    de: "Schnelle Übergaben. Fünf-Sterne-Bewertungen. Null Stress.",
    en: "Fast turnovers. Five-star reviews. Zero stress.",
    es: "Rotaciones rápidas. Reseñas de cinco estrellas. Cero estrés.",
    fr: "Rotations rapides. Avis cinq étoiles. Zéro stress.",
    it: "Turnover rapidi. Recensioni a cinque stelle. Zero stress.",
    pt: "Rotatividades rápidas. Avaliações cinco estrelas. Zero stress."
  },
  "services.airbnbRentals.marketingDesc": {
    de: "Wir maximieren Ihre Belegung und Bewertungen durch makellose Sauberkeit bei jedem Gästewechsel. Pünktliche Reinigung, professionelle Wäschepflege und gründliche Kontrolle vor dem nächsten Check-in.",
    en: "We maximize your occupancy and five-star reviews through flawless cleanliness during guest turnovers. Punctual cleaning, high-standard linen care, and rigorous inspection before checkout.",
    es: "Maximizamos su ocupación y las calificaciones de cinco estrellas mediante una limpieza impecable en cada cambio de huéspedes. Limpieza puntual, cuidado profesional de blancos e inspección estricta antes del check-in."
  },
  "services.turnoverCleaning.title": {
    de: "Limpieza de rotación (Turnover)",
    en: "Turnover Cleaning",
    es: "Limpieza de Rotación",
    fr: "Nettoyage de Rotation",
    it: "Pulizia di Cambio",
    pt: "Limpeza de Rotatividade"
  },
  "services.turnoverCleaning.desc": {
    de: "Schnelle, professionelle Reinigungen für einen reibungslosen Gästewechsel.",
    en: "Fast, professional turnover cleaning for smooth guest transitions.",
    es: "Limpieza de rotación profesional para un cambio de huéspedes sin problemas.",
    fr: "Nettoyage de rotation rapide et professionnel.",
    it: "Pulizie rapide ed efficienti per cambi inquilini e ospiti.",
    pt: "Limpezas rápidas e profissionais para rotação de hóspedes."
  },
  "services.turnoverCleaning.marketingDesc": {
    de: "Unser Service für die Rotationsreinigung stellt sicher, dass Ihre Ferienwohnungen und Airbnb-Objekte zwischen den Buchungen in Rekordzeit blitzblank gereinigt werden. Inklusive Auffüllung von Verbrauchsmaterialien.",
    en: "Our turnover cleaning service ensures that your vacation rentals and short-term properties are sparkling clean in record time between bookings. Includes restocking of essential supplies.",
    es: "Nuestro servicio de limpieza de rotación asegura que sus propiedades de alquiler vacacional estén impecables en tiempo récord entre reservas. Incluye reposición de insumos esenciales."
  },
  "services.officesCorporate.title": {
    de: "Büros & Unternehmen",
    en: "Offices & Corporate",
    es: "Oficinas y Corporativos",
    fr: "Bureaux & Entreprises",
    it: "Uffici e Aziende",
    pt: "Escritórios e Empresas"
  },
  "services.officesCorporate.desc": {
    de: "Gesunde Arbeitsplätze, die Produktivität und Eindruck steigern.",
    en: "Healthy workplaces that boost productivity and impression.",
    es: "Lugares de trabajo saludables que aumentan la productividad y mejoran la impresión.",
    fr: "Des espaces de travail sains pour booster la productivité et votre image.",
    it: "Luoghi di lavoro salubri che aumentano la produttività e l’immagine.",
    pt: "Locais de trabalho saudáveis que aumentam a produtividade e imagem."
  },
  "services.officesCorporate.marketingDesc": {
    de: "Professionelle Unterhaltsreinigung für Ihre Büro- und Geschäftsräume. Wir sorgen für ein sauberes, hygienisches Arbeitsumfeld, das das Wohlbefinden Ihrer Mitarbeiter steigert und Kunden beeindruckt.",
    en: "Professional recurring maintenance for your offices and facilities. We secure a pristine, hygienic workspace that increases employee well-being and impresses clients.",
    es: "Mantenimiento recurrente profesional para sus oficinas e instalaciones. Aseguramos un espacio de trabajo impecable e higiénico que incrementa el bienestar de sus colaboradores e impresiona a sus clientes."
  },
  "services.retailShowrooms.title": {
    de: "Detailhandel & Showrooms",
    en: "Retail & Showrooms",
    es: "Comercios y Showrooms",
    fr: "Commerces & Showrooms",
    it: "Negozi e Showroom",
    pt: "Lojas e Showrooms"
  },
  "services.retailShowrooms.desc": {
    de: "Makellose Räume, die Ihr Markenerlebnis aufwerten.",
    en: "Immaculate spaces that elevate your brand experience.",
    es: "Espacios impecables que elevan la experiencia de tu marca.",
    fr: "Des espaces immaculés qui subliment l’expérience de votre marque.",
    it: "Spazi immacolati che valorizzano l’esperienza del tuo brand.",
    pt: "Espaços impecáveis que elevam a experiência da sua marca."
  },
  "services.retailShowrooms.marketingDesc": {
    de: "Für Verkaufsflächen, Ladengeschäfte und Showrooms bieten wir eine erstklassige Reinigung zu flexiblen Zeiten (vor der Öffnung oder nach der Schliessung). Streifenfreie Schaufenster und makellose Böden.",
    en: "For boutique storefronts, shopping centers, and showrooms, we offer premium cleaning tailored to flexible times (pre-opening or post-closing). Streak-free windows and polished floors.",
    es: "Para locales boutique, centros comerciales y showrooms, ofrecemos limpieza de primera clase adaptada a horarios flexibles (antes de abrir o después del cierre). Cristales perfectos y pisos abrillantados."
  },
  "services.gastronomyRestaurants.title": {
    de: "Gastronomie & Restaurants",
    en: "Gastronomy & Restaurants",
    es: "Gastronía y Restaurantes",
    fr: "Gastronomie & Restaurants",
    it: "Gastronomia e Ristoranti",
    pt: "Gastronomia e Restaurantes"
  },
  "services.gastronomyRestaurants.desc": {
    de: "Hygiene, die Ihre Gäste und Ihren Ruf schützt.",
    en: "Hygiene that protects your guests and reputation.",
    es: "Higiene que protege a tus comensales y tu reputación.",
    fr: "Une hygiène rigoureuse pour protéger vos clients et votre réputation.",
    it: "Igiene certificata che protegge i tuoi ospiti e la tua reputazione.",
    pt: "Higiene que protege os seus clientes e a sua reputação."
  },
  "services.gastronomyRestaurants.marketingDesc": {
    de: "Gründliche Reinigung für Restaurantbereiche, Bars und Gastronomiebetriebe gemäss den anspruchsvollen Schweizer HACCP-Hygienerichtlinien. Zuverlässiger Schutz für Ihre Gäste und Ihren Ruf.",
    en: "Rigorous cleaning for restaurant floors, bars, and gastronomy establishments following the high-standard Swiss HACCP hygiene codes. Absolute protection for your guests and reputation.",
    es: "Limpieza rigurosa para comedores, barras y cocinas de restaurantes de acuerdo con las normativas suizas de higiene HACCP. Protección absoluta para sus comensales y su reputación."
  },
  "services.kitchenDeepCleaning.title": {
    de: "Küchen-Tiefenreinigung",
    en: "Kitchen Deep Cleaning",
    es: "Limpieza Profunda de Cocinas",
    fr: "Nettoyage en Profondeur Cuisine",
    it: "Pulizia Profonda Cucine",
    pt: "Limpeza Profunda de Cozinhas"
  },
  "services.kitchenDeepCleaning.desc": {
    de: "Porentiefe Reinigung von Grossküchen und Dunstabzugsanlagen nach HACCP.",
    en: "Deep cleaning of commercial kitchens and exhaust systems according to HACCP.",
    es: "Limpieza profunda de cocinas comerciales y sistemas de extracción según HACCP.",
    fr: "Nettoyage en profondeur des cuisines professionnelles selon HACCP.",
    it: "Igienizzazione profonda delle cucine professionali secondo HACCP.",
    pt: "Limpeza profunda de cozinhas profissionais de acordo com HACCP."
  },
  "services.kitchenDeepCleaning.marketingDesc": {
    de: "Spezialisierte Tiefenreinigung für Gastroküchen. Wir entfernen Fettablagerungen, reinigen Abzugshauben, desinfizieren Arbeitsflächen und säubern Grossgeräte porentief. HACCP-konform und abnahmesicher.",
    en: "Specialized deep cleaning for hospitality kitchens. We remove grease build-up, clean exhaust hoods, sanitize food prep areas, and scrub major kitchen appliances. Certified HACCP-compliant.",
    es: "Limpieza profunda especializada para cocinas comerciales. Removemos grasa incrustada, limpiamos campanas de extracción, desinfectamos superficies de preparación y limpiamos equipos grandes de cocina. Certificación HACCP."
  },
  "services.industryLogistics.title": {
    de: "Industrie & Logistik",
    en: "Industry & Logistics",
    es: "Industria y Logística",
    fr: "Industrie & Logistique",
    it: "Industria e Logistica",
    pt: "Indústria e Logística"
  },
  "services.industryLogistics.desc": {
    de: "Sichere, gesetzeskonforme und effiziente Abläufe rund um die Uhr.",
    en: "Safe, compliant and efficient operations around the clock.",
    es: "Operaciones seguras, conformes y eficientes las 24 horas.",
    fr: "Des opérations sûres, conformes et efficaces 24h/24.",
    it: "Operazioni sicure, conformi ed efficienti 24 ore su 24.",
    pt: "Operações seguras, conformes e eficientes 24 horas por dia."
  },
  "services.industryLogistics.marketingDesc": {
    de: "Industriereinigung für Hallen, Lager, Maschinenparks und Logistikzentren. Unser speziell geschultes Team arbeitet mit modernen Geräten hocheffizient und unter strengen Sicherheitsstandards (HSE).",
    en: "Industrial heavy cleaning for manufacturing halls, warehouses, machine rooms, and logistic centers. Our specifically trained staff utilizes modern equipment under rigorous safety protocols (HSE).",
    es: "Limpieza industrial pesada para naves de manufactura, almacenes, cuartos de máquinas y centros logísticos. Nuestro personal capacitado utiliza equipos modernos bajo protocolos estrictos de seguridad (HSE)."
  }
};

// Translate service keys
export function translateKey(key: string, lang: Language): string {
  const activeLang = lang === "de" ? "de" : lang;
  if (B2B_SERVICE_TRANSLATIONS[key]) {
    return B2B_SERVICE_TRANSLATIONS[key][activeLang] || B2B_SERVICE_TRANSLATIONS[key]["de"] || "";
  }
  // Safe guard translations
  if (typeof translations === "undefined" || !translations) {
    return "";
  }
  // In our i18n file, de-CH might be defined, but translations dict handles both
  const dict = translations[activeLang] || translations["de"];
  if (dict && dict[key]) {
    return dict[key];
  }
  const deDict = translations["de"] || translations["de-CH"];
  if (deDict && deDict[key]) {
    return deDict[key];
  }
  return "";
}

export function getMetadataForPath(
  pathname: string,
  langParam?: string
): {
  title: string;
  description: string;
  canonical: string;
  hreflangs: { lang: string; href: string }[];
  pageType: string;
  h1: string;
  h2: string;
  bodyText: string;
} {
  const cleanPath = pathname.split("?")[0];
  if (cleanPath === "/blog/wohnungsabgabe-zurich-perfekte-uebergabe") {
    return {
      title: `Wohnungsabgabe in Zürich: So gelingt die perfekte Übergabe | ${BRAND}`,
      description: `Erfahren Sie, wie Sie die Wohnungsabgabe in Zürich erfolgreich meistern. Tipps zu Reinigungsstandards & gesetzlichen Pflichten für Ihre Mietkaution.`,
      canonical: `${BASE_URL}${cleanPath}`,
      hreflangs: [],
      pageType: "blog-detail",
      h1: "Wohnungsabgabe in Zürich: So gelingt die perfekte Übergabe",
      h2: BRAND,
      bodyText: `Erfahren Sie, wie Sie die Wohnungsabgabe in Zürich erfolgreich meistern. Tipps zu Reinigungsstandards & gesetzlichen Pflichten für Ihre Mietkaution.`
    };
  }
  if (cleanPath === "/blog/iot-smart-facility-management-schweizer-bueros") {
    return {
      title: `IoT & Smart Facility Management: Schweizer Büros der Zukunft | ${BRAND}`,
      description: `Wie IoT-Sensoren und digitale Dashboards die Reinigung & Energieeffizienz in Schweizer Büros revolutionieren. Erfahren Sie alles über smarten Unterhalt.`,
      canonical: `${BASE_URL}${cleanPath}`,
      hreflangs: [],
      pageType: "blog-detail",
      h1: "IoT & Smart Facility Management: Schweizer Büros der Zukunft",
      h2: BRAND,
      bodyText: `Wie IoT-Sensoren und digitale Dashboards die Reinigung & Energieeffizienz in Schweizer Büros revolutionieren. Erfahren Sie alles über smarten Unterhalt.`
    };
  }

  // Determine language
  let currentLang: Language = "de";
  if (langParam) {
    const raw = langParam.toLowerCase();
    if (["en", "fr", "it", "es", "pt", "de"].includes(raw)) {
      currentLang = raw as Language;
    }
  }

  const parsed = parsePath(pathname);
  const page = parsed.page;
  const seoCityId = parsed.cityId;
  const seoServiceId = parsed.serviceId;

  let title = "";
  let description = "";
  let h1 = "";
  let h2 = "";
  let bodyText = "";

  if (page === "seo-landing" && seoCityId && seoServiceId) {
    const cName = cityMap[seoCityId.toLowerCase()]?.[currentLang] || seoCityId;
    const i18nKey = wizardToI18nService[seoServiceId.toLowerCase()] || seoServiceId;
    const sName = translateKey(`services.${i18nKey}.title`, currentLang) || seoServiceId;

    const titleTemplates: Record<string, string> = {
      de: `${sName} in ${cName} | Schweizer Meisterklasse | ${BRAND}`,
      en: `${sName} in ${cName} | Swiss Masterclass | ${BRAND}`,
      fr: `${sName} à ${cName} | Classe de Maître Suisse | ${BRAND}`,
      it: `${sName} a ${cName} | Classe Magistrale Svizzera | ${BRAND}`,
      es: `${sName} en ${cName} | Clase Maestra Suiza | ${BRAND}`,
      pt: `${sName} em ${cName} | Classe Mestre Suíça | ${BRAND}`
    };

    const descTemplates: Record<string, string> = {
      de: `Professionelle ${sName} in ${cName} mit Festpreisgarantie. Erfahrenes, versichertes Team, modernste Ausrüstung und 100% ökologische Verantwortung.`,
      en: `Professional ${sName} in ${cName} with fixed price guarantee. Experienced, insured team, state-of-the-art equipment and 100% ecological responsibility.`,
      fr: `${sName} professionnel à ${cName} avec garantie de prix fixe. Équipe expérimentée et assurée, équipement de pointe et responsabilité 100% écologique.`,
      it: `${sName} professionale a ${cName} con garanzia di prezzo fisso. Team esperto e assicurato, attrezzature all'avanguardia e responsabilità ecologica al 100%.`,
      es: `${sName} profesional en ${cName} con garantía de precio fijo. Equipo experimentado y asegurado, equipos de última generación y responsabilidad 100% ecológica.`,
      pt: `${sName} profissional em ${cName} com garantia de preço fixo. Equipa experiente e segurada, equipamentos de última geração e responsabilidade 100% ecológica.`
    };

    title = titleTemplates[currentLang] || titleTemplates["de"];
    description = descTemplates[currentLang] || descTemplates["de"];

    if (currentLang === "de") {
      let fromPrice = "";
      const mun = MUNICIPALITIES.find(m => m.slug === seoCityId.toLowerCase());
      if (mun) {
        if (seoServiceId.toLowerCase() === "end-of-tenancy") {
          fromPrice = `${mun.priceAnchors.endOfTenancyFrom}`;
        } else if (seoServiceId.toLowerCase() === "deep-cleaning") {
          fromPrice = `${mun.priceAnchors.deepCleaningFrom}`;
        }
      }
      if (!fromPrice) {
        if (seoServiceId.toLowerCase() === "end-of-tenancy") {
          fromPrice = "520";
        } else if (seoServiceId.toLowerCase() === "deep-cleaning") {
          fromPrice = "320";
        } else {
          fromPrice = seoCityId.toLowerCase() === "schaffhausen" ? "45" : seoCityId.toLowerCase() === "winterthur" ? "50" : "55";
        }
      }
      title = `${sName} ${cName} ab CHF ${fromPrice} | ${BRAND}`;
      description = `Professionelle ${sName} in ${cName} ab CHF ${fromPrice}. Mit 100% Abnahmegarantie, GAV-konformem Team & bester Ausrüstung. Jetzt Online-Preis berechnen!`;
    }

    h1 = sName;
    h2 = cName;
    bodyText = description;
  } else if (page === "region-hub" && seoCityId) {
    const regionName = seoCityId === "schaffhausen" 
      ? "Kanton Schaffhausen" 
      : seoCityId === "winterthur" 
      ? "Region Winterthur" 
      : "Region Zürich";

    title = `Reinigung & Facility Management im ${regionName} | ${BRAND}`;
    description = `Professionelle Reinigung und Facility Services im ${regionName}. GAV-konforme Teams, versichert bis CHF 10 Mio., Übergabegarantie & Sofort-Offerte.`;
    h1 = `Reinigung & Facility Management im ${regionName}`;
    h2 = BRAND;
    bodyText = description;
  } else if (page === "municipality-page" && seoCityId) {
    const mun = MUNICIPALITIES.find(m => m.slug === seoCityId);
    if (mun) {
      const plzStr = mun.plz.join(', ');
      title = `Reinigungsfirma in ${mun.name} (${plzStr}) | ${BRAND}`;
      description = `Professionelle Reinigungsfirma in ${mun.name} (${plzStr}). Umzugsreinigung mit Abnahmegarantie ab CHF ${mun.priceAnchors.endOfTenancyFrom}. GAV-konform & versichert.`;
      h1 = `Reinigungsfirma in ${mun.name}`;
      h2 = `${mun.name} (${plzStr})`;
      bodyText = description;
    } else {
      title = `Reinigungsfirma | ${BRAND}`;
      description = `Professionelle Reinigungsdienstleistungen mit Schweizer Qualitätsstandard.`;
      h1 = "Reinigungsfirma";
      h2 = BRAND;
      bodyText = description;
    }
  } else {
    const chosenMap = mapsByLang[currentLang] || {};
    const meta = chosenMap[page] || defaults[page] || defaults["home"];
    title = meta.title;
    description = meta.description;

    h1 = title.split("|")[0].trim();
    h2 = BRAND;
    bodyText = description;
  }

  // Authoritative canonical URL
  const pathWithoutQuery = pathname.split("?")[0];
  const canonical = `${BASE_URL}${pathWithoutQuery}`;

  // Multi-language hreflangs (Disabled per SEO requirements)
  const hreflangs: { lang: string; href: string }[] = [];

  return {
    title,
    description,
    canonical,
    hreflangs,
    pageType: page,
    h1,
    h2,
    bodyText
  };
}
