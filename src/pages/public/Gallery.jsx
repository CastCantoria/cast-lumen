import React from 'react';

const Gallery = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Galerie</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Les éléments de la galerie seront ajoutés ici */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg">
          {/* Placeholder pour les images */}
        </div>
      </div>
    </div>
  );
};

export default Gallery;