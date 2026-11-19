import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { 
  Building2, 
  Car, 
  Scale, 
  Trash2, 
  Briefcase, 
  Home, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Info,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Award,
  ChevronRight,
  PhoneCall,
  Lock,
  Compass
} from 'lucide-react';

interface ZurichDossierSectionProps {
  onNavigate?: (page: string) => void;
}

export const ZurichDossierSection: React.FC<ZurichDossierSectionProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const rawLang = language || 'de';
  const activeLang = (rawLang === 'de-CH' || rawLang === 'de') ? 'de' : rawLang;
  const lang = ['de', 'en', 'es', 'fr', 'it', 'pt'].includes(activeLang) ? activeLang : 'de';

  const [activeTab, setActiveTab] = useState<'struktur' | 'entsorgung' | 'parkieren' | 'gliederung' | 'strategie' | 'offen'>('struktur');

  const content = {
    de: {
      badge: "Geprüftes Standortdossier Stadt Zürich 2026",
      title: "Standortdossier Stadt Zürich — Marktanalysen & Kommunale Vorgaben",
      subtitle: "Recherchierter Leitfaden zu den Zürcher Stichtags-Kündigungen, ERZ-Entsorgungsregeln, Parkplatz-Vorlaufzeiten und B2B-Facility-Lösungen.",
      bannerBadge: "3. Hub der Kraken PFM · 36 Min. Anfahrt ab Basis",
      bannerTitle: "Strategische Präsenz im Wirtschaftsraum Zürich",
      bannerDesc: "Zürich unterscheidet sich grundlegend von Schaffhausen: Höherer Marktdruck, zwei scharfe Kündigungsspitzen und strenge städtische Auflagen (ERZ & Stadtpolizei). Kraken PFM verbindet Schweizer Präzision, GAV-Treue und 100% Abnahmegarantie mit exzellenter B2B-Unterhaltsreinigung.",
      bannerBtn: "Offerte für Zürich kalkulieren",
      bannerImgTag: "📍 Stadt Zürich & Wirtschaftsraum",
      factTag: "Kernaussage #",
      ruleTag: "ERZ Vorschrift",
      parkingTag: "StPo Beleg",
      circleTag: "Kreis & Quartier",
      strategyTag: "B2B Strategie",
      complianceTag: "Compliance",
      baseDesc: "Vom zentralen Wirtschaftsnetzwerk aus bedienen unsere mobilen Teams Gewerbekunden, Kanzleien, Praxen und Wohnliegenschaften im gesamten Stadtgebiet Zürich.",
      tabs: {
        struktur: "Strukturelle Unterschiede",
        entsorgung: "Entsorgung & ERZ",
        parkieren: "Parkierung & Zufahrt",
        gliederung: "Stadtgliederung & Kreise",
        strategie: "Strategische B2B-Einschätzung",
        offen: "Offene Compliance-Punkte"
      },
      strukturSec: {
        title: "Teil 1 — Der strukturelle Unterschied: Zürich vs. Schaffhausen",
        desc: "Der Zürcher Immobilienmarkt unterscheidet sich fundamental durch extrem gebündelte Kündigungstermine und rekordtiefe Leerstände.",
        points: [
          {
            title: "Zwei Stichtags-Termine im Jahr statt elf Monate",
            text: "Die Stadt Zürich kennt nur zwei offizielle Kündigungstermine: 31. März und 30. September. Selbst der umliegende Kanton Zürich hat drei Termine (31.3., 30.6., 30.9.) und Schaffhausen elf. Die gesamte B2C-Umzugsnachfrage konzentriert sich extrem auf diese zwei Zeitfenster."
          },
          {
            title: "Der angespannteste Wohnungsmarkt der Schweiz (0.11% Leerstand)",
            text: "Mit einer Leerwohnungsziffer von nur 0.11% in der Stadt Zürich (Stand June 2026) steht auf 1'000 Wohnungen praktisch nur eine leer (Vergleich: Winterthur 0.20%, Kanton ZH 0.52%, Schweiz 1.00%). Dies erzeugt maximalen Abnahmedruck bei Verwaltungen."
          },
          {
            title: "Betriebliche Kapazitäts- & Preisstrategie",
            text: "Ausserhalb der zwei Kündigungsspitzen ist das B2C-Geschäft in Zürich ruhiger. Kraken setzt deshalb primär auf wiederkehrende B2B-Unterhaltsreinigung, Büro- & Gewerbepflege sowie feste Hauswartungs-Mandate."
          }
        ]
      },
      entsorgungSec: {
        title: "Teil 2 — Entsorgung & ERZ (Entsorgung + Recycling Zürich)",
        desc: "Zuständig: ERZ Service Center (044 417 77 77, Mo–Fr 07:00–17:00). Strenge Vorschriften und kostenpflichtige Entsorgung.",
        points: [
          {
            title: "⚠️ Gratis-Coupons seit Mai 2025 ersatzlos abgeschafft!",
            text: "Die früheren Gratis-Entsorgungscoupons für 400 kg Sperrgut existieren nicht mehr. In den städtischen Recyclinghöfen Looächer und Werdhölzli fallen heute ca. CHF 20.– bis 22.70 pro 100 kg an. Räumungen sind eine direkte Kostenposition."
          },
          {
            title: "ERZ-Abholservice — Strikte Regeln & Telefonpflicht",
            text: "Bestellung ausschliesslich telefonisch (044 417 77 77), keine Online-Buchung. Abholung nur Mo–Fr (kein Wochenende), Vorlaufzeit mind. 3 Arbeitstage. Bereitstellung am Abholtag exakt vor 07:00 Uhr am Gehsteig. Maximal 60 Minuten Aufladezeit pro Tag/Standort."
          },
          {
            title: "Gebühren & Pauschaltarife der ERZ",
            text: "Anfahrt + 15 Minuten Aufladen + Entsorgung: CHF 86.50 pauschal. Jede weitere Viertelstunde: CHF 86.50. Gewichtsgebühr: CHF 22.70 / 100 kg. Späte Stornierung nach 12:00 Uhr des Vorabends kostet CHF 86.50."
          },
          {
            title: "Entsorgungsnetzwerk der Stadt",
            text: "Gross-Recyclinghöfe Hagenholz (Norden), Werdhölzli (Westen) und Looächer; ca. 18 mobile Recyclinghöfe (max. 40 kg & 2.5 m pro Gegenstand); Cargo- & E-Tram für Kleinmengen; ca. 170 Quartiersammelstellen."
          }
        ]
      },
      parkierenSec: {
        title: "Teil 3 — Parkierung, Halteverbot & Zufahrt der Stadtpolizei",
        desc: "Verkehrstechnische Auflagen der Stadtpolizei Zürich und der Dienstabteilung Verkehr (DAV).",
        points: [
          {
            title: "Amtliche Vorlaufzeiten für Parkplatzreservierung",
            text: "Blaue Zone: mindestens 7 Arbeitstage Vorlaufzeit bei der Stadtpolizei! Weisse Zone: mindestens 3 Arbeitstage Vorlaufzeit. Für Notfälle oder Kurzfristiges muss die zuständige Kreischef-Dienststelle kontaktiert werden."
          },
          {
            title: "Verbindliche Kosten für Parkfeld-Sperrung",
            text: "Bei 1–2 aneinandergrenzenden Parkfeldern für maximal 1 Tag betragen die Gebühren CHF 120.– bis CHF 170.– (im Vergleich zu Schaffhausen mit variabler Rahmengebühr)."
          },
          {
            title: "Rechtliche Feinheit: Güterumschlag vs. Parkieren",
            text: "Trottoirnutzung gestattet, wenn 1.5 m Gehweg für Fussgänger frei bleiben. Im signalisierten Parkverbot ist aktiver Güterumschlag erlaubt; im signalisierten HALTEVERBOT dagegen strikt verboten."
          },
          {
            title: "Kreis 1 Altstadt & Sonderzonen",
            text: "Kreis 1 (Niederdorf, Bahnhofstrasse) unterliegt strengster Prüfung wegen Tramnetz und Fussgängerzonen (4–6 Wochen Vorlauf für Sonder-Zufahrtsbewilligungen bei der DAV Mühlegasse 18/22)."
          }
        ]
      },
      gliederungSec: {
        title: "Teil 4 — Stadtgliederung & Zielgruppen in den 12 Kreisen",
        desc: "Die Stadt Zürich umfasst 12 Kreise und 34 Quartiere mit stark unterschiedlicher Bebauungs- und Klientenstruktur.",
        points: [
          {
            title: "Kreis 1 (Altstadt)",
            text: "Historischer Kern mit engen Treppenhäusern, verkehrsfreien Zonen und Denkmalschutz. Hohe Anforderung an manuelle Logistik und Kleingeräte."
          },
          {
            title: "Kreis 11 (Oerlikon, Affoltern, Seebach)",
            text: "Starkes Wachstum mit modernen Wohn- und Gewerbeüberbauungen. Hohe Dichte an B2B-Büroflächen und Gewerbe-Unterhaltsreinigung."
          },
          {
            title: "Kreis 12 (Schwamendingen, Hirzenbach) & Genossenschaften",
            text: "Hohe Dichte an Wohnbaugenossenschaften. Entscheidung über Vorstand/Generalversammlung – sehr attraktiver B2B-Zielsektor für wiederkehrende Mandate."
          },
          {
            title: "Aussenquartiere (1940er–1970er Bauten)",
            text: "Viele Bestandsbauten ohne Personenaufzug, enge Kellertüren und spezifische Zugangsmerkmale für Räumung und Treppenhausreinigung."
          }
        ]
      },
      strategieSec: {
        title: "Teil 6 — Strategische B2B-Einschätzung für Kraken PFM",
        desc: "Nüchterne Positionierung: Kraken fokussiert in Zürich primär auf Qualität, B2B-Wiederkehr und Anker-Referenzen.",
        points: [
          {
            title: "B2B-Fokus statt Preiskampf am B2C-Stichtag",
            text: "Gegen B2C-Großplattformen mit Online-Fixpreis ist ein spitzer Preiskampf an den 2 Stichtagen unrentabel. Kraken konzentriert sich auf B2B-Unterhaltsreinigung, Gewerbekunden, Praxen und Hauswartung."
          },
          {
            title: "Wert der Inhaber-Aufsicht & Verlässlichkeit",
            text: "Bei wiederkehrenden B2B-Objekten amortisiert sich die Anfahrt (36 Min ab Basis). Geschäftskunden schätzen die persönliche Betreuung durch den Inhaber und GAV-zertifiziertes Festpersonal."
          },
          {
            title: "Bestehende Zürcher Referenzen nutzen",
            text: "Kraken verfügt bereits über zufriedene Kundenreferenzen im Raum Zürich (z.B. renommierter Zürcher Gewerbesalon). Dieser Grundstein dient als Fundament für gezieltes B2B-Wachstum."
          }
        ]
      },
      offenSec: {
        title: "Teil 7 — Offene Punkte & Kommunale Prüfpunkte",
        desc: "Transparenter Leitfaden zu laufenden Abklärungen bezüglich städtischer Vorschriften.",
        points: [
          {
            title: "Betriebsabfall vs. Haushaltsabfall bei Räumung",
            text: "Klärung bei ERZ (044 417 77 77): Handelt es sich bei der Wohnungsräumung im Kundenauftrag um Kundenschutt oder Betriebsabfall des Dienstleisters?"
          },
          {
            title: "Gewerbliche Freigrenzen (<250 VZÄ)",
            text: "Siedlungsabfall von Kleinunternehmen (<250 Vollzeitstellen schweizweit) gilt bei Haushaltsähnlichkeit als Grundentsorgungs-berechtigt. Über 250 VZÄ erfolgt die Entsorgung privat."
          },
          {
            title: "Wasserhärte & Reinigungschemie im Raum Zürich",
            text: "Zürcher Seewasser weist mittlere Härtegrade auf (ca. 15–18 °fH, deutlich weicher als die Neunkircher 33–34 °fH in Schaffhausen). Exakte Dosierung spart Chemie und schont Oberflächen."
          }
        ]
      }
    },
    en: {
      badge: "Verified Location Dossier City of Zurich 2026",
      title: "City of Zurich Dossier — Market Analysis & Municipal Regulations",
      subtitle: "Researched guide covering Zurich's fixed move-out dates, ERZ waste rules, police parking lead times, and B2B facility solutions.",
      bannerBadge: "Kraken PFM Hub #3 · 36 min commute from base",
      bannerTitle: "Strategic Presence in the Zurich Economic Area",
      bannerDesc: "Zurich differs fundamentally from Schaffhausen: Higher market pressure, two sharp move-out peaks, and strict municipal regulations (ERZ & City Police). Kraken PFM combines Swiss precision, CLA compliance, and 100% handover guarantee with premier B2B maintenance cleaning.",
      bannerBtn: "Calculate Quote for Zurich",
      bannerImgTag: "📍 Zurich City & Economic Area",
      factTag: "Key Fact #",
      ruleTag: "ERZ Regulation",
      parkingTag: "Police Rule",
      circleTag: "District & Quarter",
      strategyTag: "B2B Strategy",
      complianceTag: "Compliance",
      baseDesc: "From our central economic network, our mobile teams serve commercial clients, law firms, medical practices, and residential properties across Zurich.",
      tabs: {
        struktur: "Structural Differences",
        entsorgung: "Waste & ERZ Rules",
        parkieren: "Parking & Access",
        gliederung: "Districts & Quarters",
        strategie: "Strategic B2B Focus",
        offen: "Compliance Open Points"
      },
      strukturSec: {
        title: "Part 1 — The Structural Difference: Zurich vs. Schaffhausen",
        desc: "The Zurich real estate market is defined by highly concentrated termination dates and record-low vacancy rates.",
        points: [
          {
            title: "Two Fixed Move-Out Dates per Year instead of Eleven Months",
            text: "The City of Zurich has only two official move-out dates: March 31 and September 30. Even the surrounding Canton has three (31.3, 30.6, 30.9) and Schaffhausen has eleven. All B2C move-out demand is concentrated in these two sharp peak windows."
          },
          {
            title: "Switzerland's Tightest Housing Market (0.11% Vacancy)",
            text: "With a vacancy rate of just 0.11% in Zurich City (June 2026), only 1 in 1,000 apartments is vacant (compared to Winterthur 0.20%, Canton ZH 0.52%, Switzerland 1.00%). Property management handovers require flawless perfection."
          },
          {
            title: "Operational Capacity & Pricing Strategy",
            text: "Outside the two move-out peaks, B2C volume drops. Kraken focuses on recurring B2B maintenance, office & commercial care, and facility maintenance contracts."
          }
        ]
      },
      entsorgungSec: {
        title: "Part 2 — Waste Disposal & ERZ (Entsorgung + Recycling Zürich)",
        desc: "Responsible authority: ERZ Service Center (044 417 77 77, Mon–Fri 07:00–17:00). Strict regulations and mandatory fees.",
        points: [
          {
            title: "⚠️ Free Disposal Vouchers Abolished Since May 2025!",
            text: "The historical 400 kg free disposal coupons for households no longer exist. Official recycling centers (Looächer, Werdhölzli) now charge ~CHF 20.– to 22.70 per 100 kg. All waste clearance is a direct cost item."
          },
          {
            title: "ERZ Pickup Service — Rules & Phone Booking Only",
            text: "Bookings strictly via phone (044 417 77 77), no online tool. Pickups Mon–Fri only (no weekends), min. 3 working days notice. Curbside placement before 07:00 AM. Max 60 minutes loading time per location/day."
          },
          {
            title: "ERZ Official Fees & Rates",
            text: "Call-out + 15 min loading + disposal: CHF 86.50 flat rate. Each additional 15 min: CHF 86.50. Weight fee: CHF 22.70 / 100 kg. Late cancellation fee after 12:00 PM previous day: CHF 86.50."
          },
          {
            title: "Municipal Disposal Network",
            text: "Major centers at Hagenholz, Werdhölzli, and Looächer; 18 mobile recycling stops (max 40 kg & 2.5m per item); Cargo & E-Tram for small quantities; ~170 neighborhood recycling points."
          }
        ]
      },
      parkierenSec: {
        title: "Part 3 — Parking, No-Parking Permits & Police Regulations",
        desc: "Official Traffic Regulations by Zurich City Police and Traffic Department (DAV).",
        points: [
          {
            title: "Official Police Lead Times for Parking Reservation",
            text: "Blue Zone: Minimum 7 working days lead time with City Police! White Zone: Minimum 3 working days lead time. Emergency requests require direct contact with the district police chief."
          },
          {
            title: "Binding Fees for Parking Space Reservation",
            text: "For 1–2 adjacent parking spaces for up to 1 day, official fees range between CHF 120.– and CHF 170.–."
          },
          {
            title: "Legal Nuance: Loading Activity vs. Parking",
            text: "Sidewalk usage permitted if 1.5 meters pedestrian clearance remains. Active loading is allowed in designated NO-PARKING zones, but strictly FORBIDDEN in NO-STOPPING zones."
          },
          {
            title: "District 1 Old Town & High-Security Areas",
            text: "District 1 (Niederdorf, Bahnhofstrasse) undergoes intense scrutiny due to tram networks and pedestrian zones (4–6 weeks lead time for special access permits at DAV Mühlegasse 18/22)."
          }
        ]
      },
      gliederungSec: {
        title: "Part 4 — City Structure & Target Groups Across 12 Districts",
        desc: "Zurich spans 12 districts and 34 quarters with distinct structural characteristics.",
        points: [
          {
            title: "District 1 (Old Town / Altstadt)",
            text: "Historic core with narrow stairwells, pedestrian zones, and heritage protection. Requires specialized manual logistics and compact equipment."
          },
          {
            title: "District 11 (Oerlikon, Affoltern, Seebach)",
            text: "Rapid growth with modern residential and commercial developments. High density of B2B office buildings and commercial cleaning needs."
          },
          {
            title: "District 12 (Schwamendingen) & Housing Cooperatives",
            text: "Concentration of housing cooperatives. Decisions made via board/general assembly – a prime B2B target for recurring maintenance contracts."
          },
          {
            title: "Outer Neighborhoods (1940s–1970s Constructions)",
            text: "Many multi-family buildings without elevators, tight basement doors, and specific access considerations for clearing and stairwell cleaning."
          }
        ]
      },
      strategieSec: {
        title: "Part 6 — Strategic B2B Assessment for Kraken PFM",
        desc: "Pragmatic positioning: Kraken focuses on quality, B2B recurrence, and anchor references in Zurich.",
        points: [
          {
            title: "B2B Focus Over B2C Price Wars",
            text: "Competing on price against massive B2C platforms during the two peak dates is unsustainable for a boutique firm. Kraken targets recurring B2B maintenance, offices, and property management."
          },
          {
            title: "Value of Owner Supervision & Reliability",
            text: "For recurring B2B clients, travel time (36 min from base) amortizes effortlessly. Commercial clients value direct owner oversight and CLA-certified staff."
          },
          {
            title: "Leveraging Established Zurich References",
            text: "Kraken already maintains active, highly satisfied commercial references in Zurich (e.g., premier salon in Zurich City), serving as a foundation for B2B expansion."
          }
        ]
      },
      offenSec: {
        title: "Part 7 — Open Compliance & Verification Points",
        desc: "Transparent guidelines regarding ongoing municipal clarifications.",
        points: [
          {
            title: "Commercial vs. Household Waste Status",
            text: "Clarification with ERZ (044 417 77 77): Is apartment clearing on behalf of clients categorized as client household waste or provider commercial waste?"
          },
          {
            title: "Small Business Thresholds (<250 FTE)",
            text: "Municipal waste from SMEs with under 250 full-time employees nationwide is treated as household-similar waste under basic disposal rights."
          },
          {
            title: "Water Hardness & Cleaning Chemistry in Zurich",
            text: "Zurich lake water exhibits medium hardness (15–18 °fH), significantly softer than Schaffhausen's 33–34 °fH, allowing optimized, eco-friendly chemical dosing."
          }
        ]
      }
    },
    es: {
      badge: "Dossier de Ubicación Verificado Ciudad de Zúrich 2026",
      title: "Dossier Estratégico Ciudad de Zúrich — Análisis y Normativa Municipal",
      subtitle: "Guía técnica sobre los 2 términos fijos de rescisión de contrato, reglas de eliminación ERZ, plazos de aparcamiento policial y soluciones B2B.",
      bannerBadge: "3. Hub de Kraken PFM · 36 min de trayecto desde base",
      bannerTitle: "Presencia Estratégica en el Área Económica de Zúrich",
      bannerDesc: "Zúrich se diferencia fundamentalmente de Schaffhausen: mayor presión de mercado, dos picos de mudanzas muy acusados y estrictas regulaciones municipales (ERZ y Policía Local). Kraken PFM combina precisión suiza, cumplimiento CCT y garantía del 100% con mantenimiento B2B de primer nivel.",
      bannerBtn: "Calcular Presupuesto para Zúrich",
      bannerImgTag: "📍 Ciudad de Zúrich y Área Económica",
      factTag: "Dato Clave #",
      ruleTag: "Regla ERZ",
      parkingTag: "Norma Policial",
      circleTag: "Distrito y Barrio",
      strategyTag: "Estrategia B2B",
      complianceTag: "Cumplimiento",
      baseDesc: "Desde nuestra red central, nuestros equipos móviles atienden a clientes comerciales, despachos de abogados, clínicas y propiedades residenciales en toda la ciudad de Zúrich.",
      tabs: {
        struktur: "Diferencias Estructurales",
        entsorgung: "Residuos y Reglas ERZ",
        parkieren: "Aparcamiento y Acceso",
        gliederung: "Distritos y Barrios",
        strategie: "Enfoque Estratégico B2B",
        offen: "Puntos de Cumplimiento"
      },
      strukturSec: {
        title: "Parte 1 — La Diferencia Estructural: Zúrich vs. Schaffhausen",
        desc: "El mercado inmobiliario de Zúrich se caracteriza por fechas de rescisión muy concentradas y tasas de vacancia mínimas récord.",
        points: [
          {
            title: "Dos Fechas de Rescisión Fijas al Año en lugar de Once Meses",
            text: "La ciudad de Zúrich tiene solo dos fechas oficiales de rescisión: 31 de marzo y 30 de septiembre. El cantón de Zúrich tiene tres y Schaffhausen once. Toda la demanda B2C se concentra en estas dos ventanas intensas."
          },
          {
            title: "El Mercado Inmobiliario más Tenso de Suiza (0.11% de Vacancia)",
            text: "Con una tasa de vacancia de solo el 0.11% en Zúrich ciudad (junio de 2026), solo 1 de cada 1.000 viviendas está libre. Las entregas exigidas por las agencias inmobiliarias son extremadamente rigurosas."
          },
          {
            title: "Estrategia de Capacidad Operativa y Precios",
            text: "Fuera de los dos picos de rescisión, el volumen B2C desciende. Kraken se enfoca en mantenimiento B2B recurrente, oficinas, locales comerciales y contratos de conserjería."
          }
        ]
      },
      entsorgungSec: {
        title: "Parte 2 — Gestión de Residuos y ERZ (Entsorgung + Recycling Zürich)",
        desc: "Autoridad competente: ERZ Service Center (044 417 77 77, Lun–Vie 07:00–17:00). Estrictas regulaciones y tarifas obligatorias.",
        points: [
          {
            title: "⚠️ ¡Cupones Gratuitos Abolidos Desde Mayo de 2025!",
            text: "Los antiguos cupones de 400 kg de vertido gratuito para hogares ya no existen. En los puntos limpios municipales (Looächer, Werdhölzli) se cobra entre CHF 20.– y 22.70 por cada 100 kg. Todo vaciado es un coste directo."
          },
          {
            title: "Servicio de Recogida ERZ — Reglas y Cita Telefónica Única",
            text: "Reservas únicamente por teléfono (044 417 77 77). Recogidas solo de lunes a viernes (sin fines de semana), con 3 días laborables de antelación. Depósito en acera antes de las 07:00 h. Máximo 60 minutos de carga por día/ubicación."
          },
          {
            title: "Tarifas Oficiales ERZ",
            text: "Desplazamiento + 15 min de carga + eliminación: CHF 86.50 tarifa plana. Cada 15 min adicionales: CHF 86.50. Tasa por peso: CHF 22.70 / 100 kg. Cancelación tardía tras las 12:00 h del día anterior: CHF 86.50."
          },
          {
            title: "Red Municipal de Puntos Limpios",
            text: "Grandes centros en Hagenholz, Werdhölzli y Looächer; 18 puntos limpios móviles (máx. 40 kg y 2.5 m por objeto); Tranvía de Carga (Cargo-Tram) para pequeñas cantidades; ~170 puntos de reciclaje de barrio."
          }
        ]
      },
      parkierenSec: {
        title: "Parte 3 — Aparcamiento, Permisos y Accesos de la Policía",
        desc: "Normativa oficial de tráfico de la Policía de Zúrich y el Departamento de Tráfico (DAV).",
        points: [
          {
            title: "Plazos Oficiales de Reserva de Aparcamiento",
            text: "Zona Azul: Mínimo 7 días laborables de antelación con la Policía Local. Zona Blanca: Mínimo 3 días laborables de antelación. Solicitudes urgentes requieren contacto directo con el jefe del distrito policial."
          },
          {
            title: "Costes Vinculantes para Reserva de Plazas",
            text: "Para 1–2 plazas contiguas durante 1 día, las tasas oficiales oscilan entre CHF 120.– y CHF 170.–."
          },
          {
            title: "Matiz Legal: Carga y Descarga vs. Estacionamiento",
            text: "Uso de acera permitido si se garantizan 1.5 metros libres para peatones. La carga activa está permitida en zonas de PROHIBIDO ESTACIONAR, pero estrictamente PROHIBIDA en zonas de PROHIBIDO PARAR."
          },
          {
            title: "Distrito 1 Centro Histórico y Zonas Protegidas",
            text: "El Distrito 1 (Niederdorf, Bahnhofstrasse) requiere permisos especiales con 4–6 semanas de antelación en el DAV (Mühlegasse 18/22) debido al tranvía y calles peatonales."
          }
        ]
      },
      gliederungSec: {
        title: "Parte 4 — Estructura Urbana y Sectores en los 12 Distritos",
        desc: "Zúrich abarca 12 distritos y 34 barrios con características estructurales bien diferenciadas.",
        points: [
          {
            title: "Distrito 1 (Centro Histórico / Altstadt)",
            text: "Núcleo histórico con escaleras estrechas, zonas peatonales y protección del patrimonio. Requiere logística manual especializada y equipamiento compacto."
          },
          {
            title: "Distrito 11 (Oerlikon, Affoltern, Seebach)",
            text: "Rápido crecimiento con modernos complejos residenciales y comerciales. Alta densidad de oficinas B2B y necesidades de mantenimiento."
          },
          {
            title: "Distrito 12 (Schwamendingen) y Cooperativas de Vivienda",
            text: "Gran concentración de cooperativas de vivienda. Decisiones a través de la junta/asamblea general: un objetivo B2B clave para contratos de mantenimiento recurrente."
          },
          {
            title: "Barrios Periféricos (Construcciones 1940–1970)",
            text: "Edificios residenciales sin ascensor, puertas de sótano estrechas y características de acceso específicas para limpiezas y vaciados."
          }
        ]
      },
      strategieSec: {
        title: "Parte 6 — Evaluación Estratégica B2B para Kraken PFM",
        desc: "Posicionamiento pragmático: Kraken se enfoca en calidad, recurrencia B2B y referencias sólidas en Zúrich.",
        points: [
          {
            title: "Enfoque B2B en Lugar de Guerra de Precios B2C",
            text: "Competir en precio contra grandes plataformas B2C en los 2 días pico resulta ineficiente. Kraken se orienta hacia el mantenimiento B2B recurrente, oficinas y conserjería de fincas."
          },
          {
            title: "Valor de la Supervisión Directa del Propietario",
            text: "En clientes B2B recurrentes, el tiempo de desplazamiento (36 min desde la base) se amortiza fácilmente. Las empresas valoran la atención personalizada y el personal fijo bajo CCT."
          },
          {
            title: "Uso de Referencias Consolidadas en Zúrich",
            text: "Kraken ya cuenta con referencias comerciales satisfechas en Zúrich (ej. salón comercial en Zúrich Ciudad), que sirven de base para el crecimiento B2B."
          }
        ]
      },
      offenSec: {
        title: "Parte 7 — Puntos Abiertos de Cumplimiento y Verificación",
        desc: "Guía transparente sobre consultas municipales en curso.",
        points: [
          {
            title: "Estatus de Residuos Comerciales vs. Domésticos",
            text: "Aclaración con ERZ (044 417 77 77): ¿El vaciado de viviendas por encargo del cliente se clasifica como residuo doméstico del cliente o residuo comercial de la empresa?"
          },
          {
            title: "Límite para PYMEs (<250 Empleados)",
            text: "Los residuos asimilables a domésticos de PYMEs con menos de 250 empleados a nivel nacional se benefician de la recogida pública básica."
          },
          {
            title: "Dureza del Agua y Química de Limpieza en Zúrich",
            text: "El agua del lago de Zúrich presenta una dureza media (15–18 °fH), sensiblemente más blanda que los 33–34 °fH de Schaffhausen, permitiendo una dosificación optimizada y ecológica."
          }
        ]
      }
    },
    fr: {
      badge: "Dossier de Localisation Vérifié Ville de Zurich 2026",
      title: "Dossier Stratégique Ville de Zurich — Analyse & Réglementations",
      subtitle: "Guide technique sur les 2 dates fixes de résiliation, les règles de déchets ERZ, les préavis de stationnement et les solutions B2B.",
      bannerBadge: "3e Hub Kraken PFM · 36 min de trajet depuis la base",
      bannerTitle: "Présence Stratégique dans la Région Économique de Zurich",
      bannerDesc: "Zurich diffère fondamentalement de Schaffhouse : pression de marché plus élevée, deux pics de déménagement très marqués et exigences municipales strictes (ERZ & Police municipale). Kraken PFM associe précision suisse, respect de la CCT et garantie à 100% à des prestations B2B de premier ordre.",
      bannerBtn: "Calculer un Devis pour Zurich",
      bannerImgTag: "📍 Ville de Zurich & Bassin Économique",
      factTag: "Fait Clé #",
      ruleTag: "Règle ERZ",
      parkingTag: "Règle Police",
      circleTag: "Arrondissement & Quartier",
      strategyTag: "Stratégie B2B",
      complianceTag: "Conformité",
      baseDesc: "Depuis notre réseau économique central, nos équipes mobiles interviennent auprès de clients commerciaux, cabinets d'avocats, cabinets médicaux et immeubles résidentiels dans tout Zurich.",
      tabs: {
        struktur: "Différences Structurelles",
        entsorgung: "Déchets & Règles ERZ",
        parkieren: "Stationnement & Accès",
        gliederung: "Arrondissements & Quartiers",
        strategie: "Orientation B2B",
        offen: "Points de Conformité"
      },
      strukturSec: {
        title: "Partie 1 — La Différence Structurelle : Zurich vs Schaffhouse",
        desc: "Le marché immobilier zurichois se caractérise par des dates de résiliation extrêmement concentrées et un taux de vacance historiquement bas.",
        points: [
          {
            title: "Deux Dates Fixes de Résiliation par An au Lieu de Onze Mois",
            text: "La Ville de Zurich ne compte que deux dates officielles de résiliation : 31 mars et 30 septembre. Le canton de Zurich en a trois et Schaffhouse onze. Toute la demande B2C se concentre sur ces deux périodes très intenses."
          },
          {
            title: "Le Marché Logement le plus Tendu de Suisse (0.11% de Vacance)",
            text: "Avec un taux de vacance de seulement 0.11% en Ville de Zurich (juin 2026), seulement 1 logement sur 1 000 est disponible. Les remises de clés exigent une perfection absolue."
          },
          {
            title: "Stratégie de Capacité et de Tarification",
            text: "En dehors de ces deux pics, le volume B2C diminue. Kraken privilégie l'entretien régulier B2B, le nettoyage de bureaux, de commerces et les mandats de conciergerie."
          }
        ]
      },
      entsorgungSec: {
        title: "Partie 2 — Élimination des Déchets & ERZ (Entsorgung + Recycling Zürich)",
        desc: "Organisme responsable : ERZ Service Center (044 417 77 77, Lun–Ven 07h00–17h00). Réglementations strictes et tarifs obligatoires.",
        points: [
          {
            title: "⚠️ Coupons Gratuits Supprimés Depuis Mai 2025 !",
            text: "Les anciens coupons de 400 kg de dépôt gratuit pour les ménages n'existent plus. Les centres de recyclage municipaux (Looächer, Werdhölzli) facturent désormais de CHF 20.– à 22.70 par 100 kg. Tout débarras est un coût direct."
          },
          {
            title: "Service de Ramassage ERZ — Règles & Réservation Téléphonique Exclusive",
            text: "Commandes exclusivement par téléphone (044 417 77 77). Ramassage du lundi au vendredi (pas de week-end), préavis min. de 3 jours ouvrables. Dépôt sur trottoir avant 07h00. Temps de chargement max. 60 min par jour/site."
          },
          {
            title: "Tarifs Officiels ERZ",
            text: "Deplacement + 15 min de chargement + élimination : CHF 86.50 forfait. Chaque tranche de 15 min supplémentaire : CHF 86.50. Taux au poids : CHF 22.70 / 100 kg. Annulation tardive après 12h00 la veille : CHF 86.50."
          },
          {
            title: "Réseau Municipal de Déchèteries",
            text: "Grands centres à Hagenholz, Werdhölzli et Looächer ; 18 déchèteries mobiles (max 40 kg & 2.5m par objet) ; Cargo-Tram & E-Tram pour petites quantités ; ~170 points de collecte de quartier."
          }
        ]
      },
      parkierenSec: {
        title: "Partie 3 — Stationnement, Interdictions & Accès Police",
        desc: "Directives officielles de la Police municipale de Zurich et du Service de la circulation (DAV).",
        points: [
          {
            title: "Délais Officiels de Réservation de Places de Parc",
            text: "Zone Bleue : Minimum 7 jours ouvrables de préavis auprès de la Police municipale ! Zone Blanche : Minimum 3 jours ouvrables. Les urgences nécessitent un contact direct avec le chef de poste d'arrondissement."
          },
          {
            title: "Frais Obligatoires pour Réservation de Places",
            text: "Pour 1 à 2 places contiguës pendant 1 journée, les frais officiels s'élèvent entre CHF 120.– et CHF 170.–."
          },
          {
            title: "Subtilité Juridique : Manutention de Marchandises vs Stationnement",
            text: "Usage du trottoir autorisé si 1.5 mètre reste libre pour les piétons. La manutention active est autorisée dans les zones 'INTERDICTION DE STATIONNER', mais strictly INTERDITE dans les zones 'INTERDICTION DE S'ARRÊTER'."
          },
          {
            title: "Arrondissement 1 Centre Historique & Zones Protégées",
            text: "L'Arrondissement 1 (Niederdorf, Bahnhofstrasse) fait l'objet d'un contrôle renforcé en raison des trams et des zones piétonnes (4 à 6 semaines de préavis au DAV Mühlegasse 18/22)."
          }
        ]
      },
      gliederungSec: {
        title: "Partie 4 — Structure Urbaine & Secteurs dans les 12 Arrondissements",
        desc: "Zurich comprend 12 arrondissements et 34 quartiers aux caractéristiques variées.",
        points: [
          {
            title: "Arrondissement 1 (Centre Historique / Altstadt)",
            text: "Cœur historique aux cage d'escaliers étroites, zones piétonnes et bâtiments classés. Exige une logistique manuelle adaptée et du matériel compact."
          },
          {
            title: "Arrondissement 11 (Oerlikon, Affoltern, Seebach)",
            text: "Forte expansion avec de récents complexes résidentiels et commerciaux. Forte densité de bureaux B2B et besoins d'entretien."
          },
          {
            title: "Arrondissement 12 (Schwamendingen) & Coopératives d'Habitation",
            text: "Forte concentration de coopératives d'habitation. Décisions via comité/assemblée générale : une cible B2B privilégiée pour des contrats réguliers."
          },
          {
            title: "Quartiers Périphériques (Constructions 1940–1970)",
            text: "Immeubles sans ascenseur, portes de cave étroites et contraintes d'accès particulières pour les débarras et le nettoyage des communs."
          }
        ]
      },
      strategieSec: {
        title: "Partie 6 — Évaluation Stratégique B2B pour Kraken PFM",
        desc: "Positionnement réaliste : Kraken mise à Zurich sur la qualité, la récurrence B2B et des références solides.",
        points: [
          {
            title: "Priorité au B2B au Lieu de la Guerre des Prix B2C",
            text: "S'engager dans une guerre des prix contre de grandes plateformes B2C lors des 2 dates clés est peu rentable. Kraken se concentre sur l'entretien B2B régulier, les bureaux et la conciergerie."
          },
          {
            title: "Valeur de la Supervision Directe & Fiabilité",
            text: "Pour des clients B2B réguliers, le temps de trajet (36 min depuis la base) s'amortit facilement. Les professionnels apprécient le suivi personnalisé et le personnel fixe sous CCT."
          },
          {
            title: "Valorisation des Références Existantes à Zurich",
            text: "Kraken dispose déjà de références commerciales satisfaites à Zurich (ex. salon professionnel à Zurich Ville), servant de tremplin pour notre expansion B2B."
          }
        ]
      },
      offenSec: {
        title: "Partie 7 — Points Ouverts & Vérifications Réglementaires",
        desc: "Guide transparent sur les demandes administratives en cours.",
        points: [
          {
            title: "Statut des Déchets Commerciaux vs Ménagers",
            text: "Clarification avec ERZ (044 417 77 77) : Le débarras sur mandat client est-il assimilé à un déchet ménager client ou à un déchet d'exploitation de l'entreprise ?"
          },
          {
            title: "Seuil PME (<250 ETP)",
            text: "Les déchets assimilables des PME de moins de 250 ETP au niveau national bénéficient de la collecte publique de base."
          },
          {
            title: "Dureté de l'Eau & Chimie de Nettoyage à Zurich",
            text: "L'eau du lac de Zurich présente une dureté moyenne (15–18 °fH), nettement plus douce que celle de Schaffhouse (33–34 °fH), permettant un dosage chimique écologique et optimisé."
          }
        ]
      }
    },
    it: {
      badge: "Dossier di Ubicazione Verificato Città di Zurigo 2026",
      title: "Dossier Strategico Città di Zurigo — Analisi di Mercato e Normative",
      subtitle: "Guida tecnica sulle 2 date fisse di disdetta, norme rifiuti ERZ, preavvisi di sosta della Polizia e soluzioni B2B.",
      bannerBadge: "3° Hub Kraken PFM · 36 min di viaggio dalla base",
      bannerTitle: "Presenza Strategica nell'Area Economica di Zurigo",
      bannerDesc: "Zurigo differisce fondamentalmente da Sciaffusa: maggiore pressione di mercato, due picchi di trasloco accentuati e severe normative comunali (ERZ e Polizia). Kraken PFM unisce precisione svizzera, conformità CCL e garanzia al 100% a servizi B2B di altissimo livello.",
      bannerBtn: "Calcola Preventivo per Zurigo",
      bannerImgTag: "📍 Città di Zurigo & Area Economica",
      factTag: "Dettaglio Chiave #",
      ruleTag: "Regola ERZ",
      parkingTag: "Norma Polizia",
      circleTag: "Distretto e Quartiere",
      strategyTag: "Strategia B2B",
      complianceTag: "Conformità",
      baseDesc: "Dalla nostra rete economica centrale, le nostre squadre mobili servono clienti commerciali, studi legali, studi medici e immobili residenziali in tutta Zurigo.",
      tabs: {
        struktur: "Differenze Strutturali",
        entsorgung: "Rifiuti e Regole ERZ",
        parkieren: "Parcheggio e Accesso",
        gliederung: "Distretti e Quartieri",
        strategie: "Orientamento B2B",
        offen: "Punti di Conformità"
      },
      strukturSec: {
        title: "Parte 1 — La Differenza Strutturale: Zurigo vs Sciaffusa",
        desc: "Il mercato immobiliare di Zurigo si distingue per date di disdetta estremamente concentrate e tassi di sfitto ai minimi storici.",
        points: [
          {
            title: "Due Date Fisse all'Anno al Posto di Undici Mesi",
            text: "La Città di Zurigo ha solo due date ufficiali di disdetta: 31 marzo e 30 settembre. Il cantone ne ha tre e Sciaffusa undici. Tutta la domanda B2C si concentra in queste due intense finestre temporali."
          },
          {
            title: "Il Mercato Immobiliare più Teso della Svizzera (0.11% Sfitto)",
            text: "Con un tasso di sfitto di solo lo 0.11% a Zurigo città (giugno 2026), solo 1 appartamento su 1.000 è libero. La riconsegna dell'immobile richiede massima rigorosità."
          },
          {
            title: "Strategia Operativa e di Prezzo",
            text: "Al di fuori dei due picchi stagionali, il volume B2C diminuisce. Kraken punta sul mantenimento B2B ricorrente, pulizia uffici, locali commerciali e manutenzione stabili."
          }
        ]
      },
      entsorgungSec: {
        title: "Parte 2 — Smaltimento Rifiuti & ERZ (Entsorgung + Recycling Zürich)",
        desc: "Ente responsabile: ERZ Service Center (044 417 77 77, Lun–Ven 07:00–17:00). Norme severe e tariffe obbligatorie.",
        points: [
          {
            title: "⚠️ Buoni Gratuiti Aboliti da Maggio 2025!",
            text: "I vecchi buoni per 400 kg di smaltimento gratuito per le famiglie non esistono più. I centri di riciclaggio comunali (Looächer, Werdhölzli) applicano ora da CHF 20.– a 22.70 per 100 kg. Ogni sgombero è un costo diretto."
          },
          {
            title: "Servizio di Ritiro ERZ — Regole e Prenotazione Esclusivamente Telefonica",
            text: "Prenotazioni solo per telefono (044 417 77 77). Ritiro dal lunedì al venerdì (no weekend), preavviso min. di 3 giorni lavorativi. Deposito sul marciapiede prima delle 07:00. Tempo max di carico 60 min per giorno/sito."
          },
          {
            title: "Tariffe Ufficiali ERZ",
            text: "Uscita + 15 min di carico + smaltimento: CHF 86.50 quota fissa. Ogni ulteriori 15 min: CHF 86.50. Tassa al peso: CHF 22.70 / 100 kg. Cancellazione tardiva oltre le 12:00 del giorno prima: CHF 86.50."
          },
          {
            title: "Rete Comunale dei Centri di Riciclaggio",
            text: "Grandi centri a Hagenholz, Werdhölzli e Looächer; 18 centri mobili (max 40 kg & 2.5m per oggetto); Cargo-Tram & E-Tram per piccole quantità; ~170 punti di raccolta di quartiere."
          }
        ]
      },
      parkierenSec: {
        title: "Parte 3 — Parcheggio, Divieti di Sosta e Accessi Polizia",
        desc: "Direttive ufficiali della Polizia Cittadina di Zurigo e del Servizio Circolazione (DAV).",
        points: [
          {
            title: "Tempi Ufficiali di Preavviso per Riserva Parcheggio",
            text: "Zona Blu: Minimo 7 giorni lavorativi di preavviso presso la Polizia Cittadina! Zona Bianca: Minimo 3 giorni lavorativi. Le urgenze richiedono il contatto diretto con il capo distretto di polizia."
          },
          {
            title: "Costi Obbligatori per Riserva Stalli",
            text: "Per 1–2 stalli adiacenti per 1 giornata, le tasse ufficiali variano tra CHF 120.– e CHF 170.–."
          },
          {
            title: "Sfumatura Legale: Carico Merci vs Parcheggio",
            text: "Uso del marciapiede consentito se rimangono liberi 1.5 metri per i pedoni. Le operazioni di carico attivo sono consentite nelle zone DIVIETO DI SOSTA, ma rigorosamente VIETATE nelle zone DIVIETO DI FERMATA."
          },
          {
            title: "Distretto 1 Centro Storico e Zone Protette",
            text: "Il Distretto 1 (Niederdorf, Bahnhofstrasse) è soggetto a controlli rigorosi per via dei tram e delle aree pedonali (4–6 settimane di preavviso presso la DAV Mühlegasse 18/22)."
          }
        ]
      },
      gliederungSec: {
        title: "Parte 4 — Struttura Urbana e Settori nei 12 Distretti",
        desc: "Zurigo comprende 12 distretti e 34 quartieri con caratteristiche strutturali differenti.",
        points: [
          {
            title: "Distretto 1 (Centro Storico / Altstadt)",
            text: "Cuore storico con vani scale stretti, aree pedonali e stabili d'epoca. Richiede logistica manuale specializzata e attrezzatura compatta."
          },
          {
            title: "Distretto 11 (Oerlikon, Affoltern, Seebach)",
            text: "Forte espansione con recenti complessi residenziali e commerciali. Elevata densità di uffici B2B e manutenzioni."
          },
          {
            title: "Distretto 12 (Schwamendingen) e Cooperative Edilizie",
            text: "Elevata concentrazione di cooperative edilizie. Decisioni tramite comitato/assemblea generale: un target B2B prioritario per contratti ricorrenti."
          },
          {
            title: "Quartieri Periferici (Costruzioni 1940–1970)",
            text: "Edifici senza ascensore, porte delle cantine strette e vincoli d'accesso specifici per sgomberi e pulizia vani scale."
          }
        ]
      },
      strategieSec: {
        title: "Parte 6 — Valutazione Strategica B2B per Kraken PFM",
        desc: "Posizionamento pragmatico: Kraken punta a Zurigo su qualità, ricorrenza B2B e solide referenze.",
        points: [
          {
            title: "Focus B2B Anziché Guerra dei Prezzi B2C",
            text: "Competere sul prezzo contro grandi piattaforme B2C nelle 2 date di picco è poco redditizio. Kraken si concentra sulla manutenzione B2B ricorrente, uffici e gestione stabili."
          },
          {
            title: "Valore della Supervisione Diretta e Affidabilità",
            text: "Per clienti B2B ricorrenti, il tempo di viaggio (36 min dalla base) si ammortizza facilmente. Le aziende apprezzano l'assistenza diretta del titolare e il personale fisso con CCL."
          },
          {
            title: "Valorizzazione delle Referenze Esistenti a Zurigo",
            text: "Kraken vanta già referenze commerciali soddisfatte a Zurigo (es. salone commerciale a Zurigo Città), che fungono da base per la crescita B2B."
          }
        ]
      },
      offenSec: {
        title: "Parte 7 — Punti Aperti e Verifiche Regolamentari",
        desc: "Guida trasparente sulle richieste amministrative in corso.",
        points: [
          {
            title: "Stato Rifiuti Commerciali vs Domestici",
            text: "Chiarimento con ERZ (044 417 77 77): Lo sgombero appartamenti su mandato del cliente è assimilato a rifiuto domestico del cliente o rifiuto aziendale del fornitore?"
          },
          {
            title: "Soglia PMI (<250 ETP)",
            text: "I rifiuti assimilabili delle PMI con meno di 250 dipendenti a livello nazionale beneficiano della raccolta pubblica di base."
          },
          {
            title: "Durezza dell'Acqua e Chimica di Pulizia a Zurigo",
            text: "L'acqua del lago di Zurigo presenta una durezza media (15–18 °fH), notevolmente più dolce di quella di Sciaffusa (33–34 °fH), consentendo un dosaggio chimico ecologico e ottimizzato."
          }
        ]
      }
    },
    pt: {
      badge: "Dossier de Localização Verificado Cidade de Zurique 2026",
      title: "Dossier Estratégico Cidade de Zurique — Análise e Regulamentos",
      subtitle: "Guia técnico sobre os 2 prazos fixos de rescisão, regras de resíduos ERZ, autorizações de estacionamento policial e soluções B2B.",
      bannerBadge: "3º Hub da Kraken PFM · 36 min de viagem desde a base",
      bannerTitle: "Presença Estratégica na Área Económica de Zurique",
      bannerDesc: "Zurique difere fundamentalmente de Schaffhausen: maior pressão de mercado, dois picos acentuados de mudanças e rigorosas exigências municipais (ERZ e Polícia). A Kraken PFM combina precisão suíça, conformidade com CCT e garantia de 100% com manutenção B2B de topo.",
      bannerBtn: "Calcular Orçamento para Zurique",
      bannerImgTag: "📍 Cidade de Zurique & Área Económica",
      factTag: "Facto Chave #",
      ruleTag: "Regra ERZ",
      parkingTag: "Regra Policial",
      circleTag: "Distrito e Bairro",
      strategyTag: "Estratégia B2B",
      complianceTag: "Conformidade",
      baseDesc: "A partir da nossa rede económica central, as nossas equipas móveis atendem clientes comerciais, escritórios de advogados, clínicas e propriedades residenciais em toda a cidade de Zurique.",
      tabs: {
        struktur: "Diferenças Estruturais",
        entsorgung: "Resíduos e Regras ERZ",
        parkieren: "Estacionamento e Acesso",
        gliederung: "Distritos e Bairros",
        strategie: "Foco Estratégico B2B",
        offen: "Pontos de Conformidade"
      },
      strukturSec: {
        title: "Parte 1 — A Diferença Estrutural: Zurique vs Schaffhausen",
        desc: "O mercado imobiliário de Zurique caracteriza-se por datas de rescisão extremamente concentradas e taxas de desocupação mínimas históricas.",
        points: [
          {
            title: "Duas Datas Fixas de Rescisão por Ano em Vez de Onze Meses",
            text: "A Cidade de Zurique tem apenas duas datas oficiais de rescisão: 31 de março e 30 de setembro. O cantão de Zurique tem três e Schaffhausen onze. Toda a procura B2C concentra-se nestas duas janelas intensas."
          },
          {
            title: "O Mercado Imobiliário mais Tenso da Suíça (0.11% de Desocupação)",
            text: "Com uma taxa de desocupação de apenas 0.11% em Zurique cidade (junho de 2026), apenas 1 em cada 1.000 habitações está livre. As entregas às imobiliárias exigem máxima perfeição."
          },
          {
            title: "Estratégia Operacional e de Preços",
            text: "Fora dos dois picos de rescisão, o volume B2C diminui. A Kraken foca-se na manutenção B2B recorrente, limpeza de escritórios, comércio e contratos de gestão de edifícios."
          }
        ]
      },
      entsorgungSec: {
        title: "Parte 2 — Gestão de Resíduos & ERZ (Entsorgung + Recycling Zürich)",
        desc: "Entidade responsável: ERZ Service Center (044 417 77 77, Seg–Sex 07:00–17:00). Regulamentos rigorosos e tarifas obrigatórias.",
        points: [
          {
            title: "⚠️ Vouchers Gratuitos Abolidos Desde Maio de 2025!",
            text: "Os antigos vouchers de 400 kg de eliminação gratuita para famílias já não existem. Nos pontos limpos municipais (Looächer, Werdhölzli) cobra-se entre CHF 20.– e 22.70 por cada 100 kg. Toda a remoção é um custo direto."
          },
          {
            title: "Serviço de Recolha ERZ — Regras e Agendamento Apenas por Telefone",
            text: "Reservas exclusivamente por telefone (044 417 77 77). Recolhas apenas de segunda a sexta-feira (sem fins de semana), com 3 dias úteis de antecedência. Depósito na estrada antes das 07:00. Máximo 60 minutos de carga por dia/local."
          },
          {
            title: "Tarifas Oficiais ERZ",
            text: "Deslocação + 15 min de carga + eliminação: CHF 86.50 tarifa fixa. Cada 15 min adicionais: CHF 86.50. Taxa de peso: CHF 22.70 / 100 kg. Cancelamento tardio após as 12:00 do dia anterior: CHF 86.50."
          },
          {
            title: "Rede Municipal de Pontos Limpos",
            text: "Grandes centros em Hagenholz, Werdhölzli e Looächer; 18 pontos limpos móveis (máx. 40 kg e 2.5m por objeto); Elétrico de Carga (Cargo-Tram) para pequenas quantidades; ~170 pontos de reciclagem de bairro."
          }
        ]
      },
      parkierenSec: {
        title: "Parte 3 — Estacionamento, Proibições e Acessos da Polícia",
        desc: "Diretivas oficiais de trânsito da Polícia da Cidade de Zurique e do Departamento de Trânsito (DAV).",
        points: [
          {
            title: "Prazos Oficiais para Reserva de Estacionamento",
            text: "Zona Azul: Mínimo de 7 dias úteis de antecedência junto da Polícia da Cidade! Zona Branca: Mínimo de 3 dias úteis. Pedidos urgentes requerem contacto direto com o chefe do distrito policial."
          },
          {
            title: "Custos Obrigatórios para Reserva de Lugares",
            text: "Para 1–2 lugares adjacentes durante 1 dia, as taxas oficiais variam entre CHF 120.– e CHF 170.–."
          },
          {
            title: "Nuance Legal: Carga e Descarga vs Estacionamento",
            text: "Uso do passeio permitido se garantidos 1.5 metros livres para peões. A carga ativa é permitida em zonas de PROIBIDO ESTACIONAR, mas estritamente PROIBIDA em zonas de PROHIBIDO PARAR."
          },
          {
            title: "Distrito 1 Centro Histórico e Zonas Protegidas",
            text: "O Distrito 1 (Niederdorf, Bahnhofstrasse) está sujeito a controlo rigoroso devido aos elétricos e zonas pedonais (4–6 semanas de antecedência no DAV Mühlegasse 18/22)."
          }
        ]
      },
      gliederungSec: {
        title: "Parte 4 — Estrutura Urbana e Setores nos 12 Distritos",
        desc: "Zurique abrange 12 distritos e 34 bairros com características estruturais distintas.",
        points: [
          {
            title: "Distrito 1 (Centro Histórico / Altstadt)",
            text: "Núcleo histórico com escadarias estreitas, zonas pedonais e património protegido. Requer logística manual especializada e equipamento compacto."
          },
          {
            title: "Distrito 11 (Oerlikon, Affoltern, Seebach)",
            text: "Rápido crescimento com novos edifícios residenciais e comerciais. Elevada densidade de escritórios B2B e manutenção comercial."
          },
          {
            title: "Distrito 12 (Schwamendingen) e Cooperativas de Habitação",
            text: "Forte concentração de cooperativas de habitação. Decisões através da direção/assembleia geral: um alvo B2B prioritário para contratos de manutenção recorrente."
          },
          {
            title: "Bairros Periféricos (Construções 1940–1970)",
            text: "Edifícios residenciais sem elevador, portas de cave estreitas e restrições de acesso específicas para remoções e limpeza de áreas comuns."
          }
        ]
      },
      strategieSec: {
        title: "Parte 6 — Avaliação Estratégica B2B para a Kraken PFM",
        desc: "Posicionamento pragmático: A Kraken foca-se em Zurique na qualidade, recorrência B2B e referências sólidas.",
        points: [
          {
            title: "Foco B2B em Vez de Guerra de Preços B2C",
            text: "Competir em preço contra grandes plataformas B2C nos 2 dias de pico é pouco rentável. A Kraken concentra-se na manutenção B2B recorrente, escritórios e gestão de edifícios."
          },
          {
            title: "Valor da Supervisão Direta e Fiabilidade",
            text: "Para clientes B2B recorrentes, o tempo de viagem (36 min a partir da base) amortiza-se facilmente. As empresas valorizam o contacto direto com o proprietário e pessoal fixo com CCT."
          },
          {
            title: "Utilização de Referências Consolidadas em Zurique",
            text: "A Kraken já conta com referências comerciais satisfeitas em Zurique (ex. salão comercial em Zurique Cidade), servindo de base para o crescimento B2B."
          }
        ]
      },
      offenSec: {
        title: "Parte 7 — Pontos Abertos e Verificações Regulamentares",
        desc: "Guia transparente sobre consultas municipais em curso.",
        points: [
          {
            title: "Estatuto de Resíduos Comerciais vs Domésticos",
            text: "Esclarecimento com a ERZ (044 417 77 77): A remoção em habitações por mandato do cliente é classificada como resíduo doméstico do cliente ou resíduo comercial da empresa?"
          },
          {
            title: "Limite para PMEs (<250 Funcionários)",
            text: "Os resíduos equiparáveis de PMEs com menos de 250 funcionários a nível nacional beneficiam da recolha pública básica."
          },
          {
            title: "Dureza da Água e Química de Limpeza em Zurique",
            text: "A água do lago de Zurique apresenta uma dureza média (15–18 °fH), substancialmente mais macia do que a de Schaffhausen (33–34 °fH), permitindo uma dosagem ecológica e otimizada."
          }
        ]
      }
    }
  };

  const tData = content[lang as keyof typeof content] || content.de;

  return (
    <section className="py-20 px-6 bg-slate-900 text-white relative overflow-hidden border-t-2 border-cyan-500/30">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>{tData.badge}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {tData.title}
          </h2>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal max-w-3xl mx-auto">
            {tData.subtitle}
          </p>
        </div>

        {/* Top Key Figures Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Leerstand</span>
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">0.11%</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Stadt Zürich (01.06.2026)</div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Kündigungen</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">2 Termine</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">31. März & 30. September</div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">ERZ Tarif</span>
              <Trash2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">CHF 86.50</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Anfahrt + 15 Min (ERZ 044 417 77 77)</div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Parkier-Vorlauf</span>
              <Car className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">7 / 3 Tage</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Blaue (7T) / Weisse (3T) Zone</div>
          </div>
        </div>

        {/* Feature Hero Banner */}
        <div className="bg-gradient-to-r from-slate-800 via-[#002D5B] to-slate-800 rounded-3xl p-8 md:p-10 border border-cyan-500/30 shadow-2xl mb-16 relative overflow-hidden">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>{tData.bannerBadge}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {tData.bannerTitle}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                {tData.bannerDesc}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate?.('consultation')}
                  className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-900 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-cyan-400/20 inline-flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{tData.bannerBtn}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="text-xs font-extrabold uppercase text-cyan-400 tracking-wider">
                {tData.bannerImgTag}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {tData.baseDesc}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-slate-200">Standard-Garantie:</span>
                <span className="text-emerald-400 font-bold">100% Abnahme</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-10 pb-2 border-b border-slate-800">
          {(Object.keys(tData.tabs) as Array<keyof typeof tData.tabs>).map((tabKey) => {
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan-400 text-slate-900 shadow-md shadow-cyan-400/20 scale-105'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {tabKey === 'struktur' && <Building2 className="w-3.5 h-3.5" />}
                {tabKey === 'entsorgung' && <Trash2 className="w-3.5 h-3.5" />}
                {tabKey === 'parkieren' && <Car className="w-3.5 h-3.5" />}
                {tabKey === 'gliederung' && <MapPin className="w-3.5 h-3.5" />}
                {tabKey === 'strategie' && <Briefcase className="w-3.5 h-3.5" />}
                {tabKey === 'offen' && <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{tData.tabs[tabKey]}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700/80 shadow-xl min-h-[380px]">
          
          {/* TAB 1: STRUKTUR */}
          {activeTab === 'struktur' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-700/80 pb-4">
                <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-cyan-400" />
                  <span>{tData.strukturSec.title}</span>
                </h3>
                <p className="text-slate-400 text-sm mt-1">{tData.strukturSec.desc}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {tData.strukturSec.points.map((pt, idx) => (
                  <div key={idx} className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 mb-3">
                        {tData.factTag}{idx + 1}
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">{pt.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{pt.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ENTSORGUNG */}
          {activeTab === 'entsorgung' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-700/80 pb-4">
                <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
                  <Trash2 className="w-6 h-6 text-emerald-400" />
                  <span>{tData.entsorgungSec.title}</span>
                </h3>
                <p className="text-slate-400 text-sm mt-1">{tData.entsorgungSec.desc}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {tData.entsorgungSec.points.map((pt, idx) => (
                  <div key={idx} className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700">
                    <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 mb-3">
                      {tData.ruleTag}
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{pt.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{pt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PARKIERUNG */}
          {activeTab === 'parkieren' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-700/80 pb-4">
                <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
                  <Car className="w-6 h-6 text-indigo-400" />
                  <span>{tData.parkierenSec.title}</span>
                </h3>
                <p className="text-slate-400 text-sm mt-1">{tData.parkierenSec.desc}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {tData.parkierenSec.points.map((pt, idx) => (
                  <div key={idx} className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700">
                    <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 mb-3">
                      {tData.parkingTag}
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{pt.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{pt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GLIEDERUNG */}
          {activeTab === 'gliederung' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-700/80 pb-4">
                <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-amber-400" />
                  <span>{tData.gliederungSec.title}</span>
                </h3>
                <p className="text-slate-400 text-sm mt-1">{tData.gliederungSec.desc}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {tData.gliederungSec.points.map((pt, idx) => (
                  <div key={idx} className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700">
                    <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 mb-3">
                      {tData.circleTag}
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{pt.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{pt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: STRATEGIE */}
          {activeTab === 'strategie' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-700/80 pb-4">
                <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-cyan-400" />
                  <span>{tData.strategieSec.title}</span>
                </h3>
                <p className="text-slate-400 text-sm mt-1">{tData.strategieSec.desc}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {tData.strategieSec.points.map((pt, idx) => (
                  <div key={idx} className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 border-l-4 border-l-cyan-400">
                    <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 mb-3">
                      {tData.strategyTag}
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{pt.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{pt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: OFFEN */}
          {activeTab === 'offen' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-700/80 pb-4">
                <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                  <span>{tData.offenSec.title}</span>
                </h3>
                <p className="text-slate-400 text-sm mt-1">{tData.offenSec.desc}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {tData.offenSec.points.map((pt, idx) => (
                  <div key={idx} className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 border-l-4 border-l-amber-400">
                    <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 mb-3">
                      {tData.complianceTag}
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{pt.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{pt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
