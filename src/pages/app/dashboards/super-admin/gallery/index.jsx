import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../../../lib/firebase';
import { useAuth } from '../../../../../contexts/AuthContext';
import usePermissions from '../../../../../hooks/usePermissions';
import { useNavigate } from 'react-router-dom';

const galleryCategories = [
  { id: 'all', name: 'Toutes', icon: '🖼️' },
  { id: 'concerts', name: 'Concerts', icon: '🎵' },
  { id: 'repetitions', name: 'Répétitions', icon: '🎶' },
  { id: 'evenements', name: 'Événements', icon: '🎭' },
  { id: 'portraits', name: 'Portraits', icon: '👤' }
];

const GalleryManager = () => {
  const { user, userProfile } = useAuth();
  const { canManageGallery } = usePermissions();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Vérification des permissions
  useEffect(() => {
    if (!user || !userProfile) {
      navigate('/login');
      return;
    }
    
    if (!canManageGallery()) {
      navigate('/unauthorized');
      return;
    }
  }, [user, userProfile, canManageGallery, navigate]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'concerts',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const galleryRef = collection(db, 'gallery');
      const snapshot = await getDocs(galleryRef);
      
      const mediaItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMedia(mediaItems);
    } catch (error) {
      console.error('Erreur chargement galerie:', error);
      setError('Erreur lors du chargement de la galerie');
    } finally {
      setLoading(false);
    }
  };

  const handleSelection = (id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === media.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(media.map(item => item.id)));
    }
  };

  const handleDelete = async () => {
    if (!selectedItems.size) return;
    
    try {
      setLoading(true);
      
      // Récupérer les URLs des images à supprimer
      const itemsToDelete = media.filter(item => selectedItems.has(item.id));
      
      await Promise.all(
        itemsToDelete.map(async (item) => {
          // Supprimer l'image de Storage
          const imageRef = ref(storage, item.image);
          await deleteObject(imageRef);
          // Supprimer le document de Firestore
          await deleteDoc(doc(db, 'gallery', item.id));
        })
      );

      await loadGallery();
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Erreur suppression médias:', error);
      setError('Erreur lors de la suppression des médias');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    try {
      setLoading(true);
      setError(null);

      // Simuler l'upload - Dans une vraie application, utilisez Firebase Storage
      const uploads = Array.from(files).map(async file => {
        // Upload à Firebase Storage
        const storageRef = ref(storage, `gallery/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);

        const mediaDoc = {
          title: formData.title || file.name.split('.')[0],
          description: formData.description,
          category: formData.category,
          date: formData.date,
          image: imageUrl,
          uploadedAt: serverTimestamp(),
          status: 'active'
        };

        return addDoc(collection(db, 'gallery'), mediaDoc);
      });

      await Promise.all(uploads);
      await loadGallery();
      setUploadModalOpen(false);
    } catch (error) {
      console.error('Erreur upload:', error);
      setError("Erreur lors de l'upload des fichiers");
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = activeCategory === 'all'
    ? media
    : media.filter(item => item.category === activeCategory);

  if (loading && !media.length) {
    return <div className="p-6">Chargement de la galerie...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Galerie</h1>
        
        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Ajouter des photos
        </button>
      </div>

      <div className="flex space-x-4 mb-6 overflow-x-auto py-2">
        {galleryCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {media.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {selectedItems.size === media.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
            {selectedItems.size > 0 && (
              <button
                onClick={handleDelete}
                className="text-sm text-red-600 hover:text-red-900"
              >
                Supprimer ({selectedItems.size})
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {filteredMedia.length} élément{filteredMedia.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredMedia.map(item => (
          <div
            key={item.id}
            className={`group relative aspect-square rounded-lg overflow-hidden border-2 ${
              selectedItems.has(item.id) ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => handleSelection(item.id)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity">
              <div className="absolute inset-x-0 bottom-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-sm font-medium truncate">{item.title}</div>
                <div className="text-xs">
                  {new Date(item.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            {selectedItems.has(item.id) && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-4">Ajouter des photos</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {galleryCategories.filter(cat => cat.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sélectionner les photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleUpload(e.target.files)}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;