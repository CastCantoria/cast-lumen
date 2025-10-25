// src/components/Dashboard/views/SuperAdminView.jsx
import React from 'react';

const SuperAdminView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">👑 Super Administration</h2>
        <p className="opacity-90">Gestion complète de la plateforme C.A.S.T.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Statistiques */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="text-2xl font-bold text-gray-900">150</div>
          <div className="text-gray-600">Utilisateurs Total</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="text-2xl font-bold text-gray-900">5</div>
          <div className="text-gray-600">Administrateurs</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-gray-600">Core Team</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="text-2xl font-bold text-gray-900">25</div>
          <div className="text-gray-600">Événements</div>
        </div>
      </div>

      {/* Sections Super-Admin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold mb-4">👥 Gestion des Membres</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
              ✅ Gérer les Admissions
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
              👑 Gérer les Super-Admins
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold mb-4">🎭 Gestion des Événements</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
              🎵 Créer un Événement
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
              📅 Calendrier des Concerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminView;