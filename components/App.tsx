import React, { useState, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import WhyKrakenSection from './WhyKrakenSection';
import SegmentationSection from './SegmentationSection';
import About from './About';
import Clients, { ClientCarousel } from './Clients';
import Footer from './Footer';
import FloatingMascot from './FloatingMascot';
import FloatingCTA from './FloatingCTA';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import { useAuth } from './Auth';
import AboutPage from './AboutPage';
import ComicPage from './ComicPage';
import ConsultationPage from './ConsultationPage';
import GDPRPage from './GDPRPage';
import ServicesPage from './ServicesPage';
import CommercialServicesPage from './CommercialServicesPage';
import SustainabilityPage from './SustainabilityPage';
import CareersPage from './CareersPage';
import CookieConsent from './CookieConsent';
import PrecisionQuoteSection from './PrecisionQuoteSection';
import HSEPage from './HSEPage';
import TermsPage from './TermsPage';
import HowItWorks from './HowItWorks';

// --- Firebase Configuration ---
export const db = (window as any).db;
export const auth = (window as any).auth;
// ------------------------------

const CART_STORAGE_KEY = 'kraken_cart_persistent';

const App: React.FC = () => {
  const [page, setPage] = useState('home');
  const { user } = useAuth();
  
  // Persistent Cart State
  const [cart, setCart] = useState<any[]>(() => {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const handleNavigate = (targetPage: string) => {
    if (targetPage === 'login' || targetPage === 'register' || (targetPage === 'dashboard' && !user)) {
      setPage('clients');
      return;
    }
    
    setPage(targetPage);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (page) {
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'comic-page':
        return <ComicPage onNavigate={handleNavigate} />;
      case 'services-page':
        return <ServicesPage onNavigate={handleNavigate} />;
      case 'commercial-services':
        return <CommercialServicesPage onNavigate={handleNavigate} />;
      case 'clients':
        return <Clients onNavigate={handleNavigate} />;
      case 'dashboard':
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
      case 'sustainability-page':
        return <SustainabilityPage onNavigate={handleNavigate} />;
      case 'careers':
        return <CareersPage onNavigate={handleNavigate} />;
      case 'home':
      default:
        return (
          <>
            <main>
              <Hero onNavigate={handleNavigate} />
              <SegmentationSection onNavigate={handleNavigate} />
              <ClientCarousel />
            </main>
          </>
        );
    }
  };

  return (
    <div className="bg-slate-50 text-gray-800 relative">
      <FloatingMascot currentPage={page} cart={cart} onNavigate={handleNavigate} />
      <FloatingCTA onNavigate={handleNavigate} currentPage={page} />
      
      <Header onNavigate={handleNavigate} currentPage={page as any} />
      {renderPage()}
      <Footer onNavigate={handleNavigate} />
      <CookieConsent onNavigate={handleNavigate} />
      
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