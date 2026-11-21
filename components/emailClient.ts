import emailjs from '@emailjs/browser';
import { assertExternalSubmissionsEnabled } from './integrationConfig';

const env: Partial<ImportMetaEnv> = import.meta.env ?? {};
export const EMAIL_SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID || '';
export const EMAIL_TEMPLATE_ID = env.VITE_EMAILJS_TEMPLATE_ID || '';
export const EMAIL_PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY || '';

function checkConfiguration(): void {
  assertExternalSubmissionsEnabled();
  if (!EMAIL_SERVICE_ID || !EMAIL_TEMPLATE_ID || !EMAIL_PUBLIC_KEY) {
    throw new Error('EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY in .env.local.');
  }
}

export default {
  // Initialization is optional; each submission supplies its public key explicitly.
  init(_publicKey: string): void {},
  async send(...args: Parameters<typeof emailjs.send>) {
    checkConfiguration();
    return emailjs.send(...args);
  },
  async sendForm(...args: Parameters<typeof emailjs.sendForm>) {
    checkConfiguration();
    return emailjs.sendForm(...args);
  },
};
