import { ROLES_CONFIG, ROLE_HIERARCHY } from '../config/roles';

export class PermissionService {
  /**
   * Vérifie si un utilisateur a une permission spécifique
   */
  static hasPermission(userRole, requiredPermission) {
    if (!userRole) return false;
    
    const roleConfig = Object.values(ROLES_CONFIG).find(
      role => role.name === userRole
    );
    
    if (!roleConfig) return false;
    
    return roleConfig.permissions.includes(requiredPermission);
  }

  /**
   * Vérifie si un utilisateur peut gérer un rôle cible
   */
  static canManageRole(userRole, targetRole) {
    if (!userRole || !targetRole) return false;
    
    const userHierarchy = ROLE_HIERARCHY[userRole];
    return userHierarchy && userHierarchy.includes(targetRole);
  }

  /**
   * Obtient les rôles accessibles par un utilisateur
   */
  static getAccessibleRoles(userRole) {
    return ROLE_HIERARCHY[userRole] || [];
  }

  /**
   * Obtient le niveau d'un rôle
   */
  static getRoleLevel(role) {
    const roleConfig = Object.values(ROLES_CONFIG).find(
      r => r.name === role
    );
    return roleConfig ? roleConfig.level : 0;
  }

  /**
   * Vérifie si l'utilisateur a un niveau de rôle suffisant
   */
  static hasRoleLevel(userRole, minLevel) {
    return this.getRoleLevel(userRole) >= minLevel;
  }

  /**
   * Obtient la route de dashboard par rôle
   */
  static getDashboardRoute(userRole) {
    const routes = {
      'super-admin': '/super-admin/dashboard',
      'admin': '/admin/dashboard',
      'member': '/dashboard',
      'visitor': '/'
    };
    return routes[userRole] || '/';
  }
}

// Hook React pour les permissions
import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { currentUser, userProfile } = useAuth();
  
  const hasPermission = (permission) => {
    return PermissionService.hasPermission(userProfile?.role, permission);
  };

  const canManage = (targetRole) => {
    return PermissionService.canManageRole(userProfile?.role, targetRole);
  };

  const getDashboardRoute = () => {
    return PermissionService.getDashboardRoute(userProfile?.role);
  };

  return { 
    hasPermission, 
    canManage, 
    getDashboardRoute,
    userRole: userProfile?.role,
    userProfile 
  };
};