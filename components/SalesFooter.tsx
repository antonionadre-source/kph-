import React from 'react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
const companyLogoWhiteUrl = '/kai-calendar/optimized/brand/logo-white-480.webp';

export default function SalesFooter({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { language, t } = useTranslation(), copy = salesCopy(language);
  const go=(event:React.MouseEvent<HTMLAnchorElement>,path:string)=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();onNavigate(path);};
  const groups=[[[copy.services,'/services'],[copy.business,'/commercial'],[t('nav.about'),'/about'],[t('nav.sustainability'),'/sustainability'],[t('nav.blog'),'/blog']],[[copy.coverage,'/einsatzgebiete'],[copy.talk,'/kontakt'],[t('footer.privacy'),'/gdpr'],['Impressum','/impressum'],[t('footer.terms'),'/terms'],[t('footer.careers'),'/careers']]];
  return <footer className="bg-[#062e51] text-white py-12 pb-28 md:pb-12"><div className="kraken-container grid md:grid-cols-[1.5fr_1fr_1fr] gap-9">
    <div><img src={companyLogoWhiteUrl} width="210" height="65" alt="Kraken Properties and Facilities Management" className="w-52 h-16 object-contain mb-5" loading="lazy" /><address className="not-italic text-base leading-relaxed text-slate-300">Seewadelstrasse 3<br />8203 Schaffhausen<br /><a className="inline-block mt-4 hover:text-white" href="tel:+41774505705">+41 77 450 57 05</a><br /><a className="hover:text-white" href="mailto:info@krakenpfm.ch">info@krakenpfm.ch</a></address></div>
    {groups.map((group,index)=><nav key={index} aria-label={index===0?copy.services:'Information'} className="grid content-start gap-1">{group.map(([label,path])=><a key={path} href={path} onClick={event=>go(event,path)} className="py-2 text-base text-slate-300 hover:text-white w-fit">{label?.includes('.')?path.replace('/',''):label}</a>)}</nav>)}
    <div className="md:col-span-3 pt-6 border-t border-white/15 flex flex-col sm:flex-row gap-3 justify-between text-sm text-slate-400"><span>© {new Date().getFullYear()} Kraken Properties and Facilities Management</span><a href="/dashboard" onClick={e=>go(e,'/dashboard')} className="text-slate-300">{copy.account}</a></div>
  </div></footer>;
}
