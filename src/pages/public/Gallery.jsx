import React, { useEffect, useState } from 'react';
import { GalleryProvider } from '../../contexts/GalleryContext';
import GalleryGrid from '../../components/gallery/GalleryGrid';
import FilterTags from '../../components/gallery/FilterTags';
import MediaModal from '../../components/gallery/MediaModal';
import CloudinaryUpload from '../../components/media/CloudinaryUpload';
import { useAuth } from '../../contexts/AuthContext';
import { moderationService } from '../../services/moderationService';

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [partitions, setPartitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'partitions'
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [filteredPartitions, setFilteredPartitions] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadMedia();
    loadPartitions();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des médias approuvés...');
      
      // Charger depuis Firestore les médias approuvés
      const approvedMedia = await moderationService.getPublicGalleryMedia();
      
      // Combiner avec les médias locaux pour la démo
      const allMedia = [...approvedMedia, ...castMedia].filter(media => 
        media.status === 'approved' || media.approved === true
      );
      
      setMedia(allMedia);
      setFilteredMedia(allMedia);
      
    } catch (error) {
      console.error('❌ Erreur chargement médias:', error);
      // Fallback sur les médias locaux
      setMedia(castMedia);
      setFilteredMedia(castMedia);
    } finally {
      setLoading(false);
    }
  };

  const loadPartitions = async () => {
    try {
      // Simuler le chargement des partitions
      // À remplacer par un appel à votre service partitions
      const partitionsData = [
        {
          id: 'part-1',
          title: 'Ave Maria - Schubert',
          description: 'Partition pour soprano et alto',
          type: 'partition',
          category: 'classique',
          difficulty: 'intermédiaire',
          uploadedBy: 'Marie D.',
          userAvatar: '👩',
          uploadDate: '2024-01-15',
          downloads: 23,
          pages: 4,
          fileUrl: '/partitions/ave-maria-schubert.pdf',
          status: 'approved'
        },
        {
          id: 'part-2',
          title: 'Hallelujah - Cohen',
          description: 'Arrangement choral à 4 voix',
          type: 'partition',
          category: 'contemporain',
          difficulty: 'facile',
          uploadedBy: 'Jean P.',
          userAvatar: '👨',
          uploadDate: '2024-01-10',
          downloads: 45,
          pages: 3,
          fileUrl: '/partitions/hallelujah-cohen.pdf',
          status: 'approved'
        },
        {
          id: 'part-3',
          title: 'Vois sur ton chemin - Les Choristes',
          description: 'Partition complète avec accompagnement',
          type: 'partition',
          category: 'film',
          difficulty: 'facile',
          uploadedBy: 'Sophie L.',
          userAvatar: '👩',
          uploadDate: '2024-01-08',
          downloads: 67,
          pages: 5,
          fileUrl: '/partitions/vois-sur-ton-chemin.pdf',
          status: 'approved'
        }
      ];
      
      setPartitions(partitionsData);
      setFilteredPartitions(partitionsData);
    } catch (error) {
      console.error('❌ Erreur chargement partitions:', error);
    }
  };

  const handleUploadSuccess = (result) => {
    console.log('✅ Upload réussi, résultat:', result);
    setUploadResult({
      success: true,
      message: result.status === 'approved' 
        ? '✅ Upload réussi et auto-approuvé (rôle privilégié)!' 
        : '✅ Upload réussi! Le média est en attente de modération.',
      data: result,
      type: result.resource_type || 'media'
    });
    setShowUploadForm(false);
    
    // Recharger les données après un délai
    setTimeout(() => {
      if (result.resource_type === 'partition') {
        loadPartitions();
      } else {
        loadMedia();
      }
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
    totalMedia: media.length,
    totalPartitions: partitions.length,
    images: media.filter(m => m.type === 'image').length,
    videos: media.filter(m => m.type === 'video').length,
    audio: media.filter(m => m.type === 'audio').length,
    official: media.filter(m => m.source === 'official').length,
    member: media.filter(m => m.source === 'member').length,
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
              Médiathèque C.A.S.T. LUMEN
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Découvrez l'univers musical de la chorale à travers notre collection de 
              <span className="font-semibold text-blue-600"> {stats.totalMedia} médias</span> et 
              <span className="font-semibold text-green-600"> {stats.totalPartitions} partitions</span>
            </p>
            
            {/* Statistiques en badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 px-4 py-2 rounded-full shadow-sm">
                <span className="text-blue-600 font-bold">{stats.totalMedia}</span>
                <span className="text-gray-600 ml-1">médias</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-green-200 px-4 py-2 rounded-full shadow-sm">
                <span className="text-green-600 font-bold">{stats.totalPartitions}</span>
                <span className="text-gray-600 ml-1">partitions</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-purple-200 px-4 py-2 rounded-full shadow-sm">
                <span className="text-purple-600 font-bold">{stats.images + stats.videos + stats.audio}</span>
                <span className="text-gray-600 ml-1">fichiers</span>
              </div>
              {stats.pending > 0 && (
                <div className="bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-full shadow-sm">
                  <span className="text-yellow-800 font-bold">{stats.pending}</span>
                  <span className="text-yellow-700 ml-1">en attente</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation par Onglets */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-2 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Onglets */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'gallery'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🖼️ Galerie Médias
                </button>
                <button
                  onClick={() => setActiveTab('partitions')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'partitions'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📝 Partitions
                </button>
              </div>

              {/* Bouton Upload */}
              {currentUser && (
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {showUploadForm ? '👁️ Voir la collection' : '🚀 Partager un fichier'}
                </button>
              )}
            </div>

            {/* Formulaire d'upload */}
            {showUploadForm && (
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border-2 border-dashed border-blue-200 transition-all duration-500">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    📤 Partagez avec la communauté
                  </h3>
                  <p className="text-gray-600">
                    {userProfile?.role === 'admin' || userProfile?.role === 'moderator' || userProfile?.role === 'super-admin' 
                      ? '🎯 Vos fichiers sont automatiquement approuvés'
                      : '⏳ Vos fichiers seront soumis à modération avant publication'
                    }
                  </p>
                </div>
                
                <CloudinaryUpload 
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                  userRole={userProfile?.role}
                  userId={currentUser?.uid}
                  userName={userProfile?.displayName}
                  allowPartitions={true}
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
                        {uploadResult.type === 'partition' && (
                          <p><strong>📁 Type:</strong> Partition musicale</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA Connexion Élégant */}
          {!currentUser && (
            <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 text-center text-white">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold mb-2">Rejoignez l'aventure musicale</h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Connectez-vous pour partager vos médias, partitions et contributions avec la communauté C.A.S.T.
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

          {/* Contenu selon l'onglet actif */}
          {activeTab === 'gallery' ? (
            <GalleryContent 
              media={filteredMedia}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onFilterChange={setFilteredMedia}
              allMedia={media}
            />
          ) : (
            <PartitionsContent 
              partitions={filteredPartitions}
              onFilterChange={setFilteredPartitions}
              allPartitions={partitions}
            />
          )}

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
                  <div className="text-gray-600">Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎬</div>
                  <div className="font-bold text-purple-600">{stats.videos}</div>
                  <div className="text-gray-600">Vidéos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎵</div>
                  <div className="font-bold text-green-600">{stats.audio}</div>
                  <div className="text-gray-600">Audios</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-bold text-orange-600">{stats.totalPartitions}</div>
                  <div className="text-gray-600">Partitions</div>
                </div>
              </div>
              
              {/* Lien modération pour admins */}
              {(userProfile?.role === 'admin' || userProfile?.role === 'moderator' || userProfile?.role === 'super-admin') && (
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

// Composant pour le contenu Galerie
const GalleryContent = ({ media, viewMode, setViewMode, onFilterChange, allMedia }) => {
  return (
    <div className="space-y-6">
      {/* Contrôles de vue et filtres */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
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
            <span className="font-semibold text-blue-600">{media.length}</span> médias affichés
          </div>
        </div>

        {/* Filtres avancés */}
        <FilterTags onFilterChange={onFilterChange} allMedia={allMedia} />
      </div>

      {/* Grille de médias */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-500">
        <GalleryGrid media={media} viewMode={viewMode} />
      </div>
    </div>
  );
};

// Composant pour le contenu Partitions
const PartitionsContent = ({ partitions, onFilterChange, allPartitions }) => {
  return (
    <div className="space-y-6">
      {/* En-tête Partitions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Partitions Musicales</h3>
            <p className="text-gray-600">
              Collection de partitions partagées par les membres de la chorale
            </p>
          </div>
          
          <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <span className="font-semibold text-green-600">{partitions.length}</span> partitions disponibles
          </div>
        </div>
      </div>

      {/* Grille de partitions */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden p-6">
        {partitions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune partition disponible</h3>
            <p className="text-gray-500">Soyez le premier à partager une partition !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partitions.map(partition => (
              <PartitionCard key={partition.id} partition={partition} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant Carte Partition
const PartitionCard = ({ partition }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* En-tête de la partition */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🎼</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{partition.title}</h4>
            <p className="text-sm text-gray-600">{partition.description}</p>
          </div>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Difficulté:</span>
          <span className={`font-medium ${
            partition.difficulty === 'facile' ? 'text-green-600' :
            partition.difficulty === 'intermédiaire' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {partition.difficulty}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Pages:</span>
          <span className="font-medium text-gray-900">{partition.pages}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Téléchargements:</span>
          <span className="font-medium text-gray-900">{partition.downloads}</span>
        </div>
      </div>

      {/* Uploader info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">{partition.userAvatar}</span>
          <div className="text-xs text-gray-500">
            <div>Par {partition.uploadedBy}</div>
            <div>Le {partition.uploadDate}</div>
          </div>
        </div>
        
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
          📥 Télécharger
        </button>
      </div>
    </div>
  );
};

// MÉDIAS LOCAUX OPTIMISÉS AVEC INFORMATIONS MEMBRES
const castMedia = [
  // Médias Officiels
  {
    id: 1,
    type: 'image',
    url: '/images/gallery/galerie1.jpg',
    title: 'Concert Sacré - Cathédrale',
    description: 'Prestation émouvante lors de notre concert annuel',
    tags: ['concert', 'sacré', 'chorale', 'cathédrale'],
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
    title: 'Répétition Intensive',
    description: 'Moment de travail et de perfectionnement en groupe',
    tags: ['repetition', 'ensemble', 'travail'],
    category: 'repetitions',
    source: 'official',
    status: 'approved',
    aspectRatio: '3:4'
  },

  // Médias Uploadés par les Membres (exemples)
  {
    id: 101,
    type: 'image',
    url: '/images/gallery/galerie3.jpg',
    title: 'Backstage Convivial',
    description: 'Ambiance détendue avant le spectacle',
    tags: ['backstage', 'convivialite', 'detente'],
    category: 'backstage',
    source: 'member',
    status: 'approved',
    aspectRatio: '4:3',
    uploadedBy: 'Marie D.',
    userAvatar: '👩',
    uploadDate: '2024-01-15',
    memberId: 'MEM-2024-001'
  },
  {
    id: 102,
    type: 'video',
    url: '/videos/presentation-cast.mp4',
    title: 'Répétition Solo - Soprano',
    description: 'Partage de ma préparation personnelle',
    tags: ['solo', 'soprano', 'repetition', 'partage'],
    category: 'repetitions',
    source: 'member',
    status: 'approved',
    duration: '2:45',
    uploadedBy: 'Sophie L.',
    userAvatar: '👩',
    uploadDate: '2024-01-12',
    memberId: 'MEM-2024-002'
  },
  {
    id: 103,
    type: 'audio',
    url: '/audio/cantique-1.mp3',
    title: 'Improvisation Vocale',
    description: 'Expérimentation harmonique personnelle',
    tags: ['improvisation', 'vocale', 'experimentation'],
    category: 'creations',
    source: 'member',
    status: 'approved',
    duration: '3:15',
    uploadedBy: 'Jean P.',
    userAvatar: '👨',
    uploadDate: '2024-01-10',
    memberId: 'MEM-2024-003'
  },
  {
    id: 104,
    type: 'image',
    url: '/images/gallery/galerie4.jpg',
    title: 'Détail Partition Ancienne',
    description: 'Partage d\'une partition historique',
    tags: ['partition', 'historique', 'detail'],
    category: 'partitions',
    source: 'member',
    status: 'approved',
    aspectRatio: '2:3',
    uploadedBy: 'Pierre M.',
    userAvatar: '👨',
    uploadDate: '2024-01-08',
    memberId: 'MEM-2024-004'
  },

  // Autres médias existants...
  {
    id: 5,
    type: 'image',
    url: '/images/gallery/galerie5.jpg',
    title: 'Répétition Piano',
    description: 'Session de travail avec accompagnateur',
    tags: ['repetition', 'piano', 'musique'],
    category: 'repetitions',
    source: 'official',
    status: 'approved',
    aspectRatio: '1:1'
  },
  {
    id: 6,
    type: 'image',
    url: '/images/gallery/galerie6.jpg',
    title: 'Moments de Partage',
    description: 'Échanges authentiques entre membres',
    tags: ['partage', 'communauté', 'rencontre'],
    category: 'evenements',
    source: 'official',
    status: 'approved',
    aspectRatio: '4:3'
  },
  {
    id: 22,
    type: 'video', 
    url: '/videos/message-spirituel.mp4',
    title: 'Message Spirituel & Musical',
    description: 'Partage spirituel accompagné de mélodies',
    tags: ['spiritualite', 'message', 'partage'],
    category: 'evenements',
    source: 'official',
    status: 'approved',
    duration: '4:20'
  },
  {
    id: 32,
    type: 'audio',
    url: '/audio/intro-cast.mp3', 
    title: 'Introduction C.A.S.T. Audio',
    description: 'Présentation audio de la chorale',
    tags: ['audio', 'introduction', 'presentation'],
    category: 'evenements',
    source: 'official',
    status: 'approved',
    duration: '1:30'
  }
];

export default Gallery;