
import React from 'react';
import { useTranslation } from '../i18n';
import { ShieldCheckIcon, DocumentTextIcon, GlobeIcon } from './icons';

const GDPRPage: React.FC = () => {
  const { t } = useTranslation();

  // Fixed: Made children optional to avoid "Property 'children' is missing" error when passed as JSX children
  const Section = ({ titleKey, children, icon }: { titleKey: string, children?: React.ReactNode, icon?: React.ReactNode }) => (
    <div className="mb-12 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        {icon && <div className="bg-blue-50 p-2 rounded-xl text-[#002D5B]">{icon}</div>}
        <h2 className="text-2xl font-black text-[#002D5B] uppercase tracking-tight">{t(titleKey)}</h2>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        {children}
      </div>
    </div>
  );

  return (
    <main className="bg-slate-50 pt-48 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header Area */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
             <ShieldCheckIcon className="w-3.5 h-3.5" />
             Swiss nFADP Compliant
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-[#002D5B] mb-4 uppercase tracking-tighter">
            {t('gdpr.title')}
          </h1>
          <p className="text-lg text-gray-500 font-medium">Compliance & Intellectual Property</p>
        </div>

        {/* Section 1: Privacy Policy */}
        <Section titleKey="gdpr.intro.title" icon={<GlobeIcon className="w-6 h-6" />}>
           <p className="text-gray-700 leading-relaxed font-medium">{t('gdpr.intro.p1')}</p>
        </Section>

        <Section titleKey="gdpr.collect.title">
           <p className="text-gray-700 leading-relaxed mb-4">{t('gdpr.collect.p1')}</p>
           <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-100">
                   <div className="bg-[#002D5B] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">{i}</div>
                   <span className="text-xs font-bold text-gray-600 leading-tight">{t(`gdpr.collect.item${i}`)}</span>
                </li>
              ))}
           </ul>
        </Section>

        <Section titleKey="gdpr.basis.title">
           <p className="text-gray-700 leading-relaxed mb-4">{t('gdpr.basis.p1')}</p>
           <ul className="space-y-3">
              {[1, 2, 3].map(i => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                   <span className="text-blue-500 text-lg">●</span>
                   {t(`gdpr.basis.item${i}`)}
                </li>
              ))}
           </ul>
        </Section>

        <Section titleKey="gdpr.retention.title">
           <div className="grid grid-cols-1 gap-6">
              <div className="border-l-4 border-blue-500 pl-4 py-1">
                 <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-1">Infrastructure</h4>
                 <p className="text-gray-700 text-sm font-medium">{t('gdpr.retention.storage')}</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4 py-1">
                 <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-1">Collaboration</h4>
                 <p className="text-gray-700 text-sm font-medium">{t('gdpr.retention.sharing')}</p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4 py-1">
                 <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-1">Duration</h4>
                 <p className="text-gray-700 text-sm font-medium">{t('gdpr.retention.time')}</p>
              </div>
           </div>
        </Section>

        <Section titleKey="gdpr.rights.title">
           <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
              <div className="text-3xl">🔑</div>
              <p className="text-gray-700 text-sm font-bold leading-relaxed">{t('gdpr.rights.p1')}</p>
           </div>
        </Section>

        {/* Divider */}
        <div className="my-20 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Section 2: Legal Disclaimer & IP */}
        <div className="mb-12">
            <h2 className="text-3xl font-black text-[#002D5B] text-center uppercase tracking-tight mb-12">{t('gdpr.disclaimer.main.title')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-black text-[#002D5B] mb-3 uppercase tracking-tight flex items-center gap-2">
                     <span className="text-2xl group-hover:rotate-12 transition-transform">📊</span>
                     {t('gdpr.disclaimer.estimates.title')}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">{t('gdpr.disclaimer.estimates.p1')}</p>
               </div>
               
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-black text-[#002D5B] mb-3 uppercase tracking-tight flex items-center gap-2">
                     <span className="text-2xl group-hover:rotate-12 transition-transform">⚖️</span>
                     {t('gdpr.disclaimer.liability.title')}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">{t('gdpr.disclaimer.liability.p1')}</p>
               </div>
            </div>

            <div className="mt-8 bg-[#002D5B] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
               <div className="relative z-10">
                  <h3 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center gap-3">
                     <DocumentTextIcon className="w-6 h-6 text-blue-300" />
                     {t('gdpr.disclaimer.ip.title')}
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed font-medium mb-6">{t('gdpr.disclaimer.ip.p1')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <h4 className="text-[10px] font-black uppercase text-blue-300 tracking-widest mb-2">Usage Rights</h4>
                        <p className="text-xs text-white leading-snug">{t('gdpr.disclaimer.ip.usage')}</p>
                     </div>
                     <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <h4 className="text-[10px] font-black uppercase text-blue-300 tracking-widest mb-2">Trademarks</h4>
                        <p className="text-xs text-white leading-snug">{t('gdpr.disclaimer.ip.trademarks')}</p>
                     </div>
                  </div>
               </div>
            </div>
        </div>

        <div className="text-center mt-20 p-8 border-2 border-dashed border-gray-200 rounded-[2rem]">
           <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Kraken Verification</p>
           <p className="text-gray-500 font-medium text-sm">Last Update: January 2025 | Seewaldestrasse 3, 8203 Schaffhausen</p>
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
