import React from 'react';

type LogoProps = {
  className?: string;
};

export const FarfetchLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 1024 333.1" fill="currentColor" {...props}>
    <path d="M1024 333.1H842.3V196.3h-34.8c-28.7 0-51.9-23.2-51.9-51.9V0h268.4v333.1zM630.1 333.1H448.4V196.3h-34.8c-28.7 0-51.9-23.2-51.9-51.9V0h320.3v144.4c0 28.7-23.2 51.9-51.9 51.9h-50V333.1zM320.3 333.1H138.6V0h181.7v333.1zM0 333.1h181.7V144.4c0-28.7 23.2-51.9 51.9-51.9h50V0H0v333.1z"/>
  </svg>
);

export const MandarinOrientalLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 200 100" fill="currentColor" {...props}>
    <path d="M100,50 A50,50 0 0,0 100,50 L100,50 Z M50,50 A50,50 0 0,0 50,50 L50,50 Z" />
    <path d="M100 0 L100 50 M100 0 A 50 50 0 0 0 50 50 M100 0 A 50 50 0 0 1 150 50 M100 0 A 50 50 0 0 0 64.64 17.32 M100 0 A 50 50 0 0 1 135.36 17.32 M100 0 A 50 50 0 0 0 82.68 35.36 M100 0 A 50 50 0 0 1 117.32 35.36 M100 0 A 50 50 0 0 0 92.39 46.19 M100 0 A 50 50 0 0 1 107.61 46.19 M100 0 L100 50" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M50 50 A50,50 0 0,1 150,50" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);


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
