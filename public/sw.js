const CACHE_NAME = 'rescuelens-pwa-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Offline Emergency Directory
const OFFLINE_EMERGENCY_DATA = {
  success: true,
  helpline: '112',
  name: 'Unified Emergency Response',
  directory: [
    { number: '112', name: 'Unified Emergency Response', desc: 'National single emergency number (Police, Fire, Medical)', isPrimary: true },
    { number: '100', name: 'Police', desc: 'Police Control Room & Law Enforcement' },
    { number: '101', name: 'Fire', desc: 'Fire Brigade & Hazard Rescue' },
    { number: '108', name: 'Ambulance', desc: 'Trauma Care & Medical Emergencies' },
    { number: '1098', name: 'Child Helpline', desc: 'Child Protection & Emergency Support' }
  ],
  offline: true,
  offlineNotice: '📶 OFFLINE MODE: Emergency numbers verified from local cache.'
};

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[RescueLens PWA] Caching critical offline assets...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[RescueLens PWA] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Never fake AI results offline for /api/analyze
  if (url.pathname.startsWith('/api/analyze')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            success: false,
            offline: true,
            error: '📶 Gemini AI analysis requires an active internet connection. AI results are never simulated offline.'
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          }
        );
      })
    );
    return;
  }

  // 2. Offline Helpline Directory Fallback
  if (url.pathname.startsWith('/api/helpline')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify(OFFLINE_EMERGENCY_DATA), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // 3. Navigation & Static Asset Cache Strategy
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        // If navigation fails, return cached index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
