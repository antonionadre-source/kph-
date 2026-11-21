const languages = ['de', 'en', 'fr', 'it', 'es', 'pt'];
const actions = {
  details: ['Details ansehen', 'View details', 'Voir les détails', 'Mostra dettagli', 'Ver información', 'Ver detalhes'],
  close: ['Schließen', 'Close', 'Fermer', 'Chiudi', 'Cerrar', 'Fechar'],
} as const;
const optionLabels: Record<string, readonly string[]> = {
  'End of Tenancy Deluxe': ['Umzugsreinigung', 'End-of-tenancy cleaning', 'Nettoyage de fin de bail', 'Pulizia di fine locazione', 'Limpieza de fin de alquiler', 'Limpeza de fim de arrendamento'],
  'B2B Commercial Cleaning': ['Gewerbliche Reinigung', 'Commercial cleaning', 'Nettoyage professionnel', 'Pulizia commerciale', 'Limpieza de empresas', 'Limpeza de empresas'],
  'Regular Deep Cleaning': ['Gründliche Wohnungsreinigung', 'Home deep cleaning', 'Nettoyage approfondi du logement', 'Pulizia approfondita della casa', 'Limpieza a fondo del hogar', 'Limpeza profunda da habitação'],
  'Professional Car Detailing': ['Fahrzeugpflege', 'Vehicle cleaning', 'Nettoyage de véhicule', 'Pulizia del veicolo', 'Cuidado del vehículo', 'Limpeza do veículo'],
  'Facade & Glass Restoration': ['Fassaden- und Glasreinigung', 'Facade and glass cleaning', 'Nettoyage des façades et vitres', 'Pulizia di facciate e vetri', 'Limpieza de fachadas y cristales', 'Limpeza de fachadas e vidros'],
  'Emergency Rapid Cleanup': ['Anfrage für dringende Reinigung', 'Urgent cleaning request', 'Demande de nettoyage urgent', 'Richiesta di pulizia urgente', 'Solicitud de limpieza urgente', 'Pedido de limpeza urgente'],
  Low: ['Niedrig', 'Low', 'Faible', 'Bassa', 'Baja', 'Baixa'],
  Medium: ['Mittel', 'Medium', 'Moyenne', 'Media', 'Media', 'Média'],
  High: ['Hoch', 'High', 'Élevée', 'Alta', 'Alta', 'Alta'],
};
const indexFor = (language: string) => Math.max(0, languages.indexOf(language.toLowerCase().split('-')[0]));
export const portalActionText = (language: string, key: keyof typeof actions): string => actions[key][indexFor(language)];
/** Labels are presentation only. Existing stored service and priority values are unchanged. */
export const portalOptionLabel = (language: string, value: string): string => optionLabels[value]?.[indexFor(language)] || value;
