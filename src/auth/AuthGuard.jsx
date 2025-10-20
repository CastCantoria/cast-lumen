// src/auth/AuthGuard.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthGuard = ({ children, requiredRole = 'member' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cast-gold"></div>
        <span className="ml-4 text-cast-green">Chargement...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérification des rôles avec hiérarchie
  const roleHierarchy = {
    'visitor': 0,
    'member': 1,
    'contributor': 2,
    'admin': 3,
    'super-admin': 4
  };

  const userRoleLevel = roleHierarchy[user.role] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

  // SUPER-ADMIN a accès à tout
  if (user.role === 'super-admin') {
    return children;
  }

  // ADMIN peut gérer member et visitor
  if (user.role === 'admin' && ['member', 'visitor', 'admin'].includes(requiredRole)) {
    return children;
  }

  if (userRoleLevel < requiredRoleLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cast-green">Accès refusé</h1>
          <p className="text-gray-600 mt-2">
            Vous n'avez pas les permissions nécessaires. 
            Votre rôle: {user.role}, Requis: {requiredRole}
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;