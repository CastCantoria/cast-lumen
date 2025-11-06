import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCT_8j9KBKgcYr3naOFRp-Kk-s-gr_A1gs",
  authDomain: "cast-84d3f.firebaseapp.com",
  projectId: "cast-84d3f",
  storageBucket: "cast-84d3f.appspot.com",
  messagingSenderId: "160422742820",
  appId: "1:160422742820:web:f60e6c94ba743d1afd41b1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminAccounts = [
  {
    email: 'ad-castcantoria@outlook.fr',
    password: 'CastCantoria2024!',
    displayName: 'Super Administrateur CAST',
    role: 'super-admin',
    mission: 'Supervision générale de la plateforme'
  },
  {
    email: 'livaramanalinarivo16@gmail.com',
    password: 'CastCantoria2024!',
    displayName: 'Liva Ramanalinarivo',
    role: 'admin',
    mission: 'Président fondateur'
  },
  {
    email: 'eric.rasamimanana@gmail.com',
    password: 'CastCantoria2024!',
    displayName: 'Eric Rasamimanana',
    role: 'admin',
    mission: 'Programmation Artistique'
  },
  {
    email: 'tena.solution@gmail.com',
    password: 'CastCantoria2024!',
    displayName: 'Sandiniaina Alain RAMAROSON',
    role: 'admin',
    mission: 'Communication & Contenu'
  },
  {
    email: 'julesrandriamanantsoa@gmail.com',
    password: 'CastCantoria2024!',
    displayName: 'Jules Randriamanantsoa',
    role: 'admin',
    mission: 'Gestion des Membres'
  },
  {
    email: 'positifaid@live.fr',
    password: 'CastCantoria2024!',
    displayName: 'Tovoniaina Rahendrison',
    role: 'admin',
    mission: 'Support Technique'
  }
];

async function createAdminAccounts() {
  console.log('🚀 Début de la création des comptes administrateurs...');

  for (const account of adminAccounts) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        account.email,
        account.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: account.email,
        displayName: account.displayName,
        firstName: account.displayName.split(' ')[0],
        lastName: account.displayName.split(' ').slice(1).join(' '),
        userType: 'admin',
        role: account.role,
        mission: account.mission,
        status: 'active',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null
      });

      console.log(`✅ Compte créé: ${account.email} (${account.role})`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`ℹ️ Compte déjà existant: ${account.email}`);
      } else {
        console.error(`❌ Erreur pour ${account.email}:`, error.message);
      }
    }
  }

  console.log('🎯 Création des comptes administrateurs terminée !');
  console.log('📧 Emails:');
  adminAccounts.forEach(acc => {
    console.log(`   - ${acc.email} (${acc.role})`);
  });
  console.log('🔑 Mot de passe pour tous: CastCantoria2024!');
}

createAdminAccounts().catch(console.error);