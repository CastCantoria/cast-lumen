import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const quickActions = [
    {
      id: 'admins',
      icon: '🛡️',
      title: 'Gérer les Admins',
      description: 'Ajouter/modifier administrateurs',
      path: '/admin/users',
      roles: ['super-admin']
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: 'Paramètres Système',
      description: 'Configuration plateforme',
      path: '/super-admin',
      roles: ['super-admin', 'admin']
    },
    {
      id: 'logs',
      icon: '📊',
      title: 'Logs & Analytics',
      description: 'Suivi et statistiques',
      path: '/super-admin',
      roles: ['super-admin', 'admin']
    }
  ];

  const contentManagement = [
    {
      id: 'users',
      icon: '👥',
      title: 'Utilisateurs',
      description: 'Gérer les membres',
      path: '/admin/users',
      roles: ['super-admin', 'admin']
    },
    {
      id: 'events',
      icon: '🎭',
      title: 'Événements',
      description: 'Concerts & activités',
      path: '/admin/events',
      roles: ['super-admin', 'admin']
    },
    {
      id: 'repertoire',
      icon: '📜',
      title: 'Répertoire',
      description: 'Chants & partitions',
      path: '/admin/repertoire',
      roles: ['super-admin', 'admin']
    }
  ];

  const hasAccess = (item) => {
    return item.roles.includes(userProfile?.role);
  };

  const NavigationSection = ({ title, icon, items }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-xl mr-2">{icon}</span>
        {title}
      </h3>
      <div className="space-y-2">
        {items.filter(hasAccess).map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-cast-green text-white shadow-md transform scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{item.title}</div>
                <div className={`text-xs ${
                  isActive(item.path) ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </div>
              {isActive(item.path) && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0 overflow-y-auto pt-20 sidebar-scroll">
      <div className="p-6">
        {/* En-tête utilisateur */}
        <div className="mb-8 p-4 bg-gradient-to-r from-cast-green to-cast-gold rounded-lg text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold">
              {userProfile?.displayName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm truncate">
                {userProfile?.displayName || 'Administrateur'}
              </div>
              <div className="text-xs opacity-90 capitalize">
                {userProfile?.role || 'admin'}
                {userProfile?.role === 'super-admin' && ' 👑'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <NavigationSection 
          title="Actions Rapides" 
          icon="🚀" 
          items={quickActions} 
        />
        
        <NavigationSection 
          title="Gestion du Contenu" 
          icon="📁" 
          items={contentManagement} 
        />

        {/* Retour au tableau de bord */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200 flex items-center space-x-3"
          >
            <span className="text-xl">🏠</span>
            <div>
              <div className="font-medium text-sm">Tableau de Bord</div>
              <div className="text-xs text-blue-600">Retour à l'accueil</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;