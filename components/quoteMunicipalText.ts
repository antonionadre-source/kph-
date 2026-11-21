export function translateSperrgutModell(model: string = '', lang: string = 'de'): string {
  const l = (lang || 'de').toLowerCase();
  if (model === 'aufAnfrage') {
    if (l.startsWith('es')) return 'Bajo Consulta (Servicio Personalizado ERZ / Punto Limpio)';
    if (l.startsWith('en')) return 'On Request (Custom Municipal ERZ Disposal)';
    if (l.startsWith('fr')) return 'Sur demande (Service personnalisé ERZ)';
    if (l.startsWith('it')) return 'Su richiesta (Servizio personalizzato ERZ)';
    if (l.startsWith('pt')) return 'Sob Consulta (Serviço Personalizado ERZ)';
    return 'Auf Anfrage (Sonderentsorgung / ERZ)';
  }
  if (model === 'marke') {
    if (l.startsWith('es')) return 'Viñetas / Adhesivos Oficiales del Municipio';
    if (l.startsWith('en')) return 'Official Municipal Sticker Tokens';
    if (l.startsWith('fr')) return 'Vignettes officielles de la commune';
    if (l.startsWith('it')) return 'Bollini comunali ufficiali';
    if (l.startsWith('pt')) return 'Selos municipais oficiais';
    return 'Gemeinde-Sperrgutmarken';
  }
  if (model === 'kombisystem') {
    if (l.startsWith('es')) return 'Sistema Combinado (Viñeta + Pesa)';
    if (l.startsWith('en')) return 'Combined System (Sticker + Weight Scale)';
    if (l.startsWith('fr')) return 'Système combiné (Vignette + Poids)';
    if (l.startsWith('it')) return 'Sistema combinato (Bollino + Peso)';
    if (l.startsWith('pt')) return 'Sistema Combinado (Selo + Peso)';
    return 'Kombisystem (Marke + Gewicht)';
  }
  if (model === 'keineAbfuhr') {
    if (l.startsWith('es')) return 'Sin Recogida Pública (Autotransporte a Punto Limpio)';
    if (l.startsWith('en')) return 'No Public Pickup (Direct Transport to Recycling Yard)';
    if (l.startsWith('fr')) return 'Pas de collecte publique (Transport direct déchèterie)';
    if (l.startsWith('it')) return 'Nessun ritiro pubblico (Trasporto diretto centro raccolta)';
    if (l.startsWith('pt')) return 'Sem Recolha Pública (Transporte Direto ao Centro)';
    return 'Keine Abfuhr (Selbstanlieferung Recyclinghof)';
  }
  return model || 'Gemeindespezifisch';
}

export function translateBereitstellung(timeStr: string | null = '', lang: string = 'de'): string {
  if (!timeStr) return 'k.A.';
  const l = (lang || 'de').toLowerCase();
  if (timeStr.includes('07:00 Uhr am Abholtag (frühst. Vorabend)')) {
    if (l.startsWith('es')) return '07:00 h el día de recogida (como muy pronto la tarde anterior)';
    if (l.startsWith('en')) return '07:00 AM on collection day (earliest evening before)';
    if (l.startsWith('fr')) return '07:00 le jour de collecte (au plus tôt la veille au soir)';
    if (l.startsWith('it')) return '07:00 il giorno del ritiro (al più presto la sera prima)';
    if (l.startsWith('pt')) return '07:00 no dia da recolha (o mais cedo na véspera à noite)';
    return '07:00 Uhr am Abholtag (frühst. Vorabend)';
  }
  if (timeStr.includes('07:00 (06:00 bei Hitze über 30°C)')) {
    if (l.startsWith('es')) return '07:00 h (06:00 h en ola de calor >30°C)';
    if (l.startsWith('en')) return '07:00 AM (06:00 AM in heatwaves >30°C)';
    if (l.startsWith('fr')) return '07:00 (06:00 en cas de canicule >30°C)';
    if (l.startsWith('it')) return '07:00 (06:00 in caso di caldo >30°C)';
    if (l.startsWith('pt')) return '07:00 (06:00 em ondas de calor >30°C)';
    return '07:00 Uhr (06:00 Uhr bei Hitze >30°C)';
  }
  return timeStr;
}

export function translateConfidence(confidence: string = '', lang: string = 'de'): string {
  const l = (lang || 'de').toLowerCase();
  if (confidence === 'VERIFIED') {
    if (l.startsWith('es')) return 'VERIFICADO (OFICIAL)';
    if (l.startsWith('en')) return 'VERIFIED (OFFICIAL)';
    if (l.startsWith('fr')) return 'VÉRIFIÉ (OFFICIEL)';
    if (l.startsWith('it')) return 'VERIFICATO (UFFICIALE)';
    if (l.startsWith('pt')) return 'VERIFICADO (OFICIAL)';
    return 'VERIFIZIERT (OFFIZIELL)';
  }
  if (confidence === 'REPORTED') {
    if (l.startsWith('es')) return 'REPORTADO';
    if (l.startsWith('en')) return 'REPORTED';
    if (l.startsWith('fr')) return 'SIGNALÉ';
    if (l.startsWith('it')) return 'SEGNALATO';
    if (l.startsWith('pt')) return 'REPORTADO';
    return 'GEMELDET';
  }
  if (l.startsWith('es')) return 'PROVISIONAL';
  if (l.startsWith('en')) return 'PROVISIONAL';
  return 'VORLÄUFIG';
}

