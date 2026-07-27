import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ChevronRight, Activity, Percent, Clock, ShieldCheck, HelpCircle, Building } from 'lucide-react';
import { MUNICIPALITIES, Municipality } from '../src/data/locations';
import { VALID_SERVICES, getRegionHubUrl, getMunicipalityUrl, getServiceLinkForMunicipality } from '../seoConfig';
import { useTranslation, Language } from '../i18n';

interface CoverageHubPageProps {
  onNavigate: (target: string) => void;
}

const hubTranslations: Record<string, Record<string, string>> = {
  de: {
    badge: 'Schweizer Präzisionsnetzwerk',
    title: 'Unsere Einsatzgebiete & Standorte',
    subtitle: 'Vom historischen Rheinfall in Schaffhausen über das urbane Zentrum Winterthurs bis in den gesamten Grossraum Zürich: Wir erbringen professionelle Facility Services und zertifizierte Reinigungen direkt vor Ihrer Haustür.',
    searchPlaceholder: 'PLZ oder Gemeinde suchen... (z.B. 8302 oder Kloten)',
    statCovered: 'Abgedeckte Gemeinden',
    statResponse: 'Reaktionszeit',
    statSatisfaction: 'Zufriedenheitsrate',
    statStaff: 'Zertifizierte Fachkräfte',
    searchResults: 'Suchergebnisse',
    noResults: 'Keine Gemeinden unter diesem Suchbegriff gefunden. Unser Servicenetz umfasst Kantone SH, ZH und Region Winterthur.',
    allRegions: 'Alle Regionen',
    factor: 'Faktor',
    openHub: 'Regional-Hub öffnen',
    placesIn: 'Gemeinden & PLZ in',
    servicesIn: 'Verfügbare Services & Landingpages in',
    allPlacesIn: 'In allen Orten in',
    faqTitle: 'Häufig gestellte Fragen (FAQ)',
    faqSubtitle: 'Alles zu unserem Servicenetzwerk, den Einsatzgebieten und Wegpauschalen.',
    shDesc: 'Zentrale Abdeckung am Hochrhein und Klettgau. Premium-Unterhalt für historische Altstädte und ländliche Gemeinden.',
    wnDesc: 'Präziser Service für die sechstgrösste Schweizer Stadt und angrenzende Agglomerationsgemeinden.',
    zhDesc: 'Umfassendes Facility Management und Reinigung im gesamten Wirtschafts- und Agglomerationsraum Zürich.',
    shRegion: 'Kanton Schaffhausen',
    wnRegion: 'Region Winterthur',
    zhRegion: 'Region Zürich',
  },
  en: {
    badge: 'Swiss Precision Network',
    title: 'Our Service Areas & Locations',
    subtitle: 'From the historic Rhine Falls in Schaffhausen to the urban center of Winterthur and the entire Greater Zurich Area: We deliver professional facility services and certified cleaning right to your doorstep.',
    searchPlaceholder: 'Search ZIP or municipality... (e.g., 8302 or Kloten)',
    statCovered: 'Covered Municipalities',
    statResponse: 'Response Time',
    statSatisfaction: 'Satisfaction Rate',
    statStaff: 'Certified Specialists',
    searchResults: 'Search Results',
    noResults: 'No municipalities found matching this search term. Our service network covers Cantons SH, ZH, and the Winterthur region.',
    allRegions: 'All Regions',
    factor: 'Factor',
    openHub: 'Open Regional Hub',
    placesIn: 'Municipalities & ZIPs in',
    servicesIn: 'Available Services & Landing Pages in',
    allPlacesIn: 'In all locations in',
    faqTitle: 'Frequently Asked Questions (FAQ)',
    faqSubtitle: 'Everything you need to know about our service network, areas, and travel fees.',
    shDesc: 'Centralized coverage in High Rhine and Klettgau. Premium maintenance for historic towns and rural municipalities.',
    wnDesc: 'Precise service for Switzerland’s sixth-largest city and surrounding agglomeration municipalities.',
    zhDesc: 'Comprehensive facility management and cleaning throughout the Zurich business and agglomeration area.',
    shRegion: 'Canton of Schaffhausen',
    wnRegion: 'Winterthur Region',
    zhRegion: 'Zurich Region',
  },
  es: {
    badge: 'Red de Precisión Suiza',
    title: 'Nuestras Áreas de Servicio y Ubicaciones',
    subtitle: 'Desde las históricas cataratas del Rin en Schaffhausen hasta el centro urbano de Winterthur y toda la región metropolitana de Zúrich: Ofrecemos servicios profesionales de instalaciones y limpieza certificada directamente en su puerta.',
    searchPlaceholder: 'Buscar código postal o municipio... (ej. 8302 o Kloten)',
    statCovered: 'Municipios Cubiertos',
    statResponse: 'Tiempo de Respuesta',
    statSatisfaction: 'Tasa de Satisfacción',
    statStaff: 'Especialistas Certificados',
    searchResults: 'Resultados de Búsqueda',
    noResults: 'No se encontraron municipios con este término de búsqueda. Nuestra red de servicio cubre los cantones SH, ZH y la región de Winterthur.',
    allRegions: 'Todas las Regiones',
    factor: 'Factor',
    openHub: 'Abrir Hub Regional',
    placesIn: 'Municipios y Códigos Postales en',
    servicesIn: 'Servicios Disponibles y Páginas de Aterrizaje en',
    allPlacesIn: 'En todas las localidades de',
    faqTitle: 'Preguntas Frecuentes (FAQ)',
    faqSubtitle: 'Todo lo que necesita saber sobre nuestra red de servicios, áreas y tarifas de viaje.',
    shDesc: 'Cobertura centralizada en el Alto Rin y Klettgau. Mantenimiento premium para cascos históricos y municipios rurales.',
    wnDesc: 'Servicio de precisión para la sexta ciudad más grande de Suiza y los municipios colindantes.',
    zhDesc: 'Gestión integral de instalaciones y limpieza en toda la zona comercial y metropolitana de Zúrich.',
    shRegion: 'Cantón de Schaffhausen',
    wnRegion: 'Región de Winterthur',
    zhRegion: 'Región de Zúrich',
  },
  fr: {
    badge: 'Réseau de Précision Suisse',
    title: 'Nos Zones de Service & Localisations',
    subtitle: 'Des chutes historiques du Rhin à Schaffhouse au centre urbain de Winterthour et à toute la région métropolitaine de Zurich : Nous assurons des services de facility management professionnels et des nettoyages certifiés directement chez vous.',
    searchPlaceholder: 'Rechercher un NPA ou une commune... (ex. 8302 ou Kloten)',
    statCovered: 'Communes Couvertes',
    statResponse: 'Temps de Réponse',
    statSatisfaction: 'Taux de Satisfaction',
    statStaff: 'Spécialistes Certifiés',
    searchResults: 'Résultats de Recherche',
    noResults: 'Aucune commune trouvée pour ce terme de recherche. Notre réseau de service couvre les cantons de SH, ZH et la région de Winterthour.',
    allRegions: 'Toutes les Régions',
    factor: 'Facteur',
    openHub: 'Ouvrir le Hub Régional',
    placesIn: 'Communes & Codes Postaux à',
    servicesIn: 'Services Disponibles & Pages Dédiées à',
    allPlacesIn: 'Dans toutes les localités de',
    faqTitle: 'Foire Aux Questions (FAQ)',
    faqSubtitle: 'Tout ce que vous devez savoir sur notre réseau de services, nos zones d’intervention et nos frais de déplacement.',
    shDesc: 'Couverture centralisée sur le Haut-Rhin et le Klettgau. Entretien premium pour les vieilles villes historiques et les communes rurales.',
    wnDesc: 'Service de précision pour la sixième plus grande ville de Suisse et les communes de son agglomération.',
    zhDesc: 'Gestion globale des bâtiments et nettoyage dans toute la zone économique et d’agglomération de Zurich.',
    shRegion: 'Canton de Schaffhouse',
    wnRegion: 'Région de Winterthour',
    zhRegion: 'Région de Zurich',
  },
  it: {
    badge: 'Rete di Precisione Svizzera',
    title: 'Le Nostre Zone di Servizio e Sedi',
    subtitle: 'Dalle storiche cascate del Reno a Sciaffusa al centro urbano di Winterthur e all’intera area metropolitana di Zurigo: Forniamo servizi professionali di facility management e pulizie certificate direttamente a casa vostra.',
    searchPlaceholder: 'Cerca CAP o comune... (es. 8302 o Kloten)',
    statCovered: 'Comuni Coperti',
    statResponse: 'Tempo di Risposta',
    statSatisfaction: 'Tasso di Soddisfazione',
    statStaff: 'Specialisti Certificati',
    searchResults: 'Risultati della Ricerca',
    noResults: 'Nessun comune trovato per questo termine di ricerca. La nostra rete di servizi copre i cantoni SH, ZH e la regione di Winterthur.',
    allRegions: 'Tutte le Regioni',
    factor: 'Fattore',
    openHub: 'Apri Hub Regionale',
    placesIn: 'Comuni e CAP a',
    servicesIn: 'Servizi Disponibili e Pagine Dedicate a',
    allPlacesIn: 'In tutte le località di',
    faqTitle: 'Domande Frequenti (FAQ)',
    faqSubtitle: 'Tutto quello che c’è da sapere sulla nostra rete di servizi, aree e tariffe di viaggio.',
    shDesc: 'Copertura centralizzata nell’Alto Reno e nel Klettgau. Manutenzione premium per centri storici e comuni rurali.',
    wnDesc: 'Servizio di precisione per la sesta città più grande della Svizzera e i comuni dell’hinterland.',
    zhDesc: 'Gestione integrata degli stabili e pulizia in tutta l’area economica e urbana di Zurigo.',
    shRegion: 'Canton Sciaffusa',
    wnRegion: 'Regione di Winterthur',
    zhRegion: 'Regione di Zurigo',
  },
  pt: {
    badge: 'Rede de Precisão Suíça',
    title: 'Nossas Áreas de Atendimento e Localizações',
    subtitle: 'Das históricas cataratas do Reno em Schaffhausen ao centro urbano de Winterthur e a toda a região metropolitana de Zurique: Oferecemos serviços profissionais de instalações e limpeza certificada diretamente à sua porta.',
    searchPlaceholder: 'Buscar código postal ou município... (ex. 8302 ou Kloten)',
    statCovered: 'Municípios Cobertos',
    statResponse: 'Tempo de Resposta',
    statSatisfaction: 'Taxa de Satisfação',
    statStaff: 'Especialistas Certificados',
    searchResults: 'Resultados de Busca',
    noResults: 'Nenhum município encontrado com este termo de busca. Nossa rede de atendimento cobre os cantões SH, ZH e a região de Winterthur.',
    allRegions: 'Todas as Regiões',
    factor: 'Fator',
    openHub: 'Abrir Hub Regional',
    placesIn: 'Municípios e Códigos Postais em',
    servicesIn: 'Serviços Disponibles e Páginas de Destino em',
    allPlacesIn: 'Em todas as localidades de',
    faqTitle: 'Perguntas Frecuentes (FAQ)',
    faqSubtitle: 'Tudo o que precisa de saber sobre a nossa rede de serviços, áreas e taxas de deslocação.',
    shDesc: 'Cobertura centralizada no Alto Reno e Klettgau. Manutenção premium para centros históricos e municípios rurais.',
    wnDesc: 'Serviço de previsão para a sexta maior cidade da Suíça e municípios limítrofes.',
    zhDesc: 'Gestão integral de instalações e limpeza em toda a área comercial e metropolitana de Zurique.',
    shRegion: 'Cantão de Schaffhausen',
    wnRegion: 'Região de Winterthur',
    zhRegion: 'Região de Zurique',
  }
};

const faqTranslations: Record<string, Array<{ q: string, a: string }>> = {
  de: [
    {
      q: 'Fallen für weiter entfernte Gemeinden zusätzliche Anfahrtsgebühren an?',
      a: 'Unsere Anfahrtsgebühren sind transparent kalkuliert. Für Kernzonen wie Schaffhausen City oder Zürich gilt eine Pauschale von CHF 0.-, während weiter entfernte Gemeinden eine geringe, feste Wegpauschale zwischen CHF 10.- und CHF 25.- aufweisen, die Ihnen bereits vor der Buchung transparent angezeigt wird.'
    },
    {
      q: 'Wie berechnen sich die regionalen Preisunterschiede?',
      a: 'Unsere Dienstleistungen basieren auf kantons- und regionalspezifischen GAV-Lohnstandards sowie betrieblichen Logistikkosten. Kanton Schaffhausen gilt als unser Basis-Tarif (Multiplikator 1.00), Region Winterthur hat einen Faktor von 1.12 und Region Zürich von 1.22.'
    },
    {
      q: 'Bieten Sie die Abnahmegarantie in allen aufgelisteten Gemeinden an?',
      a: 'Ja! Die Schweizer Abnahmegarantie gilt uneingeschränkt für jede von uns durchgeführte Umzugsreinigung (End of Tenancy) in sämtlichen aufgeführten Gemeinden und Kantonen.'
    },
    {
      q: 'Arbeiten Sie mit Subunternehmern oder eigenem Personal?',
      a: 'Kraken PFM setzt ausschliesslich auf festangestelltes, nach Schweizer GAV-Richtlinien fair entlohntes und umfassend haftpflichtversichertes Fachpersonal. Dies garantiert höchste Präzision und Verlässlichkeit.'
    }
  ],
  en: [
    {
      q: 'Are there additional travel fees for more distant municipalities?',
      a: 'Our travel fees are transparently calculated. Core zones such as Schaffhausen City or Zurich have a flat rate of CHF 0.-, while more distant municipalities have a small, fixed travel flat rate between CHF 10.- and CHF 25.-, which is shown transparently before booking.'
    },
    {
      q: 'How are regional price differences calculated?',
      a: 'Our services are based on canton- and region-specific collective labor agreement (GAV) wage standards as well as operational logistics costs. Canton Schaffhausen is our base rate (multiplier 1.00), Winterthur region has a factor of 1.12, and Zurich region has 1.22.'
    },
    {
      q: 'Do you offer the handover guarantee in all listed municipalities?',
      a: 'Yes! The Swiss handover guarantee (Abnahmegarantie) applies without restriction to every move-out cleaning (End of Tenancy) we perform in all listed municipalities and cantons.'
    },
    {
      q: 'Do you work with subcontractors or your own staff?',
      a: 'Kraken PFM relies exclusively on permanent staff who are paid fairly in accordance with Swiss GAV guidelines and are fully covered by liability insurance. This guarantees the highest precision and reliability.'
    }
  ],
  es: [
    {
      q: '¿Se cobran tarifas de viaje adicionales para los municipios más lejanos?',
      a: 'Nuestras tarifas de viaje se calculan de forma transparente. Las zonas centrales como la ciudad de Schaffhausen o Zúrich tienen una tarifa fija de CHF 0.-, mientras que los municipios más lejanos tienen una pequeña tarifa de viaje fija de entre CHF 10.- y CHF 25.-, que se muestra de forma transparente antes de reservar.'
    },
    {
      q: '¿Cómo se calculan las diferencias de precio regionales?',
      a: 'Nuestros servicios se basan en los estándares salariales del convenio colectivo de trabajo (GAV) específicos de cada cantón y región, así como en los costes logísticos operativos. El cantón de Schaffhausen es nuestra tarifa base (multiplicador 1.00), la región de Winterthur tiene un factor de 1.12 y la región de Zúrich de 1.22.'
    },
    {
      q: '¿Ofrecen la garantía de entrega en todos los municipios listados?',
      a: '¡Sí! La garantía de entrega suiza (Abnahmegarantie) se aplica sin restricciones a cada limpieza de fin de alquiler (End of Tenancy) que realizamos en todos los municipios y cantones listados.'
    },
    {
      q: '¿Trabajan con subcontratistas o con personal propio?',
      a: 'Kraken PFM cuenta exclusivamente con personal fijo, remunerado de forma justa según las directrices del GAV suizo y totalmente cubierto por un seguro de responsabilidad civil. Esto garantiza la máxima precisión y fiabilidad.'
    }
  ],
  fr: [
    {
      q: 'Y a-t-il des frais de déplacement supplémentaires pour les communes éloignées ?',
      a: 'Nos frais de déplacement sont calculés en toute transparence. Les zones centrales comme Schaffhouse Ville ou Zurich bénéficient d’un forfait de CHF 0.-, tandis que les communes plus éloignées ont un petit forfait de déplacement fixe entre CHF 10.- et CHF 25.-, affiché clairement avant la réservation.'
    },
    {
      q: 'Comment sont calculées les différences de prix régionales ?',
      a: 'Nos services sont basés sur les normes salariales des conventions collectives de travail (CCT/GAV) spécifiques aux cantons et régions, ainsi que sur les coûts logistiques opérationnels. Le canton de Schaffhouse est notre tarif de base (multiplicateur 1.00), la région de Winterthour a un facteur de 1.12 et la région de Zurich de 1.22.'
    },
    {
      q: 'Offrez-vous la garantie de remise des clés dans toutes les communes listées ?',
      a: 'Oui ! La garantie suisse de remise des clés (garantie de livraison) s’applique sans restriction à chaque nettoyage de fin de bail (End of Tenancy) effectué dans toutes les communes et cantons listés.'
    },
    {
      q: 'Travaillez-vous avec des sous-traitants ou votre propre personnel ?',
      a: 'Kraken PFM s’appuie exclusivement sur du personnel fixe, rémunéré équitablement selon les directives de la CCT suisse et bénéficiant d’une assurance responsabilité civile complète. Cela garantit une précision et une fiabilité maximales.'
    }
  ],
  it: [
    {
      q: 'Ci sono spese di trasferta aggiuntive per i comuni più lontani?',
      a: 'Le nostre spese di trasferta sono calcolate in modo trasparente. Per le zone centrali come Sciaffusa Città o Zurigo si applica una tariffa forfettaria di CHF 0.-, mentre per i comuni più distanti è prevista una piccola tariffa fissa compresa tra CHF 10.- e CHF 25.-, indicata chiaramente prima della prenotazione.'
    },
    {
      q: 'Come si calcolano le differenze di prezzo regionali?',
      a: 'I nostri servizi si basano sugli standard salariali del contratto collettivo di lavoro (GAV) specifici per cantone e regione, nonché sui costi di logistica operativa. Il Canton Sciaffusa è la nostra tariffa base (moltiplicatore 1.00), la regione di Winterthur ha un fattore di 1.12 e la regione di Zurigo di 1.22.'
    },
    {
      q: 'Offrite la garanzia di riconsegna in tutti i comuni elencati?',
      a: 'Sì! La garanzia svizzera di riconsegna (Abnahmegarantie) si applica senza limitazioni a ogni pulizia di fine locazione (End of Tenancy) eseguita in tutti i comuni e cantoni elencati.'
    },
    {
      q: 'Lavorate con subappaltatori o con personale proprio?',
      a: 'Kraken PFM si affida esclusivamente a personale assunto a tempo indeterminato, equamente retribuito secondo le linee guida del GAV svizzero e interamente coperto da assicurazione di responsabilità civile. Questo garantisce la massima precisione e affidabilità.'
    }
  ],
  pt: [
    {
      q: 'Há taxas de deslocação adicionais para os municípios mais distantes?',
      a: 'As nossas taxas de deslocação são calculadas de forma transparente. As zonas centrais, como a cidade de Schaffhausen ou Zurique, têm uma taxa fixa de CHF 0.-, enquanto os municípios mais distantes têm uma pequena taxa de deslocação fixa entre CHF 10.- e CHF 25.-, que é apresentada de forma transparente antes da reserva.'
    },
    {
      q: 'Como são calculadas as diferenças de preços regionais?',
      a: 'Os nossos serviços baseiam-se em normas salariais da convenção coletiva de trabalho (GAV) específicas de cada cantão e região, bem como em custos de logística operacional. O cantão de Schaffhausen é a nossa tarifa base (multiplicador 1.00), a região de Winterthur tem um fator de 1.12 e a região de Zurique de 1.22.'
    },
    {
      q: 'Oferecem a garantia de entrega em todos os municípios listados?',
      a: 'Sim! A garantia de entrega suíça (Abnahmegarantie) aplica-se sem restrições a cada limpeza de fim de contrato (End of Tenancy) que realizamos em todos os municípios e cantões listados.'
    },
    {
      q: 'Trabalham com subempreiteiros ou com pessoal próprio?',
      a: 'A Kraken PFM conta exclusivamente com pessoal permanente, pago de forma justa de acordo com as diretrizes do GAV suíço e totalmente coberto por seguro de responsabilidade civil. Isto garante a máxima precisão e fiabilidade.'
    }
  ]
};

const localizedServiceLabels: Record<string, Record<string, string>> = {
  'end-of-tenancy': {
    de: 'Umzugsreinigung (mit Abnahmegarantie)',
    en: 'Move-out Cleaning (Handover Guarantee)',
    es: 'Limpieza de fin de alquiler (Garantía de entrega)',
    fr: 'Nettoyage de fin de bail (Garantie de remise)',
    it: 'Pulizia di fine locazione (Garanzia di riconsegna)',
    pt: 'Limpeza de fim de contrato (Garantia de entrega)'
  },
  'deep-cleaning': {
    de: 'Tiefenreinigung / Frühlingsreinigung',
    en: 'Deep Cleaning / Spring Refresh',
    es: 'Limpieza a fondo / Limpieza de primavera',
    fr: 'Nettoyage en profondeur / Rafraîchissement',
    it: 'Pulizia profonda / Lavaggio di primavera',
    pt: 'Limpeza profunda / Limpeza de primavera'
  },
  'daily-cleaning': {
    de: 'Unterhaltsreinigung (Abo)',
    en: 'Maintenance Cleaning (Subscription)',
    es: 'Limpieza de mantenimiento (Suscripción)',
    fr: 'Nettoyage d’entretien (Abonnement)',
    it: 'Pulizia di manutenzione (Abbonamento)',
    pt: 'Limpeza de manutenção (Assinatura)'
  },
  'moving-furniture': {
    de: 'Umzugshilfe & Transport',
    en: 'Moving Help & Transport',
    es: 'Ayuda de mudanza y transporte',
    fr: 'Aide au déménagement & transport',
    it: 'Aiuto trasloco e trasporto',
    pt: 'Ajuda de mudança e transporte'
  },
  'gardening': {
    de: 'Gartenpflege & Unterhalt',
    en: 'Gardening & Maintenance',
    es: 'Jardinería y mantenimiento',
    fr: 'Entretien du jardin & espaces verts',
    it: 'Cura del giardino e manutenzione',
    pt: 'Jardinagem e manutenção'
  },
  'exterior-cleaning': {
    de: 'Aussenreinigung & Fassaden',
    en: 'Exterior & Façade Cleaning',
    es: 'Limpieza exterior y fachadas',
    fr: 'Nettoyage extérieur & façades',
    it: 'Pulizia esterna e facciate',
    pt: 'Limpeza exterior e fachadas'
  },
  'pest-control': {
    de: 'Schädlingsbekämpfung',
    en: 'Pest Control',
    es: 'Control de plagas',
    fr: 'Contrôle des nuisibles',
    it: 'Disinfestazione',
    pt: 'Controlo de pragas'
  },
  'waste-management': {
    de: 'Entsorgung & Räumung',
    en: 'Waste Disposal & Clearing',
    es: 'Eliminación de residuos y vaciado',
    fr: 'Élimination des déchets & débarras',
    it: 'Smaltimento rifiuti e sgombero',
    pt: 'Eliminação de resíduos e descarte'
  },
  'car-detailing': {
    de: 'Fahrzeugaufbereitung',
    en: 'Mobile Car Detailing',
    es: 'Estética automotriz móvil',
    fr: 'Esthétique automobile mobile',
    it: 'Dettagliatura auto mobile',
    pt: 'Estética automotiva móvel'
  },
  'gutter-cleaning': {
    de: 'Dachrinnenreinigung',
    en: 'Gutter Cleaning',
    es: 'Limpieza de canaletas',
    fr: 'Nettoyage des gouttières',
    it: 'Pulizia delle grondaie',
    pt: 'Limpeza de calhas'
  },
  'upholstery-cleaning': {
    de: 'Polster- & Teppichreinigung',
    en: 'Upholstery & Carpet Cleaning',
    es: 'Limpieza de tapicería y alfombras',
    fr: 'Nettoyage de tapisseries & tapis',
    it: 'Pulizia di tappeti e tappezzeria',
    pt: 'Limpeza de estofados e tapetes'
  },
  'window-cleaning': {
    de: 'Fenster- & Glasreinigung',
    en: 'Window & Glass Cleaning',
    es: 'Limpieza de ventanas y cristales',
    fr: 'Nettoyage de vitres & fenêtres',
    it: 'Pulizia di finestre e vetrate',
    pt: 'Limpeza de janelas e vidros'
  },
  'mudanza-cajas': {
    de: 'Umzugskartons Lieferservice',
    en: 'Moving Boxes Delivery',
    es: 'Servicio de entrega de cajas de mudanza',
    fr: 'Livraison de cartons de déménagement',
    it: 'Consegna scatole da trasloco',
    pt: 'Entrega de caixas de mudança'
  },
  'pulido-suelos': {
    de: 'Bodenpolitur & Kristallisation',
    en: 'Floor Polishing & Crystallization',
    es: 'Pulido y cristalización de suelos',
    fr: 'Polissage & cristallisation des sols',
    it: 'Lucidatura e cristallizzazione pavimenti',
    pt: 'Polimento e cristalização de pisos'
  },
  'bar-restaurant-cleaning': {
    de: 'Gastro- & Restaurantreinigung',
    en: 'Gastronomy & Restaurant Cleaning',
    es: 'Limpieza de gastronomía y restaurantes',
    fr: 'Nettoyage de restaurants & commerces',
    it: 'Pulizia gastronomia e ristoranti',
    pt: 'Limpeza de gastronomia e restaurantes'
  },
  'property-managers': {
    de: 'Immobilienverwalter Service',
    en: 'Property Managers FM',
    es: 'Administradores de Propiedades',
    fr: 'Régies & Gérants Immobiliers',
    it: 'Gestori Immobiliari',
    pt: 'Administradores de Imóveis'
  },
  'airbnb-rentals': {
    de: 'Airbnb & Ferienwohnungen',
    en: 'Airbnb & Vacation Rentals',
    es: 'Airbnb y Alquileres Vacacionales',
    fr: 'Airbnb & Locations Saisonnières',
    it: 'Airbnb e Affitti Vacanze',
    pt: 'Airbnb e Aluguer de Temporada'
  },
  'turnover-cleaning': {
    de: 'Turnover-Reinigung (Ferienwohnungen)',
    en: 'Turnover Cleaning',
    es: 'Limpieza de rotación',
    fr: 'Nettoyage de rotation',
    it: 'Pulizia dei cambi',
    pt: 'Limpeza de rotatividade'
  },
  'offices-corporate': {
    de: 'Büro- & Gewerbereinigung',
    en: 'Office & Corporate Cleaning',
    es: 'Limpieza de oficinas y corporativos',
    fr: 'Nettoyage de bureaux & entreprises',
    it: 'Pulizia uffici e sedi aziendali',
    pt: 'Limpeza de escritórios e sedes'
  },
  'retail-showrooms': {
    de: 'Laden- & Ausstellungsflächen',
    en: 'Retail & Showrooms',
    es: 'Comercios y showrooms',
    fr: 'Boutiques & showrooms',
    it: 'Negozi e showroom',
    pt: 'Lojas e showrooms'
  },
  'gastronomy-restaurants': {
    de: 'Gastronomie & Restaurants',
    en: 'Gastronomy & Restaurants',
    es: 'Gastronomía y restaurantes',
    fr: 'Gastronomie & restaurants',
    it: 'Gastronomia e ristorazione',
    pt: 'Gastronomia e restaurantes'
  },
  'kitchen-deep-cleaning': {
    de: 'Gastro-Küchenreinigung',
    en: 'Commercial Kitchen Deep Cleaning',
    es: 'Limpieza profunda de cocinas comerciales',
    fr: 'Nettoyage en profondeur de cuisine pro',
    it: 'Pulizia profonda cucine professionali',
    pt: 'Limpeza profunda de cozinhas comerciais'
  },
  'industry-logistics': {
    de: 'Industrie- & Logistikreinigung',
    en: 'Industry & Logistics Cleaning',
    es: 'Limpieza de industria y logística',
    fr: 'Nettoyage industrie & logistique',
    it: 'Pulizia industria e logistica',
    pt: 'Limpeza de indústria e logística'
  }
};

export const CoverageHubPage: React.FC<CoverageHubPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  
  // Safe normalized language selection for dictionaries
  const currentLang = (['en', 'fr', 'it', 'es', 'pt'].includes(language) ? language : 'de') as 'de' | 'en' | 'fr' | 'it' | 'es' | 'pt';

  const getL = (key: string) => {
    const dict = hubTranslations[currentLang] || hubTranslations['de'];
    return dict[key] || hubTranslations['de'][key] || key;
  };

  const [activeTab, setActiveTab] = useState<'all' | 'schaffhausen' | 'winterthur' | 'zuerich'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Group municipalities by region
  const regions = [
    {
      id: 'schaffhausen',
      name: getL('shRegion'),
      multiplier: '1.00',
      description: getL('shDesc'),
      hubUrl: '/reinigung/kanton-schaffhausen',
      municipalities: MUNICIPALITIES.filter(m => m.region === 'schaffhausen')
    },
    {
      id: 'winterthur',
      name: getL('wnRegion'),
      multiplier: '1.12',
      description: getL('wnDesc'),
      hubUrl: '/reinigung/region-winterthur',
      municipalities: MUNICIPALITIES.filter(m => m.region === 'winterthur')
    },
    {
      id: 'zuerich',
      name: getL('zhRegion'),
      multiplier: '1.22',
      description: getL('zhDesc'),
      hubUrl: '/reinigung/region-zuerich',
      municipalities: MUNICIPALITIES.filter(m => m.region === 'zuerich')
    }
  ];

  // Filter municipalities based on query
  const filteredMunicipalities = MUNICIPALITIES.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.plz.some(p => p.includes(searchQuery))
  );

  const stats = [
    { label: getL('statCovered'), value: '40+', icon: MapPin, color: 'text-blue-500' },
    { label: getL('statResponse'), value: currentLang === 'de' ? '< 2 Std.' : '< 2 hr', icon: Clock, color: 'text-emerald-500' },
    { label: getL('statSatisfaction'), value: '99.4%', icon: Percent, color: 'text-amber-500' },
    { label: getL('statStaff'), value: '100%', icon: ShieldCheck, color: 'text-indigo-500' }
  ];

  const faqs = faqTranslations[currentLang] || faqTranslations['de'];

  // FAQ Schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen pt-24 pb-16 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-white/5">
        <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{getL('badge')}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
          >
            {getL('title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            {getL('subtitle')}
          </motion.p>

          {/* Instant Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 max-w-xl mx-auto relative group"
          >
            <input
              type="text"
              placeholder={getL('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium outline-none focus:border-blue-400 transition-all focus:bg-white/10 text-white shadow-2xl backdrop-blur-md"
            />
            <MapPin className="absolute left-4 top-4.5 text-slate-500 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white/2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => (
              <div key={idx} className="flex gap-4 items-center bg-white/5 border border-white/5 p-6 rounded-2xl">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs font-semibold text-slate-400">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Results / All Regions */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {searchQuery ? (
          <div>
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span>{getL('searchResults')} ({filteredMunicipalities.length})</span>
            </h2>
            
            {filteredMunicipalities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredMunicipalities.map(mun => (
                  <a
                    key={mun.slug}
                    href={getMunicipalityUrl(mun.slug)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(getMunicipalityUrl(mun.slug));
                    }}
                    className="flex flex-col items-start p-4 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 transition-all group text-left"
                  >
                    <span className="text-xs text-blue-400 font-bold mb-1">PLZ {mun.plz[0]}</span>
                    <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{mun.name}</span>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 mt-2">Region {mun.region}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/2 rounded-2xl border border-white/5">
                <p className="text-slate-400">{getL('noResults')}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                  activeTab === 'all'
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {getL('allRegions')}
              </button>
              {regions.map(r => (
                <button
                  key={r.id}
                  onClick={() => setActiveTab(r.id as any)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                    activeTab === r.id
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>

            {/* Regions rendering */}
            <div className="space-y-16">
              {regions
                .filter(r => activeTab === 'all' || r.id === activeTab)
                .map(region => (
                  <div key={region.id} className="bg-white/2 border border-white/5 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-blue-500/5 to-transparent opacity-50" />
                    
                    <div className="grid lg:grid-cols-12 gap-8 items-start mb-10 pb-8 border-b border-white/5">
                      <div className="lg:col-span-8">
                        <div className="flex items-center gap-3 mb-4">
                          <h2 className="text-2xl md:text-3xl font-black text-white">{region.name}</h2>
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                            {getL('factor')} {region.multiplier}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed">{region.description}</p>
                      </div>
                      
                      <div className="lg:col-span-4 lg:text-right flex lg:justify-end">
                        <a
                          href={region.hubUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(region.hubUrl);
                          }}
                          className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-wider text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>{getL('openHub')}</span>
                          <ChevronRight className="w-4 h-4 text-blue-500" />
                        </a>
                      </div>
                    </div>

                    {/* Municipality Subsections as Chips */}
                    <div className="mb-10">
                      <h3 className="text-xs uppercase tracking-[0.3em] text-blue-400 font-black mb-6 flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-400" />
                        <span>{getL('placesIn')} {region.name}</span>
                      </h3>
                      
                      <div className="flex flex-wrap gap-2.5">
                        {region.municipalities.map(mun => (
                          <a
                            key={mun.slug}
                            href={getMunicipalityUrl(mun.slug)}
                            onClick={(e) => {
                              e.preventDefault();
                              onNavigate(getMunicipalityUrl(mun.slug));
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 text-xs font-bold text-slate-300 hover:text-white transition-all hover:-translate-y-0.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>{mun.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">({mun.plz[0]})</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Services Subsections for this specific Region */}
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.3em] text-blue-400 font-black mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span>{getL('servicesIn')} {region.name}</span>
                      </h3>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {VALID_SERVICES.map(srvId => {
                          const routeCity = region.id === 'zuerich' ? 'zurich' : region.id;
                          const targetUrl = `/services/${routeCity}/${srvId}`;
                          const labelEntry = localizedServiceLabels[srvId];
                          const localizedServiceLabel = labelEntry 
                            ? (labelEntry[currentLang] || labelEntry['de']) 
                            : srvId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                          return (
                            <a
                              key={srvId}
                              href={targetUrl}
                              onClick={(e) => {
                                e.preventDefault();
                                onNavigate(targetUrl);
                              }}
                              className="flex items-center justify-between p-4 rounded-2xl bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all text-left group"
                            >
                              <div className="pr-3">
                                <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                                  {localizedServiceLabel || srvId}
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium mt-1">{getL('allPlacesIn')} {region.name}</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                            </a>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                ))}
            </div>
          </div>
        )}
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-white/5">
        <h2 className="text-3xl font-black text-center mb-4 tracking-tight">{getL('faqTitle')}</h2>
        <p className="text-center text-slate-400 text-sm mb-12">{getL('faqSubtitle')}</p>
        
        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div key={idx} className="bg-white/2 border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/2 transition-colors"
              >
                <span className="text-sm md:text-base font-bold text-white pr-4">{f.q}</span>
                <HelpCircle className={`w-5 h-5 text-blue-500 transition-transform flex-shrink-0 ${expandedFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {expandedFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 pt-0 border-t border-white/5 text-xs md:text-sm text-slate-400 leading-relaxed bg-white/1">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default CoverageHubPage;
