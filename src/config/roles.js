// ====================
// CONFIGURATION DES RÔLES - SYSTÈME COMPLET
// ====================

// Configuration détaillée des rôles
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
      'gallery:manage_all',
      // Permissions système modernes
      'manage_content',
      'access_member_content',
      'create_member_content',
      'edit_member_content',
      'manage_gallery',
      'moderate_media',
      'upload_media',
      'manage_articles',
      'manage_members',
      'manage_invitations',
      'manage_admissions',
      'manage_events',
      'manage_partitions',
      'view_analytics',
      'manage_messages',
      'manage_critical_settings',
      'manage_policies',
      'manage_admin_roles'
    ],
    description: 'Administrateur suprême - Accès complet à la plateforme',
    icon: '👑',
    color: 'purple'
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
      'bookings:manage',
      // Permissions système modernes
      'manage_content',
      'access_member_content',
      'create_member_content',
      'edit_member_content',
      'manage_gallery',
      'moderate_media',
      'upload_media',
      'manage_articles',
      'manage_members',
      'manage_invitations',
      'manage_admissions',
      'manage_events',
      'manage_partitions',
      'view_analytics',
      'manage_messages'
    ],
    description: 'Administrateur - Gestion quotidienne de la chorale',
    icon: '⚙️',
    color: 'blue'
  },

  MODERATOR: {
    name: 'moderator',
    level: 60,
    permissions: [
      'content:moderate',
      'gallery:moderate',
      'comments:moderate',
      'events:coordinate',
      // Permissions système modernes
      'access_member_content',
      'create_member_content',
      'edit_member_content',
      'moderate_media',
      'upload_media',
      'manage_events',
      'manage_partitions',
      'manage_messages'
    ],
    description: 'Modérateur - Gestion du contenu et modération',
    icon: '🛡️',
    color: 'orange'
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
      'attendance:mark',
      'content:create',
      'media:upload',
      // Permissions système modernes
      'access_member_content',
      'create_member_content',
      'edit_member_content',
      'upload_media',
      'manage_partitions',
      'manage_messages'
    ],
    description: 'Membre choriste - Accès aux fonctionnalités complètes',
    icon: '🎵',
    color: 'green'
  },

  USER: {
    name: 'user',
    level: 20,
    permissions: [
      'content:view_public',
      'events:view',
      'gallery:view',
      // Permissions système modernes
      'access_member_content'
    ],
    description: 'Utilisateur - Accès limité au contenu',
    icon: '👤',
    color: 'gray'
  },

  VISITOR: {
    name: 'visitor',
    level: 0,
    permissions: [
      'content:view_public'
    ],
    description: 'Visiteur - Accès public uniquement',
    icon: '👀',
    color: 'slate'
  }
};

// ====================
// HIÉRARCHIE DES RÔLES - DOUBLE SYSTÈME
// ====================

// Système numérique pour les comparaisons
export const ROLE_HIERARCHY_NUMERIC = {
  'super-admin': 100,
  'admin': 80,
  'moderator': 60,
  'member': 50,
  'user': 20,
  'visitor': 0,
  'guest': 0
};

// Système de hiérarchie pour la gestion des permissions
export const ROLE_HIERARCHY = {
  'super-admin': ['super-admin', 'admin', 'moderator', 'member', 'user', 'visitor'],
  'admin': ['admin', 'moderator', 'member', 'user', 'visitor'],
  'moderator': ['moderator', 'member', 'user', 'visitor'],
  'member': ['member', 'user', 'visitor'],
  'user': ['user', 'visitor'],
  'visitor': ['visitor'],
  'guest': ['visitor']
};

// ====================
// PERMISSIONS MODERNES DU SYSTÈME
// ====================

export const PERMISSIONS = {
  // Contenu général
  MANAGE_CONTENT: 'manage_content',
  ACCESS_MEMBER_CONTENT: 'access_member_content',
  CREATE_MEMBER_CONTENT: 'create_member_content',
  EDIT_MEMBER_CONTENT: 'edit_member_content',
  
  // Médias
  MANAGE_GALLERY: 'manage_gallery',
  MODERATE_MEDIA: 'moderate_media',
  UPLOAD_MEDIA: 'upload_media',
  
  // Articles
  MANAGE_ARTICLES: 'manage_articles',
  
  // Utilisateurs
  MANAGE_MEMBERS: 'manage_members',
  MANAGE_INVITATIONS: 'manage_invitations',
  MANAGE_ADMISSIONS: 'manage_admissions',
  
  // Événements
  MANAGE_EVENTS: 'manage_events',
  
  // Partitions
  MANAGE_PARTITIONS: 'manage_partitions',
  
  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  
  // Messages
  MANAGE_MESSAGES: 'manage_messages',
  
  // Administratif
  MANAGE_CRITICAL_SETTINGS: 'manage_critical_settings',
  MANAGE_POLICIES: 'manage_policies',
  MANAGE_ADMIN_ROLES: 'manage_admin_roles'
};

// ====================
// MAPPING DES PERMISSIONS PAR RÔLE
// ====================

export const ROLE_PERMISSIONS = {
  'super-admin': [
    // Contenu
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.ACCESS_MEMBER_CONTENT,
    PERMISSIONS.CREATE_MEMBER_CONTENT,
    PERMISSIONS.EDIT_MEMBER_CONTENT,
    
    // Médias
    PERMISSIONS.MANAGE_GALLERY,
    PERMISSIONS.MODERATE_MEDIA,
    PERMISSIONS.UPLOAD_MEDIA,
    
    // Articles
    PERMISSIONS.MANAGE_ARTICLES,
    
    // Utilisateurs
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.MANAGE_INVITATIONS,
    PERMISSIONS.MANAGE_ADMISSIONS,
    
    // Événements
    PERMISSIONS.MANAGE_EVENTS,
    
    // Partitions
    PERMISSIONS.MANAGE_PARTITIONS,
    
    // Analytics
    PERMISSIONS.VIEW_ANALYTICS,
    
    // Messages
    PERMISSIONS.MANAGE_MESSAGES,
    
    // Administratif
    PERMISSIONS.MANAGE_CRITICAL_SETTINGS,
    PERMISSIONS.MANAGE_POLICIES,
    PERMISSIONS.MANAGE_ADMIN_ROLES
  ],

  'admin': [
    // Contenu
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.ACCESS_MEMBER_CONTENT,
    PERMISSIONS.CREATE_MEMBER_CONTENT,
    PERMISSIONS.EDIT_MEMBER_CONTENT,
    
    // Médias
    PERMISSIONS.MANAGE_GALLERY,
    PERMISSIONS.MODERATE_MEDIA,
    PERMISSIONS.UPLOAD_MEDIA,
    
    // Articles
    PERMISSIONS.MANAGE_ARTICLES,
    
    // Utilisateurs
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.MANAGE_INVITATIONS,
    PERMISSIONS.MANAGE_ADMISSIONS,
    
    // Événements
    PERMISSIONS.MANAGE_EVENTS,
    
    // Partitions
    PERMISSIONS.MANAGE_PARTITIONS,
    
    // Analytics
    PERMISSIONS.VIEW_ANALYTICS,
    
    // Messages
    PERMISSIONS.MANAGE_MESSAGES
  ],

  'moderator': [
    // Contenu
    PERMISSIONS.ACCESS_MEMBER_CONTENT,
    PERMISSIONS.CREATE_MEMBER_CONTENT,
    PERMISSIONS.EDIT_MEMBER_CONTENT,
    
    // Médias
    PERMISSIONS.MODERATE_MEDIA,
    PERMISSIONS.UPLOAD_MEDIA,
    
    // Événements
    PERMISSIONS.MANAGE_EVENTS,
    
    // Partitions
    PERMISSIONS.MANAGE_PARTITIONS,
    
    // Messages
    PERMISSIONS.MANAGE_MESSAGES
  ],

  'member': [
    // Contenu
    PERMISSIONS.ACCESS_MEMBER_CONTENT,
    PERMISSIONS.CREATE_MEMBER_CONTENT,
    PERMISSIONS.EDIT_MEMBER_CONTENT,
    
    // Médias
    PERMISSIONS.UPLOAD_MEDIA,
    
    // Partitions
    PERMISSIONS.MANAGE_PARTITIONS,
    
    // Messages
    PERMISSIONS.MANAGE_MESSAGES
  ],

  'user': [
    // Contenu
    PERMISSIONS.ACCESS_MEMBER_CONTENT
  ],

  'visitor': [],
  'guest': []
};

// ====================
// ROUTES PAR DÉFAUT PAR RÔLE
// ====================

export const ROLE_ROUTES = {
  'super-admin': '/dashboard/super-admin',
  'admin': '/dashboard/admin',
  'moderator': '/dashboard/admin',
  'member': '/dashboard/member',
  'user': '/dashboard/user',
  'visitor': '/',
  'guest': '/'
};

// ====================
// UTILITAIRES ET HELPERS
// ====================

// Obtenir la configuration d'un rôle
export const getRoleConfig = (roleName) => {
  const roleKey = Object.keys(ROLES_CONFIG).find(
    key => ROLES_CONFIG[key].name === roleName
  );
  return roleKey ? ROLES_CONFIG[roleKey] : null;
};

// Vérifier si un rôle a une permission
export const roleHasPermission = (roleName, permission) => {
  const roleConfig = getRoleConfig(roleName);
  if (!roleConfig) return false;
  
  return roleConfig.permissions.includes(permission);
};

// Obtenir tous les rôles disponibles
export const getAvailableRoles = () => {
  return Object.values(ROLES_CONFIG).map(role => ({
    value: role.name,
    label: `${role.icon} ${role.name}`,
    description: role.description,
    level: role.level
  })).sort((a, b) => b.level - a.level);
};

// Vérifier la hiérarchie des rôles
export const canManageRole = (userRole, targetRole) => {
  const userLevel = ROLE_HIERARCHY_NUMERIC[userRole] || 0;
  const targetLevel = ROLE_HIERARCHY_NUMERIC[targetRole] || 0;
  return userLevel > targetLevel;
};

// Obtenir les rôles qu'un utilisateur peut gérer
export const getManageableRoles = (userRole) => {
  const userLevel = ROLE_HIERARCHY_NUMERIC[userRole] || 0;
  return Object.entries(ROLE_HIERARCHY_NUMERIC)
    .filter(([role, level]) => level < userLevel)
    .map(([role]) => role);
};

// ====================
// EXPORT PAR DÉFAUT POUR LA COMPATIBILITÉ
// ====================

// Pour la compatibilité avec le code existant
export const ROLE_HIERARCHY = ROLE_HIERARCHY_NUMERIC;

export default {
  ROLES_CONFIG,
  ROLE_HIERARCHY: ROLE_HIERARCHY_NUMERIC,
  ROLE_HIERARCHY_LIST: ROLE_HIERARCHY,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ROLE_ROUTES,
  getRoleConfig,
  roleHasPermission,
  getAvailableRoles,
  canManageRole,
  getManageableRoles
};