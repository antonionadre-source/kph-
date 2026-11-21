import React from 'react';
import { Check, Phone } from 'lucide-react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
import { useKaiMoment } from './useKaiMoment';

export default function SalesHero({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { language } = useTranslation();
  const copy = salesCopy(language), media = useKaiMoment();
  return <section data-header-theme="light" data-kai-moment={media.id} className="bg-[#f0f6f9] border-b border-slate-200/70">
    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-8 sm:py-12 lg:py-12 grid lg:grid-cols-[1fr_1fr] items-center gap-8 lg:gap-12">
      <div className="max-w-xl">
        <p className="text-sm sm:text-base text-[#176b66] font-semibold mb-4">{copy.eyebrow}</p>
        <h1 className="text-[clamp(2.2rem,3.9vw,3.6rem)] leading-[1.08] tracking-[-0.045em] font-bold text-[#062e51]">{copy.title}<br /><span className="text-[#0d756b]">{copy.accent}</span></h1>
        <p className="text-base sm:text-lg leading-relaxed text-slate-600 mt-5 max-w-lg">{copy.intro}</p>
        <div className="flex flex-col min-[420px]:flex-row gap-3 mt-7">
          <button onClick={() => onNavigate('consultation')} className="kraken-button kraken-primary">{copy.quote}</button>
          <a className="kraken-button kraken-secondary" href="tel:+41774505705"><Phone size={18} aria-hidden="true" />{copy.call}</a>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-sm text-slate-600">{copy.promise.map(text => <li key={text} className="flex items-center gap-2"><Check size={16} className="text-[#0d756b] shrink-0" aria-hidden="true" />{text}</li>)}</ul>
      </div>
      <figure className="relative rounded-[1.75rem] overflow-hidden bg-[#dbeaf1] aspect-[4/3] lg:aspect-[3/2] border border-white shadow-[0_15px_45px_-25px_rgba(3,43,89,0.4)]">
        <picture>
          <source media="(max-width: 767px)" srcSet={media.mobile} width="768" height="576" />
          <img key={media.id} src={media.hero} srcSet={`${media.heroSmall} 768w, ${media.hero} 1440w`} sizes="(min-width: 1024px) 48vw, 100vw" alt={copy.imageAlt} width="1440" height="960" fetchPriority="high" loading="eager" className="absolute inset-0 h-full w-full object-cover" onError={event => { const image = event.currentTarget; if (!image.dataset.fallback) { image.dataset.fallback = 'true'; image.closest('picture')?.querySelectorAll('source').forEach(source => source.remove()); image.removeAttribute('srcset'); image.src = '/imagen-google-ai-compatible-desktop.webp'; } }} />
        </picture>
        <figcaption className="absolute bottom-4 left-4 right-4 inline-flex w-fit rounded-full bg-white/95 text-[#062e51] px-4 py-2 text-xs sm:text-sm font-medium backdrop-blur-sm">Zürich · Winterthur · Schaffhausen</figcaption>
      </figure>
    </div>
  </section>;
}
