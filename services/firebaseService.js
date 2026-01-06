import {auth , db} from '../config/firebase';
import { arrayUnion } from 'firebase/firestore';


import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile} from 'firebase/auth'

import {doc, getDoc, setDoc} from 'firebase/firestore';

export const signUp = async (email , password , username) => {
    const userCredentials = await createUserWithEmailAndPassword(auth ,email , password);

    const user = userCredentials.user;

    await updateProfile(user, {
        displayName: username,
    });

    await setDoc(doc(db , "users" , user.uid) , {
        email,
        username,
        createdAt: new Date(),
    });

    return user;
};


export const login = async (email , password) => {
    const userCredentials = await signInWithEmailAndPassword(auth ,email , password);
    console.log("user is :" + JSON.stringify(userCredentials));
    return userCredentials.user;
}

export const getQuizSessionFromFirebase = async (topicId) => {
    try{
        const user = getAuth().currentUser;
        if(!user) return null;


        const docRef = doc(db , `quizSessions` ,`${user.uid}_${topicId}`);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
            return docSnap.data();
        }
        else
            return null;

    }catch (e) {
        console.log(`Error getting quiz session from firebase : ${e}`);
        return null;
    }
}

export const saveQuizSessionToFirebase = async (topicId, questions, currentIndex , score) => {
    try {
        const user = getAuth().currentUser;
        if (!user) return;

        console.log(user);


        const docRef = doc(db, 'quizSessions', `${user.uid}_${topicId}`);
        await setDoc(docRef, {
            questions,
            currentIndex,
            score,
            lastUpdated: new Date().toISOString(),
        });
    } catch (err) {
        console.log('Error saving quiz session to Firebase:', err);
    }
};


export const saveQuizHistoryToFirebase = async (topicId , finalScore) => {
    try{
        const user = getAuth().currentUser;
        if (!user)
            return;

        const historyRef = doc(db , 'quizHistory' , user.uid);
        const entry = {
            topic : topicId,
            score : finalScore,
            date : new Date().toISOString(),
        };

        await setDoc(historyRef, {
            entries: arrayUnion(entry),
        }, { merge: true });

    }catch (e) {
        console.log(`Error saving quiz history to firebase : ${e}`);
    }
}


export const getQuizHistoryFromFirebase = async () => {
    try{

        const user = getAuth().currentUser;
        if(!user) return;

        const docRef = doc(db , 'quizHistory' , user.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().entries || [] : [];
    }catch (e) {
        console.log(`Error getting quiz history from firebase : ${e}`);
    }
}

export const getTodaysQuizHistoryFromFirebase = async () => {
    try {
        const user = getAuth().currentUser;
        if (!user) return [];

        const docRef = doc(db, 'quizHistory', user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return [];

        const entries = docSnap.data().entries || [];

        // Get today's date in local time (year, month, day)
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();

        // Filter entries that happened today
        const todaysEntries = entries.filter((entry) => {
            const entryDate = new Date(entry.date);
            return (
                entryDate.getFullYear() === todayYear &&
                entryDate.getMonth() === todayMonth &&
                entryDate.getDate() === todayDate
            );
        });

        return todaysEntries;
    } catch (e) {
        console.log(`Error getting today's quiz history from firebase: ${e}`);
        return [];
    }
};
