// src/components/Dashboard/views/AdminView.jsx
import React from 'react';

const AdminView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">⚡ Administration</h2>
        <p className="opacity-90">Gestion opérationnelle de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="text-2xl font-bold text-gray-900">45</div>
          <div className="text-gray-600">Membres Actifs</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-gray-600">Événements à venir</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="text-2xl font-bold text-gray-900">8</div>
          <div className="text-gray-600">Nouvelles demandes</div>
        </div>
      </div>

      {/* Sections Admin */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h3 className="text-lg font-semibold mb-4">Outils d'Administration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center hover:bg-gray-50 rounded-lg border">
            <div className="text-2xl mb-2">👥</div>
            <div>Gérer Membres</div>
          </button>
          <button className="p-4 text-center hover:bg-gray-50 rounded-lg border">
            <div className="text-2xl mb-2">🎭</div>
            <div>Événements</div>
          </button>
          <button className="p-4 text-center hover:bg-gray-50 rounded-lg border">
            <div className="text-2xl mb-2">📊</div>
            <div>Statistiques</div>
          </button>
          <button className="p-4 text-center hover:bg-gray-50 rounded-lg border">
            <div className="text-2xl mb-2">📝</div>
            <div>Contenu</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminView;