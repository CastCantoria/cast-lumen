import { useAuth } from '../contexts/AuthContext';

// Hook d'autorisation - wrapper autour de useAuth pour une sémantique plus claire
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
  
  return {
    currentUser,
    userProfile,
    loading,
    hasRole,
    isAdmin,
    isMember
  };
};

export default useAuthorization;
