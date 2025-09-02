// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// ------------------------
// 🔹 Firebase Config from .env
// ------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ------------------------
// 🔹 Initialize Firebase
// ------------------------
const app = initializeApp(firebaseConfig);

// 🔑 Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 📦 Firestore
export const db = getFirestore(app);

// 📊 Analytics (optional)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };

// ======================
// 🔹 Helper Functions
// ======================

// Email/Password Sign Up
export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Email/Password Login
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Google Sign In
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Logout
export const logout = () => {
  return signOut(auth);
};
