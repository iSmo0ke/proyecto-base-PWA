// src/types.ts

export interface Activity {
  _id?: string;         // ID de MongoDB (opcional)
  key?: number;         // ID de IndexedDB (opcional, generado automáticamente)
  text: string;
  timestamp: Date;
  isPending?: boolean;  // Propiedad para el estado de sincronización (opcional)
}