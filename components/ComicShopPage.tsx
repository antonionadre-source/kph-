import React from 'react';
import { useTranslation } from '../i18n';
import { comicCovers } from '../assets';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Info, BookOpen, Star, ArrowRight, Sparkles } from 'lucide-react';

interface ComicShopPageProps {
  onNavigate: (page: string) => void;
  cart: any[];
  setCart: (cart: any[]) => void;
}

const ComicShopPage: React.FC<ComicShopPageProps> = ({ onNavigate, cart, setCart }) => {
  const { t } = useTranslation();

  const comics = [
    {
      id: 'comic-01',
      title: 'Kai vs. The Cold Invasion',
      price: 15.00,
      image: comicCovers[0],
      description: 'Join Kai as he protects Schaffhausen from a mysterious icy storm that threatens the city\'s precision systems.',
      category: 'Adventure',
      rating: 5,
      charity: '25% to Local Youth Programs'
    },
    {
      id: 'comic-02',
      title: 'Kraken Heroes vs. Ice Monsters',
      price: 15.00,
      image: comicCovers[1],
      description: 'A deeper look into the Kraken protocol as Kai teams up with the local engineering squad to solve a massive infrastructure puzzle.',
      category: 'Edu-Action',
      rating: 4.8,
      charity: '25% to Sustainable Engineering'
    },
    {
      id: 'comic-03',
      title: 'Kraken vs. Pest Plague Showdown',
      price: 15.00,
      image: comicCovers[2],
      description: 'Order vs Chaos. Kai must find the most efficient and eco-friendly way to balance the ecosystem without using harsh chemicals.',
      category: 'Strategy',
      rating: 4.9,
      charity: '25% to Biodiversity Research'
    },
    {
      id: 'comic-04',
      title: 'Kraken\'s Mission: Great Spaces',
      price: 15.00,
      image: comicCovers[3],
      description: 'The definitive guide to the Standard. Learn how structure and care can transform any environment into a place of success.',
      category: 'Inspiration',
      rating: 5,
      charity: '25% to Urban Renewal'
    }
  ];

  const addToCart = (comic: typeof comics[0]) => {
    const cartItem = {
      id: `${comic.id}-${Date.now()}`,
      type: 'comic-book',
      details: comic,
      price: comic.price,
      description: comic.title
    };
    setCart([...cart, cartItem]);
    
    // Optional: add a small visual indicator or toast here
  };

  return (
    <main className="bg-slate-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4"
          >
            THE SHOP
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-[#001A3D] tracking-tighter mb-6"
          >
            Own the <span className="text-blue-600">Legend.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 font-medium leading-relaxed"
          >
            Bring Kai's adventures into your home. Every purchase supports our 25% charity dividend for local community and environmental programs.
          </motion.p>
        </div>

        {/* Comics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {comics.map((comic, i) => (
            <motion.div 
              key={comic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col group"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
                <img 
                  src={comic.image} 
                  alt={comic.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    {comic.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center text-red-500 shadow-sm">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                </div>
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-[#001A3D]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8 text-center">
                  <p className="text-white text-xs font-medium leading-relaxed italic">
                    "{comic.description}"
                  </p>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-black text-[#001A3D] leading-tight flex-1 pr-4">{comic.title}</h3>
                  <div className="text-xl font-black text-blue-600">CHF {comic.price.toFixed(2)}</div>
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className={`w-3.5 h-3.5 ${idx < Math.floor(comic.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                  ))}
                  <span className="text-[10px] font-bold text-gray-400 ml-1">({comic.rating})</span>
                </div>

                <div className="mt-auto">
                  <div className="bg-emerald-50 rounded-xl p-3 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-bold text-emerald-700 leading-tight">
                      {comic.charity}
                    </p>
                  </div>

                  <button 
                    onClick={() => addToCart(comic)}
                    className="w-full bg-[#001A3D] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all group/btn active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    ADD TO BASKET
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-32 max-w-5xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Info className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-[#001A3D] leading-tight mb-6">
                Quality print. <br />
                Global standard.
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-1 shrink-0">
                    <BookOpen size={12} className="fill-current" />
                  </div>
                  <div>
                    <p className="font-bold text-[#001A3D] text-sm mb-1 uppercase tracking-widest">Premium Paper</p>
                    <p className="text-xs text-gray-500">Sustainably sourced, recycled heavy-duty cardstock for a premium feel that lasts.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-1 shrink-0">
                    <Sparkles size={12} className="fill-current" />
                  </div>
                  <div>
                    <p className="font-bold text-[#001A3D] text-sm mb-1 uppercase tracking-widest">Swiss Printing</p>
                    <p className="text-xs text-gray-500">Printed locally in Schaffhausen using non-toxic, eco-friendly inks.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-500/5 rounded-[3rem] blur-2xl group-hover:bg-blue-500/10 transition-all duration-700" />
              <div className="relative bg-slate-900 rounded-[2.5rem] p-8 aspect-video flex flex-col justify-center overflow-hidden">
                <p className="text-3xl font-black text-white italic leading-tight mb-6 z-10">
                  "The legend is meant to be shared."
                </p>
                <div className="flex items-center gap-4 z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-600" />
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-widest">Kai Official Log</p>
                    <p className="text-blue-400 text-[10px] font-medium">Issue #01 - Origin</p>
                  </div>
                </div>
                {/* Decorative Kai */}
                <div className="absolute -bottom-12 -right-12 w-48 h-48 opacity-20 pointer-events-none grayscale invert rotate-12">
                   <img src="https://www.dropbox.com/scl/fi/lifz7glh55z2v2uej66vb/IMG_3927.PNG.png?rlkey=wtvu8r5pu2eo26o9vfqd1kkpw&st=grzmg1bo&raw=1" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center">
          <button 
            onClick={() => onNavigate('consultation')}
            className="inline-flex items-center gap-3 text-[#001A3D] font-black text-xs uppercase tracking-[0.2em] hover:text-blue-600 transition-colors group"
          >
            VIEW YOUR BASKET & CHECKOUT <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default ComicShopPage;
