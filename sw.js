const CACHE = "trueline-v6";
const DATEIEN = [
 "./",
 "index.html",
 "manifest.json",
 "lib/jspdf.umd.min.js",
 "lib/jspdf.plugin.autotable.min.js",
 "fonts/barlow-latin-400-normal.woff2",
 "fonts/barlow-latin-500-normal.woff2",
 "fonts/barlow-latin-600-normal.woff2",
 "fonts/barlow-condensed-latin-600-normal.woff2",
 "fonts/barlow-condensed-latin-700-normal.woff2",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/maskable-192.png",
 "icons/maskable-512.png",
 "icons/apple-touch-icon.png",
 "icons/favicon-64.png"
];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if(r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if(r.mode === "navigate"){
    e.respondWith(fetch(r).then(res => { const k = res.clone(); caches.open(CACHE).then(c => c.put("index.html", k)); return res; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if(res.ok){ const k = res.clone(); caches.open(CACHE).then(c => c.put(r, k)); } return res; })));
});
