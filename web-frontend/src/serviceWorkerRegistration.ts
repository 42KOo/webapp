export function register() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(async (reg) => {
      console.log('SW registered', reg);
      // try to register a periodic sync (background sync)
      if ('sync' in reg) {
        try {
          await reg.sync.register('sync-outbox');
          console.log('Background sync registered');
        } catch (err) {
          console.warn('Could not register sync', err);
        }
      }
    }).catch(err => console.error('SW register failed', err));
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
  }
}
