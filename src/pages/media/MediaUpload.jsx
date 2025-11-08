// src/pages/media/MediaUpload.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MediaUploadForm from '../../components/media/MediaUploadForm';
import MediaUploadList from '../../components/media/MediaUploadList';
import RequireAuth from '../../components/auth/RequireAuth';

const MediaUpload = () => {
  const { currentUser } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Partagez vos médias
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Téléversez vos photos, vidéos, enregistrements audio et partitions
              pour les partager avec la communauté C.A.S.T.
            </p>
          </div>

          {/* Formulaire d'upload */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <MediaUploadForm onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Liste des médias uploadés */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Vos médias partagés
            </h2>
            <MediaUploadList 
              userId={currentUser?.uid} 
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default MediaUpload;