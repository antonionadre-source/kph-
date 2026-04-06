import React from 'react';
import { motion } from 'motion/react';
import { Eye, Activity, AlertTriangle, TrendingUp } from 'lucide-react';

const AIFacilityMonitoring: React.FC = () => {
  const monitors = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Visual AI Inspection",
      description: "Automated visual checks for structural integrity, cleanliness, and safety compliance."
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Predictive Maintenance",
      description: "AI algorithms that predict equipment failure before it happens, saving costs and downtime."
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Anomaly Detection",
      description: "Real-time identification of unusual patterns in energy use or system behavior."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Efficiency Optimization",
      description: "Continuous learning systems that optimize HVAC and lighting for maximum efficiency."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
          <div className="lg:w-1/2">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-6 block"
            >
              AI Facility Monitoring
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-[#002d5b] leading-[0.9] tracking-tighter mb-8"
            >
              Intelligence that <br />
              <span className="text-blue-600/80">Never Sleeps.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl"
            >
              Our AI-driven monitoring systems provide 24/7 oversight, ensuring your facilities are safe, efficient, and always operational.
            </motion.p>
          </div>
          
          <div className="lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-white/50"
            >
              <img 
                src="https://picsum.photos/seed/ai-monitoring/800/600" 
                alt="AI Monitoring Dashboard" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002d5b]/60 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-sm tracking-widest uppercase">System Status: Optimal</span>
                </div>
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-emerald-500"
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {monitors.map((monitor, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2 border border-slate-100 group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 text-blue-600 group-hover:scale-110 transition-transform">
                {monitor.icon}
              </div>
              <h3 className="text-2xl font-black text-[#002d5b] mb-4 tracking-tight">
                {monitor.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {monitor.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFacilityMonitoring;
