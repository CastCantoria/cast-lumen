import React from 'react';

const VideosGallery = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            🎥 Galerie Vidéos
          </h1>
          <p className="text-xl text-green-600">
            Extraits vidéo de nos performances et coulisses
          </p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-6">🎬</div>
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Section en préparation
          </h3>
          <p className="text-lg text-green-600 mb-8">
            Notre galerie vidéo sera bientôt disponible avec des extraits de nos concerts.
          </p>
          <a href="/gallery" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            ← Retour à la galerie
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideosGallery;