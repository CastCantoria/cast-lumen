// src/components/events/EventBooking.jsx
import React, { useState } from 'react';
import eventsService from "../../services/eventsService";
import { useAuth } from '../../contexts/AuthContext';
import './EventBooking.css';

const EventBooking = ({ event, onComplete, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    seats: 1,
    notes: ''
  });
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Pr�-remplir avec les infos utilisateur connect�
  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || '',
        // On pourrait r�cup�rer le profil utilisateur pour pr�-remplir nom/pr�nom
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        ...formData,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        userId: currentUser?.uid || 'anonymous'
      };

      const bookingId = await eventsService.bookSeat(event.id, bookingData);
      setBooking({ id: bookingId, ...bookingData });
      
    } catch (error) {
      console.error('Erreur r�servation:', error);
      alert(`Erreur lors de la r�servation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (booking) {
    return (
      <div className="booking-confirmation">
        <div className="confirmation-header">
          <div className="success-icon">?</div>
          <h2>R�servation Confirm�e !</h2>
        </div>
        
        <div className="booking-details">
          <h3>D�tails de votre r�servation</h3>
          <p><strong>R�f�rence:</strong> {booking.id}</p>
          <p><strong>�v�nement:</strong> {booking.eventTitle}</p>
          <p><strong>Date:</strong> {booking.eventDate.toLocaleDateString('fr-FR')}</p>
          <p><strong>Nom:</strong> {booking.firstName} {booking.lastName}</p>
          <p><strong>Email:</strong> {booking.email}</p>
          <p><strong>Places:</strong> {booking.seats}</p>
        </div>

        <div className="confirmation-actions">
          <button className="btn-print" onClick={() => window.print()}>
            ?? Imprimer
          </button>
          <button className="btn-done" onClick={onComplete}>
            Terminer
          </button>
        </div>
      </div>
    );
  }

  const availableSeats = event.capacity - event.bookedSeats;

  return (
    <div className="event-booking">
      <div className="booking-header">
        <h2>R�server pour "{event.title}"</h2>
        <button className="btn-close" onClick={onCancel}>�</button>
      </div>

      <div className="event-summary">
        <p><strong>Date:</strong> {event.date.toLocaleDateString('fr-FR')}</p>
        <p><strong>Lieu:</strong> {event.location}</p>
        <p><strong>Places disponibles:</strong> {availableSeats}</p>
        {event.price > 0 && <p><strong>Prix:</strong> {event.price}� par place</p>}
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Pr�nom *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nom *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>T�l�phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Nombre de places *</label>
          <select
            name="seats"
            value={formData.seats}
            onChange={handleInputChange}
            required
          >
            {[...Array(Math.min(availableSeats, 10))].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} place{i + 1 > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Notes suppl�mentaires</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            placeholder="Allergies, besoins particuliers..."
          />
        </div>

        <div className="booking-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={loading || availableSeats === 0}
            className="btn-confirm"
          >
            {loading ? 'R�servation...' : 'Confirmer la r�servation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventBooking;

