import { openDB } from 'idb';
import type { DBSchema } from 'idb';

const DB_NAME = 'student-activities-db';
const STORE_NAME = 'activities';
const DB_VERSION = 1;

interface ActivityDB extends DBSchema {
  [STORE_NAME]: {
    key: number;
    value: {
      text: string;
      timestamp: Date;
      key?: number;
    };
  };
}

export async function initDB() {
  const db = await openDB<ActivityDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'key', 
          autoIncrement: true,
        });
      }
    },
  });
  return db;
}