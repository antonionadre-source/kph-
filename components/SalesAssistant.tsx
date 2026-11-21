import React, { useEffect, useRef, useState } from 'react';
import { X, Send, MessageCircle, LoaderCircle, Phone } from 'lucide-react';
import { useTranslation } from '../i18n';
import { salesCopy } from '../src/content/salesCopy';
import { assistantText, chatHistory } from '../src/chatProtocol';
import { useKaiMoment } from './useKaiMoment';

interface Props { currentPage: string; cart?: any[]; onNavigate: (page: string) => void; seoCityId?: string; }
interface Message { role: 'user' | 'model'; text: string; }
export default function SalesAssistant({ currentPage, onNavigate }: Props) {
  const { language } = useTranslation(), copy = salesCopy(language), media = useKaiMoment();
  const [open, setOpen] = useState(false), [messages, setMessages] = useState<Message[]>([]), [input, setInput] = useState('');
  const [sending, setSending] = useState(false), [error, setError] = useState(false), [failedText, setFailedText] = useState('');
  const launcher = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null), field = useRef<HTMLInputElement>(null), end = useRef<HTMLDivElement>(null), controller = useRef<AbortController | null>(null);
  const wasOpen = useRef(false);
  const hidden = ['dashboard','login','register','consultation','commercial-quote','review-invite','kontakt','careers'].includes(currentPage);
  useEffect(() => { setOpen(false); controller.current?.abort(); }, [currentPage]);
  useEffect(() => {
    if (wasOpen.current && !open) launcher.current?.focus();
    wasOpen.current = open;
  }, [open]);
  useEffect(() => { if (open) end.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' }); }, [messages, sending, open]);
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow; document.body.style.overflow = 'hidden'; field.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); launcher.current?.focus(); }
      if (event.key === 'Tab') {
        const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled)') || []) as HTMLElement[], first = items[0], last = items[items.length-1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = before; document.removeEventListener('keydown', key); };
  }, [open]);
  useEffect(() => () => controller.current?.abort(), []);
  async function send(text: string, retry = false) {
    const clean = text.trim(); if (!clean || sending) return;
    const history: Message[] = retry ? messages : [...messages, { role: 'user', text: clean }];
    setMessages(history); setInput(''); setSending(true); setError(false); setFailedText(clean);
    controller.current = new AbortController(); const timeout = setTimeout(() => controller.current?.abort(), 20000);
    try {
      const api = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(api + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language, messages: chatHistory(history) }), signal: controller.current.signal });
      if (!response.ok) throw new Error('Assistant temporarily unavailable.');
      const payload = await response.json(); const reply = assistantText(payload.text);
      setMessages([...history, { role: 'model', text: reply }]); setFailedText('');
    } catch { setError(true); }
    finally { clearTimeout(timeout); setSending(false); }
  }
  const navigate = (page: string) => { setOpen(false); onNavigate(page); };
  const avatar = <img src={media.avatar} key={media.id} width="48" height="48" alt="Kai" className="w-12 h-12 rounded-full object-cover bg-[#eaf3ff]" loading="lazy" onError={e=>{const image=e.currentTarget;if(!image.dataset.fallback){image.dataset.fallback='true';image.src='/mascota-kraken-homepage-200.webp';}}} />;
  if (hidden) return null;
  return <>
    {!open && <button ref={launcher} type="button" onClick={()=>setOpen(true)} aria-label={copy.chatOpen} aria-haspopup="dialog" aria-expanded={false} className="kraken-chat-launcher fixed right-4 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:bottom-6 md:right-6 z-50 flex items-center gap-3 rounded-full bg-white border border-slate-200 p-2 shadow-[0_5px_25px_rgba(3,43,89,0.18)] text-[#032b59] focus-visible:outline-3 focus-visible:outline-[#1464ad]">
      {avatar}<span className="hidden sm:block pr-3 text-sm font-semibold">{copy.chatOpen}</span><span className="sm:hidden sr-only">{copy.chatOpen}</span>
    </button>}
    {open && <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="kai-chat-title" className="kraken-chat-panel fixed z-[90] inset-x-3 top-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] md:inset-x-auto md:left-auto md:right-6 md:top-auto md:bottom-6 md:w-[410px] md:h-[min(680px,85dvh)] rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden">
      <div className="flex gap-3 items-center px-4 py-3 border-b border-slate-200 bg-[#f0f5fc] shrink-0">{avatar}<div className="min-w-0 flex-1"><h2 id="kai-chat-title" className="text-base font-semibold text-[#032b59]">{copy.chatTitle}</h2><p className="text-sm text-slate-600">{copy.chatIntro}</p></div><button type="button" aria-label={copy.close} onClick={()=>{setOpen(false);launcher.current?.focus();}} className="min-w-11 min-h-11 flex items-center justify-center rounded-xl hover:bg-white text-[#032b59]"><X size={21} /></button></div>
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-[#f3f7fc]" role="log" aria-live="polite" aria-relevant="additions text">
        <div className="bg-white rounded-2xl rounded-tl-sm border border-slate-200 p-3.5 text-base text-slate-700 leading-relaxed">{copy.greeting}</div>
        {!messages.length && <div className="grid gap-2">{copy.chatSuggestions.map(text=><button key={text} disabled={sending} onClick={()=>void send(text)} className="text-left rounded-xl px-3 py-2.5 border border-[#1464ad]/25 bg-white text-sm font-medium text-[#1464ad] hover:bg-[#eaf3ff]">{text}</button>)}</div>}
        {messages.map((message,index)=><div key={index} className={`max-w-[94%] rounded-2xl p-3.5 text-base leading-relaxed whitespace-pre-wrap break-words ${message.role==='user'?'ml-auto bg-[#1464ad] text-white rounded-br-sm':'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}>{message.text.split(/(\*\*[^*]+\*\*)/g).map((part,i)=>part.startsWith('**')&&part.endsWith('**')?<strong key={i}>{part.slice(2,-2)}</strong>:<React.Fragment key={i}>{part}</React.Fragment>)}</div>)}
        {sending && <p role="status" className="text-sm text-slate-500 flex items-center gap-2"><LoaderCircle className="animate-spin" size={17} />Kai…</p>}
        {error && <div role="alert" className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-sm text-slate-700"><p>{copy.chatError}</p><button className="min-h-11 underline font-semibold text-[#1464ad]" disabled={sending} onClick={()=>void send(failedText,true)}>{copy.retry}</button></div>}
        <div ref={end} />
      </div>
      <div className="px-4 pt-3 pb-2 border-t border-slate-200 shrink-0 flex flex-wrap gap-x-4 gap-y-1"><button onClick={()=>navigate('/quote')} className="text-sm font-semibold text-[#1464ad] min-h-10">{copy.quote}</button><a href="tel:+41774505705" className="inline-flex items-center gap-1.5 text-sm text-[#032b59] min-h-10"><Phone size={15} />{copy.talk}</a></div>
      <form className="p-3 pt-1 shrink-0" onSubmit={event=>{event.preventDefault();void send(input);}}><div className="flex gap-2"><label className="flex-1 min-w-0"><span className="sr-only">{copy.chatPlaceholder}</span><input ref={field} value={input} onChange={e=>setInput(e.target.value)} maxLength={2000} placeholder={copy.chatPlaceholder} autoComplete="off" enterKeyHint="send" className="w-full h-12 px-3 rounded-xl border border-slate-300 text-base text-slate-800 bg-white" /></label><button type="submit" disabled={sending || !input.trim()} aria-label={copy.send} className="min-w-12 min-h-12 inline-flex items-center justify-center rounded-xl bg-[#1464ad] text-white disabled:opacity-50"><Send size={20} /></button></div><p className="text-xs text-slate-500 mt-2 leading-relaxed">{copy.chatPrivacy}</p></form>
    </div>}
  </>;
}
