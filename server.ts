import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Payrexx Configuration
  const PAYREXX_INSTANCE = (process.env.PAYREXX_INSTANCE || 'krakenpfm').trim();
  const PAYREXX_API_SECRET = (process.env.PAYREXX_API_SECRET || '4cc623e6dca95bb117730425dcc49256a959a37e36cb2685007fe28a0ab13ca8').trim();

  // API Route to create a Payrexx Gateway
  app.post("/api/payrexx/create-gateway", async (req, res) => {
    try {
      const { amount, currency, title, description, clientName, email } = req.body;

      // Payrexx REST API expects specific parameters
      const paramsObj: any = {
        amount: Math.round(amount * 100), // Amount in cents
        currency: currency || 'CHF',
      };
      
      // Combine title and description into purpose
      const purpose = description ? `${title} - ${description}` : title;
      paramsObj.purpose = purpose || 'Kraken Properties Service';
      
      // Pre-fill customer data using REST API fields
      if (clientName) {
          const nameParts = clientName.trim().split(' ');
          paramsObj.contactForename = nameParts[0];
          if (nameParts.length > 1) {
              paramsObj.contactSurname = nameParts.slice(1).join(' ');
          }
      }
      if (email) {
          paramsObj.contactEmail = email;
      }
      
      // Redirect URLs
      const appUrl = process.env.APP_URL || `https://${req.get('host')}`;
      paramsObj.successRedirectUrl = `${appUrl}/?payment=success`;
      paramsObj.failedRedirectUrl = `${appUrl}/?payment=failed`;
      paramsObj.cancelRedirectUrl = `${appUrl}/?payment=cancel`;

      // Sort keys alphabetically for signature generation (Payrexx requirement)
      const sortedKeys = Object.keys(paramsObj).sort();
      
      // Build the query string using RFC 1738 encoding (spaces as +)
      const strict_rfc1738_encode = (str: string) => {
          return encodeURIComponent(str)
              .replace(/%20/g, '+')
              .replace(/[!'()*~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
      };

      const queryParts = sortedKeys.map(key => {
          return `${strict_rfc1738_encode(key)}=${strict_rfc1738_encode(paramsObj[key].toString())}`;
      });
      const queryString = queryParts.join('&');

      // Generate ApiSignature (HMAC-SHA256 of the query string, base64 encoded)
      const signature = crypto.createHmac('sha256', PAYREXX_API_SECRET).update(queryString).digest('base64');
      
      // Create final payload with signature
      const finalBody = queryString + `&ApiSignature=${encodeURIComponent(signature)}`;

      console.log("Payrexx Instance:", PAYREXX_INSTANCE);
      console.log("Payload for Signature (Strict RFC 1738):", queryString);
      console.log("Generated Signature (base64):", signature);

      const response = await axios.post(
        `https://api.payrexx.com/v1.0/Gateway/?instance=${PAYREXX_INSTANCE}`,
        finalBody,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data && response.data.status === 'success') {
        const gateway = response.data.data[0];
        res.json({ 
          success: true, 
          link: gateway.link,
          id: gateway.id
        });
      } else {
        console.error("Payrexx API Error Response:", response.data);
        res.status(400).json({ success: false, error: response.data.message || "Failed to create gateway" });
      }
    } catch (error: any) {
      console.error("Server Error creating Payrexx Gateway:", error.response?.data || error.message);
      res.status(500).json({ success: false, error: error.response?.data?.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve from the dist directory
    // If running from root, dist is in ./dist
    // If running from dist, dist is in . (current directory)
    const distPath = __dirname.endsWith("dist") ? __dirname : path.join(__dirname, "dist");
    
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
