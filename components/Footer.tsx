import React from 'react';
import { useTranslation } from '../i18n';
import { languageSelectionUrl, normalizeSiteLanguage } from '../src/locale';
import { openHomeCalculator, type HomeService } from '../src/home/calculator';
import { homeText, normalizeHomeLanguage } from './home/homeTranslations';
import { siteConfig } from './home/site-config';
import './home/approved-home.css';
import './home/responsive-fixes.css';
import './home/home-language.css';
import './home/device-fixes.css';

interface FooterProps {
  onNavigate: (page: string) => void;
}

// Inline icons keep this footer independent of the homepage's SVG definitions.
function FooterIcon({ name }: { name: 'phone' | 'mail' | 'instagram' | 'linkedin' | 'message' }) {
  const paths = {
    phone: <path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.6h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L7 9.5a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.8 2.1Z" />,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 6 10 7L22 6" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7M7 7h.01M11 17v-7h4a3 3 0 0 1 3 3v4M11 13a3 3 0 0 1 3-3" /></>,
    message: <><path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 10 10 0 0 1-4-1l-6 2 2-6a10 10 0 0 1-1-4A8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
  };
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { language } = useTranslation();
  const locale = normalizeSiteLanguage(language) || 'de-CH';
  const homeLanguage = normalizeHomeLanguage(locale);
  const t = (source: string) => homeText(homeLanguage, source);
  const href = (path: string) => languageSelectionUrl(new URL(path, 'https://krakenpfm.ch').href, locale);
  const instagramUrl = siteConfig.instagramUrl as string | null;
  const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Europe/Zurich' }).format(new Date());
  const ordinaryClick = (event: React.MouseEvent<HTMLAnchorElement>) => !event.defaultPrevented && event.button === 0
    && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  const calculator = (event: React.MouseEvent<HTMLAnchorElement>, service: HomeService | null = null) => {
    if (!ordinaryClick(event)) return;
    event.preventDefault();
    openHomeCalculator(service, onNavigate);
  };
  const home = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ordinaryClick(event)) return;
    event.preventDefault();
    onNavigate(href('/'));
  };

  return <div className="kraken-home kraken-site-footer" lang={locale}>
    <footer className="site-footer" id="kontakt">
      <div className="container">
        <div className="footer-invitation"><div><p className="eyebrow">{t('Einfach miteinander sprechen')}</p><h2>{t('Ihr Zuhause.')}<br />{t('Unser nächster Auftrag?')}</h2></div><div><p>{t('Erzählen Sie uns, wobei wir helfen dürfen.')}</p><a className="button button-mint" href={href('/quote')} data-calculator="" onClick={event => calculator(event)}>{t('Jetzt im Rechner starten')}</a></div></div>
        <div className="footer-grid">
          <div className="footer-brand"><a className="logo logo-light" href={href('/')} onClick={home} aria-label={t('Kraken Properties and Facilities Management – Startseite')}><img src="/home-approved/assets/logo.webp" alt="Kraken" width="1024" height="1024" loading="lazy" /></a><p>{t('Reinigung und kleine Umzüge.')}<br />{t('Für private Haushalte.')}<br />{t('Für ein leichteres Ankommen.')}</p><p className="footer-tax">{t('Es wird keine Mehrwertsteuer verrechnet.')}</p></div>
          <div className="footer-contact"><h3>{t('Hier sind wir zu Hause')}</h3><address>Kraken PFM<br />Seewadelstrasse 3<br />{t('8203 Schaffhausen, Schweiz')}</address><a className="footer-map" href="https://www.google.com/maps/search/?api=1&query=Seewadelstrasse%203%2C%208203%20Schaffhausen%2C%20Schweiz" target="_blank" rel="noopener noreferrer">{t('Adresse auf Google Maps')}</a><a className="footer-contact-link" href="tel:+41774505705"><FooterIcon name="phone" />+41 77 450 57 05</a><a className="footer-contact-link" href="mailto:kai@krakenpfm.ch"><FooterIcon name="mail" />kai@krakenpfm.ch</a></div>
          <div className="footer-services"><h3>{t('So helfen wir Ihnen')}</h3><nav aria-label={t('Leistungen im Footer')}>
            <a data-service="windows" href={href('/quote')} data-calculator="" onClick={event => calculator(event, 'windows')}>{t('Fensterreinigung')}</a>
            <a data-service="end" href={href('/quote')} data-calculator="" onClick={event => calculator(event, 'end')}>{t('Umzugsreinigung')}</a>
            <a data-service="regular" href={href('/quote')} data-calculator="" onClick={event => calculator(event, 'regular')}>{t('Regelmässige Reinigung')}</a>
            <a data-service="deep" href={href('/quote')} data-calculator="" onClick={event => calculator(event, 'deep')}>{t('Grundreinigung')}</a>
            <a data-service="moving" href={href('/quote')} data-calculator="" onClick={event => calculator(event, 'moving')}>{t('Kleine Umzüge')}</a>
          </nav></div>
          <div className="footer-regions"><h3>{t('In Ihrer Nähe')}</h3><ul><li>{t('Zürich')}</li><li>{t('Schaffhausen')}</li><li>{t('Winterthur')}</li></ul><h3 className="footer-social-heading">{t('Bleiben wir in Kontakt')}</h3><div className="social-links"><a className={`social-instagram${instagramUrl ? '' : ' is-pending'}`} data-instagram="" href={instagramUrl || undefined} role="link" aria-disabled={instagramUrl ? undefined : true} tabIndex={instagramUrl ? undefined : -1} target="_blank" rel="noopener noreferrer"><FooterIcon name="instagram" />Instagram</a><a href="https://www.linkedin.com/company/krakenpfm/" target="_blank" rel="noopener noreferrer"><FooterIcon name="linkedin" />LinkedIn</a><a href="https://wa.me/41774505705" target="_blank" rel="noopener noreferrer"><FooterIcon name="message" />WhatsApp</a></div></div>
        </div>
        <div className="footer-bottom"><p>© <span>{year}</span> Kraken Properties and Facilities Management Gomes Mendes</p><nav aria-label={t('Rechtliches')}><a href={href('/impressum')} target="_blank" rel="noopener noreferrer">{t('Impressum')}</a><a href={href('/gdpr')} target="_blank" rel="noopener noreferrer">{t('Datenschutz')}</a><a href={href('/terms')} target="_blank" rel="noopener noreferrer">{t('AGB')}</a></nav></div>
        <p className="preview-note">{t('Die Bildwelten sind Illustrationen. Ihren Auftrag planen Sie im Service-Rechner.')}</p>
        <p className="footer-credit">{t('Website made by')}{' '}<a href="https://seociety.ch" target="_blank" rel="noopener noreferrer">seociety.ch</a></p>
      </div>
    </footer>
  </div>;
}
