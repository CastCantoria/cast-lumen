// src/components/gallery/Gallery.jsx
import React from 'react';
import { GalleryProvider } from '../../contexts/GalleryContext';
import GalleryGrid from './GalleryGrid';
import FilterTags from './FilterTags';
import MediaModal from './MediaModal';

// TES VRAIS MÉDIAS C.A.S.T.
const castMedia = [
  // Images de galerie
  {
    id: 1,
    type: 'image',
    url: '/images/gallery/galerie1.jpg',
    title: 'Concert Sacré',
    description: 'Prestation lors du concert annuel',
    tags: ['concert', 'sacré', 'chorale'],
    category: 'concerts'
  },
  {
    id: 2,
    type: 'image',
    url: '/images/gallery/galerie2.jpg',
    title: 'Répétition Ensemble',
    description: 'Moment de travail en groupe',
    tags: ['repetition', 'ensemble', 'travail'],
    category: 'repetitions'
  },
  {
    id: 3,
    type: 'image',
    url: '/images/gallery/galerie3.jpg',
    title: 'Backstage Convivial',
    description: 'Ambiance détendue avant le spectacle',
    tags: ['backstage', 'convivialite', 'detente'],
    category: 'backstage'
  },
  {
    id: 4,
    type: 'image',
    url: '/images/gallery/galerie4.jpg',
    title: 'Concert Spiritualité',
    description: 'Œuvres sacrées interprétées avec ferveur',
    tags: ['spiritualite', 'concert', 'sacré'],
    category: 'spiritualite'
  },
  {
    id: 5,
    type: 'image',
    url: '/images/gallery/galerie5.jpg',
    title: 'Portrait Artistique',
    description: 'Capture artistique des membres',
    tags: ['portrait', 'artistique', 'membres'],
    category: 'portraits'
  },
  {
    id: 6,
    type: 'image',
    url: '/images/gallery/galerie6.jpg',
    title: 'Événement Spécial',
    description: 'Célébration lors d\'un événement marquant',
    tags: ['evenement', 'celebration', 'special'],
    category: 'evenements'
  },
  {
    id: 7,
    type: 'image',
    url: '/images/gallery/galerie7.jpg',
    title: 'Concert Lumineux',
    description: 'Ambiance lumineuse lors du concert',
    tags: ['concert', 'lumiere', 'ambiance'],
    category: 'concerts'
  },
  {
    id: 8,
    type: 'image',
    url: '/images/gallery/galerie8.jpg',
    title: 'Moment de Recueillement',
    description: 'Instant spirituel partagé',
    tags: ['spiritualite', 'recueillement', 'moment'],
    category: 'spiritualite'
  },

  // Photos supplémentaires
  {
    id: 9,
    type: 'image',
    url: '/images/chorale-1.jpg',
    title: 'Ensemble C.A.S.T.',
    description: 'Photo officielle de la chorale',
    tags: ['ensemble', 'officiel', 'chorale'],
    category: 'portraits'
  },
  {
    id: 10,
    type: 'image',
    url: '/images/chorale-2.jpg',
    title: 'Concert d\'Automne',
    description: 'Prestation saisonnière appréciée',
    tags: ['concert', 'automne', 'saison'],
    category: 'concerts'
  },

  // Audio
  {
    id: 11,
    type: 'audio',
    url: '/audio/cantique-1.mp3',
    title: 'Cantique Sacré',
    description: 'Interprétation émouvante d\'un cantique traditionnel',
    tags: ['audio', 'cantique', 'sacré', 'tradition'],
    category: 'spiritualite'
  },
  {
    id: 12,
    type: 'audio',
    url: '/audio/intro-cast.mp3',
    title: 'Introduction C.A.S.T.',
    description: 'Présentation audio de la chorale',
    tags: ['audio', 'introduction', 'presentation'],
    category: 'presentation'
  },

  // Vidéos
  {
    id: 13,
    type: 'video',
    url: '/videos/presentation-cast.mp4',
    title: 'Présentation C.A.S.T.',
    description: 'Vidéo de présentation de la chorale',
    tags: ['video', 'presentation', 'chorale'],
    category: 'presentation'
  },
  {
    id: 14,
    type: 'video',
    url: '/videos/message-spirituel.mp4',
    title: 'Message Spirituel',
    description: 'Partage d\'un message inspirant',
    tags: ['video', 'spiritualite', 'message'],
    category: 'spiritualite'
  },

  // Ajoute d'autres médias selon tes besoins...
  {
    id: 15,
    type: 'image',
    url: '/images/pcast01.jpg',
    title: 'Répétition Piano',
    description: 'Session de travail avec accompagnement piano',
    tags: ['repetition', 'piano', 'travail'],
    category: 'repetitions'
  },
  {
    id: 16,
    type: 'image',
    url: '/images/pcast03.jpg',
    title: 'Concert d\'Hiver',
    description: 'Prestation lors de la saison hivernale',
    tags: ['concert', 'hiver', 'saison'],
    category: 'concerts'
  }
  // Tu peux ajouter les 50+ médias restants...
];

const Gallery = () => {
  return (
    <GalleryProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-8">
        <div className="container mx-auto px-4">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-cast-green mb-4">
              🎵 Galerie C.A.S.T. LUMEN
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez l'univers musical de la chorale C.A.S.T. à travers {castMedia.length} photos, 
              vidéos et enregistrements audio.
            </p>
          </div>

          {/* Filtres et recherche */}
          <FilterTags />

          {/* Grille de médias */}
          <GalleryGrid media={castMedia} />

          {/* Modal lightbox */}
          <MediaModal />

          {/* Statistiques */}
          <div className="mt-12 text-center text-gray-500">
            <p>
              {castMedia.length} médias disponibles • 
              {castMedia.filter(m => m.type === 'image').length} photos • 
              {castMedia.filter(m => m.type === 'video').length} vidéos • 
              {castMedia.filter(m => m.type === 'audio').length} enregistrements audio
            </p>
          </div>
        </div>
      </div>
    </GalleryProvider>
  );
};

export default Gallery;