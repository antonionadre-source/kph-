import React from 'react';
import { useTranslation } from '../i18n';
import { Recycle, Users, Globe, MapPin } from 'lucide-react';

interface SustainabilityPageProps {
  onNavigate: (page: string) => void;
}

const SustainabilityPage: React.FC<SustainabilityPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const pillars = [
    { title: t('sustainability.page.bento.circular.title'), desc: t('sustainability.page.bento.circular.desc'), icon: <Recycle className="h-6 w-6" /> },
    { title: t('sustainability.page.bento.people.title'), desc: t('sustainability.page.bento.people.desc'), icon: <Users className="h-6 w-6" /> },
    { title: t('sustainability.page.bento.diversity.title'), desc: t('sustainability.page.bento.diversity.desc'), icon: <Globe className="h-6 w-6" /> },
    { title: t('sustainability.page.logistics.title'), desc: t('sustainability.page.logistics.desc'), icon: <MapPin className="h-6 w-6" /> },
  ];

  return (
    <main className="kraken-page kraken-editorial bg-white text-[#032b59]">
      <header className="kraken-page-intro kraken-container grid gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div><p className="kraken-eyebrow">Kraken PFM</p><h1 className="kraken-heading mt-3">{t('sustainability.page.hero.title_line1')} {t('sustainability.page.hero.title_line2')}</h1><p className="kraken-description max-w-xl">{t('sustainability.page.hero.subtitle')}</p><button onClick={() => onNavigate('our-story')} className="kraken-button kraken-secondary mt-7">{t('sustainability.page.hero.cta_story')}</button></div>
        <img src="/modern-office-greenery-mascot.webp" alt="Kai — Kraken PFM" className="aspect-[4/3] w-full rounded-2xl border border-[#dce5f0] object-cover" />
      </header>
      <section className="border-y border-[#dce5f0] bg-[#f3f7fc] py-12 sm:py-20">
        <div className="kraken-container"><h2 className="kraken-heading max-w-2xl">{t('sustainability.page.roadmap.title')}</h2><div className="mt-9 grid gap-6 sm:grid-cols-2">{pillars.map((pillar, index) => <article key={index} className="rounded-2xl border border-[#dce5f0] bg-white p-7 sm:p-9"><div aria-hidden="true" className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f4f1] text-[#1464ad]">{pillar.icon}</div><h3 className="text-xl font-semibold">{pillar.title}</h3><p className="mt-3 text-base leading-relaxed text-[#50647c]">{pillar.desc}</p></article>)}</div></div>
      </section>
      <section className="kraken-container py-12 sm:py-20"><div className="max-w-3xl"><p className="kraken-eyebrow">{t('sustainability.page.roadmap.title')}</p><h2 className="kraken-heading mt-3">{t('sustainability.page.bento.circular.title')}</h2><p className="kraken-description">{t('sustainability.page.bento.circular.desc')}</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={() => onNavigate('kontakt')} className="kraken-button kraken-primary">{t('nav.contact')}</button><button onClick={() => onNavigate('our-story')} className="kraken-button kraken-secondary">{t('sustainability.page.hero.cta_story')}</button></div></div></section>
    </main>
  );
};

export default SustainabilityPage;
