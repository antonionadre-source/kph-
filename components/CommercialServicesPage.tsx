import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n';
import { catalogCopy } from '../src/content/catalogCopy';
import { Breadcrumbs, PageIntro, PageLink, ServiceGrid, ProcessSection, PageEnd } from './catalog/CatalogUI';

interface CommercialServicesPageProps { onNavigate: (page: string) => void; }
const CommercialServicesPage: React.FC<CommercialServicesPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation(); const copy = catalogCopy(language);
  return <main className="kraken-page">
    <Breadcrumbs items={[{text:copy.home,to:'/'},{text:copy.businessLabel}]} onNavigate={onNavigate} />
    <PageIntro eyebrow={copy.businessLabel} title={copy.businessTitle} intro={copy.businessIntro} image="/kai-calendar/optimized/commercial/offices-corporate/768.webp" imageWidth={768} imageHeight={576} alt="">
      <PageLink to="#commercial-services-grid" onNavigate={onNavigate} className="kraken-button kraken-primary">{copy.all}<ArrowRight size={18} aria-hidden="true" /></PageLink>
      <PageLink to="/kontakt" onNavigate={onNavigate} className="kraken-button kraken-secondary">{copy.contact}<ArrowUpRight size={18} aria-hidden="true" /></PageLink>
    </PageIntro>
    <ServiceGrid audience="business" onNavigate={onNavigate} />
    <ProcessSection />
    <PageEnd onNavigate={onNavigate} />
  </main>;
};
export default CommercialServicesPage;
