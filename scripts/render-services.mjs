import { build } from 'esbuild';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Supply the same React service copy in the initial HTML, including without JS. */
export async function renderServicesHtml(root) {
  const manifest = JSON.parse(readFileSync(path.join(root, 'dist/.vite/manifest.json'), 'utf8'));
  const entry = manifest['components/services/ApprovedServices.tsx'];
  if (!entry?.css?.length) throw new Error('Services stylesheet is missing from the Vite manifest.');
  const cache = path.join(root, 'node_modules/.cache');
  mkdirSync(cache, { recursive: true });
  const temporary = mkdtempSync(path.join(cache, 'kraken-services-'));
  const outfile = path.join(temporary, 'render.cjs');
  try {
    await build({
      stdin: { contents: `import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import {ServicesContent} from './components/services/ApprovedServices.tsx'; export const render = language => renderToStaticMarkup(React.createElement(ServicesContent,{language}));`, resolveDir: root, loader: 'tsx' },
      outfile, bundle: true, platform: 'node', format: 'cjs', packages: 'external', loader: { '.css': 'empty' }, logLevel: 'warning',
    });
    const { render } = createRequire(import.meta.url)(outfile);
    const styles = entry.css.map(file => `<link rel="stylesheet" href="/${file}">`).join('');
    for (const language of ['de', 'en', 'es', 'pt', 'it', 'fr']) {
      const body = render(language);
      if ((body.match(/<h1\b/g) || []).length !== 1 || !body.includes('data-service-detail="moving"')) throw new Error('Incomplete services HTML.');
      writeFileSync(path.join(root, `dist/services-content-${language}.html`), `${styles}<div class="kraken-home kraken-services services-page" lang="${language === 'de' ? 'de-CH' : language}">${body}</div>`);
    }
  } finally { rmSync(temporary, { recursive: true, force: true }); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await renderServicesHtml(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
}
