// src/utils/firebasePatch.js
// PATCH URGENT pour résoudre le problème userRole undefined

import { db, collection, addDoc, serverTimestamp } from '../lib/firebase';

// Remplacer la fonction problématique globalement
window.submitMediaForModeration = async (mediaData) => {
  console.log('🩹 PATCH - submitMediaForModeration appelé');
  
  // Données garanties sans undefined
  const safeData = {
    // Valeurs par défaut critiques
    userRole: mediaData.userRole || 'user',
    userId: mediaData.userId || 'anonymous',
    userEmail: mediaData.userEmail || 'unknown@example.com',
    userDisplayName: mediaData.userDisplayName || 'Utilisateur',
    status: 'pending',
    likes: 0,
    reports: 0,
    moderated: false,
    moderationDate: null,
    moderatorId: null,
    moderatorNotes: '',
    uploadDate: serverTimestamp(),
    // Copier toutes les autres données
    ...mediaData
  };

  // Nettoyer les undefined restants
  const cleanData = Object.fromEntries(
    Object.entries(safeData).filter(([_, value]) => value !== undefined)
  );

  console.log('📤 Soumission PATCH (nettoyée):', cleanData);

  try {
    const docRef = await addDoc(collection(db, 'gallery_moderation'), cleanData);
    console.log('✅ Document modération créé (PATCH):', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erreur soumission modération (PATCH):', error);
    throw error;
  }
};

console.log('🩹 PATCH Firebase appliqué - submitMediaForModeration sécurisé');