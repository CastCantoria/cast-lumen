import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

const RepertoireManagement = () => {
  const [repertoire, setRepertoire] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRepertoire();
  }, []);

  const loadRepertoire = async () => {
    try {
      const repSnapshot = await getDocs(collection(db, 'repertoire'));
      const repData = repSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRepertoire(repData);
    } catch (error) {
      console.error('Erreur chargement répertoire:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      await addDoc(collection(db, 'repertoire'), {
        ...itemData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      loadRepertoire();
      setShowAddModal(false);
    } catch (error) {
      console.error('Erreur ajout répertoire:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleSaveItem = async (itemData) => {
    try {
      const itemRef = doc(db, 'repertoire', itemData.id);
      await updateDoc(itemRef, {
        ...itemData,
        updatedAt: new Date()
      });
      loadRepertoire();
      setEditingItem(null);
    } catch (error) {
      console.error('Erreur mise à jour répertoire:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce morceau ?')) {
      try {
        await deleteDoc(doc(db, 'repertoire', itemId));
        setRepertoire(repertoire.filter(r => r.id !== itemId));
      } catch (error) {
        console.error('Erreur suppression répertoire:', error);
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Titre', 'Compositeur', 'Genre', 'Durée', 'Difficulté', 'Statut'],
      ...repertoire.map(item => [
        item.id,
        item.title,
        item.composer,
        item.genre,
        item.duration,
        item.difficulty,
        item.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repertoire-cast.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredRepertoire = repertoire.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.composer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cast-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du répertoire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cast-green">Gestion du Répertoire</h1>
              <p className="text-gray-600 mt-2">Administrez le répertoire musical</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-cast-green text-white py-2 px-4 rounded-lg hover:bg-cast-gold transition-colors duration-300"
              >
                ➕ Ajouter
              </button>
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                📊 Exporter CSV
              </button>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <input
            type="text"
            placeholder="🔍 Rechercher un morceau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
          />
        </div>

        {/* Tableau du répertoire */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Morceau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compositeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulté
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRepertoire.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.composer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {item.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.difficulty === 'facile' ? 'bg-green-100 text-green-800' :
                        item.difficulty === 'moyen' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'appris' ? 'bg-green-100 text-green-800' :
                        item.status === 'en-cours' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-cast-green hover:text-cast-gold transition-colors"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRepertoire.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun morceau trouvé</h3>
              <p className="text-gray-500">Commencez par ajouter votre premier morceau au répertoire.</p>
            </div>
          )}
        </div>

        {/* Modals pour ajouter/modifier */}
        {showAddModal && (
          <RepertoireModal
            onSave={handleAddItem}
            onClose={() => setShowAddModal(false)}
          />
        )}

        {editingItem && (
          <RepertoireModal
            item={editingItem}
            onSave={handleSaveItem}
            onClose={() => setEditingItem(null)}
          />
        )}
      </div>
    </div>
  );
};

// Modal pour répertoire
const RepertoireModal = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState(item || {
    title: '',
    composer: '',
    genre: 'classique',
    duration: '',
    difficulty: 'moyen',
    status: 'en-cours'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-cast-green mb-4">
          {item ? 'Modifier le morceau' : 'Nouveau morceau'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compositeur
            </label>
            <input
              type="text"
              value={formData.composer}
              onChange={(e) => setFormData({ ...formData, composer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              >
                <option value="classique">Classique</option>
                <option value="sacree">Sacrée</option>
                <option value="contemporain">Contemporain</option>
                <option value="traditionnel">Traditionnel</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
                placeholder="Ex: 3:45"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulté
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              >
                <option value="facile">Facile</option>
                <option value="moyen">Moyen</option>
                <option value="difficile">Difficile</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              >
                <option value="en-cours">En cours</option>
                <option value="appris">Appris</option>
                <option value="a-reviser">À réviser</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cast-green text-white rounded-lg hover:bg-cast-gold transition-colors"
            >
              {item ? 'Sauvegarder' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepertoireManagement;