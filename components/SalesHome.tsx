import React from 'react';
import { Check, MapPin, Phone } from 'lucide-react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';

const choices = [
  { id: 'end-of-tenancy', image: '/servicio-privado-limpieza-apartamento.webp' },
  { id: 'daily-cleaning', image: '/servicio-privado-limpieza-oficina-casa.webp' },
  { id: 'deep-cleaning', image: '/servicio-privado-limpieza-cocina.webp' },
  { id: 'window-cleaning', image: '/kai-services/windows.webp' },
  { id: 'business', image: '/kai-calendar/optimized/commercial/offices-corporate/768.webp' },
  { id: 'gardening', image: '/servicio-privado-jardineria.webp' },
];

export default function SalesHome({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { language } = useTranslation(), copy = salesCopy(language);
  const select = (service: string) => {
    if (service === 'business') return onNavigate('/commercial-quote');
    if (service === 'window-cleaning') return onNavigate('/kontakt?service=window-cleaning');
    if (service === 'gardening') return onNavigate('/kontakt?service=gardening');
    try { localStorage.setItem('kraken_preselected_service', service); } catch { /* Quote can still be configured. */ }
    onNavigate('/quote');
  };
  return <>
    <section id="services" className="kraken-section bg-white">
      <div className="kraken-container">
        <div className="max-w-2xl mb-8"><h2 className="kraken-heading">{copy.serviceTitle}</h2><p className="kraken-description">{copy.serviceIntro}</p></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{choices.map((item, index) => <button key={item.id} onClick={() => select(item.id)} className="group text-left bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#0d756b] hover:shadow-lg transition-shadow focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#0d756b]">
          <div className="aspect-[16/9] bg-slate-100 overflow-hidden"><img src={item.image} alt={copy.serviceNames[index]} width="768" height="432" loading="lazy" decoding="async" className="h-full w-full object-cover group-hover:scale-[1.025] transition-transform duration-300" onError={e => { const image = e.currentTarget; if (!image.dataset.fallback) { image.dataset.fallback='true'; image.src='/imagen-google-ai-compatible-desktop.webp'; } }} /></div>
          <div className="p-5"><h3 className="text-lg font-semibold text-[#062e51]">{copy.serviceNames[index]}</h3><p className="mt-2 text-base leading-relaxed text-slate-600">{copy.serviceDescriptions[index]}</p><span className="inline-block mt-4 text-sm font-semibold text-[#0d756b] underline underline-offset-4">{copy.quote}</span></div>
        </button>)}</div>
      </div>
    </section>
    <section className="kraken-section bg-[#062e51] text-white">
      <div className="kraken-container grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        <div><h2 className="kraken-heading !text-white">{copy.includedTitle}</h2><ul className="mt-7 grid gap-5">{copy.included.map(item => <li key={item} className="flex gap-3 text-base sm:text-lg"><Check size={22} className="text-[#62dbc0] shrink-0" aria-hidden="true" />{item}</li>)}</ul></div>
        <div><h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{copy.howTitle}</h2><div className="mt-7 grid gap-6">{copy.steps.map(([title, text]) => <div key={title} className="border-l-2 border-[#62dbc0]/60 pl-5"><h3 className="text-lg font-semibold">{title}</h3><p className="mt-1 text-base leading-relaxed text-slate-300">{text}</p></div>)}</div></div>
      </div>
    </section>
    <section className="kraken-section bg-white">
      <div className="kraken-container grid md:grid-cols-[1fr_1fr] gap-10 items-start">
        <div><h2 className="kraken-heading">{copy.areaTitle}</h2><p className="kraken-description">{copy.areaIntro}</p><div className="flex flex-wrap gap-3 mt-6">{[['Zürich','region-zuerich'],['Winterthur','region-winterthur'],['Schaffhausen','kanton-schaffhausen']].map(([name,path]) => <a key={path} href={`/reinigung/${path}`} onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) { event.preventDefault(); onNavigate(`/reinigung/${path}`); } }} className="inline-flex items-center gap-2 border border-slate-200 rounded-full px-4 py-3 text-sm font-medium text-[#062e51] hover:border-[#0d756b]"><MapPin size={16} aria-hidden="true" />{name}</a>)}</div></div>
        <div><h2 className="text-2xl font-semibold tracking-tight text-[#062e51] mb-4">{copy.faqTitle}</h2>{copy.faqs.map(([q,a]) => <details key={q} className="group border-b border-slate-200 py-4"><summary className="cursor-pointer font-semibold text-base text-[#062e51] pr-3">{q}</summary><p className="mt-3 text-base leading-relaxed text-slate-600">{a}</p></details>)}</div>
      </div>
    </section>
    <section className="px-5 sm:px-8 pb-16"><div className="kraken-container rounded-3xl bg-[#def3ec] !p-7 sm:!p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-7"><div className="max-w-xl"><h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#062e51]">{copy.lastTitle}</h2><p className="mt-3 text-base text-slate-600">{copy.lastIntro}</p></div><div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0"><button onClick={() => onNavigate('/quote')} className="kraken-button kraken-primary">{copy.quote}</button><a href="tel:+41774505705" className="kraken-button kraken-secondary"><Phone size={18} aria-hidden="true" />{copy.call}</a></div></div></section>
  </>;
}
