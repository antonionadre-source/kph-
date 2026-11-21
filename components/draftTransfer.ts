export interface PendingDraftTransfer {
  sourceUid: string;
  sourceIdToken: string;
  destinationUid: string;
  cursor?: string;
  moved: number;
  skipped: number;
}
export type DraftTransferNotice = 'draftTransferPending' | 'draftTransferManual' | 'draftTransferMoved' | null;
interface TransferAccount { uid: string; getIdToken(): Promise<string>; }

/** Credentials live only in the caller's memory; never persist or log this object. */
export async function sendDraftTransfer(pending: PendingDraftTransfer, destination: TransferAccount, apiBase = '', request: typeof fetch = fetch): Promise<{ pending: PendingDraftTransfer | null; notice: DraftTransferNotice }> {
  if (destination.uid !== pending.destinationUid) return { pending: null, notice: 'draftTransferManual' };
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout>;
  const deadline = new Promise<never>((_resolve, reject) => { timeout = setTimeout(() => { controller.abort(); reject(new Error('Transfer timed out.')); }, 12000); });
  try {
    const token = await Promise.race([destination.getIdToken(), deadline]);
    const response = await Promise.race([request(apiBase.replace(/\/$/, '') + '/api/bookings/transfer-drafts', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sourceIdToken: pending.sourceIdToken, ...(pending.cursor ? { cursor: pending.cursor } : {}) }),
      signal: controller.signal,
    }), deadline]);
    if (response.status === 401 || response.status === 403) return { pending: null, notice: 'draftTransferManual' };
    if (!response.ok) throw new Error('Transfer is unavailable.');
    const result = await Promise.race([response.json(), deadline]);
    if (result.success !== true || !Array.isArray(result.movedIds) || !Array.isArray(result.skippedIds)
      || (result.nextCursor !== undefined && (typeof result.nextCursor !== 'string' || !/^[A-Za-z\d_-]{1,128}$/.test(result.nextCursor)))) throw new Error('Invalid transfer response.');
    const next = { ...pending, moved: pending.moved + result.movedIds.length, skipped: pending.skipped + result.skippedIds.length, ...(result.nextCursor ? { cursor: result.nextCursor } : {}) };
    if (result.nextCursor) return { pending: next, notice: 'draftTransferPending' };
    return { pending: null, notice: next.skipped ? 'draftTransferManual' : next.moved ? 'draftTransferMoved' : null };
  } catch {
    // Login remains valid; retry is safe because the server transfer is idempotent.
    return { pending, notice: 'draftTransferPending' };
  } finally { clearTimeout(timeout!); }
}
