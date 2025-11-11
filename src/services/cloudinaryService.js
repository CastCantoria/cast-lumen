import { moderationService } from './moderationService';
import { ensureSafeFirestoreData } from '../lib/firebase';

// ✅ Service principal avec export named
export const cloudinaryService = {
  async uploadMedia(file, metadata = {}) {
    try {
      console.log('📤 Début upload Cloudinary:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        metadata: metadata
      });

      // Upload vers Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'cast-media');
      formData.append('cloud_name', 'dqzyuz3gu');

      if (metadata.tags) {
        formData.append('tags', metadata.tags.join(','));
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dqzyuz3gu/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      console.log('✅ Upload Cloudinary réussi:', {
        public_id: result.public_id,
        url: result.secure_url,
        type: result.resource_type,
        size: result.bytes
      });
      
      // Données garanties sans undefined pour la modération
      const safeMetadata = ensureSafeFirestoreData({
        // Valeurs par défaut critiques
        userRole: 'user',
        userId: 'anonymous',
        userEmail: 'unknown@example.com',
        userDisplayName: 'Utilisateur',
        // Surcharger avec les métadonnées fournies
        ...metadata
      });
      
      // Soumettre à la modération
      const moderationData = {
        ...safeMetadata,
        url: result.secure_url,
        type: result.resource_type,
        title: result.original_filename,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        uploadedBy: safeMetadata.userId,
        dimensions: result.width && result.height ? {
          width: result.width,
          height: result.height
        } : null,
        duration: result.duration || null,
        cloudinaryData: {
          public_id: result.public_id,
          version: result.version,
          signature: result.signature
        },
        // Champs supplémentaires pour la modération
        fileName: result.original_filename,
        fileSize: result.bytes,
        mimeType: file.type,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      
      console.log('📤 Données modération préparées:', moderationData);

      // Vérifier si l'utilisateur peut auto-approuver
      if (safeMetadata.userRole && moderationService.canAutoApprove(safeMetadata.userRole)) {
        console.log('🔄 Auto-approbation pour le rôle:', safeMetadata.userRole);
        
        const moderationResult = await moderationService.submitMediaForModeration(moderationData);
        
        await moderationService.approveMedia(
          moderationResult.id,
          safeMetadata.userId || 'system',
          'Auto-approuvé (rôle privilégié)'
        );
        
        return {
          ...result,
          status: 'approved',
          moderationId: moderationResult.id
        };
      } else {
        const moderationResult = await moderationService.submitMediaForModeration(moderationData);
        
        return {
          ...result,
          status: 'pending',
          moderationId: moderationResult.id
        };
      }
      
    } catch (error) {
      console.error('❌ Erreur upload Cloudinary:', error);
      throw new Error(`Échec de l'upload: ${error.message}`);
    }
  },

  async deleteMedia(publicId) {
    try {
      console.log('🗑️ Suppression Cloudinary:', publicId);
      
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('upload_preset', 'cast-media');
      formData.append('cloud_name', 'dqzyuz3gu');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dqzyuz3gu/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Suppression Cloudinary réussie:', result);
      return result;
    } catch (error) {
      console.error('❌ Cloudinary delete error:', error);
      throw error;
    }
  },

  getOptimizedUrl(publicId, options = {}) {
    const {
      width = 800,
      height = 600,
      quality = 'auto',
      format = 'auto'
    } = options;

    return `https://res.cloudinary.com/dqzyuz3gu/image/upload/c_fill,w_${width},h_${height},q_${quality},f_${format}/${publicId}`;
  },

  // Nouvelle méthode pour obtenir l'URL de prévisualisation
  getPreviewUrl(publicId) {
    return `https://res.cloudinary.com/dqzyuz3gu/image/upload/c_limit,w_400/${publicId}`;
  },

  // Méthode pour obtenir l'URL originale
  getOriginalUrl(publicId) {
    return `https://res.cloudinary.com/dqzyuz3gu/image/upload/${publicId}`;
  }
};

// ✅ Export default pour compatibilité
export default cloudinaryService;