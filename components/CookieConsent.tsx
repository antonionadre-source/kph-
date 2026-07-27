import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';

interface CookieConsentProps {
  onNavigate: (page: string) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Toggle states
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kraken_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    } else {
      try {
        const parsed = JSON.parse(consent);
        if (parsed && typeof parsed === 'object') {
          setAnalytics(!!parsed.analytics);
          setMarketing(!!parsed.marketing);
        }
      } catch (e) {
        // Fallback or ignore if it's not JSON
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const consentObj = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('kraken_cookie_consent', JSON.stringify(consentObj));
    setAnalytics(true);
    setMarketing(true);
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    const consentObj = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('kraken_cookie_consent', JSON.stringify(consentObj));
    setAnalytics(false);
    setMarketing(false);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consentObj = { necessary: true, analytics, marketing };
    localStorage.setItem('kraken_cookie_consent', JSON.stringify(consentObj));
    setIsVisible(false);
  };

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('gdpr');
  };

  if (!isVisible) return null;

  return (
    <div 
      id="cookie-consent-banner"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-[100] p-5 md:p-6 animate-slide-up"
    >
      <div className="max-w-7xl mx-auto">
        {!isCustomizing ? (
          /* MAIN BANNER VIEW */
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex-1 text-left">
              <h3 id="cookie-banner-title" className="text-sm font-bold text-[#002D5B] uppercase tracking-wider mb-1.5">
                {t('cookie.title')}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-5xl">
                {t('cookie.message')}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
              <a 
                id="cookie-link-learn-more"
                href="/gdpr" 
                onClick={handleLearnMore}
                className="text-[#002D5B] hover:underline font-semibold text-xs py-2 px-1 tracking-wider uppercase transition-all whitespace-nowrap"
              >
                {t('cookie.learnMore')}
              </a>
              <button
                id="cookie-btn-decline"
                onClick={handleDeclineAll}
                className="text-gray-600 bg-gray-50 hover:bg-gray-100 px-5 py-2.5 rounded-full font-bold tracking-wider uppercase transition-all text-xs border border-gray-150 shadow-sm whitespace-nowrap active:scale-[0.98]"
              >
                {t('cookie.declineAll')}
              </button>
              <button
                id="cookie-btn-customize"
                onClick={() => setIsCustomizing(true)}
                className="text-[#002D5B] bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-full font-bold tracking-wider uppercase transition-all text-xs border border-blue-10/10 shadow-sm whitespace-nowrap active:scale-[0.98]"
              >
                {t('cookie.customize')}
              </button>
              <button
                id="cookie-btn-accept"
                onClick={handleAcceptAll}
                className="bg-[#002D5B] text-white px-7 py-2.5 rounded-full font-bold tracking-wider uppercase hover:bg-[#001D3B] transition-all shadow-md hover:shadow-lg whitespace-nowrap text-xs active:scale-[0.98]"
              >
                {t('cookie.acceptAll')}
              </button>
            </div>
          </div>
        ) : (
          /* GRANULAR CUSTOMIZE VIEW */
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 id="cookie-customize-title" className="text-base font-extrabold text-[#002D5B] uppercase tracking-wider">
                {t('cookie.title')}
              </h3>
              <button
                id="cookie-btn-back"
                onClick={() => setIsCustomizing(false)}
                className="text-xs font-semibold uppercase tracking-widest text-[#002D5B] hover:text-[#001D3B] flex items-center gap-0.5"
              >
                ← {t('cookie.back')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-2">
              {/* Category: Necessary */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-[#002D5B]">{t('cookie.category.necessary.name')}</h4>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide">
                      {t('cookie.status.alwaysActive')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t('cookie.category.necessary.desc')}
                  </p>
                </div>
              </div>

              {/* Category: Analytics */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-white hover:border-slate-200 transition-all duration-250 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2 col-span-1">
                    <h4 className="text-sm font-bold text-[#002D5B]">{t('cookie.category.analytics.name')}</h4>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        id="cookie-analytics"
                        type="checkbox" 
                        checked={analytics} 
                        onChange={(e) => setAnalytics(e.target.checked)} 
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#002D5B]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pt-1">
                    {t('cookie.category.analytics.desc')}
                  </p>
                </div>
              </div>

              {/* Category: Marketing */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-white hover:border-slate-200 transition-all duration-250 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2 col-span-1">
                    <h4 className="text-sm font-bold text-[#002D5B]">{t('cookie.category.marketing.name')}</h4>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        id="cookie-marketing"
                        type="checkbox" 
                        checked={marketing} 
                        onChange={(e) => setMarketing(e.target.checked)} 
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#002D5B]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pt-1">
                    {t('cookie.category.marketing.desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <a 
                id="cookie-custom-link-learn-more"
                href="/gdpr" 
                onClick={handleLearnMore}
                className="text-[#002D5B] hover:underline font-semibold text-xs py-2 tracking-wider uppercase transition-all"
              >
                {t('cookie.learnMore')}
              </a>
              <div className="flex flex-wrap gap-2">
                <button
                  id="cookie-settings-decline"
                  onClick={handleDeclineAll}
                  className="text-gray-600 bg-gray-50 hover:bg-gray-100 px-5 py-2.5 rounded-full font-bold tracking-wider uppercase transition-all text-xs border border-gray-150 shadow-sm active:scale-[0.98]"
                >
                  {t('cookie.declineAll')}
                </button>
                <button
                  id="cookie-settings-save"
                  onClick={handleSavePreferences}
                  className="text-white bg-slate-600 hover:bg-slate-700 px-5 py-2.5 rounded-full font-bold tracking-wider uppercase transition-all text-xs shadow-sm active:scale-[0.98]"
                >
                  {t('cookie.save')}
                </button>
                <button
                  id="cookie-settings-accept"
                  onClick={handleAcceptAll}
                  className="bg-[#002D5B] text-white px-7 py-2.5 rounded-full font-bold tracking-wider uppercase hover:bg-[#001D3B] transition-all shadow-md hover:shadow-lg text-xs active:scale-[0.98]"
                >
                  {t('cookie.acceptAll')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
