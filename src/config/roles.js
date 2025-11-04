// Configuration existante enrichie
export const ROLES_CONFIG = {
  SUPER_ADMIN: {
    name: 'super-admin',
    level: 100,
    permissions: [
      'platform:manage',
      'users:manage_all',
      'system:configure',
      'analytics:view_global',
      'roles:manage',
      'data:backup_restore',
      'payments:manage',
      'api:manage',
      'emails:manage_templates',
      'logs:view_system',
      'content:manage_all',
      'events:manage_all',
      'repertoire:manage_all',
      'gallery:manage_all'
    ],
    description: 'Administrateur suprême - Accès complet à la plateforme'
  },

  ADMIN: {
    name: 'admin',
    level: 80,
    permissions: [
      'members:manage',
      'events:manage',
      'repertoire:manage',
      'content:manage',
      'reports:view',
      'notifications:send',
      'gallery:manage',
      'partitions:manage',
      'bookings:manage'
    ],
    description: 'Administrateur - Gestion quotidienne de la chorale'
  },

  MEMBER: {
    name: 'member',
    level: 50,
    permissions: [
      'dashboard:access',
      'partitions:view',
      'schedule:view',
      'events:rsvp',
      'profile:update',
      'gallery:view',
      'documents:access',
      'messages:send',
      'attendance:mark'
    ],
    description: 'Membre choriste - Accès aux fonctionnalités'
  },

  VISITOR: {
    name: 'visitor',
    level: 0,
    permissions: [
      'content:view_public'
    ],
    description: 'Visiteur - Accès public'
  }
};

// Hiérarchie des rôles pour la gestion des permissions
export const ROLE_HIERARCHY = {
  'super-admin': ['super-admin', 'admin', 'member', 'visitor'],
  'admin': ['admin', 'member', 'visitor'],
  'member': ['member', 'visitor'],
  'visitor': ['visitor']
};

// Routes par rôle
export const ROLE_ROUTES = {
  'super-admin': '/super-admin/dashboard',
  'admin': '/admin/dashboard',
  'member': '/dashboard',
  'visitor': '/'
};