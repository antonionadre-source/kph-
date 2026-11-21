import React, { useId, useState } from 'react';
import { useTranslation } from '../i18n';
import { startServiceRequest } from '../src/content/serviceCatalog';
import { transitCopy, TRANSIT_REFERENCE, type TransitItem, type TransitScene, type TransitVariant } from '../src/content/transitCopy';

const SCENES: readonly TransitScene[] = ['furniture', 'room', 'studio'];
const COLORS: Record<TransitItem, string> = { sofa: '#5f9f94', table: '#b98f61', mattress: '#c6d4de', bed: '#d0aa7c', desk: '#7896a4', boxes: '#d5b37a' };
type Point = readonly [number, number, number];
const point = (x: number, y: number, z = 0) => `${90 + x * .72 + y * .55},${285 - x * .25 + y * .4 - z * .8}`;
const polygon = (points: readonly Point[]) => points.map(p => point(...p)).join(' ');
const shade = (color: string, amount: number) => '#' + [1, 3, 5].map(offset => Math.max(0, Math.min(255, parseInt(color.slice(offset, offset + 2), 16) + amount)).toString(16).padStart(2, '0')).join('');

/** Coordinates are drawing units, never vehicle measurements or capacity calculations. */
function Block({ x, y, z = 0, w, d, h, color }: { key?: number; x: number; y: number; z?: number; w: number; d: number; h: number; color: string }) {
  return <g stroke={shade(color, -35)} strokeWidth="1" strokeLinejoin="round">
    <polygon points={polygon([[x,y,z],[x,y+d,z],[x,y+d,z+h],[x,y,z+h]])} fill={shade(color,-18)} />
    <polygon points={polygon([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]])} fill={color} />
    <polygon points={polygon([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]])} fill={shade(color,24)} />
  </g>;
}
function Sofa({ x = 65, y = 70 }: { x?: number; y?: number }) {
  const color = COLORS.sofa;
  return <g><Block x={x} y={y} w={180} d={80} h={25} color={shade(color,-12)} /><Block x={x} y={y} z={25} w={180} d={18} h={52} color={color} /><Block x={x+17} y={y+20} z={25} w={71} d={57} h={14} color={color} /><Block x={x+92} y={y+20} z={25} w={71} d={57} h={14} color={color} /><Block x={x} y={y+18} z={25} w={16} d={62} h={34} color={color} /><Block x={x+164} y={y+18} z={25} w={16} d={62} h={34} color={color} /></g>;
}
function Desk({ x, y }: { x: number; y: number }) {
  return <g>{[[0,0],[90,0],[0,56],[90,56]].map(([dx,dy],index) => <g key={index}><Block x={x+dx} y={y+dy} w={8} d={8} h={67} color={COLORS.desk} /></g>)}<Block x={x-3} y={y-3} z={67} w={104} d={70} h={9} color="#bc9a71" /></g>;
}
function BedParts() { return <g>{[0,1,2,3].map(i => <g key={i}><Block x={50} y={42+i*10} z={i%2*6} w={185} d={8} h={13} color={COLORS.bed} /></g>)}</g>; }
function Mattress({ outside = false }: { outside?: boolean }) {
  const x = outside ? -100 : 25, y = outside ? 65 : 4;
  return <g><Block x={x} y={y} w={outside ? 145 : 195} d={20} h={105} color={COLORS.mattress} />{[1,2,3].map(i => <line key={i} x1={90+(x+i*36)*.72+(y+20)*.55} y1={285-(x+i*36)*.25+(y+20)*.4-8} x2={90+(x+i*36)*.72+(y+20)*.55} y2={285-(x+i*36)*.25+(y+20)*.4-76} stroke="#a6bac5" strokeWidth="1.5" />)}</g>;
}
function Boxes({ count }: { count: number }) {
  return <g>{Array.from({length:count},(_,i) => {
    const x=285+(i%2)*43, y=12+(Math.floor(i/2)%2)*43, z=Math.floor(i/4)*39;
    return <g key={i}><Block x={x} y={y} z={z} w={38} d={38} h={38} color={COLORS.boxes} /><polyline points={polygon([[x+19,y,z+38],[x+19,y+38,z+38],[x+19,y+38,z+8]])} fill="none" stroke="#edd4a4" strokeWidth="4" /></g>;
  })}</g>;
}
function Wheel({ x }: { x: number }) {
  return <g transform={`translate(${90+x*.72+110} ${285-x*.25+80}) matrix(.82 -.22 0 1 0 0)`}><circle r="31" fill="#17303f" /><circle r="21" fill="#374f5c" /><circle r="13" fill="#ccd6da" /><circle r="5" fill="#637d88" /></g>;
}
function VanScene({ scene, title, description, uid, roofHeight }: { scene: TransitScene; title: string; description: string; uid: string; roofHeight: number }) {
  return <svg viewBox="0 0 760 460" role="img" aria-labelledby={`${uid}-title ${uid}-desc`} className="block h-auto w-full" focusable="false">
    <title id={`${uid}-title`}>{title}</title><desc id={`${uid}-desc`}>{description}</desc>
    <defs><linearGradient id={`${uid}-floor`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#c8ddd7" /><stop offset="1" stopColor="#e0ebe5" /></linearGradient><linearGradient id={`${uid}-glass`} x1="0" x2="1"><stop stopColor="#31596b" /><stop offset="1" stopColor="#7398aa" /></linearGradient></defs>
    <ellipse cx="380" cy="345" rx="292" ry="42" fill="#032b59" opacity=".07" transform="rotate(-12 380 345)" />
    {/* Far wall, roof line and floor make the cutaway cargo space visible. */}
    <polygon points={polygon([[0,0,0],[410,0,0],[410,0,roofHeight],[0,0,roofHeight]])} fill="#f6f9f8" stroke="#a6b9bf" strokeWidth="2" />
    <path d={`M${point(0,0,roofHeight)} L${point(410,0,roofHeight)} L${point(410,200,roofHeight)} L${point(0,200,roofHeight)}`} fill="none" stroke="#6fa99f" strokeWidth="2" strokeDasharray="7 7" opacity=".7" />
    <polygon points={polygon([[0,0,0],[410,0,0],[410,200,0],[0,200,0]])} fill={`url(#${uid}-floor)`} stroke="#93b5aa" strokeWidth="2" />
    {[50,100,150,200,250,300,350].map(x => <line key={x} x1={90+x*.72} y1={285-x*.25} x2={200+x*.72} y2={365-x*.25} stroke="#b4cfc3" strokeWidth="1" />)}
    {/* Front bulkhead and the sloped cab distinguish a cargo van from a box. */}
    <polygon points={polygon([[410,0,0],[410,200,0],[410,200,roofHeight],[410,0,roofHeight]])} fill="#e3ebed" stroke="#9fb2ba" strokeWidth="2" />
    <polygon points={polygon([[410,0,roofHeight],[535,0,190],[535,200,190],[410,200,roofHeight]])} fill="#ffffff" stroke="#9fb2ba" strokeWidth="2" />
    <polygon points={polygon([[535,0,190],[575,0,105],[575,200,105],[535,200,190]])} fill={`url(#${uid}-glass)`} stroke="#7393a3" strokeWidth="2" />
    <polygon points={polygon([[575,0,105],[620,0,75],[620,200,75],[575,200,105]])} fill="#f7faf9" stroke="#aabcc3" strokeWidth="2" />
    <polygon points={polygon([[410,200,0],[620,200,0],[620,200,75],[575,200,105],[535,200,190],[410,200,roofHeight]])} fill="#f7faf9" stroke="#9fb2ba" strokeWidth="2" />
    <polygon points={polygon([[430,200,112],[545,200,112],[523,200,174],[430,200,174]])} fill="#416779" stroke="#294e61" strokeWidth="2" />
    <polyline points={polygon([[425,200,12],[425,200,181],[523,200,181],[560,200,96],[560,200,20]])} fill="none" stroke="#bbcad0" strokeWidth="1.5" />
    <line x1={90+438*.72+110} y1={285-438*.25+80-80} x2={90+461*.72+110} y2={285-461*.25+80-80} stroke="#667f8b" strokeWidth="4" strokeLinecap="round" />
    <polygon points={polygon([[620,0,0],[620,200,0],[620,200,75],[620,0,75]])} fill="#dfe7eb" stroke="#9fb2ba" strokeWidth="2" />
    <polygon points={polygon([[620,40,25],[620,160,25],[620,160,55],[620,40,55]])} fill="#254756" />
    <polygon points={polygon([[620,10,57],[620,35,57],[620,35,71],[620,10,71]])} fill="#fff5c8" />
    <polygon points={polygon([[620,165,57],[620,193,57],[620,193,71],[620,165,71]])} fill="#fff5c8" />
    <polygon points={polygon([[620,0,0],[620,200,0],[620,200,16],[620,0,16]])} fill="#607986" />
    {/* The inventory changes with the selected example; no capacity is calculated. */}
    {scene === 'room' ? <g><Mattress /><BedParts /><Boxes count={6} /><Desk x={255} y={117} /></g> : <g>{scene === 'studio' && <BedParts />}<Boxes count={scene === 'studio' ? 10 : 4} /><Sofa />{scene === 'furniture' && <Block x={292} y={128} w={58} d={48} h={54} color={COLORS.table} />}</g>}
    {/* Low near-side rail and open rear frame communicate the cutaway view. */}
    <polygon points={polygon([[0,200,0],[410,200,0],[410,200,25],[0,200,25]])} fill="#eaf0ef" stroke="#a4b9bf" strokeWidth="2" />
    <polyline points={polygon([[0,0,0],[0,0,roofHeight],[0,200,roofHeight],[0,200,0]])} fill="none" stroke="#edf3f1" strokeWidth="9" strokeLinejoin="round" />
    <polyline points={polygon([[0,0,0],[0,0,roofHeight],[0,200,roofHeight],[0,200,0]])} fill="none" stroke="#a1b7bc" strokeWidth="1.5" strokeLinejoin="round" />
    <Wheel x={98} /><Wheel x={535} />
    {scene === 'studio' && <g><Mattress outside /><Desk x={-135} y={178} /></g>}
  </svg>;
}

export default function TransitLoadPlanner({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { language } = useTranslation();
  const copy = transitCopy(language);
  const [scene, setScene] = useState<TransitScene>('furniture');
  const [variant, setVariant] = useState<TransitVariant>('L3H2');
  const reference = TRANSIT_REFERENCE[variant];
  const number = (value: number) => new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(value);
  const range = (values: readonly [number, number]) => `${number(values[0])}–${number(values[1])}`;
  const uid = useId().replace(/:/g,'');
  const selected = copy.scenes[scene];
  const tabId = (value: TransitScene) => `${uid}-tab-${value}`;
  const chooseTab = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowRight' ? (index+1)%SCENES.length : event.key === 'ArrowLeft' ? (index+SCENES.length-1)%SCENES.length : event.key === 'Home' ? 0 : event.key === 'End' ? SCENES.length-1 : -1;
    if (next < 0) return;
    event.preventDefault(); setScene(SCENES[next]); event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`#${tabId(SCENES[next])}`)?.focus();
  };
  return <section id="ford-transit" aria-labelledby={`${uid}-heading`} className="kraken-transit kraken-section scroll-mt-28 bg-[#f3f7fc]">
    <div className="kraken-container">
      <header className="mb-7 max-w-3xl"><p className="mb-3 text-sm font-semibold text-[#1464ad]">{copy.eyebrow}</p><h2 id={`${uid}-heading`} className="text-3xl font-semibold leading-tight tracking-tight text-[#032b59] sm:text-4xl">{copy.title}</h2><p className="mt-4 text-base leading-relaxed text-[#50647c]">{copy.intro}</p></header>
      <div role="tablist" aria-label={copy.tabs} className="mb-5 flex w-full max-w-2xl flex-wrap gap-2">{SCENES.map((value,index) => <button key={value} id={tabId(value)} type="button" role="tab" aria-selected={scene===value} aria-controls={`${uid}-panel`} tabIndex={scene===value?0:-1} onKeyDown={event=>chooseTab(event,index)} onClick={()=>setScene(value)} className={`min-h-11 min-w-0 flex-1 rounded-xl border px-2 py-3 text-sm sm:px-3 sm:text-base whitespace-nowrap font-semibold transition-colors ${scene===value?'border-[#1464ad] bg-[#1464ad] text-white':'border-[#dce5f0] bg-white text-[#032b59] hover:bg-[#edf4fd]'}`}>{copy.scenes[value].tab}</button>)}</div>
      <div className="mb-5 flex flex-wrap items-center gap-3"><p className="text-sm font-medium text-[#50647c]">{copy.specs.compare}</p><div role="group" aria-label={copy.specs.compare} className="inline-flex gap-1 rounded-xl border border-[#dce5f0] bg-white p-1">{(['L3H2','L3H3'] as const).map(value => <button key={value} type="button" aria-pressed={variant===value} onClick={()=>setVariant(value)} className={`min-h-11 rounded-lg px-4 py-2 text-base font-semibold transition-colors ${variant===value?'bg-[#032b59] text-white':'text-[#032b59] hover:bg-[#edf4fd]'}`}>{value}</button>)}</div></div>
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={tabId(scene)} tabIndex={0} className="grid min-w-0 overflow-hidden rounded-3xl border border-[#dce5f0] bg-white lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,1fr)]">
        <figure className="flex min-w-0 flex-col justify-center bg-[#eef5f2] p-2 sm:p-5"><VanScene scene={scene} roofHeight={reference.drawingRoof} title={`${copy.diagram} · ${variant}`} description={`${selected.title} ${selected.items.map(item=>item.label).join(', ')}. ${selected.note}`} uid={uid} /><div className="px-3 pb-4"><p className="mb-3 text-sm font-semibold text-[#032b59]">{variant} · {copy.specs.title}</p><dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[
          [copy.specs.length, `≈ ${number(TRANSIT_REFERENCE.length)} m`],
          [copy.specs.width, `≈ ${number(TRANSIT_REFERENCE.width)} m`],
          [copy.specs.arches, `≈ ${number(TRANSIT_REFERENCE.arches)} m`],
          [copy.specs.height, `${range(reference.height)} m`],
          [copy.specs.volume, `${range(reference.volume)} m³`],
        ].map(([label,value]) => <div key={label} className="min-w-0 rounded-xl border border-[#dce5f0] bg-white px-3 py-2"><dt className="text-sm leading-snug text-[#50647c]">{label}</dt><dd className="mt-1 text-base font-semibold tabular-nums text-[#032b59]">{value}</dd></div>)}</dl><p className="mt-3 text-sm leading-relaxed text-[#50647c]">{copy.specs.note}</p><p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#50647c]"><a href="https://www.fr.ford.ch/content/dam/guxeu/ch/fr_ch/documents/feature-pdfs/FT-Transit_Vans_17.5.pdf" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{copy.specs.source}</a></p></div><figcaption className="px-3 pb-3 text-sm leading-relaxed text-[#50647c]">Ford Transit · {selected.note}</figcaption></figure>
        <div className="min-w-0 p-5 sm:p-7"><p className="text-sm font-medium text-[#1464ad]">{copy.inventory}</p><h3 className="mt-2 text-2xl font-semibold leading-tight text-[#032b59]">{selected.title}</h3><p className="mt-3 text-base leading-relaxed text-[#50647c]">{selected.description}</p><ul className="my-5 space-y-3">{selected.items.map(item=><li key={item.id} className="flex items-start gap-3 text-base text-[#032b59]"><span aria-hidden="true" style={{backgroundColor:COLORS[item.id]}} className="mt-1 h-4 w-4 shrink-0 rounded border border-[#032b59]/10" /><span>{item.label}</span></li>)}</ul><p className="text-sm leading-relaxed text-[#50647c]">{copy.contactHint}</p></div>
      </div>
      <div className="mt-5 flex flex-col items-start gap-5"><p className="max-w-3xl text-sm leading-relaxed text-[#50647c]">{copy.caution}</p><div className="flex shrink-0 flex-col gap-2 sm:flex-row"><button type="button" onClick={()=>startServiceRequest('moving-furniture',onNavigate)} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1464ad] px-5 py-3 text-base font-semibold text-white hover:bg-[#0c4f92]">{copy.cta}</button><button type="button" onClick={()=>onNavigate('/kontakt?service=moving-furniture&inventory='+scene+'&variant='+variant)} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#dce5f0] bg-white px-5 py-3 text-base font-semibold text-[#032b59] hover:bg-[#edf4fd]">{copy.contact}</button></div></div>
    </div>
  </section>;
}
