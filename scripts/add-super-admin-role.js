// scripts/add-super-admin-role.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCT_8j9KBKgcYr3naOFRp-Kk-s-gr_A1gs",
  authDomain: "cast-84d3f.firebaseapp.com",
  projectId: "cast-84d3f",
  storageBucket: "cast-84d3f.firebasestorage.app",
  messagingSenderId: "160422742820",
  appId: "1:160422742820:web:f60e6c94ba743d1afd41b1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ⚠️ REMPLACEZ PAR LE VRAI UID DE ad-castcantoria@outlook.fr
const SUPER_ADMIN_UID = 'iniNCYGvv2UEDwmmZMBCf3Gb36V2';

async function addSuperAdminRole() {
  try {
    await setDoc(doc(db, 'users', SUPER_ADMIN_UID), {
      email: 'ad-castcantoria@outlook.fr',
      displayName: 'Super Administrateur CAST',
      role: 'super-admin',
      createdAt: new Date(),
      isActive: true,
      permissions: [
        'users:read', 'users:write', 'users:delete',
        'events:read', 'events:write', 'events:delete', 
        'content:read', 'content:write', 'content:delete',
        'settings:read', 'settings:write',
        'admin:access'
      ]
    }, { merge: true });
    
    console.log('✅ Super Administrateur configuré avec succès !');
    console.log('📧 Email: ad-castcantoria@outlook.fr');
    console.log('🔑 Mot de passe: CastCantoria2024!');
    console.log('👑 Rôle: super-admin');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

addSuperAdminRole();