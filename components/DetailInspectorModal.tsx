import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../i18n';
import { getDashboardTranslation } from './dashboardTranslations';
import { FilePreviewModal, useDialogFocus } from './FilePreviewModal';
import { downloadFileSafely } from './fileUtils';
import { scheduleCalendarEventForKai } from './calendarUtils';
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  ExternalLink,
  X,
  AlertTriangle,
  Briefcase,
  Clipboard,
  Info,
  DollarSign,
  Image as ImageIcon,
  ArrowLeft,
  Edit,
  Send,
  Calendar,
  Download,
  Eye,
  Key,
  Bed,
  Droplets,
  CheckCircle,
  User,
  Check,
  CheckSquare,
  Layers,
  Clock,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { doc, updateDoc, collection, getDocs, query, orderBy, limit, writeBatch } from 'firebase/firestore';
import { useAuth } from './Auth';
import { db, sanitizeFirestoreData } from './firebase';
import { detailAccessText, detailEvidence, detailText } from './detailPresentation';
import { portalText } from './portalText';
import { openInvoiceSummary } from './invoiceDocument';
import { portalAmount } from './portalRecords';
import { withPortalTimeout } from './portalIdentity';

export interface TeamNote {
    id: string;
    author: string;
    authorId?: string;
    text: string;
    createdAt: string;
    updatedAt?: string;
}

export type MaintenanceRequest = {
    id: string;
    userId?: string;
    postcode?: string;
    client: string;
    service: string;
    date: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Draft';
    priority: 'Low' | 'Medium' | 'High';
    amount: number;
    estimatedAmount?: number;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
    teamNotes?: TeamNote[];
    mediaUrls?: string[];
    mediaNames?: string[];
    bookingMode?: string;
    accessMethod?: string;
    time?: string;
    services?: any[];
    payment?: {
      method: 'card' | 'bank_transfer' | 'twint' | 'cash';
      gateway: 'stripe' | 'payrexx' | 'manual';
      last4: string;
      brand: string;
      cardholderName: string;
      expiryMonth: string;
      expiryYear: string;
      transactionId: string;
      amountCharged: number;
      currency: string;
      status: 'pending' | 'captured' | 'failed' | 'refunded';
      verified?: boolean;
      verifiedAt?: unknown;
      amountDue?: number;
      billingPostal: string;
    } | null;
    mediaAttachments?: Array<{
      filename: string;
      mimeType: string;
      sizeBytes: number;
      uploadedAt: string;
      url: string;
    }>;
    timestamps?: {
      formSubmittedAt: string;
      priceCalculatedAt: string;
      depositCapturedAt: string | null;
      lastUpdatedAt: string;
      requestedServiceDate: string;
      requestedServiceTime: string;
    } | null;
    scheduling?: {
      requestedDate: string;
      preferredTimeWindow: 'flexible' | 'morning' | 'afternoon' | 'evening' | 'specific';
      specificTime: string | null;
      estimatedDurationHours: number;
      estimatedEndTime: string | null;
    } | null;
    checkout?: unknown;
    serverQuote?: Record<string, any>;
    createdAt?: any;
    updatedAt?: any;
};

interface DetailInspectorModalProps {
  selectedRequest: MaintenanceRequest;
  setSelectedRequest: (req: MaintenanceRequest | null) => void;
  isStaff: boolean;
  updateStatusDirect: (id: string, st: 'Pending' | 'In Progress' | 'Completed' | 'Draft') => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  requests: MaintenanceRequest[];
  setRequests: (reqs: MaintenanceRequest[]) => void;
}

export const DetailInspectorModal: React.FC<DetailInspectorModalProps> = ({
  selectedRequest,
  setSelectedRequest,
  isStaff,
  updateStatusDirect,
  handleDelete,
  requests,
  setRequests
}) => {
  const { language } = useTranslation();
  const dt = getDashboardTranslation(language);
  const { user } = useAuth();
  const pt = (key: Parameters<typeof portalText>[1]) => portalText(language, key);
  const [teamNotes, setTeamNotes] = useState<TeamNote[]>([]);
  const [noteAuthor, setNoteAuthor] = useState(user?.name || '');
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; title?: string } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialogFocus(true, dialogRef, closeRef, () => setSelectedRequest(null), Boolean(previewFile));

  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState(false);
  const notesVersion = useRef(0);
  const loadNotes = async () => {
    const current = ++notesVersion.current;
    setTeamNotes([]); setNotesError(false);
    if (!isStaff) return;
    setNotesLoading(true);
    try {
      const snapshot = await withPortalTimeout(getDocs(query(collection(db, 'maintenance_requests', selectedRequest.id, 'team_notes'), orderBy('createdAt', 'desc'), limit(100))));
      if (current === notesVersion.current) setTeamNotes(snapshot.docs.map(note => ({ ...note.data(), id: note.id } as TeamNote)));
    } catch { if (current === notesVersion.current) setNotesError(true); }
    finally { if (current === notesVersion.current) setNotesLoading(false); }
  };
  useEffect(() => {
    loadNotes(); setNewNoteText(''); setEditingNoteId(null);
    return () => { notesVersion.current++; };
  }, [selectedRequest.id, isStaff]);

  const updateAndPersistTeamNotes = async (updatedNotes: TeamNote[], _successMsg: string) => {
    if (!isStaff || !user?.uid) return false;
    setIsSavingNotes(true);
    try {
      const batch = writeBatch(db);
      const previous = new Map<string, TeamNote>(teamNotes.map(note => [note.id, note]));
      for (const note of updatedNotes) {
        const old = previous.get(note.id);
        if (old && JSON.stringify(old) === JSON.stringify(note)) continue;
        const persisted = { ...note, authorId: old?.authorId || user!.uid };
        batch.set(doc(db, 'maintenance_requests', selectedRequest.id, 'team_notes', note.id), sanitizeFirestoreData(persisted));
      }
      for (const old of teamNotes) {
        if (!updatedNotes.some(note => note.id === old.id)) batch.delete(doc(db, 'maintenance_requests', selectedRequest.id, 'team_notes', old.id));
      }
      await withPortalTimeout(batch.commit());
      setTeamNotes(updatedNotes);
      setActionAlert(pt('saved')); return true;
    } catch { setActionAlert(pt('saveError')); return false; }
    finally { setIsSavingNotes(false); }
  };


  const handleAddNote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanAuthor = noteAuthor.trim();
    const cleanText = newNoteText.trim();

    if (!cleanAuthor) {
      setActionAlert(pt('required'));
      setTimeout(() => setActionAlert(null), 3500);
      return;
    }
    if (!cleanText) {
      setActionAlert(pt('required'));
      setTimeout(() => setActionAlert(null), 3500);
      return;
    }

    try {
      localStorage.setItem('kraken_last_author', cleanAuthor);
    } catch (e) {
      // ignore
    }

    const nowStr = new Date().toISOString();

    const newNoteObj: TeamNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      author: user?.name || cleanAuthor,
      authorId: user?.uid,
      text: cleanText,
      createdAt: nowStr
    };

    const updated = [newNoteObj, ...teamNotes];
    if (await updateAndPersistTeamNotes(updated, "")) setNewNoteText('');
  };

  const handleStartEditNote = (note: TeamNote) => {
    setEditingNoteId(note.id);
    setEditText(note.text);
    setEditAuthor(note.author);
  };

  const handleSaveEditNote = async (noteId: string) => {
    const cleanText = editText.trim();
    const cleanAuthor = editAuthor.trim();

    if (!cleanText || !cleanAuthor) {
      setActionAlert(pt('required'));
      setTimeout(() => setActionAlert(null), 3500);
      return;
    }

    const nowStr = new Date().toISOString();

    const updated = teamNotes.map(n => {
      if (n.id === noteId) {
        return {
          ...n,
          text: cleanText,
          updatedAt: nowStr
        };
      }
      return n;
    });

    if (await updateAndPersistTeamNotes(updated, "")) setEditingNoteId(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    const updated = teamNotes.filter(n => n.id !== noteId);
    if (await updateAndPersistTeamNotes(updated, "")) setDeletingNoteId(null);
  };

  const extractPostcode = (addr?: string): string => {
    if (!addr) return '';
    const match = addr.match(/\b\d{4}\b/);
    return match ? match[0] : '';
  };

  const handleSendEmail = (req: MaintenanceRequest) => {
      if (!isStaff) return;
      const subject = encodeURIComponent(`${dt.emailDefaultSubject} (${req.service})`);
      const body = encodeURIComponent(
          `${dt.emailGreeting} ${req.client},\n\n` +
          `${dt.emailBodyIntro}\n\n` +
          `• ${dt.emailServiceLabel} ${req.service}\n` +
          `• ${dt.emailDateLabel} ${req.date || '—'}\n` +
          `• ${dt.emailAddressLabel} ${req.address || '—'}\n` +
          `• ${pt(portalAmount(req).confirmed ? 'quotedAmount' : 'amount')} ${portalAmount(req).value?.toLocaleString() ?? '—'}\n\n` +
          `${dt.emailQuestions}\n\n` +
          `${dt.emailSincerely}`
      );
      if (req.email) {
          window.open(`mailto:${encodeURIComponent(req.email)}?subject=${subject}&body=${body}`, '_blank', 'noopener');
          setActionAlert(`SUCCESS: Email client opened to send confirmation to ${req.email}`);
      } else {
          setActionAlert(`WARNING: Request has no registered client email.`);
      }
      setTimeout(() => setActionAlert(null), 4000);
  };

  const handleScheduleService = async (request: MaintenanceRequest) => {
    if (!isStaff) return;
    try { scheduleCalendarEventForKai(request); setActionAlert(pt('calendarDraft')); }
    catch { setActionAlert(pt('calendarInvalid')); }
  };
  const handleGenerateInvoice = (request: MaintenanceRequest) => {
    if (!openInvoiceSummary(request, language)) setActionAlert(pt('saveError'));
  };

  const postcode = selectedRequest.postcode || extractPostcode(selectedRequest.address);

  // Safe extraction of structured service details if available
  const serviceItem = selectedRequest.services && selectedRequest.services.length > 0
      ? selectedRequest.services[0]
      : null;
  const details = serviceItem?.details || {};

  const roomsCount = details.rooms ?? '—';
  const bathroomsCount = details.bathrooms ?? '—';
  const carpetCount = details.carpets ?? '—';
  const balconyCount = details.balconies ?? '—';
  const customDuration = details.customDuration ?? selectedRequest.scheduling?.estimatedDurationHours ?? '—';
  const formatMoney = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value.toFixed(2) : '—';
  const formatRecordedDate = (value: any) => {
    if (!value) return '—';
    const date = new Date(value?.toDate?.() || value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString(language === 'de-CH' ? 'de-CH' : language);
  };
  const evidence = detailEvidence(selectedRequest, user?.uid);
  const financial = evidence.financial;
  const totalAmount = financial.value;
  const travelFee = evidence.travel;
  const surchargePercent = evidence.surchargePercent;
  const calculatedBase = evidence.base;
  const calculatedSurcharge = evidence.surcharge;
  const depositDue = evidence.deposit;
  const verifiedPayment = evidence.verifiedPayment;
  const clientStatus = selectedRequest.status === 'Draft' ? dt.draftLabel : selectedRequest.status === 'Pending' ? dt.statusPending : selectedRequest.status === 'In Progress' ? dt.statusInProgress : selectedRequest.status === 'Completed' ? dt.statusCompleted : selectedRequest.status;
  const clientFiles = (selectedRequest.mediaUrls || []).flatMap((url, index) => {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return [];
    const candidateName = selectedRequest.mediaNames?.[index];
    return [{ url, name: typeof candidateName === 'string' && candidateName.trim() ? candidateName : `${dt.clientUploadedMedia} ${index + 1}` }];
  });

  if (!isStaff) return (
    <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="request-summary-heading" className="kraken-portal kraken-overlay fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 p-3 sm:p-6">
      <section className="kraken-dialog flex max-h-[90dvh] w-full max-w-2xl min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm [overflow-wrap:anywhere]">
        <header className="kraken-dialog-header flex items-start justify-between gap-3 border-b border-[#dce5f0] p-4 sm:p-6">
          <div className="min-w-0"><p className="text-base font-medium text-[#50647c]">{detailText(language, 'summary')}</p><h2 id="request-summary-heading" className="mt-1 text-xl font-semibold text-[#032b59]">{selectedRequest.service}</h2></div>
          <button ref={closeRef} type="button" onClick={() => setSelectedRequest(null)} aria-label={detailText(language, 'close')} className="kraken-control min-h-11 min-w-11 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#50647c] hover:bg-[#f3f7fc] focus-visible:outline-2 focus-visible:outline-blue-600"><X aria-hidden="true" className="h-5 w-5" /></button>
        </header>
        <div className="kraken-dialog-body min-h-0 space-y-5 overflow-y-auto p-4 sm:p-6">
          {actionAlert && <p role="alert" className="rounded-xl bg-[#edf4fd] p-3 text-base text-[#1464ad]">{actionAlert}</p>}
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-[#50647c]">{detailText(language, 'reference')}</dt><dd className="mt-1 font-medium text-[#032b59]">{selectedRequest.id}</dd></div>
            <div><dt className="text-[#50647c]">{detailText(language, 'status')}</dt><dd className="mt-1 font-medium text-[#032b59]">{clientStatus}</dd></div>
            {selectedRequest.date && <div><dt className="text-[#50647c]">{pt('date')}</dt><dd className="mt-1 font-medium text-[#032b59]">{selectedRequest.date}{selectedRequest.time ? ` · ${selectedRequest.time}` : ''}</dd></div>}
            <div><dt className="text-[#50647c]">{pt('client')}</dt><dd className="mt-1 font-medium text-[#032b59]">{selectedRequest.client}</dd></div>
            {selectedRequest.email && <div><dt className="text-[#50647c]">{pt('email')}</dt><dd className="mt-1 font-medium text-[#032b59]">{selectedRequest.email}</dd></div>}
            {selectedRequest.phone && <div><dt className="text-[#50647c]">{pt('phone')}</dt><dd className="mt-1 font-medium text-[#032b59]">{selectedRequest.phone}</dd></div>}
            {selectedRequest.address && <div className="sm:col-span-2"><dt className="text-[#50647c]">{pt('address')}</dt><dd className="mt-1 font-medium text-[#032b59]">{selectedRequest.address}</dd></div>}
            <div className="sm:col-span-2"><dt className="text-[#50647c]">{dt.buildingAccess}</dt><dd className="mt-1 font-medium text-[#032b59]">{detailAccessText(selectedRequest.accessMethod, language)}</dd></div>
          </dl>
          {totalAmount !== undefined && <dl className="space-y-3 rounded-xl border border-[#dce5f0] bg-[#f3f7fc] p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2"><dt className="text-[#50647c]">{pt(financial.confirmed ? 'quotedAmount' : 'amount')}</dt><dd className="font-semibold text-[#032b59]">CHF {formatMoney(totalAmount)}</dd></div>
            {depositDue !== undefined && <div className="flex flex-wrap justify-between gap-2"><dt className="text-[#50647c]">{detailText(language, 'deposit')}</dt><dd className="font-semibold text-[#032b59]">CHF {formatMoney(depositDue)}</dd></div>}
          </dl>}
          {verifiedPayment && <dl className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm"><div className="flex flex-wrap justify-between gap-2"><dt>{detailText(language, 'paid')}</dt><dd className="font-semibold">CHF {formatMoney(evidence.paid)}</dd></div><div><dt className="text-[#50647c]">{dt.txReference}</dt><dd className="font-mono">{selectedRequest.payment?.transactionId}</dd></div></dl>}
          {selectedRequest.notes && <section><h3 className="mb-2 text-lg font-semibold text-[#50647c]">{pt('notes')}</h3><p className="whitespace-pre-wrap text-base text-[#032b59]">{selectedRequest.notes}</p></section>}
          {clientFiles.length > 0 && <section><h3 className="mb-2 text-lg font-semibold text-[#50647c]">{dt.clientUploadedMedia}</h3><ul className="space-y-2">{clientFiles.map((file, index) => <li key={index}><a href={file.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#1464ad] underline"><ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />{file.name}</a></li>)}</ul></section>}
        </div>
        <footer className="kraken-dialog-footer flex flex-wrap gap-2 border-t border-[#dce5f0] p-4 sm:p-6">
          <button type="button" onClick={() => handleGenerateInvoice(selectedRequest)} className="kraken-control min-h-11 min-w-11 min-h-11 rounded-xl bg-[#1464ad] px-4 py-2 text-base font-semibold text-white hover:bg-blue-800">{detailText(language, 'download')}</button>
          <button type="button" onClick={() => setSelectedRequest(null)} className="kraken-control min-h-11 min-w-11 min-h-11 rounded-xl border border-[#dce5f0] px-4 py-2 text-base font-semibold text-[#50647c] hover:bg-[#f3f7fc]">{detailText(language, 'close')}</button>
          {evidence.canDeleteDraft && <button type="button" onClick={() => handleDelete(selectedRequest.id)} className="kraken-control min-h-11 min-w-11 min-h-11 rounded-xl px-4 py-2 text-base font-semibold text-red-700 hover:bg-red-50">{detailText(language, 'deleteDraft')}</button>}
        </footer>
      </section>
    </div>
  );

  return (
    <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={pt('service')} className="kraken-portal kraken-overlay fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 z-[200] overflow-y-auto [overflow-wrap:anywhere]">
        <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            className="kraken-dialog max-h-[92dvh] bg-white border border-[#dce5f0] w-full max-w-6xl rounded-[2rem] md:rounded-3xl shadow-sm overflow-hidden flex flex-col text-[#032b59] font-sans"
        >
            {/* Sticky Nav top bar from Mockup */}
            <div className="kraken-dialog-header px-5 py-4 sm:px-6 border-b border-[#dce5f0] bg-[#f3f7fc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#edf4fd] border border-[#c9dbef] flex items-center justify-center text-[#1464ad] font-semibold text-lg">
                        K
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-sm font-semibold text-[#50647c]">
                        <span className="text-[#032b59] hover:text-[#1464ad] font-semibold ">Kraken PFM</span>
                        <span className="text-[#50647c]">/</span>
                        <span className="text-[#50647c] hover:text-[#032b59] font-semibold transition-all truncate max-w-[120px] sm:max-w-none">{dt.tabRequests}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={() => setSelectedRequest(null)}
                        className="kraken-control min-h-11 min-w-11 px-4 py-2 bg-[#f3f7fc] hover:bg-slate-200/85 text-[#50647c] rounded-lg text-base font-semibold flex items-center gap-1.5 transition-all border border-[#dce5f0]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {dt.backToDashboard}
                    </button>
                </div>
            </div>

            {/* Banner Toast Notification overlay */}
            <AnimatePresence>
                {actionAlert && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 border-b border-blue-100 px-6 py-3 text-blue-700 text-sm font-semibold flex items-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>{actionAlert}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detailed Header layout from Mockup */}
            <div className="p-6 sm:p-8 border-b border-[#dce5f0] bg-[#f3f7fc] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-sm bg-[#f3f7fc] text-[#50647c] px-2 py-0.5 rounded font-semibold border border-[#dce5f0] ">
                            #{selectedRequest.id.toUpperCase()}
                        </span>
                        <span className="text-sm text-[#50647c] font-semibold">
                            {dt.submitted} {selectedRequest.createdAt ? new Date(selectedRequest.createdAt?.toDate?.() || selectedRequest.createdAt).toLocaleDateString() : 'online'}
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-medium text-[#032b59]">
                        {selectedRequest.service.split(' ').map((word, wIdx, arr) => {
                            if (wIdx >= arr.length - 2) {
                                return <span key={wIdx} className="text-[#1464ad] font-semibold">{word} </span>;
                            }
                            return <span key={wIdx}>{word} </span>;
                        })}
                    </h2>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    {selectedRequest.priority === 'High' && (
                        <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-sm font-semibold rounded-full shadow-sm ">
                            {dt.highPriorityBadge}
                        </span>
                    )}
                    {surchargePercent !== undefined && <span className="px-3 py-1 bg-[#edf4fd] text-[#1464ad] border border-[#c9dbef] text-sm font-semibold rounded-full">{dt.regionSurcharge} +{surchargePercent}%</span>}
                </div>
            </div>

            {/* Dual Columns Content Workspace */}
            <div className="kraken-dialog-body min-h-0 flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto scrollbar-thin bg-white">
                {/* LEFT + CENTER COLUMN - 2/3 wide */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1) Inline Pipeline progress steps from mockup */}
                    <div className="bg-[#f3f7fc] rounded-2xl border border-[#dce5f0] overflow-hidden shadow-sm">
                        <div className="flex flex-col sm:flex-row bg-[#f3f7fc]">
                            {([
                                { label: dt.pendingUnscheduled, val: 'Pending', displayVal: dt.filterPending },
                                { label: dt.inProgressAssigned, val: 'In Progress', displayVal: dt.filterInProgress },
                                { label: dt.completedFinalSeal, val: 'Completed', displayVal: dt.filterCompleted }
                            ]).map((st, stepIdx) => {
                                const statuses = ['Pending', 'In Progress', 'Completed'];
                                const currentIdx = statuses.indexOf(selectedRequest.status);
                                const isActive = selectedRequest.status === st.val;
                                const isCompleted = statuses.indexOf(st.val) < currentIdx;

                                return (
                                    <div
                                        key={st.val}
                                        className={`flex-1 flex items-center justify-between px-5 py-4 border-r border-[#dce5f0] last:border-r-0 transition-all ${
                                            isActive ? 'bg-[#edf4fd] border-b-2 border-b-blue-500' :
                                            isCompleted ? 'bg-blue-50 text-blue-700' : 'text-[#50647c]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-lg font-mono text-sm font-semibold flex items-center justify-center border ${
                                                isActive ? 'bg-blue-100 text-[#1464ad] border-[#c9dbef]' :
                                                isCompleted ? 'bg-blue-100 text-blue-700 border-blue-250' : 'bg-slate-200 border-[#dce5f0] text-[#50647c]'
                                            }`}>
                                                {isCompleted ? '✓' : stepIdx + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-semibold leading-none ${
                                                    isActive ? 'text-[#1464ad]' : isCompleted ? 'text-blue-700' : 'text-[#50647c]'
                                                }`}>{st.displayVal}</span>
                                                <span className="text-sm text-[#50647c] mt-0.5">{st.label}</span>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <span className="w-2 h-2 rounded-full bg-[#1464ad] shrink-0" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Dynamic Admin status controls switcher (exclusive to staff/crew ops) */}
                        {isStaff && (
                            <div className="p-4 bg-[#f3f7fc] border-t border-[#dce5f0] flex flex-col sm:flex-row items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-[#50647c] ">
                                    {dt.manualOverride}
                                </span>
                                <div className="grid grid-cols-1 sm:flex gap-2 w-full sm:w-auto">
                                    {([
                                      { key: 'Pending', label: dt.filterPending },
                                      { key: 'In Progress', label: dt.filterInProgress },
                                      { key: 'Completed', label: dt.filterCompleted }
                                    ] as const).map((st) => (
                                        <button
                                            key={st.key}
                                            type="button"
                                            onClick={() => updateStatusDirect(selectedRequest.id, st.key as any)}
                                            className={`kraken-control min-h-11 flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-base font-semibold whitespace-nowrap border transition-all ${
                                                selectedRequest.status === st.key
                                                    ? 'bg-[#1464ad] text-white border-[#1464ad] shadow-md'
                                                    : 'bg-white text-[#50647c] hover:text-slate-850 border-[#dce5f0] hover:bg-[#f3f7fc]'
                                            }`}
                                        >
                                            {st.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3) Detailed Quote calculation inputs (Room metrics etc.) */}
                    <div className="bg-[#f3f7fc] rounded-2xl p-6 border border-[#dce5f0] space-y-4">
                        <h3 className="text-lg font-semibold text-[#50647c] flex items-center gap-2">
                            {dt.quoteParameters}
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-[#dce5f0]">
                                <span className="text-sm text-[#50647c] block font-semibold mb-1.5 flex items-center gap-1">
                                    <Bed className="w-3 h-3 text-[#1464ad]" /> {dt.bedRooms}
                                </span>
                                <span className="text-sm font-semibold text-[#032b59] font-mono">
                                    {roomsCount}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-[#dce5f0]">
                                <span className="text-sm text-[#50647c] block font-semibold mb-1.5 flex items-center gap-1">
                                    <Droplets className="w-3 h-3 text-[#1464ad]" /> {dt.bathrooms}
                                </span>
                                <span className="text-sm font-semibold text-[#032b59] font-mono">
                                    {bathroomsCount}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-[#dce5f0]">
                                <span className="text-sm text-[#50647c] block font-semibold mb-1.5 flex items-center gap-1">
                                    <Layers className="w-3 h-3 text-[#1464ad]" /> {dt.carpetArea}
                                </span>
                                <span className="text-sm font-semibold text-[#032b59] font-mono">
                                    {carpetCount > 0 ? `${carpetCount} m²` : '—'}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-[#dce5f0]">
                                <span className="text-sm text-[#50647c] block font-semibold mb-1.5 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-[#1464ad]" /> {dt.allocatedDuration}
                                </span>
                                <span className="text-sm font-semibold text-[#1464ad] font-mono">
                                    {customDuration} <span className="text-sm font-semibold">{dt.hours}</span>
                                </span>
                            </div>
                        </div>

                        {/* Checked Configuration items visually */}
                        <div className="pt-2">
                            <span className="text-sm text-[#50647c] font-semibold block mb-2">{dt.requestedAddons}</span>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors flex items-center gap-1.5 ${
                                    balconyCount > 0
                                        ? 'bg-[#edf4fd] border-[#c9dbef] text-[#1464ad] font-semibold'
                                        : 'bg-[#f3f7fc] border-[#dce5f0] text-[#50647c]'
                                }`}>
                                    <CheckSquare className="w-3.5 h-3.5" />
                                    {dt.balconiesCleaner} {balconyCount > 0 ? `(${balconyCount})` : ''}
                                </span>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors flex items-center gap-1.5 ${
                                    details.storageUnits
                                        ? 'bg-[#edf4fd] border-[#c9dbef] text-[#1464ad] font-semibold'
                                        : 'bg-[#f3f7fc] border-[#dce5f0] text-[#50647c]'
                                }`}>
                                    <CheckSquare className="w-3.5 h-3.5" />
                                    {dt.cellarGarages}
                                </span>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors flex items-center gap-1.5 ${
                                    details.furniture
                                        ? 'bg-[#edf4fd] border-[#c9dbef] text-[#1464ad] font-semibold'
                                        : 'bg-[#f3f7fc] border-[#dce5f0] text-[#50647c]'
                                }`}>
                                    <CheckSquare className="w-3.5 h-3.5" />
                                    {dt.furnishedCleaning}
                                </span>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors flex items-center gap-1.5 ${
                                    selectedRequest.bookingMode === 'instant'
                                        ? 'bg-[#edf4fd] border-[#c9dbef] text-[#1464ad] font-semibold'
                                        : 'bg-[#f3f7fc] border-[#dce5f0] text-[#50647c]'
                                }`}>
                                    <CheckSquare className="w-3.5 h-3.5" />
                                    {dt.instantBookingPriority}
                                </span>
                            </div>
                        </div>
                    </div>

                    {totalAmount !== undefined && <section className="space-y-3 rounded-2xl border border-[#dce5f0] bg-[#f3f7fc] p-6 text-sm">
                        <h3 className="font-semibold text-[#50647c]">{dt.pricingMatrix}</h3>
                        <dl className="space-y-3">
                            {calculatedBase !== undefined && <div className="flex flex-wrap justify-between gap-2"><dt>{dt.baseQuote}</dt><dd>CHF {formatMoney(calculatedBase)}</dd></div>}
                            {calculatedSurcharge !== undefined && <div className="flex flex-wrap justify-between gap-2"><dt>{dt.regionSurcharge}{surchargePercent !== undefined ? ` (+${surchargePercent}%)` : ''}</dt><dd>CHF {formatMoney(calculatedSurcharge)}</dd></div>}
                            {travelFee !== undefined && <div className="flex flex-wrap justify-between gap-2"><dt>{dt.localTravelFee}</dt><dd>CHF {formatMoney(travelFee)}</dd></div>}
                            <div className="flex flex-wrap justify-between gap-2 font-semibold"><dt>{pt(financial.confirmed ? 'quotedAmount' : 'amount')}</dt><dd>CHF {formatMoney(totalAmount)}</dd></div>
                            {depositDue !== undefined && <div className="flex flex-wrap justify-between gap-2"><dt>{detailText(language, 'deposit')}</dt><dd>CHF {formatMoney(depositDue)}</dd></div>}
                        </dl>
                    </section>}
                    {verifiedPayment && <section className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-sm">
                        <h3 className="font-semibold text-blue-800">{detailText(language, 'paid')}</h3>
                        <dl className="space-y-3"><div className="flex flex-wrap justify-between gap-2"><dt>{pt('amount')}</dt><dd className="font-semibold">CHF {formatMoney(evidence.paid)}</dd></div><div><dt>{dt.txReference}</dt><dd className="font-mono">{selectedRequest.payment?.transactionId}</dd></div>{selectedRequest.payment?.gateway && <div><dt>{dt.securePaymentAudit}</dt><dd>{selectedRequest.payment.gateway}</dd></div>}</dl>
                    </section>}

                    {/* 6) Contact access credentials card */}
                    <div className="bg-[#f3f7fc] rounded-2xl p-6 border border-[#dce5f0] space-y-4">
                        <h3 className="text-lg font-semibold text-[#50647c] ">
                            {dt.operationalContact}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-semibold">
                            <div className="space-y-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#edf4fd] border border-[#c9dbef] flex items-center justify-center text-[#1464ad]">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-[#50647c] block ">{dt.authorizedContact}</span>
                                        <span className="text-[#032b59] font-semibold block">{selectedRequest.client}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#edf4fd] border border-[#c9dbef] flex items-center justify-center text-[#1464ad]">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-[#50647c] block ">{dt.officialEmail}</span>
                                        <span className="text-[#50647c] block normal-case font-semibold">{selectedRequest.email || '—'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#edf4fd] border border-[#c9dbef] flex items-center justify-center text-[#1464ad]">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-[#50647c] block ">{dt.phoneDirect}</span>
                                        <span className="text-[#032b59] font-mono block font-semibold">{selectedRequest.phone || '—'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#edf4fd] border border-[#c9dbef] flex items-center justify-center text-[#1464ad]">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-sm text-[#50647c] block ">{dt.serviceLocation}</span>
                                        <span className="text-[#032b59] font-semibold block truncate text-[#032b59]" title={selectedRequest.address}>{selectedRequest.address || '—'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#edf4fd] border border-[#c9dbef] flex items-center justify-center text-[#1464ad]">
                                        <Key className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-[#50647c] block ">{dt.buildingAccess}</span>
                                        <span className="text-[#032b59] font-semibold block text-[#032b59]">
                                            {detailAccessText(selectedRequest.accessMethod, language)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 7) Scheduling timestamps audit tracker */}
                    <div className="bg-[#f3f7fc] rounded-2xl p-6 border border-[#dce5f0] space-y-4">
                        <h3 className="text-lg font-semibold text-[#50647c] flex items-center gap-2">
                            {dt.serviceTimeline}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold">
                            <div className="bg-white p-4 rounded-xl border border-[#dce5f0]">
                                <span className="text-sm text-[#50647c] block font-semibold mb-1">{dt.serviceDate}</span>
                                <span className="text-[#032b59] font-semibold">{selectedRequest.scheduling?.requestedDate || selectedRequest.date}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-[#dce5f0]">
                                <span className="text-sm text-[#50647c] block font-semibold mb-1">{dt.preferredSlot}</span>
                                <span className="text-[#032b59] font-semibold ">{selectedRequest.scheduling?.preferredTimeWindow || '—'}</span>
                            </div>
                            <div className="bg-[#edf4fd] p-4 rounded-xl border border-[#c9dbef]">
                                <span className="text-sm text-[#1464ad] block font-semibold mb-1">{dt.allocatedDuration}</span>
                                <span className="text-[#032b59] font-mono font-semibold block">{customDuration} {dt.hours}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-[#dce5f0]">
                                <span className="text-sm text-[#50647c] block font-semibold mb-1">{dt.estCompletion}</span>
                                <span className="text-[#1464ad] font-mono font-semibold block">{selectedRequest.scheduling?.estimatedEndTime || '—'}</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-[#dce5f0]">
                            <span className="text-sm text-[#1464ad] font-semibold block ml-1 mb-3">
                                {dt.auditChronology}
                            </span>
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-[#dce5f0] text-sm font-semibold text-[#50647c]">
                                    <span>{dt.submitted}</span>
                                    <span className="font-mono text-[#50647c]">
                                        {formatRecordedDate(selectedRequest.createdAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-[#dce5f0] text-sm font-semibold text-[#50647c]">
                                    <span>{pt('amount')}</span>
                                    <span className="font-mono text-[#1464ad] font-semibold">
                                        {formatRecordedDate(selectedRequest.serverQuote?.createdAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-[#dce5f0] text-sm font-semibold text-[#50647c]">
                                    <span>{dt.securePaymentAudit}</span>
                                    <span className="font-mono text-blue-600 font-semibold">
                                        {verifiedPayment ? formatRecordedDate(selectedRequest.payment?.verifiedAt) : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 8) Media attachments grid dynamically filled */}
                    <div className="bg-[#f3f7fc] rounded-2xl p-6 border border-[#dce5f0] space-y-4">
                        <h3 className="text-lg font-semibold text-[#50647c] text-[#50647c] ">
                            {dt.clientUploadedMedia} ({selectedRequest.mediaUrls ? selectedRequest.mediaUrls.length : 0})
                        </h3>

                        {selectedRequest.mediaUrls && selectedRequest.mediaUrls.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedRequest.mediaUrls.map((url, i) => {
                                    const name = selectedRequest.mediaNames?.[i] || `attachment_${i + 1}`;
                                    const isImg = url.toLowerCase().includes('.jpg') || url.toLowerCase().includes('.png') || url.toLowerCase().includes('.jpeg') || url.toLowerCase().includes('unsplash') || url.includes('image');

                                    return (
                                        <div key={i} className="bg-white rounded-xl border border-[#dce5f0] overflow-hidden group flex flex-col justify-between">
                                            {isImg ? (
                                                <div className="h-32 w-full overflow-hidden relative bg-[#f3f7fc] flex items-center justify-center">
                                                    <img
                                                        src={url}
                                                        alt={name}
                                                        referrerPolicy="no-referrer"
                                                        className="w-full h-full object-cover transition-transform"
                                                        onError={(e) => {
                                                            (e.target as HTMLElement).style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                             ) : (
                                                <div className="h-32 w-full bg-[#f3f7fc] flex flex-col items-center justify-center text-[#50647c] gap-2">
                                                    <FileText className="w-8 h-8 text-[#1464ad]" />
                                                    <span className="text-sm font-mono">{dt.attachment} #{i+1}</span>
                                                </div>
                                            )}
                                            <div className="p-3 bg-[#f3f7fc] border-t border-[#dce5f0] flex items-center justify-between gap-2">
                                                <span className="text-sm font-semibold text-[#50647c] truncate" title={name}>{name}</span>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewFile({
                                                            url,
                                                            name,
                                                            title: `${dt.attachment} • ${selectedRequest.client}`
                                                        })}
                                                        className="kraken-control min-h-11 min-w-11 px-2.5 py-1.5 bg-[#1464ad] hover:bg-[#1464ad] text-white rounded-lg text-base font-semibold flex items-center gap-1 cursor-pointer"
                                                        title={dt.view}
                                                    >
                                                        {dt.view}
                                                        <Eye className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => downloadFileSafely(url, name)}
                                                        className="kraken-control min-h-11 min-w-11 px-2.5 py-1.5 bg-[#1464ad] hover:bg-[#0c4f92] text-white rounded-lg text-base font-semibold flex items-center gap-1 cursor-pointer"
                                                        title={dt.download}
                                                    >
                                                        {dt.download}
                                                        <Download className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-[#f3f7fc] border border-[#dce5f0] rounded-xl p-8 text-center text-sm text-[#50647c] font-semibold">
                                {dt.noMediaAttached}
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT SIDEBAR COLUMN - 1/3 wide */}
                <div className="space-y-6">

                    {/* Operational Action Panel from Mockup */}
                    <div className="bg-[#f3f7fc] rounded-2xl p-6 border border-[#dce5f0] space-y-5">
                        <h3 className="text-lg font-semibold text-[#50647c] ">
                            {dt.interactiveCrewCommands}
                        </h3>

                        <div className="space-y-3 flex flex-col">
                            <button
                                type="button"
                                hidden={!isStaff} onClick={() => handleSendEmail(selectedRequest)}
                                className="kraken-control min-h-11 w-full px-4 py-2.5 bg-white hover:bg-[#edf4fd] text-[#50647c] hover:text-[#1464ad] border border-[#dce5f0] hover:border-[#1464ad] rounded-xl text-base font-semibold flex items-center justify-between transition-all"
                            >
                                {dt.sendCostConfirmation}
                                <Send className="w-4 h-4 shrink-0 text-[#50647c] group-hover:text-[#1464ad]" />
                            </button>

                            <button
                                type="button"
                                hidden={!isStaff} onClick={() => handleScheduleService(selectedRequest)}
                                className="kraken-control min-h-11 w-full px-4 py-2.5 bg-white hover:bg-[#edf4fd] text-[#50647c] hover:text-[#1464ad] border border-[#dce5f0] hover:border-[#1464ad] rounded-xl text-base font-semibold flex items-center justify-between transition-all"
                            >
                                {pt('calendarDraft').split('.')[0]}
                                <Calendar className="w-4 h-4 shrink-0 text-[#50647c]" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleGenerateInvoice(selectedRequest)}
                                className="kraken-control min-h-11 w-full px-4 py-2.5 bg-white hover:bg-[#edf4fd] text-[#50647c] hover:text-[#1464ad] border border-[#dce5f0] hover:border-[#1464ad] rounded-xl text-base font-semibold flex items-center justify-between transition-all"
                            >
                                {pt('draftInvoice')}
                                <FileText className="w-4 h-4 shrink-0 text-[#50647c]" />
                            </button>
                        </div>
                    </div>

                    {/* Admin notes are visible to staff only. */}
                    {isStaff && <div className="bg-[#f3f7fc] rounded-2xl p-5 sm:p-6 border border-[#dce5f0] space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-[#50647c] flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-[#1464ad]" />
                                {dt.internalNotesHeading}
                            </h3>
                            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1464ad]">
                                {teamNotes.length} {teamNotes.length === 1 ? 'nota' : 'notas'}
                            </span>
                        </div>

                        {/* Form to add a new note */}
                        <form onSubmit={handleAddNote} className="kraken-form bg-white rounded-xl p-3.5 border border-[#dce5f0] shadow-sm space-y-3">
                            <div className="space-y-2">
                                <div>
                                    <label htmlFor="detailinspectormodal-field-1" className="kraken-label text-sm font-semibold text-[#50647c] block mb-1">
                                        Nombre del Autor *
                                    </label>
                                    <div className="relative">
                                        <User className="w-3.5 h-3.5 text-[#50647c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input id="detailinspectormodal-field-1"
                                            type="text"
                                            value={noteAuthor}
                                            readOnly
                                            onChange={(e) => setNoteAuthor(e.target.value)}
                                            placeholder="Ej. Marco / Kai / Staff"
                                            className="kraken-field w-full pl-8 pr-3 py-1.5 bg-[#f3f7fc] rounded-lg text-base text-[#032b59] font-semibold border border-[#dce5f0] focus:border-[#1464ad] focus:bg-white outline-none placeholder-slate-400"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="detailinspectormodal-field-2" className="kraken-label text-sm font-semibold text-[#50647c] block mb-1">
                                        Escribir Nota *
                                    </label>
                                    <textarea id="detailinspectormodal-field-2"
                                        rows={2}
                                        value={newNoteText}
                                        onChange={(e) => setNewNoteText(e.target.value)}
                                        placeholder="Escribe la nota o instrucción..."
                                        className="kraken-field w-full p-2.5 bg-[#f3f7fc] rounded-lg text-base text-[#032b59] font-medium border border-[#dce5f0] focus:border-[#1464ad] focus:bg-white outline-none placeholder-slate-400 leading-relaxed resize-y"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSavingNotes || notesLoading || notesError || !newNoteText.trim() || !noteAuthor.trim()}
                                className="kraken-control min-h-11 w-full py-2 bg-[#032b59] text-white rounded-xl text-base font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSavingNotes ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Guardar Nota</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {notesLoading && <p role="status" className="text-base">{pt('loading')}</p>}
                        {notesError && <div role="alert" className="text-sm text-red-700"><p>{pt('loadError')}</p><button type="button" onClick={loadNotes} className="kraken-control min-h-11 min-w-11 underline">{pt('retry')}</button></div>}
                        {/* List of saved notes */}
                        <div className="space-y-2.5 pt-1">
                            <span className="text-sm font-semibold text-[#50647c] block">
                                Historial de Notas
                            </span>

                            {teamNotes.length === 0 ? (
                                <div className="bg-white/80 rounded-xl p-4 text-center border border-dashed border-[#dce5f0]">
                                    <FileText className="w-5 h-5 text-[#50647c] mx-auto mb-1.5" />
                                    <p className="text-base text-[#50647c] font-medium">
                                        No hay notas guardadas aún.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                                    {teamNotes.map((note) => {
                                        const isEditing = editingNoteId === note.id;

                                        return (
                                            <div
                                                key={note.id}
                                                className="bg-white rounded-xl p-3 border border-[#dce5f0] shadow-sm space-y-2 hover:border-[#c9dbef] transition-all text-sm"
                                            >
                                                {/* Header */}
                                                <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-[#dce5f0]">
                                                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                                        <span className="inline-flex items-center gap-1 bg-[#edf4fd] text-[#1464ad] font-semibold text-sm px-2 py-0.5 rounded border border-[#c9dbef] truncate max-w-[110px]">
                                                            <User className="w-3 h-3 text-[#1464ad] shrink-0" />
                                                            {note.author}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#50647c] bg-[#f3f7fc] px-1.5 py-0.5 rounded border border-[#dce5f0]">
                                                            <Clock className="w-2.5 h-2.5 text-[#50647c]" />
                                                            {note.createdAt}
                                                        </span>
                                                    </div>

                                                    {!isEditing && (
                                                        <div className="flex items-center gap-0.5 shrink-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                  setDeletingNoteId(null);
                                                                  handleStartEditNote(note);
                                                                }}
                                                                title="Editar nota"
                                                                className="kraken-control min-h-11 min-w-11 p-1 text-[#50647c] hover:text-[#1464ad] hover:bg-[#edf4fd] rounded transition-colors cursor-pointer"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeletingNoteId(deletingNoteId === note.id ? null : note.id)}
                                                                title="Borrar nota"
                                                                className="kraken-control min-h-11 min-w-11 p-1 text-[#50647c] hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Inline Deletion Confirmation */}
                                                {deletingNoteId === note.id && (
                                                    <div className="bg-rose-50 rounded-lg p-2.5 border border-rose-200 flex flex-wrap items-center justify-between gap-2">
                                                        <span className="text-sm font-semibold text-rose-700">
                                                            ¿Seguro que deseas eliminar esta nota?
                                                        </span>
                                                        <div className="flex items-center gap-1.5 ml-auto">
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeletingNoteId(null)}
                                                                className="kraken-control min-h-11 min-w-11 px-2 py-0.5 bg-white text-[#50647c] hover:bg-[#f3f7fc] rounded text-base font-semibold border border-[#dce5f0]"
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteNote(note.id)}
                                                                disabled={isSavingNotes}
                                                                className="kraken-control min-h-11 min-w-11 px-2.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-[#032b59] rounded text-base font-semibold shadow-xs flex items-center gap-1"
                                                            >
                                                                <Trash2 className="w-2.5 h-2.5" />
                                                                Sí, borrar
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Body */}
                                                {isEditing ? (
                                                    <div className="space-y-2 pt-1">
                                                        <div>
                                                            <label htmlFor="detailinspectormodal-field-3" className="kraken-label text-sm font-semibold text-[#50647c] block mb-0.5">
                                                                Autor
                                                            </label>
                                                            <input id="detailinspectormodal-field-3"
                                                                type="text"
                                                                value={editAuthor}
                                                                readOnly
                                                                onChange={(e) => setEditAuthor(e.target.value)}
                                                                className="kraken-field w-full p-1.5 bg-[#f3f7fc] rounded-lg text-base font-semibold text-[#032b59] border border-[#dce5f0] focus:border-[#1464ad] outline-none"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="detailinspectormodal-field-4" className="kraken-label text-sm font-semibold text-[#50647c] block mb-0.5">
                                                                Texto
                                                            </label>
                                                            <textarea id="detailinspectormodal-field-4"
                                                                rows={2}
                                                                value={editText}
                                                                onChange={(e) => setEditText(e.target.value)}
                                                                className="kraken-field w-full p-2 bg-[#f3f7fc] rounded-lg text-base font-medium text-[#032b59] border border-[#dce5f0] focus:border-[#1464ad] outline-none leading-relaxed"
                                                            />
                                                        </div>
                                                        <div className="flex justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditingNoteId(null)}
                                                                className="kraken-control min-h-11 min-w-11 px-2.5 py-1 bg-[#f3f7fc] hover:bg-slate-200 text-[#50647c] rounded text-base font-semibold "
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSaveEditNote(note.id)}
                                                                disabled={isSavingNotes}
                                                                className="kraken-control min-h-11 min-w-11 px-3 py-1 bg-[#1464ad] hover:bg-[#1464ad] text-white rounded text-base font-semibold flex items-center gap-1"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Guardar
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-base text-[#50647c] font-medium whitespace-pre-wrap leading-relaxed pt-0.5">
                                                        {note.text}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    }

                    {/* Danger Zone: Delete Option */}
                    {isStaff && !Object.hasOwn(selectedRequest, 'payment') && (
                        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 transition-all text-center">
                            <span className="text-sm font-semibold text-rose-600 block mb-2">{dt.dangerZone}</span>
                            <button
                                type="button"
                                onClick={() => handleDelete(selectedRequest.id)}
                                className="kraken-control min-h-11 py-1.5 w-full bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white rounded-xl text-base font-semibold transition-all border border-rose-200"
                            >
                                {dt.deleteRequestLedger}
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="kraken-dialog-footer p-4 sm:p-5 bg-[#f3f7fc] border-t border-[#dce5f0] border-[#dce5f0] flex gap-4 justify-between items-center mt-auto">
                <span className="text-sm text-[#50647c] font-semibold hidden sm:inline-block">
                    Kraken PFM
                </span>
                <button
                     type="button"
                     onClick={() => setSelectedRequest(null)}
                     className="kraken-control min-h-11 min-w-11 bg-[#1464ad] hover:bg-[#1464ad] text-white px-8 py-2.5 rounded-xl text-base font-semibold transition-all ml-auto shadow-sm"
                >
                    {dt.dismissView}
                </button>
            </div>

        </motion.div>

        <FilePreviewModal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          fileUrl={previewFile?.url || ''}
          fileName={previewFile?.name || ''}
          title={previewFile?.title}
        />
    </div>
  );
};
