const CACHE_NAME = "biblia-em-foco-mobile-study-screen-a11y-v1";
const OFFLINE_URL = "./index.html";
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
  "./data/books/genesis.js",
  "./data/books/exodus.js",
  "./data/books/leviticus.js",
  "./data/books/numbers.js",
  "./data/books/deuteronomy.js",
  "./data/books/joshua.js",
  "./data/books/judges.js",
  "./data/books/ruth.js",
  "./data/books/1samuel.js",
  "./data/books/2samuel.js",
  "./data/books/1kings.js",
  "./data/books/2kings.js",
  "./data/books/1chronicles.js",
  "./data/books/2chronicles.js",
  "./data/books/ezra.js",
  "./data/books/nehemiah.js",
  "./data/books/esther.js",
  "./data/books/job.js",
  "./data/books/psalms.js",
  "./data/books/proverbs.js",
  "./data/books/ecclesiastes.js",
  "./data/books/song.js",
  "./data/books/isaiah.js",
  "./data/books/jeremiah.js",
  "./data/books/lamentations.js",
  "./data/books/ezekiel.js",
  "./data/books/daniel.js",
  "./data/books/hosea.js",
  "./data/books/joel.js",
  "./data/books/amos.js",
  "./data/books/obadiah.js",
  "./data/books/jonah.js",
  "./data/books/micah.js",
  "./data/books/nahum.js",
  "./data/books/habakkuk.js",
  "./data/books/zephaniah.js",
  "./data/books/haggai.js",
  "./data/books/zechariah.js",
  "./data/books/malachi.js",
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
      .then(cache => Promise.all(ASSETS.map(asset => (
        cache.add(new Request(asset, { cache: "reload" })).catch(() => null)
      ))))
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

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  const isVersionedAsset = requestUrl.searchParams.has("v");

  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy.clone());
            cache.put(OFFLINE_URL, copy);
          });
          return response;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true })
          .then(cached => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  if (isVersionedAsset) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200) return response;
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request)
          .then(cached => cached || caches.match(event.request, { ignoreSearch: true })))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        if (!response || response.status !== 200) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
      return cached || networkFetch;
    })
  );
});
