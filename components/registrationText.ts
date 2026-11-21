const languages = ['de', 'en', 'fr', 'it', 'es', 'pt'];
const rows: Record<string, string[]> = {
  'Interactive Onboarding': ['Immobilienprofil', 'Property profile', 'Profil du bien', 'Profilo immobile', 'Perfil del inmueble', 'Perfil do imóvel'],
  'Step 1: Contact Details': ['1. Kontaktdaten', '1. Contact details', '1. Coordonnées', '1. Contatti', '1. Datos de contacto', '1. Dados de contacto'],
  'Step 2: Location & Physical Access': ['2. Adresse und Zugang', '2. Address and access', '2. Adresse et accès', '2. Indirizzo e accesso', '2. Dirección y acceso', '2. Morada e acesso'],
  'Step 3: Property Specifications': ['3. Angaben zur Immobilie', '3. Property details', '3. Détails du bien', '3. Dettagli immobile', '3. Datos del inmueble', '3. Dados do imóvel'],
  'Step 4: Confirm Registration': ['4. Angaben bestätigen', '4. Confirm details', '4. Confirmer les informations', '4. Conferma i dati', '4. Confirmar los datos', '4. Confirmar dados'],
  'Street and House Number': ['Strasse und Hausnummer', 'Street and house number', 'Rue et numéro', 'Via e numero', 'Calle y número', 'Rua e número'],
  'Postal Code': ['Postleitzahl', 'Postal code', 'Code postal', 'Codice postale', 'Código postal', 'Código postal'],
  'City': ['Ort', 'City', 'Ville', 'Città', 'Ciudad', 'Cidade'],
  'Access Protocol': ['Zugang', 'Access', 'Accès', 'Accesso', 'Acceso', 'Acesso'],
  'Number of Rooms': ['Anzahl Zimmer', 'Number of rooms', 'Nombre de pièces', 'Numero di stanze', 'Número de habitaciones', 'Número de divisões'],
  'Includes bedrooms, living rooms, and office rooms': ['Schlaf-, Wohn- und Arbeitszimmer', 'Bedrooms, living rooms and offices', 'Chambres, salons et bureaux', 'Camere, soggiorni e uffici', 'Dormitorios, salones y despachos', 'Quartos, salas e escritórios'],
  'Number of Toilets / Bathrooms': ['Anzahl Bäder / WCs', 'Bathrooms / toilets', 'Salles de bain / WC', 'Bagni / WC', 'Baños / aseos', 'Casas de banho / WC'],
  'Includes main bathroom, guest toilets, and en-suites': ['Hauptbad, Gäste-WC und weitere Bäder', 'Main bathroom, guest toilets and en-suites', 'Salle de bain principale, WC invités et salles d’eau', 'Bagno principale, WC ospiti e bagni privati', 'Baño principal, aseos y baños privados', 'Casa de banho principal, WC e instalações privadas'],
  'Balcony?': ['Balkon?', 'Balcony?', 'Balcon ?', 'Balcone?', '¿Balcón?', 'Varanda?'],
  'Garden?': ['Garten?', 'Garden?', 'Jardin ?', 'Giardino?', '¿Jardín?', 'Jardim?'],
  'Additional relevant information': ['Geben Sie hier weitere relevante Informationen an.', 'Enter any additional relevant information here.', 'Indiquez ici toute information complémentaire utile.', 'Inserisci qui eventuali informazioni aggiuntive pertinenti.', 'Indica aquí cualquier información adicional relevante.', 'Indique aqui qualquer informação adicional relevante.'],
  'Decrease number of rooms': ['Anzahl Zimmer verringern', 'Decrease number of rooms', 'Réduire le nombre de pièces', 'Riduci il numero di stanze', 'Reducir número de habitaciones', 'Diminuir o número de divisões'],
  'Increase number of rooms': ['Anzahl Zimmer erhöhen', 'Increase number of rooms', 'Augmenter le nombre de pièces', 'Aumenta il numero di stanze', 'Aumentar número de habitaciones', 'Aumentar o número de divisões'],
  'Decrease number of bathrooms': ['Anzahl Bäder / WCs verringern', 'Decrease number of bathrooms', 'Réduire le nombre de salles de bain', 'Riduci il numero di bagni', 'Reducir número de baños', 'Diminuir o número de casas de banho'],
  'Increase number of bathrooms': ['Anzahl Bäder / WCs erhöhen', 'Increase number of bathrooms', 'Augmenter le nombre de salles de bain', 'Aumenta il numero di bagni', 'Aumentar número de baños', 'Aumentar o número de casas de banho'],
  'Extra Notes / Special Instructions': ['Weitere Hinweise', 'Additional notes', 'Notes complémentaires', 'Note aggiuntive', 'Notas adicionales', 'Notas adicionais'],
  'YES': ['Ja', 'Yes', 'Oui', 'Sì', 'Sí', 'Sim'],
  'NO': ['Nein', 'No', 'Non', 'No', 'No', 'Não'],
  'Key Safe / Lockbox': ['Schlüsseltresor', 'Key safe / lockbox', 'Boîte à clés', 'Cassaforte chiavi', 'Caja de llaves', 'Caixa de chaves'],
  'In-Person Handover': ['Persönliche Übergabe', 'In-person handover', 'Remise en personne', 'Consegna di persona', 'Entrega en persona', 'Entrega presencial'],
  'Digital Code': ['Digitaler Zugangscode', 'Digital code', 'Code numérique', 'Codice digitale', 'Código digital', 'Código digital'],
  'Building Concierge / Agency': ['Hausverwaltung / Empfang', 'Concierge / agency', 'Concierge / agence', 'Portineria / agenzia', 'Conserjería / agencia', 'Portaria / agência'],
  'Review profile': ['Prüfen Sie Ihre Angaben, bevor Sie das Konto erstellen. Ihre Anfragen finden Sie in Ihrem Kundenbereich.', 'Review your details before creating your account. You can view your requests in your client area.', 'Vérifiez vos données avant de créer votre compte. Vous pourrez consulter vos demandes dans votre espace client.', 'Controlla i dati prima di creare l’account. Potrai consultare le tue richieste nell’area clienti.', 'Revisa tus datos antes de crear la cuenta. Podrás consultar tus solicitudes desde tu área de clientes.', 'Reveja os seus dados antes de criar a conta. Poderá consultar os seus pedidos na área de cliente.'],
};
export function registrationText(language: string, source: string): string {
  const index = languages.indexOf(language === 'de-CH' ? 'de' : language);
  return rows[source]?.[index < 0 ? 0 : index] || source;
}
