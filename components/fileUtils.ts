/**
 * Utility functions for downloading and previewing files safely across Firebase Storage,
 * base64 data URLs, and standard HTTP links.
 */

export async function downloadFileSafely(fileUrl: string, fileName: string): Promise<boolean> {
  if (!fileUrl) {
    console.error('downloadFileSafely: No file URL provided');
    return false;
  }

  const cleanFileName = fileName && fileName.trim() ? fileName.trim() : 'documento_kraken';

  // Handle non-URL text reference
  if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://') && !fileUrl.startsWith('data:')) {
    alert(`El archivo "${cleanFileName}" está guardado como referencia:\n${fileUrl}`);
    return false;
  }

  try {
    // 1. Base64 Data URL handling (100% client-side conversion)
    if (fileUrl.startsWith('data:')) {
      const parts = fileUrl.split(',');
      if (parts.length < 2) throw new Error('Invalid base64 string');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      triggerBlobDownload(blob, cleanFileName);
      return true;
    }

    // 2. Firebase Storage URL with Content-Disposition override
    let targetDownloadUrl = fileUrl;
    if (fileUrl.includes('firebasestorage.googleapis.com')) {
      if (!fileUrl.includes('response-content-disposition')) {
        const separator = fileUrl.includes('?') ? '&' : '?';
        const dispositionValue = `attachment; filename="${encodeURIComponent(cleanFileName)}"`;
        targetDownloadUrl = `${fileUrl}${separator}response-content-disposition=${encodeURIComponent(dispositionValue)}`;
      }
    }

    // Attempt direct fetch blob download first
    try {
      const response = await fetch(targetDownloadUrl, { method: 'GET' });
      if (response.ok) {
        const blob = await response.blob();
        if (blob.size > 0) {
          triggerBlobDownload(blob, cleanFileName);
          return true;
        }
      }
    } catch (fetchErr) {
      console.warn('Fetch blob download restricted by CORS/Origin, using direct link download:', fetchErr);
    }

    // 3. Fallback direct download link
    const link = document.createElement('a');
    link.href = targetDownloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = cleanFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Error downloading file:', err);
    window.open(fileUrl, '_blank');
    return false;
  }
}

function triggerBlobDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 15000);
}

export function getFileTypeInfo(url: string = '', fileName: string = '') {
  const lowerUrl = (url || '').toLowerCase();
  const lowerName = (fileName || '').toLowerCase();

  const isTextPlaceholder = !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:');

  const isImage = 
    !isTextPlaceholder && (
      lowerUrl.startsWith('data:image/') ||
      /\.(jpg|jpeg|png|gif|webp|svg|heic)(\?.*)?$/i.test(lowerUrl) ||
      /\.(jpg|jpeg|png|gif|webp|svg|heic)$/i.test(lowerName) ||
      (lowerUrl.includes('quotes_media') && !lowerUrl.includes('.pdf') && !lowerName.endsWith('.pdf')) ||
      (lowerUrl.includes('firebasestorage') && (lowerUrl.includes('image') || lowerUrl.includes('.png') || lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.webp')))
    );

  const isPdf = 
    !isTextPlaceholder && (
      lowerUrl.startsWith('data:application/pdf') ||
      /\.pdf(\?.*)?$/i.test(lowerUrl) ||
      lowerName.endsWith('.pdf') ||
      lowerUrl.includes('.pdf')
    );

  return { isImage, isPdf, isTextPlaceholder };
}

