import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const AdminDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
    activeEvents: 0,
    totalRepertoire: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const members = usersSnapshot.docs.map(doc => doc.data())
        .filter(user => user.role === 'membre');

      setStats({
        totalMembers: members.length,
        pendingRequests: 0, // À implémenter
        activeEvents: 0,    // À implémenter
        totalRepertoire: 0  // À implémenter
      });
    } catch (error) {
      console.error('Erreur chargement dashboard admin:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Tableau de Bord Administrateur</h1>
          <p className="text-blue-200">
            Gestion des membres et activités de C.A.S.T.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalMembers}</div>
            <div className="text-gray-600">Membres Actifs</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.pendingRequests}</div>
            <div className="text-gray-600">Demandes en Attente</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.activeEvents}</div>
            <div className="text-gray-600">Événements Actifs</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.totalRepertoire}</div>
            <div className="text-gray-600">Pièces au Répertoire</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gestion des Membres */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Gestion des Membres</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                👥 Voir tous les Membres
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition">
                ✅ Gérer les Admissions
              </button>
              <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition">
                📧 Envoyer un Message
              </button>
            </div>
          </div>

          {/* Gestion des Événements */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Gestion des Événements</h2>
            <div className="space-y-3">
              <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition">
                🎵 Créer un Événement
              </button>
              <button className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition">
                📅 Calendrier des Concerts
              </button>
              <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition">
                📊 Statistiques de Participation
              </button>
            </div>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition">
              📝 Ajouter une Partition
            </button>
            <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition">
              🖼️ Gérer la Galerie
            </button>
            <button className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition">
              📰 Publier un Article
            </button>
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
              👥 Inviter un Membre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;