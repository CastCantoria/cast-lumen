// src/components/events/EventDetails.jsx
import React from 'react';
import './EventDetails.css';

const EventDetails = ({ event, onBook, onClose }) => {
  const availableSeats = event.capacity - event.bookedSeats;
  const isPast = event.date < new Date();
  const isSoldOut = availableSeats === 0;

  return (
    <div className="event-details">
      <div className="details-header">
        <h2>{event.title}</h2>
        <button className="btn-close" onClick={onClose}>×</button>
      </div>

      {event.imageUrl && (
        <div className="event-image">
          <img src={event.imageUrl} alt={event.title} />
        </div>
      )}

      <div className="details-content">
        <div className="details-meta">
          <div className="meta-item">
            <span className="meta-label">🗓️ Date</span>
            <span className="meta-value">
              {event.date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">📍 Lieu</span>
            <span className="meta-value">{event.location}</span>
            {event.address && (
              <span className="meta-address">{event.address}</span>
            )}
          </div>

          <div className="meta-item">
            <span className="meta-label">🎵 Type</span>
            <span className="meta-value">{event.type}</span>
          </div>

          {event.price > 0 && (
            <div className="meta-item">
              <span className="meta-label">💰 Prix</span>
              <span className="meta-value">{event.price}€</span>
            </div>
          )}

          <div className="meta-item">
            <span className="meta-label">👥 Places</span>
            <span className="meta-value">
              {event.bookedSeats} / {event.capacity} réservées
              {!isPast && (
                <span className={`availability ${isSoldOut ? 'soldout' : 'available'}`}>
                  ({isSoldOut ? 'Complet' : `${availableSeats} disponibles`})
                </span>
              )}
            </span>
          </div>
        </div>

        {event.description && (
          <div className="details-description">
            <h3>Description</h3>
            <p>{event.description}</p>
          </div>
        )}

        {event.program && event.program.length > 0 && (
          <div className="details-program">
            <h3>Programme</h3>
            <ul>
              {event.program.map((piece, index) => (
                <li key={index}>{piece}</li>
              ))}
            </ul>
          </div>
        )}

        {!isPast && !isSoldOut && (
          <div className="details-actions">
            <button className="btn-book-large" onClick={onBook}>
              Réserver maintenant
            </button>
          </div>
        )}

        {isSoldOut && (
          <div className="soldout-notice">
            <p>🚫 Cet événement est complet</p>
          </div>
        )}

        {isPast && (
          <div className="past-notice">
            <p>⏰ Cet événement est terminé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;