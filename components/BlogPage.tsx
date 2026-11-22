import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock, BookOpen, Search, Tag, X } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

const categoryTranslations: Record<string, Record<string, string>> = {
  es: {
    all: "Todos",
    cleaning_tips: "Consejos de Limpieza",
    facility_management: "Gestión de Instalaciones",
    company_news: "Noticias de la Empresa"
  },
  en: {
    all: "All",
    cleaning_tips: "Cleaning Tips",
    facility_management: "Facility Management",
    company_news: "Company News"
  },
  de: {
    all: "Alle",
    cleaning_tips: "Reinigungstipps",
    facility_management: "Gebäudemanagement",
    company_news: "Unternehmensnews"
  },
  fr: {
    all: "Tous",
    cleaning_tips: "Conseils de Nettoyage",
    facility_management: "Gestion des Installations",
    company_news: "Actualités"
  },
  it: {
    all: "Tutti",
    cleaning_tips: "Consigli di Pulizia",
    facility_management: "Gestione delle Strutture",
    company_news: "Notizie Aziendali"
  },
  pt: {
    all: "Todos",
    cleaning_tips: "Dicas de Limpeza",
    facility_management: "Gestão de Instalações",
    company_news: "Novidades da Empresa"
  }
};

const tagTranslations: Record<string, Record<string, string>> = {
  es: {
    tenancy: "Entrega de Piso",
    checklist: "Checklist",
    zurich: "Zúrich",
    kaution: "Garantía",
    maintenance: "Mantenimiento",
    solar: "Solar",
    photovoltaic: "Fotovoltaica",
    efficiency: "Eficiencia",
    sustainability: "Sostenibilidad",
    iot: "IoT",
    technology: "Tecnología",
    "smart-office": "Oficina Inteligente",
    data: "Datos",
    expansion: "Expansión",
    reliability: "Confianza",
    news: "Noticias",
    agency: "Agencia"
  },
  en: {
    tenancy: "Apartment Handover",
    checklist: "Checklist",
    zurich: "Zurich",
    kaution: "Deposit",
    maintenance: "Maintenance",
    solar: "Solar",
    photovoltaic: "Photovoltaic",
    efficiency: "Efficiency",
    sustainability: "Sustainability",
    iot: "IoT",
    technology: "Technology",
    "smart-office": "Smart Office",
    data: "Data",
    expansion: "Expansion",
    reliability: "Trust",
    news: "Company News",
    agency: "Agency"
  },
  de: {
    tenancy: "Wohnungsabgabe",
    checklist: "Checkliste",
    zurich: "Zürich",
    kaution: "Kaution",
    maintenance: "Wartung",
    solar: "Solaranlagen",
    photovoltaic: "Fotovoltaik",
    efficiency: "Effizienz",
    sustainability: "Nachhaltigkeit",
    iot: "IoT",
    technology: "Technologie",
    "smart-office": "Smart Office",
    data: "Daten",
    expansion: "Expansion",
    reliability: "Vertrauen",
    news: "Neuigkeiten",
    agency: "Agentur"
  },
  fr: {
    tenancy: "État des lieux",
    checklist: "Check-list",
    zurich: "Zurich",
    kaution: "Caution",
    maintenance: "Entretien",
    solar: "Solaire",
    photovoltaic: "Photovoltaïque",
    efficiency: "Efficacité",
    sustainability: "Durabilité",
    iot: "IoT",
    technology: "Technologie",
    "smart-office": "Bureau Connecté",
    data: "Données",
    expansion: "Expansion",
    reliability: "Confiance",
    news: "Actualités",
    agency: "Agence"
  },
  it: {
    tenancy: "Consegna Casa",
    checklist: "Lista di controllo",
    zurich: "Zurigo",
    kaution: "Cauzione",
    maintenance: "Manutenzione",
    solar: "Solare",
    photovoltaic: "Fotovoltaico",
    efficiency: "Efficienza",
    sustainability: "Sostenibilità",
    iot: "IoT",
    technology: "Tecnologia",
    "smart-office": "Ufficio Intelligente",
    data: "Dati",
    expansion: "Espansione",
    reliability: "Affidabilità",
    news: "Notizie Aziendali",
    agency: "Agenzia"
  },
  pt: {
    tenancy: "Entrega de Imóvel",
    checklist: "Lista de Verificação",
    zurich: "Zurique",
    kaution: "Depósito",
    maintenance: "Manutenção",
    solar: "Solar",
    photovoltaic: "Fotovoltaico",
    efficiency: "Eficiência",
    sustainability: "Sustentabilidade",
    iot: "IoT",
    technology: "Tecnologia",
    "smart-office": "Escritório Inteligente",
    data: "Dados",
    expansion: "Expansão",
    reliability: "Confiança",
    news: "Notícias",
    agency: "Agência"
  }
};

const article4Translations: Record<string, { title: string; excerpt: string; paragraphs: string[] }> = {
  es: {
    title: "Kraken FM se expande a la región de Basilea y Berna",
    excerpt: "Ampliamos nuestra cobertura de servicios inteligentes de mantenimiento y saneamiento en Suiza para satisfacer la creciente demanda corporativa.",
    paragraphs: [
      "Es un placer anunciar de forma oficial que los servicios integrales de Kraken Properties & Facilities Management se expanden con éxito a toda el área de Basilea y Berna. Esta operación estratégica es una respuesta directa al aumento de solicitudes de mantenimiento preventivo y de limpieza periódica corporativa e industrial en estas localidades clave.",
      "A través de esta expansión, implementamos nuestros equipos especializados listos para responder con la máxima rapidez y rigor, incluyendo mantenimiento técnico de sistemas, limpieza al final de obras (Bureaudesinfektion) y limpieza de fin de contrato de alquiler (Abgabereinigung).",
      "Garantizamos un servicio unificado respaldado por nuestras auditorías internas de calidad e informes en tiempo real. Estamos entusiasmados por esta nueva etapa y agradecidos a todos nuestros clientes en Suiza por hacerlo posible."
    ]
  },
  en: {
    title: "Kraken FM Expands Operations to Basel and Bern Regions",
    excerpt: "Expanding our service footprint guidelines for smart maintenance and thorough sanitization in Switzerland to fulfill growing corporate demand.",
    paragraphs: [
      "We are delighted to announce that Kraken Properties & Facilities Management has officially expanded its premium services to the Basel and Bern regions. This strategic step directly answers the rising request for technical maintenance, facility support, and high-standard cleaning from our B2B and residential clients in these locations.",
      "With local operations hubs already serving these two regions, we can now guarantee faster response times, highly professional field crews, and seamless coordination backed by our regional dispatchers.",
      "Whether you require high-performing solar panel maintenance, real-time IoT facility tracking, or end-of-tenancy deep cleans, Kraken's hallmark quality is now fully available to safeguard and raise your properties' value in Basel and Bern."
    ]
  },
  de: {
    title: "Kraken FM expandiert in die Regionen Basel und Bern",
    excerpt: "Wir erweitern unsere Reichweite für intelligentes Unterhalts- und Gebäudemanagement in der Schweiz, um der wachsenden Kundennachfrage nachzukommen.",
    paragraphs: [
      "Wir freuen uns ausserordentlich, die offizielle Expansion der Kraken Properties & Facilities Management in die Regionen Basel und Bern bekannt zu geben. Dieser strategische Schritt ist unsere Antwort auf die wachsende Nachfrage nach zuverlässigem, datengestütztem Facility Management und anspruchsvollen Reinigungen vor Ort.",
      "Mit der Eröffnung unserer neuen dezentralen Logistikstützpunkte können wir nun auch in Basel und Bern erstklassige Reaktionszeiten innerhalb von 24 Stunden garantieren und dieselben kompromisslosen Qualitätsstandards bieten, wie sie unsere Kunden bereits in Zürich schätzen.",
      "Vom intelligenten IoT-gestützten Büro-Service über Spezialreinigungen bis hin zur fachgerechten Solaranlagenwartung – Kraken FM ist Ihr verlässlicher Ost-West-Partner für den Werterhalt Ihrer Schweizer Immobilien."
    ]
  },
  fr: {
    title: "Kraken FM s'implante dans les régions de Bâle et Berne",
    excerpt: "Nous étendons notre couverture de maintenance et gestion technique en Suisse afin de répondre à la demande croissante de nos clients.",
    paragraphs: [
      "Nous avons le plaisir de vous annoncer l'expansion officielle de Kraken Properties & Facilities Management dans les cantons de Bâle et de Berne. Cette croissance géographique s'inscrit dans notre volonté de soutenir plus étroitement nos partenaires corporatifs et résidentiels.",
      "Nos équipes locales sont désormais opérationnelles et prêtes à intervenir pour garantir une réactivité optimale et des prestations haut de gamme, du Facility Management assisté par capteurs IoT à l'entretien de fin de chantier.",
      "Kraken poursuit sa mission d'excellence : rationaliser le cycle de vie de vos bâtiments avec rigueur et transparence helvétiques."
    ]
  },
  it: {
    title: "Kraken FM espande le attività nelle aree di Basilea e Berna",
    excerpt: "Estendiamo la nostra rete di Facility Management e pulizia professionale intelligente per rispondere alle crescenti richieste aziendali.",
    paragraphs: [
      "Siamo lieti di comunicare l'espansione operativa di Kraken nelle regioni di Basilea e Berna. Questo ampliamento strategico della rete risponde ai bisogni di manutenzione programmata e tecnica riscontrati nel mercato svizzero settentrionale e occidentale.",
      "Le nuove basi operative consentono interventi più rapidi ed efficienti, mantenendo gli stessi altissimi standard qualitativi che contraddistinguono il nostro brand.",
      "Continuiamo a innovare il settore integrando sostenibilità e tecnologia per proteggere il valore del vostro patrimonio edilizio."
    ]
  },
  pt: {
    title: "Kraken FM expande operações para as regiões de Basileia e Berna",
    excerpt: "Alargamos a nossa cobertura geográfica de manutenção inteligente e serviços técnicos de limpeza na Suíça para satisfazer a procura crescente.",
    paragraphs: [
      "É com orgulho que anunciamos a expansão oficial da Kraken Properties & Facilities Management para as áreas metropolitanas de Basileia e Berna. Esse marco reforça a nossa liderança nacional em serviços integrados.",
      "Com postos de apoio estratégico locais ativos nestas regiões, garantimos tempos de resposta imediatos nas manutenções preventivas, monitorização IoT corporativa e limpezas profundas sob garantia.",
      "Agradecemos a confiança de todos os clientes que nos inspiram a crescer com o habitual profissionalismo helvético."
    ]
  }
};

const filterSectionTranslations: Record<string, any> = {
  es: {
    searchPlaceholder: "Buscar artículos...",
    categoriesTitle: "Categorías",
    tagsTitle: "Palabras clave",
    clearFilters: "Limpiar filtros",
    noResultsTitle: "No se encontraron artículos",
    noResultsDesc: "Intenta cambiar los términos de búsqueda o selecciona otra categoría.",
    resetBtn: "Restablecer filtros",
    showingAll: "Mostrando todos los artículos",
    matchingTag: "Etiqueta activa",
    tagTitle: "Filtrar por etiqueta"
  },
  en: {
    searchPlaceholder: "Search articles...",
    categoriesTitle: "Categories",
    tagsTitle: "Keywords & Tags",
    clearFilters: "Clear filters",
    noResultsTitle: "No articles found",
    noResultsDesc: "Try changing your search query or selecting a different category.",
    resetBtn: "Reset Filters",
    showingAll: "Showing all articles",
    matchingTag: "Active tag",
    tagTitle: "Filter by tag"
  },
  de: {
    searchPlaceholder: "Artikel durchsuchen...",
    categoriesTitle: "Kategorien",
    tagsTitle: "Stichworte & Tags",
    clearFilters: "Filter löschen",
    noResultsTitle: "Keine Artikel gefunden",
    noResultsDesc: "Suchen Sie mit anderen Begriffen oder wählen Sie eine andere Kategorie.",
    resetBtn: "Filter zurücksetzen",
    showingAll: "Zeige alle Artikel",
    matchingTag: "Aktiver Tag",
    tagTitle: "Nach Tag filtern"
  },
  fr: {
    searchPlaceholder: "Rechercher des articles...",
    categoriesTitle: "Catégories",
    tagsTitle: "Mots-clés & Tags",
    clearFilters: "Effacer les filtres",
    noResultsTitle: "Aucun article trouvé",
    noResultsDesc: "Essayez de modifier vos critères de recherche ou de changer de catégorie.",
    resetBtn: "Réinitialiser",
    showingAll: "Tous les articles",
    matchingTag: "Tag actif",
    tagTitle: "Filtrer par tag"
  },
  it: {
    searchPlaceholder: "Cerca articoli...",
    categoriesTitle: "Categorie",
    tagsTitle: "Tag & Parole chiave",
    clearFilters: "Cancella filtri",
    noResultsTitle: "Nessun articolo trovato",
    noResultsDesc: "Prova a cambiare i termini di ricerca o seleziona una categoria diversa.",
    resetBtn: "Ripristina filtri",
    showingAll: "Mostrando tutti gli articoli",
    matchingTag: "Tag attivo",
    tagTitle: "Filtra per tag"
  },
  pt: {
    searchPlaceholder: "Pesquisar artigos...",
    categoriesTitle: "Categorias",
    tagsTitle: "Palavras-chave & Tags",
    clearFilters: "Limpar filtros",
    noResultsTitle: "Nenhum artigo encontrado",
    noResultsDesc: "Tente alterar os termos de pesquisa ou selecione uma categoria diferente.",
    resetBtn: "Redefinir filtros",
    showingAll: "Exibindo todos os artigos",
    matchingTag: "Tag ativa",
    tagTitle: "Filtrar por tag"
  }
};

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const { t, language } = useTranslation();
  const currentLang = language || 'es';

  const [selectedArticle, setSelectedArticle] = useState<number | null>(() => {
    if (typeof window !== 'undefined' && window.location) {
      const path = window.location.pathname;
      if (path === '/blog/wohnungsabgabe-zurich-perfekte-uebergabe' || path === '/blog/1') {
        return 1;
      }
      if (path === '/blog/iot-smart-facility-management-schweizer-bueros' || path === '/blog/3') {
        return 3;
      }
    }
    return null;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedCategoryTrans = categoryTranslations[currentLang] || categoryTranslations['es'];
  const tagsTrans = tagTranslations[currentLang] || tagTranslations['es'];
  const filterTrans = filterSectionTranslations[currentLang] || filterSectionTranslations['es'];

  const articles = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
      categoryKey: "cleaning_tips",
      category: selectedCategoryTrans.cleaning_tips,
      title: t('blog.art1.title'),
      excerpt: t('blog.art1.excerpt'),
      date: "02.06.2026",
      author: "Kai (Elite Advisor)",
      readTime: "5 min",
      tagKeys: ["tenancy", "checklist", "zurich", "kaution"],
      paragraphs: [
        t('blog.art1.p1'),
        t('blog.art1.p2'),
        t('blog.art1.p3')
      ]
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
      categoryKey: "facility_management",
      category: selectedCategoryTrans.facility_management,
      title: t('blog.art3.title'),
      excerpt: t('blog.art3.excerpt'),
      date: "15.05.2026",
      author: "Elena (Digital Integration)",
      readTime: "6 min",
      tagKeys: ["iot", "technology", "smart-office", "data"],
      paragraphs: [
        t('blog.art3.p1'),
        t('blog.art3.p2'),
        t('blog.art3.p3')
      ]
    }
  ];

  // Synchronize state with history and pathnames
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePath = () => {
      const path = window.location.pathname;
      if (path === '/blog/wohnungsabgabe-zurich-perfekte-uebergabe' || path === '/blog/1') {
        setSelectedArticle(1);
      } else if (path === '/blog/iot-smart-facility-management-schweizer-bueros' || path === '/blog/3') {
        setSelectedArticle(3);
      } else if (path === '/blog') {
        setSelectedArticle(null);
      }
    };

    window.addEventListener('popstate', handlePath);
    return () => window.removeEventListener('popstate', handlePath);
  }, []);

  // Update document title dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (selectedArticle !== null) {
      const art = articles.find(a => a.id === selectedArticle);
      if (art) {
        document.title = `${art.title} | Kraken FM Insights`;
      }
    } else {
      document.title = `${t('blog.title')} | Kraken FM Insights`;
    }
  }, [selectedArticle, currentLang]);

  const handleArticleClick = (id: number) => {
    const slug = id === 1 ? 'wohnungsabgabe-zurich-perfekte-uebergabe' : 'iot-smart-facility-management-schweizer-bueros';
    const targetPath = `/blog/${slug}`;
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath + window.location.search);
      }
    }
    setSelectedArticle(id);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/blog') {
        window.history.pushState(null, '', '/blog' + window.location.search);
      }
    }
    setSelectedArticle(null);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setActiveTag(null);
    setSearchQuery('');
  };

  const filteredArticles = articles.filter(article => {
    if (selectedCategory !== 'all' && article.categoryKey !== selectedCategory) {
      return false;
    }
    if (activeTag && !article.tagKeys.includes(activeTag)) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = article.title.toLowerCase().includes(query);
      const matchExcerpt = article.excerpt.toLowerCase().includes(query);
      const matchAuthor = article.author.toLowerCase().includes(query);
      const matchCategory = article.category.toLowerCase().includes(query);
      const matchTags = article.tagKeys.some(tagKey => {
        const localized = tagsTrans[tagKey] || tagKey;
        return localized.toLowerCase().includes(query);
      });
      const matchParagraphs = article.paragraphs?.some(p => p.toLowerCase().includes(query)) || false;
      return matchTitle || matchExcerpt || matchAuthor || matchCategory || matchTags || matchParagraphs;
    }
    return true;
  });

  // Calculate unique tags available in the current category to ensure smooth UX
  const availableTags = Array.from(
    new Set(
      articles
        .filter(a => selectedCategory === 'all' || a.categoryKey === selectedCategory)
        .flatMap(a => a.tagKeys)
    )
  );

  const currentArticleObj = selectedArticle !== null ? articles.find(a => a.id === selectedArticle) : null;

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-slate-800" itemScope itemType="https://schema.org/Blog">
      {currentArticleObj && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": currentArticleObj.title,
              "datePublished": currentArticleObj.id === 1 ? "2026-06-02" : "2026-05-15",
              "author": {
                "@type": "Organization",
                "name": "Kraken Properties and Facilities Management"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Kraken Properties and Facilities Management",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://krakenpfm.ch/logo-kraken-azul.webp"
                }
              },
              "image": currentArticleObj.image,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://krakenpfm.ch/blog/${currentArticleObj.id === 1 ? 'wohnungsabgabe-zurich-perfekte-uebergabe' : 'iot-smart-facility-management-schweizer-bueros'}`
              }
            })
          }}
        />
      )}
      {/* Hero Banner Section */}
      <section data-header-theme="dark" className="relative pt-32 pb-24 bg-[#001D3D] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-amber-400 font-extrabold text-xs uppercase tracking-[0.3em] mb-4"
            >
              KRAKEN FM INSIGHTS
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white"
              itemProp="name"
            >
              {t('blog.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-300 text-lg md:text-xl font-normal leading-relaxed max-w-2xl"
            >
              {t('blog.subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-6 py-16">
        {selectedArticle === null ? (
          /* Blog Grid View & Search Sidebar */
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
            
            {/* Filtering bento box sidebar left pane */}
            <motion.aside 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 lg:sticky lg:top-28 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
              id="blog-sidebar"
            >
              {/* Search bar */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {currentLang === 'es' ? 'Buscar' : currentLang === 'de' ? 'Suchen' : 'Search'}
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={filterTrans.searchPlaceholder}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-250 hover:bg-slate-100/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002D5B]/25 rounded-2xl py-3.5 pl-10 pr-4 transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Categories selection list */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {filterTrans.categoriesTitle}
                </h3>
                <div className="flex flex-col gap-1">
                  {/* ALL Categories */}
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setActiveTag(null);
                    }}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl font-bold text-xs transition-all text-left ${
                      selectedCategory === 'all'
                        ? 'bg-[#002D5B] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{selectedCategoryTrans.all}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      selectedCategory === 'all' ? 'bg-[#001D3D] text-amber-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {articles.length}
                    </span>
                  </button>

                  {/* Dynamic Category selectors based on user guidelines */}
                  {Object.keys(selectedCategoryTrans).filter(k => k !== 'all').map((catKey) => {
                    const count = articles.filter(a => a.categoryKey === catKey).length;
                    return (
                      <button
                        key={catKey}
                        onClick={() => {
                          setSelectedCategory(catKey);
                          setActiveTag(null); // Clear tag when main category switches for better consistency
                        }}
                        className={`w-full flex justify-between items-center px-4 py-3 rounded-xl font-bold text-xs transition-all text-left ${
                          selectedCategory === catKey
                            ? 'bg-[#002D5B] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate max-w-[170px]">{selectedCategoryTrans[catKey]}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          selectedCategory === catKey ? 'bg-[#001D3D] text-amber-400' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Tag Cloud */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {filterTrans.tagsTitle}
                  </h3>
                  {activeTag && (
                    <button 
                      onClick={() => setActiveTag(null)}
                      className="text-[10px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 transition-all"
                    >
                      <X className="w-2.5 h-2.5" />
                      {currentLang === 'es' ? 'quitar' : 'clear'}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {availableTags.map((tagKey) => {
                    const isSelected = activeTag === tagKey;
                    return (
                      <button
                        key={tagKey}
                        onClick={() => setActiveTag(isSelected ? null : tagKey)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wide transition-all ${
                          isSelected
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-transparent'
                        }`}
                        title={`${filterTrans.tagTitle}: ${tagsTrans[tagKey] || tagKey}`}
                      >
                        <Tag className="w-2.5 h-2.5 opacity-70" />
                        {tagsTrans[tagKey] || tagKey}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Active state feedback / resets */}
              {(selectedCategory !== 'all' || activeTag !== null || searchQuery !== '') && (
                <div className="pt-2">
                  <button
                    onClick={handleClearFilters}
                    className="w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-600 hover:text-red-700 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    {filterTrans.clearFilters}
                  </button>
                </div>
              )}
            </motion.aside>

            {/* Right Pane: dynamic list of filtered blog posts */}
            <div className="space-y-8">
              {/* Filter feedback chips */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-500">
                  <span>{filterTrans.showingAll}</span>
                  <span className="bg-[#002D5B]/5 text-[#002D5B] px-3 py-1 rounded-full text-xs font-black">
                    {filteredArticles.length}
                  </span>
                </div>

                {/* Feedback flags */}
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== 'all' && (
                    <span className="bg-blue-50 text-blue-700 border border-blue-105 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide flex items-center gap-1.5 animate-fade-in">
                      {selectedCategoryTrans[selectedCategory]}
                      <button onClick={() => setSelectedCategory('all')} className="hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {activeTag && (
                    <span className="bg-amber-50 text-amber-700 border border-amber-105 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide flex items-center gap-1.5 animate-fade-in">
                      {filterTrans.matchingTag}: {tagsTrans[activeTag] || activeTag}
                      <button onClick={() => setActiveTag(null)} className="hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredArticles.length === 0 ? (
                  /* No results empty feedback widget */
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs max-w-xl mx-auto space-y-6"
                  >
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-dashed border-slate-200">
                      🔍
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-slate-800">
                        {filterTrans.noResultsTitle}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-bold px-4">
                        {filterTrans.noResultsDesc}
                      </p>
                    </div>
                    <button
                      onClick={handleClearFilters}
                      className="px-6 py-3.5 bg-[#002D5B] hover:bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
                    >
                      {filterTrans.resetBtn}
                    </button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredArticles.map((article, index) => (
                      <motion.article
                        key={article.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        whileHover={{ y: -6 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-lg border border-slate-100 transition-all duration-300 flex flex-col justify-between"
                        id={`article-card-${article.id}`}
                        itemScope
                        itemType="https://schema.org/BlogPosting"
                      >
                        <meta itemProp="mainEntityOfPage" content="True" />
                        <div>
                          {/* Header Image */}
                          <div className="relative h-56 overflow-hidden bg-slate-200">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-full h-full object-cover transform hover:scale-105 transition-all duration-700"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              itemProp="image"
                            />
                            <button 
                              onClick={() => setSelectedCategory(article.categoryKey)}
                              className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-xs transition-colors"
                            >
                              {article.category}
                            </button>
                          </div>

                          {/* Meta & Info */}
                          <div className="p-6 pb-4">
                            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <time itemProp="datePublished" dateTime="2026-06-02">{article.date}</time>
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {article.readTime}
                              </span>
                            </div>

                            <h2 
                              className="text-lg font-black text-slate-900 leading-snug mb-2 hover:text-blue-600 transition-colors line-clamp-2"
                              itemProp="headline"
                            >
                              {article.title}
                            </h2>
                            
                            <p className="text-slate-500 text-xs font-bold leading-relaxed line-clamp-3 mb-4" itemProp="description">
                              {article.excerpt}
                            </p>

                            {/* Card Tag badging list */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {article.tagKeys.map(tagKey => {
                                const isTagActive = activeTag === tagKey;
                                return (
                                  <button
                                    key={tagKey}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveTag(isTagActive ? null : tagKey);
                                    }}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide transition-all ${
                                      isTagActive 
                                        ? 'bg-amber-100 text-amber-800' 
                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                    }`}
                                    title={`${filterTrans.tagTitle}: ${tagsTrans[tagKey] || tagKey}`}
                                  >
                                    #{tagsTrans[tagKey] || tagKey}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Read More Button */}
                        <div className="p-6 pt-0 border-t border-slate-50 mt-2">
                          <button
                            onClick={() => handleArticleClick(article.id)}
                            className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 group"
                            id={`article-btn-${article.id}`}
                          >
                            <BookOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
                            {t('blog.readMore')}
                          </button>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* Selected Article Detail View (Schema.org compliant) */
          (() => {
            const article = articles.find(a => a.id === selectedArticle);
            if (!article) return null;
            
            const formattedDate = article.date === "02.06.2026" ? "2026-06-02" : "2026-05-15";
            const slug = article.id === 1 ? 'wohnungsabgabe-zurich-perfekte-uebergabe' : 'iot-smart-facility-management-schweizer-bueros';
            const canonicalUrl = `https://krakenpfm.ch/blog/${slug}`;

            const jsonLd = {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": article.title,
              "description": article.excerpt,
              "image": article.image,
              "datePublished": formattedDate,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": canonicalUrl
              },
              "author": {
                "@type": "Organization",
                "name": "Kraken Properties and Facilities Management"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Kraken Properties and Facilities Management",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://krakenpfm.ch/logo-kraken-azul.webp"
                }
              }
            };

            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 md:p-12 relative"
                id="article-detail-view"
                itemScope
                itemType="https://schema.org/BlogPosting"
              >
                <script type="application/ld+json">
                  {JSON.stringify(jsonLd)}
                </script>
                <meta itemProp="mainEntityOfPage" content="True" />
                <meta itemProp="image" content={article.image} />

                {/* Back Button */}
                <button
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 hover:text-blue-600 transition-colors mb-8 cursor-pointer uppercase bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-100"
                  id="back-to-blog-btn"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('blog.backToBlog')}
                </button>

                {/* Article Header Details */}
                <div className="mb-6">
                  <span className="inline-block bg-blue-50 text-blue-600 font-extrabold text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
                    {article.category}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6" itemProp="headline">
                    {article.title}
                  </h1>

                  {/* Author & Info Meta row */}
                  <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-100 text-xs md:text-sm text-slate-500 mb-8">
                    <span className="flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Person">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
                        {article.author.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('blog.author')}</p>
                        <p className="font-bold text-slate-800" itemProp="name">{article.author}</p>
                      </div>
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('blog.published')}</p>
                        <p className="font-bold text-slate-800">
                          <time itemProp="datePublished" dateTime="2026-06-02">{article.date}</time>
                        </p>
                      </div>
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('blog.readTime')}</p>
                        <p className="font-bold text-slate-800">{article.readTime}</p>
                      </div>
                    </span>
                  </div>
                </div>

                {/* Cover Image of specific post */}
                <div className="rounded-2xl overflow-hidden h-72 md:h-[450px] mb-8 bg-slate-150">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Keywords list */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-[10px] font-black uppercase text-slate-450 self-center tracking-wider mr-1">
                    {filterTrans.tagsTitle}:
                  </span>
                  {article.tagKeys.map(tagKey => (
                    <span
                      key={tagKey}
                      className="bg-amber-50 text-amber-800 font-bold rounded-lg border border-amber-100 px-3 py-1.5 text-[10px] uppercase tracking-wide"
                    >
                      #{tagsTrans[tagKey] || tagKey}
                    </span>
                  ))}
                </div>

                {/* Text Paragraph Paragraph Grid */}
                <div className="prose max-w-none text-slate-600 text-base md:text-lg leading-relaxed space-y-6" itemProp="articleBody">
                  {article.paragraphs.map((p, pIndex) => (
                    <p key={pIndex} className="first-letter:text-2xl first-letter:font-bold first-letter:text-blue-600">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Footer Handback navigation inside detail card */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={handleBackToList}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('blog.backToBlog')}
                  </button>
                  <button 
                    onClick={() => onNavigate('consultation')}
                    className="px-6 py-3 bg-[#002B56] hover:bg-amber-400 hover:text-[#001D3D] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    Book Consultation
                  </button>
                </div>
              </motion.div>
            );
          })()
        )}
      </section>
    </main>
  );
};

export default BlogPage;
