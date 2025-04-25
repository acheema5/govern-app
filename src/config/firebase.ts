import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  // Your Firebase configuration from the Firebase Console
  apiKey: "AIzaSyDr5W-jffMUegHxKfs7j2GDSFDY28AT7FI",
  authDomain: "government-6e44c.firebaseapp.com",
  projectId: "government-6e44c",
  storageBucket: "government-6e44c.firebasestorage.app",
  messagingSenderId: "718894323640",
  appId: "1:718894323640:web:5e18665103b7526a63214d",
  measurementId: "G-39E84MY048"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app; 