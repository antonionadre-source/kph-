import React, { useEffect } from 'react';
import { useTranslation } from '../i18n';
import { MUNICIPALITIES, Municipality } from '../src/data/locations';
import { 
  LocalBusinessSchema, 
  FAQSchema, 
  BreadcrumbSchema 
} from './SchemaComponents';
import { 
  MapPin, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Check, 
  ChevronRight, 
  HelpCircle, 
  PhoneCall, 
  Calculator 
} from 'lucide-react';

interface RegionHubPageProps {
  regionId: "schaffhausen" | "winterthur" | "zuerich";
  onNavigate: (page: string) => void;
}

const LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  de: {
    metaTitle_schaffhausen: "Reinigung & Facility Management im Kanton Schaffhausen | Kraken PFM",
    metaTitle_winterthur: "Reinigung & Facility Management Region Winterthur | Kraken PFM",
    metaTitle_zuerich: "Reinigung & Facility Management Region Zürich | Kraken PFM",
    metaDesc_schaffhausen: "Professionelle Reinigung & Facility Management im Kanton Schaffhausen. GAV-konform, versichert bis CHF 10 Mio., Übergabegarantie & Sofort-Offerte.",
    metaDesc_winterthur: "Ihr Partner für Unterhaltsreinigung & Umzugsreinigung in der Region Winterthur. Schweizer Qualitätsstandards, faires Team & Abnahmegarantie.",
    metaDesc_zuerich: "Premium-Facility-Services & Reinigung in Zürich. CO2-kompensierte Anfahrt, versichert bis CHF 10 Mio. Jetzt online kalkulieren.",
    cantonLabel_schaffhausen: "Kanton Schaffhausen",
    cantonLabel_winterthur: "Grossraum Winterthur",
    cantonLabel_zuerich: "Stadt Zürich & Agglomeration",
    heroTitle: "Reinigung & Facility Management im {region}",
    heroSubtitle: "Schweizer Qualitätsstandards für Liegenschaften, Wohnungen und Gewerbeflächen. Festpreisgarantie, GAV-konform und unkomplizierte Abwicklung.",
    btnCalculate: "Sofort-Offerte berechnen",
    btnWhatsApp: "WhatsApp Beratung",
    trust_insurance: "Versichert bis CHF 10 Mio.",
    trust_gav: "GAV-konform & AHV",
    trust_team: "Festes Team vor Ort",
    trust_handover: "100% Abnahmegarantie",
    trust_materials: "Material inklusive",
    trust_online: "Sofort-Offerte online",
    introTitle: "Ihr zertifizierter Reinigungspartner vor Ort",
    einsatzTitle: "Unsere Einsatzgebiete in der Region",
    einsatzDesc: "Wählen Sie Ihre Gemeinde für spezifische lokale Details, Preisstufen und Buchungsfenster. {policy}",
    policy_schaffhausen: "Keine Anfahrtsgebühr in Schaffhausen Stadt und angrenzenden Gemeinden.",
    policy_winterthur: "Optimale Routenplanung reduziert die Anfahrtskosten im Raum Winterthur auf ein Minimum.",
    policy_zuerich: "Transparente, entfernungsabhängige Logistikpauschalen im gesamten Kanton Zürich.",
    openLocalPage: "Lokale Seite öffnen",
    servicesTitle: "Unsere Services in {region}",
    servicesDesc: "Vollständig anpassbare Dienstleistungen mit Übergabegarantie und transparenten Kosten.",
    priceStartingAt: "Ab CHF {price}",
    moreDetails: "Mehr Details",
    faqTitle: "Häufig gestellte Fragen (FAQ) – {region}",
    faqDesc: "Haben Sie Fragen zu unseren Services oder Einsatzbedingungen? Finden Sie hier schnelle Antworten oder kontaktieren Sie uns direkt.",
    ctaTitle: "Schluss mit dem Reinigungs-Chaos.",
    ctaDesc: "Sichern Sie sich jetzt Ihre stressfreie Übergabe oder Ihre makellose Unterhaltsreinigung. Berechnen Sie Ihren Fixpreis sofort online oder senden Sie uns eine unkomplizierte Anfrage.",
    btnCtaCalculate: "Jetzt Offerte berechnen",
    region_schaffhausen: "Kanton Schaffhausen",
    region_winterthur: "Region Winterthur",
    region_zuerich: "Region Zürich",
    back_to_region: "Zurück zur Region {region}",
    plz: "PLZ",
    startseite: "Startseite",
    srv_eot: "Umzugsreinigung",
    srv_deep: "Tiefenreinigung",
    srv_daily: "Unterhaltsreinigung",
    srv_moving: "Umzug & Möbeltransport",
    srv_gardening: "Gartenpflege",
    srv_window: "Fensterreinigung",
    srv_desc_eot: "Professionelle Endreinigung mit 100% Abnahmegarantie für eine absolut reibungslose Übergabe.",
    srv_desc_deep: "Intensive Tiefenreinigung für langanhaltende Frische, porentiefe Sauberkeit und Werterhalt.",
    srv_desc_daily: "Regelmässige Unterhaltsreinigung für ein konstant gepflegtes, hygienisches Zuhause oder Büro.",
    srv_desc_moving: "Sicherer, stressfreier Umzug und Möbeltransport mit unserem eingespielten lokalen Team.",
    srv_desc_gardening: "Fachgerechte Pflege, Heckenschnitt und Rasenpflege für Ihre grüne Oase.",
    srv_desc_window: "Streifenfreier Glanz für alle Fenster und Glasflächen inklusive Rahmen und Simsen."
  },
  en: {
    metaTitle_schaffhausen: "Cleaning & Facility Management in Canton of Schaffhausen | Kraken PFM",
    metaTitle_winterthur: "Cleaning & Facility Management Region Winterthur | Kraken PFM",
    metaTitle_zuerich: "Cleaning & Facility Management Region Zurich | Kraken PFM",
    metaDesc_schaffhausen: "Professional cleaning & facility management in Canton of Schaffhausen. GAV-compliant, insured up to CHF 10 million, handover guarantee & instant quote.",
    metaDesc_winterthur: "Your partner for maintenance cleaning & move-out cleaning in Winterthur. Swiss quality standards, fair team & handover guarantee.",
    metaDesc_zuerich: "Premium facility services & cleaning in Zurich. CO2-compensated travel, insured up to CHF 10 million. Calculate online now.",
    cantonLabel_schaffhausen: "Canton of Schaffhausen",
    cantonLabel_winterthur: "Greater Winterthur Area",
    cantonLabel_zuerich: "Zurich City & Agglomeration",
    heroTitle: "Cleaning & Facility Management in {region}",
    heroSubtitle: "Swiss quality standards for properties, apartments, and commercial spaces. Fixed price guarantee, GAV-compliant, and simple booking.",
    btnCalculate: "Calculate Instant Quote",
    btnWhatsApp: "WhatsApp Support",
    trust_insurance: "Insured up to CHF 10M",
    trust_gav: "GAV-compliant & AHV",
    trust_team: "Local Permanent Team",
    trust_handover: "100% Handover Guarantee",
    trust_materials: "Equipment & Materials Inc.",
    trust_online: "Instant Online Quote",
    introTitle: "Your Certified Local Cleaning Partner",
    einsatzTitle: "Our Service Areas in the Region",
    einsatzDesc: "Select your municipality for specific local details, price tiers, and booking windows. {policy}",
    policy_schaffhausen: "No travel fee in Schaffhausen city and neighboring municipalities.",
    policy_winterthur: "Optimal route planning minimizes travel costs in the Winterthur area.",
    policy_zuerich: "Transparent, distance-based logistics flat rates throughout the canton of Zurich.",
    openLocalPage: "Open local page",
    servicesTitle: "Our Services in {region}",
    servicesDesc: "Fully customizable services with a handover guarantee and transparent pricing.",
    priceStartingAt: "From CHF {price}",
    moreDetails: "More details",
    faqTitle: "Frequently Asked Questions (FAQ) – {region}",
    faqDesc: "Do you have questions about our services or terms? Find quick answers here or contact us directly.",
    ctaTitle: "No More Cleaning Chaos.",
    ctaDesc: "Secure your stress-free apartment handover or pristine maintenance cleaning now. Calculate your fixed price instantly online or send us a simple inquiry.",
    btnCtaCalculate: "Calculate Quote Now",
    region_schaffhausen: "Canton of Schaffhausen",
    region_winterthur: "Winterthur Region",
    region_zuerich: "Zurich Region",
    back_to_region: "Back to Region {region}",
    plz: "Postal Code",
    startseite: "Home",
    srv_eot: "Move-out Cleaning",
    srv_deep: "Deep Cleaning",
    srv_daily: "Maintenance Cleaning",
    srv_moving: "Moving & Transport",
    srv_gardening: "Garden Care",
    srv_window: "Window Cleaning",
    srv_desc_eot: "Professional end-of-tenancy cleaning with 100% handover guarantee for an absolute smooth transition.",
    srv_desc_deep: "Intensive deep cleaning for long-lasting freshness, deep pore cleanliness, and value preservation.",
    srv_desc_daily: "Regular maintenance cleaning for a consistently neat, hygienic home or office environment.",
    srv_desc_moving: "Safe, stress-free relocation and furniture transport with our well-trained local team.",
    srv_desc_gardening: "Professional garden maintenance, hedge trimming, and lawn care for your green oasis.",
    srv_desc_window: "Streak-free shine for all windows and glass surfaces, including frames and sills."
  },
  es: {
    metaTitle_schaffhausen: "Limpieza y Facility Management en el Cantón de Schaffhausen | Kraken PFM",
    metaTitle_winterthur: "Limpieza y Facility Management en la Región de Winterthur | Kraken PFM",
    metaTitle_zuerich: "Limpieza y Facility Management en la Región de Zúrich | Kraken PFM",
    metaDesc_schaffhausen: "Limpieza profesional y gestión de instalaciones en Schaffhausen. Conforme a GAV, seguro de hasta 10M CHF, garantía de entrega y presupuesto al instante.",
    metaDesc_winterthur: "Su socio para limpieza de mantenimiento y de fin de alquiler en Winterthur. Estándares de calidad suizos, personal justo y garantía de entrega.",
    metaDesc_zuerich: "Servicios de limpieza y mantenimiento premium en Zúrich. Desplazamiento compensado en CO2, asegurado hasta 10M CHF. Calcule en línea hoy.",
    cantonLabel_schaffhausen: "Cantón de Schaffhausen",
    cantonLabel_winterthur: "Área Metropolitana de Winterthur",
    cantonLabel_zuerich: "Ciudad de Zúrich y Alrededores",
    heroTitle: "Limpieza y Facility Management en {region}",
    heroSubtitle: "Estándares de calidad suizos para propiedades, apartamentos y locales comerciales. Garantía de precio fijo, equipos conforme a GAV y gestión sencilla.",
    btnCalculate: "Calcular Presupuesto Al Instante",
    btnWhatsApp: "Asesoría por WhatsApp",
    trust_insurance: "Seguro de hasta CHF 10M",
    trust_gav: "Conforme a GAV y AHV",
    trust_team: "Equipo local fijo",
    trust_handover: "Garantía de entrega 100%",
    trust_materials: "Materiales incluidos",
    trust_online: "Presupuesto en línea instantáneo",
    introTitle: "Su socio de limpieza certificado local",
    einsatzTitle: "Nuestras áreas de servicio en la región",
    einsatzDesc: "Seleccione su municipio para ver detalles locales específicos, tarifas y disponibilidad. {policy}",
    policy_schaffhausen: "Sin gastos de viaje en la ciudad de Schaffhausen y municipios colindantes.",
    policy_winterthur: "La planificación óptima de rutas reduce los costes de desplazamiento en el área de Winterthur al mínimo.",
    policy_zuerich: "Tarifas de logística transparentes según la distancia en todo el cantón de Zúrich.",
    openLocalPage: "Abrir página local",
    servicesTitle: "Nuestros servicios en {region}",
    servicesDesc: "Servicios totalmente personalizables con garantía de entrega y precios transparentes.",
    priceStartingAt: "Desde CHF {price}",
    moreDetails: "Más detalles",
    faqTitle: "Preguntas frecuentes (FAQ) – {region}",
    faqDesc: "¿Tiene preguntas sobre nuestros servicios o condiciones? Encuentre respuestas rápidas aquí o contáctenos directamente.",
    ctaTitle: "Se acabó el caos de la limpieza.",
    ctaDesc: "Asegure ahora su entrega de apartamento sin estrés o su limpieza de mantenimiento perfecta. Calcule su precio fijo en línea de inmediato o envíenos una consulta sencilla.",
    btnCtaCalculate: "Calcular presupuesto ahora",
    region_schaffhausen: "Cantón de Schaffhausen",
    region_winterthur: "Región de Winterthur",
    region_zuerich: "Región de Zúrich",
    back_to_region: "Volver a la Región {region}",
    plz: "C.P.",
    startseite: "Inicio",
    srv_eot: "Limpieza de Mudanza",
    srv_deep: "Limpieza Profunda",
    srv_daily: "Limpieza de Mantenimiento",
    srv_moving: "Mudanza y Transporte",
    srv_gardening: "Cuidado de Jardín",
    srv_window: "Limpieza de Ventanas",
    srv_desc_eot: "Limpieza profesional de fin de contrato con 100% garantía de devolución para una entrega impecable.",
    srv_desc_deep: "Limpieza profunda e intensiva para una frescura duradera, higiene de poros y conservación del valor.",
    srv_desc_daily: "Limpieza regular de mantenimiento para un hogar o una oficina limpios e higiénicos constantemente.",
    srv_desc_moving: "Mudanza segura y transporte de muebles sin estrés con nuestro equipo local experto y coordinado.",
    srv_desc_gardening: "Mantenimiento profesional de jardines, corte de setos y cuidado del césped para su oasis verde.",
    srv_desc_window: "Brillo impecable y sin marcas para todas las ventanas y superficies de vidrio, marcos incluidos."
  },
  fr: {
    metaTitle_schaffhausen: "Nettoyage & Facility Management dans le Canton de Schaffhouse | Kraken PFM",
    metaTitle_winterthur: "Nettoyage & Facility Management Région Winterthour | Kraken PFM",
    metaTitle_zuerich: "Nettoyage & Facility Management Région Zurich | Kraken PFM",
    metaDesc_schaffhausen: "Nettoyage professionnel & facility management dans le Canton de Schaffhouse. Conforme CCT, assuré jusqu'à CHF 10 Mio, garantie de remise & devis immédiat.",
    metaDesc_winterthur: "Votre partenaire pour le ménage régulier & le nettoyage de fin de bail à Winterthour. Standards suisses, équipe équitable & garantie de remise.",
    metaDesc_zuerich: "Services de nettoyage & facility services premium à Zurich. Déplacement CO2 compensé, assuré à 10M CHF. Calculez votre devis en ligne.",
    cantonLabel_schaffhausen: "Canton de Schaffhouse",
    cantonLabel_winterthur: "Région de Winterthour",
    cantonLabel_zuerich: "Zurich Ville & Agglomération",
    heroTitle: "Nettoyage & Facility Management en {region}",
    heroSubtitle: "Normes de qualité suisses pour immeubles, appartements et locaux commerciaux. Garantie de prix fixe, équipes conformes à la CCT et simplicité.",
    btnCalculate: "Calculer Devis Immédiat",
    btnWhatsApp: "Conseil par WhatsApp",
    trust_insurance: "Assuré jusqu'à CHF 10M",
    trust_gav: "Conforme CCT & AVS",
    trust_team: "Équipe locale fixe",
    trust_handover: "100% Garantie de remise",
    trust_materials: "Matériel inclus",
    trust_online: "Devis en ligne immédiat",
    introTitle: "Votre partenaire de nettoyage agréé local",
    einsatzTitle: "Nos zones d'intervention dans la région",
    einsatzDesc: "Sélectionnez votre commune pour voir les détails locaux spécifiques, tarifs et créneaux. {policy}",
    policy_schaffhausen: "Aucun frais de déplacement à Schaffhouse ville et communes limitrophes.",
    policy_winterthur: "La planification d'itinéraires réduit au minimum les frais de déplacement dans la région de Winterthour.",
    policy_zuerich: "Forfaits logistiques transparents basés sur la distance dans tout le canton de Zurich.",
    openLocalPage: "Ouvrir la page locale",
    servicesTitle: "Nos services en {region}",
    servicesDesc: "Prestations entièrement personnalisables avec garantie de remise et tarifs clairs.",
    priceStartingAt: "À partir de CHF {price}",
    moreDetails: "Plus de détails",
    faqTitle: "Foire Aux Questions (FAQ) – {region}",
    faqDesc: "Vous avez des questions sur nos services ou nos conditions ? Trouvez des réponses rapides ici ou contactez-nous directement.",
    ctaTitle: "Fini le chaos du nettoyage.",
    ctaDesc: "Garantissez-vous une remise d'appartement sans stress ou un ménage d'entretien parfait. Calculez votre tarif fixe immédiatement en ligne ou envoyez-nous une demande simple.",
    btnCtaCalculate: "Calculer mon devis maintenant",
    region_schaffhausen: "Canton de Schaffhouse",
    region_winterthur: "Région de Winterthour",
    region_zuerich: "Région de Zurich",
    back_to_region: "Retour à la Région {region}",
    plz: "NPA",
    startseite: "Accueil",
    srv_eot: "Nettoyage de remise",
    srv_deep: "Nettoyage en profondeur",
    srv_daily: "Nettoyage régulier",
    srv_moving: "Déménagement & Transport",
    srv_gardening: "Entretien de jardin",
    srv_window: "Nettoyage de vitres",
    srv_desc_eot: "Nettoyage professionnel de fin de bail avec garantie de remise à 100% pour un état des lieux serein.",
    srv_desc_deep: "Nettoyage intensif et en profondeur assurant une fraîcheur durable, hygiène parfaite et maintien de valeur.",
    srv_desc_daily: "Entretien régulier de vos espaces de vie ou de travail pour garantir une propreté constante.",
    srv_desc_moving: "Service professionnel de transport et aide au déménagement sans tracas par notre équipe locale qualifiée.",
    srv_desc_gardening: "Taille des haies, entretien des pelouses et soins experts de jardinage pour préserver votre havre vert.",
    srv_desc_window: "Lavage professionnel pour un éclat sans traces de toutes les fenêtres, encadrements et rebords compris."
  },
  it: {
    metaTitle_schaffhausen: "Pulizia & Facility Management nel Canton Sciaffusa | Kraken PFM",
    metaTitle_winterthur: "Pulizia & Facility Management Regione Winterthur | Kraken PFM",
    metaTitle_zuerich: "Pulizia & Facility Management Regione Zurigo | Kraken PFM",
    metaDesc_schaffhausen: "Pulizia professionale & facility management nel Canton Sciaffusa. Conforme GAV, assicurato fino a CHF 10 mln, garanzia di consegna & preventivo immediato.",
    metaDesc_winterthur: "Il vostro partner per pulizie di manutenzione & fine locazione a Winterthur. Standard di qualità svizzeri, team onesto & garanzia di consegna.",
    metaDesc_zuerich: "Servizi di pulizia e manutenzione premium a Zurigo. Trasferte con emissioni di CO2 compensate, assicurato fino a 10M CHF. Calcola online oggi.",
    cantonLabel_schaffhausen: "Canton Sciaffusa",
    cantonLabel_winterthur: "Grande Area di Winterthur",
    cantonLabel_zuerich: "Zurigo Città e Agglomerato",
    heroTitle: "Pulizia & Facility Management in {region}",
    heroSubtitle: "Standard di qualità svizzeri per immobili, appartamenti e spazi commerciali. Garanzia di prezzo fisso, team conformi al GAV e massima semplicità.",
    btnCalculate: "Calcola Preventivo Immediato",
    btnWhatsApp: "Consulenza WhatsApp",
    trust_insurance: "Assicurato fino a CHF 10M",
    trust_gav: "Conforme GAV & AVS",
    trust_team: "Team locale fisso",
    trust_handover: "Garanzia di consegna 100%",
    trust_materials: "Materiale incluso",
    trust_online: "Preventivo online immediato",
    introTitle: "Il vostro partner locale certificato",
    einsatzTitle: "Le nostre aree di intervento nella regione",
    einsatzDesc: "Seleziona il tuo comune per visualizzare dettagli locali specifici, tariffe e disponibilità. {policy}",
    policy_schaffhausen: "Nessun costo di trasferta a Sciaffusa città e comuni limitrofi.",
    policy_winterthur: "La pianificazione ottimale dei percorsi riduce al minimo i costi di trasferta nella zona di Winterthur.",
    policy_zuerich: "Forfait logistici trasparenti in base alla distanza in tutto il Canton Zurigo.",
    openLocalPage: "Apri pagina locale",
    servicesTitle: "I nostri servizi in {region}",
    servicesDesc: "Servizi completamente personalizzabili con garanzia di consegna e costi trasparenti.",
    priceStartingAt: "Da CHF {price}",
    moreDetails: "Più dettagli",
    faqTitle: "Domande frequenti (FAQ) – {region}",
    faqDesc: "Avete domande sui nostri servizi o sulle condizioni? Trovate risposte rapide qui o contattateci direttamente.",
    ctaTitle: "Basta con il caos delle pulizie.",
    ctaDesc: "Assicuratevi subito una consegna dell'appartamento senza stress o una pulizia di manutenzione impeccabile. Calcolate il vostro prezzo fisso online o inviateci una richiesta semplice.",
    btnCtaCalculate: "Calcola preventivo adesso",
    region_schaffhausen: "Canton Sciaffusa",
    region_winterthur: "Regione di Winterthur",
    region_zuerich: "Regione di Zurigo",
    back_to_region: "Torna alla Regione {region}",
    plz: "NPA",
    startseite: "Home",
    srv_eot: "Pulizia fine locazione",
    srv_deep: "Pulizia profonda",
    srv_daily: "Pulizia di manutenzione",
    srv_moving: "Trasloco e Trasporto",
    srv_gardening: "Cura del giardino",
    srv_window: "Pulizia vetri",
    srv_desc_eot: "Pulizia finale professionale con garanzia di consegna al 100% per un rilascio chiavi senza pensieri.",
    srv_desc_deep: "Trattamento intensivo di fondo per freschezza duratura, igiene profonda e conservazione dell'immobile.",
    srv_desc_daily: "Pulizia periodica di manutenzione per una casa o un ufficio costantemente in ordine e splendenti.",
    srv_desc_moving: "Traslochi e trasporto mobili sicuri, rapidi e liberi da stress con il nostro team locale specializzato.",
    srv_desc_gardening: "Potatura siepi, taglio erba e cura del verde stagionale per mantenere in salute la vostra oasi.",
    srv_desc_window: "Lavaggio professionale per vetrate splendenti e senza aloni, comprensivo di infissi e davanzali."
  },
  pt: {
    metaTitle_schaffhausen: "Limpeza & Gestão de Imóveis no Cantão de Schaffhausen | Kraken PFM",
    metaTitle_winterthur: "Limpeza & Gestão de Imóveis na Região de Winterthur | Kraken PFM",
    metaTitle_zuerich: "Limpeza & Gestão de Imóveis na Região de Zurique | Kraken PFM",
    metaDesc_schaffhausen: "Limpeza profissional e gestão de imóveis em Schaffhausen. Em conformidade com o GAV, seguro até CHF 10M, garantia de entrega e orçamento imediato.",
    metaDesc_winterthur: "O seu parceiro para limpeza regular e limpeza de fim de contrato em Winterthur. Padrões de qualidade suíços, equipa de confiança e garantia de entrega.",
    metaDesc_zuerich: "Serviços premium de limpeza e manutenção de edifícios em Zurique. Deslocações CO2 compensadas, segurado até 10M CHF. Calcule online hoje.",
    cantonLabel_schaffhausen: "Cantão de Schaffhausen",
    cantonLabel_winterthur: "Grande Área de Winterthur",
    cantonLabel_zuerich: "Cidade de Zurique e Arredores",
    heroTitle: "Limpeza & Gestão de Imóveis em {region}",
    heroSubtitle: "Padrões de qualidade suíços para propriedades, apartamentos e áreas comerciais. Preços fixos garantidos, equipas em conformidade com o GAV e reservas fáceis.",
    btnCalculate: "Calcular Orçamento Imediato",
    btnWhatsApp: "Apoio via WhatsApp",
    trust_insurance: "Seguro até CHF 10M",
    trust_gav: "Conforme GAV & AHV",
    trust_team: "Equipa local fixa",
    trust_handover: "Garantia de entrega 100%",
    trust_materials: "Materiais incluídos",
    trust_online: "Orçamento online imediato",
    introTitle: "O seu parceiro local certificado",
    einsatzTitle: "As nossas áreas de atuação na região",
    einsatzDesc: "Selecione o seu município para ver detalhes locais específicos, tarifas e disponibilidade. {policy}",
    policy_schaffhausen: "Sem despesas de deslocação na cidade de Schaffhausen e municípios vizinhos.",
    policy_winterthur: "O planeamento otimizado de rotas minimiza as despesas de viagem na região de Winterthur.",
    policy_zuerich: "Tarifas de logística transparentes com base na distância em todo o cantão de Zurique.",
    openLocalPage: "Abrir página local",
    servicesTitle: "Os nossos serviços em {region}",
    servicesDesc: "Serviços totalmente personalizáveis com garantia de entrega e preços transparentes.",
    priceStartingAt: "A partir de CHF {price}",
    moreDetails: "Mais detalhes",
    faqTitle: "Perguntas frequentes (FAQ) – {region}",
    faqDesc: "Tem dúvidas sobre os nossos serviços ou condições? Encontre respostas rápidas aqui ou contacte-nos diretamente.",
    ctaTitle: "Chega de caos com as limpezas.",
    ctaDesc: "Garanta já uma entrega de apartamento livre de stress ou uma limpeza regular perfeita. Calcule o seu preço fixo online agora ou envie-nos um pedido simples.",
    btnCtaCalculate: "Calcular orçamento agora",
    region_schaffhausen: "Cantão de Schaffhausen",
    region_winterthur: "Região de Winterthur",
    region_zuerich: "Região de Zurique",
    back_to_region: "Voltar para a Região {region}",
    plz: "Cód. Postal",
    startseite: "Início",
    srv_eot: "Limpeza de fim de contrato",
    srv_deep: "Limpeza profunda",
    srv_daily: "Limpeza regular",
    srv_moving: "Mudanças e Transporte",
    srv_gardening: "Manutenção de jardim",
    srv_window: "Limpeza de janelas",
    srv_desc_eot: "Limpeza de entrega profissional com 100% de garantia para uma devolução da caução sem surpresas.",
    srv_desc_deep: "Limpeza intensiva de fundo para frescura duradoura, poros limpos e preservação do valor do imóvel.",
    srv_desc_daily: "Limpeza de manutenção regular para garantir uma habitação ou espaço de escritório sempre asseado.",
    srv_desc_moving: "Serviço seguro e livre de stress para mudanças residenciais por uma equipa local experiente.",
    srv_desc_gardening: "Corte de sebes, tratamento de relvados e manutenção especializada para o seu refúgio verde.",
    srv_desc_window: "Vidros e caixilhos sem marcas e impecavelmente limpos com o nosso serviço profissional."
  }
};

const INTRO_TRANSLATIONS: Record<string, Record<string, string>> = {
  de: {
    schaffhausen: `Willkommen bei Kraken Properties and Facilities Management (Kraken PFM) im Kanton Schaffhausen. Als etabliertes Dienstleistungsunternehmen mit tiefen regionalen Wurzeln an der Seewadelstrasse 3 in Schaffhausen bedienen wir die gesamte Region Schaffhausen sowie die angrenzenden Thurgauer und Zürcher Grenzgemeinden. Mit einer aktiven Abdeckung von über {numMunicipals} Gemeinden bieten wir einen äusserst speditiven Vor-Ort-Service mit kürzesten Reaktionszeiten. Unser Teammodell basiert auf fest angestellten, eingespielten Fachkräften, die streng nach dem Gesamtarbeitsvertrag (GAV) entlohnt werden und vollumfänglich sozialversichert sind. Um Ihnen maximale Sicherheit zu bieten, sind wir für sämtliche Einsätze haftpflichtversichert bis zu einer Deckungssumme von CHF 10 Millionen. Wir bändigen das Chaos für Sie – von der gründlichen Umzugsreinigung mit 100% Abnahmegarantie bis hin zur anspruchsvollen Unterhaltsreinigung von Büros und Liegenschaften. Da wir direkt aus Schaffhausen agieren, entfällt für die Kernregion die Anfahrtsgebühr vollständig, was uns zu Ihrem effizientesten Partner vor Ort macht.`,
    winterthur: `Willkommen bei Kraken PFM in der Region Winterthur. In der zweitgrössten Stadt des Kantons Zürich und ihrem vielseitigen Umland sichern wir mit präzisem Handwerk den Werterhalt und die makellose Sauberkeit Ihrer Wohn- und Gewerbeobjekte. Wir betreuen im Grossraum Winterthur aktiv {numMunicipals} Gemeinden mit höchster Schweizer Zuverlässigkeit. Unser eingespieltes Team besteht aus fest angestellten Fachleuten, die GAV-konform entlohnt und umfassend sozialversichert sind. Jeder unserer Einsätze ist durch unsere Betriebshaftpflichtversicherung bis zu CHF 10 Millionen vollständig gedeckt. Ob es sich um die Endreinigung eines renovierten Industrie-Lofts im Sulzer-Areal handelt, um regelmässige Büroreinigungen in der Altstadt oder um die Pflege anspruchsvoller Holz- und Betonböden – wir garantieren beste Qualität ohne Kompromisse. Durch unsere optimierte, CO2-kompensierte Routenplanung bündeln wir Einsätze effizient und halten die Anfahrtskosten für Sie minimal.`,
    zuerich: `Willkommen bei Kraken PFM in der Region Zürich. Im dynamischen Wirtschaftszentrum der Schweiz bieten wir erstklassige Facility Services und anspruchsvolle Reinigungslösungen für Privat- und Geschäftskunden. Wir bedienen im Einzugsgebiet Zürich und der gesamten Agglomeration {numMunicipals} wichtige Gemeinden mit herausragender Schweizer Präzision und absoluter Diskretion. Unser festes Team arbeitet unter strenger Einhaltung des Gesamtarbeitsvertrags (GAV) und ist für Ihre Sicherheit mit einer Haftpflichtdeckung von bis zu CHF 10 Millionen voll versichert. Von hochklassigen Apartments im Zürcher Seefeld über repräsentative Kanzleien an der Bahnhofstrasse bis hin zu anspruchsvollen Gewerbeflächen im Limmattal bändigen wir das Chaos hocheffizient. Dank modernster Ausrüstung und B-Corp-zertifizierter biologischer Reinigungsmittel garantieren wir ein perfektes Ergebnis bei maximaler ökologischer Verantwortung.`
  },
  en: {
    schaffhausen: `Welcome to Kraken Properties and Facilities Management (Kraken PFM) in the Canton of Schaffhausen. As an established service company with deep regional roots at Seewadelstrasse 3 in Schaffhausen, we serve the entire Schaffhausen region as well as the adjacent Thurgau and Zurich border municipalities. With an active coverage of over {numMunicipals} municipalities, we offer an extremely fast on-site service with the shortest response times. Our team model is based on permanently employed, well-coordinated specialists who are paid strictly according to the collective labor agreement (GAV) and are fully socially insured. To offer you maximum security, we are liability insured for all operations up to a coverage sum of CHF 10 million. We tame the chaos for you – from thorough move-out cleaning with a 100% handover guarantee to demanding maintenance cleaning of offices and properties. Since we operate directly from Schaffhausen, there is no travel fee for the core region, making us your most efficient local partner.`,
    winterthur: `Welcome to Kraken PFM in the Winterthur region. In the second largest city in the Canton of Zurich and its versatile surrounding area, we secure the value preservation and pristine cleanliness of your residential and commercial properties with precise craftsmanship. We actively serve {numMunicipals} municipalities in the greater Winterthur area with the highest Swiss reliability. Our experienced team consists of permanently employed professionals who are paid in accordance with the collective labor agreement (GAV) and are fully socially insured. Each of our assignments is fully covered by our business liability insurance up to CHF 10 million. Whether it is the final cleaning of a renovated industrial loft in the Sulzer-Areal, regular office cleaning in the old town, or the maintenance of demanding wooden and concrete floors – we guarantee the best quality without compromise. Through our optimized, CO2-compensated route planning, we bundle assignments efficiently and keep travel costs minimal for you.`,
    zuerich: `Welcome to Kraken PFM in the Zurich region. In the dynamic economic center of Switzerland, we offer first-class facility services and high-quality cleaning solutions for residential and commercial clients. We serve {numMunicipals} important municipalities in the Zurich area and the entire agglomeration with outstanding Swiss precision and absolute discretion. Our permanent team works in strict compliance with the collective labor agreement (GAV) and is fully insured for your safety with a liability coverage of up to CHF 10 million. From high-class apartments in Zurich's Seefeld to prestigious law firms on Bahnhofstrasse and demanding commercial spaces in the Limmattal, we tame the chaos highly efficiently. Thanks to state-of-the-art equipment and B-Corp certified organic cleaning agents, we guarantee a perfect result with maximum ecological responsibility.`
  },
  es: {
    schaffhausen: `Bienvenido a Kraken Properties and Facilities Management (Kraken PFM) en el Cantón de Schaffhausen. Como empresa de servicios consolidada con profundas raíces regionales en Seewadelstrasse 3 en Schaffhausen, servimos a toda la región de Schaffhausen, así como a los municipios fronterizos adyacentes de Turgovia y Zúrich. Con una cobertura activa de más de {numMunicipals} municipios, ofrecemos un servicio in situ extremadamente rápido con los tiempos de respuesta más cortos. Nuestro modelo de equipo se basa en especialistas contratados permanentemente y bien coordinados, retribuidos estrictamente según el convenio colectivo de trabajo (GAV) y totalmente asegurados socialmente. Para ofrecerle la máxima seguridad, disponemos de un seguro de responsabilidad civil para todas las operaciones con una cobertura de hasta 10 millones de CHF. Nosotros domamos el caos por usted: desde una limpieza profunda de fin de alquiler con garantía de entrega del 100% hasta la exigente limpieza de mantenimiento de oficinas y propiedades. Dado que operamos directamente desde Schaffhausen, no hay tarifa de viaje para la región central, lo que nos convierte en su socio local más eficiente.`,
    winterthur: `Bienvenido a Kraken PFM en la región de Winterthur. En la segunda ciudad más grande del cantón de Zúrich y sus polifacéticos alrededores, aseguramos la conservación del valor y la limpieza impecable de sus propiedades residenciales y comerciales con un trabajo preciso. Servimos activamente a {numMunicipals} municipios en la gran área de Winterthur con la más alta confiabilidad suiza. Nuestro experimentado equipo está formado por profesionales contratados permanentemente, remunerados de acuerdo con el convenio colectivo (GAV) y totalmente asegurados socialmente. Cada uno de nuestros trabajos está totalmente cubierto por nuestro seguro de responsabilidad civil empresarial hasta por CHF 10 millones. Ya sea la limpieza final de un loft industrial renovado en el Sulzer-Areal, la limpieza regular de oficinas en el casco antiguo o el cuidado de exigentes suelos de madera y hormigón, garantizamos la mejor calidad sin concesiones. A través de nuestra planificación de rutas optimizada y con compensación de CO2, agrupamos los servicios de manera eficiente y mantenemos al mínimo los gastos de viaje para usted.`,
    zuerich: `Bienvenido a Kraken PFM en la región de Zúrich. En el dinámico centro económico de Suiza, ofrecemos servicios de mantenimiento de primera clase y soluciones de limpieza sofisticadas para clientes privados y comerciales. Servimos a {numMunicipals} municipios importantes en el área de influencia de Zúrich y toda la aglomeración urbana con una excelente precisión suiza y absoluta discreción. Nuestro equipo fijo trabaja bajo el estricto cumplimiento del convenio colectivo de trabajo (GAV) y está totalmente asegurado para su tranquilidad con una cobertura de responsabilidad civil de hasta 10 millones de CHF. Desde apartamentos de lujo en el Seefeld de Zúrich hasta prestigiosos despachos en la Bahnhofstrasse y exigentes áreas comerciales en el Limmattal, domamos el caos de manera sumamente eficiente. Gracias a equipos de última generación y productos de limpieza biológicos certificados B-Corp, garantizamos un resultado perfecto con la máxima responsabilidad ecológica.`
  },
  fr: {
    schaffhausen: `Bienvenue chez Kraken Properties and Facilities Management (Kraken PFM) dans le canton de Schaffhouse. En tant qu'entreprise de services établie avec de profondes racines régionales à la Seewadelstrasse 3 à Schaffhouse, nous desservons toute la région de Schaffhouse ainsi que les communes frontalières adjacentes de Thurgovie et de Zurich. Avec une couverture active de plus de {numMunicipals} communes, nous offrons un service sur site extrêmement rapide avec les délais d'intervention les plus courts. Notre modèle d'équipe repose sur des spécialistes embauchés de manière permanente et bien coordonnés, payés strictement selon la convention collective de travail (CCT) et bénéficiant d'une couverture sociale complète. Pour vous offrir une sécurité maximale, nous sommes assurés en responsabilité civile pour toutes nos interventions jusqu'à hauteur de CHF 10 millions. Nous maîtrisons le chaos pour vous – du nettoyage de fin de bail approfondi avec garantie de remise à 100% au nettoyage d'entretien exigeant de bureaux et d'immeubles. Comme nous opérons directement depuis Schaffhouse, aucun frais de déplacement n'est facturé pour la région centrale, ce qui fait de nous votre partenaire local le plus efficace.`,
    winterthur: `Bienvenue chez Kraken PFM dans la région de Winterthour. Dans la deuxième plus grande ville du canton de Zurich et ses environs aux multiples facettes, nous garantissons la préservation de la valeur et la propreté irréprochable de vos propriétés résidentielles et commerciales grâce à un savoir-faire précis. Nous desservons activement {numMunicipals} communes dans la région de Winterthour avec la plus haute fiabilité suisse. Notre équipe expérimentée se compose de professionnels embauchés de manière permanente, rémunérés conformément à la convention collective de travail (CCT) et bénéficiant d'une couverture sociale complète. Chacune de nos interventions est entièrement couverte par notre assurance responsabilité civile professionnelle jusqu'à hauteur de CHF 10 millions. Qu'il s'agisse du nettoyage final d'un loft industriel rénové dans leSulzer-Areal, du ménage régulier de bureaux dans la vieille ville ou de l'entretien de sols délicats en bois et béton – nous garantissons la meilleure qualité sans compromis. Grâce à notre planification d'itinéraires optimisée et compensée en CO2, nous regroupons les interventions de manière efficace et réduisons au minimum vos frais de déplacement.`,
    zuerich: `Bienvenue chez Kraken PFM dans la région de Zurich. Dans le pôle économique dynamique de la Suisse, nous offrons des services de conciergerie de premier ordre et des solutions de nettoyage haut de gamme pour les clients privés et professionnels. Nous desservons {numMunicipals} communes majeures dans l'agglomération de Zurich avec une précision suisse exceptionnelle et une discrétion absolue. Notre équipe fixe travaille dans le strict respect de la convention collective de travail (CCT) et est entièrement assurée pour votre sécurité avec une couverture de responsabilité civile allant jusqu'à CHF 10 millions. Des appartements de prestige dans le Seefeld de Zurich aux cabinets d'avocats réputés de la Bahnhofstrasse, en passant par les surfaces commerciales exigeantes du Limmattal, nous maîtrisons le chaos de manière hautement efficace. Grâce à un équipement de pointe et à des produits de nettoyage biologiques certifiés B-Corp, nous garantissons un résultat impeccable dans le respect total de l'environnement.`
  },
  it: {
    schaffhausen: `Benvenuti in Kraken Properties and Facilities Management (Kraken PFM) nel Canton Sciaffusa. Come azienda di servizi consolidata con profonde radici regionali in Seewadelstrasse 3 a Sciaffusa, serviamo l'intera regione di Sciaffusa e i comuni limitrofi di Turgovia e Zurigo. Con una copertura attiva di oltre {numMunicipals} comuni, offriamo un servizio in loco estremamente tempestivo con tempi di risposta minimi. Il nostro modello di team si basa su specialisti assunti a tempo indeterminato e ben coordinati, retribuiti rigorosamente secondo il contratto collettivo di lavoro (GAV) e interamente assicurati dal punto di vista sociale. Per garantirvi la massima sicurezza, siamo assicurati per la responsabilità civile per tutti gli interventi fino a un massimale di CHF 10 milioni. Domiamo il caos per voi – dalla pulizia di fine locazione con garanzia di consegna al 100% alla pulizia di manutenzione di uffici e immobili. Poiché operiamo direttamente da Sciaffusa, non è prevista alcuna tariffa di trasferta per la regione centrale, il que ci rende il vostro partner locale più efficiente.`,
    winterthur: `Benvenuti alla Kraken PFM nella regione di Winterthur. Nella seconda città più grande del Canton Zurigo e nelle sue variegate aree circostanti, garantiamo la conservazione del valore e l'igiene impeccabile dei vostri immobili residenziali e commerciali con una cura artigianale precisa. Serviamo attivamente {numMunicipals} comuni nell'area di Winterthur con la massima affidabilità svizzera. Il nostro team esperto è composto da professionisti assunti a tempo indeterminato, retribuiti in conformità con il contratto collettivo (GAV) e completamente assicurati dal punto di vista sociale. Ognuno dei nostri interventi è interamente coperto dalla nostra assicurazione di responsabilità civile aziendale fino a CHF 10 milioni. Che si tratti della pulizia finale di un loft industriale ristrutturato nel Sulzer-Areal, della regolare pulizia degli uffici nel centro storico o della cura di pavimenti esigenti in legno e cemento, garantiamo la migliore qualità senza compromessi. Grazie alla nostra pianificazione dei percorsi ottimizzata e con emissioni di CO2 compensate, raggruppiamo i servizi in modo efficiente e riduciamo al minimo le spese di viaggio per voi.`,
    zuerich: `Benvenuti alla Kraken PFM nella regione di Zurigo. Nel dinamico centro economico della Svizzera, offriamo servizi di manutenzione di prima classe e soluzioni di pulizia avanzate per clienti privati e aziendali. Serviamo {numMunicipals} importanti comuni nell'area di Zurigo e nell'intera agglomerazione urbana con eccellente precisione svizzera e assoluta discrezione. Il nostro team fisso lavora nel rigoroso rispetto del contratto collettivo di lavoro (GAV) ed è completamente assicurato per la vostra sicurezza con una copertura di responsabilità civile fino a CHF 10 milioni. Dagli appartamentos di lusso nel quartiere Seefeld di Zurigo ai prestigiosi uffici sulla Bahnhofstrasse e alle esigenti aree commerciali nella Limmattal, gestiamo il caos con la massima efficienza. Grazie ad attrezzature all'avanguardia e a detergenti biologici certificati B-Corp, garantiamo un risultato perfetto nel rispetto dell'ambiente.`
  },
  pt: {
    schaffhausen: `Bem-vindo à Kraken Properties and Facilities Management (Kraken PFM) no Cantão de Schaffhausen. Como empresa de serviços estabelecida com profundas raízes regionais na Seewadelstrasse 3 em Schaffhausen, servimos toda a região de Schaffhausen bem como os municípios fronteiriços adjacentes de Thurgau e Zurique. Com uma cobertura ativa de mais de {numMunicipals} municípios, oferecemos um serviço no local extremamente rápido com os tempos de resposta mais curtos. O nosso modelo de equipa baseia-se em especialistas contratados permanentemente e bem coordenados, pagos estritamente de acordo com a convenção coletiva de trabalho (GAV) e totalmente segurados socialmente. Para lhe oferecer a máxima segurança, possuímos seguro de responsabilidade civil para todas as operações com uma cobertura de até CHF 10 milhões. Nós domamos o caos por si – desde a limpeza profunda de fim de contrato com garantia de entrega de 100% até à limpeza de manutenção de escritórios e imóveis. Dado que operamos diretamente de Schaffhausen, não há taxa de deslocação para a região principal, tornando-nos o seu parceiro local mais eficiente.`,
    winterthur: `Bem-vindo à Kraken PFM na região de Winterthur. Na segunda maior cidade do cantão de Zurique e nos seus arredores versáteis, garantimos a preservação do valor e a limpeza impecável das suas propriedades residenciais e comerciais com um trabalho manual preciso. Servimos ativamente {numMunicipals} municípios na grande área de Winterthur com a máxima fiabilidade suíça. A nossa equipa experiente é composta por profissionais contratados permanentemente, remunerados de acordo com o acordo coletivo (GAV) e totalmente segurados socialmente. Cada uma das nossas intervenções está totalmente coberta pelo nosso seguro de responsabilidade civil empresarial até CHF 10 milhões. Quer se trate da limpeza final de um loft industrial renovado no Sulzer-Areal, da limpeza regular de escritórios no centro histórico ou do cuidado de exigentes pavimentos de madeira e betão, garantizamos a melhor qualidade sem concessões. Através do nosso planeamento de rotas otimizado e com neutralidade de CO2, agrupamos os serviços de forma eficiente e mantemos ao mínimo as despesas de deslocação para si.`,
    zuerich: `Bem-vindo à Kraken PFM na região de Zurique. No dinâmico centro económico da Suíça, oferecemos serviços de manutenção de primeira classe e soluções de limpeza sofisticadas para clientes particulares e comerciais. Servimos {numMunicipals} municípios importantes na área de Zurique e em toda a aglomeração urbana com excelente precisão suíça e absoluta discrição. A nossa equipa fixa trabalha sob estrito cumprimento da convenção coletiva de trabalho (GAV) e está totalmente segurada para sua segurança com uma cobertura de responsabilidade civil de até CHF 10 milhões. Desde apartamentos de luxo no Seefeld de Zurique até prestigiados escritórios na Bahnhofstrasse e exigentes áreas comerciais no Limmattal, domamos o caos de forma altamente eficiente. Graças a equipamentos de última geração e produtos de limpeza biológicos certificados B-Corp, garantimos um resultado perfeito com a máxima responsabilidade ecológica.`
  }
};

const FAQ_TRANSLATIONS: Record<string, Record<string, { question: string; answer: string }[]>> = {
  de: {
    schaffhausen: [
      { question: "Wie schnell ist Kraken PFM im Kanton Schaffhausen einsatzbereit?", answer: "Dank unseres Hauptsitzes in Schaffhausen können wir Express-Einsätze oft innerhalb von 2 Stunden oder am selben Tag koordinieren." },
      { question: "Besteht eine Abnahmegarantie für die Umzugsreinigung?", answer: "Ja, jede Umzugsreinigung im Kanton Schaffhausen kommt mit einer 100%igen Abnahmegarantie. Wir begleiten die Wohnungsübergabe persönlich." },
      { question: "Werden Anfahrtsgebühren im Kanton Schaffhausen berechnet?", answer: "In der Stadt Schaffhausen und angrenzenden Gemeinden wie Neuhausen oder Feuerthalen entfallen die Anfahrtsgebühren komplett. Für entlegenere Gemeinden erheben wir eine geringe, transparente Pauschale, die wir bei Kombi-Aufträgen erlassen." },
      { question: "Sind die Reinigungskräfte von Kraken PFM versichert?", answer: "Absolut. Unsere Teams sind umfassend unfall- und haftpflichtversichert (bis CHF 10 Mio.) und arbeiten streng GAV-konform." },
      { question: "Welches Reinigungsmaterial wird verwendet?", answer: "Wir bringen sämtliche professionelle Ausrüstung und zertifizierte, umweltschonende Reinigungsmittel direkt mit. Dies ist im Preis inbegriffen." }
    ],
    winterthur: [
      { question: "Wie buche ich eine Reinigung in Winterthur?", answer: "Sie können unsere Online-Sofort-Offerte nutzen und in nur 2 Minuten einen unverbindlichen Richtpreis kalkulieren oder uns direkt über WhatsApp kontaktieren." },
      { question: "Wie berechnen sich die Preise für Winterthur?", answer: "Unsere Preise für Winterthur basieren auf unserem fairen Basistarif multipliziert mit einem moderaten Regionalfaktor von 1.12, welcher die längeren Anfahrtswege deckt." },
      { question: "Welche Gemeinden im Raum Winterthur werden bedient?", answer: "Wir bedienen die Stadt Winterthur sowie umliegende Gemeinden wie Seuzach, Wiesendangen, Neftenbach, Pfungen und Elgg." },
      { question: "Bieten Sie auch regelmässige Unterhaltsreinigungen für Büros an?", answer: "Ja, wir betreuen zahlreiche Büros, Gewerbe- und Praxisräume in Winterthur im flexiblen Abonnement oder nach Bedarf." },
      { question: "Sind die Reinigungsprodukte umweltfreundlich?", answer: "Ja, im Rahmen unseres Engagements verwenden wir primär B-Corp-zertifizierte, biologisch abbaubare Produkte von Steinfels und Diversey." }
    ],
    zuerich: [
      { question: "Welche Regionen in Zürich decken Sie ab?", answer: "Wir bedienen das gesamte Stadtgebiet Zürichs sowie wichtige Agglomerationskerne wie Kloten, Bülach, Dietikon und Uster." },
      { question: "Warum sind die Preise in Zürich leicht höher?", answer: "Wir verwenden einen Regionalfaktor von 1.22 für Zürich. Dies berücksichtigt die erhöhten Parkplatzgebühren, längere Fahrzeiten im Berufsverkehr und lokale Logistikfaktoren." },
      { question: "Ist die Abnahmegarantie bei der Wohnungsübergabe in Zürich inklusive?", answer: "Ja, unsere Umzugsreinigung beinhaltet die volle Abnahmegarantie. Unsere Teamleitung ist bei der Abnahme anwesend, um einen reibungslosen Ablauf zu sichern." },
      { question: "Welche Versicherungen hat Kraken PFM?", answer: "Wir verfügen über eine umfassende Betriebshaftpflichtversicherung bis zu CHF 10 Millionen, die alle eventuellen Schäden an exklusiven Einbauten voll abdeckt." },
      { question: "Kann ich kurzfristig eine Reinigung für Zürich buchen?", answer: "Ja, dank unseres grossen Teams können wir oft auch kurzfristige Übergaben innerhalb von 48 bis 72 Stunden in der Region Zürich realisieren." }
    ]
  },
  en: {
    schaffhausen: [
      { question: "How quickly is Kraken PFM ready for action in the Canton of Schaffhausen?", answer: "Thanks to our headquarters in Schaffhausen, we can often coordinate express operations within 2 hours or on the same day." },
      { question: "Is there a handover guarantee for move-out cleaning?", answer: "Yes, every move-out cleaning in the Canton of Schaffhausen comes with a 100% handover guarantee. We personally accompany the apartment handover." },
      { question: "Are travel fees charged in the Canton of Schaffhausen?", answer: "In the city of Schaffhausen and neighboring municipalities like Neuhausen or Feuerthalen, travel fees are completely waived. For more distant municipalities, we charge a low, transparent flat rate, which we waive for combination orders." },
      { question: "Are Kraken PFM cleaners insured?", answer: "Absolutely. Our teams are fully accident and liability insured (up to CHF 10 million) and work in strict compliance with the collective labor agreement (GAV)." },
      { question: "What cleaning materials are used?", answer: "We bring all professional equipment and certified, environmentally friendly cleaning products directly with us. This is included in the price." }
    ],
    winterthur: [
      { question: "How do I book a cleaning in Winterthur?", answer: "You can use our online instant quote to calculate a non-binding guide price in just 2 minutes or contact us directly via WhatsApp." },
      { question: "How are prices calculated for Winterthur?", answer: "Our prices for Winterthur are based on our fair basic rate multiplied by a moderate regional factor of 1.12, which covers the longer travel distances." },
      { question: "Which municipalities in the Winterthur area are served?", answer: "We serve the city of Winterthur as well as surrounding municipalities like Seuzach, Wiesendangen, Neftenbach, Pfungen, and Elgg." },
      { question: "Do you also offer regular maintenance cleaning for offices?", answer: "Yes, we care for numerous offices, commercial spaces, and medical practices in Winterthur in a flexible subscription or as needed." },
      { question: "Are the cleaning products environmentally friendly?", answer: "Yes, as part of our commitment we primarily use B-Corp certified, biodegradable products from Steinfels and Diversey." }
    ],
    zuerich: [
      { question: "Which regions in Zurich do you cover?", answer: "We serve the entire city area of Zurich as well as major agglomeration cores such as Kloten, Bülach, Dietikon, and Uster." },
      { question: "Why are the prices in Zurich slightly higher?", answer: "We use a regional factor of 1.22 for Zurich. This takes into account increased parking fees, longer travel times in rush hour traffic, and local logistical factors." },
      { question: "Is the handover guarantee included in the apartment handover in Zurich?", answer: "Yes, our move-out cleaning includes the full handover guarantee. Our team management is present during the handover to ensure a smooth process." },
      { question: "What insurance does Kraken PFM have?", answer: "We have comprehensive business liability insurance of up to CHF 10 million, which fully covers any eventual damage to exclusive installations." },
      { question: "Can I book a cleaning in Zurich at short notice?", answer: "Yes, thanks to our large team we can often realize short-term handovers within 48 to 72 hours in the Zurich region." }
    ]
  },
  es: {
    schaffhausen: [
      { question: "¿Qué tan rápido puede actuar Kraken PFM en el Cantón de Schaffhausen?", answer: "Gracias a nuestra sede central en Schaffhausen, a menudo podemos coordinar servicios exprés en un plazo de 2 horas o en el mismo día." },
      { question: "¿Hay una garantía de entrega para la limpieza de mudanza?", answer: "Sí, cada limpieza de fin de alquiler en el Cantón de Schaffhausen incluye una garantía de entrega del 100%. Acompañamos personalmente la entrega del apartamento." },
      { question: "¿Se cobran gastos de viaje en el Cantón de Schaffhausen?", answer: "En la ciudad de Schaffhausen y municipios vecinos como Neuhausen o Feuerthalen, los gastos de viaje están totalmente exentos. Para los municipios más lejanos, cobramos una tarifa plana baja y transparente, que eximimos para pedidos combinados." },
      { question: "¿Están asegurados los limpiadores de Kraken PFM?", answer: "Absolutamente. Nuestros equipos cuentan con seguro completo de accidentes y responsabilidad civil (hasta 10 millones de CHF) y trabajan bajo estricto cumplimiento del convenio colectivo (GAV)." },
      { question: "¿Qué materiales de limpieza se utilizan?", answer: "Llevamos directamente con nosotros todos los equipos profesionales y productos de limpieza certificados y respetuosos con el medio ambiente. Esto está incluido en el precio." }
    ],
    winterthur: [
      { question: "¿Cómo reservo una limpieza en Winterthur?", answer: "Puede utilizar nuestro presupuesto instantáneo en línea para calcular un precio orientativo no vinculante en solo 2 minutos o ponerse en contacto con nosotros directamente a través de WhatsApp." },
      { question: "¿Cómo se calculan los precios para Winterthur?", answer: "Nuestros precios para Winterthur se basan en nuestra tarifa básica justa multiplicada por un factor regional moderado de 1.12, que cubre las distancias de viaje más largas." },
      { question: "¿A qué municipios del área de Winterthur prestan servicio?", answer: "Prestamos servicio a la ciudad de Winterthur y a los municipios circundantes como Seuzach, Wiesendangen, Neftenbach, Pfungen y Elgg." },
      { question: "¿Ofrecen también limpieza de mantenimiento regular para oficinas?", answer: "Sí, nos encargamos de numerosas oficinas, locales comerciales y consultorios médicos en Winterthur mediante una suscripción flexible o según sea necesario." },
      { question: "¿Los productos de limpieza son respetuosos con el medio ambiente?", answer: "Sí, como parte de nuestro compromiso utilizamos principalmente productos biodegradables certificados B-Corp de Steinfels y Diversey." }
    ],
    zuerich: [
      { question: "¿Qué regiones de Zúrich cubren?", answer: "Cubrimos toda la ciudad de Zúrich, así como los principales núcleos urbanos como Kloten, Bülach, Dietikon y Uster." },
      { question: "¿Por qué los precios en Zúrich son ligeramente más altos?", answer: "Utilizamos un factor regional de 1.22 para Zúrich. Esto tiene en cuenta el aumento de las tarifas de aparcamiento, los mayores tiempos de viaje en hora punta y los factores logísticos locales." },
      { question: "¿Se incluye la garantía de entrega en el apartamento en Zúrich?", answer: "Sí, nuestra limpieza de mudanza incluye la garantía completa de entrega. La dirección de nuestro equipo está presente durante la entrega para garantizar un proceso sin problemas." },
      { question: "¿Qué seguros tiene Kraken PFM?", answer: "Disponemos de un seguro de responsabilidad civil empresarial integral de hasta 10 millones de CHF, que cubre totalmente cualquier daño eventual a instalaciones exclusivas." },
      { question: "¿Puedo reservar una limpieza en Zúrich con poca antelación?", answer: "Sí, gracias a nuestro gran equipo a menudo podemos realizar entregas a corto plazo en un plazo de 48 a 72 horas en la región de Zúrich." }
    ]
  },
  fr: {
    schaffhausen: [
      { question: "À quelle vitesse Kraken PFM peut-il intervenir dans le canton de Schaffhouse ?", answer: "Grâce à notre siège à Schaffhouse, nous pouvons souvent coordonner des interventions express en moins de 2 heures ou le jour même." },
      { question: "Existe-t-il une garantie de remise pour le nettoyage de fin de bail ?", answer: "Oui, chaque nettoyage de déménagement dans le canton de Schaffhouse est assorti d'une garantie de remise à 100%. Nous accompagnons personnellement l'état des lieux." },
      { question: "Des frais de déplacement sont-ils facturés dans le canton de Schaffhouse ?", answer: "Dans la ville de Schaffhouse et les communes voisines comme Neuhausen ou Feuerthalen, les frais de déplacement sont entièrement offerts. Pour les communes plus éloignées, nous appliquons un forfait réduit et transparent, offert en cas d'offres combinées." },
      { question: "Les agents de nettoyage de Kraken PFM sont-ils assurés ?", answer: "Absolument. Nos équipes sont entièrement couvertes par une assurance accident et responsabilité civile (jusqu'à CHF 10 millions) et travaillent dans le strict respect de la CCT." },
      { question: "Quel matériel de nettoyage est utilisé ?", answer: "Nous apportons tout le matériel professionnel et des produits de nettoyage écologiques certifiés. C'est inclus dans le prix." }
    ],
    winterthur: [
      { question: "Comment réserver un nettoyage à Winterthour ?", answer: "Vous pouvez utiliser notre outil de devis en ligne immédiat pour obtenir un tarif indicatif sans engagement en seulement 2 minutes, ou nous contacter directement via WhatsApp." },
      { question: "Comment sont calculés les tarifs pour Winterthour ?", answer: "Nos tarifs pour Winterthour sont basés sur notre tarif de base équitable multiplié par un facteur régional modéré de 1.12, qui couvre les temps de trajet." },
      { question: "Quelles communes de la région de Winterthour desservez-vous ?", answer: "Nous desservons la ville de Winterthour ainsi que les communes environnantes comme Seuzach, Wiesendangen, Neftenbach, Pfungen et Elgg." },
      { question: "Proposez-vous également des nettoyages réguliers pour les bureaux ?", answer: "Oui, nous entretenons de nombreux bureaux, commerces et cabinets médicaux à Winterthour, sous forme d'abonnements flexibles ou à la demande." },
      { question: "Les produits de nettoyage sont-ils respectueux de l'environnement ?", answer: "Oui, dans le cadre de notre engagement écologique, nous utilisons principalement des produits biodégradables certifiés B-Corp de Steinfels et Diversey." }
    ],
    zuerich: [
      { question: "Quelles régions de Zurich couvrez-vous ?", answer: "Nous desservons toute la ville de Zurich ainsi que les principaux pôles de l'agglomération tels que Kloten, Bülach, Dietikon et Uster." },
      { question: "Pourquoi les tarifs à Zurich sont-ils légèrement plus élevés ?", answer: "Nous appliquons un coefficient régional de 1.22 pour Zurich. Cela prend en compte le coût élevé des parkings, le trafic dense aux heures de pointe et les contraintes logistiques locales." },
      { question: "La garantie de remise lors de l'état des lieux à Zurich est-elle incluse ?", answer: "Oui, notre nettoyage de fin de bail inclut la garantie de remise complète. Notre responsable d'équipe est présent lors de l'état des lieux pour assurer le bon déroulement." },
      { question: "De quelles assurances Kraken PFM dispose-t-il ?", answer: "Nous disposons d'une assurance responsabilité civile professionnelle complète à hauteur de CHF 10 millions, couvrant tout dommage éventuel sur des installations haut de gamme." },
      { question: "Puis-je réserver un nettoyage de dernière minute à Zurich ?", answer: "Oui, grâce à la taille de notre équipe, nous pouvons souvent organiser des remises d'appartements urgentes sous 48 à 72 heures dans la région de Zurich." }
    ]
  },
  it: {
    schaffhausen: [
      { question: "Quanto velocemente interviene Kraken PFM nel Canton Sciaffusa?", answer: "Grazie alla nostra sede a Sciaffusa, possiamo spesso coordinare interventi express entro 2 ore o in giornata." },
      { question: "C'è una garanzia di consegna per la pulizia di fine locazione?", answer: "Sì, ogni pulizia di trasloco nel Canton Sciaffusa è dotata di una garanzia di consegna al 100%. Accompagniamo personalmente la riconsegna." },
      { question: "Vengono addebitate spese di viaggio nel Canton Sciaffusa?", answer: "Nella città di Sciaffusa e nei comuni limitrofi come Neuhausen o Feuerthalen, le spese di viaggio sono azzerate. Per i comuni più distanti, applichiamo una tariffa forfettaria ridotta e trasparente, che eliminiamo in caso di ordini combinati." },
      { question: "Gli addetti alle pulizie di Kraken PFM sono assicurati?", answer: "Assolutamente sì. I nostri team sono completamente coperti da assicurazione infortuni e responsabilità civile (fino a CHF 10 milioni) e lavorano nel rigoroso rispetto del GAV." },
      { question: "Quali materiali di pulizia vengono utilizzati?", answer: "Portiamo direttamente tutte le attrezzature professionali e prodotti detergenti certificati ecologici. Tutto incluso nel prezzo fisso." }
    ],
    winterthur: [
      { question: "Come posso prenotare una pulizia a Winterthur?", answer: "Puoi calcolare un prezzo indicativo e non vincolante in soli 2 minuti con il nostro preventivo online, oppure scriverci direttamente su WhatsApp." },
      { question: "Come vengono calcolati i prezzi per Winterthur?", answer: "I nostri prezzi per Winterthur si basano sulla nostra tariffa base moltiplicata per un fattore regionale moderato di 1.12, che copre i tempi di trasferta." },
      { question: "Quali comuni nella zona di Winterthur vengono serviti?", answer: "Serviamo la città di Winterthur e i comuni limitrofi come Seuzach, Wiesendangen, Neftenbach, Pfungen ed Elgg." },
      { question: "Offrite anche pulizie regolari di manutenzione per uffici?", answer: "Sì, gestiamo numerosi uffici, spazi commerciali e studi medici a Winterthur con formule flessibili in abbonamento o a chiamata." },
      { question: "I prodotti detergenti sono ecologici?", answer: "Sì, nell'ambito del nostro impegno per l'ambiente utilizziamo principalmente prodotti biodegradabili certificati B-Corp di Steinfels e Diversey." }
    ],
    zuerich: [
      { question: "Quali zone di Zurigo coprite?", answer: "Serviamo l'intera città di Zurigo e i principali centri dell'agglomerato come Kloten, Bülach, Dietikon e Uster." },
      { question: "Perché i prezzi a Zurigo sono leggermente più alti?", answer: "Utilizziamo un coefficiente regionale di 1.22 per Zurigo. Questo tiene conto degli alti costi di parcheggio, dei tempi di percorrenza nel traffico delle ore di punta e delle sfide logistiche locali." },
      { question: "La garanzia di consegna è inclusa per la riconsegna dell'appartamento a Zurigo?", answer: "Sì, la nostra pulizia di fine locazione include la garanzia di consegna totale. Il nostro caposquadra è presente alla consegna per garantire una procedura lineare." },
      { question: "Quali assicurazioni ha la Kraken PFM?", answer: "Disponiamo di un'assicurazione RC aziendale completa fino a CHF 10 milioni, che copre pienamente qualsiasi eventuale danno a finiture di pregio." },
      { question: "Posso prenotare una pulizia a Zurigo con scarso preavviso?", answer: "Sì, grazie al nostro ampio team possiamo spesso organizzare pulizie urgenti entro 48-72 ore nella regione di Zurigo." }
    ]
  },
  pt: {
    schaffhausen: [
      { question: "Quão rápido pode a Kraken PFM atuar no Cantão de Schaffhausen?", answer: "Graças à nossa sede em Schaffhausen, conseguimos frequentemente coordenar intervenções urgentes em menos de 2 horas ou no mesmo dia." },
      { question: "Existe garantia de entrega para a limpeza de fim de contrato?", answer: "Sim, todas as limpezas de mudança no Cantão de Schaffhausen incluem garantia de entrega de 100%. Acompanhamos pessoalmente a inspeção." },
      { question: "São cobradas despesas de deslocação no Cantão de Schaffhausen?", answer: "Na cidade de Schaffhausen e localidades vizinhas como Neuhausen ou Feuerthalen, as despesas de viagem são totalmente gratuitas. Para zonas mais distantes, aplicamos uma taxa fixa reduzida e transparente, que oferecemos em caso de serviços combinados." },
      { question: "Os funcionários de limpeza da Kraken PFM têm seguro?", answer: "Absolutamente. As nossas equipas estão totalmente seguradas contra acidentes e responsabilidade civil (até CHF 10 milhões) e trabalham sob o estrito cumprimento do GAV." },
      { question: "Que materiais de limpeza são utilizados?", answer: "Trazemos connosco todos os equipamentos profissionais e produtos de limpeza certificados e amigos do ambiente. Isto está incluído no preço." }
    ],
    winterthur: [
      { question: "Como posso reservar uma limpeza em Winterthur?", answer: "Pode utilizar o nosso simulador online para obter um orçamento indicativo sem compromisso em apenas 2 minutos, ou contactar-nos diretamente via WhatsApp." },
      { question: "Como são calculados os preços para Winterthur?", answer: "Os nossos preços para Winterthur baseiam-se na nossa tarifa básica justa multiplicada por um fator regional moderado de 1.12, que cobre as maiores distâncias de deslocação." },
      { question: "Quais são as localidades vizinhas de Winterthur que são servidas?", answer: "Servimos a cidade de Winterthur bem como as localidades adjacentes de Seuzach, Wiesendangen, Neftenbach, Pfungen e Elgg." },
      { question: "Também oferecem limpezas regulares de escritório?", answer: "Sim, cuidamos de vários escritórios, consultórios médicos e áreas comerciais em Winterthur através de avenças flexíveis ou chamadas pontuais." },
      { question: "Os vossos produtos de limpeza são amigos do ambiente?", answer: "Sim, como parte do nosso compromisso ecológico, utilizamos maioritariamente produtos biodegradáveis de marcas certificadas B-Corp como Steinfels e Diversey." }
    ],
    zuerich: [
      { question: "Quais são as áreas de Zurique cobertas pelo vosso serviço?", answer: "Servimos toda a cidade de Zurique e os principais polos da aglomeração urbana tais como Kloten, Bülach, Dietikon e Uster." },
      { question: "Por que motivo os preços em Zurique são ligeiramente superiores?", answer: "Aplicamos um coeficiente regional de 1.22 para Zurique. Isto reflete os elevados custos de estacionamento, tempos de viagem alargados nas horas de ponta e contrapontos logísticos locais." },
      { question: "A garantia de entrega está incluída no fim de contrato em Zurique?", answer: "Sim, a nossa limpeza de fim de arrendamento inclui a garantia total de entrega. O nosso encarregado estará presente na inspeção para assegurar que tudo corre na perfeição." },
      { question: "De que seguros dispõe a Kraken PFM?", answer: "Possuímos um seguro de responsabilidade civil empresarial abrangente com cobertura de até CHF 10 milhões, salvaguardando quaisquer danos eventuais em decorações ou acabamentos de luxo." },
      { question: "Posso reservar uma limpeza de urgência em Zurique com poucos dias de antecedência?", answer: "Sim, graças à dimensão da nossa equipa, conseguimos frequentemente realizar limpezas sob aviso prévio de apenas 48 a 72 horas na região de Zurique." }
    ]
  }
};

export const RegionHubPage: React.FC<RegionHubPageProps> = ({ regionId, onNavigate }) => {
  const { language } = useTranslation();
  const regionMunicipalities = MUNICIPALITIES.filter(m => m.region === regionId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [regionId]);

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

  const localizedRegionName = tLocal(`region_${regionId}`);
  const localizedCantonLabel = tLocal(`cantonLabel_${regionId}`);

  // Set document title and description dynamically
  const metaTitle = tLocal(`metaTitle_${regionId}`);
  const metaDesc = tLocal(`metaDesc_${regionId}`);

  useEffect(() => {
    document.title = metaTitle;
    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute('content', metaDesc);
    }
  }, [metaTitle, metaDesc]);

  const numMunicipals = regionMunicipalities.length;
  const travelFeePolicy = tLocal(`policy_${regionId}`);

  // Distinct wordings based on active language
  const getIntroText = () => {
    const textTemplates = INTRO_TRANSLATIONS[currentLang] || INTRO_TRANSLATIONS['de'];
    const template = textTemplates[regionId] || INTRO_TRANSLATIONS['de'][regionId];
    return template.replace('{numMunicipals}', String(numMunicipals));
  };

  const getRegionFaqs = () => {
    const faqsGroup = FAQ_TRANSLATIONS[currentLang] || FAQ_TRANSLATIONS['de'];
    return faqsGroup[regionId] || FAQ_TRANSLATIONS['de'][regionId] || [];
  };

  const servicesList = [
    { id: "end-of-tenancy", name: tLocal("srv_eot"), desc: tLocal("srv_desc_eot"), price: regionId === "schaffhausen" ? 520 : regionId === "winterthur" ? 580 : 630 },
    { id: "deep-cleaning", name: tLocal("srv_deep"), desc: tLocal("srv_desc_deep"), price: regionId === "schaffhausen" ? 320 : regionId === "winterthur" ? 360 : 390 },
    { id: "daily-cleaning", name: tLocal("srv_daily"), desc: tLocal("srv_desc_daily"), price: regionId === "schaffhausen" ? 45 : regionId === "winterthur" ? 50 : 55 },
    { id: "moving-furniture", name: tLocal("srv_moving"), desc: tLocal("srv_desc_moving"), price: 95 },
    { id: "gardening", name: tLocal("srv_gardening"), desc: tLocal("srv_desc_gardening"), price: 85 },
    { id: "window-cleaning", name: tLocal("srv_window"), desc: tLocal("srv_desc_window"), price: 75 }
  ];

  const cityNames = regionMunicipalities.map(m => m.name);
  const breadcrumbItems = [
    { name: tLocal("startseite"), url: "/" },
    { name: localizedRegionName, url: regionId === "schaffhausen" ? "/reinigung/kanton-schaffhausen" : regionId === "winterthur" ? "/reinigung/region-winterthur" : "/reinigung/region-zuerich" }
  ];

  return (
    <div className="bg-[#fcfdfd] min-h-screen text-slate-800 font-sans">
      {/* Dynamic SEO Schemas */}
      <LocalBusinessSchema citiesServed={cityNames} />
      <FAQSchema faqs={getRegionFaqs().map(f => ({ question: f.question, answer: f.answer }))} />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Majestic Hero Section */}
      <section className="bg-gradient-to-br from-[#001226] via-[#002D5B] to-[#001c3d] text-white py-20 md:py-28 px-6 relative overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono text-xs mb-2 tracking-wider uppercase">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            {localizedCantonLabel}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-white max-w-4xl leading-none">
            {tLocal("heroTitle", { region: localizedRegionName })}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed mb-8">
            {tLocal("heroSubtitle")}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => onNavigate('consultation')}
              className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-[#001226] rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-cyan-400/20 flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              {tLocal("btnCalculate")}
            </button>
            <a 
              href="https://wa.me/41774505705"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.388 2.036 13.91 1.01 11.3 1.01c-5.436 0-9.866 4.372-9.87 9.802 0 1.948.515 3.846 1.49 5.535l-.979 3.57 3.696-.962z"/>
              </svg>
              {tLocal("btnWhatsApp")}
            </a>
          </div>
        </div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      </section>

      {/* Premium Trust Bar */}
      <section className="bg-white border-y border-slate-100 py-8 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: ShieldCheck, key: "trust_insurance" },
              { icon: Users, key: "trust_gav" },
              { icon: Sparkles, key: "trust_team" },
              { icon: Check, key: "trust_handover" },
              { icon: MapPin, key: "trust_materials" },
              { icon: Calculator, key: "trust_online" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#002D5B]/5 flex items-center justify-center text-[#002D5B]">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">{tLocal(item.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="bg-slate-50/50 rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-black text-[#002D5B] mb-6 tracking-tight">
            {tLocal("introTitle")}
          </h2>
          <p className="whitespace-pre-line text-sm sm:text-base text-slate-600 leading-relaxed">
            {getIntroText()}
          </p>
        </div>
      </section>

      {/* Municipality Grid with high-end cards */}
      <section className="bg-slate-50/80 py-20 px-6 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#002D5B]/5 text-[#002D5B] uppercase tracking-wider">
              {currentLang === 'de' ? 'Gemeinden' : 'Municipalities'}
            </div>
            <h2 className="text-3xl font-black text-[#002D5B] tracking-tight">
              {tLocal("einsatzTitle")}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              {tLocal("einsatzDesc", { policy: travelFeePolicy })}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionMunicipalities.map((mun) => {
              // Localize municipality blurb fallback
              let cardBlurb = mun.localContext.uniqueBlurb;
              if (currentLang !== 'de') {
                if (mun.slug === 'schaffhausen') {
                  const translationsBlurbs: Record<string, string> = {
                    en: "In the canton capital of Schaffhausen, we ensure spotless clean spaces in historic old town houses as well as modern office buildings near the station.",
                    es: "En la capital de Schaffhausen, garantizamos una limpieza impecable en casas del casco antiguo histórico y edificios de oficinas modernos.",
                    fr: "Dans le chef-lieu cantonal de Schaffhouse, nous assurons une propreté éclatante dans les maisons anciennes de la vieille ville et les immeubles de bureaux.",
                    it: "Nel capoluogo di Sciaffusa, assicuriamo una pulizia splendente nelle case storiche del centro e nei moderni uffici vicino alla stazione.",
                    pt: "Na capital de Schaffhausen, garantimos uma limpeza impecável em casas históricas e edifícios de escritórios modernos junto à estação."
                  };
                  cardBlurb = translationsBlurbs[currentLang] || cardBlurb;
                } else if (mun.slug === 'neuhausen-am-rheinfall') {
                  const translationsBlurbs: Record<string, string> = {
                    en: "Near the famous Rhine Falls, we maintain residential and commercial spaces in Neuhausen with eco-friendly thoroughness.",
                    es: "Cerca de las famosas cataratas del Rin, mantenemos los espacios residenciales y comerciales en Neuhausen con meticulosidad ecológica.",
                    fr: "Près des célèbres chutes du Rhin, nous entretenons les espaces résidentiels et commerciaux à Neuhausen avec rigueur et respect de l'environnement.",
                    it: "Vicino alle famose cascate del Reno, manteniamo gli spazi residenziali e commerciali a Neuhausen con attenzione ecologica.",
                    pt: "Perto das famosas quedas do Reno, limpamos espaços residenciais e comerciais em Neuhausen com rigor ecológico."
                  };
                  cardBlurb = translationsBlurbs[currentLang] || cardBlurb;
                }
              }

              return (
                <div 
                  key={mun.slug}
                  onClick={() => onNavigate(`/reinigung/${mun.slug}`)}
                  className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-cyan-400 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest">{tLocal("plz")} {mun.plz.join(', ')}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-cyan-50 text-[#002D5B] uppercase tracking-wider">
                        {mun.canton}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#002D5B] transition-colors mb-2">
                      {mun.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {cardBlurb}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-600 group-hover:text-cyan-700 transition-colors mt-2">
                    <span>{tLocal("openLocalPage")}</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid (Level 3 Links) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#002D5B]/5 text-[#002D5B] uppercase tracking-wider">
              {currentLang === 'de' ? 'Services' : 'Services'}
            </div>
            <h2 className="text-3xl font-black text-[#002D5B] tracking-tight">
              {tLocal("servicesTitle", { region: localizedRegionName })}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              {tLocal("servicesDesc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((srv) => (
              <div 
                key={srv.id}
                onClick={() => onNavigate(`/services/${regionId === "zuerich" ? "zurich" : regionId}/${srv.id}`)}
                className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-cyan-400 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-[#002D5B] transition-colors mb-2">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {srv.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-[#002D5B]">
                    {tLocal("priceStartingAt", { price: String(srv.price) })}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-600 group-hover:text-cyan-700 transition-colors">
                    <span>{tLocal("moreDetails")}</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-slate-100 py-20 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-black text-[#002D5B] tracking-tight">
              {tLocal("faqTitle", { region: localizedRegionName })}
            </h2>
            <p className="text-slate-500 font-medium">
              {tLocal("faqDesc")}
            </p>
          </div>
          <div className="space-y-6">
            {getRegionFaqs().map((faq, idx) => (
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

      {/* Majestic CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#001226] via-[#002D5B] to-[#001c3d] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-none">
            {tLocal("ctaTitle")}
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {tLocal("ctaDesc")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onNavigate('consultation')}
              className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-[#001226] rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-cyan-400/20 flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              {tLocal("btnCtaCalculate")}
            </button>
            <a 
              href="tel:+41774505705"
              className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center gap-2 cursor-pointer text-white"
            >
              <PhoneCall className="w-5 h-5 text-cyan-300" />
              +41 77 450 57 05
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
