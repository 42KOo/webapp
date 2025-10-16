import { openDB } from 'idb';
export const DB_NAME = 'kubiciranje-db';
export const DB_VERSION = 1;
export const initIdb = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('shipments')) {
        db.createObjectStore('shipments', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { autoIncrement: true });
      }
    },
  });
  return db;
};
