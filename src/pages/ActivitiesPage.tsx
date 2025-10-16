// src/pages/ActivitiesPage.tsx
import { useState, useEffect } from 'react';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ativityList'; // Asegúrate que el nombre del archivo sea correcto
import { initDB } from '../db';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

// Esta es la interfaz unificada que usaremos
export interface Activity {
  _id?: string; // ID que viene del servidor
  key?: number; // ID que viene de IndexedDB
  text: string;
  timestamp: Date;
  isPending?: boolean; // Para marcar si está pendiente de sincronizar
}

function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const isOnline = useOnlineStatus();

  // Esta función es el corazón de la página: busca datos en ambos lugares
  const fetchActivities = async () => {
    try {
      // 1. Obtiene datos locales de IndexedDB
      const db = await initDB();
      const localActivities = await db.getAll('activities');

      let serverActivities: Activity[] = [];
      // 2. Si hay conexión, obtiene datos del servidor
      if (isOnline) {
        // 🚨 RECUERDA USAR LA URL DE TU BACKEND EN RENDER 🚨
        const response = await fetch('https://pwa-back-8rp5.onrender.com/activities');
        if (response.ok) {
          serverActivities = await response.json();
        }
      }

      // 3. Combina las listas, dando prioridad a los datos del servidor para evitar duplicados
      const activityMap = new Map<string, Activity>();
      serverActivities.forEach(act => activityMap.set(act._id!, act));
      localActivities.forEach(act => {
        // Solo añade la actividad local si no ha sido sincronizada todavía
        if (!serverActivities.some(serverAct => serverAct.text === act.text && new Date(serverAct.timestamp).getTime() === new Date(act.timestamp).getTime())) {
          activityMap.set(String(act.key!), { ...act, isPending: true });
        }
      });
      
      const combinedActivities = Array.from(activityMap.values());
      
      // 4. Ordena por fecha para que las más nuevas aparezcan primero
      combinedActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(combinedActivities);

    } catch (error) {
      console.error('Error al obtener actividades:', error);
      // Si el servidor falla, al menos muestra los datos locales
      const db = await initDB();
      const localActivities = await db.getAll('activities');
      setActivities(localActivities.map(act => ({ ...act, isPending: true })));
    }
  };

  // Se ejecuta al cargar la página y cuando cambia el estado de la conexión
  useEffect(() => {
    fetchActivities();
  }, [isOnline]);

  return (
    <div>
      {/* El formulario ahora llamará a fetchActivities para refrescar la lista */}
      <ActivityForm onActivityAdded={fetchActivities} />
      <hr />
      {/* La lista solo recibe las actividades y las muestra */}
      <ActivityList activities={activities} />
    </div>
  );
}

export default ActivitiesPage;