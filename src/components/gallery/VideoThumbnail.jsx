import React, { useState } from 'react';

const VideoThumbnail = ({ src, title, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-cast-green">Chargement vidéo...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-red-500">
          Erreur de chargement vidéo
        </div>
      )}
      <div className="w-full h-full bg-gradient-to-br from-cast-green to-cast-gold flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-2">🎬</div>
          <p className="font-bold">{title}</p>
          <p className="text-sm mt-1">Cliquez pour lire</p>
        </div>
      </div>
      {/* Préchargement discret de la vidéo pour vérifier son existence */}
      <video 
        preload="metadata"
        onLoadedData={() => setLoaded(true)}
        onError={() => setError(true)}
        className="hidden"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoThumbnail;