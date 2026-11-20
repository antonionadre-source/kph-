import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';
import { isLocalRuntime, isServerRuntime } from './integrationConfig';

const env: Partial<ImportMetaEnv> = import.meta.env ?? {};
// Node prerendering and its mock DOM must never select the production project.
const firebaseMode = isServerRuntime ? 'emulator' : (env.VITE_FIREBASE_MODE || ((env.DEV || isLocalRuntime) ? 'emulator' : 'production'));
if (!['emulator', 'production'].includes(firebaseMode)) {
  throw new Error('VITE_FIREBASE_MODE must be emulator or production.');
}
export const usingFirebaseEmulators = firebaseMode === 'emulator';
const emulatorConfig = {
  apiKey: 'demo-kraken-pfm',
  projectId: 'demo-kraken-pfm',
  appId: 'demo-kraken-pfm',
  authDomain: 'localhost',
  storageBucket: 'demo-kraken-pfm.appspot.com',
};
const productionConfig = {
  ...firebaseConfig,
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  appId: env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
};
const isNewApp = getApps().length === 0;
const app = isNewApp ? initializeApp(usingFirebaseEmulators ? emulatorConfig : productionConfig) : getApp();

// The local demo project cannot access the production project's data.
export const db = getFirestore(app, usingFirebaseEmulators ? '(default)' : (env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId));
export const auth = getAuth(app);
export const storage = getStorage(app);

if (usingFirebaseEmulators && isNewApp) {
  const host = env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1';
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, host, 8080);
  connectStorageEmulator(storage, host, 9199);
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

