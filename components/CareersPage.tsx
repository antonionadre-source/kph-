
import React, { useState, FormEvent } from 'react';
import { useTranslation } from '../i18n';
import { CheckIcon, DocumentTextIcon, MapPinIcon, ClockIcon } from './icons';
import emailjs from '@emailjs/browser';

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/dkmya8ae31ib7gwy6xi2f4f8icaxbezo';
const SERVICE_ID = 'service_aiv15bc';
const TEMPLATE_ID = 'template_aktj7t9';
const PUBLIC_KEY = 'sH5K84ChHyssJrarm';

interface CareersPageProps {
  onNavigate: (page: string) => void;
}

const CareersPage: React.FC<CareersPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<{id: string, title: string} | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
    cvName: '', 
  });

  const positions = [
    { id: 'cleaner', titleKey: 'careers.position.cleaner', locationKey: 'careers.location.sz', typeKey: 'careers.type.partFull' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setFormData(prev => ({ ...prev, cvName: e.target.files![0].name }));
    }
  };

  const handleProceedToApply = () => {
    if (selectedJob) {
        setFormData(prev => ({ ...prev, position: selectedJob.title }));
        setSelectedJob(null);
        const formElement = document.getElementById('application-form');
        if(formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        // Prepare Make.com Payload
        const webhookPromise = fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'JOB_APPLICATION',
                ...formData,
                timestamp: new Date().toISOString()
            })
        });

        // Prepare EmailJS Payload
        const emailPromise = emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            from_name: formData.name,
            from_email: formData.email,
            phone_number: formData.phone,
            services_interest: `JOB_APPLICATION: ${formData.position}`,
            message: `New applicant for ${formData.position}.\nMessage: ${formData.message}\nCV Filename: ${formData.cvName}`,
            property_address: 'N/A'
        }, PUBLIC_KEY);

        await Promise.all([webhookPromise, emailPromise]);
        setIsSubmitted(true);
        window.scrollTo(0, 0);
    } catch (err) {
        console.error('FAILED...', err);
        setError('Failed to send application. Please contact kai@krakenpfm.ch directly.');
    } finally {
        setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 pt-40 text-center px-4">
        <div className="max-w-xl w-full bg-white p-12 rounded-[3rem] shadow-2xl animate-fade-in-up">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckIcon className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-[#002D5B] mb-4 uppercase tracking-tight">Application Received</h2>
          <p className="text-gray-500 font-medium mb-10">{t('careers.success.message')}</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-[#002D5B] text-white px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#00254A] transition-all shadow-xl"
          >
            {t('consultation.success.button')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 pt-48 pb-32">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-24">
            <span className="text-[#007AFF] font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Talent Acquisition</span>
            <h1 className="text-4xl md:text-7xl font-black text-[#002D5B] tracking-tighter leading-none mb-8 uppercase">{t('careers.title')}</h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">{t('careers.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <span className="bg-[#002D5B] text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shadow-md">01</span>
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{t('careers.positions.title')}</h3>
                </div>
                <div className="space-y-6">
                    {positions.map((job) => (
                        <div key={job.id} className={`group bg-white p-8 rounded-[2.5rem] shadow-sm border-2 transition-all duration-500 ${selectedJob?.id === job.id ? 'border-[#007AFF] shadow-xl' : 'border-transparent hover:shadow-lg'}`}>
                            <h4 className="font-black text-2xl text-[#002D5B] mb-4 uppercase tracking-tighter leading-tight">{t(job.titleKey)}</h4>
                            <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
                                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full"><MapPinIcon className="w-3.5 h-3.5 text-[#007AFF]"/> {t(job.locationKey)}</span>
                                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full"><ClockIcon className="w-3.5 h-3.5 text-[#007AFF]"/> {t(job.typeKey)}</span>
                            </div>
                            <button 
                                onClick={() => {
                                    setSelectedJob({ id: job.id, title: t(job.titleKey) });
                                    handleProceedToApply();
                                }}
                                className="inline-flex items-center gap-2 text-[#007AFF] font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                            >
                                {t('careers.position.apply')}
                                <span className="text-lg">→</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div id="application-form" className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-[#002D5B] mb-8 uppercase tracking-tighter">{t('careers.form.title')}</h3>
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-tight">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{t('careers.form.name')}</label><input name="name" required className="w-full p-4 bg-slate-50 border border-gray-100 rounded-xl focus:border-[#007AFF] outline-none font-bold text-sm transition-all" onChange={handleInputChange} value={formData.name} /></div>
                            <div><label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{t('careers.form.email')}</label><input name="email" type="email" required className="w-full p-4 bg-slate-50 border border-gray-100 rounded-xl focus:border-[#007AFF] outline-none font-bold text-sm transition-all" onChange={handleInputChange} value={formData.email} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{t('careers.form.phone')}</label><input name="phone" required className="w-full p-4 bg-slate-50 border border-gray-100 rounded-xl focus:border-[#007AFF] outline-none font-bold text-sm transition-all" onChange={handleInputChange} value={formData.phone} /></div>
                            <div><label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{t('careers.form.position')}</label><input name="position" required className="w-full p-4 bg-slate-50 border border-gray-100 rounded-xl focus:border-[#007AFF] outline-none font-bold text-sm transition-all" value={formData.position} onChange={handleInputChange} placeholder="e.g. Cleaning Specialist" /></div>
                        </div>
                        
                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">{t('careers.form.cv')}</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:bg-slate-50 hover:border-[#007AFF] transition-all relative group/upload">
                                <input type="file" accept=".pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007AFF] group-hover/upload:scale-110 transition-transform"><DocumentTextIcon className="w-8 h-8" /></div>
                                    {formData.cvName ? <span className="font-black text-[#002D5B] text-sm">{formData.cvName}</span> : (
                                        <>
                                            <span className="text-xs font-black uppercase tracking-widest text-gray-500">{t('careers.form.uploadPlaceholder')}</span>
                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{t('careers.form.fileLimit')}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div><label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{t('careers.form.message')}</label><textarea name="message" rows={4} className="w-full p-4 bg-slate-50 border border-gray-100 rounded-xl focus:border-[#007AFF] outline-none font-bold text-sm transition-all" onChange={handleInputChange} value={formData.message}></textarea></div>

                        <button type="submit" disabled={isLoading} className="w-full bg-[#002D5B] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black transition-all disabled:opacity-70 mt-4 uppercase tracking-widest text-sm">
                            {isLoading ? 'Sending Pipeline...' : t('careers.form.submit')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default CareersPage;
