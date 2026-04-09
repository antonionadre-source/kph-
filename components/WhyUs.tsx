import React from 'react';
import { useTranslation } from '../i18n';
import { ShieldCheckIcon, BoltIcon, UserGroupIcon, ClockIcon, CheckCircleIcon } from './icons';
import { motion } from 'motion/react';

const WhyUs: React.FC = () => {
  const { t } = useTranslation();

  const reasons = [
    {
      title: t('whyUs.reason1.title'),
      description: t('whyUs.reason1.desc'),
      icon: <BoltIcon className="w-8 h-8 text-blue-500" />,
      color: "from-blue-500/20 to-cyan-500/20",
      delay: 0.1
    },
    {
      title: t('whyUs.reason2.title'),
      description: t('whyUs.reason2.desc'),
      icon: <ShieldCheckIcon className="w-8 h-8 text-emerald-500" />,
      color: "from-emerald-500/20 to-teal-500/20",
      delay: 0.2
    },
    {
      title: t('whyUs.reason3.title'),
      description: t('whyUs.reason3.desc'),
      icon: <UserGroupIcon className="w-8 h-8 text-purple-500" />,
      color: "from-purple-500/20 to-pink-500/20",
      delay: 0.3
    },
    {
      title: t('whyUs.reason4.title'),
      description: t('whyUs.reason4.desc'),
      icon: <ClockIcon className="w-8 h-8 text-orange-500" />,
      color: "from-orange-500/20 to-yellow-500/20",
      delay: 0.4
    },
  ];

  return (
    <section className="py-32 bg-[#020617] overflow-hidden relative text-white">
      {/* 2026 Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[160px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[160px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              {t('whyUs.badge')}
            </span>
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8"
          >
            {t('whyUs.title').split('Kraken Management.')[0]}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500">
              Kraken Management.
            </span>
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto font-medium"
          >
            {t('whyUs.subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reason.delay, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="group relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:bg-white/[0.06] hover:border-white/20"
            >
              {/* Card Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl -z-10`} />
              
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                {reason.icon}
              </div>
              
              <h4 className="text-2xl font-black mb-4 tracking-tight group-hover:text-white transition-colors">
                {reason.title}
              </h4>
              
              <p className="text-slate-400 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">
                {reason.description}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-blue-400 font-bold text-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <CheckCircleIcon className="w-4 h-4" />
                {t('whyUs.verified')}
              </div>

              {/* Decorative corner line */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* 2026 Stats Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm"
        >
          {[
            { val: "99.9%", label: t('whyUs.stat1.label') },
            { val: "15min", label: t('whyUs.stat2.label') },
            { val: "500+", label: t('whyUs.stat3.label') },
            { val: "ISO", label: t('whyUs.stat4.label') }
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.val}
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;
