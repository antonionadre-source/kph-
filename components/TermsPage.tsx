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
    <main className="bg-slate-50 min-h-screen">
      {/* Header Section */}
      <section className="relative bg-[#001D3D] pt-48 pb-24 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img src="/kai terms and condition.webp" alt="Terms and Conditions" className="w-full h-full object-cover opacity-25 object-center" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001D3D] via-[#001D3D]/85 to-transparent" />
        </div>
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 uppercase tracking-tight">
                {termsTrans.title}
            </h1>
            <p className="text-base md:text-lg text-blue-100/90 font-medium leading-relaxed max-w-3xl mx-auto">
                {termsTrans.description}
            </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-6">
                {termsTrans.sections.map((section, idx) => (
                    <div 
                        key={idx} 
                        className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                    >
                        <h2 className="text-xl font-black text-[#002D5B] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 bg-blue-50 text-[#007bff] rounded-lg flex items-center justify-center text-sm font-black group-hover:bg-[#007bff] group-hover:text-white transition-colors">
                                {idx + 1}
                            </span>
                            {section.title}
                        </h2>
                        <div className="text-gray-600 leading-relaxed text-sm md:text-base pl-11">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-10 bg-[#002D5B] rounded-[3rem] text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <p className="text-xs text-blue-200 font-black uppercase tracking-[0.2em] mb-4">{termsTrans.verificationTitle}</p>
                    <p className="text-sm font-medium opacity-80 mb-2">{termsTrans.lastUpdated}</p>
                    <p className="text-xs opacity-60">{termsTrans.companyInfo}</p>
                </div>
            </div>

            {/* Back button using onNavigate */}
            <div className="mt-12 text-center">
                <button 
                  onClick={() => onNavigate('home')}
                  className="bg-[#002D5B] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#00254A] transition-all shadow-xl"
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