export type CatalogLanguage = 'de' | 'en' | 'es' | 'fr' | 'it' | 'pt';
export function catalogLanguage(language: string): CatalogLanguage { return ['de','en','es','fr','it','pt'].includes(language) ? language as CatalogLanguage : 'de'; }
export interface CatalogService { id: string; audience: 'private' | 'business'; category: string; image: string; width: number; height: number; focus: string[]; wizardId?: string; }
export const CONTACT_SERVICE_IDS: readonly string[] = ["end-of-tenancy", "deep-cleaning", "daily-cleaning", "moving-furniture", "gardening", "exterior-cleaning", "pest-control", "waste-management", "car-detailing", "gutter-cleaning", "upholstery-cleaning", "window-cleaning", "mudanza-cajas", "pulido-suelos", "bar-restaurant-cleaning", "property-managers", "airbnb-rentals", "turnover-cleaning", "offices-corporate", "retail-showrooms", "gastronomy-restaurants", "kitchen-deep-cleaning", "industry-logistics"];
export const SERVICE_CATALOG: readonly CatalogService[] = [
  {
    "id": "end-of-tenancy",
    "audience": "private",
    "category": "cleaning",
    "image": "/kai-calendar/optimized/private/servicio-privado-limpieza-apartamento.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "space",
      "scope",
      "date"
    ],
    "wizardId": "end-of-tenancy"
  },
  {
    "id": "deep-cleaning",
    "audience": "private",
    "category": "cleaning",
    "image": "/kai-calendar/optimized/private/servicio-privado-limpieza-cocina.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "scope",
      "materials",
      "space"
    ],
    "wizardId": "deep-cleaning"
  },
  {
    "id": "daily-cleaning",
    "audience": "private",
    "category": "cleaning",
    "image": "/kai-calendar/optimized/private/servicio-privado-limpieza-oficina-casa.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "frequency",
      "space",
      "access"
    ],
    "wizardId": "daily-cleaning"
  },
  {
    "id": "moving-furniture",
    "audience": "private",
    "category": "moving",
    "image": "/kai-calendar/optimized/private/servicio-privado-mudanza-cajas.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "inventory",
      "access",
      "date"
    ],
    "wizardId": "moving"
  },
  {
    "id": "gardening",
    "audience": "private",
    "category": "outdoor",
    "image": "/kai-calendar/optimized/private/servicio-privado-jardineria.webp",
    "width": 615,
    "height": 768,
    "focus": [
      "space",
      "scope",
      "frequency"
    ]
  },
  {
    "id": "exterior-cleaning",
    "audience": "private",
    "category": "outdoor",
    "image": "/kai-calendar/optimized/private/servicio-privado-limpieza-exterior.webp",
    "width": 615,
    "height": 768,
    "focus": [
      "surface",
      "height",
      "access"
    ]
  },
  {
    "id": "pest-control",
    "audience": "private",
    "category": "special",
    "image": "/kai-calendar/optimized/private/servicio-privado-control-plagas.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "scope",
      "space",
      "date"
    ]
  },
  {
    "id": "waste-management",
    "audience": "private",
    "category": "special",
    "image": "/kai-calendar/optimized/private/servicio-privado-residuos-desalojo.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "inventory",
      "waste",
      "access"
    ]
  },
  {
    "id": "car-detailing",
    "audience": "private",
    "category": "special",
    "image": "/kai-calendar/optimized/private/servicio-privado-lavado-coche.webp",
    "width": 615,
    "height": 768,
    "focus": [
      "vehicle",
      "scope",
      "access"
    ]
  },
  {
    "id": "gutter-cleaning",
    "audience": "private",
    "category": "outdoor",
    "image": "/kai-calendar/optimized/private/servicio-privado-canalones.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "height",
      "access",
      "scope"
    ]
  },
  {
    "id": "upholstery-cleaning",
    "audience": "private",
    "category": "cleaning",
    "image": "/kai-services/upholstery.webp",
    "width": 768,
    "height": 512,
    "focus": [
      "materials",
      "inventory",
      "scope"
    ]
  },
  {
    "id": "window-cleaning",
    "audience": "private",
    "category": "cleaning",
    "image": "/kai-services/windows.webp",
    "width": 768,
    "height": 512,
    "focus": [
      "surface",
      "height",
      "access"
    ]
  },
  {
    "id": "mudanza-cajas",
    "audience": "private",
    "category": "moving",
    "image": "/kai-services/moving.webp",
    "width": 768,
    "height": 512,
    "focus": [
      "inventory",
      "access",
      "date"
    ]
  },
  {
    "id": "pulido-suelos",
    "audience": "private",
    "category": "cleaning",
    "image": "/kai-services/floor-care.webp",
    "width": 768,
    "height": 512,
    "focus": [
      "surface",
      "space",
      "scope"
    ]
  },
  {
    "id": "bar-restaurant-cleaning",
    "audience": "business",
    "category": "business",
    "image": "/kai-calendar/optimized/commercial/gastronomy-restaurants/768.webp",
    "width": 768,
    "height": 960,
    "focus": [
      "site",
      "scope",
      "frequency"
    ]
  },
  {
    "id": "property-managers",
    "audience": "business",
    "category": "business",
    "image": "/kai-calendar/optimized/commercial/property-managers/768.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "site",
      "scope",
      "frequency"
    ]
  },
  {
    "id": "airbnb-rentals",
    "audience": "business",
    "category": "business",
    "image": "/kai-calendar/optimized/commercial/airbnb-rentals/768.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "site",
      "scope",
      "frequency"
    ]
  },
  {
    "id": "turnover-cleaning",
    "audience": "business",
    "category": "business",
    "image": "/kai-calendar/optimized/commercial/airbnb-rentals/768.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "site",
      "scope",
      "frequency"
    ]
  },
  {
    "id": "offices-corporate",
    "audience": "business",
    "category": "business",
    "image": "/kai-calendar/optimized/commercial/offices-corporate/768.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "site",
      "scope",
      "frequency"
    ]
  },
  {
    "id": "retail-showrooms",
    "audience": "business",
    "category": "business",
    "image": "/kai-calendar/optimized/commercial/retail-showrooms/768.webp",
    "width": 768,
    "height": 576,
    "focus": [
      "site",
      "scope",
      "frequency"
    ]
  },
  {
    "id": "gastronomy-restaurants",
    "audience": "business",
    "category": "business",
    "image": "/kai-calendar/optimized/commercial/gastronomy-restaurants/768.webp",
    "width": 768,
    "height": 960,
    "focus": [
      "site",
      "scope",
      "frequency"
    ]
  },
  {
    "id": "kitchen-deep-cleaning",
    "audience": "business",
    "category": "business",
    "image": "/kai-calendar/optimized/commercial/gastronomy-restaurants/768.webp",
    "width": 768,
    "height": 960,
    "focus": [
      "site",
      "scope",
      "frequency"
    ]
  },
  {
    "id": "industry-logistics",
    "audience": "business",
    "category": "business",
    "image": "/kai-calendar/optimized/commercial/industry-logistics/768.webp",
    "width": 768,
    "height": 960,
    "focus": [
      "site",
      "scope",
      "frequency"
    ]
  }
];
const SERVICE_TEXT: Record<CatalogLanguage, { names: string[]; descriptions: string[] }> = {
  "de": {
    "names": [
      "Umzugsreinigung",
      "Grundreinigung",
      "Regelmässige Reinigung",
      "Umzug & Möbeltransport",
      "Gartenpflege",
      "Aussenreinigung",
      "Schädlingsbekämpfung",
      "Räumung & Entsorgung",
      "Fahrzeugpflege",
      "Dachrinnenreinigung",
      "Polsterreinigung",
      "Fensterreinigung",
      "Kartontransport",
      "Bodenpflege",
      "Restaurantreinigung",
      "Liegenschaftsverwaltung",
      "Ferienwohnungen",
      "Reinigung bei Gästewechsel",
      "Büro & Unternehmen",
      "Verkauf & Showrooms",
      "Gastronomie",
      "Küchen-Grundreinigung",
      "Industrie & Logistik"
    ],
    "descriptions": [
      "Die Wohnung vor der Rückgabe gründlich vorbereiten.",
      "Räume und Oberflächen gezielt und sorgfältig reinigen.",
      "Eine passende Reinigungsroutine für Ihren Alltag planen.",
      "Möbel, Zimmer und Studios mit Ford Transit transportieren, abgestimmt auf Inventar und Zugang.",
      "Pflanzen und Aussenbereiche nach Bedarf betreuen.",
      "Geeignete Pflege für Fassaden, Wege und Terrassen abstimmen.",
      "Situation und geeignete Massnahmen zunächst gemeinsam klären.",
      "Umfang, Material und Abtransport im Voraus besprechen.",
      "Innen- und Aussenpflege nach Zustand des Fahrzeugs abstimmen.",
      "Zugang und Reinigungsumfang der Dachrinnen klären.",
      "Stoff, Zustand und Pflegebedarf der Polster berücksichtigen.",
      "Verglasung und Zugang für eine passende Reinigung prüfen.",
      "Kartonmengen, Zugang und Transportweg gemeinsam planen.",
      "Bodenmaterial und gewünschte Behandlung aufeinander abstimmen.",
      "Reinigungsumfang und Zeiten mit dem Betrieb koordinieren.",
      "Gemeinschaftsflächen und laufende Betreuung sinnvoll organisieren.",
      "Die Reinigung auf den Wechsel Ihrer Feriengäste abstimmen.",
      "Ein klarer Ablauf zwischen Abreise und nächster Ankunft.",
      "Reinigung passend zu Arbeitsplätzen und Betriebszeiten planen.",
      "Verkaufsflächen und Präsentationsbereiche gepflegt halten.",
      "Die Pflege Ihrer Gasträume mit den Betriebsabläufen abstimmen.",
      "Geräte, Flächen und Reinigungsbedarf gemeinsam erfassen.",
      "Standortbedingungen, Abläufe und Reinigungsumfang koordinieren."
    ]
  },
  "en": {
    "names": [
      "End-of-tenancy cleaning",
      "Deep cleaning",
      "Regular cleaning",
      "Moving & furniture",
      "Garden care",
      "Exterior cleaning",
      "Pest control",
      "Clearance & waste",
      "Car care",
      "Gutter cleaning",
      "Upholstery cleaning",
      "Window cleaning",
      "Box moving",
      "Floor care",
      "Restaurant cleaning",
      "Property managers",
      "Holiday rentals",
      "Guest turnover cleaning",
      "Offices & workplaces",
      "Retail & showrooms",
      "Hospitality",
      "Kitchen deep cleaning",
      "Industry & logistics"
    ],
    "descriptions": [
      "Prepare the property carefully before handing it back.",
      "Give rooms and surfaces the focused care they need.",
      "Plan a cleaning routine that fits your everyday life.",
      "Furniture, room and studio moves with a Ford Transit, planned around your inventory and access.",
      "Arrange care for plants and outdoor spaces as needed.",
      "Agree suitable care for façades, paths and terraces.",
      "Review the situation and appropriate next steps together.",
      "Discuss the volume, materials and removal arrangements first.",
      "Agree interior and exterior care to suit the vehicle.",
      "Review safe access and the scope of gutter cleaning.",
      "Consider the fabric, condition and care needs of upholstery.",
      "Review the glazing and access for the right cleaning approach.",
      "Plan box quantities, access and the transport route.",
      "Match the treatment to the material and condition of the floor.",
      "Coordinate cleaning scope and timing with your operation.",
      "Organise shared areas and ongoing property care.",
      "Align cleaning with your holiday rental changeovers.",
      "Create a clear plan between departure and the next arrival.",
      "Fit cleaning around your workplace and operating hours.",
      "Care for customer-facing floors and display spaces.",
      "Coordinate guest-area care with everyday operations.",
      "Review equipment, surfaces and the required cleaning scope.",
      "Coordinate site conditions, operations and cleaning requirements."
    ]
  },
  "es": {
    "names": [
      "Limpieza de fin de contrato",
      "Limpieza profunda",
      "Limpieza regular",
      "Mudanzas y muebles",
      "Cuidado del jardín",
      "Limpieza exterior",
      "Control de plagas",
      "Vaciado y residuos",
      "Cuidado del vehículo",
      "Limpieza de canalones",
      "Limpieza de tapicería",
      "Limpieza de ventanas",
      "Transporte de cajas",
      "Cuidado de suelos",
      "Limpieza de restaurantes",
      "Gestores de inmuebles",
      "Alquileres vacacionales",
      "Limpieza entre huéspedes",
      "Oficinas y empresas",
      "Comercios y exposición",
      "Hostelería",
      "Limpieza profunda de cocinas",
      "Industria y logística"
    ],
    "descriptions": [
      "Prepara la vivienda con cuidado antes de su entrega.",
      "Da a cada estancia y superficie la atención que necesita.",
      "Organiza una rutina de limpieza que encaje con tu día a día.",
      "Traslado de muebles, habitaciones y estudios con Ford Transit, según inventario y acceso.",
      "Acuerda el cuidado de plantas y exteriores según sus necesidades.",
      "Define la limpieza adecuada para fachadas, caminos y terrazas.",
      "Revisa la situación y las medidas apropiadas con el equipo.",
      "Concreta primero el volumen, los materiales y su retirada.",
      "Acuerda el cuidado interior y exterior según el estado del vehículo.",
      "Revisa el acceso y el alcance de la limpieza de canalones.",
      "Ten en cuenta el tejido, el estado y el cuidado de la tapicería.",
      "Revisa el tipo de cristales y su acceso antes de la limpieza.",
      "Planifica la cantidad de cajas, el acceso y el recorrido.",
      "Adapta el tratamiento al material y al estado del suelo.",
      "Coordina el alcance y los horarios con la actividad del local.",
      "Organiza el cuidado continuado y de las zonas comunes.",
      "Adapta la limpieza a los cambios de tu alquiler vacacional.",
      "Define un proceso claro entre una salida y la siguiente llegada.",
      "Encaja la limpieza con los puestos y los horarios de trabajo.",
      "Cuida las superficies de venta y los espacios de exposición.",
      "Coordina el cuidado de las zonas de clientes con la operación diaria.",
      "Revisa equipos, superficies y necesidades de limpieza.",
      "Coordina las condiciones del centro, la actividad y el alcance."
    ]
  },
  "fr": {
    "names": [
      "Nettoyage de fin de bail",
      "Nettoyage approfondi",
      "Nettoyage régulier",
      "Déménagement & mobilier",
      "Entretien du jardin",
      "Nettoyage extérieur",
      "Lutte antiparasitaire",
      "Débarras & déchets",
      "Entretien automobile",
      "Nettoyage des gouttières",
      "Nettoyage des textiles",
      "Nettoyage des vitres",
      "Transport de cartons",
      "Entretien des sols",
      "Nettoyage de restaurants",
      "Gérants immobiliers",
      "Locations de vacances",
      "Nettoyage entre séjours",
      "Bureaux & entreprises",
      "Commerces & showrooms",
      "Hôtellerie & restauration",
      "Nettoyage approfondi des cuisines",
      "Industrie & logistique"
    ],
    "descriptions": [
      "Préparez soigneusement le logement avant sa restitution.",
      "Apportez aux pièces et aux surfaces le soin nécessaire.",
      "Organisez une routine de nettoyage adaptée à votre quotidien.",
      "Transport de meubles, chambres et studios avec Ford Transit, selon l’inventaire et les accès.",
      "Prévoyez le soin des plantes et des extérieurs selon leurs besoins.",
      "Définissez un entretien adapté aux façades, allées et terrasses.",
      "Examinez la situation et les mesures appropriées avec notre équipe.",
      "Précisez le volume, les matériaux et les modalités d’enlèvement.",
      "Adaptez le soin intérieur et extérieur à l’état du véhicule.",
      "Vérifiez l’accès et le périmètre du nettoyage des gouttières.",
      "Tenez compte du tissu, de son état et des soins nécessaires.",
      "Vérifiez les vitrages et leur accès avant le nettoyage.",
      "Planifiez les quantités de cartons, les accès et le trajet.",
      "Adaptez le traitement au matériau et à l’état du sol.",
      "Coordonnez le nettoyage et ses horaires avec votre activité.",
      "Organisez l’entretien courant et les espaces communs.",
      "Adaptez le nettoyage aux rotations de votre location de vacances.",
      "Définissez un déroulement clair entre deux séjours.",
      "Adaptez le nettoyage aux espaces et aux horaires de travail.",
      "Prenez soin des surfaces de vente et de présentation.",
      "Coordonnez l’entretien des espaces clients avec votre activité.",
      "Examinez les équipements, les surfaces et les besoins.",
      "Coordonnez les conditions du site, l’activité et le nettoyage."
    ]
  },
  "it": {
    "names": [
      "Pulizia di fine locazione",
      "Pulizia approfondita",
      "Pulizia regolare",
      "Traslochi e mobili",
      "Cura del giardino",
      "Pulizia esterna",
      "Controllo degli infestanti",
      "Sgombero e rifiuti",
      "Cura del veicolo",
      "Pulizia delle grondaie",
      "Pulizia degli imbottiti",
      "Pulizia delle finestre",
      "Trasporto di scatole",
      "Cura dei pavimenti",
      "Pulizia di ristoranti",
      "Gestori immobiliari",
      "Case vacanza",
      "Pulizia tra soggiorni",
      "Uffici e aziende",
      "Negozi e showroom",
      "Ospitalità e ristorazione",
      "Pulizia approfondita delle cucine",
      "Industria e logistica"
    ],
    "descriptions": [
      "Prepara con cura l’abitazione prima della riconsegna.",
      "Dedica a locali e superfici l’attenzione necessaria.",
      "Organizza una routine di pulizia adatta alla tua quotidianità.",
      "Trasporto di mobili, stanze e monolocali con Ford Transit, secondo inventario e accessi.",
      "Concorda la cura di piante ed esterni secondo le necessità.",
      "Definisci un trattamento adatto a facciate, vialetti e terrazze.",
      "Esamina la situazione e gli interventi appropriati con il team.",
      "Definisci prima il volume, i materiali e le modalità di ritiro.",
      "Adatta la cura interna ed esterna alle condizioni del veicolo.",
      "Verifica l’accesso e l’ambito della pulizia delle grondaie.",
      "Considera il tessuto, le condizioni e le cure necessarie.",
      "Verifica il tipo di vetri e l’accesso prima della pulizia.",
      "Pianifica il numero di scatole, l’accesso e il percorso.",
      "Adatta il trattamento al materiale e allo stato del pavimento.",
      "Coordina pulizia e orari con l’attività del locale.",
      "Organizza la cura continuativa e degli spazi comuni.",
      "Adatta la pulizia ai cambi della tua casa vacanza.",
      "Definisci un processo chiaro tra una partenza e il prossimo arrivo.",
      "Adatta la pulizia agli spazi e agli orari di lavoro.",
      "Cura le superfici di vendita e di esposizione.",
      "Coordina la cura degli spazi ospiti con l’attività quotidiana.",
      "Valuta attrezzature, superfici e necessità di pulizia.",
      "Coordina le condizioni del sito, le attività e la pulizia."
    ]
  },
  "pt": {
    "names": [
      "Limpeza de fim de arrendamento",
      "Limpeza profunda",
      "Limpeza regular",
      "Mudanças e mobiliário",
      "Cuidado do jardim",
      "Limpeza exterior",
      "Controlo de pragas",
      "Desocupação e resíduos",
      "Cuidado do veículo",
      "Limpeza de caleiras",
      "Limpeza de estofos",
      "Limpeza de janelas",
      "Transporte de caixas",
      "Cuidado dos pavimentos",
      "Limpeza de restaurantes",
      "Gestores de imóveis",
      "Alojamento de férias",
      "Limpeza entre hóspedes",
      "Escritórios e empresas",
      "Lojas e espaços de exposição",
      "Hotelaria e restauração",
      "Limpeza profunda de cozinhas",
      "Indústria e logística"
    ],
    "descriptions": [
      "Prepare a habitação com cuidado antes da entrega.",
      "Dê a cada divisão e superfície o cuidado necessário.",
      "Organize uma rotina de limpeza ajustada ao seu dia a dia.",
      "Transporte de móveis, quartos e estúdios com Ford Transit, conforme o inventário e os acessos.",
      "Acorde o cuidado das plantas e exteriores conforme necessário.",
      "Defina a limpeza adequada para fachadas, caminhos e terraços.",
      "Analise a situação e as medidas adequadas com a equipa.",
      "Defina primeiro o volume, os materiais e a recolha.",
      "Adapte o cuidado interior e exterior ao estado do veículo.",
      "Verifique o acesso e o âmbito da limpeza das caleiras.",
      "Considere o tecido, o estado e o cuidado dos estofos.",
      "Verifique os vidros e o acesso antes da limpeza.",
      "Planeie a quantidade de caixas, o acesso e o percurso.",
      "Adapte o tratamento ao material e ao estado do pavimento.",
      "Coordene a limpeza e os horários com a atividade do espaço.",
      "Organize o cuidado contínuo e das áreas comuns.",
      "Adapte a limpeza à rotação do alojamento de férias.",
      "Defina um processo claro entre uma saída e a chegada seguinte.",
      "Adapte a limpeza aos espaços e horários de trabalho.",
      "Cuide das superfícies de venda e de exposição.",
      "Coordene o cuidado das áreas dos clientes com a operação diária.",
      "Analise equipamentos, superfícies e necessidades de limpeza.",
      "Coordene as condições do local, a atividade e a limpeza."
    ]
  }
};
export function serviceName(language: string, id: string): string | undefined { const index = CONTACT_SERVICE_IDS.indexOf(id); return index < 0 ? undefined : SERVICE_TEXT[catalogLanguage(language)].names[index]; }
export function serviceDescription(language: string, id: string): string | undefined { const index = CONTACT_SERVICE_IDS.indexOf(id); return index < 0 ? undefined : SERVICE_TEXT[catalogLanguage(language)].descriptions[index]; }
export function catalogService(id: string): CatalogService | undefined { return SERVICE_CATALOG.find(service => service.id === id); }
export function serviceRequestPath(id: string): string { const service = catalogService(id); return service?.wizardId ? '/quote' : service ? `/kontakt?service=${encodeURIComponent(id)}` : '/kontakt'; }
export function startServiceRequest(id: string, onNavigate: (path: string) => void): void {
  const service = catalogService(id);
  if (service?.wizardId) { try { localStorage.setItem('kraken_preselected_service', service.wizardId); } catch { /* The form remains usable without preselection. */ } }
  onNavigate(serviceRequestPath(id));
}
