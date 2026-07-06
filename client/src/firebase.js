import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7WrMKrX6sva09VbUoIUBU_-usdavHJco",
  authDomain: "eatwise-8bdd3.firebaseapp.com",
  projectId: "eatwise-8bdd3",
  storageBucket: "eatwise-8bdd3.firebasestorage.app",
  messagingSenderId: "75545666831",
  appId: "1:75545666831:web:764fd32c4ac9f91203ca7a",
  measurementId: "G-0BRYV80L9G"
};

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

let app;
let auth;
let db;

if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db, isFirebaseConfigured };
