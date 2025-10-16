// src/syncUtils.ts
import { initDB } from './db';

export async function syncPendingActivities() {
  try {
    const db = await initDB();
    const pendingActivities = await db.getAll('activities');

    if (pendingActivities.length === 0) {
      console.log('👍 No hay actividades pendientes.');
      return { success: true, message: 'No hay actividades pendientes' };
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
        await db.delete('activities', key!);
      } else {
        console.warn(`⚠️ Error al sincronizar "${activity.text}": ${response.statusText}`);
      }
    }

    console.log('✨ Sincronización completada.');
    return { success: true };

  } catch (error) {
    console.error('❌ Falló la sincronización manual:', error);
    return { success: false, error };
  }
}
