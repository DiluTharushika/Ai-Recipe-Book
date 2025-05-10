// AuthService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseconfig';

/**
 * Register a new user with email and password
 */
export const registerUser = async (email, password) => {
  if (!email || !password) {
    console.error('❌ Email and password are required for registration.');
    return null;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ User registered successfully!');
    return userCredential.user;
  } catch (error) {
    console.error('❌ Registration Error:', error.message);
    return null;
  }
};

/**
 * Log in an existing user
 */
export const loginUser = async (email, password) => {
  if (!email || !password) {
    console.error('❌ Email and password are required for login.');
    return null;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ User logged in successfully!');
    return userCredential.user;
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    return null;
  }
};

/**
 * Log out the current user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ User logged out successfully!');
  } catch (error) {
    console.error('❌ Logout Error:', error.message);
  }
};
