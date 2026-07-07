import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDW3srHeiTH8TbsbOZ4eUAwDVpITVkU9rM",
  authDomain: "gg33-core.firebaseapp.com",
  projectId: "gg33-core",
  storageBucket: "gg33-core.firebasestorage.app",
  messagingSenderId: "710664035919",
  appId: "1:710664035919:web:bedd2020927501a97d943a",
  measurementId: "G-XYPJXN0DZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
