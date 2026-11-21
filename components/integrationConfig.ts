// Public browser configuration only. Never place server API secrets in VITE_*.
const env: Partial<ImportMetaEnv> = import.meta.env ?? {};
export const isServerRuntime = typeof window === 'undefined' || env.SSR === true ||
  (window as Window & { SSR?: boolean }).SSR === true;
export const isLocalRuntime = typeof window !== 'undefined' && (
  /^(localhost|127(?:\.\d+){3}|\[?::1\]?|0\.0\.0\.0)$/.test(window.location.hostname) ||
  /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(window.location.hostname) ||
  window.location.hostname.endsWith('.local')
);

export const externalSubmissionsEnabled = !isServerRuntime && env.VITE_ENABLE_EXTERNAL_SUBMISSIONS === 'true';

export function assertExternalSubmissionsEnabled(): void {
  if (!externalSubmissionsEnabled) {
    throw new Error('External submissions are disabled. Configure a test service and VITE_ENABLE_EXTERNAL_SUBMISSIONS=true in .env.local.');
  }
}

export function requireWebhookUrl(value: string | undefined, variable: string): string {
  if (!value) throw new Error(`${variable} is not configured.`);
  const url = new URL(value);
  const localHost = /^(localhost|127(?:\.\d+){3}|\[?::1\]?)$/.test(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && localHost)) {
    throw new Error(`${variable} must use HTTPS (HTTP is permitted for local test endpoints).`);
  }
  return url.href;
}

export const bookingConfirmation: Record<string, string> = {
  de: 'Diese Anfrage und den Chatverlauf an Kraken senden?',
  en: 'Send this request and the chat transcript to Kraken?',
  fr: 'Envoyer cette demande et la conversation à Kraken ?',
  it: 'Inviare questa richiesta e la conversazione a Kraken?',
  es: '¿Enviar esta solicitud y la conversación a Kraken?',
  pt: 'Enviar este pedido e a conversa para a Kraken?',
};
