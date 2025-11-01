import React from 'react';
import AdminNavigation from '../../../components/admin/AdminNavigation';
import AdminSidebar from '../../../components/admin/AdminSidebar';

const SuperAdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <AdminNavigation />
        <div className="p-8">
          <h1 className="text-3xl font-semibold mb-6">Dashboard Super Admin</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Statistiques */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
              {/* Ajoutez vos statistiques ici */}
            </div>

            {/* Actions rapides */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
              {/* Ajoutez vos actions rapides ici */}
            </div>

            {/* Notifications */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              {/* Ajoutez vos notifications ici */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;