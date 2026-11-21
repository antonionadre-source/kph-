
import React, { useState, FormEvent } from 'react';
import { useAuth } from './Auth';
import { portalText } from './portalText';
import { useTranslation } from '../i18n';
import { motion } from 'motion/react';
import { ShieldCheckIcon } from './icons';
import { Lock as LockIcon, Mail as MailIcon, Users as UsersIcon, Briefcase as BriefcaseIcon, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, resetPassword } = useAuth();
  const { language } = useTranslation();
  const pt = (key: Parameters<typeof portalText>[1]) => portalText(language, key);
  const [notice, setNotice] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setIsLoading(true);
    
    try {
      await login(email.trim(), password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(pt('authError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError(pt('invalidEmail')); return; }
    setIsLoading(true); setError(null); setNotice(null);
    try { await resetPassword(email); setNotice(pt('resetSent')); }
    catch { setError(pt('authError')); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden pt-20">
      {/* Structural Minimal Background Decors */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10 px-6"
      >
        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-150/85 shadow-[0_30px_70px_rgba(15,23,42,0.06)]">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 mb-5"
            >
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">
              {pt('signIn')}
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">{pt('portal')}</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              role="alert" className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          {notice && <p role="status" className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl mb-5 text-sm">{notice}</p>}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">
                {pt('email')}
              </label>
              <div className="relative">
                <MailIcon className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-5 text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300 text-sm"
                  placeholder="name@example.ch"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">
                {pt('password')}
              </label>
              <div className="relative">
                <LockIcon className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-5 text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300 text-sm"
                  placeholder="••••••••"
                  style={{ paddingRight: '3.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(previous => !previous)}
                  aria-label={pt(showPassword ? 'hidePassword' : 'showPassword')}
                  title={pt(showPassword ? 'hidePassword' : 'showPassword')}
                  aria-controls="password"
                  aria-pressed={showPassword}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  {showPassword ? <EyeOff aria-hidden="true" className="w-5 h-5" /> : <Eye aria-hidden="true" className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 bg-blue-600 hover:bg-blue-750 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/10 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? pt('loading') : pt('signIn')}
            </motion.button>
          </form>
          <div className="flex flex-wrap justify-between gap-4 mt-6 text-sm font-bold text-blue-700">
            <button type="button" disabled={isLoading} onClick={handleReset}>{pt('forgot')}</button>
            <a href="/register" onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey) { event.preventDefault(); onNavigate('register'); } }}>{pt('createAccount')}</a>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default LoginPage;
