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
    canManagePartitions
  } = usePermissions();
  
  const isActive = (path) => {
    return location.pathname === path || location.hash === `#${path}`;
  };

  const canAccessItem = (item) => {
    if (!item.roles?.length) return true;
    return item.roles.some(role => hasRole(role)) && hasRequiredPermissions(item);
  };

  const hasRequiredPermissions = (item) => {
    if (!item.permissions) return true;
    
    // Si une liste de permissions est fournie, vérifier que l'utilisateur a toutes les permissions
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
      roles: ['super-admin', 'admin', 'member']
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
      roles: ['super-admin', 'admin'],
      permissions: ['manage_content']
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
      parent: 'roles-section',
      permission: 'Permission requise'
    },
    {
      id: 'manage-admins',
      title: '⚙️ Gérer les Admins',
      path: '/dashboard/super-admin/roles/admins',
      roles: ['super-admin'],
      parent: 'roles-section'
    },
    {
      id: 'manage-core-team',
      title: '🎵 Gérer la Core Team',
      path: '/dashboard/super-admin/roles/core-team',
      roles: ['super-admin'],
      parent: 'roles-section'
    }
  ];

  const filteredItems = navigationItems.filter(item => {
    if (!userProfile) return false;
    return item.roles.includes(userProfile.role);
  });

  const renderNavigationItem = (item) => {
    if (item.type === 'section') {
      return (
        <div key={item.id} className="nav-section">
          <h3 className="section-title">{item.title}</h3>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path}
        className={`nav-item ${isActive(item.path) ? 'active' : ''} ${
          item.parent ? 'sub-item' : ''
        }`}
      >
        <div className="nav-item-content">
          <span className="nav-icon">{item.title.split(' ')[0]}</span>
          <div className="nav-text">
            <div className="nav-title">
              {item.title.replace(/^[^\s]+\s/, '')}
            </div>
            {item.description && (
              <div className="nav-description">{item.description}</div>
            )}
            {item.permission && (
              <div className="nav-permission">{item.permission}</div>
            )}
          </div>
        </div>
        {isActive(item.path) && <div className="active-indicator" />}
      </Link>
    );
  };

  return (
    <div className="admin-navigation">
      <div className="nav-header">
        <h2>Navigation Admin</h2>
        <div className="user-role">
          Rôle: <span className="role-badge">{userProfile?.role}</span>
        </div>
      </div>
      
      <nav className="nav-menu">
        {filteredItems.map(renderNavigationItem)}
      </nav>
    </div>
  );
};

export default AdminNavigation;