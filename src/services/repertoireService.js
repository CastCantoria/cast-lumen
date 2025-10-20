import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy 
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const repertoireService = {
  // Récupérer toutes les œuvres
  async getAllWorks() {
    try {
      const worksQuery = query(
        collection(db, "repertoire"), 
        orderBy("title", "asc")
      );
      const querySnapshot = await getDocs(worksQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erreur chargement répertoire:", error);
      throw error;
    }
  },

  // Récupérer une œuvre par ID
  async getWorkById(workId) {
    try {
      const docSnap = await getDoc(doc(db, "repertoire", workId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Erreur chargement œuvre:", error);
      throw error;
    }
  },

  // Créer une nouvelle œuvre
  async createWork(workData) {
    try {
      const docRef = await addDoc(collection(db, "repertoire"), workData);
      return { id: docRef.id, ...workData };
    } catch (error) {
      console.error("Erreur création œuvre:", error);
      throw error;
    }
  },

  // Mettre à jour une œuvre
  async updateWork(workId, workData) {
    try {
      await updateDoc(doc(db, "repertoire", workId), workData);
      return { id: workId, ...workData };
    } catch (error) {
      console.error("Erreur mise à jour œuvre:", error);
      throw error;
    }
  },

  // Supprimer une œuvre
  async deleteWork(workId) {
    try {
      await deleteDoc(doc(db, "repertoire", workId));
    } catch (error) {
      console.error("Erreur suppression œuvre:", error);
      throw error;
    }
  },

  // Uploader un fichier (partition PDF)
  async uploadScore(file, fileName) {
    try {
      const storageRef = ref(storage, `scores/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Erreur upload partition:", error);
      throw error;
    }
  },

  // Uploader un extrait audio
  async uploadAudio(file, fileName) {
    try {
      const storageRef = ref(storage, `audio/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Erreur upload audio:", error);
      throw error;
    }
  },

  // Filtrer les œuvres
  async filterWorks(filters = {}) {
    try {
      let worksQuery = query(collection(db, "repertoire"));
      
      // Appliquer les filtres
      if (filters.style) {
        worksQuery = query(worksQuery, where("style", "==", filters.style));
      }
      if (filters.period) {
        worksQuery = query(worksQuery, where("period", "==", filters.period));
      }
      if (filters.difficulty) {
        worksQuery = query(worksQuery, where("difficulty", "==", filters.difficulty));
      }
      if (filters.language) {
        worksQuery = query(worksQuery, where("language", "==", filters.language));
      }

      const querySnapshot = await getDocs(worksQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erreur filtrage œuvres:", error);
      throw error;
    }
  }
};

// ✅ Export par défaut
export default repertoireService;