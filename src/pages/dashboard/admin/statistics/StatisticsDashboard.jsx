// src/pages/app/dashboards/admin/statistics/StatisticsDashboard.jsx
import React, { useState, useEffect } from 'react';

const StatisticsDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        totalVisits: 1247,
        activeUsers: 89,
        engagementRate: 67,
        newUsers: 23,
        returningUsers: 45,
        popularContent: 'Bienvenue sur C.A.S.T.'
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <span className="text-2xl mr-3">📈</span>
        <h2 className="text-2xl font-bold text-gray-900">Statistiques Avancées</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-2">Visites totales</h3>
          <p className="text-3xl font-bold text-red-600">{stats.totalVisits}</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Taux d'engagement</h3>
          <p className="text-3xl font-bold text-green-600">{stats.engagementRate}%</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Utilisateurs actifs</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.activeUsers}</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Nouveaux utilisateurs</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.newUsers}</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-2">Utilisateurs récurrents</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.returningUsers}</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-900 mb-2">Contenu populaire</h3>
          <p className="text-lg font-bold text-indigo-600 truncate">{stats.popularContent}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Graphiques et Analytics</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600">Les graphiques statistiques seront intégrés ici.</p>
          <p className="text-gray-500 text-sm mt-2">
            Intégration avec Google Analytics ou autre outil d'analyse
          </p>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">
          Les données statistiques complètes seront disponibles prochainement.
        </p>

      </div>
    </div>
  );
};

export default StatisticsDashboard;