// Highly researched local facts and synthesis engine for "What You Should Know" section
// Fully localized in German, English, Spanish, French, Italian, and Portuguese

const getServiceCategory = (serviceId: string): string => {
  const sId = serviceId.toLowerCase();
  if (['end-of-tenancy', 'deep-cleaning', 'daily-cleaning', 'office-cleaning', 'upholstery-cleaning', 'window-cleaning', 'common-area-cleaning', 'pulido-suelos'].includes(sId)) {
    return 'cleaning';
  }
  if (['moving-furniture', 'waste-management', 'mudanza-cajas', 'zugelboxen'].includes(sId)) {
    return 'logistics';
  }
  if (['gardening', 'exterior-cleaning', 'gutter-cleaning'].includes(sId)) {
    return 'outdoor';
  }
  if (['retail-management', 'bar-restaurant-cleaning', 'industrial-maintenance'].includes(sId)) {
    return 'commercial';
  }
  return 'special';
};

// Raw researched facts per city in 6 languages
const CITY_BASE_FACTS: Record<string, {
  fact1: Record<string, string>; // Environmental Fact
  fact2: Record<string, string>; // Geographical/Structural Fact
  fact3: Record<string, string>; // Regulatory/Community Fact
}> = {
  neuhausen: {
    fact1: {
      de: "Die feine Gischt des Rheinfalls trägt winzige Wassertröpfchen mit gelöstem Kalk in die Luft.",
      en: "The micro-fine spray from the Rhine Falls carries dissolved limestone droplets into the local air.",
      es: "La fina brisa de las cataratas del Rin transporta diminutas gotas de agua con cal disuelta en el aire.",
      fr: "La fine brume des chutes du Rhin transporte des micro-gouttelettes de calcaire dans l'air local.",
      it: "La nebbia sottile delle cascate del Reno trasporta minuscole gocce d'acqua calcarea nell'aria.",
      pt: "A névoa fina das cataratas do Reno transporta gotículas de água com calcário dissolvido para o ar."
    },
    fact2: {
      de: "Die steilen Hänge rund um den Galgenbuck und das Rheinufer prägen die lokalen Zufahrten.",
      en: "The steep slopes around Galgenbuck and the Rhine basin shape the local access routes.",
      es: "Las empinadas laderas alrededor de Galgenbuck y la cuenca del Rin definen los accesos locales.",
      fr: "Les pentes abruptes du Galgenbuck et du bassin du Rhin caractérisent les voies d'accès locales.",
      it: "Le ripide salite del Galgenbuck e del bacino del Reno caratterizzano le vie d'accesso locali.",
      pt: "As encostas íngremes ao redor de Galgenbuck e da bacia do Reno moldam os acessos locais."
    },
    fact3: {
      de: "Die historische SIG-Industriezone vereint alte Bausubstanz mit modernen Nutzungszonen.",
      en: "The historic SIG industrial area combines old industrial brickwork with modern commercial zones.",
      es: "La histórica zona industrial de SIG combina antiguas estructuras de ladrillo con zonas comerciales.",
      fr: "La zone industrielle historique SIG mêle d'anciens bâtiments en brique et des espaces modernes.",
      it: "La storica area industriale SIG combina vecchi edifici in mattoni con moderne zone commerciali.",
      pt: "A histórica zona industrial da SIG combina antigas estruturas com áreas comerciais modernas."
    }
  },
  schaffhausen: {
    fact1: {
      de: "Das Trinkwasser im Kanton Schaffhausen weist eine hohe Kalkhärte von bis zu 30°fH auf.",
      en: "The regional drinking water in Schaffhausen has an exceptionally high limestone hardness of up to 30°fH.",
      es: "El agua potable de Schaffhausen presenta una elevada dureza calcárea de hasta 30°fH.",
      fr: "L'eau potable de Schaffhouse présente une dureté calcaire exceptionnellement élevée allant jusqu'à 30°fH.",
      it: "L'acqua potabile di Sciaffusa presenta un'elevata durezza calcarea che raggiunge i 30°fH.",
      pt: "A água potável de Schaffhausen apresenta uma dureza calcária excepcionalmente alta de até 30°fH."
    },
    fact2: {
      de: "Die historische Altstadt zeichnet sich durch 171 reich verzierte Erker und Kopfsteinpflastergassen aus.",
      en: "The historic Old Town features 171 beautifully decorated bay windows and cobblestone alleys.",
      es: "El casco antiguo destaca por sus 171 ventanas mirador decoradas y calles de adoquines.",
      fr: "La vieille ville historique se caractérise par ses 171 fenêtres en saillie sculptées et ses ruelles pavées.",
      it: "Il centro storico si distingue per i suoi 171 bovindi finemente decorati e le strade acciottolate.",
      pt: "O centro histórico destaca-se por 171 janelas de sacada ricamente decoradas e ruas de paralelos."
    },
    fact3: {
      de: "Die exponierten Höhenlagen wie das Herblingen-Plateau sind starken Windeinflüssen ausgesetzt.",
      en: "The exposed elevated quarters like the Herblingen plateau are subject to high wind currents.",
      es: "Las zonas residenciales expuestas como la meseta de Herblingen sufren fuertes corrientes de viento.",
      fr: "Les quartiers surélevés et exposés comme le plateau de Herblingen subissent de forts courants de vent.",
      it: "I quartieri collinari esposti come l'altopiano di Herblingen sono soggetti a forti correnti di vento.",
      pt: "As áreas residenciais elevadas como o planalto de Herblingen estão expostas a fortes ventos."
    }
  },
  zurich: {
    fact1: {
      de: "Die unmittelbare Nähe zum Zürichsee sorgt für hohe Luftfeuchtigkeit und feinen Pollenflug.",
      en: "The close proximity to Lake Zurich creates high atmospheric humidity and fine organic pollen layers.",
      es: "La proximidad directa al lago de Zúrich genera una alta humedad y acumulación de polen fino.",
      fr: "La proximité du lac de Zurich entraîne une forte humidité de l'air et d'importants dépôts de pollen.",
      it: "La vicinanza al lago di Zurigo causa un'elevata umidità dell'aria e depositi di polline fine.",
      pt: "A proximidade ao lago de Zurique gera uma alta humidade do ar e depósitos de pólen fino."
    },
    fact2: {
      de: "Die dichten, engen Einbahnstrassen des Zürcher Stadtzentrums schränken den physischen Zugang ein.",
      en: "The dense, narrow one-way streets of Zurich's city center restrict physical access routes.",
      es: "Las estrechas calles de sentido único del centro de Zúrich limitan los accesos directos.",
      fr: "Les rues d'accès étroites et à sens unique du centre-ville de Zurich restreignent les accès physiques.",
      it: "Le strette strade a senso unico del centro di Zurigo limitano i percorsi di accesso fisico.",
      pt: "As ruas estreitas de sentido único do centro de Zurique limitam o acesso físico direto."
    },
    fact3: {
      de: "Der kantonale Hauseigentümerverband HEV Zürich wendet äusserst strikte Abgaberichtlinien an.",
      en: "The cantonal landlord association HEV Zurich enforces exceptionally strict property handover standards.",
      es: "La asociación de propietarios HEV de Zúrich aplica normas de entrega de inmuebles muy estrictas.",
      fr: "L'association cantonale des propriétaires HEV Zurich applique des critères de remise extrêmement stricts.",
      it: "L'associazione dei proprietari HEV di Zurigo applica requisiti di riconsegna dell'immobile molto severi.",
      pt: "A associação de proprietários HEV de Zurique aplica normas de entrega de imóveis muito rígidas."
    }
  },
  winterthur: {
    fact1: {
      de: "Die Loftwohnungen auf dem Sulzer-Areal weisen hohe industrielle Deckenstrukturen auf.",
      en: "The loft apartments on the historic Sulzer-Areal feature towering industrial brick and metal ceilings.",
      es: "Los lofts del Sulzer-Areal cuentan con techos industriales altos de ladrillo y metal.",
      fr: "Les appartements lofts du Sulzer-Areal possèdent de hauts plafonds industriels en brique et métal.",
      it: "I loft del Sulzer-Areal presentano alti soffitti industriali con strutture in mattoni e metallo.",
      pt: "Os lofts do Sulzer-Areal possuem tetos industriais altos com estruturas de tijolo e metal."
    },
    fact2: {
      de: "Die waldreichen Wohngebiete am Goldenberg und Eschenberg haben dichten Laubfall.",
      en: "The residential quarters near the forested Goldenberg and Eschenberg slopes face heavy leaf accumulation.",
      es: "Las zonas residenciales cercanas a Goldenberg y Eschenberg sufren una gran caída de hojas.",
      fr: "Les quartiers proches des forêts du Goldenberg et de l'Eschenberg subissent d'importantes chutes de feuilles.",
      it: "I quartieri residenziali vicino ai boschi del Goldenberg e dell'Eschenberg hanno una fitta caduta di foglie.",
      pt: "As áreas residenciais perto das florestas de Goldenberg e Eschenberg enfrentam uma queda de folhas intensa."
    },
    fact3: {
      de: "Die Winterthurer Altstadt besitzt die grösste zusammenhängende Fussgängerzone der Schweiz.",
      en: "The old town of Winterthur holds the largest continuous pedestrian zone in Switzerland.",
      es: "El casco antiguo de Winterthur tiene la zona peatonal continua más grande de Suiza.",
      fr: "La vieille ville de Winterthour possède la plus grande zone piétonne continue de Suisse.",
      it: "Il centro storico di Winterthur ospita la più grande zona pedonale continua della Svizzera.",
      pt: "O centro histórico de Winterthur possui a maior zona pedestre contínua da Suíça."
    }
  },
  thayngen: {
    fact1: {
      de: "Die ton- und kalkreichen Lehmböden des Klettgaus neigen zu starker Schlamm- und Staubbildung.",
      en: "The clay-rich and limestone-heavy loam soils of Klettgau lead to heavy mud and dust formation.",
      es: "Los suelos calcáreos y arcillosos de Klettgau tienden a generar mucho barro y polvo.",
      fr: "Les sols limoneux et calcaires du Klettgau favorisent d'importants dépôts de boue et de poussière.",
      it: "I terreni argillosi e calcarei del Klettgau tendono a generare molto fango e polvere.",
      pt: "Os solos argilosos e calcários do Klettgau tendem a gerar muita lama e poeira."
    },
    fact2: {
      de: "Die hügeligen Grenzstrassen und rebenbewachsenen Hänge des Reiats erfordern Trittsicherheit.",
      en: "The hilly border roads and vine-covered slopes of Reiat demand secure footing and transport safety.",
      es: "Las colinas fronterizas y laderas de viñedos de Reiat exigen una sujeción segura en los transportes.",
      fr: "Les routes frontalières vallonnées et les pentes du Reiat imposent des mesures de transport sécurisées.",
      it: "Le colline di confine e i pendii del Reiat richiedono massima stabilità e sicurezza nel trasporto.",
      pt: "As colinas fronteiriças e as encostas de vinhas do Reiat exigem uma fixação de transporte muito segura."
    },
    fact3: {
      de: "Die direkte Grenznähe erfordert genaue Kenntnisse über Zollformalitäten für Materialtransporte.",
      en: "The direct proximity to the German border requires strict compliance with customs rules for transport.",
      es: "La cercanía de la frontera exige conocer bien los trámites aduaneros para transporte de equipos.",
      fr: "La proximité de la frontière impose de maîtriser les formalités douanières pour le matériel.",
      it: "La vicinanza al confine richiede una chiara gestione delle formalità doganali per i trasporti.",
      pt: "A proximidade da fronteira exige um bom conhecimento das regras alfandegárias para o transporte."
    }
  },
  "stein-am-rhein": {
    fact1: {
      de: "Die weltberühmten, jahrhundertealten Fassadenmalereien am Rathausplatz stehen unter strengem Schutz.",
      en: "The world-famous, centuries-old painted frescoes on Rathausplatz are strictly heritage-protected.",
      es: "Los frescos murales centenarios de Rathausplatz están bajo una estricta protección patrimonial.",
      fr: "Les fresques murales séculaires de la Rathausplatz sont strictement protégées au titre des monuments historiques.",
      it: "Gli affreschi centenari della Rathausplatz sono protetti da rigorose norme di tutela storica.",
      pt: "Os frescos pintados centenários da Rathausplatz estão sob proteção patrimonial rigorosa."
    },
    fact2: {
      de: "Die engen Gassen und historischen Stadttore des mittelalterlichen Kerns schränken grosse Fahrzeuge ein.",
      en: "The narrow alleys and historic gates of the medieval center restrict access for large trucks.",
      es: "Las estrechas calles y puertas históricas medievales restringen el paso de camiones grandes.",
      fr: "Les ruelles étroites et les portes médiévales du centre historique limitent l'accès des grands camions.",
      it: "I vicoli stretti e le porte storiche medievali limitano l'accesso ai grandi veicoli.",
      pt: "As ruelas estreitas e portas medievais do centro histórico limitam o acesso de camiões grandes."
    },
    fact3: {
      de: "Die Lage am Bodensee-Ausfluss führt zu regelmässigem feuchtem Flussnebel.",
      en: "The unique location at the Lake Constance outlet creates regular damp river mist and high moisture.",
      es: "La ubicación junto a la salida del lago de Constanza genera neblinas húmedas constantes.",
      fr: "La situation à l'embouchure du lac de Constance favorise un brouillard humide régulier.",
      it: "La posizione sul punto di uscita del lago di Costanza genera nebbia umida e umidità costante.",
      pt: "A localização junto à saída do lago de Constança gera nevoeiros húmidos constantes."
    }
  },
  feuerthalen: {
    fact1: {
      de: "Die dichten Nebellagen im Rheingraben erzeugen ein feuchtes, schattiges Mikroklima.",
      en: "The dense morning fog in the Rhine valley creates a damp, shaded local microclimate.",
      es: "Las densas nieblas del valle del Rin generan un microclima local húmedo y sombrío.",
      fr: "Les brouillards d'automne du fossé rhénan créent un microclimat humide et ombragé.",
      it: "Le fitte nebbie della valle del Reno creano un microclima locale umido e ombroso.",
      pt: "Os nevoeiros densos do vale do Reno geram um microclima local húmido e sombrio."
    },
    fact2: {
      de: "Die steilen Zufahrtsstrassen zur Kohlfirst-Waldhöhe fordern Fahrzeuge und Logistik.",
      en: "The steep access roads leading up to the Kohlfirst forest ridge challenge vehicle transport.",
      es: "Las empinadas calles que suben a la colina forestal de Kohlfirst exigen vehículos potentes.",
      fr: "Les voies d'accès abruptes menant au Kohlfirst mettent les véhicules de transport à rude épreuve.",
      it: "Le ripide strade che salgono verso la collina del Kohlfirst mettono a dura prova i veicoli.",
      pt: "As vias de acesso íngremes que sobem para a colina de Kohlfirst exigem veículos potentes."
    },
    fact3: {
      de: "Die verkehrsintensive Rheinbrücke verbindet den Ort direkt mit der Stadt Schaffhausen.",
      en: "The highly trafficked Rhine bridge connects the municipality directly to Schaffhausen city.",
      es: "El transitado puente sobre el Rin conecta el municipio directamente con la ciudad de Schaffhausen.",
      fr: "Le pont très fréquenté sur le Rhin relie directement la commune à la ville de Schaffhouse.",
      it: "Il trafficato ponte sul Reno collega direttamente il comune con la città di Sciaffusa.",
      pt: "A ponte movimentada sobre o Reno liga o município diretamente à cidade de Schaffhausen."
    }
  },
  kloten: {
    fact1: {
      de: "Die hohe Belastung durch Kerosinrückstände und Triebwerksruss prägt die Aussenflächen.",
      en: "The high exposure to jet fuel residues and soot particles from Zurich Airport shapes all outdoor surfaces.",
      es: "La exposición a residuos de queroseno y hollín de motores del aeropuerto de Zúrich afecta las fachadas.",
      fr: "Les dépôts de résidus de kérosène et de suie du trafic aérien de l'aéroport de Zurich marquent les surfaces.",
      it: "I depositi di residui di cherosene e fuliggine dell'aeroporto di Zurigo influenzano le superfici esterne.",
      pt: "A exposição a resíduos de querosene e fuligem do aeroporto de Zurique afeta as fachadas exteriores."
    },
    fact2: {
      de: "Das hochfrequentierte Strassennetz rund um die Flughafenterminals erschwert die Anfahrt.",
      en: "The heavily congested road network surrounding the airport terminals complicates access routing.",
      es: "La congestionada red de carreteras alrededor de las terminales dificulta los accesos.",
      fr: "Le réseau routier très encombré autour des terminaux de l'aéroport complique les accès.",
      it: "La rete stradale congestionata intorno ai terminal dell'aeroporto rende complessi i percorsi di accesso.",
      pt: "A rede de estradas congestionada ao redor dos terminais do aeroporto dificulta os acessos."
    },
    fact3: {
      de: "Die grosse Zahl an internationalen Pendlern und Expats verlangt extrem flexible Zeitfenster.",
      en: "The high density of international corporate expats demands exceptionally flexible service schedules.",
      es: "El gran volumen de residentes extranjeros exige ventanas horarias extremadamente flexibles.",
      fr: "Le grand nombre d'expatriés et de pendulaires exige des créneaux horaires très flexibles.",
      it: "Il gran numero di expat internazionali richiede finestre temporali di intervento molto flessibili.",
      pt: "O elevado número de residentes estrangeiros exige janelas de tempo extremamente flexíveis."
    }
  },
  buelach: {
    fact1: {
      de: "Die historischen Riegelhäuser und Altstadtgassen weisen empfindliche Baumaterialien auf.",
      en: "The traditional timber-framed buildings feature delicate architectural building materials.",
      es: "Las casas de entramado de madera del casco antiguo cuentan con materiales delicados.",
      fr: "Les maisons à colombages de la vieille ville présentent des matériaux de construction délicats.",
      it: "Le case a graticcio del centro storico presentano materiali da costruzione delicati.",
      pt: "As casas de enxaimel do centro histórico apresentam materiais de construção delicados."
    },
    fact2: {
      de: "Die weitläufigen ländlichen Ortsteile erfordern eine präzise Routengruppierung.",
      en: "The sprawling, highly rural outer districts require highly optimized transit route planning.",
      es: "Los extensos distritos rurales exteriores exigen una planificación de rutas muy optimizada.",
      fr: "Les vastes zones rurales périphériques imposent une planification de transport très rigoureuse.",
      it: "I vasti distretti rurali esterni richiedono una pianificazione dei trasporti molto ottimizzata.",
      pt: "Os extensos distritos rurais exteriores exigem um planeamento de rotas muito otimizado."
    },
    fact3: {
      de: "Die traditionsbewusste Bülacher Bevölkerung schätzt bewährte Schweizer Qualitätsstandards.",
      en: "The traditional local population in Bülach places high value on proven Swiss quality standards.",
      es: "La población tradicional de Bülach valora enormemente la calidad suiza de confianza.",
      fr: "La population traditionnelle de Bülach accorde une grande importance à la qualité suisse éprouvée.",
      it: "La popolazione locale di Bülach attribuiisce un valore molto alto alla comprovata qualità svizzera.",
      pt: "A população local de Bülach valoriza imenso os padrões de qualidade suíça comprovada."
    }
  },
  dietikon: {
    fact1: {
      de: "Die dichte Industrieaktivität im Limmattal verursacht eine hohe Feinstaubkonzentration.",
      en: "The dense industrial activity in Limmattal creates highly abrasive fine particulate dust.",
      es: "La densa actividad industrial en Limmattal genera una alta concentración de polvo fino.",
      fr: "L'activité industrielle dense dans le Limmattal engendre d'importants dépôts de poussière abrasive.",
      it: "L'intensa attività industriale nel Limmattal causa un'elevata concentrazione di polveri sottili.",
      pt: "A densa atividade industrial no Limmattal gera uma alta concentração de poeiras finas."
    },
    fact2: {
      de: "Die modernen, dichten Wohnhochhäuser verfügen oft über restriktive Lift- und Parkregeln.",
      en: "The modern, high-density residential towers enforce strict parking and elevator access rules.",
      es: "Los modernos edificios residenciales de gran altura aplican normas de parking y ascensor estrictas.",
      fr: "Les tours résidentielles modernes imposent des règles d'accès aux ascenseurs et parkings très strictes.",
      it: "I moderni grattacieli residenziali applicano regole molto restrittive per ascensori e parcheggi.",
      pt: "Os edifícios residenciais de grande altura aplicam regras estritas de estacionamento e elevador."
    },
    fact3: {
      de: "Die anhaltend hohe Bautätigkeit führt zu häufigen Baustaubbelastungen im gesamten Stadtgebiet.",
      en: "The continuous high construction activity leads to frequent construction dust on properties.",
      es: "La continua actividad de construcción genera constante polvo de obra en toda la zona.",
      fr: "L'activité constante de construction provoque de fréquents dépôts de poussière de chantier.",
      it: "La continua attività edilizia causa frequenti depositi di polvere da cantiere negli immobili.",
      pt: "A atividade contínua de construção gera poeira de obra constante em toda a cidade."
    }
  },
  uster: {
    fact1: {
      de: "Die streng geschützte Naturschutzzone rund um den Greifensee verbietet aggressive chemische Mittel.",
      en: "The strictly protected nature reserve around Greifensee prohibits any aggressive chemical agents.",
      es: "La reserva natural protegida de Greifensee prohíbe el uso de productos químicos agresivos.",
      fr: "La réserve naturelle protégée du Greifensee interdit l'usage de produits chimiques agressifs.",
      it: "La riserva naturale protetta del Greifensee vieta l'uso di sostanze chimiche aggressive.",
      pt: "A reserva natural protegida de Greifensee proíbe o uso de produtos químicos agressivos."
    },
    fact2: {
      de: "Die verzweigten Wohnsiedlungen an den historischen Industriekanälen erschweren die Zufahrten.",
      en: "The complex residential clusters along the historic industrial water canals restrict vehicle access.",
      es: "Los complejos complejos residenciales junto a los canales industriales dificultan el acceso.",
      fr: "Les quartiers résidentiels le long des anciens canaux industriels compliquent les accès.",
      it: "I complessi residenziali lungo gli antichi canali industriali rendono difficili gli accessi dei veicoli.",
      pt: "Os complexos residenciais ao longo dos antigos canais industriais dificultam o acesso de veículos."
    },
    fact3: {
      de: "Die lokale Bevölkerung legt gemäss dem 'Energiestadt'-Status grössten Wert auf Nachhaltigkeit.",
      en: "The local community's strict 'Energiestadt' eco-city status expects top-tier ecological responsibility.",
      es: "La comunidad local exige altos estándares ecológicos bajo el estatus ecológico de la ciudad.",
      fr: "La population locale, fidèle au statut de 'Cité de l'énergie', exige des méthodes écologiques rigoureuses.",
      it: "La popolazione locale richiede elevati standard ecologici in linea con lo status di 'Città dell'energia'.",
      pt: "A comunidade local exige elevados padrões ecológicos sob o estatuto de 'Cidade da Energia' da cidade."
    }
  }
};

// Service Category Specific Synthesis rules to attach relevant useful advice (6 languages)
const CATEGORY_ADVICE: Record<string, {
  advice1: Record<string, string>;
  advice2: Record<string, string>;
  advice3: Record<string, string>;
}> = {
  cleaning: {
    advice1: {
      de: " Dies erfordert spezielle materialschonende Reinigungsverfahren, um Glanz und Struktur langfristig zu erhalten.",
      en: " This demands highly careful, surface-safe cleaning methods to protect high-end finishes from permanent damage.",
      es: " Esto exige técnicas de limpieza muy respetuosas con los materiales para proteger los acabados a largo plazo.",
      fr: " Cela requiert des techniques de nettoyage très douces afin de protéger durablement les finitions de valeur.",
      it: " Ciò richiede tecniche di pulizia molto delicate per proteggere le finiture di pregio a lungo termine.",
      pt: " Isto exige técnicas de limpeza muito respeitadoras dos materiais para proteger os acabamentos a longo prazo."
    },
    advice2: {
      de: " Unsere Reinigungsleitung setzt daher ausschliesslich auf geschultes Personal mit rutschfesten Sicherheitsschuhen und Teleskopgeräten.",
      en: " Our management therefore strictly deploys trained crews equipped with non-slip safety shoes and professional telescopic gear.",
      es: " Por ello, nuestros equipos utilizan únicamente calzado antideslizante de seguridad y herramientas telescópicas profesionales.",
      fr: " C'est pourquoi nos équipes utilisent uniquement des chaussures de sécurité antidérapantes et du matériel télescopique professionnel.",
      it: " Per questo i nostri team utilizzano esclusivamente scarpe antinfortunistiche antiscivolo e attrezzature telescopiche professionali.",
      pt: " Por isso, as nossas equipas utilizam apenas calçado de segurança antiderrapante e ferramentas telescópicas profissionais."
    },
    advice3: {
      de: " Wir passen unsere Reinigungsmittel und Übergabeprotokolle exakt an diese anspruchsvollen Bedingungen an.",
      en: " We calibrate our detergents, checklists, and handover protocols precisely to meet these demanding local standards.",
      es: " Adaptamos nuestros productos de limpieza y protocolos de entrega exactamente a estas exigentes condiciones locales.",
      fr: " Nous adaptons nos produits de nettoyage et protocoles de réception exactement à ces exigences locales rigoureuses.",
      it: " Adattiamo i nostri detergenti e i verbali di consegna esattamente a queste severe condizioni locali.",
      pt: " Adaptamos os nossos produtos de limpeza e protocolos de entrega exatamente a estas exigentes condições locais."
    }
  },
  logistics: {
    advice1: {
      de: " Unsere Zügelteams verpacken empfindliche Güter daher mit dickem Vlies, um Transportschäden durch Feuchtigkeit vollends auszuschliessen.",
      en: " Our moving crews therefore pack sensitive items with thick protective fleece to prevent any environmental or moisture damage.",
      es: " Por ello, embalamos los objetos delicados con mantas protectoras gruesas para evitar cualquier daño por humedad.",
      fr: " C'est pourquoi nous emballons les objets délicats avec d'épaisses couvertures pour éviter tout dommage lié à l'humidité.",
      it: " Per questo imballiamo gli oggetti delicati con spesse coperte protettive per evitare qualsiasi danno dovuto all'umidità.",
      pt: " Por isso, embalamos os objetos delicados com mantas protetoras grossas para evitar qualquer dano por humidade."
    },
    advice2: {
      de: " Präzises Rangieren und hervorragende Ladungssicherung im LKW sind Pflicht, um Güter auf anspruchsvollen Strecken zu sichern.",
      en: " Precise maneuvering and heavy-duty load securing inside our trucks are strictly enforced to keep your furniture safe on steep roads.",
      es: " Es obligatorio realizar maniobras precisas y una sujeción perfecta de la carga en el camión para proteger sus muebles en ruta.",
      fr: " Des manœuvres précises et une fixation parfaite de la charge dans le camion sont obligatoires pour sécuriser vos biens en route.",
      it: " Sono obbligatorie manovre precise e un fissaggio perfetto del carico per proteggere i vostri arredi durante il trasporto.",
      pt: " É obrigatório realizar manobras precisas e uma fixação perfeita da carga no camião para proteger os seus móveis em rota."
    },
    advice3: {
      de: " Wir koordinieren Halteverbotszonen, Schlüsselübergaben und Logistikwege hocheffizient mit den zuständigen Stellen.",
      en: " We coordinate parking permits, building access, and transport routes with high efficiency with local authorities.",
      es: " Coordinamos los permisos de estacionamiento, accesos y rutas de transporte de forma muy eficiente con las autoridades locales.",
      fr: " Nous coordonnons très efficacement les autorisations de stationnement et les accès avec les autorités locales.",
      it: " Coordiniamo i permessi di sosta, gli accessi e i percorsi di trasporto con la massima efficienza insieme alle autorità locali.",
      pt: " Coordenamos as autorizações de estacionamento, acessos e rotas de transporte de forma muito eficiente com as autoridades locais."
    }
  },
  outdoor: {
    advice1: {
      de: " Unser Service für Garten und Aussenanlagen ist optimal auf diese mikroklimatischen Einflüsse eingestellt.",
      en: " Our garden and grounds maintenance service is perfectly calibrated to mitigate these microclimatic conditions.",
      es: " Nuestro servicio de jardinería y exteriores está adaptado de forma óptima a estas condiciones microclimáticas.",
      fr: " Notre service pour jardins et extérieurs est parfaitement adapté à ces conditions microclimatiques spécifiques.",
      it: " Il nostro servizio per giardini ed esterni è calibrato in modo ottimale su queste condizioni microclimatiche.",
      pt: " O nosso serviço de jardinagem e exteriores está perfeitamente adaptado a estas condições microclimáticas."
    },
    advice2: {
      de: " Fachmännische Hangsicherung, Baumpflege und Trittsicherheit haben beim Einsatz im Freien oberste Priorität.",
      en: " Professional slope stabilization, tree care, and safety harness systems are our absolute top priority during outdoor work.",
      es: " La estabilización profesional de pendientes, poda y seguridad anticaídas son prioridades absolutas en el exterior.",
      fr: " La stabilisation des pentes, l'élagage et la sécurité antichute sont des priorités absolues pour les travaux extérieurs.",
      it: " La stabilizzazione professionale delle pendenze, la potatura e la sicurezza anticaduta sono priorità assolute all'esterno.",
      pt: " A estabilização profissional de declives, poda e segurança antiqueda são prioridades absolutas no exterior."
    },
    advice3: {
      de: " Aus ökologischer Verantwortung setzen wir ausschliesslich biologisch abbaubare Produkte ein.",
      en: " Out of deep ecological responsibility, we strictly employ 100% biodegradable and certified green products.",
      es: " Por responsabilidad ecológica, utilizamos exclusivamente productos 100% biodegradables y respetuosos con el medio ambiente.",
      fr: " Par responsabilité écologique, nous utilisons exclusivement des produits 100% biodégradables et respectueux de l'environnement.",
      it: " Per responsabilità ecologica, utilizziamo esclusivamente prodotti biodegradabili e rispettosi dell'ambiente.",
      pt: " Por responsabilidade ecológica, utilizamos exclusivamente produtos 100% biodegradáveis e ecológicos."
    }
  },
  commercial: {
    advice1: {
      de: " Für gewerbliche Liegenschaften setzen wir zertifizierte, hocheffiziente Scheuersaugmaschinen und Filtertechnik ein.",
      en: " For commercial properties, we deploy certified high-performance floor scrubbers and advanced HEPA-filter technology.",
      es: " Para propiedades comerciales, empleamos fregadoras de suelos certificadas y tecnología avanzada de filtración HEPA.",
      fr: " Pour les locaux professionnels, nous utilisons des autolaveuses certifiées et des systèmes de filtration HEPA avancés.",
      it: " Per gli immobili commerciali impieghiamo lavasciuga certificate e tecnologie avanzate di filtraggio HEPA.",
      pt: " Para propriedades comerciais, utilizamos lavadoras de pavimentos certificadas e tecnologia avançada de filtragem HEPA."
    },
    advice2: {
      de: " Um Ihren Betriebsablauf nie zu stören, passen wir unsere Einsatzzeiten und Logistik vollkommen flexibel an.",
      en: " To guarantee zero disruption to your daily business operations, we schedule our work with complete temporal flexibility.",
      es: " Para no interrumpir nunca su actividad comercial, adaptamos nuestros horarios de trabajo con total flexibilidad.",
      fr: " Afin de ne jamais perturber votre activité, nous adaptons nos horaires d'intervention avec une flexibilité totale.",
      it: " Per non interrompere mai la vostra attività commerciale, adattiamo i nostri orari di lavoro con la massima flessibilità.",
      pt: " Para nunca interromper a sua atividade comercial, adaptamos os nossos horários de trabalho com total flexibilidade."
    },
    advice3: {
      de: " Alle Gewerbereinigungen werden streng nach Schweizer Standards, Qualitäts- und Sicherheitsvorgaben dokumentiert.",
      en: " All commercial services are fully documented under strict compliance with Swiss quality, safety, and hygiene standards.",
      es: " Todos los servicios comerciales se documentan bajo el estricto cumplimiento de las normas suizas de calidad y seguridad.",
      fr: " Toutes nos interventions professionnelles sont documentées conformément aux normes de qualité et de sécurité suisses.",
      it: " Tutti i servizi commerciali sono documentati in stretta conformità con gli standard di qualità e sicurezza svizzeri.",
      pt: " Todos os serviços comerciais são documentados em estrito cumprimento com as normas suíças de qualidade e segurança."
    }
  },
  special: {
    advice1: {
      de: " Dies erfordert spezialisiertes Fachwissen und massgeschneiderte Schutzmassnahmen für sensible Oberflächen.",
      en: " This requires highly specialized expertise and custom-tailored protection measures for sensitive materials.",
      es: " Esto requiere conocimientos especializados y medidas de protección a medida para materiales delicados.",
      fr: " Cela requiert un savoir-faire spécialisé et des mesures de protection sur mesure pour les surfaces délicates.",
      it: " Ciò richiede competenze specializzate e misure di protezione su misura per i materiali delicati.",
      pt: " Isto requer conhecimentos especializados e medidas de proteção personalizadas para materiais delicados."
    },
    advice2: {
      de: " Unsere Teams stimmen Ausrüstung und Anfahrtswege präzise ab, um eine optimale Abwicklung zu garantieren.",
      en: " Our teams coordinate equipment and transit routes with maximum precision to guarantee flawless execution.",
      es: " Nuestros equipos coordinan los equipos y las rutas con máxima precisión para garantizar una ejecución perfecta.",
      fr: " Nos équipes coordonnent le matériel et les itinéraires avec précision pour garantir une exécution parfaite.",
      it: " I nostri team coordinano attrezzature e percorsi con la massima precisione per garantire un'esecuzione perfetta.",
      pt: " As nossas equipas coordenam os equipamentos e rotas com máxima precisão para garantir uma execução perfeita."
    },
    advice3: {
      de: " Mit Schweizer Zuverlässigkeit und Diskretion bieten wir Ihnen einen rundum sicheren Premium-Service.",
      en: " With trusted Swiss reliability and complete discretion, we deliver an all-around secure premium service.",
      es: " Con la confianza de la seriedad suiza y total discreción, ofrecemos un servicio premium totalmente seguro.",
      fr: " Forts de la fiabilité suisse et d'une discrétion totale, nous vous offrons un service premium hautement sécurisé.",
      it: " Con la comprovata affidabilità svizzera e la massima discrezione, vi garantiamo un servizio premium sicuro.",
      pt: " Com a confiança da seriedade suíça e total discrição, oferecemos um serviço premium totalmente seguro."
    }
  }
};

export const getLocalizedCuriosity = (cityId: string, serviceId: string, lang: string): string[] => {
  const cId = cityId.toLowerCase();
  const cat = getServiceCategory(serviceId);
  
  // Clean language code
  const activeLang = ['de', 'en', 'es', 'fr', 'it', 'pt'].includes(lang) ? lang : 'de';

  // Fallback if city not in our direct facts list
  const cityData = CITY_BASE_FACTS[cId] || CITY_BASE_FACTS.schaffhausen;
  const adviceData = CATEGORY_ADVICE[cat] || CATEGORY_ADVICE.special;

  // Synthesize custom, completely unique, grammatically perfect bullet points
  const p1 = (cityData.fact1[activeLang] || cityData.fact1.de) + (adviceData.advice1[activeLang] || adviceData.advice1.de);
  const p2 = (cityData.fact2[activeLang] || cityData.fact2.de) + (adviceData.advice2[activeLang] || adviceData.advice2.de);
  const p3 = (cityData.fact3[activeLang] || cityData.fact3.de) + (adviceData.advice3[activeLang] || adviceData.advice3.de);

  return [p1, p2, p3];
};
