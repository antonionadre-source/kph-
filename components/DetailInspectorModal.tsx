import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../i18n';
import { getDashboardTranslation } from './dashboardTranslations';
import { FilePreviewModal } from './FilePreviewModal';
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
    <div role="dialog" aria-modal="true" aria-labelledby="request-summary-heading" className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 p-3 sm:p-6">
      <section className="flex max-h-[90dvh] w-full max-w-2xl min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-xl [overflow-wrap:anywhere]">
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 p-4 sm:p-6">
          <div className="min-w-0"><p className="text-sm font-medium text-slate-600">{detailText(language, 'summary')}</p><h2 id="request-summary-heading" className="mt-1 text-xl font-bold text-slate-900">{selectedRequest.service}</h2></div>
          <button type="button" onClick={() => setSelectedRequest(null)} aria-label={detailText(language, 'close')} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"><X aria-hidden="true" className="h-5 w-5" /></button>
        </header>
        <div className="min-h-0 space-y-5 overflow-y-auto p-4 sm:p-6">
          {actionAlert && <p role="alert" className="rounded-xl bg-blue-50 p-3 text-sm text-blue-900">{actionAlert}</p>}
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-slate-500">{detailText(language, 'reference')}</dt><dd className="mt-1 font-medium text-slate-900">{selectedRequest.id}</dd></div>
            <div><dt className="text-slate-500">{detailText(language, 'status')}</dt><dd className="mt-1 font-medium text-slate-900">{clientStatus}</dd></div>
            {selectedRequest.date && <div><dt className="text-slate-500">{pt('date')}</dt><dd className="mt-1 font-medium text-slate-900">{selectedRequest.date}{selectedRequest.time ? ` · ${selectedRequest.time}` : ''}</dd></div>}
            <div><dt className="text-slate-500">{pt('client')}</dt><dd className="mt-1 font-medium text-slate-900">{selectedRequest.client}</dd></div>
            {selectedRequest.email && <div><dt className="text-slate-500">{pt('email')}</dt><dd className="mt-1 font-medium text-slate-900">{selectedRequest.email}</dd></div>}
            {selectedRequest.phone && <div><dt className="text-slate-500">{pt('phone')}</dt><dd className="mt-1 font-medium text-slate-900">{selectedRequest.phone}</dd></div>}
            {selectedRequest.address && <div className="sm:col-span-2"><dt className="text-slate-500">{pt('address')}</dt><dd className="mt-1 font-medium text-slate-900">{selectedRequest.address}</dd></div>}
            <div className="sm:col-span-2"><dt className="text-slate-500">{dt.buildingAccess}</dt><dd className="mt-1 font-medium text-slate-900">{detailAccessText(selectedRequest.accessMethod, language)}</dd></div>
          </dl>
          {totalAmount !== undefined && <dl className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-600">{pt(financial.confirmed ? 'quotedAmount' : 'amount')}</dt><dd className="font-bold text-slate-900">CHF {formatMoney(totalAmount)}</dd></div>
            {depositDue !== undefined && <div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-600">{detailText(language, 'deposit')}</dt><dd className="font-bold text-slate-900">CHF {formatMoney(depositDue)}</dd></div>}
          </dl>}
          {verifiedPayment && <dl className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm"><div className="flex flex-wrap justify-between gap-2"><dt>{detailText(language, 'paid')}</dt><dd className="font-bold">CHF {formatMoney(evidence.paid)}</dd></div><div><dt className="text-slate-600">{dt.txReference}</dt><dd className="font-mono">{selectedRequest.payment?.transactionId}</dd></div></dl>}
          {selectedRequest.notes && <section><h3 className="mb-2 text-sm font-semibold text-slate-600">{pt('notes')}</h3><p className="whitespace-pre-wrap text-sm text-slate-900">{selectedRequest.notes}</p></section>}
          {clientFiles.length > 0 && <section><h3 className="mb-2 text-sm font-semibold text-slate-600">{dt.clientUploadedMedia}</h3><ul className="space-y-2">{clientFiles.map((file, index) => <li key={index}><a href={file.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-blue-700 underline"><ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />{file.name}</a></li>)}</ul></section>}
        </div>
        <footer className="flex flex-wrap gap-2 border-t border-slate-200 p-4 sm:p-6">
          <button type="button" onClick={() => handleGenerateInvoice(selectedRequest)} className="min-h-11 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">{detailText(language, 'download')}</button>
          <button type="button" onClick={() => setSelectedRequest(null)} className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">{detailText(language, 'close')}</button>
          {evidence.canDeleteDraft && <button type="button" onClick={() => handleDelete(selectedRequest.id)} className="min-h-11 rounded-xl px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">{detailText(language, 'deleteDraft')}</button>}
        </footer>
      </section>
    </div>
  );

  return (
    <div role="dialog" aria-modal="true" aria-label={pt('service')} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 z-[200] overflow-y-auto [overflow-wrap:anywhere]">
        <motion.div 
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            className="bg-white border border-slate-200 w-full max-w-6xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col text-slate-800 font-sans my-8"
        >
            {/* Sticky Nav top bar from Mockup */}
            <div className="px-6 py-4 sm:px-8 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-lg">
                        K
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
                        <span className="text-slate-800 hover:text-blue-600 font-bold tracking-tight">Kraken PFM</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-500 hover:text-slate-800 font-bold transition-all truncate max-w-[120px] sm:max-w-none">{dt.tabRequests}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button 
                        type="button"
                        onClick={() => setSelectedRequest(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200/85 active:scale-95 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border border-slate-200"
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
                        className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 text-emerald-700 text-xs font-semibold flex items-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>{actionAlert}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detailed Header layout from Mockup */}
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black tracking-wide border border-slate-200 uppercase">
                            #{selectedRequest.id.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">
                            {dt.submitted} {selectedRequest.createdAt ? new Date(selectedRequest.createdAt?.toDate?.() || selectedRequest.createdAt).toLocaleDateString() : 'online'}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900">
                        {selectedRequest.service.split(' ').map((word, wIdx, arr) => {
                            if (wIdx >= arr.length - 2) {
                                return <span key={wIdx} className="text-blue-600 font-extrabold">{word} </span>;
                            }
                            return <span key={wIdx}>{word} </span>;
                        })}
                    </h1>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    {selectedRequest.priority === 'High' && (
                        <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_4px_12px_rgba(239,68,68,0.06)] animate-pulse">
                            {dt.highPriorityBadge}
                        </span>
                    )}
                    {surchargePercent !== undefined && <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-black uppercase tracking-widest rounded-full">{dt.regionSurcharge} +{surchargePercent}%</span>}
                </div>
            </div>

            {/* Dual Columns Content Workspace */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto max-h-[65vh] scrollbar-thin bg-white">
                {/* LEFT + CENTER COLUMN - 2/3 wide */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* 1) Inline Pipeline progress steps from mockup */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="flex flex-col sm:flex-row bg-slate-100/50">
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
                                        className={`flex-1 flex items-center justify-between px-5 py-4 border-r border-slate-200/80 last:border-r-0 transition-all ${
                                            isActive ? 'bg-blue-50 border-b-2 border-b-blue-500' : 
                                            isCompleted ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-lg font-mono text-[10px] font-black flex items-center justify-center border ${
                                                isActive ? 'bg-blue-100 text-blue-700 border-blue-250' :
                                                isCompleted ? 'bg-emerald-100 text-emerald-700 border-emerald-250' : 'bg-slate-200 border-slate-300 text-slate-500'
                                            }`}>
                                                {isCompleted ? '✓' : stepIdx + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] uppercase tracking-widest font-black leading-none ${
                                                    isActive ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                                                }`}>{st.displayVal}</span>
                                                <span className="text-[9px] text-slate-550 mt-0.5">{st.label}</span>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Dynamic Admin status controls switcher (exclusive to staff/crew ops) */}
                        {isStaff && (
                            <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                    {dt.manualOverride}
                                </span>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    {([
                                      { key: 'Pending', label: dt.filterPending },
                                      { key: 'In Progress', label: dt.filterInProgress },
                                      { key: 'Completed', label: dt.filterCompleted }
                                    ] as const).map((st) => (
                                        <button
                                            key={st.key}
                                            type="button"
                                            onClick={() => updateStatusDirect(selectedRequest.id, st.key as any)}
                                            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all ${
                                                selectedRequest.status === st.key 
                                                    ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                                                    : 'bg-white text-slate-550 hover:text-slate-850 border-slate-200 hover:bg-slate-50'
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
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                            {dt.quoteParameters}
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold mb-1.5 flex items-center gap-1">
                                    <Bed className="w-3 h-3 text-blue-600" /> {dt.bedRooms}
                                </span>
                                <span className="text-sm font-black text-slate-800 font-mono">
                                    {roomsCount}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold mb-1.5 flex items-center gap-1">
                                    <Droplets className="w-3 h-3 text-blue-600" /> {dt.bathrooms}
                                </span>
                                <span className="text-sm font-black text-slate-800 font-mono">
                                    {bathroomsCount}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold mb-1.5 flex items-center gap-1">
                                    <Layers className="w-3 h-3 text-blue-600" /> {dt.carpetArea}
                                </span>
                                <span className="text-sm font-black text-slate-800 font-mono">
                                    {carpetCount > 0 ? `${carpetCount} m²` : '—'}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold mb-1.5 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-blue-600" /> {dt.allocatedDuration}
                                </span>
                                <span className="text-sm font-black text-blue-600 font-mono">
                                    {customDuration} <span className="text-[10px] uppercase font-bold">{dt.hours}</span>
                                </span>
                            </div>
                        </div>

                        {/* Checked Configuration items visually */}
                        <div className="pt-2">
                            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mb-2">{dt.requestedAddons}</span>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1.5 ${
                                    balconyCount > 0 
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold' 
                                        : 'bg-slate-100 border-slate-200/80 text-slate-400'
                                }`}>
                                    <CheckSquare className="w-3.5 h-3.5" /> 
                                    {dt.balconiesCleaner} {balconyCount > 0 ? `(${balconyCount})` : ''}
                                </span>
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1.5 ${
                                    details.storageUnits 
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold' 
                                        : 'bg-slate-100 border-slate-200/80 text-slate-400'
                                }`}>
                                    <CheckSquare className="w-3.5 h-3.5" /> 
                                    {dt.cellarGarages}
                                </span>
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1.5 ${
                                    details.furniture 
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold' 
                                        : 'bg-slate-100 border-slate-200/80 text-slate-400'
                                }`}>
                                    <CheckSquare className="w-3.5 h-3.5" /> 
                                    {dt.furnishedCleaning}
                                </span>
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1.5 ${
                                    selectedRequest.bookingMode === 'instant' 
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold' 
                                        : 'bg-slate-100 border-slate-200/80 text-slate-400'
                                }`}>
                                    <CheckSquare className="w-3.5 h-3.5" /> 
                                    {dt.instantBookingPriority}
                                </span>
                            </div>
                        </div>
                    </div>

                    {totalAmount !== undefined && <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm">
                        <h3 className="font-bold text-slate-700">{dt.pricingMatrix}</h3>
                        <dl className="space-y-3">
                            {calculatedBase !== undefined && <div className="flex flex-wrap justify-between gap-2"><dt>{dt.baseQuote}</dt><dd>CHF {formatMoney(calculatedBase)}</dd></div>}
                            {calculatedSurcharge !== undefined && <div className="flex flex-wrap justify-between gap-2"><dt>{dt.regionSurcharge}{surchargePercent !== undefined ? ` (+${surchargePercent}%)` : ''}</dt><dd>CHF {formatMoney(calculatedSurcharge)}</dd></div>}
                            {travelFee !== undefined && <div className="flex flex-wrap justify-between gap-2"><dt>{dt.localTravelFee}</dt><dd>CHF {formatMoney(travelFee)}</dd></div>}
                            <div className="flex flex-wrap justify-between gap-2 font-bold"><dt>{pt(financial.confirmed ? 'quotedAmount' : 'amount')}</dt><dd>CHF {formatMoney(totalAmount)}</dd></div>
                            {depositDue !== undefined && <div className="flex flex-wrap justify-between gap-2"><dt>{detailText(language, 'deposit')}</dt><dd>CHF {formatMoney(depositDue)}</dd></div>}
                        </dl>
                    </section>}
                    {verifiedPayment && <section className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm">
                        <h3 className="font-bold text-emerald-800">{detailText(language, 'paid')}</h3>
                        <dl className="space-y-3"><div className="flex flex-wrap justify-between gap-2"><dt>{pt('amount')}</dt><dd className="font-bold">CHF {formatMoney(evidence.paid)}</dd></div><div><dt>{dt.txReference}</dt><dd className="font-mono">{selectedRequest.payment?.transactionId}</dd></div>{selectedRequest.payment?.gateway && <div><dt>{dt.securePaymentAudit}</dt><dd>{selectedRequest.payment.gateway}</dd></div>}</dl>
                    </section>}

                    {/* 6) Contact access credentials card */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">
                            {dt.operationalContact}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                            <div className="space-y-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-400 block uppercase">{dt.authorizedContact}</span>
                                        <span className="text-slate-800 font-bold block">{selectedRequest.client}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-400 block uppercase">{dt.officialEmail}</span>
                                        <span className="text-slate-700 block normal-case font-bold">{selectedRequest.email || '—'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-400 block uppercase">{dt.phoneDirect}</span>
                                        <span className="text-slate-800 font-mono block font-bold">{selectedRequest.phone || '—'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[9px] text-slate-400 block uppercase">{dt.serviceLocation}</span>
                                        <span className="text-slate-800 font-bold block truncate text-slate-800" title={selectedRequest.address}>{selectedRequest.address || '—'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                        <Key className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-400 block uppercase">{dt.buildingAccess}</span>
                                        <span className="text-slate-800 font-bold block uppercase text-slate-800">
                                            {detailAccessText(selectedRequest.accessMethod, language)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 7) Scheduling timestamps audit tracker */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                            {dt.serviceTimeline}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <span className="text-[9px] text-slate-450 uppercase tracking-widest block font-black mb-1">{dt.serviceDate}</span>
                                <span className="text-slate-800 font-bold">{selectedRequest.scheduling?.requestedDate || selectedRequest.date}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <span className="text-[9px] text-slate-450 uppercase tracking-widest block font-black mb-1">{dt.preferredSlot}</span>
                                <span className="text-slate-800 font-bold uppercase">{selectedRequest.scheduling?.preferredTimeWindow || '—'}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-150">
                                <span className="text-[9px] text-blue-700 uppercase tracking-widest block font-black mb-1">{dt.allocatedDuration}</span>
                                <span className="text-slate-800 font-mono font-bold block">{customDuration} {dt.hours}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <span className="text-[9px] text-slate-450 uppercase tracking-widest block font-black mb-1">{dt.estCompletion}</span>
                                <span className="text-blue-600 font-mono font-bold block">{selectedRequest.scheduling?.estimatedEndTime || '—'}</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/80">
                            <span className="text-[9px] uppercase tracking-widest text-blue-700 font-black block ml-1 mb-3">
                                {dt.auditChronology}
                            </span>
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-500">
                                    <span>{dt.submitted}</span>
                                    <span className="font-mono text-slate-700">
                                        {formatRecordedDate(selectedRequest.createdAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-500">
                                    <span>{pt('amount')}</span>
                                    <span className="font-mono text-blue-600 font-bold">
                                        {formatRecordedDate(selectedRequest.serverQuote?.createdAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-500">
                                    <span>{dt.securePaymentAudit}</span>
                                    <span className="font-mono text-emerald-600 font-bold">
                                        {verifiedPayment ? formatRecordedDate(selectedRequest.payment?.verifiedAt) : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 8) Media attachments grid dynamically filled */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-550 text-slate-500 tracking-widest">
                            {dt.clientUploadedMedia} ({selectedRequest.mediaUrls ? selectedRequest.mediaUrls.length : 0})
                        </h3>
                        
                        {selectedRequest.mediaUrls && selectedRequest.mediaUrls.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedRequest.mediaUrls.map((url, i) => {
                                    const name = selectedRequest.mediaNames?.[i] || `attachment_${i + 1}`;
                                    const isImg = url.toLowerCase().includes('.jpg') || url.toLowerCase().includes('.png') || url.toLowerCase().includes('.jpeg') || url.toLowerCase().includes('unsplash') || url.includes('image');
                                    
                                    return (
                                        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden group flex flex-col justify-between">
                                            {isImg ? (
                                                <div className="h-32 w-full overflow-hidden relative bg-slate-100 flex items-center justify-center">
                                                    <img 
                                                        src={url} 
                                                        alt={name} 
                                                        referrerPolicy="no-referrer"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                                        onError={(e) => {
                                                            (e.target as HTMLElement).style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                             ) : (
                                                <div className="h-32 w-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-2">
                                                    <FileText className="w-8 h-8 text-blue-600" />
                                                    <span className="text-[10px] font-mono">{dt.attachment} #{i+1}</span>
                                                </div>
                                            )}
                                            <div className="p-3 bg-slate-50/85 border-t border-slate-100 flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-bold text-slate-500 truncate" title={name}>{name}</span>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button 
                                                        type="button"
                                                        onClick={() => setPreviewFile({
                                                            url,
                                                            name,
                                                            title: `${dt.attachment} • ${selectedRequest.client}`
                                                        })}
                                                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                                                        title={dt.view}
                                                    >
                                                        {dt.view}
                                                        <Eye className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => downloadFileSafely(url, name)}
                                                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 cursor-pointer"
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
                            <div className="bg-slate-100 border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400 font-semibold">
                                {dt.noMediaAttached}
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT SIDEBAR COLUMN - 1/3 wide */}
                <div className="space-y-6">
                    
                    {/* Operational Action Panel from Mockup */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-5">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">
                            {dt.interactiveCrewCommands}
                        </h3>
                        
                        <div className="space-y-3 flex flex-col">
                            <button 
                                type="button"
                                hidden={!isStaff} onClick={() => handleSendEmail(selectedRequest)}
                                className="w-full px-4 py-2.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-between transition-all"
                            >
                                {dt.sendCostConfirmation}
                                <Send className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-blue-600" />
                            </button>

                            <button 
                                type="button"
                                hidden={!isStaff} onClick={() => handleScheduleService(selectedRequest)}
                                className="w-full px-4 py-2.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-between transition-all"
                            >
                                {pt('calendarDraft').split('.')[0]}
                                <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                            </button>

                            <button 
                                type="button"
                                onClick={() => handleGenerateInvoice(selectedRequest)}
                                className="w-full px-4 py-2.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-between transition-all"
                            >
                                {pt('draftInvoice')}
                                <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Admin notes are visible to staff only. */}
                    {isStaff && <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black uppercase text-slate-700 tracking-widest flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                {dt.internalNotesHeading}
                            </h3>
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                {teamNotes.length} {teamNotes.length === 1 ? 'nota' : 'notas'}
                            </span>
                        </div>

                        {/* Form to add a new note */}
                        <form onSubmit={handleAddNote} className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-sm space-y-3">
                            <div className="space-y-2">
                                <div>
                                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                                        Nombre del Autor *
                                    </label>
                                    <div className="relative">
                                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input 
                                            type="text" 
                                            value={noteAuthor}
                                            readOnly
                                            onChange={(e) => setNoteAuthor(e.target.value)}
                                            placeholder="Ej. Marco / Kai / Staff"
                                            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 rounded-lg text-xs text-slate-800 font-bold border border-slate-200 focus:border-blue-500 focus:bg-white outline-none placeholder-slate-400"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                                        Escribir Nota *
                                    </label>
                                    <textarea 
                                        rows={2}
                                        value={newNoteText}
                                        onChange={(e) => setNewNoteText(e.target.value)}
                                        placeholder="Escribe la nota o instrucción..."
                                        className="w-full p-2.5 bg-slate-50 rounded-lg text-xs text-slate-800 font-medium border border-slate-200 focus:border-blue-500 focus:bg-white outline-none placeholder-slate-400 leading-relaxed resize-y"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isSavingNotes || notesLoading || notesError || !newNoteText.trim() || !noteAuthor.trim()}
                                className="w-full py-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

                        {notesLoading && <p role="status" className="text-sm">{pt('loading')}</p>}
                        {notesError && <div role="alert" className="text-sm text-red-700"><p>{pt('loadError')}</p><button type="button" onClick={loadNotes} className="underline">{pt('retry')}</button></div>}
                        {/* List of saved notes */}
                        <div className="space-y-2.5 pt-1">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                                Historial de Notas
                            </span>

                            {teamNotes.length === 0 ? (
                                <div className="bg-white/80 rounded-xl p-4 text-center border border-dashed border-slate-200">
                                    <FileText className="w-5 h-5 text-slate-300 mx-auto mb-1.5" />
                                    <p className="text-[11px] text-slate-400 font-medium">
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
                                                className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2 hover:border-blue-200 transition-all text-xs"
                                            >
                                                {/* Header */}
                                                <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-100">
                                                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded border border-blue-100 truncate max-w-[110px]">
                                                            <User className="w-3 h-3 text-blue-600 shrink-0" />
                                                            {note.author}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                            <Clock className="w-2.5 h-2.5 text-slate-400" />
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
                                                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => setDeletingNoteId(deletingNoteId === note.id ? null : note.id)}
                                                                title="Borrar nota"
                                                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Inline Deletion Confirmation */}
                                                {deletingNoteId === note.id && (
                                                    <div className="bg-rose-50 rounded-lg p-2.5 border border-rose-200 flex flex-wrap items-center justify-between gap-2">
                                                        <span className="text-[10px] font-bold text-rose-700">
                                                            ¿Seguro que deseas eliminar esta nota?
                                                        </span>
                                                        <div className="flex items-center gap-1.5 ml-auto">
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeletingNoteId(null)}
                                                                className="px-2 py-0.5 bg-white text-slate-600 hover:bg-slate-100 rounded text-[9px] font-bold uppercase tracking-wider border border-slate-200"
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteNote(note.id)}
                                                                disabled={isSavingNotes}
                                                                className="px-2.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1"
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
                                                            <label className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">
                                                                Autor
                                                            </label>
                                                            <input 
                                                                type="text" 
                                                                value={editAuthor}
                                                                readOnly
                                                                onChange={(e) => setEditAuthor(e.target.value)}
                                                                className="w-full p-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-800 border border-slate-200 focus:border-blue-500 outline-none"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">
                                                                Texto
                                                            </label>
                                                            <textarea 
                                                                rows={2}
                                                                value={editText}
                                                                onChange={(e) => setEditText(e.target.value)}
                                                                className="w-full p-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 border border-slate-200 focus:border-blue-500 outline-none leading-relaxed"
                                                            />
                                                        </div>
                                                        <div className="flex justify-end gap-1.5">
                                                            <button 
                                                                type="button"
                                                                onClick={() => setEditingNoteId(null)}
                                                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider"
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleSaveEditNote(note.id)}
                                                                disabled={isSavingNotes}
                                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Guardar
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-700 font-medium whitespace-pre-wrap leading-relaxed pt-0.5">
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
                            <span className="text-[9px] uppercase tracking-widest font-black text-rose-600 block mb-2">{dt.dangerZone}</span>
                            <button 
                                type="button"
                                onClick={() => handleDelete(selectedRequest.id)}
                                className="py-1.5 w-full bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-rose-200"
                            >
                                {dt.deleteRequestLedger}
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-205 border-slate-200 flex gap-4 justify-between items-center mt-auto">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline-block">
                    Kraken PFM
                </span>
                <button 
                     type="button"
                     onClick={() => setSelectedRequest(null)}
                     className="bg-blue-600 hover:bg-blue-500 hover:scale-[1.01] active:scale-95 text-white px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ml-auto shadow-[0_4px_20px_rgba(59,130,246,0.15)]"
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
