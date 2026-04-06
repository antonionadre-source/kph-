import React from 'react';
import { motion } from 'motion/react';
import { SmartBudgetingIcon, SustainabilityIcon, KrakenStandardIcon, Response247Icon, SeamlessSupportIcon } from './icons';
import { useTranslation } from '../i18n';

const WhyKrakenSection: React.FC = () => {
  const { t } = useTranslation();

  const items = [
    {
      icon: <SmartBudgetingIcon className="w-12 h-12" />,
      label: t('whyKraken.item1'),
      description: t('whyKraken.item1.desc'),
      delay: 0.1
    },
    {
      icon: <SustainabilityIcon className="w-12 h-12" />,
      label: t('whyKraken.item2'),
      description: t('whyKraken.item2.desc'),
      delay: 0.2
    },
    {
      icon: <KrakenStandardIcon className="w-12 h-12" />,
      label: t('whyKraken.item3'),
      description: t('whyKraken.item3.desc'),
      delay: 0.3
    },
    {
      icon: <Response247Icon className="w-12 h-12" />,
      label: t('whyKraken.item4'),
      description: t('whyKraken.item4.desc'),
      delay: 0.4
    },
    {
      icon: <SeamlessSupportIcon className="w-12 h-12" />,
      label: t('whyKraken.item5'),
      description: t('whyKraken.item5.desc'),
      delay: 0.5
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl mb-8 transition-all duration-500 bg-transparent text-[#002D5B] group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-[#002D5B] mb-4 tracking-tight">
                {item.label}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-[240px] md:max-w-none">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyKrakenSection;
