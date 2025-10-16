// src/components/ActivityForm.tsx
import { useState } from 'react';
import { initDB } from '../db';
import { useOnlineStatus } from '../hooks/useOnlineStatus'; // Hook para saber si hay conexión

// 1. Definimos las props que el componente recibirá.
// Necesita una función para avisar al padre cuando se añade una nueva actividad.
interface ActivityFormProps {
  onActivityAdded: () => void;
}

function ActivityForm({ onActivityAdded }: ActivityFormProps) {
  const [activity, setActivity] = useState('');
  const isOnline = useOnlineStatus(); // Obtenemos el estado de la conexión

  // Función auxiliar para registrar la sincronización en segundo plano
  const registerBackgroundSync = async () => {
    // Comprobamos que el navegador soporte Service Worker y Background Sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const swRegistration = await navigator.serviceWorker.ready;
        // Registramos una tarea con la etiqueta 'sync-new-activities'
        await swRegistration.sync.register('sync-new-activities');
        console.log('🔄 Sincronización en segundo plano registrada.');
      } catch (error) {
        console.error('Falló el registro de la sincronización en segundo plano:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1. El formulario se ha enviado.");
    if (!activity.trim()) {
      console.log("La actividad está vacía, no se guarda nada."); // 👈 AÑADE ESTO
      return;
    }

    const newActivity = {
      text: activity,
      timestamp: new Date(),
    };

    console.log("2. Actividad creada:", newActivity); // 👈 AÑADE ESTO
    console.log(`3. El estado de la conexión es: ${isOnline ? 'Online' : 'Offline'}`); // 👈 AÑADE ESTO

    if (isOnline) {
      console.log("4. Intentando enviar al servidor..."); // 👈 AÑADE ESTO
      // --- Caso 1: Hay Conexión a Internet ---
      try {
        // Intentamos enviar directamente al backend en Render
        // 🚨 REEMPLAZA ESTA URL CON LA DE TU BACKEND 🚨
        await fetch('https://pwa-back-8rp5.onrender.com/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newActivity),
        });
        console.log('✅ Actividad enviada directamente al servidor.');
      } catch (error) {
        console.error('❌ ¡ERROR ATRAPADO! Fallo al enviar al servidor. Guardando localmente...', error);
        // Si el fetch falla (ej. el backend está caído), actuamos como si estuviéramos offline
        const db = await initDB();
        await db.add('activities', newActivity);
        await registerBackgroundSync();
      }
    } else {
      console.log("4. Intentando guardar en IndexedDB...");
      // --- Caso 2: No Hay Conexión a Internet ---
      try {
        // Guardamos la actividad en la base de datos local (IndexedDB)
        const db = await initDB();
        await db.add('activities', newActivity);
        // Le decimos al Service Worker que hay trabajo pendiente para cuando vuelva la conexión
        await registerBackgroundSync();
        console.log('🚫 Sin conexión. Actividad guardada localmente.');
      } catch (error) {
        console.error('❌ ¡ERROR ATRAPADO! Fallo al guardar en IndexedDB:', error);
      }
    }

    // Limpiamos el input y avisamos al componente padre para que refresque la lista
    setActivity('');
    console.log("5. Limpiando el input y llamando a onActivityAdded.");
    onActivityAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Reportar Actividad</h3>
      <input
        type="text"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        placeholder="Describe tu actividad..."
      />
      <button type="submit">Guardar Actividad</button>
    </form>
  );
}

export default ActivityForm;