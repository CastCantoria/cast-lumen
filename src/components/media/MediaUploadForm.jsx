// src/components/media/MediaUploadForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadMedia } from '../../services/mediaService';
import LoadingSpinner from '../ui/LoadingSpinner';

const MediaUploadForm = ({ onUploadSuccess }) => {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    type: 'image',
    file: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Déterminer le type automatiquement
      const fileType = file.type.split('/')[0];
      setFormData(prev => ({
        ...prev,
        file,
        type: fileType === 'video' ? 'video' : fileType === 'audio' ? 'audio' : 'image'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.title) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setUploading(true);
    try {
      await uploadMedia(formData, currentUser.uid);
      setFormData({
        title: '',
        description: '',
        category: 'general',
        type: 'image',
        file: null
      });
      document.getElementById('file-input').value = '';
      onUploadSuccess();
      alert('Média uploadé avec succès !');
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload du média');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">Général</option>
            <option value="concert">Concert</option>
            <option value="repetition">Répétition</option>
            <option value="event">Événement</option>
            <option value="member">Membre</option>
            <option value="partition">Partition</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fichier */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fichier *
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*,video/*,audio/*,.pdf"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Formats acceptés : Images (JPG, PNG), Vidéos (MP4), Audio (MP3), PDF
        </p>
      </div>

      {/* Bouton d'upload */}
      <div>
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="small" />
              <span className="ml-2">Upload en cours...</span>
            </div>
          ) : (
            '📤 Uploader le média'
          )}
        </button>
      </div>
    </form>
  );
};

export default MediaUploadForm;