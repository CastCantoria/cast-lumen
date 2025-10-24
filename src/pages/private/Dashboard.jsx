import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/NewAuthContext';

// Import corrects basés sur ta structure réelle
import SuperAdminDashboard from '../dashboard/super-admin/SuperAdminDashboard';
import AdminDashboard from '../dashboard/admin/AdminDashboard';
import MemberDashboard from '../dashboard/member/MemberDashboard';
import UserDashboard from '../dashboard/user/UserDashboard';

/**
 * Page Dashboard privée
 * Gère dynamiquement l’affichage du bon tableau de bord selon le rôle utilisateur.
 * Redirige automatiquement en cas d’absence de profil ou d’accès non autorisé.
 */
const Dashboard = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();

  // 🧭 Sécurité : redirection si aucun utilisateur ou rôle non valide
  useEffect(() => {
    if (!loading) {
      if (!userProfile) {
        navigate('/login');
      } else if (!['super-admin', 'admin', 'membre', 'member', 'user'].includes(userProfile.role?.toLowerCase())) {
        navigate('/unauthorized');
      }
    }
  }, [userProfile, loading, navigate]);

  // 🌀 Loader pendant la récupération du profil
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🚦 Sélecteur intelligent de tableau de bord selon le rôle
  const renderDashboardByRole = () => {
    const role = userProfile?.role?.toLowerCase() || 'user';

    switch (role) {
      case 'super-admin':
        return <SuperAdminDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'membre':
      case 'member': // compatibilité FR / EN
        return <MemberDashboard />;
      case 'user':
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboardByRole()}
    </div>
  );
};

export default Dashboard;
