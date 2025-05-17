// firebase.js

// Firebase imports
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDl6QCyYBGWyOU4U20wifrl5GVqp1ALBHk",
  authDomain: "recipe-book-35c4a.firebaseapp.com",
  projectId: "recipe-book-35c4a",
  storageBucket: "recipe-book-35c4a.appspot.com",
  messagingSenderId: "638063954931",
  appId: "1:638063954931:web:77365f18224cafed8be086"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Export services
export { auth, db };
