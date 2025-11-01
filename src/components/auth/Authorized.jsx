// src/components/auth/Authorized.jsx
import React from 'react';
import RoleGuard from './RoleGuard';
import PermissionGuard from './PermissionGuard';

/**
 * Composant Authorized - Combine RoleGuard et PermissionGuard pour une protection complète
 * 
 * @param {Object} props
 * @param {string|string[]} [props.roles] - Rôle(s) requis
 * @param {string|string[]} [props.permissions] - Permission(s) requise(s)
 * @param {string} [props.fallback] - Chemin de redirection en cas de refus
 * @param {React.ReactNode} props.children - Contenu à protéger
 * @param {boolean} [props.requireAllRoles=false] - Si true, tous les rôles sont requis
 * @param {boolean} [props.requireAllPermissions=true] - Si true, toutes les permissions sont requises
 * @param {React.ReactNode} [props.placeholder] - Élément à afficher si l'accès est refusé
 * @param {boolean} [props.silent=false] - Si true, ne rien afficher en cas de refus
 * @param {boolean} [props.minRole=true] - Considérer le rôle comme niveau minimum
 */
const Authorized = ({
  roles,
  permissions,
  fallback = '/unauthorized',
  children,
  requireAllRoles = false,
  requireAllPermissions = true,
  placeholder = null,
  silent = false,
  minRole = true
}) => {
  // Si ni rôles ni permissions ne sont spécifiés, autoriser l'accès
  if (!roles && !permissions) {
    return children;
  }

  // Créer des wrappers imbriqués pour les rôles et permissions
  let content = children;

  // Wrapper de permissions si spécifié
  if (permissions) {
    content = (
      <PermissionGuard
        permissions={Array.isArray(permissions) ? permissions : [permissions]}
        fallback={fallback}
        requireAll={requireAllPermissions}
        placeholder={placeholder}
        silent={silent}
      >
        {content}
      </PermissionGuard>
    );
  }

  // Wrapper de rôles si spécifié
  if (roles) {
    content = (
      <RoleGuard
        roles={roles}
        fallback={fallback}
        requireAll={requireAllRoles}
        placeholder={placeholder}
        silent={silent}
        minRole={minRole}
      >
        {content}
      </RoleGuard>
    );
  }

  return content;
};

export default Authorized;