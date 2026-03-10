
import React from 'react';
import { useTranslation } from '../i18n';

interface PrecisionQuoteSectionProps {
  onNavigate: (page: string) => void;
}

const PrecisionQuoteSection: React.FC<PrecisionQuoteSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const steps = [
    { 
        emoji: '⚡', 
        headerKey: 'home.precision.card1.header', 
        bodyKey: 'home.precision.card1.body',
    },
    { 
        emoji: '📸', 
        headerKey: 'home.precision.card2.header', 
        bodyKey: 'home.precision.card2.body',
    },
    { 
        emoji: '✍️', 
        headerKey: 'home.precision.card3.header', 
        bodyKey: 'home.precision.card3.body',
    },
    { 
        emoji: '✅', 
        headerKey: 'home.precision.card4.header', 
        bodyKey: 'home.precision.card4.body',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 right-0 w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
         <div className="absolute top-0 left-0 w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-800 mb-4 leading-tight uppercase tracking-tighter">
            {t('home.precision.title')}
          </h2>
          <p className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest">
            {t('home.precision.subtitle')}
          </p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8 mb-16 md:mb-20">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-[25%] left-[12%] right-[12%] h-0.5 bg-gray-200 -z-10 border-t-2 border-dashed border-gray-300"></div>

          {steps.map((step, index) => (
            <div 
                key={index} 
                className="relative bg-white rounded-[2.5rem] p-8 md:p-7 shadow-xl transition-all duration-500 group z-10 flex flex-col items-center border border-gray-100 h-full cursor-default transform hover:-translate-y-2"
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
                {/* Step Indicator (Bubble) */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#002D5B] text-white text-[10px] md:text-xs font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg ring-8 ring-slate-50 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#007bff] whitespace-nowrap">
                        Step {index + 1}
                    </div>
                </div>

                <div className="mt-6 mb-6 text-6xl md:text-7xl text-center filter drop-shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                    {step.emoji}
                </div>
                
                <h3 className="text-lg md:text-xl font-black text-gray-800 mb-3 text-center leading-snug min-h-[3rem] flex items-center justify-center uppercase tracking-tight">
                    {t(step.headerKey)}
                </h3>
                
                <p className="text-gray-500 text-xs md:text-sm text-center leading-relaxed font-bold">
                    {t(step.bodyKey)}
                </p>

                {/* Mobile Connector Arrow */}
                {index < steps.length - 1 && (
                    <div className="sm:hidden absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-blue-200 text-3xl animate-bounce">
                        ↓
                    </div>
                )}
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
            <button
                onClick={() => onNavigate('consultation')}
                className="group relative inline-flex items-center justify-center bg-[#002D5B] text-white px-12 py-5 rounded-2xl text-lg font-black shadow-2xl hover:shadow-blue-900/40 transition-all duration-300 tracking-widest uppercase transform hover:scale-105 active:scale-95 overflow-hidden"
            >
               <span className="relative z-10">{t('home.precision.cta.button')}</span>
               <div className="absolute inset-0 bg-[#007bff] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            <p className="mt-6 text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">{t('home.precision.cta.header')}</p>
        </div>
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </section>
  );
};

export default PrecisionQuoteSection;
