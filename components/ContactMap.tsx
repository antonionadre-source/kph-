import React from 'react';
import { useTranslation } from '../i18n';
import { MapPinIcon, CheckIcon, BuildingIcon, ClockIcon } from './icons';
import { cityImages } from '../assets';

const OperationsSection: React.FC = () => {
  const { t } = useTranslation();

  const hubs = [
    { name: 'Basel', code: 'BSL_HUB', status: 'ACTIVE', region: 'Canton Basel-Stadt', time: '90 min', img: cityImages.basel },
    { name: 'Zurich', code: 'ZRH_HUB', status: 'ACTIVE', region: 'Canton Zurich', time: '60 min', img: cityImages.zurich },
    { name: 'Schaffhausen', code: 'SHF_HUB', status: 'HQ_BASE', region: 'Canton Schaffhausen', time: 'Immediate', img: cityImages.schaffhausen },
    { name: 'St. Gallen', code: 'STG_HUB', status: 'ACTIVE', region: 'Canton St. Gallen', time: '90 min', img: cityImages.stgallen },
    { name: 'Thurgau', code: 'THG_HUB', status: 'ACTIVE', region: 'Canton Thurgau', time: '60 min', img: cityImages.thurgau },
    { name: 'Winterthur', code: 'WTH_HUB', status: 'ACTIVE', region: 'Canton Zurich', time: '45 min', img: cityImages.winterthur },
  ];

  return (
    <section 
      id="contact" 
      className="relative py-32 md:py-48 bg-[#F9FAFB] overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-24 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#002D5B] text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-sm border border-gray-100">
             Swiss Operational Backbone
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#002D5B] tracking-tight leading-none mb-8">
            Strategic <span className="text-[#007AFF]">Network.</span>
          </h2>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            We operate through a decentralized service system ensuring rapid deployment and consistent Swiss quality across the Northern plateau.
          </p>
        </div>

        {/* Hubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {hubs.map((hub, idx) => (
            <div 
                key={idx}
                className="group relative h-[450px] rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2"
            >
                {/* Background Image with Zoom Effect */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${hub.img})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002D5B]/90 via-[#002D5B]/20 to-transparent"></div>
                </div>

                {/* Top Badge */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all duration-500 ${
                        hub.status === 'HQ_BASE' ? 'bg-[#002D5B]/80 text-white' : 'bg-white/10 text-white group-hover:bg-[#007AFF]/80'
                    }`}>
                        {hub.status === 'HQ_BASE' ? <BuildingIcon className="w-6 h-6" /> : <MapPinIcon className="w-6 h-6" />}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/20 ${
                        hub.status === 'HQ_BASE' ? 'bg-[#002D5B]/80 text-white' : 'bg-white/10 text-white'
                    }`}>
                        {hub.status}
                    </span>
                </div>

                {/* Bottom Content (Glass Panel) */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-8 rounded-[2rem] shadow-2xl transition-all duration-500 group-hover:bg-white/20">
                        <div className="flex justify-between items-start mb-2">
                             <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-1">{hub.name}</h3>
                                <p className="text-blue-100/70 text-[10px] font-black uppercase tracking-widest">{hub.region}</p>
                             </div>
                             <div className="text-right">
                                <span className="block text-[8px] font-black text-blue-200 uppercase tracking-widest mb-1">UNIT_ID</span>
                                <span className="font-mono text-xs text-white/50">{hub.code}</span>
                             </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ClockIcon className="w-4 h-4 text-blue-300" />
                                <span className="text-[10px] font-black text-blue-50 uppercase tracking-widest">SLA: {hub.time}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-500">
                                 <CheckIcon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hover Border Glow */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#007AFF]/30 rounded-[3rem] transition-colors pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Global Coverage Summary */}
        <div className="mt-32 max-w-5xl mx-auto bg-[#002D5B] rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#007AFF] rounded-full -mr-32 -mt-32 blur-[120px] opacity-20 animate-pulse"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter leading-none">Full Swiss Plateau <br/><span className="text-[#007AFF]">Integration.</span></h3>
                    <p className="text-blue-100/70 text-xl font-medium leading-relaxed">
                        Our logistical backbone is engineered to support properties with 100% redundancy. We guarantee a 2-hour response window for critical hub failures across all active cantons.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {[
                        { label: 'Asset Units', value: '450+' },
                        { label: 'Response', value: '2h' },
                        { label: 'Redundancy', value: '100%' },
                        { label: 'Active Hubs', value: '6' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center hover:bg-white/10 transition-colors">
                            <p className="text-4xl font-black mb-2 tracking-tighter">{stat.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Contact Footer */}
        <div className="text-center mt-24">
            <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-[10px] mb-10">Strategic Deployment Inquiries</p>
            <a 
                href="mailto:kai@krakenpfm.ch"
                className="inline-flex items-center gap-6 text-[#002D5B] font-black text-2xl md:text-3xl hover:text-[#007AFF] transition-all group"
            >
                kai@krakenpfm.ch
                <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-[#007AFF] group-hover:bg-[#007AFF] group-hover:text-white transition-all transform group-hover:rotate-45">
                    →
                </div>
            </a>
        </div>
      </div>

      <style>{`
        .shadow-3xl {
            box-shadow: 0 50px 100px -20px rgba(0, 45, 91, 0.4);
        }
      `}</style>
    </section>
  );
};

export default OperationsSection;