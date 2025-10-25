import fs from 'fs';
import path from 'path';

console.log('🔧 RÉPARATION DES CYCLES D\'IMPORTS...\n');

// Réparer AuthContext.jsx
const authContextPath = 'src/contexts/AuthContext.jsx';
if (fs.existsSync(authContextPath)) {
  const authContextContent = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserProfile(user ? { 
        uid: user.uid, 
        email: user.email, 
        displayName: user.displayName,
        role: 'registered-user' 
      } : null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};`;

  fs.writeFileSync(authContextPath, authContextContent);
  console.log('✅ AuthContext.jsx réparé');
}

// Créer/corriger firebase.js
const firebaseConfigPath = 'src/config/firebase.js';
if (!fs.existsSync(firebaseConfigPath)) {
  const firebaseContent = `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase - À remplacer par vos vraies clés
const firebaseConfig = {
  apiKey: "votre-api-key",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "votre-app-id"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;`;

  const dir = path.dirname(firebaseConfigPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(firebaseConfigPath, firebaseContent);
  console.log('✅ firebase.js créé');
}

console.log('\n🎉 Cycles d\'imports réparés !');