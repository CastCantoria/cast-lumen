// src/pages/dashboard/user/components/UserResources.jsx
import React from 'react';

const UserResources = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Ressources</h3>
      <div className="space-y-3">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="font-medium text-gray-900">Présentation CAST</p>
          <p className="text-sm text-gray-600">Découvrez notre chorale</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="font-medium text-gray-900">Répertoire Public</p>
          <p className="text-sm text-gray-600">Extraits musicaux</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="font-medium text-gray-900">Devenir Membre</p>
          <p className="text-sm text-gray-600">Processus d'admission</p>
        </div>
      </div>
    </div>
  );
};

export default UserResources;