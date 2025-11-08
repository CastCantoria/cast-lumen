// src/pages/public/Gallery.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [mediaType, setMediaType] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [loading, setLoading] = useState(true); // Commencer avec true

  // Données multimédias locales
  useEffect(() => {
    console.log('🔄 Chargement des médias...');
    
    // Simuler un chargement asynchrone
    setTimeout(() => {
      const mediaData = [
        // PHOTOS - CONCERTS
        {
          id: 1,
          type: 'photos',
          category: 'concerts',
          src: '/images/concert1.jpg',
          thumbnail: '/images/concert1.jpg',
          title: 'Concert de Noël 2023',
          description: 'Célébration de Noël à la Cathédrale Sainte-Marie',
          date: '24 Décembre 2023',
          author: 'C.A.S.T. Team',
          duration: null,
          format: 'jpg',
          source: 'official'
        },
        {
          id: 2,
          type: 'photos',
          category: 'concerts',
          src: '/images/chorale-1.jpg',
          thumbnail: '/images/chorale-1.jpg',
          title: 'Concert de Printemps',
          description: 'Performance lors du festival de musique sacrée',
          date: '15 Mars 2024',
          author: 'Photographe C.A.S.T.',
          duration: null,
          format: 'jpg',
          source: 'official'
        },
        {
          id: 3,
          type: 'photos',
          category: 'concerts',
          src: '/images/chorale-2.jpg',
          thumbnail: '/images/chorale-2.jpg',
          title: 'Récital de Chorale',
          description: 'Ensemble complet lors de la représentation',
          date: '8 Avril 2024',
          author: 'C.A.S.T. Production',
          duration: null,
          format: 'jpg',
          source: 'official'
        },

        // PHOTOS - RÉPÉTITIONS
        {
          id: 4,
          type: 'photos',
          category: 'repetitions',
          src: '/images/chorale-3.jpg',
          thumbnail: '/images/chorale-3.jpg',
          title: 'Session de Répétition',
          description: 'Travail en cours sur le nouveau répertoire',
          date: '10 Janvier 2024',
          author: 'Marie Lambert',
          duration: null,
          format: 'jpg',
          source: 'official'
        },
        {
          id: 5,
          type: 'photos',
          category: 'repetitions',
          src: '/images/chorale-4.jpg',
          thumbnail: '/images/chorale-4.jpg',
          title: 'Atelier Vocal',
          description: 'Exercices techniques avec le chef de chœur',
          date: '22 Février 2024',
          author: 'Pierre Martin',
          duration: null,
          format: 'jpg',
          source: 'official'
        },
        {
          id: 6,
          type: 'photos',
          category: 'repetitions',
          src: '/images/chorale-5.jpg',
          thumbnail: '/images/chorale-5.jpg',
          title: 'Répétition Sectionnelle',
          description: 'Travail spécifique avec les sopranes',
          date: '5 Mars 2024',
          author: 'Sophie Bernard',
          duration: null,
          format: 'jpg',
          source: 'official'
        },

        // PHOTOS - PORTRAITS
        {
          id: 7,
          type: 'photos',
          category: 'portraits',
          src: '/images/portrait.jpg',
          thumbnail: '/images/portrait.jpg',
          title: 'Portrait - Chef de Chœur',
          description: 'Notre directeur artistique lors des répétitions',
          date: '15 Janvier 2024',
          author: 'C.A.S.T. Team',
          duration: null,
          format: 'jpg',
          source: 'official'
        },
        {
          id: 8,
          type: 'photos',
          category: 'portraits',
          src: '/images/pcast01.jpg',
          thumbnail: '/images/pcast01.jpg',
          title: 'Portrait - Ténor Solo',
          description: 'Notre soliste ténor en répétition',
          date: '8 Janvier 2024',
          author: 'Photographe C.A.S.T.',
          duration: null,
          format: 'jpg',
          source: 'official'
        },
        {
          id: 9,
          type: 'photos',
          category: 'portraits',
          src: '/images/fondateur-cast.jpg',
          thumbnail: '/images/fondateur-cast.jpg',
          title: 'Fondateur C.A.S.T.',
          description: 'Portrait du fondateur de la chorale',
          date: '1 Janvier 2024',
          author: 'Archives C.A.S.T.',
          duration: null,
          format: 'jpg',
          source: 'official'
        },

        // PHOTOS - ÉVÉNEMENTS
        {
          id: 10,
          type: 'photos',
          category: 'evenements',
          src: '/images/gallery/galerie1.jpg',
          thumbnail: '/images/gallery/galerie1.jpg',
          title: 'Rencontre Annuelle 2024',
          description: 'Rassemblement des membres de C.A.S.T. Cantoria',
          date: '10 Février 2024',
          author: 'Pierre Martin',
          duration: null,
          format: 'jpg',
          source: 'official'
        },
        {
          id: 11,
          type: 'photos',
          category: 'evenements',
          src: '/images/gallery/galerie2.jpg',
          thumbnail: '/images/gallery/galerie2.jpg',
          title: 'Atelier de Formation',
          description: 'Session de formation aux techniques vocales',
          date: '18 Mars 2024',
          author: 'Lucie Moreau',
          duration: null,
          format: 'jpg',
          source: 'official'
        },

        // VIDÉOS
        {
          id: 21,
          type: 'videos',
          category: 'concerts',
          src: '/videos/presentation-cast.mp4',
          thumbnail: '/images/gallery/galerie5.jpg',
          title: 'Concert de Noël 2023 - Extrait',
          description: 'Extrait musical de notre célébration de Noël',
          date: '24 Décembre 2023',
          author: 'C.A.S.T. Production',
          duration: '2:30',
          format: 'mp4',
          source: 'official'
        },

        // AUDIO
        {
          id: 23,
          type: 'audio',
          category: 'concerts',
          src: '/audio/cantique-1.mp3',
          thumbnail: '/images/audio-cover.jpg',
          title: 'Cantique de Noël - Douce Nuit',
          description: 'Enregistrement live de notre concert de Noël',
          date: '24 Décembre 2023',
          author: 'Section Soprano',
          duration: '4:15',
          format: 'mp3',
          source: 'official'
        }
      ];

      setGalleryMedia(mediaData);
      setLoading(false);
      console.log('✅ Médias chargés:', mediaData.length);
    }, 100);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeCategory, mediaType]);

  // Types de médias
  const mediaTypes = [
    { id: 'all', name: 'Tous', icon: '🖼️' },
    { id: 'photos', name: 'Photos', icon: '📷' },
    { id: 'videos', name: 'Vidéos', icon: '🎥' },
    { id: 'audio', name: 'Audio', icon: '🎵' }
  ];

  // Catégories de contenu
  const galleryCategories = [
    { id: 'all', name: 'Tout', icon: '🌟' },
    { id: 'concerts', name: 'Concerts', icon: '🎵' },
    { id: 'repetitions', name: 'Répétitions', icon: '🎶' },
    { id: 'portraits', name: 'Portraits', icon: '👤' },
    { id: 'evenements', name: 'Événements', icon: '🎭' }
  ];

  // Filtrage des médias
  const filteredMedia = galleryMedia.filter(media => {
    const categoryMatch = activeCategory === 'all' || media.category === activeCategory;
    const typeMatch = mediaType === 'all' || media.type === mediaType;
    return categoryMatch && typeMatch;
  });

  const displayMedia = viewAll ? filteredMedia : filteredMedia.slice(0, 8);

  const openModal = (media) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  // Rendu des miniatures
  const renderMediaThumbnail = (media) => {
    const baseClasses = "w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500";

    switch (media.type) {
      case 'photos':
        return (
          <img 
            src={media.thumbnail || media.src} 
            alt={media.title}
            className={baseClasses}
            loading="lazy"
          />
        );
      case 'videos':
        return (
          <div className="relative">
            <img 
              src={media.thumbnail} 
              alt={media.title}
              className={baseClasses}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="relative">
            <img 
              src={media.thumbnail || '/images/audio-cover.jpg'} 
              alt={media.title}
              className={baseClasses}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-blue-900 bg-opacity-70 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-3xl mb-2">🎵</div>
                <div className="text-sm font-semibold">AUDIO</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <img 
            src={media.thumbnail || media.src} 
            alt={media.title}
            className={baseClasses}
            loading="lazy"
          />
        );
    }
  };

  // Icône pour le type de média
  const getMediaTypeIcon = (type) => {
    switch (type) {
      case 'photos': return '📷';
      case 'videos': return '🎥';
      case 'audio': return '🎵';
      default: return '🖼️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la galerie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-blue-800 to-purple-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">Galerie Multimédia</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-purple-100 leading-relaxed">
            Découvrez l'univers de C.A.S.T. Cantoria à travers nos médias
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/events" 
              className="bg-white text-purple-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
            >
              📅 Voir nos Concerts
            </Link>
            <Link 
              to="/join" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-900 transition transform hover:scale-105"
            >
              👥 Nous Rejoindre
            </Link>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="bg-white/90 backdrop-blur-sm py-6 shadow-lg">
        <div className="container mx-auto px-4">
          {/* Filtres par Type */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Type de Média</h3>
            <div className="flex flex-wrap gap-2">
              {mediaTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    setMediaType(type.id);
                    setViewAll(false);
                  }}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    mediaType === type.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filtres par Catégorie */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {galleryCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setViewAll(false);
                  }}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grille de Médias */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Compteur */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              {filteredMedia.length} média{filteredMedia.length > 1 ? 's' : ''} trouvé{filteredMedia.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Grille */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayMedia.map(media => (
              <div 
                key={media.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                onClick={() => openModal(media)}
              >
                {/* Miniature */}
                <div className="relative overflow-hidden">
                  {renderMediaThumbnail(media)}
                  
                  {/* Badge Type */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {getMediaTypeIcon(media.type)}
                  </div>
                </div>

                {/* Informations */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{media.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{media.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>📅 {media.date}</span>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded capitalize">
                      {media.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message vide */}
          {filteredMedia.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun média trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos filtres de recherche.</p>
            </div>
          )}

          {/* Bouton Voir Plus */}
          {filteredMedia.length > 8 && !viewAll && (
            <div className="text-center mt-12">
              <button
                onClick={() => setViewAll(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Voir tous les médias ({filteredMedia.length})
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition z-10"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-6">
                {selectedMedia.type === 'photos' && (
                  <img 
                    src={selectedMedia.src} 
                    alt={selectedMedia.title}
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                  />
                )}
                
                {selectedMedia.type === 'videos' && (
                  <video 
                    controls 
                    className="w-full h-auto max-h-[60vh] rounded-lg"
                    autoPlay
                  >
                    <source src={selectedMedia.src} type={`video/${selectedMedia.format}`} />
                  </video>
                )}
                
                {selectedMedia.type === 'audio' && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎵</div>
                    <audio controls className="w-full max-w-md mx-auto" autoPlay>
                      <source src={selectedMedia.src} type={`audio/${selectedMedia.format}`} />
                    </audio>
                  </div>
                )}
              </div>

              <div className="p-6 border-t">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMedia.title}</h3>
                <p className="text-gray-600 text-lg mb-4">{selectedMedia.description}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    <span>📅 {selectedMedia.date}</span>
                    <span className="ml-4 bg-blue-100 text-blue-600 px-3 py-1 rounded-full capitalize">
                      {selectedMedia.category}
                    </span>
                  </div>
                  <div>par {selectedMedia.author}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;