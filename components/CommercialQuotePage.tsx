import React, { useState, useEffect } from 'react';
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
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Star } from 'lucide-react';

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
  floorPlans: { name: string; size: string; content: string }[];
}

const LOCALIZED = {
  en: {
    title: 'B2B Building & Property Quote Wizard',
    subtitle: 'Configure your customized facility, cleaning, and maintenance solution in less than 2 minutes.',
    step: 'Step',
    of: 'of',
    back: 'Back',
    next: 'Next',
    submit: 'Request Enterprise Proposal ⚡',
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
    additionalProtocols: 'High-Compliance Corporate Protocols',
    protocolEco: '100% Zero-impact, Ecologically Certified Products',
    protocolEcoDesc: 'Exclusive use of premium Swiss eco-labeled green cleaners, safe for all environments.',
    protocolEmergency: '24/7 Priority Emergency On-site Dispatch',
    protocolEmergencyDesc: 'Operational responder dispatch guarantee in under 2 hours in Schaffhausen & Zürich.',
    protocolSecurity: 'Enhanced Security-Vetted & Audited Personnel',
    protocolSecurityDesc: 'Clean backgrounds and custom clearances required for financial, jewelry, or health hubs.',
    protocolPortal: 'Tenant Ticket Portal & Direct Key Custody',
    protocolPortalDesc: 'Direct digital problem reporting dashboard for occupants and audited key logs.',
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
    estRangeTitle: 'Real-time B2B Price Range',
    estSub: 'Estimated contract rates calculated based on Swiss standard corporate indices.',
    perMonth: 'Monthly Average Estimated Budget',
    perYear: 'Annual Value Guideline',
    disclaimer: 'Note: These calculations serve as an initial guideline. Our senior partner Kai will schedule a physical inspection to offer you a 100% binding, optimal custom contract proposal.',
    ctaSubmitText: 'Request binding proposal',
    // Region outputs
    regionBase: 'Valuation Region Detected',
    regionSH: '✓ Schaffhausen Regional Base — Home Core Rates',
    regionZH: '✓ Zürich City Operations (Includes metropolitan density adjustments +22%)',
    regionWT: '✓ Winterthur District Area (Includes regional distance adjustment +12%)',
    regionOther: '✓ Swiss Operational Zone (Standard rate calculation applied)',
    // Success View
    successHeading: 'Enterprise Request Compiled! ⚡',
    successSub: 'We will design your customized technical proposal within 24 hours.',
    successRec: 'Specifications Received:',
    successCard1: 'A dedicated commercial account manager will contact you for a technical site walk.',
    successCard2: 'Your pricing, insurance certificates, and operational guarantees will be sent securely by email.',
    backToHome: 'Return to Main Dashboard'
  },
  es: {
    title: 'Asistente de Presupuestos para Edificios B2B',
    subtitle: 'Configure su solución de mantenimiento, limpieza e instalaciones a medida en menos de 2 minutos.',
    step: 'Paso',
    of: 'de',
    back: 'Atrás',
    next: 'Siguiente',
    submit: 'Solicitar Propuesta para Empresa ⚡',
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
    additionalProtocols: 'Protocolos Corporativos Específicos',
    protocolEco: 'Productos 100% Ecológicos y Libres de Tóxicos',
    protocolEcoDesc: 'Uso exclusivo de productos con eco-etiqueta suiza, seguros para el medio ambiente.',
    protocolEmergency: 'Atención Prioritaria para Emergencias 24/7',
    protocolEmergencyDesc: 'Garantía de técnico Kraken in-situ en menos de 2 horas en Schaffhausen y Zürich.',
    protocolSecurity: 'Personal con Verificación Rigurosa de Antecedentes',
    protocolSecurityDesc: 'Necesario para centros médicos, oficinas bancarias, joyerías o sedes gubernamentales.',
    protocolPortal: 'Portal Digital para Inquilinos y Control de Llaves',
    protocolPortalDesc: 'Dashboard para que los residentes reporten incidencias directamente.',
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
    estRangeTitle: 'Presupuesto B2B Estimado en Tiempo Real',
    estSub: 'Tarifas anuales estimadas basadas en índices suizos estandarizados.',
    perMonth: 'Presupuesto Promedio Mensual Estimado',
    perYear: 'Valor de Contrato Anual Estimado',
    disclaimer: 'Nota: Este cálculo es orientativo. Nuestro especialista principal Kai programará una visita física para presentarle una propuesta formal óptima, con garantía del 100% en cotizaciones.',
    ctaSubmitText: 'Solicitar contrato de servicio formal',
    regionBase: 'Región de Valoración Detectada',
    regionSH: '✓ Base de Schaffhausen — Tarifas base core operativas',
    regionZH: '✓ Operaciones en Zürich (Incluye ajuste por densidad e impuestos locales +22%)',
    regionWT: '✓ Distrito de Winterthur (Incluye ajuste logístico de distancia +12%)',
    regionOther: '✓ Zona Operativa Suiza Estándar (Cálculo promedio aplicado)',
    successHeading: '¡Solicitud Corporativa Procesada! ⚡',
    successSub: 'Diseñaremos su propuesta de contrato detallada en un plazo de 24 horas.',
    successRec: 'Ficha Técnica Recibida:',
    successCard1: 'Un gestor de cuentas corporativas se comunicará con usted para la visita técnica.',
    successCard2: 'Sus pólizas de seguros civiles, certificados de personal de Kraken y tarifas fijadas se enviarán formalmente.',
    backToHome: 'Volver al Inicio'
  },
  de: {
    title: 'B2B Liegenschafts- & Gebäude-Offertenrechner',
    subtitle: 'Konfigurieren Sie Ihre massgeschneiderte Gebäudeunterhalts- und Reinigungs-Lösung in unter 2 Minuten.',
    step: 'Schritt',
    of: 'von',
    back: 'Zurück',
    next: 'Weiter',
    submit: 'Gewerbliche Offerte anfordern ⚡',
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
    additionalProtocols: 'Spezielle Business-Compliance-Protokolle',
    protocolEco: '100% ökologische und schadstofffreie Reinigungsmaterialien',
    protocolEcoDesc: 'Konsequenter Einsatz biologisch zertifizierter Schweizer Reinigungsmittel.',
    protocolEmergency: '24/7 Express-Notfall-Pikettgarantie',
    protocolEmergencyDesc: 'Einsatzbereiter Kraken-Techniker binnen 2 Stunden vor Ort in Schaffhausen & Zürich.',
    protocolSecurity: 'Sicherheitsgeprüftes Personal mit Behörden-Scan',
    protocolSecurityDesc: 'Erweitertes Führungszeugnis für Banken, Labore, Schmuck- oder Gesundheitseinrichtungen.',
    protocolPortal: 'Mieter-Ticketportal & Schlüsselverwahrung',
    protocolPortalDesc: 'Direkter digitaler Meldekanal für Wohnungsinhaber und lückenloses Schlüssel-Log.',
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
    estRangeTitle: 'Echtzeit-Kalkulation des B2B-Budgets',
    estSub: 'Auf Schweizer Standard-Branchenfaktoren berechnete Richtpreise.',
    perMonth: 'Geschätztes monatliches Budget',
    perYear: 'Geschätzter Jahresvertragswert',
    disclaimer: 'Hinweis: Diese Richtwerte dienen als Orientierung. Unser Geschäftsführer Kai meldet sich für eine Begehung vor Ort, um Ihnen eine feste, bindende Offerte mit Bestpreis-Garantie zu unterbreiten.',
    ctaSubmitText: 'Liegenschafts-Kalkulation anfordern',
    regionBase: 'Erkannte Betriebsregion',
    regionSH: '✓ Kernregion Schaffhausen — Standard-Gebäudevertragstarife',
    regionZH: '✓ Kanton Zürich (Inklusive grossstädtischem Mehraufwand & Zürcher Steuern +22%)',
    regionWT: '✓ Winterthur & Umgebung (Inklusive regionalem Logistik-Abschlag +12%)',
    regionOther: '✓ Schweizer Betriebsgebiet (Standard-Durchschnittstarif)',
    successHeading: 'Gewerbliche Offertenanfrage empfangen! ⚡',
    successSub: 'Wir konzipieren Ihr massgeschneidertes Angebot innerhalb von 24 Stunden.',
    successRec: 'Erhaltene Liegenschaftsdaten:',
    successCard1: 'Ein Senior-Projektleiter kontaktiert Sie umgehend für einen Vor-Ort-Termin.',
    successCard2: 'Sämtliche Versicherungsnachweise und Detailkonditionen erhalten Sie direkt per E-Mail.',
    backToHome: 'Zurück zur Startseite'
  },
  fr: {
    title: 'Assistant Devis B2B Immeubles & Propriétés',
    subtitle: 'Configurez en moins de 2 minutes votre solution complète de nettoyage et maintenance de bâtiments.',
    step: 'Étape',
    of: 'sur',
    back: 'Retour',
    next: 'Suivant',
    submit: 'Demander une proposition d’entreprise ⚡',
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
    additionalProtocols: 'Protocoles institutionnels sur mesure',
    protocolEco: 'Détergents 100% biodégradables certifiés',
    protocolEcoDesc: 'Usage proscrivant les perturbateurs endocriniens, labellisé éco-responsable suisse.',
    protocolEmergency: 'Assistance astreinte d’urgence 24h/24',
    protocolEmergencyDesc: 'Garantie de technicien Kraken sur site sous 2h à Schaffhouse et Zurich.',
    protocolSecurity: 'Contrôles d’antécédents d’agents renforcés',
    protocolSecurityDesc: 'Sécurité et discrétion de haut niveau (banques, joailleries, etc.).',
    protocolPortal: 'Accès portail de tickets locataires',
    protocolPortalDesc: 'Canal d’annonce électronique direct pour tout problème affectant l’immeuble.',
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
    estRangeTitle: 'Estimation budgétaire B2B en temps réel',
    estSub: 'Calculs indicatifs basés sur les indexations professionnelles suisses.',
    perMonth: 'Budget moyen mensuel estimé',
    perYear: 'Valeur de contrat annuel estimé',
    disclaimer: 'Note : Ce budget sert d’orientation initiale. Notre partenaire principal Kai vous proposera une visite des lieux pour éditer un devis optimal définitif engageant à 100%.',
    ctaSubmitText: 'Transmettre la demande de devis',
    regionBase: 'Zone géographique de prise en charge',
    regionSH: '✓ Base de Schaffhouse (Application des coûts unitaires de base Kraken)',
    regionZH: '✓ Canton de Zurich (Ajustement de densité logistique métropolitaine +22%)',
    regionWT: '✓ District de Winterthour (Index de distance ajustée +12%)',
    regionOther: '✓ Zone opérationnelle suisse standard (Index moyen appliqué)',
    successHeading: 'Demande de contrat entreprise reçue ! ⚡',
    successSub: 'Nous allons finaliser vos études techniques sous 24 heures ouvrées.',
    successRec: 'Spécifications de parc :',
    successCard1: 'Un chef de projet technique prendra rendez-vous avec vous pour la reconnaissance du site.',
    successCard2: 'Sont joints à votre offre finale nos attestations de RC professionnelle et accréditations.',
    backToHome: 'Retourner au Tableau de Bord'
  },
  it: {
    title: 'Calcolatore Preventivi Edifici B2B',
    subtitle: 'Configura la soluzione di facility management, pulizia e manutenzione su misura in meno di 2 minuti.',
    step: 'Passo',
    of: 'di',
    back: 'Indietro',
    next: 'Avanti',
    submit: 'Invia Richiesta Aziendale ⚡',
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
    additionalProtocols: 'Protocolli di Sicurezza e Qualità Extra',
    protocolEco: 'Fornitura materiali 100% bio-compatibili',
    protocolEcoDesc: 'Nessuna esalazione chimica tossica, certificazione Ecolabel Svizzera.',
    protocolEmergency: 'Astreinte Pronta Emergenza 24 ore su 24',
    protocolEmergencyDesc: 'Garantiamo l’invio di un tecnico Kraken entro 2 ore dalla notifica.',
    protocolSecurity: 'Guardie e Dipendenti controllati con Certificato',
    protocolSecurityDesc: 'Selezione ad elevato standard di privacy (banche, cliniche).',
    protocolPortal: 'Portale Segnalazioni Condomini & Consegna Chiavi',
    protocolPortalDesc: 'Dashboard digitale riservata agli inquilini per la notifica tempestiva di rotture.',
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
    estRangeTitle: 'Stima Preventivo B2B Real-time',
    estSub: 'Tariffe calcolate su listino medio per le attività professionali in Svizzera.',
    perMonth: 'Canone Mensile Medio Stimato',
    perYear: 'Canone Annuo Stimato',
    disclaimer: 'Nota bene: Questo modulo online fornisce cifre orientative di fattibilità. Il nostro titolare Kai formulerà la quotazione finale fissa a seguito di un breve sopralluogo tecnico non vincolante.',
    ctaSubmitText: 'Richiedi contratto di servizio',
    regionBase: 'Sede Operativa Riconosciuta',
    regionSH: '✓ Hub di Sciaffusa — Rotte di costo ordinario',
    regionZH: '✓ Canton Zurigo (Comprensivo di indici di trasporto urbano +22%)',
    regionWT: '✓ Area di Winterthur (Comprensivo di indici di prossimità stradale +12%)',
    regionOther: '✓ Area Svizzera Operativa Generica (Tariffe medie nazionali applicate)',
    successHeading: 'Richiesta di offerta per stabili inviata! ⚡',
    successSub: 'Elaboreremo le vostre specifiche entro 24 ore lavorative.',
    successRec: 'Riepilogo Parametri di Proprietà:',
    successCard1: 'Il nostro responsabile di zona prenderà contatto per impostare lo studio tecnico dei metri quadri.',
    successCard2: 'Riceverà per email le quotazioni finali, licenze di esercizio e scheda tecnica Kraken.',
    backToHome: 'Torna alla Schermata Home'
  },
  pt: {
    title: 'Calculadora de Orçamentos de Edifícios B2B',
    subtitle: 'Configure a sua solução de gestão, limpeza e manutenção de edifícios personalizada em menos de 2 minutos.',
    step: 'Passo',
    of: 'de',
    back: 'Voltar',
    next: 'Avançar',
    submit: 'Requerer Proposta Comercial ⚡',
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
    additionalProtocols: 'Normas Específicas de Conformidade',
    protocolEco: 'Materiais Certificados Ecologicamente',
    protocolEcoDesc: 'Evitamos solventes derivados de petróleo, uso de marca ecológica homologada.',
    protocolEmergency: 'Urgências Ativas 24h / Piquete Contínuo',
    protocolEmergencyDesc: 'Disponibilidade de carrinhas Kraken no local em menos de 2h na região operada.',
    protocolSecurity: 'Equipa Selecionada com Registo Criminal Limpo',
    protocolSecurityDesc: 'Indispensável para bancos, laboratórios químicos, clínicas ou ourivesarias.',
    protocolPortal: 'Interface Condóminos & Guarda de Chaves Protegida',
    protocolPortalDesc: 'Painel digital para reportar estragos diretamente à gestão técnica da Kraken.',
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
    estRangeTitle: 'Orçamento com Preço de Escala',
    estSub: 'Previsões simuladas ajustadas com base nas taxas praticadas em território suíço.',
    perMonth: 'Custo de Manutenção Mensal Estimado',
    perYear: 'Volume Contratual no Ano',
    disclaimer: 'Nota: Esta simulação serve de enquadramento comercial. A Kraken e o nosso sócio Kai farão uma vistoria nas instalações para emitir o preço fixo definitivo correspondente.',
    ctaSubmitText: 'Solicitar contrato técnico formal',
    regionBase: 'Região Operativa Identificada',
    regionSH: '✓ Base Sede Schaffhausen (Sem encargos logísticos adicionais)',
    regionZH: '✓ Cantão de Zurique (Incidência de logística urbana e taxas sobre grandes cidades +22%)',
    regionWT: '✓ Distrito de Winterthur (Devido a rotas e distância da base +12%)',
    regionOther: '✓ Região Suíça Geral (Célula de rota intermédia)',
    successHeading: 'Pedido Técnico B2B Agendado! ⚡',
    successSub: 'Concluiremos a sua proposta formal e custos de adjudicação em 24 horas.',
    successRec: 'Ficha Resumo dos Edifícios :',
    successCard1: 'Um gestor sénior entrará em contacto direto para as medições técnicas de área.',
    successCard2: 'Os pacotes de preços finais, coberturas de responsabilidade civil e apólices serão enviados no orçamento.',
    backToHome: 'Voltar ao Ecrã Inicial'
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
    if (step > 1) {
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

  const handleSubmit = async () => {
    // Validate inputs
    if (!formData.companyName.trim() || !formData.contactName.trim() || !formData.contactEmail.trim() || !formData.postalCode.trim() || !formData.city.trim() || !formData.address.trim()) {
      setErrorMsg(activeLang === 'es' ? 'Por favor complete todos los campos obligatorios (*)' : 'Please fill in all required fields (*), including City and Address');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      // Save data structure to Firestore
      const quoteDetails = {
        type: 'commercial_b2b',
        buildingType: formData.buildingType,
        numBuildings: formData.numBuildings,
        totalArea: formData.totalArea,
        services: formData.services,
        frequency: formData.frequency,
        protocols: formData.protocols,
        postalCode: formData.postalCode,
        city: formData.city,
        hours: formData.hours,
        address: formData.address,
        companyName: formData.companyName,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        floorPlans: formData.floorPlans,
        estimatedMonthlyBudget: monthly,
        estimatedAnnualBudget: annual,
        createdAt: serverTimestamp(),
        language: language,
        status: 'pending'
      };

      await addDoc(collection(db, 'b2b_quotes'), quoteDetails);

      // Trigger standard Webhook to MAKE (same as private leads webhook!)
      try {
        await fetch('https://hook.eu1.make.com/ucxeqjygku2w6zyf9ynut5oantantx58', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...quoteDetails,
            event_source: 'kraken_b2b_calculator',
            title: `Nueva Propuesta B2B - ${formData.companyName}`
          })
        });
      } catch (err) {
        console.warn('Webhook transmission offline, firestore saved', err);
      }

      setComplete(true);
      setStep(5);
    } catch (e: any) {
      console.error('Firestore save failed', e);
      setErrorMsg(e?.message || 'Transaction error on Switzerland core servers. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const zoneFeedback = getZoneByPostalCode(formData.postalCode);

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-20 relative overflow-hidden">
      {/* Wave Decorative Gradients */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-950/40 to-slate-900 pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Header Breadcrumbs */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 font-black rounded-full px-4 py-1.5 text-xs mb-4 uppercase tracking-widest select-none">
            <BuildingIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Corporate B2B Segment</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-sky-300 tracking-tight leading-tight mb-4">
            {texts.title}
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl mx-auto">
            {texts.subtitle}
          </p>
        </div>

        {/* Progress Timeline */}
        {!complete && (
          <div className="mb-8 max-w-2xl mx-auto px-4 select-none">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2.5">
              <span>{texts.step} {step} {texts.of} 4</span>
              <span className="text-sky-400">
                {step === 1 && texts.step1Title}
                {step === 2 && texts.step2Title}
                {step === 3 && texts.step3Title}
                {step === 4 && texts.step4Title}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full"
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Wizard Card */}
          <div className={`${complete ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* STEP 1: PORTFOLIO */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-white mb-2">{texts.step1Title}</h2>
                        <p className="text-slate-400 text-xs md:text-sm">{texts.step1Desc}</p>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-xs md:text-sm font-bold text-slate-200 uppercase tracking-wider">
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
                              className={`flex items-center gap-3 p-4 rounded-2xl border text-left text-xs md:text-sm font-semibold transition-all ${
                                formData.buildingType === item.id
                                  ? 'border-sky-500 bg-sky-500/10 text-white shadow-lg'
                                  : 'border-slate-800/80 bg-slate-900/55 hover:border-slate-700 text-slate-300'
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
                          <label className="block text-xs md:text-sm font-bold text-slate-200 uppercase tracking-wider select-none">
                            {texts.numBuildingsLabel}
                          </label>
                          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl w-fit">
                            <button
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, numBuildings: Math.max(1, p.numBuildings - 1) }))}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700/80 active:scale-95 text-xl font-black transition-all select-none"
                            >
                              -
                            </button>
                            <span className="text-xl font-black text-white w-12 text-center select-none">
                              {formData.numBuildings}
                            </span>
                            <button
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, numBuildings: Math.min(50, p.numBuildings + 1) }))}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700/80 active:scale-95 text-xl font-black transition-all select-none"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="block text-xs md:text-sm font-bold text-slate-200 uppercase tracking-wider">
                              {texts.areaLabel} (m²)
                            </label>
                            <span className="text-lg font-black text-sky-400">
                              {formData.totalArea.toLocaleString()} m²
                            </span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="30000"
                            step="10"
                            value={formData.totalArea}
                            onChange={(e) => setFormData(p => ({ ...p, totalArea: parseInt(e.target.value, 10) }))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
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
                        <h2 className="text-lg md:text-xl font-bold text-white mb-2">{texts.step2Title}</h2>
                        <p className="text-slate-400 text-xs md:text-sm">{texts.step2Desc}</p>
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
                                  ? 'border-sky-500/90 bg-sky-500/10 text-white shadow-lg'
                                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-300'
                              }`}
                            >
                              <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-xl ${isSelected ? 'bg-sky-500' : 'bg-slate-800'}`}>
                                {service.icon}
                              </div>
                              <div>
                                <h3 className="text-xs md:text-sm font-black tracking-tight">{service.label}</h3>
                                <p className="text-[11px] md:text-xs text-slate-400 leading-normal mt-1">{service.desc}</p>
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
                        <h2 className="text-lg md:text-xl font-bold text-white mb-2">{texts.step3Title}</h2>
                        <p className="text-slate-400 text-xs md:text-sm">{texts.step3Desc}</p>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-xs md:text-sm font-bold text-slate-300 uppercase tracking-wider">
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
                                  ? 'border-sky-500 bg-sky-500/15 text-white font-black'
                                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 text-slate-300 text-xs font-semibold'
                              }`}
                            >
                              <span className="text-xl mb-1">{item.icon}</span>
                              <span className="text-[11px] leading-tight break-all">{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <label className="block text-xs md:text-sm font-bold text-slate-300 uppercase tracking-wider">
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
                                    ? 'border-emerald-500/90 bg-emerald-500/5 text-white'
                                    : 'border-slate-800 bg-slate-900/30 hover:border-slate-700/80 text-slate-300'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border ${isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'}`}>
                                  {isSelected && <span className="text-[10px] font-black">✓</span>}
                                </div>
                                <div className="shrink-0 text-xl select-none">{opt.icon}</div>
                                <div>
                                  <h4 className="text-xs font-bold leading-tight">{opt.label}</h4>
                                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{opt.desc}</p>
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
                        <h2 className="text-lg md:text-xl font-bold text-white mb-2">{texts.step4Title}</h2>
                        <p className="text-slate-400 text-xs md:text-sm">{texts.step4Desc}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-300">
                              {texts.postalCodeLabel} *
                            </label>
                            <input
                              type="text"
                              maxLength={6}
                              placeholder={texts.postalCodePlaceholder}
                              value={formData.postalCode}
                              onChange={(e) => setFormData(p => ({ ...p, postalCode: e.target.value }))}
                              className="w-full bg-slate-920 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                            />
                          </div>

                          <div className="space-y-1.5 align-middle">
                            <label className="block text-xs font-bold text-slate-400">
                              {texts.regionBase}
                            </label>
                            <div className="bg-slate-900/80 border border-slate-800/60 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-300 min-h-[42px] flex items-center">
                              {formData.postalCode.trim() ? (
                                <span className={zoneFeedback.zone === 'schaffhausen' ? 'text-emerald-400' : 'text-sky-300'}>
                                  {zoneFeedback.zone === 'schaffhausen' && texts.regionSH}
                                  {zoneFeedback.zone === 'zurich' && texts.regionZH}
                                  {zoneFeedback.zone === 'winterthur' && texts.regionWT}
                                  {zoneFeedback.zone === 'other' && texts.regionOther}
                                </span>
                              ) : (
                                <span className="text-slate-500 italic">Enter CH Postal Code to detect...</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-300">
                              City *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Schaffhausen"
                              value={formData.city}
                              onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                              className="w-full bg-slate-920 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-300">
                              Hours of Service per Week *
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={168}
                              value={formData.hours}
                              onChange={(e) => setFormData(p => ({ ...p, hours: Math.max(1, parseInt(e.target.value, 10) || 1) }))}
                              className="w-full bg-slate-920 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-300">
                            Service Address *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Rheinstrasse 12, 8200 Schaffhausen"
                            value={formData.address}
                            onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                            className="w-full bg-slate-920 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                          />
                        </div>

                        <div className="space-y-2 pt-1">
                          <label className="block text-xs font-bold text-slate-300">
                            Floor Plans & Facility Layouts (Optional)
                          </label>
                          <div 
                            className="border-2 border-dashed border-slate-800 hover:border-sky-500/50 rounded-xl p-6 transition-all bg-slate-900/20 text-center cursor-pointer relative"
                            onClick={() => document.getElementById('floor-plan-upload')?.click()}
                          >
                            <input 
                              id="floor-plan-upload"
                              type="file"
                              multiple
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files) {
                                  Array.from(e.target.files).forEach((file: any) => {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      setFormData(p => ({
                                        ...p,
                                        floorPlans: [
                                          ...(p.floorPlans || []),
                                          {
                                            name: file.name,
                                            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                                            content: event.target?.result as string || ''
                                          }
                                        ]
                                      }));
                                    };
                                    reader.readAsDataURL(file);
                                  });
                                }
                              }}
                            />
                            <div className="flex flex-col items-center justify-center gap-2 select-none">
                              <span className="text-3xl">📤</span>
                              <p className="text-xs font-medium text-slate-300">
                                Drag and drop files here, or <span className="text-sky-400 underline">browse</span>
                              </p>
                              <p className="text-[10px] text-slate-500">
                                Supports PDF, PNG, JPG, JPEG (Max 15MB)
                              </p>
                            </div>
                          </div>

                          {formData.floorPlans && formData.floorPlans.length > 0 && (
                            <div className="space-y-1.5 pt-2">
                              {formData.floorPlans.map((plan, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-900/60 border border-slate-800/80 rounded-lg p-2 text-xs text-white">
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="shrink-0 text-slate-400">📄</span>
                                    <span className="truncate font-medium">{plan.name}</span>
                                    <span className="shrink-0 text-[10px] text-slate-500 font-bold">({plan.size})</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormData(p => ({
                                        ...p,
                                        floorPlans: (p.floorPlans || []).filter((_, i) => i !== index)
                                      }));
                                    }}
                                    className="p-1 hover:bg-slate-800 rounded text-red-400 hover:text-red-300 transition-all text-xs"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="block text-xs font-bold text-slate-300">
                            {texts.companyLabel} *
                          </label>
                          <input
                            type="text"
                            placeholder={texts.companyPlaceholder}
                            value={formData.companyName}
                            onChange={(e) => setFormData(p => ({ ...p, companyName: e.target.value }))}
                            className="w-full bg-slate-920 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-300">
                            {texts.contactLabel} *
                          </label>
                          <input
                            type="text"
                            placeholder={texts.contactPlaceholder}
                            value={formData.contactName}
                            onChange={(e) => setFormData(p => ({ ...p, contactName: e.target.value }))}
                            className="w-full bg-slate-920 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-300">
                              {texts.emailLabel} *
                            </label>
                            <input
                              type="email"
                              placeholder={texts.emailPlaceholder}
                              value={formData.contactEmail}
                              onChange={(e) => setFormData(p => ({ ...p, contactEmail: e.target.value }))}
                              className="w-full bg-slate-920 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-300">
                              {texts.phoneLabel}
                            </label>
                            <input
                              type="tel"
                              placeholder={texts.phonePlaceholder}
                              value={formData.contactPhone}
                              onChange={(e) => setFormData(p => ({ ...p, contactPhone: e.target.value }))}
                              className="w-full bg-slate-920 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                            />
                          </div>
                        </div>

                        {errorMsg && (
                          <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-xl font-bold flex items-center gap-2">
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
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto animate-bounce">
                        ✓
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-black text-white">{texts.successHeading}</h2>
                        <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">{texts.successSub}</p>
                      </div>

                      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-3.5">
                        <h3 className="text-xs font-black uppercase text-sky-400 tracking-wider">
                          {texts.successRec}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                          <div>
                            <span className="text-slate-500 font-bold block">Company</span>
                            <span className="font-extrabold text-white">{formData.companyName}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block">Properties Managed</span>
                            <span className="font-extrabold text-white">{formData.numBuildings} buildings</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block">Area Specs</span>
                            <span className="font-extrabold text-sky-300">{formData.totalArea.toLocaleString()} m²</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block">Contract Baseline</span>
                            <span className="font-bold text-emerald-400">~ CHF {monthly.toLocaleString()}/mo</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left py-4">
                        <div className="flex gap-3 bg-slate-900/40 border border-slate-800/40 p-3.5 rounded-xl">
                          <span className="text-lg">👔</span>
                          <span className="text-[11px] text-slate-400 leading-normal">{texts.successCard1}</span>
                        </div>
                        <div className="flex gap-3 bg-slate-900/40 border border-slate-800/40 p-3.5 rounded-xl">
                          <span className="text-lg">📄</span>
                          <span className="text-[11px] text-slate-400 leading-normal">{texts.successCard2}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onNavigate('home')}
                        className="bg-slate-800 hover:bg-slate-700/80 hover:text-white transition-all text-slate-300 font-black text-xs md:text-sm px-8 py-3.5 rounded-full select-none"
                      >
                        {texts.backToHome}
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons Footer (Not for complete page) */}
              {!complete && (
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800/80 gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1}
                    className={`px-6 py-3 rounded-full text-xs font-black transition-all text-slate-300 ${
                      step === 1
                        ? 'opacity-30 cursor-not-allowed bg-transparent'
                        : 'bg-slate-900 hover:bg-slate-850 active:scale-95'
                    }`}
                  >
                    ← {texts.back}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={submitting}
                    className="bg-gradient-to-r from-sky-400 to-emerald-400 text-slate-950 hover:to-emerald-300 font-black text-xs md:text-sm px-8 py-3 rounded-full flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 select-none shadow-lg shadow-sky-950/20"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent animate-spin rounded-full" />
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
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                  {texts.estRangeTitle}
                </h3>

                <p className="text-slate-400 text-[11px] leading-relaxed mb-6">
                  {texts.estSub}
                </p>

                <div className="space-y-5 pt-4 border-t border-slate-900">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest block">
                      {texts.perMonth}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl md:text-4xl font-black text-emerald-400">
                        CHF ~{monthly.toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-xs font-bold font-handwriting">/mo</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest block font-mono">
                      {texts.perYear}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl md:text-2xl font-black text-slate-300">
                        CHF ~{annual.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-xs font-bold">/yr</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3.5 bg-slate-900/60 border border-slate-800/40 rounded-2xl flex gap-2.5">
                  <InfoIcon className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {texts.disclaimer}
                  </p>
                </div>
              </div>

              {/* Sidebar Trusted Badges */}
              <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                  ))}
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md ml-1 select-none">5/5</span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Guaranteed Swiss Quality
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Our professional managers use eco-responsible standards, maintaining 100+ properties in Schaffhausen, Zürich, and Winterthur without interruption.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CommercialQuotePage;
