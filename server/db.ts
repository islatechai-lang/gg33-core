import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import crypto from "crypto";

function parseServiceAccount(val: string | undefined): any | null {
  if (!val) return null;
  let str = val.trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    try {
      str = JSON.parse(str);
    } catch {}
  }
  try {
    return typeof str === 'object' ? str : JSON.parse(str);
  } catch {}
  try {
    const decoded = Buffer.from(str, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {}
  return null;
}

function parsePrivateKey(val: string | undefined): string | undefined {
  if (!val) return undefined;
  let str = val.trim();
  
  // Strip surrounding quotes if present
  while ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1).trim();
  }

  // Replace all variations of escaped newlines with actual line breaks
  str = str.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n");

  // Extract exact PEM block between -----BEGIN... and -----END...-----
  const beginIndex = str.indexOf("-----BEGIN");
  const endIndex = str.lastIndexOf("-----");

  if (beginIndex !== -1 && endIndex !== -1 && endIndex > beginIndex) {
    str = str.substring(beginIndex, endIndex + 5);
  }

  // Ensure header and footer end with newlines
  str = str.replace(/(-----BEGIN [A-Z ]+-----)\s*/, "$1\n");
  str = str.replace(/\s*(-----END [A-Z ]+-----)/, "\n$1");

  // Verify key format with crypto before initializing Firebase Admin
  try {
    const sign = crypto.createSign("RSA-SHA256");
    sign.update("verify-firebase-key");
    sign.sign(str);
    console.log("[Firebase Admin] Private key validated successfully with RSA-SHA256.");
  } catch (err: any) {
    console.error("[Firebase Admin Error] FIREBASE_PRIVATE_KEY is invalid PEM:", err?.message || err);
  }

  return str;
}

const serviceAccountJson = parseServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT);
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "gg33-core";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

let app;

try {
  if (getApps().length === 0) {
    if (serviceAccountJson) {
      app = initializeApp({
        credential: cert(serviceAccountJson)
      });
      console.log("Firebase Admin initialized using FIREBASE_SERVICE_ACCOUNT env variable.");
    } else if (clientEmail && privateKey) {
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        })
      });
      console.log("Firebase Admin initialized using individual env vars (FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY).");
    } else {
      app = initializeApp({
        projectId: projectId
      });
      console.warn(`[Firebase Admin Warning] No service account credentials found (FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT). Firestore operations on Vercel will fail until credentials are set in environment variables.`);
    }
  } else {
    app = getApp();
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

export function isFirestoreConfigured(): boolean {
  if (process.env.FIRESTORE_EMULATOR_HOST) return true;
  if (serviceAccountJson) return true;
  if (clientEmail && privateKey) {
    try {
      const sign = crypto.createSign("RSA-SHA256");
      sign.update("check");
      sign.sign(privateKey);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export const db: Firestore = getFirestore();

// Helper to check connection or mock connection
export async function connectDB(): Promise<boolean> {
  // On Vercel, skip the listCollections ping — it can hang for 10+ seconds
  // if credentials are misconfigured (tries to reach GCE metadata server).
  // Just trust that if we have credentials configured, Firestore will work.
  if (process.env.VERCEL) {
    console.log("[connectDB] Running on Vercel, skipping listCollections ping.");
    return true;
  }

  try {
    // Add a timeout so this never hangs the server
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore connection check timed out after 5s")), 5000)
    );
    await Promise.race([db.listCollections(), timeoutPromise]);
    return true;
  } catch (error) {
    console.error("Firestore connection check failed:", error);
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      return true;
    }
    return false;
  }
}

// TypeScript interfaces
export interface DBUser {
  id: string; // Document ID
  odisId: string;
  whopUserId?: string | null;
  firebaseUid?: string | null;
  email?: string | null;
  whopUsername?: string | null;
  whopProfilePictureUrl?: string | null;
  whopAccessLevel?: 'customer' | 'admin' | 'no_access' | null;
  fullName: string;
  birthDate: Date;
  birthTime?: string | null;
  birthLocation?: string | null;
  isPro: boolean;
  proPaymentReceiptId?: string | null;
  oneSignalPlayerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBDailyEnergy {
  id: string; // Document ID
  odisId: string;
  date: string;
  personalDayNumber: number;
  universalDayNumber: number;
  energyScore: number;
  theme: string;
  description: string;
  dos: string[];
  donts: string[];
  focusArea: string;
  affirmation: string;
  createdAt: Date;
}

export interface DBPersonalityInsight {
  id: string; // Document ID
  odisId: string;
  overview: string;
  strengths: string[];
  challenges: string[];
  lifeLesson: string;
  careerPaths: string[];
  relationshipStyle: string;
  spiritualGifts: string[];
  profileSnapshot: {
    fullName?: string | null;
    birthDate?: string | null;
    lifePathNumber?: number | null;
    expressionNumber?: number | null;
    soulUrgeNumber?: number | null;
    westernZodiac?: string | null;
    chineseZodiac?: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}
