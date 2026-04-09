import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { 
  PlusIcon, 
  ShieldCheckIcon,
  CheckIcon,
  ClockIcon,
  DocumentTextIcon,
  BuildingIcon,
  BoltIcon,
  SparklesIcon,
  BugAntIcon,
  TrashIcon,
  ArchiveBoxIcon
} from './icons';

interface CommercialServicesPageProps {
  onNavigate: (page: string) => void;
}

interface Spec {
  label: string;
  value: string;
}

interface CommercialService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  imageUrl: string;
  specs: Spec[];
}

const TechnicalSpec: React.FC<Spec> = ({ label, value }) => (
    <div className="flex flex-col py-3 border-b border-gray-100 last:border-0">
        <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</dt>
        <dd className="text-sm font-semibold text-[#1d1d1f]">{value}</dd>
    </div>
);

const CommercialServicesPage: React.FC<CommercialServicesPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  
  const commercialServices: CommercialService[] = [
    {
      id: 'office-cleaning',
      title: t('commercial.service.office.title'),
      description: t('commercial.service.office.desc'),
      icon: <BuildingIcon className="w-6 h-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      specs: [
        { label: t('commercial.spec.standard'), value: 'ISO 9001 Certified' },
        { label: t('commercial.spec.frequency'), value: 'Daily / Nightly' },
        { label: t('commercial.spec.security'), value: 'Vetted Personnel' },
        { label: t('commercial.spec.products'), value: 'Eco-Friendly' }
      ]
    },
    {
      id: 'common-area-cleaning',
      title: t('commercial.service.common.title'),
      description: t('commercial.service.common.desc'),
      icon: <BuildingIcon className="w-6 h-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
      specs: [
        { label: t('commercial.spec.standard'), value: 'Building Protocol' },
        { label: t('commercial.spec.frequency'), value: 'Weekly / Bi-weekly' },
        { label: t('commercial.spec.security'), value: 'Access Management' },
        { label: t('commercial.spec.products'), value: 'B-Corp Certified' }
      ]
    },
    {
      id: 'industrial-maintenance',
      title: t('commercial.service.industrial.title'),
      description: t('commercial.service.industrial.desc'),
      icon: <BoltIcon className="w-6 h-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      specs: [
        { label: t('commercial.spec.expertise'), value: 'Technical Engineering' },
        { label: t('commercial.spec.response'), value: '24/7 Emergency' },
        { label: t('commercial.spec.safety'), value: 'HSE Compliant' },
        { label: t('commercial.spec.reporting'), value: 'Digital Logs' }
      ]
    },
    {
      id: 'retail-management',
      title: t('commercial.service.retail.title'),
      description: t('commercial.service.retail.desc'),
      icon: <SparklesIcon className="w-6 h-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
      specs: [
        { label: t('commercial.spec.focus'), value: 'Customer Experience' },
        { label: t('commercial.spec.aesthetics'), value: 'Premium Finish' },
        { label: t('commercial.spec.agility'), value: 'Rapid Deployment' },
        { label: t('commercial.spec.scale'), value: 'Multi-Site Support' }
      ]
    }
  ];

  const additionalServices = [
    {
      id: 'pest-control',
      title: t('commercial.additional.pest.title'),
      description: t('commercial.additional.pest.desc'),
      icon: <BugAntIcon className="w-8 h-8" />
    },
    {
      id: 'waste-management',
      title: t('commercial.additional.waste.title'),
      description: t('commercial.additional.waste.desc'),
      icon: <TrashIcon className="w-8 h-8" />
    },
    {
      id: 'consumables-supply',
      title: t('commercial.additional.consumables.title'),
      description: t('commercial.additional.consumables.desc'),
      icon: <ArchiveBoxIcon className="w-8 h-8" />
    }
  ];

  return (
    <main className="bg-white min-h-screen selection:bg-blue-100 selection:text-blue-900 font-sans text-[#1d1d1f]">
      
      {/* Immersive Hero */}
      <section className="relative pt-32 md:pt-64 pb-24 md:pb-48 overflow-hidden bg-[#002D5B]">
        <div className="container mx-auto px-6 text-center relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.5em] mb-8 md:mb-12 shadow-sm border border-white/10 animate-fade-in">
                Enterprise Solutions 2025
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black tracking-[0.1em] md:tracking-[0.15em] leading-[0.85] mb-8 md:mb-12 animate-fade-in-up text-white">
                {t('commercial.hero.title').split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    {word} {i === 1 ? <br /> : ''}
                  </React.Fragment>
                ))}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-[0.1em] md:tracking-[0.2em] block mt-4 md:mt-6 px-2">STRATEGIC EXCELLENCE.</span>
            </h1>
            <p className="text-blue-100/60 text-base md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                {t('commercial.hero.subtitle')}
            </p>
        </div>
        
        {/* Subtle Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </section>

      {/* Commercial Service Showcases */}
      <section className="py-20 md:py-64 space-y-32 md:space-y-64 container mx-auto px-6 max-w-7xl">
        {commercialServices.map((service, index) => (
          <div 
            key={service.id}
            className={`flex flex-col lg:flex-row items-center gap-8 md:gap-16 lg:gap-32 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            <div className="w-full lg:w-3/5 group">
                <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden bg-[#f5f5f7] shadow-2xl transition-transform duration-1000 group-hover:scale-[1.01]">
                    <img 
                        src={service.imageUrl} 
                        alt={service.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>

            <div className="flex-1 max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-xl shadow-inner">{service.icon}</div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">B2B Enterprise</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-8 text-[#002D5B]">{service.title}</h2>
                <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">{service.description}</p>
                
                <div className="mt-8 bg-[#f5f5f7] p-8 rounded-3xl">
                    <h4 className="text-xs font-black text-[#002D5B] uppercase tracking-widest mb-4">Service Parameters</h4>
                    <dl className="grid grid-cols-2 gap-x-8">
                        {service.specs.map((spec, sIdx) => (
                            <TechnicalSpec key={sIdx} label={spec.label} value={spec.value} />
                        ))}
                    </dl>
                </div>

                <div className="pt-12">
                    <button
                      onClick={() => onNavigate('consultation')}
                      className="group relative inline-flex items-center gap-6 bg-[#002D5B] text-white px-10 py-5 rounded-full font-bold transition-all transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 overflow-hidden"
                    >
                      <span className="relative z-10 uppercase tracking-widest text-xs">{t('commercial.cta.request')}</span>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center relative z-10 group-hover:rotate-90 transition-transform">
                          <PlusIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </div>
            </div>
          </div>
        ))}
      </section>

      {/* Additional Services Section */}
      <section className="py-32 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-24">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">{t('commercial.additional.title')}</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#002D5B]">
              Elite Support Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {additionalServices.map((service) => (
              <div key={service.id} className="group p-12 rounded-[3rem] bg-[#f5f5f7] hover:bg-[#002D5B] transition-all duration-500 transform hover:-translate-y-4">
                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-[#002D5B] mb-10 shadow-sm group-hover:rotate-6 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black mb-6 text-[#002D5B] group-hover:text-white transition-colors">{service.title}</h3>
                <p className="text-gray-500 group-hover:text-blue-100/60 transition-colors leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Protocol */}
      <section className="py-24 md:py-48 bg-[#f5f5f7] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                <div>
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">{t('commercial.protocol.title')}</span>
                    <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-none mb-10 text-[#002D5B]">
                        {t('commercial.protocol.header')}
                    </h2>
                    <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed mb-12">
                        {t('commercial.protocol.desc')}
                    </p>
                    
                    <div className="space-y-8 md:space-y-12">
                        {[
                            { icon: <BuildingIcon className="w-6 h-6" />, title: t('commercial.protocol.item1.title'), desc: t('commercial.protocol.item1.desc') },
                            { icon: <ShieldCheckIcon className="w-6 h-6" />, title: t('commercial.protocol.item2.title'), desc: t('commercial.protocol.item2.desc') },
                            { icon: <ClockIcon className="w-6 h-6" />, title: t('commercial.protocol.item3.title'), desc: t('commercial.protocol.item3.desc') }
                        ].map((step, sIdx) => (
                            <div key={sIdx} className="flex gap-8 group">
                                <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#002D5B] shadow-sm transition-transform group-hover:scale-110">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">{step.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="bg-[#002D5B] rounded-[4rem] p-12 shadow-2xl overflow-hidden group">
                        <div className="relative z-10 flex flex-col items-center text-center">
                             <div className="w-24 h-24 bg-white/10 rounded-3xl shadow-xl flex items-center justify-center mb-8 transform group-hover:rotate-6 transition-transform">
                                 <DocumentTextIcon className="w-12 h-12 text-white" />
                             </div>
                             <h3 className="text-3xl font-black mb-4 text-white">{t('commercial.inquiry.title')}</h3>
                             <p className="text-blue-100/60 text-sm font-bold uppercase tracking-widest mb-10 leading-relaxed">
                                {t('commercial.inquiry.desc')}
                             </p>
                             <button 
                                onClick={() => onNavigate('consultation')}
                                className="w-full bg-white text-[#002D5B] py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-95"
                             >
                                {t('commercial.inquiry.cta')}
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
    </main>
  );
};

export default CommercialServicesPage;
