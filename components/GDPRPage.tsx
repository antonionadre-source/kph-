
import React from 'react';
import { useTranslation } from '../i18n';
import { ShieldCheckIcon, DocumentTextIcon, GlobeIcon } from './icons';
import { getGDPRTranslation } from './docTranslations';

const GDPRPage: React.FC = () => {
  const { language } = useTranslation();
  const gTrans = getGDPRTranslation(language);

  // Fixed: Made children optional to avoid "Property 'children' is missing" error when passed as JSX children
  const Section = ({ title, children, icon }: { title: string, children?: React.ReactNode, icon?: React.ReactNode }) => (
    <div className="mb-12 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        {icon && <div className="bg-blue-50 p-2 rounded-xl text-[#002D5B]">{icon}</div>}
        <h2 className="text-2xl font-black text-[#002D5B] uppercase tracking-tight">{title}</h2>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        {children}
      </div>
    </div>
  );

  return (
    <main className="bg-slate-50 pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header Area */}
        <div className="relative rounded-[3rem] overflow-hidden mb-16 bg-[#001D3D] text-white min-h-[30vh] flex items-center p-8 md:p-12 shadow-xl">
          <div className="absolute inset-0 z-0">
            <img src="/kai privacy.webp" alt="Privacy at Kraken" className="w-full h-full object-cover opacity-35 object-center" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#001D3D] via-[#001D3D]/80 to-transparent" />
          </div>
          <div className="relative z-10 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm backdrop-blur-sm">
               <ShieldCheckIcon className="w-3.5 h-3.5" />
               {gTrans.badge}
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-3 uppercase tracking-tighter">
              {gTrans.title}
            </h1>
            <p className="text-sm md:text-base text-blue-100/90 font-medium">{gTrans.subtitle}</p>
          </div>
        </div>

        {/* Section 1: Privacy Policy */}
        <Section title={gTrans.introTitle} icon={<GlobeIcon className="w-6 h-6" />}>
           <p className="text-gray-700 leading-relaxed font-medium">{gTrans.introP1}</p>
        </Section>

        <Section title={gTrans.collectTitle}>
           <p className="text-gray-700 leading-relaxed mb-4">{gTrans.collectP1}</p>
           <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gTrans.collectItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-100">
                   <div className="bg-[#002D5B] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">{idx + 1}</div>
                   <span className="text-xs font-bold text-gray-600 leading-tight">{item}</span>
                </li>
              ))}
           </ul>
        </Section>

        <Section title={gTrans.basisTitle}>
           <p className="text-gray-700 leading-relaxed mb-4">{gTrans.basisP1}</p>
           <ul className="space-y-3">
              {gTrans.basisItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                   <span className="text-blue-500 text-lg">●</span>
                   {item}
                </li>
              ))}
           </ul>
        </Section>

        <Section title={gTrans.retentionTitle}>
            <div className="grid grid-cols-1 gap-6">
               <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-1">{gTrans.retentionInfrastructure}</h4>
                  <p className="text-gray-700 text-sm font-medium">{gTrans.retentionStorage}</p>
               </div>
               <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-1">{gTrans.retentionCollaboration}</h4>
                  <p className="text-gray-700 text-sm font-medium">{gTrans.retentionSharing}</p>
               </div>
               <div className="border-l-4 border-emerald-500 pl-4 py-1">
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-1">{gTrans.retentionDuration}</h4>
                  <p className="text-gray-700 text-sm font-medium">{gTrans.retentionTime}</p>
               </div>
            </div>
        </Section>

        <Section title={gTrans.rightsTitle}>
           <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
              <div className="text-3xl">🔑</div>
              <p className="text-gray-700 text-sm font-bold leading-relaxed">{gTrans.rightsP1}</p>
           </div>
        </Section>

        {/* Divider */}
        <div className="my-20 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Section 2: Legal Disclaimer & IP */}
        <div className="mb-12">
            <h2 className="text-3xl font-black text-[#002D5B] text-center uppercase tracking-tight mb-12">{gTrans.disclaimerTitle}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-black text-[#002D5B] mb-3 uppercase tracking-tight flex items-center gap-2">
                     <span className="text-2xl group-hover:rotate-12 transition-transform">📊</span>
                     {gTrans.estimatesTitle}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">{gTrans.estimatesP1}</p>
               </div>
               
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-black text-[#002D5B] mb-3 uppercase tracking-tight flex items-center gap-2">
                     <span className="text-2xl group-hover:rotate-12 transition-transform">⚖️</span>
                     {gTrans.liabilityTitle}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">{gTrans.liabilityP1}</p>
               </div>
            </div>

            <div className="mt-8 bg-[#002D5B] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
               <div className="relative z-10">
                  <h3 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center gap-3">
                     <DocumentTextIcon className="w-6 h-6 text-blue-300" />
                     {gTrans.ipTitle}
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed font-medium mb-6">{gTrans.ipP1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <h4 className="text-[10px] font-black uppercase text-blue-300 tracking-widest mb-2">{gTrans.usageTitle}</h4>
                        <p className="text-xs text-white leading-snug">{gTrans.usageText}</p>
                     </div>
                     <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <h4 className="text-[10px] font-black uppercase text-blue-300 tracking-widest mb-2">{gTrans.trademarksTitle}</h4>
                        <p className="text-xs text-white leading-snug">{gTrans.trademarksText}</p>
                     </div>
                  </div>
               </div>
            </div>
        </div>

        <div className="text-center mt-20 p-8 border-2 border-dashed border-gray-200 rounded-[2rem]">
           <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">{gTrans.verificationTitle}</p>
           <p className="text-gray-500 font-medium text-sm">{gTrans.lastUpdate}</p>
        </div>

      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default GDPRPage;
