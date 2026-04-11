import React from 'react';
import { useTranslation } from '../i18n';
import { teamPhotoUrl, companyLogoWhiteUrl, aboutHeroImageUrl, aboutOriginImages } from '../assets';
import { motion } from 'motion/react';
import { ChevronRightIcon } from './icons';

interface AboutPageProps {
    onNavigate: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const originPanels = [
    {
      img: aboutOriginImages.panel1,
      text: t('about.origin.panel1'),
    },
    {
      img: aboutOriginImages.panel2,
      text: t('about.origin.panel2'),
    },
    {
      img: aboutOriginImages.panel3,
      text: t('about.origin.panel3'),
    },
    {
      img: aboutOriginImages.panel4,
      text: t('about.origin.panel4'),
    },
  ];

  const coreValues = [
    {
      icon: '🛡️',
      title: t('aboutPage.valueIntegrityTitle'),
      text: t('aboutPage.valueIntegrityText'),
      color: 'bg-blue-500/10 text-blue-400',
    },
    {
      icon: '🌱',
      title: t('aboutPage.valueSustainabilityTitle'),
      text: t('aboutPage.valueSustainabilityText'),
      color: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      icon: '🤝',
      title: t('aboutPage.valueClientCentricTitle'),
      text: t('aboutPage.valueClientCentricText'),
      color: 'bg-red-500/10 text-red-400',
    },
    {
      icon: '💎',
      title: t('aboutPage.valueExcellenceTitle'),
      text: t('aboutPage.valueExcellenceText'),
      color: 'bg-blue-400/10 text-blue-300',
    },
  ];

  return (
    <main className="bg-white selection:bg-blue-500/30 text-[#020617]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-40 overflow-hidden bg-[#001A3D]">
        <div className="absolute inset-0 z-0">
          <img 
            src={aboutHeroImageUrl} 
            alt="Kraken HQ" 
            className="w-full h-full object-cover object-right"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001A3D] via-[#001A3D]/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] mb-6"
            >
              ABOUT KRAKEN
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-[90px] font-black text-white leading-tight mb-6 tracking-tighter"
            >
              {t('about.hero.title').split('.').map((part, i) => (
                <span key={i} className={i === 1 ? "block text-blue-400" : ""}>
                  {part}{i === 0 ? '.' : ''}
                </span>
              ))}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-xl md:text-[20px] font-medium leading-relaxed mb-10 max-w-xl"
            >
              {t('about.hero.subtitle')}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => document.getElementById('origin')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                {t('about.hero.ctaStory')} <ChevronRightIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onNavigate('comic-page')}
                className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                VIEW COMICS <ChevronRightIcon className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- OUR ORIGIN SECTION --- */}
      <section id="origin" className="pt-0 pb-12 bg-white relative z-20">
        <div className="container mx-auto px-6 -mt-20">
          <div className="bg-gray-50 rounded-[3rem] pt-4 pb-8 md:pt-6 md:pb-12 lg:pt-8 lg:pb-16 px-8 md:px-12 lg:px-16 shadow-sm border border-gray-100">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Side: Text Content */}
              <div className="lg:col-span-4">
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">{t('about.origin.badge')}</p>
                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter mb-8 text-[#020617]">
                  {t('about.origin.title').split('partner').map((part, i) => (
                    <span key={i} className={i === 1 ? "text-blue-600" : ""}>
                      {i === 1 ? 'partner' : ''}{part}
                    </span>
                  ))}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
                  {t('about.origin.text')}
                </p>
                <button 
                  onClick={() => onNavigate('comic-page')}
                  className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group"
                >
                  {t('about.origin.readStory')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>

              {/* Right Side: Panels Grid */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {originPanels.map((panel, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative h-64 rounded-2xl overflow-hidden shadow-md bg-[#001A3D] flex items-center justify-center"
                    >
                      <img 
                        src={panel.img} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        referrerPolicy="no-referrer"
                      />
                      {/* Dark gradient overlay for text readability at the bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001A3D]/80 via-transparent to-transparent opacity-90" />
                      
                      {/* Text content overlayed at the bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-bold text-[10px] leading-tight">{panel.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES SECTION --- */}
      <section id="values" className="py-16 bg-[#001A3D] text-white -mt-8 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] mb-4">{t('about.values.badge')}</p>
              <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tighter mb-6">
                {t('about.values.title')}
              </h2>
              <p className="text-white/50 text-lg leading-relaxed">
                {t('about.values.text')}
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coreValues.map((value, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all duration-300 flex flex-col group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${value.color}`}>
                    <span className="text-xl">{value.icon}</span>
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-blue-400">{value.title}</h3>
                  <p className="text-white/60 text-[11px] font-medium leading-relaxed">{value.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PEOPLE & COMMITMENT SECTION --- */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Our People */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col"
            >
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">{t('about.people.badge')}</p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-10 flex-1">
                <div className="flex flex-col justify-center">
                  <h2 className="text-4xl font-black tracking-tighter mb-6 leading-tight">{t('about.people.title')}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{t('about.people.text')}</p>
                </div>
                <div className="rounded-2xl overflow-hidden h-64">
                  <img src={teamPhotoUrl} alt="Kraken Team" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-1">{t('about.people.pay.title')}</h4>
                    <p className="text-[10px] text-gray-400 font-medium leading-tight">{t('about.people.pay.text')}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-1">{t('about.people.social.title')}</h4>
                    <p className="text-[10px] text-gray-400 font-medium leading-tight">{t('about.people.social.text')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Our Commitment */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col"
            >
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">{t('about.commitment.badge')}</p>
              
              <div className="grid md:grid-cols-2 gap-12 flex-1">
                <div className="flex flex-col justify-center">
                  <h2 className="text-4xl font-black tracking-tighter mb-6 leading-tight">{t('about.commitment.title')}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">{t('about.commitment.text')}</p>
                  <button className="bg-[#001A3D] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#002d5b] transition-all duration-300 self-start">
                    {t('about.commitment.cta')} →
                  </button>
                </div>

                <div className="flex flex-col justify-center space-y-8">
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🌿</span>
                    </div>
                    <div>
                      <h4 className="font-black text-[10px] uppercase tracking-widest text-emerald-600 mb-1">{t('about.commitment.env.title')}</h4>
                      <p className="text-[11px] text-gray-400 font-medium leading-tight">{t('about.commitment.env.text')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <h4 className="font-black text-[10px] uppercase tracking-widest text-indigo-600 mb-1">{t('about.commitment.social.title')}</h4>
                      <p className="text-[11px] text-gray-400 font-medium leading-tight">{t('about.commitment.social.text')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <div>
                      <h4 className="font-black text-[10px] uppercase tracking-widest text-blue-600 mb-1">{t('about.commitment.corp.title')}</h4>
                      <p className="text-[11px] text-gray-400 font-medium leading-tight">{t('about.commitment.corp.text')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutPage;
