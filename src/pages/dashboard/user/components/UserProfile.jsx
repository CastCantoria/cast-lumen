// src/pages/dashboard/user/components/UserProfile.jsx
import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

const UserProfile = () => {
  const { userProfile } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Mon Compte</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Nom:</span>
          <span className="font-medium">{userProfile?.displayName || 'Non défini'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Email:</span>
          <span className="font-medium">{userProfile?.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Rôle:</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Utilisateur</span>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors mt-4">
          Modifier mon profil
        </button>
      </div>
    </div>
  );
};

export default UserProfile;