import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

const ArticleCreation = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'actualites',
    tags: [],
    featuredImage: '',
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { id: 'actualites', name: 'Actualités' },
    { id: 'concerts', name: 'Concerts' },
    { id: 'evenements', name: 'Événements' },
    { id: 'annonces', name: 'Annonces' },
    { id: 'presse', name: 'Presse' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simuler l'upload - Dans une vraie app, utilisez Firebase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          featuredImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const articleData = {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        author: 'TODO: Add author ID from context', // À implémenter avec le contexte d'auth
      };

      await addDoc(collection(db, 'articles'), articleData);
      
      setSuccess(true);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: 'actualites',
        tags: [],
        featuredImage: '',
        status: 'draft',
        publishDate: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Erreur création article:', err);
      setError("Une erreur s'est produite lors de la création de l'article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Créer un nouvel article</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">Article créé avec succès !</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titre de l'article
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Extrait
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Un bref résumé de l'article..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contenu
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de publication
            </label>
            <input
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                  >
                    <span className="sr-only">Supprimer tag</span>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ajouter un tag (Entrée pour valider)"
              onKeyPress={handleTagInput}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image principale
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.featuredImage && (
              <div className="mt-2">
                <img
                  src={formData.featuredImage}
                  alt="Aperçu"
                  className="h-32 w-auto object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => window.history.back()}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Création...' : 'Créer l\'article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleCreation;