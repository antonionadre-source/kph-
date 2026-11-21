import React from 'react';
import { Phone } from 'lucide-react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
export default function SalesActionBar({onNavigate,currentPage}:{onNavigate:(page:string)=>void;currentPage:string}) {
  const {language}=useTranslation(),copy=salesCopy(language);
  if(['dashboard','login','register','consultation','commercial-quote','review-invite','kontakt','careers'].includes(currentPage))return null;
  return <div className="kraken-action-bar"><button className="kraken-button kraken-primary" onClick={()=>onNavigate('/quote')}>{copy.quote}</button><a href="tel:+41774505705" className="kraken-button kraken-secondary"><Phone size={17} aria-hidden="true"/>{copy.call}</a></div>;
}
