import { jsPDF } from 'jspdf';

interface CartItem {
  id: string;
  type: string;
  price?: number;
  duration?: number;
  details?: Record<string, any>;
  description?: string;
}

interface GeneratorOptions {
  cart: CartItem[];
  grandTotal: number;
  travelFee: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  city: string;
  bookingMode?: 'direct' | 'precision';
  bookingId?: string;
  selectedDate?: string;
  selectedTime?: string;
  language?: string;
  entsorgungRegime?: {
    gemeindeName?: string;
    sperrgutModell?: string;
    annahmestelleName?: string;
    annahmestelleDistanzKm?: number | null;
    bereitstellungUhrzeit?: string | null;
    quelle?: string;
    stand?: string;
    confidence?: string;
  };
  costsBreakdown?: {
    durchfuehrung: number;
    bewilligung: number;
    entsorgung: number;
    zuschlaege: number;
    total: number;
  };
}

export function translateSperrgutModell(model: string = '', lang: string = 'de'): string {
  const l = (lang || 'de').toLowerCase();
  if (model === 'aufAnfrage') {
    if (l.startsWith('es')) return 'Bajo Consulta (Servicio Personalizado ERZ / Punto Limpio)';
    if (l.startsWith('en')) return 'On Request (Custom Municipal ERZ Disposal)';
    if (l.startsWith('fr')) return 'Sur demande (Service personnalisé ERZ)';
    if (l.startsWith('it')) return 'Su richiesta (Servizio personalizzato ERZ)';
    if (l.startsWith('pt')) return 'Sob Consulta (Serviço Personalizado ERZ)';
    return 'Auf Anfrage (Sonderentsorgung / ERZ)';
  }
  if (model === 'marke') {
    if (l.startsWith('es')) return 'Viñetas / Adhesivos Oficiales del Municipio';
    if (l.startsWith('en')) return 'Official Municipal Sticker Tokens';
    if (l.startsWith('fr')) return 'Vignettes officielles de la commune';
    if (l.startsWith('it')) return 'Bollini comunali ufficiali';
    if (l.startsWith('pt')) return 'Selos municipais oficiais';
    return 'Gemeinde-Sperrgutmarken';
  }
  if (model === 'kombisystem') {
    if (l.startsWith('es')) return 'Sistema Combinado (Viñeta + Pesa)';
    if (l.startsWith('en')) return 'Combined System (Sticker + Weight Scale)';
    if (l.startsWith('fr')) return 'Système combiné (Vignette + Poids)';
    if (l.startsWith('it')) return 'Sistema combinato (Bollino + Peso)';
    if (l.startsWith('pt')) return 'Sistema Combinado (Selo + Peso)';
    return 'Kombisystem (Marke + Gewicht)';
  }
  if (model === 'keineAbfuhr') {
    if (l.startsWith('es')) return 'Sin Recogida Pública (Autotransporte a Punto Limpio)';
    if (l.startsWith('en')) return 'No Public Pickup (Direct Transport to Recycling Yard)';
    if (l.startsWith('fr')) return 'Pas de collecte publique (Transport direct déchèterie)';
    if (l.startsWith('it')) return 'Nessun ritiro pubblico (Trasporto diretto centro raccolta)';
    if (l.startsWith('pt')) return 'Sem Recolha Pública (Transporte Direto ao Centro)';
    return 'Keine Abfuhr (Selbstanlieferung Recyclinghof)';
  }
  return model || 'Gemeindespezifisch';
}

export function translateBereitstellung(timeStr: string | null = '', lang: string = 'de'): string {
  if (!timeStr) return 'k.A.';
  const l = (lang || 'de').toLowerCase();
  if (timeStr.includes('07:00 Uhr am Abholtag (frühst. Vorabend)')) {
    if (l.startsWith('es')) return '07:00 h el día de recogida (como muy pronto la tarde anterior)';
    if (l.startsWith('en')) return '07:00 AM on collection day (earliest evening before)';
    if (l.startsWith('fr')) return '07:00 le jour de collecte (au plus tôt la veille au soir)';
    if (l.startsWith('it')) return '07:00 il giorno del ritiro (al più presto la sera prima)';
    if (l.startsWith('pt')) return '07:00 no dia da recolha (o mais cedo na véspera à noite)';
    return '07:00 Uhr am Abholtag (frühst. Vorabend)';
  }
  if (timeStr.includes('07:00 (06:00 bei Hitze über 30°C)')) {
    if (l.startsWith('es')) return '07:00 h (06:00 h en ola de calor >30°C)';
    if (l.startsWith('en')) return '07:00 AM (06:00 AM in heatwaves >30°C)';
    if (l.startsWith('fr')) return '07:00 (06:00 en cas de canicule >30°C)';
    if (l.startsWith('it')) return '07:00 (06:00 in caso di caldo >30°C)';
    if (l.startsWith('pt')) return '07:00 (06:00 em ondas de calor >30°C)';
    return '07:00 Uhr (06:00 Uhr bei Hitze >30°C)';
  }
  return timeStr;
}

export function translateConfidence(confidence: string = '', lang: string = 'de'): string {
  const l = (lang || 'de').toLowerCase();
  if (confidence === 'VERIFIED') {
    if (l.startsWith('es')) return 'VERIFICADO (OFICIAL)';
    if (l.startsWith('en')) return 'VERIFIED (OFFICIAL)';
    if (l.startsWith('fr')) return 'VÉRIFIÉ (OFFICIEL)';
    if (l.startsWith('it')) return 'VERIFICATO (UFFICIALE)';
    if (l.startsWith('pt')) return 'VERIFICADO (OFICIAL)';
    return 'VERIFIZIERT (OFFIZIELL)';
  }
  if (confidence === 'REPORTED') {
    if (l.startsWith('es')) return 'REPORTADO';
    if (l.startsWith('en')) return 'REPORTED';
    if (l.startsWith('fr')) return 'SIGNALÉ';
    if (l.startsWith('it')) return 'SEGNALATO';
    if (l.startsWith('pt')) return 'REPORTADO';
    return 'GEMELDET';
  }
  if (l.startsWith('es')) return 'PROVISIONAL';
  if (l.startsWith('en')) return 'PROVISIONAL';
  return 'VORLÄUFIG';
}

const translations: Record<string, Record<string, string>> = {
  de: {
    title: 'OFFIZIELLE OFFERTE & SCHÄTZUNG',
    docType: 'Kostenvoranschlag',
    ref: 'Referenz-Nr',
    date: 'Datum',
    client: 'Kundeninformationen',
    serviceAddr: 'Service-Adresse',
    service: 'Dienstleistung',
    details: 'Details / Konfiguration',
    duration: 'Dauer',
    price: 'Preis',
    subtotal: 'Zwischensumme',
    travelFee: 'Wegpauschale',
    total: 'Gesamtsumme (Est.)',
    mode: 'Buchungstyp',
    direct: 'Express-Direktbuchung',
    precision: 'Präzisions-Anfrage',
    guarantee: 'Schweizer Qualitätsgarantie',
    guaranteeText: 'Alle Arbeiten werden mit höchster Präzision, biologisch abbaubaren Produkten und durch vollversichertes Personal ausgeführt.',
    signature: 'Kundenunterschrift / Einverständnis',
    signatureDate: 'Datum & Unterschrift',
    page: 'Seite',
    including: 'inkl. gesetzlicher MwSt.',
    generatedBy: 'Erstellt von Kraken Properties & Facilities Management, 8200 Schaffhausen.',
    notes: 'Hinweis: Diese Offerte basiert auf Ihren Angaben. Bei erheblichem Mehraufwand vor Ort gelten unsere Standardtarife.',
    hours: 'Std',
    customQuote: 'Präzisions-Schätzung',
    munHeader: 'GEMEINDE-PROVENIENZ & LOGISTIK-BEGRÜNDUNG',
    rationaleText: 'Dieser Preis basiert auf den gemeldeten Gemeindevorschriften, zertifiziertem Fachpersonal, Anfahrt, fachgerechter Mülltrennung (ERZ/Entsorgungshof) und CHF 10 Mio. Betriebshaftpflichtversicherung inkl. Schweizer Abgabegarantie.'
  },
  en: {
    title: 'OFFICIAL ESTIMATE & SERVICE QUOTE',
    docType: 'Estimate / Quote',
    ref: 'Reference No',
    date: 'Date',
    client: 'Client Information',
    serviceAddr: 'Service Address',
    service: 'Service',
    details: 'Details / Configuration',
    duration: 'Duration',
    price: 'Price',
    subtotal: 'Subtotal',
    travelFee: 'Travel Surcharge',
    total: 'Grand Total (Est.)',
    mode: 'Booking Mode',
    direct: 'Express Direct Booking',
    precision: 'Precision Evaluation',
    guarantee: 'Swiss Quality Guarantee',
    guaranteeText: 'All services are performed with Swiss precision, using eco-friendly products by fully insured and vetted professionals.',
    signature: 'Client Acceptance & Signature',
    signatureDate: 'Date & Signature',
    page: 'Page',
    including: 'incl. statutory VAT',
    generatedBy: 'Generated by Kraken Properties & Facilities Management, 8200 Schaffhausen.',
    notes: 'Note: This estimate is based on the parameters provided. If actual on-site complexity requires more effort, standard rates apply.',
    hours: 'hrs',
    customQuote: 'To be determined',
    munHeader: 'MUNICIPAL PROVENANCE & COST RATIONALE',
    rationaleText: 'This estimate is calculated based on verified municipal waste ordinances, certified specialist labor, transit fleet distance, eco-compliant sorting (ERZ recycling yard), and full CHF 10M liability coverage with Swiss Handover Guarantee.'
  },
  es: {
    title: 'PRESUPUESTO OFICIAL DE SERVICIOS',
    docType: 'Presupuesto / Estimación',
    ref: 'Referencia',
    date: 'Fecha',
    client: 'Información del Cliente',
    serviceAddr: 'Dirección del Servicio',
    service: 'Servicio',
    details: 'Detalles / Configuración',
    duration: 'Duración',
    price: 'Precio',
    subtotal: 'Subtotal',
    travelFee: 'Tasa de Desplazamiento',
    total: 'Total Estimado',
    mode: 'Tipo de Reserva',
    direct: 'Reserva Express Directa',
    precision: 'Evaluación de Precisión',
    guarantee: 'Garantía de Calidad Suiza',
    guaranteeText: 'Todos los servicios se realizan con precisión suiza, utilizando productos ecológicos por profesionales totalmente asegurados.',
    signature: 'Aceptación del Cliente y Firma',
    signatureDate: 'Fecha y Firma',
    page: 'Página',
    including: 'IVA incluido',
    generatedBy: 'Generado por Kraken Properties & Facilities Management, 8200 Schaffhausen.',
    notes: 'Nota: Esta estimación se basa en los parámetros provistos. Si la complejidad real requiere más horas, se aplicarán tarifas estándar.',
    hours: 'h',
    customQuote: 'A convenir',
    munHeader: 'PROCEDENCIA MUNICIPAL Y JUSTIFICACIÓN DE COSTES',
    rationaleText: 'Esta estimación se calcula según la normativa municipal verificada, mano de obra cualificada, transporte de flota, clasificación ecológica en punto limpio (ERZ), e incluye cobertura de seguro de CHF 10 Mio y Garantía de Entrega Suiza.'
  },
  fr: {
    title: 'DEVIS OFFICIEL DE PRESTATIONS',
    docType: 'Estimation / Devis',
    ref: 'N° de Référence',
    date: 'Date',
    client: 'Informations Client',
    serviceAddr: 'Adresse de Prestation',
    service: 'Prestation',
    details: 'Détails / Configuration',
    duration: 'Durée',
    price: 'Tarif',
    subtotal: 'Sous-total',
    travelFee: 'Frais de Déplacement',
    total: 'Total Estimé',
    mode: 'Mode de Réservation',
    direct: 'Réservation Directe Express',
    precision: 'Évaluation Précise',
    guarantee: 'Garantie de Qualité Suisse',
    guaranteeText: 'Toutes les prestations sont réalisées avec la rigueur suisse et des produits éco-responsables par des agents agréés et assurés.',
    signature: 'Acceptation du Client & Signature',
    signatureDate: 'Date & Signature',
    page: 'Page',
    including: 'TVA incluse',
    generatedBy: 'Généré par Kraken Properties & Facilities Management, 8200 Schaffhausen.',
    notes: 'Note: Cette estimation est basée sur vos déclarations. Si la complexité réelle sur site exige plus de temps, nos tarifs horaires s’appliquent.',
    hours: 'h',
    customQuote: 'À définir',
    munHeader: 'PROVENANCE MUNICIPALE ET JUSTIFICATION DU PRIX',
    rationaleText: 'Cette estimation est calculée selon le règlement municipal vérifié, la main-d\'œuvre spécialisée, le transport, le tri écologique (déchetterie ERZ), et inclut une assurance de CHF 10 Mio ainsi que la garantie de remise suisse.'
  },
  it: {
    title: 'PREVENTIVO UFFICIALE DI SERVIZI',
    docType: 'Preventivo / Stima',
    ref: 'N° Riferimento',
    date: 'Data',
    client: 'Informazioni Cliente',
    serviceAddr: 'Indirizzo del Servizio',
    service: 'Servizio',
    details: 'Dettagli / Configurazione',
    duration: 'Durata',
    price: 'Prezzo',
    subtotal: 'Subtotale',
    travelFee: 'Supplemento Trasferta',
    total: 'Totale Stimato',
    mode: 'Tipo di Prenotazione',
    direct: 'Prenotazione Express Diretta',
    precision: 'Valutazione di Precisione',
    guarantee: 'Garanzia di Qualità Svizzera',
    guaranteeText: 'Tutti i servizi sono eseguiti con precisione svizzera, utilizzando prodotti ecologici da professionisti qualificati e assicurati.',
    signature: 'Accettazione del Cliente & Firma',
    signatureDate: 'Data e Firma',
    page: 'Pagina',
    including: 'IVA inclusa',
    generatedBy: 'Generato da Kraken Properties & Facilities Management, 8200 Schaffhausen.',
    notes: 'Nota: Questo preventivo si basa sui dati forniti. Qualora la complessità sul posto richieda ore aggiuntive, si applicheranno le tariffe standard.',
    hours: 'ore',
    customQuote: 'Da definire',
    munHeader: 'PROVENIENZA COMUNALE E DETTAGLIO COSTI',
    rationaleText: 'Questo preventivo è calcolato in base alle normative comunali verificate, al personale specializzato, al trasporto, allo smaltimento ecologico (centro ERZ) e include una copertura assicurativa di CHF 10M e la garanzia di consegna svizzera.'
  },
  pt: {
    title: 'ORÇAMENTO OFICIAL DE SERVIÇOS',
    docType: 'Orçamento / Estimativa',
    ref: 'Nº Referência',
    date: 'Data',
    client: 'Informações do Cliente',
    serviceAddr: 'Morada do Serviço',
    service: 'Serviço',
    details: 'Detalhes / Configuração',
    duration: 'Duração',
    price: 'Preço',
    subtotal: 'Subtotal',
    travelFee: 'Taxa de Deslocação',
    total: 'Total Estimado',
    mode: 'Tipo de Reserva',
    direct: 'Reserva Express Direta',
    precision: 'Avaliação de Precisão',
    guarantee: 'Garantia de Qualidade Suíça',
    guaranteeText: 'Todos os serviços são executados com precisão suíça, utilizando produtos ecológicos por profissionais segurados.',
    signature: 'Aceitação do Cliente & Assinatura',
    signatureDate: 'Data e Assinatura',
    page: 'Página',
    including: 'IVA incluído',
    generatedBy: 'Gerado por Kraken Properties & Facilities Management, 8200 Schaffhausen.',
    notes: 'Nota: Esta estimativa é baseada nos dados fornecidos. Caso o serviço exija mais tempo devido à complexidade, aplicam-se as tarifas padrão.',
    hours: 'h',
    customQuote: 'A definir',
    munHeader: 'PROVENIÊNCIA MUNICIPAL E DETALHE DOS CUSTOS',
    rationaleText: 'Esta estimativa é calculada com base nos regulamentos municipais verificados, mão de obra especializada, transporte, triagem ecológica (centro ERZ), e inclui cobertura de seguro de CHF 10M e Garantia de Entrega Suíça.'
  }
};

const serviceTitleMap: Record<string, Record<string, string>> = {
  'end-of-tenancy': {
    de: 'Umszugsreinigung (Abgabegarantie)',
    en: 'End of Tenancy Cleaning',
    es: 'Limpieza de Fin de Contrato',
    fr: 'Nettoyage de Fin de Bail',
    it: 'Pulizia di Fine Locazione',
    pt: 'Limpeza de Fim de Contrato'
  },
  'deep-cleaning': {
    de: 'Tiefenreinigung / Frühjahrsputz',
    en: 'Deep Cleaning Service',
    es: 'Limpieza Profunda',
    fr: 'Nettoyage de Printemps',
    it: 'Pulizia Profonda',
    pt: 'Limpeza Profunda'
  },
  'daily-cleaning': {
    de: 'Regelmässige Unterhaltsreinigung',
    en: 'Regular Maintenance Cleaning',
    es: 'Limpieza de Mantenimiento',
    fr: 'Nettoyage Régulier',
    it: 'Pulizia di Mantenimento',
    pt: 'Limpeza de Manutenção'
  },
  'moving': {
    de: 'Möbeltransport & Umzug',
    en: 'Furniture Moving & Transfer',
    es: 'Transporte y Mudanza de Muebles',
    fr: 'Déménagement & Transfert',
    it: 'Trasloco e Trasporto Mobili',
    pt: 'Mudança e Transporte de Móveis'
  },
  'gardening': {
    de: 'Gartenpflege & Unterhalt',
    en: 'Garden Maintenance',
    es: 'Mantenimiento de Jardines',
    fr: 'Entretien de Jardin',
    it: 'Manutenzione Giardino',
    pt: 'Manutenção de Jardins'
  },
  'exterior-cleaning': {
    de: 'Aussen- & Fassadenreinigung',
    en: 'Exterior & Facade Cleaning',
    es: 'Limpieza de Exteriores y Fachadas',
    fr: 'Nettoyage Extérieur & Façades',
    it: 'Pulizia Esterna e Facciate',
    pt: 'Limpeza de Exteriores e Fachadas'
  },
  'car-detailing': {
    de: 'Mobile Premium-Autopflege',
    en: 'Mobile Premium Car Detailing',
    es: 'Estética de Automóviles a Domicilio',
    fr: 'Esthétique Automobile à Domicile',
    it: 'Dettagli Auto Mobile Premium',
    pt: 'Estética Automóvel Móvel Premium'
  },
  'pest-control': {
    de: 'Schädlingsbekämpfung',
    en: 'Pest Control Service',
    es: 'Control de Plagas',
    fr: 'Lutte contre les nuisibles',
    it: 'Disinfestazione',
    pt: 'Controlo de Pragas'
  },
  'waste-management': {
    de: 'Entsorgung & Räumung',
    en: 'Waste Management & Clearance',
    es: 'Gestión de Residuos y Vaciado',
    fr: 'Débarras & Gestion des Déchets',
    it: 'Smaltimento e Sgombero',
    pt: 'Gestão de Resíduos e Desapegos'
  },
  'gutter-cleaning': {
    de: 'Dachrinnenreinigung',
    en: 'Gutter Cleaning',
    es: 'Limpieza de Canalones',
    fr: 'Nettoyage de Gouttières',
    it: 'Pulizia Grondaie',
    pt: 'Limpeza de Caleiras'
  }
};

export function generateQuotePDF(options: GeneratorOptions) {
  const lang = (options.language || 'de').toLowerCase().split('-')[0];
  const t = translations[lang] || translations['de'];

  // Create document in A4 portrait (595 x 842 points)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const width = 595;
  const height = 842;
  const marginX = 45;
  let posY = 50;

  // Set font
  doc.setFont('Helvetica', 'normal');

  // ---- HEADER BRANDING ----
  // Deep corporate blue rectangle for header logo accent
  doc.setFillColor(0, 45, 91); // #002D5B
  doc.rect(0, 0, width, 12, 'F');
  posY += 20;

  // Brand Name
  doc.setTextColor(0, 45, 91); // #002D5B
  doc.setFontSize(26);
  doc.setFont('Helvetica', 'bold');
  doc.text('KRAKEN', marginX, posY);
  
  // Brand Subtitle
  doc.setTextColor(0, 123, 255); // #007bff
  doc.setFontSize(8);
  doc.setFont('Helvetica', 'bold');
  doc.text('PROPERTIES & FACILITIES MANAGEMENT', marginX, posY + 12);

  // Document Title (Right-aligned)
  doc.setTextColor(80, 90, 105);
  doc.setFontSize(11);
  doc.setFont('Helvetica', 'bold');
  doc.text(t.title, width - marginX, posY, { align: 'right' });

  // Document Type subtitle
  doc.setTextColor(140, 145, 155);
  doc.setFontSize(9);
  doc.setFont('Helvetica', 'normal');
  doc.text(t.docType, width - marginX, posY + 12, { align: 'right' });

  posY += 40;

  // Horizontal divider line
  doc.setDrawColor(230, 235, 240);
  doc.setLineWidth(1);
  doc.line(marginX, posY, width - marginX, posY);
  posY += 20;

  // ---- METADATA SECTION (2 columns) ----
  // Left Column: Client Details
  doc.setTextColor(0, 45, 91);
  doc.setFontSize(10);
  doc.setFont('Helvetica', 'bold');
  doc.text(t.client, marginX, posY);

  doc.setTextColor(70, 80, 95);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  let metadataY = posY + 15;
  
  if (options.name) {
    doc.text(options.name, marginX, metadataY);
    metadataY += 13;
  }
  if (options.phone) {
    doc.text(`Tel: ${options.phone}`, marginX, metadataY);
    metadataY += 13;
  }
  if (options.email) {
    doc.text(`Email: ${options.email}`, marginX, metadataY);
    metadataY += 13;
  }

  // Right Column: Reference & Date
  const col2X = width / 2 + 30;
  doc.setTextColor(0, 45, 91);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(t.serviceAddr, col2X, posY);

  doc.setTextColor(70, 80, 95);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  let metadata2Y = posY + 15;

  if (options.address) {
    // Split address if too long
    const addressLines = doc.splitTextToSize(options.address, width - col2X - marginX);
    addressLines.forEach((line: string) => {
      doc.text(line, col2X, metadata2Y);
      metadata2Y += 13;
    });
  }
  const zipCity = `${options.postcode || ''} ${options.city || ''}`.trim();
  if (zipCity) {
    doc.text(zipCity, col2X, metadata2Y);
    metadata2Y += 13;
  }

  // Additional parameters like Date/Booking Mode
  posY = Math.max(metadataY, metadata2Y) + 15;

  // Light filled block for estimate meta details
  doc.setFillColor(248, 249, 250);
  doc.rect(marginX, posY, width - 2 * marginX, 36, 'F');
  
  doc.setTextColor(110, 115, 125);
  doc.setFontSize(8);
  doc.setFont('Helvetica', 'bold');
  
  // Date, Ref No, and Booking Type titles
  doc.text(t.date.toUpperCase(), marginX + 15, posY + 15);
  doc.text(t.ref.toUpperCase(), marginX + 150, posY + 15);
  doc.text(t.mode.toUpperCase(), marginX + 300, posY + 15);

  doc.setTextColor(30, 35, 45);
  doc.setFontSize(9);
  doc.setFont('Helvetica', 'bold');

  const refNo = options.bookingId || `EST-${Math.floor(100000 + Math.random() * 900000)}`;
  const displayDate = options.selectedDate || new Date().toLocaleDateString(lang === 'de' ? 'de-CH' : 'en-US');
  const displayTime = options.selectedTime ? ` @ ${options.selectedTime}` : '';
  const displayMode = options.bookingMode === 'direct' ? t.direct : t.precision;

  doc.text(`${displayDate}${displayTime}`, marginX + 15, posY + 27);
  doc.text(refNo, marginX + 150, posY + 27);
  doc.text(displayMode, marginX + 300, posY + 27);

  posY += 55;

  // ---- ITEMIZED ESTIMATE TABLE ----
  // Header Row
  doc.setFillColor(0, 45, 91); // Deep blue header
  doc.rect(marginX, posY, width - 2 * marginX, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('Helvetica', 'bold');
  
  doc.text(t.service.toUpperCase(), marginX + 10, posY + 14);
  doc.text(t.details.toUpperCase(), marginX + 160, posY + 14);
  doc.text(t.duration.toUpperCase(), width - marginX - 110, posY + 14, { align: 'right' });
  doc.text(t.price.toUpperCase(), width - marginX - 15, posY + 14, { align: 'right' });

  posY += 22;

  // Table Body Rows
  options.cart.forEach((item, index) => {
    // Alternating background colors
    if (index % 2 === 0) {
      doc.setFillColor(252, 253, 254);
    } else {
      doc.setFillColor(244, 247, 250);
    }
    
    // Format description / configuration
    let configStr = '';
    if (item.details) {
      const parts: string[] = [];
      const config = item.details;
      if (item.type === 'end-of-tenancy') {
        if (config.roomsCount) parts.push(`${config.roomsCount} Rooms`);
        if (config.bathroomsCount) parts.push(`${config.bathroomsCount} Baths`);
        if (config.balconyCount) parts.push('Balcony');
        if (config.storageCount) parts.push('Storage');
        if (config.carpetCount) parts.push('Carpet');
        if (config.furnitureCount) parts.push('Upholstery');
      } else if (item.type === 'deep-cleaning' || item.type === 'daily-cleaning') {
        if (config.bedrooms) parts.push(`${config.bedrooms} Bed`);
        if (config.bathrooms) parts.push(`${config.bathrooms} Bath`);
        if (config.frequency && config.frequency !== 'One-Time') parts.push(config.frequency);
        if (config.ironing) parts.push('Ironing');
        if (config.laundry) parts.push('Laundry');
        if (config.windowCount) parts.push(`${config.windowCount} Windows`);
      } else if (item.type === 'moving') {
        if (config.movers) parts.push(`${config.movers} Movers`);
        if (config.truckSize) parts.push(`Truck: ${config.truckSize}`);
        if (config.hours) parts.push(`${config.hours}h`);
      } else if (item.type === 'gardening') {
        if (config.lawnArea) parts.push(`Lawn: ${config.lawnArea} sqm`);
        if (config.hedgeLength) parts.push(`Hedge: ${config.hedgeLength}m`);
        if (config.weeding) parts.push('Weeding');
        if (config.wasteRemoval) parts.push('Waste Removal');
      } else if (item.type === 'exterior-cleaning') {
        if (config.facadeSqm) parts.push(`Facade: ${config.facadeSqm} sqm`);
        if (config.roofCleaning) parts.push('Roof');
        if (config.terraceSqm) parts.push(`Terrace: ${config.terraceSqm} sqm`);
      } else if (item.type === 'car-detailing') {
        if (config.carSize) parts.push(`Size: ${config.carSize}`);
        if (config.packageLevel) parts.push(`Level: ${config.packageLevel}`);
      } else if (item.type === 'pest-control') {
        if (config.propertySqm) parts.push(`${config.propertySqm} sqm`);
        if (config.pestType) parts.push(`Pest: ${config.pestType}`);
      } else if (item.type === 'waste-management') {
        if (config.wasteVolume) parts.push(`Volume: ${config.wasteVolume}`);
        if (config.heavyItems) parts.push('Heavy Items');
      } else if (item.type === 'gutter-cleaning') {
        if (config.gutterLength) parts.push(`Length: ${config.gutterLength}m`);
        if (config.heightLevels) parts.push(`${config.heightLevels} Floors`);
      }
      configStr = parts.join(', ');
    }

    if (!configStr && item.description) {
      configStr = item.description;
    }

    const sTitleMap = serviceTitleMap[item.type];
    const sTitle = sTitleMap ? (sTitleMap[lang] || sTitleMap['de']) : item.type.replace(/-/g, ' ');

    // Calculate row height dynamically based on details text wrapping
    const textLines = doc.splitTextToSize(configStr || 'Standard Service Parameters', 240);
    const rowHeight = Math.max(28, textLines.length * 12 + 14);

    // Draw background rect
    doc.rect(marginX, posY, width - 2 * marginX, rowHeight, 'F');

    // Draw text values
    doc.setTextColor(30, 35, 45);
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'bold');
    doc.text(sTitle, marginX + 10, posY + 14);

    // Detail lines
    doc.setTextColor(90, 100, 115);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    textLines.forEach((line: string, lineIndex: number) => {
      doc.text(line, marginX + 160, posY + 14 + (lineIndex * 11));
    });

    // Duration
    doc.setTextColor(60, 65, 75);
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    const durationText = item.duration ? `${item.duration.toFixed(1)} ${t.hours}` : '--';
    doc.text(durationText, width - marginX - 110, posY + 14, { align: 'right' });

    // Price
    doc.setTextColor(30, 35, 45);
    doc.setFont('Helvetica', 'bold');
    const priceText = item.price ? `CHF ${item.price.toFixed(2)}` : t.customQuote;
    doc.text(priceText, width - marginX - 15, posY + 14, { align: 'right' });

    // Draw a subtle border bottom line
    doc.setDrawColor(235, 240, 245);
    doc.setLineWidth(0.5);
    doc.line(marginX, posY + rowHeight, width - marginX, posY + rowHeight);

    posY += rowHeight;
  });

  posY += 15;

  // ---- TOTALS SUMMARY CARD ----
  const totalsBoxWidth = 220;
  const totalsBoxX = width - marginX - totalsBoxWidth;

  // Subtotal Row
  doc.setTextColor(110, 115, 125);
  doc.setFontSize(9);
  doc.setFont('Helvetica', 'normal');
  doc.text(t.subtotal, totalsBoxX, posY);
  
  const servicesSubtotal = options.cart.reduce((acc, item) => acc + (item.price || 0), 0);
  doc.setTextColor(30, 35, 45);
  doc.setFont('Helvetica', 'bold');
  doc.text(`CHF ${servicesSubtotal.toFixed(2)}`, width - marginX - 15, posY, { align: 'right' });
  
  posY += 15;

  // Travel Fee Row
  doc.setTextColor(110, 115, 125);
  doc.setFont('Helvetica', 'normal');
  const onlyComics = options.cart.length > 0 && options.cart.every(item => item.type === 'comic-book');
  const travelLabel = onlyComics 
    ? (options.language === 'es' ? 'Gastos de envío' : options.language === 'de' ? 'Versandkosten' : 'Shipping Cost')
    : t.travelFee;
  doc.text(travelLabel, totalsBoxX, posY);

  doc.setTextColor(30, 35, 45);
  doc.setFont('Helvetica', 'bold');
  const travelFeeText = options.travelFee === 0 ? 'CHF 0.00' : `CHF ${options.travelFee.toFixed(2)}`;
  doc.text(travelFeeText, width - marginX - 15, posY, { align: 'right' });

  posY += 8;

  // Divider line
  doc.setDrawColor(210, 215, 220);
  doc.setLineWidth(1);
  doc.line(totalsBoxX, posY, width - marginX, posY);
  
  posY += 18;

  // Grand Total Row
  doc.setTextColor(0, 45, 91);
  doc.setFontSize(11);
  doc.setFont('Helvetica', 'bold');
  doc.text(t.total, totalsBoxX, posY);

  doc.setTextColor(0, 45, 91);
  doc.setFontSize(14);
  doc.setFont('Helvetica', 'bold');
  doc.text(`CHF ${options.grandTotal.toFixed(2)}`, width - marginX - 15, posY, { align: 'right' });

  posY += 25;

  // ---- MUNICIPAL PROVENANCE & DETAILED COST RATIONALE ----
  if (options.entsorgungRegime || options.costsBreakdown) {
    if (posY > 520) {
      doc.addPage();
      posY = 50;
    }

    const reg = options.entsorgungRegime || {};
    const cb = options.costsBreakdown;

    doc.setFillColor(248, 250, 252);
    doc.rect(marginX, posY, width - 2 * marginX, 108, 'F');
    doc.setDrawColor(218, 226, 236);
    doc.setLineWidth(0.8);
    doc.rect(marginX, posY, width - 2 * marginX, 108, 'D');

    doc.setTextColor(0, 45, 91);
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    doc.text(`🏛️ ${t.munHeader || 'MUNICIPAL PROVENANCE & COST RATIONALE'}`, marginX + 12, posY + 16);

    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');

    // Column 1: Municipal Ordinance Data
    const col1X = marginX + 12;
    let colY = posY + 30;

    const munName = reg.gemeindeName ? `${reg.gemeindeName} (${options.postcode || ''})` : `${options.city || ''} (${options.postcode || ''})`;
    const bulkyStr = translateSperrgutModell(reg.sperrgutModell, lang);
    const depotStr = reg.annahmestelleName ? `${reg.annahmestelleName} (${reg.annahmestelleDistanzKm || '?'} km)` : 'k.A.';
    const timeStr = translateBereitstellung(reg.bereitstellungUhrzeit, lang);
    const confStr = translateConfidence(reg.confidence, lang);

    doc.setTextColor(50, 60, 75);
    doc.setFont('Helvetica', 'bold');
    doc.text('Gemeinde / Ort:', col1X, colY);
    doc.setFont('Helvetica', 'normal');
    doc.text(munName, col1X + 85, colY);

    colY += 12;
    doc.setFont('Helvetica', 'bold');
    doc.text('Entsorgungsmodell:', col1X, colY);
    doc.setFont('Helvetica', 'normal');
    doc.text(doc.splitTextToSize(bulkyStr, 170)[0], col1X + 85, colY);

    colY += 12;
    doc.setFont('Helvetica', 'bold');
    doc.text('Annahmestelle:', col1X, colY);
    doc.setFont('Helvetica', 'normal');
    doc.text(doc.splitTextToSize(depotStr, 170)[0], col1X + 85, colY);

    colY += 12;
    doc.setFont('Helvetica', 'bold');
    doc.text('Bereitstellung:', col1X, colY);
    doc.setFont('Helvetica', 'normal');
    doc.text(doc.splitTextToSize(timeStr, 170)[0], col1X + 85, colY);

    colY += 12;
    doc.setFont('Helvetica', 'bold');
    doc.text('Status & Quelle:', col1X, colY);
    doc.setFont('Helvetica', 'normal');
    doc.text(`${confStr} • ${reg.quelle || 'ERZ'} (${reg.stand || '2026'})`, col1X + 85, colY);

    // Column 2: 3-Layer Cost Breakdown
    if (cb) {
      const col2X = marginX + 275;
      let col2Y = posY + 30;

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(0, 45, 91);
      doc.text('📊 3-Ebenen Kostenaufschlüsselung:', col2X, col2Y);

      col2Y += 12;
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(60, 70, 85);
      doc.text('🔨 Durchführung & Personal:', col2X, col2Y);
      doc.setFont('Helvetica', 'bold');
      doc.text(`CHF ${cb.durchfuehrung.toFixed(2)}`, width - marginX - 15, col2Y, { align: 'right' });

      col2Y += 11;
      doc.setFont('Helvetica', 'normal');
      doc.text('📋 Bewilligung & Halteverbot:', col2X, col2Y);
      doc.setFont('Helvetica', 'bold');
      doc.text(`CHF ${cb.bewilligung.toFixed(2)}`, width - marginX - 15, col2Y, { align: 'right' });

      col2Y += 11;
      doc.setFont('Helvetica', 'normal');
      doc.text('🗑️ Kommunale Entsorgung:', col2X, col2Y);
      doc.setFont('Helvetica', 'bold');
      doc.text(`CHF ${cb.entsorgung.toFixed(2)}`, width - marginX - 15, col2Y, { align: 'right' });

      col2Y += 11;
      doc.setFont('Helvetica', 'normal');
      doc.text('📍 Zonen- & Anfahrtszuschlag:', col2X, col2Y);
      doc.setFont('Helvetica', 'bold');
      doc.text(`CHF ${cb.zuschlaege.toFixed(2)}`, width - marginX - 15, col2Y, { align: 'right' });
    }

    // Explanation Rationale Note
    doc.setTextColor(90, 100, 115);
    doc.setFontSize(7);
    doc.setFont('Helvetica', 'italic');
    const rationale = t.rationaleText || 'Preis basiert auf Gemeindevorschriften, zertifiziertem Fachpersonal, Anfahrt, Mülltrennung (ERZ) und CHF 10 Mio. Versicherungsschutz.';
    const wrappedRationale = doc.splitTextToSize(`💡 ${rationale}`, width - 2 * marginX - 24);
    wrappedRationale.forEach((line: string, idx: number) => {
      doc.text(line, marginX + 12, posY + 93 + (idx * 8));
    });

    posY += 118;
  }

  // Ensure spacing doesn't overflow page before signature block
  if (posY > 660) {
    doc.addPage();
    posY = 50;
  }

  // ---- GUARANTEE & TRUST BAR ----
  doc.setFillColor(243, 248, 255); // Pale beautiful blue accent fill
  doc.rect(marginX, posY, width - 2 * marginX, 42, 'F');

  doc.setDrawColor(180, 210, 255);
  doc.setLineWidth(1);
  doc.rect(marginX, posY, width - 2 * marginX, 42, 'D');

  doc.setTextColor(0, 45, 91);
  doc.setFontSize(9);
  doc.setFont('Helvetica', 'bold');
  doc.text(`🛡️ ${t.guarantee}`, marginX + 15, posY + 16);

  doc.setTextColor(70, 85, 105);
  doc.setFontSize(8);
  doc.setFont('Helvetica', 'normal');
  
  const guaranteeWrapped = doc.splitTextToSize(t.guaranteeText, width - 2 * marginX - 30);
  guaranteeWrapped.forEach((line: string, index: number) => {
    doc.text(line, marginX + 15, posY + 27 + (index * 10));
  });

  posY += 65;

  // ---- SIGNATURE ACCEPTANCE AREA ----
  doc.setTextColor(100, 110, 120);
  doc.setFontSize(9);
  doc.setFont('Helvetica', 'bold');
  doc.text(t.signature, marginX, posY);

  posY += 25;

  doc.setDrawColor(190, 195, 205);
  doc.setLineWidth(0.75);
  doc.line(marginX, posY, marginX + 180, posY);
  doc.line(width - marginX - 180, posY, width - marginX, posY);

  doc.setTextColor(130, 135, 145);
  doc.setFontSize(8);
  doc.setFont('Helvetica', 'normal');
  doc.text(t.signatureDate, marginX, posY + 12);
  doc.text('Kraken Properties & Facilities Management', width - marginX - 180, posY + 12);

  // ---- FOOTER ----
  const footerY = height - 40;
  
  doc.setDrawColor(230, 235, 240);
  doc.setLineWidth(0.5);
  doc.line(marginX, footerY - 15, width - marginX, footerY - 15);

  doc.setTextColor(150, 155, 165);
  doc.setFontSize(7.5);
  doc.setFont('Helvetica', 'normal');
  doc.text(t.generatedBy, marginX, footerY);
  doc.text(t.notes, marginX, footerY + 10);
  doc.text(`${t.page} 1 / 1`, width - marginX, footerY, { align: 'right' });

  // Save the document
  const fileName = `Kraken_Estimate_${refNo}.pdf`;
  doc.save(fileName);
}
