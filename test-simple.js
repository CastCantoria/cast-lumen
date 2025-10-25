const fs = require('fs');
const admin = require('firebase-admin');

console.log(" Test Firebase...");

async function test() {
  try {
    const serviceAccount = require('../serviceAccountKey.json');
    console.log(" Fichier JSON chargé");
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://cast-84d3f-default-rtdb.firebaseio.com"
    });
    
    console.log(" Firebase initialisé");
    
    const db = admin.firestore();
    const collections = await db.listCollections();
    
    console.log(" Collections trouvées:");
    collections.forEach(col => console.log("   - " + col.id));
    
    console.log(" Succès!");
    
  } catch (error) {
    console.log(" Erreur:", error.message);
  }
}

test();
