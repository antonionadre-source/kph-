import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n';
import { 
  kaiComicPhotos, 
  cityImages, 
  mascotImageUrl, 
  companyLogoUrl 
} from '../assets';
import { 
  ChevronRightIcon, 
  BookOpenIcon, 
  HeartIcon, 
  UsersIcon, 
  PlayIcon
} from 'lucide-react';

interface ComicPageProps {
  onNavigate: (page: string) => void;
}

const ComicPage: React.FC<ComicPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const legendCards = [
    {
      id: '01',
      title: 'CHAOS',
      text: 'While others fear chaos, Kai learns from it.',
      img: kaiComicPhotos.photo1,
      color: 'text-blue-500'
    },
    {
      id: '02',
      title: 'LEARNING',
      text: 'Understanding systems, not just reacting to them.',
      img: kaiComicPhotos.photo2,
      color: 'text-green-500'
    },
    {
      id: '03',
      title: 'PRECISION',
      text: 'Swiss-level detail. Nothing left to chance.',
      img: kaiComicPhotos.photo3,
      color: 'text-purple-500'
    },
    {
      id: '04',
      title: 'COLLABORATION',
      text: 'Growth happens together. Always.',
      img: kaiComicPhotos.photo4,
      color: 'text-orange-500'
    }
  ];

  return (
    <main className="bg-white min-h-screen selection:bg-blue-500/30 text-[#020617] font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#f8fafc]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={cityImages.schaffhausen} 
            alt="Schaffhausen" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6"
              >
                OUR ORIGIN
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8"
              >
                Every great <br />
                partnership <br />
                starts with <span className="text-blue-600">a story.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-lg font-medium leading-relaxed mb-10 max-w-md"
              >
                In Schaffhausen, a simple idea took shape. <br />
                Today, it drives everything we do.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <button className="bg-[#001A3D] text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20">
                  <PlayIcon className="w-4 h-4 fill-current" /> EXPLORE THE STORY
                </button>
                <button className="bg-white text-[#001A3D] border-2 border-[#001A3D] px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all">
                  <BookOpenIcon className="w-4 h-4" /> VIEW COMICS <ChevronRightIcon className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            {/* Kai Illustration Area */}
            <div className="relative">
              {/* Books Stack */}
              <motion.div 
                initial={{ opacity: 0, x: -30, rotate: -5 }}
                animate={{ opacity: 1, x: 0, rotate: -12 }}
                transition={{ delay: 0.4 }}
                className="absolute top-1/2 -left-20 z-30 hidden xl:block"
              >
                <div className="flex flex-col -space-y-4">
                  <div className="bg-[#001A3D] text-white px-4 py-2 rounded-sm shadow-lg border border-white/10 text-[8px] font-black uppercase tracking-widest rotate-[-2deg]">
                    FOCUS · FLOW · IMPACT
                  </div>
                  <div className="bg-[#001A3D] text-white px-4 py-2 rounded-sm shadow-lg border border-white/10 text-[8px] font-black uppercase tracking-widest rotate-[1deg] translate-x-2">
                    FOCUS · FLOW · IMPACT
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative z-20"
              >
                <img 
                  src={mascotImageUrl} 
                  alt="Kai Mascot" 
                  className="w-full max-w-lg mx-auto drop-shadow-2xl animate-float"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Sticky Note Mockup */}
              <motion.div 
                initial={{ opacity: 0, x: 50, rotate: 15 }}
                animate={{ opacity: 1, x: 0, rotate: 5 }}
                transition={{ delay: 0.5 }}
                className="absolute top-20 right-0 md:-right-10 bg-white p-6 shadow-xl border border-gray-100 w-48 rotate-6 z-30"
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-gray-200/50 rounded-full" />
                <p className="font-handwriting text-gray-700 text-sm leading-tight pt-4">
                  A story about <br />
                  <strong>flow, focus</strong> and <br />
                  <strong>finding solutions.</strong>
                  <span className="block mt-2 text-blue-500">💙</span>
                </p>
              </motion.div>

              {/* Coffee Mug Mockup */}
              <div className="absolute bottom-10 right-10 z-10 hidden md:block">
                <div className="w-16 h-20 bg-[#001A3D] rounded-t-lg rounded-b-xl relative shadow-lg">
                  <div className="absolute -right-4 top-4 w-6 h-10 border-4 border-[#001A3D] rounded-r-full" />
                  <p className="text-[10px] font-black text-white/30 absolute top-4 left-1/2 -translate-x-1/2 tracking-tighter">K&K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#f1f5f9] rounded-[2rem] p-10 md:p-12 border border-blue-100 shadow-sm relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                <span className="text-3xl text-white font-serif">“</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-base md:text-lg font-medium leading-relaxed italic mb-4">
                  From his first breath in the Rhine, Kai has been shaped by flow, precision and balance. 
                  He understands buildings the way water understands its path — naturally, efficiently, without friction. 
                  In a world full of noise and complexity, he brings quiet control.
                </p>
                <p className="text-blue-600 font-black text-xs uppercase tracking-widest">
                  That's the philosophy behind everything we do.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- THE LEGEND OF KAI SECTION --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4">THE LEGEND OF KAI</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4">Lessons from the deep.</h2>
            <p className="text-gray-400 font-medium">Applied to everything we do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {legendCards.map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative h-64 rounded-3xl overflow-hidden mb-6 shadow-xl border-4 border-white">
                  <div className="absolute top-4 left-4 z-20 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg">
                    {card.id}
                  </div>
                  <img 
                    src={card.img} 
                    alt={card.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${card.color}`}>{card.title}</h3>
                <p className="text-gray-600 text-[13px] font-medium leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COMICS WITH PURPOSE SECTION --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Comic Book Mockup */}
              <div className="relative z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white p-4 rounded-lg shadow-2xl border border-gray-100">
                  <div className="relative aspect-[4/3] overflow-hidden rounded">
                    <img 
                      src={kaiComicPhotos.photo1} 
                      alt="Comic Book" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
                  </div>
                </div>
                {/* Floating Heart */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-50 text-red-500 text-2xl animate-pulse">
                  ❤️
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50" />
            </motion.div>

            <div className="relative">
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">COMICS WITH PURPOSE</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] mb-8">
                Stories that create <br />
                <span className="text-blue-600">real-world impact.</span>
              </h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10 max-w-lg">
                We create original comics that bring Kai's journey to life. 
                Every comic you buy supports charitable initiatives that help people and communities thrive. 
                <span className="block mt-4 text-[#020617] font-black">100% of profits go to charity.</span>
              </p>

              {/* Process Flow */}
              <div className="flex flex-wrap items-center gap-6 mb-12">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-100">
                    <BookOpenIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">You buy <br /> a comic</p>
                </div>
                <div className="h-0.5 w-8 bg-gray-200" />
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-100">
                    <HeartIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">100% of profits <br /> go to charity</p>
                </div>
                <div className="h-0.5 w-8 bg-gray-200" />
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-100">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Together, we create <br /> real impact</p>
                </div>
              </div>

              {/* Handwritten Notes */}
              <div className="absolute top-0 right-0 hidden xl:block">
                <div className="font-handwriting text-blue-600 rotate-[-5deg] flex flex-col items-end">
                  <p className="text-lg">Real stories.</p>
                  <p className="text-lg">Real people.</p>
                  <p className="text-lg">Real impact.</p>
                  <div className="w-24 h-1 bg-blue-600/30 mt-1 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-[#001A3D] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Background Kai Peek */}
            <motion.img 
              initial={{ y: 100 }}
              whileInView={{ y: 0 }}
              src={mascotImageUrl} 
              alt="" 
              className="absolute -bottom-10 -left-10 w-48 opacity-20 grayscale pointer-events-none" 
            />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] mb-8">READY TO BRING ORDER TO YOUR SPACE?</p>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-12">
                Let's build a partnership <br />
                you can <span className="text-blue-400">rely on.</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => onNavigate('consultation')}
                  className="bg-[#22c55e] text-[#001A3D] px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-green-400 transition-all shadow-xl shadow-green-500/20"
                >
                  GET YOUR QUOTE IN MINUTES →
                </button>
                <button 
                  onClick={() => onNavigate('services-page')}
                  className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  EXPLORE SERVICES →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        
        .font-handwriting {
          font-family: 'Permanent Marker', cursive;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
};

export default ComicPage;
