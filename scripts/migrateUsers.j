// scripts/firebase-migration.js
import { db } from '../src/firebase/config';
import { collection, getDocs, doc, setDoc, batch } from 'firebase/firestore';

const migrateUsersToMembers = async () => {
  console.log('🔄 Début de la migration Users → Members...');
  
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const migrationBatch = batch(db);
    
    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const newMemberRef = doc(collection(db, 'members'), userDoc.id);
      
      migrationBatch.set(newMemberRef, {
        ...userData,
        role: 'membre',
        migratedAt: new Date(),
        originalCollection: 'users' // Trace de l'origine
      });
    });
    
    await migrationBatch.commit();
    console.log(`✅ ${usersSnapshot.size} utilisateurs migrés vers "members"`);
    
  } catch (error) {
    console.error('❌ Erreur migration:', error);
  }
};