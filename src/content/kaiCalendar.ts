export type KaiMomentId = 'spring' | 'summer' | 'autumn' | 'winter' | 'new-year' | 'carnival' | 'easter' | 'sechselaeuten' | 'swiss-national-day' | 'back-to-school' | 'harvest' | 'samichlaus' | 'christmas' | 'new-years-eve' | 'spring-cleaning';

export const KAI_MOMENTS: readonly KaiMomentId[] = ['spring', 'summer', 'autumn', 'winter', 'new-year', 'carnival', 'easter', 'sechselaeuten', 'swiss-national-day', 'back-to-school', 'harvest', 'samichlaus', 'christmas', 'new-years-eve', 'spring-cleaning'];

// Organiser dates, not a guessed "third Monday" rule. Future years use spring
// until their dates are verified. Source: ZZZ Sechseläuten-Daten 2024–2035.
export const SECHSELAEUTEN_DATES: Readonly<Record<number, string>> = {
  2026: '04-20', 2027: '04-19', 2028: '04-24', 2029: '04-16', 2030: '04-08',
  2031: '04-21', 2032: '04-19', 2033: '04-25', 2034: '04-17', 2035: '04-16',
};

export function zurichDate(date: Date): { year: number; month: number; day: number; iso: string } {
  const values = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date).map(p => [p.type, p.value]));
  return { year: +values.year, month: +values.month, day: +values.day, iso: `${values.year}-${values.month}-${values.day}` };
}

/** Gregorian Easter, a date calculation rather than a regional holiday list. */
export function easterDate(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function selectKaiMoment(date: Date = new Date(), override?: string | null): KaiMomentId {
  if (override && KAI_MOMENTS.includes(override as KaiMomentId)) return override as KaiMomentId;
  const { year, month, day } = zurichDate(date);
  const today = Date.UTC(year, month - 1, day, 12), easter = easterDate(year).getTime();
  const daysFromEaster = Math.round((today - easter) / 86400000);
  if (month === 1 && day <= 3) return 'new-year';
  if (month === 12 && day >= 30) return 'new-years-eve';
  if (month === 12 && day >= 4 && day <= 7) return 'samichlaus';
  if (month === 12 && day <= 26) return 'christmas';
  if ((month === 7 && day >= 29) || (month === 8 && day <= 2)) return 'swiss-national-day';
  if (daysFromEaster >= -41 && daysFromEaster <= -39) return 'carnival'; // Basel, Monday–Wednesday after Ash Wednesday.
  if (daysFromEaster >= -2 && daysFromEaster <= 1) return 'easter';
  const sechs = SECHSELAEUTEN_DATES[year];
  if (sechs) {
    const [m, d] = sechs.split('-').map(Number);
    const distance = (today - Date.UTC(year, m - 1, d, 12)) / 86400000;
    if (distance >= -1 && distance <= 0) return 'sechselaeuten';
  }
  // Campaign windows: not public holidays or official school-calendar dates.
  if (month === 8 && day >= 10) return 'back-to-school';
  if ((month === 9 && day >= 15) || (month === 10 && day <= 15)) return 'harvest';
  if (month === 3 && day <= 14) return 'spring-cleaning';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

export function kaiMedia(id: KaiMomentId) {
  const base = `/kai-calendar/${id}`;
  return { id, hero: `${base}/hero-1440.webp`, heroSmall: `${base}/hero-768.webp`, mobile: `${base}/mobile-768.webp`, avatar: `${base}/avatar-320.webp` };
}
