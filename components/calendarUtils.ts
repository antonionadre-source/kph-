/**
 * Utility functions for generating Google Calendar links and .ics calendar files
 * specifically configured with a 1-hour reminder for kai@krakenpfm.ch
 */

export function scheduleCalendarEventForKai(req: {
  service: string;
  client: string;
  date?: string;
  email?: string;
  phone?: string;
  address?: string;
  amount?: number;
  scheduling?: {
    requestedDate?: string;
    specificTime?: string | null;
    estimatedDurationHours?: number;
  } | null;
}) {
  const staffEmail = 'kai@krakenpfm.ch';

  // Default values: start date is today or parsed from req
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let day = new Date().getDate();
  let startHour = 9;
  let startMinute = 0;
  let durationHours = req.scheduling?.estimatedDurationHours || 1;

  // Try parsing date string (e.g., "2026-08-15" or "15/08/2026" or "15.08.2026")
  const rawDateStr = req.scheduling?.requestedDate || req.date || '';
  if (rawDateStr) {
    const dateMatch = rawDateStr.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/) || rawDateStr.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
    if (dateMatch) {
      if (dateMatch[1].length === 4) {
        year = parseInt(dateMatch[1], 10);
        month = parseInt(dateMatch[2], 10);
        day = parseInt(dateMatch[3], 10);
      } else {
        day = parseInt(dateMatch[1], 10);
        month = parseInt(dateMatch[2], 10);
        year = parseInt(dateMatch[3], 10);
      }
    }
  }

  // Try parsing specific time if provided
  if (req.scheduling?.specificTime) {
    const timeMatch = req.scheduling.specificTime.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      startHour = parseInt(timeMatch[1], 10);
      startMinute = parseInt(timeMatch[2], 10);
    }
  }

  // Format as UTC ISO strings format YYYYMMDDTHHmmssZ
  const pad = (num: number) => String(num).padStart(2, '0');
  
  const startDateObj = new Date(Date.UTC(year, month - 1, day, startHour, startMinute, 0));
  const endDateObj = new Date(startDateObj.getTime() + durationHours * 60 * 60 * 1000);

  const formatICSDate = (d: Date) => {
    return d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) + 'Z';
  };

  const startIso = formatICSDate(startDateObj);
  const endIso = formatICSDate(endDateObj);

  const cleanClient = req.client || 'Client';
  const cleanService = req.service || 'Maintenance Service';
  const title = `Kraken PFM: ${cleanService} - ${cleanClient}`;
  const location = req.address || 'Client Location';
  const description = 
    `Kraken PFM Service assigned to Kai\\n` +
    `• Client: ${cleanClient}\\n` +
    `• Email: ${req.email || 'Not specified'}\\n` +
    `• Phone: ${req.phone || 'Not specified'}\\n` +
    `• Address: ${location}\\n` +
    `• Total Amount: CHF ${(req.amount || 0).toLocaleString()}\\n\\n` +
    `Automatic 1-hour prior reminder configured.`;

  // 1. Build Google Calendar Event URL with prefilled guest kai@krakenpfm.ch
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${startIso}/${endIso}` +
    `&details=${encodeURIComponent(description.replace(/\\n/g, '\n'))}` +
    `&location=${encodeURIComponent(location)}` +
    `&add=${encodeURIComponent(staffEmail)}${req.email ? ',' + encodeURIComponent(req.email) : ''}`;

  // 2. Build iCalendar .ics file string with ORGANIZER kai@krakenpfm.ch and 1-hour VALARM reminder in English
  const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kraken Properties & Facilities Management//Calendar System//EN
METHOD:REQUEST
BEGIN:VEVENT
ORGANIZER;CN=Kai (Kraken PFM):mailto:${staffEmail}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=Kai (Kraken PFM):mailto:${staffEmail}
${req.email ? `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${cleanClient}:mailto:${req.email}\n` : ''}DTSTART:${startIso}
DTEND:${endIso}
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Reminder: 1 hour until Kraken PFM service for ${cleanClient}
END:VALARM
END:VEVENT
END:VCALENDAR`;

  // Download .ics file
  try {
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kai_kraken_service_${cleanClient.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.warn('Error downloading .ics file:', err);
  }

  // Open Google Calendar
  window.open(gcalUrl, '_blank');

  return { gcalUrl, startIso, endIso };
}
