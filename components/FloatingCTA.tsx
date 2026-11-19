
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { SparklesIcon, ChevronRightIcon } from './icons';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingCTAProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ onNavigate, currentPage }) => {
  const { language } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  // Pages where the floating CTA should appear
  const allowedPages = ['home', 'about', 'clients', 'sustainability-page', 'commercial-services', 'services-page'];

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 400px
      const shouldShow = window.scrollY > 400 && allowedPages.includes(currentPage);
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const getCtaLabel = () => {
    switch (language) {
      case 'en':
        return 'Request a Free Quote';
      case 'fr':
        return 'Demander un devis gratuit';
      case 'it':
        return 'Richiedi preventivo gratuito';
      case 'es':
        return 'Solicitar presupuesto gratis';
      case 'pt':
        return 'Solicitar orçamento gratuito';
      case 'de':
      case 'de-CH':
      default:
        return 'Kostenlose Offerte anfordern';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[50]">
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('consultation')}
            className="group bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] hover:from-[#3feb73] hover:to-[#1ecdb6] pl-2.5 pr-4 py-2 sm:pl-3 sm:pr-5 sm:py-2.5 rounded-full font-black text-xs sm:text-sm shadow-xl border border-white/20 flex items-center gap-2.5 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#002d5b]/15 border border-[#002d5b]/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#002d5b]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
              </svg>
            </div>
            <span className="whitespace-nowrap font-black tracking-tight">{getCtaLabel()}</span>
            <ChevronRightIcon className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
