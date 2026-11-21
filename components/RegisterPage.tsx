import React, { useState } from 'react';
import { useAuth } from './Auth';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { db, sanitizeFirestoreData } from './firebase';
import { portalText } from './portalText';
import { AccountIntro } from './accountPresentation';
import { registrationText } from './registrationText';
import { finishRegistration, withPortalTimeout, type PortalUser } from './portalIdentity';
import { externalSubmissionsEnabled } from './integrationConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import emailjs, { EMAIL_SERVICE_ID as SERVICE_ID, EMAIL_TEMPLATE_ID as TEMPLATE_ID, EMAIL_PUBLIC_KEY as PUBLIC_KEY } from './emailClient';
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
  Bath,
  Eye,
  EyeOff
} from 'lucide-react';

import { sendLead } from './leadWebhook';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}


const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register, warning, resendVerification } = useAuth();
  const { t, language } = useTranslation();
  const pt = (key: Parameters<typeof portalText>[1]) => portalText(language, key);
  const rt = (source: string) => registrationText(language, source);
  const [createdAccount, setCreatedAccount] = useState<PortalUser | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
  const [showPassword, setShowPassword] = useState(false);

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
      if (!name.trim() || !email.trim() || !phone.trim() || !password) {
        setError(pt('required'));
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError(pt('invalidEmail')); return; }
      if (password.length < 6) {
        setError(pt('passwordHint'));
        return;
      }
    }
    if (step === 2) {
      if (!street.trim() || !postcode.trim() || !city.trim()) {
        setError(pt('required'));
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
    if (!name.trim() || !email.trim() || !phone.trim() || !street.trim() || !postcode.trim() || !city.trim() || password.length < 6) { setError(pt('required')); return; }
    setIsLoading(true);

    try {
      const result = await finishRegistration({
        existingAccount: createdAccount,
        createAccount: () => register(name.trim(), email.trim(), password),
        saveProfile: async account => {
          setCreatedAccount(account);
          const profile = doc(db, 'profiles', account.uid);
          const previous = await withPortalTimeout(getDoc(profile));
          await withPortalTimeout(setDoc(profile, sanitizeFirestoreData({
            userId: account.uid, name: name.trim(), email: account.email, phone: phone.trim(),
            address: { street: street.trim(), postcode: postcode.trim(), city: city.trim() },
            accessType, rooms, toilets, hasBalcony, hasGarden, notes: extraNotes.trim(),
            ...(!previous.exists() ? { createdAt: serverTimestamp() } : {}),
            updatedAt: serverTimestamp(),
          }), { merge: true }));
        },
        ...(externalSubmissionsEnabled ? { notify: () => emailjs.send(SERVICE_ID, TEMPLATE_ID, {
          from_name: name.trim(), from_email: email.trim(), phone_number: phone.trim(),
          services_interest: 'CLIENT PROFILE', message: 'Client account and property profile saved.',
        }, PUBLIC_KEY) } : {}),
      });
      setCreatedAccount(result.account);
      if (!result.profileSaved) { setError(pt('profilePending')); return; }
      if (result.error) setNotice(pt('notificationPending'));
      setSuccess(true);
    } catch (error: any) {
      setError(pt(['auth/credential-already-in-use', 'auth/email-already-in-use'].includes(error?.code) ? 'accountExists' : 'authError'));
    } finally { setIsLoading(false); }
  };

  const accessOptions = [
    { name: 'Key Safe / Lockbox', desc: '' },
    { name: 'In-Person Handover', desc: '' },
    { name: 'Digital Code', desc: '' },
    { name: 'Building Concierge / Agency', desc: '' }
  ];

  return (
    <div className="kraken-auth min-h-screen bg-[#f3f7fc] px-4 py-8 sm:px-6 sm:py-12">
      <div className="kraken-auth-layout mx-auto grid max-w-2xl lg:max-w-6xl items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <AccountIntro language={language} mode="register" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-w-0"
      >
        <div className="kraken-auth-card bg-white p-5 sm:p-8 rounded-3xl border border-[#dce5f0] shadow-sm">
          {/* Custom Header */}
          <div className="mb-6 text-left">
            <span className="inline-flex items-center gap-2 bg-[#edf4fd] border border-[#c9dbef] text-[#1464ad] font-semibold text-sm px-4 py-2 rounded-2xl mb-4">
              <FolderPlus className="w-3.5 h-3.5" /> {rt('Interactive Onboarding')}
            </span>
            <h1 className="text-3xl font-semibold text-[#032b59] ">{pt('createAccount')}</h1>
            <p className="text-[#50647c] font-semibold text-base mt-1.5">{pt('portal')}</p>
          </div>

          <div className="kraken-stepper mb-7 border-b border-[#dce5f0] pb-6">
            <ol className="grid grid-cols-4 gap-3" aria-label={rt('Interactive Onboarding')}>
              {[1, 2, 3, 4].map(s => <li key={s} aria-current={step === s ? 'step' : undefined} className="flex items-center gap-2">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-base font-semibold ${step === s ? 'bg-[#1464ad] text-white' : step > s ? 'bg-[#edf4fd] text-[#1464ad]' : 'border border-[#dce5f0] bg-white text-[#50647c]'}`}>{step > s ? <Check aria-hidden="true" className="h-5 w-5" /> : s}</span>
                <span aria-hidden="true" className={`h-1 flex-1 rounded-full ${step > s ? 'bg-[#1464ad]' : 'bg-[#dce5f0]'}`} />
              </li>)}
            </ol>
            <p className="mt-4 text-base font-semibold text-[#032b59]">{rt(['Step 1: Contact Details', 'Step 2: Location & Physical Access', 'Step 3: Property Specifications', 'Step 4: Confirm Registration'][step - 1])}</p>
          </div>

          {/* Display Successful Submission screen! */}
          {success ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 text-blue-600 mb-4 ">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold text-[#032b59] ">{pt('accountCreated')}</h3>
              <p className="text-[#50647c] text-base leading-relaxed max-w-md mx-auto font-semibold">
                {pt('verifyHint')}
              </p>
              <p className="text-[#50647c] text-base leading-relaxed max-w-md mx-auto">
                {pt('saved')}
              </p>
              <div className="pt-4">
                {(notice || warning) && <p role="status" className="text-base text-amber-800 mb-4">{notice || pt('notificationPending')}</p>}
                <button type="button" className="kraken-control min-h-11 min-w-11 px-5 py-3 bg-[#1464ad] text-white rounded-xl font-semibold" onClick={() => onNavigate('dashboard')}>{pt('dashboard')}</button>
                <button type="button" className="kraken-control min-h-11 min-w-11 block mx-auto mt-4 text-[#1464ad]" onClick={async () => { try { await resendVerification(); setNotice(pt('verificationSent')); } catch { setNotice(pt('notificationPending')); } }}>{pt('verify')}</button>
              </div>
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  role="alert" className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm font-semibold text-center"
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
                    <div className="border border-[#dce5f0] bg-[#f3f7fc] p-6 rounded-2xl">

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label htmlFor="registerpage-field-1" className="kraken-label block text-sm font-semibold text-[#50647c] ml-2">{pt('name')}</label>
                          <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#50647c]" />
                            <input id="registerpage-field-1"
                              type="text"
                              required
                              value={name}
                              autoComplete="name"
                              maxLength={100}
                              onChange={(e) => setName(e.target.value)}
                              className="kraken-field w-full bg-white border border-[#dce5f0] rounded-2xl py-3 pl-11 pr-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:ring-2 focus:ring-[#c9dbef] transition-all placeholder:text-[#50647c]"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="registerpage-field-2" className="kraken-label block text-sm font-semibold text-[#50647c] ml-2">{pt('email')}</label>
                          <div className="relative">
                            <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#50647c]" />
                            <input id="registerpage-field-2"
                              type="email"
                              required
                              value={email}
                              disabled={Boolean(createdAccount)}
                              autoComplete="email"
                              maxLength={254}
                              onChange={(e) => setEmail(e.target.value)}
                              className="kraken-field w-full bg-white border border-[#dce5f0] rounded-2xl py-3 pl-11 pr-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:ring-2 focus:ring-[#c9dbef] transition-all placeholder:text-[#50647c]"
                              placeholder="name@example.ch"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="registerpage-field-3" className="kraken-label block text-sm font-semibold text-[#50647c] ml-2">{pt('phone')}</label>
                          <div className="relative">
                            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#50647c]" />
                            <input id="registerpage-field-3"
                              type="tel"
                              required
                              value={phone}
                              autoComplete="tel"
                              maxLength={50}
                              onChange={(e) => setPhone(e.target.value)}
                              className="kraken-field w-full bg-white border border-[#dce5f0] rounded-2xl py-3 pl-11 pr-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:ring-2 focus:ring-[#c9dbef] transition-all placeholder:text-[#50647c]"
                              placeholder="+41 79 123 45 67"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="register-password" className="kraken-label block text-sm font-semibold text-[#50647c] ml-2">{pt('password')} ({pt('passwordHint')})</label>
                          <div className="relative">
                            <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#50647c]" />
                            <input
                              id="register-password"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              minLength={6}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="kraken-field w-full bg-white border border-[#dce5f0] rounded-2xl py-3 pl-11 pr-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:ring-2 focus:ring-[#c9dbef] transition-all placeholder:text-[#50647c]"
                              placeholder="••••••••"
                              style={{ paddingRight: '3.5rem' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(previous => !previous)}
                              aria-label={pt(showPassword ? 'hidePassword' : 'showPassword')}
                              title={pt(showPassword ? 'hidePassword' : 'showPassword')}
                              aria-controls="register-password"
                              aria-pressed={showPassword}
                              className="kraken-control min-h-11 min-w-11 absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center rounded-xl text-[#50647c] hover:bg-[#f3f7fc] focus-visible:outline-2 focus-visible:outline-blue-600"
                            >
                              {showPassword ? <EyeOff aria-hidden="true" className="w-5 h-5" /> : <Eye aria-hidden="true" className="w-5 h-5" />}
                            </button>
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
                    <div className="border border-[#dce5f0] bg-[#f3f7fc] p-6 rounded-2xl space-y-5">

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 space-y-1.5">
                          <label htmlFor="registerpage-field-4" className="kraken-label block text-sm font-semibold text-[#50647c] ml-2">{rt('Street and House Number')}</label>
                          <div className="relative">
                            <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#50647c]" />
                            <input id="registerpage-field-4"
                              type="text"
                              required
                              value={street}
                              maxLength={250}
                              onChange={(e) => setStreet(e.target.value)}
                              className="kraken-field w-full bg-white border border-[#dce5f0] rounded-2xl py-3 pl-11 pr-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:ring-2 focus:ring-[#c9dbef] transition-all placeholder:text-[#50647c]"
                              placeholder="Bahnhofstrasse 12"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="registerpage-field-5" className="kraken-label block text-sm font-semibold text-[#50647c] ml-2">{rt('Postal Code')}</label>
                          <input id="registerpage-field-5"
                            type="text"
                            required
                            value={postcode}
                            maxLength={10}
                            onChange={(e) => setPostcode(e.target.value)}
                            className="kraken-field w-full bg-white border border-[#dce5f0] rounded-2xl py-3 px-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:ring-2 focus:ring-[#c9dbef] transition-all placeholder:text-[#50647c]"
                            placeholder="8001"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="registerpage-field-6" className="kraken-label block text-sm font-semibold text-[#50647c] ml-2">{rt('City')}</label>
                        <input id="registerpage-field-6"
                          type="text"
                          required
                          value={city}
                          maxLength={120}
                          onChange={(e) => setCity(e.target.value)}
                          className="kraken-field w-full bg-white border border-[#dce5f0] rounded-2xl py-3 px-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:ring-2 focus:ring-[#c9dbef] transition-all placeholder:text-[#50647c]"
                          placeholder="Zürich"
                        />
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="kraken-label block text-sm font-semibold text-[#50647c] ml-2">
                          <span className="flex items-center gap-1.5"><KeyIcon className="w-3.5 h-3.5 text-[#1464ad]" />{rt('Access Protocol')}</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {accessOptions.map((opt) => (
                            <button
                              key={rt(opt.name)}
                              type="button"
                              onClick={() => setAccessType(opt.name)}
                              className={`kraken-control min-h-11 min-w-11 p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                                accessType === opt.name
                                  ? 'bg-[#edf4fd] border-[#1464ad] text-[#1464ad] shadow-sm'
                                  : 'bg-white border-[#dce5f0] text-[#50647c] hover:border-[#dce5f0]'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-sm font-semibold ">{rt(opt.name)}</span>
                                {accessType === opt.name && (
                                  <span className="w-4 h-4 rounded-full bg-[#1464ad] flex items-center justify-center text-sm text-white">✓</span>
                                )}
                              </div>
                              <span className="text-sm text-[#50647c] font-medium leading-tight">{opt.desc}</span>
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
                    <div className="border border-[#dce5f0] bg-[#f3f7fc] p-6 rounded-2xl space-y-5">

                      {/* Room Quantity Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white border border-[#dce5f0]">
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-[#032b59] flex items-center gap-1.5">
                            <LayersIcon className="w-4 h-4 text-[#1464ad]" /> {rt('Number of Rooms')}
                          </span>
                          <p className="text-base text-[#50647c] font-medium">{rt('Includes bedrooms, living rooms, and office rooms')}</p>
                        </div>
                        <div className="flex items-center gap-4 self-center">
                          <button
                            type="button"
                            aria-label={rt('Decrease number of rooms')}
                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                            className="kraken-control min-h-11 min-w-11 w-9 h-9 rounded-xl bg-[#f3f7fc] border border-[#dce5f0] hover:bg-slate-200 transition-colors flex items-center justify-center font-semibold text-[#50647c] text-base cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-base font-semibold text-[#032b59] min-w-[20px] text-center">{rooms}</span>
                          <button
                            type="button"
                            aria-label={rt('Increase number of rooms')}
                            onClick={() => setRooms(Math.min(100, rooms + 1))}
                            className="kraken-control min-h-11 min-w-11 w-9 h-9 rounded-xl bg-[#f3f7fc] border border-[#dce5f0] hover:bg-slate-200 transition-colors flex items-center justify-center font-semibold text-[#50647c] text-base cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Toilet Quantity Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white border border-[#dce5f0]">
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-[#032b59] flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-[#1464ad]" /> {rt('Number of Toilets / Bathrooms')}
                          </span>
                          <p className="text-base text-[#50647c] font-medium">{rt('Includes main bathroom, guest toilets, and en-suites')}</p>
                        </div>
                        <div className="flex items-center gap-4 self-center">
                          <button
                            type="button"
                            aria-label={rt('Decrease number of bathrooms')}
                            onClick={() => setToilets(Math.max(1, toilets - 1))}
                            className="kraken-control min-h-11 min-w-11 w-9 h-9 rounded-xl bg-[#f3f7fc] border border-[#dce5f0] hover:bg-slate-200 transition-colors flex items-center justify-center font-semibold text-[#50647c] text-base cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-base font-semibold text-[#032b59] min-w-[20px] text-center">{toilets}</span>
                          <button
                            type="button"
                            aria-label={rt('Increase number of bathrooms')}
                            onClick={() => setToilets(Math.min(100, toilets + 1))}
                            className="kraken-control min-h-11 min-w-11 w-9 h-9 rounded-xl bg-[#f3f7fc] border border-[#dce5f0] hover:bg-slate-200 transition-colors flex items-center justify-center font-semibold text-[#50647c] text-base cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Balcony and Garden Yes/No custom buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white border border-[#dce5f0] space-y-3">
                          <span className="text-sm font-semibold text-[#032b59] flex items-center gap-1.5">
                            <Home className="w-4 h-4 text-[#1464ad]" /> {rt('Balcony?')}
                          </span>
                          <div className="flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => setHasBalcony(true)}
                              className={`kraken-control min-h-11 flex-1 py-2.5 text-base font-semibold rounded-xl transition-all border cursor-pointer ${
                                hasBalcony
                                  ? 'bg-[#1464ad] border-transparent text-white shadow-md'
                                  : 'bg-[#f3f7fc] border-[#dce5f0] text-[#50647c] hover:bg-[#f3f7fc]'
                              }`}
                            >
                              {rt('YES')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setHasBalcony(false)}
                              className={`kraken-control min-h-11 flex-1 py-2.5 text-base font-semibold rounded-xl transition-all border cursor-pointer ${
                                !hasBalcony
                                  ? 'bg-slate-200 border-transparent text-[#50647c] font-semibold'
                                  : 'bg-[#f3f7fc] border-[#dce5f0] text-[#50647c] hover:bg-[#f3f7fc]'
                              }`}
                            >
                              {rt('NO')}
                            </button>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-[#dce5f0] space-y-3">
                          <span className="text-sm font-semibold text-[#032b59] flex items-center gap-1.5">
                            <Trees className="w-4 h-4 text-blue-600" /> {rt('Garden?')}
                          </span>
                          <div className="flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => setHasGarden(true)}
                              className={`kraken-control min-h-11 flex-1 py-2.5 text-base font-semibold rounded-xl transition-all border cursor-pointer ${
                                hasGarden
                                  ? 'bg-blue-600 border-transparent text-white shadow-md'
                                  : 'bg-[#f3f7fc] border-[#dce5f0] text-[#50647c] hover:bg-[#f3f7fc]'
                              }`}
                            >
                              {rt('YES')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setHasGarden(false)}
                              className={`kraken-control min-h-11 flex-1 py-2.5 text-base font-semibold rounded-xl transition-all border cursor-pointer ${
                                !hasGarden
                                  ? 'bg-slate-200 border-transparent text-[#50647c] font-semibold'
                                  : 'bg-[#f3f7fc] border-[#dce5f0] text-[#50647c] hover:bg-[#f3f7fc]'
                              }`}
                            >
                              {rt('NO')}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Additional comments/requirements */}
                      <div className="space-y-1.5">
                        <label htmlFor="registerpage-field-7" className="kraken-label block text-sm font-semibold text-[#50647c] ml-2">{rt('Extra Notes / Special Instructions')}</label>
                        <textarea id="registerpage-field-7"
                          value={extraNotes}
                          maxLength={5000}
                          onChange={(e) => setExtraNotes(e.target.value)}
                          rows={3}
                          className="kraken-field w-full bg-white border border-[#dce5f0] rounded-2xl py-3 px-5 text-base text-[#032b59] font-semibold focus:outline-none focus:border-[#1464ad] focus:ring-2 focus:ring-[#c9dbef] transition-all placeholder:text-[#50647c] resize-none"
                          placeholder={rt('Additional relevant information')}
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
                    <div className="border border-[#dce5f0] bg-[#f3f7fc] p-6 rounded-2xl space-y-4">

                      <p className="text-base text-[#50647c] leading-relaxed font-semibold">
                        {rt('Review profile')}
                      </p>

                      <div className="bg-white border border-[#dce5f0] rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="grid grid-cols-2 gap-y-3 text-sm border-b border-[#dce5f0] pb-3">
                          <div>
                            <span className="block text-sm text-[#50647c] font-semibold ">{pt('name')}</span>
                            <span className="text-[#032b59] font-semibold">{name}</span>
                          </div>
                          <div>
                            <span className="block text-sm text-[#50647c] font-semibold ">{pt('email')}</span>
                            <span className="text-slate-850 font-semibold truncate block">{email}</span>
                          </div>
                          <div>
                            <span className="block text-sm text-[#50647c] font-semibold ">{pt('phone')}</span>
                            <span className="text-[#032b59] font-semibold">{phone}</span>
                          </div>
                          <div>
                            <span className="block text-sm text-[#50647c] font-semibold ">{rt('Access Protocol')}</span>
                            <span className="text-[#1464ad] font-semibold">{rt(accessType)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-sm pt-1">
                          <div>
                            <span className="block text-sm text-[#50647c] font-semibold ">{rt('Number of Rooms')}</span>
                            <span className="text-[#032b59] font-semibold text-base">{rooms}</span>
                          </div>
                          <div>
                            <span className="block text-sm text-[#50647c] font-semibold ">{rt('Number of Toilets / Bathrooms')}</span>
                            <span className="text-[#032b59] font-semibold text-base">{toilets}</span>
                          </div>
                          <div>
                            <span className="block text-sm text-[#50647c] font-semibold ">{rt('Balcony?')}</span>
                            <span className="text-[#50647c] font-semibold text-sm">{hasBalcony ? rt('YES') : rt('NO')}</span>
                          </div>
                          <div>
                            <span className="block text-sm text-[#50647c] font-semibold ">{rt('Garden?')}</span>
                            <span className="text-blue-600 font-semibold text-sm">{hasGarden ? rt('YES') : rt('NO')}</span>
                          </div>
                        </div>

                        <div className="text-sm border-t border-[#dce5f0] pt-3">
                          <span className="block text-sm text-[#50647c] font-semibold ">{pt('address')}</span>
                          <span className="text-[#50647c] font-semibold leading-relaxed">{street}, {postcode} {city}</span>
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
                    disabled={isLoading} onClick={handlePrevStep}
                    className="kraken-control min-h-11 min-w-11 flex items-center gap-1.5 text-base font-semibold text-[#50647c] hover:text-[#50647c] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> {pt('back')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="kraken-control min-h-11 min-w-11 text-base font-semibold text-[#1464ad] hover:text-[#1464ad] transition-colors cursor-pointer"
                  >
                    {pt('signIn')}
                  </button>
                )}

                {step < totalSteps ? (
                  <button
                    type="button"
                    disabled={isLoading} onClick={handleNextStep}
                    className="kraken-control min-h-11 min-w-11 bg-[#1464ad] hover:bg-[#1464ad] text-white font-semibold text-base px-7 py-3.5 rounded-2xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    {pt('continue')} <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitRegistration}
                    disabled={isLoading}
                    className="kraken-control min-h-11 min-w-11 bg-[#1464ad] hover:bg-[#0c4f92] text-white font-semibold text-base px-8 py-4 rounded-2xl shadow-md disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isLoading ? pt('loading') : createdAccount ? pt('retry') : pt('createAccount')}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Account link */}
          {!success && (
            <div className="mt-10 text-center border-t border-[#dce5f0] pt-6">
              <p className="text-[#50647c] text-base font-semibold">
                {pt('portal')}{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="kraken-control min-h-11 min-w-11 text-[#1464ad] hover:text-[#1464ad] transition-colors ml-1 cursor-pointer font-semibold text-base"
                >
                  {pt('signIn')}
                </button>
              </p>
            </div>
          )}
        </div>

      </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
