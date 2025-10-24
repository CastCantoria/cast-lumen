import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardOverview = () => {
  const { userProfile } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Vue d'ensemble</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Statistiques</h3>
          <p className="text-blue-600">Vue d'ensemble des activités</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Activités récentes</h3>
          <p className="text-green-600">Dernières actions sur la plateforme</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Votre rôle</h3>
          <p className="text-purple-600 capitalize">{userProfile?.role || 'public'}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Bienvenue sur votre dashboard, {userProfile?.displayName || 'Cher membre'} !
        </h3>
        <p className="text-gray-600">
          Utilisez les onglets ci-dessus pour naviguer entre les différentes sections de gestion.
        </p>
      </div>
    </div>
  );
};

export default DashboardOverview;