import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Récupérer le profil utilisateur
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    return null;
  }
};

// Créer un nouveau profil utilisateur
export const createUserProfile = async (user) => {
  try {
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      role: 'public', // Rôle par défaut
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