import React from 'react';
import { FarfetchLogo, MandarinOrientalLogo, AldersgateLogo, PrimeraLogo, AmbassadorHotelLogo, BasqueTradeLogo } from './logos';
import { useTranslation } from '../i18n';

const Clients: React.FC = () => {
  const { t } = useTranslation();
  const logos = [
    { component: FarfetchLogo, name: 'Farfetch' },
    { component: MandarinOrientalLogo, name: 'Mandarin Oriental' },
    { component: AldersgateLogo, name: 'Aldersgate' },
    { component: PrimeraLogo, name: 'Primera' },
    { component: AmbassadorHotelLogo, name: 'Ambassador Hotel' },
    { component: BasqueTradeLogo, name: 'Basque Trade & Investment' },
  ];
  
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section id="clients" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">{t('clients.title')}</h2>
          <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
            {t('clients.subtitle')}
          </p>
        </div>
        <div
          className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
        >
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-10 [&_svg]:max-w-none animate-infinite-scroll">
            {duplicatedLogos.map((logo, index) => (
              <li key={index} className="flex-shrink-0">
                <logo.component className="h-10 text-gray-400 hover:text-gray-800 transition-colors duration-300" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 60s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Clients;
