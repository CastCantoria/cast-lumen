// src/components/Dashboard/views/UserView.jsx
import React from 'react';

const UserView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🌟 Bienvenue sur C.A.S.T.</h2>
        <p className="opacity-90">Votre espace personnel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold mb-4">Mes Informations</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Statut:</span>
              <span className="font-medium">Utilisateur enregistré</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Membre depuis:</span>
              <span className="font-medium">25/10/2024</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold mb-4">Accès Rapide</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
              🎵 Voir le répertoire
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
              📅 Événements à venir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;