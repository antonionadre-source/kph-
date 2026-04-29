import React from 'react';
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
  Droplets,
  Zap,
  Cpu,
  Globe,
  Target,
  Sparkles,
  Handshake,
  Settings,
  ShieldCheck,
  RefreshCw
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
      <section data-header-theme="light" className="relative min-h-[500px] md:h-[650px] overflow-hidden bg-white">
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

        <div className="container mx-auto px-6 h-full flex items-center lg:items-start relative z-10 pt-24 md:pt-14 pb-12">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <Leaf className="w-3.5 h-3.5" />
              2025 Sustainability Report
            </div>
            
            <h1 
              className="text-5xl md:text-7xl lg:text-[71px] font-black text-[#001A3D] leading-[0.9] tracking-tighter mb-6 uppercase"
            >
              Sustainability, <br />
              <span className="text-blue-600">backed by real impact</span>
            </h1>

            <p 
              className="text-xl text-gray-600 font-medium leading-relaxed mb-8 max-w-lg"
            >
              We measure, verify, and improve the environmental impact of every operation.
            </p>

            <div 
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => onNavigate('our-story')}
                className="bg-[#001A3D] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#002d5b] transition-all shadow-xl shadow-blue-900/20"
              >
                VIEW OUR STORY
              </button>
              <button className="bg-white text-[#001A3D] border-2 border-gray-200 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> DOWNLOAD SUSTAINABILITY BROCHURE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="container mx-auto px-6 -mt-16 relative z-30">
        <div className="relative">
          {/* Floating Card - Positioned behind the last metric */}
          <div className="hidden lg:flex absolute -top-36 right-0 bg-white p-8 pb-24 rounded-t-[2rem] rounded-bl-[2rem] shadow-lg border-x border-t border-gray-100 max-w-xs items-start gap-4 z-10">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-[11px] font-black text-[#001A3D] mb-1 uppercase tracking-tight">Building a cleaner future</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                through Swiss precision, circular logistics, and verified impact.
              </p>
            </div>
          </div>

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
      <section data-header-theme="light" className="py-24 container mx-auto px-6">
        <div className="flex items-center gap-8 mb-20">
          <div className="h-px bg-[#001A3D]/10 flex-1" />
          <p className="text-[#001A3D] font-black text-[11px] uppercase tracking-[0.4em] whitespace-nowrap">HOW WE DO IT</p>
          <div className="h-px bg-[#001A3D]/10 flex-1" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
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
            </div>
          ))}
        </div>
      </section>

      {/* B Corp & Impact Grid */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* B Corp Path */}
          <div className="bg-[#F1F4F1] rounded-[2rem] p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-10 items-center">
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
          </div>

          {/* Impact in Action */}
          <div className="bg-[#F1F5F9] rounded-[2rem] overflow-hidden flex flex-col md:flex-row group">
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl font-black text-[#001A3D] mb-4 leading-tight tracking-tight">
                Impact in action
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium">
                {t('sustainability.results.desc')}
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
          </div>
        </div>
      </section>

      {/* Roadmap: Our Plan to Reduce Emissions */}
      <section data-header-theme="light" className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black text-gray-400">Another Star</span>
            <ArrowRight className="w-3 h-3 text-gray-300" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">People, Planet, Progress</span>
          </div>
          <h2 className="text-4xl md:text-[54px] font-black text-[#001A3D] mb-6 tracking-tight leading-none text-center uppercase">Reducing our environmental impact</h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto text-center text-sm md:text-base leading-relaxed">
            We implement sustainable practices across all levels of our operation, from personnel selection to logistics optimization.
          </p>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LOGISTICS SECTION: Full Width at Top */}
            <div className="lg:col-span-12">
               <div className="bg-[#E2E8F0] rounded-[2.5rem] overflow-hidden min-h-[300px] md:h-[380px] relative group">
                  {/* Background Illustration */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="https://www.dropbox.com/scl/fi/l73priig85x3zftgc4egf/logistic.png?rlkey=btdiuv2q77gnf1dzsrvxlcjot&st=gdhbdmzl&raw=1" 
                      alt="Logistics Illustration" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="relative z-10 h-full flex flex-col lg:flex-row p-8 md:p-10 gap-12 items-center">
                    {/* Left Side: Text */}
                    <div className="lg:w-1/2">
                      <h2 className="text-4xl md:text-5xl font-black text-[#001A3D] mb-6 leading-tight uppercase tracking-tighter">
                        Low Emission <br /> Logistics
                      </h2>
                      <p className="text-gray-600 max-w-sm text-sm md:text-lg font-medium leading-relaxed mb-8">
                        Our procurement strategy is being designed to significantly lower carbon emissions by sourcing within the region.
                      </p>
                    </div>

                    {/* Right Side: Data Dashboard */}
                    <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
                      <div className="bg-white/95 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl border border-white/50 w-full max-w-[220px] aspect-square flex flex-col justify-center">
                        {/* Stat 1 */}
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                             <div>
                                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">LOW TRUCK DRIVERT</p>
                                <div className="text-3xl font-black text-[#001A3D] tracking-tighter">-28%</div>
                             </div>
                             <div className="bg-[#001A3D] text-white px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest">
                                Impact: -30k
                             </div>
                          </div>
                          <div className="h-12 w-full relative">
                            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                              <path 
                                d="M0,25 Q15,5 30,20 T60,10 T100,20" 
                                fill="none" 
                                stroke="#10B981" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                              />
                              <circle cx="85" cy="15" r="3" fill="#10B981" className="animate-pulse" />
                            </svg>
                          </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="mb-4">
                          <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">AIS TRACKING OPTIMIZATION</p>
                          <div className="flex justify-between items-end">
                             <div className="text-3xl font-black text-[#001A3D] tracking-tighter">-40%</div>
                             <div className="text-[7px] text-gray-400 font-bold uppercase tracking-tight text-right w-16 leading-none pb-1">
                                AIS TRACKING OPTIMIZATION
                             </div>
                          </div>
                          <div className="h-12 w-full relative mt-1">
                             <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                                <path 
                                  d="M0,15 C20,15 30,5 50,25 C70,45 80,15 100,15" 
                                  fill="none" 
                                  stroke="#3B82F6" 
                                  strokeWidth="3" 
                                  strokeLinecap="round" 
                                />
                             </svg>
                          </div>
                        </div>

                        <div className="bg-emerald-50 rounded-xl p-3 flex items-center gap-3 border border-emerald-100/50">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                            <TrendingDown size={14} />
                          </div>
                          <p className="text-[9px] font-black text-emerald-800 uppercase leading-snug">
                             PRIORITIZING LOCAL PARTNERSHIPS FOR A FUTURE LOWER CARBON FOOTPRINT.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>


               </div>
            </div>

            {/* LEFT COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Card 1: Circular Sustainability */}
              <div className="bg-black rounded-[2rem] overflow-hidden min-h-[500px] md:h-[630px] relative group">
                <img 
                  src="https://www.dropbox.com/scl/fi/ij5i46oagpeppozrlfhtn/certified.png?rlkey=8f5c0pybb3hg4dj5dgzzsjmgj&st=b9ii9ifo&raw=1" 
                  alt="Certified" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">CIRCULAR OPERATIONS</p>
                  <h3 className="text-2xl font-black text-white leading-tight mb-4 uppercase text-pretty">Circular <br /> Sustainability</h3>
                  <p className="text-xs text-gray-200 font-medium leading-relaxed max-w-xs">
                    We will extend the life cycle of products and materials through reuse and responsible maintenance.
                  </p>
                </div>
              </div>
            </div>

            {/* MIDDLE COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Card 3: Personnel Selection */}
              <div className="bg-black rounded-[2rem] overflow-hidden min-h-[300px] md:h-[288px] relative group">
                <img 
                  src="/regenerated_image_1777398255200.png" 
                  alt="People" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">OUR PEOPLE</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-3 uppercase">Personnel Selection</h3>
                  <p className="text-[10px] text-gray-200 font-medium leading-relaxed max-w-[200px]">
                    Selecting personnel based on proximity to reduce commuting time.
                  </p>
                </div>
              </div>

              {/* Card 4: Inclusion and Diversity */}
              <div className="bg-black rounded-[2rem] overflow-hidden min-h-[300px] md:h-[288px] relative group">
                <img 
                  src="https://www.dropbox.com/scl/fi/p7cbark3l9qhhnafppeht/team.png?rlkey=9vrjkm0547w3ylael3q9b7ljz&st=atjvbkkn&raw=1" 
                  alt="Team" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">OUR PEOPLE</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-2 uppercase text-pretty">Diversity</h3>
                  <p className="text-[10px] text-gray-200 font-medium leading-relaxed mb-3">
                    We foster an inclusive environment where every individual is respected.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Users size={12} />
                    </div>
                    <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest">Inclusion</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Card 5: Local Partnership */}
              <div className="bg-black rounded-[2rem] overflow-hidden min-h-[300px] md:h-[288px] relative group">
                <img 
                  src="https://www.dropbox.com/scl/fi/5qzbv110bwhg5vskx6zt9/partner.png?rlkey=bplwv19q0zayttfyu1nn2qytb&st=qv6sh7oc&raw=1" 
                  alt="Partnership" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">PARTNERSHIP</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-1 uppercase">Local Partnership</h3>
                  <p className="text-[10px] text-gray-300 font-medium leading-relaxed max-w-xs opacity-80">We work with local B Corp companies and regional partners to strengthen our communities and reduce our environmental impact.</p>
                </div>
              </div>

              {/* Card 6: Operational excellence */}
              <div className="bg-black rounded-[2rem] overflow-hidden min-h-[300px] md:h-[288px] relative group">
                <img 
                  src="https://www.dropbox.com/scl/fi/lczqkdvrrhfp7xagenq95/office.png?rlkey=vu6oerzdkqrg8dkcsvl4afx7o&st=whp619rg&raw=1" 
                  alt="Office" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">OPERATIONS</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-2 uppercase">Implementation</h3>
                  <p className="text-[10px] text-gray-200 font-medium leading-relaxed">We implement sustainable practices across all operations, with continuous monitoring and improvement.</p>
                </div>
              </div>
            </div>

          </div>
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
