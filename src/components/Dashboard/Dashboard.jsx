// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import EventManagement from './EventManagement';
import RepertoireManagement from './RepertoireManagement';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirection automatique selon le rôle
  useEffect(() => {
    if (!userProfile) return;

    const currentPath = location.pathname;
    
    // Si l'utilisateur est sur /dashboard mais n'a pas le bon rôle, rediriger
    if (currentPath === '/dashboard') {
      if (userProfile.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (userProfile.role === 'super-admin') {
        navigate('/super-admin', { replace: true });
      }
    }
    
    // Si l'utilisateur est sur /admin ou /super-admin mais n'a pas le bon rôle, rediriger vers /dashboard
    if ((currentPath.startsWith('/admin') || currentPath.startsWith('/super-admin')) && 
        !['admin', 'super-admin'].includes(userProfile.role)) {
      navigate('/dashboard', { replace: true });
    }
  }, [userProfile, navigate, location]);

  // Définition des onglets disponibles selon le rôle
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'overview', label: '📊 Tableau de Bord', icon: '📊', component: DashboardOverview },
      { id: 'users', label: '👥 Utilisateurs', icon: '👥', component: UserManagement },
      { id: 'events', label: '🎭 Événements', icon: '🎭', component: EventManagement },
      { id: 'repertoire', label: '📜 Répertoire', icon: '📜', component: RepertoireManagement },
    ];

    if (!userProfile) return [];

    switch (userProfile.role) {
      case 'super-admin':
      case 'admin':
        return allTabs;
      case 'membre':
        return allTabs.filter(tab => 
          ['overview', 'events', 'repertoire'].includes(tab.id)
        );
      default:
        return [allTabs[0]]; // seulement overview
    }
  };

  const availableTabs = getAvailableTabs();
  const ActiveComponent = availableTabs.find(tab => tab.id === activeTab)?.component || DashboardOverview;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* En-tête fixe */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo et titre */}
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-cast-green">
                {userProfile?.role === 'super-admin' ? 'Super Admin' : 
                 userProfile?.role === 'admin' ? 'Administration' : 
                 'Espace Membre'} C.A.S.T.
              </h1>
              <span className="bg-cast-green text-white px-2 py-1 rounded-full text-xs capitalize">
                {userProfile?.role || 'public'}
              </span>
            </div>
            
            {/* Informations utilisateur */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Bonjour, <strong>{userProfile?.displayName || 'Utilisateur'}</strong>
              </span>
              <div className="w-8 h-8 bg-cast-green rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userProfile?.displayName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>

          {/* Navigation par onglets */}
          <nav className="flex space-x-1 overflow-x-auto pb-2">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-cast-green text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;