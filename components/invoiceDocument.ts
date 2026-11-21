import { portalText } from './portalText';
import { portalAmount, type PortalAmountRecord } from './portalRecords';
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}
export interface InvoiceSummary extends PortalAmountRecord {
  id: string; client: string; service: string; email?: string; address?: string; date?: string; amount?: number;
}
export function renderInvoiceSummary(request: InvoiceSummary, language: string): string {
  const text = (key: Parameters<typeof portalText>[1]) => escapeHtml(portalText(language, key));
  const financial = portalAmount(request);
  const amount = financial.value;
  const formatted = typeof amount === 'number' && Number.isFinite(amount) && amount >= 0 ? new Intl.NumberFormat(language === 'de-CH' ? 'de-CH' : language, { style: 'currency', currency: 'CHF' }).format(amount) : '—';
  return `<!doctype html><html lang="${escapeHtml(language)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${text('draftInvoice')} ${escapeHtml(request.id)}</title><style>body{font:16px system-ui;color:#032b59;max-width:800px;margin:24px auto;padding:20px}header{border-bottom:3px solid #007bff;padding-bottom:20px}dl{display:grid;grid-template-columns:minmax(100px,1fr) minmax(0,3fr);gap:12px}dd{margin:0;overflow-wrap:anywhere}button{background:#032b59;color:white;padding:12px 20px;border:0;border-radius:10px}small{display:block;margin-top:30px;color:#475569}@media print{button{display:none}}</style></head><body><header><strong>KRAKEN PFM</strong><h1>${text('draftInvoice')}</h1><p>${escapeHtml(request.id)}</p></header><dl><dt>${text('client')}</dt><dd>${escapeHtml(request.client)}<br>${escapeHtml(request.email)}<br>${escapeHtml(request.address)}</dd><dt>${text('service')}</dt><dd>${escapeHtml(request.service)}</dd><dt>${text('date')}</dt><dd>${escapeHtml(request.date || '—')}</dd><dt>${text(financial.confirmed ? 'quotedAmount' : 'amount')}</dt><dd>${escapeHtml(formatted)}</dd></dl><small>${text('invoiceNotice')}</small><p><button id="print-document" type="button">${text('print')}</button></p></body></html>`;
}
export function openInvoiceSummary(request: InvoiceSummary, language: string): boolean {
  const popup = window.open('', '_blank');
  if (!popup) return false;
  popup.opener = null;
  popup.document.open();
  popup.document.write(renderInvoiceSummary(request, language));
  popup.document.close();
  popup.document.getElementById('print-document')?.addEventListener('click', () => popup.print());
  return true;
}
