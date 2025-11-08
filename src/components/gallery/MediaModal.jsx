import React, { useEffect, useCallback, useRef } from 'react';
import { useGallery } from '../../contexts/GalleryContext';
import AudioPlayer from './AudioPlayer';
import LazyImage from './LazyImage';

const MediaModal = () => {
  const { selectedMedia, setSelectedMedia } = useGallery();
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedMedia]);

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
        <div className={`flex justify-between items-center p-4 border-b text-white ${
          selectedMedia.source === 'member' ? 'bg-green-600' : 'bg-cast-green'
        }`}>
          <div className="flex items-center flex-1 mr-4">
            <h2 className="text-xl font-bold truncate">
              {selectedMedia.title || 'Média C.A.S.T.'}
            </h2>
            {selectedMedia.source === 'member' && (
              <span className="ml-3 bg-white text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                👤 Partage membre
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedMedia(null)}
            className="text-white hover:text-cast-gold text-2xl transition-colors flex-shrink-0"
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
            <div className={`rounded-lg p-6 ${
              selectedMedia.source === 'member' 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-cast-green to-cast-gold'
            }`}>
              <AudioPlayer
                src={selectedMedia.url}
                title={selectedMedia.title}
                compact={false}
              />
            </div>
          )}

          {/* Partition */}
          {selectedMedia.type === 'partition' && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white text-center">
              <div className="text-6xl mb-4">🎼</div>
              <h3 className="text-2xl font-bold mb-2">{selectedMedia.title}</h3>
              <p className="text-lg opacity-90">{selectedMedia.description}</p>
              <div className="mt-4 bg-white/20 rounded-lg p-4">
                <p className="text-sm">Partition disponible au téléchargement</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-6 space-y-4">
            {/* Auteur et date pour les médias membres */}
            {(selectedMedia.author || selectedMedia.date) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-2">Informations du partage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {selectedMedia.author && (
                    <div>
                      <span className="font-semibold">Auteur :</span>
                      <span className="ml-2 text-gray-600">{selectedMedia.author}</span>
                    </div>
                  )}
                  {selectedMedia.date && (
                    <div>
                      <span className="font-semibold">Date de partage :</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(selectedMedia.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

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