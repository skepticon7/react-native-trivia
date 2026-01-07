import React, {createContext, useState, useEffect, useContext} from 'react';
import {auth , db} from '../config/firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {doc , getDoc} from 'firebase/firestore';
import {signOut} from "firebase/auth";

const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth , async (currentUser) => {
            if(currentUser) {
                const docRef = doc(db , "users" , currentUser.uid);
                const docSnap = await getDoc(docRef);
                setUser({uid : currentUser.uid , email : currentUser.email ,username : currentUser.username, ...docSnap.data()});
            }else{
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();

    } , [])

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        }catch (e) {
            console.log(`Error : ${e}`);
        }
    }


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )


}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;