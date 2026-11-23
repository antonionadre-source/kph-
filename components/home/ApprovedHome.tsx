import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n';
import { openHomeCalculator, type HomeService } from '../../src/home/calculator';
import { homeLanguages, homeText, normalizeHomeLanguage } from './homeTranslations';
import ApprovedHeader from './ApprovedHeader';
import TransitSection from './TransitSection';
import WhyKrakenSection from './WhyKrakenSection';
import { whyTranslations } from './whyTranslations';
import { initApprovedHome } from './app';
import { initApartmentScene } from './scene';
import { initTransit } from './van';
import './approved-home.css';
import './responsive-fixes.css';
import './home-language.css';
import './device-fixes.css';

// The approved illustration layers and accessible controls remain one React route.
export default function ApprovedHome({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { language } = useTranslation();
  const homeLanguage = normalizeHomeLanguage(language);
  const t = (source: string, params?: Record<string, string | number>) => whyTranslations[homeLanguage]?.[source] ?? homeText(homeLanguage, source, params);
  const translationRef = useRef(t);
  translationRef.current = t;
  const localeRef = useRef('de-CH');
  localeRef.current = homeLanguages.find(item => item.code === homeLanguage)?.locale || 'de-CH';
  const rootRef = useRef<HTMLDivElement>(null);
  const navigateRef = useRef(onNavigate);
  navigateRef.current = onNavigate;
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const previousPadding = document.documentElement.style.scrollPaddingTop;
    document.documentElement.style.scrollPaddingTop = '100px';
    const translate = (source: string, params?: Record<string, string | number>) => translationRef.current(source, params);
    const cleanups = [
      initApprovedHome(root, (service: HomeService | null) => openHomeCalculator(service, (path) => navigateRef.current(path)), translate),
      initApartmentScene(root, { t: translate, getLocale: () => localeRef.current }),
      initTransit(root, translate),
    ];
    let hashFrame = 0;
    // App resolves its route before the illustration mounts. Honour inbound
    // links from Services after the parent's initial scroll restoration.
    const hash = window.location.hash.slice(1);
    if (['umzug', 'ueber-uns', 'warum-kraken', 'leistungen', 'kontakt'].includes(hash)) {
      hashFrame = requestAnimationFrame(() => {
        hashFrame = requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }));
      });
    }
    return () => {
      cancelAnimationFrame(hashFrame);
      cleanups.reverse().forEach(cleanup => cleanup?.());
      document.documentElement.style.scrollPaddingTop = previousPadding;
    };
  }, []);
  useEffect(() => {
    rootRef.current?.dispatchEvent(new CustomEvent('kraken:languagechange'));
  }, [homeLanguage]);
  return <div className="kraken-home" lang={language === 'de-CH' ? 'de-CH' : homeLanguage} ref={rootRef}>

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

  <ApprovedHeader onNavigate={onNavigate} />

  <main id="main">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-stage">
        <div className="hero-visual">
        <div className="hero-art scene-canvas" id="sceneCanvas" data-season="autumn" data-phase="day" data-weather="unknown" data-celebration="none" role="img" aria-label={t("Eine gemütliche Wohnung mit Kai und Kraken-Umzugskartons. Die Szene passt sich der Jahreszeit und der Uhrzeit in Zürich an.")}>
          <svg className="scene-window" viewBox="0 0 1536 1024" aria-hidden="true">
            <defs>
              <clipPath id="sceneWindowClip"><path d="M550 225 913 171 913 398 550 471Z"></path></clipPath>
              <clipPath id="sceneGlassClip"><path d="M555 238 606 231 606 445 555 456ZM630 228 766 207 766 420 630 448ZM790 202 895 186 895 386 790 408Z"></path></clipPath>
            </defs>
            <g clipPath="url(#sceneWindowClip)">
              <rect x="550" y="171" width="363" height="300" fill="#c6d9e3"></rect>
              <svg x="550" y="171" width="363" height="300" viewBox="0 0 627 627" preserveAspectRatio="xMidYMid slice" className="scene-landscape">
                <image id="sceneLandscape" href="/home-approved/assets/seasons-window.webp" x="0" y="-627" width="1254" height="1254"></image>
              </svg>
              <rect className="scene-mist" x="550" y="171" width="363" height="300"></rect>
              <rect className="scene-window-shade" x="550" y="171" width="363" height="300"></rect>
              <g className="scene-stars" fill="#e2edf9"><circle cx="685" cy="244" r="1.4"></circle><circle cx="824" cy="214" r="1.7"></circle><circle cx="874" cy="253" r="1.1"></circle><circle cx="747" cy="228" r="1"></circle></g>
            </g>
            <g clipPath="url(#sceneGlassClip)">
              <g id="sceneRain" className="scene-rain"></g>
              <g id="sceneSnow" className="scene-snow"></g>
              <path className="scene-wipe" d="M831 247q20 25 6 55t-2 55"></path>
            </g>
          </svg>
          <img className="scene-room" id="sceneRoom" src="/home-approved/assets/hero-room-day-v4.webp" alt="" width="1536" height="1024" fetchPriority="high" aria-hidden="true" />
          <svg className="scene-box-branding" viewBox="0 0 1536 1024" aria-hidden="true">
            <g transform="translate(1354 667) skewY(-17)"><svg width="55" height="23.6" viewBox="4 283 1016 436"><image href="/home-approved/assets/logo.webp" width="1024" height="1024"></image></svg></g>
            <g transform="translate(1338 744) skewY(-17)"><svg width="80" height="34.33" viewBox="4 283 1016 436"><image href="/home-approved/assets/logo.webp" width="1024" height="1024"></image></svg></g>
          </svg>
          <svg className="scene-interior" viewBox="0 0 1536 1024" aria-hidden="true">
            <path className="scene-cushion" d="M729 484q19 2 33-6l13 54q-18 7-35 6Z"></path>
            <g transform="translate(858 605)">
              <g className="scene-season-detail scene-detail-spring"><path d="m0 17-4-18m4 18 9-19" fill="none" stroke="#67855d" strokeWidth="2"></path><g fill="#e9b9c8"><circle cx="-4" cy="-5" r="4"></circle><circle cx="-8" cy="0" r="4"></circle><circle cx="0" cy="0" r="4"></circle><circle cx="-4" cy="4" r="4"></circle></g><circle cx="-4" cy="0" r="2.5" fill="#f5e4a8"></circle><g fill="#fff1db"><circle cx="8" cy="-7" r="3.5"></circle><circle cx="4" cy="-3" r="3.5"></circle><circle cx="12" cy="-3" r="3.5"></circle><circle cx="8" cy="1" r="3.5"></circle></g><circle cx="8" cy="-3" r="2" fill="#e0bf76"></circle></g>
              <g className="scene-season-detail scene-detail-summer" fill="#efcd78"><circle cx="-5" cy="-2" r="4"></circle><circle cx="4" cy="-6" r="3"></circle><circle cx="10" cy="2" r="4"></circle><circle cx="-9" cy="7" r="3"></circle></g>
              <g className="scene-season-detail scene-detail-autumn"><path d="m-6 9 4-20m3 21 10-15" fill="none" stroke="#856344" strokeWidth="2"></path><path d="M-2-11q-12-3-12 6 6 8 12-6" fill="#b77c4f"></path><path d="M12-5q9-10 12-1-1 8-12 1" fill="#c49a5e"></path><path d="M-4 1q10-10 13-2-2 8-13 2" fill="#ba874b"></path></g>
              <g className="scene-season-detail scene-detail-winter"><path d="M-8 10 0-8m0 17 10-12" stroke="#6f8f75" strokeWidth="2"></path><g fill="#e8eef0"><circle cx="-2" cy="-7" r="3.2"></circle><circle cx="4" cy="-4" r="3"></circle><circle cx="11" cy="-2" r="3.5"></circle><circle cx="6" cy="2" r="3"></circle></g></g>
            </g>
          </svg>
          <div className="scene-holiday" aria-hidden="true"></div>
          <div className="scene-kai" id="sceneKai" data-task="moving" aria-hidden="true"><div className="scene-kai-sprite"></div></div>
        </div>
        <button className="scene-hotspot hotspot-window" type="button" data-service="windows" data-hotspot="windows" aria-label={t("Fensterreinigung auswählen")}><svg className="icon brand-service-icon" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#window"></use></svg><span>{t("Fenster")}</span><span className="hotspot-dot" aria-hidden="true"></span></button>
        <button className="scene-hotspot hotspot-floor" type="button" data-service="deep" data-hotspot="floor" aria-label={t("Grundreinigung auswählen")}><svg className="icon brand-service-icon" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#deep"></use></svg><span>{t("Böden & mehr")}</span><span className="hotspot-dot" aria-hidden="true"></span></button>
        <button className="scene-hotspot hotspot-move" type="button" data-service="moving" data-hotspot="moving" aria-label={t("Kleinen Umzug auswählen")}><svg className="icon brand-service-icon" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#moving"></use></svg><span>{t("Kleiner Umzug")}</span><span className="hotspot-dot" aria-hidden="true"></span></button>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">{t("Kleine Aufgaben. Grosse Entlastung.")}</p>
          <h1 id="hero-title"><span>{t("Ihr Zuhause")}</span> <span>{t("in guten")}</span> <span>{t("Armen.")}</span></h1>
          <p className="hero-description">{t("Reinigung und kleine Umzüge in Zürich, Schaffhausen und Winterthur.")}</p>
          <p className="hero-personal">{t("Persönlich. Erfahren. Für Sie da.")}</p>
          <button className="scene-open" id="sceneOpen" type="button" aria-haspopup="dialog" aria-controls="sceneDialog">
            <span className="scene-open-weather" aria-hidden="true"><svg id="sceneWeatherIcon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><path d="M12 7v5l3 2"></path></svg></span>
            <span className="scene-open-copy"><strong id="sceneCityTime">{t("Zürich · Ortszeit")}</strong><span id="sceneShortStatus">{t("Szene entdecken")}</span></span><svg className="scene-open-settings icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h7m4 0h5M4 17h3m4 0h9"></path><circle cx="13" cy="7" r="2"></circle><circle cx="9" cy="17" r="2"></circle></svg>
          </button>
          <button className="scene-motion-toggle" id="sceneMotionToggle" type="button" aria-label={t("Animation pausieren")} title={t("Animation pausieren")} aria-pressed={false}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><g className="scene-motion-pause" data-motion-icon="pause"><path d="M8 5v14m8-14v14" /></g><g className="scene-motion-play" data-motion-icon="play"><path d="m9 6 9 6-9 6Z" /></g></svg>
            <span className="sr-only" data-scene-motion-label="">{t("Animation pausieren")}</span>
          </button>
        </div>
        <dialog className="scene-dialog" id="sceneDialog" aria-labelledby="sceneDialogTitle" aria-describedby="scenePreviewExplanation">
          <div className="scene-dialog-inner">
            <div className="scene-dialog-heading"><div><p className="eyebrow">{t("Ein Zuhause, das mitfühlt")}</p><h2 id="sceneDialogTitle">{t("Eine Szene. Vier Jahreszeiten.")}</h2></div><button type="button" className="scene-close" data-scene-close="" aria-label={t("Szeneneinstellungen schliessen")}>{t("×")}</button></div>
            <p className="scene-dialog-intro" id="scenePreviewExplanation">{t("Die Jahreszeit, die Festtage und die Uhrzeit verändern dieses Zuhause. Probieren Sie selbst aus, wie es sich anfühlt.")}</p>
            <p className="scene-mode-badge" id="sceneMode" role="status">{t("Automatisch · passend zu Zürich")}</p>
            <div className="scene-controls">
              <div className="scene-control"><label htmlFor="sceneSeason">{t("Jahreszeit")}</label><select id="sceneSeason" data-scene-control="season"><option value="auto">{t("Automatisch")}</option><option value="spring">{t("Frühling")}</option><option value="summer">{t("Sommer")}</option><option value="autumn">{t("Herbst")}</option><option value="winter">{t("Winter")}</option></select></div>
              <div className="scene-control"><label htmlFor="sceneCelebration">{t("Festliche Stimmung")}</label><select id="sceneCelebration" data-scene-control="celebration"><option value="auto">{t("Automatisch")}</option><option value="none">{t("Ohne Fest")}</option><option value="christmas">{t("Weihnachten")}</option><option value="newyear">{t("Neujahr")}</option></select></div>
              <div className="scene-control"><label htmlFor="scenePhase">{t("Tageszeit")}</label><select id="scenePhase" data-scene-control="phase"><option value="auto">{t("Automatisch")}</option><option value="day">{t("Tag")}</option><option value="evening">{t("Abend")}</option><option value="night">{t("Nacht")}</option></select></div>
              <div className="scene-control"><label htmlFor="sceneWeather">{t("Wetterbild")}</label><select id="sceneWeather" data-scene-control="weather"><option value="auto">{t("Automatisch")}</option><option value="sun">{t("Sonne")}</option><option value="cloudy">{t("Wolken")}</option><option value="rain">{t("Regen")}</option><option value="snow">{t("Schnee")}</option></select></div>
              <div className="scene-control"><label htmlFor="sceneClothing">{t("Kais Kleidung")}</label><select id="sceneClothing" data-scene-control="clothing"><option value="auto">{t("Nach Temperatur")}</option><option value="warm">{t("Mit warmer Jacke")}</option><option value="light">{t("Mit leichtem Polo")}</option></select></div>
              <div className="scene-control"><label htmlFor="sceneMotion">{t("Bewegung")}</label><select id="sceneMotion" data-scene-control="motion"><option value="auto">{t("Sanfte Animation")}</option><option value="still">{t("Ruhiges Bild")}</option></select></div>
            </div>
            <p className="scene-kai-note" id="sceneKaiNote">{t("Kai passt sich der Tageszeit und der Temperatur an.")}</p>
            <div className="scene-dialog-actions"><button className="scene-reset" id="sceneReset" type="button">{t("Automatisch")}</button><button className="button button-navy scene-done" type="button" data-scene-close="">{t("Szene ansehen")}</button></div>
            <div className="scene-weather-note"><p><strong id="sceneWeatherStatus">{t("Wetter: Zürich-Flughafen · wird geladen …")}</strong><span className="scene-datum" id="sceneWeatherDelayed" hidden={true}>{t("Verzögert")}</span></p><p id="sceneWeatherExplanation">{t("Die Szene illustriert die gemeldeten Wetterbedingungen. Die Station am Flughafen dient als regionale Orientierung.")}</p><p className="scene-attribution"><a href="https://aviationweather.gov/data/api/" target="_blank" rel="noopener noreferrer">{t("Wetterdaten: NOAA / Aviation Weather Center · Station LSZH")}</a></p></div>
          </div>
        </dialog>
      </div>

      <div className="booking-dock" id="anfrage">
        <p className="sr-only" id="serviceGroupLabel">{t("Welche Unterstützung wünschen Sie?")}</p>
        <div className="service-picker" role="group" aria-labelledby="serviceGroupLabel" aria-describedby="serviceHint">
          <button className="service-option" type="button" data-service="windows" aria-pressed="false"><svg className="icon brand-service-icon" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#window"></use></svg><span>{t("Fensterreinigung")}</span></button>
          <button className="service-option" type="button" data-service="end" aria-pressed="false"><svg className="icon brand-service-icon" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#end"></use></svg><span>{t("Umzugsreinigung")}</span></button>
          <button className="service-option" type="button" data-service="regular" aria-pressed="false"><svg className="icon brand-service-icon" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#regular"></use></svg><span>{t("Regelmässige Reinigung")}</span></button>
          <button className="service-option" type="button" data-service="deep" aria-pressed="false"><svg className="icon brand-service-icon" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#deep"></use></svg><span>{t("Grundreinigung")}</span></button>
          <button className="service-option" type="button" data-service="moving" aria-pressed="false"><svg className="icon brand-service-icon" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#moving"></use></svg><span>{t("Kleine Umzüge")}</span></button>
        </div>
        <p className="service-hint" id="serviceHint" aria-live="polite">{t("Was dürfen wir Ihnen abnehmen? Wählen Sie Ihren Service.")}</p>
        <div className="booking-form calculator-entry">
          <div className="calculator-entry-copy"><strong>{t("Ihr Auftrag. Einfach geplant.")}</strong><span>{t("Die passenden Angaben machen Sie direkt im Rechner.")}</span></div>
          <a className="button button-mint booking-submit" href="/quote" data-calculator="">{t("Zum Service-Rechner")}</a>
          <span className="booking-divider" aria-hidden="true"></span>
          <button className="button button-kai" type="button" data-open-kai=""><svg className="icon" aria-hidden="true"><use href="#i-message"></use></svg>{t("Mit Kai starten")}</button>
        </div>
      </div>
      <div className="trust-strip container" aria-label={t("Für Ihren Privathaushalt")}><span><svg className="icon" aria-hidden="true"><use href="#i-home"></use></svg>{t("Für Privathaushalte")}</span><span><svg className="icon" aria-hidden="true"><use href="#i-sofa"></use></svg>{t("Wohnungen mit 1–4 Zimmern")}</span><span><svg className="icon" aria-hidden="true"><use href="#i-coins"></use></svg>{t("Keine Mehrwertsteuer")}</span></div>
    </section>

    <section className="services-section section container" id="leistungen" aria-labelledby="services-title">
      <div className="section-heading"><div><p className="eyebrow">{t("So viel Hilfe, wie Sie brauchen")}</p><h2 id="services-title">{t("Was dürfen wir Ihnen")}<br />{t("abnehmen?")}</h2></div><p>{t("Ein einzelnes Fenster, die ganze Wohnung oder Ihr nächster Umzug. Wir schauen gemeinsam, was für Sie passt.")}</p></div>
      <div className="service-cards">
        <article className="service-card home-card"><div className="card-art atlas-panel panel-window" role="img" aria-label={t("Illustration eines sonnigen Fensters mit Reinigungsmitteln")}></div><div className="card-shade"></div><div className="card-content"><span className="card-kicker">{t("Mehr Zeit für Ihr Zuhause")}</span><h3>{t("Ein Zuhause zum")}<br />{t("Durchatmen.")}</h3><p>{t("Klare Fenster. Frische Räume.")}<br />{t("Ein gutes Gefühl beim Heimkommen.")}</p><div className="card-service-links"><a data-service="windows" href="/quote" data-calculator="">{t("Fenster")}</a><a data-service="regular" href="/quote" data-calculator="">{t("Regelmässig")}</a><a data-service="deep" href="/quote" data-calculator="">{t("Grundreinigung")}</a></div></div></article>
        <article className="service-card end-card"><div className="card-art atlas-panel panel-apartment" role="img" aria-label={t("Illustration einer leeren Wohnung mit Schlüsseln")}></div><div className="card-shade"></div><div className="card-content"><span className="card-kicker">{t("Ein Kapitel endet. Ein neues beginnt.")}</span><h3>{t("Bereit für die")}<br />{t("Wohnungsabgabe.")}</h3><p>{t("Wir kümmern uns um die Reinigung.")}<br />{t("Sie um das Ankommen.")}</p><a className="button button-mint" data-service="end" href="/quote" data-calculator="">{t("Umzugsreinigung berechnen")}</a></div></article>
      </div>
      <div className="service-note"><svg className="icon" aria-hidden="true"><use href="#i-check"></use></svg><p>{t("Einmalig oder regelmässig: Wir vereinbaren den Umfang passend zu Ihrer Wohnung und Ihrem Alltag.")}</p></div>
    </section>

    <TransitSection t={t} />

    <WhyKrakenSection t={t} />

    <section className="faq-section section container" aria-labelledby="faq-title"><div className="faq-intro"><p className="eyebrow">{t("Gut zu wissen")}</p><h2 id="faq-title">{t("Noch eine")}<br />{t("Frage?")}</h2><p>{t("Wir sind auch persönlich für Sie da.")}</p><a href="mailto:kai@krakenpfm.ch" className="text-link">kai@krakenpfm.ch</a></div><div className="faq-list">
      <details><summary>{t("Übernehmen Sie auch kleine Aufträge?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Ja. Wir konzentrieren uns auf Privathaushalte, Wohnungen mit 1–4 Zimmern und kleine Umzüge. Auch eine einzelne Fensterreinigung oder eine einmalige Grundreinigung können Sie anfragen.")}</p></details>
      <details><summary>{t("Wie plane ich meinen Auftrag?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Wählen Sie im Rechner die gewünschte Leistung und geben Sie die Details zu Ihrer Wohnung oder Ihrem Umzug an.")}{' '}<a href="/quote" data-calculator="">{t("Zum Service-Rechner")}</a></p></details>
      <details><summary>{t("Wird Mehrwertsteuer verrechnet?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Es wird keine Mehrwertsteuer verrechnet. Die Angaben zu Ihrem Auftrag erhalten Sie im Rechner und in Ihrer persönlichen Bestätigung.")}</p></details>
      <details><summary>{t("In welchen Regionen ist Kraken tätig?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Wir unterstützen Privathaushalte in Zürich, Schaffhausen und Winterthur. Geben Sie Ihre Postleitzahl an, damit wir Ihren Auftrag und die Anfahrt gemeinsam prüfen können.")}</p></details>
      <details><summary>{t("Welches Fahrzeug nutzen Sie für kleine Umzüge?")}<svg className="icon" aria-hidden="true"><use href="#i-plus"></use></svg></summary><p>{t("Wir nutzen einen Ford Transit. Teilen Sie uns mit, welche Möbel und Kartons transportiert werden sollen und wie die Zugänge aussehen. So können wir Fahrzeug, Helfer und benötigte Fahrten passend abstimmen.")}</p></details>
    </div></section>
  </main>

  <div className="sr-only" id="globalStatus" aria-live="polite"></div>

  </div>;
}
