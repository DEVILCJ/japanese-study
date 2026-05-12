// 버전 바꾸면 캐시 강제 갱신
const CACHE = 'jp-study-v5';

self.addEventListener('install', e => {
  // 즉시 활성화
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // 이전 캐시 전부 삭제
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 네트워크 우선 → 실패 시 캐시
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
