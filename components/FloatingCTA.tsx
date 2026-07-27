
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { SparklesIcon, BoltIcon, ChevronRightIcon, BuildingIcon } from './icons';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingCTAProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ onNavigate, currentPage }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isOverlappingSection, setIsOverlappingSection] = useState(false);

  // Pages where the floating CTA should appear
  const allowedPages = ['home', 'about', 'clients', 'sustainability-page'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverlappingSection(entry.isIntersecting);
      },
      { threshold: 0.1 } // Hide when 10% of the section is visible
    );

    const section = document.getElementById('segmentation-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) observer.unobserve(section);
    };
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 400px and if not in forbidden section
      const shouldShow = window.scrollY > 400 && allowedPages.includes(currentPage) && !isOverlappingSection;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, isOverlappingSection]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[50] flex flex-col sm:flex-row gap-3">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onNavigate('commercial-quote')}
            className="bg-[#002D5B] text-white hover:bg-[#003d7a] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl border border-white/10 flex items-center gap-2 transition-all duration-300"
          >
            {t('hero.b2b_buildings_cta')}
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onNavigate('consultation')}
            className="bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] hover:from-[#3feb73] hover:to-[#1ecdb6] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl border border-white/10 flex items-center gap-2 transition-all duration-300"
          >
            {t('hero.main_cta')}
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
