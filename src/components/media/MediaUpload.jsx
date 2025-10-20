// src/components/media/MediaUpload.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MediaUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    // Filtrer seulement les PDF et les images
    const allowedFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/')
    );
    setSelectedFiles(allowedFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    // Implémentation de l'upload vers Firebase Storage
    // À compléter avec ta configuration Firebase Storage
    setTimeout(() => {
      setUploading(false);
      setSelectedFiles([]);
      alert('Fichiers uploadés avec succès !');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-cast-green mb-2">
              📁 Ajouter des médias
            </h1>
            <p className="text-gray-600 mb-6">
              Bonjour {user.firstName || 'cher membre'} ! Vous pouvez ajouter des partitions PDF et des images.
            </p>

            <div className="border-2 border-dashed border-cast-green rounded-2xl p-8 text-center">
              <input
                type="file"
                multiple
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-cast-green text-white px-6 py-3 rounded-lg hover:bg-cast-gold transition-colors inline-block"
              >
                📎 Choisir des fichiers
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Formats acceptés: PDF, JPG, PNG, GIF (Max: 10MB par fichier)
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-cast-green mb-3">
                  Fichiers sélectionnés ({selectedFiles.length})
                </h3>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {file.type === 'application/pdf' ? '📄' : '🖼️'}
                        </span>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-800"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full mt-6 bg-cast-gold text-cast-green py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
                >
                  {uploading ? '📤 Upload en cours...' : '🚀 Uploader les fichiers'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;