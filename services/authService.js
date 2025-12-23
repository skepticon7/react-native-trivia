import {auth , db} from '../config/firebase';



import {createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile} from 'firebase/auth'

import {doc , setDoc} from 'firebase/firestore';

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