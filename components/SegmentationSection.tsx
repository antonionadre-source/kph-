import React from 'react';
import { useTranslation } from '../i18n';
import { CheckCircleIcon } from './icons';
import { motion } from 'motion/react';

interface SegmentationSectionProps {
  onNavigate: (page: string) => void;
}

const SegmentationSection: React.FC<SegmentationSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section id="segmentation-section" className="pt-20 pb-32 -mt-12 bg-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-black text-[#002d5b] mb-8 tracking-tighter"
          >
            {t('segmentation.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            {t('segmentation.subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Private Route */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative bg-slate-50 rounded-[3rem] p-12 border border-slate-200 transition-all duration-500 hover:bg-slate-100 hover:border-slate-300 flex flex-col h-full"
          >
            <div className="mb-10 flex-grow">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                {t('segmentation.private.badge')}
              </span>
              <h3 className="text-4xl font-black text-[#002d5b] mb-6 tracking-tight">{t('segmentation.private.title')}</h3>
              <p className="text-slate-600 leading-relaxed text-lg mb-8">
                {t('segmentation.private.desc')}
              </p>

              <ul className="space-y-5">
                {[t('segmentation.private.item1'), t('segmentation.private.item2'), t('segmentation.private.item3')].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-700 font-medium group-hover:text-[#002d5b] transition-colors">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => onNavigate('consultation')}
              className="w-full bg-[#002d5b] text-white py-6 rounded-2xl font-black text-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(0,45,91,0.2)] mt-auto"
            >
              {t('segmentation.private.cta')}
            </button>
          </motion.div>

          {/* Commercial Route */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative bg-blue-50 rounded-[3rem] p-12 border border-blue-100 transition-all duration-500 hover:bg-blue-100/50 hover:border-blue-200 flex flex-col h-full"
          >
            <div className="mb-10 flex-grow">
              <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                {t('segmentation.commercial.badge')}
              </span>
              <h3 className="text-4xl font-black text-[#002d5b] mb-6 tracking-tight">{t('segmentation.commercial.title')}</h3>
              <p className="text-slate-600 leading-relaxed text-lg mb-8">
                {t('segmentation.commercial.desc')}
              </p>

              <ul className="space-y-5">
                {[t('segmentation.commercial.item1'), t('segmentation.commercial.item2'), t('segmentation.commercial.item3')].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-700 font-medium group-hover:text-[#002d5b] transition-colors">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => onNavigate('commercial-services')}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-6 rounded-2xl font-black text-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(37,99,235,0.2)] mt-auto"
            >
              {t('segmentation.commercial.cta')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SegmentationSection;
