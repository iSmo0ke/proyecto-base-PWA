// src/components/ActivityForm.tsx
import { useState } from 'react';
import { initDB } from '../db';

function ActivityForm() {
  const [activity, setActivity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    try {
      const db = await initDB();

      await db.add('activities', {
        text: activity,
        timestamp: new Date(),
      });

      console.log('Actividad guardada en IndexedDB!');
      setActivity(''); 
      
      window.location.reload(); 
    } catch (error) {
      console.error('Error al guardar en IndexedDB:', error);
    }
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