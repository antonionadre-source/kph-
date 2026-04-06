import React from 'react';
import { motion } from 'motion/react';

const B2BCapabilities: React.FC = () => {
  const capabilities = [
    {
      emoji: '🏢',
      title: 'Facility Management',
      description: 'Comprehensive management of physical assets and infrastructure to ensure optimal performance.',
      delay: 0.1
    },
    {
      emoji: '🧹',
      title: 'Industrial Cleaning',
      description: 'Specialized cleaning solutions for warehouses, factories, and large-scale commercial spaces.',
      delay: 0.2
    },
    {
      emoji: '⚙️',
      title: 'Technical Maintenance',
      description: 'Proactive and reactive maintenance for electrical, plumbing, and HVAC systems.',
      delay: 0.3
    },
    {
      emoji: '🛡️',
      title: 'Asset Protection',
      description: 'Strategic planning to preserve and enhance the long-term value of your real estate portfolio.',
      delay: 0.4
    }
  ];

  return (
    <section id="b2b-capabilities" className="py-32 bg-white overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-blue-600/5 rounded-full blur-[180px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-baseline justify-between mb-24 gap-12">
          <div className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-8 block"
            >
              B2B Capabilities
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black text-[#002d5b] leading-[0.85] tracking-tighter"
            >
              Technical Excellence for <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">Swiss Enterprises.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-slate-600 max-w-md text-xl md:text-2xl font-medium leading-relaxed"
          >
            We combine engineering precision with operational efficiency to support your business goals across the plateau.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: cap.delay, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="group relative bg-slate-50 p-12 rounded-[3rem] border border-slate-200 transition-all duration-500 hover:bg-slate-100 hover:border-slate-300"
            >
              <div className="text-6xl mb-10 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                {cap.emoji}
              </div>
              <h3 className="text-2xl font-black text-[#002d5b] mb-4 tracking-tight">
                {cap.title}
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium group-hover:text-slate-800 transition-colors">
                {cap.description}
              </p>
              
              {/* Decorative element */}
              <div className="absolute top-8 right-8 w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[#002d5b] text-xs font-black">0{i + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default B2BCapabilities;
