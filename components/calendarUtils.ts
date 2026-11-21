/** Calendar exports are local drafts; they never send invitations or claim Outlook synchronization. */
export interface CalendarRequest {
  id?: string; service: string; client: string; date?: string; email?: string; phone?: string; address?: string; amount?: number;
  time?: string;
  scheduling?: { requestedDate?: string; specificTime?: string | null; estimatedDurationHours?: number } | null;
}
export function escapeCalendarText(value: unknown): string {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}
function parseDate(raw: string): string {
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const european = raw.match(/^(\d{2})[/.](\d{2})[/.](\d{4})$/);
  const [year, month, day] = iso ? [Number(iso[1]), Number(iso[2]), Number(iso[3])] : european ? [Number(european[3]), Number(european[2]), Number(european[1])] : [];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (!year || date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) throw new Error('calendar/date-required');
  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}
const formatUtc = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
export function foldCalendarLine(line: string): string {
  let output = ''; let bytes = 0;
  for (const char of line) {
    const length = new TextEncoder().encode(char).length;
    if (bytes + length > 75) { output += '\r\n '; bytes = 1; }
    output += char; bytes += length;
  }
  return output;
}
export function createCalendarDraft(request: CalendarRequest, now = new Date()) {
  const date = parseDate(request.scheduling?.requestedDate || request.date || '');
  const rawTime = request.scheduling?.specificTime || request.time || '';
  const time = rawTime.match(/^(\d{2}):(\d{2})$/);
  let dateLines: string[];
  if (time) {
    if (Number(time[1]) > 23 || Number(time[2]) > 59) throw new Error('calendar/invalid-time');
    dateLines = [`DTSTART;TZID=Europe/Zurich:${date}T${time[1]}${time[2]}00`];
    const duration = request.scheduling?.estimatedDurationHours;
    if (typeof duration === 'number' && Number.isFinite(duration) && duration > 0 && duration <= 24) dateLines.push(`DURATION:PT${Math.round(duration * 60)}M`);
  } else {
    if (rawTime && !['flexible', 'morning', 'afternoon', 'evening'].includes(rawTime)) throw new Error('calendar/invalid-time');
    dateLines = [`DTSTART;VALUE=DATE:${date}`];
  }
  const uid = `${(request.id || crypto.randomUUID()).replace(/[^a-zA-Z0-9_-]/g, '')}@krakenpfm.ch`;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kraken PFM//Calendar draft//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VTIMEZONE', 'TZID:Europe/Zurich', 'BEGIN:DAYLIGHT', 'DTSTART:19810329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'END:DAYLIGHT', 'BEGIN:STANDARD', 'DTSTART:19961027T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'END:STANDARD', 'END:VTIMEZONE', 'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${formatUtc(now)}`, 'STATUS:TENTATIVE', ...dateLines, `SUMMARY:${escapeCalendarText(`Kraken PFM: ${request.service} - ${request.client}`)}`, `LOCATION:${escapeCalendarText(request.address)}`, `DESCRIPTION:${escapeCalendarText('Draft export. Review the requested date and confirm in your own calendar. No invitation has been sent.')}`, 'END:VEVENT', 'END:VCALENDAR'];
  // RFC 5545 uses CRLF; untrusted values cannot inject extra calendar properties.
  const icsData = lines.map(foldCalendarLine).join('\r\n') + '\r\n';
  return { icsData, uid, date, timezone: 'Europe/Zurich', draft: true as const };
}
export function scheduleCalendarEventForKai(request: CalendarRequest) {
  const draft = createCalendarDraft(request);
  const blob = new Blob([draft.icsData], { type: 'text/calendar;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `kraken_${(request.id || draft.date).replace(/[^a-zA-Z0-9_-]/g, '_')}.ics`;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  return draft;
}
