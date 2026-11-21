import React from 'react';
import { useTranslation } from '../i18n';
import { comicCovers } from '../assets';
import { motion } from 'motion/react';
import { ShoppingCart, BookOpen, ArrowRight } from 'lucide-react';

interface ComicShopPageProps {
  onNavigate: (page: string) => void;
  cart: any[];
  setCart: (cart: any[]) => void;
}

const shopCopy: Record<string, { eyebrow: string; title: string; intro: string; story: string; add: string; review: string }> = {
  de: { eyebrow: 'Die Geschichten von Kai', title: 'Eine andere Seite von Kai.', intro: 'Entdecken Sie Kais Welt und fügen Sie ein Exemplar Ihrer Auswahl hinzu.', story: 'Die Geschichte', add: 'In den Warenkorb', review: 'Auswahl prüfen' },
  en: { eyebrow: 'Stories from Kai', title: 'Another side of Kai.', intro: 'Discover Kai’s world and add a copy to your selection.', story: 'The story', add: 'Add to basket', review: 'Review your selection' },
  fr: { eyebrow: 'Les histoires de Kai', title: 'Une autre facette de Kai.', intro: 'Découvrez l’univers de Kai et ajoutez un exemplaire à votre sélection.', story: 'L’histoire', add: 'Ajouter au panier', review: 'Vérifier votre sélection' },
  it: { eyebrow: 'Le storie di Kai', title: 'Un altro lato di Kai.', intro: 'Scopri il mondo di Kai e aggiungi una copia alla tua selezione.', story: 'La storia', add: 'Aggiungi al carrello', review: 'Controlla la selezione' },
  es: { eyebrow: 'Las historias de Kai', title: 'Otra faceta de Kai.', intro: 'Descubre el universo de Kai y añade un ejemplar a tu selección.', story: 'La historia', add: 'Añadir a la cesta', review: 'Revisar selección' },
  pt: { eyebrow: 'As histórias do Kai', title: 'Outra faceta do Kai.', intro: 'Descubra o mundo do Kai e adicione um exemplar à sua seleção.', story: 'A história', add: 'Adicionar ao cesto', review: 'Rever seleção' },
};

const ComicShopPage: React.FC<ComicShopPageProps> = ({ onNavigate, cart, setCart }) => {
  const { t, language } = useTranslation();
  const copy = shopCopy[language.split('-')[0]] || shopCopy.de;

  const comics = [
    {
      id: 'comic-02',
      title: 'The Legend of Kai',
      price: 15.00,
      image: comicCovers[1],
      description: 'A deeper look into the Kraken protocol as Kai teams up with the local engineering squad to solve a massive infrastructure puzzle.',
      category: 'Edu-Action',
      rating: 5,
      charity: '25% to Sustainable Engineering'
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
    <main className="kraken-shop min-h-screen bg-[#f4f8f8] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 max-w-2xl"><p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#087f73]"><BookOpen aria-hidden="true" className="h-5 w-5" />{copy.eyebrow}</p><h1 className="text-3xl font-semibold leading-tight text-[#082b45] sm:text-4xl">{copy.title}</h1><p className="mt-4 text-base leading-relaxed text-[#526574]">{copy.intro}</p></header>
        <div className="space-y-6">
          {comics.map((comic, i) => <motion.article key={comic.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="grid min-w-0 overflow-hidden rounded-3xl border border-[#dce6e8] bg-white shadow-sm md:grid-cols-[17rem_minmax(0,1fr)]">
            <div className="flex items-start justify-center bg-[#eef7f5] p-6 sm:p-8"><img src={comic.image} alt={comic.title} width="360" height="480" decoding="async" className="aspect-[3/4] w-full max-w-64 rounded-xl object-contain" referrerPolicy="no-referrer" /></div>
            <div className="min-w-0 p-5 sm:p-8">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><h2 className="text-2xl font-semibold leading-tight text-[#082b45]">{comic.title}</h2><p className="text-2xl font-semibold tabular-nums text-[#087f73]">CHF {comic.price.toFixed(2)}</p></div>
              <h3 className="mb-3 text-lg font-semibold text-[#082b45]">{copy.story}</h3>
              <div className="space-y-3 text-base leading-relaxed text-[#526574]"><p>{t('comic.backCover.p1')}</p><p>{t('comic.backCover.p2')}</p><p>{t('comic.backCover.p3')}</p><p className="font-medium text-[#082b45]">{t('comic.backCover.p4')}</p></div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><button type="button" onClick={() => addToCart(comic)} className="kraken-control inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#087f73] px-5 py-3 text-base font-semibold text-white hover:bg-[#06695f]"><ShoppingCart aria-hidden="true" className="h-5 w-5" />{copy.add}</button><button type="button" onClick={() => onNavigate('consultation')} className="kraken-control inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dce6e8] bg-white px-5 py-3 text-base font-semibold text-[#082b45] hover:bg-[#f4f8f8]">{copy.review}<ArrowRight aria-hidden="true" className="h-5 w-5" /></button></div>
            </div>
          </motion.article>)}
        </div>
      </div>
    </main>
  );
};

export default ComicShopPage;
