import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { teamPhotoUrl } from '../assets';

const About: React.FC = () => {
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
        threshold: 0.2, // Trigger when 20% of the section is visible
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
    <section id="about" ref={sectionRef} className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div
            className={`md:w-1/2 transition-all duration-1000 ease-out ${
              isContentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <img 
              src={teamPhotoUrl}
              alt="The Kraken Facilities Management team" 
              className="rounded-lg shadow-2xl w-full h-auto object-cover"
            />
          </div>
          <div
            className="md:w-1/2"
          >
            <h2 className={`text-4xl font-bold text-gray-800 mb-6 transition-all duration-700 ease-out ${isContentVisible ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-5'}`}>
              {t('about.title')}
            </h2>
            <p className={`mb-4 text-gray-600 text-base leading-relaxed transition-all duration-700 ease-out ${isContentVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-5'}`}>
              {t('about.p1')}
            </p>
            <p className={`mb-4 text-gray-600 text-base leading-relaxed transition-all duration-700 ease-out ${isContentVisible ? 'opacity-100 translate-y-0 delay-[400ms]' : 'opacity-0 translate-y-5'}`}>
              {t('about.p2')}
            </p>
            <a href="#contact" className={`inline-block mt-4 text-[#002D5B] font-semibold hover:underline transition-all duration-700 ease-out ${isContentVisible ? 'opacity-100 translate-y-0 delay-[500ms]' : 'opacity-0 translate-y-5'}`}>
              {t('about.cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;