import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const Dashboard = () => {
  const { currentUser, userProfile, loading } = useAuth();
  
  console.log('📊 Dashboard - Loading:', loading);
  console.log('📊 Dashboard - CurrentUser:', currentUser?.email);
  console.log('📊 Dashboard - UserProfile:', userProfile);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    console.log('🚫 Dashboard - Non connecté, redirection login');
    return <Navigate to="/login" replace />;
  }
  
  if (!userProfile) {
    console.log('⏳ Dashboard - Profil en cours de chargement');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }
  
  console.log('🎯 Dashboard - Redirection selon rôle:', userProfile.role);
  
  switch (userProfile.role) {
    case 'super-admin':
      return <Navigate to="/dashboard/super-admin" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'member':
      return <Navigate to="/dashboard/member" replace />;
    case 'user':
      return <Navigate to="/dashboard/user" replace />;
    default:
      console.warn('⚠️ Rôle inconnu, redirection vers user:', userProfile.role);
      return <Navigate to="/dashboard/user" replace />;
  }
};

export default Dashboard;
