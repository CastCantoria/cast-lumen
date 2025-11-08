// src/components/media/MediaUploadList.jsx
import React, { useState, useEffect } from 'react';
import { getUserMedia } from '../../services/mediaService';
import LoadingSpinner from '../ui/LoadingSpinner';

const MediaUploadList = ({ userId, refreshTrigger }) => {
  const [userMedia, setUserMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserMedia = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const media = await getUserMedia(userId);
        setUserMedia(media);
      } catch (error) {
        console.error('Erreur chargement médias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMedia();
  }, [userId, refreshTrigger]);

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      default: return '📄';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {userMedia.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Aucun média partagé pour le moment.
        </p>
      ) : (
        userMedia.map(media => (
          <div key={media.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{getMediaIcon(media.type)}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{media.title}</h3>
                <p className="text-sm text-gray-600">{media.description}</p>
                <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                  <span>Type: {media.type}</span>
                  <span>Catégorie: {media.category}</span>
                  <span>Uploadé le: {formatDate(media.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {media.status === 'pending' && '⏳ En attente'}
              {media.status === 'approved' && '✅ Approuvé'}
              {media.status === 'rejected' && '❌ Rejeté'}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MediaUploadList;