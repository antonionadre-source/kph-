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
      label: 'Reducción de emisiones CO2',
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50'
    },
    {
      value: '85%',
      label: 'Uso de productos eco-certificados',
      icon: <Recycle className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      value: '0%',
      label: 'Residuos a vertedero (objetivo 2026)',
      icon: <TrendingDown className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50'
    },
    {
      value: '12+',
      label: 'Ciudades con operaciones sostenibles',
      icon: <MapPin className="w-6 h-6 text-teal-600" />,
      color: 'bg-teal-50'
    }
  ];

  const pillars = [
    {
      title: 'Verified Performance',
      desc: 'Auditorías externas que validan nuestro impacto ambiental.',
      icon: <Search className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Legal Accountability',
      desc: 'Compromisos legales bajo estándares B Corp.',
      icon: <Scale className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50'
    },
    {
      title: 'Public Transparency',
      desc: 'Reportes abiertos y trazabilidad completa de procesos.',
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Social Impact',
      desc: 'Programas activos en comunidades y empleo responsable.',
      icon: <Users className="w-6 h-6 text-blue-700" />,
      color: 'bg-blue-50'
    }
  ];

  return (
    <main className="bg-[#F8FAFC] min-h-screen pt-20 pb-12 selection:bg-blue-500/30">
      
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518005020251-58296b8a879c?auto=format&fit=crop&q=80&w=2000" 
            alt="Sustainable Building" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-8"
            >
              <Leaf className="w-3.5 h-3.5" />
              2025 Sustainability Report
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-[#001A3D] leading-[0.9] tracking-tighter mb-8 uppercase"
            >
              Sustainability, <br />
              <span className="text-blue-600">backed by real impact</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 font-medium leading-relaxed mb-10 max-w-lg"
            >
              Medimos, verificamos y mejoramos el impacto ambiental de cada operación.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button className="bg-[#001A3D] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#002d5b] transition-all shadow-xl shadow-blue-900/20">
                VER IMPACTO REAL
              </button>
              <button className="bg-white text-[#001A3D] border-2 border-gray-200 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> DESCARGAR INFORME 2025
              </button>
            </motion.div>
          </div>

          {/* Floating Hero Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl border border-white/20 max-w-xs"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="text-sm font-black text-[#001A3D] mb-3 uppercase tracking-tight">Building a cleaner future</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              through Swiss precision, circular logistics, and verified impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12">
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
      </section>

      {/* Pillars Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4">CÓMO LO HACEMOS</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`w-20 h-20 ${pillar.color} rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-sm`}>
                {pillar.icon}
              </div>
              <h3 className="text-lg font-black text-[#001A3D] mb-3 uppercase tracking-tight">{pillar.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium max-w-[200px]">
                {pillar.desc}
              </p>
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
            className="bg-emerald-50/50 rounded-[3rem] p-10 md:p-16 border border-emerald-100 flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center border-4 border-gray-200 shrink-0 shadow-inner relative">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">WORKING</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TOWARDS</span>
              <span className="text-6xl font-black text-gray-800 leading-none">B</span>
              <span className="text-sm font-black text-gray-800 mt-1">CORP</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#001A3D] mb-6 leading-tight tracking-tight">
                On our path to B Corp certification
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium">
                Estamos alineando activamente nuestras operaciones con los estándares de certificación B Corp, integrando criterios de impacto ambiental, responsabilidad social y transparencia en cada nivel de nuestro trabajo.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Auditorías internas de impacto en curso',
                  'Selección de proveedores bajo criterios sostenibles',
                  'Implementación de métricas y reporting transparente'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="text-emerald-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group">
                Conoce más sobre nuestro progreso <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Impact in Action */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden group min-h-[400px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
              alt="Impact Action" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001A3D] via-[#001A3D]/20 to-transparent" />
            
            <div className="absolute inset-0 p-10 md:p-16 flex flex-col justify-end">
              <h2 className="text-3xl font-black text-white mb-6 leading-tight tracking-tight">
                Impacto en acción
              </h2>
              <p className="text-sm text-white/80 leading-relaxed mb-8 font-medium max-w-md">
                En 2024, ayudamos a un complejo corporativo a reducir su consumo energético en un 40% mediante optimización operativa y productos eco-certificados.
              </p>
              <button className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group">
                Ver caso completo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Floating Chart Card */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20">
              <div className="text-emerald-600 text-3xl font-black tracking-tighter mb-1">- 40%</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">Consumo energético</div>
              <div className="text-[9px] text-gray-400 font-medium mb-4">2024 vs. 2022</div>
              <div className="w-32 h-12 flex items-end gap-1">
                {[40, 35, 45, 30, 25, 35, 20, 15].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-emerald-500/20 rounded-t-sm relative group/bar"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute bottom-0 left-0 w-full bg-emerald-500 rounded-t-sm transition-all duration-500" style={{ height: '40%' }} />
                  </div>
                ))}
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
              "Elegir Kraken significa elegir estándares reales de impacto, transparencia y sostenibilidad medible."
            </p>
          </div>
          
          <div className="lg:w-px lg:h-24 bg-gray-100 hidden lg:block" />

          <div className="lg:w-2/3 flex flex-col md:flex-row justify-between items-center gap-8 w-full">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-[#001A3D] mb-3 tracking-tight">
                ¿Quieres reducir el impacto de tu propiedad?
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Hablemos sobre cómo podemos ayudarte.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-[#001A3D] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#002d5b] transition-all shadow-xl shadow-blue-900/20">
                SOLICITAR AUDITORÍA SOSTENIBLE
              </button>
              <button className="bg-white text-[#001A3D] border-2 border-gray-200 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                OBTENER PRESUPUESTO
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default SustainabilityPage;
