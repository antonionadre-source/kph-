import React, { useState, useEffect, useRef } from 'react';
import { GlobeIcon } from './icons';
import { useTranslation } from '../i18n';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { t, setLanguage, language } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    if (isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangDropdownOpen]);

  const supportedLanguages = [
    { code: 'de', name: 'German' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'it', name: 'Italian' },
    { code: 'es', name: 'Spanish' },
    { code: 'pt', name: 'Portuguese' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#002D5B]">
          Kraken
        </h1>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#services" className="text-gray-600 hover:text-[#002D5B] transition-colors">{t('nav.services')}</a>
          <a href="#about" className="text-gray-600 hover:text-[#002D5B] transition-colors">{t('nav.about')}</a>
          <a href="#properties" className="text-gray-600 hover:text-[#002D5B] transition-colors">{t('nav.properties')}</a>
          
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}
              className="text-gray-600 hover:text-[#002D5B] transition-colors"
              aria-label="Select language"
              aria-haspopup="true"
              aria-expanded={isLangDropdownOpen}
            >
              <GlobeIcon className="w-6 h-6" />
            </button>
            {isLangDropdownOpen && (
              <ul className="absolute right-0 mt-2 py-2 w-40 bg-white rounded-lg shadow-xl z-10">
                {supportedLanguages.map((lang) => (
                  <li key={lang.code}>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${language === lang.code ? 'font-semibold text-[#002D5B] bg-slate-100' : 'text-gray-700'} hover:bg-slate-100 hover:text-[#002D5B]`}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setLangDropdownOpen(false);
                      }}
                    >
                      {lang.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <a href="#contact" className="bg-[#002D5B] text-white px-5 py-2 rounded-full hover:bg-[#00254A] transition-colors shadow">
            {t('nav.contact')}
          </a>
        </nav>
        <button className="md:hidden text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
