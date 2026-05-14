/* global self, caches, fetch */

const CACHE_NAME = "cosmic-card-v1";
const APP_SHELL = [
  "/",
  "/draw",
  "/assets/cosmic/avatar-orion.png",
  "/assets/cosmic/card-stack.png",
  "/assets/cosmic/cloud-mascot.png",
  "/assets/cosmic/quote-heart.png",
  "/assets/cosmic/star-cloud.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== "GET" || requestUrl.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() =>
        caches.match(request).then((cachedResponse) => {
          return cachedResponse || caches.match("/");
        }),
      ),
  );
});
