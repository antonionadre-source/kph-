import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
    return {
      // Isolated checkouts may share node_modules; optimizer state must not.
      cacheDir: path.join(__dirname, '.cache/vite'),
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
              if (id.includes('vite/preload-helper') || id.includes('commonjsHelpers')) return 'vendor-runtime';
              if (/\/node_modules\/(react|react-dom|scheduler|react-is|use-sync-external-store)\//.test(id)) return 'vendor-react';
              // Route-local libraries and dictionaries use Rollup's dependency graph.
              // In particular, PDF utilities must never own an entry preload helper.
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
