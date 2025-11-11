import { useState, useEffect } from 'react';
import { moderationService } from '../../services/moderationService';
import { useAuth } from '../../contexts/AuthContext';

const ModerationPanel = () => {
  const [pendingMedia, setPendingMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadPendingMedia();
    loadStats();
  }, []);

  const loadPendingMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Chargement des médias en attente...');
      const media = await moderationService.getPendingMedia();
      console.log('✅ Médias chargés:', media.length);
      setPendingMedia(media);
    } catch (error) {
      console.error('❌ Erreur chargement médias:', error);
      setError('Erreur lors du chargement des médias: ' + error.message);
      setPendingMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statistics = await moderationService.getModerationStats();
      setStats(statistics);
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
      // Garder les stats par défaut
    }
  };

  const handleApprove = async (mediaId) => {
    try {
      setError(null);
      await moderationService.approveMedia(mediaId, currentUser.uid, 'Approuvé par modérateur');
      await loadPendingMedia();
      await loadStats();
      console.log('✅ Média approuvé avec succès');
    } catch (error) {
      console.error('❌ Erreur approbation:', error);
      setError('Erreur lors de l\'approbation: ' + error.message);
    }
  };

  const handleReject = async (mediaId, reason) => {
    if (!reason) {
      setError('Veuillez sélectionner une raison de rejet');
      return;
    }

    try {
      setError(null);
      await moderationService.rejectMedia(mediaId, currentUser.uid, reason, 'Rejeté par modérateur');
      await loadPendingMedia();
      await loadStats();
      console.log('✅ Média rejeté avec succès');
    } catch (error) {
      console.error('❌ Erreur rejet:', error);
      setError('Erreur lors du rejet: ' + error.message);
    }
  };

  const refreshData = () => {
    loadPendingMedia();
    loadStats();
    setError(null);
  };

  // Afficher l'erreur si elle existe
  if (error) {
    return (
      <div className="moderation-panel p-6 bg-white rounded-lg shadow">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="text-red-500 text-lg mr-3">❌</div>
            <div>
              <h3 className="text-red-800 font-semibold">Erreur</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="moderation-panel p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-gray-600">Chargement des médias en attente...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="moderation-panel p-6 bg-white rounded-lg shadow">
      {/* En-tête avec stats et actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🛡️ Modération des Médias</h2>
          <p className="text-gray-600 mt-1">Gérez les médias uploadés par les membres</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
              ⏳ {stats.pending} en attente
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
              ✅ {stats.approved} approuvés
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
              ❌ {stats.rejected} rejetés
            </span>
          </div>
          
          <button
            onClick={refreshData}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>
      
      {/* Liste des médias en attente */}
      <div className="grid gap-4">
        {pendingMedia.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun média en attente</h3>
            <p className="text-gray-500 mb-4">Tous les médias ont été modérés !</p>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Vérifier à nouveau
            </button>
          </div>
        ) : (
          pendingMedia.map(media => (
            <MediaModerationCard
              key={media.id}
              media={media}
              onApprove={handleApprove}
              onReject={handleReject}
              onSelect={setSelectedMedia}
            />
          ))
        )}
      </div>

      {/* Modal de visualisation */}
      {selectedMedia && (
        <MediaPreviewModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

// Composant carte de modération
const MediaModerationCard = ({ media, onApprove, onReject, onSelect }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Date inconnue';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'À l\'instant';
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      if (diffHours < 24) return `Il y a ${diffHours} h`;
      return `Il y a ${diffDays} j`;
    } catch (error) {
      return 'Date invalide';
    }
  };

  const handleApproveClick = async () => {
    setIsProcessing(true);
    try {
      await onApprove(media.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = async () => {
    if (!rejectionReason) return;
    setIsProcessing(true);
    try {
      await onReject(media.id, rejectionReason);
      setRejectionReason('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="media-card border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Prévisualisation */}
        <div 
          className="flex-shrink-0 cursor-pointer group"
          onClick={() => onSelect(media)}
        >
          {media.type === 'image' && (
            <div className="relative">
              <img 
                src={media.url} 
                alt={media.title}
                className="w-20 h-20 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyOEM0My4zMTM3IDI4IDQ2IDMwLjY4NjMgNDYgMzRDNDYgMzcuMzEzNyA0My4zMTM3IDQwIDQwIDQwQzM2LjY4NjMgNDAgMzQgMzcuMzEzNyAzNCAzNEMzNCAzMC42ODYzIDM2LjY4NjMgMjggNDAgMjhaTTQ2IDUySDM0VjQ0TDM4IDQ4TDQyIDQ0TDQ2IDQ4VjUyWiIgZmlsbD0iIzlDQTBCRiIvPgo8L3N2Zz4K';
                }}
              />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 rounded-lg transition-colors"></div>
            </div>
          )}
          {media.type === 'video' && (
            <div className="relative">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <span className="text-gray-600 text-2xl">🎬</span>
              </div>
            </div>
          )}
          {media.type === 'audio' && (
            <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span className="text-blue-600 text-2xl">🎵</span>
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-lg mb-2">
            {media.title || 'Sans titre'}
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Type:</span> 
              <span className="capitalize ml-1">{media.type || 'inconnu'}</span>
              {media.bytes && (
                <span className="ml-2 text-gray-500">
                  ({moderationService.formatFileSize ? moderationService.formatFileSize(media.bytes) : `${Math.round(media.bytes / 1024)} KB`})
                </span>
              )}
            </p>
            <p>
              <span className="font-medium">Soumis:</span> 
              <span className="ml-1">{getTimeAgo(media.submittedAt || media.createdAt)}</span>
            </p>
            {media.uploadedBy && (
              <p className="truncate">
                <span className="font-medium">Uploadé par:</span> 
                <span className="ml-1">{media.uploadedBy}</span>
              </p>
            )}
            {media.description && (
              <p className="text-gray-700 mt-2 line-clamp-2">
                {media.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={handleApproveClick}
            disabled={isProcessing}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Traitement...
              </>
            ) : (
              <>
                ✅ Approuver
              </>
            )}
          </button>
          
          <div className="flex gap-2">
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={isProcessing}
              className="flex-grow px-2 py-2 border border-gray-300 rounded text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:bg-gray-100"
            >
              <option value="">Raison...</option>
              <option value="quality">Mauvaise qualité</option>
              <option value="inappropriate">Contenu inapproprié</option>
              <option value="copyright">Problème de copyright</option>
              <option value="off_topic">Hors sujet</option>
              <option value="other">Autre</option>
            </select>
            
            <button
              onClick={handleRejectClick}
              disabled={!rejectionReason || isProcessing}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              title={!rejectionReason ? "Sélectionnez une raison" : "Rejeter"}
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                '❌'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de prévisualisation
const MediaPreviewModal = ({ media, onClose, onApprove, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Date inconnue';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const handleApproveClick = async () => {
    setIsProcessing(true);
    try {
      await onApprove(media.id);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = async () => {
    if (!rejectionReason) return;
    setIsProcessing(true);
    try {
      await onReject(media.id, rejectionReason);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* En-tête du modal */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {media.title || 'Sans titre'}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              Soumis le {getTimeAgo(media.submittedAt || media.createdAt)}
              {media.uploadedBy && ` • Par ${media.uploadedBy}`}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200 ml-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Contenu du média */}
        <div className="p-6 flex-grow overflow-auto">
          <div className="flex justify-center mb-6">
            {media.type === 'image' && (
              <img 
                src={media.url} 
                alt={media.title}
                className="max-w-full max-h-96 object-contain rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTQwQzIyNi41MDkgMTQwIDI0OCAxNjEuNDkxIDI0OCAxODhDMjQ4IDIxNC41MDkgMjI2LjUwOSAyMzYgMjAwIDIzNkMxNzMuNDkxIDIzNiAxNTIgMjE0LjUwOSAxNTIgMTg4QzE1MiAxNjEuNDkxIDE3My40OTEgMTQwIDIwMCAxNDBaTTI0OCAyNTZIMTUyVjIyNEwxNzYgMjMyTDIwNCAyMjRMMjQ4IDIzMlYyNTZaIiBmaWxsPSIjOUNBMEJGIi8+Cjwvc3ZnPgo=';
                }}
              />
            )}
            
            {media.type === 'video' && (
              <div className="w-full max-w-2xl bg-gray-100 rounded-lg flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-gray-600 text-lg font-medium">{media.title || 'Vidéo sans titre'}</p>
                  <p className="text-sm text-gray-500 mt-2">Prévisualisation non disponible - Type: {media.type}</p>
                </div>
              </div>
            )}
            
            {media.type === 'audio' && (
              <div className="w-full max-w-md">
                <div className="bg-blue-50 rounded-lg p-8 text-center border-2 border-blue-200">
                  <div className="text-6xl mb-4">🎵</div>
                  <p className="text-blue-800 font-medium text-lg">{media.title || 'Audio sans titre'}</p>
                  <p className="text-blue-600 text-sm mt-2">Fichier audio • {media.format || 'Format inconnu'}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Métadonnées */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-3 text-gray-900">📋 Informations du média</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium text-gray-700">Type:</span> <span className="capitalize ml-2">{media.type || 'inconnu'}</span></div>
              <div><span className="font-medium text-gray-700">Format:</span> <span className="ml-2">{media.format || 'N/A'}</span></div>
              {media.bytes && (
                <div><span className="font-medium text-gray-700">Taille:</span> <span className="ml-2">{moderationService.formatFileSize ? moderationService.formatFileSize(media.bytes) : `${Math.round(media.bytes / 1024)} KB`}</span></div>
              )}
              <div>
                <span className="font-medium text-gray-700">Statut:</span> 
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En attente</span>
              </div>
              {media.dimensions && (
                <div><span className="font-medium text-gray-700">Dimensions:</span> <span className="ml-2">{media.dimensions.width} × {media.dimensions.height}px</span></div>
              )}
              {media.duration && (
                <div><span className="font-medium text-gray-700">Durée:</span> <span className="ml-2">{Math.round(media.duration)} secondes</span></div>
              )}
            </div>
            {media.description && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="font-medium text-gray-700">Description:</span>
                <p className="text-gray-600 mt-1">{media.description}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions de modération */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-sm text-gray-600">
              🛡️ Action de modération requise
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <button
                onClick={handleApproveClick}
                disabled={isProcessing}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2 min-w-[140px] justify-center"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Approuver
                  </>
                )}
              </button>
              
              <div className="flex gap-2 items-center">
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  disabled={isProcessing}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:bg-gray-100"
                >
                  <option value="">Raison du rejet</option>
                  <option value="quality">Mauvaise qualité</option>
                  <option value="inappropriate">Contenu inapproprié</option>
                  <option value="copyright">Problème de copyright</option>
                  <option value="off_topic">Hors sujet</option>
                  <option value="other">Autre</option>
                </select>
                
                <button
                  onClick={handleRejectClick}
                  disabled={!rejectionReason || isProcessing}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Rejeter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationPanel;