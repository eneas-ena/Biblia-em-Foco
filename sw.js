const CACHE_NAME = "biblia-em-foco-leitura-visual-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/icon.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/BF.png",
  "./data/app-data.js",
  "./data/lexicon.js",
  "./data/books/matthew.js",
  "./data/books/mark.js",
  "./data/books/luke.js",
  "./data/books/john.js",
  "./data/books/acts.js",
  "./data/books/romans.js",
  "./data/books/1corinthians.js",
  "./data/books/2corinthians.js",
  "./data/books/galatians.js",
  "./data/books/ephesians.js",
  "./data/books/philippians.js",
  "./data/books/colossians.js",
  "./data/books/1thessalonians.js",
  "./data/books/2thessalonians.js",
  "./data/books/1timothy.js",
  "./data/books/2timothy.js",
  "./data/books/titus.js",
  "./data/books/philemon.js",
  "./data/books/hebrews.js",
  "./data/books/james.js",
  "./data/books/1peter.js",
  "./data/books/2peter.js",
  "./data/books/1john.js",
  "./data/books/2john.js",
  "./data/books/3john.js",
  "./data/books/jude.js",
  "./data/books/revelation.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => (
      cached || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
    ))
  );
});
