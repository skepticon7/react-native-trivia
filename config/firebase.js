import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyCIzW3Bdvi_jgxi7xt7jnQjeD3klnv7FNs",
    authDomain: "trivia-react-native.firebaseapp.com",
    projectId: "trivia-react-native",
    storageBucket: "trivia-react-native.firebasestorage.app",
    messagingSenderId: "68109944770",
    appId: "1:68109944770:web:81fc3d76553ba983bb785b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);