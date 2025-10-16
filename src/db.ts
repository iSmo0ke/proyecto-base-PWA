// src/db.ts

import { openDB, type DBSchema } from 'idb';
import type { Activity } from './types'; // Importamos la definición de Activity

// --- ¡AQUÍ ESTÁ LA CLAVE! ---
// 1. Creamos una interfaz que describe la estructura de nuestra base de datos.
interface PWADBSchema extends DBSchema {
  // Definimos un almacén de objetos llamado 'activities'
  activities: {
    key: number;       // La clave principal es de tipo 'number' (auto-incrementada)
    value: Activity;   // Los objetos guardados son de tipo 'Activity'
  };
}

const DB_NAME = 'pwa-db';
const DB_VERSION = 1;

// 2. Le pasamos nuestro esquema a la función openDB.
// Ahora, la variable 'db' será 100% consciente de los tipos.
export const initDB = () => {
  return openDB<PWADBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // El método createObjectStore también es consciente de los tipos.
      // Sabe que en 'activities', la 'keyPath' debe ser 'key'.
      db.createObjectStore('activities', {
        keyPath: 'key',
        autoIncrement: true,
      });
    },
  });
};