import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, CheckIcon } from './icons';
import emailjs from '@emailjs/browser';

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/ucxeqjygku2w6zyf9ynut5oantantx58';
const SERVICE_ID = 'service_aiv15bc';
const TEMPLATE_ID = 'template_aktj7t9';
const PUBLIC_KEY = 'sH5K84ChHyssJrarm';

interface KontaktPageProps {
  onNavigate: (page: string) => void;
}

const KontaktPage: React.FC<KontaktPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Send to webhook
      const webhookPromise = fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          source: 'CONTACT_FORM',
          timestamp: new Date().toISOString()
        })
      });

      // Send via EmailJS
      const emailPromise = emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone_number: 'N/A',
          services_interest: formData.subject || 'Allgemeine Kontaktanfrage',
          message: formData.message,
          property_address: 'N/A'
        },
        PUBLIC_KEY
      );

      await Promise.all([webhookPromise, emailPromise]);
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Submission failed', err);
      setError('Senden fehlgeschlagen. Bitte kontaktieren Sie uns direkt unter info@krakenpfm.ch.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="bg-slate-50 min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white p-10 md:p-14 rounded-[2.5rem] shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-[#002D5B] mb-4 uppercase tracking-tight">Vielen Dank!</h1>
          <p className="text-gray-600 font-medium mb-8">
            Ihre Nachricht wurde erfolgreich gesendet. Unser Team wird sich so schnell wie möglich bei Ihnen melden.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-[#002D5B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#00254A] transition-all cursor-pointer shadow-lg"
          >
            Zur Startseite
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white selection:bg-blue-500/30 text-[#020617]">
      {/* --- HERO SECTION --- */}
      <section data-header-theme="dark" className="relative md:min-h-[40vh] flex items-center pt-32 pb-24 md:py-32 overflow-hidden bg-[#001A3D]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#001A3D] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001A3D] via-[#002D5B]/30 to-[#001A3D]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-400 font-black text-xs uppercase tracking-[0.4em] mb-4"
            >
              KONTAKTIEREN SIE UNS
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tighter"
            >
              Kontakt
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-lg font-medium max-w-2xl mx-auto"
            >
              Haben Sie Fragen zu unseren Dienstleistungen oder möchten Sie ein individuelles Angebot erhalten? Wir sind gerne für Sie da.
            </motion.p>
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* CONTACT INFORMATION COLUMN */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#002D5B] tracking-tight mb-6">
                    Kontaktinformationen
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">
                    Besuchen Sie uns, rufen Sie uns an oder schreiben Sie uns eine E-Mail. Wir freuen uns auf Sie.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPinIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">Adresse</h4>
                      <p className="text-slate-800 font-bold text-base leading-relaxed">
                        Seewadelstrasse 3<br />
                        8203 Schaffhausen
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                      <PhoneIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">Telefon</h4>
                      <p className="text-slate-800 font-bold text-base">
                        <a href="tel:+41774505705" className="hover:text-blue-600 transition-colors">
                          +41 77 450 57 05
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                      <MailIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">E-Mail</h4>
                      <p className="text-slate-800 font-bold text-base">
                        <a href="mailto:info@krakenpfm.ch" className="hover:text-blue-600 transition-colors">
                          info@krakenpfm.ch
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                      <ClockIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">Öffnungszeiten</h4>
                      <p className="text-slate-800 font-bold text-base leading-relaxed">
                        Montag – Freitag<br />
                        08:00 – 18:00 Uhr
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map/Location Card */}
              <div className="bg-[#002D5B] text-white p-8 md:p-10 rounded-[2rem] shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-extrabold tracking-tight">Kraken Properties & Facilities Management</h3>
                  <p className="text-white/80 text-sm leading-relaxed font-medium">
                    Wir bedienen Privat- und Geschäftskunden in den Regionen Schaffhausen, Zürich, Winterthur und Umgebung mit erstklassigen Reinigungs- und Facility-Services.
                  </p>
                </div>
                {/* Background Pattern */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CONTACT FORM COLUMN */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
                <h2 className="text-2xl font-extrabold text-[#002D5B] tracking-tight mb-8">
                  Senden Sie uns eine Nachricht
                </h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ihr Name"
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                        E-Mail-Adresse <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ihre.email@beispiel.ch"
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                      Betreff
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Worum geht es?"
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                      Ihre Nachricht <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Wie können wir Ihnen helfen?"
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#002D5B] text-white py-4 rounded-xl font-bold hover:bg-[#00254A] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Wird gesendet...
                      </>
                    ) : (
                      'Nachricht senden'
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default KontaktPage;
