// src/config/roles.js
export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  MEMBER: 'member',
  USER: 'user',
  VISITOR: 'visitor'
};

// Mapping des rôles et leurs niveaux d'accès
export const ROLE_HIERARCHY = {
  'super-admin': 4, // Accès total
  'admin': 3,      // Tout sauf super-admin
  'member': 2,     // Accès membre
  'user': 1,       // Accès utilisateur de base
  'visitor': 0     // Accès public
};

// Mapping des anciens rôles vers les nouveaux
export const ROLE_MAPPING = {
  'super-admin': 'super-admin',
  'admin': 'admin',
  'membre': 'member',
  'registered-user': 'user',
  'core-team': 'member',
  'public': 'visitor'
};

export const PERMISSIONS = {
  // Gouvernance et Conformité (Super-Admin)
  MANAGE_POLICIES: 'manage_policies',
  MANAGE_ALL_ACCOUNTS: 'manage_all_accounts',
  SECURITY_CRITICAL: 'security_critical',
  CMS_DECISIONS: 'cms_decisions',
  EXTERNAL_RELATIONS: 'external_relations',
  
  // Gestion Super Admin
  PROMOTE_SUPER_ADMIN: 'promote_super_admin',
  MANAGE_ADMIN_ROLES: 'manage_admin_roles',
  MANAGE_ALL_CONTENT: 'manage_all_content',
  MANAGE_CRITICAL_SETTINGS: 'manage_critical_settings',

  // Gestion Admin
  MANAGE_MEMBERS: 'manage_members',
  MANAGE_EVENTS: 'manage_events',
  MANAGE_CONTENT: 'manage_content',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_GALLERY: 'manage_gallery',
  MANAGE_ARTICLES: 'manage_articles',
  MANAGE_PARTITIONS: 'manage_partitions',
  MANAGE_MESSAGES: 'manage_messages',
  MANAGE_INVITATIONS: 'manage_invitations',
  MANAGE_ADMISSIONS: 'manage_admissions',
  MODERATE_COMMUNITY: 'moderate_community',
  TECHNICAL_COORDINATION: 'technical_coordination',
  PUBLISH_MEDIA: 'publish_media',
  MANAGE_RESOURCES: 'manage_resources',
  LIMITED_MODERATION: 'limited_moderation',
  TASK_MANAGEMENT: 'task_management',
  USER_SUPPORT: 'user_support',

  // Accès Membre
  VIEW_PARTITIONS: 'view_partitions',
  VIEW_MEMBER_EVENTS: 'view_member_events',
  VIEW_MEMBER_MESSAGES: 'view_member_messages',
  PARTICIPATE_EVENTS: 'participate_events',
  ACCESS_REHEARSALS: 'access_rehearsals',
  ACCESS_SCORES: 'access_scores',
  ACCESS_MEMBER_CONTENT: 'access_member_content',
  CREATE_MEMBER_CONTENT: 'create_member_content',
  EDIT_MEMBER_CONTENT: 'edit_member_content',
  DELETE_MEMBER_CONTENT: 'delete_member_content',
  SAVE_MEMBER_CONTENT: 'save_member_content',
  INTERACT_CONTENT: 'interact_content',
  
  // Accès Utilisateur
  VIEW_PUBLIC_CONTENT: 'view_public_content',
  COMMENT_ARTICLES: 'comment_articles',
  UPDATE_PROFILE: 'update_profile',
  ACCESS_BLOG: 'access_blog',
  ACCESS_CHAT: 'access_chat',
  ACCESS_NEWSLETTER: 'access_newsletter',
  ACCESS_PREMIUM_CONTENT: 'access_premium_content',
  SUBMIT_CONTRIBUTIONS: 'submit_contributions'
};

// Mapping des permissions par rôle
export const ROLE_PERMISSIONS = {
  'super-admin': [
    // Governance & Admin
    PERMISSIONS.MANAGE_POLICIES,
    PERMISSIONS.MANAGE_ALL_ACCOUNTS,
    PERMISSIONS.SECURITY_CRITICAL,
    PERMISSIONS.CMS_DECISIONS,
    PERMISSIONS.EXTERNAL_RELATIONS,
    PERMISSIONS.PROMOTE_SUPER_ADMIN,
    PERMISSIONS.MANAGE_ADMIN_ROLES,
    PERMISSIONS.MANAGE_ALL_CONTENT,
    PERMISSIONS.MANAGE_CRITICAL_SETTINGS,
    
    // Content & Resource Management  
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_GALLERY,
    PERMISSIONS.MANAGE_ARTICLES,
    PERMISSIONS.MANAGE_PARTITIONS,
    PERMISSIONS.MANAGE_MESSAGES,
    PERMISSIONS.MANAGE_INVITATIONS,
    PERMISSIONS.MANAGE_ADMISSIONS,
    PERMISSIONS.MODERATE_COMMUNITY,
    PERMISSIONS.TECHNICAL_COORDINATION,
    PERMISSIONS.PUBLISH_MEDIA,
    PERMISSIONS.MANAGE_RESOURCES,
    PERMISSIONS.LIMITED_MODERATION,
    PERMISSIONS.TASK_MANAGEMENT,
    PERMISSIONS.USER_SUPPORT,

    // Member Access
    PERMISSIONS.VIEW_PARTITIONS,
    PERMISSIONS.VIEW_MEMBER_EVENTS,
    PERMISSIONS.VIEW_MEMBER_MESSAGES,
    PERMISSIONS.PARTICIPATE_EVENTS,
    PERMISSIONS.ACCESS_REHEARSALS,
    PERMISSIONS.ACCESS_SCORES,
    PERMISSIONS.ACCESS_MEMBER_CONTENT,
    PERMISSIONS.CREATE_MEMBER_CONTENT,
    PERMISSIONS.EDIT_MEMBER_CONTENT,
    PERMISSIONS.DELETE_MEMBER_CONTENT,
    PERMISSIONS.SAVE_MEMBER_CONTENT,
    PERMISSIONS.INTERACT_CONTENT,
    
    // Basic Access
    PERMISSIONS.VIEW_PUBLIC_CONTENT,
    PERMISSIONS.COMMENT_ARTICLES,
    PERMISSIONS.UPDATE_PROFILE,
    PERMISSIONS.ACCESS_BLOG,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_NEWSLETTER,
    PERMISSIONS.ACCESS_PREMIUM_CONTENT,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS
  ],
  'admin': [
    // Management & Moderation
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_GALLERY,
    PERMISSIONS.MANAGE_ARTICLES,
    PERMISSIONS.MANAGE_PARTITIONS,
    PERMISSIONS.MANAGE_MESSAGES,
    PERMISSIONS.MANAGE_INVITATIONS,
    PERMISSIONS.MANAGE_ADMISSIONS,
    PERMISSIONS.MODERATE_COMMUNITY,
    PERMISSIONS.TECHNICAL_COORDINATION,
    PERMISSIONS.PUBLISH_MEDIA,
    PERMISSIONS.MANAGE_RESOURCES,
    PERMISSIONS.LIMITED_MODERATION,
    PERMISSIONS.TASK_MANAGEMENT,
    PERMISSIONS.USER_SUPPORT,

    // Member Content Management
    PERMISSIONS.CREATE_MEMBER_CONTENT,
    PERMISSIONS.EDIT_MEMBER_CONTENT,
    PERMISSIONS.DELETE_MEMBER_CONTENT,
    PERMISSIONS.SAVE_MEMBER_CONTENT,
    
    // Member Access
    PERMISSIONS.VIEW_PARTITIONS,
    PERMISSIONS.VIEW_MEMBER_EVENTS,
    PERMISSIONS.VIEW_MEMBER_MESSAGES,
    PERMISSIONS.PARTICIPATE_EVENTS,
    PERMISSIONS.ACCESS_REHEARSALS,
    PERMISSIONS.ACCESS_SCORES,
    PERMISSIONS.ACCESS_MEMBER_CONTENT,
    PERMISSIONS.INTERACT_CONTENT,
    
    // Basic Access
    PERMISSIONS.VIEW_PUBLIC_CONTENT,
    PERMISSIONS.COMMENT_ARTICLES,
    PERMISSIONS.UPDATE_PROFILE,
    PERMISSIONS.ACCESS_BLOG,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_NEWSLETTER,
    PERMISSIONS.ACCESS_PREMIUM_CONTENT,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS
  ],
  'member': [
    // Member Access
    PERMISSIONS.VIEW_PARTITIONS,
    PERMISSIONS.VIEW_MEMBER_EVENTS,
    PERMISSIONS.VIEW_MEMBER_MESSAGES,
    PERMISSIONS.PARTICIPATE_EVENTS,
    PERMISSIONS.ACCESS_REHEARSALS,
    PERMISSIONS.ACCESS_SCORES,
    PERMISSIONS.ACCESS_MEMBER_CONTENT,
    PERMISSIONS.INTERACT_CONTENT,
    
    // Basic Access
    PERMISSIONS.VIEW_PUBLIC_CONTENT,
    PERMISSIONS.COMMENT_ARTICLES,
    PERMISSIONS.UPDATE_PROFILE,
    PERMISSIONS.ACCESS_BLOG,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_NEWSLETTER,
    PERMISSIONS.ACCESS_PREMIUM_CONTENT,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS
  ],
  'user': [
    // Basic Access
    PERMISSIONS.VIEW_PUBLIC_CONTENT,
    PERMISSIONS.COMMENT_ARTICLES,
    PERMISSIONS.UPDATE_PROFILE,
    PERMISSIONS.ACCESS_BLOG,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_NEWSLETTER,
    PERMISSIONS.SUBMIT_CONTRIBUTIONS
  ],
  'visitor': [
    PERMISSIONS.VIEW_PUBLIC_CONTENT
  ]
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