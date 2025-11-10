export const GALLERY_MODERATION_SCHEMA = {
  media: {
    status: ['pending', 'approved', 'rejected'],
    rejectionReasons: [
      'quality',
      'inappropriate', 
      'copyright',
      'off_topic',
      'other'
    ]
  }
};

export const MODERATION_ROLES = {
  moderator: ['approve_media', 'reject_media', 'view_pending'],
  admin: ['approve_media', 'reject_media', 'view_pending', 'delete_media']
};

export const MODERATION_SETTINGS = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'audio/mp3', 'audio/wav'],
  autoApproveMembers: ['admin', 'moderator'], // Les médias de ces rôles sont auto-approuvés
  retentionDays: {
    approved: 365,
    rejected: 30
  }
};