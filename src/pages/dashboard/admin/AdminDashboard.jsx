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
          
          <p className="text-lg mb-6">Bienvenue, administrateur <strong>{userProfile?.displayName}</strong>!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-yellow-900">Gestion Utilisateurs</h2>
              <ul className="space-y-2">
                <li>• Voir tous les utilisateurs</li>
                <li>• Modifier les rôles</li>
                <li>• Gérer les permissions</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-red-900">Gestion Contenu</h2>
              <ul className="space-y-2">
                <li>• Créer des événements</li>
                <li>• Modifier le répertoire</li>
                <li>• Gérer les médias</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Statistiques</h2>
              <ul className="space-y-2">
                <li>• Analytics du site</li>
                <li>• Rapports d'activité</li>
                <li>• Performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
