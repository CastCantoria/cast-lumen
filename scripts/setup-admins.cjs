// scripts/setup-admins.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "votre-api-key",
  authDomain: "votre-project.firebaseapp.com",
  projectId: "votre-project-id",
  storageBucket: "votre-project.appspot.com",
  messagingSenderId: "votre-sender-id",
  appId: "votre-app-id"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Liste des administrateurs à créer
const adminUsers = [
  {
    email: 'ad-castcantoria@outlook.fr',
    password: 'CastCantoria2024!',
    displayName: 'Super Administrateur CAST',
    role: 'super-admin'
  },
  {
    email: 'eric.rasamimanana@gmail.com',
    password: 'CastCantoria2024!', 
    displayName: 'Liva Ramanalinarivo',
    role: 'admin'
  },
  {
    email: 'tena.solution@gmail.com',
    password: 'CastCantoria2024!',
    displayName: 'Sandiniaina Alain RAMAROSON',
    role: 'admin'
  },
  {
    email: 'julesrandriamanantsoa@gmail.com',
    password: 'CastCantoria2024!',
    displayName: 'Jules Randriamanantsoa',
    role: 'admin'
  },
  {
    email: 'positifaid@live.fr',
    password: 'CastCantoria2024!',
    displayName: 'Tovoniaina Rahendrison',
    role: 'admin'
  }
];

async function createAdminUsers() {
  for (const userData of adminUsers) {
    try {
      // Créer l'utilisateur dans Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;
      
      // Mettre à jour le profil avec le displayName
      await updateProfile(user, {
        displayName: userData.displayName
      });
      
      // Créer le document utilisateur dans Firestore avec le rôle
      await setDoc(doc(db, 'users', user.uid), {
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        createdAt: new Date(),
        isActive: true,
        permissions: getPermissionsByRole(userData.role)
      });
      
      console.log(`✅ ${userData.displayName} créé avec succès (${userData.role})`);
      
    } catch (error) {
      console.error(`❌ Erreur pour ${userData.email}:`, error.message);
    }
  }
}

function getPermissionsByRole(role) {
  const permissions = {
    'super-admin': [
      'users:read', 'users:write', 'users:delete',
      'events:read', 'events:write', 'events:delete', 
      'content:read', 'content:write', 'content:delete',
      'settings:read', 'settings:write'
    ],
    'admin': [
      'users:read', 'users:write',
      'events:read', 'events:write', 'events:delete',
      'content:read', 'content:write', 'content:delete'
    ]
  };
  
  return permissions[role] || [];
}

// Exécuter le script
createAdminUsers().then(() => {
  console.log('🎉 Configuration des administrateurs terminée !');
  process.exit(0);
}).catch(error => {
  console.error('💥 Erreur lors de la configuration:', error);
  process.exit(1);
});