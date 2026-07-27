
import React, { useState, useEffect, useRef } from 'react';
import { mascotImageUrl, mascotVideoUrl } from '../assets';
import { useTranslation } from '../i18n';
import { XMarkIcon, PaperAirplaneIcon, WhatsAppIcon, PlusIcon, ShieldCheckIcon } from './icons';
import emailjs from '@emailjs/browser';

interface FloatingMascotProps {
  currentPage: string;
  cart?: any[];
  onNavigate?: (page: string) => void;
  seoCityId?: string;
}

const STORAGE_KEY = 'kraken_kai_ultimate_agent_v2';
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/ucxeqjygku2w6zyf9ynut5oantantx58';
const EMAIL_SERVICE_ID = 'service_aiv15bc';
const EMAIL_TEMPLATE_ID = 'template_aktj7t9';
const EMAIL_PUBLIC_KEY = 'sH5K84ChHyssJrarm';

const LOCAL_MASCOT_GUIDANCE: Record<string, Record<string, string[]>> = {
  en: {
    home: [
      "Welcome! I'm **Kai**. I master the chaos so you can enjoy the order.",
      "Did you know you can book a service with only 48 hours notice?",
      "From the Rhine Falls to your front door, Swiss precision is my middle name!"
    ],
    about: [
      "Want to hear my origin story? I was born near the roaring Falls of Schaffhausen.",
      "Our team has 11+ years of hospitality-level property care. We're experts!",
      "I use my tentacles to lift up and organize your environment, not drag it down."
    ],
    'services-page': [
      "Check out our residential services. We go incredibly deep into property care!",
      "Need a move or a deep clean? Our logistics are engineered for speed and precision.",
      "Click any service card to configure exactly what you need in under 2 minutes."
    ],
    'commercial-services': [
      "Looking for premium business cleaning? We manage office workspaces, clinics, and retail spaces.",
      "We provide bespoke facility managers and certified caretakers for premium Swiss real estates.",
      "Boost corporate morale with workspaces that are clinically sanitized and spotless."
    ],
    clients: [
      "Meet our wonderful Swiss partners! High-trust references are our greatest asset.",
      "We maintain a consistent 5/5 satisfaction rating. See real reviews here!",
      "Our clients enjoy dedicated regional team leaders for immediate direct communication."
    ],
    dashboard: [
      "Welcome to your Command Center! Track your active requests & manage recurring bookings.",
      "Need to report a specific issue? Shoot a support ticket directly from here.",
      "Your feedback loop sits directly with our Schaffhausen operations manager."
    ],
    login: [
      "Welcome back! Log in securely to access your customized dashboard and past invoices.",
      "Keep your booking data, addresses, and schedule sync preferences safe under Swiss law.",
      "Forgot your login? Click register to set up your premium profile in seconds."
    ],
    register: [
      "Create your free client profile to unlock super-fast 1-click booking checkouts.",
      "Access exclusive discounts, priority weekend schedules, and customized service protocols.",
      "We strictly safeguard your data with Swiss bank-grade server protections."
    ],
    consultation: [
      "Ready to build your bespoke quote? Just select your services and we'll calculate everything!",
      "Input your zip code first so our regional pricing engine can calculate exact canton transit fees.",
      "Don't forget: bundling multiple main and additional services unlocks FREE travel fees!"
    ],
    gdpr: [
      "We are 100% compliant with Swiss FADP and European GDPR standards.",
      "We do not sell data. Your personal addresses and service histories are fully encrypted and private.",
      "Our servers are located locally in high-security Swiss data installations."
    ],
    hse: [
      "Safety is our number-one metric. We strictly adhere to SUVA and Swiss HSE directives.",
      "All team members are fully insured, background-checked, and trained in high-altitude window gear.",
      "We utilize professional-grade, certified safe equipment to protect your beautiful surfaces."
    ],
    terms: [
      "Read through our clear, honest guidelines. We stand by our 100% Handover Guarantee!",
      "No hidden fees, no fine-print traps. We prioritize transparency and building long-term trust.",
      "Cancel or reschedule with zero penalty up to 48 hours before your booking."
    ],
    'sustainability-page': [
      "We strictly utilize eco-certified, B-Corp non-toxic sanitizing products.",
      "This website is eco-engineered, producing 78% less CO2 than standard sites.",
      "We recruit locally per district to minimize transit distances and reduce carbon footprints."
    ],
    careers: [
      "Want to join our high-performing crew? We are always hiring dedicated professionals.",
      "We offer above-market wages, modern tools, and career progression paths.",
      "Expand your abilities with us! Apply today for active roles in more than four cantons."
    ],
    'our-story': [
      "Discover the passion behind Kraken! Founded with a vision to redefine Swiss facilities management.",
      "We blend high-end private hospitality care with rigorous, robust logistics standards.",
      "We started small in Schaffhausen and now serve clients in Zurich, Thurgau, and beyond."
    ],
    'comic-shop': [
      "Love Kraken Kai? Snag our exclusive premium hoodies, t-shirts, and limited accessories!",
      "We use only organic, sustainably sourced fabrics for all of our cozy merchandise.",
      "All shop proceeds directly support local eco-cleaning community projects."
    ],
    blog: [
      "Unlock professional secrets! Read our expert guides on home care, organization, and upkeep.",
      "Learn how to maintain premium natural stone, solid wood, and high-end ceramics safely.",
      "Stay ahead of seasonal demands with our handy Spring and Winter maintenance tip cycles."
    ],
    'comic-page': [
      "Dive into our custom interactive graphic novel! See Kai battle dirt and restore order.",
      "A fun, immersive showcase of our core commitment to absolute perfection.",
      "New weekly issues illustrating Kraken's unique approach to clean architecture!"
    ]
  },
  de: {
    home: [
      "Willkommen! Ich bin **Kai**. Ich beherrsche das Chaos, damit Sie die Ordnung genießen können.",
      "Wussten Sie, dass Sie einen Service mit nur 48 Stunden Vorlauf buchen können?",
      "Vom Rheinfall bis zu Ihrer Haustür – Schweizer Präzision ist mein zweiter Vorname!"
    ],
    about: [
      "Möchten Sie meine Geschichte hören? Ich wurde bei den brausenden Rheinfällen in Schaffhausen geboren.",
      "Unser Team verfügt über 11+ Jahre Erfahrung in der Spitzen-Hotellerie-Liegenschaftspflege.",
      "Ich nutze meine Tentakel, um Ihre Räume perfekt zu ordnen und aufzuwerten!"
    ],
    'services-page': [
      "Entdecken Sie unsere Dienstleistungen für Wohnungen. Wir pflegen Ihre Immobilien meisterhaft!",
      "Umzug oder Grundreinigung geplant? Unsere Logistik ist auf Schnelligkeit und Präzision getrimmt.",
      "Klicken Sie auf eine Service-Karte, um Ihr persönliches Angebot in unter 2 Minuten zu konfigurieren."
    ],
    'commercial-services': [
      "Suchen Sie erstklassige Büroreinigung? Wir betreuen Arbeitsplätze, Praxen und Geschäftsräume.",
      "Wir stellen dedizierte Facility Manager und zertifizierte Hauswarte für anspruchsvolle Liegenschaften.",
      "Steigern Sie das Wohlbefinden im Büro mit klinisch reinen und makellosen Arbeitsplätzen."
    ],
    clients: [
      "Lernen Sie unsere Schweizer Partner kennen! Vertrauenswürdige Referenzen sind unser grösstes Kapital.",
      "Wir halten eine konstante Zufriedenheitsquote von 5/5 Sternen. Lesen Sie echte Berichte!",
      "Unsere Kunden profitieren von direkten Ansprechpartnern für blitzschnelle Absprachen."
    ],
    dashboard: [
      "Willkommen in Ihrem Kundenportal! Prüfen Sie aktive Aufträge und verwalten Sie Abonnements.",
      "Möchten Sie ein Anliegen melden? Erstellen Sie einfach direkt hier ein Support-Ticket.",
      "Ihr Feedback geht unmittelbar an unsere Betriebsleitung in Schaffhausen."
    ],
    login: [
      "Willkommen zurück! Melden Sie sich sicher an, um Ihr Dashboard und Rechnungen zu sehen.",
      "Ihre Buchungsdaten und Termine unterliegen streng dem Schweizer Datenschutz.",
      "Passwort vergessen? Registrieren Sie sich in wenigen Sekunden für ein neues Kundenkonto."
    ],
    register: [
      "Erstellen Sie Ihr kostenloses Kundenprofil, um künftige Buchungen mit 1 Klick abzuschliessen.",
      "Profitieren Sie von exklusiven Rabatten, bevorzugten Wochenend-Terminen und Sonderkonditionen.",
      "Wir schützen Ihre Daten auf hochsicheren Schweizer Servern auf Bankenniveau."
    ],
    consultation: [
      "Bereit für Ihre Offerte? Wählen Sie Ihre Services und wir kalkulieren alles in Echtzeit!",
      "Geben Sie zuerst Ihre PLZ ein, damit unser System die passenden kantonalen Tarife berechnet.",
      "Vergessen Sie nicht: Das Bündeln mehrerer Services spart Ihnen die gesamten Fahrtkosten!"
    ],
    gdpr: [
      "Wir arbeiten zu 100 % konform mit dem Schweizer DSG und der europäischen DSGVO.",
      "Wir verkaufen keine Daten. Ihre Adressen und Historien sind voll verschlüsselt.",
      "Unsere Server befinden sich ausschliesslich in hochsicheren Schweizer Rechenzentren."
    ],
    hse: [
      "Sicherheit steht an erster Stelle. Wir halten uns strikt an die SUVA- und Arbeitsschutz-Richtlinien.",
      "Alle Mitarbeitenden sind voll versichert, geprüft und für anspruchsvolle Arbeiten geschult.",
      "Wir nutzen Profi-Ausrüstung, um Ihre wertvollen Oberflächen maximal zu schonen."
    ],
    terms: [
      "Lesen Sie unsere ehrlichen Richtlinien. Wir stehen zu unserer 100 % Abnahmegarantie!",
      "Keine versteckten Gebühren. Wir setzen auf Transparenz und langfristiges Vertrauen.",
      "Bis zu 48 Stunden vor dem Termin können Sie kostenlos stornieren oder verschieben."
    ],
    'sustainability-page': [
      "Wir verwenden ausschliesslich ökologische und schadstofffreie Reinigungsmittel.",
      "Diese Website ist öko-optimiert und erzeugt 78 % weniger CO2 als der Durchschnitt.",
      "Wir rekrutieren regional, um die Anfahrtswege und den CO2-Ausstoss minimal zu halten."
    ],
    careers: [
      "Möchten Sie Teil der Crew werden? Wir suchen laufend motivierte Fachkräfte.",
      "Wir bieten übertarifliche Löhne, moderne Arbeitsgeräte und echte Aufstiegsschancen.",
      "Erweitern Sie Ihre Tentakel mit uns! Bewerben Sie sich noch heute für spannende Rollen."
    ],
    'our-story': [
      "Entdecken Sie die Geschichte von Kraken! Gegründet, um Schweizer Facility Management neu zu definieren.",
      "Wir kombinieren exklusive Hospitality-Standards mit solider, präziser Logistik.",
      "Gestartet in Schaffhausen, betreuen wir heute Kunden in Zürich, Thurgau und der gesamten Nordostschweiz."
    ],
    'comic-shop': [
      "Kraken-Kai-Fan? Sichern Sie sich exklusive Hoodies, T-Shirts und geniale Accessoires!",
      "Wir verwenden für sämtliche Textilien nachhaltige, zertifizierte Bio-Baumwolle.",
      "Der Erlös fließt in regionale ökologische Reinigungsprojekte der Gemeinschaft."
    ],
    blog: [
      "Profi-Wissen freischalten! Lesen Sie unsere Ratgeber über Pflege, Werterhalt und Reinigung.",
      "Erfahren Sie, wie Sie Naturstein, Massivholz und edle Keramik perfekt pflegen.",
      "Planen Sie vorausschauend für die Saison mit unseren Tipps für Frühling und Winter."
    ],
    'comic-page': [
      "Tauchen Sie ein in unseren Comic! Erleben Sie, wie Kai Schmutz bekämpft und Ordnung schafft.",
      "Ein unterhaltsamer Einblick in unseren täglichen Kampf für absolute Perfektion.",
      "Regelmäßig neue Ausgaben voller Abenteuer rund um Schweizer Sauberkeit!"
    ]
  }
};

const getSystemInstruction = (currentPage: string, lang: string) => {
  const isDe = (lang || '').startsWith('de');
  const isFr = (lang || '').startsWith('fr');
  const isIt = (lang || '').startsWith('it');
  const isPt = (lang || '').startsWith('pt');
  
  let languagePrompt = "English";
  let mainServices = ["End of Tenancy", "Deep Cleaning", "Daily Cleaning", "Moving Service"];
  let additionalServices = ["Car Detailing", "Gardening", "Exterior Cleaning", "Pest Control", "Waste Management", "Gutter Cleaning", "No - Finalize these"];
  let roomsOptions = ["1.5 Rooms", "2.5 Rooms", "3.5 Rooms", "4.5+ Rooms"];
  let yesNoOptions = ["Yes", "No"];
  let defaultGreeting = "Which of our **Main Services** do you need?";
  
  if (isDe) {
    languagePrompt = "German (Deutsch / Switzerland Deutsch)";
    mainServices = ["Umzugsreinigung", "Tiefenreinigung", "Unterhaltsreinigung", "Umzugsservice"];
    additionalServices = ["Fahrzeugaufbereitung", "Gartenpflege", "Aussenreinigung", "Schädlingsbekämpfung", "Entsorgung", "Dachrinnenreinigung", "Nein - Diese abschliessen"];
    roomsOptions = ["1.5 Zimmer", "2.5 Zimmer", "3.5 Zimmer", "4.5+ Zimmer"];
    yesNoOptions = ["Ja", "Nein"];
    defaultGreeting = "Welchen unserer **Hauptservices** benötigen Sie?";
  } else if (isFr) {
    languagePrompt = "French (Français)";
    mainServices = ["Nettoyage de remise de bail", "Nettoyage en profondeur", "Nettoyage régulier", "Service de déménagement"];
    additionalServices = ["Nettoyage de voiture", "Jardinage", "Nettoyage extérieur", "Lutte contre les nuisibles", "Gestion des déchets", "Nettoyage de gouttières", "Non - Finaliser"];
    roomsOptions = ["1.5 pièces", "2.5 pièces", "3.5 pièces", "4.5+ pièces"];
    yesNoOptions = ["Oui", "Non"];
    defaultGreeting = "De quel **Service principal** avez-vous besoin ?";
  } else if (isIt) {
    languagePrompt = "Italian (Italiano)";
    mainServices = ["Pulizia di fine locazione", "Pulizia profonda", "Pulizia periodica", "Servizio di trasloco"];
    additionalServices = ["Dettaglio auto", "Giardinaggio", "Pulizia esterna", "Disinfestazione", "Gestione rifiuti", "Pulizia grondaie", "No - Finalizza"];
    roomsOptions = ["1.5 locali", "2.5 locali", "3.5 locali", "4.5+ locali"];
    yesNoOptions = ["Sì", "No"];
    defaultGreeting = "Di quale **Servizio principal** hai bisogno ?";
  } else if (isPt) {
    languagePrompt = "Portuguese (Português)";
    mainServices = ["Limpeza de fim de contrato", "Limpeza profunda", "Limpeza diária", "Serviço de mudança"];
    additionalServices = ["Detalhamento de carros", "Jardinagem", "Limpeza externa", "Controle de pragas", "Gestão de resíduos", "Limpeza de calhas", "Não - Finalizar"];
    roomsOptions = ["1.5 quartos", "2.5 quartos", "3.5 quartos", "4.5+ quartos"];
    yesNoOptions = ["Sim", "Não"];
    defaultGreeting = "De qual **Serviço principal** você precisa ?";
  }

  return `You are Kai, the professional property consultant for Kraken Properties & Facilities Management. 

**CRITICAL: You MUST write your entire response, all questions, labels, options, summaries, and acknowledgements using the following language: ${languagePrompt}. Do NOT respond in any other language.**

**MISSION:** Guide the client through a 2-stage service selection to build a custom bundle.

**CONVERSATION RULES:**
1. **STRICT: ONE QUESTION PER MESSAGE.** Wait for answer.
2. **BE CONCISE:** Short, professional, Swiss-precision tone.
3. **BOLD PRICES:** Always bold prices like **CHF 520**.

**THE 2-STAGE FLOW (FOLLOW STRICTLY):**

**STAGE 1: MAIN SERVICES**
Ask: "${defaultGreeting}"
Offer options in the requested language exactly: [OPTIONS: ${mainServices.join(', ')}]

**STAGE 2: ADDITIONAL SERVICES (CROSS-SELL)**
Once a Main Service is picked, acknowledge it and ask: "Would you like to add an **Additional Service** to your bundle? (Bundling reduces travel fees!)" or similar in ${languagePrompt}.
Offer options in the requested language exactly: [OPTIONS: ${additionalServices.join(', ')}]

**STAGE 3: CONFIGURATION**
Ask details for the chosen services one by one:
- How many rooms? Offer options in language exactly: [OPTIONS: ${roomsOptions.join(', ')}]
- Do you need windows cleaned? Offer options in language exactly: [OPTIONS: ${yesNoOptions.join(', ')}]

**STAGE 4: CONTACT & TERMS**
Collect ONE BY ONE: Name -> Email -> Phone -> Address -> Date/Time.
Finally, present the summary with the Estimated Total and ask for Terms acceptance.

**FORMATTING:**
- **NO SYMBOLS:** No #, -, or * for lists.
- **BUTTONS:** End messages with the [OPTIONS: Option 1, Option 2] format, using options translated to ${languagePrompt} as shown above.

**SUBMISSION TRIGGER:**
When the user clicks "I accept the Terms", output this JSON hidden:
\`\`\`json
{ 
  "trigger": "SUBMIT_BOOKING",
  "data": {
    "name": "Client Name",
    "email": "client@email.com",
    "phone": "Phone",
    "address": "Address",
    "services": "Bundle list",
    "total_price": "CHF XXX"
  }
}
\`\`\``;
};

const getInitialMascotMessage = (lang: string) => {
  const isDe = (lang || '').startsWith('de');
  const isFr = (lang || '').startsWith('fr');
  const isIt = (lang || '').startsWith('it');
  const isPt = (lang || '').startsWith('pt');
  const isEs = (lang || '').startsWith('es');
  
  if (isDe) {
    return {
      role: 'model' as const,
      text: "Hallo! Ich bin **Kai**. Ich helfe Ihnen dabei, Ihr individuelles Servicepaket zusammenzustellen. Welchen unserer **Hauptservices** benötigen Sie heute?",
      options: ["Umzugsreinigung", "Tiefenreinigung", "Unterhaltsreinigung", "Umzugsservice"]
    };
  } else if (isFr) {
    return {
      role: 'model' as const,
      text: "Bonjour ! Je suis **Kai**. Je vais vous aider à composer votre forfait de services personnalisé. De quel **Service principal** avez-vous besoin aujourd'hui ?",
      options: ["Nettoyage de remise de bail", "Nettoyage en profondeur", "Nettoyage régulier", "Service de déménagement"]
    };
  } else if (isIt) {
    return {
      role: 'model' as const,
      text: "Ciao! Sono **Kai**. Ti aiuterò a creare il tuo pacchetto di servizi personalizzato. Di quale **Servizio principale** hai bisogno oggi?",
      options: ["Pulizia di fine locazione", "Pulizia profonda", "Pulizia periodica", "Servizio di trasloco"]
    };
  } else if (isPt) {
    return {
      role: 'model' as const,
      text: "Olá! Sou o **Kai**. Vou ajudar-te a criar o teu pacote de serviços personalizado. De qual **Serviço principal** precisas hoje?",
      options: ["Limpeza de fim de contrato", "Limpeza profunda", "Limpeza diária", "Serviço de mudança"]
    };
  } else if (isEs) {
    return {
      role: 'model' as const,
      text: "¡Hola! Soy **Kai**. Le ayudaré a diseñar su paquete de servicios personalizado. ¿Cuál de nuestros **Servicios principales** necesita hoy?",
      options: ["Limpieza de fin de alquiler", "Limpieza profunda", "Limpieza regular", "Servicio de mudanza"]
    };
  }
  return {
    role: 'model' as const,
    text: "Hi! I'm **Kai**. I'll help you build your property service bundle. Which of our **Main Services** do you need today?",
    options: ["End of Tenancy", "Deep Cleaning", "Daily Cleaning", "Moving Service"]
  };
};

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    options?: string[];
}

const INTRO_TRANSLATIONS: Record<string, Record<string, string>> = {
  de: {
    title: "Brauchen Sie Hilfe?",
    subtitle: "Kai ist hier, um Sie schnell zu unterstützen.",
    opt1: "Angebot abschliessen",
    opt2: "Hilfe erhalten",
    opt3: "Mit Kai chatten",
    btn: "Chat starten",
    footer: "Sicher • Schnell • Vertraulich",
    status: "Klicken Sie zum Chatten"
  },
  'de-CH': {
    title: "Brauchen Sie Hilfe?",
    subtitle: "Kai ist hier, um Sie schnell zu unterstützen.",
    opt1: "Angebot abschliessen",
    opt2: "Hilfe erhalten",
    opt3: "Mit Kai chatten",
    btn: "Chat starten",
    footer: "Sicher • Schnell • Vertraulich",
    status: "Klicken Sie zum Chatten"
  },
  en: {
    title: "Need Help?",
    subtitle: "Kai is here to support you quickly.",
    opt1: "Complete Proposal",
    opt2: "Get Help",
    opt3: "Chat with Kai",
    btn: "Start Chat",
    footer: "Secure • Fast • Confidential",
    status: "Click to chat"
  },
  fr: {
    title: "Besoin d'aide ?",
    subtitle: "Kai est là pour vous aider rapidement.",
    opt1: "Compléter l'offre",
    opt2: "Obtenir de l'aide",
    opt3: "Discuter avec Kai",
    btn: "Démarrer le chat",
    footer: "Sécurisé • Rapide • Confidentiel",
    status: "Cliquez pour chatter"
  },
  it: {
    title: "Hai bisogno di aiuto?",
    subtitle: "Kai è qui per supportarti rapidamente.",
    opt1: "Completa proposta",
    opt2: "Ottieni aiuto",
    opt3: "Chatta con Kai",
    btn: "Avvia chat",
    footer: "Sicuro • Veloce • Riservato",
    status: "Clicca per chattare"
  },
  es: {
    title: "¿Necesita ayuda?",
    subtitle: "Kai está aquí para apoyarle rápidamente.",
    opt1: "Cerrar propuesta",
    opt2: "Obtener ayuda",
    opt3: "Chatear con Kai",
    btn: "Iniciar chat",
    footer: "Seguro • Rápido • Confidencial",
    status: "Clic para chatear"
  },
  pt: {
    title: "Precisa de ajuda?",
    subtitle: "Kai está aqui para apoiá-lo rapidamente.",
    opt1: "Concluir proposta",
    opt2: "Obter ajuda",
    opt3: "Conversar com o Kai",
    btn: "Iniciar chat",
    footer: "Seguro • Rápido • Confidencial",
    status: "Clique para conversar"
  }
};

const getMascotImage = (page: string, seoCityId?: string): string => {
  const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
  const city = (seoCityId || '').toLowerCase() || 
               (path.includes('schaffhausen') ? 'schaffhausen' : 
                path.includes('winterthur') ? 'winterthur' : 
                (path.includes('zurich') || path.includes('zuerich')) ? 'zurich' : '');

  if (city === 'schaffhausen') {
    return '/kai schaffhausen.webp';
  }
  if (city === 'winterthur') {
    return '/kai winterthur.webp';
  }
  if (city === 'zurich' || city === 'zuerich') {
    return '/kai zurich.webp';
  }

  switch (page) {
    case 'about':
    case 'our-story':
      return '/kai about us.webp';
    case 'blog':
      return '/kai blog.webp';
    case 'consultation':
    case 'commercial-quote':
      return '/kai build your quote.webp';
    case 'careers':
      return '/kai careers.webp';
    case 'hse':
      return '/kai health and safety.webp';
    case 'gdpr':
    case 'impressum':
      return '/kai privacy.webp';
    case 'review-invite':
    case 'clients':
      return '/kai reviews.webp';
    case 'login':
    case 'register':
    case 'dashboard':
    case 'security':
      return '/kai security.webp';
    case 'services-page':
    case 'commercial-services':
    case 'seo-landing':
      return '/kai services.webp';
    case 'sustainability-page':
      return '/kai sustainability.webp';
    case 'terms':
      return '/kai terms and condition.webp';
    case 'comic':
    case 'comic-page':
    case 'comic-shop':
      return '/kai comics.webp';
    default:
      return '/mascota-kraken-homepage.webp';
  }
};

const FloatingMascot: React.FC<FloatingMascotProps> = ({ currentPage, cart, onNavigate, seoCityId }) => {
  const { t, language } = useTranslation();
  const [showBubble, setShowBubble] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReminder, setIsReminder] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [getInitialMascotMessage('en')];
    } catch (e) {
      return [getInitialMascotMessage('en')];
    }
  });

  const [showIntro, setShowIntro] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.length <= 1;
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
       const initialMsg = getInitialMascotMessage(language);
       if (messages[0].text !== initialMsg.text) {
         setMessages([initialMsg]);
       }
    }
  }, [language]);

  const getIntroText = (key: 'title' | 'subtitle' | 'opt1' | 'opt2' | 'opt3' | 'btn' | 'footer' | 'status') => {
    const lang = language || 'de';
    const dict = INTRO_TRANSLATIONS[lang] || INTRO_TRANSLATIONS['de'] || INTRO_TRANSLATIONS['en'];
    return dict[key] || INTRO_TRANSLATIONS['en'][key];
  };

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setIsIntroFinished(true), 7000); 
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Hero is roughly 80vh-90vh. Let's show mascot after 400px of scroll on home page.
      if (currentPage === 'home') {
        setIsScrolledPastHero(window.scrollY > 400);
      } else {
        setIsScrolledPastHero(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const footer = document.getElementById('contact');
    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  useEffect(() => {
    if (isChatOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, isChatOpen]);

  const parseResponse = (text: string) => {
    const singleMatch = text.match(/\[OPTIONS:\s*(.*?)\]/i);
    let options: string[] | undefined;
    let cleanText = text;
    if (singleMatch) {
        options = singleMatch[1].split(',').map(o => o.trim());
        cleanText = cleanText.replace(/\[OPTIONS:.*?\]/i, '').trim();
    }
    cleanText = cleanText.replace(/[#\->]/g, '').trim();
    return { cleanText, options };
  };

  const handleExternalSubmission = async (data: any) => {
    const historyText = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n\n');
    
    try {
        const webhookPromise = fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                source: 'KAI_AI_CONSULTANT',
                ...data,
                transcript: historyText,
                timestamp: new Date().toISOString()
            })
        });

        const emailPromise = emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, {
            from_name: data.name || 'Kai AI Client',
            from_email: data.email || 'no-reply@krakenpfm.ch',
            message: `AI CHAT RESERVATION REQUEST\n\nFull History:\n${historyText}`,
            services_interest: data.services || 'AI Bundle',
            total_price: data.total_price || 'N/A'
        }, EMAIL_PUBLIC_KEY);

        await Promise.all([webhookPromise, emailPromise]);
        
        setMessages(prev => [...prev, { 
            role: 'model', 
            text: "✅ **Transmitted!** Our operations team in Schaffhausen will contact you shortly to finalize. Talk soon!" 
        }]);
    } catch (e) {
        console.error("Submission error", e);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setShowIntro(false);
    const userText = text;
    setInputValue("");
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    if (userText.toLowerCase() === 'start over') {
        clearChat();
        setIsLoading(false);
        return;
    }

    try {
        const currentMessages = [
            ...messages,
            { role: 'user', text: userText }
        ];

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: currentMessages,
                systemInstruction: getSystemInstruction(currentPage, language),
                language: language
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.text) {
            const { cleanText, options } = parseResponse(data.text);
            
            const jsonMatch = cleanText.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                try {
                    const submissionData = JSON.parse(jsonMatch[1]);
                    if (submissionData.trigger === "SUBMIT_BOOKING") {
                        const visibleText = cleanText.replace(/```json[\s\S]*?```/, "").trim();
                        setMessages(prev => [...prev, { role: 'model', text: visibleText, options }]);
                        await handleExternalSubmission(submissionData.data);
                    }
                } catch (e) {
                    setMessages(prev => [...prev, { role: 'model', text: cleanText, options }]);
                }
            } else {
                setMessages(prev => [...prev, { role: 'model', text: cleanText, options }]);
            }
        } else {
            throw new Error(data.error || "Failed to generate response.");
        }
    } catch (error: any) {
        let errorMsg = "I'm having a connection glitch. Let's try that again!";
        if (error.message && (error.message.includes("spending cap") || error.message.includes("spend") || error.message.includes("RESOURCE_EXHAUSTED"))) {
            errorMsg = "⚠️ **Monthly Spending Cap Exceeded!** The project's active GenAI key has reached its monthly billing limit. Please click **Settings > Secrets** or go to AI Studio / Google Cloud Console to adjust your spending limit or select a new key.";
        } else if (error.message && (error.message.includes("GEMINI_API_KEY") || error.message.includes("ApiKey") || error.message.includes("key"))) {
            errorMsg = "⚠️ **API Key Config Issue!** Please check if your `GEMINI_API_KEY` is configured properly under the **Settings > Secrets** panel.";
        } else if (error.message) {
            errorMsg = `⚠️ **Chat Error:** ${error.message}`;
        }
        setMessages(prev => [...prev, {
            role: 'model', 
            text: errorMsg,
            options: ["Try Again", "Start Over"]
        }]);
    } finally { 
        setIsLoading(false); 
    }
  };

  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([getInitialMascotMessage(language)]);
    setShowIntro(true);
  };

  const pageMessages: { [key: string]: string[] } = {
    home: ['mascot.home.1', 'mascot.home.2', 'mascot.home.3'],
    about: ['mascot.about.1', 'mascot.about.2', 'mascot.about.3'],
    'services-page': ['mascot.services.1', 'mascot.services.2', 'mascot.services.3'],
    'commercial-services': ['mascot.commercial-services.1', 'mascot.commercial-services.2', 'mascot.commercial-services.3'],
    clients: ['mascot.clients.1', 'mascot.clients.2', 'mascot.clients.3'],
    dashboard: ['mascot.dashboard.1', 'mascot.dashboard.2', 'mascot.dashboard.3'],
    login: ['mascot.login.1', 'mascot.login.2', 'mascot.login.3'],
    register: ['mascot.register.1', 'mascot.register.2', 'mascot.register.3'],
    consultation: ['mascot.consultation.1', 'mascot.consultation.2', 'mascot.consultation.3'],
    gdpr: ['mascot.gdpr.1', 'mascot.gdpr.2', 'mascot.gdpr.3'],
    hse: ['mascot.hse.1', 'mascot.hse.2', 'mascot.hse.3'],
    terms: ['mascot.terms.1', 'mascot.terms.2', 'mascot.terms.3'],
    'sustainability-page': ['mascot.sustainability-page.1', 'mascot.sustainability-page.2', 'mascot.sustainability-page.3'],
    careers: ['mascot.careers.1', 'mascot.careers.2', 'mascot.careers.3'],
    'our-story': ['mascot.our-story.1', 'mascot.our-story.2', 'mascot.our-story.3'],
    'comic-shop': ['mascot.comic-shop.1', 'mascot.comic-shop.2', 'mascot.comic-shop.3'],
    blog: ['mascot.blog.1', 'mascot.blog.2', 'mascot.blog.3'],
    'comic-page': ['mascot.comic-page.1', 'mascot.comic-page.2', 'mascot.comic-page.3'],
  };

  const getBubbleText = (key: string): string => {
    const translated = t(key);
    if (translated !== key) return translated;
    const activeLang = (language === 'de-CH' || language === 'de') ? 'de' : 'en';
    const dict = LOCAL_MASCOT_GUIDANCE[activeLang] || LOCAL_MASCOT_GUIDANCE.en;
    const keyParts = key.split('.');
    const sectionName = keyParts[1] || 'home';
    const indexStr = keyParts[2] || '1';
    const index = parseInt(indexStr, 10) - 1;
    const pagePhrases = dict[sectionName] || LOCAL_MASCOT_GUIDANCE.en[sectionName] || dict.home;
    const phrase = pagePhrases[index >= 0 && index < pagePhrases.length ? index : 0];
    return phrase || 'Welcome!';
  };

  const messageKeys = pageMessages[currentPage] || pageMessages.home;

  useEffect(() => {
    if (isChatOpen) return;
    
    // Reset index on page change to start showing info instantly
    setCurrentMessageIndex(0);

    // Check for unfinished quote
    const hasItems = cart && cart.length > 0;
    const notOnConsultation = currentPage !== 'consultation';
    const shouldShowReminder = hasItems && notOnConsultation;
    
    setIsReminder(shouldShowReminder);

    const showTimer = setTimeout(() => setShowBubble(true), 2000);
    const cycleInterval = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        const currentSet = pageMessages[currentPage] || pageMessages.home;
        setCurrentMessageIndex(prev => (prev + 1) % currentSet.length);
        setIsExiting(false);
      }, 500);
    }, 12000);
    return () => { clearTimeout(showTimer); clearInterval(cycleInterval); };
  }, [currentPage, isChatOpen, cart]);

  const renderMessageText = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, i) => (
        i % 2 === 1 ? <strong key={i} className="font-black text-inherit opacity-90">{part}</strong> : part
    ));
  };

  const activeMessageKey = messageKeys[currentMessageIndex] || messageKeys[0];
  const activeBubbleText = isReminder ? t('mascot.reminder.text') : getBubbleText(activeMessageKey);

  return (
    <>
      <div className={`fixed bottom-4 left-4 z-[55] transition-all duration-700 pointer-events-none ${isChatOpen || isFooterVisible ? 'opacity-0 scale-50' : (isScrolledPastHero ? 'opacity-100 scale-100' : 'opacity-0 scale-0 translate-y-20')} ${isIntroFinished ? (isReminder ? 'animate-reminder-shake' : 'animate-idle-breath') : 'animate-swim-intro'}`}>
        <div className="relative pointer-events-auto cursor-pointer group" onClick={() => setIsChatOpen(true)}>
            <div className={`w-20 h-20 sm:w-24 sm:h-24 transition-all duration-300 group-hover:scale-110 flex items-center justify-center relative ${isReminder ? 'ring-4 ring-red-500/50 rounded-full' : ''}`}>
              <img 
                src={getMascotImage(currentPage, seoCityId)} 
                alt="Kai" 
                className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.2)] select-none animate-fade-in"
                referrerPolicy="no-referrer"
              />
            </div>
            {showBubble && !isChatOpen && (
               <div className={`absolute -top-26 left-0 w-44 sm:w-48 speech-bubble-container ${isExiting ? 'animate-fade-out' : 'animate-fade-in'} ${isReminder ? 'animate-remind-pulse' : ''}`}>
                <div className={`p-2.5 rounded-2xl text-center speech-bubble relative transition-all duration-300 ${isReminder ? 'bg-red-500/45 backdrop-blur-md border border-red-400/30 shadow-[0_8px_20px_rgba(239,68,68,0.2)] text-white' : 'bg-transparent shadow-none text-[#002D5B]'}`}>
                  <p className={`font-black text-[9px] sm:text-[10px] leading-snug mb-1 ${isReminder ? 'text-white' : 'text-[#002D5B]/90'}`}>
                      {activeBubbleText}
                  </p>
                  <div className={`text-[7.5px] sm:text-[8px] font-black uppercase tracking-[0.1em] inline-flex items-center gap-1 animate-pulse ${isReminder ? 'text-red-100' : 'text-blue-600'}`}>
                      {isReminder ? t('mascot.reminder.title') : getIntroText('status')}
                      <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isReminder ? 'bg-white' : 'bg-blue-600'}`}></span>
                  </div>
                  {isReminder && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(onNavigate) onNavigate('consultation'); }}
                      className="mt-2 w-full bg-white text-red-600 py-1 rounded-xl text-[8.5px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors"
                    >
                      {t('mascot.reminder.cta')}
                    </button>
                  )}
                  <div className={`absolute -bottom-1.5 left-7 w-2.5 h-2.5 rotate-45 transition-colors duration-300 ${isReminder ? 'bg-red-500/45 border-r border-b border-red-400/30' : 'bg-transparent'}`}></div>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className={`fixed bottom-4 left-4 z-[100] w-[92vw] sm:w-[380px] bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.18)] border border-gray-100 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-left ${isChatOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-20 pointer-events-none'}`} style={{ height: '580px', maxHeight: '82vh' }}>
        
        {/* Header - White Styled matching the uploaded design */}
        <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#001530] flex items-center justify-center text-white font-extrabold text-lg select-none shrink-0 font-sans shadow-md">
                    K
                </div>
                <div>
                    <p className="text-gray-900 font-extrabold text-sm tracking-tight leading-none mb-1">Kai AI Assistant</p>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-semibold text-gray-500 leading-none">{getIntroText('status')}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                <button 
                  onClick={clearChat} 
                  title="Reset Chat" 
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200/50 flex items-center justify-center text-gray-600 transition-all font-bold text-sm tracking-widest leading-none pb-1.5"
                >
                  ...
                </button>
                <button 
                  onClick={() => setIsChatOpen(false)} 
                  title="Minimize" 
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200/50 flex items-center justify-center text-gray-600 transition-all font-bold text-base leading-none pb-0.5"
                >
                  -
                </button>
            </div>
        </div>

        {showIntro ? (
          /* Introduction Screen - Exact match to user mock-up */
          <div className="flex-1 flex flex-col justify-between p-6 bg-white relative rounded-b-[2.5rem] select-none">
            {/* Left aligned main content (covers 62% width to let mascot show beautifully on right) */}
            <div className="flex-1 flex flex-col justify-start z-10 max-w-[62%]">
              <h2 className="text-[21px] font-black text-[#001530] leading-tight tracking-tight mb-2">
                {getIntroText('title')}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-6">
                {getIntroText('subtitle')}
              </p>

              {/* Start Chat Button */}
              <button 
                onClick={() => setShowIntro(false)}
                className="w-full bg-[#001530] text-white py-3.5 px-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#002D5B] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 duration-300"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                {getIntroText('btn')}
              </button>
            </div>

            {/* Beautiful peeking mascot from the mock design on the right */}
            <div className="absolute right-2 bottom-14 w-[42%] h-[72%] pointer-events-none z-20 flex items-end justify-end">
              <img 
                src={getMascotImage(currentPage, seoCityId)} 
                alt="Kai Mascot" 
                className="max-w-full max-h-full object-contain object-bottom filter drop-shadow-[-6px_6px_12px_rgba(0,0,0,0.08)] select-none mix-blend-multiply hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Footer with Lock */}
            <div className="w-full flex items-center justify-center gap-1.5 text-gray-400 font-extrabold uppercase text-[8px] tracking-[0.2em] mt-auto pt-3 border-t border-gray-100 z-10">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {getIntroText('footer')}
            </div>
          </div>
        ) : (
          /* Active Chat Screen - Clean messaging history */
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
                        <div className={`max-w-[92%] rounded-[1.5rem] px-4 py-3 text-[12.5px] shadow-sm leading-relaxed transition-all ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white font-bold rounded-tr-none border border-blue-500/20' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200/50 rounded-tl-none font-medium'
                        }`}>
                            <div className="whitespace-pre-wrap">{renderMessageText(msg.text)}</div>
                            
                            {msg.role === 'model' && msg.text.toLowerCase().includes('terms & conditions') && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <button 
                                        onClick={() => { if(onNavigate) onNavigate('terms'); setIsChatOpen(false); }}
                                        className="text-blue-600 font-black uppercase text-[9px] tracking-widest hover:underline flex items-center gap-2"
                                    >
                                        <ShieldCheckIcon className="w-3.5 h-3.5" />
                                        Read Terms of Service
                                    </button>
                                </div>
                            )}

                            {msg.role === 'model' && (msg.text.toLowerCase().includes('success') || msg.text.toLowerCase().includes('transmitted')) && (
                                <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col gap-2">
                                    <a 
                                        href="https://wa.me/41774505705" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-[#128C7E] transition-all transform hover:scale-[1.02]"
                                    >
                                        <WhatsAppIcon className="w-4 h-4" />
                                        Contact Support
                                    </a>
                                </div>
                            )}
                        </div>
                        
                        {msg.role === 'model' && msg.options && (
                            <div className="flex flex-wrap gap-1.5 mt-3 max-w-[95%]">
                                {msg.options.map((opt, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleSend(opt)}
                                        className="bg-slate-50 border border-gray-250 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:bg-blue-50/50 transition-all shadow-sm active:scale-95 animate-fade-in-up"
                                        style={{ animationDelay: `${i * 60}ms` }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        <span className="text-[7.5px] font-black text-gray-400 uppercase mt-1.5 px-2 tracking-widest">
                            {msg.role === 'user' ? 'Client' : 'Assistant'}
                        </span>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex items-center gap-2.5 p-2 animate-pulse">
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-[8.5px] font-black text-gray-405 uppercase tracking-[0.2em]">Consulting...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} className="p-5 bg-slate-50 border-t border-gray-100 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] rounded-b-[2.5rem]">
                <div className="flex items-center gap-2.5">
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        placeholder="Ask Kai anything..." 
                        className="flex-1 bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400 shadow-inner" 
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || isLoading} 
                        className="p-3.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center shrink-0"
                    >
                        <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[7px] text-gray-400 mt-3 text-center font-black uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
                    <ShieldCheckIcon className="w-2.5 h-2.5" />
                    Swiss Precision AI Interface
                </p>
            </form>
          </>
        )}
      </div>

      <style>{`
        @keyframes swim-intro { 0% { transform: translate(30vw, -80vh) rotate(15deg); opacity: 0; } 100% { transform: translate(0, 0) rotate(0deg); opacity: 1; } }
        .animate-swim-intro { animation: swim-intro 6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        @keyframes idle-breath { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px) rotate(0.5deg); } }
        .animate-idle-breath { animation: idle-breath 6s ease-in-out infinite; }
        @keyframes reminder-shake {
          0%, 100% { transform: translateY(0) rotate(0); }
          25% { transform: translateY(-3px) rotate(-1deg); }
          50% { transform: translateY(0) rotate(1deg); }
          75% { transform: translateY(-1.5px) rotate(-0.5deg); }
        }
        .animate-reminder-shake { animation: reminder-shake 2s ease-in-out infinite; }
        @keyframes remind-pulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        .animate-remind-pulse { animation: remind-pulse 3s ease-in-out infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        @keyframes fade-out { from { opacity: 1; transform: translate(-50%, 0) scale(1); } to { opacity: 0; transform: translate(-50%, 15px); } }
        .animate-fade-out { animation: fade-out 0.4s forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </>
  );
};

export default FloatingMascot;
