import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { heroImageUrl } from '../assets';
import { ChevronRightIcon, BoltIcon, CheckCircleIcon, BuildingIcon, ShieldCheckIcon, CleaningBrushIcon, CameraIcon } from './icons';

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
    <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-32 pb-32 bg-[#020617]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://www.dropbox.com/scl/fi/0le3yo0nm1ry69ptcolr5/Portada-3-2.png?rlkey=v6mxuz3txjhkef9auidzccsjr&st=4swpy8zk&raw=1" 
          alt="Kraken Properties Hero" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl animate-fade-in-up text-left">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-4 tracking-tight">
              Mastering the <br /> 
              <span className={`transition-colors duration-700 ${
                activeColor === 0 ? 'text-[#007bff]' : 
                activeColor === 1 ? 'text-yellow-400' : 
                'text-red-400'
              }`}>chaos</span> of property <br />
              management.
            </h1>
            
            <p className="text-[#4ade80] font-handwriting text-4xl md:text-5xl mb-8 -rotate-2 transform-gpu">
              So you don't have to.
            </p>

            <p className="text-lg md:text-xl text-white/90 mb-12 font-medium max-w-xl leading-relaxed">
              Facility management, cleaning and maintenance in Schaffhausen, Zurich and Winterthur — designed to run seamlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-start gap-6">
              <button 
                onClick={() => onNavigate('consultation')}
                className="group w-full sm:w-auto bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] px-20 py-5 rounded-full text-lg font-black shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 whitespace-nowrap"
              >
                Get your quote in minutes ⚡
              </button>
              
              <button
                onClick={() => onNavigate('services-page')}
                className="group w-full sm:w-auto bg-transparent border border-white/30 text-white px-20 py-5 rounded-full text-lg font-bold transition-all hover:bg-white/10 flex items-center justify-center gap-3 whitespace-nowrap"
              >
                EXPLORE SERVICES 
                <ChevronRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

      {/* Right Content: Spacer for the background mascot */}
          <div className="hidden lg:block h-[500px]"></div>
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
