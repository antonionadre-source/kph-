import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { mascotImageUrl } from '../assets';

const Hero: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.scrollY);
  const { t } = useTranslation();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-[#E9F1F7] to-white overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between z-10">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h2 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('hero.title1')}
          </h2>
          <h2 className="text-5xl md:text-7xl font-bold text-[#002D5B] leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {t('hero.title2')}
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto md:mx-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {t('hero.subtitle')}
          </p>
          <a href="#contact" className="bg-[#002D5B] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#00254A] transition-transform hover:scale-105 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            {t('hero.cta')}
          </a>
        </div>
        
        <div className="md:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-lg h-auto">
                {/* Background Shape */}
                <div 
                    className="absolute inset-0 bg-[#C5D9E8]/50 rounded-full blur-3xl"
                    style={{ transform: `translateY(${offsetY * 0.2}px)` }}
                ></div>
                
                {/* Image with parallax effect */}
                <img 
                    src={mascotImageUrl} 
                    alt="Kraken Facilities Management octopus mascot" 
                    className="relative w-full h-auto object-contain transform transition-transform duration-300 ease-out"
                    style={{ transform: `translateY(-${offsetY * 0.3}px)` }}
                />
            </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Hero;