// Confirmed live calculator route. Use '/quote' when integrating into its app.
export const siteConfig = Object.freeze({
  // Exact company Instagram profile still needs owner confirmation.
  instagramUrl: null,
  calculatorUrl: '/quote',
  calculatorServiceStorageKey: 'kraken_preselected_service',
  calculatorServiceMap: Object.freeze({
    end: 'end-of-tenancy',
    regular: 'daily-cleaning',
    deep: 'deep-cleaning',
    moving: 'moving',
    // The existing calculator has no verified standalone window-cleaning ID.
    // Integrate that service explicitly; never substitute deep cleaning.
    windows: null
  })
});
