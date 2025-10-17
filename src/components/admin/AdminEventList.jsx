// src/components/admin/AdminEventList.jsx
import React, { useState } from 'react';
import './AdminEventList.css';

const AdminEventList = ({ events, onEdit, onDelete, onViewBookings, canEdit }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft', 'cancelled'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'created'

  const now = new Date();

  const filteredEvents = events.filter(event => {
    if (filter === 'published') return event.status === 'published';
    if (filter === 'draft') return event.status === 'draft';
    if (filter === 'cancelled') return event.status === 'cancelled';
    if (filter === 'upcoming') return event.status === 'published' && event.date >= now;
    if (filter === 'past') return event.date < now;
    return true;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'bookings':
        return b.bookedSeats - a.bookedSeats;
      default: // date
        return new Date(a.date) - new Date(b.date);
    }
  });

  const getEventStatus = (event) => {
    if (event.status === 'draft') return 'draft';
    if (event.status === 'cancelled') return 'cancelled';
    if (event.date < now) return 'past';
    if (event.bookedSeats >= event.capacity) return 'soldout';
    return 'published';
  };

  const getStatusBadge = (event) => {
    const status = getEventStatus(event);
    const statusLabels = {
      draft: { label: 'Brouillon', class: 'draft' },
      published: { label: 'Publié', class: 'published' },
      cancelled: { label: 'Annulé', class: 'cancelled' },
      past: { label: 'Terminé', class: 'past' },
      soldout: { label: 'Complet', class: 'soldout' }
    };

    const statusInfo = statusLabels[status];
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  return (
    <div className="admin-event-list">
      {/* Filtres et tris */}
      <div className="list-controls">
        <div className="filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les événements</option>
            <option value="upcoming">À venir</option>
            <option value="past">Terminés</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
            <option value="cancelled">Annulés</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Trier par date</option>
            <option value="title">Trier par titre</option>
            <option value="created">Trier par création</option>
            <option value="bookings">Trier par réservations</option>
          </select>
        </div>
      </div>

      {/* Tableau des événements */}
      <div className="events-table">
        <div className="table-header">
          <div className="col-title">Événement</div>
          <div className="col-date">Date</div>
          <div className="col-location">Lieu</div>
          <div className="col-status">Statut</div>
          <div className="col-bookings">Réservations</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="table-body">
          {sortedEvents.map(event => (
            <div key={event.id} className="table-row">
              <div className="col-title">
                <div className="event-title">{event.title}</div>
                <div className="event-type">{event.type}</div>
              </div>

              <div className="col-date">
                {event.date.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              <div className="col-location">
                {event.location}
              </div>

              <div className="col-status">
                {getStatusBadge(event)}
              </div>

              <div className="col-bookings">
                <div className="bookings-info">
                  <span className="bookings-count">
                    {event.bookedSeats}/{event.capacity}
                  </span>
                  <div className="bookings-bar">
                    <div 
                      className="bookings-fill"
                      style={{
                        width: `${Math.min(100, (event.bookedSeats / event.capacity) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="col-actions">
                <button 
                  className="btn-action btn-bookings"
                  onClick={() => onViewBookings(event)}
                  title="Voir les réservations"
                >
                  🎫
                </button>

                {canEdit && (
                  <>
                    <button 
                      className="btn-action btn-edit"
                      onClick={() => onEdit(event)}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => onDelete(event.id)}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {sortedEvents.length === 0 && (
          <div className="table-empty">
            <p>Aucun événement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventList;