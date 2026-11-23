import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n';
import { homeLanguages, homeText, normalizeHomeLanguage } from './homeTranslations';

export function HomeLanguageSelector() {
  const { language, setLanguage } = useTranslation();
  const currentLanguage = normalizeHomeLanguage(language);
  const current = homeLanguages.find(item => item.code === currentLanguage)!;
  const t = (source: string, params?: Record<string, string | number>) => homeText(currentLanguage, source, params);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const focusOutside = (event: FocusEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    document.addEventListener('focusin', focusOutside);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
      document.removeEventListener('focusin', focusOutside);
    };
  }, [open]);

  return <div className="home-language" ref={root}>
    <button className="home-language-trigger" id="home-language-selector" ref={trigger} type="button"
      aria-label={`${t('Sprache auswählen')}. ${t('Aktuelle Sprache: {language}', { language: current.label })}`}
      aria-expanded={open} aria-controls="home-language-panel" onClick={() => setOpen(value => !value)}>
      <span className="home-language-globe" aria-hidden="true">🌎</span>
      <span className="home-language-code" aria-hidden="true">{currentLanguage.toUpperCase()}</span>
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
    </button>
    <div className="home-language-panel" id="home-language-panel" ref={panel} hidden={!open}>
      <p>{t('Sprache auswählen')}</p>
      <div className="home-language-options" role="group" aria-label={t('Sprache')}>
        {homeLanguages.map(item => <button key={item.code} type="button" lang={item.code}
          aria-label={t('Sprache auswählen: {language}', { language: item.label })}
          aria-pressed={item.code === currentLanguage} onClick={() => {
            setLanguage(item.code);
            setOpen(false);
            trigger.current?.focus();
          }}>
          <span className="home-language-flag" aria-hidden="true">{item.flag}</span>
          <span>{item.label}</span>
          {item.code === currentLanguage && <svg className="home-language-check" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>}
        </button>)}
      </div>
    </div>
  </div>;
}
