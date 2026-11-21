import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import { storage } from './firebase';
import { auth } from './firebaseAuth';
import { withPortalTimeout } from './portalIdentity';

export const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'video/mp4', 'video/quicktime', 'application/pdf', 'application/zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
const MIME_BY_EXTENSION: Record<string, string> = { pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', heic: 'image/heic', heif: 'image/heif', mp4: 'video/mp4', mov: 'video/quicktime', zip: 'application/zip' };
export type AttachmentDirectory = 'solicitudes' | 'job_applications' | 'b2b_quotes';
export interface UploadedAttachment { name: string; url: string; path: string; size: number; contentType: string; }
export interface FileUploadResult {
  fileUrl: string; fileUrls: string; fileName: string; fileCount: number;
  attemptedCount: number;
  files: UploadedAttachment[];
  errors: Array<{ name: string; code: string }>;
}
export function validateAttachment(file: File): string {
  if (!file || typeof file.name !== 'string' || !Number.isFinite(file.size) || file.size <= 0 || !file.name.trim() || file.name.length > 250) throw new Error('attachment/empty');
  if (file.size > MAX_ATTACHMENT_BYTES) throw new Error('attachment/too-large');
  const contentType = file.type?.toLowerCase() || MIME_BY_EXTENSION[file.name.split('.').pop()?.toLowerCase() || ''];
  if (!contentType || !ALLOWED_MIME.has(contentType)) throw new Error('attachment/unsupported-type');
  return contentType;
}
export function validateCvAttachment(file: File): string {
  const type = validateAttachment(file);
  if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(type)) throw new Error('attachment/unsupported-cv');
  return type;
}
export function validateFloorPlan(file: File): string {
  const type = validateAttachment(file);
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(type)) throw new Error('attachment/unsupported-plan');
  return type;
}
let anonymousSignIn: Promise<unknown> | null = null;
export async function ensureUploadUser(): Promise<string> {
  await withPortalTimeout(auth.authStateReady(), 10000);
  if (!auth.currentUser) {
    anonymousSignIn ||= withPortalTimeout(signInAnonymously(auth), 10000).finally(() => { anonymousSignIn = null; });
    await anonymousSignIn;
  }
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('attachment/auth-required');
  return uid;
}
const uploadedByFile = new WeakMap<File, Map<string, Omit<UploadedAttachment, 'url'> & { url?: string }>>();

/** Only confirmed uploads are counted. Callers must handle errors before promising delivery. */
export async function uploadFilesToStorage(files: File[], options: { directory?: AttachmentDirectory; timeoutMs?: number } = {}): Promise<FileUploadResult> {
  const result: FileUploadResult = { fileUrl: '', fileUrls: '', fileName: '', fileCount: 0, attemptedCount: files?.length || 0, files: [], errors: [] };
  if (!files?.length) return result;
  const directory = options.directory || 'solicitudes';
  if (!['solicitudes', 'job_applications', 'b2b_quotes'].includes(directory)) throw new Error('attachment/invalid-directory');
  const validated: Array<{ file: File; contentType: string }> = [];
  for (const file of files) {
    try { validated.push({ file, contentType: validateAttachment(file) }); }
    catch (error: any) { result.errors.push({ name: file?.name || '', code: error.message || 'attachment/invalid' }); }
  }
  if (!validated.length) return result;
  let uid: string;
  try { uid = await ensureUploadUser(); }
  catch (error: any) {
    result.errors.push(...validated.map(({ file }) => ({ name: file.name, code: error.code || error.message || 'attachment/auth-required' })));
    return result;
  }
  const timeoutMs = options.timeoutMs || 30000;
  for (const { file, contentType } of validated) {
    try {
      const cacheKey = `${directory}/${uid}`;
      let cache = uploadedByFile.get(file);
      if (!cache) { cache = new Map(); uploadedByFile.set(file, cache); }
      let uploaded = cache.get(cacheKey);
      if (!uploaded) {
        const name = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-150) || 'attachment';
        const path = `${directory}/${uid}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${name}`;
        const task = uploadBytesResumable(ref(storage, path), file, { contentType });
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => { task.cancel(); reject(new Error('attachment/timeout')); }, timeoutMs);
          task.then(() => { clearTimeout(timer); resolve(); }, error => { clearTimeout(timer); reject(error); });
        });
        uploaded = { name: file.name, path, size: file.size, contentType };
        cache.set(cacheKey, uploaded);
      }
      uploaded.url ||= await withPortalTimeout(getDownloadURL(ref(storage, uploaded.path)), timeoutMs);
      result.files.push({ ...uploaded, url: uploaded.url });
    } catch (error: any) { result.errors.push({ name: file.name, code: error.code || error.message || 'attachment/upload-failed' }); }
  }
  result.fileCount = result.files.length;
  result.fileUrl = result.files[0]?.url || '';
  result.fileName = result.files[0]?.name || '';
  result.fileUrls = result.files.map(file => file.url).join(', ');
  return result;
}
