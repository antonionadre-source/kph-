
import React from 'react';
import { useTranslation } from '../i18n';
import { teamPhotoUrl } from '../assets';
import { motion } from 'motion/react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-32 bg-white overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2 relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[3rem] opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" />
            <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200">
              <img 
                src={teamPhotoUrl} 
                alt={t('about.image_alt')} 
                loading="lazy"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
            </div>
          </motion.div>

          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                The Kraken Standard
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black text-[#002d5b] mb-8 tracking-tighter leading-[0.9]"
            >
              {t('about.title')}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-slate-600 text-xl leading-relaxed font-medium"
            >
              {t('about.p1')}
            </motion.p>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-10 text-slate-600 text-xl leading-relaxed font-medium"
            >
              {t('about.p2')}
            </motion.p>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onClick={() => onNavigate('about')}
              className="group flex items-center gap-3 text-[#002d5b] font-black text-xl hover:text-blue-600 transition-colors"
            >
              {t('about.cta')}
              <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-50 transition-all">
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
