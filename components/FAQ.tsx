import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do you ensure the quality of your services?",
      answer: "We use a combination of rigorous staff training, regular quality audits, and AI-driven monitoring systems to ensure every service meets the 'Kraken Standard' of excellence."
    },
    {
      question: "What areas of Switzerland do you cover?",
      answer: "We primarily operate in the Zurich, Winterthur, and Schaffhausen areas, but we are expanding our reach across the Swiss plateau to support more enterprises."
    },
    {
      question: "Do you offer customized facility management plans?",
      answer: "Absolutely. Every business has unique needs. We conduct a thorough assessment of your facilities and business goals to create a bespoke management strategy."
    },
    {
      question: "How does your AI monitoring system work?",
      answer: "Our AI systems integrate with your existing infrastructure through IoT sensors and visual cameras, analyzing data in real-time to predict maintenance needs and optimize resource use."
    },
    {
      question: "What is your commitment to sustainability?",
      answer: "Sustainability is at our core. We are B Corp certified and use eco-friendly products and energy-efficient practices in all our operations to minimize environmental impact."
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-6 block">Common Questions</span>
            <h2 className="text-5xl md:text-7xl font-black text-[#002d5b] leading-[0.9] tracking-tighter mb-8">
              Frequently Asked <br />
              <span className="text-blue-600/80">Questions.</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border border-slate-100 rounded-3xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                  className="w-full p-8 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-xl font-bold text-[#002d5b] tracking-tight">{faq.question}</span>
                  {activeIndex === idx ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-blue-600" />}
                </button>
                <AnimatePresence>
                  {activeIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-8 text-slate-600 text-lg font-medium leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
