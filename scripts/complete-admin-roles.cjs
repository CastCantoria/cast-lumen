// scripts/complete-admin-roles.js
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

// ⚠️ REMPLACEZ LES UIDs PAR LES VRAIS UIDs DE FIREBASE CONSOLE
const adminsToUpdate = [
  {
    uid: 'UID_AD_CASTCANTORIA', // ad-castcantoria@outlook.fr
    email: 'ad-castcantoria@outlook.fr',
    displayName: 'Super Administrateur CAST',
    role: 'super-admin',
    specialite: 'Supervision générale de la plateforme',
    mission: 'Supervision générale de la plateforme'
  },
  {
    uid: 'UeEzWv2L3CQTeuFsVpr7HEwzXNz1', // livaramanalinarivo16@gmail.com
    email: 'livaramanalinarivo16@gmail.com',
    displayName: 'Liva Ramanalinarivo',
    role: 'admin',
    specialite: 'Président fondateur',
    mission: 'Direction et stratégie globale'
  },
  {
    uid: 'VIlrGTnPDzUTIzUsKpVTxP0UiHJ3', // eric.rasamimanana@gmail.com
    email: 'eric.rasamimanana@gmail.com',
    displayName: 'Eric Rasamimanana',
    role: 'admin',
    specialite: 'Programmation Artistique',
    mission: 'Gestion du répertoire et programmation musicale'
  },
  {
    uid: '8gduwfvu0tfwu6cF228SeII6oEn2', // tena.solution@gmail.com
    email: 'tena.solution@gmail.com',
    displayName: 'Sandiniaina Alain RAMAROSON',
    role: 'admin',
    specialite: 'Communication & Contenu',
    mission: 'Gestion des communications et contenu digital'
  },
  {
    uid: 'lr6PX9DhbBZUaM7niYQ1jeD7w3h2', // julesrandriamanantsoa@gmail.com
    email: 'julesrandriamanantsoa@gmail.com',
    displayName: 'Jules Randriamanantsoa',
    role: 'admin',
    specialite: 'Gestion des Membres',
    mission: 'Coordination des membres et recrutement'
  },
  {
    uid: 'LUdsuxau5OXmzwwtytdtgcg1lAl2', // positifaid@live.fr
    email: 'positifaid@live.fr',
    displayName: 'Tovoniaina Rahendrison',
    role: 'admin',
    specialite: 'Support Technique',
    mission: 'Support technique et maintenance de la plateforme'
  }
];

async function completeAdminRoles() {
  console.log('🎵 C.A.S.T. LUMEN - Configuration des administrateurs\n');
  console.log('='.repeat(60));
  
  let updatedCount = 0;
  let errorCount = 0;

  for (const admin of adminsToUpdate) {
    try {
      console.log(`\n📧 Traitement: ${admin.email}`);
      console.log(`👤 Nom: ${admin.displayName}`);
      console.log(`👑 Rôle: ${admin.role}`);
      console.log(`🎯 Spécialité: ${admin.specialite}`);
      console.log(`📋 Mission: ${admin.mission}`);
      
      await setDoc(doc(db, 'users', admin.uid), {
        uid: admin.uid,
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role,
        specialite: admin.specialite,
        mission: admin.mission,
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
        },
        contact: {
          email: admin.email,
          phone: '',
          address: ''
        }
      }, { merge: true });
      
      console.log(`✅ CONFIGURÉ AVEC SUCCÈS!`);
      console.log(`   📧 ${admin.email}`);
      console.log(`   👑 ${admin.role}`);
      console.log(`   🎯 ${admin.specialite}`);
      
      updatedCount++;
      
    } catch (error) {
      console.log(`❌ ERREUR: ${error.message}`);
      errorCount++;
    }
    
    console.log('─'.repeat(60));
  }

  // Résumé détaillé
  console.log('\n🎊 RÉSUMÉ DE LA CONFIGURATION');
  console.log('='.repeat(40));
  console.log(`✅ ${updatedCount} administrateurs configurés`);
  console.log(`❌ ${errorCount} erreurs`);
  
  console.log('\n📋 ÉQUIPE ADMINISTRATIVE COMPLÈTE');
  console.log('='.repeat(40));
  adminsToUpdate.forEach(admin => {
    const emoji = admin.role === 'super-admin' ? '👑' : '⚙️';
    console.log(`${emoji} ${admin.displayName}`);
    console.log(`   📧 ${admin.email}`);
    console.log(`   🎯 ${admin.specialite}`);
    console.log(`   📋 ${admin.mission}`);
    console.log('   ──');
  });
  
  console.log('\n🔗 INFORMATIONS DE CONNEXION');
  console.log('='.repeat(40));
  console.log('🌐 Plateforme: https://cast-lumen.vercel.app');
  console.log('🔐 Page de connexion: /login');
  console.log('🔑 Mot de passe temporaire: CastCantoria2024!');
  console.log('📝 Changement de mot de passe recommandé à la première connexion');
  
  console.log('\n🎯 FONCTIONNALITÉS ADMINISTRATIVES');
  console.log('='.repeat(40));
  console.log('👑 Super-Admin: Accès complet à toutes les fonctionnalités');
  console.log('⚙️ Admins: Gestion des membres, événements et contenu');
  console.log('📊 Tableau de bord: /dashboard');
  console.log('👥 Gestion membres: /admin/members');
  console.log('🎵 Gestion événements: /admin/events');
}

function getPermissionsByRole(role) {
  const permissions = {
    'super-admin': [
      // Gestion utilisateurs
      'users:read', 'users:write', 'users:delete', 'users:manage',
      // Événements
      'events:read', 'events:write', 'events:delete', 'events:manage',
      // Contenu
      'content:read', 'content:write', 'content:delete', 'content:manage',
      // Paramètres
      'settings:read', 'settings:write', 'settings:manage',
      // Accès administrateur
      'admin:access', 'super-admin:access', 'analytics:view',
      // Fonctionnalités avancées
      'backup:manage', 'export:data', 'import:data'
    ],
    'admin': [
      // Gestion utilisateurs limitée
      'users:read', 'users:write',
      // Événements complets
      'events:read', 'events:write', 'events:delete',
      // Contenu complet
      'content:read', 'content:write', 'content:delete',
      // Accès administrateur de base
      'admin:access', 'analytics:view',
      // Fonctionnalités selon spécialité
      'members:manage', 'communications:manage', 'technical:support'
    ]
  };
  
  return permissions[role] || [];
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error('💥 Erreur non gérée:', error);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Exception non capturée:', error);
});

// Exécution du script
completeAdminRoles().then(() => {
  console.log('\n🎵 C.A.S.T. LUMEN - Configuration administrative terminée !');
  console.log('✨ L\'équipe est maintenant opérationnelle sur la plateforme.');
}).catch(error => {
  console.error('\n💥 Erreur lors de la configuration:', error);
});