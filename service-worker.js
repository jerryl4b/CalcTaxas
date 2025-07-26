const CACHE_NAME = 'calc-taxas-v1';

// Detecta o caminho base automaticamente
const BASE_PATH = self.location.pathname.replace(/\/[^/]*$/, '/') ;

// Lista de arquivos a cachear
const ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'style.css',
  BASE_PATH + 'script.js',
  BASE_PATH + 'favicon.png'
];

// Instala e salva no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Responde com cache quando offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});