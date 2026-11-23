import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n';
import ApprovedHeader from '../home/ApprovedHeader';
import { openHomeCalculator, type HomeService } from '../../src/home/calculator';
import { requestKaiOpen } from '../../src/kai/open';
import { servicesText } from './servicesTranslations';
import '../home/approved-home.css';
import '../home/responsive-fixes.css';
import '../home/home-language.css';
import '../home/device-fixes.css';
import './services.css';

const serviceIds: Record<HomeService, string> = {
  windows: 'fensterreinigung', end: 'umzugsreinigung', regular: 'regelmaessige-reinigung',
  deep: 'grundreinigung', moving: 'kleine-umzuege',
};
const scenes = {
  windows: { kicker: 'Fenster putzen lassen', lines: ['Licht rein.', 'Alltag raus.'] },
  end: { kicker: 'Endreinigung zur Wohnungsabgabe', lines: ['Sauber abschliessen.', 'Neu ankommen.'] },
  regular: { kicker: 'Regelmässige Wohnungsreinigung', lines: ['Ihr Alltag.', 'Etwas leichter.'] },
  deep: { kicker: 'Grundreinigung für Ihr Zuhause', lines: ['Gründlich frisch.', 'Wieder wohlfühlen.'] },
  moving: { kicker: 'Kleinumzüge mit Ford Transit', lines: ['Wenig Hausrat.', 'Viel Vorfreude.'] },
};
const supportedService = (value: string | undefined): value is HomeService => !!value && Object.hasOwn(serviceIds, value);

/** Pure page body: the same substantive markup is used for HTTP HTML and React navigation. */
export function ServicesContent({ language, onNavigate = () => {} }: { language: string; onNavigate?: (path: string) => void }) {
  const t = (source: string) => servicesText(language, source);
  const rootRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState<HomeService>('windows');
  const [openService, setOpenService] = useState<HomeService | null>('windows');
  const framesRef = useRef(new Set<number>());
  const quoteHref = '/quote?lang=' + encodeURIComponent(language);
  const homeHref = '/?lang=' + encodeURIComponent(language);
  function scrollToService(service: HomeService) {
    const id = requestAnimationFrame(() => {
      framesRef.current.delete(id);
      rootRef.current?.querySelector<HTMLElement>('#' + serviceIds[service])?.scrollIntoView({ block: 'start' });
    });
    framesRef.current.add(id);
  }
  function toggleService(service: HomeService, open: boolean) {
    if (open) { setOpenService(service); setActiveService(service); }
    else setOpenService(current => current === service ? null : current);
  }
  function jumpToService(event: React.MouseEvent<HTMLAnchorElement>, service: HomeService) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setOpenService(service); setActiveService(service);
    // The normal anchor preserves history; this also reopens an already-current fragment.
    scrollToService(service);
  }
  function handleCommercialClick(event: React.MouseEvent<HTMLElement>) {
    if (!(event.target instanceof Element) || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const control = event.target.closest<HTMLElement>('[data-calculator], [data-open-kai]');
    if (!control || !event.currentTarget.contains(control)) return;
    const service = supportedService(control.dataset.service) ? control.dataset.service : null;
    event.preventDefault();
    if (control.hasAttribute('data-open-kai')) requestKaiOpen(service, control);
    else openHomeCalculator(service, onNavigate);
  }
  useEffect(() => {
    const openHashTarget = () => {
      const service = (Object.keys(serviceIds) as HomeService[]).find(key => '#' + serviceIds[key] === window.location.hash);
      if (!service) return false;
      setOpenService(service); setActiveService(service); scrollToService(service);
      return true;
    };
    if (!openHashTarget() && window.matchMedia('(max-width:760px)').matches) setOpenService(null);
    window.addEventListener('hashchange', openHashTarget);
    window.addEventListener('popstate', openHashTarget);
    return () => {
      window.removeEventListener('hashchange', openHashTarget);
      window.removeEventListener('popstate', openHashTarget);
      framesRef.current.forEach(cancelAnimationFrame); framesRef.current.clear();
    };
  }, []);
  return (
  <main id="main" ref={rootRef} onClick={handleCommercialClick}>
  <svg className="icon-definitions" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <symbol id="i-window" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1"></rect><path d="M12 3v18M3 12h18"></path></symbol>
    <symbol id="i-bucket" viewBox="0 0 24 24"><path d="m4 10 2 11h12l2-11H4Zm3 0V8a5 5 0 0 1 10 0v2M9 3l1 1M3 5l1 1M20 3l-1 1"></path></symbol>
    <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 11h18M8 15h1M15 15h1M8 18h1M15 18h1"></path></symbol>
    <symbol id="i-sparkles" viewBox="0 0 24 24"><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4M18 4h4M4 19v3M2.5 20.5h3"></path></symbol>
    <symbol id="i-truck" viewBox="0 0 24 24"><path d="M3 17H2V4h13v13H8M15 8h4l3 5v4h-2M15 17h1M15 13h7"></path><circle cx="6" cy="17" r="2"></circle><circle cx="18" cy="17" r="2"></circle></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></symbol>
    <symbol id="i-home" viewBox="0 0 24 24"><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8M16 4V2h3v4"></path></symbol>
    <symbol id="i-sofa" viewBox="0 0 24 24"><path d="M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M5 17h14M5 20v-3M19 20v-3M5 14V11a2 2 0 1 0-4 0v4a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-4a2 2 0 1 0-4 0v3H5Z"></path></symbol>
    <symbol id="i-coins" viewBox="0 0 24 24"><ellipse cx="9" cy="5" rx="7" ry="3"></ellipse><path d="M2 5v4c0 1.7 3.1 3 7 3 1.2 0 2.3-.1 3.3-.4M2 9v4c0 1.7 3.1 3 7 3 1.1 0 2.1-.1 3-.3M2 13v4c0 1.7 3.1 3 7 3 1.1 0 2.1-.1 3-.3M16 5v3"></path><ellipse cx="17" cy="11" rx="5" ry="2"></ellipse><path d="M12 11v8c0 1.1 2.2 2 5 2s5-.9 5-2v-8M12 15c0 1.1 2.2 2 5 2s5-.9 5-2"></path></symbol>
    <symbol id="i-team" viewBox="0 0 24 24"><circle cx="9" cy="6" r="3"></circle><path d="M2 21v-4a7 7 0 0 1 14 0v4M17 3a3 3 0 0 1 0 6M22 21v-4a7 7 0 0 0-4-6"></path></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></symbol>
    <symbol id="i-message" viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 10 10 0 0 1-4-1l-6 2 2-6a10 10 0 0 1-1-4A8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"></path><path d="M8 11h.01M12 11h.01M16 11h.01"></path></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.6h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L7 9.5a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.8 2.1Z"></path></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m2 6 10 7L22 6"></path></symbol>
    <symbol id="i-box" viewBox="0 0 24 24"><path d="m12 2 10 5v10l-10 5-10-5V7L12 2ZM2 7l10 5 10-5M12 12v10M7 4.5l10 5"></path></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"></path></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6"></path></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"></path></symbol>
    <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle></symbol>
    <symbol id="i-linkedin" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M7 10v7M7 7h.01M11 17v-7h4a3 3 0 0 1 3 3v4M11 13a3 3 0 0 1 3-3"></path></symbol>
  </defs></svg>


    <section className="services-page-hero" aria-labelledby="page-title">
      <div className="container">
        <nav className="services-breadcrumb" aria-label={t("Brotkrumennavigation")}><a href={homeHref}>{t("Startseite")}</a><span aria-hidden="true">{t("/")}</span><span aria-current="page">{t("Leistungen")}</span></nav>
        <div className="services-hero-layout">
          <div className="services-hero-copy">
            <p className="eyebrow">{t("Leistungen für Privathaushalte")}</p>
            <h1 id="page-title">{t("Reinigung und")}<br />{t("kleine Umzüge.")}<br /><span>{t("Passend zu Ihnen.")}</span></h1>
            <p className="services-hero-description">{t("Von einzelnen Fenstern bis zur Wohnung mit 1–4 Zimmern. Persönliche Unterstützung in")}{" "}<strong>{t("Zürich, Schaffhausen und Winterthur.")}</strong></p>
            <div className="services-hero-actions"><a className="button button-navy" href={quoteHref} data-calculator="">{t("Meinen Auftrag berechnen")}</a><button className="services-kai-link" type="button" data-open-kai="" aria-haspopup="dialog"><svg className="icon" aria-hidden="true"><use href="#i-message"></use></svg>{t("Mit Kai planen")}</button></div>
            <p className="services-hero-note"><svg className="icon" aria-hidden="true"><use href="#i-check"></use></svg>{t("Auch kleine Aufträge sind willkommen.")}</p>
          </div>
          <div className="services-hero-art">
            <img className="services-hero-image" src="/home-approved/assets/services-hero-v5.webp" alt={t("Reinigungsutensilien, Mikrofasertücher und Umzugskartons für die Unterstützung im Privathaushalt.")} width="1254" height="1254" fetchPriority="high" decoding="async" />
            <svg className="service-brand-overlay" viewBox="0 0 1254 1254" aria-hidden="true" focusable="false"><g transform="translate(690 580)"><svg width="300" height="130" viewBox="0 280 1024 445" overflow="hidden"><image href="/home-approved/assets/logo.webp" width="1024" height="1024"></image></svg></g><g transform="translate(675 319)"><svg width="178" height="77" viewBox="0 280 1024 445" overflow="hidden"><image href="/home-approved/assets/logo.webp" width="1024" height="1024"></image></svg></g></svg>
            <span className="services-glass-label"><svg className="icon" aria-hidden="true"><use href="#i-home"></use></svg>{t("Ihr Zuhause. In guten Armen.")}</span>
          </div>
        </div>
        <nav className="services-jump-nav" aria-label={t("Leistung entdecken")}>
          <a href="#fensterreinigung" data-service-jump="windows" onClick={event => jumpToService(event, "windows")}><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#window"></use></svg><span>{t("Fensterreinigung")}</span></a>
          <a href="#umzugsreinigung" data-service-jump="end" onClick={event => jumpToService(event, "end")}><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#end"></use></svg><span>{t("Umzugsreinigung")}</span></a>
          <a href="#regelmaessige-reinigung" data-service-jump="regular" onClick={event => jumpToService(event, "regular")}><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#regular"></use></svg><span>{t("Regelmässige Reinigung")}</span></a>
          <a href="#grundreinigung" data-service-jump="deep" onClick={event => jumpToService(event, "deep")}><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#deep"></use></svg><span>{t("Grundreinigung")}</span></a>
          <a href="#kleine-umzuege" data-service-jump="moving" onClick={event => jumpToService(event, "moving")}><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#moving"></use></svg><span>{t("Kleine Umzüge")}</span></a>
        </nav>
      </div>
    </section>

    <section className="services-section service-explorer section container" id="leistungen" aria-labelledby="services-title">
      <div className="service-intro">
        <div><p className="eyebrow">{t("Die passende Hilfe für Sie")}</p><h2 id="services-title">{t("Was dürfen wir")}<br /><span>{t("Ihnen abnehmen?")}</span></h2></div>
        <p>{t("Ob einmalig, regelmässig oder vor einem neuen Anfang: Hier erfahren Sie, was zu Ihrem Auftrag passt. Den gewünschten Umfang planen Sie anschliessend im Rechner.")}</p>
      </div>
      <div className="service-explorer-layout">
        <div className="service-scene-column">
          <div className="service-scene-stage" id="serviceSceneStage" aria-hidden="true" data-active-service={activeService}>
            <div className="service-scene-media">
            <div className="service-scene-image service-scene-windows" data-service-scene="windows" hidden={activeService !== "windows"}><img src="/home-approved/assets/service-windows-v5.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></div>
            <div className="service-scene-image service-scene-end" data-service-scene="end" hidden={activeService !== "end"}><img src="/home-approved/assets/service-end-v5.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></div>
            <div className="service-scene-image service-scene-regular" data-service-scene="regular" hidden={activeService !== "regular"}><img src="/home-approved/assets/service-regular-v5.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></div>
            <div className="service-scene-image service-scene-deep" data-service-scene="deep" hidden={activeService !== "deep"}><img src="/home-approved/assets/service-deep-v5.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></div>
            <div className="service-scene-image service-scene-moving" data-service-scene="moving" hidden={activeService !== "moving"}><img src="/home-approved/assets/service-moving-v6.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async" /><svg className="service-brand-overlay" viewBox="0 0 1254 1254" aria-hidden="true" focusable="false"><g transform="translate(780 457) skewY(3.8) scale(1 0.92)"><svg width="220" height="95" viewBox="0 280 1024 445" overflow="hidden"><image href="/home-approved/assets/logo.webp" width="1024" height="1024"></image></svg></g><g transform="translate(340 756) skewY(-6) scale(1 1)"><svg width="43" height="19" viewBox="0 280 1024 445" overflow="hidden"><image href="/home-approved/assets/logo.webp" width="1024" height="1024"></image></svg></g><g transform="translate(345 835) skewY(-6) scale(1 1)"><svg width="60" height="26" viewBox="0 280 1024 445" overflow="hidden"><image href="/home-approved/assets/logo.webp" width="1024" height="1024"></image></svg></g></svg></div>
            </div>
            <div className="service-scene-caption"><span id="serviceSceneKicker">{t(scenes[activeService].kicker)}</span><p id="serviceSceneCaption">{t(scenes[activeService].lines[0])}<br />{t(scenes[activeService].lines[1])}</p></div>
          </div>
          <div className="service-region-line"><svg className="icon" aria-hidden="true"><use href="#i-pin"></use></svg><p>{t("Reinigungsservice für Privathaushalte in Zürich, Schaffhausen und Winterthur.")}</p></div>
        </div>
        <div className="service-detail-list" aria-label={t("Unsere fünf Leistungen im Detail")}>
          <p className="service-discovery-hint">{t("Was dürfen wir Ihnen abnehmen? Entdecken Sie die Details.")}</p>
          <details className="service-detail" name="kraken-services" id="fensterreinigung" data-service-detail="windows" open={openService === "windows"} onToggle={event => toggleService("windows", event.currentTarget.open)}>
            <summary><h3><span className="service-glyph"><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#window"></use></svg></span><span className="service-summary-text"><span>{t("Fensterreinigung")}</span><span className="service-benefit">{t("Klare Sicht. Ein helleres Zuhause.")}</span></span><span className="service-detail-toggle"><svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></span></h3></summary>
            <div className="service-detail-body">
              <div className="service-inline-scene service-scene-windows" aria-hidden="true"><img src="/home-approved/assets/service-windows-v5.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></div>
              <p>{t("Einzelne Fenster oder die ganze Wohnung: Wir helfen Ihnen, wieder freie Sicht zu bekommen. Unsere Fensterreinigung für Privathaushalte richtet sich auch an kleine Aufträge. Glasflächen, Rahmen und Fensterbänke stimmen wir auf Ihren Bedarf ab. Welche Innen- und Aussenseiten gereinigt werden können, klären wir anhand der Zugänglichkeit.")}</p>
              <ul className="service-scope"><li>{t("Einzelne Fenster oder mehrere Räume")}</li><li>{t("Glas, Rahmen und Fensterbänke nach Absprache")}</li><li>{t("Umfang und Erreichbarkeit vorab klären")}</li></ul>
              <p className="service-preparation"><strong>{t("Für Ihre Anfrage:")}</strong>{" "}{t("Anzahl, Grösse und Zugänglichkeit der Fenster.")}</p>
              <a className="button button-navy" data-service="windows" data-calculator="" href={quoteHref}>{t("Fensterreinigung berechnen")}</a>
            </div>
          </details>
          <details className="service-detail" name="kraken-services" id="umzugsreinigung" data-service-detail="end" open={openService === "end"} onToggle={event => toggleService("end", event.currentTarget.open)}>
            <summary><h3><span className="service-glyph"><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#end"></use></svg></span><span className="service-summary-text"><span>{t("Umzugsreinigung")}</span><span className="service-benefit">{t("Eine Aufgabe weniger vor der Abgabe.")}</span></span><span className="service-detail-toggle"><svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></span></h3></summary>
            <div className="service-detail-body">
              <div className="service-inline-scene service-scene-end" aria-hidden="true"><img src="/home-approved/assets/service-end-v5.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></div>
              <p>{t("Der Auszug steht an? Wir übernehmen die Endreinigung Ihrer Wohnung mit 1–4 Zimmern und besprechen, was für die Wohnungsabgabe gereinigt werden soll. Küche, Bad, Böden und weitere Bereiche planen wir nach dem vereinbarten Umfang. Anforderungen Ihrer Verwaltung und besondere Verschmutzungen können Sie bei der Anfrage angeben.")}</p>
              <ul className="service-scope"><li>{t("Endreinigung für private Mietwohnungen")}</li><li>{t("Küche, Bad und Wohnräume nach Vereinbarung")}</li><li>{t("Anforderungen zur Wohnungsabgabe berücksichtigen")}</li></ul>
              <p className="service-preparation"><strong>{t("Für Ihre Anfrage:")}</strong>{" "}{t("Zimmerzahl, Zustand und gewünschter Reinigungstermin.")}</p>
              <a className="button button-navy" data-service="end" data-calculator="" href={quoteHref}>{t("Umzugsreinigung berechnen")}</a>
            </div>
          </details>
          <details className="service-detail" name="kraken-services" id="regelmaessige-reinigung" data-service-detail="regular" open={openService === "regular"} onToggle={event => toggleService("regular", event.currentTarget.open)}>
            <summary><h3><span className="service-glyph"><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#regular"></use></svg></span><span className="service-summary-text"><span>{t("Regelmässige Reinigung")}</span><span className="service-benefit">{t("Weniger auf der Liste. Mehr vom Tag.")}</span></span><span className="service-detail-toggle"><svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></span></h3></summary>
            <div className="service-detail-body">
              <div className="service-inline-scene service-scene-regular" aria-hidden="true"><img src="/home-approved/assets/service-regular-v5.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></div>
              <p>{t("Ein gepflegtes Zuhause, auch wenn der Alltag voll ist. Unsere regelmässige Wohnungsreinigung entlastet Sie bei wiederkehrenden Aufgaben. Wir besprechen Ihre Prioritäten, die Räume und den gewünschten Rhythmus. Ob Küche, Bad, Böden oder Oberflächen: Sie bestimmen mit, welche Arbeiten Ihnen im Haushalt am meisten helfen.")}</p>
              <ul className="service-scope"><li>{t("Haushaltsreinigung für Wohnungen mit 1–4 Zimmern")}</li><li>{t("Aufgaben und Reinigungsrhythmus nach Absprache")}</li><li>{t("Unterstützung passend zu Ihrem Alltag")}</li></ul>
              <p className="service-preparation"><strong>{t("Für Ihre Anfrage:")}</strong>{" "}{t("Wohnungsgrösse, gewünschte Häufigkeit und Prioritäten.")}</p>
              <a className="button button-navy" data-service="regular" data-calculator="" href={quoteHref}>{t("Regelmässige Reinigung berechnen")}</a>
            </div>
          </details>
          <details className="service-detail" name="kraken-services" id="grundreinigung" data-service-detail="deep" open={openService === "deep"} onToggle={event => toggleService("deep", event.currentTarget.open)}>
            <summary><h3><span className="service-glyph"><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#deep"></use></svg></span><span className="service-summary-text"><span>{t("Grundreinigung")}</span><span className="service-benefit">{t("Ein frischer Anfang für Ihre Räume.")}</span></span><span className="service-detail-toggle"><svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></span></h3></summary>
            <div className="service-detail-body">
              <div className="service-inline-scene service-scene-deep" aria-hidden="true"><img src="/home-approved/assets/service-deep-v5.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></div>
              <p>{t("Manchmal braucht Ihr Zuhause mehr Aufmerksamkeit als bei der üblichen Reinigung. Mit einer Grundreinigung gehen wir die vereinbarten Bereiche intensiver an – etwa Küche, Bad oder häufig genutzte Oberflächen. Für einen Frühlingsputz, eine einmalige Auffrischung oder gezielte Unterstützung: Beschreiben Sie uns, was gründlicher gereinigt werden soll.")}</p>
              <ul className="service-scope"><li>{t("Intensivreinigung einzelner Bereiche oder der Wohnung")}</li><li>{t("Schwerpunkte und Verschmutzungen vorab besprechen")}</li><li>{t("Einmalige Hilfe passend zu Ihrem Bedarf")}</li></ul>
              <p className="service-preparation"><strong>{t("Für Ihre Anfrage:")}</strong>{" "}{t("Betroffene Räume, Zustand und gewünschte Schwerpunkte.")}</p>
              <a className="button button-navy" data-service="deep" data-calculator="" href={quoteHref}>{t("Grundreinigung berechnen")}</a>
            </div>
          </details>
          <details className="service-detail" name="kraken-services" id="kleine-umzuege" data-service-detail="moving" open={openService === "moving"} onToggle={event => toggleService("moving", event.currentTarget.open)}>
            <summary><h3><span className="service-glyph"><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#moving"></use></svg></span><span className="service-summary-text"><span>{t("Kleine Umzüge")}</span><span className="service-benefit">{t("Ein paar Möbel. Ein neuer Anfang.")}</span></span><span className="service-detail-toggle"><svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></span></h3></summary>
            <div className="service-detail-body">
              <div className="service-inline-scene service-scene-moving" aria-hidden="true"><img src="/home-approved/assets/service-moving-v6.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async" /><svg className="service-brand-overlay" viewBox="0 0 1254 1254" aria-hidden="true" focusable="false"><g transform="translate(780 457) skewY(3.8) scale(1 0.92)"><svg width="220" height="95" viewBox="0 280 1024 445" overflow="hidden"><image href="/home-approved/assets/logo.webp" width="1024" height="1024"></image></svg></g><g transform="translate(340 756) skewY(-6) scale(1 1)"><svg width="43" height="19" viewBox="0 280 1024 445" overflow="hidden"><image href="/home-approved/assets/logo.webp" width="1024" height="1024"></image></svg></g><g transform="translate(345 835) skewY(-6) scale(1 1)"><svg width="60" height="26" viewBox="0 280 1024 445" overflow="hidden"><image href="/home-approved/assets/logo.webp" width="1024" height="1024"></image></svg></g></svg></div>
              <p>{t("Sie zügeln mit wenig Hausrat oder möchten einzelne Möbel und Kartons transportieren lassen? Für Ihren Kleinumzug nutzen wir einen Ford Transit. Wir stimmen den Möbeltransport auf Start, Ziel und Zugänge ab. Welcher Arbeitsaufwand und wie viele Fahrten nötig sind, klären wir anhand Ihres Umzugsguts.")}</p>
              <ul className="service-scope"><li>{t("Einzelne Möbel, Kartons und kleine Haushalte")}</li><li>{t("Transport mit einem Ford Transit")}</li><li>{t("Strecke, Helferbedarf und Zugänge gemeinsam planen")}</li></ul>
              <section className="service-cargo-specs" aria-labelledby="service-cargo-title">
                <h4 id="service-cargo-title">{t("So viel Platz hat der Laderaum.")}</h4>
                <dl>
                  <div><dt>{t("Länge am Boden bis zur Trennwand")}</dt><dd>{t("255,5 cm")}</dd></div>
                  <div><dt>{t("Maximale Innenbreite")}</dt><dd>{t("177,5 cm")}</dd></div>
                  <div><dt>{t("Zwischen den Radkästen")}</dt><dd>{t("139 cm")}</dd></div>
                  <div><dt>{t("Höhe vom Boden bis zum Dach")}</dt><dd>{t("140,6 cm")}</dd></div>
                </dl>
                <p>{t("Die Türöffnungen und die Form Ihrer Möbel berücksichtigen wir bei der Planung.")}</p>
              </section>
              <p className="service-preparation"><strong>{t("Für Ihre Anfrage:")}</strong>{" "}{t("Start und Ziel, Möbel, Stockwerke, Lift und Parkmöglichkeiten.")}</p>
              <a className="button button-navy" data-service="moving" data-calculator="" href={quoteHref}>{t("Kleinen Umzug berechnen")}</a>
            </div>
          </details>
        </div>
      </div>
    </section>

    <div className="container services-why-wrap">
      <section className="services-why" id="warum-kraken" aria-labelledby="services-why-title">
        <div className="services-why-intro"><p className="eyebrow">{t("Warum Kraken?")}</p><h2 id="services-why-title">{t("Auch kleine Aufträge")}<br />{t("sind uns wichtig.")}</h2><p>{t("Persönliche Unterstützung für Ihren Alltag, Ihren Auszug und den nächsten kleinen Umzug.")}</p><a className="button button-mint" href={quoteHref} data-calculator="">{t("Meinen Auftrag berechnen")}</a></div>
        <div className="services-reasons">
          <article><svg className="icon" aria-hidden="true"><use href="#i-home"></use></svg><h3>{t("Passend zu Ihrem Zuhause.")}</h3><p>{t("Einzelne Fenster, eine Wohnung mit 1–4 Zimmern oder ein paar Möbel: Auch dafür ist Kraken da.")}</p></article>
          <article><svg className="icon" aria-hidden="true"><use href="#i-team"></use></svg><h3>{t("Erfahrung, die mitarbeitet.")}</h3><p>{t("Unser erfahrenes Team stimmt die vereinbarten Arbeiten auf Ihre Räume und Ihren Bedarf ab.")}</p></article>
          <article><svg className="icon" aria-hidden="true"><use href="#i-message"></use></svg><h3>{t("Persönlich besprochen.")}</h3><p>{t("Wir hören zu, klären Ihre Prioritäten und besprechen den Umfang, bevor der Einsatz beginnt.")}</p></article>
          <article><svg className="icon" aria-hidden="true"><use href="#i-coins"></use></svg><h3>{t("Preisbewusst geplant.")}</h3><p>{t("Wettbewerbsfähige Konditionen für Ihren Auftrag. Es wird keine Mehrwertsteuer verrechnet. Die Berechnung finden Sie im Rechner.")}</p></article>
        </div>
      </section>
    </div>

    <section className="faq-section section container" id="fragen" aria-labelledby="faq-title"><div className="faq-intro"><p className="eyebrow">{t("Vor Ihrem Auftrag")}</p><h2 id="faq-title">{t("Gut zu wissen.")}</h2><p>{t("Wir sind auch persönlich für Sie da.")}</p><a href="mailto:kai@krakenpfm.ch" className="text-link">{t("kai@krakenpfm.ch")}</a></div><div className="faq-list">
      <details><summary>{t("Übernehmen Sie auch kleine Aufträge?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Ja. Wir konzentrieren uns auf Privathaushalte, Wohnungen mit 1–4 Zimmern und kleine Umzüge. Auch eine einzelne Fensterreinigung oder eine einmalige Grundreinigung können Sie anfragen.")}</p></details>
      <details><summary>{t("Welche Reinigung passt zu meiner Wohnung?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Die regelmässige Wohnungsreinigung unterstützt Sie bei wiederkehrenden Aufgaben. Eine Grundreinigung ist für Bereiche gedacht, die einmalig intensivere Aufmerksamkeit brauchen. Die Umzugsreinigung bereitet Ihre Wohnung auf die Abgabe vor. Fensterreinigung können Sie auch als eigenen Auftrag anfragen. Den gewünschten Umfang stimmen wir anhand Ihrer Angaben ab.")}</p></details>
      <details><summary>{t("Welche Angaben brauche ich für einen kleinen Umzug?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Hilfreich sind Start und Ziel, eine Liste der Möbel und Kartons sowie Angaben zu Stockwerken, Lift und Parkmöglichkeiten. Arbeitsaufwand, Strecke und Zugänge fliessen in die Planung ein. Den verfügbaren Platz im Ford Transit und die benötigten Fahrten klären wir anhand Ihrer Angaben.")}{" "}<a href={quoteHref} data-service="moving" data-calculator="">{t("Kleinen Umzug berechnen")}</a></p></details>
      <details><summary>{t("Wie plane ich meinen Auftrag?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Wählen Sie im Rechner die gewünschte Leistung und geben Sie die Details zu Ihrer Wohnung oder Ihrem Umzug an.")}{" "}<a href={quoteHref} data-calculator="">{t("Zum Service-Rechner")}</a></p></details>
      <details><summary>{t("Wird Mehrwertsteuer verrechnet?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Es wird keine Mehrwertsteuer verrechnet. Die Angaben zu Ihrem Auftrag erhalten Sie im Rechner und in Ihrer persönlichen Bestätigung.")}</p></details>
      <details><summary>{t("In welchen Regionen ist Kraken tätig?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Wir unterstützen Privathaushalte in Zürich, Schaffhausen und Winterthur. Geben Sie Ihre Postleitzahl an, damit wir Ihren Auftrag und die Anfahrt gemeinsam prüfen können.")}</p></details>
      <details><summary>{t("Welches Fahrzeug nutzen Sie für kleine Umzüge?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Wir nutzen einen Ford Transit. Teilen Sie uns mit, welche Möbel und Kartons transportiert werden sollen und wie die Zugänge aussehen. So können wir Fahrzeug, Helfer und benötigte Fahrten passend abstimmen.")}</p></details>
    </div></section>
  </main>
  );
}

export default function ApprovedServices({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { language } = useTranslation();
  return <div className="kraken-home kraken-services services-page" lang={language}>
    <ApprovedHeader onNavigate={onNavigate} servicesPage />
    <ServicesContent language={language} onNavigate={onNavigate} />
  </div>;
}
