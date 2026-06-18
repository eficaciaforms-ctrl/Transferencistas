/* TRANSFER · Kenvue — service worker */
var CACHE = 'transfer-kenvue-v4';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        return res;
      }).catch(function () { return caches.match('./index.html'); });
    })
  );
});

/* Recibe alertas mostradas como notificacion del sistema (solo admin las dispara) */
self.addEventListener('message', function (e) {
  var d = e.data || {};
  if (d.type === 'integrity-alert' && self.registration && self.registration.showNotification) {
    self.registration.showNotification(d.title || 'Alerta de integridad', {
      body: d.body || '',
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'integrity'
    });
  }
});
