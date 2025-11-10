// src/components/FixRoles.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from "../lib/firebase";

const FixRoles = () => {
  const { userRole } = useAuth();

  const correctAllRoles = async () => {
    if (userRole !== 'super-admin') {
      alert('❌ Seul un super-admin peut exécuter cette correction');
      return;
    }

    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      let correctedCount = 0;

      const updates = usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        
        // Liste des super-admins autorisés
        const authorizedSuperAdmins = [
          'ad-castcantoria@outlook.fr'
        ];

        const authorizedAdmins = [
          'eric.rasamimanana@gmail.com',
          'tena.solution@gmail.com', 
          'julesrandriamanantsoa@gmail.com',
          'tovoniaina.rahendrison@gmail.com'
        ];

        let correctRole = 'visitor';

        if (authorizedSuperAdmins.includes(userData.email)) {
          correctRole = 'super-admin';
        } else if (authorizedAdmins.includes(userData.email)) {
          correctRole = 'admin';
        } else if (userData.email?.includes('choriste') || userData.role === 'member') {
          correctRole = 'member';
        }

        // Corriger seulement si le rôle est incorrect
        if (userData.role !== correctRole) {
          await updateDoc(doc(db, 'users', userDoc.id), {
            role: correctRole,
            updatedAt: new Date()
          });
          correctedCount++;
          console.log(`✅ ${userData.email}: ${userData.role} → ${correctRole}`);
        }
      });

      await Promise.all(updates);
      alert(`🎉 ${correctedCount} utilisateurs corrigés !`);
    } catch (error) {
      console.error('Erreur correction rôles:', error);
      alert('❌ Erreur lors de la correction');
    }
  };

  if (userRole !== 'super-admin') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold text-yellow-800 mb-2">🔧 Correction des Rôles</h3>
      <p className="text-yellow-700 text-sm mb-3">
        Certains utilisateurs ont des rôles incorrects. Cliquez pour corriger.
      </p>
      <button
        onClick={correctAllRoles}
        className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors"
      >
        Corriger les Rôles
      </button>
    </div>
  );
};

export default FixRoles;