import { useAuth } from '../contexts/AuthContext';
import { ROLE_HIERARCHY, PERMISSIONS, ROLE_PERMISSIONS } from '../../config/roles';

const usePermissions = () => {
  const { userProfile } = useAuth();

  const hasRole = (requiredRole) => {
    if (!userProfile?.role) return false;
    return ROLE_HIERARCHY[userProfile.role] >= ROLE_HIERARCHY[requiredRole];
  };

  const hasPermission = (permission) => {
    if (!userProfile?.role) return false;
    // Importer directement depuis le fichier de configuration
    return ROLE_PERMISSIONS[userProfile.role]?.includes(permission) || false;
  };

  // Gallery Management
  const canManageGallery = () => {
    return hasPermission(PERMISSIONS.MANAGE_GALLERY);
  };

  // Articles Management
  const canManageArticles = () => {
    return hasPermission(PERMISSIONS.MANAGE_ARTICLES);
  };

  // User Management
  const canManageUsers = () => {
    return hasPermission(PERMISSIONS.MANAGE_MEMBERS);
  };

  const canManageInvitations = () => {
    return hasPermission(PERMISSIONS.MANAGE_INVITATIONS);
  };

  const canManageAdmissions = () => {
    return hasPermission(PERMISSIONS.MANAGE_ADMISSIONS);
  };

  // Event Management
  const canManageEvents = () => {
    return hasPermission(PERMISSIONS.MANAGE_EVENTS);
  };

  const canViewAnalytics = () => {
    return hasPermission(PERMISSIONS.VIEW_ANALYTICS);
  };

  // Content Management
  const canManageContent = () => {
    return hasPermission(PERMISSIONS.MANAGE_CONTENT);
  };

  const canManageMessages = () => {
    return hasPermission(PERMISSIONS.MANAGE_MESSAGES);
  };

  const canManagePartitions = () => {
    return hasPermission(PERMISSIONS.MANAGE_PARTITIONS);
  };

  // Administrative Functions
  const canManageCriticalSettings = () => {
    return hasPermission(PERMISSIONS.MANAGE_CRITICAL_SETTINGS);
  };

  const canManagePolicies = () => {
    return hasPermission(PERMISSIONS.MANAGE_POLICIES);
  };

  const canManageAdminRoles = () => {
    return hasPermission(PERMISSIONS.MANAGE_ADMIN_ROLES);
  };

  // Member Functions
  const canAccessMemberContent = () => {
    return hasPermission(PERMISSIONS.ACCESS_MEMBER_CONTENT);
  };

  const canCreateMemberContent = () => {
    return hasPermission(PERMISSIONS.CREATE_MEMBER_CONTENT);
  };

  const canEditMemberContent = () => {
    return hasPermission(PERMISSIONS.EDIT_MEMBER_CONTENT);
  };

  return {
    hasRole,
    hasPermission,
    // Gallery
    canManageGallery,
    // Articles
    canManageArticles,
    // Users
    canManageUsers,
    canManageInvitations,
    canManageAdmissions,
    // Events
    canManageEvents,
    canViewAnalytics,
    // Content
    canManageContent,
    canManageMessages,
    canManagePartitions,
    // Administrative
    canManageCriticalSettings,
    canManagePolicies,
    canManageAdminRoles,
    // Member
    canAccessMemberContent,
    canCreateMemberContent,
    canEditMemberContent
  };
};

export default usePermissions;