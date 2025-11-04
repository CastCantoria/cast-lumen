import React, { useState } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const MyPartitions = () => {
  const { hasPermission } = usePermissions();
  const [partitions, setPartitions] = useState([
    {
      id: 1,
      title: 'Ave Maria',
      composer: 'Franz Schubert',
      voice: 'Soprano',
      difficulty: 'intermediate',
      lastPracticed: '2024-01-14',
      status: 'learning'
    },
    {
      id: 2,
      title: 'Hallelujah Chorus',
      composer: 'G.F. Handel',
      voice: 'Tous',
      difficulty: 'advanced',
      lastPracticed: '2024-01-12',
      status: 'review'
    },
    {
      id: 3,
      title: 'O Magnum Mysterium',
      composer: 'Tomas Luis de Victoria',
      voice: 'Alto',
      difficulty: 'beginner',
      lastPracticed: null,
      status: 'new'
    }
  ]);

  const [filter, setFilter] = useState('all');

  if (!hasPermission('partitions:view')) {
    return null;
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors.beginner;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      learning: 'bg-purple-100 text-purple-800',
      review: 'bg-orange-100 text-orange-800',
      mastered: 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.new;
  };

  const filteredPartitions = filter === 'all' 
    ? partitions 
    : partitions.filter(p => p.status === filter);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🎼 Mes Partitions</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{partitions.length} partition(s)</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes</option>
            <option value="new">Nouvelles</option>
            <option value="learning">En apprentissage</option>
            <option value="review">À réviser</option>
            <option value="mastered">Maîtrisées</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPartitions.map((partition) => (
          <div key={partition.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{partition.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{partition.composer}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(partition.difficulty)}`}>
                    {partition.difficulty === 'beginner' ? 'Débutant' :
                     partition.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {partition.voice}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(partition.status)}`}>
                    {partition.status === 'new' ? 'Nouvelle' :
                     partition.status === 'learning' ? 'En apprentissage' :
                     partition.status === 'review' ? 'À réviser' : 'Maîtrisée'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                {partition.lastPracticed ? (
                  <div className="text-sm text-gray-500">
                    Dernière pratique:<br />
                    {partition.lastPracticed}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Jamais pratiquée</div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  <span className="mr-1">📖</span>
                  Voir
                </button>
                <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                  <span className="mr-1">⬇️</span>
                  Télécharger
                </button>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                  <span className="mr-1">🎵</span>
                  Écouter
                </button>
              </div>
              <button className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center">
                <span className="mr-1">✓</span>
                Marquer comme pratiquée
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPartitions.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎼</div>
          <p className="text-gray-500">Aucune partition trouvée</p>
          <p className="text-sm text-gray-400 mt-1">
            {filter !== 'all' ? `Aucune partition avec le statut "${filter}"` : 'Aucune partition disponible'}
          </p>
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Progression</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {partitions.filter(p => p.status === 'mastered').length}
            </div>
            <div className="text-xs text-gray-500">Maîtrisées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {partitions.filter(p => p.lastPracticed).length}
            </div>
            <div className="text-xs text-gray-500">Pratiquées</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPartitions;