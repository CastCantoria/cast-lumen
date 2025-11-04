import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const { userProfile, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: '📊' },
    { name: 'Membres', href: '/admin/members', icon: '👥' },
    { name: 'Événements', href: '/admin/events', icon: '🎭' },
    { name: 'Contenu', href: '/admin/content', icon: '📝' },
    { name: 'Répertoire', href: '/admin/repertoire', icon: '🎼' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-900 to-teal-900 shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-blue-700">
            <div className="text-white font-bold text-xl">C.A.S.T. Admin</div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-blue-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {userProfile?.displayName || 'Administrateur'}
                </p>
                <p className="text-xs text-blue-200">admin</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full mt-4 bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;