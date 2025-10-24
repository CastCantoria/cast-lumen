// scripts/create-all-admins-complete.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
const auth = getAuth(app);
const db = getFirestore(app);

// Liste complète des administrateurs
const allAdmins = [
  {
    email: 'ad-castcantoria@outlook.fr',
    password: 'CastCantoria2024!',
    displayName: 'Super Administrateur CAST',
    role: 'super-admin',
    specialite: 'Supervision générale de la plateforme'
  },
  {
    email: 'eric.rasamimanana@gmail.com',
    password: 'CastCantoria2024!',
    displayName: 'Liva Ramanalinarivo',
    role: 'admin',
    specialite: 'Programmation Artistique'
  },
  {
    email: 'tena.solution@gmail.com',
    password: 'CastCantoria2024!',
    displayName: 'Sandiniaina Alain RAMAROSON',
    role: 'admin',
    specialite: 'Communication & Contenu'
  },
  {
    email: 'julesrandriamanantsoa@gmail.com',
    password: 'CastCantoria2024!',
    displayName: 'Jules Randriamanantsoa',
    role: 'admin',
    specialite: 'Gestion des Membres'
  },
  {
    email: 'positifaid@live.fr',
    password: 'CastCantoria2024!',
    displayName: 'Tovoniaina Rahendrison',
    role: 'admin',
    specialite: 'Support Technique'
  }
];

async function createAllAdmins() {
  console.log('🎵 C.A.S.T. LUMEN - Création des administrateurs\n');
  console.log('=' .repeat(50));
  
  let createdCount = 0;
  let existingCount = 0;
  let errorCount = 0;

  for (const admin of allAdmins) {
    try {
      console.log(`\n📧 Traitement: ${admin.email}`);
      console.log(`👤 Nom: ${admin.displayName}`);
      console.log(`👑 Rôle: ${admin.role}`);
      console.log(`🎯 Spécialité: ${admin.specialite}`);
      
      // Créer l'utilisateur dans Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        admin.email, 
        admin.password
      );
      const user = userCredential.user;
      
      // Mettre à jour le profil avec le displayName
      await updateProfile(user, {
        displayName: admin.displayName
      });
      
      // Créer le document dans Firestore avec toutes les informations
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role,
        specialite: admin.specialite,
        createdAt: new Date(),
        lastLogin: null,
        isActive: true,
        profileCompleted: false,
        emailVerified: false,
        permissions: getPermissionsByRole(admin.role),
        preferences: {
          notifications: true,
          newsletter: true,
          language: 'fr'
        }
      });
      
      console.log(`✅ CRÉÉ AVEC SUCCÈS!`);
      console.log(`   🔐 UID: ${user.uid}`);
      console.log(`   📧 Login: ${admin.email}`);
      console.log(`   🔑 Mot de passe: ${admin.password}`);
      
      createdCount++;
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  DÉJÀ EXISTANT - Rôle à vérifier`);
        console.log(`   ℹ️  L'utilisateur existe déjà dans Authentication`);
        existingCount++;
      } else if (error.code === 'auth/weak-password') {
        console.log(`❌ MOT DE PASSE TROP FAIBLE`);
        errorCount++;
      } else if (error.code === 'auth/invalid-email') {
        console.log(`❌ EMAIL INVALIDE`);
        errorCount++;
      } else {
        console.log(`❌ ERREUR: ${error.code}`);
        console.log(`   💬 ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('─'.repeat(50));
  }

  // Résumé final
  console.log('\n🎊 RÉSUMÉ FINAL');
  console.log('=' .repeat(30));
  console.log(`✅ ${createdCount} comptes créés avec succès`);
  console.log(`⚠️  ${existingCount} comptes déjà existants`);
  console.log(`❌ ${errorCount} erreurs`);
  
  console.log('\n🔗 ACCÈS À LA PLATEFORME');
  console.log('=' .repeat(30));
  console.log('🌐 URL: https://cast-lumen.vercel.app');
  console.log('🔐 Page de connexion: /login');
  
  console.log('\n📋 INFORMATIONS DE CONNEXION');
  console.log('=' .repeat(30));
  console.log('🔑 Mot de passe temporaire pour tous: CastCantoria2024!');
  console.log('📝 Les utilisateurs doivent changer leur mot de passe à la première connexion');
  
  console.log('\n👨‍💼 ÉQUIPE ADMINISTRATIVE');
  console.log('=' .repeat(30));
  allAdmins.forEach(admin => {
    const emoji = admin.role === 'super-admin' ? '👑' : '⚙️';
    console.log(`${emoji} ${admin.displayName} - ${admin.role}`);
    console.log(`   📧 ${admin.email}`);
    console.log(`   🎯 ${admin.specialite}`);
  });
}

function getPermissionsByRole(role) {
  const permissions = {
    'super-admin': [
      'users:read', 'users:write', 'users:delete', 'users:manage',
      'events:read', 'events:write', 'events:delete', 'events:manage',
      'content:read', 'content:write', 'content:delete', 'content:manage',
      'settings:read', 'settings:write', 'settings:manage',
      'admin:access', 'super-admin:access', 'analytics:view'
    ],
    'admin': [
      'users:read', 'users:write',
      'events:read', 'events:write', 'events:delete',
      'content:read', 'content:write', 'content:delete',
      'admin:access', 'analytics:view'
    ]
  };
  
  return permissions[role] || [];
}

// Gestion des erreurs globales
process.on('unhandledRejection', (error) => {
  console.error('💥 ERREUR NON GÉRÉE:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('💥 EXCEPTION NON CAPTURÉE:', error);
  process.exit(1);
});

// Exécuter le script
createAllAdmins().then(() => {
  console.log('\n🎵 C.A.S.T. LUMEN - Configuration terminée!');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 ERREUR FATALE:', error);
  process.exit(1);
});