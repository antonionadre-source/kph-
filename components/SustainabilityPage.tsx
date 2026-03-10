
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { sustainabilityPartnerLogos, sustainabilityPageImages } from '../assets';
import { LeafIcon } from './icons';

// Custom hook to detect if an element is on screen
const useOnScreen = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

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
            const ease = 1 - Math.pow(1 - percentage, 4);
            setCount(end * ease);
            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, end, duration]);

    return (
        <span ref={ref} className="text-4xl md:text-5xl font-black text-green-600 mb-2 md:mb-4 inline-block">
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
            const ease = 1 - Math.pow(1 - progressRatio, 4);
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
        <div ref={ref} className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mb-6">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-gray-100" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
                <circle 
                    className="text-green-500 transition-all duration-75 ease-linear" 
                    strokeWidth="8" 
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
            <span className="text-3xl md:text-4xl font-black text-green-600">{Math.round(progress)}%</span>
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

  const sections = [
    {
      id: 'logistics',
      image: sustainabilityPageImages.lowEmissionLogistics,
      titleKey: 'sustainability.page.section1.subsection1.title',
      textKey: 'sustainability.page.section1.subsection1.p2',
      introKey: 'sustainability.page.section1.subtitle',
      logos: partnerLogosProcurement,
      extraContent: (
        <div className="mt-6 p-6 bg-blue-50 rounded-2xl border-l-4 border-[#002D5B]">
          <h4 className="font-black text-[#002D5B] text-sm mb-2 uppercase tracking-tight">{t('sustainability.page.section1.title')}</h4>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">{t('sustainability.page.section1.subsection1.p1')}</p>
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
             <p className="text-gray-600 mb-6 font-medium leading-relaxed">{t('sustainability.page.section1.subsection2.p1')}</p>
             <div className="inline-block bg-green-100 text-green-800 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest">
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
            {[1, 2, 3].map(i => (
                <li key={i} className="flex items-start bg-slate-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-green-500 mr-3 text-lg font-black">✔</span>
                    <span className="text-gray-700 text-sm font-bold leading-snug">{t(`sustainability.page.section2.${i === 1 ? 'subsection1.p2' : i === 2 ? 'subsection1.p3' : 'p1'}`)}</span>
                </li>
            ))}
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
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h5 className="font-black text-gray-800 text-sm mb-2 uppercase tracking-tight">{t('sustainability.page.section3.subsection2.title')}</h5>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{t('sustainability.page.section3.subsection2.p1')}</p>
            </div>
             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h5 className="font-black text-gray-800 text-sm mb-2 uppercase tracking-tight">{t('sustainability.page.section3.subsection3.title')}</h5>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{t('sustainability.page.section3.subsection3.p2')}</p>
            </div>
             <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 p-4 bg-white rounded-2xl shadow-sm">
                 <img src={sustainabilityPartnerLogos.suva} alt="Suva" className="h-10 w-auto opacity-80 grayscale hover:grayscale-0 transition-all" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('sustainability.page.compliance')}</span>
            </div>
         </div>
      )
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex((section) => section.id === entry.target.id);
            if (index !== -1) setActiveSection(index);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0.2 }
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
           <span className="inline-flex py-1.5 px-4 rounded-full bg-green-100 text-green-700 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-8 animate-fade-in-up items-center justify-center gap-2 w-fit mx-auto shadow-sm">
             <LeafIcon className="w-3.5 h-3.5" />
             2025 Sustainability Report
           </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#002D5B] mb-8 tracking-tighter animate-fade-in-up animation-delay-100 leading-[0.9]">
            {t('sustainability.page.title')}
          </h1>
        </div>
      </div>

      {/* Sticky Split Layout - Operational Sustainability */}
      <div className="relative w-full border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
            
            {/* Left Column: Content */}
            <div className="lg:w-1/2 lg:pr-16 pb-24 md:pb-32">
              {sections.map((section, index) => (
                <div 
                    key={section.id} 
                    id={section.id} 
                    className={`min-h-[70vh] lg:min-h-screen flex flex-col justify-center py-16 transition-opacity duration-500 ${activeSection === index ? 'opacity-100' : 'lg:opacity-40'}`}
                >
                    {/* Tablet/Mobile Image */}
                    <div className="lg:hidden mb-10 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-gray-100">
                        <img 
                          src={section.image} 
                          alt="Visual representation" 
                          className="w-full h-auto object-cover max-h-[500px]" 
                        />
                    </div>

                    {section.introKey && (
                         <span className="text-green-600 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 block">{t(section.introKey)}</span>
                    )}
                  
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-[#002D5B] mb-8 leading-[1.1] tracking-tight uppercase">
                    {t(section.titleKey)}
                  </h2>
                  
                  <p className="text-base md:text-xl text-gray-500 leading-relaxed mb-10 font-medium">
                    {t(section.textKey)}
                  </p>

                  {/* Logos Grid */}
                  {section.logos.length > 0 && (
                    <div className="mb-10 p-6 bg-slate-50 rounded-3xl border border-gray-100">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Strategic Supply Partners</p>
                        <div className="flex flex-wrap justify-center gap-8 items-center">
                            {section.logos.map((logo) => (
                                <img 
                                    key={logo.name} 
                                    src={logo.url} 
                                    alt={`${logo.name} logo`} 
                                    className="h-8 md:h-10 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110" 
                                />
                            ))}
                        </div>
                    </div>
                  )}

                  {section.extraContent}
                </div>
              ))}
            </div>

            {/* Right Column: Sticky Visuals (Hidden on small screens) */}
            <div className="hidden lg:block lg:w-1/2 relative">
              <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="relative w-full h-[80vh]">
                   {sections.map((section, index) => (
                       <div 
                            key={section.id}
                            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform flex items-center justify-center ${
                                activeSection === index 
                                ? 'opacity-100 translate-y-0 scale-100 z-10' 
                                : activeSection > index 
                                    ? 'opacity-0 -translate-y-20 scale-90 z-0' 
                                    : 'opacity-0 translate-y-20 scale-110 z-0'
                            }`}
                       >
                           <img 
                                src={section.image} 
                                alt={t(section.titleKey)} 
                                className="w-full h-full object-contain rounded-[3rem] drop-shadow-3xl" 
                           />
                       </div>
                   ))}
                </div>
                
                {/* Progress Indicators */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 mr-[-20px] z-20">
                    {sections.map((_, index) => (
                        <div 
                            key={index}
                            className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${activeSection === index ? 'bg-[#002D5B] border-[#002D5B] scale-[1.7]' : 'bg-transparent border-gray-200'}`}
                        />
                    ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- Digital Sustainability Section --- */}
      <section className="py-24 md:py-32 bg-[#f8fbff]">
        <div className="container mx-auto px-4 md:px-6">
            
            <div className="text-center mb-20 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black text-[#002D5B] mb-8 uppercase tracking-tighter leading-tight">{t('sustainability.digital.title')}</h2>
                <p className="text-base md:text-xl text-gray-500 font-bold leading-relaxed mb-4">
                    {t('sustainability.digital.subtitle')}
                </p>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-50 py-1.5 px-4 rounded-full w-fit mx-auto">
                    {t('sustainability.digital.testedOn')}
                </div>
            </div>

            {/* Metrics Cards - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                
                {/* Score Card */}
                <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl flex flex-col items-center justify-center text-center transform hover:scale-[1.02] transition-transform duration-500 border border-gray-100">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10">{t('sustainability.digital.scoreTitle')}</h3>
                    <AnimatedCircularProgress percentage={91} />
                    <p className="text-gray-600 text-sm font-bold max-w-xs leading-relaxed">{t('sustainability.digital.scoreDesc')}</p>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Emissions Card */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl flex-1 flex flex-col items-center justify-center text-center border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">{t('sustainability.digital.co2Title')}</h3>
                        <AnimatedCounter end={0.61} decimals={2} suffix=" g" />
                        <p className="text-gray-600 text-xs font-bold max-w-xs">{t('sustainability.digital.co2Desc')}</p>
                    </div>
                    {/* Weight Card */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl flex-1 flex flex-col items-center justify-center text-center border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">{t('sustainability.digital.weightTitle')}</h3>
                        <AnimatedCounter end={1.74} decimals={2} suffix=" MB" />
                        <p className="text-gray-600 text-xs font-bold max-w-xs">{t('sustainability.digital.weightDesc')}</p>
                    </div>
                </div>
            </div>

            {/* Green Badge Banner */}
            <div className="max-w-5xl mx-auto bg-[#002D5B] text-white rounded-[2.5rem] p-8 md:p-12 text-center shadow-3xl mb-32 relative overflow-hidden group">
                <div className="absolute inset-0 bg-green-600 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"></div>
                <p className="text-xl md:text-3xl font-black uppercase tracking-tighter relative z-10">
                    {t('sustainability.digital.badgeText')}
                </p>
            </div>

            {/* Real World Impact Section - Responsive Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-16 justify-center">
                    <div className="h-px flex-1 bg-gray-200 max-w-[100px]"></div>
                    <h3 className="text-2xl md:text-4xl font-black text-[#002D5B] text-center uppercase tracking-tight">
                        Carbon Benchmarking
                    </h3>
                    <div className="h-px flex-1 bg-gray-200 max-w-[100px]"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { emoji: '🗑️', color: 'bg-slate-50', titleKey: 'sustainability.impact.wasteTitle', descKey: 'sustainability.impact.wasteDesc' },
                        { emoji: '☕', color: 'bg-[#fdf2e9]', titleKey: 'sustainability.impact.coffeeTitle', descKey: 'sustainability.impact.coffeeDesc' },
                        { emoji: '💡', color: 'bg-yellow-50', titleKey: 'sustainability.impact.electricityTitle', descKey: 'sustainability.impact.electricityDesc' },
                        { emoji: '🌳', color: 'bg-green-50', titleKey: 'sustainability.impact.treeTitle', descKey: 'sustainability.impact.treeDesc' },
                        { emoji: '🚗', color: 'bg-blue-50', titleKey: 'sustainability.impact.evTitle', descKey: 'sustainability.impact.evDesc' },
                        { emoji: '🔌', color: 'bg-orange-50', titleKey: 'sustainability.impact.ovenTitle', descKey: 'sustainability.impact.ovenDesc' },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center group border border-gray-50 transform hover:-translate-y-2">
                            <div className={`mb-8 text-6xl ${item.color} w-24 h-24 flex items-center justify-center rounded-[2rem] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner`}>
                                {item.emoji}
                            </div>
                            <h4 className="font-black text-xl text-gray-800 mb-3 uppercase tracking-tight">{t(item.titleKey)}</h4>
                            <p className="text-gray-500 text-sm font-bold leading-relaxed">{t(item.descKey)}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </section>

      <style>{`
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .shadow-3xl {
            box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </main>
  );
};

export default SustainabilityPage;
