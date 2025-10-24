// src/components/Dashboard.jsx
import React from 'react';
import { useAuthorization } from '../hooks/useAuthorization';
import { ROLES, PERMISSIONS } from '../config/roles';
import SuperAdminDashboard from './admin/SuperAdminDashboard';
import AdminDashboard from './admin/AdminDashboard';
import CoreTeamDashboard from './CoreTeamDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { isRole, can } = useAuthorization();

  if (isRole(ROLES.SUPER_ADMIN) || isRole(ROLES.ADMIN)) {
    return <SuperAdminDashboard />;
  }

  if (isRole(ROLES.CORE_TEAM)) {
    return <CoreTeamDashboard />;
  }

  if (isRole(ROLES.REGISTERED_USER)) {
    return <UserDashboard />;
  }

  // Fallback pour les visiteurs
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Bienvenue sur C.A.S.T.</h1>
          <p className="text-gray-600 mb-6">
            Connectez-vous pour accéder à votre espace personnalisé
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Se Connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;