import React, { useEffect, useId, useRef } from 'react';
import { initTransitLighting } from './transit-lighting';
import './transit-section.css';

/** The approved two-view Transit story; the owner’s four interior dimensions stay accessible HTML. */
export default function TransitSection({ t }: { t: (source: string, params?: Record<string, string | number>) => string }) {
  const root = useRef<HTMLElement>(null);
  const lightId = 'transit-light-' + useId().replace(/:/g, '');
  useEffect(() => root.current ? initTransitLighting(root.current) : undefined, []);
  return <section className="moving-section" id="umzug" aria-labelledby="moving-title" ref={root}>
      <div className="van-navigation container">
        <p className="van-navigation-label">{t("Ihr Umzug. Gut vorbereitet.")}</p>
        <div className="van-tabs" role="tablist" aria-label={t("Ford Transit entdecken")}>
          <button id="vanOverviewTab" type="button" role="tab" aria-selected="true" aria-controls="vanOverview" tabIndex={0}>{t("Unser Transit")}</button>
          <button id="vanInsideTab" type="button" role="tab" aria-selected="false" aria-controls="vanInside" tabIndex={-1}>{t("Ein Blick hinein")}</button>
        </div>
        <button className="van-play van-autoplay is-playing" id="vanAutoplay" type="button" title={t("Pause")} aria-label={t("Automatische Transit-Ansichten pausieren")}><span className="van-play-symbol" aria-hidden="true"></span><span id="vanAutoplayLabel" className="sr-only">{t("Automatik pausieren")}</span></button>
      </div>
      <div className="van-panels">
      <div id="vanOverview" role="tabpanel" aria-labelledby="vanOverviewTab" tabIndex={0}>
      <div className="moving-inner container">
        <div className="moving-art atlas-panel panel-transit" role="img" aria-label={t("Illustration eines weissen Ford Transit mit Umzugskartons und Sofa")}>
          <svg className="transit-headlamps" viewBox="0 0 724 724" aria-hidden="true" focusable="false">
            <defs><radialGradient id={lightId + '-lens'}><stop stopColor="#fffef0" /><stop offset=".45" stopColor="#fff6cd" stopOpacity=".95" /><stop offset="1" stopColor="#e7faff" stopOpacity="0" /></radialGradient></defs>
            <g className="transit-lamp-bloom" fill={`url(#${lightId}-lens)`}><ellipse cx="223" cy="364" rx="50" ry="37" /><ellipse cx="49" cy="365" rx="23" ry="34" /></g>
            <g className="transit-lamp-lenses" fill="#fff7d8"><path d="m197 356 52-12-10 31-35 6Z" /><path d="m43 349 15-9-5 34-14 11Z" /></g>
            <g className="transit-lamp-centres" fill="#fffef3"><ellipse cx="221" cy="364" rx="9" ry="5" transform="rotate(-13 221 364)" /><ellipse cx="49" cy="364" rx="3" ry="8" transform="rotate(12 49 364)" /></g>
          </svg>
        </div>
        <svg className="transit-headlight-beams" aria-hidden="true" focusable="false" preserveAspectRatio="none">
          <defs>{[0, 1, 2, 3].map(index => <linearGradient key={index} id={lightId + '-beam-' + index} data-light-gradient={index} gradientUnits="userSpaceOnUse"><stop stopColor="#fff5d5" stopOpacity=".75" /><stop offset=".55" stopColor="#d9f5ff" stopOpacity=".16" /><stop offset="1" stopColor="#bbf4e1" stopOpacity=".5" /></linearGradient>)}</defs>
          {[0, 1, 2, 3].map(index => <path key={index} className={'transit-light-cone transit-light-cone-' + index} data-light-cone={index} fill={`url(#${lightId}-beam-${index})`} />)}
        </svg>
        <div className="moving-copy"><p className="eyebrow">{t("Für Ihren nächsten Anfang")}</p><h2 id="moving-title">{t("Kleiner Umzug.")}<br />{t("Klar geplant.")}</h2><p className="moving-description">{t("Ein paar Möbel oder eine kleine Wohnung? Mit unserem Ford Transit und einem erfahrenen Team bringen wir Bewegung in Ihre Pläne.")}</p>
          <div className="move-features" aria-label={t("Ihr Umzug mit Kraken")}><div><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#moving" /></svg><span>{t("Unser Transit")}</span></div><div><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#team" /></svg><span>{t("Unser Team")}</span></div><div><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#time" /></svg><span>{t("Ihr Termin")}</span></div><div><svg className="icon brand-service-icon" aria-hidden="true" viewBox="0 0 32 32"><use href="/home-approved/assets/kraken-icons.svg#distance" /></svg><span>{t("Ihre Strecke")}</span></div></div>
          <p className="moving-detail">{t("Vom Abholort bis zum Ziel: Beschreiben Sie Ihren Umzug Schritt für Schritt im Rechner.")}</p>
        </div>
        <div className="moving-planner calculator-planner"><div><strong>{t("Was zieht mit um?")}</strong><p>{t("Erzählen Sie uns im Rechner von Ihrem Umzug.")}</p></div><a className="button button-mint" href="/quote" data-service="moving" data-calculator="">{t("Umzug berechnen")}</a></div>
        <p className="moving-caption">{t("Fahrzeugdarstellung illustrativ. Der konkrete Einsatz wird persönlich abgestimmt.")}</p>
      </div>
      </div>
      <div id="vanInside" role="tabpanel" aria-labelledby="vanInsideTab" tabIndex={0} hidden={true} inert={true}>
        <div className="van-inside-inner container">
          <div className="van-inside-copy">
            <p className="eyebrow">{t("Platz für Ihren nächsten Schritt")}</p>
            <h2>{t("Tür auf.")}<br />{t("Raum für Neues.")}</h2>
            <p className="van-intro">{t("Kartons, Stühle und ein zerlegtes Möbelstück: Entdecken Sie, wie wir einen kleinen Umzug im Transit planen.")}</p>
            <div className="van-load-steps" role="group" aria-label={t("Beladung ansehen")}>
              <button type="button" data-cargo-step="0" aria-pressed="true"><svg className="icon" aria-hidden="true"><use href="#i-truck" /></svg><span>{t("Leer")}</span></button>
              <button type="button" data-cargo-step="1" aria-pressed="false"><svg className="icon" aria-hidden="true"><use href="#i-box" /></svg><span>{t("Kartons")}</span></button>
              <button type="button" data-cargo-step="2" aria-pressed="false"><svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><path d="M7 13V4h10v9M5 13h14v4H5Zm1 4v4m12-4v4" /></svg><span>{t("Stühle")}</span></button>
              <button type="button" data-cargo-step="3" aria-pressed="false"><svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><path d="M5 3h14v18H5ZM5 9h14M5 15h14M9 3v18" /></svg><span>{t("Möbel")}</span></button>
            </div>
            <div className="van-load-status"><span className="van-load-progress" aria-hidden="true"><span id="cargoProgress"></span></span><p id="cargoStatus" role="status" aria-live="polite">{t("Alles beginnt mit einem freien Laderaum.")}</p></div>
            <div className="van-view-actions"><button className="van-play" id="cargoPlay" type="button"><span className="van-play-symbol" aria-hidden="true"></span><span id="cargoPlayLabel">{t("Laden ansehen")}</span></button><button className="van-measures-toggle" id="cargoMeasures" type="button" aria-controls="cargoMeasurements" aria-expanded="false" aria-pressed="false">{t("Innenmasse ansehen")}</button></div>
          </div>
          <div className="van-visual-slot">
          <div className="van-load-visual" id="cargoVisual" role="img" aria-label={t("Ansicht eines offenen Kraken Ford Transit mit leerem Laderaum.")}>
            <div className="van-load-atlas" id="cargoFrame" data-frame="0" aria-hidden="true"></div>
            <div className="van-load-atlas van-load-incoming" id="cargoIncoming" data-frame="0" aria-hidden="true"></div>
            <span className="van-example-label">{t("Beispiel für einen kleinen Umzug")}</span>
          </div>
          <section className="van-measure-panel" id="cargoMeasurements" aria-labelledby="cargoMeasurementsTitle" hidden={true}>
            <div className="van-measure-heading"><p className="eyebrow">{t("Platz im Laderaum")}</p><h3 id="cargoMeasurementsTitle">{t("Die Innenmasse.")}</h3></div>
            <div className="van-measure-diagrams" aria-hidden="true">
              <div className="van-measure-view"><p>{t("Von oben")}</p><svg viewBox="0 0 340 340" focusable="false">
                <rect className="van-measure-space" x="105" y="32" width="177.5" height="255.5" rx="8" />
                <path className="van-measure-bulkhead" d="M111 42H276.5" />
                <path className="van-measure-guide" d="M98 32H63M98 287.5H63M105 295V315M282.5 295V315" />
                <path className="van-measure-line" d="M70 32V287.5M64 32H76M64 287.5H76M105 308H282.5M105 302V314M282.5 302V314" />
                <text className="van-measure-number" x="47" y="160" textAnchor="middle" transform="rotate(-90 47 160)">{t("255,5 cm")}</text>
                <text className="van-measure-number" x="193.75" y="335" textAnchor="middle">{t("177,5 cm")}</text>
              </svg></div>
              <div className="van-measure-view"><p>{t("Querschnitt")}</p><svg viewBox="0 0 340 340" focusable="false">
                <rect className="van-measure-space" x="80" y="82" width="177.5" height="140.6" rx="8" />
                <path className="van-measure-guide" d="M265 82H295M265 222.6H295M99.25 231V265M238.25 231V265" />
                <path className="van-measure-line" d="M287 82V222.6M281 82H293M281 222.6H293M99.25 258H238.25M99.25 252V264M238.25 252V264" />
                <text className="van-measure-number" x="317" y="152.3" textAnchor="middle" transform="rotate(-90 317 152.3)">{t("140,6 cm")}</text>
                <text className="van-measure-number" x="168.75" y="289" textAnchor="middle">{t("139 cm")}</text>
                <text className="van-measure-detail" x="168.75" y="318" textAnchor="middle">{t("zwischen den Radkästen")}</text>
              </svg></div>
            </div>
            <dl className="van-measure-values">
              <div><dt>{t("Ladelänge am Boden bis zur Trennwand")}</dt><dd>{t("255,5")} <span>{t("cm")}</span></dd></div>
              <div><dt>{t("Maximale Innenbreite")}</dt><dd>{t("177,5")} <span>{t("cm")}</span></dd></div>
              <div><dt>{t("Breite zwischen den Radkästen")}</dt><dd>{t("139")} <span>{t("cm")}</span></dd></div>
              <div><dt>{t("Innenhöhe vom Boden bis zum Dach")}</dt><dd>{t("140,6")} <span>{t("cm")}</span></dd></div>
            </dl>
            <p className="van-measure-note">{t("Schematische Ansichten des Laderaums. Türöffnungen und Möbelmasse prüfen wir für Ihren Auftrag.")}</p>
          </section>
          </div>
          <div className="van-fit-card">
            <div className="van-fit-icon" aria-hidden="true"><svg className="icon" viewBox="0 0 24 24"><path d="m4 16 12-12 5 5L9 21Zm5-5 3 3m0-6 3 3m0-6 3 3" /></svg></div>
            <div><h3>{t("Passt Ihr Möbelstück?")}</h3><p>{t("Die Innenmasse geben Ihnen eine erste Orientierung. Teilen Sie uns die Masse Ihrer Möbel mit – wir berücksichtigen zusätzlich die Türöffnungen und die passende Ladungssicherung.")}</p></div>
            <a className="button button-mint" data-service="moving" href="/quote" data-calculator="">{t("Umzug im Rechner planen")}</a>
          </div>
          <p className="van-capacity-note">{t("Die gezeigte Beladung ist ein Beispiel. Was mitkommt und wie viele Fahrten nötig sind, planen wir anhand Ihrer Möbel, der Zugänge und der Ladungssicherung.")}</p>
        </div>
      </div>
      </div>
    </section>;
}
