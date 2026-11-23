import React, { useId } from 'react';
import { KRAKEN_VEHICLE, VAN_LOAD_ITEMS } from '../../src/vehicle';
import type { HomeLanguage } from './homeTranslations';

type Translate = (source: string, params?: Record<string, string | number>) => string;
const project = (x: number, y: number, z = 0) => [300 + (x - y) * .88, 444 - (x + y) * .35 - z * 1.3];
const points = (vertices: number[][]) => vertices.map(([x, y, z = 0]) => project(x, y, z).join(',')).join(' ');

/** The load-space geometry follows the stated interior dimensions; not a vehicle photograph. */
export function TransitCargoVisual({ language }: { language: HomeLanguage }) {
  const gradient = 'cargo-floor-' + useId().replace(/:/g, '');
  const format = (value: number) => new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(value);
  const { lengthCm: l, widthCm: w, heightCm: h, betweenWheelArchesCm: clear } = KRAKEN_VEHICLE.interior;
  const door = KRAKEN_VEHICLE.rearDoor;
  const inset = (w - clear) / 2;
  return <svg className="transit-cargo-svg" viewBox="0 0 640 550" aria-hidden="true">
    <defs><linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#27627d" /><stop offset="1" stopColor="#143d5c" /></linearGradient></defs>
    <ellipse cx="330" cy="459" rx="225" ry="39" fill="#00162d" opacity=".27" />
    <polygon points={points([[0,w],[l,w],[l,w,h],[0,w,h]])} fill="#53849a" fillOpacity=".28" stroke="#8bb6c8" strokeWidth="1.5" />
    <polygon points={points([[l,0],[l,w],[l,w,h],[l,0,h]])} fill="#7196a5" fillOpacity=".25" stroke="#8bb6c8" strokeWidth="1.5" />
    <polygon points={points([[0,0],[l,0],[l,w],[0,w]])} fill={`url(#${gradient})`} stroke="#c5e6ed" strokeWidth="2" />
    <polygon points={points([[0,inset],[l,inset],[l,inset+clear],[0,inset+clear]])} fill="#9cf5c7" fillOpacity=".08" stroke="#9cf5c7" strokeDasharray="5 5" />
    <g className="transit-cargo-items">
      {[...VAN_LOAD_ITEMS].sort((a,b) => b.x+b.y-a.x-a.y).map(item => {
        const { x, z, lengthCm: a, widthCm: b, heightCm: c } = item;
        const y = item.y + inset;
        const shades = item.kind === 'box' ? ['#d0a778','#ae7e50','#e8c79e'] : item.kind === 'chair' ? ['#72b7b7','#3d828e','#a5d9cc'] : ['#e5e6df','#aabbb8','#fffdf2'];
        if (item.kind === 'chair') return <g key={item.id} className={`transit-cargo-level transit-cargo-level-${item.step}`}>
          {[[x,y],[x+a,y],[x,y+b],[x+a,y+b]].map(([u,v],index)=><polyline key={index} points={points([[u,v,z],[u,v,z+45]])} stroke="#84bdb9" strokeWidth="5" />)}
          <polygon points={points([[x,y,z+45],[x+a,y,z+45],[x+a,y+b,z+45],[x,y+b,z+45]])} fill="#aad9c9" stroke="#276575" strokeWidth="2" />
          <polygon points={points([[x+a,y,z+45],[x+a,y+b,z+45],[x+a,y+b,z+c],[x+a,y,z+c]])} fill="#69a6ac" stroke="#b3e0cf" strokeWidth="2" />
        </g>;
        return <g key={item.id} className={`transit-cargo-level transit-cargo-level-${item.step}`}>
          <polygon points={points([[x,y,z],[x+a,y,z],[x+a,y,z+c],[x,y,z+c]])} fill={shades[0]} stroke="#153d50" strokeWidth="1" />
          <polygon points={points([[x,y,z],[x,y+b,z],[x,y+b,z+c],[x,y,z+c]])} fill={shades[1]} stroke="#153d50" strokeWidth="1" />
          <polygon points={points([[x,y,z+c],[x+a,y,z+c],[x+a,y+b,z+c],[x,y+b,z+c]])} fill={shades[2]} stroke="#153d50" strokeWidth="1" />
          {item.kind === 'box' && <path d={(() => { const a=project(x+item.lengthCm*.5,y,z+c),b=project(x+item.lengthCm*.5,y+item.widthCm,z+c);return `M${a.join(' ')}L${b.join(' ')}`; })()} stroke="#937453" strokeWidth="2" opacity=".75" />}
        </g>;
      })}
    </g>
    <polyline points={points([[0,0,h],[l,0,h],[l,w,h],[0,w,h],[0,0,h],[0,0],[0,w],[0,w,h]])} fill="none" stroke="#e3f3f4" strokeWidth="2.5" strokeLinejoin="round" />
    <polygon points={points([[0,(w-door.widthCm)/2,0],[0,(w+door.widthCm)/2,0],[0,(w+door.widthCm)/2,door.heightCm],[0,(w-door.widthCm)/2,door.heightCm]])} fill="none" stroke="#9cf5c7" strokeWidth="2.5" strokeDasharray="8 5" />
    <g className="transit-cargo-measurements" fill="#d9fff1" fontSize="20" fontWeight="700">
      <path d="M310 475 546 382M309 468v14m238-107v14M558 346V157m-7 0h14m-14 189h14M134 385 278 444" stroke="#9cf5c7" strokeWidth="1.5" fill="none" />
      <text x="435" y="451">{format(l)} cm</text><text x="568" y="260" transform="rotate(-90 568 260)">{format(h)} cm</text><text x="102" y="435">{format(w)} cm</text>
    </g>
    <g fill="#b9d4df" fontSize="15"><text x="300" y="515" textAnchor="middle">{format(l)} × {format(w)} × {format(h)} cm</text></g>
  </svg>;
}

export function TransitCustomExterior() {
  const id = 'transit-body-' + useId().replace(/:/g, '');
  return <svg className="transit-exterior-svg" viewBox="0 0 700 430" aria-hidden="true">
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff" /><stop offset=".7" stopColor="#e2eced" /><stop offset="1" stopColor="#b0c3cc" /></linearGradient></defs>
    <ellipse cx="368" cy="339" rx="275" ry="37" fill="#00172e" opacity=".38" />
    <path d="M92 286 109 213 174 121q17-19 51-19h337q31 0 43 23l23 159-12 24H96Z" fill={`url(#${id})`} stroke="#88a5b7" strokeWidth="2" />
    <path d="m181 129-55 78 129-3 21-75Z" fill="#163e5b" stroke="#7ea6b7" strokeWidth="3" />
    <path d="m289 128-18 76 48-1v-75Z" fill="#34647b" />
    <path d="M337 118v165m207-165v165M109 219l517-1" fill="none" stroke="#a3bac6" strokeWidth="2" />
    <path d="m102 251 70-6-4 28-71 9Z" fill="#effcff" stroke="#91acb9" /><path d="M605 185h15l7 61h-18Z" fill="#ce665c" />
    <path d="M94 285h527v24H94Z" fill="#28465b" /><path d="m114 237 48-4" stroke="#38566c" strokeWidth="10" />
    <rect x="338" y="218" width="24" height="7" rx="3" fill="#486775" /><rect x="286" y="216" width="19" height="7" rx="3" fill="#486775" />
    {[212,539].map(x=><g key={x}><circle cx={x} cy="302" r="45" fill="#0b2133" /><circle cx={x} cy="302" r="25" fill="#879fae" /><circle cx={x} cy="302" r="15" fill="#d5e2e7" /><circle cx={x} cy="302" r="5" fill="#3c5669" /></g>)}
    <svg x="368" y="151" width="139" height="60" viewBox="4 283 1016 436"><image href="/home-approved/assets/logo.webp" width="1024" height="1024" /></svg>
    <path d="M178 125h385" stroke="#fff" strokeWidth="4" opacity=".7" />
    <text x="367" y="389" textAnchor="middle" fill="#d3eced" fontSize="19" fontWeight="600">{KRAKEN_VEHICLE.model} · {KRAKEN_VEHICLE.variant}</text>
  </svg>;
}

export function TransitSpecifications({ t, language }: { t: Translate; language: HomeLanguage }) {
  const format = (value: number) => new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(value);
  const vehicle = KRAKEN_VEHICLE;
  return <section className="transit-specifications" aria-labelledby="transit-specs-title">
    <div className="transit-specifications-heading"><div><p className="eyebrow">{t('Kurzer Radstand. Normales Dach.')}</p><h3 id="transit-specs-title">{vehicle.model} · {vehicle.variant}</h3></div><span className="transit-volume-badge">≈ {vehicle.volumeM3} m³</span></div>
    <dl className="transit-spec-grid">
      <div><dt>{t('Nutzlänge bis zur Trennwand')}</dt><dd>{format(vehicle.interior.lengthCm)} <span>cm</span></dd></div>
      <div><dt>{t('Maximale Innenbreite')}</dt><dd>{format(vehicle.interior.widthCm)} <span>cm</span></dd></div>
      <div><dt>{t('Zwischen den Radkästen')}</dt><dd>{format(vehicle.interior.betweenWheelArchesCm)} <span>cm</span></dd></div>
      <div><dt>{t('Innenhöhe')}</dt><dd>{format(vehicle.interior.heightCm)} <span>cm</span></dd></div>
      <div><dt>{t('Hecktür: Breite × Höhe')}</dt><dd>≈ {format(vehicle.rearDoor.widthCm)} × {format(vehicle.rearDoor.heightCm)} <span>cm</span></dd></div>
      <div><dt>{t('Ladevolumen')}</dt><dd>≈ {vehicle.volumeM3} <span>m³</span></dd></div>
    </dl>
    <p className="transit-spec-note">{t('Nennmasse des L1H1. Verkleidung, Verpackung und Ladungssicherung brauchen zusätzlichen Platz.')}</p>
    <a className="transit-source" href="https://www.fordpresse.be/content/old/2012_pdf_2012_ford_transit_custom_nl.pdf#page=46" target="_blank" rel="noopener noreferrer">{t('Technische Daten von Ford')}</a>
  </section>;
}
