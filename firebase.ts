// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC_78ZA0pXZ69lMsbMBGf2eGeKu_l9NgjY',
  authDomain: 'taboo-ai-460c5.firebaseapp.com',
  projectId: 'taboo-ai-460c5',
  storageBucket: 'taboo-ai-460c5.appspot.com',
  messagingSenderId: '308193257813',
  appId: '1:308193257813:web:91702298215367f92367dc',
  measurementId: 'G-TE1WMCGWRP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const realtime = getDatabase(app);
