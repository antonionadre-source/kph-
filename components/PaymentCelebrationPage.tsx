import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Shield, Calendar, Headphones, ArrowRight, ClipboardCheck } from 'lucide-react';

interface PaymentCelebrationPageProps {
  booking: any;
  onBackHome: () => void;
}

const translations = {
  en: {
    paymentCompleted: "Payment completed!",
    serviceBooked: "Your service has been booked successfully.",
    confirmationSent: "Confirmation sent by email.",
    thankYouPayment: "Thank you for your payment!",
    precisionReview: "Our team is now reviewing the images you sent us and we will provide you with the final cost. In the meantime, sit back and relax — we will contact you shortly.",
    imagesReceived: "Images received and under review.",
    securePayment: "Secure Payment",
    securePaymentDesc: "Your payment is encrypted and 100% secure.",
    bookingConfirmed: "Booking Confirmed",
    bookingConfirmedDesc: "Your reservation is confirmed and guaranteed.",
    supportAvailable: "Support Available",
    supportAvailableDesc: "We're here to help whenever you need us.",
    reviewInProgress: "Review in Progress",
    reviewInProgressDesc: "Our team is reviewing your images to prepare the final cost.",
    contactSoon: "We'll Contact You Soon",
    contactSoonDesc: "We will reach out with the final amount and next steps.",
    backToDashboard: "Back to dashboard"
  },
  es: {
    paymentCompleted: "¡Pago completado!",
    serviceBooked: "Tu servicio ha sido reservado con éxito.",
    confirmationSent: "Confirmación enviada por email.",
    thankYouPayment: "¡Gracias por tu pago!",
    precisionReview: "Nuestro equipo está revisando las imágenes que enviaste y te proporcionaremos el costo final. Mientras tanto, relájate, nos pondremos en contacto contigo en breve.",
    imagesReceived: "Imágenes recibidas y bajo revisión.",
    securePayment: "Pago Seguro",
    securePaymentDesc: "Tu pago está encriptado y es 100% seguro.",
    bookingConfirmed: "Reserva Confirmada",
    bookingConfirmedDesc: "Tu reserva está confirmada y garantizada.",
    supportAvailable: "Soporte Disponible",
    supportAvailableDesc: "Estamos aquí para ayudar cuando nos necesites.",
    reviewInProgress: "Revisión en Curso",
    reviewInProgressDesc: "Nuestro equipo está revisando tus imágenes para preparar el costo final.",
    contactSoon: "Te Contactaremos Pronto",
    contactSoonDesc: "Nos comunicaremos con el monto final y los siguientes pasos.",
    backToDashboard: "Volver al inicio"
  },
  de: {
    paymentCompleted: "Zahlung abgeschlossen!",
    serviceBooked: "Ihr Service wurde erfolgreich gebucht.",
    confirmationSent: "Bestätigung per E-Mail gesendet.",
    thankYouPayment: "Vielen Dank für Ihre Zahlung!",
    precisionReview: "Unser Team überprüft nun die von Ihnen gesendeten Bilder und wir werden Ihnen die endgültigen Kosten mitteilen. Lehnen Sie sich in der Zwischenzeit zurück und entspannen Sie sich – wir werden uns in Kürze mit Ihnen in Verbindung setzen.",
    imagesReceived: "Bilder erhalten und in Prüfung.",
    securePayment: "Sichere Zahlung",
    securePaymentDesc: "Ihre Zahlung ist verschlüsselt und 100% sicher.",
    bookingConfirmed: "Buchung bestätigt",
    bookingConfirmedDesc: "Ihre Reservierung ist bestätigt und garantiert.",
    supportAvailable: "Support verfügbar",
    supportAvailableDesc: "Wir sind für Sie da, wann immer Sie uns brauchen.",
    reviewInProgress: "Prüfung läuft",
    reviewInProgressDesc: "Unser Team prüft Ihre Bilder, um die endgültigen Kosten zu berechnen.",
    contactSoon: "Wir kontaktieren Sie bald",
    contactSoonDesc: "Wir werden uns mit dem endgültigen Betrag und den nächsten Schritten bei Ihnen melden.",
    backToDashboard: "Zurück zur Startseite"
  },
  fr: {
    paymentCompleted: "Paiement complété !",
    serviceBooked: "Votre service a été réservé avec succès.",
    confirmationSent: "Confirmation envoyée par e-mail.",
    thankYouPayment: "Merci pour votre paiement !",
    precisionReview: "Notre équipe examine actuellement les images que vous avez envoyées et nous vous fournirons le coût final. En attendant, asseyez-vous et détendez-vous – nous vous contacterons sous peu.",
    imagesReceived: "Images reçues et en cours d'examen.",
    securePayment: "Paiement sécurisé",
    securePaymentDesc: "Votre paiement est crypté et 100% sécurisé.",
    bookingConfirmed: "Réservation confirmée",
    bookingConfirmedDesc: "Votre réservation est confirmée et garantie.",
    supportAvailable: "Support disponible",
    supportAvailableDesc: "Nous sommes là pour vous aider quand vous avez besoin de nous.",
    reviewInProgress: "Examen en cours",
    reviewInProgressDesc: "Notre équipe examine vos images pour préparer le coût final.",
    contactSoon: "Nous vous contacterons bientôt",
    contactSoonDesc: "Nous vous contacterons avec le montant final et les étapes suivantes.",
    backToDashboard: "Retour à l'accueil"
  },
  it: {
    paymentCompleted: "Pagamento completato!",
    serviceBooked: "Il tuo servizio è stato prenotato con successo.",
    confirmationSent: "Conferma inviata via email.",
    thankYouPayment: "Grazie per il pagamento!",
    precisionReview: "Il nostro team sta esaminando le immagini che hai inviato e ti forniremo il costo finale. Nel frattempo, rilassati: ti contatteremo a breve.",
    imagesReceived: "Immagini ricevute e in corso di revisione.",
    securePayment: "Pagamento Sicuro",
    securePaymentDesc: "Il tuo pagamento è crittografato e sicuro al 100%.",
    bookingConfirmed: "Prenotazione Confermata",
    bookingConfirmedDesc: "La tua prenotazione è confermata e garantita.",
    supportAvailable: "Supporto Disponibile",
    supportAvailableDesc: "Siamo qui per aiutarti ogni volta che ne hai bisogno.",
    reviewInProgress: "Revisione in Corso",
    reviewInProgressDesc: "Il nostro team sta esaminando le tue immagini per preparare il costo finale.",
    contactSoon: "Ti Contatteremo Presto",
    contactSoonDesc: "Ti contatteremo con l'importo finale e i passaggi successivi.",
    backToDashboard: "Torna alla home"
  },
  pt: {
    paymentCompleted: "Pagamento concluído!",
    serviceBooked: "O seu serviço foi reservado com sucesso.",
    confirmationSent: "Confirmação enviada por e-mail.",
    thankYouPayment: "Obrigado pelo seu pagamento!",
    precisionReview: "A nossa equipa está a analisar as imagens que enviou e forneceremos o custo final. Entretanto, relaxe – entraremos em contacto em breve.",
    imagesReceived: "Imagens recebidas e sob revisão.",
    securePayment: "Pagamento Seguro",
    securePaymentDesc: "O seu pagamento é encriptado e 100% seguro.",
    bookingConfirmed: "Reserva Confirmada",
    bookingConfirmedDesc: "A sua reserva está confirmada e garantizada.",
    supportAvailable: "Suporte Disponível",
    supportAvailableDesc: "Estamos aqui para ajudar sempre que precisar.",
    reviewInProgress: "Análise em Curso",
    reviewInProgressDesc: "A nossa equipa está a rever as suas imagens para preparar o custo final.",
    contactSoon: "Contactaremos Em Breve",
    contactSoonDesc: "Entraremos em contacto com o valor final e os próximos passos.",
    backToDashboard: "Voltar ao início"
  }
};

const speechBubbles = [
  { text: "Danke!", bg: "bg-[#007bff]", textCol: "text-white", className: "top-[-5px] left-[5%] md:top-[15px] md:left-[10%]" },
  { text: "Thank you!", bg: "bg-[#8B5CF6]", textCol: "text-white", className: "top-[15px] right-[2%] md:top-[30px] md:right-[10%]" },
  { text: "Vielen Dank!", bg: "bg-[#14B8A6]", textCol: "text-white", className: "top-[75px] left-[-5%] md:top-[90px] md:left-[0%]" },
  { text: "Merci!", bg: "bg-[#F43F5E]", textCol: "text-white", className: "top-[155px] left-[2%] md:top-[170px] md:left-[8%]" },
  { text: "¡Gracias!", bg: "bg-amber-500", textCol: "text-white", className: "bottom-[5px] left-[5%] md:bottom-[15px] md:left-[12%]" },
  { text: "Obrigado!", bg: "bg-[#F97316]", textCol: "text-white", className: "top-[135px] right-[-5%] md:top-[150px] md:right-[2%]" },
  { text: "Grazie!", bg: "bg-[#10B981]", textCol: "text-white", className: "bottom-[25px] right-[5%] md:bottom-[35px] md:right-[12%]" }
];

export const PaymentCelebrationPage: React.FC<PaymentCelebrationPageProps> = ({ booking, onBackHome }) => {
  const currentLang = (localStorage.getItem('kraken_preferred_lang') || 'en') as keyof typeof translations;
  const tLocal = translations[currentLang] || translations.en;

  // Determine booking type (Express vs Precision Quote)
  const isDirect = booking.bookingMode === 'direct';

  // State to make confetti fall and recycle
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; duration: number; delay: number; rotate: number }>>([]);

  useEffect(() => {
    // Generate 60 colorful confetti pieces
    const colors = ['#FFC107', '#4CAF50', '#00BCD4', '#E91E63', '#9C27B0', '#007BFF', '#FF5722', '#10B981', '#3B82F6', '#EC4899'];
    const generated = Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage left
      y: -10 - Math.random() * 20, // start above screen
      size: Math.random() * 10 + 6, // 6px to 16px
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 3 + 2.5, // 2.5 to 5.5 seconds
      delay: Math.random() * 3, // delay start
      rotate: Math.random() * 360
    }));
    setConfetti(generated);

    // Scroll back to the absolute top of the page on render
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden select-none">
      {/* Dynamic Animated Confetti particles */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute rounded-xs opacity-90"
            style={{
              left: `${piece.x}%`,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
            }}
            initial={{ y: `${piece.y}vh`, rotate: 0 }}
            animate={{
              y: '105vh',
              rotate: piece.rotate + 720,
              x: [`${piece.x}%`, `${piece.x + (Math.random() * 10 - 5)}%`, `${piece.x + (Math.random() * 10 - 5)}%`]
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main Container Card */}
      <div className="max-w-6xl w-full mx-auto bg-gradient-to-br from-[#EBF3FE] via-[#F4F8FF] to-[#EAF2FF] rounded-[2.5rem] border border-white/80 shadow-2xl relative overflow-hidden flex flex-col p-6 md:p-10 min-h-[580px] justify-between">
        {/* Ambient background glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#007bff]/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-25%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/15 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Top Header Row */}
        <div className="flex items-center justify-between w-full relative z-10 mb-6">
          <img 
            src="/logo-kraken-azul.webp" 
            alt="Kraken" 
            className="h-9 md:h-11 object-contain" 
            onError={(e) => {
              // fallback if webp is not found
              (e.target as HTMLImageElement).src = 'https://copy-of-kraken-properties-and-facilities-management.ai.studio/logo-kraken-azul.webp';
            }}
          />
        </div>

        {/* Middle Columns Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto relative z-10 py-4">
          
          {/* Left Column - Success Message Card */}
          <div className="lg:col-span-6 bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl p-8 md:p-10 border border-white flex flex-col items-start text-left max-w-lg mx-auto lg:mx-0 w-full animate-fade-in relative z-20">
            {/* Status Check Circle */}
            <div className="w-14 h-14 bg-[#D1FAE5] text-[#10B981] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#A7F3D0]">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            {/* Success Heading */}
            <h1 className="text-3xl md:text-4xl font-black text-[#002D5B] tracking-tight mb-4 leading-tight uppercase">
              {isDirect ? tLocal.paymentCompleted : tLocal.thankYouPayment}
            </h1>

            {/* Success Subtitle Description */}
            <p className="text-gray-600 text-sm md:text-base font-semibold mb-6 leading-relaxed">
              {isDirect ? tLocal.serviceBooked : tLocal.precisionReview}
            </p>

            {/* Lower Badge/Pill */}
            <div className="inline-flex items-center gap-2.5 bg-[#E6F9F0] border border-[#A7F3D0] text-[#047857] px-4.5 py-2.5 rounded-full text-xs font-black shadow-3xs tracking-wide">
              {isDirect ? (
                <>
                  <span className="text-sm">✉</span>
                  <span>{tLocal.confirmationSent}</span>
                </>
              ) : (
                <>
                  <span className="text-sm">🖼</span>
                  <span>{tLocal.imagesReceived}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Happy Mascot and Language Speech Bubbles */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[360px] md:min-h-[400px] overflow-visible w-full select-none mt-6 lg:mt-0">
            {/* Speach Bubbles Container with floating effects */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              {speechBubbles.map((bubble, index) => (
                <motion.div
                  key={index}
                  className={`absolute ${bubble.className} ${bubble.bg} ${bubble.textCol} shadow-lg rounded-2xl px-3 py-1.5 md:px-4 md:py-2 text-[11px] md:text-[13px] font-black tracking-wide border border-white/20 select-none hidden sm:flex items-center justify-center`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    y: [0, -8, 0]
                  }}
                  transition={{
                    scale: { duration: 0.4, delay: index * 0.15 },
                    opacity: { duration: 0.4, delay: index * 0.15 },
                    y: {
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: Math.random() * 2
                    }
                  }}
                >
                  {bubble.text}
                  {/* Speech bubble arrow/tail styling */}
                  <div className={`absolute bottom-[-6px] left-[50%] transform -translate-x-1/2 w-3 h-3 ${bubble.bg} rotate-45 border-r border-b border-white/10`} />
                </motion.div>
              ))}
            </div>

            {/* Center Mascot Illustration */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              className="relative z-10"
            >
              <img
                src="/ChatGPT%20Image%20Jul%2018,%202026,%2007_40_06%20PM.png"
                alt="Kai Kraken Mascot Happy"
                className="h-[260px] md:h-[310px] w-auto object-contain drop-shadow-2xl animate-float"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

        </div>

        {/* Bottom Horizontal Bar */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 p-6 md:p-7 rounded-[2rem] shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10 w-full mt-6">
          {/* Trust Elements List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full lg:w-auto text-left flex-1">
            {/* Card 1: Secure Payment */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-[#002D5B] rounded-full flex items-center justify-center shrink-0 shadow-3xs">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#002D5B] uppercase tracking-wide mb-0.5">{tLocal.securePayment}</h4>
                <p className="text-[10px] text-gray-500 font-bold leading-normal">{tLocal.securePaymentDesc}</p>
              </div>
            </div>

            {/* Card 2: Status based on Booking Mode */}
            {isDirect ? (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-[#002D5B] rounded-full flex items-center justify-center shrink-0 shadow-3xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#002D5B] uppercase tracking-wide mb-0.5">{tLocal.bookingConfirmed}</h4>
                  <p className="text-[10px] text-gray-500 font-bold leading-normal">{tLocal.bookingConfirmedDesc}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-[#002D5B] rounded-full flex items-center justify-center shrink-0 shadow-3xs">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#002D5B] uppercase tracking-wide mb-0.5">{tLocal.reviewInProgress}</h4>
                  <p className="text-[10px] text-gray-500 font-bold leading-normal">{tLocal.reviewInProgressDesc}</p>
                </div>
              </div>
            )}

            {/* Card 3: Support */}
            {isDirect ? (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-[#002D5B] rounded-full flex items-center justify-center shrink-0 shadow-3xs">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#002D5B] uppercase tracking-wide mb-0.5">{tLocal.supportAvailable}</h4>
                  <p className="text-[10px] text-gray-500 font-bold leading-normal">{tLocal.supportAvailableDesc}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-[#002D5B] rounded-full flex items-center justify-center shrink-0 shadow-3xs">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#002D5B] uppercase tracking-wide mb-0.5">{tLocal.contactSoon}</h4>
                  <p className="text-[10px] text-gray-500 font-bold leading-normal">{tLocal.contactSoonDesc}</p>
                </div>
              </div>
            )}
          </div>

          {/* Back Home Button */}
          <button
            onClick={onBackHome}
            className="w-full lg:w-auto bg-gradient-to-r from-[#003B73] to-[#002D5B] hover:from-[#002D5B] hover:to-[#001D3D] text-white px-8 py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg shadow-blue-900/25 hover:shadow-xl hover:shadow-blue-900/35 active:scale-[0.98] transition-all duration-300 cursor-pointer shrink-0"
          >
            <span>{tLocal.backToDashboard}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
