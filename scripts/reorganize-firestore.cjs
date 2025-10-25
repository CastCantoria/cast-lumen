// scripts/firestore-migration.cjs
const admin = require('firebase-admin');

console.log("🔄 Début de la migration Firestore...");

try {
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();
  console.log("✅ Connexion Firestore établie");

  // Fonction pour migrer les données
  async function migrateData() {
    console.log("📦 Migration des utilisateurs...");
    
    // Exemple: Réorganiser la collection users
    const usersSnapshot = await db.collection('users').get();
    
    console.log(`👥 ${usersSnapshot.size} utilisateurs trouvés`);
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      console.log(`- ${userData.email || userData.displayName || userDoc.id}`);
      
      // Ici vous pouvez restructurer les données utilisateur
      // Exemple: normaliser les rôles, dates, etc.
    }
    
    console.log("✅ Migration terminée avec succès!");
  }

  migrateData().catch(console.error);

} catch (error) {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
}