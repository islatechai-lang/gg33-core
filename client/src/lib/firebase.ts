import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const getEnv = (key: string) => {
  if (typeof process !== "undefined" && process.env) {
    return process.env[`NEXT_PUBLIC_${key}`] || process.env[key] || process.env[`VITE_${key}`];
  }
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnv("FIREBASE_API_KEY") || "AIzaSyDW3srHeiTH8TbsbOZ4eUAwDVpITVkU9rM",
  authDomain: getEnv("FIREBASE_AUTH_DOMAIN") || "gg33-core.firebaseapp.com",
  projectId: getEnv("FIREBASE_PROJECT_ID") || "gg33-core",
  storageBucket: getEnv("FIREBASE_STORAGE_BUCKET") || "gg33-core.firebasestorage.app",
  messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID") || "710664035919",
  appId: getEnv("FIREBASE_APP_ID") || "1:710664035919:web:bedd2020927501a97d943a",
  measurementId: getEnv("FIREBASE_MEASUREMENT_ID") || "G-XYPJXN0DZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
