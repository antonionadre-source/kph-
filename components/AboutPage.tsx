import React from 'react';
import { useTranslation } from '../i18n';
import { aboutHeroImageUrl, aboutOriginImages } from '../assets';
import { ChevronRightIcon } from './icons';

interface AboutPageProps {
    onNavigate: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const originPanels = [
    {
      img: aboutOriginImages.panel3,
      text: t('about.origin.panel1'),
    },
    {
      img: "/kai-calendar/optimized/about/consultancy-768.webp",
      text: t('about.origin.panel2'),
    },
    {
      img: aboutOriginImages.panel1,
      text: t('about.origin.panel3'),
    },
    {
      img: aboutOriginImages.panel4,
      text: t('about.origin.panel4'),
    },
  ];

  const coreValues = [
    {
      icon: '🛡️',
      title: t('aboutPage.valueIntegrityTitle'),
      text: t('aboutPage.valueIntegrityText'),
      color: 'bg-blue-500/10 text-blue-400',
    },
    {
      icon: '🌱',
      title: t('aboutPage.valueSustainabilityTitle'),
      text: t('aboutPage.valueSustainabilityText'),
      color: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      icon: '🤝',
      title: t('aboutPage.valueClientCentricTitle'),
      text: t('aboutPage.valueClientCentricText'),
      color: 'bg-red-500/10 text-red-400',
    },
    {
      icon: '💎',
      title: t('aboutPage.valueExcellenceTitle'),
      text: t('aboutPage.valueExcellenceText'),
      color: 'bg-blue-400/10 text-blue-300',
    },
  ];

  return (
    <main className="kraken-page kraken-editorial bg-white text-[#082b45]">
      <header className="kraken-page-intro kraken-container grid gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="kraken-eyebrow">Kraken PFM</p>
          <h1 className="kraken-heading mt-3">{t('about.hero.title')}</h1>
          <p className="kraken-description max-w-xl">{t('about.hero.subtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => onNavigate('our-story')} className="kraken-button kraken-primary">{t('about.hero.ctaStory')} <ChevronRightIcon className="h-4 w-4" /></button>
            <button onClick={() => onNavigate('comic-page')} className="kraken-button kraken-secondary">{t('aboutPage.viewComics')}</button>
          </div>
        </div>
        <img src={aboutHeroImageUrl} alt="Kai — Kraken PFM" className="aspect-[4/3] w-full rounded-2xl border border-[#dce6e8] object-cover" />
      </header>
      <section className="border-y border-[#dce6e8] bg-[#f4f8f8] py-12 sm:py-20" id="origin">
        <div className="kraken-container">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
            <div><p className="kraken-eyebrow">{t('about.origin.badge')}</p><h2 className="kraken-heading mt-3">{t('about.origin.title')}</h2><p className="kraken-description">{t('about.origin.text')}</p><button onClick={() => onNavigate('our-story')} className="kraken-button kraken-secondary mt-7">{t('about.origin.readStory')} →</button></div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{originPanels.map((panel, index) => <figure key={index} className="overflow-hidden rounded-2xl border border-[#dce6e8] bg-white"><img src={panel.img} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" /><figcaption className="p-5 text-base leading-relaxed text-[#526574]">{panel.text}</figcaption></figure>)}</div>
          </div>
        </div>
      </section>
      <section className="kraken-container py-12 sm:py-20" id="values">
        <div className="max-w-2xl"><p className="kraken-eyebrow">{t('about.values.badge')}</p><h2 className="kraken-heading mt-3">{t('about.values.title')}</h2><p className="kraken-description">{t('about.values.text')}</p></div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{coreValues.map((value, index) => <article key={index} className="rounded-2xl border border-[#dce6e8] p-6"><span aria-hidden="true" className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f4f1] text-xl">{value.icon}</span><h3 className="text-lg font-semibold">{value.title}</h3><p className="mt-3 text-base leading-relaxed text-[#526574]">{value.text}</p></article>)}</div>
      </section>
      <section className="border-t border-[#dce6e8] bg-[#f4f8f8] py-12 sm:py-20">
        <div className="kraken-container grid gap-8 lg:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-[#dce6e8] bg-white"><img src="/kai-calendar/optimized/about/team-768.webp" alt="Kai — Kraken PFM" loading="lazy" className="aspect-[16/9] w-full object-cover" /><div className="p-7 sm:p-9"><p className="kraken-eyebrow">{t('about.people.badge')}</p><h2 className="kraken-heading mt-3">{t('about.people.title')}</h2><p className="kraken-description">{t('about.people.text')}</p></div></article>
          <article className="flex flex-col justify-center rounded-2xl border border-[#dce6e8] bg-white p-7 sm:p-10"><p className="kraken-eyebrow">{t('about.commitment.badge')}</p><h2 className="kraken-heading mt-3">{t('about.commitment.title')}</h2><p className="kraken-description">{t('about.commitment.text')}</p><button onClick={() => onNavigate('sustainability-page')} className="kraken-button kraken-secondary mt-7 self-start">{t('about.commitment.cta')} →</button></article>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
