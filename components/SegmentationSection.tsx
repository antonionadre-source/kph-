import React from 'react';
import { useTranslation } from '../i18n';
import { Home, Building2, Check, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SegmentationSectionProps {
  onNavigate: (page: string) => void;
}

const SegmentationSection: React.FC<SegmentationSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const processSteps = [
    {
      number: '01',
      title: 'Get a quote',
      desc: 'Share your needs. We\'ll get back to you quickly.'
    },
    {
      number: '02',
      title: 'Tailored plan',
      desc: 'We design a solution that fits your space.'
    },
    {
      number: '03',
      title: 'We get to work',
      desc: 'Our team delivers with care, precision and control.'
    },
    {
      number: '04',
      title: 'You stay informed',
      desc: 'We keep you updated at every step.'
    },
    {
      number: '05',
      title: 'Peace of mind',
      desc: 'Everything runs smoothly. So can you.'
    }
  ];

  return (
    <section id="segmentation-section" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-24">
          {/* Private Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-[#020617] rounded-[1.5rem] overflow-hidden flex flex-col md:flex-row h-full min-h-[450px] md:min-h-[350px]"
          >
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative z-10">
              <div>
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 border border-blue-500/30">
                  <Home className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-blue-400/60 text-[8px] font-black uppercase tracking-[0.3em] mb-2 block">
                  PRIVATE PROPERTIES
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight leading-[1.1]">
                  Your home, <br />
                  <span className="text-blue-500">perfectly managed.</span>
                </h3>
                <p className="text-slate-400 text-[11px] leading-relaxed mb-6 max-w-xs">
                  We take care of your private property with precision and discretion. From regular cleaning to unexpected issues, everything is handled for you.
                </p>

                <ul className="space-y-2 mb-8">
                  {['Home cleaning', 'Property maintenance', 'Key holding & access', 'On-demand services'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/90 text-[11px] font-bold">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => onNavigate('consultation')}
                className="flex items-center gap-2 text-emerald-400 font-black uppercase text-[9px] tracking-widest hover:gap-4 transition-all group/btn"
              >
                GET A QUOTE
                <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
            
            <div className="h-48 md:h-auto md:w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent md:bg-gradient-to-r md:from-[#020617] z-10"></div>
              <img 
                src="https://www.dropbox.com/scl/fi/dbm9w68tvp51esed63znq/imagen-cover-2.png?rlkey=9c9xreyipvnlmczek9s1ox9yn&st=k86zyaki&raw=1" 
                alt="Private Property" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Commercial Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative bg-slate-50 rounded-[1.5rem] overflow-hidden flex flex-col md:flex-row h-full min-h-[450px] md:min-h-[350px] border border-slate-100"
          >
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative z-10">
              <div>
                <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4 border border-blue-500/20">
                  <Building2 className="w-4 h-4 text-[#002d5b]" />
                </div>
                <span className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em] mb-2 block">
                  COMMERCIAL B2B
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-[#002d5b] mb-3 tracking-tight leading-[1.1]">
                  Spaces that reflect <br />
                  <span className="text-blue-600">your business.</span>
                </h3>
                <p className="text-slate-500 text-[11px] leading-relaxed mb-6 max-w-xs">
                  Your workplace should run smoothly without distractions. Professional facility management and cleaning services for offices and commercial spaces.
                </p>

                <ul className="space-y-2 mb-8">
                  {['Office cleaning', 'Building maintenance', 'Facility management', '24/7 support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 text-[11px] font-bold">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => onNavigate('commercial-services')}
                className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[9px] tracking-widest hover:gap-4 transition-all group/btn"
              >
                REQUEST A VISIT
                <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
            
            <div className="h-48 md:h-auto md:w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent md:bg-gradient-to-r md:from-slate-50 z-10"></div>
              <img 
                src="https://www.dropbox.com/scl/fi/1nu6yizy9z0nrat8z1m8n/IMG_6909.png?rlkey=45glnunb4coqtytraoyhjyngg&st=5zq5op7n&raw=1" 
                alt="Commercial Property" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>

        {/* Process Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
              OUR PROCESS
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] tracking-tight">
              Simple. Clear. <span className="text-blue-600">Under control.</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connector Line */}
            <div className="absolute top-10 left-0 right-0 h-px bg-slate-200 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">
              {processSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-white border border-slate-100 shadow-xl shadow-blue-900/5 flex items-center justify-center mb-8 relative z-10 group hover:scale-110 transition-transform">
                    <span className="text-xl font-black text-[#002d5b]">{step.number}</span>
                  </div>
                  <h4 className="text-lg font-black text-[#002d5b] mb-3 tracking-tight">{step.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-[160px]">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SegmentationSection;
