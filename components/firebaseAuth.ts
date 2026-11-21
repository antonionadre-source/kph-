import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
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
export const app = isNewApp ? initializeApp(usingFirebaseEmulators ? emulatorConfig : productionConfig) : getApp();


export const auth = getAuth(app);
const connectionsKey = Symbol.for('kraken.firebase.emulator-connections');
const globalConnections = globalThis as typeof globalThis & { [connectionsKey]?: WeakMap<object, Set<string>> };
const connections = globalConnections[connectionsKey] ||= new WeakMap<object, Set<string>>();
export function connectEmulatorOnce(key: string, connect: () => void) {
  let connected = connections.get(app); if (!connected) { connected = new Set(); connections.set(app, connected); }
  if (!connected.has(key)) { connect(); connected.add(key); }
}
export const emulatorHost = env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1';
if (usingFirebaseEmulators) connectEmulatorOnce('auth', () => connectAuthEmulator(auth, `http://${emulatorHost}:9099`, { disableWarnings: true }));
