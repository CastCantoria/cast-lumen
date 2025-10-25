// scripts/verify-firebase.cjs
const fs = require('fs');
const admin = require('firebase-admin');

console.log("🔍 Vérification du fichier serviceAccount...");

try {
  // Lecture directe du fichier
  const fileContent = fs.readFileSync('../serviceAccountKey.json', 'utf8');
  console.log("✅ Fichier lu avec succès");
  
  // Validation JSON
  const serviceAccount = JSON.parse(fileContent);
  console.log("✅ JSON valide");
  console.log(`📧 Client Email: ${serviceAccount.client_email}`);
  console.log(`🏢 Project ID: ${serviceAccount.project_id}`);
  
  // Test Firebase
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cast-84d3f-default-rtdb.firebaseio.com"
  });
  
  console.log("✅ Firebase initialisé");
  
  const db = admin.firestore();
  db.listCollections().then(collections => {
    console.log(`📁 ${collections.length} collections trouvées`);
    console.log("🎉 Tout fonctionne parfaitement!");
    process.exit(0);
  });
  
} catch (error) {
  console.error("❌ Erreur:", error.message);
  
  if (error.message.includes('JSON')) {
    console.log("\n🔧 Le fichier JSON est invalide.");
    console.log("📝 Créez-le manuellement avec VS Code/Notepad++");
  } else if (error.message.includes('no such file')) {
    console.log("\n🔧 Fichier introuvable.");
    console.log("📁 Créez serviceAccountKey.json à la racine du projet");
  }
  
  process.exit(1);
}