
import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CurrencyDollarIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  CogIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from './icons';

// Tipos de datos para el Dashboard
type MaintenanceRequest = {
    id: number;
    client: string;
    service: string;
    date: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    amount: number;
};

// Datos iniciales de ejemplo
const INITIAL_DATA: MaintenanceRequest[] = [
    { id: 1, client: "Mandarin Oriental", service: "Deep Cleaning & Marble Polish", date: "2024-03-15", status: "In Progress", priority: "High", amount: 4500 },
    { id: 2, client: "200 Aldersgate", service: "HVAC Maintenance", date: "2024-03-18", status: "Pending", priority: "Medium", amount: 1200 },
    { id: 3, client: "Primera Corp", service: "Window Cleaning (External)", date: "2024-03-10", status: "Completed", priority: "Low", amount: 850 },
    { id: 4, client: "Green Mountain", service: "Emergency Plumbing", date: "2024-03-20", status: "Pending", priority: "High", amount: 650 },
];

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  
  // Estados para la lógica del dashboard
  const [requests, setRequests] = useState<MaintenanceRequest[]>(INITIAL_DATA);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Estado del formulario
  const [newRequest, setNewRequest] = useState({
      client: '',
      service: '',
      date: '',
      priority: 'Medium'
  });

  // Manejadores de eventos
  const handleDelete = (id: number) => {
      setRequests(requests.filter(req => req.id !== id));
  };

  const handleStatusChange = (id: number) => {
      setRequests(requests.map(req => {
          if (req.id === id) {
              const nextStatus = req.status === 'Pending' ? 'In Progress' : req.status === 'In Progress' ? 'Completed' : 'Completed';
              return { ...req, status: nextStatus };
          }
          return req;
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const request: MaintenanceRequest = {
          id: Date.now(),
          client: newRequest.client,
          service: newRequest.service,
          date: newRequest.date,
          status: 'Pending',
          priority: newRequest.priority as any,
          amount: 0 // Default for demo
      };
      setRequests([request, ...requests]);
      setNewRequest({ client: '', service: '', date: '', priority: 'Medium' });
      setIsFormOpen(false);
  };

  // Cálculos de resumen
  const totalRevenue = requests.reduce((acc, curr) => acc + curr.amount, 0);
  const activeJobs = requests.filter(r => r.status !== 'Completed').length;

  return (
    <main className="bg-[#020617] min-h-screen pt-32 pb-20 font-sans text-white relative overflow-hidden">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_70%)]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      {/* Header del Dashboard */}
      <div className="relative z-10 mb-12">
          <div className="container mx-auto px-6">
              <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row justify-between items-center">
                  <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-px bg-blue-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">System Overview</span>
                      </div>
                      <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Maintenance <span className="text-blue-500">Hub</span></h1>
                      <p className="text-white/40 font-bold text-sm uppercase tracking-[0.2em]">Welcome back, Administrator</p>
                  </div>
                  <div className="mt-8 md:mt-0 flex gap-6">
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white/5 px-8 py-5 rounded-3xl border border-white/10 backdrop-blur-xl"
                      >
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Active Jobs</p>
                          <p className="text-3xl font-black">{activeJobs}</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white/5 px-8 py-5 rounded-3xl border border-white/10 backdrop-blur-xl"
                      >
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Revenue</p>
                          <p className="text-3xl font-black">CHF {totalRevenue.toLocaleString()}</p>
                      </motion.div>
                  </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Sección Superior: Botón de Acción y Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-4">
                <DocumentTextIcon className="w-10 h-10 text-blue-500" />
                Service Management
            </h2>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl shadow-[0_20px_40px_rgba(37,99,235,0.3)] flex items-center gap-3 transition-all font-black text-[12px] uppercase tracking-[0.2em]"
            >
                <PlusIcon className="w-5 h-5" />
                {isFormOpen ? 'Close Portal' : 'Add New Service'}
            </motion.button>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Columna Izquierda: Formulario */}
            <AnimatePresence>
              {isFormOpen && (
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="lg:col-span-1"
                  >
                      <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                          <div className="p-8 bg-white/5 border-b border-white/5">
                              <h3 className="font-black text-xl uppercase tracking-tight">New Service Request</h3>
                              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">Enter client and job details</p>
                          </div>
                          <form onSubmit={handleSubmit} className="p-8 space-y-6">
                              <div className="space-y-2">
                                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-4">Client Name</label>
                                  <input 
                                      type="text" 
                                      required
                                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-white/10" 
                                      placeholder="e.g. Acme Corp"
                                      value={newRequest.client}
                                      onChange={e => setNewRequest({...newRequest, client: e.target.value})}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-4">Service Type</label>
                                  <select 
                                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all appearance-none"
                                      value={newRequest.service}
                                      onChange={e => setNewRequest({...newRequest, service: e.target.value})}
                                      required
                                  >
                                      <option value="" className="bg-[#020617]">Select Service...</option>
                                      <option value="End of Tenancy" className="bg-[#020617]">End of Tenancy</option>
                                      <option value="Deep Cleaning" className="bg-[#020617]">Deep Cleaning</option>
                                      <option value="Maintenance" className="bg-[#020617]">Maintenance</option>
                                      <option value="Consultation" className="bg-[#020617]">Consultation</option>
                                  </select>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-4">Date</label>
                                      <input 
                                          type="date" 
                                          required
                                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all" 
                                          value={newRequest.date}
                                          onChange={e => setNewRequest({...newRequest, date: e.target.value})}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-4">Priority</label>
                                      <select 
                                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all appearance-none"
                                          value={newRequest.priority}
                                          onChange={e => setNewRequest({...newRequest, priority: e.target.value})}
                                      >
                                          <option value="Low" className="bg-[#020617]">Low</option>
                                          <option value="Medium" className="bg-[#020617]">Medium</option>
                                          <option value="High" className="bg-[#020617]">High</option>
                                      </select>
                                  </div>
                              </div>
                              <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all mt-4"
                              >
                                Create Request
                              </motion.button>
                          </form>
                      </div>
                  </motion.div>
              )}
            </AnimatePresence>

            {/* Columna Derecha: Tabla de Datos */}
            <div className={`${isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-700`}>
                <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 text-white/40 uppercase text-[10px] font-black tracking-[0.3em]">
                                <tr>
                                    <th className="px-8 py-6">ID</th>
                                    <th className="px-8 py-6">Client</th>
                                    <th className="px-8 py-6">Service</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-12 text-center text-white/20 italic font-bold">No services found. Add one to get started.</td>
                                    </tr>
                                ) : (
                                    requests.map((req, idx) => (
                                        <motion.tr 
                                          key={req.id} 
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: idx * 0.05 }}
                                          className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-8 py-6 font-mono text-[10px] text-white/30">#{req.id}</td>
                                            <td className="px-8 py-6 font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{req.client}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3 font-bold text-white/70">
                                                    {req.priority === 'High' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="High Priority"></span>}
                                                    {req.service}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-white/40 font-bold">{req.date}</td>
                                            <td className="px-8 py-6">
                                                <span 
                                                    onClick={() => handleStatusChange(req.id)}
                                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer select-none transition-all border ${
                                                    req.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    req.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <motion.button 
                                                    whileHover={{ scale: 1.2, color: "#ef4444" }}
                                                    whileTap={{ scale: 0.8 }}
                                                    onClick={() => handleDelete(req.id)}
                                                    className="p-2 text-white/20 transition-colors"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Footer de la Tabla */}
                    <div className="bg-white/5 px-8 py-6 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
                        <span>Showing {requests.length} records</span>
                        <div className="flex gap-6">
                            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-400 rounded-full"></span> Pending</span>
                            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> In Progress</span>
                            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-400 rounded-full"></span> Completed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
             {[
               { icon: UserGroupIcon, label: "Total Clients", value: "1,240", color: "blue" },
               { icon: CheckIcon, label: "Satisfaction", value: "98.5%", color: "emerald" },
               { icon: ClockIcon, label: "Avg. Time", value: "4.2 Hrs", color: "purple" },
               { icon: WrenchScrewdriverIcon, label: "Team Size", value: "48", color: "orange" }
             ].map((card, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 whileHover={{ y: -10 }}
                 className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-xl group"
               >
                  <div className="flex items-center gap-6">
                      <div className={`bg-${card.color}-500/10 p-4 rounded-2xl text-${card.color}-400 border border-${card.color}-500/20 group-hover:scale-110 transition-transform`}>
                        <card.icon className="w-8 h-8"/>
                      </div>
                      <div>
                          <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mb-1">{card.label}</p>
                          <p className="text-2xl font-black tracking-tight">{card.value}</p>
                      </div>
                  </div>
               </motion.div>
             ))}
        </div>

      </div>
    </main>
  );
};

export default Dashboard;
