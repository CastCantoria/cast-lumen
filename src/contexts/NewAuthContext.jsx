import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Créer le contexte
const AuthContext = createContext();

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Fonctions Firestore
const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    return null;
  }
};

const createUserProfile = async (user) => {
  try {
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      role: 'public',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      isActive: true
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Erreur création profil:', error);
    throw error;
  }
};

// Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Connexion Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      let profile = await getUserProfile(user.uid);
      if (!profile) {
        profile = await createUserProfile(user);
      }

      setCurrentUser(user);
      setUserProfile(profile);

      // Message de bienvenue
      console.log('🎉 Connexion réussie ! Bienvenue sur C.A.S.T.');

      return { user, profile };
    } catch (error) {
      console.error('Erreur connexion Google:', error);
      throw error;
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      console.log('👋 Déconnexion réussie. À bientôt sur C.A.S.T.!');
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      throw error;
    }
  };

  // Écouter les changements d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setCurrentUser(user);
        setUserProfile(profile);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signInWithGoogle,
    logout,
    loading,
    isAuthenticated: !!currentUser,
    isAdmin: userProfile?.role === 'admin',
    isMember: ['admin', 'membre'].includes(userProfile?.role)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export pour les composants qui en auraient besoin
export { AuthContext };