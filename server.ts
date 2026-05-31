import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Configuration, HttpBearerAuth, TransactionsService } from "wallee";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Wallee Configuration
  const WALLEE_USER_ID = Number((process.env.WALLEE_USER_ID || '13554').trim());
  const WALLEE_SECRET_KEY = (process.env.WALLEE_SECRET_KEY || 'N2f/782B3pB9CgI/S/I6q9fIqWpE6T4f0U9n8t7m6l5=').trim();
  const WALLEE_SPACE_ID = Number((process.env.WALLEE_SPACE_ID || '16902').trim());

  // Initialize Wallee SDK
  const walleeConfig = new Configuration({
    httpBearerAuth: new HttpBearerAuth(WALLEE_USER_ID, WALLEE_SECRET_KEY)
  });
  const transactionsService = new TransactionsService(walleeConfig);

  // API Route to create a Wallee Transaction and retrieve Payment Page URL
  app.post("/api/wallee/create-transaction", async (req, res) => {
    try {
      const { amount, currency, title, description, clientName, email } = req.body;

      const appUrl = process.env.APP_URL || `https://${req.get('host')}`;
      const merchantRef = `booking_${Date.now()}`;

      console.log(`Creating Wallee transaction for space ${WALLEE_SPACE_ID}...`);

      // Create transaction
      const transactionResponse = await transactionsService.postPaymentTransactions({
        space: WALLEE_SPACE_ID,
        transactionCreate: {
          currency: currency || 'CHF',
          successUrl: `${appUrl}/?payment=success`,
          failedUrl: `${appUrl}/?payment=failed`,
          customerEmailAddress: email || undefined,
          merchantReference: merchantRef,
          language: 'de-CH',
          lineItems: [
            {
              uniqueId: `line_${Date.now()}`,
              name: description ? `${title} - ${description}` : (title || 'Kraken Properties Service'),
              quantity: 1,
              amountIncludingTax: Number(amount) || 0,
              type: 'PRODUCT'
            }
          ]
        }
      });

      console.log("Transaction created. ID:", transactionResponse.id);

      // Fetch payment page redirection URL
      const paymentPageUrl = await transactionsService.getPaymentTransactionsIdPaymentPageUrl({
        space: WALLEE_SPACE_ID,
        id: transactionResponse.id!
      });

      console.log("Fetched Wallee Payment Page URL successfully:", paymentPageUrl);

      res.json({
        success: true,
        link: paymentPageUrl,
        id: transactionResponse.id?.toString()
      });

    } catch (error: any) {
      console.error("Server Error creating Wallee Transaction:", error.response?.data || error.message || error);
      
      let errMsg = "Failed to create transaction";
      if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      } else if (error.message) {
        errMsg = error.message;
      } else if (typeof error === 'string') {
        errMsg = error;
      }

      // Check if this error is likely related to inactive/misconfigured credentials
      const isConfigError = errMsg.toLowerCase().includes("authentication") || 
                            errMsg.toLowerCase().includes("invalid credentials") ||
                            errMsg.toLowerCase().includes("credentials") ||
                            WALLEE_USER_ID === 13554; // Default mockup code is assumed to be invalid

      res.status(200).json({
        success: false,
        error: errMsg,
        isLicenseError: isConfigError
      });
    }
  });

  // Keep compatibility alias for Payrexx endpoint so we don't break old cached scripts
  app.post("/api/payrexx/create-gateway", async (req, res) => {
    // Forward directly to the Wallee transaction creator
    req.url = "/api/wallee/create-transaction";
    (app as any).handle(req, res);
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
