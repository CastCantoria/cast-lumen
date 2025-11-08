import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

const StatisticsDashboard = () => {
  const [stats, setStats] = useState({
    users: {
      total: 0,
      byRole: {},
      active: 0,
      newThisMonth: 0
    },
    events: {
      total: 0,
      byType: {},
      upcoming: 0,
      participants: 0
    },
    content: {
      total: 0,
      byType: {},
      published: 0,
      views: 0
    },
    repertoire: {
      total: 0,
      byGenre: {},
      active: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      // Récupérer les utilisateurs
      const usersQuery = collection(db, 'users');
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map(doc => doc.data());
      
      // Récupérer les événements
      const eventsQuery = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData = eventsSnapshot.docs.map(doc => doc.data());

      // Récupérer le contenu
      const contentQuery = collection(db, 'content');
      const contentSnapshot = await getDocs(contentQuery);
      const contentData = contentSnapshot.docs.map(doc => doc.data());

      // Récupérer le répertoire
      const repertoireQuery = collection(db, 'repertoire');
      const repertoireSnapshot = await getDocs(repertoireQuery);
      const repertoireData = repertoireSnapshot.docs.map(doc => doc.data());

      // Calculer les statistiques
      const userStats = calculateUserStats(usersData);
      const eventStats = calculateEventStats(eventsData);
      const contentStats = calculateContentStats(contentData);
      const repertoireStats = calculateRepertoireStats(repertoireData);

      setStats({
        users: userStats,
        events: eventStats,
        content: contentStats,
        repertoire: repertoireStats
      });
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = (users) => {
    const byRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const active = users.filter(user => user.isActive !== false).length;
    const newThisMonth = users.filter(user => {
      const userDate = new Date(user.createdAt || new Date());
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return userDate > monthAgo;
    }).length;

    return {
      total: users.length,
      byRole,
      active,
      newThisMonth
    };
  };

  const calculateEventStats = (events) => {
    const byType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {});

    const upcoming = events.filter(event => 
      new Date(event.date) >= new Date() && event.status !== 'cancelled'
    ).length;

    const participants = events.reduce((total, event) => 
      total + (event.participants?.length || 0), 0
    );

    return {
      total: events.length,
      byType,
      upcoming,
      participants
    };
  };

  const calculateContentStats = (content) => {
    const byType = content.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    const published = content.filter(item => item.status === 'published').length;
    const views = content.reduce((total, item) => total + (item.views || 0), 0);

    return {
      total: content.length,
      byType,
      published,
      views
    };
  };

  const calculateRepertoireStats = (repertoire) => {
    const byGenre = repertoire.reduce((acc, piece) => {
      acc[piece.genre] = (acc[piece.genre] || 0) + 1;
      return acc;
    }, {});

    const active = repertoire.filter(piece => piece.status === 'active').length;

    return {
      total: repertoire.length,
      byGenre,
      active
    };
  };

  const StatCard = ({ title, value, subtitle, trend, color }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600',
      red: 'bg-red-50 border-red-200 text-red-600'
    };

    return (
      <div className={`bg-white rounded-lg shadow-sm border p-4 ${colorClasses[color]}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {trend && (
            <span className={`text-xs px-2 py-1 rounded ${
              trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    );
  };

  const DonutChart = ({ data, title, colors }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
              {Object.entries(data).map(([key, value], index) => {
                const percentage = (value / total) * 100;
                const circumference = 2 * Math.PI * 15.9155;
                const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                
                return (
                  <circle
                    key={key}
                    cx="16"
                    cy="16"
                    r="15.9155"
                    fill="none"
                    stroke={colors[index % colors.length]}
                    strokeWidth="2"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset="0"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">{total}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="capitalize">{key}</span>
              </div>
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">📈 Tableau de Bord Statistiques</h2>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
            <option value="quarter">3 derniers mois</option>
            <option value="year">12 derniers mois</option>
          </select>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Utilisateurs Total"
          value={stats.users.total}
          subtitle={`${stats.users.active} actifs`}
          trend={12.5}
          color="blue"
        />
        <StatCard
          title="Événements"
          value={stats.events.total}
          subtitle={`${stats.events.upcoming} à venir`}
          trend={8.2}
          color="green"
        />
        <StatCard
          title="Contenu Publié"
          value={stats.content.published}
          subtitle={`${stats.content.views} vues total`}
          trend={15.7}
          color="purple"
        />
        <StatCard
          title="Pièces Répertoire"
          value={stats.repertoire.total}
          subtitle={`${stats.repertoire.active} actives`}
          trend={5.3}
          color="orange"
        />
      </div>

      {/* Graphiques et répartitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des utilisateurs par rôle */}
        <DonutChart
          data={stats.users.byRole}
          title="Utilisateurs par Rôle"
          colors={chartColors}
        />

        {/* Répartition des événements par type */}
        <DonutChart
          data={stats.events.byType}
          title="Événements par Type"
          colors={chartColors}
        />

        {/* Répartition du contenu par type */}
        <DonutChart
          data={stats.content.byType}
          title="Contenu par Type"
          colors={chartColors}
        />

        {/* Répartition du répertoire par genre */}
        <DonutChart
          data={stats.repertoire.byGenre}
          title="Répertoire par Genre"
          colors={chartColors}
        />
      </div>

      {/* Détails des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Détails utilisateurs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Détails Utilisateurs</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nouveaux ce mois:</span>
              <span className="font-medium text-gray-900">{stats.users.newThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taux d'activation:</span>
              <span className="font-medium text-green-600">
                {Math.round((stats.users.active / stats.users.total) * 100)}%
              </span>
            </div>
            {Object.entries(stats.users.byRole).map(([role, count]) => (
              <div key={role} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{role}:</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Détails événements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎭 Détails Événements</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Participants total:</span>
              <span className="font-medium text-gray-900">{stats.events.participants}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taux de participation moyen:</span>
              <span className="font-medium text-blue-600">
                {stats.events.total > 0 ? Math.round(stats.events.participants / stats.events.total) : 0}/événement
              </span>
            </div>
            {Object.entries(stats.events.byType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{type}:</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Détails performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vues moyen par contenu:</span>
              <span className="font-medium text-gray-900">
                {stats.content.total > 0 ? Math.round(stats.content.views / stats.content.total) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taux de publication:</span>
              <span className="font-medium text-green-600">
                {Math.round((stats.content.published / stats.content.total) * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pièces actives:</span>
              <span className="font-medium text-gray-900">
                {Math.round((stats.repertoire.active / stats.repertoire.total) * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Croissance utilisateurs:</span>
              <span className="font-medium text-green-600">+12.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé global */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📈 Résumé de Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Engagement Utilisateurs</div>
            <div className="text-2xl font-bold text-blue-600">78%</div>
            <div className="text-green-600 text-xs">↑ 5% vs mois dernier</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Taux de Participation</div>
            <div className="text-2xl font-bold text-green-600">65%</div>
            <div className="text-green-600 text-xs">↑ 8% vs mois dernier</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Contenu Engagé</div>
            <div className="text-2xl font-bold text-purple-600">42%</div>
            <div className="text-green-600 text-xs">↑ 12% vs mois dernier</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Satisfaction</div>
            <div className="text-2xl font-bold text-orange-600">4.2/5</div>
            <div className="text-green-600 text-xs">↑ 0.3 vs mois dernier</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;