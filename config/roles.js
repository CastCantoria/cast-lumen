// src/config/roles.js - VERSION COMPLÈTEMENT COMPATIBLE
export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  CORE_TEAM: 'core-team',
  REGISTERED_USER: 'registered-user',
  MEMBER: 'membre', // ← Gardé pour compatibilité
  VISITOR: 'visitor'
};

// Mapping complet pour transition en douceur
export const ROLE_MAPPING = {
  // Anciens rôles → Nouveaux rôles
  'super-admin': 'super-admin',
  'admin': 'admin',
  'membre': 'registered-user',
  'public': 'visitor',
  'core-team': 'core-team',
  
  // Compatibilité bidirectionnelle
  'super_admin': 'super-admin',
  'registered_user': 'registered-user', 
  'core_team': 'core-team'
};

export const PERMISSIONS = {
  // Gouvernance et Conformité (Super-Admin)
  MANAGE_POLICIES: 'manage_policies',
  MANAGE_ALL_ACCOUNTS: 'manage_all_accounts',
  SECURITY_CRITICAL: 'security_critical',
  CMS_DECISIONS: 'cms_decisions',
  EXTERNAL_RELATIONS: 'external_relations',
  
  // Gestion Opérationnelle (Admin)
  MANAGE_CONTENT: 'manage_content',
  MANAGE_USERS: 'manage_users',
  MODERATE_COMMUNITY: 'moderate_community',
  VIEW_ANALYTICS: 'view_analytics',
  TECHNICAL_COORDINATION: 'technical_coordination',
  
  // Publication Média (Core Team)
  PUBLISH_MEDIA: 'publish_media',
  MANAGE_RESOURCES: 'manage_resources',
  LIMITED_MODERATION: 'limited_moderation',
  TASK_MANAGEMENT: 'task_management',
  USER_SUPPORT: 'user_support',
  
  // Interaction (Registered User)
  ACCESS_PREMIUM_CONTENT: 'access_premium_content',
  INTERACT_CONTENT: 'interact_content',
  SUBMIT_CONTRIBUTIONS: 'submit_contributions',
  MANAGE_PROFILE: 'manage_profile'
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.MANAGE_POLICIES,
    PERMISSIONS.MANAGE_ALL_ACCOUNTS,
    PERMISSIONS.SECURITY_CRITICAL,
    PERMISSIONS.CMS_DECISIONS,
    PERMISSIONS.EXTERNAL_RELATIONS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MODERATE_COMMUNITY,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.TECHNICAL_COORDINATION,
    PERMISSIONS.PUBLISH_MEDIA,
    PERMISSIONS.MANAGE_RESOURCES
  ],
  
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MODERATE_COMMUNITY,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.TECHNICAL_COORDINATION,
    PERMISSIONS.PUBLISH_MEDIA,
    PERMISSIONS.MANAGE_RESOURCES,
    PERMISSIONS.LIMITED_MODERATION,
    PERMISSIONS.TASK_MANAGEMENT
  ],
  
  [ROLES.CORE_TEAM]: [
    PERMISSIONS.PUBLISH_MEDIA,
    PERMISSIONS.MANAGE_RESOURCES,
    PERMISSIONS.LIMITED_MODERATION,
    PERMISSIONS.TASK_MANAGEMENT,
    PERMISSIONS.USER_SUPPORT,
    PERMISSIONS.ACCESS_PREMIUM_CONTENT,
    PERMISSIONS.INTERACT_CONTENT,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS,
    PERMISSIONS.MANAGE_PROFILE
  ],
  
  [ROLES.REGISTERED_USER]: [
    PERMISSIONS.ACCESS_PREMIUM_CONTENT,
    PERMISSIONS.INTERACT_CONTENT,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS,
    PERMISSIONS.MANAGE_PROFILE
  ],
  
  [ROLES.MEMBER]: [ // Compatibilité avec l'existant
    PERMISSIONS.ACCESS_PREMIUM_CONTENT,
    PERMISSIONS.INTERACT_CONTENT,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS,
    PERMISSIONS.MANAGE_PROFILE
  ],
  
  [ROLES.VISITOR]: []
};

// Matrice RACI simplifiée
export const RACI_MATRIX = {
  content_publication: {
    [ROLES.SUPER_ADMIN]: 'A',
    [ROLES.ADMIN]: 'R',
    [ROLES.CORE_TEAM]: 'R',
    [ROLES.REGISTERED_USER]: 'C'
  },
  user_management: {
    [ROLES.SUPER_ADMIN]: 'A',
    [ROLES.ADMIN]: 'R',
    [ROLES.CORE_TEAM]: 'I'
  },
  security_incidents: {
    [ROLES.SUPER_ADMIN]: 'A',
    [ROLES.ADMIN]: 'I',
    [ROLES.CORE_TEAM]: 'I'
  },
  community_moderation: {
    [ROLES.SUPER_ADMIN]: 'A',
    [ROLES.ADMIN]: 'R',
    [ROLES.CORE_TEAM]: 'R',
    [ROLES.REGISTERED_USER]: 'C'
  }
};

// Fonction utilitaire améliorée pour la transition
export const getCompatibleRole = (oldRole) => {
  if (!oldRole) return ROLES.VISITOR;

  // Normalize common variations: trim, lowercase, replace spaces/underscores with hyphens
  const normalized = String(oldRole).trim().toLowerCase().replace(/\s+/g, '-').replace(/_+/g, '-');

  // Si le rôle existe déjà dans les nouveaux rôles, le garder
  if (Object.values(ROLES).includes(normalized)) {
    return normalized;
  }

  // Essayer mapping de compatibilité avec la clé normalisée
  if (ROLE_MAPPING[normalized]) return ROLE_MAPPING[normalized];

  // Fallback: tenter une correspondance sans transformations (ancienne clé exacte)
  if (ROLE_MAPPING[oldRole]) return ROLE_MAPPING[oldRole];

  // Par défaut, considérer comme utilisateur enregistré
  return ROLES.REGISTERED_USER;
};

// Helper pour vérifier les permissions avec compatibilité
export const hasPermission = (userRole, permission) => {
  const compatibleRole = getCompatibleRole(userRole);
  const hasPerm = ROLE_PERMISSIONS[compatibleRole]?.includes(permission) || false;
  
  console.log('🔐 Permission Check:', {
    originalRole: userRole,
    compatibleRole,
    permission,
    hasPermission: hasPerm
  });
  
  return hasPerm;
};

// Vérifier si un utilisateur a un rôle spécifique (avec compatibilité)
export const hasRole = (userRole, requiredRole) => {
  const compatibleUserRole = getCompatibleRole(userRole);
  const compatibleRequiredRole = getCompatibleRole(requiredRole);
  
  return compatibleUserRole === compatibleRequiredRole;
};

// Vérifier si un utilisateur a au moins un rôle minimal
export const hasMinRole = (userRole, minRole) => {
  const hierarchy = {
    [ROLES.VISITOR]: 0,
    [ROLES.REGISTERED_USER]: 1,
    [ROLES.CORE_TEAM]: 2,
    [ROLES.ADMIN]: 3,
    [ROLES.SUPER_ADMIN]: 4
  };
  
  const userLevel = hierarchy[getCompatibleRole(userRole)] || 0;
  const minLevel = hierarchy[getCompatibleRole(minRole)] || 0;
  
  return userLevel >= minLevel;
};