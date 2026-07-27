import React, { useEffect } from 'react';
import { useTranslation } from '../i18n';
import { 
  CheckIcon, 
  MapPinIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  ChevronRightIcon,
  KrakenStandardIcon,
  SustainabilityIcon,
} from './icons';
import { 
  Key, 
  Sparkles, 
  Calendar, 
  Truck, 
  Car, 
  Leaf, 
  Droplet, 
  Bug, 
  Trash2, 
  Building, 
  Armchair, 
  Home, 
  Wrench, 
  Store, 
  Utensils 
} from 'lucide-react';
import { services, cityImages, schaffhausenServiceImages } from '../assets';
import { SERVICE_SEO_CONTENT } from './seoData';
import { MUNICIPALITIES } from '../src/data/locations';
import { getLocalizedCuriosity } from './seoCuriosities';
import { getLocalizedPrices } from './seoTranslations';

const getDeterministicHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

function getDeterministicShuffle<T>(array: T[], seed: string): T[] {
  const hashVal = getDeterministicHash(seed);
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (hashVal + i) % (i + 1);
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

const seedCityAndServiceIntoItem = (item: string, idx: number, cityName: string, serviceTitle: string, lang: string, seed: string): string => {
  const hashVal = getDeterministicHash(seed + "_" + idx);
  // We seed the city name in about 40% of the items to keep it completely natural
  const shouldSeed = (hashVal % 5) < 2;
  if (!shouldSeed) return item;

  const templates: Record<string, string[]> = {
    'de': [
      `In {city}: {text}`,
      `Für Ihr Objekt in {city}: {text}`,
      `Direkt vor Ort in {city}: {text}`,
      `{text} (zuverlässig ausgeführt in {city})`,
      `{text} für Ihr Objekt in {city}`
    ],
    'en': [
      `In {city}: {text}`,
      `For your property in {city}: {text}`,
      `Directly on-site in {city}: {text}`,
      `{text} (professionally done in {city})`,
      `{text} for your property in {city}`
    ],
    'es': [
      `En {city}: {text}`,
      `Para su propiedad en {city}: {text}`,
      `Directamente en {city}: {text}`,
      `{text} (realizado profesionalmente en {city})`,
      `{text} para su inmueble en {city}`
    ],
    'fr': [
      `À {city} : {text}`,
      `Pour votre propriété à {city} : {text}`,
      `Directement sur place à {city} : {text}`,
      `{text} (réalisé professionnellement à {city})`,
      `{text} pour votre bien à {city}`
    ],
    'it': [
      `A {city}: {text}`,
      `Per la tua proprietà a {city}: {text}`,
      `Direttamente sul posto a {city}: {text}`,
      `{text} (eseguito professionalmente a {city})`,
      `{text} per la tua casa a {city}`
    ],
    'pt': [
      `Em {city}: {text}`,
      `Para a sua propriedade em {city}: {text}`,
      `Diretamente no local em {city}: {text}`,
      `{text} (realizado profissionalmente em {city})`,
      `{text} para o seu imóvel em {city}`
    ]
  };

  const activeLang = ['de', 'en', 'es', 'fr', 'it', 'pt'].includes(lang) ? lang : 'de';
  const list = templates[activeLang] || templates['de'];
  const template = list[hashVal % list.length];
  
  return template
    .replace('{city}', cityName)
    .replace('{text}', item);
};

const paraphraseText = (text: string, seed: string, lang: string = 'de'): string => {
  const hashVal = getDeterministicHash(seed);
  const cleanLang = (lang || 'de').toLowerCase().split('-')[0];

  const deSynonyms: [RegExp, string[]][] = [
    [/[Pp]rofessionelle/g, ["professionelle", "fachmännische", "erstklassige", "kompetente", "zertifizierte"]],
    [/[Pp]rofessionelles/g, ["professionelles", "fachmännisches", "erstklassiges", "kompetentes", "zertifiziertes"]],
    [/[Pp]rofessionell/g, ["professionell", "fachmännisch", "erstklassig", "kompetent", "zertifiziert"]],
    [/[Rr]einigung/g, ["Reinigung", "Säuberung", "Pflege", "Hygienereinigung", "Unterhaltspflege"]],
    [/[Kk]omplettreinigung/g, ["Komplettreinigung", "Vollreinigung", "allumfassende Säuberung", "vollständige Reinigung"]],
    [/[Tt]iefenreinigung/g, ["Tiefenreinigung", "Porentiefenreinigung", "Intensivreinigung", "gründliche Tiefensäuberung"]],
    [/[Ii]nnenreinigung/g, ["Innenreinigung", "Innensäuberung", "interne Reinigung", "Schrank-Innenreinigung"]],
    [/[Ss]pezialreinigung/g, ["Spezialreinigung", "Sonderreinigung", "Spezialsäuberung", "gezielte Reinigung"]],
    [/[Nn]assreinigung/g, ["Nassreinigung", "Feuchtreinigung", "nasse Säuberung", "Feuchtwischen"]],
    [/[Gg]rundreinigung/g, ["Grundreinigung", "Hauptreinigung", "Basissäuberung", "Generalreinigung"]],
    [/[Uu]nterhaltsreinigung/g, ["Unterhaltsreinigung", "Unterhaltspflege", "regelmässige Säuberung", "Intervallreinigung"]],
    [/[Ee]ntfernung/g, ["Entfernung", "Beseitigung", "Eliminierung", "Säuberung", "Befreiung"]],
    [/[Gg]ründliche/g, ["gründliche", "tiefenwirksame", "lückenlose", "sorgfältige", "gewissenhafte", "präzise"]],
    [/[Gg]ründliches/g, ["gründliches", "tiefenwirksames", "lückenloses", "sorgfältiges", "gewissenhaftes", "präzises"]],
    [/[Gg]ründlich/g, ["gründlich", "tiefenwirksam", "lückenlos", "sorgfältig", "gewissenhaft", "präzise"]],
    [/[Ss]chnelle/g, ["schnelle", "speditive", "rasche", "zügige"]],
    [/[Ss]chnelles/g, ["schnelles", "speditives", "rasches", "zügiges"]],
    [/[Ss]chnell/g, ["schnell", "speditiv", "rasch", "zügig"]],
    [/[Zz]uverlässige/g, ["zuverlässige", "gewissenhafte", "termintreue", "sorgfältige", "fachmännische"]],
    [/[Zz]uverlässiges/g, ["zuverlässiges", "gewissenhaftes", "termintreues", "sorgfältiges", "fachmännisches"]],
    [/[Zz]uverlässig/g, ["zuverlässig", "gewissenhaft", "termintreu", "sorgfältig", "fachmännisch"]],
    [/[Aa]bgabegarantie/g, ["Abgabegarantie", "Übergabegarantie", "Abnahmegarantie", "Übergabegarantie mit 100% Haftung"]],
    [/[Ww]ohnung/g, ["Wohnung", "Mietwohnung", "Immobilie", "Liegenschaft", "Räumlichkeiten"]],
    [/[Ww]ohnungen/g, ["Wohnungen", "Mietwohnungen", "Immobilien", "Liegenschaften", "Räume"]],
    [/[Ff]enster/g, ["Fenster", "Glasflächen", "Fensterscheiben", "Verglasungen"]],
    [/[Kk]üche/g, ["Küche", "Küchenzeile", "Einbauküche"]],
    [/[Bb]öden/g, ["Böden", "Bodenbeläge", "Fußböden"]],
    [/[Uu]mweltschonend/g, ["umweltschonend", "ökologisch", "umweltfreundlich", "biologisch abbaubar", "nachhaltig"]],
    [/[Uu]mweltfreundliche/g, ["umweltfreundliche", "ökologische", "biologisch abbaubare", "nachhaltige"]],
    [/[Uu]mweltfreundliches/g, ["umweltfreundliches", "ökologisches", "biologisch abbaubares", "nachhaltiges"]],
    [/[Uu]mweltfreundlich/g, ["umweltfreundlich", "ökologisch", "biologisch abbaubar", "nachhaltig"]],
    [/[Pp]reise/g, ["Preise", "Tarife", "Konditionen", "Festpreise"]],
    [/[Uu]nverbindlich/g, ["unverbindlich", "kostenfrei", "kostenlos"]],
    [/[Bb]adezimmer/g, ["Badezimmer", "Nasszelle", "Bad und Sanitärbereich", "Sanitäre Anlagen"]],
    [/[Kk]alk/g, ["Kalk", "Kalkablagerungen", "Kalkrückstände"]],
    [/[Ss]chrank/g, ["Schrank", "Einbauschrank", "Kastenschrank"]],
    [/[Ss]chränke/g, ["Schränke", "Einbauschränke", "Möbelstücke"]],
    [/[Ss]taubsaugen/g, ["Staubsaugen", "Trockensaugen", "Saugen"]],
    [/[Ww]ischen/g, ["Feuchtwischen", "Wischen", "Nasswischen"]],
    [/[Ee]ntsorgung/g, ["Entsorgung", "Fachentsorgung", "Recycling", "Entfrachtung"]],
    [/[Mm]üll/g, ["Abfall", "Hausmüll", "Müll", "Restmüll"]],
    [/wir haften bei der (Ü|Ue)bergabe/gi, [
      "wir übernehmen die lückenlose Haftung für Sie",
      "wir haften persönlich beim Übergabetermin",
      "wir bürgen direkt vor Ort für die mängelfreie Abgabe",
      "Kraken übernimmt die lückenlose Haftung bei der Abgabe",
      "wir stehen zu 100% für das Ergebnis gerade"
    ]],
    [/beim offiziellen Übergabetermin/gi, [
      "beim Abnahmetermin mit dem Vermieter",
      "bei der offiziellen Wohnungsabgabe vor Ort",
      "beim Abnahmetermin mit der Liegenschaftsverwaltung",
      "direkt beim offiziellen Übergabetermin",
      "bei der gemeinsamen Wohnungsübergabe"
    ]],
    [/nach strengsten Schweizer Standards/gi, [
      "gemäss erstklassigen Schweizer Qualitätsvorgaben",
      "unter Einhaltung strengster Schweizer Kriterien",
      "auf bestem Schweizer Qualitätsniveau",
      "nach bewährten Schweizer Sauberkeitsstandards",
      "streng nach Schweizer Richtlinien"
    ]],
    [/biologisch abbaubare Reinigungsmittel/gi, [
      "umweltfreundliche, ökologisch zertifizierte Putzmittel",
      "biologisch abbaubare Reinigungsprodukte",
      "ökologische Reinigungsmittel ohne Chemie",
      "schonende, biologisch abbaubare Reiniger",
      "umweltschonende und ökologische Reinigungsmittel"
    ]],
    [/100% (Abgabe|Übergabe|Uebergabe)garantie inklusive/gi, [
      "100% Abnahmegarantie inklusive",
      "Inklusive vollständiger Übergabegarantie",
      "Mit garantierter Abnahmegarantie (100%)",
      "Vollständige Abnahmegarantie inbegriffen",
      "100% Übergabe-Sicherheit inklusive"
    ]]
  ];

  const enSynonyms: [RegExp, string[]][] = [
    [/[Cc]leaning/g, ["cleaning", "sanitizing", "care", "maintenance", "service"]],
    [/[Pp]rofessional/g, ["professional", "expert", "specialist", "certified", "first-class"]],
    [/[Gg]uarantee/g, ["guarantee", "warranty", "assurance"]],
    [/[Ee]co-friendly/g, ["eco-friendly", "ecological", "biodegradable", "sustainable"]],
    [/[Tt]horough/g, ["thorough", "deep", "intensive", "precise"]],
    [/[Ff]ast/g, ["fast", "quick", "speedy", "rapid"]],
    [/[Rr]eliable/g, ["reliable", "trustworthy", "dependable"]],
    [/[Aa]partment/g, ["apartment", "property", "flat", "residence"]],
    [/[Pp]rices/g, ["prices", "rates", "flat-rates", "conditions"]]
  ];

  const esSynonyms: [RegExp, string[]][] = [
    [/[Ll]impieza/g, ["limpieza", "desinfección", "saneamiento", "mantenimiento"]],
    [/[Pp]rofesional/g, ["profesional", "especializada", "experta", "de primera clase"]],
    [/[Gg]arantía/g, ["garantía", "compromiso", "cobertura"]],
    [/[Ee]cológico/g, ["ecológico", "biodegradable", "sostenible"]],
    [/[Ee]cológicos/g, ["ecológicos", "biodegradables", "sostenibles"]],
    [/[Rr]ápido/g, ["rápido", "ágil", "expedito"]],
    [/[Cc]onfiable/g, ["confiable", "seguro", "garantizado"]],
    [/[Pp]recios/g, ["precios", "tarifas", "costos", "presupuestos"]]
  ];

  const frSynonyms: [RegExp, string[]][] = [
    [/[Nn]ettoyage/g, ["nettoyage", "assainissement", "soutien", "entretien"]],
    [/[Pp]rofessionnel/g, ["professionnel", "qualifié", "expert", "certifié"]],
    [/[Gg]arantie/g, ["garantie", "assurance", "engagement"]],
    [/[Éé]cologique/g, ["écologique", "biodégradable", "écoresponsable"]],
    [/[Éé]cologiques/g, ["écologiques", "biodégradables", "écoresponsables"]],
    [/[Rr]apide/g, ["rapide", "efficace", "expéditif"]],
    [/[Ff]iable/g, ["fiable", "sûr", "garanti"]],
    [/[Pp]rix/g, ["prix", "tarifs", "forfaits"]]
  ];

  const itSynonyms: [RegExp, string[]][] = [
    [/[Pp]ulizia/g, ["pulizia", "sanificazione", "igiene", "manutenzione"]],
    [/[Pp]rofessionale/g, ["professionale", "specializzata", "esperta", "certificata"]],
    [/[Gg]aranzia/g, ["garanzia", "sicurezza", "certificazione"]],
    [/[Ee]cologico/g, ["ecologico", "biodegradabile", "ecosostenibile"]],
    [/[Ee]cologici/g, ["ecologici", "biodegradabili", "ecosostenibili"]],
    [/[Rr]apido/g, ["rapido", "veloce", "tempestivo"]],
    [/[Aa]ffidabile/g, ["affidabile", "sicuro", "garantito"]],
    [/[Pp]rezzi/g, ["prezzi", "tariffe", "costi"]]
  ];

  const ptSynonyms: [RegExp, string[]][] = [
    [/[Ll]impeza/g, ["limpeza", "higienização", "manutenção", "sanitização"]],
    [/[Pp]rofissional/g, ["profissional", "especializada", "experiente", "certificada"]],
    [/[Gg]arantia/g, ["garantia", "asseguração", "compromisso"]],
    [/[Ee]cológico/g, ["ecológico", "biodegradável", "sustentável"]],
    [/[Ee]cológicos/g, ["ecológicos", "biodegradáveis", "sustentáveis"]],
    [/[Rr]ápido/g, ["rápido", "ágil", "veloz"]],
    [/[Cc]onfiável/g, ["confiável", "seguro", "garantido"]],
    [/[Pp]reços/g, ["preços", "tarifas", "valores"]]
  ];

  let synonyms = deSynonyms;
  if (cleanLang === 'en') synonyms = enSynonyms;
  else if (cleanLang === 'es') synonyms = esSynonyms;
  else if (cleanLang === 'fr') synonyms = frSynonyms;
  else if (cleanLang === 'it') synonyms = itSynonyms;
  else if (cleanLang === 'pt') synonyms = ptSynonyms;

  let result = text;
  synonyms.forEach(([regex, options], idx) => {
    const optionIdx = (hashVal + idx) % options.length;
    result = result.replace(regex, options[optionIdx]);
  });
  return result;
};

const getLocalizedPricingIntro = (cityId: string, serviceId: string, lang: string, cityName: string): string => {
  const hashVal = getDeterministicHash(cityId + "_" + serviceId + "_pr_intro");
  const cleanLang = (lang || 'de').toLowerCase().split('-')[0];

  const deVariants = [
    `Wir setzen bei Kraken PFM auf transparente Preise und kundenfreundliche Konditionen. Für viele Standardaufgaben bieten wir Ihnen attraktive Festpreise (Festpreisgarantie) an, damit Sie von Anfang an volle Planungssicherheit haben. Hier finden Sie unsere unverbindliche Preisübersicht für die Region ${cityName}:`,
    `Bei Kraken PFM stehen transparente Pauschalpreise und faire Konditionen an erster Stelle. Für zahlreiche Standardleistungen in ${cityName} bieten wir Ihnen garantierte Festpreise an – so geniessen Sie von Beginn an maximale Budgetsicherheit ohne versteckte Kosten. Unsere aktuelle Übersicht:`,
    `Transparenz und faire Tarife sind der Kern unseres Services für ${cityName}. Viele unserer Standardreinigungen kalkulieren wir als feste Pauschalen mit Festpreisgarantie, um Ihnen die volle Kontrolle über die Kosten zu sichern. Entdecken Sie hier unsere unverbindlichen Preisangaben:`,
    `Kundenfreundliche Preise und lückenlose Transparenz zeichnen Kraken PFM aus. Damit Sie bei Ihrem Projekt in ${cityName} absolut sicher planen können, bieten wir für Standardaufgaben verlässliche Festpreise (mit voller Garantie). Sehen Sie hier unsere Preisliste auf einen Blick:`,
    `Planungssicherheit durch transparente Festpreise – das ist unser Versprechen für Ihr Objekt in ${cityName}. Für die meisten Standardeinsätze erhalten Sie von uns attraktive Pauschaltarife, die alle Kosten direkt abdecken. Hier ist die unverbindliche Übersicht für Sie:`
  ];

  const enVariants = [
    `At Kraken PFM, we focus on transparent prices and customer-friendly terms. For many standard tasks, we offer attractive flat rates (fixed-price guarantee) to ensure you have full planning security from the start. Here is our non-binding price overview for the ${cityName} region:`,
    `We believe in clear pricing and fair conditions in the ${cityName} area. Many of our standardized operations are billed as simple flat rates, providing you with absolute budget security right from day one. Here are our estimated local rates:`,
    `Transparent cost structures and budget security are central to our work in ${cityName}. For typical requests, we establish simple fixed-price calculations (handover guarantee included where applicable) to keep things predictable. Browse our pricing details below:`,
    `Kraken PFM stands for reliable, transparent, and fair pricing models. To make budgeting easy for your project in ${cityName}, we provide competitive fixed rates for most standard services. Check out our non-binding price table:`
  ];

  const esVariants = [
    `En Kraken PFM apostamos por precios transparentes y condiciones favorables para el cliente. Para muchas tareas estándar, ofrecemos tarifas ficas atractivas (garantía de precio fijo) para que tenga total seguridad de planificación desde el principio. Aquí encontrará nuestro desglose de precios orientativos para la región de ${cityName}:`,
    `La transparencia y las tarifas planas justas son pilares de nuestro servicio en ${cityName}. Para servicios habituales, ofrecemos presupuestos fijos cerrados, asegurándole total claridad de costos desde el primer momento. Esta es nuestra estimación actual:`
  ];

  const frVariants = [
    `Chez Kraken PFM, nous misons sur des prix transparents et des conditions avantageuses pour le client. Pour de nombreuses tâches standard, nous proposons des forfaits attractifs (garantie de prix fixe) afin de vous assurer une totale sécurité de planification dès le départ. Voici notre aperçu indicatif des tarifs pour la région de de ${cityName} :`,
    `Des structures de prix claires et des tarifs forfaitaires équitables définissent nos prestations à ${cityName}. Pour la plupart des tâches courantes, nous appliquons des garanties de prix fixe transparentes afin de vous offrir une planification budgétaire sereine dès le début. Voici notre grille tarifaire :`
  ];

  const itVariants = [
    `In Kraken PFM puntiamo su prezzi trasparenti e condizioni vantaggiose per il cliente. Per molte attività standard offriamo tariffe fisse interessanti (garanzia di preço fisso) per garantirvi la massima sicurezza di pianificazione fin dall'inizio. Ecco la nostra panoramica indicativa dei prezzi per la regione di ${cityName}:`,
    `Trasparenza e tariffe forfettarie eque sono al centro delle nostre attività a ${cityName}. Per le prestazioni standard, applichiamo prezzi fissi trasparenti, offrendovi massima pianificazione finanziaria fin dal principio. Ecco il nostro listino orientativo:`
  ];

  const ptVariants = [
    `Na Kraken PFM, focamos em preços transparentes e condições amigáveis para o cliente. Para muitas tarefas padrão, oferecemos tarifas fixas atraentes (garantia de preço fixo) para garantir total segurança de planeamento desde o início. Aqui está a nossa tabela de preços indicativos para a região de ${cityName}:`,
    `Preços claros e condições justas definem o nosso trabalho na região de ${cityName}. Oferecemos orçamentos de preço fixo transparentes para serviços padronizados, garantindo previsibilidade total dos custos desde o início. Consulte a nossa lista de preços:`
  ];

  let chosenList = deVariants;
  if (cleanLang === 'en') chosenList = enVariants;
  else if (cleanLang === 'es') chosenList = esVariants;
  else if (cleanLang === 'fr') chosenList = frVariants;
  else if (cleanLang === 'it') chosenList = itVariants;
  else if (cleanLang === 'pt') chosenList = ptVariants;

  const chosen = chosenList[hashVal % chosenList.length];
  return paraphraseText(chosen, cityId + "_" + serviceId + "_pr_intro_final", lang);
};

const getLocalizedPricingNotice = (cityId: string, serviceId: string, lang: string, cityName: string): string => {
  const hashVal = getDeterministicHash(cityId + "_" + serviceId + "_pr_notice");
  const cleanLang = (lang || 'de').toLowerCase().split('-')[0];

  const deVariants = [
    `Der tatsächliche Endpreis richtet sich nach der genauen Quadratmeterzahl (m²), dem individuellen Zustand des Objekts sowie speziellen Kundenwünschen. Nutzen Sie unseren intelligenten Online-Konfigurator, um in nur 2 Minuten Ihr persönliches, massgeschneidertes Festpreisangebot zu berechnen!`,
    `Bitte beachten Sie, dass die finalen Kosten auf der exakten Fläche (m²), dem Verschmutzungsgrad Ihres Objekts und Ihren individuellen Sonderwünschen basieren. Mit unserem digitalen Sofort-Konfigurator ermitteln Sie in weniger als 2 Minuten Ihre massgeschneiderte Offerte für ${cityName}.`,
    `Der finale Rechnungsbetrag wird durch die tatsächliche Quadratmeterzahl, den Zustand vor Ort sowie Ihre Extrawünsche bestimmt. Kalkulieren Sie jetzt ganz einfach online mit unserem Konfigurator in nur 2 Minuten Ihren persönlichen, verbindlichen Festpreis für dieses Vorhaben.`,
    `Unsere Richtpreise variieren je nach der genauen m²-Zahl, dem individuellen Zustand der Räume und Ihren speziellen Anforderungen. Verwenden Sie einfach unseren Online-Konfigurator, um innerhalb von 2 Minuten ein perfekt auf Ihr Objekt abgestimmtes Festpreis-Angebot zu erhalten.`,
    `Die genaue Quadratmeterfläche, der Reinigungsaufwand und individuelle Wünsche definieren den endgültigen Preis. Nutzen Sie unsere intuitive Online-Kalkulation, um in maximal 2 Minuten ein transparentes, faires Festpreisangebot zu berechnen.`
  ];

  const enVariants = [
    `The actual final price depends on the exact square footage (m²), the individual condition of the property, and specific customer requirements. Use our intelligent online estimator to calculate your personal, tailored fixed-price quote in just 2 minutes!`,
    `Please note that final rates are determined by the precise area (m²), the degree of dirt/wear, and your individual request. Utilize our digital pricing wizard to receive a fully customized, guaranteed flat-rate offer for ${cityName} in under 2 minutes!`,
    `Actual costs are defined by the real size in square meters, on-site conditions, and specialized requirements. Run our automated online calculator to get a binding fixed price tailored specifically to your needs within 2 minutes!`,
    `Our guide prices may adjust based on exact size, individual condition of the premises, and specific choices. Try our user-friendly online estimator to get a reliable fixed-price quote in exactly 2 minutes.`
  ];

  const esVariants = [
    `El precio final real dependerá de la superficie exacta (m²), el estado particular del inmueble y los deseos específicos del cliente. ¡Utilice nuestro configurador inteligente online para calcular su presupuesto de precio fijo personalizado en solo 2 minutos!`,
    `Tenga en cuenta que el precio final se calcula según los metros cuadrados reales, el estado de limpieza y los requerimientos especiales. ¡Calcule una oferta personalizada de tarifa fija en menos de 2 minutos mediante nuestro simulador online para ${cityName}!`
  ];

  const frVariants = [
    `Le prix final réel dépend de la surface exacte (m²), de l'état individuel de la propriété et des demandes spécifiques du client. Utilisez notre configurateur en ligne intelligent pour calculer votre devis personnalisé à prix fixe en seulement 2 minutes !`,
    `Sachez que les tarifs définitifs s'ajustent selon la superficie réelle en m², l'état général des lieux et vos désirs spécifiques. Profitez de notre outil de tarification instantanée en ligne pour calculer une offre sur mesure en moins de 2 minutes !`
  ];

  const itVariants = [
    `Il prezzo finale effettivo dipende dalla metratura esatta (m²), dallo stato specifico dell'immobile e dalle richieste del cliente. Utilizzate il nostro configuratore online intelligente per ottenere un preventivo a prezzo fisso personalizzato in soli 2 minuti!`,
    `La spesa finale effettiva viene calcolata in base alla superficie reale (m²), alle condizioni dell'immobile e alle vostre preferenze. Utilizzate il nostro configuratore digitale per definire un preventivo a prezzo bloccato su misura in appena 2 minuti!`
  ];

  const ptVariants = [
    `O preço final exato depende da área em metros quadrados (m²), do estado do imóvel e de requisitos específicos. Utilize o nosso configurador online inteligente para calcular o seu orçamento de preço fixo personalizado em apenas 2 minutos!`,
    `Note que o valor final é determinado pela metragem exata (m²), nível de sujidade e solicitações individuais. Use o nosso configurador inteligente para obter uma cotação de preço fixo garantida em menos de 2 minutos!`
  ];

  let chosenList = deVariants;
  if (cleanLang === 'en') chosenList = enVariants;
  else if (cleanLang === 'es') chosenList = esVariants;
  else if (cleanLang === 'fr') chosenList = frVariants;
  else if (cleanLang === 'it') chosenList = itVariants;
  else if (cleanLang === 'pt') chosenList = ptVariants;

  const chosen = chosenList[hashVal % chosenList.length];
  return paraphraseText(chosen, cityId + "_" + serviceId + "_pr_notice_final", lang);
};

const getLocalizedChecklistIntro = (cityId: string, serviceId: string, lang: string, cityName: string, serviceTitle: string): string => {
  const hashVal = getDeterministicHash(cityId + "_" + serviceId + "_chk_intro");
  const cleanLang = (lang || 'de').toLowerCase().split('-')[0];

  const deVariants = [
    `Bei jedem Einsatz von Kraken PFM für ${serviceTitle} in ${cityName} sind folgende Leistungen fest enthalten:`,
    `Für Ihren Auftrag im Bereich ${serviceTitle} in ${cityName} deckt unser Service diese Leistungen standardmässig und ohne Aufpreis ab:`,
    `Im Rahmen von ${serviceTitle} in ${cityName} sind alle nachfolgend aufgeführten Arbeiten fest inbegriffen und Teil unseres Qualitätsversprechens:`,
    `Wenn Sie uns für ${serviceTitle} in ${cityName} buchen, sind folgende Kernleistungen bereits vollständig im Paketpreis enthalten:`,
    `Unser Angebot für ${serviceTitle} in ${cityName} umfasst standardmässig die folgenden lückenlos ausgeführten Arbeiten:`
  ];

  const enVariants = [
    `On every single assignment of Kraken PFM for ${serviceTitle} in ${cityName}, the following tasks are fully covered:`,
    `When you book Kraken PFM for ${serviceTitle} in ${cityName}, the following items are standardly included in the package:`,
    `For your ${serviceTitle} project in ${cityName}, the following essential services are covered with no extra fees:`,
    `Our professional package for ${serviceTitle} in ${cityName} automatically covers all the following procedures:`
  ];

  const esVariants = [
    `En cada servicio de Kraken PFM para ${serviceTitle} en ${cityName}, se incluyen los siguientes servicios:`,
    `Para su proyecto de ${serviceTitle} en ${cityName}, cubrimos de manera estándar los siguientes puntos clave:`
  ];

  const frVariants = [
    `Pour chaque intervention de Kraken PFM pour ${serviceTitle} à ${cityName}, les prestations suivantes sont incluses d'office :`,
    `Dans le cadre de votre prestation de ${serviceTitle} à ${cityName}, les travaux suivants sont entièrement inclus :`
  ];

  const itVariants = [
    `Per ogni intervento di Kraken PFM per ${serviceTitle} a ${cityName}, le seguenti prestazioni sono incluse di serie:`,
    `Nel nostro pacchetto di ${serviceTitle} a ${cityName}, i seguenti servizi sono inclusi senza costi aggiuntivi:`
  ];

  const ptVariants = [
    `Em cada serviço da Kraken PFM para ${serviceTitle} em ${cityName}, os seguintes serviços estão totalmente incluídos:`,
    `Para o seu pedido de ${serviceTitle} em ${cityName}, garantimos a cobertura total das seguintes tarefas padrão:`
  ];

  let chosenList = deVariants;
  if (cleanLang === 'en') chosenList = enVariants;
  else if (cleanLang === 'es') chosenList = esVariants;
  else if (cleanLang === 'fr') chosenList = frVariants;
  else if (cleanLang === 'it') chosenList = itVariants;
  else if (cleanLang === 'pt') chosenList = ptVariants;

  const chosen = chosenList[hashVal % chosenList.length];
  return paraphraseText(chosen, cityId + "_" + serviceId + "_chk_intro_final", lang);
};

const getLocalizedBookingSteps = (lang: string, cityId: string, serviceId: string, cityName: string): string[] => {
  const seed = cityId + "_" + serviceId;
  const hashVal = getDeterministicHash(seed);
  
  const deVariants = [
    [
      `Senden Sie Ihre Anfrage in nur 2 Minuten ganz einfach über das Formular für ${cityName}.`,
      "Wir senden Ihnen innert 24 Stunden eine Bestätigung und alle Termindetails.",
      "Unsere Crew trifft pünktlich bei Ihnen ein – Abrechnung erfolgt erst nach getaner Arbeit."
    ],
    [
      "Füllen Sie unser kurzes Online-Formular in weniger als 2 Minuten bequem aus.",
      `Sie erhalten innerhalb von 24h ein transparentes Festpreis-Angebot für ${cityName}.`,
      "Unser Team erledigt den Einsatz pünktlich und zuverlässig – Sie zahlen erst nach Abnahme."
    ],
    [
      `Übermitteln Sie uns Ihre Projektdetails für ${cityName} online in etwa 2 Minuten.`,
      "Ihr persönlicher Berater sendet Ihnen innert 24 Stunden die feste Terminbestätigung.",
      "Pünktliche Ausführung durch unsere Experten mit Abrechnung direkt nach der Abnahme."
    ],
    [
      `Starten Sie Ihre unverbindliche Online-Anfrage für ${cityName} mit wenigen Klicks.`,
      "Unser Service-Team meldet sich binnen 24h mit der Buchungsbestätigung bei Ihnen.",
      "Zuverlässiger Vor-Ort-Service mit Qualitätsgarantie und transparenter Bezahlung danach."
    ]
  ];

  const enVariants = [
    [
      `Submit your inquiry in just 2 minutes via our quick online form for ${cityName}.`,
      "We will send your stable booking confirmation and appointment details within 24 hours.",
      "Our specialist team arrives exactly on schedule – pay comfortably after completion."
    ],
    [
      `Enter your key project requirements for ${cityName} online in less than 2 minutes.`,
      "Receive your fully transparent fixed-price offer from our team in 24 hours.",
      "Our professionals execute the tasks cleanly and reliably – billing only after your approval."
    ],
    [
      `Send us your request details for ${cityName} with a few clicks in about 2 minutes.`,
      "Our friendly coordinators will confirm your preferred date and details within 24h.",
      "Reliable on-site service with a quality guarantee and transparent payment afterwards."
    ],
    [
      `Start your non-binding query for your property in ${cityName} in just 2 minutes.`,
      "We will get back to you with a direct price calculation and schedule in less than 24 hours.",
      "Punctual execution by our vetted experts and payment is only due after successful service."
    ]
  ];

  const esVariants = [
    [
      `Envíe su solicitud en solo 2 minutos a través de nuestro formulario rápido para ${cityName}.`,
      "Le enviaremos la confirmación definitiva y detalles de la cita en un plazo de 24 horas.",
      "Nuestro equipo de especialistas llega puntual – pago cómodo después del servicio."
    ],
    [
      `Complete el formulario de cotización para ${cityName} en menos de 2 minutos.`,
      "Reciba su oferta confirmada y los detalles del servicio en un plazo de 24 horas.",
      "Nuestro equipo experto realiza el trabajo a tiempo – pague solo al finalizar."
    ],
    [
      `Transmita los detalles de su proyecto para ${cityName} online en unos 2 minutos.`,
      "Nuestro asesor de servicio confirmará su fecha preferida en menos de 24 horas.",
      "Servicio in situ de máxima confianza con garantía de calidad y facturación tras el trabajo."
    ],
    [
      `Inicie su consulta sin compromiso para su inmueble en ${cityName} en 2 minutos.`,
      "Le responderemos con un presupuesto claro y planificación en menos de 24 horas.",
      "Ejecución puntual de nuestros profesionales y pago debido solo tras un servicio exitoso."
    ]
  ];

  const frVariants = [
    [
      `Envoyez votre demande en seulement 2 minutes via notre formulaire rapide pour ${cityName}.`,
      "Nous vous enverrons votre confirmation définitive et les détails du rendez-vous sous 24h.",
      "Notre équipe de spécialistes arrive à l'heure – paiement confortable après l'achèvement."
    ],
    [
      `Saisissez vos données clés pour ${cityName} en ligne en moins de 2 minutes.`,
      "Vous recevrez une offre forfaitaire transparente de notre part dans les 24 heures.",
      "Nos experts réalisent les travaux de manière ponctuelle et fiable – facturation après réception."
    ],
    [
      `Transmettez-nous les détails de votre projet pour ${cityName} en environ 2 minutes.`,
      "Notre équipe de planification confirmera votre date préférée dans un délai de 24 heures.",
      "Service sur site d'une fiabilité absolue avec garantie de qualité et facturation après travaux."
    ],
    [
      `Commencez votre demande sans engagement pour votre bien à ${cityName} en 2 minutes.`,
      "Nous vous répondrons avec un devis clair et les détails du planning en moins de 24h.",
      "Exécution ponctuelle par nos professionnels et règlement uniquement après service réussi."
    ]
  ];

  const itVariants = [
    [
      `Invia la tua richiesta in soli 2 minuti tramite il nostro modulo rapido per ${cityName}.`,
      "Invieremo la conferma definitiva e i dettagli dell'appuntamento entro 24 ore.",
      "Il nostro team di specialisti arriva puntuale – pagamento comodo a lavoro ultimato."
    ],
    [
      `Inserisci i dati chiave del tuo progetto per ${cityName} in meno di 2 minuti.`,
      "Riceverai una nostra proposta a prezzo fisso trasparente entro 24 ore.",
      "I nostri professionisti eseguono i lavori in modo puntuale e affidabile – pagamento dopo il controllo."
    ],
    [
      `Trasmetti i dettagli dell'intervento per ${cityName} con pochi clic in circa 2 minuti.`,
      "Il nostro team di pianificazione confermerà la tua data preferita entro 24 ore.",
      "Servizio sul posto affidabile con garanzia di qualità e fatturazione ad avvenuta esecuzione."
    ],
    [
      `Inizia la tua richiesta senza impegno per il tuo immobile a ${cityName} in 2 minuti.`,
      "Ti risponderemo con una proposta chiara e i dettagli organizzativi in meno di 24 ore.",
      "Esecuzione puntuale da parte dei nostri esperti e pagamento dovuto solo a servizio concluso."
    ]
  ];

  const ptVariants = [
    [
      `Envie o seu pedido em apenas 2 minutos através do nosso formulário rápido para ${cityName}.`,
      "Enviaremos a sua confirmação definitiva e os detalhes do agendamento em até 24 horas.",
      "A nossa equipa de especialistas chega pontualmente – pagamento simples após a conclusão."
    ],
    [
      `Insira os dados principais do seu projeto para ${cityName} em menos de 2 minutos.`,
      "Receberá uma proposta de preço fixo totalmente transparente nas 24 horas seguintes.",
      "Os nossos profissionais realizam o trabalho de forma pontual e confiável – pagamento após aprovação."
    ],
    [
      `Transmita-nos os detalhes do seu pedido para ${cityName} em cerca de 2 minutos.`,
      "A nossa equipa de planeamento confirmará a sua data preferida dentro de 24h.",
      "Serviço no local altamente confiável com garantia de qualidade e faturação pós-serviço."
    ],
    [
      `Inicie a sua consulta sem compromisso para o seu imóvel em ${cityName} en 2 minutos.`,
      "Responderemos com uma cotação clara e os detalhes do agendamento em menos de 24 horas.",
      "Execução pontual pelos nossos especialistas qualificados e pagamento apenas após o serviço concluído."
    ]
  ];

  const activeLang = ['de', 'en', 'es', 'fr', 'it', 'pt'].includes(lang) ? lang : 'de';
  let variants = deVariants;
  if (activeLang === 'en') variants = enVariants;
  else if (activeLang === 'es') variants = esVariants;
  else if (activeLang === 'fr') variants = frVariants;
  else if (activeLang === 'it') variants = itVariants;
  else if (activeLang === 'pt') variants = ptVariants;

  const chosenVariant = variants[hashVal % variants.length];
  return chosenVariant.map((step, idx) => paraphraseText(step, cityId + "_" + serviceId + "_step_" + idx, lang));
};

const getLocalizedHeroBlurb = (lang: string, cityId: string, serviceId: string, cityName: string): string => {
  const seed = cityId + "_" + serviceId;
  const hashVal = getDeterministicHash(seed);

  const deBlurbs = [
    `Schweizer Handwerkspräzision, transparente Festpreise und 100% ökologische Verantwortung von Kraken Properties & Facilities Management in ${cityName}.`,
    `Kraken PFM bringt erstklassige Schweizer Handwerksqualität, transparente Pauschalkonditionen und vollumfänglichen Umweltschutz direkt zu Ihnen nach ${cityName}.`,
    `Mit zertifizierter Fachkompetenz, fairen Festpreisangeboten ohne Zusatzkosten und einem konsequent ökologischen Ansatz betreuen wir Ihr Objekt in ${cityName}.`,
    `Erleben Sie kompromisslose Professionalität, GAV-konforme Löhne und einen nachhaltig CO2-kompensierten Service bei Ihnen vor Ort in ${cityName}.`
  ];

  const enBlurbs = [
    `Swiss craftsmanship precision, transparent fixed prices and 100% ecological responsibility by Kraken Properties & Facilities Management in ${cityName}.`,
    `Kraken PFM delivers supreme Swiss quality, fair flat rates, and fully certified ecological responsibility directly in ${cityName}.`,
    `Experience top-tier Swiss-level craftsmanship, clear fixed pricing, and sustainable eco-friendly standards in the ${cityName} area.`,
    `Your premier choice for professional, GAV-compliant, and 100% carbon-neutral facility services right here in ${cityName}.`
  ];

  const esBlurbs = [
    `Precisión de la artesanía suiza, precios fijos transparentes y responsabilidad 100% ecológica de Kraken Properties & Facilities Management en ${cityName}.`,
    `Kraken PFM ofrece la máxima calidad de servicio suizo, tarifas fijas claras y un enfoque ecológico certificado en ${cityName}.`,
    `Experimente un nivel superior de calidad suiza, presupuestos fijos transparentes y prácticas ecológicas en ${cityName}.`,
    `Su socio principal para servicios profesionales y 100% neutros en carbono en la región de ${cityName}.`
  ];

  const frBlurbs = [
    `Précision de l’artisanat suisse, prix fixes transparents et responsabilité 100% écologique par Kraken Properties & Facilities Management à ${cityName}.`,
    `Kraken PFM apporte une qualité suisse d'exception, des tarifs forfaitaires transparents et un engagement écoresponsable à ${cityName}.`,
    `Bénéficiez d'une précision suisse certifiée, de prix fixes clairs et de méthodes de nettoyage écologiques dans la région de ${cityName}.`,
    `Votre partenaire de premier choix pour des services d'entretien professionnels, éco-certifiés et sans frais cachés à ${cityName}.`
  ];

  const itBlurbs = [
    `Precisione artigianale svizzera, prezzi fissi trasparenti e responsabilità ecologica al 100% di Kraken Properties & Facilities Management a ${cityName}.`,
    `Kraken PFM porta l'eccellenza svizzera, tariffe fisse trasparenti e un impegno ecologico certificato al 100% direttamente a ${cityName}.`,
    `Sperimentate la cura del dettaglio di classe svizzera, prezzi fissi chiari e pulizie eco-compatibili nella regione di ${cityName}.`,
    `Il vostro punto di riferimento a ${cityName} per servizi professionali conformi ai massimi standard di sostenibilidade.`
  ];

  const ptBlurbs = [
    `Precisão artesanal suíça, preços fixos transparentes e responsabilidade 100% ecológica da Kraken Properties & Facilities Management em ${cityName}.`,
    `A Kraken PFM oferece serviços com qualidade de excelência suíça, taxas fixas transparentes e responsabilidade ecológica em ${cityName}.`,
    `Desfrute de precisão suíça garantida, preços fixos claros e métodos ecológicos de limpeza em toda a região de ${cityName}.`,
    `O seu parceiro de eleição para soluções de manutenção profissionais, sustentáveis e sem custos ocultos em ${cityName}.`
  ];

  const activeLang = ['de', 'en', 'es', 'fr', 'it', 'pt'].includes(lang) ? lang : 'de';
  let chosen = "";
  if (activeLang === 'de') chosen = deBlurbs[hashVal % deBlurbs.length];
  else if (activeLang === 'en') chosen = enBlurbs[hashVal % enBlurbs.length];
  else if (activeLang === 'es') chosen = esBlurbs[hashVal % esBlurbs.length];
  else if (activeLang === 'fr') chosen = frBlurbs[hashVal % frBlurbs.length];
  else if (activeLang === 'it') chosen = itBlurbs[hashVal % itBlurbs.length];
  else chosen = ptBlurbs[hashVal % ptBlurbs.length];

  return paraphraseText(chosen, seed + "_hero", lang);
};

const marketingVariants: Record<string, {
  de: { openings: string[], middles: string[], closings: string[] };
  en: { openings: string[], middles: string[], closings: string[] };
  es: { openings: string[], middles: string[], closings: string[] };
}> = {
  'window-cleaning': {
    de: {
      openings: [
        "Die professionelle Fensterreinigung in {city} sorgt für makellose Sauberkeit und einen ungetrübten Ausblick.",
        "Für streifenfreien Glanz Ihrer Glasflächen im gesamten Stadtgebiet von {city} bietet Kraken PFM eine erstklassige Fensterreinigung.",
        "Unser fachgerechter Fensterreinigungsservice in {city} befreit Scheiben und Rahmen gründlich von allen Witterungseinflüssen.",
        "In {city} bringen unsere qualifizierten Fensterputzer Ihre Glasbauten, Fenster und Wintergärten wieder zum Strahlen."
      ],
      middles: [
        "Wir säubern alle Glasflächen gründlich von innen und aussen, reinigen Rahmen, Falze sowie Simse und befreien Rollläden oder Lamellenstoren von Staub.",
        "Dabei reinigen wir Scheiben, Einfassungen und Simse sorgfältig und entfernen Schmutz, Pollen, Russ und Flecken von Lamellenstoren sowie Rollläden.",
        "Unser Team kümmert sich um die Innen- und Aussenseiten aller Fenster, pflegt die Rahmen und befreit Rollläden sowie Storensysteme von Witterungsspuren."
      ],
      closings: [
        "Wir nutzen modernste Techniken wie das umweltschonende Osmose-Verfahren mit entmineralisiertem Wasser für langanhaltende Sauberkeit.",
        "Dank professioneller Ausrüstung und umweltfreundlichen Produkten garantieren wir hervorragende Sichtverhältnisse ohne Chemie-Rückstände.",
        "Das Ergebnis ist ein streifenfreier Glanz und ein langanhaltender Schutz vor rascher Wiederverschmutzung."
      ]
    },
    en: {
      openings: [
        "Professional window cleaning in {city} guarantees streak-free clarity and an immaculate view.",
        "For crystal-clear glass surfaces throughout {city}, Kraken PFM offers professional-grade window washing.",
        "Our specialized window cleaning service in {city} completely removes dirt, dust, and weather residues from all windows."
      ],
      middles: [
        "We clean all interior and exterior glass, wipe down frames and sills, and meticulously dust shutters and blinds.",
        "Our process includes washing window panes, cleaning frames and seals, and wiping exterior blinds slat by slat.",
        "Our team cleans every window thoroughly inside and out, treats the frames, and restores dirty blinds to a fresh look."
      ],
      closings: [
        "We utilize eco-friendly pure water technology to ensure a lasting shine with no chemical film left behind.",
        "Equipped with advanced tools, we guarantee impeccable results and protection against rapid re-soiling.",
        "Expect top Swiss quality, punctual service, and completely transparent fixed pricing."
      ]
    },
    es: {
      openings: [
        "La limpieza profesional de ventanas en {city} asegura un resultado impecable y una vista despejada.",
        "Para cristales resplandecientes en toda la zona de {city}, Kraken PFM ofrece un servicio de lavado de ventanas de alta calidad.",
        "Nuestro servicio técnico de limpieza de vidrios en {city} elimina por completo las marcas y la suciedad del clima."
      ],
      middles: [
        "Lavamos todos los cristales por dentro y por fuera, limpiando marcos, molduras y desempolvando las persianas lama por lama.",
        "El proceso cubre el lavado de vidrios, limpieza de marcos y rieles, además del mantenimiento de persianas enrollables.",
        "Atendemos de manera minuciosa la cara interna y externa de cada ventana, tratando los marcos y quitando el polvo de las persianas."
      ],
      closings: [
        "Utilizamos tecnología ecológica de agua pura desmineralizada para un acabado duradero y ecológico.",
        "Gracias a herramientas profesionales y productos sostenibles, garantizamos resultados sin rayas ni residuos químicos.",
        "Disfrute de la máxima puntualidad y seriedad suiza con presupuestos fijos transparentes."
      ]
    }
  },
  'end-of-tenancy': {
    de: {
      openings: [
        "Die professionelle Umzugsreinigung (Endreinigung) mit 100% Abgabegarantie in {city} nimmt Ihnen den Stress bei der Wohnungsabgabe ab.",
        "Für einen absolut sorgenfreien Auszug aus Ihrer Immobilie in {city} sorgt unser lückenloser Endreinigungsservice nach Schweizer Standard.",
        "Überlassen Sie die anspruchsvolle Wohnungsreinigung für die Übergabe in {city} einfach unseren erfahrenen Reinigungsspezialisten.",
        "Wir bereiten Ihr Mietobjekt in {city} perfekt auf den Abnahmetermin vor, sodass Sie sich entspannt zurücklehnen können."
      ],
      middles: [
        "Wir führen eine tiefenwirksame Reinigung aller Räume, Einbauschränke, Sanitäreanlagen sowie der kompletten Küche inklusive Ofen und Kühlschrank durch.",
        "Alle Böden, Türen, Wände, Schränke, Küchengeräte und Nasszellen werden von unserem eingespielten Team tiefenreinigend gesäubert.",
        "Unser Team reinigt lückenlos alle Einbauten, entkalkt Bad und WC gründlich und säubert alle Küchengeräte inklusive Backofen und Dunstabzugshaube."
      ],
      closings: [
        "Unsere 100% Abgabegarantie bedeutet: Wir haften für die Sauberkeit und sind beim Übergabetermin persönlich vor Ort anwesend.",
        "Dank unserer inkludierten Übergabegarantie und der persönlichen Begleitung bei der Abgabe gehen Sie absolut kein Risiko ein.",
        "Sollte die Verwaltung wider Erwarten Mängel beanstanden, beheben wir diese im Rahmen der Abgabegarantie sofort kostenfrei vor Ort."
      ]
    },
    en: {
      openings: [
        "Our professional end of tenancy cleaning with a 100% handover guarantee in {city} removes all stress from your move.",
        "For a completely worry-free move-out in {city}, we provide a comprehensive deep clean matching strict Swiss standards.",
        "Entrust the intensive final cleaning of your apartment in {city} to our seasoned, fully insured specialists."
      ],
      middles: [
        "We perform a deep clean of all rooms, built-in wardrobes, bathrooms, and the entire kitchen including the oven and fridge.",
        "Every floor, door, cabinet, appliance, and bathroom fixture is thoroughly sanitized and descaled by our dedicated crew.",
        "Our team cleans built-in closets inside and out, deeply descales bathrooms, and degreases kitchen hoods and ovens."
      ],
      closings: [
        "Our 100% handover guarantee means we are physically present at the walkthrough and assume full responsibility.",
        "With our included handover guarantee, you run zero risk—we handle any landlord requests immediately and free of charge.",
        "Rely on our local experience, GAV-compliant staff, and completely transparent fixed-price quotes."
      ]
    },
    es: {
      openings: [
        "Nuestra limpieza profesional de fin de contrato con garantía de entrega del 100% en {city} le quita todo el estrés de la mudanza.",
        "Para una mudanza sin preocupaciones en {city}, ofrecemos una limpieza profunda final que cumple con las estrictas normas suizas.",
        "Deje la difícil tarea de la limpieza de entrega en {city} en manos de nuestros expertos de total confianza."
      ],
      middles: [
        "Realizamos una limpieza profunda de todas las habitaciones, armarios empotrados, baños y la cocina completa, incluyendo horno y nevera.",
        "Cada suelo, puerta, armario, electrodoméstico y baño es descalcificado y desinfectado por nuestro equipo profesional.",
        "Limpiamos los armarios por dentro y por fuera, descalcificamos grifos y azulejos, y eliminamos la grasa de la campana extractora y el horno."
      ],
      closings: [
        "Nuestra garantía de entrega del 100% significa que estamos presentes en la inspección y asumimos toda la responsabilidad.",
        "Con nuestra garantía incluida, no corre ningún riesgo: resolvemos cualquier objeción del propietario de inmediato y sin coste adicional.",
        "Cuente con la máxima profesionalidad suiza, precios fijos claros y personal asegurado bajo convenio."
      ]
    }
  },
  'deep-cleaning': {
    de: {
      openings: [
        "Unsere intensive Spezial- und Grundreinigung rückt auch tiefsitzendem Schmutz und hartnäckigen Verkrustungen in {city} zu Leibe.",
        "Für langanhaltende Frische und absolute Hygiene in {city} sorgt unsere professionelle Tiefenreinigung.",
        "In {city} bietet Kraken PFM eine gründliche Grundreinigung für private Haushalte und gewerbliche Objekte."
      ],
      middles: [
        "Wir reinigen alle Fugen, Fliesen, Heizkörper, Steckdosen und Nischen porentief mit biologischen Reinigungsmitteln.",
        "Unser Spezialistenteam desinfiziert alle Oberflächen, entkalkt Nasszellen restlos und säubert Schrankinnenräume.",
        "Dabei säubern wir schwer zugängliche Bereiche, entfernen hartnäckige Kalkbeläge und entfetten sämtliche Oberflächen."
      ],
      closings: [
        "Perfekt für den jährlichen Frühjahrsputz, nach Renovierungsarbeiten oder vor dem Einzug in ein neues Zuhause.",
        "Wir sorgen für hygienische Sauberkeit und den nachhaltigen Werterhalt Ihrer hochwertigen Einbauten.",
        "Erleben Sie ein unvergleichliches Frischegefühl in Ihren perfekt gepflegten Räumen."
      ]
    },
    en: {
      openings: [
        "Our intensive deep cleaning service in {city} targets stubborn dirt, grime, and built-up grease with precision.",
        "For lasting freshness and exceptional hygiene in {city}, choose our professional deep cleaning treatment.",
        "In {city}, Kraken PFM offers thorough, top-to-bottom deep cleaning for homes and commercial buildings."
      ],
      middles: [
        "We clean grout lines, tiles, baseboards, radiators, and cabinet interiors using eco-friendly products.",
        "Our team treats all high-touch surfaces, descales bathrooms completely, and degreases kitchen areas.",
        "We reach under furniture, clean behind appliances, and remove stubborn mineral deposits from all fixtures."
      ],
      closings: [
        "Ideal for your annual spring cleaning, post-renovation recovery, or before moving into a new property.",
        "We protect and preserve the value of your high-quality materials and floors with specialized techniques.",
        "Enjoy a pristine hygienic baseline and a beautifully refreshed indoor atmosphere."
      ]
    },
    es: {
      openings: [
        "Nuestro servicio intensivo de limpieza a fondo en {city} combate la suciedad difícil y la grasa acumulada con precisión.",
        "Para una frescura duradera y una higiene impecable en {city}, elija nuestra limpieza profunda profesional.",
        "En {city}, Kraken PFM ofrece limpiezas a fondo exhaustivas para viviendas particulares y locales comerciales."
      ],
      middles: [
        "Limpiamos juntas de baldosas, azulejos, rodapiés, radiadores y el interior de armarios con productos biodegradables.",
        "Nuestro equipo desinfecta superficies de contacto, descalcifica baños y elimina la grasa rebelde en la cocina.",
        "Llegamos bajo los muebles pesados, limpiamos detrás de electrodomésticos y eliminamos depósitos de cal difíciles."
      ],
      closings: [
        "Excelente opción para la limpieza de primavera, después de reformas o antes de instalarse en una propiedad.",
        "Protegemos y mantenemos el valor de sus materiales delicados y suelos mediante técnicas especializadas.",
        "Disfrute de un entorno completamente sano, higiénico y reluciente."
      ]
    }
  },
  'daily-cleaning': {
    de: {
      openings: [
        "Die regelmässige Unterhaltsreinigung in {city} sorgt konstant für ein repräsentatives und gepflegtes Ambiente.",
        "Mit unserem flexiblen Abo-Service für die Unterhaltsreinigung in {city} geniessen Sie dauerhafte Sauberkeit in Ihrem Zuhause.",
        "In {city} pflegen wir Ihre Wohn- oder Geschäftsräume zuverlässig im gewünschten wöchentlichen oder zweiwöchentlichen Rhythmus."
      ],
      middles: [
        "Wir staubsaugen und feuchtwischen alle Böden, stauben Oberflächen ab, desinfizieren Bäder und reinigen Küchenzeilen.",
        "Unser eingespieltes Personal säubert alle erreichbaren Oberflächen, pflegt Hartböden und leert sämtliche Abfalleimer.",
        "Der Service umfasst das Abstauben der Möbel, die hygienische Reinigung von WC und Dusche sowie die Müllentsorgung."
      ],
      closings: [
        "Sie erhalten eine feste, vertrauenswürdige Stamm-Reinigungskraft für maximale Konstanz und Vertrauen.",
        "Unsere flexiblen Verträge haben keine langfristigen Bindungen, sondern passen sich ganz Ihrem Lebensrhythmus an.",
        "Lehnen Sie sich zurück und überlassen Sie die alltägliche Pflege unseren voll versicherten Experten."
      ]
    },
    en: {
      openings: [
        "Regular maintenance cleaning in {city} keeps your home or office consistently pristine and welcoming.",
        "With our flexible subscription-based recurring cleaning in {city}, you can enjoy effortless daily freshness.",
        "In {city}, we care for your residential or commercial space on a customized weekly or bi-weekly schedule."
      ],
      middles: [
        "We vacuum and mop all floors, dust furniture and shelves, sanitize bathrooms, and clean kitchen countertops.",
        "Our professional crew wipes down reachable surfaces, details bathrooms, and empties all trash bins.",
        "The routine covers careful dusting, hygienic sanitization of toilets and showers, and orderly waste disposal."
      ],
      closings: [
        "We assign a dedicated, trusted cleaner to your space for maximum consistency and peace of mind.",
        "Our flexible agreements feature no lock-in contracts, adapting easily to your ongoing requirements.",
        "Relax and delegate your daily household cleaning to our fully insured, GAV-compliant professionals."
      ]
    },
    es: {
      openings: [
        "La limpieza de mantenimiento regular en {city} mantiene su hogar u oficina siempre impecable y acogedora.",
        "Con nuestra suscripción flexible de limpieza periódica en {city}, disfrutará de una frescura constante sin esfuerzo.",
        "En {city}, cuidamos de su espacio residencial o comercial con un calendario semanal o quincenal adaptado."
      ],
      middles: [
        "Aspiramos y fregamos todos los suelos, quitamos el polvo de los muebles, desinfectamos baños y repasamos la cocina.",
        "Nuestro personal cualificado limpia las superficies accesibles, higieniza aseos y vacía todas las papeleras.",
        "La rutina cubre el desempolvado cuidadoso, desinfección de inodoros y duchas, y la retirada de basuras."
      ],
      closings: [
        "Asignamos una limpiadora fija de total confianza a su espacio para garantizar consistencia y tranquilidad.",
        "Nuestros acuerdos flexibles no tienen permanencia, adaptándose fácilmente a sus necesidades.",
        "Relájese y delegue las tareas domésticas en manos de nuestros profesionales totalmente asegurados."
      ]
    }
  },
  'moving-furniture': {
    de: {
      openings: [
        "Die professionelle Umzugshilfe in {city} sorgt für einen reibungslosen, sicheren und absolut stressfreien Wohnortswechsel.",
        "Mit der erfahrenen Zügelcrew von Kraken Logistik in {city} transportieren Sie Ihr Eigentum sicher an den Bestimmungsort.",
        "Für Ihren privaten oder geschäftlichen Umzug im Grossraum {city} bieten wir Ihnen massgeschneiderte Speditionslösungen."
      ],
      middles: [
        "Wir übernehmen die fachgerechte Demontage Ihrer Möbel, verpacken empfindliche Wertsachen in Schutzdecken und beladen den LKW transportsicher.",
        "Unser eingespieltes Zügelteam kümmert sich um den Abbau, schützt Ihr Hab und Gut mit Luftpolsterfolien und transportiert alles absolut erschütterungsfrei.",
        "Wir demontieren Schränke, Betten und Regale fachmännisch, sichern empfindliche Kanten und laden alles sorgfältig in unsere modernen Fahrzeuge."
      ],
      closings: [
        "Dank unserer umfassenden Transport- und Betriebshaftpflichtversicherung bis CHF 5 Mio. sind Sie bestens abgesichert.",
        "Verlassen Sie sich auf pünktliche Ausführung, erfahrene Chauffeure und transparente Festpreise ohne versteckte Gebühren.",
        "Unser Full-Service-Umzug deckt alle Schritte ab, damit Sie sich entspannt in Ihrem neuen Heim einleben können."
      ]
    },
    en: {
      openings: [
        "Our professional moving and transport services in {city} guarantee a smooth and stress-free relocation.",
        "With Kraken Logistics in {city}, your valuable household items are transported safely to their new destination.",
        "For your residential or commercial relocation in {city}, we provide customized transport solutions."
      ],
      middles: [
        "We handle expert furniture disassembly, wrap delicate items in protective blankets, and load them securely into our trucks.",
        "Our experienced movers disassemble wardrobes and beds, protect every piece with stretch wraps, and handle transport safely.",
        "The service covers professional packing, disassembly of large furniture, secure loading, and safe road transit."
      ],
      closings: [
        "Your belongings are fully insured during transit and handling under our comprehensive liability coverage.",
        "Rely on timely execution, experienced Swiss drivers, and clear fixed-rate quotes.",
        "We make moving simple and safe, allowing you to settle comfortably into your new home."
      ]
    },
    es: {
      openings: [
        "Nuestros servicios profesionales de mudanza y transporte en {city} garantizan un traslado fluido y libre de estrés.",
        "Con Kraken Logística en {city}, sus pertenencias de valor son transportadas de forma segura a su nuevo destino.",
        "Para su traslado residencial o comercial en {city}, ofrecemos soluciones de transporte personalizadas."
      ],
      middles: [
        "Nos encargamos del desmontaje experto de muebles, protegemos los objetos delicados con mantas especiales y los cargamos de forma segura.",
        "Nuestros operarios experimentados desarman armarios y camas, envuelven cada pieza con películas protectoras y realizan el transporte seguro.",
        "El servicio abarca el embalaje profesional, desmontaje de muebles voluminosos, carga cuidadosa y transporte seguro por carretera."
      ],
      closings: [
        "Sus pertenencias están totalmente aseguradas durante el trayecto con nuestra amplia cobertura de responsabilidad.",
        "Confíe en una ejecución puntual, conductores suizos experimentados y presupuestos fijos claros.",
        "Hacemos que mudarse sea fácil y seguro, permitiéndole instalarse cómodamente en su nuevo hogar."
      ]
    }
  }
};

interface SeoServiceCityPageProps {
  cityId: string;
  serviceId: string;
  onNavigate: (page: string) => void;
}

// Map slug names to official database/wizard names
const CITY_METADATA: Record<string, {
  name: string;
  germanName: string;
  postcode: string;
  desc: string;
  image: string;
  features: string[];
}> = {
  zurich: {
    name: 'Zurich',
    germanName: 'Zürich',
    postcode: '8000',
    image: cityImages.zurich,
    desc: 'Zürich und das gesamte Einzugsgebiet profitieren von unserem hochpräzisen Facility Management. Ob repräsentative Büros an der Bahnhofstrasse, edle Apartments am Zürichsee oder Industrieanlagen – wir garantieren Schweizer Qualität auf höchstem Niveau.',
    features: ['Einsatzgebiet: Stadt Zürich & Agglomeration', 'Reaktionszeit: Express-Service verfügbar', 'Lokale Crew mit bester Ortskenntnis', '100% CO2-kompensierte Anfahrt']
  },
  winterthur: {
    name: 'Winterthur',
    germanName: 'Winterthur',
    postcode: '8400',
    image: cityImages.winterthur,
    desc: 'In der Kultur- und Industriestadt Winterthur sichern wir die Langlebigkeit Ihrer Immobilien. Unser eingespieltes Team betreut Wohnungen, Schulen, Gewerbe- und Industrieobjekte im gesamten Grossraum Winterthur mit Schweizer Gewissenhaftigkeit.',
    features: ['Einsatzgebiet: Winterthur & Weinland', 'Reaktionszeit: Unter 2 Stunden vor Ort', 'Fokus auf Nachhaltigkeit & Grüne Produkte', 'Enge Zusammenarbeit mit lokalen Partnern']
  },
  schaffhausen: {
    name: 'Schaffhausen',
    germanName: 'Schaffhausen',
    postcode: '8200',
    image: cityImages.schaffhausen,
    desc: 'Als stolzes Unternehmen mit starken Wurzeln in Schaffhausen bieten wir hier unsere intensivsten Services an. Durch extrem kurze Anfahrtswege garantieren wir unschlagbare Effizienz, minimale Umweltbelastung und maximale Kundennähe.',
    features: ['Einsatzgebiet: Kanton Schaffhausen & Klettgau', 'Hauptsitz-Vorteil: Schnellster Support', 'Eigene spezialisierte Reinigungsflotte', 'Starkes Netzwerk in der Region']
  },
  neuhausen: {
    name: 'Neuhausen am Rheinfall',
    germanName: 'Neuhausen am Rheinfall',
    postcode: '8212',
    image: cityImages.schaffhausen,
    desc: 'In Neuhausen am Rheinfall und im gesamten Klettgau sichern wir mit präzisem Handwerk die Langlebigkeit Ihrer Immobilien. Unser eingespieltes Team betreut Wohnungen und Gewerbeflächen direkt am Rheinfall mit Schweizer Qualität.',
    features: ['Einsatzgebiet: Neuhausen am Rheinfall & Umgebung', 'Reaktionszeit: Schnell vor Ort im Klettgau', 'Fokus auf ökologische Reinigungsmittel', '100% CO2-kompensierte Anfahrt']
  },
  thayngen: {
    name: 'Thayngen',
    germanName: 'Thayngen',
    postcode: '8240',
    image: cityImages.schaffhausen,
    desc: 'In Thayngen und der angrenzenden Region Klettgau bieten wir massgeschneiderte Reinigungs- und Facility Services. Durch unsere lokale Crew garantieren wir minimale Anfahrtswege, hohe Flexibilität und erstklassige Ergebnisse.',
    features: ['Einsatzgebiet: Thayngen & Reiat', 'Reaktionszeit: Schneller lokaler Support', 'Eigene spezialisierte Reinigungsflotte', 'Enge Zusammenarbeit mit lokalen Partnern']
  },
  'stein-am-rhein': {
    name: 'Stein am Rhein',
    germanName: 'Stein am Rhein',
    postcode: '8260',
    image: cityImages.schaffhausen,
    desc: 'In der historischen Stadt Stein am Rhein pflegen und erhalten wir Ihre wertvollen Immobilien. Unser spezialisiertes Team reinigt und pflegt Altbauten, Wohnungen und Gewerbeobjekte mit grösster Sorgfalt und Schweizer Präzision.',
    features: ['Einsatzgebiet: Stein am Rhein & Region', 'Spezialität: Schonende Reinigung historischer Bauten', '100% biologisch abbaubare Produkte', 'Feste Ansprechpartner vor Ort']
  },
  feuerthalen: {
    name: 'Feuerthalen',
    germanName: 'Feuerthalen',
    postcode: '8245',
    image: cityImages.schaffhausen,
    desc: 'In Feuerthalen und der Region Ausser-Schaffhausen sind wir Ihr zuverlässiger Partner für Reinigung und Unterhalt. Mit kurzen Anfahrtswegen sichern wir schnelle Verfügbarkeit und erstklassigen Service für Ihr Zuhause oder Büro.',
    features: ['Einsatzgebiet: Feuerthalen & Umgebung', 'Reaktionszeit: Schneller Support vor Ort', 'Geschultes, voll versichertes Personal', 'Transparente Festpreise ohne Zuschläge']
  },
  kloten: {
    name: 'Kloten',
    germanName: 'Kloten',
    postcode: '8302',
    image: cityImages.zurich,
    desc: 'In der Flughafenstadt Kloten bieten wir hocheffiziente Facility Services und professionelle Reinigung an. Ob für Büros, Wohnungen oder Gewerbeflächen – unser Team garantiert Höchstleistung, Schnelligkeit und Schweizer Gründlichkeit.',
    features: ['Einsatzgebiet: Kloten & Region Flughafen', 'Express-Service verfügbar', 'Erfahrene Crew für Gewerbe & Privat', 'Umweltfreundliche Reinigungstechnologien']
  },
  buelach: {
    name: 'Bülach',
    germanName: 'Bülach',
    postcode: '8180',
    image: cityImages.zurich,
    desc: 'In Bülach und dem gesamten Zürcher Unterland sichern wir die professionelle Pflege Ihrer Liegenschaften. Mit Engagement, modernen Geräten und umweltfreundlichen Produkten betreuen wir Wohnungen, Büros und Gewerbelokale.',
    features: ['Einsatzgebiet: Bülach & Zürcher Unterland', 'Reaktionszeit: Unter 2 Stunden vor Ort', 'Eigene geschulte Reinigungskräfte', '100% ökologische Verantwortung']
  },
  dietikon: {
    name: 'Dietikon',
    germanName: 'Dietikon',
    postcode: '8953',
    image: cityImages.zurich,
    desc: 'Im dynamischen Limmattal und der Stadt Dietikon sind wir Ihr erstklassiger Partner für anspruchsvolle Reinigungsarbeiten und Facility Management. Wir garantieren effiziente Prozesse, höchste Qualität und Flexibilität.',
    features: ['Einsatzgebiet: Dietikon & Limmattal', 'Lokale Crew mit bester Ortskenntnis', 'Schnelle Terminvereinbarung', 'Transparente Schweizer Qualitätsstandards']
  },
  uster: {
    name: 'Uster',
    germanName: 'Uster',
    postcode: '8610',
    image: cityImages.zurich,
    desc: 'In Uster und der Region Greifensee bieten wir erstklassige Betreuung für Ihre Wohn- und Gewerbeobjekte. Unser erfahrenes Team sorgt für Sauberkeit, Werterhalt und ein gepflegtes Ambiente nach höchsten Massstäben.',
    features: ['Einsatzgebiet: Uster & Greifensee-Region', '100% CO2-kompensierte Anfahrt', 'Fokus auf Nachhaltigkeit & Grüne Produkte', 'Massgeschneiderte Reinigungskonzepte']
  }
};

const SERVICE_GERMAN_DATA: Record<string, {
  title: string;
  subtitle: string;
  startingPrice: string;
  benefits: string[];
  faqs: { q: string; a: string }[];
  detailsGerman: string;
  serviceWizardId: string; // The ID used in ConsultationPage
}> = {
  'end-of-tenancy': {
    title: 'Umzugsreinigung',
    subtitle: 'Mit 100% Abgabegarantie & zertifizierter Übergabe',
    startingPrice: 'Ab 520 CHF',
    serviceWizardId: 'end-of-tenancy',
    benefits: [
      '100% Abgabegarantie inklusive (wir haften bei der Übergabe)',
      'Präsenz unserer Reinigungsleitung beim offiziellen Übergabetermin',
      'Professionelle Reinigung nach strengsten Schweizer Standards',
      'Umweltfreundliche, biologisch abbaubare Reinigungsmittel'
    ],
    detailsGerman: 'Eine professionelle Umzugsreinigung (Endreinigung) erfordert absolute Gründlichkeit und Detailarbeit. Unser erfahrenes Team reinigt Ihre Wohnung oder Ihr Gewerbeobjekt lückenlos bis in die kleinsten Winkel – inklusive Fenster, Rahmen, Rollläden, Küchengeräte und Sanitäranlagen. Mit unserer Abgabegarantie lehnen Sie sich entspannt zurück: Wir begleiten die Übergabe an den Vermieter persönlich und beheben allfällige Beanstandungen sofort und kostenlos.',
    faqs: [
      { q: 'Was bedeutet die Abgabegarantie genau?', a: 'Sollte die Verwaltung bei der Wohnungsübergabe mit der Sauberkeit nicht zufrieden sein, reinigen wir kostenlos und unverzüglich nach. Wir sind während der gesamten Übergabe vor Ort.' },
      { q: 'Sind Reinigungsmittel und Geräte im Preis inbegriffen?', a: 'Ja, sämtliche professionellen Geräte, Reinigungsmittel sowie die Anfahrtskosten sind im Festpreis bereits enthalten. Es gibt keine versteckten Kosten.' },
      { q: 'Wie lange im Voraus sollte ich buchen?', a: 'Besonders an Monatsenden sind die Termine begehrt. Wir empfehlen eine Buchung 2 bis 4 Wochen vor dem Übergabetermin. Express-Buchungen sind bei Verfügbarkeit ebenfalls möglich.' }
    ]
  },
  'deep-cleaning': {
    title: 'Spezialreinigung / Grundreinigung',
    subtitle: 'Tiefenreinigung für langanhaltende Frische und Werterhalt',
    startingPrice: 'Ab 56.50 CHF / Std.',
    serviceWizardId: 'deep-cleaning',
    benefits: [
      'Intensive Reinigung aller schwer zugänglichen Bereiche',
      'Entfernung hartnäckigster Verschmutzungen, Kalk und Verkrustungen',
      'Werterhalt von hochwertigen Böden, Fliesen und Armaturen',
      'Schonende Spezialbehandlung je nach Oberflächenmaterial'
    ],
    detailsGerman: 'Unsere Spezial- und Grundreinigung geht weit über die normale Oberflächenpflege hinaus. Wir rücken tiefsitzendem Schmutz, hartnäckigen Kalkablagerungen, Fettfilmen und Verfärbungen mit professionellem Equipment und materialschonenden Reinigungsmitteln zu Leibe. Perfekt für den jährlichen Frühjahrsputz, nach Renovierungen oder vor dem Einzug in eine neue Immobilie.',
    faqs: [
      { q: 'Was unterscheidet eine Spezialreinigung von der Unterhaltsreinigung?', a: 'Während die Unterhaltsreinigung die regelmässige Sauberkeit sichert, befasst sich die Spezialreinigung mit der intensiven Tiefenpflege aller Oberflächen, Fugen, Geräteinnenseiten und Ecken, die im Alltag seltener gereinigt werden.' },
      { q: 'Welche Maschinen kommen zum Einsatz?', a: 'Je nach Bedarf nutzen wir modernste Einscheibenmaschinen, Dampfreiniger, Nasssauger und professionelle Extraktionsgeräte für Teppiche und Polster.' }
    ]
  },
  'daily-cleaning': {
    title: 'Unterhaltsreinigung',
    subtitle: 'Regelmässige Sauberkeit für ein glänzendes Zuhause oder Büro',
    startingPrice: 'Ab 43.50 CHF / Std.',
    serviceWizardId: 'daily-cleaning',
    benefits: [
      'Individueller Reinigungsplan (wöchentlich, zweiwöchentlich oder flexibel)',
      'Feste, vertrauenswürdige und geschulte Reinigungskräfte',
      'Volle Versicherung für maximale Sicherheit',
      'Transparente Abrechnung ohne langfristige Vertragsbindung'
    ],
    detailsGerman: 'Die regelmässige Unterhaltsreinigung von Kraken PFM sorgt in Ihren Privat- oder Geschäftsräumen für ein konstant gepflegtes, hygienisches und einladendes Ambiente. Wir staubsaugen, wischen, reinigen Küche sowie Sanitärbereiche und leeren Abfalleimer. Sie bestimmen die Häufigkeit und den genauen Leistungsumfang – flexibel und exakt auf Ihre Bedürfnisse abgestimmt.',
    faqs: [
      { q: 'Habe ich immer die gleiche Reinigungskraft?', a: 'Ja. Wir setzen auf Kontinuität und Vertrauen. Sie erhalten eine feste Reinigungskraft zugeteilt. Im Urlaubs- oder Krankheitsfall organisieren wir auf Wunsch eine qualifizierte Vertretung.' },
      { q: 'Muss ich während der Reinigung anwesend sein?', a: 'Nein, das ist nicht nötig. Viele unserer Kunden übergeben uns einen Schlüssel, den wir absolut sicher und codiert verwalten.' }
    ]
  },
  'moving-furniture': {
    title: 'Umzugshilfe & Transport',
    subtitle: 'Sicherer und stressfreier Umzug mit Kraken Logistik',
    startingPrice: 'Ab 145 CHF / Std.',
    serviceWizardId: 'moving',
    benefits: [
      'Erfahrene Umzugshelfer und professionelle Transportfahrzeuge',
      'Fachgerechte Demontage und Montage von Möbeln',
      'Schonender Transport mit modernstem Verpackungsmaterial',
      'Vollständige Transport- und Haftpflichtversicherung inklusive'
    ],
    detailsGerman: 'Ein Umzug ist Vertrauenssache. Unser eingespieltes Zügelteam transportiert Ihr Hab und Gut sicher, effizient und termingerecht an Ihren neuen Wohnort. Wir unterstützen Sie flexibel: Vom reinen Transport über das Be- und Entladen bis hin zum kompletten Full-Service-Umzug inklusive fachmännischer De- und Montage Ihrer Möbel. Lehnen Sie sich entspannt zurück.',
    faqs: [
      { q: 'Ist mein Hab und Gut während des Transports versichert?', a: 'Ja, selbstverständlich. All Ihre Möbel und Kartons sind über unsere Betriebshaftpflicht- und Transportversicherung vollumfänglich gegen Schäden abgesichert.' },
      { q: 'Stellen Sie auch Umzugskartons und Verpackungsmaterial?', a: 'Ja. Wir können Ihnen hochwertiges Verpackungsmaterial, Schutzfolien und stabile Zügelkartons im Voraus liefern oder am Umzugstag mitbringen.' }
    ]
  },
  'car-detailing': {
    title: 'Fahrzeugaufbereitung',
    subtitle: 'Professionelles Car Detailing für Neuwagen-Feeling',
    startingPrice: 'Ab 220 CHF',
    serviceWizardId: 'car-detailing',
    benefits: [
      'Tiefenreinigung des Innenraums inklusive Polstershampoo',
      'Professionelle Lackpolitur und Versiegelung',
      'Geruchseliminierung durch moderne Ozonbehandlung',
      'Werterhalt Ihres Fahrzeugs (ideal vor Leasingrückgabe oder Verkauf)'
    ],
    detailsGerman: 'Verleihen Sie Ihrem Auto wieder den Glanz eines Neuwagens. Unsere Spezialisten reinigen den Innenraum porentief, entfernen Flecken aus Sitzen und Teppichen und pflegen empfindliche Oberflächen aus Leder oder Alcantara. Aussen sorgen wir mit gründlicher Handwäsche, Lackreinigung, professioneller Politur und langanhaltender Versiegelung für optimalen Schutz und brillanten Tiefenglanz.',
    faqs: [
      { q: 'Lohnt sich eine Aufbereitung vor der Leasingrückgabe?', a: 'Absolut. Eine professionelle Fahrzeugaufbereitung behebt Gebrauchsspuren kostengünstig und spart bei der Rückgabe oft Tausende von Franken an Abzügen.' },
      { q: 'Wie lange dauert die komplette Fahrzeugaufbereitung?', a: 'Je nach Paket und Verschmutzungsgrad benötigt unser Team zwischen 4 Stunden und einem ganzen Tag für ein optimales Ergebnis.' }
    ]
  },
  'gardening': {
    title: 'Gartengestaltung & Pflege',
    subtitle: 'Ihre grüne Oase in perfekter Form',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'gardening',
    benefits: [
      'Professioneller Rasen-, Hecken- und Baumschnitt',
      'Unkrautentfernung und nachhaltige Beetpflege',
      'Fachgerechte Entsorgung aller anfallenden Grünabfälle',
      'Saisonale Gartenpflege (Frühjahrs- & Herbstvorbereitung)'
    ],
    detailsGerman: 'Ein schöner Garten erfordert regelmässige Aufmerksamkeit und Fachwissen. Unser Gartenteam kümmert sich leidenschaftlich um Ihre grüne Oase. Wir übernehmen das präzise Schneiden von Hecken und Sträuchern, mähen und vertikutieren den Rasen, pflegen Beete und machen Ihren Garten fit für die jeweilige Jahreszeit. Geniessen Sie Ihren Traumgarten ohne die harte Arbeit.',
    faqs: [
      { q: 'Bieten Sie auch regelmässige Gartenpflege im Abo an?', a: 'Ja, wir bieten massgeschneiderte Pflegevereinbarungen an, bei denen wir in festen Intervallen (z.B. alle 2 Wochen) vorbeikommen, um Ihren Garten in Topform zu halten.' },
      { q: 'Entsorgen Sie das Schnittgut?', a: 'Ja, die fachgerechte Entsorgung aller Grünabfälle und Äste ist in unseren Serviceleistungen stets inbegriffen.' }
    ]
  },
  'exterior-cleaning': {
    title: 'Fassaden- & Aussenreinigung',
    subtitle: 'Strahlende Sauberkeit für Terrassen, Wege und Fassaden',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'exterior-cleaning',
    benefits: [
      'Schonende Hochdruckreinigung von Stein-, Beton- und Holzterrassen',
      'Fassadenreinigung zur Entfernung von Algen, Moos und Schmutz',
      'Werterhalt der Gebäudehülle durch fachgerechte Pflege',
      'Einsatz von umweltfreundlichen, biologischen Reinigungsmitteln'
    ],
    detailsGerman: 'Aussenflächen sind ständig der Witterung ausgesetzt. Moos, Algen und Umweltverschmutzungen trüben nicht nur die Optik, sondern können auch die Bausubstanz angreifen. Wir reinigen Terrassen, Gehwege, Einfahrten und Fassaden gründlich und materialschonend. Mit modernster Technik und biologischen Wirkstoffen bringen wir den ursprünglichen Glanz Ihrer Immobilie zurück.',
    faqs: [
      { q: 'Werden empfindliche Oberflächen wie Holz beschädigt?', a: 'Nein. Wir passen den Wasserdruck und die Reinigungstechnik exakt an das Material an. Holzterrassen reinigen wir besonders sanft mit Spezialbürsten statt reinem Hochdruck.' },
      { q: 'Wie lange hält der Schutz vor Moosbefall an?', a: 'Auf Wunsch tragen wir nach der Reinigung eine umweltfreundliche Imprägnierung auf, die das Eindringen von Feuchtigkeit verhindert und erneuten Algen- oder Moosbefall für lange Zeit hemmt.' }
    ]
  },
  'pest-control': {
    title: 'Schädlingsbekämpfung',
    subtitle: 'Diskrete, schnelle und effektive Schädlingsbeseitigung',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'pest-control',
    benefits: [
      'Schnelle Hilfe bei akutem Schädlingsbefall (Wespen, Ameisen, Nager etc.)',
      'Diskretes Auftreten im unbeschrifteten Fahrzeug auf Wunsch',
      'Einsatz von sicheren, zugelassenen und gezielten Wirkstoffen',
      'Langfristige Präventionsberatung zur Vermeidung von Neubefall'
    ],
    detailsGerman: 'Schädlinge im Haus oder Betrieb sind ein sensibles Thema. Unsere zertifizierten Schädlingsbekämpfer handeln schnell, diskret und äusserst effektiv. Wir analysieren die Ursache des Befalls, leiten gezielte Bekämpfungsmassnahmen ein und sorgen mit modernen Barrieren und Präventionskonzepten dafür, dass die ungebetenen Gäste dauerhaft fernbleiben.',
    faqs: [
      { q: 'Sind die eingesetzten Mittel gefährlich für Haustiere?', a: 'Die Sicherheit von Mensch und Haustier steht an erster Stelle. Wir platzieren Köderboxen absolut zugriffssicher und klären Sie vor dem Einsatz genau über notwendige Vorsichtsmassnahmen auf.' },
      { q: 'Wie schnell können Sie vor Ort sein?', a: 'Bei akutem Befall (z.B. Wespennester oder Nagetiere) bemühen wir uns um einen Einsatz innerhalb von 24 Stunden.' }
    ]
  },
  'waste-management': {
    title: 'Entsorgung & Räumung',
    subtitle: 'Besenreine Räumungen und umweltgerechte Entsorgung',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'waste-management',
    benefits: [
      'Komplette Räumung von Wohnungen, Kellern, Estrichen oder Büros',
      'Fachgerechte Trennung und umweltschonendes Recycling',
      'Besenreine Übergabe des geräumten Objekts',
      'Diskrete und respektvolle Abwicklung'
    ],
    detailsGerman: 'Ob Haushaltsauflösung, Entrümpelung nach Mieterwechsel oder Kellerreinigung: Wir übernehmen die schwere Arbeit für Sie. Unser Team räumt alle gewünschten Bereiche zügig und diskret. Verwertbare Gegenstände führen wir dem Kreislauf zu, alles andere entsorgen wir fachgerecht und gesetzeskonform bei zertifizierten regionalen Recyclinghöfen.',
    faqs: [
      { q: 'Was bedeutet "besenrein"?', a: 'Nach der Räumung fegen wir alle Räumlichkeiten gründlich durch, entfernen Spinnweben und hinterlassen das Object so, dass es direkt für Folgearbeiten oder Übergaben bereit ist.' },
      { q: 'Können verwertbare Möbel angerechnet werden?', a: 'Bei sehr gut erhaltenen Gegenständen prüfen wir im Rahmen einer Vorab-Besichtigung gerne eine Wertanrechnung, die die Räumungskosten reduziert.' }
    ]
  },
  'gutter-cleaning': {
    title: 'Dachrinnenreinigung',
    subtitle: 'Schutz vor Wasserschäden durch freie Dachrinnen',
    startingPrice: 'Ab 120 CHF',
    serviceWizardId: 'gutter-cleaning',
    benefits: [
      'Gründliche Entfernung von Laub, Moos und Schmutz',
      'Kontrolle der Fallrohre auf Verstopfung',
      'Vermeidung von teuren Feuchtigkeitsschäden an der Fassade',
      'Professionelle Ausrüstung für sicheres Arbeiten in der Höhe'
    ],
    detailsGerman: 'Verstopfte Dachrinnen führen bei starkem Regen rasch zu überlaufendem Wasser, welches Fassadenschäden, Schimmel oder feuchte Keller verursachen kann. Unser Team befreit Ihre Dachrinnen und Fallrohre sicher und professionell von Laub, Geäst und Schmutz. Eine kleine Massnahme mit grosser Schutzwirkung für Ihre Immobilie.',
    faqs: [
      { q: 'Wie oft sollte eine Dachrinne gereinigt werden?', a: 'Wir empfehlen eine Reinigung mindestens einmal jährlich, idealerweise im Spätherbst nach dem Laubabwurf, um Verstopfungen im Winter vorzubeugen.' },
      { q: 'Müssen Sie dafür auf das Dach steigen?', a: 'Je nach Gebäudehöhe und Zugänglichkeit arbeiten wir mit sicheren Leitern, modernen Teleskop-Absaugsystemen vom Boden aus oder professioneller Absturzsicherung direkt am Dach.' }
    ]
  },
  'office-cleaning': {
    title: 'Büroreinigung',
    subtitle: 'Professionelle Unterhaltsreinigung für Büros & Gewerbe',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'office-cleaning',
    benefits: [
      'Zuverlässiger Service nach ISO 9001 Standards',
      'Speziell geschultes, vertrauenswürdiges Reinigungspersonal',
      'Flexibel anpassbare Reinigungszeiten',
      'Umweltschonende B-Corp zertifizierte Produkte'
    ],
    detailsGerman: 'Eine saubere Arbeitsumgebung steigert das Wohlbefinden und die Produktivität Ihres Teams. Kraken PFM bietet erstklassige Büroreinigung für Unternehmen jeder Grösse. Wir reinigen Arbeitsplätze, Besprechungszimmer, Kaffeeküchen und Sanitäranlagen mit höchster Präzision und Diskretion. Gerne erstellen wir ein massgeschneidertes Reinigungskonzept für Ihre Büroräumlichkeiten.',
    faqs: [
      { q: 'Wie flexibel sind die Reinigungszeiten?', a: 'Wir passen uns vollkommen Ihrem Betriebsalltag an. Die Reinigung kann ausserhalb der Bürozeiten, am frühen Morgen, abends oder am Wochenende stattfinden.' },
      { q: 'Sind Ihre Mitarbeitenden haftpflichtversichert?', a: 'Ja. All unsere Mitarbeitenden sind umfassend haftpflichtversichert und durchlaufen strenge Zuverlässigkeitsprüfungen.' }
    ]
  },
  'common-area-cleaning': {
    title: 'Liegenschaftsreinigung',
    subtitle: 'Sauberkeit & Werterhalt für Treppenhäuser & Gemeinschaftsflächen',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'common-area-cleaning',
    benefits: [
      'Professionelle Reinigung von Treppenhäusern & Eingangsbereichen',
      'Regelmässige Kontrollen für nachhaltigen Werterhalt',
      'Zuverlässiger Winterdienst & Umgebungsarbeiten',
      'Transparente Leistungsberichte für Eigentümer'
    ],
    detailsGerman: 'Der erste Eindruck zählt. Wir sorgen für makellose Sauberkeit in Treppenhäusern, Fluren, Waschküchen und auf allen Gemeinschaftsflächen Ihrer Liegenschaft. Durch regelmässige Reinigung und fachgerechte Pflege tragen wir massgeblich zum Werterhalt Ihrer Immobilie bei. Gerne übernehmen wir auch die Umgebungsarbeit und den Winterdienst.',
    faqs: [
      { q: 'In welchem Intervall wird gereinigt?', a: 'Je nach Liegenschaftsgrösse und Frequenz empfehlen wir eine wöchentliche oder zweiwöchentliche Reinigung. Wir erstellen ein individuell abgestimmtes Pflichtenheft.' },
      { q: 'Bieten Sie auch Notfalldienste an?', a: 'Ja, bei akuten Problemen wie Verschmutzungen oder Wasserschäden ist unser Express-Service für Sie da.' }
    ]
  },
  'industrial-maintenance': {
    title: 'Industriereinigung',
    subtitle: 'Spezialisierte Instandhaltung & Reinigung für Industrieanlagen',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'industrial-maintenance',
    benefits: [
      'Reinigung von Produktionshallen & Industrieanlagen',
      'HSE-konforme Durchführung mit zertifizierten Spezialisten',
      'Modernste Maschinen & Reinigungstechniken',
      'Minimale Ausfallzeiten durch optimierte Abläufe'
    ],
    detailsGerman: 'Spezielle Umgebungen erfordern spezielles Know-how. Unsere Industriereinigung umfasst die gründliche Reinigung und Instandhaltung von Produktionsstätten, Lagerhallen, Maschinen und technischen Anlagen. Dabei halten wir sich strikt an alle Sicherheits- und Umweltschutzauflagen (HSE). Mit modernstem Equipment sorgen wir für maximale Sauberkeit bei minimaler Beeinträchtigung Ihres Betriebs.',
    faqs: [
      { q: 'Können Reinigungen während des laufenden Betriebs stattfinden?', a: 'Ja, wir planen unsere Einsätze so, dass Ihre Produktionsabläufe so wenig wie möglich gestört werden, auch während Schichtwechseln oder nachts.' },
      { q: 'Verfügen Ihre Mitarbeitenden über die nötigen Lizenzen?', a: 'Selbstverständlich. Unsere Spezialisten sind für Hubarbeitsbühnen, Höhenarbeiten und den Umgang mit Industriereinigungsgeräten zertifiziert.' }
    ]
  },
  'retail-management': {
    title: 'Verkaufsflächenreinigung',
    subtitle: 'Präsentable Sauberkeit für Shops & Einkaufszentren',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'retail-management',
    benefits: [
      'Hochglanzreinigung von Böden & Schaufenstern',
      'Flexible Reinigung ausserhalb der Öffnungszeiten',
      'Schnelle Reaktion bei Verschmutzungen im Tagesgeschäft',
      'Erhöhung der Kundenzufriedenheit durch Wohlfühlambiente'
    ],
    detailsGerman: 'Ein sauberer Verkaufsraum lädt zum Verweilen ein. Wir pflegen Ihre Verkaufsflächen, Schaufenster, Kassenbereiche und Sanitäranlagen mit besonderem Augenmerk auf Details und Hygiene. Unsere flexiblen Teams arbeiten unauffällig im Hintergrund, damit sich Ihre Kunden rundum wohlfühlen. Wir reinigen pünktlich vor Ladenöffnung oder nach Geschäftsschluss.',
    faqs: [
      { q: 'Reinigen Sie auch Schaufenster und Glasfassaden?', a: 'Ja, die streifenfreie Reinigung von Schaufenstern, Spiegeln und grossen Glasflächen gehört zu unseren Kernkompetenzen.' },
      { q: 'Bieten Sie Support während des Tagesgeschäfts?', a: 'Auf Wunsch stellen wir Tageskräfte bereit, die diskret für Sauberkeit sorgen und bei Bedarf sofort eingreifen.' }
    ]
  },
  'upholstery-cleaning': {
    title: 'Polsterreinigung',
    subtitle: 'Professionelle Tiefenreinigung für Sofas, Sessel & Autositze',
    startingPrice: 'Ab 120 CHF',
    serviceWizardId: 'deep-cleaning',
    benefits: [
      'Tiefenwirksame Schmutz- und Fleckenentfernung (Kaffee, Wein, Tierhaare)',
      'Geruchseliminierung und hygienische Desinfektion',
      'Faserschonende Reinigungsmethode mit modernsten Extraktionsgeräten',
      'Schutzimprägnierung für langanhaltende Sauberkeit'
    ],
    detailsGerman: 'Polstermöbel wie Sofas, Sessel und Bürostühle sind täglich hohen Belastungen ausgesetzt. Mit der Zeit sammeln sich Staub, Hautschuppen, Allergene und Flecken tief in den Fasern an. Unsere professionelle Polsterreinigung arbeitet mit dem bewährten Sprühextraktionsverfahren: Ökologische Reinigungslösungen werden tief in das Polster eingebracht und samt dem gelösten Schmutz direkt wieder abgesaugt. Ihre Möbel strahlen in neuer Frische und sind hygienisch rein.',
    faqs: [
      { q: 'Wie lange dauert die Trocknungszeit nach der Polsterreinigung?', a: 'Je nach Raumtemperatur und Belüftung beträgt die Trocknungszeit in der Regel zwischen 6 und 12 Stunden. Wir empfehlen, die Möbel während dieser Zeit nicht zu nutzen.' },
      { q: 'Können alle Flecken vollständig entfernt werden?', a: 'Die meisten Flecken wie Kaffee, Rotwein, Schokolade oder Urin lassen sich vollständig entfernen. Bei sehr alten oder bereits vorbehandelten Flecken, die die Faser verfärbt haben, kann eine restlose Entfernung jedoch nicht garantiert werden.' }
    ]
  },
  'window-cleaning': {
    title: 'Fensterreinigung',
    subtitle: 'Streifenfreier Glanz für Fenster, Rahmen & Glasfassaden',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'exterior-cleaning',
    benefits: [
      'Streifenfreie Reinigung aller Glasflächen im Innen- und Aussenbereich',
      'Gründliche Reinigung von Fensterrahmen, Falzen und Simsen',
      'Schonende Entfernung von hartnäckigem Schmutz (Pollen, Russ, Vogelkot)',
      'Arbeiten in der Höhe mit professionellen Teleskopstangen und Hebebühnen'
    ],
    detailsGerman: 'Saubere Fenster sorgen nicht nur für maximalen Lichteinfall, sondern sind auch die Visitenkarte jeder Immobilie. Ob für Privatwohnungen, Einfamilienhäuser oder grossflächige Bürogebäude: Unser erfahrenes Team reinigt Ihre Fenster und Glasflächen streifenfrei und professionell. Dabei säubern wir stets auch Rahmen, Fensterbänke und Rollläden gründlich mit, um ein perfektes Gesamtergebnis zu erzielen.',
    faqs: [
      { q: 'Reinigen Sie auch schwer zugängliche Fenster?', a: 'Ja, absolut. Wir sind für Arbeiten in der Höhe bestens ausgerüstet und nutzen moderne Teleskopstangensysteme mit entmineralisiertem Wasser (Osmose-Verfahren) oder bei Bedarf Hebebühnen.' },
      { q: 'Muss ich Reinigungsmittel oder Leitern bereitstellen?', a: 'Nein, unser Reinigungsteam bringt sämtliche professionellen Reinigungsmittel, Spezialgeräte, Abzieher und bei Bedarf Leitern selbst mit.' }
    ]
  },
  'mudanza-cajas': {
    title: 'Zügelboxen & Verpackungsmaterial',
    subtitle: 'Mieten oder kaufen – Hochwertiges Verpackungsmaterial für Ihren Umzug',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'moving',
    benefits: [
      'Lieferung von robusten, stapelbaren Zügelboxen direkt nach Hause',
      'Hochwertige Luftpolsterfolien, Seidenpapier und Matratzenhüllen',
      'Umweltfreundliche Mehrweg-Zügelboxen zur Miete',
      'Bequeme Rückholung der gemieteten Boxen nach dem Umzug'
    ],
    detailsGerman: 'Die richtige Verpackung ist der halbe Umzug. Um Ihre wertvollen Möbel, Kleider und zerbrechlichen Gegenstände wie Geschirr optimal zu schützen, bieten wir eine grosse Auswahl an professionellem Verpackungsmaterial. Mieten Sie unsere extrem stabilen, stapelbaren Mehrweg-Zügelboxen aus Kunststoff – das schont das Budget und die Umwelt. Auf Wunsch liefern wir alles direkt zu Ihnen nach Hause und holen es nach dem Umzug wieder ab.',
    faqs: [
      { q: 'Wie lange kann ich die Zügelboxen mieten?', a: 'Unsere Standard-Mietdauer beträgt 4 Wochen. Sie können die Mietzeit jedoch flexibel an Ihren persönlichen Zeitplan anpassen und wochenweise verlängern.' },
      { q: 'Welche Vorteile haben Kunststoff-Zügelboxen gegenüber Kartons?', a: 'Zügelboxen aus Kunststoff sind absolut reissfest, wasserabweisend, lassen sich perfekt stapeln ohne einzuknicken und bieten optimalen Schutz vor Stössen. Zudem entfällt das lästige Zusammenkleben und spätere Entsorgen von Kartons.' }
    ]
  },
  'pulido-suelos': {
    title: 'Bodenpolitur & Pflege',
    subtitle: 'Professionelle Aufbereitung und Versiegelung aller Bodenbeläge',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'deep-cleaning',
    benefits: [
      'Werterhalt und Glanz für Parkett, Steinböden, Linoleum und PVC',
      'Schonende Tiefenreinigung und Entfernung alter Pflegeschichten',
      'Professionelle Versiegelung, Einpflege oder Ölung',
      'Schutz vor schnellem Verschleiss, Kratzern und Feuchtigkeit'
    ],
    detailsGerman: 'Bodenbeläge sind tagtäglich hoher Beanspruchung ausgesetzt und verlieren mit der Zeit ihren Glanz und ihre Schutzschicht. Unsere Bodenspezialisten bereiten Ihre Böden professionell auf. Wir reinigen den Boden porentief, entfernen alte, abgenutzte Wachs- oder Pflegeschichten und tragen eine neue, langanhaltende Schutzversiegelung, Politur oder Ölung auf. Das sorgt für fantastischen Glanz, erleichtert die tägliche Reinigung und verlängert die Lebensdauer Ihres Bodens erheblich.',
    faqs: [
      { q: 'Wie oft sollte ein Holzboden geölt oder versiegelt werden?', a: 'Wir empfehlen, einen geölten Parkettboden alle 1 bis 2 Jahre nachzuölen. Versiegelte Holzböden sollten je nach Beanspruchung alle 5 bis 10 Jahre professionell angeschliffen und neu versiegelt werden.' },
      { q: 'Wann ist der Boden nach der Behandlung wieder begehbar?', a: 'Je nach verwendetem Pflegeprodukt oder Versiegelung ist der Boden meist nach 12 bis 24 Stunden wieder vorsichtig begehbar. Vollständig belastbar ist er nach etwa 48 Stunden.' }
    ]
  },
  'bar-restaurant-cleaning': {
    title: 'Gastroreinigung',
    subtitle: 'Hygienische Reinigung für Gastronomie & Großküchen nach HACCP',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'industrial-maintenance',
    benefits: [
      'Streng HACCP-konforme Tiefenreinigung von Küchen, Lagern und Gasträumen',
      'Spezialisierte Fett- und Verkrustungsentfernung auf Edelstahl und Abluftsystemen',
      'Hygienische Desinfektion aller Oberflächen zur Keimvermeidung',
      'Flexible Reinigungszeiten ausserhalb Ihrer Servicezeiten'
    ],
    detailsGerman: 'In der Gastronomie ist makellose Hygiene das oberste Gebot – für den Erfolg Ihres Betriebs und zur Einhaltung aller gesetzlichen Vorschriften. Unser speziell geschultes Team übernimmt die professionelle Gastro- und Grossküchenreinigung nach strengsten HACCP-Richtlinien. Wir reinigen Produktionsflächen, Dunstabzugshauben, Lüftungskanäle, Kühlzellen sowie den gesamten Gastraum. Zuverlässig, gründlich und diskret zu Zeiten, die Ihren Betrieb nicht stören.',
    faqs: [
      { q: 'Erhalten wir einen Nachweis für die Lebensmittelkontrolle?', a: 'Ja, nach jeder durchgeführten Gastro-Tiefenreinigung erhalten Sie von uns ein detailliertes Reinigungsprotokoll und ein Zertifikat, welches Sie bei behördlichen Kontrollen als Nachweis vorlegen können.' },
      { q: 'Reinigen Sie auch Abzugshauben und Lüftungen?', a: 'Ja, die professionelle Entfettung von Dunstabzugshauben, Filtern und sichtbaren Abluftkanälen ist ein wichtiger Bestandteil unserer Gastroreinigung, um auch der Brandgefahr vorzubeugen.' }
    ]
  },
  'property-managers': {
    title: 'Immobilienverwalter Service',
    subtitle: 'Professioneller Unterhalt & Facility Management für Liegenschaften',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'daily-cleaning',
    benefits: [
      'Zuverlässige Reinigung von Treppenhäusern und Gemeinschaftsflächen',
      'Besenreine Wohnungsabgaben mit 100% Abgabegarantie',
      'Spezialkonditionen für Hauswartung und Kleinreparaturen',
      'Präzise Protokollierung und direkter Draht zur Verwaltung'
    ],
    detailsGerman: 'Für professionelle Immobilienbewirtschafter und Verwaltungen bieten wir ein rundum sorgloses Partnermodell. Von der regelmässigen Treppenhausreinigung über die Umgebungspflege bis hin zu speditiven Zwischenreinigungen bei Mieterwechseln sorgen wir für den perfekten ersten Eindruck Ihrer Liegenschaften. Unser Team ist GAV-konform und ISO-zertifiziert.',
    faqs: [
      { q: 'Welche Services decken Sie für Immobilienverwaltungen ab?', a: 'Wir übernehmen die regelmässige Unterhaltsreinigung der Allgemeinflächen, die Bereitstellung von Müllcontainern, den Winterdienst, die Pflege der Grünflächen sowie die Endreinigung von Wohnungen mit Abgabegarantie.' },
      { q: 'Gibt es Rahmenverträge für Portfolios?', a: 'Ja, wir bieten attraktive Konditionen und feste Ansprechpartner für Verwaltungen mit mehreren Objekten im Raum Zürich, Winterthur und Schaffhausen.' }
    ]
  },
  'airbnb-rentals': {
    title: 'Airbnb & Ferienwohnungen',
    subtitle: 'Schnelle Turnovers & 5-Sterne-Hygienestandards für Ihre Gäste',
    startingPrice: 'Ab 52 CHF / Std.',
    serviceWizardId: 'deep-cleaning',
    benefits: [
      'Superschnelle Reinigung zwischen Checkout und neuem Checkin',
      'Professioneller Wäsche- und Bettzeugservice (Waschen & Beziehen)',
      'Auffüllen von Verbrauchsmaterialien (Seife, Toilettenpapier, Kaffee)',
      'Fotodokumentation und unmittelbare Schadensmeldung per App'
    ],
    detailsGerman: 'Verleihen Sie Ihrer Ferienunterkunft oder Ihrem Airbnb-Objekt Hotel-Qualität. Unser eingespieltes Reinigungsteam ist auf die anspruchsvollen Zeitfenster von Kurzzeitvermietungen spezialisiert. Wir garantieren makellose Sauberkeit, frische Wäsche und die perfekte Präsentation der Räume, damit Sie sich entspannt zurücklehnen und über Fünf-Sterne-Bewertungen freuen können.',
    faqs: [
      { q: 'Wie flexibel sind die Reinigungszeiten bei Last-Minute-Buchungen?', a: 'Wir sind bestens auf die dynamischen Buchungen im Tourismus eingestellt und bieten flexible Einsätze in den typischen Fenstern zwischen 11:00 und 15:00 Uhr.' },
      { q: 'Was passiert, wenn Gäste Schäden hinterlassen haben?', a: 'Unser Team führt bei jedem Turnover eine Sichtprüfung durch. Allfällige Schäden oder liegengelassene Gegenstände werden sofort fotografiert und Ihnen gemeldet.' }
    ]
  },
  'offices-corporate': {
    title: 'Oficinas & Corporativos',
    subtitle: 'Professionelle Büro- & Unterhaltsreinigung für Ihren Betrieb',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'daily-cleaning',
    benefits: [
      'Reinigung ausserhalb der Betriebszeiten (morgens, abends, nachts)',
      'Festangestellte, haftpflichtversicherte und geschulte Reinigungskräfte',
      'Hygienische Desinfektion von Tastaturen, Telefonen und Kaffeeküchen',
      'Verwendung ökologischer, geruchsneutraler Reinigungsmittel'
    ],
    detailsGerman: 'Saubere Arbeitsplätze steigern Produktivität und Betriebsklima. Kraken PFM reinigt Ihre Büro- und Aufenthaltsräume zuverlässig, materialschonend und diskret zu Zeiten, die Ihren Ablauf optimal ergänzen.',
    faqs: [
      { q: 'Können wir die Reinigung auch wöchentlich buchen?', a: 'Ja, das Intervall bestimmen Sie: ob täglich, mehrmals pro Woche oder im wöchentlichen Turnus – wir passen uns Ihren Bedürfnissen an.' },
      { q: 'Wie verwalten Sie unsere Büroschlüssel?', a: 'Die Schlüssel werden codiert und absolut sicher in unserem Depot aufbewahrt. Nur autorisierte Mitarbeiter erhalten für die Dauer des Einsatzes Zugriff.' }
    ]
  },
  'retail-showrooms': {
    title: 'Comercios & Showrooms',
    subtitle: 'Makelloser Glanz für Ihre Verkaufsflächen & Schaufenster',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'window-cleaning',
    benefits: [
      'Präsentable Sauberkeit für ein erstklassiges Kundenerlebnis',
      'Streifenfreie Glasreinigung von Schaufenstern und Vitrinen',
      'Professionelle Bodenpflege für hochfrequentierte Ladenflächen',
      'Flexible Einsatzplanung vor Ladenöffnung oder nach Geschäftsschluss'
    ],
    detailsGerman: 'Im Detailhandel entscheidet der erste Eindruck über den Verkaufserfolg. Wir sorgen dafür, dass Ihr Showroom, Ihr Ladengeschäft oder Ihre Boutique jederzeit einladend und hygienisch rein strahlen. Mit modernem Equipment pflegen wir empfindliche Oberflächen, Schaufenster, Kassenbereiche und sorgen für ein rundum exklusives Wohlfühlambiente.',
    faqs: [
      { q: 'Reinigen Sie auch am Wochenende?', a: 'Ja, wir bieten massgeschneiderte Einsätze auch an Samstagen oder Sonntagen an, damit Ihr Geschäft pünktlich zum Wochenstart glänzt.' },
      { q: 'Werden auch Spezialböden wie Naturstein oder Parkett gepflegt?', a: 'Absolut. Wir haben das passende Know-how und materialschonende Reinigungsprodukte für jeden Bodenbelag.' }
    ]
  },
  'gastronomy-restaurants': {
    title: 'Gastronometrie & Restaurants',
    subtitle: 'Konforme Gastroreinigung & Küchen-Tiefendesinfektion nach HACCP',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'bar-restaurant-cleaning',
    benefits: [
      'Streng HACCP-konforme Tiefenreinigung von Küchen und Kühlzellen',
      'Gründliche Fettentfernung an Dunstabzugshauben und Edelstahlmöbeln',
      'Hygienische Reinigung von Gastraum, Thekenbereich und Toiletten',
      'Dokumentierte Reinigungsprotokolle für die Lebensmittelkontrolle'
    ],
    detailsGerman: 'Wo Lebensmittel verarbeitet werden, gelten höchste Hygienevorschriften. Unser spezialisiertes Gastro-Reinigungsteam entlastet Ihre Küchenmannschaft und reinigt Ihren Betrieb bis in die kleinsten Ritzen. Wir entfernen hartnäckige Fette, desinfizieren alle Arbeitsflächen und sorgen dafür, dass Sie jede behördliche Kontrolle mit Bravour bestehen.',
    faqs: [
      { q: 'Wann findet die Gastroreinigung statt?', a: 'Wir reinigen nachts oder an Ihren Ruhetagen, um Ihren Restaurantbetrieb nicht zu stören. So ist am nächsten Tag alles sofort einsatzbereit.' },
      { q: 'Reinigen Sie auch Abzugskanäle und Filter?', a: 'Ja, die gründliche Entfettung von Abzugshauben und Filtern ist essenzieller Bestandteil unseres Services zur Senkung der Brandgefahr.' }
    ]
  },
  'industry-logistics': {
    title: 'Industria & Logística',
    subtitle: 'Professionelle Reinigung von Lagerhallen, Maschinen & Industrieböden',
    startingPrice: 'Auf Anfrage',
    serviceWizardId: 'pulido-suelos',
    benefits: [
      'Reinigung grosser Hallenflächen mit modernen Kehrsaugmaschinen',
      'HSE-konforme Durchführung unter Beachtung aller Sicherheitsstandards',
      'Professionelle Bodenpolitur, Kristallisation und Spezialversiegelung',
      'Minimale Betriebsunterbrechung durch optimierte Schichtplanung'
    ],
    detailsGerman: 'Industrieanlagen und Logistikzentren stellen besondere Anforderungen an Effizienz und Sicherheit. Wir reinigen Lagerflächen, Verladerampen, Produktionshallen und führen anspruchsvolle Industriebodenreinigungen durch. Durch fachgerechtes Schleifen, Polieren und Versiegeln (z.B. von Beton- oder Estrichböden) erhöhen wir die Trittsicherheit und den Werterhalt Ihrer Hallen.',
    faqs: [
      { q: 'Sind Ihre Mitarbeiter für Höhenarbeiten geschult?', a: 'Ja, unsere Spezialisten besitzen alle notwendigen Zertifikate für den Umgang mit Hubarbeitsbühnen und für Absicherungen bei Arbeiten in grosser Höhe.' },
      { q: 'Können Sie auch Ölrückstände und schwere Verschmutzungen entfernen?', a: 'Ja, wir setzen leistungsstarke Einscheibenmaschinen, Nasssauger und biologisch abbaubare Industreireiniger ein, um selbst hartnäckigste Schmier- und Treibstoffflecken rückstandslos zu beseitigen.' }
    ]
  }
};

const CITY_NAMES: Record<string, Record<string, string>> = {
  zurich: {
    de: 'Zürich',
    en: 'Zurich',
    fr: 'Zurich',
    it: 'Zurigo',
    es: 'Zúrich',
    pt: 'Zurique',
  },
  winterthur: {
    de: 'Winterthur',
    en: 'Winterthur',
    fr: 'Winterthur',
    it: 'Winterthur',
    es: 'Winterthur',
    pt: 'Winterthur',
  },
  schaffhausen: {
    de: 'Schaffhausen',
    en: 'Schaffhausen',
    fr: 'Schaffhouse',
    it: 'Sciaffusa',
    es: 'Schaffhausen',
    pt: 'Schaffhausen',
  },
  neuhausen: {
    de: 'Neuhausen am Rheinfall',
    en: 'Neuhausen am Rheinfall',
    fr: 'Neuhausen am Rheinfall',
    it: 'Neuhausen am Rheinfall',
    es: 'Neuhausen am Rheinfall',
    pt: 'Neuhausen am Rheinfall',
  },
  thayngen: {
    de: 'Thayngen',
    en: 'Thayngen',
    fr: 'Thayngen',
    it: 'Thayngen',
    es: 'Thayngen',
    pt: 'Thayngen',
  },
  'stein-am-rhein': {
    de: 'Stein am Rhein',
    en: 'Stein am Rhein',
    fr: 'Stein am Rhein',
    it: 'Stein am Rhein',
    es: 'Stein am Rhein',
    pt: 'Stein am Rhein',
  },
  feuerthalen: {
    de: 'Feuerthalen',
    en: 'Feuerthalen',
    fr: 'Feuerthalen',
    it: 'Feuerthalen',
    es: 'Feuerthalen',
    pt: 'Feuerthalen',
  },
  kloten: {
    de: 'Kloten',
    en: 'Kloten',
    fr: 'Kloten',
    it: 'Kloten',
    es: 'Kloten',
    pt: 'Kloten',
  },
  buelach: {
    de: 'Bülach',
    en: 'Bülach',
    fr: 'Bülach',
    it: 'Bülach',
    es: 'Bülach',
    pt: 'Bülach',
  },
  dietikon: {
    de: 'Dietikon',
    en: 'Dietikon',
    fr: 'Dietikon',
    it: 'Dietikon',
    es: 'Dietikon',
    pt: 'Dietikon',
  },
  uster: {
    de: 'Uster',
    en: 'Uster',
    fr: 'Uster',
    it: 'Uster',
    es: 'Uster',
    pt: 'Uster',
  }
};

const WIZARD_TO_I18N_SERVICE: Record<string, string> = {
  'end-of-tenancy': 'endOfTenancy',
  'deep-cleaning': 'deepCleaning',
  'daily-cleaning': 'dailyCleaning',
  'moving-furniture': 'movingFurniture',
  'gardening': 'gardening',
  'exterior-cleaning': 'exterior',
  'pest-control': 'pest',
  'waste-management': 'waste',
  'car-detailing': 'car',
  'gutter-cleaning': 'gutter',
  'upholstery-cleaning': 'upholstery',
  'window-cleaning': 'window',
  'mudanza-cajas': 'mudanzaCajas',
  'pulido-suelos': 'pulidoSuelos',
  'bar-restaurant-cleaning': 'restaurant',
  'property-managers': 'propertyManagers',
  'airbnb-rentals': 'airbnbRentals',
  'offices-corporate': 'officesCorporate',
  'retail-showrooms': 'retailShowrooms',
  'gastronomy-restaurants': 'gastronomyRestaurants',
  'industry-logistics': 'industryLogistics'
};

const COMMERCIAL_SERVICE_TRANSLATIONS: Record<string, Record<string, { title: string; subtitle: string; details: string }>> = {
  'property-managers': {
    de: {
      title: 'Immobilienverwalter Service',
      subtitle: 'Effizientes Facility Management für Liegenschaften & Verwaltungen',
      details: 'Professionelles und zuverlässiges Partnermodell für Immobilienverwalter und Eigentümer. Wir sorgen für makellose Treppenhäuser, reibungslose Mieterwechsel (Endreinigung mit Abgabegarantie) und proaktiven Unterhalt Ihrer Liegenschaften.'
    },
    es: {
      title: 'Administradores de Propiedades',
      subtitle: 'Facility Management eficiente para propiedades y administraciones',
      details: 'Modelo de colaboración profesional y confiable para administradores de propiedades y propietarios. Nos encargamos de mantener las áreas comunes impecables, de transiciones de inquilinos fluidas (limpieza de mudanza con garantía de entrega) y del mantenimiento proactivo de sus propiedades.'
    },
    en: {
      title: 'Property Managers FM',
      subtitle: 'Efficient Facility Management for properties & portfolios',
      details: 'Professional and reliable partnership model for real estate managers and property owners. We ensure immaculate common areas, smooth tenant transitions (move-out cleaning with handover guarantee), and proactive property maintenance.'
    },
    fr: {
      title: 'Régies & Gérants Immobiliers',
      subtitle: 'Gestion technique et nettoyage de qualité pour vos immeubles',
      details: 'Partenariat professionnel pour gérants d’immeubles et copropriétés. Nous assurons le nettoyage impeccable des parties communes, la gestion des états des lieux de sortie avec garantie et l’entretien régulier.'
    },
    it: {
      title: 'Gestori Immobiliari',
      subtitle: 'Gestione e pulizia professionale per condomini e stabili',
      details: 'Modello di partnership affidabile per amministratori condominiali e proprietari immobiliari. Garantiamo la pulizia impeccabile delle aree comuni, delle pulizie di fine locazione con garanzia e manutenzione proattiva.'
    },
    pt: {
      title: 'Administradores de Imóveis',
      subtitle: 'Gestão e limpeza profissional para condomínios e carteiras',
      details: 'Parceria profissional de alta qualidade para gestores de património e proprietários. Asseguramos a limpeza impecável das áreas comuns, limpeza pós-inquilinos com garantia de entrega e manutenção preventiva.'
    }
  },
  'airbnb-rentals': {
    de: {
      title: 'Airbnb & Ferienwohnungen',
      subtitle: 'Schnelle Turnovers & 5-Sterne Sauberkeit für Ihre Gäste',
      details: 'Bieten Sie Ihren Gästen erstklassige Sauberkeit. Unser spezialisierter Reinigungsservice für Kurzzeitvermietungen und Ferienwohnungen garantiert schnelle Übergaben (Turnover Cleaning), professionelle Wäschepflege und sofortige Qualitätskontrolle.'
    },
    es: {
      title: 'Airbnb y Alquileres Vacacionales',
      subtitle: 'Rotaciones rápidas y limpieza de 5 estrellas para sus huéspedes',
      details: 'Ofrezca a sus huéspedes una limpieza de primera clase. Nuestro servicio especializado para alquileres a corto plazo y apartamentos turísticos garantiza rotaciones rápidas (Turnover Cleaning), cuidado profesional de lavandería y controles de calidad inmediatos.'
    },
    en: {
      title: 'Airbnb & Vacation Rentals',
      subtitle: 'Fast turnovers & 5-star cleanliness for your guests',
      details: 'Offer your guests premium hotel-grade cleanliness. Our specialized cleaning service for short-term rentals and vacation homes guarantees swift turnovers, professional linen/laundry care, restocking, and meticulous inspections.'
    },
    fr: {
      title: 'Airbnb & Locations Saisonnières',
      subtitle: 'Rotations rapides et propreté 5 étoiles pour vos voyageurs',
      details: 'Un service de nettoyage de qualité hôtelière pour vos locations de courte durée. Nous assurons des rotations fluides entre deux séjours, la gestion du linge de lit et de toilette, et le réapprovisionnement.'
    },
    it: {
      title: 'Airbnb e Affitti Vacanze',
      subtitle: 'Cambi rapidi e pulizia a 5 stelle per i tuoi ospiti',
      details: 'Servizio di pulizia specializzato per appartamenti turistici e affitti brevi. Garantiamo cambi rapidi di alta precisione, cura professionale della biancheria, rifornimenti essenziali e controlli meticolosi.'
    },
    pt: {
      title: 'Airbnb e Aluguer de Temporada',
      subtitle: 'Limpezas rápidas e qualidade 5 estrelas para hóspedes',
      details: 'Ofereça aos seus hóspedes uma limpeza impecável de nível hoteleiro. Garantimos rotatividades rápidas, tratamento profissional de lençóis e toalhas, reposição de consumíveis e verificação de danos.'
    }
  },
  'offices-corporate': {
    de: {
      title: 'Oficinas & Corporativos / Büroreinigung',
      subtitle: 'Gesunde Arbeitsplätze für maximale Produktivität',
      details: 'Erstklassige, regelmässige Büro- und Unterhaltsreinigung für Schweizer Unternehmen. Wir reinigen Schreibtische, Besprechungsräume, Kaffeeküchen und Sanitäranlagen mit Diskretion und nach höchsten ISO-Standards.'
    },
    es: {
      title: 'Oficinas y Corporativos',
      subtitle: 'Espacios de trabajo saludables para una máxima productividad',
      details: 'Servicio de primera clase de limpieza diaria y mantenimiento de oficinas para empresas suizas. Limpiamos escritorios, salas de reuniones, áreas de descanso y sanitarios con discreción y de acuerdo con las normas ISO más exigentes.'
    },
    en: {
      title: 'Offices & Corporate Cleaning',
      subtitle: 'Healthy workplaces that boost productivity and impression',
      details: 'First-class regular office cleaning for Swiss enterprises of all sizes. We disinfect workspaces, meeting rooms, break areas, and restrooms with maximum discretion, adhering to strict ISO and GAV standards.'
    },
    fr: {
      title: 'Bureaux & Espaces Corporatifs',
      subtitle: 'Des espaces de travail sains pour motiver vos équipes',
      details: 'Nettoyage régulier de bureaux et sièges sociaux. Nos agents qualifiés interviennent en toute discrétion pour entretenir vos espaces de travail, salles de réunion, cafétérias et sanitaires selon vos exigences.'
    },
    it: {
      title: 'Uffici e Sedi Aziendali',
      subtitle: 'Ambienti di lavoro sani e produttivi di alto livello',
      details: 'Servizio professionale di pulizia per uffici di ogni dimensione. Sanifichiamo postazioni di lavoro, sale riunioni, cucine e bagni con la massima discrezione e conformità alle norme di sicurezza.'
    },
    pt: {
      title: 'Escritórios e Sede de Empresas',
      subtitle: 'Espaços de trabalho limpos para aumentar a produtividade',
      details: 'Limpeza corporativa regular de alta qualidade. Mantemos secretárias, salas de reunião, copas e sanitários em estado impecável de higiene e organização, com total flexibilidade de horários.'
    }
  },
  'retail-showrooms': {
    de: {
      title: 'Comercios & Showrooms / Ladenreinigung',
      subtitle: 'Makellose Sauberkeit für Ihr perfektes Markenerlebnis',
      details: 'Wir sorgen dafür, dass sich Ihre Kunden rundum wohlfühlen. Unser Fachpersonal reinigt Verkaufsflächen, Schaufenster, Umkleiden und Kassenbereiche diskret im Hintergrund – idealerweise vor Ladenöffnung oder nach Ladenschluss.'
    },
    es: {
      title: 'Comercios y Showrooms',
      subtitle: 'Espacios impecables que elevan la experiencia de tu marca',
      details: 'Nos aseguramos de que sus clientes se sientan cómodos en todo momento. Nuestro personal especializado limpia áreas de venta, escaparates, probadores y zonas de caja de manera discreta en el fondo, idealmente antes o después del horario comercial.'
    },
    en: {
      title: 'Retail & Showrooms',
      subtitle: 'Immaculate spaces that elevate your brand experience',
      details: 'We ensure your customers enjoy a pristine shopping environment. Our specialized personnel cleans sales floors, storefront windows, dressing rooms, and cashier counters discreetly—typically before opening or after closing hours.'
    },
    fr: {
      title: 'Boutiques & Showrooms',
      subtitle: 'Un environnement d’achat d’une propreté étincelante',
      details: 'Mettez en valeur votre image de marque avec des surfaces de vente et des vitrines parfaitement propres. Nous nettoyons vos espaces d’exposition, caisses et cabines d’essayage en dehors de vos heures d’ouverture.'
    },
    it: {
      title: 'Negozi e Showroom',
      subtitle: 'Spazi commerciali curati per valorizzare la tua marca',
      details: 'Garantiamo un ambiente d’acquisto accogliente e igienizzato. Puliamo superfici espositive, vetrine, camerini e banchi cassa in orari flessibili per non interferire con l’afflusso della clientela.'
    },
    pt: {
      title: 'Lojas e Showrooms',
      subtitle: 'Espaços comerciais impecáveis para destacar a sua marca',
      details: 'Criamos um ambiente de compras atraente e limpo. Limpamos pisos, vitrines, provadores e balcões de atendimento de forma discreta, preferencialmente fora do horário de funcionamento da loja.'
    }
  },
  'gastronomy-restaurants': {
    de: {
      title: 'Gastronomie & Restaurants',
      subtitle: 'Hygienische Tiefenreinigung für Küchen & Gasträume nach HACCP',
      details: 'Hygienische Meisterleistung für Ihren Gastrobetrieb. Wir reinigen Grossküchen, lüftungstechnische Anlagen (Entfettung), Kühlzellen und Gasträume gemäss den strengsten Schweizer Lebensmittelhygiene-Standards (HACCP).'
    },
    es: {
      title: 'Gastronomía y Restaurantes',
      subtitle: 'Limpieza profunda de cocinas y salones conforme a HACCP',
      details: 'Garantizamos los más altos estándares de higiene para su establecimiento gastronómico. Limpiamos cocinas industriales, desengrasamos campanas y sistemas de extracción, y desinfectamos salones y cámaras frigoríficas según la normativa HACCP.'
    },
    en: {
      title: 'Gastronomy & Restaurants',
      subtitle: 'Hygienic deep cleaning for commercial kitchens & guest areas',
      details: 'Uncompromising hygiene for your dining establishment. We clean commercial kitchens, degrease ventilation hoods, sanitize cold storage, and polish dining rooms to conform fully with Swiss HACCP food safety regulations.'
    },
    fr: {
      title: 'Gastronomie & Restaurants',
      subtitle: 'Nettoyage de cuisines professionnelles selon les normes HACCP',
      details: 'Hygiène irréprochable pour vos cuisines, zones de stockage, hottes d’aspiration et salles de restaurant. Nous appliquons rigoureusement les protocoles HACCP pour garantir la conformité de votre établissement.'
    },
    it: {
      title: 'Gastronomia e Ristorazione',
      subtitle: 'Pulizia profonda HACCP per cucine industriali e sale pranzo',
      details: 'Igiene e sicurezza alimentare assoluta per il tuo locale. Puliamo a fondo cucine professionali, sgrassiamo cappe e sistemi di areazione, sanifichiamo celle frigorifere e sale ristorante a norma HACCP.'
    },
    pt: {
      title: 'Gastronomia e Restaurantes',
      subtitle: 'Limpeza profunda de cozinhas industriais de acordo com o HACCP',
      details: 'Higiene rigorosa para o seu estabelecimento. Efetuamos a limpeza profunda e desengorduramento de exaustores, fornos, grelhadores, copas e salas de refeições, em total conformidade com a legislação HACCP.'
    }
  },
  'industry-logistics': {
    de: {
      title: 'Industria & Logística / Industriereinigung',
      subtitle: 'Sicherheit, Sauberkeit & Werterhalt für Industrieobjekte',
      details: 'Spezialisierte Instandhaltung und Reinigung für Logistikcenter, Werkstätten und Industrieanlagen. Wir reinigen Hallen, Maschinen und führen professionelle Bodenpolituren und Kristallisationen (HSE-konform) durch.'
    },
    es: {
      title: 'Industria y Logística',
      subtitle: 'Seguridad, limpieza y mantenimiento de naves e instalaciones',
      details: 'Mantenimiento y limpieza especializada para centros logísticos, almacenes y plantas industriales. Limpiamos naves, maquinaria y realizamos pulido y cristalización profesional de suelos, cumpliendo con las normas de seguridad (HSE).'
    },
    en: {
      title: 'Industry & Logistics',
      subtitle: 'Safety, compliance, and heavy-duty industrial maintenance',
      details: 'Specialized cleaning and maintenance for logistics hubs, warehouses, and industrial plants. We clean industrial flooring, machinery, and conduct heavy-duty floor crystallization or high-reach cleaning under strict HSE rules.'
    },
    fr: {
      title: 'Industrie & Logistique',
      subtitle: 'Nettoyage technique et entretien d’entrepôts ou usines',
      details: 'Prestations de nettoyage spécialisé pour l’industrie. Nous intervenons sur les sols de stockage de grande surface, les machines industrielles et les zones de chargement en respectant strictement vos règles de sécurité.'
    },
    it: {
      title: 'Industria e Logistica',
      subtitle: 'Pulizia e manutenzione di impianti industriali e logistici',
      details: 'Manutenzione specialistica per poli logistici, fabbriche e magazzini. Lavaggio di grandi pavimentazioni, sgrassatura di macchinari e pulizie in quota in totale osservanza dei protocolli di sicurezza HSE.'
    },
    pt: {
      title: 'Indústria e Logística',
      subtitle: 'Limpeza técnica e manutenção de armazéns e instalações',
      details: 'Serviços especializados de limpeza industrial. Realizamos a limpeza profunda de pavimentos industriais de grande escala, lavagem de maquinaria e manutenção de centros logísticos de forma segura (normas HSE).'
    }
  }
};

const getCleanServiceTitle = (sId: string, titleKey: string, t: any, fallbackTitle: string, lang: string = 'de'): string => {
  const normId = sId.toLowerCase();
  const entry = COMMERCIAL_SERVICE_TRANSLATIONS[normId];
  if (entry) {
    const cleanLang = (lang || 'de').toLowerCase().split('-')[0];
    const trans = entry[cleanLang] || entry['de'] || entry['en'];
    if (trans) return trans.title;
  }

  const translated = t(titleKey);
  if (translated && !translated.includes('.') && !translated.startsWith('services.') && !translated.startsWith('commercial.')) {
    return translated;
  }
  
  const i18nKey = WIZARD_TO_I18N_SERVICE[normId];
  if (i18nKey) {
    const fallbackKey = `services.${i18nKey}.title`;
    const fallbackTrans = t(fallbackKey);
    if (fallbackTrans && !fallbackTrans.includes('.') && !fallbackTrans.startsWith('services.')) {
      return fallbackTrans;
    }
  }

  if (fallbackTitle && !fallbackTitle.includes('.') && !fallbackTitle.startsWith('services.') && !fallbackTitle.startsWith('commercial.')) {
    return fallbackTitle;
  }

  return sId
    .toLowerCase()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getCleanServiceSubtitle = (sId: string, titleKey: string, t: any, fallbackSubtitle: string, lang: string = 'de'): string => {
  const normId = sId.toLowerCase();
  const entry = COMMERCIAL_SERVICE_TRANSLATIONS[normId];
  if (entry) {
    const cleanLang = (lang || 'de').toLowerCase().split('-')[0];
    const trans = entry[cleanLang] || entry['de'] || entry['en'];
    if (trans) return trans.subtitle;
  }

  const i18nKey = WIZARD_TO_I18N_SERVICE[normId] || sId;
  
  if (i18nKey === 'car') {
    const trans = t('services.car.subtitle');
    if (trans && !trans.includes('.') && !trans.startsWith('services.')) return trans;
  }
  if (i18nKey === 'restaurant') {
    const trans = t('commercial.service.restaurant.desc');
    if (trans && !trans.includes('.') && !trans.startsWith('commercial.')) return trans;
  }
  
  if (['gardening', 'exterior', 'pest', 'waste', 'gutter', 'upholstery', 'window', 'mudanzaCajas', 'pulidoSuelos'].includes(i18nKey)) {
    const trans = t(`services.${i18nKey}.desc`);
    if (trans && !trans.includes('.') && !trans.startsWith('services.')) return trans;
  }
  
  const descKey = `services.${i18nKey}.description`;
  const transDesc = t(descKey);
  if (transDesc && !transDesc.includes('.') && !transDesc.startsWith('services.')) return transDesc;

  const commDescKey = `commercial.service.${sId.replace('-cleaning', '').replace('-management', '').replace('industrial-maintenance', 'industrial')}.desc`;
  const transComm = t(commDescKey);
  if (transComm && !transComm.includes('.') && !transComm.startsWith('commercial.')) return transComm;

  return fallbackSubtitle;
};

const getCleanServiceDetails = (sId: string, t: any, fallbackDetails: string, lang: string = 'de'): string => {
  const normId = sId.toLowerCase();
  const entry = COMMERCIAL_SERVICE_TRANSLATIONS[normId];
  if (entry) {
    const cleanLang = (lang || 'de').toLowerCase().split('-')[0];
    const trans = entry[cleanLang] || entry['de'] || entry['en'];
    if (trans) return trans.details;
  }

  const i18nKey = WIZARD_TO_I18N_SERVICE[normId] || sId;
  const detailsKey = `services.${i18nKey}.marketingDesc`;
  const trans = t(detailsKey);
  if (trans && !trans.includes('.') && !trans.startsWith('services.')) {
    return trans;
  }
  
  const commDescKey = `commercial.service.${sId.replace('-cleaning', '').replace('-management', '').replace('industrial-maintenance', 'industrial')}.desc`;
  const transComm = t(commDescKey);
  if (transComm && !transComm.includes('.') && !transComm.startsWith('commercial.')) {
    return transComm;
  }
  
  return fallbackDetails;
};

const LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  'en': {
    'not_found_title': 'Page not found',
    'not_found_desc': 'The requested service or region was not found.',
    'back_to_home': 'To Home Page',
    'region_service': 'Service in Region {city}',
    'professional_service': 'Professional {service} in {city}',
    'quote_cta_2min': 'Instant quote in 2 min.',
    'more_details': 'More Details',
    'region': 'SERVICE REGION',
    'region_val': '{city} & surroundings',
    'response_time': 'RESPONSE TIME',
    'response_time_val': 'Under 2 hours',
    'standard': 'STANDARD',
    'standard_val': 'Swiss Masterclass',
    'footprint': 'CARBON FOOTPRINT',
    'footprint_val': '100% Eco-Certified',
    'why_partner': 'Why Kraken PFM is your best partner for {service} in {city}',
    'exclusive_benefits': 'Your exclusive benefits with Kraken:',
    'regional_parameters': 'Regional Parameters ({city})',
    'system_status': 'SYSTEM_STATUS: ACTIVE // {city}_SECTOR',
    'min_order_value': 'Minimum order value',
    'min_order_value_val': 'None',
    'estimated_price': 'ESTIMATED PRICE FOR {city}',
    'vat_incl': 'Incl. VAT',
    'price_desc': 'Our prices are calculated transparently. No travel fees for {city}, fully insured staff, state-of-the-art equipment.',
    'how_booking_works': 'How does booking work?',
    'step_1_title': 'Enter key data:',
    'step_1_desc': 'Click Calculate Quote below.',
    'step_2_title': 'Instant CHF Quote:',
    'step_2_desc': 'Configure your offer live in CHF.',
    'step_3_title': 'Choose preferred date:',
    'step_3_desc': 'Book your appointment easily online.',
    'calculate_prices': 'Calculate prices for {city}',
    'secure_transmission': 'Secure transfer & non-binding',
    'faq_title': 'Frequently Asked Questions (FAQ)',
    'faq_desc': 'Everything you need to know about {service} in the {city} region.',
    'other_services': 'Other premium services in {city}',
    'other_regions': '{service} in other regions',
    'regional_desc': 'Swiss quality standards and ecological cleaning procedures directly on site in {city}.',
    'starting_from': 'From {price}',
    'checklist_title': 'What is included?',
    'checklist_intro': 'For every assignment of Kraken PFM for {service} in {city}, the following services are firmly included:',
    'price_note_title': '💡 Important Note on Prices:',
    'price_note_desc': 'The actual final price depends on the exact square footage (m²), the individual condition of the property, and specific customer requirements. Use our intelligent online configurator to calculate your personal, customized fixed-price offer in just 2 minutes!',
  },
  'de': {
    'not_found_title': 'Seite nicht gefunden',
    'not_found_desc': 'Der gewünschte Service oder die Region wurde nicht gefunden.',
    'back_to_home': 'Zur Startseite',
    'region_service': 'Dienstleistung in Region {city}',
    'professional_service': 'Professionelle {service} in {city}',
    'quote_cta_2min': 'Sofort-Offerte in 2 Min.',
    'more_details': 'Mehr Details',
    'region': 'EINSATZREGION',
    'region_val': '{city} & Umgebung',
    'response_time': 'REAKTIONSZEIT',
    'response_time_val': 'Unter 2 Stunden',
    'standard': 'STANDARD',
    'standard_val': 'Schweizer Meisterklasse',
    'footprint': 'KLIMABILANZ',
    'footprint_val': '100% Öko-Zertifiziert',
    'why_partner': 'Warum Kraken PFM Ihr bester Partner für {service} in {city} ist',
    'exclusive_benefits': 'Ihre exklusiven Vorteile bei Kraken:',
    'regional_parameters': 'Regional-Parameter ({city})',
    'system_status': 'SYSTEM_STATUS: ACTIVE // {city}_SECTOR',
    'min_order_value': 'Mindestbestellwert',
    'min_order_value_val': 'Keiner',
    'estimated_price': 'RICHTPREIS FÜR {city}',
    'vat_incl': 'Inkl. MwSt',
    'price_desc': 'Unsere Preise sind transparent kalkuliert. Keine Anfahrtsgebühren für {city}, voll versichertes Personal, modernste Ausrüstung.',
    'how_booking_works': 'Wie funktioniert die Buchung?',
    'step_1_title': 'Eckdaten eingeben:',
    'step_1_desc': 'Klicken Sie unten auf Offerte berechnen.',
    'step_2_title': 'CHF-Sofortofferte:',
    'step_2_desc': 'Konfigurieren Sie Ihr Angebot live in CHF.',
    'step_3_title': 'Wunschtermin wählen:',
    'step_3_desc': 'Buchen Sie Ihren Termin bequem online.',
    'calculate_prices': 'Preise für {city} berechnen',
    'secure_transmission': 'Sichere Übertragung & Unverbindlich',
    'faq_title': 'Häufig gestellte Fragen (FAQ)',
    'faq_desc': 'Alles, was Sie über {service} in der Region {city} wissen müssen.',
    'other_services': 'Andere Premium-Services in {city}',
    'other_regions': '{service} in anderen Regionen',
    'regional_desc': 'Schweizer Qualitätsstandards und ökologische Reinigungsverfahren direkt vor Ort in {city}.',
    'starting_from': 'Ab {price}',
    'checklist_title': 'Was ist inbegriffen?',
    'checklist_intro': 'Bei jedem Einsatz von Kraken PFM für {service} in {city} sind folgende Leistungen fest inbegriffen:',
    'price_note_title': '💡 Wichtiger Hinweis zu den Preisen:',
    'price_note_desc': 'Der tatsächliche Endpreis richtet sich nach der genauen Quadratmeterzahl (m²), dem individuellen Zustand des Objekts sowie speziellen Kundenwünschen. Nutzen Sie unseren intelligenten Online-Konfigurator, um in nur 2 Minuten Ihr persönliches, massgeschneidertes Festpreisangebot zu berechnen!',
  },
  'de-CH': {
    'not_found_title': 'Seite nicht gefunden',
    'not_found_desc': 'Der gewünschte Service oder die Region wurde nicht gefunden.',
    'back_to_home': 'Zur Startseite',
    'region_service': 'Dienstleistung in Region {city}',
    'professional_service': 'Professionelle {service} in {city}',
    'quote_cta_2min': 'Sofort-Offerte in 2 Min.',
    'more_details': 'Mehr Details',
    'region': 'EINSATZREGION',
    'region_val': '{city} & Umgebung',
    'response_time': 'REAKTIONSZEIT',
    'response_time_val': 'Unter 2 Stunden',
    'standard': 'STANDARD',
    'standard_val': 'Schweizer Meisterklasse',
    'footprint': 'KLIMABILANZ',
    'footprint_val': '100% Öko-Zertifiziert',
    'why_partner': 'Warum Kraken PFM Ihr bester Partner für {service} in {city} ist',
    'exclusive_benefits': 'Ihre exklusiven Vorteile bei Kraken:',
    'regional_parameters': 'Regional-Parameter ({city})',
    'system_status': 'SYSTEM_STATUS: ACTIVE // {city}_SECTOR',
    'min_order_value': 'Mindestbestellwert',
    'min_order_value_val': 'Keiner',
    'estimated_price': 'RICHTPREIS FÜR {city}',
    'vat_incl': 'Inkl. MwSt',
    'price_desc': 'Unsere Preise sind transparent kalkuliert. Keine Anfahrtsgebühren für {city}, voll versichertes Personal, modernste Ausrüstung.',
    'how_booking_works': 'Wie funktioniert die Buchung?',
    'step_1_title': 'Eckdaten eingeben:',
    'step_1_desc': 'Klicken Sie unten auf Offerte berechnen.',
    'step_2_title': 'CHF-Sofortofferte:',
    'step_2_desc': 'Konfigurieren Sie Ihr Angebot live in CHF.',
    'step_3_title': 'Wunschtermin wählen:',
    'step_3_desc': 'Buchen Sie Ihren Termin bequem online.',
    'calculate_prices': 'Preise für {city} berechnen',
    'secure_transmission': 'Sichere Übertragung & Unverbindlich',
    'faq_title': 'Häufig gestellte Fragen (FAQ)',
    'faq_desc': 'Alles, was Sie über {service} in der Region {city} wissen müssen.',
    'other_services': 'Andere Premium-Services in {city}',
    'other_regions': '{service} in anderen Regionen',
    'regional_desc': 'Schweizer Qualitätsstandards und ökologische Reinigungsverfahren direkt vor Ort in {city}.',
    'starting_from': 'Ab {price}',
    'checklist_title': 'Was ist inbegriffen?',
    'checklist_intro': 'Bei jedem Einsatz von Kraken PFM für {service} in {city} sind folgende Leistungen fest inbegriffen:',
    'price_note_title': '💡 Wichtiger Hinweis zu den Preisen:',
    'price_note_desc': 'Der tatsächliche Endpreis richtet sich nach der genauen Quadratmeterzahl (m²), dem individuellen Zustand des Objekts sowie speziellen Kundenwünschen. Nutzen Sie unseren intelligenten Online-Konfigurator, um in nur 2 Minuten Ihr persönliches, massgeschneidertes Festpreisangebot zu berechnen!',
  },
  'fr': {
    'not_found_title': 'Page non trouvée',
    'not_found_desc': 'Le service ou la région demandé n’a pas été trouvé.',
    'back_to_home': 'Retour à la page d’accueil',
    'region_service': 'Service dans la région {city}',
    'professional_service': '{service} professionnel à {city}',
    'quote_cta_2min': 'Devis instantané en 2 min.',
    'more_details': 'Plus de détails',
    'region': 'RÉGION DE SERVICE',
    'region_val': '{city} & environs',
    'response_time': 'TEMPS DE RÉPONSE',
    'response_time_val': 'Moins de 2 heures',
    'standard': 'STANDARD',
    'standard_val': 'Swiss Masterclass',
    'footprint': 'EMPREINTE CARBONE',
    'footprint_val': '100% Éco-Certifié',
    'why_partner': 'Pourquoi Kraken PFM est votre meilleur partenaire pour {service} à {city}',
    'exclusive_benefits': 'Vos avantages exclusifs avec Kraken :',
    'regional_parameters': 'Paramètres régionaux ({city})',
    'system_status': 'SYSTEM_STATUS: ACTIVE // {city}_SECTOR',
    'min_order_value': 'Valeur minimale de commande',
    'min_order_value_val': 'Aucune',
    'estimated_price': 'PRIX ESTIMÉ POUR {city}',
    'vat_incl': 'TVA incluse',
    'price_desc': 'Nos prix sont calculés de manière transparente. Pas de frais de déplacement pour {city}, personnel entièrement assuré, équipement de pointe.',
    'how_booking_works': 'Comment fonctionne la réservation ?',
    'step_1_title': 'Saisir les données clés :',
    'step_1_desc': 'Cliquez sur Calculer le devis ci-dessous.',
    'step_2_title': 'Devis CHF instantané :',
    'step_2_desc': 'Configurez votre offre en direct en CHF.',
    'step_3_title': 'Choisir la date souhaitée :',
    'step_3_desc': 'Réservez votre rendez-vous facilement en ligne.',
    'calculate_prices': 'Calculer les prix pour {city}',
    'secure_transmission': 'Transmission sécurisée & sans engagement',
    'faq_title': 'Foire Aux Questions (FAQ)',
    'faq_desc': 'Tout ce que vous devez savoir sur {service} dans la région de {city}.',
    'other_services': 'Autres services premium à {city}',
    'other_regions': '{service} dans d’autres régions',
    'regional_desc': 'Normes de qualité suisses et procédures de nettoyage écologiques directement sur place à {city}.',
    'starting_from': 'À partir de {price}',
    'checklist_title': "Qu'est-ce qui est inclus ?",
    'checklist_intro': "Pour chaque intervention de Kraken PFM pour {service} à {city}, les prestations suivantes sont fermement incluses :",
    'price_note_title': "💡 Remarque importante sur les prix :",
    'price_note_desc': "Le prix final réel dépend de la surface exacte en mètres carrés (m²), de l'état individuel de la propriété et des exigences spécifiques du client. Utilisez notre configurateur en ligne intelligent pour calculer votre offre de prix fixe personnelle et personnalisée en seulement 2 minutes !",
  },
  'it': {
    'not_found_title': 'Pagina non trovata',
    'not_found_desc': 'Il servizio o la regione richiesti non sono stati trovati.',
    'back_to_home': 'Torna alla pagina iniziale',
    'region_service': 'Servizio nella regione {city}',
    'professional_service': '{service} professionale a {city}',
    'quote_cta_2min': 'Preventivo istantaneo in 2 min.',
    'more_details': 'Più dettagli',
    'region': 'REGIONE DI SERVIZIO',
    'region_val': '{city} e dintorni',
    'response_time': 'TEMPO DI RISPOSTA',
    'response_time_val': 'Meno di 2 ore',
    'standard': 'STANDARD',
    'standard_val': 'Swiss Masterclass',
    'footprint': 'IMPRONTA ECOLOGICA',
    'footprint_val': '100% Eco-Certificato',
    'why_partner': 'Perché Kraken PFM è il miglior partner per {service} a {city}',
    'exclusive_benefits': 'I tuoi vantaggi esclusivi con Kraken:',
    'regional_parameters': 'Parametri regionali ({city})',
    'system_status': 'SYSTEM_STATUS: ACTIVE // {city}_SECTOR',
    'min_order_value': 'Valore minimo dell’ordine',
    'min_order_value_val': 'Nessuno',
    'estimated_price': 'PREZZO STIMATO PER {city}',
    'vat_incl': 'IVA incl.',
    'price_desc': 'I nostri prezzi sono calcolati in modo trasparente. Nessuna tariffa di trasferta per {city}, personale completamente assicurato, attrezzature all’avanguardia.',
    'how_booking_works': 'Come funziona la prenotazione?',
    'step_1_title': 'Inserisci i dati chiave:',
    'step_1_desc': 'Clicca su Calcola preventivo qui sotto.',
    'step_2_title': 'Preventivo CHF istantaneo:',
    'step_2_desc': 'Configura la tua offerta in tempo reale in CHF.',
    'step_3_title': 'Scegli la data desiderata:',
    'step_3_desc': 'Prenota il tuo appuntamento comodamente online.',
    'calculate_prices': 'Calcola i prezzi per {city}',
    'secure_transmission': 'Trasmissione sicura e senza impegno',
    'faq_title': 'Domande frequenti (FAQ)',
    'faq_desc': 'Tutto quello che c’è da sapere su {service} nella regione di {city}.',
    'other_services': 'Altri servizi premium a {city}',
    'other_regions': '{service} in altre regioni',
    'regional_desc': 'Standard di qualità svizzeri e procedure di pulizia ecologiche direttamente in loco a {city}.',
    'starting_from': 'Da {price}',
    'checklist_title': 'Cosa è incluso?',
    'checklist_intro': 'Per ogni intervento di Kraken PFM per {service} a {city}, sono fermamente inclusi i seguenti servizi:',
    'price_note_title': '💡 Nota importante sui prezzi:',
    'price_note_desc': "Il prezzo finale effettivo dipende dalla superficie esatta in metri quadrati (m²), dalle condizioni individuali dell'immobile e da specifiche esigenze del cliente. Utilizza il nostro configuratore online intelligente per calcolare la tua offerta personale a prezzo fisso personalizzata in soli 2 minuti!",
  },
  'es': {
    'not_found_title': 'Página no encontrada',
    'not_found_desc': 'El servicio o la región solicitados no se encontraron.',
    'back_to_home': 'Volver a la página de inicio',
    'region_service': 'Servicio en la región {city}',
    'professional_service': '{service} profesional en {city}',
    'quote_cta_2min': 'Presupuesto al instante en 2 min.',
    'more_details': 'Más detalles',
    'region': 'REGIÓN DE SERVICIO',
    'region_val': '{city} y alrededores',
    'response_time': 'TIEMPO DE RESPUESTA',
    'response_time_val': 'Menos de 2 horas',
    'standard': 'ESTÁNDAR',
    'standard_val': 'Clase Maestra Suiza',
    'footprint': 'HUELLA DE CARBONO',
    'footprint_val': '100% Eco-Certificado',
    'why_partner': 'Por qué Kraken PFM es su mejor socio para {service} en {city}',
    'exclusive_benefits': 'Sus ventajas exclusivas con Kraken:',
    'regional_parameters': 'Parámetros regionales ({city})',
    'system_status': 'SYSTEM_STATUS: ACTIVE // {city}_SECTOR',
    'min_order_value': 'Valor mínimo de pedido',
    'min_order_value_val': 'Ninguno',
    'estimated_price': 'PRECIO ESTIMADO PARA {city}',
    'vat_incl': 'IVA incl.',
    'price_desc': 'Nuestros precios se calculan de manera transparente. Sin gastos de viaje para {city}, personal totalmente asegurado, equipamiento de última generación.',
    'how_booking_works': '¿Cómo funciona la reserva?',
    'step_1_title': 'Introducir datos clave:',
    'step_1_desc': 'Haga clic en Calcular presupuesto a continuación.',
    'step_2_title': 'Presupuesto CHF instantáneo:',
    'step_2_desc': 'Configure su oferta en vivo en CHF.',
    'step_3_title': 'Elegir fecha deseada:',
    'step_3_desc': 'Reserve su cita cómodamente en línea.',
    'calculate_prices': 'Calcular precios para {city}',
    'secure_transmission': 'Transmisión segura y sin compromiso',
    'faq_title': 'Preguntas Frecuentes (FAQ)',
    'faq_desc': 'Todo lo que necesita saber sobre {service} en la región de {city}.',
    'other_services': 'Otros servicios premium en {city}',
    'other_regions': '{service} en otras regiones',
    'regional_desc': 'Estándares de calidad suizos y procedimientos de limpieza ecológicos directamente en {city}.',
    'starting_from': 'Desde {price}',
    'checklist_title': '¿Qué está incluido?',
    'checklist_intro': 'Para cada servicio de Kraken PFM de {service} en {city}, se incluyen firmemente los siguientes servicios:',
    'price_note_title': '💡 Nota importante sobre los precios:',
    'price_note_desc': 'El precio final real depende de la superficie exacta en metros cuadrados (m²), del estado individual de la propiedad y de los requisitos específicos del cliente. ¡Utilice nuestro configurador inteligente en línea para calcular su servicio y personalizada en solo 2 minutos!',
  },
  'pt': {
    'not_found_title': 'Página não encontrada',
    'not_found_desc': 'O serviço ou a região solicitado não foi encontrado.',
    'back_to_home': 'Voltar para a página inicial',
    'region_service': 'Serviço na região de {city}',
    'professional_service': '{service} profissional em {city}',
    'quote_cta_2min': 'Orçamento instantâneo em 2 min.',
    'more_details': 'Mais detalhes',
    'region': 'REGIÃO DE ATENDIMENTO',
    'region_val': '{city} e arredores',
    'response_time': 'TEMPO DE RESPOSTA',
    'response_time_val': 'Menos de 2 horas',
    'standard': 'PADRÃO',
    'standard_val': 'Classe Mestre Suíça',
    'footprint': 'PEGADA DE CARBONO',
    'footprint_val': '100% Eco-Certificado',
    'why_partner': 'Por que a Kraken PFM é a sua melhor parceira para {service} em {city}',
    'exclusive_benefits': 'Seus benefícios exclusivos com a Kraken:',
    'regional_parameters': 'Parâmetros regionais ({city})',
    'system_status': 'SYSTEM_STATUS: ACTIVE // {city}_SECTOR',
    'min_order_value': 'Valor mínimo do pedido',
    'min_order_value_val': 'Nenhum',
    'estimated_price': 'PREÇO ESTIMADO PARA {city}',
    'vat_incl': 'IVA incl.',
    'price_desc': 'Nossos preços são calculados de forma transparente. Sem taxas de deslocamento para {city}, funcionários totalmente segurados, equipamentos de última geração.',
    'how_booking_works': 'Como funciona a reserva?',
    'step_1_title': 'Inserir dados principais:',
    'step_1_desc': 'Clique em Calcular orçamento abaixo.',
    'step_2_title': 'Orçamento CHF instantâneo:',
    'step_2_desc': 'Configure a sua oferta ao vivo em CHF.',
    'step_3_title': 'Escolher a data desejada:',
    'step_3_desc': 'Reserve a sua consulta facilmente online.',
    'calculate_prices': 'Calcular preços para {city}',
    'secure_transmission': 'Transmissão segura & sem compromisso',
    'faq_title': 'Perguntas Frecuentes (FAQ)',
    'faq_desc': 'Tudo o que precisa de saber sobre {service} na região de {city}.',
    'other_services': 'Outros serviços premium em {city}',
    'other_regions': '{service} em outras regiões',
    'regional_desc': 'Padrões de qualidade suíços e procedimentos de limpeza ecológicos diretamente no local em {city}.',
    'starting_from': 'A partir de {price}',
    'checklist_title': 'O que está incluído?',
    'checklist_intro': 'Para cada serviço da Kraken PFM de {service} em {city}, estão firmemente incluídos os seguintes serviços:',
    'price_note_title': '💡 Nota importante sobre os preços:',
    'price_note_desc': 'O preço final real depende da área exata em metros quadrados (m²), do estado individual da propriedade e dos requisitos específicos do cliente. Utilize o nosso configurador online inteligente para calcular a sua oferta de preço fixo pessoal e personalizada em apenas 2 minutos!',
  }
};

const translateStartingPrice = (price: string, lang: string) => {
  if (price === 'Auf Anfrage' || price.toLowerCase().includes('auf anfrage')) {
    if (lang === 'en') return 'On request';
    if (lang === 'fr') return 'Sur demande';
    if (lang === 'it') return 'Su richiesta';
    if (lang === 'es') return 'A petición';
    if (lang === 'pt') return 'Sob consulta';
    return 'Auf Anfrage';
  }
  const amount = price.replace('Ab ', '').replace(' / Std.', ' / hr').replace(' / Std.', ' / h');
  if (lang === 'en') {
    return `From ${amount}`;
  }
  if (lang === 'fr') {
    return `À partir de ${amount.replace(' / hr', ' / h')}`;
  }
  if (lang === 'it') {
    return `Da ${amount.replace(' / hr', ' / ora')}`;
  }
  if (lang === 'es' || lang === 'pt') {
    return `Desde ${amount.replace(' / hr', ' / h')}`;
  }
  return price; // German/default
};

const getLocalizedFeatures = (cityId: string, lang: string): string[] => {
  const translations: Record<string, Record<string, string[]>> = {
    'en': {
      'zurich': ['Service area: City of Zurich & agglomeration', 'Response time: Express service available', 'Local crew with best local knowledge', '100% CO2-compensated travel'],
      'winterthur': ['Service area: Winterthur & Weinland', 'Response time: On site in under 2 hours', 'Focus on sustainability & green products', 'Close cooperation with local partners'],
      'schaffhausen': ['Service area: Canton of Schaffhausen & Klettgau', 'Headquarters advantage: Fastest support', 'Own specialized cleaning fleet', 'Strong network in the region']
    },
    'fr': {
      'zurich': ['Zone de service : Ville de Zurich & agglomération', 'Temps de réponse : Service express disponible', 'Équipe locale avec excellente connaissance de la région', 'Déplacement 100% compensé en CO2'],
      'winterthur': ['Zone de service : Winterthour & Weinland', 'Temps de réponse : Sur place en moins de 2 heures', 'Priorité à la durabilité & aux produits écologiques', 'Collaboration étroite avec des partenaires locaux'],
      'schaffhausen': ['Zone de service : Canton de Schaffhouse & Klettgau', 'Avantage siège social : Support le plus rapide', 'Propre flotte de nettoyage spécialisée', 'Réseau solide dans la région']
    },
    'it': {
      'zurich': ['Area di servizio: Città di Zurigo e agglomerato', 'Tempo di risposta: Servizio espresso disponibile', 'Team locale con eccellente conoscenza del territorio', 'Viaggio compensato al 100% in CO2'],
      'winterthur': ['Area di servizio: Winterthur & Weinland', 'Tempo di risposta: Sul posto in meno di 2 ore', 'Focus su sostenibilità e prodotti ecologici', 'Stretta collaborazione con partner locali'],
      'schaffhausen': ['Area di servizio: Canton Sciaffusa & Klettgau', 'Vantaggio sede centrale: Supporto rapidissimo', 'Flotta di pulizia specializzata propria', 'Forte rete di contatti nella regione']
    },
    'es': {
      'zurich': ['Área de servicio: Ciudad de Zúrich y aglomeración', 'Tiempo de respuesta: Servicio exprés disponible', 'Equipo local con excelente conocimiento de la zona', 'Desplazamiento 100% compensado en CO2'],
      'winterthur': ['Área de servicio: Winterthur y Weinland', 'Tiempo de respuesta: En el lugar en menos de 2 horas', 'Enfoque en sostenibilidad y productos ecológicos', 'Estrecha colaboración con socios locales'],
      'schaffhausen': ['Área de servicio: Cantón de Schaffhausen y Klettgau', 'Ventaja de la sede: Soporte más rápido', 'Flota de limpieza propia especializada', 'Forte red en la región']
    },
    'pt': {
      'zurich': ['Área de serviço: Cidade de Zurique & aglomeração', 'Tempo de resposta: Serviço expresso disponível', 'Equipa local com excelente conhecimento da zona', 'Deslocação 100% compensada em CO2'],
      'winterthur': ['Área de serviço: Winterthur & Weinland', 'Tempo de resposta: No local em menos de 2 horas', 'Foco na sustentabilidade & produtos ecológicos', 'Estreita colaboração com parceiros locais'],
      'schaffhausen': ['Área de serviço: Cantão de Schaffhausen & Klettgau', 'Vantagem da sede: Suporte mais rápido', 'Frota de limpeza própria especializada', 'Forte rede na região']
    }
  };

  const defaultGerman: Record<string, string[]> = {
    'zurich': ['Einsatzgebiet: Stadt Zürich & Agglomeration', 'Reaktionszeit: Express-Service verfügbar', 'Lokale Crew mit bester Ortskenntnis', '100% CO2-kompensierte Anfahrt'],
    'winterthur': ['Einsatzgebiet: Winterthur & Weinland', 'Reaktionszeit: Unter 2 Stunden vor Ort', 'Fokus auf Nachhaltigkeit & Grüne Produkte', 'Enge Zusammenarbeit mit lokalen Partnern'],
    'schaffhausen': ['Einsatzgebiet: Kanton Schaffhausen & Klettgau', 'Hauptsitz-Vorteil: Schnellster Support', 'Eigene spezialisierte Reinigungsflotte', 'Starkes Netzwerk in der Region']
  };

  return (translations[lang] && translations[lang][cityId]) || defaultGerman[cityId] || CITY_METADATA[cityId]?.features || [];
};

const getLocalizedCityDesc = (cityId: string, lang: string): string => {
  const translations: Record<string, Record<string, string>> = {
    'en': {
      'zurich': 'Zurich and the entire catchment area benefit from our high-precision facility management. Whether representative offices on Bahnhofstrasse, elegant apartments on Lake Zurich, or industrial plants – we guarantee Swiss quality at the highest level.',
      'winterthur': 'In the cultural and industrial city of Winterthur, we secure the longevity of your real estate. Our well-coordinated team manages apartments, schools, commercial and industrial properties throughout the greater Winterthur area with Swiss conscientiousness.',
      'schaffhausen': 'As a proud company with strong roots in Schaffhausen, we offer our most intensive services here. Due to extremely short travel distances, we guarantee unbeatable efficiency, minimal environmental impact, and maximum customer proximity.'
    },
    'fr': {
      'zurich': 'Zurich et toute sa zone de chalandise bénéficient de notre gestion technique de bâtiments de haute précision. Qu\'il s\'agisse de bureaux de prestige sur la Bahnhofstrasse, de superbes appartements au bord du lac de Zurich ou d\'installations industrielles, nous garantissons la qualité suisse au plus haut niveau.',
      'winterthur': 'Dans la ville culturelle et industrielle de Winterthour, nous préservons la durabilité de votre patrimoine immobilier. Notre équipe expérimentée gère des appartements, des écoles, des commerces et des bâtiments industriels dans toute la région de Winterthour avec la rigueur suisse.',
      'schaffhausen': 'Fiers de nos racines à Schaffhouse, nous y proposons nos services les plus intensifs. Grâce à des trajets extrêmement courts, nous garantissons une efficacité imbattable, un impact environnemental minimal et une proximité maximale avec nos clients.'
    },
    'it': {
      'zurich': 'Zurigo e l\'intera area circostante beneficiano della nostra gestione immobiliare ad alta precisione. Che si tratti di uffici di rappresentanza sulla Bahnhofstrasse, eleganti appartamenti sul lago di Zurigo o impianti industriali, garantiamo la qualità svizzera ai massimi livelli.',
      'winterthur': 'Nella città culturale e industriale di Winterthur assicuriamo la longevità dei vostri immobili. Il nostro team affiatato gestisce appartamenti, scuole, proprietà commerciali e industriali in tutta l\'area di Winterthur con la tipica precisione svizzera.',
      'schaffhausen': 'Come azienda orgogliosa delle proprie radici a Sciaffusa, offriamo qui i nostri servizi più completi. Grazie a tempi di percorrenza estremamente brevi, garantiamo un\'efficienza imbattibile, il minimo impatto ambientale e la massima vicinanza al cliente.'
    },
    'es': {
      'zurich': 'Zúrich y toda su área de influencia se benefician de nuestra gestión de instalaciones de alta precisión. Ya sean oficinas representativas en la Bahnhofstrasse, elegantes apartamentos en el lago de Zúrich o plantas industriales, garantizamos la calidad suiza al más alto nivel.',
      'winterthur': 'En la ciudad cultural e industrial de Winterthur aseguramos la longevidad de sus inmuebles. Nuestro experimentado equipo atiende apartamentos, escuelas, propiedades comerciales e industriales en toda el área de Winterthur con la diligencia suiza.',
      'schaffhausen': 'Como una empresa orgullosa de sus raíces en Schaffhausen, ofrecemos aquí nuestros servicios más intensivos. Gracias a distancias de viaje extremadamente cortas, garantizamos una eficiencia imbatible, un impacto ambiental mínimo y la máxima proximidad al cliente.'
    },
    'pt': {
      'zurich': 'Zurique e toda a área circundante beneficiam da nossa gestão de instalações de alta precisão. Sejam escritórios de prestígio na Bahnhofstrasse, apartamentos elegantes no Lago de Zurique ou instalações industriais – garantimos a qualidade suíça ao mais alto nível.',
      'winterthur': 'Na cidade cultural e industrial de Winterthur asseguramos a longevidade dos seus imóveis. A nossa equipa experiente cuida de apartamentos, escolas, propriedades comerciais e industriais em toda a grande área de Winterthur com diligência suíça.',
      'schaffhausen': 'Como uma empresa orgulhosa das suas fortes raízes em Schaffhausen, oferecemos aqui os nossos serviços mais intensivos. Graças a distâncias de transporte extremamente curtas, garantimos uma eficiência imbatível, mínimo impacto ambiental e máxima proximidade ao cliente.'
    }
  };

  const defaultGerman: Record<string, string> = {
    'zurich': 'Zürich und das gesamte Einzugsgebiet profitieren von unserem hochpräzisen Facility Management. Ob repräsentative Büros an der Bahnhofstrasse, edle Apartments am Zürichsee oder Industrieanlagen – wir garantieren Schweizer Qualität auf höchstem Niveau.',
    'winterthur': 'In der Kultur- und Industriestadt Winterthur sichern wir die Langlebigkeit Ihrer Immobilien. Unser eingespieltes Team betreut Wohnungen, Schulen, Gewerbe- und Industrieobjekte im gesamten Grossraum Winterthur mit Schweizer Gewissenhaftigkeit.',
    'schaffhausen': 'Als stolzes Unternehmen mit starken Wurzeln in Schaffhausen bieten wir hier unsere intensivsten Services an. Durch extrem kurze Anfahrtswege garantieren wir unschlagbare Effizienz, minimale Umweltbelastung und maximale Kundennähe.'
  };

  return (translations[lang] && translations[lang][cityId]) || defaultGerman[cityId] || CITY_METADATA[cityId]?.desc || '';
};

const getLocalizedBenefits = (
  serviceId: string,
  lang: string,
  cityId?: string,
  cityName?: string,
  serviceTitle?: string
): string[] => {
  const translations: Record<string, Record<string, string[]>> = {
    'en': {
      'end-of-tenancy': [
        '100% Handover Guarantee included (we take full responsibility)',
        'Presence of our cleaning supervisor at the official handover meeting',
        'Professional cleaning according to the strictest Swiss standards',
        'Eco-friendly, biodegradable cleaning products'
      ],
      'deep-cleaning': [
        'Intensive cleaning of all hard-to-reach areas',
        'Removal of the most stubborn dirt, limescale, and encrustations',
        'Value preservation of high-quality floors, tiles, and fittings',
        'Gentle special treatment depending on the surface material'
      ],
      'daily-cleaning': [
        'Individual cleaning plan (weekly, bi-weekly, or flexible)',
        'Fixed, trustworthy, and trained cleaning staff',
        'Full insurance coverage for maximum security',
        'Transparent billing with no long-term contract binding'
      ],
      'moving-furniture': [
        'Experienced movers and professional transport vehicles',
        'Professional disassembly and assembly of furniture',
        'Gentle transport with state-of-the-art packaging materials',
        'Full transport and public liability insurance included'
      ],
      'gardening': [
        'Professional hedge trimming, lawn care, and weed removal',
        'Seasonal garden maintenance (spring cleaning, autumn leaves disposal)',
        'Experienced gardeners with sound botanical knowledge',
        'Professional disposal of green waste'
      ],
      'exterior-cleaning': [
        'Gentle high-pressure cleaning for facades, terraces, and paths',
        'Removal of algae, moss, lichens, and environmental pollution',
        'Value preservation and visual enhancement of your property',
        'Environmentally friendly, biodegradable cleaning agents'
      ],
      'pest-control': [
        'Fast and discreet control of insects and rodents',
        'Targeted preventive measures for long-term protection',
        'Certified pest control technicians with state-of-the-art equipment',
        'Safe, eco-friendly, and pet-friendly preparations'
      ],
      'waste-management': [
        'Professional disposal and clearing of cellars, attics, and apartments',
        'Eco-friendly recycling according to strict Swiss guidelines',
        'Speedy and broom-clean handover of all cleared premises',
        'Fair, transparent flat rates including all landfill fees'
      ],
      'car-detailing': [
        'Deep interior cleaning including upholstery shampoo',
        'Professional paint polishing and sealing',
        'Odor elimination using modern ozone treatment',
        'Value preservation of your vehicle (ideal before leasing return or sale)'
      ],
      'gutter-cleaning': [
        'Thorough cleaning of gutters and downpipes',
        'Prevention of water damage to facade and masonry',
        'Working with professional fall protection and state-of-the-art equipment',
        'Documented status report and condition assessment'
      ]
    },
    'fr': {
      'end-of-tenancy': [
        'Garantie de remise à 100% incluse (nous sommes responsables lors de la remise)',
        'Présence de notre responsable de nettoyage lors de la remise officielle',
        'Nettoyage professionnel selon les normes suisses les plus strictes',
        'Produits de nettoyage écologiques et biodégradables'
      ],
      'deep-cleaning': [
        'Nettoyage intensif de toutes les zones difficiles d’accès',
        'Élimination des saletés, du calcaire et des incrustations les plus tenaces',
        'Préservation de la valeur des sols, carrelages et robinetteries de qualité',
        'Traitement spécial doux selon le matériau de la surface'
      ],
      'daily-cleaning': [
        'Plan de nettoyage personnalisé (hebdomadaire, bimensuel ou flexible)',
        'Personnel de nettoyage fixe, de confiance et qualifié',
        'Assurance complète pour une sécurité maximale',
        'Facturation transparente sans engagement contractuel à long terme'
      ],
      'moving-furniture': [
        'Déménageurs expérimentés et véhicules de transport professionnels',
        'Démontage et remontage professionnels des meubles',
        'Transport soigné avec des matériaux d’emballage de pointe',
        'Assurance transport et responsabilité civile complète incluse'
      ],
      'gardening': [
        'Taille de haies, soin de la pelouse et désherbage professionnels',
        'Entretien saisonnier du jardin (nettoyage de printemps, évacuation des feuilles d’automne)',
        'Jardiniers expérimentés disposant de solides connaissances botaniques',
        'Élimination conforme des déchets verts'
      ],
      'exterior-cleaning': [
        'Nettoyage haute pression doux pour façades, terrasses et allées',
        'Élimination des algues, mousses, lichens et pollutions environnementales',
        'Valorisation et amélioration esthétique de votre bien immobilier',
        'Agents de nettoyage respectueux de l’environnement (biodégradables)'
      ],
      'pest-control': [
        'Lutte rapide et discrète contre les insectes et les rongeurs',
        'Mesures de prévention ciblées pour une protection à long terme',
        'Désinsectiseurs certifiés disposant d’équipements de pointe',
        'Préparations sûres, écologiques et adaptées aux animaux de compagnie'
      ],
      'waste-management': [
        'Débarras et élimination professionnels des caves, greniers et appartements',
        'Recyclage respectueux de l’environnement selon les directives suisses strictes',
        'Remise rapide et impeccable de tous les locaux débarrassés',
        'Tarifs forfaitaires justes et transparents, taxes de décharge incluses'
      ],
      'car-detailing': [
        'Nettoyage en profondeur de l’habitacle, shampooing des sièges inclus',
        'Polissage professionnel de la carrosserie et vitrification',
        'Élimination des odeurs par traitement moderne à l’ozone',
        'Préservation de la valeur de votre véhicule (idéal avant la restitution de leasing ou la vente)'
      ],
      'gutter-cleaning': [
        'Nettoyage minutieux des gouttières et des tuyaux de descente',
        'Prévention des dégâts des eaux sur la façade et la maçonnerie',
        'Travail avec antichute professionnel et équipement de pointe',
        'Rapport d’état documenté et contrôle de l’état'
      ]
    },
    'it': {
      'end-of-tenancy': [
        'Garanzia di consegna al 100% inclusa (siamo responsabili in fase di riconsegna)',
        'Presenza del nostro responsabile delle pulizie all’incontro ufficiale di consegna',
        'Pulizia professionale secondo i più severi standard svizzeri',
        'Prodotti per la pulizia ecologici e biodegradabili'
      ],
      'deep-cleaning': [
        'Pulizia intensiva di tutte le aree difficili da raggiungere',
        'Rimozione dello sporco più ostinato, calcare e incrostazioni',
        'Preservazione del valore di pavimenti, piastrelle e rubinetteria di pregio',
        'Trattamento speciale delicato a seconda del materiale della superficie'
      ],
      'daily-cleaning': [
        'Piano di pulizia personalizzato (settimanale, bisettimanale o flessibile)',
        'Personale di pulizia fisso, affidabile e qualificato',
        'Copertura assicurativa completa per la massima sicurezza',
        'Fatturazione trasparente senza vincoli contrattuali a lungo termine'
      ],
      'moving-furniture': [
        'Traslocatori esperti e veicoli di trasporto professionali',
        'Smontaggio e montaggio professionale di mobili',
        'Trasporto accurato con materiali di imballaggio all’avanguardia',
        'Assicurazione trasporto e responsabilità civile completa inclusa'
      ],
      'gardening': [
        'Potatura siepi, cura del prato e diserbo professionali',
        'Manutenzione stagionale del giardino (pulizie di primavera, smaltimento foglie autunnali)',
        'Giardinieri esperti con solide conoscenze botaniche',
        'Smaltimento corretto dei rifiuti verdi'
      ],
      'exterior-cleaning': [
        'Lavaggio idropulitrice delicato per facciate, terrazze e vialetti',
        'Rimozione di alghe, muschio, licheni e inquinamento atmosferico',
        'Preservazione del valore e valorizzazione estetica del vostro immobile',
        'Detergenti rispettosi dell’ambiente (biodegradabili)'
      ],
      'pest-control': [
        'Disinfestazione rapida e discreta di insetti e roditori',
        'Misure preventive mirate per una protezione a lungo termine',
        'Tecnici disinfestatori certificati con attrezzature all’avanguardia',
        'Preparati sicuri, ecologici e rispettosi degli animali domestici'
      ],
      'waste-management': [
        'Smaltimento e sgombero professionale di cantine, solai e appartamenti',
        'Riciclaggio ecologico secondo le rigide direttive svizzere',
        'Riconsegna rapida e pulita a fondo di tutti i locali sgomberati',
        'Tariffe forfettarie eque e trasparenti, incluse tutte le tasse di discarica'
      ],
      'car-detailing': [
        'Pulizia profonda degli interni con shampoo per tappezzeria',
        'Lucidatura professionale della vernice e sigillatura',
        'Eliminazione degli odori tramite moderno trattamento all’ozono',
        'Mantenimento del valore del veicolo (ideale prima della riconsegna del leasing o della vendita)'
      ],
      'gutter-cleaning': [
        'Pulizia accurata di grondaie e tubi pluviali',
        'Prevenzione di danni causati dall’acqua a facciate e muratura',
        'Lavori con protezione anticaduta professionale e attrezzature all’avanguardia',
        'Rapporto sullo stato documentato e verifica delle condizioni'
      ]
    },
    'es': {
      'end-of-tenancy': [
        'Garantía de entrega al 100% incluida (nos hacemos responsables en la entrega)',
        'Presencia de nuestro supervisor de limpieza en la entrega oficial',
        'Limpieza profesional según los estándares suizos más estrictos',
        'Productos de limpieza ecológicos y biodegradables'
      ],
      'deep-cleaning': [
        'Limpieza intensiva de todas las zonas de difícil acceso',
        'Eliminación de la suciedad más incrustada, cal y sarro',
        'Preservación del valor de suelos, azulejos y grifería de alta calidad',
        'Tratamiento especial suave según el material de la superficie'
      ],
      'daily-cleaning': [
        'Plan de limpieza personalizado (semanal, quincenal o flexible)',
        'Personal de limpieza fijo, de confianza y capacitado',
        'Cobertura de seguro completa para la máxima seguridad',
        'Facturación transparente sin contratos de larga duración'
      ],
      'moving-furniture': [
        'Mudanceros experimentados y vehículos de transporte profesionales',
        'Desmontaje y montaje profesional de muebles',
        'Transporte cuidadoso con materiales de embalaje de última generación',
        'Seguro de transporte y de responsabilidad civil completo incluido'
      ],
      'gardening': [
        'Recorte de setos, cuidado del césped y eliminación de malezas profesionales',
        'Mantenimiento estacional del jardín (limpieza de primavera, recogida de hojas de otoño)',
        'Jardineros experimentados con sólidos conocimientos botánicos',
        'Eliminación adecuada de residuos verdes'
      ],
      'exterior-cleaning': [
        'Limpieza suave a alta presión para fachadas, terrazas y caminos',
        'Eliminación de algas, musgo, líquenes y contaminación ambiental',
        'Preservación del valor y mejora estética de su propiedad',
        'Productos de limpieza ecológicos (biodegradables)'
      ],
      'pest-control': [
        'Control rápido y discreto de insectos y roedores',
        'Medidas de prevención específicas para la protección a largo plazo',
        'Técnicos de control de plagas certificados con equipos de última generación',
        'Preparados seguros, respetuosos con el medio ambiente y las mascotas'
      ],
      'waste-management': [
        'Desalojo y eliminación profesional de sótanos, desvanes y viviendas',
        'Reciclaje ecológico según las estrictas directrices suizas',
        'Entrega rápida y completamente limpia de todos los locales desalojados',
        'Tarifas planas justas y transparentes que incluyen todas las tasas de vertedero'
      ],
      'car-detailing': [
        'Limpieza profunda del interior que incluye champú para tapicería',
        'Pulido y sellado profesional de pintura',
        'Eliminación de olores mediante tratamiento moderno con ozono',
        'Preservación del valor del vehículo (ideal antes de devolución de leasing o venta)'
      ],
      'gutter-cleaning': [
        'Limpieza profunda de canaletas y bajantes',
        'Prevención de daños por agua en fachadas y mampostería',
        'Trabajo con protección anticaídas profesional y equipos de última generación',
        'Informe de estado documentado y verificación de condiciones'
      ]
    },
    'pt': {
      'end-of-tenancy': [
        'Garantia de entrega a 100% incluída (assumimos total responsabilidade na entrega)',
        'Presença do nosso supervisor de limpeza na entrega oficial',
        'Limpeza profissional de acordo com as normas suíças mais rigorosas',
        'Produtos de limpeza ecológicos e biodegradáveis'
      ],
      'deep-cleaning': [
        'Limpeza intensiva de todas as áreas de difícil acesso',
        'Remoção da sujidade mais persistente, calcário e incrustações',
        'Preservação do valor de pavimentos, azulejos e torneiras de alta qualidade',
        'Tratamento especial suave de acordo com o material da superfície'
      ],
      'daily-cleaning': [
        'Plano de limpeza personalizado (semanal, quinzenal ou flexível)',
        'Equipa de limpeza fixa, de confiança e qualificada',
        'Cobertura de seguro total para máxima segurança',
        'Faturação transparente sem fidelização contratual de longo prazo'
      ],
      'moving-furniture': [
        'Profissionais de mudanças experientes e veículos de transporte adequados',
        'Desmontagem e montagem profissional de mobiliário',
        'Transporte cuidadoso com materiais de embalamento de última geração',
        'Seguro de transporte e responsabilidade civil abrangente incluído'
      ],
      'gardening': [
        'Poda profissional de sebes, tratamento de relva e eliminação de ervas daninhas',
        'Manutenção sazonal do jardim (limpeza de primavera, recolha de folhas de outono)',
        'Jardineiros experientes com conhecimentos botânicos sólidos',
        'Eliminação ecológica adequada de resíduos verdes'
      ],
      'exterior-cleaning': [
        'Limpeza suave a alta pressão para fachadas, terraços e caminhos',
        'Remoção de algas, musgos, líquenes e resíduos de poluição',
        'Preservação do valor e valorização estética do seu imóvel',
        'Agentes de limpeza amigos do ambiente (biodegradáveis)'
      ],
      'pest-control': [
        'Combate rápido e discreto a insetos e roedores',
        'Medidas preventivas focadas para proteção de longo prazo',
        'Técnicos de controlo de pragas certificados com equipamentos de ponta',
        'Preparações seguras, amigas do ambiente e dos animais de estimação'
      ],
      'waste-management': [
        'Remoção e desocupação profissional de caves, sótãos e habitações',
        'Reciclagem ecológica de acordo com as diretrizes suíças estritas',
        'Entrega rápida e totalmente limpa de todos os espaços desocupados',
        'Tarifas fixas e transparentes que incluem as taxas de aterro sanitário'
      ],
      'car-detailing': [
        'Limpeza profunda de interiores com aplicação de champô em estofos',
        'Polimento e selagem profissional da pintura',
        'Eliminação de odores através de tratamento moderno com ozono',
        'Preservação do valor do seu veículo (ideal antes de entrega de leasing ou venda)'
      ],
      'gutter-cleaning': [
        'Limpeza meticulosa de caleiras e canos de descarga',
        'Prevenção de infiltrações de água na fachada e paredes',
        'Trabalho com proteção antiqueda profissional e equipamentos modernos',
        'Relatório de diagnóstico documentado e verificação de condições'
      ]
    }
  };

  const defaultGerman: Record<string, string[]> = {
    'end-of-tenancy': [
      '100% Abgabegarantie inklusive (wir haften bei der Übergabe)',
      'Präsenz unserer Reinigungsleitung beim offiziellen Übergabetermin',
      'Professionelle Reinigung nach strengsten Schweizer Standards',
      'Umweltfreundliche, biologisch abbaubare Reinigungsmittel'
    ],
    'deep-cleaning': [
      'Intensive Reinigung aller schwer zugänglichen Bereiche',
      'Entfernung hartnäckigster Verschmutzungen, Kalk und Verkrustungen',
      'Werterhalt von hochwertigen Böden, Fliesen und Armaturen',
      'Schonende Spezialbehandlung je nach Oberflächenmaterial'
    ],
    'daily-cleaning': [
      'Individueller Reinigungsplan (wöchentlich, zweiwöchentlich oder flexibel)',
      'Feste, vertrauenswürdige und geschulte Reinigungskräfte',
      'Volle Versicherung für maximale Sicherheit',
      'Transparente Abrechnung ohne langfristige Vertragsbindung'
    ],
    'moving-furniture': [
      'Erfahrene Umzugshelfer und professionelle Transportfahrzeuge',
      'Fachgerechte Demontage und Montage von Möbeln',
      'Schonender Transport mit modernstem Verpackungsmaterial',
      'Vollständige Transport- und Haftpflichtversicherung inklusive'
    ],
    'gardening': [
      'Fachgerechter Heckenschnitt, Rasenpflege und Unkrautbeseitigung',
      'Saisonale Gartenpflege (Frühlingsputz, Herbstlaub-Entsorgung)',
      'Erfahrene Gärtner mit fundiertem botanischem Fachwissen',
      'Fachgerechte Entsorgung von Grünabfällen'
    ],
    'exterior-cleaning': [
      'Schonende Hochdruckreinigung für Fassaden, Terrassen und Wege',
      'Entfernung von Algen, Moos, Flechten und Umweltverschmutzungen',
      'Werterhalt und optische Aufwertung Ihrer Immobilie',
      'Umweltschonende Reinigungsmittel (biologisch abbaubar)'
    ],
    'pest-control': [
      'Schnelle und diskrete Bekämpfung von Insekten und Nagetieren',
      'Gezielte Präventionsmassnahmen zur langfristigen Abwehr',
      'Zertifizierte Schädlingsbekämpfer mit modernster Ausrüstung',
      'Sichere, umweltschonende und haustierfreundliche Präparate'
    ],
    'waste-management': [
      'Fachgerechte Entsorgung und Räumung von Kellern, Estrichen und Wohnungen',
      'Umweltfreundliches Recycling nach strengsten Schweizer Richtlinien',
      'Speditive und besenreine Übergabe aller geräumten Räumlichkeiten',
      'Faire, transparente Pauschalpreise inklusive aller Deponiegebühren'
    ],
    'car-detailing': [
      'Tiefenreinigung des Innenraums inklusive Polstershampoo',
      'Professionelle Lackpolitur und Versiegelung',
      'Geruchseliminierung durch moderne Ozonbehandlung',
      'Werterhalt Ihres Fahrzeugs (ideal vor Leasingrückgabe oder Verkauf)'
    ],
    'gutter-cleaning': [
      'Gründliche Reinigung von Dachrinnen und Fallrohren',
      'Vermeidung von Wasserschäden an Fassade und Mauerwerk',
      'Arbeiten mit professioneller Absturzsicherung und modernster Ausrüstung',
      'Dokumentierter Statusbericht und Zustandsprüfung'
    ]
  };

  const list = (translations[lang] && translations[lang][serviceId]) || defaultGerman[serviceId] || [];
  if (cityId && cityName && serviceTitle) {
    const shuffledList = getDeterministicShuffle(list, cityId + "_" + serviceId + "_ben_shuf");
    return shuffledList.map((item, idx) => {
      let para = paraphraseText(item, cityId + "_" + serviceId + "_ben_" + idx, lang);
      return seedCityAndServiceIntoItem(para, idx, cityName, serviceTitle, lang, cityId + "_" + serviceId + "_ben_seed");
    });
  }
  return list;
};

const getLocalizedFaqs = (
  serviceId: string,
  lang: string,
  cityId?: string,
  cityName?: string,
  serviceTitle?: string
): { q: string; a: string }[] => {
  const translations: Record<string, Record<string, { q: string; a: string }[]>> = {
    'en': {
      'end-of-tenancy': [
        { q: 'What exactly does the handover guarantee mean?', a: 'If the property management is not satisfied with the cleanliness during the handover, we will re-clean immediately and free of charge. We are present throughout the entire handover process.' },
        { q: 'Are cleaning products and equipment included in the price?', a: 'Yes, all professional equipment, cleaning materials, and travel costs are already included in the fixed price. There are no hidden costs.' },
        { q: 'How far in advance should I book?', a: 'Dates at the end of the month are particularly popular. We recommend booking 2 to 4 weeks before the handover date. Express bookings are also possible depending on availability.' }
      ],
      'deep-cleaning': [
        { q: 'What is the difference between deep cleaning and standard cleaning?', a: 'While standard cleaning ensures regular cleanliness, deep cleaning focuses on the intensive care and cleaning of all surfaces, tile grout, inside appliances, and corners that are cleaned less frequently in everyday life.' },
        { q: 'What machines are used?', a: 'Depending on your needs, we use state-of-the-art single-disc machines, steam cleaners, wet vacuums, and professional extraction devices for carpets and upholstery.' }
      ],
      'daily-cleaning': [
        { q: 'Will I always have the same cleaner?', a: 'Yes. We focus on continuity and trust. You will be assigned a fixed cleaner. In case of vacation or illness, we can organize a qualified replacement upon request.' },
        { q: 'Do I need to be present during cleaning?', a: 'No, that is not necessary. Many of our clients hand over a key, which we manage with absolute security and encryption.' }
      ],
      'moving-furniture': [
        { q: 'Is my belongings insured during transport?', a: 'Yes, of course. All your furniture and boxes are fully insured against damage through our business liability and transport insurance.' },
        { q: 'Do you also provide moving boxes and packaging materials?', a: 'Yes. We can deliver high-quality packaging materials, protective films, and sturdy moving boxes in advance or bring them on the day of the move.' }
      ],
      'gardening': [
        { q: 'Do you bring your own tools?', a: 'Yes, our gardening team is fully equipped with professional tools, lawnmowers, hedge trimmers, and green waste bins. You do not need to provide anything.' },
        { q: 'What happens to the green waste?', a: 'We can collect, load, and dispose of all green waste professionally at a regional certified composting plant, so you do not have to worry about anything.' }
      ],
      'exterior-cleaning': [
        { q: 'Can pressure washing damage my facade?', a: 'No, we adjust the pressure and water temperature exactly to the surface material. For sensitive surfaces, we use the gentle "Soft-Wash" method with eco-friendly cleaning agents.' },
        { q: 'Do you need connection to water and electricity?', a: 'Yes, we usually require access to an outdoor water connection and standard power outlets. If these are not available, please let us know in advance so we can arrange solutions.' }
      ],
      'pest-control': [
        { q: 'Are the products used dangerous for pets or children?', a: 'No, we prioritize non-toxic traps, physical barriers, and eco-friendly preparations. If a stronger chemical treatment is absolutely necessary, our technicians will instruct you in detail on safety measures.' },
        { q: 'Is your service discreet?', a: 'Yes, absolutely. Our technicians arrive in neutral, unmarked vehicles and perform the intervention discreetly to protect your privacy and reputation.' }
      ],
      'waste-management': [
        { q: 'How do you calculate the price for clearance?', a: 'The price depends on the volume of waste (in cubic meters), the type of materials, and the accessibility of the rooms. We offer a transparent fixed price after a short description or photo review.' },
        { q: 'What materials do you accept?', a: 'We accept almost all materials, including old furniture, household items, electronic waste, wood, metals, and construction debris. Hazardous waste is handled according to strict safety regulations.' }
      ],
      'car-detailing': [
        { q: 'Is a detailing worth it before returning a leased vehicle?', a: 'Absolutely. Professional detailing removes signs of wear cost-effectively and often saves thousands of francs in deductions when returning the vehicle.' },
        { q: 'How long does a complete vehicle detailing take?', a: 'Depending on the package and dirt level, our team needs between 4 hours and a full day to achieve an optimal result.' }
      ],
      'gutter-cleaning': [
        { q: 'How often should a gutter be cleaned?', a: 'We recommend cleaning at least once a year, ideally in late autumn after the leaves have fallen, to prevent blockages during the winter.' },
        { q: 'Do you have to climb onto the roof for this?', a: 'Depending on building height and accessibility, we work with safe ladders, modern telescopic suction systems from the ground, or professional fall protection directly on the roof.' }
      ]
    },
    'fr': {
      'end-of-tenancy': [
        { q: 'Que signifie exactement la garantie de remise ?', a: 'Si la gérance n’est pas satisfaite de la propreté lors de l’état des lieux, nous nettoyons à nouveau immédiatement et gratuitement. Nous sommes présents pendant toute la durée de la remise.' },
        { q: 'Les produits et appareils de nettoyage sont-ils inclus dans le prix ?', a: 'Oui, tous les appareils professionnels, les produits de nettoyage ainsi que les frais de déplacement sont déjà inclus dans le prix fixe. Il n’y a aucun coût caché.' },
        { q: 'Combien de temps à l’avance dois-je réserver ?', a: 'Les dates de fin de mois sont particulièrement demandées. Nous vous conseillons de réserver 2 à 4 semaines à l’avance. Des réservations express sont également possibles selon les disponibilités.' }
      ],
      'deep-cleaning': [
        { q: 'Quelle est la différence entre un nettoyage en profondeur et un nettoyage ordinaire ?', a: 'Alors que l’entretien régulier assure la propreté quotidienne, le nettoyage en profondeur cible le traitement intensif de toutes les surfaces, joints, intérieur des appareils et recoins moins souvent nettoyés.' },
        { q: 'Quelles machines utilisez-vous ?', a: 'Selon les besoins, nous utilisons des monobrosses de pointe, des nettoyeurs vapeur, des aspirateurs eau et poussière et des injecteurs-extracteurs professionnels pour tapis et canapés.' }
      ],
      'daily-cleaning': [
        { q: 'Aurais-je toujours la même personne de ménage ?', a: 'Oui. Nous privilégions la continuité et la confiance. Une personne fixe vous est attribuée. En cas de vacances ou maladie, nous organisons un remplacement sur demande.' },
        { q: 'Dois-je être présent pendant le nettoyage ?', a: 'Non, ce n’est pas nécessaire. De nombreux clients nous confient un double des clés, que nous gérons de manière hautement sécurisée et codée.' }
      ],
      'moving-furniture': [
        { q: 'Mes biens sont-ils assurés pendant le transport ?', a: 'Oui, bien sûr. Tous vos biens sont intégralement couverts contre les dommages par notre assurance responsabilité civile professionnelle et transport.' },
        { q: 'Fournissez-vous également des cartons et du matériel d’emballage ?', a: 'Oui. Nous pouvons vous livrer à l’avance du matériel d’emballage de qualité, des films de protection et des cartons solides, ou les apporter le jour du déménagement.' }
      ],
      'gardening': [
        { q: 'Apportez-vous vos propres outils ?', a: 'Oui, notre équipe de jardinage arrive entièrement équipée avec des outils professionnels, tondeuses, taille-haies et bacs à déchets verts. Vous n’avez rien à fournir.' },
        { q: 'Qu’advient-il des déchets verts ?', a: 'Nous collectons, chargeons et éliminons tous les déchets verts de manière professionnelle dans un centre de compostage régional agréé, vous libérant de tout souci.' }
      ],
      'exterior-cleaning': [
        { q: 'Le nettoyage haute pression peut-il endommager ma façade ?', a: 'Non, nous adaptons précisément la pression et la température de l’eau au matériau. Pour les surfaces délicates, nous appliquons la méthode douce "Soft-Wash" avec des produits écoresponsables.' },
        { q: 'Avez-vous besoin d’un raccordement d’eau et d’électricité ?', a: 'Oui, nous avons généralement besoin d’un accès à un robinet extérieur et à des prises électriques standards. Si ce n’est pas disponible, prévenez-nous pour que nous trouvions une solution.' }
      ],
      'pest-control': [
        { q: 'Les produits utilisés sont-ils dangereux pour les enfants ou les animaux ?', a: 'Non, nous privilégions les pièges non toxiques, les barrières physiques et les préparations écologiques. Si un produit chimique fort est indispensable, nos techniciens vous expliqueront les précautions de sécurité.' },
        { q: 'Votre service est-il discret ?', a: 'Oui, absolument. Nos techniciens interviennent à bord de véhicules neutres et non marqués, effectuant leur travail avec la plus grande discrétion pour préserver votre vie privée et réputation.' }
      ],
      'waste-management': [
        { q: 'Comment calculez-vous le prix d’un débarras ?', a: 'Le prix dépend du volume en mètres cubes, de la nature des objets et de l’accessibilité des pièces. Nous vous proposons un prix fixe transparent après description ou photos.' },
        { q: 'Quels objets acceptez-vous ?', a: 'Nous acceptons presque tout : vieux meubles, objets ménagers, déchets électroniques, bois, métaux et gravats. Les déchets spéciaux sont traités selon les normes de sécurité en vigueur.' }
      ],
      'car-detailing': [
        { q: 'Est-il utile de faire une préparation avant de rendre un véhicule en leasing ?', a: 'Absolument. Un nettoyage professionnel élimine les traces d’usure à moindre coût et permet souvent d’éviter des milliers de francs de pénalités lors de la restitution.' },
        { q: 'Combien de temps prend une préparation complète du véhicule ?', a: 'Selon la formule choisie et le niveau de saleté, notre équipe a besoin de 4 heures à une journée entière pour un résultat parfait.' }
      ],
      'gutter-cleaning': [
        { q: 'À quelle fréquence faut-il nettoyer les gouttières ?', a: 'Le nettoyage est conseillé au moins une fois par an, idéalement à la fin de l’automne après la chute des feuilles, pour éviter les obstructions hivernales.' },
        { q: 'Devez-vous monter sur le toit pour cela ?', a: 'Selon la hauteur et l’accès, nous travaillons à l’aide d’échelles sécurisées, de systèmes d’aspiration télescopiques depuis le sol ou d’un équipement antichute directement sur le toit.' }
      ]
    },
    'it': {
      'end-of-tenancy': [
        { q: 'Cosa significa esattamente la garanzia di consegna ?', a: 'Se l’amministrazione non è soddisfatta della pulizia durante l’ispezione di riconsegna, provvediamo a pulire nuovamente subito e gratuitamente. Siamo presenti per tutta la durata della consegna.' },
        { q: 'I prodotti e gli attrezzi per la pulizia sono inclusi nel prezzo ?', a: 'Sì, tutte le attrezzature professionali, i detergenti e i costi di trasferta sono inclusi nel prezzo fisso. Non ci sono costi nascosti.' },
        { q: 'Quanto tempo prima devo prenotare ?', a: 'Le date a fine mese sono molto richieste. Consigliamo di prenotare da 2 a 4 settimane prima. Prenotazioni espresse sono possibili in base alla disponibilità.' }
      ],
      'deep-cleaning': [
        { q: 'Qual è la differenza tra pulizia profonda e manutenzione ordinaria ?', a: 'Mentre la pulizia ordinaria garantisce l’igiene quotidiana, la pulizia profonda si occupa della cura intensiva di tutte le superfici, fughe, interno degli elettrodomestici e angoli meno trattati nel quotidiano.' },
        { q: 'Quali macchine vengono utilizzate ?', a: 'A seconda delle esigenze utilizziamo monospazzole all’avanguardia, pulitori a vapore, aspiraliquidi e macchine professionali a estrazione per tappeti e divani.' }
      ],
      'daily-cleaning': [
        { q: 'Avrò sempre la stessa addetta alle pulizie ?', a: 'Sì. Puntiamo sulla continuità e sulla fiducia. Vi verrà assegnata un’addetta fissa. In caso di ferie o malattia, organizziamo un sostituto qualificato su richiesta.' },
        { q: 'Devo essere presente durante la pulizia ?', a: 'No, non è necessario. Molti dei nostri clienti ci affidano le chiavi, che gestiamo in modo codificato e assolutamente sicuro.' }
      ],
      'moving-furniture': [
        { q: 'I miei beni sono assicurati durante il trasporto ?', a: 'Sì, certamente. Tutti i mobili e le scatole sono interamente protetti da danni tramite la nostra assicurazione di responsabilità civile aziendale e di trasporto.' },
        { q: 'Fornite anche scatole da trasloco e materiale da imballaggio ?', a: 'Sì. Possiamo consegnare in anticipo materiali da imballaggio di alta qualità, pellicole protettive e scatole robuste o portarli il giorno del trasloco.' }
      ],
      'gardening': [
        { q: 'Portate la vostra attrezzatura ?', a: 'Sì, il nostro team arriva munito di attrezzi professionali, tosaerba, tagliasiepi e contenitori per rifiuti verdi. Non dovrete fornire nulla.' },
        { q: 'Cosa succede ai rifiuti verdi ?', a: 'Raccogliamo e smaltiamo professionalmente tutti gli scarti di giardinaggio presso un impianto regionale di compostaggio autorizzato, liberandovi da ogni pensiero.' }
      ],
      'exterior-cleaning': [
        { q: 'L’idropulitrice può danneggiare la mia facciata ?', a: 'No, regoliamo la pressione e la temperatura dell’acqua in base al materiale della superficie. Per pareti o pavimenti delicati utilizziamo il metodo "Soft-Wash" con detergenti biologici.' },
        { q: 'Avete bisogno di allacciamento per acqua ed elettricità ?', a: 'Sì, di solito richiediamo l’accesso a un rubinetto esterno e a prese di corrente standard. Se non disponibili, avvisateci in anticipo per concordare una soluzione.' }
      ],
      'pest-control': [
        { q: 'I prodotti utilizzati sono pericolosi per bambini o animali domestici ?', a: 'No, prediligiamo esche non tossiche, barriere fisiche e formule ecologiche. Se si rende necessario un trattamento chimico forte, i nostri tecnici vi istruiranno dettagliatamente sulle misure di sicurezza.' },
        { q: 'Il vostro servizio è discreto ?', a: 'Sì, assolutamente. I nostri tecnici intervengono con veicoli neutri senza loghi ed eseguono il lavoro in modo discreto per tutelare la vostra privacy.' }
      ],
      'waste-management': [
        { q: 'Come viene calcolato il prezzo per uno sgombero ?', a: 'Il prezzo dipende dal volume (in metri cubi), dalla tipologia di materiali e dall’accessibilità dei locali. Forniamo un prezzo fisso trasparente dopo una breve descrizione o foto.' },
        { q: 'Quali materiali accettate ?', a: 'Accettiamo quasi tutto: vecchi mobili, elettrodomestici, rifiuti elettronici, legno, metalli e macerie. I rifiuti speciali vengono gestiti secondo le severe norme di sicurezza vigenti.' }
      ],
      'car-detailing': [
        { q: 'Vale la pena fare una pulizia approfondita prima di restituire un’auto a fine leasing ?', a: 'Assolutamente sì. Un detailing professionale elimina i segni d’usura a costi contenuti, facendovi risparmiare spesso migliaia di franchi di penali in fase di restituzione.' },
        { q: 'Quanto tempo richiede la pulizia completa del veicolo ?', a: 'A seconda del pacchetto e dello stato dell’auto, il nostro team richiede da un minimo di 4 ore a una giornata intera per un risultato impeccabile.' }
      ],
      'gutter-cleaning': [
        { q: 'Ogni quanto tempo vanno pulite le grondaie ?', a: 'Consigliamo la pulizia almeno una volta all’anno, preferibilmente a fine autunno dopo la caduta delle foglie, per prevenire ostruzioni e ghiaccio durante l’inverno.' },
        { q: 'Dovete salire sul tetto per effettuare la pulizia ?', a: 'A seconda dell’altezza dell’edificio, utilizziamo scale di sicurezza, moderni sistemi di aspirazione telescopici da terra o imbracature anticaduta direttamente sul tetto.' }
      ]
    },
    'es': {
      'end-of-tenancy': [
        { q: '¿Qué significa exactamente la garantía de entrega?', a: 'Si la administración no queda satisfecha con la limpieza en la entrega, volveremos a limpiar de forma gratuita e inmediata. Estamos presentes durante todo el proceso de entrega.' },
        { q: '¿Los productos y equipos de limpieza están incluidos en el precio?', a: 'Sí, todas las herramientas profesionales, los productos de limpieza y los costes de desplazamiento ya están incluidos en el precio fijo. No hay costes ocultos.' },
        { q: '¿Con cuánta antelación debo reservar?', a: 'Las fechas de fin de mes son muy solicitadas. Recomendamos reservar de 2 a 4 semanas antes de la entrega. Las reservas urgentes también son posibles según disponibilidad.' }
      ],
      'deep-cleaning': [
        { q: '¿Cuál es la diferencia entre una limpieza profunda y una limpieza estándar?', a: 'Mientras que la limpieza estándar asegura el mantenimiento regular, la limpieza profunda se enfoca en el cuidado intensivo de todas las superficies, juntas, interior de electrodomésticos y rincones que se limpian con menos frecuencia.' },
        { q: '¿Qué maquinaria se utiliza?', a: 'Según las necesidades, utilizamos máquinas rotativas de última generación, limpiadores de vapor, aspiradores de agua y equipos de inyección-extracción profesional para alfombras y tapicerías.' }
      ],
      'daily-cleaning': [
        { q: '¿Tendré siempre a la misma persona de limpieza?', a: 'Sí. Apostamos por la continuidad y la confianza. Se le asignará un limpiador fijo. En caso de vacaciones o enfermedad, organizamos un sustituto calificado a petición.' },
        { q: '¿Debo estar presente durante la limpieza?', a: 'No, no es necesario. Muchos de nuestros clientes nos confían una llave, que gestionamos de forma codificada y con absoluta seguridad.' }
      ],
      'moving-furniture': [
        { q: '¿Están asegurados mis bienes durante el transporte?', a: 'Sí, por supuesto. Todos sus muebles y cajas están totalmente asegurados contra daños a través de nuestro seguro de transporte y responsabilidad civil empresarial.' },
        { q: '¿También proporcionan cajas de mudanza y material de embalaje?', a: 'Sí. Podemos entregarle materiales de embalaje de alta calidad, películas protectoras y cajas de mudanza resistentes por adelantado o traerlos el día de la mudanza.' }
      ],
      'gardening': [
        { q: '¿Traen sus propias herramientas?', a: 'Sí, nuestro equipo de jardinería viene completamente equipado con herramientas profesionales, cortacéspedes, cortasetos y contenedores para residuos verdes. No necesita facilitar nada.' },
        { q: '¿Qué sucede con los residuos verdes?', a: 'Recogemos y eliminamos profesionalmente todos los residuos de jardinería en una planta de compostaje regional autorizada, liberándole de cualquier preocupación.' }
      ],
      'exterior-cleaning': [
        { q: '¿El lavado a presión puede dañar mi fachada?', a: 'No, adaptamos la presión y la temperatura del agua exactamente al material de la superficie. Para superficies delicadas, aplicamos el método suave "Soft-Wash" con limpiadores ecológicos.' },
        { q: '¿Necesitan conexión de agua y electricidad?', a: 'Sí, normalmente requerimos acceso a un grifo exterior y tomas de corriente estándar. Si no dispone de ellos, avísenos con antelación para acordar soluciones.' }
      ],
      'pest-control': [
        { q: '¿Los productos utilizados son peligrosos para niños o mascotas?', a: 'No, priorizamos trampas no tóxicas, barreras físicas y fórmulas ecológicas. Si se requiere un tratamiento químico fuerte, nuestros técnicos le instruirán detalladamente sobre las medidas de seguridad.' },
        { q: '¿Es discreto su servicio?', a: 'Sí, absolutamente. Nuestros técnicos intervienen con vehículos neutros sin logotipos y realizan el trabajo de forma discreta para proteger su privacidad y reputación.' }
      ],
      'waste-management': [
        { q: '¿Cómo calculan el precio de un desalojo?', a: 'El precio depende del volumen (en metros cúbicos), del tipo de materiales y de la accesibilidad de las estancias. Ofrecemos un precio fijo transparente tras una descripción o fotos.' },
        { q: '¿Qué materiales aceptan?', a: 'Aceptamos casi todo: muebles viejos, enseres domésticos, residuos electrónicos, madera, metales y escombros. Los residuos especiales se gestionan según las estrictas normas de seguridad vigentes.' }
      ],
      'car-detailing': [
        { q: '¿Vale la pena una limpieza profunda antes de devolver un coche de leasing?', a: 'Absolutamente. El detallado profesional elimina los signos de desgaste a un precio económico y suele ahorrar miles de francos en penalizaciones en la entrega.' },
        { q: '¿Cuánto tiempo tarda un detallado de vehículo completo?', a: 'Según el paquete y el nivel de suciedad, nuestro equipo necesita entre 4 horas y un día entero para lograr un resultado óptimo.' }
      ],
      'gutter-cleaning': [
        { q: '¿Con qué frecuencia deben limpiarse las canaletas?', a: 'Recomendamos la limpieza al menos una vez al año, idealmente a finales de otoño tras la caída de las hojas, para evitar obstrucciones y problemas en invierno.' },
        { q: '¿Tienen que subir al tejado para ello?', a: 'Según la altura del edificio y el acceso, trabajamos con escaleras de seguridad, modernos sistemas de aspiración telescópicos desde el suelo o arneses anticaídas directamente en el tejado.' }
      ]
    },
    'pt': {
      'end-of-tenancy': [
        { q: 'O que significa exatamente a garantia de entrega?', a: 'Se a administração não ficar satisfeita com a limpeza na entrega, voltaremos a limpar gratuitamente e de imediato. Estamos presentes durante todo o processo de entrega.' },
        { q: 'Os produtos e equipamentos de limpeza estão incluídos no preço?', a: 'Sim, todas as ferramentas profissionais, produtos de limpeza e despesas de deslocação já estão incluídos no preço fixo. Sem custos ocultos.' },
        { q: 'Com que antecedência devo reservar?', a: 'As datas de fim de mês são muito concorridas. Recomendamos reservar 2 a 4 semanas antes da data de entrega. Reservas urgentes também são possíveis dependendo da disponibilidade.' }
      ],
      'deep-cleaning': [
        { q: 'Qual é a diferença entre uma limpeza profunda e uma limpeza padrão?', a: 'Enquanto que a limpeza padrão garante a manutenção regular, a limpeza profunda foca-se no cuidado intensivo de todas as superfícies, juntas, interior de eletrodomésticos e cantos que raramente são limpos.' },
        { q: 'Que maquinaria utilizam?', a: 'Conforme as necessidades, utilizamos máquinas rotativas de última geração, limpadores a vapor, aspiradores de água e equipamentos de injeção-extração profissional para carpetes e estofos.' }
      ],
      'daily-cleaning': [
        { q: 'Terei sempre a mesma pessoa de limpeza?', a: 'Sim. Apostamos na continuidade e na confiança. Ser-lhe-á atribuído um profissional fixo. Em caso de férias ou doença, organizamos um substituto qualificado a seu pedido.' },
        { q: 'Preciso de estar presente durante a limpeza?', a: 'Não, não é necessário. Muitos dos nossos clientes confiam-nos uma chave, que gerimos de forma codificada e com total segurança.' }
      ],
      'moving-furniture': [
        { q: 'Os meus bens estão seguros durante o transporte?', a: 'Sim, claro. Todos os seus móveis e caixas estão totalmente protegidos contra danos através do nosso seguro de transporte e responsabilidade civil empresarial.' },
        { q: 'Também fornecem caixas de cartão e material de embalagem?', a: 'Sim. Podemos entregar previamente materiais de embalamento de alta qualidade, películas de proteção e caixas estáveis, ou trazê-los no dia das mudanças.' }
      ],
      'gardening': [
        { q: 'Trazem as vossas próprias ferramentas?', a: 'Sim, a nossa equipa vem totalmente equipada com ferramentas profissionais, cortadores de relva, corta-sebes e recipientes para resíduos verdes. Não precisa de fornecer nada.' },
        { q: 'O que acontece aos resíduos verdes?', a: 'Recolhemos, carregamos e eliminamos profissionalmente todos os resíduos de jardinagem numa central de compostagem regional autorizada, para que não tenha de se preocupar com nada.' }
      ],
      'exterior-cleaning': [
        { q: 'A lavagem a alta pressão pode danificar a minha fachada?', a: 'Não, adaptamos a pressão e a temperatura da água exatamente ao material da superfície. Para superfícies delicadas, aplicamos o método suave "Soft-Wash" com produtos amigos do ambiente.' },
        { q: 'Precisam de ligação de água e eletricidade?', a: 'Sim, normalmente necessitamos de acesso a uma torneira exterior e tomadas elétricas padrão. Se não os tiver, avise-nos com antecedência para acordar soluções.' }
      ],
      'pest-control': [
        { q: 'Os produtos utilizados são perigosos para crianças ou animais?', a: 'Não, priorizamos armadilhas não tóxicas, barreiras físicas e fórmulas biológicas. Se for necessário um tratamento químico forte, os nossos técnicos dar-lhe-ão todas as indicações de segurança.' },
        { q: 'O vosso serviço é discreto?', a: 'Sim, totalmente. Os nossos técnicos intervêm com veículos neutros sem logótipos e realizam o trabalho de forma discreta para salvaguardar a sua privacidade.' }
      ],
      'waste-management': [
        { q: 'Como calculam o preço de uma desocupação?', a: 'O preço depende do volume (in metros cúbicos), do tipo de materiais e da acessibilidade dos locais. Oferecemos um preço fixo transparente após uma breve descrição ou partilha de fotos.' },
        { q: 'Que materiais aceitam?', a: 'Aceitamos quase tudo: móveis antigos, eletrodomésticos, resíduos eletrónicos, madeira, metais e entulho. Os resíduos especiais são tratados de acordo com as estritas normas de segurança em vigor.' }
      ],
      'car-detailing': [
        { q: 'Vale a pena uma limpeza profunda antes de devolver um automóvel de leasing?', a: 'Absolutamente. O detalhe profissional elimina os sinais de desgaste a um custo económico, permitindo-lhe muitas vezes poupar milhares de francos em penalizações na entrega.' },
        { q: 'Como demora um detalhe de veículo completo?', a: 'Dependendo do pacote e do nível de sujidade, a nossa equipa precisa de 4 horas a um dia inteiro para obter um resultado perfeito.' }
      ],
      'gutter-cleaning': [
        { q: 'Com que frequência devem ser limpos os algerozes?', a: 'Recomendamos a limpeza pelo menos uma vez por ano, idealmente no final do outono após a queda das folhas, para evitar obstruções e problemas durante o inverno.' },
        { q: 'Têm de subir ao telhado para efetuar a limpeza?', a: 'Dependendo da altura do edifício e do acesso, trabalhamos com escadas de segurança, modernos sistemas de aspiração telescópicos a partir do solo ou arnês antiqueda diretamente no telhado.' }
      ]
    }
  };

  const defaultGerman: Record<string, { q: string; a: string }[]> = {
    'end-of-tenancy': [
      { q: 'Was bedeutet die Abgabegarantie genau?', a: 'Sollte die Verwaltung bei der Wohnungsübergabe mit der Sauberkeit nicht zufrieden sein, reinigen wir kostenlos und unverzüglich nach. Wir sind während der gesamten Übergabe vor Ort.' },
      { q: 'Sind Reinigungsmittel und Geräte im Preis inbegriffen?', a: 'Ja, sämtliche professionellen Geräte, Reinigungsmittel sowie die Anfahrtskosten sind im Festpreis bereits enthalten. Es gibt keine versteckten Kosten.' },
      { q: 'Wie lange im Voraus sollte ich buchen?', a: 'Besonders an Monatsenden sind die Termine begehrt. Wir empfehlen eine Buchung 2 bis 4 Wochen vor dem Übergabetermin. Express-Buchungen sind bei Verfügbarkeit ebenfalls möglich.' }
    ],
    'deep-cleaning': [
      { q: 'Was unterscheidet eine Spezialreinigung von der Unterhaltsreinigung?', a: 'Während die Unterhaltsreinigung die regelmässige Sauberkeit sichert, befasst sich die Spezialreinigung mit der intensiven Tiefenpflege aller Oberflächen, Fugen, Geräteinnenseiten und Ecken, die im Alltag seltener gereinigt werden.' },
      { q: 'Welche Maschinen kommen zum Einsatz?', a: 'Je nach Bedarf nutzen wir modernste Einscheibenmaschinen, Dampfreiniger, Nasssauger und professionelle Extraktionsgeräte für Teppiche und Polster.' }
    ],
    'daily-cleaning': [
      { q: 'Habe ich immer die gleiche Reinigungskraft?', a: 'Ja. Wir setzen auf Kontinuität und Vertrauen. Sie erhalten eine feste Reinigungskraft zugeteilt. Im Urlaubs- oder Krankheitsfall organisieren wir auf Wunsch eine qualifizierte Vertretung.' },
      { q: 'Muss ich während der Reinigung anwesend sein?', a: 'Nein, das ist nicht nötig. Viele unserer Kunden übergeben uns einen Schlüssel, den wir absolut sicher und codiert verwalten.' }
    ],
    'moving-furniture': [
      { q: 'Ist mein Hab und Gut während des Transports versichert?', a: 'Ja, selbstverständlich. All Ihre Möbel und Kartons sind über unsere Betriebshaftpflicht- und Transportversicherung vollumfänglich gegen Schäden abgesichert.' },
      { q: 'Stellen Sie auch Umzugskartons und Verpackungsmaterial?', a: 'Ja. Wir können Ihnen hochwertiges Verpackungsmaterial, Schutzfolien und stabile Zügelkartons im Voraus liefern oder am Umzugstag mitbringen.' }
    ],
    'gardening': [
      { q: 'Bringen Sie Ihre eigenen Geräte mit?', a: 'Ja, unser Gartenteam ist voll ausgestattet mit professionellen Geräten, Rasenmähern, Heckenscheren und Grünabfall-Behältern. Sie müssen nichts bereitstellen.' },
      { q: 'Was geschieht mit den Gartenabfällen?', a: 'Wir sammeln, verladen und entsorgen sämtliche Gartenabfälle fachgerecht bei einer regionalen Grüngut-Deponie, sodass für Sie keinerlei Aufwand entsteht.' }
    ],
    'exterior-cleaning': [
      { q: 'Kann die Hochdruckreinigung meine Fassade beschädigen?', a: 'Nein, wir stimmen den Wasserdruck und die Temperatur exakt auf das jeweilige Oberflächenmaterial ab. Bei empfindlichen Oberflächen wenden wir das schonende "Soft-Wash"-Verfahren mit speziellen biologisch abbaubaren Reinigern an.' },
      { q: 'Benötigen Sie einen Wasser- und Stromanschluss?', a: 'Ja, in der Regel benötigen wir Zugang zu einem Aussenwasserhahn und einer Standard-Steckdose. Sollte dies nicht vorhanden sein, informieren Sie uns bitte im Voraus.' }
    ],
    'pest-control': [
      { q: 'Sind die eingesetzten Mittel gefährlich für Haustiere oder Kinder?', a: 'Nein, wir setzen primär auf ungiftige Barrieren, mechanische Fallen und umweltschonende Präparate. Sollte eine chemische Keule unumgänglich sein, informieren unsere Techniker Sie im Detail über Sicherheitsvorkehrungen.' },
      { q: 'Ist Ihr Einsatz diskret?', a: 'Ja, absolut. Unsere Techniker kommen in neutralen Servicefahrzeugen ohne auffällige Aufschriften und führen die Arbeit diskret durch, um Ihre Privatsphäre zu wahren.' }
    ],
    'waste-management': [
      { q: 'Wie berechnet sich der Preis für eine Räumung?', a: 'Der Preis hängt vom Volumen (in Kubikmetern), der Art der zu entsorgenden Gegenstände und der Zugänglichkeit ab. Wir bieten Ihnen nach einer kurzen Beschreibung oder Fotos einen fairen Festpreis.' },
      { q: 'Welche Gegenstände entsorgen Sie?', a: 'Wir entsorgen fast alles: von alten Möbeln über Hausrat, Elektroschrott, Holz, Metall bis hin zu Bauschutt. Sonderabfälle werden gemäss gesetzlichen Richtlinien fachgerecht entsorgt.' }
    ],
    'car-detailing': [
      { q: 'Lohnt sich eine Aufbereitung vor der Leasingrückgabe?', a: 'Absolut. Eine professionelle Fahrzeugaufbereitung behebt Gebrauchsspuren kostengünstig und spart bei der Rückgabe oft Tausende von Franken an Abzügen.' },
      { q: 'Wie lange dauert die komplette Fahrzeugaufbereitung?', a: 'Je nach Paket und Verschmutzungsgrad benötigt unser Team zwischen 4 Stunden und einem ganzen Tag für ein optimales Ergebnis.' }
    ],
    'gutter-cleaning': [
      { q: 'Wie oft sollte eine Dachrinne gereinigt werden?', a: 'Wir empfehlen eine Reinigung mindestens einmal jährlich, idealerweise im Spätherbst nach dem Laubabwurf, um Verstopfungen im Winter vorzubeugen.' },
      { q: 'Müssen Sie dafür auf das Dach steigen?', a: 'Je nach Gebäudehöhe und Zugänglichkeit arbeiten wir mit sicheren Leitern, modernen Teleskop-Absaugsystemen vom Boden aus oder professioneller Absturzsicherung direkt am Dach.' }
    ]
  };

  let list: { q: string; a: string }[] = [];

  if (lang === 'de' && SERVICE_SEO_CONTENT[serviceId.toLowerCase()]) {
    list = [...SERVICE_SEO_CONTENT[serviceId.toLowerCase()].faqs];
  } else {
    list = (translations[lang] && translations[lang][serviceId]) || defaultGerman[serviceId] || [];
  }

  if (cityId && cityName && serviceTitle) {
    const shuffledList = getDeterministicShuffle(list, cityId + "_" + serviceId + "_faq_shuf");
    return shuffledList.map((item, idx) => {
      let qPara = paraphraseText(item.q, cityId + "_" + serviceId + "_faq_q_" + idx, lang);
      let aPara = paraphraseText(item.a, cityId + "_" + serviceId + "_faq_a_" + idx, lang);

      if (idx % 2 === 0) {
        aPara = aPara.replace(new RegExp(serviceTitle, 'g'), `${serviceTitle} in ${cityName}`);
        aPara = seedCityAndServiceIntoItem(aPara, idx, cityName, serviceTitle, lang, cityId + "_" + serviceId + "_faq_seed");
      }

      return { q: qPara, a: aPara };
    });
  }

  return list;
};

const getUniqueWhyPartnerExplanation = (cityId: string, serviceId: string, lang: string, cityName: string, serviceName: string): string => {
  const getDeterministicHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const intros: Record<string, string[]> = {
    de: [
      "Als etablierter Dienstleister in {city} legen wir bei {service} allergrössten Wert auf absolute Exzellenz.",
      "Wer in {city} auf der Suche nach einer erstklassigen Ausführung für {service} ist, findet in uns den idealen Partner.",
      "Unser engagiertes Fachteam in {city} ist darauf spezialisiert, {service} mit höchster Gründlichkeit umzusetzen.",
      "Wir bringen langjährige Schweizer Branchenerfahrung direkt nach {city}, um {service} perfekt zu realisieren.",
      "Für Ihr Vorhaben rund um {service} in {city} bieten wir Ihnen massgeschneiderte und transparente Konzepte.",
      "Kraken PFM steht in {city} für herausragende Professionalität und kundenorientierte Lösungen im Bereich {service}.",
      "Wir verstehen die individuellen architektonischen und lokalen Bedürfnisse in {city} bei der Umsetzung von {service}.",
      "Ihr Vertrauen ist unser Antrieb: Deshalb bieten wir Ihnen in {city} einen unschlagbar zuverlässigen Service für {service}.",
      "Sauberkeit und Präzision sind unsere Markenzeichen, wenn wir in {city} für Sie {service} übernehmen.",
      "Mit Kraken PFM wählen Sie für {service} in {city} eine GAV-konforme Ausführung nach höchsten Standards.",
      "Erleben Sie eine stressfreie und professionelle Abwicklung von {service} direkt bei Ihnen vor Ort in {city}.",
      "Nachhaltigkeit und Effizienz prägen jede unserer Tätigkeiten, wenn wir in {city} {service} durchführen."
    ],
    en: [
      "As an established service provider in {city}, we place the absolute highest value on excellence when performing {service}.",
      "Anyone in {city} looking for first-class execution for {service} will find us to be the ideal partner.",
      "Our dedicated specialist team in {city} is highly trained to implement {service} with the utmost thoroughness.",
      "We bring many years of Swiss industry experience directly to {city} to perfectly realize {service}.",
      "For your project involving {service} in {city}, we offer tailor-made and transparent concepts.",
      "In {city}, Kraken PFM stands for outstanding professionalism and customer-oriented solutions for {service}.",
      "We understand the individual architectural and local needs in {city} when executing {service}.",
      "Your trust is our motivation, which is why we offer an outstandingly reliable service for {service} in {city}.",
      "Cleanliness and precision are our trademarks when we take care of {service} for you in {city}.",
      "With Kraken PFM, you choose a GAV-compliant execution of {service} in {city} to the highest standards.",
      "Experience stress-free and professional handling of {service} directly at your location in {city}.",
      "Sustainability and efficiency characterize our actions on every assignment of {service} in {city}."
    ],
    es: [
      "Como proveedor de servicios consolidado en {city}, otorgamos el máximo valor a la excelencia al realizar {service}.",
      "Cualquiera que busque en {city} una ejecución de primera clase para {service} encontrará en nosotros al socio ideal.",
      "Nuestro dedicado equipo de especialistas en {city} está capacitado para implementar {service} con la mayor minuciosidad.",
      "Aportamos muchos años de experiencia en el sector suizo directamente a {city} para realizar {service} a la perfección.",
      "Para su proyecto relacionado con {service} en {city}, le ofrecemos conceptos transparentes y a la medida.",
      "En {city}, Kraken PFM representa un profesionalismo sobresaliente y soluciones orientadas al cliente para {service}.",
      "Comprendemos las necesidades arquitectónicas y locales individuales en {city} al ejecutar {service}.",
      "Su confianza es nuestra motivación, por lo que ofrecemos un servicio excepcionalmente fiable para {service} en {city}.",
      "La limpieza y la precisión son nuestras señas de identidad cuando nos encargamos de {service} por usted en {city}.",
      "Con Kraken PFM, elige una ejecución de {service} en {city} conforme a la GAV y bajo los estándares más altos.",
      "Disfrute de una gestión profesional y sin estrés de {service} directamente en su ubicación en {city}.",
      "La sostenibilidad y la eficiencia caracterizan nuestras acciones en cada servicio de {service} en {city}."
    ],
    fr: [
      "En tant que prestataire de services établi à {city}, nous accordons la plus haute importance à l'excellence pour {service}.",
      "Quiconque recherche à {city} une exécution de premier ordre pour {service} trouvera en nous le partenaire idéal.",
      "Notre équipe de spécialistes dévoués à {city} est hautement qualifiée pour mettre en œuvre {service} avec minutie.",
      "Nous apportons de nombreuses années d'expérience suisse directement à {city} pour réaliser {service} à la perfection.",
      "Pour votre projet concernant {service} à {city}, nous vous proposons des concepts sur mesure et transparents.",
      "À {city}, Kraken PFM est synonyme d'un professionnalisme exceptionnel et de solutions orientées client pour {service}.",
      "We understand the individual architectural and local needs in {city} when executing {service}.",
      "Votre confiance est notre moteur : c'est pourquoi nous offrons un service fiable pour {service} à {city}.",
      "La propreté et la précision sont nos marques de fabrique lorsque nous prenons soin de {service} pour vous à {city}.",
      "Avec Kraken PFM, vous choisissez une exécution de {service} à {city} conforme à la CCT et aux normes les plus strictes.",
      "Vivez une gestion professionnelle et sans stress de {service} directement sur votre site à {city}.",
      "La durabilité et l'efficacité caractérisent chacune de nos actions lors de chaque mission de {service} à {city}."
    ],
    it: [
      "Come fornitore di servizi affermato a {city}, diamo il massimo valore all'eccellenza nell'esecuzione di {service}.",
      "Chiunque cerchi a {city} un'esecuzione di prima classe per {service} troverà in noi il partner ideale.",
      "Il nostro team di specialisti dedicato a {city} è altamente qualificato per realizzare {service} con la massima accuratezza.",
      "Portiamo molti anni di esperienza nel settore svizzero direttamente a {city} per realizzare {service} alla perfezione.",
      "Per il vostro progetto relativo a {service} a {city}, offriamo concetti personalizzati e trasparenti.",
      "A {city}, Kraken PFM è sinonimo di eccezionale professionalità e soluzioni orientate al cliente per {service}.",
      "Comprendiamo le esigenze architettoniche e locali specifiche a {city} durante l'esecuzione di {service}.",
      "La vostra fiducia è il nostro motore: ecco perché offriamo un servizio affidabile per {service} a {city}.",
      "Pulizia e precisione sono i nostri marchi di fabbrica quando ci occupiamo di {service} per voi a {city}.",
      "Con Kraken PFM, scegliete un'esecuzione di {service} a {city} conforme alla CCL svizzera e ai massimi standard.",
      "Sperimentate una gestione professionale e senza stress di {service} direttamente presso la vostra sede a {city}.",
      "Sostenibilità ed efficienza caratterizzano ogni nostra azione durante ogni servizio di {service} a {city}."
    ],
    pt: [
      "Como prestador de serviços estabelecido em {city}, damos o valor mais alto à excelência ao realizar {service}.",
      "Qualquer pessoa em {city} que procure uma execução de primeira classe para {service} encontrará em nós o parceiro ideal.",
      "A nossa dedicada equipa de especialistas em {city} está altamente qualificada para implementar {service} com a máxima minuciosidade.",
      "Trazemos muitos anos de experiência no setor suíço diretamente para {city} para realizar {service} com perfeição.",
      "Para o seu projeto relacionado com {service} em {city}, oferecemos conceitos personalizados e transparentes.",
      "Em {city}, a Kraken PFM representa um profissionalismo excecional e soluções orientadas para o cliente para {service}.",
      "Compreendemos as necessidades arquitetónicas e locais específicas em {city} ao executar {service}.",
      "A sua confiança é o nosso motor: por isso, oferecemos um serviço fiável para {service} em {city}.",
      "Limpeza e precisão são as nossas marcas registadas quando cuidamos de {service} por si em {city}.",
      "Com a Kraken PFM, escolhe uma execução de {service} em {city} em conformidade com o GAV e os padrões mais elevados.",
      "Desfrute de uma gestão profissional e sem stress de {service} diretamente nas suas instalações em {city}.",
      "Sustentabilidade e eficiência caracterizam cada uma das nossas ações em cada serviço de {service} em {city}."
    ]
  };

  const middles: Record<string, string[]> = {
    de: [
      "Dabei passen wir unsere bewährten Methoden und umweltschonenden Wirkstoffe exakt auf Ihre Räumlichkeiten an.",
      "Unsere geschulten Fachkräfte setzen modernste Geräte ein, um selbst hartnäckigste Herausforderungen mühelos zu lösen.",
      "Durch optimierte Arbeitsabläufe garantieren wir Ihnen eine zeitsparende und gleichzeitig lückenlose Pflege aller Oberflächen.",
      "Wir legen grossen Wert auf materialschonende Verfahren, die den langfristigen Wert Ihrer Immobilie spürbar erhalten.",
      "Jeder Handgriff sitzt perfekt, da unser Team regelmässig geschult wird und streng nach Schweizer Qualitätsrichtlinien arbeitet.",
      "Dank flexibler Terminplanung richten wir uns vollkommen nach Ihrem Alltag, um Störungen auf ein Minimum zu reduzieren.",
      "Mit biologisch abbaubaren Reinigungsprodukten schonen wir nicht nur die Umwelt, sondern sorgen auch für ein gesundes Raumklima.",
      "Transparente Festpreise ohne versteckte Nebenkosten geben Ihnen von Anfang an volle Planungssicherheit und Vertrauen.",
      "Wir kontrollieren jedes Detail sorgfältig, um ein perfektes Ergebnis zu garantieren, das Ihre Erwartungen übertrifft.",
      "Unsere Spezialisten verfügen über das nötige Fachwissen für anspruchsvolle Materialien und komplexe Aufgabenstellungen.",
      "Durch die effiziente Bündelung unserer regionalen Einsätze sichern wir Ihnen eine speditive und reibungslose Organisation zu.",
      "Wir stehen für Diskretion, Zuverlässigkeit und eine persönliche Betreuung, die genau auf Ihre Wünsche eingeht."
    ],
    en: [
      "In doing so, we adapt our proven methods and eco-friendly products exactly to your specific premises.",
      "Our trained professionals use state-of-the-art equipment to easily solve even the most stubborn challenges.",
      "Through optimized workflows, we guarantee time-saving and completely thorough care of all surfaces.",
      "We place great importance on material-friendly procedures that visibly preserve the long-term value of your property.",
      "Every move is executed perfectly because our team is regularly trained and works strictly to Swiss quality standards.",
      "Thanks to flexible scheduling, we align our visits entirely with your daily routine to minimize disruptions.",
      "Using biodegradable cleaning agents, we protect the environment while ensuring a healthy indoor climate.",
      "Transparent flat rates with no hidden costs give you complete planning security and peace of mind from the start.",
      "We carefully inspect every detail to guarantee a perfect result that exceeds your expectations.",
      "Our specialists possess the necessary expertise for delicate materials and complex task requirements.",
      "By efficiently bundling our regional operations, we ensure a swift and smooth execution of your order.",
      "We stand for discretion, reliability, and personal customer service tailored to your precise wishes."
    ],
    es: [
      "Al hacerlo, adaptamos nuestros métodos probados y productos ecológicos exactamente a sus instalaciones específicas.",
      "Nuestros profesionales capacitados utilizan equipos de última generación para resolver fácilmente los desafíos más difíciles.",
      "A través de flujos de trabajo optimizados, garantizamos un cuidado rápido y totalmente minucioso de todas las superficies.",
      "Damos gran importancia a los procedimientos respetuosos con los materiales que preservan visiblemente el valor de su propiedad.",
      "Cada movimiento se ejecuta a la perfección porque nuestro equipo recibe formación regular bajo estándares suizos de calidad.",
      "Gracias a una programación flexible, alineamos nuestras visitas por completo con su rutina diaria para minimizar molestias.",
      "Utilizando productos de limpieza biodegradables, protegemos el medio ambiente y aseguramos un clima interior saludable.",
      "Las tarifas planas transparentes y sin costes ocultos le brindan total seguridad de planificación y tranquilidad desde el principio.",
      "Inspeccionamos cuidadosamente cada detalle para garantizar un resultado perfecto que supere sus expectativas.",
      "Nuestros especialistas poseen la experiencia necesaria para materiales delicados y requisitos de tareas complejas.",
      "Al agrupar eficientemente nuestras operaciones regionales, garantizamos una ejecución rápida y sin contratiempos de su pedido.",
      "Destacamos por nuestra discreción, fiabilidad y un servicio de atención al cliente personalizado y adaptado a sus deseos."
    ],
    fr: [
      "Pour ce faire, nous adaptons nos méthodes éprouvées et nos produits écologiques exactement à vos locaux spécifiques.",
      "Nos professionnels qualifiés utilisent des équipements de pointe pour résoudre facilement les défis les plus tenaces.",
      "Grâce à des processus optimisés, nous garantissons un entretien rapide et approfondi de toutes les surfaces.",
      "We place great importance on material-friendly procedures that visibly preserve the long-term value of your property.",
      "Chaque geste est exécuté à la perfection car notre équipe est régulièrement formée aux standards de qualité suisses.",
      "Grâce à des horaires flexibles, nous adaptons entièrement nos visites à votre routine quotidienne pour minimiser les désagréments.",
      "En utilisant des produits biodégradables, nous protégeons l'environnement tout en assurant un climat intérieur sain.",
      "Des tarifs forfaitaires clairs et sans frais cachés vous offrent une sécurité de planification totale dès le départ.",
      "Nous inspectons soigneusement chaque détail pour garantir un résultat impeccable qui dépasse vos attentes.",
      "Nos spécialistes possèdent l'expertise requise pour les matériaux délicats et les exigences de tâches complexes.",
      "En regroupant efficacement nos opérations régionales, nous assurons une exécution rapide et fluide de votre commande.",
      "Nous nous distinguons par notre discrétion, notre fiabilité et un service client personnalisé et adapté à vos souhaits."
    ],
    it: [
      "Per fare questo, adattiamo i nostri metodi collaudati e prodotti ecologici esattamente ai vostri locali specifici.",
      "I nostri professionisti qualificati utilizzano attrezzature all'avanguardia per risolvere facilmente le sfide più ostinate.",
      "Grazie a flussi di lavoro ottimizzati, garantiamo una cura rapida e completamente approfondita di tutte le superfici.",
      "Attribuiamo grande importanza a procedure rispettose dei materiali che preservano il valore del vostro immobile.",
      "Ogni movimento è eseguito alla perfezione perché il nostro team viene formato regolarmente secondo gli standard svizzeri.",
      "Grazie a una pianificazione flessibile, adattiamo le visite alla vostra routine quotidiana per ridurre al minimo i disagi.",
      "Utilizzando detergenti biodegradabili, proteggiamo l'ambiente e assicuriamo un clima interno sano.",
      "Tariffe piatte e trasparenti senza costi nascosti vi offrono la totale sicurezza di pianificazione fin dall'inizio.",
      "Ispezioniamo attentamente ogni dettaglio per garantire un risultato perfetto che superi le vostre aspettative.",
      "I nostri specialisti possiedono l'esperienza necessaria per materiali delicati e requisiti di compiti complessi.",
      "Raggruppando efficientemente le nostre operazioni regionali, garantiamo un'esecuzione rapida e senza intoppi dell'ordine.",
      "Ci distinguiamo per la nostra discrezione, affidabilità e un servizio clienti personalizzato e su misura per i vostri desideri."
    ],
    pt: [
      "Para o fazer, adaptamos os nossos métodos comprovados e produtos ecológicos exatamente às suas instalações específicas.",
      "Os nossos profissionais qualificados utilizam equipamentos de última geração para resolver facilmente os desafios mais difíceis.",
      "Através de fluxos de trabalho otimizados, garantiam um cuidado rápido e totalmente minucioso de todas as superfícies.",
      "Damos grande importância a procedimentos respeitadores dos materiais que preservam o valor do seu imóvel.",
      "Cada movimento é executado na perfeição porque a nossa equipa recebe formação regular segundo os padrões suíços.",
      "Graças a um agendamento flexível, adaptamos as visitas à sua rotina diária para reduzir ao mínimo os inconvenientes.",
      "Ao utilizar detergentes biodegradáveis, protegemos o ambiente e garantimos um clima interior saudável.",
      "Tarifas planas transparentes e sem custos ocultos oferecem-lhe total segurança de planeamento desde o início.",
      "Inspecionamos cuidadosamente cada detalhe para garantir um resultado perfeito que supere as suas expectativas.",
      "Os nossos especialistas possuem a experiência necessária para materiais delicados e requisitos de tarefas complexas.",
      "Ao agrupar eficientemente as nossas operações regionais, garantimos uma execução rápida e sem contratempos do seu pedido.",
      "Destacamo-nos pela nossa discrição, fiabilidade e um serviço de apoio ao cliente personalizado e sob medida para os seus desejos."
    ]
  };

  const outros: Record<string, string[]> = {
    de: [
      "Verlassen Sie sich auf Kraken PFM – Ihren starken regionalen Partner für glänzende Ergebnisse ohne Kompromisse.",
      "So wird Ihr Projekt zu einem vollen Erfolg, begleitet von unserem erstklassigen Kundenservice direkt vor Ort.",
      "Kontaktieren Sie uns noch heute für ein unverbindliches Angebot und geniessen Sie makellose Qualität.",
      "Geben Sie Ihre Aufgaben in professionelle Hände und profitieren Sie von unserem exzellenten Rundum-Sorglos-Paket.",
      "Ihr Objekt ist bei unseren Experten in den besten Händen – für eine pflege, die Massstäbe setzt.",
      "Wir garantieren Ihnen eine fachmännische Abwicklung, die Sie rundum begeistern und entlasten wird.",
      "Sichern Sie sich jetzt Ihren Wunschtermin und erleben Sie Schweizer Gründlichkeit in ihrer schönsten Form.",
      "Mit unserer Zufriedenheitsgarantie gehen Sie keinerlei Risiken ein und können sich entspannt zurücklehnen.",
      "Gemeinsam sorgen wir für den langfristigen Werterhalt und die perfekte Repräsentativität Ihrer Liegenschaft.",
      "Vertrauen Sie dem Spezialisten und lassen Sie sich von unserer Leidenschaft für Sauberkeit überzeugen.",
      "Kraken PFM ist Ihr Schlüssel zu mehr Lebensqualität und perfekt gepflegten Räumen in der gesamten Region.",
      "Wir freuen uns darauf, auch Ihr Vorhaben mit Präzision, Verlässlichkeit und fairen Konditionen zu unterstützen."
    ],
    en: [
      "Rely on Kraken PFM – your strong regional partner for sparkling results without compromise.",
      "This makes your project a complete success, accompanied by our first-class local customer support.",
      "Contact us today for a non-binding offer and enjoy flawless, stress-free quality.",
      "Hand over your tasks to professional hands and benefit from our excellent peace-of-mind package.",
      "Your property is in the best hands with our experts – for care that sets industry standards.",
      "We guarantee professional handling that will inspire you and completely relieve your burden.",
      "Secure your preferred date now and experience Swiss thoroughness in its finest form.",
      "With our satisfaction guarantee, you run absolutely no risk and can sit back and relax.",
      "Together, we ensure long-term value preservation and a prestigious appearance for your property.",
      "Trust the specialist and let yourself be convinced by our passion for cleanliness.",
      "Kraken PFM is your key to a better quality of life and perfectly maintained rooms across the region.",
      "We look forward to supporting your project with precision, reliability, and fair conditions."
    ],
    es: [
      "Confíe en Kraken PFM: su sólido socio regional para obtener resultados brillantes y sin concesiones.",
      "Esto hace que su proyecto sea un éxito rotundo, acompañado de nuestro servicio de atención al cliente de primera clase.",
      "Contáctenos hoy mismo para recibir una oferta sin compromiso y disfrute de una calidad impecable y sin estrés.",
      "Deje sus tareas en manos profesionales y benefíciese de nuestro excelente paquete integral de tranquilidad.",
      "Su propiedad está en las mejores manos con nuestros expertos, para un cuidado que establece los estándares de la industria.",
      "Garantizamos un manejo profesional que le inspirará y le aliviará por completo de cualquier carga de trabajo.",
      "Reserve su fecha preferida ahora y experimente la minuciosidad suiza en su máxima expresión.",
      "Con nuestra garantía de satisfacción, usted no corre ningún riesgo y puede sentarse a relajarse.",
      "Juntos, aseguramos la conservación del valor a largo plazo y una apariencia prestigiosa para su propiedad.",
      "Confíe en el especialista y déjese convencer por nuestra pasión absoluta por la limpieza.",
      "Kraken PFM es su clave para una mejor calidad de vida y espacios perfectamente mantenidos en toda la región.",
      "Esperamos apoyar su proyecto con precisión, total fiabilidad y las condiciones más justas del mercado."
    ],
    fr: [
      "Faites confiance à Kraken PFM – votre solide partenaire régional pour des résultats éclatants sans compromis.",
      "Votre projet sera ainsi un franc succès, accompagné de notre service client de premier ordre sur place.",
      "Contactez-nous dès aujourd'hui pour une offre sans engagement et profitez d'une qualité impeccable sans stress.",
      "Confiez vos tâches à des mains professionnelles et profitez de notre excellent pack de tranquillité d'esprit.",
      "Votre propriété est entre de meilleures mains avec nos experts – pour un entretien qui définit les standards du secteur.",
      "Nous garantissons un traitement professionnel qui saura vous inspirer et vous soulager complètement.",
      "Réservez dès maintenant votre date préférée et découvrez la rigueur suisse dans ce qu'elle a de plus beau.",
      "Grâce à notre garantie de satisfaction, vous ne courez aucun risque et pouvez vous détendre sereinement.",
      "Ensemble, nous assurons la préservation de la valeur à long terme et un aspect prestigieux pour votre bien.",
      "Faites confiance au spécialiste et laissez-vous convaincre par notre passion absolue pour la propreté.",
      "Kraken PFM est votre clé pour une meilleure qualité de vie et des pièces parfaitement entretenues dans toute la région.",
      "Nous avons hâte de soutenir votre projet avec précision, une fiabilité totale et des conditions équitables."
    ],
    it: [
      "Affidatevi a Kraken PFM – il vostro solido partner regionale per risultati brillanti e senza compromessi.",
      "Questo rende il vostro progetto un successo completo, accompagnato dal nostro servizio clienti locale di prima classe.",
      "Contattateci oggi stesso per un'offerta senza impegno e godetevi una qualità impeccabile e senza stress.",
      "Affidate i vostri compiti a mani professionali e beneficiate del nostro eccellente pacchetto per la massima tranquillità.",
      "Il vostro immobile è nelle migliori mani con i nostri esperti – per una cura che stabilisce gli standard del settore.",
      "Garantiamo una gestione professionale che vi ispirerà e vi solleverà completamente da ogni preoccupazione.",
      "Prenotate subito la vostra data preferita e scoprite la precisione svizzera nella sua forma più bella.",
      "Con la nostra garanzia di soddisfazione, non correte alcun rischio e potete rilassarvi serenamente.",
      "Insieme, assicuriamo la conservazione del valore a lungo termine e un aspetto prestigioso per la vostra proprietà.",
      "Affidatevi allo specialista e lasciatevi convincere dalla nostra passione assoluta per la pulizia.",
      "Kraken PFM è la vostra chiave per una migliore qualità della vita e spazi perfettamente mantenuti in tutta la regione.",
      "Non vediamo l'ora di supportare il vostro progetto con precisione, affidabilità totale e condizioni eque."
    ],
    pt: [
      "Confie na Kraken PFM – o seu parceiro regional forte para resultados brilhantes e sem concessões.",
      "Isto torna o seu projeto um sucesso absoluto, acompanhado pelo nosso serviço de apoio ao cliente local de primeira classe.",
      "Contacte-nos hoje mesmo para uma oferta sem compromisso e desfrute de uma qualidade impecável e sem stress.",
      "Deje as suas tarefas em mãos profissionais e beneficie do nosso excelente pacote de tranquilidade.",
      "A sua propriedade está nas melhores mãos com os nossos especialistas – para um cuidado que estabelece os padrões do setor.",
      "Garantimos uma gestão profissional que o inspirará e o aliviará completamente de qualquer preocupação.",
      "Reserve já a sua data preferida e experimente a precisão suíça na sua forma mais bela.",
      "Com a nossa garantia de satisfação, não corre qualquer risco e pode relaxar com tranquilidade.",
      "Juntos, garantimos a preservação do valor a longo prazo e uma aparência prestigiente para a sua propriedade.",
      "Confie no especialista e deixe-se convencer pela nossa paixão absoluta pela limpeza.",
      "A Kraken PFM é a sua chave para uma melhor qualidade de vida e espaços perfeitamente mantidos em toda a região.",
      "Esperamos apoiar o seu projeto com precisão, fiabilidade total e as condições mais justas."
    ]
  };

  const activeLang = ['de', 'en', 'es', 'fr', 'it', 'pt'].includes(lang) ? lang : 'de';

  const introVariants = intros[activeLang] || intros['de'];
  const middleVariants = middles[activeLang] || middles['de'];
  const outroVariants = outros[activeLang] || outros['de'];

  const introIndex = getDeterministicHash(cityId.toLowerCase() + serviceId.toLowerCase() + "intro") % introVariants.length;
  const middleIndex = getDeterministicHash(cityId.toLowerCase() + serviceId.toLowerCase() + "middle") % middleVariants.length;
  const outroIndex = getDeterministicHash(cityId.toLowerCase() + serviceId.toLowerCase() + "outro") % outroVariants.length;

  const introText = introVariants[introIndex].replace(/\{city\}/g, cityName).replace(/\{service\}/g, serviceName);
  const middleText = middleVariants[middleIndex].replace(/\{city\}/g, cityName).replace(/\{service\}/g, serviceName);
  const outroText = outroVariants[outroIndex].replace(/\{city\}/g, cityName).replace(/\{service\}/g, serviceName);

  let localContextParagraph = "";
  const localMuni = MUNICIPALITIES.find(m => m.slug === cityId.toLowerCase());
  if (localMuni) {
    const { buildingTypes, clientProfile, cleaningNotes, landmark } = localMuni.localContext;
    if (lang === 'de') {
      localContextParagraph = ` Unser Reinigungskonzept in ${cityName} ist optimal auf die lokalen Gegebenheiten abgestimmt. Ob es sich um ${buildingTypes} handelt oder spezifische Anforderungen wie ${cleaningNotes} für ${clientProfile} – unsere Crew arbeitet mit der passenden Fachexpertise. Nicht weit von ${landmark} entfernt ist unser Team täglich im Einsatz, um erstklassige Resultate zu erzielen.`;
    } else if (lang === 'es') {
      localContextParagraph = ` Nuestro concepto de limpieza en ${cityName} está adaptado de forma óptima a las condiciones locales. Ya sea para ${buildingTypes} o requisitos específicos como ${cleaningNotes} para ${clientProfile}, nuestro equipo trabaja con el conocimiento técnico preciso. No muy lejos de ${landmark}, nuestro equipo está en acción diariamente para lograr resultados sobresalientes.`;
    } else {
      localContextParagraph = ` Our cleaning approach in ${cityName} is fully customized to local conditions. Whether maintaining ${buildingTypes} or addressing specialized needs like ${cleaningNotes} for ${clientProfile}, our specialists deliver professional quality. Operating near ${landmark}, our crew is active daily to secure pristine results.`;
    }
  }

  return paraphraseText(`${introText} ${middleText}${localContextParagraph} ${outroText}`, cityId.toLowerCase() + "_" + serviceId.toLowerCase() + "_why_partner", lang);
};

const getServiceIconComponent = (id: string, className?: string) => {
  const cn = className || "w-6 h-6";
  switch (id.toLowerCase()) {
    case 'end-of-tenancy':
      return <Key className={cn} />;
    case 'deep-cleaning':
      return <Sparkles className={cn} />;
    case 'daily-cleaning':
      return <Calendar className={cn} />;
    case 'moving-furniture':
    case 'mudanza-cajas':
      return <Truck className={cn} />;
    case 'car-detailing':
      return <Car className={cn} />;
    case 'gardening':
      return <Leaf className={cn} />;
    case 'exterior-cleaning':
    case 'gutter-cleaning':
      return <Droplet className={cn} />;
    case 'pest-control':
      return <Bug className={cn} />;
    case 'waste-management':
      return <Trash2 className={cn} />;
    case 'office-cleaning':
      return <Building className={cn} />;
    case 'upholstery-cleaning':
      return <Armchair className={cn} />;
    case 'window-cleaning':
      return <Sparkles className={cn} />;
    case 'pulido-suelos':
      return <Sparkles className={cn} />;
    case 'common-area-cleaning':
      return <Home className={cn} />;
    case 'industrial-maintenance':
      return <Wrench className={cn} />;
    case 'retail-management':
      return <Store className={cn} />;
    case 'bar-restaurant-cleaning':
    case 'gastronomy-restaurants':
    case 'kitchen-deep-cleaning':
      return <Utensils className={cn} />;
    case 'property-managers':
    case 'offices-corporate':
      return <Building className={cn} />;
    case 'airbnb-rentals':
    case 'turnover-cleaning':
      return <Sparkles className={cn} />;
    case 'retail-showrooms':
      return <Store className={cn} />;
    case 'industry-logistics':
      return <Wrench className={cn} />;
    default:
      return <Sparkles className={cn} />;
  }
};

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
  if (['retail-management', 'bar-restaurant-cleaning', 'industrial-maintenance', 'property-managers', 'airbnb-rentals', 'turnover-cleaning', 'offices-corporate', 'retail-showrooms', 'gastronomy-restaurants', 'kitchen-deep-cleaning', 'industry-logistics'].includes(sId)) {
    return 'commercial';
  }
  return 'special';
};

const getServiceDurationText = (serviceId: string, lang: string, cityId?: string, cityName?: string): string => {
  const sId = serviceId.toLowerCase();
  
  const durations: Record<string, { de: { d: string; t: string }; en: { d: string; t: string }; es: { d: string; t: string } }> = {
    'window-cleaning': {
      de: { d: "2–4 Stunden", t: "Wohnung mit 8–12 Fenstern und Storen" },
      en: { d: "2–4 hours", t: "apartment with 8–12 windows and blinds" },
      es: { d: "2–4 horas", t: "apartamento con 8–12 ventanas y persianas" }
    },
    'end-of-tenancy': {
      de: { d: "6–10 Stunden", t: "Komplette Tiefenreinigung mit Abnahmegarantie" },
      en: { d: "6–10 hours", t: "complete deep clean with handover guarantee" },
      es: { d: "6–10 horas", t: "limpieza profunda completa con garantía de entrega" }
    },
    'deep-cleaning': {
      de: { d: "4–8 Stunden", t: "Intensive Kalk- und Fettentfernung" },
      en: { d: "4–8 hours", t: "intensive scale & grease removal" },
      es: { d: "4–8 horas", t: "eliminación intensiva de cal y grasa" }
    },
    'daily-cleaning': {
      de: { d: "2–4 Stunden", t: "regelmässige Unterhaltsreinigung" },
      en: { d: "2–4 hours", t: "scheduled regular cleaning maintenance" },
      es: { d: "2–4 horas", t: "mantenimiento regular programado" }
    },
    'office-cleaning': {
      de: { d: "2–4 Stunden", t: "regelmässige Büroreinigung" },
      en: { d: "2–4 hours", t: "scheduled regular office cleaning" },
      es: { d: "2–4 horas", t: "mantenimiento regular de oficina" }
    },
    'moving-furniture': {
      de: { d: "4–8 Stunden", t: "professioneller Möbeltransport und Montage" },
      en: { d: "4–8 hours", t: "professional furniture packing and transport" },
      es: { d: "4–8 horas", t: "embalaje y transporte profesional de muebles" }
    },
    'mudanza-cajas': {
      de: { d: "4–8 Stunden", t: "professioneller Möbeltransport und Montage" },
      en: { d: "4–8 hours", t: "professional furniture packing and transport" },
      es: { d: "4–8 horas", t: "embalaje y transporte profesional de muebles" }
    },
    'car-detailing': {
      de: { d: "3–5 Stunden", t: "Innen- und Aussenreinigung auf Premium-Niveau" },
      en: { d: "3–5 hours", t: "interior & exterior premium detailing" },
      es: { d: "3–5 horas", t: "detallado premium interior y exterior" }
    },
    'gardening': {
      de: { d: "2–6 Stunden", t: "Rasen-, Hecken- und Gartenpflege" },
      en: { d: "2–6 hours", t: "lawn, hedge, and garden maintenance" },
      es: { d: "2–6 horas", t: "mantenimiento de césped, setos y jardín" }
    },
    'exterior-cleaning': {
      de: { d: "3–6 Stunden", t: "Hochdruckreinigung und Moosbehandlung" },
      en: { d: "3–6 hours", t: "high-pressure washing and moss treatment" },
      es: { d: "3–6 horas", t: "lavado a alta presión y tratamiento de musgo" }
    },
    'gutter-cleaning': {
      de: { d: "1–3 Stunden", t: "Dachrinnenreinigung und Verstopfungsschutz" },
      en: { d: "1–3 hours", t: "gutter cleaning and blockage prevention" },
      es: { d: "1–3 horas", t: "limpieza de canalones y prevención de obstrucciones" }
    },
    'pest-control': {
      de: { d: "1–3 Stunden", t: "Inspektion und professionelle Eco-Behandlung" },
      en: { d: "1–3 hours", t: "inspection & professional targeted eco-treatment" },
      es: { d: "1–3 horas", t: "inspección y tratamiento ecológico profesional" }
    },
    'waste-management': {
      de: { d: "3–7 Stunden", t: "Räumung und umweltfreundliche Entsorgung" },
      en: { d: "3–7 hours", t: "property cleanout and eco-friendly recycling" },
      es: { d: "3–7 horas", t: "desalojo de propiedad y reciclaje ecológico" }
    },
    'upholstery-cleaning': {
      de: { d: "2–4 Stunden", t: "Tiefenextraktion und Fleckenbehandlung" },
      en: { d: "2–4 hours", t: "deep fiber extraction and stain treatment" },
      es: { d: "2–4 horas", t: "extracción profunda de fibras y manchas" }
    },
    'pulido-suelos': {
      de: { d: "4–8 Stunden", t: "Schleifen, Polieren und Versiegeln" },
      en: { d: "4–8 hours", t: "stone/parquet sanding, polishing, and sealing" },
      es: { d: "4–8 horas", t: "lijado, pulido y sellado de piedra/parqué" }
    }
  };

  const defaultDuration = {
    de: { d: "3–5 Stunden", t: "ausgeführt von einem spezialisierten 2-Personen-Team" },
    en: { d: "3–5 hours", t: "executed by a specialized 2-person team" },
    es: { d: "3–5 horas", t: "ejecutado por un equipo especializado de 2 personas" }
  };

  const item = durations[sId] || defaultDuration;
  const activeLang = lang === 'de' ? 'de' : lang === 'es' ? 'es' : 'en';
  const data = item[activeLang as 'de' | 'en' | 'es'];

  if (!cityId || !cityName) {
    if (activeLang === 'de') return `Typische Dauer: ${data.d} (${data.t})`;
    if (activeLang === 'es') return `Duración típica: ${data.d} (${data.t})`;
    return `Typical duration: ${data.d} (${data.t})`;
  }

  const hashVal = getDeterministicHash(cityId + "_" + sId + "_duration");

  const deVariants = [
    `Typische Dauer: ${data.d} (${data.t})`,
    `Zeitaufwand vor Ort: circa ${data.d} (${data.t})`,
    `Erfahrungsgemäss dauert dieser Service in ${cityName} etwa ${data.d} (${data.t})`,
    `Unser Team benötigt hierfür im Schnitt ${data.d} (${data.t})`,
    `Für diesen Einsatz in ${cityName} planen wir gewöhnlich ${data.d} ein (${data.t})`
  ];

  const enVariants = [
    `Typical duration: ${data.d} (${data.t})`,
    `Estimated time on-site: around ${data.d} (${data.t})`,
    `Usually, this service in ${cityName} takes about ${data.d} (${data.t})`,
    `Our team normally requires ${data.d} (${data.t})`,
    `For this assignment in ${cityName}, we usually estimate ${data.d} (${data.t})`
  ];

  const esVariants = [
    `Duración típica: ${data.d} (${data.t})`,
    `Tiempo estimado en el lugar: aproximadamente ${data.d} (${data.t})`,
    `Normalmente, este servicio en ${cityName} toma unas ${data.d} (${data.t})`,
    `Nuestro equipo suele requerir ${data.d} (${data.t})`,
    `Para este trabajo en ${cityName}, estimamos habitualmente ${data.d} (${data.t})`
  ];

  let chosenList = deVariants;
  if (activeLang === 'en') chosenList = enVariants;
  else if (activeLang === 'es') chosenList = esVariants;

  const chosen = chosenList[hashVal % chosenList.length];
  return paraphraseText(chosen, cityId + "_" + sId + "_duration_final", lang);
};

const getServiceMarketingExplanation = (serviceId: string, lang: string, localizedTitle: string, cityId?: string, cityName?: string): string => {
  const sId = serviceId.toLowerCase();
  const activeLang = ['de', 'en', 'es'].includes(lang) ? lang : 'de';

  if (cityId && cityName && marketingVariants[sId]) {
    const variants = marketingVariants[sId][activeLang as 'de' | 'en' | 'es'] || marketingVariants[sId]['de'];
    const seed = cityId + "_" + sId;
    const hashVal = getDeterministicHash(seed);
    
    const openingIdx = hashVal % variants.openings.length;
    const middleIdx = (hashVal + 1) % variants.middles.length;
    const closingIdx = (hashVal + 2) % variants.closings.length;

    const opening = variants.openings[openingIdx].replace(/\{city\}/g, cityName);
    const middle = variants.middles[middleIdx].replace(/\{city\}/g, cityName);
    const closing = variants.closings[closingIdx].replace(/\{city\}/g, cityName);

    return `${opening} ${middle} ${closing}`;
  }
  
  const de: Record<string, string> = {
    'window-cleaning': `Die professionelle Fensterreinigung umfasst die streifenfreie Säuberung aller Glasflächen von innen und aussen sowie die sorgfältige Reinigung von Fensterrahmen, Simsen und Rollläden oder Lamellenstoren. Wir arbeiten mit modernsten Abziehern, Mikrofasertüchern und entmineralisiertem Osmosewasser für stark verschmutzte Aussenflächen. Storen und Lamellen werden präzise Lamelle für Lamelle gereinigt.`,
    'end-of-tenancy': `Die Umzugsreinigung (Endreinigung) mit Abgabegarantie beinhaltet die lückenlose Tiefenreinigung der gesamten Immobilie nach strengsten Schweizer Standards. Alle Räume, Einbauschränke, Sanitäreanlagen sowie die Küche mit Backofen, Dunstabzug und Kühlschrank werden porentief gereinigt, damit einer reibungslosen Übergabe an Ihre Verwaltung absolut nichts im Wege steht.`,
    'deep-cleaning': `Unsere intensive Spezial- und Grundreinigung rückt auch tiefsitzendem Schmutz, hartnäckigen Kalkablagerungen, Fettfilmen und Verfärbungen mit professionellem Equipment zu Leibe. Perfekt für den jährlichen Frühjahrsputz, nach Renovierungsarbeiten oder vor dem Einzug in ein neues Heim, um überall hygienische Frische zu garantieren.`,
    'daily-cleaning': `Die Unterhaltsreinigung sichert Ihnen die regelmässige Sauberkeit und Pflege Ihrer privaten oder geschäftlichen Räume im flexiblen Wunsch-Rhythmus. Unser Team sorgt für staubfreie Oberflächen, gesäuberte Böden, hygienisch reine Badezimmer und Küchen sowie die fachgerechte Entsorgung des Hausmülls.`,
    'office-cleaning': `Unsere Büroreinigung bietet Ihren Mitarbeitern und Kunden ein konstant sauberes, hygienisches und repräsentatives Umfeld. Wir reinigen Arbeitsplätze, desinfizieren Tastaturen, pflegen Meetingräume und Küchenbereiche und leeren Abfalleimer diskret und hocheffizient – idealerweise ausserhalb Ihrer Geschäftszeiten.`,
    'gardening': `Unsere professionelle Gartenpflege hält Ihre grüne Oase zu jeder Jahreszeit in Bestform. Vom präzisen Rasen- und Heckenschnitt über fachgerechte Unkrautbeseitigung in Beeten und Rabatten bis hin zur saisonalen Bodenvorbereitung und dem Abtransport aller Grünabfälle übernehmen wir die komplette Arbeit für Sie.`,
    'moving-furniture': `Die Umzugshilfe von Kraken Logistik macht Ihren Wohnortswechsel stressfrei, sicher und unkompliziert. Unser geschultes Team demontiert Ihre Möbel fachgerecht, verpackt empfindliches Umzugsgut in Premium-Schutzdecken, transportiert alles sicher im Zügel-LKW und baut Ihre Möbel am Zielort passgenau wieder auf.`,
    'mudanza-cajas': `Die Umzugshilfe von Kraken Logistik macht Ihren Wohnortswechsel stressfrei, sicher und unkompliziert. Unser geschultes Team demontiert Ihre Möbel fachgerecht, verpackt empfindliches Umzugsgut in Premium-Schutzdecken, transportiert alles sicher im Zügel-LKW und baut Ihre Möbel am Zielort passgenau wieder auf.`,
    'car-detailing': `Unsere professionelle Fahrzeugaufbereitung bietet Ihrem Auto das ultimative Neuwagen-Gefühl. Wir reinigen den Innenraum porentief inklusive Polstershampoo, pflegen feine Leder- und Kunststoffflächen, beseitigen Gerüche und bringen die Karosserie durch eine professionelle Handwäsche und Lackpolitur wieder zum Strahlen.`
  };

  const en: Record<string, string> = {
    'window-cleaning': `Professional window cleaning includes streak-free cleaning of all glass surfaces inside and out, as well as window frames, sills, and shutters or blinds. We work using professional equipment—squeegees, microfiber cloths, and pure demineralized water for heavily soiled exterior panes. Blinds are wiped carefully slat by slat.`,
    'end-of-tenancy': `End of tenancy cleaning with a handover guarantee features a complete, top-to-bottom deep clean of the entire property matching strict Swiss standards. Every room, built-in cabinet, bathroom, and kitchen appliance (oven, hood, fridge) is deep-cleaned, ensuring a seamless handover to your landlord.`,
    'deep-cleaning': `Our intensive deep cleaning targets hard-to-reach areas, built-up grime, persistent limescale, grease, and discolorations using specialized machinery. Perfect for spring cleaning, post-renovation recovery, or moving into a new home to establish a pristine hygienic baseline.`,
    'daily-cleaning': `Regular maintenance cleaning keeps your home or business fresh, clean, and welcoming on a flexible weekly or bi-weekly schedule. We take care of dusting all reachable surfaces, vacuuming and mopping floors, sanitizing kitchens and bathrooms, and clearing trash bins.`,
    'office-cleaning': `Professional office cleaning provides a pristine, sanitary, and prestigious workspace for your team and clients. We sanitize desks, keyboard areas, meeting rooms, and office kitchens, and empty bins quietly and efficiently—scheduled after hours for zero business disruption.`,
    'gardening': `Our premium garden maintenance keeps your outdoor space in perfect condition throughout the year. We handle professional lawn mowing, hedge trimming, weed removal, seasonal bed preparation, and the complete eco-friendly disposal of all green garden waste.`,
    'moving-furniture': `Kraken logistics moving assistance makes your relocation safe, organized, and stress-free. Our team handles furniture disassembly, secure packing using premium protective blankets, safe transit in specialized moving vans, and expert assembly at your new home.`,
    'mudanza-cajas': `Kraken logistics moving assistance makes your relocation safe, organized, and stress-free. Our team handles furniture disassembly, secure packing using premium protective blankets, safe transit in specialized moving vans, and expert assembly at your new home.`,
    'car-detailing': `Professional automotive detailing restores your car's look and feel to brand-new conditions. We deep-shampoo seats and upholstery, treat leather trim, neutralize odors, and perform a multi-stage exterior hand wash and paint polishing for a deep, long-lasting glass-like shine.`
  };

  const es: Record<string, string> = {
    'window-cleaning': `La limpieza profesional de ventanas incluye el lavado sin marcas de todos los cristales por dentro y por fuera, marcos, alféizares y persianas. Trabajamos con herramientas profesionales (limpiacristales, paños de microfibra y agua desmineralizada pura para vidrios exteriores muy sucios). Las persianas se limpian detalladamente lama por lama.`,
    'end-of-tenancy': `La limpieza de fin de contrato con garantía de entrega incluye una desinfección profunda y completa de toda la propiedad según las estrictas normas suizas. Cada habitación, armario empotrado, baño y electrodoméstico de cocina se limpia a fondo para garantizar una entrega sin objeciones a su arrendador.`,
    'deep-cleaning': `Nuestra limpieza a fondo intensiva combate la suciedad profunda, depósitos de cal rebeldes, grasa y manchas mediante equipos profesionales y productos específicos. Es ideal para la limpieza de primavera, después de reformas o antes de mudarse a un nuevo hogar.`,
    'daily-cleaning': `La limpieza de mantenimiento regular asegura la frescura y el orden constante de su hogar u oficina con un calendario flexible. Nos encargamos de aspirar, fregar suelos, quitar el polvo de las superficies, desinfectar baños y cocinas, y retirar la basura.`,
    'office-cleaning': `La limpieza de oficinas mantiene un espacio de trabajo limpio, higiénico y presentable para sus empleados y clientes. Desinfectamos escritorios, salas de reuniones, cocinas comunes y vaciamos papeleras discretamente fuera del horario laboral para evitar molestias.`,
    'gardening': `Nuestro servicio de jardinería mantiene su zona verde en perfecto estado todo el año. Nos encargamos del corte de césped, poda de setos, eliminación de malas hierbas, preparación estacional de parterres y la retirada ecológica de todos los residuos de jardín.`,
    'moving-furniture': `La asistencia de mudanzas de Kraken Logística garantiza un traslado seguro, organizado y libre de estrés. Nuestro equipo desmonta sus muebles, los protege con mantas premium, los transporta de forma segura en nuestros camiones y los vuelve a montar en su destino.`,
    'mudanza-cajas': `La asistencia de mudanzas de Kraken Logística garantiza un traslado seguro, organizado y libre de estrés. Nuestro equipo desmonta sus muebles, los protege con mantas premium, los transporta de forma segura en nuestros camiones y los vuelve a montar en su destino.`,
    'car-detailing': `El detallado profesional de vehículos devuelve a su automóvil el aspecto y olor a nuevo. Realizamos un champú profundo de tapicería, acondicionamos el cuero, eliminamos olores y realizamos un lavado exterior a mano con pulido de pintura para un brillo espectacular.`
  };

  const defaultDescDE = `Der professionelle Service für ${localizedTitle} wird von unseren geschulten Fachkräften mit modernster Ausrüstung und umweltschonenden Methoden ausgeführt. Wir garantieren höchste Schweizer Gründlichkeit, Zuverlässigkeit und feste, transparente Konditionen exakt angepasst an Ihre Wünsche und Bedürfnisse vor Ort.`;
  const defaultDescEN = `Professional ${localizedTitle} is executed by our highly trained specialists using state-of-the-art equipment and eco-friendly methods. We guarantee maximum Swiss thoroughness, reliable performance, and transparent fixed prices tailored exactly to your unique local needs.`;
  const defaultDescES = `El servicio profesional de ${localizedTitle} es realizado por especialistas capacitados utilizando equipos avanzados y métodos ecológicos. Garantizamos la máxima minuciosidad suiza, confiabilidad absoluta y precios fijos transparentes adaptados exactamente a sus necesidades locales.`;

  let baseText = "";
  if (lang === 'de') baseText = de[sId] || defaultDescDE;
  else if (lang === 'es') baseText = es[sId] || defaultDescES;
  else baseText = en[sId] || defaultDescEN;

  if (cityId) {
    return paraphraseText(baseText, cityId + "_" + sId);
  }
  return baseText;
};

const getLocalizedChecklist = (
  serviceId: string,
  lang: string,
  cityId?: string,
  cityName?: string,
  serviceTitle?: string
): string[] => {
  const sId = serviceId.toLowerCase();
  
  const enChecklists: Record<string, string[]> = {
    'window-cleaning': [
      "Thorough streak-free cleaning of all window glass surfaces (interior & exterior)",
      "Deep cleaning of window frames, outer/inner sills, and weather guards",
      "Wiping and dust removal of external blinds, rolling shutters, and slats",
      "Eco-friendly pure water treatment for hard-to-reach or heavily soiled glass",
      "Streak-free polishing using professional squeegees and microfibers"
    ],
    'end-of-tenancy': [
      "Complete deep cleaning of all living areas, floors, and built-in wardrobes",
      "Intensive scrubbing, scaling, and disinfecting of bathrooms, toilets, and showers",
      "Deep kitchen cleaning including oven, grease hood, fridge, and dishwasher",
      "Full window, frame, blind, and shutter cleaning across the property",
      "100% Handover Guarantee with personal supervisor presence at the inspection"
    ],
    'deep-cleaning': [
      "Deep micro-pore cleaning of all wall and floor tiles, joints, and sealants",
      "Complete removal of stubborn limescale, rust, grease, and carbonized soot",
      "Thorough interior/exterior sanitization of all cabinets, drawers, and shelves",
      "Sanitary deep clean behind heating systems, baseboards, and narrow corners",
      "Disinfection of heavy contact surfaces, doors, light switches, and sockets"
    ],
    'daily-cleaning': [
      "Dusting and damp wiping of all reachable furniture, desks, and shelves",
      "Thorough vacuuming and wet mopping of all hard floors and carpet pathways",
      "Cleaning and disinfecting of bathroom sinks, chrome fittings, mirrors, and toilets",
      "Wiping kitchen countertops, sink areas, and outer appliance surfaces",
      "Emptying waste baskets and sorting standard household recycling"
    ],
    'office-cleaning': [
      "Detailed dust-free wiping of computer desks, screens, and shared tables",
      "Deep floor vacuuming and damp disinfection of walkways and corridors",
      "Sanitization of common meeting rooms, kitchenettes, and employee lounges",
      "Hygienic bathroom cleaning with refill of soaps, towels, and toilet papers",
      "Quiet waste disposal and eco-friendly separation of paper and plastic"
    ],
    'gardening': [
      "Professional lawn mowing, edge detailing, and weed extraction",
      "Trimming of decorative hedges, shrubs, and ornamental branches",
      "Manual weed pulling from flower beds, pathway joints, and gravel surfaces",
      "Clearing garden paths, terraces, and lawn spaces from autumn leaves",
      "Eco-safe green waste composting and removal from your premises"
    ],
    'moving-furniture': [
      "Professional disassembly of wardrobes, beds, shelving, and tables",
      "Wrapping delicate furniture in heavy felt blankets and protective stretch wrap",
      "Secure loading and tight strap-down inside modern transport vans",
      "Safe spedition to the destination by experienced professional drivers",
      "Unpacking, room placement, and exact reconstruction of all furniture pieces"
    ]
  };

  const esChecklists: Record<string, string[]> = {
    'window-cleaning': [
      "Limpieza profunda libre de marcas de todos los cristales (interior y exterior)",
      "Limpieza de marcos, alféizares exteriores/interiores y guías",
      "Limpieza y desempolvado de persianas exteriores y persianas enrollables",
      "Tratamiento ecológico con agua pura desmineralizada para zonas difíciles",
      "Pulido final con paños de microfibra y limpiacristales profesionales"
    ],
    'end-of-tenancy': [
      "Limpieza profunda de todas las habitaciones, suelos y armarios empotrados",
      "Descalcificación y desinfección total de baños, aseos y duchas",
      "Limpieza intensiva de cocina incluyendo horno, campana, nevera y lavavajillas",
      "Limpieza completa de ventanas, marcos y persianas en toda la propiedad",
      "Garantía de Entrega del 100% con presencia del supervisor en la entrega"
    ],
    'deep-cleaning': [
      "Limpieza profunda de microporos en azulejos, juntas y baldosas de suelo",
      "Eliminación total de cal rebelde, óxido, grasa y hollín carbonizado",
      "Desinfección interior y exterior de todos los armarios, cajones y estanterías",
      "Limpieza sanitaria detrás de radiadores, rodapiés y esquinas estrechas",
      "Desinfección de superficies de contacto habituales, puertas e interruptores"
    ],
    'daily-cleaning': [
      "Despolvado y limpieza húmeda de todos los muebles, escritorios y estanterías",
      "Aspirado profundo y fregado húmedo de todos los suelos y alfombras",
      "Limpieza y desinfección de lavabos, grifería, espejos e inodoros",
      "Limpieza de encimeras de cocina, fregaderos y exterior de electrodomésticos",
      "Vaciado de papeleras y clasificación de residuos domésticos"
    ],
    'office-cleaning': [
      "Limpieza detallada sin polvo de escritorios, pantallas y mesas comunes",
      "Aspirado y desinfección húmeda de pasillos y zonas de tránsito",
      "Desinfección de salas de reuniones, cocinas comunes y zonas de descanso",
      "Limpieza higiénica de baños con reposición de jabón y papel toalla",
      "Retirada de basura y separación ecológica de papel y plásticos"
    ],
    'gardening': [
      "Corte de césped profesional, perfilado de bordes y extracción de maleza",
      "Poda de setos ornamentales, arbustos y ramas bajas",
      "Eliminación manual de malas hierbas en parterres y caminos",
      "Limpieza de hojas secas en senderos, terrazas y zonas de césped",
      "Retirada y compostaje ecológico de todos los residuos de jardinería"
    ],
    'moving-furniture': [
      "Desmontaje profesional de armarios, camas, estanterías y mesas",
      "Protección de muebles delicados con mantas de fieltro y film estirable",
      "Carga segura y sujeción firme dentro de furgones modernos",
      "Transporte seguro al destino realizado por conductores experimentados",
      "Descarga, colocación en la habitación asignada y montaje preciso"
    ]
  };

  let list: string[] = [];

  if (lang === 'de' && SERVICE_SEO_CONTENT[sId]) {
    list = [...SERVICE_SEO_CONTENT[sId].checklist];
  } else if (lang === 'es' && esChecklists[sId]) {
    list = [...esChecklists[sId]];
  } else if (enChecklists[sId]) {
    list = [...enChecklists[sId]];
  } else if (SERVICE_SEO_CONTENT[sId]?.checklist) {
    list = [...SERVICE_SEO_CONTENT[sId].checklist];
  } else if (lang === 'es') {
    list = [...(esChecklists[sId] || esChecklists['window-cleaning'])];
  } else {
    list = [...(enChecklists[sId] || enChecklists['window-cleaning'])];
  }

  if (cityId && cityName && serviceTitle) {
    const shuffledList = getDeterministicShuffle(list, cityId + "_" + sId + "_chk_shuf");
    return shuffledList.map((item, idx) => {
      let para = paraphraseText(item, cityId + "_" + sId + "_chk_" + idx, lang);
      return seedCityAndServiceIntoItem(para, idx, cityName, serviceTitle, lang, cityId + "_" + sId + "_chk_seed");
    });
  }

  if (cityId) {
    return list.map((item, idx) => paraphraseText(item, cityId + "_" + sId + "_" + idx, lang));
  }
  return list;
};

const SeoServiceCityPage: React.FC<SeoServiceCityPageProps> = ({ cityId, serviceId, onNavigate }) => {
  const { t, language } = useTranslation();

  const city = CITY_METADATA[cityId.toLowerCase()];
  const service = SERVICE_GERMAN_DATA[serviceId.toLowerCase()];

  // Scroll to top on mount and preserve location context
  useEffect(() => {
    window.scrollTo(0, 0);
    if (cityId) {
      localStorage.setItem('kraken_last_visited_municipality', cityId.toLowerCase());
    }
  }, [cityId, serviceId]);

  if (!city || !service) {
    const rawLang = language || 'de';
    const activeLang = (rawLang === 'de-CH' || rawLang === 'de') ? 'de' : rawLang;
    const currentLang = ['de', 'en', 'fr', 'it', 'es', 'pt'].includes(activeLang) ? activeLang : 'de';
    const tForLang = LOCAL_TRANSLATIONS[currentLang] || LOCAL_TRANSLATIONS['de'];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#001A3D] text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{tForLang['not_found_title']}</h2>
        <p className="text-white/60 mb-6">{tForLang['not_found_desc']}</p>
        <button 
          onClick={() => onNavigate('home')} 
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full font-medium transition-colors"
        >
          {tForLang['back_to_home']}
        </button>
      </div>
    );
  }

  const rawLang = language || 'de';
  const activeLang = (rawLang === 'de-CH' || rawLang === 'de') ? 'de' : rawLang;
  const currentLang = ['de', 'en', 'fr', 'it', 'es', 'pt'].includes(activeLang) ? activeLang : 'de';

  const getTranslation = (key: string, replacements?: Record<string, string>) => {
    const translationsForLang = LOCAL_TRANSLATIONS[currentLang] || LOCAL_TRANSLATIONS['de'];
    let text = translationsForLang[key] || LOCAL_TRANSLATIONS['de'][key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), v);
      });
    }
    const keysToParaphrase = [
      'regional_desc',
      'price_desc',
      'how_booking_works',
      'price_note_desc',
      'step_1_desc',
      'step_2_desc',
      'step_3_desc'
    ];
    if (keysToParaphrase.includes(key)) {
      return paraphraseText(text, cityId + "_" + serviceId + "_" + key, currentLang);
    }
    return text;
  };

  const serviceAsset = services.find(s => s.id.toLowerCase() === serviceId.toLowerCase());
  const getServiceImageUrl = () => {
      if (cityId.toLowerCase() === 'schaffhausen' && schaffhausenServiceImages[serviceId.toLowerCase()]) {
          return schaffhausenServiceImages[serviceId.toLowerCase()];
            }
              return serviceAsset?.imageUrl;
              };

  const localizedTitle = getCleanServiceTitle(serviceId, serviceAsset?.titleKey || '', t, service.title, currentLang);
  const localizedSubtitle = getCleanServiceSubtitle(serviceId, serviceAsset?.titleKey || '', t, service.subtitle, currentLang);
  const localizedDetails = getCleanServiceDetails(serviceId, t, service.detailsGerman, currentLang);
  const localizedCityName = CITY_NAMES[cityId.toLowerCase()]?.[currentLang] || city.germanName;
  const localizedCityDesc = getLocalizedCityDesc(cityId.toLowerCase(), currentLang);
  const localizedBenefits = getLocalizedBenefits(serviceId.toLowerCase(), currentLang, cityId, localizedCityName, localizedTitle);
  const localizedFaqs = getLocalizedFaqs(serviceId.toLowerCase(), currentLang, cityId, localizedCityName, localizedTitle);
  const localizedStartingPrice = translateStartingPrice(service.startingPrice, currentLang);
  const localizedFeatures = getLocalizedFeatures(cityId.toLowerCase(), currentLang);

  // Handle CTA Click: Pre-fill LocalStorage and navigate to Quote builder
  const handleCalculateQuote = () => {
    const quoteData = {
      address: '',
      postcode: city.postcode,
      city: localizedCityName,
    };
    localStorage.setItem('kraken_consultation_data_v2', JSON.stringify(quoteData));
    localStorage.setItem('kraken_preselected_service', service.serviceWizardId);
    onNavigate('consultation');
  };

  // Generate structured JSON-LD schemas (lang=de / identical server and client to prevent React #418)
  const schemaCityName = city.germanName;
  const startPrice = serviceId.toLowerCase() === "end-of-tenancy" ? 520 : serviceId.toLowerCase() === "deep-cleaning" ? 320 : 45;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Professionelle ${service.title} in ${schemaCityName}`,
    "serviceType": service.title,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Kraken Properties and Facilities Management",
      "telephone": "+41774505705",
      "email": "kai@krakenpfm.ch",
      "url": "https://krakenpfm.ch"
    },
    "areaServed": {
      "@type": "City",
      "name": schemaCityName
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "CHF",
      "lowPrice": startPrice,
      "offerCount": 10
    },
    "url": `https://krakenpfm.ch/services/${cityId.toLowerCase()}/${serviceId.toLowerCase()}`
  };

  const replacedFaqsForSchema = localizedFaqs.map(faq => ({
    "@type": "Question",
    "name": faq.q.replace(/\[comuna\]/g, schemaCityName),
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a.replace(/\[comuna\]/g, schemaCityName)
    }
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": replacedFaqsForSchema
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://krakenpfm.ch"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://krakenpfm.ch/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": schemaCityName,
        "item": `https://krakenpfm.ch/reinigung/${cityId.toLowerCase() === "schaffhausen" ? "kanton-schaffhausen" : cityId.toLowerCase() === "winterthur" ? "region-winterthur" : "region-zuerich"}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": service.title,
        "item": `https://krakenpfm.ch/services/${cityId.toLowerCase()}/${serviceId.toLowerCase()}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" id={`seo-page-${cityId}-${serviceId}`}>
      {/* Structured JSON-LD schemas for Search Engines */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* 2. Majestic Abyssal Hero Banner */}
      <section 
        data-header-theme="dark"
        className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden text-white bg-[#001226]"
      >
        {/* Full-bleed Service Image covering the entire background with absolutely zero filter */}
        {getServiceImageUrl() && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-transform duration-1000 z-0"
            style={{ backgroundImage: `url(${getServiceImageUrl()})` }}
          />
        )}

        {/* Dark linear gradient overlay for elite visual contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001226]/95 via-[#001226]/80 to-transparent z-0 pointer-events-none" />

        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text and Actions inside a highly transparent, premium dark glass container */}
            <div className="lg:col-span-7 bg-[#001226]/25 backdrop-blur-[6px] p-8 sm:p-12 rounded-[2.5rem] border border-white/10 space-y-6 shadow-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007AFF]/10 border border-[#007AFF]/20 text-blue-300 font-mono text-xs mb-2 tracking-wide">
                <MapPinIcon className="w-3.5 h-3.5 text-[#007AFF]" />
                <span>{getTranslation('region_service', { city: localizedCityName })}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                {currentLang === 'de' ? (
                  <>Professionelle <span className="text-[#007AFF]">{localizedTitle}</span> in {localizedCityName}</>
                ) : (
                  <>{getTranslation('professional_service', { service: localizedTitle, city: localizedCityName })}</>
                )}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
                {localizedSubtitle}. {getLocalizedHeroBlurb(currentLang, cityId, serviceId, localizedCityName)}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={handleCalculateQuote}
                  className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider bg-[#007AFF] hover:bg-[#007AFF]/90 text-white shadow-lg shadow-[#007AFF]/20 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {getTranslation('quote_cta_2min')}
                </button>
                <button 
                  onClick={() => {
                    const element = document.getElementById('details-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300"
                >
                  {getTranslation('more_details')}
                </button>
              </div>
            </div>

            {/* Right Column: Kept empty to display the gorgeous background image without any obstructions on large devices */}
            <div className="lg:col-span-5 hidden lg:block" />
          </div>
        </div>

        {/* Waves divider */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-slate-50" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
      </section>

      {/* 3. Abyssal Tech Specs (HUD metadata card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/5 text-[#002D5B] flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="w-6 h-6 text-[#002D5B]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getTranslation('region')}</div>
              <div className="text-sm font-black text-[#002D5B]">{getTranslation('region_val', { city: localizedCityName })}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/5 text-[#002D5B] flex items-center justify-center flex-shrink-0">
              <ClockIcon className="w-6 h-6 text-[#002D5B]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getTranslation('response_time')}</div>
              <div className="text-sm font-black text-[#002D5B]">{getTranslation('response_time_val')}</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/5 text-[#002D5B] flex items-center justify-center flex-shrink-0">
              <KrakenStandardIcon className="w-6 h-6 text-[#002D5B]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getTranslation('standard')}</div>
              <div className="text-sm font-black text-[#002D5B]">{getTranslation('standard_val')}</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/5 text-[#002D5B] flex items-center justify-center flex-shrink-0">
              <SustainabilityIcon className="w-6 h-6 text-[#002D5B]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getTranslation('footprint')}</div>
              <div className="text-sm font-black text-[#002D5B]">{getTranslation('footprint_val')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Two-Column Deep-Dive Information & Direct CTA Configurator */}
      <section id="details-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Local service description */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-[#002D5B] tracking-tight">
                {getTranslation('why_partner', { service: localizedTitle, city: localizedCityName })}
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {getUniqueWhyPartnerExplanation(cityId, serviceId, currentLang, localizedCityName, localizedTitle)}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#002D5B]">{getTranslation('exclusive_benefits')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {localizedBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What is [Service]? */}
            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-[#002D5B] tracking-tight">
                {currentLang === 'de' ? `Was ist ${localizedTitle}?` :
                 currentLang === 'es' ? `¿Qué es ${localizedTitle}?` :
                 `What is ${localizedTitle}?`}
              </h2>
              <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <p className="text-slate-600 leading-relaxed text-base">
                  {getServiceMarketingExplanation(serviceId, currentLang, localizedTitle, cityId, localizedCityName)}
                </p>
              </div>
            </div>

            {/* DATA Section (The emerald-green styled specs card) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                {currentLang === 'de' ? "UNSERE SERVICE-DATEN" :
                 currentLang === 'es' ? "DATOS DE LA EMPRESA" :
                 "COMPANY SERVICE DATA"}
              </h3>
              <div className="bg-[#fcfdfd] border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Item 1: Hours */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {currentLang === 'de' ? "Öffnungszeiten" : currentLang === 'es' ? "Horarios" : "Opening Hours"}
                      </h4>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">Mo–Sa: 07:00 – 20:00</p>
                    </div>
                  </div>

                  {/* Item 2: GAV declared */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {currentLang === 'de' ? "GAV-konform" : currentLang === 'es' ? "Garantía GAV" : "GAV Declared"}
                      </h4>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">
                        {currentLang === 'de' ? "AHV-Deklaration & Fairer Lohn" :
                         currentLang === 'es' ? "Declaración AHV y Salario Justo" :
                         "AHV Declared & Fair Wages"}
                      </p>
                    </div>
                  </div>

                  {/* Item 3: Materials included */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {currentLang === 'de' ? "Materialien" : currentLang === 'es' ? "Materiales" : "Materials"}
                      </h4>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">
                        {currentLang === 'de' ? "Profi-Ausrüstung inbegriffen" :
                         currentLang === 'es' ? "Todo incluido y profesional" :
                         "Pro equipment & tools included"}
                      </p>
                    </div>
                  </div>

                  {/* Item 4: Insurance */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {currentLang === 'de' ? "Versicherungsschutz" : currentLang === 'es' ? "Seguro de Daños" : "Liability Insurance"}
                      </h4>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">
                        {currentLang === 'de' ? "Bis CHF 5 Mio. versichert" :
                         currentLang === 'es' ? "Asegurado hasta CHF 5 Millones" :
                         "Insured up to CHF 5 Million"}
                      </p>
                    </div>
                  </div>

                  {/* Item 5: Permanent team */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {currentLang === 'de' ? "Unser Team" : currentLang === 'es' ? "Nuestro Equipo" : "Our Staff"}
                      </h4>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">
                        {currentLang === 'de' ? "Feste, geprüfte Stamm-Mitarbeiter" :
                         currentLang === 'es' ? "Personal de confianza fijo" :
                         "Permanent, certified local staff"}
                      </p>
                    </div>
                  </div>

                  {/* Item 6: Canton Origin */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {currentLang === 'de' ? "Herkunft" : currentLang === 'es' ? "Origen" : "Local Presence"}
                      </h4>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">
                        {currentLang === 'de' ? `Lokal aus Kanton ${cityId.toLowerCase() === 'zurich' || cityId.toLowerCase() === 'winterthur' || cityId.toLowerCase() === 'kloten' || cityId.toLowerCase() === 'buelach' || cityId.toLowerCase() === 'dietikon' || cityId.toLowerCase() === 'uster' ? "Zürich (ZH)" : "Schaffhausen (SH)"}` :
                         currentLang === 'es' ? `Local en Cantón ${cityId.toLowerCase() === 'zurich' || cityId.toLowerCase() === 'winterthur' || cityId.toLowerCase() === 'kloten' || cityId.toLowerCase() === 'buelach' || cityId.toLowerCase() === 'dietikon' || cityId.toLowerCase() === 'uster' ? "Zúrich (ZH)" : "Schaffhausen (SH)"}` :
                         `Based in Canton ${cityId.toLowerCase() === 'zurich' || cityId.toLowerCase() === 'winterthur' || cityId.toLowerCase() === 'kloten' || cityId.toLowerCase() === 'buelach' || cityId.toLowerCase() === 'dietikon' || cityId.toLowerCase() === 'uster' ? "Zurich (ZH)" : "Schaffhausen (SH)"}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            {SERVICE_SEO_CONTENT[serviceId.toLowerCase()] && (() => {
              const pricingL10n = {
                de: {
                  title: `Was kostet ${localizedTitle} in ${localizedCityName}?`,
                  intro: `Wir setzen bei Kraken PFM auf transparente Preise und kundenfreundliche Konditionen. Für viele Standardaufgaben bieten wir Ihnen attraktive Festpreise (Festpreisgarantie) an, damit Sie von Anfang an volle Planungssicherheit haben. Hier finden Sie unsere unverbindliche Preisübersicht für die Region ${localizedCityName}:`,
                  scope: "Leistungsumfang",
                  price: "Richtpreis (CHF)",
                  noticeTitle: "💡 Wichtiger Hinweis zu den Preisen:",
                  noticeDesc: "Der tatsächliche Endpreis richtet sich nach der genauen Quadratmeterzahl (m²), dem individuellen Zustand des Objekts sowie speziellen Kundenwünschen. Nutzen Sie unseren intelligenten Online-Konfigurator, um in nur 2 Minuten Ihr persönliches, massgeschneidertes Festpreisangebot zu berechnen!"
                },
                en: {
                  title: `How much does ${localizedTitle} cost in ${localizedCityName}?`,
                  intro: `At Kraken PFM, we focus on transparent prices and customer-friendly terms. For many standard tasks, we offer attractive flat rates (fixed-price guarantee) to ensure you have full planning security from the start. Here is our non-binding price overview for the ${localizedCityName} region:`,
                  scope: "Service Scope",
                  price: "Guide Price (CHF)",
                  noticeTitle: "💡 Important note regarding prices:",
                  noticeDesc: "The actual final price depends on the exact square footage (m²), the individual condition of the property, and specific customer requirements. Use our intelligent online estimator to calculate your personal, tailored fixed-price quote in just 2 minutes!"
                },
                es: {
                  title: `¿Cuánto cuesta ${localizedTitle} en ${localizedCityName}?`,
                  intro: `En Kraken PFM apostamos por precios transparentes y condiciones favorables para el cliente. Para muchas tareas estándar, ofrecemos tarifas ficas atractivas (garantía de precio fijo) para que tenga total seguridad de planificación desde el principio. Aquí encontrará nuestro desglose de precios orientativos para la región de ${localizedCityName}:`,
                  scope: "Alcance del Servicio",
                  price: "Precio Orientativo (CHF)",
                  noticeTitle: "💡 Nota importante sobre los precios:",
                  noticeDesc: "El precio final real dependerá de la superficie exacta (m²), el estado particular del inmueble y los deseos específicos del cliente. ¡Utilice nuestro configurador inteligente online para calcular su presupuesto de precio fijo personalizado en solo 2 minutos!"
                },
                fr: {
                  title: `Combien coûte ${localizedTitle} à ${localizedCityName}?`,
                  intro: `Chez Kraken PFM, nous misons sur des prix transparents et des conditions avantageuses pour le client. Pour de nombreuses tâches standard, nous proposons des forfaits attractifs (garantie de prix fixe) afin de vous assurer une totale sécurité de planification dès le départ. Voici notre aperçu indicatif des tarifs pour la région de ${localizedCityName} :`,
                  scope: "Étendue des Prestations",
                  price: "Prix Indicatif (CHF)",
                  noticeTitle: "💡 Remarque importante sur les prix :",
                  noticeDesc: "Le prix final réel dépend de la surface exacte (m²), de l'état individuel de la propriété et des demandes spécifiques du client. Utilisez notre configurateur en ligne intelligent pour calculer votre devis personnalisé à prix fixe en seulement 2 minutes !"
                },
                it: {
                  title: `Quanto costa ${localizedTitle} a ${localizedCityName}?`,
                  intro: `In Kraken PFM puntiamo su prezzi trasparenti e condizioni vantaggiose per il cliente. Per molte attività standard offriamo tariffe fisse interessanti (garanzia di prezzo fisso) per garantirvi la massima sicurezza di pianificazione fin dall'inizio. Ecco la nostra panoramica indicativa dei prezzi per la regione di ${localizedCityName}:`,
                  scope: "Prestazioni Incluse",
                  price: "Prezzo Indicativo (CHF)",
                  noticeTitle: "💡 Nota importante sui prezzi:",
                  noticeDesc: "Il prezzo finale effettivo dipende dalla metratura esatta (m²), dallo stato specifico dell'immobile e dalle richieste del cliente. Utilizzate il nostro configuratore online intelligente per ottenere un preventivo a prezzo fisso personalizzato in soli 2 minuti!"
                },
                pt: {
                  title: `Quanto custa ${localizedTitle} em ${localizedCityName}?`,
                  intro: `Na Kraken PFM, focamos em preços transparentes e condições amigáveis para o cliente. Para muitas tarefas padrão, oferecemos tarifas fixas atraentes (garantia de preço fixo) para garantir total segurança de planeamento desde o início. Aqui está a nossa tabela de preços indicativos para a região de ${localizedCityName}:`,
                  scope: "Escopo do Serviço",
                  price: "Preço Indicativo (CHF)",
                  noticeTitle: "💡 Nota importante sobre os preços:",
                  noticeDesc: "O preço final exato depende da área em metros quadrados (m²), do estado do imóvel e de requisitos específicos. Utilize o nosso configurador online inteligente para calcular o seu orçamento de preço fixo personalizado em apenas 2 minutos!"
                }
              };

              const l10n = pricingL10n[currentLang as keyof typeof pricingL10n] || pricingL10n.en;

              return (
                <div className="space-y-4 pt-4">
                  <h2 className="text-2xl font-black text-[#002D5B] tracking-tight">
                    {l10n.title}
                  </h2>
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {getLocalizedPricingIntro(cityId, serviceId, currentLang, localizedCityName)}
                    </p>
                    <div className="overflow-hidden border border-slate-100 rounded-2xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{l10n.scope}</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{l10n.price}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {getLocalizedPrices(serviceId, currentLang).map((price, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4">
                                <div className="text-sm font-bold text-slate-800">{price.label}</div>
                                <div className="text-xs text-slate-400 font-medium">{price.basis}</div>
                              </td>
                              <td className="p-4 text-right">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono text-xs font-bold">
                                  {price.range}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 border border-slate-100 leading-relaxed">
                      <span className="font-bold text-slate-700 block mb-1">{l10n.noticeTitle}</span>
                      {getLocalizedPricingNotice(cityId, serviceId, currentLang, localizedCityName)}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* What's Included Section (Always visible, localized) */}
            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-[#002D5B] tracking-tight">
                {currentLang === 'de' ? `Was ist bei ${localizedTitle} inbegriffen?` :
                 currentLang === 'es' ? `¿Qué incluye el servicio de ${localizedTitle}?` :
                 currentLang === 'fr' ? `Qu'est-ce qui est inclus dans notre service de ${localizedTitle}?` :
                 currentLang === 'it' ? `Cosa è incluso nel nostro servizio di ${localizedTitle}?` :
                 currentLang === 'pt' ? `O que está incluído no nosso serviço de ${localizedTitle}?` :
                 `What is included in our ${localizedTitle}?`}
              </h2>
              <div className="bg-[#f0fbf6] border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-6">
                <p className="text-sm text-slate-600 font-medium">
                  {getLocalizedChecklistIntro(cityId, serviceId, currentLang, localizedCityName, localizedTitle)}
                </p>
                <ul className="space-y-3">
                  {getLocalizedChecklist(serviceId, currentLang, cityId, localizedCityName, localizedTitle).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Duration Alert Box */}
                <div className="flex gap-3 bg-white border border-slate-100 p-4 rounded-2xl items-center shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-4 h-4 text-[#007AFF]" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 leading-snug">
                    {getServiceDurationText(serviceId, currentLang, cityId, localizedCityName)}
                  </span>
                </div>
              </div>
            </div>

            {/* Two-Card Row: How to book & Local curiosity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Card A: How do I book? */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-lg font-bold text-[#002D5B]">
                  {currentLang === 'de' ? `Wie buche ich ${localizedTitle} in ${localizedCityName}?` :
                   currentLang === 'es' ? `¿Cómo reservo ${localizedTitle} en ${localizedCityName}?` :
                   currentLang === 'fr' ? `Comment réserver ${localizedTitle} à ${localizedCityName}?` :
                   currentLang === 'it' ? `Come prenotare ${localizedTitle} a ${localizedCityName}?` :
                   currentLang === 'pt' ? `Como reservar ${localizedTitle} em ${localizedCityName}?` :
                   `How do I book ${localizedTitle} in ${localizedCityName}?`}
                </h4>
                <div className="space-y-4 text-xs font-sans">
                  {getLocalizedBookingSteps(currentLang, cityId, serviceId, localizedCityName).map((stepText, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#007AFF]/10 text-[#007AFF] font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</div>
                      <p className="text-slate-600 leading-normal mt-0.5">{stepText}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card B: Region-specific curiosity */}
              <div className="bg-amber-50/30 border border-amber-100/70 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <h4 className="text-base font-bold text-[#002D5B]">
                    {currentLang === 'de' ? `${localizedCityName} — was Sie wissen sollten` :
                     currentLang === 'es' ? `${localizedCityName} — lo que debe saber` :
                     currentLang === 'fr' ? `${localizedCityName} — ce que vous devez savoir` :
                     currentLang === 'it' ? `${localizedCityName} — cosa c'è da sapere` :
                     currentLang === 'pt' ? `${localizedCityName} — o que precisa de saber` :
                     `${localizedCityName} — what you should know`}
                  </h4>
                </div>
                <ul className="space-y-3">
                  {getLocalizedCuriosity(cityId, serviceId, currentLang).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-700 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* City Specific Service Status and Quality Parameters */}
            <div className="bg-gradient-to-br from-[#001b38] to-[#000d1c] text-slate-300 rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#007AFF]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  {currentLang === 'de' ? `Einsatzbereit in ${localizedCityName}` :
                   currentLang === 'en' ? `Ready for service in ${localizedCityName}` :
                   currentLang === 'fr' ? `Disponible à ${localizedCityName}` :
                   currentLang === 'it' ? `Disponibile a ${localizedCityName}` :
                   currentLang === 'es' ? `Disponible en ${localizedCityName}` :
                   `Disponível em ${localizedCityName}`}
                </span>
              </div>
              <h4 className="text-white text-lg font-black mb-6 font-sans tracking-tight">
                {currentLang === 'de' ? `Spezifikationen für ${localizedCityName}` :
                 currentLang === 'en' ? `Specifications for ${localizedCityName}` :
                 currentLang === 'fr' ? `Spécifications pour ${localizedCityName}` :
                 currentLang === 'it' ? `Specifiche per ${localizedCityName}` :
                 currentLang === 'es' ? `Especificaciones para ${localizedCityName}` :
                 `Especificações para ${localizedCityName}`}
              </h4>
              <div className="space-y-4 text-sm font-sans">
                {localizedFeatures.map((feat, idx) => {
                  const parts = feat.split(':');
                  const label = parts[0];
                  const value = parts[1] || 'YES';
                  return (
                    <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-slate-400 font-medium">{label}</span>
                      <span className="text-white font-extrabold">{value}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400 font-medium">{getTranslation('min_order_value')}:</span>
                  <span className="text-[#007AFF] font-extrabold">{getTranslation('min_order_value_val')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pre-Configurator & Direct Action Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xl sticky top-24 space-y-6">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {getTranslation('estimated_price', { city: localizedCityName.toUpperCase() })}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#002D5B]">{localizedStartingPrice}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{getTranslation('vat_incl')}</span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  {currentLang === 'de' ? `Unsere Preise sind transparent kalkuliert. Keine Anfahrtsgebühren für ${localizedCityName}, voll versichertes Personal, modernste Ausrüstung.` : 
                   currentLang === 'en' ? `Our prices are calculated transparently. No travel fees for ${localizedCityName}, fully insured staff, state-of-the-art equipment.` :
                   currentLang === 'fr' ? `Nos prix sont calculés de manière transparente. Pas de frais de déplacement pour ${localizedCityName}, personnel entièrement assuré, équipement de pointe.` :
                   currentLang === 'it' ? `I nostri prezzi sono calcolati in modo trasparente. Nessuna spesa di trasferta per ${localizedCityName}, personale completamente assicurato, attrezzature all’avanguardia.` :
                   currentLang === 'es' ? `Nuestros precios se calculan de manera transparente. Sin costes de viaje para ${localizedCityName}, personal totalmente asegurado, equipos de última generación.` :
                   `Os nossos preços são calculados de forma transparente. Sem custos de viagem para ${localizedCityName}, pessoal totalmente segurado, equipamento de última geração.`}
                </p>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#002D5B]">{getTranslation('how_booking_works')}</h4>
                  <div className="space-y-4 text-xs">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#007AFF]/10 text-[#007AFF] font-bold flex items-center justify-center flex-shrink-0">1</div>
                      <p className="text-slate-600 mt-0.5"><strong>{getTranslation('step_1_title')}</strong> {getTranslation('step_1_desc')}</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#007AFF]/10 text-[#007AFF] font-bold flex items-center justify-center flex-shrink-0">2</div>
                      <p className="text-slate-600 mt-0.5"><strong>{getTranslation('step_2_title')}</strong> {getTranslation('step_2_desc')}</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#007AFF]/10 text-[#007AFF] font-bold flex items-center justify-center flex-shrink-0">3</div>
                      <p className="text-slate-600 mt-0.5"><strong>{getTranslation('step_3_title')}</strong> {getTranslation('step_3_desc')}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCalculateQuote}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#002D5B] hover:bg-[#001D3B] text-white transition-all duration-300 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group"
                >
                  <span>{getTranslation('calculate_prices', { city: localizedCityName })}</span>
                  <ChevronRightIcon className="w-4 h-4 text-blue-300 transform group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                  <span>{getTranslation('secure_transmission')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions (FAQ) section */}
      <section className="bg-slate-100 py-20 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-black text-[#002D5B] tracking-tight">{getTranslation('faq_title')}</h2>
            <p className="text-slate-500 font-medium">{getTranslation('faq_desc', { service: localizedTitle, city: localizedCityName })}</p>
          </div>

          <div className="space-y-6">
            {localizedFaqs.map((faq, idx) => {
              const displayQ = faq.q.replace(/\[comuna\]/g, localizedCityName);
              const displayA = faq.a.replace(/\[comuna\]/g, localizedCityName);
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-[#002D5B] flex items-start gap-3">
                    <span className="text-[#007AFF] font-mono">Q.</span>
                    <span>{displayQ}</span>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed pl-7 border-l-2 border-slate-100">
                    {displayA}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Dynamic Internal Linking Grid for Search Engine Crawlers & Real Users */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Row A: Other services in same city */}
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#002D5B]/5 text-[#002D5B] uppercase tracking-wider">
              {currentLang === 'de' ? 'Dienstleistungen' : 'Services'}
            </div>
            <h3 className="text-2xl font-black text-[#002D5B] tracking-tight">{getTranslation('other_services', { city: localizedCityName })}</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {services.filter(s => s.id !== serviceId && s.id !== 'turnover-cleaning' && s.id !== 'kitchen-deep-cleaning').map(s => {
              const otherTitle = getCleanServiceTitle(s.id, s.titleKey, t, s.id, currentLang);
              return (
                <div 
                  key={s.id}
                  onClick={() => {
                    // Update URL and navigation parameters
                    const targetPath = `/services/${cityId}/${s.id}`;
                    window.history.pushState(null, '', targetPath);
                    // Force re-trigger location change event
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 hover:border-[#007AFF]/40 cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="text-slate-400 group-hover:text-[#007AFF] transition-colors mb-4">
                    {getServiceIconComponent(s.id, "w-6 h-6 stroke-[1.2]")}
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#002D5B] transition-colors">{otherTitle} {localizedCityName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row B: Same service in other cities */}
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#002D5B]/5 text-[#002D5B] uppercase tracking-wider">
              {currentLang === 'de' ? 'Standorte' : 'Locations'}
            </div>
            <h3 className="text-2xl font-black text-[#002D5B] tracking-tight">{getTranslation('other_regions', { service: localizedTitle })}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Object.keys(CITY_METADATA).filter(c => c !== cityId).map(cKey => {
              const otherCity = CITY_METADATA[cKey];
              const otherCityLocalizedName = CITY_NAMES[cKey]?.[currentLang] || otherCity.germanName;
              return (
                <div 
                  key={cKey}
                  onClick={() => {
                    const targetPath = `/services/${cKey}/${serviceId}`;
                    window.history.pushState(null, '', targetPath);
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-[#007AFF]/40 cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity bg-cover bg-center" style={{ backgroundImage: `url(${otherCity.image})` }} />
                  <div className="relative z-10 space-y-2">
                    <div className="text-[10px] font-bold text-[#002D5B] uppercase tracking-widest flex items-center gap-1.5">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#007AFF]" />
                      <span>{otherCityLocalizedName}</span>
                    </div>
                    <h4 className="text-base font-black text-slate-800 group-hover:text-[#002D5B]">{localizedTitle} {otherCityLocalizedName}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{getTranslation('regional_desc', { city: otherCityLocalizedName })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Einsatzgebiete Section */}
      {(() => {
        const targetSlugs = [
          { slug: "zurich", name: "Zürich", region: "zuerich" },
          { slug: "buelach", name: "Bülach", region: "zuerich" },
          { slug: "kloten", name: "Kloten", region: "zuerich" },
          { slug: "dietikon", name: "Dietikon", region: "zuerich" },
          { slug: "uster", name: "Uster", region: "zuerich" },
          { slug: "winterthur", name: "Winterthur", region: "winterthur" },
          { slug: "schaffhausen", name: "Schaffhausen", region: "schaffhausen" },
          { slug: "neuhausen-am-rheinfall", name: "Neuhausen am Rheinfall", region: "schaffhausen", urlSlug: "neuhausen" },
          { slug: "thayngen", name: "Thayngen", region: "schaffhausen" },
          { slug: "stein-am-rhein", name: "Stein am Rhein", region: "schaffhausen" },
          { slug: "feuerthalen", name: "Feuerthalen", region: "schaffhausen" }
        ];

        const regionGroupList = [
          {
            id: 'zuerich',
            title: currentLang === 'de' ? 'Kanton Zürich & Unterland' : 'Zurich Region',
            cities: targetSlugs.filter(s => s.region === 'zuerich')
          },
          {
            id: 'winterthur',
            title: currentLang === 'de' ? 'Region Winterthur' : 'Winterthur Region',
            cities: targetSlugs.filter(s => s.region === 'winterthur')
          },
          {
            id: 'schaffhausen',
            title: currentLang === 'de' ? 'Kanton Schaffhausen & Umland' : 'Schaffhausen Region',
            cities: targetSlugs.filter(s => s.region === 'schaffhausen')
          }
        ];

        return (
          <section className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#007AFF]/10 text-[#007AFF] uppercase tracking-wider mb-3">
                  {currentLang === 'de' ? 'Verfügbarkeit' : 'Availability'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#001D3D] tracking-tight">
                  {currentLang === 'de' ? `Unsere Standorte für ${service.title}` : `Our service areas for ${service.title}`}
                </h2>
                <p className="mt-4 text-slate-600">
                  {currentLang === 'de' 
                    ? `Wir bieten professionelle ${service.title} in allen unten aufgeführten Gemeinden an. Wählen Sie Ihren Standort für lokale Tarife:` 
                    : `We offer professional ${service.title} in all municipalities listed below. Select your location for local rates:`}
                </p>
              </div>

              <div className="space-y-16">
                {regionGroupList.map(regionGroup => (
                  <div key={regionGroup.id} className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-xl font-bold text-[#001D3D] tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF]" />
                        {regionGroup.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regionGroup.cities.map(c => {
                        const mun = MUNICIPALITIES.find(m => m.slug === c.slug);
                        const plzStr = mun ? mun.plz.join(', ') : '';
                        const blurb = mun ? mun.localContext.uniqueBlurb : '';
                        const destinationSlug = c.urlSlug || c.slug;
                        const targetPath = `/services/${destinationSlug}/${serviceId}`;

                        return (
                          <div 
                            key={c.slug}
                            onClick={() => {
                              window.history.pushState(null, '', targetPath);
                              window.dispatchEvent(new Event('popstate'));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-white p-6 rounded-3xl border border-slate-200/60 hover:border-[#007AFF] hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-[#007AFF]">
                                <MapPinIcon className="w-4 h-4 text-[#007AFF]" />
                                <span className="font-mono text-xs font-semibold">{plzStr} {c.name}</span>
                              </div>
                              <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#007AFF] transition-colors">
                                {localizedTitle} {c.name}
                              </h4>
                              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                {blurb}
                              </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#007AFF] group-hover:text-[#007AFF]/80">
                              <span>{currentLang === 'de' ? 'Details & Preise ansehen' : 'View details & prices'}</span>
                              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}
    </div>
  );
};

export default SeoServiceCityPage;
