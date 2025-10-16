// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // 👇 Estrategia para usar NUESTRO propio Service Worker
      injectManifest: {
        swSrc: 'src/sw.ts', // 👈 Le decimos dónde está nuestro archivo
        swDest: 'sw.js',   // 👈 Le decimos cómo se llamará el archivo final en 'dist'
      },
      devOptions: {
        enabled: true, // Para poder probarlo en desarrollo
      },
      manifest: {
        name: 'Mi App PWA de Actividades',
        short_name: 'ActividadesPWA',
        description: 'Una PWA para registrar actividades offline.',
        theme_color: '#2196f3',
        icons: [
          {
            src: 'url.png',
            sizes: '192x192',
            type: 'image/png'
          },
        ]
      }
    })
  ],
});