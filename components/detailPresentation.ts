import { portalAmount, type PortalAmountRecord } from './portalRecords';

const languages = ['de', 'en', 'fr', 'it', 'es', 'pt'];
const copy = {
  summary: ['Anfrageübersicht', 'Request summary', 'Récapitulatif de la demande', 'Riepilogo richiesta', 'Resumen de la solicitud', 'Resumo do pedido'],
  reference: ['Referenz', 'Reference', 'Référence', 'Riferimento', 'Referencia', 'Referência'],
  status: ['Status', 'Status', 'Statut', 'Stato', 'Estado', 'Estado'],
  unknownAccess: ['Nicht angegeben', 'Not specified', 'Non précisé', 'Non specificato', 'No especificado', 'Não especificado'],
  keys: ['Schlüsseltresor / Zugangscode', 'Keybox / access code', 'Boîte à clés / code d’accès', 'Cassaforte chiavi / codice di accesso', 'Caja de llaves / código de acceso', 'Caixa de chaves / código de acesso'],
  onSite: ['Kontakt vor Ort', 'Contact on site', 'Contact sur place', 'Contatto sul posto', 'Contacto en el lugar', 'Contacto no local'],
  download: ['Zusammenfassung herunterladen / drucken', 'Download / print summary', 'Télécharger / imprimer le récapitulatif', 'Scarica / stampa riepilogo', 'Descargar / imprimir resumen', 'Descarregar / imprimir resumo'],
  close: ['Schließen', 'Close', 'Fermer', 'Chiudi', 'Cerrar', 'Fechar'],
  deleteDraft: ['Entwurf löschen', 'Delete draft', 'Supprimer le brouillon', 'Elimina bozza', 'Eliminar borrador', 'Eliminar rascunho'],
  deposit: ['Angebotener Anfangsbetrag', 'Quoted initial amount', 'Montant initial du devis', 'Importo iniziale del preventivo', 'Importe inicial presupuestado', 'Valor inicial orçamentado'],
  paid: ['Bestätigte Zahlung', 'Verified payment', 'Paiement vérifié', 'Pagamento verificato', 'Pago verificado', 'Pagamento verificado'],
} as const;
export function detailText(language: string, key: keyof typeof copy): string {
  const index = languages.indexOf(language.toLowerCase().split('-')[0]);
  return copy[key][index < 0 ? 0 : index];
}
export function detailAccessText(value: unknown, language: string): string {
  const method = typeof value === 'string' ? value.trim() : '';
  if (!method) return detailText(language, 'unknownAccess');
  if (method === 'keys' || method === 'onSite') return detailText(language, method);
  return method;
}
const nonNegative = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
export interface DetailEvidenceRecord extends PortalAmountRecord {
  userId?: string; status?: string; checkout?: unknown;
  serverQuote?: { totalCents?: unknown; depositCents?: unknown; breakdown?: Record<string, unknown> } | null;
  payment?: { status?: string; verified?: boolean; transactionId?: string; amountCharged?: number } | null;
}
/** Only stored backend evidence supports a quoted deposit or a verified charge. */
export function detailEvidence(record: DetailEvidenceRecord, uid?: string) {
  const financial = portalAmount(record);
  const depositCents = record.serverQuote?.depositCents;
  const deposit = financial.confirmed && typeof depositCents === 'number' && Number.isSafeInteger(depositCents) && depositCents >= 0 && depositCents <= (record.serverQuote!.totalCents as number) ? depositCents / 100 : undefined;
  const payment = record.payment;
  const verifiedPayment = payment?.status === 'captured' && payment.verified === true && typeof payment.transactionId === 'string' && Boolean(payment.transactionId.trim()) && nonNegative(payment.amountCharged);
  const breakdown = record.serverQuote?.breakdown;
  return {
    financial, deposit, verifiedPayment,
    paid: verifiedPayment ? payment!.amountCharged : undefined,
    base: nonNegative(breakdown?.base) ? breakdown.base : undefined,
    travel: nonNegative(breakdown?.travelFee) ? breakdown.travelFee : undefined,
    surcharge: nonNegative(breakdown?.surcharge) ? breakdown.surcharge : undefined,
    surchargePercent: nonNegative(breakdown?.surchargePercent) ? breakdown.surchargePercent : undefined,
    canDeleteDraft: Boolean(uid && record.userId === uid && record.status === 'Draft' && !Object.hasOwn(record, 'checkout') && !Object.hasOwn(record, 'serverQuote') && !Object.hasOwn(record, 'payment')),
  };
}
