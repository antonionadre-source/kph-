import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
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
  Key,
  Bed,
  Droplets,
  CheckCircle,
  User,
  Check,
  CheckSquare
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
    status: 'Pending' | 'In Progress' | 'Completed';
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
      gateway: 'stripe' | 'wallee' | 'manual';
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
            gateway: 'wallee' as const,
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
            gateway: 'wallee' as const,
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

  const isStaff = user?.email?.toLowerCase().trim().endsWith('@krakenpfm.ch') || user?.email?.toLowerCase().trim() === 'kai@krakenpfm.ch' || user?.email?.toLowerCase().trim() === 'antonio.nadre@anotherstar.com';

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
      setActionAlert(`SUCCESS: Dispatch Protocol & Digital Estimate sent safely to ${req.email || 'client'}!`);
      setTimeout(() => setActionAlert(null), 4000);
  };

  const handleScheduleService = (req: MaintenanceRequest) => {
      setActionAlert(`SUCCESS: Dispatch Calendar reservation confirmed for ${req.date}.`);
      setTimeout(() => setActionAlert(null), 4000);
  };

  const handleGenerateInvoice = (req: MaintenanceRequest) => {
      setActionAlert(`SUCCESS: Payrexx digital invoice & invoice slip generated for CHF ${req.amount.toLocaleString()}.`);
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
                {['all', 'Pending', 'In Progress', 'Completed'].map((status) => {
                    const isActive = (status === 'all' && filterStatus === 'all') || filterStatus === status;
                    const statusColorMap = {
                        all: 'from-blue-600 to-indigo-600 border-indigo-500/50 text-white shadow-[0_10px_20px_rgba(79,70,229,0.25)]',
                        Pending: 'from-amber-500 to-orange-500 border-orange-500/50 text-slate-950 shadow-[0_10px_20px_rgba(245,158,11,0.25)]',
                        'In Progress': 'from-blue-500 to-sky-600 border-sky-500/50 text-white shadow-[0_10px_20px_rgba(14,165,233,0.25)]',
                        Completed: 'from-emerald-500 to-teal-600 border-teal-500/50 text-white shadow-[0_10px_20px_rgba(16,185,129,0.25)]'
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
                            {status === 'all' ? 'All Requests' : status}
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
                                                            'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                                                        }`}
                                                    >
                                                        {req.status === 'In Progress' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>}
                                                        {req.status === 'Pending' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>}
                                                        {req.status === 'Completed' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
                                                        {req.status}
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
             {/* Dynamic Detail-Inspector Overlay Modal */}
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

      </div>
    </main>
  );
};

export default Dashboard;
