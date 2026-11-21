import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, CheckIcon } from './icons';
import emailjs, { EMAIL_SERVICE_ID as SERVICE_ID, EMAIL_TEMPLATE_ID as TEMPLATE_ID, EMAIL_PUBLIC_KEY as PUBLIC_KEY } from './emailClient';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { postWebhook, MAKE_WEBHOOK_URL } from './leadWebhook';


interface KontaktPageProps {
  onNavigate: (page: string) => void;
}

const kontaktTranslations: Record<string, {
  thankYouTitle: string;
  successDesc: string;
  backToHome: string;
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  contactInfoTitle: string;
  contactInfoDesc: string;
  labelAddress: string;
  labelPhone: string;
  labelEmail: string;
  labelHours: string;
  valHoursDays: string;
  valHoursTime: string;
  locationTitle: string;
  locationDesc: string;
  formTitle: string;
  labelName: string;
  placeholderName: string;
  labelEmailForm: string;
  placeholderEmail: string;
  labelSubject: string;
  placeholderSubject: string;
  labelMessage: string;
  placeholderMessage: string;
  btnSending: string;
  btnSend: string;
  validationRequiredError: string;
  sendFailedError: string;
  defaultInterest: string;
}> = {
  de: {
    thankYouTitle: "Vielen Dank!",
    successDesc: "Ihre Nachricht wurde erfolgreich gesendet. Unser Team wird sich so schnell wie möglich bei Ihnen melden.",
    backToHome: "Zur Startseite",
    heroBadge: "KONTAKTIEREN SIE UNS",
    heroTitle: "Kontakt",
    heroDesc: "Haben Sie Fragen zu unseren Dienstleistungen oder möchten Sie ein individuelles Angebot erhalten? Wir sind gerne für Sie da.",
    contactInfoTitle: "Kontaktinformationen",
    contactInfoDesc: "Besuchen Sie uns, rufen Sie uns an oder schreiben Sie uns eine E-Mail. Wir freuen uns auf Sie.",
    labelAddress: "Adresse",
    labelPhone: "Telefon",
    labelEmail: "E-Mail",
    labelHours: "Öffnungszeiten",
    valHoursDays: "Montag – Freitag",
    valHoursTime: "08:00 – 18:00 Uhr",
    locationTitle: "Kraken Properties & Facilities Management",
    locationDesc: "Wir bedienen Privat- und Geschäftskunden in den Regionen Schaffhausen, Zürich, Winterthur und Umgebung mit erstklassigen Reinigungs- und Facility-Services.",
    formTitle: "Senden Sie uns eine Nachricht",
    labelName: "Name",
    placeholderName: "Ihr Name",
    labelEmailForm: "E-Mail-Adresse",
    placeholderEmail: "ihre.email@beispiel.ch",
    labelSubject: "Betreff",
    placeholderSubject: "Worum geht es?",
    labelMessage: "Ihre Nachricht",
    placeholderMessage: "Wie können wir Ihnen helfen?",
    btnSending: "Wird gesendet...",
    btnSend: "Nachricht senden",
    validationRequiredError: "Bitte füllen Sie alle erforderlichen Felder aus.",
    sendFailedError: "Senden fehlgeschlagen. Bitte kontaktieren Sie uns direkt unter kai@krakenpfm.ch.",
    defaultInterest: "Allgemeine Kontaktanfrage"
  },
  en: {
    thankYouTitle: "Thank You!",
    successDesc: "Your message has been sent successfully. Our team will get back to you as soon as possible.",
    backToHome: "Back to Home",
    heroBadge: "CONTACT US",
    heroTitle: "Contact",
    heroDesc: "Do you have questions about our services or would you like to receive a tailored quote? We are happy to help you.",
    contactInfoTitle: "Contact Information",
    contactInfoDesc: "Visit us, call us or send us an email. We look forward to hearing from you.",
    labelAddress: "Address",
    labelPhone: "Phone",
    labelEmail: "Email",
    labelHours: "Opening Hours",
    valHoursDays: "Monday – Friday",
    valHoursTime: "08:00 – 18:00",
    locationTitle: "Kraken Properties & Facilities Management",
    locationDesc: "We serve private and commercial clients across Schaffhausen, Zurich, Winterthur and surrounding areas with top-tier cleaning and facility services.",
    formTitle: "Send Us a Message",
    labelName: "Name",
    placeholderName: "Your Name",
    labelEmailForm: "Email Address",
    placeholderEmail: "your.email@example.ch",
    labelSubject: "Subject",
    placeholderSubject: "What is it regarding?",
    labelMessage: "Your Message",
    placeholderMessage: "How can we help you?",
    btnSending: "Sending...",
    btnSend: "Send Message",
    validationRequiredError: "Please fill out all required fields.",
    sendFailedError: "Submission failed. Please contact us directly at kai@krakenpfm.ch.",
    defaultInterest: "General Contact Inquiry"
  },
  es: {
    thankYouTitle: "¡Muchas Gracias!",
    successDesc: "Su mensaje ha sido enviado con éxito. Nuestro equipo se ponerá en contacto con usted lo antes posible.",
    backToHome: "Volver al Inicio",
    heroBadge: "CONTÁCTENOS",
    heroTitle: "Contacto",
    heroDesc: "¿Tiene preguntas sobre nuestros servicios o desea recibir un presupuesto personalizado? Con gusto le atenderemos.",
    contactInfoTitle: "Información de Contacto",
    contactInfoDesc: "Visítenos, llámenos o envíenos un correo electrónico. Estaremos encantados de atenderle.",
    labelAddress: "Dirección",
    labelPhone: "Teléfono",
    labelEmail: "E-Mail",
    labelHours: "Horario de Atención",
    valHoursDays: "Lunes – Viernes",
    valHoursTime: "08:00 – 18:00 hrs",
    locationTitle: "Kraken Properties & Facilities Management",
    locationDesc: "Atendemos a clientes particulares y comerciales en las regiones de Schaffhausen, Zúrich, Winterthur y alrededores con servicios de limpieza y gestión de instalaciones de primera calidad.",
    formTitle: "Envíenos un Mensaje",
    labelName: "Nombre",
    placeholderName: "Su Nombre",
    labelEmailForm: "Correo Electrónico",
    placeholderEmail: "su.correo@ejemplo.ch",
    labelSubject: "Asunto",
    placeholderSubject: "¿De qué se trata?",
    labelMessage: "Su Mensaje",
    placeholderMessage: "¿Cómo podemos ayudarle?",
    btnSending: "Enviando...",
    btnSend: "Enviar Mensaje",
    validationRequiredError: "Por favor, complete todos los campos obligatorios.",
    sendFailedError: "Error al enviar. Por favor contáctenos directamente en kai@krakenpfm.ch.",
    defaultInterest: "Consulta General de Contacto"
  },
  fr: {
    thankYouTitle: "Merci Beaucoup !",
    successDesc: "Votre message a été envoyé avec succès. Notre équipe vous contactera dans les plus brefs délais.",
    backToHome: "Retour à l'Accueil",
    heroBadge: "CONTACTEZ-NOUS",
    heroTitle: "Contact",
    heroDesc: "Vous avez des questions sur nos services ou vous souhaitez recibir un devis personnalisé ? Nous sommes à votre disposition.",
    contactInfoTitle: "Coordonnées de Contact",
    contactInfoDesc: "Rendez-nous visite, appelez-nous ou envoyez-nous un e-mail. Au plaisir d'échanger avec vous.",
    labelAddress: "Adresse",
    labelPhone: "Téléphone",
    labelEmail: "E-mail",
    labelHours: "Heures d'ouverture",
    valHoursDays: "Lundi – Vendredi",
    valHoursTime: "08:00 – 18:00",
    locationTitle: "Kraken Properties & Facilities Management",
    locationDesc: "Nous servons les clients privés et professionnels dans les régions de Schaffhouse, Zurich, Winterthour et environs avec des services de nettoyage et de facility management haut de gamme.",
    formTitle: "Envoyez-nous un Message",
    labelName: "Nom",
    placeholderName: "Votre Nom",
    labelEmailForm: "Adresse E-mail",
    placeholderEmail: "votre.email@exemple.ch",
    labelSubject: "Sujet",
    placeholderSubject: "De quoi s'agit-il ?",
    labelMessage: "Votre Message",
    placeholderMessage: "Comment pouvons-nous vous aider ?",
    btnSending: "Envoi en cours...",
    btnSend: "Envoyer le Message",
    validationRequiredError: "Veuillez remplir tous les champs obligatoires.",
    sendFailedError: "Échec de l'envoi. Veuillez nous contacter directement à kai@krakenpfm.ch.",
    defaultInterest: "Demande de contact générale"
  },
  it: {
    thankYouTitle: "Grazie Mille!",
    successDesc: "Il tuo messaggio è stato inviato con successo. Il nostro team ti contatterà al più presto.",
    backToHome: "Torna alla Home",
    heroBadge: "CONTATTACI",
    heroTitle: "Contatti",
    heroDesc: "Hai domande sui nostri servizi o desideri recibir un preventivo personalizzato? Siamo a tua completa disposizione.",
    contactInfoTitle: "Informazioni di Contatto",
    contactInfoDesc: "Vienici a trovare, chiamaci o inviaci un'e-mail. Saremo lieti di risponderti.",
    labelAddress: "Indirizzo",
    labelPhone: "Telefono",
    labelEmail: "E-mail",
    labelHours: "Orari di Apertura",
    valHoursDays: "Lunedì – Venerdì",
    valHoursTime: "08:00 – 18:00",
    locationTitle: "Kraken Properties & Facilities Management",
    locationDesc: "Serviamo clienti privati e commerciali nelle regioni di Sciaffusa, Zurigo, Winterthur e dintorni con servizi di pulizia e gestione strutture di prim'ordine.",
    formTitle: "Inviaci un Messaggio",
    labelName: "Nome",
    placeholderName: "Il tuo Nome",
    labelEmailForm: "Indirizzo E-mail",
    placeholderEmail: "tua.email@esempio.ch",
    labelSubject: "Oggetto",
    placeholderSubject: "Di cosa si tratta?",
    labelMessage: "Il tuo Messaggio",
    placeholderMessage: "Come possiamo aiutarti?",
    btnSending: "Invio in corso...",
    btnSend: "Invia Messaggio",
    validationRequiredError: "Si prega di compilare tutti i campi obbligatori.",
    sendFailedError: "Invio fallito. Contattaci direttamente a kai@krakenpfm.ch.",
    defaultInterest: "Richiesta di contatto generale"
  },
  pt: {
    thankYouTitle: "Muito Obrigado!",
    successDesc: "A sua mensagem foi enviada com sucesso. A nossa equipa entrará em contacto consigo o mais brevemente possível.",
    backToHome: "Voltar ao Início",
    heroBadge: "CONTACTE-NOS",
    heroTitle: "Contacto",
    heroDesc: "Tem dúvidas sobre os nossos serviços ou pretende receber um orçamento personalizado? Estamos à sua disposição.",
    contactInfoTitle: "Informações de Contacto",
    contactInfoDesc: "Visite-nos, ligue-nos ou envie-nos um e-mail. Teremos todo o gosto em atendê-lo.",
    labelAddress: "Endereço",
    labelPhone: "Telefone",
    labelEmail: "E-mail",
    labelHours: "Horário de Funcionamento",
    valHoursDays: "Segunda-feira – Sexta-feira",
    valHoursTime: "08:00 – 18:00",
    locationTitle: "Kraken Properties & Facilities Management",
    locationDesc: "Servimos clientes particulares e comerciais nas regiões de Schaffhausen, Zurique, Winterthur e arredores com serviços de limpeza e gestão de instalações de excelência.",
    formTitle: "Envie-nos uma Mensagem",
    labelName: "Nome",
    placeholderName: "O seu Nome",
    labelEmailForm: "Endereço de E-mail",
    placeholderEmail: "seu.email@exemplo.ch",
    labelSubject: "Assunto",
    placeholderSubject: "Qual é o assunto?",
    labelMessage: "A sua Mensagem",
    placeholderMessage: "Como podemos ajudá-lo?",
    btnSending: "A enviar...",
    btnSend: "Enviar Mensagem",
    validationRequiredError: "Por favor, preencha todos os campos obrigatórios.",
    sendFailedError: "Falha ao enviar. Por favor contacte-nos directamente através de kai@krakenpfm.ch.",
    defaultInterest: "Consulta Geral de Contacto"
  }
};

const KontaktPage: React.FC<KontaktPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const d = kontaktTranslations[language] || kontaktTranslations['de'];

  const [formData, setFormData] = useState(() => {
    const selectedServices = typeof window === 'undefined'
      ? []
      : new URLSearchParams(window.location.search).getAll('service');
    const requestedService = selectedServices.length === 1 ? selectedServices[0] : null;
    const serviceSubject = requestedService === 'window-cleaning'
      ? salesCopy(language).serviceNames[3]
      : requestedService === 'gardening'
        ? salesCopy(language).serviceNames[5]
        : '';
    // Initialize once from the same six-language label as the Home card. Editing
    // the subject remains under the user's control on subsequent renders.
    return {
      name: '',
      email: '',
      subject: serviceSubject,
      message: ''
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError(d.validationRequiredError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Save contact message to Firestore (non-blocking if it fails)
      const persistence = addDoc(collection(db, 'contact_messages'), {
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject || '',
          message: formData.message,
          language: language || 'de',
          status: 'new',
          createdAt: serverTimestamp()
        });

      await persistence; // The dashboard record is the primary delivery channel.

      // 2. Send lead to Make Webhook
      const webhookPromise = postWebhook(MAKE_WEBHOOK_URL, {
        ...formData,
        source: 'CONTACT_FORM'
      });

      // 3. Send notification via EmailJS
      const emailPromise = emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone_number: 'N/A',
          services_interest: formData.subject || d.defaultInterest,
          message: formData.message,
          property_address: 'N/A'
        },
        PUBLIC_KEY
      );

      await Promise.allSettled([webhookPromise, emailPromise]);
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Submission failed', err);
      setError(d.sendFailedError);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="bg-slate-50 min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white p-10 md:p-14 rounded-[2.5rem] shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-[#002D5B] mb-4 uppercase tracking-tight">{d.thankYouTitle}</h1>
          <p className="text-gray-600 font-medium mb-8">
            {d.successDesc}
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-[#002D5B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#00254A] transition-all cursor-pointer shadow-lg"
          >
            {d.backToHome}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white selection:bg-blue-500/30 text-[#020617]">
      {/* --- HERO SECTION --- */}
      <section data-header-theme="dark" className="relative md:min-h-[40vh] flex items-center pt-32 pb-24 md:py-32 overflow-hidden bg-[#001A3D]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#001A3D] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001A3D] via-[#002D5B]/30 to-[#001A3D]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-400 font-black text-xs uppercase tracking-[0.4em] mb-4"
            >
              {d.heroBadge}
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tighter"
            >
              {d.heroTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-lg font-medium max-w-2xl mx-auto"
            >
              {d.heroDesc}
            </motion.p>
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* CONTACT INFORMATION COLUMN */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#002D5B] tracking-tight mb-6">
                    {d.contactInfoTitle}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">
                    {d.contactInfoDesc}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPinIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">{d.labelAddress}</h4>
                      <p className="text-slate-800 font-bold text-base leading-relaxed">
                        Seewadelstrasse 3<br />
                        8203 Schaffhausen
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                      <PhoneIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">{d.labelPhone}</h4>
                      <p className="text-slate-800 font-bold text-base">
                        <a href="tel:+41774505705" className="hover:text-blue-600 transition-colors">
                          +41 77 450 57 05
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                      <MailIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">{d.labelEmail}</h4>
                      <p className="text-slate-800 font-bold text-base">
                        <a href="mailto:kai@krakenpfm.ch" className="hover:text-blue-600 transition-colors">
                          kai@krakenpfm.ch
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                      <ClockIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">{d.labelHours}</h4>
                      <p className="text-slate-800 font-bold text-base leading-relaxed">
                        {d.valHoursDays}<br />
                        {d.valHoursTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map/Location Card */}
              <div className="bg-[#002D5B] text-white p-8 md:p-10 rounded-[2rem] shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-extrabold tracking-tight">{d.locationTitle}</h3>
                  <p className="text-white/80 text-sm leading-relaxed font-medium">
                    {d.locationDesc}
                  </p>
                </div>
                {/* Background Pattern */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CONTACT FORM COLUMN */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
                <h2 className="text-2xl font-extrabold text-[#002D5B] tracking-tight mb-8">
                  {d.formTitle}
                </h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                        {d.labelName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={d.placeholderName}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                        {d.labelEmailForm} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={d.placeholderEmail}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                      {d.labelSubject}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={d.placeholderSubject}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                      {d.labelMessage} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={d.placeholderMessage}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#002D5B] text-white py-4 rounded-xl font-bold hover:bg-[#00254A] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {d.btnSending}
                      </>
                    ) : (
                      d.btnSend
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default KontaktPage;
