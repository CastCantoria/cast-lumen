import React, { useEffect } from 'react';
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
    category: 'concerts',
    source: 'official'
  },
  {
    id: 2,
    type: 'image',
    url: '/images/gallery/galerie2.jpg',
    title: 'Répétition Ensemble',
    description: 'Moment de travail en groupe',
    tags: ['repetition', 'ensemble', 'travail'],
    category: 'repetitions',
    source: 'official'
  },
  {
    id: 3,
    type: 'image',
    url: '/images/gallery/galerie3.jpg',
    title: 'Backstage Convivial',
    description: 'Ambiance détendue avant le spectacle',
    tags: ['backstage', 'convivialite', 'detente'],
    category: 'backstage',
    source: 'official'
  },
  // ... autres médias officiels existants

  // MÉDIAS DES MEMBRES - EXEMPLES
  {
    id: 100,
    type: 'image',
    url: '/images/membres/pcast15.jpg',
    title: 'Répétition Piano - Partagé par Marie',
    description: 'Session de travail avec notre pianiste accompagnateur',
    tags: ['repetition', 'piano', 'membre', 'partage'],
    category: 'repetitions',
    source: 'member',
    author: 'Marie D.',
    date: '2024-01-15'
  },
  {
    id: 101,
    type: 'audio',
    url: '/audio/member-recording-1.mp3',
    title: 'Improvisation Vocale - Partagé par Jean',
    description: 'Improvisation lors d\'une séance de travail personnel',
    tags: ['audio', 'improvisation', 'membre', 'vocale'],
    category: 'repetitions',
    source: 'member',
    author: 'Jean P.',
    date: '2024-01-20'
  },
  {
    id: 102,
    type: 'image',
    url: '/images/membres/pcast16.jpg',
    title: 'Concert Communautaire - Partagé par Sophie',
    description: 'Photo du dernier concert de la communauté',
    tags: ['concert', 'communauté', 'membre', 'partage'],
    category: 'concerts',
    source: 'member',
    author: 'Sophie L.',
    date: '2024-02-01'
  },
  {
    id: 103,
    type: 'video',
    url: '/videos/member-video-1.mp4',
    title: 'Tutoriel Vocal - Partagé par Marc',
    description: 'Partage d\'exercices vocaux pour les choristes',
    tags: ['video', 'tutoriel', 'vocal', 'membre'],
    category: 'repetitions',
    source: 'member',
    author: 'Marc T.',
    date: '2024-02-05'
  },
  {
    id: 104,
    type: 'image',
    url: '/images/partitions/member-partition-1.jpg',
    title: 'Arrangement Personnel - Partagé par Lucie',
    description: 'Mon arrangement pour le chant du mois',
    tags: ['partition', 'arrangement', 'membre', 'création'],
    category: 'partitions',
    source: 'member',
    author: 'Lucie M.',
    date: '2024-02-10'
  }
];

const Gallery = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const memberMediaCount = castMedia.filter(media => media.source === 'member').length;
  const officialMediaCount = castMedia.filter(media => media.source === 'official').length;

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
            
            {/* Statistiques des médias */}
            <div className="mt-6 flex justify-center gap-6 text-sm">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <strong>{officialMediaCount}</strong> médias officiels
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <strong>{memberMediaCount}</strong> médias des membres
              </div>
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                <a href="#member-uploads" className="hover:underline">
                  👆 Partager mes médias
                </a>
              </div>
            </div>
          </div>

          {/* Filtres et recherche */}
          <FilterTags />

          {/* Grille de médias */}
          <GalleryGrid media={castMedia} />

          {/* Section Upload des Membres */}
          <div id="member-uploads" className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cast-green mb-4">
                👥 Espace Partage des Membres
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Participez à l'enrichissement de notre galerie en partageant vos photos, vidéos, 
                enregistrements audio ou partitions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">📷</div>
                  <h3 className="font-bold text-blue-800">Photos</h3>
                  <p className="text-sm text-blue-600">Concert, répétitions, moments</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🎬</div>
                  <h3 className="font-bold text-green-800">Vidéos</h3>
                  <p className="text-sm text-green-600">Extraits, tutoriels, partages</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🎵</div>
                  <h3 className="font-bold text-purple-800">Audio</h3>
                  <p className="text-sm text-purple-600">Enregistrements, exercices</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🎼</div>
                  <h3 className="font-bold text-indigo-800">Partitions</h3>
                  <p className="text-sm text-indigo-600">Arrangements, créations</p>
                </div>
              </div>
            </div>

            {/* Instructions pour l'upload */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Comment partager ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <p className="font-semibold">Connectez-vous</p>
                  <p className="text-gray-600">Accédez à votre espace membre</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <p className="font-semibold">Allez dans "Médias"</p>
                  <p className="text-gray-600">Section gestion des médias</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <p className="font-semibold">Téléversez</p>
                  <p className="text-gray-600">Photos, vidéos, audio ou partitions</p>
                </div>
              </div>
            </div>

            {/* CTA pour l'upload */}
            <div className="text-center">
              <a 
                href="/media" 
                className="inline-flex items-center bg-cast-green text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors font-semibold"
              >
                📤 Accéder à l'upload des médias
                <span className="ml-2">→</span>
              </a>
              <p className="text-sm text-gray-600 mt-2">
                Disponible pour tous les membres connectés
              </p>
            </div>
          </div>

          {/* Modal lightbox */}
          <MediaModal />

          {/* Statistiques */}
          <div className="mt-12 text-center text-gray-500">
            <p>
              {castMedia.length} médias disponibles • 
              {castMedia.filter(m => m.type === 'image').length} photos • 
              {castMedia.filter(m => m.type === 'video').length} vidéos • 
              {castMedia.filter(m => m.type === 'audio').length} enregistrements audio •
              {memberMediaCount} partages membres
            </p>
          </div>
        </div>
      </div>
    </GalleryProvider>
  );
};

export default Gallery;