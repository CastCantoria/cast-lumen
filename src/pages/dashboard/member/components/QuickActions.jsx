import React from 'react';
import { usePermissions } from '../../../../services/permissionService';

const QuickActions = () => {
  const { hasPermission } = usePermissions();

  const quickActions = [
    {
      id: 1,
      title: 'Voir le planning',
      description: 'Consulter les prochains événements',
      icon: '📅',
      path: '/dashboard/schedule',
      permission: 'schedule:view'
    },
    {
      id: 2,
      title: 'Mes partitions',
      description: 'Accéder à mon répertoire',
      icon: '🎼',
      path: '/dashboard/partitions',
      permission: 'partitions:view'
    },
    {
      id: 3,
      title: 'Participer aux événements',
      description: 'Confirmer ma présence',
      icon: '🎟️',
      path: '/dashboard/events',
      permission: 'events:rsvp'
    },
    {
      id: 4,
      title: 'Mon profil',
      description: 'Gérer mes informations',
      icon: '👤',
      path: '/dashboard/profile',
      permission: 'profile:update'
    },
    {
      id: 5,
      title: 'Galerie',
      description: 'Photos et vidéos',
      icon: '🖼️',
      path: '/gallery',
      permission: 'gallery:view'
    },
    {
      id: 6,
      title: 'Documents',
      description: 'Ressources partagées',
      icon: '📁',
      path: '/documents',
      permission: 'documents:access'
    }
  ];

  const recentActivity = [
    { action: 'Répétition confirmée', time: 'Il y a 2 heures', type: 'event' },
    { action: 'Nouvelle partition ajoutée', time: 'Il y a 1 jour', type: 'partition' },
    { action: 'Photo de concert partagée', time: 'Il y a 2 jours', type: 'gallery' }
  ];

  const availableActions = quickActions.filter(action => 
    !action.permission || hasPermission(action.permission)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Actions rapides */}
      <div className="lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableActions.map((action) => (
            <a
              key={action.id}
              href={action.path}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-300 group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-xl">{action.icon}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-sm text-gray-500">{action.description}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Activité récente */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Activité Récente</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                  activity.type === 'event' ? 'bg-green-100' :
                  activity.type === 'partition' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <span className={`text-sm ${
                    activity.type === 'event' ? 'text-green-600' :
                    activity.type === 'partition' ? 'text-blue-600' : 'text-purple-600'
                  }`}>
                    {activity.type === 'event' ? '🎭' :
                     activity.type === 'partition' ? '🎼' : '🖼️'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Statistiques personnelles */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Ma semaine</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-sm font-bold text-blue-600">2</div>
                <div className="text-xs text-blue-800">Événements</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <div className="text-sm font-bold text-green-600">5</div>
                <div className="text-xs text-green-800">Partitions</div>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <div className="text-sm font-bold text-purple-600">3h</div>
                <div className="text-xs text-purple-800">Pratique</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;