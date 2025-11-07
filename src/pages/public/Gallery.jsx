// src/pages/public/Gallery.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [mediaType, setMediaType] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

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
    { id: 'evenements', name: 'Événements', icon: '🎭' },
    { id: 'portraits', name: 'Portraits', icon: '👤' },
    { id: 'communauté', name: 'Communauté', icon: '👥' }
  ];

  // Données des médias (même contenu que précédemment)
  const galleryMedia = [
    // PHOTOS
    {
      id: 1,
      type: 'photos',
      category: 'concerts',
      src: '/images/concert1.jpg',
      thumbnail: '/images/concert1.jpg',
      title: 'Concert de Noël 2023',
      description: 'Célébration de Noël à la Cathédrale Sainte-Marie',
      date: '24 Décembre 2023',
      author: 'Jean Dupont',
      duration: null,
      format: 'jpg'
    },
    {
      id: 2,
      type: 'photos',
      category: 'repetitions',
      src: '/images/chorale-1.jpg',
      thumbnail: '/images/chorale-1.jpg',
      title: 'Répétition Hebdomadaire',
      description: 'Session de travail sur le nouveau répertoire de Carême',
      date: '15 Janvier 2024',
      author: 'Marie Lambert',
      duration: null,
      format: 'jpg'
    },
    {
      id: 3,
      type: 'photos',
      category: 'portraits',
      src: '/images/portrait.jpg',
      thumbnail: '/images/portrait.jpg',
      title: 'Portrait - Chef de Chœur',
      description: 'Notre directeur artistique lors des répétitions',
      date: '5 Mars 2024',
      author: 'C.A.S.T. Team',
      duration: null,
      format: 'jpg'
    },
    {
      id: 4,
      type: 'photos',
      category: 'evenements',
      src: '/images/gallery/galerie1.jpg',
      thumbnail: '/images/gallery/galerie1.jpg',
      title: 'Rencontre Annuelle 2024',
      description: 'Rassemblement des membres de C.A.S.T. Cantoria',
      date: '10 Février 2024',
      author: 'Pierre Martin',
      duration: null,
      format: 'jpg'
    },
    {
      id: 5,
      type: 'photos',
      category: 'communauté',
      src: '/images/chorale-3.jpg',
      thumbnail: '/images/chorale-3.jpg',
      title: 'Sortie Communautaire',
      description: 'Journée de cohésion entre les membres',
      date: '20 Janvier 2024',
      author: 'Sophie Bernard',
      duration: null,
      format: 'jpg'
    },

    // VIDÉOS
    {
      id: 6,
      type: 'videos',
      category: 'concerts',
      src: '/videos/presentation-cast.mp4',
      thumbnail: '/images/gallery/galerie5.jpg',
      title: 'Concert de Noël 2023 - Extrait',
      description: 'Extrait musical de notre célébration de Noël',
      date: '24 Décembre 2023',
      author: 'C.A.S.T. Production',
      duration: '15:30',
      format: 'mp4'
    },
    {
      id: 7,
      type: 'videos',
      category: 'repetitions',
      src: '/videos/message-spirituel.mp4',
      thumbnail: '/images/gallery/galerie6.jpg',
      title: 'Documentaire C.A.S.T.',
      description: 'Portrait de notre chorale et de sa mission spirituelle',
      date: '15 Janvier 2024',
      author: 'Lucie Moreau',
      duration: '25:45',
      format: 'mp4'
    },
    {
      id: 8,
      type: 'videos',
      category: 'evenements',
      src: '/videos/presentation-cast.mp4',
      thumbnail: '/images/gallery/galerie7.jpg',
      title: 'Atelier Vocal Masterclass',
      description: 'Session de formation aux techniques vocales avancées',
      date: '15 Février 2024',
      author: 'Maître Chantal',
      duration: '18:20',
      format: 'mp4'
    },

    // AUDIO
    {
      id: 9,
      type: 'audio',
      category: 'concerts',
      src: '/audio/cantique-1.mp3',
      thumbnail: '/images/audio-cover.jpg',
      title: 'Cantique de Noël - Douce Nuit',
      description: 'Enregistrement live de notre concert de Noël',
      date: '24 Décembre 2023',
      author: 'Section Soprano',
      duration: '4:15',
      format: 'mp3'
    },
    {
      id: 10,
      type: 'audio',
      category: 'repetitions',
      src: '/audio/intro-cast.mp3',
      thumbnail: '/images/audio-cover.jpg',
      title: 'Prélude de Carême',
      description: 'Extrait des répétitions du répertoire de Carême',
      date: '10 Mars 2024',
      author: 'Ensemble C.A.S.T.',
      duration: '3:45',
      format: 'mp3'
    },
    {
      id: 11,
      type: 'photos',
      category: 'concerts',
      src: '/images/gallery/galerie2.jpg',
      thumbnail: '/images/gallery/galerie2.jpg',
      title: 'Concert de Pâques 2024',
      description: 'Célébration musicale de la Résurrection',
      date: '1 Avril 2024',
      author: 'C.A.S.T. Team',
      duration: null,
      format: 'jpg'
    },
    {
      id: 12,
      type: 'photos',
      category: 'portraits',
      src: '/images/pcast01.jpg',
      thumbnail: '/images/pcast01.jpg',
      title: 'Portrait - Ténor Solo',
      description: 'Notre soliste ténor en répétition',
      date: '8 Janvier 2024',
      author: 'Photographe C.A.S.T.',
      duration: null,
      format: 'jpg'
    }
  ];

  // Filtrage des médias
  const filteredMedia = galleryMedia.filter(media => {
    const categoryMatch = activeCategory === 'all' || media.category === activeCategory;
    const typeMatch = mediaType === 'all' || media.type === mediaType;
    return categoryMatch && typeMatch;
  });

  // Médias pour l'affichage (avec limite si pas "Voir tout")
  const displayMedia = viewAll ? filteredMedia : filteredMedia.slice(0, 6);

  const openModal = (media) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  // Rendu des miniatures selon le type
  const renderMediaThumbnail = (media) => {
    const baseClasses = "w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500";

    switch (media.type) {
      case 'photos':
        return (
          <img 
            src={media.thumbnail} 
            alt={media.title}
            className={baseClasses}
          />
        );
      case 'videos':
        return (
          <div className="relative">
            <img 
              src={media.thumbnail} 
              alt={media.title}
              className={baseClasses}
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
              src={media.thumbnail} 
              alt={media.title}
              className={baseClasses}
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
        return null;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-blue-800 to-purple-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">Galerie Multimédia</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-purple-100 leading-relaxed">
            Plongez dans l'univers de C.A.S.T. Cantoria à travers nos photos, vidéos et enregistrements
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

      {/* Filtres Rétractables */}
      <section className={`bg-white/90 backdrop-blur-sm sticky top-20 z-30 shadow-lg transition-all duration-300 ${
        filtersExpanded ? 'py-6' : 'py-3'
      }`}>
        <div className="container mx-auto px-4">
          
          {/* En-tête des filtres - Toujours visible */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
              >
                <span>🎛️</span>
                <span className="font-semibold">Filtres</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${
                    filtersExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Filtres actifs rapides */}
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                {(activeCategory !== 'all' || mediaType !== 'all') && (
                  <>
                    <span className="text-gray-600">Actifs :</span>
                    {mediaType !== 'all' && (
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                        {mediaTypes.find(t => t.id === mediaType)?.name}
                      </span>
                    )}
                    {activeCategory !== 'all' && (
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                        {galleryCategories.find(c => c.id === activeCategory)?.name}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Compteur mobile */}
            <div className="sm:hidden bg-gray-100 px-3 py-1 rounded-full text-sm">
              {filteredMedia.length} médias
            </div>
          </div>

          {/* Contenu des filtres - Rétractable */}
          <div className={`overflow-hidden transition-all duration-300 ${
            filtersExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            
            {/* Filtres par Type de Média */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="mr-2">📁</span>
                Type de Média
              </h3>
              <div className="flex flex-wrap gap-2">
                {mediaTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setMediaType(type.id);
                      setViewAll(false);
                    }}
                    className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      mediaType === type.id
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <span className="mr-2 text-sm">{type.icon}</span>
                    <span className="text-sm">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtres par Catégorie */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="mr-2">🏷️</span>
                Catégories
              </h3>
              <div className="flex flex-wrap gap-2">
                {galleryCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setViewAll(false);
                    }}
                    className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-purple-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <span className="mr-2 text-sm">{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions des filtres */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">{filteredMedia.length}</span> médias correspondants
              </div>
              
              <div className="flex space-x-2">
                {(activeCategory !== 'all' || mediaType !== 'all') && (
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setMediaType('all');
                      setViewAll(false);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition"
                  >
                    🔄 Réinitialiser
                  </button>
                )}
                
                <button
                  onClick={() => setFiltersExpanded(false)}
                  className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                >
                  👌 Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grille de Médias */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Statistiques - Version desktop */}
          <div className="hidden md:flex justify-center mb-12">
            <div className="inline-flex gap-8 bg-white/80 backdrop-blur rounded-2xl px-8 py-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredMedia.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredMedia.filter(m => m.type === 'photos').length}
                </div>
                <div className="text-sm text-gray-600">Photos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredMedia.filter(m => m.type === 'videos').length}
                </div>
                <div className="text-sm text-gray-600">Vidéos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredMedia.filter(m => m.type === 'audio').length}
                </div>
                <div className="text-sm text-gray-600">Audio</div>
              </div>
            </div>
          </div>

          {/* Grille Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur">
                    {getMediaTypeIcon(media.type)}
                  </div>
                  
                  {/* Overlay Hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="bg-white/90 backdrop-blur text-blue-600 px-3 py-1 rounded-full font-medium flex items-center text-sm">
                        <span>👁️ Voir</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-900 flex-1 pr-2 line-clamp-2">{media.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded capitalize flex-shrink-0">
                      {media.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{media.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">📅 {media.date}</span>
                      {media.duration && (
                        <span>⏱️ {media.duration}</span>
                      )}
                    </div>
                    <span className="text-gray-400 text-xs">par {media.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message vide */}
          {filteredMedia.length === 0 && (
            <div className="text-center py-16 bg-white/50 rounded-2xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun média trouvé</h3>
              <p className="text-gray-600 mb-6">Essayez de modifier vos filtres de recherche.</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setMediaType('all');
                  setFiltersExpanded(true);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Modifier les filtres
              </button>
            </div>
          )}

          {/* Bouton Voir Tout */}
          {filteredMedia.length > 6 && !viewAll && (
            <div className="text-center mt-12">
              <button
                onClick={() => setViewAll(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg"
              >
                👁️ Voir tous les médias ({filteredMedia.length})
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal de Visualisation (identique à précédemment) */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white transition z-10"
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
                    poster={selectedMedia.thumbnail}
                  >
                    <source src={selectedMedia.src} type={`video/${selectedMedia.format}`} />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                )}
                
                {selectedMedia.type === 'audio' && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎵</div>
                    <audio controls className="w-full max-w-md mx-auto">
                      <source src={selectedMedia.src} type={`audio/${selectedMedia.format}`} />
                      Votre navigateur ne supporte pas la lecture audio.
                    </audio>
                  </div>
                )}
              </div>

              <div className="p-6 border-t">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMedia.title}</h3>
                <p className="text-gray-600 mb-4 text-lg">{selectedMedia.description}</p>
                
                <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>📅 {selectedMedia.date}</span>
                    <span className="capitalize bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                      {selectedMedia.category}
                    </span>
                    <span className="flex items-center">
                      {getMediaTypeIcon(selectedMedia.type)} {selectedMedia.type}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <div>par {selectedMedia.author}</div>
                    {selectedMedia.duration && (
                      <div>⏱️ {selectedMedia.duration}</div>
                    )}
                  </div>
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