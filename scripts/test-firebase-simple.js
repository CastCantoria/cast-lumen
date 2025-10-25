const admin = require('firebase-admin');

console.log("Ì∑™ Test Firebase simple...");

async function main() {
  try {
    // Charger le service account
    const serviceAccount = require('../serviceAccountKey.json');
    console.log("‚úÖ Service account charg√©");
    
    // Initialiser Firebase
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://cast-84d3f-default-rtdb.firebaseio.com"
    });
    
    console.log("‚úÖ Firebase initialis√©");
    
    // Tester Firestore
    const db = admin.firestore();
    console.log("Ì¥ó Test connexion Firestore...");
    
    const collections = await db.listCollections();
    console.log(`Ì≥Å ${collections.length} collections trouv√©es:`);
    
    collections.forEach(collection => {
      console.log(`   - ${collection.id}`);
    });
    
    console.log("Ìæâ SUCC√àS TOTAL! Firebase fonctionne parfaitement.");
    
  } catch (error) {
    console.error("‚ùå ERREUR:", error.message);
    
    if (error.message.includes('JSON')) {
      console.log("Ì¥ß Probl√®me avec le fichier serviceAccountKey.json");
    } else if (error.message.includes('permission')) {
      console.log("Ì¥ß Probl√®me de permissions Firebase");
    } else {
      console.log("Ì¥ß Erreur inconnue, v√©rifiez la configuration");
    }
  }
}

main();
