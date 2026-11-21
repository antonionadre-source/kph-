/** Assistant output is text, never executable markup or booking instructions. */
export function assistantText(value: unknown): string {
  if (typeof value !== 'string') throw new Error('The assistant returned no readable answer.');
  const text = value.replace(/```(?:json)?[\s\S]*?```/gi, '').trim();
  if (!text) throw new Error('The assistant returned no readable answer.');
  return text.slice(0, 6000);
}
export function chatHistory(messages: { role: 'user' | 'model'; text: string }[]) {
  return messages.slice(-12).map(message => ({ role: message.role, text: message.text.slice(0, 2000) }));
}
