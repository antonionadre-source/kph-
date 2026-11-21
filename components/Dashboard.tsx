import { postWebhook } from './leadWebhook';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { FilePreviewModal } from './FilePreviewModal';
import { downloadFileSafely } from './fileUtils';
import { scheduleCalendarEventForKai } from './calendarUtils';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from './icons';
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
  Clock
} from 'lucide-react';
import { useAuth } from './Auth';
import { db, sanitizeFirestoreData } from './firebase';
import { portalText } from './portalText';
import { portalActionText, portalOptionLabel } from './portalPresentation';
import { portalQueryPlan, portalAmount, mergePortalRecords, PORTAL_PAGE_SIZE, type PortalCollection } from './portalRecords';
import { withPortalTimeout } from './portalIdentity';
import { openInvoiceSummary, escapeHtml } from './invoiceDocument';
import { detectZone } from '../src/domain/pricing';
import { DetailInspectorModal } from './DetailInspectorModal';
import { getDashboardTranslation } from './dashboardTranslations';
import { companyLogoUrl } from '../assets';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp, orderBy, limit, startAfter, type QueryDocumentSnapshot, type QueryConstraint
} from 'firebase/firestore';

const portalHeadings: Record<string, { title: string; subtitle: string; logout: string; loggingOut: string; logoutError: string; refresh: string }> = {
  de: { title: 'Meine Anfragen', subtitle: 'Kundenportal', logout: 'Abmelden', loggingOut: 'Abmeldung läuft…', logoutError: 'Abmelden fehlgeschlagen. Bitte erneut versuchen.', refresh: 'Aktualisieren' },
  en: { title: 'My requests', subtitle: 'Client dashboard', logout: 'Sign out', loggingOut: 'Signing out…', logoutError: 'Unable to sign out. Please retry.', refresh: 'Refresh' },
  fr: { title: 'Mes demandes', subtitle: 'Espace client', logout: 'Se déconnecter', loggingOut: 'Déconnexion…', logoutError: 'Déconnexion impossible. Réessayez.', refresh: 'Actualiser' },
  it: { title: 'Le mie richieste', subtitle: 'Portale clienti', logout: 'Esci', loggingOut: 'Disconnessione…', logoutError: 'Impossibile uscire. Riprova.', refresh: 'Aggiorna' },
  es: { title: 'Mis solicitudes', subtitle: 'Panel de clientes', logout: 'Cerrar sesión', loggingOut: 'Cerrando sesión…', logoutError: 'No se pudo cerrar sesión. Reinténtalo.', refresh: 'Actualizar' },
  pt: { title: 'Os meus pedidos', subtitle: 'Painel de clientes', logout: 'Terminar sessão', loggingOut: 'A terminar sessão…', logoutError: 'Não foi possível terminar sessão. Tente novamente.', refresh: 'Atualizar' },
};

// Maintenance & Cleaning Request Datastructure
type MaintenanceRequest = {
    id: string;
    client: string;
    service: string;
    date: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Draft';
    priority: 'Low' | 'Medium' | 'High';
    amount: number;
    estimatedAmount?: number;
    serverQuote?: Record<string, any>;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
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
    checkout?: unknown;
    createdAt?: any;
    updatedAt?: any;
};

// Candidate Job Application Datastructure
type JobApplication = {
    id: string;
    name: string;
    phone: string;
    position: string;
    region: string;
    permit: string;
    startDate: string;
    pensum: string;
    certificates?: string;
    languages?: string;
    message?: string;
    cvName?: string;
    cvData?: string;
    cvType?: string;
    status: 'Pending' | 'Reviewed' | 'Contacted' | 'Hired' | 'Rejected';
    createdAt?: any;
    updatedAt?: any;
};

// Contact Message Datastructure
type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    language?: string;
    status: 'new' | 'done';
    createdAt?: any;
};

const Dashboard: React.FC = () => {
  const { language } = useTranslation();
  const dt = getDashboardTranslation(language);
  const { user, resendVerification, refreshUser, logout } = useAuth();
  const pt = (key: Parameters<typeof portalText>[1]) => portalText(language, key);
  const heading = portalHeadings[language.split('-')[0]] || portalHeadings.de;

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const logoutPending = useRef(false);

  const handleLogout = async () => {
    if (logoutPending.current) return;
    logoutPending.current = true;
    setLoggingOut(true); setLogoutError(false);
    try { await logout(); }
    catch { setLogoutError(true); }
    finally { logoutPending.current = false; setLoggingOut(false); }
  };

  // States
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminNotesText, setAdminNotesText] = useState('');
  const [actionAlert, setActionAlert] = useState<string | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailPreviewMode, setEmailPreviewMode] = useState(false);
  const [selectedEmailRequest, setSelectedEmailRequest] = useState<MaintenanceRequest | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [emailCC, setEmailCC] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailHistoryFilter, setEmailHistoryFilter] = useState<'all'|'sent'|'pending'|'error'>('all');
  const [emailHistoryClientFilter, setEmailHistoryClientFilter] = useState('');
  const [showEmailHistory, setShowEmailHistory] = useState(false);
  const [emailHistory, setEmailHistory] = useState<Array<{id:string;requestId:string;clientName:string;clientEmail:string;subject:string;sentAt:string;status:'sent'|'pending'|'error';amount:string;}>>(() => {
    try { return JSON.parse(localStorage.getItem(`kraken_email_history_${user?.uid || ''}`) || '[]'); } catch { return []; }
  });
  const [confirmationStatuses, setConfirmationStatuses] = useState<Record<string,'confirmed'|'pending'|'none'>>(() => {
    try { return JSON.parse(localStorage.getItem(`kraken_confirm_status_${user?.uid || ''}`) || '{}'); } catch { return {}; }
  });
  useEffect(() => {
    if (selectedRequest) {
      setAdminNotesText(selectedRequest.notes || '');
    } else {
      setAdminNotesText('');
    }
  }, [selectedRequest]);

  // Custom richer Request input
  const [newRequest, setNewRequest] = useState({
      client: '',
      email: '',
      phone: '',
      address: '',
      service: '',
      date: '',
      priority: 'Medium' as 'Low' | 'Medium' | 'High',
      amount: '',
      notes: '',
      mediaUrlString: '' // parsed as array
  });

  // Navigation & Tab States: 'requests' | 'careers' | 'messages'
  const [activeTab, setActiveTab] = useState<'requests' | 'careers' | 'messages'>('requests');
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(false);
  const [selectedJobApp, setSelectedJobApp] = useState<JobApplication | null>(null);
  const [careerSearchQuery, setCareerSearchQuery] = useState('');
  const [careerFilterStatus, setCareerFilterStatus] = useState('all');
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; title?: string } | null>(null);

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [messageFilterStatus, setMessageFilterStatus] = useState<'all' | 'new' | 'done'>('all');

  const isStaff = user?.isStaff === true && user.emailVerified === true;
  const isPageLoading = activeTab === 'requests' ? loading : activeTab === 'careers' ? loadingCareers : loadingMessages;

  const [loadErrors, setLoadErrors] = useState<Record<string, boolean>>({});
  const [hasMore, setHasMore] = useState<Record<string, boolean>>({});
  const cursors = useRef<Record<string, QueryDocumentSnapshot | null>>({});
  const loadVersions = useRef<Record<string, number>>({});
  const collectionByTab: Record<string, PortalCollection> = { requests: 'maintenance_requests', careers: 'job_applications', messages: 'contact_messages' };

  const fetchPortalPage = async (tab: 'requests' | 'careers' | 'messages', append = false) => {
    if (!user?.uid || (tab === 'messages' && !isStaff)) return;
    const generation = (loadVersions.current[tab] || 0) + 1;
    loadVersions.current[tab] = generation;
    const status = tab === 'requests' ? filterStatus : tab === 'careers' ? careerFilterStatus : messageFilterStatus;
    const setBusy = tab === 'requests' ? setLoading : tab === 'careers' ? setLoadingCareers : setLoadingMessages;
    setBusy(true); setLoadErrors(previous => ({ ...previous, [tab]: false }));
    try {
      const plan = portalQueryPlan(collectionByTab[tab], user.uid, isStaff, status);
      const constraints: QueryConstraint[] = plan.filters.map(([field, value]) => where(field, '==', value));
      constraints.push(orderBy(plan.orderBy[0], plan.orderBy[1]), limit(plan.limit));
      if (append && cursors.current[tab]) constraints.push(startAfter(cursors.current[tab]));
      const snapshot = await withPortalTimeout(getDocs(query(collection(db, plan.collection), ...constraints)));
      if (generation !== loadVersions.current[tab]) return;
      cursors.current[tab] = snapshot.docs[snapshot.docs.length - 1] || null;
      setHasMore(previous => ({ ...previous, [tab]: snapshot.size === PORTAL_PAGE_SIZE }));
      const records = snapshot.docs.map(record => {
        const data = record.data();
        return {
          ...data, id: record.id, client: String(data.client || data.clientName || ''), name: String(data.name || ''),
          position: String(data.position || ''), region: String(data.region || ''), permit: String(data.permit || ''), startDate: String(data.startDate || ''), pensum: String(data.pensum || ''), subject: String(data.subject || ''), message: String(data.message || ''),
          email: String(data.email || ''), service: String(data.service || ''), date: String(data.date || ''),
          phone: String(data.phone || ''), address: String(data.address || ''), notes: String(data.notes || ''),
          cvData: String(data.cvUrl || data.cvData || ''), cvName: String(data.cvName || ''), cvType: String(data.cvType || ''),
          amount: Number.isFinite(Number(data.amount)) ? Number(data.amount) : 0,
          mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
          mediaNames: Array.isArray(data.mediaNames) ? data.mediaNames : [],
          status: String(data.status || (tab === 'messages' ? 'new' : 'Pending')), priority: String(data.priority || 'Medium'),
        };
      });
      if (tab === 'requests') setRequests(previous => append ? mergePortalRecords(previous, records as MaintenanceRequest[]) : records as MaintenanceRequest[]);
      if (tab === 'careers') setJobApplications(previous => append ? mergePortalRecords(previous, records as JobApplication[]) : records as JobApplication[]);
      if (tab === 'messages') setContactMessages(previous => append ? mergePortalRecords(previous, records as ContactMessage[]) : records as ContactMessage[]);
    } catch {
      if (generation === loadVersions.current[tab]) setLoadErrors(previous => ({ ...previous, [tab]: true }));
    } finally { if (generation === loadVersions.current[tab]) setBusy(false); }
  };

  const handleMessageStatusToggle = async (id: string, status: 'new' | 'done') => {
    if (!isStaff) return;
    try {
      const nextStatus = status === 'new' ? 'done' : 'new';
      await withPortalTimeout(updateDoc(doc(db, 'contact_messages', id), { status: nextStatus, updatedAt: serverTimestamp() }));
      setContactMessages(previous => previous.map(record => record.id === id ? { ...record, status: nextStatus } : record));
      setActionAlert(pt('saved'));
    } catch { setActionAlert(pt('saveError')); }
  };
  const handleJobAppStatusChange = async (id: string, status: JobApplication['status']) => {
    if (!isStaff) return;
    try {
      await withPortalTimeout(updateDoc(doc(db, 'job_applications', id), { status, updatedAt: serverTimestamp() }));
      setJobApplications(previous => previous.map(record => record.id === id ? { ...record, status } : record));
      setSelectedJobApp(previous => previous?.id === id ? { ...previous, status } : previous);
      setActionAlert(pt('saved'));
    } catch { setActionAlert(pt('saveError')); }
  };
  useEffect(() => {
    for (const tab of ['requests', 'careers', 'messages']) loadVersions.current[tab] = (loadVersions.current[tab] || 0) + 1;
    try {
      setEmailHistory(JSON.parse(localStorage.getItem(`kraken_email_history_${user?.uid || ''}`) || '[]'));
      setConfirmationStatuses(JSON.parse(localStorage.getItem(`kraken_confirm_status_${user?.uid || ''}`) || '{}'));
    } catch { setEmailHistory([]); setConfirmationStatuses({}); }
    cursors.current = {}; setRequests([]); setJobApplications([]); setContactMessages([]); setSelectedRequest(null); setSelectedJobApp(null);
    setLoadErrors({}); setHasMore({});
    if (!isStaff && activeTab === 'messages') setActiveTab('requests');
  }, [user?.uid, isStaff]);
  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    fetchPortalPage(activeTab);
    return () => { loadVersions.current[activeTab] = (loadVersions.current[activeTab] || 0) + 1; };
  }, [user?.uid, isStaff, activeTab, filterStatus, careerFilterStatus, messageFilterStatus]);

  // Actions
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!user) return;

      const targetRequest = requests.find(r => r.id === id);
      if (targetRequest && !isStaff && (targetRequest.checkout || !['Draft', 'Pending'].includes(targetRequest.status))) {
        alert("Locked for Operations Security: Requests that are already 'In Progress' or 'Completed' cannot be cancelled or deleted online. Please contact our operational staff at kai@krakenpfm.ch for immediate assistance.");
        return;
      }

      if (!confirm("Are you sure you want to remove this service request? This operation cannot be undone.")) {
         return;
      }

      try {
          await deleteDoc(doc(db, 'maintenance_requests', id));
          setRequests(requests.filter(req => req.id !== id));
          if (selectedRequest?.id === id) {
              setSelectedRequest(null);
          }
      } catch (error) {
          setActionAlert(pt('saveError'));
      }
  };

  const handleStatusChange = async (id: string, currentStatus: 'Pending' | 'In Progress' | 'Completed', e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!user) return;

      // Client cannot transition status tiers at all, this is a staff supervisor operation
      if (!isStaff) {
        alert("Notice: State transitions are managed securely by the specialist crews assigned to your premises. You will see live state updates as task execution progresses.");
        return;
      }

      let nextStatus: 'Pending' | 'In Progress' | 'Completed';
      if (currentStatus === 'Pending') {
          nextStatus = 'In Progress';
      } else if (currentStatus === 'In Progress') {
          nextStatus = 'Completed';
      } else {
          nextStatus = 'Pending';
      }

      try {
          await updateDoc(doc(db, 'maintenance_requests', id), {
              status: nextStatus,
              updatedAt: serverTimestamp()
          });

          const updatedList = requests.map(req => {
              if (req.id === id) {
                  const updated = { ...req, status: nextStatus };
                  if (selectedRequest?.id === id) {
                      setSelectedRequest(updated);
                  }
                  return updated;
              }
              return req;
          });
          setRequests(updatedList);
      } catch (error) {
          setActionAlert(pt('saveError'));
      }
  };

  // Direct Status Update Selector from details
  const updateStatusDirect = async (id: string, nextStatus: 'Pending' | 'In Progress' | 'Completed' | 'Draft') => {
      if (!user || !isStaff) return;
      try {
          await updateDoc(doc(db, 'maintenance_requests', id), {
              status: nextStatus,
              updatedAt: serverTimestamp()
          });

          const updatedList = requests.map(req => {
              if (req.id === id) {
                  const updated = { ...req, status: nextStatus };
                  if (selectedRequest?.id === id) {
                      setSelectedRequest(updated);
                  }
                  return updated;
              }
              return req;
          });
          setRequests(updatedList);
      } catch (error) {
          setActionAlert(pt('saveError'));
      }
  };

  const extractPostcode = (addr?: string): string => {
      if (!addr) return '8000';
      const match = addr.match(/\b\d{4}\b/);
      return match ? match[0] : '8000';
  };

  const handleSaveNotes = async (id: string, notesText: string) => {
      if (!user || !isStaff) return;
      try {
          await updateDoc(doc(db, 'maintenance_requests', id), {
              notes: notesText,
              updatedAt: serverTimestamp()
          });

          const updatedList = requests.map(req => {
              if (req.id === id) {
                  const updated = { ...req, notes: notesText };
                  if (selectedRequest?.id === id) {
                      setSelectedRequest(updated);
                  }
                  return updated;
              }
              return req;
          });
          setRequests(updatedList);
          setActionAlert(pt('saved'));
          setTimeout(() => setActionAlert(null), 3000);
      } catch (error) {
          setActionAlert(pt('saveError'));
      }
  };

  const amountText = (record: MaintenanceRequest) => { const financial = portalAmount(record); return financial.value === undefined ? '—' : `${pt(financial.confirmed ? 'quotedAmount' : 'amount')}: ${financial.value.toLocaleString()}`; };

  const handleSendEmail = (req: MaintenanceRequest) => {
    if (!isStaff) return;
    const subjText = dt.emailSubjConfirmation + ' – ' + (req.service || req.client || 'Service') + ' | ' + amountText(req);
    const bHtml = `<!DOCTYPE html><html><head><meta charset='utf-8'><style>body{font-family:Arial,sans-serif;background:#f0f4f8;margin:0;padding:0}.c{max-width:600px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)}.h{background:#0f1b2d;padding:28px 32px;text-align:center}.h h1{color:#00d4ff;margin:0;font-size:22px;letter-spacing:2px;text-transform:uppercase}.h p{color:#94a3b8;margin:4px 0 0;font-size:12px}.b{padding:28px 32px}.tbl{width:100%;border-collapse:collapse;margin:16px 0}.tbl th{background:#0f1b2d;color:#00d4ff;padding:10px 14px;text-align:left;font-size:12px;text-transform:uppercase}.tbl td{padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#334155}.tot td{font-weight:bold;background:#f8fafc}.totamt{color:#0f1b2d;font-size:18px;font-weight:900}.ft{background:#0f1b2d;padding:16px 32px;text-align:center}.ft p{color:#64748b;font-size:11px;margin:3px 0}</style></head><body><div class='c'><div class='h'><h1>Kraken PFM</h1><p>Properties &amp; Facilities Management</p></div><div class='b'><p style='font-size:15px;color:#1e293b'>${escapeHtml(dt.emailGreeting)}<br><br>${escapeHtml(dt.emailBodyIntro)}</p><table class='tbl'><tr><th>${escapeHtml(dt.emailThDetail)}</th><th>${escapeHtml(dt.emailThInfo)}</th></tr><tr><td>${escapeHtml(dt.emailThClient)}</td><td><b>${escapeHtml(req.client||'N/A')}</b></td></tr><tr><td>${escapeHtml(dt.emailThService)}</td><td><b>${escapeHtml(req.service||'Facility Management')}</b></td></tr><tr><td>${escapeHtml(dt.emailThDate)}</td><td><b>${escapeHtml(req.date||'—')}</b></td></tr><tr><td>${escapeHtml(dt.emailThPriority)}</td><td><b>${escapeHtml(req.priority||'Standard')}</b></td></tr><tr class='tot'><td><b>${escapeHtml(pt(portalAmount(req).confirmed ? 'quotedAmount' : 'amount'))}</b></td><td><span class='totamt'>${escapeHtml(amountText(req))}</span></td></tr></table><p style='font-size:12px;color:#64748b'>${escapeHtml(dt.emailReplyPrompt)}</p></div><div class='ft'><p style='color:#94a3b8;font-size:13px;font-weight:bold'>Kraken Properties &amp; Facilities Management</p><p>kai@krakenpfm.ch | krakenpfm.ch</p></div></div></body></html>`;
    setSelectedEmailRequest(req);
    setEmailTo(req.email || '');
    setEmailCC('');
    setEmailSubject(subjText);
    setEmailBody(bHtml);
    setEmailPreviewMode(false);
    setEmailModalOpen(true);
  };

  const handleScheduleService = async (req: MaintenanceRequest) => {
    if (!isStaff) return;
    try { scheduleCalendarEventForKai(req); setActionAlert(pt('calendarDraft')); }
    catch { setActionAlert(pt('calendarInvalid')); }
  };
  const handleGenerateInvoice = (req: MaintenanceRequest) => {
    if (!openInvoiceSummary(req, language)) setActionAlert(pt('saveError'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      if (!newRequest.service.trim() || !newRequest.date) { setActionAlert(pt('required')); return; }

      const newDocId = doc(collection(db, 'maintenance_requests')).id;
      const requestRef = doc(db, 'maintenance_requests', newDocId);

      // Financial amounts are estimates only; client entries never establish a price.
      const parsedAmount = isStaff ? Math.max(0, Number(newRequest.amount) || 0) : 0;

      // Handle media links
      const mediaUrlsInput: string[] = [];
      const mediaNamesInput: string[] = [];
      if (newRequest.mediaUrlString.trim()) {
          const links = newRequest.mediaUrlString.split(',');
          links.forEach((url, index) => {
              const cleanUrl = url.trim();
              if (cleanUrl) {
                  mediaUrlsInput.push(cleanUrl);
                  // Extract simple file name
                  try {
                      const urlParts = cleanUrl.split('/');
                      const fileName = urlParts[urlParts.length - 1].split('?')[0];
                      mediaNamesInput.push(fileName || `attachment_${index + 1}.jpg`);
                  } catch (err) {
                      mediaNamesInput.push(`attachment_${index + 1}.jpg`);
                  }
              }
          });
      }

      const payload = {
          id: newDocId,
          client: isStaff ? (newRequest.client || 'Direct Client Lookup') : user.name,
          email: isStaff ? (newRequest.email || 'staff@krakenpfm.ch') : user.email,
          phone: newRequest.phone.trim(),
          address: newRequest.address.trim(),
          service: newRequest.service || 'FACILITY MAINTENANCE',
          date: newRequest.date,
          status: 'Pending' as const,
          priority: isStaff ? newRequest.priority : 'Medium' as const,
          amount: parsedAmount,
          notes: newRequest.notes.trim(),
          mediaUrls: mediaUrlsInput,
          mediaNames: mediaNamesInput,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
      };

      try {
          await setDoc(requestRef, sanitizeFirestoreData(payload));

          const localRequest: MaintenanceRequest = {
              id: newDocId,
              client: payload.client,
              email: payload.email,
              phone: payload.phone,
              address: payload.address,
              service: payload.service,
              date: payload.date,
              status: payload.status,
              priority: payload.priority,
              amount: payload.amount,
              notes: payload.notes,
              mediaUrls: payload.mediaUrls,
              mediaNames: payload.mediaNames
          };

          setRequests([localRequest, ...requests]);

          // Clear form
          setNewRequest({
              client: '',
              email: '',
              phone: '',
              address: '',
              service: '',
              date: '',
              priority: 'Medium',
              amount: '',
              notes: '',
              mediaUrlString: ''
          });
          setIsFormOpen(false);
      } catch (error) {
          setActionAlert(pt('saveError'));
      }
  };

  // Summaries Calculations
  const totalSubmissions = requests.length;
  const totalRevenue = requests.reduce((acc, curr) => acc + (portalAmount(curr).value ?? 0), 0);
  const activeJobs = requests.filter(r => r.status !== 'Completed').length;
  const highPriorityCount = requests.filter(r => r.priority === 'High' && r.status !== 'Completed').length;

  // Filter and search
  const filteredRequests = requests.filter(r => {
      const matchStatus = filterStatus === 'all' || r.status.toLowerCase() === filterStatus.toLowerCase();

      const queryLower = searchQuery.toLowerCase().trim();
      const matchSearch = !queryLower ||
          r.client.toLowerCase().includes(queryLower) ||
          r.service.toLowerCase().includes(queryLower) ||
          r.id.toLowerCase().includes(queryLower) ||
          (r.email && r.email.toLowerCase().includes(queryLower)) ||
          (r.address && r.address.toLowerCase().includes(queryLower)) ||
          (r.notes && r.notes.toLowerCase().includes(queryLower));

      return matchStatus && matchSearch;
  });

  const doSendEmail = async () => {
    if (!isStaff || !selectedEmailRequest || !emailTo) return;
    setEmailSending(true);
    const entry = {
      id: Date.now().toString(),
      requestId: selectedEmailRequest.id,
      clientName: selectedEmailRequest.client || 'Unknown',
      clientEmail: emailTo,
      subject: emailSubject,
      sentAt: new Date().toISOString(),
      status: 'pending' as 'sent' | 'pending' | 'error',
      amount: amountText(selectedEmailRequest),
    };
    try {
      await postWebhook(import.meta.env?.VITE_MAKE_EMAIL_WEBHOOK_URL || '', {
        type: 'cost_confirmation_email',
        to: emailTo, cc: emailCC, subject: emailSubject,
        html: emailBody,
        requestId: selectedEmailRequest.id,
        client: selectedEmailRequest.client,
        amount: portalAmount(selectedEmailRequest).value ?? null,
        isEstimate: !portalAmount(selectedEmailRequest).confirmed,
        service: selectedEmailRequest.service,
        sentAt: entry.sentAt,
      });
      entry.status = 'sent';
      setActionAlert(pt('webhookAccepted'));
    } catch {
      entry.status = 'error';
      setActionAlert(pt('saveError'));
    }
    const newHist = [entry, ...emailHistory];
    setEmailHistory(newHist);
    try { localStorage.setItem(`kraken_email_history_${user?.uid || ''}`, JSON.stringify(newHist)); } catch { /* Delivery status remains in memory. */ }
    setEmailSending(false);
    setEmailModalOpen(false);
  };

  const markConfirmed = (requestId: string, status: 'confirmed' | 'pending' | 'none') => {
    const n = { ...confirmationStatuses, [requestId]: status };
    setConfirmationStatuses(n);
    try { localStorage.setItem(`kraken_confirm_status_${user?.uid || ''}`, JSON.stringify(n)); } catch { /* Local annotation only. */ }
  };

  const doResendEmail = (entry: { requestId: string }) => {
    const req = requests.find(r => r.id === entry.requestId);
    if (req) handleSendEmail(req);
  };

  const filteredEmailHistory = emailHistory.filter(e => {
    if (emailHistoryFilter !== 'all' && e.status !== emailHistoryFilter) return false;
    if (emailHistoryClientFilter && !e.clientName.toLowerCase().includes(emailHistoryClientFilter.toLowerCase()) && !e.clientEmail.toLowerCase().includes(emailHistoryClientFilter.toLowerCase())) return false;
    return true;
  });

  const emailStats = {
    total: emailHistory.length,
    sent: emailHistory.filter(e => e.status === 'sent').length,
    pending: emailHistory.filter(e => e.status === 'pending').length,
    error: emailHistory.filter(e => e.status === 'error').length,
    confirmed: Object.values(confirmationStatuses).filter(s => s === 'confirmed').length,
  };

  return (
    <main className="kraken-portal min-h-screen pt-6 sm:pt-10 pb-12 font-sans text-[#032b59] relative bg-[#f3f7fc]">
      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative min-w-0 [overflow-wrap:anywhere]">

        {/* Portal heading and loaded-record summaries */}
        <section className="kraken-panel kraken-portal-header mb-6 rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-6 shadow-sm" aria-labelledby="portal-heading">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0">
            <div className="min-w-0">
            <p className="mb-1 text-base font-semibold text-[#1464ad]">{isStaff ? dt.staffConsole.replace(/^[^\p{L}]+/u, '') : heading.subtitle}</p>
            <h1 id="portal-heading" className="text-2xl sm:text-3xl font-semibold text-[#032b59] break-words">{isStaff ? dt.activeTasks : heading.title}</h1>
            <p className="mt-2 text-base text-[#50647c] break-words">{dt.welcomeBack} {user?.name || ''}</p>
            </div>
            <button type="button" onClick={handleLogout} disabled={loggingOut} aria-busy={loggingOut} className="kraken-control min-h-11 min-w-11 min-h-11 px-4 py-2 self-start sm:self-center shrink-0 rounded-xl border border-[#dce5f0] bg-white text-base font-semibold text-[#50647c] hover:bg-[#f3f7fc] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-blue-600">{loggingOut ? heading.loggingOut : heading.logout}</button>
          </div>
          {logoutError && <p role="alert" className="mb-4 text-base font-semibold text-red-700">{heading.logoutError}</p>}
          <dl className="kraken-metrics grid grid-cols-1 md:grid-cols-3 gap-3 min-w-0">
            <div className="flex items-center justify-between gap-3 min-w-0 rounded-xl border border-[#dce5f0] bg-[#f3f7fc] p-3 sm:p-4">
              <dt className="min-w-0 text-sm font-medium leading-5 text-[#50647c] [overflow-wrap:normal]">{isStaff ? dt.activeTasks : dt.activeServices}</dt>
              <dd className="shrink-0 text-xl font-semibold tabular-nums text-[#032b59]">{activeJobs}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 min-w-0 rounded-xl border border-[#dce5f0] bg-[#f3f7fc] p-3 sm:p-4">
              <dt className="min-w-0 text-sm font-medium leading-5 text-[#50647c] [overflow-wrap:normal]">{dt.highPriority}</dt>
              <dd className="shrink-0 text-xl font-semibold tabular-nums text-[#032b59]">{highPriorityCount}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 min-w-0 rounded-xl border border-[#dce5f0] bg-[#f3f7fc] p-3 sm:p-4">
              <dt className="min-w-0 text-sm font-medium leading-5 text-[#50647c] [overflow-wrap:normal]">{isStaff ? dt.estRevenue : dt.estBudget}</dt>
              <dd className="min-w-0 max-w-[65%] text-right text-base sm:text-lg font-semibold tabular-nums text-blue-700 [overflow-wrap:normal]">CHF {totalRevenue.toLocaleString()}</dd>
            </div>
          </dl>
        </section>

        {actionAlert && <div role="alert" className="sticky top-24 z-30 mb-5 flex items-start justify-between gap-3 rounded-2xl border border-[#b9d9d2] bg-white p-4 shadow-md"><p className="min-w-0 text-base font-medium text-[#032b59]">{actionAlert}</p><button type="button" onClick={() => setActionAlert(null)} aria-label={portalActionText(language, 'close')} className="kraken-control inline-flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-[#50647c] hover:bg-[#f3f7fc]"><X aria-hidden="true" className="h-5 w-5" /></button></div>}

        {!user?.emailVerified && <div className="bg-[#edf4fd] border border-[#c9dbef] rounded-2xl p-5 mb-6 text-sm">
          <p>{pt('verifyHint')}</p><div className="flex flex-wrap gap-4 mt-3 font-semibold text-[#1464ad]">
            <button type="button" onClick={async () => { try { await resendVerification(); setActionAlert(pt('verificationSent')); } catch { setActionAlert(pt('saveError')); } }}>{pt('verify')}</button>
            <button type="button" onClick={async () => { try { await refreshUser(); } catch { setActionAlert(pt('loadError')); } }}>{pt('refresh')}</button>
          </div></div>}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#dce5f0] rounded-2xl p-4 mb-5">
          <p className="text-base text-[#50647c]">{pt('loadedOnly')}</p>
          <button type="button" className="kraken-control min-h-11 min-w-11 font-semibold text-[#1464ad]" onClick={() => fetchPortalPage(activeTab)}>{heading.refresh}</button>
        </div>
        {loadErrors[activeTab] && <div role="alert" className="bg-red-50 text-red-800 rounded-2xl p-4 mb-5">
          <p>{pt('loadError')}</p><button type="button" className="kraken-control min-h-11 min-w-11 font-semibold underline mt-2" onClick={() => fetchPortalPage(activeTab)}>{pt('retry')}</button>
        </div>}
        {/* Section Navigation Tabs */}
        <nav aria-label={heading.subtitle} className="kraken-tabs mb-6 flex items-center gap-2 overflow-x-auto border-b border-[#dce5f0] pb-3">
          <button
            aria-pressed={activeTab === 'requests'}
            onClick={() => setActiveTab('requests')}
            className={`kraken-control min-h-11 min-w-11 px-6 py-3 rounded-2xl font-semibold text-base transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-[#032b59] text-white shadow-sm '
                : 'bg-white text-[#50647c] hover:bg-[#f3f7fc] border border-[#dce5f0]'
            }`}
          >
            <Clipboard className="w-4 h-4" />
            <span>{dt.tabRequests} ({requests.length})</span>
          </button>

          <button
            aria-pressed={activeTab === 'careers'}
            onClick={() => setActiveTab('careers')}
            className={`kraken-control min-h-11 min-w-11 px-6 py-3 rounded-2xl font-semibold text-base transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'careers'
                ? 'bg-[#032b59] text-white shadow-sm '
                : 'bg-white text-[#50647c] hover:bg-[#f3f7fc] border border-[#dce5f0]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{dt.tabCareers} ({jobApplications.length})</span>
          </button>

          {isStaff && <button
            aria-pressed={activeTab === 'messages'}
            onClick={() => setActiveTab('messages')}
            className={`kraken-control min-h-11 min-w-11 px-6 py-3 rounded-2xl font-semibold text-base transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-[#032b59] text-white shadow-sm '
                : 'bg-white text-[#50647c] hover:bg-[#f3f7fc] border border-[#dce5f0]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{pt('messages')} ({contactMessages.length})</span>
          </button>}
        </nav>

        {activeTab === 'messages' ? (
          /* ================= MENSAJES DE CONTACTO VIEW ================= */
          <div className="space-y-8 animate-fade-in mb-12">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#dce5f0] shadow-sm">
              <div className="relative min-w-0 flex-1">
                <input
                  type="text"
                  value={messageSearchQuery}
                  onChange={(e) => setMessageSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, email o asunto..."
                  className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3 pl-4 pr-10 text-base font-semibold text-[#032b59] outline-none focus:border-[#1464ad] focus:bg-white transition-all shadow-sm"
                />
                {messageSearchQuery && (
                  <button onClick={() => setMessageSearchQuery('')} className="kraken-control min-h-11 min-w-11 absolute right-3 top-1/2 -translate-y-1/2 text-[#50647c] hover:text-[#50647c]">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {(['all', 'new', 'done'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setMessageFilterStatus(st)}
                    className={`kraken-control min-h-11 min-w-11 px-4 py-2 rounded-xl text-base font-semibold transition-all cursor-pointer ${
                      messageFilterStatus === st
                        ? 'bg-[#1464ad] text-white shadow-md'
                        : 'bg-[#f3f7fc] text-[#50647c] hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all' ? 'Todos' : st === 'new' ? 'Nuevos' : 'Atendidos'}
                  </button>
                ))}
              </div>
            </div>

            {loadingMessages ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-[#dce5f0] shadow-sm">
                <div className="w-8 h-8 border-4 border-[#1464ad] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-base font-semibold text-[#50647c]">Cargando mensajes de contacto...</p>
              </div>
            ) : contactMessages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#dce5f0] shadow-sm p-8">
                <Mail className="w-12 h-12 text-[#50647c] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-[#032b59]">{loadErrors.messages ? pt('loadError') : pt('messages')}</h3>
                <p className="text-base text-[#50647c] mt-1">Los mensajes enviados desde el formulario de contacto aparecerán aquí.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {contactMessages
                  .filter(m => {
                    if (messageFilterStatus !== 'all' && m.status !== messageFilterStatus) return false;
                    if (!messageSearchQuery) return true;
                    const q = messageSearchQuery.toLowerCase();
                    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
                  })
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-6 rounded-3xl border transition-all bg-white shadow-sm hover:shadow-md ${
                        msg.status === 'new' ? 'border-amber-300 bg-amber-50/20' : 'border-[#dce5f0]'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#dce5f0]">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-2xl ${msg.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-[#f3f7fc] text-[#50647c]'}`}>
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-[#032b59] text-base">{msg.name}</h4>
                              <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                                msg.status === 'new' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                {msg.status === 'new' ? 'Nuevo' : 'Atendido'}
                              </span>
                              {msg.language && (
                                <span className="text-sm font-mono font-semibold text-[#50647c] bg-[#f3f7fc] px-2 py-0.5 rounded-md">
                                  {msg.language}
                                </span>
                              )}
                            </div>
                            <p className="text-base text-[#50647c] font-medium">{msg.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-auto">
                          <button
                            onClick={() => handleMessageStatusToggle(msg.id, msg.status)}
                            className={`kraken-control min-h-11 min-w-11 px-4 py-2 rounded-xl font-semibold text-base transition-all flex items-center gap-2 cursor-pointer ${
                              msg.status === 'new'
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                                : 'bg-[#f3f7fc] hover:bg-slate-200 text-[#50647c]'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>{msg.status === 'new' ? 'Marcar Atendido' : 'Marcar Nuevo'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-base font-semibold text-[#50647c] ">Asunto: {msg.subject}</p>
                        <p className="text-base text-[#50647c] whitespace-pre-wrap leading-relaxed bg-[#f3f7fc] p-4 rounded-2xl border border-[#dce5f0]">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : activeTab === 'careers' ? (
          /* ================= MI CARRERA & CVs VIEW ================= */
          <div className="space-y-8 animate-fade-in mb-12">
            {/* Careers Search & Status Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#dce5f0] shadow-sm">
              <div className="relative min-w-0 flex-1">
                <input
                  type="text"
                  value={careerSearchQuery}
                  onChange={(e) => setCareerSearchQuery(e.target.value)}
                  placeholder={dt.searchCareersPlaceholder}
                  className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3 pl-4 pr-10 text-base font-semibold text-[#032b59] outline-none focus:border-[#1464ad] focus:bg-white transition-all shadow-sm"
                />
                {careerSearchQuery && (
                  <button onClick={() => setCareerSearchQuery('')} className="kraken-control min-h-11 min-w-11 absolute right-3 top-1/2 -translate-y-1/2 text-[#50647c] hover:text-[#50647c]">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {['all', 'Pending', 'Reviewed', 'Contacted', 'Hired', 'Rejected'].map((statusKey) => {
                  const isActive = careerFilterStatus === statusKey;
                  const labelMap: Record<string, string> = {
                    all: dt.filterAllCareers,
                    Pending: dt.filterPendingCareer,
                    Reviewed: dt.filterReviewedCareer,
                    Contacted: dt.filterContactedCareer,
                    Hired: dt.filterHiredCareer,
                    Rejected: dt.filterRejectedCareer
                  };
                  return (
                    <button
                      key={statusKey}
                      onClick={() => setCareerFilterStatus(statusKey)}
                      className={`kraken-control min-h-11 min-w-11 px-4 py-2.5 rounded-xl text-base font-semibold transition-all border shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#032b59] text-white border-blue-900 shadow-md'
                          : 'bg-white text-[#50647c] border-[#dce5f0] hover:bg-[#f3f7fc]'
                      }`}
                    >
                      {labelMap[statusKey] || statusKey}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Candidates Table */}
            <div className="kraken-panel bg-white rounded-3xl border border-[#dce5f0] overflow-hidden shadow-sm">
              <div className="p-6 bg-[#f3f7fc] border-b border-[#dce5f0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-blue-100 text-[#1464ad] rounded-xl">
                    <FileText className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg text-[#032b59] ">{dt.careersTitle}</h3>
                    <p className="text-base text-[#50647c] font-semibold">
                      {jobApplications.length} {dt.applicationsReceived}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f3f7fc] text-[#50647c] text-sm font-semibold border-b border-[#dce5f0]">
                    <tr>
                      <th className="px-6 py-4 pl-8">{dt.tableCandidate}</th>
                      <th className="px-6 py-4">{dt.tablePosition}</th>
                      <th className="px-6 py-4">{dt.tableRegionPermit}</th>
                      <th className="px-6 py-4">{dt.tableIncorporation}</th>
                      <th className="px-6 py-4">{dt.tableCV}</th>
                      <th className="px-6 py-4">{dt.tableStatus}</th>
                      <th className="px-6 py-4 text-right pr-8">{dt.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {loadingCareers ? (
                      <tr>
                        <td colSpan={7} className="px-8 py-16 text-center text-[#50647c] font-semibold italic">
                          <span className="inline-block animate-spin w-4 h-4 border-2 border-[#1464ad] border-t-transparent rounded-full mr-2 align-middle"></span>
                          {dt.loadingCareers}
                        </td>
                      </tr>
                    ) : jobApplications.filter(app => {
                        const matchStatus = careerFilterStatus === 'all' || app.status.toLowerCase() === careerFilterStatus.toLowerCase();
                        const queryLower = careerSearchQuery.toLowerCase().trim();
                        const matchSearch = !queryLower ||
                          app.name.toLowerCase().includes(queryLower) ||
                          app.position.toLowerCase().includes(queryLower) ||
                          app.phone.toLowerCase().includes(queryLower) ||
                          app.region.toLowerCase().includes(queryLower);
                        return matchStatus && matchSearch;
                      }).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-8 py-16 text-center text-[#50647c] font-semibold">
                          {loadErrors.careers ? pt('loadError') : dt.noCandidatesFound}
                        </td>
                      </tr>
                    ) : (
                      jobApplications.filter(app => {
                        const matchStatus = careerFilterStatus === 'all' || app.status.toLowerCase() === careerFilterStatus.toLowerCase();
                        const queryLower = careerSearchQuery.toLowerCase().trim();
                        const matchSearch = !queryLower ||
                          app.name.toLowerCase().includes(queryLower) ||
                          app.position.toLowerCase().includes(queryLower) ||
                          app.phone.toLowerCase().includes(queryLower) ||
                          app.region.toLowerCase().includes(queryLower);
                        return matchStatus && matchSearch;
                      }).map((app) => (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedJobApp(app)}
                          className="border-b border-[#dce5f0] hover:bg-[#edf4fd] transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4 pl-8">
                            <div className="font-semibold text-[#032b59] group-hover:text-[#1464ad] transition-colors text-base">
                              {app.name}
                            </div>
                            <div className="text-sm text-[#50647c] font-mono flex items-center gap-2 mt-0.5">
                              <span>{app.phone}</span>
                              {app.phone && (
                                <a
                                  href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-blue-600 hover:underline font-semibold text-sm"
                                >
                                  WhatsApp
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 font-semibold text-[#032b59] text-base">
                            {app.position || 'Solicitud General'}
                          </td>

                          <td className="px-6 py-4 text-base font-medium text-[#50647c]">
                            <div>{app.region || 'Suiza'}</div>
                            <div className="text-sm text-[#50647c] font-mono">Permiso: {app.permit || 'No especificado'}</div>
                          </td>

                          <td className="px-6 py-4 text-base text-[#50647c] font-medium">
                            <div>{app.startDate || 'Inmediata'}</div>
                            <div className="text-sm text-[#50647c]">Jornada: {app.pensum || '100%'}</div>
                          </td>

                          <td className="px-6 py-4">
                            {app.cvData ? (
                              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => setPreviewFile({
                                    url: app.cvData!,
                                    name: app.cvName || `${app.name.replace(/\s+/g, '_')}_CV.pdf`,
                                    title: `Currículum • ${app.name}`
                                  })}
                                  className="kraken-control min-h-11 min-w-11 inline-flex items-center gap-1 px-3 py-1.5 bg-[#edf4fd] hover:bg-blue-100 text-[#1464ad] border border-[#c9dbef] rounded-xl text-base font-semibold transition-all shadow-sm cursor-pointer"
                                  title="Visualizar CV en pantalla"
                                >
                                  <Eye className="w-3.5 h-3.5 text-[#1464ad]" />
                                  <span>{dt.actionView}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => downloadFileSafely(app.cvData!, app.cvName || `${app.name.replace(/\s+/g, '_')}_CV.pdf`)}
                                  className="kraken-control min-h-11 min-w-11 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-base font-semibold transition-all shadow-sm cursor-pointer"
                                  title="Descargar CV seguro"
                                >
                                  <Download className="w-3.5 h-3.5 text-blue-600" />
                                  <span>{dt.actionDownload}</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#50647c] text-sm italic">{dt.noFile}</span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <select
                              value={app.status}
                              onClick={(e) => e.stopPropagation()}
                              disabled={!isStaff} onChange={(e) => handleJobAppStatusChange(app.id, e.target.value as any)}
                              className={`kraken-field px-3 py-1 rounded-full text-base font-semibold border cursor-pointer ${
                                app.status === 'Hired' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                app.status === 'Contacted' ? 'bg-blue-100 text-[#1464ad] border-[#1464ad]' :
                                app.status === 'Reviewed' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                                app.status === 'Rejected' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                                'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Pending">{dt.filterPendingCareer}</option>
                              <option value="Reviewed">{dt.filterReviewedCareer}</option>
                              <option value="Contacted">{dt.filterContactedCareer}</option>
                              <option value="Hired">{dt.filterHiredCareer}</option>
                              <option value="Rejected">{dt.filterRejectedCareer}</option>
                            </select>
                          </td>

                          <td className="px-6 py-4 text-right pr-8">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedJobApp(app); }}
                              className="kraken-control min-h-11 min-w-11 px-3.5 py-1.5 bg-[#f3f7fc] hover:bg-[#1464ad] text-[#50647c] hover:text-white rounded-xl text-base font-semibold transition-all border border-[#dce5f0]"
                            >
                              {dt.viewRecord}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
        /* ================= SERVICE REQUESTS & BORRADORES VIEW ================= */
        <>
        {/* Search, Filter, and Request Trigger bar */}
        <div className="kraken-toolbar mb-6 grid gap-3 rounded-2xl border border-[#dce5f0] bg-white p-4 md:grid-cols-[minmax(12rem,1fr)_auto]">

            {/* Search Input */}
            <div className="relative min-w-0 flex-1">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={dt.searchRequestsPlaceholder}
                    className="kraken-field w-full bg-white border border-[#dce5f0] rounded-2xl py-3.5 pl-5 pr-12 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all placeholder:text-[#50647c] shadow-sm"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="kraken-control min-h-11 min-w-11 absolute right-4 top-1/2 -translate-y-1/2 text-[#50647c] hover:text-[#50647c] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Status Filters */}
            <div className="kraken-filter-options flex gap-2 overflow-x-auto pb-1 md:col-span-2 md:row-start-2 md:flex-wrap">
                {['all', 'Pending', 'In Progress', 'Completed', 'Draft'].map((status) => {
                    const isActive = (status === 'all' && filterStatus === 'all') || filterStatus === status;
                    const statusColorMap = {
                        all: 'bg-[#032b59] border-[#032b59] text-white',
                        Pending: 'bg-[#fff7e6] border-[#edd3a3] text-[#7c5c21]',
                        'In Progress': 'bg-[#edf4fd] border-[#b9d9d2] text-[#07685e]',
                        Completed: 'bg-[#eaf5ee] border-[#b9d9c4] text-[#26633e]',
                        Draft: 'bg-[#f3f7fc] border-[#dce5f0] text-[#50647c]'
                    };
                    const activeStyle = statusColorMap[status as keyof typeof statusColorMap] || statusColorMap.all;

                    return (
                        <button
                            key={status}
                            aria-pressed={isActive}
                            onClick={() => setFilterStatus(status)}
                            className={`kraken-control min-h-11 min-w-11 px-5 py-3 rounded-2xl text-base font-semibold transition-all shrink-0 border ${
                                isActive
                                    ? `${activeStyle}`
                                    : 'bg-white text-[#50647c] border-[#dce5f0] hover:text-[#032b59] hover:bg-[#f3f7fc] hover:border-[#dce5f0] shadow-sm'
                            }`}
                        >
                            {status === 'all' ? dt.allRequests : status === 'Draft' ? dt.draftsFilter : status === 'Pending' ? dt.statusPending : status === 'In Progress' ? dt.statusInProgress : status === 'Completed' ? dt.statusCompleted : status}
                        </button>
                    );
                })}
            </div>

            {/* Action Trigger */}
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="kraken-control min-h-11 min-w-11 bg-[#1464ad] hover:bg-[#1464ad] text-white px-8 py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-3 transition-all font-semibold text-base shrink-0 cursor-pointer"
            >
                <PlusIcon className="w-5 h-5" />
                {isFormOpen ? dt.hidePortal : isStaff ? dt.enterCustomService : dt.addNewRequest}
            </motion.button>
        </div>

        {/* Main Work Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Form Intake (Animate Slot) */}
            <AnimatePresence>
              {isFormOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="lg:col-span-1"
                  >
                      <div className="kraken-panel bg-white rounded-3xl border border-[#dce5f0] overflow-hidden shadow-sm">
                          <div className="p-8 bg-[#f3f7fc] border-b border-[#dce5f0]">
                              <h3 className="font-semibold text-xl text-[#032b59]">
                                  {isStaff ? dt.directStaffEntry : dt.newServiceRequest}
                              </h3>
                              <p className="text-base font-semibold text-[#50647c] mt-1">
                                  {isStaff ? dt.recordB2BAppointments : dt.enterPropertyDetails}
                              </p>
                          </div>

                          <form onSubmit={handleSubmit} className="kraken-form p-8 space-y-5">
                              {isStaff ? (
                                  <>
                                      {/* Client Name */}
                                      <div className="space-y-1.5">
                                          <label htmlFor="dashboard-field-1" className="kraken-label block text-sm font-semibold text-[#50647c] ml-4">{dt.clientName}</label>
                                          <input id="dashboard-field-1"
                                              type="text"
                                              required
                                              className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3.5 px-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all placeholder:text-[#50647c]"
                                              placeholder={dt.clientNamePlaceholder}
                                              value={newRequest.client}
                                              onChange={e => setNewRequest({...newRequest, client: e.target.value})}
                                          />
                                      </div>

                                      {/* Contact Email & Phone */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <div className="space-y-1.5">
                                              <label htmlFor="dashboard-field-2" className="kraken-label block text-sm font-semibold text-[#50647c] ml-3">{dt.clientEmail}</label>
                                              <input id="dashboard-field-2"
                                                  type="email"
                                                  required={isStaff}
                                                  className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3.5 px-4 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all placeholder:text-[#50647c]"
                                                  placeholder="name@mail.com"
                                                  value={newRequest.email}
                                                  onChange={e => setNewRequest({...newRequest, email: e.target.value})}
                                              />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label htmlFor="dashboard-field-3" className="kraken-label block text-sm font-semibold text-[#50647c] ml-3">{dt.telephone}</label>
                                              <input id="dashboard-field-3"
                                                  type="text"
                                                  required
                                                  className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3.5 px-4 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all placeholder:text-[#50647c]"
                                                  placeholder="+41 79..."
                                                  value={newRequest.phone}
                                                  onChange={e => setNewRequest({...newRequest, phone: e.target.value})}
                                              />
                                          </div>
                                      </div>
                                  </>
                              ) : (
                                  /* Clean, streamlined layout for Clients */
                                  <div className="space-y-1.5">
                                      <label htmlFor="dashboard-field-4" className="kraken-label block text-sm font-semibold text-[#50647c] ml-4">{dt.telephone}</label>
                                      <input id="dashboard-field-4"
                                          type="text"
                                          required
                                          className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3.5 px-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all placeholder:text-[#50647c]"
                                          placeholder="+41 79..."
                                          value={newRequest.phone}
                                          onChange={e => setNewRequest({...newRequest, phone: e.target.value})}
                                      />
                                  </div>
                              )}

                              {/* Physical Address */}
                              <div className="space-y-1.5">
                                  <label htmlFor="dashboard-field-5" className="kraken-label block text-sm font-semibold text-[#50647c] ml-4">{dt.serviceAddress}</label>
                                  <input id="dashboard-field-5"
                                      type="text"
                                      className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3.5 px-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all placeholder:text-[#50647c]"
                                      placeholder={dt.serviceAddressPlaceholder}
                                      value={newRequest.address}
                                      onChange={e => setNewRequest({...newRequest, address: e.target.value})}
                                  />
                              </div>

                              {/* Service Selection */}
                              <div className="space-y-1.5">
                                  <label htmlFor="dashboard-field-6" className="kraken-label block text-sm font-semibold text-[#50647c] ml-4">{dt.serviceClassification}</label>
                                  <select id="dashboard-field-6"
                                      className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3.5 px-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all appearance-none"
                                      value={newRequest.service}
                                      onChange={e => setNewRequest({...newRequest, service: e.target.value})}
                                      required
                                  >
                                      <option value="">{dt.selectLineOfWork}</option>
                                      <option value="End of Tenancy Deluxe">{portalOptionLabel(language, 'End of Tenancy Deluxe')}</option>
                                      <option value="B2B Commercial Cleaning">{portalOptionLabel(language, 'B2B Commercial Cleaning')}</option>
                                      <option value="Regular Deep Cleaning">{portalOptionLabel(language, 'Regular Deep Cleaning')}</option>
                                      <option value="Professional Car Detailing">{portalOptionLabel(language, 'Professional Car Detailing')}</option>
                                      <option value="Facade & Glass Restoration">{portalOptionLabel(language, 'Facade & Glass Restoration')}</option>
                                      <option value="Emergency Rapid Cleanup">{portalOptionLabel(language, 'Emergency Rapid Cleanup')}</option>
                                  </select>
                              </div>

                              {/* Date & Priority */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                      <label htmlFor="dashboard-field-7" className="kraken-label block text-sm font-semibold text-[#50647c] ml-4">{dt.executionDate}</label>
                                      <input id="dashboard-field-7"
                                          type="date"
                                          required
                                          className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3.5 px-4 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all text-[#50647c]"
                                          value={newRequest.date}
                                          onChange={e => setNewRequest({...newRequest, date: e.target.value})}
                                      />
                                  </div>
                                  <div className="space-y-1.5">
                                      <label htmlFor="dashboard-field-8" className="kraken-label block text-sm font-semibold text-[#50647c] ml-4">{dt.priority}</label>
                                      <select id="dashboard-field-8"
                                          className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3.5 px-4 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all appearance-none"
                                          disabled={!isStaff} value={newRequest.priority}
                                          onChange={e => setNewRequest({...newRequest, priority: e.target.value as any})}
                                      >
                                          <option value="Low">{portalOptionLabel(language, 'Low')}</option>
                                          <option value="Medium">{portalOptionLabel(language, 'Medium')}</option>
                                          <option value="High">{portalOptionLabel(language, 'High')}</option>
                                      </select>
                                  </div>
                              </div>

                              {/* Staff estimates do not establish payment. */}
                              <div hidden={!isStaff} className="space-y-1.5">
                                  <label htmlFor="dashboard-field-9" className="kraken-label block text-sm font-semibold text-[#50647c] ml-4">{dt.budgetQuotedPrice}</label>
                                  <input id="dashboard-field-9"
                                      type="number"
                                      className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3.5 px-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all placeholder:text-[#50647c]"
                                      placeholder={dt.budgetPlaceholder}
                                      min={0} max={1000000} step="0.01" value={newRequest.amount}
                                      onChange={e => setNewRequest({...newRequest, amount: e.target.value})}
                                  />
                              </div>

                              {/* Notes */}
                              <div className="space-y-1.5">
                                  <label htmlFor="dashboard-field-10" className="kraken-label block text-sm font-semibold text-[#50647c] ml-4">{dt.operationalNotes}</label>
                                  <textarea id="dashboard-field-10"
                                      rows={2}
                                      className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3 px-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all placeholder:text-[#50647c]"
                                      placeholder={dt.notesPlaceholder}
                                      value={newRequest.notes}
                                      onChange={e => setNewRequest({...newRequest, notes: e.target.value})}
                                  />
                              </div>

                              {/* Custom Media Attachment URL */}
                              <div className="space-y-1.5">
                                  <label htmlFor="dashboard-field-11" className="kraken-label block text-sm font-semibold text-[#50647c] ml-4">{dt.externalImageLinks}</label>
                                  <input id="dashboard-field-11"
                                      type="text"
                                      className="kraken-field w-full bg-[#f3f7fc] border border-[#dce5f0] rounded-2xl py-3.5 px-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:bg-white transition-all placeholder:text-[#50647c]"
                                      placeholder="https://example.com/photo1.jpg, https://example.com/photo2.png"
                                      value={newRequest.mediaUrlString}
                                      onChange={e => setNewRequest({...newRequest, mediaUrlString: e.target.value})}
                                  />
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="kraken-control min-h-11 w-full py-4.5 bg-[#1464ad] text-white rounded-2xl font-semibold text-base shadow-sm transition-all mt-3"
                              >
                                {dt.submitRequestRecord}
                              </motion.button>
                          </form>
                      </div>
                  </motion.div>
              )}
            </AnimatePresence>

            {/* Right Column: Central Submissions Grid and Queue */}
            <div className={`${isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-200`}>

                {/* Visual Header describing Queue Scope */}
                <div className="bg-white p-5 rounded-3xl border border-[#dce5f0] mb-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-semibold text-[#50647c] shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="p-2.5 bg-[#edf4fd] text-[#1464ad] rounded-2xl border border-[#c9dbef]">
                            <Clipboard className="w-4 h-4" />
                        </span>
                        <span>{dt.showingIncidents.replace('{filtered}', String(filteredRequests.length)).replace('{total}', String(totalSubmissions))}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <span className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60 text-sm text-amber-700 font-semibold"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full "></span> {dt.statusPending}</span>
                        <span className="flex items-center gap-2 bg-[#edf4fd] px-3 py-1.5 rounded-xl border border-[#c9dbef] text-sm text-[#1464ad] font-semibold"><span className="w-1.5 h-1.5 bg-[#1464ad] rounded-full "></span> {dt.statusInProgress}</span>
                        <span className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200/60 text-sm text-blue-700 font-semibold"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> {dt.statusCompleted}</span>
                    </div>
                </div>

                <div className="lg:hidden space-y-4 mb-5">
                  {loading ? <p role="status" className="p-6 bg-white rounded-2xl">{pt('loading')}</p> : filteredRequests.length === 0 ? <p className="p-6 bg-white rounded-2xl">{loadErrors.requests ? pt('loadError') : dt.noRequestsFound}</p> : filteredRequests.map(request => <article key={request.id} className="bg-white border border-[#dce5f0] rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between gap-3"><h3 className="font-semibold text-[#032b59] min-w-0 [overflow-wrap:anywhere]">{request.service}</h3><span className="text-sm text-[#50647c] shrink-0">{request.status === 'Pending' ? dt.statusPending : request.status === 'In Progress' ? dt.statusInProgress : request.status === 'Completed' ? dt.statusCompleted : dt.draftLabel}</span></div>
                    <p className="text-base break-words">{request.client}</p><p className="text-base text-[#50647c]">{request.date || '—'} · {amountText(request)}</p>
                    <button type="button" onClick={() => setSelectedRequest(request)} className="kraken-control min-h-11 w-full bg-[#1464ad] text-white rounded-xl px-4 py-3 font-semibold">{dt.actions}</button>
                  </article>)}
                </div>
                <div className="kraken-panel bg-white rounded-3xl border border-[#dce5f0] overflow-hidden shadow-sm">
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f3f7fc] text-[#50647c] text-sm font-semibold border-b border-[#dce5f0]">
                                <tr>
                                    <th className="px-6 py-5 pl-8">{dt.tableServiceID}</th>
                                    <th className="px-6 py-5">{dt.tableClientContact}</th>
                                    <th className="px-6 py-5">{dt.tableClassification}</th>
                                    <th className="px-6 py-5">{dt.tableSchedule}</th>
                                    <th className="px-6 py-5 whitespace-nowrap">{dt.tableMedia}</th>
                                    <th className="px-6 py-5">{dt.tableStatusTier}</th>
                                    <th className="px-6 py-5 text-right pr-8">{dt.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-20 text-center text-[#50647c] italic font-semibold">
                                            <span className="inline-block animate-spin w-5 h-5 border-2 border-[#1464ad] border-t-transparent rounded-full mr-3 align-middle"></span>
                                            {dt.loadingRequests}
                                        </td>
                                    </tr>
                                ) : filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-20 text-center text-[#50647c] font-semibold">
                                            {loadErrors.requests ? pt('loadError') : dt.noRequestsFound}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((req, idx) => {
                                        const hasMedia = req.mediaUrls && req.mediaUrls.length > 0;
                                        return (
                                            <motion.tr
                                              key={req.id}
                                              initial={{ opacity: 0, y: 8 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ delay: idx * 0.03 }}
                                              onClick={() => setSelectedRequest(req)}
                                              className={`border-b border-[#dce5f0] hover:bg-[#f3f7fc] transition-all cursor-pointer group ${
                                                  selectedRequest?.id === req.id ? 'bg-[#edf4fd]' : ''
                                              }`}
                                            >
                                                {/* ID */}
                                                <td className="px-6 py-5 pl-8 font-mono text-base text-[#50647c] whitespace-nowrap">
                                                    #{req.id.substring(0, 8).toUpperCase()}
                                                </td>

                                                {/* Client Name */}
                                                <td className="px-6 py-5 font-semibold text-[#032b59] group-hover:text-[#1464ad] transition-colors ">
                                                    <div className="flex flex-col">
                                                        <span className="text-[#032b59] group-hover:text-[#1464ad] transition-colors">{req.client}</span>
                                                        {isStaff && req.email && (
                                                            <span className="text-sm text-[#50647c] normal-case font-medium mt-0.5 lowercase truncate max-w-[150px]">{req.email}</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Service Name */}
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-[#50647c] text-sm">{req.service}</span>
                                                        <span className="text-sm text-blue-600 font-mono font-semibold mt-0.5">{amountText(req)}</span>
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="px-6 py-5 text-[#50647c] font-mono text-base whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <ClockIcon className="w-3.5 h-3.5 text-[#50647c]" />
                                                        <span>{req.date}</span>
                                                    </div>
                                                </td>

                                                {/* Media uploads indicator */}
                                                <td className="px-6 py-5">
                                                    {hasMedia ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-[#edf4fd] text-[#1464ad] border border-[#c9dbef]">
                                                            <ImageIcon className="w-3.5 h-3.5" />
                                                            {req.mediaUrls?.length} {req.mediaUrls && req.mediaUrls.length > 1 ? dt.attachments : dt.attachment}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-350 text-sm">—</span>
                                                    )}
                                                </td>

                                                {/* Status pill with click to next step */}
                                                <td className="px-6 py-5">
                                                    <span
                                                        onClick={(e) => handleStatusChange(req.id, req.status, e)}
                                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold cursor-pointer select-none transition-all border whitespace-nowrap ${
                                                            req.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' :
                                                            req.status === 'In Progress' ? 'bg-[#edf4fd] text-[#1464ad] border-[#c9dbef] shadow-sm' :
                                                            req.status === 'Draft' ? 'bg-purple-50 text-purple-800 border-purple-200 shadow-sm' :
                                                            'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                                                        }`}
                                                    >
                                                        {req.status === 'In Progress' && <span className="w-1.5 h-1.5 bg-[#1464ad] rounded-full "></span>}
                                                        {req.status === 'Pending' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full "></span>}
                                                        {req.status === 'Completed' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                                                        {req.status === 'Draft' && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full "></span>}
                                                        {req.status === 'Draft' ? dt.draftLabel : req.status === 'Pending' ? dt.statusPending : req.status === 'In Progress' ? dt.statusInProgress : req.status === 'Completed' ? dt.statusCompleted : req.status}
                                                    </span>
                                                </td>

                                                {/* actions */}
                                                <td className="min-w-[220px] w-[220px] px-3 py-4 text-right">
                                                    <div className="flex flex-nowrap items-center justify-end gap-1 [overflow-wrap:normal]" >
                                                         <motion.button
                                                           whileHover={{ scale: 1.08 }}
                                                           whileTap={{ scale: 0.95 }}
                                                           onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                                                           className="kraken-control h-11 w-11 min-h-11 min-w-11 shrink-0 p-0 inline-flex items-center justify-center bg-[#f3f7fc] hover:bg-[#1464ad] rounded-xl text-[#50647c] hover:text-white transition-colors border border-[#dce5f0]"
                                                           aria-label={portalActionText(language, 'details')} title={portalActionText(language, 'details')}
                                                         >
                                                             <Eye aria-hidden="true" className="h-5 w-5" />
                                                         </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); handleSendEmail(req); }}
                    className="kraken-control h-11 w-11 min-h-11 min-w-11 shrink-0 p-0 inline-flex items-center justify-center bg-[#edf4fd] hover:bg-[#dceee9] rounded-xl text-[#1464ad] transition-colors"
                    hidden={!isStaff} aria-label={dt.sendCostConfirmation} title={dt.sendCostConfirmation}
                  >
                    <Mail aria-hidden="true" size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); markConfirmed(req.id, confirmationStatuses[req.id] === 'confirmed' ? 'none' : 'confirmed'); }}
                    className={`kraken-control h-11 w-11 min-h-11 min-w-11 shrink-0 p-0 inline-flex items-center justify-center rounded-xl transition-colors ${confirmationStatuses[req.id] === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-[#f3f7fc] hover:bg-green-50 text-[#50647c] hover:text-green-600'}`}
                    hidden={!isStaff} aria-label={pt('localNote')} aria-pressed={confirmationStatuses[req.id] === 'confirmed'} title={pt('localNote')}
                  >
                    <Check aria-hidden="true" size={20} />
                  </motion.button>
                                                         {((isStaff && !req.payment) || (!isStaff && !req.checkout && ['Draft', 'Pending'].includes(req.status))) && (
                                                             <motion.button
                                                                 whileHover={{ scale: 1.15, color: "#f43f5e" }}
                                                                 whileTap={{ scale: 0.8 }}
                                                                 onClick={(e) => handleDelete(req.id, e)}
                                                                 className="kraken-control min-h-11 min-w-11 p-2 text-[#50647c] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                                                 aria-label={dt.deleteRequestLedger} title={dt.deleteRequestLedger}
                                                             >
                                                                 <TrashIcon className="w-4 h-4" />
                                                             </motion.button>
                                                         )}
                                                     </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
        )}

        {hasMore[activeTab] && <div className="flex justify-center my-8"><button type="button" disabled={isPageLoading} onClick={() => fetchPortalPage(activeTab, true)} className="kraken-control min-h-11 min-w-11 px-6 py-3 rounded-2xl bg-[#1464ad] text-white font-semibold disabled:opacity-50">{isPageLoading ? pt('loading') : pt('more')}</button></div>}
        {/* Dynamic Detail-Inspector Overlay Modal for Service Requests */}
        <AnimatePresence>
            {selectedRequest && (
                <DetailInspectorModal
                    selectedRequest={selectedRequest}
                    setSelectedRequest={setSelectedRequest}
                    isStaff={isStaff}
                    updateStatusDirect={updateStatusDirect}
                    handleDelete={handleDelete}
                    requests={requests}
                    setRequests={setRequests}
                />
            )}
        </AnimatePresence>

        {/* Dynamic Candidate Inspector Modal for Mi Carrera / Job Applications */}
        <AnimatePresence>
            {selectedJobApp && (
                <div className="kraken-portal kraken-overlay fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#dce5f0] shadow-sm overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="kraken-dialog-header p-5 bg-[#edf4fd] text-[#032b59] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <User className="w-6 h-6 text-[#1464ad]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl">{selectedJobApp.name}</h3>
                                    <p className="text-base text-[#50647c] font-semibold">{selectedJobApp.position || dt.tablePosition}</p>
                                </div>
                            </div>
                            <button type="button" aria-label={portalActionText(language, 'close')}
                                onClick={() => setSelectedJobApp(null)}
                                className="kraken-control min-h-11 min-w-11 p-2 hover:bg-white/10 rounded-full transition-colors text-[#032b59] cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6 text-[#032b59] text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f3f7fc] p-5 rounded-2xl border border-[#dce5f0]">
                                <div>
                                    <span className="text-sm font-semibold text-[#50647c] block ">{dt.phoneContact}</span>
                                    <span className="font-semibold text-[#032b59] text-base">{selectedJobApp.phone}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-[#50647c] block ">{dt.workPermit}</span>
                                    <span className="font-semibold text-[#032b59]">{selectedJobApp.permit || dt.noRecordsFound}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-[#50647c] block ">{dt.regionCanton}</span>
                                    <span className="font-semibold text-[#032b59]">{selectedJobApp.region || 'Schweiz'}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-[#50647c] block ">{dt.incorporation}</span>
                                    <span className="font-semibold text-[#032b59]">{selectedJobApp.startDate || dt.tableIncorporation}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-[#50647c] block ">{dt.desiredWorkload}</span>
                                    <span className="font-semibold text-[#032b59]">{selectedJobApp.pensum || '100%'}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-[#50647c] block ">{dt.certificatesDriving}</span>
                                    <span className="font-semibold text-[#032b59]">{selectedJobApp.certificates || '-'}</span>
                                </div>
                            </div>

                            {selectedJobApp.languages && (
                                <div>
                                    <span className="text-sm font-semibold text-[#50647c] block mb-1">{dt.languages}</span>
                                    <p className="p-3 bg-[#f3f7fc] rounded-xl text-[#50647c] font-medium border border-[#dce5f0]">{selectedJobApp.languages}</p>
                                </div>
                            )}

                            {selectedJobApp.message && (
                                <div>
                                    <span className="text-sm font-semibold text-[#50647c] block mb-1">{dt.presentation}</span>
                                    <p className="p-4 bg-[#f3f7fc] rounded-xl text-[#50647c] italic border border-[#dce5f0] whitespace-pre-wrap">{selectedJobApp.message}</p>
                                </div>
                            )}

                            <div className="p-5 bg-[#edf4fd] rounded-2xl border border-[#c9dbef] flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <span className="text-sm font-semibold text-[#1464ad] block">{dt.cvDocument}</span>
                                    <span className="text-sm text-[#1464ad] font-mono font-semibold">{selectedJobApp.cvName || dt.tableCV}</span>
                                </div>
                                {selectedJobApp.cvData ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewFile({
                                                url: selectedJobApp.cvData!,
                                                name: selectedJobApp.cvName || `${selectedJobApp.name.replace(/\s+/g, '_')}_CV.pdf`,
                                                title: `${dt.tableCV} • ${selectedJobApp.name}`
                                            })}
                                            className="kraken-control min-h-11 min-w-11 px-4 py-2.5 bg-[#1464ad] hover:bg-[#1464ad] text-white rounded-xl font-semibold text-base flex items-center gap-2 shadow-md transition-all cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>{dt.preview}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => downloadFileSafely(selectedJobApp.cvData!, selectedJobApp.cvName || `${selectedJobApp.name.replace(/\s+/g, '_')}_CV.pdf`)}
                                            className="kraken-control min-h-11 min-w-11 px-5 py-2.5 bg-[#1464ad] hover:bg-[#0c4f92] text-white rounded-xl font-semibold text-base flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>{dt.downloadCV}</span>
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-sm text-[#50647c] font-semibold italic">{dt.noFile}</span>
                                )}
                            </div>

                            <div>
                                <span className="text-sm font-semibold text-[#50647c] block mb-2">{dt.changeStatus}</span>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: 'Pending', label: dt.filterPendingCareer },
                                        { key: 'Reviewed', label: dt.filterReviewedCareer },
                                        { key: 'Contacted', label: dt.filterContactedCareer },
                                        { key: 'Hired', label: dt.filterHiredCareer },
                                        { key: 'Rejected', label: dt.filterRejectedCareer }
                                    ].map(st => (
                                        <button
                                            key={st.key}
                                            disabled={!isStaff} onClick={() => handleJobAppStatusChange(selectedJobApp.id, st.key as any)}
                                            className={`kraken-control min-h-11 min-w-11 px-4 py-2 rounded-xl text-base font-semibold border cursor-pointer transition-all ${
                                                selectedJobApp.status === st.key
                                                    ? 'bg-[#032b59] text-white border-blue-900 shadow-md'
                                                    : 'bg-white text-[#50647c] border-[#dce5f0] hover:bg-[#f3f7fc]'
                                            }`}
                                        >
                                            {st.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>

      </div>
        {/* ===== EMAIL CONFIRMATION CENTER ===== */}
        <div hidden={!isStaff} className="mt-6 bg-white rounded-2xl shadow-sm border border-[#dce5f0] overflow-hidden mx-4 mb-4">
          <div className="bg-[#edf4fd] px-5 py-4 flex items-center justify-between cursor-pointer select-none" onClick={() => setShowEmailHistory(v => !v)}>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#1464ad]" />
              <h3 className="text-[#032b59] font-semibold text-lg ">{dt.emailCenterTitle}</h3>
              <span className="bg-[#1464ad] text-[#032b59] text-sm font-semibold px-2 py-0.5 rounded-full">{emailHistory.length}</span>
            </div>
            <ArrowLeft size={16} className={`text-[#50647c] transition-transform duration-300 ${showEmailHistory ? 'rotate-90' : '-rotate-90'}`} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-slate-100 border-b border-[#dce5f0]">
            {([
              { label: dt.total, value: emailStats.total, color: 'text-slate-700', bg: 'bg-white', icon: '📨' },
              { label: dt.delivered, value: emailStats.sent, color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
              { label: dt.filterPending, value: emailStats.pending, color: 'text-yellow-500', bg: 'bg-yellow-50', icon: '⏳' },
              { label: dt.failed, value: emailStats.error, color: 'text-red-500', bg: 'bg-red-50', icon: '❌' },
              { label: dt.confirmed, value: emailStats.confirmed, color: 'text-[#00d4ff]', bg: 'bg-slate-50', icon: '🎯' },
            ] as const).map((stat, i) => (
              <div key={i} className={`${stat.bg} px-3 py-3 text-center`}>
                <div className="text-base">{stat.icon}</div>
                <div className={`text-xl font-semibold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm font-semibold text-[#50647c] ">{stat.label}</div>
              </div>
            ))}
          </div>
          {showEmailHistory && (
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                {(['all','sent','pending','error'] as const).map(f => (
                  <button key={f} onClick={() => setEmailHistoryFilter(f)} className={`kraken-control min-h-11 min-w-11 px-3 py-1 rounded-full text-base font-semibold transition-all ${emailHistoryFilter === f ? 'bg-[#032b59] text-white' : 'bg-[#f3f7fc] text-[#50647c] hover:bg-slate-200'}`}>
                    {f === 'all' ? dt.filterAll : f === 'sent' ? dt.delivered : f === 'pending' ? dt.filterPending : dt.failed}
                  </button>
                ))}
                <input type="text" value={emailHistoryClientFilter} onChange={e => setEmailHistoryClientFilter(e.target.value)} placeholder={dt.filterClientPlaceholder} className="kraken-field border border-[#dce5f0] rounded-full px-3 py-1 text-base focus:outline-none focus:ring-1 focus:ring-[#1464ad] flex-1 min-w-0 max-w-xs" />
              </div>
              {filteredEmailHistory.length === 0 ? (
                <div className="text-center py-8 text-[#50647c]">
                  <Mail size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-base font-medium">{dt.noEmailsSent}</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[#dce5f0]">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-[#edf4fd] text-[#032b59]">
                      <th className="px-3 py-2.5 text-left font-semibold ">{dt.thDate}</th>
                      <th className="px-3 py-2.5 text-left font-semibold ">{dt.thClient}</th>
                      <th className="px-3 py-2.5 text-left font-semibold ">{dt.thTo}</th>
                      <th className="px-3 py-2.5 text-right font-semibold ">{dt.thCHF}</th>
                      <th className="px-3 py-2.5 text-center font-semibold ">{dt.thStatus}</th>
                      <th className="px-3 py-2.5 text-center font-semibold ">{dt.thConfirmed}</th>
                      <th className="px-3 py-2.5 text-center font-semibold ">{dt.thAction}</th>
                    </tr></thead>
                    <tbody>
                      {filteredEmailHistory.map((entry, idx) => (
                        <tr key={entry.id} className={`border-t border-[#dce5f0] ${idx%2===0?'bg-white':'bg-[#f3f7fc]'} hover:bg-[#edf4fd] transition-colors`}>
                          <td className="px-3 py-2.5 text-[#50647c] whitespace-nowrap">{new Date(entry.sentAt).toLocaleDateString('de-CH')} {new Date(entry.sentAt).toLocaleTimeString('de-CH',{hour:'2-digit',minute:'2-digit'})}</td>
                          <td className="px-3 py-2.5 font-semibold text-[#032b59]">{entry.clientName}</td>
                          <td className="px-3 py-2.5 text-[#50647c] truncate max-w-[120px]">{entry.clientEmail}</td>
                          <td className="px-3 py-2.5 text-right font-semibold text-[#032b59]">{entry.amount}</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-semibold ${entry.status==='sent'?'bg-green-100 text-green-700':entry.status==='pending'?'bg-yellow-100 text-yellow-600':'bg-red-100 text-red-600'}`}>
                              {entry.status==='sent'?dt.delivered:entry.status==='pending'?dt.filterPending:dt.failed}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <select value={confirmationStatuses[entry.requestId]||'none'} onChange={e => markConfirmed(entry.requestId, e.target.value as 'confirmed'|'pending'|'none')} className="kraken-field text-base border border-[#dce5f0] rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#1464ad] bg-white">
                              <option value="none">— {dt.filterAll} —</option>
                              <option value="pending">{dt.filterPending}</option>
                              <option value="confirmed">{dt.confirmed}</option>
                            </select>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <button onClick={() => doResendEmail(entry)} className="kraken-control min-h-11 min-w-11 px-2 py-1 rounded-md bg-[#032b59] text-white text-base font-semibold hover:bg-slate-700 transition-colors">{dt.resend}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== EMAIL COMPOSITION MODAL ===== */}
        {emailModalOpen && selectedEmailRequest && (
          <div className="kraken-portal kraken-overlay fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={e => { if (e.target === e.currentTarget) setEmailModalOpen(false); }}>
            <div className="kraken-dialog bg-white rounded-2xl shadow-sm w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-[#dce5f0]">
              <div className="kraken-dialog-header bg-[#edf4fd] px-5 py-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-[#1464ad] font-semibold text-base flex items-center gap-2"><Mail size={16}/> {dt.sendCostConfirmation}</h2>
                  <p className="text-[#50647c] text-base mt-0.5">{dt.thClient}: {selectedEmailRequest.client} · {amountText(selectedEmailRequest)}</p>
                </div>
                <button onClick={() => setEmailModalOpen(false)} className="kraken-control min-h-11 min-w-11 text-[#50647c] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"><X size={18}/></button>
              </div>
              <div className="bg-[#f3f7fc] px-6 pt-3 flex gap-2 flex-shrink-0 border-b border-[#dce5f0]">
                <button onClick={() => setEmailPreviewMode(false)} className={`kraken-control min-h-11 min-w-11 px-4 py-2 rounded-t-lg text-base font-semibold transition-all ${!emailPreviewMode ? 'bg-white text-[#032b59] shadow-sm' : 'text-[#50647c] hover:text-[#50647c]'}`}>{dt.compose}</button>
                <button onClick={() => setEmailPreviewMode(true)} className={`kraken-control min-h-11 min-w-11 px-4 py-2 rounded-t-lg text-base font-semibold transition-all ${emailPreviewMode ? 'bg-white text-[#032b59] shadow-sm' : 'text-[#50647c] hover:text-[#50647c]'}`}>{dt.preview}</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {!emailPreviewMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dashboard-field-12" className="kraken-label block text-sm font-semibold text-[#50647c] mb-1">{dt.to} *</label>
                        <input id="dashboard-field-12" type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} className="kraken-field w-full border border-[#dce5f0] rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#1464ad] focus:border-transparent" placeholder="client@example.com"/>
                      </div>
                      <div>
                        <label htmlFor="dashboard-field-13" className="kraken-label block text-sm font-semibold text-[#50647c] mb-1">{dt.cc}</label>
                        <input id="dashboard-field-13" type="email" value={emailCC} onChange={e => setEmailCC(e.target.value)} className="kraken-field w-full border border-[#dce5f0] rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#1464ad] focus:border-transparent" placeholder="cc@example.com"/>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="dashboard-field-14" className="kraken-label block text-sm font-semibold text-[#50647c] mb-1">{dt.subject}</label>
                      <input id="dashboard-field-14" type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="kraken-field w-full border border-[#dce5f0] rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#1464ad] focus:border-transparent"/>
                    </div>
                    <div>
                      <label htmlFor="dashboard-field-15" className="kraken-label block text-sm font-semibold text-[#50647c] mb-1">{dt.emailBody}</label>
                      <textarea id="dashboard-field-15" value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={14} className="kraken-field w-full border border-[#dce5f0] rounded-lg px-3 py-2 text-base font-mono focus:outline-none focus:ring-2 focus:ring-[#1464ad] focus:border-transparent resize-none"/>
                    </div>
                  </div>
                ) : (
                  <div className="border border-[#dce5f0] rounded-xl overflow-hidden">
                    <div className="bg-[#f3f7fc] px-4 py-2 text-sm text-[#50647c] font-medium border-b border-[#dce5f0]">{dt.preview}</div>
                    <iframe srcDoc={emailBody} className="w-full" style={{height:'420px',border:'none'}} title="Email Preview" sandbox=""/>
                  </div>
                )}
              </div>
              <div className="border-t border-[#dce5f0] px-6 py-4 flex items-center justify-between bg-[#f3f7fc] flex-shrink-0">
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#50647c]">
                  <CheckCircle size={12} className="text-green-400"/> Via Kraken PFM Dispatch
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEmailModalOpen(false)} className="kraken-control min-h-11 min-w-11 px-4 py-2 rounded-lg border border-[#dce5f0] text-base font-medium text-[#50647c] hover:bg-[#f3f7fc] transition-colors">{dt.cancel}</button>
                  <button onClick={doSendEmail} disabled={emailSending || !emailTo} className="kraken-control min-h-11 min-w-11 px-5 py-2 rounded-lg bg-[#032b59] text-white text-base font-semibold hover:bg-[#032b59] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {emailSending ? <><Clock size={13} className="animate-spin"/> {dt.sending}</> : <><Send size={13}/> {dt.sendEmail}</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <FilePreviewModal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          fileUrl={previewFile?.url || ''}
          fileName={previewFile?.name || ''}
          title={previewFile?.title}
        />
</main>
  );
};

export default Dashboard;
