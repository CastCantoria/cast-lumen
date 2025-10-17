// src/components/admin/AdminEventForm.jsx
import React, { useState, useEffect } from 'react';
import eventsService from "../../services/eventsService";
import repertoireService from "../../services/repertoireService";
import './AdminEventForm.css';

const AdminEventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endDate: '',
    endTime: '',
    location: '',
    address: '',
    type: 'Concert',
    price: 0,
    capacity: 50,
    status: 'draft',
    featured: false,
    program: []
  });
  const [repertoire, setRepertoire] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const eventTypes = ['Concert', 'R�p�tition', 'Audition', 'Festival', 'C�r�monie'];
  const statusOptions = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'published', label: 'Publi�' },
    { value: 'cancelled', label: 'Annul�' }
  ];

  useEffect(() => {
    loadRepertoire();
    
    if (event) {
      // Pr�-remplir le formulaire avec les donn�es de l'�v�nement existant
      const eventDate = event.date;
      const endDate = event.endDate || eventDate;
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        location: event.location || '',
        address: event.address || '',
        type: event.type || 'Concert',
        price: event.price || 0,
        capacity: event.capacity || 50,
        status: event.status || 'draft',
        featured: event.featured || false,
        program: event.program || []
      });
      
      setSelectedPieces(event.program || []);
    }
  }, [event]);

  const loadRepertoire = async () => {
    try {
      const data = await repertoireService.getAllRepertoire();
      setRepertoire(data);
    } catch (error) {
      console.error('Erreur chargement r�pertoire:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  const handlePieceSelect = (piece) => {
    const pieceText = `${piece.composer} - ${piece.title}`;
    if (!selectedPieces.includes(pieceText)) {
      setSelectedPieces(prev => [...prev, pieceText]);
    }
  };

  const handleRemovePiece = (index) => {
    setSelectedPieces(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Pr�parer les dates
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = formData.endDate ? 
        new Date(`${formData.endDate}T${formData.endTime}`) : 
        new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // +2h par d�faut

      // Upload image si n�cessaire
      let imageUrl = event?.imageUrl || '';
      if (imageFile) {
        imageUrl = await eventsService.uploadEventImage(
          imageFile, 
          `event_${Date.now()}_${imageFile.name}`
        );
      }

      // Pr�parer les donn�es finales
      const eventData = {
        ...formData,
        date: startDateTime,
        endDate: endDateTime,
        program: selectedPieces,
        imageUrl,
        price: parseFloat(formData.price) || 0,
        capacity: parseInt(formData.capacity) || 50
      };

      await onSubmit(eventData);

    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-event-form">
      <div className="form-header">
        <h2>{event ? 'Modifier l\'�v�nement' : 'Nouvel �v�nement'}</h2>
        <button className="btn-close" onClick={onCancel}>�</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-sections">
          {/* Section Informations de base */}
          <section className="form-section">
            <h3>Informations de base</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Titre de l'�v�nement *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type d'�v�nement *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Statut *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  �v�nement en vedette
                </label>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Description d�taill�e de l'�v�nement..."
              />
            </div>
          </section>

          {/* Section Date et Lieu */}
          <section className="form-section">
            <h3>Date et Lieu</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Date de d�but *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Heure de d�but *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date de fin</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Heure de fin</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Lieu *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Nom du lieu"
                />
              </div>

              <div className="form-group full-width">
                <label>Adresse compl�te</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Adresse postale compl�te"
                />
              </div>
            </div>
          </section>

          {/* Section Tarifs et Capacit� */}
          <section className="form-section">
            <h3>Tarifs et Capacit�</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Prix (�)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                <small>Laissez 0 pour gratuit</small>
              </div>

              <div className="form-group">
                <label>Capacit� *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section Programme */}
          <section className="form-section">
            <h3>Programme Musical</h3>
            
            <div className="program-selection">
              <div className="repertoire-list">
                <h4>Ajouter des �uvres du r�pertoire</h4>
                <div className="pieces-grid">
                  {repertoire.slice(0, 10).map(piece => (
                    <button
                      key={piece.id}
                      type="button"
                      className="piece-btn"
                      onClick={() => handlePieceSelect(piece)}
                    >
                      <span className="piece-composer">{piece.composer}</span>
                      <span className="piece-title">{piece.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="selected-pieces">
                <h4>�uvres s�lectionn�es ({selectedPieces.length})</h4>
                {selectedPieces.length === 0 ? (
                  <p className="no-pieces">Aucune �uvre s�lectionn�e</p>
                ) : (
                  <ul className="pieces-list">
                    {selectedPieces.map((piece, index) => (
                      <li key={index} className="piece-item">
                        <span>{piece}</span>
                        <button
                          type="button"
                          className="btn-remove-piece"
                          onClick={() => handleRemovePiece(index)}
                        >
                          �
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Section Image */}
          <section className="form-section">
            <h3>Image de l'�v�nement</h3>
            
            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {event?.imageUrl && !imageFile && (
                <div className="current-image">
                  <img src={event.imageUrl} alt="Current" className="image-preview" />
                  <small>Image actuelle</small>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={uploading}
            className="btn-submit"
          >
            {uploading ? 'Sauvegarde...' : (event ? 'Mettre � jour' : 'Cr�er l\'�v�nement')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventForm;

