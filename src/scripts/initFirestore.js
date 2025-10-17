// src/scripts/initFirestore.js
import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, updateDoc } from 'firebase/firestore';

// Fonction de migration des rôles
const migrateUserRoles = async () => {
  try {
    console.log('🔄 Migration des rôles utilisateurs...');
    
    const usersSnapshot = await getDocs(collection(db, 'users'));
    let migratedCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      let newRole = userData.role;

      // Corriger les rôles anciens
      if (userData.role === 'super-admin') {
        newRole = 'super_admin';
      } else if (userData.role === 'admin') {
        // Déterminer le type d'admin basé sur l'email
        const email = userData.email?.toLowerCase();
        if (email === 'eric.rasamimanana@gmail.com') newRole = 'admin_programmation';
        else if (email === 'tena.solution@gmail.com') newRole = 'admin_communication';
        else if (email === 'julesrandriamanantsoa@gmail.com') newRole = 'admin_membres';
        else if (email === 'tovoniaina.rahendrison@gmail.com') newRole = 'admin_technique';
        else newRole = 'admin_programmation';
      }

      // Mettre à jour si le rôle a changé
      if (newRole !== userData.role) {
        await updateDoc(doc(db, 'users', userDoc.id), {
          role: newRole,
          updatedAt: new Date()
        });
        console.log(`✅ Rôle migré: ${userData.email} (${userData.role} → ${newRole})`);
        migratedCount++;
      }
    }

    console.log(`🎉 Migration terminée: ${migratedCount} utilisateurs mis à jour`);
  } catch (error) {
    console.error('❌ Erreur migration:', error);
  }
};

// Données réelles des administrateurs CAST Cantoria
const getAdminUsers = () => {
  const now = new Date();
  return [
    // Super Admin
    {
      id: 'super-admin-cast',
      email: 'ad-castcantoria@outlook.fr',
      firstName: 'Super',
      lastName: 'Administrateur',
      role: 'super_admin',
      status: 'active',
      responsibility: '👑 Supervision générale de la plateforme',
      phoneNumber: '+261 34 11 361 57',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      emailVerified: true,
      provider: 'email'
    },
    // Admin Programmation Artistique - Eric
    {
      id: 'admin-programmation-eric',
      email: 'eric.rasamimanana@gmail.com',
      firstName: 'Eric',
      lastName: 'Rasamimanana',
      role: 'admin_programmation',
      status: 'active',
      responsibility: '🎵 Programmation Artistique - Gestion des événements et concerts',
      phoneNumber: '+261 34 11 361 57',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      emailVerified: true,
      provider: 'email'
    },
    // Admin Communication - Tena
    {
      id: 'admin-communication-tena',
      email: 'tena.solution@gmail.com',
      firstName: 'Tena',
      lastName: 'Solution',
      role: 'admin_communication',
      status: 'active',
      responsibility: '📢 Communication & Contenu - Actualités et galerie',
      phoneNumber: '+261 32 91 828 83',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      emailVerified: true,
      provider: 'email'
    },
    // Admin Membres - Jules
    {
      id: 'admin-membres-jules',
      email: 'julesrandriamanantsoa@gmail.com',
      firstName: 'Jules',
      lastName: 'Randriamanantsoa',
      role: 'admin_membres',
      status: 'active',
      responsibility: '👥 Gestion des Membres - Admissions et profils',
      phoneNumber: '+261 34 00 0004',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      emailVerified: true,
      provider: 'email'
    },
    // Admin Technique - Tovoniaina
    {
      id: 'admin-technique-tovo',
      email: 'tovoniaina.rahendrison@gmail.com',
      firstName: 'Tovoniaina',
      lastName: 'Rahendrison',
      role: 'admin_technique',
      status: 'active',
      responsibility: '🛠️ Support Technique - Upload média et maintenance',
      phoneNumber: '+261 34 00 0005',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      emailVerified: true,
      provider: 'email'
    }
  ];
};

// Membres de démonstration réalistes
const getDemoMembers = () => {
  const now = new Date();
  return [
    {
      id: 'member-soprano-1',
      email: 'marie.ravaka@castcantoria.org',
      firstName: 'Marie',
      lastName: 'Ravaka',
      role: 'member',
      status: 'active',
      voice: 'soprano',
      responsibility: '🎵 Choriste - Soprano',
      phoneNumber: '+261 34 10 1101',
      experience: '6 ans de chant choral, formation en solfège',
      createdAt: new Date('2024-01-15'),
      updatedAt: now,
      lastLoginAt: now,
      emailVerified: true,
      provider: 'email'
    },
    {
      id: 'member-alto-1',
      email: 'sarah.andria@castcantoria.org',
      firstName: 'Sarah',
      lastName: 'Andria',
      role: 'member',
      status: 'active',
      voice: 'alto',
      responsibility: '🎵 Choriste - Alto',
      phoneNumber: '+261 34 10 1102',
      experience: '4 ans de pratique chorale',
      createdAt: new Date('2024-01-20'),
      updatedAt: now,
      lastLoginAt: now,
      emailVerified: true,
      provider: 'email'
    },
    {
      id: 'member-tenor-1',
      email: 'jean.rakoto@castcantoria.org',
      firstName: 'Jean',
      lastName: 'Rakoto',
      role: 'member',
      status: 'active',
      voice: 'ténor',
      responsibility: '🎵 Choriste - Ténor',
      phoneNumber: '+261 34 10 1103',
      experience: '5 ans en chorale paroissiale',
      createdAt: new Date('2024-02-01'),
      updatedAt: now,
      lastLoginAt: now,
      emailVerified: true,
      provider: 'email'
    },
    {
      id: 'member-basse-1',
      email: 'pierre.ranaivo@castcantoria.org',
      firstName: 'Pierre',
      lastName: 'Ranaivo',
      role: 'member',
      status: 'active',
      voice: 'basse',
      responsibility: '🎵 Choriste - Basse',
      phoneNumber: '+261 34 10 1104',
      experience: '3 ans de chant, ancien chef de chœur junior',
      createdAt: new Date('2024-02-10'),
      updatedAt: now,
      lastLoginAt: now,
      emailVerified: true,
      provider: 'email'
    },
    {
      id: 'pending-candidate-1',
      email: 'lucie.ratovo@castcantoria.org',
      firstName: 'Lucie',
      lastName: 'Ratovo',
      role: 'visitor',
      status: 'pending',
      voice: 'soprano',
      responsibility: '🎵 Candidate Choriste',
      phoneNumber: '+261 34 10 1105',
      experience: 'Débutante, passionnée de chant sacré',
      message: 'Je souhaite rejoindre la chorale pour partager ma foi à travers la musique',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      emailVerified: false,
      provider: 'email'
    }
  ];
};

// Fonction d'initialisation principale
export const initializeFirestoreData = async () => {
  try {
    console.log('🚀 Initialisation des données Firestore CAST Cantoria...');

    // Vérifier si les données existent déjà
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    if (usersSnapshot.empty) {
      console.log('📝 Création des données initiales...');

      // Créer les administrateurs
      const adminUsers = getAdminUsers();
      for (const user of adminUsers) {
        await setDoc(doc(db, 'users', user.id), user);
        console.log(`✅ Admin créé: ${user.email} (${user.role})`);
      }

      // Créer les membres de démonstration
      const demoMembers = getDemoMembers();
      for (const member of demoMembers) {
        await setDoc(doc(db, 'users', member.id), member);
        console.log(`✅ Membre créé: ${member.email} (${member.status})`);
      }

      console.log('🎉 Initialisation Firestore terminée avec succès!');
      console.log(`📊 ${adminUsers.length} administrateurs créés`);
      console.log(`📊 ${demoMembers.length} membres créés`);
    } else {
      console.log('ℹ️ Les données existent déjà dans Firestore');
      console.log(`📊 ${usersSnapshot.size} utilisateurs trouvés`);
      
      // Migrer les rôles existants
      await migrateUserRoles();
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation Firestore:', error);
    throw error;
  }
};

// Fonction pour vérifier l'état de la base de données
export const checkFirestoreStatus = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`📊 Statut Firestore: ${usersSnapshot.size} utilisateurs enregistrés`);
    
    usersSnapshot.forEach(doc => {
      const user = doc.data();
      console.log(`👤 ${user.email} - ${user.role} - ${user.status}`);
    });
    
    return usersSnapshot.size;
  } catch (error) {
    console.error('❌ Erreur vérification Firestore:', error);
    return 0;
  }
};

// Fonction pour réinitialiser les données (uniquement en développement)
export const resetFirestoreData = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('🚨 Impossible de réinitialiser en production');
    return;
  }
  
  console.log('🔄 Réinitialisation des données Firestore...');
  // Note: En production, il faudrait une logique plus sécurisée
  await initializeFirestoreData();
};