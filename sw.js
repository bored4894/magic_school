// 마법학교 서비스워커
// ✔ 파일을 GitHub에 다시 올리기만 하면 자동으로 최신 버전이 적용돼요. (버전 숫자를 올릴 필요 없음)
//   - 같은 사이트의 파일은 항상 "네트워크 우선"으로 받아오고, 인터넷이 없을 때만 저장본을 써요.
//   - 게임 화면에서는 1분마다 새 버전을 확인해서, 메뉴에서는 자동 새로고침 / 플레이 중에는 알림 버튼을 띄워요.
const CACHE = 'magic-school';
const THREE = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const LOCAL = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-48.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(LOCAL.map(async u => { try { await c.put(u, await fetch(u, {cache: 'no-cache'})); } catch (err) {} }));
    try { await c.put(THREE, await fetch(new Request(THREE, {mode: 'no-cors'}))); } catch (err) {}   // three.js 미리 저장 (오프라인용)
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
  const same = url.origin === location.origin;
  if (!same && url.hostname !== 'cdnjs.cloudflare.com') return;      // 음성 인식 등 다른 요청은 건드리지 않음
  if (same && url.searchParams.has('v')) return;                     // 새 버전 확인용 요청은 그대로 통과
  if (same) {
    // 우리 파일: 네트워크 우선(브라우저 캐시도 건너뜀) → 실패하면 저장본
    e.respondWith((async () => {
      try {
        const r = await fetch(req, {cache: 'no-cache'});
        if (r.ok) { const c = await caches.open(CACHE); c.put(req, r.clone()); }
        return r;
      } catch (err) { return (await caches.match(req)) || (await caches.match('./index.html')); }
    })());
    return;
  }
  // three.js(CDN): 저장본 우선
  e.respondWith((async () => {
    const hit = await caches.match(req); if (hit) return hit;
    const r = await fetch(req);
    if (r.ok || r.type === 'opaque') { const c = await caches.open(CACHE); c.put(req, r.clone()); }
    return r;
  })());
});
