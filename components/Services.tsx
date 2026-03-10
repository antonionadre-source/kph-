import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { services } from '../assets';
import { PlusIcon } from './icons';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Core services mapped to specific depths
  const abyssalServices = services.filter(s => [
    'end-of-tenancy',
    'deep-cleaning',
    'daily-cleaning',
    'moving-furniture'
  ].includes(s.id));

  // Metadata for the technical HUD
  const systemSpecs: Record<string, { depth: string; pressure: string; tag: string }> = {
    'end-of-tenancy': { depth: '150m', pressure: '16.1 atm', tag: 'SURFACE_OPS' },
    'deep-cleaning': { depth: '450m', pressure: '46.3 atm', tag: 'INTENSIVE_SYNC' },
    'daily-cleaning': { depth: '800m', pressure: '81.2 atm', tag: 'RECURRING_UNIT' },
    'moving-furniture': { depth: '1200m', pressure: '121.5 atm', tag: 'HEAVY_LOGISTICS' },
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.min(Math.max((viewportHeight - rect.top) / (rect.height + viewportHeight), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="relative py-24 md:py-48 transition-colors duration-1000 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, #002d5b 0%, #001226 40%, #00040a 100%)`
      }}
    >
      {/* Searchlight Effect (Mouse Follow) - Hidden on touch devices to improve performance */}
      {!isMobile && (
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none transition-transform duration-300 ease-out z-0"
          style={{
            background: 'radial-gradient(circle, #00f2ff 0%, transparent 70%)',
            transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
          }}
        />
      )}

      {/* Decorative Depth Gauge - Adjusted for tablet and hidden on mobile */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-4">
        <div className="h-48 md:h-64 w-px bg-white/10 relative">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 border border-cyan-400 bg-[#00040a] transition-all duration-300 shadow-[0_0_10px_#22d3ee]"
            style={{ top: `${scrollProgress * 100}%` }}
          >
            <div className="absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[8px] md:text-[10px] text-cyan-400">
              {(scrollProgress * 4000).toFixed(0)}m DEPTH
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-24 md:mb-40">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] mb-6 md:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Operational Descent
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-[0.1em] leading-none mb-6">
            ABYSSAL SERVICES IN <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 tracking-[0.15em] block mt-4">
              ST. GALLEN, THURGAU & WINTERTHUR
            </span>
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs max-w-lg leading-relaxed">
            Swiss precision engineered for the deepest property challenges in North-East Switzerland.
          </p>
        </div>

        {/* The Bubbles descent layout - Responsive Grid for mobile, staggered for desktop */}
        <div className="relative flex flex-col md:block space-y-12 md:space-y-0 md:min-h-[1600px]">
          {abyssalServices.map((service, idx) => {
            const isActive = hoveredId === service.id;
            const spec = systemSpecs[service.id];
            
            // Vertical positioning for descent effect on desktop only
            const verticalOffset = idx * 400;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onNavigate('services-page')}
                className={`service-bubble group relative w-full max-w-[450px] mx-auto md:absolute cursor-pointer transition-all duration-700 ease-out 
                  ${idx % 2 === 0 ? 'md:left-0' : 'md:right-0'}`}
                style={!isMobile ? { top: `${verticalOffset}px` } : {}}
              >
                {/* Visual HUD: Depth Info */}
                <div className={`absolute -top-10 md:-top-12 ${idx % 2 === 0 ? 'left-4' : 'right-4'} transition-all duration-500 ${isActive || isMobile ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4'}`}>
                   <div className="font-mono text-[8px] md:text-[9px] text-cyan-400 font-black tracking-widest">{spec.tag} // {spec.depth}</div>
                   <div className={`h-px w-20 md:w-24 bg-gradient-to-r from-cyan-400 to-transparent mt-1 ${idx % 2 !== 0 ? 'ml-auto rotate-180' : ''}`}></div>
                </div>

                {/* The Bubble Cell */}
                <div className="relative aspect-square">
                  {/* Liquid Layer */}
                  <div className={`absolute inset-0 rounded-[45%_55%_65%_35%_/_45%_45%_55%_55%] transition-all duration-1000 animate-morph border border-white/10 backdrop-blur-2xl
                    ${isActive ? 'bg-cyan-500/10 border-cyan-400/40 shadow-[0_0_80px_rgba(0,242,255,0.2)] scale-105' : 'bg-white/5 shadow-2xl'}`} 
                  />
                  
                  {/* Bioluminescent Core */}
                  <div className={`absolute inset-6 md:inset-10 rounded-full bg-cover bg-center grayscale transition-all duration-700 mix-blend-screen overflow-hidden
                    ${isActive ? 'opacity-40 grayscale-0 scale-110' : 'opacity-[0.03]'}`}
                    style={{ backgroundImage: `url(${service.imageUrl})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00040a] via-transparent to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-12 text-center z-20">
                    <div className={`text-5xl md:text-6xl mb-4 md:mb-6 transition-all duration-500 transform group-hover:-translate-y-2 filter ${isActive || isMobile ? 'drop-shadow-[0_0_20px_#22d3ee] grayscale-0' : 'grayscale brightness-50 opacity-40'}`}>
                      {service.icon}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-2 md:mb-4">
                      {t(service.titleKey)}
                    </h3>
                    
                    <div className={`space-y-4 overflow-hidden transition-all duration-500 ${isActive || isMobile ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                       <p className="text-[10px] md:text-[11px] text-slate-300 font-bold leading-relaxed max-w-[200px] mx-auto uppercase tracking-wide">
                         {t(service.descriptionKey)}
                       </p>
                       <div className="flex items-center justify-center gap-3 md:gap-4 pt-2">
                          <div className="text-[7px] md:text-[8px] font-mono text-cyan-500/60 uppercase">Press: {spec.pressure}</div>
                          <span className="h-1 w-1 bg-cyan-500/30 rounded-full"></span>
                          <button className="flex items-center gap-1.5 text-white font-black text-[8px] md:text-[9px] uppercase tracking-widest group/btn hover:text-cyan-400 transition-colors">
                            {t('services.learnMore')}
                            <PlusIcon className="w-3 h-3 group-hover/btn:rotate-90 transition-transform" />
                          </button>
                       </div>
                    </div>
                  </div>

                  {/* Pulsing Bioluminescence */}
                  {(isActive || isMobile) && (
                    <div className="absolute inset-0 -z-10 animate-sonar rounded-full border border-cyan-400/20" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        #services { contain: paint; }
        
        .service-bubble {
          animation: float-abyss 15s ease-in-out infinite;
        }

        @keyframes float-abyss {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg) translateX(5px); }
          66% { transform: translateY(-10px) rotate(-1deg) translateX(-5px); }
        }

        @keyframes morph {
          0%, 100% { border-radius: 45% 55% 65% 35% / 45% 45% 55% 55%; }
          33% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          66% { border-radius: 50% 50% 40% 60% / 40% 60% 50% 40%; }
        }
        .animate-morph { animation: morph 12s ease-in-out infinite; }

        @keyframes sonar {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-sonar { animation: sonar 3s cubic-bezier(0.16, 1, 0.3, 1) infinite; }

        .service-bubble:nth-child(2) { animation-delay: -2s; }
        .service-bubble:nth-child(3) { animation-delay: -5s; }
        .service-bubble:nth-child(4) { animation-delay: -8s; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #22d3ee; border-radius: 10px; }
      `}</style>
    </section>
  );
};

export default Services;