// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ import Firestore
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBeezEipbapV0teLcLfyOUaWgVjW1IvFpI",
  authDomain: "fir-35d06.firebaseapp.com",
  projectId: "fir-35d06",
  storageBucket: "fir-35d06.firebasestorage.app",
  messagingSenderId: "223026049758",
  appId: "1:223026049758:web:959a79f8ea610b76d7484f",
  measurementId: "G-FPFVF03FKP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Exports
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // ✅ Firestore export

// Analytics (optional)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };
