
import React from 'react';
import { useTranslation } from '../i18n';
import { ShieldCheckIcon, DocumentTextIcon, UserCheckIcon, LeafIcon } from './icons';
import { getHSETranslation } from './docTranslations';

const HSEPage: React.FC = () => {
  const { language } = useTranslation();
  const hseTrans = getHSETranslation(language);

  const SectionTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
    <h2 className="text-2xl font-bold text-[#002D5B] mb-6 flex items-center border-b border-gray-200 pb-3">
        {icon && <span className="mr-3">{icon}</span>}
        {children}
    </h2>
  );

  const InfoCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
          <div className="text-gray-600 text-sm space-y-2">
              {children}
          </div>
      </div>
  );

  const CheckList: React.FC<{ items: string[] }> = ({ items }) => (
      <ul className="space-y-2">
          {items.map((item, idx) => (
              <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span className="text-sm text-gray-700">{item}</span>
              </li>
          ))}
      </ul>
  );

  return (
    <main className="bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="relative rounded-[3rem] overflow-hidden mb-16 bg-[#001D3D] text-white min-h-[35vh] flex items-center p-8 md:p-12 shadow-xl">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#001D3D] via-[#001D3D]/80 to-transparent" />
          </div>
          <div className="relative z-10 max-w-3xl text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-red-500/20 text-red-300 text-xs font-bold tracking-wide uppercase mb-4 shadow-sm backdrop-blur-sm">
              {hseTrans.badge}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-tight uppercase">{hseTrans.title}</h1>
            <p className="text-sm md:text-base text-blue-100/90 font-medium leading-relaxed max-w-2xl">
              {hseTrans.intro}
            </p>
          </div>
        </div>

        {/* Section 1: Swiss Legal Compliance */}
        <section className="mb-16">
            <SectionTitle icon={<ShieldCheckIcon className="w-8 h-8 text-[#002D5B]" />}>{hseTrans.sec1Title}</SectionTitle>
            <p className="mb-6 text-gray-700">{hseTrans.sec1P1}</p>
            <div className="grid md:grid-cols-3 gap-6">
                <InfoCard title={hseTrans.uvgTitle} className="border-l-4 border-l-red-500">
                    <p>{hseTrans.uvgText}</p>
                </InfoCard>
                <InfoCard title={hseTrans.vuvTitle} className="border-l-4 border-l-red-500">
                    <p className="mb-2 text-xs font-medium text-gray-500">{hseTrans.vuvText}</p>
                    <CheckList items={hseTrans.vuvList} />
                </InfoCard>
                <InfoCard title={hseTrans.ekasTitle} className="border-l-4 border-l-red-500">
                    <p>{hseTrans.ekasText}</p>
                </InfoCard>
            </div>
        </section>

        {/* Section 2: Suva & ISO */}
        <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
             <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{hseTrans.sec2Title}</h3>
                    <p className="mb-4 text-gray-700">{hseTrans.sec2P1}</p>
                    <CheckList items={hseTrans.sec2List} />
                </div>
                <div className="bg-slate-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{hseTrans.isoTitle}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{hseTrans.isoText}</p>
                </div>
             </div>
        </section>

        {/* Section 3: Risk Management */}
        <section className="mb-16">
            <SectionTitle icon={<DocumentTextIcon className="w-8 h-8 text-[#002D5B]" />}>{hseTrans.sec3Title}</SectionTitle>
            <p className="mb-8 text-gray-700">{hseTrans.sec3Intro}</p>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-bold text-[#002D5B] mb-4">{hseTrans.riskTitle}</h3>
                    <p className="text-sm text-gray-600 mb-4">{hseTrans.riskText}</p>
                    <CheckList items={hseTrans.riskList} />
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-bold text-[#002D5B] mb-4">{hseTrans.ramsTitle}</h3>
                    <p className="text-sm text-gray-600 mb-4">{hseTrans.ramsText}</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                        {hseTrans.ramsList.map((item, idx) => (
                           <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>

        {/* Section 4: Chemical Safety */}
        <section className="mb-16">
            <SectionTitle>{hseTrans.sec4Title}</SectionTitle>
            <p className="mb-6 text-gray-700">{hseTrans.sec4Intro}</p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                 <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
                    <h4 className="font-bold text-orange-900 mb-3">{hseTrans.reqTitle}</h4>
                    <CheckList items={hseTrans.sec4List} />
                 </div>
                 <div className="bg-cyan-50 p-5 rounded-lg border border-cyan-100">
                    <h4 className="font-bold text-cyan-900 mb-3">{hseTrans.trainingTitle}</h4>
                    <p className="text-xs text-gray-500 mb-2">{hseTrans.trainingText}</p>
                    <CheckList items={hseTrans.trainingList} />
                 </div>
            </div>
        </section>

        {/* Section 5: Instruction & Competence */}
        <section className="mb-16">
             <SectionTitle icon={<UserCheckIcon className="w-8 h-8 text-[#002D5B]" />}>{hseTrans.sec5Title}</SectionTitle>
             <p className="mb-4 text-gray-700">{hseTrans.sec5Intro}</p>
             <ul className="flex flex-wrap gap-3 mb-8">
                 {hseTrans.sec5List.map(item => (
                     <li key={item} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">{item}</li>
                 ))}
             </ul>
             
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{hseTrans.tbtTitle}</h3>
                    <p className="text-sm text-gray-600 mb-3">{hseTrans.tbtText}</p>
                    <CheckList items={hseTrans.tbtList} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{hseTrans.modulesTitle}</h3>
                    <p className="text-sm text-gray-600 mb-3">{hseTrans.modulesText}</p>
                    <CheckList items={hseTrans.modulesList} />
                </div>
             </div>
        </section>

        {/* Section 6: ESG & Environment */}
        <section className="mb-16 bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
            <SectionTitle icon={<LeafIcon className="w-8 h-8 text-green-700" />}>{hseTrans.sec6Title}</SectionTitle>
            
            <div className="grid md:grid-cols-2 gap-10">
                <div>
                    <h3 className="font-bold text-green-900 mb-3">{hseTrans.envTitle}</h3>
                    <p className="text-sm text-green-800 mb-3">{hseTrans.envText}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                        {hseTrans.envList.map((item, idx) => (
                           <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-green-900 mb-3">{hseTrans.wasteTitle}</h3>
                        <p className="text-sm text-green-800 mb-3">{hseTrans.wasteText}</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                            {hseTrans.wasteList.map((item, idx) => (
                               <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-green-900 mb-3">{hseTrans.co2Title}</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                            {hseTrans.co2List.map((item, idx) => (
                               <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 7: Continuous Improvement */}
        <section className="bg-gray-800 text-white p-8 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-6">{hseTrans.sec7Title}</h2>
            <p className="text-gray-300 mb-6">{hseTrans.sec7Intro}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                {hseTrans.sec7List.map((item, idx) => (
                   <span key={idx} className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm text-sm">{item}</span>
                ))}
            </div>
            <p className="text-gray-300 italic max-w-2xl mx-auto text-sm">{hseTrans.sec7Footer}</p>
        </section>

      </div>
    </main>
  );
};

export default HSEPage;
