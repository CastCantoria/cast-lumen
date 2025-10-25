// src/components/admin/AdminBookings.jsx
import React, { useState, useEffect } from 'react';
import eventsService from "../../services/eventsService";
import './AdminBookings.css';

const AdminBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState('all');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Charger tous les �v�nements
      const eventsData = await eventsService.getAllEvents();
      setEvents(eventsData);

      // Charger les r�servations pour chaque �v�nement
      const bookingsPromises = eventsData.map(async (event) => {
        const eventBookings = await eventsService.getEventBookings(event.id);
        return eventBookings.map(booking => ({
          ...booking,
          eventTitle: event.title,
          eventDate: event.date,
          eventId: event.id
        }));
      });

      const allBookingsArrays = await Promise.all(bookingsPromises);
      const flattenedBookings = allBookingsArrays.flat();
      
      setAllBookings(flattenedBookings);

    } catch (error) {
      console.error('Erreur chargement donn�es:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filterEvent === 'all' 
    ? allBookings 
    : allBookings.filter(booking => booking.eventId === filterEvent);

  const getStats = () => {
    const totalBookings = allBookings.length;
    const totalSeats = allBookings.reduce((sum, b) => sum + b.seats, 0);
    const uniqueAttendees = new Set(allBookings.map(b => b.email)).size;

    return { totalBookings, totalSeats, uniqueAttendees };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="admin-bookings-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des r�servations...</p>
      </div>
    );
  }

  return (
    <div className="admin-bookings">
      <div className="bookings-global-stats">
        <div className="global-stat-card">
          <div className="stat-number">{stats.totalBookings}</div>
          <div className="stat-label">R�servations Total</div>
        </div>
        <div className="global-stat-card">
          <div className="stat-number">{stats.totalSeats}</div>
          <div className="stat-label">Places R�serv�es</div>
        </div>
        <div className="global-stat-card">
          <div className="stat-number">{stats.uniqueAttendees}</div>
          <div className="stat-label">Participants Uniques</div>
        </div>
      </div>

      <div className="bookings-controls">
        <select 
          value={filterEvent} 
          onChange={(e) => setFilterEvent(e.target.value)}
          className="event-filter"
        >
          <option value="all">Tous les �v�nements</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.title} ({event.bookedSeats} r�s.)
            </option>
          ))}
        </select>
      </div>

      <div className="global-bookings-list">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings-global">
            <p>Aucune r�servation trouv�e</p>
          </div>
        ) : (
          <div className="bookings-table-global">
            <div className="table-header">
              <div className="col-event">�v�nement</div>
              <div className="col-attendee">Participant</div>
              <div className="col-contact">Contact</div>
              <div className="col-seats">Places</div>
              <div className="col-date">Date R�servation</div>
            </div>

            <div className="table-body">
              {filteredBookings.map(booking => (
                <div key={`${booking.eventId}-${booking.id}`} className="table-row">
                  <div className="col-event">
                    <div className="event-title">{booking.eventTitle}</div>
                    <div className="event-date">
                      {booking.eventDate.toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="col-attendee">
                    <strong>{booking.firstName} {booking.lastName}</strong>
                  </div>

                  <div className="col-contact">
                    <div>{booking.email}</div>
                    {booking.phone && <div className="phone">{booking.phone}</div>}
                  </div>

                  <div className="col-seats">
                    <span className="seats-badge">{booking.seats}</span>
                  </div>

                  <div className="col-date">
                    {booking.bookedAt?.toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;

