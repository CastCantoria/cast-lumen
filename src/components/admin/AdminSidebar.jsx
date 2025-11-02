import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useAuth();
  
  // États simplifiés
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const sidebarRef = useRef(null);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Toggle manuel
  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  // Fermeture au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && 
          !sidebarRef.current.contains(event.target) &&
          !event.target.closest('.sidebar-toggle-btn')) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fermer la sidebar quand on change de route (mobile)
  useEffect(() => {
    if (isMobile) {
      setIsVisible(false);
    }
  }, [location.pathname, isMobile]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const quickActions = [
    {
      id: 'admins',
      icon: '🛡️',
      title: 'Gérer les Admins',
      description: 'Ajouter/modifier administrateurs',
      path: '/dashboard/super-admin/users',
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
      path: '/dashboard/super-admin/users',
      roles: ['super-admin', 'admin']
    },
    {
      id: 'events',
      icon: '🎭',
      title: 'Événements',
      description: 'Concerts & activités',
      path: '/dashboard/super-admin/events',
      roles: ['super-admin', 'admin']
    },
    {
      id: 'repertoire',
      icon: '📜',
      title: 'Répertoire',
      description: 'Chants & partitions',
      path: '/dashboard/super-admin/repertoire',
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
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                setIsVisible(false);
              }
            }}
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
    <>
      {/* Overlay mobile */}
      {isMobile && isVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsVisible(false)}
        />
      )}

      {/* Bouton toggle flèche */}
      <button
        onClick={toggleSidebar}
        className={`sidebar-toggle-btn fixed z-50 transition-all duration-300 ease-in-out ${
          isVisible 
            ? 'left-64 md:left-64' 
            : 'left-4 md:left-4'
        } top-1/2 transform -translate-y-1/2 w-10 h-10 bg-cast-green text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 hover:shadow-xl`}
      >
        <span className={`transform transition-transform duration-300 ${
          isVisible ? 'rotate-180' : 'rotate-0'
        }`}>
          {isVisible ? '◀' : '▶'}
        </span>
      </button>

      {/* Sidebar principale */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ease-in-out overflow-y-auto pt-20 sidebar-scroll
          ${isVisible ? 'translate-x-0' : '-translate-x-full'}
          w-64
        `}
      >
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
              onClick={() => {
                navigate('/dashboard');
                setIsVisible(false);
              }}
              className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200 flex items-center space-x-3"
            >
              <span className="text-xl">🏠</span>
              <div>
                <div className="font-medium text-sm">Tableau de Bord</div>
                <div className="text-xs text-blue-600">Retour à l'accueil</div>
              </div>
            </button>
          </div>

          {/* Bouton de fermeture interne (optionnel) */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsVisible(false)}
              className="w-full text-center p-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Fermer la sidebar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;