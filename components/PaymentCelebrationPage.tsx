import React, { useEffect } from 'react';
import { useTranslation } from '../i18n';
import { Check, Clock3, Calendar, Headphones, ArrowRight, ClipboardCheck } from 'lucide-react';

interface PaymentCelebrationPageProps {
  booking: any;
  onBackHome: () => void;
}

const translations = {
  en: {
    paymentCompleted: "Payment completed!",
    serviceBooked: "Your payment is confirmed. Our team will confirm service details and availability.",
    confirmationSent: "Payment confirmed by Payrexx.",
    thankYouPayment: "Thank you for your payment!",
    precisionReview: "Our team will review your request and confirm the scope and final price before the service.",
    imagesReceived: "Request received and under review.",
    securePayment: "Secure Payment",
    securePaymentDesc: "Payment confirmed by Payrexx.",
    bookingConfirmed: "Service under review",
    bookingConfirmedDesc: "Our team will confirm the date and service details.",
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
    serviceBooked: "Tu pago está confirmado. Nuestro equipo confirmará la disponibilidad y los detalles del servicio.",
    confirmationSent: "Pago confirmado por Payrexx.",
    thankYouPayment: "¡Gracias por tu pago!",
    precisionReview: "El equipo revisará tu solicitud y confirmará el alcance y el precio final antes del servicio.",
    imagesReceived: "Solicitud recibida y en revisión.",
    securePayment: "Pago Seguro",
    securePaymentDesc: "Pago confirmado por Payrexx.",
    bookingConfirmed: "Servicio en revisión",
    bookingConfirmedDesc: "Nuestro equipo confirmará la fecha y los detalles del servicio.",
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
    serviceBooked: "Ihre Zahlung ist bestätigt. Unser Team bestätigt die Verfügbarkeit und Leistungsdetails.",
    confirmationSent: "Zahlung durch Payrexx bestätigt.",
    thankYouPayment: "Vielen Dank für Ihre Zahlung!",
    precisionReview: "Das Team prüft Ihre Anfrage und bestätigt Umfang und Endpreis vor dem Service.",
    imagesReceived: "Anfrage erhalten und in Prüfung.",
    securePayment: "Sichere Zahlung",
    securePaymentDesc: "Zahlung durch Payrexx bestätigt.",
    bookingConfirmed: "Anfrage wird geprüft",
    bookingConfirmedDesc: "Unser Team bestätigt Termin und Leistungsdetails.",
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
    serviceBooked: "Votre paiement est confirmé. Notre équipe confirmera les disponibilités et les détails du service.",
    confirmationSent: "Paiement confirmé par Payrexx.",
    thankYouPayment: "Merci pour votre paiement !",
    precisionReview: "L’équipe examinera votre demande et confirmera les prestations et le prix final avant le service.",
    imagesReceived: "Demande reçue et en cours de vérification.",
    securePayment: "Paiement sécurisé",
    securePaymentDesc: "Paiement confirmé par Payrexx.",
    bookingConfirmed: "Service en cours de vérification",
    bookingConfirmedDesc: "Notre équipe confirmera la date et les détails du service.",
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
    serviceBooked: "Il pagamento è confermato. Il nostro team confermerà disponibilità e dettagli del servizio.",
    confirmationSent: "Pagamento confermato da Payrexx.",
    thankYouPayment: "Grazie per il pagamento!",
    precisionReview: "Il team esaminerà la richiesta e confermerà prestazioni e prezzo finale prima del servizio.",
    imagesReceived: "Richiesta ricevuta e in verifica.",
    securePayment: "Pagamento Sicuro",
    securePaymentDesc: "Pagamento confermato da Payrexx.",
    bookingConfirmed: "Servizio in verifica",
    bookingConfirmedDesc: "Il team confermerà la data e i dettagli del servizio.",
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
    serviceBooked: "O pagamento está confirmado. A nossa equipa confirmará a disponibilidade e os detalhes do serviço.",
    confirmationSent: "Pagamento confirmado pela Payrexx.",
    thankYouPayment: "Obrigado pelo seu pagamento!",
    precisionReview: "A equipa analisará o pedido e confirmará o âmbito e o preço final antes do serviço.",
    imagesReceived: "Pedido recebido e em análise.",
    securePayment: "Pagamento Seguro",
    securePaymentDesc: "Pagamento confirmado pela Payrexx.",
    bookingConfirmed: "Serviço em análise",
    bookingConfirmedDesc: "A equipa confirmará a data e os detalhes do serviço.",
    supportAvailable: "Suporte Disponível",
    supportAvailableDesc: "Estamos aqui para ajudar sempre que precisar.",
    reviewInProgress: "Análise em Curso",
    reviewInProgressDesc: "A nossa equipa está a rever as suas imagens para preparar o custo final.",
    contactSoon: "Contactaremos Em Breve",
    contactSoonDesc: "Entraremos em contacto com o valor final e os próximos passos.",
    backToDashboard: "Voltar ao início"
  }
};

export const PaymentCelebrationPage: React.FC<PaymentCelebrationPageProps> = ({ booking, onBackHome }) => {
  const { language } = useTranslation();
  const currentLang = (language === 'de-CH' ? 'de' : language) as keyof typeof translations;
  const tLocal = translations[currentLang] || translations.en;

  // Determine booking type (Express vs Precision Quote)
  const isDirect = booking.bookingMode === 'direct';

  // A browser redirect is untrusted; server-side gateway confirmation is pending.
  const awaitingVerification = !(booking?.payment?.status === 'captured' && booking.payment.verified === true && booking.payment.transactionId && booking.payment.gateway === 'payrexx');
  const pendingText = {
    de: ['Anfrage erhalten', 'Die Zahlungsbestätigung steht noch aus. Unser Team prüft Ihre Anfrage.', 'Zahlung wird geprüft'],
    en: ['Request received', 'Payment confirmation is pending. Our team will review your request.', 'Payment under review'],
    fr: ['Demande reçue', 'La confirmation du paiement est en attente. Notre équipe examinera votre demande.', 'Paiement en cours de vérification'],
    it: ['Richiesta ricevuta', 'La conferma del pagamento è in attesa. Il nostro team esaminerà la richiesta.', 'Pagamento in verifica'],
    es: ['Solicitud recibida', 'La confirmación del pago está pendiente. Nuestro equipo revisará tu solicitud.', 'Pago en revisión'],
    pt: ['Pedido recebido', 'A confirmação do pagamento está pendente. A nossa equipa irá analisar o seu pedido.', 'Pagamento em análise'],
  }[currentLang] || ['Request received', 'Payment confirmation is pending.', 'Payment under review'];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main className="kraken-page kraken-workflow bg-[#f3f7fc] px-5 py-12 text-[#032b59] sm:py-20">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#dce5f0] bg-white" aria-labelledby="payment-status-title">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
          <div>
            <p className="kraken-eyebrow">Kraken PFM</p>
            <div className={`mt-6 inline-flex h-14 w-14 items-center justify-center rounded-full ${awaitingVerification ? 'bg-amber-50 text-amber-700' : 'bg-[#e8f4f1] text-[#1464ad]'}`} aria-hidden="true">{awaitingVerification ? <Clock3 className="h-7 w-7" /> : <Check className="h-7 w-7" />}</div>
            <h1 id="payment-status-title" className="kraken-heading mt-5">{awaitingVerification ? pendingText[0] : (isDirect ? tLocal.paymentCompleted : tLocal.thankYouPayment)}</h1>
            <p className="kraken-description">{awaitingVerification ? pendingText[1] : (isDirect ? tLocal.serviceBooked : tLocal.precisionReview)}</p>
            <p className="mt-5 text-sm font-medium text-[#1464ad]">{awaitingVerification ? pendingText[2] : tLocal.confirmationSent}</p>
          </div>
          <div className="flex items-center justify-center rounded-2xl bg-[#f3f7fc] p-7"><img src="/kai-calendar/optimized/kai/mascota-kraken-homepage-320.webp" alt="Kai — Kraken PFM" width="320" height="320" className="h-auto w-full max-w-64 object-contain" /></div>
        </div>
        <div className="grid gap-7 border-t border-[#dce5f0] p-7 sm:grid-cols-2 sm:p-10">
          <div className="flex gap-4"><div className="mt-1 text-[#1464ad]" aria-hidden="true">{isDirect ? <Calendar className="h-5 w-5" /> : <ClipboardCheck className="h-5 w-5" />}</div><div><h2 className="text-lg font-semibold">{awaitingVerification ? pendingText[0] : isDirect ? tLocal.bookingConfirmed : tLocal.reviewInProgress}</h2><p className="mt-2 text-base leading-relaxed text-[#50647c]">{awaitingVerification ? pendingText[1] : isDirect ? tLocal.bookingConfirmedDesc : tLocal.reviewInProgressDesc}</p></div></div>
          <div className="flex gap-4"><Headphones className="mt-1 h-5 w-5 shrink-0 text-[#1464ad]" aria-hidden="true" /><div><h2 className="text-lg font-semibold">{isDirect ? tLocal.supportAvailable : tLocal.contactSoon}</h2><p className="mt-2 text-base leading-relaxed text-[#50647c]">{isDirect ? tLocal.supportAvailableDesc : tLocal.contactSoonDesc}</p></div></div>
          <div className="sm:col-span-2"><button onClick={onBackHome} className="kraken-button kraken-primary w-full sm:w-auto">{tLocal.backToDashboard}<ArrowRight className="h-4 w-4" /></button></div>
        </div>
      </section>
    </main>
  );
};
