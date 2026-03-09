
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * Firebase configuration using environment variables.
 * Fallbacks are provided with the correct format (e.g., AIzaSy... for API Key) 
 * to prevent the Firebase SDK from throwing an "invalid-api-key" error during 
 * module evaluation/initialization.
 */
const firebaseConfig = {
  apiKey: "AIzaSyBlWzrmoaVlcX9ijb7co3bNA9UBlk4H6Sw",
  authDomain: "safelearn-f84f4.firebaseapp.com",
  projectId: "safelearn-f84f4",
  storageBucket: "safelearn-f84f4.firebasestorage.app",
  messagingSenderId: "627598980722",
  appId: "1:627598980722:web:b5edea3a4d95ce935c34eb"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);


// Initialize and export Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
