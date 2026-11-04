// 마법학교 서비스워커 — 한 번 열어 두면 오프라인(키 모드)에서도 실행돼요.
// 게임을 수정해서 다시 올릴 때는 아래 버전 숫자를 올려 주세요. (v1 → v2 ...)
const CACHE = 'magic-school-v1';
const THREE = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const LOCAL = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-48.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(LOCAL);
    try { await c.put(THREE, await fetch(new Request(THREE, {mode: 'no-cors'}))); } catch (err) {}   // three.js 미리 저장
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  const sameOrigin = url.origin === location.origin;
  if (!sameOrigin && url.hostname !== 'cdnjs.cloudflare.com') return;           // 음성 인식 등 다른 요청은 건드리지 않음
  if (sameOrigin && (req.mode === 'navigate' || url.pathname.endsWith('/index.html'))) {
    // 페이지는 네트워크 우선 (업데이트가 바로 반영), 오프라인이면 저장본
    e.respondWith((async () => {
      try { const r = await fetch(req); const c = await caches.open(CACHE); c.put(req, r.clone()); return r; }
      catch (err) { return (await caches.match(req)) || (await caches.match('./index.html')); }
    })());
    return;
  }
  // 그 외(아이콘, three.js 등)는 저장본 우선
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    const r = await fetch(req);
    if (r.ok || r.type === 'opaque') { const c = await caches.open(CACHE); c.put(req, r.clone()); }
    return r;
  })());
});
