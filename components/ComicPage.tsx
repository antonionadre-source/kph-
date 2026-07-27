import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../i18n';
import { 
  kaiComicPhotos, 
  cityImages, 
  mascotImageUrl, 
  companyLogoUrl,
  comicHeroImageUrl,
  comicCovers
} from '../assets';
import { 
  ChevronRightIcon, 
  BookOpenIcon, 
  HeartIcon, 
  UsersIcon, 
  PlayIcon,
  FlagIcon,
  EyeIcon,
  SparklesIcon,
  QuoteIcon,
  LeafIcon,
  BadgeCheckIcon,
  SproutIcon,
  BarChart3Icon,
  ShoppingCart
} from 'lucide-react';

interface ComicPageProps {
  onNavigate: (page: string) => void;
}

const COMIC_T: Record<string, Record<string, string>> = {
  'en': {
    'our_origin': 'OUR ORIGIN',
    'great_start_1': 'Every great',
    'great_start_2': 'partnership',
    'great_start_3': 'starts with a story.',
    'schaff_idea_1': 'In Schaffhausen, a simple idea took shape.',
    'schaff_idea_2': 'Today, it drives everything we do.',
    'btn_explore': 'EXPLORE THE STORY',
    'btn_store': 'VIEW COMIC STORE',
    'quote_rhine': 'From his first breath in the Rhine, Kai has been shaped by flow, precision and balance.',
    'quote_path': 'He understands buildings the way water understands its path — naturally, efficiently, without friction.',
    'quote_control': 'In a world full of noise and complexity, he brings quiet control.',
    'quote_phil': 'That\'s the philosophy behind everything we do.',
    'legend_of_kai': 'THE LEGEND OF KAI',
    'lessons_deep': 'Lessons from the deep. Applied to everything we do.',
    'profits_charity': '25% of profits go to charity',
    'global_impact': 'Creating global impact',
    'exist_badge': 'WHY THE COMICS EXIST',
    'exist_title1': 'Built to be',
    'exist_title_highlight': 'understood.',
    'exist_title2': 'Not just delivered.',
    'card_title1': 'Beyond services',
    'card_desc1': 'Created to express what Kraken stands for beyond services — care, responsibility, and respect for essential work.',
    'card_title2': 'What often goes unseen',
    'card_desc2': 'We highlight a simple truth: cleaning and facility work do far more than support spaces. We shape everyday life within them.',
    'card_title3': 'Built with personal meaning',
    'card_desc3': 'Behind them, there is also a personal intention — to create something the founder\'s son could one day understand as a reflection of values, not just business.',
    'card_title4': 'Invisible value, made visible',
    'card_desc4': 'A way to show that meaningful work matters, that care leaves a mark, and that the people behind it deserve to be seen.',
    'existence_quote': 'Because some stories do more than tell people what a company does.',
    'existence_quote_sub': 'They remind people why it matters.',
    'sticky_text': 'To make visible what usually goes unseen.',
    'blue_title1': 'Environmental care',
    'blue_desc1': 'Teaching that how we care for spaces reflects how we care for the world around us.',
    'blue_title2': 'Respect for unseen work',
    'blue_desc2': 'Giving visibility to the people whose daily effort keeps everything running.',
    'blue_title3': 'A legacy for the next generation',
    'blue_desc3': 'Creating stories that help children see pride, responsibility, and care in meaningful work.',
    'stories_real': 'STORIES WITH REAL WORLD MEANING.',
    'not_just_service': 'NOT JUST SERVICE',
    'stays_with_you': 'STORIES THAT STAYS WITH YOU.',
    'step_label1': 'You discover the story',
    'step_label2': 'You see the unseen',
    'step_label3': 'You understand the impact',
    'ready_bring_order': 'READY TO BRING ORDER TO YOUR SPACE?',
    'partnership_rely': 'Let\'s build a partnership',
    'rely_on': 'you can rely on.',
    'get_quote_mins': 'GET YOUR QUOTE IN MINUTES →',
    'explore_srvs': 'EXPLORE SERVICES →',
    'comics_purpose': 'COMICS WITH PURPOSE',
    'magical_stories': 'Magical stories for a better world!',
    'join_kai': 'Join Kai on amazing adventures! Our comics aren\'t just fun to read—they help kids everywhere. Every book you get helps us do good things for the planet and people in need.',
    'buy_comic': 'You buy a comic',
    'real_st': 'Real stories.',
    'real_peop': 'Real people.',
    'real_imp': 'Real impact.',
    'lc_01_title': 'LEARNING',
    'lc_01_text': 'Understanding systems, not just reacting to them.',
    'lc_02_title': 'CHAOS',
    'lc_02_text': 'While others fear chaos, Kai learns from it.',
    'lc_03_title': 'PRECISION',
    'lc_03_text': 'Swiss-level detail. Nothing left to chance.',
    'lc_04_title': 'COLLABORATION',
    'lc_04_text': 'Growth happens together. Always.',
    'evolution_title': 'THE EVOLUTION OF KAI',
    'evolution_subtitle': 'How our clients help Kraken grow from the first review to a legendary future.',
    'evolution_partnership': 'Every great partnership starts with a story.',
    'evo_step1_title': '1. REVIEWS',
    'evo_step1_desc': 'Positive reviews help baby Kai grow.',
    'evo_step2_title': '2. BOOKINGS',
    'evo_step2_desc': 'Clients book our services.',
    'evo_step3_title': '3. CONTRACTS',
    'evo_step3_desc': 'New contracts build momentum.',
    'evo_step4_title': '4. COMMUNITY',
    'evo_step4_desc': 'The community helps us grow.',
    'evo_step5_title': '5. KRAKEN GROWTH',
    'evo_step5_desc': 'Together, clients help Kraken expand.',
    'evo_step6_title': '6. LEGENDARY KAI',
    'evo_step6_desc': 'Still evolving...',
    'coming_soon': 'COMING SOON',
    'coming_soon_desc': 'THE ADVENTURE CONTINUES IN VOL. II'
  },
  'de': {
    'our_origin': 'UNSERE HERKUNFT',
    'great_start_1': 'Jede grossartige',
    'great_start_2': 'Partnerschaft',
    'great_start_3': 'beginnt mit einer Geschichte.',
    'schaff_idea_1': 'In Schaffhausen nahm eine einfache Idee Gestalt an.',
    'schaff_idea_2': 'Heute treibt sie alles an, was wir tun.',
    'btn_explore': 'GESCHICHTE ERKUNDEN',
    'btn_store': 'COMIC-STORE ANZEIGEN',
    'quote_rhine': 'Seit seinem ersten Atemzug im Rhein wurde Kai von Fluss, Präzision und Ausgewogenheit geprägt.',
    'quote_path': 'Er versteht Gebäude so wie Wasser seinen Weg versteht – natürlich, effizient, reibungsfrei.',
    'quote_control': 'In einer Welt voller Lärm und Komplexität bringt er ruhige Kontrolle.',
    'quote_phil': 'Das ist die Philosophie hinter allem, was wir tun.',
    'legend_of_kai': 'DIE LEGENDE VON KAI',
    'lessons_deep': 'Lektionen aus der Tiefe. Angewandt auf alles, was wir tun.',
    'profits_charity': '25% des Gewinns gehen an wohltätige Zwecke',
    'global_impact': 'Globale Wirkung erzielen',
    'exist_badge': 'WARUM ES DIE COMICS GIBT',
    'exist_title1': 'Gebaut, um',
    'exist_title_highlight': 'verstanden zu werden.',
    'exist_title2': 'Nicht einfach nur geliefert.',
    'card_title1': 'Mehr als Dienstleistungen',
    'card_desc1': 'Geschaffen, um auszudrücken, wofür Kraken über Dienstleistungen hinaus steht – Fürsorge, Verantwortung und Respekt für wesentliche Arbeit.',
    'card_title2': 'Was oft ungesehen bleibt',
    'card_desc2': 'Wir heben eine einfache Wahrheit hervor: Reinigungs- und Gebäudearbeiten leisten weit mehr als nur die Unterstützung von Räumen. Wir prägen den Alltag in ihnen.',
    'card_title3': 'Mit persönlicher Bedeutung gebaut',
    'card_desc3': 'Dahinter steht auch eine persönliche Absicht – etwas zu schaffen, das der Sohn des Gründers eines Tages als Spiegelbild von Werten verstehen kann, nicht nur als Geschäft.',
    'card_title4': 'Unsichtbarer Wert, sichtbar gemacht',
    'card_desc4': 'Ein Weg zu zeigen, dass sinnvolle Arbeit wichtig ist, dass Fürsorge Spuren hinterlässt und dass die Menschen dahinter es verdienen, gesehen zu werden.',
    'existence_quote': 'Weil einige Geschichten mehr tun, als den Menschen nur zu erzählen, was ein Unternehmen tut.',
    'existence_quote_sub': 'Sie erinnern die Menschen daran, warum es wichtig ist.',
    'sticky_text': 'Sichtbar machen, was normalerweise unscheinbar bleibt.',
    'blue_title1': 'Umweltschutz',
    'blue_desc1': 'Die Lehre, dass die Art und Weise, wie wir uns um Räume kümmern, widerspiegelt, wie wir uns um die Welt um uns herum kümmern.',
    'blue_title2': 'Respekt für ungesehene Arbeit',
    'blue_desc2': 'Sichtbarkeit schaffen für die Menschen, deren täglicher Einsatz alles am Laufen hält.',
    'blue_title3': 'Ein Vermächtnis für die nächste Generation',
    'blue_desc3': 'Geschichten schaffen, die Kindern helfen, Stolz, Verantwortung und Sorgfalt bei sinnvoller Arbeit zu sehen.',
    'stories_real': 'GESCHICHTEN MIT REALER BEDEUTUNG.',
    'not_just_service': 'Nicht nur Dienstleistungen,',
    'stays_with_you': 'sondern Geschichten, die in Erinnerung bleiben.',
    'step_label1': 'Sie entdecken die Geschichte',
    'step_label2': 'Sie sehen das Unsichtbare',
    'step_label3': 'Sie verstehen die Wirkung',
    'ready_bring_order': 'BEREIT, ORDNUNG IN IHRE RÄUME ZU BRINGEN?',
    'partnership_rely': 'Lassen Sie uns eine Partnerschaft aufbauen',
    'rely_on': 'auf die Sie sich verlassen können.',
    'get_quote_mins': 'HIER ANGEBOT EINHOLEN →',
    'explore_srvs': 'DIENSTLEISTUNGEN ERKUNDEN →',
    'comics_purpose': 'COMICS MIT SINN',
    'magical_stories': 'Magische Geschichten für eine bessere Welt!',
    'join_kai': 'Begleite Kai auf tollen Abenteuern! Unsere Comics machen nicht nur Spass beim Lesen, sie helfen Kindern überall. Jedes Buch hilft uns, Gutes für den Planeten und bedürftige Menschen zu tun.',
    'buy_comic': 'Sie kaufen ein Comic',
    'real_st': 'Echte Geschichten.',
    'real_peop': 'Echte Menschen.',
    'real_imp': 'Echte Wirkung.',
    'lc_01_title': 'LERNEN',
    'lc_01_text': 'Systeme verstehen, nicht nur auf sie reagieren.',
    'lc_02_title': 'CHAOS',
    'lc_02_text': 'Während andere das Chaos fürchten, lernt Kai daraus.',
    'lc_03_title': 'PRÄZISION',
    'lc_03_text': 'Schweizer Sorgfalt. Nichts wird dem Zufall überlassen.',
    'lc_04_title': 'KOOPERATION',
    'lc_04_text': 'Wachstum geschieht gemeinsam. Immer.',
    'evolution_title': 'DIE EVOLUTION VON KAI',
    'evolution_subtitle': 'Wie unsere Kunden Kraken helfen, von der ersten Bewertung bis zu einer legendären Zukunft zu wachsen.',
    'evolution_partnership': 'Jede grossartige Partnerschaft beginnt mit einer Geschichte.',
    'evo_step1_title': '1. BEWERTUNGEN',
    'evo_step1_desc': 'Positive Bewertungen helfen dem Baby-Kai zu wachsen.',
    'evo_step2_title': '2. BUCHUNGEN',
    'evo_step2_desc': 'Kunden buchen unsere Dienstleistungen.',
    'evo_step3_title': '3. VERTRÄGE',
    'evo_step3_desc': 'Neue Verträge sorgen für Dynamik.',
    'evo_step4_title': '4. GEMEINSCHAFT',
    'evo_step4_desc': 'Die Gemeinschaft hilft uns zu wachsen.',
    'evo_step5_title': '5. KRAKEN WACHSTUM',
    'evo_step5_desc': 'Gemeinsam helfen Kunden Kraken zu expandieren.',
    'evo_step6_title': '6. LEGENDÄRER KAI',
    'evo_step6_desc': 'Entwickelt sich weiter...',
    'coming_soon': 'DEMNÄCHST',
    'coming_soon_desc': 'DAS ABENTEUER GEHT IN BAND II WEITER'
  },
  'es': {
    'our_origin': 'NUESTRO ORIGEN',
    'great_start_1': 'Cada gran',
    'great_start_2': 'colaboración',
    'great_start_3': 'comienza con una historia.',
    'schaff_idea_1': 'En Schaffhausen, una idea simple tomó forma.',
    'schaff_idea_2': 'Hoy en día, impulsa todo lo que hacemos.',
    'btn_explore': 'EXPLORAR HISTORIA',
    'btn_store': 'VER TIENDA DE CÓMICS',
    'quote_rhine': 'Desde su primer aliento en el Rin, Kai ha sido moldeado por el flujo, la precisión y el equilibrio.',
    'quote_path': 'Él entiende los edificios como el agua entiende su camino: de forma natural, eficiente y sin fricción.',
    'quote_control': 'En un mundo lleno de ruido y complejidad, él aporta un control silencioso.',
    'quote_phil': 'Esa es la filosofía detrás de todo lo que hacemos.',
    'legend_of_kai': 'LA LEYENDA DE KAI',
    'lessons_deep': 'Lecciones de las profundidades. Aplicado a todo lo que hacemos.',
    'profits_charity': '25% de los beneficios van a caridad',
    'global_impact': 'Creado impacto global',
    'exist_badge': 'POR QUÉ EXISTEN LOS CÓMICS',
    'exist_title1': 'Construido para ser',
    'exist_title_highlight': 'entendido.',
    'exist_title2': 'No solo entregado.',
    'card_title1': 'Más allá de los servicios',
    'card_desc1': 'Creado para expresar lo que Kraken representa más allá de los servicios: cuidado, responsabilidad y respeto por el trabajo esencial.',
    'card_title2': 'Lo que a menudo no se ve',
    'card_desc2': 'Destacamos una verdad simple: el trabajo de limpieza e instalaciones hace mucho más que sostener espacios. Damos forma a la vida cotidiana dentro de ellos.',
    'card_title3': 'Construido con un significado personal',
    'card_desc3': 'Detrás de ellos, también hay una intención personal: crear algo que el hijo del fundador pueda entender algún día como un reflejo de valores, no solo como un negocio.',
    'card_title4': 'Valor invisible, hecho visible',
    'card_desc4': 'Una manera de demostrar que el trabajo significativo importa, que el cuidado deja una huella y que las personas que están detrás merecen ser vistas.',
    'existence_quote': 'Porque algunas historias hacen más que contarle a la gente lo que hace una empresa.',
    'existence_quote_sub': 'Le recuerdan a la gente por qué es importante.',
    'sticky_text': 'Hacer visible lo que usualmente no se ve.',
    'blue_title1': 'Cuidado ambiental',
    'blue_desc1': 'Enseñar que la forma en que cuidamos los espacios refleja cómo cuidamos el mundo que nos rodea.',
    'blue_title2': 'Respeto al trabajo invisible',
    'blue_desc2': 'Dar visibilidad a las personas cuyo esfuerzo diario mantiene todo en funcionamiento.',
    'blue_title3': 'Un legado para la próxima generación',
    'blue_desc3': 'Crear historias que ayuden a los niños a ver orgullo, responsabilidad y cuidado en el trabajo significativo.',
    'stories_real': 'HISTORIAS CON UN SIGNIFICADO REAL.',
    'not_just_service': 'No solo servicios,',
    'stays_with_you': 'sino historias que se quedan contigo.',
    'step_label1': 'Descubres la historia',
    'step_label2': 'Ves lo invisible',
    'step_label3': 'Entiendes el impacto',
    'ready_bring_order': '¿LISTO PARA LLEVAR EL ORDEN A TU ESPACIO?',
    'partnership_rely': 'Construyamos una relación',
    'rely_on': 'en la que puedas confiar.',
    'get_quote_mins': 'PRESUPUESTO EN MINUTOS →',
    'explore_srvs': 'EXPLORAR SERVICIOS →',
    'comics_purpose': 'CÓMICS CON PROPÓSITO',
    'magical_stories': '¡Historias mágicas para un mundo mejor!',
    'join_kai': '¡Únete a Kai en aventuras increíbles! Nuestros cómics no solo son divertidos de leer, sino que ayudan a niños en todas partes. Cada libro que adquieres nos ayuda a hacer el bien por el planeta y por las personas necesitadas.',
    'buy_comic': 'Compras un cómic',
    'real_st': 'Historias reales.',
    'real_peop': 'Gente real.',
    'real_imp': 'Impacto real.',
    'lc_01_title': 'APRENDIZAJE',
    'lc_01_text': 'Comprender los sistemas, no solo reaccionar a ellos.',
    'lc_02_title': 'CAOS',
    'lc_02_text': 'Mientras otros temen al caos, Kai aprende de él.',
    'lc_03_title': 'PRECISIÓN',
    'lc_03_text': 'Detalle a nivel suizo. Nada se deja al azar.',
    'lc_04_title': 'COLABORACIÓN',
    'lc_04_text': 'El crecimiento ocurre juntos. Siempre.',
    'evolution_title': 'LA EVOLUCIÓN DE KAI',
    'evolution_subtitle': 'Cómo nuestros clientes ayudan a Kraken a crecer desde la primera reseña hacia un futuro legendario.',
    'evolution_partnership': 'Cada gran colaboración comienza con una historia.',
    'evo_step1_title': '1. RESEÑAS',
    'evo_step1_desc': 'Las reseñas positivas ayudan a crecer al pequeño Kai.',
    'evo_step2_title': '2. RESERVAS',
    'evo_step2_desc': 'Los clientes reservan nuestros servicios.',
    'evo_step3_title': '3. CONTRATOS',
    'evo_step3_desc': 'Nuevos contratos generan impulso.',
    'evo_step4_title': '4. COMUNIDAD',
    'evo_step4_desc': 'La comunidad nos ayuda a crecer.',
    'evo_step5_title': '5. CRECIMIENTO DE KRAKEN',
    'evo_step5_desc': 'Juntos, los clientes ayudan a Kraken a expandirse.',
    'evo_step6_title': '6. KAI LEGENDARIO',
    'evo_step6_desc': 'Sigue evolucionando...',
    'coming_soon': 'PRÓXIMAMENTE',
    'coming_soon_desc': 'LA AVENTURA CONTINÚA EN EL VOL. II'
  },
  'fr': {
    'our_origin': 'NOTRE ORIGINE',
    'great_start_1': 'Chaque grand',
    'great_start_2': 'partenariat',
    'great_start_3': 'commence par une histoire.',
    'schaff_idea_1': 'À Schaffhouse, une idée simple a pris forme.',
    'schaff_idea_2': 'Aujourd\'hui, elle guide tout ce que nous faisons.',
    'btn_explore': 'EXPLORER L\'HISTOIRE',
    'btn_store': 'ACCÉDER À LA BOUTIQUE',
    'quote_rhine': 'Dès son premier souffle dans le Rhin, Kai a été façonné par le mouvement, la précision et l\'équilibre.',
    'quote_path': 'Il comprend les bâtiments comme l\'eau comprend son cours — naturellement, efficacement, sans friction.',
    'quote_control': 'Dans un monde plein de bruit et de complexité, il apporte un contrôle serein.',
    'quote_phil': 'C\'est la philosophie derrière tout ce que nous faisons.',
    'legend_of_kai': 'LA LÉGENDE DE KAI',
    'lessons_deep': 'Leçons des profondeurs. Appliquées à tout ce que nous faisons.',
    'profits_charity': '25% des bénéfices vont à des œuvres',
    'global_impact': 'Création d\'un impact global',
    'exist_badge': 'POURQUOI LES BANDES DESSINÉES EXISTENT',
    'exist_title1': 'Écrites pour être',
    'exist_title_highlight': 'comprises.',
    'exist_title2': 'Pas simplement fournies.',
    'card_title1': 'Au-delà des services',
    'card_desc1': 'Créé pour exprimer ce que Kraken représente au-delà des services : soin, responsabilité et respect pour le travail essentiel.',
    'card_title2': 'Ce qui passe inaperçu',
    'card_desc2': 'Nous mettons en lumière une vérité toute simple : le nettoyage et l\'entretien font bien plus que soutenir les espaces. Nous façonnons le quotidien de ceux qui y vivent.',
    'card_title3': 'Construit avec un sens personnel',
    'card_desc3': 'Derrière elles, il y a aussi une intention personnelle — créer quelque chose que le fils du fondateur puisse un jour comprendre comme le reflet de valeurs, pas seulement de commerce.',
    'card_title4': 'Valeur invisible, rendue visible',
    'card_desc4': 'Une façon de montrer que le travail utile a de la valeur, que l\'attention laisse une trace, et que les hommes et femmes de l\'ombre méritent d\'être vus.',
    'existence_quote': 'Parce que certaines histoires font plus que raconter ce que fait une entreprise.',
    'existence_quote_sub': 'Elles rappellent pourquoi cela compte.',
    'sticky_text': 'Rendre visible ce qui passe d\'ordinaire inaperçu.',
    'blue_title1': 'Respect environnemental',
    'blue_desc1': 'Enseigner que notre soin des locaux traduit le soin que nous portons au monde ambiant.',
    'blue_title2': 'Respect du travail invisible',
    'blue_desc2': 'Valoriser tous ceux qui oeuvrent quotidiennement dans l\'ombre pour la propreté.',
    'blue_title3': 'Un héritage pour la génération future',
    'blue_desc3': 'Écrire des histoires montrant aux enfants la fierté de prendre grand soin de notre environnement.',
    'stories_real': 'DES HISTOIRES AVEC DU SENS.',
    'not_just_service': 'Pas seulement un service,',
    'stays_with_you': 'des histoires qui vous accompagnent.',
    'step_label1': 'Vous découvrez l\'histoire',
    'step_label2': 'Vous observez l\'invisible',
    'step_label3': 'Vous comprenez l\'impact',
    'ready_bring_order': 'PRÊT À METTRE DE L\'ORDRE DANS VOTRE ESPACE ?',
    'partnership_rely': 'Bâtissons une collaboration',
    'rely_on': 'sur laquelle vous fier.',
    'get_quote_mins': 'VOTRE DEVIS EN DEUX MINUTES →',
    'explore_srvs': 'EXPLORER NOS SERVICES →',
    'comics_purpose': 'BANDES DESSINÉES AVEC DU SENS',
    'magical_stories': 'Des récits magiques pour un monde meilleur !',
    'join_kai': 'Rejoignez Kai dans ses formidables aventures ! Nos BD ne sont pas seulement amusantes à lire, elles aident les enfants partout. Chaque exemplaire acheté permet d\'agir pour le climat ou les personnes en difficulté.',
    'buy_comic': 'Vous achetez une BD',
    'real_st': 'Histoires vraies.',
    'real_peop': 'Vrais gens.',
    'real_imp': 'Vrai impact.',
    'lc_01_title': 'APPRENTISSAGE',
    'lc_01_text': 'Comprendre les systèmes, pas seulement réagir.',
    'lc_02_title': 'CHAOS',
    'lc_02_text': 'Là où d\'autres craignent le désordre, Kai apprend.',
    'lc_03_title': 'PRÉCISION',
    'lc_03_text': 'Exigence helvétique. Rien n\'est laissé au hasard.',
    'lc_04_title': 'COLLABORATION',
    'lc_04_text': 'La croissance se fait à deux. Toujours.',
    'evolution_title': 'L\'ÉVOLUTION DE KAI',
    'evolution_subtitle': 'Comment nos clients aident Kraken à grandir, du premier avis à un avenir légendaire.',
    'evolution_partnership': 'Chaque grand partenariat commence par une histoire.',
    'evo_step1_title': '1. AVIS',
    'evo_step1_desc': 'Les avis positifs aident le bébé Kai à grandir.',
    'evo_step2_title': '2. RÉSERVATIONS',
    'evo_step2_desc': 'Les clients réservent nos services.',
    'evo_step3_title': '3. CONTRAT',
    'evo_step3_desc': 'De nouveaux contrats créent une dynamique.',
    'evo_step4_title': '4. COMMUNAUTÉ',
    'evo_step4_desc': 'La communauté nous aide à grandir.',
    'evo_step5_title': '5. CROISSANCE KRAKEN',
    'evo_step5_desc': 'Ensemble, les clients aident Kraken à se développer.',
    'evo_step6_title': '6. KAI LÉGENDAIRE',
    'evo_step6_desc': 'Évolue encore...',
    'coming_soon': 'BIENTÔT',
    'coming_soon_desc': 'L\'AVENTURE CONTINUE DANS LE VOL. II'
  },
  'it': {
    'our_origin': 'LE NOSTRE ORIGINI',
    'great_start_1': 'Ogni grande',
    'great_start_2': 'collaborazione',
    'great_start_3': 'inizia con una storia.',
    'schaff_idea_1': 'A Sciaffusa, una semplice idea ha preso forma.',
    'schaff_idea_2': 'Oggi guida tutto ciò che facciamo.',
    'btn_explore': 'SCOPRI LA STORIA',
    'btn_store': 'ACCEDI AL COMIC STORE',
    'quote_rhine': 'Fin dal suo primo respiro nel Reno, Kai è stato plasmate dal flusso, dalla precisione e dall\'equilibrio.',
    'quote_path': 'Comprende gli edifici nello stesso modo in cui l\'acqua comprende il suo corso — in modo naturale, efficiente, senza attrito.',
    'quote_control': 'In un mondo pieno di rumore e complessità, porta un controllo sereno.',
    'quote_phil': 'Questa è la filosofia alla base di tutto ciò che facciamo.',
    'legend_of_kai': 'LA LEGGENDA DI KAI',
    'lessons_deep': 'Lezioni dagli abissi. Applicate a tutto ciò che facciamo.',
    'profits_charity': 'Il 25% dei profitti va in beneficenza',
    'global_impact': 'Creare impatto globale',
    'exist_badge': 'PERCHÉ ESISTONO I FUMETTI',
    'exist_title1': 'Progettati per essere',
    'exist_title_highlight': 'compresi.',
    'exist_title2': 'Non solo forniti.',
    'card_title1': 'Oltre i servizi',
    'card_desc1': 'Creato per esprimere ciò che Kraken rappresenta oltre i servizi — cura, responsabilità e rispetto per il lavoro essenziale.',
    'card_title2': 'Ciò que spesso non si vede',
    'card_desc2': 'Evidenziamo una verità semplice: i servizi di pulizia e manutenzione fanno molto di più che sostenere gli spazi. Diamo forma alla vita quotidiana al loro interno.',
    'card_title3': 'Costruito con un significato personale',
    'card_desc3': 'Dietro a ciò, vi è anche un intento personale — creare qualcosa che il figlio del fondatore possa un giorno interpretare come riflesso di valori, non solo aziendali.',
    'card_title4': 'Valore invisibile reso visibile',
    'card_desc4': 'Un modo per dimostrare che il lavoro denso di significato conta, que la dedizione lascia il segno e que le persone dietro ad esso meritano considerazione.',
    'existence_quote': 'Poiché certe storie fanno di più che dire semplicemente cosa faccia un\'impresa.',
    'existence_quote_sub': 'Ricordano alle persone il motivo per cui è fondamentale.',
    'sticky_text': 'Rendere manifesto ciò che di lavoro resta nell\'ombra.',
    'blue_title1': 'Rispetto ecologico',
    'blue_desc1': 'Insegnare che la cura prestata ai locali esprime il rispetto verso il pianeta.',
    'blue_title2': 'Rispetto per il lavoro silente',
    'blue_desc2': 'Dare visibilità a coloro la cui fatica quotidiana mantiene tutto operoso.',
    'blue_title3': 'Un patrimonio per la gioventù',
    'blue_desc3': 'Tramandare storie che aiutino i bambini a vedere l\'orgoglio e la dignità nei lavori di servizio.',
    'stories_real': 'STORIE CON UN REALISTICO SIGNIFICATO.',
    'not_just_service': 'Non solo un servizio,',
    'stays_with_you': 'ma storie che ti restano impresse.',
    'step_label1': 'Scopri il racconto',
    'step_label2': 'Vedi l\'invisibile',
    'step_label3': 'Comprendi la portata',
    'ready_bring_order': 'PRONTO A REINFONDERE ORDINE NEI TUOI LOCALI?',
    'partnership_rely': 'Costruiamo una sinergia',
    'rely_on': 'su cui fare affidamento.',
    'get_quote_mins': 'DEVIS COMPILATO IN POCHI MINUTI →',
    'explore_srvs': 'SFOGLIA I SERVIZI →',
    'comics_purpose': 'FUMETTI CON UNO SCOPO',
    'magical_stories': 'Storie magiche per un mondo migliore!',
    'join_kai': 'Accompagna Kai in avventure straordinarie! I nostri fumetti non sono solo piacevoli da sfogliare, ma sostengono l\'infanzia. Ogni copia acquistata ci aiuta a fare del bene al pianeta e a chi ha bisogno.',
    'buy_comic': 'Acquisti un fumetto',
    'real_st': 'Storie vere.',
    'real_peop': 'Gente vera.',
    'real_imp': 'Vero impatto.',
    'lc_01_title': 'APRENDIMENTO',
    'lc_01_text': 'Comprendere gli schemi logici, non solo reagire.',
    'lc_02_title': 'CAOS',
    'lc_02_text': 'Mentre gli altri temono il caos, Kai ne trae insegnamento.',
    'lc_03_title': 'PRECISIONE',
    'lc_03_text': 'Rigore elvetico. Nulla è lasciato al caso.',
    'lc_04_title': 'COLLABORAZIONE',
    'lc_04_text': 'La crescita si consegue uniti. Sempre.',
    'evolution_title': 'L\'EVOLUZIONE DI KAI',
    'evolution_subtitle': 'Come i nostri clienti aiutano Kraken a crescere, dalla prima recensione a un futuro leggendario.',
    'evolution_partnership': 'Ogni grande collaborazione inizia con una storia.',
    'evo_step1_title': '1. RECENSIONI',
    'evo_step1_desc': 'Le recensioni positive aiutano il piccolo Kai a crescere.',
    'evo_step2_title': '2. PRENOTAZIONI',
    'evo_step2_desc': 'I clienti prenotano i nostri servizi.',
    'evo_step3_title': '3. CONTRATTI',
    'evo_step3_desc': 'Nuovi contratti creano slancio.',
    'evo_step4_title': '4. COMUNITÀ',
    'evo_step4_desc': 'La comunità ci aiuta a crescere.',
    'evo_step5_title': '5. CRESCITA KRAKEN',
    'evo_step5_desc': 'Insieme, i clienti aiutano Kraken a espandersi.',
    'evo_step6_title': '6. KAI LEGGENDARIO',
    'evo_step6_desc': 'Ancora in evoluzione...',
    'coming_soon': 'PROSSIMAMENTE',
    'coming_soon_desc': 'L\'AVVENTURA CONTINUA NEL VOL. II'
  },
  'pt': {
    'our_origin': 'NOSSA ORIGEM',
    'great_start_1': 'Cada grande',
    'great_start_2': 'parceria',
    'great_start_3': 'começa com uma história.',
    'schaff_idea_1': 'Em Schaffhausen, uma ideia simples tomou forma.',
    'schaff_idea_2': 'Hoje, ela impulsiona tudo o que fazemos.',
    'btn_explore': 'EXPLORAR HISTÓRIA',
    'btn_store': 'VER LOJA DE BANDA DESENHADA',
    'quote_rhine': 'Desde o seu primeiro fôlego no Reno, Kai foi moldado pelo fluxo, precisão e equilíbrio.',
    'quote_path': 'Ele compreende os edifícios tal como a água compreende o seu caminho — de forma natural, eficiente e sem atrito.',
    'quote_control': 'Num mundo cheio de ruído e complexidade, ele traz um controlo sereno.',
    'quote_phil': 'Essa é a filosofia por trás de tudo o que fazemos.',
    'legend_of_kai': 'A LENDA DE KAI',
    'lessons_deep': 'Lições das profundezas. Aplicadas a tudo o que fazemos.',
    'profits_charity': '25% dos lucros revertem para caridade',
    'global_impact': 'Fazendo impacto global',
    'exist_badge': 'PORQUE EXISTEM AS BANDAS DESENHADAS',
    'exist_title1': 'Criadas para serem',
    'exist_title_highlight': 'entendidas.',
    'exist_title2': 'Não apenas entregues.',
    'card_title1': 'Além dos serviços',
    'card_desc1': 'Criado para expressar o que a Kraken representa além dos serviços — preocupação, responsabilidade e respeito pelo trabalho essencial.',
    'card_title2': 'O que muitas vezes passa invisível',
    'card_desc2': 'Destacamos uma verdade simples: a limpeza e o trabalho de manutenção fazem muito mais do que sustentar espaços. Moldamos a vida quotidiana dentro deles.',
    'card_title3': 'Construído com significado pessoal',
    'card_desc3': 'Por trás delas, há também uma intenção pessoal — criar algo que o filho do fundador possa um dia entender como um reflexo de valores, não apenas de negócios.',
    'card_title4': 'Valor invisível tornado visível',
    'card_desc4': 'Um modo de mostrar que o trabalho com significado importa, que o carinho deixa uma marca e que as pessoas por trás dele merencem ser vistas.',
    'existence_quote': 'Porque algumas histórias fazem mais do que dizer às pessoas o que uma empresa faz.',
    'existence_quote_sub': 'Elas lembram às pessoas por que isso é importante.',
    'sticky_text': 'Tornar visível o que habitualmente passa invisível.',
    'blue_title1': 'Cuidado ambiental',
    'blue_desc1': 'Ensinar que o modo como cuidamos dos espaços reflete como cuidamos do mundo ao nosso redor.',
    'blue_title2': 'Respeito pelo trabalho silencioso',
    'blue_desc2': 'Dar visibilidade às pessoas cujo esforço diário mantém tudo a funcionar.',
    'blue_title3': 'Um legado para a próxima geração',
    'blue_desc3': 'Criar histórias que ajudem as crianças a ver orgulho, responsabilidade e carinho no trabalho com significado.',
    'stories_real': 'HISTÓRIAS COM SENTIDO REAL.',
    'not_just_service': 'Não apenas serviços,',
    'stays_with_you': 'mas histórias que ficam com você.',
    'step_label1': 'Descobre a história',
    'step_label2': 'Vê o invisível',
    'step_label3': 'Compreende o impacto',
    'ready_bring_order': 'PRONTO PARA TRAZER ORDEM AO SEU ESPAÇO?',
    'partnership_rely': 'Vamos construir uma parceria',
    'rely_on': 'em que possa confiar.',
    'get_quote_mins': 'OBTENHA SEU ORÇAMENTO EXATO →',
    'explore_srvs': 'EXPLORAR SERVIÇOS →',
    'comics_purpose': 'BANDA DESENHADA COM PROPÓSITO',
    'magical_stories': 'Histórias mágicas para um mundo melhor!',
    'join_kai': 'Junte-se ao Kai em aventuras incríveis! As nossas BD são divertidas e apoiam crianças em todo o lado. Cada livro adquirido ajuda o planeta e pessoas carenciadas.',
    'buy_comic': 'Você compra uma BD',
    'real_st': 'Histórias reais.',
    'real_peop': 'Pessoas reais.',
    'real_imp': 'Impacto real.',
    'lc_01_title': 'APRENDIZAGEM',
    'lc_01_text': 'Compreender os sistemas, não apenas reagir a eles.',
    'lc_02_title': 'CAOS',
    'lc_02_text': 'Enquanto outros temem o caos, Kai aprende com ele.',
    'lc_03_title': 'PRECISÃO',
    'lc_03_text': 'Detalhe de nível suíço. Nada é deixado ao acaso.',
    'lc_04_title': 'COLABORAÇÃO',
    'lc_04_text': 'O crescimento acontece juntos. Sempre.',
    'evolution_title': 'A EVOLUÇÃO DO KAI',
    'evolution_subtitle': 'Como os nossos clientes ajudam o Kraken a crescer, desde a primeira avaliação a um futuro lendário.',
    'evolution_partnership': 'Cada grande parceria começa com uma história.',
    'evo_step1_title': '1. AVALIAÇÕES',
    'evo_step1_desc': 'Avaliações positivas ajudam o bebé Kai a crescer.',
    'evo_step2_title': '2. RESERVAS',
    'evo_step2_desc': 'Os clientes reservam os nossos serviços.',
    'evo_step3_title': '3. CONTRATOS',
    'evo_step3_desc': 'Novos contratos geram impulso.',
    'evo_step4_title': '4. COMUNIDADE',
    'evo_step4_desc': 'A comunidade ajuda-nos a crescer.',
    'evo_step5_title': '5. CRESCIMENTO DO KRAKEN',
    'evo_step5_desc': 'Juntos, os clientes ajudam o Kraken a expandir-se.',
    'evo_step6_title': '6. KAI LENDÁRIO',
    'evo_step6_desc': 'Ainda a evoluir...',
    'coming_soon': 'BREVEMENTE',
    'coming_soon_desc': 'A AVENTURA CONTINUA NO VOL. II'
  }
};

const ComicPage: React.FC<ComicPageProps> = ({ onNavigate }) => {
  const { language, t } = useTranslation();
  const [isBookOpen, setIsBookOpen] = React.useState(false);
  const [bookPage, setBookPage] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  const getS = (key: string): string => {
    const lang = (language === 'de-CH') ? 'de' : language;
    const dict = COMIC_T[lang] || COMIC_T['en'];
    return dict[key] || COMIC_T['en'][key] || key;
  };

  const legendCards = [
    {
      id: '01',
      title: getS('lc_01_title'),
      text: getS('lc_01_text'),
      img: kaiComicPhotos.photo1,
      color: 'text-green-600',
      badgeBg: 'bg-green-600'
    },
    {
      id: '02',
      title: getS('lc_02_title'),
      text: getS('lc_02_text'),
      img: kaiComicPhotos.photo3,
      color: 'text-blue-500',
      badgeBg: 'bg-blue-500'
    },
    {
      id: '03',
      title: getS('lc_03_title'),
      text: getS('lc_03_text'),
      img: kaiComicPhotos.photo2,
      color: 'text-purple-600',
      badgeBg: 'bg-purple-600'
    },
    {
      id: '04',
      title: getS('lc_04_title'),
      text: getS('lc_04_text'),
      img: kaiComicPhotos.photo4,
      color: 'text-orange-500',
      badgeBg: 'bg-orange-500'
    }
  ];

  const handleNextPage = () => {
    if (bookPage < legendCards.length - 1) {
      setDirection(1);
      setBookPage(prev => prev + 1);
    }
  };
  const handlePrevPage = () => {
    if (bookPage > 0) {
      setDirection(-1);
      setBookPage(prev => prev - 1);
    }
  };
  const handlePageJump = (index: number) => {
    if (index === bookPage) return;
    setDirection(index > bookPage ? 1 : -1);
    setBookPage(index);
  };

  const getComicDetails = (index: number) => {
    const lang = (language === 'de-CH') ? 'de' : language;
    const details: Record<string, Array<{ caption: string; banner: string; logTitle: string; text: string }>> = {
      es: [
        {
          caption: "Cada gran historia comienza con un primer paso humilde.",
          banner: "APRENDIZAJE",
          logTitle: "KAI LOG:",
          text: "Comprender los sistemas, no solo reaccionar a ellos."
        },
        {
          caption: "Kai encuentra sabiduría donde otros solo ven desorden.",
          banner: "CAOS",
          logTitle: "KAI LOG:",
          text: "Mientras otros temen al caos, Kai aprende de él."
        },
        {
          caption: "El orden perfecto se crea con un enfoque inquebrantable.",
          banner: "PRECISIÓN",
          logTitle: "KAI LOG:",
          text: "Detalle a nivel suizo. Nada se deja al azar."
        },
        {
          caption: "Las verdaderas leyendas nunca se construyen solas.",
          banner: "COLABORACIÓN",
          logTitle: "KAI LOG:",
          text: "El crecimiento sucede juntos. Siempre."
        }
      ],
      de: [
        {
          caption: "Jede grossartige Geschichte beginnt mit einem ersten bescheidenen Schritt.",
          banner: "LERNEN",
          logTitle: "KAI LOG:",
          text: "Systeme verstehen, nicht nur auf sie reagieren."
        },
        {
          caption: "Kai findet Weisheit, wo andere nur Unordnung sehen.",
          banner: "CHAOS",
          logTitle: "KAI LOG:",
          text: "Während andere das Chaos fürchten, lernt Kai daraus."
        },
        {
          caption: "Perfekte Ordnung entsteht durch unerschütterlichen Fokus.",
          banner: "PRÄZISION",
          logTitle: "KAI LOG:",
          text: "Präzision auf Schweizer Niveau. Nichts wird dem Zufall überlassen."
        },
        {
          caption: "Wahre Legenden werden nie alleine erbaut.",
          banner: "KOOPERATION",
          logTitle: "KAI LOG:",
          text: "Wachstum geschieht gemeinsam. Immer."
        }
      ],
      fr: [
        {
          caption: "Chaque grande histoire commence par un premier pas humble.",
          banner: "APPRENTISSAGE",
          logTitle: "KAI LOG:",
          text: "Comprendre les systèmes, pas seulement y réagir."
        },
        {
          caption: "Kai trouve la sagesse là où d'autres ne voient que du désordre.",
          banner: "CHAOS",
          logTitle: "KAI LOG:",
          text: "Pendant que d'autres craignent le chaos, Kai en tire des leçons."
        },
        {
          caption: "L'ordre parfait est conçu avec une concentration inébranlable.",
          banner: "PRÉCISION",
          logTitle: "KAI LOG:",
          text: "Détails à la suisse. Rien n'est laissé au hasard."
        },
        {
          caption: "Les vraies légendes ne se construisent jamais seules.",
          banner: "COLLABORATION",
          logTitle: "KAI LOG:",
          text: "La croissance se fait ensemble. Toujours."
        }
      ],
      it: [
        {
          caption: "Ogni grande storia inizia con un primo passo umile.",
          banner: "APPRENDIMENTO",
          logTitle: "KAI LOG:",
          text: "Comprendere i sistemi, non solo reagire ad essi."
        },
        {
          caption: "Kai trova la saggezza dove altri vedono solo disordine.",
          banner: "CAOS",
          logTitle: "KAI LOG:",
          text: "Mentre gli altri temono il caos, Kai impara da esso."
        },
        {
          caption: "L'ordine perfetto è creato con una concentrazione incrollabile.",
          banner: "PRECISIONE",
          logTitle: "KAI LOG:",
          text: "Dettagli a livello svizzero. Nulla è lasciato al caso."
        },
        {
          caption: "Le vere leggende non si costruiscono mai da sole.",
          banner: "COLLABORAZIONE",
          logTitle: "KAI LOG:",
          text: "La crescita avviene insieme. Sempre."
        }
      ],
      pt: [
        {
          caption: "Toda grande história começa com um primeiro passo humilde.",
          banner: "APRENDIZADO",
          logTitle: "KAI LOG:",
          text: "Compreender os sistemas, não apenas reagir a eles."
        },
        {
          caption: "Kai encontra sabedoria onde outros apenas vêem desordem.",
          banner: "CAOS",
          logTitle: "KAI LOG:",
          text: "Enquanto outros temem o caos, Kai aprende com ele."
        },
        {
          caption: "A ordem perfeita é criada com um foco inabalável.",
          banner: "PRECISÃO",
          logTitle: "KAI LOG:",
          text: "Detalhe a nível suíço. Nada é deixado ao acaso."
        },
        {
          caption: "As verdadeiras lendas nunca são construídas sozinhas.",
          banner: "COLABORAÇÃO",
          logTitle: "KAI LOG:",
          text: "O crescimento acontece juntos. Sempre."
        }
      ],
      en: [
        {
          caption: "Every great story begins with a humble first step.",
          banner: "LEARNING",
          logTitle: "KAI LOG:",
          text: "Understanding systems, not just reacting to them."
        },
        {
          caption: "Kai finds wisdom where others only see disorder.",
          banner: "CHAOS",
          logTitle: "KAI LOG:",
          text: "While others fear chaos, Kai learns from it."
        },
        {
          caption: "Perfect order is crafted with unwavering focus.",
          banner: "PRECISION",
          logTitle: "KAI LOG:",
          text: "Swiss-level detail. Nothing left to chance."
        },
        {
          caption: "True legends are never built alone.",
          banner: "COLLABORATION",
          logTitle: "KAI LOG:",
          text: "Growth happens together. Always."
        }
      ]
    };
    const pool = details[lang] || details['en'];
    return pool[index] || pool[0];
  };

  const getFooterText = () => {
    const lang = (language === 'de-CH') ? 'de' : language;
    const texts: Record<string, { left: string; right: string }> = {
      es: {
        left: "HISTORIAS QUE INSPIRAN ACCIÓN. EXPERIENCIAS QUE TRANSFORMAN ESPACIOS.",
        right: "VER TODOS LOS EPISODIOS"
      },
      de: {
        left: "GESCHICHTEN, DIE ZUM HANDELN INSPIRIEREN. ERFAHRUNGEN, DIE RÄUME VERÄNDERN.",
        right: "ALLE EPISODEN ANZEIGEN"
      },
      fr: {
        left: "DES HISTOIRES QUI INSPIRENT L'ACTION. DES EXPÉRIENCES QUI TRANSFORMENT LES ESPACES.",
        right: "VOIR TOUS LES ÉPISODES"
      },
      it: {
        left: "STORIE CHE ISPIRANO L'AZIONE. ESPERIENZE CHE TRASFORMANO GLI SPAZI.",
        right: "VEDI TUTTI GLI EPISODI"
      },
      pt: {
        left: "HISTÓRIAS QUE INSPIRAM A ACÇÃO. EXPERIÊNCIAS QUE TRANSFORMAM ESPAÇOS.",
        right: "VER TODOS OS EPISÓDIOS"
      },
      en: {
        left: "STORIES THAT INSPIRE ACTION. EXPERIENCES THAT TRANSFORM SPACES.",
        right: "VIEW ALL EPISODES"
      }
    };
    return texts[lang] || texts['en'];
  };

  return (
    <main className="bg-white min-h-screen selection:bg-blue-500/30 text-[#020617] font-sans">
      
      {/* --- HERO SECTION --- */}
      <section id="origin" className="relative pt-24 pb-36 overflow-hidden bg-gradient-to-b from-[#f8fafc] to-white border-b border-slate-100">
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">{getS('our_origin')}</span>
          </motion.div>

          {/* Keep: Every great partnership starts with a story */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-[72px] font-black leading-[1.1] tracking-tighter text-[#001A3D] max-w-4xl mb-4 animate-fade-in"
          >
            {getS('great_start_1')} {getS('great_start_2')} {getS('great_start_3')}
          </motion.h1>

          {/* Subtitle with image info translated */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl font-black text-blue-600 uppercase tracking-widest mb-3"
          >
            {getS('evolution_title')}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-gray-600 text-base md:text-lg font-medium leading-relaxed mb-8 max-w-2xl"
          >
            {getS('evolution_subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <button 
              onClick={() => onNavigate('about')}
              className="bg-[#1a2b4b] text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#001A3D] transition-all shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-95"
            >
              <PlayIcon className="w-4 h-4 fill-current" /> {getS('btn_explore')}
            </button>
            <button 
              onClick={() => onNavigate('comic-shop')}
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 group"
            >
              <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" /> {getS('btn_store')} <ChevronRightIcon className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* IMAGE CONTAINER TARGETING THE EXACT USER SELECTOR PATH */}
        <div className="w-full max-w-[1920px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full relative"
          >
            <img 
              src="/evolucion-mascota-kraken.webp" 
              alt="The Evolution of Kai" 
              className="w-full h-auto block mx-auto"
              referrerPolicy="no-referrer"
            />

            {/* INTERACTIVE TRANSLATED GRID OF THE 6 STAGES - Positioned exactly below the Kais, masking the original English text */}
            <div className="lg:absolute lg:bottom-[12%] lg:left-0 lg:right-0 w-full px-4 md:px-6 max-w-7xl mx-auto mt-8 lg:mt-0 z-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: num * 0.05 }}
                    className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200/60 hover:border-blue-400 hover:shadow-lg transition-all duration-300 shadow-sm flex flex-col items-center text-center group active:scale-98 cursor-default"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      {num}
                    </div>
                    <h3 className="font-black text-[11px] uppercase tracking-wider text-[#001A3D] mb-1">
                      {getS(`evo_step${num}_title`)}
                    </h3>
                    <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
                      {getS(`evo_step${num}_desc`)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="pb-6 bg-white relative z-30">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#E8E8E8] rounded-[2rem] p-8 md:p-12 border border-gray-200 shadow-xl -mt-24 max-w-6xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 pt-2">
                <div className="w-16 h-16 bg-transparent flex items-center justify-center">
                   <span className="text-7xl text-blue-500 font-serif leading-none">“</span>
                </div>
              </div>
              <div className="flex-1 text-left">
                <p className="text-[#001A3D] text-lg md:text-xl font-medium leading-relaxed italic mb-4">
                  {getS('quote_rhine')} <br />
                  {getS('quote_path')} <br />
                  {getS('quote_control')}
                </p>
                <p className="text-blue-600 font-black text-xl italic">
                  {getS('quote_phil')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- COMICS WITH PURPOSE SECTION --- */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="bg-green-50 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-sm border border-green-100/50">
            {/* Subtle Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
                 style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
            
            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left: Comic Cover Display */}
              <div className="lg:col-span-4 xl:col-span-3 relative">
                <div className="relative z-20">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-1000 max-w-[320px] mx-auto lg:max-w-none z-10">
                      {/* Dynamic Shadow */}
                      <div className="absolute inset-0 bg-black/10 blur-2xl translate-x-6 translate-y-6 rounded-2xl rotate-3" />
                      
                      {/* The Single Comic Cover */}
                      <div className="relative aspect-[3/4] shadow-2xl rounded-2xl overflow-hidden border-4 border-white bg-white group cursor-pointer">
                        <img 
                          src="/comic-promotion.webp" 
                          alt="Comic Cover" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        {/* Subtle Gloss Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/5 pointer-events-none group-hover:opacity-0 transition-opacity" />

                        {/* BACK OF THE BOOK OVERLAY ON HOVER (Aparece al pasar el cursor sin necesidad de pulsar) */}
                        <div className="absolute inset-0 bg-[#001A3D]/95 text-white p-5 sm:p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 overflow-y-auto backdrop-blur-md">
                          <div className="space-y-3 text-left">
                            <div className="flex items-center justify-between border-b border-blue-400/30 pb-2">
                              <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase flex items-center gap-1.5">
                                <BookOpenIcon className="w-3.5 h-3.5" />
                                {t('comic.backCover.label')}
                              </span>
                              <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full uppercase">
                                SCHAFFHAUSEN
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                              {t('comic.backCover.p1')}
                            </p>
                            <p className="text-xs sm:text-sm font-normal text-slate-300 leading-relaxed">
                              {t('comic.backCover.p2')}
                            </p>
                            <p className="text-xs sm:text-sm font-normal text-slate-300 leading-relaxed">
                              {t('comic.backCover.p3')}
                            </p>
                            <p className="text-xs sm:text-sm font-bold text-blue-200 leading-relaxed italic border-l-2 border-blue-400 pl-2">
                              {t('comic.backCover.p4')}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-blue-400/30 text-center">
                            <p className="text-sm sm:text-base font-black tracking-tight text-amber-300 uppercase">
                              {t('comic.backCover.title')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Decorative Stars */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                      rotate: [0, 90, 0]
                    }}
                    transition={{ 
                      duration: 3 + i, 
                      repeat: Infinity, 
                      delay: i * 0.5 
                    }}
                    className="absolute text-yellow-400 pointer-events-none"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      fontSize: `${Math.random() * 20 + 10}px`
                    }}
                  >
                    ⭐
                  </motion.div>
                ))}
              </div>

              {/* Right: Content Area */}
              <div className="lg:col-span-8 xl:col-span-9">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 text-left">
                  <div className="flex-1">
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="text-green-700 font-black text-[10px] uppercase tracking-[0.5em] mb-3"
                    >
                      {getS('comics_purpose')}
                    </motion.p>
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl md:text-5xl font-black tracking-tighter leading-none text-[#001A3D] mb-4"
                    >
                      {getS('magical_stories')}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-600 text-base md:text-lg font-medium leading-relaxed max-w-2xl mb-4"
                    >
                      {getS('join_kai')}
                      <span className="text-green-600 font-black ml-2 inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-sm">
                        <HeartIcon size={16} className="fill-current" /> {getS('profits_charity')}!
                      </span>
                    </motion.p>
                  </div>

                  {/* Handwritten Text - Right Aligned */}
                  <motion.div 
                    initial={{ opacity: 0, rotate: 5 }}
                    whileInView={{ opacity: 1, rotate: -2 }}
                    className="hidden xl:block shrink-0 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm"
                  >
                    <div className="flex gap-6">
                      <p className="font-handwriting text-[22px] text-gray-800 leading-tight">{getS('real_st')}</p>
                      <p className="font-handwriting text-[22px] text-gray-800 leading-tight">{getS('real_peop')}</p>
                      <p className="font-handwriting text-[22px] text-gray-800 leading-tight">{getS('real_imp')}</p>
                    </div>
                    <div className="mt-1">
                      <svg width="100%" height="10" viewBox="0 0 300 14" fill="none" preserveAspectRatio="none">
                        <path d="M4 11C50 11 100 2 150 2C200 2 250 11 296 11" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                {/* Process Flow - Clean White Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                  {/* Decorative Leaf - Right */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 pointer-events-none z-0 rotate-45">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-800/30 w-full h-full">
                      <path d="M80 180C80 180 90 150 110 130C130 110 160 120 160 120C160 120 130 110 110 130C90 150 80 180 80 180Z" fill="currentColor"/>
                    </svg>
                  </div>

                  {/* You buy a comic - Flipping Emoji */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-green-100 flex flex-col items-center text-center gap-3 group transition-all duration-300 hover:shadow-md hover:border-green-200"
                  >
                    <motion.div 
                      animate={{ 
                        rotateY: [0, -20, 20, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-4xl"
                    >
                      📖
                    </motion.div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-tight">{getS('buy_comic')}</p>
                  </motion.div>
                  
                  {/* 25% Profits - Heartbeat Emoji */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-green-100 flex flex-col items-center text-center gap-3 group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-green-200"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1, 1.2, 1],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-4xl relative z-10"
                      >
                        ❤️
                      </motion.div>
                      {/* Mini Hearts Emitter */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5, y: 0, x: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.8],
                            y: -50 - (i * 15),
                            x: (i % 2 === 0 ? 25 : -25) * (i + 1)
                          }}
                          transition={{ 
                            duration: 2.5, 
                            repeat: Infinity, 
                            delay: i * 0.8,
                            ease: "easeOut"
                          }}
                          className="absolute top-0 left-0 text-lg pointer-events-none"
                        >
                          ❤️
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-tight">{getS('profits_charity')}</p>
                  </motion.div>

                  {/* Together - Impact Emoji */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-green-100 flex flex-col items-center text-center gap-3 group transition-all duration-300 hover:shadow-md hover:border-green-200"
                  >
                    <motion.div 
                      animate={{ 
                        rotate: [0, 360],
                      }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      style={{ 
                        transformOrigin: "center center",
                        display: "inline-block",
                        transform: "rotate(23.5deg)" // Earth's axial tilt
                      }}
                      className="text-4xl drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    >
                      🌍
                    </motion.div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-tight">{getS('global_impact')}</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY THE COMICS EXIST SECTION --- */}
      <section className="py-24 bg-[#F8FAFF] relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }} />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4"
            >
              {getS('exist_badge')}
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-[#001A3D] tracking-tighter leading-[0.9]"
            >
              {getS('exist_title1')} <span className="text-blue-600">{getS('exist_title_highlight')}</span><br />
              <span className="text-gray-400">{getS('exist_title2')}</span>
            </motion.h2>
          </div>

          {/* Top Grid (2x2) */}
          <div className="grid md:grid-cols-2 gap-6 mb-16 text-left">
            {[
              {
                title: getS('card_title1'),
                text: getS('card_desc1'),
                emoji: "🚩",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                title: getS('card_title2'),
                text: getS('card_desc2'),
                emoji: "👁️",
                color: "text-indigo-600",
                bg: "bg-indigo-50"
              },
              {
                title: getS('card_title3'),
                text: getS('card_desc3'),
                emoji: "👨‍👦",
                color: "text-purple-600",
                bg: "bg-purple-50"
              },
              {
                title: getS('card_title4'),
                text: getS('card_desc4'),
                emoji: "✨",
                color: "text-amber-600",
                bg: "bg-amber-50"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-100/50 hover:shadow-md transition-shadow flex gap-6 group"
              >
                <div className={`${card.bg} ${card.color} w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {card.emoji}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#001A3D] mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-semibold">
                    {card.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quote Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex gap-6 mb-20 max-w-4xl mx-auto items-start text-left"
          >
            <div className="bg-blue-600 p-2 rounded-xl shrink-0 mt-0 mr-0 text-[14px]">
              <QuoteIcon className="text-white" size={24} fill="currentColor" />
            </div>
            <div>
              <p className="italic font-bold text-[26px] font-['Arial'] text-[#001A3D] leading-tight">
                {getS('existence_quote')}
              </p>
              <p className="font-bold italic text-[26px] font-['Arial'] text-blue-600 mt-2 no-underline">{getS('existence_quote_sub')}</p>
            </div>
          </motion.div>

          {/* Main Visual with Sticky Note */}
          <div className="relative max-w-5xl mx-auto mb-0 group">
            <img 
              src="/Mastering the chaos of property management.png" 
              alt="Mastering the chaos of property management with Kai" 
              className="w-full h-auto block transition-transform duration-1000 group-hover:scale-105"
              style={{ 
                maskImage: 'radial-gradient(ellipse at center, black 0%, black 20%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, black 20%, transparent 75%)'
              }}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            {/* Sticky Note */}
            <motion.div 
              initial={{ opacity: 0, x: 20, rotate: 10 }}
              whileInView={{ opacity: 1, x: 0, rotate: 3 }}
              className="absolute top-1/3 -right-4 bg-[#FFFF88] p-4 shadow-xl border-t-4 border-green-500/20 max-w-[180px] hidden md:block z-20"
            >
              <p className="font-handwriting text-lg text-gray-800 leading-tight">
                {getS('sticky_text')}
              </p>
              {/* Push pin effect */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-inner" />
            </motion.div>
          </div>

          {/* Blue Cards (1x3) */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
            {[
              {
                title: getS('blue_title1'),
                text: getS('blue_desc1'),
                emoji: "🌿"
              },
              {
                title: getS('blue_title2'),
                text: getS('blue_desc2'),
                emoji: "🤝"
              },
              {
                title: getS('blue_title3'),
                text: getS('blue_desc3'),
                emoji: "🌱"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#001A3D] p-10 rounded-[2.5rem] text-white relative overflow-hidden group"
              >
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="text-4xl mb-6 opacity-90 group-hover:scale-110 transition-transform origin-left">
                  {card.emoji}
                </div>
                <h4 className="text-xl font-black mb-3">{card.title}</h4>
                <p className="text-blue-100/70 font-semibold leading-relaxed text-sm">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Footer Section */}
          <div className="border-t border-blue-100 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-12 text-left">
            <div>
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.5em] mb-4">{getS('stories_real')}</p>
              <h3 className="text-xl md:text-5xl font-black text-[#001A3D] tracking-tighter leading-none">
                {getS('not_just_service')}<br />
                <span className="text-blue-600">{getS('stays_with_you')}</span>
              </h3>
            </div>
            
            <div className="flex flex-wrap justify-start md:justify-end items-center gap-6 shrink-0 font-sans">
              {[
                { label: getS('step_label1'), icon: BookOpenIcon },
                { label: getS('step_label2'), icon: EyeIcon },
                { label: getS('step_label3'), icon: BarChart3Icon }
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="bg-white w-16 h-16 rounded-2xl shadow-sm border border-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                      <step.icon size={28} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-tight">
                      {step.label.split(' ').slice(0, 2).join(' ')}<br />
                      {step.label.split(' ').slice(2).join(' ')}
                    </p>
                  </div>
                  {i < 2 && (
                    <ChevronRightIcon className="text-gray-200 hidden md:block" size={24} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-[#001A3D] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
            {/* Background Kai Peek */}
            <img 
              src={mascotImageUrl} 
              alt="" 
              className="absolute -bottom-10 -left-10 w-40 opacity-20 grayscale pointer-events-none" 
              loading="lazy"
            />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <p className="text-blue-400 font-black text-[9px] uppercase tracking-[0.5em] mb-6">{getS('ready_bring_order')}</p>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none mb-8">
                {getS('partnership_rely')} <br />
                {getS('rely_on')}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => onNavigate('consultation')}
                  className="bg-green-500 text-[#001A3D] px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-green-400 transition-all shadow-xl shadow-green-500/20 shadow-green-500/20 flex items-center gap-2"
                >
                  {getS('get_quote_mins')}
                </button>
                <button 
                  onClick={() => onNavigate('services-page')}
                  className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  {getS('explore_srvs')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        
        .font-handwriting {
          font-family: 'Permanent Marker', cursive;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
};

export default ComicPage;
