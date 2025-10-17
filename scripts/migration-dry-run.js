import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// REMPLACE AVEC TA VRAIE CONFIG (trouve-la dans ton projet Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCT_8j9KBKgcYr3naOFRp-Kk-s-gr_A1gs",
  authDomain: "cast-84d3f.firebaseapp.com",
  projectId: "cast-84d3f",
  storageBucket: "cast-84d3f.firebasestorage.app",
  messagingSenderId: "160422742820",
  appId: "1:160422742820:web:f60e6c94ba743d1afd41b1",
  measurementId: "G-9BNSYK4TH4"
};

console.log('🔄 Initialisation Firebase...');

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  const dryRunMigration = async () => {
    console.log('🔍 DRY RUN - Simulation de migration');
    
    try {
      console.log('📡 Connexion à Firestore...');
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      console.log(`✅ Connexion réussie !`);
      console.log(`📊 ${usersSnapshot.size} utilisateurs trouvés:`);
      
      if (usersSnapshot.size === 0) {
        console.log('ℹ️  Aucun utilisateur trouvé dans la collection "users"');
      } else {
        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`   📝 ${doc.id}: ${data.email || 'Pas d\'email'} → Rôle: ${data.role || 'membre'}`);
        });
      }
      
      console.log('\n✅ Dry run terminé');
      console.log('💡 Pour exécuter la migration: npm run migration:execute');
      
    } catch (error) {
      console.error('❌ Erreur Firestore:', error);
      console.log('\n🔧 SOLUTIONS:');
      console.log('1. Vérifie les règles Firestore (doivent autoriser read/write)');
      console.log('2. Vérifie la configuration Firebase');
      console.log('3. Vérifie la connexion internet');
    }
  };

  dryRunMigration();

} catch (initError) {
  console.error('❌ Erreur initialisation Firebase:', initError);
  console.log('🔧 Vérifie ta configuration firebaseConfig');
}