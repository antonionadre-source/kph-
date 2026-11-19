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
  FileText
} from 'lucide-react';

interface SchaffhausenDossierSectionProps {
  onNavigate?: (page: string) => void;
}

export const SchaffhausenDossierSection: React.FC<SchaffhausenDossierSectionProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const rawLang = language || 'de';
  const activeLang = (rawLang === 'de-CH' || rawLang === 'de') ? 'de' : rawLang;
  const lang = ['de', 'en', 'es', 'fr', 'it', 'pt'].includes(activeLang) ? activeLang : 'de';

  const [activeTab, setActiveTab] = useState<'kuendigung' | 'parkieren' | 'altstadt' | 'entsorgung' | 'gewerbe' | 'hauswartung' | 'quartiere'>('kuendigung');

  const content = {
    de: {
      badge: "Geprüftes Dossier Schaffhausen 2026",
      title: "Lokale Besonderheiten & Rechtliche Rahmenbedingungen in Schaffhausen",
      subtitle: "Fundierte Fakten zu Kündigungsterminen, Güterumschlag, Altstadt-Vorschriften und Entsorgungsregeln – für Mieter, Eigentümer und Gewerbebetriebe.",
      bannerBadge: "Lokal verankert & GAV-konform",
      bannerTitle: "Ihr zertifizierter Partner an der Seewadelstrasse 3",
      bannerDesc: "Kraken PFM kennt jede Gasse in der Altstadt, jede Parkregel der Stadtpolizei und jede Vorgabe zur Wohnungsabgabe im Kanton Schaffhausen. Profitieren Sie von 100% Abnahmegarantie und echten Lokalkenntnissen.",
      bannerBtn: "Offerte für Schaffhausen berechnen",
      bannerImgTag: "📍 Schaffhausen Stadt & Region",
      factTag: "Fakt #",
      ruleTag: "Reglement",
      altstadtTag: "Altstadt Ziffer",
      wasteTag: "Vorschrift",
      commercialTag: "Gewerbe",
      ppvoTag: "PPVO 400.4",
      baseDesc: "Von dieser zentralen Adresse aus starten unsere Teams täglich zu Einsätzen im gesamten Stadtgebiet sowie in allen umliegenden Gemeinden des Kantons Schaffhausen.",
      tabs: {
        kuendigung: "Kündigungstermine",
        parkieren: "Güterumschlag & Parkieren",
        altstadt: "Altstadt-Sonderfall",
        entsorgung: "Abfall & Böcklisack",
        gewerbe: "Gewerbe & Herblingertal",
        hauswartung: "Hauswartung & PPVO",
        quartiere: "Stützpunkt & Quartiere"
      },
      kuendigungSec: {
        title: "Kündigungstermine & Mietrechtliche Praxis im Kanton Schaffhausen",
        desc: "Die mietrechtliche Praxis im Kanton Schaffhausen unterscheidet sich in wichtigen Details von Nachbarkantonen wie Zürich.",
        points: [
          {
            title: "Monatliche Kündigungsmöglichkeit (OR 266c)",
            text: "Im Kanton Schaffhausen ist die Kündigung auf das Ende jedes Monats zulässig – mit einziger Ausnahme des 31. Dezember. Ortsübliche Termine gelten nur subsidiär; vertraglich vereinbarte Termine haben stets Vorrang."
          },
          {
            title: "Niedrige Leerstandsquote (0.5% / 0.8%)",
            text: "Mit einer Leerstandsquote von 0.5% in der Stadt Schaffhausen und 0.8% im Gesamtkanton (im Vergleich zu 1.0% schweizweit) herrscht ein umkämpfter Mietmarkt. Übergaben müssen absolut reibungslos verlaufen."
          },
          {
            title: "Energetische Sanierungswelle & CO2-Ziele",
            text: "Über 5'100 Heizungsauswechslungen zwischen 2019 und 2025 sowie das kantonale CO2-Reduktionsziel von 52% bis 2030 (inkl. M17 Ladeinfrastruktur) erzeugen erhöhten Reinigungsbedarf bei Bautätigkeiten und Treppenhäusern."
          }
        ]
      },
      parkierenSec: {
        title: "Güterumschlag, Parkieren & Zufahrt bei der Reinigung",
        desc: "Exakte Einhaltung der verkehrsrechtlichen Vorgaben sichert stressfreie Einsätze ohne Bußgelder.",
        points: [
          {
            title: "Rechtliche Definition 'Güterumschlag' (BGE 89 IV 213)",
            text: "Güterumschlag bezieht sich rein rechtlich strikt auf das Aufladen und Abladen. Das Vorbereiten von Ladegut, Packen, Möbel demontieren oder Abstellen des Fahrzeugs ohne aktive Ladebewegung gilt ausdrücklich NICHT als Güterumschlag."
          },
          {
            title: "4-Stunden-Höchstparkdauer in Quartieren",
            text: "Auf signalisierten Quartierstrassen gilt eine maximale Parkdauer von 4 Stunden (Mo–Fr 08:00–18:00, Sa 08:00–16:00). Eine allgemeine Anwohnerparkkarte existiert nach der Ablehnung beim Volksentscheid 2019 (~55% Nein) nicht."
          },
          {
            title: "Bewilligungen via Parkingpay App",
            text: "Handwerkerbewilligung: Erlaubt Zufahrt zur Fussgängerzone ab 11:00 Uhr (Parkieren verboten, ausser Fahrzeug dient als mobile Werkstatt). Tagesbewilligung Spezial & Sonderbewilligungen >4h kosten CHF 3 (2h), CHF 7 (5h) oder CHF 15 (1 Tag)."
          },
          {
            title: "Halteverbot für Umzugstage",
            text: "Ein offizielles Halteverbot für den Umzugstag erfordert mindestens 14 Tage Vorlaufzeit bei der Stadtpolizei Schaffhausen (stadtpolizei@stsh.ch)."
          }
        ]
      },
      altstadtSec: {
        title: "Die Schaffhauser Altstadt als Sonderfall",
        desc: "Historisches Riegelwerk, enges Gassennetz und strenge kommunale Verordnungen verlangen angepasste Reinigungskonzepte.",
        points: [
          {
            title: "Keine Pflichtparkplätze (PPVO Art. 6 Abs. 4)",
            text: "In der Altstadtzone bestehen laut städtischer Parkplatzverordnung keine Pflichtparkplätze für Bauten."
          },
          {
            title: "24/7 Parkverbot in der Fussgängerzone",
            text: "In der Fussgängerzone herrscht ein durchgehendes Parkverbot. Reine Fahrbewilligungen berechtigen zu keinem Zeitpunkt zum Parkieren."
          },
          {
            title: "Abfallregelung Altstadt Tour 6",
            text: "Das Bereitstellen loser Abfallsäcke an der Strasse ist in der Altstadt verboten. Es gilt die zwingende Nutzung der Unterflurcontainer."
          }
        ]
      },
      entsorgungSec: {
        title: "Abfallentsorgung & Böcklisack bei der Wohnungsabgabe",
        desc: "Vorschriftsgemässe Mülltrennung und Entsorgung verhindern Verzögerungen bei der Wohnungsübergabe.",
        points: [
          {
            title: "Offizieller Gebührensack 'Böcklisack'",
            text: "Im Kanton Schaffhausen gilt der offizielle 'Böcklisack' (Grössen: 17L, 35L, 60L, 110L). Alte Gebührenmarken sind ungültig."
          },
          {
            title: "Sperrgutmarken & Reglement",
            text: "Sperrgut erfordert CHF 5.00 Marken pro Einheit (50x50x200cm = 1 Marke, 100x50x200cm = 2 Marken). Teppichrollen max. 2m x 30cm. Sperrgutmarken dürfen keinesfalls für 110L-Säcke verwendet werden."
          },
          {
            title: "Bereitstellungszeiten",
            text: "Müll und Sperrgut müssen spätestens bis 07:00 Uhr am Abholtag bereitstehen. Bei sommerlichen Temperaturen über 30°C gilt die frühere Bereitstellung ab 06:00 Uhr."
          }
        ]
      },
      gewerbeSec: {
        title: "Gewerbereinigung & Wirtschaftsstandort Schaffhausen",
        desc: "Spezifische Reinigungs- und Facility-Management-Lösungen für Industrie, Gewerbe und Sportstätten.",
        points: [
          {
            title: "Entwicklungs-Hub Herblingertal",
            text: "Das Industrie- und Gewerbegebiet Herblingertal umfasst 105 Hektar mit ca. 4'000 Beschäftigten als wichtiges Transformationsgebiet."
          },
          {
            title: "FCS Arena Komplexe",
            text: "8'100 m² Multifunktionsarena mit 3 Geschossen für Gewerbe-, Büro-, Gastronomie- und VIP-Lounge-Flächen."
          },
          {
            title: "PPVO-Klassifizierung der Nutzungen",
            text: "Klare Differenzierung zwischen kundenintensiver Nutzung (Fitnesscenter, Coiffeur, Arztpraxen, Banken, Post) und kundenextensiver Nutzung (Anwaltskanzleien, Architekturbüros, Versicherungen, Forschungslabore)."
          }
        ]
      },
      hauswartungSec: {
        title: "Hauswartung & Nebenräume (PPVO 400.4)",
        desc: "Gesetzliche Vorgaben für Wohnbauten und Gemeinschaftsanlagen im Kanton Schaffhausen.",
        points: [
          {
            title: "Gedeckte Kinderwagenräume (Art. 10)",
            text: "Bei Wohnbauten mit mehr als 2 Wohnungen sind gedeckte Abstellplätze für Kinderwagen und Kinderanhänger gesetzlich obligatorisch."
          },
          {
            title: "Velo-Abstellplätze (Art. 8)",
            text: "Pflicht zur Bereitstellung von mindestens 1 Veloplatz pro Zimmer in Wohngebäuden."
          },
          {
            title: "Gemeinschaftsanlagen (Art. 15 Abs. 2)",
            text: "Gesetzlich verankerte gemeinsame Unterhaltspflicht aller Eigentümer für Gemeinschaftsanlagen."
          },
          {
            title: "Begrünung & Ersatzabgabe",
            text: "Verpflichtende Begrünung für unbefestigte Oberflächenparkplätze (Art. 11 Abs. 8). Ersatzabgabe bei fehlenden Pflichtparkplätzen: CHF 10'000 pro Parkfeld (indexiert)."
          }
        ]
      },
      quartiereSec: {
        title: "Unser Stützpunkt & Verifizierte Quartiere in Schaffhausen",
        desc: "Direkte Präsenz vor Ort ermöglicht staufreie Anfahrten und reaktionsschnelle Einsätze.",
        baseTitle: "Einsatz-Stützpunkt Schaffhausen",
        baseAddress: "Seewadelstrasse 3, 8203 Schaffhausen",
        quartiereTitle: "Verifizierte Schaffhauser Quartiere & Zonen",
        districts: [
          "Altstadt (8200)",
          "Altstadtperipherie",
          "Breite",
          "Emmersberg",
          "Steig",
          "Gruben",
          "Herblingen (8207)",
          "Buchthalen",
          "Hemmental (8231)"
        ]
      }
    },
    en: {
      badge: "Verified Schaffhausen Dossier 2026",
      title: "Local Characteristics & Legal Framework in Schaffhausen",
      subtitle: "Verified facts on termination dates, cargo loading, Old Town regulations, and waste disposal rules – for tenants, property owners, and businesses.",
      bannerBadge: "Locally rooted & GAV-compliant",
      bannerTitle: "Your certified partner at Seewadelstrasse 3",
      bannerDesc: "Kraken PFM knows every alley in the Old Town, every parking rule of the city police, and every apartment handover requirement in the Canton of Schaffhausen. Benefit from a 100% handover guarantee and genuine local knowledge.",
      bannerBtn: "Calculate quote for Schaffhausen",
      bannerImgTag: "📍 Schaffhausen City & Region",
      factTag: "Fact #",
      ruleTag: "Regulation",
      altstadtTag: "Old Town Rule",
      wasteTag: "Directive",
      commercialTag: "Commercial",
      ppvoTag: "PPVO 400.4",
      baseDesc: "From this central address, our teams dispatch daily for assignments across the entire city and all surrounding municipalities in the Canton of Schaffhausen.",
      tabs: {
        kuendigung: "Termination Dates",
        parkieren: "Cargo Loading & Parking",
        altstadt: "Old Town Rules",
        entsorgung: "Waste & Böcklisack",
        gewerbe: "Commercial & Herblingertal",
        hauswartung: "Property Maintenance",
        quartiere: "Hub & Districts"
      },
      kuendigungSec: {
        title: "Notice Periods & Tenancy Practice in Canton Schaffhausen",
        desc: "Tenancy law practice in Canton Schaffhausen differs in key details from neighboring cantons like Zurich.",
        points: [
          {
            title: "Monthly Termination (OR 266c)",
            text: "In Canton Schaffhausen, lease termination is permitted at the end of any month except 31 December. Local customary dates apply only secondarily; contractually agreed dates always take precedence."
          },
          {
            title: "Low Vacancy Rate (0.5% / 0.8%)",
            text: "With a vacancy rate of 0.5% in Schaffhausen city and 0.8% canton-wide (vs 1.0% nationally), property handovers must be executed smoothly without defects."
          },
          {
            title: "Renovation Wave & CO2 Targets",
            text: "Over 5,100 heating replacements (2019–2025) and the cantonal 52% CO2 reduction target by 2030 generate increased demand for post-construction and stairwell cleaning."
          }
        ]
      },
      parkierenSec: {
        title: "Cargo Loading, Parking & Access Rules",
        desc: "Strict compliance with traffic rules guarantees hassle-free operations without parking fines.",
        points: [
          {
            title: "Legal Definition of 'Cargo Loading' (BGE 89 IV 213)",
            text: "Cargo loading strictly refers to active loading and unloading. Preparing goods, packing, assembling/disassembling furniture, or parking without active movement does NOT legally constitute cargo loading."
          },
          {
            title: "4-Hour Max Parking in Residential Streets",
            text: "Signalized residential streets impose a 4-hour max limit (Mon–Fri 08:00–18:00, Sat 08:00–16:00). A general resident parking card was rejected in the 2019 referendum (~55% No)."
          },
          {
            title: "Parking Permits via Parkingpay App",
            text: "Tradesperson Permit: Allows access to pedestrian zone from 11:00 AM (parking forbidden unless vehicle serves as a mobile workshop). Day Permits >4h cost CHF 3 (2h), CHF 7 (5h), or CHF 15 (1 day)."
          },
          {
            title: "No-Parking Permit for Moving Day",
            text: "An official no-parking zone for moving day requires at least 14 days advance notice with the Schaffhausen City Police (stadtpolizei@stsh.ch)."
          }
        ]
      },
      altstadtSec: {
        title: "The Schaffhausen Old Town Regulations",
        desc: "Historic timber framing, narrow alleys, and strict municipal ordinances demand specialized care.",
        points: [
          {
            title: "No Mandatory Parking Spaces (PPVO Art. 6 Para. 4)",
            text: "Under municipal parking ordinance, buildings in the Old Town zone are exempt from mandatory parking space requirements."
          },
          {
            title: "24/7 Parking Ban in Pedestrian Zone",
            text: "Driving permits do not authorize parking at any time in the pedestrian zone."
          },
          {
            title: "Old Town Waste Tour 6",
            text: "Placing loose trash bags on the curb is prohibited in the Old Town; mandatory use of underground waste containers applies."
          }
        ]
      },
      entsorgungSec: {
        title: "Waste Disposal & 'Böcklisack' Rules",
        desc: "Compliant waste separation prevents delays during apartment handover.",
        points: [
          {
            title: "Official 'Böcklisack' Trash Bag",
            text: "Canton Schaffhausen requires the official 'Böcklisack' (sizes: 17L, 35L, 60L, 110L). Old tax stamps are invalid."
          },
          {
            title: "Bulky Waste Regulations",
            text: "Bulky waste requires CHF 5.00 stamps per unit (50x50x200cm = 1 stamp). Carpet rolls max 2m x 30cm. Stamps must not be used on 110L sacks."
          },
          {
            title: "Set-out Deadlines",
            text: "Waste must be set out by 07:00 AM on collection day, or by 06:00 AM when temperatures exceed 30°C."
          }
        ]
      },
      gewerbeSec: {
        title: "Commercial Cleaning & Business District",
        desc: "Tailored facility solutions for industrial, commercial, and sports complexes.",
        points: [
          {
            title: "Herblingertal Industrial Hub",
            text: "105 hectares with approx. 4,000 employees forming a major commercial and logistics hub."
          },
          {
            title: "FCS Arena Facilities",
            text: "8,100 m² multi-purpose stadium spanning 3 levels of commercial, office, gastronomy, and VIP spaces."
          },
          {
            title: "PPVO Usage Classification",
            text: "Distinguishes customer-intensive uses (fitness, hairdressers, doctors, banks) from customer-extensive uses (law firms, architects, insurance, labs)."
          }
        ]
      },
      hauswartungSec: {
        title: "Facility Maintenance & Ancillary Areas (PPVO 400.4)",
        desc: "Legal requirements for residential buildings and shared facilities in Schaffhausen.",
        points: [
          {
            title: "Covered Stroller Storage (Art. 10)",
            text: "Residential buildings with >2 apartments legally require covered storage for strollers and bike trailers."
          },
          {
            title: "Bicycle Parking (Art. 8)",
            text: "Mandatory provision of at least 1 bicycle space per room in residential buildings."
          },
          {
            title: "Shared Maintenance Duties (Art. 15 Para. 2)",
            text: "Statutory joint maintenance obligation for all co-owners regarding shared facilities."
          },
          {
            title: "Greening & Replacement Fee",
            text: "Mandatory greening for unpaved surface parking (Art. 11 Para. 8). Replacement fee for missing parking spaces: CHF 10,000 per space."
          }
        ]
      },
      quartiereSec: {
        title: "Local Base & Verified Schaffhausen Districts",
        desc: "Direct local presence ensures fast response times and zero travel surcharges.",
        baseTitle: "Schaffhausen Operational Base",
        baseAddress: "Seewadelstrasse 3, 8203 Schaffhausen",
        quartiereTitle: "Verified Schaffhausen Districts & Zones",
        districts: [
          "Altstadt (8200)",
          "Altstadtperipherie",
          "Breite",
          "Emmersberg",
          "Steig",
          "Gruben",
          "Herblingen (8207)",
          "Buchthalen",
          "Hemmental (8231)"
        ]
      }
    },
    es: {
      badge: "Dossier Verificado Schaffhausen 2026",
      title: "Características Locales y Marco Legal en Schaffhausen",
      subtitle: "Datos contrastados sobre plazos de rescisión, carga de mercancías, normativa del casco antiguo y gestión de residuos – para inquilinos, propietarios y empresas.",
      bannerBadge: "Arraigo local y conforme a GAV",
      bannerTitle: "Su socio certificado en Seewadelstrasse 3",
      bannerDesc: "Kraken PFM conoce cada callejón del casco antiguo, cada norma de aparcamiento de la policía local y cada requisito de entrega de vivienda en el cantón de Schaffhausen. Benefíciese del 100% de garantía de entrega y un auténtico conocimiento local.",
      bannerBtn: "Calcular presupuesto para Schaffhausen",
      bannerImgTag: "📍 Ciudad y Región de Schaffhausen",
      factTag: "Dato #",
      ruleTag: "Reglamento",
      altstadtTag: "Casco Antiguo",
      wasteTag: "Normativa",
      commercialTag: "Comercial",
      ppvoTag: "PPVO 400.4",
      baseDesc: "Desde esta dirección central, nuestros equipos salen a diario para prestar servicios en toda la ciudad y en todos los municipios del Cantón de Schaffhausen.",
      tabs: {
        kuendigung: "Plazos de Rescisión",
        parkieren: "Carga y Aparcamiento",
        altstadt: "Casco Antiguo",
        entsorgung: "Residuos y Böcklisack",
        gewerbe: "Comercial e Industrial",
        hauswartung: "Mantenimiento y PPVO",
        quartiere: "Sede y Distritos"
      },
      kuendigungSec: {
        title: "Plazos de Rescisión y Práctica en el Cantón de Schaffhausen",
        desc: "La práctica del derecho de arrendamiento en Schaffhausen difiere en detalles clave con respecto a cantones vecinos como Zúrich.",
        points: [
          {
            title: "Rescisión Mensual (OR 266c)",
            text: "En el cantón de Schaffhausen se permite la rescisión al final de cualquier mes, excepto el 31 de diciembre. Los plazos habituales locales solo se aplican de forma subsidiaria; los plazos contractuales siempre prevalecen."
          },
          {
            title: "Baja Tasa de Desocupación (0.5% / 0.8%)",
            text: "Con una tasa de vacantes de tan solo el 0.5% en la ciudad y el 0.8% en el cantón, las entregas de viviendas deben ejecutarse de forma impecable y sin objeciones."
          },
          {
            title: "Ola de Renovación Energética y Objetivos de CO2",
            text: "Más de 5,100 sustituciones de calefacción (2019-2025) y el objetivo cantonal de reducción del 52% de CO2 para 2030 generan una gran demanda de limpieza tras obras y en zonas comunes."
          }
        ]
      },
      parkierenSec: {
        title: "Carga de Mercancías, Aparcamiento y Accesos",
        desc: "El cumplimiento estricto de las normas de tráfico garantiza servicios sin contratiempos ni multas.",
        points: [
          {
            title: "Definición Legal de 'Carga de Mercancías' (BGE 89 IV 213)",
            text: "En sentido legal estricto, la carga de mercancías se limita a la carga y descarga activa. Preparar mercancía, empaquetar, desmontar muebles o aparcar sin movimiento activo NO se considera legalmente carga de mercancías."
          },
          {
            title: "Límite de Aparcamiento de 4 Horas en Barrios",
            text: "En calles residenciales señalizadas rige un límite máximo de 4 horas (Lun-Vie 08:00-18:00, Sáb 08:00-16:00). La tarjeta general de residente fue rechazada en referéndum en 2019 (~55% No)."
          },
          {
            title: "Permisos a través de la App Parkingpay",
            text: "Permiso para gremios: Acceso a la zona peatonal a partir de las 11:00 (prohibido aparcar a menos que el vehículo sea un taller móvil). Permisos diarios >4h cuestan CHF 3 (2h), CHF 7 (5h) o CHF 15 (1 día)."
          },
          {
            title: "Reserva de Espacio para Día de Mudanza",
            text: "Reservar una zona de no aparcar para la mudanza requiere al menos 14 días de antelación ante la Policía de la Ciudad de Schaffhausen (stadtpolizei@stsh.ch)."
          }
        ]
      },
      altstadtSec: {
        title: "El Casco Antiguo de Schaffhausen como Caso Especial",
        desc: "Estructuras históricas de entramado de madera, avenidas estrechas y estrictas ordenanzas municipales exigen cuidados especializados.",
        points: [
          {
            title: "Sin Obligación de Estacionamiento (PPVO Art. 6 Párr. 4)",
            text: "Según la ordenanza municipal de aparcamiento, los edificios del casco antiguo están exentos de la obligación de disponer de plazas de aparcamiento."
          },
          {
            title: "Prohibición de Aparcar 24/7 en Zona Peatonal",
            text: "Los permisos de circulación no autorizan en ningún momento el estacionamiento en la zona peatonal."
          },
          {
            title: "Residuos Casco Antiguo Ruta 6",
            text: "Está prohibido depositar bolsas de basura sueltas en la calle; es obligatorio el uso de contenedores subterráneos."
          }
        ]
      },
      entsorgungSec: {
        title: "Gestión de Residuos y 'Böcklisack' en Entregas",
        desc: "La separación y eliminación adecuada de residuos evita retrasos en la entrega de la vivienda.",
        points: [
          {
            title: "Bolsa Oficial de Basura 'Böcklisack'",
            text: "En Schaffhausen es obligatoria la bolsa oficial 'Böcklisack' (17L, 35L, 60L, 110L). Las antiguas etiquetas carecen de validez."
          },
          {
            title: "Reglamento de Enseres Voluminosos",
            text: "Los objetos voluminosos requieren sellos de CHF 5.00 por unidad (50x50x200cm = 1 sello). Alfombras máx. 2m x 30cm. No se permiten sellos para bolsas de 110L."
          },
          {
            title: "Horarios de Depósito",
            text: "Los residuos deben depositarse a más tardar a las 07:00 del día de recogida, o a las 06:00 en días calurosos superiores a 30°C."
          }
        ]
      },
      gewerbeSec: {
        title: "Limpieza Comercial e Industrial en Schaffhausen",
        desc: "Soluciones de limpieza de instalaciones adaptadas para áreas industriales, comerciales y estadios.",
        points: [
          {
            title: "Centro de Desarrollo Herblingertal",
            text: "Zona industrial de 105 hectáreas con aprox. 4,000 empleados, clave en la transformación comercial de la región."
          },
          {
            title: "Complejo FCS Arena",
            text: "Estadio multipropósito de 8,100 m² distribuido en 3 niveles con áreas comerciales, oficinas, gastronomía y salones VIP."
          },
          {
            title: "Clasificación de Uso según PPVO",
            text: "Diferenciación clara entre usos de alta concurrencia de clientes (gimnasios, peluquerías, clínicas, bancos) y usos de baja concurrencia (bufetes, arquitectos, aseguradoras, laboratorios)."
          }
        ]
      },
      hauswartungSec: {
        title: "Mantenimiento de Instalaciones y Áreas Comunes (PPVO 400.4)",
        desc: "Requisitos legales para edificios residenciales y zonas comunitarias en el cantón de Schaffhausen.",
        points: [
          {
            title: "Espacios Cubiertos para Cochecitos (Art. 10)",
            text: "En edificios residenciales con más de 2 viviendas es obligatorio por ley disponer de espacio cubierto para cochecitos de bebé y remolques."
          },
          {
            title: "Aparcamiento para Bicicletas (Art. 8)",
            text: "Obligación de proporcionar al menos 1 plaza de bicicleta por habitación en edificios residenciales."
          },
          {
            title: "Mantenimiento de Instalaciones Comunes (Art. 15 Párr. 2)",
            text: "Obligación legal de mantenimiento conjunto entre los copropietarios de las zonas e instalaciones comunitarias."
          },
          {
            title: "Acondicionamiento Verde y Compensación",
            text: "Obligación de zonas verdes en aparcamientos no asfaltados (Art. 11 Párr. 8). Tasa de sustitución por plazas no construidas: CHF 10,000 por plaza."
          }
        ]
      },
      quartiereSec: {
        title: "Sede Operativa y Distritos Verificados en Schaffhausen",
        desc: "Nuestra presencia local directa garantiza la máxima rapidez sin recargos por desplazamiento.",
        baseTitle: "Sede de Operaciones Schaffhausen",
        baseAddress: "Seewadelstrasse 3, 8203 Schaffhausen",
        quartiereTitle: "Distritos y Zonas Verificadas en Schaffhausen",
        districts: [
          "Altstadt (8200)",
          "Altstadtperipherie",
          "Breite",
          "Emmersberg",
          "Steig",
          "Gruben",
          "Herblingen (8207)",
          "Buchthalen",
          "Hemmental (8231)"
        ]
      }
    },
    fr: {
      badge: "Dossier Vérifié Schaffhouse 2026",
      title: "Spécificités Locales & Cadre Légal à Schaffhouse",
      subtitle: "Faits vérifiés sur les délais de résiliation, la manutention, le règlement de la vieille ville et la gestion des déchets.",
      bannerBadge: "Ancrage local & conforme CCT",
      bannerTitle: "Votre partenaire certifié à la Seewadelstrasse 3",
      bannerDesc: "Kraken PFM connaît chaque ruelle de la vieille ville, chaque règle de stationnement de la police municipale et chaque exigence pour l'état des lieux dans le canton de Schaffhouse. Profitez d'une garantie de remise à 100% et d'une vraie expertise locale.",
      bannerBtn: "Calculer un devis pour Schaffhouse",
      bannerImgTag: "📍 Schaffhouse Ville & Région",
      factTag: "Fait #",
      ruleTag: "Règlement",
      altstadtTag: "Vieille Ville",
      wasteTag: "Directive",
      commercialTag: "Commercial",
      ppvoTag: "PPVO 400.4",
      baseDesc: "Depuis cette adresse centrale, nos équipes interviennent quotidiennement dans toute la ville et dans toutes les communes environnantes du canton de Schaffhouse.",
      tabs: {
        kuendigung: "Délais de Résiliation",
        parkieren: "Manutention & Stationnement",
        altstadt: "Vieille Ville",
        entsorgung: "Déchets & Böcklisack",
        gewerbe: "Commercial & Herblingertal",
        hauswartung: "Conciergerie & PPVO",
        quartiere: "Siège & Quartiers"
      },
      kuendigungSec: {
        title: "Délais de Résiliation & Pratique dans le Canton de Schaffhouse",
        desc: "Le droit du bail à Schaffhouse diffère sur plusieurs points clés par rapport aux cantons voisins comme Zurich.",
        points: [
          {
            title: "Résiliation Mensuelle (CO 266c)",
            text: "Dans le canton de Schaffhouse, la résiliation est autorisée pour la fin de chaque mois, à l'exception du 31 décembre."
          },
          {
            title: "Faible Taux de Vacance (0.5% / 0.8%)",
            text: "Avec un taux de vacance de 0.5% en ville et 0.8% dans le canton, les états des lieux doivent se dérouler sans aucun défaut."
          },
          {
            title: "Objectifs CO2 & Rénovations",
            text: "Plus de 5'100 remplacements de chauffages et l'objectif cantonal de réduction de 52% du CO2 génèrent une forte demande de nettoyage de fin de chantier."
          }
        ]
      },
      parkierenSec: {
        title: "Règles de Manutention, Stationnement & Accès",
        desc: "Le respect strict du code de la route garantit des interventions sans amende.",
        points: [
          {
            title: "Définition Légale de la 'Manutention' (ATF 89 IV 213)",
            text: "La manutention se limite strictement au chargement et au déchargement actif. La préparation des biens ou le stationnement passif ne constituent PAS une manutention."
          },
          {
            title: "Limitation à 4 Heures en Zone Résidentielle",
            text: "Les rues résidentielles signalées imposent une durée maximale de 4 heures. La carte riverain générale a été refusée en référendum en 2019."
          },
          {
            title: "Autorisations via l'Application Parkingpay",
            text: "Autorisation pour artisans : Accès à la zone piétonne dès 11h00 (stationnement interdit). Cartes journalières dès CHF 3 (2h) jusqu'à CHF 15 (1 jour)."
          },
          {
            title: "Réservation d'Emplacement de Déménagement",
            text: "Interdiction officielle de stationner pour déménagement : demande obligatoire 14 jours à l'avance à stadtpolizei@stsh.ch."
          }
        ]
      },
      altstadtSec: {
        title: "La Vieille Ville de Schaffhouse",
        desc: "Structures historiques, ruelles étroites et règlements municipaux stricts.",
        points: [
          {
            title: "Pas de Places Obligatoires (PPVO Art. 6 al. 4)",
            text: "Dans la vieille ville, les bâtiments ne sont pas soumis à l'obligation de créer des places de parc."
          },
          {
            title: "Interdiction 24/7 en Zone Piétonne",
            text: "Les permis de circuler ne donnent en aucun cas le droit de stationner."
          },
          {
            title: "Tournée des Déchets 6",
            text: "Sacs de déchets interdits sur la voie publique ; utilisation obligatoire des conteneurs enterrés."
          }
        ]
      },
      entsorgungSec: {
        title: "Gestion des Déchets & Sacs 'Böcklisack'",
        desc: "Le tri des déchets conforme évite tout retard lors de la remise de l'appartement.",
        points: [
          {
            title: "Sac Officiel 'Böcklisack'",
            text: "Usage obligatoire des sacs officiels (17L, 35L, 60L, 110L). Les anciens timbres sont caducs."
          },
          {
            title: "Règlement pour Encombrants",
            text: "Timbres de CHF 5.00 par unité (50x50x200cm = 1 timbre). Rouleaux de tapis max. 2m x 30cm."
          },
          {
            title: "Horaires de Dépôt",
            text: "Dépôt obligatoire avant 07h00 le jour de collecte, ou 06h00 en cas de forte chaleur (>30°C)."
          }
        ]
      },
      gewerbeSec: {
        title: "Nettoyage Commercial & Zone Industrielle",
        desc: "Solutions d'entretien pour zones d'activités, commerces et complexes sportifs.",
        points: [
          {
            title: "Pôle Herblingertal",
            text: "Zone industrielle de 105 hectares regroupant environ 4'000 emplois."
          },
          {
            title: "Complexe FCS Arena",
            text: "Stade multifonctionnel de 8'100 m² sur 3 niveaux intégrant commerces, bureaux et espaces VIP."
          },
          {
            title: "Classification PPVO",
            text: "Distinction entre usages intensifs en clientèle (fitness, cabinets, banques) et usages extensifs (cabinets d'avocats, bureaux d'études)."
          }
        ]
      },
      hauswartungSec: {
        title: "Conciergerie & Locaux Annexes (PPVO 400.4)",
        desc: "Exigences légales pour immeubles d'habitation et équipements communs.",
        points: [
          {
            title: "Local Poussettes Couvert (Art. 10)",
            text: "Obligatoire pour les immeubles de plus de 2 logements."
          },
          {
            title: "Places pour Vélos (Art. 8)",
            text: "Au moins 1 place vélo par pièce dans les immeubles résidentiels."
          },
          {
            title: "Entretien des Équipements Communs (Art. 15 al. 2)",
            text: "Obligation légale d'entretien conjoint entre copropriétaires."
          },
          {
            title: "Végétalisation & Taxe de Remplacement",
            text: "Obligation de végétaliser les parkings extérieurs non stabilisés. Taxe de remplacement : CHF 10'000 par place non réalisée."
          }
        ]
      },
      quartiereSec: {
        title: "Notre Siège & Quartiers Vérifiés à Schaffhouse",
        desc: "Présence locale directe assurant rapidité et absence de frais de déplacement.",
        baseTitle: "Siège Opérationnel Schaffhouse",
        baseAddress: "Seewadelstrasse 3, 8203 Schaffhouse",
        quartiereTitle: "Quartiers & Zones Vérifiées",
        districts: [
          "Altstadt (8200)",
          "Altstadtperipherie",
          "Breite",
          "Emmersberg",
          "Steig",
          "Gruben",
          "Herblingen (8207)",
          "Buchthalen",
          "Hemmental (8231)"
        ]
      }
    },
    it: {
      badge: "Dossier Verificato Sciaffusa 2026",
      title: "Particolarità Locali e Quadro Normativo a Sciaffusa",
      subtitle: "Fatti verificati su termini di disdetta, movimentazione merci, regolamenti del centro storico e norme sullo smaltimento dei rifiuti – per inquilini, proprietari e aziende.",
      bannerBadge: "Ancoraggio Locale & Conforme al GAV",
      bannerTitle: "Il vostro partner certificato in Seewadelstrasse 3",
      bannerDesc: "Kraken PFM conosce ogni vicolo del centro storico, le norme di parcheggio della polizia locale e le direttive per la riconsegna degli appartamenti nel Canton Sciaffusa. Approfittate del 100% di garanzia di consegna e di reali competenze locali.",
      bannerBtn: "Calcola preventivo per Sciaffusa",
      bannerImgTag: "📍 Sciaffusa Città & Regione",
      factTag: "Fatto #",
      ruleTag: "Regolamento",
      altstadtTag: "Centro Storico",
      wasteTag: "Direttiva",
      commercialTag: "Aziendale",
      ppvoTag: "PPVO 400.4",
      baseDesc: "Da questo indirizzo centrale i nostri team partono ogni giorno per interventi in tutta la città e in tutti i comuni del Canton Sciaffusa.",
      tabs: {
        kuendigung: "Termini di Disdetta",
        parkieren: "Carico Merci & Parcheggio",
        altstadt: "Centro Storico",
        entsorgung: "Rifiuti & Böcklisack",
        gewerbe: "Commerciale & Herblingertal",
        hauswartung: "Manutenzione & PPVO",
        quartiere: "Sede & Quartieri"
      },
      kuendigungSec: {
        title: "Termini di Disdetta e Prassi di Locazione nel Canton Sciaffusa",
        desc: "La prassi del diritto di locazione nel Canton Sciaffusa si differenzia in dettagli chiave rispetto ai cantoni vicini come Zurigo.",
        points: [
          {
            title: "Disdetta Mensile (OR 266c)",
            text: "Nel Canton Sciaffusa la disdetta è consentita per la fine di qualsiasi mese, ad eccezione del 31 dicembre. I termini consuetudinari locali si applicano solo in via sussidiaria; i termini contrattuali prevalgono sempre."
          },
          {
            title: "Basso Tasso di Sfitto (0.5% / 0.8%)",
            text: "Con un tasso di sfitto di appena lo 0.5% in città e lo 0.8% nel canton (rispetto all'1.0% nazionale), le consegne immobiliari devono svolgersi in modo impeccabile."
          },
          {
            title: "Ondata di Riqualificazione Energetica & Obiettivi CO2",
            text: "Oltre 5'100 sostituzioni di impianti di riscaldamento (2019-2025) e l'obiettivo cantonale di riduzione del 52% di CO2 entro il 2030 generano un'elevata richiesta di pulizia post-cantiere e vani scale."
          }
        ]
      },
      parkierenSec: {
        title: "Movimentazione Merci, Parcheggio e Accesso",
        desc: "Il rigoroso rispetto del codice della strada garantisce interventi senza sanzioni.",
        points: [
          {
            title: "Definizione Legale di 'Movimentazione Merci' (BGE 89 IV 213)",
            text: "In senso strettamente legale, la movimentazione merci si riferisce esclusivamente al carico e scarico attivo. Preparare merce, imballare, smontare mobili o parcheggiare senza movimento attivo NON costituisce movimentazione merci."
          },
          {
            title: "Sosta Massima 4 Ore nei Quartieri",
            text: "Sulle strade di quartiere segnalate vige un limite massimo di sosta di 4 ore (Lun-Ven 08:00-18:00, Sab 08:00-16:00). La tessera generale per residenti è stata respinta al referendum nel 2019 (~55% No)."
          },
          {
            title: "Permessi via App Parkingpay",
            text: "Permesso artigiani: Consente l'accesso alla zona pedonale dalle 11:00 (sosta vietata, a meno che il veicolo non serva da officina mobile). Permessi giornalieri >4h costano CHF 3 (2h), CHF 7 (5h) o CHF 15 (1 giorno)."
          },
          {
            title: "Divieto di Sosta per il Giorno del Trasloco",
            text: "Un divieto di sosta ufficiale per il giorno del trasloco richiede almeno 14 giorni di preavviso presso la Polizia Comunale di Sciaffusa (stadtpolizei@stsh.ch)."
          }
        ]
      },
      altstadtSec: {
        title: "Il Centro Storico di Sciaffusa come Caso Particolare",
        desc: "Edifici storici a graticcio, vicoli stretti e rigide ordinanze comunali richiedono concetti di pulizia specializzati.",
        points: [
          {
            title: "Nessun Obbligo di Parcheggio (PPVO Art. 6 Par. 4)",
            text: "Nella zona del centro storico, secondo l'ordinanza comunale sui parcheggi, gli edifici sono esenti dall'obbligo di creare posti auto."
          },
          {
            title: "Divieto di Sosta 24/7 nella Zona Pedonale",
            text: "I permessi di transito non autorizzano in nessun momento la sosta nella zona pedonale."
          },
          {
            title: "Regolamento Rifiuti Centro Storico Tour 6",
            text: "È vietato esporre sacchi di rifiuti sfusi in strada nel centro storico; vige l'obbligo di utilizzare i contenitori sotterranei."
          }
        ]
      },
      entsorgungSec: {
        title: "Smaltimento Rifiuti & 'Böcklisack' alla Riconsegna",
        desc: "La corretta separazione e smaltimento dei rifiuti evita ritardi nella riconsegna dell'appartamento.",
        points: [
          {
            title: "Sacco Ufficiale dei Rifiuti 'Böcklisack'",
            text: "Nel Canton Sciaffusa è obbligatorio l'uso del 'Böcklisack' ufficiale (formati: 17L, 35L, 60L, 110L). Le vecchie marche non sono valide."
          },
          {
            title: "Marche per Rifiuti Ingombranti",
            text: "I rifiuti ingombranti richiedono contrassegni da CHF 5.00 per unità (50x50x200cm = 1 marca). Rotoli di moquette max 2m x 30cm. Le marche per ingombranti non possono essere usate sui sacchi da 110L."
          },
          {
            title: "Orari di Esposizione",
            text: "Rifiuti e ingombranti devono essere esposti al più tardi entro le 07:00 del giorno di raccolta. Con temperature estive superiori a 30°C l'orario anticipa alle 06:00."
          }
        ]
      },
      gewerbeSec: {
        title: "Pulizia Commerciale & Polo Economico di Sciaffusa",
        desc: "Soluzioni di pulizia e facility management specifiche per industria, commercio e impianti sportivi.",
        points: [
          {
            title: "Polo di Sviluppo Herblingertal",
            text: "L'area industriale e commerciale di Herblingertal comprende 105 ettari con circa 4'000 addetti come importante zona di trasformazione."
          },
          {
            title: "Complesso FCS Arena",
            text: "Arena multifunzionale di 8'100 m² distribuita su 3 livelli destinata ad attività commerciali, uffici, gastronomia e aree VIP."
          },
          {
            title: "Classificazione d'Uso PPVO",
            text: "Chiara distinzione tra utilizzo ad alta affluenza di clienti (palestre, parrucchieri, studi medici, banche) ed estensivo (studi legali, architetti, assicurazioni, laboratori)."
          }
        ]
      },
      hauswartungSec: {
        title: "Manutenzione Immobili & Vani Accessori (PPVO 400.4)",
        desc: "Requisiti legali per edifici residenziali e impianti comuni nel Canton Sciaffusa.",
        points: [
          {
            title: "Depositi Coperti per Passeggini (Art. 10)",
            text: "Negli edifici residenziali con più di 2 appartamenti sono obbligatori per legge posti coperti per passeggini e rimorchi per bici."
          },
          {
            title: "Posti Bici (Art. 8)",
            text: "Obbligo di predisporre almeno 1 posto bici per stanza negli edifici ad uso abitativo."
          },
          {
            title: "Impianti Comuni (Art. 15 Par. 2)",
            text: "Obbligo legale di manutenzione congiunta tra tutti i comproprietarii per le strutture comuni."
          },
          {
            title: "Inverdimento & Tassa Sostitutiva",
            text: "Inverdimento obbligatorio per parcheggi in superficie non asfaltati (Art. 11 Par. 8). Tassa sostitutiva per posti auto mancanti: CHF 10'000 per posto auto."
          }
        ]
      },
      quartiereSec: {
        title: "La Nostra Sede & Quartieri Verificati a Sciaffusa",
        desc: "La presenza diretta sul posto garantisce tempestività e assenza di supplementi per la trasferta.",
        baseTitle: "Sede Operativa Sciaffusa",
        baseAddress: "Seewadelstrasse 3, 8203 Sciaffusa",
        quartiereTitle: "Quartieri & Zone Verificate a Sciaffusa",
        districts: [
          "Altstadt (8200)",
          "Altstadtperipherie",
          "Breite",
          "Emmersberg",
          "Steig",
          "Gruben",
          "Herblingen (8207)",
          "Buchthalen",
          "Hemmental (8231)"
        ]
      }
    },
    pt: {
      badge: "Dossiê Verificado de Schaffhausen 2026",
      title: "Particularidades Locais e Enquadramento Legal em Schaffhausen",
      subtitle: "Dados verificados sobre prazos de rescisão, carga de mercadorias, regulamentos do centro histórico e regras de eliminação de resíduos – para inquilinos, proprietários e empresas.",
      bannerBadge: "Ancoragem Local & Conforme o GAV",
      bannerTitle: "O seu parceiro certificado na Seewadelstrasse 3",
      bannerDesc: "A Kraken PFM conhece cada rua do centro histórico, todas as regras de estacionamento da polícia municipal e todas as exigências de devolução de habitação no Cantão de Schaffhausen. Beneficie de 100% de garantia de entrega e verdadeiro conhecimento local.",
      bannerBtn: "Calcular orçamento para Schaffhausen",
      bannerImgTag: "📍 Cidade e Região de Schaffhausen",
      factTag: "Facto #",
      ruleTag: "Regulamento",
      altstadtTag: "Centro Histórico",
      wasteTag: "Diretiva",
      commercialTag: "Comercial",
      ppvoTag: "PPVO 400.4",
      baseDesc: "A partir deste endereço central, as nossas equipas partem diariamente para serviços em toda a cidade e em todos os municípios do Cantão de Schaffhausen.",
      tabs: {
        kuendigung: "Prazos de Rescisão",
        parkieren: "Carga & Estacionamento",
        altstadt: "Centro Histórico",
        entsorgung: "Resíduos & Böcklisack",
        gewerbe: "Comercial & Herblingertal",
        hauswartung: "Manutenção & PPVO",
        quartiere: "Sede & Bairros"
      },
      kuendigungSec: {
        title: "Prazos de Rescisão e Prática Locatícia no Cantão de Schaffhausen",
        desc: "A prática do direito de arrendamento no Cantão de Schaffhausen difere em detalhes importantes em relação a cantões vizinhos como Zurique.",
        points: [
          {
            title: "Rescisão Mensal (OR 266c)",
            text: "No Cantão de Schaffhausen, a rescisão é permitida no final de qualquer mês, com a única exceção de 31 de dezembro. Os prazos habituais locais aplicam-se apenas subsidiariamente; os prazos contratuais prevalecem sempre."
          },
          {
            title: "Baixa Taxa de Desocupação (0.5% / 0.8%)",
            text: "Com uma taxa de desocupação de apenas 0.5% na cidade e 0.8% em todo o cantão (comparado com 1.0% a nível nacional), as entregas de imóveis têm de decorrer sem quaisquer falhas."
          },
          {
            title: "Onda de Renovação Energética & Metas de CO2",
            text: "Mais de 5.100 substituições de sistemas de aquecimento (2019-2025) e a meta cantonal de redução de 52% de CO2 até 2030 geram uma elevada procura de limpeza pós-obra e em escadas."
          }
        ]
      },
      parkierenSec: {
        title: "Carga de Mercadorias, Estacionamento e Acesso",
        desc: "O cumprimento rigoroso do código da estrada garante intervenções sem multas.",
        points: [
          {
            title: "Definição Legal de 'Carga de Mercadorias' (BGE 89 IV 213)",
            text: "Em sentido estritamente legal, a carga de mercadorias refere-se exclusivamente ao carregar e descarregar ativo. Preparar mercadorias, embalar, desmontar móveis ou estacionar sem movimento ativo NÃO é considerado carga."
          },
          {
            title: "Estacionamento Máximo de 4 Horas em Zonas Residenciais",
            text: "Nas ruas residenciais sinalizadas vigora um limite máximo de 4 horas (Seg-Sex 08:00-18:00, Sáb 08:00-16:00). O dístico geral para residentes foi rejeitado em referendo em 2019 (~55% Não)."
          },
          {
            title: "Permissões via Aplicação Parkingpay",
            text: "Permissão para profissionais: Acesso à zona pedonal a partir das 11:00 (estacionamento proibido, a menos que o veículo sirva de oficina móvel). Permissões diárias >4h custam CHF 3 (2h), CHF 7 (5h) ou CHF 15 (1 dia)."
          },
          {
            title: "Reserva de Espaço para Dia de Mudança",
            text: "A reserva oficial de espaço para mudança exige pelo menos 14 dias de antecedência junto da Polícia Municipal de Schaffhausen (stadtpolizei@stsh.ch)."
          }
        ]
      },
      altstadtSec: {
        title: "O Centro Histórico de Schaffhausen como Caso Especial",
        desc: "Edifícios históricos enxaimel, ruas estreitas e regulamentos municipais rigorosos exigem conceitos de limpeza especializados.",
        points: [
          {
            title: "Sem Obrigação de Estacionamento (PPVO Art. 6 Para. 4)",
            text: "Na zona do centro histórico, segundo o regulamento municipal de estacionamento, os edifícios estão isentos da obrigação de criar lugares de estacionamento."
          },
          {
            title: "Proibição de Estacionamento 24/7 na Zona Pedonal",
            text: "As autorizações de circulação não concedem em momento algum o direito de estacionar na zona pedonal."
          },
          {
            title: "Regulamento de Resíduos Centro Histórico Rota 6",
            text: "É proibido colocar sacos de lixo soltos na rua no centro histórico; é obrigatória a utilização de contentores subterrâneos."
          }
        ]
      },
      entsorgungSec: {
        title: "Eliminação de Resíduos & 'Böcklisack' na Entrega",
        desc: "A separação e eliminação adequadas de resíduos evitam atrasos na entrega da habitação.",
        points: [
          {
            title: "Saco de Lixo Oficial 'Böcklisack'",
            text: "No Cantão de Schaffhausen é obrigatório o uso do saco oficial 'Böcklisack' (tamanhos: 17L, 35L, 60L, 110L). Os selos antigos perderam a validade."
          },
          {
            title: "Regulamento de Objetos Volumosos",
            text: "Objetos volumosos exigem selos de CHF 5.00 por unidade (50x50x200cm = 1 selo). Rolos de carpete máx. 2m x 30cm. Os selos não podem ser usados em sacos de 110L."
          },
          {
            title: "Horários de Depósito",
            text: "Os resíduos devem ser colocados o mais tardar às 07:00 no dia de recolha. Em dias de calor superior a 30°C, o horário antecipa para as 06:00."
          }
        ]
      },
      gewerbeSec: {
        title: "Limpeza Comercial & Polo Económico de Schaffhausen",
        desc: "Soluções de limpeza e gestão de instalações específicas para indústria, comércio e recintos desportivos.",
        points: [
          {
            title: "Polo de Desenvolvimento Herblingertal",
            text: "A área industrial e comercial de Herblingertal abrange 105 hectares com cerca de 4.000 trabalhadores como importante zona de transformação."
          },
          {
            title: "Complexo FCS Arena",
            text: "Estádio multifuncional de 8.100 m² distribuído por 3 pisos para áreas comerciais, escritórios, gastronomia e salas VIP."
          },
          {
            title: "Classificação de Uso PPVO",
            text: "Diferenciação clara entre utilização com elevada afluência de clientes (ginásios, cabeleireiros, clínicas, bancos) e extensiva (escritórios de advogados, arquitetos, seguradoras, laboratórios)."
          }
        ]
      },
      hauswartungSec: {
        title: "Manutenção de Edifícios & Espaços Anexos (PPVO 400.4)",
        desc: "Requisitos legais para edifícios residenciais e instalações comunitárias no Cantão de Schaffhausen.",
        points: [
          {
            title: "Locais Cobertos para Carrinhos de Bebé (Art. 10)",
            text: "Em edifícios residenciais com mais de 2 habitações são obrigatórios por lei lugares cobertos para carrinhos de bebé e reboques de bicicleta."
          },
          {
            title: "Lugares para Bicicletas (Art. 8)",
            text: "Obrigação de disponibilizar pelo menos 1 lugar para bicicleta por divisão em edifícios residenciais."
          },
          {
            title: "Instalações Comunitárias (Art. 15 Para. 2)",
            text: "Obrigação legal de manutenção conjunta entre todos os comproprietários para as instalações comunitárias."
          },
          {
            title: "Arborização & Taxa de Substituição",
            text: "Arborização obrigatória para parques de estacionamento de superfície não asfaltados (Art. 11 Para. 8). Taxa de substituição por lugares não construídos: CHF 10.000 por lugar."
          }
        ]
      },
      quartiereSec: {
        title: "A Nossa Sede & Bairros Verificados em Schaffhausen",
        desc: "A presença local direta garante rapidez e ausência de custos de deslocação.",
        baseTitle: "Sede Operacional de Schaffhausen",
        baseAddress: "Seewadelstrasse 3, 8203 Schaffhausen",
        quartiereTitle: "Bairros & Zonas Verificadas em Schaffhausen",
        districts: [
          "Altstadt (8200)",
          "Altstadtperipherie",
          "Breite",
          "Emmersberg",
          "Steig",
          "Gruben",
          "Herblingen (8207)",
          "Buchthalen",
          "Hemmental (8231)"
        ]
      }
    }
  };

  const t = content[lang as keyof typeof content] || content.de;

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'kuendigung':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Calendar className="w-6 h-6 text-cyan-600" />
              <div>
                <h3 className="text-xl font-bold text-[#002D5B]">{t.kuendigungSec.title}</h3>
                <p className="text-xs text-slate-500">{t.kuendigungSec.desc}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {t.kuendigungSec.points.map((pt, idx) => (
                <div key={idx} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-100/80 text-cyan-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-cyan-600" />
                    {t.factTag} {idx + 1}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{pt.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pt.text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'parkieren':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Car className="w-6 h-6 text-cyan-600" />
              <div>
                <h3 className="text-xl font-bold text-[#002D5B]">{t.parkierenSec.title}</h3>
                <p className="text-xs text-slate-500">{t.parkierenSec.desc}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {t.parkierenSec.points.map((pt, idx) => (
                <div key={idx} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-800 text-[10px] font-bold">
                    <Scale className="w-3 h-3 text-amber-600" />
                    {t.ruleTag}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{pt.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pt.text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'altstadt':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Building2 className="w-6 h-6 text-cyan-600" />
              <div>
                <h3 className="text-xl font-bold text-[#002D5B]">{t.altstadtSec.title}</h3>
                <p className="text-xs text-slate-500">{t.altstadtSec.desc}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {t.altstadtSec.points.map((pt, idx) => (
                <div key={idx} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800 text-[10px] font-bold">
                    <Info className="w-3 h-3 text-blue-600" />
                    {t.altstadtTag}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{pt.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pt.text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'entsorgung':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Trash2 className="w-6 h-6 text-cyan-600" />
              <div>
                <h3 className="text-xl font-bold text-[#002D5B]">{t.entsorgungSec.title}</h3>
                <p className="text-xs text-slate-500">{t.entsorgungSec.desc}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {t.entsorgungSec.points.map((pt, idx) => (
                <div key={idx} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] font-bold">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    {t.wasteTag}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{pt.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pt.text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gewerbe':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Briefcase className="w-6 h-6 text-cyan-600" />
              <div>
                <h3 className="text-xl font-bold text-[#002D5B]">{t.gewerbeSec.title}</h3>
                <p className="text-xs text-slate-500">{t.gewerbeSec.desc}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {t.gewerbeSec.points.map((pt, idx) => (
                <div key={idx} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100/80 text-indigo-800 text-[10px] font-bold">
                    <Briefcase className="w-3 h-3 text-indigo-600" />
                    {t.commercialTag}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{pt.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pt.text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'hauswartung':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Home className="w-6 h-6 text-cyan-600" />
              <div>
                <h3 className="text-xl font-bold text-[#002D5B]">{t.hauswartungSec.title}</h3>
                <p className="text-xs text-slate-500">{t.hauswartungSec.desc}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {t.hauswartungSec.points.map((pt, idx) => (
                <div key={idx} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100/80 text-purple-800 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3 text-purple-600" />
                    {t.ppvoTag}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{pt.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pt.text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'quartiere':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <MapPin className="w-6 h-6 text-cyan-600" />
              <div>
                <h3 className="text-xl font-bold text-[#002D5B]">{t.quartiereSec.title}</h3>
                <p className="text-xs text-slate-500">{t.quartiereSec.desc}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#002D5B] text-white p-6 rounded-3xl space-y-3 relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Stützpunkt
                </div>
                <h4 className="text-lg font-bold">{t.quartiereSec.baseTitle}</h4>
                <p className="text-sm font-mono text-slate-200">{t.quartiereSec.baseAddress}</p>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
                  {t.baseDesc}
                </p>
              </div>

              <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-100 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t.quartiereSec.quartiereTitle}</h4>
                <div className="flex flex-wrap gap-2">
                  {t.quartiereSec.districts.map((dist, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                      📍 {dist}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-16 px-6 bg-white border-t border-slate-200" id="schaffhausen-dossier">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold tracking-wide">
            <FileText className="w-3.5 h-3.5 text-cyan-600" />
            {t.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#002D5B] tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-4">
          {(Object.keys(t.tabs) as Array<keyof typeof t.tabs>).map((tabKey) => {
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#002D5B] text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t.tabs[tabKey]}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {renderActiveTabContent()}
        </div>

        {/* Local Image Callout Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#001226] to-[#002D5B] text-white p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-lg">
          <div className="w-full md:w-1/2 h-56 md:h-64 rounded-2xl overflow-hidden shadow-md flex-shrink-0 relative">
            <img 
              src="/schaffhausen-1.webp" 
              alt="Kanton Schaffhausen Reinigungsdienst und Liegenschaftsservice" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-lg text-[11px] font-mono font-medium text-white/90">
              {t.bannerImgTag}
            </div>
          </div>
          <div className="space-y-4 md:w-1/2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              {t.bannerBadge}
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {t.bannerTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.bannerDesc}
            </p>
            {onNavigate && (
              <button
                onClick={() => onNavigate('consultation')}
                className="mt-2 px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-[#001226] rounded-full font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                {t.bannerBtn}
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
