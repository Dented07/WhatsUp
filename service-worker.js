// Service Worker for WhatsUp PWA
const CACHE_NAME = ‘whatsup-v1’;
const urlsToCache = [
‘/’,
‘/index.html’,
‘/styles.css’,
‘/app.js’,
‘/auth.js’,
‘/firebase-config.js’,
‘/manifest.json’
];

// Install Service Worker
self.addEventListener(‘install’, event => {
console.log(‘Service Worker: Installing…’);

event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => {
console.log(‘Service Worker: Caching files’);
return cache.addAll(urlsToCache);
})
.then(() => self.skipWaiting())
);
});

// Activate Service Worker
self.addEventListener(‘activate’, event => {
console.log(‘Service Worker: Activating…’);

event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.map(cache => {
if (cache !== CACHE_NAME) {
console.log(‘Service Worker: Clearing old cache’);
return caches.delete(cache);
}
})
);
}).then(() => self.clients.claim())
);
});

// Fetch Event - Network first, fallback to cache
self.addEventListener(‘fetch’, event => {
// Skip Firebase and external requests
if (!event.request.url.startsWith(self.location.origin) ||
event.request.url.includes(‘firebase’) ||
event.request.url.includes(‘google’)) {
return;
}

event.respondWith(
fetch(event.request)
.then(response => {
// Clone the response
const responseClone = response.clone();

```
    // Cache the new response
    caches.open(CACHE_NAME).then(cache => {
      cache.put(event.request, responseClone);
    });
    
    return response;
  })
  .catch(() => {
    // Network failed, try cache
    return caches.match(event.request);
  })
```

);
});

// Background Sync (for offline messaging)
self.addEventListener(‘sync’, event => {
if (event.tag === ‘sync-messages’) {
event.waitUntil(syncMessages());
}
});

async function syncMessages() {
// TODO: Implement message syncing when back online
console.log(‘Syncing messages…’);
}

// Push Notifications
self.addEventListener(‘push’, event => {
const data = event.data.json();

const options = {
body: data.body,
icon: ‘/assets/icon-192.png’,
badge: ‘/assets/icon-72.png’,
vibrate: [200, 100, 200],
data: {
url: data.url
}
};

event.waitUntil(
self.registration.showNotification(data.title, options)
);
});

// Notification Click
self.addEventListener(‘notificationclick’, event => {
event.notification.close();

event.waitUntil(
clients.openWindow(event.notification.data.url)
);
});
