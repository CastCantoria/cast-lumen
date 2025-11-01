// src/components/auth/RequireRole.jsx
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { ROLE_HIERARCHY, ROLE_PERMISSIONS } from '../../../config/roles';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * Composant RequireRole - Protège les routes en fonction du rôle requis
 * 
 * @param {Object} props
 * @param {string} props.role - Le rôle minimum requis pour accéder à la route
 * @param {Array<string>} [props.permissions] - Liste des permissions requises (optionnel)
 * @param {React.ReactNode} props.children - Les composants enfants à rendre si l'accès est autorisé
 */
const RequireRole = ({ role, permissions = [], children }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  // Afficher le spinner pendant le chargement
  if (loading) {
    return <LoadingSpinner />;
  }

  // Rediriger vers login si non connecté
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles en tenant compte de la hiérarchie
  const userRole = userProfile?.role || 'visitor';
  const userRoleLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredRoleLevel = ROLE_HIERARCHY[role] || 0;

  // Vérifier le niveau de rôle minimum requis
  if (userRoleLevel < requiredRoleLevel) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si des permissions spécifiques sont requises, les vérifier
  if (permissions.length > 0) {
    const hasAllPermissions = permissions.every(permission => {
      return ROLE_PERMISSIONS[userRole]?.includes(permission);
    });

    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default RequireRole;