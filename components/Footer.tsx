
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
import { companyLogoWhiteUrl } from '../assets';
import emailjs from '@emailjs/browser';
import { motion } from 'motion/react';

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/dkmya8ae31ib7gwy6xi2f4f8icaxbezo';
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
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="flex flex-col gap-4">
              <img src={companyLogoWhiteUrl} alt="Kraken PFM Logo" className="h-14 w-auto object-contain self-start" />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Properties and</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Facilities Management</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
              The benchmark of excellence in facility management. Merging technology with hospitality to bring architectural order.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a 
                  key={label} 
                  href={href} 
                  target="_blank" 
                  rel="noopener" 
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

          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-400 mb-8">Explore</h4>
              <ul className="space-y-3 text-xs font-bold text-slate-300">
                <li><button onClick={() => onNavigate('services-page')} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />Services</button></li>
                <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />About Kai</button></li>
                <li><button onClick={() => onNavigate('sustainability-page')} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />Green Policy</button></li>
                <li><button onClick={() => onNavigate('clients')} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />Partner Portal</button></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-400 mb-8">Legal</h4>
              <ul className="space-y-3 text-xs font-bold text-slate-300">
                <li><button onClick={() => onNavigate('gdpr')} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />Privacy & GDPR</button></li>
                <li><button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />Terms of Service</button></li>
                <li><button onClick={() => onNavigate('hse')} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />HSE Safety</button></li>
                <li><button onClick={() => onNavigate('careers')} className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />Careers</button></li>
              </ul>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-8"
          >
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-400">Join the Crew</h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Subscribe for exclusive service bundles and property maintenance tips.</p>
            <form onSubmit={handleNewsletterSubmit} className="relative group">
              <input 
                type="email" 
                placeholder="Email address..." 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-6 pr-12 text-sm font-medium outline-none focus:border-blue-400 transition-all focus:bg-white/10 backdrop-blur-md"
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
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.4em] mb-1">Base Operations</p>
                <p className="text-sm font-bold text-white">Seewaldestrasse 3, 8203 Schaffhausen</p>
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
                    Connect Live
                    <span className="inline-block w-2 h-2 bg-[#25D366] rounded-full animate-pulse shadow-[0_0_10px_rgba(37,211,102,0.5)]"></span>
                </p>
                <a href="https://wa.me/41774505705" target="_blank" rel="noopener" className="text-sm font-bold hover:text-[#25D366] transition-colors flex items-center gap-3 text-white">
                    +41 77 450 57 05
                    <span className="text-[8px] bg-white/10 px-2 py-1 rounded-lg uppercase tracking-widest font-black">Fast Response</span>
                </a>
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ x: 10 }}
             className="flex gap-6 items-center"
           >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-2xl border border-white/10 backdrop-blur-md">✉️</div>
              <div>
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.4em] mb-1">Digital Inbox</p>
                <a href="mailto:kai@krakenpfm.ch" className="text-sm font-bold hover:text-blue-400 transition-colors text-white">kai@krakenpfm.ch</a>
              </div>
           </motion.div>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">© {new Date().getFullYear()} KRAKEN PFM</p>
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('sustainability-page')}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:text-emerald-300 transition-all shadow-2xl group"
             >
                <LeafIcon className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span>{co2Value.toFixed(2)}g CO₂ / Visit</span>
             </motion.button>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Swiss Precision Engineered // Secure Real-time Communications</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
