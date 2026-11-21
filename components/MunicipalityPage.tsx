import React, { useEffect } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n';
import { catalogCopy } from '../src/content/catalogCopy';
import { getMunicipalityUrl } from '../seoConfig';
import { Breadcrumbs, JsonLd, MissingPage, PageEnd, PageIntro, PageLink, ServiceRows, municipalityFor, municipalityName, regionName, regionPath, titleInPlace, useLocationContext } from './catalog/CatalogUI';

interface MunicipalityPageProps { municipalitySlug:string; onNavigate:(page:string)=>void; }
export const MunicipalityPage: React.FC<MunicipalityPageProps> = ({municipalitySlug,onNavigate}) => {
  const { language } = useTranslation(); const copy=catalogCopy(language); const mun=municipalityFor(municipalitySlug);
  useLocationContext(municipalitySlug);
  useEffect(() => {
    if (!mun) return;
    let robots=document.querySelector<HTMLMetaElement>('meta[name="robots"]'); const previous=robots?.content;
    const created=!robots; if (!robots) {robots=document.createElement('meta');robots.name='robots';document.head.appendChild(robots);}
    robots.content=mun.indexable?'index, follow':'noindex, follow';
    return () => { if(created) robots?.remove(); else if(robots) robots.content=previous || 'index, follow'; };
  },[mun]);
  if(!mun) return <MissingPage onNavigate={onNavigate} />;
  const place=municipalityName(language,mun.slug); const title=titleInPlace(language,place); const nearby=mun.nearbySlugs.map(municipalityFor).filter(Boolean);
  const image=mun.region==='thurgau'?'/kai-services/thurgau.webp':'/kai-calendar/optimized/kai/kai-'+(mun.region==='zuerich'?'zurich':mun.region)+'-320.webp';
  return <main className="kraken-page">
    <JsonLd value={{'@context':'https://schema.org','@type':'CollectionPage',name:title,description:copy.locationIntro,url:'https://krakenpfm.ch'+getMunicipalityUrl(mun.slug),inLanguage:language,about:{'@type':'Place',name:mun.name,address:{'@type':'PostalAddress',addressLocality:mun.name,addressRegion:mun.canton,addressCountry:'CH',postalCode:mun.plz[0]}}}} />
    <Breadcrumbs items={[{text:copy.home,to:'/'},{text:copy.coverageLabel,to:'/einsatzgebiete'},{text:regionName(language,mun.region),to:regionPath(mun.region)},{text:place}]} onNavigate={onNavigate} />
    <PageIntro eyebrow={regionName(language,mun.region)} title={title} intro={copy.locationIntro} image={image} alt="" contain={mun.region!=='thurgau'}>
      <PageLink to="#local-services" onNavigate={onNavigate} className="kraken-button kraken-primary">{copy.all}<ArrowDown size={18} aria-hidden="true" /></PageLink>
      <PageLink to="/kontakt" onNavigate={onNavigate} className="kraken-button kraken-secondary">{copy.contact}<ArrowUpRight size={18} aria-hidden="true" /></PageLink>
    </PageIntro>
    <section className="kraken-container"><dl className="grid sm:grid-cols-3 gap-4 rounded-2xl border border-[#dce6e8] bg-white p-5 sm:p-7">{[[copy.locality,place],[copy.postal,mun.plz.join(', ')],[copy.canton,mun.canton]].map(([label,value])=><div key={label}><dt className="text-sm text-[#526574]">{label}</dt><dd className="mt-2 text-lg font-semibold text-[#082b45]">{value}</dd></div>)}</dl></section>
    <div id="local-services" className="scroll-mt-28"><ServiceRows municipality={mun.slug} onNavigate={onNavigate} /></div>
    {nearby.length>0 && <section className="kraken-container pb-10 sm:pb-14"><h2 className="text-2xl sm:text-3xl font-semibold text-[#082b45] tracking-tight mb-6">{copy.nearby}</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{nearby.map(other=><PageLink key={other!.slug} to={getMunicipalityUrl(other!.slug)} onNavigate={onNavigate} className="rounded-xl border border-[#dce6e8] bg-white p-5 flex items-center justify-between gap-3 font-medium text-[#082b45] hover:border-[#087f73]">{municipalityName(language,other!.slug)}<ArrowUpRight size={17} aria-hidden="true" /></PageLink>)}</div></section>}
    <PageEnd onNavigate={onNavigate} />
  </main>;
};
