import React, { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: CSSProperties;
}
export interface WordSegment { text: string; className?: string; style?: CSSProperties; }
interface WordsPullUpMultiStyleProps { segments: readonly WordSegment[]; className?: string; style?: CSSProperties; }
const wordTransition = (index: number) => ({ duration: .56, delay: Math.min(index * .055, .65), ease: [.16, 1, .3, 1] as const });

/** Continuous screen-reader text; the animated visual words are decorative. */
export function WordsPullUp({ text, className = '', showAsterisk = false, style }: WordsPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: .2 });
  const reducedMotion = useReducedMotion();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const animate = inView && reducedMotion === false;
  return <span ref={ref} className={`kraken-words-pull-up ${className}`} style={{ display: 'inline-flex', flexWrap: 'wrap', perspective: 700, ...style }}>
    <span className="sr-only">{text}{showAsterisk ? '*' : ''}</span>
    {words.map((word, index) => <motion.span key={`${index}-${word}`} aria-hidden="true" initial={false} animate={animate ? { y: [16, 0], opacity: [.35, 1], rotateX: [-16, 0] } : { y: 0, opacity: 1, rotateX: 0 }} transition={animate ? wordTransition(index) : { duration: 0 }} style={{ display: 'inline-block', transformOrigin: '50% 100%', marginInlineEnd: index === words.length - 1 ? 0 : '.24em' }}>{word}{showAsterisk && index === words.length - 1 ? <span style={{ fontSize: '.5em', verticalAlign: 'super' }}>*</span> : null}</motion.span>)}
  </span>;
}

export function WordsPullUpMultiStyle({ segments, className = '', style }: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: .2 });
  const reducedMotion = useReducedMotion();
  const words = segments.flatMap(segment => segment.text.trim().split(/\s+/).filter(Boolean).map(word => ({ word, className: segment.className, style: segment.style })));
  const animate = inView && reducedMotion === false;
  return <span ref={ref} className={`kraken-words-multi-style ${className}`} style={{ display: 'inline-flex', flexWrap: 'wrap', perspective: 700, ...style }}>
    <span className="sr-only">{segments.map(segment => segment.text).join(' ')}</span>
    {words.map((word, index) => <motion.span key={`${index}-${word.word}`} aria-hidden="true" className={word.className} initial={false} animate={animate ? { y: [16, 0], opacity: [.35, 1], rotateX: [-16, 0] } : { y: 0, opacity: 1, rotateX: 0 }} transition={animate ? wordTransition(index) : { duration: 0 }} style={{ display: 'inline-block', transformOrigin: '50% 100%', marginInlineEnd: index === words.length - 1 ? 0 : '.24em', ...word.style }}>{word.word}</motion.span>)}
  </span>;
}

const videoLabels = {
  de: { pause: 'Video pausieren', play: 'Video abspielen' },
  en: { pause: 'Pause video', play: 'Play video' },
  fr: { pause: 'Mettre la vidéo en pause', play: 'Lire la vidéo' },
  it: { pause: 'Metti in pausa il video', play: 'Riproduci il video' },
  es: { pause: 'Pausar vídeo', play: 'Reproducir vídeo' },
  pt: { pause: 'Pausar vídeo', play: 'Reproduzir vídeo' },
} as const;

export interface PrismaHeroProps {
  children: ReactNode;
  id?: string;
  className?: string;
  contentClassName?: string;
  mediaClassName?: string;
  overlayClassName?: string;
  style?: CSSProperties;
  videoSrc?: string;
  posterSrc?: string;
  posterSrcSet?: string;
  posterSizes?: string;
  posterAlt?: string;
  headerTheme?: 'light' | 'dark';
  interactive?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  videoControlLabels?: { pause: string; play: string };
}

/** Optional local media and a mild 3D response, with no template content or navigation. */
export function PrismaHero({ children, id, className = '', contentClassName = '', mediaClassName = '', overlayClassName = '', style, videoSrc, posterSrc, posterSrcSet, posterSizes, posterAlt = '', headerTheme = 'light', interactive = true, autoPlay = true, loop = true, videoControlLabels }: PrismaHeroProps) {
  const { language } = useTranslation();
  const labels = videoControlLabels || videoLabels[language.split('-')[0] as keyof typeof videoLabels] || videoLabels.de;
  const reducedMotion = useReducedMotion();
  const stage = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(stage, { amount: .12 });
  const videoId = useId();
  const [control, setControl] = useState<'play' | 'pause' | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [failed, setFailed] = useState(false);
  const tiltX = useMotionValue(0), tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 110, damping: 22 });
  const rotateY = useSpring(tiltY, { stiffness: 110, damping: 22 });
  const motionAllowed = reducedMotion === false;
  const canLoadVideo = Boolean(videoSrc && !failed && (motionAllowed || control === 'play'));
  const wantsPlayback = canLoadVideo && inView && (control === 'play' || (control !== 'pause' && autoPlay && motionAllowed));

  useEffect(() => { setFailed(false); setHasPlayed(false); }, [videoSrc]);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const sync = () => {
      if (wantsPlayback && !document.hidden) void element.play().catch(() => setPlaying(false));
      else element.pause();
    };
    sync(); document.addEventListener('visibilitychange', sync);
    return () => { document.removeEventListener('visibilitychange', sync); element.pause(); };
  }, [wantsPlayback, canLoadVideo, videoSrc]);
  useEffect(() => { if (!motionAllowed) { tiltX.set(0); tiltY.set(0); } }, [motionAllowed, tiltX, tiltY]);

  const move = (event: React.PointerEvent<HTMLElement>) => {
    if (!interactive || !motionAllowed || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    tiltY.set(((event.clientX - bounds.left) / bounds.width - .5) * 5);
    tiltX.set(-((event.clientY - bounds.top) / bounds.height - .5) * 4);
  };
  return <section ref={stage} id={id} data-header-theme={headerTheme} data-in-view={inView ? "true" : "false"} className={`kraken-prisma-hero relative isolate overflow-hidden ${className}`} style={style} onPointerMove={move} onPointerLeave={() => { tiltX.set(0); tiltY.set(0); }}>
    {(posterSrc || videoSrc) && <motion.div className={`kraken-prisma-media pointer-events-none absolute inset-0 -z-10 ${mediaClassName}`} style={{ transformPerspective: 1100, rotateX: motionAllowed ? rotateX : 0, rotateY: motionAllowed ? rotateY : 0, scale: interactive && motionAllowed ? 1.035 : 1 }}>
      {posterSrc && <img src={posterSrc} srcSet={posterSrcSet} sizes={posterSizes} alt={posterAlt} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" decoding="async" />}
      {videoSrc && <video ref={video} id={videoId} src={canLoadVideo ? videoSrc : undefined} poster={posterSrc} muted playsInline loop={loop} preload={canLoadVideo ? 'metadata' : 'none'} aria-hidden="true" tabIndex={-1} onPlaying={() => { setPlaying(true); setHasPlayed(true); }} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); setHasPlayed(false); }} className="absolute inset-0 h-full w-full object-cover" style={{ opacity: hasPlayed && !failed && canLoadVideo ? 1 : 0 }} />}
      {overlayClassName && <div aria-hidden="true" className={`absolute inset-0 ${overlayClassName}`} />}
    </motion.div>}
    <div className={`kraken-prisma-content relative z-10 ${contentClassName}`}>{children}</div>
    {videoSrc && !failed && <button type="button" aria-controls={videoId} aria-label={playing ? labels.pause : labels.play} title={playing ? labels.pause : labels.play} onClick={() => { if (playing) { video.current?.pause(); setControl('pause'); } else { setControl('play'); if (canLoadVideo) void video.current?.play().catch(() => setPlaying(false)); } }} className="kraken-video-control absolute bottom-4 right-4 z-20 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-white/70 bg-white/95 px-3 py-2 text-sm font-semibold text-[#032b59] shadow-sm">{playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}<span className="sr-only sm:not-sr-only">{playing ? labels.pause : labels.play}</span></button>}
  </section>;
}

export default PrismaHero;
