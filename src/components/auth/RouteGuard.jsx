import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PermissionService } from '../../services/permissionService';

const RouteGuard = ({ 
  children, 
  requiredPermission, 
  requiredRole,
  redirectTo = '/unauthorized' 
}) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredPermission && !PermissionService.hasPermission(userProfile?.role, requiredPermission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RouteGuard;