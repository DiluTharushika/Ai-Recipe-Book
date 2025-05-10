// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBR4RNpUe55n9T6lCJKZCbAV80mlS3zeqk",
  authDomain: "ai-recipe-book-9dc95.firebaseapp.com",
  projectId: "ai-recipe-book-9dc95",
  storageBucket: "ai-recipe-book-9dc95.appspot.com",
  messagingSenderId: "391531708966",
  appId: "1:391531708966:web:23b6a85da951ab88df9ce7",
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth with AsyncStorage for React Native
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  // Fallback if Auth was already initialized
  auth = getAuth(app);
}

// Export instances
export { app, auth, db };
