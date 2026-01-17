// Service Worker Registration
if (‘serviceWorker’ in navigator) {
window.addEventListener(‘load’, () => {
navigator.serviceWorker.register(’/service-worker.js’)
.then(registration => {
console.log(‘✅ Service Worker registered:’, registration.scope);

```
    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('🔄 New Service Worker found!');
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'activated') {
          console.log('✅ New Service Worker activated!');
        }
      });
    });
  })
  .catch(error => {
    console.error('❌ Service Worker registration failed:', error);
  });
```

});

// Handle service worker updates
let refreshing = false;
navigator.serviceWorker.addEventListener(‘controllerchange’, () => {
if (!refreshing) {
window.location.reload();
refreshing = true;
}
});
}

// Request notification permission
async function requestNotificationPermission() {
if (‘Notification’ in window && ‘serviceWorker’ in navigator) {
const permission = await Notification.requestPermission();
if (permission === ‘granted’) {
console.log(‘✅ Notification permission granted’);
}
}
}

// Check if app is standalone (installed as PWA)
function isStandalone() {
return window.matchMedia(’(display-mode: standalone)’).matches ||
window.navigator.standalone === true;
}

if (isStandalone()) {
console.log(‘📱 Running as installed PWA’);
}

// Install prompt
let deferredPrompt;

window.addEventListener(‘beforeinstallprompt’, (e) => {
// Prevent the mini-infobar from appearing on mobile
e.preventDefault();
// Save the event so it can be triggered later
deferredPrompt = e;
console.log(‘💾 Install prompt ready’);

// Optionally show your own install button here
});

window.addEventListener(‘appinstalled’, () => {
console.log(‘✅ WhatsUp has been installed!’);
deferredPrompt = null;
});
