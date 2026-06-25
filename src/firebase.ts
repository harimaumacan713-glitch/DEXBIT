import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeMx9Y8BCtOADBMO4zspWqY4YpI0ReYN4",
  authDomain: "lateral-pillar-f5xj8.firebaseapp.com",
  projectId: "lateral-pillar-f5xj8",
  storageBucket: "lateral-pillar-f5xj8.firebasestorage.app",
  messagingSenderId: "762765049074",
  appId: "1:762765049074:web:9debd5ba3711a369c9e46b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-f0dacf0e-d7b8-4d3f-853f-215d36fa0034");
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
