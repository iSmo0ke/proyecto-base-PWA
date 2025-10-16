/// <reference types="vite/client" />

// 1. Le decimos a TypeScript qué es un SyncManager
interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

// 2. Le decimos a TypeScript qué es un SyncEvent
interface SyncEvent extends ExtendableEvent {
  readonly lastChance: boolean;
  readonly tag: string;
}

// 3. Le enseñamos al ServiceWorkerRegistration que tiene una propiedad 'sync'
interface ServiceWorkerRegistration {
  readonly sync: SyncManager;
}

// 4. 👇 LA PIEZA QUE FALTABA: Conectamos el evento 'sync' con su tipo
// Le decimos a TypeScript que el evento 'sync' es un evento válido en un Service Worker.
interface ServiceWorkerGlobalScopeEventMap {
  sync: SyncEvent;
}