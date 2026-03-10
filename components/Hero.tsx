import React from 'react';
import { useTranslation } from '../i18n';
import { mascotImageUrl } from '../assets';
import { ChevronRightIcon, BoltIcon, CheckCircleIcon, BuildingIcon } from './icons';

interface HeroProps {
  onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center bg-white overflow-hidden pt-20">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-10 skew-x-[-12deg] translate-x-1/4"></div>
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-3xl animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-black text-[#002d5b] leading-[0.9] mb-8 tracking-tighter">
              Mastering the <br /> 
              <span className="text-blue-600">Chaos</span> of Property <br />
              Management.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 font-medium max-w-xl leading-relaxed">
              Precision-engineered facility management for the most complex property challenges in Switzerland.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={() => onNavigate('consultation')}
                className="group w-full sm:w-auto bg-[#002d5b] text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-xl transition-all hover:bg-[#003d7a] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
              >
                Let’s Get Kraken
                <ChevronRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => onNavigate('services-page')}
                className="group w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 px-10 py-5 rounded-2xl text-lg font-bold transition-all hover:border-blue-600 hover:text-blue-600 flex items-center justify-center gap-3"
              >
                Explore Services
                <BoltIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-wrap gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted in</div>
              <div className="font-black text-slate-800 text-lg">ZURICH</div>
              <div className="font-black text-slate-800 text-lg">SCHAFFHAUSEN</div>
              <div className="font-black text-slate-800 text-lg">BASEL</div>
            </div>
          </div>

          {/* Right Content: Kai the Mascot */}
          <div className="relative hidden lg:block animate-fade-in-right">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
              <img 
                src={mascotImageUrl} 
                alt="Kai the Mascot - Professional Property Assistant" 
                className="w-full max-w-2xl mx-auto drop-shadow-[0_35px_35px_rgba(0,45,91,0.2)]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Background Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-blue-50 rounded-full -z-10 opacity-40"></div>
          </div>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite -3s;
        }
      `}</style>
    </section>
  );
};

export default Hero;
