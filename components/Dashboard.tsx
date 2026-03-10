
import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { 
  CurrencyDollarIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  CogIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ClockIcon,
  WrenchScrewdriverIcon
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
    <main className="bg-slate-100 min-h-screen pt-32 pb-20 font-sans text-gray-800">
      
      {/* Header del Dashboard */}
      <div className="bg-[#002D5B] text-white py-12 mb-8 shadow-md">
          <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                      <h1 className="text-3xl font-bold mb-2">Maintenance Dashboard</h1>
                      <p className="text-blue-200 text-sm">Welcome back, Administrator</p>
                  </div>
                  <div className="mt-6 md:mt-0 flex gap-4">
                      <div className="bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
                          <p className="text-xs text-blue-200 uppercase tracking-wider">Active Jobs</p>
                          <p className="text-2xl font-bold">{activeJobs}</p>
                      </div>
                      <div className="bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
                          <p className="text-xs text-blue-200 uppercase tracking-wider">Monthly Revenue</p>
                          <p className="text-2xl font-bold">CHF {totalRevenue.toLocaleString()}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-6">
        
        {/* Sección Superior: Botón de Acción y Filtros */}
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-[#002D5B]" />
                Service Management
            </h2>
            <button 
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="bg-[#002D5B] hover:bg-[#00254A] text-white px-5 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
                <PlusIcon className="w-5 h-5" />
                {isFormOpen ? 'Close Form' : 'Add New Service'}
            </button>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Columna Izquierda: Formulario (Condicional o Sticky) */}
            {isFormOpen && (
                <div className="lg:col-span-1 animate-fade-in-up">
                    <div className="bg-white rounded-xl shadow-xl border-t-4 border-[#002D5B] overflow-hidden">
                        <div className="p-6 bg-gray-50 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-800">New Service Request</h3>
                            <p className="text-xs text-gray-500">Enter client and job details</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Client Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#002D5B] focus:border-[#002D5B] block p-3 outline-none transition-colors" 
                                    placeholder="e.g. Acme Corp"
                                    value={newRequest.client}
                                    onChange={e => setNewRequest({...newRequest, client: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Service Type</label>
                                <select 
                                    className="w-full bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#002D5B] focus:border-[#002D5B] block p-3 outline-none"
                                    value={newRequest.service}
                                    onChange={e => setNewRequest({...newRequest, service: e.target.value})}
                                    required
                                >
                                    <option value="">Select Service...</option>
                                    <option value="End of Tenancy">End of Tenancy</option>
                                    <option value="Deep Cleaning">Deep Cleaning</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Consultation">Consultation</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#002D5B] focus:border-[#002D5B] block p-3 outline-none" 
                                        value={newRequest.date}
                                        onChange={e => setNewRequest({...newRequest, date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Priority</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#002D5B] focus:border-[#002D5B] block p-3 outline-none"
                                        value={newRequest.priority}
                                        onChange={e => setNewRequest({...newRequest, priority: e.target.value})}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-[#002D5B] hover:bg-[#00254A] font-bold rounded-lg text-sm px-5 py-3 text-center transition-colors shadow-md mt-2">
                                Create Request
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Columna Derecha: Tabla de Datos */}
            <div className={`${isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-500`}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-800 text-gray-200 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">ID</th>
                                    <th className="px-6 py-4 font-semibold">Client</th>
                                    <th className="px-6 py-4 font-semibold">Service</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic">No services found. Add one to get started.</td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">#{req.id}</td>
                                            <td className="px-6 py-4 font-bold text-[#002D5B]">{req.client}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {req.priority === 'High' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="High Priority"></span>}
                                                    {req.service}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{req.date}</td>
                                            <td className="px-6 py-4">
                                                <span 
                                                    onClick={() => handleStatusChange(req.id)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer select-none transition-all ${
                                                    req.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                    req.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                    'bg-amber-100 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDelete(req.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Footer de la Tabla */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                        <span>Showing {requests.length} records</span>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full"></span> Pending</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> In Progress</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full"></span> Completed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Value Cards - Resumen adicional (Componentes originales reutilizados abajo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-full text-[#002D5B]"><UserGroupIcon className="w-6 h-6"/></div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase font-bold">Total Clients</p>
                        <p className="text-xl font-bold">1,240</p>
                    </div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-full text-green-600"><CheckIcon className="w-6 h-6"/></div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase font-bold">Satisfaction</p>
                        <p className="text-xl font-bold">98.5%</p>
                    </div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-50 p-3 rounded-full text-purple-600"><ClockIcon className="w-6 h-6"/></div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase font-bold">Avg. Time</p>
                        <p className="text-xl font-bold">4.2 Hrs</p>
                    </div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-50 p-3 rounded-full text-orange-600"><WrenchScrewdriverIcon className="w-6 h-6"/></div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase font-bold">Team Size</p>
                        <p className="text-xl font-bold">48</p>
                    </div>
                </div>
             </div>
        </div>

      </div>
      <style>{`
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default Dashboard;
