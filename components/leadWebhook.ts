import { assertExternalSubmissionsEnabled, requireWebhookUrl } from './integrationConfig';

const env: Partial<ImportMetaEnv> = import.meta.env ?? {};
export const MAKE_WEBHOOK_URL = env.VITE_MAKE_LEAD_WEBHOOK_URL || '';

export async function postWebhook(url: string, payload: Record<string, any>): Promise<void> {
  assertExternalSubmissionsEnabled();
  const configuredUrl = requireWebhookUrl(url, 'VITE_MAKE_*_WEBHOOK_URL');
  const response = await fetch(configuredUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Webhook returned HTTP ${response.status}.`);
}

export async function sendLead(payload: Record<string, any>): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const fullPayload: Record<string, any> = {
      source: payload.source || 'General Lead',
      ...payload,
      timestamp: new Date().toISOString(),
      page: typeof window !== 'undefined' ? window.location.href : '',
    };

    const summary = Object.entries(fullPayload)
      .filter(([k, v]) => !['source', 'timestamp', 'language', 'page', 'summary', 'fileUrls'].includes(k) && v !== '' && v != null && v !== false)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : v)}`)
      .join(' | ')
      .replace(/[\n\r\t]+/g, ' / ')
      .replace(/ {3,}/g, ' ');

    fullPayload.summary = summary.length > 650 ? summary.slice(0, 650) + '…' : summary;

    assertExternalSubmissionsEnabled();
    const url = requireWebhookUrl(MAKE_WEBHOOK_URL, 'VITE_MAKE_LEAD_WEBHOOK_URL');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullPayload),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Lead webhook returned HTTP ${response.status}.`);
  } catch (error) {
    // Fire-and-forget: silently log or ignore errors to never block user flow
    console.warn('sendLead webhook dispatch failed or timed out:', error);
  } finally {
    clearTimeout(timeoutId);
  }
}
