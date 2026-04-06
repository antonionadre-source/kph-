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
    <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-32 pb-20 bg-[#020617]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://www.dropbox.com/scl/fi/zff182u1tnn1kb58t6385/portada3.jpg?rlkey=c3akhavh7562zp4can2i2ijht&st=tzifggwn&raw=1" 
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
