import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { services } from '../assets';
import { getServiceLinkForMunicipality } from '../seoConfig';
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
  ClipboardList, 
  CheckCircle2, 
  ShieldAlert, 
  Award, 
  Star, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  ShieldCheck, 
  HeartHandshake, 
  Smile, 
  RefreshCw, 
  X,
  FileText
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { t, language } = useTranslation();
  
  const lastVisited = typeof window !== 'undefined' ? (localStorage.getItem('kraken_last_visited_municipality') || 'zurich') : 'zurich';
  
  // State for the interactive Hero Calculator
  const [selectedHeroService, setSelectedHeroService] = useState<'daily-cleaning' | 'moving' | 'gardening' | 'pest-control' | 'exterior-cleaning' | 'waste-management' | 'others'>('daily-cleaning');
  const [heroLocation, setHeroLocation] = useState<string>('Zürich, Suiza');
  
  // Testimonial slider state
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const isEs = language === 'es';
  const getConnector = () => {
    let langKey = language as string;
    if (langKey === 'de-CH') langKey = 'de';
    if (langKey === 'es') return 'y';
    if (langKey === 'de') return 'und';
    if (langKey === 'fr') return 'et';
    if (langKey === 'it') return 'e';
    if (langKey === 'pt') return 'e';
    return 'and';
  };

  // Multi-lingual dictionary for mockups matching the exact images
  const d = {
    badge: {
      es: 'SERVICIOS PROFESIONALES EN SCHAFFHAUSEN, ZÜRICH Y WINTERTHUR',
      de: 'PROFESSIONELLE DIENSTLEISTUNGEN IN SCHAFFHAUSEN, ZÜRICH UND WINTERTHUR',
      en: 'PROFESSIONAL SERVICES IN SCHAFFHAUSEN, ZURICH AND WINTERTHUR',
      fr: 'SERVICES PROFESSIONNELS À SCHAFFHAUSEN, ZURICH ET WINTERTHUR',
      it: 'SERVIZI PROFESSIONALI A SCHAFFHAUSEN, ZURIGO E MINI-WINTERTHUR',
      pt: 'SERVIÇOS PROFISSIONAIS EM SCHAFFHAUSEN, ZURIQUE E WINTERTHUR'
    },
    title1: {
      es: 'Limpieza',
      de: 'Reinigung',
      en: 'Cleaning',
      fr: 'Nettoyage',
      it: 'Pulizia',
      pt: 'Limpeza'
    },
    title2: {
      es: 'Servicios de',
      de: 'Dienstleistungen für',
      en: 'Facility',
      fr: 'Services de',
      it: 'Servizi di',
      pt: 'Serviços de'
    },
    title3: {
      es: 'Instalaciones',
      de: 'Gebäude & Liegenschaften',
      en: 'Services',
      fr: 'Gestion de Bâtiments',
      it: 'Gestione Immobili',
      pt: 'Instalações e Edifícios'
    },
    desc: {
      es: 'Soluciones profesionales para hogares, empresas y propiedades. Claro. Preciso. Rápido.',
      de: 'Professionelle Lösungen für Haushalte, Unternehmen und Liegenschaften. Klar. Präzise. Schnell.',
      en: 'Professional solutions for homes, businesses, and properties. Clear. Precise. Fast.',
      fr: 'Solutions professionnelles pour habitations, entreprises et propriétés. Clair. Précis. Rapide.',
      it: 'Soluzioni professionali per case, aziende e immobili. Chiaro. Preciso. Rapido.',
      pt: 'Soluções profissionais para lares, empresas e propriedades. Claro. Preciso. Rápido.'
    },
    ctaQuote: {
      es: 'PIDE TU PRESUPUESTO',
      de: 'OFFERTE ANFORDERN',
      en: 'GET A QUOTE',
      fr: 'DEMANDER UN DEVIS',
      it: 'RICHIEDI UN PREVENTIVO',
      pt: 'SOLICITAR ORÇAMENTO'
    },
    ctaServices: {
      es: 'VER SERVICIOS',
      de: 'DIENSTE ANSEHEN',
      en: 'VIEW SERVICES',
      fr: 'VOIR LES SERVICES',
      it: 'VEDI SERVIZI',
      pt: 'VER SERVIÇOS'
    },
    // Trust tag line below hero buttons
    trustTags: [
      { key: 'guarantee', es: 'Garantía 100% por escrito', de: '100% schriftliche Garantie', en: '100% written guarantee', fr: 'Garantie 100% par écrit', it: 'Garanzia 100% scritta', pt: 'Garantia 100% por escrito' },
      { key: 'insurance', es: 'Seguro CHF 10M', de: 'Haftpflicht CHF 10M', en: 'Liability CHF 10M', fr: 'Responsabilité CHF 10M', it: 'Responsabilità CHF 10M', pt: 'Responsabilidade CHF 10M' },
      { key: 'compliance', es: 'Cumplimiento GAV', de: 'GAV-Einhaltung', en: 'GAV compliance', fr: 'Conformité CCT', it: 'Conformità CCL', pt: 'Conformidade CCT' },
      { key: 'exp', es: '11+ años de experiencia', de: '11+ Jahre Erfahrung', en: '11+ years experience', fr: '11+ ans d’expérience', it: '11+ anni di esperienza', pt: '11+ anos de experiência' },
      { key: 'booking', es: 'Reserva en 48h', de: 'Buchung in 48h', en: 'Book in 48h', fr: 'Réservation en 48h', it: 'Prenotazione in 48h', pt: 'Reserva em 48h' },
      { key: 'rating', es: '4.9 Google', de: '4.9 Google', en: '4.9 Google', fr: '4.9 Google', it: '4.9 Google', pt: '4.9 Google' }
    ],
    // Calculator dictionary
    calc: {
      title: { es: 'Construye tu presupuesto', de: 'Budget kalkulieren', en: 'Build your quote', fr: 'Calculez votre devis', it: 'Calcola il tuo preventivo', pt: 'Calcule o seu orçamento' },
      pill: { es: 'EN 2 MINUTOS', de: 'IN 2 MINUTEN', en: 'IN 2 MINUTES', fr: 'EN 2 MINUTES', it: 'IN 2 MINUTI', pt: 'EM 2 MINUTOS' },
      step1: { es: 'Tipo de servicio', de: 'Service-Typ', en: 'Service type', fr: 'Type de service', it: 'Tipo di servizio', pt: 'Tipo de serviço' },
      step2: { es: 'Detalles', de: 'Details', en: 'Details', fr: 'Détails', it: 'Dettagli', pt: 'Detalhes' },
      step3: { es: 'Extras', de: 'Extras', en: 'Extras', fr: 'Extras', it: 'Extra', pt: 'Extras' },
      step4: { es: 'Resumen', de: 'Zusammenfassung', en: 'Summary', fr: 'Résumé', it: 'Riepilogo', pt: 'Resumo' },
      q1: { es: '¿Qué servicio necesitas?', de: 'Welchen Service benötigen Sie?', en: 'Which service do you need?', fr: 'Quel service désirez-vous ?', it: 'Quale servizio ti serve?', pt: 'De qual serviço você precisa?' },
      q2: { es: '¿Dónde se realizará el servicio?', de: 'Wo soll der Service stattfinden?', en: 'Where will the service take place?', fr: 'Où se déroulera le service ?', it: 'Dove si terrà il servizio?', pt: 'Onde o serviço será realizado?' },
      btn: { es: 'SIGUIENTE PASO', de: 'NÄCHSTER SCHRITT', en: 'NEXT STEP', fr: 'ÉTAPE SUIVANTE', it: 'PROSSIMO PASSO', pt: 'PRÓXIMO PASSO' }
    },
    // Trust bar dictionary
    trustBar: {
      clientsNum: { es: '+2.500 clientes', de: '+2.500 Kunden', en: '+2,500 clients', fr: '+2 500 clients', it: '+2.500 clienti', pt: '+2.500 clientes' },
      clientsSub: { es: 'confían en Kraken PFM', de: 'vertrauen Kraken PFM', en: 'trust Kraken PFM', fr: 'font confiance à Kraken PFM', it: 'si fidano di Kraken PFM', pt: 'confiam na Kraken PFM' },
      reviewsNum: { es: '4.9/5 en Google', de: '4.9/5 bei Google', en: '4.9/5 on Google', fr: '4.9/5 sur Google', it: '4.9/5 su Google', pt: '4.9/5 no Google' },
      reviewsSub: { es: 'Reseñas verificadas', de: 'Verifizierte Bewertungen', en: 'Verified reviews', fr: 'Avis vérifiés', it: 'Recensioni verificate', pt: 'Avaliações verificadas' },
      flexibleNum: { es: 'Respuesta en 48h', de: 'Antwort in 48h', en: 'Response in 48h', fr: 'Réponse en 48h', it: 'Risposta in 48h', pt: 'Resposta em 48h' },
      flexibleSub: { es: 'Reserva rápida y flexible', de: 'Schnelle & flexible Buchung', en: 'Fast & flexible booking', fr: 'Réservation rapide & flexible', it: 'Prenotazione rapida e flessibile', pt: 'Reserva rápida e flexível' },
      pdfNum: { es: 'Presupuesto en PDF', de: 'Offerte als PDF', en: 'PDF Quote', fr: 'Devis en PDF', it: 'Preventivo in PDF', pt: 'Orçamento em PDF' },
      pdfSub: { es: 'Claro y sin compromiso', de: 'Klar und unverbindlich', en: 'Clear and non-binding', fr: 'Clair et sans engagement', it: 'Chiaro e senza impegno', pt: 'Claro e sem compromisso' }
    },
    readMore: {
      es: 'Ver más',
      de: 'Mehr erfahren',
      en: 'Read more',
      fr: 'Savoir plus',
      it: 'Scopri di più',
      pt: 'Saber mais'
    },
    letKrakenHandle: {
      es: 'PÁSENOS LA CARGA',
      de: 'LASSEN SIE KRAKEN DAS ERLEDIGEN',
      en: 'LET KRAKEN HANDLE IT',
      fr: 'LAISSEZ KRAKEN S’EN OCCUPER',
      it: 'LASCIA FARE A KRAKEN',
      pt: 'DEIXE O KRAKEN CUIDAR DISSO'
    },
    // Our services
    ourServices: {
      badge: { es: 'NUESTROS SERVICIOS', de: 'UNSERE DIENSTE', en: 'OUR SERVICES', fr: 'NOS SERVICES', it: 'I NOSTRI SERVIZI', pt: 'NOSSOS SERVIÇOS' },
      title: { es: 'Soluciones para cada necesidad', de: 'Lösungen für jeden Bedarf', en: 'Solutions for every need', fr: 'Des solutions pour chaque besoin', it: 'Soluzioni per ogni esigenza', pt: 'Soluções para cada necessidade' },
      desc: { es: 'Servicios modulares combinables. Calidad suiza garantizada.', de: 'Kombinierbare modulare Services. Schweizer Qualität garantiert.', en: 'Combinable modular services. Swiss quality guaranteed.', fr: 'Services modulaires combinables. Qualité suisse garantie.', it: 'Servizi modulari combinabili. Qualità svizzera garantita.', pt: 'Serviços modulares combináveis. Qualidade suíça garantida.' },
      btn: { es: 'VER TODOS LOS SERVICIOS', de: 'ALLE DIENSTE ANSEHEN', en: 'VIEW ALL SERVICES', fr: 'VOIR TOUS LES SERVICES', it: 'VEDI TUTTI I SERVIZI', pt: 'VER TODOS OS SERVIÇOS' }
    },
    // Process "En 4 pasos simples"
    process: {
      badge: { es: 'ASÍ DE FÁCIL', de: 'SO EINFACH', en: 'AS EASY AS THIS', fr: 'AUSSI SIMPLE QUE ÇA', it: 'COSÌ FACILE', pt: 'TÃO FÁCIL ASSIM' },
      title: { es: 'En 4 pasos simples', de: 'In 4 einfachen Schritten', en: 'In 4 simple steps', fr: 'En 4 étapes simples', it: 'In 4 semplici passaggi', pt: 'Em 4 passos simples' },
      desc: { es: 'Rápido, transparente y sin compromiso.', de: 'Schnell, transparent und unverbindlich.', en: 'Fast, transparent, and non-binding.', fr: 'Rapide, transparent et sans engagement.', it: 'Rapido, trasparente e senza impegno.', pt: 'Rápido, transparente e sem compromisso.' },
      step1Title: { es: 'Cuéntanos qué necesitas', de: 'Teilen Sie uns Ihren Bedarf mit', en: 'Tell us what you need', fr: 'Dites-nous ce dont vous avez besoin', it: 'Dicci di cosa hai bisogno', pt: 'Diga-nos do que precisa' },
      step1Desc: { es: 'Selecciona el servicio y cuéntanos los detalles de tu propiedad.', de: 'Wählen Sie den Service und teilen Sie uns die Details der Immobilie mit.', en: 'Select the service and tell us the details of your property.', fr: 'Sélectionnez le service et donnez-nous les détails de votre propriété.', it: 'Seleziona il servizio e fornici i dettagli del tuo immobile.', pt: 'Selecione o serviço e forneça os detalhes do seu imóvel.' },
      step2Title: { es: 'Recibe tu presupuesto', de: 'Angebot erhalten', en: 'Get your quote', fr: 'Recevez votre devis', it: 'Ricevi il tuo preventivo', pt: 'Receba o seu orçamento' },
      step2Desc: { es: 'Te enviamos una propuesta clara en menos de 48 horas.', de: 'Wir senden Ihnen innerhalb von 48 Stunden ein klares Angebot.', en: 'We send you a clear proposal in less than 48 hours.', fr: 'Nous vous envoyons une proposition claire en moins de 48 heures.', it: 'Ti invieremo una proposta chiara in meno de 48 ore.', pt: 'Enviamos uma proposta clara em menos de 48 horas.' },
      step3Title: { es: 'Confirmas y agendamos', de: 'Bestätigen & Planen', en: 'Confirm & Schedule', fr: 'Confirmez et planifiez', it: 'Conferma e programma', pt: 'Confirme e agende' },
      step3Desc: { es: 'Eliges fecha y hora. Nos adaptamos a tu disponibilidad.', de: 'Sie wählen Datum und Uhrzeit. Wir passen uns Ihrer Verfügbarkeit an.', en: 'You choose the date and time. We adapt to your availability.', fr: 'Vous choisissez la date et l’heure. Nous nous adaptons à votre disponibilité.', it: 'Scegli la data e l’ora. Ci adattiamo alla tua disponibilità.', pt: 'Você escolhe a data e hora. Adaptamo-nos à sua disponibilidade.' },
      step4Title: { es: 'Realizamos el servicio', de: 'Durchführung des Services', en: 'We perform the service', fr: 'Nous réalisons le service', it: 'Eseguiamo il servizio', pt: 'Realizamos o serviço' },
      step4Desc: { es: 'Profesionales verificados y garantía 100% por escrito.', de: 'Geprüfte Fachkräfte und 100% schriftliche Garantie.', en: 'Verified professionals and 100% written guarantee.', fr: 'Professionnels vérifiés et garantie 100% écrite.', it: 'Professionisti verificati e garanzia scritta al 100%.', pt: 'Profissionais verificados e garantia de 100% por escrito.' }
    },
    // Comparison Why Kraken
    why: {
      badge: { es: '¿POR QUÉ KRAKEN?', de: 'WARUM KRAKEN?', en: 'WHY KRAKEN?', fr: 'POURQUOI KRAKEN ?', it: 'PERCHÉ KRAKEN?', pt: 'PORQUÊ KRAKEN?' },
      title: { es: 'Más que limpieza. Tranquilidad.', de: 'Mehr als Reinigung. Gelassenheit.', en: 'More than cleaning. Peace of mind.', fr: 'Plus que du nettoyage. La tranquillité d’esprit.', it: 'Più che pulizia. Tranquillità.', pt: 'Mais do que limpeza. Tranquilidade.' },
      desc: { es: 'Profesionales verificados, procesos estandarizados y garantía por escrito.', de: 'Geprüfte Fachkräfte, standardisierte Prozesse und schriftliche Garantie.', en: 'Verified professionals, standardized processes, and written guarantee.', fr: 'Professionnels vérifiés, processus standardisés et garantie écrite.', it: 'Professionisti verificati, processi standardizzati e garanzia scritta.', pt: 'Profissionais verificados, processos padronizados e garantia por escrito.' },
      bullet1: { es: 'Personal propio, capacitado y asegurado', de: 'Eigenes, geschultes und versichertes Personal', en: 'Own, trained, and fully insured staff', fr: 'Personnel propre, formé et entièrement assuré', it: 'Personale proprio, formato e completamente assicurato', pt: 'Pessoal próprio, treinado e totalmente segurado' },
      bullet2: { es: 'Protocolos suizos y cumplimiento GAV', de: 'Schweizer Protokolle und GAV-Einhaltung', en: 'Swiss protocols and GAV compliance', fr: 'Protocoles suisses et conformité CCT', it: 'Protocolli svizzeri e conformità CCL', pt: 'Protocolos suíços e conformidade CCT' },
      bullet3: { es: 'Productos profesionales y ecológicos', de: 'Professionelle und umweltfreundliche Produkte', en: 'Professional and eco-friendly products', fr: 'Produits professionnels et écologiques', it: 'Prodotti professionali ed ecologici', pt: 'Produtos profissionais e ecológicos' },
      bullet4: { es: 'Seguro de responsabilidad CHF 10M', de: 'Haftpflichtversicherung CHF 10M', en: 'Liability insurance CHF 10M', fr: 'Assurance responsabilité civile de CHF 10M', it: 'Assicurazione responsabilità civile CHF 10M', pt: 'Seguro de responsabilidade civil de CHF 10M' },
      bullet5: { es: 'Garantía 100% por escrito', de: '100% schriftliche Garantie', en: '100% written guarantee', fr: 'Garantie 100% par écrit', it: 'Garanzia scritta al 100%', pt: 'Garantia de 100% por escrito' },
      bullet6: { es: 'Atención rápida y cercana', de: 'Schneller und persönlicher Kundenservice', en: 'Fast and close customer support', fr: 'Service client rapide et chaleureux', it: 'Supporto clienti rapido e amichevole', pt: 'Suporte ao cliente rápido e próximo' },
      // Table Header
      colFeatures: { es: 'Características', de: 'Eigenschaften', en: 'Features', fr: 'Caractéristiques', it: 'Caratteristiche', pt: 'Características' },
      colKraken: { es: 'Kraken PFM', de: 'Kraken PFM', en: 'Kraken PFM', fr: 'Kraken PFM', it: 'Kraken PFM', pt: 'Kraken PFM' },
      colIndependent: { es: 'Limpieza independiente', de: 'Selbstständige Reinigung', en: 'Independent cleaning', fr: 'Nettoyage indépendant', it: 'Pulizia indipendente', pt: 'Limpeza independente' },
      colPlatforms: { es: 'Plataformas genéricas', de: 'Generische Plattformen', en: 'Generic platforms', fr: 'Plateformes génériques', it: 'Piattaforme generiche', pt: 'Plataformas genéricas' },
      // Row 1
      row1Label: { es: 'Personal asegurado y verificado', de: 'Versichertes & geprüftes Personal', en: 'Insured & verified staff', fr: 'Personnel assuré et vérifié', it: 'Personale assicurato e verificato', pt: 'Pessoal segurado e verificado' },
      row1ValInd: { es: 'Variable', de: 'Variabel', en: 'Variable', fr: 'Variable', it: 'Variabile', pt: 'Variável' },
      row1ValPlat: { es: 'Variable', de: 'Variabel', en: 'Variable', fr: 'Variable', it: 'Variabile', pt: 'Variável' },
      // Row 2
      row2Label: { es: 'Garantía por escrito', de: 'Schriftliche Garantie', en: 'Written guarantee', fr: 'Garantie écrite', it: 'Garanzia scritta', pt: 'Garantia por escrito' },
      row2ValInd: { es: 'No siempre', de: 'Nicht immer', en: 'Not always', fr: 'Pas toujours', it: 'Non sempre', pt: 'Nem sempre' },
      row2ValPlat: { es: 'No', de: 'Nein', en: 'No', fr: 'Non', it: 'No', pt: 'Não' },
      // Row 3
      row3Label: { es: 'Seguro de responsabilidad', de: 'Haftpflichtversicherung', en: 'Liability insurance', fr: 'Assurance responsabilité civile', it: 'Assicurazione responsabilità', pt: 'Seguro de responsabilidade' },
      row3ValInd: { es: 'Limitado', de: 'Begrenzt', en: 'Limited', fr: 'Limité', it: 'Limitato', pt: 'Limitado' },
      row3ValPlat: { es: 'Limitado', de: 'Begrenzt', en: 'Limited', fr: 'Limité', it: 'Limitato', pt: 'Limitado' },
      // Row 4
      row4Label: { es: 'Cumplimiento GAV', de: 'GAV-Einhaltung', en: 'GAV compliance', fr: 'Conformité CCT', it: 'Conformità CCL', pt: 'Conformidade CCT' },
      row4ValInd: { es: 'No', de: 'Nein', en: 'No', fr: 'Non', it: 'No', pt: 'Não' },
      row4ValPlat: { es: 'No', de: 'Nein', en: 'No', fr: 'Non', it: 'No', pt: 'Não' },
      // Row 5
      row5Label: { es: 'Productos profesionales', de: 'Professionelle Produkte', en: 'Professional products', fr: 'Produits professionnels', it: 'Prodotti professionali', pt: 'Produtos profissionais' },
      row5ValInd: { es: 'A veces', de: 'Manchmal', en: 'Sometimes', fr: 'Parfois', it: 'A volte', pt: 'Às vezes' },
      row5ValPlat: { es: 'A veces', de: 'Manchmal', en: 'Sometimes', fr: 'Parfois', it: 'A volte', pt: 'Às vezes' },
      // Row 6
      row6Label: { es: 'Atención y respuesta', de: 'Betreuung & Antwort', en: 'Support & response', fr: 'Support & réponse', it: 'Supporto e risposta', pt: 'Suporte e resposta' },
      row6ValInd: { es: '2–5 días', de: '2–5 Tage', en: '2–5 days', fr: '2–5 jours', it: '2-5 giorni', pt: '2–5 dias' },
      row6ValPlat: { es: '3–7 días', de: '3–7 Tage', en: '3–7 days', fr: '3–7 jours', it: '3-7 giorni', pt: '3–7 dias' },
      row6ValKraken: { es: 'En 48h', de: 'In 48 Std.', en: 'In 48h', fr: 'En 48h', it: 'In 48h', pt: 'Em 48h' }
    },
    // Testimonials
    testimonials: {
      badge: { es: 'LO QUE DICEN NUESTROS CLIENTES', de: 'WAS UNSERE KUNDEN SAGEN', en: 'WHAT OUR CLIENTS SAY', fr: 'CE QUE DISENT NOS CLIENTS', it: 'COSA DICONO I NOSTRI CLIENTI', pt: 'O QUE OS NOSSOS CLIENTES DIZEM' },
      title: { es: 'Confianza que se construye', de: 'Vertrauen, das verbindet', en: 'Trust that is built', fr: 'Une confiance qui se construit', it: 'Fiducia che si costruisce', pt: 'Confiança que se constrói' },
      desc: { es: 'Resultados que se recomiendan.', de: 'Ergebnisse, die sich empfehlen.', en: 'Recommended results.', fr: 'Des résultats recommandés.', it: 'Risultati raccomandati.', pt: 'Resultados recomendados.' }
    },
    // Bottom banner CTA
    bottomCta: {
      badge: { es: '¿LISTO PARA EMPEZAR?', de: 'BEREIT ZU STARTEN?', en: 'READY TO START?', fr: 'PRÊT À COMMENCER ?', it: 'PRONTO PER INIZIARE?', pt: 'PRONTO PARA COMEÇAR?' },
      title: { es: 'Tu presupuesto, gratis y sin compromiso', de: 'Ihre Offerte, kostenlos und unverbindlich', en: 'Your quote, free and non-binding', fr: 'Votre devis, gratuit et sans engagement', it: 'Il tuo preventivo, gratuito e senza impegno', pt: 'O seu orçamento, gratuito e sem compromisso' },
      desc: { es: 'Te respondemos en menos de 48 horas y te ayudamos a elegir la mejor opción.', de: 'Wir antworten in weniger als 48 Stunden und helfen Ihnen bei der Auswahl.', en: 'We reply in less than 48 hours and help you choose the best option.', fr: 'Nous vous répondons en moins de 48 heures et vous aidons à choisir la meilleure option.', it: 'Rispondiamo in meno di 48 ore e ti aiutiamo a scegliere l’opzione migliore.', pt: 'Respondemos em menos de 48 horas e ajudamos você a escolher a melhor opção.' },
      whatsapp: { es: 'HABLAR POR WHATSAPP', de: 'MIT WHATSAPP SPRECHEN', en: 'TALK ON WHATSAPP', fr: 'PARLER SUR WHATSAPP', it: 'PARLA SU WHATSAPP', pt: 'CONVERSAR NO WHATSAPP' },
      bullet1: { es: 'Sin tarjeta de crédito', de: 'Keine Kreditkarte', en: 'No credit card', fr: 'Sans carte de crédit', it: 'Senza carta di credito', pt: 'Sem cartão de crédito' },
      bullet2: { es: 'Sin compromiso', de: 'Unverbindlich', en: 'Non-binding', fr: 'Sans engagement', it: 'Senza impegno', pt: 'Sem compromisso' }
    }
  };

  const getL = (obj: any): string => {
    let langKey = language as string;
    if (langKey === 'de-CH') langKey = 'de';
    return obj[langKey] || obj['en'] || '';
  };

  // Card items mapped
  const serviceCards = [
    {
      id: 'end-of-tenancy',
      title: {
        es: 'Limpieza de Fin de Contrato',
        de: 'Umzugsreinigung',
        en: 'End of Tenancy Cleaning',
        fr: 'Nettoyage de Fin de Bail',
        it: 'Pulizia di Fine Locazione',
        pt: 'Limpeza de Fim de Contrato'
      },
      desc: {
        es: 'Entrega impecable garantizada. Incluye protocolo y garantía.',
        de: 'Makellose Übergabe garantiert. Inklusive Abgabegarantie.',
        en: 'Flawless handover guaranteed. Includes handover warranty.',
        fr: 'Remise de bail impeccable garantie. Garantie de remise incluse.',
        it: 'Riconsegna impeccabile garantita. Include la garanzia di consegna.',
        pt: 'Entrega impecável garantida. Inclui garantia de entrega.'
      },
      price: {
        es: 'Desde 550 CHF',
        de: 'Ab 550 CHF',
        en: 'From 550 CHF',
        fr: 'Dès 550 CHF',
        it: 'Da 550 CHF',
        pt: 'A partir de 550 CHF'
      },
      icon: <Key className="w-5 h-5 text-white" />,
      imageUrl: 'https://www.dropbox.com/scl/fi/cylyo5ytzkmj4znb6o5xa/servicio-privado-limpieza-apartamento.webp?rlkey=05qwqg9i2v625pu4l8zewc9mo&st=xk7ablnv&raw=1'
    },
    {
      id: 'deep-cleaning',
      title: {
        es: 'Limpieza Profunda',
        de: 'Tiefenreinigung',
        en: 'Deep Cleaning',
        fr: 'Nettoyage en Profondeur',
        it: 'Pulizia Profonda',
        pt: 'Limpeza Profunda'
      },
      desc: {
        es: 'Limpieza a fondo para renovaciones o primeras ocupaciones.',
        de: 'Gründliche Reinigung für Renovierungen oder Erstbezug.',
        en: 'Thorough cleaning for renovations or initial occupancies.',
        fr: 'Nettoyage minutieux pour rénovations ou premiers emménagements.',
        it: 'Pulizia accurata per ristrutturazioni o primi ingressi.',
        pt: 'Limpeza completa para reformas ou primeiras ocupações.'
      },
      price: {
        es: 'Desde 320 CHF',
        de: 'Ab 320 CHF',
        en: 'From 320 CHF',
        fr: 'Dès 320 CHF',
        it: 'Da 320 CHF',
        pt: 'A partir de 320 CHF'
      },
      icon: <Sparkles className="w-5 h-5 text-white" />,
      imageUrl: 'https://www.dropbox.com/scl/fi/59bzz6p4e7r2eiy83bzin/servicio-privado-limpieza-cocina.webp?rlkey=2fwi4lpzcuopld7js0kdadgok&st=bu3p7in6&raw=1'
    },
    {
      id: 'daily-cleaning',
      title: {
        es: 'Limpieza Recurrente',
        de: 'Unterhaltsreinigung',
        en: 'Recurring Cleaning',
        fr: 'Nettoyage Régulier',
        it: 'Pulizia Ricorrente',
        pt: 'Limpeza Recorrente'
      },
      desc: {
        es: 'Planes semanales, quincenales o mensuales adaptados a ti.',
        de: 'Wöchentliche, zweiwöchentliche oder monatliche Pläne.',
        en: 'Weekly, bi-weekly, or monthly plans tailored to your needs.',
        fr: 'Formules hebdomadaires, bimensuelles ou mensuelles sur mesure.',
        it: 'Piani settimanali, bisettimanali o mensili su misura.',
        pt: 'Planos semanais, quinzenais ou mensais sob medida.'
      },
      price: {
        es: 'Desde 85 CHF / mes',
        de: 'Ab 85 CHF / Monat',
        en: 'From 85 CHF / month',
        fr: 'Dès 85 CHF / mois',
        it: 'Da 85 CHF / mese',
        pt: 'A partir de 85 CHF / mês'
      },
      icon: <Calendar className="w-5 h-5 text-white" />,
      imageUrl: 'https://www.dropbox.com/scl/fi/h0mvnnlclm631kn5zxqnh/servicio-privado-limpieza-oficina-casa.webp?rlkey=9b3nvjjm1syt3d9r86qt6jtx4&st=4nt8efqc&raw=1'
    },
    {
      id: 'moving-furniture',
      title: {
        es: 'Mudanzas & Transporte',
        de: 'Umzüge & Transport',
        en: 'Moving & Transport',
        fr: 'Déménagement & Transport',
        it: 'Traslochi e Trasporti',
        pt: 'Mudanças e Transporte'
      },
      desc: {
        es: 'Transporte seguro con personal capacitado y vehículo propio.',
        de: 'Sicherer Transport mit geschultem Personal & eigenem Fahrzeug.',
        en: 'Secure transport with trained staff and own modern vehicle.',
        fr: 'Transport sécurisé avec personnel qualifié et véhicule moderne propre.',
        it: 'Trasporto sicuro con personale qualificato e veicolo moderno.',
        pt: 'Transporte seguro com pessoal treinado e veículo moderno próprio.'
      },
      price: {
        es: 'Desde 145 CHF',
        de: 'Ab 145 CHF',
        en: 'From 145 CHF',
        fr: 'Dès 145 CHF',
        it: 'Da 145 CHF',
        pt: 'A partir de 145 CHF'
      },
      icon: <Truck className="w-5 h-5 text-white" />,
      imageUrl: 'https://www.dropbox.com/scl/fi/vaw5n8iqx3r42f3co5qir/servicio-privado-mudanza-cajas.webp?rlkey=ogss3ftloq89pknwq5hixihxu&st=7d1jd2im&raw=1'
    },
    {
      id: 'car-detailing',
      title: {
        es: 'Car Detailing',
        de: 'Fahrzeugaufbereitung',
        en: 'Car Detailing',
        fr: 'Esthétique Automobile',
        it: 'Dettaglio Auto (Car Detailing)',
        pt: 'Estética Automotiva'
      },
      desc: {
        es: 'Limpieza interior y exterior profesional para tu vehículo.',
        de: 'Professionelle Innen- und Aussenreinigung für Ihr Fahrzeug.',
        en: 'Professional interior and exterior cleaning for your vehicle.',
        fr: 'Nettoyage professionnel de l’intérieur et de l’extérieur de votre véhicule.',
        it: 'Pulizia professionale interna ed esterna del tuo veicolo.',
        pt: 'Limpeza profissional interna e externa para o seu veículo.'
      },
      price: {
        es: 'Desde 140 CHF',
        de: 'Ab 140 CHF',
        en: 'From 140 CHF',
        fr: 'Dès 140 CHF',
        it: 'Da 140 CHF',
        pt: 'A partir de 140 CHF'
      },
      icon: <Car className="w-5 h-5 text-white" />,
      imageUrl: 'https://www.dropbox.com/scl/fi/5o1s20a1gbnpkweux0yio/servicio-privado-lavado-coche.webp?rlkey=lmlin1t29zbx5fqwte24kpvkt&st=cx497a9l&raw=1'
    },
    {
      id: 'gardening',
      title: {
        es: 'Jardinería',
        de: 'Gartenpflege',
        en: 'Gardening & Care',
        fr: 'Jardinage & Entretien',
        it: 'Giardinaggio e Cura',
        pt: 'Jardinagem e Cuidados'
      },
      desc: {
        es: 'Mantenimiento de jardines, poda y cuidado de áreas verdes.',
        de: 'Gartenpflege, Rückschnitt und Pflege von Grünflächen.',
        en: 'Garden maintenance, pruning, and green area care.',
        fr: 'Entretien de jardin, taille et soin des espaces verts.',
        it: 'Manutenzione del giardino, potatura e cura delle aree verdi.',
        pt: 'Manutenção de jardins, poda e cuidados com áreas verdes.'
      },
      price: {
        es: 'Desde 80 CHF / h',
        de: 'Ab 80 CHF / Std.',
        en: 'From 80 CHF / h',
        fr: 'Dès 80 CHF / h',
        it: 'Da 80 CHF / h',
        pt: 'A partir de 80 CHF / h'
      },
      icon: <Leaf className="w-5 h-5 text-white" />,
      imageUrl: 'https://www.dropbox.com/scl/fi/xkpuoqlnlukig2tk4dokm/servicio-privado-jardineria.webp?rlkey=ook2125yt3u6p04izvaak8ei2&st=fnadpn2e&raw=1'
    },
    {
      id: 'exterior-cleaning',
      title: {
        es: 'Limpieza Exterior',
        de: 'Aussenreinigung',
        en: 'Exterior Cleaning',
        fr: 'Nettoyage Extérieur',
        it: 'Pulizia Esterna',
        pt: 'Limpeza de Exteriores'
      },
      desc: {
        es: 'Fachadas, terrazas, entradas y superficies exteriores.',
        de: 'Fassaden, Terrassen, Eingänge und Aussenflächen.',
        en: 'Facades, terraces, entrances, and exterior surfaces.',
        fr: 'Façades, terrasses, entrées et surfaces extérieures.',
        it: 'Facciate, terrazze, ingressi e superfici esterne.',
        pt: 'Fachadas, terraços, entradas e superfícies exteriores.'
      },
      price: {
        es: 'Desde 90 CHF / h',
        de: 'Ab 90 CHF / Std.',
        en: 'From 90 CHF / h',
        fr: 'Dès 90 CHF / h',
        it: 'Da 90 CHF / h',
        pt: 'A partir de 90 CHF / h'
      },
      icon: <Droplet className="w-5 h-5 text-white" />,
      imageUrl: 'https://www.dropbox.com/scl/fi/s584iq3w3ton5cpfoz92s/servicio-privado-limpieza-exterior.webp?rlkey=4uzfn7m99h3os1gl8sbnxiqg2&st=67943x7s&raw=1'
    },
    {
      id: 'pest-control',
      title: {
        es: 'Control de Plagas',
        de: 'Schädlingsbekämpfung',
        en: 'Pest Control',
        fr: 'Contrôle des Nuisibles',
        it: 'Controllo Infestanti',
        pt: 'Controle de Pragas'
      },
      desc: {
        es: 'Tratamientos seguros y efectivos con garantía.',
        de: 'Sichere und wirksame Behandlungen mit Garantie.',
        en: 'Safe and highly effective treatments with warranty.',
        fr: 'Traitements sûrs et efficaces avec garantie.',
        it: 'Trattamenti sicuri ed efficaci con garanzia.',
        pt: 'Tratamentos seguros e eficazes com garantia.'
      },
      price: {
        es: 'Desde 130 CHF',
        de: 'Ab 130 CHF',
        en: 'From 130 CHF',
        fr: 'Dès 130 CHF',
        it: 'Da 130 CHF',
        pt: 'A partir de 130 CHF'
      },
      icon: <Bug className="w-5 h-5 text-white" />,
      imageUrl: '/servicio-privado-control-plagas.webp'
    },
    {
      id: 'waste-management',
      title: {
        es: 'Gestión de Residuos',
        de: 'Entsorgung & Räumung',
        en: 'Waste Management',
        fr: 'Gestion des Déchets',
        it: 'Smaltimento Rifiuti',
        pt: 'Gestão de Resíduos'
      },
      desc: {
        es: 'Retiro y gestión responsable de residuos y escombros.',
        de: 'Verantwortungsvolle Entsorgung von Abfällen und Bauschutt.',
        en: 'Responsible removal and management of waste and debris.',
        fr: 'Élimination et gestion responsable des déchets et gravats.',
        it: 'Rimozione e gestione responsabile di rifiuti e detriti.',
        pt: 'Remoção e gestão responsável de resíduos e entulhos.'
      },
      price: {
        es: 'Desde 150 CHF',
        de: 'Ab 150 CHF',
        en: 'From 150 CHF',
        fr: 'Dès 150 CHF',
        it: 'Da 150 CHF',
        pt: 'A partir de 150 CHF'
      },
      icon: <Trash2 className="w-5 h-5 text-white" />,
      imageUrl: '/servicio-privado-residuos-desalojo.webp'
    },
    {
      id: 'gutter-cleaning',
      title: {
        es: 'Limpieza de Canalones',
        de: 'Dachrinnenreinigung',
        en: 'Gutter Cleaning',
        fr: 'Nettoyage des Gouttières',
        it: 'Pulizia Grondaie',
        pt: 'Limpeza de Algerozes'
      },
      desc: {
        es: 'Prevención de obstrucciones y daños por agua.',
        de: 'Vorbeugung von Verstopfungen und Wasserschäden.',
        en: 'Prevention of clogs and severe water damage.',
        fr: 'Prévention des obstructions et des graves dégâts des eaux.',
        it: 'Prevenzione di intasamenti e gravi danni da acqua.',
        pt: 'Prevenção de entupimentos e graves danos causados pela água.'
      },
      price: {
        es: 'Desde 120 CHF',
        de: 'Ab 120 CHF',
        en: 'From 120 CHF',
        fr: 'Dès 120 CHF',
        it: 'Da 120 CHF',
        pt: 'A partir de 120 CHF'
      },
      icon: <ShieldAlert className="w-5 h-5 text-white" />,
      imageUrl: '/servicio-privado-canalones.webp'
    }
  ];

  const clientTestimonials = [
    {
      name: 'Sophie M.',
      location: 'Wiedikon, Zürich',
      text: {
        es: 'Excelente servicio de fin de contrato. El apartamento quedó impecable y la agencia quedó muy satisfecha.',
        de: 'Hervorragender Umzugsreinigungsservice. Die Wohnung war makellos und die Verwaltung war sehr zufrieden.',
        en: 'Excellent end of tenancy service. The apartment was spotless and the agency was extremely satisfied.',
        fr: 'Excellent service de fin de bail. L’appartement était impeccable et la régie a été extrêmement satisfaite.',
        it: 'Eccellente servizio di fine locazione. L’appartamento era impeccabile e l’agenzia è rimasta estremamente soddisfatta.',
        pt: 'Excelente serviço de fim de contrato. O apartamento ficou impecável e a imobiliária ficou extremamente satisfeita.'
      },
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
    },
    {
      name: 'Marco B.',
      location: 'Altstetten, Zürich',
      text: {
        es: 'Muy profesionales y puntuales. El equipo de Kraken superó nuestras expectativas.',
        de: 'Sehr professionell und pünktlich. Das Kraken-Team hat unsere Erwartungen übertroffen.',
        en: 'Very professional and punctual. The Kraken team completely exceeded our expectations.',
        fr: 'Très professionnels et ponctuels. L’équipe de Kraken a complètement dépassé nos attentes.',
        it: 'Molto professionali e puntuali. Il team di Kraken ha superato di gran lunga le nostre aspettative.',
        pt: 'Muito profissionais e pontuais. A equipa da Kraken superou completamente as nossas expectativas.'
      },
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    },
    {
      name: 'Claudia R.',
      location: 'Seefeld, Zürich',
      text: {
        es: 'Contratamos limpieza recurrente para nuestra oficina. Todo siempre perfecto.',
        de: 'Wir haben eine regelmässige Reinigung für unser Büro gebucht. Alles immer perfekt.',
        en: 'We hired recurring cleaning for our office. Everything is always absolutely perfect.',
        fr: 'Nous avons engagé un service de nettoyage régulier pour notre bureau. Tout est toujours absolument parfait.',
        it: 'Abbiamo richiesto una pulizia ricorrente per il nostro ufficio. Tutto è sempre assolutamente perfetto.',
        pt: 'Contratámos limpeza recorrente para o nosso escritório. Tudo é sempre absolutamente perfeito.'
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    }
  ];

  // Map local calculator services to keys expected by ConsultationPage
  const handleCalculatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map selecting options
    let mappedService = 'daily-cleaning';
    if (selectedHeroService === 'moving') mappedService = 'moving';
    else if (selectedHeroService === 'gardening') mappedService = 'gardening';
    else if (selectedHeroService === 'pest-control') mappedService = 'pest-control';
    else if (selectedHeroService === 'exterior-cleaning') mappedService = 'exterior-cleaning';
    else if (selectedHeroService === 'waste-management') mappedService = 'waste-management';
    else mappedService = 'daily-cleaning'; // fallback/cleaning

    // Pre-save location to localStorage to auto-skip first step
    const localPostcode = '8001';
    const localCity = 'Zürich';
    
    // Set preselection
    localStorage.setItem('kraken_preselected_service', mappedService);
    
    const initialLocationData = {
      address: heroLocation,
      postcode: localPostcode,
      city: localCity,
      billingRegion: 'Zürich',
      rateMultiplier: 0
    };
    
    localStorage.setItem('kraken_consultation_data_v2', JSON.stringify(initialLocationData));
    
    // Navigate
    onNavigate('consultation');
  };

  const handleTestimonialPrev = () => {
    setActiveTestimonialIdx(prev => (prev - 1 + clientTestimonials.length) % clientTestimonials.length);
  };

  const handleTestimonialNext = () => {
    setActiveTestimonialIdx(prev => (prev + 1) % clientTestimonials.length);
  };

  return (
    <main className="bg-[#fcfdfd] min-h-screen selection:bg-blue-100 selection:text-blue-900 font-sans text-slate-900 overflow-hidden">
      
      {/* 1. HERO SECTION WITH EMBEDDED INTERACTIVE CALCULATOR */}
      <section data-header-theme="dark" className="relative pt-24 md:pt-36 pb-20 md:pb-36 bg-[#001D3D] text-white overflow-hidden">
        
        {/* Full-width background image coverage */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/imagen-01-google-ai.webp" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-transparent to-transparent z-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-10"></div>
        
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="max-w-4xl">
            
            {/* Left Column: Title and details */}
            <div className="flex flex-col text-left">
              <span className="inline-block self-start bg-blue-500/15 border border-blue-400/20 text-[#2196F3] text-[10px] font-black tracking-widest px-4 py-2 rounded-full mb-6">
                {getL(d.badge)}
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-white font-sans">
                {getL(d.title1)}{' '}
                <span className="text-[#007AFF]">{getConnector()}</span>
                <br />
                {getL(d.title2)}
                <br />
                {getL(d.title3)}
              </h1>
              
              <p className="text-[#007AFF] text-sm md:text-lg font-bold max-w-xl leading-relaxed mb-8">
                {getL(d.desc)}
              </p>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => onNavigate('consultation')}
                  className="bg-[#007AFF] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4.5 rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>{getL(d.ctaQuote)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#servicios-grid"
                  className="bg-white/5 border border-white/10 hover:border-white/30 text-white font-bold text-xs uppercase tracking-widest px-8 py-4.5 rounded-full transition-all flex items-center justify-center cursor-pointer"
                >
                  {getL(d.ctaServices)}
                </a>
              </div>
              
              {/* Trust Indicators below Hero */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 border-t border-white/10 pt-8">
                {d.trustTags.map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-blue-100/80">
                    <CheckCircle2 className="w-4 h-4 text-[#007AFF] flex-shrink-0" />
                    <span>{getL(tag)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FLOATING TRUST BAR OVERLAPPING HERO */}
      <section className="relative z-20 px-4 -mt-10 sm:-mt-12">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white border border-slate-100 rounded-[2.2rem] py-8 px-6 sm:px-10 shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 items-center">
            
            {/* Overlapping Faces & Clients */}
            <div className="flex items-center gap-4 border-b md:border-b-0 lg:border-r border-slate-100 pb-6 md:pb-0 lg:pr-6">
              <div className="flex -space-x-3.5 flex-shrink-0">
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Client 1" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Client 2" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" alt="Client 3" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-800 leading-tight">
                  {getL(d.trustBar.clientsNum)}
                </div>
                <div className="text-[10px] font-bold text-gray-400">
                  {getL(d.trustBar.clientsSub)}
                </div>
              </div>
            </div>
            
            {/* Google Rating */}
            <div className="flex items-center gap-3.5 border-b md:border-b-0 lg:border-r border-slate-100 pb-6 md:pb-0 lg:pr-6">
              <div className="flex flex-col flex-shrink-0 text-[#FFB300]">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-black text-slate-800 leading-tight">
                  {getL(d.trustBar.reviewsNum)}
                </div>
                <div className="text-[10px] font-bold text-gray-400">
                  {getL(d.trustBar.reviewsSub)}
                </div>
              </div>
            </div>
            
            {/* Support/Flexible booking */}
            <div className="flex items-center gap-3.5 border-b sm:border-b-0 lg:border-r border-slate-100 pb-6 sm:pb-0 lg:pr-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center flex-shrink-0">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-800 leading-tight">
                  {getL(d.trustBar.flexibleNum)}
                </div>
                <div className="text-[10px] font-bold text-gray-400">
                  {getL(d.trustBar.flexibleSub)}
                </div>
              </div>
            </div>
            
            {/* PDF Quote */}
            <div className="flex items-center gap-3.5 pl-0 lg:pl-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-800 leading-tight">
                  {getL(d.trustBar.pdfNum)}
                </div>
                <div className="text-[10px] font-bold text-gray-400">
                  {getL(d.trustBar.pdfSub)}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. "NUESTROS SERVICIOS" GRID OF 10 CARDS */}
      <section id="servicios-grid" className="py-24 md:py-32 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl text-left">
              <span className="text-[#007AFF] font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">
                {getL(d.ourServices.badge)}
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#001D3D] leading-tight">
                {getL(d.ourServices.title)}
              </h2>
              <p className="text-gray-500 text-sm md:text-base font-medium mt-2">
                {getL(d.ourServices.desc)}
              </p>
            </div>
            
            <button
              onClick={() => onNavigate('consultation')}
              className="bg-white border border-slate-200 hover:border-[#007AFF]/50 text-[#007AFF] text-xs font-black uppercase tracking-widest px-6 py-4 rounded-full transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <span>{getL(d.ourServices.btn)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Grid of 10 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {serviceCards.map((card, idx) => (
              <div 
                key={card.id}
                onClick={() => onNavigate(getServiceLinkForMunicipality(lastVisited, card.id))}
                className="group bg-white rounded-3xl border border-slate-100 hover:border-[#007AFF]/40 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
              >
                {/* Image container */}
                <div className="h-44 relative overflow-hidden bg-slate-50">
                  <img 
                    src={card.imageUrl} 
                    alt={getL(card.title)} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle black overlay to help price pop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Floating price badge */}
                  {getL(card.price) && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#007AFF] text-white text-[10px] font-black tracking-wider px-3 py-1.5 rounded-full shadow-md">
                        {getL(card.price)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content & Icon overlay */}
                <div className="p-6 pt-8 relative flex flex-col flex-grow text-left">
                  
                  {/* Floating Circular Icon */}
                  <div className="absolute -top-7 left-6 w-11 h-11 rounded-full bg-[#001D3D] border-4 border-white flex items-center justify-center shadow-md">
                    {card.icon}
                  </div>
                  
                  <h3 className="text-sm font-extrabold text-[#001D3D] mb-2 leading-snug group-hover:text-[#007AFF] transition-colors">
                    {getL(card.title)}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed flex-grow">
                    {getL(card.desc)}
                  </p>
                  
                  {/* Link "Ver más" */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(getServiceLinkForMunicipality(lastVisited, card.id));
                    }}
                    className="mt-6 inline-flex items-center gap-1 text-[10px] font-black text-[#007AFF] uppercase tracking-wider hover:underline text-left cursor-pointer"
                  >
                    <span>{getL(d.readMore)}</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. "ASÍ DE FÁCIL: EN 4 PASOS SIMPLES" SECTION */}
      <section className="py-24 md:py-32 bg-white relative">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Steps List */}
            <div className="lg:col-span-7 text-left">
              <span className="text-[#007AFF] font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">
                {getL(d.process.badge)}
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#001D3D] leading-tight mb-4">
                {getL(d.process.title)}
              </h2>
              <p className="text-gray-500 text-sm md:text-base font-medium mb-12">
                {getL(d.process.desc)}
              </p>
              
              <div className="relative space-y-8 pl-1">
                {/* Vertical Connector Line for Mobile */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>
                
                {[
                  { id: '01', title: d.process.step1Title, desc: d.process.step1Desc, icon: <ClipboardList className="w-5 h-5 text-[#007AFF]" /> },
                  { id: '02', title: d.process.step2Title, desc: d.process.step2Desc, icon: <FileText className="w-5 h-5 text-[#007AFF]" /> },
                  { id: '03', title: d.process.step3Title, desc: d.process.step3Desc, icon: <Calendar className="w-5 h-5 text-[#007AFF]" /> },
                  { id: '04', title: d.process.step4Title, desc: d.process.step4Desc, icon: <ShieldCheck className="w-5 h-5 text-[#007AFF]" /> }
                ].map((step, sIdx) => (
                  <div key={step.id} className="flex gap-6 relative z-10 group">
                    {/* Circle bubble with icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#007AFF] bg-blue-50 px-2 py-0.5 rounded-md">
                          {step.id}
                        </span>
                        <h3 className="text-base font-extrabold text-[#001D3D]">
                          {getL(step.title)}
                        </h3>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                        {getL(step.desc)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Col: Nice Visual Illustration featuring Mascot */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute -inset-4 bg-blue-50/40 rounded-[3rem] blur-2xl pointer-events-none"></div>
              
              <div className="relative rounded-[2.5rem] overflow-hidden bg-[#001D3D] shadow-2xl w-full max-w-md aspect-[4/5] group border border-white/10">
                <img 
                  src="/mascota-kraken-noche-zurich-home.webp" 
                  alt="Kraken Mascot" 
                  className="w-full h-full object-cover opacity-95 transition-transform duration-[2s] group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Inner gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#001D3D] via-[#001D3D]/20 to-transparent pointer-events-none"></div>

                {/* Swiss Certified Watermark */}
                <div className="absolute bottom-6 left-6 z-10 max-w-xs text-left">
                  <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white shadow-lg inline-flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black text-[#001D3D] uppercase tracking-wider">
                      {getL(d.letKrakenHandle)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </section>

      {/* 5. "¿POR QUÉ KRAKEN?: MÁS QUE LIMPIEZA. TRANQUILIDAD" WITH COMPARISON TABLE */}
      <section className="py-24 md:py-32 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#007AFF] font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">
              {getL(d.why.badge)}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#001D3D] leading-tight mb-4">
              {getL(d.why.title)}
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium">
              {getL(d.why.desc)}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left side: Mascot & checklist */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              
              {/* Checklist */}
              <div className="space-y-4 w-full max-w-md">
                {[
                  d.why.bullet1,
                  d.why.bullet2,
                  d.why.bullet3,
                  d.why.bullet4,
                  d.why.bullet5,
                  d.why.bullet6
                ].map((b, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-extrabold text-slate-700 bg-white p-3.5 rounded-2xl border border-slate-50 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>{getL(b)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side: High-contrast comparison table */}
            <div className="lg:col-span-7 w-full overflow-x-auto rounded-[2.2rem] border border-slate-100 bg-white shadow-xl p-4 sm:p-6">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 px-3 text-left text-[11px] font-black text-gray-400 uppercase tracking-wider w-1/3">
                      {getL(d.why.colFeatures)}
                    </th>
                    <th className="py-4 px-3 text-center text-[11px] font-black text-[#007AFF] uppercase tracking-wider bg-blue-50/50 rounded-t-2xl">
                      {getL(d.why.colKraken)}
                    </th>
                    <th className="py-4 px-3 text-center text-[11px] font-black text-gray-400 uppercase tracking-wider">
                      {getL(d.why.colIndependent)}
                    </th>
                    <th className="py-4 px-3 text-center text-[11px] font-black text-gray-400 uppercase tracking-wider">
                      {getL(d.why.colPlatforms)}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  
                  {/* Row 1 */}
                  <tr>
                    <td className="py-4 px-3 text-xs font-black text-slate-800">
                      {getL(d.why.row1Label)}
                    </td>
                    <td className="py-4 px-3 text-center bg-blue-50/50">
                      <CheckCircle2 className="w-5 h-5 text-[#007AFF] mx-auto fill-[#007AFF]/10" />
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row1ValInd)}
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row1ValPlat)}
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr>
                    <td className="py-4 px-3 text-xs font-black text-slate-800">
                      {getL(d.why.row2Label)}
                    </td>
                    <td className="py-4 px-3 text-center bg-blue-50/50">
                      <CheckCircle2 className="w-5 h-5 text-[#007AFF] mx-auto fill-[#007AFF]/10" />
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row2ValInd)}
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row2ValPlat)}
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr>
                    <td className="py-4 px-3 text-xs font-black text-slate-800">
                      {getL(d.why.row3Label)}
                    </td>
                    <td className="py-4 px-3 text-center bg-blue-50/50">
                      <span className="text-xs font-black text-[#007AFF] bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-100">
                        CHF 10M
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row3ValInd)}
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row3ValPlat)}
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr>
                    <td className="py-4 px-3 text-xs font-black text-slate-800">
                      {getL(d.why.row4Label)}
                    </td>
                    <td className="py-4 px-3 text-center bg-blue-50/50">
                      <CheckCircle2 className="w-5 h-5 text-[#007AFF] mx-auto fill-[#007AFF]/10" />
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row4ValInd)}
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row4ValPlat)}
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr>
                    <td className="py-4 px-3 text-xs font-black text-slate-800">
                      {getL(d.why.row5Label)}
                    </td>
                    <td className="py-4 px-3 text-center bg-blue-50/50">
                      <CheckCircle2 className="w-5 h-5 text-[#007AFF] mx-auto fill-[#007AFF]/10" />
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row5ValInd)}
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row5ValPlat)}
                    </td>
                  </tr>

                  {/* Row 6 */}
                  <tr>
                    <td className="py-4 px-3 text-xs font-black text-slate-800">
                      {getL(d.why.row6Label)}
                    </td>
                    <td className="py-4 px-3 text-center bg-blue-50/50 rounded-b-2xl">
                      <span className="text-xs font-black text-[#007AFF] bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-100">
                        {getL(d.why.row6ValKraken)}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row6ValInd)}
                    </td>
                    <td className="py-4 px-3 text-center text-xs font-bold text-slate-500">
                      {getL(d.why.row6ValPlat)}
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

          </div>
          
        </div>
      </section>

      {/* 6. LO QUE DICEN NUESTROS CLIENTES (TESTIMONIALS WITH SLIDER CONTROLS) */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl text-left">
              <span className="text-[#007AFF] font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">
                {getL(d.testimonials.badge)}
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#001D3D] leading-tight">
                {getL(d.testimonials.title)}
              </h2>
              <p className="text-gray-500 text-sm md:text-base font-medium mt-2">
                {getL(d.testimonials.desc)}
              </p>
            </div>
            
            {/* Slider Navigation arrows */}
            <div className="flex gap-2">
              <button 
                onClick={handleTestimonialPrev}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#007AFF] hover:text-white hover:border-[#007AFF] transition-all cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleTestimonialNext}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#007AFF] hover:text-white hover:border-[#007AFF] transition-all cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Desktop Row layout / Mobile active card layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clientTestimonials.map((test, index) => {
              // Highlight selected slider card on mobile, or just display nicely on desktop
              const isActiveOnMobile = index === activeTestimonialIdx;
              
              return (
                <div 
                  key={index}
                  className={`bg-[#F8FAFC] border border-slate-100 p-8 rounded-[2.2rem] shadow-sm hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between ${
                    isActiveOnMobile ? 'block ring-2 ring-blue-100' : 'hidden md:flex'
                  }`}
                >
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 text-[#FFB300] mb-5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed italic mb-8">
                      "{getL(test.text)}"
                    </p>
                  </div>
                  
                  {/* User Profile Info */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={test.avatar} 
                      alt={test.name} 
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-black text-[#001D3D]">{test.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400">{test.location}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>


    </main>
  );
};

export default ServicesPage;
