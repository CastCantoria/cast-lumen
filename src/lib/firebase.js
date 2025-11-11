// src/lib/firebase.js
// Import des SDK Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { GoogleAuthProvider } from 'firebase/auth';

// Configuration Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validation de la configuration
const validateFirebaseConfig = (config) => {
  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.error('❌ Configuration Firebase manquante:', missing);
    throw new Error(`Configuration Firebase incomplète: ${missing.join(', ')}`);
  }
  
  console.log('✅ Configuration Firebase validée');
  return true;
};

// Initialiser Firebase
console.log('🚀 Initialisation Firebase...');
validateFirebaseConfig(firebaseConfig);

const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configuration du provider Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export des utilitaires Firebase
export { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

export {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Helper pour nettoyer les données Firestore (supprimer undefined)
export const prepareFirestoreData = (data) => {
  const cleaned = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Supprimer les champs undefined, null et les objets vides
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !(value instanceof Date) && !Array.isArray(value)) {
        // Nettoyer les objets imbriqués
        const cleanedNested = prepareFirestoreData(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  });
  
  return cleaned;
};

// Helper pour créer des données d'upload sécurisées
export const createUploadData = (file, user = null, additionalData = {}) => {
  const baseData = {
    fileName: file?.name || 'sans-nom',
    fileSize: file?.size || 0,
    fileType: file?.type || 'application/octet-stream',
    uploadDate: serverTimestamp(),
    status: 'pending',
    userId: user?.uid || 'anonymous',
    userEmail: user?.email || 'unknown@example.com',
    userRole: user?.role || 'user', // VALEUR PAR DÉFAUT GARANTIE
    userDisplayName: user?.displayName || 'Utilisateur',
    likes: 0,
    reports: 0,
    moderated: false,
    moderationDate: null,
    moderatorId: null,
    moderatorNotes: '',
    metadata: {
      originalName: file?.name || 'sans-nom',
      uploadTime: new Date().toISOString(),
      userAgent: navigator.userAgent?.substring(0, 200) || 'unknown'
    }
  };
  
  // Fusionner avec les données supplémentaires
  const mergedData = { ...baseData, ...additionalData };
  
  // Préparer pour Firestore (supprimer undefined)
  return prepareFirestoreData(mergedData);
};

console.log('✅ Firebase initialisé avec succès!');
console.log('📊 Services disponibles: db, auth, storage, googleProvider');
console.log('🛠️ Utilitaires: prepareFirestoreData, createUploadData');

export default app;