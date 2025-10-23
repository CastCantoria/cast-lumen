import React from 'react';
import PermissionGuard from './PermissionGuard'; // Chemin relatif corrigé

/**
 * Alias de ProtectedRoute pour la compatibilité avec l'ancien code
 * Utilise PermissionGuard en mode route
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requiredPermission,
  requiredRole,
  minRequiredRole,
  redirectTo = '/login',
  unauthorizedRedirect = '/unauthorized'
}) => {
  return (
    <PermissionGuard
      requiredRole={requiredRole}
      requiredPermission={requiredPermission}
      minRequiredRole={minRequiredRole}
      allowedRoles={allowedRoles}
      redirectTo={redirectTo}
      fallback={unauthorizedRedirect}
      mode="route"
    >
      {children}
    </PermissionGuard>
  );
};

export default ProtectedRoute;