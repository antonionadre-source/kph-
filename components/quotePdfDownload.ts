import type { GeneratorOptions } from './QuotePdfGenerator';

/** Keep the PDF engine outside the consultation route until a download is requested. */
export async function downloadQuotePdf(options: GeneratorOptions): Promise<void> {
  const { generateQuotePDF } = await import('./QuotePdfGenerator');
  await generateQuotePDF(options);
}

const messages = {
  de: { loading: 'PDF wird vorbereitet…', error: 'Das PDF konnte nicht heruntergeladen werden. Bitte erneut versuchen.' },
  en: { loading: 'Preparing PDF…', error: 'The PDF could not be downloaded. Please retry.' },
  fr: { loading: 'Préparation du PDF…', error: 'Le PDF n’a pas pu être téléchargé. Réessayez.' },
  it: { loading: 'Preparazione del PDF…', error: 'Non è stato possibile scaricare il PDF. Riprova.' },
  es: { loading: 'Preparando PDF…', error: 'No se pudo descargar el PDF. Reinténtalo.' },
  pt: { loading: 'A preparar PDF…', error: 'Não foi possível descarregar o PDF. Tente novamente.' },
} as const;
export function quotePdfStatusText(language: string, key: 'loading' | 'error'): string {
  return (messages[language.toLowerCase().split('-')[0] as keyof typeof messages] || messages.de)[key];
}
