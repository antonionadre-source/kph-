import React from 'react';
import { companyLogoWhiteUrl } from '../assets';
import { motion } from 'motion/react';

const BrandBanner: React.FC = () => {
  return (
    <section className="w-full bg-[#002D5B] py-16 md:py-24 relative overflow-hidden mb-24">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <img 
              src={companyLogoWhiteUrl} 
              alt="Kraken Properties Logo" 
              className="h-20 md:h-32 w-auto drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-[0.2em] leading-none">
              Properties and
            </h2>
            <h2 className="text-2xl md:text-4xl font-black text-blue-400 uppercase tracking-[0.2em] leading-none">
              Facilities Management
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mt-8 rounded-full"
          ></motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandBanner;
