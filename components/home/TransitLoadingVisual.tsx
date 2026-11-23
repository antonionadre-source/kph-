import React from 'react';

type LogoPlacement = { x: number; y: number; width: number; skewY?: number };

const stages: { name: string; logos: LogoPlacement[] }[] = [
  {
    name: 'empty',
    logos: [{ x: 220, y: 465, width: 190, skewY: -11 }],
  },
  {
    name: 'boxes',
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

/** Separate high-resolution photographs retain detail at every loading stage. */
export default function TransitLoadingVisual() {
  return <>
    {stages.map((stage, index) => <img
      key={stage.name}
      className="transit-cargo-photo"
      data-cargo-photo={index}
      src={`/transit-quality/transit-${stage.name}-v1.webp`}
      width="1254"
      height="1254"
      loading="lazy"
      decoding="async"
      alt=""
      aria-hidden="true"
    />)}
    <svg className="transit-cargo-branding" viewBox="0 0 1254 1254" aria-hidden="true" focusable="false">
      {stages.map((stage, index) => <g key={stage.name} data-brand-stage={index}>
        {stage.logos.map((placement, logoIndex) => <OriginalLogo key={logoIndex} {...placement} />)}
      </g>)}
    </svg>
  </>;
}
