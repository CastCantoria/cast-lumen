// src/pages/dashboard/member/components/PersonalSchedule.jsx
import React from 'react';

const PersonalSchedule = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Mes Répétitions</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Répétition Soprano</p>
            <p className="text-sm text-gray-600">Lundi - 18:00-20:00</p>
          </div>
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Confirmé</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Répétition Générale</p>
            <p className="text-sm text-gray-600">Samedi - 14:00-17:00</p>
          </div>
          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">En attente</span>
        </div>
      </div>
    </div>
  );
};

export default PersonalSchedule;