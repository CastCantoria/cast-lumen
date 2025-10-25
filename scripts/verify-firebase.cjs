// scripts/verify-firebase.cjs
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

console.log("🔍 Vérification du serviceAccountKey.json...");

try {
  const filePath = path.join(__dirname, '..', 'serviceAccountKey.json');
  
  // Vérifier que le fichier existe
  if (!fs.existsSync(filePath)) {
    throw new Error('Fichier serviceAccountKey.json introuvable');
  }
  
  // Lire et parser le JSON
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const serviceAccount = JSON.parse(fileContent);
  
  console.log("✅ Fichier JSON valide");
  console.log(`📧 Email: ${serviceAccount.client_email}`);
  console.log(`🏢 Projet: ${serviceAccount.project_id}`);
  
  // Initialiser Firebase
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
  });
  
  console.log("✅ Firebase Admin initialisé");
  
  // Tester Firestore
  const db = admin.firestore();
  console.log("🔗 Test de connexion Firestore...");
  
  const collections = await db.listCollections();
  console.log(`📁 ${collections.length} collections trouvées:`);
  collections.forEach(col => console.log(`   - ${col.id}`));
  
  console.log("\n🎉 CONNEXION RÉUSSIE !");
  console.log("📋 Prochaines étapes:");
  console.log("   1. Vérifiez les collections ci-dessus");
  console.log("   2. Lancez la migration avec: node firebase-migration.cjs");
  console.log("   3. Testez l'application");
  
} catch (error) {
  console.error("❌ ERREUR:", error.message);
  
  if (error.message.includes('JSON')) {
    console.log("\n🔧 Le JSON est invalide. Vérifiez:");
    console.log("   - Les guillemets sont bien fermés");
    console.log("   - Pas de virgules en trop");
    console.log("   - Formatage correct");
  } else if (error.message.includes('introuvable')) {
    console.log("\n🔧 Créez le fichier serviceAccountKey.json à la racine");
  }
  
  process.exit(1);
}