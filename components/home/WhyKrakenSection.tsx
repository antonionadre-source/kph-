import React from 'react';
import './why-kraken.css';

type WhyKrakenSectionProps = {
  t: (source: string, params?: Record<string, string | number>) => string;
};

/** Owner-approved personal introduction and conditional VAT comparison. */
export default function WhyKrakenSection({ t }: WhyKrakenSectionProps) {
  return (
    <section className="why-section" id="warum-kraken" aria-labelledby="why-title">
      <span id="ueber-uns" className="why-legacy-anchor" aria-hidden="true">
      </span>
      <div className="why-container">
      <div className="why-editorial">
      <div className="why-introduction">
      <p className="why-eyebrow">{t("Warum Kraken?")}</p>
      <h2 id="why-title">{' '}{t("Sie wissen,")}<br />
      <span>{t("wer sich kümmert.")}</span>
      </h2>
      <p className="why-intro">{' '}{t("Ich bin Antonio, Ihr Ansprechpartner bei Kraken. Gemeinsam klären wir, was Sie brauchen. Unser erfahrenes Team übernimmt die vereinbarten Arbeiten – sorgfältig und passend zu Ihrem Zuhause.")}{' '}</p>
      <div className="why-signature">
      <strong>{t("Antonio")}</strong>
      <span>{t("Inhaber & Ihr Ansprechpartner")}</span>
      </div>
      <div className="why-primary-action">
      <a className="why-button" href="/quote" data-calculator="">{' '}{t("Auftrag im Rechner planen")}{' '}</a>
      <p>{t("Die nächsten Schritte besprechen wir persönlich.")}</p>
      </div>
      <div className="why-private-benefit">
      <svg className="why-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 3l2 1.5L9 3l3 1.5L15 3l2 1.5L19 3v18l-2-1.5-2 1.5-3-1.5L9 21l-2-1.5L5 21V3ZM9 9h6M9 13h6M9 17h3" />
      </svg>
      <p>{' '}{t("Für private Haushaltsleistungen können Sie die MwSt. nicht als Vorsteuer abziehen.")}{' '}<strong>{t("Deshalb zählt der Endpreis.")}</strong>
      </p>
      </div>
      <div className="why-local">
      <svg className="why-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
      </svg>
      <div>
      <span>{t("Für Privathaushalte in")}</span>
      <p>{t("Zürich, Schaffhausen und Winterthur")}</p>
      </div>
      </div>
      </div>
      <div className="why-promise-panel">
      <p className="why-panel-label">{' '}{t("Ihr Vorteil als Privathaushalt")}{' '}</p>
      <h3 className="why-tax-title">
      <span>{t("Keine MwSt.")}</span>{' '}{t("auf Ihrer Rechnung.")}{' '}</h3>
      <p className="why-tax-intro">{' '}{t("Kraken ist nicht mehrwertsteuerpflichtig. Deshalb stellen wir Ihnen keine Mehrwertsteuer in Rechnung.")}{' '}</p>
      <p className="why-tax-condition" id="why-tax-condition">{' '}{t("Vergleich bei gleichem Nettopreis und Leistungsumfang")}{' '}</p>
      <dl className="why-tax-comparison" aria-describedby="why-tax-condition">
      <div className="why-tax-company why-tax-kraken">
      <dt>{t("Kraken")}</dt>
      <dd>
      <strong>{t("Ohne MwSt.")}</strong>
      <span>{t("Ihr vereinbarter Preis.")}</span>
      </dd>
      </div>
      <div className="why-tax-company">
      <dt>{t("MwSt.-pflichtiger Anbieter")}</dt>
      <dd>
      <strong>{t("Mit 8,1 % MwSt.")}</strong>
      <span>{' '}{t("Gleicher Nettopreis; MwSt. im Endpreis enthalten.")}{' '}</span>
      </dd>
      </div>
      </dl>
      <p className="why-tax-saving">{' '}{t("Bei gleichem Nettopreis zahlen Sie")}{' '}<strong>{t("rund 7,5 % weniger")}</strong>{' '}{t("als beim Vergleichsangebot inklusive MwSt.")}{' '}</p>
      <p className="why-tax-note">{' '}{t("Ihre tatsächliche Ersparnis hängt von den verglichenen Gesamtangeboten ab.")}{' '}</p>
      <details className="why-tax-detail">
      <summary>{' '}{t("Wie entsteht der Preisvorteil?")}{' '}<span className="why-disclosure" aria-hidden="true">
      <svg className="why-icon" viewBox="0 0 24 24" focusable="false">
      <path d="M12 5v14M5 12h14" />
      </svg>
      </span>
      </summary>
      <div>
      <p>{' '}{t("Der Vergleich setzt denselben Nettopreis und Leistungsumfang voraus. Bei 8,1 % MwSt. beträgt der Steueranteil am Preis inklusive MwSt. rund 7,49 %:")}{' '}</p>
      <p className="why-tax-formula">{' '}{t("8,1 ÷ 108,1 × 100 ≈ 7,49 %")}{' '}</p>
      <p>{' '}{t("Gerundet ergibt das einen Preisunterschied von 7,5 % zum Vergleichsangebot inklusive MwSt. Vergleichen Sie deshalb immer den gesamten Leistungsumfang und die Endpreise.")}{' '}</p>
      </div>
      </details>
      </div>
      </div>
      <div className="why-promises" aria-label={t("Weitere Vorteile für Ihren Haushalt")}>
      <article className="why-promise">
      <span className="why-glass-icon">
      <svg className="why-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8M16 4V2h3v4" />
      </svg>
      </span>
      <div>
      <h3>{t("Auch für kleine Aufträge.")}</h3>
      <p>{' '}{t("Einzelne Fenster, Wohnungen mit 1–4 Zimmern und kleine Umzüge sind willkommen.")}{' '}</p>
      </div>
      </article>
      <article className="why-promise">
      <span className="why-glass-icon">
      <svg className="why-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m5 12 4 4L19 6" />
      </svg>
      </span>
      <div>
      <h3>{t("Vorher klar vereinbart.")}</h3>
      <p>{' '}{t("Umfang und Preis besprechen wir vorab – ohne versteckte Zuschläge.")}{' '}</p>
      </div>
      </article>
      <article className="why-promise">
      <span className="why-glass-icon">
      <svg className="why-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 10 10 0 0 1-4-1l-6 2 2-6a10 10 0 0 1-1-4A8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" />
      <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </svg>
      </span>
      <div>
      <h3>{t("Einfach starten. Gut begleitet.")}</h3>
      <p>{' '}{t("Beginnen Sie im Rechner. Fragen und besondere Wünsche klären wir persönlich.")}{' '}</p>
      </div>
      </article>
      </div>
      <div className="why-assurances" aria-label={t("Garantie und Versicherungsschutz")}>
      <details className="why-assurance">
      <summary>
      <svg className="why-icon why-assurance-symbol" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z" />
      <path d="m8 12 3 3 5-6" />
      </svg>
      <span className="why-assurance-title">{' '}{t("Abnahmegarantie bei Umzugsreinigungen")}{' '}<span>{t("Für die vereinbarten Reinigungsarbeiten")}</span>
      </span>
      <span className="why-disclosure" aria-hidden="true">
      <svg className="why-icon" viewBox="0 0 24 24" focusable="false">
      <path d="M12 5v14M5 12h14" />
      </svg>
      </span>
      </summary>
      <p>{' '}{t("Die Abnahmegarantie gilt für den vorab vereinbarten Reinigungsumfang Ihrer Umzugsreinigung. Die Details besprechen wir bei der Planung.")}{' '}</p>
      </details>
      <details className="why-assurance">
      <summary>
      <svg className="why-icon why-assurance-symbol" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m5 12 4 4L19 6" />
      </svg>
      <span className="why-assurance-title">{' '}{t("Betriebshaftpflichtversichert")}{' '}<span>{t("Persönlich klären, was Ihnen wichtig ist")}</span>
      </span>
      <span className="why-disclosure" aria-hidden="true">
      <svg className="why-icon" viewBox="0 0 24 24" focusable="false">
      <path d="M12 5v14M5 12h14" />
      </svg>
      </span>
      </summary>
      <p>{' '}{t("Kraken verfügt über eine Betriebs­haftpflicht­versicherung. Fragen zum Versicherungs­schutz klären wir persönlich mit Ihnen.")}{' '}</p>
      </details>
      </div>
      <div className="why-process" aria-labelledby="why-process-title">
      <h3 id="why-process-title">{t("So einfach geht es.")}</h3>
      <ol className="why-process-steps">
      <li>{t("Im Rechner starten")}</li>
      <li>{t("Persönlich abstimmen")}</li>
      <li>{t("Arbeit erledigen lassen")}</li>
      </ol>
      </div>
      </div>
      </section>
  );
}
