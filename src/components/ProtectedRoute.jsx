import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../hooks/useRole';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const { currentUser, loading } = useAuth();
  const { hasRole } = useRole();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cast-green"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    // Rediriger selon le rôle de l'utilisateur
    let redirectPath = '/';
    if (currentUser.role?.startsWith('admin')) {
      redirectPath = '/admin/dashboard';
    } else if (currentUser.role === 'member') {
      redirectPath = '/member/dashboard';
    }
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;