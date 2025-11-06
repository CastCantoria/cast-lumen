import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db 
} from '../lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup, // ← AJOUT
  GoogleAuthProvider, // ← AJOUT
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
  const [googleLoading, setGoogleLoading] = useState(false); // ← AJOUT

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

      // Mettre à jour l'état local
      setUserProfile(userProfile);

      return userCredential;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  };

  // Se connecter avec email/mot de passe
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Connexion email réussie:', userCredential.user.email);
      
      // Charger le profil utilisateur après connexion
      await loadUserProfile(userCredential.user);
      
      return userCredential;
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  };

  // 🔥 CONNEXION GOOGLE - NOUVELLE FONCTION
  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      console.log('🎯 Début connexion Google...');
      
      const provider = new GoogleAuthProvider();
      // Ajouter des scopes si nécessaire
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      console.log('✅ Connexion Google réussie:', user.email);

      // Vérifier si l'utilisateur existe déjà dans Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Créer le profil utilisateur dans Firestore
        console.log('📝 Création du profil Google');
        const userProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || '',
          role: 'user', // Rôle par défaut
          isActive: true,
          authProvider: 'google',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(doc(db, 'users', user.uid), userProfile);
        setUserProfile(userProfile);
        console.log('✅ Profil Google créé');
      } else {
        // Mettre à jour les informations si nécessaire
        const existingProfile = userDoc.data();
        const updates = {
          updatedAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        };
        
        // Mettre à jour la photo si elle a changé
        if (user.photoURL && user.photoURL !== existingProfile.photoURL) {
          updates.photoURL = user.photoURL;
        }
        
        // Mettre à jour le displayName si il a changé
        if (user.displayName && user.displayName !== existingProfile.displayName) {
          updates.displayName = user.displayName;
        }
        
        await updateDoc(doc(db, 'users', user.uid), updates);
        setUserProfile({ ...existingProfile, ...updates });
        console.log('✅ Profil Google mis à jour');
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ Erreur connexion Google:', error);
      
      // Gestion d'erreurs spécifiques à Google
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Connexion Google annulée');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup bloqué. Veuillez autoriser les popups pour ce site.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Erreur réseau. Vérifiez votre connexion internet.');
      } else {
        throw new Error('Erreur de connexion Google: ' + error.message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Se déconnecter
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setCurrentUser(null);
      console.log('✅ Déconnexion réussie');
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
        console.log('🔄 Chargement du profil pour:', user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profileData = userDoc.data();
          console.log('📋 Profil utilisateur trouvé:', profileData);
          setUserProfile(profileData);
        } else {
          // Créer un profil basique si non existant
          console.log('📝 Création du profil basique');
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
    console.log('🔄 Initialisation AuthProvider...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔍 Auth state changed:', user?.email);
      
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
    signInWithGoogle, // ← AJOUT
    googleLoading, // ← AJOUT
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}