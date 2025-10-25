import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

const AdminDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <p>Tableau de bord Administrateur - En construction</p>
          {userProfile && (
            <p className="mt-4">Connecté en tant que: {userProfile.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
