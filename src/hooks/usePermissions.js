import { useAuth } from '../contexts/AuthContext';
import { ROLE_HIERARCHY, PERMISSIONS, ROLE_PERMISSIONS } from '../config/roles';

const usePermissions = () => {
  const { userProfile } = useAuth();

  // ====================
  // SYSTEME DE RÔLES HIÉRARCHIQUE
  // ====================

  const hasRole = (requiredRole) => {
    if (!userProfile?.role) return false;
    return ROLE_HIERARCHY[userProfile.role] >= ROLE_HIERARCHY[requiredRole];
  };

  const hasAnyRole = (roles) => {
    if (!userProfile?.role) return false;
    return roles.includes(userProfile?.role);
  };

  // ====================
  // SYSTEME DE PERMISSIONS
  // ====================

  const hasPermission = (permission) => {
    if (!userProfile?.role) return false;
    return ROLE_PERMISSIONS[userProfile.role]?.includes(permission) || false;
  };

  // ====================
  // PERMISSIONS SPÉCIFIQUES
  // ====================

  // Dashboard et Accès
  const canViewDashboard = () => hasAnyRole(['super-admin', 'admin', 'moderator', 'member', 'user']);
  const canManageContent = () => hasPermission(PERMISSIONS.MANAGE_CONTENT);

  // Gestion des Médias
  const canManageGallery = () => hasPermission(PERMISSIONS.MANAGE_GALLERY);
  const canModerateMedia = () => hasPermission(PERMISSIONS.MODERATE_MEDIA);
  const canUploadMedia = () => hasPermission(PERMISSIONS.UPLOAD_MEDIA);

  // Gestion des Articles
  const canManageArticles = () => hasPermission(PERMISSIONS.MANAGE_ARTICLES);

  // Gestion des Utilisateurs
  const canManageUsers = () => hasPermission(PERMISSIONS.MANAGE_MEMBERS);
  const canManageInvitations = () => hasPermission(PERMISSIONS.MANAGE_INVITATIONS);
  const canManageAdmissions = () => hasPermission(PERMISSIONS.MANAGE_ADMISSIONS);

  // Gestion des Événements
  const canManageEvents = () => hasPermission(PERMISSIONS.MANAGE_EVENTS);

  // Gestion des Partitions
  const canManagePartitions = () => hasPermission(PERMISSIONS.MANAGE_PARTITIONS);

  // Analytics
  const canViewAnalytics = () => hasPermission(PERMISSIONS.VIEW_ANALYTICS);

  // Messages
  const canManageMessages = () => hasPermission(PERMISSIONS.MANAGE_MESSAGES);

  // Permissions Administratives
  const canManageCriticalSettings = () => hasPermission(PERMISSIONS.MANAGE_CRITICAL_SETTINGS);
  const canManagePolicies = () => hasPermission(PERMISSIONS.MANAGE_POLICIES);
  const canManageAdminRoles = () => hasPermission(PERMISSIONS.MANAGE_ADMIN_ROLES);

  // Contenu Membre
  const canAccessMemberContent = () => hasPermission(PERMISSIONS.ACCESS_MEMBER_CONTENT);
  const canCreateMemberContent = () => hasPermission(PERMISSIONS.CREATE_MEMBER_CONTENT);
  const canEditMemberContent = () => hasPermission(PERMISSIONS.EDIT_MEMBER_CONTENT);

  // ====================
  // UTILITAIRES
  // ====================

  return {
    // Système de rôles
    hasRole,
    hasAnyRole,
    hasPermission,
    
    // Dashboard et Accès
    canViewDashboard,
    canManageContent,
    
    // Médias
    canManageGallery,
    canModerateMedia,
    canUploadMedia,
    
    // Articles
    canManageArticles,
    
    // Utilisateurs
    canManageUsers,
    canManageInvitations,
    canManageAdmissions,
    
    // Événements
    canManageEvents,
    
    // Partitions
    canManagePartitions,
    
    // Analytics
    canViewAnalytics,
    
    // Messages
    canManageMessages,
    
    // Administratif
    canManageCriticalSettings,
    canManagePolicies,
    canManageAdminRoles,
    
    // Contenu Membre
    canAccessMemberContent,
    canCreateMemberContent,
    canEditMemberContent,
    
    // Rôle actuel et statuts
    currentRole: userProfile?.role,
    isSuperAdmin: hasRole('super-admin'),
    isAdmin: hasRole('admin'),
    isModerator: hasRole('moderator'),
    isMember: hasRole('member'),
    isUser: hasRole('user')
  };
};

export default usePermissions;