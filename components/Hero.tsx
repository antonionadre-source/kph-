import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { heroImageUrl } from '../assets';
import { ChevronRightIcon, BoltIcon, CheckCircleIcon, ShieldCheckIcon, CleaningBrushIcon, CameraIcon } from './icons';

interface HeroProps {
  onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [activeColor, setActiveColor] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColor((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section data-header-theme="dark" className="relative min-h-screen md:min-h-[85vh] flex flex-col md:flex-row items-center overflow-hidden bg-[#020617]">
      {/* Background Image with Dark Gradient Overlay for optimal text legibility */}
      <div className="relative md:absolute md:inset-0 z-0 w-full h-auto md:h-full">
        <img 
          src="/imagen-google-ai-compatible-desktop.webp"
          srcSet="/imagen-google-ai-compatible-mobile.webp 640w, /imagen-google-ai-compatible-desktop.webp 1200w"
          sizes="(max-width: 767px) 100vw, 50vw"
          alt="Kraken Properties Hero" 
          className="w-full h-auto md:h-full object-contain md:object-cover object-center"
          referrerPolicy="no-referrer"
          loading="eager"
          fetchPriority="high"
          width="1200"
          height="800"
        />
        {/* Soft dark navy gradient overlay: dark behind text on left, fading smoothly so mascot face on right is clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 via-45% to-transparent z-1 pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-8 pb-16 md:pt-28 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl animate-fade-in-up text-center md:text-left relative z-10">
            {/* Handover Guarantee Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[#4ade80] text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] backdrop-blur-md shadow-lg mb-3 md:mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              <span>{t('hero.guarantee_badge')}</span>
            </div>

            {/* Main Title with deep text shadows */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] mb-3 md:mb-4 tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              {t('hero.main_title_part1')}{' '}
              <span className={`transition-colors duration-700 ${
                activeColor === 0 ? 'text-[#007bff]' : 
                activeColor === 1 ? 'text-yellow-400' : 
                'text-red-400'
              }`}>{t('hero.main_title_chaos')}</span>{' '}
              {t('hero.main_title_part2')} <br className="hidden md:block" />
              {t('hero.main_title_part3')}
            </h1>
            
            <p className="text-[#4ade80] font-handwriting font-bold text-base sm:text-lg md:text-2xl mb-2 md:mb-3 -rotate-1 transform-gpu mx-auto md:mx-0 w-fit drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {t('hero.main_subtitle')}
            </p>

            <p className="text-sm sm:text-base md:text-xl text-slate-100 mb-6 md:mb-8 font-medium max-w-xl leading-relaxed mx-auto md:mx-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {t('hero.main_desc')}
            </p>
            
            {/* CTA Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 md:gap-4 mb-6 md:mb-8">
              <button 
                onClick={() => onNavigate('consultation')}
                className="group w-full sm:w-auto bg-gradient-to-r from-[#2dd4bf] to-[#4ade80] text-slate-950 hover:from-[#22c55e] hover:to-[#14b8a6] px-8 py-4 md:px-9 md:py-4.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xl shadow-emerald-950/60 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer"
              >
                <span>{t('hero.main_cta')}</span>
                <span className="text-base font-bold group-hover:translate-x-1 transition-transform">→</span>
              </button>
              
              <button
                onClick={() => onNavigate('consultation')}
                className="group w-full sm:w-auto bg-slate-950/60 border-2 border-white/75 backdrop-blur-md text-white hover:bg-white/15 hover:border-white px-7 py-4 md:px-8 md:py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer"
              >
                <span>{t('hero.secondary_cta')}</span>
                <span className="text-base font-bold group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* Trust Signals Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-4 mt-5 md:mt-7 text-xs sm:text-sm text-slate-100 font-bold uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-2 bg-slate-950/40 border border-white/15 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircleIcon className="w-4 h-4 text-[#2dd4bf] shrink-0" />
                <span>{t('hero.trust_signal_1')}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/40 border border-white/15 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircleIcon className="w-4 h-4 text-[#2dd4bf] shrink-0" />
                <span>{t('hero.trust_signal_2')}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/40 border border-white/15 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircleIcon className="w-4 h-4 text-[#2dd4bf] shrink-0" />
                <span>{t('hero.trust_signal_3')}</span>
              </div>
            </div>


          </div>

          {/* Right Content: Spacer for the background mascot */}
          <div className="hidden lg:block h-[450px]"></div>
        </div>
      </div>

      {/* Curved Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-[calc(100%+1.3px)] h-[80px] md:h-[150px]"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="#FFFFFF" 
            opacity=".1"
            transform="rotate(180 600 60)"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5V0Z" 
            fill="#FFFFFF" 
            opacity=".2"
            transform="rotate(180 600 60)"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="#FFFFFF"
            transform="rotate(180 600 60)"
          ></path>
        </svg>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
          animation: fade-in-right 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
