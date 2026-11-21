import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, UserRound, Phone } from 'lucide-react';
import { useTranslation, LANGUAGE_NAMES, type Language } from '../i18n';
import { useAuth } from './Auth';
import { salesCopy } from '../src/content/salesCopy';

const skipLabels: Record<string,string> = {de:'Zum Inhalt springen',en:'Skip to content',es:'Saltar al contenido',fr:'Aller au contenu',it:'Salta al contenuto',pt:'Saltar para o conteúdo'};
const navigationLabels: Record<string,string> = {de:'Hauptnavigation',en:'Main navigation',es:'Navegación principal',fr:'Navigation principale',it:'Navigazione principale',pt:'Navegação principal'};
const activePages: Record<string,string[]> = {'/services':['services-page','seo-landing'],'/commercial':['commercial-services','commercial-quote'],'/einsatzgebiete':['coverage-hub','region-hub','municipality-page']};
export default function SalesHeader({ onNavigate, currentPage, theme }: { onNavigate: (page: string) => void; currentPage: string; theme?: 'retro' }) {
  const { language, setLanguage } = useTranslation(), copy = salesCopy(language), { user } = useAuth();
  const [open,setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  useEffect(() => { setOpen(false); }, [currentPage]);
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow; document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('a[href]')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),select') || []) as HTMLElement[];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const resize = () => { if (window.innerWidth >= 1100) setOpen(false); };
    document.addEventListener('keydown',onKey); window.addEventListener('resize',resize);
    return () => { document.body.style.overflow = before; document.removeEventListener('keydown',onKey); window.removeEventListener('resize',resize); };
  },[open]);
  const go = (event:React.MouseEvent<HTMLAnchorElement>,path:string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault(); setOpen(false); onNavigate(path);
  };
  const links = [[copy.services,'/services'],[copy.business,'/commercial'],[copy.coverage,'/einsatzgebiete']];
  const languages = (id:string) => <label htmlFor={id}><span className="sr-only">{copy.language}</span><select id={id} value={language} onChange={event => setLanguage(event.target.value as Language)} className="kraken-language" aria-label={copy.language}>{Object.entries(LANGUAGE_NAMES).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></label>;
  return <>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-3 z-[150] bg-white p-3 text-[#032b59]">{skipLabels[language.split('-')[0]] || skipLabels.de}</a>
    <header className={`kraken-header${theme === 'retro' ? ' kraken-header--retro' : ''}`} data-theme={theme}>
      <div className="kraken-container kraken-header-inner">
        <a href="/" onClick={event => go(event,'/')} lang="en" aria-label="Kraken PFM — Properties and Facilities Management" className="kraken-brand kraken-brand-lockup min-w-0 gap-2 sm:gap-3"><img src={theme === 'retro' ? '/kai-calendar/optimized/brand/logo-white-480.webp' : '/kai-calendar/optimized/brand/logo-blue-480.webp'} width="480" height="206" alt="Kraken PFM" className="kraken-brand-image" style={{ width: 'clamp(4.5rem, 10vw, 9rem)' }} /><span className="kraken-brand-descriptor max-w-[5.5rem] text-xs font-medium leading-tight sm:max-w-[9rem] sm:text-sm">Properties and Facilities Management</span></a>
        <nav className="kraken-navigation" aria-label={navigationLabels[language.split('-')[0]] || navigationLabels.de}>{links.map(([label,path]) => <a key={path} href={path} onClick={event => go(event,path)} aria-current={activePages[path]?.includes(currentPage) ? 'page' : undefined}>{label}</a>)}</nav>
        <div className="kraken-header-actions">
          <div className="kraken-header-language">{languages('header-language')}</div>
          <a href={user ? '/dashboard' : '/login'} onClick={event => go(event,user ? '/dashboard' : '/login')} className="kraken-account" aria-label={copy.account}><UserRound size={20} aria-hidden="true" /><span>{copy.account}</span></a>
          <button className="kraken-button kraken-primary kraken-header-quote" onClick={() => onNavigate('/quote')}>{copy.quote}</button>
          <button ref={toggle} type="button" className="kraken-menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? copy.close : copy.menu} onClick={() => setOpen(value => !value)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {open && <div id="mobile-navigation" className="kraken-mobile-nav" ref={panel} role="dialog" aria-modal="true" aria-label={copy.menu}>
        <nav>{links.map(([label,path]) => <a key={path} href={path} onClick={event => go(event,path)} aria-current={activePages[path]?.includes(currentPage) ? 'page' : undefined}>{label}</a>)}<a href={user ? '/dashboard' : '/login'} onClick={event => go(event,user ? '/dashboard' : '/login')}>{copy.account}</a></nav>
        <div className="kraken-mobile-nav-actions">{languages('menu-language')}<button className="kraken-button kraken-primary" onClick={() => {setOpen(false);onNavigate('/quote');}}>{copy.quote}</button><a href="tel:+41774505705" className="kraken-button kraken-secondary"><Phone size={17} aria-hidden="true" />+41 77 450 57 05</a><button type="button" className="min-h-11 text-sm font-semibold text-[#50647c]" onClick={() => {setOpen(false);toggle.current?.focus();}}>{copy.close}</button></div>
      </div>}
    </header>
  </>;
}
