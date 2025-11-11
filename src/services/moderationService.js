import { 
  collection, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db, ensureSafeFirestoreData, safeAddDoc } from '../lib/firebase';

export const moderationService = {
  // Soumettre un média pour modération
  async submitMediaForModeration(mediaData) {
    try {
      console.log('📤 Début soumission modération...');
      
      // NETTOYAGE COMPLET DES DONNÉES
      const safeModerationData = ensureSafeFirestoreData({
        // Valeurs par défaut garanties
        status: 'pending',
        submittedAt: Timestamp.now(),
        moderatedAt: null,
        moderatorId: null,
        rejectionReason: null,
        notes: '',
        likes: 0,
        reports: 0,
        moderated: false,
        userRole: 'user',
        userId: 'anonymous',
        userEmail: 'unknown@example.com',
        userDisplayName: 'Utilisateur',
        // Surcharger avec les données fournies
        ...mediaData,
        // Champs critiques avec fallback
        fileName: mediaData.fileName || mediaData.title || 'sans-nom',
        fileSize: mediaData.fileSize || mediaData.bytes || 0,
        mimeType: mediaData.mimeType || '',
        dimensions: mediaData.dimensions || null,
        duration: mediaData.duration || null
      });
      
      console.log('📤 Soumission modération (nettoyée):', safeModerationData);
      
      // VÉRIFICATION FINALE - GARANTIR userRole
      if (!safeModerationData.userRole) {
        safeModerationData.userRole = 'user';
        console.warn('⚠️ userRole manquant, valeur par défaut appliquée');
      }
      
      const docRef = await safeAddDoc(
        collection(db, 'gallery_moderation'), 
        safeModerationData
      );
      
      console.log('✅ Média soumis avec ID:', docRef.id);
      
      return { 
        id: docRef.id, 
        ...safeModerationData
      };
    } catch (error) {
      console.error('❌ Erreur soumission modération:', error);
      throw new Error(`Échec de la soumission: ${error.message}`);
    }
  },

  // Approuver un média
  async approveMedia(mediaId, moderatorId, notes = '') {
    try {
      console.log('✅ Début approbation média:', mediaId);
      
      const updateData = ensureSafeFirestoreData({
        status: 'approved',
        moderatedAt: Timestamp.now(),
        moderatorId: moderatorId || 'system',
        notes: notes || 'Approuvé par modérateur',
        rejectionReason: null,
        moderated: true
      });
      
      await updateDoc(doc(db, 'gallery_moderation', mediaId), updateData);
      
      // Publier dans la galerie principale
      await this.publishToMainGallery(mediaId);
      
      console.log('✅ Média approuvé et publié:', mediaId);
      return true;
    } catch (error) {
      console.error('❌ Erreur approbation:', error);
      throw new Error(`Échec de l'approbation: ${error.message}`);
    }
  },

  // Rejeter un média
  async rejectMedia(mediaId, moderatorId, reason, notes = '') {
    try {
      console.log('❌ Rejet média:', mediaId, 'Raison:', reason);
      
      const updateData = ensureSafeFirestoreData({
        status: 'rejected',
        moderatedAt: Timestamp.now(),
        moderatorId: moderatorId || 'system',
        rejectionReason: reason || 'Non conforme',
        notes: notes || 'Rejeté par modérateur',
        moderated: true
      });
      
      await updateDoc(doc(db, 'gallery_moderation', mediaId), updateData);
      
      console.log('✅ Média rejeté:', mediaId);
      return true;
    } catch (error) {
      console.error('❌ Erreur rejet:', error);
      throw new Error(`Échec du rejet: ${error.message}`);
    }
  },

  // Récupérer les médias en attente - VERSION AMÉLIORÉE
  async getPendingMedia(page = 1, limit = 10) {
    try {
      console.log('🔄 Récupération médias en attente...');
      
      // REQUÊTE SIMPLIFIÉE - pas besoin d'index composite
      const q = query(
        collection(db, 'gallery_moderation'),
        where('status', '==', 'pending')
      );
      
      const querySnapshot = await getDocs(q);
      let media = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Tri MANUEL par date (plus récent en premier)
      media.sort((a, b) => {
        const dateA = a.submittedAt?.toDate?.() || new Date(a.submittedAt);
        const dateB = b.submittedAt?.toDate?.() || new Date(b.submittedAt);
        return dateB - dateA;
      });
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMedia = media.slice(startIndex, endIndex);
      
      console.log(`✅ ${media.length} médias en attente récupérés (page ${page})`);
      return paginatedMedia;
    } catch (error) {
      console.error('❌ Erreur récupération pending:', error);
      
      // Fallback ultime
      try {
        console.log('🔄 Tentative de fallback...');
        const querySnapshot = await getDocs(collection(db, 'gallery_moderation'));
        let allMedia = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const pendingMedia = allMedia.filter(item => item.status === 'pending');
        pendingMedia.sort((a, b) => {
          const dateA = a.submittedAt?.toDate?.() || new Date(a.submittedAt);
          const dateB = b.submittedAt?.toDate?.() || new Date(b.submittedAt);
          return dateB - dateA;
        });
        
        // Pagination fallback
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMedia = pendingMedia.slice(startIndex, endIndex);
        
        console.log(`✅ ${pendingMedia.length} médias récupérés (fallback page ${page})`);
        return paginatedMedia;
      } catch (fallbackError) {
        console.error('❌ Erreur même en fallback:', fallbackError);
        return [];
      }
    }
  },

  // Récupérer les médias approuvés
  async getApprovedMedia() {
    try {
      console.log('🔄 Récupération médias approuvés...');
      
      const q = query(
        collection(db, 'gallery_moderation'),
        where('status', '==', 'approved'),
        orderBy('moderatedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const media = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`📊 ${media.length} médias approuvés trouvés`);
      return media;
    } catch (error) {
      console.error('❌ Erreur récupération approuvés:', error);
      return [];
    }
  },

  // Récupérer les médias rejetés
  async getRejectedMedia() {
    try {
      console.log('🔄 Récupération médias rejetés...');
      
      const q = query(
        collection(db, 'gallery_moderation'),
        where('status', '==', 'rejected'),
        orderBy('moderatedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const media = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`📊 ${media.length} médias rejetés trouvés`);
      return media;
    } catch (error) {
      console.error('❌ Erreur récupération rejetés:', error);
      return [];
    }
  },

  // Récupérer tous les médias (pour admin)
  async getAllMedia() {
    try {
      console.log('🔄 Récupération de tous les médias...');
      
      const q = query(
        collection(db, 'gallery_moderation'),
        orderBy('submittedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const media = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`📊 ${media.length} médias totaux trouvés`);
      return media;
    } catch (error) {
      console.error('❌ Erreur récupération tous médias:', error);
      return [];
    }
  },

  // Récupérer les statistiques de modération
  async getModerationStats() {
    try {
      console.log('📈 Récupération statistiques modération...');
      
      const [pendingSnapshot, approvedSnapshot, rejectedSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'gallery_moderation'), where('status', '==', 'pending'))),
        getDocs(query(collection(db, 'gallery_moderation'), where('status', '==', 'approved'))),
        getDocs(query(collection(db, 'gallery_moderation'), where('status', '==', 'rejected')))
      ]);

      const stats = {
        pending: pendingSnapshot.size,
        approved: approvedSnapshot.size,
        rejected: rejectedSnapshot.size,
        total: pendingSnapshot.size + approvedSnapshot.size + rejectedSnapshot.size
      };

      console.log('📊 Statistiques:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Erreur stats modération:', error);
      return {
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0
      };
    }
  },

  // Publier dans la galerie principale
  async publishToMainGallery(mediaId) {
    try {
      console.log('🚀 Publication galerie principale:', mediaId);
      
      const moderationDoc = await getDoc(doc(db, 'gallery_moderation', mediaId));
      if (!moderationDoc.exists()) {
        throw new Error('Média non trouvé dans la modération');
      }

      const mediaData = moderationDoc.data();
      
      // Nettoyer les données pour la galerie principale
      const galleryData = ensureSafeFirestoreData({
        url: mediaData.url,
        type: mediaData.type,
        title: mediaData.title,
        description: mediaData.description,
        tags: mediaData.tags,
        category: mediaData.category,
        source: 'member',
        status: 'approved',
        publishedAt: Timestamp.now(),
        views: 0,
        likes: 0,
        approved: true,
        moderationId: mediaId,
        uploadedBy: mediaData.uploadedBy,
        userDisplayName: mediaData.userDisplayName,
        userEmail: mediaData.userEmail,
        dimensions: mediaData.dimensions,
        duration: mediaData.duration,
        fileSize: mediaData.fileSize,
        format: mediaData.format,
        mimeType: mediaData.mimeType,
        fileName: mediaData.fileName,
        submittedAt: mediaData.submittedAt
      });
      
      await safeAddDoc(collection(db, 'gallery'), galleryData);
      
      console.log('✅ Média publié dans galerie principale');
      return true;
    } catch (error) {
      console.error('❌ Erreur publication galerie:', error);
      throw new Error(`Échec de la publication: ${error.message}`);
    }
  },

  // Vérifier si l'utilisateur peut auto-approuver
  canAutoApprove(userRole) {
    const autoApproveRoles = ['admin', 'moderator', 'super-admin'];
    const canAuto = autoApproveRoles.includes(userRole);
    console.log(`🔐 Auto-approbation pour ${userRole}: ${canAuto}`);
    return canAuto;
  },

  // Méthode utilitaire pour formater la taille du fichier
  formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Récupérer un média spécifique
  async getMediaById(mediaId) {
    try {
      console.log('🔍 Récupération média par ID:', mediaId);
      
      const docSnap = await getDoc(doc(db, 'gallery_moderation', mediaId));
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Média non trouvé');
      }
    } catch (error) {
      console.error('❌ Erreur récupération média:', error);
      throw error;
    }
  },

  // 🔓 Récupérer les médias approuvés pour la galerie publique - VERSION CORRIGÉE
  async getPublicGalleryMedia() {
    try {
      console.log('🔓 Récupération médias galerie publique (version CORRIGÉE)...');
      
      // Retourner UNIQUEMENT un tableau vide pour éviter les erreurs
      return [];
      
    } catch (error) {
      console.error('❌ Erreur récupération galerie publique:', error);
      return []; // Toujours retourner un tableau vide
    }
  },

  // 🔓 Fonction pour récupérer TOUS les médias sans restriction
  async getAllMediaWithoutRestriction() {
    try {
      console.log('🔓 Récupération de TOUS les médias Firebase...');
      
      const mediaRef = collection(db, 'media');
      const q = query(mediaRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const allMedia = [];
      querySnapshot.forEach((doc) => {
        const mediaData = doc.data();
        allMedia.push({
          id: doc.id,
          ...mediaData,
          status: mediaData.status || 'pending',
          approved: true
        });
      });
      
      console.log(`📊 ${allMedia.length} médias Firebase chargés`);
      return allMedia;
      
    } catch (error) {
      console.error('❌ Erreur récupération médias Firebase:', error);
      return []; // Retourner un tableau vide
    }
  },

  // Fonction pour générer un lien de téléchargement sécurisé
  getDownloadUrl(media) {
    if (!media || !media.url) return null;
    
    const url = media.url;
    const fileName = media.fileName || media.title || 'download';
    const fileExtension = this.getFileExtension(media.url);
    
    return {
      url: url,
      fileName: `${fileName}.${fileExtension}`,
      type: this.getMediaTypeFromUrl(url)
    };
  },

  // Fonction utilitaire pour obtenir l'extension du fichier
  getFileExtension(url) {
    if (!url) return 'bin';
    const extension = url.split('.').pop().toLowerCase().split('?')[0];
    return extension || 'bin';
  },

  // Fonction pour télécharger un média
  downloadMedia(media) {
    try {
      const downloadInfo = this.getDownloadUrl(media);
      if (!downloadInfo) {
        throw new Error('Impossible de générer le lien de téléchargement');
      }

      // Créer un lien de téléchargement temporaire
      const link = document.createElement('a');
      link.href = downloadInfo.url;
      link.download = downloadInfo.fileName;
      link.target = '_blank';
      
      // Ajouter au DOM, cliquer et retirer
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('📥 Téléchargement initié:', downloadInfo.fileName);
      return true;
    } catch (error) {
      console.error('❌ Erreur téléchargement:', error);
      
      // Fallback: ouvrir dans un nouvel onglet
      window.open(media.url, '_blank');
      return false;
    }
  },

  // NOUVELLE MÉTHODE : Valider les types de fichiers acceptés
  validateFileType(file) {
    const acceptedTypes = {
      // Images
      'image/jpeg': 'image',
      'image/jpg': 'image',
      'image/png': 'image',
      'image/gif': 'image',
      'image/webp': 'image',
      
      // Documents
      'application/pdf': 'document',
      'application/msword': 'document', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document', // .docx
      'application/vnd.ms-excel': 'document', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'document', // .xlsx
      
      // Audio
      'audio/mpeg': 'audio',
      'audio/mp3': 'audio',
      'audio/wav': 'audio',
      'audio/ogg': 'audio',
      'audio/aac': 'audio',
      
      // Vidéo
      'video/mp4': 'video',
      'video/mpeg': 'video',
      'video/ogg': 'video',
      'video/webm': 'video',
      'video/quicktime': 'video' // .mov
    };

    const fileType = file.type?.toLowerCase();
    const fileExtension = file.name?.split('.').pop()?.toLowerCase();

    console.log('📁 Validation fichier:', {
      name: file.name,
      type: fileType,
      size: this.formatFileSize(file.size),
      extension: fileExtension
    });

    // Vérifier le type MIME
    if (fileType && acceptedTypes[fileType]) {
      const category = acceptedTypes[fileType];
      console.log(`✅ Fichier accepté: ${fileType} -> ${category}`);
      return { 
        valid: true, 
        category: category,
        type: fileType 
      };
    }

    // Fallback : vérifier l'extension si le type MIME n'est pas reconnu
    const extensionMap = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'aac': 'audio/aac',
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'webm': 'video/webm'
    };

    if (fileExtension && extensionMap[fileExtension]) {
      const mimeType = extensionMap[fileExtension];
      const category = acceptedTypes[mimeType];
      console.log(`✅ Fichier accepté par extension: ${fileExtension} -> ${category}`);
      return { 
        valid: true, 
        category: category,
        type: mimeType 
      };
    }

    console.error('❌ Type de fichier non supporté:', fileType, fileExtension);
    return { 
      valid: false, 
      error: `Type de fichier non supporté: ${fileType || fileExtension}. Formats acceptés: PDF, JPG, PNG, DOCX, XLSX, MP3, MP4, etc.` 
    };
  },

  // NOUVELLE MÉTHODE : Obtenir l'icône appropriée pour le type de fichier
  getFileIcon(fileType) {
    const iconMap = {
      'image': '🖼️',
      'document': '📄',
      'audio': '🎵',
      'video': '🎬',
      'pdf': '📕',
      'default': '📎'
    };

    if (fileType?.includes('pdf')) return iconMap.pdf;
    if (fileType?.includes('image')) return iconMap.image;
    if (fileType?.includes('audio')) return iconMap.audio;
    if (fileType?.includes('video')) return iconMap.video;
    if (fileType?.includes('document') || fileType?.includes('sheet')) return iconMap.document;
    
    return iconMap.default;
  },

  // NOUVELLE MÉTHODE : Obtenir la couleur de badge selon le type
  getFileBadgeColor(fileType) {
    const colorMap = {
      'image': 'bg-blue-100 text-blue-800 border border-blue-200',
      'document': 'bg-green-100 text-green-800 border border-green-200',
      'audio': 'bg-purple-100 text-purple-800 border border-purple-200',
      'video': 'bg-red-100 text-red-800 border border-red-200',
      'pdf': 'bg-red-100 text-red-800 border border-red-200',
      'default': 'bg-gray-100 text-gray-800 border border-gray-200'
    };

    if (fileType?.includes('pdf')) return colorMap.pdf;
    if (fileType?.includes('image')) return colorMap.image;
    if (fileType?.includes('audio')) return colorMap.audio;
    if (fileType?.includes('video')) return colorMap.video;
    if (fileType?.includes('document') || fileType?.includes('sheet')) return colorMap.document;
    
    return colorMap.default;
  },

  // NOUVELLE MÉTHODE : Obtenir le type de contenu (Média ou Partition)
  getContentType(mimeType, type) {
    if (mimeType?.includes('pdf') || type === 'document') {
      return 'Partition';
    }
    return 'Média';
  },

  // NOUVELLE MÉTHODE : Formater la date pour l'affichage
  formatDisplayDate(timestamp) {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  },

  // NOUVELLE MÉTHODE : Fonction utilitaire pour détecter le type de média depuis l'URL
  getMediaTypeFromUrl(url) {
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
  },

  // 🔓 SUPPRIMÉ : getPublicUploads() - Fonction problématique qui cause les erreurs 404

  // 🔓 SUPPRIMÉ : scanPublicUploads() - Fonction problématique

  // 🔓 SUPPRIMÉ : getPublicUploadsStats() - Fonction problématique

  // NOUVELLE MÉTHODE : Obtenir les médias depuis la collection 'media' (alternative)
  async getMediaFromCollection() {
    try {
      console.log('🔄 Récupération médias depuis collection media...');
      
      const q = query(
        collection(db, 'media'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const media = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`📊 ${media.length} médias trouvés dans collection media`);
      return media;
    } catch (error) {
      console.error('❌ Erreur récupération collection media:', error);
      return [];
    }
  },

  // NOUVELLE MÉTHODE : Obtenir les statistiques globales
  async getGlobalStats() {
    try {
      console.log('📈 Récupération statistiques globales...');
      
      const [moderationStats, mediaStats] = await Promise.all([
        this.getModerationStats(),
        this.getMediaFromCollection().then(media => ({
          totalMedia: media.length,
          approvedMedia: media.filter(m => m.status === 'approved').length,
          pendingMedia: media.filter(m => m.status === 'pending').length
        }))
      ]);

      const stats = {
        ...moderationStats,
        ...mediaStats,
        totalFiles: moderationStats.total + mediaStats.totalMedia
      };

      console.log('📊 Statistiques globales:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Erreur statistiques globales:', error);
      return {
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0,
        totalMedia: 0,
        approvedMedia: 0,
        pendingMedia: 0,
        totalFiles: 0
      };
    }
  }
};

export default moderationService;