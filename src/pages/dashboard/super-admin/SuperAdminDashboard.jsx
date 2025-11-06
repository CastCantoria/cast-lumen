import React, { useState, useEffect } from 'react';
import { usePermissions } from '../../../services/permissionService';
import PlatformSettings from './components/PlatformSettings';
import UserManagement from './components/UserManagement';
import SystemAnalytics from './components/SystemAnalytics';
import BackupRestore from './components/BackupRestore';

const SuperAdminDashboard = () => {
  const { hasPermission, userProfile } = usePermissions();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeAdmins: 0,
    storageUsed: '0 MB',
    systemHealth: 'optimal'
  });

  // 🔐 Vérification des permissions SUPER ADMIN
  if (!hasPermission('platform:manage')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Refusé</h1>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
          </p>
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au tableau de bord
          </a>
        </div>
      </div>
    );
  }

  // 🧭 Définition des onglets
  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: '📊', component: SystemAnalytics },
    { id: 'platform', name: 'Plateforme', icon: '⚙️', component: PlatformSettings },
    { id: 'users', name: 'Utilisateurs', icon: '👥', component: UserManagement },
    { id: 'backup', name: 'Sauvegarde', icon: '💾', component: BackupRestore },
    { id: 'analytics', name: 'Analytics', icon: '📈', component: SystemAnalytics },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;
    return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎨 Header Super Admin */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Super Admin Dashboard</h1>
              <p className="text-purple-200 mt-1">Administration complète de la plateforme C.A.S.T.</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                <span className="mr-2">👑</span>
                SUPER ADMIN
              </span>
              <div className="text-right">
                <p className="text-sm text-purple-200">Connecté en tant que</p>
                <p className="font-semibold">{userProfile?.displayName || userProfile?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 Navigation par onglets */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="flex overflow-x-auto px-4 sm:px-6 lg:px-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
            {/* 📊 Statistiques système */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeAdmins}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💾</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stockage utilisé</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.storageUsed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">❤️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Santé système</p>
                <p className="text-2xl font-bold text-green-600 capitalize">{systemStats.systemHealth}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🧱 Composant actif selon l'onglet */}
        <div className="bg-white rounded-lg shadow">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;