import React from 'react';
import { WhatsAppIcon } from './icons';

export default function FloatingWhatsApp() {
  const whatsappUrl = "https://wa.me/41774505705?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Offerte";

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-24 sm:left-6 z-[50] group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Chat"
        className="relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl hover:bg-[#20bd5a] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/30"
      >
        {/* Pulsing Outer Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none opacity-75"></span>

        {/* WhatsApp SVG Icon */}
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 fill-white relative z-10" />

        {/* Tooltip on Desktop Hover */}
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-white/10 hidden sm:block">
          WhatsApp: Hallo, ich interessiere mich für eine Offerte
        </span>
      </a>
    </div>
  );
}
