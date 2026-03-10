
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { CalendarIcon } from './icons';

interface FloatingCTAProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ onNavigate, currentPage }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  // Pages where the floating CTA should appear
  const allowedPages = ['home', 'about', 'clients', 'sustainability-page'];

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 400px
      const shouldShow = window.scrollY > 400 && allowedPages.includes(currentPage);
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  if (!isVisible) return null;

  return (
    <>
      <button
        onClick={() => onNavigate('consultation')}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-[#002D5B] text-white px-5 py-3 md:px-6 md:py-3 rounded-full shadow-2xl hover:bg-[#00254A] hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border-2 border-white/20 animate-bounce-in"
        aria-label={t('hero.main_cta')}
      >
        <CalendarIcon className="w-5 h-5" />
        <span className="font-semibold text-sm md:text-base whitespace-nowrap">{t('hero.main_cta')}</span>
      </button>
      <style>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          50% { opacity: 1; transform: translateY(-5px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </>
  );
};

export default FloatingCTA;