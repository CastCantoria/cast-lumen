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

// Helper pour les données Firestore
export const prepareFirestoreData = (data) => {
  const prepared = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Supprimer les champs undefined et null
    if (value !== undefined && value !== null) {
      prepared[key] = value;
    }
  });
  
  return prepared;
};

// Helper pour l'upload sécurisé
export const secureUploadData = (file, user = null, additionalData = {}) => {
  const baseData = {
    fileName: file.name || 'sans-nom',
    fileSize: file.size || 0,
    fileType: file.type || 'application/octet-stream',
    uploadDate: serverTimestamp(),
    status: 'pending',
    userId: user?.uid || null,
    userEmail: user?.email || null,
    userRole: user?.role || 'visitor', // Valeur par défaut cruciale
    userDisplayName: user?.displayName || null,
    likes: 0,
    reports: 0,
    moderated: false,
    moderationDate: null,
    moderatorId: null,
    moderatorNotes: '',
    metadata: {
      originalName: file.name,
      uploadTime: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 500) // Limiter la taille
    }
  };
  
  // Fusionner avec les données supplémentaires
  const mergedData = { ...baseData, ...additionalData };
  
  // Préparer pour Firestore (supprimer undefined)
  return prepareFirestoreData(mergedData);
};

console.log('✅ Firebase initialisé avec succès!');
console.log('📊 Services disponibles: db, auth, storage, googleProvider');
console.log('🛠️ Utilitaires: secureUploadData, prepareFirestoreData');

export default app;