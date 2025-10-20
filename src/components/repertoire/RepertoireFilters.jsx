// src/components/repertoire/RepertoireFilters.jsx
import React, { useState } from 'react';
import './RepertoireFilters.css';

const RepertoireFilters = ({ onFilterChange, repertoireCount }) => {
  const [filters, setFilters] = useState({
    style: '',
    period: '',
    difficulty: '',
    language: '',
    search: ''
  });

  const styles = ['Sacré', 'Classique', 'Contemporain', 'Jazz', 'Traditionnel'];
  const periods = ['Médiéval', 'Renaissance', 'Baroque', 'Classique', 'Romantique', 'Moderne', 'Contemporain'];
  const languages = ['Latin', 'Français', 'Allemand', 'Italien', 'Anglais', 'Espagnol'];
  const difficulties = [1, 2, 3, 4, 5];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      style: '',
      period: '',
      difficulty: '',
      language: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="repertoire-filters">
      <div className="filters-header">
        <h3>Filtrer le répertoire</h3>
        <span className="results-count">{repertoireCount} œuvres</span>
      </div>

      <div className="filters-grid">
        {/* Recherche texte */}
        <div className="filter-group">
          <label>Recherche</label>
          <input
            type="text"
            placeholder="Titre, compositeur..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        {/* Style musical */}
        <div className="filter-group">
          <label>Style musical</label>
          <select
            value={filters.style}
            onChange={(e) => handleFilterChange('style', e.target.value)}
          >
            <option value="">Tous les styles</option>
            {styles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        {/* Période */}
        <div className="filter-group">
          <label>Période</label>
          <select
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
          >
            <option value="">Toutes les périodes</option>
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
        </div>

        {/* Langue */}
        <div className="filter-group">
          <label>Langue</label>
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
          >
            <option value="">Toutes les langues</option>
            {languages.map(language => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </div>

        {/* Difficulté */}
        <div className="filter-group">
          <label>Difficulté</label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="">Toutes difficultés</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff} {diff === 1 ? '★' : '★'.repeat(diff)}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton reset */}
        <div className="filter-group">
          <button onClick={clearFilters} className="btn-clear-filters">
            Effacer les filtres
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepertoireFilters;