import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { operationMapUrl } from '../assets';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from './icons';

const ContactMap: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Seewaldstrasse+3,+8203+Schaffhausen';
  const address = 'Seewaldstrasse 3, 8203 Schaffhausen';
  const phone = '+41 77 207 69 47';
  const email = 'Sales@krakenfm.co';

  return (
    <section ref={sectionRef} className="py-20 bg-slate-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">{t('contactMap.title')}</h2>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-12 bg-white p-8 rounded-xl shadow-lg">
          <div className={`lg:w-1/2 w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300">
              <img src={operationMapUrl} alt="Map of operation areas: Schaffhausen and Zurich" className="w-full h-auto object-cover" />
            </a>
          </div>
          <div className={`lg:w-1/2 w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0 delay-200' : 'opacity-0 translate-x-10'}`}>
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-[#E9F1F7] text-[#002D5B] rounded-full flex items-center justify-center mr-4">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{t('contactMap.address')}</h3>
                  <p className="text-gray-600">{address}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-[#E9F1F7] text-[#002D5B] rounded-full flex items-center justify-center mr-4">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{t('contactMap.phone')}</h3>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-[#002D5B] hover:underline">{phone}</a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-[#E9F1F7] text-[#002D5B] rounded-full flex items-center justify-center mr-4">
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{t('contactMap.email')}</h3>
                  <a href={`mailto:${email}`} className="text-[#002D5B] hover:underline">{email}</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
