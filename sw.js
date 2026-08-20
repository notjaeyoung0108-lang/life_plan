/* 인생계획 — 오프라인 캐시. 빌드가 바뀌면 캐시 이름이 바뀌어 통째로 새로 받는다. */
const V = "plan-8c831c9b";
const FILES = ["./", "index.html?v=8c831c9b", "manifest.webmanifest?v=8c831c9b", "icon-192.png", "icon-512.png", "font-ui.woff2?v=8c831c9b", "font-head.woff2?v=8c831c9b", "font-hand.woff2?v=8c831c9b"];
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
