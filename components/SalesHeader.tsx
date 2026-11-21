import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, UserRound } from 'lucide-react';
import { useTranslation, LANGUAGE_NAMES, type Language } from '../i18n';
import { useAuth } from './Auth';
import { salesCopy } from '../src/content/salesCopy';
const skipContentLabels: Record<string, string> = { de: 'Zum Inhalt springen', en: 'Skip to content', fr: 'Aller au contenu', it: 'Salta al contenuto', es: 'Saltar al contenido', pt: 'Saltar para o conteúdo' };
const companyLogoUrl = '/kai-calendar/optimized/brand/logo-blue-480.webp';

export default function SalesHeader({ onNavigate, currentPage }: { onNavigate: (page: string) => void; currentPage: string }) {
  const { language, setLanguage } = useTranslation(), copy = salesCopy(language), { user } = useAuth();
  const [open, setOpen] = useState(false), toggle = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  useEffect(() => { setOpen(false); }, [currentPage]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href],button,select') || []) as HTMLElement[]; const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    panel.current?.querySelector<HTMLElement>('a[href]')?.focus(); document.addEventListener('keydown', keys);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', keys); };
  }, [open]);
  const go = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => { if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return; event.preventDefault(); setOpen(false); onNavigate(path); };
  const links = [[copy.services,'/services'],[copy.business,'/commercial'],[copy.coverage,'/einsatzgebiete']];
  const languages = <label className="inline-flex items-center"><span className="sr-only">{copy.language}</span><select value={language} onChange={e => setLanguage(e.target.value as Language)} className="kraken-language min-h-11 max-w-40 rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-sm text-[#062e51]" aria-label={copy.language}>{Object.entries(LANGUAGE_NAMES).map(([key,name]) => <option key={key} value={key}>{name}</option>)}</select></label>;
  return <>
    <a className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-3 z-[150] bg-white p-3 text-[#062e51]" href="#main-content">{skipContentLabels[language.split('-')[0]] || skipContentLabels.de}</a>
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-[76px] flex items-center justify-between gap-3">
        <a href="/" aria-label="Kraken PFM" onClick={e=>go(e,'/')} className="shrink-0"><img src={companyLogoUrl} width="190" height="54" alt="Kraken Properties and Facilities Management" className="w-[153px] sm:w-[180px] h-12 object-contain" /></a>
        <nav aria-label="Navigation" className="hidden xl:flex items-center gap-6">{links.map(([label,path]) => <a key={path} href={path} onClick={e=>go(e,path)} className="text-sm font-medium text-[#062e51] hover:text-[#0d756b] py-3">{label}</a>)}</nav>
        <div className="hidden md:flex items-center gap-3">{languages}<a href={user?'/dashboard':'/login'} onClick={e=>go(e,user?'/dashboard':'/login')} className="min-h-11 px-3 inline-flex items-center gap-2 text-sm font-medium text-[#062e51] rounded-xl hover:bg-slate-50"><UserRound size={18} aria-hidden="true" /><span className="hidden lg:inline">{copy.account}</span></a><button onClick={()=>onNavigate('/quote')} className="kraken-button kraken-primary !px-5 !min-h-11 text-sm">{copy.quote}</button></div>
        <button ref={toggle} type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?copy.close:copy.menu} onClick={()=>setOpen(!open)} className="xl:hidden min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl text-[#062e51] border border-slate-200">{open?<X size={23} />:<Menu size={23} />}</button>
      </div>
      {open && <div id="mobile-navigation" ref={panel} role="dialog" aria-modal="true" aria-label={copy.menu} className="xl:hidden fixed top-[76px] inset-x-0 bottom-0 bg-white z-50 overflow-y-auto p-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <nav className="grid gap-2">{links.map(([label,path])=><a href={path} key={path} onClick={e=>go(e,path)} className="text-xl font-semibold py-4 border-b border-slate-100 text-[#062e51]">{label}</a>)}<a href={user?'/dashboard':'/login'} onClick={e=>go(e,user?'/dashboard':'/login')} className="text-xl py-4 text-[#062e51]">{copy.account}</a></nav><div className="mt-7">{languages}</div><button onClick={()=>{setOpen(false);onNavigate('/quote');}} className="kraken-button kraken-primary w-full mt-7">{copy.quote}</button><a href="tel:+41774505705" className="kraken-button kraken-secondary w-full mt-3">{copy.call} · +41 77 450 57 05</a><button type="button" onClick={()=>{setOpen(false);toggle.current?.focus();}} className="min-h-11 p-3 text-base text-slate-600 mt-3">{copy.close}</button>
      </div>}
    </header>
  </>;
}
