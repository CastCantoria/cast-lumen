import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getCompatibleRole } from '../../config/roles';

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  minRequiredRole 
}) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si non connecté, rediriger vers login
  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Vérification par rôle spécifique
  if (requiredRole) {
    const userRole = getCompatibleRole(userProfile?.role);
    const required = getCompatibleRole(requiredRole);
    if (userRole !== required) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Vérification par rôle minimum
  const roleHierarchy = {
    'registered-user': 1,
    'membre': 2,
    'admin': 3,
    'super-admin': 4
  };

  if (minRequiredRole) {
  const userRole = getCompatibleRole(userProfile?.role);
  const required = getCompatibleRole(minRequiredRole);
  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[required] || 0;
    
    if (userLevel < requiredLevel) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;