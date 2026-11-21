import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, MapPin, Pause, Play, Sparkles } from 'lucide-react';
import { useInView, useReducedMotion } from 'motion/react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
import { brandCopy } from '../src/content/brandCopy';
import { useKaiMoment } from './useKaiMoment';
import { PrismaHero, WordsPullUp } from './ui/prisma-hero';

const labels = {
  de: { action: 'Kai im Einsatz', season: 'Jahreszeit', reduced: 'Reduzierte Bewegung aktiviert', pause: 'Animation pausieren', play: 'Animation fortsetzen', scenes: 'Hero-Szene wählen', alt: 'Kai wischt einen Schweizer Wohnraum, mit dem weissen Kraken-Logo auf seiner blauen Kappe und seinem Polo.' },
  en: { action: 'Kai at work', season: 'This season', reduced: 'Reduced motion enabled', pause: 'Pause animation', play: 'Resume animation', scenes: 'Choose hero scene', alt: 'Kai mopping a Swiss home, with the white Kraken logo on his navy cap and polo.' },
  fr: { action: 'Kai en action', season: 'La saison', reduced: 'Animations réduites activées', pause: 'Mettre en pause', play: 'Reprendre l’animation', scenes: 'Choisir la scène', alt: 'Kai nettoie un logement suisse, avec le logo blanc Kraken sur sa casquette et son polo bleu marine.' },
  it: { action: 'Kai al lavoro', season: 'La stagione', reduced: 'Movimento ridotto attivo', pause: 'Pausa animazione', play: 'Riprendi animazione', scenes: 'Scegli la scena', alt: 'Kai pulisce una casa svizzera, con il logo bianco Kraken sul cappellino e sulla polo blu.' },
  es: { action: 'Kai en acción', season: 'Temporada', reduced: 'Movimiento reducido activado', pause: 'Pausar animación', play: 'Reanudar animación', scenes: 'Elegir escena', alt: 'Kai limpiando una vivienda suiza, con el logo blanco de Kraken en la gorra y el polo azul marino.' },
  pt: { action: 'Kai em ação', season: 'A estação', reduced: 'Movimento reduzido ativo', pause: 'Pausar animação', play: 'Retomar animação', scenes: 'Escolher cena', alt: 'Kai a limpar uma casa suíça, com o logótipo branco Kraken no boné e no polo azul-marinho.' },
} as const;

export default function SalesHero({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { language } = useTranslation();
  const copy = salesCopy(language), media = useKaiMoment();
  const text = labels[language.split('-')[0] as keyof typeof labels] || labels.de;
  const reducedMotion = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: .12 });
  const [manual, setManual] = useState(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('kai'));
  const [scene, setScene] = useState<'action' | 'season'>(() => manual ? 'season' : 'action');
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update(); document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (manual || paused || reducedMotion !== false || !visible || !inView) return;
    const timer = window.setTimeout(() => setScene(value => value === 'action' ? 'season' : 'action'), scene === 'action' ? 14000 : 8000);
    return () => window.clearTimeout(timer);
  }, [manual, paused, reducedMotion, scene, visible, inView]);
  const animate = reducedMotion === false && !paused && visible && inView;
  const seasonal = scene === 'season';
  const choose = (value: 'action' | 'season') => { setManual(true); setScene(value); };
  return <div ref={root} className="kraken-hero-shell" data-kai-moment={media.id} data-hero-scene={scene} data-motion={animate ? 'running' : 'paused'}>
    <PrismaHero className={`kraken-hero kraken-hero-cinematic ${animate ? 'kraken-hero-animated' : ''}`} contentClassName="kraken-cinematic-content" mediaClassName="kraken-cinematic-media" overlayClassName="kraken-cinematic-shade" interactive={animate} posterSrc={seasonal ? media.hero : '/kai-brand-v3/hero-cleaning-1672.webp'} posterSrcSet={seasonal ? `${media.heroSmall} 768w, ${media.hero} 1440w` : '/kai-brand-v3/hero-cleaning-960.webp 960w, /kai-brand-v3/hero-cleaning-1672.webp 1672w'} posterSizes="(min-width: 768px) 1440px, 100vw" posterAlt={seasonal ? copy.imageAlt : text.alt}>
      <div className="kraken-hero-scene-controls" role="group" aria-label={text.scenes}>
        <button type="button" aria-pressed={!seasonal} onClick={() => choose('action')}><Sparkles size={15} aria-hidden="true" />{text.action}</button>
        <button type="button" aria-pressed={seasonal} onClick={() => choose('season')}>{text.season}</button>
        <button type="button" className="kraken-animation-toggle" aria-label={reducedMotion ? text.reduced : paused ? text.play : text.pause} title={reducedMotion ? text.reduced : paused ? text.play : text.pause} onClick={() => setPaused(value => !value)} disabled={reducedMotion === true}>{paused || reducedMotion ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>
      </div>
      <div className="kraken-hero-copy">
        <p className="kraken-eyebrow">{copy.eyebrow}</p>
        <h1><WordsPullUp text={copy.title} /><WordsPullUp text={copy.accent} className="kraken-hero-accent" /></h1>
        <p className="kraken-hero-intro">{copy.intro}</p>
        <div className="kraken-hero-actions">
          <button onClick={() => onNavigate('/quote')} className="kraken-button kraken-primary">{copy.quote}<ArrowUpRight size={19} aria-hidden="true" /></button>
          <a className="kraken-button kraken-secondary" href="tel:+41774505705">{copy.call}</a>
        </div>
        <a href="#ford-transit" className="kraken-text-link kraken-hero-moving-link">{brandCopy(language).movingLink}<ArrowUpRight size={16} aria-hidden="true" /></a>
        <ul className="kraken-promises">{copy.promise.map(value => <li key={value}><Check size={16} aria-hidden="true" />{value}</li>)}</ul>
      </div>
      <p className="kraken-cinematic-location"><MapPin size={16} aria-hidden="true" />Zürich · Winterthur · Schaffhausen</p>
    </PrismaHero>
  </div>;
}
