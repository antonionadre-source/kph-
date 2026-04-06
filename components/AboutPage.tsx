import React from 'react';
import { useTranslation } from '../i18n';
import { teamPhotoUrl, csrImageUrl, mascotImageUrl, kaiComicPhotos } from '../assets';
import { motion } from 'motion/react';

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
      bgColor: 'from-blue-500/20 to-blue-600/20',
      accent: 'text-blue-400',
    },
    {
      icon: '🌍',
      titleKey: 'aboutPage.valueSustainabilityTitle',
      descriptionKey: 'aboutPage.valueSustainabilityText',
      bgColor: 'from-emerald-500/20 to-emerald-600/20',
      accent: 'text-emerald-400',
    },
    {
      icon: '🎯',
      titleKey: 'aboutPage.valueClientCentricTitle',
      descriptionKey: 'aboutPage.valueClientCentricText',
      bgColor: 'from-indigo-500/20 to-indigo-600/20',
      accent: 'text-indigo-400',
    },
    {
      icon: '💎',
      titleKey: 'aboutPage.valueExcellenceTitle',
      descriptionKey: 'aboutPage.valueExcellenceText',
      bgColor: 'from-sky-500/20 to-sky-600/20',
      accent: 'text-sky-400',
    },
  ];

  return (
    <main className="bg-[#020617] pt-48 pb-20 selection:bg-blue-500/30 text-white relative overflow-hidden">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_70%)]" />
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section 1: Introduction */}
        <section id="about-intro" className="py-10 mb-20">
            <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-[3rem] blur-2xl opacity-50" />
                <img src={teamPhotoUrl} 
                alt={t('about.image_alt')}
                loading="lazy"
                className="rounded-[2.5rem] shadow-2xl w-full h-auto object-cover relative z-10 border border-white/10" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-px bg-blue-500"></span>
                  <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em]">Legacy & Vision</span>
                </div>
                <h1 className="text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase italic">
                {t('about.title').split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-blue-500" : ""}>{word} </span>
                ))}
                </h1>
                <p className="mb-6 text-white/60 text-xl font-medium leading-relaxed">
                {t('about.p1')}
                </p>
                <p className="mb-4 text-white/40 text-lg font-medium leading-relaxed">
                {t('about.p2')}
                </p>
            </motion.div>
            </div>
        </section>

        {/* --- HYPER-COLORFUL BRANDED COMIC SECTION: THE LEGEND OF KAI --- */}
        <section id="kai-legend" className="py-24 relative overflow-hidden group mb-32">
            
            {/* Background: Modern Dark Glass */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl -z-10 rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-[0.05] bg-halftone text-blue-500"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/10 via-transparent to-transparent rounded-full blur-[100px] opacity-60"></div>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                
                {/* Header for Comic */}
                <div className="text-center mb-24">
                     <motion.div 
                       initial={{ scale: 0.9, opacity: 0 }}
                       whileInView={{ scale: 1, opacity: 1 }}
                       viewport={{ once: true }}
                       className="bg-blue-600 border-[6px] border-white/10 rounded-[3rem] shadow-[0_30px_60px_rgba(37,99,235,0.3)] p-8 md:p-12 inline-block relative overflow-hidden transform rotate-1 transition-all hover:rotate-0"
                     >
                        <div className="absolute inset-0 bg-halftone opacity-[0.2] text-white pointer-events-none"></div>
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.8] tracking-tighter uppercase italic relative z-10 drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                            {t('aboutPage.storyTitle').split(':').map((part, i) => (
                                <span key={i} className={i === 1 ? "block mt-4 text-blue-200" : ""}>
                                    {part}{i === 0 ? ':' : ''}
                                </span>
                            ))}
                        </h2>
                    </motion.div>
                </div>

                {/* Comic Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
                    
                    {[
                      { id: 1, img: kaiComicPhotos.photo3, text: t('aboutPage.comic.panel1'), color: 'blue', offset: false },
                      { id: 2, img: "https://www.dropbox.com/scl/fi/l6xebm5ocsgevyadys7wr/WhatsApp-Image-2026-01-26-at-02.59.00-1.jpeg?rlkey=bfucww2rof4tpki9tvklszyqo&raw=1", text: t('aboutPage.comic.panel2'), color: 'emerald', offset: true },
                      { id: 3, img: kaiComicPhotos.photo2, text: t('aboutPage.comic.panel3'), color: 'amber', offset: false },
                      { id: 4, img: kaiComicPhotos.photo4, text: t('aboutPage.comic.panel4'), color: 'indigo', offset: true }
                    ].map((panel, i) => (
                      <motion.div 
                        key={panel.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`comic-panel group/panel ${panel.offset ? 'md:mt-12' : 'md:-mt-12'}`}
                      >
                          <div className="bg-white/5 backdrop-blur-xl border-[6px] border-white/10 rounded-[3rem] shadow-2xl overflow-hidden relative transition-all duration-500 hover:scale-[1.02]">
                              <span className={`absolute top-6 left-6 bg-${panel.color}-500 border-[3px] border-white/20 w-12 h-12 flex items-center justify-center rounded-full font-black text-xl z-20 shadow-lg`}>{panel.id}</span>
                              <div className="h-80 md:h-96 overflow-hidden relative">
                                  <img 
                                      src={panel.img} 
                                      alt={`Panel ${panel.id}`} 
                                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/panel:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 to-transparent"></div>
                              </div>
                              <div className="p-8 bg-white/5 border-t-[4px] border-white/10 min-h-[100px] flex items-center">
                                  <p className="font-black text-white text-lg leading-tight italic uppercase tracking-tighter">
                                      {panel.text}
                                  </p>
                              </div>
                          </div>
                      </motion.div>
                    ))}

                </div>

                {/* Character Wisdom Panel */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="mt-32 max-w-4xl mx-auto"
                >
                    <div className="bg-blue-600/20 backdrop-blur-3xl text-white p-12 rounded-[3.5rem] border-[6px] border-blue-500/30 shadow-2xl relative group/quote overflow-hidden text-center">
                        <div className="absolute inset-0 bg-halftone opacity-[0.05] text-blue-500"></div>
                        <span className="absolute -top-8 -left-2 text-[160px] text-white/5 font-black italic select-none pointer-events-none">“</span>
                        <p className="text-2xl md:text-4xl font-black italic tracking-tight leading-tight relative z-10 text-blue-100 transition-transform group-hover/quote:scale-[1.01] duration-500">
                            {t('aboutPage.storyP3')}
                        </p>
                    </div>
                </motion.div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-20">
                    <motion.button 
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate('consultation')}
                        className="group/btn relative bg-blue-600 px-12 py-6 rounded-[2.5rem] font-black text-2xl uppercase tracking-tighter italic shadow-[0_20px_40px_rgba(37,99,235,0.3)] overflow-hidden"
                    >
                        <span className="relative z-10 text-white">Join the Crew!</span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-105%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out skew-x-6"></div>
                    </motion.button>

                    <motion.button 
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate('comic-page')}
                        className="group/comic relative bg-white/5 backdrop-blur-xl border-2 border-white/10 px-12 py-6 rounded-[2.5rem] font-black text-2xl uppercase tracking-tighter italic shadow-xl overflow-hidden"
                    >
                        <span className="relative z-10 text-white">{t('aboutPage.viewComics')}</span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/comic:translate-y-0 transition-transform duration-300"></div>
                    </motion.button>
                </div>
            </div>
        </section>

        {/* Section 2: Our Mission & Vision */}
        <section id="mission-vision" className="py-24 bg-white/5 backdrop-blur-3xl rounded-[4rem] my-32 border border-white/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 text-center px-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
                <div className="w-20 h-20 bg-blue-600/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl shadow-xl border border-blue-500/20 transform group-hover:rotate-6 transition-transform">🚀</div>
                <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">{t('aboutPage.missionTitle')}</h2>
                <p className="text-white/50 text-xl font-medium max-w-md mx-auto leading-relaxed">{t('aboutPage.missionText')}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group"
            >
                <div className="w-20 h-20 bg-indigo-600/20 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl shadow-xl border border-indigo-500/20 transform group-hover:-rotate-6 transition-transform">👁️</div>
                <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">{t('aboutPage.visionTitle')}</h2>
                <p className="text-white/50 text-xl font-medium max-w-md mx-auto leading-relaxed">{t('aboutPage.visionText')}</p>
            </motion.div>
            </div>
        </section>

        {/* Section 3: Our Core Values */}
        <section id="core-values" className="py-10 mb-32">
            <div className="text-center mb-20">
                <span className="text-white/20 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Fundamental Beliefs</span>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic">Our <span className="text-blue-500">Core</span> Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {values.map((value, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="flex flex-col items-center text-center p-10 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl group"
                >
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl transform group-hover:rotate-12 transition-transform bg-gradient-to-br ${value.bgColor} border border-white/10`}>
                    <span className="text-5xl" role="img" aria-label={t(value.titleKey)}>{value.icon}</span>
                </div>
                <h3 className={`text-2xl font-black mb-4 tracking-tight uppercase italic ${value.accent}`}>{t(value.titleKey)}</h3>
                <p className="text-white/40 font-bold text-sm leading-relaxed">{t(value.descriptionKey)}</p>
                </motion.div>
            ))}
            </div>
        </section>

        {/* Section 4: CSR Commitment */}
        <section id="csr-commitment" className="py-20 mb-32">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -inset-4 bg-emerald-600/20 rounded-[3rem] blur-2xl opacity-30" />
              <img 
                src={csrImageUrl} 
                alt={t('aboutPage.csrImageAlt')}
                loading="lazy"
                className="rounded-[3rem] shadow-2xl w-full h-auto object-cover border border-white/10 relative z-10" 
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-emerald-500"></span>
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em]">Environmental Stewardship</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-white mb-10 tracking-tighter leading-none uppercase italic">
                {t('aboutPage.csrTitle')}
              </h2>
              <div className="space-y-8 text-white/50 text-xl font-medium leading-relaxed">
                <p>{t('aboutPage.csrP1')}</p>
                <p>{t('aboutPage.csrP2')}</p>
                <div className="p-10 bg-emerald-500/10 backdrop-blur-xl rounded-[3rem] border border-emerald-500/20 text-emerald-100 font-black italic relative">
                    <div className="absolute -top-4 left-10 bg-emerald-500 text-white text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest font-black shadow-lg">Active Since Day 1</div>
                    "{t('aboutPage.csrP3')}"
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 5: Employee Care */}
        <section id="employee-care" className="py-24 relative overflow-hidden bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 text-white shadow-2xl mb-20">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="container mx-auto px-8 md:px-20 relative z-10">
                <div className="text-center mb-24">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <span className="w-8 h-px bg-blue-500"></span>
                      <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em]">Our Human Capital</span>
                      <span className="w-8 h-px bg-blue-500"></span>
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter leading-none uppercase italic">{t('aboutPage.employees.title')}</h2>
                    <p className="text-white/40 max-w-2xl mx-auto text-2xl font-medium leading-relaxed">{t('aboutPage.employees.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
                    
                    {/* Card 1: Fair Pay */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="lg:col-span-7 bg-white/5 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/10 hover:border-white/20 transition-all duration-500 group"
                    >
                        <div className="flex items-center gap-8 mb-10">
                            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-[2rem] border border-emerald-500/20 flex items-center justify-center text-4xl shadow-lg group-hover:rotate-12 transition-transform">⚖️</div>
                            <h3 className="text-4xl font-black leading-tight tracking-tight uppercase italic">{t('aboutPage.employees.fairPay.title')}</h3>
                        </div>
                        <p className="text-white/50 text-xl leading-relaxed font-medium">
                            {t('aboutPage.employees.fairPay.desc')}
                        </p>
                    </motion.div>

                    {/* Card 2: Charity */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="lg:col-span-5 bg-blue-600 p-12 rounded-[3.5rem] shadow-[0_30px_60px_rgba(37,99,235,0.3)] relative overflow-hidden group"
                    >
                         <div className="absolute -right-10 -top-10 text-[200px] text-white/10 font-black pointer-events-none select-none">❤️</div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md text-white rounded-[2rem] border border-white/20 flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition-transform">❤️</div>
                            <h3 className="text-4xl font-black mb-8 tracking-tight uppercase italic">{t('aboutPage.employees.charity.title')}</h3>
                            <p className="text-blue-50 text-xl leading-relaxed font-medium mt-auto">
                                {t('aboutPage.employees.charity.desc')}
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 3: Retention */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="lg:col-span-12 bg-white text-[#020617] p-16 rounded-[4rem] flex flex-col md:flex-row items-center gap-16 group transform transition-all duration-700 hover:shadow-[0_50px_100px_rgba(255,255,255,0.1)] shadow-2xl"
                    >
                        <div className="flex-shrink-0 w-28 h-28 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-6xl shadow-inner group-hover:scale-110 transition-transform duration-500">🤝</div>
                        <div className="text-center md:text-left flex-1">
                            <h3 className="text-4xl font-black mb-6 tracking-tighter uppercase italic">{t('aboutPage.employees.retention.title')}</h3>
                            <p className="text-gray-500 text-2xl font-medium leading-relaxed max-w-4xl">
                                {t('aboutPage.employees.retention.desc')}
                            </p>
                        </div>
                        <div className="hidden lg:block text-8xl animate-bounce-slow">💎</div>
                    </motion.div>

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
