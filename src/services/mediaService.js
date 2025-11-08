// src/services/mediaService.js
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

export const uploadMedia = async (mediaData, userId) => {
  try {
    // Upload du fichier vers Firebase Storage
    const fileRef = ref(storage, `user-media/${userId}/${Date.now()}-${mediaData.file.name}`);
    const snapshot = await uploadBytes(fileRef, mediaData.file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Sauvegarde des métadonnées dans Firestore
    const mediaDoc = {
      title: mediaData.title,
      description: mediaData.description,
      category: mediaData.category,
      type: mediaData.type,
      url: downloadURL,
      fileName: mediaData.file.name,
      fileSize: mediaData.file.size,
      uploadedBy: userId,
      status: 'pending', // En attente de modération
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'userMedia'), mediaDoc);
    return docRef.id;
  } catch (error) {
    console.error('Erreur upload média:', error);
    throw error;
  }
};

export const getUserMedia = async (userId) => {
  try {
    const q = query(
      collection(db, 'userMedia'),
      where('uploadedBy', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const media = [];
    
    querySnapshot.forEach((doc) => {
      media.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return media;
  } catch (error) {
    console.error('Erreur récupération médias:', error);
    throw error;
  }
};

export const getAllMedia = async (filters = {}) => {
  try {
    let q = query(collection(db, 'userMedia'), orderBy('createdAt', 'desc'));
    
    if (filters.type && filters.type !== 'all') {
      q = query(q, where('type', '==', filters.type));
    }
    
    if (filters.category && filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }

    const querySnapshot = await getDocs(q);
    const media = [];
    
    querySnapshot.forEach((doc) => {
      media.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return media;
  } catch (error) {
    console.error('Erreur récupération tous médias:', error);
    throw error;
  }
};