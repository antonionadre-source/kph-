import React from 'react';
import { useTranslation } from '../i18n';

interface Section7GruenderProps {
  onNavigate?: (path: string) => void;
}

export default function Section7Gruender({ onNavigate }: Section7GruenderProps) {
  const { language } = useTranslation();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const getT = () => {
    switch (language) {
      case 'en':
        return {
          badge: 'Hands-on Experience in Focus',
          title: 'Who is behind Kraken PFM — Leadership through practical expertise',
          p1: 'Founder Antonio Gomes brings 11 years of solid experience in international facility management. His career started directly at the grassroots level as a cleaner in London. Through roles as Building Manager of the 200 Aldersgate office complex in the City of London and Head of Sales for an FM company in Manchester, he gathered extensive know-how in building operations, logistics, and quality control. Prior to founding Kraken PFM, he managed commercial accounts in Zurich and Schaffhausen.',
          p2: 'Whoever has performed the work from the ground up knows the crucial details for flawless results. Our friendly octopus mascot Kai, inspired by the Rhine Falls, symbolizes this exact approach: hands-on care over hot air.',
          link: 'Learn more about Antonio Gomes & the story of Kraken PFM →'
        };
      case 'fr':
        return {
          badge: 'L\'expérience du terrain à l\'honneur',
          title: 'Qui se trouve derrière Kraken PFM — Une direction ancrée dans le terrain',
          p1: 'Le fondateur Antonio Gomes cumule 11 ans d\'expérience solide dans le facility management international. Sa carrière a débuté sur le terrain comme agent de nettoyage à Londres. Occupant des postes de Building Manager pour le complexe 200 Aldersgate à la City de Londres et Directeur Commercial d\'une entreprise de FM à Manchester, il a acquis une expertise approfondie dans l\'exploitation immobilière et le contrôle qualité.',
          p2: 'Toute personne ayant pratiqué le travail depuis les bases connaît les détails décisifs pour un résultat irréprochable. Notre pieuvre mascotte Kai, inspirée des chutes du Rhin, symbolise précisément cette approche : du soin concret plutôt que des paroles vaines.',
          link: 'En savoir plus sur Antonio Gomes & l\'histoire de Kraken PFM →'
        };
      case 'it':
        return {
          badge: 'Esperienza Pratica al Centro',
          title: 'Chi c\'è dietro Kraken PFM — Leadership basata su know-how pratico',
          p1: 'Il fondatore Antonio Gomes vanta 11 anni di solida esperienza nel facility management internazionale. La sua carriera è iniziata proprio dalle basi come addetto alle pulizie a Londra. Attraverso incarichi come Building Manager del complesso 200 Aldersgate a Londra e Head of Sales di un\'azienda di FM a Manchester, ha sviluppato un vasto know-how in gestione degli immobili e controllo qualità.',
          p2: 'Chi ha svolto il lavoro partendo da zero conosce i dettagli decisivi per un risultato impeccabile. La nostra simpatica mascotte polpo Kai, ispirata alle cascate del Reno, simboleggia proprio questo approccio: impegno concreto e cura.',
          link: 'Scopri di più su Antonio Gomes & la storia di Kraken PFM →'
        };
      case 'es':
        return {
          badge: 'Experiencia Práctica en el Centro',
          title: 'Quién está detrás de Kraken PFM — Liderazgo mediante conocimientos prácticos',
          p1: 'El fundador Antonio Gomes cuenta con 11 años de sólida experiencia en el Facility Management internacional. Su trayectoria comenzó desde la base como personal de limpieza en Londres. Pasando por puestos como Building Manager del complejo 200 Aldersgate en la City de Londres y Director Comercial de una empresa de FM en Mánchester, acumuló un amplio know-how en operaciones, logística y control de calidad.',
          p2: 'Quien ha realizado el trabajo desde el terreno conoce los detalles decisivos para un resultado impecable. Nuestra simpática mascota el pulpo Kai, inspirada en las cataratas del Rin, simboliza precisamente este enfoque: esmero y rigor real.',
          link: 'Más información sobre Antonio Gomes y la historia de Kraken PFM →'
        };
      case 'pt':
        return {
          badge: 'Experiência Prática no Foco',
          title: 'Quem está por trás da Kraken PFM — Liderança através da prática',
          p1: 'O fundador Antonio Gomes traz 11 anos de sólida experiência em Facility Management internacional. A sua carreira começou diretamente na base como profissional de limpeza em Londres. Através de funções como Building Manager do complexo 200 Aldersgate em Londres e Diretor Comercial de uma empresa de FM em Manchester, acumulou um vasto know-how em gestão de edifícios e controlo de qualidade.',
          p2: 'Quem realizou o trabalho desde a base conhece os detalhes cruciais para um resultado impecável. A nossa simpática mascote polvo Kai, inspirada nas cataratas do Reno, simboliza exatamente esta abordagem: dedicação real e cuidado.',
          link: 'Saber mais sobre Antonio Gomes & a história da Kraken PFM →'
        };
      case 'de':
      case 'de-CH':
      default:
        return {
          badge: 'Praxiserfahrung im Fokus',
          title: 'Wer hinter Kraken PFM steht — Führung durch Praxiswissen',
          p1: 'Gründer Antonio Gomes bringt 11 Jahre fundierte Erfahrung im internationalen Facility Management mit. Seine Laufbahn begann direkt an der Basis als Reinigungskraft in London. Über Stationen als Building Manager des Bürokomplexes 200 Aldersgate in der City of London und Head of Sales eines FM-Unternehmens in Manchester sammelte er umfassendes Know-how in Gebäudebetrieb, Logistik und Qualitätskontrolle. Vor der Gründung von Kraken PFM betreute er ein Jahr lang gewerbliche Mandate in Zürich und Schaffhausen.',
          p2: 'Wer die Arbeit selbst von Grund auf ausgeführt hat, kennt die entscheidenden Details für ein tadelloses Ergebnis. Unser freundliches Tintenfisch-Maskottchen Kai, inspiriert vom Rheinfall, symbolisiert genau diesen Ansatz: Anpacken mit Sorgfalt statt heisser Luft.',
          link: 'Mehr über Antonio Gomes & die Geschichte von Kraken PFM erfahren →'
        };
    }
  };

  const tData = getT();

  return (
    <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#032B59] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {tData.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#032B59] tracking-tight mt-3 mb-4">
            {tData.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
            {tData.p1}
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
            {tData.p2}
          </p>
          <div>
            <a
              href="/about"
              onClick={(e) => handleLinkClick(e, '/about')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#032B59] hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              {tData.link}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

