import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { Request } from 'express';
import { stagingProjectId, stagingDatabaseId } from '../src/firebaseStaging.ts';

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}
export function previewAdminSettings(environment: Readonly<Record<string, string | undefined>>) {
  if (environment.VERCEL_ENV !== 'preview') return null;
  try {
    if (environment.FIREBASE_PREVIEW_STAGING_ENABLED !== 'true') throw new Error();
    const projectId = stagingProjectId(environment.FIREBASE_STAGING_PROJECT_ID);
    const databaseId = stagingDatabaseId(environment.VITE_FIREBASE_DATABASE_ID);
    if (environment.FIREBASE_AUTH_EMULATOR_HOST || environment.FIRESTORE_EMULATOR_HOST || environment.FIREBASE_STORAGE_EMULATOR_HOST) throw new Error();
    // Preview never falls back to inherited production credentials or ADC.
    const account = JSON.parse(environment.FIREBASE_STAGING_SERVICE_ACCOUNT_JSON || 'null');
    if (!account || account.project_id !== projectId || typeof account.private_key !== 'string' || !account.private_key.trim()
      || typeof account.client_email !== 'string' || !account.client_email.endsWith(`@${projectId}.iam.gserviceaccount.com`)) throw new Error();
    return { projectId, databaseId, account };
  } catch { throw new HttpError(503, 'Preview Firebase Admin staging is not configured consistently.'); }
}
export function adminServices() {
  const preview = previewAdminSettings(process.env);
  const projectId = preview?.projectId || process.env.FIREBASE_ADMIN_PROJECT_ID;
  const emulator = !preview && Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST && process.env.FIRESTORE_EMULATOR_HOST);
  if (!projectId || (!preview && !emulator && !process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !process.env.GOOGLE_APPLICATION_CREDENTIALS)) throw new HttpError(503, 'Booking verification is not configured.');
  if (emulator && !projectId.startsWith('demo-')) throw new HttpError(503, 'Emulator mode requires a demo project.');
  if (emulator) process.env.METADATA_SERVER_DETECTION = 'none';
  const appName = preview ? `kraken-preview-${projectId}` : 'kraken-server';
  let app = getApps().find(item => item.name === appName);
  if (!app) {
    let credential;
    if (preview) {
      try { credential = cert(preview.account); }
      catch { throw new HttpError(503, 'Preview Firebase Admin staging credential is invalid.'); }
    } else credential = emulator ? undefined : (process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) : applicationDefault());
    app = initializeApp({ projectId, ...(credential ? { credential } : {}) }, appName);
  }
  if (app.options.projectId !== projectId) throw new HttpError(503, 'Firebase Admin project configuration changed.');
  return { auth: getAuth(app), db: getFirestore(app, preview?.databaseId || process.env.FIREBASE_ADMIN_DATABASE_ID || (emulator ? '(default)' : 'ai-studio-c3c196d8-4523-4697-b51a-e29a8cc2483a')), timestamp: () => FieldValue.serverTimestamp() };
}
export async function authenticatedUser(req: Request) {
  const match = req.headers.authorization?.match(/^Bearer ([^\s]+)$/);
  if (!match) throw new HttpError(401, 'Sign in before submitting this booking.');
  try { return await adminServices().auth.verifyIdToken(match[1], true); }
  catch (error) { if (error instanceof HttpError) throw error; throw new HttpError(401, 'Your session could not be verified. Please sign in again.'); }
}
