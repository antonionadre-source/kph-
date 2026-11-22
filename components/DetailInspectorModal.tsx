import React, { useState, useEffect } from 'react';
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
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, sanitizeFirestoreData } from './firebase';
import { detectZone } from './ConsultationPage';

export interface TeamNote {
    id: string;
    author: string;
    text: string;
    createdAt: string;
    updatedAt?: string;
}

export type MaintenanceRequest = {
    id: string;
    client: string;
    service: string;
    date: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Draft';
    priority: 'Low' | 'Medium' | 'High';
    amount: number;
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
  const [teamNotes, setTeamNotes] = useState<TeamNote[]>([]);
  const [noteAuthor, setNoteAuthor] = useState(() => {
    try {
      return localStorage.getItem('kraken_last_author') || '';
    } catch {
      return '';
    }
  });
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; title?: string } | null>(null);

  useEffect(() => {
    let notesList: TeamNote[] = [];

    if (selectedRequest.teamNotes && Array.isArray(selectedRequest.teamNotes) && selectedRequest.teamNotes.length > 0) {
      notesList = selectedRequest.teamNotes;
    } else if (selectedRequest.id) {
      try {
        const localKey = `kraken_team_notes_${selectedRequest.id}`;
        const stored = localStorage.getItem(localKey);
        if (stored) {
          notesList = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Error reading team notes from local storage:', e);
      }
    }

    if (notesList.length === 0 && selectedRequest.notes && selectedRequest.notes.trim()) {
      notesList = [{
        id: 'legacy_note_1',
        author: 'Sistema / Equipo',
        text: selectedRequest.notes,
        createdAt: selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : 'Fecha registrada'
      }];
    }

    setTeamNotes(notesList);
    setNewNoteText('');
    setEditingNoteId(null);
  }, [selectedRequest]);

  const updateAndPersistTeamNotes = async (updatedNotes: TeamNote[], successMsg: string) => {
    setIsSavingNotes(true);
    try {
      setTeamNotes(updatedNotes);

      const summaryText = updatedNotes
        .map(n => `[${n.author} - ${n.createdAt}]: ${n.text}`)
        .join('\n\n');

      const updatedList = requests.map(req => {
        if (req.id === selectedRequest.id) {
          const updated = { 
            ...req, 
            teamNotes: updatedNotes, 
            notes: summaryText 
          };
          if (selectedRequest?.id === req.id) {
            setSelectedRequest(updated);
          }
          return updated;
        }
        return req;
      });
      setRequests(updatedList);

      try {
        localStorage.setItem(`kraken_team_notes_${selectedRequest.id}`, JSON.stringify(updatedNotes));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }

      try {
        await setDoc(doc(db, 'maintenance_requests', selectedRequest.id), sanitizeFirestoreData({
          teamNotes: updatedNotes,
          notes: summaryText,
          updatedAt: serverTimestamp()
        }), { merge: true });
      } catch (dbErr) {
        console.warn('Firestore sync note warning:', dbErr);
      }

      setActionAlert(successMsg);
      setTimeout(() => setActionAlert(null), 3500);
    } catch (err) {
      console.error('Error persisting notes:', err);
      setActionAlert("Error al guardar las notas.");
      setTimeout(() => setActionAlert(null), 3500);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleAddNote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanAuthor = noteAuthor.trim();
    const cleanText = newNoteText.trim();

    if (!cleanAuthor) {
      setActionAlert("Por favor, introduce tu nombre como autor de la nota.");
      setTimeout(() => setActionAlert(null), 3500);
      return;
    }
    if (!cleanText) {
      setActionAlert("Por favor, escribe el texto de la nota antes de guardar.");
      setTimeout(() => setActionAlert(null), 3500);
      return;
    }

    try {
      localStorage.setItem('kraken_last_author', cleanAuthor);
    } catch (e) {
      // ignore
    }

    const nowStr = new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newNoteObj: TeamNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      author: cleanAuthor,
      text: cleanText,
      createdAt: nowStr
    };

    const updated = [newNoteObj, ...teamNotes];
    await updateAndPersistTeamNotes(updated, "Nota guardada e historial actualizado correctamente.");
    setNewNoteText('');
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
      setActionAlert("El autor y la nota no pueden estar vacíos.");
      setTimeout(() => setActionAlert(null), 3500);
      return;
    }

    const nowStr = new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const updated = teamNotes.map(n => {
      if (n.id === noteId) {
        return {
          ...n,
          author: cleanAuthor,
          text: cleanText,
          updatedAt: nowStr
        };
      }
      return n;
    });

    await updateAndPersistTeamNotes(updated, "Nota editada correctamente.");
    setEditingNoteId(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    const updated = teamNotes.filter(n => n.id !== noteId);
    await updateAndPersistTeamNotes(updated, "Nota eliminada correctamente.");
    setDeletingNoteId(null);
  };

  const extractPostcode = (addr?: string): string => {
    if (!addr) return '8000';
    const match = addr.match(/\b\d{4}\b/);
    return match ? match[0] : '8000';
  };

  const handleSendEmail = (req: MaintenanceRequest) => {
      const subject = encodeURIComponent(`${dt.emailDefaultSubject} (${req.service})`);
      const body = encodeURIComponent(
          `${dt.emailGreeting} ${req.client},\n\n` +
          `${dt.emailBodyIntro}\n\n` +
          `• ${dt.emailServiceLabel} ${req.service}\n` +
          `• ${dt.emailDateLabel} ${req.date || '—'}\n` +
          `• ${dt.emailAddressLabel} ${req.address || '—'}\n` +
          `• ${dt.emailAmountLabel} CHF ${(req.amount || 0).toLocaleString()}\n\n` +
          `${dt.emailQuestions}\n\n` +
          `${dt.emailSincerely}`
      );
      if (req.email) {
          window.open(`mailto:${req.email}?subject=${subject}&body=${body}`, '_blank');
          setActionAlert(`SUCCESS: Email client opened to send confirmation to ${req.email}`);
      } else {
          setActionAlert(`WARNING: Request has no registered client email.`);
      }
      setTimeout(() => setActionAlert(null), 4000);
  };

  const handleScheduleService = async (req: MaintenanceRequest) => {
      try {
          await updateDoc(doc(db, 'maintenance_requests', req.id), {
              status: 'In Progress',
              scheduledAt: serverTimestamp(),
              updatedAt: serverTimestamp()
          });

          const updatedList = requests.map(r => {
              if (r.id === req.id) {
                  const updated = { ...r, status: 'In Progress' };
                  if (selectedRequest?.id === req.id) {
                      setSelectedRequest(updated);
                  }
                  return updated;
              }
              return r;
          });
          setRequests(updatedList);

          // Trigger Outlook Calendar event & .ics download for kai@krakenpfm.ch with 1h reminder
          scheduleCalendarEventForKai(req);

          setActionAlert(`SUCCESS: Event scheduled in Outlook for kai@krakenpfm.ch with 1h reminder. Synchronized in Firebase.`);
      } catch (err) {
          console.error('Error actualizando programación:', err);
          setActionAlert(`ERROR: No se pudo guardar la programación en Firebase.`);
      }
      setTimeout(() => setActionAlert(null), 5000);
  };

  const handleGenerateInvoice = (req: MaintenanceRequest) => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
          setActionAlert("WARNING: Por favor permita las ventanas emergentes para ver/guardar la factura PDF.");
          return;
      }

      const invoiceNum = `INV-${req.id.substring(0, 8).toUpperCase()}`;
      const dateStr = new Date().toLocaleDateString(language.startsWith('de') ? 'de-CH' : language.startsWith('fr') ? 'fr-CH' : language.startsWith('it') ? 'it-CH' : language.startsWith('es') ? 'es-ES' : 'en-CH', { year: 'numeric', month: 'long', day: 'numeric' });

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${dt.pdfInvoiceTitle} ${invoiceNum} - Kraken PFM</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
            .logo span { color: #0284c7; }
            .inv-title { font-size: 28px; font-weight: 800; color: #0284c7; text-align: right; }
            .details { display: flex; justify-content: space-between; margin-bottom: 30px; line-height: 1.6; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; width: 45%; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #0f172a; color: white; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            .total-row { font-weight: 800; font-size: 16px; background: #f0f9ff; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            .btn-print { background: #0284c7; color: white; border: none; padding: 12px 24px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
            @media print { .btn-print { display: none; } }
          </style>
        </head>
        <body>
          <button class="btn-print" onclick="window.print()">${dt.pdfPrintBtn}</button>
          
          <div class="header">
            <div class="logo">KRAKEN <span>PFM</span></div>
            <div class="inv-title">${dt.pdfInvoiceHeader}<br><span style="font-size:14px; color:#64748b;">${invoiceNum}</span></div>
          </div>

          <div class="details">
            <div class="box">
              <strong>${dt.pdfIssuer}</strong><br>
              Kraken Properties & Facilities Management<br>
              Bahnhofstrasse 42, 8001 Zürich<br>
              Suiza • CHE-109.823.411 TVA<br>
              kai@krakenpfm.ch
            </div>
            <div class="box">
              <strong>${dt.pdfClient}</strong><br>
              ${req.client}<br>
              ${req.email || dt.pdfNoEmail}<br>
              ${req.address || dt.pdfAddressOnRecord}<br>
              <strong>${dt.pdfIssueDate}</strong> ${dateStr}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>${dt.pdfServiceDesc}</th>
                <th>${dt.pdfDate}</th>
                <th style="text-align:right;">${dt.pdfAmount}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${req.service}</strong><br><span style="font-size:12px; color:#64748b;">${dt.pdfPropertyMaint}</span></td>
                <td>${req.date || dateStr}</td>
                <td style="text-align:right;">CHF ${(req.amount || 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2" style="text-align:right;">${dt.pdfTotalVatInc}</td>
                <td style="text-align:right; color:#0284c7;">CHF ${(req.amount || 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            ${dt.pdfFooterIban}<br>
            ${dt.pdfFooterDocNotice}
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setActionAlert(`SUCCESS: Invoice PDF generated and ready to print/save.`);
      setTimeout(() => setActionAlert(null), 4000);
  };

  const postcode = extractPostcode(selectedRequest.address);
  const zoneInfo = detectZone(postcode);
  
  // Safe extraction of structured service details if available
  const serviceItem = selectedRequest.services && selectedRequest.services.length > 0 
      ? selectedRequest.services[0] 
      : null;
  const details = serviceItem?.details || {};
  
  const roomsCount = details.rooms || 3;
  const bathroomsCount = details.bathrooms || 1;
  const carpetCount = details.carpets || 0;
  const balconyCount = details.balconies || 0;
  const customDuration = details.customDuration || selectedRequest.scheduling?.estimatedDurationHours || 4;
  
  // Dynamic financial calculations backported from the main total amount
  const totalAmount = selectedRequest.amount || 600;
  const travelFee = zoneInfo.travelBase || 45;
  const remainingTotal = Math.max(0, totalAmount - travelFee);
  const surchargePercent = zoneInfo.surchargePercent || 8;
  
  // math formula: totalAmount = (base * multiplier) + travelFee
  const multiplier = zoneInfo.multiplier || 1.08;
  const calculatedBase = Math.round((remainingTotal / multiplier) * 100) / 100;
  const calculatedSurcharge = Math.round((remainingTotal - calculatedBase) * 100) / 100;
  const depositDue = Math.round((totalAmount * 0.15) * 100) / 100;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 z-[200] overflow-y-auto">
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
                            {dt.submitted} {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString() : 'online'}
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
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-black uppercase tracking-widest rounded-full">
                        {zoneInfo.label} {dt.surchargeApplied} ×{zoneInfo.multiplier}
                    </span>
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

                    {/* 2) Zürich +22% / Other +8% zone multiplier alert bar */}
                    <div className="bg-blue-50 px-6 py-4 rounded-xl border border-blue-150 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] uppercase font-black tracking-widest text-blue-700 block mb-0.5">{dt.billingPostalZone} {zoneInfo.label}</span>
                            <p className="text-xs text-slate-500 truncate font-medium">
                                Postcode <strong className="text-slate-805">{postcode}</strong>: {dt.surchargeApplied} (+{surchargePercent}%).
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="text-sm font-black text-blue-600 font-mono">CHF {calculatedSurcharge.toFixed(2)}</span>
                            <span className="text-[9px] block text-slate-400 font-bold uppercase">{dt.zoneExtra}</span>
                        </div>
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

                    {/* 4) Financial price breakdown ledger */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                            {dt.pricingMatrix}
                        </h3>
                        
                        <div className="space-y-3 font-medium text-xs">
                            <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
                                <span className="text-slate-500">{dt.baseQuote}</span>
                                <span className="font-mono text-slate-705 text-slate-800">CHF {calculatedBase.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
                                <span className="text-slate-500">{dt.regionSurcharge} (+{surchargePercent}%)</span>
                                <span className="font-mono text-slate-705 text-slate-800">+ CHF {calculatedSurcharge.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
                                <span className="text-slate-500">{dt.localTravelFee}</span>
                                <span className="font-mono text-slate-705 text-slate-800">+ CHF {travelFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 text-sm bg-blue-50 px-4 rounded-xl border border-blue-150">
                                <span className="text-slate-700 font-bold">{dt.totalEstimated}</span>
                                <span className="font-mono font-black text-blue-600">CHF {totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-t border-slate-200 border-dashed text-[10px] text-emerald-600 font-bold px-4">
                                <span>{dt.depositPayment}</span>
                                <span className="font-mono">CHF {depositDue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 5) Visual VISA card & stripe reference integration */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">
                                {dt.securePaymentAudit}
                            </h3>
                            <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-250 border-emerald-200 px-3 py-1 rounded-full">
                                {selectedRequest.payment?.status || 'Authorized'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            {/* Micro Visa Card Rendering */}
                            <div className="bg-gradient-to-br from-[#1d273a] to-[#0d121c] p-5 rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl h-36 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black tracking-widest text-[#60a5fa] uppercase">Payrexx Platform</span>
                                        <span className="text-xs font-bold font-mono tracking-widest text-slate-300 mt-1">
                                            •••• •••• •••• {selectedRequest.payment?.last4 || '4242'}
                                        </span>
                                    </div>
                                    <span className="text-slate-100 font-bold text-sm italic font-mono uppercase">
                                        {selectedRequest.payment?.method || 'VISA'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[7px] text-slate-550 uppercase tracking-widest font-black">{dt.authorizedCardholder}</span>
                                        <span className="text-[11px] font-black tracking-tight text-white uppercase truncate max-w-[130px]">
                                            {selectedRequest.payment?.cardholderName || selectedRequest.client}
                                        </span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[7px] text-slate-550 uppercase tracking-widest font-black">{dt.holdDeposit}</span>
                                        <span className="text-xs font-mono font-black text-emerald-400">CHF {depositDue.toFixed(2)}</span>
                                    </div>
                                </div>
                                <span className="absolute -bottom-8 -right-8 w-16 h-16 bg-blue-500/10 rounded-full blur-xl" />
                            </div>

                            {/* Payment details list */}
                            <div className="space-y-3 text-xs font-semibold">
                                <div>
                                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">{dt.txReference}</span>
                                    <span className="font-mono text-blue-600 word-break text-[10px] break-all block mt-0.5">
                                        {selectedRequest.payment?.transactionId || `tx_payrexx_7w9q8f${selectedRequest.id.substring(0, 6)}`}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">{dt.gatewayProvider}</span>
                                    <span className="text-slate-600 block mt-0.5 uppercase font-bold">
                                        {selectedRequest.payment?.gateway || 'Payrexx AG'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                        <span className="text-slate-800 font-bold block truncate text-slate-800" title={selectedRequest.address}>{selectedRequest.address || 'Zürich Area, Switzerland'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                        <Key className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-400 block uppercase">{dt.buildingAccess}</span>
                                        <span className="text-slate-800 font-bold block uppercase text-slate-800">
                                            {selectedRequest.accessMethod === 'keys' ? '🔑 Keybox / code collection' :
                                             selectedRequest.accessMethod === 'onSite' ? '🤝 Person on-site meet' :
                                             '🔑 Left at mailbox / Code registered'}
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
                                <span className="text-slate-800 font-bold uppercase">{selectedRequest.scheduling?.preferredTimeWindow || '08:00 - 12:00'}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-150">
                                <span className="text-[9px] text-blue-700 uppercase tracking-widest block font-black mb-1">{dt.allocatedDuration}</span>
                                <span className="text-slate-800 font-mono font-bold block">{customDuration} {dt.hours}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <span className="text-[9px] text-slate-450 uppercase tracking-widest block font-black mb-1">{dt.estCompletion}</span>
                                <span className="text-blue-600 font-mono font-bold block">{selectedRequest.scheduling?.estimatedEndTime || 'Flexible'}</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/80">
                            <span className="text-[9px] uppercase tracking-widest text-blue-700 font-black block ml-1 mb-3">
                                {dt.auditChronology}
                            </span>
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-500">
                                    <span>1) Booking submission transmitted</span>
                                    <span className="font-mono text-slate-700">
                                        {selectedRequest.timestamps?.formSubmittedAt ? new Date(selectedRequest.timestamps.formSubmittedAt).toLocaleString() : new Date().toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-500">
                                    <span>2) Automated price matrix verification</span>
                                    <span className="font-mono text-blue-600 font-bold">
                                        {selectedRequest.timestamps?.priceCalculatedAt ? new Date(selectedRequest.timestamps.priceCalculatedAt).toLocaleString() : new Date().toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-500">
                                    <span>3) Payrexx AG pre-auth capture check</span>
                                    <span className="font-mono text-emerald-600 font-bold">
                                        {selectedRequest.timestamps?.depositCapturedAt ? new Date(selectedRequest.timestamps.depositCapturedAt).toLocaleString() : 'Authorized'}
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
                    
                    {/* Summary Estimate Badge Widget from Mockup */}
                    <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-2xl p-6 border border-indigo-700/35 shadow-lg relative overflow-hidden text-white">
                        <span className="text-[10px] font-black uppercase text-indigo-200 tracking-widest block mb-1">{dt.dynamicTotalEstimate}</span>
                        <div className="text-3xl font-black text-white font-mono mt-2 mb-4">
                            CHF {totalAmount.toFixed(2)}
                        </div>
                        <div className="border-t border-indigo-500/30 pt-4 space-y-2.5 text-xs font-semibold">
                            <div className="flex justify-between text-indigo-200">
                                <span>{dt.baseQuote}</span>
                                <span className="font-mono text-white">CHF {calculatedBase.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-indigo-200">
                                <span>{zoneInfo.label} (+{surchargePercent}%)</span>
                                <span className="font-mono text-white">CHF {calculatedSurcharge.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-indigo-200">
                                <span>{dt.localTravelFee}</span>
                                <span className="font-mono text-cyan-200">CHF {travelFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-indigo-500/30 pt-3 text-[#a5f3fc] font-bold text-[11px]">
                                <span>{dt.depositPayment}</span>
                                <span className="font-mono">CHF {depositDue.toFixed(2)}</span>
                            </div>
                        </div>
                        <span className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                    </div>

                    {/* Operational Action Panel from Mockup */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-5">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">
                            {dt.interactiveCrewCommands}
                        </h3>
                        
                        <div className="space-y-3 flex flex-col">
                            <button 
                                type="button"
                                onClick={() => handleSendEmail(selectedRequest)}
                                className="w-full px-4 py-2.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-between transition-all"
                            >
                                {dt.sendCostConfirmation}
                                <Send className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-blue-600" />
                            </button>

                            <button 
                                type="button"
                                onClick={() => handleScheduleService(selectedRequest)}
                                className="w-full px-4 py-2.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-between transition-all"
                            >
                                {dt.scheduleOutlookBtn}
                                <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                            </button>

                            <button 
                                type="button"
                                onClick={() => handleGenerateInvoice(selectedRequest)}
                                className="w-full px-4 py-2.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-between transition-all"
                            >
                                {dt.generateInvoiceBtn}
                                <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Admin notes memo text area */}
                    <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
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
                                disabled={isSavingNotes || !newNoteText.trim() || !noteAuthor.trim()}
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

                    {/* Danger Zone: Delete Option */}
                    {(isStaff || selectedRequest.status === 'Pending') && (
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
