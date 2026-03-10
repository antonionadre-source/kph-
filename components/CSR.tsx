import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { csrImageUrl } from '../assets';

const CSR: React.FC = () => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsContentVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
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

  return (
    <section id="csr" ref={sectionRef} className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div
            className={`md:w-1/2 transition-all duration-1000 ease-out ${
              isContentVisible ? 'opacity-100 translate-x-0 delay-200' : 'opacity-0 translate-x-10'
            }`}
          >
            <img 
              src={csrImageUrl} 
              alt={t('aboutPage.csrImageAlt')}
              loading="lazy"
              className="rounded-lg shadow-2xl w-full h-auto object-cover" 
            />
          </div>
          <div
            className="md:w-1/2"
          >
            <h2 className={`text-4xl font-bold text-gray-800 mb-6 transition-all duration-700 ease-out ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              {t('aboutPage.csrTitle')}
            </h2>
            <p className={`mb-4 text-gray-600 text-base leading-relaxed transition-all duration-700 ease-out ${isContentVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-5'}`}>
              {t('aboutPage.csrP1')}
            </p>
            <p className={`mb-4 text-gray-600 text-base leading-relaxed transition-all duration-700 ease-out ${isContentVisible ? 'opacity-100 translate-y-0 delay-[400ms]' : 'opacity-0 translate-y-5'}`}>
              {t('aboutPage.csrP2')}
            </p>
            <p className={`text-gray-700 text-base leading-relaxed font-semibold italic transition-all duration-700 ease-out ${isContentVisible ? 'opacity-100 translate-y-0 delay-[500ms]' : 'opacity-0 translate-y-5'}`}>
              {t('aboutPage.csrP3')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CSR;
