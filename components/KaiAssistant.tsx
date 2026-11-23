import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../i18n';
import { normalizeHomeLanguage } from './home/homeTranslations';
import { openHomeCalculator } from '../src/home/calculator';
import { bindVisualViewport } from '../src/viewport.js';
import { KAI_FIELDS, KAI_SERVICES, KAI_SERVICE_FIELDS, emptyKaiDraft, type KaiDraft, type KaiField, type KaiMessage, type KaiService, type KaiAssistantResponse } from '../src/kai/types';
import { kaiText, kaiFieldLabel, kaiServiceLabel, type KaiTextKey } from '../src/kai/copy';
import { getKaiTransferPreview, prepareKaiTransfer } from '../src/kai/draft';
import { subscribeKaiOpen } from '../src/kai/open';
import './KaiAssistant.css';

const SESSION_KEY = 'kraken_kai_request_v1';
const MAX_MESSAGE = 1200;

function cleanDraft(value: unknown, language: KaiDraft['language']): KaiDraft {
  const draft = emptyKaiDraft(language);
  if (!value || typeof value !== 'object') return draft;
  const source = value as Partial<KaiDraft>;
  if (KAI_SERVICES.includes(source.service as KaiService)) draft.service = source.service!;
  draft.services = Array.isArray(source.services) ? [...new Set(source.services.filter(item => KAI_SERVICES.includes(item)))].slice(0, 5) : [];
  if (draft.service && !draft.services.includes(draft.service)) draft.services.unshift(draft.service);
  if (source.fields && typeof source.fields === 'object') for (const key of KAI_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(source.fields, key) && typeof source.fields[key] === 'string') draft.fields[key] = source.fields[key]!.slice(0, 1200);
  }
  draft.deferred = Array.isArray(source.deferred) ? source.deferred.filter(field => KAI_FIELDS.includes(field)) : [];
  return draft;
}

export default function KaiAssistant({ currentPage, onNavigate }: { currentPage: string; onNavigate: (path: string) => void }) {
  const { language } = useTranslation();
  const locale = normalizeHomeLanguage(language);
  const kt = (key: KaiTextKey, params?: Record<string, string | number>) => kaiText(locale, key, params);
  const [draft, setDraft] = useState<KaiDraft>(() => {
    try { return cleanDraft(JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')?.draft, locale); }
    catch { return emptyKaiDraft(locale); }
  });
  const [messages, setMessages] = useState<KaiMessage[]>(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')?.messages;
      if (Array.isArray(saved)) return saved.filter(message => message && ['user', 'assistant'].includes(message.role) && typeof message.text === 'string').slice(-30).map(message => ({ role: message.role, text: message.text.slice(0, 2400) }));
    } catch { /* A fresh request leaves all previous calculator data untouched. */ }
    return [];
  });
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'summary'>('chat');
  const [reviewKnown, setReviewKnown] = useState<KaiField[]>([]);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mode, setMode] = useState<'ai' | 'guided'>('guided');
  const [policy, setPolicy] = useState<'preserve' | 'replace'>('preserve');
  const [resetting, setResetting] = useState(false);
  const [showLauncher, setShowLauncher] = useState(currentPage !== 'home');
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const thread = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const request = useRef<AbortController | null>(null);
  const lastMessage = useRef('');
  const localeRef = useRef(locale);
  localeRef.current = locale;

  useEffect(() => {
    setDraft(previous => ({ ...previous, language: locale }));
    const active = request.current;
    request.current = null;
    active?.abort();
    if (active) { setInput(previous => previous || lastMessage.current); setError(true); }
    setBusy(false);
    setSuggestions([]);
  }, [locale]);
  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ version: 1, draft, messages: messages.slice(-30) })); }
    catch { /* The mounted assistant still retains the request in memory. */ }
  }, [draft, messages]);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    const visible = () => setShowLauncher(currentPage !== 'home' || window.scrollY > 300);
    visible();
    window.addEventListener('scroll', visible, { passive: true });
    return () => window.removeEventListener('scroll', visible);
  }, [currentPage]);
  useEffect(() => {
    const receive = (detail: { service?: KaiService | null; opener?: HTMLElement | null }) => {
      if (detail?.service && KAI_SERVICES.includes(detail.service)) setDraft(previous => previous.service ? previous : { ...previous, service: detail.service!, services: [detail.service!] });
      opener.current = detail?.opener || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      setOpen(true);
    };
    return subscribeKaiOpen(receive);
  }, []);
  useEffect(() => {
    const panel = dialog.current;
    if (!panel) return;
    if (open) {
      if (!panel.open) panel.showModal();
      document.body.classList.add('kai-assistant-open');
      title.current?.focus({ preventScroll: true });
      return bindVisualViewport(panel);
    }
    if (panel.open) panel.close();
    document.body.classList.remove('kai-assistant-open');
  }, [open]);
  useEffect(() => () => document.body.classList.remove('kai-assistant-open'), []);
  useEffect(() => {
    if (open && view === 'chat' && nearBottom.current && thread.current) {
      thread.current.scrollTo({ top: thread.current.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }, [open, view, messages, busy]);

  function close() {
    dialog.current?.close();
    setOpen(false);
    const target = opener.current?.isConnected ? opener.current : launcher.current;
    requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  }
  function keepTabInPanel(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const panel = event.currentTarget;
    const controls = [...panel.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, summary, [tabindex]')]
      .filter(element => element.tabIndex >= 0 && !element.matches(':disabled, [aria-disabled="true"]')
        && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && (document.activeElement === first || document.activeElement === title.current)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
  function selectService(service: KaiService) {
    setDraft(previous => ({ ...previous, service, services: previous.services.length > 1 && previous.services.includes(service) ? previous.services : [service] }));
  }
  async function send(text = input, retry = false) {
    const message = text.trim();
    if (!message || message.length > MAX_MESSAGE || busy) return;
    const retryIndex = retry ? messages.map(item => item.role === 'user' && item.text === message).lastIndexOf(true) : -1;
    const duplicateRetry = retry || (error && messages.at(-1)?.role === 'user' && messages.at(-1)?.text === message);
    const prior = retryIndex >= 0 ? messages.slice(0, retryIndex) : duplicateRetry ? messages.slice(0, -1) : messages;
    const history = prior.slice(-20).map(item => ({ ...item, text: item.text.slice(0, 1800) }));
    while (history.reduce((sum, item) => sum + item.text.length, 0) > 14000) history.shift();
    if (!duplicateRetry) setMessages(previous => [...previous, { role: 'user', text: message }]);
    lastMessage.current = message;
    setInput('');
    setError(false);
    setBusy(true);
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 14000);
    try {
      const response = await fetch('/api/kai/assist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ message, messages: history.slice(-20), draft: { ...draft, language: locale }, language: locale }) });
      if (!response.ok) throw new Error('Assistant unavailable');
      const data = await response.json() as KaiAssistantResponse;
      if (!data || typeof data.message !== 'string' || !['ai', 'guided'].includes(data.mode) || !data.draft || !Array.isArray(data.suggestions)) throw new Error('Invalid assistant response');
      if (request.current !== controller) return;
      setDraft(cleanDraft(data.draft, localeRef.current));
      setMessages(previous => [...previous, { role: 'assistant', text: data.message.slice(0, 2400) }]);
      setSuggestions(data.suggestions.filter(item => typeof item === 'string').slice(0, 4));
      setMode(data.mode);
      setError(Boolean(data.error));
    } catch {
      if (request.current === controller) {
        setError(true);
        setInput(previous => previous || message);
      }
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) { request.current = null; setBusy(false); }
    }
  }
  function continueToCalculator() {
    if (!draft.service) return;
    prepareKaiTransfer({ ...draft, language: locale }, policy);
    close();
    openHomeCalculator(draft.service, onNavigate);
  }
  const transfer = view === 'summary' ? getKaiTransferPreview(draft) : { conflicts: [], malformed: false };
  const fields = draft.service ? KAI_SERVICE_FIELDS[draft.service] : ['city', 'postcode', 'notes'] as const;
  // Keep each editor in its original section while typing. Moving it from pending
  // to known after the first character would remount the input and lose focus.
  useEffect(() => {
    if (!open || view !== 'summary') return;
    const indicated = fields.filter(field => draft.fields[field]?.trim());
    setReviewKnown([...indicated]);
    setPendingOpen(indicated.length === 0);
  }, [open, view, draft.service]);
  const known = fields.filter(field => reviewKnown.includes(field));
  const pending = fields.filter(field => !reviewKnown.includes(field));
  const missingCount = fields.filter(field => !draft.fields[field]?.trim()).length;
  const editField = (field: KaiField, value: string) => setDraft(previous => ({ ...previous, fields: { ...previous.fields, [field]: value }, deferred: previous.deferred.filter(item => item !== field) }));
  const renderField = (field: KaiField) => <label className="kai-summary-field" key={field}>
    <span>{kaiFieldLabel(locale, field)}</span>
    {['inventory', 'priorities', 'notes'].includes(field)
      ? <textarea rows={2} disabled={busy} maxLength={1200} value={draft.fields[field] || ''} placeholder={kt('unknown')} onChange={event => editField(field, event.target.value)} />
      : <input type="text" disabled={busy} inputMode={['postcode', 'rooms', 'bedrooms', 'bathrooms', 'windowsCount'].includes(field) ? 'decimal' : 'text'} maxLength={300} value={draft.fields[field] || ''} placeholder={kt('unknown')} onChange={event => editField(field, event.target.value)} />}
  </label>;

  return <>
    <button className="kai-assistant-launcher" ref={launcher} hidden={!showLauncher || open} aria-label={kt('open')} aria-haspopup="dialog" aria-controls="kai-assistant" type="button"
      onClick={event => { opener.current = event.currentTarget; setOpen(true); }}>
      <img src="/home-approved/assets/kai.webp" alt="" width="48" height="48" /><span>{kt('open')}</span>
    </button>
    <dialog ref={dialog} id="kai-assistant" className="kai-assistant" lang={locale} aria-labelledby="kai-assistant-title" onKeyDown={keepTabInPanel} onCancel={event => { event.preventDefault(); close(); }} onClose={() => setOpen(false)}>
      <header className="kai-assistant-header">
        <img src="/home-approved/assets/kai.webp" alt="" width="40" height="40" />
        <div><h2 id="kai-assistant-title" ref={title} tabIndex={-1}>{kt('title')}</h2><p>{kt(mode === 'ai' ? 'aiLabel' : 'guidedLabel')}</p></div>
        <button type="button" className="kai-icon-button" onClick={close} aria-label={kt('minimize')} title={kt('minimize')}>−</button>
        <button type="button" className="kai-icon-button" onClick={close} aria-label={kt('close')} title={kt('close')}>×</button>
      </header>
      <div className="kai-view-switch" role="group" aria-label={kt('summary')}><button type="button" aria-pressed={view === 'chat'} onClick={() => setView('chat')}>{kt('chat')}</button><button type="button" aria-pressed={view === 'summary'} onClick={() => setView('summary')}>{kt('review')}</button></div>
      {view === 'chat' ? <>
        {mode === 'guided' && <p className="kai-guided-notice">{kt('guidedNotice')}</p>}
        <div className="kai-quick-services" role="group" aria-label={kt('service')}>
          {KAI_SERVICES.map(service => <button key={service} type="button" disabled={busy} aria-pressed={draft.service === service} onClick={() => selectService(service)}>{kaiServiceLabel(locale, service)}</button>)}
        </div>
        <div className="kai-thread" ref={thread} role="log" aria-live="polite" aria-relevant="additions" aria-label={kt('chat')} tabIndex={0}
          onScroll={event => { const element = event.currentTarget; nearBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80; }}>
          <div className="kai-message kai-message-assistant"><p>{kt('welcome')}</p><p>{kt('helper')}</p></div>
          {messages.map((message, index) => <div className={`kai-message kai-message-${message.role}`} key={index}><span className="kai-message-author">{message.role === 'assistant' ? 'Kai' : '●'}</span><p>{message.text}</p></div>)}
          {busy && <p className="kai-working" role="status">{kt('busy')}</p>}
        {error && <div className="kai-error" role="alert"><p>{kt('error')}</p><button type="button" disabled={busy} onClick={() => send(lastMessage.current, true)}>{kt('retry')}</button></div>}
        </div>
        {suggestions.length > 0 && <div className="kai-suggestions">{suggestions.map(suggestion => <button key={suggestion} type="button" disabled={busy} onClick={() => send(suggestion)}>{suggestion}</button>)}</div>}

        <form className="kai-composer" onSubmit={event => { event.preventDefault(); send(); }}>
          <label className="kai-visually-hidden" htmlFor="kai-message-input">{kt('placeholder')}</label>
          <textarea id="kai-message-input" rows={2} maxLength={MAX_MESSAGE} value={input} onChange={event => setInput(event.target.value)} placeholder={kt('placeholder')} disabled={busy} />
          <button type="submit" className="kai-send" disabled={busy || !input.trim()} aria-label={kt('send')} title={kt('send')}><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 19 9-19 9 4-9-4-9Zm4 9h15" /></svg></button>
        </form>
      </> : <div className="kai-summary-scroll">
        <button type="button" className="kai-link" onClick={() => setView('chat')}>{kt('back')}</button>
        <h3>{kt('summary')}</h3><p>{kt('summaryHint')}</p>
        <label className="kai-summary-field"><span>{kt('service')}</span><select disabled={busy} value={draft.service || ''} onChange={event => { if (event.target.value) selectService(event.target.value as KaiService); }}><option value="">{kt('noService')}</option>{KAI_SERVICES.map(service => <option key={service} value={service}>{kaiServiceLabel(locale, service)}</option>)}</select></label>
        {draft.services.length > 1 && <p className="kai-information">{kt('multiService')}<br />{draft.services.map(service => kaiServiceLabel(locale, service)).join(' · ')}</p>}
        <h4>{kt('known')}</h4>{known.length ? known.map(renderField) : <p>{kt('unknown')}</p>}
        {pending.length > 0 && <details className="kai-pending" open={pendingOpen} onToggle={event => setPendingOpen(event.currentTarget.open)}><summary>{kt('pending')} ({missingCount})</summary>{pending.map(renderField)}</details>}
        {transfer.malformed && <p className="kai-information">{kt('malformed')}</p>}
        {transfer.conflicts.length > 0 && <fieldset className="kai-conflicts"><legend>{kt('conflict')}</legend><label><input type="radio" name="kai-merge" value="preserve" checked={policy === 'preserve'} onChange={() => setPolicy('preserve')} />{kt('preserve')}</label><label><input type="radio" name="kai-merge" value="replace" checked={policy === 'replace'} onChange={() => setPolicy('replace')} />{kt('replace')}</label></fieldset>}
        <p className="kai-summary-privacy">{kt('privacy')}</p>
        {resetting ? <div className="kai-information"><p>{kt('resetConfirm')}</p><button type="button" className="kai-link" disabled={busy} onClick={() => { setDraft(emptyKaiDraft(locale)); setMessages([]); setSuggestions([]); setInput(''); setError(false); setMode('guided'); setResetting(false); setView('chat'); }}>{kt('reset')}</button><button type="button" className="kai-link" onClick={() => setResetting(false)}>{kt('cancel')}</button></div>
          : <button type="button" className="kai-link" disabled={busy} onClick={() => setResetting(true)}>{kt('reset')}</button>}
      </div>}
      <footer className="kai-assistant-actions">
        <button type="button" className="kai-primary" disabled={busy || (view === 'summary' && !draft.service)} onClick={() => view === 'chat' ? setView('summary') : continueToCalculator()}>{kt(view === 'chat' ? 'review' : 'continue')}</button>
        <div><button type="button" className="kai-link" onClick={() => { close(); openHomeCalculator(null, onNavigate); }}>{kt('direct')}</button><a href="mailto:kai@krakenpfm.ch">{kt('contact')}</a></div>
      </footer>
    </dialog>
  </>;
}
