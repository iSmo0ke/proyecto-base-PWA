// src/components/ActivityForm.tsx

import { useState } from 'react';
import { initDB } from '../db';
import type { Activity } from '../types';

interface ActivityFormProps {
  onActivityAdded: () => void;
}

function ActivityForm({ onActivityAdded }: ActivityFormProps) {
  const [activityText, setActivityText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = activityText.trim();
    if (!text) return;

    const newActivity: Omit<Activity, 'key'> = {
      text,
      timestamp: new Date(),
      isPending: true,
    };

    try {
      const db = await initDB();
      const key = await db.add('activities', newActivity);
      console.log('✅ Actividad guardada en IndexedDB.');

      // 🌐 Si hay conexión, intenta enviar inmediatamente
      if (navigator.onLine) {
        try {
          const response = await fetch('https://pwa-back-8rp5.onrender.com/activitiesPost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newActivity),
          });

          if (response.ok) {
            console.log('🌍 Actividad enviada directamente al servidor.');
            await db.delete('activities', key); // eliminar localmente
          } else {
            console.warn('⚠️ Servidor respondió con error, quedará pendiente.');
          }
        } catch (error) {
          console.warn('🚫 Error al enviar (sin conexión o servidor caído).');
        }
      }

      // 🔁 Registrar el background sync (por si sigue pendiente)
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const swRegistration = await navigator.serviceWorker.ready;
        await swRegistration.sync.register('sync-new-activities');
        console.log('🔄 Tarea de sincronización registrada.');
      }

    } catch (error) {
      console.error('❌ Error al guardar o sincronizar:', error);
    }

    setActivityText('');
    onActivityAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Reportar Actividad</h3>
      <input
        type="text"
        value={activityText}
        onChange={(e) => setActivityText(e.target.value)}
        placeholder="Describe tu actividad..."
      />
      <button type="submit">Guardar Actividad</button>
    </form>
  );
}

export default ActivityForm;
