/* INVERNA · service worker — cache app shell para uso sin internet */
const CACHE = 'inverna-v15';
const ASSETS = [
  './', './index.html', './manifest.json', './icon.svg',
  './css/styles.css?v=8',
  './js/store.js?v=1', './js/data.js?v=1', './js/ui.js?v=9', './js/q.js?v=1',
  './js/forms.js?v=1', './js/views-home.js?v=7', './js/views-gastos.js?v=3',
  './js/views-cortes.js?v=3', './js/views-clientes.js?v=3', './js/views-bitacora.js?v=1',
  './js/app.js?v=4',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
