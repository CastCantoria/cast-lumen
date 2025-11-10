import { useState, useEffect } from 'react';
import { useGallery } from '../../contexts/GalleryContext';

const FilterTags = ({ onFilterChange, allMedia }) => {
  // ✅ Gestion d'erreur pour useGallery
  let galleryContext;
  try {
    galleryContext = useGallery();
  } catch (error) {
    console.warn('⚠️ GalleryContext non disponible, utilisation des props locales');
    galleryContext = {
      filter: 'all',
      setFilter: () => {},
      searchQuery: '',
      setSearchQuery: () => {},
      clearFilters: () => {}
    };
  }

  const { filter, setFilter, searchQuery, setSearchQuery, clearFilters } = galleryContext;
  const [localFilter, setLocalFilter] = useState(filter);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Extraire tous les tags uniques
  const allTags = [...new Set(allMedia.flatMap(media => media.tags || []))];
  const categories = [...new Set(allMedia.map(media => media.category))];

  useEffect(() => {
    const filtered = allMedia.filter(media => {
      const matchesSearch = media.title.toLowerCase().includes(localSearch.toLowerCase()) ||
                          media.description.toLowerCase().includes(localSearch.toLowerCase()) ||
                          media.tags.some(tag => tag.toLowerCase().includes(localSearch.toLowerCase()));
      
      const matchesFilter = localFilter === 'all' || 
                           media.tags.includes(localFilter) ||
                           media.category === localFilter;

      return matchesSearch && matchesFilter;
    });

    onFilterChange(filtered);
  }, [localFilter, localSearch, allMedia, onFilterChange]);

  const handleFilterChange = (newFilter) => {
    setLocalFilter(newFilter);
    setFilter(newFilter);
  };

  const handleSearchChange = (query) => {
    setLocalSearch(query);
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setLocalFilter('all');
    setLocalSearch('');
    setFilter('all');
    setSearchQuery('');
    clearFilters();
  };

  return (
    <div className="filter-tags bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Recherche */}
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un média..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full md:w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              localFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                localFilter === category
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Bouton reset */}
        {(localFilter !== 'all' || localSearch) && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Tags populaires */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tags populaires:</h4>
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 10).map(tag => (
            <button
              key={tag}
              onClick={() => handleFilterChange(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                localFilter === tag
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-4 text-sm text-gray-500">
        {allMedia.length} médias disponibles • 
        Filtre: {localFilter === 'all' ? 'Tous' : localFilter} • 
        {localSearch && ` Recherche: "${localSearch}"`}
      </div>
    </div>
  );
};

export default FilterTags;