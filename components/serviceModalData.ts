export interface ModalSectionItem {
  text: Record<string, string>; // language code -> text
  isComplement?: boolean;
}

export interface ModalSection {
  title: Record<string, string>;
  items: ModalSectionItem[];
}

export interface ServiceModalInfo {
  id: string;
  title: Record<string, string>;
  subTitle: string; // e.g. Umzugsreinigung
  badge?: Record<string, string>;
  positioning: Record<string, string>;
  guaranteeNote?: Record<string, string>;
  sections: ModalSection[];
  exclusions: Record<string, string>[];
}

export interface MatrixRow {
  dimension: Record<string, string>;
  eot: Record<string, string>;
  deep: Record<string, string>;
  recurrent: Record<string, string>;
  moving: Record<string, string>;
}

export interface ExtraDetailInfo {
  id: string;
  title: Record<string, string>;
  subTitle: Record<string, string>;
  priceText: string;
  durationText: string;
  bullets: Record<string, string>[];
  limit: Record<string, string>;
}

export const SERVICE_MODAL_DATA: Record<string, ServiceModalInfo> = {
  'end-of-tenancy': {
    id: 'end-of-tenancy',
    title: {
      es: 'Limpieza de Fin de Contrato',
      en: 'End of Tenancy Cleaning',
      de: 'Umzugsreinigung mit Abnahmegarantie',
      fr: 'Nettoyage de Fin de Bail',
      it: 'Pulizia di Fine Locazione',
      pt: 'Limpeza de Fim de Contrato'
    },
    subTitle: 'Umzugsreinigung',
    badge: {
      es: '✓ Garantía de Aceptación 100%',
      en: '✓ 100% Acceptance Guarantee',
      de: '✓ 100% Abnahmegarantie',
      fr: '✓ Garantie d\'Acceptation 100%',
      it: '✓ Garanzia di Consegna 100%',
      pt: '✓ Garantia de Aceitação 100%'
    },
    positioning: {
      es: 'Para viviendas completamente vacías que deben pasar la entrega ante la administración. Con garantía de aceptación.',
      en: 'For completely empty properties that must pass handover to property management. With handover guarantee.',
      de: 'Für komplett leere Wohnungen, die der Verwaltung übergeben werden müssen. Mit voller Abnahmegarantie.',
      fr: 'Pour logements entièrement vides devant être remis à la gérance. Avec garantie d\'acceptation.',
      it: 'Per immobili completamente vuoti da consegnare all\'amministrazione. Con garanzia di consegna.',
      pt: 'Para habitações totalmente vazias que devam ser entregues à gestão. Com garantia de aceitação.'
    },
    guaranteeNote: {
      es: 'Garantía de entrega: si la administración no acepta la entrega, volvemos a limpiar sin coste dentro de las 48 horas siguientes al acta.',
      en: 'Handover Guarantee: If property management raises objections, we re-clean free of charge within 48 hours.',
      de: 'Abnahmegarantie: Sollte die Verwaltung Mängel feststellen, reinigen wir kostenlos innerhalb von 48 Stunden nach.',
      fr: 'Garantie de remise: si la gérance signale un manquement, nous nettoyons à nouveau gratuitement sous 48h.',
      it: 'Garanzia di consegna: se l\'amministrazione solleva riserve, puliamo gratuitamente entro 48 ore.',
      pt: 'Garantia de entrega: se a administração recusar a entrega, limparemos novamente gratuitamente em 48 horas.'
    },
    sections: [
      {
        title: { es: 'COCINA (Garantía de Entrega)', en: 'KITCHEN (Handover Guarantee)', de: 'KÜCHE (Abnahmegarantie)', fr: 'CUISINE (Garantie de Remise)', it: 'CUCINA (Garanzia)', pt: 'COZINHA (Garantia)' },
        items: [
          { text: { es: 'Limpieza de armarios y cajones por dentro, por fuera y por encima.', en: 'Cleaning of all cabinets and drawers inside, outside, and on top.', de: 'Reinigung von Schränken und Schubladen innen, aussen und oben.', fr: 'Nettoyage des armoires et tiroirs intérieur, extérieur et dessus.', it: 'Pulizia armadi e cassetti interno, esterno e sopra.', pt: 'Limpeza de armários e gavetas por dentro, por fora e por cima.' } },
          { text: { es: 'Limpieza interior y exterior de electrodomésticos empotrados: horno, placa, campana, nevera y congelador.', en: 'Interior and exterior cleaning of built-in appliances: oven, hob, hood, fridge, and freezer.', de: 'Innen- und Aussenreinigung von Einbaugeräten: Backofen, Kochfeld, Dunstabzug, Kühlschrank und Gefrierschrank.', fr: 'Nettoyage intérieur/extérieur des appareils encastrés: four, plaques, hotte, réfrigérateur et congélateur.', it: 'Pulizia interna ed esterna elettrodomestici: forno, piano cottura, cappa, frigo e freezer.', pt: 'Limpeza interior e exterior de eletrodomésticos encastrados: forno, placa, exaustor, frigorífico e congelador.' } },
          { text: { es: 'Descongelado previo de nevera y congelador cuando el cliente no lo haya realizado.', en: 'Defrosting fridge and freezer if not done beforehand.', de: 'Abtauen von Kühlschrank und Gefrierschrank falls nicht vom Kunden erledigt.', fr: 'Dégivrage du réfrigérateur et congélateur si non effectué au préalable.', it: 'Sbrinamento frigo e freezer se non effettuato dal cliente.', pt: 'Descongelamento prévio do frigorífico e congelador quando necessário.' } },
          { text: { es: 'Desincrustación completa de cal en grifería, fregadero y azulejos.', en: 'Complete limescale removal from faucets, sink, and tiles.', de: 'Vollständige Entkalkung von Armaturen, Spüle und Fliesen.', fr: 'Détartrage complet de la robinetterie, de l\'évier et du carrelage.', it: 'Decalcificazione completa di rubinetteria, lavello e piastrelle.', pt: 'Descalcificação completa de torneiras, lava-loiça e azulejos.' } },
          { text: { es: 'Desengrase y limpieza del filtro de la campana extractora.', en: 'Degreasing and filter cleaning of the extractor hood.', de: 'Entfettung und Reinigung des Dunstabzugshaubenfilters.', fr: 'Dégraissage et nettoyage du filtre de la hotte aspirante.', it: 'Sgrassaggio e pulizia del filtro della cappa aspirante.', pt: 'Desengorduramento e limpeza do filtro do exaustor.' } },
          { text: { es: 'Limpieza detrás y debajo de los electrodomésticos móviles.', en: 'Cleaning behind and under moveable appliances.', de: 'Reinigung hinter und unter beweglichen Haushaltsgeräten.', fr: 'Nettoyage derrière et sous les appareils ménagers mobiles.', it: 'Pulizia dietro e sotto gli elettrodomestici mobili.', pt: 'Limpeza atrás e debaixo dos eletrodomésticos móveis.' } }
        ]
      },
      {
        title: { es: 'BAÑOS (Garantía de Entrega)', en: 'BATHROOMS (Handover Guarantee)', de: 'BÄDER (Abnahmegarantie)', fr: 'SALLES DE BAIN (Garantie)', it: 'BAGNI (Garanzia)', pt: 'CASAS DE BANHO (Garantia)' },
        items: [
          { text: { es: 'Descalcificación completa de grifería, ducha, mampara, lavabo e inodoro.', en: 'Full limescale removal from faucets, shower, screen, sink, and toilet.', de: 'Vollständige Entkalkung von Armaturen, Dusche, Duschwand, Waschbecken und WC.', fr: 'Détartrage complet de la robinetterie, douche, paroi, lavabo et WC.', it: 'Decalcificazione completa di rubinetti, doccia, box doccia, lavabo e WC.', pt: 'Descalcificação completa de torneiras, poliban, resguardo, lavatório e sanita.' } },
          { text: { es: 'Limpieza profunda de juntas y azulejos hasta el techo.', en: 'Deep cleaning of wall tile joints up to the ceiling.', de: 'Gründliche Reinigung von Fugen und Wandfliesen bis zur Decke.', fr: 'Nettoyage en profondeur des joints et carrelages jusqu\'au plafond.', it: 'Pulizia profonda di fughe e piastrelle fino al soffitto.', pt: 'Limpeza profunda de juntas e azulejos até ao teto.' } },
          { text: { es: 'Desinfección de todas las superficies sanitarias.', en: 'Sanitization of all sanitary surfaces.', de: 'Desinfektion aller Sanitärflächen.', fr: 'Désinfection de toutes les surfaces sanitaires.', it: 'Sanificazione di tutte le superfici sanitarie.', pt: 'Desinfetação de todas as superfícies sanitárias.' } },
          { text: { es: 'Limpieza de desagües y sifones accesibles.', en: 'Cleaning of drains and accessible siphons.', de: 'Reinigung von Abflüssen und zugänglichen Siphons.', fr: 'Nettoyage des drains et siphons accessibles.', it: 'Pulizia di scarichi e sifoni accessibili.', pt: 'Limpeza de esgotos e sifões acessíveis.' } },
          { text: { es: 'Limpieza de armarios por dentro y por fuera, espejos y rejillas de ventilación.', en: 'Cleaning cabinets inside/out, mirrors, and ventilation grilles.', de: 'Schränke innen/aussen, Spiegel und Lüftungsgitter reinigen.', fr: 'Nettoyage des armoires intérieur/extérieur, miroirs et grilles d\'aération.', it: 'Pulizia armadietti interno/esterno, specchi e griglie di ventilazione.', pt: 'Limpeza de armários interior/exterior, espelhos e grelhas de ventilação.' } }
        ]
      },
      {
        title: { es: 'ZONAS GENERALES (Garantía de Entrega)', en: 'GENERAL AREAS (Handover Guarantee)', de: 'WOHNBEREICHE (Abnahmegarantie)', fr: 'ZONES GÉNÉRALES (Garantie)', it: 'AREE GENERALI (Garanzia)', pt: 'ÁREAS GERAIS (Garantia)' },
        items: [
          { text: { es: 'Limpieza de puertas, marcos, rodapiés, interruptores, enchufes y radiadores.', en: 'Cleaning doors, frames, skirting boards, switches, outlets, and radiators.', de: 'Reinigung von Türen, Rahmen, Sockelleisten, Schaltern, Steckdosen und Heizkörpern.', fr: 'Nettoyage des portes, cadres, plinthes, interrupteurs, prises et radiateurs.', it: 'Pulizia di porte, telai, battiscopa, interruttori, prese e radiatori.', pt: 'Limpeza de portas, aros, rodapés, interruptores, tomadas e radiadores.' } },
          { text: { es: 'Aspirado y fregado de todos los suelos, incluido el interior de armarios empotrados.', en: 'Vacuuming and mopping all floors, including inside built-in wardrobes.', de: 'Saugen und Wischen aller Böden, inkl. Einbauschränke innen.', fr: 'Aspiration et lavage de tous les sols, y compris l\'intérieur des placards intégrés.', it: 'Aspirazione e lavaggio di tutti i pavimenti, inclusi armadi a muro interni.', pt: 'Aspirar e lavar todos os pisos, incluindo o interior de armários embutidos.' } },
          { text: { es: 'Eliminación de telarañas, polvo en lámparas y conductos de ventilación.', en: 'Removal of cobwebs, dust on light fixtures, and vents.', de: 'Entfernung von Spinnweben, Staub an Lampen und Lüftungskanälen.', fr: 'Élimination des toile d\'araignées, dépoussiérage des luminaires et aérations.', it: 'Rimozione ragnatele, spolvero lampadari e condotti di ventilazione.', pt: 'Remoção de teias de aranha, pó em candeeiros e condutas de ventilação.' } },
          { text: { es: 'Limpieza de balcón, terraza, sótano o trastero pertenecientes a la vivienda.', en: 'Cleaning of balcony, terrace, cellar, or storage unit belonging to flat.', de: 'Reinigung von Balkon, Terrasse, Keller oder Estrich zur Wohnung.', fr: 'Nettoyage du balcon, terrasse, cave ou galetas appartenant au logement.', it: 'Pulizia di balcone, terrazza, cantina o solaio appartenenti all\'alloggio.', pt: 'Limpeza de varanda, terraço, cave ou arrecadação pertencente ao imóvel.' } },
          { text: { es: 'Limpieza de la puerta de entrada por ambos lados.', en: 'Cleaning the entrance door on both sides.', de: 'Beidseitige Reinigung der Eingangstür.', fr: 'Nettoyage de la porte d\'entrée des deux côtés.', it: 'Pulizia della porta d\'ingresso su entrambi i lati.', pt: 'Limpeza da porta de entrada por ambos os lados.' } }
        ]
      },
      {
        title: { es: 'VENTANAS Y PERSIANAS (Incluido)', en: 'WINDOWS & BLINDS (Included)', de: 'FENSTER & STOREN (Inklusive)', fr: 'FENÊTRES & STORES (Inclus)', it: 'FINESTRE E TAPPARELLE (Incluso)', pt: 'JANELAS E ESTORES (Incluído)' },
        items: [
          { text: { es: 'Limpieza completa de cristales, marcos y alféizares por dentro y por fuera accesible.', en: 'Complete cleaning of glass, frames, and sills inside and accessible outside.', de: 'Komplette Reinigung von Glas, Rahmen und Simsen innen und aussen zugänglich.', fr: 'Nettoyage complet des vitres, cadres et rebords intérieur et extérieur accessible.', it: 'Pulizia completa di vetri, telai e davanzali interno ed esterno accessibile.', pt: 'Limpeza completa de vidros, caixilhos e peitoris interior e exterior acessível.' } },
          { text: { es: 'Limpieza de persianas, estores y guías accesibles.', en: 'Cleaning accessible shutters, blinds, and tracks.', de: 'Reinigung von Rollläden, Lamellenstoren und Führungsschienen.', fr: 'Nettoyage des volets, stores et glissières accessibles.', it: 'Pulizia di tapparelle, persiane e guide accessibili.', pt: 'Limpeza de estores, persianas e calhas acessíveis.' } },
          { text: { es: 'Limpieza de mosquiteras desmontables.', en: 'Cleaning removable insect screens.', de: 'Reinigung abnehmbarer Fliegengitter.', fr: 'Nettoyage des moustiquaires amovibles.', it: 'Pulizia di zanzariere rimovibili.', pt: 'Limpeza de redes mosquiteiras amovíveis.' } }
        ]
      }
    ],
    exclusions: [
      { es: 'La vivienda debe estar completamente vacía. Sin mobiliario, sin residuos y sin objetos personales.', en: 'The property must be completely empty: no furniture, no rubbish, no personal items.', de: 'Die Wohnung muss komplett leer sein: ohne Möbel, ohne Müll und ohne persönliche Gegenstände.', fr: 'Le logement doit être totalement vide: sans meubles, sans déchets ni objets personnels.', it: 'L\'alloggio dev\'essere completamente vuoto: senza mobili, rifiuti o oggetti personali.', pt: 'A habitação deve estar totalmente vazia: sem móveis, lixo ou objetos pessoais.' },
      { es: 'Ventanas exteriores que requieran pértiga, andamio o escalera de más de 3 m.', en: 'Exterior windows requiring poles, scaffolding, or ladders above 3 meters.', de: 'Aussenfenster, die Teleskopstangen, Gerüste oder Leitern über 3 m erfordern.', fr: 'Vitres extérieures nécessitant perche, échafaudage ou échelle > 3 m.', it: 'Finestre esterne che richiedono asta, ponteggio o scala oltre 3 m.', pt: 'Janelas exteriores que exijam vara telescopica, andaime ou escada > 3 m.' },
      { es: 'Retirada de muebles o residuos abandonados. Se gestiona con el servicio de Eliminación y Desalojo.', en: 'Removal of abandoned furniture/waste. Handled via Waste Management & Clearance service.', de: 'Entsorgung von Altmöbeln/Unrat. Erfolgt über den Dienst Entsorgung & Räumung.', fr: 'Évacuation de meubles/déchets abandonnés. Géré par le service Débarras.', it: 'Sgombero di mobili/rifiuti abbandonati. Gestito col servizio Smaltimento.', pt: 'Remoção de móveis/lixo abandonados. Gerido pelo serviço de Despejo.' },
      { es: 'Reparación de desperfectos, pintura, agujeros de taladro y daños estructurales.', en: 'Repairing damage, wall painting, drill holes, and structural defects.', de: 'Malerarbeiten, Spachteln von Bohrlöchern und Behebung von Bauschäden.', fr: 'Réparation de dégâts, peinture, trous de perceuse et dommages structurels.', it: 'Riparazione di danni, pittura, fori di trapano e danni strutturali.', pt: 'Reparação de danos, pintura, furos de berbequim e danos estruturais.' },
      { es: 'Eliminación de moho estructural con origen en humedad del edificio.', en: 'Structural mold removal originating from building damp issues.', de: 'Sanierung von strukturellem Schimmel aufgrund von Baufeuchte.', fr: 'Traitement de moisissure structurelle issue de l\'humidité du bâtiment.', it: 'Rimozione muffa strutturale derivante da umidità dell\'edificio.', pt: 'Remoção de bolor estrutural originado por humidade do edifício.' }
    ]
  },
  'deep-cleaning': {
    id: 'deep-cleaning',
    title: {
      es: 'Limpieza Profunda',
      en: 'Deep Cleaning',
      de: 'Tiefenreinigung (Intensivreinigung)',
      fr: 'Nettoyage en Profondeur',
      it: 'Pulizia Profonda',
      pt: 'Limpeza Profunda'
    },
    subTitle: 'Tiefenreinigung',
    badge: {
      es: '✨ Reinicio Intensivo del Hogar',
      en: '✨ Intensive Home Reset',
      de: '✨ Intensive Grundreinigung',
      fr: '✨ Remise à neuf intensive',
      it: '✨ Reset Intensivo della Casa',
      pt: '✨ Reinício Intensivo do Lar'
    },
    positioning: {
      es: 'Un reinicio intensivo para viviendas habitadas. No requiere vaciar la casa y no sustituye a la limpieza de fin de contrato.',
      en: 'An intensive reset for inhabited homes. Does not require emptying the house and does not replace handover cleaning.',
      de: 'Ein intensiver Reset für bewohnte Wohnungen. Benötigt kein Ausräumen und ersetzt keine Umzugsreinigung.',
      fr: 'Une remise à niveau intensive pour logements habités. Ne nécessite pas de vider les lieux et ne remplace pas le fin de bail.',
      it: 'Un reset intensivo per case abitate. Non richiede lo svuotamento e non sostituisce la pulizia di fine locazione.',
      pt: 'Um reinício intensivo para lares habitados. Não requer esvaziar a casa e não substitui a limpeza de fim de contrato.'
    },
    guaranteeNote: {
      es: 'Nota de servicio: Recomendado 1-2 veces al año o antes de eventos especiales. Para entregas de alquiler, selecciona Limpieza de Fin de Contrato.',
      en: 'Service note: Recommended 1-2 times a year or before special events. For tenancy handover, select End of Tenancy Cleaning.',
      de: 'Service-Hinweis: Empfohlen 1-2 Mal pro Jahr. Für Wohnungsabgaben wählen Sie bitte die Umzugsreinigung.',
      fr: 'Note: Recommandé 1 à 2 fois par an. Pour une remise de clés gérance, sélectionnez Nettoyage de Fin de Bail.',
      it: 'Nota: Consigliato 1-2 volte all\'anno. Per riconsegna chiavi, selezionare Pulizia di Fine Locazione.',
      pt: 'Nota: Recomendado 1-2 vezes por ano. Para entrega de chaves, selecione Limpeza de Fim de Contrato.'
    },
    sections: [
      {
        title: { es: 'DORMITORIOS, SALÓN Y ZONAS COMUNES', en: 'BEDROOMS, LIVING & COMMON AREAS', de: 'SCHLAFZIMMER, WOHNZIMMER & FLURE', fr: 'CHAMBRES, SÉJOUR & ZONES COMMUNES', it: 'CAMERE, SOGGIORNO E ZONE COMUNI', pt: 'QUARTOS, SALA E ÁREAS COMUNS' },
        items: [
          { text: { es: 'Aspirado y fregado de todos los suelos, incluido debajo de los muebles móviles.', en: 'Vacuuming and mopping all floors, including under moveable furniture.', de: 'Saugen und Wischen aller Böden, auch unter verschiebbaren Möbeln.', fr: 'Aspiration et lavage des sols, y compris sous les meubles mobiles.', it: 'Aspirazione e lavaggio pavimenti, anche sotto i mobili mobili.', pt: 'Aspirar e lavar todos os pisos, incluindo debaixo de móveis móveis.' } },
          { text: { es: 'Eliminación del polvo en todas las superficies accesibles, estanterías, marcos y lámparas.', en: 'Dusting of all accessible surfaces, shelves, frames, and light fixtures.', de: 'Entstaubung aller erreichbaren Flächen, Regale, Rahmen und Lampen.', fr: 'Dépoussiérage de toutes les surfaces accessibles, étagères, cadres et lampes.', it: 'Spolvero di tutte le superfici accessibili, scaffali, cornici e lampade.', pt: 'Eliminação do pó em todas as superfícies acessíveis, prateleiras, caixilhos e candeeiros.' } },
          { text: { es: 'Limpieza de puertas, marcos, rodapiés, interruptores y radiadores.', en: 'Wiping doors, frames, skirting boards, switches, and radiators.', de: 'Reinigung von Türen, Rahmen, Sockelleisten, Schaltern und Heizkörpern.', fr: 'Nettoyage des portes, cadres, plinthes, interrupteurs et radiateurs.', it: 'Pulizia di porte, telai, battiscopa, interruttori e radiatori.', pt: 'Limpeza de portas, aros, rodapés, interruptores e radiadores.' } },
          { text: { es: 'Aspirado de tapicerías y de la zona bajo los cojines.', en: 'Vacuuming upholstery and under seat cushions.', de: 'Absaugen von Polstern und unter den Sitzkissen.', fr: 'Aspiration des tissus d\'ameublement et sous les coussins.', it: 'Aspirazione imbottiti e sotto i cuscini.', pt: 'Aspirar estofos e sob as almofadas.' } },
          { text: { es: 'Hacer las camas si hay sábanas disponibles.', en: 'Making beds if clean linen is provided.', de: 'Betten machen, wenn frische Bettwäsche bereitliegt.', fr: 'Faire les lits si les draps sont à disposition.', it: 'Rifacimento letti con lenzuola disponibili.', pt: 'Fazer as camas se houver lençóis limpos.' } }
        ]
      },
      {
        title: { es: 'BAÑOS Y ASEOS', en: 'BATHROOMS & TOILETS', de: 'BÄDER & WCS', fr: 'SALLES DE BAIN & WCS', it: 'BAGNI E WC', pt: 'CASAS DE BANHO E WCS' },
        items: [
          { text: { es: 'Eliminación intensiva de cal en grifería, azulejos, plato de ducha y cabezales.', en: 'Intensive descaling of taps, tiles, shower tray, and showerheads.', de: 'Intensive Entkalkung von Armaturen, Fliesen, Dusche und Duschköpfen.', fr: 'Détartrage intensif de la robinetterie, du carrelage, de la douche et du pommeau.', it: 'Decalcificazione intensiva di rubinetti, piastrelle, piatto doccia e soffioni.', pt: 'Descalcificação intensiva de torneiras, azulejos, poliban e chuveiros.' } },
          { text: { es: 'Limpieza profunda de juntas, mamparas y siliconas.', en: 'Deep cleaning of tile grout, shower screens, and silicone seals.', de: 'Gründliche Reinigung von Fugen, Duschwänden und Silikonnähten.', fr: 'Nettoyage approfondi des joints, parois et silicones.', it: 'Pulizia profonda di fughe, box doccia e silicone.', pt: 'Limpeza profunda de juntas, resguardos e silicones.' } },
          { text: { es: 'Desinfección de inodoros, lavabos y bañeras.', en: 'Disinfection of toilets, washbasins, and bathtubs.', de: 'Desinfektion von WCs, Waschbecken und Badewannen.', fr: 'Désinfection des WC, lavabos et baignoires.', it: 'Sanificazione di WC, lavabi e vasche.', pt: 'Desinfetação de sanitas, lavatórios e banheiras.' } },
          { text: { es: 'Limpieza de espejos, exterior de armarios y rejillas de ventilación.', en: 'Cleaning mirrors, cabinet exteriors, and ventilation grilles.', de: 'Spiegel, Schrankaussenseiten und Lüftungsgitter reinigen.', fr: 'Nettoyage des miroirs, extérieur des armoires et grilles d\'aération.', it: 'Pulizia specchi, esterno armadietti e griglie.', pt: 'Limpeza de espelhos, exterior de armários e grelhas.' } }
        ]
      },
      {
        title: { es: 'COCINA', en: 'KITCHEN', de: 'KÜCHE', fr: 'CUISINE', it: 'CUCINA', pt: 'COZINHA' },
        items: [
          { text: { es: 'Eliminación de cal en fregadero y grifería.', en: 'Limescale removal from sink and faucets.', de: 'Entkalkung von Spüle und Armaturen.', fr: 'Détartrage de l\'évier et de la robinetterie.', it: 'Decalcificazione lavello e rubinetteria.', pt: 'Eliminação de calcário no lava-loiça e torneiras.' } },
          { text: { es: 'Limpieza de encimeras y de todo el salpicadero.', en: 'Wiping down countertops and splashback.', de: 'Reinigung von Arbeitsflächen und Küchenrückwand.', fr: 'Nettoyage des plan de travail et crédence.', it: 'Pulizia piani di lavoro e paraspruzzi.', pt: 'Limpeza de bancadas e painel de cozinha.' } },
          { text: { es: 'Limpieza exterior de electrodomésticos y limpieza interior del microondas.', en: 'Appliance exterior cleaning and microwave interior.', de: 'Aussenreinigung der Geräte sowie Mikrowelle innen.', fr: 'Nettoyage extérieur des appareils et intérieur du micro-ondes.', it: 'Pulizia esterna elettrodomestici e microonde interno.', pt: 'Limpeza exterior de eletrodomésticos e interior do micro-ondas.' } },
          { text: { es: 'Desengrase exterior de la campana extractora.', en: 'Exterior degreasing of the extractor hood.', de: 'Aussenseitige Entfettung der Dunstabzugshaube.', fr: 'Dégraissage extérieur de la hotte.', it: 'Sgrassaggio esterno della cappa.', pt: 'Desengorduramento exterior do exaustor.' } },
          { text: { es: 'Limpieza de armarios por fuera y por encima.', en: 'Wiping cabinets outside and top surfaces.', de: 'Schrankaussenseiten und Oberflächen oben abwischen.', fr: 'Nettoyage des armoires à l\'extérieur et au-dessus.', it: 'Pulizia esterna e superiore degli armadi.', pt: 'Limpeza exterior de armários e superfícies superiores.' } },
          { text: { es: 'Vaciado de la basura y limpieza del cubo.', en: 'Emptying waste and wiping bin.', de: 'Mülleimer leeren und auswischen.', fr: 'Vidage des poubelles et nettoyage du bac.', it: 'Svuotamento spazzatura e pulizia secchio.', pt: 'Esvaziar o lixo e limpar o balde.' } }
        ]
      },
      {
        title: { es: 'GENERAL Y DETALLES', en: 'GENERAL & DETAILS', de: 'ALLGEMEIN & DETAILS', fr: 'GÉNÉRAL & DÉTAILS', it: 'GENERALE E DETTAGLI', pt: 'GERAL E DETALHES' },
        items: [
          { text: { es: 'Limpieza de interruptores, pomos y manillas.', en: 'Wiping light switches, doorknobs, and handles.', de: 'Reinigung von Lichtschaltern, Türgriffen und Klinken.', fr: 'Nettoyage des interrupteurs, poignées et boutons.', it: 'Pulizia di interruttori, maniglie e pomelli.', pt: 'Limpeza de interruptores e puxadores.' } },
          { text: { es: 'Eliminación de manchas visibles en paredes donde sea seguro hacerlo.', en: 'Removing spot marks on walls where safe.', de: 'Entfernung von sichtbaren Flecken an Wänden (soweit gefahrlos).', fr: 'Élimination des taches visibles sur les murs si sans risque.', it: 'Rimozione macchie visibili sulle pareti ove sicuro.', pt: 'Eliminação de manchas visíveis em paredes quando seguro.' } },
          { text: { es: 'Eliminación de telarañas y polvo en altura accesible.', en: 'Cobweb and high dust removal in accessible areas.', de: 'Entfernung von Spinnweben in erreichbarer Höhe.', fr: 'Dépoussiérage des toiles d\'araignées en hauteur accessible.', it: 'Rimozione ragnatele in altezza accessibile.', pt: 'Remoção de teias de aranha em altura acessível.' } }
        ]
      }
    ],
    exclusions: [
      { es: 'Interior de armarios y cajones que contengan objetos personales.', en: 'Inside cabinets/drawers containing personal belongings.', de: 'Schrank- und Schubladeninnenräume mit persönlichen Gegenständen.', fr: 'Intérieur des armoires/tiroirs contenant des affaires personnelles.', it: 'Interno armadi/cassetti contenenti oggetti personali.', pt: 'Interior de armários/gavetas com objetos pessoais.' },
      { es: 'Interior de horno, nevera y congelador (disponible como extra opcional).', en: 'Oven interior, fridge, and freezer interior (available as optional extras).', de: 'Backofen-, Kühlschrank- und Gefrierschrank-Innenreinigung (als Extra buchbar).', fr: 'Intérieur four, frigo et congélateur (disponibles en option).', it: 'Interno forno, frigo e freezer (disponibili come extra).', pt: 'Interior de forno, frigorífico e congelador (disponíveis como extra).' },
      { es: 'Ventanas exteriores y persianas (disponible como extra opcional).', en: 'Exterior window glass and blinds (available as optional extras).', de: 'Aussenfensterglas und Storen (als Extra buchbar).', fr: 'Vitres extérieures et stores (disponibles en option).', it: 'Vetri esterni e tapparelle (disponibili come extra).', pt: 'Vidros exteriores e estores (disponíveis como extra).' },
      { es: 'Ordenar, clasificar o reubicar objetos personales.', en: 'Tidying, sorting, or re-organizing personal clutter.', de: 'Aufräumen, Sortieren oder Umräumen persönlicher Dinge.', fr: 'Rangement, tri ou réorganisation d\'effets personnels.', it: 'Riordino, selezione o spostamento oggetti personali.', pt: 'Arrumação ou reorganização de objetos pessoais.' },
      { es: 'Garantía de aceptación de entrega (exclusivo del servicio Fin de Contrato).', en: 'Handover guarantee (exclusive to End of Tenancy service).', de: 'Abnahmegarantie (exklusiv beim Umzugsreinigungs-Service).', fr: 'Garantie de remise (exclusive au service Fin de Bail).', it: 'Garanzia di consegna (esclusiva per Fine Locazione).', pt: 'Garantia de aceitação (exclusiva do Fim de Contrato).' }
    ]
  },
  'daily-cleaning': {
    id: 'daily-cleaning',
    title: {
      es: 'Limpieza Recurrente',
      en: 'Regular Maintenance Cleaning',
      de: 'Unterhaltsreinigung (Abonnement)',
      fr: 'Nettoyage Régulier',
      it: 'Pulizia Ricorrente',
      pt: 'Limpeza Recorrente'
    },
    subTitle: 'Unterhaltsreinigung',
    badge: {
      es: '📅 Mantenimiento Periódico Continuo',
      en: '📅 Ongoing Scheduled Maintenance',
      de: '📅 Regelmässiger Haushaltsservice',
      fr: '📅 Entretien régulier planifié',
      it: '📅 Manutenzione Periodica Continua',
      pt: '📅 Manutenção Periódica Contínua'
    },
    positioning: {
      es: 'Mantiene un nivel ya alcanzado. Se trabaja por franja horaria fija y con un plan acordado. No recupera suciedad acumulada.',
      en: 'Maintains an already established cleanliness standard. Works on fixed booked hours with an agreed plan. Does not restore heavy buildup.',
      de: 'Hält einen bereits erreichten Standard aufrecht. Festes Stundenkontingent nach Vereinbarung. Beseitigt keine jahrelangen Ablagerungen.',
      fr: 'Maintient un niveau de propreté déjà atteint. Intervention sur plages horaires fixes. Ne rattrape pas les salissures accumulées.',
      it: 'Mantiene un livello già raggiunto. Lavoro su ore fisse concordate. Non recupera sporco accumulato da tempo.',
      pt: 'Mantém um nível já alcançado. Funciona por bloco de horas fixo com plano acordado. Não recupera sujidade acumulada.'
    },
    guaranteeNote: {
      es: 'Recomendación: el primer servicio de un plan recurrente se realiza como limpieza profunda. A partir de ahí, el mantenimiento sostiene el nivel con menos horas y menor coste.',
      en: 'Recommendation: The initial visit of a regular plan is done as a Deep Clean. Thereafter, regular maintenance preserves perfection with fewer hours.',
      de: 'Empfehlung: Die erste Reinigung eines Abos erfolgt als Tiefenreinigung. Danach hält der Unterhalt das Niveau mit weniger Stunden aufrecht.',
      fr: 'Recommandation: la première intervention d\'un abonnement se fait en Nettoyage en Profondeur pour poser la base.',
      it: 'Raccomandazione: il primo servizio di un abbonamento si esegue come pulizia profonda.',
      pt: 'Recomendação: o primeiro serviço de um plano recorrente é efetuado como limpeza profunda.'
    },
    sections: [
      {
        title: { es: 'DORMITORIOS, SALÓN Y ZONAS COMUNES', en: 'BEDROOMS, LIVING & COMMON AREAS', de: 'SCHLAFZIMMER, WOHNZIMMER & FLURE', fr: 'CHAMBRES, SÉJOUR & ZONES COMMUNES', it: 'CAMERE, SOGGIORNO E ZONE COMUNI', pt: 'QUARTOS, SALA E ÁREAS COMUNS' },
        items: [
          { text: { es: 'Aspirado y fregado de todos los suelos visibles.', en: 'Vacuuming and mopping all visible floors.', de: 'Saugen und Wischen aller sichtbaren Böden.', fr: 'Aspiration et lavage de tous les sols visibles.', it: 'Aspirazione e lavaggio di tutti i pavimenti visibili.', pt: 'Aspirar e lavar todos os pisos visíveis.' } },
          { text: { es: 'Eliminación del polvo en las superficies accesibles y libres.', en: 'Dusting uncluttered, accessible surfaces.', de: 'Entstauben freier, gut zugänglicher Oberflächen.', fr: 'Dépoussiérage des surfaces accessibles et dégagées.', it: 'Spolvero superfici accessibili e libere.', pt: 'Eliminação do pó em superfícies acessíveis e livres.' } },
          { text: { es: 'Hacer las camas si hay sábanas disponibles.', en: 'Making beds if clean sheets are available.', de: 'Betten machen, wenn Bettwäsche bereitsteht.', fr: 'Faire les lits si les draps sont fournis.', it: 'Rifacimento letti se lenzuola disponibili.', pt: 'Fazer as camas se houver lençóis limpos.' } },
          { text: { es: 'Orden básico de superficies sin reubicar objetos personales.', en: 'Basic surface tidying without reorganizing personal items.', de: 'Oberschichtige Ordnung ohne persönliches Umräumen.', fr: 'Rangement de surface sans déplacer les objets personnels.', it: 'Riordino base senza spostare oggetti personali.', pt: 'Arrumação básica sem reubicar objetos pessoais.' } }
        ]
      },
      {
        title: { es: 'BAÑOS Y ASEOS', en: 'BATHROOMS & TOILETS', de: 'BÄDER & WCS', fr: 'SALLES DE BAIN & WCS', it: 'BAGNI E WC', pt: 'CASAS DE BANHO E WCS' },
        items: [
          { text: { es: 'Aspirado y fregado de suelos.', en: 'Vacuuming and mopping floors.', de: 'Saugen und Wischen der Böden.', fr: 'Aspiration et lavage des sols.', it: 'Aspirazione e lavaggio pavimenti.', pt: 'Aspirar e lavar pisos.' } },
          { text: { es: 'Limpieza de lavabos, bañeras y duchas.', en: 'Wiping washbasins, baths, and shower units.', de: 'Reinigung von Waschbecken, Badewannen und Duschen.', fr: 'Nettoyage des lavabos, baignoires et douches.', it: 'Pulizia lavabi, vasche e docce.', pt: 'Limpeza de lavatórios, banheiras e polibãs.' } },
          { text: { es: 'Desinfección de inodoros.', en: 'Disinfecting toilets.', de: 'Desinfektion der Toiletten.', fr: 'Désinfection des WC.', it: 'Sanificazione dei WC.', pt: 'Desinfetação de sanitas.' } },
          { text: { es: 'Limpieza de espejos y grifería.', en: 'Wiping mirrors and taps.', de: 'Spiegel und Armaturen wischen.', fr: 'Nettoyage des miroirs et robinetteries.', it: 'Pulizia specchi e rubinetteria.', pt: 'Limpeza de espelhos e torneiras.' } },
          { text: { es: 'Reposición de consumibles facilitados por el cliente.', en: 'Replenishing client-provided consumables (soap/paper).', de: 'Auffüllen vom Kunden bereitgestellter Verbrauchsmaterialien.', fr: 'Réapprovisionnement des consommables fournis par le client.', it: 'Rifornimento materiali consumabili forniti dal cliente.', pt: 'Reposição de consumíveis fornecidos pelo cliente.' } }
        ]
      },
      {
        title: { es: 'COCINA', en: 'KITCHEN', de: 'KÜCHE', fr: 'CUISINE', it: 'CUCINA', pt: 'COZINHA' },
        items: [
          { text: { es: 'Limpieza del fregadero, la grifería y las encimeras.', en: 'Wiping sink, taps, and worktops.', de: 'Reinigung von Spüle, Armaturen und Arbeitsflächen.', fr: 'Nettoyage de l\'évier, robinetterie et plans de travail.', it: 'Pulizia lavello, rubinetti e piani lavoro.', pt: 'Limpeza do lava-loiça, torneiras e bancadas.' } },
          { text: { es: 'Limpieza exterior de cocina, horno y nevera.', en: 'Wiping exteriors of cooker, oven, and fridge.', de: 'Aussenreinigung von Herd, Backofen und Kühlschrank.', fr: 'Nettoyage extérieur cuisinière, four et frigo.', it: 'Pulizia esterna piano cottura, forno e frigo.', pt: 'Limpeza exterior do fogão, forno e frigorífico.' } },
          { text: { es: 'Limpieza de la mesa y de las sillas.', en: 'Wiping dining table and chairs.', de: 'Tisch und Stühle abwischen.', fr: 'Nettoyage de la table et des chaises.', it: 'Pulizia tavolo e sedie.', pt: 'Limpeza da mesa e cadeiras.' } },
          { text: { es: 'Vaciado de la basura y reposición de la bolsa.', en: 'Emptying bin and fitting new bag.', de: 'Müll leeren und neuen Beutel einsetzen.', fr: 'Vidage de la poubelle et remplacement du sac.', it: 'Svuotamento spazzatura e cambio sacchetto.', pt: 'Esvaziar lixo e colocar novo saco.' } }
        ]
      },
      {
        title: { es: 'GENERAL', en: 'GENERAL', de: 'ALLGEMEIN', fr: 'GÉNÉRAL', it: 'GENERALE', pt: 'GERAL' },
        items: [
          { text: { es: 'Limpieza de interruptores y pomos de puertas.', en: 'Wiping light switches and door handles.', de: 'Lichtschalter und Türgriffe abwischen.', fr: 'Nettoyage des interrupteurs et poignées.', it: 'Pulizia interruttori e maniglie.', pt: 'Limpeza de interruptores e puxadores.' } },
          { text: { es: 'Ventilación de las estancias durante el servicio.', en: 'Airing out rooms during service.', de: 'Lüften der Räume während des Dienstes.', fr: 'Aération des pièces pendant la prestation.', it: 'Aerazione dei locali durante il servizio.', pt: 'Ventilar divisões durante o serviço.' } },
          { text: { es: 'Aviso de incidencias detectadas en la vivienda.', en: 'Notifying client of any noticed home issues.', de: 'Meldung von entdeckten Auffälligkeiten/Mängeln.', fr: 'Signalement d\'éventuelles anomalies constatées.', it: 'Segnalazione anomalie riscontrate.', pt: 'Aviso de ocorrências detetadas no imóvel.' } }
        ]
      }
    ],
    exclusions: [
      { es: 'Cal incrustada acumulada. Requiere una limpieza profunda previa.', en: 'Heavy, long-standing limescale buildup. Requires prior Deep Clean.', de: 'Hartnäckige, alte Kalkkrusten (erfordert vorherige Tiefenreinigung).', fr: 'Calcaire incrusté ancien (nécessite un Nettoyage en Profondeur préalable).', it: 'Calcare ostinato accumulato (richiede pulizia profonda preventiva).', pt: 'Calcário incrustado acumulado (requer limpeza profunda prévia).' },
      { es: 'Interior de electrodomésticos, armarios y cajones.', en: 'Inside of appliances, cupboards, and drawers.', de: 'Innenbereiche von Haushaltsgeräten, Schränken und Schubladen.', fr: 'Intérieur des appareils, armoires et tiroirs.', it: 'Interno elettrodomestici, armadi e cassetti.', pt: 'Interior de eletrodomésticos, armários e gavetas.' },
      { es: 'Ventanas, balcones, terrazas y zonas exteriores.', en: 'Windows, balconies, terraces, and exterior grounds.', de: 'Fenster, Balkone, Terrassen und Aussenbereiche.', fr: 'Vitres, balcons, terrasses et espaces extérieurs.', it: 'Finestre, balconi, terrazze e zone esterne.', pt: 'Janelas, varandas, terraços e exteriores.' },
      { es: 'Recogida y clasificación de objetos personales.', en: 'Sorting through or packing away personal papers/clutter.', de: 'Einsammeln und Sortieren persönlicher Gegenstände.', fr: 'Tri et rangement de documents ou affaires personnelles.', it: 'Sistemazione o selezione di oggetti personali.', pt: 'Recolha e classificação de objetos pessoais.' },
      { es: 'Trabajos por encima de 2 m o con escalera.', en: 'Work above 2 meters or requiring stepladders.', de: 'Arbeiten über 2 m Höhe oder auf Stehleitern.', fr: 'Travaux à plus de 2 m de hauteur ou sur escabeau.', it: 'Lavori sopra i 2 metri o con scala.', pt: 'Trabalhos acima de 2m ou com escada.' }
    ]
  },
  'moving': {
    id: 'moving',
    title: {
      es: 'Mudanza y Transporte de Muebles',
      en: 'Moving & Furniture Transport',
      de: 'Umzug & Möbeltransport',
      fr: 'Déménagement & Transport de Meubles',
      it: 'Trasloco e Trasporto Mobili',
      pt: 'Mudança e Transporte de Móveis'
    },
    subTitle: 'Transport',
    badge: {
      es: '🚚 Logística con Protección Integral',
      en: '🚚 Full Protection Logistics',
      de: '🚚 Umzugslogistik mit Möbelschutz',
      fr: '🚚 Déménagement & protection intégrale',
      it: '🚚 Logistica con Protezione Integrale',
      pt: '🚚 Logística com Proteção Integral'
    },
    positioning: {
      es: 'Traslado de mobiliario con protección, montaje y colocación. Servicio logístico, no de limpieza.',
      en: 'Furniture transport with padded protection, disassembly, assembly, and room placement. Logistics service, not cleaning.',
      de: 'Möbeltransport mit Schutz, Demontage, Montage und Platzierung. Logistikdienstleistung, keine Reinigung.',
      fr: 'Transport de mobilier avec protections, démontage, remontage et installation. Service logistique, non de nettoyage.',
      it: 'Trasporto mobili con protezione, smontaggio, montaggio e posizionamento. Servizio logistico, non pulizia.',
      pt: 'Transporte de mobiliário com proteção, montagem e colocação. Serviço logístico, não de limpeza.'
    },
    guaranteeNote: {
      es: 'Transporte asegurado en las regiones de Schaffhausen, Winterthur y Zúrich con vehículo homologado y personal especializado.',
      en: 'Insured transport across Schaffhausen, Winterthur, and Zurich with certified vehicles and expert crew.',
      de: 'Versicherter Transport in den Regionen Schaffhausen, Winterthur und Zürich mit Spezialfahrzeugen.',
      fr: 'Transport assuré dans les régions de Schaffhouse, Winterthour et Zurich avec véhicules équipés.',
      it: 'Trasporto assicurato nelle regioni di Sciaffusa, Winterthur e Zurigo.',
      pt: 'Transporte segurado nas regiões de Schaffhausen, Winterthur e Zurique.'
    },
    sections: [
      {
        title: { es: 'PREPARACIÓN Y PROTECCIÓN', en: 'PREPARATION & PROTECTION', de: 'VORBEREITUNG & SCHUTZ', fr: 'PRÉPARATION & PROTECTION', it: 'PREPARAZIONE E PROTEZIONE', pt: 'PREPARAÇÃO E PROTEÇÃO' },
        items: [
          { text: { es: 'Protección de suelos, marcos y esquinas en origen y en destino.', en: 'Protection of floors, door frames, and corners at origin and destination.', de: 'Schutz von Böden, Türrahmen und Ecken am Start- und Zielort.', fr: 'Protection des sols, encadrements et angles au départ et à l\'arrivée.', it: 'Protezione pavimenti, telai e angoli in partenza e arrivo.', pt: 'Proteção de pisos, caixilhos e cantos na origem e destino.' } },
          { text: { es: 'Embalaje de todos los muebles con mantas acolchadas y film protector.', en: 'Wrapping all furniture with padded blankets and stretch film.', de: 'Einwickeln aller Möbel in Schutzdecken und Dehnfolie.', fr: 'Emballage de tous les meubles avec couvertures matelassées et film.', it: 'Imballaggio di tutti i mobili con coperte e film protettivo.', pt: 'Embalamento de todos os móveis com mantas e película.' } },
          { text: { es: 'Desmontaje y montaje de mobiliario estándar: camas, mesas y estanterías.', en: 'Disassembly and reassembly of standard furniture: beds, tables, shelving.', de: 'Demontage und Montage von Standardmöbeln: Betten, Tische, Regale.', fr: 'Démontage et remontage du mobilier standard: lits, tables, étagères.', it: 'Smontaggio e montaggio mobili standard: letti, tavoli, scaffali.', pt: 'Desmontagem e montagem de mobiliário standard: camas, mesas, estantes.' } },
          { text: { es: 'Etiquetado por estancia para una descarga ordenada.', en: 'Room labeling for organized unloading.', de: 'Beschriftung nach Räumen für geordnete Entladung.', fr: 'Étiquetage par pièce pour un déchargement ordonné.', it: 'Etichettatura per ambiente per uno scarico ordinato.', pt: 'Etiquetagem por divisão para uma descarga organizada.' } }
        ]
      },
      {
        title: { es: 'CARGA Y TRANSPORTE', en: 'LOADING & TRANSPORT', de: 'BELADUNG & TRANSPORT', fr: 'CHARGEMENT & TRANSPORT', it: 'CARICO E TRASPORTO', pt: 'CARGA E TRANSPORTE' },
        items: [
          { text: { es: 'Vehículo, carburante y kilometraje incluidos en el precio acordado.', en: 'Moving truck, fuel, and mileage included in agreed quote.', de: 'Fahrzeug, Kraftstoff und Kilometereinsatz im Preis enthalten.', fr: 'Véhicule, carburant et kilométrage inclus dans le devis.', it: 'Veicolo, carburante e chilometraggio inclusi.', pt: 'Veículo, combustível e quilometragem incluídos no orçamento.' } },
          { text: { es: 'Personal formado en técnicas de carga y manipulación segura.', en: 'Trained movers experienced in safe heavy lifting.', de: 'Geschultes Personal für sicheres Tragen und Verladen.', fr: 'Personnel formé aux techniques de manutention sécurisée.', it: 'Personale qualificato per movimentazione sicura.', pt: 'Pessoal treinado em técnicas de carga e manuseamento seguro.' } },
          { text: { es: 'Estiba y sujeción de la carga con correas homologadas.', en: 'Cargo securing using approved lashing straps.', de: 'Ladungssicherung mit zertifizierten Spanngurten.', fr: 'Arrimage de la cargaison avec sangles homologuées.', it: 'Fissaggio carico con cinghie omologate.', pt: 'Fixação da carga com cintas homologadas.' } },
          { text: { es: 'Transporte asegurado en las regiones de Schaffhausen, Winterthur y Zúrich.', en: 'Insured transport in Schaffhausen, Winterthur, and Zurich.', de: 'Versicherter Transport in Schaffhausen, Winterthur und Zürich.', fr: 'Transport assuré sur Schaffhouse, Winterthour et Zurich.', it: 'Trasporto assicurato a Sciaffusa, Winterthur e Zurigo.', pt: 'Transporte segurado em Schaffhausen, Winterthur e Zurique.' } }
        ]
      },
      {
        title: { es: 'ENTREGA Y COLOCACIÓN', en: 'DELIVERY & PLACEMENT', de: 'ENTLADUNG & PLATZIERUNG', fr: 'LIVRAISON & INSTALLATION', it: 'CONSEGNA E POSIZIONAMENTO', pt: 'ENTREGA E COLOCAÇÃO' },
        items: [
          { text: { es: 'Descarga y colocación de cada mueble en la estancia indicada.', en: 'Unloading and placing each item in designated rooms.', de: 'Entladen und Aufstellen der Möbel im Wunschraum.', fr: 'Déchargement et placement dans la pièce désignée.', it: 'Scarico e posizionamento di ciascun mobile nella stanza indicata.', pt: 'Descarga e colocação de cada móvel na divisão indicada.' } },
          { text: { es: 'Montaje del mobiliario previamente desmontado por nuestro equipo.', en: 'Reassembling items disassembled by our team.', de: 'Wiederaufbau der vom Team demontierten Möbel.', fr: 'Remontage des meubles démontés par nos soins.', it: 'Rimontaggio dei mobili smontati dalla squadra.', pt: 'Montagem dos móveis desmontados pela nossa equipa.' } },
          { text: { es: 'Retirada del material de embalaje utilizado.', en: 'Removal of all protective wrapping materials.', de: 'Entsorgung des verwendeten Verpackungsmaterials.', fr: 'Evacuation des emballages utilisés.', it: 'Ritiro del materiale di imballaggio usato.', pt: 'Remoção do material de embalamento utilizado.' } },
          { text: { es: 'Revisión final conjunta con el cliente antes de cerrar el servicio.', en: 'Joint final walkthrough with client upon completion.', de: 'Gemeinsame Abschlusskontrolle mit dem Kunden.', fr: 'Vérification finale conjointe avec le client.', it: 'Ispezione finale congiunta col cliente.', pt: 'Revisão final conjunta com o cliente.' } }
        ]
      }
    ],
    exclusions: [
      { es: 'Cajas fuertes, pianos y piezas de más de 100 kg sin presupuesto específico.', en: 'Safes, pianos, and items over 100 kg without specific prior quote.', de: 'Tresore, Klaviere und Objekte über 100 kg ohne Spezialofferte.', fr: 'Coffres-forts, pianos et pièces de > 100 kg sans devis dédié.', it: 'Cassaforti, pianoforti e carichi > 100 kg senza preventivo specifico.', pt: 'Cofres, pianos e peças com mais de 100 kg sem orçamento específico.' },
      { es: 'Joyas, documentos, dinero en efectivo y objetos de valor irremplazable.', en: 'Jewelry, legal documents, cash, and irreplaceable heirlooms.', de: 'Schmuck, Dokumente, Bargeld und unersetzliche Wertsachen.', fr: 'Bijoux, documents officiels, espèces et objets de grande valeur.', it: 'Gioielli, documenti, contanti e oggetti di valore inestimabile.', pt: 'Jóias, documentos, dinheiro e objetos de valor insubstituível.' },
      { es: 'Plantas de gran porte y animales vivos.', en: 'Very large potted plants and live animals.', de: 'Grosse Pflanzen und lebende Tiere.', fr: 'Plantes de très grande taille et animaux vivants.', it: 'Piante di grandi dimensioni e animali vivi.', pt: 'Plantas de grande porte e animais vivos.' },
      { es: 'Materiales inflamables, químicos o peligrosos.', en: 'Flammable, chemical, or hazardous materials.', de: 'Entzündliche, chemische oder gefährliche Stoffe.', fr: 'Matières inflammables, chimiques ou dangereuses.', it: 'Materiali infiammabili, chimici o pericolosi.', pt: 'Materiais inflamáveis, químicos ou perigosos.' },
      { es: 'Desmontaje de cocinas, muebles empotrados y equipos conectados a instalaciones.', en: 'Disassembly of fitted kitchens, built-in wardrobes, or hardwired electronics.', de: 'Demontage von Einbauküchen, Festeinbauten und Elektro-/Gasanschlüssen.', fr: 'Démontage de cuisines intégrées, placards encastrés et raccords.', it: 'Smontaggio cucine componibili e impianti fissi.', pt: 'Desmontagem de cozinhas encastradas e ligações fixas.' }
    ]
  },
  'gardening': {
    id: 'gardening',
    title: {
      es: 'Jardinería y Mantenimiento Exterior',
      en: 'Gardening & Grounds Maintenance',
      de: 'Gartenpflege & Aussenbereich',
      fr: 'Jardinage & Entretien des Espaces Verts',
      it: 'Giardinaggio e Cura del Verde',
      pt: 'Jardinagem e Manutenção de Jardins'
    },
    subTitle: 'Gartenpflege',
    badge: {
      es: '🌿 Retirada de Residuos Verdes Incluida',
      en: '🌿 Green Waste Disposal Included',
      de: '🌿 Inklusive Grüngutentsorgung',
      fr: '🌿 Évacuation des déchets verts incluse',
      it: '🌿 Smaltimento Scarti Verdi Incluso',
      pt: '🌿 Remoção de Resíduos Verdes Incluída'
    },
    positioning: {
      es: 'Mantenimiento periódico de césped, setos y superficies exteriores. Con retirada de residuos verdes incluida.',
      en: 'Regular maintenance of lawns, hedges, and outdoor areas. Includes green waste removal and disposal.',
      de: 'Regelmässige Pflege von Rasen, Hecken und Aussenanlagen. Inklusive Abtransport von Schnittgut.',
      fr: 'Entretien périodique des pelouses, haies et extérieurs. Avec évacuation des déchets verts incluse.',
      it: 'Manutenzione periodica di prato, siepi e aree esterne. Con smaltimento scarti verde incluso.',
      pt: 'Manutenção periódica de relvados, sebes e áreas exteriores. Com remoção de resíduos verdes incluída.'
    },
    guaranteeNote: {
      es: 'Métodos ecológicos: Eliminación mecánica y térmica de malas hierbas en conformidad con la legislación ambiental suiza.',
      en: 'Eco-Friendly Methods: Mechanical and thermal weed control in full compliance with Swiss environmental laws.',
      de: 'Umweltfreundliche Methoden: Mechanische & thermische Unkrautbekämpfung nach Schweizer Umweltgesetz.',
      fr: 'Méthodes écologiques: Désherbage mécanique et thermique conforme à la législation suisse.',
      it: 'Metodi ecologici: Diserbo meccanico e termico in conformità con la legge svizzera.',
      pt: 'Métodos ecológicos: Controlo mecânico e térmico de ervas daninhas conforme a lei suíça.'
    },
    sections: [
      {
        title: { es: 'CÉSPED Y SUPERFICIES VERDES', en: 'LAWNS & GREEN SURFACES', de: 'RASEN & GRÜNFLÄCHEN', fr: 'PELOUSES & ESPACES VERTS', it: 'PRATO E SUPERFICI VERDI', pt: 'RELVADOS E SUPERFÍCIES VERDES' },
        items: [
          { text: { es: 'Siega del césped a la altura adecuada según la temporada.', en: 'Lawn mowing tuned to seasonal height needs.', de: 'Rasenmähen auf saisonal abgestimmte Schnitthöhe.', fr: 'Tonte de la pelouse à hauteur adaptée selon la saison.', it: 'Taglio del prato all\'altezza adeguata alla stagione.', pt: 'Corte do relvado à altura adequada segundo a época.' } },
          { text: { es: 'Recorte de bordes junto a muros, caminos y parterres.', en: 'Edge trimming along walls, pathways, and flowerbeds.', de: 'Kanten schneiden an Mauern, Wegen und Beeten.', fr: 'Taille des bordures le long des murs, allées et parterres.', it: 'Rifilatura bordi lungo muri, camminamenti e aiuole.', pt: 'Corte de bordaduras junto a muros, caminhos e canteiros.' } },
          { text: { es: 'Escarificado y aireado en primavera y otoño (complemento).', en: 'Lawn scarification and aeration in spring/autumn (add-on).', de: 'Vertikutieren und Lüften im Frühjahr/Herbst (Zusatzleistung).', fr: 'Scarification et aération au printemps/automne (complément).', it: 'Scarificazione e arieggiatura in primavera/autunno (extra).', pt: 'Escarificação e arejamento na primavera/outono (complemento).' } },
          { text: { es: 'Retirada de hojas y de todos los restos de siega.', en: 'Removal of leaves and all lawn clippings.', de: 'Entfernung von Laub und Rasenschnitt.', fr: 'Ramassage des feuilles et déchets de tonte.', it: 'Raccolta foglie e sfalci d\'erba.', pt: 'Remoção de folhas e resíduos de corte.' } }
        ]
      },
      {
        title: { es: 'SETOS, ARBUSTOS Y ÁRBOLES', en: 'HEDGES, SHRUBS & TREES', de: 'HECKEN, STRÄUCHER & BÄUME', fr: 'HAIES, ARBUSTES & ARBRES', it: 'SIEPI, ARBUSTI E ALBERI', pt: 'SEBES, ARBUSTOS E ÁRBORES' },
        items: [
          { text: { es: 'Corte y perfilado de setos hasta 3 m de altura.', en: 'Hedge trimming and shaping up to 3 meters high.', de: 'Heckenschnitt und Formgebung bis 3 m Höhe.', fr: 'Taille et profilage des haies jusqu\'à 3 m de hauteur.', it: 'Taglio e sagomatura siepi fino a 3 m di altezza.', pt: 'Corte e perfilagem de sebes até 3 m de altura.' } },
          { text: { es: 'Poda de arbustos y de plantas ornamentales según su ciclo.', en: 'Pruning shrubs and ornamental plants according to plant cycle.', de: 'Rückschnitt von Sträuchern und Zierpflanzen.', fr: 'Taille des arbustes et plantes ornementales selon leur cycle.', it: 'Potatura arbusti e piante ornamentali.', pt: 'Poda de arbustos e plantas ornamentais segundo o ciclo.' } },
          { text: { es: 'Poda de ramas bajas y de árboles pequeños hasta 4 m.', en: 'Pruning lower branches and small trees up to 4 meters.', de: 'Astaastung von Niederholz und Kleinbäumen bis 4 m.', fr: 'Élagage des basses branches et petits arbres jusqu\'à 4 m.', it: 'Potatura rami bassi e piccoli alberi fino a 4 m.', pt: 'Poda de ramos baixos e pequenas árvores até 4 m.' } },
          { text: { es: 'Retirada y triturado del material cortado.', en: 'Chipping and green haulage of all prunings.', de: 'Häckseln und Abtransport des Schnittguts.', fr: 'Broyage et évacuation de la taille.', it: 'Triturazione e ritiro del materiale tagliato.', pt: 'Trituração e remoção do material cortado.' } }
        ]
      },
      {
        title: { es: 'PARTERRES Y ACCESOS', en: 'FLOWERBEDS & PATHWAYS', de: 'BEETE & ZUWEGE', fr: 'PARTERRES & ACCÈS', it: 'AIUOLE E ACCESSI', pt: 'CANTEIROS E ACESSOS' },
        items: [
          { text: { es: 'Eliminación manual de malas hierbas en parterres y macizos.', en: 'Manual weeding in flowerbeds and borders.', de: 'Manuelles Jäten von Unkraut in Beeten.', fr: 'Désherbage manuel des parterres et massifs.', it: 'Diserbo manuale in aiuole e fioriere.', pt: 'Eliminação manual de ervas daninhas em canteiros.' } },
          { text: { es: 'Eliminación mecánica o térmica de hierbas en juntas de caminos y entradas.', en: 'Mechanical/thermal weed clearing between paving joints.', de: 'Mechanische/thermische Fugenreinigung von Gehwegen.', fr: 'Désherbage mécanique/thermique des joints d\'allées.', it: 'Diserbo meccanico o termico delle fughe.', pt: 'Eliminação mecânica ou térmica de ervas em juntas de pavimentos.' } },
          { text: { es: 'Barrido y limpieza de terrazas y accesos al terminar.', en: 'Sweeping and blowing clean all paths and patios upon finishing.', de: 'Reinen von Terrassen und Zuwegen nach Abschluss.', fr: 'Balayage et nettoyage des terrasses et allées à la fin.', it: 'Spazzamento e pulizia terrazze e percorsi.', pt: 'Varredura e limpeza de terraços e acessos ao terminar.' } }
        ]
      }
    ],
    exclusions: [
      { es: 'Tala de árboles de gran porte y trabajos con motosierra en altura.', en: 'Large tree felling and high-altitude chainsaw arborist work.', de: 'Fällen von Grossbäumen und Seilkletterarbeiten in der Höhe.', fr: 'Abattage de grands arbres et élagage complexe en hauteur.', it: 'Abbattimento alberi ad alto fusto e interventi ad alta quota.', pt: 'Corte de árvores de grande porte e trabalhos de motosserra em altura.' },
      { es: 'Herbicidas químicos en caminos, terrazas y accesos (prohibidos en Suiza).', en: 'Chemical herbicides on paths/patios (strictly prohibited under Swiss law).', de: 'Chemische Unkrautvernichter auf Wegen/Plätzen (in der Schweiz verboten).', fr: 'Herbicide chimique sur allées et terrasses (interdit en Suisse).', it: 'Erbicidi chimici su viali e terrazze (vietati in Svizzera).', pt: 'Herbicidas químicos em caminhos e terraços (proibidos na Suíça).' },
      { es: 'Diseño paisajístico, obra nueva, muros y pavimentaciones.', en: 'Landscape architecture, heavy masonry, or new paving works.', de: 'Gartenneugestaltung, Pflasterarbeiten und Mauerbau.', fr: 'Aménagement paysager lourd, maçonnerie et pavage.', it: 'Progettazione paesaggistica, muri e pavimentazioni nuove.', pt: 'Design paisagístico, obras novas, muros e pavimentação.' }
    ]
  },
  'exterior-cleaning': {
    id: 'exterior-cleaning',
    title: {
      es: 'Limpieza de Exteriores y Fachadas',
      en: 'Exterior & Facade Pressure Washing',
      de: 'Aussenreinigung & Fassadenwäsche',
      fr: 'Nettoyage Extérieur & Façades',
      it: 'Pulizia Esterni e Facciate',
      pt: 'Limpeza de Exteriores e Fachadas'
    },
    subTitle: 'Aussenreinigung',
    badge: {
      es: '💦 Presión Regulada & Biodegradable',
      en: '💦 Regulated Pressure & Eco-Friendly',
      de: '💦 Regulierter Druck & Biodegradabel',
      fr: '💦 Pression régulée & biodégradable',
      it: '💦 Pressione Regolata e Biodegradabile',
      pt: '💦 Pressão Regulada e Biodegradável'
    },
    positioning: {
      es: 'Recuperación de fachadas, terrazas y superficies duras mediante presión regulada. Sin dañar el material.',
      en: 'Restoration of facades, patios, and hard surfaces using pressure regulation. Safe for building materials.',
      de: 'Auffrischung von Fassaden, Terrassen und Hartbelägen mit reguliertem Druck. Materialschonend.',
      fr: 'Rénovation des façades, terrasses et surfaces dures par pression régulée. Sans endommager le matériau.',
      it: 'Ripristino di facciate, terrazze e superfici dure con pressione regolata. Senza danneggiare il materiale.',
      pt: 'Recuperação de fachadas, terraços e superfícies duras mediante pressão regulada. Sem danificar o material.'
    },
    guaranteeNote: {
      es: 'Prueba de presión previa en zona discreta y uso exclusivo de limpiadores biodegradables regulados.',
      en: 'Pre-test conducted in discrete zone and exclusive use of certified biodegradable agents.',
      de: 'Druck-Testmuster an unauffälliger Stelle und biologisch abbaubare Reinigungsmittel.',
      fr: 'Test de pression préalable et produits 100% biodégradables autorisés en Suisse.',
      it: 'Test preliminare di pressione e prodotti biodegradabili omologati.',
      pt: 'Teste de pressão prévio e utilização exclusiva de produtos biodegradáveis autorizados.'
    },
    sections: [
      {
        title: { es: 'FACHADAS Y MUROS', en: 'FACADES & WALLS', de: 'FASSADEN & MAUERN', fr: 'FAÇADES & MURS', it: 'FACCIATE E MURI', pt: 'FACHADAS E MUROS' },
        items: [
          { text: { es: 'Limpieza a presión regulada de fachadas, muros y zócalos.', en: 'Calibrated pressure washing of exterior walls, stone facades, and plinths.', de: 'Regulierte Druckreinigung von Fassaden, Mauern und Sockeln.', fr: 'Nettoyage sous pression régulée des façades, murs et socles.', it: 'Pulizia a pressione regolata di facciate, muri e zoccoli.', pt: 'Limpeza a pressão regulada de fachadas, muros e rodapés.' } },
          { text: { es: 'Eliminación de musgo, algas y verdín.', en: 'Removal of moss, algae, lichens, and green grime.', de: 'Entfernung von Moos, Algen und Grünspan.', fr: 'Élimination des mousses, algues et traces vertes.', it: 'Rimozione di muschio, alghe e patina verde.', pt: 'Eliminação de musgo, algas e verdete.' } },
          { text: { es: 'Limpieza de puertas de garaje, persianas exteriores y cajones.', en: 'Wiping garage doors, external roller shutters, and casings.', de: 'Reinigung von Garagentoren, Aussenstoren und Rolladenkästen.', fr: 'Nettoyage des portes de garage, volets extérieurs et caissons.', it: 'Pulizia di portoni garage, tapparelle esterne e cassonetti.', pt: 'Limpeza de portões de garagem, estores exteriores e caixas.' } }
        ]
      },
      {
        title: { es: 'SUELOS Y TERRAZAS', en: 'FLOORS & PATIOS', de: 'BÖDEN & TERRASSEN', fr: 'SOLS & TERRASSES', it: 'PAVIMENTI E TERRAZZE', pt: 'PAVIMENTOS E TERRAÇOS' },
        items: [
          { text: { es: 'Limpieza a alta presión de terrazas, caminos, entradas y patios.', en: 'Surface power washing of stone patios, driveways, and pathways.', de: 'Hochdruckreinigung von Terrassen, Gehwegen, Einfahrten und Höfen.', fr: 'Nettoyage haute pression des terrasses, allées, entrées et cours.', it: 'Pulizia ad alta pressione di terrazze, viali, ingressi e cortili.', pt: 'Limpeza a alta pressão de terraços, caminhos, entradas e pátios.' } },
          { text: { es: 'Limpieza de escaleras exteriores y rampas de acceso.', en: 'Power washing exterior stairs and access ramps.', de: 'Reinigung von Aussentreppen und Auffahrtsrampen.', fr: 'Nettoyage des escaliers extérieurs et rampes d\'accès.', it: 'Pulizia di scale esterne e rampe di accesso.', pt: 'Limpeza de escadas exteriores e rampas de acesso.' } },
          { text: { es: 'Limpieza de garajes y plazas de aparcamiento.', en: 'Washing garage floors and outdoor parking spaces.', de: 'Reinigung von Garagenböden und Aussenparkplätzen.', fr: 'Nettoyage de garages et places de parc.', it: 'Pulizia di garage e posti auto.', pt: 'Limpeza de garagens e lugares de estacionamento.' } }
        ]
      }
    ],
    exclusions: [
      { es: 'Trabajos por encima de 3 m sin plataforma elevadora contratada.', en: 'Work above 3 meters without hired cherry picker lift.', de: 'Arbeiten über 3 m Höhe ohne vereinbarte Hebebühne.', fr: 'Travaux à plus de 3 m sans nacelle élévatrice.', it: 'Lavori oltre 3 m senza piattaforma aerea.', pt: 'Trabalhos acima de 3 m sem plataforma elevatória.' },
      { es: 'Limpieza de tejados y superficies frágiles de fibrocemento.', en: 'Roof tile washing and delicate fiber-cement materials.', de: 'Reinigung von Dachziegeln und brüchigem Faserzement.', fr: 'Nettoyage de toitures et plaques de fibrociment fragiles.', it: 'Pulizia tetti e superfici fragili in fibrocemento.', pt: 'Limpeza de telhados e superfícies frágeis de fibrocimento.' },
      { es: 'Pintura, revoque, sellado estructural y obra.', en: 'Repainting, wall rendering, plaster repairs, or construction.', de: 'Malerarbeiten, Verputzen und bauliche Sanierungen.', fr: 'Peinture, crépis, rejointoiement et maçonnerie.', it: 'Pittura, intonaco, sigillatura e opere edili.', pt: 'Pintura, reboco, selagem estrutural e obras.' }
    ]
  },
  'car-detailing': {
    id: 'car-detailing',
    title: {
      es: 'Car Detailing Profesional',
      en: 'Professional Auto Detailing',
      de: 'Professionelle Fahrzeugaufbereitung',
      fr: 'Car Detailing Professionnel',
      it: 'Car Detailing Professionale',
      pt: 'Car Detailing Profissional'
    },
    subTitle: 'Fahrzeugaufbereitung',
    badge: {
      es: '🏎️ Acabado Showroom Móvil',
      en: '🏎️ Mobile Showroom Finish',
      de: '🏎️ Showroom-Finish vor Ort',
      fr: '🏎️ Finition Showroom mobile',
      it: '🏎️ Finitura Showroom Mobile',
      pt: '🏎️ Acabamento Showroom Móvel'
    },
    positioning: {
      es: 'Acabado de nivel showroom mediante lavado manual, descontaminación y protección. En sus instalaciones o en las nuestras.',
      en: 'Showroom-grade finish via hand wash, paint decontamination, and protection. At your location or our shop.',
      de: 'Showroom-Ergebnis durch Handwäsche, Dekontamination und Versiegelung. Bei Ihnen oder im Center.',
      fr: 'Finition niveau showroom par lavage main, décontamination et protection. Sur site o à l\'atelier.',
      it: 'Finitura showroom con lavaggio a mano, decontaminazione e protezione.',
      pt: 'Acabamento nível showroom com lavagem manual, desamassamento e proteção.'
    },
    guaranteeNote: {
      es: 'Cumplimiento normativo suizo: Lavado en zonas acondicionadas con separador de grasas y tratamiento de aguas.',
      en: 'Swiss Law Compliant: Washing executed only in designated areas with oil separators and eco drain collection.',
      de: 'Schweizer Gesetzgebung: Wäsche nur mit Ölabscheider und konformer Abwasserentsorgung.',
      fr: 'Conforme à la loi suisse: Lavage uniquement sur aire équipée d\'un séparateur d\'hydrocarbures.',
      it: 'Conforme alla normativa svizzera sul lavaggio veicoli.',
      pt: 'Conformidade com a legislação suíça de lavagem de veículos.'
    },
    sections: [
      {
        title: { es: 'LAVADO EXTERIOR Y DECONTAMINACIÓN', en: 'EXTERIOR WASH & DECONTAMINATION', de: 'AUSSENWÄSCHE & DEKONTAMINATION', fr: 'LAVAGE EXTÉRIEUR & DÉCONTAMINATION', it: 'LAVAGGIO ESTERNO E DECONTAMINAZIONE', pt: 'LAVAGEM EXTERIOR E DESCONTAMINAÇÃO' },
        items: [
          { text: { es: 'Prelavado con espuma activa y descontaminación química.', en: 'Active snow-foam pre-wash and iron/chemical decontamination.', de: 'Schaumvorwäsche und chemische Flugrostentfernung.', fr: 'Prélavage mousse active et décontamination chimique.', it: 'Prelavaggio schiuma attiva e decontaminazione chimica.', pt: 'Pré-lavagem com espuma ativa e descontaminação química.' } },
          { text: { es: 'Lavado manual con técnica de dos cubos y guante de microfibra.', en: 'Two-bucket hand wash technique using premium microfiber mitts.', de: 'Handwäsche mit 2-Eimer-Methode und Mikrofaser-Handschuh.', fr: 'Lavage à la main technique des deux seaux et gant microfibre.', it: 'Lavaggio a mano con tecnica due secchi e guanto microfibra.', pt: 'Lavagem manual com técnica de dois baldes e luva de microfibra.' } },
          { text: { es: 'Descontaminación de la pintura con clay bar.', en: 'Clay bar treatment for deep paint surface smoothness.', de: 'Lackreinigung mit Claybar (Reinigungsknete).', fr: 'Décontamination à la barre d\'argile (clay bar).', it: 'Decontaminazione carrozzeria con clay bar.', pt: 'Descontaminação da pintura com clay bar.' } },
          { text: { es: 'Limpieza y sellado de llantas y pasos de rueda.', en: 'Deep wheel rim cleaning and arch wheel-well dressing.', de: 'Felgenreinigung und Radhauspflege.', fr: 'Nettoyage des jantes et passages de roues.', it: 'Pulizia e sigillatura cerchi e passaruota.', pt: 'Limpeza e selagem de jantes e cavas das rodas.' } },
          { text: { es: 'Secado con microfibra y aire a presión sin contacto.', en: 'Touchless air blower drying and plush towel buffing.', de: 'Berührungsloses Trocknen mit Druckluft & Mikrofasertuch.', fr: 'Séchage microfibre et souffleur d\'air chaud sans contact.', it: 'Asciugatura microfibra e aria a pressione.', pt: 'Secagem com microfibra e ar a pressão.' } }
        ]
      },
      {
        title: { es: 'INTERIOR Y TAPICERÍA', en: 'INTERIOR & UPHOLSTERY', de: 'INNENRAUM & POLSTER', fr: 'INTÉRIEUR & CELLULOSE', it: 'INTERNO E TAPPEZZERIA', pt: 'INTERIOR E ESTOFOS' },
        items: [
          { text: { es: 'Aspirado completo del habitáculo, el maletero y la zona bajo los asientos.', en: 'Full cabin, trunk, and under-seat deep vacuuming.', de: 'Gründliches Ausstaugen von Innenraum, Kofferraum und Sitzbereichen.', fr: 'Aspiration complète de l\'habitacle, du coffre et sous les sièges.', it: 'Aspirazione completa di abitacolo, bagagliaio e sotto-sedili.', pt: 'Aspirar o habitáculo, mala e zona debaixo dos bancos.' } },
          { text: { es: 'Limpieza de salpicadero, consolas y plásticos con producto neutro.', en: 'Dashboard, console, and plastic interior wipe down with UV neutral care.', de: 'Armaturenbrett-, Konsolen- and Kunststoffpflege (UV-Schutz).', fr: 'Nettoyage du tableau de bord, consoles et plastiques.', it: 'Pulizia cruscotto, console e plastiche.', pt: 'Limpeza do tablier, consolas e plásticos.' } },
          { text: { es: 'Limpieza de cristales por dentro sin residuo ni marcas.', en: 'Streak-free interior glass and mirror cleaning.', de: 'Streifenfreie Innenglasreinigung.', fr: 'Nettoyage des vitres intérieures sans traces.', it: 'Pulizia vetri interni senza aloni.', pt: 'Limpeza dos vidros por dentro sem marcas.' } },
          { text: { es: 'Limpieza y nutrición del cuero o extracción húmeda en tapicería textil.', en: 'Leather cleaning & conditioning or wet extraction carpet clean.', de: 'Lederpflege & Konditionierung oder Nass-Extraktion von Stoffen.', fr: 'Soin du cuir ou shampouinage extraction des sièges en tissu.', it: 'Pulizia e nutrimento pelle o lavaggio tessuti.', pt: 'Limpeza e nutrição do couro ou extração de estofos.' } }
        ]
      }
    ],
    exclusions: [
      { es: 'Corrección de pintura multi-fase y eliminación de arañazos profundos.', en: 'Multi-stage paint correction and deep scratch wet-sanding.', de: 'Mehrstufige Lackkorrektur und Tiefe-Kratzer-Politur.', fr: 'Correction de peinture multi-passes et ponçage de rayures profondes.', it: 'Correzione vernice multi-stadio e graffi profondi.', pt: 'Correção de pintura multi-fase e remoção de riscos profundos.' },
      { es: 'Reparación de abolladuras, cristales, ópticas y carrocería.', en: 'DDT dent removal, glass replacement, or body repair.', de: 'Ausbeulen, Scheibenwechsel oder Spenglerarbeiten.', fr: 'Débosselage, remplacement de vitres ou travaux de carrosserie.', it: 'Riparazione ammaccature o carrozzeria.', pt: 'Reparação de mossa, vidros e chapa.' },
      { es: 'Lavado en vía pública sobre suelo sin conexión a depuradora (Prohibido en Suiza).', en: 'Street washing on uncollected drains (Illegal under Swiss law).', de: 'Wäsche auf öffentlicher Strasse ohne Ölabscheider (in CH verboten).', fr: 'Lavage sur voie publique sans bac de rétention (Interdit en Suisse).', it: 'Lavaggio su strada pubblica senza depuratore.', pt: 'Lavagem em via pública sem depurador (Proibido na Suíça).' }
    ]
  },
  'pest-control': {
    id: 'pest-control',
    title: {
      es: 'Control de Plagas y Fumigación',
      en: 'Pest Control & Extermination',
      de: 'Schädlingsbekämpfung & Schädlingsprävention',
      fr: 'Lutte Anti-Nuisibles & Dératisation',
      it: 'Disinfestazione e Controllo Parassiti',
      pt: 'Controlo de Pragas e Desinfestação'
    },
    subTitle: 'Schädlingsbekämpfung',
    badge: {
      es: '🛡️ Intervención Discreta con Licencia Federal',
      en: '🛡️ Discrete Intervention with Federal License',
      de: '🛡️ Diskreter Einsatz mit Fachbewilligung (VNP)',
      fr: '🛡️ Intervention discrète avec autorisation fédérale',
      it: '🛡️ Intervento Discreto con Licenza Federale',
      pt: '🛡️ Intervenção Discreta com Licença Federal'
    },
    positioning: {
      es: 'Diagnóstico, tratamiento autorizado y prevención. Intervención discreta, sin vehículos rotulados ni señalización visible.',
      en: 'Diagnosis, certified treatment, and prevention. Discreet intervention in unmarked vehicles.',
      de: 'Diagnose, fachbewilligte Behandlung & Prävention. Diskreter Einsatz in unbeschrifteten Fahrzeugen.',
      fr: 'Diagnostic, traitement certifié et prévention. Intervention discrète en véhicules neutres.',
      it: 'Diagnosi, trattamento autorizzato e prevenzione. Intervento discreto con veicoli neutri.',
      pt: 'Diagnóstico, tratamento autorizado e prevenção. Intervenção discreta em veículos neutros.'
    },
    guaranteeNote: {
      es: 'Seguridad certificada: Uso exclusivo de biocidas homologados en Suiza y técnicos con Autorización Federal (Fachbewilligung).',
      en: 'Certified safety: Exclusively Swiss-approved biocides applied by federally authorized technicians.',
      de: 'Zertifizierte Sicherheit: Nur in der Schweiz zugelassene Biozide und Techniker mit Fachbewilligung.',
      fr: 'Sécurité certifiée: Biocides homologués en Suisse et techniciens titulaires du permis fédéral.',
      it: 'Sicurezza certificata: Biocidi omologati in Svizzera e tecnici con licenza federale.',
      pt: 'Segurança certificada: Biocidas homologados na Suíça e técnicos com licença federal.'
    },
    sections: [
      {
        title: { es: 'INSPECCIÓN Y DIAGNÓSTICO', en: 'INSPECTION & DIAGNOSIS', de: 'INSPEKTION & DIAGNOSE', fr: 'INSPECTION & DIAGNOSTIC', it: 'ISPEZIONE E DIAGNOSI', pt: 'INSPECÇÃO E DIAGNÓSTICO' },
        items: [
          { text: { es: 'Visita de inspección con identificación exacta de la especie.', en: 'Inspection visit with exact biological species identification.', de: 'Inspektionsbesuch mit genauer Bestimmung der Schädlingsart.', fr: 'Visite d\'inspection avec identification exacte de l\'espèce.', it: 'Ispezione con identificazione esatta della specie.', pt: 'Visita de inspecção com identificação exata da espécie.' } },
          { text: { es: 'Localización de nidos, focos y vías de entrada.', en: 'Locating nests, harborages, and structural entry points.', de: 'Ortung von Nestern, Herden und Einfallstoren.', fr: 'Localisation des nids, foyers et voies d\'entrée.', it: 'Localizzazione nidi, focolai e punti d\'accesso.', pt: 'Localização de ninhos, focos e vias de entrada.' } },
          { text: { es: 'Evaluación del nivel de infestación con informe escrito.', en: 'Infestation severity rating with written audit report.', de: 'Beurteilung des Befallsgrads mit schriftlichem Bericht.', fr: 'Évaluation de l\'infestation avec rapport écrit.', it: 'Valutazione del livello di infestazione con report.', pt: 'Avaliação do nível de infestação com relatório escrito.' } },
          { text: { es: 'Colocación de trampas de monitorización cuando sea necesario.', en: 'Deploying non-toxic monitoring traps where required.', de: 'Aufstellen von Monitoring-Fallen nach Bedarf.', fr: 'Pose de pièges de contrôle si nécessaire.', it: 'Posizionamento trappole di monitoraggio.', pt: 'Colocação de armadilhas de monitorização.' } }
        ]
      },
      {
        title: { es: 'TRATAMIENTO Y SEGUIMIENTO', en: 'TREATMENT & FOLLOW-UP', de: 'BEHANDLUNG & NACHKONTROLLE', fr: 'TRAITEMENT & SUIVI', it: 'TRATTAMENTO E MONITORAGGIO', pt: 'TRATAMENTO E SEGUIMENTO' },
        items: [
          { text: { es: 'Plan de tratamiento adaptado a la especie y presencia de niños/mascotas.', en: 'Custom treatment plan safe around children and household pets.', de: 'Auf Art und Haushalt (Kinder/Haustiere) abgestimmter Behandlungsplan.', fr: 'Plan de traitement adapté aux enfants et animaux domestiques.', it: 'Piano di trattamento sicuro per bambini e animali.', pt: 'Plano de tratamento adaptado a crianças e animais.' } },
          { text: { es: 'Aplicación realizada por técnico con autorización federal (Fachbewilligung).', en: 'Application executed by federally licensed pest management technician.', de: 'Ausführung durch Fachexperten mit eidgenössischer Fachbewilligung.', fr: 'Application par un technicien titulaire du permis fédéral.', it: 'Applicazione da parte di tecnico abilitato con licenza federale.', pt: 'Aplicação por técnico com licença federal.' } },
          { text: { es: 'Visita de control incluida entre 2 y 4 semanas después.', en: 'Follow-up control visit included within 2 to 4 weeks.', de: 'Inkludierte Nachkontrolle 2 bis 4 Wochen nach der Erstbehandlung.', fr: 'Visite de contrôle incluse sous 2 à 4 semaines.', it: 'Visita di controllo inclusa tra 2 e 4 settimane.', pt: 'Visita de controlo incluída entre 2 a 4 semanas.' } },
          { text: { es: 'Confidencialidad total frente a vecinos y comunidad.', en: 'Complete confidentiality with unmarked staff attire and vehicles.', de: 'Absolute Diskretion gegenüber Nachbarn und Vermietern.', fr: 'Confidentialité totale vis-à-vis du voisinage.', it: 'Massima riservatezza nei confronti dei vicini.', pt: 'Confidencialidade total perante vizinhos.' } }
        ]
      }
    ],
    exclusions: [
      { es: 'Especies protegidas por legislación suiza (murciélagos, golondrinas, avispones asiáticos).', en: 'Protected wildlife under Swiss conservation laws (bats, swallows, protected hornets).', de: 'Eidgenössisch geschützte Arten (Fledermäuse, Schwalben etc.).', fr: 'Espèces protégées par la loi suisse (chauves-souris, hirondelles).', it: 'Specie protette dalla legge svizzera (pipistrelli, rondini).', pt: 'Espécies protegidas pela lei suíça (morcegos, andorinhas).' },
      { es: 'Fumigación con gas en edificios enteros.', en: 'Building-wide toxic gas fumigation.', de: 'Gaszelt-Fumigation ganzer Gebäudekomplexe.', fr: 'Fumigation au gaz de bâtiments entiers.', it: 'Fumigazione a gas di interi edifici.', pt: 'Fumigação com gás de edifícios inteiros.' },
      { es: 'Reparación de daños estructurales provocados por xilófagos o roedores.', en: 'Structural wood timber replacement or heavy drywall construction repair.', de: 'Beseitigung baulicher Holz- und Substanzschäden durch Schädlinge.', fr: 'Réparation de dégâts structurels causés par les termites ou rongeurs.', it: 'Riparazione danni strutturali causati da parassiti del legno.', pt: 'Reparação de danos estruturais provocados por pragas.' }
    ]
  },
  'waste-management': {
    id: 'waste-management',
    title: {
      es: 'Eliminación y Desalojo',
      en: 'House Clearance & Waste Disposal',
      de: 'Entrümpelung & Fachgerechte Entsorgung',
      fr: 'Débarras & Évacuation de Déchets',
      it: 'Sgombero e Smaltimento Rifiuti',
      pt: 'Despejo e Remoção de Resíduos'
    },
    subTitle: 'Entrümpelung & Entsorgung',
    badge: {
      es: '📜 Certificado de Reciclaje Oficial Suizo',
      en: '📜 Official Swiss Recycling Certificate',
      de: '📜 Offizieller Schweizer Entsorgungsnachweis',
      fr: '📜 Certificat officiel de recyclage suisse',
      it: '📜 Certificato Ufficiale di Smaltimento Svizzero',
      pt: '📜 Certificado Oficial de Reciclagem Suíço'
    },
    positioning: {
      es: 'Vaciado completo con separación, reciclaje y certificado. Precio cerrado por escrito antes de empezar.',
      en: 'Full house clearance with sorting, eco recycling, and waste certificate. Fixed binding quote before starting.',
      de: 'Kompletträumung mit Mülltrennung, Recycling und Nachweis. Verbindlicher Festpreis vor Arbeitsbeginn.',
      fr: 'Débarras complet avec tri sélectif, recyclage et attestation. Prix ferme par écrit avant démarrage.',
      it: 'Sgombero completo con separazione, riciclaggio e certificato. Prezzo fisso prima di iniziare.',
      pt: 'Esvaziamento completo com separação, reciclagem e certificado. Preço fixo antes de começar.'
    },
    guaranteeNote: {
      es: 'Garantía Besenrein: Entrega de los espacios completamente vacíos y barridos a escoba.',
      en: 'Swept-Clean Guarantee: Premises handed over completely clear and broom-swept clean.',
      de: 'Besenrein-Garantie: Übergabe der Räume komplett geräumt und besenrein.',
      fr: 'Garantie Propre à la Balayette: Locaux remis totalement vides et balayés.',
      it: 'Garanzia Pulito a Scoba: Consegna locali completamente vuoti e spazzati.',
      pt: 'Garantia Limpo a Vassoura: Entrega dos espaços totalmente vazios e varridos.'
    },
    sections: [
      {
        title: { es: 'VACIADO Y DESMONTAJE', en: 'CLEARANCE & DISASSEMBLY', de: 'RÄUMUNG & DEMONTAGE', fr: 'DÉBARRAS & DÉMONTAGE', it: 'SGOMBERO E SMONTAGGIO', pt: 'ESVAZIAMENTO E DESMONTAGEM' },
        items: [
          { text: { es: 'Vaciado completo de viviendas, sótanos, desvanes, garajes y trasteros.', en: 'Full clearance of flats, cellars, attics, garages, and storage rooms.', de: 'Räumung von Wohnungen, Kellern, Estrichen, Garagen und Lagern.', fr: 'Débarras complet d\'appartements, caves, greniers, garages et réduits.', it: 'Sgombero completo di appartamenti, cantine, soffitte, garage e solai.', pt: 'Esvaziamento completo de habitações, caves, sótãos e garagens.' } },
          { text: { es: 'Desmontaje de muebles, armarios empotrados y estanterías.', en: 'Dismantling heavy furniture, wall units, and shelving systems.', de: 'Demontage von Möbeln, Einbauschränken und Regalen.', fr: 'Démontage des meubles, placards encastrés et étagères.', it: 'Smontaggio di mobili, armadi a muro e scaffalature.', pt: 'Desmontagem de móveis, armários embutidos e estantes.' } },
          { text: { es: 'Retirada de alfombras, cortinas, lámparas y textiles.', en: 'Removal of old carpets, drapes, ceiling fixtures, and textiles.', de: 'Entfernung von Teppichen, Vorhängen, Lampen und Textilien.', fr: 'Évacuation de moquettes, rideaux, luminaires et textiles.', it: 'Rimozione moquette, tende, lampadari e tessili.', pt: 'Remoção de alcatifas, cortinados, candeeiros e têxteis.' } },
          { text: { es: 'Barrido final y entrega en estado besenrein (limpio de escoba).', en: 'Final broom sweeping and handover in "besenrein" state.', de: 'Abschliessendes Auskehren und besenreine Übergabe.', fr: 'Balayage final et remise en état propre à la balayette (besenrein).', it: 'Spazzamento finale e consegna in stato "besenrein".', pt: 'Varredura final e entrega em estado limpo a vassoura.' } }
        ]
      },
      {
        title: { es: 'SEPARACIÓN Y RECICLAJE', en: 'SORTING & RECYCLING', de: 'TRENNUNG & RECYCLING', fr: 'TRI & RECYCLAGE', it: 'SEPARAZIONE E RICICLAGGIO', pt: 'SEPARAÇÃO E RECICLAGEM' },
        items: [
          { text: { es: 'Separación por fracciones: madera, metal, electrónica, textil y voluminosos.', en: 'Sorting into material fractions: wood, metal, e-waste, fabrics, bulky waste.', de: 'Mülltrennung nach Holz, Metall, Elektronik, Textilien und Sperrmüll.', fr: 'Tri par filières: bois, métal, DEEE, textile et encombrants.', it: 'Separazione per frazioni: legno, metallo, RAEE, tessili e ingombranti.', pt: 'Separação por categorias: madeira, metal, eletrónica e volumosos.' } },
          { text: { es: 'Entrega en puntos de reciclaje autorizados con justificante.', en: 'Disposal at Swiss municipal certified recycling centers with manifest.', de: 'Abgabe bei offiziellen Schweizer Recyclinghöfen mit Beleg.', fr: 'Dépôt en déchetterie agréée avec bordereau de suivi.', it: 'Conferimento in centri di riciclaggio autorizzati con ricevuta.', pt: 'Entrega em centros de reciclagem autorizados com comprovativo.' } },
          { text: { es: 'Donación de objetos en buen estado a entidades sociales locales.', en: 'Donation of re-usable items to local Swiss social charities.', de: 'Weitergabe gut erhaltener Gegenstände an gemeinnützige Organisationen.', fr: 'Don d\'objets en bon état à des associations caritatives locales.', it: 'Donazione di oggetti riutilizzabili a enti benefici locali.', pt: 'Doação de objetos em bom estado a instituições sociais locais.' } },
          { text: { es: 'Búsqueda y entrega de documentos u objetos personales encontrados.', en: 'Safekeeping and return of discovered personal records, photos, or valuables.', de: 'Sicherung und Aushändigung vorgefundener persönlicher Dokumente.', fr: 'Mise de côté et restitution des documents et souvenirs personnels.', it: 'Parente e consegna di documenti personali o ricordi trovati.', pt: 'Separação e entrega de documentos ou fotos pessoais encontrados.' } }
        ]
      }
    ],
    exclusions: [
      { es: 'Residuos peligrosos especiales (amianto, aceites, químicos, bombonas).', en: 'Hazardous toxic waste (asbestos, oils, lab chemicals, gas cylinders).', de: 'Sonderabfälle (Asbest, Chemikalien, Altöl, Gasflaschen).', fr: 'Déchets dangereux spéciaux (amiante, huiles, produits chimiques, gaz).', it: 'Rifiuti speciali pericolosi (amianto, oli, sostanze chimiche, bombole).', pt: 'Resíduos perigosos especiais (amianto, óleos, químicos, botijas de gás).' },
      { es: 'Vehículos con motor, neumáticos y depósitos de combustible.', en: 'Motorized vehicles, car tires, and fuel storage tanks.', de: 'Kraftfahrzeuge, Autoreifen und Öltanks.', fr: 'Véhicules à moteur, pneus et cuves à fioul.', it: 'Veicoli a motore, pneumatici e cisterne di carburante.', pt: 'Veículos a motor, pneus e depósitos de combustível.' },
      { es: 'Demolición estructural u obra mayor.', en: 'Structural building demolition or heavy wall masonry knocking.', de: 'Abbrucharbeiten und bauliche Abrissarbeiten.', fr: 'Démolition de structures et gros œuvre.', it: 'Demolizione strutturale e opere murarie.', pt: 'Demolição estrutural ou grandes obras.' }
    ]
  },
  'gutter-cleaning': {
    id: 'gutter-cleaning',
    title: {
      es: 'Limpieza e Inspección de Canalones',
      en: 'Gutter Cleaning & Inspection',
      de: 'Dachrinnenreinigung & Inspektion',
      fr: 'Nettoyage & Inspection de Gouttières',
      it: 'Pulizia e Ispezione Grondaie',
      pt: 'Limpeza e Inspeção de Caleiras'
    },
    subTitle: 'Dachrinnenreinigung',
    badge: {
      es: '📸 Reporte Fotográfico Antes/Después',
      en: '📸 Before/After Photo Report',
      de: '📸 Vorher/Nachher Fotobericht',
      fr: '📸 Rapport photo Avant/Après',
      it: '📸 Report Fotografico Prima/Dopo',
      pt: '📸 Relatório Fotográfico Antes/Depois'
    },
    positioning: {
      es: 'Prevención de daños por agua antes del invierno. Con inspección documentada e informe fotográfico.',
      en: 'Water damage prevention before winter freezes. With documented inspection and photo report.',
      de: 'Schutz vor Wasserschäden vor dem Winter. Mit dokumentierter Inspektion und Fotobericht.',
      fr: 'Prévention des infiltrations d\'eau avant l\'hiver. Avec inspection et rapport photos.',
      it: 'Prevenzione danni da infiltrazioni prima dell\'inverno. Con ispezione e report fotografico.',
      pt: 'Prevenção de danos por água antes do inverno. Com inspeção e relatório fotográfico.'
    },
    guaranteeNote: {
      es: 'Frecuencia recomendada: Una intervención en otoño (octubre-noviembre) antes de heladas, y una segunda en primavera.',
      en: 'Recommended Frequency: Autumn service (Oct-Nov) before frost, plus spring check if nearby pine/birch trees.',
      de: 'Empfohlene Frequenz: Einmal im Herbst (Okt-Nov) vor dem Frost, zweite im Frühjahr bei Baumbestand.',
      fr: 'Fréquence recommandée: En automne (octobre-novembre) avant le gel, et au printemps si arbres à proximité.',
      it: 'Frequenza consigliata: Un intervento in autunno prima delle gelate, e un secondo in primavera.',
      pt: 'Frequência recomendada: Uma intervenção no outono (outubro-novembro) e outra na primavera.'
    },
    sections: [
      {
        title: { es: 'INSPECCIÓN Y LIMPIEZA', en: 'INSPECTION & CLEARING', de: 'INSPEKTION & REINIGUNG', fr: 'INSPECTION & NETTOYAGE', it: 'ISPEZIONE E PULIZIA', pt: 'INSPECÇÃO E LIMPEZA' },
        items: [
          { text: { es: 'Revisión del estado de canalones, bajantes y fijaciones.', en: 'Inspection of gutter slope, downspouts, and mounting brackets.', de: 'Prüfung von Dachrinnengefälle, Fallrohren und Halterungen.', fr: 'Contrôle de la pente, des descentes et des fixations.', it: 'Controllo pendenza grondaie, pluviali e fissaggi.', pt: 'Revisão do estado de caleiras, tubos e fixações.' } },
          { text: { es: 'Retirada manual de hojas, musgo, lodo y nidos vacíos.', en: 'Manual removal of leaves, moss, sludge, and bird debris.', de: 'Manuelle Entfernung von Laub, Moos, Schlamm und Nestern.', fr: 'Élimination manuelle des feuilles, mousse, boue et débris.', it: 'Rimozione manuale di foglie, muschio, fango e detriti.', pt: 'Remoção manual de folhas, musgo, lama e ninhos.' } },
          { text: { es: 'Aclarado a presión controlada de todo el recorrido.', en: 'Controlled pressure flushing of entire gutter run.', de: 'Druckspülung des gesamten Rinnenverlaufs.', fr: 'Rinçage sous pression contrôlée de tout le parcours.', it: 'Lavaggio a pressione controllata dell\'intero percorso.', pt: 'Lavagem a pressão controlada de todo o percurso.' } },
          { text: { es: 'Desatasco de bajantes y comprobación de evacuación.', en: 'Unblocking downspouts and testing water drainage flow.', de: 'Entstopfung der Fallrohre und Abflusstest.', fr: 'Débouchage des descentes et test d\'évacuation d\'eau.', it: 'Disostruzione pluviali e verifica scorrimento acqua.', pt: 'Desobstrução de tubos e teste de escoamento.' } },
          { text: { es: 'Informe fotográfico del antes y el después de cada tramo.', en: 'Before & After high-definition photo documentation report.', de: 'Vorher/Nachher-Fotodokumentation jedes Abschnitts.', fr: 'Rapport photo HD avant/après sur chaque tronçon.', it: 'Report fotografico prima/dopo di ogni tratto.', pt: 'Relatório fotográfico antes/depois de cada trecho.' } }
        ]
      }
    ],
    exclusions: [
      { es: 'Reparación de hojalatería o sustitución completa de tramos de zinc/cobre.', en: 'Sheet metal replacement or copper/zinc gutter structural replacement.', de: 'Spenglerarbeiten oder Erneuerung von Rinnenabschnitten.', fr: 'Travaux de zinguerie lourde ou remplacement de gouttières.', it: 'Opere di lattoneria o sostituzione grondaie in rame/zinco.', pt: 'Substituição estrutural de caleiras em zinco/cobre.' },
      { es: 'Trabajos sobre tejados sin puntos de anclaje de seguridad homologados.', en: 'Roofs lacking certified safety anchor points or fragile roofing tiles.', de: 'Dächer ohne zertifizierte Anschlagpunkte oder mit brüchiger Eindeckung.', fr: 'Toits dépourvus d\'ancrages de sécurité homologués.', it: 'Tetti privi di punti di ancoraggio omologati.', pt: 'Telhados sem pontos de ancoragem de segurança.' },
      { es: 'Intervenciones durante condiciones meteorológicas de viento > 40 km/h o heladas.', en: 'Work during high wind conditions (> 40 km/h), heavy snow, or freezing ice.', de: 'Einsätze bei Sturm (> 40 km/h), Eis oder starkem Schneefall.', fr: 'Interventions par vent fort (> 40 km/h), verglas ou neige.', it: 'Interventi con vento forte (> 40 km/h) o ghiaccio.', pt: 'Intervenções com vento forte (> 40 km/h) ou gelo.' }
    ]
  }
};

export const DIFFERENTIATION_MATRIX_DATA: MatrixRow[] = [
  {
    dimension: { es: 'Estado de la vivienda', en: 'Property condition', de: 'Zustand der Wohnung', fr: 'État du logement', it: 'Stato dell\'immobile', pt: 'Estado da habitação' },
    eot: { es: 'Vacía (sin muebles)', en: 'Empty (unfurnished)', de: 'Leer (ohne Möbel)', fr: 'Vide (sans meubles)', it: 'Vuoto (senza mobili)', pt: 'Vazio (sem móveis)' },
    deep: { es: 'Habitada', en: 'Inhabited / Furnished', de: 'Bewohnt (möbliert)', fr: 'Habité (meublé)', it: 'Abitato (arredato)', pt: 'Habitado (mobilado)' },
    recurrent: { es: 'Habitada', en: 'Inhabited / Furnished', de: 'Bewohnt (möbliert)', fr: 'Habité (meublé)', it: 'Abitato (arredato)', pt: 'Habitado (mobilado)' },
    moving: { es: 'Habitada / En mudanza', en: 'Moving process', de: 'Auszug / Umzug', fr: 'En cours de déménagement', it: 'In fase di trasloco', pt: 'Em processo de mudança' }
  },
  {
    dimension: { es: 'Objetivo principal', en: 'Primary goal', de: 'Hauptziel', fr: 'Objectif principal', it: 'Obiettivo principale', pt: 'Objetivo principal' },
    eot: { es: 'Pasar la entrega ante gérance', en: 'Pass tenancy handover', de: 'Wohnungsabgabe bestehen', fr: 'Réussir l\'état des lieux', it: 'Superare consegna chiavi', pt: 'Passar a entrega de chaves' },
    deep: { es: 'Reiniciar el estado de higiene', en: 'Reset cleanliness standard', de: 'Gründlicher Frische-Reset', fr: 'Remise a nivel hygiène', it: 'Reset igienico profondo', pt: 'Reinício de higiene profunda' },
    recurrent: { es: 'Mantener el estado actual', en: 'Maintain cleanliness level', de: 'Sauberkeit aufrechterhalten', fr: 'Maintenir la propreté', it: 'Mantenere il livello', pt: 'Manter a limpeza diária' },
    moving: { es: 'Trasladar mobiliario seguro', en: 'Safe furniture relocation', de: 'Sicherer Möbeltransport', fr: 'Transfert sécurisé de biens', it: 'Trasporto mobili sicuro', pt: 'Transporte seguro de bens' }
  },
  {
    dimension: { es: 'Interior de armarios', en: 'Inside cupboards/drawers', de: 'Schrankinnenräume', fr: 'Intérieur des armoires', it: 'Interno armadi', pt: 'Interior de armários' },
    eot: { es: 'Sí, todos incluidos', en: 'Yes, fully included', de: 'Ja, komplett inklusive', fr: 'Oui, totalement inclus', it: 'Sì, tutti inclusi', pt: 'Sim, totalmente incluído' },
    deep: { es: 'No (salvo vacíos)', en: 'No (unless emptied)', de: 'Nein (ausser leere)', fr: 'Non (sauf si vides)', it: 'No (salvo se vuoti)', pt: 'Não (salvo se vazios)' },
    recurrent: { es: 'No', en: 'No', de: 'Nein', fr: 'Non', it: 'No', pt: 'Não' },
    moving: { es: '— (No aplica)', en: '— (N/A)', de: '— (Entfällt)', fr: '— (N/A)', it: '— (N/A)', pt: '— (N/A)' }
  },
  {
    dimension: { es: 'Interior de horno y nevera', en: 'Oven & fridge interior', de: 'Backofen & Kühlschrank innen', fr: 'Intérieur four & frigo', it: 'Interno forno e frigo', pt: 'Interior forno e frigo' },
    eot: { es: 'Sí, incluidos', en: 'Yes, fully included', de: 'Ja, inklusive', fr: 'Oui, inclus', it: 'Sì, inclusi', pt: 'Sim, incluídos' },
    deep: { es: 'Complemento opcional', en: 'Optional add-on', de: 'Zusatzoption', fr: 'Option complémentaire', it: 'Opzione extra', pt: 'Opção extra' },
    recurrent: { es: 'No', en: 'No', de: 'Nein', fr: 'Non', it: 'No', pt: 'Não' },
    moving: { es: '— (No aplica)', en: '— (N/A)', de: '— (Entfällt)', fr: '— (N/A)', it: '— (N/A)', pt: '— (N/A)' }
  },
  {
    dimension: { es: 'Eliminación de cal incrustada', en: 'Heavy limescale removal', de: 'Hartnäckige Entkalkung', fr: 'Détartrage incrusté', it: 'Decalcificazione ostinata', pt: 'Descalcificação profunda' },
    eot: { es: 'Eliminación total', en: 'Full total removal', de: 'Vollständige Entfernung', fr: 'Élimination totale', it: 'Rimozione totale', pt: 'Remoção total' },
    deep: { es: 'Eliminación intensiva', en: 'Intensive removal', de: 'Intensive Entkalkung', fr: 'Détartrage intensif', it: 'Trattamento intensivo', pt: 'Descalcificação intensiva' },
    recurrent: { es: 'Mantenimiento ligero', en: 'Light touch maintenance', de: 'Leichte Unterhaltspflege', fr: 'Entretien léger', it: 'Manutenzione leggera', pt: 'Manutenção superficial' },
    moving: { es: '— (No aplica)', en: '— (N/A)', de: '— (Entfällt)', fr: '— (N/A)', it: '— (N/A)', pt: '— (N/A)' }
  },
  {
    dimension: { es: 'Limpieza de ventanas', en: 'Window cleaning', de: 'Fensterreinigung', fr: 'Vitres & fenêtres', it: 'Pulizia finestre', pt: 'Limpeza de janelas' },
    eot: { es: 'Incluidas (ambas caras)', en: 'Included (both sides)', de: 'Inklusive (beide Seiten)', fr: 'Incluses (2 faces)', it: 'Incluse (entrambi i lati)', pt: 'Incluídas (ambas as faces)' },
    deep: { es: 'Complemento opcional', en: 'Optional add-on', de: 'Zusatzoption', fr: 'Option complémentaire', it: 'Opzione extra', pt: 'Opção extra' },
    recurrent: { es: 'No', en: 'No', de: 'Nein', fr: 'Non', it: 'No', pt: 'Não' },
    moving: { es: '— (No aplica)', en: '— (N/A)', de: '— (Entfällt)', fr: '— (N/A)', it: '— (N/A)', pt: '— (N/A)' }
  },
  {
    dimension: { es: 'Garantía de aceptación', en: 'Handover guarantee', de: 'Abnahmegarantie', fr: 'Garantie de remise', it: 'Garanzia di consegna', pt: 'Garantia de aceitação' },
    eot: { es: 'Sí (100% Garantizada)', en: 'Yes (100% Guaranteed)', de: 'Ja (100% Abnahmegarantie)', fr: 'Oui (100% Garantie)', it: 'Sì (100% Garantita)', pt: 'Sim (100% Garantida)' },
    deep: { es: 'No', en: 'No', de: 'Nein', fr: 'Non', it: 'No', pt: 'Não' },
    recurrent: { es: 'No', en: 'No', de: 'Nein', fr: 'Non', it: 'No', pt: 'Não' },
    moving: { es: 'Garantía de transporte', en: 'Transport insurance', de: 'Transportversicherung', fr: 'Assurance transport', it: 'Assicurazione trasporto', pt: 'Seguro de transporte' }
  },
  {
    dimension: { es: 'Modelo de facturación', en: 'Billing model', de: 'Abrechnungsmodell', fr: 'Modèle de facturation', it: 'Modello di fatturazione', pt: 'Modelo de faturação' },
    eot: { es: 'Precio cerrado / Resultado', en: 'Fixed price / Result', de: 'Festpreis / Ergebnis', fr: 'Prix forfaitaire / Résultat', it: 'Prezzo fisso / Risultato', pt: 'Preço fixo / Resultado' },
    deep: { es: 'Por horas / Estimación', en: 'Hourly rate / Estimate', de: 'Stundenbasis / Schätzung', fr: 'Au tarif horaire / Estimé', it: 'Tariffa oraria / Stima', pt: 'Por hora / Estimativa' },
    recurrent: { es: 'Por horas / Franja fija', en: 'Hourly / Booked slot', de: 'Stundenbasis / Abo-Slot', fr: 'Au tarif horaire / Forfait', it: 'Tariffa oraria / Fissa', pt: 'Por hora / Bloco fixo' },
    moving: { es: 'Por volumen (m³) o tarifa', en: 'Volume m³ / Quote', de: 'Nach Volumen (m³) / Offerte', fr: 'Au volume (m³) / Devis', it: 'A volume (m³) / Tariffa', pt: 'Por volume (m³) / Orçamento' }
  },
  {
    dimension: { es: 'Frecuencia habitual', en: 'Typical frequency', de: 'Uebliche Frequenz', fr: 'Fréquence habituelle', it: 'Frequenza abituale', pt: 'Frequência habitual' },
    eot: { es: 'Una sola vez (Mudanza)', en: 'One-off (Moving out)', de: 'Einmalig (Umzug)', fr: 'Unique (Déménagement)', it: 'Una tantum (Trasloco)', pt: 'Única vez (Mudança)' },
    deep: { es: '1 a 2 veces al año', en: '1 to 2 times a year', de: '1-2 Mal pro Jahr', fr: '1 à 2 fois par an', it: '1-2 volte all\'anno', pt: '1 a 2 vezes por ano' },
    recurrent: { es: 'Semanal, quincenal, mensual', en: 'Weekly, bi-weekly, monthly', de: 'Wöchentlich, 14-tägig, monatlich', fr: 'Hebdomadaire, bimensuel, mensuel', it: 'Settimanale, quindicinale, mensile', pt: 'Semanal, quinzenal, mensal' },
    moving: { es: 'Puntual', en: 'One-off event', de: 'Punktuell', fr: 'Ponctuel', it: 'Puntuale', pt: 'Pontual' }
  }
];

export const MATRIX_SUMMARY_RULE = {
  es: '«Fin de contrato limpia lo que nadie ve. La limpieza profunda limpia lo que ya no se quita solo. La recurrente limpia lo que se ensucia cada semana.»',
  en: '“End of tenancy cleans what no one usually sees. Deep clean removes what won’t come off on its own. Regular clean manages what gets dirty every week.”',
  de: '«Die Umzugsreinigung reinigt, was sonst niemand sieht. Die Tiefenreinigung entfernt, was nicht von alleine weggeht. Die Unterhaltsreinigung pflegt, was wöchentlich verschmutzt.»',
  fr: '«Le fin de bail nettoie ce que personne ne voit. Le nettoyage en profondeur enlève ce qui ne part plus tout seul. Le nettoyage régulier entretient ce qui s\'encrasse chaque semaine.»',
  it: '«Fine locazione pulisce ciò che nessuno vede. La pulizia profonda rimuove lo sporco ostinato. La ricorrente mantiene la pulizia settimanale.»',
  pt: '«Fim de contrato limpa o que ninguém vê. A limpeza profunda limpa o que já não sai sozinho. A recorrente limpa o que se suja semanalmente.»'
};

export const EXTRAS_MASTER_DATA: Record<string, ExtraDetailInfo> = {
  balcony: {
    id: 'balcony',
    title: { es: 'Balcones y Terrazas', en: 'Balconies & Terraces', de: 'Balkone & Terrassen', fr: 'Balcons & Terrasses', it: 'Balconi e Terrazze', pt: 'Varandas e Terraços' },
    subTitle: { es: 'Suelo, barandilla y cristales', en: 'Floors, railings & glass', de: 'Boden, Geländer & Glas', fr: 'Sols, garde-corps & vitres', it: 'Pavimento, ringhiera e vetri', pt: 'Piso, varandim e vidros' },
    priceText: 'CHF 40.00',
    durationText: '+30 min',
    limit: { es: 'Hasta 10 m² por unidad', en: 'Up to 10 m² per unit', de: 'Bis zu 10 m² pro Einheit', fr: 'Jusqu\'à 10 m² par unité', it: 'Fino a 10 m² per unità', pt: 'Até 10 m² por unidade' },
    bullets: [
      { es: 'Barrido y fregado del suelo del balcón o la terraza.', en: 'Sweeping and mopping the balcony/terrace floor.', de: 'Fegen und Wischen des Balkon- oder Terrassenbodens.', fr: 'Balayage et lavage du sol du balcon/terrasse.', it: 'Spazzamento e lavaggio pavimento.', pt: 'Varredura e lavagem do piso da varanda/terraço.' },
      { es: 'Limpieza de la barandilla y del cristal de protección por ambas caras accesibles.', en: 'Wiping railings and glass balustrades on all accessible sides.', de: 'Reinigung von Geländern und Glasbrüstungen beidseitig zugänglich.', fr: 'Nettoyage des garde-corps et vitres de protection.', it: 'Pulizia ringhiera e vetri di protezione.', pt: 'Limpeza de varandim e vidros de proteção.' },
      { es: 'Limpieza del alféizar, el marco y la puerta corredera.', en: 'Wiping sills, threshold frame, and sliding door track.', de: 'Reinigung von Schwellen, Rahmen und Schiebetürführung.', fr: 'Nettoyage des rebords, encadrement et rail de porte.', it: 'Pulizia davanzali, telai e guida porta.', pt: 'Limpeza de peitoris, caixilho e calha da porta.' },
      { es: 'Retirada de hojas, telarañas y restos acumulados.', en: 'Clearing leaves, cobwebs, and accumulated debris.', de: 'Entfernung von Laub, Spinnweben und Ablagerungen.', fr: 'Élimination des feuilles, toiles d\'araignées et débris.', it: 'Rimozione foglie, ragnatele e detriti.', pt: 'Remoção de folhas, teias e resíduos.' }
    ]
  },
  storage: {
    id: 'storage',
    title: { es: 'Trastero / Garaje / Sótano', en: 'Storage / Garage / Cellar', de: 'Estrich / Keller / Garage', fr: 'Cave / Galetas / Garage', it: 'Cantina / Solaio / Garage', pt: 'Arrecadação / Garagem' },
    subTitle: { es: 'Barrido, polvo y estanterías vacías', en: 'Sweeping, dusting & empty shelves', de: 'Boden, Staub & leere Regale', fr: 'Balayage, dépoussiérage & étagères', it: 'Spazzamento, spolvero e scaffali', pt: 'Varredura, pó e prateleiras' },
    priceText: 'CHF 30.00',
    durationText: '+30 min',
    limit: { es: 'Hasta 15 m² (espacio despejado)', en: 'Up to 15 m² (cleared space)', de: 'Bis zu 15 m² (geräumte Fläche)', fr: 'Jusqu\'à 15 m² (espace dégagé)', it: 'Fino a 15 m² (spazio libero)', pt: 'Até 15 m² (espaço desimpedido)' },
    bullets: [
      { es: 'Barrido y aspirado completo del suelo.', en: 'Thorough floor sweeping and vacuuming.', de: 'Gründliches Fegen und Saugen des Bodens.', fr: 'Balayage et aspiration complète du sol.', it: 'Spazzamento e aspirazione pavimento.', pt: 'Varredura e aspiração do piso.' },
      { es: 'Eliminación de telarañas y polvo en paredes y techo accesible.', en: 'Removing cobwebs and dust from accessible walls/ceiling.', de: 'Spinnweben und Staub an Wänden und Decke entfernen.', fr: 'Élimination des toiles d\'araignées et poussière aux murs/plafond.', it: 'Rimozione ragnatele e spolvero pareti.', pt: 'Remoção de teias e pó em paredes e teto.' },
      { es: 'Limpieza exterior de estanterías y armarios vacíos.', en: 'Wiping down empty storage shelving and cabinets.', de: 'Abwischen von leeren Regalen und Lagerschränken.', fr: 'Nettoyage des étagères et armoires vides.', it: 'Pulizia scaffali e armadi vuoti.', pt: 'Limpeza de estantes e armários vazios.' },
      { es: 'Limpieza de la puerta, el marco y el interruptor.', en: 'Cleaning door, frame, handle, and light switch.', de: 'Reinigung von Tür, Rahmen, Klinke und Lichtschalter.', fr: 'Nettoyage de la porte, cadre, poignée et interrupteur.', it: 'Pulizia porta, telaio e interruttore.', pt: 'Limpeza da porta, caixilho e interruptor.' }
    ]
  },
  carpet: {
    id: 'carpet',
    title: { es: 'Limpieza de Alfombras', en: 'Carpet Deep Extraction Clean', de: 'Teppich-Sprühextraktion', fr: 'Shampouinage de Tapis', it: 'Pulizia Profonda Tappeti', pt: 'Limpeza Profunda de Tapetes' },
    subTitle: { es: 'Inyección-extracción con máquina profesional', en: 'Professional spray-extraction machine', de: 'Professionelle Sprühextraktion', fr: 'Injection-extraction professionnelle', it: 'Iniezione-estrazione professionale', pt: 'Injeção-extração profissional' },
    priceText: 'CHF 45.00',
    durationText: '+45 min',
    limit: { es: 'Hasta 12 m² o 1 alfombra grande por unidad', en: 'Up to 12 m² or 1 large carpet per unit', de: 'Bis zu 12 m² oder 1 grosser Teppich pro Einheit', fr: 'Jusqu\'à 12 m² ou 1 grand tapis par unité', it: 'Fino a 12 m² o 1 tappeto grande', pt: 'Até 12 m² ou 1 tapete grande' },
    bullets: [
      { es: 'Aspirado profundo en varias direcciones para levantar la fibra.', en: 'Multi-directional high-suction vacuuming to lift carpet pile.', de: 'Mehrseitiges Absaugen zum Aufrichten der Teppichfasern.', fr: 'Aspiration profonde dans toutes las directions.', it: 'Aspirazione profonda multi-direzionale.', pt: 'Aspiração profunda em várias direções.' },
      { es: 'Pretratamiento de manchas visibles según el tipo de fibra.', en: 'Targeted stain pre-treatment suited to fiber composition.', de: 'Gezielte Fleckenvorbehandlung je nach Faserart.', fr: 'Prétraitement ciblé des taches selon le type de fibre.', it: 'Pretrattamento macchie mirato.', pt: 'Pré-tratamento de manchas segundo a fibra.' },
      { es: 'Limpieza por inyección-extracción con máquina profesional.', en: 'Deep injection-extraction clean with eco detergent.', de: 'Sprühextraktionsreinigung mit Profi-Maschine.', fr: 'Nettoyage par injection-extraction à la machine.', it: 'Iniezione-estrazione con macchina professionale.', pt: 'Limpeza por injeção-extração mecânica.' },
      { es: 'Extracción del agua residual hasta dejar la fibra húmeda al tacto.', en: 'High water recovery leaving fiber damp with 3-5h drying time.', de: 'Maximale Absaugung des Schmutzwassers (Trocknungszeit 3-5h).', fr: 'Extraction de l\'eau usée pour séchage rapide (3-5h).', it: 'Estrazione acqua residua (asciugatura 3-5 ore).', pt: 'Extração de água para secagem rápida.' }
    ]
  },
  furniture: {
    id: 'furniture',
    title: { es: 'Limpieza de Tapicería y Muebles', en: 'Upholstery & Sofa Cleaning', de: 'Polster- & Sofareinigung', fr: 'Nettoyage de Canapés & Tissus', it: 'Pulizia Divani e Imbottiti', pt: 'Limpeza de Sofás e Estofos' },
    subTitle: { es: 'Sofás, sillones y sillas tapizadas', en: 'Sofas, armchairs & fabric chairs', de: 'Sofas, Sessel & Polsterstühle', fr: 'Canapés, fauteuils & sièges', it: 'Divani, poltrone e sedie', pt: 'Sofás, poltronas e cadeiras' },
    priceText: 'CHF 40.00',
    durationText: '+30 min',
    limit: { es: '1 sofá de 2 plazas o 4 sillas por unidad', en: '1 2-seater sofa or 4 dining chairs per unit', de: '1 2-Sitzer Sofa oder 4 Polsterstühle', fr: '1 canapé 2 places ou 4 chaises par unité', it: '1 divano 2 posti o 4 sedie imbottite', pt: '1 sofá de 2 lugares ou 4 cadeiras' },
    bullets: [
      { es: 'Aspirado del mueble, incluidas costuras y zona bajo los cojines.', en: 'Detailed vacuuming including seams, crevices, and under cushions.', de: 'Absaugen aller Nähte, Ritzen und unter den Kissen.', fr: 'Aspiration des coutures, interstices et sous coussins.', it: 'Aspirazione cuciture, fessure e sotto cuscini.', pt: 'Aspiração de costuras, fendas e sob almofadas.' },
      { es: 'Pretratamiento de manchas según el código de limpieza del tejido.', en: 'Pre-spotting stains matching fabric cleaning codes.', de: 'Fleckenvorbehandlung nach Stoff-Pflegetyp.', fr: 'Détachage ciblé selon le code du tissu.', it: 'Pretrattamento macchie su misura per il tessuto.', pt: 'Pré-tratamento de manchas conforme o tecido.' },
      { es: 'Limpieza por inyección-extracción o en seco según el material.', en: 'Spray extraction or low-moisture dry foam cleaning.', de: 'Sprüh-Extraktion oder schonende Trockenschaumreinigung.', fr: 'Injection-extraction ou nettoyage à sec selon matière.', it: 'Iniezione-estrazione o lavaggio a secco.', pt: 'Injeção-extração ou lavagem a seco.' },
      { es: 'Limpieza, nutrición e hidratación del cuero cuando corresponda.', en: 'Leather cleaning, conditioning, and protective sealing if leather.', de: 'Lederreinigung, Pflege & Rückfettung bei Ledergarnituren.', fr: 'Nettoyage et nutrition du cuir si mobilier en cuir.', it: 'Pulizia e nutrimento pelle se in cuoio.', pt: 'Limpeza e hidratação de couro se aplicável.' }
    ]
  }
};
