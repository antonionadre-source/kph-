import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export interface FileUploadResult {
  fileUrl: string;
  fileUrls: string;
  fileName: string;
  fileCount: number;
}

/**
 * Uploads a list of File objects to Firebase Storage under:
 *   solicitudes/AAAA-MM-DD/timestamp-nombrearchivo
 *
 * If upload fails or if no files are provided, gracefully returns
 * empty values so lead submission is never blocked.
 */
export async function uploadFilesToStorage(files: File[]): Promise<FileUploadResult> {
  if (!files || files.length === 0) {
    return {
      fileUrl: '',
      fileUrls: '',
      fileName: '',
      fileCount: 0,
    };
  }

  const validFiles = files.filter(f => f instanceof File);
  if (validFiles.length === 0) {
    return {
      fileUrl: '',
      fileUrls: '',
      fileName: '',
      fileCount: 0,
    };
  }

  const today = new Date().toISOString().split('T')[0];
  const uploadedResults: { name: string; url: string }[] = [];

  for (const file of validFiles) {
    try {
      const timestamp = Date.now();
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `solicitudes/${today}/${timestamp}-${cleanName}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      if (url) {
        uploadedResults.push({ name: file.name, url });
      }
    } catch (err) {
      console.warn(`Failed to upload file "${file.name}" to Firebase Storage:`, err);
      // Non-blocking: continue with other files or fallback
    }
  }

  const validUrls = uploadedResults.map(r => r.url).filter(Boolean);
  const firstResult = uploadedResults.find(r => Boolean(r.url));

  return {
    fileUrl: firstResult ? firstResult.url : '',
    fileUrls: validUrls.join(', '),
    fileName: firstResult ? firstResult.name : (validFiles[0]?.name || ''),
    fileCount: validFiles.length,
  };
}
