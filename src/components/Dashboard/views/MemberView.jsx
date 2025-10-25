// src/components/Dashboard/views/MemberView.jsx
import React from 'react';

const MemberView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🎵 Membre Actif</h2>
        <p className="opacity-90">Espace membre de la chorale C.A.S.T.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="text-2xl font-bold text-gray-900">3</div>
          <div className="text-gray-600">Prochains répétitions</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-gray-600">Partitions à apprendre</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="text-2xl font-bold text-gray-900">2</div>
          <div className="text-gray-600">Événements confirmés</div>
        </div>
      </div>

      {/* Sections Membre */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h3 className="text-lg font-semibold mb-4">Mes Outils</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center hover:bg-gray-50 rounded-lg border">
            <div className="text-2xl mb-2">🎵</div>
            <div>Répertoire</div>
          </button>
          <button className="p-4 text-center hover:bg-gray-50 rounded-lg border">
            <div className="text-2xl mb-2">📅</div>
            <div>Calendrier</div>
          </button>
          <button className="p-4 text-center hover:bg-gray-50 rounded-lg border">
            <div className="text-2xl mb-2">📋</div>
            <div>Présences</div>
          </button>
          <button className="p-4 text-center hover:bg-gray-50 rounded-lg border">
            <div className="text-2xl mb-2">👥</div>
            <div>Contacts</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberView;