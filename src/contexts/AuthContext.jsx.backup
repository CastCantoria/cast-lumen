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

// FONCTION CORRIGÉE POUR HashRouter - AJOUT DU #
const getRedirectPath = (role) => {
  switch (role) {
    case 'super-admin':
      return '/#/super-admin';
    case 'admin':
      return '/#/admin';
    case 'membre':
      return '/#/member';
    default:
      return '/#/dashboard';
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

  // FONCTION DE REDIRECTION CORRIGÉE
  const redirectUser = (profile) => {
    if (!profile) return;
    
    const redirectPath = getRedirectPath(profile.role);
    console.log(`🔄 Redirection automatique HashRouter vers: ${redirectPath}`);
    
    // Utiliser window.location avec le # pour HashRouter
    setTimeout(() => {
      window.location.href = redirectPath;
    }, 1500); // Augmenté à 1.5s pour laisser le temps à l'UI de s'afficher
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
      
      // Redirection automatique AVEC SUCCÈS VISUEL
      setTimeout(() => {
        redirectUser(profile);
      }, 2000); // Laisser 2s pour voir le message de succès
      
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
        
        // Redirection automatique AVEC SUCCÈS VISUEL
        setTimeout(() => {
          redirectUser(profile);
        }, 2000);
        
        return { success: true, user, profile };
      } else {
        // Créer un profil si inexistant
        const newProfile = await createUserProfile(user);
        setCurrentUser(user);
        setUserProfile(newProfile);
        
        console.log('🎉 Connexion réussie ! Profil créé.');
        
        // Redirection automatique
        setTimeout(() => {
          redirectUser(newProfile);
        }, 2000);
        
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
      
      // Redirection vers la page d'accueil AVEC #
      setTimeout(() => {
        window.location.href = '/#/';
      }, 1000);
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
        
        // NE PAS rediriger automatiquement depuis la page d'accueil
        // Laisser l'utilisateur voir la page et naviguer manuellement
        // ou utiliser un bouton de redirection explicite
        console.log('✅ Utilisateur connecté:', profile?.email);
        
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