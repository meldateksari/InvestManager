import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBPGXbGvQzHWQWUXRHHEgVEJxZJGVxZPXE",
  authDomain: "investmanager-496f6.firebaseapp.com",
  projectId: "investmanager-496f6",
  storageBucket: "investmanager-496f6.appspot.com",
  messagingSenderId: "1012475937706",
  appId: "1:1012475937706:web:xxxxxxxxxxxxxxxx"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };