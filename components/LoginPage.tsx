
import React, { useState, FormEvent } from 'react';
import { useAuth } from './Auth';
import { useTranslation } from '../i18n';
import { motion } from 'motion/react';
import { ShieldCheckIcon } from './icons';
import { Lock as LockIcon, Mail as MailIcon } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      onNavigate('clients');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden pt-20">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10 px-6"
      >
        <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 mb-6">
              <ShieldCheckIcon className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">{t('login.title')}</h2>
            <p className="text-white/40 font-bold text-sm uppercase tracking-[0.2em]">Secure Access Portal</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-4">
                {t('login.email')}
              </label>
              <div className="relative">
                <MailIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-white/10"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-4">
                {t('login.password')}
              </label>
              <div className="relative">
                <LockIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-white/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Authenticating...' : t('login.button')}
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-white/40 text-sm font-bold">
              {t('login.noAccount')}{' '}
              <button 
                onClick={() => onNavigate('register')} 
                className="text-blue-400 hover:text-blue-300 transition-colors ml-1"
              >
                {t('login.registerLink')}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
          Kraken PFM Security Protocol v4.0
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
