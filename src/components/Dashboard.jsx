// src/components/Dashboard.jsx
import React from 'react';
import { useAuthorization } from '../hooks/useAuthorization';
import { ROLES } from '../config/roles';
import SuperAdminDashboard from '../pages/dashboard/super-admin/SuperAdminDashboard';
import AdminDashboard from '../pages/dashboard/admin/AdminDashboard';
import UserDashboard from '../pages/dashboard/user/UserDashboard';

// Placeholder for core team dashboard (component not present yet)
const CoreTeamDashboard = () => (
  <div className="min-h-screen bg-gray-50 pt-20">
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Core Team - En construction</h1>
        <p className="text-gray-600">Cette section sera disponible prochainement.</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { currentRole, hasRole, hasMinRole, isAuthenticated } = useAuthorization();

  // If not authenticated, show generic fallback (should be protected by route anyway)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Bienvenue sur C.A.S.T.</h1>
            <p className="text-gray-600 mb-6">Connectez-vous pour accéder à votre espace personnalisé</p>
          </div>
        </div>
      </div>
    );
  }

  // Super-admins see the full super-admin dashboard
  if (hasRole(ROLES.SUPER_ADMIN)) {
    return <SuperAdminDashboard />;
  }

  // Admins see the admin dashboard
  if (hasRole(ROLES.ADMIN)) {
    return <AdminDashboard />;
  }

  // Core team (if present)
  if (hasRole(ROLES.CORE_TEAM)) {
    return <CoreTeamDashboard />;
  }

  // Registered users or members
  return <UserDashboard />;

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