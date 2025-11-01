import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: {
      total: 0,
      active: 0,
      byRole: {},
      recentlyJoined: []
    },
    events: {
      total: 0,
      upcoming: 0,
      past: 0,
      byType: {},
      mostPopular: []
    },
    participation: {
      averageAttendance: 0,
      topAttendees: []
    }
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques des utilisateurs
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Charger les événements
      const eventsRef = collection(db, 'events');
      const upcomingEventsQuery = query(
        eventsRef,
        where('date', '>=', now.toISOString().split('T')[0]),
        orderBy('date', 'asc')
      );
      const pastEventsQuery = query(
        eventsRef,
        where('date', '<', now.toISOString().split('T')[0]),
        orderBy('date', 'desc')
      );

      const [upcomingEventsSnapshot, pastEventsSnapshot] = await Promise.all([
        getDocs(upcomingEventsQuery),
        getDocs(pastEventsQuery)
      ]);

      // Calculer les statistiques
      const roleCount = {};
      const eventTypeCount = {};
      const activeUsers = usersData.filter(u => u.isActive !== false);
      const recentUsers = usersData
        .filter(u => u.createdAt && new Date(u.createdAt.seconds * 1000) >= thirtyDaysAgo)
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
        .slice(0, 5);

      usersData.forEach(user => {
        roleCount[user.role] = (roleCount[user.role] || 0) + 1;
      });

      const upcomingEvents = upcomingEventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const pastEvents = pastEventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      [...upcomingEvents, ...pastEvents].forEach(event => {
        eventTypeCount[event.type] = (eventTypeCount[event.type] || 0) + 1;
      });

      // Calculer la participation moyenne
      const participationRates = pastEvents
        .filter(e => e.participants)
        .map(e => (e.participants.length / activeUsers.length) * 100);

      const averageAttendance = participationRates.length
        ? participationRates.reduce((a, b) => a + b, 0) / participationRates.length
        : 0;

      setStats({
        users: {
          total: usersData.length,
          active: activeUsers.length,
          byRole: roleCount,
          recentlyJoined: recentUsers
        },
        events: {
          total: upcomingEvents.length + pastEvents.length,
          upcoming: upcomingEvents.length,
          past: pastEvents.length,
          byType: eventTypeCount,
          mostPopular: pastEvents
            .sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0))
            .slice(0, 5)
        },
        participation: {
          averageAttendance: Math.round(averageAttendance * 10) / 10,
          topAttendees: [] // TODO: Implémenter le calcul des membres les plus assidus
        }
      });
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Chargement des statistiques...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Statistiques</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Statistiques des membres */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Membres</h2>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {stats.users.total}
              </div>
              <div className="text-sm text-gray-500">Membres au total</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-green-600">
                {stats.users.active}
              </div>
              <div className="text-sm text-gray-500">Membres actifs</div>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Par rôle</h3>
              {Object.entries(stats.users.byRole).map(([role, count]) => (
                <div key={role} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques des événements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Événements</h2>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {stats.events.total}
              </div>
              <div className="text-sm text-gray-500">Événements au total</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xl font-semibold text-blue-600">
                  {stats.events.upcoming}
                </div>
                <div className="text-sm text-gray-500">À venir</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-600">
                  {stats.events.past}
                </div>
                <div className="text-sm text-gray-500">Passés</div>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Par type</h3>
              {Object.entries(stats.events.byType).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques de participation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Participation</h2>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {stats.participation.averageAttendance}%
              </div>
              <div className="text-sm text-gray-500">Participation moyenne</div>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Événements populaires</h3>
              {stats.events.mostPopular.map(event => (
                <div key={event.id} className="text-sm mb-2">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-gray-500">
                    {event.participants?.length || 0} participants
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nouveaux membres */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Nouveaux Membres</h2>
          <div className="space-y-3">
            {stats.users.recentlyJoined.map(user => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="font-medium">
                    {user.displayName || user.email}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(user.createdAt.seconds * 1000).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                  {user.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;