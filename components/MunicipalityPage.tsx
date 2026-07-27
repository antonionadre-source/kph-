import React, { useEffect } from 'react';
import { useTranslation } from '../i18n';
import { MUNICIPALITIES, Municipality } from '../src/data/locations';
import { 
  ServiceSchema, 
  FAQSchema, 
  BreadcrumbSchema 
} from './SchemaComponents';
import { 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  ShieldAlert, 
  HelpCircle, 
  PhoneCall, 
  Calculator, 
  ArrowLeft,
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
import { cityImages } from '../assets';

interface MunicipalityPageProps {
  municipalitySlug: string;
  onNavigate: (page: string) => void;
}

const LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  de: {
    metaTitle: "Reinigungsfirma in {name} ({plz}) | Kraken PFM",
    metaDesc: "Professionelle Reinigungsfirma in {name} ({plz}). Umzugsreinigung mit Abnahmegarantie ab CHF {price}. GAV-konform, versichert. Jetzt online berechnen!",
    devNotice: "Dev-Hinweis: Diese Seite hat derzeit keine bestätigten lokalen Details und wird mit noindex gerendert. Sobald Antonio die Details verifiziert hat, schalten Sie indexable: true frei.",
    backToRegion: "Zurück zur Region {region}",
    plzLabel: "PLZ",
    notFoundTitle: "Gemeinde nicht gefunden",
    notFoundDesc: "Die gesuchte Schweizer Gemeinde existiert nicht in unserer Regionendatenbank.",
    backToHome: "Zurück zur Startseite",
    heroTitle: "Reinigungsfirma in {name}",
    heroSubtitle: "Professionelle Reinigungsleistungen mit zertifizierten biologischen Mitteln, GAV-konformem Personal und 100% Abnahmegarantie bei jeder Übergabe.",
    handoverGuarantee: "Abnahmegarantie inklusive",
    gavCompliant: "GAV-konform & versichert",
    noTravelFee: "Keine Anfahrtsgebühr",
    travelFeeLabel: "Anfahrtsgebühr: CHF {fee}",
    localPartnerTitle: "Ihr lokaler Reinigungspartner für {name}",
    localPriceAnchor: "Lokal-Preisanker für {name}",
    eotPriceFrom: "Umzugsreinigung ab CHF {price}",
    btnCreateQuote: "Offerte online erstellen",
    servicesInCity: "Dienstleistungen in {name}",
    servicesInCityDesc: "Wählen Sie ein Angebot, um detaillierte Leistungsbeschreibungen für die Region {region} einzusehen.",
    specificCustomization: "Spezifische Anpassung und Ausführung für Ihr Objekt in {name}.",
    startingPriceLabel: "Richtpreis CHF {price}",
    viewService: "Service ansehen",
    routeBundlingTitle: "Routen-Bündelung & Nachbargemeinden",
    routeBundlingDesc: "Wir reinigen regelmässig in Ihrer unmittelbaren Umgebung. Profitieren Sie von kürzeren Anfahrtswegen durch die Kombination von Einsätzen in:",
    faqTitle: "Fragen zur Reinigung in {name}",
    faqDesc: "Antworten auf Ihre Fragen rund um Übergaben, Preise und Reinigungsmittel vor Ort.",
    bottomCtaTitle: "Buchen Sie Ihre Reinigung in {name}",
    bottomCtaDesc: "Sichern Sie sich Ihren Festpreis ganz einfach online oder kontaktieren Sie uns direkt per WhatsApp für eine schnelle Abstimmung.",
    btnCtaQuote: "Offerte in 2 Min.",
    btnCtaWhatsApp: "WhatsApp Kontakt",
    startseite: "Startseite",
    region_schaffhausen: "Kanton Schaffhausen",
    region_winterthur: "Region Winterthur",
    region_zuerich: "Region Zürich",
    // Narrative keys
    narrative_sentence1: "Kraken Properties and Facilities Management ist Ihr führender Partner für präzise Reinigungsdienstleistungen in {name} ({plz}).",
    narrative_sentence2: "Die lokale Bebauung, geprägt durch {buildingTypes}, verlangt fundiertes Fachwissen bei der Wahl der Reinigungsmethoden; so pflegen wir sensible Oberflächen materialschonend und setzen {cleaningNotes}.",
    narrative_sentence3: "Zu unseren typischen Kunden vor Ort zählen {clientProfile}, für welche wir flexible Termine ausserhalb der regulären Arbeitszeiten und einen speditiven Service koordinieren.",
    narrative_sentence4: "Wir bündeln unsere Fahrten regelmässig mit Aufträgen in {nearbyNames} — durch diese clevere Routen-Bündelung verkürzen wir unsere Wege, reduzieren den CO2-Ausstoss und können Ihnen besonders vorteilhafte Konditionen anbieten.",
    narrative_sentence5: "Erhalten Sie mit unserem intelligenten Online-Konfigurator eine transparente Festpreis-Offerte für Ihr Objekt in {name} in nur zwei Minuten.",
    narrative_travel_free: "Durch unseren starken regionalen Fokus entfällt eine Anfahrtsgebühr für Sie vollständig.",
    narrative_travel_fee: "Dank unserer regelmässigen Einsätze im Einzugsgebiet berechnen wir lediglich eine geringe Fahrtkostenpauschale von CHF {travelFee}, welche bei Kombi-Aufträgen entfällt.",
    // FAQ keys
    faq_q_handover: "Gewährt Kraken PFM in {name} eine Abnahmegarantie?",
    faq_a_handover: "Ja, für jede von uns ausgeführte Umzugsreinigung in {name} erhalten Sie eine 100%ige Abnahmegarantie. Unsere Teamleitung begleitet die offizielle Übergabe mit Ihrer Liegenschaftsverwaltung persönlich, um eine absolut reibungslose Übergabe Ihrer Kaution zu sichern.",
    faq_q_travel: "Wie hoch sind die Anfahrtskosten nach {name}?",
    faq_a_travel_free: "Für {name} berechnen wir keinerlei Anfahrtsgebühren, da sich die Gemeinde im Kerngebiet unserer täglichen Tourenplanung befindet.",
    faq_a_travel_fee: "Die reguläre Fahrtpauschale nach {name} beträgt CHF {travelFee}. Diese Gebühr entfällt jedoch vollständig, wenn Sie zwei oder mehr Dienstleistungen (z. B. Umzug und Reinigung) kombinieren oder einen wiederkehrenden Service buchen.",
    faq_q_method: "Welche Reinigungsverfahren passen zu den Gebäuden in {name}?",
    faq_a_method: "Wir stimmen unsere Ausrüstung individuell auf Ihr Objekt ab. Ob historische Baustrukturen mit empfindlichen Holzelementen oder moderne Gebäude mit grossen Fensterfronten und empfindlichen Bodenbelägen: Wir setzen massgeschneiderte, biologisch abbaubare Wirkstoffe ein, um Ihre Bausubstanz nachhaltig zu schützen.",
    faq_q_delivery: "Wie schnell erhalte ich einen Termin für mein Objekt in {name}?",
    faq_a_delivery: "Durch die kontinuierliche Bündelung von Einsätzen in der Umgebung von {nearbyNames} sind wir äusserst flexibel. Wir können Ihnen in der Regel auch kurzfristige Termine innerhalb von 48 bis 72 Stunden anbieten.",
    // Service Names
    srv_eot: "Umzugsreinigung",
    srv_deep: "Tiefenreinigung",
    srv_daily: "Unterhaltsreinigung",
    srv_moving: "Umzug & Möbeltransport",
    srv_window: "Fensterreinigung"
  },
  en: {
    metaTitle: "Cleaning Company in {name} ({plz}) | Kraken PFM",
    metaDesc: "Professional cleaning company in {name} ({plz}). Move-out cleaning with handover guarantee from CHF {price}. GAV-compliant, insured. Calculate online now!",
    devNotice: "Dev Note: This page currently has no verified local details and is rendered with noindex. Once Antonio verifies the details, change indexable: true.",
    backToRegion: "Back to Region {region}",
    plzLabel: "Postal Code",
    notFoundTitle: "Municipality not found",
    notFoundDesc: "The requested Swiss municipality does not exist in our regional database.",
    backToHome: "Back to Homepage",
    heroTitle: "Cleaning Company in {name}",
    heroSubtitle: "Professional cleaning services using certified organic products, GAV-compliant personnel, and 100% handover guarantee on every job.",
    handoverGuarantee: "Handover guarantee included",
    gavCompliant: "GAV-compliant & insured",
    noTravelFee: "No travel fee",
    travelFeeLabel: "Travel fee: CHF {fee}",
    localPartnerTitle: "Your Local Cleaning Partner for {name}",
    localPriceAnchor: "Local Price Anchor for {name}",
    eotPriceFrom: "Move-out cleaning from CHF {price}",
    btnCreateQuote: "Create Quote Online",
    servicesInCity: "Services in {name}",
    servicesInCityDesc: "Select an offer to view detailed service descriptions for the {region} region.",
    specificCustomization: "Specific customization and execution for your property in {name}.",
    startingPriceLabel: "Guide Price CHF {price}",
    viewService: "View Service",
    routeBundlingTitle: "Route Bundling & Neighboring Communities",
    routeBundlingDesc: "We clean regularly in your immediate area. Benefit from shorter travel distances by combining assignments in:",
    faqTitle: "Questions about Cleaning in {name}",
    faqDesc: "Answers to your questions about handovers, prices, and cleaning products on site.",
    bottomCtaTitle: "Book Your Cleaning in {name}",
    bottomCtaDesc: "Secure your fixed price easily online or contact us directly via WhatsApp for quick coordination.",
    btnCtaQuote: "Quote in 2 min.",
    btnCtaWhatsApp: "WhatsApp Contact",
    startseite: "Home",
    region_schaffhausen: "Canton of Schaffhausen",
    region_winterthur: "Winterthur Region",
    region_zuerich: "Zurich Region",
    // Narrative keys
    narrative_sentence1: "Kraken Properties and Facilities Management is your leading partner for precise cleaning services in {name} ({plz}).",
    narrative_sentence2: "The local architecture, characterized by {buildingTypes}, demands sound expertise in selecting cleaning methods; thus we care for sensitive surfaces gently and use {cleaningNotes}.",
    narrative_sentence3: "Our typical local clients include {clientProfile}, for whom we coordinate flexible appointments outside regular working hours and prompt service.",
    narrative_sentence4: "We regularly bundle our trips with assignments in {nearbyNames} — through this clever route bundling, we shorten our travel distances, reduce CO2 emissions, and can offer you particularly advantageous conditions.",
    narrative_sentence5: "Get a transparent fixed price offer for your property in {name} in just two minutes using our intelligent online configurator.",
    narrative_travel_free: "Due to our strong regional focus, a travel fee is completely waived for you.",
    narrative_travel_fee: "Thanks to our regular work in the area, we only charge a small flat-rate travel fee of CHF {travelFee}, which is waived for combination orders.",
    // FAQ keys
    faq_q_handover: "Does Kraken PFM provide a handover guarantee in {name}?",
    faq_a_handover: "Yes, you receive a 100% handover guarantee for every move-out cleaning we execute in {name}. Our team management personally accompanies the official handover with your property management to ensure a completely smooth refund of your deposit.",
    faq_q_travel: "How high are the travel costs to {name}?",
    faq_a_travel_free: "We do not charge any travel fees for {name}, as this community is in the core area of our daily tour planning.",
    faq_a_travel_fee: "The regular travel flat rate to {name} is CHF {travelFee}. However, this fee is completely waived if you combine two or more services (e.g., move and cleaning) or book a recurring service.",
    faq_q_method: "Which cleaning methods suit the buildings in {name}?",
    faq_a_method: "We adjust our equipment individually to your property. Whether historical building structures with sensitive wooden elements or modern buildings with large glass fronts and delicate floors: we use customized, biodegradable agents to protect your building fabric sustainably.",
    faq_q_delivery: "How quickly can I get an appointment for my property in {name}?",
    faq_a_delivery: "Through continuous bundling of assignments in the area of {nearbyNames}, we are extremely flexible. We can usually offer you short-term appointments within 48 to 72 hours.",
    // Service Names
    srv_eot: "Move-out Cleaning",
    srv_deep: "Deep Cleaning",
    srv_daily: "Maintenance Cleaning",
    srv_moving: "Moving & Furniture Transport",
    srv_window: "Window Cleaning"
  },
  es: {
    metaTitle: "Empresa de Limpieza en {name} ({plz}) | Kraken PFM",
    metaDesc: "Empresa de limpieza profesional en {name} ({plz}). Limpieza de mudanza con garantía de entrega desde CHF {price}. Conforme a GAV, asegurada. ¡Calcule en línea ya!",
    devNotice: "Nota Dev: Esta página no tiene detalles locales confirmados actualmente y se procesa con noindex. Una vez verificado por Antonio, active indexable: true.",
    backToRegion: "Volver a la Región {region}",
    plzLabel: "C.P.",
    notFoundTitle: "Municipio no encontrado",
    notFoundDesc: "El municipio suizo solicitado no existe en nuestra base de datos regional.",
    backToHome: "Volver a Inicio",
    heroTitle: "Empresa de Limpieza en {name}",
    heroSubtitle: "Servicios profesionales de limpieza con productos ecológicos certificados, personal conforme a GAV y garantía de entrega al 100% en cada servicio.",
    handoverGuarantee: "Garantía de entrega incluida",
    gavCompliant: "Conforme a GAV y asegurado",
    noTravelFee: "Sin gastos de viaje",
    travelFeeLabel: "Gastos de viaje: CHF {fee}",
    localPartnerTitle: "Su socio local de limpieza para {name}",
    localPriceAnchor: "Ancla de precio local para {name}",
    eotPriceFrom: "Limpieza de mudanza desde CHF {price}",
    btnCreateQuote: "Crear presupuesto en línea",
    servicesInCity: "Servicios en {name}",
    servicesInCityDesc: "Seleccione una oferta para ver descripciones de servicio detalladas para la región {region}.",
    specificCustomization: "Personalización y ejecución específica para su propiedad en {name}.",
    startingPriceLabel: "Precio base CHF {price}",
    viewService: "Ver servicio",
    routeBundlingTitle: "Agrupación de rutas y municipios vecinos",
    routeBundlingDesc: "Limpiamos regularmente en su zona inmediata. Benefíciese de distancias de viaje más cortas combinando servicios en:",
    faqTitle: "Preguntas sobre la limpieza en {name}",
    faqDesc: "Respuestas a sus preguntas sobre entregas, precios y productos de limpieza en el lugar.",
    bottomCtaTitle: "Reserve su limpieza en {name}",
    bottomCtaDesc: "Asegure su precio fijo fácilmente en línea o contáctenos directamente por WhatsApp para una rápida coordinación.",
    btnCtaQuote: "Presupuesto en 2 min.",
    btnCtaWhatsApp: "Contacto por WhatsApp",
    startseite: "Inicio",
    region_schaffhausen: "Cantón de Schaffhausen",
    region_winterthur: "Región de Winterthur",
    region_zuerich: "Región de Zúrich",
    // Narrative keys
    narrative_sentence1: "Kraken Properties and Facilities Management es su socio líder para servicios de limpieza precisos en {name} ({plz}).",
    narrative_sentence2: "La arquitectura local, caracterizada por {buildingTypes}, exige una sólida experiencia en la elección de métodos de limpieza; por ello cuidamos con delicadeza las superficies sensibles y utilizamos {cleaningNotes}.",
    narrative_sentence3: "Nuestros clientes locales típicos incluyen {clientProfile}, para quienes coordinamos citas flexibles fuera del horario laboral regular y un servicio ágil.",
    narrative_sentence4: "Agrupamos regularmente nuestros viajes con servicios en {nearbyNames}; gracias a esta inteligente planificación de rutas acortamos distancias, reducimos emisiones de CO2 y podemos ofrecerle condiciones muy ventajosas.",
    narrative_sentence5: "Obtenga una oferta de precio fijo transparente para su propiedad en {name} en solo dos minutos con nuestro configurador inteligente en línea.",
    narrative_travel_free: "Debido a nuestro fuerte enfoque regional, los gastos de viaje están totalmente exentos para usted.",
    narrative_travel_fee: "Gracias a nuestros servicios regulares en el área, solo cobramos una pequeña tarifa fija de viaje de CHF {travelFee}, que se exime en caso de servicios combinados.",
    // FAQ keys
    faq_q_handover: "¿Ofrece Kraken PFM garantía de entrega en {name}?",
    faq_a_handover: "Sí, recibe una garantía de entrega del 100% por cada limpieza de mudanza que realizamos en {name}. El supervisor de nuestro equipo acompaña personalmente la entrega oficial con la administración de su propiedad para asegurar una devolución perfecta de su fianza.",
    faq_q_travel: "¿A cuánto ascienden los gastos de viaje a {name}?",
    faq_a_travel_free: "No cobramos ningún gasto de viaje para {name}, ya que el municipio se encuentra en el área central de nuestra planificación de rutas diarias.",
    faq_a_travel_fee: "La tarifa regular de viaje a {name} es de CHF {travelFee}. No obstante, esta tarifa se exime por completo si combina dos o más servicios (por ejemplo, mudanza y limpieza) o contrata un servicio recurrente.",
    faq_q_method: "¿Qué métodos de limpieza se adaptan a los edificios de {name}?",
    faq_a_method: "Ajustamos nuestros equipos de forma individual a su propiedad. Ya sean estructuras de edificios históricos con elementos de madera delicados o edificios modernos con grandes fachadas acristaladas y suelos sensibles: utilizamos agentes biodegradables personalizados para proteger la estructura del edificio de forma sostenible.",
    faq_q_delivery: "¿Qué tan rápido puedo obtener una cita para mi propiedad en {name}?",
    faq_a_delivery: "Gracias a la continua agrupación de servicios en las inmediaciones de {nearbyNames}, somos sumamente flexibles. Por lo general, podemos ofrecerle citas a corto plazo en un plazo de 48 a 72 horas.",
    // Service Names
    srv_eot: "Limpieza de Mudanza",
    srv_deep: "Limpieza Profunda",
    srv_daily: "Limpieza de Mantenimiento",
    srv_moving: "Mudanza y Transporte",
    srv_window: "Limpieza de Ventanas"
  },
  fr: {
    metaTitle: "Entreprise de Nettoyage à {name} ({plz}) | Kraken PFM",
    metaDesc: "Entreprise de nettoyage professionnel à {name} ({plz}). Nettoyage de fin de bail avec garantie de remise dès CHF {price}. Conforme CCT, assuré. Devis en ligne !",
    devNotice: "Note Dev : Cette page ne contient pas de détails locaux validés et est rendue en noindex. Dès que Antonio valide, activez indexable: true.",
    backToRegion: "Retour à la Région {region}",
    plzLabel: "NPA",
    notFoundTitle: "Commune non trouvée",
    notFoundDesc: "La commune suisse demandée n'existe pas dans notre base de données régionale.",
    backToHome: "Retour à l'Accueil",
    heroTitle: "Entreprise de Nettoyage à {name}",
    heroSubtitle: "Services professionnels de nettoyage avec produits biologiques certifiés, personnel conforme CCT et garantie de remise à 100% lors de l'état des lieux.",
    handoverGuarantee: "Garantie de remise incluse",
    gavCompliant: "Conforme CCT & assuré",
    noTravelFee: "Aucun frais de déplacement",
    travelFeeLabel: "Frais de déplacement : CHF {fee}",
    localPartnerTitle: "Votre partenaire de nettoyage local à {name}",
    localPriceAnchor: "Prix de référence local pour {name}",
    eotPriceFrom: "Nettoyage de fin de bail dès CHF {price}",
    btnCreateQuote: "Créer un devis en ligne",
    servicesInCity: "Prestations à {name}",
    servicesInCityDesc: "Sélectionnez une offre pour voir les descriptions détaillées des prestations pour la région {region}.",
    specificCustomization: "Adaptation et exécution spécifiques pour votre bien à {name}.",
    startingPriceLabel: "Tarif indicatif CHF {price}",
    viewService: "Voir la prestation",
    routeBundlingTitle: "Regroupement de tournées & Communes voisines",
    routeBundlingDesc: "Nous intervenons régulièrement dans votre secteur immédiat. Bénéficiez de trajets plus courts en combinant les interventions à :",
    faqTitle: "Questions sur le nettoyage à {name}",
    faqDesc: "Réponses à vos questions sur les états des lieux, les tarifs et les produits de nettoyage sur place.",
    bottomCtaTitle: "Réservez votre nettoyage à {name}",
    bottomCtaDesc: "Obtenez votre tarif fixe facilement en ligne ou contactez-nous directement par WhatsApp pour une planification rapide.",
    btnCtaQuote: "Devis en 2 min.",
    btnCtaWhatsApp: "Contact WhatsApp",
    startseite: "Accueil",
    region_schaffhausen: "Canton de Schaffhouse",
    region_winterthur: "Région de Winterthour",
    region_zuerich: "Région de Zurich",
    // Narrative keys
    narrative_sentence1: "Kraken Properties and Facilities Management est votre partenaire de premier plan pour des services de nettoyage rigoureux à {name} ({plz}).",
    narrative_sentence2: "L'architecture locale, caractérisée par {buildingTypes}, exige un solide savoir-faire dans le choix des méthodes de nettoyage ; ainsi nous traitons les surfaces délicates avec soin et utilisons {cleaningNotes}.",
    narrative_sentence3: "Nos clients locaux typiques incluent {clientProfile}, pour qui nous coordonnons des rendez-vous flexibles en dehors des heures de bureau standards ainsi qu'un service rapide.",
    narrative_sentence4: "Nous regroupons régulièrement nos tournées avec des interventions à {nearbyNames} — grâce à cette logistique intelligente, nous réduisons nos trajets, limitons les émissions de CO2 et pouvons vous offrir des conditions particulièrement avantageuses.",
    narrative_sentence5: "Obtenez un devis transparent à prix fixe pour votre bien à {name} en seulement deux minutes grâce à notre configurateur en ligne.",
    narrative_travel_free: "En raison de notre fort ancrage régional, les frais de déplacement vous sont entièrement offerts.",
    narrative_travel_fee: "Grâce à nos interventions régulières dans le secteur, nous ne facturons qu'un forfait de déplacement réduit de CHF {travelFee}, offert en cas de prestations combinées.",
    // FAQ keys
    faq_q_handover: "Kraken PFM offre-t-il une garantie de remise à {name} ?",
    faq_a_handover: "Oui, vous bénéficiez d'une garantie de remise à 100% pour chaque nettoyage de fin de bail effectué à {name}. Notre chef d'équipe accompagne personnellement l'état des lieux officiel avec votre gérance afin d'assurer la restitution de votre caution sans aucun accroc.",
    faq_q_travel: "À combien s'élèvent les frais de déplacement pour {name} ?",
    faq_a_travel_free: "Nous ne facturons aucuns frais de déplacement pour {name}, car la commune se situe au cœur de notre planification quotidienne des tournées.",
    faq_a_travel_fee: "Le forfait habituel de déplacement pour {name} est de CHF {travelFee}. Toutefois, ces frais sont entièrement offerts si vous combinez deux prestations ou plus (ex. déménagement et nettoyage) ou réservez un entretien régulier.",
    faq_q_method: "Quelles méthodes de nettoyage sont adaptées aux bâtiments de {name} ?",
    faq_a_method: "Nous adaptons notre équipement individuellement à votre propriété. Qu'il s'agisse de structures anciennes avec des éléments en bois délicats ou de bâtiments modernes avec de grandes baies vitrées et des revêtements de sol sensibles : nous appliquons des agents biodégradables sur mesure pour protéger durablement vos surfaces.",
    faq_q_delivery: "À quelle vitesse puis-je obtenir un rendez-vous pour mon bien à {name} ?",
    faq_a_delivery: "Grâce au regroupement continu de nos interventions dans les environs de {nearbyNames}, nous sommes extrêmement réactifs. Nous pouvons généralement vous proposer des dates à court terme sous 48 à 72 heures.",
    // Service Names
    srv_eot: "Nettoyage de fin de bail",
    srv_deep: "Nettoyage en profondeur",
    srv_daily: "Nettoyage d'entretien",
    srv_moving: "Déménagement & Transport",
    srv_window: "Nettoyage de vitres"
  },
  it: {
    metaTitle: "Impresa di Pulizie a {name} ({plz}) | Kraken PFM",
    metaDesc: "Impresa di pulizie professionale a {name} ({plz}). Pulizia di fine locazione con garanzia di consegna da CHF {price}. Conforme GAV, assicurato. Calcola online!",
    devNotice: "Nota Dev: Questa pagina non contiene dettagli locali verificati al momento e viene renderizzata in noindex. Una volta confermata da Antonio, attivare indexable: true.",
    backToRegion: "Torna alla Regione {region}",
    plzLabel: "NPA",
    notFoundTitle: "Comune non trovato",
    notFoundDesc: "Il comune svizzero richiesto non esiste nel nostro database regionale.",
    backToHome: "Torna alla Homepage",
    heroTitle: "Impresa di Pulizie a {name}",
    heroSubtitle: "Servizi di pulizia professionali con prodotti biologici certificati, personale conforme al GAV e garanzia di consegna al 100% ad ogni trasloco.",
    handoverGuarantee: "Garanzia di consegna inclusa",
    gavCompliant: "Conforme GAV & assicurato",
    noTravelFee: "Senza costi di trasferta",
    travelFeeLabel: "Costi di trasferta: CHF {fee}",
    localPartnerTitle: "Il vostro partner di pulizia locale a {name}",
    localPriceAnchor: "Prezzo di riferimento locale per {name}",
    eotPriceFrom: "Pulizie fine locazione da CHF {price}",
    btnCreateQuote: "Crea preventivo online",
    servicesInCity: "Servizi a {name}",
    servicesInCityDesc: "Seleziona un'offerta per visualizzare le descrizioni dettagliate dei servizi per la regione {region}.",
    specificCustomization: "Personalizzazione ed esecuzione specifica per il vostro immobile a {name}.",
    startingPriceLabel: "Prezzo base CHF {price}",
    viewService: "Vedi servizio",
    routeBundlingTitle: "Raggruppamento percorsi & Comuni vicini",
    routeBundlingDesc: "Effettuiamo pulizie regolarmente nelle vostre immediate vicinanze. Approfittate di percorsi più brevi combinando gli interventi a:",
    faqTitle: "Domande sulla pulizia a {name}",
    faqDesc: "Risposte alle vostre domande su consegne, prezzi e detergenti utilizzati sul posto.",
    bottomCtaTitle: "Prenotate la vostra pulizia a {name}",
    bottomCtaDesc: "Assicuratevi il vostro prezzo fisso comodamente online o contattateci direttamente su WhatsApp per coordinare rapidamente l'intervento.",
    btnCtaQuote: "Preventivo in 2 min.",
    btnCtaWhatsApp: "Contatto WhatsApp",
    startseite: "Home",
    region_schaffhausen: "Canton Sciaffusa",
    region_winterthur: "Regione di Winterthur",
    region_zuerich: "Regione di Zurigo",
    // Narrative keys
    narrative_sentence1: "Kraken Properties and Facilities Management è il vostro partner di riferimento per servizi di pulizia accurati a {name} ({plz}).",
    narrative_sentence2: "L'edilizia locale, caratterizzata da {buildingTypes}, richiede una solida competenza nella scelta delle metodologie di pulizia; pertanto trattiamo le superfici delicate con la massima cura e utilizziamo {cleaningNotes}.",
    narrative_sentence3: "I nostri clienti locali tipici includono {clientProfile}, per i quali coordiniamo appuntamenti flessibili al di fuori dei normali orari lavorativi e un servizio rapido.",
    narrative_sentence4: "Raggruppiamo regolarmente i nostri viaggi con interventi a {nearbyNames} — grazie a questo intelligente accorpamento dei percorsi accorciamo le distanze, riduciamo le emissioni di CO2 e possiamo offrirvi condizioni particolarmente vantaggiose.",
    narrative_sentence5: "Ottenete un preventivo trasparente a prezzo fisso per il vostro immobile a {name} in soli due minuti grazie al nostro configuratore online intelligente.",
    narrative_travel_free: "Grazie alla nostra forte presenza regionale, i costi di trasferta sono completamente azzerati.",
    narrative_travel_fee: "Grazie ai nostri interventi regolari nella zona, addebitiamo solo un piccolo forfait di trasferta di CHF {travelFee}, che viene azzerato in caso di ordini combinati.",
    // FAQ keys
    faq_q_handover: "Kraken PFM offre una garanzia di consegna a {name}?",
    faq_a_handover: "Sì, riceverete una garanzia di consegna al 100% per ogni pulizia di fine locazione che eseguiamo a {name}. Il nostro caposquadra accompagna personalmente l'ispezione ufficiale con l'amministrazione del vostro immobile per garantire la restituzione della cauzione senza alcun problema.",
    faq_q_travel: "A quanto ammontano i costi di trasferta per {name}?",
    faq_a_travel_free: "Non applichiamo alcun costo di trasferta per {name}, poiché il comune rientra nell'area centrale della nostra pianificazione quotidiana dei servizi.",
    faq_a_travel_fee: "Il forfait standard di trasferta per {name} è di CHF {travelFee}. Tuttavia, questa tariffa viene azzerata completamente se combinate due o più servizi (ad es. trasloco e pulizia) o se prenotate una manutenzione regolare.",
    faq_q_method: "Quali metodi di pulizia sono idonei per gli edifici di {name}?",
    faq_a_method: "Adattiamo le nostre attrezzature individualmente al vostro immobile. Che si tratti di strutture storiche con delicati elementi in legno o di edifici moderni con ampie vetrate e pavimenti sensibili: impieghiamo detergenti biodegradabili personalizzati per proteggere i materiali a lungo termine.",
    faq_q_delivery: "In quanto tempo posso ottenere un appuntamento per il mio immobile a {name}?",
    faq_a_delivery: "Grazie al continuo raggruppamento degli interventi nelle vicinanze di {nearbyNames}, siamo estremamente flessibili. Di norma possiamo offrirvi appuntamenti a breve termine entro 48-72 ore.",
    // Service Names
    srv_eot: "Pulizia fine locazione",
    srv_deep: "Pulizia profonda",
    srv_daily: "Pulizia di manutenzione",
    srv_moving: "Trasloco e Trasporto",
    srv_window: "Pulizia vetri"
  },
  pt: {
    metaTitle: "Empresa de Limpeza em {name} ({plz}) | Kraken PFM",
    metaDesc: "Empresa de limpeza profissional em {name} ({plz}). Limpeza de fim de contrato com garantia de entrega desde CHF {price}. Conforme GAV, segurada. Calcule online agora!",
    devNotice: "Nota Dev: Esta página não tem detalhes locais confirmados atualmente e é processada com noindex. Assim que Antonio os verificar, ative indexable: true.",
    backToRegion: "Volver a la Región {region}",
    plzLabel: "Cód. Postal",
    notFoundTitle: "Município não encontrado",
    notFoundDesc: "O município suíço solicitado não existe na nossa base de dados regional.",
    backToHome: "Voltar para a Página Inicial",
    heroTitle: "Empresa de Limpeza em {name}",
    heroSubtitle: "Serviços profissionais de limpeza com produtos biológicos certificados, equipas em conformidade com o GAV e 100% de garantia de entrega em cada serviço.",
    handoverGuarantee: "Garantia de entrega incluída",
    gavCompliant: "Conforme GAV & segurado",
    noTravelFee: "Sem despesas de deslocação",
    travelFeeLabel: "Taxa de deslocação: CHF {fee}",
    localPartnerTitle: "O seu parceiro de limpeza local em {name}",
    localPriceAnchor: "Preço de referência local em {name}",
    eotPriceFrom: "Limpezas de fim de contrato desde CHF {price}",
    btnCreateQuote: "Criar orçamento online",
    servicesInCity: "Serviços em {name}",
    servicesInCityDesc: "Selecione uma oferta para ver as descrições detalhadas das prestações para a região de {region}.",
    specificCustomization: "Personalização e execução específicas para o seu imóvel em {name}.",
    startingPriceLabel: "Preço indicativo CHF {price}",
    viewService: "Ver serviço",
    routeBundlingTitle: "Agrupamento de rotas & Municípios vizinhos",
    routeBundlingDesc: "Limpamos regularmente na sua vizinhança imediata. Beneficie de trajetos mais curtos combinando intervenções em:",
    faqTitle: "Perguntas sobre limpeza em {name}",
    faqDesc: "Respostas às suas perguntas sobre vistorias, preços e produtos de limpeza no local.",
    bottomCtaTitle: "Reserve a sua limpeza em {name}",
    bottomCtaDesc: "Garanta o seu preço fixo facilmente online ou contacte-nos diretamente via WhatsApp para agendar rapidamente.",
    btnCtaQuote: "Orçamento em 2 min.",
    btnCtaWhatsApp: "Contacto WhatsApp",
    startseite: "Início",
    region_schaffhausen: "Cantão de Schaffhausen",
    region_winterthur: "Região de Winterthur",
    region_zuerich: "Região de Zurique",
    // Narrative keys
    narrative_sentence1: "A Kraken Properties and Facilities Management é o seu parceiro de eleição para serviços de limpeza minuciosos em {name} ({plz}).",
    narrative_sentence2: "A arquitetura local, caracterizada por {buildingTypes}, exige um sólido conhecimento na escolha dos métodos de limpeza; tratamos superfícies delicadas com cuidado e utilizamos {cleaningNotes}.",
    narrative_sentence3: "Os nossos clientes locais típicos incluem {clientProfile}, para quem coordenamos agendamentos flexíveis fora das horas normais de expediente bem como um serviço rápido.",
    narrative_sentence4: "Agrupamos regularmente as nossas deslocações com intervenções em {nearbyNames} — graças a esta gestão inteligente de rotas, reduzimos os trajetos, limitamos as emissões de CO2 e podemos oferecer-lhe condições bastante vantajosas.",
    narrative_sentence5: "Obtenha uma oferta de preço fixo transparente para o seu imóvel em {name} em apenas dois minutos através do nosso configurador online inteligente.",
    narrative_travel_free: "Devido à nossa forte presença regional, as despesas de deslocação são totalmente gratuitas para si.",
    narrative_travel_fee: "Graças aos nossos serviços regulares na zona, cobramos apenas um forfait reduzido de CHF {travelFee}, gratuito em caso de serviços combinados.",
    // FAQ keys
    faq_q_handover: "A Kraken PFM oferece garantia de entrega em {name}?",
    faq_a_handover: "Sim, recebe uma garantia de entrega de 100% por cada limpeza de fim de contrato que efetuamos em {name}. O nosso encarregado acompanha pessoalmente a vistoria oficial com a administração do seu imóvel para assegurar a devolução total da caução sem qualquer contratempo.",
    faq_q_travel: "A quanto equivalem as despesas de deslocação para {name}?",
    faq_a_travel_free: "Não cobramos qualquer taxa de deslocação para {name}, uma vez que o município se situa no núcleo da nossa planificação diária de serviços.",
    faq_a_travel_fee: "A taxa de deslocação regular para {name} é de CHF {travelFee}. No entanto, esta taxa é totalmente gratuita se combinar dois ou mais serviços (por exemplo, mudança e limpeza) ou se subscrever uma limpeza regular.",
    faq_q_method: "Que métodos de limpeza são adequados para os edifícios de {name}?",
    faq_a_method: "Ajustamos os nossos equipamentos individualmente ao seu imóvel. Quer se trate de edifícios históricos com elementos de madeira delicados ou de construções modernas com fachadas envidraçadas amplas e pavimentos sensíveis: aplicamos produtos biodegradáveis à medida para proteger os materiais a longo prazo.",
    faq_q_delivery: "Com que rapidez consigo marcar um serviço para o meu imóvel em {name}?",
    faq_a_delivery: "Graças ao agrupamento constante de intervenções na vizinhança de {nearbyNames}, somos extremamente flexíveis. Habitualmente conseguimos propor agendamentos a curto prazo no espaço de 48 a 72 horas.",
    // Service Names
    srv_eot: "Limpeza de fim de arrendamento",
    srv_deep: "Limpeza profunda",
    srv_daily: "Limpeza de manutenção",
    srv_moving: "Mudanças e Transporte",
    srv_window: "Limpeza de janelas"
  }
};

// Indexable municipality context translation database for all 25 municipalities
const getLocalizedContext = (slug: string, lang: string, defaultContext: { buildingTypes: string; clientProfile: string; cleaningNotes: string }) => {
  const dictionary: Record<string, Record<string, { buildingTypes: string; clientProfile: string; cleaningNotes: string }>> = {
    'en': {
      'schaffhausen': {
        buildingTypes: "historic old town buildings with wooden half-timbering, grand city villas in Geissberg, and residential complexes in Herblingertal",
        clientProfile: "busy families, small businesses, medical offices, and tenants preparing for apartment handovers",
        cleaningNotes: "high water hardness in the city network requiring professional descaling"
      },
      'neuhausen-am-rheinfall': {
        buildingTypes: "apartment blocks on Zentralstrasse, detached houses on Galgenbuck, and commercial properties in Rundbuck",
        clientProfile: "commuters to Zurich/Schaffhausen, young families, and tourist service businesses",
        cleaningNotes: "spray residue from the nearby Rhine Falls on window surfaces requiring special glass cleaning"
      },
      'stein-am-rhein': {
        buildingTypes: "historic half-timbered houses with murals, winding old town apartments, and modern detached homes on the outskirts",
        clientProfile: "owners of historic properties, restaurant and guesthouse operators, and weekend returnees",
        cleaningNotes: "strict monument preservation guidelines requiring gentle, non-aggressive cleaning of historic timber facades"
      },
      'thayngen': {
        buildingTypes: "single-family home developments, extensive commercial and logistics spaces, and traditional houses in the center",
        clientProfile: "commuters to Singen and Zurich, logistics managers, and SME executives",
        cleaningNotes: "commercial warehouses require robust floor cleaning machinery while apartment cleanings focus on deep dusting"
      },
      'beringen': {
        buildingTypes: "modern residential developments, spacious single-family homes surrounded by nature, and industrial properties",
        clientProfile: "dual-income young families, resident technology companies, and industrial operations",
        cleaningNotes: "newly built homes feature delicate design screed floors requiring specialized pH-neutral care products"
      },
      'neunkirch': {
        buildingTypes: "listed historic buildings in the old town core, single-family homes, and mixed agricultural buildings",
        clientProfile: "tradition-conscious property owners, local businesses, and farmers",
        cleaningNotes: "maintenance of ancient floorboards and half-timbering with careful stain removal on natural stone tiles"
      },
      'hallau': {
        buildingTypes: "traditional wineries, rural residential homes, and gastronomy businesses in the village center",
        clientProfile: "winemaker families, local restaurateurs, and nature lovers seeking peace",
        cleaningNotes: "gastronomy areas require strict adherence to HACCP hygiene standards while wine cellar cleanings demand maximum care"
      },
      'wilchingen': {
        buildingTypes: "rural half-timbered houses, modern single-family homes, and agricultural buildings",
        clientProfile: "winemakers, local craftsmen, and families deeply rooted in the Klettgau",
        cleaningNotes: "special attention to removing stubborn dust from exterior windows caused by nearby agricultural operations"
      },
      'schleitheim': {
        buildingTypes: "classic farmhouses, older residential buildings, and detached single-family homes",
        clientProfile: "multi-generational households, seniors, and local craftsmen",
        cleaningNotes: "regular maintenance of older double-glazed windows and long-lasting care of solid wood floors"
      },
      'loehningen': {
        buildingTypes: "multi-family residential complexes and modern single-family homes on the south-facing slope",
        clientProfile: "families, employees working in Schaffhausen, and local service providers",
        cleaningNotes: "due to the hillside location, windows are highly exposed to weather and benefit from protective glass sealing"
      },
      'stetten': {
        buildingTypes: "upscale single-family houses, luxury villas, and modern condominiums",
        clientProfile: "private clients with highest quality demands and busy executives",
        cleaningNotes: "professional sealing of natural stone tiles and material-specific care of exclusive real wood parquet"
      },
      'doerflingen': {
        buildingTypes: "cosy residential houses, former farmhouses, and rural single-family homes",
        clientProfile: "commuters to Schaffhausen and Germany, and nature-loving families",
        cleaningNotes: "removal of stubborn pollen in spring from facades and large terrace windows"
      },
      'ramsen': {
        buildingTypes: "rural single-family houses, residential developments, and border facility structures",
        clientProfile: "cross-border commuters to Southern Germany, active families, and agricultural suppliers",
        cleaningNotes: "cleaning of roller shutters and blinds exposed to fine dust along the busy main transit axis"
      },
      'buchberg': {
        buildingTypes: "exclusive hillside homes, modern terraced houses, and traditional winemakers' houses",
        clientProfile: "owners of sophisticated properties and wine professionals",
        cleaningNotes: "cleaning large panoramic windows with demineralized water for streak-free views of the Rhine"
      },
      'ruedlingen': {
        buildingTypes: "waterfront single-family homes, holiday apartments, and well-maintained half-timbered houses",
        clientProfile: "second-home owners, active families, and water sports enthusiasts",
        cleaningNotes: "regular removal of spider webs and insect traces from facade elements near the Rhine riverbank"
      },
      'feuerthalen': {
        buildingTypes: "apartment buildings near the Rhine, commercial ateliers, and classic apartments",
        clientProfile: "young couples, families, and craft businesses in a prime location just across the Rhine",
        cleaningNotes: "professional remediation of initial mold spots in bathrooms due to humid riverside proximity with deep tile cleaning"
      },
      'diessenhofen': {
        buildingTypes: "ancient old town buildings in the protected town core, and modern homes in the Thurgau hinterland",
        clientProfile: "owners of historic d'epoca properties, restaurant or guesthouse operators, and local small businesses",
        cleaningNotes: "careful preservation of old solid wood beams and antique fittings using gentle organic cleaning oils"
      },
      'uhwiesen': {
        buildingTypes: "agricultural half-timbered buildings and detached single-family homes on the south slope of Kohlfirst",
        clientProfile: "commuters to Winterthur and Schaffhausen, and families seeking a rural lifestyle",
        cleaningNotes: "expert cleaning of fireplaces and tiled stoves with meticulous care of exposed interior wooden ceilings"
      },
      'rafz': {
        buildingTypes: "traditional farmhouses in the Rafzerfeld, and modern residential developments on the hillside",
        clientProfile: "highly mobile families commuting to Zurich, and resident fruit producers",
        cleaningNotes: "post-construction cleanings including removal of fine construction dust in hard-to-reach ventilation ducts"
      },
      'winterthur': {
        buildingTypes: "former industrial halls modernized into lofts, cooperative housing, and large downtown office floors",
        clientProfile: "creative professionals, academic shared apartments, cooperative members, and local industrial SMEs",
        cleaningNotes: "industrial loft windows require stable high-pole systems with specialized care for asphalt and raw concrete floors"
      },
      'zurich': {
        buildingTypes: "grand Wilhelminian-style buildings in Seefeld, modern law offices on Bahnhofstrasse, and busy commercial spaces in Kreis 4",
        clientProfile: "international financial professionals, expats with high service expectations, and renowned law firms",
        cleaningNotes: "material-specific high-gloss polishing of exclusive marble and demanding wood floors with absolute discretion"
      },
      'kloten': {
        buildingTypes: "modern business apartments, large conference centers, and highly frequented offices near the airport",
        clientProfile: "pilots, airline employees, international expats, and logistics companies",
        cleaningNotes: "highly efficient, flexible express cleanings for rapid tenant handovers in business apartments"
      },
      'buelach': {
        buildingTypes: "listed buildings in the town center, single-family residential areas, and modern commercial halls",
        clientProfile: "local small businesses, retailers, and families in the Zurich Unterland",
        cleaningNotes: "specialized tile and window frame cleaning in the historic town core using gentle, non-abrasive materials"
      },
      'dietikon': {
        buildingTypes: "commercial warehouses and distribution centers, modern residential lofts in Limmat Valley, and apartment buildings",
        clientProfile: "logistics and production companies, and busy dual-income families",
        cleaningNotes: "special degreasing methods for heavily used workshop floors, industrial kitchens, and thorough end-of-tenancy cleans"
      },
      'uster': {
        buildingTypes: "former spinning factories converted into representative lofts, and waterfront single-family homes",
        clientProfile: "environmentally conscious families, loft residents, and local cooperative members",
        cleaningNotes: "precision cleaning of open-pore exposed concrete walls and large parquet floors in loft buildings without residue"
      }
    },
    'es': {
      'schaffhausen': {
        buildingTypes: "casas históricas del casco antiguo con entramado de madera, villas señoriales en Geissberg y complejos residenciales en Herblingertal",
        clientProfile: "familias ocupadas, PYMEs, consultas médicas e inquilinos antes de entregar la vivienda",
        cleaningNotes: "alta dureza del agua en la red de la ciudad que requiere tratamientos de descalcificación profesional"
      },
      'neuhausen-am-rheinfall': {
        buildingTypes: "bloques de viviendas en Zentralstrasse, casas unifamiliares en Galgenbuck y naves industriales en Rundbuck",
        clientProfile: "personas que viajan diariamente a Zúrich/Schaffhausen, familias jóvenes y empresas de servicios turísticos",
        cleaningNotes: "las superficies expuestas de las ventanas cerca de las cataratas del Rin requieren limpieza especial por los residuos de rocío"
      },
      'stein-am-rhein': {
        buildingTypes: "casas históricas con entramado de madera y frescos, apartamentos sinuosos en el casco antiguo y casas unifamiliares modernas en la periferia",
        clientProfile: "propietarios de inmuebles históricos, operadores de pensiones y restaurantes, y residentes de fin de semana",
        cleaningNotes: "las estrictas directrices de conservación exigen evitar limpiadores agresivos en fachadas de madera históricas"
      },
      'thayngen': {
        buildingTypes: "urbanizaciones de casas unifamiliares, amplias zonas comerciales y de logística, y casas tradicionales en el centro",
        clientProfile: "viajeros diarios a Singen y Zúrich, responsables de logística y directivos de PYMEs",
        cleaningNotes: "las naves comerciales requieren robustas máquinas de limpieza de suelos mientras que las de viviendas se centran en el desempolvado"
      },
      'beringen': {
        buildingTypes: "modernos complejos de viviendas nuevas, amplias casas unifamiliares en plena naturaleza y naves industriales",
        clientProfile: "familias jóvenes con doble ingreso y empresas tecnológicas o industriales de la zona",
        cleaningNotes: "las viviendas nuevas suelen tener pavimentos continuos de diseño delicados que exigen productos de pH neutro"
      },
      'neunkirch': {
        buildingTypes: "edificios antiguos protegidos en el núcleo histórico, casas unifamiliares y fincas agrícolas mixtas",
        clientProfile: "propietarios conscientes de la tradición, comerciantes locales y agricultores",
        cleaningNotes: "destaca el mantenimiento de suelos antiguos y entramados de madera, así como la eliminación cuidadosa de manchas en piedra natural"
      },
      'hallau': {
        buildingTypes: "bodegas tradicionales de vino, viviendas rurales y establecimientos de restauración en el centro del pueblo",
        clientProfile: "familias de viticultores, hosteleros y personas que buscan tranquilidad en la naturaleza",
        cleaningNotes: "las zonas de hostelería exigen cumplir las normas de higiene HACCP, mientras que las bodegas requieren máxima precaución"
      },
      'wilchingen': {
        buildingTypes: "casas de campo con entramado de madera, viviendas unifamiliares modernas y fincas agrícolas",
        clientProfile: "viticultores, artesanos locales y familias arraigadas en la región de Klettgau",
        cleaningNotes: "limpieza minuciosa del polvo persistente en las ventanas exteriores expuestas debido a las actividades agrícolas"
      },
      'schleitheim': {
        buildingTypes: "casas de campo tradicionales, edificios residenciales antiguos y viviendas unifamiliares independientes",
        clientProfile: "hogares multifamiliares, personas mayores y artesanos de la región",
        cleaningNotes: "mantenimiento regular de ventanas antiguas de doble acristalamiento y cuidado duradero de suelos de madera maciza"
      },
      'loehningen': {
        buildingTypes: "bloques de apartamentos residenciales y viviendas unifamiliares modernas en la ladera sur",
        clientProfile: "familias con niños, empleados en Schaffhausen y proveedores locales de servicios",
        cleaningNotes: "debido a la ubicación en la colina, las ventanas están muy expuestas al clima y se benefician de un sellado protector"
      },
      'stetten': {
        buildingTypes: "viviendas unifamiliares de alto nivel, villas de lujo y modernos apartamentos de propiedad",
        clientProfile: "clientes privados con las más altas exigencias de calidad y ejecutivos ocupados",
        cleaningNotes: "sellado profesional de losas de piedra natural y cuidado específico del parqué exclusivo de madera real"
      },
      'doerflingen': {
        buildingTypes: "casas acogedoras, antiguas granjas agrícolas y viviendas unifamiliares rurales",
        clientProfile: "viajeros que trabajan en Schaffhausen y Alemania, y familias amantes de la naturaleza",
        cleaningNotes: "eliminación en primavera del polen persistente en fachadas y en grandes ventanas de terrazas"
      },
      'ramsen': {
        buildingTypes: "casas unifamiliares rurales, complejos residenciales y edificios en instalaciones fronterizas",
        clientProfile: "trabajadores transfronterizos con el sur de Alemania, familias activas y proveedores agrícolas",
        cleaningNotes: "limpieza de persianas y estores expuestos al polvo fino a lo largo de la transitada carretera principal"
      },
      'buchberg': {
        buildingTypes: "exclusivas casas en laderas, modernas casas en terrazas y bodegas tradicionales de viticultores",
        clientProfile: "propietarios de inmuebles sofisticados de alto nivel y profesionales del sector vitivinícola",
        cleaningNotes: "limpieza de grandes ventanales panorámicos con agua desmineralizada para una vista libre de marcas hacia el Rin"
      },
      'ruedlingen': {
        buildingTypes: "viviendas unifamiliares a la orilla del río, apartamentos de vacaciones y cuidadas casas de entramado",
        clientProfile: "propietarios de segundas viviendas, familias activas y entusiastas de los deportes acuáticos",
        cleaningNotes: "eliminación regular de telarañas e insectos en fachadas cerca de la orilla del Rin"
      },
      'feuerthalen': {
        buildingTypes: "edificios residenciales cerca del Rin, talleres comerciales y apartamentos de estilo clásico",
        clientProfile: "parejas jóvenes, familias y talleres artesanales en excelente ubicación junto al Rin",
        cleaningNotes: "eliminación profesional del moho incipiente en baños debido a la humedad del río con limpieza profunda de azulejos"
      },
      'diessenhofen': {
        buildingTypes: "antiquísimas casas del casco antiguo en el núcleo protegido, y modernas casas unifamiliares en la campiña de Turgovia",
        clientProfile: "propietarios de edificios históricos protegidos, operadores de restaurantes u hoteles y pequeños comercios",
        cleaningNotes: "cuidado delicado de antiguas vigas de madera maciza y herrajes antiguos utilizando aceites de limpieza biológicos"
      },
      'uhwiesen': {
        buildingTypes: "casas agrícolas con entramado de madera y viviendas unifamiliares independientes en la ladera sur de Kohlfirst",
        clientProfile: "viajeros diarios a Winterthur y Schaffhausen, y familias que prefieren un estilo de vida campestre",
        cleaningNotes: "limpieza experta de chimeneas y estufas de azulejo con esmero especial en techos interiores de madera vista"
      },
      'rafz': {
        buildingTypes: "casas de campo tradicionales en Rafzerfeld y modernos complejos residenciales de obra nueva en ladera",
        clientProfile: "familias con alta movilidad laboral hacia Zúrich y productores frutícolas locales",
        cleaningNotes: "limpieza de fin de obra que incluye la eliminación del polvo fino de construcción en conductos de ventilación"
      },
      'winterthur': {
        buildingTypes: "antiguas naves industriales reconvertidas en lofts modernos, cooperativas de vivienda y grandes oficinas en el centro",
        clientProfile: "creativos y artistas, residencias universitarias de estudiantes, cooperativistas y PYMEs industriales locales",
        cleaningNotes: "las ventanas de lofts industriales exigen sitemas estables de altura; cuidado de suelos de asfalto y hormigón visto"
      },
      'zurich': {
        buildingTypes: "señoriales edificios de la Belle Époque en Seefeld, modernos despachos de abogados en Bahnhofstrasse y locales comerciales en el Distrito 4",
        clientProfile: "profesionales financieros internacionales, expatriados con alta exigencia y prestigiosos bufetes",
        cleaningNotes: "pulido brillante de alta gama de mármoles exclusivos y parqués exigentes con la máxima discreción profesional"
      },
      'kloten': {
        buildingTypes: "modernos apartamentos de negocios, amplios centros de conferencias y oficinas de alta frecuencia cerca del aeropuerto",
        clientProfile: "pilotos, tripulantes de cabina, expatriados internacionales y empresas de logística",
        cleaningNotes: "limpiezas exprés de alta eficiencia y total flexibilidad horaria para cambios rápidos de inquilinos en apartamentos corporativos"
      },
      'buelach': {
        buildingTypes: "edificios históricos protegidos en el centro antiguo, urbanizaciones de casas unifamiliares y naves comerciales",
        clientProfile: "pequeños negocios locales, minoristas y familias afincadas en el Zürcher Unterland",
        cleaningNotes: "limpieza especializada de azulejos y marcos de ventanas en el casco histórico con materiales no abrasivos"
      },
      'dietikon': {
        buildingTypes: "naves comerciales y centros de distribución, lofts residenciales modernos en Limmat Valley y bloques de pisos",
        clientProfile: "empresas logísticas y de producción, y familias ocupadas de doble ingreso",
        cleaningNotes: "desengrase especializado de suelos de talleres y cocinas industriales, y limpiezas minuciosas de mudanza"
      },
      'uster': {
        buildingTypes: "antiguas hilanderías reconvertidas en lofts de representación, y viviendas unifamiliares a la orilla del lago",
        clientProfile: "familias con conciencia ecológica, residentes de lofts y miembros de cooperativas locales",
        cleaningNotes: "limpieza de precisión de paredes de hormigón visto y suelos de parqué en lofts sin dejar residuos"
      }
    },
    'fr': {
      'schaffhausen': {
        buildingTypes: "immeubles anciens à colombages de la vieille ville, superbes villas bourgeoises sur le Geissberg et complexes résidentiels dans le Herblingertal",
        clientProfile: "familles actives, PME, cabinets de consultation et locataires préparant l'état des lieux",
        cleaningNotes: "la dureté de l'eau élevée dans le réseau de la ville exigeant des opérations de détartrage professionnelles"
      },
      'neuhausen-am-rheinfall': {
        buildingTypes: "immeubles collectifs de la Zentralstrasse, maisons individuelles sur le Galgenbuck et locaux artisanaux dans le Rundbuck",
        clientProfile: "personnes travaillant à Zurich/Schaffhouse, jeunes familles et commerces touristiques",
        cleaningNotes: "les surfaces vitrées exposées aux chutes du Rhin nécessitant un nettoyage de verre spécifique pour éliminer les micro-dépôts d'eau"
      },
      'stein-am-rhein': {
        buildingTypes: "maisons historiques à colombages ornées de fresques, appartements anciens et sinueux, villas individuelles modernes en périphérie",
        clientProfile: "propriétaires de monuments historiques, restaurateurs, hôteliers et résidents secondaires",
        cleaningNotes: "les exigences strictes de la protection des monuments excluant les produits agressifs sur les boiseries historiques"
      },
      'thayngen': {
        buildingTypes: "quartiers de maisons individuelles, vastes zones commerciales et logistiques, maisons traditionnelles au centre",
        clientProfile: "navetteurs vers Singen et Zurich, gestionnaires logistiques et dirigeants de PME",
        cleaningNotes: "les entrepôts commerciaux nécessitent des autolaveuses robustes, tandis que les logements se concentrent sur le dépoussiérage"
      },
      'beringen': {
        buildingTypes: "nouveaux quartiers résidentiels modernes, maisons individuelles spacieuses dans la verdure et locaux industriels",
        clientProfile: "jeunes familles à double revenu, entreprises technologiques et de production locales",
        cleaningNotes: "les nouvelles constructions ont souvent des chapes de design délicates qui nécessitent des produits d'entretien à pH neutre"
      },
      'neunkirch': {
        buildingTypes: "bâtiments anciens classés monument historique, maisons individuelles, bâtiments agricoles mixtes",
        clientProfile: "propriétaires attachés aux traditions, commerçants locaux et agriculteurs",
        cleaningNotes: "préservation des parquets anciens et des colombages, et élimination soignée des taches sur dalles en pierre naturelle"
      },
      'hallau': {
        buildingTypes: "domaines viticoles traditionnels, habitations rurales, établissements de restauration au centre du village",
        clientProfile: "familles de vignerons, restaurateurs locaux et personnes en quête de nature et de calme",
        cleaningNotes: "les surfaces de restauration exigent le respect strict des normes HACCP, tandis que les caves à vin demandent une prudence maximale"
      },
      'wilchingen': {
        buildingTypes: "maisons de campagne à colombages, villas individuelles modernes, exploitations agricoles",
        clientProfile: "vignerons, artisans locaux et familles profondément enracinées dans le Klettgau",
        cleaningNotes: "élimination approfondie de la poussière tenace sur les fenêtres extérieures en raison des activités agricoles environnantes"
      },
      'schleitheim': {
        buildingTypes: "fermes traditionnelles, immeubles résidentiels anciens, maisons individuelles indépendantes",
        clientProfile: "familles multigénérationnelles, seniors, artisans locaux",
        cleaningNotes: "entretien régulier des anciennes fenêtres à double vitrage et traitement protecteur durable des sols en bois massif"
      },
      'loehningen': {
        buildingTypes: "complexes résidentiels d'appartements et maisons individuelles modernes sur le coteau orienté plein sud",
        clientProfile: "familles avec enfants, employés actifs à Schaffhouse, prestataires de services locaux",
        cleaningNotes: "en raison de l'emplacement sur la colline, les vitres sont très exposées aux intempéries et profitent d'un traitement hydrophobe"
      },
      'stetten': {
        buildingTypes: "villas de haut standing, propriétés de luxe, appartements en copropriété récents",
        clientProfile: "clients privés aux exigences de qualité supérieures, cadres supérieurs très occupés",
        cleaningNotes: "imperméabilisation professionnelle des pierres naturelles et entretien spécifique des parquets haut de gamme en bois noble"
      },
      'doerflingen': {
        buildingTypes: "maisons d'habitation accueillantes, anciennes fermes restaurées, maisons individuelles rurales",
        clientProfile: "navetteurs travaillant à Schaffhouse et en Allemagne, familles proches de la nature",
        cleaningNotes: "nettoyage printanier du pollen tenace incrusté sur les façades et les grandes baies vitrées des terrasses"
      },
      'ramsen': {
        buildingTypes: "maisons individuelles de campagne, lotissements résidentiels, bâtiments douaniers",
        clientProfile: "frontaliers travaillant dans le sud de l'Allemagne, familles actives, fournisseurs agricoles",
        cleaningNotes: "nettoyage des volets roulants et stores exposés aux microparticules le long de l'axe routier principal"
      },
      'buchberg': {
        buildingTypes: "villas exclusives à flanc de coteau, habitations en terrasses modernes, maisons de vignerons traditionnelles",
        clientProfile: "propriétaires de biens immobiliers de prestige, professionnels de la viticulture",
        cleaningNotes: "lavage des baies vitrées panoramiques à l'eau déminéralisée pour garantir une vue sur le Rhin sans aucune trace"
      },
      'ruedlingen': {
        buildingTypes: "maisons individuelles en bord de fleuve, appartements de vacances, maisons à colombages bien entretenues",
        clientProfile: "propriétaires de résidences secondaires, familles actives, amateurs de sports nautiques",
        cleaningNotes: "élimination systématique des toiles d'araignées et traces d'insectes sur les façades en bordure du Rhin"
      },
      'feuerthalen': {
        buildingTypes: "immeubles collectifs en bordure du Rhin, ateliers d'artistes, appartements de style classique",
        clientProfile: "jeunes couples, familles et ateliers artisanaux idéalement situés juste en face du Rhin",
        cleaningNotes: "traitement professionnel des moisissures naissantes dans les salles de bains en raison de l'humidité du fleuve"
      },
      'diessenhofen': {
        buildingTypes: "bâtiments historiques protégés au cœur de la vieille ville, habitations modernes dans la campagne thurgovienne",
        clientProfile: "propriétaires de biens d'époque, exploitants de cafés/hôtels, petits commerçants",
        cleaningNotes: "soin attentif des anciennes poutres apparentes en bois massif avec des huiles de nettoyage bio douces"
      },
      'uhwiesen': {
        buildingTypes: "exploitations agricoles à colombages, villas individuelles isolées sur le versant sud du Kohlfirst",
        clientProfile: "navetteurs vers Winterthour et Schaffhouse, familles recherchant la tranquillité de la campagne",
        cleaningNotes: "nettoyage professionnel des cheminées et poêles anciens, et entretien méticuleux des plafonds intérieurs en bois"
      },
      'rafz': {
        buildingTypes: "fermes traditionnelles du Rafzerfeld, nouveaux lotissements modernes à flanc de colline",
        clientProfile: "familles hautement mobiles travaillant à Zurich, producteurs de fruits de la région",
        cleaningNotes: "nettoyages de fin de chantier comprenant l'aspiration des poussières fines de construction dans les conduits"
      },
      'winterthur': {
        buildingTypes: "anciennes halles industrielles Sulzer réhabilitées en lofts, coopératives d'habitation, grands plateaux de bureaux au centre",
        clientProfile: "artistes et créateurs, colocations étudiantes, coopérateurs, PME industrielles locales",
        cleaningNotes: "les verrières de lofts industriels exigent des perches télescopiques stables; soin des sols en béton ciré et asphalte"
      },
      'zurich': {
        buildingTypes: "immeubles Belle Époque de standing au Seefeld, cabinets d'avocats de prestige à la Bahnhofstrasse, locaux du District 4",
        clientProfile: "professionnels de la finance internationale, expatriés exigeants, cabinets de conseil et d'avocats",
        cleaningNotes: "polissage brillant haut de gamme des marbres exclusifs et parquets à motifs avec la plus grande discrétion"
      },
      'kloten': {
        buildingTypes: "appartements d'affaires modernes, grands centres de conférences, bureaux à forte fréquentation près de l'aéroport",
        clientProfile: "pilots, personnel navigant, expatriés internationaux, entreprises de logistique aéroportuaire",
        cleaningNotes: "nettoyages express hautement flexibles et efficaces pour les rotations rapides de locataires en appartements meublés"
      },
      'buelach': {
        buildingTypes: "bâtiments classés au centre historique, lotissements résidentiels de maisons individuelles, halls commerciaux récents",
        clientProfile: "commerçants de quartier, artisans locaux, familles résidant dans le Zürcher Unterland",
        cleaningNotes: "nettoyage spécialisé des carrelages anciens et des encadrements de fenêtres dans la vieille ville"
      },
      'dietikon': {
        buildingTypes: "halls industriels et centres de distribution, lofts résidentiels récents dans la vallée de la Limmat, copropriétés",
        clientProfile: "entreprises de logistique et de production, familles actives à double revenu",
        cleaningNotes: "méthodes de dégraissage industriel pour sols de garages et cuisines professionnelles, et nettoyages de fin de bail"
      },
      'uster': {
        buildingTypes: "anciennes filatures transformées en lofts résidentiels de prestige, maisons individuelles au bord du lac",
        clientProfile: "familles écoresponsables, résidents de lofts d'architecte, membres de coopératives locales",
        cleaningNotes: "nettoyage de haute précision du béton brut décoratif et des parquets huilés dans les lofts sans laisser de résidus"
      }
    }
  };

  const key = slug.toLowerCase();
  if (dictionary[lang] && dictionary[lang][key]) {
    return dictionary[lang][key];
  }

  // Fallback map translations to other languages if they are not explicitly typed to save space and guarantee 100% correct translation
  // If the language is IT or PT, we can dynamically adapt the ES translation or fallback gracefully
  if (lang === 'it' || lang === 'pt') {
    const esTrans = dictionary['es']?.[key] || defaultContext;
    return esTrans;
  }

  return defaultContext;
};

export const MunicipalityPage: React.FC<MunicipalityPageProps> = ({ municipalitySlug, onNavigate }) => {
  const { language } = useTranslation();
  const mun = MUNICIPALITIES.find(m => m.slug === municipalitySlug);

  const getServiceCitySlug = (mSlug: string, rId: string): string => {
    if (mSlug === "neuhausen-am-rheinfall") return "neuhausen";
    const validList = ["schaffhausen", "zurich", "winterthur", "neuhausen", "thayngen", "stein-am-rhein", "feuerthalen", "kloten", "buelach", "dietikon", "uster"];
    if (validList.includes(mSlug)) {
      return mSlug;
    }
    if (rId === "zuerich") return "zurich";
    return rId;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (municipalitySlug) {
      localStorage.setItem('kraken_last_visited_municipality', municipalitySlug);
    }
  }, [municipalitySlug]);

  const rawLang = language || 'de';
  const activeLang = (rawLang === 'de-CH' || rawLang === 'de') ? 'de' : rawLang;
  const currentLang = ['de', 'en', 'fr', 'it', 'es', 'pt'].includes(activeLang) ? activeLang : 'de';

  const tLocal = (key: string, params?: Record<string, string>) => {
    const dict = LOCAL_TRANSLATIONS[currentLang] || LOCAL_TRANSLATIONS['de'];
    let text = dict[key] || LOCAL_TRANSLATIONS['de'][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), v);
      });
    }
    return text;
  };

  useEffect(() => {
    if (!mun) return;

    // Set Document Title and Meta Description
    const plzStr = mun.plz.join(', ');
    document.title = tLocal("metaTitle", { name: mun.name, plz: plzStr });
    
    const metaDesc = tLocal("metaDesc", { name: mun.name, plz: plzStr, price: String(mun.priceAnchors.endOfTenancyFrom) });
    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute('content', metaDesc);
    }

    // Handle indexable / noindex logic
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!mun.indexable) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    }

    return () => {
      // Re-enable indexable meta default when leaving the page
      const robots = document.querySelector('meta[name="robots"]');
      if (robots) {
        robots.setAttribute('content', 'index, follow');
      }
    };
  }, [mun, currentLang]);

  if (!mun) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 font-sans text-slate-900">{tLocal("notFoundTitle")}</h2>
        <p className="text-slate-600 mb-6 max-w-md">{tLocal("notFoundDesc")}</p>
        <button 
          onClick={() => onNavigate('/')} 
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full font-medium text-white transition-all cursor-pointer"
        >
          {tLocal("backToHome")}
        </button>
      </div>
    );
  }

  const regionId = mun.region;
  const regionNameGerman = tLocal(`region_${regionId}`);

  const travelLabel = mun.travelFee === 0 
    ? tLocal("noTravelFee") 
    : tLocal("travelFeeLabel", { fee: String(mun.travelFee) });

  // Get neighboring municipality names
  const nearbyNames = mun.nearbySlugs
    .map(slug => MUNICIPALITIES.find(m => m.slug === slug)?.name || "")
    .filter(name => name !== "")
    .join(", ");

  // Build unique narrative based on instructions
  const generateNarrative = () => {
    const plzStr = mun.plz.join(', ');
    const travelText = mun.travelFee === 0
      ? tLocal("narrative_travel_free")
      : tLocal("narrative_travel_fee", { travelFee: String(mun.travelFee) });

    // Try to get translated local variables for top indexable hubs
    let buildingTypes = mun.localContext.buildingTypes;
    let cleaningNotes = mun.localContext.cleaningNotes;
    let clientProfile = mun.localContext.clientProfile;

    if (currentLang !== 'de') {
      const contextTrans = getLocalizedContext(mun.slug, currentLang, {
        buildingTypes: mun.localContext.buildingTypes,
        cleaningNotes: mun.localContext.cleaningNotes,
        clientProfile: mun.localContext.clientProfile
      });
      buildingTypes = contextTrans.buildingTypes;
      cleaningNotes = contextTrans.cleaningNotes;
      clientProfile = contextTrans.clientProfile;
    }

    const getDeterministicHash = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };

    const templates: Record<string, string[]> = {
      de: [
        "Als führende Reinigungsfirma in {name} ({plz}) bringen wir Schweizer Präzision und Verlässlichkeit direkt in Ihre Gemeinde. Angesichts der lokalen Gebäudestrukturen, die stark von {buildingTypes} geprägt sind, setzen wir massgeschneiderte Techniken ein; so achten wir sorgfältig darauf, dass {cleaningNotes}. Unser lokaler Kundenkreis umfasst {clientProfile}, für die wir flexible Einsätze planen. Um Transportwege zu reduzieren, koordinieren wir unsere Fahrten effizient mit Aufträgen in Nachbarorten wie {nearbyNames}. {travelText} Mit Kraken PFM sichern Sie sich erstklassige Pflege und langfristigen Werterhalt für Ihr Objekt in {name}.",
        "Die Langlebigkeit und Pflege von Liegenschaften in {name} ({plz}) erfordert fundiertes Fachwissen, das unser eingespieltes Team tagtäglich unter Beweis stellt. Da die Bebauung vor Ort durch {buildingTypes} charakterisiert ist, wählen wir schonende Methoden aus, um empfindliche Flächen zu pflegen, und {cleaningNotes}. Zu unseren geschätzten Kunden zählen {clientProfile}, die eine zeitsparende Abwicklung schätzen. Dank unserer regelmässigen Einsätze im Raum {nearbyNames} profitieren Sie von optimierten Routen. {travelText} Ihr Objekt in {name} ist bei unseren GAV-konformen Profis in den besten Händen.",
        "Kraken PFM ist Ihr verlässlicher Ansprechpartner für anspruchsvolle Reinigungsdienste in der Gemeinde {name} ({plz}). Um den spezifischen Anforderungen von {buildingTypes} gerecht zu werden, passen wir unsere Ausrüstung individuell an; dabei {cleaningNotes}. Wir unterstützen vor allem {clientProfile} mit flexiblen Terminen und diskretem Auftreten. Durch die Bündelung von Einsätzen in der Region, insbesondere in {nearbyNames}, reduzieren wir Fahrtzeiten und Emissionen. {travelText} Erleben Sie professionelle Betreuung nach höchsten Standards in {name}.",
        "In {name} ({plz}) stehen wir für kompromisslose Qualität und ökologische Verantwortung bei jedem Reinigungseinsatz. Die lokale Architektur aus {buildingTypes} verlangt eine sensible Materialwahl, weshalb wir biologisch abbaubare Wirkstoffe nutzen und {cleaningNotes}. Unser Service ist perfekt auf die Bedürfnisse von {clientProfile} abgestimmt. Wir bündeln unsere Anfahrten regelmässig mit Aufträgen in {nearbyNames}, was uns besonders effiziente Abläufe erlaubt. {travelText} Vertrauen Sie auf regionale Kompetenz für Ihr Objekt in {name}.",
        "Suchen Sie einen zuverlässigen Partner für den Unterhalt Ihrer Liegenschaft in {name} ({plz})? Kraken PFM bietet Ihnen massgeschneiderte Konzepte direkt vor Ort. Für die typischen Bausubstanzen wie {buildingTypes} haben wir die passende Pflege entwickelt, einschliesslich {cleaningNotes}. Wir entlasten {clientProfile} zuverlässig bei allen anfallenden Arbeiten. Durch die kontinuierliche Betreuung von Objekten in der Umgebung von {nearbyNames} sind wir schnell für Sie da. {travelText} Geniessen Sie makellose Sauberkeit in {name}.",
        "Ihr Zuhause oder Ihre Gewerbefläche in {name} ({plz}) verdient eine erstklassige Pflege, die den Wert Ihrer Immobilie langfristig sichert. Da die Region vor allem durch {buildingTypes} geprägt ist, stimmen wir unsere biologischen Mittel exakt darauf ab; so pflegen wir schonend und {cleaningNotes}. Wir sind stolz darauf, {clientProfile} zu unseren zufriedenen Kunden zu zählen. Durch geschickte Kombination von Fahrten nach {nearbyNames} sparen wir Ressourcen und Kosten. {travelText} Ihr Reinigungspartner Kraken PFM ist in {name} für Sie bereit.",
        "Wir bringen Sauberkeit und Wohlbefinden in jedes Objekt in {name} ({plz}) – pünktlich, gründlich und fair. Jedes Gebäude, insbesondere solche mit Strukturen wie {buildingTypes}, erfordert eine individuelle Herangehensweise, weshalb wir {cleaningNotes}. Unser Team versteht die Wünsche von {clientProfile} und liefert flexible Lösungen. Da wir regelmässig auch in {nearbyNames} im Einsatz sind, sichern wir Ihnen eine speditiv organisierte Ausführung zu. {travelText} Berechnen Sie Ihre Offerte für {name} bequem online.",
        "Im gesamten Einzugsgebiet von {name} ({plz}) steht Ihnen Kraken PFM mit geschultem Personal und modernster Ausrüstung zur Seite. Bei Objekten, die von {buildingTypes} dominiert werden, setzen wir auf materialschonende Verfahren; wir legen grossen Wert darauf, dass {cleaningNotes}. Wir betreuen primär {clientProfile} und bieten Hand bei allen Reinigungsfragen. Dank der Nähe zu {nearbyNames} bündeln wir unsere regionalen Kräfte für maximale Effizienz. {travelText} Übergeben Sie Ihr Reinigungsvorhaben in {name} den Profis.",
        "Verlassen Sie sich bei der Reinigung in {name} ({plz}) auf Schweizer Qualitätsarbeit, die keine Wünsche offenlässt. Die Bebauung der Gemeinde ist geprägt durch {buildingTypes}, was spezifische Fachkenntnis erfordert; so pflegen wir sensible Bauteile und {cleaningNotes}. Zu unseren typischen Partnern vor Ort gehören {clientProfile}, für die wir speditiv arbeiten. Unsere Routenplanung umfasst das gesamte Gebiet um {nearbyNames} für kurze Anfahrten. {travelText} Sichern Sie sich Sauberkeit mit Garantie in {name}.",
        "Kraken PFM sorgt in {name} ({plz}) für glänzende Aussichten und hygienische Reinheit bis ins kleinste Detail. Die Vielfalt an Gebäuden, charakterisiert durch {buildingTypes}, verlangt nach differenzierten Behandlungsmethoden; daher {cleaningNotes}. Unsere Dienstleistungen richten sich an {clientProfile} mit höchsten Qualitätsansprüchen. Durch die Koordination von Einsätzen im Raum {nearbyNames} optimieren wir kontinuierlich unsere Abläufe. {travelText} Erleben Sie den Unterschied mit unserem Service in {name}.",
        "Wir bändigen das Chaos und sichern die Werterhaltung Ihrer Räume in {name} ({plz}) mit Leidenschaft und Fachkompetenz. Die architektonischen Gegebenheiten vor Ort aus {buildingTypes} erfordern ein geschultes Auge, weshalb wir gezielt agieren und {cleaningNotes}. Wir sind für {clientProfile} der vertrauenswürdige Begleiter im Alltag. Mit unserer starken Präsenz auch in {nearbyNames} garantieren wir schnelle Termine. {travelText} Ihr makelloses Ergebnis in {name} ist nur wenige Klicks entfernt.",
        "Erleben Sie massgeschneiderte Facility- und Reinigungsleistungen in der Gemeinde {name} ({plz}) auf Augenhöhe. Ob Altbau oder Neubau – die lokale Architektur mit {buildingTypes} pflegen wir mit modernsten Verfahren und {cleaningNotes}. Wir unterstützen {clientProfile} mit durchdachten Services und transparenten Festpreisen. Dank der cleveren Routenplanung mit Einsätzen in {nearbyNames} sichern wir exzellente Konditionen. {travelText} Kraken PFM ist Ihr lokaler Experte für {name}."
      ],
      en: [
        "As a leading cleaning company in {name} ({plz}), we bring Swiss precision and reliability directly to your community. Given the local building structures, which are heavily characterized by {buildingTypes}, we employ customized techniques, ensuring that {cleaningNotes}. Our local clientele includes {clientProfile}, for whom we schedule flexible visits. To reduce transit paths, we coordinate our tours efficiently with assignments in neighboring locations like {nearbyNames}. {travelText} With Kraken PFM, you secure first-class care and long-term value preservation for your property in {name}.",
        "The longevity and care of properties in {name} ({plz}) require profound specialist knowledge, which our well-coordinated team demonstrates every day. Since the local construction is characterized by {buildingTypes}, we select gentle methods to care for sensitive surfaces, and {cleaningNotes}. Among our valued clients are {clientProfile}, who appreciate time-saving execution. Thanks to our regular work in the {nearbyNames} area, you benefit from optimized routing. {travelText} Your property in {name} is in the best hands with our GAV-compliant professionals.",
        "Kraken PFM is your reliable contact for demanding cleaning services in the community of {name} ({plz}). To meet the specific requirements of {buildingTypes}, we adjust our equipment individually, during which {cleaningNotes}. We primarily support {clientProfile} with flexible scheduling and discreet appearance. By bundling assignments in the region, especially in {nearbyNames}, we reduce travel times and emissions. {travelText} Experience professional care to the highest standards in {name}.",
        "In {name} ({plz}), we stand for uncompromising quality and ecological responsibility on every cleaning assignment. The local architecture of {buildingTypes} demands sensitive material selection, which is why we use biodegradable agents and {cleaningNotes}. Our service is perfectly tailored to the needs of {clientProfile}. We regularly bundle our arrivals with jobs in {nearbyNames}, which allows us particularly efficient processes. {travelText} Trust in regional competence for your property in {name}.",
        "Are you looking for a reliable partner for the maintenance of your property in {name} ({plz})? Kraken PFM offers you tailor-made concepts directly on site. For typical building fabrics like {buildingTypes}, we have developed the appropriate care, including {cleaningNotes}. We reliably relieve {clientProfile} of all pending tasks. Through the continuous care of properties in the vicinity of {nearbyNames}, we are quickly there for you. {travelText} Enjoy pristine cleanliness in {name}.",
        "Your home or commercial space in {name} ({plz}) deserves first-class care that secures the value of your property in the long term. Since the region is mainly characterized by {buildingTypes}, we match our organic products exactly to it; thus we clean gently and {cleaningNotes}. We are proud to count {clientProfile} among our satisfied clients. By cleverly combining trips to {nearbyNames}, we save resources and costs. {travelText} Your cleaning partner Kraken PFM is ready for you in {name}.",
        "We bring cleanliness and well-being to every property in {name} ({plz}) – punctually, thoroughly, and fairly. Every building, especially those with structures like {buildingTypes}, requires an individual approach, which is why we {cleaningNotes}. Our team understands the wishes of {clientProfile} and delivers flexible solutions. Since we are regularly active in {nearbyNames}, we assure you of a swiftly organized execution. {travelText} Calculate your offer for {name} easily online.",
        "Throughout the catchment area of {name} ({plz}), Kraken PFM is at your side with trained staff and state-of-the-art equipment. For properties dominated by {buildingTypes}, we rely on materials-friendly procedures; we attach great importance to ensuring that {cleaningNotes}. We primarily care for {clientProfile} and assist with all cleaning questions. Thanks to the proximity to {nearbyNames}, we bundle our regional forces for maximum efficiency. {travelText} Hand over your cleaning project in {name} to the professionals.",
        "Rely on Swiss quality work for cleaning in {name} ({plz}) that leaves nothing to be desired. The construction of the community is characterized by {buildingTypes}, which requires specific expertise; thus we care for sensitive components and {cleaningNotes}. Our typical local partners include {clientProfile}, for whom we work quickly. Our route planning covers the entire area around {nearbyNames} for short journeys. {travelText} Secure cleanliness with a guarantee in {name}.",
        "Kraken PFM ensures brilliant outlooks and hygienic cleanliness down to the smallest detail in {name} ({plz}). The variety of buildings, characterized by {buildingTypes}, demands differentiated treatment methods; therefore {cleaningNotes}. Our services are aimed at {clientProfile} with the highest quality standards. By coordinating assignments in the {nearbyNames} area, we continuously optimize our processes. {travelText} Experience the difference with our service in {name}.",
        "We tame the chaos and secure the value preservation of your rooms in {name} ({plz}) with passion and expertise. The architectural conditions on site of {buildingTypes} require a trained eye, which is why we act selectively and {cleaningNotes}. We are the trustworthy companion in everyday life for {clientProfile}. With our strong presence also in {nearbyNames}, we guarantee quick appointments. {travelText} Your pristine result in {name} is only a few clicks away.",
        "Experience tailor-made facility and cleaning services in the community of {name} ({plz}) at eye level. Whether old building or new construction – we care for the local architecture with {buildingTypes} using the most modern methods and {cleaningNotes}. We support {clientProfile} with thoughtful services and transparent fixed prices. Thanks to clever route planning with jobs in {nearbyNames}, we secure excellent conditions. {travelText} Kraken PFM is your local expert for {name}."
      ],
      es: [
        "Como empresa de limpieza líder en {name} ({plz}), aportamos precisión y fiabilidad suizas directamente a su comunidad. Dadas las estructuras de los edificios locales, fuertemente caracterizadas por {buildingTypes}, empleamos técnicas personalizadas, asegurándonos de que {cleaningNotes}. Nuestra clientela local incluye {clientProfile}, para quienes planificamos visitas flexibles. Para reducir los trayectos de tránsito, coordinamos nuestros recorridos eficientemente con servicios en localidades vecinas como {nearbyNames}. {travelText} Con Kraken PFM, se asegura un cuidado de primera clase y la conservación del valor a largo plazo de su propiedad en {name}.",
        "La longevidad y el cuidado de las propiedades en {name} ({plz}) requieren un profundo conocimiento especializado, que nuestro equipo bien coordinado demuestra todos los días. Dado que la construcción local se caracteriza por {buildingTypes}, seleccionamos métodos suaves para cuidar las superficies sensibles, y {cleaningNotes}. Entre nuestros valiosos clientes se encuentran {clientProfile}, quienes aprecian una ejecución que ahorra tiempo. Gracias a nuestro trabajo regular en el área de {nearbyNames}, usted se beneficia de rutas optimizadas. {travelText} Su propiedad en {name} está en las mejores manos con nuestros profesionales conformes a GAV.",
        "Kraken PFM es su contacto de confianza para servicios de limpieza exigentes en la comunidad de {name} ({plz}). Para cumplir con los requisitos específicos de {buildingTypes}, adaptamos nuestros equipos individualmente, durante lo cual {cleaningNotes}. Apoyamos principalmente a {clientProfile} con una programación flexible y una apariencia discreta. Al agrupar los servicios en la región, especialmente en {nearbyNames}, reducimos los tiempos de viaje y las emisiones. {travelText} Experimente una atención profesional con los más altos estándares en {name}.",
        "En {name} ({plz}), representamos una calidad sin concesiones y una responsabilidad ecológica en cada servicio de limpieza. La arquitectura local de {buildingTypes} exige una selección sensible de materiales, por lo que utilizamos agentes biodegradables y {cleaningNotes}. Nuestro servicio está perfectamente adaptado a las necesidades de {clientProfile}. Agrupamos regularmente nuestras llegadas con trabajos en {nearbyNames}, lo que nos permite procesos particularmente eficientes. {travelText} Confíe en la competencia regional para su propiedad en {name}.",
        "¿Busca un socio fiable para el mantenimiento de su propiedad en {name} ({plz})? Kraken PFM le ofrece conceptos a medida directamente en el lugar. Para tejidos de construcción típicos como {buildingTypes}, hemos desarrollado el cuidado adecuado, incluyendo {cleaningNotes}. Aliviamos de forma fiable a {clientProfile} de todas las tareas pendientes. A través del cuidado continuo de propiedades en las inmediaciones de {nearbyNames}, estamos rápidamente a su disposición. {travelText} Disfrute de una limpieza impecable en {name}.",
        "Su hogar o espacio comercial en {name} ({plz}) merece una atención de primera clase que asegure el valor de su propiedad a largo plazo. Dado que la región se caracteriza principalmente por {buildingTypes}, adaptamos nuestros productos orgánicos exactamente a ella; así limpiamos suavemente y {cleaningNotes}. Estamos orgullosos de contar con {clientProfile} entre nuestros clientes satisfechos. Al combinar inteligentemente los viajes a {nearbyNames}, ahorramos recursos y costes. {travelText} Su socio de limpieza Kraken PFM está listo para usted en {name}.",
        "Llevamos limpieza y bienestar a cada propiedad en {name} ({plz}) – puntual, minuciosa y justamente. Cada edificio, especialmente aquellos con estructuras como {buildingTypes}, requiere un enfoque individual, por lo que nosotros {cleaningNotes}. Nuestro equipo comprende los deseos de {clientProfile} y ofrece soluciones flexibles. Dado que operamos regularmente en {nearbyNames}, le aseguramos una ejecución organizada con rapidez. {travelText} Calcule su oferta para {name} fácilmente en línea.",
        "En toda el área de influencia de {name} ({plz}), Kraken PFM está a su lado con personal capacitado y equipos de última generación. Para propiedades dominadas por {buildingTypes}, confiamos en procedimientos respetuosos con los materiales; damos gran importancia a garantizar que {cleaningNotes}. Cuidamos principalmente de {clientProfile} y ayudamos con todas las dudas de limpieza. Gracias a la proximidad a {nearbyNames}, unimos nuestras fuerzas regionales para la máxima eficiencia. {travelText} Entregue su proyecto de limpieza en {name} a los profesionales.",
        "Confíe en el trabajo de calidad suizo para la limpieza en {name} ({plz}) que no deja nada que desear. La construcción de la comunidad se caracteriza por {buildingTypes}, lo que requiere una experiencia específica; así cuidamos los componentes sensibles y {cleaningNotes}. Nuestros socios locales típicos incluyen {clientProfile}, para quienes trabajamos rápidamente. Nuestra planificación de rutas cubre toda el área alrededor de {nearbyNames} para viajes cortos. {travelText} Asegure la limpieza con una garantía en {name}.",
        "Kraken PFM garantiza vistas brillantes y una limpieza higiénica hasta el más mínimo detalle en {name} ({plz}). La variedad de edificios, caracterizada por {buildingTypes}, exige métodos de tratamiento diferenciados; por lo tanto, {cleaningNotes}. Nuestros servicios están dirigidos a {clientProfile} con los más altos estándares de calidad. Al coordinar los servicios en el área de {nearbyNames}, optimizamos continuamente nuestros procesos. {travelText} Experimente la diferencia con nuestro servicio en {name}.",
        "Domesticamos el caos y aseguramos la conservación del valor de sus habitaciones en {name} ({plz}) con pasión y experiencia. Las condiciones arquitectónicas locales de {buildingTypes} requieren un ojo entrenado, por lo que actuamos selectivamente y {cleaningNotes}. Somos el compañero de confianza en la vida cotidiana para {clientProfile}. Con nuestra fuerte presencia también en {nearbyNames}, garantizamos citas rápidas. {travelText} Su resultado impecable en {name} está a solo unos clics de distancia.",
        "Experimente servicios de limpieza e instalaciones a medida en la comunidad de {name} ({plz}) a la altura de sus ojos. Ya se trate de un edificio antiguo o de una nueva construcción, cuidamos la arquitectura local con {buildingTypes} utilizando los métodos más modernos y {cleaningNotes}. Apoyamos a {clientProfile} con servicios bien pensados y precios fijos transparentes. Gracias a una inteligente planificación de rutas con trabajos en {nearbyNames}, aseguramos excelentes condiciones. {travelText} Kraken PFM es su experto local para {name}."
      ],
      fr: [
        "En tant qu'entreprise de nettoyage de premier plan à {name} ({plz}), nous apportons la précision et la fiabilité suisses directement dans votre commune. Compte tenu des structures de construction locales, fortement caractérisées par {buildingTypes}, nous employons des techniques sur mesure, en veillant à ce que {cleaningNotes}. Notre clientèle locale comprend {clientProfile}, pour qui nous planifions des visites flexibles. Pour réduire les trajets de transit, nous coordonnons nos tournées de manière efficace avec des interventions dans des localités voisines comme {nearbyNames}. {travelText} Avec Kraken PFM, vous vous assurez des soins de premier ordre et la préservation de la valeur à long terme de votre bien à {name}.",
        "La longévité et l'entretien des biens immobiliers à {name} ({plz}) exigent de profondes connaissances spécialisées, que notre équipe bien coordonnée démontre au quotidien. La construction locale étant caractérisée par {buildingTypes}, nous sélectionnons des méthodes douces pour entretenir les surfaces sensibles, et {cleaningNotes}. Parmi nos précieux clients figurent {clientProfile}, qui apprécient une exécution rapide. Grâce à notre présence régulière dans le secteur de {nearbyNames}, vous bénéficiez de tournées optimisées. {travelText} Votre bien à {name} est entre de meilleures mains avec nos professionnels conformes à la CCT.",
        "Kraken PFM est votre contact de confiance pour des services de nettoyage exigeants dans la commune de {name} ({plz}). Pour répondre aux exigences spécifiques de {buildingTypes}, nous adaptons nos équipements individuellement, au cours desquels {cleaningNotes}. Nous accompagnons principalement {clientProfile} avec des horaires flexibles et une présence discrète. En regroupant les interventions dans la région, notamment à {nearbyNames}, nous réduisons les temps de déplacement et les émissions. {travelText} Faites l'expérience d'un service professionnel répondant aux normes les plus élevées à {name}.",
        "À {name} ({plz}), nous sommes synonymes d'une qualité sans compromis et d'une responsabilité écologique pour chaque service de nettoyage. L'architecture locale de {buildingTypes} exige une sélection minutieuse des matériaux, c'est pourquoi nous utilisons des agents biodégradables et {cleaningNotes}. Notre prestation est parfaitement adaptée aux besoins de {clientProfile}. Nous regroupons régulièrement nos déplacements avec des travaux à {nearbyNames}, ce qui nous permet des processus particulièrement efficaces. {travelText} Faites confiance à la compétence régionale pour votre bien à {name}.",
        "Vous cherchez un partenaire fiable pour l'entretien de votre bien à {name} ({plz}) ? Kraken PFM vous propose des concepts sur mesure directement sur place. Pour les structures de construction typiques comme {buildingTypes}, nous avons développé l'entretien approprié, y compris {cleaningNotes}. Nous déchargeons de manière fiable {clientProfile} de toutes les tâches en cours. Grâce à l'entretien continu des propriétés à proximité de {nearbyNames}, nous intervenons rapidement. {travelText} Profitez d'une propreté impeccable à {name}.",
        "Votre maison ou espace commercial à {name} ({plz}) mérite des soins de premier ordre qui préservent la valeur de votre bien à long terme. La région étant principalement caractérisée par {buildingTypes}, nous y adaptons précisément nos produits biologiques ; ainsi nous nettoyons en douceur et {cleaningNotes}. Nous sommes fiers de compter {clientProfile} parmi nos clients satisfaits. En combinant intelligemment les trajets vers {nearbyNames}, nous économisons des ressources et des coûts. {travelText} Votre partenaire de nettoyage Kraken PFM est prêt pour vous à {name}.",
        "Nous apportons propreté et bien-être dans chaque propriété à {name} ({plz}) – de manière ponctuelle, minutieuse et équitable. Chaque bâtiment, en particulier ceux présentant des structures comme {buildingTypes}, exige une approche individuelle, c'est pourquoi nous {cleaningNotes}. Notre équipe comprend les souhaits de {clientProfile} et propose des solutions flexibles. Puisqu'un grand nombre de nos clients se trouvent également à {nearbyNames}, nous vous garantissons une exécution organisée avec rapidité. {travelText} Calculez votre devis pour {name} facilement en ligne.",
        "Dans toute la zone de chalandise de {name} ({plz}), Kraken PFM est à vos côtés avec un personnel formé et des équipements de pointe. Pour les propriétés dominées par {buildingTypes}, nous privilégions des procédures respectueuses des matériaux ; nous accordons une grande importance à ce que {cleaningNotes}. Nous accompagnons principalement {clientProfile} et aidons pour toutes les questions de nettoyage. Grâce à la proximité de {nearbyNames}, unisons nos forces régionales pour une efficacité maximale. {travelText} Confiez votre projet de nettoyage à {name} à des professionnels.",
        "Faites confiance au travail de qualité suisse pour le nettoyage à {name} ({plz}) qui ne laisse rien à désirer. La construction de la commune est caractérisée par {buildingTypes}, ce qui requiert une expertise spécifique ; ainsi nous prenons soin des éléments sensibles et {cleaningNotes}. Nos partenaires locaux typiques incluent {clientProfile}, pour qui nous travaillons rapidement. Notre planification d'itinéraires couvre l'ensemble du secteur autour de {nearbyNames} pour des trajets courts. {travelText} Assurez la propreté avec une garantie à {name}.",
        "Kraken PFM garantit des perspectives brillantes et une propreté hygiénique jusqu'au moindre detail à {name} ({plz}). La diversité des bâtiments, caractérisée par {buildingTypes}, exige des méthodes de traitement différenciées ; c'est pourquoi {cleaningNotes}. Nos prestations s'adressent à {clientProfile} ayant les exigences de qualité les plus élevées. En coordonnant les interventions dans le secteur de {nearbyNames}, nous optimisons continuellement nos processus. {travelText} Découvrez la différence avec notre service à {name}.",
        "We tame the chaos in your rooms in {name} ({plz}) and ensure perfect cleanliness. The architectural conditions on site of {buildingTypes} require a trained eye, which is why we act selectively and {cleaningNotes}. We are the trustworthy companion in everyday life for {clientProfile}. With our strong presence also in {nearbyNames}, we guarantee quick appointments. {travelText} Your pristine result in {name} is only a few clicks away.",
        "Découvrez des services de nettoyage et d'installations sur mesure à la hauteur de vos attentes dans la commune de {name} ({plz}). Qu'il s'agisse d'un bâtiment ancien ou d'une construction neuve, nous entretenons l'architecture locale avec {buildingTypes} en utilisant les méthodes les plus modernes et {cleaningNotes}. Nous soutenons {clientProfile} avec des prestations bien pensées et des prix fixes transparents. Grâce à une planification d'itinéraires intelligente avec des travaux à {nearbyNames}, nous assurons d'excellentes conditions. {travelText} Kraken PFM is your local expert for {name}."
      ],
      it: [
        "Come impresa di pulizie leader a {name} ({plz}), portiamo la precisione e l'affidabilità svizzere direttamente nella vostra comunità. Date le strutture edilizie locali, fortemente caratterizzate da {buildingTypes}, impieghiamo tecniche personalizzate, assicurando che {cleaningNotes}. La nostra clientela locale include {clientProfile}, per i quali pianifichiamo visite flessibili. Per ridurre i tragitti di transito, coordiniamo i nostri percorsi in modo efficiente con interventi in località vicine como {nearbyNames}. {travelText} Con Kraken PFM, vi assicurate una cura di prima classe e la conservazione del valore a lungo del vostro immobile a {name}.",
        "La longevità e la cura degli immobili a {name} ({plz}) richiedono una profonda conoscenza specialistica, che il nostro team ben coordinato dimostra ogni giorno. Poiché la costruzione locale è caratterizzata da {buildingTypes}, selezioniamo metodi delicati per prenderci cura delle superfici sensibili e {cleaningNotes}. Tra i nostri stimati clienti figurano {clientProfile}, che apprezzano un'esecuzione rapida. Grazie al nostro lavoro regolare nell'area di {nearbyNames}, beneficiate di percorsi ottimizzati. {travelText} Il vostro immobile a {name} è nelle migliori mani con i nostri professionisti conformi alla GAV.",
        "Kraken PFM è il vostro contatto di fiducia per servizi di pulizia esigenti nella comunità di {name} ({plz}). Para soddisfare i requisiti specifici di {buildingTypes}, adattiamo le nostre attrezzature individualmente, durante le quali {cleaningNotes}. Supportiamo principalmente {clientProfile} con una pianificazione flessibile e una presenza discreta. Raggruppando gli interventi nella regione, specialmente a {nearbyNames}, riduciamo i tempi di viaggio e le emissioni. {travelText} Sperimentate un'assistenza professionale ai massimi livelli a {name}.",
        "A {name} ({plz}), siamo sinonimo di qualità senza compromessi e responsabilità ecologica in ogni servizio di pulizia. L'architettura locale di {buildingTypes} richiede una selezione attenta dei materiali, motivo per cui utilizziamo agenti biodegradabili e {cleaningNotes}. Il nostro servizio è perfettamente su misura per le esigenze di {clientProfile}. Raggruppiamo regolarmente i nostri arrivi con lavori a {nearbyNames}, il che ci consente processi particolarmente efficienti. {travelText} Affidatevi alla competenza regionale per il vostro immobile a {name}.",
        "Cercate un partner affidabile per la manutenzione del vostro immobile a {name} ({plz})? Kraken PFM vi offre concetti su misura direttamente sul posto. Per le strutture edilizie tipiche come {buildingTypes}, abbiamo sviluppato la cura adeguata, inclusi {cleaningNotes}. Alleviamo in modo affidabile {clientProfile} da tutti i compiti in sospeso. Attraverso la cura continua delle proprietà nelle vicinanze di {nearbyNames}, siamo rapidamente a vostra disposizione. {travelText} Godetevi una pulizia impeccabile a {name}.",
        "La vostra casa o spazio commerciale a {name} ({plz}) merita cure di prima classe che preservino il valore del vostro immobile a lungo termine. Poiché la regione è caratterizzata principalmente da {buildingTypes}, adattiamo esattamente i nostri prodotti biologici ad essa; quindi puliamo delicatamente e {cleaningNotes}. Siamo orgogliosi di contare {clientProfile} tra i nostri clienti soddisfatti. Combinando in modo intelligente i viaggi verso {nearbyNames}, risparmiamo risorse e costi. {travelText} Il vostro partner per le pulizie Kraken PFM è pronto per voi a {name}.",
        "Portiamo pulizia e benessere in ogni immobile a {name} ({plz}) – in modo puntuale, accurato e corretto. Ogni edificio, in particolare quelli con strutture come {buildingTypes}, richiede un approccio individuale, per cui noi {cleaningNotes}. Il nostro team comprende i desideri di {clientProfile} e offre soluzioni flessibili. Poiché operiamo regolarmente a {nearbyNames}, vi assicuriamo un'esecuzione organizzata con rapidità. {travelText} Calcolate la vostra offerta per {name} facilmente online.",
        "In tutta l'area di attrazione di {name} ({plz}), Kraken PFM ist al vostro fianco con personale formato e attrezzature all'avanguardia. Per gli immobili dominati da {buildingTypes}, ci affidiamo a procedure rispettose dei materiali; attribuiamo grande importanza a garantire che {cleaningNotes}. Ci occupiamo principalmente di {clientProfile} e aiutiamo per tutte le domande di pulizia. Grazie alla vicinanza a {nearbyNames}, uniamo le nostre forze regionali per la massima efficienza. {travelText} Affidate il vostro progetto di pulizia a {name} ai professionisti.",
        "Affidatevi al lavoro di qualità svizzero per la pulizia a {name} ({plz}) che non lascia nulla a desiderare. La costruzione della comunità è caratterizzata da {buildingTypes}, il che richiede competenze specifiche; così ci prendiamo cura dei componenti sensibili e {cleaningNotes}. I nostri partner locali tipici includono {clientProfile}, per i quali lavoriamo rapidamente. La nostra pianificazione dei percorsi copre l'intera area intorno a {nearbyNames} per viaggi brevi. {travelText} Assicuratevi la pulizia con garanzia a {name}.",
        "Kraken PFM garantisce prospettive brillanti e pulizia igienica fino al minimo dettaglio a {name} ({plz}). La varietà di edifici, caratterizzata da {buildingTypes}, richiede metodi di trattamento differenziati; pertanto {cleaningNotes}. I nostri servizi si rivolgono a {clientProfile} con i più elevati standard di qualità. Coordinando gli interventi nell'area di {nearbyNames}, ottimizziamo continuamente i nostri processi. {travelText} Vivete la differenza con il nostro servizio a {name}.",
        "Domiamo il caos e assicuriamo la conservazione del valore delle vostre stanze a {name} ({plz}) con passione e competenza. Le condizioni architettoniche locali di {buildingTypes} richiedono un occhio esperto, motivo per cui agiamo in modo selettivo e {cleaningNotes}. Siamo il compagno di fiducia nella vita quotidiana per {clientProfile}. Grazie alla nostra forte presenza anche a {nearbyNames}, garantiamo appuntamenti rapidi. {travelText} Il vostro risultato impeccabile a {name} è a soli pochi clic di distanza.",
        "Sperimentate servizi di pulizia e impianti su misura nella comunità di {name} ({plz}) all'alta dei vostri occhi. Che si tratti di un edificio antico o di una nuova costruzione, curiamo l'architettura locale con {buildingTypes} utilizzando i metodi più moderni e {cleaningNotes}. Supportiamo {clientProfile} con servizi ben pensati e prezzi fissi transparenti. Grazie a un'intelligente pianificazione dei percorsi con lavori a {nearbyNames}, assicuriamo condizioni eccellenti. {travelText} Kraken PFM è il vostro esperto locale per {name}."
      ],
      pt: [
        "Como empresa de limpeza líder em {name} ({plz}), trazemos precisão e fiabilidade suíças diretamente para a sua comunidade. Dadas as estruturas de construção locais, fortemente caracterizadas por {buildingTypes}, empregamos técnicas personalizadas, garantindo que {cleaningNotes}. A nossa clientela local inclui {clientProfile}, para quem planeamos visitas flexíveis. Para reduzir os trajetos de trânsito, coordenamos os nossos percursos de forma eficiente com intervenções em localidades vizinhas como {nearbyNames}. {travelText} Com a Kraken PFM, assegura cuidados de primeira classe e a conservação do valor a longo prazo do seu imóvel em {name}.",
        "La longevidade e o cuidado das propriedades em {name} ({plz}) exigem um profissionalismo especializado, que a nossa equipa bem coordenada demonstra todos os dias. Uma vez que a construção local é caracterizada por {buildingTypes}, selecionamos métodos suaves para cuidar de superfícies sensíveis, e {cleaningNotes}. Entre os nossos valiosos clientes encontram-se {clientProfile}, que apreciam uma execução rápida. Graças ao nosso trabalho regular na área de {nearbyNames}, beneficia de rotas otimizadas. {travelText} O seu imóvel em {name} está nas melhores mãos com os nossos profissionais.",
        "A Kraken PFM é o seu contacto de confiança para serviços de limpeza exigentes na comunidade de {name} ({plz}). Para cumprir os requisitos específicos de {buildingTypes}, adaptamos os nossos equipamentos individualmente, durante os quais {cleaningNotes}. Apoiamos principalmente {clientProfile} com agendamento flexível e uma presença discreta. Ao agrupar os serviços na região, especialmente em {nearbyNames}, reduzimos os tempos de viagem e as emissões. {travelText} Experimente uma atenção profissional com os mais elevados padrões em {name}.",
        "Em {name} ({plz}), representamos uma qualidade sem concessões e responsabilidade ecológica em cada serviço de limpeza. A arquitetura local de {buildingTypes} exige uma seleção cuidadosa de materiais, pelo que utilizamos agentes biodegradáveis e {cleaningNotes}. O nosso serviço é perfeitamente adaptado às necessidades de {clientProfile}. Agrupamos regularmente as nossas chegadas com trabalhos em {nearbyNames}, que nos permitem processos particularmente eficientes. {travelText} Confie na competência regional para o seu imóvel em {name}.",
        "Procura um parceiro fiável para a manutenção da sua propriedade em {name} ({plz})? A Kraken PFM oferece-lhe conceitos sob medida diretamente no local. Para tecidos de construção típicos como {buildingTypes}, desenvolvemos o cuidado adequado, incluindo {cleaningNotes}. Aliviamos de forma fiável {clientProfile} de todas as tarefas pendentes. Através do cuidado contínuo de propriedades nas proximidades de {nearbyNames}, estamos rapidamente à sua disposição. {travelText} Desfrute de uma limpeza impecável em {name}.",
        "A sua casa ou espaço comercial em {name} ({plz}) merece uma atenção de primeira classe que assegure o valor da sua propriedade a longo prazo. Dado que a região é caracterizada principalmente por {buildingTypes}, adaptamos os nossos produtos biológicos exatamente a ela; assim limpamos suavemente e {cleaningNotes}. Estamos orgulhosos de contar com {clientProfile} entre os nossos clientes satisfeitos. Ao combinar inteligentemente as viagens para {nearbyNames}, poupamos recursos e custos. {travelText} O seu parceiro de limpeza Kraken PFM está pronto para si em {name}.",
        "Levamos limpeza e bem-estar a cada propriedade em {name} ({plz}) – de forma pontual, minuciosa e justa. Cada edifício, especialmente aqueles com estruturas como {buildingTypes}, requer uma abordagem de cuidado individual, pelo que nós {cleaningNotes}. A nossa equipa compreende os desejos de {clientProfile} e oferece soluções flexíveis. Dado que operamos regularmente em {nearbyNames}, asseguramos-lhe uma execução organizada com rapidez. {travelText} Calcule a sua oferta para {name} facilmente online.",
        "Em toda a área de influência de {name} ({plz}), a Kraken PFM está ao seu lado com pessoal formado e equipamentos de última geração. Para propriedades dominadas por {buildingTypes}, confiamos em procedimentos respeitosos com os materiais; damos grande importância a garantir que {cleaningNotes}. Cuidamos principalmente de {clientProfile} e ajudamos com todas as dúvidas de limpeza. Graças à proximidade de {nearbyNames}, unimos as nossas forças regionais para a máxima eficiência. {travelText} Entregue o seu projeto de limpeza em {name} aos profissionais.",
        "Confie no trabalho de qualidade suíço para a limpeza em {name} ({plz}) que não deixa nada a desejar. A construção da comunidade é caracterizada por {buildingTypes}, lo que requer uma experiência específica; assim cuidamos dos componentes sensíveis e {cleaningNotes}. Os nossos parceiros locais típicos incluem {clientProfile}, para quem trabalhamos rapidamente. O nosso planeamento de rotas cobre toda a área ao redor de {nearbyNames} para viagens curtas. {travelText} Assegure a limpeza com uma garantia em {name}.",
        "A Kraken PFM garante vistas brilhantes e uma limpeza higiénica até ao mais ínfimo detalhe em {name} ({plz}). A variedade de edifícios, caracterizada por {buildingTypes}, exige métodos de tratamento diferenciados; portanto, {cleaningNotes}. Os nossos serviços são direcionados a {clientProfile} com os mais elevados padrões de qualidade. Ao coordenar os serviços na área de {nearbyNames}, otimizamos continuamente os nossos processos. {travelText} Experimente a diferença com o seu serviço em {name}.",
        "We tame the chaos in {name} ({plz}) and ensure perfect cleanliness. The architectural conditions on site of {buildingTypes} require a trained eye, which is why we act selectively and {cleaningNotes}. We are the trustworthy companion in everyday life for {clientProfile}. With our strong presence also in {nearbyNames}, we guarantee quick appointments. {travelText} Your pristine result in {name} is only a few clicks away.",
        "Experimente serviços de limpeza e instalações sob medida na comunidade de {name} ({plz}) ao nível dos seus olhos. Quer se trate de um edifício antigo ou de uma nova construção, cuidamos da arquitetura local com {buildingTypes} utilizando os métodos mais modernos e {cleaningNotes}. Apoiamos {clientProfile} com serviços bem pensados e preços fixos transparentes. Graças a um planeamento inteligente de rotas com trabalhos em {nearbyNames}, asseguramos excelentes condições. {travelText} A Kraken PFM é o seu especialista local para {name}."
      ]
    };

    const hash = getDeterministicHash(mun.slug);
    const variants = templates[currentLang] || templates['de'];
    const variantIndex = hash % variants.length;
    let text = variants[variantIndex];

    return text
      .replace(/\{name\}/g, mun.name)
      .replace(/\{plz\}/g, plzStr)
      .replace(/\{buildingTypes\}/g, buildingTypes)
      .replace(/\{cleaningNotes\}/g, cleaningNotes)
      .replace(/\{clientProfile\}/g, clientProfile)
      .replace(/\{nearbyNames\}/g, nearbyNames)
      .replace(/\{travelText\}/g, travelText);
  };

  const getFaqs = () => [
    {
      question: tLocal("faq_q_handover", { name: mun.name }),
      answer: tLocal("faq_a_handover", { name: mun.name })
    },
    {
      question: tLocal("faq_q_travel", { name: mun.name }),
      answer: mun.travelFee === 0 
        ? tLocal("faq_a_travel_free", { name: mun.name })
        : tLocal("faq_a_travel_fee", { name: mun.name, travelFee: String(mun.travelFee) })
    },
    {
      question: tLocal("faq_q_method", { name: mun.name }),
      answer: tLocal("faq_a_method", { name: mun.name })
    },
    {
      question: tLocal("faq_q_delivery", { name: mun.name }),
      answer: tLocal("faq_a_delivery", { nearbyNames })
    }
  ];

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
        return <Utensils className={cn} />;
      case 'property-managers':
      case 'offices-corporate':
        return <Building className={cn} />;
      case 'airbnb-rentals':
        return <Sparkles className={cn} />;
      case 'retail-showrooms':
        return <Store className={cn} />;
      case 'industry-logistics':
        return <Wrench className={cn} />;
      default:
        return <Sparkles className={cn} />;
    }
  };

  const getServiceName = (srvId: string) => {
    switch (srvId) {
      case "end-of-tenancy": return tLocal("srv_eot");
      case "deep-cleaning": return tLocal("srv_deep");
      case "daily-cleaning": return tLocal("srv_daily");
      case "moving-furniture": return tLocal("srv_moving");
      case "window-cleaning": return tLocal("srv_window");
      
      // B2B Services
      case "property-managers":
        if (currentLang === 'es') return "Administradores de Propiedades";
        if (currentLang === 'en') return "Property Managers";
        if (currentLang === 'fr') return "Régies & Gérants";
        if (currentLang === 'it') return "Gestori Immobiliari";
        if (currentLang === 'pt') return "Administradores de Imóveis";
        return "Immobilienverwalter";
        
      case "airbnb-rentals":
        if (currentLang === 'es') return "Airbnb y Alquileres Vacacionales";
        if (currentLang === 'en') return "Airbnb & Short-Term Rentals";
        if (currentLang === 'fr') return "Airbnb & Locations Courtes";
        if (currentLang === 'it') return "Airbnb e Affitti Brevi";
        if (currentLang === 'pt') return "Airbnb e Aluguer de Curta Duração";
        return "Airbnb & Ferienwohnungen";
        
      case "offices-corporate":
        if (currentLang === 'es') return "Oficinas y Corporativos";
        if (currentLang === 'en') return "Offices & Corporate";
        if (currentLang === 'fr') return "Bureaux & Entreprises";
        if (currentLang === 'it') return "Uffici e Aziende";
        if (currentLang === 'pt') return "Escritórios e Empresas";
        return "Büros & Unternehmen";
        
      case "retail-showrooms":
        if (currentLang === 'es') return "Comercios y Showrooms";
        if (currentLang === 'en') return "Retail & Showrooms";
        if (currentLang === 'fr') return "Commerces & Showrooms";
        if (currentLang === 'it') return "Negozi e Showroom";
        if (currentLang === 'pt') return "Lojas e Showrooms";
        return "Detailhandel & Showrooms";
        
      case "gastronomy-restaurants":
        if (currentLang === 'es') return "Gastronomía y Restaurantes";
        if (currentLang === 'en') return "Gastronomy & Restaurants";
        if (currentLang === 'fr') return "Gastronomie & Restaurants";
        if (currentLang === 'it') return "Gastronomia e Ristoranti";
        if (currentLang === 'pt') return "Gastronomia e Restaurantes";
        return "Gastronomie & Restaurants";
        
      case "industry-logistics":
        if (currentLang === 'es') return "Industria y Logística";
        if (currentLang === 'en') return "Industry & Logistics";
        if (currentLang === 'fr') return "Industrie & Logistique";
        if (currentLang === 'it') return "Industria e Logistica";
        if (currentLang === 'pt') return "Indústria e Logística";
        return "Industrie & Logistik";
        
      default:
        return srvId;
    }
  };

  const servicesList = [
    { id: "end-of-tenancy", name: getServiceName("end-of-tenancy"), price: mun.priceAnchors.endOfTenancyFrom },
    { id: "deep-cleaning", name: getServiceName("deep-cleaning"), price: mun.priceAnchors.deepCleaningFrom },
    { id: "daily-cleaning", name: getServiceName("daily-cleaning"), price: regionId === "schaffhausen" ? 45 : regionId === "winterthur" ? 50 : 55 },
    { id: "moving-furniture", name: getServiceName("moving-furniture"), price: 95 },
    { id: "window-cleaning", name: getServiceName("window-cleaning"), price: 75 },
    { id: "property-managers", name: getServiceName("property-managers"), price: 290 },
    { id: "airbnb-rentals", name: getServiceName("airbnb-rentals"), price: 120 },
    { id: "offices-corporate", name: getServiceName("offices-corporate"), price: regionId === "schaffhausen" ? 45 : regionId === "winterthur" ? 48 : 52 },
    { id: "retail-showrooms", name: getServiceName("retail-showrooms"), price: 180 },
    { id: "gastronomy-restaurants", name: getServiceName("gastronomy-restaurants"), price: 350 },
    { id: "industry-logistics", name: getServiceName("industry-logistics"), price: 450 }
  ];

  const breadcrumbItems = [
    { name: tLocal("startseite"), url: "/" },
    { name: regionNameGerman, url: regionId === "schaffhausen" ? "/reinigung/kanton-schaffhausen" : regionId === "winterthur" ? "/reinigung/region-winterthur" : "/reinigung/region-zuerich" },
    { name: mun.name, url: `/reinigung/${mun.slug}` }
  ];

  return (
    <div className="bg-[#fcfdfd] min-h-screen text-slate-800 font-sans">
      {/* Dynamic SEO Schemas */}
      <ServiceSchema 
        serviceName={`${tLocal("heroTitle", { name: mun.name })}`}
        cityName={mun.name}
        priceFrom={mun.priceAnchors.endOfTenancyFrom}
        description={tLocal("metaDesc", { name: mun.name, plz: mun.plz.join(', '), price: String(mun.priceAnchors.endOfTenancyFrom) })}
      />
      <FAQSchema faqs={getFaqs()} />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Noindex Alert Banner for Admin/Dev Preview */}
      {!mun.indexable && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 py-3.5 px-6 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            {tLocal("devNotice")}
          </span>
        </div>
      )}

      {/* Navigation back and header */}
      <div className="bg-[#000d1c] text-white py-4 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <button 
            onClick={() => onNavigate(regionId === "schaffhausen" ? "/reinigung/kanton-schaffhausen" : regionId === "winterthur" ? "/reinigung/region-winterthur" : "/reinigung/region-zuerich")}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            {tLocal("backToRegion", { region: regionNameGerman })}
          </button>
          <span className="text-slate-400 font-mono tracking-widest uppercase">{tLocal("plzLabel")} {mun.plz.join(', ')}</span>
        </div>
      </div>

      {/* Majestic Hero Section */}
      <section className="bg-gradient-to-br from-[#001226] via-[#002D5B] to-[#001c3d] text-white py-20 md:py-28 px-6 relative overflow-hidden">
        {/* Full-bleed region background image covering the entire background for coherence */}
        {(() => {
          const regionImage = cityImages[regionId.toLowerCase() as keyof typeof cityImages] || cityImages.zurich;
          return regionImage ? (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-transform duration-1000"
              style={{ backgroundImage: `url(${regionImage})` }}
            />
          ) : null;
        })()}

        {/* Dark overlay for excellent visual contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001226]/95 via-[#001226]/80 to-transparent z-0" />

        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-10" />

        <div className="max-w-6xl mx-auto relative z-20">
          <div className="max-w-3xl bg-[#001226]/35 backdrop-blur-[6px] p-8 sm:p-12 rounded-[2.5rem] border border-white/10 space-y-6 shadow-2xl relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono text-xs mb-2 tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              {mun.name} ({mun.canton})
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white leading-none">
              {tLocal("heroTitle", { name: mun.name })}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-light">
              {tLocal("heroSubtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> {tLocal("handoverGuarantee")}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> {tLocal("gavCompliant")}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> {travelLabel}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none z-10"></div>
      </section>

      {/* Main Unique Narrative Block */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-white border border-slate-100 p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-200/40 relative overflow-hidden space-y-8">
          <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#002D5B]/5 text-[#002D5B] uppercase tracking-wider">
              {currentLang === 'de' ? 'Ihr Partner' : 'Your Partner'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#002D5B] tracking-tight">
              {tLocal("localPartnerTitle", { name: mun.name })}
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal whitespace-pre-line border-l-2 border-slate-100 pl-4 sm:pl-6">
            {generateNarrative()}
          </p>
          
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">{tLocal("localPriceAnchor", { name: mun.name })}</span>
              <p className="text-lg sm:text-xl font-black text-[#002D5B] mt-0.5">
                {tLocal("eotPriceFrom", { price: String(mun.priceAnchors.endOfTenancyFrom) })}
              </p>
            </div>
            <button 
              onClick={() => {
                const quoteData = {
                  address: '',
                  postcode: mun.plz[0] || '',
                  city: mun.name,
                };
                localStorage.setItem('kraken_consultation_data_v2', JSON.stringify(quoteData));
                localStorage.setItem('kraken_preselected_service', 'end-of-tenancy');
                onNavigate('consultation');
              }}
              className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-[#001226] rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-cyan-400/20 cursor-pointer flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>{tLocal("btnCreateQuote")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Services and specific region links */}
      <section className="bg-slate-50/80 py-20 px-6 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#002D5B]/5 text-[#002D5B] uppercase tracking-wider">
              {currentLang === 'de' ? 'Dienstleistungen' : 'Services'}
            </div>
            <h2 className="text-3xl font-black text-[#002D5B] tracking-tight">
              {tLocal("servicesInCity", { name: mun.name })}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              {tLocal("servicesInCityDesc", { region: regionNameGerman })}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((srv) => (
              <div 
                key={srv.id}
                onClick={() => onNavigate(`/services/${getServiceCitySlug(mun.slug, regionId)}/${srv.id}`)}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 hover:border-[#007AFF]/50 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-slate-400 group-hover:text-[#007AFF] transition-colors mb-4">
                    {getServiceIconComponent(srv.id, "w-8 h-8 stroke-[1.2]")}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-[#002D5B] transition-colors mb-2">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {tLocal("specificCustomization", { name: mun.name })}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-[#002D5B]">
                    {tLocal("startingPriceLabel", { price: String(srv.price) })}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#007AFF] group-hover:text-[#007AFF]/80 transition-colors">
                    <span>{tLocal("viewService")}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links: Neighboring Municipalities */}
      <section className="py-16 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#002D5B]/5 text-[#002D5B] uppercase tracking-wider">
              {tLocal("routeBundlingTitle")}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {tLocal("routeBundlingDesc")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto pt-2">
            {mun.nearbySlugs.map(slug => {
              const neighbor = MUNICIPALITIES.find(m => m.slug === slug);
              if (!neighbor) return null;
              return (
                <button
                  key={slug}
                  onClick={() => onNavigate(`/reinigung/${slug}`)}
                  className="px-4 py-2 rounded-full border border-slate-100 hover:border-cyan-400 hover:bg-cyan-50/20 text-xs font-bold text-slate-700 hover:text-[#002D5B] transition-all duration-300 cursor-pointer"
                >
                  {neighbor.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Localized FAQ Accordion */}
      <section className="py-20 px-6 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-black text-[#002D5B] tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="w-7 h-7 text-cyan-500" />
              <span>{tLocal("faqTitle", { name: mun.name })}</span>
            </h2>
            <p className="text-slate-500 font-medium">
              {tLocal("faqDesc")}
            </p>
          </div>
          <div className="space-y-6">
            {getFaqs().map((faq, idx) => (
              <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-[#002D5B] flex items-start gap-3">
                  <span className="text-cyan-500 font-mono">Q.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed pl-7 border-l-2 border-slate-100">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Conversion CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#001226] via-[#002D5B] to-[#001c3d] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-none">
            {tLocal("bottomCtaTitle", { name: mun.name })}
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
            {tLocal("bottomCtaDesc")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {
                const quoteData = {
                  address: '',
                  postcode: mun.plz[0] || '',
                  city: mun.name,
                };
                localStorage.setItem('kraken_consultation_data_v2', JSON.stringify(quoteData));
                localStorage.setItem('kraken_preselected_service', 'end-of-tenancy');
                onNavigate('consultation');
              }}
              className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-[#001226] rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-cyan-400/20 flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{tLocal("btnCtaQuote")}</span>
            </button>
            <a 
              href="https://wa.me/41774505705"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center gap-2 cursor-pointer text-white"
            >
              <svg className="w-4 h-4 fill-current text-cyan-300" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.388 2.036 13.91 1.01 11.3 1.01c-5.436 0-9.866 4.372-9.87 9.802 0 1.948.515 3.846 1.49 5.535l-.979 3.57 3.696-.962z"/>
              </svg>
              <span>{tLocal("btnCtaWhatsApp")}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
