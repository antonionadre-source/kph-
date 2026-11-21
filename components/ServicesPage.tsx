import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n';
import { catalogCopy } from '../src/content/catalogCopy';
import { Breadcrumbs, PageIntro, PageLink, ServiceGrid, ProcessSection, PageEnd } from './catalog/CatalogUI';

interface ServicesPageProps { onNavigate: (page: string) => void; }
const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation(); const copy = catalogCopy(language);
  return <main className="kraken-page">
    <Breadcrumbs items={[{text:copy.home,to:'/'},{text:copy.privateLabel}]} onNavigate={onNavigate} />
    <PageIntro eyebrow={copy.privateLabel} title={copy.privateTitle} intro={copy.privateIntro} image="/kai-calendar/spring-cleaning/hero-768.webp" alt="">
      <PageLink to="#servicios-grid" onNavigate={onNavigate} className="kraken-button kraken-primary">{copy.all}<ArrowRight size={18} aria-hidden="true" /></PageLink>
      <PageLink to="/commercial" onNavigate={onNavigate} className="kraken-button kraken-secondary">{copy.businessLabel}<ArrowUpRight size={18} aria-hidden="true" /></PageLink>
    </PageIntro>
    <ServiceGrid audience="private" onNavigate={onNavigate} />
    <ProcessSection />
    <PageEnd onNavigate={onNavigate} />
  </main>;
};
export default ServicesPage;
