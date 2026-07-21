const CACHE_NAME = 'safarro-cache-8.3-local-assets-20260721';
const ASSETS = [
  '/',
  '/buyer/',
  '/buyer/index.html',
  '/staff/',
  '/staff/index.html',
  '/admin/',
  '/admin/index.html',
  '/assets/css/style.css',
  '/assets/css/safro-v8.css',
  '/assets/css/icons-local.css',
  '/assets/js/data.js',
  '/assets/js/core.js',
  '/assets/js/buyer.js',
  '/assets/js/staff.js',
  '/assets/js/admin.js',
  '/assets/js/ui-enhancements.js',
  '/assets/js/safro-v8.js',
  '/assets/images/logo-safaro.png',
  '/assets/images/logo-safaro-192.png',
  '/assets/images/logo-safaro-512.png',
  '/assets/images/isfahan-bridge.svg',
  '/assets/images/world-landmarks-minimal.svg',
  '/assets/images/world-landmarks-denser.svg',
  '/assets/images/world-landmarks-more.svg',
  '/assets/images/world-landmarks-v45-art.svg',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (url.origin === location.origin && response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => null);
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('/buyer/').then(page => page || caches.match('/buyer/index.html'));
          }
          return new Response('', { status: 504, statusText: 'Offline' });
        })
      )
  );
});


self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_SAFRO_CACHES') {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))));
  }
});

// v6.0: prevent undefined fetch fallbacks from breaking Chrome's service worker response pipeline.
