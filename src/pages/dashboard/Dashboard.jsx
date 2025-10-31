import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, userProfile, loading } = useAuth();

  // 🔍 LOGS DE DÉBOGAGE
  console.log("🔍 Dashboard - Loading:", loading);
  console.log("🔍 Dashboard - CurrentUser:", currentUser?.email);
  console.log("🔍 Dashboard - UserProfile:", userProfile);
  console.log("🔍 Dashboard - Rôle:", userProfile?.role);

  // État de chargement avec UI améliorée
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">
            Chargement de votre tableau de bord...
          </div>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, rediriger vers login
  if (!currentUser) {
    console.log("🔍 Dashboard - Redirection vers /login (pas de currentUser)");
    return <Navigate to="/login" replace />;
  }

  // Si pas de profil utilisateur, attendre ou rediriger
  if (!userProfile) {
    console.log("🔍 Dashboard - Profil utilisateur non chargé, attente...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">
            Chargement de votre profil...
          </div>
        </div>
      </div>
    );
  }

  // Redirection basée sur le rôle
  console.log(`🔍 Dashboard - Redirection vers /dashboard/${userProfile.role}`);
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
      // Fallback pour les rôles non reconnus
      console.warn(`🔍 Dashboard - Rôle non reconnu: ${userProfile.role}, redirection vers user dashboard`);
      return <Navigate to="/dashboard/user" replace />;
  }
};

export default Dashboard;