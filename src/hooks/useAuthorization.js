import { useAuth } from '../contexts/AuthContext';

export const useAuthorization = () => {
  const { currentUser, userProfile, loading } = useAuth();
  
  const hasRole = (role) => {
    return userProfile?.role === role;
  };
  
  const isAdmin = () => {
    return userProfile?.role === 'admin' || userProfile?.role === 'super-admin';
  };
  
  const isMember = () => {
    return userProfile?.role === 'member' || isAdmin();
  };

  const canAccess = (requiredRole) => {
    if (!userProfile) return false;
    
    const roleHierarchy = {
      'user': 1,
      'member': 2,
      'admin': 3,
      'super-admin': 4
    };
    
    return roleHierarchy[userProfile.role] >= roleHierarchy[requiredRole];
  };
  
  return {
    currentUser,
    userProfile,
    loading,
    hasRole,
    isAdmin,
    isMember,
    canAccess
  };
};

export default useAuthorization;