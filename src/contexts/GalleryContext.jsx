import React, { createContext, useContext, useState, useMemo } from 'react';

// ✅ Création et export du contexte
export const GalleryContext = createContext();

// ✅ Hook personnalisé pour utiliser le contexte
export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

// ✅ Provider component
export const GalleryProvider = ({ children }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Valeur du contexte
  const value = useMemo(() => ({
    // État
    selectedMedia,
    filter,
    searchQuery,
    
    // Setters
    setSelectedMedia,
    setFilter,
    setSearchQuery,
    
    // Méthodes utilitaires
    clearFilters: () => {
      setFilter('all');
      setSearchQuery('');
    }
  }), [selectedMedia, filter, searchQuery]);

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

// ✅ Export default pour compatibilité
export default GalleryContext;