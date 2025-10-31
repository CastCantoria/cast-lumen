// src/components/AuthRedirectHandler.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Correction ici

const AuthRedirectHandler = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    const currentPath = location.pathname;

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
    if (!currentUser) {
      if (currentPath.startsWith('/dashboard') || 
          currentPath.startsWith('/profile') || 
          currentPath.startsWith('/admin')) {
        navigate('/login');
      }
      return;
    }

    // Si l'utilisateur est connecté mais n'a pas de profil chargé
    if (!userProfile) {
      return;
    }

    // Redirections basées sur le rôle
    const userRole = userProfile.role;

    // Si l'utilisateur est sur une page de login/register alors qu'il est déjà connecté
    if (currentUser && (currentPath === '/login' || currentPath === '/register')) {
      navigate('/dashboard');
      return;
    }

    // Protection des routes admin
    if (currentPath.startsWith('/admin') && !['super-admin', 'admin'].includes(userRole)) {
      navigate('/unauthorized');
      return;
    }

    // Redirection depuis les anciennes routes
    const oldRoutes = {
      '/app/dashboard': '/dashboard',
      '/app/super-admin': '/dashboard',
      '/app/admin': '/dashboard',
      '/app/member': '/dashboard',
      '/app/profile': '/profile',
      '/super-admin': '/dashboard',
      '/admin': '/dashboard',
      '/member': '/dashboard'
    };

    if (oldRoutes[currentPath]) {
      navigate(oldRoutes[currentPath], { replace: true });
    }

  }, [currentUser, userProfile, loading, navigate, location]);

  return null;
};

export default AuthRedirectHandler;