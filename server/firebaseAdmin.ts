import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { Request } from 'express';

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}
export function adminServices() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const emulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST && process.env.FIRESTORE_EMULATOR_HOST);
  if (!projectId || (!emulator && !process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !process.env.GOOGLE_APPLICATION_CREDENTIALS)) throw new HttpError(503, 'Booking verification is not configured.');
  if (emulator && !projectId.startsWith('demo-')) throw new HttpError(503, 'Emulator mode requires a demo project.');
  if (emulator) process.env.METADATA_SERVER_DETECTION = 'none';
  let app = getApps().find(item => item.name === 'kraken-server');
  if (!app) {
    const credential = emulator ? undefined : (process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) : applicationDefault());
    app = initializeApp({ projectId, ...(credential ? { credential } : {}) }, 'kraken-server');
  }
  return { auth: getAuth(app), db: getFirestore(app, process.env.FIREBASE_ADMIN_DATABASE_ID || (emulator ? '(default)' : 'ai-studio-c3c196d8-4523-4697-b51a-e29a8cc2483a')), timestamp: () => FieldValue.serverTimestamp() };
}
export async function authenticatedUser(req: Request) {
  const match = req.headers.authorization?.match(/^Bearer ([^\s]+)$/);
  if (!match) throw new HttpError(401, 'Sign in before submitting this booking.');
  try { return await adminServices().auth.verifyIdToken(match[1], true); }
  catch (error) { if (error instanceof HttpError) throw error; throw new HttpError(401, 'Your session could not be verified. Please sign in again.'); }
}
