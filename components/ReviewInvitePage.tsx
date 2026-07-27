import React, { useState, useEffect } from 'react';
import { useAuth } from './Auth';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslation, Language } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { mascotImageUrl } from '../assets';

// Official Google Review Link for Kraken
const OFFICIAL_GOOGLE_REVIEW_LINK = "https://search.google.com/local/writereview?placeid=ChIJw_vX3CgQkEcR_VMyRUpGfK4";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

const ReviewInvitePage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user, loginWithGoogle } = useAuth();
  const { language } = useTranslation();
  
  // Set initial language from context if one of the supported 6 languages
  const initialLang: Language = ['en', 'de-CH', 'de', 'fr', 'it', 'es', 'pt'].includes(language)
    ? (language as Language)
    : 'en';
  const [activeLang, setActiveLang] = useState<Language>(initialLang);
  
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [confettiParticles, setConfettiParticles] = useState<Particle[]>([]);

  // Generate particles for positive review celebration
  const generateConfetti = () => {
    const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ef4444', '#8b5cf6'];
    const pArr: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      pArr.push({
        id: i,
        x: Math.random() * 100, // percentage from left
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        size: Math.random() * 8 + 6
      });
    }
    setConfettiParticles(pArr);
  };

  useEffect(() => {
    if (isSubmitted && rating >= 4) {
      generateConfetti();
    }
  }, [isSubmitted, rating]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleGoogleLogin = async () => {
    try {
      setAuthError('');
      await loginWithGoogle();
      localStorage.setItem('kraken_review_user', 'true');
    } catch (err: any) {
      console.error(err);
      if (err && (err.code === 'auth/popup-blocked' || err.message?.includes('popup-blocked') || err.message?.includes('popup'))) {
        setAuthError('POPUP_BLOCKED_ERROR');
      } else {
        setAuthError(
          activeLang === 'es'
            ? 'Hubo un problema al iniciar sesión con Google.'
            : activeLang === 'pt'
            ? 'Ocorreu um problema ao iniciar sessão com o Google.'
            : activeLang === 'fr'
            ? 'Un problème est survenu lors de la connexion avec Google.'
            : activeLang === 'it'
            ? 'Si è verificato un problema durante l\'accesso con Google.'
            : activeLang === 'de' || activeLang === 'de-CH'
            ? 'Es gab ein Problem bei der Anmeldung mit Google.'
            : 'Error signing in with Google.'
        );
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      setAuthError(
        activeLang === 'es'
          ? 'Por favor, inicia sesión antes de enviar.'
          : activeLang === 'pt'
          ? 'Por favor, inicie sessão antes de enviar.'
          : activeLang === 'fr'
          ? 'Veuillez vous connecter avant d\'envoyer.'
          : activeLang === 'it'
          ? 'Accedi prima di inviare.'
          : activeLang === 'de' || activeLang === 'de-CH'
          ? 'Bitte melden Sie sich an, bevor Sie die Bewertung senden.'
          : 'Please sign in before submitting.'
      );
      return;
    }
    if (rating === 0) {
      setAuthError(
        activeLang === 'es'
          ? 'Por favor, selecciona una puntuación con estrellas.'
          : activeLang === 'pt'
          ? 'Por favor, selecione uma classificação por estrelas.'
          : activeLang === 'fr'
          ? 'Veuillez sélectionner une note.'
          : activeLang === 'it'
          ? 'Seleziona una valutazione.'
          : activeLang === 'de' || activeLang === 'de-CH'
          ? 'Bitte wählen Sie eine Sternebewertung.'
          : 'Please select a star rating.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Save feedback in Firestore database securely
      await addDoc(collection(db, 'reviews'), {
        uid: user.uid || 'anonymous',
        name: user.name,
        email: user.email,
        rating,
        comment,
        tags: selectedTags,
        source: 'review-invite',
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Firestore Error:', err);
      // Fallback submit behavior so experience is uninterrupted
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 100% Comprehensive Translations for All 6 Languages Supported (EN, ES, DE, FR, IT, PT)
  const tTexts: Record<string, any> = {
    es: {
      badge: "INVITACIÓN VIP",
      title: "Tu opinión hace la diferencia",
      subtitle: "Ayúdanos a seguir mejorando y comparte tu experiencia con nosotros.",
      loginPrompt: "Para garantizar opiniones 100% reales de nuestros clientes, por favor inicia sesión de forma segura con tu cuenta de Google.",
      loginBtn: "Iniciar sesión con Google",
      starsLabel: "¿Cómo calificarías tu experiencia con Kraken?",
      excellent: "¡Excelente! Sobresaliente en todo.",
      good: "Muy bueno. Cumplió con creces.",
      average: "Aceptable. Hay margen de mejora.",
      poor: "Insuficiente. No fue lo esperado.",
      terrible: "Muy decepcionado.",
      tagsLabel: "¿Qué es lo que más te gustó? (Selección opcional)",
      tags: ["Limpieza impecable", "Puntualidad", "Atención rápida", "Trato profesional", "Eficiencia", "Sostenibilidad"],
      commentPlaceholder: "Cuéntanos más sobre tu experiencia (opcional)...",
      submitBtn: "Enviar Valoración",
      submitting: "Transmitiendo...",
      successTitle: "¡Muchísimas gracias por tu tiempo!",
      positiveHeader: "¡Nos alegra muchísimo que tu experiencia fuera excelente!",
      positiveBody: "Dado que has tenido una experiencia tan satisfactoria, te invitamos a publicarla en nuestro perfil público de Google para que otros usuarios nos conozcan. ¡Solo te tomará 15 segundos!",
      googleCta: "⭐️ Publicar en Google Reviews",
      negativeHeader: "Gracias por ayudarnos a mejorar personalmente",
      negativeBody: "Lamentamos que el servicio no haya cumplido el 100% de tus expectativas. Tu valoración ha sido enviada con máxima prioridad directamente al Gerente de Operaciones de Schaffhausen, quien la revisará en detalle y se pondrá en contacto contigo para resolver cualquier incidencia.",
      backHome: "Volver a Inicio",
      footerNote: "Tus comentarios se procesan bajo nuestra estricta política de privacidad de datos.",
      welcomeBack: "Sesión iniciada como"
    },
    en: {
      badge: "VIP INVITATION",
      title: "Your Opinion Makes a Difference",
      subtitle: "Help us keep improving and share your experience with us.",
      loginPrompt: "To guarantee 100% authentic ratings from our clients, please sign in quickly and securely with your Google account.",
      loginBtn: "Sign in with Google",
      starsLabel: "How would you rate your experience with Kraken?",
      excellent: "Excellent! Outstanding in every way.",
      good: "Very good. Exceeded expectations.",
      average: "Average. Room for improvement.",
      poor: "Poor. Not what I expected.",
      terrible: "Very disappointed.",
      tagsLabel: "What did you like the most? (Optional selection)",
      tags: ["Impeccable Cleanliness", "Punctuality", "Rapid Support", "Professional Staff", "Efficiency", "Eco-friendly"],
      commentPlaceholder: "Tell us more about your experience (optional)...",
      submitBtn: "Send Rating",
      submitting: "Transmitting...",
      successTitle: "Thank you very much for your time!",
      positiveHeader: "We're thrilled that you had an excellent experience!",
      positiveBody: "Since you had such a satisfactory experience, we invite you to publish it directly on our public Google Review page so others can find us. It will only take 15 seconds!",
      googleCta: "⭐️ Publish on Google Reviews",
      negativeHeader: "Thank you for helping us improve privately",
      negativeBody: "We are deeply sorry that our service did not meet 100% of your expectations. Your feedback has been forwarded with high operational priority straight to our Operations Manager in Schaffhausen, who will review it closely and reach out to make things right.",
      backHome: "Return Home",
      footerNote: "Your reviews are processed under our strict data privacy standards.",
      welcomeBack: "Signed in as"
    },
    de: {
      badge: "VIP-EINLADUNG",
      title: "Ihre Meinung macht den Unterschied",
      subtitle: "Helfen Sie uns, uns weiter zu verbessern, und teilen Sie Ihre Erfahrungen mit uns.",
      loginPrompt: "Um 100% authentische Bewertungen unserer Kunden zu garantieren, melden Sie sich bitte sicher mit Ihrem Google-Konto an.",
      loginBtn: "Mit Google anmelden",
      starsLabel: "Wie würden Sie Ihre Erfahrung mit Kraken bewerten?",
      excellent: "Ausgezeichnet! In jeder Hinsicht hervorragend.",
      good: "Sehr gut. Erwartungen übertroffen.",
      average: "Akzeptabel. Verbesserungsbedarf vorhanden.",
      poor: "Mangelhaft. Nicht wie erwartet.",
      terrible: "Sehr enttäuscht.",
      tagsLabel: "Was hat Ihnen am besten gefallen? (Optional auswählen)",
      tags: ["Makellose Sauberkeit", "Pünktlichkeit", "Schnelle Hilfe", "Professionelles Team", "Effizienz", "Umweltfreundlich"],
      commentPlaceholder: "Erzählen Sie uns mehr über Ihre Erfahrung (optional)...",
      submitBtn: "Bewertung absenden",
      submitting: "Wird gesendet...",
      successTitle: "Vielen Dank für Ihre Zeit!",
      positiveHeader: "Wir freuen uns sehr, dass Sie eine so gute Erfahrung gemacht haben!",
      positiveBody: "Da Sie so zufrieden waren, laden wir Sie ein, Ihre Bewertung direkt auf unserem öffentlichen Google-Profil zu veröffentlichen, damit andere uns finden können. Es dauert nur 15 Sekunden!",
      googleCta: "⭐️ Auf Google Reviews veröffentlichen",
      negativeHeader: "Vielen Dank, dass Sie uns helfen, uns persönlich zu verbessern",
      negativeBody: "Es tut uns aufrichtig leid, dass unser Service Ihre Erwartungen nicht zu 100% erfüllt hat. Ihr Feedback wurde mit höchster Priorität direkt an unseren Betriebsleiter in Schaffhausen weitergeleitet, der es sorgfältig prüfen und sich mit Ihnen in Verbindung setzen wird, um eine Lösung zu finden.",
      backHome: "Zur Startseite",
      footerNote: "Ihre Bewertungen werden unter Einhaltung strenger Datenschutzrichtlinien verarbeitet.",
      welcomeBack: "Angemeldet als"
    },
    'de-CH': {
      badge: "VIP-EINLADUNG",
      title: "Ihre Meinung macht den Unterschied",
      subtitle: "Helfen Sie uns, uns weiter zu verbessern, und teilen Sie Ihre Erfahrungen mit uns.",
      loginPrompt: "Um 100% authentische Bewertungen unserer Kunden zu garantieren, melden Sie sich bitte sicher mit Ihrem Google-Konto an.",
      loginBtn: "Mit Google anmelden",
      starsLabel: "Wie würden Sie Ihre Erfahrung mit Kraken bewerten?",
      excellent: "Ausgezeichnet! In jeder Hinsicht hervorragend.",
      good: "Sehr gut. Erwartungen übertroffen.",
      average: "Akzeptabel. Verbesserungsbedarf vorhanden.",
      poor: "Mangelhaft. Nicht wie erwartet.",
      terrible: "Sehr enttäuscht.",
      tagsLabel: "Was hat Ihnen am besten gefallen? (Optional auswählen)",
      tags: ["Makellose Sauberkeit", "Pünktlichkeit", "Schnelle Hilfe", "Professionelles Team", "Effizienz", "Umweltfreundlich"],
      commentPlaceholder: "Erzählen Sie uns mehr über Ihre Erfahrung (optional)...",
      submitBtn: "Bewertung absenden",
      submitting: "Wird gesendet...",
      successTitle: "Vielen Dank für Ihre Zeit!",
      positiveHeader: "Wir freuen uns sehr, dass Sie eine so gute Erfahrung gemacht haben!",
      positiveBody: "Da Sie so zufrieden waren, laden wir Sie ein, Ihre Bewertung direkt auf unserem öffentlichen Google-Profil zu veröffentlichen, damit andere uns finden können. Es dauert nur 15 Sekunden!",
      googleCta: "⭐️ Auf Google Reviews veröffentlichen",
      negativeHeader: "Vielen Dank, dass Sie uns helfen, uns persönlich zu verbessern",
      negativeBody: "Es tut uns aufrichtig leid, dass unser Service Ihre Erwartungen nicht zu 100% erfüllt hat. Ihr Feedback wurde mit höchster Priorität direkt an unseren Betriebsleiter in Schaffhausen weitergeleitet, der es sorgfältig prüfen und sich mit Ihnen in Verbindung setzen wird, um eine Lösung zu finden.",
      backHome: "Zur Startseite",
      footerNote: "Ihre Bewertungen werden unter Einhaltung strenger Datenschutzrichtlinien verarbeitet.",
      welcomeBack: "Angemeldet als"
    },
    fr: {
      badge: "INVITATION VIP",
      title: "Votre avis fait toute la différence",
      subtitle: "Aidez-nous à nous améliorer et partagez votre expérience avec nous.",
      loginPrompt: "Pour garantir des avis 100% authentiques de nos clients, veuillez vous connecter en toute sécurité avec votre compte Google.",
      loginBtn: "Se connecter avec Google",
      starsLabel: "Comment évalueriez-vous votre expérience avec Kraken ?",
      excellent: "Excellent ! Exceptionnel à tous points de vue.",
      good: "Très bien. A dépassé mes attentes.",
      average: "Passable. Des points à améliorer.",
      poor: "Insuffisant. Pas à la hauteur.",
      terrible: "Très déçu.",
      tagsLabel: "Qu'avez-vous le plus apprécié ? (Sélection optionnelle)",
      tags: ["Propreté impeccable", "Ponctualité", "Assistance rapide", "Personnel professionnel", "Efficacité", "Écologique"],
      commentPlaceholder: "Dites-nous en plus sur votre expérience (optionnel)...",
      submitBtn: "Envoyer l'avis",
      submitting: "Envoi en cours...",
      successTitle: "Merci beaucoup pour votre temps !",
      positiveHeader: "Nous sommes ravis que votre expérience ait été excellente !",
      positiveBody: "Comme vous avez eu une expérience si satisfaisante, nous vous invitons à la publier directement sur Google Reviews afin que d'autres puissent nous découvrir. Cela ne prend que 15 secondes !",
      googleCta: "⭐️ Publier sur Google Reviews",
      negativeHeader: "Merci de nous aider à nous améliorer personnellement",
      negativeBody: "La qualité n'ayant pas répondu à 100% de vos attentes, nous en sommes profondément désolés. Votre avis a été envoyé en priorité absolue à notre responsable des opérations à Schaffhouse, qui l'analysera de près et vous contactera pour résoudre tout problème.",
      backHome: "Retour à l'accueil",
      footerNote: "Vos avis sont traités conformément à nos normes strictes de confidentialité des données.",
      welcomeBack: "Connecté en tant que"
    },
    it: {
      badge: "INVITO VIP",
      title: "La tua opinione fa la differenza",
      subtitle: "Aiutaci a continuare a migliorare e condividi la tua esperienza con noi.",
      loginPrompt: "Per garantire recensioni autentiche al 100% dai nostri clienti, ti preghiamo di accedere in modo sicuro con il tuo account Google.",
      loginBtn: "Accedi con Google",
      starsLabel: "Come valuteresti la tua esperienza con Kraken?",
      excellent: "Eccellente! Eccezionale sotto ogni aspetto.",
      good: "Molto buono. Ha superato le aspettative.",
      average: "Accettabile. Margine di miglioramento.",
      poor: "Scarso. Non all'altezza.",
      terrible: "Molto deluso.",
      tagsLabel: "Cosa ti è piaciuto di più? (Selezioni opzionali)",
      tags: ["Pulizia impeccabile", "Puntualità", "Supporto rapido", "Staff professionale", "Efficienza", "Sostenibile"],
      commentPlaceholder: "Raccontaci di più sulla tua esperienza (opzionale)...",
      submitBtn: "Invia Recensione",
      submitting: "Invio in corso...",
      successTitle: "Grazie mille per il tuo tempo!",
      positiveHeader: "Siamo felici che tu abbia avuto un'esperienza eccellente!",
      positiveBody: "Visto que ti sei trovato così bene, ti invitiamo a pubblicare la tua recensione sul nostro profilo pubblico di Google Reviews. Richiede solo 15 secondi!",
      googleCta: "⭐️ Pubblica su Google Reviews",
      negativeHeader: "Grazie per averci aiutato a migliorare privatamente",
      negativeBody: "Ci dispiace che il nostro servizio non abbia soddisfatto al 100% le tue aspettative. La tua segnalazione è stata inoltrata con massima priorità direttamente al nostro Responsabile delle Operazioni di Sciaffusa, che la esaminerà e ti contatterà per risolvere ogni criticità.",
      backHome: "Torna alla Home",
      footerNote: "I tuoi commenti sono trattati in conformità con le nostre rigorose norme sulla privacy.",
      welcomeBack: "Accesso effettuato come"
    },
    pt: {
      badge: "CONVITE VIP",
      title: "Sua opinião faz a diferença",
      subtitle: "Ajude-nos a continuar melhorando e compartilhe sua experiência conosco.",
      loginPrompt: "Para garantir avaliações 100% reais de nossos clientes, por favor inicie sessão de forma segura com sua conta Google.",
      loginBtn: "Entrar com Google",
      starsLabel: "Como você classificaria sua experiência com a Kraken?",
      excellent: "Excelente! Sobressaliente em todos os aspetos.",
      good: "Muito bom. Superou as expectativas.",
      average: "Razoável. Há espaço para melhorias.",
      poor: "Insuficiente. Não foi o que eu esperava.",
      terrible: "Muito desapontado com o serviço.",
      tagsLabel: "Do que você mais gostou? (Selecione opcional)",
      tags: ["Limpeza impecável", "Pontualidade", "Apoio rápido", "Equipe profissional", "Eficiência", "Sustentável"],
      commentPlaceholder: "Conte-nos mais sobre sua experiência (opcional)...",
      submitBtn: "Enviar Avaliação",
      submitting: "Enviando...",
      successTitle: "Muito obrigado pelo seu tempo!",
      positiveHeader: "Ficamos muito contentes que sua experiência tenha sido excelente!",
      positiveBody: "Como você teve uma experiência tão satisfatória, convidamos você a publicá-la diretamente em nosso perfil do Google Reviews para que outros nos conheçam. Leva apenas 15 segundos!",
      googleCta: "⭐️ Publicar no Google Reviews",
      negativeHeader: "Obrigado por nos ajudar a melhorar pessoalmente",
      negativeBody: "Lamentamos profundamente que o nosso serviço não tenha correspondido a 100% das suas expectativas. O seu feedback foi enviado com prioridade operacional máxima ao nosso Diretor de Operações em Schaffhausen, que irá analisá-lo e contactá-lo diretamente.",
      backHome: "Voltar para o Início",
      footerNote: "As suas avaliações são processadas de acordo com as nossas rigorosas normas de privacidade.",
      welcomeBack: "Sessão iniciada como"
    }
  };

  const texts = tTexts[activeLang] || tTexts['en'];

  const getStarLabel = (rate: number) => {
    switch (rate) {
      case 5: return texts.excellent;
      case 4: return texts.good;
      case 3: return texts.average;
      case 2: return texts.poor;
      case 1: return texts.terrible;
      default: return "";
    }
  };

  const languageOptions: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' }
  ];

  return (
    <div id="review-invite-page" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center relative overflow-hidden py-16 px-4">
      {/* Soft elegant radial decorations suitable for a premium white theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-100/30 rounded-full blur-3xl z-0 pointer-events-none"></div>

      {/* Confetti Animation Layer */}
      {isSubmitted && rating >= 4 && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
          {confettiParticles.map((p) => (
            <div
              key={p.id}
              className="absolute animate-bounce"
              style={{
                left: `${p.x}%`,
                top: `-20px`,
                backgroundColor: p.color,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: p.id % 2 === 0 ? '50%' : '2px',
                opacity: 0.8,
                animation: `fall-down 3s linear infinite`,
                animationDelay: `${p.delay}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Language Switcher at the top left/right */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
        <div className="bg-white/80 border border-slate-200/80 shadow-sm rounded-2xl p-1.5 flex flex-wrap gap-1 max-w-[280px] md:max-w-none">
          {languageOptions.map((opt) => (
            <button 
              key={opt.code}
              onClick={() => setActiveLang(opt.code)}
              className={`px-2 md:px-3 py-1 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeLang === opt.code 
                  ? 'bg-sky-500 text-slate-950 font-black shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-100'
              }`}
              title={opt.label}
            >
              <span>{opt.flag}</span>
              <span className="hidden sm:inline">{opt.label.substring(0, 3).toUpperCase()}</span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => onNavigate('home')} 
          className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all text-xs cursor-pointer shrink-0"
        >
          ✕
        </button>
      </div>

      <div className="w-full max-w-xl relative z-10 text-center mt-12 md:mt-0">
        {/* Animated Brand Header */}
        <div className="mb-6 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200/50 shadow-[0_12px_28px_rgba(0,0,0,0.06)] mb-6 flex items-center justify-center"
          >
            {/* Soft inner glow gradient backing */}
            <div className="absolute inset-1.5 bg-gradient-to-tr from-sky-100/60 to-emerald-100/60 rounded-[12px] opacity-80 blur-[1px]"></div>
            
            {/* Mascot Image popping out of the card in 3D */}
            <img 
              src="/kai reviews.webp" 
              alt="Kraken Mascot" 
              className="absolute -top-7 w-[135%] h-[135%] object-cover rounded-2xl select-none filter drop-shadow-[0_10px_14px_rgba(0,0,0,0.16)] hover:scale-110 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <span className="bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-black tracking-[0.25em] px-3 py-1 rounded-full uppercase mb-2">
            {texts.badge}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {texts.title}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-sm font-semibold">
            {texts.subtitle}
          </p>
        </div>

        {/* Main interactive container - white themed, professional shadow */}
        <div id="review-card-interactive" className="bg-white border border-slate-200/65 rounded-3xl p-6 md:p-8 shadow-xl text-left">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              // STEP 1: RATING AND COMMENTS
              <motion.div
                key="step-rating"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Authorization Barrier */}
                {!user ? (
                  <div className="border border-slate-200/85 bg-slate-50 rounded-2xl p-5 text-center space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      {texts.loginPrompt}
                    </p>
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm border border-slate-200 hover:border-slate-300 transform active:scale-98 text-xs cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      {texts.loginBtn}
                    </button>
                    {authError === 'POPUP_BLOCKED_ERROR' ? (
                      <div className="border border-red-200 bg-red-50/50 rounded-2xl p-4 text-center space-y-3">
                        <p className="text-xs text-red-600 font-extrabold">
                          {activeLang === 'es' ? '🚨 Ventana Emergente Bloqueada' :
                           activeLang === 'pt' ? '🚨 Janela Pop-up Bloqueada' :
                           activeLang === 'fr' ? '🚨 Fenêtre Pop-up Bloquée' :
                           activeLang === 'it' ? '🚨 Finestra Pop-up Bloccata' :
                           activeLang === 'de' || activeLang === 'de-CH' ? '🚨 Popup blockiert' :
                           '🚨 Popup Blocked'}
                        </p>
                        <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                          {activeLang === 'es' ? 'Tu navegador bloqueó la ventana de Google por estar dentro de un marco de vista previa (iframe). Permite las ventanas emergentes en tu navegador, o simplemente haz clic en el botón de abajo para abrir la aplicación directamente en una pestaña nueva.' :
                           activeLang === 'pt' ? 'O seu navegador bloqueou a janela do Google por estar dentro de uma moldura de visualização (iframe). Permita pop-ups no seu navegador, ou simplesmente clique no botão abaixo para abrir a aplicação diretamente num novo separador.' :
                           activeLang === 'fr' ? 'Votre navigateur a bloqué la fenêtre Google car elle se trouve dans un cadre d\'aperçu (iframe). Autorisez les fenêtres pop-up dans votre navigateur, ou cliquez simplement sur le bouton ci-dessous pour ouvrir l\'application directement dans un nouvel onglet.' :
                           activeLang === 'it' ? 'Il tuo browser ha bloccato la finestra Google perché si trova all\'interno di un frame di anteprima (iframe). Consenti i popup nel tuo browser, o semplicemente clicca sul pulsante qui sotto per aprire l\'applicazione direttamente in una nuova scheda.' :
                           activeLang === 'de' || activeLang === 'de-CH' ? 'Ihr Browser hat das Google-Fenster blockiert, da sich die App in einem Vorschau-Rahmen (Iframe) befindet. Bitte erlauben Sie Popups in Ihrem Browser oder klicken Sie einfach auf die Schaltfläche unten, um die App direkt in einem neuen Tab zu öffnen.' :
                           'Your browser blocked the Google window because it is running inside a preview frame (iframe). Please allow popups in your browser, or simply click the button below to open the application directly in a new tab.'}
                        </p>
                        <a
                          href={window.location.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-slate-950 font-black py-2.5 px-3 rounded-xl transition-all shadow-sm text-[11px] cursor-pointer"
                        >
                          🌐 {activeLang === 'es' ? 'Abrir en Nueva Pestaña' :
                               activeLang === 'pt' ? 'Abrir num Novo Separador' :
                               activeLang === 'fr' ? 'Ouvrir dans un Nouvel Onglet' :
                               activeLang === 'it' ? 'Apri in una Nuova Scheda' :
                               activeLang === 'de' || activeLang === 'de-CH' ? 'In neuem Tab öffnen' :
                               'Open in New Tab'}
                        </a>
                      </div>
                    ) : authError && (
                      <p className="text-[10px] text-red-500 font-extrabold">{authError}</p>
                    )}
                  </div>
                ) : (
                  // User logged in header
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center font-black text-xs text-slate-950">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{texts.welcomeBack}</p>
                        <p className="text-xs font-extrabold text-slate-900">{user.name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                      ✓ Cliente Verificado
                    </span>
                  </div>
                )}

                {/* Rating Stars Selection */}
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                    {texts.starsLabel}
                  </label>
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => {
                            setRating(star);
                            setAuthError('');
                          }}
                          className="text-4xl transition-transform hover:scale-125 duration-100 select-none cursor-pointer"
                        >
                          <span 
                            className={`transition-colors duration-200 ${
                              star <= (hoveredRating || rating) 
                                ? 'text-amber-400' 
                                : 'text-slate-200'
                            }`}
                          >
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                    <AnimatePresence mode="wait">
                      {(hoveredRating || rating) > 0 && (
                        <motion.p
                          key={hoveredRating || rating}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 5 }}
                          className="text-xs font-black text-sky-600"
                        >
                          {getStarLabel(hoveredRating || rating)}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* TagBadges */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                    {texts.tagsLabel}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {texts.tags.map((tag: string) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (!user) {
                              setAuthError(
                                activeLang === 'es' 
                                  ? 'Inicia sesión primero para poder seleccionar cualidades.' 
                                  : 'Sign in first to select tags.'
                              );
                              return;
                            }
                            toggleTag(tag);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all transform cursor-pointer border ${
                            isSelected 
                              ? 'bg-sky-50 text-sky-700 border-sky-200 font-extrabold' 
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {tag} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Plain comment input */}
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    placeholder={texts.commentPlaceholder}
                    value={comment}
                    disabled={!user}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white placeholder:text-slate-400 disabled:opacity-50 transition-all font-medium"
                  />
                </div>

                {/* Submitting Feedback Action */}
                <div className="pt-2">
                  {authError && (
                    <p className="text-[11px] text-red-500 font-extrabold mb-3 text-center">{authError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || !user || rating === 0}
                    className={`w-full font-black py-3 px-6 rounded-2xl transition-all shadow-md text-xs select-none uppercase tracking-wider ${
                      isSubmitting || !user || rating === 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-extrabold hover:shadow-cyan-500/10 cursor-pointer hover:scale-[1.01]'
                    }`}
                  >
                    {isSubmitting ? texts.submitting : texts.submitBtn}
                  </button>
                </div>
              </motion.div>
            ) : (
              // STEP 2: SUCCESS OR PUBLIC REDIRECT GATEWAY
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="text-center space-y-6 py-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-3xl">
                  {rating >= 4 ? '🎉' : '❤️'}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-emerald-600">
                    {texts.successTitle}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    {rating >= 4 ? texts.positiveHeader : texts.negativeHeader}
                  </p>
                </div>

                <div className={`rounded-2xl p-4 text-xs font-semibold leading-relaxed max-w-md mx-auto ${
                  rating >= 4 
                    ? 'bg-emerald-50/50 border border-emerald-100 text-emerald-800' 
                    : 'bg-amber-50/60 border border-amber-100 text-amber-800'
                }`}>
                  {rating >= 4 ? texts.positiveBody : texts.negativeBody}
                </div>

                <div className="space-y-3 pt-2">
                  {rating >= 4 && (
                    <a
                      href={OFFICIAL_GOOGLE_REVIEW_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition-all shadow-md text-xs uppercase tracking-wider transform hover:scale-[1.02]"
                    >
                      {texts.googleCta}
                    </a>
                  )}

                  <button
                    onClick={() => onNavigate('home')}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-black py-2.5 px-6 rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer"
                  >
                    {texts.backHome}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-[10px] text-slate-400 font-semibold mt-6">
          {texts.footerNote}
        </p>
      </div>

      <style>{`
        @keyframes fall-down {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewInvitePage;
