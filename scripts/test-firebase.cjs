// scripts/test-firebase.cjs
const admin = require('firebase-admin');

console.log("🧪 Test de connexion Firebase...");

try {
  const serviceAccount = require('../serviceAccountKey.json');
  console.log("✅ Fichier serviceAccount chargé");
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cast-84d3f-default-rtdb.firebaseio.com"
  });

  const db = admin.firestore();
  console.log("✅ Firebase Admin initialisé");
  
  // Test simple - lister les collections
  db.listCollections().then(collections => {
    console.log(`📁 Collections trouvées: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.id}`));
    console.log("🎉 Connexion Firebase réussie!");
    process.exit(0);
  }).catch(error => {
    console.error("❌ Erreur Firestore:", error.message);
    process.exit(1);
  });

} catch (error) {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
}