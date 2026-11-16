// Saves every app file (including the face model) on the first visit, so it works with no internet afterwards.
const V = 'face-swap-__V__';
self.addEventListener('install', e => e.waitUntil((async () => {
  const c = await caches.open(V);
  let list = [];
  try { list = await (await fetch('files.json', { cache: 'no-store' })).json(); } catch (err) {}
  await c.addAll(['./', ...list]);
  self.skipWaiting();
})()));
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== V) await caches.delete(k);
  await clients.claim();
})()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    const c = await caches.open(V), hit = await c.match(e.request, { ignoreSearch: true });
    const u = new URL(e.request.url), light = u.origin === location.origin && !u.pathname.includes('/vendor/');
    const net = () => fetch(e.request).then(r => { if (r.ok && r.status === 200) c.put(e.request, r.clone()).catch(() => {}); return r; });
    if (hit) { if (light) e.waitUntil(net().catch(() => {})); return hit; }
    try { return await net(); } catch (err) { return Response.error(); }
  })());
});
