// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsFPcA73VLeJiLZw6fQrdp9vQrQ6QQW0g",
  authDomain: "recipeappnew001.firebaseapp.com",
  projectId: "recipeappnew001",
  storageBucket: "recipeappnew001.firebasestorage.app",
  messagingSenderId: "49992306690",
  appId: "1:49992306690:web:ca3659df3e2ba30030571b",
  measurementId: "G-WV0CFBFBPL",
};

// Initialize Firebase app
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  auth = getAuth(app); // fallback if already initialized
}

// Initialize Firestore
const db = getFirestore(app);

// Export auth and db
export { auth, db };
