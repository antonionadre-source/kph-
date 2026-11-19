import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { PhoneIcon, WhatsAppIcon, ShieldCheckIcon } from './icons';

interface QuickContactSectionProps {
  onNavigate?: (path: string) => void;
}

export default function QuickContactSection({ onNavigate }: QuickContactSectionProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Umzugsreinigung',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage(t('quick_contact.name') + ' ist erforderlich.');
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage(t('quick_contact.phone') + ' ist erforderlich.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage(t('quick_contact.email') + ' ist ungültig.');
      return;
    }

    // Process submission
    setSubmitted(true);
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: 'Umzugsreinigung',
      message: ''
    });
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-slate-900 via-[#001D3D] to-slate-900 border-t border-slate-800 text-white relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>{t('quick_contact.subtitle')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
            {t('quick_contact.title')}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
            Haben Sie Fragen oder benötigen Sie schnell ein Angebot? Füllen Sie das Formular aus oder erreichen Sie uns direkt per Telefon oder WhatsApp.
          </p>

          {/* Direct Phone & WhatsApp Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 pt-4 border-t border-white/10">
            <a 
              href="tel:+41774505705" 
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-extrabold text-sm sm:text-base transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <span>+41 77 450 57 05</span>
            </a>

            <a 
              href="https://wa.me/41774505705?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Offerte" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#34e275] font-extrabold text-sm sm:text-base transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              </div>
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {submitted ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">
                ✓
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Vielen Dank!
              </h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
                {t('quick_contact.success')}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full border border-white/20 transition-all cursor-pointer"
              >
                Weitere Nachricht senden
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs sm:text-sm font-semibold animate-shake">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="quick-contact-name" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    {t('quick_contact.name')} <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="quick-contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Vor- und Nachname"
                    required
                    className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label htmlFor="quick-contact-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    {t('quick_contact.phone')} <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="quick-contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+41 79 123 45 67"
                    required
                    className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* E-Mail */}
                <div>
                  <label htmlFor="quick-contact-email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    {t('quick_contact.email')} <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="quick-contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ihre.email@beispiel.ch"
                    required
                    className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                {/* Art der Dienstleistung */}
                <div>
                  <label htmlFor="quick-contact-service" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    {t('quick_contact.service')} <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    id="quick-contact-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                  >
                    <option value="Umzugsreinigung">{t('quick_contact.service_umzug')}</option>
                    <option value="Unterhaltsreinigung">{t('quick_contact.service_unterhalt')}</option>
                    <option value="Büroreinigung">{t('quick_contact.service_buero')}</option>
                    <option value="Hauswartung & Facility Management">{t('quick_contact.service_hauswartung')}</option>
                    <option value="Sonstiges">{t('quick_contact.service_sonstiges')}</option>
                  </select>
                </div>
              </div>

              {/* Nachricht */}
              <div>
                <label htmlFor="quick-contact-message" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  {t('quick_contact.message')}
                </label>
                <textarea
                  id="quick-contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Beschreiben Sie kurz Ihr Anliegen oder Ihre Immobilie..."
                  className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] hover:from-[#3feb73] hover:to-[#1ecdb6] font-black text-xs sm:text-sm uppercase tracking-wider py-4 rounded-xl shadow-xl shadow-emerald-500/10 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{t('quick_contact.submit')}</span>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              {/* Trust Footer Note */}
              <p className="text-center text-[11px] sm:text-xs text-slate-400 font-medium pt-1">
                {t('quick_contact.trust')}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
