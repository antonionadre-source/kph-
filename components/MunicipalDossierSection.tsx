import React from 'react';
import { Municipality, KUENDIGUNGSTERMINE } from '../src/data/locations';
import { useTranslation } from '../i18n';
import { 
  Trash2, 
  Building2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Info,
  Clock,
  ArrowRight,
  Calculator
} from 'lucide-react';

// Comprehensive translation map for dynamic German municipal content
const TRANSLATIONS_MAP: Record<string, Record<string, string>> = {
  // Neunkirch
  "Böcklisack & Markensystem Verband Klettgau": {
    en: "Böcklisack & Sticker System Klettgau Association",
    es: "Bolsa Böcklisack y Sistema de Viñetas Asociación Klettgau",
    fr: "Böcklisack et système de vignettes Association Klettgau",
    it: "Böcklisack e sistema a bollini Associazione Klettgau",
    pt: "Böcklisack e Sistema de Etiquetas Associação Klettgau"
  },
  "Regionaler Entsorgungsplatz Klettgau / Werkhof Neunkirch": {
    en: "Regional Disposal Site Klettgau / Neunkirch Depot",
    es: "Punto de Reciclaje Regional de Klettgau / Depósito Municipal Neunkirch",
    fr: "Déchetterie Régionale du Klettgau / Centre technique Neunkirch",
    it: "Centro di Smaltimento Regionale del Klettgau / Magazzino Neunkirch",
    pt: "Centro de Reciclagem Regional de Klettgau / Depósito de Neunkirch"
  },
  "Markensystem gemäss Verband Klettgau. Bereitstellung am Abfuhrtag bis 07:00 Uhr. Wasserhärte 33–34°fH (sehr hart) — kalkkritisch bei Abnahmen.": {
    en: "Sticker system according to Klettgau Association. Provision on collection day by 07:00 AM. Water hardness 33–34°fH (very hard) — critical limescale requirement for handovers.",
    es: "Sistema de marcas/viñetas según la Asociación Klettgau. Colocación el día de recogida antes de las 07:00 h. Dureza del agua 33–34°fH (muy dura) — descalcificación crítica en entregas de pisos.",
    fr: "Système de vignettes selon l'Association Klettgau. Mise à disposition le jour de ramassage avant 07h00. Dureté de l'eau 33–34°fH (très dure) — détartrage critique pour état des lieux.",
    it: "Sistema a bollini secondo l'Associazione Klettgau. Esposizione il giorno di raccolta entro le 07:00. Durezza dell'acqua 33–34°fH (molto dura) — disincrostazione critica nelle consegne.",
    pt: "Sistema de etiquetas segundo a Associação Klettgau. Disponibilização no dia da recolha até às 07:00. Dureza da água 33–34°fH (muito dura) — descalcificação crítica na devolução do imóvel."
  },
  "Markensystem gemäss Verband Klettgau. Bereitstellung am Abfuhrtag bis 07:00 Uhr.": {
    en: "Sticker system according to Klettgau Association. Provision on collection day by 07:00 AM.",
    es: "Sistema de marcas/viñetas según la Asociación Klettgau. Colocación el día de recogida antes de las 07:00 h.",
    fr: "Système de vignettes selon l'Association Klettgau. Mise à disposition le jour de ramassage avant 07h00.",
    it: "Sistema a bollini secondo l'Associazione Klettgau. Messa a disposizione il giorno di raccolta entro le 07:00.",
    pt: "Sistema de etiquetas segundo a Associação Klettgau. Disponibilização no dia da recolha até às 07:00."
  },
  "Regionaler Entsorgungsplatz Klettgau": {
    en: "Regional Disposal Site Klettgau",
    es: "Punto de Reciclaje Regional de Klettgau",
    fr: "Déchetterie Régionale du Klettgau",
    it: "Centro di Smaltimento Regionale del Klettgau",
    pt: "Centro de Reciclagem Regional de Klettgau"
  },
  "Anfahrt Oberklettgau 15 CHF.": {
    en: "Travel fee Oberklettgau 15 CHF.",
    es: "Tarifa de desplazamiento Oberklettgau 15 CHF.",
    fr: "Frais de déplacement Oberklettgau 15 CHF.",
    it: "Spesa di trasferta Oberklettgau 15 CHF.",
    pt: "Taxa de deslocamento Oberklettgau 15 CHF."
  },
  "Denkmalgeschützte Altbauten im Städtlikern, Einfamilienhäuser, landwirtschaftliche Mischbauten": {
    en: "Heritage-listed historic buildings in the old town core, single-family homes, mixed agricultural properties",
    es: "Edificios históricos protegidos en el casco antiguo, viviendas unifamiliares, fincas mixtas agrícolas",
    fr: "Bâtiments historiques protégés au cœur de la vieille ville, maisons individuelles, propriétés agricoles mixtes",
    it: "Edifici storici tutelati nel centro storico, case unifamiliari, immobili agricoli misti",
    pt: "Edifícios históricos protegidos no centro da vila, moradias unifamiliares, propriedades agrícolas mistas"
  },
  "Traditionsbewusste Hauseigentümer, lokale Gewerbetreibende, Landwirte": {
    en: "Quality-minded homeowners, local business owners, farmers",
    es: "Propietarios tradicionales, comerciantes locales, agricultores",
    fr: "Propriétaires soucieux des traditions, commerçants locaux, agriculteurs",
    it: "Proprietari tradizionali, commercianti locali, agricoltori",
    pt: "Proprietários tradicionais, comerciantes locais, agricultores"
  },
  "Sehr hartes Wasser (33–34°fH) erfordert intensivste Entkalkung von Armaturen, Duschwänden & WC vor Abgabe. Erhaltspflege alter Dielenböden & Riegelwerk.": {
    en: "Very hard water (33–34°fH) requires intensive descaling of fittings, shower walls & toilets before handover. Preservation care of old floorboards & timber framing.",
    es: "Agua muy dura (33–34°fH) exige la más intensa descalcificación de grifos, mamparas y sanitarios antes de la entrega. Mantenimiento de suelos de madera y entramados antiguos.",
    fr: "Eau très dure (33–34°fH) exige un détartrage intensif des robinets, parois de douche et WC avant état des lieux. Entretien préservateur des vieux parquets et colombages.",
    it: "Acqua molto dura (33–34°fH) richiede una disincrostazione profonda di rubinetteria, pareti doccia e WC prima della riconsegna. Cura e conservazione di vecchi pavimenti e graticci.",
    pt: "Água muito dura (33–34°fH) exige descalcificação intensiva de torneiras, divisórias de duche e WC antes da entrega. Preservação de pavimentos de madeira e estruturas antigas."
  },

  // Feuerthalen (ZH)
  "Gemeindeeigene Abfallmarken Feuerthalen (Schaffhauser Böcklisack ungültig)": {
    en: "Municipal garbage stickers Feuerthalen (Schaffhausen Böcklisack invalid)",
    es: "Viñetas de basura propias de Feuerthalen (Bolsa Böcklisack de Schaffhausen NO válida)",
    fr: "Vignettes de poubelle municipales Feuerthalen (Sac Böcklisack de Schaffhouse non valable)",
    it: "Bollini rifiuti comunali Feuerthalen (Sacco Böcklisack di Sciaffusa NON valido)",
    pt: "Etiquetas de lixo municipais de Feuerthalen (Saco Böcklisack de Schaffhausen inválido)"
  },
  "Werkhof Feldstrasse 132 (Mo 10:30–11:30 & 1. Sa/Monat 10:30–11:30)": {
    en: "Feuerthalen Depot Feldstrasse 132 (Mon 10:30–11:30 AM & 1st Sat/month 10:30–11:30 AM)",
    es: "Depósito Municipal Feldstrasse 132 (Lun 10:30–11:30 h y 1er Sáb/mes 10:30–11:30 h)",
    fr: "Centre technique Feldstrasse 132 (Lun 10h30–11h30 & 1er Sam/mois 10h30–11h30)",
    it: "Magazzino Feldstrasse 132 (Lun 10:30–11:30 e 1° Sab/mese 10:30–11:30)",
    pt: "Depósito Municipal Feldstrasse 132 (Seg 10:30–11:30 e 1º Sáb/mês 10:30–11:30)"
  },
  "Nur gemeindeeigene Abfall- & Sperrgutmarken. Gebündelt/gepresst am Abfuhrtag bis 07:00 Uhr (nicht am Vortag!). Grundgebühr: CHF 140 EFH / 70 MFH / 210 Betrieb (exkl. MwSt). Abfuhr durch REMONDIS Schweiz AG (052 643 11 88).": {
    en: "Municipal garbage and bulky waste stickers only. Bundled/compressed on collection day by 07:00 AM (not the day before!). Base fee: CHF 140 SFH / 70 MFH / 210 business (excl. VAT). Collection by REMONDIS Schweiz AG (052 643 11 88).",
    es: "Exclusivamente viñetas/marcas de basura y enseres de Feuerthalen. Atados/comprimidos el día de recogida antes de las 07:00 h (¡no la víspera!). Tasa base: 140 CHF casa unifamiliar / 70 CHF edificio / 210 CHF comercio (IVA no incl.). Recogida por REMONDIS Schweiz AG (052 643 11 88).",
    fr: "Seules les vignettes poubelle et encombrants municipales sont valables. Ficelés/compressés le jour du ramassage avant 07h00 (pas la veille !). Taxe de base : 140 CHF maison / 70 CHF immeuble / 210 CHF entreprise. Ramassage par REMONDIS Schweiz AG (052 643 11 88).",
    it: "Esclusivamente bollini rifiuti e ingombranti comunali. Affastellati/compressi il giorno di raccolta entro le 07:00 (non il giorno prima!). Tassa base: CHF 140 casa unifamiliare / 70 condomini / 210 attività (IVA escl.). Raccolta a cura di REMONDIS Schweiz AG (052 643 11 88).",
    pt: "Apenas etiquetas municipais de lixo e resíduos volumosos. Atados/comprimidos no dia da recolha até às 07:00 (não na véspera!). Taxa base: CHF 140 moradia / 70 apartamento / 210 empresa. Recolha por REMONDIS Schweiz AG (052 643 11 88)."
  },
  "Mehrfamilienhäuser in Rheinnähe, gewerbliche Ateliers, klassische Wohnungen in Langwiesen": {
    en: "Apartment buildings near the Rhine, commercial studios, traditional flats in Langwiesen",
    es: "Bloques de pisos cerca del Rin, talleres comerciales, pisos clásicos en Langwiesen",
    fr: "Immeubles d'habitation près du Rhin, ateliers commerciaux, appartements classiques à Langwiesen",
    it: "Condomini vicino al Reno, atelier commerciali, appartamenti classici a Langwiesen",
    pt: "Blocos de apartamentos perto do Rino, ateliês comerciais, apartamentos clássicos em Langwiesen"
  },
  "Schaffhauser Böcklisack ist in Feuerthalen ungültig — nur Zürcher/Feuerthaler Marken! Werkhof öffnet nur 1h/Woche. Beseitigung von Schimmelansätzen durch feuchte Rheinnähe.": {
    en: "Schaffhausen Böcklisack is INVALID in Feuerthalen — Zurich/Feuerthalen stickers only! Recycling depot open only 1 hour per week. Mold prevention/removal due to humid Rhine proximity.",
    es: "¡La bolsa Böcklisack de Schaffhausen NO es válida en Feuerthalen! Solo viñetas de Zúrich/Feuerthalen. El punto verde abre solo 1 h por semana. Tratamiento de moho por la humedad cercana al Rin.",
    fr: "Le sac Böcklisack de Schaffhouse est NON VALABLE à Feuerthalen — uniquement vignettes zurichoises/Feuerthalen ! Déchetterie ouverte 1h/semaine seulement. Traitement des traces de moisissure dues à l'humidité du Rhin.",
    it: "Il sacco Böcklisack di Sciaffusa NON è valido a Feuerthalen — solo bollini di Zurigo/Feuerthalen! Il magazzino apre solo 1 ora a settimana. Trattamento muffe dovuto all'umidità del Reno.",
    pt: "O saco Böcklisack de Schaffhausen é INVÁLIDO em Feuerthalen — apenas etiquetas de Zurique/Feuerthalen! Ponto de reciclagem aberto apenas 1h por semana. Remoção de bolor devido à humidade do Rino."
  },

  // Hallau (SH)
  "Sack plus Gebührenmarken (Kombisystem Hallau)": {
    en: "Garbage sack plus fee stickers (Hallau Combo System)",
    es: "Bolsa más viñetas de tasa (Sistema combinado de Hallau)",
    fr: "Sac plus vignettes payantes (Système combiné de Hallau)",
    it: "Sacco più bollini a tassa (Sistema combinato di Hallau)",
    pt: "Saco mais etiquetas de taxa (Sistema combinado de Hallau)"
  },
  "KBA Hard Beringen / Erbschaftsamt Klettgau (Hauptstrasse 44)": {
    en: "KBA Hard Beringen / Klettgau Office (Hauptstrasse 44)",
    es: "KBA Hard Beringen / Oficina Klettgau (Hauptstrasse 44)",
    fr: "KBA Hard Beringen / Office de Klettgau (Hauptstrasse 44)",
    it: "KBA Hard Beringen / Ufficio del Klettgau (Hauptstrasse 44)",
    pt: "KBA Hard Beringen / Posto de Klettgau (Hauptstrasse 44)"
  },
  "Grobgut/Altholz max. 2m / 25kg mit Gebührenmarken gut sichtbar aufkleben. Deponie vor Freitag 07:00 Uhr strikt verboten! Altpapier gebündelt bis 08:00 Uhr.": {
    en: "Coarse waste/wood max. 2m / 25kg with fee stickers clearly visible. Deposition before Friday 07:00 AM strictly forbidden! Waste paper bundled by 08:00 AM.",
    es: "Enseres voluminosos/madera máx. 2m / 25kg con viñetas claramente visibles. ¡Prohibida estrictamente la colocación en la calle antes del viernes a las 07:00 h! Papel atado antes de las 08:00 h.",
    fr: "Déchets encombrants/bois max. 2m / 25kg avec vignettes bien visibles. Dépôt avant vendredi 07h00 strictement interdit ! Papier ficelé avant 08h00.",
    it: "Ingombranti/legno max 2m / 25kg con bollini ben visibili. Deposito prima di venerdì ore 07:00 severamente vietato! Carta affastellata entro le 08:00.",
    pt: "Resíduos volumosos/madeira máx. 2m / 25kg com etiquetas bem visíveis. Depósito antes de sexta-feira às 07:00 estritamente proibido! Papel atado até às 08:00."
  },
  "Hybrid-Entsorgungssystem (Sack + Marken). Deponie vor Freitag 07:00 Uhr strikt verboten. Gastronomieflächen erfordern HACCP-Hygienestandards.": {
    en: "Hybrid waste disposal system (sack + stickers). Deposit before Friday 07:00 AM strictly forbidden. Gastronomy spaces require HACCP hygiene standards.",
    es: "Sistema híbrido de residuos (bolsa + viñetas). Depósito en vía pública antes del viernes a las 07:00 h estrictamente prohibido. Locales de hostelería requieren normas de higiene HACCP.",
    fr: "Système d'élimination hybride (sac + vignettes). Dépôt sur la voie publique avant vendredi 07h00 strictement interdit. Espaces de restauration exigent les normes d'hygiène HACCP.",
    it: "Sistema di smaltimento ibrido (sacco + bollini). Deposito in strada prima di venerdì ore 07:00 severamente vietato. I locali di ristorazione richiedono standard igienici HACCP.",
    pt: "Sistema híbrido de eliminação de resíduos (saco + etiquetas). Depósito antes de sexta-feira às 07:00 estritamente proibido. Espaços de gastronomia exigem normas de higiene HACCP."
  },

  // Laufen-Uhwiesen (ZH)
  "Kehrichtorganisation Wyland (Weiler Nohl: Neuhauser Gebührensack!)": {
    en: "Wyland Waste Organization (Nohl hamlet: Neuhausen Garbage Sack!)",
    es: "Organización de Residuos Wyland (¡Caserío de Nohl: Bolsa Oficial de Neuhausen!)",
    fr: "Organisation des déchets Wyland (Hameau de Nohl : Sac payant de Neuhausen !)",
    it: "Organizzazione Rifiuti Wyland (Frazione Nohl: Sacco ufficiale di Neuhausen!)",
    pt: "Organização de Lixo Wyland (Aldeia de Nohl: Saco de lixo de Neuhausen!)"
  },
  "Entsorgungsplatz Uhwiesen (Sa 13:30–15:00 Uhr)": {
    en: "Uhwiesen Disposal Yard (Sat 1:30 PM–3:00 PM)",
    es: "Punto de Reciclaje de Uhwiesen (Sáb 13:30–15:00 h)",
    fr: "Déchetterie d'Uhwiesen (Sam 13h30–15h00)",
    it: "Punto di Raccolta Uhwiesen (Sab 13:30–15:00)",
    pt: "Ponto de Reciclagem de Uhwiesen (Sáb 13:30–15:00)"
  },
  "Zweckverband Wyland. ACHTUNG Nohl: Weiler Nohl entsorgt über Neuhausen am Rheinfall (SH) jeden Donnerstag bis 06:30 Uhr nur mit Neuhauser Säcken!": {
    en: "Wyland Association. ATTENTION Nohl: Nohl hamlet disposes via Neuhausen am Rheinfall (SH) every Thursday by 06:30 AM using Neuhausen sacks only!",
    es: "Asociación Wyland. ¡ATENCIÓN Nohl: El caserío de Nohl elimina sus residuos a través de Neuhausen am Rheinfall (SH) los jueves antes de las 06:30 h únicamente con bolsas de Neuhausen!",
    fr: "Association Wyland. ATTENTION Nohl : Le hameau de Nohl élimine via Neuhausen am Rheinfall (SH) tous les jeudis avant 06h30 avec les sacs de Neuhausen uniquement !",
    it: "Associazione Wyland. ATTENZIONE Nohl: La frazione Nohl smaltisce tramite Neuhausen am Rheinfall (SH) ogni giovedì entro le 06:30 solo con sacchi di Neuhausen!",
    pt: "Associação Wyland. ATENÇÃO Nohl: A aldeia de Nohl elimina os resíduos através de Neuhausen am Rheinfall (SH) todas as quintas-feiras até às 06:30 apenas com sacos de Neuhausen!"
  },
  "Anfahrt Uhwiesen/Nohl 10 CHF Pauschale.": {
    en: "Travel flat fee Uhwiesen/Nohl 10 CHF.",
    es: "Tarifa plana de desplazamiento Uhwiesen/Nohl 10 CHF.",
    fr: "Forfait de déplacement Uhwiesen/Nohl 10 CHF.",
    it: "Tariffa fissa di trasferta Uhwiesen/Nohl 10 CHF.",
    pt: "Taxa fixa de deslocamento Uhwiesen/Nohl 10 CHF."
  },
  "Landwirtschaftliche Riegelbauten, freistehende EFH am Südhang des Kohlfirsts, Häuser im Weiler Nohl": {
    en: "Agricultural timber-framed buildings, detached single-family homes on Kohlfirst south slope, houses in Nohl hamlet",
    es: "Construcciones agrícolas con entramado de madera, casas unifamiliares en la ladera sur de Kohlfirst, casas en el caserío de Nohl",
    fr: "Bâtiments agricoles à colombages, maisons individuelles sur le versant sud du Kohlfirst, maisons du hameau de Nohl",
    it: "Edifici agricoli a graticcio, case unifamiliari isolate sul versante sud del Kohlfirst, case nella frazione Nohl",
    pt: "Edificações agrícolas em enxaimel, moradias no declive sul de Kohlfirst, casas na aldeia de Nohl"
  },
  "Pendler nach Winterthur und Schaffhausen, Familien, Schloss Laufen Besucher": {
    en: "Commuters to Winterthur and Schaffhausen, families, Schloss Laufen visitors",
    es: "Trabajadores en tránsito a Winterthur y Schaffhausen, familias, visitantes del Castillo de Laufen",
    fr: "Navetteurs vers Winterthour et Schaffhouse, familles, visiteurs du château de Laufen",
    it: "Pendolari per Winterthur e Sciaffusa, famiglie, visitatori del Castello di Laufen",
    pt: "Trabalhadores para Winterthur e Schaffhausen, famílias, visitantes do Castelo de Laufen"
  },
  "Achtung Zonen-Spaltung: Im Weiler Nohl gelten Neuhauser Abfallregeln (Do bis 06:30 Uhr), im Hauptort Wyland-Regeln. Entsorgungsplatz Uhwiesen öffnet nur Sa 1.5h.": {
    en: "Attention split zone: Nohl hamlet follows Neuhausen waste rules (Thu by 06:30 AM), main town follows Wyland rules. Uhwiesen recycling yard opens only Sat for 1.5h.",
    es: "Atención división por zonas: En el caserío de Nohl rigen las reglas de Neuhausen (jueves antes de las 06:30 h); en el pueblo principal rige el sistema Wyland. El punto verde de Uhwiesen solo abre los sábados 1,5 h.",
    fr: "Attention division par zone : Le hameau de Nohl suit le règlement de Neuhausen (jeu avant 06h30), le village principal suit le règlement Wyland. Déchetterie d'Uhwiesen ouverte seulement 1h30 le samedi.",
    it: "Attenzione divisione in zone: Nella frazione Nohl valgono le regole di Neuhausen (gio entro 06:30), nel centro abitato le regole Wyland. Il centro di Uhwiesen apre solo il sabato per 1,5 ore.",
    pt: "Atenção divisão de zonas: Na aldeia de Nohl aplicam-se as regras de Neuhausen (qui até às 06:30), na vila principal as regras de Wyland. O centro de recolha de Uhwiesen abre apenas ao sábado durante 1,5h."
  },

  // Neuhausen am Rheinfall
  "Gebührensack der Gemeinde Neuhausen am Rheinfall": {
    en: "Official Garbage Sack of the Municipality of Neuhausen am Rheinfall",
    es: "Bolsa Oficial de Basura del Municipio de Neuhausen am Rheinfall",
    fr: "Sac Poubelle Payant Officiel de la Commune de Neuhausen am Rheinfall",
    it: "Sacco Ufficiale della Spazzatura del Comune di Neuhausen am Rheinfall",
    pt: "Saco de Lixo Oficial do Município de Neuhausen am Rheinfall"
  },
  "Recyclinghof im Chlaffental / Corrà Transporte AG (Victor von Bruns-Str. 12)": {
    en: "Recycling Yard in Chlaffental / Corrà Transporte AG (Victor von Bruns-Str. 12)",
    es: "Centro de Reciclaje de Chlaffental / Corrà Transporte AG (Victor von Bruns-Str. 12)",
    fr: "Déchetterie de Chlaffental / Corrà Transporte AG (Victor von Bruns-Str. 12)",
    it: "Centro di Riciclaggio Chlaffental / Corrà Transporte AG (Victor von Bruns-Str. 12)",
    pt: "Centro de Reciclagem em Chlaffental / Corrà Transporte AG (Victor von Bruns-Str. 12)"
  },
  "Nur auf Anfrage (Anmeldung: abfallentsorgung@neuhausen.ch / 052 632 66 13). Abrechnung nach Aufwand (Grundpreis + Pauschale + Zeit). Strikte Bereitstellung erst am Abfuhrtag bis 06:30 Uhr.": {
    en: "Only upon request (Registration: abfallentsorgung@neuhausen.ch / 052 632 66 13). Billed by effort (base price + flat rate + time). Strict provision only on collection day by 06:30 AM.",
    es: "Solo previa solicitud (Registro: abfallentsorgung@neuhausen.ch / 052 632 66 13). Facturación según esfuerzo (precio base + tarifa plana + tiempo). Colocación estricta el mismo día de recogida antes de las 06:30 h.",
    fr: "Uniquement sur demande (Inscription : abfallentsorgung@neuhausen.ch / 052 632 66 13). Facturation selon l'effort (prix de base + forfait + temps). Mise à disposition stricte le jour de ramassage avant 06h30.",
    it: "Solo su richiesta (Registrazione: abfallentsorgung@neuhausen.ch / 052 632 66 13). Fatturazione a consumo (prezzo base + forfait + tempo). Messa a disposizione rigorosa solo il giorno di raccolta entro le 06:30.",
    pt: "Apenas sob pedido (Registo: abfallentsorgung@neuhausen.ch / 052 632 66 13). Faturação por esforço (preço base + taxa fixa + tempo). Disponibilização rigorosa apenas no dia da recolha até às 06:30."
  },
  "Unmittelbare Nähe zu Hauptstandort — fahrkostenfreie Anfahrt.": {
    en: "Immediate proximity to headquarters — free travel.",
    es: "Proximidad inmediata a la sede principal: desplazamiento gratuito.",
    fr: "Proximité immédiate du siège social — déplacement gratuit.",
    it: "Vicinanza immediata alla sede principale — trasferta gratuita.",
    pt: "Proximidade imediata à sede principal — deslocamento gratuito."
  },
  "Rhytech-Areal ('Rhyfall Village' Hochhäuser mit 280 Neubauwohnungen), Wohnblöcke an der Zentralstrasse, EFH am Galgenbuck, Gewerbebauten im Rundbuck": {
    en: "Rhytech site ('Rhyfall Village' high-rises with 280 new apartments), residential blocks on Zentralstrasse, single-family homes at Galgenbuck, commercial buildings in Rundbuck",
    es: "Complejo Rhytech (torres 'Rhyfall Village' con 280 nuevos apartamentos), bloques de pisos en Zentralstrasse, casas unifamiliares en Galgenbuck, edificios comerciales en Rundbuck",
    fr: "Site Rhytech (tours 'Rhyfall Village' de 280 logements neufs), immeubles résidentiels sur Zentralstrasse, maisons individuelles à Galgenbuck, bâtiments commerciaux à Rundbuck",
    it: "Area Rhytech (grattacieli 'Rhyfall Village' con 280 nuovi appartamenti), condomini su Zentralstrasse, case unifamiliari a Galgenbuck, edifici commerciali a Rundbuck",
    pt: "Complexo Rhytech (torres 'Rhyfall Village' com 280 novos apartamentos), blocos residenciais na Zentralstrasse, moradias no Galgenbuck, edifícios comerciais no Rundbuck"
  },
  "Pendler nach Zürich/Schaffhausen, Mieter in neuen Hochhaus-Überbauungen, Familien, lokale Betriebe": {
    en: "Commuters to Zurich/Schaffhausen, tenants in new high-rise developments, families, local businesses",
    es: "Conmutadores a Zúrich/Schaffhausen, inquilinos en torres de obra nueva, familias, empresas locales",
    fr: "Navetteurs vers Zurich/Schaffhouse, locataires de nouvelles tours résidentielles, familles, entreprises locales",
    it: "Pendolari per Zurigo/Sciaffusa, inquilini in nuove torri residenziali, famiglie, aziende locali",
    pt: "Trabalhadores em deslocação para Zurique/Schaffhausen, inquilinos em novas torres, famílias, empresas locais"
  },
  "Exponierte Fensterflächen nahe des Rheinfalls erfordern spezielle Glasreinigungen zur Entfernung feiner Gischt-Rückstände. Sperrgut zwingend vorab bei der Gemeinde anmelden.": {
    en: "Exposed window surfaces near the Rhine Falls require special glass cleaning to remove fine mist residues. Bulky waste must be registered with the municipality in advance.",
    es: "Las ventanas expuestas cerca del Salto del Rin requieren una limpieza especial de cristales para eliminar residuos de pulverización de agua. Los residuos voluminosos deben registrarse previamente con el municipio.",
    fr: "Les baies vitrées exposées près des chutes du Rhin nécessitent un nettoyage de vitres spécifique pour éliminer les résidus de brume d'eau. Les encombrants doivent impérativement être déclarés à la commune au préalable.",
    it: "Le vetrate esposte vicino alle cascate del Reno richiedono una pulizia speciale dei vetri per rimuovere i residui di nebulizzazione. Gli ingombranti devono essere registrati in anticipo presso il comune.",
    pt: "As janelas expostas perto das Cataratas do Rino exigem uma limpeza especial de vidros para remover resíduos da névoa de água. Os resíduos volumosos têm de ser registados previamente no município."
  },

  // Stein am Rhein
  "Weisser Gebührensack KVA Thurgau (Verbandssystem)": {
    en: "Official White Garbage Sack KVA Thurgau (Association System)",
    es: "Bolsa Oficial Blanca de Basura KVA Thurgau (Sistema de Asociación)",
    fr: "Sac Poubelle Payant Blanc Officiel KVA Thurgau (Système Associatif)",
    it: "Sacco Ufficiale Bianco KVA Thurgau (Sistema Associativo)",
    pt: "Saco de Lixo Oficial Branco KVA Thurgau (Sistema da Associação)"
  },
  "RAZ (Recycling- und Abfallzentrum)": {
    en: "RAZ (Recycling & Waste Disposal Center)",
    es: "RAZ (Centro de Reciclaje y Residuos)",
    fr: "RAZ (Centre de Recyclage et Déchets)",
    it: "RAZ (Centro Riciclaggio e Smaltimento Rifiuti)",
    pt: "RAZ (Centro de Reciclagem e Resíduos)"
  },
  "WICHTIG: Kleinsperrgutsammlung KOMPLETT ABGESCHAFFT! Keine Straßensammlung, keine Sperrgutmarken. Brennbares Sperrgut muss zwingend direkt kostenpflichtig zum RAZ transportiert werden.": {
    en: "IMPORTANT: Small bulky waste collection COMPLETELY ABOLISHED! No street collection, no stickers sold. Combustible bulky waste must be transported directly to RAZ at a fee.",
    es: "¡IMPORTANTE: Recogida de enseres pequeña COMPLETAMENTE ABOLIDA! Sin recogida en la calle ni venta de marcas. Todo residuo combustible voluminoso debe ser transportado directamente al RAZ pagando la tasa.",
    fr: "IMPORTANT : Collecte d'encombrants TOTALEMENT SUPPRIMÉE ! Pas de collecte de rue, pas de vignettes. Les encombrants combustibles doivent être transportés directement au RAZ moyennant frais.",
    it: "IMPORTANTE: Raccolta piccoli ingombranti COMPLETAMENTE ABOLITA! Nessuna raccolta stradale, nessun bollino venduto. Gli ingombranti combustibili devono essere trasportati direttamente al RAZ a pagamento.",
    pt: "IMPORTANTE: Recolha de resíduos volumosos pequenos TOTALMENTE ABOLIDA! Sem recolha na rua, sem venda de selos. Resíduos volumosos combustíveis têm de ser transportados diretamente para o RAZ com custos."
  },
  "Anfahrt ab Schaffhausen ca. 25 Min. Mindestauftrag für B2B-Unterhalt.": {
    en: "Travel time from Schaffhausen approx. 25 min. Minimum order for B2B maintenance.",
    es: "Desplazamiento desde Schaffhausen aprox. 25 min. Pedido mínimo para mantenimiento B2B.",
    fr: "Déplacement depuis Schaffhouse env. 25 min. Commande minimale pour l'entretien B2B.",
    it: "Trasferta da Sciaffusa circa 25 min. Ordine minimo per manutenzione B2B.",
    pt: "Deslocamento a partir de Schaffhausen aprox. 25 min. Encomenda mínima para manutenção B2B."
  },
  "Historische Fachwerkhäuser mit Wandmalereien, verwinkelte Altstadtwohnungen, Alterswohnungen im Chlosterhof, moderne Einfamilienhäuser am Stadtrand": {
    en: "Historic timber-framed houses with murals, winding old town apartments, senior residences in Chlosterhof, modern single-family homes on the outskirts",
    es: "Casas históricas de entramado de madera con murales, apartamentos sinuosos en el casco antiguo, residencias de ancianos en Chlosterhof, casas unifamiliares modernas en las afueras",
    fr: "Maisons historiques à colombages avec fresques, appartements sinueux de la vieille ville, résidences pour séniors à Chlosterhof, maisons individuelles modernes en périphérie",
    it: "Storiche case a graticcio con affreschi, appartamenti serpeggianti nel centro storico, residenze per anziani nel Chlosterhof, moderne case unifamiliari in periferia",
    pt: "Casas históricas de enxaimel com murais, apartamentos sinuosos no centro histórico, residências de idosos no Chlosterhof, moradias modernas na periferia"
  },
  "Besitzer historischer Immobilien, Gastronomie- und Pensionsbetreiber, Senioren, Wochenend-Heimkehrer": {
    en: "Owners of historic properties, restaurant and guesthouse operators, seniors, weekend residents",
    es: "Propietarios de inmuebles históricos, hosteleros y administradores de pensiones, jubilados, residentes de fin de semana",
    fr: "Propriétaires de biens historiques, restaurateurs et gérants de chambres d'hôtes, séniors, résidents du week-end",
    it: "Proprietari di immobili storici, ristoratori e gestori di pensioni, anziani, residenti del fine settimana",
    pt: "Proprietários de imóveis históricos, hoteleiros e gestores de pensões, idosos, residentes de fim de semana"
  },
  "Keine Sperrgutabfuhr an der Strasse — Entsorgungsgut wird durch unser Team direkt zum RAZ transportiert. Denkmalschutz-Vorgaben bei historischen Fassaden.": {
    en: "No bulky waste pickup on the street — items are transported directly to RAZ by our team. Historical preservation guidelines for historic facades.",
    es: "Sin recogida de residuos voluminosos en la calle: nuestro equipo transporta los enseres directamente al RAZ. Cumplimiento de normas de protección de monumentos en fachadas históricas.",
    fr: "Pas de ramassage d'encombrants dans la rue : les affaires sont transportées directement au RAZ par notre équipe. Respect du patrimoine sur les façades historiques.",
    it: "Nessuna raccolta stradale di ingombranti: il materiale viene trasportato direttamente al RAZ dal nostro team. Rispetto delle norme sui beni culturali per le facciate storiche.",
    pt: "Sem recolha de resíduos volumosos na rua: os bens são transportados diretamente para o RAZ pela nossa equipa. Cumprimento das normas de património em fachadas históricas."
  },

  // Thayngen
  "Gebührensack Gemeinde Thayngen (Abfallverordnung 2024)": {
    en: "Official Garbage Sack Municipality of Thayngen (Waste Ordinance 2024)",
    es: "Bolsa Oficial de Basura del Municipio de Thayngen (Ordenanza de Residuos 2024)",
    fr: "Sac Poubelle Payant Officiel de Thayngen (Règlement 2024)",
    it: "Sacco Ufficiale della Spazzatura del Comune di Thayngen (Regolamento 2024)",
    pt: "Saco de Lixo Oficial do Município de Thayngen (Regulamento de 2024)"
  },
  "Entsorgungsplatz Bauverwaltung Thayngen (Dorfstrasse 30)": {
    en: "Disposal Site Building Administration Thayngen (Dorfstrasse 30)",
    es: "Punto de Reciclaje de la Administración de Thayngen (Dorfstrasse 30)",
    fr: "Déchetterie Administration Thayngen (Dorfstrasse 30)",
    it: "Centro di Smaltimento Municipio di Thayngen (Dorfstrasse 30)",
    pt: "Ponto de Reciclagem da Administração de Thayngen (Dorfstrasse 30)"
  },
  "Grünabfuhr via Markensystem (35L-Marken). Aufwandtarif Fr. 3.00/Min (min. Fr. 15.00). Separater Abfallkalender 'Unterer Reiat' für Altdorf, Bibern, Hofen, Opfertshofen.": {
    en: "Green waste collection via sticker system (35L stickers). Effort rate CHF 3.00/min (min. CHF 15.00). Separate waste calendar 'Unterer Reiat' for Altdorf, Bibern, Hofen, Opfertshofen.",
    es: "Recogida de residuos orgánicos mediante sistema de marcas (marcas de 35L). Tarifa de esfuerzo CHF 3.00/min (mín. CHF 15.00). Calendario de residuos separado 'Unterer Reiat' para Altdorf, Bibern, Hofen, Opfertshofen.",
    fr: "Collecte des déchets verts via système de vignettes (vignettes 35L). Tarif à l'effort CHF 3.00/min (min. CHF 15.00). Calendrier de déchets séparé 'Unterer Reiat' pour Altdorf, Bibern, Hofen, Opfertshofen.",
    it: "Raccolta verde tramite sistema a bollini (bollini da 35L). Tariffa a consumo CHF 3.00/min (min. CHF 15.00). Calendario rifiuti separato 'Unterer Reiat' per Altdorf, Bibern, Hofen, Opfertshofen.",
    pt: "Recolha de resíduos verdes via sistema de selos (selos de 35L). Tarifa de esforço CHF 3.00/mín (mín. CHF 15.00). Calendário de resíduos separado 'Unterer Reiat' para Altdorf, Bibern, Hofen, Opfertshofen."
  },
  "Reiat-Grenzregion — Anfahrt 15 CHF Pauschale.": {
    en: "Reiat border region — travel flat fee 15 CHF.",
    es: "Región fronteriza de Reiat: tarifa plana de desplazamiento de 15 CHF.",
    fr: "Région frontière du Reiat — forfait de déplacement de 15 CHF.",
    it: "Regione di confine del Reiat — tariffa fissa di trasferta 15 CHF.",
    pt: "Região de fronteira do Reiat — taxa fixa de deslocamento de 15 CHF."
  },
  "Einfamilienhaus-Siedlungen, weitläufige Gewerbe- und Logistikflächen, traditionelle Häuser im Ortskern sowie Ortsteile im Unteren Reiat": {
    en: "Single-family housing developments, extensive commercial and logistics areas, traditional village center homes, and districts in Unterer Reiat",
    es: "Urbanizaciones de casas unifamiliares, amplias áreas comerciales y logísticas, casas tradicionales en el centro del pueblo y distritos en Unterer Reiat",
    fr: "Lotissements de maisons individuelles, vastes zones commerciales et logistiques, maisons traditionnelles au cœur du village et quartiers de Unterer Reiat",
    it: "Quartieri di case unifamiliari, vaste aree commerciali e logistiche, case tradizionali nel centro e frazioni nell'Unterer Reiat",
    pt: "Loteamentos de moradias unifamiliares, amplas áreas comerciais e logísticas, casas tradicionais no centro e distritos no Unterer Reiat"
  },
  "Berufspendler nach Singen und Zürich, Logistik- und KMU-Geschäftsleitungen, Anwohner im Reiat": {
    en: "Commuters to Singen and Zurich, logistics and SME executives, Reiat residents",
    es: "Trabajadores en tránsito a Singen y Zúrich, directivos de logística y PYMEs, residentes de Reiat",
    fr: "Navetteurs vers Singen et Zurich, dirigeants de la logistique et de PME, résidents du Reiat",
    it: "Pendolari per Singen e Zurigo, dirigenti della logistica e PMI, residenti di Reiat",
    pt: "Pendulares para Singen e Zurique, executivos de logística e PMEs, residentes de Reiat"
  },
  "Gewerbliche Hallen erfordern maschinelle Bodenreinigung. Abfuhrtage und Entsorgungsrouten variieren zwischen Hauptort Thayngen und dem Unteren Reiat.": {
    en: "Commercial halls require machine floor scrubbing. Collection days and waste routes vary between main town Thayngen and Unterer Reiat.",
    es: "Las naves comerciales requieren fregado mecánico de suelos. Los días de recogida y rutas de residuos varían entre el centro de Thayngen y Unterer Reiat.",
    fr: "Les halls commerciaux nécessitent un nettoyage mécanisé des sols. Les jours de ramassage et circuits varient entre Thayngen-centre et le Unterer Reiat.",
    it: "I capannoni commerciali richiedono il lavaggio meccanizzato dei pavimenti. I giorni di raccolta e i percorsi variano tra Thayngen e l'Unterer Reiat.",
    pt: "Pavilhões comerciais exigem lavagem mecânica do chão. Os dias de recolha e rotas variam entre a vila principal de Thayngen e Unterer Reiat."
  },

  // Beringen
  "Abfallmarken-System Beringen": {
    en: "Beringen Garbage Sticker System",
    es: "Sistema de Marcas de Basura de Beringen",
    fr: "Système de Vignettes Poubelle de Beringen",
    it: "Sistema a Bollini Rifiuti di Beringen",
    pt: "Sistema de Etiquetas de Lixo de Beringen"
  },
  "KBA Hard (auf Gemeindegebiet), Abfallcenter Beringen AG & Arnold Schmid Recycling AG": {
    en: "KBA Hard (in municipality area), Abfallcenter Beringen AG & Arnold Schmid Recycling AG",
    es: "KBA Hard (en el municipio), Abfallcenter Beringen AG y Arnold Schmid Recycling AG",
    fr: "KBA Hard (sur la commune), Abfallcenter Beringen AG & Arnold Schmid Recycling AG",
    it: "KBA Hard (nel territorio comunale), Abfallcenter Beringen AG & Arnold Schmid Recycling AG",
    pt: "KBA Hard (no município), Abfallcenter Beringen AG e Arnold Schmid Recycling AG"
  },
  "Markensystem für Hausrat. Schwarzabfall mittwochs, Grüngut dienstags (im Winter alle 14 Tage). Beringen bildet das Entsorgungszentrum des Kantons.": {
    en: "Sticker system for household items. Black waste Wednesdays, green waste Tuesdays (in winter every 14 days). Beringen forms the canton's disposal center.",
    es: "Sistema de marcas para enseres domésticos. Residuos negros los miércoles, residuos orgánicos los martes (en invierno cada 14 días). Beringen es el centro de reciclaje del cantón.",
    fr: "Système de vignettes pour articles ménagers. Déchets noirs les mercredis, déchets verts les mardis (en hiver tous les 14 jours). Beringen est le centre d'élimination du canton.",
    it: "Sistema a bollini per arredi. Rifiuti indifferenziati il mercoledì, verde il martedì (in inverno ogni 14 giorni). Beringen costituisce il centro di smaltimento del cantone.",
    pt: "Sistema de selos para artigos domésticos. Lixo preto às quartas-feiras, resíduos verdes às terças-feiras (no inverno a cada 14 dias). Beringen é o centro de eliminação do cantão."
  },
  "Schnelle Anfahrt über Hauptstrasse Klettgau (10 CHF Pauschale).": {
    en: "Fast travel via Klettgau main road (10 CHF flat fee).",
    es: "Desplazamiento rápido por la carretera principal de Klettgau (tarifa plana de 10 CHF).",
    fr: "Déplacement rapide via la route principale du Klettgau (forfait 10 CHF).",
    it: "Trasferta rapida tramite la strada principale del Klettgau (forfait 10 CHF).",
    pt: "Deslocamento rápido pela estrada principal de Klettgau (taxa fixa de 10 CHF)."
  },
  "Moderne Neubau-Siedlungen, geräumige Einfamilienhäuser im Grünen, Industrie- und Gewerbebauten": {
    en: "Modern new developments, spacious single-family homes in green areas, industrial and commercial buildings",
    es: "Urbanizaciones modernas de obra nueva, amplias casas unifamiliares rodeadas de naturaleza, edificios industriales y comerciales",
    fr: "Lotissements récents et modernes, spacieuses maisons individuelles en pleine nature, bâtiments industriels et commerciaux",
    it: "Moderne nuove costruzioni, spaziose case unifamiliari nel verde, edifìci industriali e commerciali",
    pt: "Empreendimentos modernos de construção nova, moradias espaçosas rodeadas de natureza, edifícios industriais e comerciais"
  },
  "Junge Familien mit Doppelverdienst, ansässige Technologie- und Recyclingbetriebe": {
    en: "Dual-income young families, resident technology and recycling companies",
    es: "Familias jóvenes con doble ingreso, empresas tecnológicas y de reciclaje de la zona",
    fr: "Jeunes familles à double revenu, entreprises locales de technologie et de recyclage",
    it: "Giovani famiglie con doppio reddito, aziende tecnologiche e di riciclaggio locali",
    pt: "Jovens famílias com duplo rendimento, empresas locais de tecnologia e reciclagem"
  },
  "Als Entsorgungs-Hub des Kantons (KBA Hard, Abfallcenter Beringen) bietet Beringen extrem kurze Logistikwege bei Räumungen. Empfindliche Neubau-Böden verlangen pH-neutrale Pflege.": {
    en: "As the canton's disposal hub (KBA Hard, Abfallcenter Beringen), Beringen offers extremely short logistics routes for clearances. Sensitive new floors require pH-neutral care.",
    es: "Como centro de residuos del cantón (KBA Hard, Abfallcenter Beringen), Beringen ofrece rutas logísticas muy cortas para vaciados. Los suelos delicados de obra nueva requieren productos pH neutro.",
    fr: "En tant que pôle d'élimination du canton (KBA Hard, Abfallcenter Beringen), Beringen offre des trajets logistiques très courts pour les débarras. Les sols récents sensibles exigent un entretien au pH neutre.",
    it: "Come hub di smaltimento del cantone (KBA Hard, Abfallcenter Beringen), Beringen offre percorsi logistici brevissimi per gli sgomberi. I pavimenti delicati di nuova costruzione richiedono cura con pH neutro.",
    pt: "Como centro de eliminação do cantão (KBA Hard, Abfallcenter Beringen), Beringen oferece rotas logísticas extremamente curtas para despejos. Pavimentos delicados de construção nova exigem tratamento com pH neutro."
  },

  // Schaffhausen
  "KBA Hard (Beringen)": {
    en: "KBA Hard (Beringen)",
    es: "KBA Hard (Beringen)",
    fr: "KBA Hard (Beringen)",
    it: "KBA Hard (Beringen)",
    pt: "KBA Hard (Beringen)"
  },
  "Marke CHF 5.00 pro Einheit aufkleben. Keine Anmeldung erforderlich. Bereitstellung bis 07:00 Uhr am Abfuhrtag (über 30°C ab 06:00 Uhr). In der Altstadt gilt Unterflurcontainer-Pflicht (Tour 6).": {
    en: "Attach CHF 5.00 sticker per unit. No registration required. Provision by 07:00 AM on collection day (above 30°C from 06:00 AM). Underground container mandatory in old town (Tour 6).",
    es: "Adherir marca de 5.00 CHF por unidad. No requiere registro. Colocación antes de las 07:00 h el día de recogida (más de 30°C desde las 06:00 h). En el casco antiguo es obligatorio el uso de contenedores subterráneos (Tour 6).",
    fr: "Apposer une vignette de 5.00 CHF par unité. Aucune inscription requise. Mise à disposition avant 07h00 le jour de ramassage (au-dessus de 30°C dès 06h00). Conteneurs enterrés obligatoires dans la vieille ville (Tour 6).",
    it: "Applicare bollino da CHF 5.00 per unità. Nessuna registrazione richiesta. Messa a disposition entro le 07:00 il giorno di raccolta (sopra i 30°C dalle 06:00). Nel centro storico sono obbligatori i cassonetti interrati (Tour 6).",
    pt: "Colar etiqueta de CHF 5.00 por unidade. Sem necessidade de registo. Disponibilização até às 07:00 no dia da recolha (acima de 30°C a partir das 06:00). No centro histórico é obrigatório o uso de contentores subterrâneos (Tour 6)."
  },
  "Zentraler Standort — keine Anfahrtskosten innerhalb des Stadtgebiets.": {
    en: "Central location — no travel costs within the city area.",
    es: "Ubicación central: sin costes de desplazamiento dentro de la ciudad.",
    fr: "Emplacement central — pas de frais de déplacement dans la ville.",
    it: "Posizione centrale — nessuna spesa di trasferta in città.",
    pt: "Localização central — sem custos de deslocamento na área urbana."
  },
  "Altstadt-Häuser mit Holz-Riegelwerk, herrschaftliche Stadtvillen am Geissberg, Wohnblöcke im Herblingertal": {
    en: "Old town timber-framed houses, grand city villas at Geissberg, apartment blocks in Herblingertal",
    es: "Edificios del casco antiguo con entramado de madera, mansiones en Geissberg, bloques de pisos en Herblingertal",
    fr: "Maisons à colombages de la vieille ville, grandes villas urbaines à Geissberg, immeubles collectifs à Herblingertal",
    it: "Edifici del centro storico a graticcio, maestose ville cittadine sul Geissberg, condomini nella Herblingertal",
    pt: "Edifícios do centro histórico em enxaimel, mansões no Geissberg, blocos de apartamentos em Herblingertal"
  },
  "Vielbeschäftigte Familien, KMUs, Arztpraxen und Mieter vor Wohnungsübergaben": {
    en: "Busy families, SMEs, medical practices, and tenants preparing for handover",
    es: "Familias ocupadas, PYMEs, consultas médicas e inquilinos antes de la entrega de llaves",
    fr: "Familles occupées, PME, cabinets médicaux et locataires avant état des lieux",
    it: "Famiglie impegnate, PMI, studi medici e inquilini prima della riconsegna dell'appartamento",
    pt: "Famílias ocupadas, PMEs, consultórios médicos e inquilinos antes da entrega da propriedade"
  },
  "Sehr hohe Wasserhärte im Stadtnetz verlangt professionelle Entkalkungsdurchgänge. Schonende Pflege historischer Parkettböden und Stuckdecken.": {
    en: "Very high water hardness in the city network requires professional limescale removal. Gentle care for historic parquet floors and stucco ceilings.",
    es: "La elevada dureza del agua en la red urbana requiere descalcificación profesional. Cuidado delicado de parquets históricos y techos con molduras de estuco.",
    fr: "La dureté très élevée de l'eau du réseau urbain exige un détartrage professionnel. Entretien délicat des parquets historiques et plafonds en stuc.",
    it: "L'elevatissima durezza dell'acqua nella rete cittadina richiede interventi professionali di anticalcare. Cura delicata di parquet storici e soffitti in stucco.",
    pt: "A elevada dureza da água na rede municipal exige descalcificação profissional. Cuidado delicado de pavimentos em taco histórico e tetos com estuque."
  }
};

function trContent(text: string | null | undefined, targetLang: string): string {
  if (!text) return '';
  if (targetLang === 'de') return text;
  if (TRANSLATIONS_MAP[text] && TRANSLATIONS_MAP[text][targetLang]) {
    return TRANSLATIONS_MAP[text][targetLang];
  }
  return text;
}

interface MunicipalDossierSectionProps {
  mun: Municipality;
  onNavigate?: (page: string) => void;
}

export const MunicipalDossierSection: React.FC<MunicipalDossierSectionProps> = ({ mun, onNavigate }) => {
  const { language } = useTranslation();
  const rawLang = language || 'de';
  const activeLang = (rawLang === 'de-CH' || rawLang === 'de') ? 'de' : rawLang;
  const lang = ['de', 'en', 'es', 'fr', 'it', 'pt'].includes(activeLang) ? activeLang : 'de';

  const entsorgung = mun.localContent?.entsorgung;
  const context = mun.localContext;

  const labels = {
    de: {
      badge: `Geprüftes Gemeindedossier 2026 · ${mun.name}`,
      title: `Entsorgungsreglement & Lokaler Kontext in ${mun.name}`,
      subtitle: `Offizielle Vorgaben zu Gebührensäcken, Sperrgut, Kündigungsterminen und Gebäudestrukturen in der Gemeinde ${mun.name} (${mun.canton}).`,
      wasteTitle: "Offizielles Abfallsystem & Gebührensack",
      wasteSackLabel: "Offizieller Gebührensack:",
      wasteSizesLabel: "Verfügbare Grössen:",
      recyclingLabel: "Entsorgungszentrum / Recyclinghof:",
      sperrgutTitle: "Sperrgut-Bestimmungen & Sonderregeln",
      buildingTitle: "Gebäudestruktur & Reinigungspraxis",
      buildingTypesLabel: "Gebäudetypen & Quartiere:",
      clientLabel: "Kundenprofil:",
      notesLabel: "Besondere Reinigungshinweise:",
      noticeTitle: "Mietrecht & Kündigungstermine",
      cantonLabel: "Kanton:",
      noticeLabel: "Kündigungstermine:",
      dispatchLabel: "Anfahrts- & Logistik-Hinweis:",
      btnQuote: "Sofort-Offerte berechnen",
      alertWarning: "Wichtige Sonderregelung",
      verifiedTag: "Von Kraken PFM verifiziertes Abfallreglement",
      guaranteeTag: "Logistik-Garantie Kraken PFM",
      complianceTag: "100% Konformität"
    },
    en: {
      badge: `Verified Municipal Dossier 2026 · ${mun.name}`,
      title: `Waste Disposal Rules & Local Context in ${mun.name}`,
      subtitle: `Official directives on garbage sacks, bulky waste, notice dates, and property structures in ${mun.name} (${mun.canton}).`,
      wasteTitle: "Official Waste System & Garbage Sack",
      wasteSackLabel: "Official Garbage Sack:",
      wasteSizesLabel: "Available Sizes:",
      recyclingLabel: "Recycling & Disposal Center:",
      sperrgutTitle: "Bulky Waste Directives & Special Rules",
      buildingTitle: "Property Structure & Cleaning Practice",
      buildingTypesLabel: "Property Types & Areas:",
      clientLabel: "Client Profile:",
      notesLabel: "Specific Cleaning Notes:",
      noticeTitle: "Tenancy Law & Notice Dates",
      cantonLabel: "Canton:",
      noticeLabel: "Notice Dates:",
      dispatchLabel: "Travel & Logistics Note:",
      btnQuote: "Calculate Instant Quote",
      alertWarning: "Important Special Rule",
      verifiedTag: "Waste regulations verified by Kraken PFM",
      guaranteeTag: "Kraken PFM Logistics Guarantee",
      complianceTag: "100% Compliance"
    },
    es: {
      badge: `Dossier Municipal Verificado 2026 · ${mun.name}`,
      title: `Reglamento de Residuos y Contexto Local en ${mun.name}`,
      subtitle: `Directivas oficiales sobre bolsas de basura, enseres, fechas de rescisión y estructuras inmobiliarias en ${mun.name} (${mun.canton}).`,
      wasteTitle: "Sistema Oficial de Residuos y Bolsas",
      wasteSackLabel: "Bolsa Oficial:",
      wasteSizesLabel: "Tamaños Disponibles:",
      recyclingLabel: "Centro de Reciclaje:",
      sperrgutTitle: "Residuos Voluminosos y Reglas Especiales",
      buildingTitle: "Estructura Inmobiliaria y Limpieza",
      buildingTypesLabel: "Tipos de Inmuebles:",
      clientLabel: "Perfil de Cliente:",
      notesLabel: "Notas Específicas de Limpieza:",
      noticeTitle: "Derecho de Arrendamiento y Cancelaciones",
      cantonLabel: "Cantón:",
      noticeLabel: "Fechas de Cancelación:",
      dispatchLabel: "Nota de Desplazamiento y Logística:",
      btnQuote: "Calcular Presupuesto Inmediato",
      alertWarning: "Regla Especial Importante",
      verifiedTag: "Reglamento de residuos verificado por Kraken PFM",
      guaranteeTag: "Garantía Logística Kraken PFM",
      complianceTag: "100% Conformidad"
    },
    fr: {
      badge: `Dossier Municipal Vérifié 2026 · ${mun.name}`,
      title: `Règlement des Déchets & Contexte Local à ${mun.name}`,
      subtitle: `Directives officielles sur les sacs poubelles payants, objets encombrants, dates de résiliation et structures immobilières à ${mun.name} (${mun.canton}).`,
      wasteTitle: "Système Officiel de Déchets & Sac Payant",
      wasteSackLabel: "Sac Poubelle Officiel :",
      wasteSizesLabel: "Tailles Disponibles :",
      recyclingLabel: "Centre de Recyclage & Déchetterie :",
      sperrgutTitle: "Objets Encombrants & Règles Spéciales",
      buildingTitle: "Structure Immobilière & Pratique du Nettoyage",
      buildingTypesLabel: "Types d'Immeubles & Quartiers :",
      clientLabel: "Profil Client :",
      notesLabel: "Remarques Spécifiques de Nettoyage :",
      noticeTitle: "Droit du Bail & Délais de Résiliation",
      cantonLabel: "Canton :",
      noticeLabel: "Délais de Résiliation :",
      dispatchLabel: "Note de Déplacement & Logistique :",
      btnQuote: "Calculer un Devis Immédiat",
      alertWarning: "Règle Spéciale Importante",
      verifiedTag: "Règlement des déchets vérifié par Kraken PFM",
      guaranteeTag: "Garantie Logistique Kraken PFM",
      complianceTag: "100% Conformité"
    },
    it: {
      badge: `Dossier Municipale Verificato 2026 · ${mun.name}`,
      title: `Regolamento Rifiuti & Contesto Locale a ${mun.name}`,
      subtitle: `Direttive ufficiali su sacchi della spazzatura, rifiuti ingombranti, scadenze di disdetta e strutture immobiliari a ${mun.name} (${mun.canton}).`,
      wasteTitle: "Sistema Ufficiale Rifiuti & Sacco Ufficiale",
      wasteSackLabel: "Sacco Ufficiale della Spazzatura:",
      wasteSizesLabel: "Dimensioni Disponibili:",
      recyclingLabel: "Centro di Riciclaggio:",
      sperrgutTitle: "Rifiuti Ingombranti & Norme Speciali",
      buildingTitle: "Struttura Immobiliare & Pratica di Pulizia",
      buildingTypesLabel: "Tipi di Immobili & Quartieri:",
      clientLabel: "Profilo Cliente:",
      notesLabel: "Note Specifiche di Pulizia:",
      noticeTitle: "Diritto di Locazione & Termini di Disdetta",
      cantonLabel: "Cantone:",
      noticeLabel: "Termini di Disdetta:",
      dispatchLabel: "Nota Logistica e Spostamento:",
      btnQuote: "Calcola Preventivo Immediato",
      alertWarning: "Regola Speciale Importante",
      verifiedTag: "Regolamento rifiuti verificato da Kraken PFM",
      guaranteeTag: "Garanzia Logistica Kraken PFM",
      complianceTag: "100% Conformità"
    },
    pt: {
      badge: `Dossiê Municipal Verificado 2026 · ${mun.name}`,
      title: `Regulamento de Resíduos e Contexto Local em ${mun.name}`,
      subtitle: `Diretrizes oficiais sobre sacos de lixo oficiais, resíduos volumosos, datas de rescisão e estruturas imobiliárias em ${mun.name} (${mun.canton}).`,
      wasteTitle: "Sistema Oficial de Resíduos e Sacos Oficiais",
      wasteSackLabel: "Saco de Lixo Oficial:",
      wasteSizesLabel: "Tamanhos Disponíveis:",
      recyclingLabel: "Centro de Reciclagem:",
      sperrgutTitle: "Resíduos Volumosos e Regras Especiais",
      buildingTitle: "Estrutura Imobiliária e Prática de Limpeza",
      buildingTypesLabel: "Tipos de Imóveis & Bairros:",
      clientLabel: "Perfil do Cliente:",
      notesLabel: "Notas Específicas de Limpeza:",
      noticeTitle: "Direito de Inquilinato e Datas de Rescisão",
      cantonLabel: "Cantão:",
      noticeLabel: "Datas de Rescisão:",
      dispatchLabel: "Nota de Deslocamento e Logística:",
      btnQuote: "Calcular Orçamento Imediato",
      alertWarning: "Regra Especial Importante",
      verifiedTag: "Regulamento de resíduos verificado pela Kraken PFM",
      guaranteeTag: "Garantía Logística Kraken PFM",
      complianceTag: "100% Conformidade"
    }
  }[lang as 'de' | 'en' | 'es' | 'fr' | 'it' | 'pt'] || {
    badge: `Geprüftes Gemeindedossier 2026 · ${mun.name}`,
    title: `Entsorgungsreglement & Lokaler Kontext in ${mun.name}`,
    subtitle: `Offizielle Vorgaben zu Gebührensäcken, Sperrgut, Kündigungsterminen und Gebäudestrukturen in der Gemeinde ${mun.name} (${mun.canton}).`,
    wasteTitle: "Offizielles Abfallsystem & Gebührensack",
    wasteSackLabel: "Offizieller Gebührensack:",
    wasteSizesLabel: "Verfügbare Grössen:",
    recyclingLabel: "Entsorgungszentrum / Recyclinghof:",
    sperrgutTitle: "Sperrgut-Bestimmungen & Sonderregeln",
    buildingTitle: "Gebäudestruktur & Reinigungspraxis",
    buildingTypesLabel: "Gebäudetypen & Quartiere:",
    clientLabel: "Kundenprofil:",
    notesLabel: "Besondere Reinigungshinweise:",
    noticeTitle: "Mietrecht & Kündigungstermine",
    cantonLabel: "Kanton:",
    noticeLabel: "Kündigungstermine:",
    dispatchLabel: "Anfahrts- & Logistik-Hinweis:",
    btnQuote: "Sofort-Offerte berechnen",
    alertWarning: "Wichtige Sonderregelung",
    verifiedTag: "Von Kraken PFM verifiziertes Abfallreglement",
    guaranteeTag: "Logistik-Garantie Kraken PFM",
    complianceTag: "100% Konformität"
  };

  // Determine if there is a special strict rule (e.g. Stein am Rhein no sperrgut or Neuhausen registration)
  const isSpecialWarning = entsorgung?.sperrgutRules?.toLowerCase().includes('abgeschafft') || 
                           entsorgung?.sperrgutRules?.toLowerCase().includes('anfrage') ||
                           entsorgung?.sperrgutRules?.toLowerCase().includes('anmeldung');

  const cantonalNoticeText = KUENDIGUNGSTERMINE[mun.canton as keyof typeof KUENDIGUNGSTERMINE]?.[lang as 'de' | 'en' | 'es' | 'fr' | 'it' | 'pt'] || mun.localContent.kuendigungstermine;

  return (
    <section className="py-16 px-6 bg-[#001226] text-white border-y border-cyan-900/30 relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-bold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{labels.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {labels.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            {labels.subtitle}
          </p>
        </div>

        {/* Dossier Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Offizielles Abfallsystem & Gebührensack */}
          {entsorgung && (
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-6 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-400/20 text-cyan-400">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                      {mun.name} ({mun.canton})
                    </span>
                    <h3 className="text-xl font-bold text-white">{labels.wasteTitle}</h3>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300">
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 text-xs block font-mono">{labels.wasteSackLabel}</span>
                    <span className="font-bold text-cyan-200 text-base">{trContent(entsorgung.officialSackName, lang)}</span>
                  </div>

                  {entsorgung.sackSizes && entsorgung.sackSizes.length > 0 && (
                    <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                      <span className="text-slate-400 text-xs block font-mono mb-1.5">{labels.wasteSizesLabel}</span>
                      <div className="flex flex-wrap gap-2">
                        {entsorgung.sackSizes.map((size, idx) => (
                          <span key={idx} className="bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {entsorgung.recyclingCenter && (
                    <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                      <span className="text-slate-400 text-xs block font-mono">{labels.recyclingLabel}</span>
                      <span className="font-semibold text-slate-100">{trContent(entsorgung.recyclingCenter, lang)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{labels.verifiedTag}</span>
              </div>
            </div>
          )}

          {/* Card 2: Sperrgut-Bestimmungen & Sonderregeln */}
          {entsorgung?.sperrgutRules && (
            <div className={`p-8 rounded-3xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${
              isSpecialWarning 
                ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400/50' 
                : 'bg-white/5 border-white/10 hover:border-cyan-400/40'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border ${
                    isSpecialWarning 
                      ? 'bg-amber-500/20 border-amber-400/30 text-amber-300' 
                      : 'bg-cyan-500/10 border-cyan-400/20 text-cyan-400'
                  }`}>
                    {isSpecialWarning ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    {isSpecialWarning && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                        {labels.alertWarning}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white">{labels.sperrgutTitle}</h3>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {trContent(entsorgung.sperrgutRules, lang)}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span className="font-mono text-cyan-300">📍 {labels.guaranteeTag}</span>
                <span className="text-[11px] text-slate-400">{labels.complianceTag}</span>
              </div>
            </div>
          )}

          {/* Card 3: Gebäudestruktur & Reinigungspraxis */}
          {context && (
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-6 hover:border-cyan-400/40 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-400/20 text-cyan-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                    {mun.name}
                  </span>
                  <h3 className="text-xl font-bold text-white">{labels.buildingTitle}</h3>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                {context.buildingTypes && (
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 text-xs block font-mono">{labels.buildingTypesLabel}</span>
                    <span className="font-semibold text-slate-100">{trContent(context.buildingTypes, lang)}</span>
                  </div>
                )}

                {context.clientProfile && (
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 text-xs block font-mono">{labels.clientLabel}</span>
                    <span className="text-slate-200">{trContent(context.clientProfile, lang)}</span>
                  </div>
                )}

                {context.cleaningNotes && (
                  <div className="bg-cyan-500/10 p-3.5 rounded-xl border border-cyan-400/20">
                    <span className="text-cyan-300 text-xs block font-mono font-bold mb-0.5">{labels.notesLabel}</span>
                    <span className="text-slate-200 font-light leading-relaxed">{trContent(context.cleaningNotes, lang)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Card 4: Mietrecht & Kündigungstermine */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-6 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-400/20 text-cyan-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                    Mietrecht Kanton {mun.canton}
                  </span>
                  <h3 className="text-xl font-bold text-white">{labels.noticeTitle}</h3>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-xs block font-mono">{labels.noticeLabel}</span>
                  <span className="font-bold text-cyan-200">{cantonalNoticeText}</span>
                </div>

                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-xs block font-mono">{labels.dispatchLabel}</span>
                  <span className="text-slate-200 font-medium">{trContent(mun.localContent.einsatzhinweis, lang)}</span>
                </div>
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => {
                  const quoteData = {
                    address: '',
                    postcode: mun.plz[0] || '',
                    city: mun.name,
                  };
                  localStorage.setItem('kraken_consultation_data_v2', JSON.stringify(quoteData));
                  localStorage.setItem('kraken_preselected_service', 'end-of-tenancy');
                  onNavigate('consultation');
                }}
                className="w-full mt-4 py-3.5 px-6 bg-cyan-400 hover:bg-cyan-300 text-[#001226] font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>{labels.btnQuote} ({mun.name})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
