import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  startAt, 
  endAt,
  Timestamp,
  count
} from 'firebase/firestore';

export const statsService = {
  
  // Récupérer toutes les statistiques
  async getAllStatistics() {
    try {
      const [
        userStats,
        eventCount,
        monthlyRevenue,
        monthlyRegistrations
      ] = await Promise.all([
        this.getUserRoleStats(),
        this.getEventCount(),
        this.getMonthlyRevenue(),
        this.getMonthlyRegistrations()
      ]);

      return {
        userStats,
        eventCount,
        monthlyRevenue,
        monthlyRegistrations,
        totalUsers: userStats.total,
        activeEvents: eventCount.active,
        totalRevenue: monthlyRevenue.total
      };
    } catch (error) {
      console.error('Error fetching all statistics:', error);
      throw error;
    }
  },

  // Statistiques des rôles utilisateurs
  async getUserRoleStats() {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const stats = {
        super_admin: 0,
        admin_programmation: 0,
        admin_communication: 0,
        admin_membres: 0,
        admin_technique: 0,
        member: 0,
        visitor: 0,
        total: 0
      };

      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        const role = userData.role || 'visitor';
        if (stats[role] !== undefined) {
          stats[role]++;
        }
        stats.total++;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching user role stats:', error);
      throw error;
    }
  },

  // Nombre d'événements
  async getEventCount() {
    try {
      const now = new Date();
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      
      let total = 0;
      let active = 0;
      let upcoming = 0;
      let past = 0;

      eventsSnapshot.forEach(doc => {
        const eventData = doc.data();
        total++;
        
        if (eventData.date) {
          const eventDate = eventData.date.toDate();
          if (eventDate > now) {
            upcoming++;
            active++;
          } else {
            past++;
          }
        }
      });

      return { total, active, upcoming, past };
    } catch (error) {
      console.error('Error fetching event count:', error);
      throw error;
    }
  },

  // Revenus mensuels (pour les concerts payants)
  async getMonthlyRevenue() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Récupérer les événements du mois (filtrer price > 0 côté client pour éviter
      // d'avoir besoin d'un index composite si price est utilisé en inégalité sur
      // un champ différent de date)
      const eventsQuery = query(
        collection(db, 'events'),
        where('date', '>=', Timestamp.fromDate(startOfMonth)),
        where('date', '<=', Timestamp.fromDate(endOfMonth))
      );

      const eventsSnapshot = await getDocs(eventsQuery);
      let totalRevenue = 0;
      const eventsRevenue = [];

      for (const doc of eventsSnapshot.docs) {
        const eventData = doc.data();

        // Skip non-paid events (filtering client-side to avoid composite index)
        if (!eventData.price || eventData.price <= 0) continue;

        // Compter les participants confirmés pour cet événement
        const registrationsQuery = query(
          collection(db, 'registrations'),
          where('eventId', '==', doc.id),
          where('status', '==', 'confirmed')
        );

        const registrationsSnapshot = await getDocs(registrationsQuery);
        const participantCount = registrationsSnapshot.size;
        const eventRevenue = participantCount * (eventData.price || 0);

        totalRevenue += eventRevenue;

        eventsRevenue.push({
          eventId: doc.id,
          title: eventData.title,
          date: eventData.date,
          price: eventData.price,
          participants: participantCount,
          revenue: eventRevenue
        });
      }

      return {
        total: totalRevenue,
        events: eventsRevenue,
        month: now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
      };
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      throw error;
    }
  },

  // Inscriptions mensuelles
  async getMonthlyRegistrations() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const registrationsQuery = query(
        collection(db, 'registrations'),
        where('date', '>=', Timestamp.fromDate(startOfMonth)),
        where('date', '<=', Timestamp.fromDate(endOfMonth))
      );

      const registrationsSnapshot = await getDocs(registrationsQuery);
      
      const dailyRegistrations = {};
      let total = 0;
      let confirmed = 0;
      let pending = 0;

      registrationsSnapshot.forEach(doc => {
        const regData = doc.data();
        total++;
        
        // Compter par statut
        if (regData.status === 'confirmed') confirmed++;
        if (regData.status === 'pending') pending++;

        // Compter par jour
        if (regData.date) {
          const day = regData.date.toDate().toISOString().split('T')[0];
          dailyRegistrations[day] = (dailyRegistrations[day] || 0) + 1;
        }
      });

      return {
        total,
        confirmed,
        pending,
        daily: dailyRegistrations,
        month: now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
      };
    } catch (error) {
      console.error('Error fetching monthly registrations:', error);
      throw error;
    }
  },

  // Tous les événements (pour les listes)
  async getAllEvents(limit = 10) {
    try {
      const eventsQuery = query(
        collection(db, 'events'),
        orderBy('date', 'desc')
      );

      const eventsSnapshot = await getDocs(eventsQuery);
      const events = [];

      eventsSnapshot.forEach(doc => {
        events.push({
          id: doc.id,
          ...doc.data(),
          // Convertir Timestamp en Date si nécessaire
          date: doc.data().date?.toDate() || null
        });
      });

      return limit ? events.slice(0, limit) : events;
    } catch (error) {
      console.error('Error fetching all events:', error);
      throw error;
    }
  }
};