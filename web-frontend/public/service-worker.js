const CACHE_NAME = 'kubiciranje-cache-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// background sync: attempt to send outbox changes
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-outbox') {
    event.waitUntil(syncOutbox());
  }
});

async function syncOutbox() {
  try {
    const db = await openDB(); // helper below
    const tx = db.transaction('outbox', 'readwrite');
    const store = tx.objectStore('outbox');
    const all = await store.getAll();
    for (const item of all) {
      try {
        const resp = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes: [item] })
        });
        if (resp.ok) {
          // remove item
          const key = item._id || item.id;
          // clear entire store key by cursor since we used autoIncrement
          // simple approach: clear store after successful sync
        }
      } catch (err) {
        console.error('sync error', err);
      }
    }
    await store.clear();
    await tx.done;
  } catch (err) {
    console.error('syncOutbox failed', err);
  }
}

// Minimal IndexedDB helper for Service Worker (can't use idb lib here)
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('kubiciranje-db', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('shipments')) db.createObjectStore('shipments', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('outbox')) db.createObjectStore('outbox', { autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
