import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MemberLayout = ({ children }) => {
  const { userProfile, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Mon Tableau de bord', href: '/dashboard', icon: '🏠' },
    { name: 'Mon Planning', href: '/dashboard/schedule', icon: '📅' },
    { name: 'Mes Partitions', href: '/dashboard/partitions', icon: '🎼' },
    { name: 'Mes Événements', href: '/dashboard/events', icon: '🎟️' },
    { name: 'Mon Profil', href: '/dashboard/profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple pour les membres */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                C.A.S.T.
              </Link>
              <nav className="ml-8 flex space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.displayName || 'Membre'}
                </p>
                <p className="text-xs text-gray-500">membre</p>
              </div>
              <button
                onClick={logout}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default MemberLayout;