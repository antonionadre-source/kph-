
import React from 'react';
import { useTranslation } from '../i18n';
import { ShieldCheckIcon, DocumentTextIcon, UserCheckIcon, LeafIcon } from './icons';

const HSEPage: React.FC = () => {
  const { t } = useTranslation();

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
    <main className="bg-slate-50 pt-48 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-700 text-sm font-bold tracking-wide uppercase mb-4">
            Swiss Precision, Global Standard
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 max-w-4xl mx-auto leading-tight">{t('hse.title')}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {t('hse.intro')}
          </p>
        </div>

        {/* Section 1: Swiss Legal Compliance */}
        <section className="mb-16">
            <SectionTitle icon={<ShieldCheckIcon className="w-8 h-8 text-[#002D5B]" />}>{t('hse.section1.title')}</SectionTitle>
            <p className="mb-6 text-gray-700">{t('hse.section1.p1')}</p>
            <div className="grid md:grid-cols-3 gap-6">
                <InfoCard title={t('hse.section1.uvg.title')} className="border-l-4 border-l-red-500">
                    <p>{t('hse.section1.uvg.text')}</p>
                </InfoCard>
                <InfoCard title={t('hse.section1.vuv.title')} className="border-l-4 border-l-red-500">
                    <p className="mb-2 text-xs font-medium text-gray-500">{t('hse.section1.vuv.text')}</p>
                    <CheckList items={[
                        t('hse.section1.vuv.list1'),
                        t('hse.section1.vuv.list2'),
                        t('hse.section1.vuv.list3'),
                        t('hse.section1.vuv.list4')
                    ]} />
                </InfoCard>
                <InfoCard title={t('hse.section1.ekas.title')} className="border-l-4 border-l-red-500">
                    <p>{t('hse.section1.ekas.text')}</p>
                </InfoCard>
            </div>
        </section>

        {/* Section 2: Suva & ISO */}
        <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
             <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('hse.section2.title')}</h3>
                    <p className="mb-4 text-gray-700">{t('hse.section2.p1')}</p>
                    <CheckList items={[
                        t('hse.section2.list1'),
                        t('hse.section2.list2'),
                        t('hse.section2.list3')
                    ]} />
                </div>
                <div className="bg-slate-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{t('hse.section2.iso.title')}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{t('hse.section2.iso.text')}</p>
                </div>
             </div>
        </section>

        {/* Section 3: Risk Management */}
        <section className="mb-16">
            <SectionTitle icon={<DocumentTextIcon className="w-8 h-8 text-[#002D5B]" />}>{t('hse.section3.title')}</SectionTitle>
            <p className="mb-8 text-gray-700">{t('hse.section3.intro')}</p>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-bold text-[#002D5B] mb-4">{t('hse.section3.risk.title')}</h3>
                    <p className="text-sm text-gray-600 mb-4">{t('hse.section3.risk.text')}</p>
                    <CheckList items={[
                        t('hse.section3.risk.list1'),
                        t('hse.section3.risk.list2'),
                        t('hse.section3.risk.list3'),
                        t('hse.section3.risk.list4')
                    ]} />
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-bold text-[#002D5B] mb-4">{t('hse.section3.rams.title')}</h3>
                    <p className="text-sm text-gray-600 mb-4">{t('hse.section3.rams.text')}</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                        <li>{t('hse.section3.rams.list1')}</li>
                        <li>{t('hse.section3.rams.list2')}</li>
                        <li>{t('hse.section3.rams.list3')}</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Section 4: Chemical Safety */}
        <section className="mb-16">
            <SectionTitle>{t('hse.section4.title')}</SectionTitle>
            <p className="mb-6 text-gray-700">{t('hse.section4.intro')}</p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                 <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
                    <h4 className="font-bold text-orange-900 mb-3">Requirements</h4>
                    <CheckList items={[
                        t('hse.section4.list1'),
                        t('hse.section4.list2'),
                        t('hse.section4.list3'),
                        t('hse.section4.list4')
                    ]} />
                 </div>
                 <div className="bg-cyan-50 p-5 rounded-lg border border-cyan-100">
                    <h4 className="font-bold text-cyan-900 mb-3">{t('hse.section4.training.title')}</h4>
                    <p className="text-xs text-gray-500 mb-2">{t('hse.section4.training.text')}</p>
                    <CheckList items={[
                        t('hse.section4.training.list1'),
                        t('hse.section4.training.list2'),
                        t('hse.section4.training.list3'),
                        t('hse.section4.training.list4')
                    ]} />
                 </div>
            </div>
        </section>

        {/* Section 5: Instruction & Competence */}
        <section className="mb-16">
             <SectionTitle icon={<UserCheckIcon className="w-8 h-8 text-[#002D5B]" />}>{t('hse.section5.title')}</SectionTitle>
             <p className="mb-4 text-gray-700">{t('hse.section5.intro')}</p>
             <ul className="flex flex-wrap gap-3 mb-8">
                 {[t('hse.section5.list1'), t('hse.section5.list2'), t('hse.section5.list3')].map(item => (
                     <li key={item} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">{item}</li>
                 ))}
             </ul>
             
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('hse.section5.tbt.title')}</h3>
                    <p className="text-sm text-gray-600 mb-3">{t('hse.section5.tbt.text')}</p>
                    <CheckList items={[
                        t('hse.section5.tbt.list1'),
                        t('hse.section5.tbt.list2'),
                        t('hse.section5.tbt.list3'),
                        t('hse.section5.tbt.list4')
                    ]} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('hse.section5.modules.title')}</h3>
                    <p className="text-sm text-gray-600 mb-3">{t('hse.section5.modules.text')}</p>
                    <CheckList items={[
                        t('hse.section5.modules.list1'),
                        t('hse.section5.modules.list2'),
                        t('hse.section5.modules.list3'),
                        t('hse.section5.modules.list4')
                    ]} />
                </div>
             </div>
        </section>

        {/* Section 6: ESG & Environment */}
        <section className="mb-16 bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
            <SectionTitle icon={<LeafIcon className="w-8 h-8 text-green-700" />}>{t('hse.section6.title')}</SectionTitle>
            
            <div className="grid md:grid-cols-2 gap-10">
                <div>
                    <h3 className="font-bold text-green-900 mb-3">{t('hse.section6.sub.title')}</h3>
                    <p className="text-sm text-green-800 mb-3">{t('hse.section6.sub.text')}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                        <li>{t('hse.section6.sub.list1')}</li>
                        <li>{t('hse.section6.sub.list2')}</li>
                        <li>{t('hse.section6.sub.list3')}</li>
                        <li>{t('hse.section6.sub.list4')}</li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-green-900 mb-3">{t('hse.section6.waste.title')}</h3>
                        <p className="text-sm text-green-800 mb-3">{t('hse.section6.waste.text')}</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                            <li>{t('hse.section6.waste.list1')}</li>
                            <li>{t('hse.section6.waste.list2')}</li>
                            <li>{t('hse.section6.waste.list3')}</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-green-900 mb-3">{t('hse.section6.co2.title')}</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                            <li>{t('hse.section6.co2.list1')}</li>
                            <li>{t('hse.section6.co2.list2')}</li>
                            <li>{t('hse.section6.co2.list3')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 7: Continuous Improvement */}
        <section className="bg-gray-800 text-white p-8 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-6">{t('hse.section7.title')}</h2>
            <p className="text-gray-300 mb-6">{t('hse.section7.intro')}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <span className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm text-sm">{t('hse.section7.list1')}</span>
                <span className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm text-sm">{t('hse.section7.list2')}</span>
                <span className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm text-sm">{t('hse.section7.list3')}</span>
            </div>
            <p className="text-gray-300 italic max-w-2xl mx-auto text-sm">{t('hse.section7.footer')}</p>
        </section>

      </div>
    </main>
  );
};

export default HSEPage;
