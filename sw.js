/* ============================================================
   sw.js — LifeForge service worker.
   Cache-first so the whole game is playable fully offline once
   it has loaded a single time. Bump CACHE when assets change.
   The big json/ event library is cached on demand by the fetch
   handler (runtime caching), so it stays in sync automatically.
   ============================================================ */
const CACHE = "lifeforge-v1.5.0";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./game.js",
  "./extras.js",
  "./manifest.webmanifest",
  "./assets/icons.js",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./data/core.js",
  "./data/careers.js",
  "./data/shop.js",
  "./data/politics.js",
  "./data/market.js",
  "./data/traits.js",
  "./data/skills.js",
  "./data/military.js",
  "./data/mafia.js",
  "./data/achievements.js",
  "./data/travel.js",
  "./data/scenarios.js",
  "./data/religions.js",
  "./data/zodiac.js",
  "./data/heists.js",
  "./data/events_childhood.js",
  "./data/events_teen.js",
  "./data/events_adult.js",
  "./data/events_relationship.js",
  "./data/events_career.js",
  "./data/events_senior.js",
  "./data/events_any.js",
  "./data/events_legal.js",
  "./data/events_politics.js",
  "./data/events_romance.js",
  "./data/events_emigration.js",
  "./data/events_fame.js",
  "./data/events_health.js",
  "./data/events_family.js",
  "./data/events_world.js",
  "./data/events_military.js",
  "./data/events_mafia.js",
  "./data/events_supernatural.js",
  "./data/events_extended.js",
  "./data/events_religion.js",
  "./data/events_zodiac.js",
  "./data/events_emergency.js",
  "./data/events_property.js",
  "./data/events_vehicle.js",
  "./data/events_college.js",
  "./data/events_lawsuit.js",
  "./data/events_business.js",
  "./data/events_wellness.js",
  "./data/events_familylife.js",
  "./data/events_entertainment.js",
  "./data/events_sports.js",
  "./data/events_eras.js",
  "./json/index.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Navigations: serve the app shell offline.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }
  // Everything else (incl. the json/ library): cache-first, then
  // network — and cache successful responses so the whole event
  // library becomes available offline after the first playthrough.
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
