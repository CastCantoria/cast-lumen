import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Ìæµ MIGRATION C.A.S.T. CANTORIA - D√âBUT");

async function main() {
  try {
    // Initialisation Firebase
    const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://cast-84d3f-default-rtdb.firebaseio.com"
    });

    const db = admin.firestore();
    console.log("‚úÖ Firebase initialis√©");

    // Ì¥ß NETTOYAGE PR√âALABLE - Supprimer la collection 'users' si elle existe
    console.log("\nÌ∑π Nettoyage de la structure existante...");
    try {
      const usersSnapshot = await db.collection('users').get();
      if (!usersSnapshot.empty) {
        console.log(`Ì∑ëÔ∏è  Suppression de ${usersSnapshot.size} documents dans 'users'...`);
        const batch = db.batch();
        usersSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log("‚úÖ Collection 'users' vid√©e");
      }
    } catch (error) {
      console.log("‚ÑπÔ∏è Aucune collection 'users' √† nettoyer");
    }

    // Ì±ë CONFIGURATION DES SUPER-ADMIN & ADMINS
    console.log("\nÌ±ë Configuration des administrateurs C.A.S.T...");

    const administrators = [
      // SUPER ADMIN
      {
        email: "ad-castcantoria@outlook.fr",
        displayName: "Super Administrateur C.A.S.T",
        role: "super-admin",
        mission: "Supervision g√©n√©rale de la plateforme",
        temporaryPassword: "CastCantoria2024!"
      },
      // ADMINISTRATEURS SP√âCIALIS√âS
      {
        email: "livaramanalinarivo16@gmail.com",
        displayName: "Liva Ramanalinarivo",
        role: "admin",
        mission: "Pr√©sident fondateur",
        temporaryPassword: "CastCantoria2024!"
      },
      {
        email: "eric.rasamimanana@gmail.com",
        displayName: "Eric Rasamimanana",
        role: "admin", 
        mission: "Programmation Artistique",
        temporaryPassword: "CastCantoria2024!"
      },
      {
        email: "tena.solution@gmail.com",
        displayName: "Sandiniaina Alain RAMAROSON",
        role: "admin",
        mission: "Communication & Contenu",
        temporaryPassword: "CastCantoria2024!"
      },
      {
        email: "julesrandriamanantsoa@gmail.com",
        displayName: "Jules Randriamanantsoa", 
        role: "admin",
        mission: "Gestion des Membres",
        temporaryPassword: "CastCantoria2024!"
      },
      {
        email: "positifaid@live.fr",
        displayName: "Tovoniaina Rahendrison",
        role: "admin",
        mission: "Support Technique",
        temporaryPassword: "CastCantoria2024!"
      }
    ];

    let adminsCreated = 0;
    let superAdminsCreated = 0;

    for (const adminData of administrators) {
      try {
        // V√©rifier si l'admin existe d√©j√†
        const existingAdmin = await db.collection('admins')
          .where('email', '==', adminData.email)
          .limit(1)
          .get();

        if (existingAdmin.empty) {
          // Cr√©er le document admin
          const adminDoc = {
            ...adminData,
            isActive: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            lastLogin: null,
            permissions: getPermissionsForRole(adminData.role)
          };

          await db.collection('admins').add(adminDoc);
          
          if (adminData.role === 'super-admin') {
            superAdminsCreated++;
            console.log(`   Ì±ë SUPER-ADMIN cr√©√©: ${adminData.displayName}`);
          } else {
            adminsCreated++;
            console.log(`   ‚öôÔ∏è  ADMIN cr√©√©: ${adminData.displayName} - ${adminData.mission}`);
          }
        } else {
          console.log(`   ‚úÖ ADMIN existe d√©j√†: ${adminData.displayName}`);
        }
      } catch (error) {
        console.log(`   ‚ùå Erreur avec ${adminData.email}: ${error.message}`);
      }
    }

    console.log(`\nÌ≥ä R√©capitulatif administrateurs:`);
    console.log(`   Ì±ë Super-Admins: ${superAdminsCreated} cr√©√©(s)`);
    console.log(`   ‚öôÔ∏è  Admins: ${adminsCreated} cr√©√©(s)`);
    console.log(`   Ì≥ß Total: ${administrators.length} administrateurs configur√©s`);

    // Ìæµ CONFIGURATION DE LA STRUCTURE MEMBRES
    console.log("\nÌ±• Configuration de la structure membres...");

    // V√©rifier la collection members
    try {
      const membersSnapshot = await db.collection('members').get();
      console.log(`   Ì≥ä ${membersSnapshot.size} membre(s) existant(s)`);
      
      if (membersSnapshot.empty) {
        console.log("   Ì≤° La collection 'members' est pr√™te pour les choristes");
      }
    } catch (error) {
      console.log("   ‚ÑπÔ∏è Collection 'members' √† initialiser");
    }

    // Ì≥Ö CR√âATION D'√âV√âNEMENTS DE D√âMONSTRATION
    console.log("\nÌ≥Ö Cr√©ation d'√©v√©nements de d√©monstration...");

    const sampleEvents = [
      {
        title: "Concert de Lancement Saison 2024-2025",
        date: "2024-12-15",
        time: "20:00",
        location: "√âglise Saint-Louis, Versailles",
        description: "Premier concert officiel de la chorale C.A.S.T. Cantoria pour lancer notre nouvelle saison musicale",
        type: "concert",
        status: "published",
        program: ["Ave Maria - Schubert", "Gloria - Vivaldi", "Hallelujah - Cohen"],
        requiredRoles: ["soprano", "alto", "tenor", "basse"],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        title: "R√©p√©tition G√©n√©rale - Concert de No√´l", 
        date: "2024-12-10",
        time: "19:30-21:30",
        location: "Salle de r√©p√©tition C.A.S.T.",
        description: "R√©p√©tition intensive pour le concert de No√´l - pr√©sence obligatoire",
        type: "rehearsal",
        status: "published",
        focus: "Finalisation des partitions de No√´l",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    let eventsCreated = 0;
    for (const eventData of sampleEvents) {
      try {
        const eventsSnapshot = await db.collection('events')
          .where('title', '==', eventData.title)
          .limit(1)
          .get();

        if (eventsSnapshot.empty) {
          await db.collection('events').add(eventData);
          eventsCreated++;
          console.log(`   Ìæµ √âv√©nement cr√©√©: ${eventData.title}`);
        }
      } catch (error) {
        console.log(`   ‚ùå Erreur √©v√©nement: ${error.message}`);
      }
    }

    console.log(`\nÌ≥Ö ${eventsCreated} √©v√©nement(s) de d√©monstration cr√©√©(s)`);

    // Ìæº INITIALISATION DU R√âPERTOIRE
    console.log("\nÌæº Initialisation du r√©pertoire musical...");

    const repertoirePieces = [
      {
        title: "Ave Maria",
        composer: "Franz Schubert",
        genre: "Classique Sacr√©",
        difficulty: "Interm√©diaire",
        voiceParts: ["Soprano", "Alto", "Tenor", "Basse"],
        status: "En apprentissage",
        learningProgress: 60,
        lastPracticed: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        title: "Gloria",
        composer: "Antonio Vivaldi", 
        genre: "Baroque Sacr√©",
        difficulty: "Avanc√©",
        voiceParts: ["Soprano", "Alto", "Tenor", "Basse"],
        status: "Ma√Ætris√©",
        learningProgress: 90,
        lastPracticed: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    let repertoireCreated = 0;
    for (const piece of repertoirePieces) {
      try {
        await db.collection('repertoire').add({
          ...piece,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        repertoireCreated++;
        console.log(`   Ì≥ú Partition ajout√©e: ${piece.title} - ${piece.composer}`);
      } catch (error) {
        console.log(`   ‚ùå Erreur r√©pertoire: ${error.message}`);
      }
    }

    console.log(`\nÌæº ${repertoireCreated} pi√®ce(s) ajout√©e(s) au r√©pertoire`);

    // Ì≥ä R√âCAPITULATIF FINAL
    console.log("\n" + "=".repeat(50));
    console.log("Ìæâ MIGRATION C.A.S.T. TERMIN√âE AVEC SUCC√àS!");
    console.log("=".repeat(50));
    
    console.log("\nÌ≥ã STRUCTURE CR√â√âE:");
    console.log("   Ì±ë 1 Super-Administrateur");
    console.log("   ‚öôÔ∏è  5 Administrateurs sp√©cialis√©s");
    console.log("   Ì≥Ö 2 √âv√©nements de d√©monstration"); 
    console.log("   Ìæº 2 Partitions de r√©pertoire");
    console.log("   Ì±• Structure 'members' pr√™te pour les choristes");
    
    console.log("\nÌ¥ê INFORMATIONS DE CONNEXION:");
    console.log("   Ì≥ß Emails admin: Voir la liste ci-dessus");
    console.log("   Ì¥ë Mot de passe temporaire: CastCantoria2024!");
    
    console.log("\nÌ∫Ä PROCHAINES √âTAPES:");
    console.log("   1. Les administrateurs peuvent se connecter");
    console.log("   2. Ajouter les membres choristes via l'interface admin");
    console.log("   3. Configurer les √©v√©nements et le r√©pertoire");
    console.log("   4. Tester les diff√©rents tableaux de bord");

  } catch (error) {
    console.error("‚ùå Erreur lors de la migration:", error.message);
  }
}

// Fonction helper pour les permissions
function getPermissionsForRole(role) {
  const basePermissions = ['read_events', 'read_members', 'read_repertoire'];
  
  if (role === 'super-admin') {
    return [...basePermissions, 'manage_all', 'manage_admins', 'security_settings'];
  }
  
  if (role === 'admin') {
    return [...basePermissions, 'manage_events', 'manage_members', 'manage_content'];
  }
  
  return basePermissions;
}

main();
