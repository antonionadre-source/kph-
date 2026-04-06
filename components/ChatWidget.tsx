
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { XMarkIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon, PaperClipIcon, TrashIcon } from './icons';
import { mascotImageUrl, mascotVideoUrl } from '../assets';
import emailjs from '@emailjs/browser';
import JSZip from 'jszip';

// EmailJS Configuration
const SERVICE_ID = 'service_aiv15bc';
const TEMPLATE_ID = 'template_aktj7t9';
const PUBLIC_KEY = 'sH5K84ChHyssJrarm';
const STORAGE_KEY = 'kraken_chat_history_v2';

const SYSTEM_INSTRUCTION = `You are Kai, the professional and friendly AI agent for Kraken Properties.

**YOUR PERSONALITY:**
*   Professional yet approachable.
*   Helpful, efficient, and proactive.
*   You speak like a high-end concierge for property services.

**YOUR GOAL:** Provide accurate estimates, suggest relevant additional services, and facilitate bookings.

**FORMATTING RULES:**
*   **Be Concise:** Keep responses short and scannable.
*   **Clean Layout:** Use only **Bold** for emphasis and bullet points (-) for lists.
*   **No Clutter:** Do NOT use markdown headers (###), excessive emojis, or strange symbols.

**PRICING KNOWLEDGE:**
*   **End of Tenancy Cleaning (100% Guarantee):**
    *   Rate: **56.50 CHF/hour**.
    *   Est. Duration: MAX(4, (Rooms * 1.5) + (Bathrooms * 1)).
    *   Extras: Balcony (+40 CHF), Storage (+30 CHF), Carpet (+60 CHF/room).
    *   Windows: Standard (+25 CHF), Large (+45 CHF).
*   **Deep Cleaning:** **56.50 CHF/hour**.
*   **Regular Maintenance:** **43.50 CHF/hour** (Min 2.5h).
*   **Moving Service:**
    *   2 Movers + Truck: **145 CHF/hour**.
    *   3 Movers + Truck: **195 CHF/hour**.
    *   Min 3 hours.

**CROSS-SELLING STRATEGY:**
*   If user wants **End of Tenancy**, suggest **Moving** or **Waste Disposal**.
*   If user wants **Moving**, suggest **Deep Cleaning** for the new home.
*   If user wants **Regular Cleaning**, suggest **Window Cleaning** or **Carpet Cleaning**.

**CONVERSATION FLOW:**
1.  **Inquire:** Ask for details (Service type? Number of rooms? Extras?) to build a quote.
2.  **Estimate & Upsell:** Give the price. Then ask: "Would you also like [Cross-Sell Service]?"
3.  **Book:** If they agree, ask for: Name, Email, Phone, Address, Date.
4.  **Confirm:** Once you have the data, output the JSON block below to trigger the email.

**BOOKING TRIGGER (JSON):**
When the user confirms booking details, output EXACTLY this JSON block at the end of your message:
\`\`\`json
{
  "action": "BOOK_RESERVATION",
  "data": {
    "service": "Service Name",
    "priceEstimate": "CHF XXX",
    "name": "Client Name",
    "email": "client@email.com",
    "phone": "123456",
    "address": "Street Address",
    "date": "YYYY-MM-DD",
    "notes": "Any extra notes"
  }
}
\`\`\`

**FILE HANDLING:**
If the user uploads images/videos, acknowledge them professionally: "I have received your files and will attach them to your request for our team to review."
`;

const QUICK_REPLIES = [
    "Estimate for End of Tenancy",
    "Moving Service Quote",
    "Regular Maintenance Pricing",
    "Deep Cleaning Info"
];

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    attachments?: { name: string; mimeType: string; data: string }[];
}

/**
 * ChatWidget Component
 * Fixed Error: Type '() => void' is not assignable to type 'FC<{}>'.
 * Re-implemented missing logic due to truncation.
 */
const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        {role: 'model', text: "Hi! I'm Kai. I can give you a quick price estimate. What service are you looking for?"}
      ];
    } catch (e) {
      return [{role: 'model', text: "Hi! I'm Kai. I can give you a quick price estimate. What service are you looking for?"}];
    }
  });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const allSessionFiles = useRef<File[]>([]);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  // --- Persistence Logic ---
  useEffect(() => {
    try {
      const safeMessages = messages.map(m => ({
          role: m.role,
          text: m.text
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeMessages));
    } catch (e) {
      console.error("Failed to save chat history", e);
    }
  }, [messages]);

  // Initialize Chat Session with @google/genai guidelines
  useEffect(() => {
    try {
        if (process.env.API_KEY) {
            // Correct initialization: always use named parameters for apiKey
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const history = messages.slice(1).map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            // Using gemini-3-flash-preview for text-based chat tasks
            chatSession.current = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                },
                history: history
            });
        }
    } catch (e) {
        console.error("Failed to init AI", e);
    }
  }, []); 

  useEffect(() => {
    if(isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
              const result = reader.result as string;
              const base64 = result.split(',')[1];
              resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
      });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const newFiles = Array.from(e.target.files) as File[];
          const validFiles = newFiles.filter(f => f.size < 5 * 1024 * 1024);
          
          if (validFiles.length < newFiles.length) {
              alert("Some files were skipped. Max size per file is 5MB.");
          }
          
          setFiles(prev => [...prev, ...validFiles]);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Fixed: Reconstructed handleBooking to handle attachments via zip and EmailJS
  const handleBooking = async (bookingData: any) => {
      try {
          // Prepare Zip
          let zipBlob: Blob | null = null;
          if (allSessionFiles.current.length > 0) {
              const zip = new JSZip();
              allSessionFiles.current.forEach(f => {
                  zip.file(f.name, f);
              });
              zipBlob = await zip.generateAsync({ type: "blob" });
          }

          if (formRef.current) {
              const form = formRef.current;
              form.reset();
              
              const setVal = (name: string, val: any) => {
                  const el = form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement;
                  if (el) el.value = val || '';
              };

              setVal('from_name', bookingData.name);
              setVal('from_email', bookingData.email);
              setVal('phone_number', bookingData.phone);
              setVal('property_address', bookingData.address);
              setVal('preferred_date', bookingData.date);
              setVal('total_price', bookingData.priceEstimate);
              setVal('services_interest', bookingData.service);
              
              const message = `CHAT BOOKING REQUEST\nService: ${bookingData.service}\nPrice Estimate: ${bookingData.priceEstimate}\nDate: ${bookingData.date}\nNotes: ${bookingData.notes || 'None'}\n\n[Attachments Included via Form: ${allSessionFiles.current.length}]`;
              setVal('message', message);

              const fileInput = form.querySelector('input[name="my_file"]') as HTMLInputElement;
              if (fileInput) {
                  if (zipBlob) {
                      const zipFile = new File([zipBlob], "attachments.zip", { type: "application/zip" });
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(zipFile);
                      fileInput.files = dataTransfer.files;
                  }
              }

              await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY);
              
              setMessages(prev => [...prev, {role: 'model', text: "✅ **Success!** Request sent successfully! We will contact you shortly."}]);
          }
      } catch (error: any) {
          console.error("Booking error details:", error);
          setMessages(prev => [...prev, {role: 'model', text: `I have your details, but there was an error sending the request. Please try the main booking form.`}]);
      }
  };

  // Fixed: handleSend now uses correct Gemini SDK calls
  const handleSend = async (text?: string) => {
    const messageText = text || inputValue;
    if ((!messageText.trim() && files.length === 0) || isLoading) return;

    setInputValue("");
    setIsLoading(true);
    
    const userMessage: ChatMessage = { role: 'user', text: messageText };
    
    // Convert files to base64 if needed for AI context (though usually sent to booking form)
    if (files.length > 0) {
      const attachments = await Promise.all(files.map(async f => ({
          name: f.name,
          mimeType: f.type,
          data: await fileToBase64(f)
      })));
      userMessage.attachments = attachments;
      allSessionFiles.current = [...allSessionFiles.current, ...files];
      setFiles([]);
    }

    setMessages(prev => [...prev, userMessage]);

    try {
        if (!chatSession.current && process.env.API_KEY) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatSession.current = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: { systemInstruction: SYSTEM_INSTRUCTION }
            });
        }

        if (chatSession.current) {
            const prompt = userMessage.attachments 
                ? `${messageText} (User attached ${userMessage.attachments.length} files)` 
                : messageText;

            // Correct SDK call: sendMessage returns result with .text property
            const response = await chatSession.current.sendMessage({ message: prompt });
            const responseText = response.text;
            
            if (responseText) {
                // Check for JSON trigger block
                const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
                if (jsonMatch) {
                    try {
                        const bookingData = JSON.parse(jsonMatch[1]);
                        if (bookingData.action === "BOOK_RESERVATION") {
                            await handleBooking(bookingData.data);
                        }
                    } catch (e) {
                        console.error("JSON parse error", e);
                    }
                }
                
                const cleanText = responseText.replace(/```json\n[\s\S]*?\n```/, "").trim();
                if (cleanText) {
                    setMessages(prev => [...prev, { role: 'model', text: cleanText }]);
                }
            }
        }
    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
        setMessages([{role: 'model', text: "Hi! I'm Kai. I can give you a quick price estimate. What service are you looking for?"}]);
        localStorage.removeItem(STORAGE_KEY);
        chatSession.current = null;
    }
  };

  // Fixed: Added return statement returning JSX
  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] bg-[#002D5B] text-white p-4 rounded-full shadow-2xl hover:bg-[#001D3A] transition-all transform hover:scale-110"
        aria-label="Toggle Chat"
      >
        {isOpen ? <XMarkIcon className="w-6 h-6" /> : <ChatBubbleLeftRightIcon className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-[60] w-[90vw] sm:w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{ height: '600px', maxHeight: '70vh' }}>
        {/* Header */}
        <div className="bg-[#002D5B] p-5 flex items-center gap-4">
            <div className="bg-white/10 p-2 rounded-xl overflow-hidden">
                <img src={mascotImageUrl} alt="Kai" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex flex-col">
                <h3 className="text-white font-bold">Kai Assistant</h3>
                <p className="text-blue-200 text-[10px] uppercase tracking-widest">Kraken Properties AI</p>
            </div>
            <button 
                onClick={clearChat}
                className="ml-auto p-2 text-white/50 hover:text-white transition-colors"
                title="Clear Chat History"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-[#007bff] text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none font-medium'
                    }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-[#007bff] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-[#007bff] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-[#007bff] rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kai is thinking</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {!isLoading && messages.length < 4 && (
            <div className="px-4 py-2 bg-white border-t border-gray-100 overflow-x-auto whitespace-nowrap no-scrollbar flex gap-2">
                {QUICK_REPLIES.map((reply, i) => (
                    <button 
                        key={i}
                        onClick={() => handleSend(reply)}
                        className="inline-block px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-[#007bff] hover:text-[#007bff] transition-all whitespace-nowrap"
                    >
                        {reply}
                    </button>
                ))}
            </div>
        )}
        {files.length > 0 && (
            <div className="px-4 py-2 bg-white border-t border-gray-100 flex flex-wrap gap-2">
                {files.map((f, i) => (
                    <div key={i} className="bg-blue-50 text-[#007bff] px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-2">
                        {f.name}
                        <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600"><XMarkIcon className="w-3 h-3"/></button>
                    </div>
                ))}
            </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="p-2 text-gray-400 hover:text-[#007bff] transition-colors"
                    title="Attach files"
                >
                    <PaperClipIcon className="w-5 h-5" />
                </button>
                <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="Ask Kai..." 
                    className="flex-1 bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#007bff] outline-none font-medium"
                />
                <button 
                    type="submit" 
                    disabled={(!inputValue.trim() && files.length === 0) || isLoading} 
                    className="p-3 bg-[#007bff] text-white rounded-xl shadow-lg hover:bg-blue-600 disabled:opacity-50 transition-all transform active:scale-95"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
      </div>

      {/* Hidden form used as helper for EmailJS form submission */}
      <form ref={formRef} className="hidden" aria-hidden="true">
          <input type="text" name="from_name" />
          <input type="email" name="from_email" />
          <input type="text" name="phone_number" />
          <input type="text" name="property_address" />
          <input type="text" name="preferred_date" />
          <input type="text" name="total_price" />
          <input type="text" name="services_interest" />
          <textarea name="message"></textarea>
          <input type="file" name="my_file" />
      </form>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </>
  );
};

export default ChatWidget;
