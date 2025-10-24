import React, { useState } from 'react';

const PartitionManager = () => {
  const [partitions, setPartitions] = useState([
    {
      id: 1,
      title: 'Ave Maria',
      composer: 'Franz Schubert',
      category: 'classique',
      difficulty: 'intermediaire',
      file: 'ave-maria.pdf'
    },
    {
      id: 2,
      title: 'Hallelujah',
      composer: 'Leonard Cohen',
      category: 'contemporain',
      difficulty: 'facile',
      file: 'hallelujah.pdf'
    }
  ]);

  const [newPartition, setNewPartition] = useState({
    title: '',
    composer: '',
    category: 'classique',
    difficulty: 'facile'
  });

  const handleAddPartition = (e) => {
    e.preventDefault();
    const partition = {
      id: partitions.length + 1,
      ...newPartition,
      file: `${newPartition.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
    };
    setPartitions(prev => [...prev, partition]);
    setNewPartition({ title: '', composer: '', category: 'classique', difficulty: 'facile' });
    alert('Partition ajoutée avec succès!');
  };

  const handleDeletePartition = (id) => {
    setPartitions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Partitions</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire d'ajout */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Ajouter une Partition</h3>
          
          <form onSubmit={handleAddPartition} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                value={newPartition.title}
                onChange={(e) => setNewPartition(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Titre de la partition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compositeur
              </label>
              <input
                type="text"
                value={newPartition.composer}
                onChange={(e) => setNewPartition(prev => ({ ...prev, composer: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nom du compositeur"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={newPartition.category}
                  onChange={(e) => setNewPartition(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="classique">Classique</option>
                  <option value="contemporain">Contemporain</option>
                  <option value="sacree">Sacrée</option>
                  <option value="traditionnel">Traditionnel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulté
                </label>
                <select
                  value={newPartition.difficulty}
                  onChange={(e) => setNewPartition(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="facile">Facile</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avance">Avancé</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter la partition
            </button>
          </form>
        </div>

        {/* Liste des partitions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Partitions ({partitions.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {partitions.map(partition => (
              <div key={partition.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-semibold">{partition.title}</div>
                  <div className="text-sm text-gray-600">
                    {partition.composer} • {partition.category} • {partition.difficulty}
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePartition(partition.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  🗑️
                </button>
              </div>
            ))}
            
            {partitions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune partition disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartitionManager;