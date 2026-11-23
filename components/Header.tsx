import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { companyLogoUrl, companyLogoWhiteUrl } from '../assets';
import { useAuth } from './Auth';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: 'home' | 'clients' | 'login' | 'register' | 'dashboard' | 'about' | 'consultation' | 'gdpr' | 'services-page' | 'sustainability-page' | 'hse' | 'careers' | 'blog';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const desktopLangDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLangDropdownRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const { t, setLanguage, language } = useTranslation();
  const { user, logout } = useAuth();
  const locale = language.split('-')[0];
  const ui = ({
    de: { open: 'Menü öffnen', close: 'Menü schliessen', language: 'Sprache wählen', navigation: 'Hauptnavigation' },
    en: { open: 'Open menu', close: 'Close menu', language: 'Choose language', navigation: 'Main navigation' },
    fr: { open: 'Ouvrir le menu', close: 'Fermer le menu', language: 'Choisir la langue', navigation: 'Navigation principale' },
    it: { open: 'Apri menu', close: 'Chiudi menu', language: 'Scegli la lingua', navigation: 'Navigazione principale' },
    es: { open: 'Abrir menú', close: 'Cerrar menú', language: 'Elegir idioma', navigation: 'Navegación principal' },
    pt: { open: 'Abrir menu', close: 'Fechar menu', language: 'Escolher idioma', navigation: 'Navegação principal' },
  } as Record<string, { open: string; close: string; language: string; navigation: string }>)[locale];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > (currentPage === 'home' ? window.innerHeight * 0.7 : 20));
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!desktopLangDropdownRef.current?.contains(target) && !mobileLangDropdownRef.current?.contains(target)) setLangDropdownOpen(false);
      if (!servicesRef.current?.contains(target)) setServicesOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isLangDropdownOpen) {
        event.preventDefault(); setLangDropdownOpen(false); languageButtonRef.current?.focus();
      } else if (isServicesOpen) {
        event.preventDefault(); setServicesOpen(false); servicesButtonRef.current?.focus();
      } else if (isMobileMenuOpen) {
        event.preventDefault(); setMobileMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isLangDropdownOpen, isServicesOpen, isMobileMenuOpen]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)');
    const closeMenus = () => { setMobileMenuOpen(false); setLangDropdownOpen(false); setServicesOpen(false); };
    media.addEventListener('change', closeMenus);
    return () => media.removeEventListener('change', closeMenus);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = mobilePanelRef.current;
    panel?.querySelector<HTMLElement>('button, a[href]')?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panel) return;
      const controls = (Array.from(panel.querySelectorAll('a[href], button:not(:disabled), [tabindex="0"]')) as HTMLElement[]).filter(element => element.getClientRects().length > 0);
      const first = controls[0]; const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', trapFocus);
      if (mobileToggleRef.current?.getClientRects().length) mobileToggleRef.current.focus();
    };
  }, [isMobileMenuOpen]);

  // Inner pages have light backgrounds, including before the first scroll event.
  const useDarkStyle = currentPage !== 'home' || isScrolled || isMobileMenuOpen;
  const supportedLanguages = [
    { code: 'de-CH', name: 'Deutsch (Schweiz)', flag: '🇨🇭' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];
  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any); setLangDropdownOpen(false); languageButtonRef.current?.focus();
  };
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, page: string) => {
    event.preventDefault(); onNavigate(page); setMobileMenuOpen(false); setServicesOpen(false); setLangDropdownOpen(false);
  };
  const handleLogout = () => { logout(); onNavigate('home'); setMobileMenuOpen(false); };
  const navClass = `inline-flex min-h-11 items-center py-2 text-sm font-bold transition-colors hover:text-blue-600 ${useDarkStyle ? 'text-[#002d5b]' : 'text-white'}`;
  const links = (mobile = false) => <>
    <a href="/about" onClick={event => handleNavClick(event, 'about')} className={mobile ? 'min-h-11 flex items-center text-lg font-bold text-[#002d5b]' : navClass}>{t('nav.about')}</a>
    <a href="/sustainability" onClick={event => handleNavClick(event, 'sustainability-page')} className={mobile ? 'min-h-11 flex items-center text-lg font-bold text-[#002d5b]' : navClass}>{t('nav.sustainability')}</a>
    <a href="/einsatzgebiete" onClick={event => handleNavClick(event, '/einsatzgebiete')} className={mobile ? 'min-h-11 flex items-center text-lg font-bold text-[#002d5b]' : navClass}>{t('nav.coverage')}</a>
    <a href="/blog" onClick={event => handleNavClick(event, 'blog')} className={mobile ? 'min-h-11 flex items-center text-lg font-bold text-[#002d5b]' : navClass}>{t('nav.blog')}</a>
    {user && <a href="/dashboard" onClick={event => handleNavClick(event, 'dashboard')} className={mobile ? 'min-h-11 flex items-center text-lg font-bold text-[#002d5b]' : navClass}>{t('nav.dashboard')}</a>}
  </>;
  const languageSelector = (mobile: boolean) => <div className="relative" ref={mobile ? mobileLangDropdownRef : desktopLangDropdownRef}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setLangDropdownOpen(false); }}>
    <button type="button" id={`${mobile ? 'mobile' : 'desktop'}-language-selector-btn`}
      onClick={event => { languageButtonRef.current = event.currentTarget; setLangDropdownOpen(!isLangDropdownOpen); }}
      aria-label={ui.language} aria-expanded={isLangDropdownOpen} aria-controls={`${mobile ? 'mobile' : 'desktop'}-language-options`}
      className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-3 text-sm font-bold ${useDarkStyle ? 'border-slate-200 bg-slate-50 text-[#002d5b]' : 'border-white/30 bg-white/10 text-white'}`}>
      <span aria-hidden="true">🌎</span><span>{language === 'de-CH' ? 'CH' : language.toUpperCase()}</span>
    </button>
    {isLangDropdownOpen && <ul id={`${mobile ? 'mobile' : 'desktop'}-language-options`} aria-label={ui.language}
      className={`absolute ${mobile && isMobileMenuOpen ? 'left-0' : 'right-0'} z-[110] mt-2 grid max-h-[min(60dvh,24rem)] w-56 max-w-[calc(100vw-2rem)] grid-cols-2 gap-1 overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-2 text-[#002d5b] shadow-2xl`}>
      {supportedLanguages.map(lang => <li key={lang.code}>
        <button type="button" id={`${mobile ? 'mobile' : 'desktop'}-lang-opt-${lang.code}`} onClick={() => handleLanguageChange(lang.code)} aria-current={language === lang.code ? 'true' : undefined}
          className={`flex min-h-11 w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm hover:bg-slate-100 ${language === lang.code ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}>
          <span aria-hidden="true" className="text-xl">{lang.flag}</span><span className="min-w-0 break-words">{lang.name}</span>
        </button>
      </li>)}
    </ul>}
  </div>;

  return <>
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 motion-reduce:transition-none ${useDarkStyle ? 'bg-white/95 py-2 shadow-sm backdrop-blur-md' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto flex min-w-0 items-center justify-between gap-3 px-4 md:px-6">
        <a href="/" onClick={event => handleNavClick(event, 'home')} aria-label="Kraken Properties Homepage" className="relative z-50 flex min-w-0 items-center gap-2 sm:gap-3">
          <img id={useDarkStyle ? 'header-logo-dark' : 'header-logo-white'} src={useDarkStyle ? companyLogoUrl : companyLogoWhiteUrl} alt="Kraken Properties Logo" className="h-11 w-auto max-w-[100px] shrink-0 object-contain sm:h-12 sm:max-w-[120px]" />
          <div className={`hidden min-w-0 max-w-[10rem] flex-col border-l pl-3 text-[11px] font-bold leading-snug sm:flex ${useDarkStyle ? 'border-slate-200 text-[#002d5b]' : 'border-white/30 text-white'}`}>
            <span>Properties and</span><span>Facilities Management</span>
          </div>
        </a>
        <nav aria-label={ui.navigation} className="hidden min-w-0 items-center gap-4 xl:flex 2xl:gap-6">
          <div className="relative flex items-center" ref={servicesRef} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setServicesOpen(false); }}>
            <a id="desktop-services-link" href={`/leistungen?lang=${encodeURIComponent(language)}`} className={navClass}
              onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) handleNavClick(event, '/leistungen'); }}>{t('nav.services')}</a>
            <button type="button" ref={servicesButtonRef} className={`${navClass} min-w-11 justify-center`} aria-label={`${ui.open}: ${t('nav.services')}`} aria-expanded={isServicesOpen} aria-controls="desktop-services-menu"
              onClick={() => setServicesOpen(!isServicesOpen)} onKeyDown={event => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault(); setServicesOpen(true);
                  requestAnimationFrame(() => servicesRef.current?.querySelector<HTMLButtonElement>('#desktop-services-menu button')?.focus());
                }
              }}>
              <span aria-hidden="true">⌄</span>
            </button>
            {isServicesOpen && <div id="desktop-services-menu" className="absolute left-0 top-full z-[100] mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 text-[#002d5b] shadow-2xl">
              <button type="button" onClick={event => handleNavClick(event, '/leistungen')} className="min-h-11 w-full rounded-xl px-4 py-3 text-left text-sm font-bold hover:bg-blue-50">{t('nav.private')}</button>
              <button type="button" onClick={event => handleNavClick(event, 'commercial-services')} className="min-h-11 w-full rounded-xl px-4 py-3 text-left text-sm font-bold hover:bg-blue-50">{t('nav.commercial')}</button>
            </div>}
          </div>
          {links()}{languageSelector(false)}
          {user ? <a href="/" id="desktop-logout-btn" onClick={handleLogout} className="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white">{t('nav.logout')}</a>
            : <a href="/login" id="desktop-login-btn" onClick={event => handleNavClick(event, 'login')} className="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-[#002d5b] px-4 py-2 text-sm font-bold text-white">{t('nav.login')}</a>}
        </nav>
        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          {!isMobileMenuOpen && languageSelector(true)}
          <button type="button" ref={mobileToggleRef} id="mobile-menu-toggle-btn" onClick={() => { setLangDropdownOpen(false); setMobileMenuOpen(!isMobileMenuOpen); }}
            aria-label={isMobileMenuOpen ? ui.close : ui.open} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation"
            className={`relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl ${useDarkStyle ? 'text-[#002d5b] hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>
            <span aria-hidden="true" className={`h-0.5 w-6 bg-current ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span aria-hidden="true" className={`h-0.5 w-6 bg-current ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span aria-hidden="true" className={`h-0.5 w-6 bg-current ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>
    </header>
    {isMobileMenuOpen && <div id="mobile-navigation" ref={mobilePanelRef} role="dialog" aria-modal="true" aria-label={ui.navigation}
      className="fixed inset-x-0 bottom-0 top-[4.5rem] z-[60] overflow-y-auto overscroll-contain bg-white px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 text-[#002d5b] shadow-xl xl:hidden">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {languageSelector(true)}
          <button type="button" onClick={() => setMobileMenuOpen(false)} className="min-h-11 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold">{ui.close}</button>
        </div>
        <nav aria-label={ui.navigation} className="flex w-full flex-col items-start gap-1 break-words">
          <a id="mobile-services-link" href={`/leistungen?lang=${encodeURIComponent(language)}`} className="mt-2 inline-flex min-h-11 items-center py-2 text-lg font-bold text-blue-700"
            onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) handleNavClick(event, '/leistungen'); }}>{t('nav.services')}</a>
          <button type="button" onClick={event => handleNavClick(event, '/leistungen')} className="min-h-11 py-2 text-left text-lg font-bold text-blue-700">{t('nav.private')}</button>
          <button type="button" onClick={event => handleNavClick(event, 'commercial-services')} className="min-h-11 py-2 text-left text-lg font-bold text-blue-700">{t('nav.commercial')}</button>
          {links(true)}
          {user ? <a href="/" onClick={handleLogout} className="mt-2 inline-flex min-h-11 items-center rounded-xl bg-rose-600 px-5 py-2 text-base font-bold text-white">{t('nav.logout')}</a>
            : <a href="/login" onClick={event => handleNavClick(event, 'login')} className="mt-2 inline-flex min-h-11 items-center rounded-xl bg-[#002d5b] px-5 py-2 text-base font-bold text-white">{t('nav.login')}</a>}
        </nav>
        <p className="mt-4 break-words text-sm leading-relaxed text-slate-500">Kraken Properties and Facilities Management Gomes Mendes</p>
      </div>
    </div>}
  </>;
};

export default Header;
