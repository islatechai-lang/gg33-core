import { app, setupApp } from "../server/index";

let setupPromise: Promise<any> | null = null;
let setupError: Error | null = null;

export default async function handler(req: any, res: any) {
  // Debug endpoint - accessible at /api/debug to see what's happening on Vercel
  if (req.url === "/api/debug" || req.url?.startsWith("/api/debug?")) {
    const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT;
    const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;
    const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
    const privateKeyPreview = process.env.FIREBASE_PRIVATE_KEY
      ? `starts="${process.env.FIREBASE_PRIVATE_KEY.substring(0, 30)}..." length=${process.env.FIREBASE_PRIVATE_KEY.length}`
      : "NOT SET";

    return res.status(200).json({
      env: {
        FIREBASE_SERVICE_ACCOUNT: hasServiceAccount ? "SET" : "NOT SET",
        FIREBASE_CLIENT_EMAIL: hasClientEmail ? process.env.FIREBASE_CLIENT_EMAIL : "NOT SET",
        FIREBASE_PRIVATE_KEY: privateKeyPreview,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "NOT SET",
        NODE_ENV: process.env.NODE_ENV || "NOT SET",
        VERCEL: process.env.VERCEL || "NOT SET",
      },
      setupError: setupError ? setupError.message : null,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    if (!setupPromise) {
      setupPromise = setupApp().catch((err) => {
        setupError = err;
        console.error("[Vercel Handler] setupApp failed:", err);
        throw err;
      });
    }
    await setupPromise;
    return app(req, res);
  } catch (err: any) {
    console.error("[Vercel Handler] Fatal error:", err);
    res.status(500).json({
      error: "Server initialization failed",
      message: err?.message || "Unknown error",
      stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
    });
  }
}
