import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "gg33-core";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

let app;

try {
  if (getApps().length === 0) {
    if (serviceAccountJson) {
      // Method 1: Full service account JSON string
      const serviceAccount = JSON.parse(serviceAccountJson);
      app = initializeApp({
        credential: cert(serviceAccount)
      });
      console.log("Firebase Admin initialized using FIREBASE_SERVICE_ACCOUNT env variable.");
    } else if (clientEmail && privateKey) {
      // Method 2: Individual env vars
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        })
      });
      console.log("Firebase Admin initialized using individual env vars (FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY).");
    } else {
      // Method 3: Fallback for GCP ADC or local development
      app = initializeApp({
        projectId: projectId
      });
      console.log(`Firebase Admin initialized with project ID: ${projectId}. WARNING: Firestore writes will likely fail without credentials. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY env vars.`);
    }
  } else {
    app = getApp();
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

export const db: Firestore = getFirestore();

// Helper to check connection or mock connection
export async function connectDB(): Promise<boolean> {
  try {
    // A simple read/ping to Firestore to check connection
    // We try to list collections, which should fail if not configured
    await db.listCollections();
    return true;
  } catch (error) {
    console.error("Firestore connection check failed (you might need to set FIREBASE_SERVICE_ACCOUNT):", error);
    // Return true for local emulator, but false for actual connection failures.
    // If we're using local firestore emulator, it should work fine.
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
