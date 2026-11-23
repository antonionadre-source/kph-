/** Resolve the illustration's activity, clothing and lighting without side effects. */
export function resolveKaiState({ phase, temperatureC, clothing = 'auto', service = 'moving' } = {}) {
  const lightsOn = phase !== 'night';
  const daytimeTask = service === 'windows' ? 'windows'
    : ['end', 'regular', 'deep'].includes(service) ? 'mop' : 'moving';

  // 8 °C is an editorial wardrobe threshold, not an inferred weather measurement.
  const automaticClothing = typeof temperatureC === 'number'
    && Number.isFinite(temperatureC) && temperatureC < 8 ? 'warm' : 'light';

  return {
    task: lightsOn ? daytimeTask : 'rest',
    clothing: clothing === 'warm' || clothing === 'light' ? clothing : automaticClothing,
    lightsOn
  };
}
