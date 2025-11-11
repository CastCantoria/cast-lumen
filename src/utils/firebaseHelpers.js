// src/utils/firebaseHelpers.js
export const safeAddDoc = async (collectionRef, data) => {
  // Nettoyer toutes les données
  const cleanedData = cleanFirestoreData(data);
  
  try {
    const docRef = await addDoc(collectionRef, cleanedData);
    return docRef;
  } catch (error) {
    console.error('❌ Erreur safeAddDoc:', error);
    throw error;
  }
};

export const cleanFirestoreData = (data) => {
  if (typeof data !== 'object' || data === null) return data;
  
  const cleaned = Array.isArray(data) ? [] : {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      // Définir des valeurs par défaut pour les champs critiques
      if (key === 'userRole') cleaned[key] = 'user';
      else if (key === 'userId') cleaned[key] = 'anonymous';
      else if (key === 'userEmail') cleaned[key] = 'unknown@example.com';
      // Sinon, supprimer le champ undefined
    } else if (value === null) {
      cleaned[key] = null;
    } else if (typeof value === 'object') {
      cleaned[key] = cleanFirestoreData(value);
    } else {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
};