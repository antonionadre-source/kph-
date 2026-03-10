
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { sustainabilityPartnerLogos, sustainabilityPageImages } from '../assets';
import { LeafIcon } from './icons';

// Custom hook to detect if an element is on screen
const useOnScreen = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Memoize options to prevent infinite loop/re-runs if passed inline
    const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, memoizedOptions);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, memoizedOptions]);

    return [ref, isVisible] as const;
};

const AnimatedCounter = ({ end, duration = 2000, decimals = 0, suffix = '' }: { end: number, duration?: number, decimals?: number, suffix?: string }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Ease out quart
            const ease = 1 - Math.pow(1 - percentage, 4);
            
            setCount(end * ease);

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end); // Ensure exact end value
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, end, duration]);

    return (
        <span ref={ref} className="text-5xl font-bold text-green-600 mb-4 inline-block">
            {count.toFixed(decimals)}{suffix}
        </span>
    );
};

const AnimatedCircularProgress = ({ percentage }: { percentage: number }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isVisible) return;
        
        let startTime: number | null = null;
        const duration = 2000;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const timeElapsed = timestamp - startTime;
            const progressRatio = Math.min(timeElapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progressRatio, 4); // Ease out

            setProgress(percentage * ease);

            if (timeElapsed < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setProgress(percentage);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, percentage]);

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div ref={ref} className="relative w-40 h-40 flex items-center justify-center mb-6">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-gray-100" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
                <circle 
                    className="text-green-500 transition-all duration-75 ease-linear" 
                    strokeWidth="10" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r={radius} 
                    cx="50" 
                    cy="50" 
                />
            </svg>
            <span className="text-4xl font-bold text-green-600">{Math.round(progress)}%</span>
        </div>
    );
};

const SustainabilityPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(0);

  const partnerLogosProcurement = [
    { name: 'Diversey', url: sustainabilityPartnerLogos.diversey },
    { name: 'Steinfels', url: sustainabilityPartnerLogos.steinfels },
    { name: 'Ecolab', url: sustainabilityPartnerLogos.ecolab },
  ];

  const partnerLogosClimate = [
    { name: 'EBP', url: sustainabilityPartnerLogos.ebp },
    { name: 'Climeworks', url: sustainabilityPartnerLogos.climeworks },
  ];

  // Configuration for the scrollable sections
  const sections = [
    {
      id: 'logistics',
      image: sustainabilityPageImages.lowEmissionLogistics,
      titleKey: 'sustainability.page.section1.subsection1.title',
      textKey: 'sustainability.page.section1.subsection1.p2',
      introKey: 'sustainability.page.section1.subtitle',
      logos: partnerLogosProcurement,
      extraContent: (
        <div className="mt-6 p-6 bg-blue-50 rounded-xl border-l-4 border-[#002D5B]">
          <h4 className="font-semibold text-[#002D5B] mb-2">{t('sustainability.page.section1.title')}</h4>
          <p className="text-sm text-gray-600">{t('sustainability.page.section1.subsection1.p1')}</p>
        </div>
      )
    },
    {
      id: 'workforce',
      image: sustainabilityPageImages.wasteReduction,
      titleKey: 'sustainability.page.section1.subsection2.title',
      textKey: 'sustainability.page.section1.subsection2.p2',
      introKey: null,
      logos: [],
      extraContent: (
        <div className="mt-6">
             <p className="text-gray-600 mb-4">{t('sustainability.page.section1.subsection2.p1')}</p>
             <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                {t('sustainability.page.section1.subsection2.p3')}
             </div>
        </div>
      )
    },
    {
      id: 'measurement',
      image: sustainabilityPageImages.carbonFootprint,
      titleKey: 'sustainability.page.section2.subsection1.title',
      textKey: 'sustainability.page.section2.subsection1.p1',
      introKey: 'sustainability.page.section2.subtitle',
      logos: partnerLogosClimate,
      extraContent: (
        <ul className="mt-6 space-y-4">
            <li className="flex items-start">
                <span className="text-green-500 mr-2">✔</span>
                <span className="text-gray-600 text-sm">{t('sustainability.page.section2.subsection1.p2')}</span>
            </li>
            <li className="flex items-start">
                <span className="text-green-500 mr-2">✔</span>
                <span className="text-gray-600 text-sm">{t('sustainability.page.section2.subsection1.p3')}</span>
            </li>
             <li className="flex items-start">
                <span className="text-green-500 mr-2">✔</span>
                <span className="text-gray-600 text-sm">{t('sustainability.page.section2.p1')}</span>
            </li>
        </ul>
      )
    },
    {
      id: 'waste',
      image: sustainabilityPageImages.workforceProximity,
      titleKey: 'sustainability.page.section3.title',
      textKey: 'sustainability.page.section3.subsection1.p1',
      introKey: null,
      logos: [],
      extraContent: (
         <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-bold text-gray-800 text-sm mb-1">{t('sustainability.page.section3.subsection2.title')}</h5>
                <p className="text-xs text-gray-600">{t('sustainability.page.section3.subsection2.p1')}</p>
            </div>
             <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-bold text-gray-800 text-sm mb-1">{t('sustainability.page.section3.subsection3.title')}</h5>
                <p className="text-xs text-gray-600">{t('sustainability.page.section3.subsection3.p2')}</p>
            </div>
             <div className="flex items-center mt-4">
                 <img src={sustainabilityPartnerLogos.suva} alt="Suva" className="h-12 w-auto mr-4 opacity-80 grayscale hover:grayscale-0 transition-all" />
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('sustainability.page.compliance')}</span>
            </div>
         </div>
      )
    }
  ];

  // Intersection Observer to detect active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex((section) => section.id === entry.target.id);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px', // Trigger when the section is in the middle of the viewport
        threshold: 0.2,
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);


  return (
    <main className="bg-white text-gray-800">
      {/* Hero / Intro Section */}
      <div className="pt-40 pb-16 md:pt-52 md:pb-24 bg-emerald-50/50">
        <div className="container mx-auto px-6 max-w-5xl text-center">
           <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-sm font-bold tracking-wide uppercase mb-6 animate-fade-in-up flex items-center justify-center gap-2 w-fit mx-auto">
             <LeafIcon className="w-4 h-4" />
             Sustainability Report
           </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#002D5B] mb-8 tracking-tight animate-fade-in-up animation-delay-100">
            {t('sustainability.page.title')}
          </h1>
        </div>
      </div>

      {/* Sticky Split Layout - Operational Sustainability */}
      <div className="relative w-full border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Column: Scrollable Content */}
            <div className="lg:w-1/2 lg:pr-16 pb-24">
              {sections.map((section, index) => (
                <div 
                    key={section.id} 
                    id={section.id} 
                    className={`min-h-screen flex flex-col justify-center py-12 transition-opacity duration-500 ${activeSection === index ? 'opacity-100' : 'lg:opacity-40'}`}
                >
                    {/* Mobile Image (Visible only on small screens) */}
                    <div className="lg:hidden mb-8 rounded-2xl overflow-hidden shadow-lg bg-white">
                        <img 
                          src={section.image} 
                          alt="Visual representation" 
                          className="w-full h-auto object-contain max-h-[450px]" 
                        />
                    </div>

                    {section.introKey && (
                         <span className="text-green-600 font-bold text-sm uppercase tracking-wider mb-2 block">{t(section.introKey)}</span>
                    )}
                  
                  <h2 className="text-3xl md:text-5xl font-bold text-[#002D5B] mb-6 leading-tight">
                    {t(section.titleKey)}
                  </h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {t(section.textKey)}
                  </p>

                  {/* Logos Grid */}
                  {section.logos.length > 0 && (
                    <div className="mb-8">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Key Partners</p>
                        <div className="flex flex-wrap gap-6 items-center">
                            {section.logos.map((logo) => (
                                <img 
                                    key={logo.name} 
                                    src={logo.url} 
                                    alt={`${logo.name} logo`} 
                                    className="h-10 md:h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
                                />
                            ))}
                        </div>
                    </div>
                  )}

                  {/* Extra Content (Subsections, lists, etc.) */}
                  {section.extraContent}
                </div>
              ))}
            </div>

            {/* Right Column: Sticky Visuals (Hidden on mobile) */}
            <div className="hidden lg:block lg:w-1/2 relative">
              <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="relative w-full h-[85vh]">
                   {sections.map((section, index) => (
                       <div 
                            key={section.id}
                            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform flex items-center justify-center ${
                                activeSection === index 
                                ? 'opacity-100 translate-y-0 scale-100 z-10' 
                                : activeSection > index 
                                    ? 'opacity-0 -translate-y-10 scale-95 z-0' // Previous items slide up
                                    : 'opacity-0 translate-y-10 scale-105 z-0'  // Next items slide down
                            }`}
                       >
                           <img 
                                src={section.image} 
                                alt={t(section.titleKey)} 
                                className="w-full h-full object-contain rounded-2xl drop-shadow-2xl" 
                           />
                       </div>
                   ))}
                </div>
                
                {/* Progress Indicator */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 mr-[-20px] z-20">
                    {sections.map((_, index) => (
                        <div 
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === index ? 'bg-[#002D5B] scale-150' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- NEW SECTION: Digital Sustainability / Low Emission Website --- */}
      <section className="py-24 bg-[#ebf5fa]">
        <div className="container mx-auto px-6">
            
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-[#002D5B] mb-6">{t('sustainability.digital.title')}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    {t('sustainability.digital.subtitle')}
                </p>
                <div className="text-sm font-semibold text-gray-500 mt-2">
                    {t('sustainability.digital.testedOn')}
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                
                {/* Score Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">{t('sustainability.digital.scoreTitle')}</h3>
                    <AnimatedCircularProgress percentage={91} />
                    <p className="text-gray-600 text-sm max-w-xs">{t('sustainability.digital.scoreDesc')}</p>
                </div>

                {/* Combined Stats Card */}
                <div className="flex flex-col gap-8">
                    {/* Emissions */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl flex-1 flex flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('sustainability.digital.co2Title')}</h3>
                        <AnimatedCounter end={0.61} decimals={2} suffix=" g" />
                        <p className="text-gray-600 text-sm max-w-xs">{t('sustainability.digital.co2Desc')}</p>
                    </div>
                    {/* Weight */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl flex-1 flex flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('sustainability.digital.weightTitle')}</h3>
                        <AnimatedCounter end={1.74} decimals={2} suffix=" MB" />
                        <p className="text-gray-600 text-sm max-w-xs">{t('sustainability.digital.weightDesc')}</p>
                    </div>
                </div>
            </div>

            {/* Green Badge Banner */}
            <div className="max-w-5xl mx-auto bg-green-600 text-white rounded-2xl p-6 md:p-8 text-center shadow-lg mb-20 transform hover:-translate-y-1 transition-transform">
                <p className="text-lg md:text-xl font-medium">
                    {t('sustainability.digital.badgeText')}
                </p>
            </div>

            {/* Real World Impact Section */}
            <div className="max-w-6xl mx-auto">
                <h3 className="text-3xl font-bold text-[#002D5B] text-center mb-12">
                    {t('sustainability.digital.impactTitle')}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Waste */}
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col items-start group">
                        <div className="mb-4 text-5xl bg-gray-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            🗑️
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">{t('sustainability.impact.wasteTitle')}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{t('sustainability.impact.wasteDesc')}</p>
                    </div>

                    {/* Card 2: Coffee */}
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col items-start group">
                        <div className="mb-4 text-5xl bg-[#fdf2e9] w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            ☕
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">{t('sustainability.impact.coffeeTitle')}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{t('sustainability.impact.coffeeDesc')}</p>
                    </div>

                    {/* Card 3: Electricity */}
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col items-start group">
                        <div className="mb-4 text-5xl bg-yellow-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            💡
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">{t('sustainability.impact.electricityTitle')}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{t('sustainability.impact.electricityDesc')}</p>
                    </div>

                    {/* Card 4: Trees */}
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col items-start group">
                        <div className="mb-4 text-5xl bg-green-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            🌳
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">{t('sustainability.impact.treeTitle')}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{t('sustainability.impact.treeDesc')}</p>
                    </div>

                    {/* Card 5: EV Charging */}
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col items-start group">
                        <div className="mb-4 text-5xl bg-blue-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            🚗
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">{t('sustainability.impact.evTitle')}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{t('sustainability.impact.evDesc')}</p>
                    </div>

                    {/* Card 6: Oven */}
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col items-start group">
                        <div className="mb-4 text-5xl bg-orange-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            🔌
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">{t('sustainability.impact.ovenTitle')}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{t('sustainability.impact.ovenDesc')}</p>
                    </div>
                </div>
            </div>

        </div>
      </section>

      <style>{`
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default SustainabilityPage;
