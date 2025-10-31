// src/services/reminderService.js
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { emailService } from './emailService';

export const reminderService = {
  // Vérifier et envoyer les rappels d'événements
  async checkAndSendEventReminders() {
    try {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      // Récupérer les événements qui ont lieu demain
      const eventsQuery = query(
        collection(db, 'events'),
        where('date', '>=', tomorrow),
        where('date', '<', new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)),
        where('status', '==', 'published')
      );

      const eventsSnapshot = await getDocs(eventsQuery);
      const events = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate()
      }));

      console.log(`📅 ${events.length} événements trouvés pour demain`);

      // Pour chaque événement, envoyer des rappels aux participants
      for (const event of events) {
        await this.sendRemindersForEvent(event);
      }

      return { success: true, eventsProcessed: events.length };
    } catch (error) {
      console.error('Erreur envoi rappels:', error);
      return { success: false, error: error.message };
    }
  },

  // Envoyer les rappels pour un événement spécifique
  async sendRemindersForEvent(event) {
    try {
      // Récupérer toutes les réservations pour cet événement
      const bookingsQuery = query(
        collection(db, 'events', event.id, 'bookings')
      );
      
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookings = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`📧 Envoi de ${bookings.length} rappels pour: ${event.title}`);

      // Envoyer un email de rappel à chaque participant
      for (const booking of bookings) {
        try {
          await emailService.sendEventReminderEmail(
            booking,
            event,
            { email: booking.email, firstName: booking.firstName }
          );
          console.log(`✅ Rappel envoyé à: ${booking.email}`);
        } catch (emailError) {
          console.error(`❌ Erreur rappel pour ${booking.email}:`, emailError);
        }
        
        // Pause pour éviter de surcharger le service d'email
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return { success: true, remindersSent: bookings.length };
    } catch (error) {
      console.error('Erreur envoi rappels événement:', error);
      return { success: false, error: error.message };
    }
  }
};