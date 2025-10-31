// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv6wHRBBaHM3EwKLOnrz3fW38gIb9PNZw",
  authDomain: "gen-ai-helper-project.firebaseapp.com",
  projectId: "gen-ai-helper-project",
  storageBucket: "gen-ai-helper-project.firebasestorage.app",
  messagingSenderId: "389285639653",
  appId: "1:389285639653:web:449255d23db58af71d2b0c",
  measurementId: "G-6KQD8RD4Y6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);