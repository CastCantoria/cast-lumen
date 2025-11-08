// src/components/events/EventsList.jsx
import React, { useState } from 'react';
import './EventsList.css';

const EventsList = ({ events, onEventSelect, onBookEvent }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

  const now = new Date();
  
  const filteredEvents = events.filter(event => {
    if (filter === 'upcoming') return event.date >= now;
    if (filter === 'past') return event.date < now;
    return true;
  });

  const getEventStatus = (event) => {
    if (event.date < now) return 'past';
    if (event.bookedSeats >= event.capacity) return 'soldout';
    return 'available';
  };

  return (
    <div className="events-list">
      <div className="list-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous les événements
          </button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            À venir
          </button>
          <button 
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Passés
          </button>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => {
          const status = getEventStatus(event);
          
          return (
            <div key={event.id} className={`event-card ${status}`}>
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <span className={`event-status ${status}`}>
                  {status === 'past' && 'Terminé'}
                  {status === 'soldout' && 'Complet'}
                  {status === 'available' && 'Places disponibles'}
                </span>
              </div>

              <div className="event-meta">
                <p className="event-date">
                  🗓️ {event.date.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="event-location">📍 {event.location}</p>
                <p className="event-type">🎵 {event.type}</p>
                {event.price > 0 && (
                  <p className="event-price">💰 {event.price}€</p>
                )}
              </div>

              {event.description && (
                <p className="event-description">
                  {event.description.length > 150 
                    ? `${event.description.substring(0, 150)}...` 
                    : event.description
                  }
                </p>
              )}

              <div className="event-capacity">
                <div className="capacity-bar">
                  <div 
                    className="capacity-fill"
                    style={{
                      width: `${Math.min(100, (event.bookedSeats / event.capacity) * 100)}%`
                    }}
                  ></div>
                </div>
                <span className="capacity-text">
                  {event.bookedSeats} / {event.capacity} places réservées
                </span>
              </div>

              <div className="event-actions">
                <button 
                  className="btn-details"
                  onClick={() => onEventSelect(event)}
                >
                  Détails
                </button>
                
                {status === 'available' && (
                  <button 
                    className="btn-book"
                    onClick={() => onBookEvent(event)}
                  >
                    Réserver
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="no-events">
          <h3>Aucun événement trouvé</h3>
          <p>Modifiez vos filtres pour voir plus d'événements</p>
        </div>
      )}
    </div>
  );
};

export default EventsList;