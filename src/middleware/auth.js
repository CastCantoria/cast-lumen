// src/middleware/auth.js
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../config/roles';

export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const roleHierarchy = {
      [ROLES.SUPER_ADMIN]: 4,
      [ROLES.ADMIN]: 3,
      [ROLES.CORE_TEAM]: 2,
      [ROLES.REGISTERED_USER]: 1,
      [ROLES.VISITOR]: 0
    };

    if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
      return res.status(403).json({ 
        error: 'Privilèges insuffisants',
        required: requiredRole,
        current: user.role
      });
    }

    next();
  };
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    if (!hasPermission(user.role, permission)) {
      return res.status(403).json({ 
        error: 'Permission refusée',
        required: permission,
        current: user.role
      });
    }

    next();
  };
};