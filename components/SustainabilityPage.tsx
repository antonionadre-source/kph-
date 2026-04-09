
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../i18n';
import { sustainabilityPartnerLogos, sustainabilityPageImages, sustainabilityImage1Url, sustainabilityImage2Url, cityImages } from '../assets';
import { LeafIcon, PaperAirplaneIcon, StarIcon } from './icons';

interface SustainabilityPageProps {
  onNavigate: (page: string) => void;
}

const BeforeAfterCard: React.FC<{ transformation: any }> = ({ transformation }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing) return;
    const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - container.left) / container.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div className="group relative bg-white overflow-hidden border-r border-gray-100 h-full">
      <div 
        className="relative aspect-[4/5] md:aspect-[3/5] cursor-ew-resize select-none overflow-hidden"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        onMouseDown={() => setIsResizing(true)}
        onMouseUp={() => setIsResizing(false)}
        onMouseLeave={() => setIsResizing(false)}
        onTouchStart={() => setIsResizing(true)}
        onTouchEnd={() => setIsResizing(false)}
      >
        <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Live Analysis</span>
          </div>
          <div className="text-[10px] font-mono text-white/30">
            REF_ID: KRAKEN_{String(transformation.id).toUpperCase()}
          </div>
        </div>
        <img 
          src={transformation.after} 
          alt="Clean Property" 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-white/50 backdrop-blur-sm"
          style={{ width: `${sliderPos}%` }}
        >
          <img 
            src={transformation.before} 
            alt="Dirty Surface" 
            className="absolute inset-0 w-full h-full object-cover grayscale"
            style={{ width: `${100 / (sliderPos / 100)}%` }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-8 left-8 bg-[#002d5b]/80 backdrop-blur-xl text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-white/10">
            Before
          </div>
        </div>
        <div className="absolute top-8 right-8 bg-emerald-600/80 backdrop-blur-xl text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-white/10">
          After
        </div>
        <div 
          className="absolute top-0 bottom-0 w-px bg-white/50 cursor-ew-resize z-20"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_0_30px_rgba(0,0,0,0.3)] flex items-center justify-center border border-gray-100">
            <div className="flex gap-1">
              <div className="w-0.5 h-3 bg-[#002d5b] rounded-full" />
              <div className="w-0.5 h-3 bg-[#002d5b] rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-10 bg-white">
        <div className="flex items-center gap-3 mb-4">
           <span className="w-8 h-px bg-emerald-600"></span>
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Quality Assurance</span>
        </div>
        <h4 className="text-3xl font-black text-[#002d5b] mb-4 leading-none tracking-tighter uppercase">{transformation.title}</h4>
        <p className="text-gray-500 text-base font-bold leading-relaxed">{transformation.description}</p>
      </div>
    </div>
  );
};

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

const SustainabilityPage: React.FC<SustainabilityPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(0);
  const testimonials = useMemo(() => [
    {
      id: 1,
      name: t('sustainability.testimonials.sarah.name'),
      role: t('sustainability.testimonials.sarah.role'),
      text: t('sustainability.testimonials.sarah.text'),
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
      rating: 5
    },
    {
      id: 2,
      name: t('sustainability.testimonials.marc.name'),
      role: t('sustainability.testimonials.marc.role'),
      text: t('sustainability.testimonials.marc.text'),
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
      rating: 5
    },
    {
      id: 3,
      name: t('sustainability.testimonials.elena.name'),
      role: t('sustainability.testimonials.elena.role'),
      text: t('sustainability.testimonials.elena.text'),
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
      rating: 5
    }
  ], [t]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const transformations = useMemo(() => [
    {
      id: 1,
      title: t('sustainability.transformations.residential.title'),
      before: "https://www.dropbox.com/scl/fi/gvgegbqftjfd0ap0ft4fr/Gemini_Generated_Image_w5pv1aw5pv1aw5pv.png?rlkey=n7tb5wyqci9rvrjagquyerdeg&st=f3xvlrh8&raw=1",
      after: "https://www.dropbox.com/scl/fi/x1ea3z8v6x4nl0lg6uegz/Gemini_Generated_Image_1kgnkr1kgnkr1kgn.png?rlkey=7x72ci65npuf1vlas1lr24b59&st=13cdffuj&raw=1",
      description: t('sustainability.transformations.residential.desc')
    },
    {
      id: 2,
      title: t('sustainability.transformations.industrial.title'),
      before: "https://www.dropbox.com/scl/fi/zhjylll60zkbvr63xtduv/Gemini_Generated_Image_fc6ltffc6ltffc6l.png?rlkey=6b80jb4hlva07arhzmhge3far&st=zogt36sm&raw=1",
      after: "https://www.dropbox.com/scl/fi/pmi5i9yxf80bo13kqkwsa/Gemini_Generated_Image_3y310w3y310w3y31.png?rlkey=k2752ph6nabk8ampqpqf481u7&st=esjtnlrm&raw=1",
      description: t('sustainability.transformations.industrial.desc')
    },
    {
      id: 3,
      title: t('sustainability.transformations.restroom.title'),
      before: "https://www.dropbox.com/scl/fi/37kovpd7avdbz3ytqwtpv/Gemini_Generated_Image_4pxkzy4pxkzy4pxk.png?rlkey=ocr7pm9wxo17fz7383ko36dm4&st=1hfjrxgf&raw=1",
      after: "https://www.dropbox.com/scl/fi/4alau781e7n0grnyw77nx/Gemini_Generated_Image_j2vevdj2vevdj2ve.png?rlkey=vjb944mq8k89qxa9w7nzc8otc&st=ncnlphtm&raw=1",
      description: t('sustainability.transformations.restroom.desc')
    },
    {
      id: 4,
      title: t('sustainability.transformations.facade.title'),
      before: "https://www.dropbox.com/scl/fi/iozk403nyj9mj8z0cpwxp/Gemini_Generated_Image_djw9s8djw9s8djw9.png?rlkey=2ijnam33xjfoyy8oib0d20fv6&st=6ha3b4t1&raw=1",
      after: "https://www.dropbox.com/scl/fi/f0jb75lr5ahzotcbsyqe8/Gemini_Generated_Image_phi5tvphi5tvphi5.png?rlkey=816j3qdbgbdkk1bapiw57rboa&st=994aaw85&raw=1",
      description: t('sustainability.transformations.facade.desc')
    }
  ], [t]);

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
      id: 'bcorp',
      image: sustainabilityImage1Url,
      titleKey: 'sustainability.bcorp.title',
      textKey: 'sustainability.bcorp.p1',
      introKey: 'sustainability.section.title',
      logos: [
        { name: 'B Corp', url: 'https://i.ibb.co/chcNffCj/diversey-logo.png' },
      ],
      extraContent: (
        <div className="mt-6 p-6 bg-green-50 rounded-2xl border-l-4 border-green-500">
          <p className="text-sm text-gray-600 font-medium leading-relaxed">{t('sustainability.bcorp.p2')}</p>
        </div>
      )
    },
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
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-[#002D5B] mb-8 tracking-tighter animate-fade-in-up animation-delay-100 leading-[0.9]">
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
                  
                  <h2 className="text-3xl md:text-6xl font-black text-[#002D5B] mb-8 leading-[1.1] tracking-tight uppercase">
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

      {/* --- Local Partnership Section (Moved from Home) --- */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 z-0 bg-dots-pattern opacity-40"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
            <div className="md:w-1/2 relative group">
               <div className="absolute -inset-4 bg-gradient-to-l from-blue-100 to-green-50 rounded-xl transform rotate-2 opacity-70 group-hover:-rotate-1 transition-transform duration-500"></div>
               <img 
                src={sustainabilityImage2Url} 
                alt="Hand holding a small plant" 
                className="relative rounded-lg shadow-xl w-full h-auto object-cover transform transition-transform duration-500 hover:scale-[1.02]"
                referrerPolicy="no-referrer"
               />
            </div>
            <div className="md:w-1/2">
              <span className="text-green-600 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 block">Swiss Impact</span>
              <h3 className="text-3xl md:text-6xl font-black text-[#002D5B] mb-8 leading-[0.9] tracking-tighter uppercase">
                {t('sustainability.local.title')}
              </h3>
              <p className="text-xl text-gray-600 mb-8 font-bold leading-tight">
                {t('sustainability.local.p1')}
              </p>
              <p className="text-lg text-gray-500 leading-relaxed font-medium">
                {t('sustainability.local.p2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Operational Network Section (Moved from Home) --- */}
      <section className="py-24 bg-[#001A3D] overflow-hidden border-t border-blue-900/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="text-blue-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 block">Strategic Network</span>
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase">
                Our Triad of <br/>
                <span className="text-blue-500/80">Operational Excellence.</span>
              </h2>
              <p className="text-xl text-blue-100/60 font-bold leading-tight mb-10">
                Winterthur. Zurich. Schaffhausen. Three key pillars defining our Swiss precision and rapid response across the northern plateau.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {['Zurich', 'Winterthur', 'Schaffhausen'].map((city) => (
                  <div key={city} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                    <h4 className="text-white font-black text-lg mb-1">{city}</h4>
                    <p className="text-blue-300/60 text-[10px] font-black uppercase tracking-widest">Active Hub</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
               {/* Reusing the "3" visual logic from OperationsSection but simplified for this page */}
               <div className="relative w-full max-w-[400px] aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="relative h-full w-full flex items-center justify-center">
                    <span className="text-[20rem] font-black text-white/10 leading-none select-none">3</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="grid grid-cols-2 gap-4 p-4">
                          <img src={cityImages.zurich} alt="Zurich" className="w-32 h-32 object-cover rounded-2xl shadow-2xl border border-white/10" referrerPolicy="no-referrer" />
                          <img src={cityImages.winterthur} alt="Winterthur" className="w-32 h-32 object-cover rounded-2xl shadow-2xl border border-white/10 mt-8" referrerPolicy="no-referrer" />
                          <img src={cityImages.schaffhausen} alt="Schaffhausen" className="w-32 h-32 object-cover rounded-2xl shadow-2xl border border-white/10 -mt-8" referrerPolicy="no-referrer" />
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left Column: Text Content */}
            <div className="text-left">
              <div className="flex items-center gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">{t('sustainability.success.badge')}</span>
                </motion.div>
                <div className="h-px flex-grow bg-gradient-to-r from-blue-100 to-transparent"></div>
              </div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-9xl font-black text-[#002d5b] mb-12 leading-[0.82] tracking-tighter uppercase"
              >
                {t('sustainability.success.title').split('.')[0]} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                  {t('sustainability.success.title').split('.')[1]}
                </span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl text-gray-500 mb-16 max-w-lg font-bold leading-tight"
              >
                {t('sustainability.success.desc')}
              </motion.p>

              <div className="grid grid-cols-2 gap-8 mb-16">
                <div>
                  <p className="text-4xl font-black text-[#002d5b] mb-1 tracking-tighter">98%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('sustainability.success.retention')}</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-emerald-600 mb-1 tracking-tighter">24/7</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('sustainability.success.support')}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('consultation')}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#002d5b] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 transition-all"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  {t('sustainability.success.cta')}
                </motion.button>
              </div>
            </div>

            {/* Right Column: Shuffling Testimonials Stack */}
            <div className="relative h-[650px] flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] h-[550px]">
                <AnimatePresence mode="popLayout">
                  {testimonials.map((testimonial, i) => {
                    const isTop = i === index;
                    const isNext = i === (index + 1) % testimonials.length;
                    const isThird = i === (index + 2) % testimonials.length;
                    
                    if (!isTop && !isNext && !isThird) return null;

                    let zIndex = 0;
                    let translateY = 0;
                    let scale = 1;
                    let opacity = 1;
                    let rotate = 0;

                    if (isTop) {
                      zIndex = 30;
                    } else if (isNext) {
                      zIndex = 20;
                      translateY = 20;
                      scale = 0.95;
                      opacity = 0.6;
                      rotate = -2;
                    } else if (isThird) {
                      zIndex = 10;
                      translateY = 40;
                      scale = 0.9;
                      opacity = 0.3;
                      rotate = -4;
                    }

                    return (
                      <motion.div
                        key={testimonial.id}
                        style={{ zIndex, position: 'absolute', top: 0, left: 0, width: '100%' }}
                        initial={isTop ? { x: 300, opacity: 0, rotate: 15 } : false}
                        animate={{ 
                          x: 0, 
                          y: translateY, 
                          scale, 
                          opacity, 
                          rotate,
                          transition: { duration: 0.8, type: "spring", bounce: 0.3 }
                        }}
                        exit={{ 
                          x: -300, 
                          opacity: 0, 
                          rotate: -15,
                          transition: { duration: 0.5 }
                        }}
                        className="bg-white p-8 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,45,91,0.12)] border border-gray-100"
                      >
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg z-20">
                          <span className="text-white text-3xl font-serif">“</span>
                        </div>

                        <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] mb-6 group/img">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#002d5b]/90 via-transparent to-transparent" />
                          <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-[8px] font-black text-white uppercase tracking-widest">{t('sustainability.success.verified')}</span>
                          </div>
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex gap-1 mb-3">
                              {[...Array(testimonial.rating)].map((_, starI) => (
                                <StarIcon key={starI} className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                              ))}
                            </div>
                            <p className="text-white font-black text-2xl mb-1 tracking-tighter uppercase">{testimonial.name}</p>
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-lg font-bold italic leading-relaxed px-2">
                          "{testimonial.text}"
                        </p>
                        {isTop && (
                          <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              key={testimonial.id}
                              transition={{ duration: 5, ease: "linear" }}
                              className="h-full bg-blue-600"
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Before & After Results Section --- */}
      <section className="py-24 md:py-32 bg-white overflow-hidden border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 mb-24">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-8"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">{t('sustainability.standard.badge')}</span>
              </motion.div>
              <h2 className="text-5xl md:text-[8rem] xl:text-[9rem] font-black text-[#002d5b] leading-[0.85] tracking-tighter uppercase">
                {t('sustainability.standard.title').split('.')[0]} <br />
                <span className="text-emerald-600">{t('sustainability.standard.title').split('.')[1]}</span>
              </h2>
            </div>
            <div className="max-w-md lg:pt-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-gray-200" />
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">{t('sustainability.standard.visual')}</p>
              </div>
              <p className="text-gray-500 font-bold text-xl md:text-2xl leading-tight">
                {t('sustainability.standard.desc')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,45,91,0.15)] rounded-[4rem] overflow-hidden bg-white">
            {transformations.map((transformation, i) => (
              <motion.div
                key={transformation.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="relative"
              >
                <BeforeAfterCard transformation={transformation} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-30 grayscale">
             <img src="https://i.ibb.co/chcNffCj/diversey-logo.png" alt="Partner" className="h-8 w-auto object-contain" />
             <div className="h-8 w-px bg-gray-300"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] self-center">{t('sustainability.standard.certified')}</span>
             <div className="h-8 w-px bg-gray-300"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] self-center">{t('sustainability.standard.bcorp')}</span>
          </div>
        </div>
      </section>

      {/* --- Dedicated B Corp Section --- */}
      <section className="py-24 md:py-32 bg-[#002D5B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #007AFF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2">
              <div className="relative inline-block mb-12">
                <div className="absolute -inset-4 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                <img 
                  src="https://i.ibb.co/chcNffCj/diversey-logo.png" 
                  alt="B Corp Logo" 
                  className="relative h-32 md:h-48 w-auto object-contain filter brightness-0 invert" 
                />
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
                {t('sustainability.bcorp.title')}
              </h2>
              <p className="text-xl md:text-2xl text-blue-100/80 font-medium leading-relaxed mb-10">
                {t('sustainability.bcorp.p1')}
              </p>
              <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
                <p className="text-lg text-blue-50 font-bold italic leading-relaxed">
                  "{t('sustainability.bcorp.p2')}"
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-6">
               {[
                 { title: 'Verified Performance', icon: '📊' },
                 { title: 'Legal Accountability', icon: '⚖️' },
                 { title: 'Public Transparency', icon: '🔍' },
                 { title: 'Social Impact', icon: '🤝' }
               ].map((item, idx) => (
                 <div key={idx} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h4 className="font-black text-sm uppercase tracking-widest">{item.title}</h4>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

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
