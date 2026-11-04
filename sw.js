// Service worker mínimo: só existe para o celular reconhecer o sistema como aplicativo instalável.
// Ele não guarda nenhum dado da empresa; tudo continua vindo da planilha pelo Google.
const VERSAO = 'agk3d-casca-v2';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icone-192.png', './icone-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Só a "casca" (esta página e os ícones) pode vir do cache; o sistema em si sempre vem da internet.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
