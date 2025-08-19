const APP_VERSION = 'v1.0.5-auto-update';
const CACHE_NAME = `calc-taxas-${APP_VERSION}`;
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/script.js',
  '/bootstrap.bundle.min.js',
  '/bootstrap.min.css',
  '/manifest.json',
  '/service-worker.js',
  '/icons/icon-48x48.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-144x144.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalação - Cache dos recursos iniciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Ativação - Limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('calc-taxas-') && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia: Cache First com atualização em background
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-GET e de outros domínios
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Sempre tenta buscar na rede primeiro para atualizar o cache
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Atualiza o cache se a resposta for válida
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse); // Fallback para cache se offline

      // Retorna do cache imediatamente enquanto atualiza em background
      return cachedResponse || fetchPromise;
    })
  );
});

// Atualização automática quando nova versão é detectada
self.addEventListener('message', (event) => {
  if (event.data.action === 'checkForUpdate') {
    // Força atualização imediata
    self.skipWaiting();
    self.clients.claim();
    
    // Recarrega todas as abas abertas
    event.waitUntil(
      self.clients.matchAll({type: 'window'}).then(clients => {
        clients.forEach(client => client.navigate(client.url));
      })
      )
  }
});