import React from 'react';
import { Shield, Clock, ClipboardCheck, Zap, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const ValuesSection: React.FC = () => {
  const values = [
    {
      icon: <Shield className="w-10 h-10 text-blue-400" />,
      title: "Swiss-level reliability",
      desc: "We show up. We follow through. Every time."
    },
    {
      icon: <Clock className="w-10 h-10 text-blue-400" />,
      title: "24/7 emergency response",
      desc: "Problems don't wait. Neither do we."
    },
    {
      icon: <ClipboardCheck className="w-10 h-10 text-blue-400" />,
      title: "Fully insured & audited",
      desc: "Your property and peace of mind are protected."
    },
    {
      icon: <Zap className="w-10 h-10 text-blue-400" />,
      title: "Instant & tailored quotes",
      desc: "Get a clear quote in minutes. No hidden costs."
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-blue-400" />,
      title: "Real people, real support",
      desc: "No bots. No runaround. Just answers."
    }
  ];

  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="bg-[#020d1f] rounded-[2.5rem] py-6 md:py-8 px-8 md:px-12 text-center relative overflow-hidden shadow-2xl">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-200 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            OUR VALUES
          </div>
          
          <h2 className="text-lg md:text-2xl font-bold text-white mb-8 tracking-tight">
            The things that shouldn't take your time — but <span className="text-blue-500">always do.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-0">
            {values.map((value, index) => (
              <div key={index} className="flex flex-col items-center px-4 relative">
                {/* Vertical Divider */}
                {index > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-20 bg-white/10"></div>
                )}
                
                <div className="mb-3 p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10 shadow-inner">
                  {value.icon}
                </div>
                
                <h3 className="text-white font-bold text-sm mb-1 leading-tight">
                  {value.title}
                </h3>
                
                <p className="text-slate-400 text-xs leading-relaxed max-w-[180px]">
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
