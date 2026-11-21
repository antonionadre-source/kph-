/** Keep language in the query string and anchors out of route parsing. */
export function internalDestination(target: string, current: string) {
  const base = new URL(current), next = new URL(target, base);
  if (next.origin !== base.origin) throw new Error('Internal navigation requires the same origin.');
  if (!next.search && next.pathname === base.pathname) next.search = base.search;
  if (!next.searchParams.has('lang') && !next.searchParams.has('hl')) {
    const language = base.searchParams.get('lang') || base.searchParams.get('hl');
    if (language) next.searchParams.set('lang', language);
  }
  return { pathname: next.pathname, search: next.search, hash: next.hash, href: next.pathname + next.search + next.hash };
}
