import { homeText, normalizeHomeLanguage, type HomeLanguage } from '../components/home/homeTranslations.ts';
import type { KaiField, KaiService } from '../src/kai/types.ts';
import { KRAKEN_VEHICLE } from '../src/vehicle.ts';

/** Approved public-site facts. Vehicle measurements are nominal, not a load guarantee. */
export const KAI_KNOWLEDGE = Object.freeze({
  company: 'Kraken Properties & Facilities Management',
  regions: ['Zürich', 'Schaffhausen', 'Winterthur'],
  email: 'kai@krakenpfm.ch',
  phone: '+41 77 450 57 05',
  address: 'Seewadelstrasse 3, 8203 Schaffhausen, Schweiz',
  vehicle: { ...KRAKEN_VEHICLE, nominalMeasurements: true, volumeApproximate: true, payloadKg: null,
    notes: 'First-generation owner-confirmed L1H1. One-item fit is geometric only. Confirm actual lining, weight, handling, access and securement. Never infer payload from 250 or the roof limit; never guarantee a full room/studio in one trip.',
    sources: ['https://www.fordpresse.be/content/old/2012_pdf_2012_ford_transit_custom_nl.pdf#page=46', 'https://www.smov.co.uk/pdf/Ford%20Transit%20Custom.pdf#page=21'] },
  vat: 'Es wird keine Mehrwertsteuer verrechnet.',
  services: {
    windows: 'Window cleaning: quantity, window type and accessibility; scope clarified personally. No standalone online estimate is configured.',
    end: 'End-of-tenancy cleaning: home size, condition, handover date and agreed scope.',
    regular: 'Regular household cleaning: home size, frequency and priority tasks.',
    deep: 'Deep household cleaning: rooms, areas needing attention and priorities.',
    moving: 'Small moves: origin, destination, furniture/boxes, access and date.',
  },
  preparation: 'Describe the work and access in the calculator. Scope, preparation and arrangements are confirmed personally. Do not promise availability, guarantees, discounts or a vehicle fit.',
});

const copy = {
  de: {
    acknowledged: 'Ich habe Ihre Angaben für den Entwurf übernommen.',
    choose: 'Welche Unterstützung wünschen Sie: Fensterreinigung, Umzugsreinigung, regelmässige Reinigung, Grundreinigung oder einen kleinen Umzug?',
    multiple: 'Ich habe beide Anliegen notiert. Mit welchem Service möchten Sie im Rechner beginnen?',
    ready: 'Sie können den Entwurf jetzt prüfen und im Rechner ergänzen.',
    price: 'Die Kosten berechnen Sie im Kraken-Rechner. Ich kann Ihre Angaben für den Übergang vorbereiten.',
    vehicle: "Wir nutzen einen Ford Transit Custom 250 L1H1 mit rund 6 m³: innen 255,5 × 177,5 × 140,6 cm (Länge × Breite × Höhe), zwischen den Radkästen 139 cm. Die Hecktüröffnung misst etwa 140 × 134 cm. Möbelmasse, Gewicht und Zugänge prüfen wir persönlich; daraus folgt keine Zusage für eine bestimmte Ladung oder eine einzige Fahrt.",
    regions: 'Wir unterstützen Privathaushalte in Zürich, Schaffhausen und Winterthur. Den Einsatz und die Anfahrt prüfen wir anhand Ihrer Angaben.',
    contact: 'Sie erreichen Kraken unter kai@krakenpfm.ch oder +41 77 450 57 05. Das Team kann die nächsten Schritte persönlich mit Ihnen klären.',
    includes: 'Den genauen Umfang und die Vorbereitung stimmen wir im Rechner und in Ihrer persönlichen Bestätigung ab.',
    deferred: 'Kein Problem. Diese Angabe können Sie später ergänzen.',
    scope: 'Für diese Beratung stehen Fensterreinigung, Umzugsreinigung, regelmässige Reinigung, Grundreinigung und kleine Umzüge zur Auswahl.',
    later: 'Später ergänzen', unknown: 'Das weiss ich noch nicht',
  },
  en: {
    acknowledged: 'I have added your details to the draft.',
    choose: 'What do you need help with: window cleaning, move-out cleaning, regular cleaning, deep cleaning or a small move?',
    multiple: 'I have noted both needs. Which service would you like to start with in the calculator?',
    ready: 'You can review the draft now and complete it in the calculator.',
    price: 'Use the Kraken calculator for costs. I can prepare your details so you can continue there.',
    vehicle: "We use a Ford Transit Custom 250 L1H1 with about 6 m³: inside 255.5 × 177.5 × 140.6 cm (length × width × height), 139 cm between the wheel arches. The rear opening is about 140 × 134 cm. We check item dimensions, weight and access personally; these figures do not guarantee a load or a single trip.",
    regions: 'We help private households in Zurich, Schaffhausen and Winterthur. We review the job and travel arrangements using your details.',
    contact: 'Contact Kraken at kai@krakenpfm.ch or +41 77 450 57 05. The team can discuss the next steps with you personally.',
    includes: 'The exact scope and preparation are agreed in the calculator and your personal confirmation.',
    deferred: 'No problem. You can add that detail later.',
    scope: 'This guide covers window cleaning, move-out cleaning, regular cleaning, deep cleaning and small moves.',
    later: 'Complete later', unknown: 'I do not know yet',
  },
  es: {
    acknowledged: 'He añadido sus datos al borrador.',
    choose: '¿Necesita limpieza de ventanas, de fin de alquiler, periódica, a fondo o una pequeña mudanza?',
    multiple: 'He anotado ambas necesidades. ¿Por qué servicio desea empezar en el calculador?',
    ready: 'Puede revisar el borrador y completar los detalles en el calculador.',
    price: 'Puede calcular los costes en el calculador de Kraken. Puedo preparar sus datos para que continúe allí.',
    vehicle: "Utilizamos una Ford Transit Custom 250 L1H1 de unos 6 m³: interior de 255,5 × 177,5 × 140,6 cm (largo × ancho × alto), con 139 cm entre pasos de rueda. La abertura trasera es de unos 140 × 134 cm. Revisamos las medidas, el peso y los accesos; esto no confirma una carga concreta ni un solo viaje.",
    regions: 'Ayudamos a hogares particulares en Zúrich, Schaffhausen y Winterthur. Revisamos el servicio y el desplazamiento según sus datos.',
    contact: 'Puede contactar con Kraken en kai@krakenpfm.ch o en el +41 77 450 57 05. El equipo le explicará personalmente los siguientes pasos.',
    includes: 'El alcance exacto y la preparación se acuerdan en el calculador y en su confirmación personal.',
    deferred: 'No hay problema. Puede completar ese dato después.',
    scope: 'Esta guía incluye limpieza de ventanas, de fin de alquiler, periódica, a fondo y pequeñas mudanzas.',
    later: 'Completar después', unknown: 'Todavía no lo sé',
  },
  pt: {
    acknowledged: 'Acrescentei os seus dados ao rascunho.',
    choose: 'Precisa de limpeza de janelas, de fim de arrendamento, regular, a fundo ou de uma pequena mudança?',
    multiple: 'Anotei as duas necessidades. Por que serviço pretende começar no simulador?',
    ready: 'Pode rever o rascunho e completar os detalhes no simulador.',
    price: 'Pode calcular os custos no simulador Kraken. Posso preparar os seus dados para continuar por lá.',
    vehicle: "Utilizamos uma Ford Transit Custom 250 L1H1 com cerca de 6 m³: interior de 255,5 × 177,5 × 140,6 cm (comprimento × largura × altura), com 139 cm entre as cavas das rodas. A abertura traseira tem cerca de 140 × 134 cm. Confirmamos as medidas, o peso e os acessos; estes valores não garantem uma carga nem uma única viagem.",
    regions: 'Apoiamos casas particulares em Zurique, Schaffhausen e Winterthur. Analisamos o serviço e a deslocação com base nos seus dados.',
    contact: 'Pode contactar a Kraken em kai@krakenpfm.ch ou pelo +41 77 450 57 05. A equipa pode combinar pessoalmente os próximos passos.',
    includes: 'O âmbito exato e a preparação são combinados no simulador e na sua confirmação pessoal.',
    deferred: 'Não há problema. Pode completar esse dado mais tarde.',
    scope: 'Esta ajuda abrange limpeza de janelas, de fim de arrendamento, regular, a fundo e pequenas mudanças.',
    later: 'Completar mais tarde', unknown: 'Ainda não sei',
  },
  it: {
    acknowledged: 'Ho aggiunto i suoi dati alla bozza.',
    choose: 'Ha bisogno di pulizia dei vetri, di fine locazione, regolare, approfondita o di un piccolo trasloco?',
    multiple: 'Ho annotato entrambe le esigenze. Da quale servizio desidera iniziare nel calcolatore?',
    ready: 'Può rivedere la bozza e completare i dettagli nel calcolatore.',
    price: 'Può calcolare i costi nel calcolatore Kraken. Posso preparare i suoi dati per proseguire da lì.',
    vehicle: "Utilizziamo un Ford Transit Custom 250 L1H1 con circa 6 m³: interno di 255,5 × 177,5 × 140,6 cm (lunghezza × larghezza × altezza), con 139 cm tra i passaruota. Il vano delle porte posteriori misura circa 140 × 134 cm. Verifichiamo misure, peso e accessi; questi dati non garantiscono un carico specifico o un solo viaggio.",
    regions: 'Aiutiamo i privati a Zurigo, Schaffhausen e Winterthur. Verifichiamo l’intervento e il tragitto in base ai suoi dati.',
    contact: 'Può contattare Kraken a kai@krakenpfm.ch o al +41 77 450 57 05. Il team potrà concordare personalmente i prossimi passi.',
    includes: 'Il contenuto esatto del servizio e la preparazione vengono concordati nel calcolatore e nella conferma personale.',
    deferred: 'Nessun problema. Può aggiungere questo dato più tardi.',
    scope: 'Questa guida comprende pulizia dei vetri, di fine locazione, regolare, approfondita e piccoli traslochi.',
    later: 'Completare più tardi', unknown: 'Non lo so ancora',
  },
  fr: {
    acknowledged: 'J’ai ajouté vos informations au brouillon.',
    choose: 'Avez-vous besoin d’un nettoyage des vitres, de fin de bail, régulier, en profondeur ou d’un petit déménagement ?',
    multiple: 'J’ai noté les deux besoins. Par quelle prestation souhaitez-vous commencer dans le calculateur ?',
    ready: 'Vous pouvez vérifier le brouillon et compléter les détails dans le calculateur.',
    price: 'Vous pouvez calculer les coûts dans le calculateur Kraken. Je peux préparer vos informations pour poursuivre là-bas.',
    vehicle: "Nous utilisons un Ford Transit Custom 250 L1H1 d’environ 6 m³ : intérieur de 255,5 × 177,5 × 140,6 cm (longueur × largeur × hauteur), avec 139 cm entre les passages de roue. L’ouverture arrière mesure environ 140 × 134 cm. Nous vérifions dimensions, poids et accès ; ces données ne garantissent ni une charge précise ni un seul trajet.",
    regions: 'Nous accompagnons les particuliers à Zurich, Schaffhouse et Winterthour. Nous examinons la demande et le déplacement selon vos informations.',
    contact: 'Contactez Kraken à kai@krakenpfm.ch ou au +41 77 450 57 05. L’équipe pourra convenir personnellement des prochaines étapes avec vous.',
    includes: 'Le périmètre exact et la préparation sont convenus dans le calculateur et dans votre confirmation personnelle.',
    deferred: 'Aucun problème. Vous pourrez compléter cette information plus tard.',
    scope: 'Cette aide concerne le nettoyage des vitres, de fin de bail, régulier, en profondeur et les petits déménagements.',
    later: 'Compléter plus tard', unknown: 'Je ne sais pas encore',
  },
} as const;

const questionRows = {
  city: ['In welcher Ortschaft oder Postleitzahl ist der Auftrag?', 'Which town or postcode is the job in?', '¿En qué localidad o código postal es el servicio?', 'Em que localidade ou código postal será o serviço?', 'In quale località o codice postale si trova l’abitazione?', 'Dans quelle localité ou à quel code postal se trouve le logement ?'],
  origin: ['In welcher Ortschaft holen wir die Sachen ab?', 'Which town are we collecting from?', '¿En qué localidad recogemos las cosas?', 'Em que localidade recolhemos os bens?', 'In quale località ritiriamo gli oggetti?', 'Dans quelle localité faut-il récupérer les affaires ?'],
  destination: ['In welche Ortschaft soll der Umzug gehen?', 'Which town are you moving to?', '¿A qué localidad se dirige la mudanza?', 'Para que localidade será a mudança?', 'Verso quale località è diretto il trasloco?', 'Vers quelle localité déménagez-vous ?'],
  rooms: ['Wie viele Zimmer hat Ihre Wohnung ungefähr?', 'About how many rooms does your apartment have?', '¿Cuántas habitaciones tiene aproximadamente la vivienda?', 'Quantas divisões tem aproximadamente a casa?', 'Quanti locali ha circa l’appartamento?', 'Combien de pièces compte approximativement votre appartement ?'],
  bedrooms: ['Wie viele Schlafzimmer sind zu reinigen?', 'How many bedrooms need cleaning?', '¿Cuántos dormitorios hay que limpiar?', 'Quantos quartos precisam de limpeza?', 'Quante camere da letto vanno pulite?', 'Combien de chambres faut-il nettoyer ?'],
  bathrooms: ['Wie viele Badezimmer sind zu reinigen?', 'How many bathrooms need cleaning?', '¿Cuántos baños hay que limpiar?', 'Quantas casas de banho precisam de limpeza?', 'Quanti bagni vanno puliti?', 'Combien de salles de bain faut-il nettoyer ?'],
  frequency: ['Wie oft wünschen Sie die Reinigung?', 'How often would you like cleaning?', '¿Con qué frecuencia desea la limpieza?', 'Com que frequência pretende a limpeza?', 'Con quale frequenza desidera la pulizia?', 'À quelle fréquence souhaitez-vous le nettoyage ?'],
  inventory: ['Welche Möbel und wie viele Kartons sollen mitkommen?', 'Which furniture and how many boxes need moving?', '¿Qué muebles y cuántas cajas hay que transportar?', 'Que móveis e quantas caixas pretende transportar?', 'Quali mobili e quante scatole vanno trasportati?', 'Quels meubles et combien de cartons faut-il transporter ?'],
  originAccess: ['Gibt es am Abholort einen Lift, oder welche Treppen sind zu beachten?', 'Is there a lift at collection, or which stairs should we plan for?', '¿Hay ascensor en la recogida o qué escaleras debemos tener en cuenta?', 'Há elevador na recolha ou que escadas devemos ter em conta?', 'C’è un ascensore al ritiro o quali scale dobbiamo considerare?', 'Y a-t-il un ascenseur au départ ou quelles marches faut-il prévoir ?'],
  destinationAccess: ['Gibt es am Ziel einen Lift, oder welche Treppen sind zu beachten?', 'Is there a lift at the destination, or which stairs should we plan for?', '¿Hay ascensor en el destino o qué escaleras debemos tener en cuenta?', 'Há elevador no destino ou que escadas devemos ter em conta?', 'C’è un ascensore a destinazione o quali scale dobbiamo considerare?', 'Y a-t-il un ascenseur à l’arrivée ou quelles marches faut-il prévoir ?'],
  date: ['Haben Sie bereits ein Wunschdatum, oder möchten Sie es später ergänzen?', 'Do you have a preferred date, or would you like to add it later?', '¿Tiene una fecha preferida o desea completarla después?', 'Já tem uma data pretendida ou prefere indicar mais tarde?', 'Ha già una data preferita o desidera aggiungerla più tardi?', 'Avez-vous une date souhaitée ou préférez-vous la préciser plus tard ?'],
  windowsCount: ['Wie viele Fenster sind es ungefähr?', 'About how many windows are there?', '¿Cuántas ventanas son aproximadamente?', 'Quantas janelas são aproximadamente?', 'Quante finestre sono circa?', 'Combien de fenêtres y a-t-il environ ?'],
  windowType: ['Welche Art von Fenstern ist es, zum Beispiel normale Fenster oder grosse Glasflächen?', 'What type of windows are they, for example standard windows or large glass panes?', '¿Qué tipo de ventanas son, por ejemplo normales o grandes superficies de cristal?', 'Que tipo de janelas são, por exemplo normais ou grandes superfícies de vidro?', 'Di che tipo sono le finestre, ad esempio normali o grandi vetrate?', 'De quel type de fenêtres s’agit-il, par exemple classiques ou grandes baies vitrées ?'],
  windowAccess: ['Sind die Fenster gut erreichbar, oder gibt es schwer zugängliche Stellen?', 'Are the windows easy to reach, or are any areas difficult to access?', '¿Se accede bien a las ventanas o hay zonas difíciles de alcanzar?', 'As janelas são acessíveis ou existem zonas difíceis de alcançar?', 'Le finestre sono accessibili o ci sono punti difficili da raggiungere?', 'Les fenêtres sont-elles facilement accessibles ou certains endroits sont-ils difficiles d’accès ?'],
  priorities: ['Welche Bereiche oder Aufgaben sind Ihnen besonders wichtig?', 'Which areas or tasks matter most to you?', '¿Qué zonas o tareas son más importantes para usted?', 'Que zonas ou tarefas são mais importantes para si?', 'Quali zone o attività sono più importanti per lei?', 'Quelles zones ou tâches sont prioritaires pour vous ?'],
} satisfies Partial<Record<KaiField, readonly string[]>>;

const languageOrder = ['de', 'en', 'es', 'pt', 'it', 'fr'] as const;
export function kaiCopy(language: unknown) { return copy[normalizeHomeLanguage(language)]; }
export function kaiQuestion(language: HomeLanguage, field: KaiField): string {
  const row = questionRows[field as keyof typeof questionRows];
  return row?.[languageOrder.indexOf(language)] || kaiCopy(language).ready;
}
export function kaiServiceName(language: HomeLanguage, service: KaiService): string {
  const sources: Record<KaiService, string> = { windows: 'Fensterreinigung', end: 'Umzugsreinigung', regular: 'Regelmässige Reinigung', deep: 'Grundreinigung', moving: 'Kleiner Umzug' };
  return homeText(language, sources[service]);
}
