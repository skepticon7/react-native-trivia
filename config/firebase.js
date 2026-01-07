// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  
import { getFirestore } from "firebase/firestore";  // <--- Needed for Database      // <--- This line was likely missing
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2pQJOahk5E1j6yu8SkddUWj3qWNAggm0",
  authDomain: "trivia-app-dv.firebaseapp.com",
  projectId: "trivia-app-dv",
  storageBucket: "trivia-app-dv.firebasestorage.app",
  messagingSenderId: "237900271600",
  appId: "1:237900271600:web:e3341773119d1aaebc9735",
  measurementId: "G-GWK8PZBRX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);


