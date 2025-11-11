import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import usePermissions from '../../hooks/usePermissions';

const AdminNavigation = () => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const {
    hasRole,
    canManageGallery,
    canManageArticles,
    canManageUsers,
    canManageEvents,
    canViewAnalytics,
    canManagePartitions,
    canModerateMedia
  } = usePermissions();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const canAccessItem = (item) => {
    if (!item.roles?.length) return true;
    return item.roles.some(role => hasRole(role)) && hasRequiredPermissions(item);
  };

  const hasRequiredPermissions = (item) => {
    if (!item.permissions) return true;
    
    return item.permissions.every(permission => {
      switch (permission) {
        case 'manage_gallery':
          return canManageGallery();
        case 'manage_articles':
          return canManageArticles();
        case 'manage_members':
          return canManageUsers();
        case 'manage_events':
          return canManageEvents();
        case 'manage_partitions':
          return canManagePartitions();
        case 'view_analytics':
          return canViewAnalytics();
        case 'moderate_media':
          return canModerateMedia();
        default:
          return true;
      }
    });
  };

  const navigationItems = [
    // Tableau de bord principal
    {
      id: 'dashboard',
      title: '🏠 Accueil du Site',
      path: '/',
      roles: ['super-admin', 'admin', 'moderator', 'member']
    },
    {
      id: 'super-admin',
      title: '👑 Super-Admin',
      path: '/dashboard/super-admin',
      roles: ['super-admin'],
      permissions: ['manage_policies', 'manage_critical_settings'],
      description: 'Gestion complète de la plateforme C.A.S.T.'
    },

    // Gestion des Membres
    {
      id: 'members-section',
      title: '👥 Gestion des Membres',
      type: 'section',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_members']
    },
    {
      id: 'all-members',
      title: '👥 Voir tous les Membres',
      path: '/dashboard/super-admin/users',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_members'],
      parent: 'members-section'
    },
    {
      id: 'admissions',
      title: '✅ Gérer les Admissions',
      path: '/dashboard/super-admin/admissions',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_admissions'],
      parent: 'members-section'
    },
    {
      id: 'invite-member',
      title: '📧 Inviter un Membre',
      path: '/dashboard/super-admin/invite',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_invitations'],
      parent: 'members-section'
    },

    // Gestion des Événements
    {
      id: 'events-section',
      title: '🎭 Gestion des Événements',
      type: 'section',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_events']
    },
    {
      id: 'create-event',
      title: '🎵 Créer un Événement',
      path: '/dashboard/super-admin/events/create',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_events'],
      parent: 'events-section'
    },
    {
      id: 'event-calendar',
      title: '📅 Calendrier des Concerts',
      path: '/dashboard/super-admin/events/calendar',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_events'],
      parent: 'events-section'
    },
    {
      id: 'event-stats',
      title: '📊 Statistiques de Participation',
      path: '/dashboard/super-admin/events/stats',
      roles: ['super-admin', 'admin'],
      permissions: ['view_analytics', 'manage_events'],
      parent: 'events-section'
    },

    // Contenu & Média
    {
      id: 'content-section',
      title: '📱 Contenu & Média',
      type: 'section',
      roles: ['super-admin', 'admin', 'moderator'],
      permissions: ['manage_content']
    },
    {
      id: 'media-moderation',
      title: '🛡️ Modération Médias',
      path: '/admin/media',
      roles: ['super-admin', 'admin', 'moderator'],
      permissions: ['moderate_media'],
      parent: 'content-section',
      description: 'Approuver/rejeter les médias uploadés'
    },
    {
      id: 'gallery',
      title: '🖼️ Galerie Photos',
      path: '/dashboard/super-admin/gallery',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_gallery'],
      parent: 'content-section'
    },
    {
      id: 'create-article',
      title: '📰 Nouvel Article',
      path: '/dashboard/super-admin/articles/create',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_articles'],
      parent: 'content-section'
    },
    {
      id: 'message-center',
      title: '💌 Messages',
      path: '/dashboard/super-admin/messages',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_messages'],
      parent: 'content-section'
    },

    // Actions Rapides
    {
      id: 'quick-actions',
      title: '⚡ Actions Rapides',
      type: 'section',
      roles: ['super-admin', 'admin']
    },
    {
      id: 'media-moderation-quick',
      title: '🛡️ Modérer Médias',
      path: '/admin/media',
      roles: ['super-admin', 'admin', 'moderator'],
      permissions: ['moderate_media'],
      parent: 'quick-actions',
      description: 'Vérifier les uploads en attente'
    },
    {
      id: 'add-partition',
      title: '📝 Ajouter une Partition',
      path: '/dashboard/super-admin/partitions/add',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_partitions'],
      parent: 'quick-actions'
    },
    {
      id: 'manage-gallery',
      title: '🖼️ Gérer la Galerie',
      path: '/dashboard/super-admin/gallery',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_gallery'],
      parent: 'quick-actions'
    },
    {
      id: 'publish-article',
      title: '📰 Publier un Article',
      path: '/dashboard/super-admin/articles/publish',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_articles'],
      parent: 'quick-actions'
    },
    {
      id: 'quick-invite',
      title: '👥 Inviter un Membre',
      path: '/dashboard/super-admin/invite/quick',
      roles: ['super-admin', 'admin'],
      permissions: ['manage_invitations'],
      parent: 'quick-actions'
    },

    // Gestion des Rôles
    {
      id: 'roles-section',
      title: '🎭 Gestion des Rôles',
      type: 'section',
      roles: ['super-admin'],
      permissions: ['manage_admin_roles']
    },
    {
      id: 'manage-super-admins',
      title: '👑 Gérer les Super-Admins',
      path: '/dashboard/super-admin/roles/super-admins',
      roles: ['super-admin'],
      parent: 'roles-section'
    },
    {
      id: 'manage-admins',
      title: '⚙️ Gérer les Admins',
      path: '/dashboard/super-admin/roles/admins',
      roles: ['super-admin'],
      parent: 'roles-section'
    },
    {
      id: 'manage-moderators',
      title: '🛡️ Gérer les Modérateurs',
      path: '/dashboard/super-admin/roles/moderators',
      roles: ['super-admin'],
      parent: 'roles-section',
      description: 'Gérer les permissions de modération'
    },
    {
      id: 'manage-core-team',
      title: '🎵 Gérer la Core Team',
      path: '/dashboard/super-admin/roles/core-team',
      roles: ['super-admin'],
      parent: 'roles-section'
    }
  ];

  const filteredItems = navigationItems.filter(item => canAccessItem(item));

  const renderNavigationItem = (item) => {
    if (item.type === 'section') {
      return (
        <div key={item.id} className="px-4 py-3 mt-6 first:mt-0 border-t border-gray-200 first:border-t-0">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {item.title}
          </h3>
        </div>
      );
    }

    const isItemActive = isActive(item.path);
    
    return (
      <Link
        key={item.id}
        to={item.path}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mx-2 ${
          isItemActive
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
        } ${item.parent ? 'ml-6' : ''}`}
        title={item.description}
      >
        <div className="flex items-center w-full">
          <span className="mr-3 text-lg flex-shrink-0">{item.title.split(' ')[0]}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate text-gray-900">
              {item.title.replace(/^[^\s]+\s/, '')}
            </div>
            {item.description && (
              <div className="text-xs text-gray-500 truncate mt-1">
                {item.description}
              </div>
            )}
          </div>
          {isItemActive && (
            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
          )}
        </div>
      </Link>
    );
  };

  if (!userProfile) {
    return (
      <div className="admin-navigation bg-white h-full overflow-y-auto border-r border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
            <span className="text-gray-500 text-sm">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-navigation bg-white h-full overflow-y-auto border-r border-gray-200 flex flex-col">
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              C.A.S.T. Admin
            </h2>
            <p className="text-xs text-gray-600">Panel de gestion</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Connecté en tant que:
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            userProfile.role === 'super-admin' 
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : userProfile.role === 'admin'
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : userProfile.role === 'moderator'
              ? 'bg-orange-100 text-orange-800 border border-orange-200'
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {userProfile.role === 'super-admin' && '👑 '}
            {userProfile.role === 'admin' && '⚙️ '}
            {userProfile.role === 'moderator' && '🛡️ '}
            {userProfile.role}
          </span>
        </div>
      </div>
      
      {/* Menu de navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔒</div>
            <p className="text-sm">Aucun accès administrateur</p>
          </div>
        ) : (
          filteredItems.map(renderNavigationItem)
        )}
      </nav>

      {/* Pied de page */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <div className="font-semibold text-gray-700 mb-1">C.A.S.T. Cantoria</div>
          <div>Admin Panel v2.0</div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;