import './mocks';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../components/App';
import { I18nProvider } from '../i18n';
import { AuthProvider } from '../components/Auth';
import { VALID_CITIES, VALID_SERVICES, isRouteValid, PATH_TO_PAGE_MAP } from '../seoConfig';
import { MUNICIPALITIES } from '../src/data/locations';

console.log('🔍 Starting comprehensive Link Audit...');

const staticPages = [
  '/',
  '/blog',
  '/blog/wohnungsabgabe-zurich-perfekte-uebergabe',
  '/blog/iot-smart-facility-management-schweizer-bueros',
  '/services',
  '/commercial',
  '/quote',
  '/about',
  '/sustainability',
  '/careers',
  '/our-story',
  '/hse',
  '/terms',
  '/gdpr',
  '/impressum',
  '/kontakt',
  '/login',
  '/register',
  '/dashboard',
  '/commercial-quote',
  '/reviews',
  '/einsatzgebiete'
];

const regionHubs = [
  '/reinigung/kanton-schaffhausen',
  '/reinigung/region-winterthur',
  '/reinigung/region-zuerich'
];

const municipalityPages = MUNICIPALITIES.map(m => `/reinigung/${m.slug}`);

// List of all combinations of VALID_CITIES and VALID_SERVICES
const servicePages: string[] = [];
VALID_CITIES.forEach(city => {
  VALID_SERVICES.forEach(service => {
    servicePages.push(`/services/${city}/${service}`);
  });
});

// Combine all possible targets to render and audit
const allRoutesToAudit = [
  ...staticPages,
  ...regionHubs,
  ...municipalityPages,
  ...servicePages
];

// Clean duplicates
const uniqueRoutes = Array.from(new Set(allRoutesToAudit));

console.log(`📋 Total routes to audit: ${uniqueRoutes.length}`);

// We will build a matrix: link -> target route -> status -> sources
const linkMap: Record<string, { target: string; isValid: boolean; sources: Set<string> }> = {};
const reachedPages = new Set<string>();

// Helper to extract internal links from rendered HTML
function extractInternalHrefs(html: string, sourcePath: string) {
  const hrefRegex = /href="([^"]+)"/g;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    let href = match[1];

    // Normalize absolute domain links to relative
    if (href.startsWith('https://krakenpfm.ch')) {
      href = href.replace('https://krakenpfm.ch', '');
    }

    // Filter out external, telephone, mailto, whatsapp, or hash links
    if (href.startsWith('/') && !href.startsWith('//')) {
      const cleanHref = href.split('?')[0].split('#')[0];
      const normalizedHref = cleanHref === '' ? '/' : cleanHref;

      // Ignore static assets
      const assetExtensions = ['.png', '.webp', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.css', '.js'];
      if (assetExtensions.some(ext => normalizedHref.toLowerCase().endsWith(ext))) {
        continue;
      }

      if (!linkMap[normalizedHref]) {
        linkMap[normalizedHref] = {
          target: normalizedHref,
          isValid: isRouteValid(normalizedHref),
          sources: new Set()
        };
      }
      linkMap[normalizedHref].sources.add(sourcePath);
      reachedPages.add(normalizedHref);
    }
  }
}

// Render each route and extract its links
let renderSuccessCount = 0;
let renderFailureCount = 0;

uniqueRoutes.forEach(pagePath => {
  try {
    // Set global mock window pathname
    (globalThis as any).window.location.pathname = pagePath;

    // Render the React app to HTML
    const renderedHtml = ReactDOMServer.renderToString(
      React.createElement(React.StrictMode, null,
        React.createElement(I18nProvider, null,
          React.createElement(AuthProvider, null,
            React.createElement(App, null)
          )
        )
      )
    );

    extractInternalHrefs(renderedHtml, pagePath);
    renderSuccessCount++;
  } catch (err: any) {
    console.error(`⚠️ Failed to render "${pagePath}": ${err.message || err}`);
    renderFailureCount++;
  }
});

console.log(`Finished rendering. Success: ${renderSuccessCount}, Failed: ${renderFailureCount}`);

// Analyze for Orphans (pages in our uniqueRoutes list that are valid but have no inbound links from other pages)
// Exclude root "/" since it's the entrypoint.
const orphanPages: string[] = [];
uniqueRoutes.forEach(route => {
  if (route === '/') return;
  
  const record = linkMap[route];
  if (!record || record.sources.size === 0) {
    orphanPages.push(route);
  }
});

// Categorize links
const okLinks: typeof linkMap[string][] = [];
const missingLinks: typeof linkMap[string][] = [];

Object.values(linkMap).forEach(record => {
  if (record.isValid) {
    okLinks.push(record);
  } else {
    missingLinks.push(record);
  }
});

// Generate Markdown report
let mdReport = `# Kraken PFM - Comprehensive Internal Link Audit

Generated on: ${new Date().toISOString()}
Total Pages Rendered for Audit: **${uniqueRoutes.length}**
Total Unique Internal Links Found: **${Object.keys(linkMap).length}**

## Summary
- **Valid Internal Links (OK)**: ${okLinks.length}
- **Broken Internal Links (404/MISSING)**: ${missingLinks.length}
- **Orphan Pages (Valid, but no inbound links)**: ${orphanPages.length}

---

## ❌ Broken / Missing Links (404 Error Targets)
These links are generated in the app but are NOT recognized as valid routes by the router.

| Target Route (Broken) | Found On Pages (Sources) |
| :--- | :--- |
`;

if (missingLinks.length === 0) {
  mdReport += `| *None* | *No missing or broken links found!* |\n`;
} else {
  missingLinks.forEach(item => {
    const sourcesStr = Array.from(item.sources).slice(0, 5).join(', ') + (item.sources.size > 5 ? ` (+${item.sources.size - 5} more)` : '');
    mdReport += `| \`${item.target}\` | ${sourcesStr} |\n`;
  });
}

mdReport += `
---

## ⚠️ Orphan Pages (No Inbound Links)
These are valid routes defined in the router, but they have no other pages pointing to them.

| Orphan Route |
| :--- |
`;

if (orphanPages.length === 0) {
  mdReport += `| *None* | *No orphan pages found!* |\n`;
} else {
  orphanPages.forEach(route => {
    mdReport += `| \`${route}\` |\n`;
  });
}

mdReport += `
---

## ✅ Valid Links (OK)
The following internal links are valid and fully routeable.

| Target Route | Inbound Links Count | Sample Source Pages |
| :--- | :--- | :--- |
`;

okLinks.sort((a, b) => b.sources.size - a.sources.size).forEach(item => {
  const sourcesStr = Array.from(item.sources).slice(0, 3).join(', ') + (item.sources.size > 3 ? ` (+${item.sources.size - 3} more)` : '');
  mdReport += `| \`${item.target}\` | ${item.sources.size} | ${sourcesStr} |\n`;
});

fs.writeFileSync(path.join(process.cwd(), 'LINK_AUDIT.md'), mdReport, 'utf-8');
console.log('🎉 Link audit complete! Output saved to LINK_AUDIT.md');
