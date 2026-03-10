
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';

interface CookieConsentProps {
  onNavigate: (page: string) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented or declined
    const consent = localStorage.getItem('kraken_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kraken_cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('kraken_cookie_consent', 'false');
    setIsVisible(false);
  };

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('gdpr');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[60] p-4 md:p-6 animate-slide-up">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-700 text-sm md:text-base flex-1">
          <p>{t('cookie.message')}</p>
        </div>
        <div className="flex gap-4 items-center">
          <a 
            href="#" 
            onClick={handleLearnMore}
            className="text-[#002D5B] hover:underline font-medium text-sm whitespace-nowrap"
          >
            {t('cookie.learnMore')}
          </a>
          <div className="flex gap-2">
            <button
                onClick={handleDecline}
                className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-semibold transition-colors text-sm whitespace-nowrap"
            >
                {t('cookie.decline')}
            </button>
            <button
                onClick={handleAccept}
                className="bg-[#002D5B] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#00254A] transition-colors shadow-md whitespace-nowrap text-sm"
            >
                {t('cookie.accept')}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
