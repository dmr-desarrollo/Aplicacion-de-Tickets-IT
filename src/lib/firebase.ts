
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "activity-compass-qiuxy",
  appId: "1:404587774825:web:70052bbfb3faa34a7bb3f8",
  storageBucket: "activity-compass-qiuxy.firebasestorage.app",
  apiKey: "AIzaSyBY38gKFj6iKTLXUHuEM5DOdaUXe2j0gj8",
  authDomain: "activity-compass-qiuxy.firebaseapp.com",
  messagingSenderId: "404587774825"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
