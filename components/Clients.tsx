
import React from 'react';
import { clientLogos } from '../assets';
import { useTranslation } from '../i18n';

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
    <div className="bg-white min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center overflow-hidden">
      <div className="max-w-4xl w-full animate-fade-in-up flex flex-col items-center">
        
        {/* Construction Badge */}
        <div className="flex justify-center mb-8">
            <span className="bg-amber-50 text-amber-700 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-amber-100 shadow-sm flex items-center gap-2.5">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                Platform Update
            </span>
        </div>

        {/* Slightly Larger Frameless Video Visual - Reduced margin bottom */}
        <div className="w-full max-w-[500px] mx-auto mb-4">
            <video 
                className="w-full h-auto block border-none outline-none bg-transparent pointer-events-none"
                autoPlay 
                muted 
                loop 
                playsInline
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>

        {/* Text Content */}
        <h1 className="text-5xl md:text-8xl font-black text-[#002D5B] mb-6 uppercase tracking-tighter leading-none">
            Coming <span className="text-[#007bff]">Soon</span>
        </h1>
        
        <p className="text-gray-500 text-lg md:text-xl font-bold leading-relaxed mb-12 max-w-2xl mx-auto">
            We are building an exclusive management portal. Soon, our clients will be able to access real-time data about their properties, track maintenance requests, and view detailed facility performance reports right here.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
            <button 
                onClick={handleHomeClick}
                className="bg-[#002D5B] text-white px-12 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-blue-900/20 hover:bg-[#00254A] transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
            >
                Back to Home
            </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export const ClientCarousel: React.FC = () => {
  const { t } = useTranslation();

  // Duplicate logos for seamless scrolling effect
  const extendedLogos = [...clientLogos, ...clientLogos];

  return (
    <section id="clients-carousel" className="py-20 bg-white border-t border-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight">{t('clients.title')}</h2>
          <p className="text-base text-gray-500 mt-4 max-w-2xl mx-auto font-medium">
            {t('clients.subtitle')}
          </p>
        </div>
        <div 
          className="group relative w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="flex animate-scroll">
            {extendedLogos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 mx-8 flex justify-center items-center h-24 w-48" title={logo.name}>
                <img
                  src={logo.url}
                  alt={logo.name}
                  loading="lazy"
                  className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .group:hover .animate-scroll {
            animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Clients;
