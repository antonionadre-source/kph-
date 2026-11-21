import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n';
import { catalogCopy } from '../src/content/catalogCopy';
import { AreaDirectory, Breadcrumbs, JsonLd, PageEnd, PageIntro, PageLink, ServiceRows, regionName, regionPath, titleInPlace, useLocationContext } from './catalog/CatalogUI';

interface RegionHubPageProps { regionId: 'schaffhausen'|'winterthur'|'zuerich'; onNavigate: (page:string)=>void; }
export const RegionHubPage: React.FC<RegionHubPageProps> = ({regionId,onNavigate}) => {
  const { language } = useTranslation(); const copy=catalogCopy(language); const name=regionName(language,regionId);
  useLocationContext();
  const city=regionId==='zuerich'?'zurich':regionId; const imageCity=regionId==='zuerich'?'zurich':regionId;
  return <main className="kraken-page" key={regionId}>
    <JsonLd value={{'@context':'https://schema.org','@type':'CollectionPage',name:titleInPlace(language,name),description:copy.locationIntro,url:'https://krakenpfm.ch'+regionPath(regionId),inLanguage:language}} />
    <Breadcrumbs items={[{text:copy.home,to:'/'},{text:copy.coverageLabel,to:'/einsatzgebiete'},{text:name}]} onNavigate={onNavigate} />
    <PageIntro eyebrow={copy.coverageLabel} title={titleInPlace(language,name)} intro={copy.locationIntro} image={'/kai-calendar/optimized/kai/kai-'+imageCity+'-320.webp'} alt="" contain>
      <PageLink to="#municipalities" onNavigate={onNavigate} className="kraken-button kraken-primary">{copy.placesTitle}<ArrowDown size={18} aria-hidden="true" /></PageLink>
      <PageLink to="/kontakt" onNavigate={onNavigate} className="kraken-button kraken-secondary">{copy.contact}<ArrowUpRight size={18} aria-hidden="true" /></PageLink>
    </PageIntro>
    <AreaDirectory onNavigate={onNavigate} fixedRegion={regionId} />
    <ServiceRows municipality={city} onNavigate={onNavigate} />
    <PageEnd onNavigate={onNavigate} />
  </main>;
};
