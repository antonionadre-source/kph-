import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { 
  WhatsAppIcon, 
  FacebookIcon, 
  XIcon, 
  InstagramIcon, 
  LinkedInIcon, 
  YouTubeIcon, 
  TikTokIcon,
  LeafIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  ShieldCheckIcon
} from './icons';
import { companyLogoWhiteUrl, tentacleImageUrl } from '../assets';
import emailjs, { EMAIL_SERVICE_ID as SERVICE_ID, EMAIL_TEMPLATE_ID as TEMPLATE_ID, EMAIL_PUBLIC_KEY as PUBLIC_KEY } from './emailClient';
import { motion, AnimatePresence } from 'motion/react';

import { sendLead, postWebhook, MAKE_WEBHOOK_URL } from './leadWebhook';


interface FooterProps {
  onNavigate: (page: string) => void;
}

const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - percentage, 4);
      setCount(end * ease);
      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return count;
};

const REGION_LINK_NAMES: Record<string, { zuerich: string; winterthur: string; schaffhausen: string }> = {
  de: { zuerich: 'Region Zürich', winterthur: 'Region Winterthur', schaffhausen: 'Region Schaffhausen' },
  'de-CH': { zuerich: 'Region Zürich', winterthur: 'Region Winterthur', schaffhausen: 'Region Schaffhausen' },
  en: { zuerich: 'Zurich Region', winterthur: 'Winterthur Region', schaffhausen: 'Schaffhausen Region' },
  es: { zuerich: 'Región de Zúrich', winterthur: 'Región de Winterthur', schaffhausen: 'Región de Schaffhausen' },
  fr: { zuerich: 'Région de Zurich', winterthur: 'Région de Winterthour', schaffhausen: 'Région de Schaffhouse' },
  it: { zuerich: 'Regione di Zurigo', winterthur: 'Regione di Winterthur', schaffhausen: 'Regione di Sciaffusa' },
  pt: { zuerich: 'Região de Zurique', winterthur: 'Região de Winterthur', schaffhausen: 'Região de Schaffhausen' },
};

const SLIDE_CONTACT_I18N: Record<string, {
  badge: string;
  title: string;
  stepNameLabel: string;
  stepNamePlaceholder: string;
  stepPhoneLabel: string;
  stepPhonePlaceholder: string;
  stepEmailLabel: string;
  stepEmailPlaceholder: string;
  stepServiceLabel: string;
  stepMessageLabel: string;
  stepMessagePlaceholder: string;
  btnNext: string;
  btnBack: string;
  btnSubmit: string;
  errName: string;
  errPhone: string;
  errEmail: string;
  successTitle: string;
  successDesc: (name: string, service: string) => string;
  btnReset: string;
  stepCount: (current: number, total: number) => string;
  services: { key: string; label: string }[];
}> = {
  de: {
    badge: 'Unverbindlich · Rückmeldung am selben Tag',
    title: 'Kontaktieren Sie uns – Antwort am selben Tag',
    stepNameLabel: '1. Wie lautet Ihr Name?',
    stepNamePlaceholder: 'Vor- und Nachname',
    stepPhoneLabel: '2. Wie lautet Ihre Telefonnummer?',
    stepPhonePlaceholder: '+41 77 450 57 05',
    stepEmailLabel: '3. Unter welcher E-Mail erreichen wir Sie?',
    stepEmailPlaceholder: 'ihre.email@beispiel.ch',
    stepServiceLabel: '4. Welche Dienstleistung benötigen Sie?',
    stepMessageLabel: '5. Möchten Sie uns noch eine Nachricht hinterlassen? (Optional)',
    stepMessagePlaceholder: 'Details zur Immobilie oder Ihre Wünsche...',
    btnNext: 'Weiter',
    btnBack: 'Zurück',
    btnSubmit: 'Kostenlose Offerte anfordern',
    errName: 'Bitte geben Sie Ihren Namen ein.',
    errPhone: 'Bitte geben Sie Ihre Telefonnummer ein.',
    errEmail: 'Gültige E-Mail-Adresse erforderlich.',
    successTitle: 'Vielen Dank für Ihre Anfrage!',
    successDesc: (name, service) => `Hallo ${name || 'Kundin/Kunde'}, wir haben Ihre Anfrage für ${service} erhalten und melden uns noch heute bei Ihnen.`,
    btnReset: 'Neue Nachricht senden',
    stepCount: (c, t) => `Schritt ${c} von ${t}`,
    services: [
      { key: 'Umzugsreinigung', label: 'Umzugsreinigung' },
      { key: 'Unterhaltsreinigung', label: 'Unterhaltsreinigung' },
      { key: 'Büroreinigung', label: 'Büroreinigung' },
      { key: 'Hauswartung & Facility Management', label: 'Hauswartung & FM' },
      { key: 'Sonstiges', label: 'Sonstiges' }
    ]
  },
  en: {
    badge: 'Non-binding · Same day response',
    title: 'Contact us – Response the same day',
    stepNameLabel: '1. What is your name?',
    stepNamePlaceholder: 'Full Name',
    stepPhoneLabel: '2. What is your phone number?',
    stepPhonePlaceholder: '+41 77 450 57 05',
    stepEmailLabel: '3. Which email address can we reach you at?',
    stepEmailPlaceholder: 'your.email@example.com',
    stepServiceLabel: '4. Which service do you need?',
    stepMessageLabel: '5. Leave a message (Optional)',
    stepMessagePlaceholder: 'Property details or additional requests...',
    btnNext: 'Next',
    btnBack: 'Back',
    btnSubmit: 'Request Free Quote',
    errName: 'Please enter your name.',
    errPhone: 'Please enter your phone number.',
    errEmail: 'Valid email address required.',
    successTitle: 'Thank you for your request!',
    successDesc: (name, service) => `Hello ${name || 'there'}, we received your inquiry for ${service} and will get back to you today.`,
    btnReset: 'Send another message',
    stepCount: (c, t) => `Step ${c} of ${t}`,
    services: [
      { key: 'Umzugsreinigung', label: 'End of Tenancy Cleaning' },
      { key: 'Unterhaltsreinigung', label: 'Regular Cleaning' },
      { key: 'Büroreinigung', label: 'Office Cleaning' },
      { key: 'Hauswartung & Facility Management', label: 'Facility Management' },
      { key: 'Sonstiges', label: 'Other' }
    ]
  },
  es: {
    badge: 'Sin compromiso · Respuesta el mismo día',
    title: 'Contáctenos – Respuesta el mismo día',
    stepNameLabel: '1. ¿Cómo te llamas?',
    stepNamePlaceholder: 'Nombre y apellido',
    stepPhoneLabel: '2. ¿Cuál es tu teléfono?',
    stepPhonePlaceholder: '+41 77 450 57 05',
    stepEmailLabel: '3. ¿Cuál es tu correo electrónico?',
    stepEmailPlaceholder: 'tu.email@ejemplo.com',
    stepServiceLabel: '4. ¿Qué servicio necesitas?',
    stepMessageLabel: '5. ¿Quieres dejarnos un mensaje? (Opcional)',
    stepMessagePlaceholder: 'Detalles de la propiedad o consulta...',
    btnNext: 'Siguiente',
    btnBack: 'Atrás',
    btnSubmit: 'Solicitar presupuesto gratuito',
    errName: 'Por favor introduce tu nombre.',
    errPhone: 'Por favor introduce tu teléfono.',
    errEmail: 'Correo electrónico válido requerido.',
    successTitle: '¡Muchas gracias por tu mensaje!',
    successDesc: (name, service) => `Hola ${name || 'cliente'}, hemos recibido tu solicitud para ${service} y te responderemos hoy mismo.`,
    btnReset: 'Enviar otro mensaje',
    stepCount: (c, t) => `Paso ${c} de ${t}`,
    services: [
      { key: 'Umzugsreinigung', label: 'Limpieza de mudanza' },
      { key: 'Unterhaltsreinigung', label: 'Mantenimiento regular' },
      { key: 'Büroreinigung', label: 'Limpieza de oficinas' },
      { key: 'Hauswartung & Facility Management', label: 'Gestión de instalaciones' },
      { key: 'Sonstiges', label: 'Otros' }
    ]
  },
  fr: {
    badge: 'Sans engagement · Réponse le jour même',
    title: 'Contactez-nous – Réponse le jour même',
    stepNameLabel: '1. Quel est votre nom ?',
    stepNamePlaceholder: 'Nom et prénom',
    stepPhoneLabel: '2. Quel est votre numéro de téléphone ?',
    stepPhonePlaceholder: '+41 77 450 57 05',
    stepEmailLabel: '3. À quelle adresse e-mail vous joindre ?',
    stepEmailPlaceholder: 'votre.email@exemple.ch',
    stepServiceLabel: '4. De quel service avez-vous besoin ?',
    stepMessageLabel: '5. Souhaitez-vous laisser un message ? (Optionnel)',
    stepMessagePlaceholder: 'Détails de la propriété ou questions...',
    btnNext: 'Suivant',
    btnBack: 'Retour',
    btnSubmit: 'Demander un devis gratuit',
    errName: 'Veuillez saisir votre nom.',
    errPhone: 'Veuillez saisir votre numéro de téléphone.',
    errEmail: 'Adresse e-mail valide requise.',
    successTitle: 'Merci pour votre demande !',
    successDesc: (name, service) => `Bonjour ${name || ''}, nous avons reçu votre demande pour ${service} et nous vous répondrons aujourd'hui.`,
    btnReset: 'Envoyer un autre message',
    stepCount: (c, t) => `Étape ${c} sur ${t}`,
    services: [
      { key: 'Umzugsreinigung', label: 'Nettoyage de déménagement' },
      { key: 'Unterhaltsreinigung', label: 'Entretien régulier' },
      { key: 'Büroreinigung', label: 'Nettoyage de bureaux' },
      { key: 'Hauswartung & Facility Management', label: 'Conciergerie & FM' },
      { key: 'Sonstiges', label: 'Autre' }
    ]
  },
  it: {
    badge: 'Senza impegno · Risposta in giornata',
    title: 'Contattaci – Risposta in giornata',
    stepNameLabel: '1. Come ti chiami?',
    stepNamePlaceholder: 'Nome e cognome',
    stepPhoneLabel: '2. Qual è il tuo numero di telefono?',
    stepPhonePlaceholder: '+41 77 450 57 05',
    stepEmailLabel: '3. A quale e-mail possiamo contattarti?',
    stepEmailPlaceholder: 'tua.email@esempio.ch',
    stepServiceLabel: '4. Di quale servizio hai bisogno?',
    stepMessageLabel: '5. Vuoi lasciarci un messaggio? (Opzionale)',
    stepMessagePlaceholder: 'Dettagli dell’immobile o domande...',
    btnNext: 'Avanti',
    btnBack: 'Indietro',
    btnSubmit: 'Richiedi preventivo gratuito',
    errName: 'Inserisci il tuo nome.',
    errPhone: 'Inserisci il tuo numero di telefono.',
    errEmail: 'Indirizzo e-mail valido richiesto.',
    successTitle: 'Grazie per la richiesta!',
    successDesc: (name, service) => `Ciao ${name || ''}, abbiamo ricevuto la richiesta per ${service} e ti risponderemo oggi stesso.`,
    btnReset: 'Invia un altro messaggio',
    stepCount: (c, t) => `Passo ${c} di ${t}`,
    services: [
      { key: 'Umzugsreinigung', label: 'Pulizia trasloco' },
      { key: 'Unterhaltsreinigung', label: 'Pulizia di manutenzione' },
      { key: 'Büroreinigung', label: 'Pulizia uffici' },
      { key: 'Hauswartung & Facility Management', label: 'Custodia & FM' },
      { key: 'Sonstiges', label: 'Altro' }
    ]
  },
  pt: {
    badge: 'Sem compromisso · Resposta no mesmo dia',
    title: 'Contate-nos – Resposta no mesmo dia',
    stepNameLabel: '1. Qual é o seu nome?',
    stepNamePlaceholder: 'Nome e sobrenome',
    stepPhoneLabel: '2. Qual é o seu número de telefone?',
    stepPhonePlaceholder: '+41 77 450 57 05',
    stepEmailLabel: '3. Em qual e-mail podemos contatá-lo?',
    stepEmailPlaceholder: 'seu.email@exemplo.ch',
    stepServiceLabel: '4. De qual serviço você precisa?',
    stepMessageLabel: '5. Deseja nos deixar uma mensagem? (Opcional)',
    stepMessagePlaceholder: 'Detalhes do imóvel ou observações...',
    btnNext: 'Avançar',
    btnBack: 'Voltar',
    btnSubmit: 'Solicitar orçamento gratuito',
    errName: 'Por favor, insira seu nome.',
    errPhone: 'Por favor, insira seu telefone.',
    errEmail: 'E-mail válido obrigatório.',
    successTitle: 'Obrigado pela sua mensagem!',
    successDesc: (name, service) => `Olá ${name || ''}, recebemos sua solicitação para ${service} e responderemos hoje mesmo.`,
    btnReset: 'Enviar outra mensagem',
    stepCount: (c, t) => `Passo ${c} de ${t}`,
    services: [
      { key: 'Umzugsreinigung', label: 'Limpeza de mudança' },
      { key: 'Unterhaltsreinigung', label: 'Limpeza de manutenção' },
      { key: 'Büroreinigung', label: 'Limpeza de escritórios' },
      { key: 'Hauswartung & Facility Management', label: 'Gestão de instalações' },
      { key: 'Sonstiges', label: 'Outros' }
    ]
  }
};

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useTranslation();
  const activeLang = language || 'de';
  const regionNames = REGION_LINK_NAMES[activeLang] || REGION_LINK_NAMES.de;
  const slideI18n = SLIDE_CONTACT_I18N[activeLang] || SLIDE_CONTACT_I18N.de;

  const co2Value = useCountUp(0.61);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setStatus('loading');

    try {
      sendLead({
        type: 'NEWSLETTER_SUBSCRIPTION',
        email: newsletterEmail,
        source: 'Footer Newsletter',
      });

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: 'System',
        from_email: newsletterEmail,
        message: `New Newsletter Subscription Request from: ${newsletterEmail}`,
        services_interest: 'Newsletter',
        total_price: 'N/A'
      }, PUBLIC_KEY);

      setStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  // Step-by-Step Slide Input Contact Form State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Umzugsreinigung',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [stepError, setStepError] = useState('');

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
    if (stepError) setStepError('');
  };

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStepError('');

    if (currentStep === 1) {
      if (!contactData.name.trim()) {
        setStepError(slideI18n.errName);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!contactData.phone.trim()) {
        setStepError(slideI18n.errPhone);
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!contactData.email.trim() || !emailRegex.test(contactData.email.trim())) {
        setStepError(slideI18n.errEmail);
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    setStepError('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');

    try {
      await postWebhook(MAKE_WEBHOOK_URL, {
        type: 'STEP_SLIDE_FOOTER_CONTACT',
        ...contactData,
        source: 'Footer Step Slide Contact Form',
        timestamp: new Date().toISOString(),
        page: window.location.href,
        summary: [contactData.name, contactData.phone, contactData.email, contactData.service, contactData.message].filter(Boolean).join(' | ').slice(0, 650),
      });

      setContactSubmitted(true);
    } catch (err) {
      console.error(err);
      const messages: Record<string, string> = {
        de: 'Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns unter kai@krakenpfm.ch.',
        en: 'Your request could not be sent. Please try again or contact kai@krakenpfm.ch.',
        fr: 'Votre demande n’a pas pu être envoyée. Réessayez ou contactez kai@krakenpfm.ch.',
        it: 'Non è stato possibile inviare la richiesta. Riprova o contatta kai@krakenpfm.ch.',
        es: 'No se pudo enviar tu solicitud. Inténtalo de nuevo o escribe a kai@krakenpfm.ch.',
        pt: 'Não foi possível enviar o seu pedido. Tente novamente ou contacte kai@krakenpfm.ch.',
      };
      setStepError(messages[activeLang] || messages.de);
    }
  };

  const handleResetForm = () => {
    setContactSubmitted(false);
    setCurrentStep(1);
    setContactData({
      name: '',
      phone: '',
      email: '',
      service: 'Umzugsreinigung',
      message: ''
    });
    setStepError('');
  };

  const socialLinks = [
    { icon: WhatsAppIcon, href: 'https://wa.me/41774505705', label: 'WhatsApp' },
    { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
    { icon: LinkedInIcon, href: 'https://www.linkedin.com/company/krakenpfm/', label: 'LinkedIn' },
    { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
    { icon: XIcon, href: 'https://twitter.com', label: 'X (Twitter)' },
    { icon: YouTubeIcon, href: 'https://youtube.com', label: 'YouTube' },
    { icon: TikTokIcon, href: 'https://tiktok.com', label: 'TikTok' },
  ];

  return (
    <footer id="contact" className="bg-[#002D5B] text-white py-8 md:py-10 relative overflow-hidden border-t border-white/5">
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] -ml-40 -mb-40" />
        
        {/* Large Decorative Tentacle */}
        <img 
          src={tentacleImageUrl} 
          alt="Kraken PFM Mascot" 
          loading="lazy"
          decoding="async"
          className="absolute -top-20 -right-40 w-[600px] h-[600px] object-contain opacity-[0.06] rotate-[-15deg] pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Step-by-Step "Slide Input" Contact Form Block */}
        <div id="quick-contact" className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#001D3D] via-[#002B54] to-[#001D3D] border border-white/10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                <span>{slideI18n.badge}</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-white tracking-tight">
                {slideI18n.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold shrink-0">
              <a 
                href="tel:+41774505705" 
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer text-xs"
              >
                <PhoneIcon className="w-3.5 h-3.5" />
                <span>+41 77 450 57 05</span>
              </a>
              <a 
                href="https://wa.me/41774505705?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Offerte" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-all cursor-pointer text-xs"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {contactSubmitted ? (
            <div className="py-4 text-center animate-fade-in">
              <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-black">
                ✓
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                {slideI18n.successTitle}
              </h4>
              <p className="text-slate-300 text-xs max-w-md mx-auto mb-3 leading-relaxed">
                {slideI18n.successDesc(contactData.name, contactData.service)}
              </p>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-emerald-400 hover:underline font-bold cursor-pointer"
              >
                {slideI18n.btnReset}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Progress Bar & Saved Data Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                  <span className="text-emerald-400">{slideI18n.stepCount(currentStep, 5)}</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(stepNum => (
                      <div
                        key={stepNum}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          stepNum === currentStep 
                            ? 'w-6 bg-emerald-400' 
                            : stepNum < currentStep 
                            ? 'w-3 bg-emerald-600/70 cursor-pointer' 
                            : 'w-3 bg-white/15'
                        }`}
                        onClick={() => {
                          if (stepNum < currentStep) setCurrentStep(stepNum);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Interactive Saved Chips (Click to jump back) */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  {contactData.name && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-emerald-500/20 border border-white/15 hover:border-emerald-400/40 text-emerald-300 font-medium transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{contactData.name}</span>
                    </button>
                  )}
                  {contactData.phone && currentStep > 2 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-emerald-500/20 border border-white/15 hover:border-emerald-400/40 text-emerald-300 font-medium transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{contactData.phone}</span>
                    </button>
                  )}
                  {contactData.email && currentStep > 3 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-emerald-500/20 border border-white/15 hover:border-emerald-400/40 text-emerald-300 font-medium transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{contactData.email}</span>
                    </button>
                  )}
                  {contactData.service && currentStep > 4 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-emerald-500/20 border border-white/15 hover:border-emerald-400/40 text-emerald-300 font-medium transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{slideI18n.services.find(s => s.key === contactData.service)?.label || contactData.service}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message if any */}
              {stepError && (
                <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                  {stepError}
                </div>
              )}

              {/* Animated Slide Input Card */}
              <div className="relative overflow-hidden pt-1">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.form
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleNextStep}
                      className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5"
                    >
                      <div className="flex-1">
                        <label htmlFor="step-input-name" className="block text-xs font-bold text-slate-200 mb-1">
                          {slideI18n.stepNameLabel} <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          id="step-input-name"
                          type="text"
                          name="name"
                          value={contactData.name}
                          onChange={handleContactChange}
                          placeholder={slideI18n.stepNamePlaceholder}
                          autoFocus
                          required
                          className="w-full bg-slate-900/90 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] hover:from-[#3feb73] hover:to-[#1ecdb6] font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                      >
                        <span>{slideI18n.btnNext}</span>
                        <span className="font-bold">→</span>
                      </button>
                    </motion.form>
                  )}

                  {currentStep === 2 && (
                    <motion.form
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleNextStep}
                      className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5"
                    >
                      <div className="flex-1">
                        <label htmlFor="step-input-phone" className="block text-xs font-bold text-slate-200 mb-1">
                          {slideI18n.stepPhoneLabel} <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          id="step-input-phone"
                          type="tel"
                          name="phone"
                          value={contactData.phone}
                          onChange={handleContactChange}
                          placeholder={slideI18n.stepPhonePlaceholder}
                          autoFocus
                          required
                          className="w-full bg-slate-900/90 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl border border-white/15 transition-all cursor-pointer"
                        >
                          {slideI18n.btnBack}
                        </button>
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] hover:from-[#3feb73] hover:to-[#1ecdb6] font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <span>{slideI18n.btnNext}</span>
                          <span className="font-bold">→</span>
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {currentStep === 3 && (
                    <motion.form
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleNextStep}
                      className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5"
                    >
                      <div className="flex-1">
                        <label htmlFor="step-input-email" className="block text-xs font-bold text-slate-200 mb-1">
                          {slideI18n.stepEmailLabel} <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          id="step-input-email"
                          type="email"
                          name="email"
                          value={contactData.email}
                          onChange={handleContactChange}
                          placeholder={slideI18n.stepEmailPlaceholder}
                          autoFocus
                          required
                          className="w-full bg-slate-900/90 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl border border-white/15 transition-all cursor-pointer"
                        >
                          {slideI18n.btnBack}
                        </button>
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] hover:from-[#3feb73] hover:to-[#1ecdb6] font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <span>{slideI18n.btnNext}</span>
                          <span className="font-bold">→</span>
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2.5"
                    >
                      <label className="block text-xs font-bold text-slate-200">
                        {slideI18n.stepServiceLabel} <span className="text-emerald-400">*</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {slideI18n.services.map(s => (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => {
                              setContactData(prev => ({ ...prev, service: s.key }));
                              setCurrentStep(5);
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              contactData.service === s.key 
                                ? 'bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] border-emerald-400 shadow-md' 
                                : 'bg-white/5 hover:bg-white/15 text-white border-white/15'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded-xl border border-white/15 transition-all cursor-pointer"
                        >
                          {slideI18n.btnBack}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(5)}
                          className="bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] font-black text-xs uppercase tracking-wider py-2 px-4 rounded-xl transition-all cursor-pointer ml-auto flex items-center gap-1"
                        >
                          <span>{slideI18n.btnNext}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.form
                      key="step-5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleFinalSubmit}
                      className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5"
                    >
                      <div className="flex-1">
                        <label htmlFor="step-input-message" className="block text-xs font-bold text-slate-200 mb-1">
                          {slideI18n.stepMessageLabel}
                        </label>
                        <input
                          id="step-input-message"
                          type="text"
                          name="message"
                          value={contactData.message}
                          onChange={handleContactChange}
                          placeholder={slideI18n.stepMessagePlaceholder}
                          autoFocus
                          className="w-full bg-slate-900/90 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl border border-white/15 transition-all cursor-pointer"
                        >
                          {slideI18n.btnBack}
                        </button>
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] hover:from-[#3feb73] hover:to-[#1ecdb6] font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <span>{slideI18n.btnSubmit}</span>
                          <PaperAirplaneIcon className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Compact Footer Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 space-y-4"
          >
            <div className="flex flex-col gap-2">
              <img src={companyLogoWhiteUrl} alt="Kraken PFM Logo" loading="lazy" decoding="async" className="h-11 w-auto object-contain self-start" />
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Properties and</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Facilities Management</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xs">
              {t('footer.bench')}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a 
                  key={label} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 bg-white/5 ${label === 'WhatsApp' ? 'hover:bg-[#25D366]' : 'hover:bg-blue-600'} rounded-xl flex items-center justify-center transition-all border border-white/10 group shadow-lg`}
                >
                  <Icon className={`w-4 h-4 ${label === 'WhatsApp' ? 'group-hover:scale-110' : ''}`} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-black text-[9px] uppercase tracking-[0.3em] text-blue-400 mb-3">{t('footer.explore')}</h3>
              <ul className="space-y-1.5 text-xs font-bold text-slate-300">
                <li><a href="/services" onClick={(e) => { e.preventDefault(); onNavigate('services-page'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.services')}</a></li>
                <li><a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.about')}</a></li>
                <li><a href="/sustainability" onClick={(e) => { e.preventDefault(); onNavigate('sustainability-page'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.green')}</a></li>
                <li><a href="/" onClick={(e) => { e.preventDefault(); onNavigate('clients'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.partner')}</a></li>
                <li><a href="/blog" onClick={(e) => { e.preventDefault(); onNavigate('blog'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('nav.blog')}</a></li>
                <li><a href="/kontakt" onClick={(e) => { e.preventDefault(); onNavigate('kontakt'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('nav.contact')}</a></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="font-black text-[9px] uppercase tracking-[0.3em] text-blue-400 mb-3">{t('footer.coverage')}</h3>
              <ul className="space-y-1.5 text-xs font-bold text-slate-300">
                <li><a href="/reinigung/region-zuerich" onClick={(e) => { e.preventDefault(); onNavigate('/reinigung/region-zuerich'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{regionNames.zuerich}</a></li>
                <li><a href="/reinigung/region-winterthur" onClick={(e) => { e.preventDefault(); onNavigate('/reinigung/region-winterthur'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{regionNames.winterthur}</a></li>
                <li><a href="/reinigung/kanton-schaffhausen" onClick={(e) => { e.preventDefault(); onNavigate('/reinigung/kanton-schaffhausen'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{regionNames.schaffhausen}</a></li>
                <li><a href="/einsatzgebiete" onClick={(e) => { e.preventDefault(); onNavigate('/einsatzgebiete'); }} className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 group text-left mt-2 border-t border-white/5 pt-2"><span className="w-1 h-1 rounded-full bg-blue-400" />{t('footer.allLocations')}</a></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-black text-[9px] uppercase tracking-[0.3em] text-blue-400 mb-3">{t('footer.legal')}</h3>
              <ul className="space-y-1.5 text-xs font-bold text-slate-300">
                <li><a href="/gdpr" onClick={(e) => { e.preventDefault(); onNavigate('gdpr'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.privacy')}</a></li>
                <li><a href="/impressum" onClick={(e) => { e.preventDefault(); onNavigate('impressum'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.impressum')}</a></li>
                <li><a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.terms')}</a></li>
                <li><a href="/hse" onClick={(e) => { e.preventDefault(); onNavigate('hse'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.hse')}</a></li>
                <li><a href="/careers" onClick={(e) => { e.preventDefault(); onNavigate('careers'); }} className="hover:text-white transition-colors flex items-center gap-1.5 group"><span className="w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.careers')}</a></li>
              </ul>
            </motion.div>
          </div>

          {/* Newsletter Column */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-3"
          >
            <h3 className="font-black text-[9px] uppercase tracking-[0.3em] text-blue-400">{t('footer.join')}</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">{t('footer.sub')}</p>
            <form onSubmit={handleNewsletterSubmit} className="relative group">
              <input 
                type="email" 
                placeholder={t('footer.placeholder')} 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-xs font-medium outline-none focus:border-blue-400 transition-all focus:bg-white/10 text-white"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <motion.button 
                type="submit" 
                disabled={status === 'loading'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors shadow-md active:scale-90 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <PaperAirplaneIcon className="w-3.5 h-3.5" />
                )}
              </motion.button>
            </form>
            {status === 'success' && <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter animate-fade-in">Welcome aboard! Check your inbox.</p>}
            {status === 'error' && <p className="text-[10px] text-rose-400 font-black uppercase tracking-tighter animate-fade-in">Something failed. Try again.</p>}
          </motion.div>

        </div>

        {/* Address and Contacts Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-white/5 mb-4">
           <div className="flex gap-3 items-center">
              <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-sm shadow-md border border-white/10">📍</div>
              <div>
                <p className="text-[9px] font-black uppercase text-blue-400 tracking-[0.3em] mb-0.5">{t('footer.base')}</p>
                <p className="text-xs font-bold text-white">Seewadelstrasse 3, 8203 Schaffhausen</p>
              </div>
           </div>
           
           <div className="flex gap-3 items-center">
              <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-sm shadow-md border border-white/10">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase text-[#25D366] tracking-[0.3em] flex items-center gap-1.5 mb-0.5">
                    {t('footer.connect')}
                    <span className="inline-block w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                </p>
                <div className="flex items-center gap-2">
                  <a href="tel:+41774505705" className="text-xs font-bold hover:text-emerald-400 transition-colors text-white">
                      +41 77 450 57 05
                  </a>
                  <a href="https://wa.me/41774505705?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Offerte" target="_blank" rel="noopener noreferrer" className="text-[9px] bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 px-2 py-0.5 rounded uppercase tracking-wider font-extrabold transition-colors">
                      WhatsApp
                  </a>
                </div>
              </div>
           </div>

           <div className="flex gap-3 items-center">
              <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-sm shadow-md border border-white/10">✉️</div>
              <div>
                <p className="text-[9px] font-black uppercase text-blue-400 tracking-[0.3em] mb-0.5">{t('footer.inbox')}</p>
                <a href="mailto:kai@krakenpfm.ch" className="text-xs font-bold hover:text-blue-400 transition-colors text-white">kai@krakenpfm.ch</a>
              </div>
           </div>
        </div>
        
        {/* Bottom Copyright & CO2 Badge */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
             <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">{t('footer.all_rights')}</p>
             <button 
                onClick={() => onNavigate('sustainability-page')}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/10 transition-all cursor-pointer"
             >
                <LeafIcon className="w-3 h-3 text-emerald-500" />
                <span>{t('footer.co2', { count: co2Value.toFixed(2) })}</span>
             </button>
          </div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">{t('footer.precision')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
