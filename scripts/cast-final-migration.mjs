import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Ìæµ MIGRATION C.A.S.T. - STRUCTURE FINALE");

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

    // 1. ANALYSE DES DONN√âES EXISTANTES
    console.log("\nÌ¥ç Analyse des collections existantes...");

    const collections = await db.listCollections();
    console.log(`Ì≥Å Collections trouv√©es: ${collections.map(col => col.id).join(', ')}`);

    // 2. CR√âATION DES ADMINISTRATEURS C.A.S.T. (EN TANT QUE MEMBRES)
    console.log("\nÌ±ë Cr√©ation des administrateurs C.A.S.T. (en tant que membres)...");

    const castTeam = [
      // SUPER ADMIN - AUSSI MEMBRE
      {
        email: "ad-castcantoria@outlook.fr",
        displayName: "Super Administrateur C.A.S.T",
        firstName: "Super",
        lastName: "Administrateur",
        role: "super-admin",
        voicePart: "directeur", // Ou la voix appropri√©e
        mission: "Supervision g√©n√©rale de la plateforme",
        temporaryPassword: "CastCantoria2024!",
        isAlsoMember: true
      },
      // ADMINISTRATEURS SP√âCIALIS√âS - AUSSI MEMBRES
      {
        email: "livaramanalinarivo16@gmail.com",
        displayName: "Liva Ramanalinarivo",
        firstName: "Liva",
        lastName: "Ramanalinarivo", 
        role: "admin",
        voicePart: "soprano", // √Ä adapter selon la voix r√©elle
        mission: "Pr√©sident fondateur",
        temporaryPassword: "CastCantoria2024!",
        isAlsoMember: true
      },
      {
        email: "eric.rasamimanana@gmail.com",
        displayName: "Eric Rasamimanana",
        firstName: "Eric",
        lastName: "Rasamimanana",
        role: "admin",
        voicePart: "t√©nor", // √Ä adapter
        mission: "Programmation Artistique",
        temporaryPassword: "CastCantoria2024!",
        isAlsoMember: true
      },
      {
        email: "tena.solution@gmail.com", 
        displayName: "Sandiniaina Alain RAMAROSON",
        firstName: "Sandiniaina Alain",
        lastName: "RAMAROSON",
        role: "admin",
        voicePart: "basse", // √Ä adapter
        mission: "Communication & Contenu",
        temporaryPassword: "CastCantoria2024!",
        isAlsoMember: true
      },
      {
        email: "julesrandriamanantsoa@gmail.com",
        displayName: "Jules Randriamanantsoa",
        firstName: "Jules", 
        lastName: "Randriamanantsoa",
        role: "admin",
        voicePart: "alto", // √Ä adapter
        mission: "Gestion des Membres",
        temporaryPassword: "CastCantoria2024!",
        isAlsoMember: true
      },
      {
        email: "positifaid@live.fr",
        displayName: "Tovoniaina Rahendrison", 
        firstName: "Tovoniaina",
        lastName: "Rahendrison",
        role: "admin",
        voicePart: "t√©nor", // √Ä adapter
        mission: "Support Technique",
        temporaryPassword: "CastCantoria2024!",
        isAlsoMember: true
      }
    ];

    let adminsCreated = 0;
    let membersCreated = 0;

    for (const person of castTeam) {
      try {
        // V√©rifier si la personne existe d√©j√† comme admin
        const existingAdmin = await db.collection('admins')
          .where('email', '==', person.email)
          .limit(1)
          .get();

        // V√©rifier si la personne existe d√©j√† comme membre
        const existingMember = await db.collection('members')
          .where('email', '==', person.email)
          .limit(1)
          .get();

        // CR√âER/METTRE √Ä JOUR L'ADMIN
        if (existingAdmin.empty) {
          const adminData = {
            email: person.email,
            displayName: person.displayName,
            role: person.role,
            mission: person.mission,
            isActive: true,
            temporaryPassword: person.temporaryPassword,
            permissions: getPermissionsForRole(person.role),
            isAlsoChoirMember: person.isAlsoMember,
            ...(person.voicePart && { voicePart: person.voicePart }),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          };

          await db.collection('admins').add(adminData);
          console.log(`   Ì±ë ADMIN cr√©√©: ${person.displayName}`);
          adminsCreated++;
        } else {
          // Mettre √† jour l'admin existant pour indiquer qu'il est aussi membre
          const adminDoc = existingAdmin.docs[0];
          await adminDoc.ref.update({
            isAlsoChoirMember: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            ...(person.voicePart && { voicePart: person.voicePart })
          });
          console.log(`   ‚úÖ ADMIN mis √† jour: ${person.displayName} (marqu√© comme membre)`);
        }

        // CR√âER/METTRE √Ä JOUR LE MEMBRE
        if (existingMember.empty) {
          const memberData = {
            email: person.email,
            displayName: person.displayName,
            firstName: person.firstName,
            lastName: person.lastName,
            role: 'membre',
            voicePart: person.voicePart,
            isActive: true,
            isAlsoAdmin: true,
            adminRole: person.role,
            joinDate: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          };

          await db.collection('members').add(memberData);
          console.log(`   Ì±• MEMBRE cr√©√©: ${person.displayName} (${person.voicePart})`);
          membersCreated++;
        } else {
          console.log(`   ‚è≠Ô∏è  MEMBRE existe d√©j√†: ${person.displayName}`);
        }

      } catch (error) {
        console.log(`   ‚ùå ERREUR avec ${person.email}: ${error.message}`);
      }
    }

    // 3. MIGRATION DES AUTRES USERS VERS MEMBERS (NON-ADMINS)
    console.log("\nÌ¥Ñ Migration des autres utilisateurs vers members...");

    let regularUsersMigrated = 0;
    
    try {
      const usersSnapshot = await db.collection('users').get();
      const existingUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`   Ì≥ä ${existingUsers.length} utilisateur(s) √† traiter`);

      for (const user of existingUsers) {
        try {
          // V√©rifier si l'utilisateur fait partie de l'√©quipe C.A.S.T.
          const isCastTeam = castTeam.some(person => person.email === user.email);
          
          if (isCastTeam) {
            console.log(`   ‚è≠Ô∏è  SKIP (d√©j√† trait√©): ${user.email}`);
            continue;
          }

          // V√©rifier si le membre existe d√©j√†
          const existingMember = await db.collection('members')
            .where('email', '==', user.email)
            .limit(1)
            .get();

          if (existingMember.empty) {
            const memberData = {
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
              role: 'membre',
              isActive: user.isActive !== undefined ? user.isActive : true,
              isAlsoAdmin: false,
              migratedFromUsers: true,
              ...(user.firstName && { firstName: user.firstName }),
              ...(user.lastName && { lastName: user.lastName }),
              ...(user.phone && { phone: user.phone }),
              ...(user.voicePart && { voicePart: user.voicePart }),
              ...(user.joinDate && { joinDate: user.joinDate }),
              createdAt: user.createdAt || admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('members').add(memberData);
            regularUsersMigrated++;
            console.log(`   ‚úÖ MEMBRE migr√©: ${user.email}`);
          } else {
            console.log(`   ‚è≠Ô∏è  MEMBRE existe d√©j√†: ${user.email}`);
          }

        } catch (error) {
          console.log(`   ‚ùå ERREUR migration: ${user.email} - ${error.message}`);
        }
      }
    } catch (error) {
      console.log("   ‚ÑπÔ∏è Aucun utilisateur √† migrer");
    }

    // 4. CR√âATION DE DONN√âES DE D√âMONSTRATION
    console.log("\nÌ≥Ö Cr√©ation des donn√©es de d√©monstration...");

    // √âv√©nements
    try {
      const eventsSnapshot = await db.collection('events').get();
      if (eventsSnapshot.empty) {
        const sampleEvent = {
          title: "Concert de Lancement C.A.S.T. Cantoria",
          date: "2024-12-15",
          time: "20:00",
          location: "√âglise Saint-Louis, Versailles",
          description: "Premier concert officiel de la chorale C.A.S.T. Cantoria",
          type: "concert",
          status: "published",
          program: ["Ave Maria - Schubert", "Gloria - Vivaldi", "Hallelujah - Cohen"],
          requiredRoles: ["soprano", "alto", "tenor", "basse"],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('events').add(sampleEvent);
        console.log("   Ìæµ √âv√©nement de d√©monstration cr√©√©");
      }
    } catch (error) {
      console.log("   ‚ùå Erreur √©v√©nement:", error.message);
    }

    // R√©pertoire
    try {
      const repertoireSnapshot = await db.collection('repertoire').get();
      if (repertoireSnapshot.empty) {
        const samplePiece = {
          title: "Ave Maria",
          composer: "Franz Schubert", 
          genre: "Classique Sacr√©",
          difficulty: "Interm√©diaire",
          voiceParts: ["Soprano", "Alto", "Tenor", "Basse"],
          status: "En apprentissage",
          learningProgress: 60,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('repertoire').add(samplePiece);
        console.log("   Ì≥ú Partition de d√©monstration cr√©√©e");
      }
    } catch (error) {
      console.log("   ‚ùå Erreur r√©pertoire:", error.message);
    }

    // 5. R√âCAPITULATIF FINAL
    console.log("\n" + "=".repeat(70));
    console.log("Ìæâ MIGRATION C.A.S.T. - STRUCTURE FINALE TERMIN√âE !");
    console.log("=".repeat(70));
    
    console.log("\nÌ≥ä R√âSULTATS:");
    console.log(`   Ì±ë Administrateurs: ${adminsCreated} cr√©√©(s) / ${castTeam.length} au total`);
    console.log(`   Ì±• Membres choristes: ${membersCreated + regularUsersMigrated} (dont ${membersCreated} admins)`);
    console.log(`   Ì¥Ñ Utilisateurs migr√©s: ${regularUsersMigrated} user(s) ‚Üí members`);
    
    console.log("\nÌøóÔ∏è  STRUCTURE FINALE:");
    console.log("   Ì≥Å admins/    ‚Üí Gestion des privil√®ges et missions");
    console.log("   Ì≥Å members/   ‚Üí Tous les choristes (y compris admins)");
    console.log("   Ì≥Å events/    ‚Üí √âv√©nements et r√©p√©titions");
    console.log("   Ì≥Å repertoire/‚Üí Partitions musicales");
    
    console.log("\nÌ¥ê CONNEXION ADMINISTRATEURS:");
    console.log("   Ì≥ß Emails: Voir liste C.A.S.T. ci-dessus");
    console.log("   Ì¥ë Mot de passe temporaire: CastCantoria2024!");
    
    console.log("\nÌ≤° PARTICULARIT√âS C.A.S.T.:");
    console.log("   ‚Ä¢ Les administrateurs sont AUSSI des membres choristes");
    console.log("   ‚Ä¢ Double pr√©sence: admins/ (missions) + members/ (chorale)");
    console.log("   ‚Ä¢ Hi√©rarchie naturelle: Tous participent musicalement");

  } catch (error) {
    console.error("‚ùå ERREUR CRITIQUE:", error.message);
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
