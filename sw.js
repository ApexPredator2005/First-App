const CACHE_NAME = 'resqnow-v24';
const APP_SHELL = [
  './',
  'index.html',
  'index.css',
  'app.js'
];

// Install event - Cache app shell files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell assets');
        return cache.addAll(APP_SHELL);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('[ServiceWorker] Clearing old cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Message listener for 'CACHE_MAPS'
self.addEventListener('message', (event) => {
  if (event.data && (event.data === 'CACHE_MAPS' || event.data.type === 'CACHE_MAPS')) {
    console.log('[ServiceWorker] CACHE_MAPS message received.');
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'OFFLINE_MODE',
          status: 'offline',
          message: 'App is now in offline mode'
        });
      });
    });
  }
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Check for Map tile requests
  const isMapTileRequest = url.hostname.includes('maps.googleapis.com') ||
                           url.pathname.includes('/tile') ||
                           url.hostname.includes('tile');

  if (isMapTileRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(
              `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="#0d111a"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#00f2fe" font-family="sans-serif" font-size="14">Offline Map Tile</text>
              </svg>`,
              {
                status: 200,
                headers: { 'Content-Type': 'image/svg+xml' }
              }
            );
          });
        })
    );
    return;
  }

  // Network-First strategy for all app assets & API calls (Ensures normal refresh gets updated CSS/JS!)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});
