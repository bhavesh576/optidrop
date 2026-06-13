
/* =========================================================
   OptiDrop Service Worker — FIXED v2
   ========================================================= */

const CACHE_NAME = 'optidrop-v2';  // ← Changed v1 to v2 (clears old broken cache)

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/tools.html',
  '/about.html',
  '/contact.html'
  // ← Removed styles.css and common.js from pre-cache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  // Never cache these files — always fetch fresh from network
  const alwaysFresh = ['/tailwind.min.css', '/styles.css', '/common.js'];
  if (alwaysFresh.some(f => url.pathname.startsWith(f.split('?')[0]))) {
    event.respondWith(fetch(request));
    return;
  }

  // HTML pages: always try network first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // All other assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
