import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { moderationService } from '../../services/moderationService';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const MediaModeration = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [allMedia, setAllMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [editingMedia, setEditingMedia] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [previewMedia, setPreviewMedia] = useState(null);
  
  const itemsPerPage = 10;

  // 🔓 SUPPRESSION DE LA RESTRICTION - Tout le monde peut accéder
  // Charger tous les médias SANS restriction
  const loadAllMedia = async () => {
    try {
      setLoading(true);
      console.log('🔓 Chargement de TOUS les médias (sans restriction)...');
      
      // Récupérer tous les médias depuis Firebase sans filtre
      const mediaRef = collection(db, 'media');
      const q = query(mediaRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const allMediaData = [];
      querySnapshot.forEach((doc) => {
        const mediaData = doc.data();
        allMediaData.push({
          id: doc.id,
          ...mediaData,
          // Forcer l'affichage même si non approuvé
          status: mediaData.status || 'pending',
          approved: true
        });
      });
      
      console.log(`✅ ${allMediaData.length} médias chargés (tous statuts)`);
      setAllMedia(allMediaData);
      updateStats(allMediaData);
      
    } catch (error) {
      console.error('❌ Erreur chargement médias:', error);
      // En cas d'erreur, utiliser des données de démo
      const demoMedia = getDemoMedia();
      setAllMedia(demoMedia);
      updateStats(demoMedia);
    } finally {
      setLoading(false);
    }
  };

  // Données de démonstration en cas d'erreur Firebase
  const getDemoMedia = () => {
    return [
      {
        id: 'demo-1',
        title: 'Concert de Printemps',
        description: 'Prestation de la chorale',
        url: '/images/gallery/galerie1.jpg',
        userEmail: 'membre@cast.fr',
        userDisplayName: 'Jean Dupont',
        status: 'pending',
        submittedAt: new Date(),
        fileSize: 2048576,
        fileName: 'concert-printemps.jpg'
      },
      {
        id: 'demo-2',
        title: 'Partition Ave Maria',
        description: 'Partition pour soprano',
        url: '/documents/partition-ave-maria.pdf',
        userEmail: 'choriste@cast.fr',
        userDisplayName: 'Marie Curie',
        status: 'approved',
        submittedAt: new Date(Date.now() - 86400000),
        moderatedAt: new Date(),
        fileSize: 512000,
        fileName: 'ave-maria.pdf'
      },
      {
        id: 'demo-3',
        title: 'Enregistrement Répétition',
        description: 'Session de travail',
        url: '/audio/repetition.mp3',
        userEmail: 'musicien@cast.fr',
        userDisplayName: 'Pierre Martin',
        status: 'rejected',
        submittedAt: new Date(Date.now() - 172800000),
        moderatedAt: new Date(),
        rejectionReason: 'Qualité audio insuffisante',
        fileSize: 10240000,
        fileName: 'repetition-audio.mp3'
      }
    ];
  };

  // Calculer les statistiques
  const updateStats = (media) => {
    const stats = {
      pending: media.filter(m => m.status === 'pending').length,
      approved: media.filter(m => m.status === 'approved').length,
      rejected: media.filter(m => m.status === 'rejected').length,
      total: media.length
    };
    setStats(stats);
  };

  // Appliquer les filtres et le tri
  useEffect(() => {
    let filtered = [...allMedia];
    
    if (filter !== 'all') {
      filtered = filtered.filter(media => media.status === filter);
    }
    
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'submittedAt' || sortField === 'moderatedAt') {
        aValue = aValue?.toDate ? aValue.toDate() : new Date(aValue);
        bValue = bValue?.toDate ? bValue.toDate() : new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredMedia(filtered);
    setCurrentPage(1);
  }, [allMedia, filter, sortField, sortDirection]);

  // Charger au démarrage
  useEffect(() => {
    loadAllMedia();
  }, []);

  // Calcul des éléments à afficher
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedia = filteredMedia.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);

  // Fonction utilitaire pour détecter le type de média
  const getMediaTypeFromUrl = (url) => {
    if (!url) return 'document';
    
    const extension = url.split('.').pop().toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const audioTypes = ['mp3', 'wav', 'ogg', 'aac'];
    const videoTypes = ['mp4', 'mpeg', 'webm', 'mov'];
    const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

    if (imageTypes.includes(extension)) return 'image';
    if (audioTypes.includes(extension)) return 'audio';
    if (videoTypes.includes(extension)) return 'video';
    if (documentTypes.includes(extension)) return 'document';
    
    return 'document';
  };

  // Fonction pour obtenir la couleur du badge selon le type
  const getBadgeColor = (mediaType) => {
    switch (mediaType) {
      case 'image': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'audio': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'video': return 'bg-red-100 text-red-800 border border-red-200';
      case 'document': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Fonction pour formater la date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return 'Date invalide';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Fonction pour corriger l'URL Cloudinary
  const getPreviewUrl = (url) => {
    if (!url) return null;
    
    // Si c'est une URL Cloudinary
    if (url.includes('cloudinary.com')) {
      return url;
    }
    
    return url;
  };

  // Fonction pour gérer la prévisualisation
  const handlePreview = async (media) => {
    const previewUrl = getPreviewUrl(media.url);
    const mediaType = getMediaTypeFromUrl(media.url);
    
    // Pour les PDFs et documents, on ouvre dans un nouvel onglet
    if (mediaType === 'document' || mediaType === 'pdf') {
      const newWindow = window.open('', '_blank');
      
      if (previewUrl.includes('cloudinary.com')) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Prévisualisation - ${media.title || 'Document'}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 20px; 
                  text-align: center;
                  background: #f5f5f5;
                }
                .container {
                  max-width: 600px;
                  margin: 50px auto;
                  background: white;
                  padding: 40px;
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .icon { 
                  font-size: 48px; 
                  margin-bottom: 20px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background: #3b82f6;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  margin: 10px;
                  cursor: pointer;
                }
                .button:hover {
                  background: #2563eb;
                }
                .button-secondary {
                  background: #6b7280;
                }
                .button-secondary:hover {
                  background: #4b5563;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="icon">📄</div>
                <h2>${media.title || 'Document PDF'}</h2>
                <p>Ce document nécessite un téléchargement pour être visualisé.</p>
                <p><small>Type: ${mediaType} | Taille: ${moderationService.formatFileSize(media.fileSize)}</small></p>
                <div style="margin-top: 30px;">
                  <a href="${previewUrl}" download="${media.fileName || media.title || 'document'}" class="button">
                    📥 Télécharger le PDF
                  </a>
                  <button onclick="window.close()" class="button button-secondary">
                    ✕ Fermer
                  </button>
                </div>
              </div>
            </body>
          </html>
        `);
      } else {
        newWindow.location.href = previewUrl;
      }
    } 
    else if (mediaType === 'image') {
      window.open(previewUrl, '_blank');
    }
    else {
      setPreviewMedia(media);
    }
  };

  // 🔓 SUPPRESSION DE LA RESTRICTION - Tout le monde peut modérer
  // Fonction pour approuver un média
  const handleApprove = async (mediaId) => {
    try {
      if (currentUser) {
        await updateDoc(doc(db, 'media', mediaId), {
          status: 'approved',
          moderatedAt: new Date(),
          moderatorId: currentUser.uid,
          moderatorEmail: currentUser.email,
          rejectionReason: null
        });
      } else {
        // Mode démo sans Firebase
        setAllMedia(prev => prev.map(media => 
          media.id === mediaId 
            ? { ...media, status: 'approved', moderatedAt: new Date() }
            : media
        ));
      }
      await loadAllMedia();
    } catch (error) {
      console.error('Erreur approbation:', error);
      alert('Erreur lors de l\'approbation: ' + error.message);
    }
  };

  // Fonction pour rejeter un média
  const handleReject = async (mediaId, reason = 'Non conforme') => {
    try {
      if (currentUser) {
        await updateDoc(doc(db, 'media', mediaId), {
          status: 'rejected',
          moderatedAt: new Date(),
          moderatorId: currentUser.uid,
          moderatorEmail: currentUser.email,
          rejectionReason: reason
        });
      } else {
        // Mode démo sans Firebase
        setAllMedia(prev => prev.map(media => 
          media.id === mediaId 
            ? { ...media, status: 'rejected', moderatedAt: new Date(), rejectionReason: reason }
            : media
        ));
      }
      await loadAllMedia();
      setEditingMedia(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Erreur rejet:', error);
      alert('Erreur lors du rejet: ' + error.message);
    }
  };

  // Fonction pour réouvrir un média
  const handleReopen = async (mediaId) => {
    try {
      if (currentUser) {
        await updateDoc(doc(db, 'media', mediaId), {
          status: 'pending',
          moderatedAt: null,
          moderatorId: null,
          rejectionReason: null,
          notes: 'Réouvert par modérateur'
        });
      } else {
        // Mode démo sans Firebase
        setAllMedia(prev => prev.map(media => 
          media.id === mediaId 
            ? { ...media, status: 'pending', moderatedAt: null, rejectionReason: null }
            : media
        ));
      }
      
      await loadAllMedia();
    } catch (error) {
      console.error('Erreur réouverture:', error);
      alert('Erreur lors de la réouverture: ' + error.message);
    }
  };

  // Fonction pour trier les colonnes
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Fonction pour obtenir l'icône de tri
  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // 🔓 SUPPRESSION DU BLOCAGE D'ACCÈS - Tout le monde peut voir la modération
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de la page */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <span className="text-2xl text-white">🛡️</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Modération des Médias
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    🔓 Accès libre - Gérez les médias uploadés par les membres
                  </p>
                  {!currentUser && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        ⚠️ Mode démonstration
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={loadAllMedia}
                disabled={loading}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <span>🔄</span>
                {loading ? 'Chargement...' : 'Actualiser'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
            <div className="text-gray-600 font-medium">⏳ En attente</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.approved}</div>
            <div className="text-gray-600 font-medium">✅ Approuvés</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.rejected}</div>
            <div className="text-gray-600 font-medium">❌ Rejetés</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
            <div className="text-gray-600 font-medium">📊 Total</div>
          </div>
        </div>

        {/* Filtres et contrôles */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Tous les médias ({stats.total})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'pending' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⏳ En attente ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'approved' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✅ Approuvés ({stats.approved})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'rejected' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ❌ Rejetés ({stats.rejected})
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredMedia.length} médias trouvés
            </div>
          </div>
        </div>

        {/* Tableau de modération */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : currentMedia.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {filter === 'pending' ? '🎉' : 
                   filter === 'approved' ? '📁' : 
                   filter === 'rejected' ? '📭' : '📊'}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === 'pending' ? 'Aucun média en attente' :
                   filter === 'approved' ? 'Aucun média approuvé' :
                   filter === 'rejected' ? 'Aucun média rejeté' : 'Aucun média trouvé'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {filter === 'all' ? 'Commencez par uploader des médias' :
                   'Tous les médias ont été traités !'}
                </p>
                <button
                  onClick={loadAllMedia}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Actualiser
                </button>
              </div>
            ) : (
              <>
                {/* Tableau */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('userEmail')}
                        >
                          <div className="flex items-center gap-2">
                            👤 Utilisateur {getSortIcon('userEmail')}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          📁 Type
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('submittedAt')}
                        >
                          <div className="flex items-center gap-2">
                            📅 Date Upload {getSortIcon('submittedAt')}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          📝 Titre
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-2">
                            🟡 Statut {getSortIcon('status')}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          ⚡ Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMedia.map((media) => (
                        <tr key={media.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">👤</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {media.userEmail || media.uploadedBy || 'Utilisateur inconnu'}
                                </div>
                                {media.userDisplayName && (
                                  <div className="text-xs text-gray-500">
                                    {media.userDisplayName}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(getMediaTypeFromUrl(media.url))}`}>
                              {getMediaTypeFromUrl(media.url)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              {formatDate(media.submittedAt)}
                            </div>
                            {media.moderatedAt && (
                              <div className="text-xs text-gray-500">
                                Mod: {formatDate(media.moderatedAt)}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={media.title}>
                              {media.title || 'Sans titre'}
                            </div>
                            {media.description && (
                              <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={media.description}>
                                {media.description}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(media.status)}`}>
                              {media.status === 'pending' && '⏳ En attente'}
                              {media.status === 'approved' && '✅ Approuvé'}
                              {media.status === 'rejected' && '❌ Rejeté'}
                            </span>
                            {media.rejectionReason && (
                              <div className="text-xs text-red-600 mt-1 max-w-xs truncate" title={media.rejectionReason}>
                                {media.rejectionReason}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePreview(media)}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                                title="Prévisualiser"
                              >
                                👁️
                              </button>
                              
                              {media.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(media.id)}
                                    className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                                    title="Approuver"
                                  >
                                    ✅
                                  </button>
                                  <button
                                    onClick={() => setEditingMedia(media)}
                                    className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                    title="Rejeter"
                                  >
                                    ❌
                                  </button>
                                </>
                              )}
                              
                              {media.status === 'approved' && (
                                <button
                                  onClick={() => handleReject(media.id, 'Retiré par modérateur')}
                                  className="p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50"
                                  title="Retirer"
                                >
                                  🗑️
                                </button>
                              )}
                              
                              {media.status === 'rejected' && (
                                <button
                                  onClick={() => handleReopen(media.id)}
                                  className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                                  title="Réouvrir"
                                >
                                  🔄
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} sur {totalPages} • 
                      Affichage de {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredMedia.length)} sur {filteredMedia.length} éléments
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded border ${
                          currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Précédent
                      </button>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded border ${
                              currentPage === pageNum
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded border ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal de rejet */}
        {editingMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ❌ Rejeter le média
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Titre:</strong> {editingMedia.title || 'Sans titre'}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Utilisateur:</strong> {editingMedia.userEmail || 'Inconnu'}
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du rejet:
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez une raison</option>
                  <option value="Qualité insuffisante">Qualité insuffisante</option>
                  <option value="Contenu inapproprié">Contenu inapproprié</option>
                  <option value="Hors sujet">Hors sujet</option>
                  <option value="Doublon">Doublon</option>
                  <option value="Format non supporté">Format non supporté</option>
                  <option value="Autre">Autre</option>
                </select>
                
                {rejectionReason === 'Autre' && (
                  <input
                    type="text"
                    placeholder="Précisez la raison..."
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                )}
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setEditingMedia(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleReject(editingMedia.id, rejectionReason || 'Non conforme')}
                  disabled={!rejectionReason}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmer le rejet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de prévisualisation pour audio/vidéo */}
        {previewMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Prévisualisation - {previewMedia.title || 'Média'}
                </h3>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                {getMediaTypeFromUrl(previewMedia.url) === 'audio' && (
                  <audio controls className="w-full">
                    <source src={getPreviewUrl(previewMedia.url)} type="audio/mpeg" />
                    Votre navigateur ne supporte pas l'élément audio.
                  </audio>
                )}
                {getMediaTypeFromUrl(previewMedia.url) === 'video' && (
                  <video controls className="w-full rounded-lg">
                    <source src={getPreviewUrl(previewMedia.url)} type="video/mp4" />
                    Votre navigateur ne supporte pas l'élément vidéo.
                  </video>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaModeration;