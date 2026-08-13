import type { NextApiRequest, NextApiResponse } from "next";
import express from "express";
import { registerRoutes } from "../../server/routes";

const app = express();

app.use(express.json());
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
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routesPromise;
  return new Promise<void>((resolve, reject) => {
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
}
