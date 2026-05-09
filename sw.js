const CACHE_NAME = 'ca-rankos-final-v2';
const ASSETS = ['./', './index.html', './widget.html', './manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE_NAME).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(c => {
      const f = fetch(e.request).then(r => {
        const cl = r.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, cl));
        return r;
      }).catch(() => c);
      return c || f;
    })
  );
});
