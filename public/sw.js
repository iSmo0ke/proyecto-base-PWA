// public/sw.js
const CACHE_NAME = 'app-shell-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/vite.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Instalar y cachear App Shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cacheando App Shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estrategia: Cache First para App Shell
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retornar desde cache si existe, sino hacer fetch
        return response || fetch(event.request);
      })
  );
});

// Actualizar cache cuando cambie la versión
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});