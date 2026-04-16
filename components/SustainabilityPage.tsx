import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n';
import { 
  Leaf, 
  BarChart3, 
  Scale, 
  Search, 
  Users, 
  CheckCircle2, 
  FileText, 
  Download, 
  TrendingDown,
  ArrowRight,
  Quote,
  Building2,
  MapPin,
  Recycle,
  Droplets
} from 'lucide-react';

interface SustainabilityPageProps {
  onNavigate: (page: string) => void;
}

const SustainabilityPage: React.FC<SustainabilityPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const metrics = [
    {
      value: '32%',
      label: 'CO2 emissions reduction',
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50'
    },
    {
      value: '85%',
      label: 'Use of eco-certified products',
      icon: <Recycle className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      value: '0%',
      label: 'Waste to landfill (2026 goal)',
      icon: <TrendingDown className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50'
    },
    {
      value: '12+',
      label: 'Cities with sustainable operations',
      icon: <MapPin className="w-6 h-6 text-teal-600" />,
      color: 'bg-teal-50'
    }
  ];

  const pillars = [
    {
      title: 'Verified Performance',
      desc: 'External audits that validate our environmental impact.',
      icon: <Search className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Legal Accountability',
      desc: 'Legal commitments under B Corp standards.',
      icon: <Scale className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50'
    },
    {
      title: 'Public Transparency',
      desc: 'Open reporting and full process traceability.',
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Social Impact',
      desc: 'Active community programs and responsible employment.',
      icon: <Users className="w-6 h-6 text-blue-700" />,
      color: 'bg-blue-50'
    }
  ];

  return (
    <main className="bg-[#F8FAFC] min-h-screen pb-12 selection:bg-blue-500/30">
      
      {/* Hero Section */}
      <section className="relative h-[550px] md:h-[650px] overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://www.dropbox.com/scl/fi/manu7v75uqmiga2f3g4pi/ChatGPT-Image-Apr-16-2026-at-02_50_31-AM-2.png?rlkey=jmbqcqgrd0xrzdz1wfc7jn56b&st=nnezsbqd&raw=1" 
            alt="Sustainable Building" 
            className="w-full h-full object-cover object-center lg:object-right"
            referrerPolicy="no-referrer"
          />
          {/* Fade effects to blend with background and text readability */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="container mx-auto px-6 h-full flex items-start relative z-10 pt-10 md:pt-14">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <Leaf className="w-3.5 h-3.5" />
              2025 Sustainability Report
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-[71px] font-black text-[#001A3D] leading-[0.9] tracking-tighter mb-6 uppercase"
            >
              Sustainability, <br />
              <span className="text-blue-600">backed by real impact</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 font-medium leading-relaxed mb-8 max-w-lg"
            >
              We measure, verify, and improve the environmental impact of every operation.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button className="bg-[#001A3D] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#002d5b] transition-all shadow-xl shadow-blue-900/20">
                VIEW REAL IMPACT
              </button>
              <button className="bg-white text-[#001A3D] border-2 border-gray-200 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> DOWNLOAD 2025 REPORT
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="relative">
          {/* Floating Card - Positioned behind the last metric */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden lg:flex absolute -top-36 right-0 bg-white p-8 pb-24 rounded-t-[2rem] rounded-bl-[2rem] shadow-lg border-x border-t border-gray-100 max-w-xs items-start gap-4 z-10"
          >
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-[11px] font-black text-[#001A3D] mb-1 uppercase tracking-tight">Building a cleaner future</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                through Swiss precision, circular logistics, and verified impact.
              </p>
            </div>
          </motion.div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0">
              {metrics.map((metric, idx) => (
                <div key={idx} className={`flex items-center gap-6 ${idx !== metrics.length - 1 ? 'lg:border-r lg:border-gray-100 lg:pr-8' : ''} ${idx !== 0 ? 'lg:pl-8' : ''}`}>
                  <div className={`w-16 h-16 ${metric.color} rounded-full flex items-center justify-center shrink-0`}>
                    {metric.icon}
                  </div>
                  <div>
                    <div className="text-4xl font-black text-[#001A3D] tracking-tighter">{metric.value}</div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-tight">
                      {metric.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex items-center gap-8 mb-20">
          <div className="h-px bg-[#001A3D]/10 flex-1" />
          <p className="text-[#001A3D] font-black text-[11px] uppercase tracking-[0.4em] whitespace-nowrap">HOW WE DO IT</p>
          <div className="h-px bg-[#001A3D]/10 flex-1" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-start gap-6 group px-6 ${idx !== pillars.length - 1 ? 'lg:border-r lg:border-gray-100' : ''} ${idx % 2 === 0 && idx !== pillars.length - 1 ? 'md:border-r md:border-gray-100 lg:border-r' : ''}`}
            >
              <div className={`w-20 h-20 ${pillar.color} rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-sm`}>
                {React.cloneElement(pillar.icon as React.ReactElement, { className: "w-8 h-8 text-[#001A3D]" })}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-[#001A3D] mb-2 leading-tight">{pillar.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* B Corp & Impact Grid */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* B Corp Path */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F1F4F1] rounded-[2rem] p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-10 items-center"
          >
            <div className="w-44 h-44 bg-transparent rounded-full flex flex-col items-center justify-center border border-gray-300 shrink-0 relative">
              <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-1">WORKING</span>
              <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-2">TOWARDS</span>
              <div className="w-16 h-16 rounded-full border-4 border-gray-900 flex items-center justify-center mb-1">
                <span className="text-4xl font-black text-gray-900 leading-none">B</span>
              </div>
              <span className="text-sm font-black text-gray-900 tracking-widest">CORP</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#001A3D] mb-4 leading-tight tracking-tight">
                On our path to B Corp certification
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium">
                We are actively aligning our operations with B Corp certification standards, integrating environmental impact, social responsibility, and transparency criteria at every level of our work.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  'Ongoing internal impact audits',
                  'Supplier selection under sustainable criteria',
                  'Implementation of metrics and transparent reporting'
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-[10px] font-bold text-gray-500 leading-tight">{item}</span>
                  </div>
                ))}
              </div>
              <button className="text-emerald-700 font-black text-[11px] uppercase tracking-widest flex items-center gap-2 group">
                Learn more about our progress <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Impact in Action */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F1F5F9] rounded-[2rem] overflow-hidden flex flex-col md:flex-row group"
          >
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl font-black text-[#001A3D] mb-4 leading-tight tracking-tight">
                Impact in action
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium">
                In 2024, we helped a corporate complex reduce its energy consumption by 40% through operational optimization and eco-certified products.
              </p>
              <button className="text-blue-700 font-black text-[11px] uppercase tracking-widest flex items-center gap-2 group">
                View full case study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="flex-1 relative min-h-[300px]">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
                alt="Impact Action" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F1F5F9] via-transparent to-transparent" />
              
              {/* Floating Chart Card */}
              <div className="absolute top-1/2 -translate-y-1/2 right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-48 z-10">
                <div className="text-emerald-600 text-3xl font-black tracking-tighter mb-1">- 40%</div>
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Energy consumption</div>
                <div className="text-[8px] text-gray-400 font-medium mb-4">2024 vs. 2022</div>
                <div className="w-full h-16 relative">
                  <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                    <path 
                      d="M0,30 L15,35 L30,32 L45,38 L60,25 L75,28 L90,15 L100,30" 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    {[0, 15, 30, 45, 60, 75, 90, 100].map((x, i) => {
                      const y = [30, 35, 32, 38, 25, 28, 15, 30][i];
                      return <circle key={i} cx={x} cy={y} r="1.5" fill="#10B981" />;
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="container mx-auto px-6">
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3 flex gap-6 items-start">
            <Quote className="w-10 h-10 text-blue-100 shrink-0" />
            <p className="text-lg text-gray-600 font-bold italic leading-relaxed">
              "Choosing Kraken means choosing real standards of impact, transparency, and measurable sustainability."
            </p>
          </div>
          
          <div className="lg:w-px lg:h-24 bg-gray-100 hidden lg:block" />

          <div className="lg:w-2/3 flex flex-col md:flex-row justify-between items-center gap-8 w-full">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-[#001A3D] mb-3 tracking-tight">
                Do you want to reduce your property's impact?
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Let's talk about how we can help you.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-[#001A3D] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#002d5b] transition-all shadow-xl shadow-blue-900/20">
                REQUEST SUSTAINABLE AUDIT
              </button>
              <button className="bg-white text-[#001A3D] border-2 border-gray-200 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                GET A QUOTE
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default SustainabilityPage;
