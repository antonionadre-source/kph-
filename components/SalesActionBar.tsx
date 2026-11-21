import React from 'react';
import { Phone } from 'lucide-react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';

export default function SalesActionBar({ onNavigate, currentPage }: { onNavigate: (page: string) => void; currentPage: string }) {
  const { language } = useTranslation(), copy = salesCopy(language);
  if (['dashboard','login','register','consultation','commercial-quote','review-invite'].includes(currentPage)) return null;
  return <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 border-t border-slate-200 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] grid grid-cols-[1fr_auto] gap-2 backdrop-blur-sm">
    <button className="kraken-button kraken-primary !min-h-12 !px-3 !text-sm" onClick={()=>onNavigate('/quote')}>{copy.quote}</button>
    <a href="tel:+41774505705" className="kraken-button kraken-secondary !min-h-12 !px-4 !text-sm"><Phone size={18} aria-hidden="true" /><span>{copy.call}</span></a>
  </div>;
}
