import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/NewAuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const SuperAdminDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalMembers: 0,
    totalEvents: 0,
    activeUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Récupérer les statistiques utilisateurs
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => doc.data());
      
      const admins = users.filter(user => user.role === 'admin');
      const members = users.filter(user => user.role === 'membre');
      const activeUsers = users.filter(user => user.isActive);

      setStats({
        totalUsers: users.length,
        totalAdmins: admins.length,
        totalMembers: members.length,
        totalEvents: 0, // À implémenter
        activeUsers: activeUsers.length
      });

      // Activité récente (derniers utilisateurs inscrits)
      const recentUsers = users
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);
      
      setRecentActivity(recentUsers);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Tableau de Bord Super-Admin</h1>
          <p className="text-purple-200">
            Gestion complète de la plateforme C.A.S.T.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.totalUsers}</div>
            <div className="text-gray-600">Utilisateurs Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalAdmins}</div>
            <div className="text-gray-600">Administrateurs</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalMembers}</div>
            <div className="text-gray-600">Membres Actifs</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.totalEvents}</div>
            <div className="text-gray-600">Événements</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-teal-600">{stats.activeUsers}</div>
            <div className="text-gray-600">Utilisateurs Actifs</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section Gestion Utilisateurs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Gestion des Utilisateurs</h2>
            <div className="space-y-4">
              <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition">
                👑 Gérer les Administrateurs
              </button>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                🎵 Gérer les Membres
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition">
                📊 Voir toutes les Statistiques
              </button>
            </div>
          </div>

          {/* Activité Récente */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Activité Récente</h2>
            <div className="space-y-3">
              {recentActivity.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{user.displayName || 'Utilisateur'}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {user.createdAt?.toDate?.()?.toLocaleDateString() || 'Date inconnue'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Système */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Actions Système</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition">
              🔧 Maintenance Système
            </button>
            <button className="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition">
              📋 Logs d'Activité
            </button>
            <button className="bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition">
              ⚙️ Paramètres Avancés
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;