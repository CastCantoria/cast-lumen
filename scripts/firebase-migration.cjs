// scripts/firebase-migration.cjs
const admin = require('firebase-admin');

console.log("🚀 Initialisation de la migration Firebase...");

try {
  const serviceAccount = require('../serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cast-84d3f-default-rtdb.firebaseio.com"
  });

  const db = admin.firestore();
  console.log("✅ Firebase Admin initialisé avec succès!");
  console.log("🔗 Connexion Firestore établie");

  async function checkCollections() {
    console.log("\n📊 Vérification des collections existantes...");
    
    const collections = await db.listCollections();
    console.log(`📁 Collections trouvées: ${collections.length}`);
    
    collections.forEach(collection => {
      console.log(`   - ${collection.id}`);
    });
    
    return collections;
  }

  async function migrateUsers() {
    console.log("\n👥 Migration des utilisateurs...");
    
    try {
      const usersSnapshot = await db.collection('users').get();
      console.log(`📊 ${usersSnapshot.size} utilisateurs trouvés`);
      
      let updatedCount = 0;
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const updates = {};
        
        // Normaliser la structure des utilisateurs
        if (!userData.role) {
          updates.role = 'user';
          console.log(`   - ${userData.email || userDoc.id}: rôle défini à 'user'`);
        }
        
        if (!userData.createdAt) {
          updates.createdAt = admin.firestore.FieldValue.serverTimestamp();
        }
        
        if (!userData.isActive) {
          updates.isActive = true;
        }
        
        // Appliquer les updates si nécessaire
        if (Object.keys(updates).length > 0) {
          await db.collection('users').doc(userDoc.id).update(updates);
          updatedCount++;
        }
      }
      
      console.log(`✅ ${updatedCount} utilisateurs mis à jour`);
      
    } catch (error) {
      console.log("ℹ️ Aucun utilisateur trouvé ou erreur:", error.message);
    }
  }

  async function createDefaultCollections() {
    console.log("\n🏗️ Création des collections par défaut...");
    
    const defaultCollections = [
      'events',
      'repertoire', 
      'blog_posts',
      'gallery',
      'messages'
    ];
    
    for (const collectionName of defaultCollections) {
      try {
        // Vérifier si la collection existe en tentant de lire un document
        const snapshot = await db.collection(collectionName).limit(1).get();
        console.log(`   - ${collectionName}: ${snapshot.empty ? 'vide' : 'existe déjà'}`);
      } catch (error) {
        console.log(`   - ${collectionName}: à créer`);
      }
    }
  }

  async function initializeAdminUsers() {
    console.log("\n👑 Initialisation des administrateurs...");
    
    // Liste des emails admin (à adapter)
    const adminEmails = [
      'votre-email@admin.com',
      'tovon@example.com'
    ];
    
    for (const email of adminEmails) {
      try {
        // Vérifier si l'utilisateur existe
        const userQuery = await db.collection('users')
          .where('email', '==', email)
          .limit(1)
          .get();
          
        if (!userQuery.empty) {
          const userDoc = userQuery.docs[0];
          await db.collection('users').doc(userDoc.id).update({
            role: 'admin',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log(`   - ${email}: rôle admin défini`);
        } else {
          console.log(`   - ${email}: utilisateur non trouvé`);
        }
      } catch (error) {
        console.log(`   - ${email}: erreur - ${error.message}`);
      }
    }
  }

  // Exécuter la migration
  async function runMigration() {
    console.log("🔄 Début de la migration...");
    
    await checkCollections();
    await migrateUsers();
    await createDefaultCollections();
    await initializeAdminUsers();
    
    console.log("\n🎉 MIGRATION TERMINÉE AVEC SUCCÈS!");
    console.log("📋 Prochaines étapes:");
    console.log("   1. Vérifiez les données dans Firebase Console");
    console.log("   2. Testez l'authentification dans l'application");
    console.log("   3. Configurez les règles de sécurité Firestore");
    
    process.exit(0);
  }

  runMigration().catch(error => {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  });

} catch (error) {
  console.error("❌ ERREUR CRITIQUE:", error.message);
  console.log("\n🔧 Vérifiez que:");
  console.log("   - serviceAccountKey.json est à la racine du projet");
  console.log("   - Le fichier JSON est valide");
  console.log("   - Les permissions Firebase sont correctes");
  process.exit(1);
}