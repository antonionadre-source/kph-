import React from 'react';
import { useTranslation } from '../i18n';

const ValuesSection: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    {
      img: '/kai-webp-aug17-2.webp',
      alt: 'Kai - Qualität & Schweizer Präzision',
      title: t('values.item1.title'),
      desc: t('values.item1.desc')
    },
    {
      img: '/kai-webp-aug17-1.webp',
      alt: 'Kai - 100% Abnahmegarantie',
      title: t('values.item2.title'),
      desc: t('values.item2.desc')
    },
    {
      img: '/kai-webp-aug17-3.webp',
      alt: 'Kai - Transparenz & Schweizer Service',
      title: t('values.item3.title'),
      desc: t('values.item3.desc')
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="bg-[#020d1f] rounded-2xl sm:rounded-3xl py-10 px-6 sm:px-10 md:px-12 text-center relative overflow-hidden shadow-2xl border border-slate-800">
        {/* Decorative background elements (div:nth-of-type(1)) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        {/* Content container (div:nth-of-type(2)) */}
        <div className="relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
            {t('values.badge')}
          </span>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 tracking-tight">
            {t('values.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {values.map((value, index) => (
              <div key={index} className="flex flex-col items-center bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 shadow-xl hover:border-blue-500/40 transition-all group">
                <div className="mb-5 w-full flex justify-center">
                  <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden border border-blue-500/20 shadow-md group-hover:scale-[1.02] transition-transform duration-300">
                    <img
                      src={value.img}
                      alt={value.alt}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                  {value.title}
                </h3>
                
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-[280px]">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
