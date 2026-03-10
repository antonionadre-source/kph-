
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { companyLogoUrl } from '../assets';
import { useAuth } from './Auth';
import { LeafIcon } from './icons';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: 'home' | 'clients' | 'login' | 'register' | 'dashboard' | 'about' | 'consultation' | 'gdpr' | 'services-page' | 'sustainability-page' | 'hse' | 'careers';
}

const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - percentage, 4); // EaseOutQuart

      setCount(end * ease);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { t, setLanguage, language } = useTranslation();
  const { user, logout } = useAuth();
  
  // Animation value
  const co2Value = useCountUp(0.61);

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);
  
  const useDarkText = isMobileMenuOpen;

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, page: string) => {
    e.preventDefault();
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setMobileMenuOpen(false);
  };
  
  const renderNavLinks = (isMobile: boolean = false) => {
    const navLinkClass = isMobile 
      ? "text-3xl font-black uppercase tracking-tighter py-4 text-[#002d5b]" 
      : `text-[11px] font-bold uppercase tracking-[0.15em] transition-all ${isScrolled ? 'text-[#002d5b]' : 'text-[#002d5b]'} hover:text-blue-600`;

    return (
      <>
        <a href="#" onClick={(e) => handleNavClick(e, 'services-page')} className={navLinkClass}>{t('nav.services')}</a>
        <a href="#" onClick={(e) => handleNavClick(e, 'about')} className={navLinkClass}>{t('nav.about')}</a>
        <a href="#" onClick={(e) => handleNavClick(e, 'sustainability-page')} className={navLinkClass}>{t('nav.sustainability')}</a>
         {user && (
          <a href="#" onClick={(e) => handleNavClick(e, 'dashboard')} className={navLinkClass}>{t('nav.dashboard')}</a>
        )}
        <a href="#" onClick={(e) => handleNavClick(e, 'clients')} className={navLinkClass}>{t('nav.clients')}</a>
      </>
    );
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-white py-5'} ${isMobileMenuOpen ? 'bg-white' : ''}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <a href="#" onClick={(e) => handleNavClick(e, 'home')} aria-label="Kraken Properties Homepage" className="relative z-50 flex items-center group">
            <img src={companyLogoUrl} alt="Kraken Properties Logo" className={`w-auto transition-all duration-500 ${isScrolled || isMobileMenuOpen ? 'h-10 md:h-12' : 'h-14 md:h-16'}`} />
            <div className="h-8 w-px bg-slate-200 mx-4 hidden sm:block"></div>
            <div className="flex flex-col leading-tight">
              <span className="text-[#002d5b] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] opacity-80">Properties and</span>
              <span className="text-[#002d5b] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] opacity-80">Facilities Management</span>
            </div>
          </a>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {renderNavLinks()}
            
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}
                className={`text-xl transition-all duration-300 hover:scale-110 ${justSelected ? 'animate-pop' : ''}`}
                aria-label="Select language"
              >
                <span role="img" aria-label="Globe emoji">🌎</span>
              </button>
              <ul className={`absolute right-0 mt-6 p-4 w-64 bg-white rounded-3xl shadow-2xl z-10 grid grid-cols-3 gap-3 origin-top-right transform transition-all duration-300 ease-out border border-gray-100 ${isLangDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  {supportedLanguages.map((lang) => (
                    <li key={lang.code} className="flex justify-center">
                      <button
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-center p-2 text-3xl hover:bg-slate-50 rounded-2xl transition-all ${language === lang.code ? 'bg-blue-50 ring-2 ring-blue-100' : ''}`}
                        title={lang.name}
                      >
                        {lang.flag}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
             {user ? (
              <a href="#" onClick={handleLogout} className="font-bold text-[10px] uppercase tracking-widest transition-all px-6 py-2.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200/50">Logout</a>
            ) : (
              <a href="#" onClick={(e) => handleNavClick(e, 'clients')} className="font-bold text-[10px] uppercase tracking-widest transition-all px-6 py-2.5 rounded-xl bg-[#002D5B] text-white hover:bg-[#003d7a] shadow-lg shadow-blue-900/10">{t('nav.login')}</a>
            )}
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4">
             <div className="relative" ref={langDropdownRef}>
                <button
                    onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}
                    className="text-xl transition-all"
                >
                    <span role="img" aria-label="Globe">🌎</span>
                </button>
                <ul className={`absolute right-0 mt-4 p-3 w-48 bg-white rounded-2xl shadow-xl z-50 grid grid-cols-3 gap-2 origin-top-right transition-all duration-300 ${isLangDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    {supportedLanguages.map((lang) => (
                        <button key={lang.code} onClick={() => handleLanguageChange(lang.code)} className="p-2 text-2xl hover:bg-gray-100 rounded-xl">{lang.flag}</button>
                    ))}
                </ul>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className={`z-50 relative w-10 h-10 flex flex-col items-center justify-center transition-all ${isMobileMenuOpen ? 'text-[#002d5b]' : 'text-[#002d5b]'}`}
              aria-label="Open menu"
            >
              <span className={`block w-8 h-0.5 bg-current rounded-full transform transition duration-500 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
              <span className={`block w-8 h-0.5 bg-current rounded-full mt-1.5 transition duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-8 h-0.5 bg-current rounded-full transform transition duration-500 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`}></span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-700 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden`}>
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#002D5B_1px,transparent_1px)] [background-size:20px_20px]"></div>
            
            <nav className="flex flex-col items-center space-y-4 w-full relative z-10">
                {renderNavLinks(true)}
                
                <div className="w-full h-px bg-gray-100 my-8"></div>
                
                {/* Mobile Low Emission Badge */}
                <button 
                    onClick={(e) => handleNavClick(e, 'sustainability-page')}
                    className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-800 transition-all shadow-sm w-full max-w-sm"
                >
                    <div className="p-2 bg-emerald-100 rounded-2xl">
                        <LeafIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] uppercase font-black text-emerald-600 tracking-widest mb-1">Eco-Performance</span>
                        <span className="text-lg font-black">{co2Value.toFixed(2)}g CO₂ / Visit</span>
                    </div>
                </button>

                <div className="pt-4 w-full max-w-sm">
                    {user ? (
                        <button onClick={handleLogout} className="w-full py-5 rounded-3xl bg-rose-500 text-white font-black uppercase tracking-widest text-lg shadow-xl shadow-rose-200">Logout</button>
                    ) : (
                        <button onClick={(e) => handleNavClick(e, 'clients')} className="w-full py-5 rounded-3xl bg-[#002D5B] text-white font-black uppercase tracking-widest text-lg shadow-xl shadow-blue-200">Client Portal</button>
                    )}
                </div>
            </nav>
            
            <div className="absolute bottom-10 left-0 right-0 text-center">
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Kraken Properties Inc. 2025</p>
            </div>
        </div>
      </div>
    </>
  );
};

export default Header;
