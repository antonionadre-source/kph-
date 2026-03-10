
import React from 'react';
import { useTranslation } from '../i18n';
import { sustainabilityImage1Url, sustainabilityImage2Url } from '../assets';

interface SustainabilitySectionProps {
  onNavigate: (page: string) => void;
}

const SustainabilitySection: React.FC<SustainabilitySectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-dots-pattern opacity-40"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            {t('sustainability.title')}
          </h2>
        </div>

        <div className="space-y-24">
          {/* Block 1: B Corp */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="md:w-1/2 relative group">
               <div className="absolute -inset-4 bg-gradient-to-r from-green-100 to-blue-50 rounded-xl transform -rotate-2 opacity-70 group-hover:rotate-1 transition-transform duration-500"></div>
               <img 
                src={sustainabilityImage1Url} 
                alt="Eco-friendly cleaning products" 
                className="relative rounded-lg shadow-xl w-full h-auto object-cover transform transition-transform duration-500 hover:scale-[1.02]"
               />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#002D5B] mb-6">
                {t('sustainability.bcorp.title')}
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('sustainability.bcorp.p1')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-green-400 pl-4">
                {t('sustainability.bcorp.p2')}
              </p>
            </div>
          </div>

          {/* Block 2: Local Partnership */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
            <div className="md:w-1/2 relative group">
               <div className="absolute -inset-4 bg-gradient-to-l from-blue-100 to-green-50 rounded-xl transform rotate-2 opacity-70 group-hover:-rotate-1 transition-transform duration-500"></div>
               <img 
                src={sustainabilityImage2Url} 
                alt="Hand holding a small plant" 
                className="relative rounded-lg shadow-xl w-full h-auto object-cover transform transition-transform duration-500 hover:scale-[1.02]"
               />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#002D5B] mb-6">
                {t('sustainability.local.title')}
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('sustainability.local.p1')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('sustainability.local.p2')}
              </p>
              <div className="mt-8">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate('sustainability-page'); }}
                  className="inline-flex items-center text-[#002D5B] font-bold hover:text-green-600 transition-colors group"
                >
                  <span className="border-b-2 border-[#002D5B] group-hover:border-green-600 pb-1">
                    {t('sustainability.section.cta')}
                  </span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .bg-dots-pattern {
            background-image: 
              radial-gradient(circle at center, rgba(0, 45, 91, 0.05) 1.5px, transparent 1.5px),
              radial-gradient(circle at center, rgba(0, 45, 91, 0.05) 1.5px, transparent 1.5px);
            background-size: 30px 30px;
            background-position: 0 0, 15px 15px;
        }
      `}</style>
    </section>
  );
};

export default SustainabilitySection;
