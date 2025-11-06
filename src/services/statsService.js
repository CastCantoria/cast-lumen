// src/services/statsService.js
import { collection, getDocs, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const statsService = {
  // Récupérer les statistiques globales
  async getGlobalStats() {
    try {
      console.log('📊 Chargement des statistiques globales...');
      
      // Compter les utilisateurs
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getCountFromServer(usersCollection);
      const totalUsers = usersSnapshot.data().count;

      // Compter les événements actifs (ceux à venir)
      const eventsCollection = collection(db, 'events');
      const eventsQuery = query(eventsCollection, where('date', '>=', new Date()));
      const eventsSnapshot = await getCountFromServer(eventsQuery);
      const activeEvents = eventsSnapshot.data().count;

      // Calculer l'utilisation du stockage (approximatif)
      // Note: Pour un calcul précis, vous devriez utiliser Firebase Storage API
      const storageUsed = await this.calculateStorageUsage();

      // Récupérer la santé du système
      const systemHealth = await this.getSystemHealth();

      return {
        totalUsers,
        activeEvents,
        storageUsed,
        systemHealth,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erreur chargement statistiques:', error);
      throw error;
    }
  },

  // Calcul approximatif du stockage
  async calculateStorageUsage() {
    try {
      // Pour Firebase Storage, vous devriez utiliser listAll() et sommer les tailles
      // Pour l'instant, retournons une valeur fixe ou basique
      return {
        used: 2.3,
        unit: 'GB',
        percentage: 65
      };
    } catch (error) {
      console.error('❌ Erreur calcul stockage:', error);
      return {
        used: 0,
        unit: 'GB',
        percentage: 0
      };
    }
  },

  // Santé du système
  async getSystemHealth() {
    // Pour l'instant, retournons des valeurs simulées
    // Plus tard, vous pourriez intégrer des monitoring réels
    return {
      api: { status: 'healthy', responseTime: 120, uptime: 99.9 },
      database: { status: 'healthy', responseTime: 45, uptime: 100 },
      storage: { status: 'warning', usage: 85, monitoring: true }
    };
  },

  // Récupérer l'activité récente
  async getRecentActivity(limit = 10) {
    try {
      const activitiesCollection = collection(db, 'activity_logs');
      const activitiesQuery = query(
        activitiesCollection, 
        // orderBy('timestamp', 'desc'),
        // limit(limit)
      );
      
      const snapshot = await getDocs(activitiesQuery);
      const activities = [];

      snapshot.forEach(doc => {
        activities.push({
          id: doc.id,
          ...doc.data(),
          // Formatage de la date
          timestamp: doc.data().timestamp?.toDate() || new Date()
        });
      });

      // Si pas d'activités en base, retourner des données de test
      if (activities.length === 0) {
        return this.getMockActivities();
      }

      return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);

    } catch (error) {
      console.error('❌ Erreur chargement activité:', error);
      // Retourner des données mockées en cas d'erreur
      return this.getMockActivities();
    }
  },

  // Données mockées temporaires
  getMockActivities() {
    return [
      {
        id: '1',
        user: 'admin@system',
        action: 'a modifié les paramètres globaux',
        type: 'settings',
        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 min ago
      },
      {
        id: '2', 
        user: 'system',
        action: 'sauvegarde automatique effectuée',
        type: 'backup',
        timestamp: new Date(Date.now() - 25 * 60 * 1000) // 25 min ago
      },
      {
        id: '3',
        user: 'superadmin',
        action: 'a créé un nouvel utilisateur admin',
        type: 'user',
        timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 min ago
      }
    ];
  }
};