import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

const ContentDashboard = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'article',
    category: 'news',
    status: 'draft',
    tags: ''
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const contentQuery = collection(db, 'content');
      const contentSnapshot = await getDocs(contentQuery);
      const contentData = contentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContent(contentData);
    } catch (error) {
      console.error('Erreur chargement contenu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContent) {
        await updateDoc(doc(db, 'content', editingContent.id), {
          ...formData,
          updatedAt: new Date().toISOString(),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        });
      } else {
        await addDoc(collection(db, 'content'), {
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'Admin',
          views: 0
        });
      }
      setShowForm(false);
      setEditingContent(null);
      setFormData({
        title: '',
        content: '',
        type: 'article',
        category: 'news',
        status: 'draft',
        tags: ''
      });
      fetchContent();
    } catch (error) {
      console.error('Erreur sauvegarde contenu:', error);
    }
  };

  const getContentStats = () => {
    const totalContent = content.length;
    const publishedContent = content.filter(item => item.status === 'published').length;
    const draftContent = content.filter(item => item.status === 'draft').length;
    const totalViews = content.reduce((total, item) => total + (item.views || 0), 0);

    return { totalContent, publishedContent, draftContent, totalViews };
  };

  const stats = getContentStats();

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
        <h2 className="text-2xl font-bold text-gray-900">📝 Gestion du Contenu</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-4 sm:mt-0"
        >
          + Nouveau Contenu
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4 text-center">
          <div className="text-2xl text-purple-600 mb-1">📄</div>
          <div className="text-lg font-bold text-gray-900">{stats.totalContent}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4 text-center">
          <div className="text-2xl text-green-600 mb-1">✅</div>
          <div className="text-lg font-bold text-gray-900">{stats.publishedContent}</div>
          <div className="text-sm text-gray-600">Publiés</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4 text-center">
          <div className="text-2xl text-yellow-600 mb-1">📝</div>
          <div className="text-lg font-bold text-gray-900">{stats.draftContent}</div>
          <div className="text-sm text-gray-600">Brouillons</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4 text-center">
          <div className="text-2xl text-blue-600 mb-1">👁️</div>
          <div className="text-lg font-bold text-gray-900">{stats.totalViews}</div>
          <div className="text-sm text-gray-600">Vues</div>
        </div>
      </div>

      {/* Liste du contenu */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vues
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {content.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {item.content?.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{item.category}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'published' ? 'bg-green-100 text-green-800' :
                      item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.views || 0}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(item.updatedAt || item.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingContent(item);
                          setFormData({
                            title: item.title,
                            content: item.content,
                            type: item.type,
                            category: item.category,
                            status: item.status,
                            tags: item.tags?.join(', ') || ''
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
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
                            deleteDoc(doc(db, 'content', item.id));
                            fetchContent();
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

        {content.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun contenu créé</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Créer le premier contenu
            </button>
          </div>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingContent ? 'Modifier le contenu' : 'Nouveau Contenu'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="article">Article</option>
                    <option value="news">Actualité</option>
                    <option value="guide">Guide</option>
                    <option value="page">Page</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="news">Actualités</option>
                    <option value="events">Événements</option>
                    <option value="music">Musique</option>
                    <option value="community">Communauté</option>
                    <option value="resources">Ressources</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="cast, chorale, musique, concert"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingContent(null);
                    setFormData({
                      title: '',
                      content: '',
                      type: 'article',
                      category: 'news',
                      status: 'draft',
                      tags: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingContent ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDashboard;