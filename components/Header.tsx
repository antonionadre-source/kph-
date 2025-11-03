import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
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
    { code: 'de-CH', name: 'Swiss German', flag: '🇨🇭' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  ];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    setLangDropdownOpen(false);
    setJustSelected(true);
    setTimeout(() => setJustSelected(false), 400);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#002D5B]">
            Kraken
          </h1>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-600 hover:text-[#002D5B] transition-colors">{t('nav.services')}</a>
            <a href="#about" className="text-gray-600 hover:text-[#002D5B] transition-colors">{t('nav.about')}</a>
            <a href="#clients" className="text-gray-600 hover:text-[#002D5B] transition-colors">{t('nav.clients')}</a>
            
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}
                className={`text-2xl transition-transform duration-300 ease-in-out hover:scale-110 ${justSelected ? 'animate-pop' : ''}`}
                aria-label="Select language"
                aria-haspopup="true"
                aria-expanded={isLangDropdownOpen}
              >
                <span role="img" aria-label="Globe emoji">🌎</span>
              </button>
              <ul className={`absolute right-0 mt-4 p-2 w-56 bg-white rounded-lg shadow-xl z-10 grid grid-cols-3 gap-2 origin-top-right transform transition-all duration-200 ease-out ${isLangDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  {supportedLanguages.map((lang) => (
                    <li key={lang.code} className="flex justify-center items-center">
                      <button
                        title={lang.name}
                        className={`text-3xl rounded-md p-2 transition-transform duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002D5B] ${language === lang.code ? 'bg-slate-200 scale-110' : 'bg-transparent'}`}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        {lang.flag}
                      </button>
                    </li>
                  ))}
                </ul>
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
      <style>{`
        @keyframes pop-effect {
          0% { transform: scale(1); }
          50% { transform: scale(1.25) rotate(15deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-pop {
          animation: pop-effect 0.4s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Header;