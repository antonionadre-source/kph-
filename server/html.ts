export function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
export function languageFromRequest(query: unknown, header?: string) {
  const supported = new Set(['de', 'en', 'fr', 'it', 'es', 'pt']);
  if (typeof query === 'string' && supported.has(query.toLowerCase())) return query.toLowerCase();
  for (const locale of (header || '').split(',')) {
    const lang = locale.trim().split(';')[0].split('-')[0].toLowerCase();
    if (supported.has(lang)) return lang;
  }
  return 'de';
}

export function renderInitialHtml(html: string, original: { title: string; description: string; canonical: string; h1: string; bodyText: string }, language: string) {
      const meta = { ...original, title: escapeHtml(original.title), description: escapeHtml(original.description), canonical: escapeHtml(original.canonical) };

      // Replace Title
      let renderedHtml = html.replace(
        /<title>[\s\S]*?<\/title>/i,
        `<title>${meta.title}</title>`
      );

      // Replace other title metas
      renderedHtml = renderedHtml.replace(
        /<meta property="og:title" content="[\s\S]*?">/i,
        `<meta property="og:title" content="${meta.title}">`
      );
      renderedHtml = renderedHtml.replace(
        /<meta name="twitter:title" content="[\s\S]*?">/i,
        `<meta name="twitter:title" content="${meta.title}">`
      );
      renderedHtml = renderedHtml.replace(
        /<meta name="title" content="[\s\S]*?">/i,
        `<meta name="title" content="${meta.title}">`
      );

      // Replace Description
      renderedHtml = renderedHtml.replace(
        /<meta name="description" content="[\s\S]*?">/i,
        `<meta name="description" content="${meta.description}">`
      );
      renderedHtml = renderedHtml.replace(
        /<meta property="og:description" content="[\s\S]*?">/i,
        `<meta property="og:description" content="${meta.description}">`
      );
      renderedHtml = renderedHtml.replace(
        /<meta name="twitter:description" content="[\s\S]*?">/i,
        `<meta name="twitter:description" content="${meta.description}">`
      );

      // Replace Canonical
      renderedHtml = renderedHtml.replace(
        /<link rel="canonical" href="[\s\S]*?" \/>/i,
        `<link rel="canonical" href="${meta.canonical}" />`
      );

      // Strip existing alternate hreflangs to avoid duplication
      renderedHtml = renderedHtml.replace(
        /<link rel="alternate" hreflang="[\s\S]*?" href="[\s\S]*?">/gi,
        ""
      );

      const lang = languageFromRequest(language);
      const locale = { de: 'de_CH', en: 'en_GB', fr: 'fr_CH', it: 'it_CH', es: 'es_ES', pt: 'pt_PT' }[lang];
      renderedHtml = renderedHtml.replace(/<html[^>]*lang="[^"]*"/i, `<html lang="${lang}"`)
        .replace(/<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="${meta.canonical}">`)
        .replace(/<meta property="og:locale" content="[^"]*">/i, `<meta property="og:locale" content="${locale}">`);
      // Match the essential initial content to the requested route and language.
      if (renderedHtml.includes('APP_STATIC_FALLBACK')) {
        renderedHtml = renderedHtml.replace(/<!-- APP_STATIC_FALLBACK -->[\s\S]*?<!-- \/APP_STATIC_FALLBACK -->/, `<!-- APP_STATIC_FALLBACK --><section style="background:#020617;color:white;min-height:70vh;padding:4rem 1rem;text-align:center"><h1>${escapeHtml(original.h1)}</h1><p>${escapeHtml(original.bodyText)}</p></section><!-- /APP_STATIC_FALLBACK -->`);
      }
      return renderedHtml;
}
