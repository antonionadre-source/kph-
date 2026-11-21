interface BrandCopy {
  hero: { eyebrow: string; title: string; accent: string; intro: string; quote: string };
  movingLink: string;
  servicesEyebrow: string; processEyebrow: string; areaEyebrow: string;
  company: string; services: string; contact: string; legal: string; tagline: string;
  portalTitle: string; portalIntro: string; signIn: string; register: string; portalFeatures: string[];
}
const copy: Record<string, BrandCopy> = {
  de: {
    movingLink: 'Was können wir transportieren?',
    hero: { eyebrow: 'Für Zuhause und Unternehmen', title: 'Reinigung und Umzug.', accent: 'Bereit für Neues.', intro: 'Reinigung, Umzug und Liegenschaftspflege für Privatpersonen und Unternehmen. In Zürich, Winterthur und Schaffhausen.', quote: 'Offerte anfragen' },
    servicesEyebrow: 'Für Zuhause und Unternehmen', processEyebrow: 'Klar von Anfang an', areaEyebrow: 'In Ihrer Nähe',
    company: 'Kraken PFM', services: 'Unsere Services', contact: 'Sprechen wir darüber', legal: 'Impressum', tagline: 'Wir kümmern uns um Ihre Räume. Sie um das, was Ihnen wichtig ist.',
    portalTitle: 'Ihre Anfragen. An einem Ort.', portalIntro: 'Behalten Sie Ihre Anfragen, Entwürfe und Unterlagen im Blick. Melden Sie sich an oder erstellen Sie Ihr Kundenkonto.', signIn: 'Anmelden', register: 'Konto erstellen', portalFeatures: ['Eigene Anfragen und Entwürfe ansehen', 'Unterlagen zur Anfrage zusammenhalten', 'Mit Ihrem persönlichen Konto anmelden'],
  },
  en: {
    movingLink: 'See what we can move',
    hero: { eyebrow: 'For homes and businesses', title: 'Cleaning and moving.', accent: 'Ready for what’s next.', intro: 'Cleaning, moving and property care for homes and businesses. Across Zurich, Winterthur and Schaffhausen.', quote: 'Get a quote' },
    servicesEyebrow: 'For your home and business', processEyebrow: 'Clear from the start', areaEyebrow: 'Close to you',
    company: 'Kraken PFM', services: 'Our services', contact: 'Let’s talk', legal: 'Legal notice', tagline: 'We take care of your spaces. You focus on what matters to you.',
    portalTitle: 'Your requests. In one place.', portalIntro: 'Keep track of your requests, drafts and documents. Sign in or create your client account.', signIn: 'Sign in', register: 'Create an account', portalFeatures: ['View your own requests and drafts', 'Keep documents with your request', 'Sign in with your personal account'],
  },
  es: {
    movingLink: 'Vea qué podemos transportar',
    hero: { eyebrow: 'Para hogares y empresas', title: 'Limpieza y mudanzas.', accent: 'Un nuevo comienzo.', intro: 'Limpieza, mudanzas y mantenimiento para particulares y empresas. En Zúrich, Winterthur y Schaffhausen.', quote: 'Pedir presupuesto' },
    servicesEyebrow: 'Para su hogar y su empresa', processEyebrow: 'Claro desde el principio', areaEyebrow: 'Cerca de usted',
    company: 'Kraken PFM', services: 'Nuestros servicios', contact: 'Hablemos', legal: 'Aviso legal', tagline: 'Cuidamos sus espacios. Usted se ocupa de lo que le importa.',
    portalTitle: 'Sus solicitudes. En un solo lugar.', portalIntro: 'Consulte sus solicitudes, borradores y documentos. Entre o cree su cuenta de cliente.', signIn: 'Iniciar sesión', register: 'Crear cuenta', portalFeatures: ['Consulte sus solicitudes y borradores', 'Reúna los documentos de cada solicitud', 'Entre con su cuenta personal'],
  },
  fr: {
    movingLink: 'Découvrez ce que nous transportons',
    hero: { eyebrow: 'Pour les particuliers et les entreprises', title: 'Nettoyage et déménagement.', accent: 'Prêts pour la suite.', intro: 'Nettoyage, déménagement et entretien pour les particuliers et les entreprises. À Zurich, Winterthour et Schaffhouse.', quote: 'Demander un devis' },
    servicesEyebrow: 'Pour votre logement et votre entreprise', processEyebrow: 'Clair dès le départ', areaEyebrow: 'Près de chez vous',
    company: 'Kraken PFM', services: 'Nos services', contact: 'Parlons-en', legal: 'Mentions légales', tagline: 'Nous prenons soin de vos espaces. Vous vous consacrez à l’essentiel.',
    portalTitle: 'Vos demandes. Au même endroit.', portalIntro: 'Retrouvez vos demandes, brouillons et documents. Connectez-vous ou créez votre compte client.', signIn: 'Se connecter', register: 'Créer un compte', portalFeatures: ['Consultez vos demandes et brouillons', 'Regroupez les documents de chaque demande', 'Connectez-vous à votre compte personnel'],
  },
  it: {
    movingLink: 'Scoprite cosa possiamo trasportare',
    hero: { eyebrow: 'Per privati e aziende', title: 'Pulizie e traslochi.', accent: 'Pronti a ricominciare.', intro: 'Pulizia, traslochi e manutenzione per privati e aziende. A Zurigo, Winterthur e Sciaffusa.', quote: 'Chiedi un preventivo' },
    servicesEyebrow: 'Per la casa e l’azienda', processEyebrow: 'Chiaro fin dall’inizio', areaEyebrow: 'Vicino a voi',
    company: 'Kraken PFM', services: 'I nostri servizi', contact: 'Parliamone', legal: 'Note legali', tagline: 'Ci prendiamo cura dei vostri spazi. Voi pensate a ciò che conta.',
    portalTitle: 'Le vostre richieste. In un unico posto.', portalIntro: 'Consultate richieste, bozze e documenti. Accedete o create il vostro account cliente.', signIn: 'Accedi', register: 'Crea un account', portalFeatures: ['Consultate le vostre richieste e bozze', 'Conservate i documenti con la richiesta', 'Accedete con il vostro account personale'],
  },
  pt: {
    movingLink: 'Veja o que podemos transportar',
    hero: { eyebrow: 'Para particulares e empresas', title: 'Limpeza e mudanças.', accent: 'Um novo começo.', intro: 'Limpeza, mudanças e manutenção para particulares e empresas. Em Zurique, Winterthur e Schaffhausen.', quote: 'Pedir orçamento' },
    servicesEyebrow: 'Para a sua casa e empresa', processEyebrow: 'Claro desde o início', areaEyebrow: 'Perto de si',
    company: 'Kraken PFM', services: 'Os nossos serviços', contact: 'Vamos conversar', legal: 'Informação legal', tagline: 'Cuidamos dos seus espaços. Dedique-se ao que mais importa.',
    portalTitle: 'Os seus pedidos. Num só lugar.', portalIntro: 'Consulte os seus pedidos, rascunhos e documentos. Entre ou crie a sua conta de cliente.', signIn: 'Entrar', register: 'Criar conta', portalFeatures: ['Consulte os seus pedidos e rascunhos', 'Reúna os documentos de cada pedido', 'Entre com a sua conta pessoal'],
  },
};
export function brandCopy(language: string): BrandCopy { return copy[language.split('-')[0]] || copy.de; }
