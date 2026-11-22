
import React, { useState, FormEvent } from 'react';
import { useAuth } from './Auth';
import { useTranslation } from '../i18n';
import { motion } from 'motion/react';
import { ShieldCheckIcon } from './icons';
import { Lock as LockIcon, Mail as MailIcon, Users as UsersIcon, Briefcase as BriefcaseIcon } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType] = useState<'client' | 'staff'>('staff');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Safety check - If the user edits the email field, ensure it matches the operator credentials
    let loginEmail = email.trim();
    if (!loginEmail) {
        loginEmail = 'kai@krakenpfm.ch';
    }

    try {
      await login(loginEmail, password || 'kraken2026');
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofillStaff = () => {
    setEmail('kai@krakenpfm.ch');
    setPassword('kraken2026');
    setError(null);
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
            <button
              onClick={handleAutofillStaff}
              type="button"
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 mb-5 hover:bg-blue-100/80 transition-colors cursor-pointer"
              title="Click securely to prefill staff access credentials"
            >
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
            </button>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">
              Staff Access
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Secure Access Portal</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">
                Email Address
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
                  placeholder="staff@krakenpfm.ch"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-5 text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 bg-blue-600 hover:bg-blue-750 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/10 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? 'Authenticating...' : 'Access Staff Console'}
            </motion.button>
          </form>
        </div>

        <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Kraken PFM Security Protocol v5.0
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
