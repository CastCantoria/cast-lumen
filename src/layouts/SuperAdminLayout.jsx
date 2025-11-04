// src/layouts/SuperAdminLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SuperAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/super-admin/dashboard', label: 'Tableau de Bord', icon: '📊' },
    { path: '/super-admin/user-management', label: 'Gestion Utilisateurs', icon: '👥' },
    { path: '/super-admin/platform-settings', label: 'Paramètres Plateforme', icon: '⚙️' },
    { path: '/super-admin/system-analytics', label: 'Analytics Système', icon: '📈' },
    { path: '/super-admin/backup-restore', label: 'Sauvegarde & Restauration', icon: '💾' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="super-admin-layout min-h-screen bg-gray-50 flex">
      {/* Sidebar pour desktop - Toujours visible */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gray-900">Super Admin</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                          isActive(item.path)
                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Contenu principal avec marge pour la sidebar */}
      <div className="flex-1 lg:ml-64">
        {/* Header mobile seulement */}
        <div className="lg:hidden">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <span className="text-2xl">☰</span>
            </button>
            <div className="flex flex-1 gap-x-4 self-stretch">
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-gray-900">Super Admin</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar mobile (overlay) */}
        {sidebarOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50">
              {/* Overlay sombre */}
              <div 
                className="fixed inset-0 bg-gray-900/80" 
                onClick={() => setSidebarOpen(false)}
              />
              
              {/* Sidebar mobile */}
              <div className="fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex items-center justify-between h-16">
                  <h1 className="text-xl font-bold text-gray-900">Super Admin</h1>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Fermer le menu</span>
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                <nav className="mt-8">
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                            isActive(item.path)
                              ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Contenu de la page - TOUJOURS VISIBLE */}
        <main className="min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;