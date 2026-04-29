import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n';
import { 
  Building2, 
  Target, 
  Users, 
  History, 
  ArrowRight, 
  Quote, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck,
  Globe,
  Heart,
  Sparkles
} from 'lucide-react';
import { 
  aboutHeroImageUrl, 
  aboutOriginImages, 
  teamPhotoUrl,
  mascotImageUrl
} from '../assets';

interface OurStoryPageProps {
  onNavigate: (page: string) => void;
}

const OurStoryPage: React.FC<OurStoryPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const timeline = [
    {
      year: '2019',
      title: 'The Spark in Schaffhausen',
      desc: 'Founded with a vision to bring Swiss precision to the often-chaotic world of property management.',
      icon: <Building2 className="w-6 h-6" />,
      img: aboutOriginImages.panel1
    },
    {
      year: '2021',
      title: 'Expanding Horizons',
      desc: 'Beginning our expansion into Zurich and Winterthur, with the aim of bringing our standard of reliability to a wider region.',
      icon: <Globe className="w-6 h-6" />,
      img: aboutOriginImages.panel2
    },
    {
      year: '2023',
      title: 'The Legend of Kai',
      desc: 'Creation of our mascot Kai, representing the balance between nature and operational efficiency.',
      icon: <Sparkles className="w-6 h-6" />,
      img: mascotImageUrl
    },
    {
      year: '2025 - ONWARDS',
      title: 'Our Aim: B Corp & Beyond',
      desc: 'Our next great milestone. We are actively aiming for the highest standards of social and environmental impact as we work towards certification.',
      icon: <Target className="w-6 h-6" />,
      img: aboutHeroImageUrl
    }
  ];

  return (
    <main className="bg-white min-h-screen selection:bg-blue-500/30 text-[#001A3D]">
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:h-[80vh] flex items-center overflow-hidden bg-[#001A3D] py-20 md:py-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="Kraken Story" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001A3D] via-[#001A3D]/70 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <History className="w-4 h-4" />
              Our Journey
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-[84px] font-black leading-[0.9] tracking-tighter text-white mb-6 uppercase"
            >
              The Story <br />
              <span className="text-blue-500">Behind Kraken</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/70 font-medium leading-relaxed mb-10 max-w-xl"
            >
              How a simple commitment to precision became a new standard for facility management in Switzerland.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40"
              >
                EXPLORE TIMELINE
              </button>
              <button 
                onClick={() => onNavigate('comic-page')}
                className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                THE LEGEND OF KAI
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Origins */}
      <section id="timeline" className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-20 text-center mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-[#001A3D]">A Commitment to Excellence</h2>
            <p className="text-gray-500 font-medium">Beginning in Schaffhausen with the aim of becoming your trusted regional partner.</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-100 hidden lg:block" />

            <div className="space-y-24">
              {timeline.map((item, idx) => (
                <div key={idx} className={`flex flex-col lg:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Content */}
                  <motion.div 
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1 lg:text-left"
                  >
                    <div className={`p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 relative ${idx % 2 !== 0 ? 'lg:text-right' : ''}`}>
                      <div className={`text-4xl font-black text-blue-600 mb-2 ${idx % 2 !== 0 ? 'lg:justify-end' : ''} flex items-center gap-4`}>
                        {idx % 2 !== 0 && item.icon}
                        {item.year}
                        {idx % 2 === 0 && item.icon}
                      </div>
                      <h3 className="text-2xl font-black text-[#001A3D] mb-4 uppercase">{item.title}</h3>
                      <p className="text-gray-500 font-medium leading-relaxed italic">{item.desc}</p>
                    </div>
                  </motion.div>

                  {/* Spacer/Dot */}
                  <div className="hidden lg:flex w-12 h-12 bg-white rounded-full border-4 border-blue-600 z-10 shrink-0 items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  </div>

                  {/* Image */}
                  <motion.div 
                    initial={{ opacity: 0, x: idx % 2 === 0 ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1 w-full"
                  >
                    <div className="aspect-video lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values & Philosophy */}
      <section className="py-24 bg-[#001A3D] text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] mb-6">OUR ASPIRATIONS</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">
                The standard <br />
                <span className="text-blue-400">we strive to define.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Swiss Quality', text: 'Our relentless pursuit. Every detail is a chance to prove our dedication.' },
                  { title: 'Absolute Reliability', text: 'Building the systems to run seamlessly so you never have to notice us.' },
                  { title: 'Radical Transparency', text: 'The goal of total accountability, from data to environmental impact.' }
                ].map((point, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black">{point.title}</h4>
                      <p className="text-white/50 text-sm">{point.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-tr from-blue-600/20 to-[#001A3D] rounded-[4rem] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                <Quote className="absolute top-12 left-12 w-20 h-20 text-white/5" />
                <div className="max-w-md text-center px-12 z-10">
                  <p className="text-2xl md:text-3xl font-black italic mb-8 leading-tight">
                    "We didn't start Kraken to be the biggest, but to be the most trusted. Every building has a story, and we're here to protect it."
                  </p>
                  <p className="text-blue-400 font-black text-sm uppercase tracking-widest">— The Founder</p>
                </div>
                
                {/* Decorative Kai Image Floating */}
                <motion.img 
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  src={mascotImageUrl}
                  className="absolute -bottom-10 -right-10 w-48 opacity-30 pointer-events-none grayscale"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Future Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-[#F1F5F9] rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-1">
                <div className="lg:-rotate-90 whitespace-nowrap text-[10px] font-black text-blue-400 uppercase tracking-[1em] opacity-50 mb-8 lg:mb-0">
                  FUTURE COMMITMENTS
                </div>
              </div>
              <div className="lg:col-span-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-[#001A3D]">Our vision for <span className="text-emerald-600 uppercase">B-Corp</span></h2>
                <p className="text-xl text-[#001A3D] font-bold leading-relaxed mb-8 border-l-4 border-blue-600 pl-8 bg-white/40 py-4 rounded-r-3xl">
                  {t('sustainability.results.desc')}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-xs font-bold text-gray-500 uppercase">Targeting Impact</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-xs font-bold text-gray-500 uppercase">Building Community</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200" 
                    alt="Sustainable Future" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target 2026</p>
                    <p className="text-sm font-black text-[#001A3D]">Net Zero Operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-[#001A3D] tracking-tighter mb-8 uppercase leading-none">
                Every partnership <br />
                is a <span className="text-blue-600">new chapter.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => onNavigate('consultation')}
                  className="bg-[#001A3D] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-900/20"
                >
                    Start your story with us →
                </button>
            </div>
        </div>
      </section>

    </main>
  );
};

export default OurStoryPage;
