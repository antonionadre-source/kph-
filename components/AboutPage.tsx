import React from 'react';
import { useTranslation } from '../i18n';
import { teamPhotoUrl, csrImageUrl, mascotImageUrl, kaiComicPhotos } from '../assets';

interface AboutPageProps {
    onNavigate: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const values = [
    {
      icon: '🛡️',
      titleKey: 'aboutPage.valueIntegrityTitle',
      descriptionKey: 'aboutPage.valueIntegrityText',
      bgColor: 'bg-blue-500',
    },
    {
      icon: '🌍',
      titleKey: 'aboutPage.valueSustainabilityTitle',
      descriptionKey: 'aboutPage.valueSustainabilityText',
      bgColor: 'bg-green-500',
    },
    {
      icon: '🎯',
      titleKey: 'aboutPage.valueClientCentricTitle',
      descriptionKey: 'aboutPage.valueClientCentricText',
      bgColor: 'bg-indigo-500',
    },
    {
      icon: '💎',
      titleKey: 'aboutPage.valueExcellenceTitle',
      descriptionKey: 'aboutPage.valueExcellenceText',
      bgColor: 'bg-sky-500',
    },
  ];

  return (
    <main className="bg-white pt-48 pb-20 selection:bg-yellow-200">
      <div className="container mx-auto px-6">
        {/* Section 1: Introduction */}
        <section id="about-intro" className="py-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <img src={teamPhotoUrl} 
                alt={t('about.image_alt')}
                loading="lazy"
                className="rounded-[2.5rem] shadow-2xl w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="md:w-1/2">
                <span className="text-[#007AFF] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Legacy & Vision</span>
                <h1 className="text-5xl lg:text-6xl font-black text-[#002D5B] mb-8 leading-tight tracking-tighter">
                {t('about.title')}
                </h1>
                <p className="mb-6 text-gray-500 text-lg font-medium leading-relaxed">
                {t('about.p1')}
                </p>
                <p className="mb-4 text-gray-500 text-lg font-medium leading-relaxed">
                {t('about.p2')}
                </p>
            </div>
            </div>
        </section>

        {/* --- HYPER-COLORFUL BRANDED COMIC SECTION: THE LEGEND OF KAI --- */}
        <section id="kai-legend" className="py-24 relative overflow-hidden group">
            
            {/* Background: Vibrant Multi-Tone Pattern */}
            <div className="absolute inset-0 bg-[#f0f9ff] -z-10 rounded-[4rem] border-4 border-[#002D5B] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.07] bg-halftone text-[#007AFF]"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-yellow-200 via-blue-100 to-transparent rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100 via-blue-50 to-transparent rounded-full blur-[80px] opacity-60"></div>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                
                {/* Header for Comic */}
                <div className="text-center mb-16 md:mb-24">
                     <div className="bg-[#007AFF] border-[6px] border-[#002D5B] rounded-[3rem] shadow-[15px_15px_0_0_#002D5B] p-8 md:p-12 inline-block relative overflow-hidden transform rotate-1 transition-all hover:rotate-0">
                        <div className="absolute inset-0 bg-halftone opacity-[0.2] text-white pointer-events-none"></div>
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.8] tracking-tighter uppercase italic relative z-10 drop-shadow-[4px_4px_0_#002D5B]">
                            {t('aboutPage.storyTitle').split(':').map((part, i) => (
                                <span key={i} className={i === 1 ? "block mt-4 text-yellow-300" : ""}>
                                    {part}{i === 0 ? ':' : ''}
                                </span>
                            ))}
                        </h2>
                    </div>
                </div>

                {/* Comic Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
                    
                    {/* Panel 1: Rhine Legacy - IMAGE FROM ORIGINAL PANEL 3 */}
                    <div className="comic-panel group/panel">
                        <div className="bg-white border-[6px] border-[#002D5B] rounded-[3rem] shadow-[12px_12px_0_0_#007AFF] overflow-hidden relative transition-all duration-500 hover:-rotate-1">
                            <span className="absolute top-6 left-6 bg-yellow-400 border-[3px] border-[#002D5B] w-12 h-12 flex items-center justify-center rounded-full font-black text-xl z-20 shadow-md">1</span>
                            <div className="h-80 md:h-96 overflow-hidden relative">
                                <img 
                                    src={kaiComicPhotos.photo3} 
                                    alt="Kai's Origin" 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/panel:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#002D5B]/50 to-transparent"></div>
                            </div>
                            <div className="p-8 bg-white border-t-[4px] border-[#002D5B] min-h-[100px] flex items-center">
                                <p className="font-black text-[#002D5B] text-lg leading-tight italic uppercase tracking-tighter">
                                    {t('aboutPage.comic.panel1')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Panel 2: Solutions - Updated with specific image URL as requested */}
                    <div className="comic-panel group/panel mt-0 md:mt-12">
                        <div className="bg-white border-[6px] border-[#002D5B] rounded-[3rem] shadow-[12px_12px_0_0_#10B981] overflow-hidden relative transition-all duration-500 hover:rotate-1">
                            <span className="absolute top-6 left-6 bg-yellow-400 border-[3px] border-[#002D5B] w-12 h-12 flex items-center justify-center rounded-full font-black text-xl z-20 shadow-md">2</span>
                            <div className="h-80 md:h-96 overflow-hidden relative">
                                <img 
                                    src="https://www.dropbox.com/scl/fi/l6xebm5ocsgevyadys7wr/WhatsApp-Image-2026-01-26-at-02.59.00-1.jpeg?rlkey=bfucww2rof4tpki9tvklszyqo&raw=1" 
                                    alt="Kai's Solutions" 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/panel:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#002D5B]/50 to-transparent"></div>
                            </div>
                            <div className="p-8 bg-white border-t-[4px] border-[#002D5B] min-h-[100px] flex items-center">
                                <p className="font-black text-[#002D5B] text-lg leading-tight italic uppercase tracking-tighter">
                                    {t('aboutPage.comic.panel2')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Panel 3: Kraken Standard - IMAGE FROM ORIGINAL PANEL 2 */}
                    <div className="comic-panel group/panel mt-0 md:-mt-12">
                        <div className="bg-white border-[6px] border-[#002D5B] rounded-[3rem] shadow-[12px_12px_0_0_#F59E0B] overflow-hidden relative transition-all duration-500 hover:-rotate-1">
                            <span className="absolute top-6 left-6 bg-yellow-400 border-[3px] border-[#002D5B] w-12 h-12 flex items-center justify-center rounded-full font-black text-xl z-20 shadow-md">3</span>
                            <div className="h-80 md:h-96 overflow-hidden relative">
                                <img 
                                    src={kaiComicPhotos.photo2} 
                                    alt="The Kraken Standard" 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/panel:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#002D5B]/50 to-transparent"></div>
                            </div>
                            <div className="p-8 bg-white border-t-[4px] border-[#002D5B] min-h-[100px] flex items-center">
                                <p className="font-black text-[#002D5B] text-lg leading-tight italic uppercase tracking-tighter">
                                    {t('aboutPage.comic.panel3')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Panel 4: Future Success */}
                    <div className="comic-panel group/panel">
                        <div className="bg-white border-[6px] border-[#002D5B] rounded-[3rem] shadow-[12px_12px_0_0_#002D5B] overflow-hidden relative transition-all duration-500 hover:rotate-1">
                            <span className="absolute top-6 left-6 bg-yellow-400 border-[3px] border-[#002D5B] w-12 h-12 flex items-center justify-center rounded-full font-black text-xl z-20 shadow-md">4</span>
                            <div className="h-80 md:h-96 overflow-hidden relative">
                                <img 
                                    src={kaiComicPhotos.photo4} 
                                    alt="Building the Future" 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/panel:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#002D5B]/50 to-transparent"></div>
                            </div>
                            <div className="p-8 bg-white border-t-[4px] border-[#002D5B] min-h-[100px] flex items-center">
                                <p className="font-black text-[#002D5B] text-lg leading-tight italic uppercase tracking-tighter">
                                    {t('aboutPage.comic.panel4')}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Character Wisdom Panel */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <div className="bg-[#002D5B] text-white p-10 rounded-[3.5rem] border-[6px] border-[#007AFF] shadow-[15px_15px_0_0_#10B981] relative group/quote overflow-hidden">
                        <div className="absolute inset-0 bg-halftone opacity-[0.05] text-[#007AFF]"></div>
                        <span className="absolute -top-8 -left-2 text-[160px] text-white/5 font-black italic select-none pointer-events-none">“</span>
                        <p className="text-2xl md:text-3xl font-black italic tracking-tight leading-tight relative z-10 text-cyan-200 transition-transform group-hover/quote:scale-[1.01] duration-500 text-center">
                            {t('aboutPage.storyP3')}
                        </p>
                    </div>
                </div>

                {/* CTA Explosion Box with Comic Link */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-16">
                    <button 
                        onClick={() => onNavigate('consultation')}
                        className="group/btn relative bg-white border-[6px] border-[#002D5B] px-12 py-6 rounded-[2.5rem] font-black text-2xl uppercase tracking-tighter italic shadow-[12px_12px_0_0_#002D5B] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all active:scale-95 overflow-hidden"
                    >
                        <span className="relative z-10 text-[#002D5B] group-hover/btn:text-white transition-colors duration-300">Join the Crew!</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#007AFF] to-blue-800 translate-x-[-105%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out skew-x-6"></div>
                    </button>

                    <button 
                        onClick={() => onNavigate('comic-page')}
                        className="group/comic relative bg-yellow-400 border-[6px] border-[#002D5B] px-12 py-6 rounded-[2.5rem] font-black text-2xl uppercase tracking-tighter italic shadow-[12px_12px_0_0_#002D5B] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all active:scale-95 overflow-hidden"
                    >
                        <span className="relative z-10 text-[#002D5B]">{t('aboutPage.viewComics')}</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/comic:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </div>
            </div>

            <div className="absolute top-10 left-10 text-[#002D5B] opacity-10 font-mono text-[9px] font-black uppercase tracking-[0.5em] vertical-rl">
                KRAKEN_COMIC_V2 // LEGEND_DESCENT
            </div>
        </section>

        {/* Section 2: Our Mission & Vision */}
        <section id="mission-vision" className="py-20 bg-slate-50 rounded-[3rem] my-24 border border-gray-100 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-center px-12">
            <div className="group">
                <div className="w-16 h-16 bg-[#002D5B] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl transform group-hover:rotate-6 transition-transform">🚀</div>
                <h2 className="text-3xl font-black text-[#002D5B] mb-4 uppercase tracking-tighter">{t('aboutPage.missionTitle')}</h2>
                <p className="text-gray-500 text-lg font-medium max-w-md mx-auto leading-relaxed">{t('aboutPage.missionText')}</p>
            </div>
            <div className="group">
                <div className="w-16 h-16 bg-[#007AFF] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl transform group-hover:-rotate-6 transition-transform">👁️</div>
                <h2 className="text-3xl font-black text-[#002D5B] mb-4 uppercase tracking-tighter">{t('aboutPage.visionTitle')}</h2>
                <p className="text-gray-500 text-lg font-medium max-w-md mx-auto leading-relaxed">{t('aboutPage.visionText')}</p>
            </div>
            </div>
        </section>

        {/* Section 3: Our Core Values */}
        <section id="core-values" className="py-10 mb-24">
            <div className="text-center mb-16">
                <span className="text-gray-400 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Fundamental Beliefs</span>
                <h2 className="text-4xl md:text-6xl font-black text-[#002D5B] uppercase tracking-tighter">{t('aboutPage.valuesTitle')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
                <div key={index} className="flex flex-col items-center text-center p-8 bg-white rounded-[2.5rem] shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 group">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-12 transition-transform ${value.bgColor} text-white`}>
                    <span className="text-4xl" role="img" aria-label={t(value.titleKey)}>{value.icon}</span>
                </div>
                <h3 className="text-2xl font-black text-[#002D5B] mb-3 tracking-tight">{t(value.titleKey)}</h3>
                <p className="text-gray-500 font-bold text-sm leading-relaxed">{t(value.descriptionKey)}</p>
                </div>
            ))}
            </div>
        </section>

        {/* Section 4: CSR Commitment */}
        <section id="csr-commitment" className="py-20 mb-24">
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="md:w-1/2">
              <img 
                src={csrImageUrl} 
                alt={t('aboutPage.csrImageAlt')}
                loading="lazy"
                className="rounded-[3rem] shadow-2xl w-full h-auto object-cover border-8 border-slate-50" 
              />
            </div>
            <div className="md:w-1/2">
              <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Environmental Stewardship</span>
              <h2 className="text-4xl lg:text-5xl font-black text-[#002D5B] mb-8 tracking-tighter leading-none">
                {t('aboutPage.csrTitle')}
              </h2>
              <div className="space-y-6 text-gray-500 text-lg font-medium leading-relaxed">
                <p>{t('aboutPage.csrP1')}</p>
                <p>{t('aboutPage.csrP2')}</p>
                <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 text-[#002D5B] font-black italic relative">
                    <div className="absolute -top-4 left-8 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">Active Since Day 1</div>
                    "{t('aboutPage.csrP3')}"
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Employee Care */}
        <section id="employee-care" className="py-24 relative overflow-hidden bg-slate-900 rounded-[4rem] text-white shadow-2xl">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #007AFF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="container mx-auto px-8 md:px-20 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-[#007AFF] font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Our Human Capital</span>
                    <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter leading-none">{t('aboutPage.employees.title')}</h2>
                    <p className="text-blue-100/60 max-w-2xl mx-auto text-xl font-medium leading-relaxed">{t('aboutPage.employees.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
                    
                    {/* Card 1: Fair Pay */}
                    <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 hover:border-white/20 transition-all duration-500 group">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:rotate-12 transition-transform">⚖️</div>
                            <h3 className="text-3xl font-black leading-tight tracking-tight">{t('aboutPage.employees.fairPay.title')}</h3>
                        </div>
                        <p className="text-blue-100/70 text-lg leading-relaxed font-medium">
                            {t('aboutPage.employees.fairPay.desc')}
                        </p>
                    </div>

                    {/* Card 2: Charity */}
                    <div className="lg:col-span-5 bg-[#007AFF] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                         <div className="absolute -right-10 -top-10 text-[200px] text-white/10 font-black pointer-events-none select-none">❤️</div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">❤️</div>
                            <h3 className="text-3xl font-black mb-6 tracking-tight">{t('aboutPage.employees.charity.title')}</h3>
                            <p className="text-blue-50 text-lg leading-relaxed font-medium mt-auto">
                                {t('aboutPage.employees.charity.desc')}
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Retention */}
                    <div className="lg:col-span-12 bg-white text-[#002D5B] p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-12 group transform transition-all duration-700 hover:shadow-3xl shadow-lg">
                        <div className="flex-shrink-0 w-24 h-24 bg-blue-50 text-[#007AFF] rounded-full flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform duration-500">🤝</div>
                        <div className="text-center md:text-left flex-1">
                            <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">{t('aboutPage.employees.retention.title')}</h3>
                            <p className="text-gray-500 text-xl font-medium leading-relaxed max-w-4xl">
                                {t('aboutPage.employees.retention.desc')}
                            </p>
                        </div>
                        <div className="hidden lg:block text-7xl animate-bounce-slow">💎</div>
                    </div>

                </div>
            </div>
        </section>
      </div>
      
      <style>{`
        .bg-halftone {
            background-image: radial-gradient(circle at center, currentColor 1.5px, transparent 1.5px);
            background-size: 10px 10px;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>
    </main>
  );
};

export default AboutPage;