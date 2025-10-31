// Définition des rôles et permissions

export const ROLES = {
  USER: 'user',
  MEMBER: 'member',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin'
};

// Hiérarchie des rôles (chaque rôle a les permissions des rôles inférieurs)
const roleHierarchy = {
  [ROLES.USER]: [ROLES.USER],
  [ROLES.MEMBER]: [ROLES.USER, ROLES.MEMBER],
  [ROLES.ADMIN]: [ROLES.USER, ROLES.MEMBER, ROLES.ADMIN],
  [ROLES.SUPER_ADMIN]: [ROLES.USER, ROLES.MEMBER, ROLES.ADMIN, ROLES.SUPER_ADMIN]
};

// Vérifie si un rôle a une certaine permission
export const hasPermission = (userRole, requiredRole) => {
  if (!userRole) return false;
  const userRoles = roleHierarchy[userRole] || [];
  return userRoles.includes(requiredRole);
};

// Obtient le rôle compatible (pour la rétrocompatibilité)
export const getCompatibleRole = (role) => {
  return role || ROLES.USER;
};
