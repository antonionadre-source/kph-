import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { services } from '../assets';
import { 
  PlusIcon, 
  ShieldCheckIcon,
  CheckIcon,
  ClockIcon,
  DocumentTextIcon,
  CameraIcon
} from './icons';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

const TechnicalSpec = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col py-3 border-b border-gray-100 last:border-0">
        <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</dt>
        <dd className="text-sm font-semibold text-[#1d1d1f]">{value}</dd>
    </div>
);

const ServiceDetails = ({ id }: { id: string }) => {
    const { t } = useTranslation();
    
    switch (id) {
        case 'daily-cleaning':
            return (
                <div className="mt-8 bg-[#f5f5f7] p-8 rounded-3xl animate-fade-in">
                    <h4 className="text-xs font-black text-[#002D5B] uppercase tracking-widest mb-4">Service Specs</h4>
                    <dl className="grid grid-cols-2 gap-x-8">
                        <TechnicalSpec label="Base Rate" value="43.50 CHF/h" />
                        <TechnicalSpec label="Frequency" value="Flexible" />
                        <TechnicalSpec label="Insurance" value="Fully Covered" />
                        <TechnicalSpec label="Personnel" value="Dedicated" />
                    </dl>
                    <p className="text-[10px] text-gray-400 mt-4 font-medium italic">{t('services.pricing.regular.notes')}</p>
                </div>
            );
        case 'end-of-tenancy':
            return (
                <div className="mt-8 bg-[#f5f5f7] p-8 rounded-3xl animate-fade-in">
                    <h4 className="text-xs font-black text-[#002D5B] uppercase tracking-widest mb-4">Guarantee Protocol</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                <CheckIcon className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-bold text-gray-700">Handover Guarantee</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                <CheckIcon className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-bold text-gray-700">Deep Window Treatment</span>
                        </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-8">
                        <TechnicalSpec label="Studio (1.5 R)" value="ab 520.00" />
                        <TechnicalSpec label="Family (3.5 R)" value="ab 870.00" />
                    </dl>
                </div>
            );
        default: return null;
    }
};

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  
  const mainServices = services.filter(s => [
    'end-of-tenancy',
    'deep-cleaning',
    'daily-cleaning',
    'moving-furniture'
  ].includes(s.id));

  const specialized = services.filter(s => [
    'car-detailing',
    'gardening',
    'exterior-cleaning',
    'pest-control',
    'waste-management',
    'gutter-cleaning'
  ].includes(s.id));

  const getDeliverables = (id: string) => {
    switch (id) {
        case 'car-detailing': return ['Mobile Waterless Tech', 'B Corp Bio-Products', 'Ceramic Shield Opt.', 'Intensive Interior'];
        case 'gardening': return ['Seasonal Maintenance', 'Precision Hedging', 'Eco-Waste Disposal', 'Irrigation Check'];
        case 'exterior-cleaning': return ['Facade Soft-Wash', 'High-Pressure Stone', 'Wood Restoration', 'Glass Clarity'];
        case 'pest-control': return ['Integrated Monitoring', 'Non-Toxic Barriers', 'Discreet Deployment', 'Swiss Compliance'];
        case 'waste-management': return ['Responsible Sorting', 'Regional Disposal', 'Office Clearances', 'WEEE Recycling'];
        case 'gutter-cleaning': return ['High-Reach Vacuum', 'Camera Inspection', 'Leak Detection', 'Downpipe Flush'];
        default: return [];
    }
  }

  return (
    <main className="bg-white min-h-screen selection:bg-blue-100 selection:text-blue-900 font-sans text-[#1d1d1f]">
      
      {/* Immersive Hero */}
      <section className="relative pt-64 pb-48 overflow-hidden bg-[#f5f5f7]">
        <div className="container mx-auto px-6 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#002D5B] text-[10px] font-black uppercase tracking-[0.5em] mb-12 shadow-sm border border-gray-100 animate-fade-in">
                Professional Portfolio 2025
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.15em] leading-[0.85] mb-12 animate-fade-in-up text-[#002D5B]">
                PREMIUM FACILITY SERVICES IN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002D5B] to-[#007AFF] tracking-[0.2em] block mt-6 px-2">ZURICH, SCHAFFHAUSEN & BASEL.</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl lg:text-2xl font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                Swiss-engineered property solutions delivered with hospitality excellence and obsessive attention to detail across Switzerland.
            </p>
        </div>
        
        {/* Subtle Decorative Gradient */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </section>

      {/* Main Service Showcases */}
      <section className="py-32 md:py-64 space-y-64 container mx-auto px-6 max-w-7xl">
        {mainServices.map((service, index) => (
          <div 
            key={service.id}
            className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            <div className="w-full lg:w-3/5 group">
                <div className="relative aspect-[4/3] rounded-[3.5rem] overflow-hidden bg-[#f5f5f7] shadow-2xl transition-transform duration-1000 group-hover:scale-[1.01]">
                    <img 
                        src={service.imageUrl} 
                        alt={t(service.titleKey)} 
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white shadow-xl flex items-center gap-3">
                             <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                             <span className="text-[10px] font-black text-[#1d1d1f] uppercase tracking-widest">Swiss_Certified</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-xl shadow-inner">{service.icon}</div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Integrated Solution</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-8 text-[#002D5B]">{t(service.titleKey)}</h2>
                <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed mb-10 text-justify">{t(service.marketingDescKey)}</p>
                <ServiceDetails id={service.id} />
                <div className="pt-12">
                    <button
                      onClick={() => onNavigate('consultation')}
                      className="group relative inline-flex items-center gap-6 bg-[#002D5B] text-white px-10 py-5 rounded-full font-bold transition-all transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 overflow-hidden"
                    >
                      <span className="relative z-10 uppercase tracking-widest text-xs">Initialize Service</span>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center relative z-10 group-hover:rotate-90 transition-transform">
                          <PlusIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </div>
            </div>
          </div>
        ))}
      </section>

      {/* Specialized Services: Expanded Technical Focus with Added Images */}
      <section className="py-48 bg-[#f5f5f7] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black tracking-[0.15em] mb-8 text-[#002D5B] uppercase leading-tight">SPECIALIZED SOLUTIONS FOR ST. GALLEN, THURGAU & WINTERTHUR</h2>
            <p className="text-gray-500 text-lg font-medium">Modular service units engineered for specific property variables. We deploy specialized units across Switzerland equipped with industry-leading technology and B Corp certified sustainable materials.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {specialized.map((item, idx) => (
              <div 
                key={idx} 
                className="group rounded-[3.5rem] bg-white border border-gray-100 hover:border-[#002D5B]/20 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col relative overflow-hidden min-h-[600px] transform hover:-translate-y-2"
              >
                {/* Visual Header: Image */}
                <div className="h-56 relative overflow-hidden">
                    <img 
                        src={item.imageUrl} 
                        alt={t(item.titleKey)} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                    <div className="absolute top-6 left-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        {item.icon}
                    </div>
                    <div className="absolute top-6 right-6 px-3 py-1 bg-black/10 backdrop-blur-sm rounded-full">
                        <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">UNIT_AUX_0{idx + 1}</span>
                    </div>
                </div>

                <div className="p-10 flex flex-col flex-grow">
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter group-hover:text-[#002D5B] transition-colors leading-none text-[#1d1d1f]">{t(item.titleKey)}</h3>
                    <p className="text-gray-400 text-xs font-bold leading-relaxed mb-8 uppercase tracking-widest">{t(item.descriptionKey)}</p>
                    
                    <div className="flex-grow space-y-3 mb-10">
                        <h4 className="text-[10px] font-black text-[#1d1d1f] uppercase tracking-[0.2em] mb-4 opacity-40">Core Protocol</h4>
                        {getDeliverables(item.id).map((deliverable, dIdx) => (
                            <div key={dIdx} className="flex items-center gap-3 text-[11px] font-bold text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]"></div>
                                {deliverable}
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
                        <button 
                            onClick={() => onNavigate('consultation')}
                            className="text-[10px] font-black text-[#002D5B] uppercase tracking-widest hover:text-[#007AFF] transition-colors"
                        >
                            Initialize mandate
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#002D5B] group-hover:text-white transition-all shadow-inner">
                            <PlusIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Protocol */}
      <section className="py-48 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div>
                    <span className="text-[#007AFF] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">The Integration Protocol</span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-10 text-[#002D5B]">
                        How it works. <br />
                        <span className="text-gray-400">Simple. Precise. Easy.</span>
                    </h2>
                    <p className="text-gray-500 text-lg font-medium leading-relaxed mb-12">
                        We have reimagined the consultation process to respect your time and ensure 100% accurate pricing before we ever step foot on your property.
                    </p>
                    
                    <div className="space-y-12">
                        {[
                            { icon: <PlusIcon className="w-6 h-6" />, title: '1. Configure Scope', desc: 'Select your services and use our intelligent calculator to get an instant guideline estimate based on Swiss industry standards.' },
                            { icon: <CameraIcon className="w-6 h-6" />, title: '2. Visual Documentation', desc: 'Upload photos, videos, or floor plans. This allows our engineers to perform a remote technical validation and identify specific site variables.' },
                            { icon: <ShieldCheckIcon className="w-6 h-6" />, title: '3. Price Lock Confirmation', desc: 'Once documented, we review the data and send you a final, fixed-price quote. No surprises, no hidden extras.' },
                            { icon: <ClockIcon className="w-6 h-6" />, title: '4. Elite Deployment', desc: 'Your dedicated Kraken team arrives precisely on schedule with all necessary professional logistics to execute the mandate.' }
                        ].map((step, sIdx) => (
                            <div key={sIdx} className="flex gap-8 group">
                                <div className="flex-shrink-0 w-14 h-14 bg-[#f5f5f7] rounded-2xl flex items-center justify-center text-[#002D5B] shadow-inner transition-transform group-hover:scale-110">
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
                    <div className="absolute -inset-20 bg-blue-50/50 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative bg-[#f5f5f7] rounded-[4rem] p-12 shadow-2xl border border-white overflow-hidden group">
                        <div className="relative z-10 flex flex-col items-center text-center">
                             <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 transform group-hover:rotate-6 transition-transform">
                                <DocumentTextIcon className="w-12 h-12 text-[#002D5B]" />
                             </div>
                             <h3 className="text-3xl font-black mb-4 text-[#002D5B]">Start Your Free Consultation</h3>
                             <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-10 leading-relaxed">
                                No commitments. Just clarity. <br />
                                Swiss Quality. Kraken Precision.
                             </p>
                             <button 
                                onClick={() => onNavigate('consultation')}
                                className="w-full bg-[#002D5B] text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95"
                             >
                                Launch Interface
                             </button>
                        </div>
                        {/* Micro-Blueprint Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#002D5B 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Modern CTA Footer */}
      <section className="py-64 bg-white border-t border-gray-50">
          <div className="container mx-auto px-6 max-w-7xl text-center">
              <div className="max-w-4xl mx-auto space-y-12">
                  <div className="text-9xl filter drop-shadow-2xl animate-float select-none">💎</div>
                  <h2 className="text-5xl md:text-9xl font-black tracking-tighter leading-none text-[#002D5B]">
                    Uncompromising <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002D5B] to-[#007AFF]">Excellence.</span>
                  </h2>
                  <p className="text-gray-400 text-xl font-bold uppercase tracking-[0.5em]">Experience the Kraken Standard</p>
                  
                  <div className="pt-12">
                      <button 
                        onClick={() => onNavigate('consultation')}
                        className="group bg-[#002D5B] text-white px-20 py-8 rounded-full text-2xl font-black shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                      >
                        Book Free Quote
                      </button>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg) scale(1.1); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animation-delay-200 { animation-delay: 200ms; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </main>
  );
};

export default ServicesPage;