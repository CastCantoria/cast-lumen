// src/components/RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Correction ici

const RequireAuth = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si un rôle spécifique est requis
  if (requiredRole && userProfile?.role !== requiredRole) {
    // Si l'utilisateur est super-admin, il a accès à tout
    if (userProfile?.role === 'super-admin') {
      return children;
    }
    
    // Sinon, vérifier le rôle
    if (userProfile?.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si une permission spécifique est requise
  if (requiredPermission) {
    // Super-admin a toutes les permissions
    if (userProfile?.role === 'super-admin') {
      return children;
    }

    const userPermissions = userProfile?.permissions || [];
    
    // Vérifier si l'utilisateur a la permission requise
    if (!userPermissions.includes(requiredPermission) && !userPermissions.includes('all')) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default RequireAuth;