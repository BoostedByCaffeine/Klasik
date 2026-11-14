const CACHE_NAME = 'klasik-vite-pwa-v4';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of PRECACHE_URLS) {
        try {
          const res = await fetch(url, { cache: 'no-cache' });
          if (res && res.ok && res.status === 200) {
            await cache.put(url, res);
          }
        } catch {
          // Ignore individual optional asset failure on subpaths
        }
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Navigation requests: serve cached shell immediately or update in background, falling back to ./index.html when offline
  if (
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').includes('text/html')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedNav) => {
        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, copy).catch(() => {});
                cache.put('./index.html', copy.clone()).catch(() => {});
              });
            }
            return networkResponse;
          })
          .catch(() =>
            cachedNav ||
            caches.match('./index.html') ||
            caches.match('./')
          );

        return cachedNav || networkFetch;
      })
    );
    return;
  }

  // Static JS/CSS/SVG/JSON assets: Cache-First with background network refresh
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.ok &&
            networkResponse.status === 200
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

