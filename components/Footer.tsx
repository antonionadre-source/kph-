
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { 
  WhatsAppIcon, 
  FacebookIcon, 
  XIcon, 
  InstagramIcon, 
  LinkedInIcon, 
  YouTubeIcon, 
  TikTokIcon,
  LeafIcon,
  PaperAirplaneIcon
} from './icons';
import { companyLogoWhiteUrl, tentacleImageUrl } from '../assets';
import emailjs from '@emailjs/browser';
import { motion } from 'motion/react';

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/ucxeqjygku2w6zyf9ynut5oantantx58';
const SERVICE_ID = 'service_aiv15bc';
const TEMPLATE_ID = 'template_aktj7t9';
const PUBLIC_KEY = 'sH5K84ChHyssJrarm';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - percentage, 4);
      setCount(end * ease);
      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return count;
};

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const co2Value = useCountUp(0.61);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setStatus('loading');

    try {
      const webhookPromise = fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'NEWSLETTER_SUBSCRIPTION',
          email: newsletterEmail,
          source: 'Footer Newsletter',
          timestamp: new Date().toISOString()
        })
      });

      const emailPromise = emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: 'System',
        from_email: newsletterEmail,
        message: `New Newsletter Subscription Request from: ${newsletterEmail}`,
        services_interest: 'Newsletter',
        total_price: 'N/A'
      }, PUBLIC_KEY);

      await Promise.all([webhookPromise, emailPromise]);
      setStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const socialLinks = [
    { icon: WhatsAppIcon, href: 'https://wa.me/41774505705', label: 'WhatsApp' },
    { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
    { icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
    { icon: XIcon, href: 'https://twitter.com', label: 'X (Twitter)' },
    { icon: YouTubeIcon, href: 'https://youtube.com', label: 'YouTube' },
    { icon: TikTokIcon, href: 'https://tiktok.com', label: 'TikTok' },
  ];

  return (
    <footer id="contact" className="bg-[#002D5B] text-white py-12 md:py-16 relative overflow-hidden border-t border-white/5">
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px] -ml-48 -mb-48" />
        
        {/* Large Decorative Tentacle */}
        <img 
          src={tentacleImageUrl} 
          alt="Kraken PFM Mascot" 
          loading="lazy"
          decoding="async"
          className="absolute -top-20 -right-40 w-[700px] h-[700px] object-contain opacity-[0.07] rotate-[-15deg] pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="flex flex-col gap-4">
              <img src={companyLogoWhiteUrl} alt="Kraken PFM Logo" loading="lazy" decoding="async" className="h-14 w-auto object-contain self-start" />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Properties and</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Facilities Management</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
              {t('footer.bench')}
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a 
                  key={label} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 bg-white/5 ${label === 'WhatsApp' ? 'hover:bg-[#25D366]' : 'hover:bg-blue-600'} rounded-2xl flex items-center justify-center transition-all border border-white/10 group shadow-2xl`}
                >
                  <Icon className={`w-5 h-5 ${label === 'WhatsApp' ? 'group-hover:scale-110' : ''}`} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-6 grid grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-400 mb-8">{t('footer.explore')}</h3>
              <ul className="space-y-3 text-xs font-bold text-slate-300">
                <li><a href="/services" onClick={(e) => { e.preventDefault(); onNavigate('services-page'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.services')}</a></li>
                <li><a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.about')}</a></li>
                <li><a href="/sustainability" onClick={(e) => { e.preventDefault(); onNavigate('sustainability-page'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.green')}</a></li>
                <li><a href="/" onClick={(e) => { e.preventDefault(); onNavigate('clients'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.partner')}</a></li>
                <li><a href="/blog" onClick={(e) => { e.preventDefault(); onNavigate('blog'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('nav.blog')}</a></li>
                <li><a href="/kontakt" onClick={(e) => { e.preventDefault(); onNavigate('kontakt'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('nav.contact')}</a></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-400 mb-8">{t('footer.coverage')}</h3>
              <ul className="space-y-3 text-xs font-bold text-slate-300">
                <li><a href="/reinigung/region-zuerich" onClick={(e) => { e.preventDefault(); onNavigate('/reinigung/region-zuerich'); }} className="hover:text-white transition-colors flex items-center gap-2 group text-left"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />Region Zürich</a></li>
                <li><a href="/reinigung/region-winterthur" onClick={(e) => { e.preventDefault(); onNavigate('/reinigung/region-winterthur'); }} className="hover:text-white transition-colors flex items-center gap-2 group text-left"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />Region Winterthur</a></li>
                <li><a href="/reinigung/kanton-schaffhausen" onClick={(e) => { e.preventDefault(); onNavigate('/reinigung/kanton-schaffhausen'); }} className="hover:text-white transition-colors flex items-center gap-2 group text-left"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />Kanton Schaffhausen</a></li>
                <li><a href="/einsatzgebiete" onClick={(e) => { e.preventDefault(); onNavigate('/einsatzgebiete'); }} className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 group text-left mt-4 border-t border-white/5 pt-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" />{t('footer.allLocations')}</a></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-400 mb-8">{t('footer.legal')}</h3>
              <ul className="space-y-3 text-xs font-bold text-slate-300">
                <li><a href="/gdpr" onClick={(e) => { e.preventDefault(); onNavigate('gdpr'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.privacy')}</a></li>
                <li><a href="/impressum" onClick={(e) => { e.preventDefault(); onNavigate('impressum'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.impressum')}</a></li>
                <li><a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.terms')}</a></li>
                <li><a href="/hse" onClick={(e) => { e.preventDefault(); onNavigate('hse'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.hse')}</a></li>
                <li><a href="/careers" onClick={(e) => { e.preventDefault(); onNavigate('careers'); }} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />{t('footer.careers')}</a></li>
              </ul>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-8"
          >
            <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-400">{t('footer.join')}</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">{t('footer.sub')}</p>
            <form onSubmit={handleNewsletterSubmit} className="relative group">
              <input 
                type="email" 
                placeholder={t('footer.placeholder')} 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-6 pr-12 text-sm font-medium outline-none focus:border-blue-400 transition-all focus:bg-white/10 backdrop-blur-md text-white"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <motion.button 
                type="submit" 
                disabled={status === 'loading'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2.5 top-2.5 bottom-2.5 aspect-square bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors shadow-2xl active:scale-90 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <PaperAirplaneIcon className="w-5 h-5" />
                )}
              </motion.button>
            </form>
            {status === 'success' && <p className="text-xs text-emerald-400 font-black uppercase tracking-tighter animate-fade-in">Welcome aboard! Check your inbox.</p>}
            {status === 'error' && <p className="text-xs text-rose-400 font-black uppercase tracking-tighter animate-fade-in">Something failed. Try again.</p>}
          </motion.div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8 border-y border-white/5 mb-8">
           <motion.div 
             whileHover={{ x: 10 }}
             className="flex gap-6 items-center"
           >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-2xl border border-white/10 backdrop-blur-md">📍</div>
              <div>
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.4em] mb-1">{t('footer.base')}</p>
                <p className="text-sm font-bold text-white">Seewadelstrasse 3, 8203 Schaffhausen</p>
              </div>
           </motion.div>
           
           <motion.div 
             whileHover={{ x: 10 }}
             className="flex gap-6 items-center group/wa"
           >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-2xl border border-white/10 backdrop-blur-md group-hover/wa:bg-[#25D366]/20 transition-colors">
                <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-[#25D366] tracking-[0.4em] flex items-center gap-2 mb-1">
                    {t('footer.connect')}
                    <span className="inline-block w-2 h-2 bg-[#25D366] rounded-full animate-pulse shadow-[0_0_10px_rgba(37,211,102,0.5)]"></span>
                </p>
                <a href="https://wa.me/41774505705" target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:text-[#25D366] transition-colors flex items-center gap-3 text-white">
                    +41 77 450 57 05
                    <span className="text-[8px] bg-white/10 px-2 py-1 rounded-lg uppercase tracking-widest font-black">{t('footer.fast')}</span>
                </a>
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ x: 10 }}
             className="flex gap-6 items-center"
           >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-2xl border border-white/10 backdrop-blur-md">✉️</div>
              <div>
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.4em] mb-1">{t('footer.inbox')}</p>
                <a href="mailto:kai@krakenpfm.ch" className="text-sm font-bold hover:text-blue-400 transition-colors text-white">kai@krakenpfm.ch</a>
              </div>
           </motion.div>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">{t('footer.all_rights')}</p>
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('sustainability-page')}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:text-emerald-300 transition-all shadow-2xl group"
             >
                <LeafIcon className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span>{t('footer.co2', { count: co2Value.toFixed(2) })}</span>
             </motion.button>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{t('footer.precision')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
