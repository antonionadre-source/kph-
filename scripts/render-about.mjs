import { build } from 'esbuild';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Pre-render approved content: no-JS chapters/disclosures remain readable. */
export async function renderAboutHtml(root) {
  const manifest = JSON.parse(readFileSync(path.join(root, 'dist/.vite/manifest.json'), 'utf8'));
  const about = manifest['components/about/ApprovedAbout.tsx'];
  const home = manifest['components/home/ApprovedHome.tsx'] || manifest['index.html'];
  if (!about?.css?.length || !home?.css?.length) throw new Error('About/Home stylesheets are missing from the Vite manifest.');
  const cache = path.join(root, 'node_modules/.cache');
  mkdirSync(cache, { recursive: true });
  const temporary = mkdtempSync(path.join(cache, 'kraken-about-'));
  const outfile = path.join(temporary, 'render.cjs');
  try {
    await build({
      stdin: { contents: `import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {AboutContent} from './components/about/ApprovedAbout.tsx';import WhyKrakenSection from './components/home/WhyKrakenSection.tsx';import {whyTranslations} from './components/home/whyTranslations.ts';import {homeText} from './components/home/homeTranslations.ts';export const renderAbout=language=>renderToStaticMarkup(React.createElement(AboutContent,{language}));export const renderWhy=language=>renderToStaticMarkup(React.createElement(WhyKrakenSection,{t:source=>whyTranslations[language]?.[source]??homeText(language,source)}));`, resolveDir: root, loader: 'tsx' },
      outfile, bundle:true, platform:'node', format:'cjs', packages:'external', loader:{'.css':'empty'}, logLevel:'warning',
    });
    const {renderAbout,renderWhy} = createRequire(import.meta.url)(outfile);
    const styles = entry => entry.css.map(file=>`<link rel="stylesheet" href="/${file}">`).join('');
    for (const language of ['de','en','es','pt','it','fr']) {
      const body=renderAbout(language);
      if ((body.match(/<h1\b/g)||[]).length!==1 || !body.includes('id="kai-help"') || !body.includes('id="story-switzerland"')) throw new Error('Incomplete About HTML.');
      writeFileSync(path.join(root,`dist/about-content-${language}.html`),`${styles(about)}<div class="kraken-home kraken-about about-page" lang="${language==='de'?'de-CH':language}">${body}</div>`);
      const why=renderWhy(language);
      if (!why.includes('id="warum-kraken"') || (why.match(/<details\b/g)||[]).length!==3) throw new Error('Incomplete Warum Kraken HTML.');
      writeFileSync(path.join(root,`dist/why-content-${language}.html`),`${styles(home)}<div class="kraken-home" lang="${language==='de'?'de-CH':language}">${why}</div>`);
    }
  } finally {rmSync(temporary,{recursive:true,force:true});}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) await renderAboutHtml(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
