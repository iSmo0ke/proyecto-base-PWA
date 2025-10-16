// src/sw.ts

/// <reference lib="WebWorker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { initDB } from './db';

declare const self: ServiceWorkerGlobalScope;

// --- 1. CACHEO DE LA APP ---
// Workbox se encarga de cachear todos los archivos de tu app.
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// --- 2. LÓGICA DE SINCRONIZACIÓN ---
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-new-activities') {
    event.waitUntil(syncActivities());
  }
});

async function syncActivities() {
  const db = await initDB();
  const allActivities = await db.getAll('activities');

  if (allActivities.length === 0) {
    return; // No hay nada que sincronizar
  }

  for (const activity of allActivities) {
    const { key, ...activityToSend } = activity;

    try {
      // 🚨 ¡AQUÍ VA LA URL DE TU BACKEND EN RENDER! 🚨
      const response = await fetch('https://pwa-back-8rp5.onrender.com/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityToSend),
      });

      if (response.ok) {
        // Si el servidor lo guardó bien, lo borramos de la base de datos local.
        await db.delete('activities', key!);
      } else {
        // Si falla, paramos para no perder datos. El SW lo reintentará más tarde.
        throw new Error('El servidor rechazó la petición.');
      }
    } catch (error) {
      console.error('Fallo al sincronizar una actividad. Se reintentará más tarde.', error);
      // Detenemos el bucle para no intentar enviar el resto si la red falla.
      return; 
    }
  }
}