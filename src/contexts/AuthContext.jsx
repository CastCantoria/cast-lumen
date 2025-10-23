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

const updateUserLastLogin = async (uid) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      lastLogin: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur mise à jour dernière connexion:', error);
  }
};

// Fonction utilitaire pour la redirection
const getRedirectPath = (role) => {
  switch (role) {
    case 'super-admin':
      return '/super-admin';
    case 'admin':
      return '/admin';
    case 'membre':
      return '/member';
    default:
      return '/dashboard';
  }
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

  // Fonction de redirection automatique
  const redirectUser = (profile) => {
    if (!profile) return;
    
    const redirectPath = getRedirectPath(profile.role);
    console.log(`🔄 Redirection automatique vers: ${redirectPath}`);
    
    // Utiliser window.location pour une redirection complète
    setTimeout(() => {
      window.location.href = redirectPath;
    }, 1000);
  };

  // Connexion Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Vérifier/Créer le profil en base
      let profile = await getUserProfile(user.uid);
      if (!profile) {
        profile = await createUserProfile(user);
      } else {
        await updateUserLastLogin(user.uid);
      }
      
      setCurrentUser(user);
      setUserProfile(profile);
      
      console.log('🎉 Connexion Google réussie ! Bienvenue sur C.A.S.T.');
      
      // Redirection automatique
      redirectUser(profile);
      
      return { user, profile };
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
      if (profile) {
        await updateUserLastLogin(user.uid);
        setCurrentUser(user);
        setUserProfile(profile);
        
        console.log('🎉 Connexion réussie ! Bienvenue sur C.A.S.T.');
        
        // Redirection automatique
        redirectUser(profile);
        
        return { success: true, user, profile };
      } else {
        // Créer un profil si inexistant
        const newProfile = await createUserProfile(user);
        setCurrentUser(user);
        setUserProfile(newProfile);
        
        console.log('🎉 Connexion réussie ! Profil créé.');
        
        // Redirection automatique
        redirectUser(newProfile);
        
        return { success: true, user, profile: newProfile };
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
      return { success: false, error: error.message };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      console.log('👋 Déconnexion réussie. À bientôt sur C.A.S.T.!');
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      
      // Redirection vers la page d'accueil
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
        
        // Rediriger si sur la page d'accueil après connexion
        if (window.location.pathname === '/' && profile) {
          console.log('🔄 Redirection depuis la page d\'accueil...');
          redirectUser(profile);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
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
    isAuthenticated: !!currentUser,
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