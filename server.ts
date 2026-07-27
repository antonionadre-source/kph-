import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
import path from "path";
import compression from "compression";
import fs from "fs";
import { getMetadataForPath, isRouteValid } from "./seoConfig";
import { MUNICIPALITIES } from "./src/data/locations";
// No need to define currentDirname or use import.meta.url as they are unused and cause a parse-time SyntaxError in bundled CommonJS on startup.

dotenv.config();
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

async function startServer() {
  const app = express();
  // In the development workspace (ais-dev-) or shared preview (ais-pre-) containers, we must bind strictly to port 3000.
  // In the live production Cloud Run deployment, we must bind strictly to the port specified by the PORT environment variable (usually 8080).
  const isWorkspaceOrPreview = !!(
    process.env.DEFAULT_APP_PORT ||
    (process.env.K_SERVICE && (
      process.env.K_SERVICE.startsWith("ais-dev-") || 
      process.env.K_SERVICE.startsWith("ais-pre-") || 
      process.env.K_SERVICE.startsWith("ais-")
    ))
  );
  const PORT = isWorkspaceOrPreview
    ? 3000
    : (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

  app.use(compression());
  app.use(cors());
  app.use(express.json());

  // ====================================================================
  // PAYREXX PAYMENT GATEWAY
  // Creates a Payrexx Gateway via REST API and returns the payment link.
  // Auth: requests are signed with an HMAC-SHA256 over the URL-encoded
  // body using your Payrexx API secret (base64-encoded). The instance
  // name is your Payrexx subdomain (e.g. "krakenpfm").
  // ====================================================================
  const handlePayrexxGateway = async (req: express.Request, res: express.Response) => {
    const {
      amount,
      currency = "CHF",
      title = "Kraken PFM Service",
      description = "",
      clientName = "",
      email = "",
    } = req.body || {};

    const PAYREXX_INSTANCE = process.env.PAYREXX_INSTANCE;
    const PAYREXX_API_SECRET = process.env.PAYREXX_API_SECRET;

    // Guard: configuration missing
    if (!PAYREXX_INSTANCE || !PAYREXX_API_SECRET) {
      console.error("[Payrexx] Missing PAYREXX_INSTANCE or PAYREXX_API_SECRET environment variable.");
      return res.status(500).json({
        success: false,
        error: "Payment gateway is not configured. Please set PAYREXX_INSTANCE and PAYREXX_API_SECRET.",
      });
    }

    // Guard: validate amount (Payrexx expects the amount in cents / smallest unit)
    const amountNumber = Number(amount);
    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ success: false, error: "Invalid or missing amount." });
    }
    const amountInCents = Math.round(amountNumber * 100);

    try {
      const appUrl = process.env.APP_URL || (req.headers.origin as string) || "https://krakenpfm.ch";

      // Helper to build a query string format exactly matching PHP's http_build_query
      const buildPayrexxQuery = (obj: Record<string, string>, spaceChar: string) => {
        return Object.entries(obj)
          .map(([key, val]) => {
            const encodedKey = encodeURIComponent(key).replace(/%20/g, spaceChar);
            const encodedVal = encodeURIComponent(val).replace(/%20/g, spaceChar);
            return `${encodedKey}=${encodedVal}`;
          })
          .join("&");
      };

      // Build the request payload fields
      const baseParams: Record<string, string> = {
        amount: String(amountInCents),
        currency,
        purpose: description || title,
        successRedirectUrl: appUrl + "/quote?payment=success",
        failedRedirectUrl: appUrl + "/quote?payment=failed",
        cancelRedirectUrl: appUrl + "/quote?payment=cancelled",
      };

      if (clientName) {
        const parts = clientName.trim().split(" ");
        baseParams["fields[forename][value]"] = parts[0] || "";
        baseParams["fields[surname][value]"] = parts.slice(1).join(" ") || "";
      }
      if (email) {
        baseParams["fields[email][value]"] = email;
      }

      // Compute the HMAC-SHA256 signature over the data string where spaces are encoded as '+'
      const signableStr = buildPayrexxQuery(baseParams, "+");
      const signature = crypto
        .createHmac("sha256", PAYREXX_API_SECRET)
        .update(signableStr)
        .digest("base64");

      // Build the final POST payload where spaces are encoded as '%20'
      const postPayload = `${buildPayrexxQuery(baseParams, "%20")}&ApiSignature=${encodeURIComponent(signature)}`;

      const endpoint =
        "https://api.payrexx.com/v1.0/Gateway/?instance=" + encodeURIComponent(PAYREXX_INSTANCE);

      const response = await axios.post(endpoint, postPayload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      const data = response.data;
      if (data && data.status === "success" && Array.isArray(data.data) && data.data[0]) {
        const gateway = data.data[0];
        return res.json({
          success: true,
          link: gateway.link,
          id: gateway.id,
        });
      }

      console.error("[Payrexx] Unexpected response:", JSON.stringify(data));
      return res.status(502).json({
        success: false,
        error: "Payrexx did not return a valid gateway.",
      });
    } catch (err: any) {
    console.error('Payrexx gateway creation failed:', err && err.message);
    res.status(500).json({
      error: 'Failed to create the Payrexx payment gateway.',
    });
    }
  };

  // API Route to create a Payrexx Payment Gateway and retrieve the payment link
  app.post("/api/payrexx/create-gateway", handlePayrexxGateway);

  const FALLBACK_LANGS: Record<string, Record<string, string>> = {
    de: {
      greet: "Hallo! Ich bin Kai, dein virtueller Assistent von Kraken Properties & Facilities Management. 🐙 Wie kann ich dir heute helfen?\n\nDu kannst mich nach unseren Dienstleistungen fragen (Gebäudereinigung, Hauswartung, Gartenpflege) oder direkt ein Beratungsgespräch anfordern!",
      cleaning: "Bei Kraken Properties bieten wir professionelle **Gebäudereinigung**, **Unterhaltsreinigung**, **Fensterreinigung** und **Sonderreinigung** für Firmen und Privatpersonen an.\n\nGerne erstellen wir ein passendes Konzept. Möchtest du eine Offerte berechnen lassen?",
      maintenance: "Unsere umfassende **Hauswartung** sorgt für den Werterhalt deiner Liegenschaft. Wir kümmern uns um die Haustechnik, kleine Reparaturen, Haustechnik-Kontrollen und die allgemeine Sicherheit.\n\nMöchtest du, dass wir deine Liegenschaft betreuen? Lass es uns wissen!",
      garden: "Unsere **Gartenpflege** hält deine Grünflächen das ganze Jahr über in Top-Zustand. Wir übernehmen Rasenmähen, Heckenschnitt, Unkrautbeseitigung und saisonale Pflege.\n\nMöchtest du ein unverbindliches Angebot für deinen Garten erhalten?",
      quote: "Gerne erstellen wir dir eine massgeschneiderte Offerte! Nutze am besten unseren interaktiven Offertenrechner auf der Seite oder gib mir kurz an, um welche Dienstleistung (z.B. Reinigung) und welche Flächengrösse es geht.",
      contact: "Du erreichst unser Team telefonisch unter **+41 44 123 45 67** oder per E-Mail unter **info@kraken-properties.ch**.\n\nAlternativ kannst du auch das Kontaktformular unten auf der Seite ausfüllen.",
      booking: "Gerne reservieren wir einen Beratungstermin für dich! Klicke einfach auf 'Termin buchen' oder nutze das Buchungsformular auf unserer Webseite.\n\n```json\n{\n  \"trigger\": \"SUBMIT_BOOKING\",\n  \"action\": \"BOOK_RESERVATION\",\n  \"data\": {\n    \"service\": \"Consultation\",\n    \"notes\": \"Automatisch gebucht über Assistenten-Backup\"\n  }\n}\n```",
      thanks: "Sehr gerne! Wenn du weitere Fragen hast oder Unterstützung benötigst, bin ich jederzeit für dich da. Ich wünsche dir einen erfolgreichen Tag!",
      default: "Dabei helfe ich dir gerne weiter! Als dein digitaler Assistent Kai bin ich für alle Fragen rund um Gebäubeservice, Hauswartung und Reinigung da.\n\nDa der Live-Modus im Demo-Modus gerade ausgelastet ist, kannst du uns auch direkt unter **info@kraken-properties.ch** kontaktieren."
    },
    en: {
      greet: "Hello! I'm Kai, your digital assistant for Kraken Properties & Facilities Management. 🐙 How can I assist you today?\n\nYou can ask me about our services (building cleaning, facility maintenance, garden care) or directly request a consultation!",
      cleaning: "At Kraken Properties, we provide professional **building cleaning**, **regular maintenance cleaning**, **window cleaning**, and **specialized cleaning** for commercial and residential properties.\n\nWould you like to calculate an estimate or request a quote?",
      maintenance: "Our **facility maintenance** and caretaker services ensure that your property remains in top-tier condition. We cover building systems, minor repairs, inspections, and waste management.\n\nWould you like us to look after your property? Let's discuss!",
      garden: "Our **garden care** keeps your green spaces beautiful all year round. We do lawn mowing, hedge trimming, weeding, and seasonal gardening.\n\nWould you like a free estimate for your garden?",
      quote: "We would be glad to send you a customized quote! You can use our interactive quote generator on the page, or let me know the service you need and the approximate size of the area.",
      contact: "You can contact our team via phone at **+41 44 123 45 67** or email us at **info@kraken-properties.ch**.\n\nWe look forward to hearing from you!",
      booking: "I can help you book a free consultation! You can schedule one directly using the 'Book Consultation' form on the site.\n\n```json\n{\n  \"trigger\": \"SUBMIT_BOOKING\",\n  \"action\": \"BOOK_RESERVATION\",\n  \"data\": {\n    \"service\": \"Consultation\",\n    \"notes\": \"Booked automatically via backup chat assistant\"\n  }\n}\n```",
      thanks: "You're very welcome! If you need any more information or assistance, feel free to ask. Have an amazing day!",
      default: "I would be happy to help with that! As your assistant Kai, I support you with all aspects of facility management, cleaning, and maintenance.\n\nSince the live AI system is in backup mode right now, please feel free to drop us an email at **info@kraken-properties.ch** for a personal response!"
    },
    fr: {
      greet: "Bonjour ! Je suis Kai, votre assistant virtuel pour Kraken Properties & Facilities Management. 🐙 Comment puis-je vous aider aujourd'hui ?\n\nVous pouvez me poser des questions sur nos services (nettoyage de bâtiment, entretien, jardinage) ou demander directement une consultation !",
      cleaning: "Chez Kraken Properties, nous proposons des services professionnels de **nettoyage de bâtiments**, **nettoyage d'entretien**, **nettoyage de vitres** et **nettoyages spéciaux** pour les entreprises et les particuliers.\n\nSouhaitez-vous calculer une estimation ou demander un devis ?",
      maintenance: "Notre service d'**entretien d'immeubles** et de conciergerie garantit le maintien en parfait état de votre propriété. Nous gérons la technique du bâtiment, les petites réparations et les contrôles.\n\nSouhaitez-vous que nous prenions soin de votre propriété ? Discutons-en !",
      garden: "Notre service d'**entretien de jardin** maintient vos espaces verts magnifiques toute l'année. Nous nous occupons de la tonte de pelouse, de la taille des haies et du désherbage.\n\nSouhaitez-vous une estimation gratuite pour votre jardin ?",
      quote: "Nous serions ravis de vous envoyer un devis personnalisé ! Vous pouvez utiliser notre générateur de devis interactif sur la page, ou m'indiquer le service souhaité et la surface approximative.",
      contact: "Vous pouvez contacter notre équipe par téléphone au **+41 44 123 45 67** ou par e-mail à **info@kraken-properties.ch**.\n\nNous nous réjouissons de vous entendre !",
      booking: "Je peux vous aider à réserver une consultation gratuite ! Vous pouvez planifier cela directement en utilisant le formulaire sur le site.\n\n```json\n{\n  \"trigger\": \"SUBMIT_BOOKING\",\n  \"action\": \"BOOK_RESERVATION\",\n  \"data\": {\n    \"service\": \"Consultation\",\n    \"notes\": \"Réserve automatique par l'assistant de secours\"\n  }\n}\n```",
      thanks: "De rien ! Si vous avez besoin de plus d'informations ou d'aide, n'hésitez pas à demander. Passez une excellente journée !",
      default: "Je serais ravi de vous aider ! En tant qu'assistant Kai, je vous accompagne pour le nettoyage, l'entretien et la conciergerie.\n\nLe système d'IA étant en mode de secours, n'hésitez pas à nous envoyer un e-mail à **info@kraken-properties.ch** !"
    },
    es: {
      greet: "¡Hola! Soy Kai, su asistente virtual de Kraken Properties & Facilities Management. 🐙 ¿Cómo le puedo ayudar hoy?\n\n¡Puede preguntarme sobre nuestros servicios (limpieza de edificios, mantenimiento de instalaciones, cuidado de jardines) o solicitar directamente una consulta!",
      cleaning: "En Kraken Properties, ofrecemos servicios profesionales de **limpieza de edificios**, **limpieza de mantenimiento regular**, **limpieza de ventanas** y **limpiezas especiales** para propiedades comerciales y residenciales.\n\n¿Le gustaría calcular una estimación o solicitar un presupuesto?",
      maintenance: "Nuestro servicio de **mantenimiento de instalaciones** y conserjería garantiza que su propiedad se mantenga en excelentes condiciones. Cubrimos sistemas del edificio, pequeñas reparaciones e inspecciones.\n\n¿Le gustaría que cuidemos de su propiedad? ¡Hablemos!",
      garden: "Nuestro servicio de **cuidado de jardines** mantiene sus áreas verdes hermosas todo el año. Realizamos corte de césped, poda de setos, deshierbe y jardinería estacional.\n\n¿Le gustaría una estimación gratuita para su jardín?",
      quote: "¡Estaremos encantados de enviarle un presupuesto personalizado! Puede utilizar nuestro generador interactivo de presupuestos en la página, o indicarme el servicio que necesita y el tamaño aproximado de la superficie.",
      contact: "Puede ponerse en contacto con nuestro equipo por teléfono al **+41 44 123 45 67** o por correo electrónico a **info@kraken-properties.ch**.\n\n¡Esperamos tener noticias suyas!",
      booking: "¡Puedo ayudarle a reservar una consulta gratuita! Puede programar una directamente utilizando el formulario en el sitio.\n\n```json\n{\n  \"trigger\": \"SUBMIT_BOOKING\",\n  \"action\": \"BOOK_RESERVATION\",\n  \"data\": {\n    \"service\": \"Consultation\",\n    \"notes\": \"Reservado automáticamente a través del asistente de respaldo\"\n  }\n}\n```",
      thanks: "¡De nada! Si necesita más información o ayuda, no dude en preguntar. ¡Que tenga un día excelente!",
      default: "¡Estaría encantado de ayudarle con eso! Como su asistente Kai, le apoyo con el mantenimiento de instalaciones, limpieza y cuidado.\n\nDado que el sistema de IA está en modo de respaldo, no dude en enviarnos un correo electrónico a **info@kraken-properties.ch**."
    },
    it: {
      greet: "Ciao! Sono Kai, il tuo assistente virtuale per Kraken Properties & Facilities Management. 🐙 Come posso aiutarti oggi?\n\nPuoi chiedermi informazioni sui nostri servizi (pulizia di edifici, manutenzione impianti, cura del giardino) o richiedere direttamente una consulenza!",
      cleaning: "Presso Kraken Properties, offriamo servizi professionali di **pulizia di edifici**, **pulizia di manutenzione regolare**, **pulizia di vetri** e **pulizie speciali** per proprietà commerciali e residenziali.\n\nDesideri calcolare una stima o richiedere un preventivo?",
      maintenance: "Il nostro servizio di **manutenzione impianti** e portineria garantisce che la tua proprietà rimanga in condizioni eccellenti. Copriamo impianti, piccole riparazioni e ispezioni.\n\nDesideri che ci prendiamo cura della tua proprietà? Parliamone!",
      garden: "Il nostro servizio di **cura del giardino** mantiene i tuoi spazi verdi bellissimi tutto l'anno. Eseguiamo taglio del prato, potatura siepi, diserbo e giardinaggio stagionale.\n\nDesideri un preventivo gratuito per il tuo giardino?",
      quote: "Saremmo lieti di inviarti un preventivo personalizzato! Puoi utilizzare il nostro generatore di preventivi interattivo sulla pagina, o indicarmi il servizio di cui hai bisogno e la dimensione approssimativa dell'area.",
      contact: "Puoi contattare il nostro team telefonicamente al **+41 44 123 45 67** o via e-mail all'indirizzo **info@kraken-properties.ch**.\n\nNon vediamo l'ora di sentirti!",
      booking: "Posso aiutarti a prenotare una consulenza gratuita! Puoi pianificarla direttamente utilizzando il modulo sul sito.\n\n```json\n{\n  \"trigger\": \"SUBMIT_BOOKING\",\n  \"action\": \"BOOK_RESERVATION\",\n  \"data\": {\n    \"service\": \"Consultation\",\n    \"notes\": \"Prenotato automaticamente tramite l'assistente di backup\"\n  }\n}\n```",
      thanks: "Prego! Se hai bisogno di ulteriori informazioni o assistenza, non esitare a chiedere. Buona giornata!",
      default: "Sarei felice di aiutarti! Come tuo assistente Kai, ti supporto in tutti gli aspetti di gestione impianti, pulizia e manutenzione.\n\nPoiché il sistema di IA è in modalità di backup, non esitare a inviarci un'e-mail a **info@kraken-properties.ch**."
    },
    pt: {
      greet: "Olá! Sou o Kai, o seu assistente virtual da Kraken Properties & Facilities Management. 🐙 Como posso ajudar hoje?\n\nPode perguntar-me sobre os nossos serviços (limpeza de edifícios, manutenção de instalações, jardinagem) ou solicitar diretamente uma consulta!",
      cleaning: "Na Kraken Properties, oferecemos serviços profissionais de **limpeza de edifícios**, **limpeza de manutenção regular**, **limpeza de janelas** e **limpezas especiais** para propriedades comerciais e residenciais.\n\nGostaria de calcular uma estimativa ou solicitar um orçamento?",
      maintenance: "O nosso serviço de **manutenção de instalações** e zeladoria garante que a sua propriedade permaneça em excelentes condições. Cobrimos sistemas do edifício, pequenas reparações e inspeções.\n\nGostaria que cuidássemos da sua propriedade? Vamos conversar!",
      garden: "O nosso serviço de **jardinagem** mantém as suas áreas verdes bonitas todo o ano. Realizamos corte de relva, poda de sebes, remoção de ervas daninhas e jardinagem sazonal.\n\nGostaria de uma estimativa gratuita para o seu jardim?",
      quote: "Teremos todo o gosto em enviar-lhe um orçamento personalizado! Pode utilizar o nosso gerador de orçamentos interativo na página, ou indicar-me o serviço que necessita e o tamanho aproximado da área.",
      contact: "Pode contactar a nossa equipa por telefone através do **+41 44 123 45 67** ou por e-mail para **info@kraken-properties.ch**.\n\nAguardamos o seu contacto!",
      booking: "Posso ajudar a reservar uma consulta gratuita! Pode agendar diretamente através do formulário no site.\n\n```json\n{\n  \"trigger\": \"SUBMIT_BOOKING\",\n  \"action\": \"BOOK_RESERVATION\",\n  \"data\": {\n    \"service\": \"Consultation\",\n    \"notes\": \"Agendado automaticamente através do assistente de backup\"\n  }\n}\n```",
      thanks: "De nada! Se precisar de mais informações ou assistência, não hesite em perguntar. Tenha um excelente dia!",
      default: "Terei todo o gosto em ajudar com isso! Como seu assistente Kai, apoio-o em todos os aspetos de gestão de instalações, limpeza e manutenção.\n\nComo o sistema de IA está em modo de segurança, não hesite em enviar-nos um e-mail para **info@kraken-properties.ch**."
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

  // Secure Server-Side Gemini API Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, systemInstruction, language } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, error: "Messages array is required." });
      }

      const lastMessage = messages[messages.length - 1];
      const userText = lastMessage ? lastMessage.text : "";

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY environment variable is not configured. Using high-fidelity local response generator.");
        return res.json({
          success: true,
          text: getFallbackResponse(userText, language)
        });
      }

      try {
        const { GoogleGenAI } = await (specifier => import(specifier))("@google/genai") as any;
        const ai = new GoogleGenAI({ apiKey });

        // Format the history for the SDK by filtering out system messages and formatting roles matching gemini format
        // Gemini chats format expects role: 'user' | 'model'
        const history = messages.slice(0, -1).map((m: any) => ({
          role: m.role || 'user',
          parts: [{ text: m.text || '' }]
        }));

        const chat = ai.chats.create({
          model: 'gemini-3.5-flash',
          config: {
            systemInstruction: systemInstruction || undefined,
          },
          history: history
        });

        const response = await chat.sendMessage({ message: userText || '' });

        res.json({
          success: true,
          text: response.text
        });
      } catch (geminiError: any) {
        console.error("Gemini API error, activating fallback assistant:", geminiError);
        // Fallback to local response if spending limit, 429, or quota exceeded
        res.json({
          success: true,
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

  const injectSeoMeta = (html: string, pathname: string, langQuery?: string): string => {
    try {
      const meta = getMetadataForPath(pathname, langQuery);

      // Replace Title
      let renderedHtml = html.replace(
        /<title>[\s\S]*?<\/title>/i,
        `<title>${meta.title}</title>`
      );

      // Replace other title metas
      renderedHtml = renderedHtml.replace(
        /<meta property="og:title" content="[\s\S]*?">/i,
        `<meta property="og:title" content="${meta.title}">`
      );
      renderedHtml = renderedHtml.replace(
        /<meta name="twitter:title" content="[\s\S]*?">/i,
        `<meta name="twitter:title" content="${meta.title}">`
      );
      renderedHtml = renderedHtml.replace(
        /<meta name="title" content="[\s\S]*?">/i,
        `<meta name="title" content="${meta.title}">`
      );

      // Replace Description
      renderedHtml = renderedHtml.replace(
        /<meta name="description" content="[\s\S]*?">/i,
        `<meta name="description" content="${meta.description}">`
      );
      renderedHtml = renderedHtml.replace(
        /<meta property="og:description" content="[\s\S]*?">/i,
        `<meta property="og:description" content="${meta.description}">`
      );
      renderedHtml = renderedHtml.replace(
        /<meta name="twitter:description" content="[\s\S]*?">/i,
        `<meta name="twitter:description" content="${meta.description}">`
      );

      // Replace Canonical
      renderedHtml = renderedHtml.replace(
        /<link rel="canonical" href="[\s\S]*?" \/>/i,
        `<link rel="canonical" href="${meta.canonical}" />`
      );

      // Strip existing alternate hreflangs to avoid duplication
      renderedHtml = renderedHtml.replace(
        /<link rel="alternate" hreflang="[\s\S]*?" href="[\s\S]*?">/gi,
        ""
      );

      return renderedHtml;
    } catch (error) {
      console.error("Error injecting SEO meta:", error);
      return html;
    }
  };

  const handleHtmlRequest = async (req: express.Request, res: express.Response) => {
    try {
      const isProd = process.env.NODE_ENV === "production" || (typeof __filename !== "undefined" && __filename.endsWith("server.cjs"));
      const distPath = (typeof __dirname !== "undefined" && path.basename(__dirname) === "dist")
        ? __dirname
        : path.join(process.cwd(), "dist");

      // 1. In production, check if a pre-rendered HTML file exists for this path
      if (isProd) {
        const cleanPath = req.path.replace(/\/$/, ""); // remove trailing slash
        const preRenderedFilePath = cleanPath === "" 
          ? path.join(distPath, "index.html")
          : path.join(distPath, `${cleanPath}.html`);

        if (fs.existsSync(preRenderedFilePath)) {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.sendFile(preRenderedFilePath);
        }
      }

      // 2. Fallback to SPA template (use index-spa.html backup in prod if exists, otherwise index.html)
      const indexPath = isProd
        ? (fs.existsSync(path.join(distPath, "index-spa.html"))
            ? path.join(distPath, "index-spa.html")
            : path.join(distPath, "index.html"))
        : path.join(process.cwd(), "index.html");

      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, "utf8");

        // If Vite development server is active, transform index.html dynamically
        if (!isProd && viteInstance) {
          html = await viteInstance.transformIndexHtml(req.originalUrl, html);
        }

        const langParam = (req.query.lang || req.query.hl) as string | undefined;
        let detectedLang = langParam;
        if (!detectedLang && req.headers["accept-language"]) {
          const header = req.headers["accept-language"] as string;
          const match = header.match(/(de|en|fr|it|es|pt)/i);
          if (match) {
            detectedLang = match[1].toLowerCase();
          }
        }

        const valid = isRouteValid(req.path);
        if (!valid) {
          res.status(404);
        }

        html = injectSeoMeta(html, req.path, detectedLang);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.send(html);
      }
    } catch (e) {
      console.error("Failed to render and serve dynamic HTML:", e);
    }

    res.status(500).send("Internal Server Error - HTML template not found");
  };

  // Vite middleware for development (with graceful fallback if not installed/present)
  let viteLoaded = false;
  let viteInstance: any = null;
  const isProduction = process.env.NODE_ENV === "production" || (typeof __filename !== "undefined" && __filename.endsWith("server.cjs"));
  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await (specifier => import(specifier))("vite") as any;
      viteInstance = await createViteServer({
        server: { middlewareMode: true },
        appType: "custom",
      });
      app.use(viteInstance.middlewares);
      viteLoaded = true;
      console.log("Vite development server middleware loaded.");
    } catch (e) {
      console.warn("Could not load Vite middleware in non-production. Falling back to serving built files.", e);
    }
  }

  // Production assets static files serving with aggressive caching
  const distPath = (typeof __dirname !== "undefined" && path.basename(__dirname) === "dist")
    ? __dirname
    : path.join(process.cwd(), "dist");

  app.use(express.static(distPath, {
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      if (filePath.includes("/assets/") || filePath.match(/\.[0-9a-f]{8,}\./)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      } else {
        res.setHeader("Cache-Control", "public, max-age=604800"); // 7 days cache
      }
    }
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

    // 301 Redirect for legacy /reinigung-* URLs
    const deRegex = /^\/reinigung-(schaffhausen|zurich|winterthur|neuhausen|thayngen|stein-am-rhein|feuerthalen|kloten|buelach|dietikon|uster)-([a-zA-Z0-9_-]+)$/i;
    const deMatch = req.path.match(deRegex);
    if (deMatch) {
      const city = deMatch[1].toLowerCase();
      const service = deMatch[2].toLowerCase();
      return res.redirect(301, `/services/${city}/${service}`);
    }

    // 301 Redirect for legacy /seo/* URLs
    const seoRegex = /^\/seo\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i;
    const seoMatch = req.path.match(seoRegex);
    if (seoMatch) {
      const city = seoMatch[1].toLowerCase();
      const service = seoMatch[2].toLowerCase();
      return res.redirect(301, `/services/${city}/${service}`);
    }

    // 301 Redirect for invalid municipality-service combinations to regional targets
    const srvMatch = req.path.match(/^\/services\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i);
    if (srvMatch) {
      const citySlug = srvMatch[1].toLowerCase();
      const serviceId = srvMatch[2].toLowerCase();
      
      const normCity = citySlug === "zuerich" ? "zurich" : citySlug === "neuhausen" ? "neuhausen-am-rheinfall" : citySlug;
      const mun = MUNICIPALITIES.find(m => m.slug === normCity);
      if (mun) {
        const isOffered = mun.services.includes(serviceId);
        if (!isOffered) {
          const targetRegion = mun.region === "zuerich" ? "zurich" : mun.region;
          const queryStr = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
          return res.redirect(301, `/services/${targetRegion}/${serviceId}${queryStr}`);
        }
      }
    }

    handleHtmlRequest(req, res);
  });
  console.log(`Serving static production assets with caching headers from: ${distPath}`);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting the server:", err);
  process.exit(1);
});
