import React, { useState, FormEvent } from 'react';
import { useTranslation } from '../i18n';
import { CONTACT_SERVICE_IDS, serviceName } from '../src/content/serviceCatalog';
import { transitCopy, type TransitScene } from '../src/content/transitCopy';
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
    const parameters = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search);
    const selectedServices = parameters?.getAll('service') || [];
    const requestedService = selectedServices.length === 1 ? selectedServices[0] : null;
    const serviceSubject = requestedService && CONTACT_SERVICE_IDS.includes(requestedService)
      ? serviceName(language, requestedService) || ''
      : '';
    const inventory = parameters?.getAll('inventory') || [];
    const scene = requestedService === 'moving-furniture' && inventory.length === 1 && ['furniture', 'room', 'studio'].includes(inventory[0])
      ? transitCopy(language).scenes[inventory[0] as TransitScene]
      : null;
    const variants = parameters?.getAll('variant') || [];
    const variant = variants.length === 1 && ['L3H2', 'L3H3'].includes(variants[0]) ? variants[0] : '';
    // Initialize once from the same six-language label as the Home card. Editing
    // the subject remains under the user's control on subsequent renders.
    return {
      name: '',
      email: '',
      subject: serviceSubject,
      message: scene ? `${variant ? `Ford Transit ${variant}\n` : ''}${transitCopy(language).inventory}: ${scene.tab}\n${scene.items.map(item => `- ${item.label}`).join('\n')}` : ''
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
    return <main className="kraken-page kraken-workflow bg-[#f4f8f8] py-16 sm:py-24">
      <section className="mx-auto max-w-xl rounded-2xl border border-[#dce6e8] bg-white p-7 text-center sm:p-12" role="status">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f1] text-[#087f73]"><CheckIcon className="h-7 w-7" /></div>
        <h1 className="kraken-heading">{d.thankYouTitle}</h1>
        <p className="kraken-description mb-8">{d.successDesc}</p>
        <button onClick={() => onNavigate('home')} className="kraken-button kraken-primary">{d.backToHome}</button>
      </section>
    </main>;
  }

  return (
    <main className="kraken-page kraken-workflow bg-[#f4f8f8] text-[#082b45]">
      <header className="kraken-page-intro border-b border-[#dce6e8] bg-white py-12 sm:py-20">
        <div className="kraken-container max-w-6xl">
          <p className="kraken-eyebrow">Kraken PFM</p>
          <h1 className="kraken-heading mt-3">{d.heroTitle}</h1>
          <p className="kraken-description max-w-2xl">{d.heroDesc}</p>
        </div>
      </header>
      <div className="kraken-container grid max-w-6xl gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12">
        <section className="min-w-0 rounded-2xl border border-[#dce6e8] bg-white p-6 sm:p-9" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="text-2xl font-semibold tracking-tight">{d.formTitle}</h2>
          {error && <p role="alert" id="contact-form-error" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-800">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-7 space-y-6" aria-describedby={error ? 'contact-form-error' : undefined}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="block text-sm font-medium">{d.labelName} <span aria-hidden="true">*</span></label>
                <input type="text" id="contact-name" name="name" autoComplete="name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={d.placeholderName} className="min-h-12 w-full rounded-xl border border-[#c4d4d8] bg-white px-4 py-3 text-base text-[#082b45] placeholder:text-[#71828c] focus:border-[#087f73] focus:ring-2 focus:ring-[#087f73]/15" />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="block text-sm font-medium">{d.labelEmailForm} <span aria-hidden="true">*</span></label>
                <input type="email" id="contact-email" name="email" autoComplete="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder={d.placeholderEmail} className="min-h-12 w-full rounded-xl border border-[#c4d4d8] bg-white px-4 py-3 text-base text-[#082b45] placeholder:text-[#71828c] focus:border-[#087f73] focus:ring-2 focus:ring-[#087f73]/15" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-subject" className="block text-sm font-medium">{d.labelSubject}</label>
              <input type="text" id="contact-subject" name="subject" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} placeholder={d.placeholderSubject} className="min-h-12 w-full rounded-xl border border-[#c4d4d8] bg-white px-4 py-3 text-base text-[#082b45] placeholder:text-[#71828c] focus:border-[#087f73] focus:ring-2 focus:ring-[#087f73]/15" />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-message" className="block text-sm font-medium">{d.labelMessage} <span aria-hidden="true">*</span></label>
              <textarea id="contact-message" name="message" required rows={6} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder={d.placeholderMessage} className="w-full resize-y rounded-xl border border-[#c4d4d8] bg-white px-4 py-3 text-base leading-relaxed text-[#082b45] placeholder:text-[#71828c] focus:border-[#087f73] focus:ring-2 focus:ring-[#087f73]/15" />
            </div>
            <button type="submit" disabled={isLoading} className="kraken-button kraken-primary w-full sm:w-auto">{isLoading ? d.btnSending : d.btnSend}</button>
          </form>
        </section>
        <aside className="min-w-0 space-y-8 lg:pt-3" aria-labelledby="contact-details-heading">
          <div>
            <h2 id="contact-details-heading" className="text-2xl font-semibold tracking-tight">{d.contactInfoTitle}</h2>
            <p className="kraken-description">{d.contactInfoDesc}</p>
          </div>
          <dl className="space-y-6">
            <div className="flex gap-4"><PhoneIcon className="mt-1 h-5 w-5 shrink-0 text-[#087f73]" /><div><dt className="text-sm text-[#526574]">{d.labelPhone}</dt><dd><a href="tel:+41774505705" className="inline-flex min-h-11 items-center text-lg font-medium hover:underline">+41 77 450 57 05</a></dd></div></div>
            <div className="flex gap-4"><MailIcon className="mt-1 h-5 w-5 shrink-0 text-[#087f73]" /><div className="min-w-0"><dt className="text-sm text-[#526574]">{d.labelEmail}</dt><dd><a href="mailto:kai@krakenpfm.ch" className="inline-flex min-h-11 items-center break-all text-lg font-medium hover:underline">kai@krakenpfm.ch</a></dd></div></div>
            <div className="flex gap-4"><MapPinIcon className="mt-1 h-5 w-5 shrink-0 text-[#087f73]" /><div><dt className="text-sm text-[#526574]">{d.labelAddress}</dt><dd className="mt-2 text-base leading-relaxed">Seewadelstrasse 3<br />8203 Schaffhausen</dd></div></div>
            <div className="flex gap-4"><ClockIcon className="mt-1 h-5 w-5 shrink-0 text-[#087f73]" /><div><dt className="text-sm text-[#526574]">{d.labelHours}</dt><dd className="mt-2 text-base leading-relaxed">{d.valHoursDays}<br />{d.valHoursTime}</dd></div></div>
          </dl>
        </aside>
      </div>
    </main>
  );
};

export default KontaktPage;
