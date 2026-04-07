import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n';

const WhyKrakenSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#007AFF] font-black uppercase tracking-[0.3em] text-sm mb-4 block"
          >
            {t('whyKraken.badge')}
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-[#002D5B] mb-6 tracking-tight"
          >
            {t('whyKraken.title')}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 italic font-medium"
          >
            {t('whyKraken.subtitle')}
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.img 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            src="https://www.dropbox.com/scl/fi/gxi2nh8v7wrtx760y2u4p/iconos-why-us.jpg?rlkey=blznhae1xrcsi5vcqrvvquio8&st=nahvgjck&raw=1" 
            alt="Why Kraken Icons" 
            className="w-full h-auto rounded-3xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyKrakenSection;
