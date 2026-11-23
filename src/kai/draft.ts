import { homeCalculatorRequest } from '../home/calculator.ts';
import { KAI_FIELDS, KAI_SERVICES, KAI_SERVICE_FIELDS, type KaiDraft, type KaiField } from './types.ts';

export const KAI_TRANSFER_KEY = 'kraken_kai_calculator_transfer_v1';
export const KAI_TRANSFER_EVENT = 'kraken:kai-calculator-transfer';
const CONTACT_KEY = 'kraken_consultation_data_v2';
const CART_KEY = 'kraken_cart_persistent';
const TRANSFER_TTL_MS = 60 * 60 * 1000;
export type KaiTransferPolicy = 'preserve' | 'replace';
export type KaiTransfer = { draft: KaiDraft; policy: KaiTransferPolicy };
type TransferEnvelope = KaiTransfer & { version: 1; createdAt: number };
type StorageAccess = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
type Data = Record<string, unknown>;
let pendingTransfer: TransferEnvelope | null = null;
type LiveCalculation = { contact: Data; config: Data };
let liveCalculation: ((draft: KaiDraft) => LiveCalculation) | null = null;
/** Let the summary detect unsaved edits in an already-mounted calculator without exposing them on the DOM. */
export function registerKaiCalculationPreview(provider: (draft: KaiDraft) => LiveCalculation): () => void {
  liveCalculation = provider;
  return () => { if (liveCalculation === provider) liveCalculation = null; };
}

function browserStorage(kind: 'sessionStorage' | 'localStorage'): StorageAccess | null {
  try { return typeof window === 'undefined' ? null : window[kind]; } catch { return null; }
}
function browserEvents(): EventTarget | null {
  return typeof window === 'undefined' ? null : window;
}
/** No customer data is placed on the event; an already-mounted calculator consumes the staged draft. */
export function subscribeKaiTransfers(listener: () => void, target: EventTarget | null = browserEvents()): () => void {
  target?.addEventListener(KAI_TRANSFER_EVENT, listener);
  return () => target?.removeEventListener(KAI_TRANSFER_EVENT, listener);
}
function isRecord(value: unknown): value is Data {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Only the public draft contract crosses this boundary. Never accept amounts, IDs or credentials. */
export function normalizeKaiDraft(value: unknown): KaiDraft | null {
  if (!isRecord(value) || value.version !== 1 || !['de', 'en', 'es', 'pt', 'it', 'fr'].includes(String(value.language))) return null;
  if (value.service !== null && !KAI_SERVICES.includes(value.service as KaiDraft['service'])) return null;
  if (!Array.isArray(value.services) || !isRecord(value.fields) || !Array.isArray(value.deferred)) return null;
  const fields: KaiDraft['fields'] = {};
  let length = 0;
  for (const key of KAI_FIELDS) {
    const text = value.fields[key];
    if (text === undefined) continue;
    if (typeof text !== 'string' || text.length > 2000) return null;
    length += text.length;
    if (length > 12000) return null;
    if (text.trim()) fields[key] = text.trim();
  }
  return {
    version: 1, language: value.language as KaiDraft['language'], service: value.service as KaiDraft['service'],
    services: [...new Set(value.services.filter(service => KAI_SERVICES.includes(service)))],
    fields, deferred: [...new Set(value.deferred.filter(field => KAI_FIELDS.includes(field)))],
  };
}

/** Keep Kai's full draft elsewhere; only fields relevant to the selected service enter the calculator. */
function selectedServiceDraft(draft: KaiDraft): KaiDraft {
  const allowed: readonly KaiField[] = draft.service ? KAI_SERVICE_FIELDS[draft.service] : ['city', 'postcode', 'date', 'notes'];
  return {
    ...draft,
    fields: Object.fromEntries(Object.entries(draft.fields).filter(([field]) => allowed.includes(field as KaiField))),
    deferred: draft.deferred.filter(field => allowed.includes(field)),
  };
}

function readContactAndCart(storage: StorageAccess | null): { contact: Data; cart: Data[]; malformed: boolean } {
  try {
    const contactRaw = storage?.getItem(CONTACT_KEY);
    const cartRaw = storage?.getItem(CART_KEY);
    const contact = contactRaw == null ? {} : JSON.parse(contactRaw);
    const cart = cartRaw == null ? [] : JSON.parse(cartRaw);
    if (!isRecord(contact) || !Array.isArray(cart) || !cart.every(isRecord)) return { contact: {}, cart: [], malformed: true };
    return { contact, cart, malformed: false };
  } catch {
    // Unavailable storage is not evidence that a saved customer draft is malformed.
    try { storage?.getItem(CONTACT_KEY); } catch { return { contact: {}, cart: [], malformed: false }; }
    return { contact: {}, cart: [], malformed: true };
  }
}

export function getKaiTransferPreview(value: unknown, storage: StorageAccess | null = browserStorage('localStorage')): { conflicts: string[]; malformed: boolean } {
  const draft = normalizeKaiDraft(value);
  if (!draft) return { conflicts: [], malformed: true };
  const saved = readContactAndCart(storage);
  if (saved.malformed) return { conflicts: [], malformed: true };
  const request = homeCalculatorRequest(draft.service);
  const item = request?.kind === 'service' ? saved.cart.find(item => item.type === request.service) : undefined;
  const config = isRecord(item?.details) ? item.details : {};
  const current = liveCalculation?.(draft);
  return { conflicts: applyKaiToCalculation({ ...saved.contact, ...current?.contact }, current?.config || config, draft, 'preserve').conflicts, malformed: false };
}

/** Explicit Continue action only. Existing consultation/cart/payment keys are never written here. */
export function prepareKaiTransfer(value: unknown, policy: KaiTransferPolicy, storage: StorageAccess | null = browserStorage('sessionStorage'), target: EventTarget | null = browserEvents()): void {
  const draft = normalizeKaiDraft(value);
  if (!draft || !['preserve', 'replace'].includes(policy)) throw new TypeError('Invalid Kai transfer');
  pendingTransfer = { version: 1, createdAt: Date.now(), draft: selectedServiceDraft(draft), policy };
  try { storage?.setItem(KAI_TRANSFER_KEY, JSON.stringify(pendingTransfer)); } catch { /* In-memory hand-off remains available. */ }
  // Let the caller finish openHomeCalculator() before a mounted page consumes both intentions.
  if (target) queueMicrotask(() => target.dispatchEvent(new Event(KAI_TRANSFER_EVENT)));
}

/** Consume only our new key. A malformed legacy customer draft is never deleted or replaced. */
export function consumeKaiTransfer(storage: StorageAccess | null = browserStorage('sessionStorage')): KaiTransfer | null {
  let envelope: unknown = pendingTransfer;
  pendingTransfer = null;
  try {
    if (!envelope) {
      const raw = storage?.getItem(KAI_TRANSFER_KEY);
      if (raw) envelope = JSON.parse(raw);
    }
  } catch { /* Malformed or unavailable session storage: leave all other keys alone. */ }
  try { storage?.removeItem(KAI_TRANSFER_KEY); } catch { /* Blocked storage is recoverable. */ }
  if (!isRecord(envelope) || envelope.version !== 1 || typeof envelope.createdAt !== 'number') return null;
  const elapsed = Date.now() - envelope.createdAt;
  if (elapsed < 0 || elapsed > TRANSFER_TTL_MS || !['preserve', 'replace'].includes(String(envelope.policy))) return null;
  const draft = normalizeKaiDraft(envelope.draft);
  return draft ? { draft: selectedServiceDraft(draft), policy: envelope.policy as KaiTransferPolicy } : null;
}

function nonEmpty(value: unknown): boolean { return value !== undefined && value !== null && value !== ''; }
function integer(text: string | undefined): number | null {
  return text !== undefined && /^\d{1,2}$/.test(text.trim()) && Number(text) <= 20 ? Number(text) : null;
}
function validDate(text: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const date = new Date(`${text}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === text;
}
function normalized(text: string): string { return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase(); }
const frequencyAliases: Record<string, string[]> = {
  Daily: ['daily', 'taglich', 'diario', 'diaria', 'quotidien', 'quotidienne', 'quotidiano', 'giornaliero'],
  Weekly: ['weekly', 'wochentlich', 'semanal', 'semanalmente', 'hebdomadaire', 'settimanale'],
  'Bi-Weekly': ['bi-weekly', 'fortnightly', 'alle 2 wochen', 'alle zwei wochen', 'quincenal', 'quinzenal', 'toutes les deux semaines', 'ogni due settimane'],
  'Every 4 Weeks': ['every 4 weeks', 'alle 4 wochen', 'cada 4 semanas', 'toutes les 4 semaines', 'ogni 4 settimane'],
  'More Frequently': ['more frequently', 'haufiger', 'mas frecuente', 'plus frequemment', 'piu frequentemente', 'mais frequentemente'],
  'One-Time': ['one-time', 'once', 'einmalig', 'una vez', 'uma vez', 'ponctuel', 'una sola volta'],
  'Every 3 Months': ['every 3 months', 'alle 3 monate', 'cada 3 meses', 'tous les 3 mois', 'ogni 3 mesi'],
  'Every 4 Months': ['every 4 months', 'alle 4 monate', 'cada 4 meses', 'tous les 4 mois', 'ogni 4 mesi'],
  'Every 6 Months': ['every 6 months', 'alle 6 monate', 'cada 6 meses', 'tous les 6 mois', 'ogni 6 mesi'],
  'Every Year': ['every year', 'jahrlich', 'anual', 'annuel', 'annuale'],
};
function frequency(text: string, service: KaiDraft['service']): string | null {
  const match = Object.entries(frequencyAliases).find(([key, aliases]) => normalized(key) === normalized(text) || aliases.includes(normalized(text)))?.[0];
  const allowed = service === 'regular' ? ['Daily', 'Weekly', 'Bi-Weekly', 'Every 4 Weeks', 'More Frequently']
    : service === 'deep' ? ['One-Time', 'Every 3 Months', 'Every 4 Months', 'Every 6 Months', 'Every Year'] : [];
  return match && allowed.includes(match) ? match : null;
}
function postcodeIn(text: string | undefined): string | undefined {
  const matches = text?.match(/\b[1-9]\d{3}\b/g);
  return matches?.length === 1 ? matches[0] : undefined;
}

const fieldLabels: Record<KaiDraft['language'], readonly string[]> = {
  de: ['Ort', 'Postleitzahl', 'Startadresse', 'Zieladresse', 'Zimmer', 'Schlafzimmer', 'Badezimmer', 'Häufigkeit', 'Inventar', 'Zugang am Startort', 'Zugang am Zielort', 'Wunschtermin', 'Anzahl Fenster', 'Fenstertyp', 'Fensterzugang', 'Prioritäten', 'Hinweise'],
  en: ['City', 'Postcode', 'Origin', 'Destination', 'Rooms', 'Bedrooms', 'Bathrooms', 'Frequency', 'Inventory', 'Origin access', 'Destination access', 'Preferred date', 'Number of windows', 'Window type', 'Window access', 'Priorities', 'Notes'],
  es: ['Localidad', 'Código postal', 'Origen', 'Destino', 'Habitaciones', 'Dormitorios', 'Baños', 'Frecuencia', 'Inventario', 'Acceso en origen', 'Acceso en destino', 'Fecha preferida', 'Número de ventanas', 'Tipo de ventanas', 'Acceso a ventanas', 'Prioridades', 'Notas'],
  pt: ['Localidade', 'Código postal', 'Origem', 'Destino', 'Divisões', 'Quartos', 'Casas de banho', 'Frequência', 'Inventário', 'Acesso na origem', 'Acesso no destino', 'Data preferida', 'Número de janelas', 'Tipo de janelas', 'Acesso às janelas', 'Prioridades', 'Notas'],
  it: ['Località', 'Codice postale', 'Partenza', 'Destinazione', 'Stanze', 'Camere da letto', 'Bagni', 'Frequenza', 'Inventario', 'Accesso alla partenza', 'Accesso alla destinazione', 'Data preferita', 'Numero di finestre', 'Tipo di finestre', 'Accesso alle finestre', 'Priorità', 'Note'],
  fr: ['Localité', 'Code postal', 'Départ', 'Destination', 'Pièces', 'Chambres', 'Salles de bains', 'Fréquence', 'Inventaire', 'Accès au départ', 'Accès à destination', 'Date souhaitée', 'Nombre de fenêtres', 'Type de fenêtres', 'Accès aux fenêtres', 'Priorités', 'Notes'],
};
export function kaiDraftFieldLabel(field: KaiField, language: KaiDraft['language']): string {
  return fieldLabels[language][KAI_FIELDS.indexOf(field)];
}

/** Pure field mapping. No price, duration, request, payment, consent or cart mutations. */
export function applyKaiToCalculation(existingContact: Data, existingServiceConfig: Data, value: KaiDraft, policy: KaiTransferPolicy): { contact: Data; config: Data; conflicts: string[] } {
  const contact = { ...existingContact };
  const config = { ...existingServiceConfig };
  const normalizedDraft = normalizeKaiDraft(value);
  if (!normalizedDraft) return { contact, config, conflicts: [] };
  const draft = selectedServiceDraft(normalizedDraft);
  const conflicts = new Set<string>();
  const handled = new Set<KaiField>();
  const preserved = new Set<KaiField>();
  const notes: string[] = [];
  const assign = (target: Data, key: string, incoming: unknown, field: KaiField) => {
    if (!nonEmpty(incoming)) return;
    if (nonEmpty(target[key]) && String(target[key]) !== String(incoming)) {
      conflicts.add(field);
      if (policy !== 'replace') { preserved.add(field); return; }
    }
    target[key] = incoming;
    handled.add(field);
  };
  const fields = draft.fields;
  if (fields.city) assign(contact, 'city', fields.city, 'city');
  if (fields.postcode && /^[1-9]\d{3}$/.test(fields.postcode)) assign(contact, 'postcode', fields.postcode, 'postcode');
  if (fields.date && validDate(fields.date)) assign(contact, 'date', fields.date, 'date');
  if (draft.service === 'end' || draft.service === 'regular' || draft.service === 'deep') {
    const roomField = draft.service === 'end' ? 'rooms' : 'bedrooms';
    const roomCount = integer(fields[roomField]);
    const baths = integer(fields.bathrooms);
    if (roomCount !== null) assign(config, draft.service === 'end' ? 'roomsCount' : 'bedrooms', roomCount, roomField);
    if (baths !== null) assign(config, draft.service === 'end' ? 'bathroomsCount' : 'bathrooms', baths, 'bathrooms');
    const recurring = fields.frequency && frequency(fields.frequency, draft.service);
    if (recurring) assign(config, 'frequency', recurring, 'frequency');
  }
  if (draft.service === 'moving') {
    if (fields.origin) assign(config, 'fromAddress', fields.origin, 'origin');
    if (fields.destination) assign(config, 'toAddress', fields.destination, 'destination');
    const fromZip = postcodeIn(fields.origin) || (/^[1-9]\d{3}$/.test(fields.postcode || '') ? fields.postcode : undefined);
    const toZip = postcodeIn(fields.destination);
    if (fromZip) assign(config, 'fromZip', fromZip, fields.origin ? 'origin' : 'postcode');
    if (toZip) assign(config, 'toZip', toZip, 'destination');
    if (fields.inventory) assign(config, 'description', fields.inventory, 'inventory');
    // Free-form access descriptions remain notes; never infer lift, floor, parking or weights.
    for (const [field, key] of [['originAccess', 'accessFrom'], ['destinationAccess', 'accessTo']] as const) {
      const text = fields[field];
      if (!text) continue;
      const canonical = ['lift', 'elevator', 'aufzug', 'ascensor', 'ascenseur', 'ascensore', 'elevador'].includes(normalized(text)) ? 'Lift'
        : ['stairs', 'treppe', 'escaleras', 'escaliers', 'scale', 'escadas'].includes(normalized(text)) ? 'Stairs' : null;
      if (canonical) assign(config, key, canonical, field);
    }
  }
  // Details without an exact calculator control (including windows) stay visible, verbatim, as notes.
  for (const field of KAI_FIELDS) {
    const text = fields[field];
    if (!text || (handled.has(field) && !preserved.has(field))) continue;
    if (field === 'notes') {
      if (nonEmpty(contact.notes) && contact.notes !== text) conflicts.add('notes');
      notes.push(text);
    } else notes.push(`${kaiDraftFieldLabel(field, draft.language)}: ${text}`);
  }
  const oldNotes = typeof contact.notes === 'string' ? contact.notes : '';
  const additions = notes.filter(note => !oldNotes.includes(note));
  if (additions.length) contact.notes = [oldNotes, ...additions].filter(Boolean).join('\n');
  return { contact, config, conflicts: [...conflicts] };
}
