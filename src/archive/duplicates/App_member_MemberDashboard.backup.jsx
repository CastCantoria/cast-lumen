import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

const MemberDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Member Dashboard</h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <p>Tableau de bord Membre - En construction</p>
          {userProfile && (
            <p className="mt-4">Connecté en tant que: {userProfile.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
