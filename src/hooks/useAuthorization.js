import { useAuth } from '../contexts/AuthContext';
import { getCompatibleRole, hasPermission as roleHasPermission } from '../config/roles';

export const useAuthorization = () => {
  const { userProfile, loading, isAuthenticated: authFlag } = useAuth();

  // Role hierarchy used for min-role checks
  const roleHierarchy = {
    'visitor': 0,
    'registered-user': 1,
    'membre': 2,
    'core-team': 3,
    'admin': 4,
    'super-admin': 5
  };

  // Normalize the role coming from the profile for compatibility
  const rawRole = userProfile?.role || null;
  const currentRole = getCompatibleRole(rawRole);
  const isSuperAdmin = currentRole === 'super-admin';

  const hasRole = (role) => {
    if (isSuperAdmin) return true;
    const required = getCompatibleRole(role);
    return currentRole === required;
  };

  const hasAnyRole = (roles) => {
    if (isSuperAdmin) return true;
    if (!roles) return false;
    if (!Array.isArray(roles)) return getCompatibleRole(roles) === currentRole;
    return roles.map(getCompatibleRole).includes(currentRole);
  };

  const hasMinRole = (minRole) => {
    if (isSuperAdmin) return true;
    const required = getCompatibleRole(minRole);
    const userLevel = roleHierarchy[currentRole] || 0;
    const requiredLevel = roleHierarchy[required] || 0;
    return userLevel >= requiredLevel;
  };

  const hasPermission = (permOrRole) => {
    if (isSuperAdmin) return true;
    if (!permOrRole) return false;

    // If the argument matches a role in the hierarchy, treat it as a min-role check
    if (roleHierarchy[getCompatibleRole(permOrRole)]) {
      return hasMinRole(permOrRole);
    }

    // First check explicit permissions stored on the user profile
    if (userProfile?.permissions && Array.isArray(userProfile.permissions)) {
      if (userProfile.permissions.includes(permOrRole)) return true;
    }

    // Fallback: check role -> permission mapping defined in config/roles
    return roleHasPermission(currentRole, permOrRole);
  };

  const hasPermissions = (perms) => {
    if (!perms) return false;
    if (!Array.isArray(perms)) return hasPermission(perms);
    return perms.every(p => hasPermission(p));
  };

  return {
    // Flags
    isAuthenticated: !!authFlag || !!userProfile,
    loading,
    isSuperAdmin,

    // Role/permission helpers
    currentRole,
    hasRole,
    hasAnyRole,
    hasMinRole,
    hasPermission,
    hasPermissions,

    // Raw values
    userPermissions: userProfile?.permissions || [],
    userRole: currentRole
  };
};