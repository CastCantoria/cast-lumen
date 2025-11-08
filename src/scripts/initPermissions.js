// src/scripts/initPermissions.js
import { db } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { PERMISSIONS, ROLE_PERMISSIONS } from '../config/roles';

/**
 * Initialise les permissions dans Firestore
 */
const initializePermissions = async () => {
  const permissionsCollection = collection(db, 'permissions');

  // Convertir les tableaux de permissions en objets avec valeur true
  const formatPermissions = (permissionsArray) => {
    const permissionsObj = {};
    permissionsArray.forEach(permission => {
      permissionsObj[permission] = true;
    });
    return permissionsObj;
  };

  try {
    // Pour chaque rôle, créer un document avec ses permissions
    for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      const roleDoc = doc(permissionsCollection, role);
      await setDoc(roleDoc, formatPermissions(permissions));
      console.log(`✅ Permissions initialisées pour le rôle ${role}`);
    }

    console.log('🎉 Toutes les permissions ont été initialisées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des permissions:', error);
    throw error;
  }
};

export default initializePermissions;