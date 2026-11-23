import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n';
import { homeText, normalizeHomeLanguage } from './homeTranslations';
import { HomeLanguageSelector } from './HomeLanguageSelector';

/** The approved navigation is shared by the home and the services page. */
export default function ApprovedHeader({ servicesPage = false }: { onNavigate: (path: string) => void; servicesPage?: boolean }) {
  const { language } = useTranslation();
  const t = (source: string) => homeText(normalizeHomeLanguage(language), source);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const href = (path: string) => {
    const [pathname, hash] = path.split('#');
    if (!servicesPage && hash && pathname === '/') return '#' + hash;
    return `${pathname || '/'}?lang=${encodeURIComponent(language)}${hash ? '#' + hash : ''}`;
  };
  useEffect(() => {
    const media = window.matchMedia('(min-width:1081px)');
    const resize = () => { if (media.matches) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
    };
    media.addEventListener('change', resize);
    document.addEventListener('keydown', escape);
    return () => { media.removeEventListener('change', resize); document.removeEventListener('keydown', escape); };
  }, [open]);
  const links = <>
    <a href={href('/leistungen')} aria-current={servicesPage ? 'page' : undefined}>{t('Leistungen')}</a>
    <a href={href('/#umzug')}>{t('Kleine Umzüge')}</a>
    <a href={href('/#ueber-uns')}>{t('Über Kraken')}</a>
    <a href="#kontakt">{t('Kontakt')}</a>
  </>;
  return <>
    <a className="skip-link" href="#main">{t('Zum Inhalt')}</a>
    <header className="site-header">
      <div className="header-inner container">
        <a className="brand-lockup" href={href('/')} aria-label={t('Kraken Properties and Facilities Management – Startseite')}>
          <span className="brand-logo"><img src="/home-approved/assets/logo.webp" alt="Kraken" width="1024" height="1024" /></span>
          <span className="brand-descriptor"><span>Properties and Facilities</span><span>Management</span></span>
        </a>
        <nav className="desktop-nav" aria-label={t('Hauptnavigation')}>{links}</nav>
        <div className="header-actions"><HomeLanguageSelector /><button className="icon-button menu-toggle" id="menuToggle" ref={toggle} type="button"
          aria-label={t(open ? 'Menü schliessen' : 'Menü öffnen')} aria-expanded={open} aria-controls="mobileNav" onClick={() => setOpen(value => !value)}>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={open ? 'm6 6 12 12M6 18 18 6' : 'M3 6h18M3 12h18M3 18h18'} /></svg>
        </button></div>
      </div>
      <nav className="mobile-nav" id="mobileNav" aria-label={t('Mobile Navigation')} hidden={!open} onClick={() => setOpen(false)}>{links}</nav>
    </header>
  </>;
}
