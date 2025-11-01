// src/services/memberService.js
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';

// Fonction pour créer un membre
export const createMember = async (memberData) => {
  try {
    const membersRef = collection(db, 'users');
    await addDoc(membersRef, {
      ...memberData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      role: 'member'
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la création du membre:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour créer des membres de test
export const createTestMembers = async () => {
  const testMembers = [
    {
      firstName: 'Marie',
      lastName: 'Laurent',
      email: 'marie.laurent@test.com',
      vocalRange: 'Soprano',
      phone: '0123456789',
      password: 'Test123!',
    },
    {
      firstName: 'Jean',
      lastName: 'Dubois',
      email: 'jean.dubois@test.com',
      vocalRange: 'Tenor',
      phone: '0123456790',
      password: 'Test123!',
    },
    {
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@test.com',
      vocalRange: 'Alto',
      phone: '0123456791',
      password: 'Test123!',
    },
    {
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@test.com',
      vocalRange: 'Basse',
      phone: '0123456792',
      password: 'Test123!',
    }
  ];

  try {
    const createdMembers = [];

    for (const member of testMembers) {
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        member.email,
        member.password
      );

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
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Ajouter le membre dans Firestore
      const docRef = doc(db, 'users', userCredential.user.uid);
      await updateDoc(docRef, memberData);

      createdMembers.push(memberData);
    }

    return { 
      success: true, 
      message: `${createdMembers.length} membres de test créés avec succès`,
      members: createdMembers
    };
  } catch (error) {
    console.error('Erreur lors de la création des membres de test:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Fonction pour récupérer tous les membres
export const getAllMembers = async () => {
  try {
    const membersRef = collection(db, 'users');
    const q = query(membersRef, where('role', '==', 'member'));
    const querySnapshot = await getDocs(q);
    
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, members };
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    return { success: false, error: error.message };
  }
};