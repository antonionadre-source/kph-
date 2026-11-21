import React, { useState, useEffect, useRef, lazy, Suspense, Component, ReactNode } from 'react';
import { useTranslation } from '../i18n';
import { getMetadataForPath, parsePath, PAGE_TO_PATH_MAP } from '../seoConfig';
import { internalDestination } from '../src/navigation';
import SalesHome from './SalesHome';
import { NotFound, RouteFailure, PageLoader } from './RouteStatus';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import { useAuth } from './Auth';

// Helper for lazy loading modules with auto-retry on chunk load failures (e.g., stale bundle hashes)
const lazyWithRetry = <T extends { default: React.ComponentType<any> }>(
  factory: () => Promise<T>
) =>
  lazy(async () => {
    const pageKey = 'chunk_reload_' + window.location.pathname;
    const pageHasBeenReloaded = sessionStorage.getItem(pageKey);
    try {
      const module = await factory();
      sessionStorage.removeItem(pageKey);
      return module;
    } catch (error) {
      if (!pageHasBeenReloaded) {
        sessionStorage.setItem(pageKey, 'true');
        window.location.reload();
        return new Promise<T>(() => {}); // Wait for reload to avoid unhandled rejections
      }
      throw error;
    }
  });

const Clients = lazyWithRetry(() => import('./Clients'));
const FloatingMascot = lazyWithRetry(() => import('./FloatingMascot'));
const FloatingCTA = lazyWithRetry(() => import('./FloatingCTA'));
const CookieConsent = lazyWithRetry(() => import('./CookieConsent'));

// Lazy imports for subpages to reduce initial bundle size and enable route-based code splitting
const ConsultationPage = lazyWithRetry(() => import('./ConsultationPage'));
const SeoServiceCityPage = lazyWithRetry(() => import('./SeoServiceCityPage'));
const AboutPage = lazyWithRetry(() => import('./AboutPage'));
const ComicPage = lazyWithRetry(() => import('./ComicPage'));
const ServicesPage = lazyWithRetry(() => import('./ServicesPage'));
const CommercialServicesPage = lazyWithRetry(() => import('./CommercialServicesPage'));
const LoginPage = lazyWithRetry(() => import('./LoginPage'));
const RegisterPage = lazyWithRetry(() => import('./RegisterPage'));
const Dashboard = lazyWithRetry(() => import('./Dashboard'));
const GDPRPage = lazyWithRetry(() => import('./GDPRPage'));
const HSEPage = lazyWithRetry(() => import('./HSEPage'));
const TermsPage = lazyWithRetry(() => import('./TermsPage'));
const SustainabilityPage = lazyWithRetry(() => import('./SustainabilityPage'));
const CareersPage = lazyWithRetry(() => import('./CareersPage'));
const OurStoryPage = lazyWithRetry(() => import('./OurStoryPage'));
const ImpressumPage = lazyWithRetry(() => import('./ImpressumPage'));
const KontaktPage = lazyWithRetry(() => import('./KontaktPage'));
const ComicShopPage = lazyWithRetry(() => import('./ComicShopPage'));
const BlogPage = lazyWithRetry(() => import('./BlogPage'));
const CommercialQuotePage = lazyWithRetry(() => import('./CommercialQuotePage'));
const ReviewInvitePage = lazyWithRetry(() => import('./ReviewInvitePage'));
const InnerwebsHero = lazyWithRetry(() => import('./InnerwebsHero'));
const RegionHubPage = lazyWithRetry(() => import('./RegionHubPage').then(m => ({ default: m.RegionHubPage })));
const MunicipalityPage = lazyWithRetry(() => import('./MunicipalityPage').then(m => ({ default: m.MunicipalityPage })));
const CoverageHubPage = lazyWithRetry(() => import('./CoverageHubPage'));

interface ChunkErrorBoundaryProps {
  key?: string;
  children: ReactNode;
}

interface ChunkErrorBoundaryState {
  hasError: boolean;
}

// Error boundary to catch lazy import failure and display a fallback
class ChunkErrorBoundary extends Component<ChunkErrorBoundaryProps, ChunkErrorBoundaryState> {
  declare props: ChunkErrorBoundaryProps;
  declare state: ChunkErrorBoundaryState;

  constructor(props: ChunkErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ChunkErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('Caught chunk loading error in ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return <RouteFailure />;
    }
    return this.props.children;
  }
}

// --- Firebase Configuration (Modular v9+) ---
import { auth as firebaseAuth } from './firebaseAuth';
export const auth = firebaseAuth;
// ------------------------------

const CART_STORAGE_KEY = 'kraken_cart_persistent';

const App: React.FC = () => {
  const { language, t } = useTranslation();
  const [innerwebsDesign, setInnerwebsDesign] = useState(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('design') === 'innerwebs');
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

  // Load cart, set mounted state and force scroll to top on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }
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

  // Route parsing uses pathname only; the URL retains search and hash separately.
  useEffect(() => {
    const change = () => {
      let location = internalDestination(window.location.pathname + window.location.search + window.location.hash, window.location.href);
      setInnerwebsDesign(new URLSearchParams(location.search).get('design') === 'innerwebs');
      const route = parsePath(location.pathname);
      if (route.page === 'dashboard' && !authLoading && !user) {
        location = internalDestination('/login', window.location.href);
        window.history.replaceState(null, '', location.href);
        setPage('login');
      } else setPage(route.page);
      setSeoCityId(route.cityId); setSeoServiceId(route.serviceId);
    };
    window.addEventListener('popstate', change); change();
    return () => window.removeEventListener('popstate', change);
  }, [user, authLoading]);

  useEffect(() => {
    if (!window.location.hash) return;
    let timer: ReturnType<typeof setTimeout>;
    const scroll = () => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const anchor = document.getElementById(id);
      if (anchor) { anchor.scrollIntoView({ block: 'start', behavior: 'auto' }); observer.disconnect(); clearTimeout(timer); }
    };
    const observer = new MutationObserver(scroll);
    observer.observe(document.getElementById('main-content') || document.body, { childList: true, subtree: true });
    timer = setTimeout(() => observer.disconnect(), 5000); scroll();
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [page, seoCityId, seoServiceId]);

  const handleNavigate = (target: string) => {
    const path = target.startsWith('/') ? target : (PAGE_TO_PATH_MAP[target] || '/');
    let destination = internalDestination(path, window.location.href);
    if (new URLSearchParams(window.location.search).get('design') === 'innerwebs') {
      const search = new URLSearchParams(destination.search);
      if (!search.has('design')) {
        search.set('design', 'innerwebs');
        destination = internalDestination(`${destination.pathname}?${search.toString()}${destination.hash}`, window.location.href);
      }
    }
    let route = parsePath(destination.pathname);
    setInnerwebsDesign(new URLSearchParams(destination.search).get('design') === 'innerwebs');
    // The page renderer handles guests. A login callback may still hold the
    // previous render's user value, so it must not redirect a completed sign-in.
    if (destination.href !== window.location.pathname + window.location.search + window.location.hash) window.history.pushState(null, '', destination.href);
    setSeoCityId(route.cityId); setSeoServiceId(route.serviceId); setPage(route.page);
    if (!destination.hash) window.scrollTo({ top: 0, behavior: 'instant' });
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
      <ChunkErrorBoundary key={page}>
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
                return <PageLoader />;
              }
              if (!user) {
                return <LoginPage onNavigate={handleNavigate} />;
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
              return <NotFound onNavigate={handleNavigate} />;
            case 'home':
            default:
              return (
                <main>
                  {page === 'home' && innerwebsDesign ? <InnerwebsHero onNavigate={handleNavigate} /> : <Hero onNavigate={handleNavigate} />}
                  <SalesHome onNavigate={handleNavigate} />
                </main>
              );
          }
        })()}
      </Suspense>
    </ChunkErrorBoundary>
  );
};

  const isReviewPage = page === 'review-invite';
  const isInnerwebsPreview = page === 'home' && innerwebsDesign;

  return (
    <div className={`kraken-app relative${isInnerwebsPreview ? ' kraken-innerwebs-preview' : ''}`}>
      {mounted && !isReviewPage && (
        <Suspense fallback={null}>
          <FloatingMascot currentPage={page} cart={cart} onNavigate={handleNavigate} seoCityId={seoCityId} />
          <FloatingCTA onNavigate={handleNavigate} currentPage={page} />
        </Suspense>
      )}

      {!isReviewPage && <Header onNavigate={handleNavigate} currentPage={page as any} theme={isInnerwebsPreview ? 'retro' : undefined} />}
      <div id="main-content" className={'kraken-route kraken-route--' + page} data-page={page} tabIndex={-1}>{renderPage()}</div>
      {!isReviewPage && (
        <Suspense fallback={null}>
          <Footer onNavigate={handleNavigate} theme={isInnerwebsPreview ? 'retro' : undefined} />
        </Suspense>
      )}
      {mounted && !isReviewPage && (
        <Suspense fallback={null}>
          <CookieConsent onNavigate={handleNavigate} />
        </Suspense>
      )}


    </div>
  );
};

export default App;
