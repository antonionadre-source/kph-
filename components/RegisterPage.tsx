import React, { useState } from 'react';
import { useAuth } from './Auth';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from './firebase';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { 
  User as UserIcon, 
  Mail as MailIcon, 
  Lock as LockIcon, 
  Phone as PhoneIcon, 
  MapPin as MapPinIcon, 
  Key as KeyIcon, 
  Layers as LayersIcon, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Home, 
  Trees, 
  FolderPlus,
  Bath
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

const SERVICE_ID = 'service_aiv15bc'; 
const TEMPLATE_ID = 'template_aktj7t9'; 
const PUBLIC_KEY = 'sH5K84ChHyssJrarm'; 

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { t } = useTranslation();
  
  // Applet Multi-Step States
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Step 1: Account Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Address & Property Access
  const [street, setStreet] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [accessType, setAccessType] = useState('Key Safe / Lockbox');

  // Step 3: Specifications
  const [rooms, setRooms] = useState(3);
  const [toilets, setToilets] = useState(1);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasGarden, setHasGarden] = useState(false);
  const [extraNotes, setExtraNotes] = useState('');

  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      if (!name || !email || !phone || !password) {
        setError('Please fill out all contact fields.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }
    if (step === 2) {
      if (!street || !postcode || !city) {
        setError('Please enter the full address of the property.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmitRegistration = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // 1. Create client account in Firebase Auth
      const user = await register(name, email, password);
      console.log("Real client account registered in Firebase successfully ID:", user.uid);

      // 2. Prepare Detailed Notes / Onboarding checklist string
      const fullNotesText = `DETAILED CLIENT REGISTRATION AND PROPERTY ONBOARDING APPLICATION:
- Street & House: ${street}
- Postcode: ${postcode}
- City: ${city}
- Access Protocol: ${accessType}
- Rooms count: ${rooms}
- Toilets count: ${toilets}
- Has Balcony: ${hasBalcony ? 'YES' : 'NO'}
- Has Garden: ${hasGarden ? 'YES' : 'NO'}
- Client Comments: ${extraNotes || 'None'}`;

      // 3. Save as dynamic Profile Checklist request to firestore maintenance_requests collection
      const newDocId = doc(collection(db, 'maintenance_requests')).id;
      const requestRef = doc(db, 'maintenance_requests', newDocId);
      await setDoc(requestRef, {
        id: newDocId,
        userId: user.uid,
        client: name,
        service: "ONBOARDING PROFILE SETUP & VERIFICATION",
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        priority: 'Medium',
        amount: 0,
        phone: phone,
        email: email,
        address: `${street}, ${postcode} ${city}`,
        notes: fullNotesText,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log("Onboarding profile saved to Firestore as doc:", newDocId);

      // 4. Submit real email metadata directly to kai@krakenpfm.ch via EmailJS
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        phone_number: phone,
        service_address: `${street}, ${postcode} ${city}`,
        service_type: "CLIENT ONBOARDING APPLICATION",
        total_price: "CHF 0.00 (Onboarding Request)",
        amount_to_pay: "CHF 0.00",
        preferred_date: new Date().toLocaleDateString(),
        preferred_time: new Date().toLocaleTimeString(),
        payment_status: "PENDING VERIFICATION",
        transaction_id: `ONB_${Date.now()}`,
        services_list: `REGISTRATION PROFILE METADATA:
------------------------------------------
• Access Type: ${accessType}
• Bedrooms/Rooms: ${rooms}
• Bathrooms/Toilets: ${toilets}
• Balcony/Terrace: ${hasBalcony ? 'YES' : 'NO'}
• Garden Setup: ${hasGarden ? 'YES' : 'NO'}
• Extra comments: ${extraNotes || 'None'}
------------------------------------------`
      }, PUBLIC_KEY);

      console.log("Email notification sent successfully to kai@krakenpfm.ch");
      setSuccess(true);
      setTimeout(() => {
        onNavigate('clients');
      }, 3000);

    } catch (err: any) {
      console.error("Registration onboarding failed:", err);
      setError(err.message || "Failed to finalize registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const accessOptions = [
    { name: 'Key Safe / Lockbox', desc: 'Secure box located on high-safety wall' },
    { name: 'In-Person Handover', desc: 'Meet face-to-face with our cleaning specialist' },
    { name: 'Digital Code', desc: 'Electronic keypad or smartphone remote swipe access' },
    { name: 'Building Concierge / Agency', desc: 'Pick up keys from frontdesk or agency safe' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden py-16">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10 px-6"
      >
        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-150/85 shadow-[0_30px_70px_rgba(15,23,42,0.06)]">
          {/* Custom Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 font-bold text-[10px] tracking-[0.2em] px-4 py-2 rounded-2xl uppercase mb-4">
              <FolderPlus className="w-3.5 h-3.5" /> Interactive Onboarding
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Create Client Account</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.15em] mt-1.5">Submit registration request to kai@krakenpfm.ch</p>
          </div>

          {/* Form Progress Stepper */}
          <div className="flex items-center justify-between mb-10 max-w-sm mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-10 h-10 rounded-xl font-black text-xs flex items-center justify-center transition-all ${
                  step === s 
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.25)] scale-110' 
                    : step > s 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200/60'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 4 && (
                  <div className={`h-1 flex-grow mx-2 rounded-full transition-all ${
                    step > s ? 'bg-emerald-600' : 'bg-slate-150'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Display Successful Submission screen! */}
          {success ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-4 animate-bounce">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Thank You!</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto font-bold">
                Your request is pending for approval. You will receive an email shortly.
              </p>
              <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
                Your interactive property profile has been securely sent to <strong className="text-slate-700">kai@krakenpfm.ch</strong> and your client portal is now provisioned.
              </p>
              <div className="pt-4">
                <p className="text-xs text-blue-600 font-bold uppercase animate-pulse">Redirecting to your dashboard...</p>
              </div>
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-xs font-bold text-center"
                >
                  {error}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl">
                      <h4 className="font-black text-slate-700 text-xs uppercase tracking-wider mb-4 border-b border-slate-200/60 pb-2">Step 1: Contact Details</h4>
                      
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Full Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Email Address</label>
                          <div className="relative">
                            <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                              placeholder="john.doe@krakenpfm.ch"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Phone Number</label>
                          <div className="relative">
                            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                              placeholder="+41 79 123 45 67"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Password (min. 6)</label>
                          <div className="relative">
                            <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl space-y-5">
                      <h4 className="font-black text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200/60 pb-2">Step 2: Location &amp; Physical Access</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Street and House Number</label>
                          <div className="relative">
                            <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={street}
                              onChange={(e) => setStreet(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                              placeholder="Bahnhofstrasse 12"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Postal Code</label>
                          <input
                            type="text"
                            required
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                            placeholder="8001"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                          placeholder="Zürich"
                        />
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] ml-2">
                          <span className="flex items-center gap-1.5"><KeyIcon className="w-3.5 h-3.5 text-blue-600" /> Access Protocol</span>
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {accessOptions.map((opt) => (
                            <button
                              key={opt.name}
                              type="button"
                              onClick={() => setAccessType(opt.name)}
                              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                                accessType === opt.name 
                                  ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-black uppercase tracking-tight">{opt.name}</span>
                                {accessType === opt.name && (
                                  <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">✓</span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium leading-tight">{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl space-y-5">
                      <h4 className="font-black text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200/60 pb-2">Step 3: Property Specifications</h4>

                      {/* Room Quantity Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200">
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                            <LayersIcon className="w-4 h-4 text-blue-600" /> Number of Rooms
                          </span>
                          <p className="text-[10px] text-slate-400 font-medium">Includes bedrooms, living rooms, and office rooms</p>
                        </div>
                        <div className="flex items-center gap-4 self-center">
                          <button
                            type="button"
                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                            className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center font-black text-slate-700 text-base cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-base font-black text-slate-900 min-w-[20px] text-center">{rooms}</span>
                          <button
                            type="button"
                            onClick={() => setRooms(rooms + 1)}
                            className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center font-black text-slate-700 text-base cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Toilet Quantity Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200">
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-blue-600" /> Number of Toilets / Bathrooms
                          </span>
                          <p className="text-[10px] text-slate-400 font-medium">Includes main bathroom, guest toilets, and en-suites</p>
                        </div>
                        <div className="flex items-center gap-4 self-center">
                          <button
                            type="button"
                            onClick={() => setToilets(Math.max(1, toilets - 1))}
                            className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center font-black text-slate-700 text-base cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-base font-black text-slate-900 min-w-[20px] text-center">{toilets}</span>
                          <button
                            type="button"
                            onClick={() => setToilets(toilets + 1)}
                            className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center font-black text-slate-700 text-base cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Balcony and Garden Yes/No custom buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                            <Home className="w-4 h-4 text-blue-600" /> Balcony?
                          </span>
                          <div className="flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => setHasBalcony(true)}
                              className={`flex-1 py-2.5 text-xs font-black uppercase rounded-xl transition-all border cursor-pointer ${
                                hasBalcony 
                                  ? 'bg-blue-600 border-transparent text-white shadow-md' 
                                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                              }`}
                            >
                              YES
                            </button>
                            <button
                              type="button"
                              onClick={() => setHasBalcony(false)}
                              className={`flex-1 py-2.5 text-xs font-black uppercase rounded-xl transition-all border cursor-pointer ${
                                !hasBalcony 
                                  ? 'bg-slate-200 border-transparent text-slate-700 font-bold' 
                                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                              }`}
                            >
                              NO
                            </button>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                            <Trees className="w-4 h-4 text-emerald-600" /> Garden?
                          </span>
                          <div className="flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => setHasGarden(true)}
                              className={`flex-1 py-2.5 text-xs font-black uppercase rounded-xl transition-all border cursor-pointer ${
                                hasGarden 
                                  ? 'bg-emerald-600 border-transparent text-white shadow-md' 
                                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                              }`}
                            >
                              YES
                            </button>
                            <button
                              type="button"
                              onClick={() => setHasGarden(false)}
                              className={`flex-1 py-2.5 text-xs font-black uppercase rounded-xl transition-all border cursor-pointer ${
                                !hasGarden 
                                  ? 'bg-slate-200 border-transparent text-slate-700 font-bold' 
                                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                              }`}
                            >
                              NO
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Additional comments/requirements */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Extra Notes / Special Instructions</label>
                        <textarea
                          value={extraNotes}
                          onChange={(e) => setExtraNotes(e.target.value)}
                          rows={3}
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300 resize-none"
                          placeholder="Please leave keys in the mailbox number 4... / Let us know any specific requirements..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl space-y-4">
                      <h4 className="font-black text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200/60 pb-2">Step 4: Confirm Registration</h4>
                      
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Please review your answers below. Clicking &quot;Complete Registration&quot; will provision your client portal, save your settings, and automatically forward your property details to **kai@krakenpfm.ch**.
                      </p>

                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="grid grid-cols-2 gap-y-3 text-xs border-b border-slate-100 pb-3">
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">CLIENT NAME</span>
                            <span className="text-slate-800 font-bold">{name}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">EMAIL ADDRESS</span>
                            <span className="text-slate-850 font-semibold truncate block">{email}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">PHONE NUMBER</span>
                            <span className="text-slate-800 font-semibold">{phone}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">ACCESS SYSTEM</span>
                            <span className="text-blue-600 font-bold">{accessType}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-xs pt-1">
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">ROOMS</span>
                            <span className="text-slate-800 font-black text-base">{rooms}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">TOILETS</span>
                            <span className="text-slate-800 font-black text-base">{toilets}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">BALCONY?</span>
                            <span className="text-slate-700 font-bold text-xs">{hasBalcony ? 'YES' : 'NO'}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">GARDEN?</span>
                            <span className="text-emerald-600 font-bold text-xs">{hasGarden ? 'YES' : 'NO'}</span>
                          </div>
                        </div>

                        <div className="text-xs border-t border-slate-100 pt-3">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">PROPERTY ADDRESS</span>
                          <span className="text-slate-600 font-semibold leading-relaxed">{street}, {postcode} {city}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic Nav buttons */}
              <div className="mt-8 flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    Login to existing account
                  </button>
                )}

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase px-7 py-3.5 rounded-2xl flex items-center gap-1.5 shadow-md shadow-blue-600/10 transition-all cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitRegistration}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase px-8 py-4 rounded-2xl shadow-md shadow-emerald-600/10 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Account link */}
          {!success && (
            <div className="mt-10 text-center border-t border-slate-100 pt-6">
              <p className="text-slate-400 text-xs font-semibold">
                Already have an onboarded account?{' '}
                <button 
                  onClick={() => onNavigate('login')} 
                  className="text-blue-600 hover:text-blue-700 transition-colors ml-1 cursor-pointer font-black uppercase tracking-wider text-[11px]"
                >
                  Login here
                </button>
              </p>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Kraken PFM Multi-Step Portal v5.0
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
