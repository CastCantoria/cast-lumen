// src/components/gallery/FilterTags.jsx
import React from 'react';
import { useGallery } from '../../contexts/GalleryContext';

const FilterTags = () => {
  const { filter, setFilter, searchQuery, setSearchQuery } = useGallery();

  const filters = [
    { key: 'all', label: '🎭 Tous les médias' },
    { key: 'image', label: '🖼️ Photos' },
    { key: 'video', label: '🎬 Vidéos' },
    { key: 'audio', label: '🎵 Audio' }
  ];

  const categories = [
    { key: 'concerts', label: '🎵 Concerts', color: 'bg-blue-500' },
    { key: 'spiritualite', label: '🙏 Spiritualité', color: 'bg-purple-500' },
    { key: 'repetitions', label: '🎻 Répétitions', color: 'bg-green-500' },
    { key: 'backstage', label: '🌟 Backstage', color: 'bg-yellow-500' }
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Rechercher un média, un tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-cast-green rounded-lg focus:outline-none focus:border-cast-gold transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cast-green"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filtres par type */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-cast-green mb-3">Type de média</h3>
        <div className="flex flex-wrap gap-2">
          {filters.map((filterItem) => (
            <button
              key={filterItem.key}
              onClick={() => setFilter(filterItem.key)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                filter === filterItem.key
                  ? 'bg-cast-gold text-cast-green shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catégories thématiques */}
      <div>
        <h3 className="text-lg font-bold text-cast-green mb-3">Catégories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSearchQuery(category.key)}
              className={`px-4 py-2 rounded-full text-white font-semibold transition-all duration-300 ${
                searchQuery === category.key
                  ? 'shadow-lg transform scale-105 ring-2 ring-white ring-opacity-50'
                  : 'opacity-90 hover:opacity-100'
              } ${category.color}`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset filters */}
      {(filter !== 'all' || searchQuery) && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="text-cast-green hover:text-cast-gold font-semibold transition-colors"
          >
            ↺ Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterTags;