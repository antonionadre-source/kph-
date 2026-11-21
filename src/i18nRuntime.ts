import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import de from './locales/de.json';

export type Language = 'en' | 'de-CH' | 'de' | 'fr' | 'it' | 'es' | 'pt';
type Dictionary = Record<string, string>;
const loaders = { en: () => import('./locales/en.json'), es: () => import('./locales/es.json'), fr: () => import('./locales/fr.json'), it: () => import('./locales/it.json'), pt: () => import('./locales/pt.json') };
export const translations: Record<Language, Dictionary> = { de, 'de-CH': de, en: {}, es: {}, fr: {}, it: {}, pt: {} };
const pending = new Map<string, Promise<void>>();
export const LANGUAGE_NAMES: Record<Language, string> = { 'de-CH': 'Deutsch (Schweiz)', de: 'Deutsch', en: 'English', es: 'Español', fr: 'Français', it: 'Italiano', pt: 'Português' };

export function languageFromInputs(search = '', saved?: string | null, browser?: string): Language {
  const params = new URLSearchParams(search);
  const normalise = (value?: string | null): Language | undefined => {
    if (!value) return;
    return (Object.keys(LANGUAGE_NAMES) as Language[]).find(l => l.toLowerCase() === value.toLowerCase()) || (Object.keys(LANGUAGE_NAMES) as Language[]).find(l => l === value.slice(0, 2).toLowerCase());
  };
  return normalise(params.get('lang') || params.get('hl')) || normalise(saved) || (browser?.toLowerCase().startsWith('de') ? normalise(browser) : undefined) || 'de-CH';
}
export function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'de-CH';
  let saved: string | null = null;
  try { saved = localStorage.getItem('kraken_preferred_lang'); } catch { /* Private browsing may deny storage. */ }
  return languageFromInputs(window.location?.search || '', saved, typeof navigator === 'undefined' ? undefined : navigator.language);
}
export function preloadLanguage(language: Language): Promise<void> {
  if (Object.keys(translations[language]).length) return Promise.resolve();
  if (!pending.has(language)) {
    pending.set(language, loaders[language as keyof typeof loaders]().then(module => { translations[language] = module.default; }).catch(error => { pending.delete(language); throw error; }));
  }
  return pending.get(language)!;
}
interface I18nContextType { language: Language; setLanguage: (language: Language) => void; t: (key: string, params?: Record<string, string | number>) => string; }
const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage);
  const [, setRevision] = useState(0);
  const [error, setError] = useState('');
  const request = useRef(0);
  useEffect(() => { let active = true; preloadLanguage(language).then(() => { if (active) setRevision(n => n + 1); }).catch(() => { if (active) setError('Language could not load. Please try again.'); }); return () => { active = false; }; }, [language]);
  useEffect(() => { document.documentElement.lang = language.startsWith('de') ? 'de' : language; }, [language]);
  const setLanguage = (next: Language) => {
    const id = ++request.current;
    void preloadLanguage(next).then(() => {
      if (id !== request.current) return;
      setLanguageState(next); setError('');
      try {
        localStorage.setItem('kraken_preferred_lang', next);
        const url = new URL(window.location.href); url.searchParams.set('lang', next); url.searchParams.delete('hl');
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch { /* Language still changes if persistence is unavailable. */ }
    }).catch(() => setError('Language could not load. Please try again.'));
  };
  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[language][key] || de[key as keyof typeof de] || key;
    if (params) for (const [name, value] of Object.entries(params)) text = text.replaceAll(`{${name}}`, String(value));
    return text;
  };
  return React.createElement(I18nContext.Provider, { value: { language, setLanguage, t } }, children, error ? React.createElement('p', { role: 'alert', className: 'fixed top-20 inset-x-4 z-[200] rounded-xl bg-white p-4 text-slate-900 shadow-lg' }, error) : null);
}
export function useTranslation() { const value = useContext(I18nContext); if (!value) throw new Error('useTranslation must be used within I18nProvider'); return value; }
