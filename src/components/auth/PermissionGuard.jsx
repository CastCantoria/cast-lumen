import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthorization } from '../../hooks/useAuthorization'; // Chemin corrigé
import { useAuth } from '../../contexts/AuthContext';

/**
 * Guard de permission pour protéger les routes et composants selon les rôles
 * Version unifiée avec support legacy et nouveau système
 */
const PermissionGuard = ({ 
  children, 
  
  // Nouveau système de permissions
  requiredRole, 
  requiredPermission,
  minRequiredRole,
  
  // Compatibilité legacy
  allowedRoles = [],
  
  // Configuration
  fallback = '/unauthorized',
  redirectTo = '/login',
  showFallback = true,
  className = '',
  
  // Mode composant (affichage conditionnel)
  mode = 'route' // 'route' | 'component'
}) => {
  const { 
    currentRole, 
    isAuthenticated, 
    hasRole, 
    hasAnyRole, 
    hasPermission 
  } = useAuthorization();
  
  const { userProfile, loading } = useAuth();
  const location = useLocation();

  // Debug informations
  console.log('🔐 PermissionGuard Debug:', {
    mode,
    path: location.pathname,
    requiredRole,
    requiredPermission,
    minRequiredRole,
    allowedRoles,
    currentRole,
    isAuthenticated,
    userRole: userProfile?.role
  });

  // Mode composant (affichage conditionnel)
  if (mode === 'component') {
    const hasAccess = 
      // Vérification rôle spécifique
      (requiredRole && hasRole(requiredRole)) ||
      // Vérification permission hiérarchique
      (minRequiredRole && hasPermission(minRequiredRole)) ||
      // Vérification permission spécifique
      (requiredPermission && typeof requiredPermission === 'string' && hasPermission(requiredPermission)) ||
      // Vérification permissions multiples
      (requiredPermission && Array.isArray(requiredPermission) && hasAnyRole(requiredPermission)) ||
      // Compatibilité legacy
      (allowedRoles.length > 0 && hasAnyRole(allowedRoles));

    if (!hasAccess) {
      if (showFallback) {
        return (
          <div className={className}>
            {fallback || (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Accès restreint</span>
                </div>
                <p className="mt-1 text-sm">
                  Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
                </p>
              </div>
            )}
          </div>
        );
      }
      return null;
    }

    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  // Mode route (protection de route)
  
  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des permissions...</p>
        </div>
      </div>
    );
  }

  // Vérification d'authentification
  if (!isAuthenticated) {
    console.log('🚫 Non authentifié - redirection vers /login');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // === VÉRIFICATIONS DES PERMISSIONS ===

  // Vérification rôle spécifique
  if (requiredRole && !hasRole(requiredRole)) {
    console.log(`🚫 Rôle insuffisant: ${currentRole} vs requis: ${requiredRole}`);
    return <Navigate to={fallback} replace />;
  }

  // Vérification permission hiérarchique
  if (minRequiredRole && !hasPermission(minRequiredRole)) {
    console.log(`🚫 Permission hiérarchique insuffisante: ${currentRole} vs requis: ${minRequiredRole}`);
    return <Navigate to={fallback} replace />;
  }

  // Vérification permission spécifique (string)
  if (requiredPermission && typeof requiredPermission === 'string' && !hasPermission(requiredPermission)) {
    console.log(`🚫 Permission spécifique insuffisante: ${currentRole} vs requis: ${requiredPermission}`);
    return <Navigate to={fallback} replace />;
  }

  // Vérification permissions multiples (array)
  if (requiredPermission && Array.isArray(requiredPermission) && !hasAnyRole(requiredPermission)) {
    console.log(`🚫 Permissions multiples insuffisantes: ${currentRole} vs requis: ${requiredPermission}`);
    return <Navigate to={fallback} replace />;
  }

  // Compatibilité legacy avec allowedRoles
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    console.log(`🚫 Rôles autorisés insuffisants: ${currentRole} vs requis: ${allowedRoles}`);
    
    // Redirection intelligente selon le rôle
    let redirectPath = fallback;
    if (currentRole === 'super-admin' || currentRole === 'admin') {
      redirectPath = '/admin';
    } else if (currentRole === 'membre' || currentRole === 'registered-user') {
      redirectPath = '/member';
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  // === ACCÈS AUTORISÉ ===
  console.log('✅ Permission accordée pour:', location.pathname);
  return children;
};

export default PermissionGuard;

/**
 * Version avec message d'erreur par défaut pour l'affichage conditionnel
 */
export const PermissionGuardWithError = ({ 
  children, 
  permission, 
  role, 
  minRole,
  errorMessage = "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
  className = ''
}) => {
  return (
    <PermissionGuard
      requiredPermission={permission}
      requiredRole={role}
      minRequiredRole={minRole}
      fallback={
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Accès restreint</span>
          </div>
          <p className="mt-1 text-sm">{errorMessage}</p>
        </div>
      }
      showFallback={true}
      className={className}
      mode="component"
    >
      {children}
    </PermissionGuard>
  );
};