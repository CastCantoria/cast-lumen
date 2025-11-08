import React, { useState } from 'react';

const GalleryManager = () => {
  const [images, setImages] = useState([
    {
      id: 1,
      title: 'Concert de Printemps 2024',
      category: 'concerts',
      uploadDate: '2024-01-15',
      url: '/images/concert1.jpg'
    },
    {
      id: 2,
      title: 'Répétition en studio',
      category: 'repetitions',
      uploadDate: '2024-01-10',
      url: '/images/repetition1.jpg'
    }
  ]);

  const [newImage, setNewImage] = useState({
    title: '',
    category: 'concerts',
    file: null
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(prev => ({
        ...prev,
        file,
        title: file.name.split('.')[0] // Utiliser le nom du fichier comme titre par défaut
      }));
    }
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!newImage.file) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    const image = {
      id: images.length + 1,
      title: newImage.title,
      category: newImage.category,
      uploadDate: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(newImage.file)
    };

    setImages(prev => [...prev, image]);
    setNewImage({ title: '', category: 'concerts', file: null });
    alert('Image ajoutée à la galerie!');
  };

  const handleDeleteImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion de la Galerie</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire d'upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Ajouter une Image</h3>
          
          <form onSubmit={handleAddImage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fichier image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                value={newImage.title}
                onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Titre de l'image"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={newImage.category}
                onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="concerts">Concerts</option>
                <option value="repetitions">Répétitions</option>
                <option value="evenements">Événements</option>
                <option value="portraits">Portraits</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter à la galerie
            </button>
          </form>
        </div>

        {/* Aperçu de la galerie */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Galerie ({images.length} images)
          </h3>
          
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {images.map(image => (
              <div key={image.id} className="border border-gray-200 rounded-lg p-3">
                <div className="bg-gray-100 h-24 rounded flex items-center justify-center mb-2">
                  <span className="text-gray-400">🖼️ Image</span>
                </div>
                <div className="text-sm font-medium truncate">{image.title}</div>
                <div className="text-xs text-gray-500 capitalize">{image.category}</div>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="text-red-600 text-xs mt-2 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
            ))}
            
            {images.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                Aucune image dans la galerie
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;