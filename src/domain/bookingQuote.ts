import { repriceCart, type PriceCartItem } from './pricing.ts';
import { computeThreeLayerQuote } from '../data/municipalRegimes.ts';

export class QuoteValidationError extends Error {}
const pricedTypes = new Set(['end-of-tenancy', 'deep-cleaning', 'daily-cleaning', 'moving', 'gardening', 'exterior-cleaning', 'car-detailing', 'gutter-cleaning', 'waste-management', 'comic-book']);
export function validatePricingDetails(value: unknown, depth = 0): void {
  if (depth > 6) throw new QuoteValidationError('Service details are too deeply nested.');
  if (typeof value === 'number' && (!Number.isFinite(value) || value < 0 || value > 100000)) throw new QuoteValidationError('Invalid service quantity.');
  if (typeof value === 'string') {
    if (value.length > 500 || (/^[+-]?\d+(\.\d+)?$/.test(value) && (Number(value) < 0 || Number(value) > 100000))) throw new QuoteValidationError('Invalid service detail.');
  }
  if (Array.isArray(value)) {
    if (value.length > 30) throw new QuoteValidationError('Too many service options.');
    value.forEach(item => validatePricingDetails(item, depth + 1));
  } else if (value && typeof value === 'object') {
    if (Object.keys(value).length > 100) throw new QuoteValidationError('Too many service fields.');
    Object.values(value).forEach(item => validatePricingDetails(item, depth + 1));
  }
}

export function calculateBookingQuote(input: { services: PriceCartItem[]; postcode: string; address?: string; date: string; bookingMode: string }, now = new Date()) {
  if (!Array.isArray(input.services) || !input.services.length || input.services.length > 20 || !/^\d{4}$/.test(input.postcode)) throw new QuoteValidationError('Services and a valid Swiss postcode are required.');
  if (!['direct', 'validate'].includes(input.bookingMode)) throw new QuoteValidationError('Invalid booking mode.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !Number.isFinite(Date.parse(input.date))) throw new QuoteValidationError('Invalid service date.');
  for (const item of input.services) {
    if (!item || !pricedTypes.has(item.type)) throw new QuoteValidationError('This service requires a reviewed quote before payment.');
    validatePricingDetails(item.details || {});
    const duration = item.details?.duration;
    if (duration !== undefined && (Number(duration) < (item.type === 'moving' ? 3 : 1) || Number(duration) > 24)) throw new QuoteValidationError('Invalid requested service duration.');
    if ((item.type === 'gardening' && item.details?.size === 'XL') || (item.type === 'waste-management' && item.details?.hasHazardous)) throw new QuoteValidationError('This service requires a reviewed quote before payment.');
  }
  // Client price/duration fields never influence the server's monetary quote.
  const items = repriceCart(input.services.map(item => ({ type: item.type, details: item.details || {}, price: item.type === 'comic-book' ? 15 : 0 })), input.postcode);
  if (items.some(item => !Number.isFinite(item.price) || item.price <= 0 && item.type !== 'comic-book')) throw new QuoteValidationError('A service has no payable tariff.');
  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const composition = computeThreeLayerQuote({ plz: input.postcode, addressOrDistrict: input.address || '', hasClearingOrWasteService: items.some(item => item.type === 'waste-management' || item.details?.withClearing || item.details?.wasteType || item.details?.cleaning), baseLabourMaterialsChf: subtotal, noticeDaysAhead: Math.max(0, Math.ceil((Date.parse(input.date) - now.getTime()) / 86400000)) });
  const totalCents = Math.round(composition.costs.total * 100);
  const depositCents = items.every(item => item.type === 'comic-book') ? totalCents : (input.bookingMode === 'validate' ? 1500 : Math.round(totalCents * 0.15));
  if (!Number.isSafeInteger(totalCents) || totalCents <= 0 || totalCents > 100000000 || depositCents <= 0) throw new QuoteValidationError('Quote is outside allowed bounds.');
  return { version: 1, currency: 'CHF', totalCents, depositCents, items, provisional: composition.isProvisional, composition };
}
