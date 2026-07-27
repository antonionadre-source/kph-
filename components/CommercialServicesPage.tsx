import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { MUNICIPALITIES } from '../src/data/locations';
import { getServiceLinkForMunicipality } from '../seoConfig';
import { 
  ShieldCheck, 
  Check, 
  Phone, 
  Calendar, 
  ArrowRight, 
  Info, 
  Building2, 
  Building, 
  Sparkles, 
  Layers, 
  ShoppingBag, 
  Soup, 
  Factory, 
  Briefcase, 
  CheckCircle2, 
  Activity, 
  FileText, 
  Users, 
  Coffee, 
  Boxes, 
  ChevronRight,
  TrendingUp,
  Award,
  ChevronDown
} from 'lucide-react';

interface CommercialServicesPageProps {
  onNavigate: (page: string) => void;
}

// Dictionary for multilingual B2B content matching the mockup images perfectly
const d: Record<string, Record<string, string>> = {
  // Hero
  heroBadge: {
    en: 'B2B & COMMERCIAL SERVICES',
    es: 'SERVICIOS COMERCIALES Y B2B',
    de: 'B2B & GEWERBLICHE REINIGUNG',
    fr: 'SERVICES B2B & COMMERCIAUX',
    it: 'SERVIZI COMMERCIALI E B2B',
    pt: 'SERVIÇOS COMERCIAIS E B2B'
  },
  heroTitle: {
    en: 'Facility Management',
    es: 'Gestión de Instalaciones',
    de: 'Facility Management',
    fr: 'Facility Management',
    it: 'Facility Management',
    pt: 'Facility Management'
  },
  heroSubtitle: {
    en: 'built for Swiss businesses.',
    es: 'para empresas suizas.',
    de: 'für Schweizer Unternehmen.',
    fr: 'pour les entreprises suisses.',
    it: 'per le imprese svizzere.',
    pt: 'para empresas suíças.'
  },
  heroDesc: {
    en: 'Reliable, SLA-based services for offices, property managers, retail, gastronomy and industry across Schaffhausen, Zurich and Winterthur.',
    es: 'Servicios confiables basados en SLA para oficinas, gestores inmobiliarios, comercio minorista, gastronomía e industria en Schaffhausen, Zúrich y Winterthur.',
    de: 'Zuverlässige, SLA-basierte Dienstleistungen für Büros, Liegenschaftsverwaltungen, Detailhandel, Gastronomie und Industrie in Schaffhausen, Zürich und Winterthur.',
    fr: 'Services fiables basés sur des SLA pour bureaux, gérants immobiliers, commerces, gastronomie et industrie à Schaffhouse, Zurich et Winterthour.',
    it: 'Servizi affidabili basati su SLA per uffici, gestori immobiliari, negozi, gastronomia e industria a Sciaffusa, Zurigo e Winterthur.',
    pt: 'Serviços confiáveis baseados em SLA para escritórios, gestores imobiliários, comércio, gastronomia e indústria em Schaffhausen, Zurique e Winterthur.'
  },
  // Buttons
  reqProposal: {
    en: 'Request a Proposal',
    es: 'Solicitar una Propuesta',
    de: 'Angebot anfordern',
    fr: 'Demander un devis',
    it: 'Richiedi una proposta',
    pt: 'Solicitar uma proposta'
  },
  bookCall: {
    en: 'Book a 15-min Call',
    es: 'Reservar llamada de 15 min',
    de: '15-Min. Gespräch buchen',
    fr: 'Réserver un appel de 15 min',
    it: 'Prenota chiamata di 15 min',
    pt: 'Agendar chamada de 15 min'
  },
  // Floating Card Left Column
  buildPlan: {
    en: 'Build your service plan',
    es: 'Diseña tu plan de servicio',
    de: 'Service-Plan erstellen',
    fr: 'Créez votre plan de service',
    it: 'Crea il tuo piano di servizi',
    pt: 'Crie seu plano de serviço'
  },
  getTailored: {
    en: 'Get a tailored proposal in minutes.',
    es: 'Obtén una propuesta a medida en minutos.',
    de: 'Erhalten Sie ein massgeschneidertes Angebot in wenigen Minuten.',
    fr: 'Obtenez une proposition sur mesure en quelques minutes.',
    it: 'Ricevi una proposta su misura in pochi minuti.',
    pt: 'Receba uma proposta sob medida em minutos.'
  },
  propType: {
    en: 'Property type',
    es: 'Tipo de propiedad',
    de: 'Objekttyp',
    fr: 'Type de propriété',
    it: 'Tipo di proprietà',
    pt: 'Tipo de propriedade'
  },
  size: {
    en: 'Size',
    es: 'Tamaño',
    de: 'Grösse',
    fr: 'Taille',
    it: 'Dimensione',
    pt: 'Tamanho'
  },
  location: {
    en: 'Location',
    es: 'Ubicación',
    de: 'Standort',
    fr: 'Localisation',
    it: 'Località',
    pt: 'Localização'
  },
  services: {
    en: 'Services',
    es: 'Servicios',
    de: 'Dienstleistungen',
    fr: 'Services',
    it: 'Servizi',
    pt: 'Serviços'
  },
  averageResp: {
    en: 'Average response time: < 2 hours',
    es: 'Tiempo de respuesta promedio: < 2 horas',
    de: 'Durchschnittliche Antwortzeit: < 2 Std.',
    fr: 'Temps de réponse moyen : < 2 heures',
    it: 'Tempo di risposta medio: < 2 ore',
    pt: 'Tempo médio de resposta: < 2 horas'
  },
  // Floating Card Right Column
  estMonthly: {
    en: 'Estimated monthly investment',
    es: 'Inversión mensual estimada',
    de: 'Geschätzte monatliche Investition',
    fr: 'Investissement mensuel estimé',
    it: 'Investimento mensile stimato',
    pt: 'Investimento mensal estimado'
  },
  getBtn: {
    en: 'Get My Proposal',
    es: 'Obtener mi propuesta',
    de: 'Mein Angebot anfordern',
    fr: 'Obtenir ma proposition',
    it: 'Ottieni la mia proposta',
    pt: 'Obter minha proposta'
  },
  // Checklist on Card
  check1: {
    en: 'SLA response guaranteed',
    es: 'Respuesta SLA garantizada',
    de: 'SLA-Reaktionszeit garantiert',
    fr: 'Réponse SLA garantie',
    it: 'Risposta SLA garantita',
    pt: 'Resposta SLA garantida'
  },
  check2: {
    en: 'Dedicated account manager',
    es: 'Gestor de cuentas dedicado',
    de: 'Persönlicher Kundenbetreuer',
    fr: 'Gestionnaire de compte dédié',
    it: 'Account manager dedicato',
    pt: 'Gestor de conta dedicado'
  },
  check3: {
    en: 'Fixed teams & schedules',
    es: 'Equipos y horarios fijos',
    de: 'Feste Teams & Zeitpläne',
    fr: 'Équipes et horaires fixes',
    it: 'Team e orari fissi',
    pt: 'Equipas e horários fixos'
  },
  check4: {
    en: 'Full insurance & compliance',
    es: 'Seguro y cumplimiento total',
    de: 'Voller Versicherungsschutz & Compliance',
    fr: 'Assurance et conformité complètes',
    it: 'Assicurazione e conformità totali',
    pt: 'Seguro e conformidade total'
  },
  // Solutions
  tailoredSolutions: {
    en: 'TAILORED SOLUTIONS',
    es: 'SOLUCIONES A MEDIDA',
    de: 'MASSGESCHNEIDERTE LÖSUNGEN',
    fr: 'SOLUTIONS SUR MESURE',
    it: 'SOLUZIONI SU MISURA',
    pt: 'SOLUÇÕES SOB MEDIDA'
  },
  solutionsTitle: {
    en: 'Solutions for every commercial environment',
    es: 'Soluciones para cada entorno comercial',
    de: 'Lösungen für jede gewerbliche Umgebung',
    fr: 'Des solutions pour chaque environnement commercial',
    it: 'Soluzioni per ogni ambiente commerciale',
    pt: 'Soluções para cada ambiente comercial'
  },
  // B2B Partner Section
  whyKrakenBadge: {
    en: 'WHY KRAKEN',
    es: 'POR QUÉ KRAKEN',
    de: 'WARUM KRAKEN',
    fr: 'POURQUOI KRAKEN',
    it: 'PERCHÉ KRAKEN',
    pt: 'PORQUÊ A KRAKEN'
  },
  whyKrakenTitle: {
    en: 'A partner invested in your operations and results',
    es: 'Un socio comprometido con tus operaciones y resultados',
    de: 'Ein Partner, der in Ihre Abläufe und Ergebnisse investiert',
    fr: 'Un partenaire investi dans vos opérations et vos résultats',
    it: 'Un partner impegnato nelle tue operazioni e risultati',
    pt: 'Um parceiro investido nas suas operações e resultados'
  },
  b2bInquiryTitle: {
    en: 'B2B Partnership Inquiry',
    es: 'Consulta de Asociación B2B',
    de: 'B2B-Partnerschaftsanfrage',
    fr: 'Demande de partenariat B2B',
    it: 'Richiesta di partnership B2B',
    pt: 'Consulta de Parceria B2B'
  },
  b2bInquiryDesc: {
    en: "Tell us about your needs and we'll prepare a tailored proposal.",
    es: 'Cuéntanos tus necesidades y prepararemos una propuesta a tu medida.',
    de: 'Teilen Sie uns Ihre Bedürfnisse mit und wir erstellen ein massgeschneidertes Angebot.',
    fr: 'Parlez-nous de vos besoins et nous préparerons une proposition sur mesure.',
    it: 'Raccontaci le tue esigenze e prepareremo una proposta su misura.',
    pt: 'Fale-nos sobre as suas necessidades e prepararemos uma proposta sob medida.'
  },
  orBook: {
    en: 'or book a 15-min call',
    es: 'o reserva una llamada de 15 min',
    de: 'oder buchen Sie ein 15-Min. Gespräch',
    fr: 'ou réservez un appel de 15 min',
    it: 'o prenota una chiamata di 15 min',
    pt: 'ou agende uma chamada de 15 min'
  },
  // Modules
  moduleBadge: {
    en: 'OUR COMMERCIAL SERVICE MODULES',
    es: 'NUESTROS MÓDULOS DE SERVICIOS COMERCIALES',
    de: 'UNSERE GEWERBLICHEN SERVICE-MODULE',
    fr: 'NOS MODULES DE SERVICES COMMERCIAUX',
    it: 'I NOSTRI MODULI DI SERVIZIO COMMERCIALE',
    pt: 'NOSSOS MÓDULOS DE SERVIÇOS COMERCIAIS'
  },
  moduleTitle: {
    en: 'Comprehensive services. Premium standards.',
    es: 'Servicios integrales. Estándares premium.',
    de: 'Umfassende Dienstleistungen. Premium-Standards.',
    fr: 'Services complets. Normes premium.',
    it: 'Servizi completi. Standard di livello superiore.',
    pt: 'Serviços abrangentes. Padrões premium.'
  },
  // Process
  processBadge: {
    en: 'OUR PROCESS',
    es: 'NUESTRO PROCESO',
    de: 'UNSER PROZESS',
    fr: 'NOTRE PROCESSUS',
    it: 'IL NOSTRO PROCESSO',
    pt: 'NOSSO PROCESSO'
  },
  processTitle: {
    en: 'Simple. Structured. Reliable.',
    es: 'Simple. Estructurado. Confiable.',
    de: 'Einfach. Strukturiert. Zuverlässig.',
    fr: 'Simple. Structuré. Fiable.',
    it: 'Semplice. Strutturato. Affidabile.',
    pt: 'Simples. Estruturado. Confiável.'
  },
  // Proven Impact
  provenImpactBadge: {
    en: 'PROVEN IMPACT',
    es: 'IMPACTO DEMOSTRADO',
    de: 'BEWIESENE WIRKUNG',
    fr: 'IMPACT PROUVÉ',
    it: 'IMPATTO COMPROVATO',
    pt: 'IMPACTO COMPROVADO'
  },
  provenImpactTitle: {
    en: 'Real results for Swiss businesses',
    es: 'Resultados reales para empresas suizas',
    de: 'Echte Ergebnisse für Schweizer Unternehmen',
    fr: 'Des résultats réels pour les entreprises suisses',
    it: 'Risultati reali per le imprese svizzere',
    pt: 'Resultados reais para empresas suíças'
  },
  // Footer CTA
  readyGetStarted: {
    en: 'READY TO GET STARTED?',
    es: '¿LISTO PARA EMPEZAR?',
    de: 'BEREIT LOSZULEGEN?',
    fr: 'PRÊT À COMMENCER ?',
    it: 'SEI PRONTO PER INIZIARE?',
    pt: 'PRONTO PARA COMEÇAR?'
  },
  footerCtaTitle: {
    en: "Let's build your tailored service plan.",
    es: 'Diseñemos tu plan de servicio a medida.',
    de: 'Lassen Sie uns Ihren massgeschneiderten Service-Plan erstellen.',
    fr: 'Créons votre plan de service sur mesure.',
    it: 'Creiamo il tuo piano di servizi su misura.',
    pt: 'Vamos criar o seu plano de serviço sob medida.'
  },
  footerCtaDesc: {
    en: 'Request a proposal today or book a 15-min call with our team.',
    es: 'Solicita una propuesta hoy o reserva una llamada de 15 min con nuestro equipo.',
    de: 'Fordern Sie noch heute ein Angebot an oder buchen Sie ein 15-minütiges Gespräch mit unserem Team.',
    fr: 'Demandez un devis aujourd\'hui ou réservez un appel de 15 min avec notre équipe.',
    it: 'Richiedi una proposta oggi stesso o prenota un colloquio di 15 minuti con il nostro team.',
    pt: 'Solicite uma proposta hoje ou agende uma chamada de 15 min com a nossa equipa.'
  },
  secureConfidential: {
    en: 'Secure & Confidential',
    es: 'Seguro y confidencial',
    de: 'Sicher & vertraulich',
    fr: 'Sécurisé & confidentiel',
    it: 'Sicuro e riservato',
    pt: 'Seguro e confidencial'
  },
  propOffice: {
    en: 'Office Building',
    es: 'Edificio de Oficinas',
    de: 'Bürogebäude',
    fr: 'Immeuble de bureaux',
    it: 'Edificio di uffici',
    pt: 'Edifício de escritórios'
  },
  propRetail: {
    en: 'Retail Store / Showroom',
    es: 'Tienda minorista / Showroom',
    de: 'Einzelhandel / Showroom',
    fr: 'Magasin / Showroom',
    it: 'Negozio / Showroom',
    pt: 'Loja / Showroom'
  },
  propGastronomy: {
    en: 'Restaurant / Gastronomy',
    es: 'Restaurante / Gastronomía',
    de: 'Restaurant / Gastronomie',
    fr: 'Restaurant / Gastronomie',
    it: 'Ristorante / Gastronomia',
    pt: 'Restaurante / Gastronomia'
  },
  propResidential: {
    en: 'Residential Complex',
    es: 'Complejo Residencial',
    de: 'Wohnkomplex',
    fr: 'Complexe résidentiel',
    it: 'Complesso residenziale',
    pt: 'Complexo residencial'
  },
  propIndustry: {
    en: 'Industrial Site / Logistics',
    es: 'Sitio industrial / Logística',
    de: 'Industriegelände / Logistik',
    fr: 'Site industriel / Logistique',
    it: 'Sito industriale / Logistica',
    pt: 'Área industrial / Logística'
  },
  locZurich: {
    en: 'Zurich Canton',
    es: 'Cantón de Zúrich',
    de: 'Kanton Zürich',
    fr: 'Canton de Zurich',
    it: 'Canton Zurigo',
    pt: 'Cantão de Zurique'
  },
  locSchaffhausen: {
    en: 'Schaffhausen Canton',
    es: 'Cantón de Schaffhausen',
    de: 'Kanton Schaffhausen',
    fr: 'Canton de Schaffhouse',
    it: 'Canton Sciaffusa',
    pt: 'Cantão de Schaffhausen'
  },
  locWinterthur: {
    en: 'Winterthur Region',
    es: 'Región de Winterthur',
    de: 'Region Winterthur',
    fr: 'Région de Winterthour',
    it: 'Regione di Winterthur',
    pt: 'Região de Winterthur'
  },
  srvStandard: {
    en: 'Standard (Office + Restrooms)',
    es: 'Estándar (Oficina + Baños)',
    de: 'Standard (Büro + Toiletten)',
    fr: 'Standard (Bureau + Toilettes)',
    it: 'Standard (Ufficio + Servizi)',
    pt: 'Padrão (Escritório + Banheiros)'
  },
  srvPremium: {
    en: 'Premium (Standard + High Frequency)',
    es: 'Premium (Estándar + Alta Frecuencia)',
    de: 'Premium (Standard + Hochfrequenz)',
    fr: 'Premium (Standard + Haute Fréquence)',
    it: 'Premium (Standard + Alta Frequenza)',
    pt: 'Premium (Padrão + Alta Frequência)'
  },
  srvFull: {
    en: 'Full SLA (Standard + Waste + Windows)',
    es: 'SLA Completo (Estándar + Residuos + Ventanas)',
    de: 'Voll-SLA (Standard + Abfall + Fenster)',
    fr: 'SLA Complet (Standard + Déchets + Vitres)',
    it: 'SLA Completo (Standard + Rifiuti + Finestre)',
    pt: 'SLA Completo (Padrão + Resíduos + Janelas)'
  },
  badgeSla: {
    en: 'SLA',
    es: 'SLA',
    de: 'SLA',
    fr: 'SLA',
    it: 'SLA',
    pt: 'SLA'
  },
  badgeLiability: {
    en: 'Liability',
    es: 'Responsabilidad',
    de: 'Haftpflicht',
    fr: 'Responsabilité',
    it: 'Responsabilità',
    pt: 'Responsabilidade'
  },
  badgeLabor: {
    en: 'Labor',
    es: 'Trabajo',
    de: 'Arbeit',
    fr: 'Travail',
    it: 'Lavoro',
    pt: 'Trabalho'
  },
  badgeAvailability: {
    en: 'Availability',
    es: 'Disponibilidad',
    de: 'Verfügbarkeit',
    fr: 'Disponibilité',
    it: 'Disponibilità',
    pt: 'Disponibilidade'
  },
  badgeStandards: {
    en: 'Standards',
    es: 'Estándares',
    de: 'Standards',
    fr: 'Normes',
    it: 'Standard',
    pt: 'Padrões'
  },
  badgeSlaContract: {
    en: 'SLA Contracts',
    de: 'SLA-Verträge',
    es: 'Contratos SLA',
    fr: 'Contrats SLA',
    it: 'Contratti SLA',
    pt: 'Contratos SLA'
  },
  badgeInsurance: {
    en: 'CHF 10M Insurance',
    de: 'CHF 10M Vers.',
    es: 'Seguro CHF 10M',
    fr: 'Assur. CHF 10M',
    it: 'Assicurazione CHF 10M',
    pt: 'Seguro CHF 10M'
  },
  badgeGav: {
    en: 'GAV Compliance',
    de: 'GAV-Konform',
    es: 'Cumple GAV',
    fr: 'Conforme GAV',
    it: 'Conforme GAV',
    pt: 'Conforme GAV'
  },
  badgeSupport: {
    en: '24/7 Support',
    de: '24/7 Support',
    es: 'Soporte 24/7',
    fr: 'Support 24/7',
    it: 'Supporto 24/7',
    pt: 'Suporte 24/7'
  },
  badgeIso: {
    en: 'ISO / HACCP',
    de: 'ISO / HACCP',
    es: 'ISO / HACCP',
    fr: 'ISO / HACCP',
    it: 'ISO / HACCP',
    pt: 'ISO / HACCP'
  }
};

const solutionServiceMap: Record<string, string> = {
  'property-managers': 'property-managers',
  'airbnb-rentals': 'airbnb-rentals',
  'turnover-cleaning': 'turnover-cleaning',
  'offices-corporate': 'offices-corporate',
  'retail-showrooms': 'retail-showrooms',
  'gastronomy-restaurants': 'gastronomy-restaurants',
  'kitchen-deep-cleaning': 'kitchen-deep-cleaning',
  'industry-logistics': 'industry-logistics'
};

const CommercialServicesPage: React.FC<CommercialServicesPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();

  // Helper to translate string based on language
  const getL = (key: string): string => {
    const entry = d[key];
    if (!entry) return '';
    let langKey = language as string;
    if (langKey === 'de-CH') langKey = 'de';
    return entry[langKey] || entry['en'] || '';
  };

  // Group municipalities by region for selection
  const regionGroups = {
    zuerich: MUNICIPALITIES.filter(m => m.region === 'zuerich').sort((a, b) => a.name.localeCompare(b.name)),
    schaffhausen: MUNICIPALITIES.filter(m => m.region === 'schaffhausen').sort((a, b) => a.name.localeCompare(b.name)),
    winterthur: MUNICIPALITIES.filter(m => m.region === 'winterthur').sort((a, b) => a.name.localeCompare(b.name)),
  };

  // State for interactive proposal calculator
  const [selectedPropType, setSelectedPropType] = useState<string>('office');
  const [selectedSize, setSelectedSize] = useState<string>('800');
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kraken_last_visited_municipality') || 'zurich';
    }
    return 'zurich';
  });
  const [selectedServices, setSelectedServices] = useState<string>('standard');

  // Dynamic estimate generator
  const getEstimatedRange = () => {
    const sizeMultiplier = parseInt(selectedSize) || 800;
    let base = sizeMultiplier * 4.2;
    if (selectedPropType === 'gastronomy') base *= 1.3;
    if (selectedPropType === 'industry') base *= 1.45;
    if (selectedServices === 'premium') base *= 1.25;
    if (selectedServices === 'full') base *= 1.4;

    // Apply regional factor
    const mun = MUNICIPALITIES.find(m => m.slug === selectedLocation);
    let factor = 1.00;
    if (mun) {
      if (mun.region === 'winterthur') factor = 1.12;
      if (mun.region === 'zuerich') factor = 1.22;
    }
    base *= factor;

    const lower = Math.round(base * 0.9 / 50) * 50;
    const upper = Math.round(base * 1.1 / 50) * 50;
    return `CHF ${lower.toLocaleString()}'${(lower % 1000).toString().padStart(3, '0')} – ${upper.toLocaleString()}'${(upper % 1000).toString().padStart(3, '0')}`;
  };

  // Multi-lingual data for the solutions cards
  const solutions = [
    {
      id: 'property-managers',
      title: {
        en: 'Property Managers',
        es: 'Administradores de Propiedades',
        de: 'Immobilienverwalter',
        fr: 'Régies & Gérants',
        it: 'Gestori Immobiliari',
        pt: 'Administradores de Imóveis'
      },
      desc: {
        en: 'Keep properties pristine, tenants satisfied, and operations effortless.',
        es: 'Mantén las propiedades impecables, los inquilinos satisfechos y las operaciones sin esfuerzo.',
        de: 'Halten Sie Liegenschaften makellos, Mieter zufrieden und Abläufe mühelos.',
        fr: 'Conservez vos biens impeccables, vos locataires satisfaits et vos opérations sereines.',
        it: 'Mantieni gli immobili impeccabili, gli inquilini soddisfatti e la gestione semplice.',
        pt: 'Mantenha as propriedades impecáveis, inquilinos satisfeitos e operações fáceis.'
      },
      bullets: {
        en: ['Common areas', 'Move-in / Move-out', 'Preventive maintenance'],
        es: ['Áreas comunes', 'Entradas / Salidas', 'Mantenimiento preventivo'],
        de: ['Allgemeinflächen', 'Einzug / Auszug', 'Präventive Wartung'],
        fr: ['Parties communes', 'Entrées / Sorties de bail', 'Maintenance préventive'],
        it: ['Aree comuni', 'Ingresso / Uscita', 'Manutenzione preventiva'],
        pt: ['Áreas comuns', 'Entrada / Saída', 'Manutenção preventiva']
      },
      imageUrl: '/servicio-comercial-limpieza-escaleras.png',
      icon: <Building className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'airbnb-rentals',
      title: {
        en: 'Airbnb & Short-Term Rentals',
        es: 'Airbnb y Alquileres Vacacionales',
        de: 'Airbnb & Ferienwohnungen',
        fr: 'Airbnb & Locations Courtes',
        it: 'Airbnb e Affitti Brevi',
        pt: 'Airbnb e Aluguer de Curta Duração'
      },
      desc: {
        en: 'Fast turnovers. Five-star reviews. Zero stress.',
        es: 'Rotaciones rápidas. Reseñas de cinco estrellas. Cero estrés.',
        de: 'Schnelle Übergaben. Fünf-Sterne-Bewertungen. Null Stress.',
        fr: 'Rotations rapides. Avis cinq étoiles. Zéro stress.',
        it: 'Turnover rapidi. Recensioni a cinque stelle. Zero stress.',
        pt: 'Rotatividades rápidas. Avaliações cinco estrelas. Zero stress.'
      },
      bullets: {
        en: ['Turnover cleaning', 'Laundry & linen care', 'Restock & inspection'],
        es: ['Limpieza de rotación', 'Cuidado de lavandería', 'Reposición e inspección'],
        de: ['Übergabereinigung', 'Wäsche- & Bettzeugservice', 'Auffüllung & Kontrolle'],
        fr: ['Nettoyage de rotation', 'Gestion du linge', 'Réapprovisionnement & contrôle'],
        it: ['Pulizia di cambio', 'Lavanderia e biancheria', 'Rifornimento e ispezione'],
        pt: ['Limpeza de rotatividade', 'Tratamento de roupa', 'Reposição e inspeção']
      },
      imageUrl: '/imagen-02-google-ai.webp',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'offices-corporate',
      title: {
        en: 'Offices & Corporate',
        es: 'Oficinas y Corporativos',
        de: 'Büros & Unternehmen',
        fr: 'Bureaux & Entreprises',
        it: 'Uffici e Aziende',
        pt: 'Escritórios e Empresas'
      },
      desc: {
        en: 'Healthy workplaces that boost productivity and impression.',
        es: 'Lugares de trabajo saludables que aumentan la productividad y mejoran la impresión.',
        de: 'Gesunde Arbeitsplätze, die Produktivität und Eindruck steigern.',
        fr: 'Des espaces de travail sains pour booster la productivité et votre image.',
        it: 'Luoghi di lavoro salubri che aumentano la produttività e l’immagine.',
        pt: 'Locais de trabalho saudáveis que aumentam a produtividade e imagem.'
      },
      bullets: {
        en: ['Daily office cleaning', 'Restrooms & kitchens', 'Disinfection & supplies'],
        es: ['Limpieza diaria de oficinas', 'Baños y cocinas', 'Desinfección y suministros'],
        de: ['Tägliche Büroreinigung', 'Sanitärräume & Küchen', 'Desinfektion & Verbrauchsmaterial'],
        fr: ['Nettoyage de bureau quotidien', 'Sanitaires & cuisines', 'Désinfection & consommables'],
        it: ['Pulizia quotidiana uffici', 'Servizi igienici e cucine', 'Disinfezione e forniture'],
        pt: ['Limpeza diária de escritórios', 'Casas de banho e cozinhas', 'Desinfecção e consumíveis']
      },
      imageUrl: '/servicio-comercial-limpieza-showroom.png',
      icon: <Briefcase className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'retail-showrooms',
      title: {
        en: 'Retail & Showrooms',
        es: 'Comercios y Showrooms',
        de: 'Detailhandel & Showrooms',
        fr: 'Commerces & Showrooms',
        it: 'Negozi e Showroom',
        pt: 'Lojas e Showrooms'
      },
      desc: {
        en: 'Immaculate spaces that elevate your brand experience.',
        es: 'Espacios impecables que elevan la experiencia de tu marca.',
        de: 'Makellose Räume, die Ihr Markenerlebnis aufwerten.',
        fr: 'Des espaces immaculés qui subliment l’expérience de votre marque.',
        it: 'Spazi immacolati che valorizzano l’esperienza del tuo brand.',
        pt: 'Espaços impecáveis que elevam a experiência da sua marca.'
      },
      bullets: {
        en: ['Floor care', 'Window cleaning', 'Opening / Closing'],
        es: ['Cuidado de pisos', 'Limpieza de cristales', 'Apertura / Cierre'],
        de: ['Bodenpflege', 'Fensterreinigung', 'Eröffnung / Schliessung'],
        fr: ['Entretien des sols', 'Nettoyage des vitres', 'Service d’ouverture / fermeture'],
        it: ['Cura dei pavimenti', 'Pulizia vetrate', 'Apertura / Chiusura'],
        pt: ['Tratamento de pisos', 'Limpeza de vidros', 'Abertura / Fecho']
      },
      imageUrl: '/servicio-comercial-limpieza-retail.png',
      icon: <ShoppingBag className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'gastronomy-restaurants',
      title: {
        en: 'Gastronomy & Restaurants',
        es: 'Gastronomía y Restaurantes',
        de: 'Gastronomie & Restaurants',
        fr: 'Gastronomie & Restaurants',
        it: 'Gastronomia e Ristoranti',
        pt: 'Gastronomia e Restaurantes'
      },
      desc: {
        en: 'Hygiene that protects your guests and reputation.',
        es: 'Higiene que protege a tus comensales y tu reputación.',
        de: 'Hygiene, die Ihre Gäste und Ihren Ruf schützt.',
        fr: 'Une hygiène rigoureuse pour protéger vos clients et votre réputation.',
        it: 'Igiene certificata che protegge i tuoi ospiti e la tua reputazione.',
        pt: 'Higiene que protege os seus clientes e a sua reputação.'
      },
      bullets: {
        en: ['Kitchen deep cleaning', 'HACCP-compliant', 'Grease & exhaust care'],
        es: ['Limpieza profunda de cocinas', 'Cumplimiento HACCP', 'Filtros y extractores de grasa'],
        de: ['Küchen-Tiefenreinigung', 'HACCP-Konformität', 'Fett- & Abzugsreinigung'],
        fr: ['Nettoyage en profondeur cuisine', 'Normes HACCP', 'Entretien des filtres & hottes'],
        it: ['Pulizia profonda cucine', 'Conformità HACCP', 'Cura di grassi e cappe'],
        pt: ['Limpeza profunda de cozinhas', 'Conformidade HACCP', 'Limpeza de gordura e exaustor']
      },
      imageUrl: '/servicio-comercial-limpieza-bar-restaurante.png',
      icon: <Soup className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'industry-logistics',
      title: {
        en: 'Industry & Logistics',
        es: 'Industria y Logística',
        de: 'Industrie & Logistik',
        fr: 'Industrie & Logistique',
        it: 'Industria e Logistica',
        pt: 'Indústria e Logística'
      },
      desc: {
        en: 'Safe, compliant and efficient operations around the clock.',
        es: 'Operaciones seguras, conformes y eficientes las 24 horas.',
        de: 'Sichere, gesetzeskonforme und effiziente Abläufe rund um die Uhr.',
        fr: 'Des opérations sûres, conformes et efficaces 24h/24.',
        it: 'Operazioni sicure, conformi ed efficienti 24 ore su 24.',
        pt: 'Operações seguras, conformes e eficientes 24 horas por dia.'
      },
      bullets: {
        en: ['Industrial cleaning', 'Machine & floor care', 'Warehouses & yards'],
        es: ['Limpieza industrial', 'Cuidado de maquinaria y pisos', 'Almacenes y patios'],
        de: ['Industriereinigung', 'Maschinen- & Hallenpflege', 'Lagerhallen & Werkhöfe'],
        fr: ['Nettoyage industriel', 'Entretien des machines & sols', 'Entrepôts & quais'],
        it: ['Pulizia industriale', 'Cura macchinari e pavimentazioni', 'Magazzini e cortili'],
        pt: ['Limpeza industrial', 'Cuidado de máquinas e pisos', 'Armazéns e pátios']
      },
      imageUrl: '/servicio-comercial-limpieza-industrial.png',
      icon: <Factory className="w-5 h-5 text-blue-600" />
    }
  ];

  // Feature Highlights List for B2B Partnership Left Side
  const b2bFeatures = [
    {
      id: 'acc-manager',
      title: {
        en: 'Dedicated Account Manager',
        es: 'Gestor de Cuentas Dedicado',
        de: 'Persönlicher Kundenbetreuer',
        fr: 'Gestionnaire de Compte Dédié',
        it: 'Account Manager Dedicato',
        pt: 'Gestor de Conta Dedicado'
      },
      desc: {
        en: 'Single point of contact for all your locations.',
        es: 'Punto único de contacto para todas tus ubicaciones.',
        de: 'Ein einziger Ansprechpartner für alle Standorte.',
        fr: 'Un interlocuteur unique pour tous vos sites.',
        it: 'Unico punto di contatto per tutte le sedi.',
        pt: 'Ponto de contacto único para todas as localizações.'
      },
      icon: <Users className="w-6 h-6 text-blue-500" />
    },
    {
      id: 'reporting',
      title: {
        en: 'Monthly Reporting',
        es: 'Informes Mensuales',
        de: 'Monatliche Berichte',
        fr: 'Rapports Mensuels',
        it: 'Report Mensili',
        pt: 'Relatórios Mensais'
      },
      desc: {
        en: 'Transparent reports with photos and KPIs.',
        es: 'Informes transparentes con fotos y KPIs.',
        de: 'Transparente Berichte mit Fotos und KPIs.',
        fr: 'Rapports clairs avec photos et indicateurs clés.',
        it: 'Report trasparenti con foto e indicatori chiave.',
        pt: 'Relatórios transparentes com fotografias e KPIs.'
      },
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />
    },
    {
      id: 'fixed-teams',
      title: {
        en: 'Fixed Teams & Schedules',
        es: 'Equipos y Horarios Fijos',
        de: 'Feste Teams & Zeitpläne',
        fr: 'Équipes & Plannings Fixes',
        it: 'Team e Orari Fissi',
        pt: 'Equipas e Horários Fixos'
      },
      desc: {
        en: 'Consistent quality with trusted professionals.',
        es: 'Calidad constante con profesionales de confianza.',
        de: 'Gleichbleibende Qualität durch vertraute Profis.',
        fr: 'Une qualité constante avec des professionnels de confiance.',
        it: 'Qualità costante con professionisti di fiducia.',
        pt: 'Qualidade consistente com profissionais de confiança.'
      },
      icon: <Calendar className="w-6 h-6 text-blue-500" />
    },
    {
      id: 'invoicing',
      title: {
        en: 'Monthly Invoicing',
        es: 'Facturación Mensual',
        de: 'Monatliche Rechnungsstellung',
        fr: 'Facturation Mensuelle',
        it: 'Fatturazione Mensile',
        pt: 'Faturação Mensal'
      },
      desc: {
        en: 'Predictable billing, no surprises.',
        es: 'Facturas predecibles, sin sorpresas.',
        de: 'Planbare Abrechnung, keine Überraschungen.',
        fr: 'Facturation prévisible, aucune surprise.',
        it: 'Fatturazione prevedibile, senza sorprese.',
        pt: 'Faturação previsível, sem surpresas.'
      },
      icon: <FileText className="w-6 h-6 text-blue-500" />
    },
    {
      id: 'kpis',
      title: {
        en: 'Measurable KPIs',
        es: 'KPIs Medibles',
        de: 'Messbare KPIs',
        fr: 'Indicateurs de Performance',
        it: 'KPI Misurabili',
        pt: 'KPIs Mensuráveis'
      },
      desc: {
        en: 'Quality, attendance and response time tracked.',
        es: 'Calidad, asistencia y tiempo de respuesta monitorizados.',
        de: 'Überwachte Qualität, Anwesenheit und Antwortzeit.',
        fr: 'Contrôle de la qualité, présence et réactivité.',
        it: 'Qualità, presenza e tempi di risposta tracciati.',
        pt: 'Qualidade, assiduidade e tempo de resposta monitorizados.'
      },
      icon: <Activity className="w-6 h-6 text-blue-500" />
    },
    {
      id: 'compliance',
      title: {
        en: 'GAV / AHV / BVG / UVG',
        es: 'GAV / AHV / BVG / UVG',
        de: 'GAV / AHV / BVG / UVG',
        fr: 'GAV / AHV / BVG / UVG',
        it: 'GAV / AHV / BVG / UVG',
        pt: 'GAV / AHV / BVG / UVG'
      },
      desc: {
        en: 'Full Swiss compliance for your peace of mind.',
        es: 'Cumplimiento absoluto de las normativas suizas.',
        de: 'Volle Schweizer Compliance für Ihre Sicherheit.',
        fr: 'Totale conformité suisse pour votre tranquillité.',
        it: 'Piena conformità svizzera per la massima serenità.',
        pt: 'Total conformidade suíça para sua tranquilidade.'
      },
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />
    }
  ];

  // Commercial service modules
  const modules = [
    {
      title: { en: 'Office Cleaning', es: 'Limpieza de Oficinas', de: 'Büroreinigung', fr: 'Nettoyage de Bureau', it: 'Pulizia Uffici', pt: 'Limpeza de Escritórios' },
      desc: {
        en: 'Daily cleaning for offices, meeting rooms and desks.',
        es: 'Limpieza diaria de oficinas, salas de reuniones y escritorios.',
        de: 'Tägliche Reinigung für Büros, Sitzungszimmer und Schreibtische.',
        fr: 'Nettoyage quotidien des bureaux, salles de réunion et postes.',
        it: 'Pulizia giornaliera per uffici, sale riunioni e postazioni.',
        pt: 'Limpeza diária de escritórios, salas de reuniões e secretárias.'
      },
      tags: { en: ['Monthly SLA', 'High Frequency'], es: ['SLA Mensual', 'Alta Frecuencia'], de: ['Monatliches SLA', 'Hohe Frequenz'] },
      icon: <Building className="w-5 h-5 text-blue-600" />
    },
    {
      title: { en: 'Common Area Cleaning', es: 'Limpieza de Áreas Comunes', de: 'Allgemeinflächenreinigung', fr: 'Nettoyage des Parties Communes', it: 'Pulizia Aree Comuni', pt: 'Limpeza de Áreas Comuns' },
      desc: {
        en: 'Lobbies, corridors, stairs and shared spaces.',
        es: 'Vestíbulos, pasillos, escaleras y espacios compartidos.',
        de: 'Lobbys, Korridore, Treppen und Gemeinschaftsräume.',
        fr: 'Halls d’entrée, couloirs, escaliers et espaces partagés.',
        it: 'Hall, corridoi, scale e spazi condivisi.',
        pt: 'Halls, corredores, escadas e espaços partilhados.'
      },
      tags: { en: ['SLA', 'Daily / Weekly'], es: ['SLA', 'Diario / Semanal'], de: ['SLA', 'Täglich / Wöchentlich'] },
      icon: <Users className="w-5 h-5 text-blue-600" />
    },
    {
      title: { en: 'Industrial Maintenance', es: 'Mantenimiento Industrial', de: 'Industriewartung', fr: 'Maintenance Industrielle', it: 'Manutenzione Industriale', pt: 'Manutenção Industrial' },
      desc: {
        en: 'Floors, machinery areas and industrial zones.',
        es: 'Pisos, áreas de maquinaria y zonas industriales.',
        de: 'Böden, Maschinenbereiche und Industriezonen.',
        fr: 'Sols, zones de machines et halls industriels.',
        it: 'Pavimenti, aree macchinari e zone industriali.',
        pt: 'Pisos, áreas de máquinas e zonas industriais.'
      },
      tags: { en: ['Safety First', 'ISO'], es: ['Seguridad', 'Norma ISO'], de: ['Sicherheit First', 'ISO'] },
      icon: <Factory className="w-5 h-5 text-blue-600" />
    },
    {
      title: { en: 'Retail Cleaning', es: 'Limpieza Comercial', de: 'Ladenreinigung', fr: 'Nettoyage de Commerces', it: 'Pulizia Negozi', pt: 'Limpeza de Lojas' },
      desc: {
        en: 'Showrooms, stores and customer-facing areas.',
        es: 'Exposiciones, tiendas y áreas orientadas al cliente.',
        de: 'Showrooms, Geschäfte und kundennahe Bereiche.',
        fr: 'Showrooms, boutiques et espaces ouverts au public.',
        it: 'Showroom, punti vendita e aree aperte al pubblico.',
        pt: 'Showrooms, lojas e áreas de atendimento ao cliente.'
      },
      tags: { en: ['Brand Standards', 'Daily'], es: ['Estándar de Marca', 'Diario'], de: ['Markenstandards', 'Täglich'] },
      icon: <ShoppingBag className="w-5 h-5 text-blue-600" />
    },
    {
      title: { en: 'Restaurant Cleaning', es: 'Limpieza de Restaurantes', de: 'Restaurantreinigung', fr: 'Nettoyage de Restaurant', it: 'Pulizia Ristoranti', pt: 'Limpeza de Restaurantes' },
      desc: {
        en: 'Dining areas, BOH and high-touch surfaces.',
        es: 'Áreas de comedor, cocina (BOH) y superficies de alto contacto.',
        de: 'Essbereiche, Küchen und häufig berührte Oberflächen.',
        fr: 'Salles de restauration, arrière-cuisine et surfaces de contact.',
        it: 'Sale da pranzo, retro e superfici ad alto contatto.',
        pt: 'Salas de jantar, cozinhas e superfícies de alto contacto.'
      },
      tags: { en: ['HACCP', 'Daily'], es: ['HACCP', 'Diario'], de: ['HACCP', 'Täglich'] },
      icon: <Soup className="w-5 h-5 text-blue-600" />
    },
    {
      title: { en: 'High-Density Restroom', es: 'Sanitarios de Alta Frecuencia', de: 'Hochfrequenz-Sanitärräume', fr: 'Sanitaires à Fort Trafic', it: 'Bagni ad Alta Frequenza', pt: 'Sanitários de Alto Fluxo' },
      desc: {
        en: 'Deep cleaning, sanitation and restock.',
        es: 'Limpieza profunda, higienización y reposición de consumibles.',
        de: 'Tiefenreinigung, Desinfektion und Nachfüllung.',
        fr: 'Désinfection rigoureuse, assainissement et réapprovisionnement.',
        it: 'Igienizzazione profonda, sanificazione e rifornimento.',
        pt: 'Higienização profunda, desinfecção e reposição.'
      },
      tags: { en: ['High Frequency', 'SLA'], es: ['Alta Frecuencia', 'SLA'], de: ['Hohe Frequenz', 'SLA'] },
      icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />
    },
    {
      title: { en: 'Kitchen & Breakroom Care', es: 'Cuidado de Cocinas y Comedores', de: 'Küchen- & Pausenraumreinigung', fr: 'Entretien des Cuisines & Cafétérias', it: 'Cura Cucine e Aree Relax', pt: 'Cuidado de Cozinhas e Copas' },
      desc: {
        en: 'Kitchens, appliances and break areas.',
        es: 'Cocinas, electrodomésticos y áreas de descanso de empleados.',
        de: 'Küchen, Haushaltsgeräte und Aufenthaltsbereiche.',
        fr: 'Cuisines d’entreprise, appareils et espaces de détente.',
        it: 'Cucine, elettrodomestici e aree relax.',
        pt: 'Cozinhas, eletrodomésticos e áreas de descanso.'
      },
      tags: { en: ['HACCP', 'Daily'], es: ['HACCP', 'Diario'], de: ['HACCP', 'Täglich'] },
      icon: <Coffee className="w-5 h-5 text-blue-600" />
    },
    {
      title: { en: 'Consumables Supply', es: 'Suministro de Consumibles', de: 'Verbrauchsmaterial-Belieferung', fr: 'Fourniture de Consommables', it: 'Fornitura Consumabili', pt: 'Fornecimento de Consumíveis' },
      desc: {
        en: 'Paper, soap, dispensers and hygiene essentials.',
        es: 'Papel, jabón, dispensadores y productos esenciales de higiene.',
        de: 'Papier, Seife, Spender und wichtige Hygieneartikel.',
        fr: 'Essuie-mains, savon, distributeurs et indispensables d’hygiène.',
        it: 'Carta, sapone, distributori e prodotti essenziali per l’igiene.',
        pt: 'Papel, sabonete, dispensadores e produtos essenciais de higiene.'
      },
      tags: { en: ['Supply', 'Auto Refill'], es: ['Suministro', 'Recarga Auto'], de: ['Lieferung', 'Auto-Auffüllung'] },
      icon: <Boxes className="w-5 h-5 text-blue-600" />
    }
  ];

  // Process timeline steps
  const steps = [
    {
      num: 1,
      title: { en: 'Discovery Call', es: 'Llamada Inicial', de: 'Erstgespräch', fr: 'Appel de découverte', it: 'Chiamata conoscitiva', pt: 'Chamada inicial' },
      desc: {
        en: 'Full understand your needs, sites and expectations.',
        es: 'Comprender a fondo tus necesidades, instalaciones y expectativas.',
        de: 'Umfassendes Verständnis Ihrer Bedürfnisse, Standorte und Erwartungen.',
        fr: 'Compréhension globale de vos besoins, de vos sites et de vos attentes.',
        it: 'Comprensione approfondita di esigenze, sedi e aspettative.',
        pt: 'Compreensão total das suas necessidades, instalações e expectativas.'
      }
    },
    {
      num: 2,
      title: { en: 'Site Audit or Plan Upload', es: 'Auditoría o Subida de Planos', de: 'Besichtigung oder Plan-Upload', fr: 'Audit sur site ou envoi de plan', it: 'Sopralluogo o Invio Planimetria', pt: 'Auditoria ou Envio de Plantas' },
      desc: {
        en: 'On-site visit or remote plan review & assessment.',
        es: 'Visita presencial o revisión y evaluación remota de tus planos.',
        de: 'Besichtigung vor Ort oder digitale Planprüfung und Bewertung.',
        fr: 'Visite sur place ou étude et évaluation de vos plans à distance.',
        it: 'Sopralluogo di persona o valutazione remota dei piani.',
        pt: 'Visita presencial ou análise e avaliação remota das plantas.'
      }
    },
    {
      num: 3,
      title: { en: 'SLA Proposal', es: 'Propuesta de SLA', de: 'SLA-Angebot', fr: 'Proposition SLA', it: 'Proposta SLA', pt: 'Proposta de SLA' },
      desc: {
        en: 'You receive a detailed proposal (PDF) with SLA.',
        es: 'Recibes una propuesta técnica detallada en PDF con compromiso de SLA.',
        de: 'Sie erhalten ein detailliertes Angebot (PDF) mit definiertem SLA.',
        fr: 'Vous recevez un devis technique détaillé (PDF) avec engagement SLA.',
        it: 'Ricevi una proposta formale dettagliata (PDF) con specifiche SLA.',
        pt: 'Recebe uma proposta técnica detalhada (PDF) com compromisso de SLA.'
      }
    },
    {
      num: 4,
      title: { en: 'Team Onboarding', es: 'Integración del Equipo', de: 'Team-Einführung', fr: 'Intégration de l’équipe', it: 'Onboarding del Team', pt: 'Integração da Equipa' },
      desc: {
        en: 'We assign your team and prepare the service plan.',
        es: 'Asignamos a tu equipo especializado y preparamos el plan operativo.',
        de: 'Wir teilen Ihr Team ein und erstellen den detaillierten Einsatzplan.',
        fr: 'Nous sélectionnons votre équipe dédiée et préparons le plan d’intervention.',
        it: 'Assegniamo le risorse dedicate e prepariamo il piano di lavoro.',
        pt: 'Atribuímos a sua equipa dedicada e preparamos o plano operacional.'
      }
    },
    {
      num: 5,
      title: { en: 'Monthly Review', es: 'Revisión Mensual', de: 'Monatliche Überprüfung', fr: 'Bilan Mensuel', it: 'Verifica Mensile', pt: 'Revisão Mensal' },
      desc: {
        en: 'We review KPIs, report results and improve.',
        es: 'Evaluamos juntos los KPIs, reportamos resultados y mejoramos.',
        de: 'Wir prüfen die KPIs, berichten Ergebnisse und optimieren fortlaufend.',
        fr: 'Nous analysons les indicateurs, présentons les résultats et optimisons.',
        it: 'Esaminiamo gli indicatori, condividiamo i risultati e perfezioniamo.',
        pt: 'Analisamos os KPIs, reportamos os resultados e otimizamos.'
      }
    }
  ];

  // Case Studies
  const caseStudies = [
    {
      id: 'case-1',
      title: { en: 'Property Manager – 42 Units', es: 'Gestor Inmobiliario – 42 Unidades', de: 'Liegenschaftsverwaltung – 42 Einheiten', fr: 'Gérant d’immeuble – 42 logements', it: 'Gestore Immobiliare – 42 Unità', pt: 'Administrador de Imóveis – 42 Unidades' },
      desc: {
        en: 'Full service for common areas, move-outs and maintenance.',
        es: 'Servicio completo de zonas comunes, limpiezas de salida y mantenimiento.',
        de: 'Komplettservice für Treppenhäuser, Auszüge und Unterhalt.',
        fr: 'Entretien des parties communes, états des lieux et petite maintenance.',
        it: 'Servizio completo per aree comuni, fine locazione e manutenzione.',
        pt: 'Serviço completo de áreas comuns, fim de contrato e manutenção.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
      stats: [
        { label: { en: 'Tenant satisfaction', es: 'Satisfacción de inquilinos', de: 'Mieterzufriedenheit' }, value: '98%' },
        { label: { en: 'Operating cost', es: 'Costos operativos', de: 'Betriebskosten' }, value: '-18%' }
      ]
    },
    {
      id: 'case-2',
      title: { en: 'Hostel – 80 Rooms', es: 'Hostel – 80 Habitaciones', de: 'Hostel – 80 Zimmer', fr: 'Hostel – 80 Chambres', it: 'Hostel – 80 Camere', pt: 'Hostel – 80 Quartos' },
      desc: {
        en: 'Turnover cleaning & linen service across 7 days.',
        es: 'Limpieza de rotación rápida y gestión de sábanas los 7 días.',
        de: 'Zimmerreinigungs- & Wäscheservice an 7 Tagen die Woche.',
        fr: 'Ménage de rotation et blanchisserie 7 jours sur 7.',
        it: 'Cambio camere e servizio lavanderia 7 giorni su 7.',
        pt: 'Limpeza de rotatividade e tratamento de roupa 7 dias por semana.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600',
      stats: [
        { label: { en: 'Average turnover', es: 'Rotación promedio', de: 'Durchschnittl. Übergabe' }, value: '< 3h' },
        { label: { en: 'Guest rating', es: 'Valoración de huéspedes', de: 'Gästebewertung' }, value: '4.9★' }
      ]
    },
    {
      id: 'case-3',
      title: { en: 'Office – 800 m²', es: 'Oficinas – 800 m²', de: 'Büro – 800 m²', fr: 'Bureaux – 800 m²', it: 'Uffici – 800 m²', pt: 'Escritórios – 800 m²' },
      desc: {
        en: 'Daily cleaning & maintenance with KPI tracking.',
        es: 'Limpieza diaria y mantenimiento preventivo con control de KPIs.',
        de: 'Tägliche Reinigung & Unterhalt mit KPI-Überwachung.',
        fr: 'Nettoyage et entretien quotidien avec suivi des KPI.',
        it: 'Pulizia quotidiana e manutenzione con tracciamento KPI.',
        pt: 'Limpeza diária e manutenção com controlo de KPIs.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600',
      stats: [
        { label: { en: 'Maintenance savings', es: 'Ahorro de mantenimiento', de: 'Wartungseinsparung' }, value: '23%' },
        { label: { en: 'SLA compliance', es: 'Cumplimiento de SLA', de: 'SLA-Einhaltung' }, value: '100%' }
      ]
    }
  ];

  const getLangVal = (obj: Record<string, string>): string => {
    let langKey = language as string;
    if (langKey === 'de-CH') langKey = 'de';
    return obj[langKey] || obj['en'] || '';
  };

  const getLangArr = (obj: Record<string, string[]>): string[] => {
    let langKey = language as string;
    if (langKey === 'de-CH') langKey = 'de';
    return obj[langKey] || obj['en'] || [];
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen font-sans text-slate-800">
      
      {/* 1. Hero Section with Dark Ingress */}
      <section className="relative pt-24 md:pt-36 pb-20 md:pb-28 bg-[#031830] text-white overflow-hidden">
        {/* Subtle grid pattern & artistic ambient gradients */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-2/3 h-full bg-gradient-to-l from-blue-900/40 to-transparent pointer-events-none blur-[100px]"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column - Hero content */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                {getL('heroBadge')}
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
                {getL('heroTitle')}<br />
                <span className="text-[#3b82f6]">{getL('heroSubtitle')}</span>
              </h1>
              
              <p className="text-slate-300 text-base md:text-lg font-normal max-w-xl leading-relaxed mb-8">
                {getL('heroDesc')}
              </p>
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => onNavigate('commercial-quote')}
                  className="bg-[#1e6ffd] hover:bg-blue-600 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  {getL('reqProposal')}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('commercial-quote')}
                  className="border border-slate-600 hover:border-white text-white font-bold text-sm px-8 py-4 rounded-xl transition-all cursor-pointer"
                >
                  {getL('bookCall')}
                </button>
              </div>

              {/* Badges/Features beneath */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-slate-700/50 pt-8">
                {[
                  { key: 'badgeSlaContract', labelKey: 'badgeSla' },
                  { key: 'badgeInsurance', labelKey: 'badgeLiability' },
                  { key: 'badgeGav', labelKey: 'badgeLabor' },
                  { key: 'badgeSupport', labelKey: 'badgeAvailability' },
                  { key: 'badgeIso', labelKey: 'badgeStandards' }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col border border-slate-700/40 rounded-xl p-3 bg-slate-800/20 backdrop-blur-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {getL(item.labelKey)}
                    </span>
                    <span className="text-xs font-black text-white mt-1">
                      {getL(item.key)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Beautiful interactive "Build your service plan" floating card */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl opacity-10 blur-xl pointer-events-none"></div>
              
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 text-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{getL('buildPlan')}</h3>
                    <p className="text-slate-500 text-xs mt-0.5">{getL('getTailored')}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-[9px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    🔒 {getL('secureConfidential')}
                  </span>
                </div>

                {/* Form fields */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{getL('propType')}</label>
                    <div className="relative">
                      <select 
                        value={selectedPropType}
                        onChange={(e) => setSelectedPropType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer text-slate-800"
                      >
                        <option value="office">{getL('propOffice')}</option>
                        <option value="retail">{getL('propRetail')}</option>
                        <option value="gastronomy">{getL('propGastronomy')}</option>
                        <option value="residential">{getL('propResidential')}</option>
                        <option value="industry">{getL('propIndustry')}</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{getL('size')}</label>
                    <div className="relative">
                      <select 
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer text-slate-800"
                      >
                        <option value="150">150 m²</option>
                        <option value="300">300 m²</option>
                        <option value="500">500 m²</option>
                        <option value="800">800 m²</option>
                        <option value="1500">1’500 m²</option>
                        <option value="3000">3’000 m²+</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{getL('location')}</label>
                    <div className="relative">
                      <select 
                        value={selectedLocation}
                        onChange={(e) => {
                          setSelectedLocation(e.target.value);
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('kraken_last_visited_municipality', e.target.value);
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer text-slate-800"
                      >
                        <optgroup label={getL('locZurich')}>
                          {regionGroups.zuerich.map(m => (
                            <option key={m.slug} value={m.slug}>{m.name} ({m.plz[0]})</option>
                          ))}
                        </optgroup>
                        <optgroup label={getL('locSchaffhausen')}>
                          {regionGroups.schaffhausen.map(m => (
                            <option key={m.slug} value={m.slug}>{m.name} ({m.plz[0]})</option>
                          ))}
                        </optgroup>
                        <optgroup label={getL('locWinterthur')}>
                          {regionGroups.winterthur.map(m => (
                            <option key={m.slug} value={m.slug}>{m.name} ({m.plz[0]})</option>
                          ))}
                        </optgroup>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{getL('services')}</label>
                    <div className="relative">
                      <select 
                        value={selectedServices}
                        onChange={(e) => setSelectedServices(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer text-slate-800"
                      >
                        <option value="standard">{getL('srvStandard')}</option>
                        <option value="premium">{getL('srvPremium')}</option>
                        <option value="full">{getL('srvFull')}</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Estimation Results and checklist */}
                <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/50 mb-6">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{getL('estMonthly')}</div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{getEstimatedRange()}</div>
                  
                  <div className="mt-4 space-y-2 border-t border-slate-200/50 pt-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                      <span>{getL('check1')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                      <span>{getL('check2')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                      <span>{getL('check3')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                      <span>{getL('check4')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('commercial-quote')}
                  className="w-full bg-[#1e6ffd] hover:bg-blue-600 text-white font-black text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-md hover:scale-[1.01]"
                >
                  {getL('getBtn')}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-slate-400 text-[10px] font-semibold">
                  <Info className="w-3.5 h-3.5" />
                  <span>{getL('averageResp')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Solutions for every environment Section */}
      <section className="py-20 md:py-28 bg-[#f8fafc]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-3 block">
              {getL('tailoredSolutions')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {getL('solutionsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((item) => (
              <div 
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                onClick={() => {
                  const serviceSlug = solutionServiceMap[item.id];
                  if (serviceSlug) {
                    const targetUrl = getServiceLinkForMunicipality(selectedLocation, serviceSlug);
                    onNavigate(targetUrl);
                  } else {
                    onNavigate('commercial-quote');
                  }
                }}
              >
                {/* Horizontal split-look using responsive layouts */}
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img 
                    src={item.imageUrl} 
                    alt={getLangVal(item.title)} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                  
                  {/* Floating icon box */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg border border-slate-100">
                    {item.icon}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {getLangVal(item.title)}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4">
                      {getLangVal(item.desc)}
                    </p>
                    
                    {/* Bullets layout */}
                    <ul className="space-y-2 mb-6">
                      {getLangArr(item.bullets).map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Check className="w-3.5 h-3.5 text-blue-500 stroke-[3]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-end text-blue-500 group-hover:translate-x-1.5 transition-transform">
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Kraken Section with Grid on Left & Partnership Inquiry on Right */}
      <section className="py-20 md:py-28 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Side: Header & Feature Grid */}
            <div className="lg:col-span-7">
              <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">
                {getL('whyKrakenBadge')}
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-6">
                {getL('whyKrakenTitle')}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                {b2bFeatures.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">{getLangVal(item.title)}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">{getLangVal(item.desc)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: High impact dark card for B2B Partnership Inquiry */}
            <div className="lg:col-span-5 relative">
              {/* Mascot decoration popping out slightly */}
              <div className="absolute -top-12 -right-6 w-20 h-20 opacity-90 select-none z-10 pointer-events-none transform rotate-12 hidden sm:block">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <ellipse cx="50" cy="50" rx="35" ry="30" fill="#0ea5e9" />
                  <circle cx="38" cy="42" r="6" fill="#fff" />
                  <circle cx="38" cy="42" r="3" fill="#000" />
                  <circle cx="62" cy="42" r="6" fill="#fff" />
                  <circle cx="62" cy="42" r="3" fill="#000" />
                  <path d="M40 62 Q50 72 60 62" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
                  {/* tentacles */}
                  <path d="M25 70 Q10 85 30 85" stroke="#0ea5e9" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <path d="M50 78 Q50 95 65 92" stroke="#0ea5e9" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <path d="M75 70 Q90 85 70 85" stroke="#0ea5e9" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              <div className="relative bg-[#02142d] rounded-2xl p-8 md:p-10 text-white shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                
                <h3 className="text-xl font-black mb-2">{getL('b2bInquiryTitle')}</h3>
                <p className="text-slate-300 text-xs mb-8 leading-relaxed">{getL('b2bInquiryDesc')}</p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    { en: 'Site assessment & requirements', es: 'Evaluación y requisitos del sitio', de: 'Standortbeurteilung & Anforderungen' },
                    { en: 'Service plan & SLA', es: 'Plan de servicio y SLA', de: 'Service-Plan & SLA' },
                    { en: 'Team assignment & schedule', es: 'Asignación de equipos y horarios', de: 'Teameinteilung & Zeitplan' },
                    { en: 'Transparent pricing & invoice', es: 'Precios transparentes y factura única', de: 'Transparente Preise & Rechnung' },
                    { en: 'Full compliance & insurance', es: 'Cumplimiento absoluto y seguros', de: 'Volle Compliance & Versicherung' }
                  ].map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-3 text-xs font-bold text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                      </div>
                      <span>{getLangVal(bullet)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onNavigate('commercial-quote')}
                  className="w-full bg-white text-[#02142d] font-black text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg hover:bg-slate-100"
                >
                  {getL('reqProposal')}
                </button>
                
                <div className="text-center mt-4">
                  <button
                    onClick={() => onNavigate('commercial-quote')}
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
                  >
                    {getL('orBook')} →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Commercial Service Modules */}
      <section className="py-20 md:py-28 bg-[#f8fafc]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-3 block">
              {getL('moduleBadge')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {getL('moduleTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-100/80 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-1">{getLangVal(item.title)}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{getLangVal(item.desc)}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {getLangArr(item.tags).map((tag, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-blue-50 text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Process Stepper Timeline */}
      <section className="py-20 md:py-28 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-3 block">
              {getL('processBadge')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {getL('processTitle')}
            </h2>
          </div>

          <div className="relative mt-12">
            {/* Horizontal timeline connecting bar for desktop */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -translate-y-1/2 hidden lg:block pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
              {steps.map((item) => (
                <div key={item.num} className="text-center lg:text-left">
                  <div className="flex flex-col items-center lg:items-start">
                    
                    {/* step bubble */}
                    <div className="w-10 h-10 rounded-full bg-[#1e6ffd] text-white flex items-center justify-center font-bold text-sm shadow-md mb-4 relative z-20">
                      {item.num}
                    </div>
                    
                    <h4 className="text-sm font-black text-slate-900 mb-1">{getLangVal(item.title)}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-xs">{getLangVal(item.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Proven Impact Cases */}
      <section className="py-20 md:py-28 bg-[#f8fafc]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-3 block">
              {getL('provenImpactBadge')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {getL('provenImpactTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((caseItem) => (
              <div 
                key={caseItem.id}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="h-44 rounded-xl overflow-hidden mb-6 bg-slate-50">
                  <img 
                    src={caseItem.imageUrl} 
                    alt={getLangVal(caseItem.title)} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <h3 className="text-base font-black text-slate-900 mb-1">{getLangVal(caseItem.title)}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">{getLangVal(caseItem.desc)}</p>
                
                {/* Visual Stats display matching the image mockup */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                  {caseItem.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="flex flex-col">
                      <span className="text-3xl font-black tracking-tight text-blue-600 mb-0.5">
                        {stat.value}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
                        {getLangVal(stat.label)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom Action Banner */}
      <section className="relative py-20 md:py-28 bg-[#031830] text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/25 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <span className="text-blue-400 font-black text-xs uppercase tracking-[0.4em] mb-4 block">
            {getL('readyGetStarted')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-4">
            {getL('footerCtaTitle')}
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto mb-10 leading-relaxed">
            {getL('footerCtaDesc')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onNavigate('commercial-quote')}
              className="bg-[#1e6ffd] hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              {getL('reqProposal')}
            </button>
            <button 
              onClick={() => onNavigate('commercial-quote')}
              className="border border-slate-600 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105 cursor-pointer"
            >
              {getL('bookCall')}
            </button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default CommercialServicesPage;
