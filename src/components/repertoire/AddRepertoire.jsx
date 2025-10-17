// src/components/repertoire/AddRepertoire.jsx
import React, { useState } from 'react';
import repertoireService from "../../services/repertoireService";
import './AddRepertoire.css';

const AddRepertoire = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    composer: '',
    style: '',
    period: '',
    difficulty: 1,
    language: '',
    duration: '',
    lyrics: '',
    featured: false
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const styles = ['Sacré', 'Classique', 'Contemporain', 'Jazz', 'Traditionnel'];
  const periods = ['Médiéval', 'Renaissance', 'Baroque', 'Classique', 'Romantique', 'Moderne', 'Contemporain'];
  const languages = ['Latin', 'Français', 'Allemand', 'Italien', 'Anglais', 'Espagnol'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let pdfUrl = '';
      let audioUrl = '';
      let videoUrl = '';

      // Upload PDF
      if (pdfFile) {
        pdfUrl = await repertoireService.uploadPDF(pdfFile, `partition_${Date.now()}.pdf`);
      }

      // Upload Audio
      if (audioFile) {
        audioUrl = await repertoireService.uploadAudio(audioFile, `audio_${Date.now()}.mp3`);
      }

      // Préparation des données finales
      const repertoireData = {
        ...formData,
        difficulty: parseInt(formData.difficulty),
        pdfUrl,
        audioUrl,
        videoUrl: videoFile ? URL.createObjectURL(videoFile) : '' // Pour les URLs vidéo externes
      };

      await onSubmit(repertoireData);
      
      // Reset form
      setFormData({
        title: '',
        composer: '',
        style: '',
        period: '',
        difficulty: 1,
        language: '',
        duration: '',
        lyrics: '',
        featured: false
      });
      setPdfFile(null);
      setAudioFile(null);
      setVideoFile(null);

    } catch (error) {
      console.error('Erreur soumission:', error);
      alert('Erreur lors de l\'ajout de l\'œuvre');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-repertoire-form">
      <h3>Ajouter une nouvelle œuvre</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Titre et Compositeur */}
          <div className="form-group">
            <label>Titre de l'œuvre *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Compositeur *</label>
            <input
              type="text"
              name="composer"
              value={formData.composer}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Style et Période */}
          <div className="form-group">
            <label>Style musical *</label>
            <select
              name="style"
              value={formData.style}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionnez un style</option>
              {styles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Période *</label>
            <select
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionnez une période</option>
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>

          {/* Difficulté et Langue */}
          <div className="form-group">
            <label>Difficulté (1-5)</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
            >
              {[1, 2, 3, 4, 5].map(diff => (
                <option key={diff} value={diff}>
                  {diff} {diff === 1 ? '?' : '?'.repeat(diff)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Langue</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
            >
              <option value="">Sélectionnez une langue</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>

          {/* Durée */}
          <div className="form-group">
            <label>Durée (ex: 3:45)</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="3:45"
            />
          </div>

          {/* Fichiers */}
          <div className="form-group">
            <label>Partition PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>Extrait audio</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>URL Vidéo (optionnel)</label>
            <input
              type="url"
              name="videoUrl"
              placeholder="https://youtube.com/..."
              onChange={handleInputChange}
            />
          </div>

          {/* Paroles */}
          <div className="form-group full-width">
            <label>Paroles</label>
            <textarea
              name="lyrics"
              value={formData.lyrics}
              onChange={handleInputChange}
              rows="4"
              placeholder="Entrez les paroles de l'œuvre..."
            />
          </div>

          {/* Featured */}
          <div className="form-group full-width">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              Œuvre mise en avant
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-cancel"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={uploading}
            className="btn-submit"
          >
            {uploading ? 'Ajout en cours...' : 'Ajouter l\'œuvre'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRepertoire;
