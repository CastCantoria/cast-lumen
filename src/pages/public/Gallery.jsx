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
  const [activeTab, setActiveTab] = useState('gallery');
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [filteredPartitions, setFilteredPartitions] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [viewMode, setViewMode] = useState('masonry');
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadMedia();
    loadPartitions();
    loadPublicUploads(); // Charger les fichiers du dossier public/upload
  }, [currentUser]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des médias approuvés...');
      
      const approvedMedia = await moderationService.getPublicGalleryMedia();
      
      // Combiner avec les médias locaux
      const allMedia = [...approvedMedia, ...castMedia].filter(media => 
        media.status === 'approved' || media.approved === true
      );
      
      setMedia(allMedia);
      setFilteredMedia(allMedia);
      
    } catch (error) {
      console.error('❌ Erreur chargement médias:', error);
      setMedia(castMedia);
      setFilteredMedia(castMedia);
    }
  };

  const loadPartitions = async () => {
    try {
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
        }
      ];
      
      setPartitions(partitionsData);
      setFilteredPartitions(partitionsData);
    } catch (error) {
      console.error('❌ Erreur chargement partitions:', error);
    }
  };

  // Nouvelle fonction : Charger les fichiers du dossier public/upload
  const loadPublicUploads = async () => {
    try {
      console.log('📁 Chargement des fichiers publics...');
      
      // Simuler le chargement des fichiers depuis public/upload
      const publicUploads = await moderationService.getPublicUploads();
      
      if (publicUploads.length > 0) {
        setMedia(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newMedia = publicUploads.filter(upload => !existingIds.has(upload.id));
          return [...prev, ...newMedia];
        });
        
        setFilteredMedia(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newMedia = publicUploads.filter(upload => !existingIds.has(upload.id));
          return [...prev, ...newMedia];
        });
        
        console.log(`✅ ${publicUploads.length} fichiers publics chargés`);
      }
    } catch (error) {
      console.error('❌ Erreur chargement fichiers publics:', error);
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
      data: result,
      type: result.resource_type || 'media'
    });
    setShowUploadForm(false);
    
    // Recharger les médias après un upload réussi
    setTimeout(() => {
      if (result.resource_type === 'partition') {
        loadPartitions();
      } else {
        loadMedia();
        loadPublicUploads();
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

  // Gestion intelligente de l'aperçu des documents
  const handleDocumentPreview = (media) => {
    if (!currentUser) {
      alert('🔐 Connectez-vous pour accéder aux documents');
      return;
    }

    const mediaType = moderationService.getMediaTypeFromUrl(media.url);
    const fileName = media.fileName || media.title || 'document';
    
    // Pour les documents, ouvrir l'interface d'aperçu personnalisée
    const newWindow = window.open('', '_blank');
    
    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aperçu - ${media.title || 'Document'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .preview-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          .icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .description {
            color: #6b7280;
            margin-bottom: 30px;
            line-height: 1.5;
          }
          .file-info {
            background: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            text-align: left;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 4px 0;
          }
          .info-label {
            color: #374151;
            font-weight: 500;
          }
          .info-value {
            color: #1f2937;
            font-weight: 600;
          }
          .button-group {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 25px;
          }
          .button {
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .button-download {
            background: #10b981;
            color: white;
          }
          .button-download:hover {
            background: #059669;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
          }
          .button-close {
            background: #6b7280;
            color: white;
          }
          .button-close:hover {
            background: #4b5563;
            transform: translateY(-2px);
          }
          .document-type {
            display: inline-block;
            padding: 4px 12px;
            background: #e0e7ff;
            color: #3730a3;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 15px;
          }
          .tip {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 20px;
            line-height: 1.4;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="icon">📄</div>
          <div class="document-type">${mediaType.toUpperCase()}</div>
          <h1 class="title">${media.title || 'Document sans titre'}</h1>
          ${media.description ? `<p class="description">${media.description}</p>` : ''}
          
          <div class="file-info">
            <div class="info-item">
              <span class="info-label">📁 Type de fichier:</span>
              <span class="info-value">${mediaType}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📊 Taille:</span>
              <span class="info-value">${moderationService.formatFileSize(media.fileSize) || 'Non spécifiée'}</span>
            </div>
            ${media.uploadedBy ? `
            <div class="info-item">
              <span class="info-label">👤 Uploadé par:</span>
              <span class="info-value">${media.uploadedBy}</span>
            </div>
            ` : ''}
            ${media.uploadDate ? `
            <div class="info-item">
              <span class="info-label">📅 Date:</span>
              <span class="info-value">${media.uploadDate}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="button-group">
            <a href="${media.url}" download="${fileName}" class="button button-download">
              📥 Télécharger
            </a>
            <button onclick="window.close()" class="button button-close">
              ✕ Fermer
            </button>
          </div>
          
          <p class="tip">
            💡 Conseil : Téléchargez le document pour le consulter dans son intégralité.<br>
            Formats supportés : PDF, DOC, DOCX, TXT, et tous les documents texte.
          </p>
        </div>
        
        <script>
          // Focus sur le bouton de fermeture pour une meilleure accessibilité
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
              window.close();
            }
          });
        </script>
      </body>
      </html>
    `);
  };

  // Statistiques
  const stats = {
    totalMedia: media.length,
    totalPartitions: partitions.length,
    images: media.filter(m => m.type === 'image').length,
    videos: media.filter(m => m.type === 'video').length,
    audio: media.filter(m => m.type === 'audio').length,
    documents: media.filter(m => moderationService.getMediaTypeFromUrl(m.url) === 'document').length,
    official: media.filter(m => m.source === 'official').length,
    member: media.filter(m => m.source === 'member').length,
    pending: media.filter(m => m.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          </div>
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
              <span className="font-semibold text-blue-600"> {stats.totalMedia} médias</span>
              {currentUser && stats.totalPartitions > 0 && (
                <span> et <span className="font-semibold text-green-600"> {stats.totalPartitions} partitions</span></span>
              )}
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 px-4 py-2 rounded-full shadow-sm">
                <span className="text-blue-600 font-bold">{stats.totalMedia}</span>
                <span className="text-gray-600 ml-1">médias</span>
              </div>
              {currentUser && stats.totalPartitions > 0 && (
                <div className="bg-white/80 backdrop-blur-sm border border-green-200 px-4 py-2 rounded-full shadow-sm">
                  <span className="text-green-600 font-bold">{stats.totalPartitions}</span>
                  <span className="text-gray-600 ml-1">partitions</span>
                </div>
              )}
              <div className="bg-white/80 backdrop-blur-sm border border-purple-200 px-4 py-2 rounded-full shadow-sm">
                <span className="text-purple-600 font-bold">{stats.images + stats.videos + stats.audio}</span>
                <span className="text-gray-600 ml-1">fichiers publics</span>
              </div>
              {currentUser && stats.documents > 0 && (
                <div className="bg-white/80 backdrop-blur-sm border border-orange-200 px-4 py-2 rounded-full shadow-sm">
                  <span className="text-orange-600 font-bold">{stats.documents}</span>
                  <span className="text-gray-600 ml-1">documents</span>
                </div>
              )}
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
                {currentUser && partitions.length > 0 && (
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
                )}
              </div>

              {currentUser && (
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {showUploadForm ? '👁️ Voir la collection' : '🚀 Partager un fichier'}
                </button>
              )}
            </div>

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

          {!currentUser && (
            <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 text-center text-white">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold mb-2">Rejoignez l'aventure musicale</h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Connectez-vous pour accéder aux documents, partitions et partager vos médias avec la communauté C.A.S.T.
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
              onDocumentPreview={handleDocumentPreview}
            />
          ) : (
            <PartitionsContent 
              partitions={filteredPartitions}
              onFilterChange={setFilteredPartitions}
              allPartitions={partitions}
            />
          )}

          <MediaModal />

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
                {currentUser && (
                  <div className="text-center">
                    <div className="text-3xl mb-2">📄</div>
                    <div className="font-bold text-orange-600">{stats.documents}</div>
                    <div className="text-gray-600">Documents</div>
                  </div>
                )}
              </div>
              
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
const GalleryContent = ({ media, viewMode, setViewMode, onFilterChange, allMedia, onDocumentPreview }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Mode d'affichage:</h3>
            <div className="flex gap-2">
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
            </div>
          </div>
          
          <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <span className="font-semibold text-blue-600">{media.length}</span> médias affichés
          </div>
        </div>

        <FilterTags onFilterChange={onFilterChange} allMedia={allMedia} />
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-500">
        <GalleryGrid 
          media={media} 
          viewMode={viewMode} 
          onDocumentPreview={onDocumentPreview}
        />
      </div>
    </div>
  );
};

// Composant pour le contenu Partitions
const PartitionsContent = ({ partitions, onFilterChange, allPartitions }) => {
  return (
    <div className="space-y-6">
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
  const { currentUser } = useAuth();

  const handleDownload = () => {
    if (!currentUser) {
      alert('🔐 Connectez-vous pour télécharger cette partition');
      return;
    }
    moderationService.downloadMedia(partition);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
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

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">{partition.userAvatar}</span>
          <div className="text-xs text-gray-500">
            <div>Par {partition.uploadedBy}</div>
            <div>Le {partition.uploadDate}</div>
          </div>
        </div>
        
        <button 
          onClick={handleDownload}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
        >
          📥 Télécharger
        </button>
      </div>
    </div>
  );
};

// MÉDIAS LOCAUX AVEC DOCUMENTS
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

  // Documents PDF (exemples) - Visibles uniquement aux utilisateurs connectés
  {
    id: 201,
    type: 'document',
    url: 'https://res.cloudinary.com/dqzyuz3gu/image/upload/v1762851329/w1cs1qy71ivfgpaok5jt.pdf',
    title: 'Guide du Choriste Débutant',
    description: 'Document complet pour les nouveaux membres de la chorale',
    tags: ['guide', 'débutant', 'documentation'],
    category: 'documents',
    source: 'official',
    status: 'approved',
    fileSize: 2457600,
    uploadedBy: 'Admin CAST',
    userAvatar: '👨‍💼',
    uploadDate: '2024-01-20'
  },
  {
    id: 202,
    type: 'document',
    url: 'https://res.cloudinary.com/dqzyuz3gu/image/upload/v1762844886/j6luoz6qeroi9gcvykot.pdf',
    title: 'Répertoire Musical 2024',
    description: 'Liste complète des chants au répertoire cette année',
    tags: ['repertoire', 'planning', 'document'],
    category: 'documents',
    source: 'official',
    status: 'approved',
    fileSize: 1536000,
    uploadedBy: 'Admin CAST',
    userAvatar: '👨‍💼',
    uploadDate: '2024-01-18'
  },

  // Autres médias
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
  }
];

export default Gallery;