// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
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

  // Fonction d'inscription
  const register = async (email, password, additionalData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Préparer les données du profil
      const profileData = {
        uid: user.uid,
        email: user.email,
        displayName: `${additionalData.firstName} ${additionalData.lastName}`.trim(),
        firstName: additionalData.firstName || '',
        lastName: additionalData.lastName || '',
        userType: additionalData.userType || 'user',
        role: additionalData.role || '',
        vocalRange: additionalData.role || '', // Pour les membres choristes
        status: additionalData.userType === 'member' ? 'pending' : 'active',
        comment: additionalData.comment || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Mettre à jour le profil Firebase Auth
      if (profileData.displayName) {
        await updateProfile(user, {
          displayName: profileData.displayName
        });
      }

      // Sauvegarder dans Firestore
      await setDoc(doc(db, 'users', user.uid), profileData);
      
      console.log('✅ Utilisateur créé et profil sauvegardé');
      
      return {
        success: true,
        user: user,
        redirectTo: additionalData.userType === 'member' ? '/inscription-pending' : '/profile'
      };

    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      let errorMessage = 'Erreur lors de l\'inscription';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cet email est déjà utilisé';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe est trop faible';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email invalide';
          break;
        default:
          errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Connexion avec Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      
      // Ajouter des scopes si nécessaire
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('✅ Connexion Google réussie:', user.email);

      // Vérifier si l'utilisateur existe déjà dans Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      let isNewUser = !userDoc.exists();
      
      if (isNewUser) {
        // Créer un profil basique pour les nouveaux utilisateurs Google
        const profileData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          userType: 'user', // Par défaut simple utilisateur
          status: 'active',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', user.uid), profileData);
        console.log('📝 Profil utilisateur créé pour Google Sign-In');
      } else {
        console.log('📖 Profil utilisateur existant trouvé');
      }

      return { 
        success: true, 
        user,
        isNewUser
      };
      
    } catch (error) {
      console.error('❌ Erreur Google Sign-In:', error);
      
      let errorMessage = 'Erreur lors de la connexion avec Google';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'La fenêtre de connexion a été fermée';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'La fenêtre popup a été bloquée. Autorisez les popups pour ce site';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'Domaine non autorisé pour la connexion Google';
          break;
        default:
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  // Connexion email/mot de passe
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Vérifier si l'utilisateur existe dans Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        // Créer un profil par défaut si l'utilisateur n'existe pas dans Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), createDefaultProfile(userCredential.user));
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      let errorMessage = 'Erreur de connexion';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Utilisateur non trouvé';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email invalide';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Identifiants invalides. Vérifiez votre email et mot de passe.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives de connexion. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Déconnexion
  const logout = () => {
    return signOut(auth);
  };

  // Charger le profil utilisateur depuis Firestore
  const loadUserProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        // Créer un profil basique si inexistant
        const basicProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          userType: 'user',
          status: 'active'
        };
        await setDoc(doc(db, 'users', user.uid), basicProfile);
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      setUserProfile(null);
    }
  };

  // Écouteur d'état d'authentification
  useEffect(() => {
    console.log('🔍 AuthProvider - Début écoute Firebase Auth');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('👤 AuthStateChanged - User:', user?.email);
      
      if (user) {
        console.log('✅ Utilisateur Firebase trouvé:', user.email);
        setCurrentUser(user);
        await loadUserProfile(user);
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

  const value = {
    currentUser,
    userProfile,
    register,
    login,
    logout,
    signInWithGoogle,
    loading
  };

  console.log('🎯 AuthProvider rendu - loading:', loading, 'user:', currentUser?.email);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};