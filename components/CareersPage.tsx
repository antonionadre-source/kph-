import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Coins, 
  CreditCard, 
  PhoneCall, 
  ShieldCheck, 
  Languages, 
  FileText, 
  Upload, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Briefcase,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useTranslation } from '../i18n';
import { db, auth, storage } from './firebase';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/ucxeqjygku2w6zyf9ynut5oantantx58';
const SERVICE_ID = 'service_aiv15bc';
const TEMPLATE_ID = 'template_aktj7t9';
const PUBLIC_KEY = 'sH5K84ChHyssJrarm';

interface CareersPageProps {
  onNavigate: (page: string) => void;
}

// Floating Curriculum Vitae (CV) Confetti Component for Job Application Submissions
const CurriculumsConfetti: React.FC = () => {
  const items = Array.from({ length: 50 }).map((_, i) => {
    const left = Math.random() * 96; // 0% to 96%
    const delay = Math.random() * 4; // 0s to 4s
    const duration = 4.5 + Math.random() * 4.5; // 4.5s to 9s
    const size = 22 + Math.random() * 26; // 22px to 48px
    const rotateDir = Math.random() > 0.5 ? 1 : -1;
    const rotateAmount = (180 + Math.random() * 540) * rotateDir;
    const variant = i % 6; // 6 distinct CV item visual styles
    
    return { id: i, left, delay, duration, size, rotateAmount, variant };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[150]">
      {items.map((item) => (
        <div
          key={item.id}
          className="cv-confetti-item absolute -top-20 select-none"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            fontSize: `${item.size}px`,
            ['--rotate-to' as any]: `${item.rotateAmount}deg`,
          }}
        >
          {item.variant === 0 && (
            <div className="bg-white border-2 border-blue-500 rounded-lg p-1.5 shadow-xl flex flex-col items-center justify-center w-9 h-12 border-t-4 border-t-[#002D5B] bg-gradient-to-b from-white to-slate-50">
              <div className="w-6 h-1 bg-[#002D5B] rounded mb-1"></div>
              <div className="w-5 h-0.5 bg-slate-400 rounded mb-0.5"></div>
              <div className="w-4 h-0.5 bg-slate-300 rounded mb-0.5"></div>
              <div className="w-5 h-0.5 bg-slate-300 rounded"></div>
              <span className="text-[7px] font-black text-blue-800 mt-1 uppercase tracking-tighter">CV</span>
            </div>
          )}
          {item.variant === 1 && <span className="filter drop-shadow-md">📄</span>}
          {item.variant === 2 && <span className="filter drop-shadow-md">📋</span>}
          {item.variant === 3 && (
            <div className="bg-emerald-500 text-white rounded-lg p-1.5 shadow-xl flex flex-col items-center justify-center w-8 h-10 border border-emerald-400">
              <span className="text-[10px] font-black tracking-tight">CURRÍCULUM</span>
              <div className="w-4 h-0.5 bg-white/80 rounded mt-0.5"></div>
            </div>
          )}
          {item.variant === 4 && <span className="filter drop-shadow-md">📑</span>}
          {item.variant === 5 && (
            <div className="bg-amber-50 border border-amber-300 rounded-md px-1.5 py-1 shadow-md flex items-center gap-1 text-[9px] font-black text-amber-900">
              <span>📜</span>
              <span>CV</span>
            </div>
          )}
        </div>
      ))}
      <style>{`
        .cv-confetti-item {
          opacity: 0;
          animation: cvFall linear infinite;
        }
        @keyframes cvFall {
          0% {
            top: -10%;
            opacity: 1;
            transform: translateX(0px) rotate(0deg) scale(0.9);
          }
          20% {
            transform: translateX(30px) rotate(calc(var(--rotate-to) * 0.25)) scale(1.1);
          }
          50% {
            transform: translateX(-25px) rotate(calc(var(--rotate-to) * 0.5)) scale(1);
          }
          75% {
            transform: translateX(20px) rotate(calc(var(--rotate-to) * 0.75)) scale(1.05);
          }
          100% {
            top: 115%;
            opacity: 0.1;
            transform: translateX(-15px) rotate(var(--rotate-to)) scale(0.85);
          }
        }
      `}</style>
    </div>
  );
};

// Full, professional localization dictionaries for the Careers Page
const LOCALIZED_CONTENT: Record<string, any> = {
  de: {
    heroBadge: "KARRIERE BEI KRAKEN PFM",
    heroTitle: "Arbeit, auf die du stolz sein kannst.",
    heroSubtitle: "Ein Chef, der den Job selbst gemacht hat.",
    heroIntro: "Kraken PFM ist ein junges Facility-Management-Unternehmen aus Schaffhausen. Wir sind klein, wir wachsen — und wir bauen ein Team auf, in dem gute Arbeit gesehen und fair behandelt wird. Von Anfang an. Werde Teil der ersten Crew in Schaffhausen, Winterthur oder Zürich.",
    btnViewPositions: "Offene Stellen ansehen",
    btnSendSpontaneous: "Initiativbewerbung senden",

    trustFairPayTitle: "Fairer Lohn",
    trustFairPaySubtitle: "Nach GAV Reinigungsbranche",
    trustPaidTrialTitle: "Bezahlt",
    trustPaidTrialSubtitle: "Probeeinsatz — immer",
    trustDirectLineTitle: "Direkter Draht",
    trustDirectLineSubtitle: "Direkt zum Chef",
    trustLocalTitle: "Wohnortnah",
    trustLocalSubtitle: "Einsätze in deiner Region",
    trustEquipmentTitle: "Ausrüstung",
    trustEquipmentSubtitle: "Professionell gestellt",
    trustInternationalTitle: "International",
    trustInternationalSubtitle: "Bewerben in 5 Sprachen",

    whyBadge: "WIR MACHEN ES ANDERS",
    whyTitle: "Warum Kraken PFM?",
    whyIntro: "Ganz ehrlich: Wir sind kein Konzern. Es gibt bei uns keine HR-Abteilung, keine anonymen Dienstpläne aus einer Zentrale und keine Nummer statt deinem Namen. Es gibt Antonio — den Gründer. Und es gibt dich.",
    storyBadge: "VON PROFIS FÜR PROFIS",
    storyTitle: "Dein Chef hat selbst geputzt.",
    storyP1: "Antonio hat seine Karriere als Reiniger in London begonnen. Vom Reiniger zum Building Manager, später Head of Sales, dann Facility Management in der Schweiz. Elf Jahre in dieser Branche — auf beiden Seiten.",
    storyP2: "Er weiss, wie es sich anfühlt, wenn der Einsatzplan am Sonntagabend kommt. Wenn das Material fehlt. Wenn niemand Danke sagt.",
    storyQuote: "Kraken PFM wurde gegründet, um es anders zu machen.",
    storyQuoteAuthor: "Antonio, Gründer von Kraken PFM",

    promise1Title: "Richtig eingearbeitet",
    promise1Desc: "Niemand wird allein zu einem Objekt geschickt, das er nicht kennt. Erste Einsätze machst du gemeinsam mit Antonio oder einem erfahrenen Kollegen, bis du dich sicher fühlst.",
    promise2Title: "Bezahler Probeeinsatz",
    promise2Desc: "Wer arbeitet, wird bezahlt. Punkt. Bei uns gibt es keine unbezahlten Gratis-Schnuppertage. Deine Arbeitsleistung wird fair vergütet.",
    promise3Title: "Fairer Lohn, korrekt abgerechnet",
    promise3Desc: "Wir halten uns an den GAV der Reinigungsbranche. Arbeitszeiten werden genau erfasst, Lohnabrechnungen sind transparent, inklusive aller Sozialversicherungen.",
    promise4Title: "Einsätze in deiner Region",
    promise4Desc: "Wir planen deine Einsätze so nah wie möglich an deinem Wohnort. Wir besprechen die Planung mit dir, bevor wir den Einsatz eintragen — nicht danach.",
    promise5Title: "Direkt mit dem Chef",
    promise5Desc: "Problem oder Frage? Du schreibst Antonio direkt per WhatsApp. Du bekommst in der Regel noch am selben Tag eine Antwort ohne bürokratische Umwege.",
    promise6Title: "Professionelle Ausrüstung",
    promise6Desc: "Arbeitskleidung, modernste Werkzeuge, sichere Reinigungsmittel und Schutzausrüstung werden komplett gestellt. Deine Sicherheit geht vor Geschwindigkeit.",

    futureTitle: "Und die Zukunft?",
    futureDesc: "Wir stehen am Anfang. Das bedeutet auch: Wer jetzt einsteigt und Verantwortung übernehmen will, wächst mit dem Unternehmen mit. Die ersten Teamleiter:innen von Kraken PFM werden aus der ersten Crew kommen — nicht von aussen eingekauft. Wir versprechen dir keine Karriereleiter auf einem Poster. Wir versprechen dir: Gute Arbeit wird bei uns gesehen. Antonio ist der Beweis, dass man in dieser Branche vom Reiniger zum Unternehmer werden kann.",

    importantBadge: "WAS UNS WICHTIG IST",
    importantTitle: "Was uns wichtiger ist als ein perfekter Lebenslauf",
    importantIntro: "Wir suchen Menschen, auf die man sich verlassen kann. Für Einstiegspositionen brauchst du keine Erfahrung — Einstellung zählt mehr als Zeugnisse. Das erwarten wir von dir:",
    req1Title: "Zuverlässigkeit",
    req1Desc: "Pünktlichkeit und absolute Verlässlichkeit bei vereinbarten Terminen.",
    req2Title: "Respektvoller Umgang",
    req2Desc: "Wertschätzendes Verhalten gegenüber Kunden, Kollegen und fremdem Eigentum.",
    req3Title: "Auge für Details",
    req3Desc: "Ein Blick für Sauberkeit und Qualitätsbewusstsein bei der Ausführung.",
    req4Title: "Sicherheit & Regeln",
    req4Desc: "Konsequente Bereitschaft, Hygiene-Standards und Sicherheitsregeln einzuhalten.",
    req5Title: "Arbeitsbewilligung",
    req5Desc: "Du besitzt eine gültige Arbeitsbewilligung für die Schweiz.",
    req6Title: "Sprachkenntnisse",
    req6Desc: "Grundkenntnisse in Deutsch ODER Englisch für eine reibungslose Teamkommunikation.",
    smartphoneAlert: "Ein Smartphone für einfache digitale Checklisten ist nötig — keine Sorge, wir zeigen dir genau, wie es funktioniert.",

    positionsBadge: "WIR SUCHEN DICH",
    positionsTitle: "Unsere offenen Stellen",
    positionsSubtitle: "Möchtest du Teil der ersten Kraken-Crew werden? Hier sind unsere aktuellen Einstiegsmöglichkeiten.",
    jobActiveBadge: "OFFENE STELLE",
    jobPoolBadge: "TALENTPOOL",
    jobSpontaneousBadge: "INITIATIVBEWERBUNG",

    job1Category: "REINIGUNG & UMZUG",
    job1Title: "Mitarbeiter:in Reinigung & Umzugsreinigung (m/w/d)",
    job1Locations: "Schaffhausen / Winterthur",
    job1Pensum: "Teilzeit oder Stundenbasis",
    job1Start: "ab sofort",
    job1Desc: "Du arbeitest sorgfältig, selbstständig und diskret. Du hältst vereinbarte Zeiten ein und gehst verantwortungsvoll mit Kundeneigentum um. Erfahrung mit Umzugsreinigungen ist ein grosses Plus — motivierte Einsteiger:innen arbeiten wir aber gerne ein.",
    job1Btn: "Jetzt bewerben",

    job2Category: "PROJEKTBASIERT / SPEZIALIST",
    job2Title: "Spezialist:in Umzugs- & Tiefenreinigung",
    job2Pensum: "Abruf oder projektbasiert",
    job2Start: "Garantie-Aufträge",
    job2Desc: "Für unsere anspruchsvollen Abnahme-Garantie-Aufträge (Abgabegarantie) suchen wir laufend erfahrene Profis. Du kennst die Standards der Verwaltungen und arbeitest speditiv und lösungsorientiert.",
    job2Btn: "In den Pool eintragen",

    job3Category: "ALLROUNDER / HAUSWART",
    job3Title: "Hauswart:in / Allrounder:in mit handwerklichem Geschick",
    job3Pensum: "Wiederkehrend",
    job3Start: "Führerausweis Kat. B erwünscht",
    job3Desc: "Für die wiederkehrende Liegenschaftsbetreuung und kleine Unterhaltsarbeiten suchen wir Allrounder mit handwerklichem Geschick, die selbstständig Probleme erkennen und lösen können.",
    job3Btn: "In den Pool eintragen",

    job4Category: "MULTIDISZIPLINÄR",
    job4Title: "Alle anderen Profile",
    job4Pensum: "Gärtner, Umzugshelfer, etc.",
    job4Start: "Jederzeit willkommen",
    job4Desc: "Ob Gärtner:in, Umzugshelfer:in, Fensterreiniger:in oder Bürotalent — wenn du gut bist in dem, was du tust, wollen wir unbedingt von dir hören. Wir melden uns aktiv, sobald ein passendes Objekt frei wird.",
    job4Btn: "Initiativ bewerben",

    processBadge: "DER WEG INS TEAM",
    processTitle: "So läuft es ab",
    processIntro: "Bei uns gibt es keine komplizierten, wochenlangen Assessment-Center. Wir schätzen Einfachheit, Ehrlichkeit und Schnelligkeit.",
    step1Title: "Bewerben — unkompliziert",
    step1Desc: "Schick uns deine Infos einfach über das untenstehende Web-Formular oder unkompliziert direkt per WhatsApp. Ein perfekter Lebenslauf ist nicht nötig.",
    step2Title: "Gespräch mit Antonio",
    step2Desc: "Persönlich oder telefonisch. Wir sprechen über deine bisherige Erfahrung, deine zeitliche Verfügbarkeit und deine Vorstellungen. Du kannst alles fragen — auch zum GAV-Lohn.",
    step3Title: "Bezahlter Probeeinsatz",
    step3Desc: "Du arbeitest einen vordefinierten Einsatz aktiv mit — natürlich voll bezahlt! So sehen wir beide unkompliziert im echten Leben, ob die Chemie und die Arbeit passen.",
    step4Title: "Klares Angebot",
    step4Desc: "Deine Funktion, dein Pensum, dein genauer Lohn, deine Einsatzregion und dein Starttermin — alles schriftlich, transparent und verbindlich, bevor du deine Zusage gibst.",

    fastestWayBadge: "SCHNELLSTER WEG",
    ctaTitle: "Bereit für einen Chef, der weiss, wie dein Job ist?",
    ctaDesc: "Ob mit Erfahrung oder als Einsteiger:in: Wenn du zuverlässig bist und gute Arbeit wichtig nimmst, melde dich. Die erste Crew von Kraken PFM wird gerade aufgebaut — und du kannst von Anfang an dabei sein.",
    btnWhatsApp: "Per WhatsApp bewerben",
    directContact: "Direktkontakt: Antonio (+41 77 450 57 05)",
    languageBadge: "UNSERE SPRACHOFFENHEIT",
    languageText: "Du kannst uns auf Deutsch, Englisch, Spanisch, Portugiesisch oder Italienisch schreiben oder sprechen. Wir antworten dir in deiner bevorzugten Sprache.",

    formTitle: "Online-Bewerbung",
    lblFullName: "Name / Vorname",
    lblPhone: "Telefon / WhatsApp",
    lblDesiredPosition: "Gewünschte Stelle",
    lblRegion: "Region",
    lblWorkPermit: "Arbeitsbewilligung",
    lblStart: "Frühestmöglicher Start",
    lblPensum: "Gewünschtes Pensum",
    lblCertificates: "Ausweise & Zertifikate",
    lblLanguages: "Sprachen",
    lblCV: "Lebenslauf / CV hochladen",
    cvPlaceholder: "Datei auswählen oder reinziehen",
    cvLimits: "PDF, DOC bis max. 5MB",
    lblAboutYou: "Erzähl uns kurz von dir",

    placeholderFullName: "Dein vollständiger Name",
    placeholderPhone: "z.B. +41 77 450 57 05",
    placeholderStart: "z.B. ab sofort / Datum",
    placeholderCertificates: "z.B. Kat. B, IPA/Hebebühne",
    placeholderLanguages: "z.B. Spanisch, Portugiesisch, Deutsch, Italienisch",
    placeholderAboutYou: "z.B. Wer bist du? Was motiviert dich? Wann hättest du Zeit?",

    optPermitYes: "Ja (Gültige Bewilligung)",
    optPermitNo: "Nein / Noch keine Bewilligung",
    optPermitCH: "CH-Bürger:in",
    optPensumHourly: "Stundenbasis (Flexibel)",

    requiredField: "Erforderlich",
    optionalField: "optional",
    btnSubmit: "Bewerbung absenden",
    btnSubmitting: "Daten werden übermittelt...",

    successTitle: "Bewerbung eingegangen!",
    successText: "Danke für dein Vertrauen und dein Interesse an Kraken PFM! Antonio wird sich so schnell wie möglich bei dir melden — in der Regel innerhalb von 2 Arbeitstagen.",
    successBtnHome: "Zur Hauptseite",
    errorMsg: "Fehler beim Senden der Bewerbung. Bitte kontaktiere Antonio direkt unter info@krakenpfm.ch."
  },
  en: {
    heroBadge: "CAREERS AT KRAKEN PFM",
    heroTitle: "Work you can be proud of.",
    heroSubtitle: "A boss who has done the job himself.",
    heroIntro: "Kraken PFM is a young facility management company from Schaffhausen. We are small, we are growing — and we are building a team where good work is seen and treated fairly. From the very beginning. Become part of the first crew in Schaffhausen, Winterthur, or Zurich.",
    btnViewPositions: "View Open Positions",
    btnSendSpontaneous: "Submit Spontaneous Application",

    trustFairPayTitle: "Fair Pay",
    trustFairPaySubtitle: "Under cleaning industry GAV",
    trustPaidTrialTitle: "Paid",
    trustPaidTrialSubtitle: "Trial shifts — always",
    trustDirectLineTitle: "Direct Connection",
    trustDirectLineSubtitle: "Direct to the boss",
    trustLocalTitle: "Close to Home",
    trustLocalSubtitle: "Jobs in your region",
    trustEquipmentTitle: "Equipment",
    trustEquipmentSubtitle: "Professionally provided",
    trustInternationalTitle: "International",
    trustInternationalSubtitle: "Apply in 5 languages",

    whyBadge: "WE DO IT DIFFERENTLY",
    whyTitle: "Why Kraken PFM?",
    whyIntro: "To be honest: we are not a corporation. We have no HR department, no anonymous duty rosters from a headquarters, and no number instead of your name. There is Antonio — the founder. And there is you.",
    storyBadge: "BY PROFESSIONALS FOR PROFESSIONALS",
    storyTitle: "Your boss cleaned himself.",
    storyP1: "Antonio started his career as a cleaner in London. From cleaner to building manager, later head of sales, then facility management in Switzerland. Eleven years in this industry — on both sides.",
    storyP2: "He knows how it feels when the schedule arrives on Sunday evening. When materials are missing. When nobody says thank you.",
    storyQuote: "Kraken PFM was founded to do things differently.",
    storyQuoteAuthor: "Antonio, founder of Kraken PFM",

    promise1Title: "Proper onboarding",
    promise1Desc: "Nobody is sent alone to a site they don't know. Your first shifts will be done together with Antonio or an experienced colleague until you feel confident.",
    promise2Title: "Paid trial shift",
    promise2Desc: "Whoever works gets paid. Period. There are no unpaid free 'trial' days with us. Your labor is fairly compensated.",
    promise3Title: "Fair pay, correct accounting",
    promise3Desc: "We adhere to the GAV (collective labor agreement) of the cleaning industry. Work hours are precisely tracked, payslips are transparent, including all social security.",
    promise4Title: "Jobs in your region",
    promise4Desc: "We plan your shifts as close to your home as possible. We discuss the planning with you before we assign the shift — not after.",
    promise5Title: "Direct to the boss",
    promise5Desc: "Problem or question? Write to Antonio directly via WhatsApp. You will usually receive a reply the same day without bureaucratic detours.",
    promise6Title: "Professional equipment",
    promise6Desc: "Work clothes, state-of-the-art tools, safe cleaning supplies, and protective gear are fully provided. Your safety comes before speed.",

    futureTitle: "And the future?",
    futureDesc: "We are at the beginning. This also means: whoever joins now and wants to take responsibility grows with the company. The first team leaders at Kraken PFM will come from this first crew — not hired from outside. We don't promise you a career ladder on a poster. We promise you: good work is noticed. Antonio is the proof that you can go from cleaner to entrepreneur in this industry.",

    importantBadge: "WHAT IS IMPORTANT TO US",
    importantTitle: "What is more important to us than a perfect CV",
    importantIntro: "We are looking for people we can rely on. For entry-level positions, you don't need experience — attitude matters more than certificates. This is what we expect from you:",
    req1Title: "Reliability",
    req1Desc: "Punctuality and absolute reliability with agreed schedules.",
    req2Title: "Respectful treatment",
    req2Desc: "Appreciative behavior towards clients, colleagues, and other people's property.",
    req3Title: "Eye for detail",
    req3Desc: "A look for cleanliness and quality awareness during execution.",
    req4Title: "Safety & rules",
    req4Desc: "Consistent readiness to adhere to hygiene standards and safety guidelines.",
    req5Title: "Work permit",
    req5Desc: "You have a valid work permit for Switzerland.",
    req6Title: "Language skills",
    req6Desc: "Basic knowledge of German OR English for smooth team communication.",
    smartphoneAlert: "A smartphone for simple digital checklists is required — don't worry, we'll show you exactly how it works.",

    positionsBadge: "WE WANT YOU",
    positionsTitle: "Our Open Positions",
    positionsSubtitle: "Do you want to be part of the first Kraken crew? Here are our current entry opportunities.",
    jobActiveBadge: "OPEN POSITION",
    jobPoolBadge: "TALENT POOL",
    jobSpontaneousBadge: "SPONTANEOUS APPLICATION",

    job1Category: "CLEANING & MOVING",
    job1Title: "Cleaning & Move-out Cleaning Employee (m/f/d)",
    job1Locations: "Schaffhausen / Winterthur",
    job1Pensum: "Part-time or hourly basis",
    job1Start: "immediate",
    job1Desc: "You work carefully, independently, and discreetly. You keep agreed times and handle client property responsibly. Experience with move-out cleanings is a big plus — but we gladly onboard motivated newcomers.",
    job1Btn: "Apply now",

    job2Category: "PROJECT-BASED / SPECIALIST",
    job2Title: "Move-out & Deep Cleaning Specialist",
    job2Pensum: "On-call or project-based",
    job2Start: "Guaranteed handover jobs",
    job2Desc: "For our demanding handover-guaranteed orders, we are constantly looking for experienced professionals. You know the standards of real estate administrations and work quickly and solution-oriented.",
    job2Btn: "Join the talent pool",

    job3Category: "ALLROUNDER / CARETAKER",
    job3Title: "Caretaker / Allrounder with manual skills",
    job3Pensum: "Recurring",
    job3Start: "Driving license Cat. B preferred",
    job3Desc: "For recurring property maintenance and small upkeep tasks, we look for allrounders with manual skills who can independently recognize and solve problems.",
    job3Btn: "Join the talent pool",

    job4Category: "MULTIDISCIPLINARY",
    job4Title: "All other profiles",
    job4Pensum: "Gardeners, movers, etc.",
    job4Start: "Always welcome",
    job4Desc: "Whether you are a gardener, mover, window cleaner, or office talent — if you are good at what you do, we want to hear from you. We will contact you as soon as a fitting property opens up.",
    job4Btn: "Apply spontaneously",

    processBadge: "THE PATH INTO THE TEAM",
    processTitle: "How it works",
    processIntro: "There are no complicated, weeks-long assessment centers here. We value simplicity, honesty, and speed.",
    step1Title: "Apply — simple",
    step1Desc: "Send us your details via the form below or directly via WhatsApp. A perfect CV is not required.",
    step2Title: "Conversation with Antonio",
    step2Desc: "In person or by phone. We talk about your experience, your availability, and your expectations. You can ask anything — including about the GAV wage.",
    step3Title: "Paid trial shift",
    step3Desc: "You work a predefined shift with us — fully paid, of course! This is a simple, real-life way for both of us to see if the chemistry and the work fit.",
    step4Title: "Clear offer",
    step4Desc: "Your role, your workload, your exact wage, your working region, and your start date — all in writing, transparent and binding, before you give your consent.",

    fastestWayBadge: "FASTEST PATH",
    ctaTitle: "Ready for a boss who knows what your job is like?",
    ctaDesc: "Whether experienced or a beginner: if you are reliable and value good work, get in touch. The first crew of Kraken PFM is being built — and you can be there from the start.",
    btnWhatsApp: "Apply via WhatsApp",
    directContact: "Direct Contact: Antonio (+41 77 450 57 05)",
    languageBadge: "LANGUAGE OPENNESS",
    languageText: "You can write or talk to us in German, English, Spanish, Portuguese, or Italian. We will reply in your preferred language.",

    formTitle: "Online Application",
    lblFullName: "First name / Last name",
    lblPhone: "Phone / WhatsApp",
    lblDesiredPosition: "Desired Position",
    lblRegion: "Region",
    lblWorkPermit: "Work Permit",
    lblStart: "Earliest Start Date",
    lblPensum: "Desired Workload",
    lblCertificates: "Licenses & Certificates",
    lblLanguages: "Languages",
    lblCV: "Upload CV / Resume",
    cvPlaceholder: "Select file or drag and drop",
    cvLimits: "PDF, DOC up to 5MB",
    lblAboutYou: "Tell us briefly about yourself",

    placeholderFullName: "Your full name",
    placeholderPhone: "e.g. +41 77 450 57 05",
    placeholderStart: "e.g. immediately / date",
    placeholderCertificates: "e.g. Cat. B, cherry picker license",
    placeholderLanguages: "e.g. Spanish, Portuguese, German, Italian",
    placeholderAboutYou: "e.g. Who are you? What motivates you? When are you available?",

    optPermitYes: "Yes (Valid permit)",
    optPermitNo: "No / No permit yet",
    optPermitCH: "Swiss Citizen",
    optPensumHourly: "Hourly basis (Flexible)",

    requiredField: "Required",
    optionalField: "optional",
    btnSubmit: "Submit Application",
    btnSubmitting: "Submitting data...",

    successTitle: "Application Received!",
    successText: "Thank you for your trust and interest in Kraken PFM! Antonio will get back to you as soon as possible — usually within 2 working days.",
    successBtnHome: "To Home Page",
    errorMsg: "Error sending application. Please contact Antonio directly at info@krakenpfm.ch."
  },
  es: {
    heroBadge: "TRABAJA EN KRAKEN PFM",
    heroTitle: "Trabajo del que estar orgulloso.",
    heroSubtitle: "Un jefe que ha hecho el trabajo él mismo.",
    heroIntro: "Kraken PFM es una joven empresa de gestión de propiedades de Schaffhausen. Somos pequeños, crecemos — y construimos un equipo en el que el buen trabajo se valora y se trata de forma justa. Desde el principio. Únete al primer equipo en Schaffhausen, Winterthur o Zúrich.",
    btnViewPositions: "Ver puestos vacantes",
    btnSendSpontaneous: "Enviar candidatura espontánea",

    trustFairPayTitle: "Salario Justo",
    trustFairPaySubtitle: "Según el convenio de limpieza (GAV)",
    trustPaidTrialTitle: "Pagado",
    trustPaidTrialSubtitle: "Turno de prueba — siempre",
    trustDirectLineTitle: "Trato Directo",
    trustDirectLineSubtitle: "Directo con el fundador",
    trustLocalTitle: "Región Local",
    trustLocalSubtitle: "Trabajos cerca de ti",
    trustEquipmentTitle: "Equipamiento",
    trustEquipmentSubtitle: "Provisto profesionalmente",
    trustInternationalTitle: "Internacional",
    trustInternationalSubtitle: "Candidatura en 5 idiomas",

    whyBadge: "LO HACEMOS DIFERENTE",
    whyTitle: "¿Por qué Kraken PFM?",
    whyIntro: "Sinceramente: no somos una corporación. No hay departamento de recursos humanos, ni cuadrantes anónimos programados desde una central, ni un número de empleado en lugar de tu nombre. Está Antonio, el fundador. Y estás tú.",
    storyBadge: "DE PROFESIONALES PARA PROFESIONALES",
    storyTitle: "Tu jefe también ha limpiado.",
    storyP1: "Antonio comenzó su carrera como limpiador en Londres. De limpiador a gestor de edificios, más tarde jefe de ventas, y luego gestión de instalaciones en Suiza. Once años en esta industria, en ambos lados.",
    storyP2: "Él sabe lo que se siente cuando el cuadrante llega el domingo por la noche. Cuando falta material. Cuando nadie te da las gracias.",
    storyQuote: "Kraken PFM se fundó para hacer las cosas de otra manera.",
    storyQuoteAuthor: "Antonio, fundador de Kraken PFM",

    promise1Title: "Introducción adecuada",
    promise1Desc: "Nadie va solo a un lugar que no conoce. Harás tus primeros turnos junto a Antonio o a un colega experimentado hasta que te sientas seguro.",
    promise2Title: "Prueba pagada",
    promise2Desc: "Quien trabaja, cobra. Punto. Con nosotros no hay días de prueba gratis. Tu trabajo se compensa de forma justa.",
    promise3Title: "Salario justo y transparente",
    promise3Desc: "Respetamos el convenio colectivo (GAV) del sector de la limpieza. Las horas se registran con precisión, las nóminas son transparentes, incluyendo todas las cotizaciones sociales.",
    promise4Title: "Trabajos en tu zona",
    promise4Desc: "Planificamos tus turnos lo más cerca posible de tu casa. Hablamos de la planificación contigo antes de programarla, no después.",
    promise5Title: "Directo al jefe",
    promise5Desc: "¿Un problema o pregunta? Escribe a Antonio directamente por WhatsApp. Normalmente recibirás respuesta el mismo día sin rodeos burocráticos.",
    promise6Title: "Equipamiento profesional",
    promise6Desc: "Te proporcionamos ropa de trabajo, herramientas modernas, productos de limpieza seguros y equipo de protección. Tu seguridad está por encima de la prisa.",

    futureTitle: "¿Y el futuro?",
    futureDesc: "Estamos al principio. Esto significa que quien se una ahora y quiera asumir responsabilidades crecerá con la empresa. Los primeros supervisores de equipo de Kraken PFM saldrán de este primer grupo, no se contratarán de fuera. No te prometemos un póster con una escalera corporativa falsa. Te prometemos que aquí el buen trabajo se ve. Antonio es la prueba de que en este sector se puede pasar de limpiador a empresario.",

    importantBadge: "LO QUE NOS IMPORTA",
    importantTitle: "Lo que nos importa más que un currículum perfecto",
    importantIntro: "Buscamos personas de confianza. Para puestos iniciales no necesitas experiencia: la actitud importa más que los títulos. Esto es lo que esperamos de ti:",
    req1Title: "Fiabilidad",
    req1Desc: "Puntualidad y total fiabilidad en los turnos acordados.",
    req2Title: "Trato respetuoso",
    req2Desc: "Comportamiento respetuoso con clientes, colegas y propiedad ajena.",
    req3Title: "Ojo para el detalle",
    req3Desc: "Orientación a la limpieza y conciencia de calidad en la ejecución.",
    req4Title: "Seguridad y normas",
    req4Desc: "Disposición constante para cumplir las normas de higiene y seguridad.",
    req5Title: "Permiso de trabajo",
    req5Desc: "Disponer de un permiso de trabajo válido en Suiza.",
    req6Title: "Idiomas",
    req6Desc: "Conocimientos básicos de alemán O inglés para la comunicación interna.",
    smartphoneAlert: "Se necesita un teléfono inteligente para rellenar listas de comprobación sencillas; no te preocupes, te enseñaremos exactamente cómo funciona.",

    positionsBadge: "TE BUSCAMOS A TI",
    positionsTitle: "Nuestros puestos vacantes",
    positionsSubtitle: "¿Quieres formar parte de la primera tripulación de Kraken? Aquí están nuestras vacantes actuales.",
    jobActiveBadge: "PUESTO VACANTE",
    jobPoolBadge: "BOLSA DE TRABAJO",
    jobSpontaneousBadge: "CANDIDATURA ESPONTÁNEA",

    job1Category: "LIMPEZA Y MUDANZAS",
    job1Title: "Personal de limpieza y mudanzas (m/f/d)",
    job1Locations: "Schaffhausen / Winterthur",
    job1Pensum: "A tiempo parcial o por horas",
    job1Start: "inmediato",
    job1Desc: "Trabajas con cuidado, autonomía y discreción. Cumples con los horarios acordados y cuidas con responsabilidad la propiedad del cliente. La experiencia en limpieza de mudanzas es un gran punto a favor, pero formamos encantados a principiantes motivados.",
    job1Btn: "Postular ahora",

    job2Category: "POR PROYECTO / ESPECIALISTA",
    job2Title: "Especialista en Limpieza de Entregas y Limpieza Profunda",
    job2Pensum: "Bajo demanda o por proyecto",
    job2Start: "Trabajos con garantía de entrega",
    job2Desc: "Para nuestros exigentes servicios con garantía de entrega (Abgabegarantie), buscamos profesionales experimentados de forma continua. Conoces los estándares de las administraciones de fincas y trabajas de forma rápida y resolutiva.",
    job2Btn: "Unirse a la bolsa de trabajo",

    job3Category: "SABELOTODO / CONSERJE",
    job3Title: "Conserje / Manitas con habilidades manuales",
    job3Pensum: "Recurrente",
    job3Start: "Se prefiere carnet de conducir Cat. B",
    job3Desc: "Para el mantenimiento recurrente de edificios y pequeños trabajos de reparación, buscamos conserjes y manitas que puedan identificar y solucionar problemas de forma independiente.",
    job3Btn: "Unirse a la bolsa de trabajo",

    job4Category: "MULTIDISCIPLINAR",
    job4Title: "Todos los demás perfiles",
    job4Pensum: "Jardineros, transportistas, etc.",
    job4Start: "Siempre bienvenidos",
    job4Desc: "Tanto si eres jardinero, transportista, limpiador de ventanas o talento administrativo: si eres bueno en lo que haces, queremos saber de ti. Nos pondremos en contacto contigo en cuanto surja una oportunidad.",
    job4Btn: "Postular espontáneamente",

    processBadge: "EL CAMINO AL EQUIPO",
    processTitle: "Cómo funciona",
    processIntro: "Aquí no hay procesos de selección complejos que duren semanas. Valoramos la sencillez, la honestidad y la rapidez.",
    step1Title: "Inscripción sencilla",
    step1Desc: "Envíanos tus datos a través del formulario de abajo o directamente por WhatsApp. No necesitas un currículum perfecto.",
    step2Title: "Charla con Antonio",
    step2Desc: "En persona o por teléfono. Hablamos de tu experiencia, disponibilidad y expectativas. Puedes preguntar lo que quieras, incluido el salario del convenio.",
    step3Title: "Prueba pagada",
    step3Desc: "Haces un turno real con nosotros, ¡totalmente pagado, por supuesto! Es una forma directa en el mundo real de ver si encajamos y nos gusta el trabajo.",
    step4Title: "Propuesta clara",
    step4Desc: "Tu puesto, tu jornada, tu salario exacto, tu zona de trabajo y la fecha de inicio, todo por escrito, transparente y vinculante, antes de que des tu conformidad.",

    fastestWayBadge: "CAMINO MÁS RÁPIDO",
    ctaTitle: "¿Listo para un jefe que sabe cómo es tu trabajo?",
    ctaDesc: "Ya sea con experiencia o principiante: si eres de confianza y valoras el buen trabajo, ponte en contacto. Se está construyendo el primer equipo de Kraken PFM y puedes estar ahí desde el principio.",
    btnWhatsApp: "Inscribirse por WhatsApp",
    directContact: "Contacto directo: Antonio (+41 77 450 57 05)",
    languageBadge: "IDIOMAS BIENVENIDOS",
    languageText: "Puedes escribirnos o hablarnos en alemán, inglés, español, portugués o italiano. Te responderemos en tu idioma preferido.",

    formTitle: "Online-Bewerbung",
    lblFullName: "Nombre y Apellidos",
    lblPhone: "Teléfono / WhatsApp",
    lblDesiredPosition: "Puesto Solicitado",
    lblRegion: "Región",
    lblWorkPermit: "Permiso de Trabajo",
    lblStart: "Fecha de Incorporación",
    lblPensum: "Jornada Deseada",
    lblCertificates: "Carnets y Certificados",
    lblLanguages: "Idiomas",
    lblCV: "Subir Currículum (CV)",
    cvPlaceholder: "Seleccionar archivo o arrastrar",
    cvLimits: "PDF, DOC hasta un máximo de 5MB",
    lblAboutYou: "Cuéntanos brevemente sobre ti",

    placeholderFullName: "Tu nombre completo",
    placeholderPhone: "ej. +41 77 450 57 05",
    placeholderStart: "ej. inmediato / fecha",
    placeholderCertificates: "ej. Cat. B, carnet plataformas elevadoras",
    placeholderLanguages: "ej. Español, Portugués, Alemán, Italiano",
    placeholderAboutYou: "ej. ¿Quién eres? ¿Qué te motiva? ¿Cuándo estarías disponible?",

    optPermitYes: "Sí (Permiso válido)",
    optPermitNo: "No / Aún sin permiso",
    optPermitCH: "Ciudadano suizo",
    optPensumHourly: "Por horas (Flexible)",

    requiredField: "Obligatorio",
    optionalField: "opcional",
    btnSubmit: "Enviar Candidatura",
    btnSubmitting: "Transmitiendo datos...",

    successTitle: "¡Solicitud recibida!",
    successText: "¡Gracias por tu confianza e interés en Kraken PFM! Antonio se pondrá en contacto contigo lo antes posible, normalmente en 2 días laborables.",
    successBtnHome: "Volver a la Página Principal",
    errorMsg: "Error al enviar la solicitud. Por favor, contacte con Antonio directamente en info@krakenpfm.ch."
  },
  pt: {
    heroBadge: "CARREIRAS NA KRAKEN PFM",
    heroTitle: "Trabalho do qual se orgulhar.",
    heroSubtitle: "Um chefe que já fez o trabalho pessoalmente.",
    heroIntro: "A Kraken PFM é uma jovem empresa de gestão de propriedades em Schaffhausen. Somos pequenos, estamos a crescer — e estamos a construir uma equipa onde o bom trabalho é visto e tratado de forma justa. Desde o início. Junte-se à primeira tripulação em Schaffhausen, Winterthur ou Zurique.",
    btnViewPositions: "Ver vagas abertas",
    btnSendSpontaneous: "Enviar candidatura espontânea",

    trustFairPayTitle: "Salário Justo",
    trustFairPaySubtitle: "Pelo contrato coletivo de limpeza (GAV)",
    trustPaidTrialTitle: "Pago",
    trustPaidTrialSubtitle: "Turno de teste — sempre",
    trustDirectLineTitle: "Trato Direto",
    trustDirectLineSubtitle: "Diretamente com o chefe",
    trustLocalTitle: "Região Local",
    trustLocalSubtitle: "Serviços perto de si",
    trustEquipmentTitle: "Equipamento",
    trustEquipmentSubtitle: "Fornecido profissionalmente",
    trustInternationalTitle: "Internacional",
    trustInternationalSubtitle: "Candidatura em 5 línguas",

    whyBadge: "FAZEMOS DIFERENTE",
    whyTitle: "Porquê a Kraken PFM?",
    whyIntro: "Sinceramente: não somos uma corporação. Não há departamento de recursos humanos, nem escalas anónimas programadas a partir de uma sede, nem um número em vez do seu nome. Há o Antonio, o fundador. E há você.",
    storyBadge: "DE PROFISSIONAIS PARA PROFISSIONAIS",
    storyTitle: "O seu chefe também já limpou.",
    storyP1: "O Antonio começou a sua carreira como limpador em Londres. De limpador a gestor de edifícios, mais tarde chefe de vendas, e depois gestão de instalações na Suíça. Onze anos nesta indústria, em ambos os lados.",
    storyP2: "Ele sabe como é a sensação de a escala chegar no domingo à noite. De faltar material. De ninguém agradecer.",
    storyQuote: "A Kraken PFM foi fundada para fazer as coisas de forma diferente.",
    storyQuoteAuthor: "Antonio, fundador da Kraken PFM",

    promise1Title: "Integração adequada",
    promise1Desc: "Ninguém vai sozinho para um local que não conhece. Fará os seus primeiros turnos com o Antonio ou um colega experiente até se sentir seguro.",
    promise2Title: "Trabalho de teste pago",
    promise2Desc: "Quem trabalha, recebe. Ponto. Connosco não há dias de teste gratuitos. O seu esforço é recompensado justamente.",
    promise3Title: "Salário justo, contas claras",
    promise3Desc: "Respeitamos o contrato coletivo (GAV) do setor de limpeza. As horas são registadas com precisão, os recibos de vencimento são transparentes, incluindo todas as contribuições sociais.",
    promise4Title: "Serviços na sua zona",
    promise4Desc: "Planeamos as suas escalas o mais perto possível da sua residência. Falamos do planeamento consigo antes de o agendar, não depois.",
    promise5Title: "Direto ao chefe",
    promise5Desc: "Problema ou pergunta? Escreva diretamente ao Antonio via WhatsApp. Geralmente receberá uma resposta no mesmo dia, sem rodeios burocráticos.",
    promise6Title: "Equipamento profissional",
    promise6Desc: "Fornecemos fardamento, ferramentas modernas, produtos de limpeza seguros e equipamentos de proteção. A sua segurança vem antes da rapidez.",

    futureTitle: "E o futuro?",
    futureDesc: "Estamos no início. Isto significa que quem entrar agora e quiser assumir responsabilidades crescerá com a empresa. Os primeiros supervisores de equipa da Kraken PFM virão desta primeira tripulação, não serão contratados de fora. Não prometemos uma escada de carreira falsa num cartaz. Prometemos: o bom trabalho é visto aqui. O Antonio é a prova de que nesta indústria se pode passar de limpador a empresário.",

    importantBadge: "O QUE NOS IMPORTA",
    importantTitle: "O que nos importa mais do que um currículo perfeito",
    importantIntro: "Procuramos pessoas de confiança. Para vagas de entrada não precisa de experiência — a atitude importa mais do que os diplomas. Isto é o que esperamos de si:",
    req1Title: "Fiabilidade",
    req1Desc: "Pontualidade e total fiabilidade nos turnos acordados.",
    req2Title: "Trato respeitoso",
    req2Desc: "Comportamento respeitoso com clientes, colegas e bens alheios.",
    req3Title: "Atenção ao detalhe",
    req3Desc: "Um olhar para a limpeza e foco na qualidade durante a execução.",
    req4Title: "Segurança e regras",
    req4Desc: "Disposição constante para cumprir as normas de higiene e segurança.",
    req5Title: "Autorização de trabalho",
    req5Desc: "Possuir uma autorização de trabalho válida para a Suíça.",
    req6Title: "Idiomas",
    req6Desc: "Conhecimentos básicos de alemão OU inglês para comunicação interna.",
    smartphoneAlert: "É necessário um smartphone para listas de verificação digitais simples — não se preocupe, mostramos-lhe exatamente como funciona.",

    positionsBadge: "PROCURAMOS-TE",
    positionsTitle: "As nossas vagas em aberto",
    positionsSubtitle: "Queres fazer parte da primeira tripulação Kraken? Aqui estão as nossas vagas atuais.",
    jobActiveBadge: "VAGA EM ABERTO",
    jobPoolBadge: "BOLSA DE TALENTOS",
    jobSpontaneousBadge: "CANDIDATURA ESPONTÂNEA",

    job1Category: "LIMPEZA E MUDANÇAS",
    job1Title: "Colaborador de Limpeza & Limpeza de Mudança (m/f/d)",
    job1Locations: "Schaffhausen / Winterthur",
    job1Pensum: "A tempo parcial ou por horas",
    job1Start: "imediato",
    job1Desc: "Trabalha com cuidado, autonomia e discrição. Cumpre com os horários acordados e cuida com responsabilidade da propriedade do cliente. Experiência em limpezas de mudança é uma grande vantagem — mas integramos de bom grado novatos motivados.",
    job1Btn: "Candidatar-me agora",

    job2Category: "POR PROJETO / ESPECIALISTA",
    job2Title: "Especialista em Limpeza de Entregas e Limpeza Profunda",
    job2Pensum: "Sob consulta ou por projeto",
    job2Start: "Trabalhos com garantia de entrega",
    job2Desc: "Para os nossos exigentes serviços com garantia de entrega (Abgabegarantie), procuramos profissionais experientes de forma contínua. Conhece os padrões das administrações de imóveis e trabalha de forma rápida e focada em soluções.",
    job2Btn: "Entrar na bolsa de talentos",

    job3Category: "HAUSWART / ALLROUNDER",
    job3Title: "Caretaker / Allrounder com competências manuais",
    job3Pensum: "Recorrente",
    job3Start: "Carta de condução Cat. B preferencial",
    job3Desc: "Para manutenção recorrente de propriedades e pequenos trabalhos de conservação, procuramos allrounders com conhecimentos manuais que consigam identificar e resolver problemas de forma autónoma.",
    job3Btn: "Entrar na bolsa de talentos",

    job4Category: "MULTIDISCIPLINAR",
    job4Title: "Todos os outros perfis",
    job4Pensum: "Jardineiros, carregadores, etc.",
    job4Start: "Sempre bem-vindos",
    job4Desc: "Quer seja jardineiro, carregador, limpador de janelas ou talento administrativo: se é bom no que faz, queremos saber de si. Entraremos em contacto assim que surgir uma oportunidade adequada.",
    job4Btn: "Candidatar-me espontaneamente",

    processBadge: "O CAMINHO ATÉ À EQUIPA",
    processTitle: "Como funciona",
    processIntro: "Aqui não há processos de seleção complexos que duram semanas. Valorizamos a simplicidade, honestidade e rapidez.",
    step1Title: "Inscrição simples",
    step1Desc: "Envie-nos os seus dados através do formulário abaixo ou diretamente pelo WhatsApp. Não precisa de um currículo perfeito.",
    step2Title: "Conversa com o Antonio",
    step2Desc: "Pessoalmente ou por telefone. Conversamos sobre a sua experiência, disponibilidade e expectativas. Pode perguntar tudo o que quiser — inclusive sobre o salário do acordo coletivo.",
    step3Title: "Trabalho de teste pago",
    step3Desc: "Fará um turno real connosco — totalmente pago, claro! É uma forma simples no mundo real de vermos se a química bate e se gosta do trabalho.",
    step4Title: "Proposta clara",
    step4Desc: "A sua função, a sua carga horária, o seu salário exato, a sua região de trabalho e a data de início — tudo por escrito, transparente e vinculante, antes de dar o seu consentimento.",

    fastestWayBadge: "CAMINHO MAIS RÁPIDO",
    ctaTitle: "Pronto para um chefe que sabe como é o seu trabalho?",
    ctaDesc: "Quer tenha experiência ou seja principiante: se é de confiança e valoriza um bom trabalho, entre em contacto. A primeira tripulação da Kraken PFM está a ser formada — e pode estar lá desde o início.",
    btnWhatsApp: "Candidatar via WhatsApp",
    directContact: "Contacto direto: Antonio (+41 77 450 57 05)",
    languageBadge: "IDIOMAS BEM-VINDOS",
    languageText: "Pode escrever-nos ou falar connosco em alemão, inglês, espanhol, português ou italiano. Responderemos no seu idioma preferido.",

    formTitle: "Candidatura Online",
    lblFullName: "Nome e Apelido",
    lblPhone: "Telefone / WhatsApp",
    lblDesiredPosition: "Vaga Pretendida",
    lblRegion: "Região",
    lblWorkPermit: "Autorização de Trabalho",
    lblStart: "Data de Início",
    lblPensum: "Carga Horária Desejada",
    lblCertificates: "Cartas & Certificados",
    lblLanguages: "Idiomas",
    lblCV: "Enviar Currículo (CV)",
    cvPlaceholder: "Selecionar ficheiro ou arrastar",
    cvLimits: "PDF, DOC até ao limite de 5MB",
    lblAboutYou: "Conte-nos brevemente sobre si",

    placeholderFullName: "O seu nome completo",
    placeholderPhone: "ex. +41 77 450 57 05",
    placeholderStart: "ex. imediato / data",
    placeholderCertificates: "ex. Cat. B, carta de plataformas elevatórias",
    placeholderLanguages: "ex. Espanhol, Português, Alemão, Italiano",
    placeholderAboutYou: "ex. Quem é você? O que o motiva? Quando estaria disponível?",

    optPermitYes: "Sim (Autorização válida)",
    optPermitNo: "Não / Ainda sem autorização",
    optPermitCH: "Cidadão suíço",
    optPensumHourly: "Por horas (Flexível)",

    requiredField: "Obrigatório",
    optionalField: "opcional",
    btnSubmit: "Submeter Candidatura",
    btnSubmitting: "A registar dados...",

    successTitle: "Candidatura recebida!",
    successText: "Obrigado pela sua confiança e interesse na Kraken PFM! O Antonio entrará em contacto consigo o mais rápido possível — normalmente em 2 dias úteis.",
    successBtnHome: "Voltar à Página Principal",
    errorMsg: "Erro ao enviar a candidatura. Por favor, contacte o Antonio diretamente através do e-mail info@krakenpfm.ch."
  },
  it: {
    heroBadge: "LAVORA CON NOI IN KRAKEN PFM",
    heroTitle: "Un lavoro di cui essere fieri.",
    heroSubtitle: "Un capo che ha fatto il lavoro in prima persona.",
    heroIntro: "Kraken PFM è una giovane azienda di gestione immobiliare di Sciaffusa. Siamo piccoli, stiamo crescendo — e stiamo costruendo un team in cui il buon lavoro viene riconosciuto e trattato equamente. Fin dall'inizio. Entra a far parte del primo team a Sciaffusa, Winterthur o Zurigo.",
    btnViewPositions: "Vedi le posizioni aperte",
    btnSendSpontaneous: "Invia candidatura spontanea",

    trustFairPayTitle: "Salario Equo",
    trustFairPaySubtitle: "Secondo il contratto collettivo di categoria (GAV)",
    trustPaidTrialTitle: "Pagato",
    trustPaidTrialSubtitle: "Turno di prova — sempre",
    trustDirectLineTitle: "Trato Diretto",
    trustDirectLineSubtitle: "Diretto con il fondatore",
    trustLocalTitle: "Zona Locale",
    trustLocalSubtitle: "Lavoro vicino a te",
    trustEquipmentTitle: "Equipaggiamento",
    trustEquipmentSubtitle: "Fornito professionalmente",
    trustInternationalTitle: "Internazionale",
    trustInternationalSubtitle: "Candidati in 5 lingue",

    whyBadge: "FACCIAMO LE COSE IN MODO DIVERSO",
    whyTitle: "Perché Kraken PFM?",
    whyIntro: "Sinceramente: non siamo una multinazionale. Non c'è un ufficio risorse umane, nessun turno anonimo programmato da una centrale, né un numero di matricola al posto del tuo nome. C'è Antonio, il fondatore. E ci sei tu.",
    storyBadge: "DA PROFESSIONISTI PER PROFESSIONISTI",
    storyTitle: "Il tuo capo ha pulito in prima persona.",
    storyP1: "Antonio ha iniziato la sua carriera como addetto alle pulizie a Londra. Da pulitore a building manager, in seguito responsabile delle vendite, e infine gestione immobiliare in Svizzera. Undici anni in questo settore, da entrambi i lati.",
    storyP2: "Sa cosa si prova quando il turno arriva la domenica sera. Quando manca il materiale. Quando nessuno dice grazie.",
    storyQuote: "Kraken PFM è stata fondata per fare le cose in modo diverso.",
    storyQuoteAuthor: "Antonio, fondatore di Kraken PFM",

    promise1Title: "Onboarding adeguato",
    promise1Desc: "Nessuno viene mandato da solo in un posto che non conosce. Farai i tuoi primi turni insieme ad Antonio o a un collega esperto finché non ti sentirai sicuro.",
    promise2Title: "Prova pagata",
    promise2Desc: "Chi lavora viene pagato. Punto. Con noi non esistono giornate di prova gratuite non pagate. Il tuo lavoro viene compensato in modo equo.",
    promise3Title: "Salario equo, conteggi trasparenti",
    promise3Desc: "Rispettiamo il contratto collettivo (GAV) del settore delle pulizie. Le ore vengono registrate con precisione, le buste paga sono trasparenti, incluse tutte le coperture previdenziali.",
    promise4Title: "Lavori nella tua zona",
    promise4Desc: "Pianifichiamo i tuoi turni il più vicino possibile alla tua residenza. Parliamo della pianificazione con te prima di confermarla, non dopo.",
    promise5Title: "Diretto al capo",
    promise5Desc: "Problemi o domande? Scrivi direttamente ad Antonio via WhatsApp. Di solito riceverai una risposta il giorno stesso, senza passaggi burocratici.",
    promise6Title: "Attrezzatura professionale",
    promise6Desc: "Forniamo abbigliamento da lavoro, strumenti moderni, prodotti di pulizia sicuri e dispositivi di protezione. La tua sicurezza viene prima della velocità.",

    futureTitle: "E il futuro?",
    futureDesc: "Siamo all'inizio. Questo significa che chi entra adesso e vuole assumersi responsabilità crescerà con l'azienda. I primi capiturno di Kraken PFM usciranno da questo primo gruppo, non saranno assunti dall'esterno. Non ti promettiamo una scala di carriera finta su un poster. Ti promettiamo che qui il buon lavoro si nota. Antonio è la prova che in questo settore si può passare da addetto alle pulizie a imprenditore.",

    importantBadge: "COSA CI IMPORTA",
    importantTitle: "Ciò che conta più di un curriculum perfetto",
    importantIntro: "Cerchiamo persone affidabili. Per le posizioni d'ingresso non serve esperienza: l'attitudine conta più dei titoli. Ecco cosa ci aspettiamo da te:",
    req1Title: "Affidabilità",
    req1Desc: "Puntualità e assoluta affidabilità nei turni concordati.",
    req2Title: "Trattamento rispettoso",
    req2Desc: "Comportamento rispettoso verso clienti, colleghi e proprietà altrui.",
    req3Title: "Occhio per i dettagli",
    req3Desc: "Attenzione alla pulizia e consapevolezza della qualità durante l'esecuzione.",
    req4Title: "Sicurezza e regole",
    req4Desc: "Disponibilità costante a rispettare le norme igieniche e le linee guida di sicurezza.",
    req5Title: "Permiso di lavoro",
    req5Desc: "Possesso di un permesso di lavoro valido per la Svizzera.",
    req6Title: "Competenze linguistiche",
    req6Desc: "Conoscenza di base del tedesco O dell'inglese per la comunicazione interna.",
    smartphoneAlert: "È necessario uno smartphone per compilare semplici liste di controllo digitali — non preoccuparti, ti mostreremo esattamente come funziona.",

    positionsBadge: "CERCHIAMO TE",
    positionsTitle: "Le nostre posizioni aperte",
    positionsSubtitle: "Vuoi fare parte del primo team di Kraken? Ecco le nostre attuali opportunità d'ingresso.",
    jobActiveBadge: "POSIZIONE APERTA",
    jobPoolBadge: "SERBATOIO DI TALENTI",
    jobSpontaneousBadge: "CANDIDATURA SPONTANEA",

    job1Category: "PULIZIA E TRASLOCHI",
    job1Title: "Collaboratore Pulizie & Pulizie di fine locazione (m/f/d)",
    job1Locations: "Schaffhausen / Winterthur",
    job1Pensum: "A tempo parziale o a ore",
    job1Start: "subito",
    job1Desc: "Lavori con cura, autonomia e discrezione. Rispetti gli orari concordati e tratti con responsabilità la proprietà del cliente. L'esperienza nelle pulizie di fine locazione è un grande vantaggio, ma formiamo volentieri principianti motivati.",
    job1Btn: "Candidati ora",

    job2Category: "A PROGETTO / SPECIALISTA",
    job2Title: "Specialista in Pulizie di Consegna e Pulizie Profonde",
    job2Pensum: "Su chiamata o a progetto",
    job2Start: "Lavori con garanzia di consegna",
    job2Desc: "Per i nostri esigenti servizi con garanzia di consegna (Abgabegarantie), cerchiamo costantemente professionisti esperti. Conosci gli standard delle amministrazioni immobiliari e lavori in modo rapido e risolutivo.",
    job2Btn: "Entra nel serbatoio dei talenti",

    job3Category: "SUTTUTTO / CUSTODE",
    job3Title: "Custode / Allrounder con abilità manuali",
    job3Pensum: "Ricorrente",
    job3Start: "Patente di guida Cat. B preferibile",
    job3Desc: "Per la manutenzione ricorrente degli immobili e piccoli lavori di riparazione, cerchiamo allrounder con abilità manuali in grado di identificare e risolvere problemi in autonomia.",
    job3Btn: "Entra nel serbatoio dei talenti",

    job4Category: "MULTIDISCIPLINARE",
    job4Title: "Tutti gli altri profili",
    job4Pensum: "Giardinieri, traslocatori, ecc.",
    job4Start: "Sempre benvenuti",
    job4Desc: "Che tu sia giardiniere, traslocatore, lavavetri o talento amministrativo: si sei bravo in quello che fai, vogliamo sentirti. Ci metteremo in contatto non appena si presenterà un'opportunità adatta.",
    job4Btn: "Candidati spontaneamente",

    processBadge: "IL CAMMINO NEL TEAM",
    processTitle: "Come funziona",
    processIntro: "Qui non ci sono processi di selezione complessi che durano settimane. Apprezziamo la semplicità, l'onestà e la rapidità.",
    step1Title: "Candidatura semplice",
    step1Desc: "Inviaci i tuoi dati tramite il modulo sottostante o direttamente via WhatsApp. Non serve un curriculum perfetto.",
    step2Title: "Chiacchierata con Antonio",
    step2Desc: "Di persona o per telefono. Parliamo della tua esperienza, disponibilità e aspettative. Puoi chiedere tutto ciò che vuoi, incluso il salario del contratto collettivo.",
    step3Title: "Turno di prova pagato",
    step3Desc: "Fai un vero turno di lavoro con noi, completamente pagato! È un modo diretto nel mondo reale per capire se andiamo d'accordo e se ti piace il lavoro.",
    step4Title: "Offerta chiara",
    step4Desc: "Il tuo ruolo, il tuo orario, il tuo salario esatto, la tua zona di lavoro e la data di inizio — tutto per iscritto, trasparente e vincolante, prima che tu dia il tuo consenso.",

    fastestWayBadge: "STRADA PIÙ RAPIDA",
    ctaTitle: "Pronto per un capo che sa com'è il tuo lavoro?",
    ctaDesc: "Che tu sia esperto o un principiante: se sei affidabile e tieni al buon lavoro, mettiti in contatto. Si sta costruendo il primo team di Kraken PFM e puoi farne parte fin dall'inizio.",
    btnWhatsApp: "Candidati via WhatsApp",
    directContact: "Contatto diretto: Antonio (+41 77 450 57 05)",
    languageBadge: "LINGUE BENVENUTE",
    languageText: "Puoi scriverci o parlarci in tedesco, inglese, spagnolo, portoghese o italiano. Risponderemo nella tua lingua preferita.",

    formTitle: "Candidatura Online",
    lblFullName: "Nome e Cognome",
    lblPhone: "Telefono / WhatsApp",
    lblDesiredPosition: "Posizione Desiderata",
    lblRegion: "Regione",
    lblWorkPermit: "Permesso di Lavoro",
    lblStart: "Data di Inizio",
    lblPensum: "Orario Desiderato",
    lblCertificates: "Patenti e Certificati",
    lblLanguages: "Lingue",
    lblCV: "Invia il tuo Curriculum (CV)",
    cvPlaceholder: "Seleziona un file o trascinalo qui",
    cvLimits: "PDF, DOC fino a un massimo di 5MB",
    lblAboutYou: "Parlaci brevemente di te",

    placeholderFullName: "Il tuo nome completo",
    placeholderPhone: "es. +41 77 450 57 05",
    placeholderStart: "es. subito / data",
    placeholderCertificates: "es. Cat. B, patentino piattaforme aeree",
    placeholderLanguages: "es. Spagnolo, Portoghese, Tedesco, Italiano",
    placeholderAboutYou: "es. Chi sei? Cosa ti motiva? Quando saresti disponibile?",

    optPermitYes: "Sì (Permesso valido)",
    optPermitNo: "No / Ancora senza permesso",
    optPermitCH: "Cittadino svizzero",
    optPensumHourly: "A ore (Flessibile)",

    requiredField: "Obbligatorio",
    optionalField: "opzionale",
    btnSubmit: "Invia Candidatura",
    btnSubmitting: "Invio dei dati...",

    successTitle: "Candidatura Ricevuta!",
    successText: "Grazie per la fiducia e l'interesse dimostrato per Kraken PFM! Antonio ti ricontatterà al più presto, solitamente entro 2 giorni lavorativi.",
    successBtnHome: "Torna alla Pagina Principale",
    errorMsg: "Errore durante l'invio della candidatura. Si prega di contattare direttamente Antonio all'indirizzo info@krakenpfm.ch."
  },
  fr: {
    heroBadge: "CARRIÈRE CHEZ KRAKEN PFM",
    heroTitle: "Un travail dont vous pouvez être fier.",
    heroSubtitle: "Un patron qui a fait le travail lui-même.",
    heroIntro: "Kraken PFM est une jeune entreprise de facility management basée à Schaffhouse. Nous sommes petits, nous grandissons — et nous construisons une équipe où le bon travail est valorisé et traité équitablement. Dès le début. Rejoignez le premier équipage à Schaffhouse, Winterthur ou Zurich.",
    btnViewPositions: "Voir les postes ouverts",
    btnSendSpontaneous: "Envoyer une candidature spontanée",

    trustFairPayTitle: "Salaire Équitable",
    trustFairPaySubtitle: "Selon la convention de nettoyage (CCT)",
    trustPaidTrialTitle: "Payé",
    trustPaidTrialSubtitle: "Essai de travail — toujours",
    trustDirectLineTitle: "Lien Direct",
    trustDirectLineSubtitle: "Directement avec le patron",
    trustLocalTitle: "Proche de Chez Vous",
    trustLocalSubtitle: "Missions dans votre région",
    trustEquipmentTitle: "Équipement",
    trustEquipmentSubtitle: "Fourni professionnellement",
    trustInternationalTitle: "International",
    trustInternationalSubtitle: "Postuler en 5 langues",

    whyBadge: "NOUS FAISONS LES CHOSES DIFFÉREMMENT",
    whyTitle: "Pourquoi Kraken PFM?",
    whyIntro: "En toute franchise : nous ne sommes pas une multinationale. Il n'y a pas de service RH déconnecté, pas de planning anonyme géré par un siège, ni de numéro à la place de votre nom. Il y a Antonio, le fondateur. Et il y a vous.",
    storyBadge: "PAR DES PROFESSIONNELS POUR DES PROFESSIONNELS",
    storyTitle: "Votre patron a lui-même nettoyé.",
    storyP1: "Antonio a commencé sa carrière comme nettoyeur à Londres. De nettoyeur à gestionnaire de bâtiments, puis responsable des ventes, et enfin facility management en Suisse. Onze ans dans cette industrie, des deux côtés.",
    storyP2: "Il sait ce que l'on ressent quand le planning arrive le dimanche soir. Quand le matériel manque. Quand personne ne dit merci.",
    storyQuote: "Kraken PFM a été créée pour faire les choses autrement.",
    storyQuoteAuthor: "Antonio, fondateur de Kraken PFM",

    promise1Title: "Intégration soignée",
    promise1Desc: "Personne n'est envoyé seul sur un site qu'il ne connaît pas. Vos premières missions se feront aux côtés d'Antonio ou d'un collègue expérimenté jusqu'à ce que vous vous sentiez en confiance.",
    promise2Title: "Essai de travail payé",
    promise2Desc: "Tout travail mérite salaire. Point final. Chez nous, il n'y a pas de jours d'essai gratuits non payés. Votre travail est rémunéré équitablement.",
    promise3Title: "Salaire juste et transparent",
    promise3Desc: "Nous respectons la convention collective de travail (CCT) du secteur du nettoyage. Les heures sont enregistrées avec précision, les fiches de paie sont transparentes, incluant toutes les charges sociales.",
    promise4Title: "Missions dans votre région",
    promise4Desc: "We plan your shifts as close to your home as possible. We discuss the planning with you before we assign the shift — not after.",
    promise4Desc_fr: "Nous planifions vos interventions le plus près possible de chez vous. Nous discutons du planning avec vous avant de le valider, pas après.",
    promise5Title: "Directement au patron",
    promise5Desc: "Un problème ou une question ? Écrivez directement à Antonio via WhatsApp. Vous recevrez généralement une réponse le jour même, sans détours bureaucratiques.",
    promise6Title: "Équipement professionnel",
    promise6Desc: "Les vêtements de travail, les outils modernes, les produits de nettoyage sûrs et les équipements de protection sont entièrement fournis. Votre sécurité passe avant la rapidité.",

    futureTitle: "Et l'avenir ?",
    futureDesc: "Nous sommes au début. Cela signifie que quiconque nous rejoint maintenant et souhaite prendre des responsabilités grandira avec l'entreprise. Les premiers chefs d'équipe de Kraken PFM viendront de ce premier équipage, pas recrutés à l'extérieur. Nous ne vous promettons pas une échelle de carrière bidon sur un poster. Nous vous promettons que le bon travail est vu ici. Antonio est la preuve que dans cette industrie, on peut passer de nettoyeur à entrepreneur.",

    importantBadge: "CE QUI NOUS IMPORTE",
    importantTitle: "Ce qui compte plus pour nous qu'un CV parfait",
    importantIntro: "Nous recherchons des personnes fiables. Pour les postes de débutant, vous n'avez pas besoin d'expérience : l'attitude compte plus que les diplômes. Voici ce que nous attendons de vous :",
    req1Title: "Fiabilité",
    req1Desc: "Ponctualité et fiabilité absolue lors des missions convenues.",
    req2Title: "Respect",
    req2Desc: "Comportement respectueux envers les clients, les collègues et les biens d'autrui.",
    req3Title: "Le sens du détail",
    req3Desc: "Un œil pour la propreté et le souci de la qualité lors de l'exécution.",
    req4Title: "Sécurité et règles",
    req4Desc: "Disposition constante à respecter les normes d'hygiène et les consignes de sécurité.",
    req5Title: "Permis de travail",
    req5Desc: "Disposer d'un permis de travail valide pour la Suisse.",
    req6Title: "Langues",
    req6Desc: "Connaissances de base en allemand OU en anglais pour la communication interne.",
    smartphoneAlert: "Un smartphone pour des listes de contrôle simples est nécessaire — ne vous inquiétez pas, nous vous montrerons exactement comment cela fonctionne.",

    positionsBadge: "NOUS VOUS CHERCHONS",
    positionsTitle: "Nos postes ouverts",
    positionsSubtitle: "Voulez-vous faire partie du premier équipage Kraken ? Voici nos opportunités actuelles.",
    jobActiveBadge: "POSTE OUVERT",
    jobPoolBadge: "BASSIN DE TALENTS",
    jobSpontaneousBadge: "CANDIDATURE SPONTANÉE",

    job1Category: "NETTOYAGE & DÉMÉNAGEMENT",
    job1Title: "Collaborateur de Nettoyage & Fin de bail (h/f/d)",
    job1Locations: "Schaffhausen / Winterthour",
    job1Pensum: "À temps partiel ou sur base horaire",
    job1Start: "immédiat",
    job1Desc: "Vous travaillez avec soin, autonomie et discrétion. Vous respectez les horaires convenus et prenez soin des biens du client. L'expérience dans les nettoyages de fin de bail est un grand atout, mais nous formons avec plaisir les débutants motivés.",
    job1Btn: "Postuler maintenant",

    job2Category: "PAR PROJET / SPÉCIALISTE",
    job2Title: "Spécialiste en Nettoyage de Remise & Nettoyage en Profondeur",
    job2Pensum: "Sur appel ou par projet",
    job2Start: "Missions avec garantie de remise",
    job2Desc: "Pour nos chantiers exigeants avec garantie de remise de clés (Abgabegarantie), nous recherchons en permanence des professionnels expérimentés. Vous connaissez les normes des régies immobilières et travaillez de manière rapide et orientée solutions.",
    job2Btn: "S'inscrire dans le bassin",

    job3Category: "ALLROUNDER / CONCIERGE",
    job3Title: "Concierge / Allrounder avec compétences manuelles",
    job3Pensum: "Récurrent",
    job3Start: "Permis de conduire Cat. B souhaité",
    job3Desc: "Pour l'entretien régulier d'immeubles et les petits travaux de réparation, nous recherchons des allrounders avec des compétences manuelles capables de détecter et résoudre les problèmes de manière autonome.",
    job3Btn: "S'inscrire dans le bassin",

    job4Category: "MULTIDISCIPLINAIRE",
    job4Title: "Tous les autres profils",
    job4Pensum: "Jardiniers, déménageurs, etc.",
    job4Start: "Toujours bienvenus",
    job4Desc: "Que vous soyez jardinier, déménageur, laveur de vitres ou talent administratif : si vous êtes bon dans ce que vous faites, nous voulons vous entendre. Nous vous contacterons dès qu'une opportunité se présentera.",
    job4Btn: "Postuler spontanément",

    processBadge: "LE CHEMIN VERS L'ÉQUIPE",
    processTitle: "Comment ça se passe",
    processIntro: "Chez nous, il n'y a pas de processus de sélection complexe qui dure des semaines. Nous apprécions la simplicité, l'honnêteté et la rapidité.",
    step1Title: "Candidatura simple",
    step1Desc: "Envoyez-nous vos informations via le formulaire ci-dessous ou directement par WhatsApp. Un CV parfait n'est pas nécessaire.",
    step2Title: "Entretien avec Antonio",
    step2Desc: "En personne ou par téléphone. Nous parlons de votre expérience, de votre disponibilité et de vos attentes. Vous pouvez tout demander — y compris sur les salaires de la CCT.",
    step3Title: "Essai de travail payé",
    step3Desc: "Vous faites une mission d'essai réelle avec nous — entièrement payée, bien sûr ! C'est une façon directe de voir si le courant passe et si le travail convient.",
    step4Title: "Offre claire",
    step4Desc: "Votre poste, votre taux d'activité, votre salaire exact, votre région de travail et la date de début — le tout par écrit, transparent et contraignant, avant que vous ne donniez votre accord.",

    fastestWayBadge: "LE CHEMIN LE PLUS RAPIDE",
    ctaTitle: "Prêt pour un patron qui sait ce qu'est votre travail ?",
    ctaDesc: "Que vous soyez expérimenté ou débutant : si vous êtes fiable et accordez de l'importance au bon travail, contactez-nous. Le premier équipage de Kraken PFM est en cours de création — et vous pouvez en faire partie dès le début.",
    btnWhatsApp: "Postuler par WhatsApp",
    directContact: "Contact direct : Antonio (+41 77 450 57 05)",
    languageBadge: "LANGUES BIENVENUES",
    languageText: "Vous pouvez nous écrire ou nous parler en allemand, anglais, espagnol, portugais ou italien. Nous répondrons dans votre langue préférée.",

    formTitle: "Formulaire de Candidature",
    lblFullName: "Nom / Prénom",
    lblPhone: "Téléphone / WhatsApp",
    lblDesiredPosition: "Poste Souhaité",
    lblRegion: "Région",
    lblWorkPermit: "Permis de Travail",
    lblStart: "Date de Début",
    lblPensum: "Taux d'Activité Souhaité",
    lblCertificates: "Permis & Certificats",
    lblLanguages: "Langues",
    lblCV: "Téléverser votre CV",
    cvPlaceholder: "Sélectionner un fichier ou le glisser",
    cvLimits: "PDF, DOC jusqu'à 5 Mo maximum",
    lblAboutYou: "Parlez-nous brièvement de vous",

    placeholderFullName: "Votre nom complet",
    placeholderPhone: "ex. +41 77 450 57 05",
    placeholderStart: "ex. immédiat / date",
    placeholderCertificates: "ex. Cat. B, permis nacelle",
    placeholderLanguages: "ex. Espagnol, Portugais, Allemand, Italiano",
    placeholderAboutYou: "ex. Qui êtes-vous ? Qu'est-ce qui vous motive ? Quand seriez-vous disponible ?",

    optPermitYes: "Oui (Permis valide)",
    optPermitNo: "Non / Pas encore de permis",
    optPermitCH: "Citoyen suisse",
    optPensumHourly: "Sur base horaire (Flexible)",

    requiredField: "Obligatoire",
    optionalField: "optionnel",
    btnSubmit: "Envoyer la Candidature",
    btnSubmitting: "Envoi des données...",

    successTitle: "Candidature Reçue !",
    successText: "Merci de votre confiance et de votre intérêt pour Kraken PFM ! Antonio vous contactera dans les plus brefs délais — généralement sous 2 jours ouvrables.",
    successBtnHome: "Retour à l'accueil",
    errorMsg: "Erreur lors de l'envoi de la candidature. Veuillez contacter Antonio directement à l'adresse info@krakenpfm.ch."
  }
};

// Fill Swiss German and other fallbacks
LOCALIZED_CONTENT['de-CH'] = LOCALIZED_CONTENT['de'];

const CareersPage: React.FC<CareersPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const t = LOCALIZED_CONTENT[language] || LOCALIZED_CONTENT['de'];

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    position: 'Mitarbeiter:in Reinigung & Umzugsreinigung (m/w/d)',
    region: 'Schaffhausen',
    permit: 'Ja',
    startDate: '',
    pensum: 'Stundenbasis',
    certificates: '',
    languages: '',
    message: '',
    cvName: '', 
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvDataUrl, setCvDataUrl] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCvFile(file);
      setFormData(prev => ({ ...prev, cvName: file.name }));

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCvDataUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectJob = (jobTitle: string) => {
    setFormData(prev => ({ ...prev, position: jobTitle }));
    const formElement = document.getElementById('application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Ensure user is authenticated anonymously if not signed in
      if (!auth.currentUser) {
        try {
          const { signInAnonymously } = await import('firebase/auth');
          await signInAnonymously(auth);
        } catch (authErr) {
          console.warn("Could not sign in anonymously prior to job application submission:", authErr);
        }
      }

      const currentUid = auth.currentUser?.uid || 'anonymous_applicant';

      // 2. Upload CV/Image file directly to Firebase Storage if present
      let firebaseStorageCvUrl = '';
      if (cvFile) {
        try {
          const cleanName = formData.name.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Applicant';
          const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const storageRef = ref(storage, `job_applications_cvs/${cleanName}/${uniqueId}_${cvFile.name}`);
          const uploadTask = uploadBytesResumable(storageRef, cvFile);

          firebaseStorageCvUrl = await new Promise<string>((resolve) => {
            uploadTask.on(
              'state_changed',
              null,
              (err) => {
                console.warn("Firebase Storage upload error, using fallback:", err);
                resolve('');
              },
              async () => {
                try {
                  const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve(downloadUrl);
                } catch (e) {
                  console.warn("Error getting download URL from Firebase Storage:", e);
                  resolve('');
                }
              }
            );
          });
        } catch (stErr) {
          console.warn("Firebase Storage upload exception:", stErr);
        }
      }

      // Safe fallback if Firebase Storage URL was not obtained
      let safeCvData = cvDataUrl || '';
      if (!firebaseStorageCvUrl && safeCvData && safeCvData.length > 650000) {
        console.warn("CV base64 string exceeds 650KB; truncating inline payload to prevent Firestore 1MB limit.");
        safeCvData = `[CV attached: ${cvFile ? cvFile.name : 'File'} (${Math.round((cvFile?.size || 0) / 1024)} KB)]`;
      }

      const finalCvLink = firebaseStorageCvUrl || safeCvData;

      // 3. Save application to Firestore collection 'job_applications'
      const newAppId = doc(collection(db, 'job_applications')).id;
      const appRef = doc(db, 'job_applications', newAppId);

      const firestorePayload = {
        id: newAppId,
        userId: currentUid,
        name: formData.name.trim() || 'Candidate',
        phone: formData.phone.trim() || 'N/A',
        position: formData.position || 'General Applicant',
        region: formData.region || 'Schaffhausen',
        permit: formData.permit || 'Ja',
        startDate: formData.startDate || 'Immediato',
        pensum: formData.pensum || 'Full-time / Part-time',
        certificates: formData.certificates || '',
        languages: formData.languages || '',
        message: formData.message || '',
        cvName: cvFile ? cvFile.name : (formData.cvName || ''),
        cvData: finalCvLink,
        cvUrl: firebaseStorageCvUrl || '',
        cvType: cvFile ? cvFile.type : '',
        status: 'Pending' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Helper for promise timeouts
      const withTimeout = <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
        ]);
      };

      const firestorePromise = withTimeout(
        setDoc(appRef, firestorePayload)
          .then(() => true)
          .catch(fsErr => {
            console.error("Firestore job application creation error:", fsErr);
            return false;
          }),
        7000,
        false
      );

      // 4. Prepare Make.com Payload with timeout
      const webhookPromise = withTimeout(
        fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'JOB_APPLICATION_V2',
            ...formData,
            cvName: cvFile ? cvFile.name : (formData.cvName || ''),
            languageUsed: language,
            timestamp: new Date().toISOString()
          })
        })
          .then(() => true)
          .catch(whErr => {
            console.warn("Make webhook notification error:", whErr);
            return false;
          }),
        5000,
        false
      );

      // 5. Format rich message for EmailJS with timeout
      const emailPromise = withTimeout(
        emailjs.send(SERVICE_ID, TEMPLATE_ID, {
          from_name: formData.name,
          from_email: 'N/A',
          phone_number: formData.phone,
          services_interest: `JOB_APPLICATION: ${formData.position}`,
          message: `New applicant for: ${formData.position}
Name: ${formData.name}
Phone/WhatsApp: ${formData.phone}
Region: ${formData.region}
Work Permit: ${formData.permit}
Earliest Start: ${formData.startDate}
Pensum: ${formData.pensum}
License/Certificates: ${formData.certificates || 'N/A'}
Languages: ${formData.languages || 'N/A'}
Message: ${formData.message || 'N/A'}
CV Filename: ${formData.cvName || 'None'}
Language: ${language}`.trim(),
          property_address: 'N/A'
        }, PUBLIC_KEY)
          .then(() => true)
          .catch(emErr => {
            console.warn("EmailJS send error:", emErr);
            return false;
          }),
        5000,
        false
      );

      await Promise.allSettled([firestorePromise, webhookPromise, emailPromise]);

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission encountered an unexpected error:', err);
      // Fallback transition to submission screen if candidate tried to submit
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-40 pb-24 text-center px-4 relative overflow-hidden">
        <CurriculumsConfetti />
        <div className="max-w-xl w-full bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl animate-fade-in-up border border-slate-100 z-10 relative">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-[#002D5B] mb-4 uppercase tracking-tight">{t.successTitle}</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            {t.successText}
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-[#002D5B] text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#001D3D] transition-all shadow-xl hover:shadow-2xl active:scale-95"
          >
            {t.successBtnHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 selection:bg-blue-500/30 text-[#020617] pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* --- 1. HERO PRINCIPAL --- */}
        <div id="careers-hero-container" className="relative rounded-[3rem] overflow-hidden bg-[#001D3D] text-white p-8 md:p-16 shadow-2xl mb-12 animate-fade-in min-h-[480px] flex items-center">
          {/* Static Background Image occupying the DIV completely */}
          <div id="careers-hero-bg-wrapper" className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#001D3D]">
            <img 
              id="careers-hero-bg-image"
              src="/ChatGPT Image Jul 16, 2026, 03_06_15 AM.png" 
              alt="Kraken Careers Background" 
              className="absolute right-0 top-0 w-full md:w-[50%] h-full object-cover z-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                console.error("Failed to load background image:", e);
              }}
            />
            {/* Desktop: Smooth transition from solid blue behind the text to transparency over the image */}
            {/* The overlay is restricted to the left 65%, fading to 100% transparency so the right portion of the image is completely unfiltered and sharp */}
            <div className="absolute inset-y-0 left-0 w-full md:w-[65%] bg-gradient-to-r from-[#001D3D] via-[#001D3D] to-transparent z-10 md:block hidden pointer-events-none" />
            
            {/* Mobile: Clean overlay to guarantee legibility of the white text over the background image, with absolutely NO blur or dulling filters */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#001D3D] via-[#001D3D]/75 to-transparent z-10 md:hidden block pointer-events-none" />
          </div>

          {/* Subtle glowing orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
            <div className="max-w-2xl text-left">
              <span className="inline-block bg-[#007AFF]/20 text-blue-300 font-black text-[10px] uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">
                {t.heroBadge}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-4">
                {t.heroTitle}
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-300 tracking-tight mb-8">
                {t.heroSubtitle}
              </h2>
              <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed mb-10 max-w-xl">
                {t.heroIntro}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('open-positions')}
                  className="bg-[#007AFF] text-white hover:bg-[#005bb7] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Briefcase className="w-4 h-4" /> {t.btnViewPositions}
                </button>
                <button 
                  onClick={() => scrollToSection('application-form')}
                  className="border-2 border-white/30 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" /> {t.btnSendSpontaneous}
                </button>
              </div>
            </div>

            {/* Spacer so content matches the background image layout beautifully */}
            <div className="hidden lg:block w-80 h-80 shrink-0" />
          </div>
        </div>

        {/* --- FRANJA DE CONFIANZA --- */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          <div className="flex flex-col items-center text-center p-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007AFF] mb-3 shadow-inner">
              <Coins className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{t.trustFairPayTitle}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.trustFairPaySubtitle}</span>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007AFF] mb-3 shadow-inner">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{t.trustPaidTrialTitle}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.trustPaidTrialSubtitle}</span>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007AFF] mb-3 shadow-inner">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{t.trustDirectLineTitle}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.trustDirectLineSubtitle}</span>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007AFF] mb-3 shadow-inner">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{t.trustLocalTitle}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.trustLocalSubtitle}</span>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007AFF] mb-3 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{t.trustEquipmentTitle}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.trustEquipmentSubtitle}</span>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007AFF] mb-3 shadow-inner">
              <Languages className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{t.trustInternationalTitle}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.trustInternationalSubtitle}</span>
          </div>
        </div>


        {/* --- 2. WARUM KRAKEN PFM? --- */}
        <div className="mb-20 text-left">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black text-[#007AFF] uppercase tracking-[0.25em] mb-3 block">{t.whyBadge}</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#002D5B] uppercase tracking-tight">{t.whyTitle}</h2>
            <p className="text-slate-500 font-medium mt-4 leading-relaxed">
              {t.whyIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Left: Antonio's Personal Story */}
            <div className="lg:col-span-5 bg-gradient-to-b from-white to-slate-100 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
              
              <div className="relative z-10">
                <span className="bg-[#002D5B] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 inline-block">
                  {t.storyBadge}
                </span>
                <h3 className="text-2xl font-black text-[#002D5B] uppercase tracking-tight mb-6">
                  {t.storyTitle}
                </h3>
                <div className="space-y-4 text-slate-600 text-sm font-medium leading-relaxed">
                  <p>{t.storyP1}</p>
                  <p>{t.storyP2}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200/60 relative z-10">
                <p className="text-base font-black text-[#002D5B] italic leading-snug">
                  "{t.storyQuote}"
                </p>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-wider">— {t.storyQuoteAuthor}</p>
              </div>
            </div>

            {/* Right: What it means specifically */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Promise 1 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-[#007AFF] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-base text-[#002D5B] mb-2">{t.promise1Title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t.promise1Desc}
                  </p>
                </div>

                {/* Promise 2 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-[#007AFF] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-base text-[#002D5B] mb-2">{t.promise2Title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t.promise2Desc}
                  </p>
                </div>

                {/* Promise 3 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-[#007AFF] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                    <Coins className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-base text-[#002D5B] mb-2">{t.promise3Title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t.promise3Desc}
                  </p>
                </div>

                {/* Promise 4 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-[#007AFF] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-base text-[#002D5B] mb-2">{t.promise4Title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t.promise4Desc_fr && language === 'fr' ? t.promise4Desc_fr : t.promise4Desc}
                  </p>
                </div>

                {/* Promise 5 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-[#007AFF] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-base text-[#002D5B] mb-2">{t.promise5Title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t.promise5Desc}
                  </p>
                </div>

                {/* Promise 6 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-[#007AFF] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-base text-[#002D5B] mb-2">{t.promise6Title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t.promise6Desc}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Und die Zukunft Section */}
          <div className="bg-[#002D5B] text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl mt-8 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
              <Award className="w-80 h-80" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">{t.futureTitle}</h4>
              <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
                {t.futureDesc}
              </p>
            </div>
          </div>
        </div>


        {/* --- 3. LO QUE BUSCAMOS --- */}
        <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-14 shadow-sm mb-20 text-left">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-black text-[#007AFF] uppercase tracking-wider block mb-2">{t.importantBadge}</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#002D5B] uppercase tracking-tight">
              {t.importantTitle}
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mt-4">
              {t.importantIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#002D5B] mb-1">{t.req1Title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {t.req1Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#002D5B] mb-1">{t.req2Title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {t.req2Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#002D5B] mb-1">{t.req3Title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {t.req3Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#002D5B] mb-1">{t.req4Title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {t.req4Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#002D5B] mb-1">{t.req5Title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {t.req5Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#002D5B] mb-1">{t.req6Title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {t.req6Desc}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mt-10 text-slate-700 font-bold text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#007AFF] shrink-0" />
            <span>
              {t.smartphoneAlert}
            </span>
          </div>
        </div>


        {/* --- 4. VACANTES (OFFENE STELLEN) --- */}
        <div id="open-positions" className="mb-20 text-left scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black text-[#007AFF] uppercase tracking-wider block mb-2">{t.positionsBadge}</span>
            <h2 className="text-3xl font-black text-[#002D5B] uppercase tracking-tight">{t.positionsTitle}</h2>
            <p className="text-slate-500 font-medium text-sm mt-3">
              {t.positionsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Offene Stelle (ACTIVA) */}
            <div className="bg-white border-2 border-[#007AFF] rounded-[2.5rem] p-8 shadow-md relative flex flex-col justify-between hover:shadow-xl transition-all group">
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                  {t.jobActiveBadge}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">{t.job1Category}</span>
                <h3 className="text-xl font-black text-[#002D5B] mb-4 leading-tight">
                  {t.job1Title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full">{t.job1Locations}</span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full">{t.job1Pensum}</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-3 py-1 rounded-full">{t.job1Start}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-medium mb-8">
                  {t.job1Desc}
                </p>
              </div>

              <button 
                onClick={() => handleSelectJob(t.job1Title)}
                className="w-full bg-[#002D5B] hover:bg-[#007AFF] text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {t.job1Btn} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Talentpool */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 inline-block">
                  {t.jobPoolBadge}
                </span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">{t.job2Category}</span>
                <h3 className="text-xl font-black text-[#002D5B] mb-4 leading-tight">
                  {t.job2Title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full">{t.job2Pensum}</span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full">{t.job2Start}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-medium mb-8">
                  {t.job2Desc}
                </p>
              </div>

              <button 
                onClick={() => handleSelectJob(`${t.job2Title} (${t.jobPoolBadge})`)}
                className="w-full border-2 border-[#002D5B] hover:bg-[#002D5B] text-[#002D5B] hover:text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {t.job2Btn} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Talentpool Hauswart */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 inline-block">
                  {t.jobPoolBadge}
                </span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">{t.job3Category}</span>
                <h3 className="text-xl font-black text-[#002D5B] mb-4 leading-tight">
                  {t.job3Title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full">{t.job3Pensum}</span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full">{t.job3Start}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-medium mb-8">
                  {t.job3Desc}
                </p>
              </div>

              <button 
                onClick={() => handleSelectJob(`${t.job3Title} (${t.jobPoolBadge})`)}
                className="w-full border-2 border-[#002D5B] hover:bg-[#002D5B] text-[#002D5B] hover:text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {t.job3Btn} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 4: Initiativbewerbung */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <span className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 inline-block">
                  {t.jobSpontaneousBadge}
                </span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">{t.job4Category}</span>
                <h3 className="text-xl font-black text-[#002D5B] mb-4 leading-tight">
                  {t.job4Title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full">{t.job4Pensum}</span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full">{t.job4Start}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-medium mb-8">
                  {t.job4Desc}
                </p>
              </div>

              <button 
                onClick={() => handleSelectJob(`${t.job4Title} (${t.jobSpontaneousBadge})`)}
                className="w-full border-2 border-dashed border-[#002D5B] hover:bg-[#002D5B] text-[#002D5B] hover:text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {t.job4Btn} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>


        {/* --- 5. SELECTION PROCESS --- */}
        <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-14 shadow-sm mb-20 text-left">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-black text-[#007AFF] uppercase tracking-wider block mb-2">{t.processBadge}</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#002D5B] uppercase tracking-tight">{t.processTitle}</h2>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mt-4">
              {t.processIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative">
              <div className="text-5xl font-black text-[#007AFF]/20 mb-4">01</div>
              <h4 className="font-extrabold text-lg text-[#002D5B] mb-2">{t.step1Title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-5xl font-black text-[#007AFF]/20 mb-4">02</div>
              <h4 className="font-extrabold text-lg text-[#002D5B] mb-2">{t.step2Title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="text-5xl font-black text-[#007AFF]/20 mb-4">03</div>
              <h4 className="font-extrabold text-lg text-[#002D5B] mb-2">{t.step3Title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {t.step3Desc}
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="text-5xl font-black text-[#007AFF]/20 mb-4">04</div>
              <h4 className="font-extrabold text-lg text-[#002D5B] mb-2">{t.step4Title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {t.step4Desc}
              </p>
            </div>

          </div>
        </div>


        {/* --- 6. CIERRE Y FORMULARIO --- */}
        <div id="application-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start scroll-mt-24 text-left">
          
          {/* Left Block: WhatsApp and Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-gradient-to-b from-white to-slate-100 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <span className="inline-block bg-[#25D366]/20 text-[#1ebd59] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                {t.fastestWayBadge}
              </span>
              <h3 className="text-2xl font-black text-[#002D5B] uppercase tracking-tight">
                {t.ctaTitle}
              </h3>
              <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed">
                {t.ctaDesc}
              </p>

              {/* Direct WhatsApp Action Button */}
              <a 
                href={`https://wa.me/41774505705?text=Hallo%20Antonio%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Stelle%20bei%20Kraken%20PFM%20und%20m%C3%B6chte%20mich%20gerne%20bewerben.%20(Sprache%3A%20${language})`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white hover:bg-[#1ebd59] active:scale-95 transition-all w-full py-5 rounded-2xl shadow-lg hover:shadow-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer"
              >
                <Phone className="w-5 h-5 fill-white text-[#25D366]" /> {t.btnWhatsApp}
              </a>

              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
                {t.directContact}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 text-slate-700 p-6 rounded-[2rem] space-y-3">
              <h5 className="font-extrabold text-xs text-[#002D5B] uppercase tracking-wider">{t.languageBadge}</h5>
              <p className="text-[11px] leading-relaxed font-bold">
                {t.languageText}
              </p>
            </div>
          </div>

          {/* Right Block: Application Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black text-[#002D5B] mb-8 uppercase tracking-tight">
                {t.formTitle}
              </h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-tight">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6 text-xs md:text-sm">
                
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.lblFullName} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="name" 
                    required 
                    type="text"
                    placeholder={t.placeholderFullName}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#007AFF] focus:bg-white outline-none font-bold text-sm transition-all" 
                    onChange={handleInputChange} 
                    value={formData.name} 
                  />
                </div>

                {/* Telefon / WhatsApp */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.lblPhone} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="phone" 
                    required 
                    type="tel"
                    placeholder={t.placeholderPhone}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#007AFF] focus:bg-white outline-none font-bold text-sm transition-all" 
                    onChange={handleInputChange} 
                    value={formData.phone} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gewünschte Stelle */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {t.lblDesiredPosition} <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="position" 
                      required 
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#007AFF] focus:bg-white outline-none font-bold text-xs md:text-sm transition-all cursor-pointer"
                      value={formData.position} 
                      onChange={handleInputChange}
                    >
                      <option value="Mitarbeiter:in Reinigung & Umzugsreinigung (m/w/d)">{LOCALIZED_CONTENT.de.job1Title}</option>
                      <option value="Spezialist:in Umzugs- & Tiefenreinigung (Talentpool)">{LOCALIZED_CONTENT.de.job2Title} ({LOCALIZED_CONTENT.de.jobPoolBadge})</option>
                      <option value="Hauswart:in / Allrounder:in mit handwerklichem Geschick (Talentpool)">{LOCALIZED_CONTENT.de.job3Title} ({LOCALIZED_CONTENT.de.jobPoolBadge})</option>
                      <option value="Initiativbewerbung / Andere Profile">{LOCALIZED_CONTENT.de.job4Title} ({LOCALIZED_CONTENT.de.jobSpontaneousBadge})</option>
                    </select>
                  </div>

                  {/* Region */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {t.lblRegion} <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="region" 
                      required 
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#007AFF] focus:bg-white outline-none font-bold text-xs md:text-sm transition-all cursor-pointer"
                      value={formData.region} 
                      onChange={handleInputChange}
                    >
                      <option value="Schaffhausen">Schaffhausen</option>
                      <option value="Winterthur">Winterthur</option>
                      <option value="Zürich">Zürich</option>
                      <option value="flexibel">Flexibel / Alle Regionen</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Arbeitsbewilligung */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {t.lblWorkPermit} <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="permit" 
                      required 
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#007AFF] focus:bg-white outline-none font-bold text-xs md:text-sm transition-all cursor-pointer"
                      value={formData.permit} 
                      onChange={handleInputChange}
                    >
                      <option value="Ja">{t.optPermitYes}</option>
                      <option value="Nein">{t.optPermitNo}</option>
                      <option value="CH-Bürger:in">{t.optPermitCH}</option>
                    </select>
                  </div>

                  {/* Frühestmöglicher Start */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {t.lblStart} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="startDate" 
                      required 
                      type="text" 
                      placeholder={t.placeholderStart}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#007AFF] focus:bg-white outline-none font-bold text-sm transition-all" 
                      onChange={handleInputChange} 
                      value={formData.startDate} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gewünschtes Pensum */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {t.lblPensum} <span className="text-slate-300 font-bold">({t.optionalField})</span>
                    </label>
                    <select 
                      name="pensum" 
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#007AFF] focus:bg-white outline-none font-bold text-xs md:text-sm transition-all cursor-pointer"
                      value={formData.pensum} 
                      onChange={handleInputChange}
                    >
                      <option value="Stundenbasis">{t.optPensumHourly}</option>
                      <option value="20-40%">20% - 40%</option>
                      <option value="40-60%">40% - 60%</option>
                      <option value="60-80%">60% - 80%</option>
                      <option value="80-100%">80% - 100%</option>
                    </select>
                  </div>

                  {/* Führerausweis / Zertifikate */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {t.lblCertificates} <span className="text-slate-300 font-bold">({t.optionalField})</span>
                    </label>
                    <input 
                      name="certificates" 
                      type="text" 
                      placeholder={t.placeholderCertificates}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#007AFF] focus:bg-white outline-none font-bold text-sm transition-all" 
                      onChange={handleInputChange} 
                      value={formData.certificates} 
                    />
                  </div>
                </div>

                {/* Sprachen */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.lblLanguages} <span className="text-slate-300 font-bold">({t.optionalField})</span>
                  </label>
                  <input 
                    name="languages" 
                    type="text" 
                    placeholder={t.placeholderLanguages}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#007AFF] focus:bg-white outline-none font-bold text-sm transition-all" 
                    onChange={handleInputChange} 
                    value={formData.languages} 
                  />
                </div>

                {/* CV Uploader */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.lblCV} <span className="text-slate-300 font-bold">({t.optionalField})</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 hover:border-[#007AFF] transition-all relative group/upload cursor-pointer">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={handleFileChange} 
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007AFF] group-hover/upload:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      {formData.cvName ? (
                        <span className="font-extrabold text-[#002D5B] text-xs">{formData.cvName}</span>
                      ) : (
                        <>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{t.cvPlaceholder}</span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{t.cvLimits}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message / Erzähl uns kurz von dir */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.lblAboutYou} <span className="text-slate-300 font-bold">({t.optionalField})</span>
                  </label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    placeholder={t.placeholderAboutYou}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#007AFF] focus:bg-white outline-none font-bold text-sm transition-all" 
                    onChange={handleInputChange} 
                    value={formData.message}
                  />
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-[#002D5B] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black transition-all disabled:opacity-70 mt-4 uppercase tracking-widest text-xs cursor-pointer active:scale-98"
                >
                  {isLoading ? t.btnSubmitting : t.btnSubmit}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default CareersPage;
