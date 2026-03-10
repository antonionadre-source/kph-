import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";

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
      // This matches PHP's default http_build_query behavior used by Payrexx.
      // RFC 1738: spaces are '+', and other special characters are %-encoded.
      // We must match PHP's urlencode() behavior exactly.
      const php_urlencode = (str: string) => {
          return encodeURIComponent(str)
              .replace(/%20/g, '+')
              .replace(/!/g, '%21')
              .replace(/'/g, '%27')
              .replace(/\(/g, '%28')
              .replace(/\)/g, '%29')
              .replace(/\*/g, '%2A')
              .replace(/~/g, '%7E')
              .replace(/%7E/g, '~'); // PHP's urlencode actually DOES NOT encode ~ in some versions, but RFC 1738 does. 
                                     // However, Payrexx usually expects the PHP default.
                                     // Let's try the most common PHP behavior: spaces as +, ~ as ~, and others encoded.
      };

      // Re-evaluating: PHP's http_build_query(..., PHP_QUERY_RFC1738) 
      // encodes spaces as + and ~ as %7E. 
      // Let's stick to the strict RFC 1738 as requested.
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
      // The Payrexx PHP SDK uses: base64_encode(hash_hmac('sha256', $queryString, $apiSecret, true))
      // The 'true' parameter in PHP's hash_hmac returns raw binary data, which is then base64 encoded.
      const signature = crypto.createHmac('sha256', PAYREXX_API_SECRET).update(queryString).digest('base64');
      
      // Create final payload with signature
      // The signature must be URL-encoded because base64 can contain '+' and '/'
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
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("/*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
