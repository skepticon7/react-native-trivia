import {auth , db} from '../config/firebase';


import {createUserWithEmailAndPassword , signInWithEmailAndPassword} from 'firebase/auth'

import {doc , setDoc} from 'firebase/firestore';

export const signUp = async (email , password) => {
    const userCredentials = await createUserWithEmailAndPassword(auth ,email , password);

    const user = userCredentials.user;

    await setDoc(doc(db , "users" , user.uid) , {
        email,
        createdAt: new Date(),
    });

    return user;
};


export const login = async (email , password) => {
    const userCredentials = await signInWithEmailAndPassword(auth ,email , password);
    return userCredentials.user;
}