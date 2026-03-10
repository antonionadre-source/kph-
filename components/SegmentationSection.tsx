import React from 'react';
import { useTranslation } from '../i18n';
import { CheckCircleIcon } from './icons';

interface SegmentationSectionProps {
  onNavigate: (page: string) => void;
}

const SegmentationSection: React.FC<SegmentationSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#002d5b] mb-6">
            Tailored Excellence for Every Need
          </h2>
          <p className="text-lg text-gray-600">
            Whether you are a homeowner or a business leader, we provide the precision and reliability you expect from Swiss management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Private Route */}
          <div className="group relative bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
                Residential
              </span>
              <h3 className="text-3xl font-bold text-[#002d5b] mb-4">Private Properties</h3>
              <p className="text-gray-600 leading-relaxed">
                Your home is your sanctuary. We ensure it stays pristine with our premium cleaning, maintenance, and relocation services.
              </p>
            </div>
            
            <ul className="space-y-4 mb-10">
              {['End of Tenancy Cleaning', 'Deep & Daily Cleaning', 'Professional Moving'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                  {item}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onNavigate('consultation')}
              className="w-full bg-[#002d5b] text-white py-5 rounded-2xl font-bold text-lg transition-all hover:bg-[#003d7a] hover:shadow-lg active:scale-95"
            >
              Build your quote / Consultation
            </button>
          </div>

          {/* Commercial Route */}
          <div className="group relative bg-[#002d5b] rounded-[2.5rem] p-10 border border-blue-900 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-2">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-900/50 text-blue-200 text-xs font-bold uppercase tracking-widest mb-4">
                Corporate
              </span>
              <h3 className="text-3xl font-bold text-white mb-4">Commercial & B2B</h3>
              <p className="text-blue-100/70 leading-relaxed">
                Maximize your asset value and operational efficiency. We provide comprehensive facility management for businesses in Switzerland.
              </p>
            </div>

            <ul className="space-y-4 mb-10">
              {['Facility Management', 'Industrial Cleaning', 'Asset & Maintenance'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-blue-100 font-medium">
                  <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => {
                onNavigate('services-page');
                setTimeout(() => {
                  document.getElementById('b2b-capabilities')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full bg-white text-[#002d5b] py-5 rounded-2xl font-bold text-lg transition-all hover:bg-blue-50 hover:shadow-lg active:scale-95"
            >
              Explore B2B Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SegmentationSection;
