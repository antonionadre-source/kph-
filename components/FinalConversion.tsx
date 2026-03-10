import React from 'react';
import { useTranslation } from '../i18n';
import { PaperAirplaneIcon, PhoneIcon } from './icons';

interface FinalConversionProps {
  onNavigate: (page: string) => void;
}

const FinalConversion: React.FC<FinalConversionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section className="py-32 bg-[#002d5b] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Experience <br /> Swiss Management?
          </h2>
          <p className="text-xl text-blue-100/80 mb-16 max-w-2xl mx-auto leading-relaxed">
            Our team of experts is ready to help you with your property and facility management needs. Let's start a conversation today.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button 
              onClick={() => onNavigate('consultation')}
              className="group flex items-center justify-center gap-4 bg-white text-[#002d5b] px-8 py-6 rounded-3xl font-black text-xl shadow-2xl transition-all hover:bg-blue-50 hover:-translate-y-1 active:scale-95"
            >
              <PaperAirplaneIcon className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              Technical Consultation
            </button>
            <button 
              onClick={() => window.open('tel:+41000000000')}
              className="group flex items-center justify-center gap-4 bg-blue-600 text-white px-8 py-6 rounded-3xl font-black text-xl shadow-2xl transition-all hover:bg-blue-500 hover:-translate-y-1 active:scale-95"
            >
              <PhoneIcon className="w-6 h-6 transition-transform group-hover:rotate-12" />
              Talk to an Advisor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalConversion;
