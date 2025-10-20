import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { statsService } from '../../services/statsService';

const AdminDashboard = () => {
  const { currentUser, userRole } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statistics = await statsService.getAllStatistics();
      setStats(statistics);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cast-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p>{error}</p>
          <button 
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-cast-green text-white rounded-lg hover:bg-cast-gold"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* En-tête */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Tableau de Bord Administrateur
                </h1>
                <p className="text-gray-600">
                  Bienvenue, {currentUser?.firstName || currentUser?.email} 
                  <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {userRole}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl mb-2">👑</div>
                <p className="text-sm text-gray-500">Super Administrateur</p>
              </div>
            </div>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Membres */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Membres</h3>
              <p className="text-3xl font-bold text-cast-green">{stats?.totalUsers || 0}</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats?.userStats?.member || 0} choristes actifs
              </p>
            </div>

            {/* Événements */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Événements</h3>
              <p className="text-3xl font-bold text-cast-green">{stats?.activeEvents || 0}</p>
              <p className="text-sm text-gray-500 mt-2">{stats?.eventCount?.upcoming || 0} à venir</p>
            </div>

            {/* Revenus */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenus</h3>
              <p className="text-3xl font-bold text-cast-green">
                {stats?.totalRevenue ? `${stats.totalRevenue} €` : '0 €'}
              </p>
              <p className="text-sm text-gray-500 mt-2">{stats?.monthlyRevenue?.month}</p>
            </div>

            {/* Inscriptions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inscriptions</h3>
              <p className="text-3xl font-bold text-cast-green">{stats?.monthlyRegistrations?.total || 0}</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats?.monthlyRegistrations?.confirmed || 0} confirmées
              </p>
            </div>
          </div>

          {/* Détails des statistiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Répartition des rôles */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Répartition des Rôles</h2>
              <div className="space-y-3">
                {stats?.userStats && Object.entries(stats.userStats).map(([role, count]) => {
                  if (role !== 'total' && count > 0) {
                    return (
                      <div key={role} className="flex justify-between items-center">
                        <span className="capitalize">{role.replace('_', ' ')}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Événements récents */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Événements Récents</h2>
              <div className="space-y-3">
                {stats?.recentEvents && stats.recentEvents.length > 0 ? (
                  stats.recentEvents.map(event => (
                    <div key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {event.date?.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-cast-green text-white rounded text-sm">
                        {event.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">Aucun événement récent</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;