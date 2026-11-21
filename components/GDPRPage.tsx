
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
        {icon && <div className="bg-blue-50 p-2 rounded-xl text-[#032b59]">{icon}</div>}
        <h2 className="text-2xl font-semibold text-[#032b59] normal-case tracking-tight">{title}</h2>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-[#dce5f0] shadow-sm space-y-4">
        {children}
      </div>
    </div>
  );

  return (
    <main className="kraken-page kraken-editorial bg-slate-50 pt-12 sm:pt-16 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">

        <header className="kraken-page-intro mb-12 border-b border-[#dce5f0] pb-9"><p className="kraken-eyebrow">Kraken PFM</p><h1 className="kraken-heading mt-3">{gTrans.title}</h1><p className="kraken-description">{gTrans.subtitle}</p></header>

        {/* Section 1: Privacy Policy */}
        <Section title={gTrans.introTitle} icon={<GlobeIcon className="w-6 h-6" />}>
           <p className="text-gray-700 leading-relaxed font-medium">{gTrans.introP1}</p>
        </Section>

        <Section title={gTrans.collectTitle}>
           <p className="text-gray-700 leading-relaxed mb-4">{gTrans.collectP1}</p>
           <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gTrans.collectItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-[#dce5f0]">
                   <div className="bg-[#032b59] text-white w-5 h-5 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">{idx + 1}</div>
                   <span className="text-sm font-bold text-gray-600 leading-tight">{item}</span>
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
                  <h4 className="font-semibold text-sm text-[#50647c] normal-case tracking-normal mb-1">{gTrans.retentionInfrastructure}</h4>
                  <p className="text-gray-700 text-sm font-medium">{gTrans.retentionStorage}</p>
               </div>
               <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h4 className="font-semibold text-sm text-[#50647c] normal-case tracking-normal mb-1">{gTrans.retentionCollaboration}</h4>
                  <p className="text-gray-700 text-sm font-medium">{gTrans.retentionSharing}</p>
               </div>
               <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h4 className="font-semibold text-sm text-[#50647c] normal-case tracking-normal mb-1">{gTrans.retentionDuration}</h4>
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
            <h2 className="text-3xl font-semibold text-[#032b59] text-center normal-case tracking-tight mb-12">{gTrans.disclaimerTitle}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-3xl border border-[#dce5f0] shadow-sm group hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-[#032b59] mb-3 normal-case tracking-tight flex items-center gap-2">
                     <span className="text-2xl group-hover:rotate-12 transition-transform">📊</span>
                     {gTrans.estimatesTitle}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">{gTrans.estimatesP1}</p>
               </div>

               <div className="bg-white p-8 rounded-3xl border border-[#dce5f0] shadow-sm group hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-[#032b59] mb-3 normal-case tracking-tight flex items-center gap-2">
                     <span className="text-2xl group-hover:rotate-12 transition-transform">⚖️</span>
                     {gTrans.liabilityTitle}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">{gTrans.liabilityP1}</p>
               </div>
            </div>

            <div className="mt-8 bg-[#f3f7fc] border border-[#dce5f0] p-10 rounded-2xl text-[#032b59] relative overflow-hidden shadow-sm">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
               <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-6 normal-case tracking-normal flex items-center gap-3">
                     <DocumentTextIcon className="w-6 h-6 text-[#1464ad]" />
                     {gTrans.ipTitle}
                  </h3>
                  <p className="text-[#50647c] text-sm leading-relaxed font-medium mb-6">{gTrans.ipP1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="bg-white p-5 rounded-2xl backdrop-blur-sm">
                        <h4 className="text-sm font-semibold normal-case text-[#1464ad] tracking-normal mb-2">{gTrans.usageTitle}</h4>
                        <p className="text-sm text-[#032b59] leading-snug">{gTrans.usageText}</p>
                     </div>
                     <div className="bg-white p-5 rounded-2xl backdrop-blur-sm">
                        <h4 className="text-sm font-semibold normal-case text-[#1464ad] tracking-normal mb-2">{gTrans.trademarksTitle}</h4>
                        <p className="text-sm text-[#032b59] leading-snug">{gTrans.trademarksText}</p>
                     </div>
                  </div>
               </div>
            </div>
        </div>

        <div className="text-center mt-20 p-8 border-2 border-dashed border-gray-200 rounded-2xl">
           <p className="text-[#50647c] font-bold text-sm normal-case tracking-normal mb-2">{gTrans.verificationTitle}</p>
           <p className="text-[#50647c] font-medium text-sm">{gTrans.lastUpdate}</p>
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
