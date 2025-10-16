// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // 👈 1. Importa el plugin

export default defineConfig({
  plugins: [
    react(),
    // 👇 2. Añade la configuración del plugin
    VitePWA({
      registerType: 'autoUpdate', // Se actualiza solo sin molestar al usuario
      devOptions: {
        enabled: true // Habilítalo en desarrollo para probarlo
      },
      workbox: {
        // Esto cacheará todos los assets generados (JS, CSS, etc.)
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        // El plugin también puede generar tu manifest.json
        // Puedes mover aquí la configuración que ya tienes
        name: 'Mi App PWA de Actividades',
        short_name: 'ActividadesPWA',
        description: 'Una PWA para registrar actividades offline.',
        theme_color: '#2196f3',
        icons: [
          {
            src: 'url.png', // Asegúrate que esté en /public
            sizes: '192x192',
            type: 'image/png'
          },
          // ... otros íconos
        ]
      }
    })
  ],
});