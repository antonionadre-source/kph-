import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import {
  BuildingIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  LeafIcon,
  WrenchScrewdriverIcon,
  CleaningBrushIcon,
  ClockIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  PaperAirplaneIcon,
  TrashIcon,
  InfoIcon,
  SparklesIcon,
  TreeIcon,
  DropIcon,
  CloudUploadIcon
} from './icons';
import { db, sanitizeFirestoreData } from './firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { withPortalTimeout } from './portalIdentity';
import { portalText } from './portalText';
import { attachmentText } from './attachmentText';
import { sendLead } from './leadWebhook';
import { uploadFilesToStorage, ensureUploadUser, validateFloorPlan } from './fileUploadHelper';

type BuildingType = 'office' | 'residential' | 'retail' | 'industrial' | 'medical';
type FrequencyType = 'daily' | 'multiple' | 'weekly' | 'biweekly' | 'monthly' | 'ondemand';

interface SelectedServices {
  dailyCleaning: boolean;
  deepCleaning: boolean;
  maintenance: boolean;
  gardening: boolean;
  gutterCare: boolean;
  wasteLogistics: boolean;
}

interface SelectedProtocols {
  ecoOnly: boolean;
  emergency: boolean;
  security: boolean;
  portal: boolean;
}

interface CommercialFormData {
  // Step 1: Buildings Profile
  buildingType: BuildingType;
  numBuildings: number;
  totalArea: number;
  // Step 2: Services
  services: SelectedServices;
  // Step 3: Freq & Protocols
  frequency: FrequencyType;
  protocols: SelectedProtocols;
  // Step 4: Contact & Region
  postalCode: string;
  city: string;
  hours: number;
  address: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  floorPlans: { name: string; size: string; rawFile: File }[];
}

const LOCALIZED = {
  en: {
    title: "Business service quote",
    subtitle: "Tell us about your properties and the services you need. Our team will review your request.",
    step: 'Step',
    of: 'of',
    back: 'Back',
    next: 'Next',
    submit: "Request a quote",
    // Steps Titles
    step1Title: 'Building Portfolio',
    step1Desc: 'Define the types and dimensions of properties under your management.',
    step2Title: 'Services & Operations',
    step2Desc: 'Select what services Kraken should automate for your buildings.',
    step3Title: 'Frequency & Standards',
    step3Desc: 'Specify schedule frequency and pick optional high-compliance protocols.',
    step4Title: 'Region & Contact',
    step4Desc: 'Input location and corporate coordinates to finalize calculations.',
    // Step 1 Labels
    buildingTypeLabel: 'Primary Facility Type',
    buildingTypeDesc: 'Choose the predominant profile of your building portfolio',
    numBuildingsLabel: 'Number of Managed Buildings',
    areaLabel: 'Estimated Total Area',
    // Building Types
    office: 'Office Buildings',
    residential: 'Apartment Complexes',
    retail: 'Retail & Commercial Parks',
    industrial: 'Logistics & Industrial Warehouses',
    medical: 'Medical, Public & Educational Centres',
    // Step 2 Labels
    serviceDaily: 'Regular / Daily Cleaning',
    serviceDailyDesc: 'Workspaces disinfection, lobbies, kitchens, trash logistics and continuous freshness.',
    serviceDeep: 'Deep / Facade & Window Cleaning',
    serviceDeepDesc: 'Post-construction clearing, structural glass wash, and seasonal deep restoration.',
    serviceMaintenance: 'Facility Maintenance & Technical Support',
    serviceMaintenanceDesc: 'Technical checks, minor repairs, handyman hours, key security, and lighting care.',
    serviceGardening: 'Landscape & Green Area Management',
    serviceGardeningDesc: 'Lawn trimming, courtyard care, hedge clipping, dry leaf collection, and weed removal.',
    serviceGutter: 'Gutter, Roof & Structural Care',
    serviceGutterDesc: 'Obstruction clearing, water safety checks, drainage flushing, and protective filters.',
    serviceWaste: 'Waste Operations & Commercial Recycling',
    serviceWasteDesc: 'Cardboard bale management, pallet recycling, skip scheduling, and continuous hygiene.',
    // Step 3 Labels
    freqLabel: 'Frequency of Maintenance Visits',
    freqDaily: 'Daily (Mon - Fri)',
    freqMultiple: '3x per week',
    freqWeekly: 'Weekly',
    freqBiweekly: 'Bi-weekly (Fortnightly)',
    freqMonthly: 'Monthly Scheduled Maintenance',
    freqOndemand: 'On-Demand / Flexible Service List',
    additionalProtocols: "Service preferences",
    protocolEco: "Cleaning product preferences",
    protocolEcoDesc: "Tell us about the products or materials required at your premises.",
    protocolEmergency: "Urgent service needs",
    protocolEmergencyDesc: "Urgent work is subject to team availability and confirmation.",
    protocolSecurity: "Access and security requirements",
    protocolSecurityDesc: "Specify the access controls and site requirements to discuss.",
    protocolPortal: "Issue reporting and key handover",
    protocolPortalDesc: "Agree the reporting channel and handling of keys with the team.",
    // Step 4 Labels
    postalCodeLabel: 'Postal Code (Swiss Code)',
    postalCodePlaceholder: 'e.g., 8200',
    companyLabel: 'Enterprise Name',
    companyPlaceholder: 'e.g., Swiss Property Holding AG',
    contactLabel: 'Facility Manager / Contact Person',
    contactPlaceholder: 'e.g., Peter Keller',
    emailLabel: 'Corporate Email Address',
    emailPlaceholder: 'e.g., pkeller@domain.ch',
    phoneLabel: 'Direct Business Telephone',
    phonePlaceholder: 'e.g., 052 624 00 00',
    // Summary Labels
    estRangeTitle: "Budget estimate",
    estSub: "An indicative budget based on the details entered.",
    perMonth: 'Monthly Average Estimated Budget',
    perYear: 'Annual Value Guideline',
    disclaimer: "This estimate is a guide. The team will review scope, availability and conditions before confirming an offer.",
    ctaSubmitText: 'Request binding proposal',
    // Region outputs
    regionBase: "Region",
    regionSH: "Schaffhausen",
    regionZH: "Zürich",
    regionWT: "Winterthur",
    regionOther: "Other areas",
    // Success View
    successHeading: 'Enterprise Request Compiled! ⚡',
    successSub: 'We will design your customized technical proposal within 24 hours.',
    successRec: 'Specifications Received:',
    successCard1: 'A dedicated commercial account manager will contact you for a technical site walk.',
    successCard2: 'Your pricing, insurance certificates, and operational guarantees will be sent securely by email.',
    backToHome: 'Return to Main Dashboard',

    cityLabel: "City",
    hoursLabel: "Hours of service per week",
    addressLabel: "Service address",
    plansLabel: "Floor plans (optional)",
    plansDrop: "Choose or drop files here",
  },
  es: {
    title: "Presupuesto para empresas",
    subtitle: "Cuéntanos qué inmuebles gestionas y qué servicios necesitas. El equipo revisará tu solicitud.",
    step: 'Paso',
    of: 'de',
    back: 'Atrás',
    next: 'Siguiente',
    submit: "Solicitar presupuesto",
    step1Title: 'Cartera de Edificios',
    step1Desc: 'Defina los tipos y dimensiones de las propiedades bajo su gestión.',
    step2Title: 'Servicios y Operaciones',
    step2Desc: 'Seleccione las soluciones que Kraken debe automatizar para sus edificios.',
    step3Title: 'Frecuencia y Estándares',
    step3Desc: 'Especifique la frecuencia del calendario de visitas y protocolos de compliance.',
    step4Title: 'Región y Contacto',
    step4Desc: 'Introduzca la ubicación y coordenadas corporativas para afinar el presupuesto.',
    buildingTypeLabel: 'Tipo de Instalaje Principal',
    buildingTypeDesc: 'Elija el perfil predominante de sus inmuebles',
    numBuildingsLabel: 'Número de Edificios Gestionados',
    areaLabel: 'Superficie Total Estimada',
    office: 'Edificios de Oficinas',
    residential: 'Complejos Residenciales / Comunidades',
    retail: 'Comercio o Parques de Tiendas',
    industrial: 'Naves Logísticas e Industriales',
    medical: 'Centros Médicos, Públicos y Educativos',
    serviceDaily: 'Limpieza Regular / Diaria',
    serviceDailyDesc: 'Desinfección de despachos, vestíbulos, cocinas, retirada de residuos y frescura continua.',
    serviceDeep: 'Limpieza a Fondo, Ventanas y Fachadas',
    serviceDeepDesc: 'Fin de obra, limpieza profunda estacional, y cristales en altura.',
    serviceMaintenance: 'Mantenimiento Técnico y Facility Support',
    serviceMaintenanceDesc: 'Pequeñas reparaciones, control de luces, bombillas, llaves e inspecciones de seguridad.',
    serviceGardening: 'Cuidado de Jardines y Áreas Verdes',
    serviceGardeningDesc: 'Corte de césped, poda de setos, retirada de hojas secas y deshierbe.',
    serviceGutter: 'Mantenimiento de Tejado y Canaletas',
    serviceGutterDesc: 'Desatasco de bajantes, retirada de lodo, y colocación de filtros protectores.',
    serviceWaste: 'Logística de Basuras y Reciclaje Comercial',
    serviceWasteDesc: 'Prensado de cartones, reciclaje automatizado, cuidado de cubos e higiene en zonas de desecho.',
    freqLabel: 'Frecuencia de las Visitas de Servicio',
    freqDaily: 'Diario (Lunes a Viernes)',
    freqMultiple: '3 veces por semana',
    freqWeekly: 'Semanal',
    freqBiweekly: 'Quincenal (Cada 2 semanas)',
    freqMonthly: 'Plan Mensual Programado',
    freqOndemand: 'Bajo demanda / Lista de servicios flexible',
    additionalProtocols: "Preferencias del servicio",
    protocolEco: "Preferencias de productos de limpieza",
    protocolEcoDesc: "Indica los productos o materiales que requiere tu inmueble.",
    protocolEmergency: "Necesidades de atención urgente",
    protocolEmergencyDesc: "Los trabajos urgentes están sujetos a disponibilidad y confirmación del equipo.",
    protocolSecurity: "Requisitos de acceso y seguridad",
    protocolSecurityDesc: "Indica los controles de acceso y requisitos que debemos revisar.",
    protocolPortal: "Comunicación de incidencias y llaves",
    protocolPortalDesc: "Acuerda con el equipo el canal de comunicación y la entrega de llaves.",
    postalCodeLabel: 'Código Postal (CH)',
    postalCodePlaceholder: 'ej., 8200',
    companyLabel: 'Nombre de la Empresa',
    companyPlaceholder: 'ej., Swiss Property Holding AG',
    contactLabel: 'Facility Manager / Persona de Contacto',
    contactPlaceholder: 'ej., Peter Keller',
    emailLabel: 'Correo Electrónico Corporativo',
    emailPlaceholder: 'ej., pkeller@domain.ch',
    phoneLabel: 'Teléfono Directo de la Empresa',
    phonePlaceholder: 'ej., 052 624 00 00',
    estRangeTitle: "Presupuesto orientativo",
    estSub: "Presupuesto orientativo según los datos introducidos.",
    perMonth: 'Presupuesto Promedio Mensual Estimado',
    perYear: 'Valor de Contrato Anual Estimado',
    disclaimer: "Esta estimación es orientativa. El equipo revisará alcance, disponibilidad y condiciones antes de confirmar una oferta.",
    ctaSubmitText: 'Solicitar contrato de servicio formal',
    regionBase: "Región",
    regionSH: "Schaffhausen",
    regionZH: "Zürich",
    regionWT: "Winterthur",
    regionOther: "Otras localidades",
    successHeading: '¡Solicitud Corporativa Procesada! ⚡',
    successSub: 'Diseñaremos su propuesta de contrato detallada en un plazo de 24 horas.',
    successRec: 'Ficha Técnica Recibida:',
    successCard1: 'Un gestor de cuentas corporativas se comunicará con usted para la visita técnica.',
    successCard2: 'Sus pólizas de seguros civiles, certificados de personal de Kraken y tarifas fijadas se enviarán formalmente.',
    backToHome: 'Volver al Inicio',

    cityLabel: "Localidad",
    hoursLabel: "Horas de servicio por semana",
    addressLabel: "Dirección del servicio",
    plansLabel: "Planos (opcional)",
    plansDrop: "Elige o arrastra archivos aquí",
  },
  de: {
    title: "Offerte für Unternehmen",
    subtitle: "Beschreiben Sie Ihre Liegenschaften und den gewünschten Service. Unser Team prüft Ihre Anfrage.",
    step: 'Schritt',
    of: 'von',
    back: 'Zurück',
    next: 'Weiter',
    submit: "Offerte anfragen",
    step1Title: 'Gebäude-Portfolio',
    step1Desc: 'Eigenschaften und Flächen der von Ihnen verwalteten Liegenschaften.',
    step2Title: 'Dienstleistungen & Betrieb',
    step2Desc: 'Wählen Sie, welche Arbeiten Kraken für Ihre Gebäude automatisieren soll.',
    step3Title: 'Häufigkeit & Standards',
    step3Desc: 'Spezifizieren Sie Besuchshäufigkeiten und regulatorische Zusatzprotokolle.',
    step4Title: 'Region & Kontakt',
    step4Desc: 'Tragen Sie die Kontaktdaten ein, um die Offerte zu finalisieren.',
    buildingTypeLabel: 'Haupteigenschaftstyp',
    buildingTypeDesc: 'Wählen Sie das primäre Profil Ihrer Liegenschaften',
    numBuildingsLabel: 'Anzahl verwalteter Gebäude',
    areaLabel: 'Geschätzte Gesamtfläche',
    office: 'Bürogebäude / Verwaltungen',
    residential: 'Wohnkomplexe / Überbauungen',
    retail: 'Detailhandel & Einkaufszentren',
    industrial: 'Logistik- & Industriehallen',
    medical: 'Praxis- & Bildungszentren',
    serviceDaily: 'Regelmässige Unterhaltsreinigung',
    serviceDailyDesc: 'Arbeitsplatzreinigung, Lobbys, Küchenbereich, Abfalltrennung und makellose Hygiene.',
    serviceDeep: 'Tiefen-, Glas- & Fassadenreinigung',
    serviceDeepDesc: 'Bauendreinigung, professionelle Glasreinigung in der Höhe, saisonaler Grundschutz.',
    serviceMaintenance: 'Liegenschaftspflege & Technischer Dienst',
    serviceMaintenanceDesc: 'Instandhaltungen, technische Kontrolle, Glühbirnenwechsel, Handwerkerstunden und Schlüsselwartung.',
    serviceGardening: 'Garten- & Aussenanlagepflege',
    serviceGardeningDesc: 'Rasenmähen, Hecken schneiden, Laubbeseitigung, Gartenunterhalt und Unkrautentfernung.',
    serviceGutter: 'Dachrinnen- & Abflusswartung',
    serviceGutterDesc: 'Entfernen von Laub, Prüfung der Abflüsse, Spülung der Leitungen, Laubschutzgitter.',
    serviceWaste: 'Abfall-Logistik & Entsorgungsdienst',
    serviceWasteDesc: 'Kartonagen pressen, Gewerberecycling-Zyklen, Reinigung der Depots, Seuchenhygiene.',
    freqLabel: 'Häufigkeit der Reinigungstermine',
    freqDaily: 'Täglich (Mo - Fr)',
    freqMultiple: '3x pro Woche',
    freqWeekly: 'Wöchentlich',
    freqBiweekly: 'Zweiwöchentlich',
    freqMonthly: 'Monatlicher Hauptservice',
    freqOndemand: 'Auf Anfrage / Flexibler Dienstleistungskatalog',
    additionalProtocols: "Servicewünsche",
    protocolEco: "Wünsche zu Reinigungsmitteln",
    protocolEcoDesc: "Nennen Sie die vor Ort gewünschten Produkte oder Materialien.",
    protocolEmergency: "Dringender Servicebedarf",
    protocolEmergencyDesc: "Dringende Arbeiten benötigen eine Verfügbarkeitsprüfung und Bestätigung des Teams.",
    protocolSecurity: "Zutritts- und Sicherheitsanforderungen",
    protocolSecurityDesc: "Beschreiben Sie die zu besprechenden Zutrittskontrollen und Objektanforderungen.",
    protocolPortal: "Meldungen und Schlüsselübergabe",
    protocolPortalDesc: "Vereinbaren Sie Meldeweg und Schlüsselübergabe mit dem Team.",
    postalCodeLabel: 'Postleitzahl (Schweizer PLZ)',
    postalCodePlaceholder: 'z.B., 8200',
    companyLabel: 'Firmenname (Unternehmung)',
    companyPlaceholder: 'z.B., Swiss Property Holding AG',
    contactLabel: 'Objektleiter / Name des Partners',
    contactPlaceholder: 'z.B., Peter Keller',
    emailLabel: 'Geschäftliche E-Mail-Adresse',
    emailPlaceholder: 'z.B., pkeller@domain.ch',
    phoneLabel: 'Direkte Telefonnummer',
    phonePlaceholder: 'z.B., 052 624 00 00',
    estRangeTitle: "Richtbudget",
    estSub: "Ein Richtbudget auf Grundlage Ihrer Angaben.",
    perMonth: 'Geschätztes monatliches Budget',
    perYear: 'Geschätzter Jahresvertragswert',
    disclaimer: "Diese Schätzung dient der Orientierung. Das Team prüft Umfang, Verfügbarkeit und Bedingungen vor einer verbindlichen Offerte.",
    ctaSubmitText: 'Liegenschafts-Kalkulation anfordern',
    regionBase: "Region",
    regionSH: "Schaffhausen",
    regionZH: "Zürich",
    regionWT: "Winterthur",
    regionOther: "Weitere Orte",
    successHeading: 'Gewerbliche Offertenanfrage empfangen! ⚡',
    successSub: 'Wir konzipieren Ihr massgeschneidertes Angebot innerhalb von 24 Stunden.',
    successRec: 'Erhaltene Liegenschaftsdaten:',
    successCard1: 'Ein Senior-Projektleiter kontaktiert Sie umgehend für einen Vor-Ort-Termin.',
    successCard2: 'Sämtliche Versicherungsnachweise und Detailkonditionen erhalten Sie direkt per E-Mail.',
    backToHome: 'Zurück zur Startseite',

    cityLabel: "Ort",
    hoursLabel: "Servicestunden pro Woche",
    addressLabel: "Objektadresse",
    plansLabel: "Grundrisse (optional)",
    plansDrop: "Dateien auswählen oder hier ablegen",
  },
  fr: {
    title: "Devis pour les entreprises",
    subtitle: "Présentez vos bâtiments et les services souhaités. Notre équipe examinera votre demande.",
    step: 'Étape',
    of: 'sur',
    back: 'Retour',
    next: 'Suivant',
    submit: "Demander un devis",
    step1Title: 'Profil du Portefeuille',
    step1Desc: 'Renseignez les types et dimensions de vos bâtiments gérés.',
    step2Title: 'Prestations & Opérations',
    step2Desc: 'Sélectionnez les interventions automatisées par Kraken pour vos sites.',
    step3Title: 'Fréquence & Exigences',
    step3Desc: 'Établissez la cadence des visites et des options de conformité.',
    step4Title: 'Région & Facturation',
    step4Desc: 'Fournissez votre adresse et coordonnées d’entreprise pour le calcul.',
    buildingTypeLabel: 'Type principal d’immeuble',
    buildingTypeDesc: 'Définissez la structure principale de votre parc immobilier',
    numBuildingsLabel: 'Nombre d’immeubles sous mandat',
    areaLabel: 'Superficie de plancher estimée',
    office: 'Immeubles de bureaux / Tertiaire',
    residential: 'Résidences collectives / Copropriétés',
    retail: 'Commerces ou Zones commerciales',
    industrial: 'Halles industrielles ou logistiques',
    medical: 'Centres de santé, publics ou scolaires',
    serviceDaily: 'Nettoyage régulier / Quotidien',
    serviceDailyDesc: 'Postes de travail, sanitaires, halls d’entrée, réassort consommables, cuisine saine.',
    serviceDeep: 'Lavage de vitres, vitrages & façades',
    serviceDeepDesc: 'Fin de bail, nettoyage après travaux, vitrages en hauteur et restauration de l’enveloppe.',
    serviceMaintenance: 'Conciergerie technique & Maintenance',
    serviceMaintenanceDesc: 'Menues réparations, maintenance d’installations, gestion des accès, lampadaires.',
    serviceGardening: 'Espaces verts & extérieurs',
    serviceGardeningDesc: 'Tonte de gazons, entretien d’arbustes, taille de haies, ramassage de détritus et feuilles.',
    serviceGutter: 'Nettoyage de gouttières & Evacuations',
    serviceGutterDesc: 'Débouchage de chenaux, vidange de bouches d’égout, garde-feuilles et étanchéité.',
    serviceWaste: 'Logistique des ordures & recyclage',
    serviceWasteDesc: 'Tri industriel, compactage papier, bennes d’évacuation et propreté des locaux poubelles.',
    freqLabel: 'Fréquence des interventions sur site',
    freqDaily: 'Quotidien (Lundi à Vendredi)',
    freqMultiple: '3 fois par semaine',
    freqWeekly: 'Hebdomadaire',
    freqBiweekly: 'Bimensuel (Toutes les deux semaines)',
    freqMonthly: 'Mensuel programmé d’office',
    freqOndemand: 'Déclenchement sur demande / Flexible',
    additionalProtocols: "Préférences du service",
    protocolEco: "Préférences de produits de nettoyage",
    protocolEcoDesc: "Précisez les produits ou matériaux nécessaires sur votre site.",
    protocolEmergency: "Besoins urgents",
    protocolEmergencyDesc: "Les interventions urgentes dépendent des disponibilités et de la confirmation de l’équipe.",
    protocolSecurity: "Accès et sécurité",
    protocolSecurityDesc: "Précisez les contrôles d’accès et les exigences du site à examiner.",
    protocolPortal: "Signalements et remise des clés",
    protocolPortalDesc: "Convenez avec l’équipe du canal de signalement et de la remise des clés.",
    postalCodeLabel: 'Code Postal (CH)',
    postalCodePlaceholder: 'ex., 8200',
    companyLabel: 'Nom de l’entreprise',
    companyPlaceholder: 'ex., Swiss Property Holding AG',
    contactLabel: 'Nom du gérant, gestionnaire ou FM',
    contactPlaceholder: 'ex., Peter Keller',
    emailLabel: 'Adresse E-mail professionnelle',
    emailPlaceholder: 'ex., pkeller@domain.ch',
    phoneLabel: 'Téléphone direct bureau',
    phonePlaceholder: 'ex., 052 624 00 00',
    estRangeTitle: "Budget indicatif",
    estSub: "Un budget indicatif selon les informations saisies.",
    perMonth: 'Budget moyen mensuel estimé',
    perYear: 'Valeur de contrat annuel estimé',
    disclaimer: "Cette estimation est indicative. L’équipe vérifiera les prestations, les disponibilités et les conditions avant de confirmer une offre.",
    ctaSubmitText: 'Transmettre la demande de devis',
    regionBase: "Région",
    regionSH: "Schaffhausen",
    regionZH: "Zürich",
    regionWT: "Winterthur",
    regionOther: "Autres localités",
    successHeading: 'Demande de contrat entreprise reçue ! ⚡',
    successSub: 'Nous allons finaliser vos études techniques sous 24 heures ouvrées.',
    successRec: 'Spécifications de parc :',
    successCard1: 'Un chef de projet technique prendra rendez-vous avec vous pour la reconnaissance du site.',
    successCard2: 'Sont joints à votre offre finale nos attestations de RC professionnelle et accréditations.',
    backToHome: 'Retourner au Tableau de Bord',

    cityLabel: "Localité",
    hoursLabel: "Heures de service par semaine",
    addressLabel: "Adresse du site",
    plansLabel: "Plans (facultatif)",
    plansDrop: "Choisissez ou déposez des fichiers ici",
  },
  it: {
    title: "Preventivo per aziende",
    subtitle: "Descrivi gli immobili e i servizi necessari. Il team esaminerà la tua richiesta.",
    step: 'Passo',
    of: 'di',
    back: 'Indietro',
    next: 'Avanti',
    submit: "Richiedi un preventivo",
    step1Title: 'Parco Edifici',
    step1Desc: 'Definisci la consistenza e l’estensione del parco immobiliare gestito.',
    step2Title: 'Operazioni & Servizi',
    step2Desc: 'Scegli i servizi che Kraken deve pianificare per la tua struttura.',
    step3Title: 'Frequenza & Standard',
    step3Desc: 'Seleziona i cicli orari dei dipendenti e standard operativi d’elite.',
    step4Title: 'Sede & Contatto',
    step4Desc: 'Inserisci indirizzo e recapiti legali aziendali per calcolare le rotte.',
    buildingTypeLabel: 'Tipologia di Stabile',
    buildingTypeDesc: 'Seleziona lo scopo d’uso primario del portafoglio',
    numBuildingsLabel: 'Numero di Stabili',
    areaLabel: 'Superficie Totale Pavimentata',
    office: 'Palazzi Uffici / Direzionali',
    residential: 'Complessi Residenziali / Condomini',
    retail: 'Grandi Negozi / Centri Commerciali',
    industrial: 'Poli Logistici e Industriali',
    medical: 'Centri Medici, Istituti Scolastici',
    serviceDaily: 'Pulizie Ordinarie / Giornaliere',
    serviceDailyDesc: 'Igienizzazione postazioni di lavoro, aree comuni, bagni, gestione dei cestini.',
    serviceDeep: 'Pulizie di Fondo e Manutenzione Facciate',
    serviceDeepDesc: 'Trattamenti post-cantiere, lavaggio vetrate complesse e facciate continue.',
    serviceMaintenance: 'Custodia, Conciergerie e Manutenzioni',
    serviceMaintenanceDesc: 'Controllo impianti, sostituzione lampadine, servizi di falegnameria, piccole riparazioni.',
    serviceGardening: 'Gestione Spazi Verdi ed Esterni',
    serviceGardeningDesc: 'Sfalcio prati, potatura siepi, raccolta foglie secche, diserbo ecologico.',
    serviceGutter: 'Ispezione e Pulizia Lattonerie / Grondaie',
    serviceGutterDesc: 'Rimozione detriti, lavaggio pluviali, posa di reti parafoglie e barriere acqua.',
    serviceWaste: 'Logistica dello Smaltimento rifiuti',
    serviceWasteDesc: 'Movimentazione bidoni, pressatura cartone pesante, tracciamento conferimenti.',
    freqLabel: 'Frequenza dell’Intervento di Pulizia',
    freqDaily: 'Quotidianamente (Lun - Ven)',
    freqMultiple: '3 volte alla settimana',
    freqWeekly: 'Settimanalmente',
    freqBiweekly: 'Bisettimanale (Ogni 2 settimane)',
    freqMonthly: 'Intervento programmato mensile',
    freqOndemand: 'Chiamate SPOT su richiesta',
    additionalProtocols: "Preferenze del servizio",
    protocolEco: "Preferenze sui prodotti di pulizia",
    protocolEcoDesc: "Indica i prodotti o i materiali richiesti nell’immobile.",
    protocolEmergency: "Esigenze urgenti",
    protocolEmergencyDesc: "Gli interventi urgenti dipendono dalla disponibilità e dalla conferma del team.",
    protocolSecurity: "Accesso e sicurezza",
    protocolSecurityDesc: "Indica i controlli di accesso e i requisiti da esaminare.",
    protocolPortal: "Segnalazioni e consegna delle chiavi",
    protocolPortalDesc: "Concorda con il team il canale di segnalazione e la consegna delle chiavi.",
    postalCodeLabel: 'Codice di Avviamento Postale (CH)',
    postalCodePlaceholder: 'es., 8200',
    companyLabel: 'Denominazione Sociale Azienda',
    companyPlaceholder: 'es., Swiss Property Holding AG',
    contactLabel: 'Responsabile dei Servizi / Referente',
    contactPlaceholder: 'es., Peter Keller',
    emailLabel: 'Email Aziendale Nominativa',
    emailPlaceholder: 'es., pkeller@domain.ch',
    phoneLabel: 'Telefono Ufficio Direzione',
    phonePlaceholder: 'es., 052 624 00 00',
    estRangeTitle: "Budget indicativo",
    estSub: "Un budget indicativo basato sui dati inseriti.",
    perMonth: 'Canone Mensile Medio Stimato',
    perYear: 'Canone Annuo Stimato',
    disclaimer: "Questa stima è indicativa. Il team verificherà prestazioni, disponibilità e condizioni prima di confermare un’offerta.",
    ctaSubmitText: 'Richiedi contratto di servizio',
    regionBase: "Regione",
    regionSH: "Schaffhausen",
    regionZH: "Zürich",
    regionWT: "Winterthur",
    regionOther: "Altre località",
    successHeading: 'Richiesta di offerta per stabili inviata! ⚡',
    successSub: 'Elaboreremo le vostre specifiche entro 24 ore lavorative.',
    successRec: 'Riepilogo Parametri di Proprietà:',
    successCard1: 'Il nostro responsabile di zona prenderà contatto per impostare lo studio tecnico dei metri quadri.',
    successCard2: 'Riceverà per email le quotazioni finali, licenze di esercizio e scheda tecnica Kraken.',
    backToHome: 'Torna alla Schermata Home',

    cityLabel: "Località",
    hoursLabel: "Ore di servizio a settimana",
    addressLabel: "Indirizzo del servizio",
    plansLabel: "Planimetrie (facoltativo)",
    plansDrop: "Scegli o trascina qui i file",
  },
  pt: {
    title: "Orçamento para empresas",
    subtitle: "Descreva os imóveis e os serviços necessários. A equipa analisará o seu pedido.",
    step: 'Passo',
    of: 'de',
    back: 'Voltar',
    next: 'Avançar',
    submit: "Pedir orçamento",
    step1Title: 'Portfólio de Edifícios',
    step1Desc: 'Indique os tipos e dimensões globais das propriedades sob a sua gestão.',
    step2Title: 'Serviços e Atividades',
    step2Desc: 'Marque as categorias de manutenção que a Kraken deve garantir no local.',
    step3Title: 'Periodicidade e Compliance',
    step3Desc: 'Regule a frequência de visitas e ative normas especiais de funcionamento.',
    step4Title: 'Localização e Contacto',
    step4Desc: 'Informe a sede empresarial e dados para o planeamento de rotas.',
    buildingTypeLabel: 'Tipo de Edifício Principal',
    buildingTypeDesc: 'Perfil predominante do parque imobiliário',
    numBuildingsLabel: 'Volume de Prédios',
    areaLabel: 'Área Operativa Total (m²)',
    office: 'Edifícios Administrativos / Escritórios',
    residential: 'Blocos Residenciais / Condomínios',
    retail: 'Comércio / Lojas de Conveniência',
    industrial: 'Armazéns Logísticos e Centros de Distribuição',
    medical: 'Clínicas, Hospitais ou Escolas',
    serviceDaily: 'Limpeza Diária Profissional',
    serviceDailyDesc: 'Limpeza de mesas, higienização de refeitórios, manutenção de áreas comuns, controlo de resíduos.',
    serviceDeep: 'Limpeza de Fachadas, Superfícies e Vidros',
    serviceDeepDesc: 'Pós-obra especializado, tratamento de fachadas, janelas suspensas e vidros planos.',
    serviceMaintenance: 'Zelador Técnico e Suporte Geral',
    serviceMaintenanceDesc: 'Reparações pontuais de bricolagem, controlo de fechaduras, vigilância de lâmpadas.',
    serviceGardening: 'Jardinagem e Áreas Exteriores',
    serviceGardeningDesc: 'Poda de relva, manutenção de jardins, limpeza de ramos secos, sacha ecológica.',
    serviceGutter: 'Inspeção e Limpeza de Algerozes e Calhas',
    serviceGutterDesc: 'Desobstrução de descargas, lavagem de tubagens, redes de proteção anti-folhas.',
    serviceWaste: 'Logística de Resíduos Industriais',
    serviceWasteDesc: 'Gestão de caixotes de lixo, compactação de cartão, arrumação de depósitos exteriores.',
    freqLabel: 'Cadência dos Turnos de Operários',
    freqDaily: 'Diariamente (Segunda a Sexta)',
    freqMultiple: '3 vezes por semana',
    freqWeekly: 'Semanalmente',
    freqBiweekly: 'Quinzenalmente (A cada 2 semanas)',
    freqMonthly: 'Intervenção Mensal Completa',
    freqOndemand: 'Dotações sob pedido informal / Flexible',
    additionalProtocols: "Preferências do serviço",
    protocolEco: "Preferências de produtos de limpeza",
    protocolEcoDesc: "Indique os produtos ou materiais necessários no imóvel.",
    protocolEmergency: "Necessidades urgentes",
    protocolEmergencyDesc: "Os trabalhos urgentes dependem da disponibilidade e confirmação da equipa.",
    protocolSecurity: "Acesso e segurança",
    protocolSecurityDesc: "Indique os controlos de acesso e requisitos a analisar.",
    protocolPortal: "Comunicação de ocorrências e chaves",
    protocolPortalDesc: "Combine com a equipa o canal de comunicação e a entrega de chaves.",
    postalCodeLabel: 'Código Postal Suíço',
    postalCodePlaceholder: 'Ex: 8200',
    companyLabel: 'Identificação Social da Sociedade',
    companyPlaceholder: 'Ex: Swiss Property Holding AG',
    contactLabel: 'Gestor do Contrato / Responsável',
    contactPlaceholder: 'Ex: Peter Keller',
    emailLabel: 'Endereço de E-mail Corporativo',
    emailPlaceholder: 'Ex: pkeller@domain.ch',
    phoneLabel: 'Telefone Profissional Direto',
    phonePlaceholder: 'Ex: 052 624 00 00',
    estRangeTitle: "Orçamento indicativo",
    estSub: "Um orçamento indicativo com base nos dados introduzidos.",
    perMonth: 'Custo de Manutenção Mensal Estimado',
    perYear: 'Volume Contratual no Ano',
    disclaimer: "Esta estimativa é indicativa. A equipa analisará o âmbito, a disponibilidade e as condições antes de confirmar uma proposta.",
    ctaSubmitText: 'Solicitar contrato técnico formal',
    regionBase: "Região",
    regionSH: "Schaffhausen",
    regionZH: "Zürich",
    regionWT: "Winterthur",
    regionOther: "Outras localidades",
    successHeading: 'Pedido Técnico B2B Agendado! ⚡',
    successSub: 'Concluiremos a sua proposta formal e custos de adjudicação em 24 horas.',
    successRec: 'Ficha Resumo dos Edifícios :',
    successCard1: 'Um gestor sénior entrará em contacto direto para as medições técnicas de área.',
    successCard2: 'Os pacotes de preços finais, coberturas de responsabilidade civil e apólices serão enviados no orçamento.',
    backToHome: 'Voltar ao Ecrã Inicial',

    cityLabel: "Localidade",
    hoursLabel: "Horas de serviço por semana",
    addressLabel: "Morada do serviço",
    plansLabel: "Plantas (opcional)",
    plansDrop: "Escolha ou arraste ficheiros para aqui",
  }
};

interface ZoneInfo {
  zone: 'schaffhausen' | 'winterthur' | 'zurich' | 'other';
  label: string;
  multiplier: number;
}

const getZoneByPostalCode = (pcStr: string): ZoneInfo => {
  const cleanPc = pcStr.trim().replace(/\s/g, '');
  const n = parseInt(cleanPc, 10);
  if (isNaN(n)) return { zone: 'other', label: 'Other region', multiplier: 1.08 };

  if (n >= 8200 && n <= 8239) return { zone: 'schaffhausen', label: 'Schaffhausen Core', multiplier: 1.0 };
  if (n >= 8400 && n <= 8416) return { zone: 'winterthur', label: 'Winterthur District', multiplier: 1.12 };
  if (n >= 8000 && n <= 8099) return { zone: 'zurich', label: 'Zürich Metro', multiplier: 1.22 };
  if (n >= 8100 && n <= 8199) return { zone: 'zurich', label: 'Zürich Metro', multiplier: 1.22 };
  if (n >= 8300 && n <= 8399) return { zone: 'zurich', label: 'Zürich Metro', multiplier: 1.22 };
  if (n >= 8600 && n <= 8699) return { zone: 'zurich', label: 'Zürich Metro', multiplier: 1.22 };

  return { zone: 'other', label: 'Other', multiplier: 1.08 };
};

interface CommercialQuotePageProps {
  onNavigate: (page: string) => void;
}

const CommercialQuotePage: React.FC<CommercialQuotePageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();

  // Resolve localized text strings
  const activeLang = language === 'de-CH' ? 'de' : (LOCALIZED[language as 'en' | 'es' | 'de' | 'fr' | 'it' | 'pt'] ? language : 'en') as 'en' | 'es' | 'de' | 'fr' | 'it' | 'pt';
  const texts = LOCALIZED[activeLang];

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const quoteRef = useRef<{ id: string; fingerprint: string; attempted: boolean } | null>(null);

  // Form States
  const [formData, setFormData] = useState<CommercialFormData>({
    buildingType: 'office',
    numBuildings: 2,
    totalArea: 2400,
    services: {
      dailyCleaning: true,
      deepCleaning: false,
      maintenance: true,
      gardening: false,
      gutterCare: false,
      wasteLogistics: true
    },
    frequency: 'daily',
    protocols: {
      ecoOnly: false,
      emergency: false,
      security: false,
      portal: true
    },
    postalCode: '',
    city: '',
    hours: 4,
    address: '',
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    floorPlans: []
  });

  // Derived price calculation logic
  const calculateEstimate = () => {
    const area = formData.totalArea;
    const buildings = formData.numBuildings;

    // Base monthly retainer base
    let baseRate = buildings * 450;

    // Area scaling (smaller cost per sq meter as area increases)
    let areaRate = area * 0.38;

    // Service density multipliers
    let servicesFactor = 1.0;
    if (formData.services.dailyCleaning) servicesFactor += 0.35;
    if (formData.services.deepCleaning) servicesFactor += 0.20;
    if (formData.services.maintenance) servicesFactor += 0.40;
    if (formData.services.gardening) servicesFactor += 0.25;
    if (formData.services.gutterCare) servicesFactor += 0.15;
    if (formData.services.wasteLogistics) servicesFactor += 0.20;

    // Additional compliance options
    let protocolsFactor = 1.0;
    if (formData.protocols.ecoOnly) protocolsFactor += 0.05;
    if (formData.protocols.emergency) protocolsFactor += 0.15;
    if (formData.protocols.security) protocolsFactor += 0.12;
    if (formData.protocols.portal) protocolsFactor += 0.04;

    // Delivery visits schedule frequencies
    let frequencyFactor = 1.0;
    switch (formData.frequency) {
      case 'daily': frequencyFactor = 2.4; break;
      case 'multiple': frequencyFactor = 1.7; break;
      case 'weekly': frequencyFactor = 1.0; break;
      case 'biweekly': frequencyFactor = 0.65; break;
      case 'monthly': frequencyFactor = 0.35; break;
      case 'ondemand': frequencyFactor = 0.18; break;
    }

    // Regional Swiss pricing multiplier
    const zoneInfo = getZoneByPostalCode(formData.postalCode);
    const regionFactor = zoneInfo.multiplier;

    // Monthly estimation formula
    const totalMonthlyRaw = (baseRate + areaRate) * servicesFactor * protocolsFactor * frequencyFactor * regionFactor;

    // Scale slightly for B2B competitive pricing breaks on huge areas
    let volumeDiscount = 1.0;
    if (area > 10000) volumeDiscount = 0.82;
    else if (area > 5000) volumeDiscount = 0.88;
    else if (area > 2000) volumeDiscount = 0.94;

    const monthlyEstimated = totalMonthlyRaw * volumeDiscount;
    const monthlyFormatted = Math.round(monthlyEstimated / 50) * 50; // Rounded to nearest 50 index for clean Swiss quotes

    return {
      monthly: Math.max(850, monthlyFormatted), // floor at CHF 850
      annual: Math.max(850, monthlyFormatted) * 12
    };
  };

  const { monthly, annual } = calculateEstimate();

  const handleNext = () => {
    if (step === 4) {
      handleSubmit();
    } else {
      setStep((p) => p + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (!submitting && step > 1) {
      setStep((p) => p - 1);
      window.scrollTo(0, 0);
    }
  };

  const toggleService = (key: keyof SelectedServices) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: !prev.services[key]
      }
    }));
  };

  const toggleProtocol = (key: keyof SelectedProtocols) => {
    setFormData((prev) => ({
      ...prev,
      protocols: {
        ...prev.protocols,
        [key]: !prev.protocols[key]
      }
    }));
  };

  const addFloorPlans = (files: File[]) => {
    if (submitting) return;
    setFormData(previous => ({ ...previous, floorPlans: [...previous.floorPlans, ...files.map(file => ({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MiB', rawFile: file }))] }));
    try { files.forEach(validateFloorPlan); setErrorMsg(''); }
    catch { setErrorMsg(attachmentText(language, 'invalid')); }
  };
  const handleSubmit = async () => {
    if (!formData.companyName.trim() || formData.companyName.length > 200 || !formData.contactName.trim() || formData.contactName.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail.trim()) || formData.contactEmail.length > 254 || !formData.contactPhone.trim() || formData.contactPhone.length > 50 || !/^\d{4}$/.test(formData.postalCode.trim()) || !formData.city.trim() || !formData.address.trim() || formData.address.length > 500) {
      setErrorMsg(portalText(language, 'required')); return;
    }
    setErrorMsg(''); setSubmitting(true);
    try {
      const selectedServices = Object.keys(formData.services).filter(key => formData.services[key as keyof SelectedServices]);
      if (!selectedServices.length || !Number.isInteger(formData.numBuildings) || formData.numBuildings < 1 || formData.numBuildings > 200 || !Number.isFinite(formData.totalArea) || formData.totalArea < 1 || formData.totalArea > 1000000 || !Number.isFinite(formData.hours) || formData.hours < 0.5 || formData.hours > 24 || !Number.isFinite(monthly) || monthly < 0 || monthly > 10000000 || !Number.isFinite(annual) || annual > 120000000) throw new Error('quote/invalid');
      if (formData.floorPlans.length > 30) throw new Error('attachment/too-many');
      const filesToUpload = formData.floorPlans.map(plan => plan.rawFile);
      filesToUpload.forEach(validateFloorPlan);
      const uid = await ensureUploadUser();
      const fileResult = await uploadFilesToStorage(filesToUpload, { directory: 'b2b_quotes' });
      if (fileResult.errors.length || fileResult.fileCount !== filesToUpload.length) throw new Error('attachment/upload-failed');
      const fingerprint = JSON.stringify([uid, { ...formData, floorPlans: formData.floorPlans.map(plan => [plan.name, plan.rawFile.size, plan.rawFile.lastModified]) }]);
      if (quoteRef.current?.fingerprint !== fingerprint) quoteRef.current = { id: doc(collection(db, 'b2b_quotes')).id, fingerprint, attempted: false };
      const receipt = quoteRef.current!;
      const reference = doc(db, 'b2b_quotes', receipt.id);
      let alreadySaved = false;
      if (receipt.attempted) {
        try { alreadySaved = (await withPortalTimeout(getDoc(reference))).exists(); } catch { /* Retry the same receipt ID. */ }
      }
      const quoteDetails = {
        userId: uid, type: 'commercial_b2b', buildingType: formData.buildingType, numBuildings: formData.numBuildings,
        totalArea: formData.totalArea, services: selectedServices, frequency: formData.frequency, protocols: formData.protocols,
        postalCode: formData.postalCode.trim(), city: formData.city.trim(), hours: formData.hours,
        address: formData.address.trim(), companyName: formData.companyName.trim(), contactName: formData.contactName.trim(),
        contactEmail: formData.contactEmail.trim(), contactPhone: formData.contactPhone.trim(),
        floorPlans: fileResult.files.map(file => ({ name: file.name, sizeBytes: file.size, url: file.url, path: file.path, contentType: file.contentType })),
        estimatedMonthlyBudget: monthly, estimatedAnnualBudget: annual,
        createdAt: serverTimestamp(), language, status: 'pending',
      };
      receipt.attempted = true;
      if (!alreadySaved) await withPortalTimeout(setDoc(reference, sanitizeFirestoreData(quoteDetails)));
      // A stored quote is the primary receipt; a secondary webhook cannot undo it.
      sendLead({ ...quoteDetails, email: formData.contactEmail.trim(), source: 'Commercial B2B Calculator',
        fileUrl: fileResult.fileUrl, fileUrls: fileResult.fileUrls, fileName: fileResult.fileName, fileCount: fileResult.fileCount });
      setComplete(true); setStep(5);
    } catch (error: any) {
      const attachmentFailure = String(error?.message || '').startsWith('attachment/');
      const invalidAttachment = /attachment\/(unsupported|too-large|empty)/.test(String(error?.message || ''));
      setErrorMsg(attachmentFailure ? attachmentText(language, error?.message === 'attachment/too-many' ? 'tooMany' : invalidAttachment ? 'invalid' : 'failed') : portalText(language, 'saveError'));
    } finally { setSubmitting(false); }
  };

  const zoneFeedback = getZoneByPostalCode(formData.postalCode);

  return (
    <div className="kraken-page kraken-workflow min-h-screen bg-[#f4f8f8] text-[#082b45] py-12 sm:py-16">

      <div className="kraken-container max-w-6xl">

        <header className="kraken-page-intro mb-10 max-w-3xl"><p className="kraken-eyebrow">Kraken PFM</p><h1 className="kraken-heading mt-3">{texts.title}</h1><p className="kraken-description">{texts.subtitle}</p></header>

        {/* Progress Timeline */}
        {!complete && (
          <div className="mb-8 max-w-2xl mx-auto px-4 select-none">
            <div className="flex flex-wrap justify-between items-center gap-3 text-sm font-medium text-[#526574] mb-2.5">
              <span>{texts.step} {step} {texts.of} 4</span>
              <span className="text-[#087f73]">
                {step === 1 && texts.step1Title}
                {step === 2 && texts.step2Title}
                {step === 3 && texts.step3Title}
                {step === 4 && texts.step4Title}
              </span>
            </div>
            <div className="w-full h-2 bg-[#f4f8f8] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#087f73] rounded-full"
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Wizard Card */}
          <div className={`${complete ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
            <div className="bg-white border border-[#dce6e8] rounded-3xl p-6 md:p-8 shadow-sm backdrop-blur-md relative overflow-hidden">

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <fieldset disabled={submitting} className="contents">
                  {/* STEP 1: PORTFOLIO */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-[#082b45] mb-2">{texts.step1Title}</h2>
                        <p className="text-[#526574] text-sm md:text-sm">{texts.step1Desc}</p>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-sm md:text-sm font-bold text-[#526574] normal-case tracking-normal">
                          {texts.buildingTypeLabel}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {([
                            { id: 'office', label: texts.office, icon: '🏢' },
                            { id: 'residential', label: texts.residential, icon: '🏘️' },
                            { id: 'retail', label: texts.retail, icon: '🛍️' },
                            { id: 'industrial', label: texts.industrial, icon: '🏭' },
                            { id: 'medical', label: texts.medical, icon: '⚕️' }
                          ] as const).map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, buildingType: item.id }))}
                              className={`flex items-center gap-3 p-4 rounded-2xl border text-left text-sm md:text-sm font-semibold transition-all ${
                                formData.buildingType === item.id
                                  ? 'border-[#087f73] bg-sky-500/10 text-[#082b45] shadow-sm'
                                  : 'border-[#dce6e8] bg-[#f4f8f8] hover:border-[#dce6e8] text-[#526574]'
                              }`}
                            >
                              <span className="text-2xl select-none">{item.icon}</span>
                              <span className="line-clamp-2">{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-3">
                          <label className="block text-sm md:text-sm font-bold text-[#526574] normal-case tracking-normal select-none">
                            {texts.numBuildingsLabel}
                          </label>
                          <div className="flex items-center gap-4 bg-[#f4f8f8] border border-[#dce6e8] p-2 rounded-2xl w-fit">
                            <button
                              type="button"
                              aria-label={`${texts.numBuildingsLabel}: −1`}
                              onClick={() => setFormData(p => ({ ...p, numBuildings: Math.max(1, p.numBuildings - 1) }))}
                              className="min-w-11 min-h-11 flex items-center justify-center rounded-xl bg-[#f4f8f8] hover:bg-[#e6f0ef] active:scale-95 text-xl font-semibold transition-all select-none"
                            >
                              -
                            </button>
                            <span className="text-xl font-semibold text-[#082b45] w-12 text-center select-none">
                              {formData.numBuildings}
                            </span>
                            <button
                              type="button"
                              aria-label={`${texts.numBuildingsLabel}: +1`}
                              onClick={() => setFormData(p => ({ ...p, numBuildings: Math.min(50, p.numBuildings + 1) }))}
                              className="min-w-11 min-h-11 flex items-center justify-center rounded-xl bg-[#f4f8f8] hover:bg-[#e6f0ef] active:scale-95 text-xl font-semibold transition-all select-none"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label htmlFor="commercialquote-area" className="block text-sm md:text-sm font-bold text-[#526574] normal-case tracking-normal">
                              {texts.areaLabel} (m²)
                            </label>
                            <span className="text-lg font-semibold text-[#087f73]">
                              {formData.totalArea.toLocaleString()} m²
                            </span>
                          </div>
                          <input
                            id="commercialquote-area"
                            type="range"
                            min="10"
                            max="30000"
                            step="10"
                            value={formData.totalArea}
                            onChange={(e) => setFormData(p => ({ ...p, totalArea: parseInt(e.target.value, 10) }))}
                            className="min-h-11 w-full h-2 bg-[#f4f8f8] rounded-lg appearance-none cursor-pointer accent-sky-500"
                          />
                          <div className="flex justify-between text-sm text-[#526574] font-bold">
                            <span>10 m²</span>
                            <span>15,000 m²</span>
                            <span>30,000 m²+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: SERVICES */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-[#082b45] mb-2">{texts.step2Title}</h2>
                        <p className="text-[#526574] text-sm md:text-sm">{texts.step2Desc}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-3.5 pt-2">
                        {([
                          { key: 'dailyCleaning', icon: '🧹', label: texts.serviceDaily, desc: texts.serviceDailyDesc },
                          { key: 'deepCleaning', icon: '✨', label: texts.serviceDeep, desc: texts.serviceDeepDesc },
                          { key: 'maintenance', icon: '🛠️', label: texts.serviceMaintenance, desc: texts.serviceMaintenanceDesc },
                          { key: 'gardening', icon: '🌿', label: texts.serviceGardening, desc: texts.serviceGardeningDesc },
                          { key: 'gutterCare:gutterCare', keyActual: 'gutterCare', icon: '🍂', label: texts.serviceGutter, desc: texts.serviceGutterDesc },
                          { key: 'wasteLogistics', icon: '🗑️', label: texts.serviceWaste, desc: texts.serviceWasteDesc }
                        ] as any[]).map((service) => {
                          const isSelected = formData.services[service.keyActual || service.key as keyof SelectedServices];
                          return (
                            <button
                              key={service.key}
                              type="button"
                              onClick={() => toggleService(service.keyActual || service.key as keyof SelectedServices)}
                              className={`flex gap-4 p-4 rounded-2xl border text-left transition-all ${
                                isSelected
                                  ? 'border-[#087f73]/90 bg-sky-500/10 text-[#082b45] shadow-sm'
                                  : 'border-[#dce6e8] bg-[#f4f8f8] hover:border-[#dce6e8] text-[#526574]'
                              }`}
                            >
                              <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-xl ${isSelected ? 'bg-sky-500' : 'bg-[#f4f8f8]'}`}>
                                {service.icon}
                              </div>
                              <div>
                                <h3 className="text-sm md:text-sm font-semibold tracking-tight">{service.label}</h3>
                                <p className="text-sm md:text-sm text-[#526574] leading-normal mt-1">{service.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: FREQUENCY & SPECIAL COOP PROTOCOLS */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-[#082b45] mb-2">{texts.step3Title}</h2>
                        <p className="text-[#526574] text-sm md:text-sm">{texts.step3Desc}</p>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm md:text-sm font-bold text-[#526574] normal-case tracking-normal">
                          {texts.freqLabel}
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                          {([
                            { id: 'daily', label: texts.freqDaily, icon: '🗓️' },
                            { id: 'multiple', label: texts.freqMultiple, icon: '⚡' },
                            { id: 'weekly', label: texts.freqWeekly, icon: '📆' },
                            { id: 'biweekly', label: texts.freqBiweekly, icon: '📅' },
                            { id: 'monthly', label: texts.freqMonthly, icon: '🔬' },
                            { id: 'ondemand', label: texts.freqOndemand, icon: '🎈' }
                          ] as const).map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, frequency: item.id }))}
                              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all ${
                                formData.frequency === item.id
                                  ? 'border-[#087f73] bg-sky-500/15 text-[#082b45] font-semibold'
                                  : 'border-[#dce6e8] bg-[#f4f8f8] hover:border-[#dce6e8] text-[#526574] text-sm font-semibold'
                              }`}
                            >
                              <span className="text-xl mb-1">{item.icon}</span>
                              <span className="text-sm leading-tight break-all">{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3.5 pt-4 border-t border-[#dce6e8]">
                        <label className="block text-sm md:text-sm font-bold text-[#526574] normal-case tracking-normal">
                          {texts.additionalProtocols}
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {([
                            { key: 'ecoOnly', icon: '🌿', label: texts.protocolEco, desc: texts.protocolEcoDesc },
                            { key: 'emergency', icon: '🚨', label: texts.protocolEmergency, desc: texts.protocolEmergencyDesc },
                            { key: 'security', icon: '🛡️', label: texts.protocolSecurity, desc: texts.protocolSecurityDesc },
                            { key: 'portal', icon: '📱', label: texts.protocolPortal, desc: texts.protocolPortalDesc }
                          ] as any[]).map((opt) => {
                            const isSelected = formData.protocols[opt.key as keyof SelectedProtocols];
                            return (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => toggleProtocol(opt.key as keyof SelectedProtocols)}
                                className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? 'border-emerald-500/90 bg-emerald-500/5 text-[#082b45]'
                                    : 'border-[#dce6e8] bg-[#f4f8f8] hover:border-[#dce6e8] text-[#526574]'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border ${isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'}`}>
                                  {isSelected && <span className="text-sm font-semibold">✓</span>}
                                </div>
                                <div className="shrink-0 text-xl select-none">{opt.icon}</div>
                                <div>
                                  <h4 className="text-sm font-bold leading-tight">{opt.label}</h4>
                                  <p className="text-sm text-[#526574] mt-0.5 leading-normal">{opt.desc}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: CONTACT & GEOGRAPHICAL VALIDATION */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-[#082b45] mb-2">{texts.step4Title}</h2>
                        <p className="text-[#526574] text-sm md:text-sm">{texts.step4Desc}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="commercialquote-field-1" className="block text-sm font-bold text-[#526574]">
                              {texts.postalCodeLabel} *
                            </label>
                            <input id="commercialquote-field-1"
                              type="text"
                              maxLength={6}
                              placeholder={texts.postalCodePlaceholder}
                              value={formData.postalCode}
                              onChange={(e) => setFormData(p => ({ ...p, postalCode: e.target.value }))}
                              className="min-h-11 w-full bg-white border border-[#dce6e8] rounded-xl px-4 py-2.5 text-base md:text-sm text-[#082b45] focus:outline-none focus:border-[#087f73] placeholder:text-[#526574]"
                            />
                          </div>

                          <div className="space-y-1.5 align-middle">
                            <label className="block text-sm font-bold text-[#526574]">
                              {texts.regionBase}
                            </label>
                            <div className="bg-[#f4f8f8] border border-[#dce6e8] rounded-xl px-4 py-3 text-sm font-bold text-[#526574] min-h-12 flex items-center">
                              {formData.postalCode.trim() ? (
                                <span className={zoneFeedback.zone === 'schaffhausen' ? 'text-[#087f73]' : 'text-[#087f73]'}>
                                  {zoneFeedback.zone === 'schaffhausen' && texts.regionSH}
                                  {zoneFeedback.zone === 'zurich' && texts.regionZH}
                                  {zoneFeedback.zone === 'winterthur' && texts.regionWT}
                                  {zoneFeedback.zone === 'other' && texts.regionOther}
                                </span>
                              ) : (
                                <span className="text-[#526574] italic">{texts.postalCodePlaceholder}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="commercialquote-field-2" className="block text-sm font-bold text-[#526574]">
                              {texts.cityLabel} *
                            </label>
                            <input id="commercialquote-field-2"
                              type="text"
                              placeholder="e.g., Schaffhausen"
                              value={formData.city}
                              onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                              className="min-h-11 w-full bg-white border border-[#dce6e8] rounded-xl px-4 py-2.5 text-base md:text-sm text-[#082b45] focus:outline-none focus:border-[#087f73] placeholder:text-[#526574]"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="commercialquote-field-3" className="block text-sm font-bold text-[#526574]">
                              {texts.hoursLabel} *
                            </label>
                            <input id="commercialquote-field-3"
                              type="number"
                              min={1}
                              max={168}
                              value={formData.hours}
                              onChange={(e) => setFormData(p => ({ ...p, hours: Math.max(1, parseInt(e.target.value, 10) || 1) }))}
                              className="min-h-11 w-full bg-white border border-[#dce6e8] rounded-xl px-4 py-2.5 text-base md:text-sm text-[#082b45] focus:outline-none focus:border-[#087f73] placeholder:text-[#526574]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="commercialquote-field-4" className="block text-sm font-bold text-[#526574]">
                            {texts.addressLabel} *
                          </label>
                          <input id="commercialquote-field-4"
                            type="text"
                            placeholder="e.g., Rheinstrasse 12, 8200 Schaffhausen"
                            maxLength={500} value={formData.address}
                            onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                            className="min-h-11 w-full bg-white border border-[#dce6e8] rounded-xl px-4 py-3 text-base md:text-sm text-[#082b45] focus:outline-none focus:border-[#087f73] placeholder:text-[#526574]"
                          />
                        </div>

                        <div className="space-y-2 pt-1">
                          <label htmlFor="floor-plan-upload" className="block text-sm font-bold text-[#526574]">
                            {texts.plansLabel}
                          </label>
                          <div
                            className="border-2 border-dashed border-[#dce6e8] hover:border-[#087f73]/50 rounded-xl p-6 transition-all bg-[#f4f8f8] text-center cursor-pointer relative"
                            role="button" tabIndex={0}
                            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); document.getElementById('floor-plan-upload')?.click(); } }}
                            onDragOver={event => event.preventDefault()}
                            onDrop={event => { event.preventDefault(); addFloorPlans(Array.from(event.dataTransfer.files)); }}
                            onClick={() => document.getElementById('floor-plan-upload')?.click()}
                          >
                            <input
                              id="floor-plan-upload"
                              type="file"
                              multiple disabled={submitting}
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="min-h-11 hidden"
                              onChange={event => addFloorPlans(Array.from(event.target.files || []))}
                            />
                            <div className="flex flex-col items-center justify-center gap-2 select-none">
                              <span className="text-3xl">📤</span>
                              <p className="text-sm font-medium text-[#526574]">
                                {texts.plansDrop}
                              </p>
                              <p className="text-sm text-[#526574]">
                                PDF / PNG / JPG / JPEG · 20 MiB
                              </p>
                            </div>
                          </div>

                          {formData.floorPlans && formData.floorPlans.length > 0 && (
                            <div className="space-y-1.5 pt-2">
                              {formData.floorPlans.map((plan, index) => (
                                <div key={index} className="flex justify-between items-center bg-[#f4f8f8] border border-[#dce6e8] rounded-lg p-2 text-sm text-[#082b45]">
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="shrink-0 text-[#526574]">📄</span>
                                    <span className="truncate font-medium">{plan.name}</span>
                                    <span className="shrink-0 text-sm text-[#526574] font-bold">({plan.size})</span>
                                  </div>
                                  <button
                                    type="button"
                                    disabled={submitting}
                                    aria-label={attachmentText(language, 'remove')}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setErrorMsg('');
                                      setFormData(p => ({
                                        ...p,
                                        floorPlans: (p.floorPlans || []).filter((_, i) => i !== index)
                                      }));
                                    }}
                                    className="min-h-11 p-1 hover:bg-[#f4f8f8] rounded text-red-400 hover:text-red-300 transition-all text-sm"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label htmlFor="commercialquote-field-5" className="block text-sm font-bold text-[#526574]">
                            {texts.companyLabel} *
                          </label>
                          <input id="commercialquote-field-5"
                            type="text"
                            placeholder={texts.companyPlaceholder}
                            maxLength={200} value={formData.companyName}
                            onChange={(e) => setFormData(p => ({ ...p, companyName: e.target.value }))}
                            className="min-h-11 w-full bg-white border border-[#dce6e8] rounded-xl px-4 py-3 text-base md:text-sm text-[#082b45] focus:outline-none focus:border-[#087f73] placeholder:text-[#526574]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="commercialquote-field-6" className="block text-sm font-bold text-[#526574]">
                            {texts.contactLabel} *
                          </label>
                          <input id="commercialquote-field-6"
                            type="text"
                            placeholder={texts.contactPlaceholder}
                            maxLength={150} value={formData.contactName}
                            onChange={(e) => setFormData(p => ({ ...p, contactName: e.target.value }))}
                            className="min-h-11 w-full bg-white border border-[#dce6e8] rounded-xl px-4 py-3 text-base md:text-sm text-[#082b45] focus:outline-none focus:border-[#087f73] placeholder:text-[#526574]"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="commercialquote-field-7" className="block text-sm font-bold text-[#526574]">
                              {texts.emailLabel} *
                            </label>
                            <input id="commercialquote-field-7"
                              type="email"
                              placeholder={texts.emailPlaceholder}
                              maxLength={254} value={formData.contactEmail}
                              onChange={(e) => setFormData(p => ({ ...p, contactEmail: e.target.value }))}
                              className="min-h-11 w-full bg-white border border-[#dce6e8] rounded-xl px-4 py-2.5 text-base md:text-sm text-[#082b45] focus:outline-none focus:border-[#087f73] placeholder:text-[#526574]"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="commercialquote-field-8" className="block text-sm font-bold text-[#526574]">
                              {texts.phoneLabel}
                            </label>
                            <input id="commercialquote-field-8"
                              type="tel"
                              placeholder={texts.phonePlaceholder}
                              maxLength={50} value={formData.contactPhone}
                              onChange={(e) => setFormData(p => ({ ...p, contactPhone: e.target.value }))}
                              className="min-h-11 w-full bg-white border border-[#dce6e8] rounded-xl px-4 py-2.5 text-base md:text-sm text-[#082b45] focus:outline-none focus:border-[#087f73] placeholder:text-[#526574]"
                            />
                          </div>
                        </div>

                        {errorMsg && (
                          <div className="p-4 bg-red-50 border border-red-500/30 text-red-800 text-sm rounded-xl font-bold flex items-center gap-2">
                            <span>⚠</span>
                            <span className="leading-relaxed">{errorMsg}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 5: SUCCESS BLOCK */}
                  {step === 5 && (
                    <div className="text-center py-6 space-y-6">
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-[#087f73] rounded-full flex items-center justify-center text-3xl mx-auto animate-bounce">
                        ✓
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#082b45]">{portalText(language, 'saved')}</h2>
                        <p className="text-[#526574] text-sm max-w-xl mx-auto leading-relaxed">{attachmentText(language, 'stored')}</p>
                      </div>

                      <div className="bg-[#f4f8f8] border border-[#dce6e8] rounded-2xl p-5 text-left max-w-lg mx-auto space-y-3.5">
                        <h3 className="text-sm font-semibold normal-case text-[#087f73] tracking-normal">
                          {texts.successRec}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm text-[#526574]">
                          <div>
                            <span className="text-[#526574] font-bold block">{texts.companyLabel}</span>
                            <span className="font-semibold text-[#082b45]">{formData.companyName}</span>
                          </div>
                          <div>
                            <span className="text-[#526574] font-bold block">{texts.numBuildingsLabel}</span>
                            <span className="font-semibold text-[#082b45]">{formData.numBuildings}</span>
                          </div>
                          <div>
                            <span className="text-[#526574] font-bold block">{texts.areaLabel}</span>
                            <span className="font-semibold text-[#087f73]">{formData.totalArea.toLocaleString()} m²</span>
                          </div>
                          <div>
                            <span className="text-[#526574] font-bold block">{texts.estRangeTitle}</span>
                            <span className="font-bold text-[#087f73]">~ CHF {monthly.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left py-4">
                        <div className="flex gap-3 bg-[#f4f8f8] border border-[#dce6e8] p-3.5 rounded-xl">
                          <span className="text-lg">👔</span>
                          <span className="text-sm text-[#526574] leading-normal">{attachmentText(language, 'estimate')}</span>
                        </div>
                        <div className="flex gap-3 bg-[#f4f8f8] border border-[#dce6e8] p-3.5 rounded-xl">
                          <span className="text-lg">📄</span>
                          <span className="text-sm text-[#526574] leading-normal">{attachmentText(language, formData.floorPlans.length ? 'attachmentsSaved' : 'noAttachments')}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onNavigate('home')}
                        className="kraken-button kraken-secondary"
                      >
                        {texts.backToHome}
                      </button>
                    </div>
                  )}
                  </fieldset>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons Footer (Not for complete page) */}
              {!complete && (
                <div className="flex flex-wrap justify-between items-center mt-8 pt-6 border-t border-[#dce6e8] gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1 || submitting}
                    className={`kraken-button kraken-secondary ${
                      step === 1
                        ? 'opacity-30 cursor-not-allowed bg-transparent'
                        : 'bg-[#f4f8f8] hover:bg-[#f4f8f8] active:scale-95'
                    }`}
                  >
                    ← {texts.back}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={submitting}
                    className="min-h-11 kraken-button kraken-primary"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-[#dce6e8] border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <>
                        <span>{step === 4 ? texts.submit : texts.next}</span>
                        {step < 4 && <ChevronRightIcon className="w-4 h-4 shrink-0 transition-transform hover:translate-x-0.5" />}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: B2B Price & Configuration Summary (Only visible when configuration is active) */}
          {!complete && (
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#dce6e8] rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

                <h3 className="text-sm font-semibold text-[#526574] normal-case tracking-normal flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                  {texts.estRangeTitle}
                </h3>

                <p className="text-[#526574] text-sm leading-relaxed mb-6">
                  {texts.estSub}
                </p>

                <div className="space-y-5 pt-4 border-t border-[#dce6e8]">
                  <div className="space-y-1">
                    <span className="text-[#526574] text-sm normal-case font-semibold tracking-normal block">
                      {texts.perMonth}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl md:text-4xl font-semibold text-[#087f73]">
                        CHF ~{monthly.toLocaleString()}
                      </span>

                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#526574] text-sm normal-case font-semibold tracking-normal block font-medium">
                      {texts.perYear}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl md:text-2xl font-semibold text-[#526574]">
                        CHF ~{annual.toLocaleString()}
                      </span>

                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3.5 bg-[#f4f8f8] border border-[#dce6e8] rounded-2xl flex gap-2.5">
                  <InfoIcon className="w-4 h-4 shrink-0 text-[#526574] mt-0.5" />
                  <p className="text-sm text-[#526574] leading-normal">
                    {texts.disclaimer}
                  </p>
                </div>
              </div>


            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CommercialQuotePage;
