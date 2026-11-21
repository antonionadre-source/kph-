import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import compression from "compression";
import fs from "fs";
import { createServer } from "node:http";
import { paymentHandlers } from './server/payments.ts';
import { draftTransferHandler } from './server/draftTransfer.ts';
import { CHAT_INSTRUCTION, validateChat, createRateLimiter } from './server/chatPolicy.ts';
import { renderInitialHtml, languageFromRequest } from './server/html.ts';
import { getMetadataForPath, isRouteValid, VALID_CITIES } from "./seoConfig.ts";
import { MUNICIPALITIES } from "./src/data/locations.ts";
// No need to define currentDirname or use import.meta.url as they are unused and cause a parse-time SyntaxError in bundled CommonJS on startup.

dotenv.config({ path: [".env.local", ".env"] });
const isBundled = typeof __filename !== "undefined" && __filename.endsWith("server.cjs");
const runningOnVercel = process.env.VERCEL === "1";
process.env.NODE_ENV = (isBundled || runningOnVercel) ? "production" : (process.env.NODE_ENV || "development");
const isDev = process.env.NODE_ENV !== "production";
const externalIntegrationsEnabled = process.env.VERCEL_ENV === "preview"
  ? false
  : process.env.ALLOW_EXTERNAL_INTEGRATIONS === "true";

// Vercel imports the app; the ordinary dev/start commands retain their HTTP listener.
const app = express();
export default app;

async function startServer() {
  const server = createServer(app);

  app.use(compression());
  app.disable('x-powered-by');
  app.set('trust proxy', runningOnVercel ? 1 : false);
  app.use(cors({ origin: process.env.APP_URL || false }));
  app.use(express.json({ limit: '100kb', verify: (req, _res, body) => { (req as any).rawBody = body; } }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/download-zip", (req, res) => {
    const zipPath = path.join(process.cwd(), "public", "sitio-web-completo.zip");
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, "sitio-web-completo.zip");
    } else {
      res.status(404).send("File not found");
    }
  });

  const payments = paymentHandlers();
  const paymentLimit = createRateLimiter(12, 60000);
  app.post('/api/payrexx/create-gateway', (req, res) => {
    if (!paymentLimit(req.ip || req.socket.remoteAddress || 'unknown')) return res.status(429).json({ success: false, error: 'Too many payment requests. Please wait.' });
    return payments.gateway(req, res);
  });
  app.post('/api/payrexx/webhook', payments.webhook);

  const transferDrafts = draftTransferHandler();
  const transferLimit = createRateLimiter(10, 60000);
  app.post('/api/bookings/transfer-drafts', (req, res) => {
    if (!transferLimit(req.ip || req.socket.remoteAddress || 'unknown')) return res.status(429).json({ success: false, error: 'Please wait before retrying the draft transfer.' });
    return transferDrafts(req, res);
  });

  const FALLBACK_LANGS: Record<string, Record<string, string>> = {
    de: {
      greet: "Hallo! Ich bin Kai, dein virtueller Assistent von Kraken Properties & Facilities Management. 🐙 Wie kann ich dir heute helfen?\n\nDu kannst mich nach unseren Dienstleistungen fragen (Gebäudereinigung, Hauswartung, Gartenpflege) oder direkt ein Beratungsgespräch anfordern!",
      cleaning: "Bei Kraken Properties bieten wir professionelle **Gebäudereinigung**, **Unterhaltsreinigung**, **Fensterreinigung** und **Sonderreinigung** für Firmen und Privatpersonen an.\n\nGerne erstellen wir ein passendes Konzept. Möchtest du eine Offerte berechnen lassen?",
      maintenance: "Unsere umfassende **Hauswartung** sorgt für den Werterhalt deiner Liegenschaft. Wir kümmern uns um die Haustechnik, kleine Reparaturen, Haustechnik-Kontrollen und die allgemeine Sicherheit.\n\nMöchtest du, dass wir deine Liegenschaft betreuen? Lass es uns wissen!",
      garden: "Unsere **Gartenpflege** hält deine Grünflächen das ganze Jahr über in Top-Zustand. Wir übernehmen Rasenmähen, Heckenschnitt, Unkrautbeseitigung und saisonale Pflege.\n\nMöchtest du ein unverbindliches Angebot für deinen Garten erhalten?",
      quote: "Gerne erstellen wir dir eine massgeschneiderte Offerte! Nutze am besten unseren interaktiven Offertenrechner auf der Seite oder gib mir kurz an, um welche Dienstleistung (z.B. Reinigung) und welche Flächengrösse es geht.",
      contact: "Du erreichst unser Team telefonisch unter **+41 77 450 57 05** oder per E-Mail unter **info@krakenpfm.ch**.\n\nAlternativ kannst du auch das Kontaktformular unten auf der Seite ausfüllen.",
      booking: "Gerne reservieren wir einen Beratungstermin für dich! Klicke einfach auf 'Termin buchen' oder nutze das Buchungsformular auf unserer Webseite.",
      thanks: "Sehr gerne! Wenn du weitere Fragen hast oder Unterstützung benötigst, bin ich jederzeit für dich da. Ich wünsche dir einen erfolgreichen Tag!",
      default: "Gerne helfe ich Ihnen bei Reinigung, Hauswartung, Umzug oder Gartenpflege. Welche Dienstleistung, Postleitzahl und welchen Termin benötigen Sie? Unter /quote erhalten Sie eine unverbindliche Schätzung; das Team bestätigt das endgültige Angebot. Kontakt: kai@krakenpfm.ch."
    },
    en: {
      greet: "Hello! I'm Kai, your digital assistant for Kraken Properties & Facilities Management. 🐙 How can I assist you today?\n\nYou can ask me about our services (building cleaning, facility maintenance, garden care) or directly request a consultation!",
      cleaning: "At Kraken Properties, we provide professional **building cleaning**, **regular maintenance cleaning**, **window cleaning**, and **specialized cleaning** for commercial and residential properties.\n\nWould you like to calculate an estimate or request a quote?",
      maintenance: "Our **facility maintenance** and caretaker services ensure that your property remains in top-tier condition. We cover building systems, minor repairs, inspections, and waste management.\n\nWould you like us to look after your property? Let's discuss!",
      garden: "Our **garden care** keeps your green spaces beautiful all year round. We do lawn mowing, hedge trimming, weeding, and seasonal gardening.\n\nWould you like a free estimate for your garden?",
      quote: "We would be glad to send you a customized quote! You can use our interactive quote generator on the page, or let me know the service you need and the approximate size of the area.",
      contact: "You can contact our team via phone at **+41 77 450 57 05** or email us at **info@krakenpfm.ch**.\n\nWe look forward to hearing from you!",
      booking: "I can help you book a free consultation! You can schedule one directly using the 'Book Consultation' form on the site.",
      thanks: "You're very welcome! If you need any more information or assistance, feel free to ask. Have an amazing day!",
      default: "I can help with cleaning, caretaking, moving or garden care. Which service, postcode and date do you need? Use /quote for a non-binding estimate; the team will confirm the final offer. Contact: kai@krakenpfm.ch."
    },
    fr: {
      greet: "Bonjour ! Je suis Kai, votre assistant virtuel pour Kraken Properties & Facilities Management. 🐙 Comment puis-je vous aider aujourd'hui ?\n\nVous pouvez me poser des questions sur nos services (nettoyage de bâtiment, entretien, jardinage) ou demander directement une consultation !",
      cleaning: "Chez Kraken Properties, nous proposons des services professionnels de **nettoyage de bâtiments**, **nettoyage d'entretien**, **nettoyage de vitres** et **nettoyages spéciaux** pour les entreprises et les particuliers.\n\nSouhaitez-vous calculer une estimation ou demander un devis ?",
      maintenance: "Notre service d'**entretien d'immeubles** et de conciergerie garantit le maintien en parfait état de votre propriété. Nous gérons la technique du bâtiment, les petites réparations et les contrôles.\n\nSouhaitez-vous que nous prenions soin de votre propriété ? Discutons-en !",
      garden: "Notre service d'**entretien de jardin** maintient vos espaces verts magnifiques toute l'année. Nous nous occupons de la tonte de pelouse, de la taille des haies et du désherbage.\n\nSouhaitez-vous une estimation gratuite pour votre jardin ?",
      quote: "Nous serions ravis de vous envoyer un devis personnalisé ! Vous pouvez utiliser notre générateur de devis interactif sur la page, ou m'indiquer le service souhaité et la surface approximative.",
      contact: "Vous pouvez contacter notre équipe par téléphone au **+41 77 450 57 05** ou par e-mail à **info@krakenpfm.ch**.\n\nNous nous réjouissons de vous entendre !",
      booking: "Je peux vous aider à réserver une consultation gratuite ! Vous pouvez planifier cela directement en utilisant le formulaire sur le site.",
      thanks: "De rien ! Si vous avez besoin de plus d'informations ou d'aide, n'hésitez pas à demander. Passez une excellente journée !",
      default: "Je peux vous aider pour le nettoyage, la conciergerie, le déménagement ou le jardin. Quel service, code postal et date souhaitez-vous ? Utilisez /quote pour une estimation sans engagement ; notre équipe confirmera l’offre finale. Contact : kai@krakenpfm.ch."
    },
    es: {
      greet: "¡Hola! Soy Kai, su asistente virtual de Kraken Properties & Facilities Management. 🐙 ¿Cómo le puedo ayudar hoy?\n\n¡Puede preguntarme sobre nuestros servicios (limpieza de edificios, mantenimiento de instalaciones, cuidado de jardines) o solicitar directamente una consulta!",
      cleaning: "En Kraken Properties, ofrecemos servicios profesionales de **limpieza de edificios**, **limpieza de mantenimiento regular**, **limpieza de ventanas** y **limpiezas especiales** para propiedades comerciales y residenciales.\n\n¿Le gustaría calcular una estimación o solicitar un presupuesto?",
      maintenance: "Nuestro servicio de **mantenimiento de instalaciones** y conserjería garantiza que su propiedad se mantenga en excelentes condiciones. Cubrimos sistemas del edificio, pequeñas reparaciones e inspecciones.\n\n¿Le gustaría que cuidemos de su propiedad? ¡Hablemos!",
      garden: "Nuestro servicio de **cuidado de jardines** mantiene sus áreas verdes hermosas todo el año. Realizamos corte de césped, poda de setos, deshierbe y jardinería estacional.\n\n¿Le gustaría una estimación gratuita para su jardín?",
      quote: "¡Estaremos encantados de enviarle un presupuesto personalizado! Puede utilizar nuestro generador interactivo de presupuestos en la página, o indicarme el servicio que necesita y el tamaño aproximado de la superficie.",
      contact: "Puede ponerse en contacto con nuestro equipo por teléfono al **+41 77 450 57 05** o por correo electrónico a **info@krakenpfm.ch**.\n\n¡Esperamos tener noticias suyas!",
      booking: "¡Puedo ayudarle a reservar una consulta gratuita! Puede programar una directamente utilizando el formulario en el sitio.",
      thanks: "¡De nada! Si necesita más información o ayuda, no dude en preguntar. ¡Que tenga un día excelente!",
      default: "Puedo ayudarte con limpieza, mantenimiento, mudanzas o jardín. ¿Qué servicio necesitas, en qué código postal y para qué fecha? En /quote puedes calcular una estimación sin compromiso; nuestro equipo confirmará la oferta final. Contacto: kai@krakenpfm.ch."
    },
    it: {
      greet: "Ciao! Sono Kai, il tuo assistente virtuale per Kraken Properties & Facilities Management. 🐙 Come posso aiutarti oggi?\n\nPuoi chiedermi informazioni sui nostri servizi (pulizia di edifici, manutenzione impianti, cura del giardino) o richiedere direttamente una consulenza!",
      cleaning: "Presso Kraken Properties, offriamo servizi professionali di **pulizia di edifici**, **pulizia di manutenzione regolare**, **pulizia di vetri** e **pulizie speciali** per proprietà commerciali e residenziali.\n\nDesideri calcolare una stima o richiedere un preventivo?",
      maintenance: "Il nostro servizio di **manutenzione impianti** e portineria garantisce che la tua proprietà rimanga in condizioni eccellenti. Copriamo impianti, piccole riparazioni e ispezioni.\n\nDesideri che ci prendiamo cura della tua proprietà? Parliamone!",
      garden: "Il nostro servizio di **cura del giardino** mantiene i tuoi spazi verdi bellissimi tutto l'anno. Eseguiamo taglio del prato, potatura siepi, diserbo e giardinaggio stagionale.\n\nDesideri un preventivo gratuito per il tuo giardino?",
      quote: "Saremmo lieti di inviarti un preventivo personalizzato! Puoi utilizzare il nostro generatore di preventivi interattivo sulla pagina, o indicarmi il servizio di cui hai bisogno e la dimensione approssimativa dell'area.",
      contact: "Puoi contattare il nostro team telefonicamente al **+41 77 450 57 05** o via e-mail all'indirizzo **info@krakenpfm.ch**.\n\nNon vediamo l'ora di sentirti!",
      booking: "Posso aiutarti a prenotare una consulenza gratuita! Puoi pianificarla direttamente utilizzando il modulo sul sito.",
      thanks: "Prego! Se hai bisogno di ulteriori informazioni o assistenza, non esitare a chiedere. Buona giornata!",
      default: "Posso aiutarti con pulizia, manutenzione, traslochi o giardino. Quale servizio, codice postale e data ti servono? Usa /quote per una stima senza impegno; il team confermerà l’offerta finale. Contatto: kai@krakenpfm.ch."
    },
    pt: {
      greet: "Olá! Sou o Kai, o seu assistente virtual da Kraken Properties & Facilities Management. 🐙 Como posso ajudar hoje?\n\nPode perguntar-me sobre os nossos serviços (limpeza de edifícios, manutenção de instalações, jardinagem) ou solicitar diretamente uma consulta!",
      cleaning: "Na Kraken Properties, oferecemos serviços profissionais de **limpeza de edifícios**, **limpeza de manutenção regular**, **limpeza de janelas** e **limpezas especiais** para propriedades comerciais e residenciais.\n\nGostaria de calcular uma estimativa ou solicitar um orçamento?",
      maintenance: "O nosso serviço de **manutenção de instalações** e zeladoria garante que a sua propriedade permaneça em excelentes condições. Cobrimos sistemas do edifício, pequenas reparações e inspeções.\n\nGostaria que cuidássemos da sua propriedade? Vamos conversar!",
      garden: "O nosso serviço de **jardinagem** mantém as suas áreas verdes bonitas todo o ano. Realizamos corte de relva, poda de sebes, remoção de ervas daninhas e jardinagem sazonal.\n\nGostaria de uma estimativa gratuita para o seu jardim?",
      quote: "Teremos todo o gosto em enviar-lhe um orçamento personalizado! Pode utilizar o nosso gerador de orçamentos interativo na página, ou indicar-me o serviço que necessita e o tamanho aproximado da área.",
      contact: "Pode contactar a nossa equipa por telefone através do **+41 77 450 57 05** ou por e-mail para **info@krakenpfm.ch**.\n\nAguardamos o seu contacto!",
      booking: "Posso ajudar a reservar uma consulta gratuita! Pode agendar diretamente através do formulário no site.",
      thanks: "De nada! Se precisar de mais informações ou assistência, não hesite em perguntar. Tenha um excelente dia!",
      default: "Posso ajudar com limpeza, manutenção, mudanças ou jardim. De que serviço precisa, em que código postal e para que data? Use /quote para uma estimativa sem compromisso; a equipa confirmará a proposta final. Contacto: kai@krakenpfm.ch."
    }
  };

  function detectLanguage(userText: string, bodyLanguage?: string): string {
    if (bodyLanguage) {
      const clean = bodyLanguage.substring(0, 2).toLowerCase();
      if (['de', 'en', 'fr', 'es', 'it', 'pt'].includes(clean)) {
        return clean;
      }
    }

    const text = (userText || "").toLowerCase();

    // German keywords
    if (text.includes("reinigung") || text.includes("haus") || text.includes("garten") || text.includes("offerte") || text.includes("buchen") || text.includes("schweiz") || text.includes("danke")) {
      return 'de';
    }
    // French keywords
    if (text.includes("nettoyage") || text.includes("entretien") || text.includes("jardin") || text.includes("bonjour") || text.includes("merci") || text.includes("devis")) {
      return 'fr';
    }
    // Spanish keywords
    if (text.includes("limpieza") || text.includes("mantenimiento") || text.includes("jardín") || text.includes("jardin") || text.includes("hola") || text.includes("gracias") || text.includes("presupuesto")) {
      return 'es';
    }
    // Italian keywords
    if (text.includes("pulizia") || text.includes("manutenzione") || text.includes("giardino") || text.includes("ciao") || text.includes("grazie") || text.includes("preventivo")) {
      return 'it';
    }
    // Portuguese keywords
    if (text.includes("limpeza") || text.includes("manutenção") || text.includes("jardinagem") || text.includes("olá") || text.includes("obrigado") || text.includes("orçamento")) {
      return 'pt';
    }

    return 'en';
  }

  // Fallback chatbot response generator in case Gemini is offline or spending cap is exhausted
  function getFallbackResponse(userText: string, bodyLanguage?: string): string {
    const lang = detectLanguage(userText, bodyLanguage);
    const text = (userText || "").toLowerCase();
    const dict = FALLBACK_LANGS[lang] || FALLBACK_LANGS['en'];

    // 1. Greet
    if (
      text.includes("hallo") || text.includes("hi") || text.includes("guten tag") || text.includes("servus") ||
      text.includes("hello") || text.includes("hey") ||
      text.includes("bonjour") || text.includes("salut") ||
      text.includes("hola") || text.includes("buenos") ||
      text.includes("ciao") || text.includes("salve") ||
      text.includes("olá") || text.includes("tudo")
    ) {
      return dict.greet;
    }

    // 2. Cleaning
    if (
      text.includes("reinigung") || text.includes("putz") || text.includes("sauber") ||
      text.includes("cleaning") || text.includes("clean") || text.includes("wash") ||
      text.includes("nettoyage") || text.includes("nettoyer") ||
      text.includes("limpieza") || text.includes("limpiar") ||
      text.includes("pulizia") || text.includes("pulire") ||
      text.includes("limpeza") || text.includes("limpar")
    ) {
      return dict.cleaning;
    }

    // 3. Maintenance
    if (
      text.includes("hauswart") || text.includes("wartung") || text.includes("hausmeister") || text.includes("technik") ||
      text.includes("maintenance") || text.includes("facility") || text.includes("janitor") || text.includes("technic") ||
      text.includes("concierge") || text.includes("entretien d'immeuble") ||
      text.includes("mantenimiento") || text.includes("conserjería") ||
      text.includes("manutenzione") || text.includes("portineria") ||
      text.includes("zeladoria")
    ) {
      return dict.maintenance;
    }

    // 4. Garden
    if (
      text.includes("garten") || text.includes("rasen") || text.includes("hecke") || text.includes("pflanz") ||
      text.includes("garden") || text.includes("lawn") || text.includes("hedge") || text.includes("yard") ||
      text.includes("jardin") || text.includes("pelouse") ||
      text.includes("jardín") || text.includes("césped") ||
      text.includes("giardino") || text.includes("prato") ||
      text.includes("jardinagem") || text.includes("relva")
    ) {
      return dict.garden;
    }

    // 5. Offer/Quote
    if (
      text.includes("angebot") || text.includes("offerte") || text.includes("preis") || text.includes("kosten") ||
      text.includes("quote") || text.includes("price") || text.includes("cost") || text.includes("offer") || text.includes("estimate") ||
      text.includes("devis") || text.includes("tarif") || text.includes("estimation") ||
      text.includes("presupuesto") || text.includes("precio") || text.includes("costo") ||
      text.includes("preventivo") || text.includes("prezzo") ||
      text.includes("orçamento") || text.includes("preço")
    ) {
      return dict.quote;
    }

    // 6. Contact
    if (
      text.includes("kontakt") || text.includes("telefon") || text.includes("email") || text.includes("e-mail") || text.includes("adresse") ||
      text.includes("contact") || text.includes("phone") || text.includes("address") ||
      text.includes("téléphone") ||
      text.includes("contacto") || text.includes("teléfono") ||
      text.includes("contatto") ||
      text.includes("contacto") || text.includes("telefone")
    ) {
      return dict.contact;
    }

    // 7. Booking
    if (
      text.includes("buchen") || text.includes("termin") || text.includes("beratung") || text.includes("reservier") ||
      text.includes("book") || text.includes("appointment") || text.includes("consult") || text.includes("reserve") ||
      text.includes("réserver") || text.includes("consultation") ||
      text.includes("reservar") || text.includes("consulta") ||
      text.includes("prenotare") || text.includes("consulenza") ||
      text.includes("consultoria")
    ) {
      return dict.booking;
    }

    // 8. Thanks
    if (
      text.includes("danke") || text.includes("vielen dank") || text.includes("merci") ||
      text.includes("thank") || text.includes("thanks") || text.includes("awesome") ||
      text.includes("gracias") ||
      text.includes("grazie") ||
      text.includes("obrigado")
    ) {
      return dict.thanks;
    }

    // 9. Default
    return dict.default;
  }

  const chatLimit = createRateLimiter(15, 60000);
  const instanceChatLimit = createRateLimiter(150, 60000, 1);
  // Server-owned instructions and bounded user histories.
  app.post("/api/chat", async (req, res) => {
    try {
      if (!chatLimit(req.ip || req.socket.remoteAddress || 'unknown') || !instanceChatLimit('all')) {
        res.setHeader('Retry-After', '60');
        return res.status(429).json({ success: false, error: 'Please wait before sending another message.' });
      }
      let validated;
      try { validated = validateChat(req.body); }
      catch (error) { return res.status(400).json({ success: false, error: (error as Error).message }); }
      const { messages, language } = validated;

      const lastMessage = messages[messages.length - 1];
      const userText = lastMessage ? lastMessage.text : "";

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || !externalIntegrationsEnabled) {
        console.warn("Gemini is not configured or is disabled for local development. Using local fallback responses.");
        return res.json({
          success: true,
          source: "fallback",
          text: getFallbackResponse(userText, language)
        });
      }

      try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: 10000 } });

        // Format the history for the SDK by filtering out system messages and formatting roles matching gemini format
        // Gemini chats format expects role: 'user' | 'model'
        const history = messages.slice(0, -1).map((m: any) => ({
          role: m.role || 'user',
          parts: [{ text: m.text || '' }]
        }));

        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: CHAT_INSTRUCTION,
            maxOutputTokens: 500,
          },
          history: history
        });

        const response = await chat.sendMessage({ message: userText || '' });
        if (!response.text) throw new Error('Empty model response.');

        res.json({
          success: true,
          source: "gemini",
          text: response.text
        });
      } catch (geminiError: any) {
        console.error("Gemini unavailable; using the local sales assistant.");
        // Fallback to local response if spending limit, 429, or quota exceeded
        res.json({
          success: true,
          source: "fallback",
          text: getFallbackResponse(userText, language)
        });
      }
    } catch (error: any) {
      console.error("Unexpected error in chat endpoint:", error);
      res.status(500).json({
        success: false,
        error: "An unexpected error occurred during raw model generation."
      });
    }
  });

  const injectSeoMeta = (html: string, pathname: string, language: string): string => {
    return renderInitialHtml(html, getMetadataForPath(pathname, language), language);
  };

  const templateCache = new Map<string, string>();
  const handleHtmlRequest = async (req: express.Request, res: express.Response) => {
    try {
      const isProd = !isDev;
      const distPath = (typeof __dirname !== "undefined" && path.basename(__dirname) === "dist")
        ? __dirname
        : path.join(process.cwd(), "dist");

      let preRenderedFilePath: string | undefined;
      // 1. In production, prefer a pre-rendered page, while still applying request SEO.
      if (isProd) {
        const cleanPath = req.path.replace(/\/$/, ""); // remove trailing slash
        const candidate = path.resolve(distPath, `.${cleanPath || '/index'}.html`);
        if (candidate.startsWith(path.resolve(distPath) + path.sep) && isRouteValid(req.path) && fs.existsSync(candidate)) preRenderedFilePath = candidate;
      }

      // 2. Fallback to SPA template (use index-spa.html backup in prod if exists, otherwise index.html)
      const indexPath = preRenderedFilePath || (isProd
        ? (fs.existsSync(path.join(distPath, "index-spa.html"))
            ? path.join(distPath, "index-spa.html")
            : path.join(distPath, "index.html"))
        : path.join(process.cwd(), "index.html"));

      if (fs.existsSync(indexPath)) {
        let html = !isDev ? templateCache.get(indexPath) : undefined;
        if (!html) { html = fs.readFileSync(indexPath, 'utf8'); if (!isDev) templateCache.set(indexPath, html); }

        // If Vite development server is active, transform index.html dynamically
        if (!isProd && viteInstance) {
          // Vite derives virtual inline CSS/module IDs from the first argument.
          // Keep locale query parameters only in the original-URL context.
          html = await viteInstance.transformIndexHtml(req.path, html, req.originalUrl);
        }

        const detectedLang = languageFromRequest(req.query.lang || req.query.hl, req.headers['accept-language']);
        const valid = isRouteValid(req.path);
        if (!valid) {
          res.status(404);
          res.setHeader('X-Robots-Tag', 'noindex');
        }

        html = injectSeoMeta(html, req.path, detectedLang);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.send(html);
      }
    } catch (e) {
      console.error("Failed to render and serve dynamic HTML:", e);
    }

    res.status(500).send("Internal Server Error");
  };

  // Development always uses source files; a previous build must never disable HMR.
  let viteInstance: any = null;
  if (isDev) {
      const { createServer: createViteServer } = await (specifier => import(specifier))("vite") as any;
      viteInstance = await createViteServer({
        server: { middlewareMode: true, hmr: { server } },
        appType: "custom",
      });
      app.use(viteInstance.middlewares);
      console.log("Vite development server middleware loaded.");
  }

  // Production assets static files serving with aggressive caching
  const distPath = (typeof __dirname !== "undefined" && path.basename(__dirname) === "dist")
    ? __dirname
    : path.join(process.cwd(), "dist");

  const publicPath = path.join(process.cwd(), "public");

  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath, {
      index: false,
      maxAge: isDev ? 0 : "1d",
      setHeaders: (res, filePath) => {
        const immutableAsset = filePath.includes(`${path.sep}assets${path.sep}`);
        res.setHeader("Cache-Control", isDev ? "no-cache" : (immutableAsset ? "public, max-age=31536000, immutable" : "public, max-age=604800"));
      }
    }));
  }

  if (!isDev) app.use('/assets', express.static(path.join(distPath, 'assets'), {
    index: false, maxAge: '1y', immutable: true,
  }));

  // Intercept all routes for pre-rendering
  app.get("*all", (req, res, next) => {
    const isAsset = req.path.includes(".") && !req.path.endsWith(".html");
    const isViteInternal = req.path.startsWith("/src") || req.path.startsWith("/@") || req.path.startsWith("/node_modules");
    if (isAsset || isViteInternal) {
      return next();
    }

    // 301 Redirect for legacy /consultation, /contact, /contacto URLs
    const lowerPath = req.path.toLowerCase().replace(/\/$/, "");
    if (lowerPath === "/consultation") {
      const queryStr = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
      return res.redirect(301, `/quote${queryStr}`);
    }
    if (lowerPath === "/contact" || lowerPath === "/contacto") {
      const queryStr = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
      return res.redirect(301, `/kontakt${queryStr}`);
    }
    if (lowerPath === "/reinigung/uhwiesen") {
      const queryStr = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
      return res.redirect(301, `/reinigung/laufen-uhwiesen${queryStr}`);
    }

    // 301 Redirect for Tier 3 municipality URLs to parent region hub
    const munMatch = req.path.match(/^\/reinigung\/([a-zA-Z0-9_-]+)$/i);
    if (munMatch) {
      const slug = munMatch[1].toLowerCase();
      const mun = MUNICIPALITIES.find(m => m.slug === slug);
      if (mun && mun.tier === 3) {
        const queryStr = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
        const parentHub = mun.region === "zuerich" ? "/reinigung/region-zuerich" : mun.region === "winterthur" ? "/reinigung/region-winterthur" : "/reinigung/kanton-schaffhausen";
        return res.redirect(301, `${parentHub}${queryStr}`);
      }
    }

    // 301 Redirect for legacy /reinigung-* URLs
    const deRegex = /^\/reinigung-(schaffhausen|zurich|winterthur|neuhausen|thayngen|stein-am-rhein|feuerthalen|kloten|buelach|dietikon|uster)-([a-zA-Z0-9_-]+)$/i;
    const deMatch = req.path.match(deRegex);
    if (deMatch) {
      const city = deMatch[1].toLowerCase();
      const service = deMatch[2].toLowerCase();
      const normCity = city === "zuerich" ? "zurich" : city === "neuhausen-am-rheinfall" ? "neuhausen" : city;
      if (VALID_CITIES.includes(normCity)) {
        return res.redirect(301, `/services/${normCity}/${service}`);
      } else {
        const mun = MUNICIPALITIES.find(m => m.slug === city || m.slug === normCity);
        if (mun && mun.tier === 2) {
          return res.redirect(301, `/reinigung/${mun.slug}#${service}`);
        }
        return res.redirect(301, `/reinigung/kanton-schaffhausen#${service}`);
      }
    }

    // 301 Redirect for legacy /seo/* URLs
    const seoRegex = /^\/seo\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i;
    const seoMatch = req.path.match(seoRegex);
    if (seoMatch) {
      const city = seoMatch[1].toLowerCase();
      const service = seoMatch[2].toLowerCase();
      const normCity = city === "zuerich" ? "zurich" : city === "neuhausen-am-rheinfall" ? "neuhausen" : city;
      if (VALID_CITIES.includes(normCity)) {
        return res.redirect(301, `/services/${normCity}/${service}`);
      } else {
        const mun = MUNICIPALITIES.find(m => m.slug === city || m.slug === normCity);
        if (mun && mun.tier === 2) {
          return res.redirect(301, `/reinigung/${mun.slug}#${service}`);
        }
        return res.redirect(301, `/reinigung/kanton-schaffhausen#${service}`);
      }
    }

    // 301 Redirect for Level 3 service pages on non-Tier 1 cities
    const srvMatch = req.path.match(/^\/services\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i);
    if (srvMatch) {
      const citySlug = srvMatch[1].toLowerCase();
      const serviceId = srvMatch[2].toLowerCase();
      const normCity = citySlug === "zuerich" ? "zurich" : citySlug === "neuhausen-am-rheinfall" ? "neuhausen" : citySlug;

      if (!VALID_CITIES.includes(normCity)) {
        const mun = MUNICIPALITIES.find(m => m.slug === citySlug || m.slug === normCity);
        const queryStr = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
        if (mun && mun.tier === 2) {
          return res.redirect(301, `/reinigung/${mun.slug}${queryStr}#${serviceId}`);
        }
        const parentHub = mun?.region === "zuerich" ? "/reinigung/region-zuerich" : mun?.region === "winterthur" ? "/reinigung/region-winterthur" : "/reinigung/kanton-schaffhausen";
        return res.redirect(301, `${parentHub}${queryStr}#${serviceId}`);
      }
    }

    return handleHtmlRequest(req, res);
  });
  if (!isDev) console.log(`Serving static production assets with caching headers from: ${distPath}`);

  if (runningOnVercel) return; // The platform owns the listener and function lifecycle.

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  server.listen(PORT, process.env.HOST || "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on("error", (err: any) => {
    console.error("SERVER LISTEN ERROR:", err);
    process.exit(1);
  });

  const shutdown = async () => {
    await viteInstance?.close();
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
    server.closeAllConnections();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception thrown:", err);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting the server:", err);
  process.exit(1);
});
