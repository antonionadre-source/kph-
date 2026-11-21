export const ORIGINAL_FIREBASE_PROJECT_ID = 'vivid-kite-477020-h6';
type Environment = Readonly<Record<string, unknown>>;
function required(env: Environment, key: string) {
  const value = env[key];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Staging requires ${key}.`);
  return value.trim();
}
export function stagingProjectId(value: unknown) {
  if (typeof value !== 'string' || !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(value)
    || value === ORIGINAL_FIREBASE_PROJECT_ID || value.startsWith('demo-')) {
    throw new Error('Staging requires a separate, non-demo Firebase project ID.');
  }
  return value;
}
export function stagingDatabaseId(value: unknown) {
  if (typeof value !== 'string' || (value !== '(default)' && !/^[a-z][a-z0-9-]{2,61}[a-z0-9]$/.test(value))) {
    throw new Error('Staging requires an explicit VITE_FIREBASE_DATABASE_ID.');
  }
  return value;
}
export function stagingWebConfig(env: Environment, originalApiKey?: string) {
  const projectId = stagingProjectId(env.VITE_FIREBASE_PROJECT_ID);
  const apiKey = required(env, 'VITE_FIREBASE_API_KEY');
  const appId = required(env, 'VITE_FIREBASE_APP_ID');
  const authDomain = required(env, 'VITE_FIREBASE_AUTH_DOMAIN');
  const storageBucket = required(env, 'VITE_FIREBASE_STORAGE_BUCKET');
  const databaseId = stagingDatabaseId(env.VITE_FIREBASE_DATABASE_ID);
  if (originalApiKey && apiKey === originalApiKey) throw new Error('Staging cannot use the original Firebase API key.');
  if (!/^1:\d+:web:[a-f\d]+$/i.test(appId)) throw new Error('Staging requires a valid web VITE_FIREBASE_APP_ID.');
  if (![`${projectId}.firebaseapp.com`, `${projectId}.web.app`].includes(authDomain)) throw new Error('Staging authDomain must belong to its Firebase project.');
  if (![`${projectId}.firebasestorage.app`, `${projectId}.appspot.com`].includes(storageBucket)) throw new Error('Staging storageBucket must belong to its Firebase project.');
  return { projectId, apiKey, appId, authDomain, storageBucket, databaseId };
}
