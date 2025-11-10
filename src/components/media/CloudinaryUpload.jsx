import React, { useState } from 'react';
import { cloudinaryService } from '../../services/cloudinaryService';

const CloudinaryUpload = ({ onUploadSuccess, userRole, userId }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation
    if (file.size > 100 * 1024 * 1024) {
      alert('Fichier trop volumineux (max 100MB)');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const metadata = {
        userId: userId,
        userRole: userRole,
        title: file.name,
        tags: ['user-upload'],
        description: 'Média uploadé par un membre'
      };

      // Simulation de progression
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await cloudinaryService.uploadMedia(file, metadata);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      console.log('✅ Upload réussi:', result);
      onUploadSuccess(result);
      
      // Réinitialiser
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        event.target.value = '';
      }, 1000);

    } catch (error) {
      console.error('❌ Erreur upload:', error);
      alert('Erreur lors de l\'upload: ' + error.message);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="cloudinary-upload">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <p className="text-gray-600 mb-2">Glissez-déposez ou cliquez pour uploader</p>
        <p className="text-sm text-gray-500 mb-4">
          Images, vidéos, audio (max 100MB)
        </p>

        <input
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />

        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Upload en cours... {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudinaryUpload;