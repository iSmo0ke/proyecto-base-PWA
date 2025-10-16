// src/components/ActivityList.tsx

import { useState } from 'react';
import type { Activity } from '../types';
import { syncPendingActivities } from '../syncUtils';

interface ActivityListProps {
  activities: Activity[];
  onSynced?: () => void; // opcional: refrescar la lista tras sincronizar
}

function ActivityList({ activities, onSynced }: ActivityListProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await syncPendingActivities();
    setIsSyncing(false);

    if (result.success) {
      alert('✅ Sincronización completada correctamente.');
      onSynced && onSynced(); // refresca las actividades si se pasa la función
    } else {
      alert('❌ Error al sincronizar. Revisa la consola.');
    }
  };

  return (
    <div>
      <h3>Actividades Guardadas</h3>

      {/* Botón de sincronización */}
      <button
        onClick={handleSync}
        disabled={isSyncing}
        style={{
          marginBottom: '10px',
          padding: '6px 12px',
          cursor: isSyncing ? 'not-allowed' : 'pointer',
        }}
      >
        {isSyncing ? 'Sincronizando...' : '🔄 Sincronizar pendientes'}
      </button>

      {activities.length === 0 ? (
        <p>No hay actividades guardadas.</p>
      ) : (
        <ul>
          {activities.map((act) => (
            <li key={act._id || act.key}>
              {act.text} -{' '}
              <small>{new Date(act.timestamp).toLocaleString()}</small>
              {act.isPending && (
                <small style={{ marginLeft: '10px', color: '#888' }}>
                  🔄 Pendiente de sincronizar
                </small>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityList;
