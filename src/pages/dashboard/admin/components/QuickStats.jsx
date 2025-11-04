import React from 'react';
import { usePermissions } from '../../../../services/permissionService';

const QuickStats = () => {
  const { hasPermission } = usePermissions();

  const stats = {
    totalMembers: 45,
    activeEvents: 3,
    pendingRequests: 2,
    storageUsed: '1.2/5GB'
  };

  const recentActivity = [
    { action: 'Nouveau membre inscrit', user: 'Jean Dupont', time: '2 min ago' },
    { action: 'Événement créé', user: 'Admin', time: '1 hour ago' },
    { action: 'Partition uploadée', user: 'Marie Martin', time: '2 hours ago' }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Aperçu du Tableau de Bord</h2>
      
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl text-blue-600">👥</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalMembers}</div>
              <div className="text-sm text-gray-600">Membres total</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl text-green-600">🎭</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.activeEvents}</div>
              <div className="text-sm text-gray-600">Événements actifs</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl text-yellow-600">⏳</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</div>
              <div className="text-sm text-gray-600">Demandes en attente</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl text-purple-600">💾</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.storageUsed}</div>
              <div className="text-sm text-gray-600">Stockage utilisé</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">📋 Activités Récentes</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-sm text-blue-600">👤</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-500">par {activity.user}</div>
                </div>
                <div className="text-sm text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">🚀 Actions Rapides</h3>
          <div className="space-y-3">
            {hasPermission('events:manage') && (
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-left flex items-center">
                <span className="mr-3">🎭</span>
                Créer un nouvel événement
              </button>
            )}
            
            {hasPermission('members:manage') && (
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-left flex items-center">
                <span className="mr-3">👥</span>
                Gérer les membres
              </button>
            )}
            
            {hasPermission('content:manage') && (
              <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors text-left flex items-center">
                <span className="mr-3">📝</span>
                Publier du contenu
              </button>
            )}
            
            <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors text-left flex items-center">
              <span className="mr-3">📊</span>
              Voir les rapports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;