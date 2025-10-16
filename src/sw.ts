// src/sw.ts

/// <reference lib="WebWorker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { initDB } from './db';

declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-new-activities') {
    console.log('📡 Service Worker: Evento "sync" recibido.');
    event.waitUntil(syncPendingActivities());
  }
});

async function syncPendingActivities() {
  try {
    const db = await initDB();
    const pendingActivities = await db.getAll('activities');

    if (pendingActivities.length === 0) {
      console.log('👍 No hay actividades pendientes.');
      return;
    }

    console.log(`⏳ Sincronizando ${pendingActivities.length} actividades...`);

    for (const activity of pendingActivities) {
      const { key, isPending, ...activityToSend } = activity;

      const response = await fetch('https://pwa-back-8rp5.onrender.com/activitiesPost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityToSend),
      });

      if (response.ok) {
        console.log(`✅ Actividad "${activity.text}" sincronizada.`);
        await db.delete('activities', activity.key!);
      } else {
        console.warn(`⚠️ Error al sincronizar "${activity.text}".`);
      }
    }

    console.log('✨ Sincronización completada.');
  } catch (error) {
    console.error('❌ Falló la sincronización. Se reintentará luego.', error);
  }
}
