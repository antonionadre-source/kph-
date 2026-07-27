import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n';
import { 
  Building2, 
  Target, 
  Users, 
  History, 
  ArrowRight, 
  Quote, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck,
  Globe,
  Heart,
  Sparkles
} from 'lucide-react';
import { 
  aboutHeroImageUrl, 
  aboutOriginImages, 
  teamPhotoUrl,
  mascotImageUrl
} from '../assets';

interface OurStoryPageProps {
  onNavigate: (page: string) => void;
}

const STORY_T: Record<string, Record<string, string>> = {
  'en': {
    'hero_badge': 'Our Journey',
    'hero_title1': 'The Story',
    'hero_title2': 'Behind Kraken',
    'hero_desc': 'How a simple commitment to precision became a new standard for facility management in Switzerland.',
    'btn_timeline': 'EXPLORE TIMELINE',
    'btn_kai': 'THE LEGEND OF KAI',
    'origin_title': 'Our Story',
    'origin_desc': 'From a mop bucket in London to redefining Facility Management in Switzerland.',
    'timeline_p1_year': '2015',
    'timeline_p1_title': 'The Foundations in London',
    'timeline_p1_desc': 'Every great empire begins with a humble first step. Antonio Nadre Gomes Mendes started his career from the absolute grassroots of the sector: as a cleaner in London. It was there, on the ground, where he learned that quality is not delegated, it is lived.',
    'timeline_p2_year': 'London',
    'timeline_p2_title': 'From Operation to Strategy',
    'timeline_p2_desc': 'Over the course of a decade, he climbed every step of the trade, eventually becoming Head of Sales for a start-up in North London. An uncommon career path that gave him a 360° vision: he understands both the team that cleans and the client who trusts.',
    'timeline_p3_year': 'Switzerland',
    'timeline_p3_title': 'Experience that Makes the Difference',
    'timeline_p3_desc': 'His arrival in Switzerland, working in Zurich and Schaffhausen for renowned companies in the country, revealed a sector full of opportunities for improvement: more ethics, higher standards, and more innovation than the market previously offered.',
    'timeline_p4_year': 'January 2026',
    'timeline_p4_title': 'Kraken is Born',
    'timeline_p4_desc': 'With 11 years of international experience, we founded Kraken in German-speaking Switzerland. Our mission: to offer a standard of service and a work ethic never seen before in the sector, supported by technology and a strong commitment to sustainable products.',
    'timeline_p5_year': 'Onwards',
    'timeline_p5_title': 'Our Vision: All of Switzerland',
    'timeline_p5_desc': 'We are starting in German-speaking Switzerland, but that is only the beginning. Our goal is to expand across the entire country, broadening our range of services and bringing the same promise to every new client: Swiss precision, real innovation, and a sustainable commitment.',
    'aspirations_badge': 'OUR ASPIRATIONS',
    'aspirations_title1': 'The standard',
    'aspirations_title2': 'we strive to define.',
    'asp_point1_title': 'Swiss Quality',
    'asp_point1_desc': 'Our relentless pursuit. Every detail is a chance to prove our dedication.',
    'asp_point2_title': 'Absolute Reliability',
    'asp_point2_desc': 'Building the systems to run seamlessly so you never have to notice us.',
    'asp_point3_title': 'Radical Transparency',
    'asp_point3_desc': 'The goal of total accountability, from data to environmental impact.',
    'quote_text': '"We didn\'t start Kraken to be the biggest, but to be the most trusted. Every building has a story, and we\'re here to protect it."',
    'quote_author': '— The Founder',
    'future_badge': 'FUTURE COMMITMENTS',
    'future_title': 'Our vision for',
    'future_pt1': 'Targeting Impact',
    'future_pt2': 'Building Community',
    'future_target': 'Target 2026',
    'future_netzero': 'Net Zero Operations',
    'footer_title1': 'Every partnership',
    'footer_title2': 'is a new chapter.',
    'footer_btn': 'Start your story with us →'
  },
  'de': {
    'hero_badge': 'Unsere Reise',
    'hero_title1': 'Die Geschichte',
    'hero_title2': 'Hinter Kraken',
    'hero_desc': 'Wie aus einer einfachen Verpflichtung zur Präzision ein neuer Standard für das Gebäudemanagement in der Schweiz wurde.',
    'btn_timeline': 'ZEITACHSE ERKUNDEN',
    'btn_kai': 'DIE LEGENDE VON KAI',
    'origin_title': 'Unsere Geschichte',
    'origin_desc': 'Von einem Wischeimer in London zur Neudefinition des Facility Managements in der Schweiz.',
    'timeline_p1_year': '2015',
    'timeline_p1_title': 'Das Fundament in London',
    'timeline_p1_desc': 'Jedes grosse Imperium beginnt mit einem bescheidenen ersten Schritt. Antonio Nadre Gomes Mendes begann seine Karriere an der absoluten Basis der Branche: als Reinigungskraft in London. Dort lernte er direkt vor Ort, dass Qualität nicht delegiert, sondern gelebt wird.',
    'timeline_p2_year': 'London',
    'timeline_p2_title': 'Vom Betrieb zur Strategie',
    'timeline_p2_desc': 'Im Laufe eines Jahrzehnts kletterte er jede Stufe des Handwerks empor, bis er Head of Sales eines Start-ups im Norden Londons wurde. Ein ungewöhnlicher Werdegang, der ihm eine 360°-Sicht verschaffte: Er versteht sowohl das Reinigungsteam als auch den Kunden, der vertraut.',
    'timeline_p3_year': 'Schweiz',
    'timeline_p3_title': 'Erfahrung, die den Unterschied macht',
    'timeline_p3_desc': 'Seine Ankunft in der Schweiz und seine Arbeit in Zürich und Schaffhausen für namhafte Schweizer Unternehmen offenbarten ihm eine Branche voller Verbesserungspotenziale: mehr Ethik, höhere Standards und mehr Innovation, als der Markt bisher bot.',
    'timeline_p4_year': 'Januar 2026',
    'timeline_p4_title': 'Kraken wird geboren',
    'timeline_p4_desc': 'Mit 11 Jahren internationaler Erfahrung haben wir Kraken in der Deutschschweiz gegründet. Unsere Mission: einen im Sektor noch nie dagewesenen Servicestandard und eine neue Arbeitsethik zu bieten, gestützt auf Technologie und den konsequenten Einsatz nachhaltiger Produkte.',
    'timeline_p5_year': 'Zukunft',
    'timeline_p5_title': 'Unsere Vision: Die ganze Schweiz',
    'timeline_p5_desc': 'Wir fangen in der Deutschschweiz an, aber das ist erst der Anfang. Unser Ziel ist es, in das ganze Land zu expandieren, unser Dienstleistungsangebot zu erweitern und jedem neuen Kunden das gleiche Versprechen zu bringen: Schweizer Präzision, echte Innovation und nachhaltiges Engagement.',
    'aspirations_badge': 'UNSERE BESTREBUNGEN',
    'aspirations_title1': 'Der Standard,',
    'aspirations_title2': 'den wir zu definieren versuchen.',
    'asp_point1_title': 'Schweizer Qualität',
    'asp_point1_desc': 'Unser unermüdliches Streben. Jedes Detail ist eine Chance, unser Engagement zu beweisen.',
    'asp_point2_title': 'Absolute Zuverlässigkeit',
    'asp_point2_desc': 'Systeme so bauen, dass sie nahtlos laufen, damit Sie uns nie bemerken müssen.',
    'asp_point3_title': 'Radikale Transparenz',
    'asp_point3_desc': 'Das Ziel der totalen Rechenschaftspflicht, von den Daten bis zur Umweltbelastung.',
    'quote_text': '"Wir haben Kraken nicht gegründet, um die Grössten zu sein, sondern um das grösste Vertrauen zu geniessen. Jedes Gebäude hat eine Geschichte, und wir sind hier, um sie zu schützen."',
    'quote_author': '— Der Gründer',
    'future_badge': 'ZUKÜNFTIGE ENGAGEMENTS',
    'future_title': 'Unsere Vision für',
    'future_pt1': 'Auswirkungen anvisieren',
    'future_pt2': 'Gemeinschaft aufbauen',
    'future_target': 'Ziel 2026',
    'future_netzero': 'Netto-Null-Betrieb',
    'footer_title1': 'Jede Partnerschaft',
    'footer_title2': 'ist ein neues Kapitel.',
    'footer_btn': 'Beginnen Sie Ihre Geschichte mit uns →'
  },
  'es': {
    'hero_badge': 'Nuestra Trayectoria',
    'hero_title1': 'La Historia',
    'hero_title2': 'Detrás de Kraken',
    'hero_desc': 'Cómo un simple compromiso con la precisión se convirtió en un nuevo estándar para la gestión de instalaciones en Suiza.',
    'btn_timeline': 'EXPLORAR CRONOLOGÍA',
    'btn_kai': 'LA LEYENDA DE KAI',
    'origin_title': 'Nuestra Historia',
    'origin_desc': 'El Facility Management suele pasar desapercibido, hasta que algo falla. Kraken nace para cambiar eso: para traer claridad, nuevos estándares nunca antes vistos y un trato cálido y humano a un sector que demasiadas veces se da por sentado. Detrás hay 11 años de experiencia internacional, vividos peldaño a peldaño.',
    'timeline_p1_year': '2015 • Londres',
    'timeline_p1_title': 'Los cimientos, sobre el terreno',
    'timeline_p1_desc': 'Todo empezó desde la base absoluta del sector. Antonio Nadre Gomes Mendes comenzó como limpiador en Londres, y fue ahí, con las manos en el trabajo, donde aprendió la lección que hoy define a Kraken: la calidad no se delega, se vive.',
    'timeline_p2_year': 'Londres',
    'timeline_p2_title': 'De la operación a la gestión',
    'timeline_p2_desc': 'Pasó a ser Building Manager de un edificio emblemático de unas 200 viviendas en Aldersgate, Londres. Coordinar equipos, proveedores y residentes le enseñó a sostener el estándar día tras día, sin dejar nada al azar.',
    'timeline_p3_year': 'Manchester',
    'timeline_p3_title': 'De la gestión a la estrategia',
    'timeline_p3_desc': 'Llegó a Head of Sales de una start-up en el norte del Reino Unido, en Manchester. Una trayectoria poco común que le dio una visión 360°: entiende tanto al equipo que limpia como al cliente que confía.',
    'timeline_p4_year': 'Suiza',
    'timeline_p4_title': 'Aprender el estándar suizo',
    'timeline_p4_desc': 'Durante un año trabajó en Suiza con empresas de reconocimiento nacional, descubriendo por dentro cómo funciona realmente el Facility Management suizo, y cuánto margen había para más ética, más estándares y más innovación.',
    'timeline_p5_year': 'Enero 2026',
    'timeline_p5_title': 'Nace Kraken',
    'timeline_p5_desc': 'Con 11 años de experiencia internacional, fundamos Kraken en la Suiza alemana. El porqué es simple: ofrecer un estándar de servicio y una ética de trabajo nunca vistos en el sector, apoyados en la tecnología y en el uso decidido de productos sostenibles.',
    'timeline_p6_year': 'Adelante',
    'timeline_p6_title': 'Nuestra visión: toda Suiza',
    'timeline_p6_desc': 'Empezamos en la Suiza alemana, pero es solo el principio. Nuestro objetivo es crecer por todo el país con la misma promesa para cada cliente: precisión suiza, innovación real, compromiso sostenible y, siempre, un trato cercano y humano.',
    'aspirations_badge': 'NUESTRAS ASPIRACIONES',
    'aspirations_title1': 'El estándar',
    'aspirations_title2': 'que nos esforzamos por definir.',
    'asp_point1_title': 'Calidad Suiza',
    'asp_point1_desc': 'Nuestra búsqueda incesante. Cada detalle es una oportunidad para demostrar nuestra dedicación.',
    'asp_point2_title': 'Confiabilidad Absoluta',
    'asp_point2_desc': 'Construyendo sistemas para funcionar sin problemas, para que nunca tenga que notarnos.',
    'asp_point3_title': 'Transparencia Radical',
    'asp_point3_desc': 'El objetivo de la total rendición de cuentas, desde los datos hasta el impacto ambiental.',
    'quote_text': '"No fundamos Kraken para ser los más grandes, sino para ser los más confiables. Cada edificio tiene una historia y estamos aquí para protegerla."',
    'quote_author': '— El Fundador',
    'future_badge': 'COMPROMISOS FUTUROS',
    'future_title': 'Nuestra visión para',
    'future_pt1': 'Apuntando al Impacto',
    'future_pt2': 'Construyendo Comunidad',
    'future_target': 'Objetivo 2026',
    'future_netzero': 'Operaciones Cero Neto',
    'footer_title1': 'Cada asociación',
    'footer_title2': 'es un nuevo capítulo.',
    'footer_btn': 'Comienza tu historia con nosotros →'
  },
  'fr': {
    'hero_badge': 'Notre Parcours',
    'hero_title1': 'L\'Histoire',
    'hero_title2': 'Derrière Kraken',
    'hero_desc': 'Comment un simple engagement envers la précision est devenu une nouvelle norme pour la gestion des bâtiments en Suisse.',
    'btn_timeline': 'EXPLORER LA CHRONOLOGIE',
    'btn_kai': 'LA LÉGENDE DE KAI',
    'origin_title': 'Notre Histoire',
    'origin_desc': 'D’un seau à franges à Londres à la redéfinition du Facility Management en Suisse.',
    'timeline_p1_year': '2015',
    'timeline_p1_title': 'Les Fondations à Londres',
    'timeline_p1_desc': 'Tout grand empire commence par un premier pas humble. Antonio Nadre Gomes Mendes a débuté sa carrière à la base absolue du secteur : comme nettoyeur à Londres. C’est là, sur le terrain, qu’il a appris que la qualité ne se délègue pas, elle se vit.',
    'timeline_p2_year': 'Londres',
    'timeline_p2_title': 'De l\'Opérationnel à la Stratégie',
    'timeline_p2_desc': 'Au cours d\'une décennie, il a gravi tous les échelons du métier, devenant Head of Sales d\'une start-up dans le nord de Londres. Un parcours peu commun qui lui a donné une vision à 360° : il comprend aussi bien l\'équipe qui nettoie que le client qui fait confiance.',
    'timeline_p3_year': 'Suisse',
    'timeline_p3_title': 'L\'Expérience qui Fait la Différence',
    'timeline_p3_desc': 'Son arrivée en Suisse, travaillant à Zurich et Schaffhouse pour des entreprises reconnues du pays, lui a révélé un secteur plein d\'opportunités d\'amélioration : plus d\'éthique, plus de standards et plus d\'innovation que ce que le marché proposait jusqu\'alors.',
    'timeline_p4_year': 'Janvier 2026',
    'timeline_p4_title': 'Naissance de Kraken',
    'timeline_p4_desc': 'Forts de 11 ans d\'expérience internationale, nous avons fondé Kraken en Suisse alémanique. Notre mission : offrir un standard de service et une éthique de travail jamais vus dans le secteur, appuyés par la technologie et l\'utilisation résolue de produits durables.',
    'timeline_p5_year': 'En avant',
    'timeline_p5_title': 'Notre Vision : Toute la Suisse',
    'timeline_p5_desc': 'Nous commençons par la Suisse alémanique, mais ce n\'est qu\'un début. Notre objectif est de nous étendre à tout le pays, en élargissant notre offre de services et en apportant la même promesse à chaque nouveau client : précision suisse, innovation réelle et engagement durable.',
    'aspirations_badge': 'NOS ASPIRATIONS',
    'aspirations_title1': 'La norme',
    'aspirations_title2': 'que nous nous efforçons d\'illustrer.',
    'asp_point1_title': 'Qualité Suisse',
    'asp_point1_desc': 'Notre recherche implacable. Chaque détail est l\'opportunité de prouver notre engagement.',
    'asp_point2_title': 'Fiabilité Absolue',
    'asp_point2_desc': 'Bâtir des installations fluides et automatiques afin de rester agréablement invisibles.',
    'asp_point3_title': 'Transparence Radicale',
    'asp_point3_desc': 'Responsabilité complète, depuis les données de terrain jusqu\'à l\'impact sur le climat.',
    'quote_text': '"Kraken n\'a pas été créé pour être la plus grande entreprise, mais la plus digne de confiance. Chaque édifice a une histoire, et nous la gardons."',
    'quote_author': '— Le Fondateur',
    'future_badge': 'ENGAGEMENTS FUTURS',
    'future_title': 'Notre vision de',
    'future_pt1': 'Viser l\'impact',
    'future_pt2': 'Créer une communauté',
    'future_target': 'Cible 2026',
    'future_netzero': 'Émissions Nettes Zéro',
    'footer_title1': 'Chaque collaboration',
    'footer_title2': 'écrit une nouvelle page.',
    'footer_btn': 'Commencez l\'aventure avec nous →'
  },
  'it': {
    'hero_badge': 'Il Nostro Cammino',
    'hero_title1': 'La Storia',
    'hero_title2': 'Dietro Kraken',
    'hero_desc': 'Come un piccolo, fermo impegno alla precisione è divenuto il nuovo standard svizzero per il facility management.',
    'btn_timeline': 'SCOPRI LA CRONOLOGIA',
    'btn_kai': 'LA LEGGENDA DI KAI',
    'origin_title': 'La Nostra Storia',
    'origin_desc': 'Da un secchio per lavare a Londra alla ridefinizione del Facility Management in Svizzera.',
    'timeline_p1_year': '2015',
    'timeline_p1_title': 'Le Fondamenta a Londra',
    'timeline_p1_desc': 'Ogni grande impero inizia con un primo passo umile. Antonio Nadre Gomes Mendes ha iniziato la sua carriera partendo dalla base assoluta del settore: come addetto alle pulizie a Londra. È stato lì, sul campo, che ha imparato che la qualità non si delega, si vive.',
    'timeline_p2_year': 'Londra',
    'timeline_p2_title': 'Dall\'Operazione alla Strategia',
    'timeline_p2_desc': 'Nel corso di un decennio ha scalato ogni gradino del mestiere, fino a diventare Head of Sales di una start-up nel nord di Londra. Un percorso insolito che gli ha conferito una visione a 360°: comprende sia la squadra operativa che il cliente che si affida.',
    'timeline_p3_year': 'Svizzera',
    'timeline_p3_title': 'L\'Esperienza che Fa la Differenza',
    'timeline_p3_desc': 'Il suo arrivo in Svizzera, lavorando a Zurigo e Sciaffusa per rinomate aziende del paese, gli ha rivelato un settore ricco di opportunità di miglioramento: più etica, più standard e maggiore innovazione rispetto a quanto offerto finora dal mercato.',
    'timeline_p4_year': 'Gennaio 2026',
    'timeline_p4_title': 'Nasce Kraken',
    'timeline_p4_desc': 'Con 11 anni di esperienza internazionale, abbiamo fondato Kraken nella Svizzera tedesca. La missione: offrire uno standard di servizio e un\'etica del lavoro mai visti prima nel settore, supportati dalla tecnologia e dall\'uso convinto di prodotti sostenibili.',
    'timeline_p5_year': 'In futuro',
    'timeline_p5_title': 'La Nostra Visione: Tutta la Svizzera',
    'timeline_p5_desc': 'Iniziamo nella Svizzera tedesca, ma è solo l\'inizio. Il nostro obiettivo è espanderci in tutto il paese, ampliando la nostra gamma di servizi e portando la stessa promessa a ogni nuovo cliente: precisione svizzera, vera innovazione e impegno sostenibile.',
    'aspirations_badge': 'LE NOSTRE ASPIRAZIONI',
    'aspirations_title1': 'Lo standard',
    'aspirations_title2': 'che puntiamo a consolidare.',
    'asp_point1_title': 'Qualità Svizzera',
    'asp_point1_desc': 'Perfezionamento continuo. Ogni elemento tecnico è un test per dimostrare cura estrema.',
    'asp_point2_title': 'Regolarità Assoluta',
    'asp_point2_desc': 'Progettare flussi lineari in modo da sollevarvi da qualunque pensiero o interruzione.',
    'asp_point3_title': 'Chiarezza Radicale',
    'asp_point3_desc': 'Trasparenza insuperabile, dal monitoraggio energetico ai dati finanziari.',
    'quote_text': '"Non abbiamo creato Kraken per essere i giganti del mercato, ma i più stimabili. Ogni singola struttura ha la sua anima e noi intendiamo curarla."',
    'quote_author': '— Il Fondatore',
    'future_badge': 'PIANI SULL\'AVVENIRE',
    'future_title': 'La nostra idea di',
    'future_pt1': 'Responsabilità Sociale',
    'future_pt2': 'Sviluppo di Comunità',
    'future_target': 'Target 2026',
    'future_netzero': 'Impatto Energetico Zero',
    'footer_title1': 'Ciascun accordo',
    'footer_title2': 'apre un grande capitolo.',
    'footer_btn': 'Raccontaci la tua sfida →'
  },
  'pt': {
    'hero_badge': 'A Nossa Jornada',
    'hero_title1': 'A História',
    'hero_title2': 'Por Trás da Kraken',
    'hero_desc': 'Como um simples compromisso com a precisão se tornou um novo padrão para a gestão de instalações na Suíça.',
    'btn_timeline': 'EXPLORAR CRONOLOGIA',
    'btn_kai': 'A LENDA DE KAI',
    'origin_title': 'Nossa História',
    'origin_desc': 'De um balde de esfregona em Londres a redefinir o Facility Management na Suíça.',
    'timeline_p1_year': '2015',
    'timeline_p1_title': 'Os Alicerces em Londres',
    'timeline_p1_desc': 'Todo grande império começa com um primeiro passo humilde. Antonio Nadre Gomes Mendes iniciou a sua carreira a partir da base absoluta do setor: como limpador em Londres. Foi aí, no terreno, onde aprendeu que a qualidade não se delega, vive-se.',
    'timeline_p2_year': 'Londres',
    'timeline_p2_title': 'Da Operação à Estratégia',
    'timeline_p2_desc': 'Ao longo de uma década, escalou cada degrau do ofício, até se tornar Head of Sales de uma start-up no norte de Londres. Uma trajetória pouco comum que lhe deu uma visão 360°: entende tanto a equipa que limpa quanto o cliente que confia.',
    'timeline_p3_year': 'Suíça',
    'timeline_p3_title': 'Experiência que Marca a Diferença',
    'timeline_p3_desc': 'A sua chegada à Suíça, trabalhando em Zurique e Schaffhausen para empresas reconhecidas do país, revelou-lhe um setor cheio de oportunidades de melhoria: mais ética, mais padrões e mais inovação do que o mercado oferecia até então.',
    'timeline_p4_year': 'Janeiro 2026',
    'timeline_p4_title': 'Nasce a Kraken',
    'timeline_p4_desc': 'Com 11 anos de experiência internacional, fundámos a Kraken na Suíça alemã. A nossa missão: oferecer um padrão de serviço e uma ética de trabalho nunca antes vistos no setor, apoiados na tecnologia e no uso decidido de produtos sustentáveis.',
    'timeline_p5_year': 'Em diante',
    'timeline_p5_title': 'A Nossa Visão: Toda a Suíça',
    'timeline_p5_desc': 'Começamos na Suíça alemã, mas é apenas o início. O nosso objetivo é expandirmo-nos por todo o país, ampliando a nossa gama de serviços e levando a mesma promessa a cada novo cliente: precisão suíça, inovação real e compromisso sustentável.',
    'aspirations_badge': 'AS NOSSAS ASPIRAÇÕES',
    'aspirations_title1': 'O padrão',
    'aspirations_title2': 'que desejamos imprimir.',
    'asp_point1_title': 'Qualidade Suíça',
    'asp_point1_desc': 'Investimento permanente na qualidade. Cada pormenor expressa o nosso compromisso sério.',
    'asp_point2_title': 'Fiabilidade Prática',
    'asp_point2_desc': 'Estruturar processos para correrem silenciosamente para que nem sequer precise de pensar em nós.',
    'asp_point3_title': 'Inquestionável Transparência',
    'asp_point3_desc': 'Compromisso pleno na prestação de contas, de dados analíticos até políticas carbónicas.',
    'quote_text': '"Não fundámos a Kraken com o propósito de sermos a maior marca, mas a mais respeitada. Cada edifício esconde valor e nós defendemo-lo."',
    'quote_author': '— O Fundador',
    'future_badge': 'METAS CORPORATIVAS',
    'future_title': 'O nosso ideal para',
    'future_pt1': 'Controlo de Danos',
    'future_pt2': 'Estímulo de Comunidade',
    'future_target': 'Meta 2026',
    'future_netzero': 'Carbono Neutro Operativo',
    'footer_title1': 'Cada parceria',
    'footer_title2': 'constitui uma nova página.',
    'footer_btn': 'Escreva o seu caso de sucesso connosco →'
  }
};

const OurStoryPage: React.FC<OurStoryPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();

  const getS = (key: string): string => {
    const lang = (language === 'de-CH') ? 'de' : language;
    const dict = STORY_T[lang] || STORY_T['en'];
    return dict[key] || STORY_T['en'][key] || key;
  };

  const timeline = language === 'es' ? [
    {
      year: getS('timeline_p1_year'),
      title: getS('timeline_p1_title'),
      desc: getS('timeline_p1_desc'),
      icon: <Building2 className="w-6 h-6" />,
      img: '/sobre-nosotros-retrato-equipo-uniforme.png'
    },
    {
      year: getS('timeline_p2_year'),
      title: getS('timeline_p2_title'),
      desc: getS('timeline_p2_desc'),
      icon: <Globe className="w-6 h-6" />,
      img: '/sobre-nosotros-equipo-viaje-con-maletas.png'
    },
    {
      year: getS('timeline_p3_year'),
      title: getS('timeline_p3_title'),
      desc: getS('timeline_p3_desc'),
      icon: <Users className="w-6 h-6" />,
      img: '/sobre-nosotros-bienvenida-familia-equipo.png'
    },
    {
      year: getS('timeline_p4_year'),
      title: getS('timeline_p4_title'),
      desc: getS('timeline_p4_desc'),
      icon: <Sparkles className="w-6 h-6" />,
      img: '/sobre-nosotros-reunion-equipo-kraken.png'
    },
    {
      year: getS('timeline_p5_year'),
      title: getS('timeline_p5_title'),
      desc: getS('timeline_p5_desc'),
      icon: <Target className="w-6 h-6" />,
      img: '/sobre-nosotros-reunion-consultoria-propiedad.png'
    },
    {
      year: getS('timeline_p6_year'),
      title: getS('timeline_p6_title'),
      desc: getS('timeline_p6_desc'),
      icon: <MapPin className="w-6 h-6" />,
      img: '/sobre-nosotros-equipo-con-cliente-en-zurich.png'
    }
  ] : [
    {
      year: getS('timeline_p1_year'),
      title: getS('timeline_p1_title'),
      desc: getS('timeline_p1_desc'),
      icon: <Building2 className="w-6 h-6" />,
      img: '/sobre-nosotros-retrato-equipo-uniforme.png'
    },
    {
      year: getS('timeline_p2_year'),
      title: getS('timeline_p2_title'),
      desc: getS('timeline_p2_desc'),
      icon: <Globe className="w-6 h-6" />,
      img: '/sobre-nosotros-equipo-viaje-con-maletas.png'
    },
    {
      year: getS('timeline_p3_year'),
      title: getS('timeline_p3_title'),
      desc: getS('timeline_p3_desc'),
      icon: <Users className="w-6 h-6" />,
      img: '/sobre-nosotros-bienvenida-familia-equipo.png'
    },
    {
      year: getS('timeline_p4_year'),
      title: getS('timeline_p4_title'),
      desc: getS('timeline_p4_desc'),
      icon: <Sparkles className="w-6 h-6" />,
      img: '/sobre-nosotros-reunion-equipo-kraken.png'
    },
    {
      year: getS('timeline_p5_year'),
      title: getS('timeline_p5_title'),
      desc: getS('timeline_p5_desc'),
      icon: <Target className="w-6 h-6" />,
      img: '/sobre-nosotros-reunion-consultoria-propiedad.png'
    }
  ];

  return (
    <main className="bg-white min-h-screen selection:bg-blue-500/30 text-[#001A3D]">
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:h-[80vh] flex items-center overflow-hidden bg-[#001A3D] py-20 md:py-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="/nuestra-historia-hero.png" 
            alt="Kraken Story" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001A3D] via-[#001A3D]/70 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <History className="w-4 h-4" />
              {getS('hero_badge')}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-[84px] font-black leading-[0.9] tracking-tighter text-white mb-6 uppercase"
            >
              {getS('hero_title1')} <br />
              <span className="text-blue-500">{getS('hero_title2')}</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/70 font-medium leading-relaxed mb-10 max-w-xl"
            >
              {getS('hero_desc')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40"
              >
                {getS('btn_timeline')}
              </button>
              <button 
                onClick={() => onNavigate('comic-page')}
                className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                {getS('btn_kai')}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Origins */}
      <section id="timeline" className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-20 text-center mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-[#001A3D]">{getS('origin_title')}</h2>
            <p className="text-gray-500 font-medium">{getS('origin_desc')}</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-100 hidden lg:block" />

            <div className="space-y-24">
              {timeline.map((item, idx) => (
                <div key={idx} className={`flex flex-col lg:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Content */}
                  <motion.div 
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1 lg:text-left"
                  >
                    <div className={`p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 relative ${idx % 2 !== 0 ? 'lg:text-right' : ''}`}>
                      <div className={`text-4xl font-black text-blue-600 mb-2 ${idx % 2 !== 0 ? 'lg:justify-end' : ''} flex items-center gap-4`}>
                        {idx % 2 !== 0 && item.icon}
                        {item.year}
                        {idx % 2 === 0 && item.icon}
                      </div>
                      <h3 className="text-2xl font-black text-[#001A3D] mb-4 uppercase">{item.title}</h3>
                      <p className="text-gray-500 font-medium leading-relaxed italic">{item.desc}</p>
                    </div>
                  </motion.div>

                  {/* Spacer/Dot */}
                  <div className="hidden lg:flex w-12 h-12 bg-white rounded-full border-4 border-blue-600 z-10 shrink-0 items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  </div>

                  {/* Spacer for alternating layout instead of Image */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values & Philosophy */}
      <section className="py-24 bg-[#001A3D] text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] mb-6">{getS('aspirations_badge')}</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">
                {getS('aspirations_title1')} <br />
                <span className="text-blue-400">{getS('aspirations_title2')}</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: getS('asp_point1_title'), text: getS('asp_point1_desc') },
                  { title: getS('asp_point2_title'), text: getS('asp_point2_desc') },
                  { title: getS('asp_point3_title'), text: getS('asp_point3_desc') }
                ].map((point, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black">{point.title}</h4>
                      <p className="text-white/50 text-sm">{point.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-tr from-blue-600/20 to-[#001A3D] rounded-[4rem] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                <Quote className="absolute top-12 left-12 w-20 h-20 text-white/5" />
                <div className="max-w-md text-center px-12 z-10">
                  <p className="text-2xl md:text-3xl font-black italic mb-8 leading-tight">
                    {getS('quote_text')}
                  </p>
                  <p className="text-blue-400 font-black text-sm uppercase tracking-widest">{getS('quote_author')}</p>
                </div>
                
                {/* Decorative Kai Image Floating */}
                <motion.img 
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  src={mascotImageUrl}
                  className="absolute -bottom-10 -right-10 w-48 opacity-30 pointer-events-none grayscale"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Future Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-[#F1F5F9] rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-1">
                <div className="lg:-rotate-90 whitespace-nowrap text-[10px] font-black text-blue-400 uppercase tracking-[1em] opacity-50 mb-8 lg:mb-0">
                  {getS('future_badge')}
                </div>
              </div>
              <div className="lg:col-span-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-[#001A3D]">{getS('future_title')} <span className="text-emerald-600 uppercase">B-Corp</span></h2>
                <p className="text-xl text-[#001A3D] font-bold leading-relaxed mb-8 border-l-4 border-blue-600 pl-8 bg-white/40 py-4 rounded-r-3xl">
                  {useTranslation().t('sustainability.results.desc')}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-xs font-bold text-gray-500 uppercase">{getS('future_pt1')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-xs font-bold text-gray-500 uppercase">{getS('future_pt2')}</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200" 
                    alt="Sustainable Future" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{getS('future_target')}</p>
                    <p className="text-sm font-black text-[#001A3D]">{getS('future_netzero')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-[#001A3D] tracking-tighter mb-8 uppercase leading-none">
                {getS('footer_title1')} <br />
                <span className="text-blue-600">{getS('footer_title2')}</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => onNavigate('consultation')}
                  className="bg-[#001A3D] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-900/20"
                >
                    {getS('footer_btn')}
                </button>
            </div>
        </div>
      </section>

    </main>
  );
};

export default OurStoryPage;
