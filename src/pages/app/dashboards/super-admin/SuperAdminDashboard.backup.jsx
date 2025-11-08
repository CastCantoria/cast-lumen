import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// Import des composants de gestion
import UserManagement from "../../admin/UserManagement";
import EventManagement from "../../admin/EventManagement";
import RepertoireManagement from "../../admin/RepertoireManagement";

const SuperAdminDashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Détermine la section active basée sur l'URL
  useEffect(() => {
    if (location.pathname.includes('/admin/users') || location.pathname === '/admin/users') {
      setActiveSection('users');
    } else if (location.pathname.includes('/admin/events') || location.pathname === '/admin/events') {
      setActiveSection('events');
    } else if (location.pathname.includes('/admin/repertoire') || location.pathname === '/admin/repertoire') {
      setActiveSection('repertoire');
    } else {
      setActiveSection('dashboard');
    }
  }, [location.pathname]);

  const navigationItems = [
    {
      id: 'dashboard',
      icon: '📊',
      title: 'Tableau de Bord',
      path: '/dashboard',
      description: 'Vue d\'ensemble'
    },
    {
      id: 'users',
      icon: '👥',
      title: 'Utilisateurs',
      path: '/admin/users',
      description: 'Gérer les membres'
    },
    {
      id: 'events',
      icon: '🎭',
      title: 'Événements',
      path: '/admin/events',
      description: 'Concerts & activités'
    },
    {
      id: 'repertoire',
      icon: '📜',
      title: 'Répertoire',
      path: '/admin/repertoire',
      description: 'Chants & partitions'
    }
  ];

  const handleNavigation = (item) => {
    setActiveSection(item.id);
    navigate(item.path);
    setMobileMenuOpen(false);
  };

  // Composant Dashboard Home
  const DashboardHome = () => (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Tableau de Bord Administration
        </h1>
        <p className="text-gray-600 text-lg">
          Bienvenue, {userProfile?.displayName || 'Administrateur'} 👋
        </p>
        <div className="flex items-center mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <span className="bg-green-600 text-white py-1 px-3 rounded-full text-sm font-semibold">
            {userProfile?.role || 'admin'}
            {userProfile?.role === 'super-admin' && ' 👑'}
          </span>
          <span className="ml-3 text-green-700 text-sm">
            Accès complet à toutes les fonctionnalités d'administration
          </span>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">📈</span>
          Aperçu de la Plateforme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-gray-600 font-medium mt-2">Utilisateurs</div>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <div className="text-3xl font-bold text-red-600">0</div>
            <div className="text-gray-600 font-medium mt-2">Événements</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-gray-600 font-medium mt-2">Morceaux</div>
          </div>
          <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-3xl font-bold text-orange-600">0</div>
            <div className="text-gray-600 font-medium mt-2">Admins</div>
          </div>
        </div>
      </div>

      {/* Guide rapide */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">💡</span>
          Guide Rapide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-green-600 mb-3 text-lg">Gestion Utilisateurs</h3>
            <p className="text-gray-600">
              Ajoutez, modifiez ou supprimez des utilisateurs et gérez leurs permissions
            </p>
          </div>
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-green-600 mb-3 text-lg">Événements</h3>
            <p className="text-gray-600">
              Créez et organisez des concerts, répétitions et autres activités.
            </p>
          </div>
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-green-600 mb-3 text-lg">Répertoire</h3>
            <p className="text-gray-600">
              Gérez le catalogue musical avec partitions et informations détaillées.
            </p>
          </div>
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-green-600 mb-3 text-lg">Administration</h3>
            <p className="text-gray-600">
              Configurez les paramètres système et surveillez l'activité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar responsive
  const Sidebar = () => (
    <>
      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* En-tête */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {userProfile?.displayName?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">
                  {userProfile?.displayName || 'Administrateur'}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {userProfile?.role || 'admin'}
                  {userProfile?.role === 'super-admin' && ' 👑'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation principale */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 group ${
                  activeSection === item.id
                    ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}>
                <span className={`text-xl transition-transform ${
                  activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.title}</div>
                  <div className={`text-xs ${
                    activeSection === item.id ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );

  // Contenu principal basé sur la section active
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome />;
      case 'users':
        return <UserManagement />;
      case 'events':
        return <EventManagement />;
      case 'repertoire':
        return <RepertoireManagement />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        {/* Header mobile */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <span className="text-2xl">☰</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                {navigationItems.find(item => item.id === activeSection)?.title || 'Dashboard'}
              </div>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userProfile?.displayName?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
