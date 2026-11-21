import React from 'react';
import { Check, MapPin, Phone } from 'lucide-react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
import { brandCopy } from '../src/content/brandCopy';
import { useKaiMoment } from './useKaiMoment';

export default function SalesHero({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { language } = useTranslation();
  const copy = salesCopy(language), media = useKaiMoment();
  return <section className="kraken-hero" data-header-theme="light" data-kai-moment={media.id}>
    <div className="kraken-container kraken-hero-grid">
      <div className="kraken-hero-copy">
        <p className="kraken-eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}<span>{copy.accent}</span></h1>
        <p className="kraken-hero-intro">{copy.intro}</p>
        <div className="kraken-hero-actions">
          <button onClick={() => onNavigate('/quote')} className="kraken-button kraken-primary">{copy.quote}</button>
          <a className="kraken-button kraken-secondary" href="tel:+41774505705"><Phone size={18} aria-hidden="true" />{copy.call}</a>
        </div>
        <a href="#ford-transit" className="kraken-text-link inline-flex mt-2 min-h-11 items-center">{brandCopy(language).movingLink}</a>
        <ul className="kraken-promises">{copy.promise.map(text => <li key={text}><Check size={17} aria-hidden="true" />{text}</li>)}</ul>
      </div>
      <figure className="kraken-hero-media">
        <picture>
          <source media="(max-width: 639px)" srcSet={media.mobile} width="768" height="576" />
          <img key={media.id} src={media.hero} srcSet={media.heroSmall + ' 768w, ' + media.hero + ' 1440w'} sizes="(min-width: 900px) 50vw, 100vw" alt={copy.imageAlt} width="1440" height="960" fetchPriority="high" loading="eager" onError={event => {
            const image = event.currentTarget;
            if (!image.dataset.fallback) {
              image.dataset.fallback = 'true'; image.closest('picture')?.querySelectorAll('source').forEach(source => source.remove());
              image.removeAttribute('srcset'); image.src = '/imagen-google-ai-compatible-desktop.webp';
            }
          }} />
        </picture>
        <figcaption className="kraken-location-tag"><MapPin size={16} aria-hidden="true" />Zürich · Winterthur · Schaffhausen</figcaption>
      </figure>
    </div>
  </section>;
}
