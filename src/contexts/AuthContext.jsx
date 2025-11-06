// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db 
} from '/src/lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // S'inscrire
  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Créer le profil utilisateur dans Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || '',
        role: userData.role || 'user',
        vocalRange: userData.vocalRange || '',
        mission: userData.mission || '',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      // Mettre à jour le profil auth
      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName
        });
      }

      return userCredential;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  };

  // Se connecter
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  };

  // Se déconnecter
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      throw error;
    }
  };

  // Réinitialiser le mot de passe
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Erreur reset password:', error);
      throw error;
    }
  };

  // Mettre à jour le profil
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('Aucun utilisateur connecté');

      // Mettre à jour Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Mettre à jour l'état local
      setUserProfile(prev => ({ ...prev, ...updates }));

      // Mettre à jour le profil auth si displayName change
      if (updates.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName
        });
      }
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      throw error;
    }
  };

  // Charger le profil utilisateur
  const loadUserProfile = async (user) => {
    try {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          // Créer un profil basique si non existant
          const basicProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            role: 'user',
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          await setDoc(doc(db, 'users', user.uid), basicProfile);
          setUserProfile(basicProfile);
        }
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}