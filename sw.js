/* 인생계획 — 오프라인 캐시. 빌드가 바뀌면 캐시 이름이 바뀌어 통째로 새로 받는다. */
const V = "plan-4ec6bcf1";
const FILES = ["./", "index.html?v=4ec6bcf1", "manifest.webmanifest?v=4ec6bcf1", "icon-192.png", "icon-512.png", "font-head.woff2?v=4ec6bcf1", "font-hand.woff2?v=4ec6bcf1"];
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).catch(() => {}));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;            // GitHub API 는 그대로 통과
  e.respondWith(caches.match(e.request, { ignoreSearch: true })
    .then(r => r || fetch(e.request)));
});
