// src/contexts/GalleryContext.jsx
import React, { createContext, useContext, useState } from 'react';

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <GalleryContext.Provider value={{
      selectedMedia,
      setSelectedMedia,
      filter,
      setFilter,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};