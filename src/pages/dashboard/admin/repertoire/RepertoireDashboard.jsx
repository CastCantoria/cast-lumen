// src/pages/app/dashboards/admin/repertoire/RepertoireDashboard.jsx
import React, { useState, useEffect } from 'react';

const RepertoireDashboard = () => {
  const [repertoire, setRepertoire] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRepertoire([
        {
          id: '1',
          title: 'Ave Maria',
          composer: 'Franz Schubert',
          genre: 'classique',
          era: 'romantique',
          difficulty: 'intermédiaire',
          voices: 'SATB'
        },
        {
          id: '2',
          title: 'Hallelujah',
          composer: 'Leonard Cohen',
          genre: 'contemporain',
          era: 'moderne',
          difficulty: 'facile',
          voices: 'SATB'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-2xl mr-3">🎼</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion du Répertoire</h2>
            <p className="text-gray-600">{repertoire.length} pièce(s) au répertoire</p>
          </div>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
          <span className="mr-2">+</span>
          Nouvelle Pièce
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <h3 className="font-semibold text-pink-900 mb-2">Pièces</h3>
          <p className="text-3xl font-bold text-pink-600">{repertoire.length}</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Compositeurs</h3>
          <p className="text-3xl font-bold text-green-600">
            {new Set(repertoire.map(item => item.composer)).size}
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Époques</h3>
          <p className="text-3xl font-bold text-blue-600">
            {new Set(repertoire.map(item => item.era)).size}
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Genres</h3>
          <p className="text-3xl font-bold text-purple-600">
            {new Set(repertoire.map(item => item.genre)).size}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {repertoire.map((piece) => (
          <div key={piece.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                <div className="text-2xl mt-1">🎵</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{piece.title}</h3>
                  <p className="text-gray-600 text-sm">Compositeur: {piece.composer}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {piece.genre}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {piece.era}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      {piece.difficulty}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      {piece.voices}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button className="p-1 text-blue-600 hover:text-blue-800" title="Modifier">
                  ✏️
                </button>
                <button className="p-1 text-red-600 hover:text-red-800" title="Supprimer">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepertoireDashboard;