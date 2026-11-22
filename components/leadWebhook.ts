export const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/ucxeqjygku2w6zyf9ynut5oantantx58';

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

    await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullPayload),
      signal: controller.signal,
    });
  } catch (error) {
    // Fire-and-forget: silently log or ignore errors to never block user flow
    console.warn('sendLead webhook dispatch failed or timed out:', error);
  } finally {
    clearTimeout(timeoutId);
  }
}
