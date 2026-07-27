import './mocks';
import fs from 'fs';
import path from 'path';

// ==========================================
// 2. Import React, Server Renderer and Components
// ==========================================
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../components/App';
import { I18nProvider } from '../i18n';
import { AuthProvider } from '../components/Auth';
import { getMetadataForPath, VALID_CITIES, VALID_SERVICES } from '../seoConfig';
import { MUNICIPALITIES } from '../src/data/locations';

function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function injectMetaAndContent(html: string, pagePath: string, content: string): string {
  const meta = getMetadataForPath(pagePath, 'de');
  let modified = html;

  // Replace <title>
  modified = modified.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}<\/title>`);

  // Replace <meta name="title" content="..." />
  if (modified.includes('name="title"')) {
    modified = modified.replace(/<meta name="title" content=".*?"\s*\/?>/, `<meta name="title" content="${escapeHtml(meta.title)}" />`);
  } else {
    modified = modified.replace('</head>', `    <meta name="title" content="${escapeHtml(meta.title)}" />\n  </head>`);
  }

  // Replace <meta name="description" content="..." />
  modified = modified.replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`);

  // Replace <meta property="og:title" content="..." />
  modified = modified.replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);

  // Replace <meta property="og:description" content="..." />
  modified = modified.replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);

  // Replace <meta property="og:url" content="..." />
  modified = modified.replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`);

  // Replace <meta name="twitter:title" content="..." />
  modified = modified.replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`);

  // Replace <meta name="twitter:description" content="..." />
  modified = modified.replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`);

  // Replace <link rel="canonical" href="..." />
  modified = modified.replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`);

  // Replace <div id="root"></div>
  modified = modified.replace(/<div id="root"><\/div>/, `<div id="root">${content}<\/div>`);

  return modified;
}

// ==========================================
// 3. Main Pre-rendering Pipeline
// ==========================================
async function prerender() {
  console.log('🚀 Starting Pre-rendering process...');

  const rootPath = process.cwd();
  const sitemapPath = path.join(rootPath, 'public', 'sitemap.xml');
  const templatePath = path.join(rootPath, 'dist', 'index.html');

  // Programmatically generate sitemap.xml
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  const staticPages = [
    '',
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
    '/einsatzgebiete'
  ];

  staticPages.forEach(p => {
    const priority = p === '' ? '1.0' : p === '/services' || p === '/commercial' ? '0.9' : '0.7';
    const freq = p === '' || p === '/blog' ? 'weekly' : 'monthly';
    sitemapXml += `  <url>\n    <loc>https://krakenpfm.ch${p}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  });

  // Level 1 Region Hubs
  const regionHubs = [
    '/reinigung/kanton-schaffhausen',
    '/reinigung/region-winterthur',
    '/reinigung/region-zuerich'
  ];
  regionHubs.forEach(p => {
    sitemapXml += `  <url>\n    <loc>https://krakenpfm.ch${p}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  // Level 2 Municipalities (indexable only)
  const indexableMunicipalities = MUNICIPALITIES.filter(m => m.indexable);
  indexableMunicipalities.forEach(mun => {
    sitemapXml += `  <url>\n    <loc>https://krakenpfm.ch/reinigung/${mun.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // Level 3 Services
  VALID_CITIES.forEach(city => {
    VALID_SERVICES.forEach(service => {
      sitemapXml += `  <url>\n    <loc>https://krakenpfm.ch/services/${city}/${service}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });
  });

  sitemapXml += `</urlset>\n`;

  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
  const totalUrls = staticPages.length + regionHubs.length + indexableMunicipalities.length + (VALID_CITIES.length * VALID_SERVICES.length);
  console.log(`✅ Dynamically generated sitemap.xml with ${totalUrls} URLs.`);

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ dist/index.html template not found at: ${templatePath}. Run "vite build" first.`);
    process.exit(1);
  }

  // Parse sitemap URLs
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const matches = sitemapContent.matchAll(/<loc>(https:\/\/krakenpfm\.ch[^<]*)<\/loc>/g);
  const paths: string[] = [];

  for (const match of matches) {
    try {
      const url = new URL(match[1]);
      paths.push(url.pathname);
    } catch (e) {
      console.error(`⚠️ Failed to parse URL: ${match[1]}`);
    }
  }

  // Ensure unique paths
  const uniquePaths = Array.from(new Set(paths));
  
  // Filter paths to pre-render to keep the build light and prevent Out Of Memory in Cloud Build.
  // Skip the deep service-city combination pages as they are fully served dynamically with 100% accurate SEO by server.ts.
  const pathsToPrerender = uniquePaths.filter(p => {
    const parts = p.split('/').filter(Boolean);
    if (parts[0] === 'services' && parts.length > 1) {
      return false;
    }
    return true;
  });
  console.log(`🔍 Found ${uniquePaths.length} total sitemap routes. Selected ${pathsToPrerender.length} primary routes to pre-render dynamically.`);

  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  
  // Backup template index.html to index-spa.html
  const spaFallbackPath = path.join(rootPath, 'dist', 'index-spa.html');
  fs.writeFileSync(spaFallbackPath, templateHtml, 'utf-8');
  console.log(`💾 Saved backup template to: dist/index-spa.html`);

  let successCount = 0;

  for (const pagePath of pathsToPrerender) {
    try {
      // Update global pathname state for rendering
      global.window.location.pathname = pagePath;

      // Render App to HTML string
      const renderedApp = ReactDOMServer.renderToString(
        React.createElement(React.StrictMode, null,
          React.createElement(I18nProvider, null,
            React.createElement(AuthProvider, null,
              React.createElement(App, null)
            )
          )
        )
      );

      // Inject SEO metadata and pre-rendered body content
      const finalHtml = injectMetaAndContent(templateHtml, pagePath, renderedApp);

      // Save output
      if (pagePath === '/') {
        // Overwrite dist/index.html with home page
        fs.writeFileSync(templatePath, finalHtml, 'utf-8');
        console.log(`✅ Pre-rendered: "/" -> dist/index.html`);
        
        // Output body text size for checking as requested
        const bodyTextLength = renderedApp.length;
        console.log(`📊 Body text length for home page: ${bodyTextLength} characters.`);
      } else {
        // Save to dist/[page].html, making parent directories if needed
        const relativeHtmlPath = pagePath.endsWith('/') 
          ? pagePath.substring(0, pagePath.length - 1) + '.html'
          : pagePath + '.html';
        
        const outputFilePath = path.join(rootPath, 'dist', relativeHtmlPath);
        const parentDir = path.dirname(outputFilePath);

        if (!fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true });
        }

        fs.writeFileSync(outputFilePath, finalHtml, 'utf-8');
        console.log(`✅ Pre-rendered: "${pagePath}" -> dist${relativeHtmlPath}`);
      }
      successCount++;
    } catch (e: any) {
      console.error(`❌ Failed to pre-render route "${pagePath}":`, e.message || e);
    }
  }

  console.log(`🎉 Pre-rendering complete! Successfully generated ${successCount} of ${uniquePaths.length} routes.`);
}

prerender();
