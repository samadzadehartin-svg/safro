const CACHE_NAME = 'safarro-cache-v5.6';
const ASSETS = [
  '/',
  '/buyer/',
  '/buyer/index.html',
  '/staff/',
  '/staff/index.html',
  '/admin/',
  '/admin/index.html',
  '/assets/css/style.css',
  '/assets/js/data.js',
  '/assets/js/core.js',
  '/assets/js/buyer.js',
  '/assets/js/staff.js',
  '/assets/js/admin.js',
  '/assets/images/logo-safaro.png',
  '/assets/images/logo-safaro-192.png',
  '/assets/images/logo-safaro-512.png',
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

  if (url.origin !== location.origin) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') return caches.match('/buyer/');
        })
      )
  );
});


self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_SAFRO_CACHES') {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))));
  }
});
