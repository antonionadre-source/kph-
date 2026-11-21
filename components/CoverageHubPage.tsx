import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { useTranslation } from '../i18n';
import { catalogCopy } from '../src/content/catalogCopy';
import { AreaDirectory, AREA_REGIONS, Breadcrumbs, JsonLd, PageEnd, PageIntro, PageLink, RegionTiles, type AreaRegion } from './catalog/CatalogUI';

interface CoverageHubPageProps { onNavigate: (target: string) => void; }
export const CoverageHubPage: React.FC<CoverageHubPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation(); const copy = catalogCopy(language);
  const [region,setRegion] = useState(() => { const query = new URLSearchParams(typeof window==='undefined'?'':window.location.search).get('region'); return AREA_REGIONS.includes(query as AreaRegion) ? query! : 'all'; });
  const chooseRegion = (value:string) => { setRegion(value); const url=new URL(window.location.href); if(value==='all') url.searchParams.delete('region'); else url.searchParams.set('region',value); history.replaceState(null,'',url.pathname+url.search+'#municipalities'); };
  const selectThurgau = () => { chooseRegion('thurgau'); requestAnimationFrame(() => document.getElementById('municipalities')?.scrollIntoView({block:'start'})); };
  return <main className="kraken-page">
    <JsonLd value={{'@context':'https://schema.org','@type':'CollectionPage',name:copy.coverageTitle,description:copy.coverageIntro,url:'https://krakenpfm.ch/einsatzgebiete',inLanguage:language}} />
    <Breadcrumbs items={[{text:copy.home,to:'/'},{text:copy.coverageLabel}]} onNavigate={onNavigate} />
    <PageIntro eyebrow={copy.coverageLabel} title={copy.coverageTitle} intro={copy.coverageIntro} image="/kai-services/thurgau.webp" alt="">
      <PageLink to="#municipalities" onNavigate={onNavigate} className="kraken-button kraken-primary">{copy.placesTitle}<ArrowDown size={18} aria-hidden="true" /></PageLink>
    </PageIntro>
    <section className="kraken-container pb-3"><RegionTiles onNavigate={onNavigate} onThurgau={selectThurgau} /></section>
    <AreaDirectory onNavigate={onNavigate} selectedRegion={region} onRegionChange={chooseRegion} />
    <PageEnd onNavigate={onNavigate} />
  </main>;
};
export default CoverageHubPage;
