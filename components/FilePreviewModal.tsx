import React, { useState } from 'react';
import { X, Download, ExternalLink, FileText, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { downloadFileSafely, getFileTypeInfo } from './fileUtils';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  title?: string;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  title = 'Visualizador de Documentos',
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !fileUrl) return null;

  const { isImage, isPdf, isTextPlaceholder } = getFileTypeInfo(fileUrl, fileName);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      await downloadFileSafely(fileUrl, fileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const isDataUrl = fileUrl.startsWith('data:');
  const googleDocsViewerUrl = !isDataUrl && fileUrl.startsWith('http') 
    ? `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true` 
    : '';

  return (
    <div 
      className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-6 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
              {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider block">
                {title} • {isPdf ? 'PDF' : isImage ? 'IMAGEN' : 'DOCUMENTO'}
              </span>
              <h3 className="font-extrabold text-sm md:text-base text-white truncate" title={fileName}>
                {fileName || 'Archivo Adjunto'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              disabled={isDownloading || isTextPlaceholder}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 disabled:opacity-50'
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Descargando...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Descargado</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar</span>
                </>
              )}
            </button>

            {!isTextPlaceholder && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
                title="Abrir directamente en navegador"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden md:inline">Abrir directo</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[50vh] max-h-[78vh]">
          {isTextPlaceholder ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white mb-2">{fileName}</h4>
                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono break-all">
                  {fileUrl}
                </p>
              </div>
            </div>
          ) : isImage && !imageError ? (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={fileUrl}
                alt={fileName}
                onError={() => setImageError(true)}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-slate-800/80"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : isPdf ? (
            <div className="w-full h-full flex flex-col gap-3">
              {isDataUrl ? (
                <object
                  data={fileUrl}
                  type="application/pdf"
                  className="w-full h-[68vh] rounded-2xl border border-slate-800 bg-white shadow-xl"
                >
                  <embed
                    src={fileUrl}
                    type="application/pdf"
                    className="w-full h-[68vh] rounded-2xl bg-white"
                  />
                </object>
              ) : (
                <iframe
                  src={googleDocsViewerUrl || fileUrl}
                  title={fileName}
                  className="w-full h-[68vh] rounded-2xl border border-slate-800 bg-white shadow-xl"
                />
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6">
              <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-400">
                <FileText className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-white mb-2">{fileName}</h4>
                <p className="text-xs text-slate-400">
                  Documento en Firebase Storage listo para su uso. Haz clic a continuación para abrirlo directamente o descargarlo.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir Documento en Nueva Pestaña</span>
                </a>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Archivo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

