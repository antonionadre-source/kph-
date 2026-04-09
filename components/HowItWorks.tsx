import React from 'react';
import { useTranslation } from '../i18n';
import { motion } from 'motion/react';

interface HowItWorksProps {
  onNavigate?: (page: string) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const handleB2CClick = () => {
    if (onNavigate) {
      onNavigate('consultation');
    }
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-7xl font-black text-[#002d5b] mb-4 tracking-tighter uppercase">
            How It Works.
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">
            Simple. Transparent. Precision Engineered.
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 max-w-5xl mx-auto">
          {/* B2B Button */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = 'mailto:info@krakenpfm.ch'}
            className="group relative w-full md:w-1/2 bg-white border-2 border-slate-200 p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 transition-all flex flex-col items-center text-center gap-6 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-[#002d5b]" />
            <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-500">🏢</div>
            <div className="space-y-2">
              <span className="block text-2xl font-black text-[#002d5b] uppercase tracking-tight leading-none">
                Book a Free<br/>Consultation
              </span>
              <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full group-hover:w-24 transition-all duration-500" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              For B2B & Corporate Partners
            </p>
            <div className="mt-4 px-6 py-3 bg-[#002d5b] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-blue-700 transition-colors">
              Contact Directors
            </div>
          </motion.button>

          {/* B2C Button */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleB2CClick}
            className="group relative w-full md:w-1/2 bg-white border-2 border-slate-200 p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 transition-all flex flex-col items-center text-center gap-6 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
            <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-500">🏠</div>
            <div className="space-y-2">
              <span className="block text-2xl font-black text-[#002d5b] uppercase tracking-tight leading-none">
                Private &<br/>Commercial
              </span>
              <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full group-hover:w-24 transition-all duration-500" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              For B2C & Residential Clients
            </p>
            <div className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-blue-500 transition-colors">
              Build Your Quote
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
