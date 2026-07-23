/* ================================================
   SERVICE-WORKER.JS — Funcionament offline de la PWA
   ================================================
   Guarda en caché els fitxers essencials perquè l'app
   es pugui obrir encara que no hi hagi connexió.
   No cal editar res aquí llevat que afegeixis fitxers nous.
================================================ */

const CACHE_NAME = 'operacio-especial-v1';

// *** EDITA AQUÍ *** si afegeixes més fitxers (icones, etc.)
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instal·lació: guarda els fitxers a la caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activació: neteja caches antigues d'altres versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: serveix des de la caché primer, i si no hi és, va a la xarxa
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
