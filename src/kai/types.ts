import type { HomeService } from '../home/calculator.ts';
import type { HomeLanguage } from '../../components/home/homeTranslations.ts';

export type KaiService = HomeService;
export const KAI_SERVICES: readonly KaiService[] = ['windows', 'end', 'regular', 'deep', 'moving'];
export const KAI_FIELDS = ['city', 'postcode', 'origin', 'destination', 'rooms', 'bedrooms', 'bathrooms', 'frequency', 'inventory', 'originAccess', 'destinationAccess', 'date', 'windowsCount', 'windowType', 'windowAccess', 'priorities', 'notes'] as const;
export type KaiField = typeof KAI_FIELDS[number];
export type KaiDraft = {
  version: 1;
  language: HomeLanguage;
  service: KaiService | null;
  services: KaiService[];
  fields: Partial<Record<KaiField, string>>;
  deferred: KaiField[];
};
export type KaiMessage = { role: 'user' | 'assistant'; text: string };
export type KaiAction = 'continue' | 'choose_service' | 'contact';
export type KaiAssistantRequest = { message: string; messages: KaiMessage[]; draft: KaiDraft; language: HomeLanguage };
export type KaiAssistantResponse = {
  message: string;
  draft: KaiDraft;
  missing: KaiField[];
  suggestions: string[];
  actions: KaiAction[];
  mode: 'ai' | 'guided';
  error?: 'provider_unavailable' | 'invalid_response' | 'rate_limited';
};
export const KAI_SERVICE_FIELDS: Record<KaiService, readonly KaiField[]> = {
  windows: ['city', 'postcode', 'windowsCount', 'windowType', 'windowAccess', 'date', 'notes'],
  end: ['city', 'postcode', 'rooms', 'bathrooms', 'date', 'priorities', 'notes'],
  regular: ['city', 'postcode', 'bedrooms', 'bathrooms', 'frequency', 'priorities', 'notes'],
  deep: ['city', 'postcode', 'bedrooms', 'bathrooms', 'priorities', 'date', 'notes'],
  moving: ['origin', 'destination', 'postcode', 'inventory', 'originAccess', 'destinationAccess', 'date', 'notes'],
};
export function emptyKaiDraft(language: HomeLanguage = 'de'): KaiDraft {
  return { version: 1, language, service: null, services: [], fields: {}, deferred: [] };
}
