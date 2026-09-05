import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'redirect-main-jx',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url) {
              const urlPath = req.url.split('?')[0];
              if (
                urlPath === '/main.jx' ||
                urlPath === '/main.jsx' ||
                urlPath === '/main.js' ||
                urlPath === '/main.tsx' ||
                urlPath === '/src/main.jx' ||
                urlPath === '/src/main.js' ||
                urlPath === '/src/main.tsx'
              ) {
                const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
                req.url = '/src/main.jsx' + query;
              }
            }
            next();
          });
        },
      },
      react(),
      tailwindcss(),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.jx'],
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
