import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { CalendarDays, ClipboardCheck, MapPin, Phone, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
import { brandCopy } from '../src/content/brandCopy';
import { serviceName, serviceDescription } from '../src/content/serviceCatalog';

import { tiltSurface, resetSurface } from './ui/interactive-surface';

const TransitLoadPlanner = lazy(() => import('./TransitLoadPlanner'));

const choices = [
  { id: 'end-of-tenancy', image: '/kai-calendar/optimized/private/servicio-privado-limpieza-apartamento.webp' },
  { id: 'daily-cleaning', image: '/kai-calendar/optimized/private/servicio-privado-limpieza-oficina-casa.webp' },
  { id: 'deep-cleaning', image: '/kai-calendar/optimized/private/servicio-privado-limpieza-cocina.webp' },
  { id: 'window-cleaning', image: '/kai-services/windows.webp' },
  { id: 'business', image: '/kai-calendar/optimized/commercial/offices-corporate/768.webp' },
  { id: 'moving', image: '/kai-calendar/optimized/private/servicio-privado-mudanza-cajas.webp' },
];
const stepIcons = [ClipboardCheck, CalendarDays, Sparkles];
export default function SalesHome({ onNavigate }: { onNavigate: (page:string)=>void }) {
  const { language } = useTranslation(), copy = salesCopy(language), brand = brandCopy(language);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('kraken-revealed'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    const elements = root.current.querySelectorAll('[data-reveal]');
    elements.forEach(element => { if (element.getBoundingClientRect().top > window.innerHeight) { element.classList.add('kraken-reveal'); observer.observe(element); } });
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove('kraken-reveal')); };
  }, []);
  const select = (service:string) => {
    if (service === 'business') return onNavigate('/commercial-quote');
    if (service === 'window-cleaning' || service === 'gardening') return onNavigate('/kontakt?service=' + service);
    try { localStorage.setItem('kraken_preselected_service',service); } catch { /* Manual selection remains available. */ }
    onNavigate('/quote');
  };
  const go = (event:React.MouseEvent<HTMLAnchorElement>,path:string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();onNavigate(path);
  };
  return <div ref={root} className="kraken-home-content">
    <section id="services" className="kraken-section">
      <div className="kraken-container">
        <div className="kraken-section-heading"><div><p className="kraken-eyebrow">{brand.servicesEyebrow}</p><h2 className="kraken-heading">{copy.serviceTitle}</h2><p className="kraken-description">{copy.serviceIntro}</p></div><a className="kraken-text-link" href="/services" onClick={event=>go(event,'/services')}>{brand.services}</a></div>
        <div className="kraken-service-grid">{choices.map((item,index)=><button key={item.id} type="button" className="kraken-service-card kraken-depth-card" data-reveal onPointerMove={tiltSurface} onPointerLeave={resetSurface} onClick={()=>select(item.id)}>
          <figure><img src={item.image} alt={item.id === 'moving' ? serviceName(language,'moving-furniture') : copy.serviceNames[index]} width="768" height="480" loading="lazy" decoding="async" onError={event=>{const image=event.currentTarget;if(!image.dataset.fallback){image.dataset.fallback='true';image.src='/imagen-google-ai-compatible-desktop.webp';}}} /></figure>
          <div className="kraken-service-card-body"><h3>{item.id === 'moving' ? serviceName(language,'moving-furniture') : copy.serviceNames[index]}</h3><p>{item.id === 'moving' ? serviceDescription(language,'moving-furniture') : copy.serviceDescriptions[index]}</p><span className="kraken-text-link">{copy.quote}</span></div>
        </button>)}</div>
      </div>
    </section>
    <Suspense fallback={<div className="min-h-[42rem]" aria-hidden="true" />}><TransitLoadPlanner onNavigate={onNavigate} /></Suspense>
    <section className="kraken-section kraken-process">
      <div className="kraken-container">
        <p className="kraken-eyebrow">{brand.processEyebrow}</p><h2 className="kraken-heading">{copy.howTitle}</h2>
        <div className="kraken-process-grid">{copy.steps.map(([title,text],index)=>{const Icon=stepIcons[index];return <div className="kraken-process-item" data-reveal key={title}><Icon size={26} strokeWidth={1.6} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>;})}</div>
      </div>
    </section>
    <section className="kraken-section">
      <div className="kraken-container kraken-area-faq">
        <div><p className="kraken-eyebrow">{brand.areaEyebrow}</p><h2 className="kraken-heading">{copy.areaTitle}</h2><p className="kraken-description">{copy.areaIntro}</p><nav className="kraken-area-list" aria-label={copy.coverage}>{[['Zürich','region-zuerich'],['Winterthur','region-winterthur'],['Schaffhausen','kanton-schaffhausen']].map(([name,path])=><a key={path} href={'/reinigung/'+path} onClick={event=>go(event,'/reinigung/'+path)}><span>{name}</span><MapPin size={20} aria-hidden="true" /></a>)}</nav></div>
        <div className="kraken-faq"><h2 className="kraken-faq-title">{copy.faqTitle}</h2>{copy.faqs.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </div>
    </section>
    <section className="pb-16 sm:pb-24"><div className="kraken-container"><div className="kraken-final-cta" data-reveal><div><h2 className="kraken-heading">{copy.lastTitle}</h2><p className="kraken-description">{copy.lastIntro}</p></div><div className="kraken-final-cta-actions"><button className="kraken-button kraken-primary" onClick={()=>onNavigate('/quote')}>{copy.quote}</button><a href="tel:+41774505705" className="kraken-button kraken-secondary"><Phone size={17} aria-hidden="true" />{copy.call}</a></div></div></div></section>
  </div>;
}
