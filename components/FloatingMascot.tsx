
import React, { useState, useEffect, useRef } from 'react';
import { mascotImageUrl, mascotVideoUrl } from '../assets';
import { useTranslation } from '../i18n';
import { GoogleGenAI } from "@google/genai";
import { XMarkIcon, PaperAirplaneIcon, WhatsAppIcon, PlusIcon, ShieldCheckIcon } from './icons';
import emailjs from '@emailjs/browser';

interface FloatingMascotProps {
  currentPage: string;
  cart?: any[];
  onNavigate?: (page: string) => void;
}

const STORAGE_KEY = 'kraken_kai_ultimate_agent_v2';
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/dkmya8ae31ib7gwy6xi2f4f8icaxbezo';
const EMAIL_SERVICE_ID = 'service_aiv15bc';
const EMAIL_TEMPLATE_ID = 'template_aktj7t9';
const EMAIL_PUBLIC_KEY = 'sH5K84ChHyssJrarm';

const getSystemInstruction = (currentPage: string) => `You are Kai, the professional property consultant for Kraken Properties & Facilities Management. 

**MISSION:** Guide the client through a 2-stage service selection to build a custom bundle.

**CONVERSATION RULES:**
1. **STRICT: ONE QUESTION PER MESSAGE.** Wait for answer.
2. **BE CONCISE:** Short, professional, Swiss-precision tone.
3. **BOLD PRICES:** Always bold prices like **CHF 520**.

**THE 2-STAGE FLOW (FOLLOW STRICTLY):**

**STAGE 1: MAIN SERVICES**
Ask: "Which of our **Main Services** do you need?"
[OPTIONS: End of Tenancy, Deep Cleaning, Daily Cleaning, Moving Service]

**STAGE 2: ADDITIONAL SERVICES (CROSS-SELL)**
Once a Main Service is picked, acknowledge it and ask: "Would you like to add an **Additional Service** to your bundle? (Bundling reduces travel fees!)"
[OPTIONS: Car Detailing, Gardening, Exterior Cleaning, Pest Control, Waste Management, Gutter Cleaning, No - Finalize these]

**STAGE 3: CONFIGURATION**
Ask details for the chosen services one by one:
- "How many rooms?" [OPTIONS: 1.5 Rooms, 2.5 Rooms, 3.5 Rooms, 4.5+ Rooms]
- "Do you need windows cleaned?" [OPTIONS: Yes, No]

**STAGE 4: CONTACT & TERMS**
Collect ONE BY ONE: Name -> Email -> Phone -> Address -> Date/Time.
Finally, present the summary with the **Estimated Total** and ask for Terms acceptance.

**FORMATTING:**
- **NO SYMBOLS:** No #, -, or * for lists.
- **BUTTONS:** End messages with [OPTIONS: Option 1, Option 2].

**SUBMISSION TRIGGER:**
When the user clicks "I accept the Terms", output this JSON hidden:
\`\`\`json
{ 
  "trigger": "SUBMIT_BOOKING",
  "data": {
    "name": "Client Name",
    "email": "client@email.com",
    "phone": "Phone",
    "address": "Address",
    "services": "Bundle list",
    "total_price": "CHF XXX"
  }
}
\`\`\``;

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    options?: string[];
}

const FloatingMascot: React.FC<FloatingMascotProps> = ({ currentPage, cart, onNavigate }) => {
  const { t } = useTranslation();
  const [showBubble, setShowBubble] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReminder, setIsReminder] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        {
          role: 'model', 
          text: "Hi! I'm **Kai**. I'll help you build your property service bundle. Which of our **Main Services** do you need today?", 
          options: ["End of Tenancy", "Deep Cleaning", "Daily Cleaning", "Moving Service"]
        }
      ];
    } catch (e) {
      return [{role: 'model', text: "Hi! I'm Kai. Which main service do you need?", options: ["Deep Cleaning", "End of Tenancy"]}];
    }
  });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setIsIntroFinished(true), 7000); 
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Hero is roughly 80vh-90vh. Let's show mascot after 400px of scroll on home page.
      if (currentPage === 'home') {
        setIsScrolledPastHero(window.scrollY > 400);
      } else {
        setIsScrolledPastHero(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  useEffect(() => {
    if (isChatOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, isChatOpen]);

  const parseResponse = (text: string) => {
    const singleMatch = text.match(/\[OPTIONS:\s*(.*?)\]/i);
    let options: string[] | undefined;
    let cleanText = text;
    if (singleMatch) {
        options = singleMatch[1].split(',').map(o => o.trim());
        cleanText = cleanText.replace(/\[OPTIONS:.*?\]/i, '').trim();
    }
    cleanText = cleanText.replace(/[#\->]/g, '').trim();
    return { cleanText, options };
  };

  const handleExternalSubmission = async (data: any) => {
    const historyText = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n\n');
    
    try {
        const webhookPromise = fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                source: 'KAI_AI_CONSULTANT',
                ...data,
                transcript: historyText,
                timestamp: new Date().toISOString()
            })
        });

        const emailPromise = emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, {
            from_name: data.name || 'Kai AI Client',
            from_email: data.email || 'no-reply@krakenpfm.ch',
            message: `AI CHAT RESERVATION REQUEST\n\nFull History:\n${historyText}`,
            services_interest: data.services || 'AI Bundle',
            total_price: data.total_price || 'N/A'
        }, EMAIL_PUBLIC_KEY);

        await Promise.all([webhookPromise, emailPromise]);
        
        setMessages(prev => [...prev, { 
            role: 'model', 
            text: "✅ **Transmitted!** Our operations team in Schaffhausen will contact you shortly to finalize. Talk soon!" 
        }]);
    } catch (e) {
        console.error("Submission error", e);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userText = text;
    setInputValue("");
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    if (userText.toLowerCase() === 'start over') {
        clearChat();
        setIsLoading(false);
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: { systemInstruction: getSystemInstruction(currentPage) },
            history: history
        });
        
        const response = await chat.sendMessage({ message: userText });
        if (response.text) {
            const { cleanText, options } = parseResponse(response.text);
            
            const jsonMatch = cleanText.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                try {
                    const submissionData = JSON.parse(jsonMatch[1]);
                    if (submissionData.trigger === "SUBMIT_BOOKING") {
                        const visibleText = cleanText.replace(/```json[\s\S]*?```/, "").trim();
                        setMessages(prev => [...prev, { role: 'model', text: visibleText, options }]);
                        await handleExternalSubmission(submissionData.data);
                    }
                } catch (e) {
                    setMessages(prev => [...prev, { role: 'model', text: cleanText, options }]);
                }
            } else {
                setMessages(prev => [...prev, { role: 'model', text: cleanText, options }]);
            }
        }
    } catch (error: any) {
        setMessages(prev => [...prev, {
            role: 'model', 
            text: "I'm having a connection glitch. Let's try that again!",
            options: ["Try Again", "Start Over"]
        }]);
    } finally { 
        setIsLoading(false); 
    }
  };

  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([
        {
          role: 'model', 
          text: "Fresh start! Which of our **Main Services** can I help you with today?", 
          options: ["End of Tenancy", "Deep Cleaning", "Daily Cleaning", "Moving Service"]
        }
    ]);
  };

  const pageMessages: { [key: string]: string[] } = {
    home: ['mascot.home.1', 'mascot.home.2', 'mascot.home.3'],
    about: ['mascot.about.1', 'mascot.about.2', 'mascot.about.3'],
    'services-page': ['mascot.services.1', 'mascot.services.2', 'mascot.services.3'],
  };

  const messageKeys = pageMessages[currentPage] || pageMessages.home;

  useEffect(() => {
    if (isChatOpen) return;
    
    // Check for unfinished quote
    const hasItems = cart && cart.length > 0;
    const notOnConsultation = currentPage !== 'consultation';
    const shouldShowReminder = hasItems && notOnConsultation;
    
    setIsReminder(shouldShowReminder);

    const showTimer = setTimeout(() => setShowBubble(true), 2000);
    const cycleInterval = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        const currentSet = pageMessages[currentPage] || pageMessages.home;
        setCurrentMessageIndex(prev => (prev + 1) % currentSet.length);
        setIsExiting(false);
      }, 500);
    }, 12000);
    return () => { clearTimeout(showTimer); clearInterval(cycleInterval); };
  }, [currentPage, isChatOpen, cart]);

  const renderMessageText = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, i) => (
        i % 2 === 1 ? <strong key={i} className="font-black text-inherit opacity-90">{part}</strong> : part
    ));
  };

  return (
    <>
      <div className={`fixed bottom-6 left-6 w-24 sm:w-28 md:w-32 h-auto z-[55] transition-all duration-700 pointer-events-none ${isChatOpen ? 'opacity-0 scale-50' : (isScrolledPastHero ? 'opacity-100 scale-100' : 'opacity-0 scale-0 translate-y-20')} ${isIntroFinished ? (isReminder ? 'animate-reminder-shake' : 'animate-idle-breath') : 'animate-swim-intro'}`}>
        <div className="relative pointer-events-auto cursor-pointer group" onClick={() => setIsChatOpen(true)}>
            <img 
              src={mascotImageUrl} 
              alt="Kai" 
              className={`w-full h-auto object-contain drop-shadow-2xl transition-transform group-hover:scale-110 ${isReminder ? 'filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}`}
            />
            {showBubble && !isChatOpen && (
               <div className={`absolute -top-32 left-0 w-52 sm:w-64 speech-bubble-container ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`}>
                <div className={`p-4 rounded-[2rem] text-center speech-bubble relative ${isReminder ? 'bg-red-500 border-2 border-red-400 shadow-[0_10px_30px_rgba(239,68,68,0.3)]' : 'bg-transparent'}`}>
                  <p className={`font-black text-[11px] sm:text-[13px] leading-tight mb-2 ${isReminder ? 'text-white' : 'text-[#002D5B]'}`}>
                      {isReminder ? t('mascot.reminder.text') : t(messageKeys[currentMessageIndex])}
                  </p>
                  <div className={`text-[9px] font-black uppercase tracking-[0.1em] inline-flex items-center gap-1.5 animate-pulse ${isReminder ? 'text-red-100' : 'text-[#007AFF]'}`}>
                      {isReminder ? t('mascot.reminder.title') : 'Live Assessment'}
                      <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isReminder ? 'bg-white' : 'bg-[#007AFF]'}`}></span>
                  </div>
                  {isReminder && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(onNavigate) onNavigate('consultation'); }}
                      className="mt-3 w-full bg-white text-red-600 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors"
                    >
                      {t('mascot.reminder.cta')}
                    </button>
                  )}
                  <div className={`absolute -bottom-1.5 left-12 w-3 h-3 rotate-45 ${isReminder ? 'bg-red-500 border-r-2 border-b-2 border-red-400' : 'bg-transparent'}`}></div>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className={`fixed bottom-6 left-6 z-[100] w-[95vw] sm:w-[450px] bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.35)] border border-gray-100/50 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-left ${isChatOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-20 pointer-events-none'}`} style={{ height: '750px', maxHeight: '92vh' }}>
        
        <div className="bg-[#002D5B] p-6 flex items-center justify-between shadow-lg shrink-0">
            <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded-2xl border border-white/20 overflow-hidden">
                    <img src={mascotImageUrl} alt="Kai" className="w-10 h-10 object-contain" />
                </div>
                <div>
                    <h3 className="text-white font-black text-xl tracking-tight leading-none mb-1">Kai</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                        <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Kraken Expert Agent</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={clearChat} title="Reset Chat" className="text-white/20 hover:text-white p-2 transition-colors"><PlusIcon className="w-5 h-5 rotate-45" /></button>
                <button onClick={() => setIsChatOpen(false)} className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"><XMarkIcon className="w-6 h-6" /></button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
                    <div className={`max-w-[92%] rounded-[1.8rem] px-5 py-4 text-[13.5px] shadow-sm leading-relaxed transition-all ${
                        msg.role === 'user' 
                        ? 'bg-[#007AFF] text-white font-bold rounded-tr-none' 
                        : 'bg-white/80 text-gray-800 border border-gray-100/50 rounded-tl-none font-medium shadow-blue-900/5 backdrop-blur-sm'
                    }`}>
                        <div className="whitespace-pre-wrap">{renderMessageText(msg.text)}</div>
                        
                        {msg.role === 'model' && msg.text.toLowerCase().includes('terms & conditions') && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={() => { if(onNavigate) onNavigate('terms'); setIsChatOpen(false); }}
                                    className="text-[#007AFF] font-black uppercase text-[10px] tracking-widest hover:underline flex items-center gap-2"
                                >
                                    <ShieldCheckIcon className="w-4 h-4" />
                                    Read Terms of Service
                                </button>
                            </div>
                        )}

                        {msg.role === 'model' && (msg.text.toLowerCase().includes('success') || msg.text.toLowerCase().includes('transmitted')) && (
                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                                <a 
                                    href="https://wa.me/41774505705" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#128C7E] transition-all transform hover:scale-[1.02]"
                                >
                                    <WhatsAppIcon className="w-4 h-4" />
                                    Contact Support
                                </a>
                            </div>
                        )}
                    </div>
                    
                    {msg.role === 'model' && msg.options && (
                        <div className="flex flex-wrap gap-2 mt-4 max-w-[95%]">
                            {msg.options.map((opt, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => handleSend(opt)}
                                    className="bg-white border-2 border-blue-50 text-[#007AFF] px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-tight hover:border-[#007AFF] hover:bg-blue-50 transition-all shadow-sm active:scale-95 animate-fade-in-up"
                                    style={{ animationDelay: `${i * 60}ms` }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <span className="text-[8px] font-black text-gray-300 uppercase mt-2 px-2 tracking-widest">
                        {msg.role === 'user' ? 'Client' : 'Assistant'}
                    </span>
                </div>
            ))}
            
            {isLoading && (
                <div className="flex items-center gap-3 p-2 animate-pulse">
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Consulting...</span>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} className="p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3">
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="Ask Kai anything..." 
                    className="flex-1 bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#007AFF] focus:bg-white transition-all placeholder:text-gray-300 shadow-inner" 
                />
                <button 
                    type="submit" 
                    disabled={!inputValue.trim() || isLoading} 
                    className="p-4 bg-[#007AFF] text-white rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-600 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center shrink-0"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </div>
            <p className="text-[8px] text-gray-400 mt-4 text-center font-black uppercase tracking-[0.3em] opacity-60 flex items-center justify-center gap-2">
                <ShieldCheckIcon className="w-3 h-3" />
                Swiss Precision AI Interface
            </p>
        </form>
      </div>

      <style>{`
        @keyframes swim-intro { 0% { transform: translate(30vw, -80vh) rotate(15deg); opacity: 0; } 100% { transform: translate(0, 0) rotate(0deg); opacity: 1; } }
        .animate-swim-intro { animation: swim-intro 6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        @keyframes idle-breath { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px) rotate(1deg); } }
        .animate-idle-breath { animation: idle-breath 5s ease-in-out infinite; }
        @keyframes reminder-shake {
          0%, 100% { transform: translateY(0) rotate(0); }
          25% { transform: translateY(-8px) rotate(-2deg); }
          50% { transform: translateY(0) rotate(2deg); }
          75% { transform: translateY(-4px) rotate(-1deg); }
        }
        .animate-reminder-shake { animation: reminder-shake 2s ease-in-out infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        @keyframes fade-out { from { opacity: 1; transform: translate(-50%, 0) scale(1); } to { opacity: 0; transform: translate(-50%, 15px); } }
        .animate-fade-out { animation: fade-out 0.4s forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </>
  );
};

export default FloatingMascot;
