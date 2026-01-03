// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADmUIr4jdEggcEvmSu8M32Zz4bBqDOKp4",
  authDomain: "neuro-ai-9efea.firebaseapp.com",
  projectId: "neuro-ai-9efea",
  storageBucket: "neuro-ai-9efea.firebasestorage.app",
  messagingSenderId: "487645543908",
  appId: "1:487645543908:web:123b31ac50c02bf7905bf1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- THESE EXPORTS ARE CRITICAL ---
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// 1. Export the Login Function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login Error:", error);
    return null;
  }
};

// 2. Export the Logout Function
export const logoutUser = async () => {
  await signOut(auth);
  window.location.reload();
};