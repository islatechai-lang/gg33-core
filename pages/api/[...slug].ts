import type { NextApiRequest, NextApiResponse } from "next";
import express from "express";
import { registerRoutes } from "../../server/routes";

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

let isRoutesRegistered = false;
const routesPromise = (async () => {
  if (!isRoutesRegistered) {
    // Register Express API routes onto Next.js Express instance
    await registerRoutes(null as any, app);
    isRoutesRegistered = true;
  }
})();

export const config = {
  api: {
    bodyParser: false, // Express handles body parsing
    externalResolver: true,
  },
  maxDuration: 60, // Allow up to 60 seconds for AI generation
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await routesPromise;
    return new Promise<void>((resolve) => {
      app(req as any, res as any, (err: any) => {
        if (err) {
          console.error("[Next API Catch-all Error]:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: err?.message || "Internal Server Error" });
          }
          return resolve();
        }
        resolve();
      });
    });
  } catch (error: any) {
    console.error("[Next API Fatal Error]:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  }
}
