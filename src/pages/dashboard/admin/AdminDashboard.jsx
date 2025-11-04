import React, { useState } from 'react';
import { usePermissions } from '../../../services/permissionService';
import MemberManagement from './components/MemberManagement';
import EventManagement from './components/EventManagement';
import ContentManagement from './components/ContentManagement';
import QuickStats from './components/QuickStats';

const AdminDashboard = () => {
  const { hasPermission, userProfile } = usePermissions();
  const [activeSection, setActiveSection] = useState('overview');

  if (!hasPermission('members:manage')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Refusé</h1>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions d'administration.
          </p>
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à mon espace
          </a>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'overview', name: 'Aperçu', icon: '📊', component: QuickStats },
    { id: 'members', name: 'Membres', icon: '👥', component: MemberManagement },
    { id: 'events', name: 'Événements', icon: '🎭', component: EventManagement },
    { id: 'content', name: 'Contenu', icon: '📝', component: ContentManagement },
  ];

  const ActiveComponent = sections.find(section => section.id === activeSection)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <div className="bg-gradient-to-r from-blue-900 to-teal-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-200 mt-1">Gestion quotidienne de la chorale C.A.S.T.</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-500 text-green-900 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                <span className="mr-2">⚙️</span>
                ADMIN
              </span>
              <div className="text-right">
                <p className="text-sm text-blue-200">Connecté en tant que</p>
                <p className="font-semibold">{userProfile?.displayName || userProfile?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="flex overflow-x-auto px-4 sm:px-6 lg:px-8">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;