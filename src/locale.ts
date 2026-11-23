export const SITE_LANGUAGES = ['de-CH', 'de', 'en', 'fr', 'it', 'es', 'pt'] as const;
export type SiteLanguage = typeof SITE_LANGUAGES[number];
export const LANGUAGE_STORAGE_KEY = 'kraken_preferred_lang';
export const LOCALE_LOCATION_EVENT = 'kraken:locationchange';

export function normalizeSiteLanguage(value: unknown): SiteLanguage | null {
  if (typeof value !== 'string') return null;
  const code = value.trim().toLowerCase();
  if (code === 'de-ch') return 'de-CH';
  if (SITE_LANGUAGES.includes(code as SiteLanguage)) return code as SiteLanguage;
  const regional = /^(de|en|fr|it|es|pt)-[a-z]{2}(?:-[a-z0-9]+)*$/.exec(code);
  return regional ? regional[1] as SiteLanguage : null;
}

export function languageFromSearch(search: string): SiteLanguage | null {
  const params = new URLSearchParams(search);
  return normalizeSiteLanguage(params.get('lang')) || normalizeSiteLanguage(params.get('hl'));
}

export function resolveSiteLanguage({ search = '', saved = null, browserLanguage = '' }: {
  search?: string; saved?: unknown; browserLanguage?: string;
} = {}): SiteLanguage {
  const explicit = languageFromSearch(search);
  if (explicit) return explicit;
  const preferred = normalizeSiteLanguage(saved);
  if (preferred) return preferred;
  const browser = normalizeSiteLanguage(browserLanguage);
  return browser === 'de' || browser === 'de-CH' ? browser : 'de-CH';
}

export function languageSelectionUrl(href: string, language: SiteLanguage): string {
  const url = new URL(href);
  url.searchParams.delete('hl');
  url.searchParams.set('lang', language);
  return url.pathname + url.search + url.hash;
}

/** Merge route queries without duplicating '?'; an explicit target locale wins. */
export function localizedNavigationUrl(target: string, currentHref: string, language: SiteLanguage): string {
  const current = new URL(currentHref);
  const destination = new URL(target, current);
  if (destination.origin !== current.origin) throw new Error('Expected a same-origin navigation route.');
  const explicit = languageFromSearch(destination.search);
  const targetKeys = new Set(destination.searchParams.keys());
  for (const [key, value] of current.searchParams) {
    if (!targetKeys.has(key)) destination.searchParams.append(key, value);
  }
  destination.searchParams.delete('hl');
  destination.searchParams.set('lang', explicit || language);
  return destination.pathname + destination.search + destination.hash;
}
