// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        // Récupérer les données supplémentaires de Firestore
        const userDoc = await getDoc(doc(db, 'users', userAuth.uid));
        const userData = userDoc.data();
        
        setUser({
          uid: userAuth.uid,
          email: userAuth.email,
          role: userData?.role || 'visitor',
          ...userData
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  };

  const register = async (email, password, userData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Ajouter les données supplémentaires dans Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role: 'member',
      createdAt: new Date(),
      ...userData
    });

    return userCredential;
  };

  const logout = () => signOut(auth);

  return { user, login, register, logout, loading };
};
