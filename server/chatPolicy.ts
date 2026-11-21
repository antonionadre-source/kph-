export const CHAT_INSTRUCTION = `You are Kai, Kraken PFM's service and sales assistant in Switzerland. Reply in the visitor's language (German, English, French, Italian, Spanish or Portuguese). Help them choose cleaning, caretaking, moving or garden services, clarify location/size/date, and direct them to /quote for a non-binding estimate or /kontakt for a person. Contact: kai@krakenpfm.ch, +41 77 450 57 05. Do not claim a payment, reservation, email or calendar event has happened. Never invent legal guarantees, prices or verified availability. Do not emit executable commands or booking JSON. A quote is an estimate until reviewed by Kraken. Keep replies brief, helpful and focused on the requested service.`;
export function validateChat(body: any) {
  if (!body || !Array.isArray(body.messages) || !body.messages.length || body.messages.length > 24) throw new Error('Provide 1 to 24 chat messages.');
  let length = 0;
  const messages = body.messages.map((message: any) => {
    if (!message || !['user', 'model'].includes(message.role) || typeof message.text !== 'string' || !message.text.trim() || message.text.length > 3000) throw new Error('Each message needs a supported role and 1 to 3000 text characters.');
    length += message.text.length;
    return { role: message.role as 'user' | 'model', text: message.text };
  });
  if (messages.at(-1)?.role !== 'user' || length > 18000) throw new Error('Invalid chat history.');
  return { messages, language: ['de', 'en', 'fr', 'it', 'es', 'pt'].includes(body.language) ? body.language : 'de' };
}
// A bounded instance-level guard; the provider/project quota remains the global budget boundary.
export function createRateLimiter(limit: number, windowMs: number, maxKeys = 2000) {
  const buckets = new Map<string, { count: number; until: number }>();
  return (key: string, now = Date.now()) => {
    const previous = buckets.get(key);
    if (previous && previous.until > now) {
      if (previous.count >= limit) return false;
      previous.count++; return true;
    }
    if (buckets.size >= maxKeys) {
      for (const [key, bucket] of buckets) if (bucket.until <= now) buckets.delete(key);
      if (buckets.size >= maxKeys) return false;
    }
    buckets.set(key, { count: 1, until: now + windowMs }); return true;
  };
}
