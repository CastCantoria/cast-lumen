// src/components/gallery/GalleryGrid.jsx
import React from 'react';
import { useGallery } from '../../contexts/GalleryContext';
import LazyImage from './LazyImage';
import AudioPlayer from './AudioPlayer';
import VideoThumbnail from './VideoThumbnail';

const GalleryGrid = ({ media }) => {
  const { setSelectedMedia, filter, searchQuery } = useGallery();

  // Filtrage des médias
  const filteredMedia = media.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && (searchQuery === '' || matchesSearch);
  });

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  if (filteredMedia.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Aucun média trouvé avec ces critères.</p>
        <p className="text-gray-400 mt-2">Essayez de modifier vos filtres ou votre recherche.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {filteredMedia.map((item, index) => (
        <div 
          key={item.id || index}
          className="relative group cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => handleMediaClick(item)}
        >
          {/* Image */}
          {item.type === 'image' && (
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <LazyImage 
                src={item.url} 
                alt={item.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white text-center">
                  <p className="font-bold">{item.title}</p>
                  {item.description && (
                    <p className="text-sm mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Vidéo */}
          {item.type === 'video' && (
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <VideoThumbnail 
                src={item.url}
                title={item.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                ▶ VIDÉO
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white text-center">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm mt-1">Cliquez pour lire</p>
                </div>
              </div>
            </div>
          )}

          {/* Audio */}
          {item.type === 'audio' && (
            <div className="bg-gradient-to-br from-cast-green to-cast-gold rounded-lg p-4 shadow-lg">
              <AudioPlayer 
                src={item.url}
                title={item.title}
                compact={true}
              />
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag, tagIndex) => (
                <span 
                  key={tagIndex}
                  className="bg-cast-gold text-cast-green text-xs px-2 py-1 rounded-full font-semibold"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;