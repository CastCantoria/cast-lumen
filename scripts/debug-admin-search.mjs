import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Ì¥ç DIAGNOSTIC RECHERCHE ADMIN");

async function main() {
  try {
    const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    const db = admin.firestore();

    const targetEmail = 'ad-castcantoria@outlook.fr';

    console.log(`\nÌæØ RECHERCHE POUR: ${targetEmail}`);

    // 1. Recherche dans admins
    console.log("\n1. Ì≥Å RECHERCHE DANS 'admins':");
    const adminQuery = await db.collection('admins')
      .where('email', '==', targetEmail)
      .get();

    console.log(`   Ì≥ä R√©sultats: ${adminQuery.size} document(s)`);
    
    if (!adminQuery.empty) {
      adminQuery.forEach(doc => {
        const data = doc.data();
        console.log("   ‚úÖ DOCUMENT TROUV√â:");
        console.log("      ID:", doc.id);
        console.log("      Email:", data.email);
        console.log("      R√¥le:", data.role);
        console.log("      DisplayName:", data.displayName);
        console.log("      Donn√©es compl√®tes:", JSON.stringify(data, null, 2));
      });
    } else {
      console.log("   ‚ùå AUCUN DOCUMENT TROUV√â dans 'admins'");
    }

    // 2. V√©rifier toutes les collections
    console.log("\n2. Ì≥ä TOUTES LES COLLECTIONS:");
    const collections = await db.listCollections();
    
    console.log("   Collections disponibles:");
    collections.forEach(col => {
      console.log(`   - ${col.id}`);
    });

    // 3. V√©rifier les donn√©es dans chaque collection pertinente
    console.log("\n3. Ì¥ç CONTENU DES COLLECTIONS:");
    
    for (const collectionName of ['admins', 'members', 'users']) {
      try {
        const snapshot = await db.collection(collectionName).limit(3).get();
        console.log(`\n   Ì≥Å ${collectionName}: ${snapshot.size} document(s)`);
        
        snapshot.forEach(doc => {
          const data = doc.data();
          console.log(`      Ì≥Ñ ${doc.id}: ${data.email} (${data.role || 'no role'})`);
        });
      } catch (error) {
        console.log(`   ‚ùå Erreur ${collectionName}: ${error.message}`);
      }
    }

    console.log("\nÌæØ DIAGNOSTIC:");
    if (adminQuery.empty) {
      console.log("‚ùå PROBLEME: L'email n'est pas trouv√© dans 'admins'");
      console.log("Ì≤° SOLUTION: V√©rifiez que:");
      console.log("   - L'email est exact: ad-castcantoria@outlook.fr");
      console.log("   - Le document existe dans Firebase Console");
      console.log("   - Il n'y a pas de faute de frappe");
    } else {
      console.log("‚úÖ L'admin existe mais n'est pas trouv√© par l'application");
      console.log("Ì≤° CAUSE POSSIBLE: R√®gles de s√©curit√© Firestore");
    }

  } catch (error) {
    console.error("‚ùå Erreur:", error.message);
  }
}

main();
