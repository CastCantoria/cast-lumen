// src/config/eventsSchema.js
export const eventsSchema = {
  title: "",
  description: "",
  date: null, // Timestamp Firestore
  endDate: null, // Pour les événements sur plusieurs jours
  location: "",
  address: "",
  type: "", // "Concert", "Répétition", "Audition", "Festival", "Cérémonie"
  price: 0,
  capacity: 0,
  bookedSeats: 0,
  imageUrl: "",
  program: [], // Liste des œuvres au programme
  status: "published", // "published", "draft", "cancelled"
  featured: false,
  createdBy: "",
  createdAt: new Date(),
  updatedAt: new Date()
};