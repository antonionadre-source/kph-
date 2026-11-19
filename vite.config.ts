import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(), 
        tailwindcss(),
        visualizer({
          filename: './dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
      ],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        target: 'esnext',
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (
                id.includes('i18n.ts') ||
                id.includes('docTranslations') ||
                id.includes('seoTranslations') ||
                id.includes('dashboardTranslations') ||
                id.includes('locations.ts') ||
                id.includes('municipalRegimes') ||
                id.includes('seoData') ||
                id.includes('seoConfig')
              ) {
                return 'data-app-resources';
              }
              if (id.includes('node_modules')) {
                if (
                  id.includes('react') ||
                  id.includes('react-dom') ||
                  id.includes('scheduler') ||
                  id.includes('react-is') ||
                  id.includes('use-sync-external-store')
                ) {
                  return 'vendor-react';
                }
                if (id.includes('firebase') || id.includes('@firebase')) {
                  if (id.includes('firestore')) {
                    return 'vendor-firebase-firestore';
                  }
                  if (id.includes('storage')) {
                    return 'vendor-firebase-storage';
                  }
                  return 'vendor-firebase-core';
                }
                if (id.includes('lucide-react')) {
                  return 'vendor-icons';
                }
                if (id.includes('motion')) {
                  return 'vendor-motion';
                }
                if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify') || id.includes('purify')) {
                  return 'vendor-pdf-utils';
                }
                if (id.includes('jszip')) {
                  return 'vendor-zip';
                }
              }
            },
          },
        },
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ""),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || "")
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
