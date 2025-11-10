import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase'; // ✅ IMPORT CORRIGÉ

export const moderationService = {
  // Soumettre un média pour modération
  async submitMediaForModeration(mediaData) {
    try {
      const moderationDoc = {
        ...mediaData,
        status: 'pending',
        submittedAt: serverTimestamp(),
        moderatedAt: null,
        moderatorId: null,
        rejectionReason: null,
        notes: '',
        fileName: mediaData.fileName || mediaData.title,
        fileSize: mediaData.fileSize || 0,
        mimeType: mediaData.mimeType || '',
        dimensions: mediaData.dimensions || null,
        duration: mediaData.duration || null
      };
      
      console.log('📤 Soumission modération:', moderationDoc);
      
      const docRef = await addDoc(
        collection(db, 'gallery_moderation'), 
        moderationDoc
      );
      
      console.log('✅ Média soumis avec ID:', docRef.id);
      
      return { 
        id: docRef.id, 
        ...moderationDoc,
        public_id: mediaData.publicId,
        secure_url: mediaData.url,
        resource_type: mediaData.type,
        original_filename: mediaData.title
      };
    } catch (error) {
      console.error('❌ Erreur soumission modération:', error);
      throw new Error(`Échec de la soumission: ${error.message}`);
    }
  },

  // Approuver un média
  async approveMedia(mediaId, moderatorId, notes = '') {
    try {
      console.log('✅ Approbation média:', mediaId);
      
      await updateDoc(doc(db, 'gallery_moderation', mediaId), {
        status: 'approved',
        moderatedAt: serverTimestamp(),
        moderatorId,
        notes,
        rejectionReason: null
      });
      
      await this.publishToMainGallery(mediaId);
      
      console.log('✅ Média approuvé:', mediaId);
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
      
      await updateDoc(doc(db, 'gallery_moderation', mediaId), {
        status: 'rejected',
        moderatedAt: serverTimestamp(),
        moderatorId,
        rejectionReason: reason,
        notes
      });
      
      console.log('✅ Média rejeté:', mediaId);
      return true;
    } catch (error) {
      console.error('❌ Erreur rejet:', error);
      throw new Error(`Échec du rejet: ${error.message}`);
    }
  },

  // Récupérer les médias en attente
  async getPendingMedia() {
    try {
      console.log('🔄 Récupération médias en attente...');
      
      const q = query(
        collection(db, 'gallery_moderation'),
        where('status', '==', 'pending'),
        orderBy('submittedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const media = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`📊 ${media.length} médias en attente trouvés`);
      return media;
    } catch (error) {
      console.error('❌ Erreur récupération pending:', error);
      return [];
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
      
      await addDoc(collection(db, 'gallery'), {
        ...mediaData,
        publishedAt: serverTimestamp(),
        views: 0,
        likes: 0,
        approved: true,
        source: 'member'
      });
      
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
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
};

export default moderationService;