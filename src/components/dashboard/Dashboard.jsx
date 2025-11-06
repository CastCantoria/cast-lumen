import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const Dashboard = () => {
  const { currentUser, userProfile, loading } = useAuth();
  
  console.log('📊 Dashboard - Loading:', loading);
  console.log('📊 Dashboard - CurrentUser:', currentUser);
  console.log('📊 Dashboard - UserProfile:', userProfile);
  console.log('📊 Dashboard - Rôle détecté:', userProfile?.role);
  
  // État de chargement amélioré
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 text-lg">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }
  
  // Si pas d'utilisateur connecté
  if (!currentUser) {
    console.log('🚫 Dashboard - Non connecté, redirection vers /login');
    return <Navigate to="/login" replace />;
  }
  
  // Si le profil utilisateur n'est pas encore chargé
  if (!userProfile) {
    console.log('⏳ Dashboard - Profil utilisateur en cours de chargement');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 text-lg">Finalisation de votre profil...</p>
          <p className="text-sm text-gray-500 mt-2">
            Connecté en tant que: {currentUser.email}
          </p>
        </div>
      </div>
    );
  }
  
  // Vérification que le rôle existe
  if (!userProfile.role) {
    console.error('❌ Dashboard - Rôle non défini dans userProfile:', userProfile);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Rôle non défini</h2>
          <p className="text-gray-600 mb-4">
            Votre profil ne contient pas de rôle défini. Veuillez contacter l'administrateur.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Actualiser la page
          </button>
        </div>
      </div>
    );
  }
  
  console.log('🎯 Dashboard - Redirection selon rôle:', userProfile.role);
  
  // Redirection basée sur le rôle avec fallbacks
  const getDashboardPath = () => {
    switch (userProfile.role) {
      case 'super-admin':
        return '/dashboard/super-admin';
      case 'admin':
        return '/dashboard/admin';
      case 'member':
        return '/dashboard/member';
      case 'user':
        return '/dashboard/user';
      default:
        console.warn('⚠️ Dashboard - Rôle inconnu, utilisation du dashboard user:', userProfile.role);
        return '/dashboard/user';
    }
  };
  
  const dashboardPath = getDashboardPath();
  console.log(`📍 Dashboard - Redirection vers: ${dashboardPath}`);
  
  return <Navigate to={dashboardPath} replace />;
};

export default Dashboard;