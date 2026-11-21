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
    'btn_timeline': "Explore the timeline",
    'btn_kai': "The legend of Kai",
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
    'aspirations_badge': "Our aspirations",
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
    'btn_timeline': "Zeitachse erkunden",
    'btn_kai': "Die Legende von Kai",
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
    'aspirations_badge': "Unsere Ziele",
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
    'btn_timeline': "Explorar la historia",
    'btn_kai': "La leyenda de Kai",
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
    'aspirations_badge': "Nuestras aspiraciones",
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
    'btn_timeline': "Découvrir la chronologie",
    'btn_kai': "La légende de Kai",
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
    'aspirations_badge': "Nos aspirations",
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
    'btn_timeline': "Esplora la storia",
    'btn_kai': "La leggenda di Kai",
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
    'aspirations_badge': "Le nostre aspirazioni",
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
    'btn_timeline': "Explorar a história",
    'btn_kai': "A lenda de Kai",
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
    'aspirations_badge': "As nossas aspirações",
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
      img: '/sobre-nosotros-equipo-con-cliente-en-zurich.webp'
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
    <main className="kraken-page kraken-editorial bg-white text-[#032b59]">
      <header className="kraken-page-intro kraken-container grid gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div><p className="kraken-eyebrow">Kraken PFM</p><h1 className="kraken-heading mt-3">{getS('hero_title1')} {getS('hero_title2')}</h1><p className="kraken-description">{getS('hero_desc')}</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })} className="kraken-button kraken-primary">{getS('btn_timeline')}</button><button onClick={() => onNavigate('comic-page')} className="kraken-button kraken-secondary">{getS('btn_kai')}</button></div></div>
        <img src={aboutHeroImageUrl} alt="Kai — Kraken PFM" className="aspect-[4/3] w-full rounded-2xl border border-[#dce5f0] object-cover" />
      </header>
      <section id="timeline" className="scroll-mt-28 border-y border-[#dce5f0] bg-[#f3f7fc] py-12 sm:py-20">
        <div className="kraken-container max-w-6xl"><div className="max-w-2xl"><h2 className="kraken-heading">{getS('origin_title')}</h2><p className="kraken-description">{getS('origin_desc')}</p></div>
          <ol className="mt-10 space-y-8">{timeline.map((item,index) => <li key={index} className="grid overflow-hidden rounded-2xl border border-[#dce5f0] bg-white md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"><img src={item.img} alt="" loading="lazy" className="aspect-[4/3] h-full w-full object-cover" /><div className="p-7 sm:p-10"><p className="kraken-eyebrow">{item.year}</p><h3 className="mt-3 text-2xl font-semibold tracking-tight">{item.title}</h3><p className="mt-4 text-base leading-relaxed text-[#50647c]">{item.desc}</p></div></li>)}</ol>
        </div>
      </section>
      <section className="kraken-container py-12 sm:py-20"><div className="max-w-2xl"><p className="kraken-eyebrow">{getS('aspirations_badge')}</p><h2 className="kraken-heading mt-3">{getS('aspirations_title1')} {getS('aspirations_title2')}</h2></div><div className="mt-9 grid gap-6 md:grid-cols-3">{[1,2,3].map(index => <article key={index} className="rounded-2xl border border-[#dce5f0] p-7"><h3 className="text-xl font-semibold">{getS(`asp_point${index}_title`)}</h3><p className="mt-3 text-base leading-relaxed text-[#50647c]">{getS(`asp_point${index}_desc`)}</p></article>)}</div></section>
      <section className="border-t border-[#dce5f0] bg-[#f3f7fc] py-12 sm:py-20"><div className="kraken-container flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><h2 className="kraken-heading max-w-2xl">{getS('footer_title1')} {getS('footer_title2')}</h2><button onClick={() => onNavigate('consultation')} className="kraken-button kraken-primary self-start lg:shrink-0">{getS('footer_btn')}</button></div></section>
    </main>
  );
};

export default OurStoryPage;
