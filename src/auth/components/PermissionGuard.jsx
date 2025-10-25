import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthorization } from '../hooks/useAuthorization';

const PermissionGuard = ({ 
  children, 
  requiredRole, 
  requiredPermission, 
  fallbackPath = '/unauthorized' 
}) => {
  const { isAuthenticated, userProfile } = useAuth();
  const { hasRole, hasPermission, currentRole } = useAuthorization();
  const location = useLocation();

  console.log('🔐 PermissionGuard Debug:', {
    isAuthenticated,
    userProfile,
    currentRole,
    requiredRole,
    requiredPermission,
    path: location.pathname
  });

  // Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    console.log('🚫 Non authentifié - redirection vers /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les permissions
  let hasAccess = true;

  if (requiredRole) {
    hasAccess = hasRole(requiredRole) || hasMinRole(requiredRole);
    console.log(`🎯 Vérification rôle: ${currentRole} >= ${requiredRole} → ${hasAccess}`);
  }

  if (requiredPermission && hasAccess) {
    hasAccess = hasPermission(requiredPermission);
    console.log(`🎯 Vérification permission: ${requiredPermission} → ${hasAccess}`);
  }

  // DEBUG SPÉCIAL POUR SUPER-ADMIN
  if (currentRole === 'super-admin') {
    console.log('👑 SUPER-ADMIN DÉTECTÉ - Accès automatique accordé');
    hasAccess = true;
  }

  if (!hasAccess) {
    console.log('🚫 Accès refusé - redirection vers:', fallbackPath);
    return <Navigate to={fallbackPath} replace />;
  }

  console.log('✅ Accès autorisé');
  return children;
};

export default PermissionGuard;