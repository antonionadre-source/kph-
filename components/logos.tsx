import React from 'react';

type LogoProps = {
  className?: string;
};

export const FarfetchLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 1024 333.1" fill="currentColor" {...props}>
    <path d="M1024 333.1H842.3V196.3h-34.8c-28.7 0-51.9-23.2-51.9-51.9V0h268.4v333.1zM630.1 333.1H448.4V196.3h-34.8c-28.7 0-51.9-23.2-51.9-51.9V0h320.3v144.4c0 28.7-23.2 51.9-51.9 51.9h-50V333.1zM320.3 333.1H138.6V0h181.7v333.1zM0 333.1h181.7V144.4c0-28.7 23.2-51.9 51.9-51.9h50V0H0v333.1z"/>
  </svg>
);

export const MandarinOrientalLogo: React.FC<LogoProps> = (props) => {
  const fanBlades = 11;
  const radius = 50;
  const center = { x: 100, y: 50 };

  const paths = Array.from({ length: fanBlades }).map((_, i) => {
    const angle = (i / (fanBlades - 1)) * 180; // Spread from 0 to 180 degrees
    const rad = (angle - 90) * (Math.PI / 180); // Convert to radians and adjust for SVG coordinate system
    const endX = center.x + radius * Math.cos(rad);
    const endY = center.y + radius * Math.sin(rad);
    return `M${center.x},${center.y} L${endX},${endY}`;
  });

  return (
    <svg viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d={`M${center.x - radius},${center.y} A${radius},${radius} 0 0 1 ${center.x + radius},${center.y}`} />
      {paths.map((path, index) => <path key={index} d={path} />)}
    </svg>
  );
};


export const AldersgateLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 300 100" fill="none" stroke="currentColor" strokeWidth="4" {...props}>
    <path d="M50,50 C100,0 150,100 200,50 C250,0 200,100 250,50" />
    <path d="M40,50 C90,10 140,90 190,50 C240,10 190,90 240,50" />
    <path d="M30,50 C80,20 130,80 180,50 C230,20 180,80 230,50" />
  </svg>
);

export const PrimeraLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
    <path d="M20,20 h60 v60 h-20 v-40 h-20 v40 h-20 z" />
  </svg>
);

export const AmbassadorHotelLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 400 50" fill="currentColor" {...props}>
    <text x="0" y="40" fontFamily="serif" fontSize="50" fontWeight="bold">AMBASSADOR</text>
  </svg>
);

export const BasqueTradeLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
    <path d="M50,10 L60,40 L90,40 L65,60 L75,90 L50,70 L25,90 L35,60 L10,40 L40,40 Z" />
  </svg>
);