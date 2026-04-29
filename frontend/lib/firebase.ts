import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "plpg-dbd1e.firebaseapp.com",
  projectId: "plpg-dbd1e",
  storageBucket: "plpg-dbd1e.firebasestorage.app",
  messagingSenderId: "308719645241",
  appId: "1:308719645241:web:5f2e778db45b6e1a8113e8",
  measurementId: "G-7QS0MLYRTP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ ADD THIS (THIS FIXES YOUR ERROR)
export const googleProvider = new GoogleAuthProvider();

// 🔥 OPTIONAL UPGRADE (better UX)
googleProvider.setCustomParameters({
  prompt: "select_account",
});