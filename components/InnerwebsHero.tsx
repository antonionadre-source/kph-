import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, MapPin, Pause, Play, Sparkles } from 'lucide-react';
import { useInView, useReducedMotion } from 'motion/react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
import { useKaiMoment } from './useKaiMoment';
import { tiltSurface, resetSurface } from './ui/interactive-surface';
import './ui/innerwebs-hero.css';

const text = {
  es: { eyebrow: 'Limpieza · Mudanzas · Mantenimiento', title: 'Menos caos.', accent: 'Todo en orden.', services: 'Explorar servicios', action: 'Kai en acción', season: 'Temporada', pause: 'Pausar movimiento', resume: 'Reanudar movimiento', reduced: 'Movimiento reducido activado', scenes: 'Elegir escena de Kai', caption: 'Una cosa menos de la que preocuparse.', moving: 'Mudanzas con Ford Transit', alt: 'Kai limpiando una vivienda suiza, con el logo de Kraken en su gorra y polo azul marino.' },
  de: { eyebrow: 'Reinigung · Umzug · Hauswartung', title: 'Weniger Chaos.', accent: 'Alles in Ordnung.', services: 'Services entdecken', action: 'Kai im Einsatz', season: 'Jahreszeit', pause: 'Bewegung pausieren', resume: 'Bewegung fortsetzen', reduced: 'Reduzierte Bewegung aktiviert', scenes: 'Kai-Szene wählen', caption: 'Eine Sorge weniger.', moving: 'Umzug mit Ford Transit', alt: 'Kai reinigt einen Schweizer Wohnraum, mit dem Kraken-Logo auf seiner Kappe und seinem marineblauen Polo.' },
  en: { eyebrow: 'Cleaning · Moving · Property care', title: 'Less chaos.', accent: 'All sorted.', services: 'Explore services', action: 'Kai at work', season: 'This season', pause: 'Pause motion', resume: 'Resume motion', reduced: 'Reduced motion enabled', scenes: 'Choose a Kai scene', caption: 'One less thing to worry about.', moving: 'Moving with Ford Transit', alt: 'Kai cleaning a Swiss home, with the Kraken logo on his navy cap and polo.' },
  fr: { eyebrow: 'Nettoyage · Déménagement · Entretien', title: 'Moins de chaos.', accent: 'Tout en ordre.', services: 'Découvrir les services', action: 'Kai en action', season: 'La saison', pause: 'Mettre en pause', resume: 'Reprendre le mouvement', reduced: 'Animations réduites activées', scenes: 'Choisir une scène de Kai', caption: 'Un souci de moins.', moving: 'Déménagement avec Ford Transit', alt: 'Kai nettoie un logement suisse, avec le logo Kraken sur sa casquette et son polo bleu marine.' },
  it: { eyebrow: 'Pulizia · Traslochi · Manutenzione', title: 'Meno caos.', accent: 'Tutto in ordine.', services: 'Scopri i servizi', action: 'Kai al lavoro', season: 'La stagione', pause: 'Pausa movimento', resume: 'Riprendi movimento', reduced: 'Movimento ridotto attivo', scenes: 'Scegli una scena di Kai', caption: 'Una preoccupazione in meno.', moving: 'Traslochi con Ford Transit', alt: 'Kai pulisce una casa svizzera, con il logo Kraken sul cappellino e sulla polo blu.' },
  pt: { eyebrow: 'Limpeza · Mudanças · Manutenção', title: 'Menos caos.', accent: 'Tudo em ordem.', services: 'Explorar serviços', action: 'Kai em ação', season: 'A estação', pause: 'Pausar movimento', resume: 'Retomar movimento', reduced: 'Movimento reduzido ativo', scenes: 'Escolher uma cena de Kai', caption: 'Uma preocupação a menos.', moving: 'Mudanças com Ford Transit', alt: 'Kai limpa uma casa suíça, com o logótipo Kraken no boné e no polo azul-marinho.' },
} as const;

/** Original Kraken concept: retro CRT art is CSS, while the screen uses approved Kai media. */
export default function InnerwebsHero({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { language } = useTranslation();
  const copy = salesCopy(language), labels = text[language.split('-')[0] as keyof typeof text] || text.de;
  const media = useKaiMoment();
  const root = useRef<HTMLElement>(null), inView = useInView(root, { amount: .1 });
  const reducedMotion = useReducedMotion();
  const [manual, setManual] = useState(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('kai'));
  const [scene, setScene] = useState<'action' | 'season'>(() => manual ? 'season' : 'action');
  const [paused, setPaused] = useState(false), [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update(); document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  const animate = reducedMotion === false && !paused && visible && inView;
  useEffect(() => {
    if (!animate || manual) return;
    const timer = window.setTimeout(() => setScene(value => value === 'action' ? 'season' : 'action'), scene === 'action' ? 16000 : 8000);
    return () => window.clearTimeout(timer);
  }, [animate, manual, scene]);
  const seasonal = scene === 'season';
  const choose = (value: 'action' | 'season') => { setManual(true); setScene(value); };
  return <section ref={root} className="kraken-retro-hero" data-header-theme="dark" data-kai-moment={media.id} data-hero-scene={scene} data-motion={animate ? 'running' : 'paused'} data-in-view={inView ? 'true' : 'false'}>
    <div className="retro-ambient" aria-hidden="true" />
    <div className="kraken-container retro-hero-grid">
      <div className="retro-hero-copy">
        <p className="retro-eyebrow"><span aria-hidden="true" className="retro-star">✦</span>{labels.eyebrow}</p>
        <h1 className="retro-dot-title">{labels.title}</h1>
        <p className="retro-marker">{labels.accent}<svg viewBox="0 0 430 30" aria-hidden="true"><path d="M5 20C91 3 285 4 424 8M39 26C171 13 281 16 369 18" /></svg></p>
        <p className="retro-intro">{copy.intro}</p>
        <div className="retro-hero-actions">
          <button className="retro-quote" type="button" onClick={() => onNavigate('/quote')}>{copy.quote}<ArrowUpRight size={21} aria-hidden="true" /></button>
          <a className="retro-service-link" href="#services">{labels.services}<ArrowDown size={17} aria-hidden="true" /></a>
        </div>
        <ul className="retro-promises">{copy.promise.map(value => <li key={value}><Check size={15} aria-hidden="true" />{value}</li>)}</ul>
        <a href="#ford-transit" className="retro-moving-link">{labels.moving}<ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
      <div className="retro-hero-art">
        <div className="retro-machine" onPointerMove={event => { if (animate) tiltSurface(event); }} onPointerLeave={resetSurface}>
          <div className="retro-monitor">
            <div className="retro-monitor-top" aria-hidden="true"><span>KRAKEN PFM</span><span>✦</span></div>
            <figure className="retro-screen">
              <img src={seasonal ? media.hero : '/kai-brand-v3/hero-cleaning-1672.webp'} srcSet={seasonal ? `${media.heroSmall} 768w, ${media.hero} 1440w` : '/kai-brand-v3/hero-cleaning-960.webp 960w, /kai-brand-v3/hero-cleaning-1672.webp 1672w'} sizes="(min-width: 1100px) 650px, (min-width: 768px) 55vw, 95vw" alt={seasonal ? copy.imageAlt : labels.alt} width="1672" height="941" loading="eager" fetchPriority="high" decoding="async" />
              <div className="retro-screen-glass" aria-hidden="true" />
              <figcaption className="retro-screen-label"><span className="retro-screen-dot" aria-hidden="true" />{seasonal ? labels.season : labels.action}</figcaption>
            </figure>
            <div className="retro-monitor-chin" aria-hidden="true"><img src="/kai-calendar/optimized/brand/logo-blue-480.webp" alt="" width="72" height="31" /><span className="retro-speaker" /><span className="retro-power" /></div>
          </div>
          <div className="retro-monitor-neck" aria-hidden="true" />
          <div className="retro-monitor-foot" aria-hidden="true" />
          <div className="retro-keyboard" aria-hidden="true"><div className="retro-key-row">{Array.from({ length: 42 }, (_, i) => <span key={i} className={i === 40 ? 'retro-space-key' : i % 13 === 0 ? 'retro-blue-key' : ''} />)}</div></div>
          <div className="retro-desk-shadow" aria-hidden="true" />
        </div>
        <p className="retro-art-caption">{labels.caption}</p>
        <div className="retro-scene-controls" role="group" aria-label={labels.scenes}>
          <button type="button" aria-pressed={!seasonal} onClick={() => choose('action')}><Sparkles size={15} aria-hidden="true" />{labels.action}</button>
          <button type="button" aria-pressed={seasonal} onClick={() => choose('season')}>{labels.season}</button>
          <button type="button" className="retro-motion-control" onClick={() => setPaused(value => !value)} disabled={reducedMotion === true} aria-label={reducedMotion ? labels.reduced : paused ? labels.resume : labels.pause} title={reducedMotion ? labels.reduced : paused ? labels.resume : labels.pause}>{paused || reducedMotion ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>
        </div>
      </div>
    </div>
    <div className="retro-region-strip"><MapPin size={15} aria-hidden="true" /><span>Zürich</span><span aria-hidden="true">✦</span><span>Winterthur</span><span aria-hidden="true">✦</span><span>Schaffhausen</span></div>
  </section>;
}
