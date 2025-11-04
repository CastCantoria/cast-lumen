import React, { useState, useEffect } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const SystemAnalytics = () => {
  const { hasPermission } = usePermissions();
  const [analytics, setAnalytics] = useState({
    users: {
      total: 150,
      active: 142,
      newThisMonth: 8
    },
    performance: {
      responseTime: '120ms',
      uptime: '99.9%',
      storage: '2.3/10GB'
    },
    activities: [
      { action: 'Connexion', user: 'user1', time: '2 min ago' },
      { action: 'Upload partition', user: 'user2', time: '5 min ago' },
      { action: 'Création événement', user: 'admin1', time: '10 min ago' }
    ]
  });

  if (!hasPermission('analytics:view_global')) {
    return <div>Accès refusé</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Analytics Système</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Carte Utilisateurs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">👥 Utilisateurs</h3>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-bold">{analytics.users.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Actifs</span>
              <span className="font-bold text-green-600">{analytics.users.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nouveaux (mois)</span>
              <span className="font-bold text-blue-600">{analytics.users.newThisMonth}</span>
            </div>
          </div>
        </div>

        {/* Carte Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">⚡ Performance</h3>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Temps réponse</span>
              <span className="font-bold">{analytics.performance.responseTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Disponibilité</span>
              <span className="font-bold text-green-600">{analytics.performance.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stockage</span>
              <span className="font-bold">{analytics.performance.storage}</span>
            </div>
          </div>
        </div>

        {/* Carte Sécurité */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">🛡️ Sécurité</h3>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Connexions today</span>
              <span className="font-bold">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tentatives échouées</span>
              <span className="font-bold text-red-600">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dernier scan</span>
              <span className="font-bold">2h ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activités récentes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Activités Récentes</h3>
        <div className="space-y-3">
          {analytics.activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">👤</span>
                </div>
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-gray-500">par {activity.user}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;