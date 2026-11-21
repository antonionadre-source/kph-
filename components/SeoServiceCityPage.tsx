import React, { lazy, Suspense } from 'react';
import { ArrowDown, MapPin, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n';
import { catalogCopy, fillCopy } from '../src/content/catalogCopy';
import { SERVICE_CATALOG, catalogService, serviceName, serviceDescription } from '../src/content/serviceCatalog';
import { getMunicipalityUrl } from '../seoConfig';
import { Breadcrumbs, JsonLd, MissingPage, PageEnd, PageIntro, PageLink, ProcessSection, ServiceCard, ServiceRequest, municipalityFor, municipalityName, regionName, useLocationContext } from './catalog/CatalogUI';

interface SeoServiceCityPageProps { cityId:string; serviceId:string; onNavigate:(page:string)=>void; }
const TransitLoadPlanner = lazy(() => import('./TransitLoadPlanner'));
const SeoServiceCityPage: React.FC<SeoServiceCityPageProps> = ({cityId,serviceId,onNavigate}) => {
  const { language }=useTranslation(); const copy=catalogCopy(language); const service=catalogService(serviceId.toLowerCase()); const mun=municipalityFor(cityId);
  useLocationContext(mun?.slug);
  if(!service || !mun) return <MissingPage onNavigate={onNavigate} />;
  const name=serviceName(language,service.id)!; const place=municipalityName(language,mun.slug); const title=fillCopy(copy.serviceIn,{service:name,place}); const description=serviceDescription(language,service.id)!;
  const url='https://krakenpfm.ch/services/'+cityId+'/'+serviceId;
  const related=SERVICE_CATALOG.filter(other=>other.id!==service.id && other.audience===service.audience).sort((a,b)=>Number(b.category===service.category)-Number(a.category===service.category)).slice(0,3);
  const crumbs=[{text:copy.home,to:'/'},{text:service.audience==='private'?copy.privateLabel:copy.businessLabel,to:service.audience==='private'?'/services':'/commercial'},{text:place,to:getMunicipalityUrl(mun.slug)},{text:name}];
  return <main className="kraken-page" id={'seo-page-'+cityId+'-'+serviceId}>
    <JsonLd value={{'@context':'https://schema.org','@graph':[{'@type':'Service','@id':url+'#service',name:title,description,url,serviceType:name,provider:{'@type':'Organization',name:'Kraken PFM',url:'https://krakenpfm.ch'},areaServed:{'@type':'Place',name:mun.name}},{'@type':'FAQPage',mainEntity:[{'@type':'Question',name:copy.faqQuestion,acceptedAnswer:{'@type':'Answer',text:copy.faqAnswer}}]},{'@type':'BreadcrumbList',itemListElement:crumbs.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.text,item:item.to?'https://krakenpfm.ch'+item.to:url}))}]}} />
    <Breadcrumbs items={crumbs} onNavigate={onNavigate} />
    <PageIntro eyebrow={regionName(language,mun.region)} title={title} intro={description} image={service.image} imageWidth={service.width} imageHeight={service.height} alt={name}>
      <ServiceRequest service={service} onNavigate={onNavigate} />
      <PageLink to="#details-section" onNavigate={onNavigate} className="kraken-button kraken-secondary">{copy.seeDetails}<ArrowDown size={18} aria-hidden="true" /></PageLink>
    </PageIntro>
    {service.id === 'moving-furniture' && <Suspense fallback={<div className="min-h-[42rem]" aria-hidden="true" />}><TransitLoadPlanner onNavigate={onNavigate} /></Suspense>}
    <section id="details-section" className="kraken-container py-10 sm:py-14 scroll-mt-28 grid lg:grid-cols-[1.5fr_1fr] gap-7 lg:gap-12">
      <div><p className="kraken-eyebrow">{copy.serviceSummary}</p><h2 className="text-2xl sm:text-3xl font-semibold text-[#082b45] tracking-tight mt-3">{copy.prepareTitle}</h2><p className="text-base leading-7 text-[#526574] mt-4 max-w-xl">{copy.prepareIntro}</p><ol className="mt-7 divide-y divide-[#dce6e8] border-y border-[#dce6e8]">{service.focus.map((key,index)=><li key={key} className="flex gap-4 py-5 items-start"><span className="text-sm font-medium text-[#087f73] pt-1">0{index+1}</span><h3 className="text-lg leading-7 font-medium text-[#082b45]">{copy[key]}</h3></li>)}</ol></div>
      <aside className="rounded-[1.5rem] bg-white border border-[#dce6e8] p-6 sm:p-8 h-fit"><MapPin size={25} strokeWidth={1.6} className="text-[#087f73]" aria-hidden="true" /><h2 className="text-xl font-semibold text-[#082b45] mt-4">{place}</h2><p className="text-sm text-[#526574] mt-2">{mun.plz.join(', ')} · {mun.canton}</p><p className="text-base leading-7 text-[#526574] mt-5">{copy.locationIntro}</p><PageLink to={getMunicipalityUrl(mun.slug)} onNavigate={onNavigate} className="mt-6 inline-flex items-center gap-2 text-[#087f73] text-sm font-medium underline underline-offset-4">{copy.localServices}<ArrowUpRight size={16} aria-hidden="true" /></PageLink></aside>
    </section>
    <ProcessSection />
    <section className="kraken-container py-10 sm:py-14 grid lg:grid-cols-[.8fr_1.4fr] gap-7"><h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#082b45]">{copy.faqTitle}</h2><details className="rounded-2xl border border-[#dce6e8] bg-white p-6"><summary className="cursor-pointer text-lg font-medium text-[#082b45]">{copy.faqQuestion}</summary><p className="text-base leading-7 text-[#526574] mt-4">{copy.faqAnswer}</p></details></section>
    <section className="kraken-container pb-10 sm:pb-14"><h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#082b45] mb-6">{copy.all}</h2><div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{related.map(other=><ServiceCard key={other.id} service={other} municipality={mun.slug} onNavigate={onNavigate} />)}</div></section>
    <PageEnd service={service} onNavigate={onNavigate} />
  </main>;
};
export default SeoServiceCityPage;
