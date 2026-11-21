import React from 'react';
import { Check, Files, UserRound } from 'lucide-react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
import { brandCopy } from '../src/content/brandCopy';
import { useAuth } from './Auth';
import { useKaiMoment } from './useKaiMoment';

interface ClientsPageProps { onNavigate?:(page:string)=>void; }
export default function Clients({onNavigate}:ClientsPageProps) {
  const {language}=useTranslation(),brand=brandCopy(language),copy=salesCopy(language),{user}=useAuth(),media=useKaiMoment();
  const go=(path:string)=>{if(onNavigate)onNavigate(path);else window.location.assign(path);};
  return <main className="kraken-page"><div className="kraken-container grid items-center gap-12 lg:grid-cols-2">
    <div><p className="kraken-eyebrow">{copy.account}</p><h1 className="kraken-heading">{brand.portalTitle}</h1><p className="kraken-description">{brand.portalIntro}</p><ul className="my-7 grid gap-4">{brand.portalFeatures.map(text=><li key={text} className="flex gap-3 items-center text-base text-[#50647c]"><Check size={18} className="text-[#1464ad] shrink-0" aria-hidden="true"/>{text}</li>)}</ul><div className="flex flex-wrap gap-3"><button className="kraken-button kraken-primary" onClick={()=>go(user?'/dashboard':'/login')}><UserRound size={17} aria-hidden="true"/>{user?copy.account:brand.signIn}</button>{!user&&<button className="kraken-button kraken-secondary" onClick={()=>go('/register')}>{brand.register}</button>}</div></div>
    <div className="rounded-3xl border border-[#dce5f0] bg-[#f3f7fc] p-7 sm:p-10"><div className="mb-7 flex items-center gap-4"><img src={media.avatar} width="80" height="80" alt="Kai" className="rounded-2xl"/><div><p className="text-lg font-bold text-[#032b59]">Kraken PFM</p><p className="text-base text-[#50647c]">{copy.account}</p></div></div><div className="rounded-2xl bg-white border border-[#dce5f0] p-6"><Files size={28} className="mb-5 text-[#1464ad]" aria-hidden="true"/><p className="text-lg font-semibold text-[#032b59]">{brand.portalFeatures[0]}</p><p className="kraken-description">{brand.portalFeatures[1]}</p></div></div>
  </div></main>;
}
// Unverified brand logos are not presented as customer endorsements.
export const ClientCarousel:React.FC=()=>null;
