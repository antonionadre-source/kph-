import type { KaiService } from './types.ts';
type OpenRequest = { service?: KaiService | null; opener?: HTMLElement | null };
const listeners = new Set<(request: OpenRequest) => void>();
let pending: OpenRequest | null = null;

/** A slow assistant chunk must not lose a click on the homepage. */
export function requestKaiOpen(service?: KaiService | null, opener?: HTMLElement | null) {
  const request = { service, opener };
  if (!listeners.size) pending = request;
  else listeners.forEach(listener => listener(request));
}
export function subscribeKaiOpen(listener: (request: OpenRequest) => void) {
  listeners.add(listener);
  if (pending) { const request = pending; pending = null; listener(request); }
  return () => { listeners.delete(listener); };
}
