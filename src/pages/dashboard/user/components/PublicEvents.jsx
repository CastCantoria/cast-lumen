// src/pages/dashboard/user/components/PublicEvents.jsx
import React from 'react';

const PublicEvents = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎪 Activités</h3>
      <div className="space-y-3">
        <div className="flex items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-2xl mr-3">🎵</span>
          <div>
            <p className="font-medium text-gray-900">Atelier Chant</p>
            <p className="text-sm text-gray-600">Tous les mercredis</p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-2xl mr-3">👥</span>
          <div>
            <p className="font-medium text-gray-900">Rencontres</p>
            <p className="text-sm text-gray-600">Événements communautaires</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEvents;