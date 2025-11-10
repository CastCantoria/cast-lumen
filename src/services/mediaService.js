// ✅ Import corrigé
import { cloudinaryService } from './cloudinaryService';

export const mediaService = {
  // Récupérer les médias approuvés
  async getApprovedMedia() {
    try {
      // Pour l'instant, retourner un tableau vide
      // Cette fonction sera implémentée plus tard avec Firestore
      console.log('📁 Récupération des médias approuvés...');
      return [];
    } catch (error) {
      console.error('❌ Erreur récupération médias:', error);
      return [];
    }
  },

  // Uploader un média
  async uploadMedia(file, metadata = {}) {
    try {
      return await cloudinaryService.uploadMedia(file, metadata);
    } catch (error) {
      console.error('❌ Erreur upload média:', error);
      throw error;
    }
  },

  // Supprimer un média
  async deleteMedia(publicId) {
    try {
      return await cloudinaryService.deleteMedia(publicId);
    } catch (error) {
      console.error('❌ Erreur suppression média:', error);
      throw error;
    }
  },

  // Obtenir l'URL optimisée
  getOptimizedUrl(publicId, options = {}) {
    return cloudinaryService.getOptimizedUrl(publicId, options);
  }
};

// ✅ Export default pour compatibilité
export default mediaService;