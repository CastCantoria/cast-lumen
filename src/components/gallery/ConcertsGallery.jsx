import React from 'react';

const ConcertsGallery = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            🎵 Galerie Concerts
          </h1>
          <p className="text-xl text-green-600">
            Archives de nos événements musicaux
          </p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-6">🎭</div>
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Archives en constitution
          </h3>
          <p className="text-lg text-green-600 mb-8">
            Retrouvez bientôt toutes nos prestations concertantes.
          </p>
          <a href="/gallery" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            ← Retour à la galerie
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConcertsGallery;