
import React from 'react';
import { clientLogos } from '../assets';
import { useTranslation } from '../i18n';
import { motion } from 'motion/react';

interface ClientsPageProps {
  onNavigate?: (page: string) => void;
}

const Clients: React.FC<ClientsPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.href = '/';
    }
  };

  const videoUrl = "https://www.dropbox.com/scl/fi/n34wuaglehdibhrpgmgex/worker.mp4?rlkey=toivyiwzsrfwabxas6x0vpbbv&st=f03nzrjx&raw=1";

  return (
    <div className="bg-[#020617] min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full flex flex-col items-center relative z-10"
      >
        {/* Construction Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <span className="bg-white/5 text-blue-400 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 backdrop-blur-md shadow-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            Platform Update 2026
          </span>
        </motion.div>

        {/* Video Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-[600px] mx-auto mb-8 relative group"
        >
          <div className="absolute -inset-4 bg-blue-600/20 rounded-[3rem] opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700" />
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
            <video 
              className="w-full h-auto block border-none outline-none bg-transparent pointer-events-none mix-blend-screen opacity-80"
              autoPlay 
              muted 
              loop 
              playsInline
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-6xl md:text-9xl font-black text-white mb-8 uppercase tracking-tighter leading-none"
        >
          Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Soon</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed mb-16 max-w-2xl mx-auto"
        >
          We are building an exclusive management portal. Soon, our clients will be able to access real-time data about their properties, track maintenance requests, and view detailed facility performance reports right here.
        </motion.p>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center"
        >
          <motion.button 
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHomeClick}
            className="bg-white text-[#020617] px-16 py-5 rounded-2xl font-black text-lg shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all uppercase tracking-widest"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const ClientCarousel: React.FC = () => {
  const { t } = useTranslation();

  // Duplicate logos for seamless scrolling effect
  const extendedLogos = [...clientLogos, ...clientLogos, ...clientLogos];

  return (
    <section id="clients-carousel" className="py-12 bg-white border-y border-slate-100 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-black text-[#002d5b] tracking-tighter leading-none mb-2">
            Trusted by the <span className="text-blue-600">Industry Leaders.</span>
          </h2>
        </motion.div>

        <div className="relative w-full overflow-hidden py-2">
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

          <motion.div 
            animate={{ x: [0, -1500] }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex items-center gap-16 whitespace-nowrap"
          >
            {extendedLogos.map((logo, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 flex justify-center items-center h-12 w-32 group" 
                title={logo.name}
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  loading="lazy"
                  className="max-h-8 max-w-full object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-110 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
