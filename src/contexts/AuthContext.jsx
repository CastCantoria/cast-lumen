import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('🔄 Initialisation AuthProvider...');

  const createDefaultProfile = (user) => {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  useEffect(() => {
    console.log('🔍 AuthProvider - Début écoute Firebase Auth');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('👤 AuthStateChanged - User:', user?.email);
      
      if (user) {
        console.log('✅ Utilisateur Firebase trouvé:', user.email);
        setCurrentUser(user);
        
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            console.log('✅ Profil utilisateur trouvé:', userDoc.data());
            setUserProfile(userDoc.data());
          } else {
            console.log('🆕 Création profil par défaut');
            const defaultProfile = createDefaultProfile(user);
            await setDoc(doc(db, 'users', user.uid), defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (error) {
          console.error('❌ Erreur chargement profil:', error);
          const defaultProfile = createDefaultProfile(user);
          setUserProfile(defaultProfile);
        }
      } else {
        console.log('👤 Aucun utilisateur connecté');
        setCurrentUser(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('🧹 Nettoyage AuthProvider');
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    console.log('🔐 Tentative de connexion avec:', email);
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    logout,
    setUserProfile
  };

  console.log('🎯 AuthProvider rendu - loading:', loading, 'user:', currentUser?.email);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};