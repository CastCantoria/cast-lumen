import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

const UserDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Mon Tableau de Bord</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Tableau de bord utilisateur - En construction</p>
          {userProfile && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Rôle:</strong> {userProfile.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
