import React, { useState, useEffect, useRef } from 'react';
import { BuildingIcon, ShieldCheckIcon, WrenchScrewdriverIcon, LeafIcon } from './icons';
import { useTranslation } from '../i18n';

interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface ServiceCardProps extends Service {
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  
  return (
    <div
      ref={cardRef}
      className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mb-6 bg-[#E9F1F7] text-[#002D5B] w-16 h-16 rounded-full flex items-center justify-center">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
};

const Services: React.FC = () => {
  const { t } = useTranslation();

  const services: Service[] = [
    {
      icon: BuildingIcon,
      title: t('services.card1.title'),
      description: t('services.card1.description')
    },
    {
      icon: WrenchScrewdriverIcon,
      title: t('services.card2.title'),
      description: t('services.card2.description')
    },
    {
      icon: ShieldCheckIcon,
      title: t('services.card3.title'),
      description: t('services.card3.description')
    },
    {
      icon: LeafIcon,
      title: t('services.card4.title'),
      description: t('services.card4.description')
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">{t('services.title')}</h2>
          <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">{t('services.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
