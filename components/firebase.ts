import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';
import { app, auth, usingFirebaseEmulators, connectEmulatorOnce, emulatorHost } from './firebaseAuth';
export { auth, usingFirebaseEmulators };
const env: Partial<ImportMetaEnv> = import.meta.env ?? {};
export const db = getFirestore(app, usingFirebaseEmulators ? '(default)' : (env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId));
export const storage = getStorage(app);
if (usingFirebaseEmulators) {
  connectEmulatorOnce('firestore', () => connectFirestoreEmulator(db, emulatorHost, 8080));
  connectEmulatorOnce('storage', () => connectStorageEmulator(storage, emulatorHost, 9199));
}

function isPlainObjectOrArray(obj: any): boolean {
  if (obj === null || typeof obj !== 'object') return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === null || proto === Object.prototype || Array.isArray(obj);
}

/**
 * Recursively removes all `undefined` values from an object or array
 * so that Firestore setDoc / updateDoc / addDoc calls do not throw
 * "Unsupported field value: undefined" errors.
 */
export function sanitizeFirestoreData<T>(obj: T): T {
  if (obj === undefined) {
    return null as unknown as T;
  }
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== undefined)
      .map(item => sanitizeFirestoreData(item)) as unknown as T;
  }
  if (!isPlainObjectOrArray(obj)) {
    // Keep Firestore FieldValue (e.g. serverTimestamp()), Timestamp, Date, etc.
    return obj;
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleanObj[key] = sanitizeFirestoreData(value);
    }
  }
  return cleanObj as T;
}

