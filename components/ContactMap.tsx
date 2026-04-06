import React from 'react';
import { useTranslation } from '../i18n';
import { MapPinIcon, CheckIcon, BuildingIcon, ClockIcon } from './icons';
import { cityImages, mascotImageUrl } from '../assets';

const OperationsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section 
      id="contact" 
      className="relative py-8 md:py-12 bg-[#001A3D] overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #003366 0%, #001A3D 70%, #000B1A 100%)'
      }}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Background Atmospheric Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[150px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-800 rounded-full blur-[180px] opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* The Large "3" Container */}
        <div className="relative w-full max-w-[320px] aspect-[4/5] mb-0">
          
          {/* Glass "3" Shape */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_0_120px_rgba(0,122,255,0.4)]">
              <defs>
                <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
                </linearGradient>
                <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.35)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.75)" />
                </linearGradient>
                <clipPath id="clip3">
                  <text 
                    x="200" 
                    y="380" 
                    textAnchor="middle" 
                    fontSize="520" 
                    fontWeight="900" 
                    fontFamily="Inter, sans-serif"
                    style={{ letterSpacing: '-0.05em' }}
                  >
                    3
                  </text>
                </clipPath>
              </defs>
              
              {/* Main Glass Body using Text */}
              <text 
                x="200" 
                y="380" 
                textAnchor="middle" 
                fontSize="520" 
                fontWeight="900" 
                fontFamily="Inter, sans-serif"
                fill="url(#glassGradient)"
                stroke="url(#edgeGradient)"
                strokeWidth="4"
                style={{ letterSpacing: '-0.05em' }}
                className="backdrop-blur-3xl"
              >
                3
              </text>

              {/* City Images inside the "3" */}
              <g clipPath="url(#clip3)">
                {/* Zurich (Top) */}
                <image 
                  href={cityImages.zurich} 
                  x="0" y="0" width="400" height="250" 
                  preserveAspectRatio="xMidYMid slice"
                  className="opacity-90"
                />
                {/* Winterthur (Middle) */}
                <image 
                  href={cityImages.winterthur} 
                  x="0" y="150" width="400" height="250" 
                  preserveAspectRatio="xMidYMid slice"
                  className="opacity-90"
                />
                {/* Schaffhausen (Bottom) */}
                <image 
                  href={cityImages.schaffhausen} 
                  x="0" y="300" width="400" height="250" 
                  preserveAspectRatio="xMidYMid slice"
                  className="opacity-90"
                />
              </g>

              {/* Technical Labels (SVG Overlay for precision) */}
              <g className="text-white fill-white opacity-50 font-mono text-[7px] font-bold">
                {/* Zurich Area */}
                <text x="270" y="120">UNIT_10</text>
                <text x="270" y="130">2RW_VUE</text>
                <text x="180" y="160">SLA4-20</text>
                <text x="180" y="170">aDS1</text>
                
                {/* Winterthur Area */}
                <text x="270" y="250">uarl_10</text>
                <text x="270" y="260">KHZA_HUB</text>
                <text x="280" y="310">MO_WINT</text>
                
                {/* Schaffhausen Area */}
                <text x="275" y="375">dert_to</text>
                <text x="275" y="385">SHF_HUB</text>
              </g>

              {/* Light Flares */}
              <g>
                <circle cx="150" cy="120" r="15" fill="white" opacity="0.1" filter="url(#glassBlur)" />
                <circle cx="280" cy="220" r="10" fill="white" opacity="0.1" filter="url(#glassBlur)" />
              </g>
            </svg>
          </div>

          {/* Labels and Data Points - Positioned to match image */}
          
          {/* Zurich Label */}
          <div className="absolute top-[22%] left-[45%] text-white z-20 drop-shadow-2xl text-center">
            <h3 className="text-xl font-black tracking-tighter mb-0">Zurich</h3>
            <p className="text-[6px] font-bold uppercase tracking-[0.2em] text-white/50">CANTON ZURICH</p>
          </div>

          {/* Winterthur Label */}
          <div className="absolute top-[48%] left-[55%] text-white z-20 drop-shadow-2xl text-center">
            <h3 className="text-xl font-black tracking-tighter mb-0">Winterthur</h3>
            <p className="text-[6px] font-bold uppercase tracking-[0.2em] text-white/50">CANTON WINTERTHUR</p>
            <div className="mt-2 flex items-center justify-center gap-1 bg-black/30 backdrop-blur-md rounded-full px-2 py-0.5">
              <ClockIcon className="w-1.5 h-1.5 text-blue-400" />
              <span className="text-[7px] font-mono tracking-wider font-bold">SLA: 30 MIN</span>
            </div>
          </div>

          {/* Schaffhausen Label */}
          <div className="absolute bottom-[22%] left-[45%] text-white z-20 drop-shadow-2xl text-center">
            <h3 className="text-xl font-black tracking-tighter mb-0">Schaffhausen</h3>
            <p className="text-[6px] font-bold uppercase tracking-[0.2em] text-white/50">CANTON SCHAFFHAUSEN</p>
            <div className="mt-2 flex items-center justify-center gap-1 bg-black/30 backdrop-blur-md rounded-full px-2 py-0.5">
              <ClockIcon className="w-1.5 h-1.5 text-emerald-400" />
              <span className="text-[7px] font-mono tracking-wider font-bold">SLA: IMMEDIATE</span>
            </div>
          </div>

        </div>

        <div className="text-center max-w-4xl -mt-8">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-4">
            Our Triad of <br/>
            <span className="text-blue-500/80">Operational Excellence.</span>
          </h2>
          <p className="text-blue-100/60 text-sm md:text-lg font-medium leading-relaxed max-w-xl mx-auto">
            Winterthur. Zurich. Schaffhausen. Three key pillars defining our Swiss precision and rapid response across the northern plateau.
          </p>
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default OperationsSection;