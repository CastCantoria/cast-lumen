import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavigation = () => {
  const { userProfile } = useAuth();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.hash === `#${path}`;
  };

  const navigationItems = [
    // Tableau de bord principal
    {
      id: 'dashboard',
      title: '🏠 Accueil du Site',
      path: '/',
      roles: ['super-admin', 'admin', 'membre']
    },
    {
      id: 'super-admin',
      title: '👑 Super-Admin',
      path: '/super-admin',
      roles: ['super-admin'],
      description: 'Gestion complète de la plateforme C.A.S.T.'
    },

    // Gestion des Membres
    {
      id: 'members-section',
      title: '👥 Gestion des Membres',
      type: 'section',
      roles: ['super-admin', 'admin']
    },
    {
      id: 'all-members',
      title: '👥 Voir tous les Membres',
      path: '/super-admin/users',
      roles: ['super-admin', 'admin'],
      parent: 'members-section'
    },
    {
      id: 'admissions',
      title: '✅ Gérer les Admissions',
      path: '/super-admin/admissions',
      roles: ['super-admin', 'admin'],
      parent: 'members-section'
    },
    {
      id: 'invite-member',
      title: '📧 Inviter un Membre',
      path: '/super-admin/invite',
      roles: ['super-admin', 'admin'],
      parent: 'members-section'
    },

    // Gestion des Événements
    {
      id: 'events-section',
      title: '🎭 Gestion des Événements',
      type: 'section',
      roles: ['super-admin', 'admin']
    },
    {
      id: 'create-event',
      title: '🎵 Créer un Événement',
      path: '/super-admin/events/create',
      roles: ['super-admin', 'admin'],
      parent: 'events-section'
    },
    {
      id: 'event-calendar',
      title: '📅 Calendrier des Concerts',
      path: '/super-admin/events/calendar',
      roles: ['super-admin', 'admin'],
      parent: 'events-section'
    },
    {
      id: 'event-stats',
      title: '📊 Statistiques de Participation',
      path: '/super-admin/events/stats',
      roles: ['super-admin', 'admin'],
      parent: 'events-section'
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
      path: '/super-admin/partitions/add',
      roles: ['super-admin', 'admin'],
      parent: 'quick-actions'
    },
    {
      id: 'manage-gallery',
      title: '🖼️ Gérer la Galerie',
      path: '/super-admin/gallery',
      roles: ['super-admin', 'admin'],
      parent: 'quick-actions'
    },
    {
      id: 'publish-article',
      title: '📰 Publier un Article',
      path: '/super-admin/articles/publish',
      roles: ['super-admin', 'admin'],
      parent: 'quick-actions'
    },
    {
      id: 'quick-invite',
      title: '👥 Inviter un Membre',
      path: '/super-admin/invite/quick',
      roles: ['super-admin', 'admin'],
      parent: 'quick-actions'
    },

    // Gestion des Rôles
    {
      id: 'roles-section',
      title: '🎭 Gestion des Rôles',
      type: 'section',
      roles: ['super-admin']
    },
    {
      id: 'manage-super-admins',
      title: '👑 Gérer les Super-Admins',
      path: '/super-admin/roles/super-admins',
      roles: ['super-admin'],
      parent: 'roles-section',
      permission: 'Permission requise'
    },
    {
      id: 'manage-admins',
      title: '⚙️ Gérer les Admins',
      path: '/super-admin/roles/admins',
      roles: ['super-admin'],
      parent: 'roles-section'
    },
    {
      id: 'manage-core-team',
      title: '🎵 Gérer la Core Team',
      path: '/super-admin/roles/core-team',
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