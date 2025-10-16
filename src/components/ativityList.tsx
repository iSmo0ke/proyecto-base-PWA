// src/components/ativityList.tsx

// 1. Importamos la interfaz 'Activity' desde la página que la define
import type { Activity } from '../pages/ActivitiesPage';

// 2. Definimos las props que este componente espera recibir
interface ActivityListProps {
  activities: Activity[];
}

// 3. Ya no necesitamos 'useState' ni 'useEffect' aquí
function ActivityList({ activities }: ActivityListProps) {
  return (
    <div>
      <h3>Actividades Guardadas</h3>
      {activities.length === 0 ? (
        <p>No hay actividades guardadas.</p>
      ) : (
        <ul>
          {activities.map((act) => (
            // 4. Usamos la 'key' correcta y mostramos el indicador de 'pendiente'
            <li key={act._id || act.key}>
              {act.text} -
              <small> {new Date(act.timestamp).toLocaleString()}</small>
              {act.isPending && <small style={{ marginLeft: '10px', color: '#888' }}>🔄 Pendiente de sincronizar</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityList;