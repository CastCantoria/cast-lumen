import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import EventManagement from './EventManagement';
import RepertoireManagement from './RepertoireManagement';
import Profile from '../../pages/private/Profile';
import AdminPanel from './AdminPanel';

const Dashboard = () => {
  const { userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // Définition des onglets disponibles selon le rôle
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'overview', label: 'Tableau de Bord', icon: '📊', component: DashboardOverview },
      { id: 'users', label: 'Utilisateurs', icon: '👥', component: UserManagement },
      { id: 'events', label: 'Événements', icon: '🎭', component: EventManagement },
      { id: 'repertoire', label: 'Répertoire', icon: '📜', component: RepertoireManagement },
      { id: 'profile', label: 'Mon Profil', icon: '👤', component: Profile },
    ];

    // Ajouter l'administration pour les admins et super-admins
    if (userProfile?.role === 'admin' || userProfile?.role === 'super-admin') {
      allTabs.push({ id: 'admin', label: 'Administration', icon: '⚙️', component: AdminPanel });
    }

    // Filtrer selon le rôle
    if (!userProfile) return [];

    switch (userProfile.role) {
      case 'super-admin':
      case 'admin':
        return allTabs;
      case 'membre':
        return allTabs.filter(tab => 
          ['overview', 'events', 'repertoire', 'profile'].includes(tab.id)
        );
      default:
        return [allTabs[0], allTabs[4]]; // overview + profile
    }
  };

  const availableTabs = getAvailableTabs();
  const ActiveComponent = availableTabs.find(tab => tab.id === activeTab)?.component || DashboardOverview;

  // Fonction pour obtenir le titre du dashboard selon le rôle
  const getDashboardTitle = () => {
    switch (userProfile?.role) {
      case 'super-admin':
        return 'Super Administration C.A.S.T.';
      case 'admin':
        return 'Administration C.A.S.T.';
      case 'membre':
        return 'Espace Membre C.A.S.T.';
      default:
        return 'Tableau de Bord C.A.S.T.';
    }
  };

  // Fonction pour obtenir le titre du rôle
  const getRoleTitle = () => {
    switch (userProfile?.role) {
      case 'super-admin':
        return 'Super Administrateur';
      case 'admin':
        return 'Administrateur';
      case 'membre':
        return 'Membre';
      default:
        return 'Visiteur';
    }
  };

  // Fonction pour obtenir l'initiale de l'utilisateur
  const getUserInitial = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName.charAt(0).toUpperCase();
    }
    if (userProfile?.email) {
      return userProfile.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileDropdown(false);
      // La redirection est gérée dans le AuthContext
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* En-tête fixe amélioré avec dropdown simplifié */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Première ligne : Titre et informations utilisateur */}
          <div className="flex justify-between items-center py-4 border-b border-gray-100">
            {/* Titre et rôle */}
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-cast-green">
                {getDashboardTitle()}
              </h1>
              <span className="bg-cast-green text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                {userProfile?.role || 'public'}
              </span>
            </div>
            
            {/* Informations utilisateur avec dropdown SIMPLIFIÉ */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    Bonjour, {userProfile?.displayName || 'Utilisateur'}
                  </div>
                  <div className="text-xs text-cast-green font-semibold">
                    {getRoleTitle()} C.A.S.T.
                  </div>
                </div>
                <div className="w-12 h-12 bg-cast-green rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
                  {getUserInitial()}
                </div>
              </button>

              {/* Dropdown SIMPLIFIÉ - SEULEMENT DÉCONNEXION */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <span className="mr-3 text-lg">🚪</span>
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Deuxième ligne : Navigation par onglets RESPONSIVE */}
          <nav className="py-3">
            <div className="flex flex-wrap gap-2">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all min-w-[100px] ${
                    activeTab === tab.id
                      ? 'bg-cast-green text-white shadow-md transform scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg mb-1">{tab.icon}</span>
                  <span className="text-xs text-center leading-tight">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
          <ActiveComponent />
        </div>
      </main>

      {/* Overlay pour fermer le dropdown en cliquant à l'extérieur */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;