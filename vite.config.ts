// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      
      // La estrategia y la configuración de tu SW están bien
      injectManifest: {
        swSrc: 'src/sw.ts',
        swDest: 'sw.js',
      },

      // 👇 ¡ESTA ES LA LÍNEA QUE FALTABA! 👇
      // Habilita el Service Worker en el entorno de desarrollo.
      devOptions: {
        enabled: true
      },

      manifest: {
        name: 'Mi App PWA de Actividades',
        short_name: 'ActividadesPWA',
        description: 'Una PWA para registrar actividades offline.',
        theme_color: '#2196f3',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: 'url.png', // Asegúrate que este archivo esté en tu carpeta 'public'
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'url-512.png', // Y este también
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
});