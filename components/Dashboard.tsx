import React, { useState, useEffect } from 'react';
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
import { db } from './firebase';
import { detectZone } from './ConsultationPage';
import { DetailInspectorModal } from './DetailInspectorModal';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp
} from 'firebase/firestore';

// Maintenance & Cleaning Request Datastructure
type MaintenanceRequest = {
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

// Seed fallback data for fresh developer portals
const INITIAL_SEED_DATA = [
    { 
        client: "Mandarin Oriental Resort", 
        service: "B2B Deep Cleaning", 
        date: "2026-06-01", 
        status: "In Progress" as const, 
        priority: "High" as const, 
        amount: 4800, 
        email: "facilities@mandarin.ch", 
        phone: "+41 44 222 11 00", 
        address: "Quai Turrettini 1, 1201 Geneva", 
        notes: "Ensure specialized marble polish is completed. Standard corporate credentials requested on site.", 
        mediaUrls: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop"], 
        mediaNames: ["lounge_marble_area.jpg"],
        bookingMode: 'direct',
        accessMethod: 'Coordinate with Operational Gate Staff',
        time: '08:00 - 17:00',
        services: [
            {
                type: 'deep-cleaning',
                description: 'Office Deep Cleaning | 12 Bed/Offices | 8 Bath | Frequency: Weekly | Day: Mondays',
                price: 4800,
                duration: 9,
                details: {
                    bedrooms: 12,
                    bathrooms: 8,
                    frequency: 'Weekly',
                    recurringDayPreference: 'Monday',
                    balconyCount: 4,
                    storageCount: 2,
                    carpetCount: 12,
                    furnitureCount: 24
                }
            }
        ],
        payment: {
            method: 'card' as const,
            gateway: 'payrexx' as const,
            last4: '4242',
            brand: 'visa',
            cardholderName: 'Facilities Manager',
            expiryMonth: '08',
            expiryYear: '28',
            transactionId: 'ch_3M3pxuLkdIj789BC0298aKj1',
            amountCharged: 720,
            currency: 'CHF',
            status: 'captured' as const,
            billingPostal: '1201'
        },
        mediaAttachments: [
            {
                filename: 'lounge_marble_area.jpg',
                mimeType: 'image/jpeg',
                sizeBytes: 1548576,
                uploadedAt: '2026-05-31T10:15:30Z',
                url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop'
            }
        ],
        timestamps: {
            formSubmittedAt: '2026-05-31T10:00:23Z',
            priceCalculatedAt: '2026-05-31T09:58:12Z',
            depositCapturedAt: '2026-05-31T10:00:45Z',
            lastUpdatedAt: '2026-05-31T10:05:00Z',
            requestedServiceDate: '2026-06-01',
            requestedServiceTime: '08:00'
        },
        scheduling: {
            requestedDate: '2026-06-01',
            preferredTimeWindow: 'specific' as const,
            specificTime: '08:00',
            estimatedDurationHours: 9,
            estimatedEndTime: '17:00'
        }
    },
    { 
        client: "Zurich Swiss Tower B", 
        service: "End of Tenancy Deluxe", 
        date: "2026-06-08", 
        status: "Pending" as const, 
        priority: "Medium" as const, 
        amount: 2450, 
        email: "contact@towerb.ch", 
        phone: "+41 43 900 33 22", 
        address: "Brandschenkestrasse 90, 8002 Zurich", 
        notes: "15 rooms handover guarantee protocol required. Client requested dual inspection reports.", 
        mediaUrls: [], 
        mediaNames: [],
        bookingMode: 'direct',
        accessMethod: 'Key under the codebox: Pin 8002',
        time: '09:00 - 18:00',
        services: [
            {
                type: 'end-of-tenancy',
                description: 'Deluxe Handover Cleaning | 15 Rooms | 4 Bathrooms | Balcony (2)',
                price: 2450,
                duration: 10,
                details: {
                    roomsCount: 15,
                    bathroomsCount: 4,
                    balconyCount: 2,
                    storageCount: 1,
                    carpetCount: 3,
                    furnitureCount: 5
                }
            }
        ],
        payment: {
            method: 'bank_transfer' as const,
            gateway: 'manual' as const,
            last4: '',
            brand: '',
            cardholderName: 'Corporate Operations',
            expiryMonth: '',
            expiryYear: '',
            transactionId: 'invoice_bank_transfer',
            amountCharged: 367.50,
            currency: 'CHF',
            status: 'pending' as const,
            billingPostal: '8002'
        },
        mediaAttachments: [],
        timestamps: {
            formSubmittedAt: '2026-05-31T08:24:12Z',
            priceCalculatedAt: '2026-05-31T08:20:00Z',
            depositCapturedAt: null,
            lastUpdatedAt: '2026-05-31T08:24:12Z',
            requestedServiceDate: '2026-06-08',
            requestedServiceTime: '09:00'
        },
        scheduling: {
            requestedDate: '2026-06-08',
            preferredTimeWindow: 'specific' as const,
            specificTime: '09:00',
            estimatedDurationHours: 10,
            estimatedEndTime: '19:00'
        }
    },
    { 
        client: "Grand Hotel Bellevue", 
        service: "Exterior Glass Facade", 
        date: "2026-05-28", 
        status: "Completed" as const, 
        priority: "Low" as const, 
        amount: 1350, 
        email: "maintenance@bellevue-gstaad.ch", 
        phone: "+41 33 748 00 00", 
        address: "Untergstaadstrasse 26, 3780 Gstaad", 
        notes: "Eco-Performance water filtration system applied. 100% certified bio products used.", 
        mediaUrls: [], 
        mediaNames: [],
        bookingMode: 'quote',
        accessMethod: 'Key box near side entrance | Pass: BELLE',
        time: '13:00 - 17:00',
        services: [
            {
                type: 'exterior-cleaning',
                description: 'Double Glass Facade Water Jet Jet wash',
                price: 1350,
                duration: 4.5,
                details: {
                    surface: 'Glass & Slate Panels',
                    material: 'Toughened Facade Glass',
                    approxSize: 340
                }
            }
        ],
        payment: {
            method: 'twint' as const,
            gateway: 'payrexx' as const,
            last4: '',
            brand: '',
            cardholderName: 'Hotel Bellevue Management',
            expiryMonth: '',
            expiryYear: '',
            transactionId: 'tw_9081267BcaKj32890',
            amountCharged: 202.50,
            currency: 'CHF',
            status: 'captured' as const,
            billingPostal: '3780'
        },
        mediaAttachments: [],
        timestamps: {
            formSubmittedAt: '2026-05-27T16:11:00Z',
            priceCalculatedAt: '2026-05-27T16:05:00Z',
            depositCapturedAt: '2026-05-27T16:12:30Z',
            lastUpdatedAt: '2026-05-28T18:00:00Z',
            requestedServiceDate: '2026-05-28',
            requestedServiceTime: '13:00'
        },
        scheduling: {
            requestedDate: '2026-05-28',
            preferredTimeWindow: 'specific' as const,
            specificTime: '13:00',
            estimatedDurationHours: 4.5,
            estimatedEndTime: '17:30'
        }
    },
];

const getClientSeedData = (userName: string, userEmail: string) => [
   { 
       client: userName, 
       service: "Initial Facility Check & Key Setup", 
       date: new Date().toISOString().split("T")[0], 
       status: "Pending" as const, 
       priority: "Medium" as const, 
       amount: 350, 
       email: userEmail, 
       phone: "+41 79 123 45 67", 
       address: "Zürich, Switzerland", 
       notes: "Welcome to Kraken PFM. This onboarding check verifies your localized passcode, key-box access codes, or smart cards. A staff member will check the premises shortly.", 
       mediaUrls: [], 
       mediaNames: [],
       bookingMode: 'direct',
       accessMethod: 'Passcode sent under SMS auth',
       time: '10:00 - 12:00',
       services: [],
       payment: {
           method: 'cash' as const,
           gateway: 'manual' as const,
           last4: '',
           brand: '',
           cardholderName: userName,
           expiryMonth: '',
           expiryYear: '',
           transactionId: 'hand_setup',
           amountCharged: 52.50,
           currency: 'CHF',
           status: 'pending' as const,
           billingPostal: '8000'
       },
       mediaAttachments: [],
       timestamps: {
           formSubmittedAt: new Date().toISOString(),
           priceCalculatedAt: new Date().toISOString(),
           depositCapturedAt: null,
           lastUpdatedAt: new Date().toISOString(),
           requestedServiceDate: new Date().toISOString().split("T")[0],
           requestedServiceTime: '10:00'
       },
       scheduling: {
           requestedDate: new Date().toISOString().split("T")[0],
           preferredTimeWindow: 'specific' as const,
           specificTime: '10:00',
           estimatedDurationHours: 2,
           estimatedEndTime: '12:00'
       }
   }
];

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
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
    try { return JSON.parse(localStorage.getItem('kraken_email_history') || '[]'); } catch { return []; }
  });
  const [confirmationStatuses, setConfirmationStatuses] = useState<Record<string,'confirmed'|'pending'|'none'>>(() => {
    try { return JSON.parse(localStorage.getItem('kraken_confirm_status') || '{}'); } catch { return {}; }
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

  // Navigation & Tab States: 'requests' | 'careers'
  const [activeTab, setActiveTab] = useState<'requests' | 'careers'>('requests');
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(false);
  const [selectedJobApp, setSelectedJobApp] = useState<JobApplication | null>(null);
  const [careerSearchQuery, setCareerSearchQuery] = useState('');
  const [careerFilterStatus, setCareerFilterStatus] = useState('all');
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; title?: string } | null>(null);

  const isStaff = user?.email?.toLowerCase().trim().endsWith('@krakenpfm.ch') || user?.email?.toLowerCase().trim() === 'kai@krakenpfm.ch' || user?.email?.toLowerCase().trim() === 'antonio.nadre@anotherstar.com';

  const fetchJobApplications = async () => {
    if (!user) return;
    setLoadingCareers(true);
    try {
      let q;
      if (isStaff) {
        q = collection(db, 'job_applications');
      } else {
        q = query(
          collection(db, 'job_applications'),
          where('userId', '==', user.uid)
        );
      }
      const querySnapshot = await getDocs(q);
      const fetched: JobApplication[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        fetched.push({
          id: docSnap.id,
          name: data.name || '',
          phone: data.phone || '',
          position: data.position || '',
          region: data.region || '',
          permit: data.permit || '',
          startDate: data.startDate || '',
          pensum: data.pensum || '',
          certificates: data.certificates || '',
          languages: data.languages || '',
          message: data.message || '',
          cvName: data.cvName || '',
          cvData: data.cvData || '',
          cvType: data.cvType || '',
          status: data.status || 'Pending',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      setJobApplications(fetched);
    } catch (err) {
      console.error("Error fetching candidate job applications from Firestore:", err);
    } finally {
      setLoadingCareers(false);
    }
  };

  const handleJobAppStatusChange = async (appId: string, nextStatus: 'Pending' | 'Reviewed' | 'Contacted' | 'Hired' | 'Rejected') => {
    try {
      await updateDoc(doc(db, 'job_applications', appId), {
        status: nextStatus,
        updatedAt: serverTimestamp()
      });
      setJobApplications(prev => prev.map(app => app.id === appId ? { ...app, status: nextStatus } : app));
      if (selectedJobApp?.id === appId) {
        setSelectedJobApp(prev => prev ? { ...prev, status: nextStatus } : null);
      }
      setActionAlert(`Estatus de candidato actualizado a: ${nextStatus}`);
    } catch (err) {
      console.error("Error updating candidate application status:", err);
    }
  };

  // Fetch requests
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        console.log("Fetching requested cleaning records. Operator role is staff status =", isStaff);
        
        let q;
        if (isStaff) {
          // Workers console sees all submissions
          q = collection(db, 'maintenance_requests');
        } else {
          // Client only sees their own
          q = query(
            collection(db, 'maintenance_requests'),
            where('userId', '==', user.uid)
          );
        }

        const querySnapshot = await getDocs(q);
        const fetched: MaintenanceRequest[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as any;
          fetched.push({
            id: doc.id,
            client: data.client || '',
            service: data.service || '',
            date: data.date || '',
            status: data.status || 'Pending',
            priority: data.priority || 'Medium',
            amount: Number(data.amount) || 0,
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            notes: data.notes || '',
            mediaUrls: data.mediaUrls || [],
            mediaNames: data.mediaNames || [],
            bookingMode: data.bookingMode || '',
            accessMethod: data.accessMethod || '',
            time: data.time || '',
            services: data.services || [],
            // Enriched JSON schema fields
            payment: data.payment || null,
            mediaAttachments: data.mediaAttachments || [],
            timestamps: data.timestamps || null,
            scheduling: data.scheduling || null,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        });

        // Seed if totally empty to prevent cold start feedback on clean dbs
        const seedFlag = `seeded_v3_${user.uid}`;
        if (fetched.length === 0 && !localStorage.getItem(seedFlag)) {
          const seededList: MaintenanceRequest[] = [];
          
          const seedData = isStaff 
            ? INITIAL_SEED_DATA 
            : getClientSeedData(user.name, user.email);

          for (const item of seedData) {
            const newDocId = doc(collection(db, 'maintenance_requests')).id;
            const requestRef = doc(db, 'maintenance_requests', newDocId);
            
            const payload = {
              id: newDocId,
              client: item.client,
              service: item.service,
              date: item.date,
              status: item.status,
              priority: item.priority,
              amount: item.amount,
              email: item.email,
              phone: item.phone,
              address: item.address,
              notes: item.notes,
              mediaUrls: item.mediaUrls,
              mediaNames: item.mediaNames,
              bookingMode: item.bookingMode,
              accessMethod: item.accessMethod,
              time: item.time,
              services: item.services,
              // Enrichment fields from item:
              payment: item.payment || null,
              mediaAttachments: item.mediaAttachments || [],
              timestamps: item.timestamps || null,
              scheduling: item.scheduling || null,
              userId: user.uid,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            
            await setDoc(requestRef, payload);
            
            seededList.push({
              ...payload,
              id: newDocId,
              createdAt: null,
              updatedAt: null
            });
          }
          
          localStorage.setItem(seedFlag, 'true');
          setRequests(seededList);
        } else {
          // Sort descending by date
          fetched.sort((a, b) => b.date.localeCompare(a.date));
          setRequests(fetched);
        }
      } catch (error) {
        console.error('Error fetching maintenance requests from firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    fetchJobApplications();
  }, [user, isStaff]);

  // Actions
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!user) return;
      
      const targetRequest = requests.find(r => r.id === id);
      if (targetRequest && !isStaff && targetRequest.status !== 'Pending') {
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
          console.error('Error deleting document:', error);
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
          console.error('Error changing document status:', error);
      }
  };

  // Direct Status Update Selector from details
  const updateStatusDirect = async (id: string, nextStatus: 'Pending' | 'In Progress' | 'Completed') => {
      if (!user) return;
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
          console.error('Error updating status on detail panel:', error);
      }
  };

  const extractPostcode = (addr?: string): string => {
      if (!addr) return '8000';
      const match = addr.match(/\b\d{4}\b/);
      return match ? match[0] : '8000';
  };

  const handleSaveNotes = async (id: string, notesText: string) => {
      if (!user) return;
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
          setActionAlert("Notes saved and synchronized with Cloud Database.");
          setTimeout(() => setActionAlert(null), 3000);
      } catch (error) {
          console.error('Error saving notes:', error);
      }
  };

  const handleSendEmail = (req: MaintenanceRequest) => {
    const subjText = 'Kostenbestaetigung – ' + (req.service || req.client || 'Service') + ' | CHF ' + (req.amount || '0');
    const bHtml = '<!DOCTYPE html><html><head><meta charset=\'utf-8\'><style>body{font-family:Arial,sans-serif;background:#f0f4f8;margin:0;padding:0}.c{max-width:600px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)}.h{background:#0f1b2d;padding:28px 32px;text-align:center}.h h1{color:#00d4ff;margin:0;font-size:22px;letter-spacing:2px;text-transform:uppercase}.h p{color:#94a3b8;margin:4px 0 0;font-size:12px}.b{padding:28px 32px}.tbl{width:100%;border-collapse:collapse;margin:16px 0}.tbl th{background:#0f1b2d;color:#00d4ff;padding:10px 14px;text-align:left;font-size:12px;text-transform:uppercase}.tbl td{padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#334155}.tot td{font-weight:bold;background:#f8fafc}.totamt{color:#0f1b2d;font-size:18px;font-weight:900}.ft{background:#0f1b2d;padding:16px 32px;text-align:center}.ft p{color:#64748b;font-size:11px;margin:3px 0}</style></head><body><div class=\'c\'><div class=\'h\'><h1>Kraken PFM</h1><p>Properties &amp; Facilities Management</p></div><div class=\'b\'><p style=\'font-size:15px;color:#1e293b\'>Sehr geehrte Damen und Herren,<br><br>Hiermit bestaetigen wir die Kosten fuer folgende Dienstleistung:</p><table class=\'tbl\'><tr><th>Detail</th><th>Info</th></tr><tr><td>Kunde</td><td><b>' + (req.client||'N/A') + '</b></td></tr><tr><td>Service</td><td><b>' + (req.service||'Facility Management') + '</b></td></tr><tr><td>Datum</td><td><b>' + (req.date||new Date().toLocaleDateString('de-CH')) + '</b></td></tr><tr><td>Prioritaet</td><td><b>' + (req.priority||'Standard') + '</b></td></tr><tr class=\'tot\'><td><b>TOTAL (CHF)</b></td><td><span class=\'totamt\'>CHF ' + (req.amount||'0.00') + '</span></td></tr></table><p style=\'font-size:12px;color:#64748b\'>Bitte antworten Sie auf diese E-Mail zur Bestaetigung.</p></div><div class=\'ft\'><p style=\'color:#94a3b8;font-size:13px;font-weight:bold\'>Kraken Properties &amp; Facilities Management</p><p>info@krakenpfm.ch | krakenpfm.ch</p></div></div></body></html>';
    setSelectedEmailRequest(req);
    setEmailTo(req.email || '');
    setEmailCC('');
    setEmailSubject(subjText);
    setEmailBody(bHtml);
    setEmailPreviewMode(false);
    setEmailModalOpen(true);
  };

  const handleScheduleService = async (req: MaintenanceRequest) => {
      try {
          await updateDoc(doc(db, 'maintenance_requests', req.id), {
              status: 'In Progress',
              scheduledAt: serverTimestamp(),
              updatedAt: serverTimestamp()
          });

          setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'In Progress' } : r));

          // Trigger Google Calendar event & .ics download for kai@krakenpfm.ch with 1h reminder
          scheduleCalendarEventForKai(req);

          setActionAlert(`SUCCESS: Evento agendado para kai@krakenpfm.ch con recordatorio de 1 hora. Sincronizado en Firebase.`);
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
      const dateStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Factura ${invoiceNum} - Kraken PFM</title>
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
          <button class="btn-print" onclick="window.print()">📄 Imprimir / Guardar como PDF</button>
          
          <div class="header">
            <div class="logo">KRAKEN <span>PFM</span></div>
            <div class="inv-title">FACTURA DE SERVICIO<br><span style="font-size:14px; color:#64748b;">${invoiceNum}</span></div>
          </div>

          <div class="details">
            <div class="box">
              <strong>EMISOR:</strong><br>
              Kraken Properties & Facilities Management<br>
              Bahnhofstrasse 42, 8001 Zürich<br>
              Suiza • CHE-109.823.411 TVA<br>
              info@krakenpfm.ch
            </div>
            <div class="box">
              <strong>CLIENTE:</strong><br>
              ${req.client}<br>
              ${req.email || 'Sin email registrado'}<br>
              ${req.address || 'Dirección en registro'}<br>
              <strong>Fecha Emisión:</strong> ${dateStr}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Descripción del Servicio</th>
                <th>Fecha</th>
                <th style="text-align:right;">Importe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${req.service}</strong><br><span style="font-size:12px; color:#64748b;">Mantenimiento y gestión de propiedad Kraken PFM</span></td>
                <td>${req.date || dateStr}</td>
                <td style="text-align:right;">CHF ${(req.amount || 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2" style="text-align:right;">TOTAL CHF (IVA inc.):</td>
                <td style="text-align:right; color:#0284c7;">CHF ${(req.amount || 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Kraken Properties & Facilities Management AG • Cuenta IBAN: CH93 0000 0000 0000 0000 0<br>
            Documento fiscal válido generado por el sistema de gestión Kraken.
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setActionAlert(`SUCCESS: Factura PDF generada e interactivamente lista para guardar o imprimir.`);
      setTimeout(() => setActionAlert(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;

      const newDocId = doc(collection(db, 'maintenance_requests')).id;
      const requestRef = doc(db, 'maintenance_requests', newDocId);

      // Default estimate logic
      const servicePricing: { [key: string]: number } = {
        'End of Tenancy': 1400,
        'Deep Cleaning': 2200,
        'Maintenance': 600,
        'Consultation': 350,
        'B2B Premium Complex': 4500,
        'Office Routine': 850
      };
      
      const parsedAmount = Number(newRequest.amount) || servicePricing[newRequest.service] || 600;

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
          phone: newRequest.phone || '+41 44 000 00 00',
          address: newRequest.address || 'Switzerland',
          service: newRequest.service || 'FACILITY MAINTENANCE',
          date: newRequest.date || new Date().toISOString().split('T')[0],
          status: 'Pending' as const,
          priority: newRequest.priority,
          amount: parsedAmount,
          notes: newRequest.notes || 'Manually registered booking.',
          mediaUrls: mediaUrlsInput,
          mediaNames: mediaNamesInput,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
      };

      try {
          await setDoc(requestRef, payload);
          
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
          console.error('Error registering new maintenance request:', error);
      }
  };

  // Summaries Calculations
  const totalSubmissions = requests.length;
  const totalRevenue = requests.reduce((acc, curr) => acc + curr.amount, 0);
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
    if (!selectedEmailRequest || !emailTo) return;
    setEmailSending(true);
    const entry = {
      id: Date.now().toString(),
      requestId: selectedEmailRequest.id,
      clientName: selectedEmailRequest.client || 'Unknown',
      clientEmail: emailTo,
      subject: emailSubject,
      sentAt: new Date().toISOString(),
      status: 'pending' as 'sent' | 'pending' | 'error',
      amount: selectedEmailRequest.amount || '0',
    };
    try {
      await fetch('https://hook.eu1.make.com/uc1q47ys3jwjkl3bm9cxpvbdgp9i1u37', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cost_confirmation_email',
          to: emailTo, cc: emailCC, subject: emailSubject,
          html: emailBody,
          requestId: selectedEmailRequest.id,
          client: selectedEmailRequest.client,
          amount: selectedEmailRequest.amount,
          service: selectedEmailRequest.service,
          sentAt: entry.sentAt,
        }),
      });
      entry.status = 'sent';
      setActionAlert('SUCCESS: Cost confirmation email sent to ' + emailTo);
    } catch {
      entry.status = 'error';
      setActionAlert('ERROR: Email delivery failed. Check network and try again.');
    }
    const newHist = [entry, ...emailHistory];
    setEmailHistory(newHist);
    localStorage.setItem('kraken_email_history', JSON.stringify(newHist));
    setEmailSending(false);
    setEmailModalOpen(false);
  };

  const markConfirmed = (requestId: string, status: 'confirmed' | 'pending' | 'none') => {
    const n = { ...confirmationStatuses, [requestId]: status };
    setConfirmationStatuses(n);
    localStorage.setItem('kraken_confirm_status', JSON.stringify(n));
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
    <main className="bg-slate-55 min-h-screen pt-32 pb-20 font-sans text-slate-800 relative overflow-hidden bg-slate-50">
      {/* Background Radial Ambiance */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-slate-100/50 rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-6 relative z-10">

        {/* Console Header */}
        <div className="mb-12 animate-fade-in">
            <div className="bg-white backdrop-blur-3xl p-10 rounded-[3.5rem] border border-slate-200/80 shadow-[0_30px_60px_rgba(0,0,0,0.04)] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-px bg-blue-500"></span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                          {isStaff ? '🛡️ STAFF SUPERVISOR CONSOLE' : '🔒 Secure Client Portal'}
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 text-slate-900">
                        {isStaff ? 'Worker' : 'My Secure'}{' '}
                        <span className="text-blue-600">{isStaff ? 'Dashboard' : 'Facilities'}</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em]">
                        Welcome back, {user ? user.name : 'Authorized Partner'} 
                        {isStaff && <span className="text-emerald-700 text-xs font-black ml-3 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Active Operator</span>}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 md:gap-6 w-full xl:w-auto">
                    <motion.div 
                      key="active"
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-white hover:bg-slate-50 shadow-[0_15px_35px_rgba(0,0,0,0.02)] transition-all duration-300 px-6 py-5 rounded-[2rem] border border-slate-200 flex items-center gap-4 flex-1 md:flex-initial min-w-[200px]"
                    >
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
                          <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5 leading-none">
                            {isStaff ? 'Active Tasks' : 'Active Services'}
                        </p>
                        <p className="text-2xl font-black text-slate-800 leading-tight mt-1">{activeJobs}</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      key="high"
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-white hover:bg-slate-50 shadow-[0_15px_35px_rgba(0,0,0,0.02)] transition-all duration-300 px-6 py-5 rounded-[2rem] border border-slate-200 flex items-center gap-4 flex-1 md:flex-initial min-w-[200px]"
                    >
                      <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200">
                          <AlertTriangle className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-0.5 leading-none">
                            {isStaff ? 'High Priority' : 'Milestones'}
                        </p>
                        <p className="text-2xl font-black text-rose-600 leading-tight mt-1">{highPriorityCount}</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      key="rev"
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-white hover:bg-slate-50 shadow-[0_15px_35px_rgba(0,0,0,0.02)] transition-all duration-300 px-6 py-5 rounded-[2rem] border border-slate-200 flex items-center gap-4 flex-1 md:flex-initial min-w-[220px]"
                    >
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200">
                          <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5 leading-none">
                            {isStaff ? 'Est. Revenue' : 'Est. Budget'}
                        </p>
                        <p className="text-2xl font-black text-emerald-600 leading-tight mt-1 font-mono">CHF {totalRevenue.toLocaleString()}</p>
                      </div>
                    </motion.div>
                </div>
            </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-[#002D5B] text-white shadow-lg shadow-blue-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clipboard className="w-4 h-4" />
            <span>Solicitudes & Borradores ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('careers')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'careers'
                ? 'bg-[#002D5B] text-white shadow-lg shadow-blue-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Mi Carrera / CVs ({jobApplications.length})</span>
          </button>
        </div>

        {activeTab === 'careers' ? (
          /* ================= MI CARRERA & CVs VIEW ================= */
          <div className="space-y-8 animate-fade-in mb-12">
            {/* Careers Search & Status Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={careerSearchQuery}
                  onChange={(e) => setCareerSearchQuery(e.target.value)}
                  placeholder="Buscar candidato por nombre, cargo, teléfono o región..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-10 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                />
                {careerSearchQuery && (
                  <button onClick={() => setCareerSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {['all', 'Pending', 'Reviewed', 'Contacted', 'Hired', 'Rejected'].map((statusKey) => {
                  const isActive = careerFilterStatus === statusKey;
                  const labelMap: Record<string, string> = {
                    all: 'Todos',
                    Pending: 'Pendiente',
                    Reviewed: 'Revisado',
                    Contacted: 'Contactado',
                    Hired: 'Contratado',
                    Rejected: 'Descartado'
                  };
                  return (
                    <button
                      key={statusKey}
                      onClick={() => setCareerFilterStatus(statusKey)}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#002D5B] text-white border-blue-900 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {labelMap[statusKey] || statusKey}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Candidatos & Currículums (CVs)</h3>
                    <p className="text-xs text-slate-500 font-bold">
                      {jobApplications.length} solicitudes recibidas en la página de Mi Carrera
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100/70 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em] border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 pl-8">Candidato / Contacto</th>
                      <th className="px-6 py-4">Puesto Solicitado</th>
                      <th className="px-6 py-4">Región & Permiso</th>
                      <th className="px-6 py-4">Incorporación</th>
                      <th className="px-6 py-4">Documento CV</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-right pr-8">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {loadingCareers ? (
                      <tr>
                        <td colSpan={7} className="px-8 py-16 text-center text-slate-400 font-bold italic">
                          <span className="inline-block animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2 align-middle"></span>
                          Cargando candidatos desde la base de datos...
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
                        <td colSpan={7} className="px-8 py-16 text-center text-slate-400 font-bold">
                          No hay postulaciones registradas en este momento.
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
                          className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4 pl-8">
                            <div className="font-black text-slate-900 group-hover:text-blue-600 transition-colors text-base">
                              {app.name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                              <span>{app.phone}</span>
                              {app.phone && (
                                <a
                                  href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-emerald-600 hover:underline font-bold text-[10px]"
                                >
                                  WhatsApp
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 font-bold text-slate-800 text-xs">
                            {app.position || 'Solicitud General'}
                          </td>

                          <td className="px-6 py-4 text-xs font-medium text-slate-600">
                            <div>{app.region || 'Suiza'}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Permiso: {app.permit || 'No especificado'}</div>
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                            <div>{app.startDate || 'Inmediata'}</div>
                            <div className="text-[10px] text-slate-400">Jornada: {app.pensum || '100%'}</div>
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
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer"
                                  title="Visualizar CV en pantalla"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Ver</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => downloadFileSafely(app.cvData!, app.cvName || `${app.name.replace(/\s+/g, '_')}_CV.pdf`)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer"
                                  title="Descargar CV seguro"
                                >
                                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Descargar</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Sin archivo</span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <select
                              value={app.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleJobAppStatusChange(app.id, e.target.value as any)}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer ${
                                app.status === 'Hired' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                app.status === 'Contacted' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                app.status === 'Reviewed' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                                app.status === 'Rejected' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                                'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Pending">Pendiente</option>
                              <option value="Reviewed">Revisado</option>
                              <option value="Contacted">Contactado</option>
                              <option value="Hired">Contratado</option>
                              <option value="Rejected">Descartado</option>
                            </select>
                          </td>

                          <td className="px-6 py-4 text-right pr-8">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedJobApp(app); }}
                              className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all border border-slate-200"
                            >
                              Ver Ficha
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
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-10 gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by client, service, address or notes..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-5 pr-12 text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {['all', 'Pending', 'In Progress', 'Completed', 'Draft'].map((status) => {
                    const isActive = (status === 'all' && filterStatus === 'all') || filterStatus === status;
                    const statusColorMap = {
                        all: 'from-blue-600 to-indigo-600 border-indigo-500/50 text-white shadow-[0_10px_20px_rgba(79,70,229,0.25)]',
                        Pending: 'from-amber-500 to-orange-500 border-orange-500/50 text-slate-950 shadow-[0_10px_20px_rgba(245,158,11,0.25)]',
                        'In Progress': 'from-blue-500 to-sky-600 border-sky-500/50 text-white shadow-[0_10px_20px_rgba(14,165,233,0.25)]',
                        Completed: 'from-emerald-500 to-teal-600 border-teal-500/50 text-white shadow-[0_10px_20px_rgba(16,185,129,0.25)]',
                        Draft: 'from-purple-600 to-fuchsia-600 border-purple-500/50 text-white shadow-[0_10px_20px_rgba(168,85,247,0.25)]'
                    };
                    const activeStyle = statusColorMap[status as keyof typeof statusColorMap] || statusColorMap.all;

                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                                isActive 
                                    ? `bg-gradient-to-r ${activeStyle}` 
                                    : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                            }`}
                        >
                            {status === 'all' ? 'All Requests' : status === 'Draft' ? 'Borradores / Drafts' : status}
                        </button>
                    );
                })}
            </div>

            {/* Action Trigger */}
            <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl shadow-[0_20px_40px_rgba(37,99,235,0.15)] flex items-center justify-center gap-3 transition-all font-black text-[11px] uppercase tracking-[0.2em] shrink-0 cursor-pointer"
            >
                <PlusIcon className="w-5 h-5" />
                {isFormOpen ? 'Hide Portal' : isStaff ? 'Enter Custom Service' : 'Add New Request'}
            </motion.button>
        </div>

        {/* Main Work Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Form Intake (Animate Slot) */}
            <AnimatePresence>
              {isFormOpen && (
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="lg:col-span-1"
                  >
                      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                          <div className="p-8 bg-slate-50/80 border-b border-slate-100">
                              <h3 className="font-black text-xl uppercase tracking-tight text-slate-800">
                                  {isStaff ? 'Direct Staff Entry' : 'New Service Request'}
                              </h3>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                  {isStaff ? 'Record B2B/Client appointments' : 'Enter property & clean details'}
                              </p>
                          </div>
                          
                          <form onSubmit={handleSubmit} className="p-8 space-y-5">
                              {isStaff ? (
                                  <>
                                      {/* Client Name */}
                                      <div className="space-y-1.5">
                                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Client Name</label>
                                          <input 
                                              type="text" 
                                              required
                                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                              placeholder="e.g. Acme Corp AG or John Doe"
                                              value={newRequest.client}
                                              onChange={e => setNewRequest({...newRequest, client: e.target.value})}
                                          />
                                      </div>

                                      {/* Contact Email & Phone */}
                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-1.5">
                                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-3">Client Email</label>
                                              <input 
                                                  type="email" 
                                                  required={isStaff}
                                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                                  placeholder="name@mail.com"
                                                  value={newRequest.email}
                                                  onChange={e => setNewRequest({...newRequest, email: e.target.value})}
                                              />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-3">Telephone</label>
                                              <input 
                                                  type="text" 
                                                  required
                                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400" 
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
                                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Telephone</label>
                                      <input 
                                          type="text" 
                                          required
                                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                          placeholder="+41 79..."
                                          value={newRequest.phone}
                                          onChange={e => setNewRequest({...newRequest, phone: e.target.value})}
                                      />
                                  </div>
                              )}

                              {/* Physical Address */}
                              <div className="space-y-1.5">
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Service Address</label>
                                  <input 
                                      type="text" 
                                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                      placeholder="street, postal code & city in Switzerland"
                                      value={newRequest.address}
                                      onChange={e => setNewRequest({...newRequest, address: e.target.value})}
                                  />
                              </div>

                              {/* Service Selection */}
                              <div className="space-y-1.5">
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Service Classification</label>
                                  <select 
                                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                                      value={newRequest.service}
                                      onChange={e => setNewRequest({...newRequest, service: e.target.value})}
                                      required
                                  >
                                      <option value="">Select Line Of Work...</option>
                                      <option value="End of Tenancy Deluxe">End of Tenancy Deluxe (+ Handover Guarantee)</option>
                                      <option value="B2B Commercial Cleaning">B2B Commercial Cleaning (Office/Enterprise)</option>
                                      <option value="Regular Deep Cleaning">Regular Deep Cleaning (Residential)</option>
                                      <option value="Professional Car Detailing">Professional Car Detailing (Mobile Dry-Soap)</option>
                                      <option value="Facade & Glass Restoration">Facade & Glass Restoration (Facility)</option>
                                      <option value="Emergency Rapid Cleanup">Emergency Rapid Cleanup</option>
                                  </select>
                              </div>

                              {/* Date & Priority */}
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Execution Date</label>
                                      <input 
                                          type="date" 
                                          required
                                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700" 
                                          value={newRequest.date}
                                          onChange={e => setNewRequest({...newRequest, date: e.target.value})}
                                      />
                                  </div>
                                  <div className="space-y-1.5">
                                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Priority</label>
                                      <select 
                                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                                          value={newRequest.priority}
                                          onChange={e => setNewRequest({...newRequest, priority: e.target.value as any})}
                                      >
                                          <option value="Low">Low</option>
                                          <option value="Medium">Medium</option>
                                          <option value="High">High</option>
                                      </select>
                                  </div>
                              </div>

                              {/* Amount (Budget CHF) */}
                              <div className="space-y-1.5">
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Budget / Quoted Price (CHF)</label>
                                  <input 
                                      type="number" 
                                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                      placeholder="e.g. 1450 (Leave blank for default classification tier)"
                                      value={newRequest.amount}
                                      onChange={e => setNewRequest({...newRequest, amount: e.target.value})}
                                  />
                              </div>

                              {/* Notes */}
                              <div className="space-y-1.5">
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Operational Notes</label>
                                  <textarea 
                                      rows={2}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                                      placeholder="Specific requests, keys, access instructions..."
                                      value={newRequest.notes}
                                      onChange={e => setNewRequest({...newRequest, notes: e.target.value})}
                                  />
                              </div>

                              {/* Custom Media Attachment URL */}
                              <div className="space-y-1.5">
                                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">External Image Links (commas to split)</label>
                                  <input 
                                      type="text" 
                                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                      placeholder="https://example.com/photo1.jpg, https://example.com/photo2.png"
                                      value={newRequest.mediaUrlString}
                                      onChange={e => setNewRequest({...newRequest, mediaUrlString: e.target.value})}
                                  />
                              </div>

                              <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                className="w-full py-4.5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-[0_20px_40px_rgba(37,99,235,0.15)] transition-all mt-3"
                              >
                                Submit Request Record
                              </motion.button>
                          </form>
                      </div>
                  </motion.div>
              )}
            </AnimatePresence>

            {/* Right Column: Central Submissions Grid and Queue */}
            <div className={`${isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-700`}>
                
                {/* Visual Header describing Queue Scope */}
                <div className="bg-white p-5 rounded-[2.5rem] border border-slate-200 mb-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase tracking-wider text-slate-500 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                            <Clipboard className="w-4 h-4" />
                        </span>
                        <span>Showing <span className="text-slate-800 font-mono text-xs font-bold">{filteredRequests.length}</span> of <span className="text-slate-800 font-mono text-xs font-bold">{totalSubmissions}</span> database incidents</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <span className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60 text-[9px] text-amber-700 font-bold"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span> Pending</span>
                        <span className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200/60 text-[9px] text-blue-700 font-bold"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span> In Progress</span>
                        <span className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 text-[9px] text-emerald-700 font-bold"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Completed</span>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] font-black tracking-[0.3em] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-5 pl-8">Service ID</th>
                                    <th className="px-6 py-5">Client Company & Contact</th>
                                    <th className="px-6 py-5">Classification</th>
                                    <th className="px-6 py-5">Schedule</th>
                                    <th className="px-6 py-5 whitespace-nowrap">Media Attachments</th>
                                    <th className="px-6 py-5">Status Tier</th>
                                    <th className="px-6 py-5 text-right pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-bold">
                                            <span className="inline-block animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3 align-middle"></span>
                                            Querying Switzerland facilities ledger...
                                        </td>
                                    </tr>
                                ) : filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-20 text-center text-slate-400 font-bold">
                                            No facility records found matching active filters.
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
                                              className={`border-b border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer group ${
                                                  selectedRequest?.id === req.id ? 'bg-blue-50' : ''
                                              }`}
                                            >
                                                {/* ID */}
                                                <td className="px-6 py-5 pl-8 font-mono text-[9px] text-slate-400 whitespace-nowrap">
                                                    #{req.id.substring(0, 8).toUpperCase()}
                                                </td>
                                                
                                                {/* Client Name */}
                                                <td className="px-6 py-5 font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-800 group-hover:text-blue-600 transition-colors">{req.client}</span>
                                                        {isStaff && req.email && (
                                                            <span className="text-[10px] text-slate-500 normal-case font-medium mt-0.5 lowercase truncate max-w-[150px]">{req.email}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                
                                                {/* Service Name */}
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-slate-700 text-xs">{req.service}</span>
                                                        <span className="text-[10px] text-emerald-600 font-mono font-black mt-0.5">CHF {req.amount.toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                
                                                {/* Date */}
                                                <td className="px-6 py-5 text-slate-500 font-mono text-xs whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <ClockIcon className="w-3.5 h-3.5 text-slate-300" />
                                                        <span>{req.date}</span>
                                                    </div>
                                                </td>
 
                                                {/* Media uploads indicator */}
                                                <td className="px-6 py-5">
                                                    {hasMedia ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                                                            <ImageIcon className="w-3.5 h-3.5" />
                                                            {req.mediaUrls?.length} Attachment{req.mediaUrls && req.mediaUrls.length > 1 ? 's' : ''}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-350 text-xs">—</span>
                                                    )}
                                                </td>
                                                
                                                {/* Status pill with click to next step */}
                                                <td className="px-6 py-5">
                                                    <span 
                                                        onClick={(e) => handleStatusChange(req.id, req.status, e)}
                                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest cursor-pointer select-none transition-all border whitespace-nowrap ${
                                                            req.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' :
                                                            req.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' :
                                                            req.status === 'Draft' ? 'bg-purple-50 text-purple-800 border-purple-200 shadow-sm' :
                                                            'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                                                        }`}
                                                    >
                                                        {req.status === 'In Progress' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>}
                                                        {req.status === 'Pending' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>}
                                                        {req.status === 'Completed' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
                                                        {req.status === 'Draft' && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>}
                                                        {req.status === 'Draft' ? 'Borrador / Draft' : req.status}
                                                    </span>
                                                </td>
                                                
                                                {/* actions */}
                                                <td className="px-6 py-5 text-right pr-8 w-20">
                                                    <div className="flex items-center justify-end gap-1.5" >
                                                         <motion.button
                                                           whileHover={{ scale: 1.08 }}
                                                           whileTap={{ scale: 0.95 }}
                                                           onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                                                           className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-600 rounded-xl text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer border border-slate-200/45"
                                                           title="Open full inspector details"
                                                         >
                                                             Info
                                                         </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); handleSendEmail(req); }}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-[#0f1b2d] rounded-xl text-blue-500 hover:text-[#00d4ff] text-[9px] font-black uppercase tracking-wider transition-all duration-150 flex items-center gap-1"
                    title="Send Cost Confirmation Email"
                  >
                    <Mail size={11} /> Email
                  </motion.button>
                  {confirmationStatuses[req.id] === 'confirmed' && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[8px] font-black">OK</span>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); markConfirmed(req.id, confirmationStatuses[req.id] === 'confirmed' ? 'none' : 'confirmed'); }}
                    className={`px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${confirmationStatuses[req.id] === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 hover:bg-green-50 text-slate-400 hover:text-green-600'}`}
                    title="Toggle Client Approval"
                  >
                    <Check size={11} /> {confirmationStatuses[req.id] === 'confirmed' ? 'Approved' : 'Approve'}
                  </motion.button>
                                                         {(isStaff || req.status === 'Pending') && (
                                                             <motion.button 
                                                                 whileHover={{ scale: 1.15, color: "#f43f5e" }}
                                                                 whileTap={{ scale: 0.8 }}
                                                                 onClick={(e) => handleDelete(req.id, e)}
                                                                 className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                                                 title="Delete Quote Record"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 bg-[#002D5B] text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <User className="w-6 h-6 text-blue-300" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl">{selectedJobApp.name}</h3>
                                    <p className="text-xs text-blue-200 font-bold">{selectedJobApp.position || 'Candidato a Empleo'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedJobApp(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Teléfono / Contacto</span>
                                    <span className="font-black text-slate-900 text-base">{selectedJobApp.phone}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Permiso de Trabajo</span>
                                    <span className="font-bold text-slate-800">{selectedJobApp.permit || 'No especificado'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Región / Cantón</span>
                                    <span className="font-bold text-slate-800">{selectedJobApp.region || 'Suiza'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Incorporación</span>
                                    <span className="font-bold text-slate-800">{selectedJobApp.startDate || 'Inmediata'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Jornada Deseada (Pensum)</span>
                                    <span className="font-bold text-slate-800">{selectedJobApp.pensum || '100%'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Certificados / Conducir</span>
                                    <span className="font-bold text-slate-800">{selectedJobApp.certificates || 'Ninguno'}</span>
                                </div>
                            </div>

                            {selectedJobApp.languages && (
                                <div>
                                    <span className="text-xs font-black uppercase text-slate-400 block tracking-wider mb-1">Idiomas</span>
                                    <p className="p-3 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-200">{selectedJobApp.languages}</p>
                                </div>
                            )}

                            {selectedJobApp.message && (
                                <div>
                                    <span className="text-xs font-black uppercase text-slate-400 block tracking-wider mb-1">Mensaje / Presentación</span>
                                    <p className="p-4 bg-slate-50 rounded-xl text-slate-700 italic border border-slate-200 whitespace-pre-wrap">{selectedJobApp.message}</p>
                                </div>
                            )}

                            <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs font-black text-blue-900 uppercase block">Documento de Currículum (CV)</span>
                                    <span className="text-xs text-blue-700 font-mono font-bold">{selectedJobApp.cvName || 'Currículum Subido'}</span>
                                </div>
                                {selectedJobApp.cvData ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewFile({
                                                url: selectedJobApp.cvData!,
                                                name: selectedJobApp.cvName || `${selectedJobApp.name.replace(/\s+/g, '_')}_CV.pdf`,
                                                title: `Currículum • ${selectedJobApp.name}`
                                            })}
                                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>Previsualizar</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => downloadFileSafely(selectedJobApp.cvData!, selectedJobApp.cvName || `${selectedJobApp.name.replace(/\s+/g, '_')}_CV.pdf`)}
                                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>Descargar CV</span>
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400 font-bold italic">No se adjuntó archivo de CV</span>
                                )}
                            </div>

                            <div>
                                <span className="text-xs font-black uppercase text-slate-400 block tracking-wider mb-2">Cambiar Estado de Selección</span>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: 'Pending', label: 'Pendiente' },
                                        { key: 'Reviewed', label: 'Revisado' },
                                        { key: 'Contacted', label: 'Contactado' },
                                        { key: 'Hired', label: 'Contratado' },
                                        { key: 'Rejected', label: 'Descartado' }
                                    ].map(st => (
                                        <button
                                            key={st.key}
                                            onClick={() => handleJobAppStatusChange(selectedJobApp.id, st.key as any)}
                                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all ${
                                                selectedJobApp.status === st.key
                                                    ? 'bg-[#002D5B] text-white border-blue-900 shadow-md'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
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
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mx-4 mb-4">
          <div className="bg-[#0f1b2d] px-6 py-4 flex items-center justify-between cursor-pointer select-none" onClick={() => setShowEmailHistory(v => !v)}>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#00d4ff]" />
              <h3 className="text-white font-black text-sm uppercase tracking-widest">Email Confirmation Center</h3>
              <span className="bg-[#00d4ff] text-[#0f1b2d] text-[10px] font-black px-2 py-0.5 rounded-full">{emailHistory.length}</span>
            </div>
            <ArrowLeft size={16} className={`text-slate-400 transition-transform duration-300 ${showEmailHistory ? 'rotate-90' : '-rotate-90'}`} />
          </div>
          <div className="grid grid-cols-5 divide-x divide-slate-100 border-b border-slate-100">
            {([
              { label: 'Total', value: emailStats.total, color: 'text-slate-700', bg: 'bg-white', icon: '📨' },
              { label: 'Delivered', value: emailStats.sent, color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
              { label: 'Pending', value: emailStats.pending, color: 'text-yellow-500', bg: 'bg-yellow-50', icon: '⏳' },
              { label: 'Failed', value: emailStats.error, color: 'text-red-500', bg: 'bg-red-50', icon: '❌' },
              { label: 'Confirmed', value: emailStats.confirmed, color: 'text-[#00d4ff]', bg: 'bg-slate-50', icon: '🎯' },
            ] as const).map((stat, i) => (
              <div key={i} className={`${stat.bg} px-3 py-3 text-center`}>
                <div className="text-base">{stat.icon}</div>
                <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
          {showEmailHistory && (
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                {(['all','sent','pending','error'] as const).map(f => (
                  <button key={f} onClick={() => setEmailHistoryFilter(f)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${emailHistoryFilter === f ? 'bg-[#0f1b2d] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {f === 'all' ? 'All' : f === 'sent' ? 'Sent' : f === 'pending' ? 'Pending' : 'Failed'}
                  </button>
                ))}
                <input type="text" value={emailHistoryClientFilter} onChange={e => setEmailHistoryClientFilter(e.target.value)} placeholder="Filter by client..." className="border border-slate-200 rounded-full px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#00d4ff] flex-1 min-w-0 max-w-xs" />
              </div>
              {filteredEmailHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Mail size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No emails sent yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-[#0f1b2d] text-[#00d4ff]">
                      <th className="px-3 py-2.5 text-left font-black uppercase tracking-wider">Date</th>
                      <th className="px-3 py-2.5 text-left font-black uppercase tracking-wider">Client</th>
                      <th className="px-3 py-2.5 text-left font-black uppercase tracking-wider">To</th>
                      <th className="px-3 py-2.5 text-right font-black uppercase tracking-wider">CHF</th>
                      <th className="px-3 py-2.5 text-center font-black uppercase tracking-wider">Status</th>
                      <th className="px-3 py-2.5 text-center font-black uppercase tracking-wider">Confirmed</th>
                      <th className="px-3 py-2.5 text-center font-black uppercase tracking-wider">Action</th>
                    </tr></thead>
                    <tbody>
                      {filteredEmailHistory.map((entry, idx) => (
                        <tr key={entry.id} className={`border-t border-slate-100 ${idx%2===0?'bg-white':'bg-slate-50'} hover:bg-blue-50 transition-colors`}>
                          <td className="px-3 py-2.5 text-slate-400 whitespace-nowrap">{new Date(entry.sentAt).toLocaleDateString('de-CH')} {new Date(entry.sentAt).toLocaleTimeString('de-CH',{hour:'2-digit',minute:'2-digit'})}</td>
                          <td className="px-3 py-2.5 font-bold text-slate-800">{entry.clientName}</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-[120px]">{entry.clientEmail}</td>
                          <td className="px-3 py-2.5 text-right font-black text-[#0f1b2d]">{entry.amount}</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${entry.status==='sent'?'bg-green-100 text-green-700':entry.status==='pending'?'bg-yellow-100 text-yellow-600':'bg-red-100 text-red-600'}`}>
                              {entry.status==='sent'?'Sent':entry.status==='pending'?'Pending':'Failed'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <select value={confirmationStatuses[entry.requestId]||'none'} onChange={e => markConfirmed(entry.requestId, e.target.value as 'confirmed'|'pending'|'none')} className="text-[10px] border border-slate-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#00d4ff] bg-white">
                              <option value="none">— None —</option>
                              <option value="pending">Awaiting</option>
                              <option value="confirmed">Confirmed</option>
                            </select>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <button onClick={() => doResendEmail(entry)} className="px-2 py-1 rounded-md bg-[#0f1b2d] text-white text-[9px] font-bold hover:bg-slate-700 transition-colors">Resend</button>
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
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={e => { if (e.target === e.currentTarget) setEmailModalOpen(false); }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
              <div className="bg-[#0f1b2d] px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-[#00d4ff] font-black text-base uppercase tracking-widest flex items-center gap-2"><Mail size={16}/> Send Cost Confirmation</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Client: {selectedEmailRequest.client} · CHF {selectedEmailRequest.amount}</p>
                </div>
                <button onClick={() => setEmailModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"><X size={18}/></button>
              </div>
              <div className="bg-slate-100 px-6 pt-3 flex gap-2 flex-shrink-0 border-b border-slate-200">
                <button onClick={() => setEmailPreviewMode(false)} className={`px-4 py-2 rounded-t-lg text-xs font-bold uppercase tracking-wider transition-all ${!emailPreviewMode ? 'bg-white text-[#0f1b2d] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Compose</button>
                <button onClick={() => setEmailPreviewMode(true)} className={`px-4 py-2 rounded-t-lg text-xs font-bold uppercase tracking-wider transition-all ${emailPreviewMode ? 'bg-white text-[#0f1b2d] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Preview</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {!emailPreviewMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">To *</label>
                        <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent" placeholder="client@example.com"/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">CC (optional)</label>
                        <input type="email" value={emailCC} onChange={e => setEmailCC(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent" placeholder="cc@example.com"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Subject</label>
                      <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Body (HTML)</label>
                      <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={14} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent resize-none"/>
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 text-xs text-slate-500 font-medium border-b border-slate-200">Email Preview</div>
                    <iframe srcDoc={emailBody} className="w-full" style={{height:'420px',border:'none'}} title="Email Preview" sandbox="allow-same-origin"/>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50 flex-shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle size={12} className="text-green-400"/> Via Kraken PFM Dispatch
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEmailModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                  <button onClick={doSendEmail} disabled={emailSending || !emailTo} className="px-5 py-2 rounded-lg bg-[#0f1b2d] text-white text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {emailSending ? <><Clock size={13} className="animate-spin"/> Sending...</> : <><Send size={13}/> Send Email</>}
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
