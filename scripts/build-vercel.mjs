import { cpSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export function vercelBuildEnvironment(environment) {
  if (environment.VERCEL_ENV === 'production') return { ...environment };
  // VITE_* are embedded at build time; a remote Preview must not select real services.
  return {
    ...environment,
    VITE_FIREBASE_MODE: 'emulator',
    VITE_ENABLE_EXTERNAL_SUBMISSIONS: 'false',
    VITE_ENABLE_DEMO_DATA: 'false',
    VITE_API_URL: '',
    VITE_EMAILJS_SERVICE_ID: '',
    VITE_EMAILJS_TEMPLATE_ID: '',
    VITE_EMAILJS_PUBLIC_KEY: '',
    VITE_MAKE_LEAD_WEBHOOK_URL: '',
    VITE_MAKE_EMAIL_WEBHOOK_URL: '',
  };
}

export function publishVercelAssets(root) {
  const assets = path.join(root, 'dist/assets');
  if (!existsSync(assets) || !existsSync(path.join(root, 'dist/index.html'))) {
    throw new Error('Build the frontend before preparing Vercel assets.');
  }
  if (existsSync(path.join(root, 'public/index.html'))) {
    throw new Error('public/index.html would bypass Express SEO. Keep the template in dist.');
  }
  cpSync(assets, path.join(root, 'public/assets'), { recursive: true });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  // Remove previous generated files before Vite copies public/ into dist/.
  rmSync(path.join(root, 'public/assets'), { recursive: true, force: true });
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
    cwd: root,
    env: vercelBuildEnvironment(process.env),
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
  publishVercelAssets(root);
  console.log('Vercel assets ready: public/assets for CDN; dist/*.html retained for Express SEO.');
}
