export interface SeoContent {
  prices: { label: string; range: string; basis: string }[];
  checklist: string[];
  faqs: { q: string; a: string }[];
}

export const SERVICE_SEO_CONTENT: Record<string, SeoContent> = {
  "end-of-tenancy": {
    prices: [
      { label: "1.5 Zimmer Wohnung", range: "CHF 520 - 690", basis: "Festpreis inkl. Abnahmegarantie" },
      { label: "2.5 Zimmer Wohnung", range: "CHF 680 - 850", basis: "Festpreis inkl. Abnahmegarantie" },
      { label: "3.5 Zimmer Wohnung", range: "CHF 820 - 1050", basis: "Festpreis inkl. Abnahmegarantie" },
      { label: "4.5 Zimmer Wohnung", range: "CHF 980 - 1300", basis: "Festpreis inkl. Abnahmegarantie" },
      { label: "5.5+ Zimmer / Haus", range: "Ab CHF 1250", basis: "Nach individueller Besichtigung" }
    ],
    checklist: [
      "Komplettreinigung aller Räume inklusive Böden (Staubsaugen und Feuchtwischen)",
      "Tiefenreinigung und Entkalkung von Badezimmer, Dusche, WC, Fliesen und Armaturen",
      "Kompakte Küchenreinigung inklusive Backofen, Dunstabzugshaube, Kühlschrank und Geschirrspüler",
      "Reinigung aller Fenster, Rahmen, Simse, Rollläden und Lamellenstoren",
      "Abwischen von Türen, Türrahmen, Steckdosen, Lichtschaltern und Einbauschränken (innen/aussen)"
    ],
    faqs: [
      { q: "Bieten Sie eine Abnahmegarantie für die Wohnungsübergabe in [comuna] an?", a: "Ja, bei Kraken PFM ist die Abnahmegarantie bei jeder Umzugsreinigung standardmässig und ohne Aufpreis inbegriffen. Das bedeutet: Wir übernehmen die volle Verantwortung dafür, dass der Vermieter die Wohnung anstandslos abnimmt." },
      { q: "Ist unser Reinigungsteam am Übergabetermin in [comuna] persönlich anwesend?", a: "Absolut. Unser Teamleiter ist bei der offiziellen Wohnungsübergabe mit Ihrem Vermieter oder der Verwaltung direkt vor Ort anwesend, um allfällige kleine Nachbesserungen sofort und kostenlos zu erledigen." },
      { q: "Wie lange dauert eine professionelle Umzugsreinigung in [comuna]?", a: "In der Regel benötigen wir für eine Standardwohnung (1.5 bis 4.5 Zimmer) genau einen Arbeitstag. Wir starten am frühen Morgen und übergeben die gereinigte Wohnung am Nachmittag schlüsselfertig." },
      { q: "Was passiert, wenn der Vermieter bei der Abnahme in [comuna] Mängel reklamiert?", a: "Falls der Vermieter mit einem Detail nicht zufrieden sein sollte, greift unsere Abnahmegarantie: Wir beheben die Mängel sofort und kostenfrei noch während des Abnahmetermins vor Ort." },
      { q: "Wie weit im Voraus sollte ich die Umzugsreinigung buchen?", a: "Da die meisten Wohnungsübergaben zum Monatsende stattfinden, empfehlen wir eine Buchung mindestens 2 bis 4 Wochen im Voraus, um Ihren Wunschtermin sicherzustellen." }
    ]
  },
  "deep-cleaning": {
    prices: [
      { label: "Kleinere Wohnung / Studio", range: "CHF 450 - 650", basis: "Pauschalpreis nach Absprache" },
      { label: "3 - 4 Zimmer Wohnung", range: "CHF 680 - 950", basis: "Pauschalpreis nach Absprache" },
      { label: "Einfamilienhaus / Loft", range: "Ab CHF 1100", basis: "Richtpreis je nach Verschmutzungsgrad" },
      { label: "Stundenbasierte Reinigung", range: "CHF 55 - 75 / Std.", basis: "Inklusive Reinigungsmaterial und Geräte" }
    ],
    checklist: [
      "Porentiefe Reinigung aller Fugen, Wand- und Bodenfliesen im gesamten Objekt",
      "Rückstandslose Entfernung von hartnäckigem Kalk, Urinstein und Fettablagerungen",
      "Gründliche Innenreinigung aller Schränke, Schubladen, Regale und Nischen",
      "Spezialreinigung hinter Heizkörpern, unter schweren Möbeln und an Fussleisten",
      "Nassreinigung von Türen, Zargen, Heizkörpern, Steckdosen und Lichtschaltern"
    ],
    faqs: [
      { q: "Wann empfiehlt sich eine intensive Grundreinigung in [comuna]?", a: "Eine Grundreinigung (Deep Cleaning) ist ideal 1-2 Mal im Jahr, beim Einzug in eine neue Wohnung, nach Sanierungen oder Renovierungsarbeiten, um tiefsitzenden Schmutz und hartnäckige Beläge restlos zu entfernen." },
      { q: "Sind alle Reinigungsmittel und Spezialmaschinen im Preis für [comuna] inbegriffen?", a: "Ja, alle benötigten Profi-Reinigungsmittel, Reinigungstücher und modernste Spezialmaschinen (wie Dampfreiniger oder Einscheibenmaschinen) sind vollumfänglich im Preis enthalten." },
      { q: "Wie lange dauert eine intensive Spezialreinigung in [comuna]?", a: "Je nach Grösse der Wohnung oder des Hauses dauert eine Tiefenreinigung üblicherweise zwischen 5 und 10 Stunden. Unser Team arbeitet hocheffizient, um Ihren Alltag so wenig wie möglich zu belasten." },
      { q: "Kann ich eine Grundreinigung in [comuna] auch kurzfristig buchen?", a: "Ja, dank unseres flexiblen Netzwerks können wir Notfall- oder Express-Grundreinigungen oft innerhalb von 24 bis 48 Stunden einplanen und professionell ausführen." },
      { q: "Müssen die Räume vor dem Eintreffen des Teams leer sein?", a: "Nein, das ist nicht nötig. Unsere Mitarbeiter reinigen auch um Möbel herum oder verschieben diese vorsichtig. Es hilft jedoch, wenn persönliche Kleingegenstände vorab weggeräumt werden." }
    ]
  },
  "daily-cleaning": {
    prices: [
      { label: "Wöchentlicher Service (Abo)", range: "CHF 43.50 - 48.00 / Std.", basis: "Exklusive Rabatte für Stammkunden" },
      { label: "2-Wöchentlicher Service (Abo)", range: "CHF 45.00 - 52.00 / Std.", basis: "Individuell anpassbare Reinigungszyklen" },
      { label: "Einmalige Reinigung", range: "CHF 55.00 / Std.", basis: "Mindesteinsatz von 3 Stunden" }
    ],
    checklist: [
      "Abstauben und feuchtes Abwischen aller erreichbaren Oberflächen und Möbel",
      "Gründliches Staubsaugen und feuchtes Wischen aller Hart- und Teppichböden",
      "Reinigung und Desinfektion von Waschbecken, Armaturen, WC, Dusche und Spiegeln",
      "Oberflächliche Reinigung der Küchenzeile, Arbeitsplatte und Spüle",
      "Leeren aller Abfalleimer und fachgerechte Entsorgung des Hausmülls"
    ],
    faqs: [
      { q: "Wie oft sollte eine professionelle Unterhaltsreinigung in [comuna] stattfinden?", a: "Das hängt ganz von Ihren Bedürfnissen ab. Für die meisten privaten Haushalte in der Region ist ein wöchentlicher oder zweiwöchentlicher Rhythmus ideal, um eine dauerhafte Wohlfühlatmosphäre zu sichern." },
      { q: "Arbeitet in [comuna] immer dieselbe Reinigungskraft bei mir?", a: "Ja, wir setzen auf Konstanz und Vertrauen. Sie erhalten eine feste, persönliche Stamm-Reinigungskraft zugeteilt. Im Falle von Ferien oder Krankheit stellen wir auf Wunsch eine qualifizierte Vertretung." },
      { q: "Muss ich während der Reinigung in [comuna] zu Hause sein?", a: "Nein. Die grosse Mehrheit unserer Kunden vertraut uns den Wohnungsschlüssel an. Alle Schlüssel werden bei uns streng codiert und absolut sicher aufbewahrt." },
      { q: "Sind Ihre Reinigungskräfte in [comuna] offiziell versichert?", a: "Selbstverständlich. Alle unsere Mitarbeiter sind absolut legal angestellt, sozialversichert (AHV/IV/ALV) und über eine grosszügige Betriebshaftpflichtversicherung gegen eventuelle Schäden geschützt." },
      { q: "Gibt es bei Kraken PFM eine Mindestvertragslaufzeit für Abos?", a: "Nein, wir glauben an die Qualität unserer Arbeit und verzichten auf Knebelverträge. Sie können Ihr Abo jederzeit flexibel mit einer Frist von nur einem Monat anpassen oder kündigen." }
    ]
  },
  "moving-furniture": {
    prices: [
      { label: "Kleintransport / Single-Umzug", range: "CHF 380 - 650", basis: "Inkl. 2 Zügelhelfer & Kleintransporter" },
      { label: "3.5 Zimmer Wohnung Umzug", range: "CHF 850 - 1350", basis: "Inkl. 3 Zügelhelfer, 3.5t LKW & Schutzmaterial" },
      { label: "4.5+ Zimmer Wohnung Umzug", range: "Ab CHF 1400", basis: "Individuelles Festpreisangebot nach Besichtigung" },
      { label: "Nur Zügelhelfer (ohne LKW)", range: "CHF 55 - 75 / Std. pro Mann", basis: "Mindestbuchung 3 Stunden" }
    ],
    checklist: [
      "Fachgerechte Demontage von Möbeln (Schränke, Betten, Regale) am Startort",
      "Sicheres Verpacken aller Möbelstücke in professionelle Schutzdecken und Stretchfolie",
      "Sorgfältiges Beladen des Transportfahrzeugs und transportsichere Befestigung",
      "Speditioneller Transport zum Zielort durch erfahrene Chauffeure",
      "Entladen, Transport in die neuen Räume und fachgerechte Montage der Möbel"
    ],
    faqs: [
      { q: "Wie setzen sich die Umzugskosten in [comuna] zusammen?", a: "Unsere Preise kalkulieren wir absolut transparent basierend auf dem Transportvolumen (Kubikmeter), der Distanz zwischen den Wohnorten, den Etagen und dem Vorhandensein eines Lifts." },
      { q: "Sind meine Möbel beim Transport in [comuna] vollumfänglich versichert?", a: "Ja, Kraken PFM verfügt über eine umfassende Transportversicherung sowie eine Betriebshaftpflichtversicherung bis zu CHF 5 Millionen. Ihre Wertsachen sind in besten Händen." },
      { q: "Stellen Sie auch professionelle Umzugskartons in [comuna] zur Verfügung?", a: "Gerne! Auf Wunsch liefern wir Ihnen im Vorfeld stabile Umzugskartons, Kleiderboxen, Luftpolsterfolie und Packpapier direkt nach Hause und holen diese nach dem Umzug wieder ab." },
      { q: "Übernehmen Ihre Mitarbeiter auch die Demontage und Montage der Möbel?", a: "Ja, unser Zügelteam ist handwerklich hervorragend ausgerüstet und übernimmt den kompletten Ab- und Aufbau Ihrer Schränke, Betten und Tische fachgerecht." },
      { q: "Was kann ich tun, um den Umzugstag in [comuna] optimal vorzubereiten?", a: "Sie erleichtern die Arbeit massiv, indem Sie im Vorfeld Parkplätze direkt vor dem Haus reservieren, Laufwege komplett freiräumen und empfindliche Böden mit Vlies oder Karton auslegen." }
    ]
  },
  "gardening": {
    prices: [
      { label: "Saisonaler Gartenservice (Frühling/Herbst)", range: "CHF 450 - 950", basis: "Je nach Gartengrösse und Aufwand" },
      { label: "Laufende Rasen- & Beetpflege (Abo)", range: "CHF 65 - 85 / Std.", basis: "Spezialkonditionen bei regelmässigem Service" },
      { label: "Hecken- und Strauchschnitt", range: "CHF 75.00 / Std.", basis: "Inklusive Abtransport und Entsorgung des Grünschnitts" }
    ],
    checklist: [
      "Professionelles Rasenmähen, Kantenschneiden und bedarfsgerechtes Vertikutieren",
      "Gründliches Jäten von Unkraut in Beeten, auf Rabatten, Wegen und Terrassenflächen",
      "Fachgerechter Form- und Rückschnitt von Hecken, Sträuchern und Ziergehölzen",
      "Laubentfernung im Herbst sowie gründliche Säuberung aller Gartenwege",
      "Fachgerechter Abtransport und umweltfreundliche Kompostierung aller Grünabfälle"
    ],
    faqs: [
      { q: "Was kostet eine professionelle Gartenpflege in [comuna]?", a: "Der Preis richtet sich ganz nach der Grösse Ihres Gartens und den gewünschten Arbeiten. Wir bieten sowohl faire Stundensätze ab CHF 65 als auch transparente Pauschalen nach einer kostenlosen Erstbesichtigung." },
      { q: "Entsorgen Sie den anfallenden Grünschnitt direkt aus [comuna]?", a: "Ja, selbstverständlich. Wir nehmen sämtlichen Gartenabfall, Astwerk und Grünschnitt direkt mit und entsorgen diese fachgerecht und umweltfreundlich in einer regionalen Deponie." },
      { q: "Bieten Sie auch regelmässige Abos für die Gartenpflege an?", a: "Sehr gerne sogar. Wir pflegen Ihren Garten in [comuna] wöchentlich, zweiwöchentlich oder monatlich. Beliebt ist auch unser Frühjahrs- und Herbstputz für den optimalen Saisoneinstieg." },
      { q: "Können Sie auch grössere Bäume fällen oder beschneiden?", a: "Wir führen professionelle Pflegeschnitte an Obstbäumen und Ziergehölzen durch. Für Fällungen von Grossbäumen arbeiten wir eng mit spezialisierten Baumpflegern zusammen." },
      { q: "Muss ich während der Gartenarbeiten in [comuna] anwesend sein?", a: "Nein, solange wir freien Zugang zum Garten (Gartentor) sowie eventuell zu einem Wasser- oder Stromanschluss haben, pflegen wir Ihre grüne Oase absolut selbstständig." }
    ]
  },
  "exterior-cleaning": {
    prices: [
      { label: "Terrassen- & Sitzplatzreinigung", range: "CHF 15 - 28 / m²", basis: "Je nach Material (Holz, Beton, Stein)" },
      { label: "Einfahrten & Gehwegplatten", range: "CHF 18 - 32 / m²", basis: "Inklusive Fugenreinigung und Unkrautbeseitigung" },
      { label: "Schonende Fassadenreinigung", range: "CHF 25 - 45 / m²", basis: "Ohne Hochdruck, porentief gegen Algen & Pilze" },
      { label: "Mindestauftragswert", range: "CHF 350.00", basis: "Inkl. Anfahrt und Gerätemiete" }
    ],
    checklist: [
      "Schonende Hochdruckreinigung von Steinplatten, Pflastersteinen, Beton und Holzterrassen",
      "Tiefenwirksame Moos-, Algen-, Flechten- und Unkrautentfernung aus allen Ritzen und Fugen",
      "Reinigung von Hofeinfahrten, Garagenvorplätzen, Gartenmauern und Treppenaufgängen",
      "Abwaschen von Aussengeländern, Sichtschutzwänden und wetterfesten Abdeckungen",
      "Optional: Langzeitschutz durch hochwertige, wasserabweisende Imprägnierung der Flächen"
    ],
    faqs: [
      { q: "Warum sollte ich Gehwege und Terrassen in [comuna] professionell reinigen lassen?", a: "Moos und Algen machen Oberflächen bei Nässe extrem rutschig und gefährlich. Zudem dringen Pflanzenwurzeln in Fugen ein und verursachen durch Frostabplatzungen langfristig teure Schäden." },
      { q: "Wird die Steinoberfläche durch die Reinigung in [comuna] beschädigt?", a: "Nein, keineswegs. Wir regulieren den Wasserdruck unserer Profigeräte exakt passend zum Material und nutzen spezielle Rotordüsen, um Platten porentief sauber, aber absolut zerstörungsfrei zu reinigen." },
      { q: "Verwenden Sie für die Aussenreinigung in [comuna] giftige Chemikalien?", a: "Nein, wir schützen die Natur. Wir reinigen fast ausschliesslich mit reinem, erhitztem Wasserdruck. Falls Reinigungsmittel nötig sind, nutzen wir ausschliesslich biologisch abbaubare Produkte." },
      { q: "Wie lange bleibt das Reinigungsergebnis in [comuna] erhalten?", a: "In der Regel bleibt die Fläche 2 bis 3 Jahre komplett sauber. Mit unserer optionalen Langzeit-Imprägnierung per Nano-Versiegelung lässt sich dieser Zeitraum auf bis zu 5 Jahre verdoppeln." },
      { q: "Bieten Sie auch die Reinigung von Holz- und WPC-Terrassen an?", a: "Ja, für Holz- und WPC-Dielen nutzen wir spezielle rotierende Bürstenmaschinen, die den Grauschleier und Algenbelag sanft entfernen, ohne die Holzfasern zu beschädigen." }
    ]
  },
  "pest-control": {
    prices: [
      { label: "Wespenbekämpfung (Nestentfernung)", range: "CHF 220 - 320 / Pauschal", basis: "Inkl. Anfahrt, Schutzausrüstung & Garantie" },
      { label: "Ameisenbekämpfung im Haus", range: "CHF 280 - 450", basis: "Gezieltes Gelverfahren mit Langzeitwirkung" },
      { label: "Nagerbekämpfung (Mäuse / Ratten)", range: "CHF 350 - 650", basis: "Sichere Depotköderboxen inkl. Nachkontrollen" },
      { label: "Befallsanalyse vor Ort", range: "CHF 120.00", basis: "Wird bei anschliessender Beauftragung voll angerechnet" }
    ],
    checklist: [
      "Detaillierte Analyse des Schädlingsbefalls und Identifikation der Befallsquellen",
      "Aufstellen von sicheren, zugriffsgeschützten Köderboxen und Präzisionsfallen",
      "Gezielte Ausbringung von hochwirksamen, geruchlosen Wirkstoffen an Schlupfwinkeln",
      "Sorgfältiges Verschliessen von baulichen Schwachstellen und Einlaufwegen",
      "Umfassende Beratung zu Präventionsmassnahmen und Hygieneempfehlungen"
    ],
    faqs: [
      { q: "Wie diskret ist die Schädlingsbekämpfung in [comuna]?", a: "Wir garantieren absolute Diskretion. Unsere Techniker fahren in neutralen, unbeschrifteten Fahrzeugen vor und treten bei Ihnen absolut unauffällig und professionell auf." },
      { q: "Sind die verwendeten Wirkstoffe gefährlich für meine Haustiere?", a: "Nein. Wir setzen konsequent auf modernste Präparate und platzieren alle Köder ausschliesslich in robusten, mechanisch verschlossenen Sicherheitsboxen, die für Hunde, Katzen und Kinder unzugänglich sind." },
      { q: "Welche Arten von Schädlingen bekämpfen Sie in [comuna]?", a: "Wir bekämpfen Ameisen, Wespen, Hornissen, Mäuse, Ratten, Bettwanzen, Schaben, Silberfische, Motten sowie Holz- und Vorratsschädlinge aller Art." },
      { q: "Geben Sie eine Erfolgsgarantie auf Ihre Einsätze?", a: "Ja, für viele Behandlungen (wie Wespen oder Ameisen) bieten wir eine Wirksamkeitsgarantie: Sollte der Befall nach der vereinbarten Behandlung nicht getilgt sein, führen wir die Nachbehandlung kostenlos durch." },
      { q: "Wie kann ich einem Ameisen- oder Mäusebefall in [comuna] vorbeugen?", a: "Halten Sie Lebensmittel stets luftdicht verschlossen, entsorgen Sie organischen Müll täglich und dichten Sie kleine Mauerrisse, Kabelschächte und Fugen im Aussenbereich gründlich ab." }
    ]
  },
  "waste-management": {
    prices: [
      { label: "Kleinräumung / Sperrmüll-Abholung", range: "CHF 120 - 250 / Kubikmeter", basis: "Inklusive Deponiegebühren und Arbeitszeit" },
      { label: "Wohnungsräumung (Besenrein)", range: "CHF 850 - 2400", basis: "Je nach Möblierung und Zimmeranzahl" },
      { label: "Keller- oder Estrichräumung", range: "CHF 450 - 950", basis: "Festpreisgarantie nach Besichtigung" },
      { label: "Sondermüllentsorgung", range: "Auf Anfrage", basis: "Fachgerechte Vernichtung nach gesetzlichen Richtlinien" }
    ],
    checklist: [
      "Komplette Räumung und Demontage von Möbeln, Teppichen und Einbauten",
      "Fachgerechte Sortierung aller Materialien (Holz, Metall, Elektronik, Bauschutt, Textilien)",
      "Sorgfältiges Verpacken und Abtransport des gesamten Räumungsgutes im LKW",
      "Sichere Zuführung zu zertifizierten Recyclinghöfen nach Schweizer Umweltrecht",
      "Abschliessendes, gründliches Fegen und Staubsaugen aller Räume (besenreine Übergabe)"
    ],
    faqs: [
      { q: "Was kostet eine komplette Wohnungsräumung in [comuna]?", a: "Die Kosten hängen massgeblich von der Menge des Sperrmülls, der Zugänglichkeit der Räume (z. B. Stockwerk, Lift) und dem Anteil an Sonderabfällen ab. Wir erstellen Ihnen nach einer kostenlosen Besichtigung ein verbindliches Festpreisangebot." },
      { q: "Werden die geräumten Gegenstände aus [comuna] umweltgerecht recycelt?", a: "Absolut. Umweltschutz schreiben wir gross. Wir sortieren alle Altlasten penibel nach Wertstoffen, Holz, Metallen und Elektronik und führen sie den offiziellen Schweizer Recycling-Kreisläufen zu." },
      { q: "Führen Sie Räumungen in [comuna] auch bei Messi-Wohnungen durch?", a: "Ja, wir sind auf schwierige Härtefälle spezialisiert. Unser Team führt auch hochgradig überfüllte Messi-Wohnungen diskret, professionell, strukturiert und absolut empathisch einer besenreinen Übergabe zu." },
      { q: "Was bedeutet die Zusage 'besenreine Übergabe'?", a: "Das bedeutet, dass wir alle Räume komplett leeren, alle Spinnweben entfernen und sämtliche Böden gründlich wischen oder staubsaugen. Die Räume sind bereit für die Übergabe an den Vermieter." },
      { q: "Muss ich die Räumungsgüter vorab selbst sortieren?", a: "Nein, Sie müssen überhaupt nichts tun. Sie zeigen uns einfach, welche Gegenstände entsorgt werden sollen und welche Sie behalten möchten – den gesamten Rest erledigt unser eingespieltes Team." }
    ]
  },
  "car-detailing": {
    prices: [
      { label: "Innenreinigung Standard", range: "CHF 190 - 290", basis: "Aussaugen, Cockpitpflege, Scheiben innen" },
      { label: "Innenreinigung Premium (Deep Clean)", range: "CHF 350 - 490", basis: "Inkl. Polstershampoo, Lederpflege & Ozonbehandlung" },
      { label: "Aussenaufbereitung & Politur", range: "CHF 250 - 450", basis: "Handwäsche, Knetbehandlung, Glanzpolitur & Wachs" },
      { label: "Komplettaufbereitung (Showroom-Effekt)", range: "CHF 550 - 850", basis: "Das Rundum-sorglos-Paket für Ihr Fahrzeug" }
    ],
    checklist: [
      "Gründliches Aussaugen des kompletten Innenraums inklusive Kofferraum und Lüftungsdüsen",
      "Porentiefes Shampoonieren und Nasssaugen (Sprühextraktion) aller Textilpolster und Teppiche",
      "Sorgfältige Reinigung, Pflege und Imprägnierung empfindlicher Ledersitze und -flächen",
      "Intensive Kunststoffpflege im Cockpit inklusive UV-Schutz und Streifenfrei-Garantie auf allen Scheiben",
      "Handwäsche der Karosserie inklusive Felgen-Tiefenreinigung und professioneller Lackpolitur"
    ],
    faqs: [
      { q: "Lohnt sich eine professionelle Autopflege vor dem Leasing-Rücklauf in [comuna]?", a: "Ja, definitiv! Durch eine professionelle Aufbereitung können Sie Abzüge bei der Leasingrückgabe oft um Hunderte oder Tausende Franken reduzieren, da typische Gebrauchsspuren, Flecken und Gerüche komplett eliminiert werden." },
      { q: "Können Sie auch hartnäckige Gerüche wie Hundegeruch oder Rauch entfernen?", a: "Ja, mit unserer professionellen Ozonbehandlung neutralisieren wir selbst extrem festsitzende Gerüche (Nikotin, Haustiere, Schimmel) porentief und dauerhaft im gesamten Fahrzeuginnenraum." },
      { q: "Bieten Sie den Fahrzeugaufbereitungsservice in [comuna] auch mobil vor Ort an?", a: "Unsere Standard-Innenreinigungen können wir mobil bei Ihnen vor Ort durchführen, sofern Strom und ein schattiger Stellplatz vorhanden sind. Für aufwendige Lackpolituren und Versiegelungen nutzen wir unsere vollausgestattete Werkstatt." },
      { q: "Wie lange dauert eine komplette Fahrzeugaufbereitung?", a: "Eine einfache Innenreinigung dauert ca. 2 bis 4 Stunden. Für eine vollständige Komplettaufbereitung inklusive Aussenpolitur und Polstershampoonierung benötigen wir das Auto in der Regel für einen ganzen Arbeitstag." },
      { q: "Verwenden Sie biologisch verträgliche Pflegeprodukte?", a: "Ja, wir nutzen ausschliesslich erstklassige, umweltschonende Markenprodukte, die biologisch hervorragend abbaubar sind und den Innenraum nicht mit unangenehmen chemischen Dämpfen belasten." }
    ]
  },
  "gutter-cleaning": {
    prices: [
      { label: "Einfamilienhaus (bis 15m Rinne)", range: "CHF 180 - 280 / Pauschal", basis: "Inklusive Anfahrt und Standard-Laubentsorgung" },
      { label: "Grosses Haus / Villa (bis 30m Rinne)", range: "CHF 290 - 450 / Pauschal", basis: "Inklusive Reinigung aller Fallrohre" },
      { label: "Gewerbeobjekte / Hallen", range: "Auf Anfrage", basis: "Individuelle m-Preise nach Besichtigung" },
      { label: "Dachrinnen-Schutzgitter Montage", range: "Ab CHF 15 / Meter", basis: "Schützt dauerhaft vor neuem Laubbefall" }
    ],
    checklist: [
      "Manuelle Entfernung von Blättern, Moos, Nadeln, Schlamm und Unkraut aus der Dachrinne",
      "Gründliches Durchspülen aller vertikalen Fallrohre zur Sicherung des freien Wasserabflusses",
      "Sorgfältige Überprüfung der gesamten Entwässerungsanlage auf Risse, Lecks und Gefälle",
      "Fachgerechte Entsorgung des entnommenen Laub- und Schlammabfalls direkt vor Ort",
      "Dokumentation von allfälligen Schäden an Rinne oder Dach zur Information des Eigentümers"
    ],
    faqs: [
      { q: "Wie oft im Jahr sollte die Dachrinne in [comuna] gereinigt werden?", a: "Wir empfehlen eine Reinigung mindestens einmal jährlich, idealerweise im Spätherbst nach dem vollständigen Laubfall, um Verstopfungen vor dem Einsetzen von Frost und Schnee vorzubeugen." },
      { q: "Welche schweren Schäden können durch eine verstopfte Dachrinne entstehen?", a: "Wenn das Wasser nicht abfliesst, läuft die Rinne über. Das Wasser dringt direkt in die Fassade ein, was zu massiven Schimmelpilzen, feuchten Wänden, Putzabplatzungen und im schlimmsten Fall zu teuren Fundamentschäden führt." },
      { q: "Müssen Sie für die Reinigung in [comuna] ein teures Gerüst aufbauen?", a: "In 95% der Fälle ist kein Gerüst erforderlich. Wir arbeiten äusserst effizient mit speziellen, sicheren Leitern, Teleskop-Absaugsystemen oder professioneller Seilsicherung, was für Sie erhebliche Kosten spart." },
      { q: "Sind Ihre Mitarbeiter für Arbeiten in grosser Höhe voll abgesichert?", a: "Selbstverständlich. Unsere Mitarbeiter sind streng nach den Richtlinien der SUVA geschult, tragen zertifizierte PSAgA (Persönliche Schutzausrüstung gegen Absturz) und sind umfassend unfallversichert." },
      { q: "Führen Sie im Zuge der Reinigung in [comuna] auch kleinere Reparaturen durch?", a: "Ja, kleinere Undichtigkeiten, lose Halterungen oder undichte Verbindungsstücke können wir direkt vor Ort im Zuge der Reinigung schnell und unkompliziert für Sie abdichten oder reparieren." }
    ]
  },
  "upholstery-cleaning": {
    prices: [
      { label: "Sessel / Bürostuhl", range: "CHF 70 - 110", basis: "Porentiefe Fleckenentfernung & Frischeduft" },
      { label: "2er Sofa / Couch", range: "CHF 160 - 240", basis: "Inklusive professioneller Tiefen-Nassreinigung" },
      { label: "3er-4er Sofa (L-Form)", range: "CHF 250 - 390", basis: "Inklusive professioneller Tiefen-Nassreinigung" },
      { label: "Teppichreinigung (Spannteppich)", range: "CHF 12 - 25 / m²", basis: "Je nach Florhöhe und Verschmutzung" }
    ],
    checklist: [
      "Gründliches Absaugen des Polsters zur Entfernung von losem Oberflächenschmutz und Tierhaaren",
      "Gezielte Vorbehandlung und Fleckenentfernung (Kaffee, Rotwein, Fett, Kugelschreiber)",
      "Porentiefe Nassabsaugung im Sprühextraktionsverfahren mit warmem Wasser und Spezialreinigern",
      "Hygienische Desinfektion zur vollständigen Beseitigung von Milben, Bakterien und Allergenen",
      "Optionale Faserschutz-Imprägnierung zur Vorbeugung gegen schnelle Neuverschmutzung"
    ],
    faqs: [
      { q: "Wie läuft die professionelle Polsterreinigung in [comuna] genau ab?", a: "Wir arbeiten direkt bei Ihnen vor Ort mit dem bewährten Sprühextraktionsverfahren: Ein faserschonender Reiniger wird tief in die Polster gesprüht und im selben Schritt mitsamt dem gelösten Schmutz kraftvoll abgesaugt." },
      { q: "Wie lange müssen Sofa und Polster nach der Reinigung trocknen?", a: "Dank unserer extrem leistungsstarken Vakuumsauger entziehen wir den Polstern ca. 90% der Feuchtigkeit. Die Resttrocknungszeit beträgt je nach Raumtemperatur und Belüftung nur 6 bis 12 Stunden." },
      { q: "Können Sie auch hartnäckige Flecken wie Rotwein oder Urin rückstandslos entfernen?", a: "Ja, durch spezielle Fleckenlöser können wir die allermeisten organischen Flecken (Rotwein, Kaffee, Blut, Urin, Schokolade) komplett entfernen. Je frischer der Fleck ist, desto höher ist die Erfolgsquote." },
      { q: "Ist das Reinigungsverfahren sicher für Asthmatiker und Haustiere?", a: "Absolut. Wir verwenden pH-neutrale, geruchlose und hypoallergene Reinigungsmittel, die für Allergiker, Asthmatiker, Babys und Haustiere vollkommen unbedenklich sind und Milben hocheffektiv abtöten." },
      { q: "Kommen Sie für die Reinigung direkt zu mir nach Hause in [comuna]?", a: "Ja, wir führen alle Polster-, Matratzen- und Teppichreinigungen bequem und sauber direkt bei Ihnen vor Ort durch. Sie müssen keine schweren Möbel transportieren." }
    ]
  },
  "window-cleaning": {
    prices: [
      { label: "Standard 3.5 Zimmer Wohnung", range: "CHF 190 - 290", basis: "Pauschalpreis inkl. Rahmenreinigung" },
      { label: "Standard 4.5 Zimmer Wohnung", range: "CHF 250 - 360", basis: "Pauschalpreis inkl. Rahmenreinigung" },
      { label: "Grosses Einfamilienhaus / Villa", range: "CHF 380 - 580", basis: "Inklusive aller Glasflächen und Simse" },
      { label: "Lamellenstoren & Rollläden (Zusatz)", range: "CHF 8 - 15 / Stück", basis: "Gründliche Nassreinigung von Hand" }
    ],
    checklist: [
      "Streifenfreie Glasreinigung aller Fensterflächen (innen und aussen) von Meisterhand",
      "Gründliche Nassreinigung aller Fensterrahmen, Fensterbänke, Profile und Falzen",
      "Schonende Reinigung und Pflege der empfindlichen Gummidichtungen",
      "Entfernung von hartnäckigem Schmutz wie Pollen, Insektenresten, Farb- oder Kleberesten",
      "Optional: Professionelle Reinigung von Lamellenstoren, Rollläden und Fliegengittern"
    ],
    faqs: [
      { q: "Sind die Fensterrahmen bei der Reinigung in [comuna] im Preis inbegriffen?", a: "Ja, bei Kraken PFM gehört das gründliche Abwaschen aller Fensterrahmen, Simse und Profile standardmässig zu jeder professionellen Fensterreinigung dazu – ohne versteckte Kosten." },
      { q: "Muss ich für die Fensterreinigung in [comuna] eine Leiter oder Geräte bereitstellen?", a: "Nein, unser Fensterputzer-Team bringt die komplette Ausrüstung inklusive professioneller Abzieher, Mikrofasertücher, ausziehbarer Teleskopstangen und biologischer Glasreiniger selbst mit." },
      { q: "Reinigen Sie auch schwer zugängliche Dachfenster oder Wintergärten?", a: "Ja, wir sind auf anspruchsvolle Verglasungen spezialisiert. Dank modernster Klettersicherungen und ultraleichter Carbon-Teleskopstangen reinigen wir auch hohe Dachfenster und Wintergärten absolut sicher." },
      { q: "Was passiert, wenn es am vereinbarten Reinigungstag in [comuna] regnet?", a: "Bei leichtem Nieselregen reinigen wir planmässig. Sollte es jedoch stürmen, stark schneien oder frieren, verschieben wir den Termin aus Sicherheitsgründen und für ein perfektes Ergebnis kostenfrei auf einen zeitnahen Alternativtermin." },
      { q: "Bieten Sie auch die Reinigung von Lamellenstoren und Rollläden an?", a: "Sehr gerne. Lamellenstoren fangen extrem viel Staub und Schmutz auf. Wir reinigen diese auf Wunsch sehr sorgfältig Lamelle für Lamelle von Hand gegen einen geringen, fairen Aufpreis." }
    ]
  },
  "mudanza-cajas": {
    prices: [
      { label: "Teil-Packservice (z.B. nur Küche)", range: "CHF 150 - 280 / Pauschal", basis: "Inklusive Packpapier und Luftpolsterfolie" },
      { label: "Voll-Packservice (2.5 - 3.5 Zimmer)", range: "CHF 450 - 750", basis: "Komplett stressfrei, inkl. aller Verpackungsmaterialien" },
      { label: "Voll-Packservice (4.5+ Zimmer Haus)", range: "CHF 850 - 1400", basis: "Inklusive systematischer Beschriftung & Inventar" },
      { label: "Umzugskartons Miete / Kauf", range: "CHF 3.50 - 5.00 / Stück", basis: "Lieferung direkt zu Ihnen nach Hause" }
    ],
    checklist: [
      "Bruchsicheres Einpacken von hochempfindlichem Gut (Porzellan, Gläser, Kunstwerke)",
      "Systematische, raumspezifische Beschriftung aller Kartons für ein schnelles Wiederfinden",
      "Sicheres Verpacken von Kleidern in speziellen, hängenden Kleiderboxen",
      "Erstellung einer detaillierten Packliste / Inventarliste zur lückenlosen Kontrolle",
      "Optional: Sorgfältiges und ordentliches Auspacken und Einsortieren aller Kartons am Zielort"
    ],
    faqs: [
      { q: "Welche Vorteile hat ein professioneller Packservice in [comuna]?", a: "Sie sparen enorm viel Zeit und Stress. Zudem packen unsere Zügelprofis Ihren gesamten Hausrat mit jahrzehntelanger Erfahrung absolut bruchsicher ein. Sie müssen sich um nichts kümmern." },
      { q: "Sind meine Gegenstände beim Packservice in [comuna] versichert?", a: "Ja. Wenn unser Team das Einpacken übernimmt, haftet unsere Transport- und Betriebshaftpflichtversicherung bei allfälligen Beschädigungen oder Brüchen vollumfänglich mit einer Deckung bis zu CHF 5 Millionen." },
      { q: "Bringen Ihre Packer das gesamte Verpackungsmaterial nach [comuna] mit?", a: "Ja, wir bringen alles mit: stabile Umzugskartons in verschiedenen Grössen, Seidenpapier für Geschirr, reissfeste Luftpolsterfolie, Matratzenschutzhüllen und Klebeband." },
      { q: "Kann ich auch nur empfindliche Gegenstände einpacken lassen?", a: "Natürlich. Viele Kunden buchen uns beispielsweise nur für das Verpacken der kompletten Küche (Geschirr, Gläser) und des Wohnzimmers (Bilder, Elektronik, Vasen), während sie Kleidung und Bücher selbst verpacken." },
      { q: "Wie lange dauert das Einpacken einer gesamten Wohnung in [comuna]?", a: "Unser eingespieltes Team arbeitet unheimlich rasch. Eine standardmässige 3-Zimmer-Wohnung verpacken wir in der Regel komplett in nur 3 bis 5 Stunden am Tag vor dem eigentlichen Umzug." }
    ]
  },
  "pulido-suelos": {
    prices: [
      { label: "Naturstein / Marmor schleifen & polieren", range: "CHF 28 - 48 / m²", basis: "Beseitigt Kratzer und bringt Hochglanz zurück" },
      { label: "Parkett schleifen & versiegeln", range: "CHF 35 - 55 / m²", basis: "Inklusive hochwertigem Lack oder Naturöl" },
      { label: "Linoleum / PVC Grundreinigung & Einpflege", range: "CHF 15 - 28 / m²", basis: "Schafft eine neue, schmutzabweisende Nutzschicht" },
      { label: "Mindestauftragswert", range: "CHF 450.00", basis: "Inkl. Spezialmaschinen-Anfahrt und Reinigungsmaterial" }
    ],
    checklist: [
      "Gründliche chemische Tiefenreinigung zur rückstandslosen Entfernung alter Pflegeschichten",
      "Feinschleifen der Oberfläche zur Beseitigung von oberflächlichen Kratzern und Laufspuren",
      "Professionelles Polieren mit modernsten Einscheibenmaschinen für maximalen, tiefen Glanz",
      "Auftragen einer langanhaltenden, schmutz- und wasserabweisenden Schutzversiegelung",
      "Detaillierte Beratung zur richtigen Unterhaltspflege und Übergabe einer Pflegeanleitung"
    ],
    faqs: [
      { q: "Welche Arten von Bodenbelägen können in [comuna] poliert und saniert werden?", a: "Wir sanieren, polieren und versiegeln Parkett, Marmor, Granit, Terrazzo, PVC, Linoleum, Kork, Kautschuk sowie geschliffene Beton- und Estrichtböden fachgerecht." },
      { q: "Wie lange hält der strahlende Glanz nach dem Polieren in [comuna] an?", a: "Je nach Beanspruchung und Pflege des Bodens bleibt das glänzende Ergebnis zwischen 2 und 5 Jahren voll erhalten. Eine regelmässige, milde Unterhaltspflege verlängert diesen Schutz massiv." },
      { q: "Wird der Boden durch die Politur in [comuna] rutschig?", a: "Nein, überhaupt nicht. Wir verwenden ausschliesslich professionelle, zertifizierte Wachse, Öle und Polymerversiegelungen, die eine rutschhemmende Wirkung besitzen und maximale Trittsicherheit garantieren." },
      { q: "Müssen alle Möbel vor der Bodensanierung in [comuna] komplett aus den Räumen geräumt werden?", a: "Ja, für ein perfektes, nahtloses Ergebnis ohne Absätze müssen die zu behandelnden Bodenflächen komplett frei von Möbeln sein. Gerne unterstützen wir Sie im Vorfeld beim Ausräumen." },
      { q: "Wie lange darf der frisch polierte Boden nicht betreten werden?", a: "Nach einer einfachen Politur ist der Boden meist nach 4 bis 6 Stunden wieder vorsichtig begehbar. Bei Parkettschleifarbeiten mit anschliessender Lackversiegelung sollte der Boden 24 Stunden ruhen." }
    ]
  },
  "bar-restaurant-cleaning": {
    prices: [
      { label: "Regelmässige Unterhaltsreinigung (täglich)", range: "CHF 55 - 68 / Std.", basis: "Spezielle Tarife für Gastro-Dauerkunden" },
      { label: "Gastro-Küche Tiefenreinigung (HACCP)", range: "CHF 75 - 95 / Std.", basis: "Inklusive Hochdruck-Dampfgeräten und Entfettern" },
      { label: "Gästebereich & Sanitäranlagen (Abo)", range: "CHF 58 - 72 / Std.", basis: "Sorgt für ein makelloses, einladendes Ambiente" },
      { label: "Grossküchengeräte (Einzelreinigung)", range: "Auf Anfrage", basis: "Tiefenreinigung von Öfen, Grills & Fritteusen" }
    ],
    checklist: [
      "HACCP-konforme Tiefenreinigung und Desinfektion aller Arbeitsflächen, Spülbecken und Fliesen",
      "Gründliches Lösen und Entfernen von Fettfilmen auf Edelstahlmöbeln, Abzugshauben und Filtern",
      "Hygienische Reinigung des gesamten Gästebereichs inklusive Tischen, Stühlen und Tresen",
      "Keimfreie Reinigung und Desinfektion aller sanitären Anlagen für Ihre Gäste und Mitarbeiter",
      "Nassreinigung aller Küchen- und Gastraum-Böden mit speziellen fettlösenden Mitteln"
    ],
    faqs: [
      { q: "Reinigen Sie mein Restaurant oder meine Bar in [comuna] auch nachts?", a: "Ja, absolut. Wir passen uns vollkommen Ihren Betriebszeiten an und reinigen flexibel in den späten Nachtstunden nach Betriebsschluss oder am frühen Morgen vor der Öffnung." },
      { q: "Entsprechen Ihre Gastroreinigungen den Schweizer Lebensmittelvorschriften?", a: "Ja, wir arbeiten streng nach den offiziellen HACCP-Richtlinien für Lebensmittelhygiene. Nach jeder Reinigung dokumentieren wir alle Arbeiten lückenlos, was Ihnen bei Kontrollen des kantonalen Labors Sicherheit bietet." },
      { q: "Werden bei der Gastroreinigung in [comuna] auch Küchengeräte von innen gereinigt?", a: "Ja, sehr gerne. Unser Team reinigt Öfen, Fritteusen, Kombidämpfer, Salamander, Kühlschränke und Spülmaschinen gründlich und fachgerecht von innen und aussen." },
      { q: "Sind Ihre Mitarbeiter für die speziellen Anforderungen in der Gastro geschult?", a: "Ja, unsere spezialisierte Gastro-Reinigungsequipe durchläuft regelmässige Schulungen bezüglich Lebensmittelhygiene, Desinfektion, HACCP-Richtlinien und dem sicheren Umgang mit Fettlösern." },
      { q: "Erstellen Sie ein kostenloses Angebot für meinen Betrieb in [comuna]?", a: "Gerne! Wir besuchen Sie direkt vor Ort im Restaurant oder der Bar, besprechen Ihre Wünsche und erstellen Ihnen innerhalb von 24 Stunden eine detaillierte, kostenlose und unverbindliche Offerte." }
    ]
  },
  "office-cleaning": {
    prices: [
      { label: "Kleines Büro (bis 100 m²)", range: "CHF 120 - 240 / Einsatz", basis: "Wöchentliche Reinigung" },
      { label: "Mittleres Büro (101 - 250 m²)", range: "CHF 220 - 450 / Einsatz", basis: "Reinigung 2-3x pro Woche" },
      { label: "Grossraumbüro (ab 250 m²)", range: "Ab CHF 400 / Einsatz", basis: "Nach individuellem Pflichtenheft" },
      { label: "Stundenbasierte Reinigung", range: "CHF 55 - 65 / Std.", basis: "Inklusive Reinigungsmaterial und Geräte" }
    ],
    checklist: [
      "Dampfwischen und Desinfektion aller Schreibtische, Monitore, Tastaturen und Telefone",
      "Gründliches Saugen und Feuchtwischen aller Hart- und Spannteppichböden im Bürobereich",
      "Hygienische Desinfektion von Kaffeeküchen, Mikrowellen, Kühlschränken und Teambereichen",
      "Porentiefe Reinigung und Keimdesinfektion aller WC-Anlagen samt Spiegeln und Armaturen",
      "Entleerung aller Mülleimer, Papierkörbe und sachgerechte Entsorgung von Recyclinggut"
    ],
    faqs: [
      { q: "Wie flexibel sind die Reinigungszeiten in [comuna]?", a: "Wir passen uns vollkommen Ihrem Betriebsalltag an. Die Reinigung kann ausserhalb der Bürozeiten, am frühen Morgen, abends oder am Wochenende stattfinden." },
      { q: "Sind Ihre Mitarbeiter in [comuna] haftpflichtversichert?", a: "Ja. All unsere Mitarbeiter sind umfassend haftpflichtversichert (bis zu CHF 5 Mio.) und durchlaufen strenge Zuverlässigkeitsprüfungen für maximale Sicherheit." },
      { q: "Stellen Sie die Verbrauchsmaterialien wie Seife und Papier bereit?", a: "Auf Wunsch übernehmen wir gerne den kompletten Einkauf und die Bewirtschaftung von Handtuchpapier, Seife, Desinfektionsmitteln und Toilettenpapier für Ihr Büro." },
      { q: "Müssen wir einen langfristigen Vertrag für die Büroreinigung abschliessen?", a: "Nein. Wir bieten flexible Verträge mit transparenten Kündigungsfristen. Sie bezahlen nur die tatsächlich erbrachten Einsätze." }
    ]
  },
  "common-area-cleaning": {
    prices: [
      { label: "Mehrfamilienhaus (bis 4 Wohnungen)", range: "CHF 150 - 280 / Monat", basis: "Wöchentliche Reinigung des Treppenhauses" },
      { label: "Mehrfamilienhaus (5 - 10 Wohnungen)", range: "CHF 250 - 480 / Monat", basis: "Wöchentliche Reinigung inkl. Keller & Waschküche" },
      { label: "Grosse Wohnanlage (ab 10 Wohnungen)", range: "Ab CHF 450 / Monat", basis: "Individuelles Leistungsverzeichnis" },
      { label: "Winterdienst & Umgebungsarbeiten (Option)", range: "Auf Anfrage", basis: "Saisonale Pauschale oder nach Aufwand" }
    ],
    checklist: [
      "Nassreinigung des gesamten Treppenhauses, der Eingangszone und aller Zwischenetagen",
      "Abstauben und Reinigen von Geländern, Handläufen, Briefkastenanlagen und Klingeltableaus",
      "Gründliches Wischen und Spinnweben-Entfernung in Waschküche, Kellergängen und Veloraum",
      "Säuberung des Aussenbereichs (Zugangswege, Müllplatz) und Leerung von Aschern/Abfalleimern",
      "Sichtkontrolle der Haustechnik, Beleuchtung und umgehende Meldung von Defekten"
    ],
    faqs: [
      { q: "In welchem Intervall wird das Treppenhaus in [comuna] gereinigt?", a: "Je nach Liegenschaftsgrösse und Frequenz empfehlen wir eine wöchentliche oder zweiwöchentliche Reinigung. Wir erstellen ein individuell abgestimmtes Pflichtenheft." },
      { q: "Übernehmen Sie auch den Winterdienst und das Rasenmähen in [comuna]?", a: "Ja, absolut. Als Full-Service-Partner übernehmen wir neben der Treppenhausreinigung auch die komplette Gartenpflege, Rasenmähen, Unkrautbeseitigung sowie den zuverlässigen Winterdienst nach Gemeindeordnung." },
      { q: "Können die Kosten direkt auf die Mieter umgelegt werden?", a: "Ja, wir erstellen transparente, detaillierte Monatsrechnungen, die sich hervorragend für die jährliche Nebenkostenabrechnung (Heiz- und Nebenkosten) der Verwaltung eignen." },
      { q: "Was passiert bei ausserordentlichen Verschmutzungen im Treppenhaus?", a: "Dank unserer lokalen Präsenz können wir bei Notfällen oder akuten Verschmutzungen (z.B. nach Zügeltagen) sehr rasch reagieren und eine Sonderreinigung durchführen." }
    ]
  },
  "industrial-maintenance": {
    prices: [
      { label: "Produktions- & Lagerhallen (Bodenreinigung)", range: "CHF 4.50 - 9.50 / m²", basis: "Maschinelle Nassreinigung (Einscheiben- / Aufsitzmaschine)" },
      { label: "Maschinen- & Anlagenreinigung", range: "CHF 75 - 95 / Std.", basis: "Spezialierte Reinigung mit biologischen Entfettern" },
      { label: "Industrielle Grundreinigung (Sonderauftrag)", range: "Ab CHF 850.00", basis: "Pauschalpreis nach eingehender Vorort-Besichtigung" }
    ],
    checklist: [
      "Gründliche maschinelle Nassreinigung und Entfettung aller Hallenböden und Fahrwege",
      "Reinigung von Maschinenoberflächen, Schutzgittern, Gehäusen und Bedienpulten",
      "Abstauben und Absaugen von Lüftungskanälen, Kabeltrassen und Tragwerkkonstruktionen in der Höhe",
      "Hygienische Reinigung und Desinfektion von Pausenräumen, Umkleiden und Sanitärbereichen",
      "Fachgerechte Entsorgung von Industrieabfällen und Reinigungsemulsionen nach HSE-Auflagen"
    ],
    faqs: [
      { q: "Können die Industriereinigungen in [comuna] im laufenden Betrieb stattfinden?", a: "Ja, wir planen unsere Einsätze so, dass Ihre Produktionsabläufe so wenig wie möglich gestört werden, auch während Schichtwechseln oder nachts." },
      { q: "Sind Ihre Mitarbeiter für die speziellen Industrie-Herausforderungen zertifiziert?", a: "Selbstverständlich. Unsere Spezialisten sind für Hubarbeitsbühnen (SUVA-zertifiziert), Höhenarbeiten und den fachgerechten Umgang mit Industriereinigungsgeräten geschult." },
      { q: "Welche Sicherheitsmassnahmen (HSE) treffen Sie bei der Reinigung?", a: "Wir arbeiten streng nach Schweizer Arbeitssicherheits- und Umweltschutzgesetzen. Das Tragen von persönlicher Schutzausrüstung (PSA) und das Absperren von Gefahrenbereichen sind Standard." },
      { q: "Reinigen Sie auch anspruchsvolle Lüftungsanlagen und Rohrleitungssysteme?", a: "Ja, wir nutzen Spezialgeräte zur Innen- und Aussenreinigung von Zu- und Abluftkanälen sowie zur Reinigung von industriellen Rohrleitungssystemen." }
    ]
  },
  "retail-management": {
    prices: [
      { label: "Boutiquen & Kleingeschäfte (bis 100 m²)", range: "CHF 130 - 250 / Einsatz", basis: "Regelmässiger Unterhalt vor/nach Öffnungszeiten" },
      { label: "Supermärkte & Grosse Verkaufsflächen", range: "CHF 28 - 45 / Std.", basis: "Einsatz von modernen Scheuersaugmaschinen" },
      { label: "Schaufenster & Glasfassaden (Zusatz)", range: "CHF 85 - 180 / Einsatz", basis: "Streifenfreier Glanz für maximale Kundenanziehung" }
    ],
    checklist: [
      "Hochglanzpolieren und nassmaschinelles Reinigen aller Verkaufsflächen und Gänge",
      "Streifenfreie Reinigung von Schaufenstern, Spiegeln, Glastüren und Vitrinen",
      "Entstauben von Verkaufsregalen, Kassenzonen, Displays und Dekorationselementen",
      "Hygienische Tiefenreinigung der Kundentoiletten, Personalräume und Büros",
      "Müllentsorgung, Kartonage-Trennung und Einpflegen von schmutzabweisenden Bodenschutzfilmen"
    ],
    faqs: [
      { q: "Reinigen Sie auch Schaufenster und grosse Glasfassaden in [comuna]?", a: "Ja, die streifenfreie Reinigung von Schaufenstern, Spiegeln und grossen Glasflächen gehört zu unseren Kernkompetenzen." },
      { q: "Bieten Sie auch Support während des Tagesgeschäfts in [comuna] an?", a: "Auf Wunsch stellen wir Tageskräfte bereit, die diskret im Hintergrund für Sauberkeit sorgen und bei Bedarf (z.B. verschüttete Flüssigkeiten) sofort eingreifen." },
      { q: "Zu welchen Zeiten führen Sie die Verkaufsflächenreinigung durch?", a: "Um Ihre Kunden nicht zu stören, arbeiten wir sehr flexibel: entweder frühmorgens vor Ladenöffnung oder abends nach Ladenschluss. Auch Sonntagsreinigungen sind möglich." },
      { q: "Wie garantieren Sie einen rutschsicheren Boden nach der Nassreinigung?", a: "Wir nutzen extrem leistungsfähige Scheuersaugmaschinen, die das Schmutzwasser im selben Arbeitsschritt vollständig absaugen, sodass der Boden sofort wieder trocken und rutschsicher begehbar ist." }
    ]
  },
  "property-managers": {
    prices: [
      { label: "Gemeinschaftsräume / Treppenhäuser", range: "Ab CHF 150 / Einsatz", basis: "Regelmässige Reinigung nach SLA" },
      { label: "Wohnungsabnahme / Endreinigung", range: "Siehe Umzugsreinigung", basis: "Festpreis inkl. Abnahmegarantie" },
      { label: "Hauswartung & Kleinreparaturen", range: "Auf Anfrage", basis: "Stundenbasiert oder Pauschale" }
    ],
    checklist: [
      "Reinigung aller Allgemeinflächen, Treppenhäuser und Lifts",
      "Regelmässige Kontrolle der Haustechnik und Beleuchtung",
      "Bereitstellung und Reinigung der Abfallcontainer",
      "Umgebungsarbeiten und Wischen der Gehwege",
      "24/7 Notfall-Support für Liegenschaftsbesitzer"
    ],
    faqs: [
      { q: "Welche Dienstleistungen deckt der Liegenschaftsservice in [comuna] ab?", a: "Unser Angebot umfasst die Treppenhausreinigung, das Containermanagement, kleine Reparaturen, die Gartenpflege sowie den Winterdienst – alles aus einer Hand." },
      { q: "Wie funktioniert die Zusammenarbeit mit Immobilienverwaltern?", a: "Wir erstellen einen klaren Service-Level-Agreement (SLA). Sie erhalten einen festen Ansprechpartner, der alle Arbeiten koordiniert und monatlich rapportiert." }
    ]
  },
  "airbnb-rentals": {
    prices: [
      { label: "Studio / 1-Zimmer-Wohnung", range: "CHF 95 - 140 / Reinigung", basis: "Inkl. Wäscheservice und Endkontrolle" },
      { label: "2-Zimmer-Wohnung", range: "CHF 130 - 180 / Reinigung", basis: "Spezialkonditionen bei hoher Frequenz" },
      { label: "3+ Zimmer / Haus", range: "Ab CHF 210", basis: "Individueller Festpreis pro Turnaround" }
    ],
    checklist: [
      "Komplettes Abziehen der Betten und frisches Beziehen mit Premium-Bettwäsche",
      "Reinigung und Desinfektion aller Oberflächen, Sanitäreinrichtungen und Küche",
      "Auffüllen von Verbrauchsmaterialien (Toilettenpapier, Seife, Kaffeekapseln)",
      "Gründliche Qualitätskontrolle und Fotodokumentation nach jedem Turnaround",
      "Meldung von allfälligen Schäden oder Verlusten direkt an den Vermieter"
    ],
    faqs: [
      { q: "Wie garantieren Sie die Pünktlichkeit bei Airbnb-Wechseln in [comuna]?", a: "Wir arbeiten mit einem intelligenten Buchungskalender und einem engagierten Bereitschaftsteam. So stellen wir sicher, dass das Objekt pünktlich zum Check-in des nächsten Gastes bezugsbereit ist." },
      { q: "Ist der Wäscheservice (Bettwäsche/Handtücher) im Preis inbegriffen?", a: "Ja, wir bieten massgeschneiderte Pakete an, die entweder das Waschen Ihrer eigenen Textilien oder das Mieten von Premium-Hotelwäsche beinhalten." }
    ]
  },
  "turnover-cleaning": {
    prices: [
      { label: "Express-Zimmerreinigung", range: "CHF 85 - 120 / Turnaround", basis: "Für Hotelzimmer und Gäste-Suiten" },
      { label: "Ferienwohnung Standard", range: "CHF 120 - 180 / Turnaround", basis: "Schnelle und effiziente Zwischenreinigung" },
      { label: "Zusatzoption: Bettwäschemiete", range: "CHF 25 / Person", basis: "Inkl. Waschen und Bügeln" }
    ],
    checklist: [
      "Komplettreinigung aller Wohnräume, Küchen und Badezimmer nach Gästewechsel",
      "Staubwischen und Feuchtwischen aller Hartböden und Oberflächen",
      "Entsorgung von Müll, Leergut und Hinterlassenschaften der Gäste",
      "Desinfektion aller hochfrequentierten Kontaktpunkte (Türgriffe, Fernbedienungen)",
      "Visuelle Überprüfung auf Schäden und Vollständigkeit des Inventars"
    ],
    faqs: [
      { q: "Welchen Vorteil bietet eine professionelle Rotationsreinigung in [comuna]?", a: "Sie sparen wertvolle Zeit und sichern sich konstant hohe Bewertungen. Unser professionelles Team kennt die Anforderungen von Buchungsplattformen genau." },
      { q: "Können Sie auch sehr kurzfristige Turnarounds am selben Tag realisieren?", a: "Ja, dank unseres flexiblen Teams in [comuna] können wir Reinigungen zwischen Check-out (10:00 Uhr) und Check-in (15:00 Uhr) zuverlässig durchführen." }
    ]
  },
  "offices-corporate": {
    prices: [
      { label: "Kleinere Büros (bis 150 m²)", range: "CHF 45 - 55 / Std.", basis: "Flexibler Einsatz 1-3 Mal pro Woche" },
      { label: "Mittelgrosse Bürokomplexe", range: "CHF 42 - 48 / Std.", basis: "Täglicher Unterhalt und Sanitärreinigung" },
      { label: "Grosse Firmenstandorte", range: "Auf Anfrage", basis: "Massgeschneidertes Monats-SLA inkl. Objektleitung" }
    ],
    checklist: [
      "Abstauben und Feuchtwischen aller Arbeitsplätze, Tische und Monitore",
      "Reinigung, Entkalkung und Desinfektion aller WC-Anlagen und Waschbecken",
      "Kompakte Reinigung der Teeküche inklusive Kaffeemaschine und Geschirrspüler",
      "Regelmässiges Leeren der Papier- und Abfalleimer inklusive Mülltrennung",
      "Feuchtwischen aller harten Böden und Staubsaugen der Teppichflächen"
    ],
    faqs: [
      { q: "Wann wird die Büroreinigung in [comuna] durchgeführt?", a: "Um Ihren Betriebsablauf nicht zu stören, reinigen wir wahlweise am frühen Morgen vor Arbeitsbeginn oder am Abend nach Büroschluss." },
      { q: "Wie gewährleisten Sie den Datenschutz und die Sicherheit in unseren Büros?", a: "Alle unsere Mitarbeiter sind streng auf das Schweizer Datenschutzgesetz verpflichtet und unterschreiben eine Geheimhaltungsvereinbarung. Wir führen regelmässige Sicherheitschecks durch." }
    ]
  },
  "retail-showrooms": {
    prices: [
      { label: "Showrooms & Ausstellungsflächen", range: "CHF 140 - 260 / Einsatz", basis: "Präzise Reinigung für makellosen Glanz" },
      { label: "Ladenflächen im Detailhandel", range: "CHF 44 - 52 / Std.", basis: "Regelmässige Pflege vor/nach den Öffnungszeiten" },
      { label: "Schaufensterreinigung (einzeln)", range: "Ab CHF 80", basis: "Streifenfreie Reinigung für beste Durchsicht" }
    ],
    checklist: [
      "Feucht- und Trockenreinigung aller Verkaufsflächen und Präsentationsständer",
      "Streifenfreie Politur aller Glasflächen, Vitrinen und Eingangstüren",
      "Hygienische Desinfektion von Kassenzonen, Theken und Touchscreens",
      "Reinigung der Personal- und Sozialräume sowie der Kunden-WCs",
      "Fachgerechte Karton- und Abfallentsorgung während oder nach den Ladenöffnungszeiten"
    ],
    faqs: [
      { q: "Reinigen Sie Showrooms und Geschäfte auch am Wochenende in [comuna]?", a: "Ja, wir bieten unseren Service auch samstags nach Ladenschluss oder sonntags an, damit Ihr Showroom pünktlich zur neuen Woche glänzt." },
      { q: "Wie entfernen Sie hartnäckige Begehspuren auf glänzenden Showroom-Böden?", a: "Wir nutzen spezielle Einscheiben- und Poliermaschinen mit materialschonenden Reinigungsmitteln, die selbst hartnäckige Absatzstriche rückstandslos entfernen." }
    ]
  },
  "gastronomy-restaurants": {
    prices: [
      { label: "Speisesaal & Barbereich", range: "CHF 45 - 55 / Std.", basis: "Tägliche Reinigung nach Betriebsschluss" },
      { label: "Küchenbereich (Oberflächenreinigung)", range: "CHF 48 - 58 / Std.", basis: "Hygienische Reinigung gemäss HACCP-Standards" },
      { label: "Komplettes Restaurant-SLA", range: "Auf Anfrage", basis: "Umfassender Rundum-Service inklusive WCs" }
    ],
    checklist: [
      "Nasswischen und Desinfizieren aller Böden im Speise- und Küchenbereich",
      "Hygienische Desinfektion aller Gästetische, Menükartenhalter und Oberflächen",
      "Gründliche Reinigung und Entkalkung der Sanitäranlagen für Gäste und Personal",
      "Oberflächenreinigung der Küchengeräte, Spülbecken und Arbeitsplatten",
      "Fachgerechte Müllentsorgung unter Einhaltung strenger Hygieneauflagen"
    ],
    faqs: [
      { q: "Sind Ihre Gastro-Reinigungen in [comuna] HACCP-konform?", a: "Ja, absolut. Unser gesamtes Personal ist in den gesetzlichen Hygienevorschriften geschult, und wir nutzen ausschliesslich zertifizierte, HACCP-konforme Reinigungsmittel." },
      { q: "Können Sie die Reinigung nachts oder sehr früh am Morgen durchführen?", a: "Selbstverständlich. Wir passen uns vollkommen Ihren Öffnungszeiten an und reinigen diskret nach Betriebsschluss in der Nacht oder vor der Küchenöffnung am Morgen." }
    ]
  },
  "kitchen-deep-cleaning": {
    prices: [
      { label: "Gastro-Küche Kompakt (bis 40 m²)", range: "CHF 850 - 1450", basis: "Tiefenreinigung aller Geräte und Oberflächen" },
      { label: "Grossküche / Kantine", range: "Ab CHF 1800", basis: "Maschinelle Entfettung und Desinfektion" },
      { label: "Dunstabzugshaube & Filterreinigung", range: "CHF 320 - 580", basis: "Entfernung von Fettablagerungen zur Brandschutzprävention" }
    ],
    checklist: [
      "Porentiefe Entfettung aller Küchengeräte, Öfen, Grills und Fritteusen",
      "Maschinelle Reinigung und Desinfektion aller Fliesenwände, Decken und Böden",
      "Ausbau, Reinigung und Entfettung der Dunstabzugsfilter und Lüftungshauben",
      "Tiefenreinigung der Abflussrinnen, Bodenabläufe und Fettabscheider",
      "Lückenlose Dokumentation und Ausstellen eines HACCP-Reinigungszertifikats"
    ],
    faqs: [
      { q: "Wie oft ist eine professionelle Küchen-Tiefenreinigung in [comuna] gesetzlich vorgeschrieben?", a: "Gemäss Lebensmittelgesetz müssen Grossküchen mindestens einmal jährlich einer dokumentierten Tiefenreinigung unterzogen werden, um Brandschutz und Hygiene zu sichern." },
      { q: "Müssen wir die Küche für die Tiefenreinigung komplett schliessen?", a: "Wir führen diese Arbeiten üblicherweise an Ihren Ruhetagen, während der Betriebsferien oder nachts durch, sodass Ihr laufender Betrieb nicht beeinträchtigt wird." }
    ]
  },
  "industry-logistics": {
    prices: [
      { label: "Lagerhallen & Logistikflächen", range: "CHF 0.45 - 1.20 / m²", basis: "Nassreinigung mit Scheuersaugmaschinen" },
      { label: "Industrie-Maschinenreinigung", range: "CHF 65 - 85 / Std.", basis: "Spezialreinigung durch geschultes Fachpersonal" },
      { label: "Werkhöfe & Aussenbereiche", range: "Auf Anfrage", basis: "Wischen und Hochdruckreinigung" }
    ],
    checklist: [
      "Maschinelle Nassreinigung grosser Bodenflächen mit Aufsitz-Scheuersaugmaschinen",
      "Entfernung von hartnäckigen Ölrückständen, Reifenabrieb und Schmierstoffen",
      "Reinigung von Industrie-Lagerregalen, Ladetoren und Rampen",
      "Abstauben und Reinigen von Lüftungsrohren, Kabeltrassen und Trägern in grosser Höhe",
      "Einhaltung strengster HSE-Richtlinien und Tragen von persönlicher Schutzausrüstung"
    ],
    faqs: [
      { q: "Können Sie die Industriereinigung in [comuna] im laufenden Betrieb durchführen?", a: "Ja, wir planen unsere Einsätze flexibel rund um Ihre Schichten, auch am Wochenende oder nachts, um Stillstandszeiten Ihrer Maschinen zu minimieren." },
      { q: "Besitzt Ihr Team die nötigen Lizenzen für Höhenarbeiten (Scherenbühnen etc.)?", a: "Ja, unsere Mitarbeiter sind SUVA-zertifiziert für das Bedienen von Hubarbeitsbühnen und für Arbeiten in grosser Höhe speziell geschult." }
    ]
  }
};
