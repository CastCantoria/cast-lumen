import { useEffect } from 'react';
import { useGallery } from '../../contexts/GalleryContext';

const MediaModal = () => {
  // ✅ Gestion d'erreur pour useGallery
  let galleryContext;
  try {
    galleryContext = useGallery();
  } catch (error) {
    console.warn('⚠️ GalleryContext non disponible pour MediaModal');
    return null; // Retourner null si le contexte n'est pas disponible
  }

  const { selectedMedia, setSelectedMedia } = galleryContext;

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
      }
    };

    if (selectedMedia) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedMedia, setSelectedMedia]);

  if (!selectedMedia) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedMedia(null);
    }
  };

  const handleClose = () => {
    setSelectedMedia(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-6xl max-h-full bg-white rounded-lg overflow-hidden">
        {/* En-tête */}
        <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{selectedMedia.title}</h3>
              <p className="text-sm opacity-80">{selectedMedia.description}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-300 text-2xl font-bold p-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenu média */}
        <div className="flex items-center justify-center h-full p-8 pt-16">
          {selectedMedia.type === 'image' && (
            <img
              src={selectedMedia.url}
              alt={selectedMedia.title}
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
          )}

          {selectedMedia.type === 'video' && (
            <video
              controls
              className="max-w-full max-h-[80vh] rounded"
              autoPlay
            >
              <source src={selectedMedia.url} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          )}

          {selectedMedia.type === 'audio' && (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h4 className="text-xl font-bold mb-4">{selectedMedia.title}</h4>
              <audio controls className="w-full max-w-md">
                <source src={selectedMedia.url} type="audio/mp3" />
                Votre navigateur ne supporte pas la lecture audio.
              </audio>
            </div>
          )}
        </div>

        {/* Pied de page avec informations */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 z-10">
          <div className="flex flex-wrap gap-2 text-sm">
            {selectedMedia.tags.map(tag => (
              <span key={tag} className="bg-blue-500 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
            <span className="ml-auto opacity-70">
              {selectedMedia.category} • {selectedMedia.source}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;