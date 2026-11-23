import { cpSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { renderServicesHtml } from './render-services.mjs';
import { renderAboutHtml } from './render-about.mjs';

// Vercel's native Express integration serves public/ from its CDN, while the
// function reads dist/*.html for the existing route-specific SEO response.
export function publishVercelAssets(root) {
  const assets = path.join(root, 'dist/assets');
  if (!existsSync(assets) || !existsSync(path.join(root, 'dist/index.html'))) {
    throw new Error('Build the frontend before preparing Vercel assets.');
  }
  if (existsSync(path.join(root, 'public/index.html'))) {
    throw new Error('public/index.html would bypass Express SEO. Keep the template in dist.');
  }
  rmSync(path.join(root, 'dist/stats.html'), { force: true });
  rmSync(path.join(root, 'public/assets'), { recursive: true, force: true });
  cpSync(assets, path.join(root, 'public/assets'), {
    recursive: true,
    filter: source => !/\.(?:map|cjs)$/i.test(source) && path.basename(source) !== 'stats.html'
  });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  // Never feed a previous generated CDN bundle back into Vite's public copy.
  rmSync(path.join(root, 'public/assets'), { recursive: true, force: true });
  const result = spawnSync(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'build'], {
    cwd: root,
    env: process.env,
    stdio: 'inherit'
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
  await renderServicesHtml(root);
  await renderAboutHtml(root);
  publishVercelAssets(root);
  console.log('Vercel ready: frontend public/assets on CDN; dist/*.html for Express. No Node bundle, stats or source maps published.');
}
