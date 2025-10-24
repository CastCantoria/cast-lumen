// src/components/Dashboard/AdminPanel.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminPanel = () => {
  const { userProfile } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Administration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Gestion des Utilisateurs</h3>
          <p className="text-blue-600 text-sm">
            Gérez les membres, leurs rôles et permissions
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="text-3xl mb-3">🎭</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Événements</h3>
          <p className="text-green-600 text-sm">
            Organisez concerts et activités
          </p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="text-3xl mb-3">📜</div>
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Répertoire</h3>
          <p className="text-purple-600 text-sm">
            Gérez le catalogue des chants
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Panneau d'administration - {userProfile?.role === 'super-admin' ? 'Super Admin' : 'Admin'}
        </h3>
        <p className="text-gray-600 mb-4">
          Bienvenue dans votre espace d'administration. Utilisez les onglets ci-dessus pour accéder aux différentes sections de gestion.
        </p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <p>✅ Accès complet aux fonctionnalités administratives</p>
          <p>✅ Gestion des utilisateurs et permissions</p>
          <p>✅ Configuration de l'application</p>
          {userProfile?.role === 'super-admin' && (
            <p>✅ Droits super-administrateur étendus</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;