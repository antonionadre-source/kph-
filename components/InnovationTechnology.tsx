import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Globe, Shield } from 'lucide-react';

const InnovationTechnology: React.FC = () => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Smart Infrastructure",
      description: "Integrating IoT sensors and smart meters to optimize energy consumption and predictive maintenance."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Data-driven decision making with live dashboards monitoring every aspect of your facility."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Digital Twin",
      description: "A virtual representation of your physical assets for simulation, analysis, and control."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Cyber-Physical Security",
      description: "Advanced protection for both your physical premises and the digital systems that manage them."
    }
  ];

  return (
    <section className="py-24 bg-[#002d5b] text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 transform translate-x-1/4"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs mb-6 block"
          >
            Innovation & Technology
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-8"
          >
            The Future of <br />
            <span className="text-blue-400">Swiss Management.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-blue-100/60 text-xl font-medium leading-relaxed"
          >
            We leverage cutting-edge technology to transform traditional facility management into a proactive, data-driven ecosystem.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-blue-100/50 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InnovationTechnology;
