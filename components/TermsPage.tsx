import React from 'react';
import { useTranslation } from '../i18n';
import { getTermsTranslation } from './docTranslations';

// Add Props interface to accept onNavigate
interface TermsPageProps {
  onNavigate: (page: string) => void;
}

// Updated component to accept onNavigate prop
const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const termsTrans = getTermsTranslation(language);

  return (
    <main className="kraken-page kraken-editorial bg-slate-50 min-h-screen">
      <header className="kraken-page-intro border-b border-[#dce6e8] bg-white py-12 sm:py-16"><div className="kraken-container max-w-4xl"><p className="kraken-eyebrow">Kraken PFM</p><h1 className="kraken-heading mt-3">{termsTrans.title}</h1><p className="kraken-description">{termsTrans.description}</p></div></header>

      {/* Content Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-6">
                {termsTrans.sections.map((section, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-[#dce6e8] hover:shadow-md transition-shadow group"
                    >
                        <h2 className="text-xl font-semibold text-[#082b45] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 bg-blue-50 text-[#007bff] rounded-lg flex items-center justify-center text-sm font-semibold group-hover:bg-[#007bff] group-hover:text-white transition-colors">
                                {idx + 1}
                            </span>
                            {section.title}
                        </h2>
                        <div className="text-gray-600 leading-relaxed text-sm md:text-base sm:pl-11">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-10 bg-white border border-[#dce6e8] rounded-2xl text-center text-[#082b45] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <p className="text-sm text-[#526574] font-semibold normal-case tracking-normal mb-4">{termsTrans.verificationTitle}</p>
                    <p className="text-sm font-medium  mb-2">{termsTrans.lastUpdated}</p>
                    <p className="text-sm ">{termsTrans.companyInfo}</p>
                </div>
            </div>

            {/* Back button using onNavigate */}
            <div className="mt-12 text-center">
                <button
                  onClick={() => onNavigate('home')}
                  className="kraken-button kraken-secondary"
                >
                  {termsTrans.backHome}
                </button>
            </div>
        </div>
      </section>
    </main>
  );
};

export default TermsPage;
