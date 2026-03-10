import React from 'react';
import { useTranslation } from '../i18n';

// Add Props interface to accept onNavigate
interface TermsPageProps {
  onNavigate: (page: string) => void;
}

// Updated component to accept onNavigate prop
const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const sections = [
    {
      title: "1. Scope of Services & Contract Conclusion",
      content: "Kraken Properties and Facilities Management (hereafter 'Kraken') provides professional cleaning, moving, and property maintenance services. According to Art. 394ff of the Swiss Code of Obligations (OR), a mandate is established upon the client's confirmation of a written or digital offer. The specific scope is defined in the individual service request or quote. Our commitment is to deliver excellence according to Swiss quality standards and industry-specific norms."
    },
    {
      title: "2. Estimates, Media Validation & Price Adjustments",
      content: "Estimates provided via our online tools are preliminary. Clients choosing 'Precision Media Quote' must pay a non-refundable CHF 15.00 fee for the technical review of their property media. This fee is 100% deductible from the final accepted invoice. For 'Express Binding' bookings, a 15% deposit of the estimated budget is required. If the work requires more hours than estimated by the client, an additional charge of CHF 90.00 per extra hour/person will be applied to the final balance."
    },
    {
      title: "3. End-of-Tenancy Handover Guarantee",
      content: "Our End-of-Tenancy cleaning includes a 100% Handover Guarantee. If the landlord identifies cleaning-related issues during the official inspection (Abgabeprotokoll), Kraken will rectify them free of charge. This is valid only if: a) Kraken is notified within 24 hours of the inspection; b) The inspection occurs within 72 hours of our cleaning; c) The property remains unoccupied and in the same condition as we left it."
    },
    {
      title: "4. Payment Terms & Default (Swiss CO Art. 75)",
      content: "Payments are processed via secure Revolut Business links. The initial deposit (15% for Direct Booking or 15 CHF for Validation) is required to secure the slot or start the study. The remaining balance of any service is due immediately upon completion or within a maximum of 7 natural days from the invoice date. Late payments incur a statutory default interest of 5% p.a. (Art. 102ff OR) plus administrative reminder fees: CHF 20.00 for the second reminder and CHF 50.00 for the third."
    },
    {
      title: "5. Travel Fees & Multi-Service Bundling",
      content: "A standard travel fee of CHF 45.00 applies. This is dynamically adjusted for bundled services: CHF 25.00 applies if the client books (1 Main + 1 Additional service) OR (2+ Additional services). CHF 0.00 (FREE) applies if the client books (1 Main + 2+ Additional services) OR (2+ Main services)."
    },
    {
      title: "6. Cancellations & Rescheduling",
      content: "Under Swiss law, cancellations represent a breach of contract if not made timely. Cancellations made less than 48 hours before the start time incur a 50% service fee. No-shows or cancellations at the door are charged at 100% of the quote plus the standard CHF 45.00 travel fee."
    },
    {
      title: "7. Liability & Insurance",
      content: "Kraken maintains public liability insurance (Betriebshaftpflichtversicherung) covering up to CHF 10 million. We are not liable for pre-existing damage, undisclosed delicate materials, or client-provided materials (Art. 398 OR). Liability for lost keys is limited to the cost of a standard replacement; replacement of entire locking systems is excluded. Items of extraordinary value must be disclosed beforehand for specific coverage."
    },
    {
      title: "8. Client Responsibilities & Waiting Time",
      content: "Clients must provide access, electricity, and running water. Failure to provide access (Mora Creditoris) results in a full charge of the quote. Delays in access beyond 15 minutes are billed at CHF 90.00/hour in 15-minute increments. Costs for public or private parking incurred during service will be added to the final invoice at cost."
    },
    {
      title: "9. Specialized Partners & Right of Refusal",
      content: "Kraken may engage certified third-party specialists (e.g., licensed electricians or plumbers) to ensure technical standards. Kraken remains the primary contractor. We reserve the right to refuse service if on-site conditions pose a health or safety risk (e.g., biohazards or structural instability)."
    },
    {
      title: "10. Data Protection & Privacy",
      content: "We process personal data according to the Swiss Federal Act on Data Protection (FADP) and GDPR. Data is used solely for service execution, billing, and quality control."
    },
    {
      title: "11. Governing Law & Jurisdiction",
      content: "All contracts are subject to Swiss Law. The exclusive place of jurisdiction for all disputes is Schaffhausen, Switzerland."
    }
  ];

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Header Section */}
      <section className="bg-white pt-48 pb-20 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
            <h1 className="text-4xl lg:text-6xl font-black text-[#002D5B] mb-6 uppercase tracking-tight">
                {t('nav.terms')}
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-3xl mx-auto">
                {t('terms.description')}
            </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-6">
                {sections.map((section, idx) => (
                    <div 
                        key={idx} 
                        className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                    >
                        <h2 className="text-xl font-black text-[#002D5B] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 bg-blue-50 text-[#007bff] rounded-lg flex items-center justify-center text-sm font-black group-hover:bg-[#007bff] group-hover:text-white transition-colors">
                                {idx + 1}
                            </span>
                            {section.title}
                        </h2>
                        <div className="text-gray-600 leading-relaxed text-sm md:text-base pl-11">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-10 bg-[#002D5B] rounded-[3rem] text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <p className="text-xs text-blue-200 font-black uppercase tracking-[0.2em] mb-4">Verification & Compliance</p>
                    <p className="text-sm font-medium opacity-80 mb-2">Last Updated: January 26, 2025</p>
                    <p className="text-xs opacity-60">Kraken Properties and Facilities Management Inc. | Seewaldestrasse 3, 8203 Schaffhausen, Switzerland</p>
                </div>
            </div>

            {/* Back button using onNavigate */}
            <div className="mt-12 text-center">
                <button 
                  onClick={() => onNavigate('home')}
                  className="bg-[#002D5B] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#00254A] transition-all shadow-xl"
                >
                  Back to Home
                </button>
            </div>
        </div>
      </section>
    </main>
  );
};

export default TermsPage;