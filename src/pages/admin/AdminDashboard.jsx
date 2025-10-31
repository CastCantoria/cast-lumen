// src/pages/dashboard/admin/AdminDashboard.jsx
import React from "react";
import { useAuth } from "../../../contexts/AuthContext";

const AdminDashboard = () => {
  const { userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administration</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-lg mb-2">Bienvenue, <strong>{userProfile?.displayName || 'Administrateur'}</strong> 👋</p>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {userProfile?.role || 'admin'}
                {userProfile?.role === 'super-admin' && ' 👑'}
              </span>
              <span className="text-green-600 text-sm">
                Accès complet à toutes les fonctionnalités d'administration
              </span>
            </div>
          </div>

          {/* Cartes de statistiques */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span>📈</span> Aperçu de la Plateforme
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-gray-600 font-medium">Utilisateurs</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">0</div>
                <div className="text-gray-600 font-medium">Événements</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-gray-600 font-medium">Morceaux</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-gray-600 font-medium">Admins</div>
              </div>
            </div>
          </div>

          {/* Guide rapide */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span>💡</span> Guide Rapide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">Gestion Utilisateurs</h3>
                <p className="text-gray-600 text-sm">
                  Ajoutez, modifiez ou supprimez des utilisateurs et gérez leurs permissions.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">Événements</h3>
                <p className="text-gray-600 text-sm">
                  Créez et organisez des concerts, répétitions et autres activités.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">Répertoire</h3>
                <p className="text-gray-600 text-sm">
                  Gérez le catalogue musical avec partitions et informations détaillées.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">Administration</h3>
                <p className="text-gray-600 text-sm">
                  Configurez les paramètres système et surveillez l'activité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;