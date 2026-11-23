import React, { useId } from 'react';

type LogoPlacement = { x: number; y: number; width: number; skewY?: number };

const stages: { name: string; alignment: readonly number[]; logos: LogoPlacement[] }[] = [
  {
    name: 'empty',
    alignment: [1, 0, 0, 1, 0, 0],
    logos: [{ x: 220, y: 465, width: 190, skewY: -11 }],
  },
  {
    name: 'boxes',
    alignment: [1.00333036, .00563575, .00581510, 1.02729445, 19.23520869, -28.30481045],
    logos: [
      { x: 222, y: 480, width: 175, skewY: -11 },
      { x: 632, y: 516, width: 60 },
      { x: 565, y: 608, width: 82 },
      { x: 711, y: 637, width: 76 },
      { x: 575, y: 690, width: 65 },
      { x: 580, y: 793, width: 112 },
      { x: 745, y: 763, width: 68 },
    ],
  },
  {
    name: 'chairs',
    alignment: [.96978797, .00322812, .00756068, 1.00732911, 31.68823340, -34.26962387],
    logos: [
      { x: 220, y: 495, width: 175, skewY: -11 },
      { x: 638, y: 528, width: 55 },
      { x: 569, y: 596, width: 87 },
      { x: 560, y: 680, width: 65 },
      { x: 717, y: 638, width: 66 },
      { x: 580, y: 815, width: 100 },
      { x: 727, y: 730, width: 50 },
    ],
  },
  {
    name: 'furniture',
    alignment: [.95770243, .00433985, .00546272, .99998703, 20.54903271, -43.97785167],
    logos: [
      { x: 236, y: 503, width: 175, skewY: -10.7 },
      { x: 647, y: 547, width: 52 },
      { x: 587, y: 628, width: 80 },
      { x: 726, y: 655, width: 68 },
      { x: 577, y: 724, width: 50 },
      { x: 601, y: 826, width: 100 },
      { x: 713, y: 745, width: 45 },
    ],
  },
];

function OriginalLogo({ x, y, width, skewY = 0 }: LogoPlacement) {
  return <g transform={`translate(${x} ${y}) skewY(${skewY})`}>
    <svg width={width} height={width * 445 / 1024} viewBox="0 280 1024 445">
      <image href="/home-approved/assets/logo.webp" width="1024" height="1024" />
    </svg>
  </g>;
}

/** One fixed body outside the crossfade prevents any vehicle-size or edge changes. */
export function TransitLoadingVehicle() {
  return <>
    <img className="transit-cargo-vehicle" src="/transit-quality/transit-empty-v1.webp" width="1254" height="1254" loading="lazy" decoding="async" alt="" aria-hidden="true" />
    <svg className="transit-cargo-vehicle-branding" viewBox="0 0 1254 1254" aria-hidden="true" focusable="false">
      <OriginalLogo {...stages[0].logos[0]} />
    </svg>
  </>;
}

// This opening is inset from the fixed door jambs and loading threshold.
const cargoOpening = 'M582 267 C685 262 863 270 973 283 Q1013 288 1023 321 L1037 842 Q1037 879 1018 891 L575 904 L564 614 L560 391 L564 305 Q565 277 582 267Z';

/** Only the cargo bay changes; photos and carton logos share the same registration. */
export default function TransitLoadingVisual() {
  const clipId = 'transit-cargo-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return <>
    <svg className="transit-cargo-clip-definitions" width="0" height="0" aria-hidden="true" focusable="false">
      <defs><clipPath id={clipId} clipPathUnits="objectBoundingBox"><path d={cargoOpening} transform={`scale(${1 / 1254})`} /></clipPath></defs>
    </svg>
    {stages.map((stage, index) => {
      const [a, b, c, d, x, y] = stage.alignment;
      const transform = `translate(${x / 1254 * 100}%, ${y / 1254 * 100}%) matrix(${a}, ${b}, ${c}, ${d}, 0, 0)`;
      return <div key={stage.name} className="transit-cargo-photo" data-cargo-photo={index} style={{ clipPath: `url(#${clipId})` }}>
        <div className="transit-cargo-aligned" style={{ transform }}>
          <img src={`/transit-quality/transit-${stage.name}-v1.webp`} width="1254" height="1254" loading="lazy" decoding="async" alt="" aria-hidden="true" />
          <svg className="transit-cargo-branding" viewBox="0 0 1254 1254" aria-hidden="true" focusable="false">
            <g data-brand-stage={index}>
              {stage.logos.slice(1).map((placement, logoIndex) => <g key={logoIndex}><OriginalLogo {...placement} /></g>)}
            </g>
          </svg>
        </div>
      </div>;
    })}
  </>;
}
