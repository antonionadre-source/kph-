import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, MapPin, Search } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { salesCopy } from '../../src/content/salesCopy';
import { catalogCopy, fillCopy } from '../../src/content/catalogCopy';
import { catalogLanguage, SERVICE_CATALOG, serviceDescription, serviceName, serviceRequestPath, startServiceRequest, type CatalogService } from '../../src/content/serviceCatalog';
import { MUNICIPALITIES, type Municipality } from '../../src/data/locations';
import { tiltSurface, resetSurface } from '../ui/interactive-surface';
import { getMunicipalityUrl, getServicePageUrl } from '../../seoConfig';

export type Navigate = (path: string) => void;
export type AreaRegion = 'schaffhausen' | 'winterthur' | 'zuerich' | 'thurgau';
export const AREA_REGIONS: readonly AreaRegion[] = ['zuerich', 'winterthur', 'schaffhausen', 'thurgau'];
const REGION_KEYS: Record<AreaRegion, string> = { schaffhausen: 'regionSchaffhausen', winterthur: 'regionWinterthur', zuerich: 'regionZuerich', thurgau: 'regionThurgau' };
export function regionName(language: string, region: AreaRegion): string { return catalogCopy(language)[REGION_KEYS[region]]; }
export function regionPath(region: AreaRegion): string { return region === 'thurgau' ? '/einsatzgebiete?region=thurgau' : `/reinigung/${region === 'schaffhausen' ? 'kanton-schaffhausen' : `region-${region}`}`; }
export function municipalityFor(slug: string): Municipality | undefined { return MUNICIPALITIES.find(m => m.slug === (slug === 'neuhausen' ? 'neuhausen-am-rheinfall' : slug === 'zuerich' ? 'zurich' : slug)); }
export function municipalityName(language: string, slug: string): string {
  const mun = municipalityFor(slug); const id = mun?.slug || slug;
  if (id === 'zurich') return ({ de: 'Zürich', en: 'Zürich', es: 'Zúrich', fr: 'Zurich', it: 'Zurigo', pt: 'Zurique' })[catalogLanguage(language)];
  if (id === 'schaffhausen') return ({ de: 'Schaffhausen', en: 'Schaffhausen', es: 'Schaffhausen', fr: 'Schaffhouse', it: 'Sciaffusa', pt: 'Schaffhausen' })[catalogLanguage(language)];
  if (id === 'winterthur' && catalogLanguage(language) === 'fr') return 'Winterthour';
  return mun?.name || slug;
}
export function detailPath(serviceId: string, municipalitySlug = 'zurich'): string {
  const mun = municipalityFor(municipalitySlug);
  const slug = mun?.slug || 'zurich';
  const city = slug === 'neuhausen-am-rheinfall' ? 'neuhausen' : slug;
  return getServicePageUrl(city, serviceId) || `${getMunicipalityUrl(slug)}#${serviceId}`;
}
export function localHref(path: string, language: string): string {
  if (path.startsWith('#')) return path;
  const [base, fragment] = path.split('#');
  const url = new URL(base, 'https://krakenpfm.ch');
  url.searchParams.set('lang', catalogLanguage(language));
  return url.pathname + url.search + (fragment ? `#${fragment}` : '');
}
function plainClick(event: React.MouseEvent<HTMLAnchorElement>): boolean { return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey; }
function revealHash(path: string) {
  const hash = path.split('#')[1]; if (!hash) return;
  requestAnimationFrame(() => {
    const node = document.getElementById(hash);
    if (node instanceof HTMLDetailsElement) node.open = true;
    node?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
}
export function PageLink({ to, onNavigate, children, className = '', ...rest }: { to: string; onNavigate: Navigate; children: React.ReactNode; className?: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const { language } = useTranslation(); const href = localHref(to, language);
  return <a {...rest} className={className} href={href} onClick={event => { if (!plainClick(event)) return; event.preventDefault(); if (href.startsWith('#')) { history.replaceState(null, '', href); revealHash(href); } else { onNavigate(href); revealHash(href); } }}>{children}</a>;
}
export function ServiceRequest({ service, onNavigate, className = 'kraken-button kraken-primary' }: { service: CatalogService; onNavigate: Navigate; className?: string }) {
  const { language } = useTranslation(); const copy = catalogCopy(language);
  return <a className={className} href={localHref(serviceRequestPath(service.id), language)} onClick={event => { if (!plainClick(event)) return; event.preventDefault(); startServiceRequest(service.id, path => onNavigate(localHref(path, language))); }}>{service.wizardId ? copy.configure : copy.request}<ArrowUpRight size={17} aria-hidden="true" /></a>;
}
export function useLocationContext(slug?: string) {
  useEffect(() => {
    if (slug && municipalityFor(slug)) { try { localStorage.setItem('kraken_last_visited_municipality', municipalityFor(slug)!.slug); } catch { /* Directory navigation works without storage. */ } }
    revealHash(window.location.href);
  }, [slug]);
}
export function PageIntro({ eyebrow, title, intro, image, alt, children, contain = false, imageWidth = 768, imageHeight = 512 }: { eyebrow: string; title: string; intro: string; image?: string; alt?: string; children?: React.ReactNode; contain?: boolean; imageWidth?: number; imageHeight?: number }) {
  return <header className="kraken-page-intro"><div className={`kraken-container grid items-center gap-8 lg:gap-14 ${image ? 'lg:grid-cols-[1.12fr_1fr]' : ''}`}>
    <div className="max-w-2xl"><p className="kraken-eyebrow">{eyebrow}</p><h1 className="kraken-heading mt-3">{title}</h1><p className="kraken-description mt-5">{intro}</p>{children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}</div>
    {image && <div className={`overflow-hidden rounded-[1.75rem] border border-[#dce5f0] ${contain ? 'bg-[#eaf1fa] flex justify-center p-6 sm:p-8' : 'bg-[#eaf1fa]'}`}><img src={image} alt={alt || ''} width={contain ? 320 : imageWidth} height={contain ? 320 : imageHeight} fetchPriority="high" className={contain ? 'h-56 sm:h-64 w-auto object-contain' : 'aspect-[3/2] w-full h-auto object-cover'} decoding="async" /></div>}
  </div></header>;
}
export function Breadcrumbs({ items, onNavigate }: { items: { text: string; to?: string }[]; onNavigate: Navigate }) {
  const { language } = useTranslation();
  const label = ({de:'Brotkrumennavigation',en:'Breadcrumb',es:'Ruta de navegación',fr:'Fil d’Ariane',it:'Percorso di navigazione',pt:'Percurso de navegação'})[catalogLanguage(language)];
  return <nav aria-label={label} className="kraken-container pt-5"><ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-6 text-[#50647c]">{items.map((item, index) => <li key={index} className="flex items-center gap-2">{index > 0 && <span aria-hidden="true" className="text-[#a6b7bd]">/</span>}{item.to ? <PageLink to={item.to} onNavigate={onNavigate} className="hover:text-[#1464ad] underline-offset-4 hover:underline">{item.text}</PageLink> : <span aria-current="page" className="text-[#032b59]">{item.text}</span>}</li>)}</ol></nav>;
}
export function JsonLd({ value }: { value: unknown }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, '\\u003c') }} />; }
export function PageEnd({ onNavigate, service }: { onNavigate: Navigate; service?: CatalogService }) {
  const { language } = useTranslation(); const copy = catalogCopy(language);
  return <section className="kraken-container py-10 sm:py-14"><div className="rounded-[1.75rem] bg-[#032b59] px-6 py-8 sm:p-10 flex flex-col lg:flex-row gap-7 lg:items-center lg:justify-between"><div className="max-w-2xl"><h2 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight text-white">{copy.confirmTitle}</h2><p className="mt-4 text-base leading-7 text-[#d3e4e8]">{copy.confirmIntro}</p></div><div className="shrink-0">{service ? <ServiceRequest service={service} onNavigate={onNavigate} className="kraken-button bg-white !text-[#032b59] hover:bg-[#eaf2fc]" /> : <PageLink to="/kontakt" onNavigate={onNavigate} className="kraken-button bg-white !text-[#032b59] hover:bg-[#eaf2fc]">{copy.contact}<ArrowUpRight size={18} aria-hidden="true" /></PageLink>}</div></div></section>;
}
export function ProcessSection() {
  const { language } = useTranslation(); const copy = salesCopy(language);
  return <section className="border-y border-[#dce5f0] bg-white py-10 sm:py-14"><div className="kraken-container grid gap-8 lg:grid-cols-[.8fr_1.4fr]"><h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-[#032b59] max-w-sm">{copy.howTitle}</h2><ol className="grid sm:grid-cols-3 gap-6">{copy.steps.map(([title, description], index) => <li key={title} className="border-t border-[#dce5f0] pt-5"><span className="text-sm font-medium text-[#1464ad]">0{index + 1}</span><h3 className="mt-3 text-lg font-semibold text-[#032b59]">{title}</h3><p className="mt-2 text-base leading-7 text-[#50647c]">{description}</p></li>)}</ol></div></section>;
}
export function ServiceCard({ service, municipality = 'zurich', onNavigate }: { key?: string; service: CatalogService; municipality?: string; onNavigate: Navigate }) {
  const { language } = useTranslation(); const copy = catalogCopy(language); const name = serviceName(language, service.id)!;
  return <article onPointerMove={tiltSurface} onPointerLeave={resetSurface} className="kraken-depth-card rounded-[1.5rem] overflow-hidden border border-[#dce5f0] bg-white flex flex-col transition-[transform,box-shadow] duration-200"><PageLink to={detailPath(service.id, municipality)} onNavigate={onNavigate} className="block overflow-hidden bg-[#eaf1fa]"><img src={service.image} alt={name} width={service.width} height={service.height} loading="lazy" decoding="async" className="aspect-[4/3] h-auto w-full object-cover object-[50%_38%] transition-transform duration-300 motion-safe:hover:scale-[1.025]" /></PageLink><div className="p-5 sm:p-6 flex flex-col flex-1"><h2 className="text-xl leading-7 font-semibold tracking-tight text-[#032b59]">{name}</h2><p className="text-base leading-7 text-[#50647c] mt-3 mb-6">{serviceDescription(language, service.id)}</p><div className="mt-auto flex flex-col gap-3"><ServiceRequest service={service} onNavigate={onNavigate} /><PageLink to={detailPath(service.id, municipality)} onNavigate={onNavigate} className="inline-flex justify-between items-center gap-2 py-2 text-sm font-medium text-[#50647c] hover:text-[#1464ad]">{copy.seeDetails}<ArrowRight size={17} aria-hidden="true" /></PageLink></div></div></article>;
}
export function ServiceGrid({ audience, onNavigate }: { audience: 'private' | 'business'; onNavigate: Navigate }) {
  const { language } = useTranslation(); const copy = catalogCopy(language); const [query, setQuery] = useState(''); const [category, setCategory] = useState('all');
  const [municipality, setMunicipality] = useState(() => { try { return municipalityFor(localStorage.getItem('kraken_last_visited_municipality') || '')?.slug || 'zurich'; } catch { return 'zurich'; } });
  const options = audience === 'private' ? ['all','cleaning','moving','outdoor','special'] : ['all'];
  const matching = SERVICE_CATALOG.filter(service => service.audience === audience && (category === 'all' || service.category === category) && normalize(serviceName(language, service.id) + ' ' + serviceDescription(language, service.id)).includes(normalize(query)));
  return <section id={audience === 'private' ? 'servicios-grid' : 'commercial-services-grid'} className="kraken-container py-10 sm:py-14 scroll-mt-28">
    <div className="rounded-[1.25rem] border border-[#dce5f0] bg-white p-4 sm:p-5 mb-7"><div className="grid md:grid-cols-2 gap-4"><label className="block text-sm font-medium text-[#032b59]">{copy.searchServices}<div className="relative mt-2"><Search size={19} className="absolute top-3.5 left-3.5 text-[#687e89]" aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={copy.searchServicePlaceholder} className="w-full rounded-xl border border-[#dce5f0] bg-[#f3f7fc] py-3 pl-11 pr-3 text-base outline-none focus:border-[#1464ad] focus:ring-2 focus:ring-[#1464ad]/15" /></div></label><label className="block text-sm font-medium text-[#032b59]">{copy.locationSelect}<select value={municipality} onChange={event => setMunicipality(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f0] bg-[#f3f7fc] p-3 text-base outline-none focus:border-[#1464ad]">{MUNICIPALITIES.map(m => <option key={m.slug} value={m.slug}>{municipalityName(language, m.slug)} · {m.plz[0]}</option>)}</select></label></div>
      {options.length > 1 && <div className="flex flex-wrap gap-2 pt-4">{options.map(value => <button key={value} type="button" onClick={() => setCategory(value)} aria-pressed={category === value} className={`rounded-full px-4 py-2.5 text-sm font-medium border transition-colors ${category === value ? 'bg-[#032b59] text-white border-[#032b59]' : 'bg-white border-[#dce5f0] text-[#50647c] hover:border-[#1464ad]'}`}>{copy[value]}</button>)}</div>}
    </div>
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">{matching.map(service => <ServiceCard key={service.id} service={service} municipality={municipality} onNavigate={onNavigate} />)}</div>
    {!matching.length && <div role="status" className="p-8 rounded-2xl bg-white border border-[#dce5f0]"><p className="text-base text-[#50647c]">{copy.noResults}</p><button onClick={() => { setQuery(''); setCategory('all'); }} className="kraken-button kraken-secondary mt-5">{copy.reset}</button></div>}
  </section>;
}
function normalize(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
export function RegionTiles({ onNavigate, onThurgau }: { onNavigate: Navigate; onThurgau?: () => void }) {
  const { language } = useTranslation(); const copy = catalogCopy(language);
  return <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{AREA_REGIONS.map(region => <PageLink key={region} to={regionPath(region)} onNavigate={region === 'thurgau' && onThurgau ? () => onThurgau() : onNavigate} className="group bg-white border border-[#dce5f0] rounded-2xl p-5 sm:p-6 flex flex-col min-h-40 hover:border-[#1464ad] transition-colors"><MapPin size={23} strokeWidth={1.7} className="text-[#1464ad]" aria-hidden="true" /><h3 className="text-lg font-semibold tracking-tight text-[#032b59] mt-4">{regionName(language, region)}</h3><span className="inline-flex items-center justify-between gap-3 text-sm text-[#50647c] mt-3">{copy.openPlace}<ArrowUpRight size={18} aria-hidden="true" /></span></PageLink>)}</div>;
}
export function AreaDirectory({ onNavigate, fixedRegion, selectedRegion, onRegionChange }: { onNavigate: Navigate; fixedRegion?: AreaRegion; selectedRegion?: string; onRegionChange?: (region: string) => void }) {
  const { language } = useTranslation(); const copy = catalogCopy(language); const [query, setQuery] = useState('');
  const [internalRegion, setInternalRegion] = useState<string>(() => { if (fixedRegion) return fixedRegion; if (typeof window === 'undefined') return 'all'; const requested = new URLSearchParams(window.location.search).get('region'); return AREA_REGIONS.includes(requested as AreaRegion) ? requested! : 'all'; });
  const region = selectedRegion ?? internalRegion;
  const setRegion = (value: string) => { setInternalRegion(value); onRegionChange?.(value); };
  const matches = useMemo(() => MUNICIPALITIES.filter(m => (fixedRegion ? m.region === fixedRegion : region === 'all' || m.region === region) && normalize(`${m.name} ${municipalityName(language, m.slug)} ${m.plz.join(' ')} ${m.canton}`).includes(normalize(query))).sort((a,b) => a.name.localeCompare(b.name)), [query, region, fixedRegion, language]);
  return <section id="municipalities" className="kraken-container py-10 sm:py-14 scroll-mt-28"><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6"><div><p className="kraken-eyebrow">{copy.locality}</p><h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#032b59] mt-2">{copy.placesTitle}</h2></div><label className="block w-full lg:max-w-md"><span className="sr-only">{copy.searchPlaces}</span><div className="relative"><Search size={19} className="absolute top-3.5 left-3.5 text-[#687e89]" aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={copy.searchPlaces} className="w-full rounded-xl border border-[#dce5f0] bg-white py-3 pl-11 pr-4 text-base outline-none focus:border-[#1464ad] focus:ring-2 focus:ring-[#1464ad]/15" /></div></label></div>
    {!fixedRegion && <div className="flex flex-wrap gap-2 mb-6">{['all', ...AREA_REGIONS].map(value => <button type="button" key={value} aria-pressed={region === value} onClick={() => setRegion(value)} className={`rounded-full border px-4 py-2.5 text-sm font-medium ${region === value ? 'bg-[#032b59] text-white border-[#032b59]' : 'bg-white border-[#dce5f0] text-[#50647c] hover:border-[#1464ad]'}`}>{value === 'all' ? copy.allRegions : regionName(language, value as AreaRegion)}</button>)}</div>}
    <p role="status" className="mb-4 text-sm text-[#50647c]">{matches.length} {copy.directoryCount}</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{matches.map(m => <PageLink key={m.slug} to={getMunicipalityUrl(m.slug)} onNavigate={onNavigate} className="group flex items-center justify-between gap-4 rounded-xl border border-[#dce5f0] bg-white px-5 py-5 hover:border-[#1464ad] transition-colors"><div><h3 className="text-base font-semibold text-[#032b59]">{municipalityName(language,m.slug)}</h3><p className="mt-1 text-sm text-[#50647c]">{m.plz.join(', ')} <span className="mx-1 text-[#9badb4]">·</span> {m.canton}</p></div><ArrowUpRight size={18} className="shrink-0 text-[#1464ad]" aria-hidden="true" /></PageLink>)}</div>
    {!matches.length && <p className="rounded-2xl border border-[#dce5f0] bg-white p-6 text-[#50647c]">{copy.noResults}</p>}
  </section>;
}
export function ServiceRows({ onNavigate, municipality }: { onNavigate: Navigate; municipality: string }) {
  const { language } = useTranslation(); const copy = catalogCopy(language);
  return <section className="kraken-container py-10 sm:py-14"><div className="max-w-2xl mb-7"><h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#032b59]">{copy.localServices}</h2><p className="text-base leading-7 text-[#50647c] mt-3">{copy.prepareIntro}</p></div><div className="rounded-[1.5rem] border border-[#dce5f0] bg-white overflow-hidden">{SERVICE_CATALOG.map(service => <details key={service.id} id={service.id} className="group border-b last:border-b-0 border-[#dce5f0] scroll-mt-28"><summary className="cursor-pointer list-none px-5 py-5 sm:px-7 flex justify-between items-center gap-4"><span className="text-lg font-medium text-[#032b59]">{serviceName(language,service.id)}</span><span aria-hidden="true" className="text-[#1464ad] text-2xl font-light group-open:rotate-45 transition-transform">+</span></summary><div className="px-5 pb-6 sm:px-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-base text-[#50647c] leading-7 max-w-2xl">{serviceDescription(language,service.id)}</p><ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">{service.focus.map(key => <li key={key} className="inline-flex items-center gap-2 text-sm leading-6 text-[#50647c]"><Check size={15} className="text-[#1464ad]" aria-hidden="true" />{copy[key]}</li>)}</ul></div><div className="flex flex-wrap items-center gap-4"><ServiceRequest service={service} onNavigate={onNavigate} /><PageLink to={detailPath(service.id,municipality)} onNavigate={onNavigate} className="text-sm font-medium text-[#1464ad] underline underline-offset-4">{copy.seeDetails}</PageLink></div></div></details>)}</div></section>;
}
export function MissingPage({ onNavigate }: { onNavigate: Navigate }) { const { language } = useTranslation(); const copy = catalogCopy(language); return <main className="kraken-page"><PageIntro eyebrow="Kraken PFM" title={copy.notFound} intro={copy.notFoundIntro}><PageLink to="/services" onNavigate={onNavigate} className="kraken-button kraken-primary">{copy.all}<ArrowRight size={18} /></PageLink></PageIntro></main>; }
export function titleInPlace(language: string, place: string) { return fillCopy(catalogCopy(language).locationTitle, { place }); }
