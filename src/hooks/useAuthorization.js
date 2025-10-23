import { useAuth } from '../contexts/AuthContext';

export const useAuthorization = () => {
  const { 
    userProfile, 
    isAuthenticated, 
    isAdmin, 
    isSuperAdmin, 
    isMember,
    isCoreTeam 
  } = useAuth();
  
  const currentRole = userProfile?.role || 'public';
  
  // Fonction pour vérifier un rôle spécifique
  const hasRole = (role) => currentRole === role;
  
  // Fonction pour vérifier plusieurs rôles
  const hasAnyRole = (roles) => {
    if (!Array.isArray(roles)) return false;
    return roles.includes(currentRole);
  };
  
  // Fonction pour vérifier la hiérarchie des permissions
  const hasPermission = (requiredRole) => {
    const roleHierarchy = {
      'public': 0,
      'registered-user': 1,
      'membre': 2,
      'core-team': 3,
      'admin': 4,
      'super-admin': 5
    };
    
    const userLevel = roleHierarchy[currentRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  };

  // Alias pour la compatibilité avec l'ancien code
  const can = hasPermission;
  const isRole = hasRole;
  const isAtLeast = hasPermission;

  return {
    // Rôle actuel
    currentRole,
    
    // Vérifications de rôle booléennes
    isSuperAdmin,
    isAdmin,
    isMember,
    isCoreTeam,
    isAuthenticated,
    
    // Fonctions de vérification (nouveau système)
    hasRole,
    hasAnyRole,
    hasPermission,
    
    // Alias pour compatibilité (ancien système)
    can,
    isRole,
    isAtLeast,
    
    // Données utilisateur
    userProfile
  };
};