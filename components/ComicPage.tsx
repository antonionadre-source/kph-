import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n';
import { 
  kaiComicPhotos, 
  cityImages, 
  mascotImageUrl, 
  companyLogoUrl,
  comicHeroImageUrl,
  comicCovers
} from '../assets';
import { 
  ChevronRightIcon, 
  BookOpenIcon, 
  HeartIcon, 
  UsersIcon, 
  PlayIcon,
  FlagIcon,
  EyeIcon,
  SparklesIcon,
  QuoteIcon,
  LeafIcon,
  BadgeCheckIcon,
  SproutIcon,
  BarChart3Icon
} from 'lucide-react';

interface ComicPageProps {
  onNavigate: (page: string) => void;
}

const ComicPage: React.FC<ComicPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const legendCards = [
    {
      id: '01',
      title: 'LEARNING',
      text: 'Understanding systems, not just reacting to them.',
      img: "https://www.dropbox.com/scl/fi/l6xebm5ocsgevyadys7wr/WhatsApp-Image-2026-01-26-at-02.59.00-1.jpeg?rlkey=bfucww2rof4tpki9tvklszyqo&st=54xinrap&raw=1",
      color: 'text-green-600',
      badgeBg: 'bg-green-600'
    },
    {
      id: '02',
      title: 'CHAOS',
      text: 'While others fear chaos, Kai learns from it.',
      img: kaiComicPhotos.photo3,
      color: 'text-blue-500',
      badgeBg: 'bg-blue-500'
    },
    {
      id: '03',
      title: 'PRECISION',
      text: 'Swiss-level detail. Nothing left to chance.',
      img: kaiComicPhotos.photo2,
      color: 'text-purple-600',
      badgeBg: 'bg-purple-600'
    },
    {
      id: '04',
      title: 'COLLABORATION',
      text: 'Growth happens together. Always.',
      img: kaiComicPhotos.photo4,
      color: 'text-orange-500',
      badgeBg: 'bg-orange-500'
    }
  ];

  return (
    <main className="bg-white min-h-screen selection:bg-blue-500/30 text-[#020617] font-sans">
      
      {/* --- HERO SECTION --- */}
      <section id="origin" className="relative min-h-[110vh] flex items-center pt-20 overflow-hidden bg-[#f8fafc]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={comicHeroImageUrl} 
            alt="Comic Cover" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Subtle overlay to ensure text readability if needed, though image seems clear on the left */}
          <div className="absolute inset-0 bg-white/10 lg:bg-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:-mt-20">
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
                className="text-5xl md:text-[72px] font-black leading-[1.1] tracking-tighter mb-4 text-[#001A3D]"
              >
                Every great <br />
                partnership <br />
                starts with <span className="text-blue-600">a story.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-700 text-lg font-medium leading-relaxed mb-10 max-w-md"
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
                <button 
                  onClick={() => onNavigate('about')}
                  className="bg-[#1a2b4b] text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#001A3D] transition-all shadow-xl shadow-blue-900/20"
                >
                  <PlayIcon className="w-4 h-4 fill-current" /> EXPLORE THE STORY
                </button>
                <button className="bg-white text-[#001A3D] border-2 border-gray-200 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                  <BookOpenIcon className="w-4 h-4" /> VIEW COMICS <ChevronRightIcon className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
            
            {/* Empty div for layout balance on large screens */}
            <div className="hidden lg:block h-[400px]" />
          </div>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="pb-6 bg-white relative z-30">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#E8E8E8] rounded-[2rem] p-8 md:p-12 border border-gray-200 shadow-xl -mt-24 max-w-6xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 pt-2">
                <div className="w-16 h-16 bg-transparent flex items-center justify-center">
                   <span className="text-7xl text-blue-500 font-serif leading-none">“</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[#001A3D] text-lg md:text-xl font-medium leading-relaxed italic mb-4">
                  From his first breath in the Rhine, Kai has been shaped by flow, precision and balance. <br />
                  He understands buildings the way water understands its path — naturally, efficiently, without friction. <br />
                  In a world full of noise and complexity, he brings quiet control.
                </p>
                <p className="text-blue-600 font-black text-xl italic">
                  That's the philosophy behind everything we do.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- THE LEGEND OF KAI SECTION --- */}
      <section className="py-24 bg-white relative overflow-hidden -mt-12">
        {/* Decorative Plant/Leaf */}
        <div className="absolute top-[15%] right-[22%] w-48 h-48 opacity-15 pointer-events-none z-0 rotate-12">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-800 w-full h-full">
            <path d="M12 22C12 22 12 18 12 12C12 6 16 2 16 2C16 2 14 6 12 12C10 18 12 22 12 22Z" fill="currentColor"/>
            <path d="M12 12C12 12 15 10 19 10C23 10 22 6 22 6C22 6 19 7 15 9C11 11 12 12 12 12Z" fill="currentColor"/>
            <path d="M12 12C12 12 9 10 5 10C1 10 2 6 2 6C2 6 5 7 9 9C13 11 12 12 12 12Z" fill="currentColor"/>
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-12 relative">
            <div className="absolute -top-6 -left-4 transform -rotate-12 hidden md:block">
              <div className="bg-yellow-400 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                <span className="text-black font-black text-2xl italic tracking-tighter">KAI!</span>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 border-2 border-black rotate-45" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-black -rotate-12" />
              </div>
            </div>
            <p className="text-[#001A3D] font-black text-[14px] uppercase tracking-tight mb-1 ml-0 md:ml-20">THE LEGEND OF KAI</p>
            <p className="text-gray-600 font-medium text-lg ml-0 md:ml-20">Lessons from the deep. Applied to everything we do.</p>
          </div>

          <div className="relative">
            {/* Hand-drawn Arrow */}
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden xl:block">
              <svg width="40" height="80" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500 opacity-60">
                <path d="M5 5C15 15 35 30 35 50C35 65 20 75 5 75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M15 70L5 75L12 82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {legendCards.map((card, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full group transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    i % 2 === 0 ? 'rotate-1' : '-rotate-1'
                  }`}
                >
                  <div className="relative aspect-[1.2/1] overflow-hidden border-b-[3px] border-black">
                    <div className={`absolute top-2 left-2 z-20 ${card.badgeBg} text-white w-8 h-8 border-2 border-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                      {card.id}
                    </div>
                    <img 
                      src={card.img} 
                      alt={card.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    {/* Halftone Overlay Effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col bg-white relative">
                    {/* Caption Box Accent */}
                    <div className="absolute -top-4 right-4 bg-yellow-300 border-2 border-black px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
                      KAI LOG: {card.id}
                    </div>
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 border-2 border-black text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${card.badgeBg} text-white`}>
                        {card.title}
                      </span>
                    </div>
                    <p className="text-black text-sm font-bold leading-tight font-sans">
                      {card.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- COMICS WITH PURPOSE SECTION --- */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="bg-green-50 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-sm border border-green-100/50">
            {/* Subtle Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
                 style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
            
            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left: Comic Cover Display */}
              <div className="lg:col-span-4 xl:col-span-3 relative">
                <div className="relative z-20">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-1000 max-w-[320px] mx-auto lg:max-w-none z-10">
                      {/* Dynamic Shadow */}
                      <div className="absolute inset-0 bg-black/10 blur-2xl translate-x-6 translate-y-6 rounded-2xl rotate-3" />
                      
                      {/* The Single Comic Cover */}
                      <div className="relative aspect-[3/4] shadow-2xl rounded-2xl overflow-hidden border-4 border-white bg-white">
                        <img 
                          src={comicCovers[0]} 
                          alt="Comic Cover" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        {/* Subtle Gloss Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/5 pointer-events-none" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Decorative Stars */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                      rotate: [0, 90, 0]
                    }}
                    transition={{ 
                      duration: 3 + i, 
                      repeat: Infinity, 
                      delay: i * 0.5 
                    }}
                    className="absolute text-yellow-400 pointer-events-none"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      fontSize: `${Math.random() * 20 + 10}px`
                    }}
                  >
                    ⭐
                  </motion.div>
                ))}
              </div>

              {/* Right: Content Area */}
              <div className="lg:col-span-8 xl:col-span-9">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                  <div className="flex-1">
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="text-green-700 font-black text-[10px] uppercase tracking-[0.5em] mb-3"
                    >
                      COMICS WITH PURPOSE
                    </motion.p>
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl md:text-5xl font-black tracking-tighter leading-none text-[#001A3D] mb-4"
                    >
                      Magical stories <br className="hidden md:block" /> for a better world!
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-600 text-base md:text-lg font-medium leading-relaxed max-w-2xl mb-4"
                    >
                      Join Kai on amazing adventures! Our comics aren't just fun to read—they help kids everywhere. 
                      Every book you get helps us do good things for the planet and people in need.
                      <span className="text-green-600 font-black ml-2 inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-sm">
                        <HeartIcon size={16} className="fill-current" /> 25% of profits go to charity!
                      </span>
                    </motion.p>
                  </div>

                  {/* Handwritten Text - Right Aligned */}
                  <motion.div 
                    initial={{ opacity: 0, rotate: 5 }}
                    whileInView={{ opacity: 1, rotate: -2 }}
                    className="hidden xl:block shrink-0 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm"
                  >
                    <div className="flex gap-6">
                      <p className="font-handwriting text-[22px] text-gray-800 leading-tight">Real stories.</p>
                      <p className="font-handwriting text-[22px] text-gray-800 leading-tight">Real people.</p>
                      <p className="font-handwriting text-[22px] text-gray-800 leading-tight">Real impact.</p>
                    </div>
                    <div className="mt-1">
                      <svg width="100%" height="10" viewBox="0 0 300 14" fill="none" preserveAspectRatio="none">
                        <path d="M4 11C50 11 100 2 150 2C200 2 250 11 296 11" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                {/* Process Flow - Clean White Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                  {/* Decorative Leaf - Right */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 pointer-events-none z-0 rotate-45">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-800/30 w-full h-full">
                      <path d="M80 180C80 180 90 150 110 130C130 110 160 120 160 120C160 120 130 110 110 130C90 150 80 180 80 180Z" fill="currentColor"/>
                    </svg>
                  </div>

                  {/* You buy a comic - Flipping Emoji */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-green-100 flex flex-col items-center text-center gap-3 group transition-all duration-300 hover:shadow-md hover:border-green-200"
                  >
                    <motion.div 
                      animate={{ 
                        rotateY: [0, -20, 20, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-4xl"
                    >
                      📖
                    </motion.div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-tight">You buy <br /> a comic</p>
                  </motion.div>
                  
                  {/* 25% Profits - Heartbeat Emoji */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-green-100 flex flex-col items-center text-center gap-3 group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-green-200"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1, 1.2, 1],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-4xl relative z-10"
                      >
                        ❤️
                      </motion.div>
                      {/* Mini Hearts Emitter */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5, y: 0, x: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.8],
                            y: -50 - (i * 15),
                            x: (i % 2 === 0 ? 25 : -25) * (i + 1)
                          }}
                          transition={{ 
                            duration: 2.5, 
                            repeat: Infinity, 
                            delay: i * 0.8,
                            ease: "easeOut"
                          }}
                          className="absolute top-0 left-0 text-lg pointer-events-none"
                        >
                          ❤️
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-tight">25% of profits <br /> go to charity</p>
                  </motion.div>

                  {/* Together - Impact Emoji */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-green-100 flex flex-col items-center text-center gap-3 group transition-all duration-300 hover:shadow-md hover:border-green-200"
                  >
                    <motion.div 
                      animate={{ 
                        rotate: [0, 360],
                      }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      style={{ 
                        transformOrigin: "center center",
                        display: "inline-block",
                        transform: "rotate(23.5deg)" // Earth's axial tilt
                      }}
                      className="text-4xl drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    >
                      🌍
                    </motion.div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-tight">Creating <br /> global impact</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY THE COMICS EXIST SECTION --- */}
      <section className="py-24 bg-[#F8FAFF] relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }} />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4"
            >
              WHY THE COMICS EXIST
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-[#001A3D] tracking-tighter leading-[0.9]"
            >
              Built to be <span className="text-blue-600">understood.</span><br />
              <span className="text-gray-400">Not just delivered.</span>
            </motion.h2>
          </div>

          {/* Top Grid (2x2) */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              {
                title: "Beyond services",
                text: "Created to express what Kraken stands for beyond services — care, responsibility, and respect for essential work.",
                emoji: "🚩",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                title: "What often goes unseen",
                text: "We highlight a simple truth: cleaning and facility work do far more than support spaces. We shape everyday life within them.",
                emoji: "👁️",
                color: "text-indigo-600",
                bg: "bg-indigo-50"
              },
              {
                title: "Built with personal meaning",
                text: "Behind them, there is also a personal intention — to create something the founder's son could one day understand as a reflection of values, not just business.",
                emoji: "👨‍👦",
                color: "text-purple-600",
                bg: "bg-purple-50"
              },
              {
                title: "Invisible value, made visible",
                text: "A way to show that meaningful work matters, that care leaves a mark, and that the people behind it deserve to be seen.",
                emoji: "✨",
                color: "text-amber-600",
                bg: "bg-amber-50"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-100/50 hover:shadow-md transition-shadow flex gap-6 group"
              >
                <div className={`${card.bg} ${card.color} w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {card.emoji}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#001A3D] mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {card.text.split('beyond services').map((part, index) => (
                      <React.Fragment key={index}>
                        {part}
                        {index === 0 && card.title === "Beyond services" && <span className="font-black text-[#001A3D]">beyond services</span>}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quote Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex gap-6 mb-20 max-w-4xl mx-auto items-start"
          >
            <div className="bg-blue-600 p-2 rounded-xl shrink-0 mt-0 mr-0 text-[14px]">
              <QuoteIcon className="text-white" size={24} fill="currentColor" />
            </div>
            <div>
              <p className="italic font-bold text-[26px] font-['Arial'] text-[#001A3D] leading-tight">
                Because some stories <span className="italic text-gray-500">do more than tell people</span> what a company does.
              </p>
              <p className="font-bold italic text-[26px] font-['Arial'] text-blue-600 mt-2 no-underline">They remind people why it matters.</p>
            </div>
          </motion.div>

          {/* Main Visual with Sticky Note */}
          <div className="relative max-w-5xl mx-auto mb-0 group">
            <img 
              src="https://www.dropbox.com/scl/fi/smhd5m0081gapganenbfs/Mastering-the-chaos-of-property-management.png?rlkey=mlldh0vpbqpzmwvziz44x1bw4&st=m8dght6h&raw=1" 
              alt="Mastering the chaos of property management" 
              className="w-full h-auto block transition-transform duration-1000 group-hover:scale-105"
              style={{ 
                maskImage: 'radial-gradient(ellipse at center, black 0%, black 20%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, black 20%, transparent 75%)'
              }}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            {/* Sticky Note */}
            <motion.div 
              initial={{ opacity: 0, x: 20, rotate: 10 }}
              whileInView={{ opacity: 1, x: 0, rotate: 3 }}
              className="absolute top-1/3 -right-4 bg-[#FFFF88] p-4 shadow-xl border-t-4 border-green-500/20 max-w-[180px] hidden md:block z-20"
            >
              <p className="font-handwriting text-lg text-gray-800 leading-tight">
                To make visible what usually goes unseen.
              </p>
              {/* Push pin effect */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-inner" />
            </motion.div>
          </div>

          {/* Blue Cards (1x3) */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Environmental care",
                text: "Teaching that how we care for spaces reflects how we care for the world around us.",
                emoji: "🌿"
              },
              {
                title: "Respect for unseen work",
                text: "Giving visibility to the people whose daily effort keeps everything running.",
                emoji: "🤝"
              },
              {
                title: "A legacy for the next generation",
                text: "Creating stories that help children see pride, responsibility, and care in meaningful work.",
                emoji: "🌱"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#001A3D] p-10 rounded-[2.5rem] text-white relative overflow-hidden group"
              >
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="text-4xl mb-6 opacity-90 group-hover:scale-110 transition-transform origin-left">
                  {card.emoji}
                </div>
                <h4 className="text-xl font-black mb-3">{card.title}</h4>
                <p className="text-blue-100/70 font-medium leading-relaxed">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Footer Section */}
          <div className="border-t border-blue-100 pt-8 flex flex-row justify-between items-center gap-6 md:gap-12">
            <div className="text-left">
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.5em] mb-4">STORIES WITH REAL WORLD MEANING.</p>
              <h3 className="text-xl md:text-5xl font-black text-[#001A3D] tracking-tighter leading-none">
                Not just a service.<br />
                A story that <span className="text-blue-600">stays with you.</span>
              </h3>
            </div>
            
            <div className="flex flex-row justify-center items-center gap-4 md:gap-12 shrink-0">
              {[
                { label: "You discover the story", icon: BookOpenIcon },
                { label: "You see the unseen", icon: EyeIcon },
                { label: "You understand the impact", icon: BarChart3Icon }
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="bg-white w-16 h-16 rounded-2xl shadow-sm border border-blue-50 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                      <step.icon size={28} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-tight">
                      {step.label.split(' ').slice(0, 2).join(' ')}<br />
                      {step.label.split(' ').slice(2).join(' ')}
                    </p>
                  </div>
                  {i < 2 && (
                    <ChevronRightIcon className="text-gray-200 hidden md:block" size={24} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-[#001A3D] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
            {/* Background Kai Peek */}
            <img 
              src={mascotImageUrl} 
              alt="" 
              className="absolute -bottom-10 -left-10 w-40 opacity-20 grayscale pointer-events-none" 
              loading="lazy"
            />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <p className="text-blue-400 font-black text-[9px] uppercase tracking-[0.5em] mb-6">READY TO BRING ORDER TO YOUR SPACE?</p>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none mb-8">
                Let's build a partnership <br />
                you can <span className="text-blue-400">rely on.</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => onNavigate('consultation')}
                  className="bg-green-500 text-[#001A3D] px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-green-400 transition-all shadow-xl shadow-green-500/20"
                >
                  GET YOUR QUOTE IN MINUTES →
                </button>
                <button 
                  onClick={() => onNavigate('services-page')}
                  className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
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
