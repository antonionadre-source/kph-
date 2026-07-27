import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useTranslation } from '../i18n';
import { getMetadataForPath, parsePath } from '../seoConfig';
import { MUNICIPALITIES } from '../src/data/locations';
import Header from './Header';
import Hero from './Hero';
import SegmentationSection from './SegmentationSection';
import Clients from './Clients';
import Footer from './Footer';
import FloatingMascot from './FloatingMascot';
import FloatingCTA from './FloatingCTA';
import { useAuth } from './Auth';
import CookieConsent from './CookieConsent';
import ValuesSection from './ValuesSection';

// Direct imports for full pre-rendering SEO content inside #root
import ConsultationPage from './ConsultationPage';
import SeoServiceCityPage from './SeoServiceCityPage';
import AboutPage from './AboutPage';
import ComicPage from './ComicPage';
import ServicesPage from './ServicesPage';
import CommercialServicesPage from './CommercialServicesPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import GDPRPage from './GDPRPage';
import HSEPage from './HSEPage';
import TermsPage from './TermsPage';
import SustainabilityPage from './SustainabilityPage';
import CareersPage from './CareersPage';
import OurStoryPage from './OurStoryPage';
import ImpressumPage from './ImpressumPage';
import KontaktPage from './KontaktPage';
import ComicShopPage from './ComicShopPage';
import BlogPage from './BlogPage';
import CommercialQuotePage from './CommercialQuotePage';
import ReviewInvitePage from './ReviewInvitePage';
import { RegionHubPage } from './RegionHubPage';
import { MunicipalityPage } from './MunicipalityPage';
import CoverageHubPage from './CoverageHubPage';

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// --- Firebase Configuration ---
export const db = (window as any).db;
export const auth = (window as any).auth;
// ------------------------------

const CART_STORAGE_KEY = 'kraken_cart_persistent';

const PATH_TO_PAGE_MAP: Record<string, string> = {
  '/': 'home',
  '/quote': 'consultation',
  '/about': 'about',
  '/services': 'services-page',
  '/commercial': 'commercial-services',
  '/careers': 'careers',
  '/sustainability': 'sustainability-page',
  '/our-story': 'our-story',
  '/blog': 'blog',
  '/blog/wohnungsabgabe-zurich-perfekte-uebergabe': 'blog',
  '/blog/iot-smart-facility-management-schweizer-bueros': 'blog',
  '/comic': 'comic-page',
  '/comic-shop': 'comic-shop',
  '/gdpr': 'gdpr',
  '/terms': 'terms',
  '/hse': 'hse',
  '/impressum': 'impressum',
  '/imprint': 'impressum',
  '/kontakt': 'kontakt',
  '/login': 'login',
  '/register': 'register',
  '/dashboard': 'dashboard',
  '/commercial-quote': 'commercial-quote',
  '/review-invite': 'review-invite',
  '/reviews': 'review-invite',
  '/reviewsvip': 'review-invite',
  '/dejar-opinion': 'review-invite',
};

const PAGE_TO_PATH_MAP: Record<string, string> = {
  'home': '/',
  'consultation': '/quote',
  'about': '/about',
  'services-page': '/services',
  'commercial-services': '/commercial',
  'careers': '/careers',
  'sustainability-page': '/sustainability',
  'our-story': '/our-story',
  'blog': '/blog',
  'comic-page': '/comic',
  'comic-shop': '/comic-shop',
  'gdpr': '/gdpr',
  'terms': '/terms',
  'hse': '/hse',
  'impressum': '/impressum',
  'kontakt': '/kontakt',
  'login': '/login',
  'register': '/register',
  'dashboard': '/dashboard',
  'commercial-quote': '/commercial-quote',
  'review-invite': '/reviews',
};


const App: React.FC = () => {
  const { language, t } = useTranslation();
  const [page, setPage] = useState(() => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    return parsePath(currentPath).page;
  });
  const [seoCityId, setSeoCityId] = useState(() => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    return parsePath(currentPath).cityId;
  });
  const [seoServiceId, setSeoServiceId] = useState(() => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    return parsePath(currentPath).serviceId;
  });
  const { user, loading: authLoading } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const cartLoadedRef = useRef(false);
  
  // Persistent Cart State
  const [cart, setCart] = useState<any[]>([]);

  // Load cart and set mounted state on mount (client-only)
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
    cartLoadedRef.current = true;
  }, []);

  // Sync Cart to LocalStorage
  useEffect(() => {
    if (cartLoadedRef.current) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  // Synchronize state with URL on popstate and initial load
  useEffect(() => {
    const handleLocationChange = () => {
      const currentPath = window.location.pathname;

      const parsed = parsePath(currentPath);
      const targetPage = parsed.page;
      
      setSeoCityId(parsed.cityId);
      setSeoServiceId(parsed.serviceId);
      
      const isReviewUser = typeof window !== 'undefined' && localStorage.getItem('kraken_review_user') === 'true';
      const isStaff = user?.email?.toLowerCase().trim().endsWith('@krakenpfm.ch') || 
                      user?.email?.toLowerCase().trim() === 'kai@krakenpfm.ch' || 
                      user?.email?.toLowerCase().trim() === 'antonio.nadre@anotherstar.com';

      // Guard dashboard access
      if (targetPage === 'dashboard') {
        if (authLoading) {
          setPage('dashboard');
        } else if (!user) {
          setPage('login');
          if (window.location.pathname !== '/login') {
            window.history.replaceState(null, '', '/login' + window.location.search);
          }
        } else if (isReviewUser && !isStaff) {
          // Strictly block dashboard access for reviewers and redirect to home
          setPage('home');
          if (window.location.pathname !== '/') {
            window.history.replaceState(null, '', '/' + window.location.search);
          }
        } else {
          setPage('dashboard');
        }
      } else {
        setPage(targetPage);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    
    // Process on mount or when user changes
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [user, authLoading]);

  // Clean up review user flag when logged out
  useEffect(() => {
    if (!user) {
      localStorage.removeItem('kraken_review_user');
    }
  }, [user]);

  // Set review flag if page is review invite
  useEffect(() => {
    if (page === 'review-invite') {
      localStorage.setItem('kraken_review_user', 'true');
    }
  }, [page]);

  const handleNavigate = (targetPage: string) => {
    const isReviewUser = typeof window !== 'undefined' && localStorage.getItem('kraken_review_user') === 'true';
    const isStaff = user?.email?.toLowerCase().trim().endsWith('@krakenpfm.ch') || 
                    user?.email?.toLowerCase().trim() === 'kai@krakenpfm.ch' || 
                    user?.email?.toLowerCase().trim() === 'antonio.nadre@anotherstar.com';

    if (targetPage.startsWith('/')) {
      if (window.location.pathname !== targetPage) {
        window.history.pushState(null, '', targetPage + window.location.search);
      }
      const parsed = parsePath(targetPage);
      setSeoCityId(parsed.cityId);
      setSeoServiceId(parsed.serviceId);
      setPage(parsed.page);
      window.scrollTo(0, 0);
      return;
    }

    if (targetPage === 'dashboard') {
      if (!user) {
        const loginPath = PAGE_TO_PATH_MAP['login'] || '/login';
        if (window.location.pathname !== loginPath) {
          window.history.pushState(null, '', loginPath + window.location.search);
        }
        setPage('login');
        window.scrollTo(0, 0);
        return;
      }
      if (isReviewUser && !isStaff) {
        // Prevent review-logged users from opening dashboard
        const homePath = '/';
        if (window.location.pathname !== homePath) {
          window.history.pushState(null, '', homePath + window.location.search);
        }
        setPage('home');
        window.scrollTo(0, 0);
        return;
      }
    }
    
    const targetPath = PAGE_TO_PATH_MAP[targetPage] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath + window.location.search);
    }
    setPage(targetPage);
    window.scrollTo(0, 0);
  };

  // --- Dynamic SEO: per-page <title> and meta description (DE primary, fully localized) ---
  React.useEffect(() => {
    const currentPath = window.location.pathname;
    const meta = getMetadataForPath(currentPath, language);

    document.title = meta.title;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.setAttribute('name', 'description');
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', meta.description);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', meta.canonical);

    // Hreflang links (Disabled per SEO requirements)
    const alternates = document.querySelectorAll('link[rel="alternate"][hreflang]');
    alternates.forEach(el => el.remove());

    // Synchronize OG and Twitter tags dynamically
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', meta.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', meta.description);
  }, [page, language, seoCityId, seoServiceId]);


  const renderPage = () => {
    return (
      <Suspense fallback={<PageLoader />}>
        {(() => {
          switch (page) {
            case 'about':
              return <AboutPage onNavigate={handleNavigate} />;
            case 'comic-page':
              return <ComicPage onNavigate={handleNavigate} />;
            case 'services-page':
              return <ServicesPage onNavigate={handleNavigate} />;
            case 'commercial-services':
              return <CommercialServicesPage onNavigate={handleNavigate} />;
            case 'commercial-quote':
              return <CommercialQuotePage onNavigate={handleNavigate} />;
            case 'review-invite':
              return <ReviewInvitePage onNavigate={handleNavigate} />;
            case 'redirecting':
              return (
                <div id="redirect-loading-screen" className="flex flex-col items-center justify-center min-h-[90vh] bg-[#001A3D] text-white p-6 text-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 animate-spin"></div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Redireccionando a Google Reviews</h2>
                  <p className="text-white/60 max-w-sm">Si no te redirecciona automáticamente en unos segundos, haz clic en el siguiente enlace:</p>
                  <a href="https://search.google.com/local/writereview?placeid=ChIJw_vX3CgQkEcR_VMyRUpGfK4" className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-medium transition-colors text-sm text-white inline-block">
                    ⭐️ Enlace Directo Google Reviews
                  </a>
                </div>
              );
            case 'clients':
              return <Clients onNavigate={handleNavigate} />;
            case 'dashboard':
              if (authLoading) {
                return (
                  <div id="auth-loading-screen" className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                    <div className="relative w-16 h-16 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-600/10"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-blue-600 animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 font-sans">Lade Kraken PFM...</h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-xs font-sans">Einen Moment bitte, während die Verbindung hergestellt wird.</p>
                  </div>
                );
              }
              if (!user) {
                return <Clients onNavigate={handleNavigate} />;
              }
              return <Dashboard />;
            case 'login':
              return <LoginPage onNavigate={handleNavigate} />;
            case 'register':
              return <RegisterPage onNavigate={handleNavigate} />;
            case 'consultation':
              return <ConsultationPage onNavigate={handleNavigate} cart={cart} setCart={setCart} />;
            case 'gdpr':
              return <GDPRPage />;
            case 'hse':
              return <HSEPage />;
            case 'terms':
              return <TermsPage onNavigate={handleNavigate} />;
            case 'impressum':
              return <ImpressumPage onNavigate={handleNavigate} />;
            case 'kontakt':
              return <KontaktPage onNavigate={handleNavigate} />;
            case 'sustainability-page':
              return <SustainabilityPage onNavigate={handleNavigate} />;
            case 'careers':
              return <CareersPage onNavigate={handleNavigate} />;
            case 'our-story':
              return <OurStoryPage onNavigate={handleNavigate} />;
            case 'comic-shop':
              return <ComicShopPage onNavigate={handleNavigate} cart={cart} setCart={setCart} />;
            case 'blog':
              return <BlogPage onNavigate={handleNavigate} />;
            case 'region-hub':
              return <RegionHubPage regionId={seoCityId as any} onNavigate={handleNavigate} />;
            case 'municipality-page':
              return <MunicipalityPage municipalitySlug={seoCityId} onNavigate={handleNavigate} />;
            case 'seo-landing':
              return <SeoServiceCityPage cityId={seoCityId} serviceId={seoServiceId} onNavigate={handleNavigate} />;
            case 'coverage-hub':
              return <CoverageHubPage onNavigate={handleNavigate} />;
            case '404':
              return (
                <div id="404-not-found-screen" className="flex flex-col items-center justify-center min-h-[85vh] bg-slate-950 text-white p-8 text-center relative overflow-hidden font-sans">
                  {/* Visual Background Accent */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                  
                  <div className="relative z-10 max-w-xl mx-auto">
                    {/* Animated Mascot / Badge */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 text-blue-500 text-3xl font-black mb-8 shadow-2xl animate-pulse">
                      🐙
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                      Hoppla! Seite nicht gefunden
                    </h1>
                    
                    <p className="text-sm md:text-base text-slate-400 mb-10 leading-relaxed max-w-md mx-auto">
                      Die gesuchte Seite existiert nicht oder wurde verschoben. Finden Sie schnell den richtigen Weg mit unseren Direktlinks:
                    </p>

                    {/* Quick Navigation Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left">
                      <button
                        onClick={() => handleNavigate('/einsatzgebiete')}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-blue-600/15 border border-white/10 hover:border-blue-500/50 transition-all group"
                      >
                        <div>
                          <div className="text-xs font-black uppercase text-blue-400 tracking-wider mb-0.5">{t('nav.coverage')}</div>
                          <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{t('footer.allLocations')}</div>
                        </div>
                        <span className="text-blue-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
                      </button>

                      <button
                        onClick={() => handleNavigate('/quote')}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-blue-600/15 border border-white/10 hover:border-blue-500/50 transition-all group"
                      >
                        <div>
                          <div className="text-xs font-black uppercase text-blue-400 tracking-wider mb-0.5">Sofort-Offerte</div>
                          <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Preis berechnen (CHF)</div>
                        </div>
                        <span className="text-blue-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
                      </button>

                      <button
                        onClick={() => handleNavigate('/reinigung/region-zuerich')}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-blue-600/15 border border-white/10 hover:border-blue-500/50 transition-all group sm:col-span-2"
                      >
                        <div>
                          <div className="text-xs font-black uppercase text-blue-400 tracking-wider mb-0.5">Regional-Hub Zürich</div>
                          <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Umzugs- &amp; Facility Services in Zürich</div>
                        </div>
                        <span className="text-blue-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>

                    {/* Support Channels */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-white/5 pt-8">
                      <button
                        onClick={() => handleNavigate('/')}
                        className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest rounded-full transition-all text-white"
                      >
                        Zur Startseite
                      </button>

                      <a
                        href="https://wa.me/41774505705"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba56] text-xs font-black uppercase tracking-widest rounded-full transition-all text-slate-950 inline-flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>Live-Support via WhatsApp</span>
                        <span className="inline-block w-2 h-2 bg-slate-950 rounded-full animate-ping" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            case 'home':
            default:
              return (
                <>
                  <main>
                    <Hero onNavigate={handleNavigate} />
                    <SegmentationSection onNavigate={handleNavigate} />
                    <ValuesSection />
                  </main>
                </>
              );
          }
        })()}
      </Suspense>
    );
  };

  const isReviewPage = page === 'review-invite';

  return (
    <div className="bg-slate-50 text-gray-800 relative">
      {mounted && !isReviewPage && <FloatingMascot currentPage={page} cart={cart} onNavigate={handleNavigate} seoCityId={seoCityId} />}
      {mounted && !isReviewPage && <FloatingCTA onNavigate={handleNavigate} currentPage={page} />}
      
      {!isReviewPage && <Header onNavigate={handleNavigate} currentPage={page as any} />}
      {renderPage()}
      {!isReviewPage && <Footer onNavigate={handleNavigate} />}
      {mounted && !isReviewPage && <CookieConsent onNavigate={handleNavigate} />}
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;