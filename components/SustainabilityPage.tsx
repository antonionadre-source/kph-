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
      label: t('sustainability.page.metrics.co2'),
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50'
    },
    {
      value: '85%',
      label: t('sustainability.page.metrics.products'),
      icon: <Recycle className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      value: '0%',
      label: t('sustainability.page.metrics.waste'),
      icon: <TrendingDown className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50'
    },
    {
      value: '3',
      label: t('sustainability.page.metrics.cities'),
      icon: <MapPin className="w-6 h-6 text-teal-600" />,
      color: 'bg-teal-50'
    }
  ];

  const pillars = [
    {
      title: t('sustainability.page.pillars.p1.title'),
      desc: t('sustainability.page.pillars.p1.desc'),
      icon: <Search className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      title: t('sustainability.page.pillars.p2.title'),
      desc: t('sustainability.page.pillars.p2.desc'),
      icon: <Scale className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50'
    },
    {
      title: t('sustainability.page.pillars.p3.title'),
      desc: t('sustainability.page.pillars.p3.desc'),
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      title: t('sustainability.page.pillars.p4.title'),
      desc: t('sustainability.page.pillars.p4.desc'),
      icon: <Users className="w-6 h-6 text-blue-700" />,
      color: 'bg-blue-50'
    }
  ];

  return (
    <main className="bg-[#F8FAFC] min-h-screen pb-12 selection:bg-blue-500/30">
      
      {/* Hero Section */}
      <section data-header-theme="dark" className="relative min-h-[500px] md:h-[650px] overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="/sustainability-hero.png" 
            alt="Sustainable Building" 
            className="w-full h-full object-cover object-center lg:object-right"
            referrerPolicy="no-referrer"
          />
          {/* Neutral dark overlays for optimal readability without heavy artificial blue tinting */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 h-full flex items-center lg:items-start relative z-10 pt-36 md:pt-32 pb-12">
          <div className="max-w-2xl">

            
            <h1 
              className="text-5xl md:text-7xl lg:text-[71px] font-black text-white leading-[0.9] tracking-tighter mb-6 uppercase"
            >
              {t('sustainability.page.hero.title_line1')} <br />
              <span className="text-blue-400">{t('sustainability.page.hero.title_line2')}</span>
            </h1>

            <p 
              className="text-xl text-blue-100/80 font-medium leading-relaxed mb-8 max-w-lg"
            >
              {t('sustainability.page.hero.subtitle')}
            </p>

            <div 
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => onNavigate('our-story')}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20"
              >
                {t('sustainability.page.hero.cta_story')}
              </button>
              <div className="flex items-center gap-2 text-white/50 font-black text-[10px] uppercase tracking-widest bg-white/5 backdrop-blur-md px-6 py-4 rounded-xl border-2 border-white/10 w-fit">
                {t('sustainability.page.hero.badge_brochure')}
              </div>
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
              <h4 className="text-[11px] font-black text-[#001A3D] mb-1 uppercase tracking-tight">{t('sustainability.page.floating.title')}</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                {t('sustainability.page.floating.desc')}
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
                    <div className={`text-[11px] uppercase leading-tight ${
                      idx === 2 
                        ? 'font-black text-indigo-700 tracking-[0.05em] drop-shadow-sm' 
                        : 'font-bold text-gray-500 tracking-wider'
                    }`}>
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
          <p className="text-[#001A3D] font-black text-[11px] uppercase tracking-[0.4em] whitespace-nowrap">{t('sustainability.page.pillars.header')}</p>
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
              <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-1 text-center leading-tight max-w-[120px]">{t('sustainability.page.bcorp.working_towards')}</span>
              <div className="w-16 h-16 rounded-full border-4 border-gray-900 flex items-center justify-center mb-1">
                <span className="text-4xl font-black text-gray-900 leading-none">B</span>
              </div>
              <span className="text-sm font-black text-gray-900 tracking-widest">CORP</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#001A3D] mb-4 leading-tight tracking-tight">
                {t('sustainability.page.bcorp.title')}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium">
                {t('sustainability.page.bcorp.desc')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  t('sustainability.page.bcorp.check1'),
                  t('sustainability.page.bcorp.check2'),
                  t('sustainability.page.bcorp.check3')
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-[10px] font-bold text-gray-500 leading-tight">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-emerald-800/40 font-black text-[11px] uppercase tracking-widest bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10 w-fit">
                {t('sustainability.page.bcorp.roadmap_soon')}
              </div>
            </div>
          </div>

          {/* Impact in Action */}
          <div className="bg-[#F1F5F9] rounded-[2rem] overflow-hidden flex flex-col md:flex-row group">
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl font-black text-[#001A3D] mb-4 leading-tight tracking-tight">
                {t('sustainability.page.impact.title')}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium">
                {t('sustainability.results.desc')}
              </p>
              <div className="flex items-center gap-2 text-blue-800/40 font-black text-[11px] uppercase tracking-widest bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/10 w-fit">
                {t('sustainability.page.impact.cases_soon')}
              </div>
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
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">{t('sustainability.page.impact.energy')}</div>
                <div className="text-[8px] text-gray-400 font-medium mb-4">{t('sustainability.page.impact.compare_years')}</div>
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
          <h2 className="text-4xl md:text-[54px] font-black text-[#001A3D] mb-6 tracking-tight leading-none text-center uppercase">{t('sustainability.page.roadmap.title')}</h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto text-center text-sm md:text-base leading-relaxed">
            {t('sustainability.page.roadmap.desc')}
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
                      src="/sustainability-circular.png" 
                      alt="Logistics Illustration" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="relative z-10 h-full flex flex-col lg:flex-row p-8 md:p-10 gap-12 items-center">
                    {/* Left Side: Text */}
                    <div className="lg:w-1/2">
                      <h2 className="text-4xl md:text-5xl font-black text-[#001A3D] mb-6 leading-tight uppercase tracking-tighter">
                        {t('sustainability.page.logistics.title')}
                      </h2>
                      <p className="text-gray-600 max-w-sm text-sm md:text-lg font-medium leading-relaxed mb-8">
                        {t('sustainability.page.logistics.desc')}
                      </p>
                    </div>
                  </div>


               </div>
            </div>

             {/* LEFT COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Card 1: Circular Sustainability */}
              <div className="bg-black rounded-[2rem] overflow-hidden min-h-[500px] md:h-[630px] relative group">
                <img 
                  src="/sustainability-people.png" 
                  alt="Certified" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">{t('sustainability.page.bento.circular.badge')}</p>
                  <h3 className="text-2xl font-black text-white leading-tight mb-4 uppercase text-pretty">{t('sustainability.page.bento.circular.title')}</h3>
                  <p className="text-xs text-gray-200 font-medium leading-relaxed max-w-xs">
                    {t('sustainability.page.bento.circular.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* MIDDLE COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Card 3: Personnel Selection */}
              <div className="bg-black rounded-[2rem] overflow-hidden min-h-[300px] md:h-[288px] relative group">
                <img 
                  src="/sustainability-logistics.png" 
                  alt="People" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">{t('sustainability.page.bento.people.badge')}</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-3 uppercase">{t('sustainability.page.bento.people.title')}</h3>
                  <p className="text-[10px] text-gray-200 font-medium leading-relaxed max-w-[200px]">
                    {t('sustainability.page.bento.people.desc')}
                  </p>
                </div>
              </div>

              {/* Card 4: Inclusion and Diversity */}
              <div className="bg-black rounded-[2rem] overflow-hidden min-h-[300px] md:h-[288px] relative group">
                <img 
                  src="/sustainability-partner.png" 
                  alt="Team" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">{t('sustainability.page.bento.diversity.badge')}</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-2 uppercase text-pretty">{t('sustainability.page.bento.diversity.title')}</h3>
                  <p className="text-[10px] text-gray-200 font-medium leading-relaxed mb-3">
                    {t('sustainability.page.bento.diversity.desc')}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Users size={12} />
                    </div>
                    <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest">{t('sustainability.page.bento.diversity.tag')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Card 5: Local Partnership */}
              <div className="bg-black rounded-[2rem] overflow-hidden min-h-[300px] md:h-[288px] relative group">
                <img 
                  src="/sustainability-diversity.png" 
                  alt="Partnership" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">{t('sustainability.page.bento.partner.badge')}</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-1 uppercase">{t('sustainability.page.bento.partner.title')}</h3>
                  <p className="text-[10px] text-gray-300 font-medium leading-relaxed max-w-xs opacity-80">{t('sustainability.page.bento.partner.desc')}</p>
                </div>
              </div>

              {/* Card 6: Operational excellence */}
              <div className="bg-black rounded-[2rem] overflow-hidden min-h-[300px] md:h-[288px] relative group">
                <img 
                  src="/sustainability-ops.png" 
                  alt="Office" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">{t('sustainability.page.bento.ops.badge')}</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-2 uppercase">{t('sustainability.page.bento.ops.title')}</h3>
                  <p className="text-[10px] text-gray-200 font-medium leading-relaxed">{t('sustainability.page.bento.ops.desc')}</p>
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
              {t('sustainability.page.footer.quote')}
            </p>
          </div>
          
          <div className="lg:w-px lg:h-24 bg-gray-100 hidden lg:block" />

          <div className="lg:w-2/3 flex flex-col md:flex-row justify-between items-center gap-8 w-full">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-[#001A3D] mb-3 tracking-tight">
                {t('sustainability.page.footer.title')}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {t('sustainability.page.footer.subtitle')}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-[#001A3D] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#002d5b] transition-all shadow-xl shadow-blue-900/20">
                {t('sustainability.page.footer.cta.audit')}
              </button>
              <button className="bg-white text-[#001A3D] border-2 border-gray-200 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                {t('sustainability.page.footer.cta.quote')}
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default SustainabilityPage;
