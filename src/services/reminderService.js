// src/services/memberService.js
import { collection, addDoc, getDocs, query, where, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';

// Fonction pour créer un membre
export const createMember = async (memberData) => {
  try {
    console.log('🔄 Création d\'un nouveau membre...', memberData);
    
    const membersRef = collection(db, 'users');
    const docRef = await addDoc(membersRef, {
      ...memberData,
      displayName: `${memberData.firstName} ${memberData.lastName}`.trim(),
      userType: 'member',
      role: memberData.role || 'member',
      status: memberData.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Membre créé avec ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Erreur lors de la création du membre:', error);
    return { success: false, error: error.message };
  }
};

// Fonction CORRIGÉE pour créer des membres de test (avec Auth)
export const createTestMembers = async () => {
  const testMembers = [
    {
      firstName: 'Marie',
      lastName: 'Laurent',
      email: 'marie.laurent@test.com',
      vocalRange: 'Soprano',
      phone: '+261 34 11 111 11',
      password: 'Test123!',
    },
    {
      firstName: 'Jean',
      lastName: 'Dubois',
      email: 'jean.dubois@test.com',
      vocalRange: 'Tenor',
      phone: '+261 34 11 111 12',
      password: 'Test123!',
    },
    {
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@test.com',
      vocalRange: 'Alto',
      phone: '+261 34 11 111 13',
      password: 'Test123!',
    },
    {
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@test.com',
      vocalRange: 'Basse',
      phone: '+261 34 11 111 14',
      password: 'Test123!',
    }
  ];

  try {
    const createdMembers = [];
    console.log('🔄 Début de la création des membres de test avec Auth...');

    for (const member of testMembers) {
      try {
        console.log(`👤 Création de ${member.firstName} ${member.lastName}...`);
        
        // Créer l'utilisateur dans Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          member.email,
          member.password
        );

        console.log(`✅ Auth créé pour ${member.email}, UID:`, userCredential.user.uid);

        // Préparer les données pour Firestore
        const memberData = {
          uid: userCredential.user.uid,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          displayName: `${member.firstName} ${member.lastName}`,
          vocalRange: member.vocalRange,
          phone: member.phone,
          role: 'member',
          userType: 'member',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // CORRECTION : Utiliser setDoc pour créer le document
        const docRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(docRef, memberData);

        console.log(`✅ Firestore document créé pour ${member.firstName}`);
        createdMembers.push({ id: docRef.id, ...memberData });
        
      } catch (memberError) {
        console.error(`❌ Erreur avec ${member.email}:`, memberError.message);
        // Continuer avec le membre suivant même en cas d'erreur
      }
    }

    console.log(`🎉 ${createdMembers.length} membres créés avec succès avec Auth`);
    return { 
      success: true, 
      message: `${createdMembers.length} membres de test créés avec succès (avec authentification)`,
      members: createdMembers
    };
  } catch (error) {
    console.error('💥 Erreur générale lors de la création des membres de test:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Version SIMPLIFIÉE sans Firebase Auth (plus fiable)
export const createTestMembersSimple = async () => {
  const testMembers = [
    {
      firstName: 'Marie',
      lastName: 'Laurent',
      email: 'marie.laurent@cast-cantoria.org',
      vocalRange: 'Soprano',
      phone: '+261 34 11 111 11',
      role: 'member',
      userType: 'member',
      status: 'active',
      displayName: 'Marie Laurent',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      firstName: 'Jean',
      lastName: 'Dubois', 
      email: 'jean.dubois@cast-cantoria.org',
      vocalRange: 'Tenor',
      phone: '+261 34 11 111 12',
      role: 'member',
      userType: 'member',
      status: 'active',
      displayName: 'Jean Dubois',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@cast-cantoria.org',
      vocalRange: 'Alto',
      phone: '+261 34 11 111 13',
      role: 'member', 
      userType: 'member',
      status: 'pending',
      displayName: 'Sophie Martin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@cast-cantoria.org',
      vocalRange: 'Basse',
      phone: '+261 34 11 111 14',
      role: 'member',
      userType: 'member',
      status: 'active',
      displayName: 'Pierre Bernard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      firstName: 'Alice',
      lastName: 'Rakoto',
      email: 'alice.rakoto@cast-cantoria.org',
      vocalRange: 'Soprano',
      phone: '+261 34 11 111 15',
      role: 'member',
      userType: 'member',
      status: 'active',
      displayName: 'Alice Rakoto',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      firstName: 'Thomas',
      lastName: 'Randria',
      email: 'thomas.randria@cast-cantoria.org',
      vocalRange: 'Ténor',
      phone: '+261 34 11 111 16',
      role: 'member',
      userType: 'member',
      status: 'inactive',
      displayName: 'Thomas Randria',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  try {
    const createdMembers = [];
    console.log('🔄 Début de la création des membres de test (version simple)...');

    for (const memberData of testMembers) {
      try {
        // Créer directement dans Firestore avec un ID auto-généré
        const docRef = await addDoc(collection(db, 'users'), memberData);
        console.log(`✅ Membre créé: ${docRef.id} - ${memberData.firstName}`);
        createdMembers.push({ id: docRef.id, ...memberData });
      } catch (error) {
        console.error(`❌ Erreur création ${memberData.email}:`, error.message);
      }
    }

    console.log(`🎉 ${createdMembers.length} membres créés avec succès (version simple)`);
    return { 
      success: true, 
      message: `${createdMembers.length} membres de test créés avec succès !`,
      members: createdMembers
    };
  } catch (error) {
    console.error('💥 Erreur création membres simple:', error);
    return { success: false, error: error.message };
  }
};

// Fonction améliorée pour récupérer tous les membres
export const getAllMembers = async () => {
  try {
    console.log('🔍 Récupération de tous les membres...');
    
    const membersRef = collection(db, 'users');
    
    // Essayer d'abord avec 'role' = 'member'
    let q = query(membersRef, where('role', '==', 'member'));
    let querySnapshot = await getDocs(q);
    
    console.log(`📊 Membres trouvés avec role=member: ${querySnapshot.size}`);
    
    // Si aucun membre trouvé, essayer avec 'userType' = 'member'
    if (querySnapshot.size === 0) {
      console.log('🔍 Essai avec userType=member...');
      q = query(membersRef, where('userType', '==', 'member'));
      querySnapshot = await getDocs(q);
      console.log(`📊 Membres trouvés avec userType=member: ${querySnapshot.size}`);
    }
    
    // Si toujours aucun, récupérer tous les utilisateurs
    if (querySnapshot.size === 0) {
      console.log('🔍 Récupération de tous les utilisateurs...');
      querySnapshot = await getDocs(membersRef);
      console.log(`📊 Total utilisateurs trouvés: ${querySnapshot.size}`);
    }
    
    const members = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📝 Document trouvé:', doc.id, data);
      members.push({ id: doc.id, ...data });
    });

    console.log(`👥 ${members.length} membre(s) retourné(s) au total`);
    return { success: true, members };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des membres:', error);
    return { success: false, error: error.message, members: [] };
  }
};

// Fonction pour mettre à jour un membre
export const updateMember = async (memberId, memberData) => {
  try {
    const docRef = doc(db, 'users', memberId);
    await updateDoc(docRef, {
      ...memberData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour supprimer un membre
export const deleteMember = async (memberId) => {
  try {
    const docRef = doc(db, 'users', memberId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour récupérer un membre par son ID
export const getMemberById = async (memberId) => {
  try {
    const docRef = doc(db, 'users', memberId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, member: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Membre non trouvé' };
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du membre:', error);
    return { success: false, error: error.message };
  }
};

// Fonction de debug pour voir tous les utilisateurs
export const debugAllUsers = async () => {
  try {
    console.log('🐛 Debug: Récupération de tous les utilisateurs...');
    
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    console.log(`🐛 Total documents dans 'users': ${querySnapshot.size}`);
    
    const allUsers = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('🐛 Document:', doc.id, data);
      allUsers.push({ id: doc.id, ...data });
    });

    return { success: true, users: allUsers };
  } catch (error) {
    console.error('🐛 Erreur debug:', error);
    return { success: false, error: error.message };
  }
};