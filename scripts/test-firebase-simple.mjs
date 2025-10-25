import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Ì∑™ Test Firebase avec ES modules...");

async function main() {
  try {
    // Charger le service account
    const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
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
      console.log("Ì≤° V√©rifiez que le fichier existe et est valide");
    } else if (error.message.includes('permission')) {
      console.log("Ì¥ß Probl√®me de permissions Firebase");
    } else if (error.message.includes('no such file')) {
      console.log("Ì¥ß Fichier serviceAccountKey.json introuvable");
      console.log("Ì≤° Cr√©ez-le √† la racine du projet");
    } else {
      console.log("Ì¥ß Erreur inconnue:", error);
    }
  }
}

main();
