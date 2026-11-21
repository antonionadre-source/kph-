import { FieldPath } from 'firebase-admin/firestore';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { Request, Response } from 'express';
import { adminServices, authenticatedUser, HttpError } from './firebaseAdmin.ts';

const identifier = /^[A-Za-z\d_-]{1,128}$/;
const PAGE_SIZE = 100;
export function canTransferDraft(data: Record<string, any>, sourceUid: string) {
  return data.userId === sourceUid && data.status === 'Draft'
    && !['checkout', 'payment', 'serverQuote', 'transactionId', 'timestamps', 'scheduledAt'].some(key => key in data)
    // Storage ownership is encoded in its path; do not silently break attachments.
    && !(data.mediaAttachments?.length || data.mediaUrls?.length);
}
export class FirebaseDraftTransferStore {
  async transfer(sourceUid: string, destinationUid: string, cursor?: string) {
    const { db, timestamp } = adminServices();
    let query = db.collection('maintenance_requests').where('userId', '==', sourceUid).orderBy(FieldPath.documentId()).limit(PAGE_SIZE);
    if (cursor) query = query.startAfter(cursor);
    return db.runTransaction(async transaction => {
      const snapshot = await transaction.get(query);
      const movedIds: string[] = [], skippedIds: string[] = [];
      for (const document of snapshot.docs) {
        if (!canTransferDraft(document.data(), sourceUid)) { skippedIds.push(document.id); continue; }
        transaction.update(document.ref, { userId: destinationUid, updatedAt: timestamp() });
        transaction.set(db.collection('draft_transfers').doc(`${document.id}-${sourceUid}-${destinationUid}`), {
          bookingId: document.id, sourceUid, destinationUid, transferredAt: timestamp(),
        });
        movedIds.push(document.id);
      }
      return { movedIds, skippedIds, ...(snapshot.size === PAGE_SIZE ? { nextCursor: snapshot.docs.at(-1)!.id } : {}) };
    });
  }
}
async function anonymousSource(token: string) {
  try { return await adminServices().auth.verifyIdToken(token, true); }
  catch (error) { if (error instanceof HttpError) throw error; throw new HttpError(401, 'The guest session could not be verified.'); }
}
export function draftTransferHandler(deps = {
  destination: authenticatedUser,
  source: anonymousSource,
  store: new FirebaseDraftTransferStore(),
}) {
  return async (req: Request, res: Response) => {
    try {
      const token = req.body?.sourceIdToken, cursor = req.body?.cursor;
      if (typeof token !== 'string' || !token.length || token.length > 16384
        || (cursor !== undefined && (typeof cursor !== 'string' || !identifier.test(cursor)))
        || Object.keys(req.body).some(key => !['sourceIdToken', 'cursor'].includes(key))) {
        throw new HttpError(400, 'A guest session proof is required; ownership cannot be supplied by the browser.');
      }
      const destination: DecodedIdToken = await deps.destination(req);
      const source: DecodedIdToken = await deps.source(token);
      if (source.firebase?.sign_in_provider !== 'anonymous'
        || !destination.firebase?.sign_in_provider || destination.firebase.sign_in_provider === 'anonymous'
        || source.uid === destination.uid) throw new HttpError(403, 'A guest session and a different signed-in account are required.');
      return res.json({ success: true, ...await deps.store.transfer(source.uid, destination.uid, cursor) });
    } catch (error) {
      if (error instanceof HttpError) return res.status(error.status).json({ success: false, error: error.message });
      // Never log request bodies or credentials. A failed transfer must not undo login.
      return res.status(503).json({ success: false, error: 'Draft transfer is temporarily unavailable. Your sign-in remains valid; retry in this session.' });
    }
  };
}
