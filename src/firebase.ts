import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAm1t-K3LnK41NqaU1GF_ZfnwpYkyOSTbU",
  authDomain: "ewallet-crypto.firebaseapp.com",
  databaseURL: "https://ewallet-crypto-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ewallet-crypto",
  storageBucket: "ewallet-crypto.firebasestorage.app",
  messagingSenderId: "877160112132",
  appId: "1:877160112132:web:569cef25a7c831d8845551",
  measurementId: "G-9QVYEQH05E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
