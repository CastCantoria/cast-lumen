// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import { useAuthorization } from '../../hooks/useAuthorization';
import SuperAdminView from './views/SuperAdminView';
import AdminView from './views/AdminView';
import MemberView from './views/MemberView';
import UserView from './views/UserView';
import LoadingSpinner from '../ui/LoadingSpinner';

const Dashboard = () => {
  const { currentRole, isSuperAdmin, isAdmin, isMember, loading } = useAuthorization();

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log('🎯 Dashboard - Rôle détecté:', currentRole);

  // Afficher la vue correspondante au rôle
  const renderDashboardView = () => {
    if (isSuperAdmin) {
      return <SuperAdminView />;
    }
    
    if (isAdmin) {
      return <AdminView />;
    }
    
    if (isMember) {
      return <MemberView />;
    }
    
    return <UserView />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header du Dashboard */}
      <DashboardHeader />
      
      {/* Contenu dynamique selon le rôle */}
      <div className="container mx-auto px-4 py-8">
        {renderDashboardView()}
      </div>
    </div>
  );
};

// Header commun à tous les dashboards
const DashboardHeader = () => {
  const { currentRole, userProfile } = useAuthorization();
  
  const roleLabels = {
    'super-admin': '👑 Super Administrateur',
    'admin': '⚡ Administrateur', 
    'membre': '🎵 Membre Actif',
    'registered-user': '🌟 Utilisateur'
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tableau de Bord C.A.S.T.
            </h1>
            <p className="text-gray-600">
              {roleLabels[currentRole] || 'Tableau de Bord'} • {userProfile?.email}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {currentRole?.replace('-', ' ').toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Dashboard;