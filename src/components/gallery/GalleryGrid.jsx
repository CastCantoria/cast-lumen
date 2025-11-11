import React, { useState } from 'react';
import { moderationService } from '../../services/moderationService';
import { useAuth } from '../../contexts/AuthContext';

const GalleryGrid = ({ media, onMediaClick, viewMode = 'masonry', onDocumentPreview }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const { currentUser } = useAuth();

  const handleMediaClick = (mediaItem) => {
    const mediaType = moderationService.getMediaTypeFromUrl(mediaItem.url);
    
    if (mediaType === 'image') {
      // Agrandir l'image au clic
      setSelectedImage(mediaItem);
    } else if (mediaType === 'document' || mediaItem.mimeType?.includes('pdf')) {
      setSelectedMedia(mediaItem);
    } else {
      onMediaClick?.(mediaItem);
    }
  };

  const handleClosePreview = () => {
    setSelectedMedia(null);
    setSelectedImage(null);
  };

  const handleDownload = (mediaItem) => {
    if (!currentUser && (moderationService.getMediaTypeFromUrl(mediaItem.url) === 'document' || mediaItem.mimeType?.includes('pdf'))) {
      alert('🔐 Connectez-vous pour télécharger ce fichier');
      return;
    }
    
    const link = document.createElement('a');
    link.href = mediaItem.url;
    link.download = mediaItem.fileName || mediaItem.title || 'download';
    link.target = '_blank';
    link.click();
  };

  const handleImageLoad = (mediaId) => {
    setLoadedImages(prev => new Set(prev).add(mediaId));
  };

  const getMediaIcon = (type, mimeType) => {
    if (mimeType?.includes('pdf')) return '📕';
    if (type === 'image') return '🖼️';
    if (type === 'video') return '🎬';
    if (type === 'audio') return '🎵';
    if (type === 'document') return '📄';
    return '📎';
  };

  const getAspectRatioClass = (aspectRatio) => {
    switch (aspectRatio) {
      case '1:1': return 'aspect-square';
      case '4:3': return 'aspect-[4/3]';
      case '3:4': return 'aspect-[3/4]';
      case '16:9': return 'aspect-video';
      case '2:3': return 'aspect-[2/3]';
      default: return 'aspect-square';
    }
  };

  const shouldShowDownloadButton = (mediaItem) => {
    const mediaType = moderationService.getMediaTypeFromUrl(mediaItem.url);
    
    // Pour les documents, vérifier si l'utilisateur est connecté
    if (mediaType === 'document' || mediaItem.mimeType?.includes('pdf')) {
      return currentUser !== null;
    }
    
    // Pour les autres médias, toujours montrer le bouton
    return true;
  };

  const isDocumentRestricted = (mediaItem) => {
    const mediaType = moderationService.getMediaTypeFromUrl(mediaItem.url);
    return (mediaType === 'document' || mediaItem.mimeType?.includes('pdf')) && !currentUser;
  };

  if (!media || media.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-8xl mb-6 opacity-50">📭</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">Aucun média trouvé</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Aucun média ne correspond à vos critères de recherche. 
          Essayez de modifier vos filtres ou de recharger la page.
        </p>
      </div>
    );
  }

  // Rendu Masonry
  if (viewMode === 'masonry') {
    return (
      <>
        <div className="masonry-grid p-6">
          {media.map((mediaItem) => {
            const mediaType = moderationService.getMediaTypeFromUrl(mediaItem.url);
            const isDocument = mediaType === 'document' || mediaItem.mimeType?.includes('pdf');
            const isRestricted = isDocumentRestricted(mediaItem);
            
            return (
              <div
                key={mediaItem.id}
                className={`masonry-item bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 ${
                  isRestricted ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                } group`}
                onClick={() => !isRestricted && handleMediaClick(mediaItem)}
              >
                {/* Conteneur média adaptatif */}
                <div className={`relative ${getAspectRatioClass(mediaItem.aspectRatio)} bg-gray-100`}>
                  {mediaItem.type === 'image' && (
                    <>
                      <img
                        src={mediaItem.optimizedUrl || mediaItem.url}
                        alt={mediaItem.title}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                          loadedImages.has(mediaItem.id) ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading="lazy"
                        onLoad={() => handleImageLoad(mediaItem.id)}
                      />
                      {!loadedImages.has(mediaItem.id) && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
                      )}
                    </>
                  )}
                  
                  {isDocument && (
                    <div className={`w-full h-full flex items-center justify-center ${
                      isRestricted ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-gradient-to-br from-red-50 to-orange-50'
                    }`}>
                      <div className="text-center p-4">
                        <div className={`text-5xl mb-3 ${isRestricted ? 'text-gray-400' : 'text-red-500'}`}>📕</div>
                        <p className={`text-sm font-medium truncate px-2 ${
                          isRestricted ? 'text-gray-500' : 'text-red-700'
                        }`}>
                          {mediaItem.title || 'Document PDF'}
                        </p>
                        <p className={`text-xs mt-1 ${
                          isRestricted ? 'text-gray-400' : 'text-red-500'
                        }`}>
                          {isRestricted ? '🔒 Connectez-vous pour accéder' : 'Cliquez pour prévisualiser'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {mediaItem.type === 'video' && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                      <div className="text-center p-4">
                        <div className="text-5xl mb-3 text-purple-600">🎬</div>
                        <p className="text-sm text-purple-700 font-medium">Vidéo</p>
                        {mediaItem.duration && (
                          <p className="text-xs text-purple-500 mt-1">{mediaItem.duration}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {mediaItem.type === 'audio' && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                      <div className="text-center p-4">
                        <div className="text-5xl mb-3 text-green-600">🎵</div>
                        <p className="text-sm text-green-700 font-medium">Audio</p>
                        {mediaItem.duration && (
                          <p className="text-xs text-green-500 mt-1">{mediaItem.duration}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Overlay interactif */}
                  {!isRestricted && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center">
                      <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="text-4xl text-white mb-2">
                          {getMediaIcon(mediaItem.type, mediaItem.mimeType)}
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {mediaType === 'image' ? '👁️ Agrandir' : 'Voir détails'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                      {getMediaIcon(mediaItem.type, mediaItem.mimeType)} {mediaItem.type}
                    </div>
                    {mediaItem.featured && (
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                        ⭐ Vedette
                      </div>
                    )}
                    {isRestricted && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                        🔒 Connectez-vous
                      </div>
                    )}
                  </div>

                  {/* Bouton télécharger */}
                  {shouldShowDownloadButton(mediaItem) && (
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(mediaItem);
                        }}
                        className="bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm hover:bg-black/80 transition-colors"
                        title="Télécharger"
                      >
                        📥
                      </button>
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                    {mediaItem.title || 'Sans titre'}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {mediaItem.description || 'Aucune description'}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {moderationService.formatFileSize(mediaItem.fileSize)}
                    </span>
                    {shouldShowDownloadButton(mediaItem) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(mediaItem);
                        }}
                        className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                      >
                        📥 Télécharger
                      </button>
                    )}
                    {isDocument && currentUser && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDocumentPreview?.(mediaItem);
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        👁️ Prévisualiser
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal de prévisualisation PDF */}
        {selectedMedia && currentUser && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">
                  {selectedMedia.title || 'Prévisualisation PDF'}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(selectedMedia)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                  >
                    <span>📥</span>
                    <span>Télécharger</span>
                  </button>
                  <button
                    onClick={handleClosePreview}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    ✕ Fermer
                  </button>
                </div>
              </div>
              <div className="p-4 h-[calc(90vh-80px)]">
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedMedia.url)}&embedded=true`}
                  className="w-full h-full border-0"
                  title="Prévisualisation PDF"
                />
                <div className="text-center text-sm text-gray-500 mt-2">
                  💡 Si le PDF ne s'affiche pas, utilisez le bouton "Télécharger"
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'agrandissement d'image */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={handleClosePreview}>
            <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                onClick={handleClosePreview}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(selectedImage);
                }}
                className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all z-10"
                title="Télécharger l'image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              <img
                src={selectedImage.optimizedUrl || selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm text-sm">
                {selectedImage.title} • {moderationService.formatFileSize(selectedImage.fileSize)}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Rendu Grille classique
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {media.map((item) => {
          const mediaType = moderationService.getMediaTypeFromUrl(item.url);
          const isDocument = mediaType === 'document' || item.mimeType?.includes('pdf');
          const isRestricted = isDocumentRestricted(item);
          
          return (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                isRestricted ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
              }`}
              onClick={() => !isRestricted && handleMediaClick(item)}
            >
              {/* Preview du média */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                {item.type === 'image' ? (
                  <>
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onLoad={() => handleImageLoad(item.id)}
                    />
                    {!loadedImages.has(item.id) && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                    )}
                  </>
                ) : isDocument ? (
                  <div className={`text-center p-4 w-full h-full flex items-center justify-center ${
                    isRestricted ? 'bg-gray-100' : 'bg-gradient-to-br from-red-50 to-orange-50'
                  }`}>
                    <div>
                      <div className={`text-4xl mb-2 ${isRestricted ? 'text-gray-400' : 'text-red-500'}`}>📕</div>
                      <div className={`text-sm font-medium truncate px-2 ${
                        isRestricted ? 'text-gray-500' : 'text-red-700'
                      }`}>
                        {item.title || 'Document PDF'}
                      </div>
                      <div className={`text-xs mt-1 ${
                        isRestricted ? 'text-gray-400' : 'text-red-500'
                      }`}>
                        {isRestricted ? '🔒 Connectez-vous' : 'Cliquez pour prévisualiser'}
                      </div>
                    </div>
                  </div>
                ) : item.type === 'audio' ? (
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">🎵</div>
                    <div className="text-sm text-gray-600">Audio</div>
                  </div>
                ) : item.type === 'video' ? (
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">🎬</div>
                    <div className="text-sm text-gray-600">Vidéo</div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">📎</div>
                    <div className="text-sm text-gray-600">Fichier</div>
                  </div>
                )}
                
                {/* Badge type */}
                <div className="absolute top-2 left-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${moderationService.getFileBadgeColor(item.mimeType)}`}>
                    {item.type || 'fichier'}
                  </span>
                </div>

                {/* Bouton télécharger */}
                {shouldShowDownloadButton(item) && (
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item);
                      }}
                      className="bg-black/70 text-white p-1 rounded backdrop-blur-sm hover:bg-black/80 transition-colors"
                      title="Télécharger"
                    >
                      📥
                    </button>
                  </div>
                )}
              </div>

              {/* Infos du média */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {item.title || 'Sans titre'}
                </h3>
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                  {item.description || 'Aucune description'}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {moderationService.formatFileSize(item.fileSize)}
                  </span>
                  {shouldShowDownloadButton(item) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                    >
                      📥 Télécharger
                    </button>
                  )}
                  {isDocument && currentUser && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDocumentPreview?.(item);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      👁️ Prévisualiser
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de prévisualisation PDF */}
      {selectedMedia && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {selectedMedia.title || 'Prévisualisation PDF'}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(selectedMedia)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                >
                  <span>📥</span>
                  <span>Télécharger</span>
                </button>
                <button
                  onClick={handleClosePreview}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  ✕ Fermer
                </button>
              </div>
            </div>
            <div className="p-4 h-[calc(90vh-80px)]">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedMedia.url)}&embedded=true`}
                className="w-full h-full border-0"
                title="Prévisualisation PDF"
              />
              <div className="text-center text-sm text-gray-500 mt-2">
                💡 Si le PDF ne s'affiche pas, utilisez le bouton "Télécharger"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'agrandissement d'image pour la vue grille */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={handleClosePreview}>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(selectedImage);
              }}
              className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all z-10"
              title="Télécharger l'image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            <img
              src={selectedImage.optimizedUrl || selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm text-sm">
              {selectedImage.title} • {moderationService.formatFileSize(selectedImage.fileSize)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;