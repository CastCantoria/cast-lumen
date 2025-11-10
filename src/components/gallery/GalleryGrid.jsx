import { useGallery } from '../../contexts/GalleryContext';
import { useEffect, useRef, useState } from 'react';

const GalleryGrid = ({ media, viewMode = 'grid' }) => {
  console.log('🎯 GalleryGrid - media reçu:', media);

  // ✅ Gestion d'erreur pour useGallery
  let galleryContext;
  try {
    galleryContext = useGallery();
  } catch (error) {
    console.warn('⚠️ GalleryContext non disponible pour GalleryGrid');
    galleryContext = {
      setSelectedMedia: () => console.log('setSelectedMedia non disponible')
    };
  }

  const { setSelectedMedia } = galleryContext;
  const [loadedImages, setLoadedImages] = useState(new Set());
  const gridRef = useRef(null);

  const handleImageLoad = (mediaId) => {
    setLoadedImages(prev => new Set(prev).add(mediaId));
  };

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎬';
      case 'audio': return '🎵';
      default: return '📄';
    }
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
      <div className="masonry-grid p-6">
        {media.map((mediaItem) => (
          <div
            key={mediaItem.id}
            className="masonry-item bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group parallax-item"
            onClick={() => handleMediaClick(mediaItem)}
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
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="text-4xl text-white mb-2">{getMediaIcon(mediaItem.type)}</div>
                  <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    Voir détails
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <div className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                  {getMediaIcon(mediaItem.type)} {mediaItem.type}
                </div>
                {mediaItem.featured && (
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    ⭐ Vedette
                  </div>
                )}
              </div>
            </div>

            {/* Informations */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                {mediaItem.title}
              </h3>
              <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                {mediaItem.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {mediaItem.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {mediaItem.tags.length > 2 && (
                  <span className="text-gray-500 text-xs font-medium">
                    +{mediaItem.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Rendu Grille classique
  return (
    <div className="gallery-grid p-6" ref={gridRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {media.map((mediaItem) => (
          <div
            key={mediaItem.id}
            className="media-item bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group parallax-item"
            onClick={() => handleMediaClick(mediaItem)}
          >
            {/* Conteneur média */}
            <div className={`relative ${getAspectRatioClass(mediaItem.aspectRatio)} bg-gray-100 overflow-hidden`}>
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
              
              {mediaItem.type === 'video' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  <div className="text-center">
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
                  <div className="text-center">
                    <div className="text-5xl mb-3 text-green-600">🎵</div>
                    <p className="text-sm text-green-700 font-medium">Audio</p>
                    {mediaItem.duration && (
                      <p className="text-xs text-green-500 mt-1">{mediaItem.duration}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Overlay interactif */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-500 flex items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="text-4xl text-white mb-2">{getMediaIcon(mediaItem.type)}</div>
                  <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    👁️ Aperçu
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <div className="bg-black/70 text-white px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-sm">
                  {getMediaIcon(mediaItem.type)}
                </div>
                {mediaItem.featured && (
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium">
                    ⭐ Vedette
                  </div>
                )}
              </div>

              {/* Source badge */}
              <div className="absolute top-3 right-3">
                <div className={`px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm ${
                  mediaItem.source === 'official' 
                    ? 'bg-blue-500/80 text-white' 
                    : 'bg-green-500/80 text-white'
                }`}>
                  {mediaItem.source === 'official' ? '🏛️ Officiel' : '👥 Membre'}
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                {mediaItem.title}
              </h3>
              <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                {mediaItem.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {mediaItem.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-300/50"
                  >
                    #{tag}
                  </span>
                ))}
                {mediaItem.tags.length > 3 && (
                  <span className="text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded-lg">
                    +{mediaItem.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryGrid;