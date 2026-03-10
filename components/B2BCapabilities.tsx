import React from 'react';
import { BuildingIcon, ShieldCheckIcon, BoltIcon, SparklesIcon } from './icons';

const B2BCapabilities: React.FC = () => {
  const capabilities = [
    {
      icon: <BuildingIcon className="w-8 h-8" />,
      title: 'Facility Management',
      description: 'Comprehensive management of physical assets and infrastructure to ensure optimal performance.'
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: 'Industrial Cleaning',
      description: 'Specialized cleaning solutions for warehouses, factories, and large-scale commercial spaces.'
    },
    {
      icon: <BoltIcon className="w-8 h-8" />,
      title: 'Technical Maintenance',
      description: 'Proactive and reactive maintenance for electrical, plumbing, and HVAC systems.'
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Asset Protection',
      description: 'Strategic planning to preserve and enhance the long-term value of your real estate portfolio.'
    }
  ];

  return (
    <section id="b2b-capabilities" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">B2B Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#002d5b] leading-tight">
              Technical Excellence for <br /> Swiss Enterprises
            </h2>
          </div>
          <p className="text-gray-600 max-w-md text-lg">
            We combine engineering precision with operational efficiency to support your business goals.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((cap, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-blue-100 group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 transition-colors group-hover:bg-[#002d5b] group-hover:text-white">
                {cap.icon}
              </div>
              <h3 className="text-xl font-bold text-[#002d5b] mb-3">{cap.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default B2BCapabilities;
