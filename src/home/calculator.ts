/** Homepage hand-off only. Prices and requests remain in ConsultationPage. */
export type HomeService = 'windows' | 'end' | 'regular' | 'deep' | 'moving';
export const CALCULATOR_ROUTE = '/quote';
export const CALCULATOR_SERVICE_STORAGE_KEY = 'kraken_preselected_service';
export const HOME_CALCULATOR_INTENT_KEY = 'kraken_home_calculator_intent';

export const CALCULATOR_SERVICE_IDS = ['end-of-tenancy', 'daily-cleaning', 'deep-cleaning', 'moving', 'pest-control', 'waste-management', 'gutter-cleaning', 'car-detailing', 'gardening', 'exterior-cleaning'] as const;
export type CalculatorServiceId = typeof CALCULATOR_SERVICE_IDS[number];
export type CalculatorRequest = { kind: 'service'; service: CalculatorServiceId } | { kind: 'windows' };
type HandoffStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const serviceMap = { end: 'end-of-tenancy', regular: 'daily-cleaning', deep: 'deep-cleaning', moving: 'moving' } as const;
let pendingRequest: CalculatorRequest | null = null;

function browserStorage(): HandoffStorage | null {
  try { return typeof window === 'undefined' ? null : window.localStorage; } catch { return null; }
}

export function homeCalculatorRequest(service: unknown): CalculatorRequest | null {
  if (service === 'windows') return { kind: 'windows' };
  if (typeof service === 'string' && Object.prototype.hasOwnProperty.call(serviceMap, service)) {
    return { kind: 'service', service: serviceMap[service as keyof typeof serviceMap] };
  }
  return null;
}

export function openHomeCalculator(service: HomeService | null | undefined, onNavigate: (page: string) => void, storage: HandoffStorage | null = browserStorage()): void {
  pendingRequest = homeCalculatorRequest(service);
  try {
    storage?.removeItem(HOME_CALCULATOR_INTENT_KEY);
    storage?.removeItem(CALCULATOR_SERVICE_STORAGE_KEY);
    if (pendingRequest?.kind === 'service') storage?.setItem(CALCULATOR_SERVICE_STORAGE_KEY, pendingRequest.service);
    else if (pendingRequest?.kind === 'windows') storage?.setItem(HOME_CALCULATOR_INTENT_KEY, 'windows');
  } catch { /* The same-page hand-off also works in memory when storage is blocked. */ }
  onNavigate(CALCULATOR_ROUTE);
}

export function consumeHomeCalculatorRequest(storage: HandoffStorage | null = browserStorage()): CalculatorRequest | null {
  let request = pendingRequest;
  pendingRequest = null;
  try {
    if (!request && storage?.getItem(HOME_CALCULATOR_INTENT_KEY) === 'windows') request = { kind: 'windows' };
    if (!request) {
      const service = storage?.getItem(CALCULATOR_SERVICE_STORAGE_KEY);
      if (CALCULATOR_SERVICE_IDS.includes(service as CalculatorServiceId)) request = { kind: 'service', service: service as CalculatorServiceId };
    }
    storage?.removeItem(HOME_CALCULATOR_INTENT_KEY);
    storage?.removeItem(CALCULATOR_SERVICE_STORAGE_KEY);
  } catch { /* Storage failure must not consume or modify the customer draft. */ }
  return request;
}

/** Preserve unknown/legacy fields; malformed saved JSON is never overwritten. */
export function mergeConsultationDraft(saved: string | null, fields: Record<string, unknown>): string | null {
  try {
    const existing = saved === null ? {} : JSON.parse(saved);
    if (!existing || typeof existing !== 'object' || Array.isArray(existing)) return null;
    return JSON.stringify({ ...existing, ...fields });
  } catch { return null; }
}
