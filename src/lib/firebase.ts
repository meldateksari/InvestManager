import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCkQN-A8GBhR5yF6yqKWUVC6FJ1PXiZ9-M",
  authDomain: "investmanager-496f6.firebaseapp.com",
  projectId: "investmanager-496f6",
  storageBucket: "investmanager-496f6.firebasestorage.app",
  messagingSenderId: "601484218878",
  appId: "1:601484218878:web:a779a5aa88d2a4b1be30af",
  measurementId: "G-6D7ZGV0678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);