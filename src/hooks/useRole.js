import { useAuth } from '../contexts/AuthContext';

export const useRole = () => {
  const { userRole, currentUser } = useAuth();

  const isSuperAdmin = () => userRole === 'super_admin';
  const isAdmin = () => userRole?.startsWith('admin');
  const isMember = () => userRole === 'member';
  const isVisitor = () => userRole === 'visitor';
  const isPending = () => currentUser?.status === 'pending';

  const hasRole = (allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(userRole);
  };

  const hasAnyAdminRole = () => {
    return ['super_admin', 'admin_programmation', 'admin_communication', 'admin_membres', 'admin_technique'].includes(userRole);
  };

  return {
    userRole,
    isSuperAdmin,
    isAdmin,
    isMember,
    isVisitor,
    isPending,
    hasRole,
    hasAnyAdminRole
  };
};