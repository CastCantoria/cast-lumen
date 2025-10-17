// src/components/gallery/MediaModal.jsx
import React, { useEffect, useCallback, useRef } from 'react';
import { useGallery } from '../../contexts/GalleryContext';
import AudioPlayer from './AudioPlayer';
import LazyImage from './LazyImage';

const MediaModal = () => {
  const { selectedMedia, setSelectedMedia } = useGallery();
  const videoRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setSelectedMedia(null);
    }
  }, [setSelectedMedia]);

  useEffect(() => {
    if (selectedMedia) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      // Remettre la vidéo à zéro si c'est une nouvelle vidéo
      if (videoRef.current && selectedMedia.type === 'video') {
        videoRef.current.currentTime = 0;
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedMedia, handleKeyDown]);

  if (!selectedMedia) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedMedia(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal Content */}
      <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-cast-green text-white">
          <h2 className="text-xl font-bold truncate flex-1 mr-4">
            {selectedMedia.title || 'Média C.A.S.T.'}
          </h2>
          <button
            onClick={() => setSelectedMedia(null)}
            className="text-white hover:text-cast-gold text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Media Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Image */}
          {selectedMedia.type === 'image' && (
            <div className="flex justify-center">
              <LazyImage
                src={selectedMedia.url}
                alt={selectedMedia.title}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>
          )}

          {/* Video */}
          {selectedMedia.type === 'video' && (
            <div className="flex justify-center">
              <video
                ref={videoRef}
                controls
                className="max-w-full max-h-[60vh] rounded-lg"
                autoPlay
                playsInline
              >
                <source src={selectedMedia.url} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
          )}

          {/* Audio */}
          {selectedMedia.type === 'audio' && (
            <div className="bg-gradient-to-r from-cast-green to-cast-gold rounded-lg p-6">
              <AudioPlayer
                src={selectedMedia.url}
                title={selectedMedia.title}
                compact={false}
              />
            </div>
          )}

          {/* Metadata */}
          <div className="mt-6 space-y-4">
            {/* Description */}
            {selectedMedia.description && (
              <div>
                <h3 className="font-bold text-cast-green mb-2">Description</h3>
                <p className="text-gray-700">{selectedMedia.description}</p>
              </div>
            )}

            {/* Tags */}
            {selectedMedia.tags && selectedMedia.tags.length > 0 && (
              <div>
                <h3 className="font-bold text-cast-green mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMedia.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-cast-gold text-cast-green px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Téléchargement */}
            <div className="pt-4 border-t">
              <a
                href={selectedMedia.url}
                download
                className="inline-flex items-center bg-cast-green text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
              >
                📥 Télécharger
                <span className="ml-2 text-xs opacity-75">
                  ({selectedMedia.type})
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;