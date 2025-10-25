import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("ÔøΩÔøΩ D√âBOGAGE AUTHENTIFICATION SUPER-ADMIN");

async function main() {
  try {
    const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    const db = admin.firestore();

    console.log("\nÌ≥ß V√âRIFICATION DU SUPER-ADMIN:");
    
    // Chercher le super-admin
    const superAdminQuery = await db.collection('admins')
      .where('email', '==', 'ad-castcantoria@outlook.fr')
      .limit(1)
      .get();

    if (superAdminQuery.empty) {
      console.log("‚ùå SUPER-ADMIN NON TROUV√â dans 'admins'");
      return;
    }

    const superAdmin = superAdminQuery.docs[0].data();
    console.log("‚úÖ SUPER-ADMIN TROUV√â:");
    console.log("   Ì≥ß Email:", superAdmin.email);
    console.log("   Ì±ë R√¥le:", superAdmin.role);
    console.log("   Ìæ§ Voix:", superAdmin.voicePart);
    console.log("   Ì±• Membre choriste:", superAdmin.isAlsoChoirMember);
    console.log("   Ì¥ê Permissions:", superAdmin.permissions);
    console.log("   Ì≥Ö Cr√©√© le:", superAdmin.createdAt?.toDate?.());

    console.log("\nÌ¥ç V√âRIFICATION DANS 'members':");
    
    const memberQuery = await db.collection('members')
      .where('email', '==', 'ad-castcantoria@outlook.fr')
      .limit(1)
      .get();

    if (memberQuery.empty) {
      console.log("‚ùå NON TROUV√â dans 'members'");
    } else {
      const member = memberQuery.docs[0].data();
      console.log("‚úÖ TROUV√â dans 'members':");
      console.log("   Ì±ë R√¥le membre:", member.role);
      console.log("   Ì¥ß Est admin:", member.isAlsoAdmin);
      console.log("   ÌæØ R√¥le admin:", member.adminRole);
    }

    console.log("\nÌæØ DIAGNOSTIC:");
    console.log("Le probl√®me vient probablement de:");
    console.log("1. La logique de d√©tection de r√¥le dans AuthContext");
    console.log("2. Le mapping entre Firebase Auth et Firestore");
    console.log("3. Les permissions qui ne sont pas correctement charg√©es");

  } catch (error) {
    console.error("‚ùå Erreur:", error.message);
  }
}

main();
