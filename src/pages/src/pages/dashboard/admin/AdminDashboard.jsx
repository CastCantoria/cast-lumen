import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

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
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          </div>
          <p className="text-lg mb-4">Bienvenue, administrateur <strong>{userProfile?.displayName}</strong>!</p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p>Interface d'administration en cours de développement...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
