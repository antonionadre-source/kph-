import React from 'react';
import { useTranslation } from '../i18n';
import { Shield, Clock, ClipboardCheck, Zap, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const ValuesSection: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Shield className="w-10 h-10 text-blue-400" />,
      title: t('values.item1.title'),
      desc: t('values.item1.desc')
    },
    {
      icon: <Clock className="w-10 h-10 text-blue-400" />,
      title: t('values.item2.title'),
      desc: t('values.item2.desc')
    },
    {
      icon: <ClipboardCheck className="w-10 h-10 text-blue-400" />,
      title: t('values.item3.title'),
      desc: t('values.item3.desc')
    },
    {
      icon: <Zap className="w-10 h-10 text-blue-400" />,
      title: t('values.item4.title'),
      desc: t('values.item4.desc')
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-blue-400" />,
      title: t('values.item5.title'),
      desc: t('values.item5.desc')
    }
  ];

  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="bg-[#020d1f] rounded-[2.5rem] py-6 md:py-8 px-8 md:px-12 text-center relative overflow-hidden shadow-2xl">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-200 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            {t('values.badge')}
          </div>
          
          <h2 className="text-lg md:text-2xl font-bold text-white mb-8 tracking-tight">
            {t('values.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-0">
            {values.map((value, index) => (
              <div key={index} className="flex flex-col items-center px-4 relative">
                {/* Vertical Divider */}
                {index > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-20 bg-white/10"></div>
                )}
                
                <div className="mb-3 p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10 shadow-inner">
                  {value.icon}
                </div>
                
                <h3 className="text-white font-bold text-sm mb-1 leading-tight">
                  {value.title}
                </h3>
                
                <p className="text-slate-400 text-xs leading-relaxed max-w-[180px]">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
