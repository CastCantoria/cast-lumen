import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';

// REMPLACE AVEC TA VRAIE CONFIG
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
  
  const executeMigration = async () => {
    console.log('🚀 DÉBUT DE LA MIGRATION FIRESTORE');
    console.log('⚠️  Cette opération modifie la base de données');
    
    try {
      const batch = writeBatch(db);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      console.log(`🔄 Migration de ${usersSnapshot.size} utilisateurs...`);
      
      // Migration Users → Members
      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const newMemberRef = doc(collection(db, 'members'), userDoc.id);
        
        batch.set(newMemberRef, {
          ...userData,
          role: userData.role || 'membre',
          migratedAt: new Date(),
          originalCollection: 'users'
        });
      });
      
      // Création admin par défaut
      const adminRef = doc(collection(db, 'admins'), 'super-admin');
      batch.set(adminRef, {
        email: 'admin@cast-lumen.com',
        role: 'super-admin',
        permissions: ['all'],
        createdAt: new Date(),
        displayName: 'Administrateur Principal'
      });
      
      // Exécution
      await batch.commit();
      console.log('🎉 MIGRATION TERMINÉE AVEC SUCCÈS !');
      console.log(`📊 ${usersSnapshot.size} membres migrés + 1 admin créé`);
      
    } catch (error) {
      console.error('💥 ERREUR MIGRATION:', error);
    }
  };

  executeMigration();

} catch (initError) {
  console.error('❌ Erreur initialisation Firebase:', initError);
}