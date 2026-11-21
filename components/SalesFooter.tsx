import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
import { brandCopy } from '../src/content/brandCopy';

export default function SalesFooter({onNavigate,theme}:{onNavigate:(page:string)=>void;theme?:'retro'}) {
  const {language,t}=useTranslation(),copy=salesCopy(language),brand=brandCopy(language);
  const go=(event:React.MouseEvent<HTMLAnchorElement>,path:string)=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();onNavigate(path);};
  const serviceLinks=[[copy.services,'/services'],[copy.business,'/commercial'],[copy.coverage,'/einsatzgebiete'],[copy.account,'/dashboard']];
  const companyLinks=[[t('nav.about'),'/about'],[t('nav.sustainability'),'/sustainability'],[t('nav.blog'),'/blog'],[t('footer.careers'),'/careers']];
  const legalLinks=[[t('footer.privacy'),'/gdpr'],[t('footer.terms'),'/terms'],[brand.legal,'/impressum']];
  return <footer className={`kraken-footer${theme === 'retro' ? ' kraken-footer--retro' : ''}`} data-theme={theme}>
    <div className="kraken-container">
      <div className="kraken-footer-grid">
        <div className="kraken-footer-brand"><a href="/" onClick={event=>go(event,'/')} lang="en" aria-label="Kraken PFM — Properties and Facilities Management" className="kraken-brand-lockup kraken-brand-lockup-footer inline-flex items-center gap-3"><img src="/kai-calendar/optimized/brand/logo-white-480.webp" width="480" height="206" alt="Kraken PFM" className="kraken-footer-logo kraken-brand-image" style={{ width: 'clamp(5.5rem, 9vw, 8rem)', marginBottom: 0 }} loading="lazy" /><span className="kraken-brand-descriptor max-w-[8rem] text-sm font-medium leading-snug text-white">Properties and Facilities Management</span></a><p className="mt-5 max-w-xs">{brand.tagline}</p></div>
        <div><h2>{brand.services}</h2><nav aria-label={brand.services}>{serviceLinks.map(([label,path])=><a key={path} href={path} onClick={event=>go(event,path)}>{label}</a>)}</nav></div>
        <div><h2>{brand.company}</h2><nav aria-label={brand.company}>{companyLinks.map(([label,path])=><a key={path} href={path} onClick={event=>go(event,path)}>{label}</a>)}</nav></div>
        <div className="kraken-footer-contact"><h2>{brand.contact}</h2><a href="tel:+41774505705"><Phone size={16} aria-hidden="true" />+41 77 450 57 05</a><br/><a href="mailto:info@krakenpfm.ch"><Mail size={16} aria-hidden="true" />info@krakenpfm.ch</a><address className="mt-4">Seewadelstrasse 3<br/>8203 Schaffhausen</address></div>
      </div>
      <div className="kraken-footer-bottom"><span>© {new Date().getFullYear()} Kraken Properties and Facilities Management</span><div className="kraken-footer-legal">{legalLinks.map(([label,path])=><a key={path} href={path} onClick={event=>go(event,path)}>{label}</a>)}</div></div>
    </div>
  </footer>;
}
