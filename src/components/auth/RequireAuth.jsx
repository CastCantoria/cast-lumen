import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const RequireAuth = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  console.log('🔐 RequireAuth - Loading:', loading);
  console.log('🔐 RequireAuth - CurrentUser:', currentUser?.email);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    console.log('🚫 RequireAuth - Non authentifié, redirection vers /login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default RequireAuth;
