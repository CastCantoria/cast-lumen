// src/components/repertoire/RepertoireItem.jsx
import React, { useState } from 'react';
import repertoireService from "../../services/repertoireService";
import './RepertoireItem.css';

const RepertoireItem = ({ item, onUpdate, userRole }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);

  const isAdmin = ['super-admin', 'admin', 'member'].includes(userRole);

  const handleDelete = async () => {
    if (window.confirm(`Supprimer "${item.title}" ?`)) {
      try {
        await repertoireService.deleteRepertoire(item.id);
        onUpdate();
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const handleAudioPlay = () => {
    setPlayingAudio(true);
  };

  const handleAudioEnd = () => {
    setPlayingAudio(false);
  };

  return (
    <div className={`repertoire-item ${item.featured ? 'featured' : ''}`}>
      <div className="repertoire-card">
        {/* En-tête de la carte */}
        <div className="card-header">
          <h3 className="piece-title">{item.title}</h3>
          <p className="piece-composer">{item.composer}</p>
        </div>

        {/* Métadonnées */}
        <div className="card-meta">
          <span className={`badge style-${item.style?.toLowerCase()}`}>
            {item.style}
          </span>
          <span className="badge period">{item.period}</span>
          <span className="badge difficulty">
            Difficulté: {'?'.repeat(item.difficulty || 1)}
          </span>
          {item.language && (
            <span className="badge language">{item.language}</span>
          )}
        </div>

        {/* Détails supplémentaires */}
        <div className="card-details">
          {item.duration && (
            <p className="duration">?? {item.duration}</p>
          )}
        </div>

        {/* Actions */}
        <div className="card-actions">
          <button 
            className="btn-details"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Masquer' : 'Détails'}
          </button>

          {item.pdfUrl && (
            <a 
              href={item.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-pdf"
            >
              ?? Partition
            </a>
          )}

          {isAdmin && (
            <button 
              className="btn-delete"
              onClick={handleDelete}
            >
              ???
            </button>
          )}
        </div>

        {/* Détails étendus */}
        {showDetails && (
          <div className="card-expanded">
            {item.lyrics && (
              <div className="lyrics-section">
                <h4>Paroles</h4>
                <p className="lyrics">{item.lyrics}</p>
              </div>
            )}

            {item.audioUrl && (
              <div className="audio-section">
                <h4>Extrait audio</h4>
                <audio 
                  controls 
                  onPlay={handleAudioPlay}
                  onEnded={handleAudioEnd}
                  onPause={() => setPlayingAudio(false)}
                >
                  <source src={item.audioUrl} type="audio/mpeg" />
                  Votre navigateur ne supporte pas l'audio.
                </audio>
              </div>
            )}

            {item.videoUrl && (
              <div className="video-section">
                <h4>Vidéo</h4>
                <a href={item.videoUrl} target="_blank" rel="noopener noreferrer">
                  ?? Voir la vidéo
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepertoireItem;
