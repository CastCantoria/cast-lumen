// src/components/auth/RoleGuard.jsx
import React from 'react';
import usePermissions from '../../hooks/usePermissions';
import { ROLE_HIERARCHY } from '../../config/roles';
import { Navigate } from 'react-router-dom';

/**
 * Composant RoleGuard - Protège le contenu en fonction des rôles requis
 * 
 * @param {Object} props
 * @param {string|string[]} props.roles - Rôle ou liste des rôles requis
 * @param {string} [props.fallback] - Chemin de redirection en cas de refus (par défaut: /unauthorized)
 * @param {React.ReactNode} props.children - Contenu à afficher si l'accès est autorisé
 * @param {boolean} [props.requireAll=false] - Si vrai, tous les rôles sont requis. Si faux, un seul suffit.
 * @param {React.ReactNode} [props.placeholder] - Élément à afficher si l'accès est refusé (au lieu de rediriger)
 * @param {boolean} [props.silent=false] - Si vrai, n'affiche rien au lieu de rediriger ou d'afficher le placeholder
 * @param {boolean} [props.minRole=true] - Si vrai, considère le rôle comme niveau minimum requis
 */
const RoleGuard = ({
  roles,
  fallback = '/unauthorized',
  children,
  requireAll = false,
  placeholder = null,
  silent = false,
  minRole = true
}) => {
  const { hasRole } = usePermissions();
  
  // Convertir un rôle unique en tableau
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  // Vérifier les rôles
  const hasAccess = requireAll
    ? requiredRoles.every(role => hasRole(role))
    : requiredRoles.some(role => hasRole(role));

  if (!hasAccess) {
    if (silent) return null;
    if (placeholder) return placeholder;
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default RoleGuard;