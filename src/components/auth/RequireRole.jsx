import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const RequireRole = ({ children, role }) => {
  const { currentUser, userProfile, loading } = useAuth();
  
  console.log('🎭 RequireRole - Rôle requis:', role);
  console.log('🎭 RequireRole - UserProfile:', userProfile);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    console.log('🚫 RequireRole - Non connecté, redirection login');
    return <Navigate to="/login" replace />;
  }
  
  if (!userProfile) {
    console.log('⏳ RequireRole - Profil en chargement');
    return <LoadingSpinner />;
  }
  
  if (userProfile.role !== role) {
    console.log('🚫 RequireRole - Rôle insuffisant, redirection unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default RequireRole;
