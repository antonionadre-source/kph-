export type PortalCollection = 'maintenance_requests' | 'job_applications' | 'contact_messages';
export const PORTAL_PAGE_SIZE = 25;
export function portalQueryPlan(collection: PortalCollection, uid: string, staff: boolean, status = 'all') {
  if (!uid || (collection === 'contact_messages' && !staff)) throw new Error('portal/forbidden');
  const filters: Array<[string, string]> = [];
  if (!staff) filters.push(['userId', uid]);
  if (status !== 'all') filters.push(['status', status]);
  return { collection, filters, orderBy: ['createdAt', 'desc'] as const, limit: PORTAL_PAGE_SIZE };
}
export function mergePortalRecords<T extends { id: string }>(previous: T[], next: T[]): T[] {
  const combined = new Map(previous.map(item => [item.id, item]));
  next.forEach(item => combined.set(item.id, item));
  return Array.from(combined.values());
}

export interface PortalAmountRecord { amount?: number; estimatedAmount?: number; serverQuote?: { totalCents?: unknown } | null; }
/** Client estimates never establish a confirmed quote or a payment. */
export function portalAmount(record: PortalAmountRecord): { value: number | undefined; confirmed: boolean } {
  const cents = record.serverQuote?.totalCents;
  if (typeof cents === 'number' && Number.isSafeInteger(cents) && cents >= 0) return { value: cents / 100, confirmed: true };
  if (typeof record.estimatedAmount === 'number' && Number.isFinite(record.estimatedAmount) && record.estimatedAmount >= 0) return { value: record.estimatedAmount, confirmed: false };
  if (typeof record.amount === 'number' && Number.isFinite(record.amount) && record.amount > 0) return { value: record.amount, confirmed: false };
  return { value: undefined, confirmed: false };
}
