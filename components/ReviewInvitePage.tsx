import React, { useState, useEffect } from 'react';
import { useAuth } from './Auth';
import { db, sanitizeFirestoreData } from './firebase';
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

    setAuthError('');
    setIsSubmitting(true);
    try {
      // Save feedback in Firestore database securely
      await addDoc(collection(db, 'reviews'), sanitizeFirestoreData({
        uid: user.uid || 'anonymous',
        name: user.name || '',
        email: user.email || '',
        rating,
        comment: comment || '',
        tags: selectedTags || [],
        source: 'review-invite',
        createdAt: serverTimestamp()
      }));
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Firestore Error:', err);
      const messages: Record<string, string> = {
        de: 'Ihre Bewertung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
        'de-CH': 'Ihre Bewertung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
        en: 'Your review could not be saved. Please try again.',
        fr: 'Votre avis n’a pas pu être enregistré. Veuillez réessayer.',
        it: 'Non è stato possibile salvare la recensione. Riprova.',
        es: 'No se pudo guardar tu valoración. Inténtalo de nuevo.',
        pt: 'Não foi possível guardar a sua avaliação. Tente novamente.',
      };
      setAuthError(messages[activeLang] || messages.en);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 100% Comprehensive Translations for All 6 Languages Supported (EN, ES, DE, FR, IT, PT)
  const tTexts: Record<string, any> = {
    es: {
      badge: "Tu valoración",
      title: "Tu opinión hace la diferencia",
      subtitle: "Ayúdanos a seguir mejorando y comparte tu experiencia con nosotros.",
      loginPrompt: "Inicia sesión con Google para enviar tu valoración.",
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
      positiveBody: "Tu valoración se ha guardado. Si lo deseas, también puedes compartir tu experiencia en Google.",
      googleCta: "⭐️ Publicar en Google Reviews",
      negativeHeader: "Gracias por compartir tu experiencia.",
      negativeBody: "Tu valoración se ha guardado. Gracias por contarnos qué podemos mejorar.",
      backHome: "Volver a Inicio",
      footerNote: "Consulta nuestra política de privacidad para saber cómo tratamos tus datos.",
      welcomeBack: "Sesión iniciada como"
    },
    en: {
      badge: "Your feedback",
      title: "Your Opinion Makes a Difference",
      subtitle: "Help us keep improving and share your experience with us.",
      loginPrompt: "Sign in with Google to send your review.",
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
      positiveBody: "Your review was saved. If you wish, you can also share your experience on Google.",
      googleCta: "⭐️ Publish on Google Reviews",
      negativeHeader: "Thank you for sharing your experience.",
      negativeBody: "Your review was saved. Thank you for letting us know what we can improve.",
      backHome: "Return Home",
      footerNote: "See our privacy policy for information about how we handle your data.",
      welcomeBack: "Signed in as"
    },
    de: {
      badge: "Ihre Bewertung",
      title: "Ihre Meinung macht den Unterschied",
      subtitle: "Helfen Sie uns, uns weiter zu verbessern, und teilen Sie Ihre Erfahrungen mit uns.",
      loginPrompt: "Melden Sie sich mit Google an, um Ihre Bewertung zu senden.",
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
      positiveBody: "Ihre Bewertung wurde gespeichert. Wenn Sie möchten, können Sie Ihre Erfahrung auch auf Google teilen.",
      googleCta: "⭐️ Auf Google Reviews veröffentlichen",
      negativeHeader: "Vielen Dank für Ihre Rückmeldung.",
      negativeBody: "Ihre Bewertung wurde gespeichert. Danke, dass Sie uns zeigen, was wir verbessern können.",
      backHome: "Zur Startseite",
      footerNote: "Informationen zum Umgang mit Ihren Daten finden Sie in unserer Datenschutzerklärung.",
      welcomeBack: "Angemeldet als"
    },
    'de-CH': {
      badge: "Ihre Bewertung",
      title: "Ihre Meinung macht den Unterschied",
      subtitle: "Helfen Sie uns, uns weiter zu verbessern, und teilen Sie Ihre Erfahrungen mit uns.",
      loginPrompt: "Melden Sie sich mit Google an, um Ihre Bewertung zu senden.",
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
      positiveBody: "Ihre Bewertung wurde gespeichert. Wenn Sie möchten, können Sie Ihre Erfahrung auch auf Google teilen.",
      googleCta: "⭐️ Auf Google Reviews veröffentlichen",
      negativeHeader: "Vielen Dank für Ihre Rückmeldung.",
      negativeBody: "Ihre Bewertung wurde gespeichert. Danke, dass Sie uns zeigen, was wir verbessern können.",
      backHome: "Zur Startseite",
      footerNote: "Informationen zum Umgang mit Ihren Daten finden Sie in unserer Datenschutzerklärung.",
      welcomeBack: "Angemeldet als"
    },
    fr: {
      badge: "Votre avis",
      title: "Votre avis fait toute la différence",
      subtitle: "Aidez-nous à nous améliorer et partagez votre expérience avec nous.",
      loginPrompt: "Connectez-vous avec Google pour envoyer votre avis.",
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
      positiveBody: "Votre avis a été enregistré. Si vous le souhaitez, vous pouvez aussi partager votre expérience sur Google.",
      googleCta: "⭐️ Publier sur Google Reviews",
      negativeHeader: "Merci pour votre retour.",
      negativeBody: "Votre avis a été enregistré. Merci de nous indiquer ce que nous pouvons améliorer.",
      backHome: "Retour à l'accueil",
      footerNote: "Consultez notre politique de confidentialité pour connaître le traitement de vos données.",
      welcomeBack: "Connecté en tant que"
    },
    it: {
      badge: "La tua opinione",
      title: "La tua opinione fa la differenza",
      subtitle: "Aiutaci a continuare a migliorare e condividi la tua esperienza con noi.",
      loginPrompt: "Accedi con Google per inviare la tua recensione.",
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
      positiveBody: "La recensione è stata salvata. Se vuoi, puoi condividere la tua esperienza anche su Google.",
      googleCta: "⭐️ Pubblica su Google Reviews",
      negativeHeader: "Grazie per aver condiviso la tua esperienza.",
      negativeBody: "La recensione è stata salvata. Grazie per averci indicato cosa possiamo migliorare.",
      backHome: "Torna alla Home",
      footerNote: "Consulta l’informativa sulla privacy per sapere come trattiamo i tuoi dati.",
      welcomeBack: "Accesso effettuato come"
    },
    pt: {
      badge: "A sua opinião",
      title: "Sua opinião faz a diferença",
      subtitle: "Ajude-nos a continuar melhorando e compartilhe sua experiência conosco.",
      loginPrompt: "Inicie sessão com o Google para enviar a sua avaliação.",
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
      positiveBody: "A sua avaliação foi guardada. Se desejar, pode também partilhar a sua experiência no Google.",
      googleCta: "⭐️ Publicar no Google Reviews",
      negativeHeader: "Obrigado por partilhar a sua experiência.",
      negativeBody: "A sua avaliação foi guardada. Obrigado por nos indicar o que podemos melhorar.",
      backHome: "Voltar para o Início",
      footerNote: "Consulte a nossa política de privacidade para saber como tratamos os seus dados.",
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
    <div id="review-invite-page" className="kraken-feedback min-h-screen bg-[#f3f7fc] text-[#032b59] flex flex-col items-center py-8 sm:py-12 px-4">
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
      <div className="mb-8 flex w-full max-w-2xl items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-xl border border-[#dce5f0] bg-white p-1">
          {languageOptions.map((opt) => (
            <button
              key={opt.code}
              aria-pressed={activeLang === opt.code}
              onClick={() => setActiveLang(opt.code)}
              className={`kraken-control min-h-11 min-w-11 shrink-0 px-3 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeLang === opt.code
                  ? 'bg-[#1464ad] text-white font-semibold'
                  : 'text-[#50647c] hover:text-[#032b59] bg-transparent hover:bg-[#f3f7fc]'
              }`}
              title={opt.label}
            >
              <span aria-hidden="true">{opt.flag}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        <button
          aria-label={texts.backHome}
          onClick={() => onNavigate('home')}
          className="kraken-control min-h-11 min-w-11 w-10 h-10 rounded-full bg-white border border-[#dce5f0] shadow-sm flex items-center justify-center text-[#50647c] hover:text-[#50647c] hover:border-[#dce5f0] transition-all text-base cursor-pointer shrink-0"
        >
          ✕
        </button>
      </div>

      <div className="w-full max-w-2xl relative z-10 text-center">
        {/* Animated Brand Header */}
        <div className="mb-6 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="mb-5 h-32 w-32"
          >
            {/* Soft inner glow gradient backing */}


            {/* Mascot Image popping out of the card in 3D */}
            <img
              src="/kai-calendar/optimized/kai/kai-reviews-320.webp"
              width="160" height="160" decoding="async"
              alt=""
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <span className="bg-[#edf4fd] text-[#1464ad] border border-[#c9dbef] text-sm font-semibold  px-3 py-1 rounded-full  mb-2">
            {texts.badge}
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#032b59]  leading-tight">
            {texts.title}
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-[#50647c]">
            {texts.subtitle}
          </p>
        </div>

        {/* Main interactive container - white themed, professional shadow */}
        <div id="review-card-interactive" className="kraken-panel bg-white border border-[#dce5f0] rounded-3xl p-5 sm:p-8 shadow-sm text-left">
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
                  <div className="border border-[#dce5f0] bg-[#f3f7fc] rounded-2xl p-5 text-center space-y-4">
                    <p className="text-base text-[#50647c] leading-relaxed font-semibold">
                      {texts.loginPrompt}
                    </p>
                    <button
                      onClick={handleGoogleLogin}
                      className="kraken-control min-h-11 min-w-11 w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f3f7fc] text-[#50647c] font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm border border-[#dce5f0] hover:border-[#dce5f0]  text-base cursor-pointer"
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
                        <p className="text-base text-red-600 font-semibold">
                          {activeLang === 'es' ? '🚨 Ventana Emergente Bloqueada' :
                           activeLang === 'pt' ? '🚨 Janela Pop-up Bloqueada' :
                           activeLang === 'fr' ? '🚨 Fenêtre Pop-up Bloquée' :
                           activeLang === 'it' ? '🚨 Finestra Pop-up Bloccata' :
                           activeLang === 'de' || activeLang === 'de-CH' ? '🚨 Popup blockiert' :
                           '🚨 Popup Blocked'}
                        </p>
                        <p className="text-sm text-[#50647c] font-semibold leading-relaxed">
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
                          className="inline-flex w-full items-center justify-center gap-1.5 bg-[#1464ad] hover:bg-sky-600 text-[#032b59] font-semibold py-2.5 px-3 rounded-xl transition-all shadow-sm text-sm cursor-pointer"
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
                      <p className="text-sm text-red-500 font-semibold">{authError}</p>
                    )}
                  </div>
                ) : (
                  // User logged in header
                  <div className="flex items-center justify-between border-b border-[#dce5f0] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-blue-400 flex items-center justify-center font-semibold text-sm text-[#032b59]">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-[#50647c] font-semibold  ">{texts.welcomeBack}</p>
                        <p className="text-base font-semibold text-[#032b59]">{user.name}</p>
                      </div>
                    </div>
                    <span className="text-sm text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                      ✓ Cliente Verificado
                    </span>
                  </div>
                )}

                {/* Rating Stars Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#50647c]  ">
                    {texts.starsLabel}
                  </label>
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <div role="group" aria-label={texts.starsLabel} className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          aria-label={`${star}/5`}
                          aria-pressed={rating === star}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => {
                            setRating(star);
                            setAuthError('');
                          }}
                          className="kraken-control min-h-11 min-w-11 text-4xl transition- duration-100 select-none cursor-pointer"
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
                          className="text-sm font-semibold text-[#1464ad]"
                        >
                          {getStarLabel(hoveredRating || rating)}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* TagBadges */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#50647c]  ">
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
                          className={`kraken-control min-h-11 min-w-11 px-3 py-1.5 rounded-xl text-base font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#edf4fd] text-[#1464ad] border-[#c9dbef] font-semibold'
                              : 'bg-[#f3f7fc] text-[#50647c] border-[#dce5f0] hover:border-[#dce5f0] hover:bg-[#f3f7fc]'
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
                    aria-label={texts.commentPlaceholder}
                    rows={3}
                    placeholder={texts.commentPlaceholder}
                    value={comment}
                    disabled={!user}
                    onChange={(e) => setComment(e.target.value)}
                    className="kraken-field w-full bg-white border border-[#dce5f0] rounded-2xl px-4 py-3 text-base text-[#032b59] focus:outline-none focus:border-sky-500 focus:bg-white placeholder:text-[#50647c] disabled:opacity-50 transition-all font-medium"
                  />
                </div>

                {/* Submitting Feedback Action */}
                <div className="pt-2">
                  {authError && (
                    <p role="alert" className="text-base text-red-700 mb-3">{authError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || !user || rating === 0}
                    className={`kraken-control min-h-11 min-w-11 w-full font-semibold py-3 px-6 rounded-2xl transition-all shadow-md text-base select-none   ${
                      isSubmitting || !user || rating === 0
                        ? 'bg-[#f3f7fc] text-[#50647c] cursor-not-allowed border border-[#dce5f0]'
                        : 'bg-[#1464ad] text-white font-semibold  cursor-pointer hover:scale-[1.01]'
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
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-3xl">
                  {rating >= 4 ? '🎉' : '❤️'}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-blue-600">
                    {texts.successTitle}
                  </h3>
                  <p className="text-base text-[#50647c] font-semibold">
                    {rating >= 4 ? texts.positiveHeader : texts.negativeHeader}
                  </p>
                </div>

                <div className={`rounded-2xl p-4 text-base leading-relaxed max-w-md mx-auto ${
                  rating >= 4
                    ? 'bg-blue-50/50 border border-blue-100 text-blue-800'
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
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#1464ad] hover:bg-[#0c4f92] text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-base   hover:scale-[1.02]"
                    >
                      {texts.googleCta}
                    </a>
                  )}

                  <button
                    onClick={() => onNavigate('home')}
                    className="kraken-control min-h-11 min-w-11 w-full bg-white border border-[#dce5f0] hover:bg-[#f3f7fc] hover:border-[#dce5f0] text-[#50647c] font-semibold py-2.5 px-6 rounded-xl transition-all text-base   cursor-pointer"
                  >
                    {texts.backHome}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-sm text-[#50647c] font-semibold mt-6">
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
