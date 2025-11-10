import React, { useEffect, useState } from 'react';
import { GalleryProvider } from '../../contexts/GalleryContext';
import GalleryGrid from '../../components/gallery/GalleryGrid';
import FilterTags from '../../components/gallery/FilterTags';
import MediaModal from '../../components/gallery/MediaModal';
import CloudinaryUpload from '../../components/media/CloudinaryUpload';
import { useAuth } from '../../contexts/AuthContext';

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'masonry'
  const { currentUser, userRole } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des médias...');
      
      // Simuler un chargement pour voir l'animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMedia(castMedia);
      setFilteredMedia(castMedia);
      
    } catch (error) {
      console.error('❌ Erreur chargement médias:', error);
      setMedia(castMedia);
      setFilteredMedia(castMedia);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (result) => {
    console.log('✅ Upload réussi, résultat:', result);
    setUploadResult({
      success: true,
      message: result.status === 'approved' 
        ? '✅ Upload réussi et auto-approuvé (rôle privilégié)!' 
        : '✅ Upload réussi! Le média est en attente de modération.',
      data: result
    });
    setShowUploadForm(false);
    
    setTimeout(() => {
      loadMedia();
    }, 2000);
  };

  const handleUploadError = (error) => {
    console.error('❌ Erreur upload:', error);
    setUploadResult({
      success: false,
      message: `❌ Erreur lors de l'upload: ${error.message}`
    });
  };

  // Statistiques
  const stats = {
    total: media.length,
    images: media.filter(m => m.type === 'image').length,
    videos: media.filter(m => m.type === 'video').length,
    audio: media.filter(m => m.type === 'audio').length,
    official: media.filter(m => m.source === 'official').length,
    member: media.filter(m => m.source === 'member' && m.status !== 'rejected').length,
    pending: media.filter(m => m.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
        <div className="container mx-auto px-4">
          {/* Skeleton Header */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="flex justify-center gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-full w-24"></div>
              ))}
            </div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg aspect-square mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <GalleryProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
        <div className="container mx-auto px-4">
          {/* En-tête Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6 shadow-lg">
              <span className="text-3xl text-white">🎵</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Galerie C.A.S.T. LUMEN
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Plongez dans l'univers musical de la chorale C.A.S.T. à travers notre collection de 
              <span className="font-semibold text-blue-600"> {stats.total} trésors multimédias</span>
            </p>
            
            {/* Statistiques en badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 px-4 py-2 rounded-full shadow-sm">
                <span className="text-blue-600 font-bold">{stats.images}</span>
                <span className="text-gray-600 ml-1">photos</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-purple-200 px-4 py-2 rounded-full shadow-sm">
                <span className="text-purple-600 font-bold">{stats.videos}</span>
                <span className="text-gray-600 ml-1">vidéos</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-green-200 px-4 py-2 rounded-full shadow-sm">
                <span className="text-green-600 font-bold">{stats.audio}</span>
                <span className="text-gray-600 ml-1">enregistrements</span>
              </div>
              {stats.pending > 0 && (
                <div className="bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-full shadow-sm">
                  <span className="text-yellow-800 font-bold">{stats.pending}</span>
                  <span className="text-yellow-700 ml-1">en attente</span>
                </div>
              )}
            </div>
          </div>

          {/* Section Upload Interactive */}
          {currentUser && (
            <div className="mb-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <span className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg text-white">📤</span>
                    Partager votre talent
                  </h2>
                  <p className="text-gray-600">
                    {userRole === 'admin' || userRole === 'moderator' || userRole === 'super-admin' 
                      ? '🎯 Vos médias sont automatiquement approuvés'
                      : '⏳ Vos médias seront soumis à modération avant publication'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {showUploadForm ? '👁️ Aperçu galerie' : '🚀 Uploader un média'}
                </button>
              </div>

              {showUploadForm && (
                <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border-2 border-dashed border-blue-200 transition-all duration-500">
                  <CloudinaryUpload 
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                    userRole={userRole}
                    userId={currentUser.uid}
                  />
                </div>
              )}

              {/* Résultat d'upload animé */}
              {uploadResult && (
                <div className={`mt-4 p-4 rounded-xl border-2 transition-all duration-500 ${
                  uploadResult.success 
                    ? 'bg-green-50 border-green-200 animate-pulse' 
                    : 'bg-red-50 border-red-200 shake-animation'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl ${uploadResult.success ? 'text-green-500' : 'text-red-500'}`}>
                      {uploadResult.success ? '✅' : '❌'}
                    </div>
                    <div>
                      <p className={`font-medium ${uploadResult.success ? 'text-green-800' : 'text-red-800'}`}>
                        {uploadResult.message}
                      </p>
                      {uploadResult.success && uploadResult.data && (
                        <div className="mt-2 text-sm text-green-700 space-y-1">
                          <p><strong>🎨 Titre:</strong> {uploadResult.data.title || 'Sans titre'}</p>
                          <p><strong>📊 Statut:</strong> 
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              uploadResult.data.status === 'approved' 
                                ? 'bg-green-100 text-green-800 border border-green-300' 
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            }`}>
                              {uploadResult.data.status === 'approved' ? '✅ Approuvé' : '⏳ En attente de modération'}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CTA Connexion Élégant */}
          {!currentUser && (
            <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 text-center text-white">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold mb-2">Rejoignez l'aventure musicale</h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Connectez-vous pour partager vos photos, vidéos et enregistrements avec la communauté C.A.S.T.
                </p>
                <div className="flex gap-4 justify-center">
                  <a 
                    href="/login" 
                    className="px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🎵 Se connecter
                  </a>
                  <a 
                    href="/register" 
                    className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold"
                  >
                    ✨ S'inscrire
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Contrôles de vue et filtres */}
          <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Mode d'affichage:</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ◼️ Grille
                  </button>
                  <button
                    onClick={() => setViewMode('masonry')}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      viewMode === 'masonry' 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    🧱 Masonry
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                <span className="font-semibold text-blue-600">{filteredMedia.length}</span> médias affichés
              </div>
            </div>

            {/* Filtres avancés */}
            <FilterTags onFilterChange={setFilteredMedia} allMedia={media} />
          </div>

          {/* Grille de médias */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-500">
            <GalleryGrid media={filteredMedia} viewMode={viewMode} />
          </div>

          {/* Modal lightbox */}
          <MediaModal />

          {/* Pied de page informatif */}
          <div className="mt-12 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">💫 Notre Collection Musicale</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div className="text-center">
                  <div className="text-3xl mb-2">🖼️</div>
                  <div className="font-bold text-blue-600">{stats.images}</div>
                  <div className="text-gray-600">Photos de concerts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎬</div>
                  <div className="font-bold text-purple-600">{stats.videos}</div>
                  <div className="text-gray-600">Vidéos live</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎵</div>
                  <div className="font-bold text-green-600">{stats.audio}</div>
                  <div className="text-gray-600">Enregistrements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="font-bold text-orange-600">{stats.member}</div>
                  <div className="text-gray-600">Médias membres</div>
                </div>
              </div>
              
              {/* Lien modération pour admins */}
              {(userRole === 'admin' || userRole === 'moderator' || userRole === 'super-admin') && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a 
                    href="/admin/media" 
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="text-xl">🛡️</span>
                    Accéder à la modération des médias
                    <span className="text-lg">→</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GalleryProvider>
  );
};

// MÉDIAS LOCAUX OPTIMISÉS AVEC IMAGES ADAPTATIVES
const castMedia = [
  // Images haute qualité - Concerts
  {
    id: 1,
    type: 'image',
    url: '/images/gallery/galerie1.jpg',
    optimizedUrl: '/images/gallery/galerie1.jpg?w=400&h=300&fit=crop',
    thumbnail: '/images/gallery/galerie1.jpg?w=200&h=150&fit=crop',
    title: 'Concert Sacré - Cathédrale',
    description: 'Prestation émouvante lors de notre concert annuel dans la cathédrale',
    tags: ['concert', 'sacré', 'chorale', 'cathédrale', 'live'],
    category: 'concerts',
    source: 'official',
    status: 'approved',
    aspectRatio: '4:3',
    featured: true
  },
  {
    id: 2,
    type: 'image',
    url: '/images/gallery/galerie2.jpg',
    optimizedUrl: '/images/gallery/galerie2.jpg?w=400&h=500&fit=crop',
    thumbnail: '/images/gallery/galerie2.jpg?w=200&h=250&fit=crop',
    title: 'Répétition Intensive',
    description: 'Moment de travail et de perfectionnement en groupe',
    tags: ['repetition', 'ensemble', 'travail', 'musique', 'chorale'],
    category: 'repetitions',
    source: 'official',
    status: 'approved',
    aspectRatio: '3:4'
  },
  {
    id: 3,
    type: 'image',
    url: '/images/gallery/galerie3.jpg',
    optimizedUrl: '/images/gallery/galerie3.jpg?w=400&h=300&fit=crop',
    thumbnail: '/images/gallery/galerie3.jpg?w=200&h=150&fit=crop',
    title: 'Backstage Convivial',
    description: 'Ambiance détendue et chaleureuse avant le spectacle',
    tags: ['backstage', 'convivialite', 'detente', 'sourires', 'groupe'],
    category: 'backstage',
    source: 'official',
    status: 'approved',
    aspectRatio: '4:3',
    featured: true
  },
  {
    id: 4,
    type: 'image', 
    url: '/images/gallery/galerie4.jpg',
    optimizedUrl: '/images/gallery/galerie4.jpg?w=400&h=600&fit=crop',
    thumbnail: '/images/gallery/galerie4.jpg?w=200&h=300&fit=crop',
    title: 'Chorale en Action',
    description: 'Performance live capturant toute la passion musicale',
    tags: ['concert', 'performance', 'live', 'passion', 'musique'],
    category: 'concerts',
    source: 'official',
    status: 'approved',
    aspectRatio: '2:3'
  },
  {
    id: 5,
    type: 'image',
    url: '/images/gallery/galerie5.jpg',
    optimizedUrl: '/images/gallery/galerie5.jpg?w=400&h=400&fit=crop',
    thumbnail: '/images/gallery/galerie5.jpg?w=200&h=200&fit=crop',
    title: 'Répétition Piano',
    description: 'Session de travail avec notre accompagnateur talentueux',
    tags: ['repetition', 'piano', 'musique', 'accompagnement', 'travail'],
    category: 'repetitions',
    source: 'official',
    status: 'approved',
    aspectRatio: '1:1'
  },
  {
    id: 6,
    type: 'image',
    url: '/images/gallery/galerie6.jpg',
    optimizedUrl: '/images/gallery/galerie6.jpg?w=400&h=300&fit=crop',
    thumbnail: '/images/gallery/galerie6.jpg?w=200&h=150&fit=crop',
    title: 'Moments de Partage',
    description: 'Échanges authentiques entre les membres de la chorale',
    tags: ['partage', 'communauté', 'rencontre', 'amitié', 'chorale'],
    category: 'evenements',
    source: 'official',
    status: 'approved',
    aspectRatio: '4:3'
  },

  // Vidéos
  {
    id: 21,
    type: 'video',
    url: '/videos/presentation-cast.mp4',
    thumbnail: '/images/hero/photo-choeur.jpeg?w=400&h=300&fit=crop',
    title: 'Présentation C.A.S.T. - Teaser',
    description: 'Découvrez l\'énergie et la passion de notre chorale en vidéo',
    tags: ['presentation', 'chorale', 'video', 'teaser', 'énergie'],
    category: 'concerts',
    source: 'official',
    status: 'approved',
    duration: '2:45',
    featured: true
  },
  {
    id: 22,
    type: 'video', 
    url: '/videos/message-spirituel.mp4',
    thumbnail: '/images/inspiration/inspiration1.jpg?w=400&h=300&fit=crop',
    title: 'Message Spirituel & Musical',
    description: 'Partage spirituel accompagné de nos plus belles mélodies',
    tags: ['spiritualite', 'message', 'partage', 'méditation', 'chorale'],
    category: 'evenements',
    source: 'official',
    status: 'approved',
    duration: '4:20'
  },

  // Audio
  {
    id: 31,
    type: 'audio',
    url: '/audio/cantique-1.mp3',
    thumbnail: '/images/hero/inspiration3.jpg?w=400&h=400&fit=crop',
    title: 'Cantique de Noël - Version 2024',
    description: 'Notre interprétation moderne d\'un classique de Noël',
    tags: ['audio', 'cantique', 'noel', 'chorale', 'tradition'],
    category: 'concerts',
    source: 'official',
    status: 'approved',
    duration: '3:15',
    featured: true
  },
  {
    id: 32,
    type: 'audio',
    url: '/audio/intro-cast.mp3', 
    thumbnail: '/images/logo-cast.png',
    title: 'Introduction C.A.S.T. Audio',
    description: 'Présentation audio de la chorale et de sa mission',
    tags: ['audio', 'introduction', 'presentation', 'chorale', 'mission'],
    category: 'evenements',
    source: 'official',
    status: 'approved',
    duration: '1:30'
  },

  // Images supplémentaires pour enrichir
  {
    id: 7,
    type: 'image',
    url: '/images/gallery/galerie7.jpg',
    optimizedUrl: '/images/gallery/galerie7.jpg?w=400&h=500&fit=crop',
    thumbnail: '/images/gallery/galerie7.jpg?w=200&h=250&fit=crop',
    title: 'Préparation Concert',
    description: 'Derniers préparatifs avant de monter sur scène',
    tags: ['preparation', 'concert', 'backstage', 'scène', 'excitation'],
    category: 'backstage',
    source: 'official',
    status: 'approved',
    aspectRatio: '3:4'
  },
  {
    id: 8,
    type: 'image',
    url: '/images/gallery/galerie8.jpg',
    optimizedUrl: '/images/gallery/galerie8.jpg?w=400&h=300&fit=crop',
    thumbnail: '/images/gallery/galerie8.jpg?w=200&h=150&fit=crop',
    title: 'Ensemble Vocal Parfait',
    description: 'Harmonie des voix lors d\'une répétition mémorable',
    tags: ['repetition', 'vocale', 'harmonie', 'chorale', 'musique'],
    category: 'repetitions',
    source: 'official',
    status: 'approved',
    aspectRatio: '4:3'
  }
];

export default Gallery;