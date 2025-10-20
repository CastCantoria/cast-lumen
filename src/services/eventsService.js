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
import { db } from "../config/firebase";

const eventsService = {
  // Récupérer tous les événements
  async getAllEvents() {
    try {
      const eventsQuery = query(
        collection(db, "events"), 
        orderBy("date", "asc")
      );
      const querySnapshot = await getDocs(eventsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erreur chargement événements:", error);
      throw error;
    }
  },

  // Récupérer un événement par ID
  async getEventById(eventId) {
    try {
      const docSnap = await getDoc(doc(db, "events", eventId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Erreur chargement événement:", error);
      throw error;
    }
  },

  // Créer un nouvel événement
  async createEvent(eventData) {
    try {
      const docRef = await addDoc(collection(db, "events"), eventData);
      return { id: docRef.id, ...eventData };
    } catch (error) {
      console.error("Erreur création événement:", error);
      throw error;
    }
  },

  // Mettre à jour un événement
  async updateEvent(eventId, eventData) {
    try {
      await updateDoc(doc(db, "events", eventId), eventData);
      return { id: eventId, ...eventData };
    } catch (error) {
      console.error("Erreur mise à jour événement:", error);
      throw error;
    }
  },

  // Supprimer un événement
  async deleteEvent(eventId) {
    try {
      await deleteDoc(doc(db, "events", eventId));
    } catch (error) {
      console.error("Erreur suppression événement:", error);
      throw error;
    }
  },

  // Récupérer les réservations d'un événement
  async getEventBookings(eventId) {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("eventId", "==", eventId)
      );
      const querySnapshot = await getDocs(bookingsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erreur chargement réservations:", error);
      throw error;
    }
  },

  // Créer une réservation
  async createBooking(bookingData) {
    try {
      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      return { id: docRef.id, ...bookingData };
    } catch (error) {
      console.error("Erreur création réservation:", error);
      throw error;
    }
  },

  // Annuler une réservation
  async cancelBooking(bookingId) {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
    } catch (error) {
      console.error("Erreur annulation réservation:", error);
      throw error;
    }
  },

  // Vérifier si l'utilisateur a déjà réservé
  async hasUserBookedEvent(eventId, userId) {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("eventId", "==", eventId),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(bookingsQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Erreur vérification réservation:", error);
      throw error;
    }
  }
};

// ✅ Export par défaut
export default eventsService;