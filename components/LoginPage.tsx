
import React, { useState, FormEvent } from 'react';
import { useAuth } from './Auth';
import { portalText } from './portalText';
import { AccountIntro } from './accountPresentation';
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
    <div className="kraken-auth min-h-screen bg-[#f4f8f8] px-4 py-8 sm:px-6 sm:py-12">
      <div className="kraken-auth-layout mx-auto grid max-w-xl lg:max-w-5xl items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <AccountIntro language={language} mode="login" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-w-0"
      >
        <div className="kraken-auth-card h-full bg-white p-5 sm:p-8 rounded-3xl border border-[#dce6e8] shadow-sm">
          <div className="mb-7 text-left">
            <h1 className="text-3xl font-semibold text-[#082b45] mb-1">{pt('signIn')}</h1>
            <p className="text-[#526574] font-semibold text-base ">{pt('portal')}</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              role="alert" className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-semibold text-center"
            >
              {error}
            </motion.div>
          )}

          {notice && <p role="status" className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl mb-5 text-base">{notice}</p>}
          <form onSubmit={handleSubmit} className="kraken-form space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label htmlFor="email" className="kraken-label block text-sm font-semibold text-[#526574] ml-2">
                {pt('email')}
              </label>
              <div className="relative">
                <MailIcon className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#526574]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="kraken-field w-full bg-[#f4f8f8] border border-[#dce6e8] rounded-2xl py-3.5 pl-12 pr-5 text-[#082b45] font-semibold focus:outline-none focus:border-[#087f73] focus:bg-white transition-all placeholder:text-[#526574] text-base"
                  placeholder="name@example.ch"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="kraken-label block text-sm font-semibold text-[#526574] ml-2">
                {pt('password')}
              </label>
              <div className="relative">
                <LockIcon className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#526574]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="kraken-field w-full bg-[#f4f8f8] border border-[#dce6e8] rounded-2xl py-3.5 pl-12 pr-5 text-[#082b45] font-semibold focus:outline-none focus:border-[#087f73] focus:bg-white transition-all placeholder:text-[#526574] text-base"
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
                  className="kraken-control min-h-11 min-w-11 absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center rounded-xl text-[#526574] hover:bg-[#f4f8f8] focus-visible:outline-2 focus-visible:outline-blue-600"
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
              className="kraken-control min-h-11 w-full py-4.5 bg-[#087f73] hover:bg-[#087f73] text-white rounded-2xl font-semibold text-base shadow-sm disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? pt('loading') : pt('signIn')}
            </motion.button>
          </form>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6 text-base font-medium text-[#087f73]">
            <button type="button" className="kraken-control min-h-11 text-left" disabled={isLoading} onClick={handleReset}>{pt('forgot')}</button>
            <a className="inline-flex min-h-11 items-center" href="/register" onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey) { event.preventDefault(); onNavigate('register'); } }}>{pt('createAccount')}</a>
          </div>
        </div>

      </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
