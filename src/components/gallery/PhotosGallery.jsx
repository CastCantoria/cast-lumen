import React, { useEffect } from 'react';

const PhotosGallery = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const photos = [
    {
      id: 1,
      title: "Répétition en studio",
      category: "Répétitions",
      date: "2024",
      image: "/images/repetition-1.jpg"
    },
    {
      id: 2,
      title: "Concert à la Cathédrale", 
      category: "Concerts",
      date: "2024",
      image: "/images/concert-cathedrale.jpg"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            📸 Galerie Photos
          </h1>
          <p className="text-xl text-green-600">
            Moments capturés lors de nos répétitions et concerts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 bg-green-200 flex items-center justify-center">
                <span className="text-4xl">🖼️</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-green-800 mb-2">{photo.title}</h3>
                <div className="flex justify-between text-sm text-green-600">
                  <span>{photo.category}</span>
                  <span>{photo.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/gallery" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            ← Retour à la galerie principale
          </a>
        </div>
      </div>
    </div>
  );
};

export default PhotosGallery;