import { useState, useEffect } from 'react';
import { initDB } from '../db';

interface Activity {
  key?: number;
  text: string;
  timestamp: Date;
}

function ActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const db = await initDB();
        const allActivities = await db.getAll('activities');
        setActivities(allActivities);
      } catch (error) {
        console.error('Error al leer de IndexedDB:', error);
      }
    }

    fetchActivities();
  }, []);

  return (
    <div>
      <h3>Actividades Guardadas Localmente</h3>
      {activities.length === 0 ? (
        <p>No hay actividades guardadas.</p>
      ) : (
        <ul>
          {activities.map((act) => (
            <li key={act.key}>
              {act.text} - 
              <small> {new Date(act.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityList;