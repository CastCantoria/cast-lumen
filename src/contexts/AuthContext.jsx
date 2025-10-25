import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const AuthContext = createContext();

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
      role: 'registered-user', // Rôle par défaut
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

const updateUserLastLogin = async (uid) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      lastLogin: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur mise à jour dernière connexion:', error);
  }
};

// FONCTION DE REDIRECTION SIMPLIFIÉE - TOUJOURS VERS LE DASHBOARD UNIQUE
const getRedirectPath = (role) => {
  console.log('🎯 Redirection vers dashboard unique pour rôle:', role);
  return '/dashboard'; // TOUJOURS le même dashboard
};

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // FONCTION DE REDIRECTION CORRIGÉE
  const redirectToDashboard = () => {
    const redirectPath = getRedirectPath(userProfile?.role);
    console.log(`🔄 Redirection automatique vers: ${redirectPath}`);
    
    // Utiliser window.location.hash pour HashRouter
    setTimeout(() => {
      window.location.hash = redirectPath;
    }, 1000); // 1 seconde pour voir le message de succès
  };

  // GESTIONNAIRE DE CONNEXION RÉUSSIE
  const handleLoginSuccess = async (user, existingProfile = null) => {
    console.log('✅ Connexion réussie pour:', user.email);
    
    let profile = existingProfile;
    
    // Créer le profil si inexistant
    if (!profile) {
      profile = await createUserProfile(user);
    } else {
      await updateUserLastLogin(user.uid);
    }
    
    setCurrentUser(user);
    setUserProfile(profile);
    setIsAuthenticated(true);
    
    // REDIRECTION SIMPLE VERS LE DASHBOARD UNIQUE
    console.log('🚀 Redirection vers /dashboard');
    redirectToDashboard();
    
    return { user, profile };
  };

  // Connexion Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Vérifier/Créer le profil en base
      let profile = await getUserProfile(user.uid);
      
      return await handleLoginSuccess(user, profile);
    } catch (error) {
      console.error('Erreur connexion Google:', error);
      throw error;
    }
  };

  // Connexion email/mot de passe
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Récupérer le profil utilisateur
      const profile = await getUserProfile(user.uid);
      
      return await handleLoginSuccess(user, profile);
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw new Error(error.message);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      console.log('👋 Déconnexion réussie. À bientôt sur C.A.S.T.!');
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      
      // Redirection vers la page d'accueil
      setTimeout(() => {
        window.location.hash = '/';
      }, 500);
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
        setIsAuthenticated(true);
        
        console.log('✅ Utilisateur connecté:', profile?.email, '- Rôle:', profile?.role);
        
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    // Utilisateurs
    user: currentUser,
    currentUser,
    userProfile,
    
    // Méthodes d'authentification
    signInWithGoogle,
    login,
    logout,
    
    // Fonction utilitaire
    getRedirectPath,
    
    // États
    loading,
    isAuthenticated,
    isAdmin: userProfile?.role === 'admin',
    isMember: ['admin', 'membre', 'registered-user'].includes(userProfile?.role),
    isSuperAdmin: userProfile?.role === 'super-admin',
    isCoreTeam: userProfile?.role === 'core-team'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };