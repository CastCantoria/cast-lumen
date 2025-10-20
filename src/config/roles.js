// src/config/roles.js
export const ROLES_CONFIG = {
  'super-admin': { permissions: ['all'] },
  'admin': { permissions: ['manage_content', 'manage_users'] },
  'membre': { permissions: ['read_content', 'upload_media'] },
  'contributeur': { permissions: ['read_content', 'comment'] },
  'visiteur': { permissions: ['read_content'] }
};