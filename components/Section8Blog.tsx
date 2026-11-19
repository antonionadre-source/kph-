import React from 'react';
import { useTranslation } from '../i18n';

interface Section8BlogProps {
  onNavigate?: (path: string) => void;
}

export default function Section8Blog({ onNavigate }: Section8BlogProps) {
  const { language } = useTranslation();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const getT = () => {
    switch (language) {
      case 'en':
        return {
          title: 'Real Estate Knowledge & Guides',
          subtitle: 'Practical guides, expertise, and news on building cleaning and facility management.',
          allBlogLink: 'View all blog articles →',
          readArticle: 'Read article →',
          readTimeLabel: 'min read',
          posts: [
            {
              title: 'Apartment Handover in Zurich & Schaffhausen: Tips for a Faultless Handover',
              excerpt: 'What property management companies pay special attention to in kitchens, bathrooms, and windows, and how to avoid costly complaints.',
              date: '10 August 2026',
              readTime: '5',
              link: '/blog/wohnungsabgabe-zurich-perfekte-uebergabe',
              tag: 'Relocation Guide'
            },
            {
              title: 'IoT & Smart Facility Management in Swiss Offices',
              excerpt: 'How intelligent sensors for occupancy, air quality, and cleaning needs lower resource consumption in modern commercial premises.',
              date: '02 August 2026',
              readTime: '7',
              link: '/blog/iot-smart-facility-management-schweizer-bueros',
              tag: 'Innovation & FM'
            }
          ]
        };
      case 'fr':
        return {
          title: 'Savoir-faire & Guides immobiliers',
          subtitle: 'Guides pratiques, conseils d\'experts et actualités du nettoyage de bâtiments et du FM.',
          allBlogLink: 'Voir tous les articles →',
          readArticle: 'Lire l\'article →',
          readTimeLabel: 'min de lecture',
          posts: [
            {
              title: 'Remise d\'appartement à Zurich & Schaffhouse : conseils pour un état des lieux parfait',
              excerpt: 'Ce à quoi les gérances portent une attention particulière (cuisine, sanitaires, vitres) et comment éviter des retenues coûteuses.',
              date: '10 août 2026',
              readTime: '5',
              link: '/blog/wohnungsabgabe-zurich-perfekte-uebergabe',
              tag: 'Guide Déménagement'
            },
            {
              title: 'IoT & Facility Management Intelligent dans les bureaux suisses',
              excerpt: 'Comment les capteurs d\'occupation et de qualité d\'air réduisent la consommation dans les espaces professionnels.',
              date: '02 août 2026',
              readTime: '7',
              link: '/blog/iot-smart-facility-management-schweizer-bueros',
              tag: 'Innovation & FM'
            }
          ]
        };
      case 'it':
        return {
          title: 'Conoscenza & Guide Immobiliari',
          subtitle: 'Guide pratiche, competenze e novità su pulizia di edifici e facility management.',
          allBlogLink: 'Vedi tutti gli articoli →',
          readArticle: 'Leggi articolo →',
          readTimeLabel: 'min di lettura',
          posts: [
            {
              title: 'Consegna dell\'appartamento a Zurigo & Sciaffusa: consigli per una consegna senza difetti',
              excerpt: 'Cosa controllano attentamente le amministrazioni e come evitare costose contestazioni.',
              date: '10 agosto 2026',
              readTime: '5',
              link: '/blog/wohnungsabgabe-zurich-perfekte-uebergabe',
              tag: 'Guida Trasloco'
            },
            {
              title: 'IoT & Smart Facility Management negli uffici svizzeri',
              excerpt: 'Come i sensori intelligenti riducono il consumo di risorse nei moderni locali commerciali.',
              date: '02 agosto 2026',
              readTime: '7',
              link: '/blog/iot-smart-facility-management-schweizer-bueros',
              tag: 'Innovazione & FM'
            }
          ]
        };
      case 'es':
        return {
          title: 'Conocimiento y Guías Inmobiliarias',
          subtitle: 'Guías prácticas, experiencia y noticias sobre limpieza de edificios y facility management.',
          allBlogLink: 'Ver todos los artículos →',
          readArticle: 'Leer artículo →',
          readTimeLabel: 'min de lectura',
          posts: [
            {
              title: 'Entrega de piso en Zúrich y Schaffhausen: consejos para una entrega impecable',
              excerpt: 'En qué se fijan especialmente las inmobiliarias al inspeccionar cocina, baños y ventanas, y cómo evitar reclamaciones.',
              date: '10 de agosto de 2026',
              readTime: '5',
              link: '/blog/wohnungsabgabe-zurich-perfekte-uebergabe',
              tag: 'Guía de Mudanza'
            },
            {
              title: 'IoT y Facility Management Inteligente en oficinas suizas',
              excerpt: 'Cómo los sensores inteligentes de ocupación y aire reducen el consumo en espacios comerciales modernos.',
              date: '02 de agosto de 2026',
              readTime: '7',
              link: '/blog/iot-smart-facility-management-schweizer-bueros',
              tag: 'Innovación y FM'
            }
          ]
        };
      case 'pt':
        return {
          title: 'Conhecimento & Guias Imobiliários',
          subtitle: 'Guias práticos, especialistas e notícias sobre limpeza de edifícios e facility management.',
          allBlogLink: 'Ver todos os artigos →',
          readArticle: 'Ler artigo →',
          readTimeLabel: 'min de leitura',
          posts: [
            {
              title: 'Entrega do apartamento em Zurique & Schaffhausen: dicas para uma entrega perfeita',
              excerpt: 'A que as imobiliárias prestam especial atenção em cozinhas, casas de banho e janelas, e como evitar penalizações.',
              date: '10 de agosto de 2026',
              readTime: '5',
              link: '/blog/wohnungsabgabe-zurich-perfekte-uebergabe',
              tag: 'Guia de Mudança'
            },
            {
              title: 'IoT & Smart Facility Management em escritórios suíços',
              excerpt: 'Como os sensores inteligentes de ocupação e ar reduzem o consumo de recursos em edifícios comerciais.',
              date: '02 de agosto de 2026',
              readTime: '7',
              link: '/blog/iot-smart-facility-management-schweizer-bueros',
              tag: 'Inovação e FM'
            }
          ]
        };
      case 'de':
      case 'de-CH':
      default:
        return {
          title: 'Wissen & Ratgeber für Immobilien',
          subtitle: 'Praktische Anleitungen, Fachwissen und News rund um Gebäudereinigung und Facility Management.',
          allBlogLink: 'Alle Blogartikel ansehen →',
          readArticle: 'Artikel lesen →',
          readTimeLabel: 'Min. Lesezeit',
          posts: [
            {
              title: 'Wohnungsabgabe in Zürich & Schaffhausen: Tipps für die mangelfreie Übergabe',
              excerpt: 'Worauf Liegenschaftsverwaltungen bei der Abnahme von Küche, Bad und Fenstern besonders achten und wie Sie teure Beanstandungen vermeiden.',
              date: '10. August 2026',
              readTime: '5',
              link: '/blog/wohnungsabgabe-zurich-perfekte-uebergabe',
              tag: 'Umzugsratgeber'
            },
            {
              title: 'IoT & Smart Facility Management in Schweizer Büros',
              excerpt: 'Wie intelligente Sensoren für Belegungsdichte, Raumluft und Reinigungsbedarf den Ressourcenverbrauch in modernen Geschäftsräumen senken.',
              date: '02. August 2026',
              readTime: '7',
              link: '/blog/iot-smart-facility-management-schweizer-bueros',
              tag: 'Innovation & FM'
            }
          ]
        };
    }
  };

  const tData = getT();

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#032B59] tracking-tight mb-2">
              {tData.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {tData.subtitle}
            </p>
          </div>
          <a
            href="/blog"
            onClick={(e) => handleLinkClick(e, '/blog')}
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#032B59] hover:text-blue-700 hover:underline transition-colors cursor-pointer shrink-0"
          >
            {tData.allBlogLink}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tData.posts.map((post, idx) => (
            <article key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-all shadow-xs">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#032B59] px-2.5 py-0.5 rounded-full border border-blue-200">
                    {post.tag}
                  </span>
                  <span className="text-xs text-slate-400">{post.date}</span>
                  <span className="text-xs text-slate-400">• {post.readTime} {tData.readTimeLabel}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#032B59] mb-3 hover:text-blue-700 transition-colors">
                  <a href={post.link} onClick={(e) => handleLinkClick(e, post.link)} className="cursor-pointer">
                    {post.title}
                  </a>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>
              <div>
                <a
                  href={post.link}
                  onClick={(e) => handleLinkClick(e, post.link)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#032B59] hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                >
                  {tData.readArticle}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

