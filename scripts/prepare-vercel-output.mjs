import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const digest = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const forbidden = name => name.split('/').some(segment => segment.startsWith('.'))
  || /\.(?:zip|map|cjs|log|pem|key|md)$/i.test(name)
  || /(?:^|\/)(?:server\.(?:js|mjs)|stats\.html|index\.html)$/i.test(name);

function filesWithin(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) return filesWithin(path.join(directory, entry.name), relative + '/');
    if (!entry.isFile()) throw new Error(`Unexpected non-regular public file: ${relative}`);
    return [relative];
  });
}

function validateRuntime(root) {
  const output = path.join(root, '.vercel/output');
  const configuration = JSON.parse(readFileSync(path.join(output, 'config.json'), 'utf8'));
  if (configuration.version !== 3) throw new Error('Expected Vercel Build Output API version 3. Run vercel build --prod first.');
  const directory = path.join(output, 'functions/index.func');
  const functionConfig = JSON.parse(readFileSync(path.join(directory, '.vc-config.json'), 'utf8'));
  if (!functionConfig.runtime?.startsWith('nodejs') || functionConfig.framework?.slug !== 'express') {
    throw new Error('Expected the existing Express Node.js function.');
  }
  if (!functionConfig.handler || !existsSync(path.join(directory, functionConfig.handler))) throw new Error('Missing Express function handler.');
  for (const name of filesWithin(directory).filter(name => /\.(?:js|mjs|cjs)$/.test(name) && !name.startsWith('node_modules/'))) {
    if (/(?:from\s*|import\(\s*)["']\.\.?\/[^"']+\.(?:ts|tsx|mts|cts)["']/.test(readFileSync(path.join(directory, name), 'utf8'))) {
      throw new Error(`Compiled function still imports TypeScript: ${name}. Rebuild with rewriteRelativeImportExtensions enabled.`);
    }
  }
  const filesystem = configuration.routes?.findIndex(route => route.handle === 'filesystem') ?? -1;
  const appRoute = configuration.routes?.findIndex(route => !route.status && !route.continue && ['/', '/index', '/index.js'].includes(route.dest)) ?? -1;
  if (filesystem < 0 || appRoute < 0 || filesystem >= appRoute) throw new Error('CDN filesystem routing must precede the Express catch-all.');
  const html = path.join(root, 'dist/index.html');
  if (!existsSync(html)) throw new Error('Missing built frontend template.');
  const mappedTemplate = functionConfig.filePathMap?.['dist/index.html'];
  if (!mappedTemplate && !existsSync(path.join(directory, 'dist/index.html'))) throw new Error('Function does not include dist/index.html.');
  if (mappedTemplate && !existsSync(path.resolve(root, mappedTemplate))) throw new Error('Missing mapped function HTML template.');
  return { output, html, functionConfig, directory };
}

export function prepareVercelOutput(root, { trackedPublicFiles, verifyOnly = false } = {}) {
  root = path.resolve(root);
  const { output, html, functionConfig, directory } = validateRuntime(root);
  // Only Git-tracked public originals and freshly built Vite bundles may be
  // published. Untracked archives, credentials and diagnostics are excluded.
  const tracked = trackedPublicFiles ?? execFileSync('git', ['ls-files', '-z', '--', 'public'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const files = new Map();
  for (const source of tracked) {
    if (!source.startsWith('public/') || source.split('/').includes('..')) throw new Error(`Invalid tracked public path: ${source}`);
    const relative = source.slice('public/'.length);
    if (forbidden(relative) || relative.startsWith('assets/')) continue;
    const filename = path.join(root, source);
    if (!lstatSync(filename).isFile()) throw new Error(`Public source must be a regular file: ${source}`);
    files.set(relative, filename);
  }
  const generated = path.join(root, 'public/assets');
  if (!existsSync(generated)) throw new Error('Missing generated public/assets. Run npm run build:vercel first.');
  for (const relative of filesWithin(generated)) {
    if (forbidden(relative)) continue;
    const source = path.join(generated, relative);
    const built = path.join(root, 'dist/assets', relative);
    if (!existsSync(built) || digest(source) !== digest(built)) throw new Error(`Generated frontend is not the current Vite build: ${relative}`);
    files.set('assets/' + relative, source);
  }
  const homeFiles = [...files.keys()].filter(name => name.startsWith('home-approved/assets/'));
  if (homeFiles.length !== 14 || !homeFiles.includes('home-approved/assets/hero-room-day-v4.webp')) {
    throw new Error('Expected all 14 approved home assets, including the day scene.');
  }
  const references = [...new Set([...readFileSync(html, 'utf8').matchAll(/(?:src|href)=["'](\/assets\/[^"']+)["']/g)].map(match => decodeURIComponent(match[1].split(/[?#]/)[0]).slice(1)))];
  if (!references.length) throw new Error('The built HTML has no frontend bundle references.');
  for (const reference of references) if (!files.has(reference)) throw new Error(`Built HTML references an unpublished frontend file: ${reference}`);

  const staticDirectory = path.join(output, 'static');
  if (!verifyOnly) {
    // Some builder versions flatten includeFiles locally while recording an
    // identity filePathMap. Materialize the actual paths used by Express too.
    mkdirSync(path.join(directory, 'dist'), { recursive: true });
    for (const name of readdirSync(path.join(root, 'dist')).filter(name => name.endsWith('.html') && name !== 'stats.html')) {
      cpSync(path.join(root, 'dist', name), path.join(directory, 'dist', name));
    }
    rmSync(staticDirectory, { recursive: true, force: true });
    mkdirSync(staticDirectory, { recursive: true });
    for (const [relative, source] of files) {
      const destination = path.join(staticDirectory, relative);
      mkdirSync(path.dirname(destination), { recursive: true });
      cpSync(source, destination);
    }
  }
  if (!existsSync(staticDirectory)) throw new Error('Missing static output.');
  for (const [relative, source] of files) {
    const destination = path.join(staticDirectory, relative);
    if (!existsSync(destination) || !statSync(destination).isFile() || digest(destination) !== digest(source)) {
      throw new Error(`Missing or changed CDN file: /${relative}`);
    }
  }
  for (const relative of filesWithin(staticDirectory)) if (!files.has(relative)) throw new Error(`Unexpected static output: ${relative}`);
  const runtimeHtml = path.join(directory, 'dist/index.html');
  if (!existsSync(runtimeHtml) || digest(runtimeHtml) !== digest(html)) throw new Error('Missing or changed function dist/index.html.');
  return {
    version: 3,
    function: 'index.func',
    runtime: functionConfig.runtime,
    staticFiles: files.size,
    homeAssets: homeFiles.length,
    htmlBundleReferences: references.length,
    generatedBundles: [...files.keys()].filter(name => name.startsWith('assets/')).length,
    sha256Verified: files.size,
    missing: 0
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  console.log(JSON.stringify(prepareVercelOutput(root, { verifyOnly: process.argv.includes('--verify') }), null, 2));
}
