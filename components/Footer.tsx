
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
import emailjs from '@emailjs/browser';

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
    <footer id="contact" className="bg-[#002D5B] text-white py-12 md:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">
              Kraken <br/>
              <span className="text-blue-400">PFM</span>
            </h2>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">
              The benchmark of excellence in facility management. Merging technology with hospitality to bring architectural order.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener" aria-label={label} className={`w-10 h-10 bg-white/5 ${label === 'WhatsApp' ? 'hover:bg-[#25D366]' : 'hover:bg-blue-600'} rounded-full flex items-center justify-center transition-all group`}>
                  <Icon className={`w-4 h-4 ${label === 'WhatsApp' ? 'group-hover:scale-110' : ''}`} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-blue-400 mb-6">Explore</h4>
              <ul className="space-y-3 text-sm font-bold text-gray-300">
                <li><button onClick={() => onNavigate('services-page')} className="hover:text-white transition-colors">Services</button></li>
                <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Kai</button></li>
                <li><button onClick={() => onNavigate('sustainability-page')} className="hover:text-white transition-colors">Green Policy</button></li>
                <li><button onClick={() => onNavigate('clients')} className="hover:text-white transition-colors">Partner Portal</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-blue-400 mb-6">Legal</h4>
              <ul className="space-y-3 text-sm font-bold text-gray-300">
                <li><button onClick={() => onNavigate('gdpr')} className="hover:text-white transition-colors">Privacy & GDPR</button></li>
                <li><button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
                <li><button onClick={() => onNavigate('hse')} className="hover:text-white transition-colors">HSE Safety</button></li>
                <li><button onClick={() => onNavigate('careers')} className="hover:text-white transition-colors">Careers</button></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-black text-xs uppercase tracking-widest text-blue-400">Join the Crew</h4>
            <p className="text-sm text-gray-400 font-medium">Subscribe for exclusive service bundles and property maintenance tips.</p>
            <form onSubmit={handleNewsletterSubmit} className="relative group">
              <input 
                type="email" 
                placeholder="Email address..." 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium outline-none focus:border-blue-400 transition-colors focus:bg-white/10"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg active:scale-90 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <PaperAirplaneIcon className="w-4 h-4" />
                )}
              </button>
            </form>
            {status === 'success' && <p className="text-xs text-emerald-400 font-black uppercase tracking-tighter animate-fade-in">Welcome aboard! Check your inbox.</p>}
            {status === 'error' && <p className="text-xs text-rose-400 font-black uppercase tracking-tighter animate-fade-in">Something failed. Try again.</p>}
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 border-y border-white/10 mb-10">
           <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📍</div>
              <div>
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Base Operations</p>
                <p className="text-sm font-bold">Seewaldestrasse 3, 8203 Schaffhausen</p>
              </div>
           </div>
           
           <div className="flex gap-4 items-center group/wa">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover/wa:bg-[#25D366]/20 transition-colors">
                <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-[#25D366] tracking-widest flex items-center gap-2">
                    Connect Live
                    <span className="inline-block w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                </p>
                <a href="https://wa.me/41774505705" target="_blank" rel="noopener" className="text-sm font-bold hover:text-[#25D366] transition-colors flex items-center gap-2">
                    +41 77 450 57 05
                    <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded uppercase tracking-tighter">Fast Response</span>
                </a>
              </div>
           </div>

           <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner">✉️</div>
              <div>
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Digital Inbox</p>
                <a href="mailto:kai@krakenpfm.ch" className="text-sm font-bold hover:text-blue-400 transition-colors">kai@krakenpfm.ch</a>
              </div>
           </div>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
             <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">© {new Date().getFullYear()} KRAKEN PFM</p>
             <a 
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate('sustainability-page'); }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-[9px] font-black uppercase tracking-wider hover:bg-emerald-900/60 hover:text-white transition-all shadow-sm group"
             >
                <LeafIcon className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>{co2Value.toFixed(2)}g CO₂ / Visit</span>
             </a>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Swiss Precision Engineered // Secure Real-time Communications</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
