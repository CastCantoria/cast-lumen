import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

const RepertoireDashboard = () => {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPiece, setEditingPiece] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    composer: '',
    arranger: '',
    genre: 'classical',
    difficulty: 'medium',
    voices: [],
    duration: '',
    year: '',
    status: 'active',
    notes: ''
  });

  const voiceOptions = ['soprano', 'alto', 'tenor', 'bass', 'mezzo-soprano', 'baritone'];
  const difficultyOptions = [
    { value: 'easy', label: 'Facile' },
    { value: 'medium', label: 'Moyen' },
    { value: 'hard', label: 'Difficile' },
    { value: 'expert', label: 'Expert' }
  ];

  useEffect(() => {
    fetchPieces();
  }, []);

  const fetchPieces = async () => {
    try {
      const piecesQuery = collection(db, 'repertoire');
      const piecesSnapshot = await getDocs(piecesQuery);
      const piecesData = piecesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPieces(piecesData);
    } catch (error) {
      console.error('Erreur chargement répertoire:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPiece) {
        await updateDoc(doc(db, 'repertoire', editingPiece.id), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, 'repertoire'), {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          performances: 0
        });
      }
      setShowForm(false);
      setEditingPiece(null);
      setFormData({
        title: '',
        composer: '',
        arranger: '',
        genre: 'classical',
        difficulty: 'medium',
        voices: [],
        duration: '',
        year: '',
        status: 'active',
        notes: ''
      });
      fetchPieces();
    } catch (error) {
      console.error('Erreur sauvegarde pièce:', error);
    }
  };

  const handleVoiceToggle = (voice) => {
    setFormData(prev => ({
      ...prev,
      voices: prev.voices.includes(voice)
        ? prev.voices.filter(v => v !== voice)
        : [...prev.voices, voice]
    }));
  };

  const getRepertoireStats = () => {
    const totalPieces = pieces.length;
    const activePieces = pieces.filter(piece => piece.status === 'active').length;
    const classicalPieces = pieces.filter(piece => piece.genre === 'classical').length;
    const modernPieces = pieces.filter(piece => piece.genre === 'modern').length;

    return { totalPieces, activePieces, classicalPieces, modernPieces };
  };

  const stats = getRepertoireStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">🎼 Gestion du Répertoire</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-4 sm:mt-0"
        >
          + Nouvelle Pièce
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4 text-center">
          <div className="text-2xl text-green-600 mb-1">🎵</div>
          <div className="text-lg font-bold text-gray-900">{stats.totalPieces}</div>
          <div className="text-sm text-gray-600">Pièces total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4 text-center">
          <div className="text-2xl text-blue-600 mb-1">✅</div>
          <div className="text-lg font-bold text-gray-900">{stats.activePieces}</div>
          <div className="text-sm text-gray-600">Actives</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4 text-center">
          <div className="text-2xl text-purple-600 mb-1">🎻</div>
          <div className="text-lg font-bold text-gray-900">{stats.classicalPieces}</div>
          <div className="text-sm text-gray-600">Classique</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4 text-center">
          <div className="text-2xl text-orange-600 mb-1">🎸</div>
          <div className="text-lg font-bold text-gray-900">{stats.modernPieces}</div>
          <div className="text-sm text-gray-600">Moderne</div>
        </div>
      </div>

      {/* Liste des pièces */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compositeur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voix
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulté
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pieces.map((piece) => (
                <tr key={piece.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">{piece.title}</div>
                    {piece.arranger && (
                      <div className="text-sm text-gray-500">Arr: {piece.arranger}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{piece.composer}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {piece.voices?.map((voice) => (
                        <span
                          key={voice}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 capitalize"
                        >
                          {voice}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      piece.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      piece.difficulty === 'medium' ? 'bg-blue-100 text-blue-800' :
                      piece.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {difficultyOptions.find(d => d.value === piece.difficulty)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{piece.genre}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      piece.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {piece.status === 'active' ? 'Active' : 'Archivée'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingPiece(piece);
                          setFormData({
                            title: piece.title,
                            composer: piece.composer,
                            arranger: piece.arranger || '',
                            genre: piece.genre,
                            difficulty: piece.difficulty,
                            voices: piece.voices || [],
                            duration: piece.duration || '',
                            year: piece.year || '',
                            status: piece.status,
                            notes: piece.notes || ''
                          });
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer cette pièce ?')) {
                            deleteDoc(doc(db, 'repertoire', piece.id));
                            fetchPieces();
                          }
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pieces.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune pièce dans le répertoire</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Ajouter la première pièce
            </button>
          </div>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPiece ? 'Modifier la pièce' : 'Nouvelle Pièce'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compositeur *</label>
                  <input
                    type="text"
                    required
                    value={formData.composer}
                    onChange={(e) => setFormData({ ...formData, composer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrangeur</label>
                  <input
                    type="text"
                    value={formData.arranger}
                    onChange={(e) => setFormData({ ...formData, arranger: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="classical">Classique</option>
                    <option value="sacred">Sacré</option>
                    <option value="folk">Folklorique</option>
                    <option value="modern">Moderne</option>
                    <option value="jazz">Jazz</option>
                    <option value="pop">Pop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {difficultyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archivée</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="ex: 3:45"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="ex: 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voix</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {voiceOptions.map((voice) => (
                    <label key={voice} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.voices.includes(voice)}
                        onChange={() => handleVoiceToggle(voice)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{voice}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPiece(null);
                    setFormData({
                      title: '',
                      composer: '',
                      arranger: '',
                      genre: 'classical',
                      difficulty: 'medium',
                      voices: [],
                      duration: '',
                      year: '',
                      status: 'active',
                      notes: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  {editingPiece ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepertoireDashboard;