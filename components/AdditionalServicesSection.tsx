
import React from 'react';
import { useTranslation } from '../i18n';
import { PlusIcon } from './icons';

interface AdditionalServicesSectionProps {
  onNavigate: (page: string) => void;
}

const AdditionalServicesSection: React.FC<AdditionalServicesSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const additionalServices = [
      {
          id: 'car-detailing',
          icon: '🚗',
          title: 'services.car.title',
          desc: 'services.car.subtitle',
          color: 'from-indigo-500/20 to-purple-600/20',
          accent: 'bg-purple-500',
          hoverColor: 'hover:shadow-purple-500/20',
          grid: 'md:col-span-2 lg:col-span-2'
      },
      {
          id: 'gardening',
          icon: '🌿',
          title: 'services.gardening.title',
          desc: 'services.gardening.desc',
          color: 'from-emerald-500/20 to-green-600/20',
          accent: 'bg-emerald-500',
          hoverColor: 'hover:shadow-emerald-500/20',
          grid: 'md:col-span-1 lg:col-span-1'
      },
      {
          id: 'exterior-cleaning',
          icon: '💧',
          title: 'services.exterior.title',
          desc: 'services.exterior.desc',
          color: 'from-cyan-500/20 to-blue-500/20',
          accent: 'bg-cyan-500',
          hoverColor: 'hover:shadow-cyan-500/20',
          grid: 'md:col-span-1 lg:col-span-1'
      },
      {
          id: 'pest-control',
          icon: '🐜',
          title: 'services.pest.title',
          desc: 'services.pest.desc',
          color: 'from-orange-500/20 to-red-600/20',
          accent: 'bg-orange-500',
          hoverColor: 'hover:shadow-orange-500/20',
          grid: 'md:col-span-1 lg:col-span-1'
      },
      {
          id: 'waste-management',
          icon: '🗑️',
          title: 'services.waste.title',
          desc: 'services.waste.desc',
          color: 'from-slate-500/20 to-slate-700/20',
          accent: 'bg-slate-500',
          hoverColor: 'hover:shadow-slate-500/20',
          grid: 'md:col-span-1 lg:col-span-1'
      },
      {
          id: 'gutter-cleaning',
          icon: '🍂',
          title: 'services.gutter.title',
          desc: 'services.gutter.desc',
          color: 'from-amber-400/20 to-yellow-600/20',
          accent: 'bg-amber-500',
          hoverColor: 'hover:shadow-amber-500/20',
          grid: 'md:col-span-2 lg:col-span-3'
      }
  ];

  return (
    <section className="py-24 bg-[#001D3D] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-900 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
            {t('services.additional.title')}
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-[#007bff] to-cyan-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalServices.map((item, index) => (
                <div 
                    key={index} 
                    onClick={() => onNavigate('consultation')}
                    className={`${item.grid} group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md p-8 transition-all duration-500 ${item.hoverColor} hover:-translate-y-2 hover:bg-white/10`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                    {/* Background Gradient Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8">
                            <div className="text-6xl md:text-7xl transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 drop-shadow-2xl">
                                {item.icon}
                            </div>
                            <div className={`p-3 rounded-2xl ${item.accent} text-white shadow-lg opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500`}>
                                <PlusIcon className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="mt-auto">
                            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-white transition-colors">
                                {t(item.title)}
                            </h3>
                            <p className="text-blue-100/60 text-sm md:text-base leading-relaxed font-medium group-hover:text-blue-50 transition-colors">
                                {t(item.desc)}
                            </p>
                        </div>
                    </div>

                    {/* Decorative Corner Element */}
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
                </div>
            ))}
        </div>

        <div className="text-center mt-20">
            <button
                onClick={() => onNavigate('consultation')}
                className="group relative inline-flex items-center gap-3 bg-white text-[#002D5B] px-12 py-5 rounded-full text-xl font-black shadow-2xl hover:shadow-white/20 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest overflow-hidden"
            >
                <span className="relative z-10">{t('services.additional.cta')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-2 h-2 bg-[#007bff] rounded-full group-hover:animate-ping"></div>
            </button>
            <p className="mt-6 text-blue-200/40 text-xs font-bold uppercase tracking-[0.3em]">
                Explore Swiss Precision In Specialized Care
            </p>
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .bento-card:hover {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </section>
  );
};

export default AdditionalServicesSection;
