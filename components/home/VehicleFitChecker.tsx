import React, { useId, useState } from 'react';
import { assessCargoItem, KRAKEN_VEHICLE } from '../../src/vehicle';
import type { HomeLanguage } from './homeTranslations';

type Translate = (source: string, params?: Record<string, string | number>) => string;
const examples = [
  { source: 'Kompaktes Sofa', lengthCm: 200, widthCm: 85, heightCm: 90 },
  { source: 'Zerlegte Möbelteile', lengthCm: 200, widthCm: 60, heightCm: 8 },
  { source: 'Grosse Matratze', lengthCm: 200, widthCm: 160, heightCm: 20 },
] as const;

export function VehicleFitChecker({ t, language }: { t: Translate; language: HomeLanguage }) {
  const id = 'cargo-fit-' + useId().replace(/:/g, '');
  const [values, setValues] = useState({ lengthCm: '', widthCm: '', heightCm: '' });
  const [result, setResult] = useState<ReturnType<typeof assessCargoItem> | null>(null);
  const format = (value: number) => new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(value);
  return <section className="transit-fit-checker" aria-labelledby={id}>
    <div><p className="eyebrow">{t('Ein Möbelstück. Ein erster Grössencheck.')}</p><h3 id={id}>{t('Passt es durch die Hecktür?')}</h3><p className="transit-fit-intro">{t('Geben Sie die Aussenmasse einschliesslich Verpackung in Zentimetern ein. Wir prüfen gerade Ladepositionen, auch gedreht.')}</p></div>
    <div className="transit-fit-examples" role="group" aria-label={t('Beispielmasse einsetzen')}>
      {examples.map(example=><button type="button" key={example.source} onClick={()=>{const {source,...dimensions}=example;setValues({ lengthCm:String(dimensions.lengthCm),widthCm:String(dimensions.widthCm),heightCm:String(dimensions.heightCm) });setResult(assessCargoItem(dimensions));}}>{t(example.source)}</button>)}
    </div>
    <form noValidate onSubmit={event=>{event.preventDefault();setResult(assessCargoItem({lengthCm:Number(values.lengthCm),widthCm:Number(values.widthCm),heightCm:Number(values.heightCm)}));}}>
      <div className="transit-fit-inputs">{(['lengthCm','widthCm','heightCm'] as const).map((key,index)=><label key={key} htmlFor={`${id}-${key}`}><span>{t(['Länge (cm)','Breite (cm)','Höhe (cm)'][index])}</span><input id={`${id}-${key}`} type="number" inputMode="decimal" min="0.1" max="10000" step="0.1" value={values[key]} onChange={event=>{setValues(previous=>({...previous,[key]:event.target.value}));setResult(null);}} placeholder={String([200,85,90][index])} /></label>)}</div>
      <button className="button button-mint transit-fit-submit" type="submit">{t('Masse prüfen')}</button>
    </form>
    {result && <div className={`transit-fit-result transit-fit-${result.status}`} role="status">
      <strong>{t(result.status==='fits' ? 'Eine gerade Ladeposition ist geometrisch möglich.' : result.status==='review' ? 'Bitte persönlich prüfen oder das Möbel zerlegen.' : 'Bitte drei gültige positive Masse eingeben.')}</strong>
      {result.status==='fits' && result.orientation && <p>{t('Mögliche Lage: {length} × {width} × {height} cm (Länge × Breite × Höhe).', {length:format(result.orientation.lengthCm),width:format(result.orientation.widthCm),height:format(result.orientation.heightCm)})}</p>}
      {result.status==='review' && <p>{t('Die einfache Prüfung findet keine passende gerade Lage. Diagonales Laden, Zerlegen und besondere Formen müssen wir vor Ort beurteilen.')}</p>}
      {result.status!=='invalid' && <p>{t('Dies ist keine Transportzusage. Gewicht, Zugänge, Verpackung, Stapelbarkeit und Befestigung werden persönlich bestätigt.')}</p>}
    </div>}
    <p className="transit-fit-method">{t('Geprüft wird nur ein einzelnes Möbelstück, nicht der restliche Platz des Ladebeispiels. Die Prüfung nutzt die engere Bodenbreite und die Hecktüröffnung mit {margin} cm Abstand auf jeder Seite. Sie berechnet keine Nutzlast und keinen Preis.', {margin:KRAKEN_VEHICLE.clearanceCm})}</p>
    <a className="transit-fit-continue" href="/quote" data-service="moving" data-calculator="">{t('Eigenen Umzug im Rechner vorbereiten')}</a>
  </section>;
}
