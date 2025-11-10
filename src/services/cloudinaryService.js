import { moderationService } from './moderationService';

// ✅ Service principal avec export named
export const cloudinaryService = {
  async uploadMedia(file, metadata = {}) {
    try {
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
      
      // Soumettre à la modération
      const moderationData = {
        ...metadata,
        url: result.secure_url,
        type: result.resource_type,
        title: result.original_filename,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        uploadedBy: metadata.userId || 'anonymous',
        dimensions: result.width && result.height ? {
          width: result.width,
          height: result.height
        } : null,
        duration: result.duration || null,
        cloudinaryData: {
          public_id: result.public_id,
          version: result.version,
          signature: result.signature
        }
      };
      
      // Vérifier si l'utilisateur peut auto-approuver
      if (metadata.userRole && moderationService.canAutoApprove(metadata.userRole)) {
        console.log('🔄 Auto-approbation pour le rôle:', metadata.userRole);
        await moderationService.approveMedia(
          (await moderationService.submitMediaForModeration(moderationData)).id,
          metadata.userId || 'system',
          'Auto-approuvé (rôle privilégié)'
        );
        
        return {
          ...result,
          status: 'approved'
        };
      } else {
        await moderationService.submitMediaForModeration(moderationData);
        
        return {
          ...result,
          status: 'pending'
        };
      }
      
    } catch (error) {
      console.error('❌ Erreur upload Cloudinary:', error);
      throw new Error(`Échec de l'upload: ${error.message}`);
    }
  },

  async deleteMedia(publicId) {
    try {
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

      return await response.json();
    } catch (error) {
      console.error('Cloudinary delete error:', error);
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
  }
};

// ✅ Export default pour compatibilité
export default cloudinaryService;