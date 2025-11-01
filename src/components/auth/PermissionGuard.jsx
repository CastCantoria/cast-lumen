// src/components/auth/PermissionGuard.jsx
import React from 'react';
import usePermissions from '../../hooks/usePermissions';
import { ROLE_PERMISSIONS } from '../../config/roles';
import { Navigate } from 'react-router-dom';

/**
 * Composant PermissionGuard - Protège le contenu en fonction des permissions requises
 * 
 * @param {Object} props
 * @param {string[]} props.permissions - Liste des permissions requises
 * @param {string} [props.fallback] - Chemin de redirection en cas de refus (par défaut: /unauthorized)
 * @param {React.ReactNode} props.children - Contenu à afficher si l'accès est autorisé
 * @param {boolean} [props.requireAll=true] - Si vrai, toutes les permissions sont requises. Si faux, une seule suffit.
 * @param {React.ReactNode} [props.placeholder] - Élément à afficher si l'accès est refusé (au lieu de rediriger)
 * @param {boolean} [props.silent=false] - Si vrai, n'affiche rien au lieu de rediriger ou d'afficher le placeholder
 */
const PermissionGuard = ({
  permissions = [],
  fallback = '/unauthorized',
  children,
  requireAll = true,
  placeholder = null,
  silent = false
}) => {
  const { hasPermission } = usePermissions();

  // Vérifier les permissions
  const hasAccess = requireAll
    ? permissions.every(perm => hasPermission(perm))
    : permissions.some(perm => hasPermission(perm));

  if (!hasAccess) {
    if (silent) return null;
    if (placeholder) return placeholder;
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default PermissionGuard;